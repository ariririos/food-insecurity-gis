import { promisify } from './promisify.js';
import FoodSource from './FoodSource.js';
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
    for (let i = 0; i < data.foodFeatures.length; i++) {
      const coords = [];
      // get the coordinates and iterate through them
      const coordinates = data.foodFeatures[i].polygonCoords;
      for (let j = 0; j < coordinates.length; j++) {
        const lat = coordinates[j][1];
        const lon = coordinates[j][0];
        const coordinate = new PVector(lat, lon);
        coords.push(coordinate);
      }
      const source = new FoodSource(coords, 0.0, window.map); // TODO: choose fill color
      shapes.foodSources.push(source);
  }
  for (let i = 0; i < data.waysFeatures.length; i++) {
      const { geometry, geometry: { type }} = data.waysFeatures[i];
      if (type === "LineString") {
          const coords = [];
          const { coordinates } = geometry;
          for (let j = 0; j < coordinates.length; j++) {
              const lat = coordinates[j][1];
              const lon = coordinates[j][0];
              const coordinate = new PVector(lat, lon);
              coords.push(coordinate);
          }
          const way = new Way(coords, window.map);
          shapes.ways.push(way);
      }
  }
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
    console.log(hm.scores);
    hm.draw();
    shapes.hm = hm;
}

export function loadAndParse(status, shapes) {
    loadData().then(data => parseData(data, shapes)).then(loadHeatmap).then(() => status.doneLoading = true).catch(err => console.error(err));
}
