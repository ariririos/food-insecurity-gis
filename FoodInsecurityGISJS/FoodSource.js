import CoordinatePolygon from './CoordinatePolygon.js';

export default class FoodSource extends CoordinatePolygon {
    constructor(coordinates, level, map) {
        const color = window.p.color(255, 255, 0); // FIXME: use level
        super(coordinates, color, map);
    }
}