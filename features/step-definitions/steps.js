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

// CHECK ALL ACCOUNTS VISIBLE
Then(/^I should see all my accounts with their current balances$/, async () => {
  const accounts = await CheckStatePage.getAllAccountNumbers();
  expect(accounts.length).toBeGreaterThan(0);
  
  for (const account of accounts) {
    const balanceElement = await CheckStatePage.getBalanceForAccount(account);
    await expect(balanceElement).toBeExisting();
    const balanceText = await balanceElement.getText();
    expect(balanceText).toMatch(/^\$\d+\.\d{2}$/); // Formato de dinero
  }
});

//CHECK ACCOUNT STATE
When(/^I click on an (.*)$/, async (account) => {
  await CheckStatePage.selectAccount(account);
});

Then(/^I can see the (.*) as (.*), (.*), (.*) and (.*)$/,
     async (details, account, accountType, balance, available) => {
        await expect(CheckStatePage.accountDetailsTitle).toBeExisting();
        await expect(CheckStatePage.accountDetailsTitle).toHaveTextContaining(details);
        
        await expect(CheckStatePage.accountId).toBeExisting();
        await expect(CheckStatePage.accountId).toHaveTextContaining(account);
        
        await expect(CheckStatePage.accountType).toBeExisting();
        await expect(CheckStatePage.accountType).toHaveTextContaining(accountType);
        
        await expect(CheckStatePage.balance).toBeExisting();
        await expect(CheckStatePage.balance).toHaveTextContaining(balance);
        
        await expect(CheckStatePage.availableBalance).toBeExisting();
        await expect(CheckStatePage.availableBalance).toHaveTextContaining(available);
});

// VALIDATE ACCOUNT SWITCHING
When(/^I switch from account (.*) to account (.*)$/, async (fromAccount, toAccount) => {
  await CheckStatePage.selectAccount(fromAccount);
  await browser.pause(1000); // Esperar a que cargue la primera cuenta
  await CheckStatePage.goToAccountsOverview(); // Volver a la vista general
  await CheckStatePage.selectAccount(toAccount);
});

Then(/^I should see the details updated for account (.*)$/, async (account) => {
  await expect(CheckStatePage.accountId).toBeExisting();
  await expect(CheckStatePage.accountId).toHaveTextContaining(account);
  await expect(CheckStatePage.balance).toBeExisting();
});

//*********************************************************************************************************************************************************
