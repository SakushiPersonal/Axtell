/*
  # Tabla de propiedades

  1. Nueva Tabla
    - `properties`
      - `id` (uuid, primary key)
      - `title` (text)
      - `description` (text)
      - `price` (bigint, en pesos chilenos)
      - `property_type` (enum)
      - `listing_type` (enum: sale, rent)
      - `bedrooms` (integer, optional)
      - `bathrooms` (integer, optional)
      - `area` (integer, metros cuadrados)
      - `address` (text)
      - `city` (text)
      - `neighborhood` (text)
      - `latitude` (decimal, optional)
      - `longitude` (decimal, optional)
      - `features` (text array)
      - `images` (text array)
      - `agent_id` (uuid, references agents)
      - `available_visit_days` (text array)
      - `available_visit_hours` (text array)
      - `is_featured` (boolean)
      - `is_active` (boolean)
      - `views_count` (integer, default 0)
      - `favorites_count` (integer, default 0)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
      - `created_by` (uuid)
      - `updated_by` (uuid)

  2. Seguridad
    - Enable RLS
    - Políticas para lectura pública y escritura admin
*/

-- Crear enums
CREATE TYPE property_type AS ENUM ('casa', 'apartamento', 'terreno', 'comercial', 'oficina');
CREATE TYPE listing_type AS ENUM ('sale', 'rent');

CREATE TABLE IF NOT EXISTS properties (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  price bigint NOT NULL, -- Precio en pesos chilenos
  property_type property_type NOT NULL,
  listing_type listing_type NOT NULL,
  bedrooms integer,
  bathrooms integer,
  area integer NOT NULL, -- Metros cuadrados
  address text NOT NULL,
  city text NOT NULL,
  neighborhood text NOT NULL,
  latitude decimal(10, 8),
  longitude decimal(11, 8),
  features text[] DEFAULT '{}',
  images text[] DEFAULT '{}',
  agent_id uuid NOT NULL REFERENCES agents(id),
  available_visit_days text[] DEFAULT '{}',
  available_visit_hours text[] DEFAULT '{}',
  is_featured boolean DEFAULT false,
  is_active boolean DEFAULT true,
  views_count integer DEFAULT 0,
  favorites_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES user_profiles(id),
  updated_by uuid REFERENCES user_profiles(id)
);

-- Habilitar RLS
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;

-- Políticas de seguridad
CREATE POLICY "Cualquiera puede ver propiedades activas"
  ON properties
  FOR SELECT
  TO authenticated, anon
  USING (is_active = true);

CREATE POLICY "Los admins pueden gestionar propiedades"
  ON properties
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
CREATE TRIGGER update_properties_updated_at
  BEFORE UPDATE ON properties
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Función para incrementar vistas
CREATE OR REPLACE FUNCTION increment_property_views(property_id uuid)
RETURNS void AS $$
BEGIN
  UPDATE properties 
  SET views_count = views_count + 1 
  WHERE id = property_id AND is_active = true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Función para toggle favoritos
CREATE OR REPLACE FUNCTION toggle_property_favorite(property_id uuid, increment boolean)
RETURNS void AS $$
BEGIN
  IF increment THEN
    UPDATE properties 
    SET favorites_count = favorites_count + 1 
    WHERE id = property_id AND is_active = true;
  ELSE
    UPDATE properties 
    SET favorites_count = GREATEST(favorites_count - 1, 0) 
    WHERE id = property_id AND is_active = true;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;