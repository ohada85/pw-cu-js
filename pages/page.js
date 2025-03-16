class Page {
  constructor() {
  }

  async click(locator) {
    return await page.locator(locator).click();
  }

  async getText(locator) {
    return await page.locator(locator).textContent();
  }

  async getTexts(locator) {
    return await page.locator(locator).allTextContents();
  }

  async getAttribute(locator, attribute) {
    return await page.locator(locator).getAttribute(attribute);
  }

  async getURL() {
    return await page.url();
  }

  async urlChanged(current_url) {
    await page.waitForURL((url) => url !== current_url);
  };

  async waitToUrlMatch(url) {
    return page.waitForURL(new RegExp(`^.*${url}.*$`));
  }

  async listenForNewPage() {
    this.newPagePromise = context.waitForEvent('page');
  }

  async switchToNewPage() {
    await this.newPagePromise;
    const pages = context.pages();
    global.page = pages[pages.length - 1];
    return page.bringToFront();
  }

}

module.exports = { Page };