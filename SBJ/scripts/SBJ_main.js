function main() {
  var globalDict = new GlobalDict(new EventHandler());
  var menu = new Menu(globalDict);
  window.addEventListener('keydown', event => keydownEvent(event, globalDict));
  window.addEventListener('keyup', event => keyupEvent(event, globalDict));
  window.addEventListener('mousemove', event => mousemoveEvent(event, globalDict));
  window.addEventListener('mousedown', event => mousedownEvent(event, globalDict));
  window.addEventListener('mouseup', event => mouseupEvent(event, globalDict));
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

      gD.frameNo++;

      gD.newKeys = [];
      gD.events = [];
      gD.mouseDown = [];
      gD.mouseUp = [];
      gD.lastMousePos = copy(gD.mousePos);
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
  gD.lastMousePos = copy(gD.mousePos);
  gD.mousePos = {
    "x" : (event.pageX - gD.canvas.offsetLeft),
    "y" : (event.pageY - gD.canvas.offsetTop)
  };
}

function mousedownEvent(event, gD) {
  gD.mouseDown.push(true);
  gD.referenceMousePos = copy(gD.mousePos);
}

function mouseupEvent(event, gD) {
  gD.mouseUp.push(true);
}

function clickEvent(event, gD) {
  gD.clicks.push({
    "x" : (event.pageX - gD.canvas.offsetLeft),
    "y" : (event.pageY - gD.canvas.offsetTop)
  });
}

function wheelEvent(event, gD) {
  gD.wheelMovements.push(event.deltaY);
}

function GlobalDict(eventHandler) {
  this.eventHandler = eventHandler;
  this.canvas = document.getElementById("gamearea");
  this.context = this.canvas.getContext("2d");
  this.offscreenCanvas = document.getElementById("offscreen");
  this.offscreenContext = this.offscreenCanvas.getContext("2d");
  this.keys = {};
  this.newKeys = [];
  this.events = [];
  this.mousePos = {"x": 0, "y": 0};
  this.mouseDown = [];
  this.mouseUp = [];
  this.lastMousePos = {"x": 0, "y": 0};
  this.referenceMousePos = {"x": 0, "y": 0};
  this.clicks = [];
  this.wheelMovements = [];
  this.currentPage = null;                       //saves the current object, that should be displayed
  this.raf = null;
  this.startTs = 0;
  this.lag = 0;
  this.timeDiff = 0;
  this.refreshrate = 1000 / 60;
  this.frameNo = 0;
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
    "Collectables_Nothing": [false, 0, 0, 22, 6],
    "Currency_L": [false, 23, 0, 28, 36],
    "Currency_M": [false, 23, 37, 21, 27],
    "Currency_S": [false, 23, 65, 14, 18],
    "Currency_XS": [false, 23, 84, 7, 9],
    "Deco_Bubble_L": [false, 52, 0, 7, 7],
    "Deco_Bubble_M": [false, 52, 8, 5, 5],
    "Deco_Bubble_S": [false, 52, 14, 3, 3],
    "Enemy_Apple": [false, 60, 0, 19, 20],
    "Enemy_Fireball": [false, 60, 21, 12, 12],
    "Enemy_Rocket": [true, 60, [34, 81, 128], 20, 46],
    "Enemy_Airplane_Blue": [false, 60, 175, 32, 19],
    "Enemy_Airplane_Green": [false, 60, 195, 32, 19],
    "Enemy_Airplane_Purple": [false, 60, 215, 32, 19],
    "Enemy_Airplane_Red": [false, 60, 235, 32, 19],
    "Enemy_Asteroid_Ice": [false, 60, 255, 19, 20],
    "Enemy_Asteroid_Lava": [false, 60, 276, 19, 20],
    "Enemy_Asteroid_Stone": [false, 60, 297, 19, 20],
    "Enemy_Bird_Left": [true, 60, [318, 337], 27, 18],
    "Enemy_Bird_Right": [true, 60, [356, 375], 27, 18],
    "Enemy_Fish_Blue": [false, 60, 394, 34, 19],
    "Enemy_Fish_Green": [false, 60, 414, 34, 19],
    "Enemy_Fish_Nemo": [false, 60, 434, 34, 19],
    "Enemy_Fish_Red": [false, 60, 454, 34, 19],
    "Icon_Earth": [false, 95, 0, 50, 50],
    "Icon_Info": [false, 95, 51, 5, 16],
    "Icon_KeyLong": [false, 95, 68, 68, 17],
    "Icon_KeyShort": [false, 95, 86, 16, 17],
    "Icon_Moon": [false, 95, 104, 35, 35],
    "Icon_Refresh": [false, 95, 140, 26, 27],
    "Icon_Sound_off": [false, 95, 168, 24, 22],
    "Icon_Sound_on": [false, 95, 191, 24, 22],
    "Icon_Statistic": [true, 95, [214, 255, 296, 337, 378, 419, 460, 501, 542], 40, 40],
    "Item_Feather": [true, 164, [0, 21, 42, 63, 84, 105, 126, 147, 168, 189], 16, 20],
    "Item_Magnet": [true, 164, [210, 231, 252, 273, 294, 315, 336, 357], 17, 20],
    "Item_Questionmark": [true, 164, [378, 397, 416, 435, 454, 473, 492, 511, 530, 549, 568, 587, 606, 625, 644, 663, 682, 701, 720, 739, 758, 777], 14, 18],
    "Item_Rocket": [true, 164, [796, 811, 826, 841, 856, 871, 886, 901], 20, 14],
    "Item_Star": [true, 164, [916, 936, 956, 976, 996, 1016, 1036, 1056, 1076, 1096, 1116, 1136, 1156, 1176, 1196], 18, 19],
    "Item_Stopwatch": [true, 164, [1216, 1236, 1256, 1276, 1296, 1316, 1336, 1356], 15, 19],
    "Item_Treasure": [true, 164, [1376, 1390, 1404, 1418, 1432, 1446, 1460, 1474, 1488, 1502, 1516, 1530, 1544, 1558, 1572, 1586], 20, 13],
    "Item_B_Feather": [true, 185, [0, 41, 82, 123, 164, 205, 246, 287, 328, 369], 32, 40],
    "Item_B_Magnet": [true, 185, [410, 451, 492, 533, 574, 615, 656, 697], 34, 40],
    "Item_B_Questionmark": [true, 185, [738, 775, 812, 849, 886, 923, 960, 997, 1034, 1071, 1108, 1145, 1182, 1219, 1256, 1293, 1330, 1367, 1404, 1441, 1478, 1515], 28, 36],
    "Item_B_Rocket": [true, 185, [1552, 1581, 1610, 1639, 1668, 1697, 1726, 1755], 40, 28],
    "Item_B_Star": [true, 185, [1784, 1823, 1862, 1901, 1940, 1979, 2018, 2057, 2096, 2135, 2174, 2213, 2252, 2291, 2330], 36, 38],
    "Item_B_Stopwatch": [true, 185, [2369, 2408, 2447, 2486, 2525, 2564, 2603, 2642], 30, 38],
    "Item_B_Treasure": [true, 185, [2681, 2708, 2735, 2762, 2789, 2816, 2843, 2870, 2897, 2924, 2951, 2978, 3005, 3032, 3059, 3086], 40, 26],
    "Money_1": [true, 226, [0, 19, 38, 57, 76, 95, 114], 30, 18],
    "Money_10": [true, 226, [133, 152, 171, 190, 209, 228, 247], 30, 18],
    "Money_100": [true, 226, [266, 285, 304, 323, 342, 361, 380], 30, 18],
    "Money_1000": [true, 226, [399, 418, 437, 456, 475, 494, 513], 30, 18],
    "Money_XS_1": [false, 257, 0, 15, 9],
    "Money_XS_10": [false, 257, 10, 15, 9],
    "Money_XS_100": [false, 257, 20, 15, 9],
    "Money_XS_1000": [false, 257, 30, 15, 9],
    "Player_Afroman": [false, 273, 0, 24, 23],
    "Player_Afroman_G": [false, 273, 24, 24, 23],
    "Player_Disgusty": [false, 273, 48, 25, 23],
    "Player_Disgusty_G": [false, 273, 72, 25, 23],
    "Player_Longjohn": [false, 273, 96, 14, 26],
    "Player_Longjohn_G": [false, 273, 123, 14, 26],
    "Player_Magician": [false, 273, 150, 24, 14],
    "Player_Magician_G": [false, 273, 165, 24, 14],
    "Player_Speedy": [false, 273, 180, 14, 14],
    "Player_Speedy_G": [false, 273, 195, 14, 14],
    "Player_Standard": [false, 273, 210, 20, 20],
    "Player_Standard_G": [false, 273, 231, 20, 20],
    "Player_Strooper": [false, 273, 252, 20, 20],
    "Player_Strooper_G": [false, 273, 273, 20, 20],
    "Player_B_Afroman": [false, 299, 0, 48, 46],
    "Player_B_Disgusty": [false, 299, 47, 50, 46],
    "Player_B_Longjohn": [false, 299, 94, 28, 52],
    "Player_B_Magician": [false, 299, 147, 48, 28],
    "Player_B_Speedy": [false, 299, 176, 28, 28],
    "Player_B_Standard": [false, 299, 205, 40, 40],
    "Player_B_Strooper": [false, 299, 246, 40, 40],
    "Reward_100_jumps_out_of_bounds": [false, 350, 0, 40, 40],
    "Reward_collect_100_golden_shamrocks": [false, 350, 41, 40, 40],
    "Reward_collect_24000_hype": [false, 350, 82, 40, 40],
    "Reward_collect_25_golden_shamrocks": [false, 350, 123, 40, 40],
    "Reward_collect_50_golden_shamrocks": [false, 350, 164, 40, 40],
    "Reward_collect_first_1000_hype": [false, 350, 205, 40, 40],
    "Reward_collect_first_golden_shamrock": [false, 350, 246, 40, 40],
    "Reward_collect_first_hype": [false, 350, 287, 40, 40],
    "Reward_collect_first_treasure": [false, 350, 328, 40, 40],
    "Reward_die_1000": [false, 350, 369, 40, 40],
    "Reward_locked": [false, 350, 410, 40, 40],
    "Reward_slow_1_hour": [false, 350, 451, 40, 40],
    "Reward_use_all_items_at_once": [false, 350, 492, 40, 40],
    "Reward_use_first_double_jump": [false, 350, 533, 40, 40],
    "Reward_use_five_feathers": [false, 350, 574, 40, 40],
    "Reward_use_five_magnets": [false, 350, 615, 40, 40],
    "Reward_use_five_rockets": [false, 350, 656, 40, 40],
    "Reward_use_five_stars": [false, 350, 697, 40, 40],
    "Reward_use_five_stopwatches": [false, 350, 738, 40, 40],
    "Reward_use_five_treasures": [false, 350, 779, 40, 40],
    "Reward_B_100_jumps_out_of_bounds": [false, 391, 0, 80, 80],
    "Reward_B_collect_100_golden_shamrocks": [false, 391, 81, 80, 80],
    "Reward_B_collect_24000_hype": [false, 391, 162, 80, 80],
    "Reward_B_collect_25_golden_shamrocks": [false, 391, 243, 80, 80],
    "Reward_B_collect_50_golden_shamrocks": [false, 391, 324, 80, 80],
    "Reward_B_collect_first_1000_hype": [false, 391, 405, 80, 80],
    "Reward_B_collect_first_golden_shamrock": [false, 391, 486, 80, 80],
    "Reward_B_collect_first_hype": [false, 391, 567, 80, 80],
    "Reward_B_collect_first_treasure": [false, 391, 648, 80, 80],
    "Reward_B_die_1000": [false, 391, 729, 80, 80],
    "Reward_B_locked": [false, 391, 810, 80, 80],
    "Reward_B_slow_1_hour": [false, 391, 891, 80, 80],
    "Reward_B_use_all_items_at_once": [false, 391, 972, 80, 80],
    "Reward_B_use_first_double_jump": [false, 391, 1053, 80, 80],
    "Reward_B_use_five_feathers": [false, 391, 1134, 80, 80],
    "Reward_B_use_five_magnets": [false, 391, 1215, 80, 80],
    "Reward_B_use_five_rockets": [false, 391, 1296, 80, 80],
    "Reward_B_use_five_stars": [false, 391, 1377, 80, 80],
    "Reward_B_use_five_stopwatches": [false, 391, 1458, 80, 80],
    "Reward_B_use_five_treasures": [false, 391, 1539, 80, 80],
    "Skill_Feather_level_up": [true, 472, [0, 21, 42, 63, 84, 105, 126, 147, 168, 189, 210, 231, 252, 273, 294, 315, 336, 357, 378, 399], 30, 20],
    "Skill_Magnet_level_up": [true, 472, [420, 441, 462, 483, 504, 525, 546, 567, 588, 609, 630, 651, 672, 693, 714, 735], 31, 20],
    "Skill_Rocket_level_up": [true, 472, [756, 776, 796, 816, 836, 856, 876, 896, 916, 936, 956, 976, 996, 1016, 1036, 1056], 34, 19],
    "Skill_Stars_at_start": [true, 472, [1076, 1093, 1110, 1127, 1144, 1161, 1178, 1195, 1212, 1229, 1246, 1263, 1280], 40, 16],
    "Skill_Star_level_up": [true, 472, [1297, 1317, 1337, 1357, 1377, 1397, 1417, 1437, 1457, 1477, 1497, 1517, 1537, 1557, 1577], 32, 19],
    "Skill_Stopwatches_at_start": [true, 472, [1597, 1614, 1631, 1648, 1665, 1682, 1699, 1716, 1733, 1750, 1767, 1784, 1801, 1818, 1835, 1852], 40, 16],
    "Skill_Stopwatch_level_up": [true, 472, [1869, 1889, 1909, 1929, 1949, 1969, 1989, 2009, 2029, 2049, 2069, 2089, 2109, 2129, 2149, 2169], 29, 19],
    "Skill_Treasure_level_up": [true, 472, [2189, 2209, 2229, 2249, 2269, 2289, 2309, 2329, 2349, 2369, 2389, 2409, 2429, 2449, 2469, 2489], 34, 19],
    "Special_BlueKey": [false, 513, 0, 11, 22],
    "Special_GoldenShamrock": [true, 513, [23, 43, 63, 83, 103, 123, 143, 163], 15, 19],
    "Special_GoldenShamrock_B": [true, 513, [183, 222, 261, 300, 339, 378, 417, 456], 30, 38],
    "Special_GreenKey": [false, 513, 495, 11, 22],
    "Special_Placeholder": [false, 513, 518, 40, 40],
    "Special_Placeholder_B": [false, 513, 559, 80, 80],
    "Special_Pointer": [false, 513, 640, 10, 6],
    "Special_RedKey": [false, 513, 647, 11, 22],
    "Special_YellowKey": [false, 513, 670, 11, 22],
    "Stage_Air": [false, 594, 0, 56, 26],
    "Stage_Air_G": [false, 594, 27, 56, 26],
    "Stage_Forest": [false, 594, 54, 56, 26],
    "Stage_Forest_G": [false, 594, 81, 56, 26],
    "Stage_Fortress": [false, 594, 108, 56, 26],
    "Stage_Fortress_G": [false, 594, 135, 56, 26],
    "Stage_Standard": [false, 594, 162, 56, 26],
    "Stage_Standard_G": [false, 594, 189, 56, 26],
    "Stage_Universe": [false, 594, 216, 56, 26],
    "Stage_Universe_G": [false, 594, 243, 56, 26],
    "Stage_Water": [false, 594, 270, 56, 26],
    "Stage_Water_G": [false, 594, 297, 56, 26],
    "Stagepreview_Air": [false, 651, 0, 56, 26],
    "Stagepreview_Forest": [false, 651, 27, 56, 26],
    "Stagepreview_Fortress": [false, 651, 54, 56, 26],
    "Stagepreview_Standard": [false, 651, 81, 56, 26],
    "Stagepreview_Universe": [false, 651, 108, 56, 26],
    "Stagepreview_Water": [false, 651, 135, 56, 26],
    "Stagepreview_B_Air": [false, 708, 0, 112, 52],
    "Stagepreview_B_Forest": [false, 708, 53, 112, 52],
    "Stagepreview_B_Fortress": [false, 708, 106, 112, 52],
    "Stagepreview_B_Standard": [false, 708, 159, 112, 52],
    "Stagepreview_B_Universe": [false, 708, 212, 112, 52],
    "Stagepreview_B_Water": [false, 708, 265, 112, 52],
    "Stage_B_Air": [false, 821, 0, 112, 52],
    "Stage_B_Forest": [false, 821, 53, 112, 52],
    "Stage_B_Fortress": [false, 821, 106, 112, 52],
    "Stage_B_Standard": [false, 821, 159, 112, 52],
    "Stage_B_Universe": [false, 821, 212, 112, 52],
    "Stage_B_Water": [false, 821, 265, 112, 52]
  };
  // end spriteDict
  this.player = {                    //The data for the different playermodels with: unlocked, jumps, jumpstrength, movementspeed right, movementspeed left, weight
    "Player_Standard" : [true, 2, -9, 3, -3, 45],
    "Player_Longjohn" : [false, 2, -13.5, 3, -3, 42],
    "Player_Speedy" : [false, 2, -9, 6, -6, 38],
    "Player_Magician" : [false, 3, -9, 3, -3, 43],
    "Player_Strooper" : [false, 2, -10.8, 4.5, -4.5, 45],
    "Player_Disgusty" : [false, 3, -10.8, 3, -3, 52],
    "Player_Afroman" : [false, 3, -10.8, 4.5, -4.5, 46]
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
  this.stages = {                    //stage class reference, unlocked
    "Stage_Standard": [true, "Stage0"],
    "Stage_Fortress": [true, "Stage1"],
    "Stage_Air": [false, "Stage2"],
    "Stage_Water": [false, "Stage3"],
    "Stage_Forest": [false, "Stage4"],
    "Stage_Universe": [false, "Stage5"]
  };
  this.collectables = {
    "Collectables_Nothing": [true],
    "Collectables_Beard1": [true],
    "Collectables_Glasses1": [true],
    "Collectables_Hat1": [true]
  };
  this.design = {
    elements: {
      objectSelection: {
        rectKey: {
          arrow: "standard",
          selected: "selected"
        },
        borderKey: {
          arrow: "standard"
        }
      },
      skillTree: {
        rectKey: {
          background: "modal",
          test: "standard"
        },
        circleKey: "standard",
        borderKey: "standard"
      },
      shopSkillStandard: {
        rectKey: "standard",
        circleKey: {
          normal: "white",
          selected: "selected",
          locked: "locked",
          maxed: "white"
        },
        textKey: "small",
        borderKey: {
          normal: "standard",
          hook: "hook"
        }
      },
      shopSkillItem: {
        rectKey: "standard",
        circleKey: {
          normal: "item",
          selected: "selected",
          locked: "locked",
          maxed: "white"
        },
        textKey: "small",
        borderKey: {
          normal: "standard",
          hook: "hook"
        }
      },
      shopSkillMoney: {
        rectKey: "standard",
        circleKey: {
          normal: "money100",
          selected: "selected",
          locked: "locked",
          maxed: "white"
        },
        textKey: "small",
        borderKey: {
          normal: "standard",
          hook: "hook"
        }
      },
      shopSkillCharacter: {
        rectKey: "standard",
        circleKey: {
          normal: "character",
          selected: "selected",
          locked: "locked",
          maxed: "white"
        },
        textKey: "small",
        borderKey: {
          normal: "standard",
          hook: "hook"
        }
      },
      shopSkillInfo: {
        rectKey: "standard",
        textKey: {
          headline: "normalBold",
          text: "highscoreNumber"
        },
        borderKey: "standard"
      },
      skillTreeMiniMap: {
        rectKey: {
          background: "blur",
          map: "modal"
        },
        circleKey: "standard",
        borderKey: {
          line: "small",
          skill: "small",
          window: "small",
          normal: "standard"
        }
      },
      accessoryWindow: {
        rectKey: {
          accessory: {
            standard: "standard",
            beard: "shopBeard",
            glasses: "shopGlasses",
            hat: "shopHat"
          },
          field: "blur",
          arrow: "modal"
        },
        borderKey: {
          standard: "standard",
          accessory: "standard",
          field: "standard"
        }
      },
      shopDropdown: {
        rectKey: {
          background: "standard",
          selected: "selected",
          arrow: "modal"
        },
        textKey: "savestate",
        borderKey: "standard"
      },
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
        textKey: {
          text: "savestate"
        },
        borderKey: "standard"
      },
      savestateDetails: {
        rectKey: {
          modal: "modal",
          background: "standard"
        },
        textKey: {
          headline: "normalBold",
          text: "enterNameModal",
          version: "value",
          date: "date"
        },
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
        rectKey: {
          modal: "modal",
          background: "standard"
        },
        textKey: {
          headline: "normalBold",
          text: "enterNameModal"
        },
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
      scrollBarBlack: {
        lineKey: "small2",
        barKey: "big2"
      },
      standardTab: {
        rectKey: {
          tab: "blur",
          background: "blur",
          inactive: "modal"
        },
        borderKey: "standard"
      },
      statisticsHeadline: {
        textKey: {
          headline: "normalBold",
          label: "statisticsLabel",
          value: "value"
        },
        borderKey: "standard"
      },
      itemStandard: {
        textKey: {
          number: "value",
          label: "statisticsLabel"
        },
        borderKey: "standard"
      },
      itemBar: {
        rectKey: {
          "0": "stopwatch",
          "1": "star",
          "2": "feather",
          "3": "treasure",
          "4": "magnet",
          "5": "rocket"
        },
        borderKey: "standard"
      },
      moneyBar: {
        rectKey: {
          "0": "money1",
          "1": "money10",
          "2": "money100",
          "3": "money1000",
          "4": "bonus"
        },
        textKey: "small",
        borderKey: "standard"
      },
      moneyPositive: {
        rectKey: "moneyPositive",
        textKey: {
          label: "statisticsLabel",
          number: "value"
        },
        borderKey: "standard"
      },
      moneyNegative: {
        rectKey: "moneyNegative",
        textKey: {
          label: "statisticsLabel",
          number: "value"
        },
        borderKey: "standard"
      },
      statisticsMoney1: {
        rectKey: "money1",
        textKey: {
          label: "statisticsLabel",
          number: "value"
        },
        borderKey: "standard"
      },
      statisticsMoney10: {
        rectKey: "money10",
        textKey: {
          label: "statisticsLabel",
          number: "value"
        },
        borderKey: "standard"
      },
      statisticsMoney100: {
        rectKey: "money100",
        textKey: {
          label: "statisticsLabel",
          number: "value"
        },
        borderKey: "standard"
      },
      statisticsMoney1000: {
        rectKey: "money1000",
        textKey: {
          label: "statisticsLabel",
          number: "value"
        },
        borderKey: "standard"
      },
      statisticsMoneyBonus: {
        rectKey: "bonus",
        textKey: {
          label: "statisticsLabel",
          number: "value"
        },
        borderKey: "standard"
      },
      statisticsTime: {
        textKey: {
          headline: "normalBold",
          time: "normal"
        },
        borderKey: "standard"
      },
      statisticsDistance: {
        rectKey: "rocket",
        textKey: {
          label: "statisticsLabel",
          number: "value"
        },
        borderKey: {
          travel: "travelLine",
          border: "standard"
        }
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
      shop: {
        rectKey: {
          standard: "blur",
          selected: "selected"
        },
        textKey: "normal",
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
      },
      stopwatch: {
        backgroundColor: "222, 222, 222, 1"
      },
      star: {
        backgroundColor: "223, 223, 29, 1"
      },
      feather: {
        backgroundColor: "240, 140, 0, 1"
      },
      treasure: {
        backgroundColor: "137, 100, 73, 1"
      },
      magnet: {
        backgroundColor: "142, 139, 139, 1"
      },
      rocket: {
        backgroundColor: "0, 0, 0, 1"
      },
      selectionBackground: {
        backgroundColor: "0, 0, 0, 0.5"
      },
      shopBeard: {
        backgroundColor: "237, 128, 129, 0.7"
      },
      shopGlasses: {
        backgroundColor: "128, 129, 237, 0.7"
      },
      shopHat: {
        backgroundColor: "129, 237, 128, 0.7"
      }
    },
    circle: {
      standard: {
        backgroundColor: "0, 255, 255, 1"
      },
      white: {
        backgroundColor: "255, 255, 255, 1"
      },
      item: {
        backgroundColor: "89, 155, 255, 1"
      },
      character: {
        backgroundColor: "224, 192, 62, 1"
      },
      selected: {
        backgroundColor: "180, 50, 50, 1"
      },
      locked: {
        backgroundColor: "44, 47, 51, 0.9"
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
        borderSize: 2,
        lineDash: []
      },
      selected: {
        borderColor: "180, 50, 50, 1",
        borderSize: 2,
        lineDash: []
      },
      small2: {
        borderColor: "0, 0, 0, 1",
        borderSize: 1,
        lineDash: []
      },
      small: {
        borderColor: "0, 0, 0, 1",
        borderSize: 1.5,
        lineDash: []
      },
      verySmall: {
        borderColor: "0, 0, 0, 1",
        borderSize: 0.5,
        lineDash: []
      },
      big: {
        borderColor: "0, 0, 0, 1",
        borderSize: 3,
        lineDash: []
      },
      big2: {
        borderColor: "0, 0, 0, 1",
        borderSize: 4,
        lineDash: []
      },
      smallWhite: {
        borderColor: "255, 255, 255, 1",
        borderSize: 1,
        lineDash: []
      },
      bigWhite: {
        borderColor: "255, 255, 255, 1",
        borderSize: 4,
        lineDash: []
      },
      travelLine: {
        borderColor: "65, 65, 65, 1",
        borderSize: 1,
        lineDash: [5,3]
      },
      hook: {
        borderColor: "45, 215, 45, 1",
        borderSize: 4,
        lineDash: []
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
      statisticsLabel: {
        font: "12pt Consolas",
        color: "0, 0, 0, 1",
        align: "left",
        baseline: "alphabetic",
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
      date: {
        font: "10pt Consolas",
        color: "0, 0, 0, 1",
        align: "left",
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
    this.offscreenContext.clearRect(0, 0, this.offscreenCanvas.width, this.offscreenCanvas.height);
  };
}