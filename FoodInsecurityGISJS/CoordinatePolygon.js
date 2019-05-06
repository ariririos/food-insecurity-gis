export default class CoordinatePolygon {
    constructor(coordinates, fillColor, map) {
        this.coords = coordinates;
        this.fill = fillColor;
        this.map = map;
    }
    draw() {
        window.p.beginShape();
        window.p.fill(this.fill);
        for (let i = 0; i < this.coords.length; i++) {
            const screenLocation = this.map.getScreenLocation(this.coords[i]);
            window.p.vertex(screenLocation.x, screenLocation.y);
        }
        window.p.endShape();
    }
    getFirstCoords() {
        return this.coords[0];
    }
}