class Way {
  //Coordinates and color variables
  ArrayList<PVector>coordinates;
  color stroke;
  
  //Empty constructor
  Way(){}
  
  //Constructor of coordinates
  Way(ArrayList<PVector> coords) {
    coordinates =  coords;
    stroke = color(128, 128, 128, 200);
  }
  
  //Draw the road
  void draw() {
    strokeWeight(3);
    stroke(stroke);
    for(int i = 0; i<coordinates.size()-1; i++){
        //iterate through the coordinates and draw lines
        PVector screenStart = map.getScreenLocation(coordinates.get(i));
        PVector screenEnd = map.getScreenLocation(coordinates.get(i+1));
        line(screenStart.x, screenStart.y, screenEnd.x, screenEnd.y);
    }
  }
  
   
  
  void draw3D() {
    fill(color(255, 255, 255));
    for (int i = 0; i< coordinates.size() - 1; i++) {
      PVector start = map.getScreenLocation(coordinates.get(i));
      PVector end = map.getScreenLocation(coordinates.get(i + 1));
      PVector len = PVector.sub(end, start); // between the two endpoints
      // translate to centroid of box, about which it rotates
      PVector midpoint = PVector.add(start, end).div(2);
      translate(midpoint.x, midpoint.y, 0);
      float phi = atan(len.x / len.y);
      if (len.y > 0) {
        phi = (float)Math.PI - phi;
      }
      if (len.x > 0) {
        phi = -phi;
      }
      //rotate(phi);
      box(20, len.mag(), 20);
    }
  }
}
