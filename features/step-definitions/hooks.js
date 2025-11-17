import { After, Before } from "@wdio/cucumber-framework";

/**
 * Hook ejecutado antes de cada escenario
 * Limpia la sesión para garantizar un estado limpio
 */
Before(async function() {
    console.log(`Iniciando escenario: ${this.pickle?.name || 'Sin nombre'}`);
    await browser.reloadSession();
});

/**
 * Hook ejecutado después de cada escenario
 * Limpia la sesión y captura screenshot si hay fallo
 */
After(async function(scenario) {
    try {
        // Capturar screenshot solo si falló
        if (scenario.result?.status === 'FAILED') {
            const screenshot = await browser.takeScreenshot();
            this.attach(screenshot, 'image/png');
            console.log(`Escenario fallido: ${scenario.pickle?.name}`);
        }
    } catch (error) {
        console.error('Error durante limpieza:', error.message);
    } finally {
        // reloadSession ya limpia cookies, no es necesario deleteAllCookies
        await browser.reloadSession();
        console.log('Limpieza completada');
    }
});
