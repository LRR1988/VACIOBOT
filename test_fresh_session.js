const { chromium } = require('playwright');

(async () => {
  console.log('Prueba con sesión completamente nueva...');
  
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  try {
    // Limpiar cualquier cookie/localStorage
    await page.context().clearCookies();
    console.log('1. Cookies limpias, accediendo a la página principal...');
    
    await page.goto('http://localhost:3000');
    await page.waitForTimeout(3000);
    
    // Verificar si hay botón de login
    console.log('2. Buscando botón de login...');
    const loginBtn = await page.$('button:has-text("Login"), button:has-text("Iniciar sesión")');
    
    if (loginBtn) {
      console.log('   Botón de login encontrado, haciendo clic...');
      await loginBtn.click();
      await page.waitForTimeout(1000);
    } else {
      console.log('   No se encontró botón de login visible, probando credenciales directamente...');
      // Intentar login directo
      await page.goto('http://localhost:3000/#/login');
      await page.waitForTimeout(2000);
    }
    
    // Llenar credenciales
    console.log('3. Ingresando credenciales...');
    await page.fill('input[name="username"], input[type="text"]', 'empresa1');
    await page.fill('input[name="password"], input[type="password"]', '123456');
    
    // Hacer clic en login
    await page.click('button:has-text("Login"), button:has-text("Iniciar sesión"), button[type="submit"]');
    await page.waitForTimeout(3000);
    
    // Verificar si se redirige al dashboard o cambia el estado
    console.log('4. Verificando estado después del login...');
    console.log(`   URL actual: ${page.url()}`);
    
    // Ir al dashboard
    console.log('5. Navegando al dashboard...');
    await page.goto('http://localhost:3000/#/dashboard');
    await page.waitForTimeout(5000); // Esperar más tiempo para que se carguen los anuncios
    
    // Tomar captura para ver exactamente qué hay en el dashboard
    await page.screenshot({ path: '/home/ubuntu/.openclaw/workspace/fresh_dashboard.png' });
    console.log('   Captura del dashboard guardada');
    
    // Extraer texto de la página para ver qué contiene
    const pageText = await page.textContent('body');
    console.log('6. Contenido de texto del dashboard:');
    console.log('   ' + pageText.substring(0, 500) + '...');
    
    // Buscar anuncios específicos
    const adElements = await page.$$('.card');
    console.log(`   Cards encontradas: ${adElements.length}`);
    
    for (let i = 0; i < adElements.length; i++) {
      const cardText = await adElements[i].textContent();
      console.log(`   Card ${i}: ${cardText.substring(0, 100)}...`);
      
      // Buscar botones dentro de cada card
      const buttons = await adElements[i].$$('button');
      for (let j = 0; j < buttons.length; j++) {
        const btnText = await buttons[j].textContent();
        console.log(`     Botón ${j} en card ${i}: "${btnText}"`);
        
        if (btnText.toLowerCase().includes('edit') || btnText.toLowerCase().includes('editar')) {
          console.log(`     >>> Este es un botón de edición!`);
          
          // Registrar URL antes del clic
          const initialUrl = page.url();
          console.log(`     URL antes: ${initialUrl}`);
          
          // Hacer clic
          await buttons[j].click();
          await page.waitForTimeout(3000);
          
          const newUrl = page.url();
          console.log(`     URL después: ${newUrl}`);
          
          if (newUrl !== initialUrl) {
            console.log('     ✅ Clic en edición funcionó - URL cambió!');
            
            // Verificar si se carga el formulario de edición
            try {
              await page.waitForSelector('form', { timeout: 5000 });
              const hasEditTitle = await page.isVisible('h2:has-text("Editar Anuncio")');
              console.log(`     Título de edición visible: ${hasEditTitle}`);
              
              if (hasEditTitle) {
                console.log('     ✅ FORMULARIO DE EDICIÓN CARGADO CORRECTAMENTE!');
                console.log('     ✅ LA FUNCIONALIDAD DE EDICIÓN ESTÁ FUNCIONANDO!');
              }
            } catch (e) {
              console.log(`     Formulario no encontrado: ${e.message}`);
            }
          }
        }
      }
    }
    
    // También buscar botones fuera de las cards
    const allButtons = await page.$$('button');
    console.log(`   Total de botones en la página: ${allButtons.length}`);
    
    for (let i = 0; i < allButtons.length; i++) {
      const btnText = await allButtons[i].textContent();
      if (btnText.toLowerCase().includes('edit') || btnText.toLowerCase().includes('editar')) {
        console.log(`   Botón de edición encontrado fuera de cards: "${btnText}" en posición ${i}`);
      }
    }
    
  } catch (error) {
    console.error('❌ Error durante la prueba:', error.message);
    await page.screenshot({ path: '/home/ubuntu/.openclaw/workspace/final_error.png' });
  } finally {
    await browser.close();
  }
})();