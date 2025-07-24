# Configuración de Supabase para Axtell

Esta guía te ayudará a configurar la base de datos en Supabase para el proyecto Axtell.

## 1. Configuración Inicial

### Variables de Entorno
Asegúrate de tener las siguientes variables en tu archivo `.env`:

```env
VITE_SUPABASE_URL=tu_url_de_supabase
VITE_SUPABASE_ANON_KEY=tu_clave_anonima_de_supabase
```

## 2. Creación de Tablas

### 2.1. Tabla `profiles`
Esta tabla almacena los perfiles de usuario vinculados a la autenticación de Supabase.

```sql
-- Crear tabla profiles
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('admin', 'vendedor', 'captador')),
    phone TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_active BOOLEAN DEFAULT TRUE
);

-- Habilitar RLS (Row Level Security)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Políticas de seguridad
CREATE POLICY "Profiles are viewable by authenticated users" 
ON profiles FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Users can insert their own profile" 
ON profiles FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
ON profiles FOR UPDATE 
TO authenticated 
USING (auth.uid() = id);

-- Trigger para crear perfil automáticamente al registrarse
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, role)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'name', 'Usuario'), 
          COALESCE(NEW.raw_user_meta_data->>'role', 'vendedor'));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Trigger para updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION handle_updated_at();
```

### 2.2. Tabla `properties`
Almacena las propiedades inmobiliarias.

```sql
-- Crear tabla properties
CREATE TABLE properties (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    price NUMERIC NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('sale', 'rent')),
    property_type TEXT NOT NULL CHECK (property_type IN ('house', 'apartment', 'commercial', 'land')),
    bedrooms INTEGER,
    bathrooms INTEGER,
    area NUMERIC NOT NULL,
    location TEXT NOT NULL,
    address TEXT NOT NULL,
    images TEXT[] DEFAULT '{}',
    features TEXT[] DEFAULT '{}',
    status TEXT DEFAULT 'available' CHECK (status IN ('available', 'sold', 'rented', 'pending')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    captador_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    views INTEGER DEFAULT 0
);

-- Habilitar RLS
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;

-- Políticas de seguridad
CREATE POLICY "Properties are viewable by all authenticated users" 
ON properties FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Captadores can insert properties" 
ON properties FOR INSERT 
TO authenticated 
WITH CHECK (
    EXISTS (
        SELECT 1 FROM profiles 
        WHERE id = auth.uid() 
        AND role IN ('captador', 'admin')
    )
);

CREATE POLICY "Captadores can update their own properties or admins can update any" 
ON properties FOR UPDATE 
TO authenticated 
USING (
    captador_id = auth.uid() OR 
    EXISTS (
        SELECT 1 FROM profiles 
        WHERE id = auth.uid() 
        AND role = 'admin'
    )
);

CREATE POLICY "Captadores can delete their own properties or admins can delete any" 
ON properties FOR DELETE 
TO authenticated 
USING (
    captador_id = auth.uid() OR 
    EXISTS (
        SELECT 1 FROM profiles 
        WHERE id = auth.uid() 
        AND role = 'admin'
    )
);

-- Trigger para updated_at
CREATE TRIGGER properties_updated_at
    BEFORE UPDATE ON properties
    FOR EACH ROW
    EXECUTE FUNCTION handle_updated_at();

-- Índices para mejor rendimiento
CREATE INDEX idx_properties_type ON properties(type);
CREATE INDEX idx_properties_property_type ON properties(property_type);
CREATE INDEX idx_properties_status ON properties(status);
CREATE INDEX idx_properties_captador_id ON properties(captador_id);
CREATE INDEX idx_properties_location ON properties(location);
```

### 2.3. Tabla `clients`
Almacena los clientes potenciales.

```sql
-- Crear tabla clients
CREATE TABLE clients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    interests TEXT[] DEFAULT '{}',
    budget_min NUMERIC,
    budget_max NUMERIC,
    preferred_property_types TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    vendedor_id UUID REFERENCES profiles(id) ON DELETE SET NULL
);

-- Habilitar RLS
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;

-- Políticas de seguridad
CREATE POLICY "Clients are viewable by authenticated users" 
ON clients FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Vendedores can insert clients" 
ON clients FOR INSERT 
TO authenticated 
WITH CHECK (
    EXISTS (
        SELECT 1 FROM profiles 
        WHERE id = auth.uid() 
        AND role IN ('vendedor', 'admin')
    )
);

CREATE POLICY "Vendedores can update their clients or admins can update any" 
ON clients FOR UPDATE 
TO authenticated 
USING (
    vendedor_id = auth.uid() OR 
    EXISTS (
        SELECT 1 FROM profiles 
        WHERE id = auth.uid() 
        AND role = 'admin'
    )
);

CREATE POLICY "Vendedores can delete their clients or admins can delete any" 
ON clients FOR DELETE 
TO authenticated 
USING (
    vendedor_id = auth.uid() OR 
    EXISTS (
        SELECT 1 FROM profiles 
        WHERE id = auth.uid() 
        AND role = 'admin'
    )
);

-- Trigger para updated_at
CREATE TRIGGER clients_updated_at
    BEFORE UPDATE ON clients
    FOR EACH ROW
    EXECUTE FUNCTION handle_updated_at();

-- Índices
CREATE INDEX idx_clients_vendedor_id ON clients(vendedor_id);
CREATE INDEX idx_clients_email ON clients(email);
```

### 2.4. Tabla `visits`
Almacena las visitas programadas a las propiedades.

```sql
-- Crear tabla visits
CREATE TABLE visits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    client_name TEXT NOT NULL,
    client_email TEXT NOT NULL,
    client_phone TEXT NOT NULL,
    preferred_date DATE NOT NULL,
    preferred_time TIME NOT NULL,
    message TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    vendedor_id UUID REFERENCES profiles(id) ON DELETE SET NULL
);

-- Habilitar RLS
ALTER TABLE visits ENABLE ROW LEVEL SECURITY;

-- Políticas de seguridad
CREATE POLICY "Visits are viewable by authenticated users" 
ON visits FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Anyone can insert visits" 
ON visits FOR INSERT 
TO anon, authenticated 
WITH CHECK (true);

CREATE POLICY "Vendedores can update visits assigned to them or admins can update any" 
ON visits FOR UPDATE 
TO authenticated 
USING (
    vendedor_id = auth.uid() OR 
    EXISTS (
        SELECT 1 FROM profiles 
        WHERE id = auth.uid() 
        AND role = 'admin'
    )
);

CREATE POLICY "Vendedores can delete visits assigned to them or admins can delete any" 
ON visits FOR DELETE 
TO authenticated 
USING (
    vendedor_id = auth.uid() OR 
    EXISTS (
        SELECT 1 FROM profiles 
        WHERE id = auth.uid() 
        AND role = 'admin'
    )
);

-- Trigger para updated_at
CREATE TRIGGER visits_updated_at
    BEFORE UPDATE ON visits
    FOR EACH ROW
    EXECUTE FUNCTION handle_updated_at();

-- Índices
CREATE INDEX idx_visits_property_id ON visits(property_id);
CREATE INDEX idx_visits_vendedor_id ON visits(vendedor_id);
CREATE INDEX idx_visits_status ON visits(status);
CREATE INDEX idx_visits_preferred_date ON visits(preferred_date);
```

## 3. Funciones de Base de Datos

### 3.1. Función para incrementar vistas de propiedades

```sql
-- Función para incrementar las vistas de una propiedad
CREATE OR REPLACE FUNCTION increment_property_views(property_id UUID)
RETURNS VOID AS $$
BEGIN
    UPDATE properties 
    SET views = views + 1 
    WHERE id = property_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

## 4. Datos de Ejemplo (Opcional)

Para probar la aplicación, puedes insertar algunos datos de ejemplo:

```sql
-- Insertar usuarios de ejemplo (después de que se registren en auth)
-- Estos se crearán automáticamente con el trigger cuando los usuarios se registren

-- Insertar propiedades de ejemplo
INSERT INTO properties (title, description, price, type, property_type, bedrooms, bathrooms, area, location, address, images, features, captador_id) VALUES
('Casa Moderna en Las Condes', 'Hermosa casa moderna con vista panorámica', 450000000, 'sale', 'house', 4, 3, 280, 'Las Condes, Santiago', 'Av. Kennedy 5678', 
 ARRAY['https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=800'], 
 ARRAY['Piscina', 'Jardín', 'Garaje', 'Terraza', 'Vista panorámica'], 
 (SELECT id FROM profiles WHERE role = 'captador' LIMIT 1));

-- Insertar clientes de ejemplo
INSERT INTO clients (name, email, phone, interests, budget_min, budget_max, preferred_property_types, vendedor_id) VALUES
('Carlos Rodríguez', 'carlos@email.com', '+56912345678', ARRAY['Casa', 'Las Condes'], 300000000, 500000000, ARRAY['house'], 
 (SELECT id FROM profiles WHERE role = 'vendedor' LIMIT 1));
```

## 5. Configuración de Storage (Opcional)

Si quieres almacenar imágenes en Supabase Storage:

```sql
-- Crear bucket para imágenes de propiedades
INSERT INTO storage.buckets (id, name, public) VALUES ('property-images', 'property-images', true);

-- Política para permitir subida de imágenes
CREATE POLICY "Allow authenticated uploads" ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'property-images');

CREATE POLICY "Allow public viewing" ON storage.objects
FOR SELECT TO public
USING (bucket_id = 'property-images');
```

## 6. Verificación

Para verificar que todo está configurado correctamente:

1. Ve a la interfaz de Supabase
2. Revisa que todas las tablas se hayan creado
3. Verifica que las políticas de RLS estén activas
4. Prueba registrando un usuario y verifica que se cree automáticamente el perfil

## 7. Troubleshooting

### Error: "relation does not exist"
- Asegúrate de haber ejecutado todos los scripts SQL en el orden correcto
- Verifica que estés ejecutando los scripts en el esquema `public`

### Error: "permission denied"
- Revisa que las políticas de RLS estén configuradas correctamente
- Verifica que el usuario esté autenticado

### Error de conexión
- Verifica que las variables de entorno estén configuradas correctamente
- Asegúrate de que el proyecto de Supabase esté activo

¡Tu base de datos Supabase ya está lista para usar con la aplicación Axtell! 