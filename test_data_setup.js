// Script para crear datos de prueba para la aplicación Travabus
// Este script simula la creación de usuarios y anuncios para pruebas

// Importar las funciones de la base de datos
import { db } from './src/utils/database';

// Función para crear usuarios de prueba
function createTestData() {
  console.log("Creando datos de prueba para Travabus...");
  
  // Crear usuarios de prueba
  const user1 = db.createUser({
    username: "bus_company_1",
    password: "hashed_password_1",
    role: "user",
    company_name: "Empresa de Autobuses Norte SL",
    tax_data: "CIF: B12345678",
    bank_account: "ES12 1234 5678 9012 3456 7890",
    bic_swift: "BCOEESMMXXX",
    company_id: "B12345678",
    email: "contacto@busnorte.es",
    phone: "+34 942 123 456",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  });
  
  const user2 = db.createUser({
    username: "transport_service",
    password: "hashed_password_2",
    role: "user",
    company_name: "Servicios de Transporte Sur SA",
    tax_data: "CIF: A98765432",
    bank_account: "ES34 9876 5432 1098 7654 3210",
    bic_swift: "CAIXESBBXXX",
    company_id: "A98765432",
    email: "info@transportsur.es",
    phone: "+34 91 987 6543",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  });
  
  // Crear usuario administrador
  const adminUser = db.createUser({
    username: "admin_user",
    password: "hashed_admin_password",
    role: "admin",
    company_name: "Administrador Travabus",
    tax_data: "CIF: W00000000",
    bank_account: "ES00 0000 0000 0000 0000 0000",
    bic_swift: "ADMIESMMXXX",
    company_id: "W00000000",
    email: "admin@travabus.com",
    phone: "+34 91 123 4567",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  });
  
  console.log("Usuarios creados:", { user1, user2, adminUser });
  
  // Crear anuncios de prueba para el primer usuario
  const ad1 = db.createAd({
    user_id: user1.id,
    ad_type: "offer",
    route_from: "Madrid",
    route_to: "Barcelona",
    start_date: "2026-03-15",
    end_date: "2026-03-15",
    start_time: "08:00",
    end_time: "14:00",
    price: 1200.00,
    expenses_by: "receiver",
    bus_count: 1,
    bus_age: 2,
    seats: 50,
    observations: "Autobús nuevo con aire acondicionado y WiFi gratuito",
    circuit: false,
    status: "active",
    featured: false,
    country: "ES",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  });
  
  const ad2 = db.createAd({
    user_id: user1.id,
    ad_type: "offer",
    route_from: "Valencia",
    route_to: "Sevilla",
    start_date: "2026-03-20",
    end_date: "2026-03-20",
    start_time: "07:30",
    end_time: "16:30",
    price: 950.00,
    expenses_by: "shared",
    bus_count: 1,
    bus_age: 5,
    seats: 45,
    observations: "Ruta directa sin paradas intermedias",
    circuit: false,
    status: "active",
    featured: false,
    country: "ES",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  });
  
  // Crear anuncios de prueba para el segundo usuario
  const ad3 = db.createAd({
    user_id: user2.id,
    ad_type: "offer",
    route_from: "Lyon",
    route_to: "Marsella",
    start_date: "2026-03-18",
    end_date: "2026-03-18",
    start_time: "09:00",
    end_time: "13:00",
    price: 650.00,
    expenses_by: "sender",
    bus_count: 1,
    bus_age: 3,
    seats: 55,
    observations: "Transporte de calidad con asientos reclinables",
    circuit: false,
    status: "active",
    featured: false,
    country: "FR",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  });
  
  const ad4 = db.createAd({
    user_id: user2.id,
    ad_type: "offer",
    route_from: "Berlín",
    route_to: "Hamburgo",
    start_date: "2026-03-22",
    end_date: "2026-03-22",
    start_time: "10:00",
    end_time: "15:30",
    price: 720.00,
    expenses_by: "receiver",
    bus_count: 1,
    bus_age: 1,
    seats: 48,
    observations: "Autobús VIP con enchufes individuales y pantallas",
    circuit: false,
    status: "active",
    featured: false,
    country: "DE",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  });
  
  console.log("Anuncios creados:", { ad1, ad2, ad3, ad4 });
  
  // Crear algunas relaciones de prueba
  const follow1 = db.createAdFollower({
    user_id: user2.id,
    ad_id: ad1.id,
    created_at: new Date().toISOString()
  });
  
  const interest1 = db.createAdInterest({
    user_id: user2.id,
    ad_id: ad1.id,
    message: "Estamos interesados en esta ruta. ¿Podríamos negociar el precio?",
    status: "pending",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  });
  
  console.log("Relaciones creadas:", { follow1, interest1 });
  console.log("Datos de prueba creados exitosamente!");
}

// Ejecutar la creación de datos de prueba
createTestData();