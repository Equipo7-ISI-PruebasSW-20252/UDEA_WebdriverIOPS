import { config } from "../../wdio.conf.js";

/**
 * Page Object base conteniendo métodos, selectores y funcionalidad
 * compartida entre todos los page objects
 */
export default class Page {
    /**
     * Navega a una sub-página de la aplicación
     * @param {string} path - Ruta de la sub-página (ej: 'overview', 'billpay')
     */
    open(path) {
        return browser.url(`${config.baseUrl}/${path}.htm`);
    }

    /**
     * Selector del botón de logout
     */
    get btnLogout() {
        return $("//a[normalize-space()='Log Out']");
    }

    /**
     * Método para cerrar sesión
     */
    async logout() {
        await this.btnLogout.waitForClickable();
        await this.btnLogout.click();
    }

    /**
     * Método genérico para llenar un input
     * @param {WebdriverIO.Element} element - Elemento input
     * @param {string} value - Valor a ingresar
     */
    async fillInput(element, value) {
        await element.waitForDisplayed();
        await element.setValue(value);
    }

    /**
     * Método genérico para hacer clic en un botón
     * @param {WebdriverIO.Element} button - Elemento botón
     */
    async clickButton(button) {
        await button.waitForClickable();
        await button.click();
    }

    /**
     * Método genérico para seleccionar opción de un select por índice
     * @param {WebdriverIO.Element} selectElement - Elemento select
     * @param {number} index - Índice de la opción
     */
    async selectByIndex(selectElement, index = 0) {
        await selectElement.waitForDisplayed();
        const options = await selectElement.$$('option');
        
        if (options.length > index) {
            await selectElement.selectByIndex(index);
        } else {
            throw new Error(`No hay opción disponible en el índice ${index}`);
        }
    }

    /**
     * Método genérico para verificar si un elemento es visible
     * @param {WebdriverIO.Element} element - Elemento a verificar
     * @param {number} timeout - Tiempo de espera en ms
     * @returns {Promise<boolean>}
     */
    async isElementDisplayed(element, timeout = 5000) {
        try {
            await element.waitForDisplayed({ timeout });
            return await element.isDisplayed();
        } catch (error) {
            return false;
        }
    }

    /**
     * Método genérico para obtener texto de un elemento
     * @param {WebdriverIO.Element} element - Elemento
     * @returns {Promise<string>}
     */
    async getElementText(element) {
        await element.waitForDisplayed();
        return await element.getText();
    }

    /**
     * Navega haciendo clic en un link del menú
     * @param {string} linkText - Texto del link (ej: 'Bill Pay', 'Accounts Overview')
     */
    async navigateToMenuOption(linkText) {
        const menuLink = await $(`=${linkText}`);
        await menuLink.waitForDisplayed({ timeout: 10000 });
        await menuLink.click();
        await browser.pause(1000);
    }

    /**
     * Método genérico para hacer submit con fallback a JavaScript click
     * @param {WebdriverIO.Element} button - Botón de submit
     */
    async submitWithFallback(button) {
        await button.waitForExist({ timeout: 10000 });
        await button.waitForDisplayed({ timeout: 10000 });
        await button.scrollIntoView();
        await browser.pause(500);
        
        try {
            await button.waitForClickable({ timeout: 5000 });
            await button.click();
        } catch (error) {
            console.log('Click regular falló, usando JavaScript click...');
            await browser.execute((el) => el.click(), await button);
        }
    }
}

/**
 * Utilidad para pausar ejecución
 * @param {number} ms - Milisegundos a esperar
 */
export const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
