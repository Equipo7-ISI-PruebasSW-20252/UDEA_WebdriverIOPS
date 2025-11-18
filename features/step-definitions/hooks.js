import { Before, After, BeforeAll, AfterAll } from '@wdio/cucumber-framework';

/**
 * Se ejecuta una vez antes de todos los escenarios
 */
BeforeAll(async function () {
    console.log('Iniciando suite de pruebas...');
});

/**
 * Se ejecuta antes de cada escenario
 */
Before(async function (scenario) {
    console.log(`Iniciando escenario: ${scenario.pickle.name}`);
});

/**
 * Se ejecuta después de cada escenario
 */
After(async function (scenario) {
    // Limpiar estado del navegador
    await browser.deleteAllCookies();
    
    await browser.execute(() => {
        try {
            localStorage.clear();
            sessionStorage.clear();
        } catch (e) {}
    });
    
    await browser.url('about:blank');
    
    // Log del resultado
    console.log(`Escenario finalizado: ${scenario.pickle.name} - ${scenario.result.status}`);
});

/**
 * Se ejecuta una vez después de todos los escenarios
 */
AfterAll(async function () {
    console.log('Suite de pruebas finalizada');
});
