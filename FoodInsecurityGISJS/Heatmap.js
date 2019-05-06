const cubicBezier = (t, p0, p1, p2, p3) => {
    if (t < 0 || t > 1) console.error(t + ' is outside the range for a cubic bezier curve');
    return (
        Math.exp(1 - t, 3) * p0 +
        3 * t * Math.exp(1 - t, 2) * p1 +
        3 * Math.exp(t, 2) * (1 - t) * p2 +
        Math.exp(t, 3) * p3
    );
    
}

export default class Heatmap {
    constructor(cellX, cellY, cellW, cellH) {
        this.cellX = cellX;
        this.cellY = cellY;
        this.cellW = cellW;
        this.cellH = cellH;
        this.bestColor = window.p.color(200, 0, 0, 50);
        this.midColor = window.p.color(255, 255, 0, 50);
        this.worstColor = window.p.color(0, 200, 0, 50);
        this.scores = [];
        this.canvas = window.p.createGraphics(cellX * cellW, cellY * cellH);
        console.log(this.canvas);
    }
    normalizeScores() {
        // FIXME: better way to do this with a reduce()
        let max = 0;
        let min = 10000000;
        for (let i = 0; i < this.cellX; i++) {
            for (let j = 0; j < this.cellY; j++) {
                const val = this.scores[i][j];
                if (val < min) min = val;
                if (val > max) max = val;
            }
        }
        
        for (let i = 0; i < this.cellX; i++) {
            for (let j = 0; j < this.cellY; j++) {
                const val = this.scores[i][j];
                const newVal = window.p.map(val, min, max, 0, 1);
                this.scores[i][j] = newVal;
            }
        } 
    }

    bezierScores() {
        for (let i = 0; i < this.cellX; i++) {
            for (let j = 0; j < this.cellY; j++) {
                const val = this.scores[i][j];
                const newVal = cubicBezier(val, .48, 1.07, .92, .98);
                this.scores[i][j] = newVal;
            }
        } 
    }

    draw() {
        this.canvas.beginShape();
        for (let i = 0; i < this.cellX; i++) {
            for (let j = 0; j < this.cellY; j++) {
                let col = window.p.color(0, 0, 0);
                const val = this.scores[i][j];
                if (val < .5) col = window.p.lerpColor(this.worstColor, this.midColor, val * 2);
                if (val == .5) col = this.midColor;
                if (val > .5) col = window.p.lerpColor(this.midColor, this.bestColor, (val - .5) * 2);
                this.canvas.fill(col);
                this.canvas.noStroke();
                this.canvas.rect(i * this.cellW, j * this.cellH, this.cellW, this.cellH);
            }
        }
        this.canvas.endShape();
    }
}