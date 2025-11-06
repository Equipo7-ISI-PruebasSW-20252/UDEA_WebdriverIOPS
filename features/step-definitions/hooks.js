import { After, Before } from "@wdio/cucumber-framework";

Before(async () => {
    // Limpiar sesión antes de cada escenario
    await browser.deleteAllCookies();
    await browser.reloadSession();
});

After(async () => {
    // Limpiar sesión después de cada escenario
    try {
        await browser.deleteAllCookies();
        await browser.reloadSession();
    } catch (error) {
        console.log('Cleanup completed');
    }
});
