import CoordinatePolygon from './CoordinatePolygon.js';
import MercatorMap from './MercatorMap.js';

export default class Household extends CoordinatePolygon {
    /**
     * 
     * @param {Number[][]} coordinates 
     * @param {MercatorMap} map 
     */
    constructor(coordinates, map) {
        super(coordinates, window.p.color(255, 0, 0), map)
    }
}