import java.util.Collections;

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
Graph network;
Pathfinder finder;
ArrayList<Path> paths;
ArrayList<Way> ways = new ArrayList<Way>();
HScrollbar xSlider;
HScrollbar ySlider;
HScrollbar zSlider;
boolean perspective = false;
Heatmap hm;

void setup() {
  size(800, 800);
  //fullScreen();
  // map = new MercatorMap(width, height, 27.6432, 27.0969, -81.2132, -80.6735, 0);
  // just city limits:
  //map = new MercatorMap(width, height, 27.2589, 27.2233, -80.8649, -80.7973, 0);
  // just city center:
  //map = new MercatorMap(width, height, 27.6477, 26.9595, -81.4650, -80.2215, 0);
  map = new MercatorMap(width, height, 27.2982, 27.1897, -80.8935, -80.7525, 0);
  loadData();
  parseData();
  loadHeatmap();
  // waysNetwork(ways);
  // allPaths();
  //println(paths);
  //xSlider = new HScrollbar(10, 25, 200, 16, 16);
  //ySlider = new HScrollbar(10, 50, 200, 16, 16);
  //zSlider = new HScrollbar(10, 75, 200, 16, 16);
}

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
  image(hm.p, 0, 0);
  // for (int i = 0; i < paths.size(); i++) {
  //  paths.get(i).display(100, 50);
  // }

  /*
    heatmap usage:
    hm = new Heatmap(numX, numY, cellW, cellH)
    float[][] data = new float[numX][numY]
    hm.scores = data;
    hm.normalizeScores();
    hm.draw();
    
    data format:
    [0][0]||[1][0]
    --------------
    [0][1]||[1][1]
  */

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

//void keyPressed() {
//  switch (key) {
//    case 'c':
//      perspective = !perspective;
//      break;
//  }
//}
