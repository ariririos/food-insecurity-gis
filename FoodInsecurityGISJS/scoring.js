import PVector from './PVector.js';

const distBetweenCoords = (a, b) => Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));

export function scoreBlock(x, y, shapes, map) {
    let finalScore;
    const distWeight = 1.0;

    const dists = [];

    for (let i = 0; i < shapes.foodSources.length; i++) {
        const food = map.getScreenLocation(shapes.foodSources[i].getFirstCoords());
        const currBlock = new PVector(x, y);
        dists.push(distBetweenCoords(food, currBlock));
    }

    const minDist = dists.reduce((a, b) => Math.min(a, b));

    finalScore = minDist;

    return finalScore;
}