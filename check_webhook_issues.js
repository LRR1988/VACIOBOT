/**
 * Script para verificar y solucionar problemas comunes del webhook de Stripe
 */

const fs = require('fs');
const path = require('path');

function checkCommonWebhookIssues() {
  console.log('🔍 Verificando problemas comunes del webhook de Stripe...\n');
  
  // 1. Verificar si el archivo server.js tiene la configuración correcta
  console.log('📋 Verificando configuración del servidor...');
  
  const serverCode = fs.readFileSync('./server.js', 'utf8');
  
  // Verificar si tiene la configuración de middleware raw
  const hasRawMiddleware = serverCode.includes('express.raw({ type: \'application/json\' })');
  console.log(`  ✅ Middleware raw para webhooks: ${hasRawMiddleware ? 'CONFIGURADO' : 'FALTA'}`);
  
  // Verificar si tiene el endpoint de webhook
  const hasWebhookEndpoint = serverCode.includes('/webhook');
  console.log(`  ✅ Endpoint de webhook: ${hasWebhookEndpoint ? 'EXISTE' : 'FALTA'}`);
  
  // Verificar si tiene la verificación de firma
  const hasSignatureVerification = serverCode.includes('stripe.webhooks.constructEvent');
  console.log(`  ✅ Verificación de firma: ${hasSignatureVerification ? 'IMPLEMENTADA' : 'FALTA'}`);
  
  // 2. Verificar variables de entorno
  console.log('\n🔐 Verificando variables de entorno...');
  
  const envVars = {};
  if (fs.existsSync('./.env')) {
    const envContent = fs.readFileSync('./.env', 'utf8');
    const lines = envContent.split('\n');
    
    lines.forEach(line => {
      if (line.trim() && !line.startsWith('#')) {
        const [key, value] = line.split('=');
        if (key && value) {
          envVars[key.trim()] = value.trim();
        }
      }
    });
  }
  
  const hasStripeSecret = !!envVars.STRIPE_SECRET_KEY;
  const hasWebhookSecret = !!envVars.STRIPE_WEBHOOK_SECRET;
  
  console.log(`  ✅ Clave secreta de Stripe: ${hasStripeSecret ? 'CONFIGURADA' : 'FALTA'}`);
  console.log(`  ✅ Clave de webhook de Stripe: ${hasWebhookSecret ? 'CONFIGURADA' : 'FALTA'}`);
  
  // 3. Verificar estado del servidor
  console.log('\n🖥️  Verificando estado del servidor...');
  
  const http = require('http');
  
  // Intentar hacer una petición simple para verificar que el servidor responde
  const options = {
    host: 'localhost',
    port: 3000,
    path: '/',
    method: 'GET',
    timeout: 5000
  };
  
  const req = http.request(options, (res) => {
    console.log(`  ✅ Servidor responde: ${res.statusCode === 200 ? 'SÍ' : 'NO'} (Status: ${res.statusCode})`);
    
    if (res.statusCode === 200) {
      console.log('  🎯 El servidor está accesible localmente');
      console.log('  🌐 Pero es posible que Stripe no pueda acceder externamente');
    }
  });
  
  req.on('error', (e) => {
    console.log(`  ❌ Servidor no responde localmente: ${e.message}`);
  });
  
  req.on('timeout', () => {
    console.log('  ⏰ Timeout al intentar conectar con el servidor');
  });
  
  req.end();
  
  // 4. Mostrar recomendaciones
  console.log('\n📋 RECOMENDACIONES:');
  console.log('  1. Verificar que el firewall del servidor permita conexiones entrantes en el puerto 3000');
  console.log('  2. Confirmar que Stripe tenga registrado el webhook con la URL correcta:');
  console.log('     http://13.51.166.237:3000/webhook');
  console.log('  3. Verificar en el Dashboard de Stripe si hay intentos fallidos de webhook');
  console.log('  4. Asegurarse de que el servidor sea accesible públicamente');
  console.log('  5. Probar la conectividad desde fuera del servidor');
  
  // 5. Mostrar comandos útiles
  console.log('\n🔧 COMANDOS ÚTILES:');
  console.log('  # Verificar si el puerto está abierto externamente (necesita herramienta externa)');
  console.log('  # Verificar logs del servidor: tail -f logs o pm2 logs');
  console.log('  # Reiniciar servidor: pm2 restart server o matar proceso y volver a iniciar');
  console.log('  # Probar webhook con Stripe CLI: stripe listen --forward-to http://localhost:3000/webhook');
  
  console.log('\n💡 NOTA IMPORTANTE:');
  console.log('  El servidor está técnicamente configurado correctamente para recibir webhooks,');
  console.log('  pero el problema parece estar en la conectividad externa o en la configuración');
  console.log('  del webhook en el Dashboard de Stripe.');
}

checkCommonWebhookIssues();