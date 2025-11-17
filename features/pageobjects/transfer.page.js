// features/pageobjects/transfer.page.js
import Page from './page.js';

class TransferPage extends Page {

    get amountField() {
        return $("#amount");
    }

    get fromAccountSelect() {
        return $("#fromAccountId");
    }

    get toAccountSelect() {
        return $("#toAccountId");
    }

    get confirmTransferButton() {
        return $("//input[@value='Transfer']");
    }

    async transfer(amount, fromAccount, toAccount) {
        await this.amountField.waitForDisplayed();
        await this.amountField.setValue(amount);

        await this.fromAccountSelect.waitForEnabled();
        await this.fromAccountSelect.selectByAttribute("value", fromAccount);

        await this.toAccountSelect.waitForEnabled();
        await this.toAccountSelect.selectByAttribute("value", toAccount);

        await this.confirmTransferButton.waitForClickable();
        await this.confirmTransferButton.click();
    }

    open() {
        return super.open('transfer');
    }
}

export default new TransferPage();
