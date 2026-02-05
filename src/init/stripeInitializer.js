// Archivo de inicialización temprana de Stripe para Travabus
// Este archivo se ejecuta antes que cualquier otro componente

// Verificar si la clave pública de Stripe ya está configurada en localStorage
const STRIPE_PUBLISHABLE_KEY = 'pk_test_51S95M9I567TRM2KW04qCZLh6w65hzKvL6GOdjqjSh3a946sX50PMvNkJC29fms6p1ZUk2zoT7T0zSwFdyyjnjNah00X6iMaecC';

// Asegurarse de que la clave pública esté disponible
if (typeof window !== 'undefined') {
  // Comprobar si ya está en localStorage
  const existingKey = localStorage.getItem('stripe_publishable_key');
  
  if (!existingKey) {
    // Si no existe, establecerla
    localStorage.setItem('stripe_publishable_key', STRIPE_PUBLISHABLE_KEY);
    console.log('🔐 Clave pública de Stripe configurada automáticamente en localStorage');
  } else {
    console.log('🔐 Clave pública de Stripe ya estaba configurada en localStorage');
  }
  
  // También asegurarse de que la clave esté disponible globalmente como propiedad de window
  // para que esté accesible en caso de que algún código la busque de manera inmediata
  if (!window.STRIPE_CONFIG) {
    window.STRIPE_CONFIG = {
      publishableKey: existingKey || STRIPE_PUBLISHABLE_KEY
    };
  }
}

// Exportar para compatibilidad si es usado como módulo
export default {
  publishableKey: typeof window !== 'undefined' ? 
    localStorage.getItem('stripe_publishable_key') || STRIPE_PUBLISHABLE_KEY : 
    STRIPE_PUBLISHABLE_KEY
};