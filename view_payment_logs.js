/**
 * Script para leer y mostrar los logs de pago
 */

const fs = require('fs');
const path = require('path');

function displayPaymentLogs() {
  const logsDir = path.join(__dirname, 'payment_logs');
  
  if (!fs.existsSync(logsDir)) {
    console.log('No se encontró el directorio de logs de pago.');
    console.log('Los logs se crearán cuando ocurran eventos de pago.');
    return;
  }

  const logFiles = fs.readdirSync(logsDir).filter(file => file.startsWith('payment_log_')).sort();
  
  if (logFiles.length === 0) {
    console.log('No hay archivos de log de pago disponibles aún.');
    console.log('Los logs se generarán cuando ocurran eventos de pago.');
    return;
  }

  const latestLogFile = logFiles[logFiles.length - 1];
  console.log(`Leyendo logs del archivo: ${latestLogFile}\n`);
  
  try {
    const logContent = fs.readFileSync(path.join(logsDir, latestLogFile), 'utf8');
    const logLines = logContent.trim().split('\n').filter(line => line);
    
    if (logLines.length === 0) {
      console.log('El archivo de logs está vacío.');
      return;
    }

    console.log(`Total de entradas de log: ${logLines.length}\n`);
    
    // Procesar y mostrar cada entrada de log
    logLines.forEach((line, index) => {
      try {
        const logEntry = JSON.parse(line);
        
        console.log(`[${index + 1}] ${logEntry.timestamp} - [${logEntry.level}] ${logEntry.module}: ${logEntry.message}`);
        
        if (logEntry.data) {
          const data = JSON.parse(logEntry.data);
          console.log('    Datos:', JSON.stringify(data, null, 2).replace(/\n/g, '\n    '));
        }
        console.log('');
      } catch (parseError) {
        console.log(`Error al parsear línea de log: ${line}`);
      }
    });
    
    // Generar un resumen
    console.log('=== RESUMEN DE LOGS ===');
    const logStats = {
      INFO: 0,
      SUCCESS: 0,
      ERROR: 0,
      levels: {},
      modules: {}
    };
    
    logLines.forEach(line => {
      try {
        const logEntry = JSON.parse(line);
        logStats[logEntry.level]++;
        
        if (!logStats.levels[logEntry.level]) {
          logStats.levels[logEntry.level] = 0;
        }
        logStats.levels[logEntry.level]++;
        
        if (!logStats.modules[logEntry.module]) {
          logStats.modules[logEntry.module] = 0;
        }
        logStats.modules[logEntry.module]++;
      } catch (parseError) {
        // Ignorar errores de parse
      }
    });
    
    console.log('Niveles de log:');
    Object.entries(logStats.levels).forEach(([level, count]) => {
      console.log(`  ${level}: ${count}`);
    });
    
    console.log('\nMódulos:');
    Object.entries(logStats.modules).forEach(([module, count]) => {
      console.log(`  ${module}: ${count}`);
    });
    
  } catch (error) {
    console.error('Error leyendo el archivo de logs:', error);
  }
}

displayPaymentLogs();