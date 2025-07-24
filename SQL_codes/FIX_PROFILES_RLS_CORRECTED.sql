-- ============================================
-- SOLUCIÓN CORREGIDA PARA POLÍTICAS RLS DE PROFILES
-- Este script evita la recursión infinita
-- ============================================

-- PASO 1: Limpiar políticas existentes que causan problemas
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Admins can insert profiles" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Admins can update any profile" ON profiles;
DROP POLICY IF EXISTS "Admins can delete other profiles" ON profiles;

-- PASO 2: Deshabilitar RLS temporalmente para limpiar
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;

-- PASO 3: Crear función auxiliar para verificar si usuario es admin
-- Esta función se ejecuta con privilegios elevados para evitar recursión
CREATE OR REPLACE FUNCTION public.is_admin(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = user_id 
    AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- PASO 4: Crear políticas RLS simplificadas
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Política 1: Los usuarios pueden ver su propio perfil
CREATE POLICY "Users can view own profile" 
ON profiles FOR SELECT 
TO authenticated 
USING (auth.uid() = id);

-- Política 2: Los administradores pueden ver todos los perfiles
CREATE POLICY "Admins can view all profiles" 
ON profiles FOR SELECT 
TO authenticated 
USING (public.is_admin(auth.uid()));

-- Política 3: Los administradores pueden insertar nuevos perfiles
CREATE POLICY "Admins can insert profiles" 
ON profiles FOR INSERT 
TO authenticated 
WITH CHECK (public.is_admin(auth.uid()));

-- Política 4: Los usuarios pueden actualizar su propio perfil
CREATE POLICY "Users can update own profile" 
ON profiles FOR UPDATE 
TO authenticated 
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Política 5: Los administradores pueden actualizar cualquier perfil
CREATE POLICY "Admins can update any profile" 
ON profiles FOR UPDATE 
TO authenticated 
USING (public.is_admin(auth.uid()));

-- Política 6: Solo admins pueden eliminar perfiles (excepto el suyo)
CREATE POLICY "Admins can delete other profiles" 
ON profiles FOR DELETE 
TO authenticated 
USING (
    auth.uid() != id AND 
    public.is_admin(auth.uid())
);

-- ============================================
-- FUNCIÓN Y TRIGGER PARA AUTO-CREAR PERFIL
-- ============================================

-- Limpiar trigger existente si existe
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Crear función para manejar nuevos usuarios
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, role, phone, is_active)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'role', 'vendedor'),
    COALESCE(NEW.raw_user_meta_data->>'phone', ''),
    true
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Crear trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- ============================================
-- CONCEDER PERMISOS NECESARIOS
-- ============================================

-- Permitir que usuarios autenticados usen la función is_admin
GRANT EXECUTE ON FUNCTION public.is_admin(UUID) TO authenticated;

-- ============================================
-- VERIFICACIÓN FINAL
-- ============================================

-- Verificar que las políticas se crearon correctamente
SELECT policyname, cmd FROM pg_policies WHERE tablename = 'profiles';

-- Verificar que RLS está activo
SELECT tablename, rowsecurity FROM pg_tables WHERE tablename = 'profiles';

-- Verificar que la función existe
SELECT proname FROM pg_proc WHERE proname = 'is_admin';

-- ============================================
-- DATOS DE PRUEBA (OPCIONAL)
-- ============================================

-- Si necesitas verificar que todo funciona, puedes ejecutar:
-- SELECT public.is_admin('tu-user-id-aqui');
-- Esto debería devolver true si eres admin, false si no. 