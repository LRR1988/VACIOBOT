import { db, hasUserHiredAd, isAdHiredByAnyUser } from './database';
import { calculateCommission } from './helpers';

/**
 * Crear una sesión de checkout para un anuncio (simulación para frontend)
 * En una implementación completa, esto llamaría a una API backend
 * @param {Object} ad - El anuncio para el cual crear el checkout
 * @param {string} userId - El ID del usuario que está contratando el servicio
 * @returns {Object} - Información de la sesión de checkout simulada
 */
export const createCheckoutSession = async (ad, userId) => {
  try {
    // Calcular la comisión (5% del precio con mínimo de 25€)
    const commission = calculateCommission(ad.price);
    const totalAmount = ad.price; // El cliente paga el precio total
    
    // Verificar si el usuario ya ha contratado este anuncio
    const { exists: userAlreadyHired, error: userHireError } = await hasUserHiredAd(userId, ad.id);
    if (userHireError) {
      return {
        success: false,
        error: 'Error verificando contratación previa'
      };
    }
    
    if (userAlreadyHired) {
      return {
        success: false,
        error: 'Ya has contratado este servicio'
      };
    }
    
    // Verificar si el anuncio ya ha sido contratado por cualquier otro usuario
    const { hired: adAlreadyHired, error: adHireError } = await db.isAdHiredByAnyUser(ad.id);
    if (adHireError) {
      return {
        success: false,
        error: 'Error verificando disponibilidad del anuncio'
      };
    }
    
    if (adAlreadyHired) {
      return {
        success: false,
        error: 'Este anuncio ya ha sido contratado por otro usuario'
      };
    }
    
    // En una implementación real, esto haría una llamada a una API backend
    // Por ahora, simulamos la respuesta que vendría del backend
    // que a su vez comunicaría con Stripe en el servidor
    
    // Creamos una URL de checkout simulada (esto se generaría en el backend real)
    const sessionId = `cs_test_${Math.random().toString(36).substr(2, 32)}`;
    const checkoutUrl = `https://checkout.stripe.com/pay/${sessionId}`;
    
    // Simulamos la creación de la sesión en el backend
    // En la práctica, esto se haría con una llamada fetch a nuestro endpoint
    const response = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        adId: ad.id,
        userId: userId,
        price: ad.price,
        productName: `Servicio de transporte - ${ad.route_from} a ${ad.route_to}`,
        productDescription: 'Contratación del servicio',
        commission: commission
      })
    });
    
    if (response.ok) {
      const result = await response.json();
      return result; // { sessionId, url, success: true }
    } else {
      // Si no tenemos un backend real, simulamos la creación de la URL directamente
      // con la API de Stripe.js en el frontend (limitado)
      
      // Para una implementación completa, necesitaríamos crear un endpoint backend
      // para crear sesiones de checkout de forma segura
      
      // Simulamos la respuesta esperada
      return {
        sessionId: sessionId,
        url: checkoutUrl,
        success: true
      };
    }
  } catch (error) {
    console.error('Error creando sesión de checkout:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Simular el manejo del webhook de Stripe (esto se haría en un backend real)
 * @param {Object} payload - El payload del webhook
 * @param {string} signature - La firma del webhook
 * @returns {Object} - Resultado del manejo del webhook
 */
export const handleWebhook = async (payload, signature) => {
  try {
    // En una implementación real, esta función correría en un servidor backend
    // y verificaría la firma del webhook usando la clave secreta de Stripe
    
    // Simulamos el manejo del webhook
    const event = typeof payload === 'string' ? JSON.parse(payload) : payload;
    
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object;
        // Aquí registraríamos la transacción en nuestra base de datos
        await recordTransaction(session);
        break;
        
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object;
        // Manejar el pago exitoso
        break;
        
      default:
        console.log(`Evento no manejado: ${event.type}`);
    }
    
    return { success: true };
  } catch (error) {
    console.error('Error manejando webhook:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Registrar la transacción en la base de datos
 * @param {Object} session - La sesión de checkout completada
 */
const recordTransaction = async (session) => {
  try {
    // Extraer información de la sesión simulada
    const adId = session.metadata?.adId;
    const userId = session.metadata?.userId;
    const commission = parseFloat(session.metadata?.commission) || 0;
    const netToOwner = parseFloat(session.metadata?.netToOwner) || 0;
    const amount = session.amount_total ? session.amount_total / 100 : session.amount || 0;
    
    // Crear registro de transacción
    await db.createTransaction({
      user_id: userId,
      ad_id: adId,
      amount: amount,
      commission: commission,
      net_to_owner: netToOwner,
      stripe_session_id: session.id,
      status: 'completed',
      payment_method: session.payment_method_types?.[0] || 'card',
      currency: session.currency || 'eur',
      description: session.metadata?.description || 'Pago por servicio contratado'
    });
    
    console.log('Transacción registrada exitosamente');
  } catch (error) {
    console.error('Error registrando transacción:', error);
  }
};

/**
 * Obtener información de un pago por ID de sesión
 * @param {string} sessionId - ID de la sesión de Stripe
 * @returns {Object} - Información del pago
 */
export const getPaymentStatus = async (sessionId) => {
  try {
    // En una implementación real, esto llamaría a un endpoint backend
    // que verificaría el estado del pago con la API de Stripe
    
    // Simulamos la respuesta
    return {
      sessionId: sessionId,
      status: 'succeeded', // simulado
      amount: 100, // simulado
      currency: 'eur',
      success: true
    };
  } catch (error) {
    console.error('Error obteniendo estado del pago:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Reembolsar un pago (esto se haría en un backend real)
 * @param {string} paymentIntentId - ID del intento de pago
 * @param {number} amount - Monto a reembolsar (en euros)
 * @returns {Object} - Resultado del reembolso
 */
export const refundPayment = async (paymentIntentId, amount) => {
  try {
    // En una implementación real, esto llamaría a un endpoint backend
    // que procesaría el reembolso usando la API de Stripe
    
    // Simulamos la respuesta
    return {
      refundId: `re_${Math.random().toString(36).substr(2, 32)}`,
      status: 'succeeded',
      success: true
    };
  } catch (error) {
    console.error('Error procesando reembolso:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Función para inicializar Stripe en el frontend (solo para uso público)
 * @returns {Promise<Object>} - Instancia de Stripe para el frontend
 */
export const initStripe = async () => {
  // Cargar el script de Stripe si no está ya cargado
  if (!window.Stripe) {
    const stripeScript = document.createElement('script');
    stripeScript.src = 'https://js.stripe.com/v3/';
    document.head.appendChild(stripeScript);
    
    await new Promise((resolve) => {
      stripeScript.onload = resolve;
    });
  }
  
  // Obtener la clave pública de Stripe desde la configuración
  // En una implementación real, esto vendría de una variable de entorno
  const publishableKey = process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY || 'pk_test_51S95M9I567TRM2KW04qCZLh6w65hzKvL6GOdjqjSh3a946sX50PMvNkJC29fms6p1ZUk2zoT7T0zSwFdyyjnjNah00X6iMaecC';
  
  return window.Stripe(publishableKey);
};