const { chromium } = require('playwright');

(async () => {
  console.log('Lanzando navegador Edge local para Full Scan...');
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const page = await browser.newPage();
  
  try {
    console.log('Navegando a Login...');
    await page.goto('http://localhost:3000/admin/login');
    await page.fill('input[type="email"]', 'qa@demo.com');
    await page.fill('input[type="password"]', 'password123');
    await page.click('button[type="submit"]');
    
    console.log('Esperando Dashboard...');
    await page.waitForURL('**/dashboard**');
    
    const urlsToTest = [
      'http://localhost:3000/site/qa-demo/dashboard',
      'http://localhost:3000/site/qa-demo/dashboard/users',
      'http://localhost:3000/site/qa-demo/dashboard/crm/companies',
      'http://localhost:3000/site/qa-demo/dashboard/crm/people',
      'http://localhost:3000/site/qa-demo/dashboard/crm/opportunities',
      'http://localhost:3000/site/qa-demo/dashboard/quotes',
      'http://localhost:3000/site/qa-demo/dashboard/appointments',
      'http://localhost:3000/site/qa-demo/dashboard/projects',
      'http://localhost:3000/site/qa-demo/dashboard/ecommerce',
      'http://localhost:3000/site/qa-demo/dashboard/appointments/event-types',
      'http://localhost:3000/site/qa-demo/dashboard/erp',
      'http://localhost:3000/site/qa-demo/dashboard/inventory'
    ];

    for (const url of urlsToTest) {
      console.log('Probando:', url);
      const res = await page.goto(url, { waitUntil: 'domcontentloaded' });
      
      // Wait for React to hydrate and any errors to pop up
      await page.waitForTimeout(1000); 

      const html = await page.innerHTML('body');
      
      if (html.includes('Next.js (16.2.12) out of date') || html.includes('Runtime Error') || html.includes('Unhandled Runtime Error')) {
        console.log('❌ ERROR EN', url);
        // Extraer mensaje de error
        const errorText = await page.evaluate(() => {
          const el = document.querySelector('nextjs-portal');
          return el ? el.shadowRoot.textContent : 'Unknown error';
        });
        console.log('Detalle:', errorText.substring(0, 200));
        throw new Error('Fallo crítico en UI');
      }

      if (res.status() >= 400) {
        console.log('❌ HTTP ERROR EN', url, res.status());
        throw new Error('Fallo de red ' + res.status());
      }
      
      console.log('✅ OK:', url);
    }

    console.log('====== TODAS LAS RUTAS PASARON EXITOSAMENTE ======');
  } catch (err) {
    console.error('Error durante la prueba de UI:', err);
  } finally {
    await browser.close();
  }
})();
