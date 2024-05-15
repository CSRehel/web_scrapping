const { enviarCorreo } = require('./email.js');
const puppeteer = require('puppeteer');
require('dotenv').config();

async function ejecutarPeriodicamente() {
    const intervalo = 10 * 60 * 1000;

    while (true) {
        await ejecutarPagina();
        console.log('Página ejecutada. Esperando...', new Date());
        await new Promise(resolve => setTimeout(resolve, intervalo));
    }
}
  
async function ejecutarPagina() {
    try {
        const browser = await puppeteer.launch({ headless: false });
        const page = await browser.newPage();
        
        await page.goto(process.env.URL);
        
        await page.waitForSelector('select#xxx');
        await page.select('select#xxx', '25');
        
        await page.waitForSelector('select#zzz option[value="147"]');
        await page.select('select#zzz', '147');
        
        await page.waitForSelector('input#dnn_ctr10551_WCitawebmovil_txtoftapac');
        await page.type('input#dnn_ctr10551_WCitawebmovil_txtoftapac', '111111111');
        
        await page.waitForSelector('a#dnn_ctr10551_WCitawebmovil_imbBuscar');
        await page.click('a#dnn_ctr10551_WCitawebmovil_imbBuscar');

        //! -------------------------------------------------------------------------
        // Obtener una lista de todos los botones en la tabla
        await page.waitForSelector('table#dnn_ctr10551_WCitawebmovil_GridView1');
        const rows = await page.$$('table#dnn_ctr10551_WCitawebmovil_GridView1 tr');

        for (const row of rows) {
            const boton = await row.$$('input[type="button"].btn.btn-primary');
            if(!boton || boton.length === 0) continue;

            const cells = await row.$$('td');
            const doctor = await cells[1].evaluate(element => element.textContent.trim());
            const valor = await page.evaluate(element => element.value, boton[0]);
            
            if (valor !== 'Agenda completa') {
                let description = `Hora disponible: ${valor} con el meddico: ${doctor}`;
                await enviarCorreo(description);
            }
        }

        await browser.close();
    } catch (e) {
        console.error(e);
        await browser.close();
    }
}

ejecutarPeriodicamente().catch(error => console.error('Error:', error));