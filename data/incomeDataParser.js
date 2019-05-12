const { promisify } =  require('util');
const parse = require('csv-parse');
const parseAwait = promisify(parse);
const { readFile, writeFile } =  require('fs');
const readFileAwait = promisify(readFile);
const writeFileAwait = promisify(writeFile);
(async() => {
    const incomeCSV = await readFileAwait('./nhgis_2017_blck_grp.csv', 'utf8');
    const parsedCSV = await parseAwait(incomeCSV);
    const headers = parsedCSV[0];
    const data = parsedCSV.slice(1);
    const incomeBracketsByJoinIndex = [];
    const gisJoinIndex = headers.indexOf('GISJOIN'); // get all
    const countyCodeIndex = headers.indexOf('COUNTYA');  // filter for 93
    const incomeTotalIndex = headers.indexOf('AH1OE001'); // total households in block group
    const incomeStartIndex = headers.indexOf('AH1OE002'); // lowest income group
    const incomeEndIndex = headers.indexOf('AH1OE017'); // highest income group
    console.log(gisJoinIndex, countyCodeIndex, incomeTotalIndex, incomeStartIndex, incomeEndIndex);
    for (const blkGrp of data) {
        const gisJoin = blkGrp[gisJoinIndex];
        const countyCode = blkGrp[countyCodeIndex];
        const incomeTotal = blkGrp[incomeTotalIndex];
        let incomeBrackets = [];
        for (let i = incomeStartIndex; i <= incomeEndIndex; i++ ) {
            incomeBrackets[i] = blkGrp[i];
        }
        incomeBrackets = incomeBrackets.filter(() =>  true); // remove empty items
        incomeBracketsByJoinIndex.push({ gisJoin, countyCode, incomeTotal, incomeBrackets });
    }
    try {
        await writeFileAwait('./incomeBrackets.json', JSON.stringify(incomeBracketsByJoinIndex));
    }
    catch (e) {
        console.log('error');
        console.error(e);
    }
})();