import Page from "./page.js";

class CheckStatePage extends Page {
  // selector para la tabla de cuentas - ACTUALIZADO
  get accountsTable() {
    return $("#accountTable");
  }

  // selector para listado de cuentas - ACTUALIZADO
  get accountsList() {
    return $$("#accountTable tbody tr");
  }

  // selector para enlaces de cuenta - ACTUALIZADO
  get accountLinks() {
    return $$("#accountTable tbody tr td:nth-child(1) a");
  }

  // Método mejorado para encontrar cuenta por ID
  async getAccountLink(accountId) {
    // Buscar en todas las filas de la tabla
    const rows = await $$("#accountTable tbody tr");
    
    for (const row of rows) {
      const firstCell = await row.$('td:nth-child(1)');
      if (firstCell) {
        const cellText = await firstCell.getText();
        if (cellText.includes(accountId)) {
          const link = await firstCell.$('a');
          if (link) return link;
        }
      }
    }
    throw new Error(`Account with ID ${accountId} not found`);
  }

  // panel de detalles - ACTUALIZADOS para ParaBank real
  get detailsTitle() {
    return $("h1.title");
  }

  get detailAccountId() {
    return $("#accountId");
  }

  get detailAccountType() {
    return $("#accountType");
  }

  get detailBalance() {
    return $("#balance");
  }

  get detailAvailable() {
    return $("#availableBalance");
  }

  // NUEVO: Verificar si estamos en la página correcta
  get pageTitle() {
    return $("h1.title");
  }

  async waitForAccountsTable() {
    await this.accountsTable.waitForExist({ timeout: 10000 });
    await this.accountsTable.waitForDisplayed({ timeout: 10000 });
    
    // Esperar a que haya al menos una cuenta
    await browser.waitUntil(
      async () => (await this.accountLinks.length) > 0,
      { timeout: 10000, timeoutMsg: 'No accounts found in table' }
    );
  }

  async selectAccount(accountId) {
    const accountEl = await this.getAccountLink(accountId);
    await accountEl.waitForExist({ timeout: 10000 });
    await accountEl.waitForClickable({ timeout: 10000 });
    await accountEl.click();
    
    // Esperar a que los detalles se carguen
    await this.detailAccountId.waitForExist({ timeout: 10000 });
    await this.detailBalance.waitForExist({ timeout: 10000 });
  }

  async getAccountDetails() {
    // Verificar que estamos en la página de detalles
    await this.detailsTitle.waitForExist({ timeout: 5000 });
    
    return {
      title: await this.detailsTitle.getText(),
      accountId: await this.detailAccountId.getText(),
      accountType: await this.detailAccountType.getText(),
      balance: await this.detailBalance.getText(),
      available: await this.detailAvailable.getText(),
    };
  }

  // Método para obtener información de todas las cuentas
  async getAllAccountsInfo() {
    await this.waitForAccountsTable();
    const accounts = [];
    const rows = await this.accountsList;
    
    for (let i = 0; i < rows.length; i++) {
      const cells = await rows[i].$$('td');
      if (cells.length >= 4) {
        const accountId = await cells[0].getText();
        const accountType = await cells[1].getText();
        const balance = await cells[2].getText();
        const available = await cells[3].getText();
        
        accounts.push({ accountId, accountType, balance, available });
      }
    }
    return accounts;
  }

  open() {
    return super.open('overview');
  }
}

export default new CheckStatePage();
