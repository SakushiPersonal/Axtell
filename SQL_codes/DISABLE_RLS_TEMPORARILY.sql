-- ============================================
-- DESHABILITAR RLS TEMPORALMENTE PARA DEBUGGING
-- ============================================

-- Deshabilitar RLS en todas las tablas relacionadas
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE properties DISABLE ROW LEVEL SECURITY;
ALTER TABLE clients DISABLE ROW LEVEL SECURITY;
ALTER TABLE visits DISABLE ROW LEVEL SECURITY;

-- Eliminar todas las políticas problemáticas
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Admins can insert profiles" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Admins can update any profile" ON profiles;
DROP POLICY IF EXISTS "Admins can delete other profiles" ON profiles;

-- Verificar que RLS está deshabilitado
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE tablename IN ('profiles', 'properties', 'clients', 'visits');

-- Verificar que no hay políticas activas
SELECT tablename, policyname 
FROM pg_policies 
WHERE tablename IN ('profiles', 'properties', 'clients', 'visits');

-- Mensaje de confirmación
SELECT 'RLS deshabilitado temporalmente - las operaciones deberían funcionar ahora' as status; 