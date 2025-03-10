const { expect } = require('@playwright/test');

class Login {

  constructor() {
    this.url = 'https://www.saucedemo.com/';
    this.password = "secret_sauce";

    this.elements = {
      username: '[data-test=username]',
      password: '[data-test=password]',
      loginButton: '[data-test=login-button]'
    }
  }

  async navigateToLoginScreen() {
    await page.goto(this.url)
  };

  async validateTitle(expectedTitle) {
    const title = await page.title();
    expect(title).toBe(expectedTitle);
  }

  async login(user) {
    await page.fill('[data-test=username]', user);
    await page.fill('[data-test=password]', this.password);
    await page.click(this.elements.loginButton);
  }

}
module.exports = { Login }

