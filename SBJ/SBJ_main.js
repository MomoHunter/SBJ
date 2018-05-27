function main() {
  var globalDict = new GlobalDict();
  var menu = new Menu(globalDict);
  window.addEventListener('keydown', function (e) { keydown(e, globalDict, menu); });
  window.addEventListener('keyup', function (e) { keyup(e, globalDict, menu); });
  document.getElementById("start").onclick = function(){
    menu.init();
    menu.show();
    document.getElementById("start").style.display = "none";
  };
}

function keydown(event, gD, menu) {
  gD.keys[event.keyCode] = true;  //dict for active keys
  console.log(event.keyCode);
  if (menu.visible) {
    menuControlDown(menu, event.keyCode);
  } else if (menu.selectionScreen.visible) {
    selectionScreenControlDown(menu.selectionScreen, event.keyCode);
  } else if (menu.game.visible) {
    gameControlDown(menu.game, event.keyCode);
  } else if (menu.shop.visible) {
    shopControlDown(menu.shop, event.keyCode);
  } else if (menu.achievements.visible) {
    achievementsControlDown(menu.achievements, event.keyCode);
  } else if (menu.save.visible) {
    saveControlDown(menu.save, event.keyCode);
  } else if (menu.load.visible) {
    loadControlDown(menu.load, event.keyCode);
  } else if (menu.highscores.visible) {
    highscoresControlDown(menu.highscores, event);
  } else if (menu.controls.visible) {
    controlsControlDown(menu.controls, event);
  }
}

function keyup(event, gD, menu) {
  try {
    gD.keys[event.keyCode] = false;
  } catch (err) {
    console.log(err.message);
  }
  if (menu.visible) {
    menuControlUp(menu, event.keyCode);
  } else if (menu.selectionScreen.visible) {
    selectionScreenControlUp(menu.selectionScreen, event.keyCode);
  } else if (menu.game.visible) {
    gameControlUp(menu.game, event.keyCode);
  } else if (menu.shop.visible) {
    shopControlUp(menu.shop, event.keyCode);
  } else if (menu.achievements.visible) {
    achievementsControlUp(menu.achievements, event.keyCode);
  } else if (menu.save.visible) {
    saveControlUp(menu.save, event.keyCode);
  } else if (menu.load.visible) {
    loadControlUp(menu.load, event.keyCode);
  } else if (menu.highscores.visible) {
    highscoresControlUp(menu.highscores, event);
  } else if (menu.controls.visible) {
    controlsControlUp(menu.controls, event);
  }
}

function GlobalDict() {
  this.canvas = document.getElementById("gamearea");
  this.context = this.canvas.getContext("2d");
  this.spritesheet = new Image();
  this.spritesheet.src = "img/Spritesheet.png";
  this.spriteDict = {                         //The numbers specify the x-pos, y-pos, width and height of the object
    "Pointer" : [1, 1, 10, 6],                //The B suffix marks a two times bigger version
    "Player1" : [12, 1, 20, 20],
    "Player2" : [33, 1, 14, 26],
    "Player3" : [48, 1, 14, 14],
    "Player4" : [63, 1, 24, 14],
    "Player5" : [88, 1, 20, 20],
    "Player6" : [109, 1, 25, 23],
    "Player7" : [135, 1, 24, 23],
    "Player1B" : [1, 28, 40, 40],
    "Player2B" : [42, 28, 28, 52],
    "Player3B" : [71, 28, 28, 28],
    "Player4B" : [100, 28, 48, 28],
    "Player5B" : [149, 28, 40, 40],
    "Player6B" : [190, 28, 50, 46],
    "Player7B" : [241, 28, 48, 46],
    "Item1" : [1, 81, 15, 19],
    "Item2" : [17, 81, 18, 19],
    "Item3" : [36, 81, 16, 16],
    "Item4" : [53, 81, 20, 13],
    "Item5" : [74, 81, 17, 20],
    "Item1B" : [1, 102, 30, 38],
    "Item2B" : [32, 102, 36, 38],
    "Item3B" : [69, 102, 32, 32],
    "Item4B" : [102, 102, 40, 26],
    "Item5B" : [143, 102, 32, 40],
    "Money1" : [1, 141, 30, 18],
    "Money2" : [32, 141, 30, 18],
    "Money3" : [63, 141, 30, 18],
    "Money4" : [94, 141, 30, 18],
    "Shamrock" : [247, 140, 15, 19],
    "GoldenShamrock" : [125, 141, 15, 19],
    "Fireball" : [146, 146, 12, 12],
    "Reward1" : [1, 162, 40, 40],
    "Reward2" : [42, 162, 40, 40],
    "Reward3" : [83, 162, 40, 40],
    "Reward4" : [124, 162, 40, 40],
    "Reward5" : [165, 162, 40, 40],
    "Reward6" : [206, 162, 40, 40],
    "Reward7" : [247, 162, 40, 40],
    "Reward8" : [288, 162, 40, 40],
    "Reward9" : [329, 162, 40, 40],
    "Reward10" : [370, 162, 40, 40],
    "Reward11" : [1, 203, 40, 40],
    "Reward12" : [42, 203, 40, 40],
    "Reward13" : [83, 203, 40, 40],
    "Reward14" : [124, 203, 40, 40],
    "Reward15" : [165, 203, 40, 40],
    "Reward16" : [206, 203, 40, 40],
    "Reward17" : [247, 203, 40, 40],
    "Reward18" : [288, 203, 40, 40],
    "Reward19" : [329, 203, 40, 40],
    "Reward20" : [370, 203, 40, 40],
    "Reward21" : [1, 244, 40, 40],
    "Reward22" : [42, 244, 40, 40],
    "Reward23" : [83, 244, 40, 40],
    "Reward24" : [124, 244, 40, 40],
    "Reward25" : [165, 244, 40, 40],
    "Reward26" : [206, 244, 40, 40],
    "Reward27" : [247, 244, 40, 40],
    "Reward28" : [288, 244, 40, 40],
    "Reward29" : [329, 244, 40, 40],
    "Reward30" : [370, 244, 40, 40],
    "Reward31" : [1, 285, 40, 40],
    "Reward32" : [42, 285, 40, 40],
    "Reward33" : [83, 285, 40, 40],
    "Reward34" : [124, 285, 40, 40],
    "Reward35" : [165, 285, 40, 40],
    "Reward1B" : [415, 1, 80, 80],
    "Reward2B" : [496, 1, 80, 80],
    "Reward3B" : [577, 1, 80, 80],
    "Reward4B" : [658, 1, 80, 80],
    "Reward5B" : [739, 1, 80, 80],
    "Reward6B" : [820, 1, 80, 80],
    "Reward7B" : [901, 1, 80, 80],
    "Reward8B" : [982, 1, 80, 80],
    "Reward9B" : [1063, 1, 80, 80],
    "Reward10B" : [1144, 1, 80, 80],
    "Reward11B" : [415, 82, 80, 80],
    "Reward12B" : [496, 82, 80, 80],
    "Reward13B" : [577, 82, 80, 80],
    "Reward14B" : [658, 82, 80, 80],
    "Reward15B" : [739, 82, 80, 80],
    "Reward16B" : [820, 82, 80, 80],
    "Reward17B" : [901, 82, 80, 80],
    "Reward18B" : [982, 82, 80, 80],
    "Reward19B" : [1063, 82, 80, 80],
    "Reward20B" : [1144, 82, 80, 80],
    "Reward21B" : [415, 163, 80, 80],
    "Reward22B" : [496, 163, 80, 80],
    "Reward23B" : [577, 163, 80, 80],
    "Reward24B" : [658, 163, 80, 80],
    "Reward25B" : [739, 163, 80, 80],
    "Reward26B" : [820, 163, 80, 80],
    "Reward27B" : [901, 163, 80, 80],
    "Reward28B" : [982, 163, 80, 80],
    "Reward29B" : [1063, 163, 80, 80],
    "Reward30B" : [1144, 163, 80, 80],
    "Reward31B" : [415, 244, 80, 80],
    "Reward32B" : [496, 244, 80, 80],
    "Reward33B" : [577, 244, 80, 80],
    "Reward34B" : [658, 244, 80, 80],
    "Reward35B" : [739, 244, 80, 80],
    "Currency1" : [173, 150, 7, 9],
    "Currency2" : [181, 141, 14, 18],
    "Currency3" : [196, 132, 21, 27],
    "Currency4" : [218, 123, 28, 36]
  };
  this.itemProb = [5, 1, 3, 0.3, 1.5];                   //relative probabilities
  this.itemBaseDur = [100, 200, 350, 10, 200];           //in frames
  this.itemPerLvlDur = [50, 100, 75, 4, 150];            //time plus per level up
  this.itemStartValue = [1000, 3999, 2100, 5000, 4550];  //costs for level 1
  this.moneyProb = [5, 4, 1, 0.05];                 //relative probabilities
  this.keys = [];
  this.playerUnlocked = new Array(6).fill(false);
  this.save = {};
}