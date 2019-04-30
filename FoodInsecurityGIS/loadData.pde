
void loadData() {
   // background = loadImage("data/map.png");
   // just city limits:
   //background = loadImage("data/city.png");
   //background.resize(width, height);
   
   waysData = loadJSONObject("data/ways.geojson");
   waysFeatures = waysData.getJSONArray("features");
   
   foodSourcesData = loadJSONObject("data/foodSources.json");
   foodFeatures = foodSourcesData.getJSONArray("features");
   
   householdsData = loadJSONObject("data/households.json");
   householdFeatures = householdsData.getJSONArray("features");

   incomeData = loadJSONArray("data/incomeBrackets.json");
}

void parseData() {
  // Load in all ways
  for (int i = 0; i < waysFeatures.size(); i++) {
    JSONObject geometry = waysFeatures.getJSONObject(i).getJSONObject("geometry");
    String type = geometry.getString("type");
    
    if(type.equals("LineString")){
      ArrayList<PVector> coords = new ArrayList<PVector>();
      //get the coordinates and iterate through them
      JSONArray coordinates = geometry.getJSONArray("coordinates");
      for(int j = 0; j<coordinates.size(); j++){
        float lat = coordinates.getJSONArray(j).getFloat(1);
        float lon = coordinates.getJSONArray(j).getFloat(0);
        //Make a PVector and add it
        PVector coordinate = new PVector(lat, lon);
        coords.add(coordinate);
      }
      //Create the Way with the coordinate PVectors
      Way way = new Way(coords);
      ways.add(way);
    }
    
    //JSONObject props =  features.getJSONObject(i).getJSONObject("properties"); 
    ////Iterator<String> keys = props.keys().iterator();
    //String shop = props.getString("shop");
    //if (shop == null) shop = " ";
    //shop = trim(shop);
    //String amenity = props.getString("amenity");
    //if (amenity == null) amenity = " ";
    //amenity = trim(amenity);
    //if (shop.equals("supermarket")) {
    //  float lat = geometry.getJSONArray("coordinates").getFloat(1);
    //  float lon = geometry.getJSONArray("coordinates").getFloat(0);
    //  FoodSource source = new FoodSource(lat, lon, 1.0);
    //  foodSources.add(source);
    //  println(props.getString("name"));
    //}
    //if (shop.equals("convenience")) {
    //  float lat = geometry.getJSONArray("coordinates").getFloat(1);
    //  float lon = geometry.getJSONArray("coordinates").getFloat(0);
    //  FoodSource source = new FoodSource(lat, lon, 0.5);
    //  foodSources.add(source);
    //  println(props.getString("name"));
    //}
    //if (amenity.equals("pharmacy")) {
    //  float lat = geometry.getJSONArray("coordinates").getFloat(1);
    //  float lon = geometry.getJSONArray("coordinates").getFloat(0);
    //  FoodSource source = new FoodSource(lat, lon, 0.5);
    //  foodSources.add(source);
    //  println(props.getString("name"));
    //}
    //if (amenity.equals("fuel")) {
    //  float lat = geometry.getJSONArray("coordinates").getFloat(1);
    //  float lon = geometry.getJSONArray("coordinates").getFloat(0);
    //  FoodSource source = new FoodSource(lat, lon, 0.0);
    //  foodSources.add(source);
    //  println(props.getString("name"));
    //}
  }

  // Load in all food sources
  for (int i = 0; i < foodFeatures.size(); i++) {
      ArrayList<PVector> coords = new ArrayList<PVector>();
      //get the coordinates and iterate through them
      JSONArray coordinates = foodFeatures.getJSONObject(i).getJSONArray("polygonCoords");
      for(int j = 0; j<coordinates.size(); j++) {
        float lat = coordinates.getJSONArray(j).getFloat(1);
        float lon = coordinates.getJSONArray(j).getFloat(0);
        //Make a PVector and add it
        PVector coordinate = new PVector(lat, lon);
        coords.add(coordinate);
      }
      //Create the FoodSource polygon with the coordinate PVectors
      FoodSource source = new FoodSource(coords); // TODO: choose fill color
      foodSources.add(source);
  }
  
  // Load in all households
  for (int i = 0; i < householdFeatures.size(); i++) {
    ArrayList<PVector> coords = new ArrayList<PVector>();
    JSONArray coordinates = householdFeatures.getJSONObject(i).getJSONArray("polygonCoords");
    for(int j = 0; j < coordinates.size(); j++) {
      float lat = coordinates.getJSONArray(j).getFloat(1);
      float lon = coordinates.getJSONArray(j).getFloat(0);
      //Make a PVector and add it
      PVector coordinate = new PVector(lat, lon);
      coords.add(coordinate);
    }
    Household house = new Household(coords);
    households.add(house);
  }

  //  Load in income brackets
  // for (int i = 0; i < incomeData.size(); i++) {
  //   // Filter for Okeechobee
  //   if (incomeData[i].getJSONString("countyCode") == "093") {

  //   }
  // }
}


void waysNetwork(ArrayList<Way> w) {
  int nodeResolution = 100;  // pixels
  int graphWidth = width;   // pixels
  int graphHeight = height; // pixels
  network = new Graph(graphWidth, graphHeight, nodeResolution, w);
}

// void allPaths() {
//   /*  An pathfinder object used to derive the shortest path. */
//   finder = new Pathfinder(network);
  
//   /*  Generate List of Shortest Paths through our network
//    *  FORMAT 1: Path(float x, float y, float l, float w) <- defines 2 random points inside a rectangle
//    *  FORMAT 2: Path(PVector o, PVector d) <- defined by two specific coordinates
//    */
   
//   paths = new ArrayList<Path>();
//   for (int i = 0; i < households.size(); i++) {
//     int mod = i % 100;
//     if (mod == 0) { // FIXME: only using 1 of every 100 households
//       for (int j = 0; j < foodSources.size(); j++) {
//         Path p = new Path(map.getScreenLocation(households.get(i).getFirstCoords()), map.getScreenLocation(foodSources.get(j).getFirstCoords()));
//         p.solve(finder);
//         paths.add(p);
//         // println("added path b/w " + i + " and " + j);
//       }
//     }
//   }
//   //finder.display(#ff0000, 1, true);
// }

void loadHeatmap() {
  int blocks = 5;
  // numX, numY, width, height
  hm = new Heatmap(blocks, blocks, width / blocks, height / blocks);
  float[][] scores = new float[blocks][blocks];
  for (int i = 0; i < blocks; i++) {
    for (int j = 0; j < blocks; j++) {
      scores[i][j] = scoreBlock((width / (float) blocks) * i, (height / (float) blocks) * j);
    }
  }
  hm.scores = scores;
  hm.normalizeScores();
  hm.draw();
}