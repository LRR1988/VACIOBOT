// Script para generar el código JavaScript que puede usarse para poblar localStorage en el navegador
const crypto = require('crypto');

// Generar IDs únicos como lo hace la base de datos
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
}

// Datos de los usuarios
const users = [
  {
    id: generateId(),
    username: 'empresa1',
    password: '123456',
    company_name: 'Empresa de Transporte 1',
    cif_nif: 'B12345678',
    address: 'Calle Prueba 1, Ciudad',
    phone: '+34600123456',
    email: 'empresa1@travabus.com',
    role: 'company',
    language: 'es',
    verified: true,
    created_at: new Date().toISOString()
  },
  {
    id: generateId(),
    username: 'empresa2',
    password: '123456',
    company_name: 'Empresa de Transporte 2',
    cif_nif: 'B87654321',
    address: 'Calle Prueba 2, Ciudad',
    phone: '+34600654321',
    email: 'empresa2@travabus.com',
    role: 'company',
    language: 'es',
    verified: true,
    created_at: new Date().toISOString()
  }
];

// Datos predeterminados para otras tablas
const defaultData = {
  ads: [],
  ad_followers: [],
  ad_interests: [],
  notifications: [],
  transactions: [],
  ratings: [],
  user_interactions: []
};

console.log('// Código JavaScript para ejecutar en la consola del navegador para poblar localStorage de Travabus');
console.log('');
console.log('// Poblar usuarios');
console.log(`localStorage.setItem('users', '${JSON.stringify(users)}');`);
console.log('');

for (const [tableName, tableData] of Object.entries(defaultData)) {
  console.log(`// Poblar tabla ${tableName}`);
  console.log(`localStorage.setItem('${tableName}', '${JSON.stringify(tableData)}');`);
  console.log('');
}

console.log('// Usuarios creados:');
users.forEach(user => {
  console.log(`// - ${user.username} (ID: ${user.id})`);
});

console.log('');
console.log('// Ejecute este código en la consola del navegador mientras esté en la página de Travabus');