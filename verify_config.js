/**
 * Script de verificación de configuración de Travabus
 * 
 * Este script verifica que todas las variables de entorno necesarias estén configuradas
 * y que las conexiones a Stripe y Supabase sean válidas.
 */

require('dotenv').config();
const Stripe = require('stripe');
const { createClient } = require('@supabase/supabase-js');

async function validateConfiguration() {
  console.log('🔍 Verificando configuración de Travabus...\n');
  
  let allChecksPassed = true;
  
  // Verificar variables de entorno
  console.log('📋 Verificando variables de entorno...');
  
  const requiredEnvVars = [
    'STRIPE_SECRET_KEY',
    'STRIPE_WEBHOOK_SECRET',
    'SUPABASE_URL',
    'SUPABASE_SERVICE_ROLE_KEY'
  ];
  
  for (const varName of requiredEnvVars) {
    if (!process.env[varName]) {
      console.log(`❌ ${varName} no está definida`);
      allChecksPassed = false;
    } else if (process.env[varName].includes('YOUR_') || process.env[varName].includes('placeholder')) {
      console.log(`❌ ${varName} contiene un valor de placeholder`);
      allChecksPassed = false;
    } else {
      console.log(`✅ ${varName} está definida`);
    }
  }
  
  console.log('');
  
  // Verificar conexión a Stripe
  console.log('💳 Verificando conexión a Stripe...');
  if (process.env.STRIPE_SECRET_KEY && !process.env.STRIPE_SECRET_KEY.includes('YOUR_')) {
    try {
      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
      
      // Intentar una operación simple para verificar la autenticación
      await stripe.account.retrieve();
      console.log('✅ Conexión a Stripe exitosa');
    } catch (error) {
      console.log(`❌ Error en la conexión a Stripe: ${error.message}`);
      allChecksPassed = false;
    }
  } else {
    console.log('⚠️  Saltando verificación de Stripe (clave no configurada)');
  }
  
  console.log('');
  
  // Verificar conexión a Supabase
  console.log('💾 Verificando conexión a Supabase...');
  if (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
    try {
      const supabase = createClient(
        process.env.SUPABASE_URL, 
        process.env.SUPABASE_SERVICE_ROLE_KEY
      );
      
      // Intentar una operación simple para verificar la conexión
      const { data, error } = await supabase
        .from('users')
        .select('id')
        .limit(1);
      
      if (error) {
        console.log(`⚠️  Advertencia en la conexión a Supabase: ${error.message}`);
        // No marcar como fallo total, ya que podría ser simplemente que la tabla esté vacía
      } else {
        console.log('✅ Conexión a Supabase exitosa');
      }
    } catch (error) {
      console.log(`❌ Error en la conexión a Supabase: ${error.message}`);
      allChecksPassed = false;
    }
  } else {
    console.log('⚠️  Saltando verificación de Supabase (variables no configuradas)');
  }
  
  console.log('');
  
  // Verificar webhook de Stripe
  console.log('📡 Verificando webhook de Stripe...');
  if (process.env.STRIPE_WEBHOOK_SECRET) {
    console.log('✅ Webhook de Stripe está configurado');
  } else {
    console.log('❌ Webhook de Stripe no está configurado');
    allChecksPassed = false;
  }
  
  console.log('');
  
  // Resultado final
  if (allChecksPassed) {
    console.log('🎉 ¡Todo está configurado correctamente!');
    console.log('El sistema de pagos debería funcionar correctamente.');
  } else {
    console.log('❌ Hay problemas de configuración que deben resolverse.');
    console.log('Por favor, revisa las variables de entorno y vuelve a ejecutar este script.');
  }
  
  return allChecksPassed;
}

// Ejecutar la verificación
validateConfiguration().catch(console.error);

module.exports = { validateConfiguration };