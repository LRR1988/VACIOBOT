/**
 * Claves de Stripe para Travabus (Ejemplo)
 * 
 * Esta información es importante para la configuración del sistema de pagos.
 * 
 * Clave Pública (Publishable Key):
 * pk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
 * 
 * Clave Secreta (Secret Key):
 * sk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
 * 
 * Webhook Signing Secret:
 * whsec_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
 * 
 * Nota: 
 * - La clave pública es segura de almacenar en el frontend
 * - La clave secreta debe mantenerse en el servidor y nunca exponerse en el cliente
 * - La webhook signing secret se usa para validar los eventos recibidos de Stripe
 */

// Información de configuración de Stripe (con valores de ejemplo)
const stripeConfig = {
  publishableKey: 'pk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
  secretKey: 'sk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
  webhookEndpoint: 'http://13.51.166.237:3000/webhook',
  webhookSecret: 'whsec_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'
};

console.log('🔐 Claves de Stripe para Travabus (ejemplo)');
console.log('Clave Pública (Frontend):', stripeConfig.publishableKey);
console.log('Clave Secreta (Backend):', stripeConfig.secretKey);
console.log('Webhook Signing Secret:', stripeConfig.webhookSecret);
console.log('Endpoint Webhook:', stripeConfig.webhookEndpoint);

module.exports = stripeConfig;