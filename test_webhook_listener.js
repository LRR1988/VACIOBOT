// Script para verificar si el webhook está recibiendo eventos de Stripe
const express = require('express');
const app = express();
const port = 3001;

// Middleware para manejar el cuerpo raw para webhooks
app.use('/webhook-test', express.raw({ type: 'application/json' }));

// Endpoint para probar el webhook
app.post('/webhook-test', (req, res) => {
  console.log('=== WEBHOOK TEST RECIBIDO ===');
  console.log('Fecha:', new Date().toISOString());
  console.log('Headers:', JSON.stringify(req.headers, null, 2));
  
  try {
    const event = JSON.parse(req.body);
    console.log('Evento recibido:', event.type);
    console.log('Datos del evento:', JSON.stringify(event.data?.object || {}, null, 2));
    
    // Verificar si es un evento de checkout completado
    if (event.type === 'checkout.session.completed') {
      console.log('*** SESIÓN DE CHECKOUT COMPLETADA ***');
      console.log('ID de sesión:', event.data.object.id);
      console.log('Metadatos:', JSON.stringify(event.data.object.metadata || {}, null, 2));
      console.log('Monto total:', event.data.object.amount_total);
    }
    
    res.json({ received: true });
  } catch (error) {
    console.error('Error procesando webhook:', error);
    res.status(400).send(`Webhook Error: ${error.message}`);
  }
});

// Ruta para mostrar ayuda
app.get('/', (req, res) => {
  res.send(`
    <h2>Tester de Webhook de Stripe</h2>
    <p>Envía solicitudes POST a <code>/webhook-test</code> para probar el webhook.</p>
    <p>El webhook real de Stripe está en <code>/webhook</code> en el servidor principal.</p>
    <p>Para probar con Stripe CLI:</p>
    <pre>stripe listen --forward-to http://tu-servidor:3001/webhook-test</pre>
  `);
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Tester de webhook escuchando en http://0.0.0.0:${port}`);
  console.log(`Prueba en: http://0.0.0.0:${port}/`);
});