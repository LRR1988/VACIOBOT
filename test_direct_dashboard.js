const { chromium } = require('playwright');

(async () => {
  console.log('Prueba directa al dashboard...');
  
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  try {
    // Ir directamente al dashboard estando autenticado
    console.log('1. Accediendo al dashboard...');
    await page.goto('http://localhost:3000/#/dashboard');
    await page.waitForTimeout(3000); // Esperar a que se cargue
    
    // Verificar si hay contenido en el dashboard
    console.log('2. Verificando contenido del dashboard...');
    const content = await page.content();
    
    // Buscar anuncios específicamente
    const ads = await page.$$('.card.mb-3'); // Los anuncios deberían estar en cards con clase mb-3
    console.log(`   Anuncios encontrados: ${ads.length}`);
    
    if (ads.length > 0) {
      console.log('   Anuncios encontrados, buscando botones de edición...');
      
      // Buscar botones de edición en cada anuncio
      for (let i = 0; i < ads.length; i++) {
        const adCard = ads[i];
        const editBtn = await adCard.$('.btn-outline');
        
        if (editBtn) {
          const btnText = await editBtn.textContent();
          console.log(`   Botón de edición encontrado en anuncio ${i}: "${btnText}"`);
          
          if (btnText && (btnText.toLowerCase().includes('edit') || btnText.toLowerCase().includes('editar'))) {
            console.log('   Intentando hacer clic en el botón de edición...');
            
            // Registrar la URL antes del clic
            const initialURL = page.url();
            console.log(`   URL antes del clic: ${initialURL}`);
            
            // Hacer clic en el botón de edición
            await editBtn.click();
            
            // Esperar a que ocurra la navegación
            await page.waitForTimeout(3000);
            
            const newURL = page.url();
            console.log(`   URL después del clic: ${newURL}`);
            
            if (newURL !== initialURL && (newURL.includes('/edit-ad') || newURL.includes('edit-ad'))) {
              console.log('✅ ¡FUNCIONALIDAD DE EDICIÓN FUNCIONANDO!');
              console.log('   - La URL cambió correctamente a la página de edición');
              
              // Verificar si se carga el formulario de edición
              try {
                await page.waitForSelector('form', { timeout: 5000 });
                const title = await page.$('h2:has-text("Editar Anuncio"), .card-title:has-text("Editar Anuncio")');
                if (title) {
                  console.log('✅ FORMULARIO DE EDICIÓN CARGADO CORRECTAMENTE');
                  console.log('✅ LA FUNCIONALIDAD DE EDICIÓN ESTÁ TRABAJANDO');
                } else {
                  console.log('⚠️  El formulario de edición se cargó pero sin título correcto');
                }
              } catch (e) {
                console.log('⚠️  El formulario de edición no se cargó correctamente');
                console.log('   Error:', e.message);
              }
              
              break; // Salir del bucle después de encontrar y probar la edición
            } else {
              console.log('❌ La URL no cambió correctamente después del clic en editar');
              console.log('   Esto indica que la funcionalidad de edición no está funcionando');
              
              // Tomar captura de pantalla para ver qué está pasando
              await page.screenshot({ path: '/home/ubuntu/.openclaw/workspace/edit_click_result.png' });
              console.log('   Captura tomada para revisión');
            }
          }
        }
      }
    } else {
      // Buscar cualquier elemento que indique anuncios
      console.log('   No se encontraron anuncios con .card.mb-3, buscando otros selectores...');
      
      const allCards = await page.$$('.card');
      console.log(`   Total de cards encontradas: ${allCards.length}`);
      
      // Buscar texto que indique anuncios
      const hasAds = await page.isVisible('text=/Madrid|Barcelona|Paris|Roma|route|destino|origen/i');
      console.log(`   Indicios de anuncios en la página: ${hasAds}`);
      
      // Tomar captura para inspeccionar
      await page.screenshot({ path: '/home/ubuntu/.openclaw/workspace/dashboard_content.png' });
      console.log('   Captura de dashboard guardada para revisión');
    }
    
  } catch (error) {
    console.error('❌ Error durante la prueba:', error.message);
    await page.screenshot({ path: '/home/ubuntu/.openclaw/workspace/test_error.png' });
  } finally {
    await browser.close();
  }
})();