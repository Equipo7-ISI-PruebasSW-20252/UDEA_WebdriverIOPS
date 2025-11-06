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

//LOGIN
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

//CHECK ACCOUNT STATE
// Ver que la lista de cuentas aparece
Then(/^I should see the accounts list displayed$/, async () => {
  await expect(CheckStatePage.accountsList.length).toBeGreaterThan(0);
  // o más robusto:
  await expect(CheckStatePage.accountsList[0]).toBeExisting();
});

Then(/^the accounts list should contain at least (\d+) account$/, async (minCount) => {
  const list = await CheckStatePage.accountsList;
  await expect(list.length).toBeGreaterThanOrEqual(parseInt(minCount, 10));
});

// Click parametrizado
When(/^I click on account "([^"]+)"$/, async (accountId) => {
  await CheckStatePage.selectAccount(accountId);
});

// Ver detalles con parsing de balance
Then(/^I should see the details panel showing account id "([^"]+)", type "([^"]+)" and balance "([^"]+)"$/, 
  async (accountId, accountType, expectedBalanceText) => {
    const details = await CheckStatePage.getAccountDetails();
    await expect(details.title).toContain('Account Details'); // o el texto apropiado
    await expect(details.accountId).toContain(accountId);
    await expect(details.accountType).toContain(accountType);

    // Normalizar y comparar el balance (quita signos y separadores)
    const normalize = txt => txt.replace(/[^0-9.-]+/g, '');
    const actual = parseFloat(normalize(details.balance));
    const expected = parseFloat(normalize(expectedBalanceText));
    await expect(actual).toEqual(expected);
});

// Registrar balance y guardarlo en World (si usas cucumber world) o en variable compartida simple
let lastRecordedBalance = null;

When(/^I record the balance shown as "([^"]+)"$/, async (alias) => {
  const details = await CheckStatePage.getAccountDetails();
  // guardo en variable global definida arriba (simple)
  lastRecordedBalance = details.balance;
});

Then(/^the previously recorded balance "([^"]+)" should not equal the current balance$/, async (alias) => {
  const details = await CheckStatePage.getAccountDetails();
  if (!lastRecordedBalance) throw new Error('No balance recorded previously');
  await expect(details.balance).not.toEqual(lastRecordedBalance);
});

//*********************************************************************************************************************************************************
