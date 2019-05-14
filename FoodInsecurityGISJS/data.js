import FoodSource from './FoodSource.js';
import Household from './Household.js';
import PVector from './PVector.js';
import Way from './Way.js';
import Heatmap from './Heatmap.js';
import { scoreBlock, scoreBlkGrpsByIncome } from './scoring.js';
import CoordinatePolygon from './CoordinatePolygon.js';

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

    const blkGrpData = await loadJSON("data/chobeeBlockGroups.json");
    data.blkGrpFeatures = blkGrpData.features;

    const blockData = await loadJSON("data/chobeeBlocks.json");
    data.blockFeatures = blockData;

    data.blockPopData = await loadJSON("data/chobeeBlockPops.json")

    return data;
}

async function parseData(data, shapes) {
    // Parse food source polygons
    data.foodFeatures.forEach(sourceData => {
        const coords = [];
        const origCoords = sourceData.polygonCoords;
        origCoords.forEach(coord => coords.push(new PVector(coord.reverse())));
        const source = new FoodSource(coords, 0.0, window.map); // TODO: choose fill color
        shapes.foodSources.push(source);
    });
    // Parse household polygons
    data.householdFeatures.forEach(houseData => {
        const coords = [];
        const origCoords = houseData.polygonCoords;
        origCoords.forEach(coord => coords.push(new PVector(coord.reverse())));
        const house = new Household(coords, window.map);
        shapes.households.push(house);
    });
    // Parse way linestrings
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

    const allBlockPops = [];
    // Parse block populations
    Object.values(data.blockPopData).forEach(block => allBlockPops.push(block.popTotal));
    const maxBlockPop = Math.max(...allBlockPops);

    // Parse income brackets
    /**
     * Format: incomeData: {
     * gisJoin: String,
     * countyCode: String,
     * incomeData: Number,
     * incomeBrackets: Number[16]
     * }[]
     */
    data.incomePercentagesByBlkGrp = {};
    data.incomeData.filter(blkGrp => blkGrp.countyCode === "093").forEach(blkGrp => {
        const totalPop = +blkGrp.incomeTotal;
        if (totalPop === 0) return;
        const incomePercentages = blkGrp.incomeBrackets.map(bracketNum => +bracketNum / totalPop);
        data.incomePercentagesByBlkGrp[blkGrp.gisJoin] = incomePercentages;
    });

    data.incomePercentageRangesTotal = [];
    const percentagesByBracket = [];
    for (let i = 0; i < 16; i++) percentagesByBracket[i] = [];
    Object.entries(data.incomePercentagesByBlkGrp).forEach(([, percentages]) => {
        // FIXME: why is percentagesByBracket flattened?
        for (let i = 0; i < percentages.length; i++) {
            percentagesByBracket[i].push(percentages[i]);
        }
    });
    percentagesByBracket.forEach((bracket, i) => data.incomePercentageRangesTotal[i] = Math.max(...bracket));

    scoreBlkGrpsByIncome(data);

    const maxBlkGrpIncome = Math.max(...Object.values(data.incomeAveragesByBlkGrp).filter(val => val));
    const minBlkGrpIncome = Math.min(...Object.values(data.incomeAveragesByBlkGrp).filter(val => val));

    console.log(minBlkGrpIncome);

    // Parse block group polygons
    data.blkGrpFeatures.forEach(blkGrpData => {
        const { properties: { GISJOIN: gisJoin }, geometry: { coordinates: origCoords } } = blkGrpData;
        const coords = [];
        origCoords[0].forEach(coord => coords.push(new PVector(coord.reverse())));
        const incomeAverage = data.incomeAveragesByBlkGrp[gisJoin];
        let incomeColor;
        if (incomeAverage !== null) {
            incomeColor = window.p.lerpColor(window.p.color(255, 0, 0), window.p.color(0, 255, 0), window.p.map(incomeAverage, minBlkGrpIncome, maxBlkGrpIncome, 0, 1));
        }
        else {
            incomeColor = window.p.color(128);
        }
        const blkGrp = new CoordinatePolygon(coords, incomeColor, window.map);
        shapes.blkGrps.push(blkGrp);
    });

    // Parse block polygons
    data.blockFeatures.forEach(blockData => {
        const { properties: { GISJOIN: gisJoin }, geometry: { coordinates: origCoords }} = blockData;
        const coords = [];
        origCoords[0].forEach(coord => coords.push(new PVector(coord.reverse())));
        const popColor = window.p.lerpColor(window.p.color(255, 0, 0), window.p.color(0, 255, 0), window.p.map(data.blockPopData[gisJoin].popTotal, 0, maxBlockPop, 0, 1));
        const block = new CoordinatePolygon(coords, popColor, window.map);
        shapes.blocks.push(block);
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
    loadData().then(data => parseData(data, shapes)).then(async(stuff) => { window.data = stuff.data; return stuff; }).then(loadHeatmap).then(() => status.doneLoading = true).catch(err => console.error(err));
}
