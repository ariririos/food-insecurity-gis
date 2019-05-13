export default class CoordinatePolygon {
    constructor(coordinates, fillColor, map) {
        this.coords = coordinates;
        this.fill = fillColor;
        this.map = map;
    }
    draw() {
        window.p.beginShape();
        window.p.stroke(128);
        window.p.fill(this.fill);
        this.coords.forEach(coord => {
            const screenLocation = this.map.getScreenLocation(coord);
            window.p.vertex(screenLocation.x, screenLocation.y);
        })
        window.p.endShape();
    }
    getFirstCoords() {
        return this.coords[0];
    }
}