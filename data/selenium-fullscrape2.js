/* eslint-env node */
require('chromedriver');
const {Builder, By, Key} = require('selenium-webdriver');
const polygons = require('../FoodInsecurityGIS/data/polygons.json').features;
const fs = require('fs');
const { promisify } = require('util');
const path = require('path');
const writeFile = promisify(fs.writeFile);

const outputData = { features: []};
const erroredParcels = [];

const sleep = (time) => new Promise((resolve) => setTimeout(resolve, time));

(async function getParcelData() {
  let driver = await new Builder().forBrowser('chrome').build();

  let attemptNo = 5;
  try {
    for (let i = 30000; i < polygons.length; i++) { // change i when there's errors
        const currParcelID = polygons[i].properties.PARCELNO;
        await driver.get('http://g4b.okeechobeepa.com/gis/');
        await sleep(500);
        try {
            await driver.switchTo().frame(0);
        }
        catch (e) {
            console.log('Error in swtiching to frame for PARCELNO' + currParcelID);
            console.error(e);
            erroredParcels.push(currParcelID);
            await writeFile(path.resolve(__dirname, `errors-${attemptNo}.json`), JSON.stringify(erroredParcels));
            continue;
        }
        try {
            await driver.findElement(By.id('PIN')).sendKeys(currParcelID, Key.RETURN);
        }
        catch (e) {
           console.log('Error in finding parcel no input field for PARCELNO' + currParcelID);
           console.error(e);
           erroredParcels.push(currParcelID);
          await writeFile(path.resolve(__dirname, `errors-${attemptNo}.json`), JSON.stringify(erroredParcels));
           continue;
        }
        await sleep(500);
        try {
            await driver.findElement(By.css('.pointer:nth-child(2)')).click();
        }
        catch (e) {
            console.log('Error in clicking for PARCELNO' + currParcelID);
            console.error(e);
            erroredParcels.push(currParcelID);
            await writeFile(path.resolve(__dirname, `errors-${attemptNo}.json`), JSON.stringify(erroredParcels));
            continue;
        }
        await sleep(500);
        let useCode;
        try {
          useCode = await driver.findElement(By.css('#ownerDiv > table:nth-child(1) > tbody > tr:nth-child(2) > td > div > table > tbody > tr > td > table > tbody > tr:nth-child(2) > td > table:nth-child(2) > tbody > tr:nth-child(2) > td:nth-child(2)')).getText();
        }
        catch(e) {
          console.log('Error in finding usecode for PARCELNO' + currParcelID);
          console.error(e);
          erroredParcels.push(currParcelID);
          await writeFile(path.resolve(__dirname, `errors-${attemptNo}.json`), JSON.stringify(erroredParcels));
          continue;
        }
        const nextObj = { parcelID: currParcelID, useCode, i };
        console.log(nextObj);
        outputData.features.push(nextObj);
        await writeFile(path.resolve(__dirname, `data-${attemptNo}.json`), JSON.stringify(outputData));
    }
  }
  catch (e) {
    console.log('Other, fatal error:');
      console.error(e);
  }
  finally {
    await driver.quit();
  }
})();