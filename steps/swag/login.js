const { Given, When, Then} = require('@cucumber/cucumber')
const { Login } = require('../../pages/swag/login')

const login = new Login();

Given('I open the swag page', async () => {
  await login.navigateToLoginScreen();
});

Then(/^I should see the title "(.*)"$/, async (expectedTitle) => {
  await login.validateTitle(expectedTitle);
});

When(/^user logins as "(.*)"$/, async (user) => {
  await login.login(user);
});