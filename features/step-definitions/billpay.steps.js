import { Given, When, Then } from "@wdio/cucumber-framework";
import BillPayPage from '../pageobjects/billPay.page.js';
import LoginPage from '../pageobjects/login.page.js';

/**
 * Credenciales por defecto para autenticación
 */
const DEFAULT_CREDENTIALS = {
    username: 'john',
    password: 'demo'
};

// ==================== BACKGROUND / SETUP ====================

/**
 * Autentica al usuario en Parabank
 */
Given(/^el usuario está autenticado en Parabank$/, async function() {
    await LoginPage.open();
    await LoginPage.login(DEFAULT_CREDENTIALS.username, DEFAULT_CREDENTIALS.password);
    
    // Verificación simplificada - una sola comprobación con texto
    await expect($('.title')).toHaveTextContaining('Accounts Overview');
});

/**
 * Navega a la página de Bill Pay
 */
Given(/^el usuario navega a la página de Bill Pay$/, async function() {
    await BillPayPage.open();
});

// ==================== ACTIONS ====================

/**
 * Llena el formulario con datos del beneficiario
 */
When(/^el usuario ingresa los siguientes datos del beneficiario:$/, async function(dataTable) {
    await BillPayPage.fillPayeeInformation(dataTable.rowsHash());
});

/**
 * Selecciona una cuenta de origen para el pago
 */
When(/^el usuario selecciona una cuenta de origen$/, async function() {
    await BillPayPage.selectFromAccount(0);
});

/**
 * Confirma el envío del pago
 */
When(/^el usuario confirma el pago$/, async function() {
    await BillPayPage.submitPayment();
});

// ==================== ASSERTIONS ====================

/**
 * Verifica que se muestre el mensaje de pago exitoso
 */
Then(/^se debe mostrar el mensaje de pago exitoso$/, async function() {
    await BillPayPage.successMessage.waitForDisplayed({ timeout: 10000 });
    
    // Una sola verificación del contenido (ya implica que está displayed)
    await expect(BillPayPage.successMessage).toHaveTextContaining('Bill Payment Complete');
});

/**
 * Verifica que se muestre el error de cuentas no coincidentes
 */
Then(/^se debe mostrar el error de cuentas no coinciden$/, async function() {
    await BillPayPage.accountMismatchError.waitForDisplayed({ timeout: 5000 });
    
    // Una sola verificación - si está displayed y tiene texto, existe
    const errorText = await BillPayPage.getAccountMismatchErrorText();
    await expect(errorText.length).toBeGreaterThan(0);
});
