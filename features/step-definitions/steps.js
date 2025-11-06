import { Given, When, Then } from "@wdio/cucumber-framework";

import LoginPage from '../pageobjects/login.page.js';
import CheckStatePage from '../pageobjects/checkState.page.js';

const pages = {
  login: LoginPage,
  checkState: CheckStatePage,
};

Given(/^I am on the (\w+) page$/, async (page) => {
  await pages[page].open();
});

Given(/^I am logged in with (\w+) and (.*)$/, async (username, password) => {
  // Verificar si ya estamos en una página logueada
  try {
    const currentUrl = await browser.getUrl();
    if (!currentUrl.includes('login') && !currentUrl.includes('index')) {
      // Si ya estamos en una página logueada, ir directamente a checkState
      await CheckStatePage.open();
      return;
    }
  } catch (error) {
    // Si hay error, proceder con login normal
  }
  await LoginPage.open();
  await LoginPage.login(username, password);
});

// LOGIN
When(/^I login with (\w+) and (.*)$/, async (username, password) => {
  await LoginPage.login(username, password);
});

Then(/^I should see a text saying (.*)$/, async (message) => {
  if (message == "Error!") {
    // invalid username or password
    await expect($('.title')).toBeExisting();
    await expect($('.title')).toHaveTextContaining(message);
  } else {
    // valid username or password
    await expect($('.title')).toBeExisting(); 
    await expect($('.title')).toHaveTextContaining(message);
  } 
});

//*********************************************************************************************************************************************************

// CHECK ACCOUNT STATE - ACTUALIZADO
Then(/^I should see the accounts list displayed$/, async () => {
  await CheckStatePage.waitForAccountsTable();
  const list = await CheckStatePage.accountLinks;
  await expect(list.length).toBeGreaterThan(0);
});

Then(/^the accounts list should contain at least (\d+) account$/, async (minCount) => {
  const list = await CheckStatePage.accountLinks;
  await expect(list.length).toBeGreaterThanOrEqual(parseInt(minCount, 10));
});

When(/^I click on account "([^"]+)"$/, async (accountId) => {
  await CheckStatePage.selectAccount(accountId);
});

Then(/^I should see the details panel showing account id "([^"]+)", type "([^"]+)" and balance "([^"]+)"$/, 
  async (accountId, accountType, expectedBalanceText) => {
    const details = await CheckStatePage.getAccountDetails();
    
    // Verificar detalles de la cuenta
    await expect(details.accountId).toContain(accountId);
    await expect(details.accountType).toContain(accountType);

    // Normalizar y comparar el balance
    const normalize = txt => txt.replace(/[^0-9.-]+/g, '');
    const actual = parseFloat(normalize(details.balance));
    const expected = parseFloat(normalize(expectedBalanceText));
    
    // Usar toBeCloseTo para comparaciones de punto flotante
    await expect(actual).toBeCloseTo(expected, 2);
});

When(/^I record the balance shown as "([^"]+)"$/, async (alias) => {
  const details = await CheckStatePage.getAccountDetails();
  this.recordedBalance = details.balance;
});

Then(/^the previously recorded balance "([^"]+)" should not equal the current balance$/, async (alias) => {
  const details = await CheckStatePage.getAccountDetails();
  if (!this.recordedBalance) throw new Error('No balance recorded previously');
  await expect(details.balance).not.toEqual(this.recordedBalance);
});

// Step para debugging - ver todas las cuentas disponibles
Then(/^I print all available accounts$/, async () => {
  const accounts = await CheckStatePage.getAllAccountsInfo();
  console.log('Available accounts:', accounts);
});

//*********************************************************************************************************************************************************
