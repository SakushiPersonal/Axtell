/*
  # Sistema de autenticación con roles y auditoría

  1. Actualización del sistema de usuarios
    - Nuevos roles: client, vendedor, captador, admin, super_admin
    - Integración con Supabase Auth
    - Tabla de clientes separada

  2. Políticas de seguridad por rol
    - Administradores: acceso completo
    - Captadores: propiedades y tasaciones
    - Vendedores: clientes y visitas

  3. Auditoría mejorada
    - Tracking de roles de usuario
    - Información completa de cambios
*/

-- Actualizar enum de roles
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
    DROP TYPE user_role CASCADE;
  END IF;
END $$;

CREATE TYPE user_role AS ENUM ('client', 'vendedor', 'captador', 'admin', 'super_admin');

-- Recrear tabla user_profiles para usar Supabase Auth
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

-- Políticas de seguridad para user_profiles
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

-- Función para crear perfil automáticamente al registrarse
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

-- Trigger para crear perfil automáticamente
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Trigger para updated_at en user_profiles
CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Actualizar políticas de propiedades
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

-- Crear tabla de clientes (separada de usuarios del sistema)
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

-- Actualizar políticas de solicitudes de tasación
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

-- Migrar datos existentes de clientes si existen
DO $$
BEGIN
  -- Insertar algunos clientes de ejemplo si la tabla está vacía
  IF NOT EXISTS (SELECT 1 FROM clients LIMIT 1) THEN
    INSERT INTO clients (name, email, phone, city, interests, budget, property_type, notes, status) VALUES
    ('Juan Pérez', 'juan@email.com', '+56 9 9876 5432', 'Santiago', 'Casa con jardín, cerca de colegios', 200000000, 'casa', 'Busca casa para familia con 2 hijos', 'new'),
    ('Ana López', 'ana@email.com', '+56 9 8765 4321', 'Santiago', 'Departamento céntrico, buena conectividad', 150000000, 'apartamento', 'Primera vivienda, trabajo en el centro', 'contacted'),
    ('Roberto Silva', 'roberto@email.com', '+56 9 7654 3210', 'Santiago', 'Terreno para inversión', 300000000, 'terreno', 'Inversionista, busca terrenos comerciales', 'interested'),
    ('Carmen Torres', 'carmen@email.com', '+56 9 6543 2109', 'Santiago', 'Local comercial para negocio', 80000000, 'comercial', 'Quiere abrir una tienda de ropa', 'new');
  END IF;
END $$;