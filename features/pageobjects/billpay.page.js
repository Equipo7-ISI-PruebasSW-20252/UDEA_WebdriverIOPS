import Page from './page.js';

/**
 * Page Object para la funcionalidad Bill Pay de Parabank
 */
class BillPayPage extends Page {
    /**
     * Selectores de elementos del formulario Bill Pay
     */
    get payeeNameInput() { return $('input[name="payee.name"]'); }
    get addressInput() { return $('input[name="payee.address.street"]'); }
    get cityInput() { return $('input[name="payee.address.city"]'); }
    get stateInput() { return $('input[name="payee.address.state"]'); }
    get zipCodeInput() { return $('input[name="payee.address.zipCode"]'); }
    get phoneInput() { return $('input[name="payee.phoneNumber"]'); }
    get accountNumberInput() { return $('input[name="payee.accountNumber"]'); }
    get verifyAccountInput() { return $('input[name="verifyAccount"]'); }
    get amountInput() { return $('input[name="amount"]'); }
    get fromAccountSelect() { return $('select[name="fromAccountId"]'); }
    get sendPaymentButton() { return $('input[value="Send Payment"]'); }
    get successResultDiv() { return $('#billpayResult'); }
    get successMessage() { return $('#billpayResult h1.title'); }
    get successDetailsMessage() { return $('#billpayResult p'); }
    get accountMismatchError() { return $('#validationModel-verifyAccount-mismatch'); }

    /**
     * Llena todos los campos del formulario de beneficiario
     * @param {Object} payeeData - Objeto con datos del beneficiario
     */
    async fillPayeeInformation(payeeData) {
        const fieldMapping = {
            'Payee Name': this.payeeNameInput,
            'Address': this.addressInput,
            'City': this.cityInput,
            'State': this.stateInput,
            'Zip Code': this.zipCodeInput,
            'Phone': this.phoneInput,
            'Account': this.accountNumberInput,
            'Verify Account': this.verifyAccountInput,
            'Amount': this.amountInput
        };

        for (const [key, element] of Object.entries(fieldMapping)) {
            if (payeeData[key]) {
                await this.fillInput(element, payeeData[key]);
            }
        }
    }

    /**
     * Selecciona una cuenta de origen del dropdown
     * @param {number} index - Índice de la cuenta (por defecto 0 para la primera)
     */
    async selectFromAccount(index = 0) {
        await this.selectByIndex(this.fromAccountSelect, index);
    }

    /**
     * Hace clic en el botón de enviar pago
     */
    async submitPayment() {
        await this.clickButton(this.sendPaymentButton);
    }

    /**
     * Verifica si se muestra el mensaje de éxito
     * @returns {Promise<boolean>}
     */
    async isSuccessMessageDisplayed() {
        return await this.isElementDisplayed(this.successMessage, 5000);
    }

    /**
     * Verifica si se muestra el error de cuentas no coincidentes
     * @returns {Promise<boolean>}
     */
    async isAccountMismatchErrorDisplayed() {
        return await this.isElementDisplayed(this.accountMismatchError, 3000);
    }

    /**
     * Obtiene el texto del mensaje de éxito
     * @returns {Promise<string>}
     */
    async getSuccessMessageText() {
        return await this.getElementText(this.successMessage);
    }

    /**
     * Obtiene el texto del error de cuentas no coincidentes
     * @returns {Promise<string>}
     */
    async getAccountMismatchErrorText() {
        return await this.getElementText(this.accountMismatchError);
    }

    /**
     * Navega a la página de Bill Pay
     */
    async open() {
        await this.navigateToMenuOption('Bill Pay');
        await this.payeeNameInput.waitForDisplayed({ timeout: 10000 });
    }
}

export default new BillPayPage();
