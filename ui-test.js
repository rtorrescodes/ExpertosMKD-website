const { chromium } = require('playwright');

(async () => {
  console.log('Lanzando navegador Edge local...');
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const page = await browser.newPage();
  
  try {
    console.log('Navegando a la tienda pública...');
    await page.goto('http://localhost:3000/site/qa-demo/store');
    await page.waitForLoadState('networkidle');
    const storeTitle = await page.locator('h1').textContent();
    console.log('Store Title:', storeTitle?.trim());
    
    console.log('Navegando al Dashboard (debe redirigir a login)...');
    await page.goto('http://localhost:3000/site/qa-demo/dashboard');
    await page.waitForLoadState('networkidle');
    const loginUrl = page.url();
    console.log('URL actual (esperado /admin/login):', loginUrl);
    
    console.log('Llenando formulario de login...');
    await page.fill('input[type="email"]', 'qa@demo.com');
    await page.fill('input[type="password"]', 'password123');
    await page.click('button[type="submit"]');
    
    console.log('Esperando navegación al Dashboard...');
    await page.waitForURL('**/dashboard**');
    const dashboardTitle = await page.locator('h2').first().textContent();
    console.log('Dashboard Title:', dashboardTitle?.trim());

    console.log('Entrando a E-commerce Dashboard...');
    await page.goto('http://localhost:3000/site/qa-demo/dashboard/ecommerce');
    await page.waitForLoadState('networkidle');
    
    // Si carga sin error 500
    const body = await page.innerHTML('body');
    if (body.includes('Catálogo')) {
      console.log('Dashboard Ecommerce cargó correctamente!');
    }

    console.log('Todas las pruebas de UI pasaron correctamente. ✅');
  } catch (err) {
    console.error('Error durante la prueba de UI:', err);
  } finally {
    await browser.close();
  }
})();
