# 🔍 DIAGNÓSTICO DE SUPABASE

## Paso 1: Verificar Variables de Entorno

1. **Abre la consola del navegador** (F12 → Console)
2. **Ejecuta estos comandos uno por uno:**

```javascript
// Verificar que las variables estén cargadas
console.log('VITE_SUPABASE_URL:', import.meta.env.VITE_SUPABASE_URL);
console.log('VITE_SUPABASE_ANON_KEY:', import.meta.env.VITE_SUPABASE_ANON_KEY);
```

**✅ DEBE mostrar:** 
- URL de tu proyecto Supabase (ej: `https://xxxxx.supabase.co`)
- Tu anon key (empieza con `eyJhbGciOiJ...`)

**❌ Si muestra `undefined`:** El archivo `.env` no está bien configurado.

## Paso 2: Verificar Conexión Básica

```javascript
// Probar conexión básica a Supabase
import { supabase } from './src/supabase/supabaseClient';

// En la consola del navegador:
supabase.auth.getSession().then(result => {
  console.log('Conexión Supabase:', result);
}).catch(error => {
  console.error('Error de conexión:', error);
});
```

## Paso 3: Verificar Estado del AuthContext

En la consola del navegador, pega esto:

```javascript
// Ver el estado actual del AuthContext
console.log('AuthContext loading state check');
```

## 🚨 SOLUCIONES RÁPIDAS:

### Si las variables son `undefined`:

1. **Crear/verificar `.env` en la raíz del proyecto:**
```env
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu_clave_anonima_aqui
```

2. **Reiniciar el servidor:**
```bash
npm run dev
```

### Si hay error de conexión:

1. Verificar que el proyecto de Supabase esté activo
2. Verificar que las URLs sean correctas
3. Verificar que las políticas RLS permitan acceso

## 📋 CHECKLIST RÁPIDO:

- [ ] Archivo `.env` existe en la raíz
- [ ] Variables no son `undefined` en consola
- [ ] Proyecto Supabase está activo
- [ ] Tablas creadas según `SUPABASE_SETUP.md`
- [ ] Usuario admin existe en Authentication
- [ ] Perfil admin existe en tabla `profiles` 