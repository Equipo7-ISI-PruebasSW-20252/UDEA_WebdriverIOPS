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
    // Try the xpath provided by user first, fallback to other selectors if needed
    return $("//*[@id='requestLoanForm']/form/table/tbody/tr[4]/td[2]/input");
  }

  get resultDiv() {
    return $("#requestLoanResult");
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
    
    // Wait for button to exist and be clickable
    await this.btnSubmitLoan.waitForExist({ timeout: 10000 });
    await this.btnSubmitLoan.waitForDisplayed({ timeout: 10000 });
    
    // Scroll to button to ensure it's visible
    await this.btnSubmitLoan.scrollIntoView();
    await browser.pause(500);
    
    // Try regular click first, if it fails, use JavaScript click
    try {
      await this.btnSubmitLoan.waitForClickable({ timeout: 5000 });
      await this.btnSubmitLoan.click();
      console.log('Loan request button clicked (regular click)');
    } catch (error) {
      console.log('Regular click failed, trying JavaScript click...');
      await browser.execute((element) => {
        element.click();
      }, await this.btnSubmitLoan);
      console.log('Loan request button clicked (JavaScript click)');
    }
    
    // Wait for page to process - wait for result div or title
    await browser.waitUntil(
      async () => {
        try {
          // Check if result div exists and is displayed
          const resultDiv = await this.resultDiv;
          if (await resultDiv.isExisting()) {
            return await resultDiv.isDisplayed();
          }
          // Or check if title exists
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
        timeoutMsg: 'Loan result did not appear after submission. Check if form was submitted correctly.',
        interval: 500
      }
    );
    console.log('Loan result appeared');
  }

  /**
   * Method to get loan request result
   * @returns {Object} Object containing loan request result details
   */
  async getLoanRequestResult() {
    // Wait for either result div or title
    try {
      await this.resultDiv.waitForDisplayed({ timeout: 5000 });
    } catch (error) {
      await this.resultTitle.waitForDisplayed({ timeout: 10000 });
    }
    
    const title = await this.resultTitle.getText().catch(() => '');
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
    // Wait for result to be displayed
    await this.resultDiv.waitForDisplayed({ timeout: 5000 }).catch(async () => {
      // If result div not found, wait for title
      await this.resultTitle.waitForDisplayed({ timeout: 5000 });
    });
    
    const result = await this.getLoanRequestResult();
    console.log('Loan request result:', result);
    
    // Verify title
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

