import Page from './page.js';

/**
 * Page Object para la funcionalidad Bill Pay de Parabank
 */
class BillPayPage extends Page {
    /**
     * Selectores de elementos del formulario Bill Pay
     */
    get payeeNameInput() {
        return $('input[name="payee.name"]');
    }

    get addressInput() {
        return $('input[name="payee.address.street"]');
    }

    get cityInput() {
        return $('input[name="payee.address.city"]');
    }

    get stateInput() {
        return $('input[name="payee.address.state"]');
    }

    get zipCodeInput() {
        return $('input[name="payee.address.zipCode"]');
    }

    get phoneInput() {
        return $('input[name="payee.phoneNumber"]');
    }

    get accountNumberInput() {
        return $('input[name="payee.accountNumber"]');
    }

    get verifyAccountInput() {
        return $('input[name="verifyAccount"]');
    }

    get amountInput() {
        return $('input[name="amount"]');
    }

    get fromAccountSelect() {
        return $('select[name="fromAccountId"]');
    }

    get sendPaymentButton() {
        return $('input[value="Send Payment"]');
    }

    get successResultDiv() {
    return $('#billpayResult');
    }
    
    get successMessage() {
        return $('#billpayResult h1.title');
    }

    get successDetailsMessage() {
        return $('#billpayResult p');
    }

    get accountMismatchError() {
        return $('#validationModel-verifyAccount-mismatch');
    }

    /**
     * Ingresa el nombre del beneficiario
     * @param {string} name - Nombre del beneficiario
     */
    async enterPayeeName(name) {
        await this.payeeNameInput.waitForDisplayed();
        await this.payeeNameInput.setValue(name);
    }

    /**
     * Ingresa la dirección del beneficiario
     * @param {string} address - Dirección
     */
    async enterAddress(address) {
        await this.addressInput.setValue(address);
    }

    /**
     * Ingresa la ciudad del beneficiario
     * @param {string} city - Ciudad
     */
    async enterCity(city) {
        await this.cityInput.setValue(city);
    }

    /**
     * Ingresa el estado del beneficiario
     * @param {string} state - Estado/Departamento
     */
    async enterState(state) {
        await this.stateInput.setValue(state);
    }

    /**
     * Ingresa el código postal del beneficiario
     * @param {string} zipCode - Código postal
     */
    async enterZipCode(zipCode) {
        await this.zipCodeInput.setValue(zipCode);
    }

    /**
     * Ingresa el teléfono del beneficiario
     * @param {string} phone - Número telefónico
     */
    async enterPhone(phone) {
        await this.phoneInput.setValue(phone);
    }

    /**
     * Ingresa el número de cuenta del beneficiario
     * @param {string} account - Número de cuenta
     */
    async enterAccountNumber(account) {
        await this.accountNumberInput.setValue(account);
    }

    /**
     * Ingresa la verificación del número de cuenta
     * @param {string} account - Número de cuenta para verificación
     */
    async enterVerifyAccount(account) {
        await this.verifyAccountInput.setValue(account);
    }

    /**
     * Ingresa el monto a pagar
     * @param {string} amount - Monto
     */
    async enterAmount(amount) {
        await this.amountInput.setValue(amount);
    }

    /**
     * Selecciona una cuenta de origen del dropdown
     * @param {number} index - Índice de la cuenta (por defecto 0 para la primera)
     */
    async selectFromAccount(index = 0) {
        await this.fromAccountSelect.waitForDisplayed();
        const options = await this.fromAccountSelect.$$('option');
        
        if (options.length > index) {
            await this.fromAccountSelect.selectByIndex(index);
        } else {
            throw new Error(`No hay cuenta disponible en el índice ${index}`);
        }
    }

    /**
     * Llena todos los campos del formulario de beneficiario
     * @param {Object} payeeData - Objeto con datos del beneficiario
     */
    async fillPayeeInformation(payeeData) {
        await this.enterPayeeName(payeeData['Payee Name']);
        await this.enterAddress(payeeData['Address']);
        await this.enterCity(payeeData['City']);
        await this.enterState(payeeData['State']);
        await this.enterZipCode(payeeData['Zip Code']);
        await this.enterPhone(payeeData['Phone']);
        await this.enterAccountNumber(payeeData['Account']);
        await this.enterVerifyAccount(payeeData['Verify Account']);
        await this.enterAmount(payeeData['Amount']);
    }

    /**
     * Hace clic en el botón de enviar pago
     */
    async submitPayment() {
        await this.sendPaymentButton.waitForClickable();
        await this.sendPaymentButton.click();
    }

    /**
     * Verifica si se muestra el mensaje de éxito
     * @returns {Promise<boolean>}
     */
    async isSuccessMessageDisplayed() {
        try {
            await this.successMessage.waitForDisplayed({ timeout: 5000 });
            return await this.successMessage.isDisplayed();
        } catch (error) {
            return false;
        }
    }

    /**
     * Verifica si se muestra el error de cuentas no coincidentes
     * @returns {Promise<boolean>}
     */
    async isAccountMismatchErrorDisplayed() {
        try {
            await this.accountMismatchError.waitForDisplayed({ timeout: 3000 });
            return await this.accountMismatchError.isDisplayed();
        } catch (error) {
            return false;
        }
    }

    /**
     * Obtiene el texto del mensaje de éxito
     * @returns {Promise<string>}
     */
    async getSuccessMessageText() {
        await this.successMessage.waitForDisplayed();
        return await this.successMessage.getText();
    }

    /**
     * Obtiene el texto del error de cuentas no coincidentes
     * @returns {Promise<string>}
     */
    async getAccountMismatchErrorText() {
        await this.accountMismatchError.waitForDisplayed();
        return await this.accountMismatchError.getText();
    }

    /**
     * Navega a la página de Bill Pay haciendo clic en el link del menú
     */
    async open() {
        // Opción 1: Hacer clic en el link del menú
        const billPayLink = await $('=Bill Pay');
        await billPayLink.waitForDisplayed({ timeout: 10000 });
        await billPayLink.click();
        
        // Esperar a que el formulario se cargue
        await this.payeeNameInput.waitForDisplayed({ timeout: 10000 });
    }
}

export default new BillPayPage();
