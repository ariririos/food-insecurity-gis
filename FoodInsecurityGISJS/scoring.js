import PVector from './PVector.js';

const distBetweenCoords = (a, b) => Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));

// ranges of each bracket, from ACS 2017 data
const bracketValues = [
    10000,
    14999,
    19999,
    24999,
    29999,
    34999,
    39999,
    44999,
    49999,
    59999,
    74999,
    99999,
    124999,
    149999,
    199999,
    249999 // no upper limit provided, but this seems reasonable
];

export function scoreBlkGrpsByIncome(data) {
    const incomeAveragesByBlkGrp = {};
    data.incomeData.filter(blkGrp => blkGrp.countyCode === "093").forEach(blkGrp => {
        const totalPop = +blkGrp.incomeTotal;
        if (totalPop === 0) return incomeAveragesByBlkGrp[blkGrp.gisJoin] = 0;
        const incomeAveragesByBracket = [];
        blkGrp.incomeBrackets.forEach((bracketNum, i) => {
            if (+bracketNum === 0) return incomeAveragesByBracket[i] = 0;
            const eqDistIncomeValues = new Array(+bracketNum).fill().map((_val, j) => (bracketValues[i] / +bracketNum) * (j + 1));
            incomeAveragesByBracket[i] = eqDistIncomeValues.reduce((a, b) => a + b) / bracketNum;
            /**
             * Simplifies as:
             * (sum(i=0, 35) of (bV[i])*(i + 1))/bN^2
             */
        });
        incomeAveragesByBlkGrp[blkGrp.gisJoin] = incomeAveragesByBracket.reduce((a, b) => a + b) / incomeAveragesByBracket.length;
    });
    data.incomeAveragesByBlkGrp = incomeAveragesByBlkGrp;
}

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