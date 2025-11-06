import Page from "./page.js";

class CheckStatePage extends Page {

  get numberCheckingAccount() {
    return $("//a[normalize-space()='13011']")
  }

  async selectAccount(account) {
      await expect(this.numberCheckingAccount).toBeExisting();
      await this.numberCheckingAccount.waitForClickable();
      await this.numberCheckingAccount.click();
  }

  open () {
    return super.open('overview');
  } 
}

export default new CheckStatePage();
