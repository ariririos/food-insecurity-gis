export default class Way {
    constructor(coords, map) {
        this.coords = coords;
        this.stroke = window.p.color(255, 0, 0);
        this.map = map;
    }
    draw() {
        window.p.strokeWeight(1);
        window.p.stroke(this.stroke);
        for (let i = 0; i < this.coords.length - 1; i++) {
            const screenStart = this.map.getScreenLocation(this.coords[i]);
            const screenEnd = this.map.getScreenLocation(this.coords[i + 1]);
            window.p.line(screenStart.x, screenStart.y, screenEnd.x, screenEnd.y);
        }
    }
}