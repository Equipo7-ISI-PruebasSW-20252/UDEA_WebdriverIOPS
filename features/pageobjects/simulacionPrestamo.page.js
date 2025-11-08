import Page from './page.js';

/**
 * Page Object for Loan Request page
 */
class SimulacionPrestamoPage extends Page {
  /**
   * define selectors using getter methods
   */
  get inputLoanAmount() {
    return $("//*[@id='amount']");
  }

  get inputDownPayment() {
    return $("//*[@id='downPayment']");
  }

  get selectFromAccount() {
    return $("//*[@id='fromAccountId']");
  }

  get btnSubmitLoan() {
    return $("//*[@id='requestLoanForm']/form/table/tbody/tr[4]/td[2]/input");
  }

  get resultTitle() {
    return $("//h1[@class='title']");
  }

  get loanProviderName() {
    return $("//*[@id='loanProviderName']");
  }

  get responseDate() {
    return $("//*[@id='responseDate']");
  }

  get loanStatus() {
    return $("//*[@id='loanStatus']");
  }

  get newAccountId() {
    return $("//*[@id='newAccountId']");
  }

  get loanRequestApproved() {
    return $("//*[@id='loanRequestApproved']");
  }

  get loanRequestDenied() {
    return $("//*[@id='loanRequestDenied']");
  }

  /**
   * Method to fill loan request form
   * @param {string} amount - Loan amount
   * @param {string} downPayment - Down payment amount
   * @param {string} accountId - Optional account ID (if not provided, uses default)
   */
  async fillLoanRequest(amount, downPayment, accountId = null) {
    console.log(`Filling loan request - Amount: ${amount}, Down Payment: ${downPayment}`);
    
    // Wait for form to be visible
    await this.inputLoanAmount.waitForDisplayed({ timeout: 10000 });
    
    // Fill in loan amount
    await this.inputLoanAmount.setValue(amount);
    
    // Fill in down payment
    await this.inputDownPayment.setValue(downPayment);
    
    // Select account if provided
    if (accountId) {
      await this.selectFromAccount.selectByVisibleText(accountId);
    }
    // Otherwise, leave default selection
  }

  /**
   * Method to submit loan request
   */
  async submitLoanRequest() {
    console.log('Submitting loan request...');
    await this.btnSubmitLoan.waitForClickable({ timeout: 10000 });
    await this.btnSubmitLoan.click();
    
    // Wait for result to appear
    await browser.pause(2000);
    await this.resultTitle.waitForDisplayed({ timeout: 15000 });
  }

  /**
   * Method to get loan request result
   * @returns {Object} Object containing loan request result details
   */
  async getLoanRequestResult() {
    await this.resultTitle.waitForDisplayed({ timeout: 15000 });
    
    const title = await this.resultTitle.getText();
    const providerName = await this.loanProviderName.getText().catch(() => 'N/A');
    const date = await this.responseDate.getText().catch(() => 'N/A');
    const status = await this.loanStatus.getText().catch(() => 'N/A');
    
    // Check if approved or denied
    const isApproved = await this.loanRequestApproved.isDisplayed().catch(() => false);
    const isDenied = await this.loanRequestDenied.isDisplayed().catch(() => false);
    
    let newAccount = null;
    if (isApproved) {
      newAccount = await this.newAccountId.getText().catch(() => null);
    }
    
    return {
      title,
      providerName,
      date,
      status,
      isApproved,
      isDenied,
      newAccount
    };
  }

  /**
   * Method to verify loan was processed
   */
  async verifyLoanProcessed() {
    const result = await this.getLoanRequestResult();
    console.log('Loan request result:', result);
    
    if (result.title !== 'Loan Request Processed') {
      throw new Error(`Expected title "Loan Request Processed" but got "${result.title}"`);
    }
    
    return result;
  }

  /**
   * overwrite specific options to adapt it to page object
   */
  open() {
    return super.open('requestloan');
  }
}

export default new SimulacionPrestamoPage();

