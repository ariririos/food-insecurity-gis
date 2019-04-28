class Heatmap {
  int cellX, cellY;
  float cellW, cellH;
  float[][] scores;
  color worst, mid, best;
  PGraphics p;
 
  Heatmap(){}
  
  Heatmap(int _cellX, int _cellY, float _cellW, float _cellH){
    cellX = _cellX;
    cellY = _cellY;
    cellW = _cellW;
    cellH = _cellH;
    best = color(200, 0, 0, 50);
    mid = color(255, 255, 0, 50);
    worst = color(0, 200, 0, 50);
    scores = new float[cellX][cellY];
    p = createGraphics(int(cellX*cellW), int(cellY*cellH));
  }
  
  void normalizeScores(){
    float max = 0;
    float min = 10000000;
    for(int i = 0; i<cellX; i++){
      for(int j = 0; j<cellY; j++){
        float val = scores[i][j];
        if (val < min) min = val;
        if (val > max) max = val;
      }
    }
    
    for(int i = 0; i<cellX; i++) {
      for(int j = 0; j<cellY; j++) {
        float val = scores[i][j];
        float newVal = map(val, min, max, 0, 100);
        scores[i][j] = newVal;
      }
    }
  }

  void printScores() {
    for(int i = 0; i<cellX; i++) {
      for(int j = 0; j<cellY; j++) {
        println(scores[i][j]);
      }
    }
  }
  
  void draw(){
    p.beginDraw();
    for(int i = 0; i<cellX; i++){
      for(int j = 0; j<cellY; j++){
        color col = color(0, 0, 0);
        float val = scores[i][j];
        if(val < 50) col = lerpColor(worst, mid, val/50);
        if(val == 50) col = mid;
        if(val > 50) col = lerpColor(mid, best, (val - 50)/50);
        if (val == 0) col = color(0, 0, 0, 50); // mark blocks that don't have a path
        p.fill(col);
        p.noStroke();
        p.rect(i*cellW, j*cellH, cellW, cellH);
      }
    }
    p.endDraw();
    
  }
  
}
