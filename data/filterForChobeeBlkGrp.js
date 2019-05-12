const allFeatures = require('../FoodInsecurityGIS/data/blockGroups.json').features;
const fs = require('fs');
const chobeeCountyCode = "093";
const chobeeFeatures = allFeatures.filter(feature => feature.properties.COUNTYFP === chobeeCountyCode);
const chobeeBlkGrps = { features: chobeeFeatures };
fs.writeFile('../FoodInsecurityGIS/data/chobeeBlockGroups.json', JSON.stringify(chobeeBlkGrps), err => err ? console.error(err) : true);

