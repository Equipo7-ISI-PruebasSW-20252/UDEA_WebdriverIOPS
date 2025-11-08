const { Given, When, Then } = require('@cucumber/cucumber');
const { expect } = require('chai');
const BillPayPage = require('./pageobjects/BillPay.page');

/**
 * Step Definitions para la funcionalidad Bill Pay
 */

Given('el usuario está autenticado en Parabank', async function() {
    // Este step debe estar implementado en login.steps.js
    // Reutilizamos la autenticación existente del proyecto
    // Si no existe, aquí hay una implementación básica:
    
    // Asumiendo que existe un LoginPage en el proyecto:
    // await LoginPage.open();
    // await LoginPage.login('username', 'password');
    
    // O si necesitas implementarlo aquí temporalmente:
    await browser.url('/parabank/index.htm');
    const usernameInput = await $('input[name="username"]');
    const passwordInput = await $('input[name="password"]');
    const loginButton = await $('input[value="Log In"]');
    
    await usernameInput.setValue('john');
    await passwordInput.setValue('demo');
    await loginButton.click();
    
    // Verificar que el login fue exitoso
    const welcomeMessage = await $('.smallText');
    await welcomeMessage.waitForDisplayed();
});

Given('el usuario navega a la página de Bill Pay', async function() {
    await BillPayPage.navigateToBillPay();
    // Pequeña pausa para asegurar carga completa
    await browser.pause(500);
});

When('el usuario ingresa los siguientes datos del beneficiario:', async function(dataTable) {
    // Convertir la tabla de Gherkin en un objeto usando rowsHash()
    const payeeData = dataTable.rowsHash();
    
    // Llenar el formulario con los datos del beneficiario
    await BillPayPage.fillPayeeInformation(payeeData);
});

When('el usuario selecciona una cuenta de origen', async function() {
    // Seleccionar la primera cuenta disponible (índice 0)
    await BillPayPage.selectFromAccount(0);
});

When('el usuario confirma el pago', async function() {
    await BillPayPage.submitPayment();
});

Then('se debe mostrar el mensaje de pago exitoso', async function() {
    const isDisplayed = await BillPayPage.isSuccessMessageDisplayed();
    expect(isDisplayed).to.be.true;
    
    const messageText = await BillPayPage.getSuccessMessageText();
    expect(messageText).to.include('Bill Payment Complete');
});

Then('se debe mostrar el error de cuentas no coinciden', async function() {
    const isDisplayed = await BillPayPage.isAccountMismatchErrorDisplayed();
    expect(isDisplayed).to.be.true;
    
    const errorText = await BillPayPage.getAccountMismatchErrorText();
    expect(errorText).to.not.be.empty;
});
