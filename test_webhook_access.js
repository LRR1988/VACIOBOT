const http = require('http');
const https = require('https');

async function testWebhookAccess() {
  console.log("=== PRUEBA DE ACCESIBILIDAD DEL WEBHOOK ===\n");
  
  const publicIP = '13.51.166.237';
  const port = 3000;
  const webhookPath = '/webhook';
  const testUrl = `http://${publicIP}:${port}${webhookPath}`;
  
  console.log(`Probando acceso a: ${testUrl}`);
  console.log(`IP Pública: ${publicIP}`);
  console.log(`Puerto: ${port}`);
  console.log(`Ruta: ${webhookPath}\n`);
  
  // Test 1: Verificar si el puerto está abierto usando un simple request
  console.log("1. VERIFICANDO SI EL PUERTO ESTÁ ABIERTO...");
  
  return new Promise((resolve) => {
    const testRequest = http.request({
      hostname: publicIP,
      port: port,
      path: '/',
      method: 'GET',
      timeout: 10000
    }, (res) => {
      console.log(`✓ Puerto accesible - Status: ${res.statusCode}`);
      console.log(`✓ Headers recibidos: Content-Type: ${res.headers['content-type']}`);
      resolve();
    });
    
    testRequest.on('error', (error) => {
      console.log(`✗ Error de conexión: ${error.message}`);
      console.log("Posibles causas:");
      console.log("- Firewall bloqueando el puerto");
      console.log("- Servidor no corriendo");
      console.log("- Puerto no expuesto públicamente");
      resolve();
    });
    
    testRequest.on('timeout', () => {
      console.log("✗ Timeout - El puerto puede estar bloqueado");
      testRequest.destroy();
      resolve();
    });
    
    testRequest.end();
  });
}

// También vamos a verificar si hay logging en el servidor actual
async function checkCurrentServerLogs() {
  console.log("\n2. VERIFICANDO ESTADO DEL SERVIDOR ACTUAL...");
  
  const { spawn } = require('child_process');
  
  return new Promise((resolve) => {
    const ps = spawn('bash', ['-c', 'ps aux | grep "node server.js" | grep -v grep']);
    
    ps.stdout.on('data', (data) => {
      const processes = data.toString().trim();
      if (processes) {
        console.log("✓ Servidor Node.js está corriendo:");
        console.log(processes);
      } else {
        console.log("✗ Servidor Node.js NO está corriendo");
      }
    });
    
    ps.stderr.on('data', (data) => {
      console.log(`Error en ps: ${data}`);
    });
    
    ps.on('close', (code) => {
      resolve();
    });
  });
}

// Función para verificar si el webhook específico está respondiendo
async function testWebhookSpecific() {
  console.log("\n3. PROBANDO ENDPOINT ESPECÍFICO DE WEBHOOK...");
  
  return new Promise((resolve) => {
    const testRequest = http.request({
      hostname: 'localhost',
      port: 3000,
      path: '/webhook',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Stripe/Test'
      }
    }, (res) => {
      console.log(`✓ Webhook endpoint responde - Status: ${res.statusCode}`);
      resolve();
    });
    
    testRequest.on('error', (error) => {
      console.log(`✗ Error en webhook: ${error.message}`);
      resolve();
    });
    
    // Enviar un cuerpo vacío para probar el endpoint
    testRequest.write(JSON.stringify({}));
    testRequest.end();
  });
}

// Ejecutar todas las pruebas
async function runAllTests() {
  await testWebhookAccess();
  await checkCurrentServerLogs();
  await testWebhookSpecific();
  
  console.log("\n=== RESULTADOS ===");
  console.log("Si el servidor está corriendo pero el webhook no funciona:");
  console.log("- Puede haber un firewall bloqueando conexiones entrantes")
  console.log("- Stripe puede no poder alcanzar tu servidor directamente")
  console.log("- Puede ser necesario usar un servicio como ngrok para pruebas locales");
  
  console.log("\nRECOMENDACIONES:");
  console.log("1. Verifica que el puerto 3000 esté abierto en el firewall");
  console.log("2. Prueba la configuración del webhook en Stripe Dashboard");
  console.log("3. Considera usar un servicio proxy inverso si hay problemas de red");
}

runAllTests()
  .then(() => {
    console.log("\nPruebas completadas.");
  });