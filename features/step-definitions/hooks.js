import { After, Before } from "@wdio/cucumber-framework";

/**
 * Hook ejecutado antes de cada escenario
 * Limpia la sesión para garantizar un estado limpio
 */
Before(async function() {
    console.log(`Iniciando escenario: ${this.pickle?.name || 'Sin nombre'}`);
    await browser.deleteAllCookies();
    await browser.reloadSession();
});

/**
 * Hook ejecutado después de cada escenario
 * Limpia la sesión y captura screenshot si hay fallo
 */
After(async function(scenario) {
    try {
        // Capturar screenshot si el escenario falló
        if (scenario.result?.status === 'FAILED') {
            const screenshot = await browser.takeScreenshot();
            this.attach(screenshot, 'image/png');
            console.log(`Escenario fallido: ${scenario.pickle?.name}`);
        }
        
        await browser.deleteAllCookies();
        await browser.reloadSession();
    } catch (error) {
        console.log('Error durante limpieza:', error.message);
    } finally {
        console.log('Limpieza completada');
    }
});
