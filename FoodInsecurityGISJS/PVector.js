export default class PVector {
    constructor(x, y) {
        if (y === null || y === undefined) {
            this.x = x[0];
            this.y = x[1];
        }
        else {
            this.x = x;
            this.y = y;
        }
    }
    rotate(angleInRad) {
        const cs = Math.cos(angleInRad);
        const sn = Math.sin(angleInRad);

        const px = this.x * cs - this.y * sn;
        const py = this.x * sn + this.y * cs;
        
        this.x = px;
        this.y = py;
    }
}