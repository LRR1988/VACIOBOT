/**
 * Sistema de Logging para el proceso de pago de anuncios
 * 
 * Este archivo implementa un sistema de logging detallado para rastrear
 * cada paso del proceso de pago de anuncios en Travabus.
 */

const fs = require('fs');
const path = require('path');

// Crear directorio para logs si no existe
const logsDir = path.join(__dirname, 'payment_logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Función para escribir logs
function writeLog(level, module, message, data = null) {
  const timestamp = new Date().toISOString();
  const logEntry = {
    timestamp,
    level,
    module,
    message,
    data: data ? JSON.stringify(data, null, 2) : null
  };

  const logFileName = `payment_log_${new Date().toISOString().split('T')[0]}.json`;
  const logFilePath = path.join(logsDir, logFileName);
  
  // Agregar la entrada al archivo de log
  const logLine = JSON.stringify(logEntry) + '\n';
  fs.appendFileSync(logFilePath, logLine);
  
  // También imprimir en consola para seguimiento inmediato
  console.log(`[${timestamp}] [${level}] [${module}] ${message}`);
  if (data) {
    console.log('  Data:', JSON.stringify(data, null, 2));
  }
}

// Función para registrar inicio de proceso de pago
function logPaymentProcessStarted(userId, adId, adDetails) {
  writeLog('INFO', 'PAYMENT_PROCESS', 'Inicio de proceso de pago para anuncio', {
    userId,
    adId,
    adDetails,
    processStep: 'STARTED'
  });
}

// Función para registrar verificación de disponibilidad
function logAvailabilityCheck(userId, adId, isAvailable, reason = null) {
  writeLog('INFO', 'AVAILABILITY_CHECK', 'Verificación de disponibilidad de anuncio', {
    userId,
    adId,
    isAvailable,
    reason,
    processStep: 'AVAILABILITY_CHECK'
  });
}

// Función para registrar creación de sesión de checkout
function logCheckoutSessionCreated(userId, adId, sessionId, sessionUrl) {
  writeLog('INFO', 'CHECKOUT_SESSION', 'Sesión de checkout creada', {
    userId,
    adId,
    sessionId,
    sessionUrl,
    processStep: 'CHECKOUT_SESSION_CREATED'
  });
}

// Función para registrar intento de pago
function logPaymentAttempt(userId, adId, sessionId) {
  writeLog('INFO', 'PAYMENT_ATTEMPT', 'Intento de pago iniciado', {
    userId,
    adId,
    sessionId,
    processStep: 'PAYMENT_ATTEMPT_STARTED'
  });
}

// Función para registrar éxito del pago
function logPaymentSuccess(userId, adId, sessionId, stripeTransactionId, amount) {
  writeLog('SUCCESS', 'PAYMENT_SUCCESS', 'Pago completado exitosamente', {
    userId,
    adId,
    sessionId,
    stripeTransactionId,
    amount,
    processStep: 'PAYMENT_COMPLETED'
  });
}

// Función para registrar fracaso del pago
function logPaymentFailure(userId, adId, sessionId, error) {
  writeLog('ERROR', 'PAYMENT_FAILURE', 'Fracaso en el proceso de pago', {
    userId,
    adId,
    sessionId,
    error,
    processStep: 'PAYMENT_FAILED'
  });
}

// Función para registrar recepción de webhook
function logWebhookReceived(eventType, eventId, sessionId, metadata = null) {
  writeLog('INFO', 'WEBHOOK_RECEIVED', 'Webhook recibido de Stripe', {
    eventType,
    eventId,
    sessionId,
    metadata,
    processStep: 'WEBHOOK_RECEIVED'
  });
}

// Función para registrar procesamiento de webhook
function logWebhookProcessed(eventType, sessionId, success, error = null) {
  writeLog('INFO', 'WEBHOOK_PROCESSED', 'Webhook procesado', {
    eventType,
    sessionId,
    success,
    error,
    processStep: 'WEBHOOK_PROCESSED'
  });
}

// Función para registrar creación de transacción en DB
function logTransactionCreated(transactionId, userId, adId, status, stripeTransactionId = null) {
  writeLog('INFO', 'TRANSACTION_DB', 'Transacción creada en base de datos', {
    transactionId,
    userId,
    adId,
    status,
    stripeTransactionId,
    processStep: 'TRANSACTION_CREATED'
  });
}

// Función para registrar actualización de transacción en DB
function logTransactionUpdated(transactionId, userId, adId, newStatus, oldStatus) {
  writeLog('INFO', 'TRANSACTION_DB', 'Transacción actualizada en base de datos', {
    transactionId,
    userId,
    adId,
    newStatus,
    oldStatus,
    processStep: 'TRANSACTION_UPDATED'
  });
}

// Función para registrar error en base de datos
function logDatabaseError(operation, error, context = null) {
  writeLog('ERROR', 'DATABASE_ERROR', `Error en operación de base de datos: ${operation}`, {
    error: error.message || error,
    stack: error.stack,
    context,
    processStep: 'DATABASE_ERROR'
  });
}

// Función para registrar verificación de anuncio contratado
function logAdHiredCheck(adId, isHired, byUserId = null) {
  writeLog('INFO', 'AD_HIRED_CHECK', 'Verificación de estado de contratación del anuncio', {
    adId,
    isHired,
    byUserId,
    processStep: 'AD_HIRED_CHECK'
  });
}

// Función para registrar error de firma de webhook
function logWebhookSignatureError(signature, expectedSecret, error) {
  writeLog('ERROR', 'WEBHOOK_SIGNATURE', 'Error en verificación de firma del webhook', {
    signature,
    expectedSecret: expectedSecret ? 'SET' : 'NOT SET',
    error: error.message || error,
    processStep: 'SIGNATURE_VERIFICATION_FAILED'
  });
}

// Función para registrar error general
function logGeneralError(module, error, context = null) {
  writeLog('ERROR', module, 'Error general en el sistema', {
    error: error.message || error,
    stack: error.stack,
    context,
    processStep: 'GENERAL_ERROR'
  });
}

// Función para registrar finalización de proceso
function logProcessCompleted(userId, adId, outcome, details = null) {
  writeLog('INFO', 'PROCESS_COMPLETE', 'Proceso de pago completado', {
    userId,
    adId,
    outcome,
    details,
    processStep: 'PROCESS_COMPLETED'
  });
}

// Función para leer logs recientes
function readRecentLogs(limit = 50) {
  const logFiles = fs.readdirSync(logsDir).filter(file => file.startsWith('payment_log_')).sort();
  if (logFiles.length === 0) return [];

  const latestLogFile = logFiles[logFiles.length - 1];
  const logContent = fs.readFileSync(path.join(logsDir, latestLogFile), 'utf8');
  const logLines = logContent.trim().split('\n').filter(line => line);

  return logLines.slice(-limit).map(line => JSON.parse(line));
}

// Exportar todas las funciones
module.exports = {
  writeLog,
  logPaymentProcessStarted,
  logAvailabilityCheck,
  logCheckoutSessionCreated,
  logPaymentAttempt,
  logPaymentSuccess,
  logPaymentFailure,
  logWebhookReceived,
  logWebhookProcessed,
  logTransactionCreated,
  logTransactionUpdated,
  logDatabaseError,
  logAdHiredCheck,
  logWebhookSignatureError,
  logGeneralError,
  logProcessCompleted,
  readRecentLogs
};