import { After } from '@wdio/cucumber-framework';

/**
 * Hook que se ejecuta DESPUÉS de cada escenario
 */
After(async function (scenario) {
    try {
        // Solo lo esencial sin lanzar errores
        await browser.deleteAllCookies().catch(() => {});
        await browser.execute(() => {
            localStorage?.clear();
            sessionStorage?.clear();
        }).catch(() => {});
    } catch (error) {
        // Ignorar completamente cualquier error
    }
});
