class IncomePolygon {
    PShape p;
    ArrayList<PVector> coords;
    color from = color(#ffffff);
    color to = color(#ff0000);
    color fill;
    float level;

    IncomePolygon(ArrayList<PVector> coordinates, float income)  {
        coords = coordinates;
        level = map(income, 0.0, 200000.0, 0.0, 1.0); // maybe this isn't the best way to do it??
        fill = lerpColor(from, to, level);
        makeShape();
    }

    void makeShape()  {
        p = createShape();
        p.beginShape();
        p.fill(fill);
        p.noStroke();
        for (int i =  0; i < coords.size(); i++) {
            PVector screenLocation = map.getScreenLocation(coords.get(i));
            p.vertex(screenLocation.x, screenLocation.y);
        }
        p.endShape();
    }

    void draw() {
        shape(p, 0, 0);
    }

    PVector getFirstCoords() {
        return coords.get(0);
    }
}