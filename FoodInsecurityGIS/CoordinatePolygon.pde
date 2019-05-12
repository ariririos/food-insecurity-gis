class CoordinatePolygon {
    PShape p;
    ArrayList<PVector> coords;
    color fill;

    CoordinatePolygon(ArrayList<PVector> coordinates, int fillColor)  {
        coords = coordinates;
        fill = fillColor;
        makeShape();
    }

    void makeShape() {
        p = createShape();
        p.beginShape();
        p.fill(fill);
        p.stroke(#000000);
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