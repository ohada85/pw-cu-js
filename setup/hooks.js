const playwright = require('playwright');
const {Before, After, BeforeAll, AfterAll, setDefaultTimeout } = require('@cucumber/cucumber')

setDefaultTimeout(10 * 1000);

BeforeAll(async () => {
  global.browser = await playwright['chromium'].launch({ headless: false });
})

AfterAll(async () => {
  await global.browser.close();
})

Before(async () => {
  global.context = await global.browser.newContext();
  global.page = await global.context.newPage();
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

