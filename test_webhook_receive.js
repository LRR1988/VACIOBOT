const express = require('express');
const cors = require('cors');
const app = express();

// Middleware para parsear raw body para el webhook de Stripe
app.use('/webhook', express.raw({ type: 'application/json' }));

// Middleware para CORS y parsing de JSON
app.use(cors());
app.use(express.json());

// Ruta de prueba para webhook
app.post('/webhook', (req, res) => {
  console.log('=== RECIBIDO WEBHOOK ===');
  console.log('Headers:', req.headers);
  console.log('Body length:', req.body.length);
  console.log('Body preview:', req.body.toString().substring(0, 500)); // Solo primeros 500 caracteres
  console.log('========================');
  
  try {
    const event = JSON.parse(req.body);
    console.log('Evento tipo:', event.type);
    console.log('Datos del evento:', JSON.stringify(event.data?.object || {}, null, 2));
  } catch (error) {
    console.error('Error parseando evento:', error);
  }
  
  res.status(200).send('OK');
});

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('Test server running');
});

const PORT = 3001;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor de prueba para webhook escuchando en http://0.0.0.0:${PORT}`);
  console.log('Webhook endpoint en: http://0.0.0.0:3000/webhook');
});