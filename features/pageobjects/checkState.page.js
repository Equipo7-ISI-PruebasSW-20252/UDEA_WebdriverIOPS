import Page from "./page.js";

class CheckStatePage extends Page {
  // selector para la tabla de cuentas
  get accountsTable() {
    return $("#accountTable");
  }

  // selector para listado de cuentas
  get accountsList() {
    return $$("#accountTable tbody tr a");
  }

  accountLink(accountId) {
    return $(`//a[normalize-space()="${accountId}"]`);
  }

  // panel de detalles
  get detailsTitle() {
    return $(".title");
  }

  get detailAccountId() {
    return $("//td[@id='accountId']");
  }

  get detailAccountType() {
    return $("//td[@id='accountType']");
  }

  get detailBalance() {
    return $("//td[@id='balance']");
  }

  get detailAvailable() {
    return $("//td[@id='availableBalance']");
  }

  // NUEVO MÉTODO: Esperar a que la tabla de cuentas esté disponible
  async waitForAccountsTable() {
    await this.accountsTable.waitForExist({ timeout: 10000 });
    await this.accountsTable.waitForDisplayed({ timeout: 10000 });
  }

  async selectAccount(account) {
    const accountEl = this.accountLink(account);
    await accountEl.waitForExist({ timeout: 5000 });
    await accountEl.waitForClickable({ timeout: 5000 });
    await accountEl.click();
    // esperar a que el panel de detalles se actualice
    await this.detailsTitle.waitForDisplayed({ timeout: 5000 });
  }

  async getAccountDetails() {
    // devuelve objeto con los textos
    return {
      title: await this.detailsTitle.getText(),
      accountId: await this.detailAccountId.getText(),
      accountType: await this.detailAccountType.getText(),
      balance: await this.detailBalance.getText(),
      available: await this.detailAvailable.getText(),
    };
  }

  open() {
    return super.open('overview');
  }
}

export default new CheckStatePage();
