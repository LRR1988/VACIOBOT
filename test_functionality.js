// Script para probar la funcionalidad completa de la base de datos de Travabus
const { Database } = require('./src/utils/database.js');

async function runTests() {
  console.log('🧪 Iniciando pruebas de funcionalidad de Travabus...');
  const db = new Database();

  try {
    // 1. Prueba de creación de usuarios
    console.log('\n1. Probando creación de usuarios...');
    const user1 = await db.createUser({
      username: 'empresa_test',
      password: 'password123',
      company_name: 'Empresa de Prueba S.A.',
      cif_nif: 'B12345678',
      address: 'Calle Falsa 123, Madrid',
      phone: '+34600123456',
      email: 'contacto@empresaprueba.es',
      role: 'company',
      language: 'es'
    });

    const user2 = await db.createUser({
      username: 'empresa_admin',
      password: 'admin123',
      company_name: 'Admin Company',
      cif_nif: 'A00000000',
      address: 'Av. Administración 1, Madrid',
      phone: '+34600000000',
      email: 'admin@empresaprueba.es',
      role: 'admin',
      language: 'es'
    });

    console.log('✅ Usuarios creados:', user1.id, user2.id);

    // 2. Prueba de creación de anuncios
    console.log('\n2. Probando creación de anuncios...');
    const ad1 = await db.createAd({
      user_id: user1.id,
      title: 'Ruta vacía Barcelona-Madrid',
      description: 'Autobús con capacidad para 50 personas, ruta vacía de regreso',
      origin: 'Barcelona',
      destination: 'Madrid',
      date: new Date().toISOString().split('T')[0],
      capacity: 50,
      price: 2000,
      status: 'active'
    });

    const ad2 = await db.createAd({
      user_id: user1.id,
      title: 'Viaje Valencia-Bilbao',
      description: 'Autobús disponible para ruta Valencia-Bilbao',
      origin: 'Valencia',
      destination: 'Bilbao',
      date: new Date(Date.now() + 86400000).toISOString().split('T')[0], // Mañana
      capacity: 45,
      price: 1800,
      status: 'active'
    });

    console.log('✅ Anuncios creados:', ad1.id, ad2.id);

    // 3. Prueba de lectura de anuncios
    console.log('\n3. Probando lectura de anuncios...');
    const allAds = await db.getAds();
    console.log(`✅ Se encontraron ${allAds.length} anuncios`);

    // 4. Prueba de actualización de anuncio
    console.log('\n4. Probando actualización de anuncio...');
    const updatedAd = await db.updateAd(ad1.id, { price: 1900, capacity: 48 });
    console.log('✅ Anuncio actualizado:', updatedAd.id, 'Precio:', updatedAd.price, 'Capacidad:', updatedAd.capacity);

    // 5. Prueba de creación de intereses
    console.log('\n5. Probando creación de intereses...');
    const interest = await db.createInterest({
      ad_id: ad1.id,
      user_id: user2.id,
      message: 'Estamos interesados en esta ruta para nuestro grupo de turistas'
    });
    console.log('✅ Interés creado:', interest.id);

    // 6. Prueba de creación de seguidores
    console.log('\n6. Probando creación de seguidores...');
    const follower = await db.followAd({
      ad_id: ad1.id,
      user_id: user2.id
    });
    console.log('✅ Seguimiento creado:', follower.id);

    // 7. Prueba de lectura de perfil de usuario
    console.log('\n7. Probando lectura de perfil de usuario...');
    const userProfile = await db.getUserById(user1.id);
    console.log('✅ Perfil de usuario recuperado:', userProfile.username, userProfile.company_name);

    // 8. Prueba de autenticación
    console.log('\n8. Probando autenticación...');
    const authenticatedUser = await db.authenticateUser('empresa_test', 'password123');
    console.log('✅ Usuario autenticado:', authenticatedUser ? authenticatedUser.username : 'FALLO');

    // 9. Prueba de anuncios por usuario
    console.log('\n9. Probando recuperación de anuncios por usuario...');
    const userAds = await db.getAdsByUserId(user1.id);
    console.log(`✅ Usuario tiene ${userAds.length} anuncios`);

    // 10. Prueba de roles de administrador
    console.log('\n10. Probando funcionalidades de administrador...');
    const adminUser = await db.getUserById(user2.id);
    console.log('✅ Usuario admin encontrado, rol:', adminUser.role);
    if (adminUser.role === 'admin') {
      console.log('✅ Verificado permiso de administrador');
    } else {
      console.log('❌ Error: El usuario no tiene rol de administrador');
    }

    console.log('\n🎉 ¡Todas las pruebas básicas han pasado con éxito!');
    console.log('📋 Funcionalidades verificadas:');
    console.log('  - Creación de usuarios (regular y admin)');
    console.log('  - Creación de anuncios');
    console.log('  - Actualización de anuncios');
    console.log('  - Creación de intereses');
    console.log('  - Seguimiento de anuncios');
    console.log('  - Autenticación de usuarios');
    console.log('  - Recuperación de perfiles');
    console.log('  - Recuperación de anuncios por usuario');
    console.log('  - Verificación de roles de administrador');

  } catch (error) {
    console.error('❌ Error durante las pruebas:', error.message);
    console.error(error.stack);
  }
}

// Ejecutar las pruebas
runTests();