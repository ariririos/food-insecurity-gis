/**
 * next step: figure out why cubicBezier() is bouncing back instead of directly transforming the linear function
 */

import MercatorMap from './MercatorMap.js';
import { loadAndParse } from './data.js';

const status = { doneLoading: false, initialDraw: false };
const shapes =  {
    ways: [],
    foodSources: [],
    households: [],
    blkGrps: [],
    blocks: []
};

let FoodInsecurityGIS = p => {
    p.setup = () => {
        p.createCanvas(800, 800);
        window.p = p;
        window.shapes = shapes;
        // const map = new MercatorMap(p.width, p.height, 27.6872, 26.9147, -81.5900, -80.3004, 0); // county
        // const map = new MercatorMap(p.width, p.height, 27.24707, 27.24007, -80.83601, -80.82432, 0); // city center 
        const map = new MercatorMap(p.width, p.height, 27.2691, 27.2131, -80.8752, -80.7816, 0); // city limits
        window.map = map;
        loadAndParse(status, shapes);
    }
    p.draw = () => {
        while (!status.doneLoading) {
            return;
        }
        if (!status.initialDraw) {
            // shapes.foodSources.forEach(source => source.draw());
            // shapes.households.forEach(house => house.draw());
            // shapes.ways.forEach(way => way.draw());
            // shapes.blkGrps.forEach(blkGrp => blkGrp.draw());
            shapes.blocks.forEach(block => block.draw());
            // p.image(shapes.hm.canvas, 0, 0);
            status.initialDraw = true;
        }
    }
    // p.mouseMoved = () => {
    //     while (!status.doneLoading) {
    //         return;
    //     }
    //     const currBlockX = Math.floor(p.mouseX / shapes.hm.cellW);
    //     const currBlockY = Math.floor(p.mouseY / shapes.hm.cellH);
    //     console.log(shapes.hm.prevScores[currBlockX][currBlockY] + "=>" + shapes.hm.scores[currBlockX][currBlockY]);
    // }
};

const myp5 = new p5(FoodInsecurityGIS);
