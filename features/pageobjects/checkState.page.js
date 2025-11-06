import Page from "./page.js";

class CheckStatePage extends Page {
  // selector para la tabla de cuentas
  get accountsTable() {
    return $("table#accountTable");
  }

  // selector para filas de la tabla
  get accountRows() {
    return $$("table#accountTable tbody tr");
  }

  // título de la página
  get pageTitle() {
    return $("h1.title");
  }

  // Método mejorado para wait - MÁS FLEXIBLE
  async waitForAccountsTable() {
    console.log('Waiting for accounts page to load...');
    
    // Esperar a que la página cargue completamente
    await this.pageTitle.waitForExist({ timeout: 15000 });
    const titleText = await this.pageTitle.getText();
    console.log(`Page title: "${titleText}"`);
    
    // Si hay error, lanzar excepción
    if (titleText === "Error!") {
      // Debug: ver qué hay en la página
      const errorDetails = await $('body').getText().catch(() => 'No error details');
      console.log('Error page content:', errorDetails.substring(0, 300));
      throw new Error(`Application error: ${titleText}. Check if overview page is accessible.`);
    }
    
    // Esperar a que la tabla exista (ser más flexible con el selector)
    try {
      await this.accountsTable.waitForExist({ timeout: 10000 });
      await this.accountsTable.waitForDisplayed({ timeout: 10000 });
      console.log('Accounts table found');
    } catch (error) {
      console.log('Accounts table not found with #accountTable, trying alternative selectors...');
      
      // Intentar selectores alternativos
      const alternativeTable = await $('table').catch(() => null);
      if (alternativeTable && await alternativeTable.isDisplayed()) {
        console.log('Found alternative table');
      } else {
        throw new Error('No accounts table found on page');
      }
    }
    
    // Esperar a que haya filas en la tabla
    await browser.waitUntil(
      async () => {
        const rows = await this.accountRows;
        return rows.length > 0;
      },
      { 
        timeout: 10000, 
        timeoutMsg: 'No account rows found in table' 
      }
    );
    
    console.log('Accounts list is displayed successfully');
  }

  // Método para obtener información de cuentas - SIMPLIFICADO
  async getAllAccountsInfo() {
    await this.waitForAccountsTable();
    const rows = await this.accountRows;
    const accounts = [];
    
    console.log(`Processing ${rows.length} account rows...`);
    
    for (let i = 0; i < rows.length; i++) {
      try {
        const cells = await rows[i].$$('td');
        if (cells.length >= 2) { // Al menos Account y Balance
          const accountId = (await cells[0].getText()).trim();
          const balance = cells[1] ? (await cells[1].getText()).trim() : 'N/A';
          const available = cells[2] ? (await cells[2].getText()).trim() : balance;
          
          accounts.push({ 
            accountId, 
            accountType: 'CHECKING', // Por defecto
            balance, 
            available 
          });
        }
      } catch (error) {
        console.log(`Error processing row ${i + 1}:`, error.message);
      }
    }
    
    return accounts;
  }

  // OVERRIDE del método open - MÁS ROBUSTO
  async open() {
    console.log('Opening accounts overview page...');
    
    // Intentar navegar directamente a overview
    try {
      await super.open('overview');
      await browser.pause(2000); // Esperar a que cargue
      
      // Verificar si hay error
      const title = await this.pageTitle.getText().catch(() => '');
      if (title === "Error!") {
        console.log('Direct overview access failed, trying through main page...');
        
        // Alternativa: ir a la página principal primero
        await super.open('index');
        await browser.pause(1000);
        
        // Desde la página principal, navegar a overview
        const overviewLink = await $('=Accounts Overview').catch(() => $('a*=Overview'));
        if (overviewLink) {
          await overviewLink.click();
          await browser.pause(2000);
        }
      }
    } catch (error) {
      console.log('Error opening overview page:', error.message);
      throw error;
    }
  }

  // Método alternativo para abrir la página
  async openViaMainPage() {
    await super.open('index');
    await browser.pause(1000);
    
    // Hacer clic en el enlace de Accounts Overview
    const overviewLink = await $('=Accounts Overview').catch(() => null);
    if (overviewLink) {
      await overviewLink.click();
      await browser.pause(2000);
    } else {
      throw new Error('Could not find Accounts Overview link');
    }
  }
}

export default new CheckStatePage();
