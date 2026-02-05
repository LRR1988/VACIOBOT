/**
 * Script para verificar la correcta implementación de la aplicación Travabus
 */

const axios = require('axios');
const fs = require('fs');
const path = require('path');

async function verifyDeployment() {
  const baseUrl = 'http://13.51.166.237:3000';
  const routesToTest = ['/', '/about', '/contact', '/publish', '/profile', '/dashboard', '/admin', '/all-ads', '/payments', '/how-it-works', '/login', '/register', '/stripe-config'];
  
  console.log('🔍 Verificando la implementación de Travabus...\n');
  
  // Verificar rutas principales
  for (const route of routesToTest) {
    try {
      const response = await axios.get(`${baseUrl}${route}`, { timeout: 5000 });
      if (response.status === 200) {
        console.log(`✅ ${route}: OK (${response.status})`);
      } else {
        console.log(`❌ ${route}: Error (${response.status})`);
      }
    } catch (error) {
      console.log(`❌ ${route}: Error - ${error.message}`);
    }
  }
  
  // Verificar archivos estáticos
  console.log('\n📁 Verificando archivos estáticos...');
  const staticFiles = [
    '/assets/index-3a922e00.css',
    '/assets/main-774dc1dc.js',
    '/favicon.ico'
  ];
  
  for (const file of staticFiles) {
    try {
      const response = await axios.get(`${baseUrl}${file}`, { timeout: 5000 });
      if (response.status === 200) {
        console.log(`✅ ${file}: OK (${response.status}, ${response.headers['content-length'] ? Math.round(response.headers['content-length']/1024) + 'KB' : 'size unknown'})`);
      } else {
        console.log(`❌ ${file}: Error (${response.status})`);
      }
    } catch (error) {
      console.log(`❌ ${file}: Error - ${error.message}`);
    }
  }
  
  // Verificar ruta de pruebas
  console.log('\n🧪 Verificando ruta de pruebas...');
  try {
    const response = await axios.get(`${baseUrl}/test`, { timeout: 5000 });
    if (response.status === 200) {
      console.log(`✅ /test: OK (${response.status})`);
    } else {
      console.log(`❌ /test: Error (${response.status})`);
    }
  } catch (error) {
    console.log(`❌ /test: Error - ${error.message}`);
  }
  
  console.log('\n🎉 Verificación completada.');
}

// Ejecutar la verificación
verifyDeployment().catch(console.error);