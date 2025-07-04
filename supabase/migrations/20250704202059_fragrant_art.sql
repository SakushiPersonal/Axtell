/*
  # Sistema de autenticación con Supabase Auth y roles

  1. Actualizar sistema de usuarios
    - Usar Supabase Auth como base
    - Crear tabla user_profiles que extiende auth.users
    - Implementar 3 roles: admin, captador, vendedor
    - Sistema de auditoría automática

  2. Seguridad
    - RLS policies por rol
    - Auditoría automática de cambios
    - Tracking de quién hizo qué
*/

-- Actualizar enum de roles
DROP TYPE IF EXISTS user_role CASCADE;
CREATE TYPE user_role AS ENUM ('client', 'vendedor', 'captador', 'admin', 'super_admin');

-- Actualizar tabla user_profiles para usar Supabase Auth
DROP TABLE IF EXISTS user_profiles CASCADE;
CREATE TABLE user_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL,
  phone text,
  role user_role NOT NULL DEFAULT 'client',
  avatar_url text,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES user_profiles(id),
  updated_by uuid REFERENCES user_profiles(id)
);

-- Habilitar RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Políticas de seguridad actualizadas
CREATE POLICY "Los usuarios pueden ver su propio perfil"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Los admins pueden ver todos los perfiles"
  ON user_profiles
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

CREATE POLICY "Los usuarios pueden actualizar su propio perfil"
  ON user_profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Los admins pueden actualizar perfiles"
  ON user_profiles
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

CREATE POLICY "Los super_admins pueden crear usuarios"
  ON user_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() 
      AND role = 'super_admin'
      AND is_active = true
    )
  );

-- Actualizar políticas de propiedades para captadores
DROP POLICY IF EXISTS "Los admins pueden gestionar propiedades" ON properties;

CREATE POLICY "Los admins y captadores pueden gestionar propiedades"
  ON properties
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() 
      AND role IN ('admin', 'super_admin', 'captador')
      AND is_active = true
    )
  );

CREATE POLICY "Los vendedores pueden ver propiedades"
  ON properties
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() 
      AND role IN ('admin', 'super_admin', 'captador', 'vendedor')
      AND is_active = true
    )
  );

-- Actualizar políticas de solicitudes de tasación para captadores
DROP POLICY IF EXISTS "Los admins pueden ver todas las tasaciones" ON appraisal_requests;
DROP POLICY IF EXISTS "Los admins pueden actualizar tasaciones" ON appraisal_requests;

CREATE POLICY "Los admins y captadores pueden ver tasaciones"
  ON appraisal_requests
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() 
      AND role IN ('admin', 'super_admin', 'captador')
      AND is_active = true
    )
  );

CREATE POLICY "Los admins y captadores pueden actualizar tasaciones"
  ON appraisal_requests
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() 
      AND role IN ('admin', 'super_admin', 'captador')
      AND is_active = true
    )
  );

-- Crear tabla de clientes (separada de usuarios)
CREATE TABLE IF NOT EXISTS clients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  address text,
  city text NOT NULL DEFAULT 'Santiago',
  interests text,
  budget bigint,
  property_type text NOT NULL DEFAULT 'casa',
  notes text,
  status text NOT NULL DEFAULT 'new',
  assigned_to uuid REFERENCES user_profiles(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES user_profiles(id),
  updated_by uuid REFERENCES user_profiles(id),
  last_contact timestamptz
);

-- Habilitar RLS para clientes
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;

-- Políticas para clientes (vendedores y admins)
CREATE POLICY "Los vendedores y admins pueden gestionar clientes"
  ON clients
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() 
      AND role IN ('admin', 'super_admin', 'vendedor')
      AND is_active = true
    )
  );

-- Actualizar políticas de visitas para vendedores
DROP POLICY IF EXISTS "Los admins pueden ver todas las solicitudes" ON visit_requests;
DROP POLICY IF EXISTS "Los admins pueden actualizar solicitudes" ON visit_requests;

CREATE POLICY "Los vendedores y admins pueden ver solicitudes de visita"
  ON visit_requests
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() 
      AND role IN ('admin', 'super_admin', 'vendedor')
      AND is_active = true
    )
  );

CREATE POLICY "Los vendedores y admins pueden actualizar solicitudes de visita"
  ON visit_requests
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() 
      AND role IN ('admin', 'super_admin', 'vendedor')
      AND is_active = true
    )
  );

-- Función mejorada para crear perfil automáticamente
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.user_profiles (id, full_name, role, created_by)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'full_name', new.email),
    COALESCE((new.raw_user_meta_data->>'role')::user_role, 'client'),
    new.id
  );
  RETURN new;
END;
$$ language plpgsql security definer;

-- Función de auditoría mejorada con información del usuario
CREATE OR REPLACE FUNCTION audit_trigger_function()
RETURNS trigger AS $$
DECLARE
  user_uuid uuid := auth.uid();
  user_email_val text;
  user_role_val text;
BEGIN
  -- Obtener información del usuario
  SELECT u.email, p.role::text INTO user_email_val, user_role_val
  FROM auth.users u
  LEFT JOIN user_profiles p ON u.id = p.id
  WHERE u.id = user_uuid;

  IF TG_OP = 'DELETE' THEN
    INSERT INTO audit_log (
      table_name, record_id, action, old_values, user_id, user_email
    ) VALUES (
      TG_TABLE_NAME, OLD.id, 'DELETE', 
      jsonb_build_object(
        'data', to_jsonb(OLD),
        'user_role', user_role_val,
        'timestamp', now()
      ), 
      user_uuid, user_email_val
    );
    RETURN OLD;
  ELSIF TG_OP = 'UPDATE' THEN
    INSERT INTO audit_log (
      table_name, record_id, action, old_values, new_values, user_id, user_email
    ) VALUES (
      TG_TABLE_NAME, NEW.id, 'UPDATE', 
      jsonb_build_object(
        'data', to_jsonb(OLD),
        'user_role', user_role_val,
        'timestamp', now()
      ),
      jsonb_build_object(
        'data', to_jsonb(NEW),
        'user_role', user_role_val,
        'timestamp', now()
      ),
      user_uuid, user_email_val
    );
    RETURN NEW;
  ELSIF TG_OP = 'INSERT' THEN
    INSERT INTO audit_log (
      table_name, record_id, action, new_values, user_id, user_email
    ) VALUES (
      TG_TABLE_NAME, NEW.id, 'INSERT', 
      jsonb_build_object(
        'data', to_jsonb(NEW),
        'user_role', user_role_val,
        'timestamp', now()
      ),
      user_uuid, user_email_val
    );
    RETURN NEW;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Agregar triggers de auditoría para la nueva tabla de clientes
CREATE TRIGGER audit_clients
  AFTER INSERT OR UPDATE OR DELETE ON clients
  FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

-- Trigger para updated_at en clientes
CREATE TRIGGER update_clients_updated_at
  BEFORE UPDATE ON clients
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insertar usuario administrador por defecto
INSERT INTO auth.users (
  id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_user_meta_data
) VALUES (
  gen_random_uuid(),
  'admin@axtellpropiedades.com',
  crypt('admin123', gen_salt('bf')),
  now(),
  now(),
  now(),
  '{"full_name": "Administrador Principal", "role": "admin"}'::jsonb
) ON CONFLICT (email) DO NOTHING;