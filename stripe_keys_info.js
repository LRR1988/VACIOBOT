/**
 * Claves de Stripe para Travabus (Ejemplo)
 * 
 * Esta información es importante para la configuración del sistema de pagos.
 * 
 * Clave Pública (Publishable Key):
 * your_stripe_publishable_key
 * 
 * Clave Secreta (Secret Key):
 * your_stripe_secret_key
 * 
 * Webhook Signing Secret:
 * your_stripe_webhook_secret
 * 
 * Nota: 
 * - La clave pública es segura de almacenar en el frontend
 * - La clave secreta debe mantenerse en el servidor y nunca exponerse en el cliente
 * - La webhook signing secret se usa para validar los eventos recibidos de Stripe
 */

// Información de configuración de Stripe (con valores de ejemplo)
const stripeConfig = {
  publishableKey: 'your_stripe_publishable_key',
  secretKey: 'your_stripe_secret_key',
  webhookEndpoint: 'http://13.51.166.237:3000/webhook',
  webhookSecret: 'your_stripe_webhook_secret'
};

console.log('🔐 Claves de Stripe para Travabus (ejemplo)');
console.log('Clave Pública (Frontend):', stripeConfig.publishableKey);
console.log('Clave Secreta (Backend):', stripeConfig.secretKey);
console.log('Webhook Signing Secret:', stripeConfig.webhookSecret);
console.log('Endpoint Webhook:', stripeConfig.webhookEndpoint);

module.exports = stripeConfig;