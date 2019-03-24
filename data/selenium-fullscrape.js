require('chromedriver');
const {Builder, By, Key} = require('selenium-webdriver');
const polygons = require('../FoodInsecurityGIS/data/polygons.json').features;
const fs = require('fs');
const { promisify } = require('util');
const path = require('path');
const writeFile = promisify(fs.writeFile);

const outputData = { features: []};

(async function getParcelData() {
  let driver = await new Builder().forBrowser('chrome').build();
  
  try {
    for (let i = 32488; i < polygons.length; i++) {
        const currParcelID = polygons[i].properties.PARCELNO;
        await driver.get('http://g4b.okeechobeepa.com/gis/');
        await driver.switchTo().frame('recordSearchContent_1_iframe');
        await driver.findElement(By.id('PIN')).sendKeys(currParcelID, Key.RETURN);
        try {
            await driver.findElement(By.css('.pointer:nth-child(2)')).click();
        }
        catch (e) {
            continue;
        }
        let useCode = await driver.findElement(By.css('#ownerDiv > table:nth-child(1) > tbody > tr:nth-child(2) > td > div > table > tbody > tr > td > table > tbody > tr:nth-child(2) > td > table:nth-child(2) > tbody > tr:nth-child(2) > td:nth-child(2)')).getText();
        outputData.features.push({ parcelID: currParcelID, useCode, i });
        await writeFile(path.resolve(__dirname, 'data.json'), JSON.stringify(outputData));
    }
  }
  catch (e) {
      console.log(e);
  }
  finally {
    await driver.quit();
  }
})();