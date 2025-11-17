import Page from './page.js';

/**
 * Page Object para la página de Solicitud de Préstamo
 */
class SimulacionPrestamoPage extends Page {
    // Selectores
    get inputLoanAmount() { return $("//*[@id='amount']"); }
    get inputDownPayment() { return $("//*[@id='downPayment']"); }
    get selectFromAccount() { return $("//*[@id='fromAccountId']"); }
    get btnSubmitLoan() { return $("//*[@id='requestLoanForm']/form/table/tbody/tr[4]/td[2]/input"); }
    get resultDiv() { return $("#requestLoanResult"); }
    get resultTitle() { return $("//*[@id='requestLoanResult']/h1"); }
    get loanProviderName() { return $("//*[@id='loanProviderName']"); }
    get responseDate() { return $("//*[@id='responseDate']"); }
    get loanStatus() { return $("//*[@id='loanStatus']"); }
    get newAccountId() { return $("//*[@id='newAccountId']"); }
    get loanRequestApproved() { return $("//*[@id='loanRequestApproved']"); }
    get loanRequestDenied() { return $("//*[@id='loanRequestDenied']"); }

    /**
     * Llena el formulario de solicitud de préstamo
     * @param {string} amount - Monto del préstamo
     * @param {string} downPayment - Monto del pago inicial
     * @param {string} accountId - ID de cuenta (opcional)
     */
    async fillLoanRequest(amount, downPayment, accountId = null) {
        console.log(`Llenando solicitud - Monto: ${amount}, Pago inicial: ${downPayment}`);
        
        await this.inputLoanAmount.waitForDisplayed({ timeout: 10000 });
        await this.fillInput(this.inputLoanAmount, amount);
        await this.fillInput(this.inputDownPayment, downPayment);
        
        if (accountId) {
            await this.selectFromAccount.selectByVisibleText(accountId);
        }
    }

    /**
     * Envía la solicitud de préstamo
     */
    async submitLoanRequest() {
        console.log('Enviando solicitud de préstamo...');
        await this.submitWithFallback(this.btnSubmitLoan);
        
        await browser.waitUntil(
            async () => {
                try {
                    const resultDiv = await this.resultDiv;
                    if (await resultDiv.isExisting()) {
                        return await resultDiv.isDisplayed();
                    }
                    const title = await this.resultTitle;
                    if (await title.isExisting()) {
                        return await title.isDisplayed();
                    }
                    return false;
                } catch (error) {
                    return false;
                }
            },
            { 
                timeout: 20000, 
                timeoutMsg: 'El resultado del préstamo no apareció después del envío.',
                interval: 500
            }
        );
        console.log('Resultado de préstamo apareció');
    }

    /**
     * Obtiene el resultado de la solicitud de préstamo
     * @returns {Promise<Object>}
     */
    async getLoanRequestResult() {
        try {
            await this.resultDiv.waitForDisplayed({ timeout: 5000 });
        } catch (error) {
            await this.resultTitle.waitForDisplayed({ timeout: 10000 });
        }
        
        return {
            title: await this.resultTitle.getText().catch(() => ''),
            providerName: await this.loanProviderName.getText().catch(() => 'N/A'),
            date: await this.responseDate.getText().catch(() => 'N/A'),
            status: await this.loanStatus.getText().catch(() => 'N/A'),
            isApproved: await this.loanRequestApproved.isDisplayed().catch(() => false),
            isDenied: await this.loanRequestDenied.isDisplayed().catch(() => false),
            newAccount: await this.loanRequestApproved.isDisplayed().catch(() => false) 
                ? await this.newAccountId.getText().catch(() => null) 
                : null
        };
    }

    /**
     * Verifica que el préstamo fue procesado
     * @returns {Promise<Object>}
     */
    async verifyLoanProcessed() {
        await this.resultDiv.waitForDisplayed({ timeout: 5000 }).catch(async () => {
            await this.resultTitle.waitForDisplayed({ timeout: 5000 });
        });
        
        const result = await this.getLoanRequestResult();
        console.log('Resultado de solicitud de préstamo:', result);
        
        if (result.title !== 'Loan Request Processed') {
            throw new Error(`Se esperaba título "Loan Request Processed" pero se obtuvo "${result.title}"`);
        }
        
        return result;
    }

    /**
     * Abre la página de solicitud de préstamo
     */
    async open() {
        console.log('Abriendo página de solicitud de préstamo...');
        
        try {
            await super.open('requestloan');
            await browser.pause(2000);
            
            const amountField = await this.inputLoanAmount;
            if (await amountField.isExisting()) {
                console.log('Página de solicitud de préstamo cargada exitosamente');
                return;
            }
        } catch (error) {
            console.log('Acceso directo a requestloan falló, intentando a través del menú...');
        }
        
        await super.open('index');
        await browser.pause(1000);
        
        const requestLoanLink = await $("//*[@id='leftPanel']/ul/li[7]/a");
        await this.clickButton(requestLoanLink);
        await browser.pause(2000);
        
        console.log('Navegado a página de préstamo vía menú');
    }
}

export default new SimulacionPrestamoPage();

