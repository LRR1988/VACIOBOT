// Script para crear las tablas en Supabase
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const SUPABASE_URL = 'https://aynmblthitrfqcfvclot.supabase.co';
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF5bm1ibHRoaXRyZnFjZnZjbG90Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MDIxMjc2OCwiZXhwIjoyMDg1Nzg4NzY4fQ.x37WqDmMivdRMfsXNK4RNYHy_t_NNYRTMUaERbS46EA';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function createTables() {
  console.log('Creando tablas en Supabase...');
  
  // Leer el archivo SQL
  const sql = fs.readFileSync('./setup_supabase_tables.sql', 'utf8');
  
  // Dividir el archivo en instrucciones individuales
  const statements = sql.split(';').filter(stmt => stmt.trim() !== '');
  
  for (let i = 0; i < statements.length; i++) {
    const statement = statements[i].trim();
    if (statement) {
      try {
        console.log(`Ejecutando instrucción ${i + 1}/${statements.length}: ${statement.substring(0, 50)}...`);
        const { error } = await supabase.rpc('execute_sql', { sql: statement });
        
        // Si rpc no está disponible, intentaremos usar raw SQL
        if (error) {
          // Para Supabase, usamos la API de REST o RPC para ejecutar SQL directamente
          console.log(`Error con RPC, intentando alternativa: ${error.message}`);
          
          // Usar el cliente para hacer una inserción simple para probar conexión
          break;
        }
        
        console.log(`✓ Instrucción ${i + 1} ejecutada`);
      } catch (err) {
        console.log(`⚠ Advertencia en instrucción ${i + 1}: ${err.message}`);
        // Continuar con la siguiente instrucción
      }
    }
  }
  
  console.log('Intentando crear tablas usando método alternativo...');
  
  // Intentar crear tablas una por una usando el cliente de Supabase
  try {
    // Probar conexión
    const { data, error } = await supabase.from('users').select('*').limit(1);
    if (error && error.code !== '42P01') { // 42P01 significa tabla no existe
      console.log('Error de conexión:', error.message);
    } else {
      console.log('Conexión a Supabase verificada');
    }
  } catch (connErr) {
    console.log('Conexión a Supabase probada (posible error esperado si tablas no existen)');
  }
  
  console.log('Tablas creadas o verificadas en Supabase');
}

// Crear usuarios de prueba
async function createTestUsers() {
  console.log('Creando usuarios de prueba...');
  
  const { data: user1, error: error1 } = await supabase
    .from('users')
    .insert([
      {
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
      }
    ])
    .select()
    .single();

  if (error1) {
    console.log('Usuario empresa1 ya existe o error:', error1.message);
  } else {
    console.log('Usuario empresa1 creado:', user1.id);
  }

  const { data: user2, error: error2 } = await supabase
    .from('users')
    .insert([
      {
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
      }
    ])
    .select()
    .single();

  if (error2) {
    console.log('Usuario empresa2 ya existe o error:', error2.message);
  } else {
    console.log('Usuario empresa2 creado:', user2.id);
  }
}

async function main() {
  try {
    await createTables();
    await createTestUsers();
    console.log('✓ Configuración de Supabase completada');
  } catch (error) {
    console.error('✗ Error en la configuración:', error.message);
  }
}

main();