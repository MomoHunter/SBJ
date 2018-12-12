function main() {
  var globalDict = new GlobalDict();
  var menu = new Menu(globalDict);
  window.addEventListener('keydown', event => keydownEvent(event, globalDict));
  window.addEventListener('keyup', event => keyupEvent(event, globalDict));
  window.addEventListener('mousemove', event => mousemoveEvent(event, globalDict));
  window.addEventListener('click', event => clickEvent(event, globalDict));
  window.addEventListener('wheel', event => wheelEvent(event, globalDict));
  menu.init();
  globalDict.setNewPage(menu, true);
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

function GlobalDict() {
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
  this.spriteDict = {                           //The numbers specify the x-pos, y-pos, width and height of the object
    "Stagepreview_Standard": [0, 0, 56, 26],    //The B suffix marks a two times bigger version
    "Stagepreview_Fortress": [0, 27, 56, 26],
    "Stagepreview_Air": [0, 54, 56, 26],
    "Stagepreview_Water": [0, 81, 56, 26],
    "Stagepreview_Forest": [0, 108, 56, 26],
    "Stagepreview_Universe": [0, 135, 56, 26],
    "Stagepreview_Standard_B": [57, 0, 112, 52],
    "Stagepreview_Fortress_B": [57, 54, 112, 52],
    "Stagepreview_Air_B": [57, 108, 112, 52],
    "Stagepreview_Water_B": [57, 162, 112, 52],
    "Stagepreview_Forest_B": [57, 216, 112, 52],
    "Stagepreview_Universe_B": [57, 270, 112, 52],
    "Item_Stopwatch_0": [171, 1, 15, 19],
    "Item_Stopwatch_1": [171, 22, 15, 19],
    "Item_Stopwatch_2": [171, 43, 15, 19],
    "Item_Stopwatch_3": [171, 64, 15, 19],
    "Item_Stopwatch_4": [171, 85, 15, 19],
    "Item_Stopwatch_5": [171, 106, 15, 19],
    "Item_Stopwatch_6": [171, 127, 15, 19],
    "Item_Stopwatch_7": [171, 148, 15, 19],
    "Item_Star_0": [192, 1, 18, 19],
    "Item_Star_1": [192, 22, 18, 19],
    "Item_Star_2": [192, 43, 18, 19],
    "Item_Star_3": [192, 64, 18, 19],
    "Item_Star_4": [192, 85, 18, 19],
    "Item_Star_5": [192, 106, 18, 19],
    "Item_Star_6": [192, 127, 18, 19],
    "Item_Star_7": [192, 148, 18, 19],
    "Item_Feather_0": [213, 1, 16, 16],
    "Item_Feather_1": [213, 22, 16, 16],
    "Item_Feather_2": [213, 43, 16, 16],
    "Item_Feather_3": [213, 64, 16, 16],
    "Item_Feather_4": [213, 85, 16, 16],
    "Item_Feather_5": [213, 106, 16, 16],
    "Item_Feather_6": [213, 127, 16, 16],
    "Item_Feather_7": [213, 148, 16, 16],
    "Item_Treasure_0": [234, 1, 20, 13],
    "Item_Treasure_1": [234, 22, 20, 13],
    "Item_Treasure_2": [234, 43, 20, 13],
    "Item_Treasure_3": [234, 64, 20, 13],
    "Item_Treasure_4": [234, 85, 20, 13],
    "Item_Treasure_5": [234, 106, 20, 13],
    "Item_Treasure_6": [234, 127, 20, 13],
    "Item_Treasure_7": [234, 148, 20, 13],
    "Item_Magnet_0": [255, 1, 17, 20],
    "Item_Magnet_1": [255, 22, 17, 20],
    "Item_Magnet_2": [255, 43, 17, 20],
    "Item_Magnet_3": [255, 64, 17, 20],
    "Item_Magnet_4": [255, 85, 17, 20],
    "Item_Magnet_5": [255, 106, 17, 20],
    "Item_Magnet_6": [255, 127, 17, 20],
    "Item_Magnet_7": [255, 148, 17, 20],
    "Item_Rocket_0": [276, 1, 20, 14],
    "Item_Rocket_1": [276, 22, 20, 14],
    "Item_Rocket_2": [276, 43, 20, 14],
    "Item_Rocket_3": [276, 64, 20, 14],
    "Item_Rocket_4": [276, 85, 20, 14],
    "Item_Rocket_5": [276, 106, 20, 14],
    "Item_Rocket_6": [276, 127, 20, 14],
    "Item_Rocket_7": [276, 148, 20, 14],
    "Special_GoldenShamrock_0": [297, 1, 15, 19],
    "Special_GoldenShamrock_1": [297, 22, 15, 19],
    "Special_GoldenShamrock_2": [297, 43, 15, 19],
    "Special_GoldenShamrock_3": [297, 64, 15, 19],
    "Special_GoldenShamrock_4": [297, 85, 15, 19],
    "Special_GoldenShamrock_5": [297, 106, 15, 19],
    "Special_GoldenShamrock_6": [297, 127, 15, 19],
    "Special_GoldenShamrock_7": [297, 148, 15, 19],
    "Item_Stopwatch_0_B": [320, 2, 30, 38],
    "Item_Stopwatch_1_B": [320, 44, 30, 38],
    "Item_Stopwatch_2_B": [320, 86, 30, 38],
    "Item_Stopwatch_3_B": [320, 128, 30, 38],
    "Item_Stopwatch_4_B": [320, 170, 30, 38],
    "Item_Stopwatch_5_B": [320, 212, 30, 38],
    "Item_Stopwatch_6_B": [320, 254, 30, 38],
    "Item_Stopwatch_7_B": [320, 296, 30, 38],
    "Item_Star_0_B": [362, 2, 36, 38],
    "Item_Star_1_B": [362, 44, 36, 38],
    "Item_Star_2_B": [362, 86, 36, 38],
    "Item_Star_3_B": [362, 128, 36, 38],
    "Item_Star_4_B": [362, 170, 36, 38],
    "Item_Star_5_B": [362, 212, 36, 38],
    "Item_Star_6_B": [362, 254, 36, 38],
    "Item_Star_7_B": [362, 296, 36, 38],
    "Item_Feather_0_B": [404, 2, 32, 32],
    "Item_Feather_1_B": [404, 44, 32, 32],
    "Item_Feather_2_B": [404, 86, 32, 32],
    "Item_Feather_3_B": [404, 128, 32, 32],
    "Item_Feather_4_B": [404, 170, 32, 32],
    "Item_Feather_5_B": [404, 212, 32, 32],
    "Item_Feather_6_B": [404, 254, 32, 32],
    "Item_Feather_7_B": [404, 296, 32, 32],
    "Item_Treasure_0_B": [446, 2, 40, 26],
    "Item_Treasure_1_B": [446, 44, 40, 26],
    "Item_Treasure_2_B": [446, 86, 40, 26],
    "Item_Treasure_3_B": [446, 128, 40, 26],
    "Item_Treasure_4_B": [446, 170, 40, 26],
    "Item_Treasure_5_B": [446, 212, 40, 26],
    "Item_Treasure_6_B": [446, 254, 40, 26],
    "Item_Treasure_7_B": [446, 296, 40, 26],
    "Item_Magnet_0_B": [488, 2, 34, 40],
    "Item_Magnet_1_B": [488, 44, 34, 40],
    "Item_Magnet_2_B": [488, 86, 34, 40],
    "Item_Magnet_3_B": [488, 128, 34, 40],
    "Item_Magnet_4_B": [488, 170, 34, 40],
    "Item_Magnet_5_B": [488, 212, 34, 40],
    "Item_Magnet_6_B": [488, 254, 34, 40],
    "Item_Magnet_7_B": [488, 296, 34, 40],
    "Item_Rocket_0_B": [530, 2, 40, 28],
    "Item_Rocket_1_B": [530, 44, 40, 28],
    "Item_Rocket_2_B": [530, 86, 40, 28],
    "Item_Rocket_3_B": [530, 128, 40, 28],
    "Item_Rocket_4_B": [530, 170, 40, 28],
    "Item_Rocket_5_B": [530, 212, 40, 28],
    "Item_Rocket_6_B": [530, 254, 40, 28],
    "Item_Rocket_7_B": [530, 296, 40, 28],
    "Money_1_0": [171, 169, 30, 18],
    "Money_1_1": [171, 190, 30, 18],
    "Money_1_2": [171, 211, 30, 18],
    "Money_1_3": [171, 232, 30, 18],
    "Money_1_4": [171, 253, 30, 18],
    "Money_1_5": [171, 274, 30, 18],
    "Money_1_6": [171, 295, 30, 18],
    "Money_10_0": [202, 169, 30, 18],
    "Money_10_1": [202, 190, 30, 18],
    "Money_10_2": [202, 211, 30, 18],
    "Money_10_3": [202, 232, 30, 18],
    "Money_10_4": [202, 253, 30, 18],
    "Money_10_5": [202, 274, 30, 18],
    "Money_10_6": [202, 295, 30, 18],
    "Money_100_0": [233, 169, 30, 18],
    "Money_100_1": [233, 190, 30, 18],
    "Money_100_2": [233, 211, 30, 18],
    "Money_100_3": [233, 232, 30, 18],
    "Money_100_4": [233, 253, 30, 18],
    "Money_100_5": [233, 274, 30, 18],
    "Money_100_6": [233, 295, 30, 18],
    "Money_1000_0": [264, 169, 30, 18],
    "Money_1000_1": [264, 190, 30, 18],
    "Money_1000_2": [264, 211, 30, 18],
    "Money_1000_3": [264, 232, 30, 18],
    "Money_1000_4": [264, 253, 30, 18],
    "Money_1000_5": [264, 274, 30, 18],
    "Money_1000_6": [264, 295, 30, 18],
    "Enemy_Fireball": [573, 1, 12, 12],
    "Enemy_Airplane_0": [586, 1, 32, 19],
    "Enemy_Airplane_1": [586, 21, 32, 19],
    "Enemy_Airplane_2": [586, 41, 32, 19],
    "Enemy_Airplane_3": [586, 61, 32, 19],
    "Enemy_Rocket_0": [619, 1, 20, 46],
    "Enemy_Rocket_1": [619, 48, 20, 46],
    "Enemy_Rocket_2": [619, 95, 20, 46],
    "Enemy_Fish_0": [640, 1, 34, 19],
    "Enemy_Fish_1": [640, 21, 34, 19],
    "Enemy_Fish_2": [640, 41, 34, 19],
    "Enemy_Fish_3": [640, 61, 34, 19],
    "Enemy_Bird_0_0": [675, 1, 27, 15],
    "Enemy_Bird_0_1": [675, 17, 27, 12],
    "Enemy_Bird_1_0": [703, 1, 27, 15],
    "Enemy_Bird_1_1": [703, 17, 27, 12],
    "Enemy_Asteroid_0": [731, 1, 19, 19],
    "Enemy_Asteroid_1": [731, 21, 19, 19],
    "Enemy_Asteroid_2": [731, 41, 19, 19],
    "Player_Standard": [751, 1, 20, 20],
    "Player_Longjohn": [751, 32, 14, 26],
    "Player_Speedy": [751, 63, 14, 14],
    "Player_Magician": [751, 94, 24, 14],
    "Player_Strooper": [751, 125, 20, 20],
    "Player_Disgusty": [751, 156, 25, 23],
    "Player_Afroman": [751, 187, 24, 23],
    "Player_Standard_B": [783, 2, 40, 40],
    "Player_Longjohn_B": [783, 64, 28, 52],
    "Player_Speedy_B": [783, 126, 28, 28],
    "Player_Magician_B": [783, 188, 48, 28],
    "Player_Strooper_B": [783, 250, 40, 40],
    "Player_Disgusty_B": [783, 312, 50, 46],
    "Player_Afroman_B": [783, 374, 48, 46],
    "Pointer": [845, 1, 10, 6],
    "Deco_Bubble_0": [845, 8, 7, 7],
    "Deco_Bubble_1": [845, 16, 5, 5],
    "Deco_Bubble_2": [845, 22, 3, 3],
    "Icon_Mute": [857, 1, 24, 22],
    "Icon_Statistics": [857, 32, 26, 20],
    "Icon_Refresh": [857, 63, 26, 27],
    "Icon_KeyShort": [888, 1, 16, 17],
    "Icon_KeyLong": [888, 22, 68, 17]
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
  this.design = {
    elements: {
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
      scrollBarStandard: {
        lineKey: "smallWhite",
        barKey: "bigWhite"
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
      small: {
        font: "9pt Consolas",
        color: "0, 0, 0, 1",
        align: "center",
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
      }
    }
  };
  this.setNewPage = function(page, inMenu) {
    this.currentPage = page;
    if (inMenu) {
      this.currentPage.mC.setNewPage(page, page.scrollBar);
    }
  };
  this.clear = function() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  };
}