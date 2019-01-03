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
   * Maps a Sprite-Key to Location Information regarding the Sprite-Sheet as a key-value-dict.
   * @type {Object.<string, [boolean, number, number|Array<number>, number, number]>}
   * Each value's array has the contents: isAnimated, x-pos, y-pos, width, height.
   * If isAnimated is true, y-pos is an array, otherwise just a single number.
   */
  this.spriteDict = {
    "Currency_L": [false, 0, 0, 28, 36],
    "Currency_M": [false, 0, 37, 21, 27],
    "Currency_S": [false, 0, 65, 14, 18],
    "Currency_XS": [false, 0, 84, 7, 9],
    "Deco_Bubble_L": [false, 29, 0, 7, 7],
    "Deco_Bubble_M": [false, 29, 8, 5, 5],
    "Deco_Bubble_S": [false, 29, 14, 3, 3],
    "Enemy_Apple": [false, 37, 0, 19, 20],
    "Enemy_Fireball": [false, 37, 21, 12, 12],
    "Enemy_Rocket": [true, 37, [34, 81, 128], 20, 46],
    "Enemy_Airplane_Blue": [false, 37, 175, 32, 19],
    "Enemy_Airplane_Green": [false, 37, 195, 32, 19],
    "Enemy_Airplane_Purple": [false, 37, 215, 32, 19],
    "Enemy_Airplane_Red": [false, 37, 235, 32, 19],
    "Enemy_Asteroid_Ice": [false, 37, 255, 19, 20],
    "Enemy_Asteroid_Lava": [false, 37, 276, 19, 20],
    "Enemy_Asteroid_Stone": [false, 37, 297, 19, 20],
    "Enemy_Bird_Left": [true, 37, [318, 337], 27, 18],
    "Enemy_Bird_Right": [true, 37, [356, 375], 27, 18],
    "Enemy_Fish_Blue": [false, 37, 394, 34, 19],
    "Enemy_Fish_Green": [false, 37, 414, 34, 19],
    "Enemy_Fish_Nemo": [false, 37, 434, 34, 19],
    "Enemy_Fish_Red": [false, 37, 454, 34, 19],
    "Icon_KeyLong": [false, 72, 0, 68, 17],
    "Icon_KeyShort": [false, 72, 18, 16, 17],
    "Icon_Mute": [false, 72, 36, 24, 22],
    "Icon_Refresh": [false, 72, 59, 26, 27],
    "Item_Feather": [true, 141, [0, 21, 42, 63, 84, 105, 126, 147], 16, 20],
    "Item_Magnet": [true, 141, [168, 189, 210, 231, 252, 273, 294, 315], 17, 20],
    "Item_Questionmark": [true, 141, [336, 355, 374, 393, 412, 431, 450, 469], 14, 18],
    "Item_Rocket": [true, 141, [488, 503, 518, 533, 548, 563, 578, 593], 20, 14],
    "Item_Star": [true, 141, [608, 628, 648, 668, 688, 708, 728, 748], 18, 19],
    "Item_Stopwatch": [true, 141, [768, 788, 808, 828, 848, 868, 888, 908], 15, 19],
    "Item_Treasure": [true, 141, [928, 942, 956, 970, 984, 998, 1012, 1026], 20, 13],
    "Item_B_Feather": [true, 162, [0, 41, 82, 123, 164, 205, 246, 287], 32, 40],
    "Item_B_Magnet": [true, 162, [328, 369, 410, 451, 492, 533, 574, 615], 34, 40],
    "Item_B_Questionmark": [true, 162, [656, 693, 730, 767, 804, 841, 878, 915], 28, 36],
    "Item_B_Rocket": [true, 162, [952, 981, 1010, 1039, 1068, 1097, 1126, 1155], 40, 28],
    "Item_B_Star": [true, 162, [1184, 1223, 1262, 1301, 1340, 1379, 1418, 1457], 36, 38],
    "Item_B_Stopwatch": [true, 162, [1496, 1535, 1574, 1613, 1652, 1691, 1730, 1769], 30, 38],
    "Item_B_Treasure": [true, 162, [1808, 1835, 1862, 1889, 1916, 1943, 1970, 1997], 40, 26],
    "Money_1": [true, 203, [0, 19, 38, 57, 76, 95, 114], 30, 18],
    "Money_10": [true, 203, [133, 152, 171, 190, 209, 228, 247], 30, 18],
    "Money_100": [true, 203, [266, 285, 304, 323, 342, 361, 380], 30, 18],
    "Money_1000": [true, 203, [399, 418, 437, 456, 475, 494, 513], 30, 18],
    "Money_S_1": [false, 234, 0, 15, 9],
    "Money_S_10": [false, 234, 10, 15, 9],
    "Money_S_100": [false, 234, 20, 15, 9],
    "Money_S_1000": [false, 234, 30, 15, 9],
    "Player_Afroman": [false, 250, 0, 24, 23],
    "Player_Disgusty": [false, 250, 24, 25, 23],
    "Player_Longjohn": [false, 250, 48, 14, 26],
    "Player_Magician": [false, 250, 75, 24, 14],
    "Player_Speedy": [false, 250, 90, 14, 14],
    "Player_Standard": [false, 250, 105, 20, 20],
    "Player_Strooper": [false, 250, 126, 20, 20],
    "Player_B_Afroman": [false, 276, 0, 48, 46],
    "Player_B_Disgusty": [false, 276, 47, 50, 46],
    "Player_B_Longjohn": [false, 276, 94, 28, 52],
    "Player_B_Magician": [false, 276, 147, 48, 28],
    "Player_B_Speedy": [false, 276, 176, 28, 28],
    "Player_B_Standard": [false, 276, 205, 40, 40],
    "Player_B_Strooper": [false, 276, 246, 40, 40],
    "Reward_100_jumps_out_of_bounds": [false, 327, 0, 40, 40],
    "Reward_collect_100_golden_shamrocks": [false, 327, 41, 40, 40],
    "Reward_collect_24000_hype": [false, 327, 82, 40, 40],
    "Reward_collect_25_golden_shamrocks": [false, 327, 123, 40, 40],
    "Reward_collect_50_golden_shamrocks": [false, 327, 164, 40, 40],
    "Reward_collect_first_1000_hype": [false, 327, 205, 40, 40],
    "Reward_collect_first_golden_shamrock": [false, 327, 246, 40, 40],
    "Reward_collect_first_hype": [false, 327, 287, 40, 40],
    "Reward_collect_first_treasure": [false, 327, 328, 40, 40],
    "Reward_die_1000": [false, 327, 369, 40, 40],
    "Reward_locked": [false, 327, 410, 40, 40],
    "Reward_slow_1_hour": [false, 327, 451, 40, 40],
    "Reward_use_all_items_at_once": [false, 327, 492, 40, 40],
    "Reward_use_first_double_jump": [false, 327, 533, 40, 40],
    "Reward_use_five_feathers": [false, 327, 574, 40, 40],
    "Reward_use_five_magnets": [false, 327, 615, 40, 40],
    "Reward_use_five_rockets": [false, 327, 656, 40, 40],
    "Reward_use_five_stars": [false, 327, 697, 40, 40],
    "Reward_use_five_stopwatches": [false, 327, 738, 40, 40],
    "Reward_use_five_treasures": [false, 327, 779, 40, 40],
    "Reward_B_100_jumps_out_of_bounds": [false, 368, 0, 80, 80],
    "Reward_B_collect_100_golden_shamrocks": [false, 368, 81, 80, 80],
    "Reward_B_collect_24000_hype": [false, 368, 162, 80, 80],
    "Reward_B_collect_25_golden_shamrocks": [false, 368, 243, 80, 80],
    "Reward_B_collect_50_golden_shamrocks": [false, 368, 324, 80, 80],
    "Reward_B_collect_first_1000_hype": [false, 368, 405, 80, 80],
    "Reward_B_collect_first_golden_shamrock": [false, 368, 486, 80, 80],
    "Reward_B_collect_first_hype": [false, 368, 567, 80, 80],
    "Reward_B_collect_first_treasure": [false, 368, 648, 80, 80],
    "Reward_B_die_1000": [false, 368, 729, 80, 80],
    "Reward_B_locked": [false, 368, 810, 80, 80],
    "Reward_B_slow_1_hour": [false, 368, 891, 80, 80],
    "Reward_B_use_all_items_at_once": [false, 368, 972, 80, 80],
    "Reward_B_use_first_double_jump": [false, 368, 1053, 80, 80],
    "Reward_B_use_five_feathers": [false, 368, 1134, 80, 80],
    "Reward_B_use_five_magnets": [false, 368, 1215, 80, 80],
    "Reward_B_use_five_rockets": [false, 368, 1296, 80, 80],
    "Reward_B_use_five_stars": [false, 368, 1377, 80, 80],
    "Reward_B_use_five_stopwatches": [false, 368, 1458, 80, 80],
    "Reward_B_use_five_treasures": [false, 368, 1539, 80, 80],
    "Special_GoldenShamrock": [true, 449, [0, 20, 40, 60, 80, 100, 120, 140], 15, 19],
    "Special_Placeholder": [false, 449, 160, 40, 40],
    "Special_Placeholder_B": [false, 449, 201, 80, 80],
    "Special_Pointer": [false, 449, 282, 10, 6],
    "Stagepreview_Air": [false, 530, 0, 56, 26],
    "Stagepreview_Forest": [false, 530, 27, 56, 26],
    "Stagepreview_Fortress": [false, 530, 54, 56, 26],
    "Stagepreview_Standard": [false, 530, 81, 56, 26],
    "Stagepreview_Universe": [false, 530, 108, 56, 26],
    "Stagepreview_Water": [false, 530, 135, 56, 26],
    "Stagepreview_B_Air": [false, 587, 0, 112, 52],
    "Stagepreview_B_Forest": [false, 587, 53, 112, 52],
    "Stagepreview_B_Fortress": [false, 587, 106, 112, 52],
    "Stagepreview_B_Standard": [false, 587, 159, 112, 52],
    "Stagepreview_B_Universe": [false, 587, 212, 112, 52],
    "Stagepreview_B_Water": [false, 587, 265, 112, 52]
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