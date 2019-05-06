import MercatorMap from './MercatorMap.js';
import { loadAndParse } from './data.js';

const status = { doneLoading: false };
const shapes =  {
    ways: [],
    foodSources: [],
    households: []
};
let hm;

let FoodInsecurityGIS = p => {
    p.setup = () => {
        p.createCanvas(800, 800);
        window.p = p;
        const map = new MercatorMap(p.width, p.height, 27.6872, 26.9147, -81.5900, -80.3004, 0);
        // const map = new MercatorMap(p.width, p.height, 27.24707, 27.24007, -80.83601, -80.82432, 0);
        window.map = map;
        loadAndParse(status, shapes);
    }
    p.draw = () => {
        while (!status.doneLoading) {
            return;
        }
        for (let i = 0; i < shapes.foodSources.length; i++) {
            shapes.foodSources[i].draw();
        }
        for (let i = 0; i < shapes.ways.length; i++) {
            shapes.ways[i].draw();
        }
        p.image(shapes.hm.canvas, 0, 0);
    }
};

let myp5 = new p5(FoodInsecurityGIS);