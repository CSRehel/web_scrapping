const { enviarCorreo } = require('./email.js');
const puppeteer = require('puppeteer');
require('dotenv').config();

async function ejecutarPeriodicamente() {
    const intervalo = 5 * 60 * 1000;

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
      
        //! analizar la página resultante para ver si el texto a cambiado
        await page.waitForSelector('div[class="msg_esp_relac_azul');
        const textoElemento = await page.$eval('div[class="msg_esp_relac_azul"]', element => element.textContent);
        
        if(textoElemento !== 'No hay Disponibilidad de agendas en el Hospital Clínico Universidad de Chile') {
            console.log('Hay horas disponibles!');
            await enviarCorreo();
        } else {
            console.log('Aun no hay horas disponibles');
        }
        
        await browser.close();
    } catch (e) {
        console.error(e);
    }
}

ejecutarPeriodicamente().catch(error => console.error('Error:', error));