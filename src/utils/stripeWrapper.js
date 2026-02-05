// Wrapper de seguridad para Stripe - previene el error CheckoutInitError: apiKey is not set
// Este archivo asegura que Stripe siempre tenga la clave disponible antes de ser usado

let stripeInstance = null;
let stripeLoadingPromise = null;

// Clave pública predeterminada
const DEFAULT_STRIPE_PUBLISHABLE_KEY = 'pk_test_51S95M9I567TRM2KW04qCZLh6w65hzKvL6GOdjqjSh3a946sX50PMvNkJC29fms6p1ZUk2zoT7T0zSwFdyyjnjNah00X6iMaecC';

// Función para obtener la clave pública de Stripe
const getStripePublishableKey = () => {
  // Intentar obtener la clave de localStorage primero
  const keyFromStorage = localStorage.getItem('stripe_publishable_key');
  if (keyFromStorage) {
    return keyFromStorage;
  }
  
  // Si no está en localStorage, usar la clave predeterminada
  localStorage.setItem('stripe_publishable_key', DEFAULT_STRIPE_PUBLISHABLE_KEY);
  return DEFAULT_STRIPE_PUBLISHABLE_KEY;
};

// Función para cargar Stripe de forma segura
export const loadStripeSafely = async () => {
  // Si ya hay una promesa de carga en curso, esperarla
  if (stripeLoadingPromise) {
    return stripeLoadingPromise;
  }

  // Si ya tenemos una instancia, devolverla
  if (stripeInstance) {
    return stripeInstance;
  }

  // Crear una nueva promesa de carga
  stripeLoadingPromise = new Promise(async (resolve, reject) => {
    try {
      // Asegurar que la clave esté disponible
      const publishableKey = getStripePublishableKey();
      
      if (!publishableKey) {
        throw new Error('No se encontró la clave pública de Stripe');
      }

      // Verificar si Stripe ya está disponible globalmente
      if (typeof window !== 'undefined' && window.Stripe) {
        stripeInstance = window.Stripe(publishableKey);
      } else {
        // Cargar el script de Stripe si no está disponible
        const stripeScript = document.createElement('script');
        stripeScript.src = 'https://js.stripe.com/v3/';
        stripeScript.async = true;
        
        stripeScript.onload = () => {
          if (window.Stripe) {
            stripeInstance = window.Stripe(publishableKey);
            stripeLoadingPromise = null;
            resolve(stripeInstance);
          } else {
            stripeLoadingPromise = null;
            reject(new Error('Stripe no se inicializó correctamente después de cargar el script'));
          }
        };
        
        stripeScript.onerror = () => {
          stripeLoadingPromise = null;
          reject(new Error('Error al cargar el script de Stripe'));
        };
        
        document.head.appendChild(stripeScript);
      }

      // Si Stripe ya estaba disponible, resolver inmediatamente
      if (window.Stripe && !stripeInstance) {
        stripeInstance = window.Stripe(publishableKey);
      }
      
      if (stripeInstance) {
        stripeLoadingPromise = null;
        resolve(stripeInstance);
      }
    } catch (error) {
      stripeLoadingPromise = null;
      reject(error);
    }
  });

  return stripeLoadingPromise;
};

// Función para reiniciar la instancia de Stripe (útil para pruebas o reconfiguración)
export const resetStripeInstance = () => {
  stripeInstance = null;
  stripeLoadingPromise = null;
};

// Exportar la clave predeterminada también
export { DEFAULT_STRIPE_PUBLISHABLE_KEY as stripePublishableKey };