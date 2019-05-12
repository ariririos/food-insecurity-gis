import java.util.Collections;
import java.util.Map;
import java.util.HashMap;

MercatorMap map;
PImage background;
ArrayList<FoodSource> foodSources = new ArrayList<FoodSource>();
ArrayList<Household> households = new ArrayList<Household>();
JSONObject waysData;
JSONArray waysFeatures;
JSONObject foodSourcesData;
JSONArray foodFeatures;
JSONObject householdsData;
JSONArray householdFeatures;
JSONArray incomeData;
Graph network;
Pathfinder finder;
ArrayList<Path> paths;
ArrayList<Way> ways = new ArrayList<Way>();
ArrayList<CoordinatePolygon> blkGrps = new ArrayList<CoordinatePolygon>();
JSONObject blkGrpData;
JSONArray blkGrpFeatures;
HScrollbar xSlider;
HScrollbar ySlider;
HScrollbar zSlider;
boolean perspective = false;
Heatmap hm;
Boolean paused = false;
Map<String, ArrayList<Float>> incomeBracketsByBlkGrp = new HashMap<String, ArrayList<Float>>();

void setup() {
  size(1000, 800);
  // approx city limits:
  // map = new MercatorMap(width, height, 27.2982, 27.1897, -80.8935, -80.7525, 0);
  // city center:
  // map = new MercatorMap(width, height, 27.24707, 27.24007, -80.83601, -80.82432, 0);
  // southern near 441:
  // map = new MercatorMap(width, height, 27.2248, 27.1967, -80.8551, -80.8083, 0);
  // county:
  map = new MercatorMap(width, height, 27.6872, 26.9147, -81.5900, -80.3004, 0);
  loadData();
  parseData();
  waysNetwork(ways);
  finder = new Pathfinder(network);
  paths = new ArrayList<Path>();
  loadHeatmap();
  // hm.printScores();
  finder.getAllNodes();
  
  //println(paths);
  //xSlider = new HScrollbar(10, 25, 200, 16, 16);
  //ySlider = new HScrollbar(10, 50, 200, 16, 16);
  //zSlider = new HScrollbar(10, 75, 200, 16, 16);
}

int count = 5;

void draw() {
  background(255, 255, 255);
  
  // lights();
  for (int i = 0; i < foodSources.size(); i++) {
    foodSources.get(i).draw2D();
  }
  for (int i = 0; i < households.size(); i++) {
    households.get(i).draw2D();
  }
  for (int i = 0; i < ways.size(); i++) {
    ways.get(i).draw();
  }
  for (int i = 0; i < blkGrps.size(); i++) {
    blkGrps.get(i).draw();
  }
  // image(hm.p, 0, 0);
  paths.get(count).display(lerpColor(#ff0000, #ffff00, map(count, 0, paths.size(), 0, 1)), 1000);
  if (!paused) count++;
  if (count == paths.size()) count = 0;
  delay(500);
  // for (int i = count; i < paths.size(); ) {
  //   count++;
  //   paths.get(i).display(lerpColor(#ff0000, #ffff00, map(i, 0, paths.size(), 0, 1)), 1000);
  //   delay(500);
  // }
  


  //camera();
  //xSlider.update();
  //xSlider.display();
  //ySlider.update();
  //ySlider.display();
  //zSlider.update();
  //zSlider.display();
  //float eyeX = xSlider.getPos()/200;
  //float eyeY = ySlider.getPos()/200;
  //float eyeZ = zSlider.getPos();
  //camera(width * eyeX, height * eyeY, 5.0*eyeZ, width/2.0, height/2.0, 0, 0, 1, 0);
  //for (int i = 0; i < ways.size(); i++) {
  //  ways.get(i).draw3D();
  //}
 
  



  
  //float eyeY = ySlider.getPos()/200;

  ////camera(0.0, 0.0, 5.0*eyeZ, 0.0, 0.0, 0.0, 0.0, 0.0, -1.0);

  
  
}

void keyPressed() {
 switch (key) {
   case 'c':
     paused = !paused;
     break;
 }
}
