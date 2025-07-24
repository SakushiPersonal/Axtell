-- Crear tabla para mensajes de WhatsApp pendientes
CREATE TABLE whatsapp_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  client_name TEXT NOT NULL,
  client_phone TEXT NOT NULL,
  property_title TEXT NOT NULL,
  property_price BIGINT NOT NULL,
  message TEXT NOT NULL,
  whatsapp_url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  created_by UUID REFERENCES profiles(id) ON DELETE SET NULL
);

-- Crear índices para mejorar performance
CREATE INDEX idx_whatsapp_messages_client_id ON whatsapp_messages(client_id);
CREATE INDEX idx_whatsapp_messages_property_id ON whatsapp_messages(property_id);
CREATE INDEX idx_whatsapp_messages_created_at ON whatsapp_messages(created_at);
CREATE INDEX idx_whatsapp_messages_created_by ON whatsapp_messages(created_by);

-- Habilitar RLS (Row Level Security)
ALTER TABLE whatsapp_messages ENABLE ROW LEVEL SECURITY;

-- Política para que usuarios autenticados puedan ver todos los mensajes
CREATE POLICY "Users can view all whatsapp messages" ON whatsapp_messages
  FOR SELECT USING (auth.role() = 'authenticated');

-- Política para que usuarios autenticados puedan crear mensajes
CREATE POLICY "Users can create whatsapp messages" ON whatsapp_messages
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Política para que usuarios autenticados puedan eliminar mensajes (cuando se envían)
CREATE POLICY "Users can delete whatsapp messages" ON whatsapp_messages
  FOR DELETE USING (auth.role() = 'authenticated');

-- Comentarios para documentación
COMMENT ON TABLE whatsapp_messages IS 'Almacena mensajes de WhatsApp pendientes de envío';
COMMENT ON COLUMN whatsapp_messages.client_id IS 'ID del cliente destinatario';
COMMENT ON COLUMN whatsapp_messages.property_id IS 'ID de la propiedad relacionada';
COMMENT ON COLUMN whatsapp_messages.client_name IS 'Nombre del cliente (desnormalizado para performance)';
COMMENT ON COLUMN whatsapp_messages.client_phone IS 'Teléfono del cliente (desnormalizado para performance)';
COMMENT ON COLUMN whatsapp_messages.property_title IS 'Título de la propiedad (desnormalizado para performance)';
COMMENT ON COLUMN whatsapp_messages.property_price IS 'Precio de la propiedad (desnormalizado para performance)';
COMMENT ON COLUMN whatsapp_messages.message IS 'Mensaje completo a enviar';
COMMENT ON COLUMN whatsapp_messages.whatsapp_url IS 'URL completa de WhatsApp con mensaje codificado';
COMMENT ON COLUMN whatsapp_messages.created_by IS 'Usuario que generó el mensaje'; 