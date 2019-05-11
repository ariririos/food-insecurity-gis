import FoodSource from './FoodSource.js';
import Household from './Household.js';
import PVector from './PVector.js';
import Way from './Way.js';
import Heatmap from './Heatmap.js';
import { scoreBlock } from './scoring.js';

async function loadJSON(URL) {
    try {
        const data = await fetch(URL);
        const json = await data.json();
        return json;
    }
    catch (e) {
        console.error(e);
    }
}

async function loadData() {

    const data = {};
    const waysData = await loadJSON("data/ways.geojson");
    data.waysFeatures = waysData.features;

    const foodSourcesData = await loadJSON("data/foodSources.json");
    data.foodFeatures = foodSourcesData.features;

    const householdsData = await loadJSON("data/households.json");
    data.householdFeatures = householdsData.features;

    data.incomeData = await loadJSON("data/incomeBrackets.json");

    // const blkGrpData = await loadJSON("data/chobeeBlockGroups.geojson");
    // data.blkGrpFeatures = blkGrpData.features;

    return data;
}

async function parseData(data, shapes) {
    // Parse food sources
    data.foodFeatures.forEach(sourceData => {
        const coords = [];
        const origCoords = sourceData.polygonCoords;
        origCoords.forEach(coord => coords.push(new PVector(coord.reverse())));
        const source = new FoodSource(coords, 0.0, window.map); // TODO: choose fill color
        shapes.foodSources.push(source);
    });
    // Parse households
    data.householdFeatures.forEach(houseData => {
        const coords = [];
        const origCoords = houseData.polygonCoords;
        origCoords.forEach(coord => coords.push(new PVector(coord.reverse())));
        const house = new Household(coords, window.map);
        shapes.households.push(house);
    });
    // Parse ways
    data.waysFeatures.forEach(wayData => {
        const { geometry, geometry: { type }} =  wayData;
        if (type === 'LineString') {
            const coords = [];
            const { coordinates: origCoords } = geometry;
            origCoords.forEach(coord => coords.push(new PVector(coord.reverse())));
            const way = new Way(coords, window.map);
            shapes.ways.push(way); 
        }
        // FIXME: still need MultiLineStrings
    });
    return { data, shapes };
}

export default function loadHeatmap({ shapes }) {
    const blocks = 100;
    const hm = new Heatmap(blocks, blocks, window.p.width / blocks, window.p.height / blocks);
    const scores = [];
    for (let i = 0; i < blocks; i++) {
        scores[i] = [];
        for (let j = 0; j < blocks; j++) {
            scores[i][j] = scoreBlock((window.p.width / blocks) * i, (window.p.height / blocks) * j, shapes, window.map);
        }
    }
    hm.scores = scores;
    hm.normalizeScores();
    // hm.bezierScores();
    hm.draw();
    shapes.hm = hm;
}

export function loadAndParse(status, shapes) {
    loadData().then(data => parseData(data, shapes)).then(loadHeatmap).then(() => status.doneLoading = true).catch(err => console.error(err));
}
