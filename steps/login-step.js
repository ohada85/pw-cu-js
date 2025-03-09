const { Given, When, Then} = require('@cucumber/cucumber')
const { LoginPage } = require('.././pages/login-page')

// Initializing the object (loginPage) of class (LoginPage)
const loginPage = new LoginPage()

Given('I visit a login page', async ()=> {
  await loginPage.navigateToLoginScreen()
})

When('I fill the login form with valid credentials', async ()=> {
  await loginPage.loginWithDefaultValues()
})

Then('I should see the home page', async ()=> {
    await loginPage.getUserLoggedIn()
})

Then('I wait for 3 seconds', async ()=> {
  await loginPage.pause()
})

Then(/^I fill the login form with "([^"]*)" and "([^"]*)"$/,async (username, password)=> {
    await loginPage.submitLoginWithParameters(username, password)
  }
)
