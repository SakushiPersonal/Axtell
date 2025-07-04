/*
  # Tabla de auditoría para tracking de cambios

  1. Nueva Tabla
    - `audit_log`
      - `id` (uuid, primary key)
      - `table_name` (text)
      - `record_id` (uuid)
      - `action` (enum: INSERT, UPDATE, DELETE)
      - `old_values` (jsonb, optional)
      - `new_values` (jsonb, optional)
      - `user_id` (uuid, references user_profiles)
      - `user_email` (text)
      - `ip_address` (inet, optional)
      - `user_agent` (text, optional)
      - `created_at` (timestamp)

  2. Funciones de auditoría automática
  3. Triggers para tablas importantes
*/

-- Crear enum para acciones
CREATE TYPE audit_action AS ENUM ('INSERT', 'UPDATE', 'DELETE');

CREATE TABLE IF NOT EXISTS audit_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  table_name text NOT NULL,
  record_id uuid NOT NULL,
  action audit_action NOT NULL,
  old_values jsonb,
  new_values jsonb,
  user_id uuid REFERENCES user_profiles(id),
  user_email text,
  ip_address inet,
  user_agent text,
  created_at timestamptz DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;

-- Políticas de seguridad
CREATE POLICY "Solo super_admins pueden ver audit log"
  ON audit_log
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() 
      AND role = 'super_admin'
      AND is_active = true
    )
  );

-- Índices para mejor rendimiento
CREATE INDEX idx_audit_log_table_name ON audit_log(table_name);
CREATE INDEX idx_audit_log_record_id ON audit_log(record_id);
CREATE INDEX idx_audit_log_user_id ON audit_log(user_id);
CREATE INDEX idx_audit_log_created_at ON audit_log(created_at);

-- Función genérica de auditoría
CREATE OR REPLACE FUNCTION audit_trigger_function()
RETURNS trigger AS $$
DECLARE
  user_uuid uuid := auth.uid();
  user_email_val text;
BEGIN
  -- Obtener email del usuario
  SELECT email INTO user_email_val 
  FROM auth.users 
  WHERE id = user_uuid;

  IF TG_OP = 'DELETE' THEN
    INSERT INTO audit_log (
      table_name, record_id, action, old_values, user_id, user_email
    ) VALUES (
      TG_TABLE_NAME, OLD.id, 'DELETE', to_jsonb(OLD), user_uuid, user_email_val
    );
    RETURN OLD;
  ELSIF TG_OP = 'UPDATE' THEN
    INSERT INTO audit_log (
      table_name, record_id, action, old_values, new_values, user_id, user_email
    ) VALUES (
      TG_TABLE_NAME, NEW.id, 'UPDATE', to_jsonb(OLD), to_jsonb(NEW), user_uuid, user_email_val
    );
    RETURN NEW;
  ELSIF TG_OP = 'INSERT' THEN
    INSERT INTO audit_log (
      table_name, record_id, action, new_values, user_id, user_email
    ) VALUES (
      TG_TABLE_NAME, NEW.id, 'INSERT', to_jsonb(NEW), user_uuid, user_email_val
    );
    RETURN NEW;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Triggers de auditoría para tablas importantes
CREATE TRIGGER audit_user_profiles
  AFTER INSERT OR UPDATE OR DELETE ON user_profiles
  FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

CREATE TRIGGER audit_properties
  AFTER INSERT OR UPDATE OR DELETE ON properties
  FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

CREATE TRIGGER audit_agents
  AFTER INSERT OR UPDATE OR DELETE ON agents
  FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

CREATE TRIGGER audit_visit_requests
  AFTER INSERT OR UPDATE OR DELETE ON visit_requests
  FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

CREATE TRIGGER audit_appraisal_requests
  AFTER INSERT OR UPDATE OR DELETE ON appraisal_requests
  FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();