/**
 * Script para monitorear logs en tiempo real
 * 
 * Este script observa el directorio de logs y muestra nuevos eventos a medida que ocurren
 */

const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const logsDir = path.join(__dirname, 'payment_logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

let lastFileSize = 0;
let currentLogFile = null;

function getCurrentLogFile() {
  const logFiles = fs.readdirSync(logsDir).filter(file => file.startsWith('payment_log_')).sort();
  return logFiles.length > 0 ? logFiles[logFiles.length - 1] : null;
}

function monitorLogs() {
  currentLogFile = getCurrentLogFile();
  
  if (!currentLogFile) {
    console.log('No se encontraron archivos de logs aún. Esperando eventos...');
    setTimeout(monitorLogs, 2000);
    return;
  }
  
  const logFilePath = path.join(logsDir, currentLogFile);
  
  if (!fs.existsSync(logFilePath)) {
    console.log('El archivo de logs aún no existe. Esperando...');
    setTimeout(monitorLogs, 2000);
    return;
  }
  
  const currentSize = fs.statSync(logFilePath).size;
  
  if (currentSize > lastFileSize) {
    const stream = fs.createReadStream(logFilePath, {
      start: lastFileSize,
      end: currentSize - 1
    });
    
    stream.on('data', (chunk) => {
      const newData = chunk.toString();
      const logEntries = newData.trim().split('\n').filter(entry => entry);
      
      logEntries.forEach(entry => {
        try {
          const logEntry = JSON.parse(entry);
          console.log(`\n🔔 [${logEntry.timestamp}] [${logEntry.level}] ${logEntry.module}:`);
          console.log(`   ${logEntry.message}`);
          if (logEntry.data) {
            const data = JSON.parse(logEntry.data);
            console.log('   Datos:', JSON.stringify(data, null, 2));
          }
        } catch (error) {
          console.log(`Error parsing log entry: ${entry}`);
        }
      });
    });
    
    lastFileSize = currentSize;
  }
  
  setTimeout(monitorLogs, 1000);
}

console.log('🔍 Monitor de Logs de Pago Activado');
console.log('Este script monitoreará los logs en tiempo real...');
console.log('Presiona Ctrl+C para detener la monitorización.\n');

monitorLogs();

// Manejar la señal de interrupción
process.on('SIGINT', () => {
  console.log('\n🛑 Monitor de logs detenido.');
  process.exit(0);
});