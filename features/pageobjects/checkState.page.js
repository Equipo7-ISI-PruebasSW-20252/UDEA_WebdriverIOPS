import Page from "./page.js";

class CheckStatePage extends Page {

  // Selectores mejorados
  get accountDetailsTitle() {
    return $('h1.title');
  }

  get accountId() {
    return $('#accountId');
  }

  get accountType() {
    return $('#accountType');
  }

  get balance() {
    return $('#balance');
  }

  get availableBalance() {
    return $('#availableBalance');
  }

  // Método para obtener todas las cuentas
  get allAccounts() {
    return $$("//tr[contains(@ng-repeat, 'account')]//a[contains(@href, 'activity')]");
  }

  // Método para obtener balances de todas las cuentas
  get allAccountBalances() {
    return $$("//tr[contains(@ng-repeat, 'account')]//td[contains(@class, 'balance')]");
  }

  async selectAccount(account) {
    const accountElement = await $(`//a[normalize-space()='${account}']`);
    await expect(accountElement).toBeExisting();
    await accountElement.waitForClickable();
    await accountElement.click();
  }

  async getAllAccountNumbers() {
    const accounts = await this.allAccounts;
    const accountNumbers = [];
    
    for (const account of accounts) {
      const accountText = await account.getText();
      accountNumbers.push(accountText);
    }
    
    return accountNumbers;
  }

  async getBalanceForAccount(accountNumber) {
    return await $(`//a[text()='${accountNumber}']/ancestor::tr//td[contains(@class, 'balance')]`);
  }

  async getTotalAccountsCount() {
    const accounts = await this.allAccounts;
    return accounts.length;
  }

  open () {
    return super.open('overview');
  } 
}

export default new CheckStatePage();
