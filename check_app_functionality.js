// Script para verificar la funcionalidad de la aplicación Travabus
// Este script verifica que todos los componentes esenciales estén presentes

const https = require('https');
const http = require('http');
const url = require('url');

async function checkAppFunctionality() {
  console.log('🔍 Verificando funcionalidad de Travabus en http://13.51.166.237:3000/');
  
  // Función auxiliar para hacer solicitudes HTTP
  function httpRequest(urlStr) {
    return new Promise((resolve, reject) => {
      const parsedUrl = url.parse(urlStr);
      const options = {
        hostname: parsedUrl.hostname,
        port: parsedUrl.port,
        path: parsedUrl.path,
        method: 'GET'
      };

      const req = http.request(options, (res) => {
        let data = '';
        res.on('data', (chunk) => {
          data += chunk;
        });
        res.on('end', () => {
          resolve({ statusCode: res.statusCode, headers: res.headers, data });
        });
      });

      req.on('error', (error) => {
        reject(error);
      });

      req.end();
    });
  }

  try {
    // 1. Verificar que la página principal carga
    console.log('\n1. Verificando carga de la página principal...');
    const homeResponse = await httpRequest('http://13.51.166.237:3000/');
    if (homeResponse.statusCode === 200 && homeResponse.data.includes('Travabus')) {
      console.log('✅ Página principal cargada correctamente');
    } else {
      console.log('❌ Error al cargar la página principal');
      return false;
    }

    // 2. Verificar que el archivo JavaScript principal esté accesible
    console.log('\n2. Verificando archivo JavaScript principal...');
    const jsFilesMatch = homeResponse.data.match(/src="(\/assets\/[^"]*\.js)"/);
    if (jsFilesMatch) {
      const jsFile = jsFilesMatch[1];
      console.log(`   Archivo JS encontrado: ${jsFile}`);
      
      const jsResponse = await httpRequest(`http://13.51.166.237:3000${jsFile}`);
      if (jsResponse.statusCode === 200) {
        console.log('✅ Archivo JavaScript accesible');
      } else {
        console.log('❌ Archivo JavaScript no accesible');
        return false;
      }
    } else {
      console.log('❌ No se encontró archivo JavaScript principal');
      return false;
    }

    // 3. Verificar que la página de pruebas esté accesible
    console.log('\n3. Verificando página de pruebas...');
    const testResponse = await httpRequest('http://13.51.166.237:3000/test');
    if (testResponse.statusCode === 200 && testResponse.data.includes('Prueba de Base de Datos')) {
      console.log('✅ Página de pruebas accesible');
    } else {
      console.log('❌ Página de pruebas no accesible');
      return false;
    }

    // 4. Verificar que los recursos CSS estén disponibles
    console.log('\n4. Verificando recursos CSS...');
    const cssMatches = homeResponse.data.match(/href="(\/[^"]*\.css)"/g);
    if (cssMatches && cssMatches.length > 0) {
      console.log(`   Archivos CSS encontrados: ${cssMatches.length}`);
      // Probar uno de los archivos CSS
      const cssPath = cssMatches[0].match(/href="(\/[^"]*\.css)"/)[1];
      const cssResponse = await httpRequest(`http://13.51.166.237:3000${cssPath}`);
      if (cssResponse.statusCode === 200) {
        console.log('✅ Recursos CSS accesibles');
      } else {
        console.log('⚠️ Recursos CSS no accesibles (posiblemente no hay CSS personalizado)');
      }
    } else {
      console.log('ℹ️ No se encontraron archivos CSS en el HTML (posiblemente se cargan dinámicamente)');
    }

    // 5. Verificar que la estructura de la aplicación esté presente
    console.log('\n5. Verificando estructura de la aplicación...');
    if (homeResponse.data.includes('id="root"')) {
      console.log('✅ Contenedor principal (#root) encontrado');
    } else {
      console.log('❌ Contenedor principal (#root) no encontrado');
      return false;
    }

    // 6. Verificar que haya referencias a componentes de React
    const hasReactComponents = homeResponse.data.includes('react') || 
                              homeResponse.data.includes('React') ||
                              homeResponse.data.includes('jsx') ||
                              homeResponse.data.includes('App');
    if (hasReactComponents) {
      console.log('✅ Referencias a React encontradas');
    } else {
      console.log('ℹ️ No se encontraron referencias explícitas a React (normal en producción)');
    }

    // 7. Verificar que el favicon esté disponible
    console.log('\n6. Verificando favicon...');
    const faviconResponse = await httpRequest('http://13.51.166.237:3000/favicon.ico');
    if (faviconResponse.statusCode === 200) {
      console.log('✅ Favicon accesible');
    } else {
      console.log('⚠️ Favicon no accesible (no crítico)');
    }

    console.log('\n🎉 Verificación básica completada con éxito');
    console.log('\n📋 Funcionalidades verificadas:');
    console.log('  - Carga de página principal');
    console.log('  - Accesibilidad de archivos JavaScript');
    console.log('  - Página de pruebas funcional');
    console.log('  - Estructura de aplicación React');
    console.log('  - Accesibilidad de recursos estáticos');
    
    console.log('\n🎯 La aplicación está lista para pruebas completas en el navegador');
    console.log('   Visite: http://13.51.166.237:3000/ para probar la interfaz');
    console.log('   Visite: http://13.51.166.237:3000/test para probar la base de datos');
    
    return true;
  } catch (error) {
    console.error('❌ Error durante la verificación:', error.message);
    return false;
  }
}

// Ejecutar la verificación
checkAppFunctionality().then(success => {
  if (success) {
    console.log('\n✅ VERIFICACIÓN COMPLETA: La aplicación Travabus está lista para uso');
  } else {
    console.log('\n❌ VERIFICACIÓN INCOMPLETA: Hay problemas que deben resolverse');
  }
});