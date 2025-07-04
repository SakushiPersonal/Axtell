/*
  # Tabla de solicitudes de visita

  1. Nueva Tabla
    - `visit_requests`
      - `id` (uuid, primary key)
      - `property_id` (uuid, references properties)
      - `client_name` (text)
      - `client_email` (text)
      - `client_phone` (text)
      - `requested_date` (date)
      - `requested_time` (time)
      - `message` (text, optional)
      - `status` (enum: pending, confirmed, cancelled, completed)
      - `notes` (text, optional, para notas del admin)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
      - `created_by` (uuid, optional)
      - `updated_by` (uuid)

  2. Seguridad
    - Enable RLS
    - Políticas para creación pública y gestión admin
*/

-- Crear enum para status
CREATE TYPE visit_status AS ENUM ('pending', 'confirmed', 'cancelled', 'completed');

CREATE TABLE IF NOT EXISTS visit_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id uuid NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  client_name text NOT NULL,
  client_email text NOT NULL,
  client_phone text NOT NULL,
  requested_date date NOT NULL,
  requested_time time NOT NULL,
  message text,
  status visit_status DEFAULT 'pending',
  notes text, -- Notas internas del admin
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES user_profiles(id),
  updated_by uuid REFERENCES user_profiles(id)
);

-- Habilitar RLS
ALTER TABLE visit_requests ENABLE ROW LEVEL SECURITY;

-- Políticas de seguridad
CREATE POLICY "Cualquiera puede crear solicitudes de visita"
  ON visit_requests
  FOR INSERT
  TO authenticated, anon
  WITH CHECK (true);

CREATE POLICY "Los admins pueden ver todas las solicitudes"
  ON visit_requests
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() 
      AND role IN ('admin', 'super_admin')
      AND is_active = true
    )
  );

CREATE POLICY "Los admins pueden actualizar solicitudes"
  ON visit_requests
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() 
      AND role IN ('admin', 'super_admin')
      AND is_active = true
    )
  );

-- Trigger para updated_at
CREATE TRIGGER update_visit_requests_updated_at
  BEFORE UPDATE ON visit_requests
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Índices para mejor rendimiento
CREATE INDEX idx_visit_requests_property_id ON visit_requests(property_id);
CREATE INDEX idx_visit_requests_status ON visit_requests(status);
CREATE INDEX idx_visit_requests_date ON visit_requests(requested_date);