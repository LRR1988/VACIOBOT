const express = require('express');
const bodyParser = require('body-parser');
const app = express();

// Middleware para parsear el cuerpo como texto sin procesar (necesario para verificar firma de Stripe)
app.use('/webhook', bodyParser.raw({ type: 'application/json' }));

// Simulación de webhook de Stripe para pruebas
app.post('/webhook', (req, res) => {
  console.log('=== WEBHOOK RECIBIDO ===');
  console.log('Fecha:', new Date().toISOString());
  console.log('Headers:', req.headers);
  console.log('Body:', req.body.toString());
  console.log('========================');
  
  // Devolver respuesta exitosa
  res.json({ received: true });
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Servidor de monitoreo de webhooks escuchando en puerto ${PORT}`);
  console.log(`URL: http://localhost:${PORT}/webhook`);
});