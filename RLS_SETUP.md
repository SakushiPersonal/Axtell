# 🔒 Configuración de Row Level Security (RLS)

## ⚠️ IMPORTANTE
**Ejecuta estos comandos SOLO cuando estés listo para activar RLS en producción**. Una vez activado, los usuarios solo podrán ver/modificar los datos que les corresponden según su rol.

### 🔒 **Política de Perfiles Ultra-Restrictiva**
**ATENCIÓN:** Las políticas implementadas son **muy restrictivas** para la tabla `profiles`:
- **SOLO administradores** pueden modificar información de usuarios (incluyendo la suya propia)
- **Vendedores y Captadores** NO pueden editar ni siquiera su propia información
- Esta es una decisión de seguridad empresarial donde solo el admin gestiona los datos de usuarios

Si necesitas permitir que usuarios editen su propia información básica (como teléfono), deberás ajustar las políticas antes de activar RLS.

## 📋 Pasos para aplicar RLS

### 1. Ejecutar las políticas en Supabase

1. Ve a tu dashboard de Supabase
2. Navega a **SQL Editor**
3. Copia y pega el contenido del archivo `src/supabase/policies.sql`
4. Ejecuta el script completo

### 2. Verificar que las políticas se aplicaron correctamente

Ejecuta este comando para verificar que RLS está activado:

```sql
SELECT 
  schemaname,
  tablename,
  rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('profiles', 'properties', 'clients', 'visits');
```

Deberías ver `true` en la columna `rowsecurity` para todas las tablas.

### 3. Verificar las políticas creadas

```sql
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename, policyname;
```

## 🎯 Qué hace cada política

### 📊 Tabla `profiles`
- **Usuarios**: Solo pueden ver su propio perfil (lectura únicamente)
- **Administradores**: ÚNICOS que pueden ver/editar todos los perfiles activos
- **Restricción**: Solo administradores pueden modificar información de usuarios
- **Seguridad**: Previene que usuarios modifiquen su rol o información personal

### 🏠 Tabla `properties`
- **Lectura**: Todos los usuarios autenticados pueden ver propiedades
- **Escritura**: Solo captadores y admins pueden crear/modificar
- **Aislamiento**: Captadores solo pueden modificar sus propias propiedades
- **Público**: Acceso de lectura para la web pública (sin autenticación)

### 👥 Tabla `clients`
- **Vendedores y Administradores**: Ven y gestionan TODOS los clientes
- **Captadores**: No tienen acceso a clientes
- **Colaboración**: Cualquier vendedor puede trabajar con cualquier cliente
- **Sin aislamiento**: Acceso completo para optimizar las ventas

### 📅 Tabla `visits`
- **Vendedores y Administradores**: Ven y gestionan TODAS las visitas
- **Captadores**: No tienen acceso a visitas
- **Colaboración**: Cualquier vendedor puede manejar cualquier visita
- **Seguimiento**: Visibilidad completa de la actividad comercial

## 🔧 Después de aplicar RLS

### 1. Probar funcionalidad
- Inicia sesión con diferentes roles
- Verifica que cada usuario ve solo sus datos
- Confirma que los administradores ven todo

### 2. Monitorear logs
- Revisa los logs de Supabase para errores de permisos
- Ajusta políticas si es necesario

### 3. Índices de rendimiento
Las políticas incluyen índices optimizados para:
- `profiles(role, is_active)`
- `properties(captador_id)`
- `clients(vendedor_id)`
- `visits(vendedor_id)`

## 🔄 Política Alternativa para Perfiles (Opcional)

Si quieres permitir que usuarios editen su información básica (nombre, teléfono), reemplaza la política de UPDATE de profiles con:

```sql
-- Alternativa: Usuarios pueden editar info básica (NO rol ni estado)
DROP POLICY IF EXISTS "Only admins can update profiles" ON profiles;

CREATE POLICY "Users can update basic info, admins update all"
  ON profiles FOR UPDATE
  USING (
    -- Usuarios pueden editar su propio perfil O ser admin
    auth.uid() = id OR 
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND role = 'admin' 
      AND is_active = true
    )
  )
  WITH CHECK (
    -- Si no es admin, solo puede cambiar nombre y teléfono
    CASE 
      WHEN EXISTS (
        SELECT 1 FROM profiles 
        WHERE id = auth.uid() 
        AND role = 'admin' 
        AND is_active = true
      ) THEN true
      ELSE 
        auth.uid() = id 
        AND role = (SELECT role FROM profiles WHERE id = auth.uid())
        AND is_active = (SELECT is_active FROM profiles WHERE id = auth.uid())
    END
  );
```

**Nota:** Solo usa esta alternativa si realmente necesitas que usuarios editen su info básica.

## 🚨 Solución de problemas

### Error: "permission denied for table X"
- Verifica que el usuario esté autenticado
- Confirma que el usuario esté activo (`is_active = true`)
- Revisa que el rol del usuario sea correcto

### Los usuarios no ven sus datos
- Verifica que los campos `vendedor_id`, `captador_id` estén correctamente asignados
- Confirma que `auth.uid()` retorna el ID correcto

### Problemas de rendimiento
- Verifica que los índices se crearon correctamente
- Considera agregar más índices según el uso

## 🔄 Rollback (en caso de emergencia)

Si necesitas desactivar RLS temporalmente:

```sql
-- SOLO USAR EN EMERGENCIA
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE properties DISABLE ROW LEVEL SECURITY;
ALTER TABLE clients DISABLE ROW LEVEL SECURITY;
ALTER TABLE visits DISABLE ROW LEVEL SECURITY;
```

## ✅ Verificación final

Ejecuta estas consultas como usuario normal (no admin) para verificar:

```sql
-- Como vendedor, deberías ver solo tus clientes
SELECT COUNT(*) FROM clients;

-- Como captador, deberías ver solo tus propiedades  
SELECT COUNT(*) FROM properties WHERE captador_id = auth.uid();

-- Todos deberían poder ver su perfil
SELECT * FROM profiles WHERE id = auth.uid();
```

## 📚 Recursos adicionales

- [Documentación oficial de RLS en Supabase](https://supabase.com/docs/guides/auth/row-level-security)
- [Mejores prácticas de RLS](https://supabase.com/docs/guides/auth/row-level-security#tips-for-writing-policies)

---

## 🎉 Una vez aplicado, tu aplicación tendrá seguridad a nivel de base de datos con aislamiento completo de datos por rol y usuario.

## 📋 Resumen de Políticas Implementadas

### ✅ **Cambios Finales Aplicados:**

1. **Tabla `profiles`** - **Ultra-Restrictiva**
   - ❌ Usuarios NO pueden editar ni su propia información 
   - ✅ Solo administradores pueden modificar cualquier perfil
   - ✅ Usuarios pueden ver solo su propio perfil

2. **Tabla `clients`** - **Acceso Colaborativo**
   - ✅ Vendedores y administradores ven TODOS los clientes
   - ✅ Vendedores y administradores pueden editar CUALQUIER cliente
   - ❌ Captadores NO tienen acceso a clientes
   - 🎯 Estrategia: Maximizar oportunidades de venta

3. **Tabla `properties`** - **Según Rol**
   - ✅ Captadores: Solo sus propiedades + lectura de todas
   - ✅ Administradores: Acceso completo a todas las propiedades
   - ✅ Público: Lectura sin autenticación

4. **Tabla `visits`** - **Acceso Colaborativo**
   - ✅ Vendedores y administradores ven TODAS las visitas
   - ✅ Vendedores y administradores pueden editar CUALQUIER visita
   - ❌ Captadores NO tienen acceso a visitas
   - 🎯 Estrategia: Seguimiento completo de actividad comercial

### 🔒 **Nivel de Seguridad por Tabla:**
- **`profiles`**: 🔴 **MÁXIMA** - Solo admins modifican
- **`clients`**: 🟡 **COLABORATIVA** - Vendedores + admins
- **`properties`**: 🟡 **MODERADA** - Por rol con lectura pública  
- **`visits`**: 🟡 **COLABORATIVA** - Vendedores + admins (trabajo en equipo) 