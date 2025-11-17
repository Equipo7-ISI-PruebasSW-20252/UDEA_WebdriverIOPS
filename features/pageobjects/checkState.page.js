import Page from "./page.js";

class CheckStatePage extends Page {
    // Selectores
    get accountsTable() { return $("table#accountTable"); }
    get accountRows() { return $$("table#accountTable tbody tr"); }
    get pageTitle() { return $("h1.title"); }
    get detailsTitle() { return $("h1.title"); }
    get detailAccountId() { return $("//td[contains(text(), 'Account Number:')]/following-sibling::td"); }
    get detailAccountType() { return $("//td[contains(text(), 'Account Type:')]/following-sibling::td"); }
    get detailBalance() { return $("//td[contains(text(), 'Balance:')]/following-sibling::td"); }
    get detailAvailable() { return $("//td[contains(text(), 'Available:')]/following-sibling::td"); }

    accountLink(accountId) {
        return $(`//a[normalize-space()="${accountId}"]`);
    }

    /**
     * Espera a que la tabla de cuentas esté lista
     */
    async waitForAccountsTable() {
        console.log('Esperando que cargue la página de cuentas...');
        
        await this.pageTitle.waitForExist({ timeout: 15000 });
        const titleText = await this.pageTitle.getText();
        console.log(`Título de página: "${titleText}"`);
        
        if (titleText === "Error!") {
            const errorDetails = await $('body').getText().catch(() => 'Sin detalles de error');
            console.log('Contenido de página de error:', errorDetails.substring(0, 300));
            throw new Error(`Error de aplicación: ${titleText}. Verificar acceso a página de overview.`);
        }
        
        await this.accountsTable.waitForExist({ timeout: 10000 });
        await this.accountsTable.waitForDisplayed({ timeout: 10000 });
        
        await browser.waitUntil(
            async () => (await this.accountRows).length > 0,
            { 
                timeout: 10000, 
                timeoutMsg: 'No se encontraron filas de cuentas en la tabla' 
            }
        );
        
        console.log('Lista de cuentas mostrada exitosamente');
    }

    /**
     * Selecciona una cuenta por ID
     * @param {string} accountId - ID de la cuenta
     */
    async selectAccount(accountId) {
        console.log(`Seleccionando cuenta: ${accountId}`);
        
        try {
            const accountEl = this.accountLink(accountId);
            await accountEl.waitForExist({ timeout: 5000 });
            await this.clickButton(accountEl);
            console.log(`Click en enlace de cuenta ${accountId}`);
        } catch (error) {
            console.log(`Enlace de cuenta no encontrado para ${accountId}, probando método alternativo...`);
            await this._selectAccountAlternative(accountId);
        }
        
        await browser.pause(3000);
        await this.detailsTitle.waitForExist({ timeout: 10000 });
        await this.detailsTitle.waitForDisplayed({ timeout: 10000 });
        
        console.log('Selección de cuenta completada');
    }

    /**
     * Método alternativo para seleccionar cuenta (busca en celdas)
     * @private
     */
    async _selectAccountAlternative(accountId) {
        const rows = await this.accountRows;
        for (const row of rows) {
            const firstCell = await row.$('td:first-child');
            if (firstCell) {
                const cellText = await firstCell.getText();
                if (cellText.trim() === accountId) {
                    await firstCell.click();
                    console.log(`Click en celda de cuenta ${accountId}`);
                    break;
                }
            }
        }
    }

    /**
     * Obtiene información de todas las cuentas
     * @returns {Promise<Array>}
     */
    async getAllAccountsInfo() {
        await this.waitForAccountsTable();
        const rows = await this.accountRows;
        const accounts = [];
        
        console.log(`Procesando ${rows.length} filas de cuentas...`);
        
        for (let i = 0; i < rows.length; i++) {
            try {
                const cells = await rows[i].$$('td');
                if (cells.length >= 2) {
                    accounts.push({ 
                        accountId: (await cells[0].getText()).trim(),
                        accountType: 'CHECKING',
                        balance: cells[1] ? (await cells[1].getText()).trim() : 'N/A',
                        available: cells[2] ? (await cells[2].getText()).trim() : (await cells[1].getText()).trim()
                    });
                }
            } catch (error) {
                console.log(`Error procesando fila ${i + 1}:`, error.message);
            }
        }
        
        return accounts;
    }

    /**
     * Obtiene detalles de cuenta seleccionada
     * @returns {Promise<Object>}
     */
    async getAccountDetails() {
        return {
            title: await this.getElementText(this.detailsTitle),
            accountId: await this.getElementText(this.detailAccountId),
            accountType: await this.getElementText(this.detailAccountType),
            balance: await this.getElementText(this.detailBalance),
            available: await this.getElementText(this.detailAvailable)
        };
    }
    
    /**
     * Abre la página de overview de cuentas
     */
    async open() {
        console.log('Abriendo página de overview de cuentas...');
        
        try {
            await super.open('overview');
            await browser.pause(2000);
            
            const title = await this.pageTitle.getText().catch(() => '');
            if (title === "Error!") {
                console.log('Acceso directo a overview falló, intentando desde página principal...');
                await this.openViaMainPage();
            }
        } catch (error) {
            console.log('Error abriendo página de overview:', error.message);
            throw error;
        }
    }

    /**
     * Método alternativo para abrir vía página principal
     */
    async openViaMainPage() {
        await super.open('index');
        await browser.pause(1000);
        await this.navigateToMenuOption('Accounts Overview');
    }
}

export default new CheckStatePage();
