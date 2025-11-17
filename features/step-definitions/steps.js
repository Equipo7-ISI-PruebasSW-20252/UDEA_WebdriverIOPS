import { Given, When, Then } from "@wdio/cucumber-framework";
import LoginPage from '../pageobjects/login.page.js';
import CheckStatePage from '../pageobjects/checkState.page.js';
import SimulacionPrestamoPage from '../pageobjects/simulacionPrestamo.page.js';

/**
 * Mapeo de páginas disponibles
 */
const pages = {
    login: LoginPage,
    checkState: CheckStatePage,
    loanRequest: SimulacionPrestamoPage,
};

/**
 * Variable para almacenar balances grabados entre steps
 */
let recordedBalance = null;

// ==================== NAVEGACIÓN ====================

/**
 * Navega a una página específica
 */
Given(/^I am on the (\w+) page$/, async (page) => {
    await pages[page].open();
});

/**
 * Realiza login con credenciales y navega a la página inicial
 */
Given(/^I am logged in with (\w+) and (.*)$/, async (username, password) => {
    try {
        const currentUrl = await browser.getUrl();
        
        // Si ya estamos autenticados, solo navegar a CheckState
        if (!currentUrl.includes('login') && !currentUrl.includes('index')) {
            await CheckStatePage.open();
            return;
        }
    } catch (error) {
        console.log('Verificación de sesión falló, procediendo con login...');
    }
    
    await LoginPage.open();
    await LoginPage.login(username, password);
});

// ==================== LOGIN ====================

/**
 * Realiza el proceso de login
 */
When(/^I login with (\w+) and (.*)$/, async (username, password) => {
    await LoginPage.login(username, password);
});

/**
 * Verifica mensaje después del login (exitoso o fallido)
 */
Then(/^I should see a text saying (.*)$/, async (expectedMessage) => {
    const titleElement = await $('.title');
    
    await expect(titleElement).toBeExisting();
    await expect(titleElement).toHaveTextContaining(expectedMessage);
});

// ==================== CHECK ACCOUNT STATE ====================

/**
 * Verifica que la lista de cuentas esté visible
 */
Then(/^I should see the accounts list displayed$/, async () => {
    await CheckStatePage.waitForAccountsTable();
    const accountRows = await CheckStatePage.accountRows;
    
    await expect(accountRows.length).toBeGreaterThan(0);
});

/**
 * Verifica cantidad mínima de cuentas
 */
Then(/^the accounts list should contain at least (\d+) account$/, async (minCount) => {
    const accountRows = await CheckStatePage.accountRows;
    
    await expect(accountRows.length).toBeGreaterThanOrEqual(parseInt(minCount, 10));
});

/**
 * Hace clic en una cuenta específica
 */
When(/^I click on account "([^"]+)"$/, async (accountId) => {
    await CheckStatePage.selectAccount(accountId);
});

/**
 * Verifica los detalles de la cuenta seleccionada
 */
Then(/^I should see the details panel showing account id "([^"]+)", type "([^"]+)" and balance "([^"]+)"$/, 
    async (accountId, accountType, expectedBalance) => {
        const details = await CheckStatePage.getAccountDetails();
        
        console.log('Detalles de cuenta:', details);
        
        // Verificar ID de cuenta
        await expect(details.accountId).toContain(accountId);
        
        // Verificar tipo de cuenta (si no es el default)
        if (accountType !== 'CHECKING') {
            await expect(details.accountType.toLowerCase()).toContain(accountType.toLowerCase());
        }
        
        // Verificar balance (normalizar y comparar valores numéricos)
        const normalizeAmount = (text) => text.replace(/[^0-9.-]+/g, '');
        const actualBalance = parseFloat(normalizeAmount(details.balance));
        const expectedBalanceNum = parseFloat(normalizeAmount(expectedBalance));
        
        await expect(actualBalance).toBeCloseTo(expectedBalanceNum, 2);
    }
);

/**
 * Graba el balance actual para comparaciones posteriores
 */
When(/^I record the balance shown as "([^"]+)"$/, async (alias) => {
    const details = await CheckStatePage.getAccountDetails();
    recordedBalance = details.balance;
    
    console.log(`Balance grabado para ${alias}: ${recordedBalance}`);
});

/**
 * Compara el balance actual con el grabado previamente
 */
Then(/^the previously recorded balance "([^"]+)" should not equal the current balance$/, async (alias) => {
    if (!recordedBalance) {
        throw new Error(`No se grabó ningún balance para ${alias}`);
    }
    
    const details = await CheckStatePage.getAccountDetails();
    
    console.log(`Comparando - Grabado: ${recordedBalance}, Actual: ${details.balance}`);
    await expect(details.balance).not.toEqual(recordedBalance);
});

/**
 * Resetea el balance grabado (útil para limpiar estado entre escenarios)
 */
When(/^I reset the recorded balance$/, async () => {
    recordedBalance = null;
    console.log('Balance grabado reseteado');
});

/**
 * Imprime todas las cuentas disponibles (debugging)
 */
Then(/^I print all available accounts$/, async () => {
    try {
        const accounts = await CheckStatePage.getAllAccountsInfo();
        
        console.log('=== CUENTAS DISPONIBLES ===');
        
        if (accounts.length === 0) {
            console.log('¡NO SE ENCONTRARON CUENTAS!');
        } else {
            accounts.forEach((account, index) => {
                console.log(
                    `${index + 1}. ID: ${account.accountId}, ` +
                    `Tipo: ${account.accountType}, ` +
                    `Balance: ${account.balance}`
                );
            });
        }
        
        console.log('===========================');
    } catch (error) {
        console.log('ERROR al imprimir cuentas:', error.message);
        await _debugPageState();
    }
});

/**
 * Función helper para debugging de estado de página
 * @private
 */
async function _debugPageState() {
    const currentUrl = await browser.getUrl();
    const pageTitle = await CheckStatePage.pageTitle.getText().catch(() => 'Sin título');
    const tableExists = await CheckStatePage.accountsTable.isExisting().catch(() => false);
    
    console.log(`URL actual: ${currentUrl}`);
    console.log(`Título de página: "${pageTitle}"`);
    console.log(`Tabla existe: ${tableExists}`);
}

// ==================== LOAN REQUEST ====================

/**
 * Llena el campo de monto del préstamo
 */
When(/^I fill in loan amount with "([^"]+)"$/, async (amount) => {
    const inputElement = SimulacionPrestamoPage.inputLoanAmount;
    
    await inputElement.waitForExist({ timeout: 10000 });
    await inputElement.waitForDisplayed({ timeout: 10000 });
    await inputElement.setValue(amount);
});

/**
 * Llena el campo de pago inicial
 */
When(/^I fill in down payment with "([^"]+)"$/, async (downPayment) => {
    const inputElement = SimulacionPrestamoPage.inputDownPayment;
    
    await inputElement.waitForDisplayed({ timeout: 10000 });
    await inputElement.setValue(downPayment);
});

/**
 * Envía la solicitud de préstamo
 */
When(/^I submit the loan request$/, async () => {
    await SimulacionPrestamoPage.submitLoanRequest();
});

/**
 * Verifica que la solicitud fue procesada exitosamente
 */
Then(/^I should see loan request processed$/, async () => {
    const result = await SimulacionPrestamoPage.verifyLoanProcessed();
    
    await expect(result.title).toBe('Loan Request Processed');
});
