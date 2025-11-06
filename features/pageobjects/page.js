/**
 * main page object containing all methods, selectors and functionality
 * that is shared across all page objects
 */
import { config } from "../../wdio.conf.js";
export default class Page {
  /**
   * Opens a sub page of the page
   * @param path path of the sub page (e.g. /path/to/page.html)
   */
  open(path) {
    return browser.url(`${config.baseUrl}/${path}.htm`);
  }

   get btnLogout () {
    return $("//a[normalize-space()='Log Out']");
  }

  async logout () {
    await this.btnLogout.waitForClickable();
    await this.btnLogout.click();
  }
}

export const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
