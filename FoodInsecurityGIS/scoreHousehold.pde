// float scoreHousehold(Household house) {
//     // Calculate distance from all food sources
//     float dist;

// }

float scoreBlock(float x, float y) {
    float finalScore = 0.0;
    float distWeight = 1.0;

    /**
     * Calculate straight-line distance from all food sources */
    ArrayList<Float> dists = new ArrayList<Float>();
    for (int k = 0; k < foodSources.size(); k++) {
        PVector food = map.getScreenLocation(foodSources.get(k).getFirstCoords());
        PVector currBlock = new PVector(x, y);
        dists.add(distBetweenCoords(food, currBlock));
    }
    // TODO: this uses avg dist from all food sources, maybe needs some ease-in weighting
    // float sum = 0.0f;
    // for (float dist: dists) {
    //     sum += dist;
    // }
    // float avgDist = sum / dists.size();
    // allDists[i][j] = avgDist;
    // TODO: this uses the min dist, could use ease-in weighting
    float minDist = dists.get(dists.indexOf(Collections.min(dists)));

    /**
     * Calculate path line distance from all food sources
     */
    ArrayList<Float> pathDists = new ArrayList<Float>();
    for (int i = 0; i < 1; i++) {
        PVector foodSource = map.getScreenLocation(foodSources.get(i).getFirstCoords());
        PVector currBlock = new PVector(x, y);
        Path p = new Path(currBlock, foodSource);
        p.solve(finder);
        paths.add(p);
        float totalLength = p.getTotalLength();
        if (totalLength > 0) {
            pathDists.add(p.getTotalLength());
        }
    }

    //float minPathDist = pathDists.get(pathDists.indexOf(Collections.min(pathDists)));    
    // finalScore = minDist * 1.0;

    float pathSum = 0.0f;
    for (float dist: pathDists) {
        pathSum += dist;
    }
    float avgPathDist = pathSum / pathDists.size();
    finalScore = avgPathDist * 1.0;
    // println(x, y, finalScore);
    if (Float.isNaN(finalScore)) {
        finalScore = 0.0f;
    }
    return finalScore;
}