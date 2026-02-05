/**
 * Test para verificar que el webhook recibe req.body como Buffer
 * 
 * Este archivo agrega un log especial al inicio del webhook para confirmar
 * que recibe req.body como Buffer y no como objeto parseado.
 */

// Vamos a agregar un log especial al webhook para verificar que recibe el cuerpo como Buffer
console.log('🔍 Preparando test para confirmar que req.body es Buffer en webhook...');

// Primero, vamos a revisar el archivo server_fixed.js para añadir el log de diagnóstico
const fs = require('fs');
const path = require('path');

let serverCode = fs.readFileSync('./server_fixed.js', 'utf8');

// Buscar la línea del webhook y añadir el log de diagnóstico
const webhookPattern = "app.post('/webhook', express.raw({ type: 'application/json' }), async (request, response) => {";

if (serverCode.includes(webhookPattern)) {
  // Insertar el log de diagnóstico justo después de la definición del webhook
  const logToAdd = "\n  console.log('WEBHOOK HIT', Buffer.isBuffer(request.body), typeof request.body);\n";
  
  serverCode = serverCode.replace(
    webhookPattern,
    webhookPattern + logToAdd
  );
  
  // Guardar el archivo modificado
  fs.writeFileSync('./server_with_diagnostic.js', serverCode);
  
  console.log('✅ Archivo server_with_diagnostic.js creado con log de diagnóstico');
  console.log('   Este archivo tiene un log especial para verificar que req.body es Buffer');
  console.log('');
  console.log('   El log mostrará: WEBHOOK HIT [true/false] [type]');
  console.log('   - true object: CORRECTO (es Buffer, tipo object)')
  console.log('   - false object: INCORRECTO (ya fue parseado a objeto)')
} else {
  console.log('❌ No se encontró el patrón del webhook en el archivo');
}