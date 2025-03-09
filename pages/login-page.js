class LoginPage {

  constructor() {

    this.url = 'https://www.saucedemo.com/';

    this.elements = {
      nameInput: ('#user-name'),
      passwordInput: ('#password'),
      loginButton: ('#login-button'),



    }
  }
  async navigateToLoginScreen() {
    await page.goto(this.url)
  }

  async loginWithDefaultValues() {
    await page.fill(this.elements.nameInput, 'standard_user');
    await page.fill(this.elements.passwordInput, 'secret_sauce');
    await page.click(this.elements.loginButton);
  }

  async submitLoginWithParameters(username, password) {
    await page.fill(this.elements.nameInput, username);
    await page.fill(this.elements.passwordInput, password);
    await page.click(this.elements.loginButton);
  }

  async getUserLoggedIn() {
    // Wait for web element in the Homepage (next page)
    await page.waitForSelector('.inventory_list')
  }

  async pause() {
    // Wait for 3 seconds
    await page.waitForTimeout(3000)
  }
}

module.exports = { LoginPage }
