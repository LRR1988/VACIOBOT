/**
 * Script para verificar si el webhook de Stripe está funcionando
 * 
 * Este script crea un servidor temporal para probar si los eventos de webhook
 * están llegando correctamente al servidor.
 */

const express = require('express');
const fs = require('fs');
const path = require('path');

// Crear directorio para logs si no existe
const logsDir = path.join(__dirname, 'webhook_logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir);
}

const app = express();
const PORT = 3002;

// Middleware para manejar el cuerpo raw para webhooks
app.use('/webhook', express.raw({ type: 'application/json' }));

// Middleware para logging de todas las solicitudes
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  const logEntry = `[${timestamp}] ${req.method} ${req.path} - Headers: ${JSON.stringify(req.headers)}\n`;
  
  // Escribir log a archivo
  fs.appendFileSync(path.join(logsDir, 'requests.log'), logEntry);
  
  // Continuar con el manejo normal de la solicitud
  next();
});

// Endpoint para webhook
app.post('/webhook', (req, res) => {
  console.log('=== WEBHOOK RECIBIDO ===');
  console.log('Fecha:', new Date().toISOString());
  console.log('Headers:', req.headers);
  
  try {
    const event = JSON.parse(req.body);
    console.log('Evento recibido:', event.type);
    console.log('Datos del evento:', JSON.stringify(event.data?.object || {}, null, 2));
    
    // Guardar el evento en un archivo de log
    const eventLog = {
      timestamp: new Date().toISOString(),
      type: event.type,
      data: event.data?.object,
      headers: req.headers
    };
    
    const logFileName = `webhook_event_${Date.now()}.json`;
    fs.writeFileSync(path.join(logsDir, logFileName), JSON.stringify(eventLog, null, 2));
    
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

// Endpoint para ver logs
app.get('/logs', (req, res) => {
  const logFiles = fs.readdirSync(logsDir).filter(file => file.endsWith('.json'));
  const logs = logFiles.map(file => {
    const content = JSON.parse(fs.readFileSync(path.join(logsDir, file), 'utf8'));
    return { file, content };
  });
  
  res.json(logs);
});

// Endpoint para ver el log general
app.get('/requests-log', (req, res) => {
  if (fs.existsSync(path.join(logsDir, 'requests.log'))) {
    const content = fs.readFileSync(path.join(logsDir, 'requests.log'), 'utf8');
    res.setHeader('Content-Type', 'text/plain');
    res.send(content);
  } else {
    res.send('No request logs found');
  }
});

// Ruta principal
app.get('/', (req, res) => {
  res.send(`
    <h2>Tester de Webhook de Stripe</h2>
    <p>Servidor de prueba escuchando en el puerto ${PORT}</p>
    <p>Webhook endpoint: <code>/webhook</code></p>
    <p><a href="/logs">Ver logs de eventos</a></p>
    <p><a href="/requests-log">Ver logs de solicitudes</a></p>
    <p>Para probar con Stripe CLI:</p>
    <pre>stripe listen --forward-to http://tu-servidor:${PORT}/webhook</pre>
  `);
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Tester de webhook escuchando en http://0.0.0.0:${PORT}`);
  console.log(`Webhook endpoint en: http://0.0.0.0:${PORT}/webhook`);
  console.log(`Visita http://0.0.0.0:${PORT}/ para ver la interfaz`);
});