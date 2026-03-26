import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', err => console.log('PAGE ERROR:', err.toString()));

  try {
      await page.goto('http://localhost:8080/login.html', { waitUntil: 'networkidle2' });
      await page.waitForSelector('#login-username');
      
      console.log('Logging in/Signing up...');
      await page.click('#show-signup');
      await page.type('#signup-username', 'testuser');
      await page.type('#signup-password', 'testpass');
      await page.click('#signup-btn');
      
      await page.waitForTimeout(1000);
      
      console.log('Now at:', page.url());
      
      const days = await page.$$('.day');
      console.log(`Found ${days.length} days on calendar.`);
      for (let day of days) {
          const text = await page.evaluate(el => el.textContent, day);
          if (text.trim() === '1') {
              console.log("Clicking day 1...");
              await day.click();
              break;
          }
      }
      
      await page.waitForTimeout(2000);
  } catch (e) {
      console.log("PUPPETEER EXCEPTION:", e);
  }

  await browser.close();
})();
