/*
  # Tabla de solicitudes de tasación

  1. Nueva Tabla
    - `appraisal_requests`
      - `id` (uuid, primary key)
      - `client_name` (text)
      - `client_email` (text)
      - `client_phone` (text)
      - `property_type` (property_type enum)
      - `property_address` (text)
      - `property_area` (integer, optional)
      - `property_bedrooms` (integer, optional)
      - `property_bathrooms` (integer, optional)
      - `property_description` (text)
      - `preferred_contact_method` (enum: email, phone)
      - `status` (enum: pending, in_progress, completed, cancelled)
      - `estimated_value` (bigint, optional)
      - `notes` (text, optional)
      - `assigned_to` (uuid, references agents, optional)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
      - `created_by` (uuid, optional)
      - `updated_by` (uuid)

  2. Seguridad
    - Enable RLS
    - Políticas para creación pública y gestión admin
*/

-- Crear enums
CREATE TYPE contact_method AS ENUM ('email', 'phone');
CREATE TYPE appraisal_status AS ENUM ('pending', 'in_progress', 'completed', 'cancelled');

CREATE TABLE IF NOT EXISTS appraisal_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_name text NOT NULL,
  client_email text NOT NULL,
  client_phone text NOT NULL,
  property_type property_type NOT NULL,
  property_address text NOT NULL,
  property_area integer,
  property_bedrooms integer,
  property_bathrooms integer,
  property_description text NOT NULL,
  preferred_contact_method contact_method DEFAULT 'email',
  status appraisal_status DEFAULT 'pending',
  estimated_value bigint, -- Valor estimado en pesos chilenos
  notes text, -- Notas internas del admin
  assigned_to uuid REFERENCES agents(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES user_profiles(id),
  updated_by uuid REFERENCES user_profiles(id)
);

-- Habilitar RLS
ALTER TABLE appraisal_requests ENABLE ROW LEVEL SECURITY;

-- Políticas de seguridad
CREATE POLICY "Cualquiera puede crear solicitudes de tasación"
  ON appraisal_requests
  FOR INSERT
  TO authenticated, anon
  WITH CHECK (true);

CREATE POLICY "Los admins pueden ver todas las tasaciones"
  ON appraisal_requests
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

CREATE POLICY "Los admins pueden actualizar tasaciones"
  ON appraisal_requests
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
CREATE TRIGGER update_appraisal_requests_updated_at
  BEFORE UPDATE ON appraisal_requests
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Índices para mejor rendimiento
CREATE INDEX idx_appraisal_requests_status ON appraisal_requests(status);
CREATE INDEX idx_appraisal_requests_assigned_to ON appraisal_requests(assigned_to);
CREATE INDEX idx_appraisal_requests_created_at ON appraisal_requests(created_at);