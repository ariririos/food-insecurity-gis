float distBetweenCoords(PVector a, PVector b) {
    return sqrt(sq(a.x - b.x) + sq(a.y - b.y));
}

/**
    resX = # of heatmap rects in X
    resY = # of heatmap rects in Y
 */
float[][] calculateAllDistances(int resX, int resY) {
    float[][] allDists = new float[resX][resY];
    for (int i = 0; i < resX; i++) {
        for (int j = 0; j < resY; j++) {
            ArrayList<Float> dists = new ArrayList<Float>();
            for (int k = 0; k < foodSources.size(); k++) {
                PVector food = map.getScreenLocation(foodSources.get(k).getFirstCoords());
                PVector currBlock = new PVector((width / (float) resX) * i, (height / (float) resY) * j);
                // println("food ", food.x, food.y, "currBlock ", currBlock.x, currBlock.y);
                dists.add(distBetweenCoords(food, currBlock));
            }
            float minDist = dists.get(dists.indexOf(Collections.min(dists)));
            allDists[i][j] = minDist; // FIXME: only choosing the closest food source
        }
    }
    return allDists;
}
