function main() {
  var globalDict = new GlobalDict(new EventHandler());
  var menu = new Menu(globalDict);
  window.addEventListener('keydown', event => keydownEvent(event, globalDict));
  window.addEventListener('keyup', event => keyupEvent(event, globalDict));
  window.addEventListener('mousemove', event => mousemoveEvent(event, globalDict));
  window.addEventListener('click', event => clickEvent(event, globalDict));
  window.addEventListener('wheel', event => wheelEvent(event, globalDict));
  globalDict.currentPage = menu;
  menu.init();
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
      gD.currentPage.updateClick();
      gD.currentPage.updateWheelMoves();
      gD.currentPage.update();

      gD.newKeys = [];
      gD.events = [];
      gD.clicks = [];
      gD.wheelMovements = [];
    
      if (gD.lag > gD.refreshrate * 5) {
        gD.lag %= gD.refreshrate;
      } else {
        gD.lag -= gD.refreshrate;
      }
    }

    gD.clear();
    gD.currentPage.draw(gD.lag / gD.refreshrate);
    gD.startTs = timestamp;
  }
}

function keydownEvent(event, gD) {
  gD.keys[event.code] = true;
  gD.newKeys.push(event.code);
  gD.events.push(event);
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
}

function wheelEvent(event, gD) {
  gD.wheelMovements.push(event.deltaY);
}

function GlobalDict(eventHandler) {
  this.eventHandler = eventHandler;
  this.canvas = document.getElementById("gamearea");
  this.context = this.canvas.getContext("2d");
  this.keys = {};
  this.newKeys = [];
  this.events = [];
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
  // start spriteDict
  // The following code is auto-generated, don't change it!
  /**
   * Maps a Sprite-Key to Location Information regarding the Sprite-Sheet
   * @type {Object.<string, Array<number>>} with the array's contents being: x-pos, y-pos, width, height
   */
  this.spriteDict = {
    "Currency_1": [0, 0, 7, 9],
    "Currency_2": [0, 10, 14, 18],
    "Currency_3": [0, 29, 21, 27],
    "Currency_4": [0, 57, 28, 36],
    "Deco_Bubble_0": [29, 0, 7, 7],
    "Deco_Bubble_1": [29, 8, 5, 5],
    "Deco_Bubble_2": [29, 14, 3, 3],
    "Enemy_Apple": [37, 0, 19, 20],
    "Enemy_Fireball": [37, 21, 12, 12],
    "Enemy_Airplane_0": [37, 34, 32, 19],
    "Enemy_Airplane_1": [37, 54, 32, 19],
    "Enemy_Airplane_2": [37, 74, 32, 19],
    "Enemy_Airplane_3": [37, 94, 32, 19],
    "Enemy_Asteroid_0": [37, 114, 19, 20],
    "Enemy_Asteroid_1": [37, 135, 19, 20],
    "Enemy_Asteroid_2": [37, 156, 19, 20],
    "Enemy_Bird_Left_0": [37, 177, 27, 15],
    "Enemy_Bird_Left_1": [37, 193, 27, 12],
    "Enemy_Bird_Right_0": [37, 206, 27, 15],
    "Enemy_Bird_Right_1": [37, 222, 27, 12],
    "Enemy_Fish_0": [37, 235, 34, 19],
    "Enemy_Fish_1": [37, 255, 34, 19],
    "Enemy_Fish_2": [37, 275, 34, 19],
    "Enemy_Fish_3": [37, 295, 34, 19],
    "Enemy_Rocket_0": [37, 315, 20, 46],
    "Enemy_Rocket_1": [37, 362, 20, 46],
    "Enemy_Rocket_2": [37, 409, 20, 46],
    "Icon_KeyLong": [72, 0, 68, 17],
    "Icon_KeyShort": [72, 18, 16, 17],
    "Icon_Mute": [72, 36, 24, 22],
    "Icon_Refresh": [72, 59, 26, 27],
    "Item_Feather_0": [141, 0, 16, 20],
    "Item_Feather_1": [141, 21, 16, 20],
    "Item_Feather_2": [141, 42, 16, 20],
    "Item_Feather_3": [141, 63, 16, 20],
    "Item_Feather_4": [141, 84, 16, 20],
    "Item_Feather_5": [141, 105, 16, 20],
    "Item_Feather_6": [141, 126, 16, 20],
    "Item_Feather_7": [141, 147, 16, 20],
    "Item_Magnet_0": [141, 168, 17, 20],
    "Item_Magnet_1": [141, 189, 17, 20],
    "Item_Magnet_2": [141, 210, 17, 20],
    "Item_Magnet_3": [141, 231, 17, 20],
    "Item_Magnet_4": [141, 252, 17, 20],
    "Item_Magnet_5": [141, 273, 17, 20],
    "Item_Magnet_6": [141, 294, 17, 20],
    "Item_Magnet_7": [141, 315, 17, 20],
    "Item_Rocket_0": [141, 336, 20, 14],
    "Item_Rocket_1": [141, 351, 20, 14],
    "Item_Rocket_2": [141, 366, 20, 14],
    "Item_Rocket_3": [141, 381, 20, 14],
    "Item_Rocket_4": [141, 396, 20, 14],
    "Item_Rocket_5": [141, 411, 20, 14],
    "Item_Rocket_6": [141, 426, 20, 14],
    "Item_Rocket_7": [141, 441, 20, 14],
    "Item_Star_0": [141, 456, 18, 19],
    "Item_Star_1": [141, 476, 18, 19],
    "Item_Star_2": [141, 496, 18, 19],
    "Item_Star_3": [141, 516, 18, 19],
    "Item_Star_4": [141, 536, 18, 19],
    "Item_Star_5": [141, 556, 18, 19],
    "Item_Star_6": [141, 576, 18, 19],
    "Item_Star_7": [141, 596, 18, 19],
    "Item_Stopwatch_0": [141, 616, 15, 19],
    "Item_Stopwatch_1": [141, 636, 15, 19],
    "Item_Stopwatch_2": [141, 656, 15, 19],
    "Item_Stopwatch_3": [141, 676, 15, 19],
    "Item_Stopwatch_4": [141, 696, 15, 19],
    "Item_Stopwatch_5": [141, 716, 15, 19],
    "Item_Stopwatch_6": [141, 736, 15, 19],
    "Item_Stopwatch_7": [141, 756, 15, 19],
    "Item_Treasure_0": [141, 776, 20, 13],
    "Item_Treasure_1": [141, 790, 20, 13],
    "Item_Treasure_2": [141, 804, 20, 13],
    "Item_Treasure_3": [141, 818, 20, 13],
    "Item_Treasure_4": [141, 832, 20, 13],
    "Item_Treasure_5": [141, 846, 20, 13],
    "Item_Treasure_6": [141, 860, 20, 13],
    "Item_Treasure_7": [141, 874, 20, 13],
    "Item_B_Feather_0": [162, 0, 32, 40],
    "Item_B_Feather_1": [162, 41, 32, 40],
    "Item_B_Feather_2": [162, 82, 32, 40],
    "Item_B_Feather_3": [162, 123, 32, 40],
    "Item_B_Feather_4": [162, 164, 32, 40],
    "Item_B_Feather_5": [162, 205, 32, 40],
    "Item_B_Feather_6": [162, 246, 32, 40],
    "Item_B_Feather_7": [162, 287, 32, 40],
    "Item_B_Magnet_0": [162, 328, 34, 40],
    "Item_B_Magnet_1": [162, 369, 34, 40],
    "Item_B_Magnet_2": [162, 410, 34, 40],
    "Item_B_Magnet_3": [162, 451, 34, 40],
    "Item_B_Magnet_4": [162, 492, 34, 40],
    "Item_B_Magnet_5": [162, 533, 34, 40],
    "Item_B_Magnet_6": [162, 574, 34, 40],
    "Item_B_Magnet_7": [162, 615, 34, 40],
    "Item_B_Rocket_0": [162, 656, 40, 28],
    "Item_B_Rocket_1": [162, 685, 40, 28],
    "Item_B_Rocket_2": [162, 714, 40, 28],
    "Item_B_Rocket_3": [162, 743, 40, 28],
    "Item_B_Rocket_4": [162, 772, 40, 28],
    "Item_B_Rocket_5": [162, 801, 40, 28],
    "Item_B_Rocket_6": [162, 830, 40, 28],
    "Item_B_Rocket_7": [162, 859, 40, 28],
    "Item_B_Star_0": [162, 888, 36, 38],
    "Item_B_Star_1": [162, 927, 36, 38],
    "Item_B_Star_2": [162, 966, 36, 38],
    "Item_B_Star_3": [162, 1005, 36, 38],
    "Item_B_Star_4": [162, 1044, 36, 38],
    "Item_B_Star_5": [162, 1083, 36, 38],
    "Item_B_Star_6": [162, 1122, 36, 38],
    "Item_B_Star_7": [162, 1161, 36, 38],
    "Item_B_Stopwatch_0": [162, 1200, 30, 38],
    "Item_B_Stopwatch_1": [162, 1239, 30, 38],
    "Item_B_Stopwatch_2": [162, 1278, 30, 38],
    "Item_B_Stopwatch_3": [162, 1317, 30, 38],
    "Item_B_Stopwatch_4": [162, 1356, 30, 38],
    "Item_B_Stopwatch_5": [162, 1395, 30, 38],
    "Item_B_Stopwatch_6": [162, 1434, 30, 38],
    "Item_B_Stopwatch_7": [162, 1473, 30, 38],
    "Item_B_Treasure_0": [162, 1512, 40, 26],
    "Item_B_Treasure_1": [162, 1539, 40, 26],
    "Item_B_Treasure_2": [162, 1566, 40, 26],
    "Item_B_Treasure_3": [162, 1593, 40, 26],
    "Item_B_Treasure_4": [162, 1620, 40, 26],
    "Item_B_Treasure_5": [162, 1647, 40, 26],
    "Item_B_Treasure_6": [162, 1674, 40, 26],
    "Item_B_Treasure_7": [162, 1701, 40, 26],
    "Money_1_0": [203, 0, 30, 18],
    "Money_1_1": [203, 19, 30, 18],
    "Money_1_2": [203, 38, 30, 18],
    "Money_1_3": [203, 57, 30, 18],
    "Money_1_4": [203, 76, 30, 18],
    "Money_1_5": [203, 95, 30, 18],
    "Money_1_6": [203, 114, 30, 18],
    "Money_10_0": [203, 133, 30, 18],
    "Money_10_1": [203, 152, 30, 18],
    "Money_10_2": [203, 171, 30, 18],
    "Money_10_3": [203, 190, 30, 18],
    "Money_10_4": [203, 209, 30, 18],
    "Money_10_5": [203, 228, 30, 18],
    "Money_10_6": [203, 247, 30, 18],
    "Money_100_0": [203, 266, 30, 18],
    "Money_100_1": [203, 285, 30, 18],
    "Money_100_2": [203, 304, 30, 18],
    "Money_100_3": [203, 323, 30, 18],
    "Money_100_4": [203, 342, 30, 18],
    "Money_100_5": [203, 361, 30, 18],
    "Money_100_6": [203, 380, 30, 18],
    "Money_1000_0": [203, 399, 30, 18],
    "Money_1000_1": [203, 418, 30, 18],
    "Money_1000_2": [203, 437, 30, 18],
    "Money_1000_3": [203, 456, 30, 18],
    "Money_1000_4": [203, 475, 30, 18],
    "Money_1000_5": [203, 494, 30, 18],
    "Money_1000_6": [203, 513, 30, 18],
    "Money_S_1": [234, 0, 15, 9],
    "Money_S_10": [234, 10, 15, 9],
    "Money_S_100": [234, 20, 15, 9],
    "Money_S_1000": [234, 30, 15, 9],
    "Player_Afroman": [250, 0, 24, 23],
    "Player_Disgusty": [250, 24, 25, 23],
    "Player_Longjohn": [250, 48, 14, 26],
    "Player_Magician": [250, 75, 24, 14],
    "Player_Speedy": [250, 90, 14, 14],
    "Player_Standard": [250, 105, 20, 20],
    "Player_Strooper": [250, 126, 20, 20],
    "Player_B_Afroman": [276, 0, 48, 46],
    "Player_B_Disgusty": [276, 47, 50, 46],
    "Player_B_Longjohn": [276, 94, 28, 52],
    "Player_B_Magician": [276, 147, 48, 28],
    "Player_B_Speedy": [276, 176, 28, 28],
    "Player_B_Standard": [276, 205, 40, 40],
    "Player_B_Strooper": [276, 246, 40, 40],
    "Reward_100_jumps_out_of_bounds": [327, 0, 40, 40],
    "Reward_collect_100_golden_shamrocks": [327, 41, 40, 40],
    "Reward_collect_24000_hype": [327, 82, 40, 40],
    "Reward_collect_first_1000_hype": [327, 123, 40, 40],
    "Reward_collect_first_golden_shamrock": [327, 164, 40, 40],
    "Reward_collect_first_hype": [327, 205, 40, 40],
    "Reward_collect_first_treasure": [327, 246, 40, 40],
    "Reward_die_1000": [327, 287, 40, 40],
    "Reward_locked": [327, 328, 40, 40],
    "Reward_B_100_jumps_out_of_bounds": [368, 0, 80, 80],
    "Reward_B_collect_100_golden_shamrocks": [368, 81, 80, 80],
    "Reward_B_collect_24000_hype": [368, 162, 80, 80],
    "Reward_B_collect_first_1000_hype": [368, 243, 80, 80],
    "Reward_B_collect_first_golden_shamrock": [368, 324, 80, 80],
    "Reward_B_collect_first_hype": [368, 405, 80, 80],
    "Reward_B_collect_first_treasure": [368, 486, 80, 80],
    "Reward_B_die_1000": [368, 567, 80, 80],
    "Reward_B_locked": [368, 648, 80, 80],
    "Special_Placeholder": [449, 0, 40, 40],
    "Special_Placeholder_B": [449, 41, 80, 80],
    "Special_Pointer": [449, 122, 10, 6],
    "Special_GoldenShamrock_0": [449, 129, 15, 19],
    "Special_GoldenShamrock_1": [449, 149, 15, 19],
    "Special_GoldenShamrock_2": [449, 169, 15, 19],
    "Special_GoldenShamrock_3": [449, 189, 15, 19],
    "Special_GoldenShamrock_4": [449, 209, 15, 19],
    "Special_GoldenShamrock_5": [449, 229, 15, 19],
    "Special_GoldenShamrock_6": [449, 249, 15, 19],
    "Special_GoldenShamrock_7": [449, 269, 15, 19],
    "Stagepreview_Air": [530, 0, 56, 26],
    "Stagepreview_Forest": [530, 27, 56, 26],
    "Stagepreview_Fortress": [530, 54, 56, 26],
    "Stagepreview_Standard": [530, 81, 56, 26],
    "Stagepreview_Universe": [530, 108, 56, 26],
    "Stagepreview_Water": [530, 135, 56, 26],
    "Stagepreview_B_Air": [587, 0, 112, 52],
    "Stagepreview_B_Forest": [587, 53, 112, 52],
    "Stagepreview_B_Fortress": [587, 106, 112, 52],
    "Stagepreview_B_Standard": [587, 159, 112, 52],
    "Stagepreview_B_Universe": [587, 212, 112, 52],
    "Stagepreview_B_Water": [587, 265, 112, 52]
  };
  // end spriteDict
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
  this.design = {
    elements: {
      controlsHeadline: {
        rectKey: "headline",
        textKey: "normalBold",
        borderKey: "standard"
      },
      controlsEntry: {
        rectKey: {
          standard: "blur",
          selected: "selected"
        },
        textKey: {
          name: "enterNameModal",
          key: "verySmall"
        }
      },
      savestate: {
        rectKey: {
          standard: "blur",
          selected: "selected",
          marked: "marked"
        },
        textKey: "savestate",
        borderKey: "standard"
      },
      savestateDetails: {
        rectKey: "standard",
        textKey: "savestate",
        borderKey: "standard"
      },
      highscoresHeadline: {
        rectKey: "headline",
        textKey: "normalBold",
        borderKey: "standard"
      },
      highscoresEntry: {
        rectKey: {
          standard: "blur",
          selected: "selected"
        },
        textKey: {
          number: "highscoreNumber",
          name: "enterNameModal"
        },
        borderKey: "standard"
      },
      highscoresDetails: {
        rectKey: "standard",
        textKey: "savestate",
        borderKey: "standard"
      },
      enterNameModal: {
        rectKey: {
          modal: "modal",
          background: "blur",
          textField: "standard"
        },
        textKey: {
          label: "normal",
          textField: "enterNameModal"
        },
        borderKey: {
          background: "standard",
          textField: "standard"
        },
        cursorKey: "standard"
      },
      choosePictureModal: {
        rectKey: {
          modal: "modal",
          background: "blur"
        },
        buttonKey: "standardImage",
        textKey: "normal",
        borderKey: {
          background: "standard"
        }
      },
      scrollBarStandard: {
        lineKey: "smallWhite",
        barKey: "bigWhite"
      },
      statisticsTab: {
        rectKey: {
          tab: "blur",
          background: "blur",
          inactive: "modal"
        },
        borderKey: "standard"
      },
      moneyBar: {
        rectKey: {
          background: "standard",
          moneyPositive: "moneyPositive",
          moneyNegative: "moneyNegative",
          money1: "money1",
          money10: "money10",
          money100: "money100",
          money1000: "money1000",
          bonus: "bonus"
        },
        textKey: "small",
        borderKey: "standard"
      },
      moneyPositive: {
        rectKey: "moneyPositive",
        textKey: {
          label: "enterNameModal",
          number: "value"
        },
        borderKey: "standard"
      },
      moneyNegative: {
        rectKey: "moneyNegative",
        textKey: {
          label: "enterNameModal",
          number: "value"
        },
        borderKey: "standard"
      },
      statisticsMoney1: {
        rectKey: "money1",
        textKey: {
          label: "enterNameModal",
          number: "value"
        },
        borderKey: "standard"
      },
      statisticsMoney10: {
        rectKey: "money10",
        textKey: {
          label: "enterNameModal",
          number: "value"
        },
        borderKey: "standard"
      },
      statisticsMoney100: {
        rectKey: "money100",
        textKey: {
          label: "enterNameModal",
          number: "value"
        },
        borderKey: "standard"
      },
      statisticsMoney1000: {
        rectKey: "money1000",
        textKey: {
          label: "enterNameModal",
          number: "value"
        },
        borderKey: "standard"
      },
      statisticsMoneyBonus: {
        rectKey: "bonus",
        textKey: {
          label: "enterNameModal",
          number: "value"
        },
        borderKey: "standard"
      }
    },
    button: {
      menu: {
        rectKey: {
          standard: "standard",
          selected: "selected"
        },
        textKey: "menuButton",
        borderKey: "standard"
      },
      standardImage: {
        rectKey: {
          standard: "standard",
          selected: "selected"
        },
        borderKey: "standard"
      }
    },
    rect: {
      standard: {
        backgroundColor: "255, 255, 255, 1"
      },
      selected: {
        backgroundColor: "180, 50, 50, 1"
      },
      marked: {
        backgroundColor: "180, 160, 50, 0.6"
      },
      blur: {
        backgroundColor: "255, 255, 255, 0.7"
      },
      modal: {
        backgroundColor: "44, 47, 51, 0.6"
      },
      headline: {
        backgroundColor: "50, 200, 80, 1"
      },
      progress: {
        backgroundColor: "0, 129, 57, 0.9"
      },
      money1: {
        backgroundColor: "255, 127, 39, 1"
      },
      money10: {
        backgroundColor: "184, 61, 186, 1"
      },
      money100: {
        backgroundColor: "14, 209, 69, 1"
      },
      money1000: {
        backgroundColor: "255, 242, 0, 1"
      },
      bonus: {
        backgroundColor: "30, 180, 198, 1"
      },
      moneyPositive: {
        backgroundColor: "150, 230, 150, 1"
      },
      moneyNegative: {
        backgroundColor: "230, 150, 150, 1"
      }
    },
    circle: {
      standard: {
        backgroundColor: "0, 255, 255, 1"
      },
      money1: {
        backgroundColor: "255, 127, 39, 1"
      },
      money10: {
        backgroundColor: "184, 61, 186, 1"
      },
      money100: {
        backgroundColor: "14, 209, 69, 1"
      },
      money1000: {
        backgroundColor: "255, 242, 0, 1"
      },
      bonus: {
        backgroundColor: "30, 180, 198, 1"
      }
    },
    border: {
      standard: {
        borderColor: "0, 0, 0, 1",
        borderSize: 2
      },
      selected: {
        borderColor: "180, 50, 50, 1",
        borderSize: 2
      },
      small: {
        borderColor: "0, 0, 0, 1",
        borderSize: 1.5
      },
      verySmall: {
        borderColor: "0, 0, 0, 1",
        borderSize: 0.5
      },
      big: {
        borderColor: "0, 0, 0, 1",
        borderSize: 3
      },
      smallWhite: {
        borderColor: "255, 255, 255, 1",
        borderSize: 1
      },
      bigWhite: {
        borderColor: "255, 255, 255, 1",
        borderSize: 4
      }
    },
    text: {
      normal: {
        font: "12pt Consolas",
        color: "0, 0, 0, 1",
        align: "center",
        baseline: "middle",
        borderKey: ""
      },
      normalBold: {
        font: "bold 12pt Consolas",
        color: "0, 0, 0, 1",
        align: "center",
        baseline: "middle",
        borderKey: ""
      },
      menuButton: {
        font: "15pt Showcard Gothic, Impact",
        color: "0, 0, 0, 0.6",
        align: "center",
        baseline: "middle",
        borderKey: ""
      },
      savestate: {
        font: "10pt Consolas",
        color: "0, 0, 0, 1",
        align: "left",
        baseline: "middle",
        borderKey: ""
      },
      enterNameModal: {
        font: "12pt Consolas",
        color: "0, 0, 0, 1",
        align: "left",
        baseline: "middle",
        borderKey: ""
      },
      highscoreNumber: {
        font: "12pt Consolas",
        color: "0, 0, 0, 1",
        align: "right",
        baseline: "middle",
        borderKey: ""
      },
      small: {
        font: "10pt Consolas",
        color: "0, 0, 0, 1",
        align: "center",
        baseline: "middle",
        borderKey: ""
      },
      verySmall: {
        font: "9pt Consolas",
        color: "0, 0, 0, 1",
        align: "center",
        baseline: "middle",
        borderKey: ""
      },
      value: {
        font: "10pt Consolas",
        color: "0, 0, 0, 1",
        align: "right",
        baseline: "alphabetic",
        borderKey: ""
      },
      valueBig: {
        font: "15pt Consolas",
        color: "0, 0, 0, 1",
        align: "right",
        baseline: "alphabetic",
        borderKey: ""
      },
      big: {
        font: "15pt Consolas",
        color: "0, 0, 0, 1",
        align: "left",
        baseline: "middle",
        borderKey: ""
      },
      percent: {
        font: "10pt Consolas",
        color: "0, 0, 0, 1",
        align: "right",
        baseline: "middle",
        borderKey: ""
      },
      title: {
        font: "40pt Showcard Gothic, Impact",
        color: "200, 200, 200, 1",
        align: "center",
        baseline: "middle",
        borderKey: "big"
      },
      pageTitle: {
        font: "32pt Showcard Gothic, Impact",
        color: "200, 200, 200, 1",
        align: "center",
        baseline: "middle",
        borderKey: "standard"
      },
      instruction: {
        font: "15pt Showcard Gothic, Impact",
        color: "200, 200, 200, 1",
        align: "center",
        baseline: "middle",
        borderKey: "small"
      },
      version: {
        font: "10pt Consolas",
        color: "255, 255, 255, 1",
        align: "right",
        baseline: "alphabetic",
        borderKey: ""
      },
      rainbow: {
        font: "12pt Arial",
        color: [
          "200, 0, 0, 1",
          "200, 100, 0, 1",
          "200, 200, 0, 1",
          "100, 200, 0, 1",
          "0, 200, 0, 1",
          "0, 200, 100, 1",
          "0, 200, 200, 1",
          "0, 100, 200, 1",
          "0, 0, 200, 1",
          "100, 0, 200, 1",
          "200, 0, 200, 1",
          "200, 0, 100, 1"
        ],
        align: "center",
        baseline: "middle",
        borderKey: ""
      },
      rainbowLeft: {
        font: "12pt Consolas",
        color: [
          "200, 0, 0, 1",
          "200, 100, 0, 1",
          "200, 200, 0, 1",
          "100, 200, 0, 1",
          "0, 200, 0, 1",
          "0, 200, 100, 1",
          "0, 200, 200, 1",
          "0, 100, 200, 1",
          "0, 0, 200, 1",
          "100, 0, 200, 1",
          "200, 0, 200, 1",
          "200, 0, 100, 1"
        ],
        align: "left",
        baseline: "middle",
        borderKey: ""
      }
    }
  };
  this.clear = function() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  };
}