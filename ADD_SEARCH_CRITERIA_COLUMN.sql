-- 🚀 MIGRACIÓN OPCIONAL: Agregar campo searchCriteria a tabla clients
-- NOTA: Esta migración es OPCIONAL - el sistema funciona sin ella gracias a los convertidores inteligentes

-- Agregar campo searchCriteria como JSONB para mayor flexibilidad
ALTER TABLE clients 
ADD COLUMN search_criteria JSONB DEFAULT NULL;

-- Comentario descriptivo
COMMENT ON COLUMN clients.search_criteria IS 'Criterios de búsqueda estructurados del cliente en formato JSON. Este campo es opcional y se reconstruye automáticamente desde otros campos si no existe.';

-- Índice para búsquedas eficientes en el futuro (opcional)
CREATE INDEX IF NOT EXISTS idx_clients_search_criteria_operation_type 
ON clients USING GIN ((search_criteria->>'operationType'));

CREATE INDEX IF NOT EXISTS idx_clients_search_criteria_property_types 
ON clients USING GIN ((search_criteria->'propertyTypes'));

-- Ejemplo de estructura esperada:
/*
{
  "operationType": "sale",
  "propertyTypes": ["house", "apartment"],
  "budget": {
    "min": 80000000,
    "max": 150000000
  },
  "location": "las condes",
  "bedrooms": {
    "min": 3,
    "max": 5
  },
  "bathrooms": {
    "min": 2
  },
  "area": {
    "min": 120
  },
  "requiredFeatures": ["estacionamiento", "jardín"],
  "preferredFeatures": ["piscina", "terraza"]
}
*/

-- Verificar que se agregó correctamente
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'clients' AND column_name = 'search_criteria'; 