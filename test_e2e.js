const { chromium } = require('playwright');

(async () => {
  console.log('Iniciando prueba E2E de la funcionalidad de edición de anuncios...');
  
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  try {
    // Ir a la página principal
    console.log('1. Accediendo a la aplicación Travabus...');
    await page.goto('http://localhost:3000');
    
    // Esperar a que cargue la página
    await page.waitForSelector('#root');
    console.log('   Página principal cargada correctamente');
    
    // Intentar iniciar sesión con credenciales conocidas
    console.log('2. Intentando iniciar sesión...');
    await page.click('button:has-text("Login")');
    
    // Esperar a que aparezca el modal de login
    await page.waitForSelector('input[name="username"]');
    
    // Rellenar credenciales de prueba
    await page.fill('input[name="username"]', 'empresa1');
    await page.fill('input[name="password"]', '123456');
    
    // Hacer clic en login
    await page.click('button:has-text("Login")');
    
    // Esperar un momento para que se procese el login
    await page.waitForTimeout(2000);
    
    // Verificar si estamos en el dashboard (indicativo de login exitoso)
    console.log('3. Verificando login...');
    const currentURL = page.url();
    console.log(`   URL actual: ${currentURL}`);
    
    // Ir al dashboard
    console.log('4. Navegando al dashboard...');
    await page.goto('http://localhost:3000/#/dashboard');
    await page.waitForTimeout(1000);
    
    // Esperar a que se carguen los anuncios
    console.log('5. Buscando anuncios en el dashboard...');
    const adsExist = await page.isVisible('.ads-list') || await page.isVisible('.card');
    console.log(`   Anuncios visibles: ${adsExist}`);
    
    if (adsExist) {
      console.log('6. Intentando hacer clic en el botón de edición...');
      
      // Buscar un botón de edición
      const editButtons = await page.$$('.btn-outline:has-text("Edit")');
      console.log(`   Botones de edición encontrados: ${editButtons.length}`);
      
      if (editButtons.length > 0) {
        console.log('   Haciendo clic en el primer botón de edición...');
        
        // Escuchar cambios de URL
        let urlChanged = false;
        page.on('framenavigated', (frame) => {
          if (frame.url().includes('/edit-ad')) {
            urlChanged = true;
            console.log(`   URL cambió a: ${frame.url()}`);
          }
        });
        
        // Hacer clic en el botón de edición
        await Promise.race([
          editButtons[0].click(),
          page.waitForTimeout(5000) // timeout de 5 segundos
        ]);
        
        // Esperar un momento para que ocurra la navegación
        await page.waitForTimeout(2000);
        
        // Verificar si la URL cambió
        const newURL = page.url();
        console.log(`   Nueva URL: ${newURL}`);
        
        if (newURL.includes('/edit-ad') || urlChanged) {
          console.log('✅ ¡FUNCIONALIDAD DE EDICIÓN FUNCIONANDO!');
          console.log('   - El clic en el botón de edición cambió la URL a /edit-ad');
          
          // Verificar si se carga el formulario de edición
          const editFormLoaded = await page.isVisible('form') && 
                                (await page.isVisible('h2:has-text("Editar Anuncio")') || 
                                 await page.isVisible('.card-title:has-text("Editar Anuncio")'));
          console.log(`   - Formulario de edición visible: ${editFormLoaded}`);
          
          if (editFormLoaded) {
            console.log('✅ FORMULARIO DE EDICIÓN CARGADO CORRECTAMENTE');
          } else {
            console.log('⚠️  El formulario de edición no se cargó correctamente');
          }
        } else {
          console.log('❌ La URL no cambió a /edit-ad después de hacer clic en editar');
          console.log('   Esto indica que la funcionalidad de edición no está funcionando');
        }
      } else {
        console.log('⚠️  No se encontraron botones de edición');
        // Tomar screenshot para inspeccionar
        await page.screenshot({ path: '/home/ubuntu/.openclaw/workspace/edit_test.png' });
        console.log('   Captura de pantalla guardada en edit_test.png para revisión');
      }
    } else {
      console.log('⚠️  No se encontraron anuncios en el dashboard');
      await page.screenshot({ path: '/home/ubuntu/.openclaw/workspace/dashboard_test.png' });
      console.log('   Captura de pantalla guardada en dashboard_test.png para revisión');
    }
    
  } catch (error) {
    console.error('❌ Error durante la prueba E2E:', error.message);
  } finally {
    await browser.close();
  }
})();