/*
  # Insertar datos de ejemplo

  1. Agentes (ya insertados en create_agents.sql)
  2. Propiedades de ejemplo
  3. Usuario administrador por defecto
*/

-- Insertar propiedades de ejemplo (usando los IDs de agentes existentes)
DO $$
DECLARE
  agent1_id uuid;
  agent2_id uuid;
BEGIN
  -- Obtener IDs de agentes
  SELECT id INTO agent1_id FROM agents WHERE email = 'maria@axtellpropiedades.com';
  SELECT id INTO agent2_id FROM agents WHERE email = 'carlos@axtellpropiedades.com';

  -- Insertar propiedades
  INSERT INTO properties (
    title, description, price, property_type, listing_type, 
    bedrooms, bathrooms, area, address, city, neighborhood,
    latitude, longitude, features, images, agent_id,
    available_visit_days, available_visit_hours, is_featured
  ) VALUES
  (
    'Casa Moderna en Zona Residencial',
    'Hermosa casa de dos plantas en excelente ubicación. Cuenta con amplio jardín, garaje para dos vehículos y acabados de primera calidad.',
    280000000,
    'casa',
    'sale',
    4, 3, 280,
    'Av. Principal 1234',
    'Santiago',
    'Las Condes',
    -33.4489, -70.6693,
    ARRAY['Jardín', 'Garaje', 'Piscina', 'Seguridad 24h', 'Cocina equipada'],
    ARRAY[
      'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    agent1_id,
    ARRAY['monday', 'tuesday', 'wednesday', 'friday'],
    ARRAY['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'],
    true
  ),
  (
    'Apartamento Luminoso Centro',
    'Departamento de 2 ambientes en pleno centro de la ciudad. Ideal para inversión o primera vivienda. Excelente conectividad.',
    145000000,
    'apartamento',
    'sale',
    2, 1, 65,
    'Calle Central 567',
    'Santiago',
    'Centro',
    -33.4372, -70.6506,
    ARRAY['Balcón', 'Portero eléctrico', 'Ascensor', 'Calefacción central'],
    ARRAY[
      'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1571468/pexels-photo-1571468.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    agent2_id,
    ARRAY['tuesday', 'thursday', 'saturday'],
    ARRAY['10:00', '11:00', '15:00', '16:00', '17:00'],
    false
  ),
  (
    'Terreno Comercial Estratégico',
    'Lote comercial en zona de alto tránsito. Ideal para desarrollo comercial o residencial. Todos los servicios disponibles.',
    180000000,
    'terreno',
    'sale',
    NULL, NULL, 450,
    'Ruta Nacional 789',
    'Santiago',
    'Maipú',
    -33.5110, -70.7580,
    ARRAY['Esquina', 'Agua corriente', 'Energía eléctrica', 'Gas natural', 'Cloacas'],
    ARRAY['https://images.pexels.com/photos/2402235/pexels-photo-2402235.jpeg?auto=compress&cs=tinysrgb&w=800'],
    agent1_id,
    ARRAY['monday', 'wednesday', 'friday'],
    ARRAY['09:00', '10:00', '14:00', '15:00'],
    false
  ),
  (
    'Oficina Premium Microcentro',
    'Oficina completamente equipada en edificio corporativo. Vista panorámica, aire acondicionado central y estacionamiento.',
    1450000,
    'oficina',
    'rent',
    NULL, 2, 120,
    'Torre Empresarial, Piso 15',
    'Santiago',
    'Providencia',
    -33.4255, -70.6110,
    ARRAY['Aire acondicionado', 'Internet fibra óptica', 'Estacionamiento', 'Seguridad', 'Recepción'],
    ARRAY[
      'https://images.pexels.com/photos/380769/pexels-photo-380769.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1170412/pexels-photo-1170412.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    agent2_id,
    ARRAY['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
    ARRAY['09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00'],
    true
  ),
  (
    'Casa Familiar con Piscina',
    'Amplia casa familiar en barrio tranquilo. Perfecta para familias, con gran patio, piscina y parrilla. Muy luminosa.',
    1800000,
    'casa',
    'rent',
    3, 2, 180,
    'Barrio Los Olivos 456',
    'Santiago',
    'Ñuñoa',
    -33.4569, -70.5987,
    ARRAY['Piscina', 'Parrilla', 'Garaje', 'Jardín amplio', 'Cocina equipada', 'Lavadero'],
    ARRAY[
      'https://images.pexels.com/photos/1396132/pexels-photo-1396132.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1115804/pexels-photo-1115804.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/2121121/pexels-photo-2121121.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    agent1_id,
    ARRAY['saturday', 'sunday'],
    ARRAY['10:00', '11:00', '15:00', '16:00'],
    false
  ),
  (
    'Local Comercial Céntrico',
    'Local comercial en la principal avenida comercial. Gran vidriera, excelente ubicación para cualquier tipo de negocio.',
    1200000,
    'comercial',
    'rent',
    NULL, 1, 80,
    'Av. Comercial 890',
    'Santiago',
    'Santiago Centro',
    -33.4378, -70.6504,
    ARRAY['Gran vidriera', 'Depósito', 'Aire acondicionado', 'Alarma', 'Acceso para discapacitados'],
    ARRAY['https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg?auto=compress&cs=tinysrgb&w=800'],
    agent2_id,
    ARRAY['monday', 'wednesday', 'friday'],
    ARRAY['09:00', '10:00', '11:00', '14:00', '15:00'],
    false
  );

  -- Actualizar contadores de vistas para simular actividad
  UPDATE properties SET views_count = 156 WHERE title = 'Casa Moderna en Zona Residencial';
  UPDATE properties SET views_count = 89 WHERE title = 'Apartamento Luminoso Centro';
  UPDATE properties SET views_count = 67 WHERE title = 'Terreno Comercial Estratégico';
  UPDATE properties SET views_count = 45 WHERE title = 'Oficina Premium Microcentro';
  UPDATE properties SET views_count = 134 WHERE title = 'Casa Familiar con Piscina';
  UPDATE properties SET views_count = 78 WHERE title = 'Local Comercial Céntrico';

END $$;