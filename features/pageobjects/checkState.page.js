import Page from "./page.js";

class CheckStatePage extends Page {
  // selector para la tabla de cuentas - CORREGIDO
  get accountsTable() {
    return $("#accountTable");
  }

  // selector para filas de la tabla - CORREGIDO
  get accountRows() {
    return $$("#accountTable tbody tr");
  }

  // selector para enlaces de cuenta - CORREGIDO (basado en la imagen)
  get accountLinks() {
    return $$("#accountTable tbody tr td:first-child");
  }

  // Método mejorado para encontrar cuenta por ID - CORREGIDO
  async getAccountLink(accountId) {
    // Buscar en todas las filas de la tabla
    const rows = await this.accountRows;
    
    for (const row of rows) {
      const firstCell = await row.$('td:first-child');
      if (firstCell) {
        const cellText = await firstCell.getText();
        if (cellText.trim() === accountId) {
          return firstCell; // En ParaBank, el ID es texto directo, no un enlace
        }
      }
    }
    throw new Error(`Account with ID ${accountId} not found`);
  }

  // panel de detalles - CORREGIDOS (cuando se hace clic en una cuenta)
  get detailsTitle() {
    return $("h1.title");
  }

  // Estos selectores pueden necesitar ajuste cuando se hace clic en una cuenta
  get detailAccountId() {
    return $("//td[contains(text(), 'Account Number:')]/following-sibling::td");
  }

  get detailAccountType() {
    return $("//td[contains(text(), 'Account Type:')]/following-sibling::td");
  }

  get detailBalance() {
    return $("//td[contains(text(), 'Balance:')]/following-sibling::td");
  }

  get detailAvailable() {
    return $("//td[contains(text(), 'Available:')]/following-sibling::td");
  }

  async waitForAccountsTable() {
    // Primero verificar que estamos en la página correcta
    await this.detailsTitle.waitForExist({ timeout: 10000 });
    await expect(this.detailsTitle).toHaveTextContaining('Accounts Overview');
    
    // Esperar a que la tabla exista
    await this.accountsTable.waitForExist({ timeout: 10000 });
    await this.accountsTable.waitForDisplayed({ timeout: 10000 });
    
    // Esperar a que haya al menos una cuenta
    await browser.waitUntil(
      async () => (await this.accountRows.length) > 0,
      { timeout: 10000, timeoutMsg: 'No accounts found in table' }
    );
  }

  async selectAccount(accountId) {
    const accountEl = await this.getAccountLink(accountId);
    await accountEl.waitForExist({ timeout: 10000 });
    await accountEl.waitForClickable({ timeout: 10000 });
    await accountEl.click();
    
    // Esperar a que se cargue la página de detalles
    await browser.waitUntil(
      async () => {
        const url = await browser.getUrl();
        return url.includes('activity');
      },
      { timeout: 10000, timeoutMsg: 'Account details page did not load' }
    );
  }

  async getAccountDetails() {
    // En la página de detalles, los datos están en una tabla diferente
    return {
      title: await this.detailsTitle.getText(),
      accountId: await this.detailAccountId.getText(),
      accountType: await this.detailAccountType.getText(),
      balance: await this.detailBalance.getText(),
      available: await this.detailAvailable.getText(),
    };
  }

  // Método para obtener información de todas las cuentas - CORREGIDO
  async getAllAccountsInfo() {
    await this.waitForAccountsTable();
    const accounts = [];
    const rows = await this.accountRows;
    
    for (const row of rows) {
      const cells = await row.$$('td');
      if (cells.length >= 3) { // La tabla tiene 3 columnas: Account, Balance, Available Amount
        const accountId = (await cells[0].getText()).trim();
        const balance = (await cells[1].getText()).trim();
        const available = (await cells[2].getText()).trim();
        
        // Determinar el tipo de cuenta basado en el ID o balance (esto puede necesitar ajuste)
        let accountType = 'CHECKING'; // valor por defecto
        if (balance.includes('-')) {
          accountType = 'LOAN';
        } else if (parseFloat(balance.replace(/[^0-9.-]/g, '')) > 1000) {
          accountType = 'SAVINGS';
        }
        
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
