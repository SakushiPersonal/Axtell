-- =============================================
-- FIX RLS RECURSION - Eliminar y recrear políticas
-- =============================================

-- PASO 1: Eliminar todas las políticas existentes que causan recursión
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Admins can view all active profiles" ON profiles;
DROP POLICY IF EXISTS "Only admins can update profiles" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Only admins can insert profiles" ON profiles;
DROP POLICY IF EXISTS "Allow profile creation" ON profiles;

DROP POLICY IF EXISTS "Authenticated users can view properties" ON properties;
DROP POLICY IF EXISTS "Captadores can insert properties" ON properties;
DROP POLICY IF EXISTS "Captadores can update own properties" ON properties;
DROP POLICY IF EXISTS "Admins can update any property" ON properties;
DROP POLICY IF EXISTS "Captadores can delete own properties" ON properties;
DROP POLICY IF EXISTS "Admins can delete any property" ON properties;

DROP POLICY IF EXISTS "Vendedores and admins can view all clients" ON clients;
DROP POLICY IF EXISTS "Vendedores and admins can insert clients" ON clients;
DROP POLICY IF EXISTS "Vendedores and admins can update any client" ON clients;
DROP POLICY IF EXISTS "Vendedores and admins can delete any client" ON clients;

DROP POLICY IF EXISTS "Vendedores and admins can view all visits" ON visits;
DROP POLICY IF EXISTS "Vendedores and admins can insert visits" ON visits;
DROP POLICY IF EXISTS "Vendedores and admins can update any visit" ON visits;
DROP POLICY IF EXISTS "Vendedores and admins can delete any visit" ON visits;

-- PASO 2: Crear funciones auxiliares que eviten RLS usando SECURITY DEFINER
CREATE OR REPLACE FUNCTION get_user_role()
RETURNS TEXT AS $$
DECLARE
  user_role TEXT;
BEGIN
  SELECT role INTO user_role 
  FROM profiles 
  WHERE id = auth.uid() AND is_active = true;
  
  RETURN COALESCE(user_role, 'guest');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN get_user_role() = 'admin';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION is_vendedor_or_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN get_user_role() IN ('vendedor', 'admin');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION is_captador_or_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN get_user_role() IN ('captador', 'admin');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- PASO 3: Recrear políticas simples para profiles (sin recursión)
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Allow profile creation"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- PASO 4: Recrear políticas para properties usando las funciones auxiliares
CREATE POLICY "Authenticated users can view properties"
  ON properties FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Captadores can insert properties"
  ON properties FOR INSERT
  WITH CHECK (is_captador_or_admin());

CREATE POLICY "Captadores can update own properties"
  ON properties FOR UPDATE
  USING (captador_id = auth.uid() OR is_admin());

CREATE POLICY "Captadores can delete own properties"
  ON properties FOR DELETE
  USING (captador_id = auth.uid() OR is_admin());

-- PASO 5: Recrear políticas para clients
CREATE POLICY "Vendedores and admins can view all clients"
  ON clients FOR SELECT
  USING (is_vendedor_or_admin());

CREATE POLICY "Vendedores and admins can insert clients"
  ON clients FOR INSERT
  WITH CHECK (is_vendedor_or_admin());

CREATE POLICY "Vendedores and admins can update any client"
  ON clients FOR UPDATE
  USING (is_vendedor_or_admin());

CREATE POLICY "Vendedores and admins can delete any client"
  ON clients FOR DELETE
  USING (is_vendedor_or_admin());

-- PASO 6: Recrear políticas para visits
CREATE POLICY "Vendedores and admins can view all visits"
  ON visits FOR SELECT
  USING (is_vendedor_or_admin());

CREATE POLICY "Vendedores and admins can insert visits"
  ON visits FOR INSERT
  WITH CHECK (is_vendedor_or_admin());

CREATE POLICY "Vendedores and admins can update any visit"
  ON visits FOR UPDATE
  USING (is_vendedor_or_admin());

CREATE POLICY "Vendedores and admins can delete any visit"
  ON visits FOR DELETE
  USING (is_vendedor_or_admin());

-- PASO 7: Mantener política pública para properties
CREATE POLICY "Public read access to properties"
  ON properties FOR SELECT
  USING (true);

-- Verificar que RLS esté habilitado
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE visits ENABLE ROW LEVEL SECURITY;

-- =============================================
-- MENSAJE DE CONFIRMACIÓN
-- =============================================
-- Las políticas RLS han sido corregidas para evitar recursión infinita 