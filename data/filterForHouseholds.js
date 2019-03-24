const allFeatures = require('./useCodes.json').features;
const allPolygons = require('./polygons.json');
const fs = require('fs');
const resUseCodes = ['MOBILE HOM (000200)', 'SINGLE FAM (000100)', 'MULTI-FAM (000800)', 'RV/MH,PK L (002800)', 'HOTELS/MOT (003900)', 'CONDOMINIA (000400)', 'MULTI-FAM (000300)'];
const resFeatures = allFeatures.filter(feature => resUseCodes.includes(feature.useCode));
const households = { "features": []};
resFeatures.forEach(feature => {
    const resFeature = {};
    resFeature.parcelID = feature.parcelID;
    resFeature.useCode = feature.useCode;
    const resPoly = allPolygons.features.filter(polyFeat => polyFeat.properties.PARCELNO == feature.parcelID)[0];
    resFeature.polygonCoords = resPoly.geometry.coordinates[0][0];
    households.features.push(resFeature);
});

fs.writeFile('households.json', JSON.stringify(households), err => err ? console.error(err): true);

