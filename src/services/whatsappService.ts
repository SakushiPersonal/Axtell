import { WhatsAppMessage, Property, Client } from '../types';

class WhatsAppService {
  /**
   * Genera una URL de WhatsApp con el mensaje pre-formateado
   */
  generateWhatsAppUrl(phone: string, message: string): string {
    // Limpiar el número de teléfono - quitar caracteres especiales
    const cleanPhone = phone.replace(/[^\d+]/g, '');
    
    // Codificar el mensaje para URL
    const encodedMessage = encodeURIComponent(message);
    
    // Generar URL de WhatsApp
    return `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
  }

  /**
   * Formatea el mensaje de notificación para una propiedad
   */
  formatPropertyMessage(client: Client, property: Property): string {
    const propertyType = property.propertyType === 'house' ? 'Casa' :
                        property.propertyType === 'apartment' ? 'Departamento' :
                        property.propertyType === 'commercial' ? 'Local Comercial' : 'Terreno';
    
    const operationType = property.type === 'sale' ? 'Venta' : 'Arriendo';
    
    const price = new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0,
    }).format(property.price);

    // 🔗 GENERAR LINK DIRECTO A LA PROPIEDAD
    const propertyLink = `${window.location.origin}/property/${property.id}`;

    return `🏠 *Nueva Propiedad Disponible*

Hola ${client.name}! 👋

Tenemos una nueva propiedad que podría interesarte:

🏘️ *${property.title}*
📍 *Ubicación:* ${property.location}
💰 *Precio:* ${price}
🏠 *Tipo:* ${propertyType} en ${operationType}
🛏️ *Dormitorios:* ${property.bedrooms}
🚿 *Baños:* ${property.bathrooms}
📐 *Superficie:* ${property.area}m²

📝 *Descripción:*
${property.description}

🔗 *Ver detalles completos:*
${propertyLink}

¿Te interesa conocer más detalles o agendar una visita?

---
*Axtell Propiedades*
Tu inmobiliaria de confianza`;
  }

  /**
   * Verifica si un cliente coincide con los criterios de una propiedad
   */
  clientMatchesProperty(client: Client, property: Property): boolean {
    // Mapear tipos para comparación
    const clientType = client.type === 'venta' ? 'sale' : client.type === 'arriendo' ? 'rent' : 'ambas';
    
    // Verificar tipo de operación
    if (clientType !== 'ambas' && clientType !== property.type) {
      return false;
    }

    // Verificar rango de precio
    if (client.budgetMin && property.price < client.budgetMin) {
      return false;
    }
    if (client.budgetMax && property.price > client.budgetMax) {
      return false;
    }

    // Verificar rango de habitaciones (solo si ambos valores existen)
    if (client.roomsMin && property.bedrooms !== undefined && property.bedrooms < client.roomsMin) {
      return false;
    }
    if (client.roomsMax && property.bedrooms !== undefined && property.bedrooms > client.roomsMax) {
      return false;
    }

    // Verificar ubicación (coincidencia parcial)
    if (client.ubication && !property.location.toLowerCase().includes(client.ubication.toLowerCase())) {
      return false;
    }

    return true;
  }

  /**
   * Genera datos de mensajes de WhatsApp para insertar en la base de datos
   */
  generateMessagesForProperty(property: Property, clients: Client[], createdBy?: string) {
    const messages = [];
    
    for (const client of clients) {
      if (this.clientMatchesProperty(client, property)) {
        const message = this.formatPropertyMessage(client, property);
        const whatsappUrl = this.generateWhatsAppUrl(client.phone, message);
        
        const messageData = {
          client_id: client.id,
          property_id: property.id,
          client_name: client.name,
          client_phone: client.phone,
          property_title: property.title,
          property_price: property.price,
          message,
          whatsapp_url: whatsappUrl,
          created_by: createdBy
        };
        
        messages.push(messageData);
      }
    }
    
    return messages;
  }

  /**
   * Abre una URL de WhatsApp en una nueva ventana
   */
  openWhatsApp(whatsappUrl: string): void {
    window.open(whatsappUrl, '_blank');
  }
}

const whatsappService = new WhatsAppService();
export default whatsappService; 