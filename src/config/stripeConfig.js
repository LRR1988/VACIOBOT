// Archivo de configuración predeterminada de Stripe para Travabus
// Este archivo establece la clave pública de Stripe si no está ya configurada

// Clave pública de Stripe
const DEFAULT_STRIPE_PUBLISHABLE_KEY = 'your_stripe_publishable_key';

// Verificar si la clave ya está configurada
const currentKey = localStorage.getItem('stripe_publishable_key');

if (!currentKey) {
  // Si no hay clave configurada, establecer la clave predeterminada
  localStorage.setItem('stripe_publishable_key', DEFAULT_STRIPE_PUBLISHABLE_KEY);
  console.log('🔐 Clave pública de Stripe configurada automáticamente');
} else {
  console.log('🔐 Clave pública de Stripe ya estaba configurada');
}

// Exportar la clave para su uso si es necesario
export { DEFAULT_STRIPE_PUBLISHABLE_KEY };