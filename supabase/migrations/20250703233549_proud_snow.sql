/*
  # Tabla de favoritos de usuarios

  1. Nueva Tabla
    - `user_favorites`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references user_profiles)
      - `property_id` (uuid, references properties)
      - `created_at` (timestamp)

  2. Seguridad
    - Enable RLS
    - Políticas para que usuarios gestionen sus favoritos
*/

CREATE TABLE IF NOT EXISTS user_favorites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  property_id uuid NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, property_id)
);

-- Habilitar RLS
ALTER TABLE user_favorites ENABLE ROW LEVEL SECURITY;

-- Políticas de seguridad
CREATE POLICY "Los usuarios pueden ver sus favoritos"
  ON user_favorites
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Los usuarios pueden agregar favoritos"
  ON user_favorites
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Los usuarios pueden eliminar sus favoritos"
  ON user_favorites
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Índices para mejor rendimiento
CREATE INDEX idx_user_favorites_user_id ON user_favorites(user_id);
CREATE INDEX idx_user_favorites_property_id ON user_favorites(property_id);

-- Función para toggle favoritos con actualización de contador
CREATE OR REPLACE FUNCTION toggle_user_favorite(property_id uuid)
RETURNS boolean AS $$
DECLARE
  user_uuid uuid := auth.uid();
  favorite_exists boolean;
BEGIN
  -- Verificar si ya existe el favorito
  SELECT EXISTS(
    SELECT 1 FROM user_favorites 
    WHERE user_id = user_uuid AND property_id = toggle_user_favorite.property_id
  ) INTO favorite_exists;
  
  IF favorite_exists THEN
    -- Eliminar favorito
    DELETE FROM user_favorites 
    WHERE user_id = user_uuid AND property_id = toggle_user_favorite.property_id;
    
    -- Decrementar contador
    PERFORM toggle_property_favorite(toggle_user_favorite.property_id, false);
    
    RETURN false;
  ELSE
    -- Agregar favorito
    INSERT INTO user_favorites (user_id, property_id) 
    VALUES (user_uuid, toggle_user_favorite.property_id);
    
    -- Incrementar contador
    PERFORM toggle_property_favorite(toggle_user_favorite.property_id, true);
    
    RETURN true;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;