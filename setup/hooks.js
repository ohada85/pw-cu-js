const playwright = require('playwright');
const {Before, After, BeforeAll, AfterAll, setDefaultTimeout } = require('@cucumber/cucumber')

setDefaultTimeout(20 * 1000);

BeforeAll(async () => {
  const headless = process.env.headless === 'true';
  global.browser = await playwright['chromium'].launch({
    headless: headless,
    args: ["--start-maximized"],
  });
})

AfterAll(async () => {
  await global.browser.close();
})

Before(async () => {
  global.context = await global.browser.newContext({ viewport: null });
  global.page = await global.context.newPage();
  page.on('dialog', dialog => dialog.dismiss());
})


After(async function (scenario) {
  if (scenario.result.status === 'FAILED') {
    console.log('The scenario failed');

    const screenshot = await global.page.screenshot({ encoding: 'base64', path: `reports/screenshots/${scenario.pickle.name}.png` })
    this.attach(screenshot, "image/png", {fileName: `${scenario.pickle.name}.png`});
  }

  await global.page.close();
  await global.context.close();
});

