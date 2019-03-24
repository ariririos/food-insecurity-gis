// food source is a polygon visualization colored
// by the quality of the food source
/**
 * levels of food quality:
 * 0: bare minimum available -- gas stations,
 *  very small convenience stores, food stands
 *  and/or not open frequently
 * 0.25: food banks, fast food
 * 0.5: pharmacies, larger convenience stores, food stores that aren't open very long
 * 0.75: major food stores open during normal times
 * 1: all types of food available, all the time -- 
 *  24/7 Walmarts, other large, always open warehouse stores
 */
class FoodSource {
  PShape p2D; // for drawing the 2d polygon
  PShape p3D; // for drawing the 3d polygon 
  ArrayList<PVector> coords; // coordinates array
  float level; // quality of the food source: 0 = worst; 1 = best
  // interpolate between red and green
  color from = color(#ff0000);
  color to = color(#00ff00);
  color fill;
  
  FoodSource(ArrayList<PVector> coordinates) {
    coords = coordinates;
    level = 0.0; // change per source
    fill = lerpColor(from, to, level);
    makeShape2D();
    makeShape3D();
  }
  
  void makeShape2D() {
    p2D = createShape();
    p2D.beginShape();
    p2D.fill(fill);
    p2D.noStroke();
    for(int i = 0; i < coords.size(); i++) {
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
