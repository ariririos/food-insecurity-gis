const { promisify } = require('util');
const parse = require('csv-parse');
const parseAwait = promisify(parse);
const { readFile, writeFile } = require('fs');
const readFileAwait = promisify(readFile);
const writeFileAwait = promisify(writeFile);
(async() => {
    const popCSV = await readFileAwait('./nhgis0004_ds172_2010_block.csv');
    const parsedCSV = await parseAwait(popCSV);
    const headers = parsedCSV[0];
    const data = parsedCSV.slice(1);
    const popByJoinIndex = {};
    const gisJoinIndex = headers.indexOf('GISJOIN');
    const countyCodeIndex = headers.indexOf('COUNTYA');
    const totalPopIndex = headers.indexOf('H7V001');
    for (const block of data) {
        const gisJoin = block[gisJoinIndex];
        const countyCode = block[countyCodeIndex];
        if (countyCode !== "093") continue;
        const popTotal = block[totalPopIndex];
        popByJoinIndex[gisJoin] = { countyCode, popTotal: +popTotal };
    }
    try {
        await writeFileAwait('./chobeeBlockPops.json', JSON.stringify(popByJoinIndex));
    }
    catch (e) {
        console.log('error');
        console.error(e);
    }
})();