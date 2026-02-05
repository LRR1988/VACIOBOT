// Script para crear usuarios de prueba en Travabus directamente manipulando localStorage
const fs = require('fs');

// Simular localStorage para el entorno Node.js
global.localStorage = {
  store: {},
  getItem: function(key) {
    return this.store[key] || null;
  },
  setItem: function(key, value) {
    this.store[key] = value.toString();
  },
  removeItem: function(key) {
    delete this.store[key];
  },
  clear: function() {
    this.store = {};
  }
};

// Cargar el módulo de base de datos y obtener la instancia
const dbModule = require('./src/utils/database.js');
const db = dbModule.db; // Obtener la instancia global

async function createTestUsers() {
  console.log('Creando usuarios de prueba para Travabus...');
  
  try {
    // Crear primer usuario
    console.log('Creando primer usuario...');
    const user1 = await db.createUser({
      username: 'empresa1',
      password: '123456',
      company_name: 'Empresa de Transporte 1',
      cif_nif: 'B12345678',
      address: 'Calle Prueba 1, Ciudad',
      phone: '+34600123456',
      email: 'empresa1@travabus.com',
      role: 'company',
      language: 'es',
      verified: true
    });
    
    console.log('✅ Usuario empresa1 creado:', user1 ? user1.id : 'no creado');
    
    // Crear segundo usuario
    console.log('Creando segundo usuario...');
    const user2 = await db.createUser({
      username: 'empresa2',
      password: '123456',
      company_name: 'Empresa de Transporte 2',
      cif_nif: 'B87654321',
      address: 'Calle Prueba 2, Ciudad',
      phone: '+34600654321',
      email: 'empresa2@travabus.com',
      role: 'company',
      language: 'es',
      verified: true
    });
    
    console.log('✅ Usuario empresa2 creado:', user2 ? user2.id : 'no creado');
    
    console.log('\nUsuarios creados exitosamente con credenciales:');
    console.log('- Usuario: empresa1 / Contraseña: 123456');
    console.log('- Usuario: empresa2 / Contraseña: 123456');
    
    // Mostrar el contenido actual de la base de datos
    console.log('\nUsuarios en la base de datos:');
    const users = db.getAll('users');
    console.log(users);
    
    return { user1, user2 };
  } catch (error) {
    console.error('❌ Error creando usuarios:', error.message);
    console.error('Stack:', error.stack);
    throw error;
  }
}

// Ejecutar la función
createTestUsers()
  .then(() => {
    console.log('Proceso completado.');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Error en el proceso:', error);
    process.exit(1);
  });