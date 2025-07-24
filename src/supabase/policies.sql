-- =============================================
-- ROW LEVEL SECURITY POLICIES
-- =============================================

-- Activar RLS en todas las tablas
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE visits ENABLE ROW LEVEL SECURITY;

-- =============================================
-- POLÍTICAS PARA TABLA: profiles
-- =============================================

-- POLÍTICA SIMPLE: Los usuarios pueden ver solo su propio perfil
-- Esto evita la recursión infinita
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

-- POLÍTICA SIMPLE: Los usuarios pueden actualizar solo su propio perfil
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- POLÍTICA PARA INSERCIÓN: Solo permitir inserción durante registro inicial
-- Usaremos una función separada para que los admins puedan crear usuarios
CREATE POLICY "Allow profile creation"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- =============================================
-- FUNCIÓN AUXILIAR PARA VERIFICAR ROLES
-- =============================================

-- Función que evita RLS para verificar el rol del usuario actual
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

-- Función para verificar si el usuario actual es admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN get_user_role() = 'admin';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Función para verificar si el usuario actual es vendedor o admin
CREATE OR REPLACE FUNCTION is_vendedor_or_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN get_user_role() IN ('vendedor', 'admin');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Función para verificar si el usuario actual es captador o admin
CREATE OR REPLACE FUNCTION is_captador_or_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN get_user_role() IN ('captador', 'admin');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- POLÍTICAS PARA TABLA: properties
-- =============================================

-- Todos los usuarios autenticados pueden ver propiedades
CREATE POLICY "Authenticated users can view properties"
  ON properties FOR SELECT
  USING (auth.role() = 'authenticated');

-- Los captadores pueden insertar propiedades
CREATE POLICY "Captadores can insert properties"
  ON properties FOR INSERT
  WITH CHECK (is_captador_or_admin());

-- Los captadores pueden actualizar sus propias propiedades, admins pueden actualizar cualquiera
CREATE POLICY "Captadores can update own properties"
  ON properties FOR UPDATE
  USING (captador_id = auth.uid() OR is_admin());

-- Los captadores pueden eliminar sus propias propiedades, admins pueden eliminar cualquiera
CREATE POLICY "Captadores can delete own properties"
  ON properties FOR DELETE
  USING (captador_id = auth.uid() OR is_admin());

-- =============================================
-- POLÍTICAS PARA TABLA: clients
-- =============================================

-- Los vendedores y administradores pueden ver TODOS los clientes
CREATE POLICY "Vendedores and admins can view all clients"
  ON clients FOR SELECT
  USING (is_vendedor_or_admin());

-- Los vendedores y administradores pueden insertar clientes
CREATE POLICY "Vendedores and admins can insert clients"
  ON clients FOR INSERT
  WITH CHECK (is_vendedor_or_admin());

-- Los vendedores y administradores pueden actualizar CUALQUIER cliente
CREATE POLICY "Vendedores and admins can update any client"
  ON clients FOR UPDATE
  USING (is_vendedor_or_admin());

-- Los vendedores y administradores pueden eliminar CUALQUIER cliente
CREATE POLICY "Vendedores and admins can delete any client"
  ON clients FOR DELETE
  USING (is_vendedor_or_admin());

-- =============================================
-- POLÍTICAS PARA TABLA: visits
-- =============================================

-- Los vendedores y administradores pueden ver TODAS las visitas
CREATE POLICY "Vendedores and admins can view all visits"
  ON visits FOR SELECT
  USING (is_vendedor_or_admin());

-- Los vendedores y administradores pueden insertar visitas
CREATE POLICY "Vendedores and admins can insert visits"
  ON visits FOR INSERT
  WITH CHECK (is_vendedor_or_admin());

-- Los vendedores y administradores pueden actualizar CUALQUIER visita
CREATE POLICY "Vendedores and admins can update any visit"
  ON visits FOR UPDATE
  USING (is_vendedor_or_admin());

-- Los vendedores y administradores pueden eliminar CUALQUIER visita
CREATE POLICY "Vendedores and admins can delete any visit"
  ON visits FOR DELETE
  USING (is_vendedor_or_admin());

-- =============================================
-- POLÍTICAS ADICIONALES PARA SEGURIDAD
-- =============================================

-- Política para permitir acceso público de lectura a propiedades (para la web pública)
CREATE POLICY "Public read access to properties"
  ON properties FOR SELECT
  USING (true);

-- Función para verificar si un usuario está activo
CREATE OR REPLACE FUNCTION is_user_active()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() 
    AND is_active = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- ÍNDICES PARA OPTIMIZAR CONSULTAS RLS
-- =============================================

-- Índices para mejorar el rendimiento de las políticas RLS
CREATE INDEX IF NOT EXISTS idx_profiles_role_active ON profiles(role, is_active);
CREATE INDEX IF NOT EXISTS idx_properties_captador ON properties(captador_id);
CREATE INDEX IF NOT EXISTS idx_clients_vendedor ON clients(vendedor_id);
CREATE INDEX IF NOT EXISTS idx_visits_vendedor ON visits(vendedor_id); 