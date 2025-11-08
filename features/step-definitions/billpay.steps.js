import { Given, When, Then } from "@wdio/cucumber-framework";
import BillPayPage from '../pageobjects/billPay.page.js';
import LoginPage from '../pageobjects/login.page.js';

/**
 * Step Definitions para la funcionalidad Bill Pay
 */

Given(/^el usuario está autenticado en Parabank$/, async function() {
    // Reutilizar el login existente del proyecto
    await LoginPage.open();
    await LoginPage.login('john', 'demo');
    
    // Verificar que el login fue exitoso esperando el título
    await expect($('.title')).toBeExisting();
    await expect($('.title')).toHaveTextContaining('Accounts Overview');
});

Given(/^el usuario navega a la página de Bill Pay$/, async function() {
    await BillPayPage.open();
});

When(/^el usuario ingresa los siguientes datos del beneficiario:$/, async function(dataTable) {
    // Convertir la tabla de Gherkin en un objeto usando rowsHash()
    const payeeData = dataTable.rowsHash();
    
    // Llenar el formulario con los datos del beneficiario
    await BillPayPage.fillPayeeInformation(payeeData);
});

When(/^el usuario selecciona una cuenta de origen$/, async function() {
    // Seleccionar la primera cuenta disponible (índice 0)
    await BillPayPage.selectFromAccount(0);
});

When(/^el usuario confirma el pago$/, async function() {
    await BillPayPage.submitPayment();
});

Then(/^se debe mostrar el mensaje de pago exitoso$/, async function() {
    // Esperar a que aparezca el mensaje de éxito
    await BillPayPage.successMessage.waitForDisplayed({ timeout: 10000 });
    
    const isDisplayed = await BillPayPage.isSuccessMessageDisplayed();
    await expect(isDisplayed).toBe(true);
    
    const messageText = await BillPayPage.getSuccessMessageText();
    await expect(messageText).toContain('Bill Payment Complete');
});

Then(/^se debe mostrar el error de cuentas no coinciden$/, async function() {
    // Esperar a que aparezca el mensaje de error
    await BillPayPage.accountMismatchError.waitForDisplayed({ timeout: 5000 });
    
    const isDisplayed = await BillPayPage.isAccountMismatchErrorDisplayed();
    await expect(isDisplayed).toBe(true);
    
    const errorText = await BillPayPage.getAccountMismatchErrorText();
    await expect(errorText.length).toBeGreaterThan(0);
});
