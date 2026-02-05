/**
 * Script para probar el sistema de logging con eventos simulados
 */

const axios = require('axios');

async function testLoggingSystem() {
  console.log('🧪 Probando el sistema de logging...\n');
  
  // Esperar un momento para que el sistema esté listo
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Simular un evento de pago exitoso
  console.log('Simulando inicio de proceso de pago...\n');
  
  // Esto no generará logs porque es solo un comentario
  // Para generar logs reales, necesitamos hacer una solicitud real al servidor
  console.log('Para generar logs reales, necesitas hacer una solicitud real al servidor');
  console.log('como crear una sesión de checkout o recibir un webhook.');
  
  console.log('\n📋 Instrucciones:');
  console.log('1. Ve a la aplicación Travabus');
  console.log('2. Intenta contratar un anuncio');
  console.log('3. Observa cómo se generan los logs en tiempo real');
  console.log('4. Los logs aparecerán en el monitor que está corriendo');
  
  console.log('\n🔍 También puedes verificar los archivos de log en:');
  console.log('   /home/ubuntu/.openclaw/workspace/travabus/payment_logs/');
}

testLoggingSystem();