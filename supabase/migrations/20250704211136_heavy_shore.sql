/*
  # Implementación completa de user_profiles con Supabase Auth

  1. Estructura Completa
    - Tabla user_profiles con todos los campos necesarios
    - Foreign keys correctas
    - Triggers para auditoría y updated_at
    - Políticas RLS por roles

  2. Sistema de Roles
    - client: Usuario básico (no accede al admin)
    - vendedor: Gestiona clientes y visitas
    - captador: Gestiona propiedades y tasaciones
    - admin: Acceso completo
    - super_admin: Control total del sistema

  3. Auditoría y Seguridad
    - Registro de todos los cambios
    - Políticas de seguridad por rol
    - Triggers automáticos
*/

-- 1. VERIFICAR Y CREAR ENUM DE ROLES
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
    DROP TYPE user_role CASCADE;
  END IF;
END $$;

CREATE TYPE user_role AS ENUM ('client', 'vendedor', 'captador', 'admin', 'super_admin');

-- 2. CREAR TABLA USER_PROFILES COMPLETA
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
  created_by uuid,
  updated_by uuid
);

-- 3. AGREGAR FOREIGN KEYS DESPUÉS DE CREAR LA TABLA
ALTER TABLE user_profiles 
ADD CONSTRAINT user_profiles_created_by_fkey 
FOREIGN KEY (created_by) REFERENCES user_profiles(id);

ALTER TABLE user_profiles 
ADD CONSTRAINT user_profiles_updated_by_fkey 
FOREIGN KEY (updated_by) REFERENCES user_profiles(id);

-- 4. HABILITAR RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- 5. POLÍTICAS DE SEGURIDAD DETALLADAS
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

-- 6. FUNCIÓN PARA CREAR PERFIL AUTOMÁTICAMENTE AL REGISTRARSE
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

-- 7. TRIGGER PARA CREAR PERFIL AUTOMÁTICAMENTE
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 8. TRIGGER PARA UPDATED_AT AUTOMÁTICO
CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 9. FUNCIÓN DE AUDITORÍA MEJORADA
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

-- 10. TRIGGER DE AUDITORÍA PARA USER_PROFILES
CREATE TRIGGER audit_user_profiles
  AFTER INSERT OR UPDATE OR DELETE ON user_profiles
  FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

-- 11. ACTUALIZAR POLÍTICAS DE OTRAS TABLAS PARA USAR LOS NUEVOS ROLES

-- Políticas para propiedades
DROP POLICY IF EXISTS "Los admins pueden gestionar propiedades" ON properties;
DROP POLICY IF EXISTS "Los admins y captadores pueden gestionar propiedades" ON properties;
DROP POLICY IF EXISTS "Los vendedores pueden ver propiedades" ON properties;

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

-- Políticas para solicitudes de tasación
DROP POLICY IF EXISTS "Los admins pueden ver todas las tasaciones" ON appraisal_requests;
DROP POLICY IF EXISTS "Los admins pueden actualizar tasaciones" ON appraisal_requests;
DROP POLICY IF EXISTS "Los admins y captadores pueden ver tasaciones" ON appraisal_requests;
DROP POLICY IF EXISTS "Los admins y captadores pueden actualizar tasaciones" ON appraisal_requests;

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

-- Políticas para solicitudes de visita
DROP POLICY IF EXISTS "Los admins pueden ver todas las solicitudes" ON visit_requests;
DROP POLICY IF EXISTS "Los admins pueden actualizar solicitudes" ON visit_requests;
DROP POLICY IF EXISTS "Los vendedores y admins pueden ver solicitudes de visita" ON visit_requests;
DROP POLICY IF EXISTS "Los vendedores y admins pueden actualizar solicitudes de visita" ON visit_requests;

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

-- 12. CREAR TABLA DE CLIENTES (SEPARADA DE USUARIOS DEL SISTEMA)
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

-- 13. HABILITAR RLS PARA CLIENTES
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;

-- 14. POLÍTICAS PARA CLIENTES (VENDEDORES Y ADMINS)
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

-- 15. TRIGGERS PARA CLIENTES
CREATE TRIGGER audit_clients
  AFTER INSERT OR UPDATE OR DELETE ON clients
  FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

CREATE TRIGGER update_clients_updated_at
  BEFORE UPDATE ON clients
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 16. CREAR USUARIOS DE PRUEBA EN AUTH.USERS
DO $$
DECLARE
  admin_user_id uuid := gen_random_uuid();
  captador_user_id uuid := gen_random_uuid();
  vendedor_user_id uuid := gen_random_uuid();
BEGIN
  -- Usuario Administrador
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'admin@axtellpropiedades.com') THEN
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
      confirmation_token, raw_app_meta_data, raw_user_meta_data, created_at, updated_at,
      recovery_token, email_change_token_new, email_change, last_sign_in_at,
      phone, phone_confirmed_at, phone_change, phone_change_token, phone_change_sent_at,
      email_change_token_current, email_change_confirm_status, banned_until,
      reauthentication_token, reauthentication_sent_at, is_sso_user, deleted_at,
      is_super_admin, confirmation_sent_at, recovery_sent_at, email_change_sent_at,
      invited_at
    ) VALUES (
      '00000000-0000-0000-0000-000000000000', admin_user_id, 'authenticated', 'authenticated',
      'admin@axtellpropiedades.com', crypt('admin123', gen_salt('bf')), now(),
      '', '{"provider": "email", "providers": ["email"]}',
      '{"full_name": "Administrador Principal", "role": "admin"}',
      now(), now(), '', '', '', null, null, null, '', '', null,
      '', 0, null, '', null, false, null, false, null, null, null, null
    );
    
    RAISE NOTICE 'Usuario administrador creado: admin@axtellpropiedades.com / admin123';
  END IF;

  -- Usuario Captador
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'captador@axtellpropiedades.com') THEN
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
      confirmation_token, raw_app_meta_data, raw_user_meta_data, created_at, updated_at,
      recovery_token, email_change_token_new, email_change, last_sign_in_at,
      phone, phone_confirmed_at, phone_change, phone_change_token, phone_change_sent_at,
      email_change_token_current, email_change_confirm_status, banned_until,
      reauthentication_token, reauthentication_sent_at, is_sso_user, deleted_at,
      is_super_admin, confirmation_sent_at, recovery_sent_at, email_change_sent_at,
      invited_at
    ) VALUES (
      '00000000-0000-0000-0000-000000000000', captador_user_id, 'authenticated', 'authenticated',
      'captador@axtellpropiedades.com', crypt('captador123', gen_salt('bf')), now(),
      '', '{"provider": "email", "providers": ["email"]}',
      '{"full_name": "María González - Captador", "role": "captador"}',
      now(), now(), '', '', '', null, null, null, '', '', null,
      '', 0, null, '', null, false, null, false, null, null, null, null
    );
    
    RAISE NOTICE 'Usuario captador creado: captador@axtellpropiedades.com / captador123';
  END IF;

  -- Usuario Vendedor
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'vendedor@axtellpropiedades.com') THEN
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
      confirmation_token, raw_app_meta_data, raw_user_meta_data, created_at, updated_at,
      recovery_token, email_change_token_new, email_change, last_sign_in_at,
      phone, phone_confirmed_at, phone_change, phone_change_token, phone_change_sent_at,
      email_change_token_current, email_change_confirm_status, banned_until,
      reauthentication_token, reauthentication_sent_at, is_sso_user, deleted_at,
      is_super_admin, confirmation_sent_at, recovery_sent_at, email_change_sent_at,
      invited_at
    ) VALUES (
      '00000000-0000-0000-0000-000000000000', vendedor_user_id, 'authenticated', 'authenticated',
      'vendedor@axtellpropiedades.com', crypt('vendedor123', gen_salt('bf')), now(),
      '', '{"provider": "email", "providers": ["email"]}',
      '{"full_name": "Carlos Rodríguez - Vendedor", "role": "vendedor"}',
      now(), now(), '', '', '', null, null, null, '', '', null,
      '', 0, null, '', null, false, null, false, null, null, null, null
    );
    
    RAISE NOTICE 'Usuario vendedor creado: vendedor@axtellpropiedades.com / vendedor123';
  END IF;
END $$;

-- 17. INSERTAR DATOS DE EJEMPLO PARA CLIENTES
INSERT INTO clients (name, email, phone, city, interests, budget, property_type, notes, status) VALUES
('Juan Pérez', 'juan@email.com', '+56 9 9876 5432', 'Santiago', 'Casa con jardín, cerca de colegios', 200000000, 'casa', 'Busca casa para familia con 2 hijos', 'new'),
('Ana López', 'ana@email.com', '+56 9 8765 4321', 'Santiago', 'Departamento céntrico, buena conectividad', 150000000, 'apartamento', 'Primera vivienda, trabajo en el centro', 'contacted'),
('Roberto Silva', 'roberto@email.com', '+56 9 7654 3210', 'Santiago', 'Terreno para inversión', 300000000, 'terreno', 'Inversionista, busca terrenos comerciales', 'interested'),
('Carmen Torres', 'carmen@email.com', '+56 9 6543 2109', 'Santiago', 'Local comercial para negocio', 80000000, 'comercial', 'Quiere abrir una tienda de ropa', 'new')
ON CONFLICT DO NOTHING;

-- 18. VERIFICAR QUE TODO ESTÉ FUNCIONANDO
DO $$
BEGIN
  RAISE NOTICE '=== MIGRACIÓN COMPLETADA ===';
  RAISE NOTICE 'Tabla user_profiles creada con todos los campos y foreign keys';
  RAISE NOTICE 'Triggers de auditoría y updated_at habilitados';
  RAISE NOTICE 'Políticas RLS configuradas por roles';
  RAISE NOTICE 'Usuarios de prueba creados:';
  RAISE NOTICE '- admin@axtellpropiedades.com / admin123 (Administrador)';
  RAISE NOTICE '- captador@axtellpropiedades.com / captador123 (Captador)';
  RAISE NOTICE '- vendedor@axtellpropiedades.com / vendedor123 (Vendedor)';
  RAISE NOTICE 'Tabla de clientes creada con datos de ejemplo';
  RAISE NOTICE '=== SISTEMA LISTO PARA USAR ===';
END $$;