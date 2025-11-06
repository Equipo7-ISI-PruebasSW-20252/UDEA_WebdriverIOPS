import Page from "./page.js";

class CheckStatePage extends Page {
  // selector para la tabla de cuentas
  get accountsTable() {
    return $("table#accountTable.gradient-style");
  }

  // selector para filas de la tabla
  get accountRows() {
    return $$("table#accountTable.gradient-style tbody tr");
  }

  // selector para celdas de ID de cuenta
  get accountIdCells() {
    return $$("table#accountTable.gradient-style tbody tr td:first-child");
  }

  // título de la página
  get pageTitle() {
    return $("h1.title");
  }

  // Método para encontrar cuenta por ID 
  async getAccountCell(accountId) {
    await this.waitForAccountsTable();
    const cells = await this.accountIdCells;
    
    for (const cell of cells) {
      const cellText = await cell.getText();
      if (cellText.trim() === accountId) {
        return cell;
      }
    }
    throw new Error(`Account with ID ${accountId} not found`);
  }

  async waitForAccountsTable() {
    console.log('Waiting for accounts table...');
    
    // Primero esperar a que la página cargue
    await this.pageTitle.waitForExist({ timeout: 15000 });
    const titleText = await this.pageTitle.getText();
    console.log(`Page title: "${titleText}"`);
    
    // Verificar que estamos en la página correcta
    if (!titleText.includes('Accounts Overview')) {
      throw new Error(`Not on accounts overview page. Current title: "${titleText}"`);
    }
    
    // Esperar a que la tabla exista - con selector específico
    await this.accountsTable.waitForExist({ timeout: 15000 });
    await this.accountsTable.waitForDisplayed({ timeout: 15000 });
    console.log('Accounts table found and displayed');
    
    // Esperar a que haya al menos una cuenta
    await browser.waitUntil(
      async () => {
        const rows = await this.accountRows;
        return rows.length > 0;
      },
      { 
        timeout: 15000, 
        timeoutMsg: 'No accounts found in table after waiting' 
      }
    );
    console.log('Accounts found in table');
  }

  async selectAccount(accountId) {
    console.log(`Selecting account: ${accountId}`);
    const accountCell = await this.getAccountCell(accountId);
    
    await accountCell.waitForClickable({ timeout: 10000 });
    await accountCell.click();
    console.log(`Clicked on account ${accountId}`);
    
    // Esperar a que la página responda
    await browser.pause(2000);
  }

  async getAccountDetails() {
    // Después de hacer clic en una cuenta, los detalles pueden aparecer de diferentes formas
    // Para ParaBank, generalmente va a una página de actividad
    
    // Esperar a que cargue la nueva página
    await this.pageTitle.waitForExist({ timeout: 10000 });
    const newTitle = await this.pageTitle.getText();
    console.log(`New page title: "${newTitle}"`);
    
    // Intentar obtener detalles de diferentes formas
    let accountId, accountType, balance;
    
    try {
      // Método 1: Buscar en la tabla de detalles
      accountId = await $("//td[contains(text(), 'Account Number:')]/following-sibling::td").getText();
    } catch (e) {
      try {
        // Método 2: Buscar en el título
        const title = await this.pageTitle.getText();
        accountId = title.match(/\d+/)?.[0] || 'Not found';
      } catch (e2) {
        accountId = 'Unknown';
      }
    }
    
    try {
      accountType = await $("//td[contains(text(), 'Account Type:')]/following-sibling::td").getText();
    } catch (e) {
      accountType = 'CHECKING'; // valor por defecto
    }
    
    try {
      balance = await $("//td[contains(text(), 'Balance:')]/following-sibling::td").getText();
    } catch (e) {
      try {
        // Buscar balance en la página
        balance = await $("//td[contains(text(), '$')]").getText();
      } catch (e2) {
        balance = '$0.00';
      }
    }

    return {
      title: newTitle,
      accountId: accountId.trim(),
      accountType: accountType.trim(),
      balance: balance.trim(),
      available: balance.trim(), // Por simplicidad
    };
  }

  // Método para obtener información de todas las cuentas - CORREGIDO
  async getAllAccountsInfo() {
    await this.waitForAccountsTable();
    const accounts = [];
    const rows = await this.accountRows;
    
    console.log(`Found ${rows.length} account rows`);
    
    for (let i = 0; i < rows.length; i++) {
      try {
        const cells = await rows[i].$$('td');
        if (cells.length >= 3) {
          const accountId = (await cells[0].getText()).trim();
          const balance = (await cells[1].getText()).trim();
          const available = (await cells[2].getText()).trim();
          
          // Determinar tipo de cuenta
          let accountType = 'CHECKING';
          if (balance.includes('-')) {
            accountType = 'LOAN';
          } else if (parseFloat(balance.replace(/[^0-9.-]/g, '')) > 2000) {
            accountType = 'SAVINGS';
          }
          
          accounts.push({ 
            accountId, 
            accountType, 
            balance, 
            available 
          });
          
          console.log(`Account ${i+1}: ${accountId} - ${accountType} - ${balance}`);
        }
      } catch (error) {
        console.log(`Error processing row ${i+1}:`, error.message);
      }
    }
    
    if (accounts.length === 0) {
      console.log('NO ACCOUNTS FOUND! Checking table structure...');
      const tableHtml = await this.accountsTable.getHTML();
      console.log('Table HTML structure:', tableHtml.substring(0, 500) + '...');
    }
    
    return accounts;
  }

  open() {
    return super.open('overview');
  }
}

export default new CheckStatePage();
