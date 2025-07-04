/*
  # Tabla de agentes inmobiliarios

  1. Nueva Tabla
    - `agents`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references user_profiles, optional)
      - `name` (text)
      - `email` (text)
      - `phone` (text)
      - `whatsapp_number` (text)
      - `license_number` (text, optional)
      - `bio` (text, optional)
      - `avatar_url` (text, optional)
      - `is_active` (boolean)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
      - `created_by` (uuid)
      - `updated_by` (uuid)

  2. Seguridad
    - Enable RLS
    - Políticas para lectura pública y escritura admin
*/

CREATE TABLE IF NOT EXISTS agents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES user_profiles(id) ON DELETE SET NULL,
  name text NOT NULL,
  email text NOT NULL UNIQUE,
  phone text NOT NULL,
  whatsapp_number text,
  license_number text,
  bio text,
  avatar_url text,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES user_profiles(id),
  updated_by uuid REFERENCES user_profiles(id)
);

-- Habilitar RLS
ALTER TABLE agents ENABLE ROW LEVEL SECURITY;

-- Políticas de seguridad
CREATE POLICY "Cualquiera puede ver agentes activos"
  ON agents
  FOR SELECT
  TO authenticated, anon
  USING (is_active = true);

CREATE POLICY "Los admins pueden gestionar agentes"
  ON agents
  FOR ALL
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
CREATE TRIGGER update_agents_updated_at
  BEFORE UPDATE ON agents
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insertar agentes por defecto
INSERT INTO agents (name, email, phone, whatsapp_number, bio) VALUES
('María González', 'maria@axtellpropiedades.com', '+56912345678', '+56912345678', 'Especialista en propiedades de lujo con más de 15 años de experiencia.'),
('Carlos Rodríguez', 'carlos@axtellpropiedades.com', '+56923456789', '+56923456789', 'Experto en casas familiares y terrenos comerciales.');