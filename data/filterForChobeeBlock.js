const JSONStream = require('jsonstream');
const fs = require('fs');
const path = require('path');
const JSONInputStream = JSONStream.parse("features.*");
const JSONOutputStream = JSONStream.stringify();
const inputStream = fs.createReadStream(path.join(__dirname, 'blocks.json'));
const outputStream = fs.createWriteStream(path.join(__dirname, 'chobeeBlocks.json'));
const chobeeFeatures = [];
inputStream.pipe(JSONInputStream)
    .on('data', data => {
        if (data.properties.COUNTYFP10 === "093") {
            chobeeFeatures.push(data);
            console.log(data.properties.GISJOIN);
        }
    })
    .on('end', () => {
        JSONOutputStream.pipe(outputStream);
        chobeeFeatures.forEach(JSONOutputStream.write);
        JSONOutputStream.end();
        outputStream.on('finish', () => console.log('serialization complete'))
    })
    .on('error', e => console.error(e));

// const allFeatures = require('./blocks.json').features;
// const fs = require('fs');
// const chobeeCountyCode = "093";
// const chobeeFeatures = allFeatures.filter(feature => feature.properties.COUNTYFP === chobeeCountyCode);
// const chobeeBlocks = { features: chobeeFeatures };
// fs.writeFile('./data/chobeeBlocks.json', JSON.stringify(chobeeBlocks), err => err ? console.error(err) : true);

