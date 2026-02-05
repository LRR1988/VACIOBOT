const { chromium } = require('playwright');

(async () => {
  console.log('Iniciando prueba de login y edición...');
  
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  try {
    // Ir a la página principal
    console.log('1. Accediendo a la aplicación Travabus...');
    await page.goto('http://localhost:3000');
    
    // Esperar a que se cargue la aplicación (esperar al menos 3 segundos para que React se monte)
    await page.waitForTimeout(3000);
    
    // Verificar si hay un botón de login en la cabecera
    console.log('2. Buscando elementos de autenticación...');
    
    // Intentar encontrar elementos de login por diferentes selectores
    const selectorsToTry = [
      'button:has-text("Login")',
      'button:has-text("Iniciar sesión")',
      'button:text-is("Login")',
      'button:text-is("Iniciar sesión")',
      '.btn:has-text("Login")',
      '.btn:has-text("Iniciar sesión")',
      '[data-testid="login-button"]',
      'nav button',
      '.header button'
    ];
    
    let loginButtonFound = false;
    for (const selector of selectorsToTry) {
      try {
        const element = await page.$(selector);
        if (element) {
          console.log(`   Encontrado botón con selector: ${selector}`);
          loginButtonFound = true;
          
          // Hacer clic en el botón
          await element.click();
          console.log('   Clic en botón de login realizado');
          
          break;
        }
      } catch (e) {
        // Continuar con el siguiente selector
        continue;
      }
    }
    
    if (!loginButtonFound) {
      console.log('   No se encontró botón de login, intentando navegar directamente...');
      await page.goto('http://localhost:3000/#/login');
      await page.waitForTimeout(2000);
    }
    
    // Esperar a que aparezca el formulario de login
    console.log('3. Buscando formulario de login...');
    const loginSelectors = [
      'input[name="username"]',
      'input[name="email"]',
      'input[type="text"]',
      '.form-input',
      'form input'
    ];
    
    let loginFormFound = false;
    for (const selector of loginSelectors) {
      try {
        await page.waitForSelector(selector, { timeout: 5000 });
        console.log(`   Formulario de login encontrado con selector: ${selector}`);
        loginFormFound = true;
        
        // Rellenar credenciales de prueba
        await page.fill(selector, 'empresa1');
        
        // Encontrar el campo de contraseña
        await page.fill('input[type="password"]', '123456');
        
        // Buscar y hacer clic en el botón de submit
        const submitSelectors = ['button[type="submit"]', 'button:has-text("Login")', '.btn-primary', 'button'];
        for (const submitSel of submitSelectors) {
          try {
            await page.click(submitSel);
            console.log(`   Clic en botón de submit con selector: ${submitSel}`);
            break;
          } catch (e) {
            continue;
          }
        }
        
        break;
      } catch (e) {
        continue;
      }
    }
    
    if (!loginFormFound) {
      console.log('   No se encontró formulario de login');
    }
    
    // Esperar un momento para que se procese el login
    await page.waitForTimeout(3000);
    
    // Intentar ir directamente al dashboard
    console.log('4. Navegando al dashboard...');
    await page.goto('http://localhost:3000/#/dashboard');
    await page.waitForTimeout(2000);
    
    // Verificar si hay anuncios en el dashboard
    console.log('5. Buscando anuncios en el dashboard...');
    const adSelectors = ['.ads-list', '.card', '[class*="ad"]', '.card.mb-3'];
    
    let adsFound = false;
    for (const selector of adSelectors) {
      try {
        const elements = await page.$$(selector);
        if (elements.length > 0) {
          console.log(`   Encontrados ${elements.length} elementos con selector: ${selector}`);
          adsFound = true;
          
          // Buscar botones de edición
          const editButtons = await page.$$('.btn-outline');
          console.log(`   Botones encontrados: ${editButtons.length}`);
          
          for (let i = 0; i < editButtons.length; i++) {
            const buttonText = await editButtons[i].textContent();
            console.log(`   Botón ${i}: "${buttonText}"`);
            
            if (buttonText && (buttonText.toLowerCase().includes('edit') || buttonText.toLowerCase().includes('editar'))) {
              console.log(`   Intentando hacer clic en botón de edición: "${buttonText}"`);
              
              // Registrar cambios de URL
              let initialURL = page.url();
              console.log(`   URL inicial: ${initialURL}`);
              
              await editButtons[i].click();
              
              // Esperar un momento para ver si cambia la URL
              await page.waitForTimeout(2000);
              
              let newURL = page.url();
              console.log(`   URL después de clic: ${newURL}`);
              
              if (newURL !== initialURL) {
                console.log('✅ ¡FUNCIONALIDAD DE EDICIÓN DETECTADA!');
                console.log(`   - URL cambió de: ${initialURL}`);
                console.log(`   - A: ${newURL}`);
                
                // Verificar si se carga el formulario de edición
                await page.waitForTimeout(2000);
                const editFormSelectors = [
                  'h2:has-text("Editar Anuncio")',
                  '.card-title:has-text("Editar Anuncio")',
                  'form'
                ];
                
                for (const formSel of editFormSelectors) {
                  try {
                    const formExists = await page.isVisible(formSel);
                    console.log(`   Formulario de edición (${formSel}): ${formExists}`);
                    
                    if (formExists) {
                      console.log('✅ FORMULARIO DE EDICIÓN CARGADO CORRECTAMENTE');
                      break;
                    }
                  } catch (e) {
                    console.log(`   Selector ${formSel} no encontrado: ${e.message}`);
                  }
                }
              } else {
                console.log('❌ La URL no cambió después del clic en editar');
                console.log('   La funcionalidad de edición probablemente no funciona');
              }
              
              break; // Salir del bucle de botones después del primer clic
            }
          }
          
          break;
        }
      } catch (e) {
        continue;
      }
    }
    
    if (!adsFound) {
      console.log('   No se encontraron anuncios en el dashboard');
      await page.screenshot({ path: '/home/ubuntu/.openclaw/workspace/debug_dashboard.png' });
      console.log('   Captura de pantalla guardada para depuración');
    }
    
  } catch (error) {
    console.error('❌ Error durante la prueba:', error.message);
    await page.screenshot({ path: '/home/ubuntu/.openclaw/workspace/error_screenshot.png' });
  } finally {
    await browser.close();
  }
})();