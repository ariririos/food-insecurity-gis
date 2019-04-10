class Household {
  PShape p2D; // for drawing the 2d polygon
  PShape p3D; // for drawing the 3d polygon 
  ArrayList<PVector> coords; // coordinates array
  float level; // quality of food access: 0 = worst; 1 = best
  // interpolate between blue and yellow
  color from = color(#0000ff);
  color to = color(#ffff00);
  color fill;
  
  Household(ArrayList<PVector> coordinates) {
    coords = coordinates;
    level = 1.0; // change per source
    fill = lerpColor(from, to, level);
    makeShape2D();
    makeShape3D();
  }
  
  void makeShape2D() {
    p2D = createShape();
    p2D.beginShape();
    p2D.fill(fill);
    p2D.noStroke();
    for (int i = 0; i < coords.size(); i++) {
        PVector screenLocation = map.getScreenLocation(coords.get(i));
        p2D.vertex(screenLocation.x, screenLocation.y);
    }
    p2D.endShape();
  }
  
  void makeShape3D() {
    p3D = createShape();
    p3D.beginShape();
    p3D.fill(fill);
    p3D.noStroke();
    for (int i = 0; i < coords.size(); i++) {
      PVector planeLocation = map.getScreenLocation(coords.get(i));
      p3D.vertex(planeLocation.x, planeLocation.y, 0);
    }
    for (int i = 0; i < coords.size(); i++) {
      PVector planeLocation = map.getScreenLocation(coords.get(i));
      p3D.vertex(planeLocation.x, planeLocation.y, 10);
    }
    p3D.endShape();
  }
  
  void draw2D() {
    shape(p2D, 0, 0);
  }
  
  void draw3D() {
    shape(p3D, 0, 0);
  }
 
  PVector getFirstCoords() {
    return coords.get(0);
  }
}
