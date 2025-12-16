/*
  Generate PDF from src/assets/resume.html into src/assets/resume.pdf
*/
const path = require('path');
const fs = require('fs');

async function main() {
  const resumeHtmlPath = path.resolve(__dirname, '../src/assets/resume.html');
  const resumePdfPath = path.resolve(__dirname, '../src/assets/resume.pdf');

  if (!fs.existsSync(resumeHtmlPath)) {
    console.error('Resume HTML not found at:', resumeHtmlPath);
    process.exit(1);
  }

  // Lazy require to avoid failing if puppeteer isn't installed yet
  let puppeteer;
  try {
    puppeteer = require('puppeteer');
  } catch (e) {
    console.error('Missing dependency: puppeteer. Install with: npm i -D puppeteer');
    process.exit(1);
  }

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();

  const fileUrl = 'file:///' + resumeHtmlPath.replace(/\\/g, '/');
  await page.goto(fileUrl, { waitUntil: 'networkidle0' });

  await page.pdf({
    path: resumePdfPath,
    format: 'A4',
    printBackground: true,
    margin: { top: '15mm', right: '12mm', bottom: '15mm', left: '12mm' }
  });

  await browser.close();
  console.log('Generated PDF:', resumePdfPath);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
