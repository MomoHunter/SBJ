function main() {
  var globalDict = new GlobalDict();
  var menu = new Menu(globalDict);
  window.addEventListener('keydown', event => keydownEvent(event, globalDict));
  window.addEventListener('keyup', event => keyupEvent(event, globalDict));
  window.addEventListener('mousemove', event => mousemoveEvent(event, globalDict));
  window.addEventListener('click', event => clickEvent(event, globalDict));
  window.addEventListener('wheel', event => wheelEvent(event, globalDict));
  menu.init();
  globalDict.currentPage = menu;
  globalDict.raf = requestAnimationFrame(timestamp => gameloop(globalDict, timestamp));
}

function gameloop(gD, timestamp) {
  if (gD.currentPage !== null) {
  	gD.raf = requestAnimationFrame(timestamp => gameloop(gD, timestamp));

    gD.timeDiff = timestamp - gD.startTs; //time difference since last frame
    gD.lag += gD.timeDiff;                //total lag
  
    while (gD.lag > gD.refreshrate) {
      gD.currentPage.updateKeyPresses();
      gD.currentPage.updateMouseMoves();
      gD.currentPage.updateClicks();
      gD.currentPage.updateWheelMoves();
      gD.currentPage.update();

      gD.newKeys = [];
      gD.clicks = [];
      gD.wheelMovements = [];
    
      if (gD.lag > gD.refreshrate * 5) {
        gD.lag %= gD.refreshrate;
      } else {
        gD.lag -= gD.refreshrate;
      }
    }

    gD.clear();
    gD.currentPage.draw();
    gD.startTs = timestamp;
  }
}

function keydownEvent(event, gD) {
  gD.keys[event.code] = true;
  gD.newKeys.push(event.code);
  console.log(event.code);
}

function keyupEvent(event, gD) {
  gD.keys[event.code] = false;
}

function mousemoveEvent(event, gD) {
  gD.mousePos = {
    "x" : (event.clientX - gD.canvas.offsetLeft),
    "y" : (event.clientY - gD.canvas.offsetTop)
  };
}

function clickEvent(event, gD) {
  gD.clicks.push({
    "x" : (event.clientX - gD.canvas.offsetLeft),
    "y" : (event.clientY - gD.canvas.offsetTop)
  });
  console.log(gD.clicks);
}

function wheelEvent(event, gD) {
  gD.wheelMovement.push(event.deltaY);
}

function GlobalDict() {
  this.canvas = document.getElementById("gamearea");
  this.context = this.canvas.getContext("2d");
  this.keys = {};
  this.newKeys = [];
  this.mousePos = {"x": 0, "y": 0};
  this.clicks = [];
  this.wheelMovements = [];
  this.currentPage = null;                       //saves the current object, that should be displayed
  this.raf = null;
  this.startTs = 0;
  this.lag = 0;
  this.timeDiff = 0;
  this.refreshrate = 1000 / 60;
  this.muted = true;
  this.save = {};
  this.spritesheet = new Image();
  this.spritesheet.src = "img/Spritesheet.png";
  this.spriteDict = {                         //The numbers specify the x-pos, y-pos, width and height of the object
    "Pointer" : [1, 1, 10, 6],                //The B suffix marks a two times bigger version
    "Player_Standard" : [12, 1, 20, 20],
    "Player_Longjohn" : [33, 1, 14, 26],
    "Player_Speedy" : [48, 1, 14, 14],
    "Player_Magician" : [63, 1, 24, 14],
    "Player_Strooper" : [88, 1, 20, 20],
    "Player_Disgusty" : [109, 1, 25, 23],
    "Player_Afroman" : [135, 1, 24, 23],
    "Player_Standard_B" : [1, 28, 40, 40],
    "Player_Longjohn_B" : [42, 28, 28, 52],
    "Player_Speedy_B" : [71, 28, 28, 28],
    "Player_Magician_B" : [100, 28, 48, 28],
    "Player_Strooper_B" : [149, 28, 40, 40],
    "Player_Disgusty_B" : [190, 28, 50, 46],
    "Player_Afroman_B" : [241, 28, 48, 46],
    "Item_stopwatch" : [1, 81, 15, 19],
    "Item_star" : [17, 81, 18, 19],
    "Item_feather" : [36, 81, 16, 16],
    "Item_treasure" : [53, 81, 20, 13],
    "Item_magnet" : [74, 81, 17, 20],
    "Item_rocket" : [92, 81, 20, 18],
    "Item_stopwatch_B" : [1, 102, 30, 38],
    "Item_star_B" : [32, 102, 36, 38],
    "Item_feather_B" : [69, 102, 32, 32],
    "Item_treasure_B" : [102, 102, 40, 26],
    "Item_magnet_B" : [143, 102, 32, 40],
    "Item_rocket_B" : [176, 102, 40, 36],
    "Money1" : [1, 141, 30, 18],
    "Money2" : [32, 141, 30, 18],
    "Money3" : [63, 141, 30, 18],
    "Money4" : [94, 141, 30, 18],
    "Shamrock" : [247, 140, 15, 19],
    "Item_GoldenShamrock_0" : [125, 141, 15, 19],
    "Fireball" : [146, 146, 12, 12],
    "Plane1" : [222, 120, 32, 19],
    "Plane2" : [255, 120, 32, 19],
    "Plane3" : [222, 140, 32, 19],
    "Plane4" : [255, 140, 32, 19],
    "Rocket" : [291, 93, 20, 46],
    "Fish1" : [313, 100, 34, 19],
    "Fish2" : [313, 80, 34, 19],
    "Fish3" : [313, 60, 34, 19],
    "Fish4" : [313, 40, 34, 19],
    "Bird1F" : [224, 86, 27, 15],
    "Bird1B" : [252, 86, 27, 15],
    "Bird2F" : [224, 104, 27, 12],
    "Bird2B" : [252, 104, 27, 12],
    "Bubble1" : [313, 32, 7, 7],
    "Bubble2" : [321, 32, 5, 5],
    "Bubble3" : [327, 32, 3, 3],
    "Apple" : [348, 102, 19, 20],
    "Asteroid1" : [368, 102, 19, 20],
    "Asteroid2" : [368, 81, 19, 20],
    "Asteroid3" : [368, 60, 19, 20],
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
    "Reward36" : [206, 285, 40, 40],
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
    "Reward36B" : [820, 244, 80, 80],
    "Stage0" : [1, 327, 56, 26],
    "Stage1" : [58, 327, 56, 26],
    "Stage2" : [115, 327, 56, 26],
    "Stage3" : [172, 327, 56, 26],
    "Stage4" : [229, 327, 56, 26],
    "Stage5" : [286, 327, 56, 26],
    "Stage0B" : [1, 354, 112, 52],
    "Stage1B" : [114, 354, 112, 52],
    "Stage2B" : [227, 354, 112, 52],
    "Stage3B" : [340, 354, 112, 52],
    "Stage4B" : [453, 354, 112, 52],
    "Stage5B" : [566, 354, 112, 52],
    "Currency1" : [296, 151, 7, 9],
    "Currency2" : [304, 142, 14, 18],
    "Currency3" : [319, 133, 21, 27],
    "Currency4" : [341, 124, 28, 36],
    "Icon_Mute" : [387, 138, 24, 22],
    "Icon_Statistics" : [380, 16, 26, 20]
  };
  this.player = {                    //The data for the different playermodels with: jumps, jumpstrength, movementspeed right, movementspeed left, weight, unlocked
    "Player_Standard" : [2, -9, 3, -3, 45, true],
    "Player_Longjohn" : [2, -13.5, 3, -3, 42, false],
    "Player_Speedy" : [2, -9, 6, -6, 38, false],
    "Player_Magician" : [3, -9, 3, -3, 43, false],
    "Player_Strooper" : [2, -10.8, 4.5, -4.5, 45, false],
    "Player_Disgusty" : [3, -10.8, 3, -3, 52, false],
    "Player_Afroman" : [3, -10.8, 4.5, -4.5, 46, false]
  };
  this.items = {                     //probability for spawning, durability, durability per level, costs for level 1
    "Item_Stopwatch": [5, 120, 60, 800],
    "Item_Star": [1, 240, 120, 2999],
    "Item_Feather": [3, 360, 90, 1800],
    "Item_Treasure": [0.3, 12, 6, 4300],
    "Item_Magnet": [1.5, 240, 180, 3999],
    "Item_Rocket": [1, 100, 75, 4955]
  };
  this.money = {                     //probability, value
    "Money_1": [5, 1],
    "Money_10": [4, 10],
    "Money_100": [1, 100],
    "Money_1000": [0.05, 1000]
  };
  this.floors = {                    //probability
    "Floor_Standard": [5, "stagecolor"],
    "Floor_Jump": [1, "rgba(229, 149, 149, 1)"],
    "Floor_Fall": [0.8, "rgba(126, 186, 115, 1)"],
    "Floor_Spikes": [0.8, "rgba(173, 6, 6, 1)"],
    "Floor_Moving": [0.1, "stagecolor"]
  };
  this.stages = {                    /*/stage class reference, unlocked
    "Stage_Standard": [Stage0, true],
    "Stage_Fortress": [Stage1, true],
    "Stage_Air": [Stage2, false],
    "Stage_Water": [Stage3, false],
    "Stage_Forest": [Stage4, false],
    "Stage_Universe": [Stage5, false]*/
  };
  this.clear = function() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  };
}

/*function keydown(event, gD, menu) {
  gD.keys[event.keyCode] = true;  //dict for active keys
  console.log(event.keyCode);

  if (gD.gameIsRunning) {
    if (menu.controls.keyBindings["Mute1"][2].includes(event.keyCode)) {
      gD.muted = !gD.muted;
      if (menu.game.visible) {
        menu.game.backgroundMusic.muted = gD.muted;
        menu.game.endMusic.muted = gD.muted;
      } else if (menu.shop.visible) {
        menu.shop.backgroundMusic.muted = gD.muted;
      }
    }

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
}

function keyup(event, gD, menu) {
  try {
    gD.keys[event.keyCode] = false;
  } catch (err) {
    console.log(err.message);
  }

  if (gD.gameIsRunning) {
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
}

function mousemove(event, gD, menu) {
  gD.mousePos = {
    "x" : (event.pageX - gD.canvas.offsetLeft), 
    "y" : (event.pageY - gD.canvas.offsetTop)
  };
  if (gD.gameIsRunning) {
    if (menu.visible) {
      menuMouseMove(menu);
    } else if (menu.selectionScreen.visible) {
      selectionScreenMouseMove(menu.selectionScreen);
    } else if (menu.game.visible) {
      gameMouseMove(menu.game);
    } else if (menu.shop.visible) {
      shopMouseMove(menu.shop);
    } else if (menu.achievements.visible) {
      achievementsMouseMove(menu.achievements);
    } else if (menu.save.visible) {
      saveMouseMove(menu.save);
    } else if (menu.load.visible) {
      loadMouseMove(menu.load);
    } else if (menu.highscores.visible) {
      highscoresMouseMove(menu.highscores);
    } else if (menu.controls.visible) {
      controlsMouseMove(menu.controls);
    }
  }
}

function click(event, gD, menu) {
  if (gD.gameIsRunning) {
    if (menu.visible) {
      menuClick(menu);
    } else if (menu.selectionScreen.visible) {
      selectionScreenClick(menu.selectionScreen);
    } else if (menu.game.visible) {
      gameClick(menu.game);
    } else if (menu.shop.visible) {
      shopClick(menu.shop);
    } else if (menu.achievements.visible) {
      achievementsClick(menu.achievements);
    } else if (menu.save.visible) {
      saveClick(menu.save);
    } else if (menu.load.visible) {
      loadClick(menu.load);
    } else if (menu.highscores.visible) {
      highscoresClick(menu.highscores);
    } else if (menu.controls.visible) {
      controlsClick(menu.controls);
    }
  }
}

function wheel(event, gD, menu) {
  if (gD.gameIsRunning) {
    if (menu.visible) {
      menuWheel(menu, event);
    } else if (menu.selectionScreen.visible) {
      selectionScreenWheel(menu.selectionScreen, event);
    } else if (menu.game.visible) {
      gameWheel(menu.game, event);
    } else if (menu.shop.visible) {
      shopWheel(menu.shop, event);
    } else if (menu.achievements.visible) {
      achievementsWheel(menu.achievements, event);
    } else if (menu.save.visible) {
      saveWheel(menu.save, event);
    } else if (menu.load.visible) {
      loadWheel(menu.load, event);
    } else if (menu.highscores.visible) {
      highscoresWheel(menu.highscores, event);
    } else if (menu.controls.visible) {
      controlsWheel(menu.controls, event);
    }
  }
  console.log(event.deltaY);
}*/