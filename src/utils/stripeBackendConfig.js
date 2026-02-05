// Archivo para cargar la configuración de Stripe desde el backend
// Este archivo se carga dinámicamente desde /config.js para obtener la clave pública

// Función para cargar la configuración de Stripe desde el backend
export const loadStripeConfig = async () => {
  try {
    // Cargar el script de configuración del backend
    const script = document.createElement('script');
    script.src = '/config.js';
    script.async = false; // Necesario para asegurar que se ejecute antes que otros scripts
    
    await new Promise((resolve, reject) => {
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
    
    // Verificar si la clave está disponible en la variable global
    if (window.__STRIPE_PK__) {
      // Guardar la clave en localStorage para su uso posterior
      localStorage.setItem('stripe_publishable_key', window.__STRIPE_PK__);
      return window.__STRIPE_PK__;
    } else {
      throw new Error('No se pudo obtener la clave pública de Stripe del backend');
    }
  } catch (error) {
    console.error('Error al cargar la configuración de Stripe:', error);
    throw error;
  }
};

// Función para inicializar Stripe con la clave del backend
export const initStripeWithBackendConfig = async () => {
  try {
    // Primero cargar la configuración
    const publishableKey = await loadStripeConfig();
    
    // Cargar el script de Stripe si no está disponible
    if (!window.Stripe) {
      const stripeScript = document.createElement('script');
      stripeScript.src = 'https://js.stripe.com/v3/';
      document.head.appendChild(stripeScript);
      
      await new Promise((resolve) => {
        stripeScript.onload = resolve;
      });
    }
    
    // Inicializar Stripe con la clave obtenida del backend
    return window.Stripe(publishableKey);
  } catch (error) {
    console.error('Error al inicializar Stripe con la configuración del backend:', error);
    throw error;
  }
};