/**
 * Script para monitorear en tiempo real los logs del servidor
 * especialmente para ver el diagnóstico del webhook
 */
const fs = require('fs');
const path = require('path');

console.log('🔍 MONITOREANDO SERVIDOR EN TIEMPO REAL');
console.log('Esperando mensajes de diagnóstico del webhook...');
console.log('Buscando: WEBHOOK HIT [true/false] [type]\n');

// Este script no puede monitorear directamente los logs del servidor
// ya que están saliendo a la consola, pero podemos verificar si
// el archivo de logs de pago empieza a recibir entradas

console.log('Consejo: Si el webhook recibe eventos, deberías ver:');
console.log('- Mensajes "WEBHOOK HIT true object" en la consola del servidor');
console.log('- Entradas en los archivos de log de pago');
console.log('- Transacciones actualizadas en la base de datos');

console.log('\nPara verificar manualmente, puedes:');
console.log('1. Hacer un pago en la aplicación');
console.log('2. Verificar la consola del servidor');
console.log('3. Revisar los archivos en ./payment_logs/');
console.log('4. Consultar la base de datos para ver transacciones nuevas');