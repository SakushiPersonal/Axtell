/*
  # Crear usuario administrador por defecto

  1. Crear usuario administrador usando las funciones de Supabase
  2. Configurar perfil con rol de administrador
  3. Datos de acceso por defecto
*/

-- Función para crear usuario administrador
CREATE OR REPLACE FUNCTION create_admin_user()
RETURNS void AS $$
DECLARE
  admin_user_id uuid;
BEGIN
  -- Verificar si ya existe un usuario administrador
  IF NOT EXISTS (
    SELECT 1 FROM auth.users 
    WHERE email = 'admin@axtellpropiedades.com'
  ) THEN
    
    -- Generar ID para el usuario
    admin_user_id := gen_random_uuid();
    
    -- Insertar en auth.users usando la estructura correcta
    INSERT INTO auth.users (
      instance_id,
      id,
      aud,
      role,
      email,
      encrypted_password,
      email_confirmed_at,
      invited_at,
      confirmation_token,
      confirmation_sent_at,
      recovery_token,
      recovery_sent_at,
      email_change_token_new,
      email_change,
      email_change_sent_at,
      last_sign_in_at,
      raw_app_meta_data,
      raw_user_meta_data,
      is_super_admin,
      created_at,
      updated_at,
      phone,
      phone_confirmed_at,
      phone_change,
      phone_change_token,
      phone_change_sent_at,
      email_change_token_current,
      email_change_confirm_status,
      banned_until,
      reauthentication_token,
      reauthentication_sent_at,
      is_sso_user,
      deleted_at
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      admin_user_id,
      'authenticated',
      'authenticated',
      'admin@axtellpropiedades.com',
      crypt('admin123', gen_salt('bf')),
      now(),
      null,
      '',
      null,
      '',
      null,
      '',
      '',
      null,
      null,
      '{"provider": "email", "providers": ["email"]}',
      '{"full_name": "Administrador Principal", "role": "admin"}',
      false,
      now(),
      now(),
      null,
      null,
      '',
      '',
      null,
      '',
      0,
      null,
      '',
      null,
      false,
      null
    );
    
    -- El trigger handle_new_user creará automáticamente el perfil
    RAISE NOTICE 'Usuario administrador creado: admin@axtellpropiedades.com / admin123';
    
  ELSE
    RAISE NOTICE 'Usuario administrador ya existe';
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Ejecutar la función para crear el usuario
SELECT create_admin_user();

-- Eliminar la función temporal
DROP FUNCTION create_admin_user();

-- Crear algunos usuarios adicionales de ejemplo
CREATE OR REPLACE FUNCTION create_example_users()
RETURNS void AS $$
DECLARE
  captador_user_id uuid;
  vendedor_user_id uuid;
BEGIN
  -- Usuario Captador
  IF NOT EXISTS (
    SELECT 1 FROM auth.users 
    WHERE email = 'captador@axtellpropiedades.com'
  ) THEN
    
    captador_user_id := gen_random_uuid();
    
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
      confirmation_token, raw_app_meta_data, raw_user_meta_data, created_at, updated_at
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      captador_user_id,
      'authenticated',
      'authenticated',
      'captador@axtellpropiedades.com',
      crypt('captador123', gen_salt('bf')),
      now(),
      '',
      '{"provider": "email", "providers": ["email"]}',
      '{"full_name": "María González - Captador", "role": "captador"}',
      now(),
      now()
    );
    
    RAISE NOTICE 'Usuario captador creado: captador@axtellpropiedades.com / captador123';
  END IF;
  
  -- Usuario Vendedor
  IF NOT EXISTS (
    SELECT 1 FROM auth.users 
    WHERE email = 'vendedor@axtellpropiedades.com'
  ) THEN
    
    vendedor_user_id := gen_random_uuid();
    
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
      confirmation_token, raw_app_meta_data, raw_user_meta_data, created_at, updated_at
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      vendedor_user_id,
      'authenticated',
      'authenticated',
      'vendedor@axtellpropiedades.com',
      crypt('vendedor123', gen_salt('bf')),
      now(),
      '',
      '{"provider": "email", "providers": ["email"]}',
      '{"full_name": "Carlos Rodríguez - Vendedor", "role": "vendedor"}',
      now(),
      now()
    );
    
    RAISE NOTICE 'Usuario vendedor creado: vendedor@axtellpropiedades.com / vendedor123';
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Ejecutar la función para crear usuarios de ejemplo
SELECT create_example_users();

-- Eliminar la función temporal
DROP FUNCTION create_example_users();