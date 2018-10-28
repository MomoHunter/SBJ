function Game(gD, menu) {
  this.gD = gD;
  this.menu = menu;
  this.backgroundMusic = new Audio("music/ingame.mp3");
  this.backgroundMusic.preload = "auto";
  this.backgroundMusic.loop = true;
  this.backgroundMusic.volume = 0.15;
  this.endMusic = new Audio("music/gameover.mp3");
  this.endMusic.preload = "auto";
  this.endMusic.volume = 0.22;
  this.inventoryTexts = [];
  this.stageNr = 0;
  this.stages = [];
  this.refreshrate = 1000 / 60;
  this.playerDict = {    //The data for the different playermodels with: jumps, jumpstrength, movementspeed right, movementspeed left
    "1" : [2, -9, 3, -3],
    "2" : [2, -13.5, 3, -3],
    "3" : [2, -9, 6, -6],
    "4" : [3, -9, 3, -3],
    "5" : [2, -10.8, 4.5, -4.5],
    "6" : [3, -10.8, 3, -3],
    "7" : [3, -10.8, 4.5, -4.5]
  };
  this.paused = false;
  this.visible = false;
  this.init = function() {
    this.player = new GamePlayer(20, this.gD.canvas.height - 90);
    this.floor = [new GameFloor(0, this.gD.canvas.height - 50.5, this.gD.canvas.width + 100, 0, 5)];
    for (var i = 0; i < this.gD.itemProb.length; i++) {
      this.inventoryTexts.push(new GameInventoryText(5 + (i * 60), 0, 60, 30, "14pt", "Consolas", "rgba(255, 255, 255, 1)", i + 1));
    }
    this.cashLabel = new Text(this.gD.canvas.width - 5, 22, "14pt", "Consolas", "rgba(255, 255, 255, 1)", "end", "alphabetic", "Hype: 0", 0);

    this.distanceLabel = new Text(this.gD.canvas.width - 135, 22, "14pt", "Consolas", "rgba(255, 255, 255, 1)", "end", "alphabetic", "Distance: 0", 0);

    this.fpsLabel = new Text(0, this.gD.canvas.height - 5, "10pt", "Consolas", "rgba(255, 255, 255, 1)", "start", "alphabetic", "Fps: 0", 0);

    this.goldenShamrock = new GameObject(Math.max(Math.random() * 40000, 30000), 200, this.gD.spriteDict["GoldenShamrock"][2], this.gD.spriteDict["GoldenShamrock"][3], "GoldenShamrock", 1);

    this.cash = 0;
    this.frameCounter = 0;
    this.distanceTravelled = 0;
    this.globalBaseSpeed = -2;
    this.globalSpeed = this.globalBaseSpeed;
    this.inventory = new Array(this.gD.itemProb.length).fill(0);

    this.itemObjects = [];
    this.itemsActive = new Array(this.gD.itemProb.length).fill(false);
    this.itemTimer = new Array(this.gD.itemProb.length).fill(0);
    this.itemsUsed = new Array(this.gD.itemProb.length).fill(0);

    this.moneyObjects = [];
    this.currentMoneyProb = this.gD.moneyProb;

    this.moneySpawnCounter = Math.floor(Math.random() * 200);
    this.itemSpawnCounter = Math.max(Math.floor(Math.random() * 1500), 500);

    this.pauseModal = new GameModal(0, 0, this.gD.canvas.width, this.gD.canvas.height, "rgba(44, 47, 51, .6)");
    this.pauseModal.texts.push(new Text(this.gD.canvas.width / 2, this.gD.canvas.height / 2, "40pt", "Consolas", "rgba(200, 200, 200, 1)", "center", "middle", "Pause", 0));
    this.pauseModal.buttons.push(new Button((this.gD.canvas.width / 2) - 100, this.gD.canvas.height / 2 + 30, 200, 30, "15pt", "Showcard Gothic", "rgba(255, 255, 255, 1)", "Continue", "rgba(0, 0, 0, .6)", 2));
    this.pauseModal.buttons.push(new Button((this.gD.canvas.width / 2) - 100, this.gD.canvas.height / 2 + 65, 200, 30, "15pt", "Showcard Gothic", "rgba(255, 255, 255, 1)", "Main Menu", "rgba(0, 0, 0, .6)", 2));
    this.pauseModal.init();

    this.finishModal = new GameModal(0, 0, this.gD.canvas.width, this.gD.canvas.height, "rgba(44, 47, 51, .6)");
    this.finishModal.texts.push(new Text(this.gD.canvas.width / 2, this.gD.canvas.height / 2 - 60, "30pt", "Consolas", "rgba(200, 200, 200, 1)", "center", "middle", "YOU DIED", 0));
    this.finishModal.texts.push(new Text(this.gD.canvas.width / 2, this.gD.canvas.height / 2 - 30, "15pt", "Consolas", "rgba(200, 200, 200, 1)", "center", "middle", "", 0));
    this.finishModal.texts.push(new Text(this.gD.canvas.width / 2, this.gD.canvas.height / 2 - 10, "15pt", "Consolas", "rgba(200, 200, 200, 1)", "center", "middle", "", 0));
    this.finishModal.texts.push(new Text(this.gD.canvas.width / 2, this.gD.canvas.height / 2 + 10, "15pt", "Consolas", "rgba(200, 200, 200, 1)", "center", "middle", "", 0));
    this.finishModal.buttons.push(new Button((this.gD.canvas.width / 2) - 100, this.gD.canvas.height / 2 + 35, 200, 30, "15pt", "Showcard Gothic", "rgba(255, 255, 255, 1)", "Play Again", "rgba(0, 0, 0, .6)", 2));
    this.finishModal.buttons.push(new Button((this.gD.canvas.width / 2) - 100, this.gD.canvas.height / 2 + 70, 200, 30, "15pt", "Showcard Gothic", "rgba(255, 255, 255, 1)", "Main Menu", "rgba(0, 0, 0, .6)", 2));
    this.finishModal.init();

    this.stages.push(new Stage0(this));
    this.stages.push(new Stage1(this));
    this.stages[1].init();
    this.stages.push(new Stage2(this));
    this.stages[2].init();
    this.stages.push(new Stage3(this));
    this.stages[3].init();
    this.stages.push(new Stage4(this));
    this.stages[4].init();
    this.stages.push(new Stage5(this));
    this.stages[5].init();

    this.finished = false;
    this.paused = false;

    this.startts = 0;
    this.lag = 0;
  };
  this.setStage = function(stageNr) {
    this.stageNr = stageNr;
  };
  this.clear = function() {
    this.gD.context.clearRect(0, 0, this.gD.canvas.width, this.gD.canvas.height);
  };
  this.pause = function() {
    this.paused = true;
    cancelAnimationFrame(this.raf);
    this.backgroundMusic.pause();
    this.pauseModal.draw(this.gD);
  };
  this.continue = function() {
    this.paused = false;
    var game = this;
    this.raf = requestAnimationFrame(function(timestamp){ updateGame(game, timestamp, true); });
    this.backgroundMusic.play();
  };
  this.finish = function() {
    this.finished = true;
    cancelAnimationFrame(this.raf);
    this.backgroundMusic.pause();
    this.endMusic.load();
    this.endMusic.play();
    this.endMusic.muted = this.gD.muted;
    this.menu.shop.cash += this.cash + Math.max(Math.floor(((this.distanceTravelled / 15) - 500) * Math.min(1, this.distanceTravelled / ((4000 / (this.stages[this.stageNr].difficulty / 10)) * 15))), 0);
    
    if (!this.menu.achievements.achievementList.achievements[27].finished) {
      this.menu.achievements.achievementValues[27]++;
      this.menu.achievements.achievementList.achievements[27].check(this.menu.achievements);
    }
    if (!this.menu.achievements.achievementList.achievements[28].finished) {
      this.menu.achievements.achievementValues[28] += this.cash;
      this.menu.achievements.achievementList.achievements[28].check(this.menu.achievements);
    }
    if (!this.menu.achievements.achievementList.achievements[29].finished && this.menu.achievements.achievementValues[29] < this.menu.shop.cash) {
      this.menu.achievements.achievementValues[29] = this.menu.shop.cash;
      this.menu.achievements.achievementList.achievements[29].check(this.menu.achievements);
    }
    if (!this.menu.achievements.achievementList.achievements[30].finished) {
      this.menu.achievements.achievementValues[30] += Math.floor(this.distanceTravelled / 15);
      this.menu.achievements.achievementList.achievements[30].check(this.menu.achievements);
    }
    this.menu.highscores.newHighscore([new Date().toString().substr(0, 24), Math.floor(this.distanceTravelled / 15) + "m", this.cash.toString() + "(+" + Math.max(Math.floor(((this.distanceTravelled / 15) - 500) * Math.min(1, this.distanceTravelled / ((4000 / (this.stages[this.stageNr].difficulty / 10)) * 15))), 0) + ")"]);
    this.gD.save.cash = this.menu.shop.cash;
    this.gD.save.highscores = this.menu.highscores.highscores;
  };
  this.show = function() {
    this.visible = true;
    var game = this;
    this.raf = requestAnimationFrame(function(timestamp){ updateGame(game, timestamp, true); });
    this.backgroundMusic.load();
    this.backgroundMusic.play();
    this.backgroundMusic.muted = this.gD.muted;
  };
  this.stop = function() {
    this.visible = false;
    this.endMusic.pause();
    this.init();
  };
}

function GamePlayer(x, y) {
  this.x = x;
  this.y = y;
  this.width = 0;
  this.height = 0;
  this.speedX = 0;
  this.gravity = 0.45;
  this.velocity = 0;
  this.secondJump = 0;                                //second jump status save
  this.onFloor = false;
  this.aboveFloor = false;                            //if the player is above a floor
  this.outsideWater = false;                          //in stage 3 is water
  this.outsideCanvas = false;                         //shows, if the player is fully outside the canvas, is for an achievement
  this.distanceBackwards = 0;                         //saves the distance travelled backwards for an achievement
  this.playerNr = 1;
  this.currentFloor = undefined;
  this.setPlayer = function(playerNr, game, gD) {               //sets the Player model
    this.playerNr = playerNr;
    this.width = gD.spriteDict["Player" + this.playerNr][2];
    this.height = gD.spriteDict["Player" + this.playerNr][3];
    if (playerNr == 7) {
      game.inventory.fill(10);
    }
  };
  this.draw = function(game, gD, ghostFactor) {
    var spriteKey = "Player" + this.playerNr;
    if (game.itemsActive[5]) {
      spriteKey = "Item6";
    }
    gD.context.drawImage(
      gD.spritesheet,
      gD.spriteDict[spriteKey][0], gD.spriteDict[spriteKey][1], gD.spriteDict[spriteKey][2], gD.spriteDict[spriteKey][3],
      this.x + (this.speedX * ghostFactor), this.y + (this.velocity * ghostFactor), this.width, this.height
    );
  };
  this.newPos = function(game, gD) {
    if (game.itemsActive[5]) {
      this.x += this.speedX;
      this.y -= (this.y - 50) / 40;
      this.onFloor = false;
      this.velocity = 0;
      this.secondJump = 1;
    } else {
      if (!this.onFloor || (this.currentFloor != undefined && this.currentFloor.type == 2)) {
        this.velocity += this.gravity;
        this.y += this.velocity;
        if (game.stageNr == 3) {
          if (this.y + this.height > game.gD.canvas.height / 2) {
            if (this.outsideWater) {
              this.velocity = 1;
            }
            this.outsideWater = false;
          } else {
            if (!this.outsideWater) {
              this.velocity = game.playerDict[game.player.playerNr.toString()][1] / 1.8;
            }
            this.outsideWater = true;
          }
        }
      }
      this.x += this.speedX;
      this.touchFloor(game, gD);
    }
    this.hitWalls(game, gD);
  };
  this.hitWalls = function(game, gD) {  //checks, if the player touches a canvas wall, or the floor of the current stage
    if (this.y + this.height > gD.canvas.height - game.stages[game.stageNr].deadZoneGround) {
      if (game.itemsActive[1]) {
        this.y = gD.canvas.height - game.stages[game.stageNr].deadZoneGround - this.height;
        this.velocity = 0;
        this.onFloor = true;
        this.secondJump = 1;
      } else {
        game.finish();
      }
    }

    if (this.x < 0) {
      this.x = 0;
    } else if (this.x + this.width > gD.canvas.width) {
      this.x = gD.canvas.width - this.width;
    }
  };
  this.touchFloor = function(game, gD) {
    for (var i = 0; i < game.floor.length; i++) {
      var floor = game.floor[i];
      if ((this.x > floor.x && this.x < floor.x + floor.width) ||
          (this.x + this.width > floor.x && this.x + this.width < floor.x + floor.width)) {
        if (this.currentFloor != undefined && this.y + this.height > this.currentFloor.y - (this.currentFloor.thickness / 2) && this.velocity > 0 && this.aboveFloor) {
          if (!gD.keys[game.menu.controls.keyBindings["Game4"][2][0]] && !gD.keys[game.menu.controls.keyBindings["Game4"][2][1]]) {
            switch (this.currentFloor.type) {
              case 1:
                this.velocity = -this.velocity * 0.9;
                break;
              case 2:
                this.currentFloor.isFalling = true;
                this.onFloor = true;
                this.velocity = 0;
                break;
              default:
                this.aboveFloor = false;
                this.onFloor = true;
                this.velocity = 0;
            }
            this.y = this.currentFloor.y - (this.currentFloor.thickness / 2) - this.height;
            this.secondJump = 1;
          } else {
            this.currentFloor = undefined;
          }
        }
        if (this.y + this.height < floor.y - (floor.thickness / 2)) {
          this.aboveFloor = true;
          if (this.currentFloor == undefined || floor.y - this.y < this.currentFloor.y - this.y) {
            this.currentFloor = floor;
          }
        }
      }
      if (i + 1 == game.floor.length && this.currentFloor != undefined &&
          (this.x > this.currentFloor.x + this.currentFloor.width || this.x + this.width < this.currentFloor.x) &&
          !(this.y == gD.canvas.height - game.stages[game.stageNr].deadZoneGround - this.height)) {
        this.aboveFloor = false;
        this.onFloor = false;
        this.currentFloor = undefined;
      }
    }
  };
  this.collect = function(object) {                   //checks if an object is touched by the player
    return !(
      (this.y + this.height < object.y) ||
      (this.y > object.y + object.height) ||
      (this.x + this.width < object.x) ||
      (this.x > object.x + object.width)
    );
  };
}

function GameFloor(x, y, width, type, thickness) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.type = type;
  this.thickness = thickness;
  this.gravity = 0.5;
  this.velocity = 0;
  this.isFalling = false;
  this.thorns = [];
  if (this.type == 3) {
    this.thorns.push(new GameThorns(this.x, this.y - 10 - (this.thickness / 2), 50, 10, "rgba(51, 102, 255, 1)"));
    this.thorns.push(new GameThorns(this.x + this.width - 50, this.y - 10 - (this.thickness / 2), 50, 10, "rgba(51, 102, 255, 1)"));
  }
  this.draw = function(game, gD, ghostFactor) {
    gD.context.beginPath();
    gD.context.moveTo(this.x + (game.globalSpeed * ghostFactor), this.y + (this.velocity * ghostFactor));
    gD.context.lineTo(this.x + this.width + (game.globalSpeed * ghostFactor), this.y + (this.velocity * ghostFactor));
    switch (this.type) {
      case 0:
        gD.context.strokeStyle = game.stages[game.stageNr].floorColor;
        break;
      case 1:
        gD.context.strokeStyle = "rgba(255, 102, 102, 1)";
        break;
      case 2:
        gD.context.strokeStyle = "rgba(0, 179, 89, 1)";
        break;
      case 3:
        gD.context.strokeStyle = "rgba(51, 102, 255, 1)";
        break;
      default:
        gD.context.strokeStyle = "rgba(155, 155, 155, 1)";
    }
    gD.context.lineWidth = thickness;
    gD.context.stroke();
    for (var i = 0; i < this.thorns.length; i++) {
      this.thorns[i].draw(game, gD, ghostFactor);
    }
  };
  this.newPos = function(game) {
    this.x += game.globalSpeed;
    if (this.isFalling && this.y < game.gD.canvas.height + 10) {
      this.velocity += this.gravity;
      this.y += this.velocity;
    }
    for (var i = 0; i < this.thorns.length; i++) {
      this.thorns[i].newPos(game);
    }
  };
}

function GameThorns(x, y, width, height, color) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.color = color;
  this.draw = function(game, gD, ghostFactor) {
    gD.context.beginPath();
    gD.context.moveTo(this.x + (game.globalSpeed * ghostFactor), this.y + this.height);
    for (var i = 1; i <= Math.floor(this.width / 10); i++) {
      gD.context.lineTo(this.x + (game.globalSpeed * ghostFactor) + (i * 10) - 5, this.y);
      gD.context.lineTo(this.x + (game.globalSpeed * ghostFactor) + (i * 10), this.y + this.height);
    }
    gD.context.lineTo(this.x + (game.globalSpeed * ghostFactor), this.y + this.height);
    gD.context.fillStyle = this.color;
    gD.context.fill();
  };
  this.newPos = function(game) {
    this.x += game.globalSpeed;
  };
}

function GameInventory() {
  this.items = [];
  this.texts = [];
  this.init = function() {

  };
  this.draw = function(game, gD, ghostFactor) {
    for (var i = 0; i < this.texts.length; i++) {
      this.texts.draw(game, gD, ghostFactor);
    }
  };
}

function GameInventoryItem(x, y, width, height, size, family, itemNr, maxDurability) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.size = size;
  this.family = family;
  this.itemNr = itemNr;
  this.maxDurability = maxDurability;
  this.backgroundcolor = "rgba(255, 255, 255, 0.4)";
  this.activationcolor = "rgba(0, 255, 0, 0.4)";
  this.textAlign = "end";
  this.textBaseline = "middle";
  this.textcolor = "rgba(0, 0, 0, 1)";
  this.bordercolor = "rgba(0, 0, 0, 1)";
  this.bordersize = 2;
  this.durability = 0;
  this.quantity = 0;
  this.used = 0;
  this.active = false;
  this.activate = function() {
    if (!this.active) {
      this.active = true;
      this.durability = this.maxDurability;
      this.quantity--;
      this.used++;
    }
  };
  this.update = function(game) {
    if (this.active) {
      if (this.durability > 0) {
        this.durability--;
      } else {
        this.active = false;
        switch (this.itemNr) {
          case 0:
            if (!game.menu.achievements.achievementList.achievements[12].finished) {
              game.menu.achievements.achievementValues[12] += (game.gD.itemBaseDur[i] + (game.menu.shop.level[i] * game.gD.itemPerLvlDur[i])) / 50;
              game.menu.achievements.achievementList.achievements[12].check(game.menu.achievements);
            }
            break;
          case 1:
            if (game.player.y == game.gD.canvas.height - game.stages[game.stageNr].deadZoneGround - game.player.height) {
              game.player.onFloor = false;
            }
            break;
          default:
            break;
        }
      }
    }
  };
  this.draw = function(game, gD, ghostFactor) {
    var itemRef = gD.spriteDict["Item" + this.itemNr];

    gD.context.fillStyle = this.backgroundcolor;
    gD.context.fillRect(this.x, this.y, this.width, this.height);
    gD.context.fillStyle = this.activationcolor;
    gD.context.fillRect(this.x + 1, this.y + 1, this.duration * ((this.width - 2) / this.maxDuration), this.height - 2);
    gD.context.drawImage(gD.spritesheet, itemRef[0], itemRef[1], itemRef[2], itemRef[3],
      this.x + 2, this.y + Math.floor((this.height / itemRef[3]) / 2), itemRef[2], itemRef[3]);
    gD.context.textAlign = this.textAlign;
    gD.context.textBaseline = this.textBaseline;
    gD.context.font = this.size + " " + this.family;
    gD.context.fillStyle = this.textcolor;
    gD.context.fillText(this.quantity.toString(), this.x + this.width - 3, this.y + (this.height / 2));
    gD.context.lineWidth = this.bordersize;
    gD.context.strokeStyle = this.bordercolor;
    gD.context.strokeRect(this.x, this.y, this.width, this.height);
  };
}

function GameObject(x, y, width, height, name, value) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.name = name;
  this.value = value;
  this.draw = function(game, gD, ghostFactor) {
    gD.context.drawImage(gD.spritesheet, gD.spriteDict[this.name][0], gD.spriteDict[this.name][1], gD.spriteDict[this.name][2], gD.spriteDict[this.name][3],
      this.x + (game.globalSpeed * ghostFactor), this.y, gD.spriteDict[this.name][2], gD.spriteDict[this.name][3]);
  };
  this.newPos = function(game) {
    this.x += game.globalSpeed;

    if (game.itemsActive[4]) {
      var distX = (game.player.x + (game.player.width / 2)) - (this.x + (this.width / 2));
      var distY = (game.player.y + (game.player.height / 2)) - (this.y + (this.height / 2));
      var distanceToPlayer = Math.sqrt(Math.pow(distX, 2) + Math.pow(distY, 2));
      if (distanceToPlayer < 80) {
        this.x += 10 * distX / distanceToPlayer;
        this.y += 10 * distY / distanceToPlayer;
      }
    }
  };
}

function GameModal(x, y, width, height, color) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.color = color;
  this.texts = [];
  this.buttons = [];
  this.selected = 0;
  this.init = function() {
    this.buttons[this.selected].select();
  };
  this.draw = function(gD) {
    gD.context.fillStyle = this.color;
    gD.context.fillRect(this.x, this.y, this.width, this.height);
    for (var i = 0; i < this.texts.length; i++) {
      this.texts[i].draw(gD);
    }
    gD.context.filter = "none";
    for (var i = 0; i < this.buttons.length; i++) {
      this.buttons[i].draw(gD);
    }
  };
}

function addFloor(game, gD) {
  var sum = gD.floorProb.reduce(function(a, b){return a + b;}, 0);
  var random = Math.random();
  var limit = 0;
  for (var i = 0; i < gD.floorProb.length; i++) {
    limit += gD.floorProb[i];
    if (random * sum <= limit) {
      var maxY = 140;
      var maxWidth = 400 - (game.distanceTravelled * 0.005);
      var minWidth = 50;
      var maxDist = 120;
      var widthStep = 1;
      if (game.distanceTravelled < 4500) {
        i = 0;
      }
      switch (i) {
        case 0:
          break;
        case 1:
          maxWidth = 300 - (game.distanceTravelled * 0.005);
          minWidth = 60;
          break;
        case 2:
          maxWidth = 200 - (game.distanceTravelled * 0.005);
          break;
        case 3:
          maxY = 30;
          widthStep = 10;
          maxDist = 100;
          break;
        default:
          break;
      }
      var y = (Math.random() * (gD.canvas.height - 140)) + 90;
      if (Math.abs(game.floor[game.floor.length - 1].y - y) > maxY) {
        if (game.floor[game.floor.length - 1].y < y) {
          y = game.floor[game.floor.length - 1].y + maxY;
        } else {
          y = game.floor[game.floor.length - 1].y - maxY;
        }
      }
      game.floor.push(new GameFloor(
        gD.canvas.width + 50 + (Math.random() * maxDist),
        Math.floor(y) + 0.5,
        Math.max(Math.floor((Math.random() * maxWidth) / widthStep) * widthStep, minWidth),
        i,
        5
      ));
      break;
    }
  }
}

function addMoney(game, gD) {
  var sum = game.currentMoneyProb.reduce(function(a, b){return a + b;}, 0);
  var random = Math.random();
  var limit = 0;
  for(var i = 0; i < game.currentMoneyProb.length; i++) {
    limit += game.currentMoneyProb[i];
    if (random * sum <= limit) {
      if (60 + (random * (gD.canvas.height - 110)) <= game.floor[game.floor.length - 1].y + 4 && 60 + (random * (gD.canvas.height - 110)) + 17 >= game.floor[game.floor.length - 1].y - 4) {
        random -= (gD.spriteDict["Money" + (i + 1)][3] + 5) / (gD.canvas.height - 110);
      }
      game.moneyObjects.push(new GameObject(
        gD.canvas.width + 20,
        60 + (random * (gD.canvas.height - 110)),
        gD.spriteDict["Money" + (i + 1)][2],
        gD.spriteDict["Money" + (i + 1)][3],
        "Money" + (i + 1),
        Math.pow(10, i)
      ));
      break;
    }
  }
  game.moneySpawnCounter = Math.max(Math.floor(Math.random() * (400 - (game.distanceTravelled * 0.001))), 15);
}

function addItem(game, gD) {
  var sum = gD.itemProb.reduce(function(a, b){return a + b;}, 0);
  var random = Math.random();
  var limit = 0;
  for(var i = 0; i < gD.itemProb.length; i++) {
    limit += gD.itemProb[i];
    if (random * sum <= limit) {
      random = Math.random();
      if (50 + (random * (gD.canvas.height - 140)) <= game.floor[game.floor.length - 1].y + 4 && 50 + (random * (gD.canvas.height - 140)) + gD.spriteDict["Item" + (i + 1)][3] >= game.floor[game.floor.length - 1].y - 4) {
        random -= (gD.spriteDict["Item" + (i + 1)][3] + 5) / (gD.canvas.height - 140);
      }
      game.itemObjects.push(new GameObject(
        gD.canvas.width + 20,
        50 + (random * (gD.canvas.height - 140)),
        gD.spriteDict["Item" + (i + 1)][2],
        gD.spriteDict["Item" + (i + 1)][3],
        "Item" + (i + 1),
        i
      ));
      break;
    }
  }
  game.itemSpawnCounter = Math.max(Math.floor(Math.random() * (2200 - (game.distanceTravelled * 0.001))), 700);
}

function gameControlDown(game, key) {
  if (!game.finished && !game.paused) {
    for(var i = 0; i < game.gD.itemProb.length; i++) {
      if (game.menu.controls.keyBindings["Game" + (i + 6)][2].includes(key) && game.inventory[i] > 0 && !game.itemsActive[i]) {
        game.itemsActive[i] = true;
        game.itemTimer[i] = game.gD.itemBaseDur[i] + (game.menu.shop.level[i] * game.gD.itemPerLvlDur[i]);
        game.inventory[i]--;
        game.itemsUsed[i]++;
        if (!game.menu.achievements.achievementList.achievements[23].finished && i == 1 && game.player.y > game.gD.canvas.height - 30 - game.player.height) {
          game.menu.achievements.achievementValues[23]++;
          game.menu.achievements.achievementList.achievements[23].check(game.menu.achievements);
        }
        break;
      }
    }
    var temp = game.itemsUsed.reduce(function(a, b){b > 0 ? a++ : a; return a;}, 0);
    if (!game.menu.achievements.achievementList.achievements[4].finished && game.menu.achievements.achievementValues[4] < temp) {
      game.menu.achievements.achievementValues[4] = temp;
      game.menu.achievements.achievementList.achievements[4].check(game.menu.achievements);
    }
    for(var i = 5; i < 11; i++) {
      if (!game.menu.achievements.achievementList.achievements[i].finished && game.menu.achievements.achievementValues[i] < game.itemsUsed[i - 5]) {
        game.menu.achievements.achievementValues[i] = game.itemsUsed[i - 5];
        game.menu.achievements.achievementList.achievements[i].check(game.menu.achievements);
      }
    }
    var temp = game.itemsActive.reduce(function(a, b){b ? a++ : a; return a;}, 0);
    if (!game.menu.achievements.achievementList.achievements[11].finished && game.menu.achievements.achievementValues[11] < temp) {
      game.menu.achievements.achievementValues[11] = temp;
      game.menu.achievements.achievementList.achievements[11].check(game.menu.achievements);
    }
    if (game.menu.controls.keyBindings["Game1"][2].includes(key)) {                                  //pause game
      game.pause();
    } else if (game.menu.controls.keyBindings["Game2"][2].includes(key)) {              //move forward
      game.player.speedX = game.playerDict[game.player.playerNr.toString()][2];
    } else if (game.menu.controls.keyBindings["Game3"][2].includes(key)) {              //move backwards
      game.player.speedX = game.playerDict[game.player.playerNr.toString()][3];
    } else if (game.menu.controls.keyBindings["Game4"][2].includes(key) && game.player.onFloor) {       //down from platform
      game.player.onFloor = false;
      game.player.currentFloor = undefined;
      game.player.secondJump = 1;
    } else if (game.menu.controls.keyBindings["Game5"][2].includes(key) && game.stageNr == 3 && game.player.y + game.player.height >= game.gD.canvas.height / 2) {        //jump inside the water
      game.player.velocity = game.playerDict[game.player.playerNr.toString()][1] / 3;
      game.player.onFloor = false;
      game.player.secondJump = 0;
    } else if (game.menu.controls.keyBindings["Game5"][2].includes(key) && game.player.onFloor) {      //jump
      if (game.stageNr == 5) {
        game.player.velocity = game.playerDict[game.player.playerNr.toString()][1] / 2.9;
      } else {
        game.player.velocity = game.playerDict[game.player.playerNr.toString()][1];
      }
      game.player.onFloor = false;
      game.player.secondJump = 0;
      if (!game.menu.achievements.achievementList.achievements[22].finished) {
        game.menu.achievements.achievementValues[22]++;
        game.menu.achievements.achievementList.achievements[22].check(game.menu.achievements);
      }
    } else if (game.menu.controls.keyBindings["Game5"][2].includes(key) && game.player.secondJump % 2 == 1 && game.player.secondJump < (game.playerDict[game.player.playerNr.toString()][0] - 1) * 2) {          //jump
      if (game.stageNr == 5) {
        game.player.velocity = game.playerDict[game.player.playerNr.toString()][1] / 2.9;
      } else {
        game.player.velocity = game.playerDict[game.player.playerNr.toString()][1];
      }
      game.player.secondJump++;
      if (!game.menu.achievements.achievementList.achievements[2].finished && game.player.secondJump == 2) {
        game.menu.achievements.achievementValues[2]++;
        game.menu.achievements.achievementList.achievements[2].check(game.menu.achievements);
      }
      if (!game.menu.achievements.achievementList.achievements[22].finished) {
        game.menu.achievements.achievementValues[22]++;
        game.menu.achievements.achievementList.achievements[22].check(game.menu.achievements);
      }
    }
  } else if (game.paused) {
    if (game.menu.controls.keyBindings["FinishModal1"][2].includes(key) || game.menu.controls.keyBindings["FinishModal2"][2].includes(key)) {   //navigation up or down keys
      game.pauseModal.buttons[game.pauseModal.selected].deselect();
      game.pauseModal.buttons[(game.pauseModal.selected + 1) % 2].select();
      game.pauseModal.selected = (game.pauseModal.selected + 1) % 2;
      drawGame(game, 0);
    } else if (game.menu.controls.keyBindings["FinishModal3"][2].includes(key)) {                     //enter key
      switch (game.pauseModal.selected) {
        case 1:
          game.stop();
          game.menu.show();
          break;
        default:
          game.continue();
          break;
      }
    } else if (game.menu.controls.keyBindings["Game1"][2].includes(key)) {                                  //pause game
      game.continue();
    }
  } else if (game.finished) {
    if (game.menu.controls.keyBindings["FinishModal3"][2].includes(key)) {
      switch (game.finishModal.selected) {
        case 0:
          var playerNr = game.player.playerNr;
          game.endMusic.pause();
          game.init();
          game.player.setPlayer(playerNr, game, game.gD);
          game.show();
          break;
        default:
          game.stop();
          game.menu.show();
          break;
      }
    } else if (game.menu.controls.keyBindings["FinishModal1"][2].includes(key) || game.menu.controls.keyBindings["FinishModal2"][2].includes(key)) {
      game.finishModal.buttons[game.finishModal.selected].deselect();
      game.finishModal.buttons[(game.finishModal.selected + 1) % 2].select();
      game.finishModal.selected = (game.finishModal.selected + 1) % 2;
      drawGame(game, 0);
    }
  }
}

function gameControlUp(game, key) {
  if (game.menu.controls.keyBindings["Game3"][2].includes(key) && !(game.gD.keys[game.menu.controls.keyBindings["Game2"][2][0]] || game.gD.keys[game.menu.controls.keyBindings["Game2"][2][1]])) {              //move backwards released
    game.player.speedX = 0;
    if (!game.menu.achievements.achievementList.achievements[21].finished && game.player.distanceBackwards != 0) {
      game.menu.achievements.achievementValues[21] += Math.floor(game.player.distanceBackwards / 15);
      game.menu.achievements.achievementList.achievements[21].check(game.menu.achievements);
    }
    game.player.distanceBackwards = 0;
  } else if (game.menu.controls.keyBindings["Game2"][2].includes(key) && !(game.gD.keys[game.menu.controls.keyBindings["Game3"][2][0]] || game.gD.keys[game.menu.controls.keyBindings["Game3"][2][1]])) {       //move forward released
    game.player.speedX = 0;
  } else if (game.menu.controls.keyBindings["Game5"][2].includes(key) && game.player.secondJump % 2 == 0 && game.player.secondJump < ((game.playerDict[game.player.playerNr.toString()][0] - 1) * 2) - 1) {                                  //jump released
    game.player.secondJump++;
  }
}

function gameMouseMove(game) {
  if (game.paused) {
    for (var i = 0; i < game.pauseModal.buttons.length; i++) {
      if (game.gD.mousePos.x >= game.pauseModal.buttons[i].x && game.gD.mousePos.x <= game.pauseModal.buttons[i].x + game.pauseModal.buttons[i].width &&
          game.gD.mousePos.y >= game.pauseModal.buttons[i].y && game.gD.mousePos.y <= game.pauseModal.buttons[i].y + game.pauseModal.buttons[i].height) {
        game.pauseModal.buttons[game.pauseModal.selected].deselect();
        game.pauseModal.buttons[i].select();
        game.pauseModal.selected = i;
        break;
      }
    }
    drawGame(game, 0);
  } else if (game.finished) {
    for (var i = 0; i < game.finishModal.buttons.length; i++) {
      if (game.gD.mousePos.x >= game.finishModal.buttons[i].x && game.gD.mousePos.x <= game.finishModal.buttons[i].x + game.finishModal.buttons[i].width &&
          game.gD.mousePos.y >= game.finishModal.buttons[i].y && game.gD.mousePos.y <= game.finishModal.buttons[i].y + game.finishModal.buttons[i].height) {
        game.finishModal.buttons[game.finishModal.selected].deselect();
        game.finishModal.buttons[i].select();
        game.finishModal.selected = i;
        break;
      }
    }
    drawGame(game, 0);
  }
}

function gameClick(game) {
  if (game.paused) {
    if (game.gD.mousePos.x >= game.pauseModal.buttons[game.pauseModal.selected].x && game.gD.mousePos.x <= game.pauseModal.buttons[game.pauseModal.selected].x + game.pauseModal.buttons[game.pauseModal.selected].width &&
        game.gD.mousePos.y >= game.pauseModal.buttons[game.pauseModal.selected].y && game.gD.mousePos.y <= game.pauseModal.buttons[game.pauseModal.selected].y + game.pauseModal.buttons[game.pauseModal.selected].height) {
      switch (game.pauseModal.selected) {
        case 1:
          game.stop();
          game.menu.show();
          break;
        default:
          game.continue();
          break;
      }
    }
  } else if (game.finished) {
    if (game.gD.mousePos.x >= game.finishModal.buttons[game.finishModal.selected].x && game.gD.mousePos.x <= game.finishModal.buttons[game.finishModal.selected].x + game.finishModal.buttons[game.finishModal.selected].width &&
        game.gD.mousePos.y >= game.finishModal.buttons[game.finishModal.selected].y && game.gD.mousePos.y <= game.finishModal.buttons[game.finishModal.selected].y + game.finishModal.buttons[game.finishModal.selected].height) {
      switch (game.finishModal.selected) {
        case 0:
          var playerNr = game.player.playerNr;
          game.endMusic.pause();
          game.init();
          game.player.setPlayer(playerNr, game, game.gD);
          game.show();
          break;
        default:
          game.stop();
          game.menu.show();
          break;
      }
    }
  }
}

function gameWheel(game, event) {

}

function updateGame(game, timestamp, resetTime) {
  if (resetTime) {
    game.startts = timestamp;
  }

  if (!game.finished && !game.paused) {
    game.raf = requestAnimationFrame(function(timestamp){ updateGame(game, timestamp, false); });
  }

  game.timeDiff = timestamp - game.startts; //relative time in seconds
  game.lag += game.timeDiff;
  
  while (game.lag > game.refreshrate) {

    game.frameCounter += 1;
  
    if (game.itemsActive[5]) {                         //if rocket is active
      game.moneySpawnCounter -= 5;
      game.itemSpawnCounter -= 5;
      var max = game.gD.itemBaseDur[5] + (game.menu.shop.level[5] * game.gD.itemPerLvlDur[5]);
      game.globalSpeed = Math.min(Math.pow((-game.itemTimer[5] + 5 + (max / 2)) / (max / 5), 4) - 40, Math.ceil(game.globalBaseSpeed - (game. distanceTravelled * 0.00015)));
      game.distanceTravelled += -game.globalSpeed;
    } else if (game.itemsActive[0]) {                  //if stopwatch is active
      game.moneySpawnCounter -= 0.05;
      game.itemSpawnCounter -= 0.05;
      game.globalSpeed = -0.1;
      game.distanceTravelled += -game.globalSpeed;
    } else {                                           //else
      game.moneySpawnCounter -= Math.floor(1 + (game.distanceTravelled * 0.00005));  //after 1333m the counter is counted down by 2
      game.itemSpawnCounter -= Math.floor(1 + (game.distanceTravelled * 0.00005));  //after 1333m the counter is counted down by 2
      game.currentMoneyProb[2] = Math.min(game.distanceTravelled * 0.00022, 5);   //after 1500m it's nearly at 5
      game.currentMoneyProb[3] = Math.min(game.distanceTravelled * 0.000066, 2);   //after 2000m it's nearly at 20
      game.globalSpeed = Math.ceil(game.globalBaseSpeed - (game.distanceTravelled * 0.00015));
      game.distanceTravelled += -game.globalSpeed;
    }
  
    if (game.stageNr == 5) {
      game.player.gravity = 0.05;
    } else if (game.itemsActive[2]) {
      game.player.gravity = 0.1;
    } else if (game.stageNr == 3 && game.player.y + game.player.height >= game.gD.canvas.height / 2) {
      game.player.gravity = 0.1;
    } else {
      game.player.gravity = 0.45;
    }
  
    if (game.itemsActive[3]) {
      game.moneySpawnCounter = 0;
    }
  
    switch (game.stageNr) {
      case 1:
        updateStage1(game, game.stages[game.stageNr]);
        break;
      case 2:
        updateStage2(game, game.stages[game.stageNr]);
        break;
      case 3:
        updateStage3(game, game.stages[game.stageNr]);
        break;
      case 4:
        updateStage4(game, game.stages[game.stageNr]);
        break;
      case 5:
        updateStage5(game, game.stages[game.stageNr]);
        break;
      default:
        updateStage0(game, game.stages[game.stageNr]);
    }
  
    for (var i = 18; i < 21; i++) {
      if (!game.menu.achievements.achievementList.achievements[i].finished && game.menu.achievements.achievementValues[i] < Math.floor(game.  distanceTravelled / 15)) {
        game.menu.achievements.achievementValues[i] = Math.floor(game.distanceTravelled / 15);
        game.menu.achievements.achievementList.achievements[i].check(game.menu.achievements);
        if (i == 19 && game.menu.achievements.achievementList.achievements[i].finished) {
          game.gD.playerUnlocked[4] = true;
          game.gD.save.playerUnlocked = game.gD.playerUnlocked;
        }
      }
    }
  
    if (game.floor[game.floor.length - 1].x + game.floor[game.floor.length - 1].width < game.gD.canvas.width) {
      addFloor(game, game.gD);
    }
    if (game.floor[0].x + game.floor[0].width < 0) {
      game.floor.shift();
    }
  
    if (game.moneySpawnCounter <= 0) {
      addMoney(game, game.gD);
    }
    if (game.moneyObjects[0] != undefined && game.moneyObjects[0].x + game.moneyObjects[0].width < 0) {
      game.moneyObjects.shift();
    }
  
    if (game.itemSpawnCounter <= 0) {
      addItem(game, game.gD);
    }
    if (game.itemObjects[0] != undefined && game.itemObjects[0].x + game.itemObjects[0].width < 0) {
      game.itemObjects.shift();
    }
  
    if (game.player.speedX < 0) {
      game.player.distanceBackwards += Math.abs(game.player.speedX);
    }
  
    game.player.newPos(game, game.gD);
  
    for (var i = 0; i < game.floor.length; i++) {
      game.floor[i].newPos(game);
      if (game.floor[i].type == 3) {
        for (var j = 0; j < game.floor[i].thorns.length; j++) {
          if (game.player.collect(game.floor[i].thorns[j]) && !game.itemsActive[1] && !game.itemsActive[5]) {
            game.finish();
          }
        }
      }
    }
  
    for (var i = 0; i < game.moneyObjects.length; i++) {
      game.moneyObjects[i].newPos(game);
      if (game.player.collect(game.moneyObjects[i])) {
        game.cash += game.moneyObjects[i].value;
        if (!game.menu.achievements.achievementList.achievements[3].finished && game.moneyObjects[i].value == 1000) {
          game.menu.achievements.achievementValues[3]++;
          game.menu.achievements.achievementList.achievements[3].check(game.menu.achievements);
        }
        game.moneyObjects.splice(i, 1);
        i--;
        if (!game.menu.achievements.achievementList.achievements[0].finished) {
          game.menu.achievements.achievementValues[0]++;
          game.menu.achievements.achievementList.achievements[0].check(game.menu.achievements);
        }
      }
    }
  
    for (var i = 14; i < 18; i++) {
      if (!game.menu.achievements.achievementList.achievements[i].finished && game.menu.achievements.achievementValues[i] < game.cash) {
        game.menu.achievements.achievementValues[i] = game.cash;
        game.menu.achievements.achievementList.achievements[i].check(game.menu.achievements);
        if (i == 16 && game.menu.achievements.achievementList.achievements[i].finished) {
          game.gD.playerUnlocked[3] = true;
          game.gD.save.playerUnlocked = game.gD.playerUnlocked;
        }
      }
    }
  
    for (var i = 0; i < game.itemObjects.length; i++) {
      game.itemObjects[i].newPos(game);
      if (game.player.collect(game.itemObjects[i])) {
        game.inventory[game.itemObjects[i].value]++;
        if (!game.menu.achievements.achievementList.achievements[1].finished && game.itemObjects[i].value == 3) {
          game.menu.achievements.achievementValues[1]++;
          game.menu.achievements.achievementList.achievements[1].check(game.menu.achievements);
        }
        game.itemObjects.splice(i, 1);
        i--;
      }
    }
  
    if (game.goldenShamrock) {
      game.goldenShamrock.newPos(game);
      if (game.player.collect(game.goldenShamrock)) {
        game.goldenShamrock = false;
        for(var i = 31; i < 35; i++) {
          if (!game.menu.achievements.achievementList.achievements[i].finished) {
            game.menu.achievements.achievementValues[i]++;
            game.menu.achievements.achievementList.achievements[i].check(game.menu.achievements);
            if (i == 34 && game.menu.achievements.achievementList.achievements[i].finished) {
              game.menu.shop.cash += 1000000;
              game.gD.save.cash = game.menu.shop.cash;
            }
          }
        }
      }
    }
  
    game.cashLabel.text = "Hype: " + Math.floor(game.cash);
  
    game.distanceLabel.text = "Distance: " + Math.floor(game.distanceTravelled / 15) + "m";

    game.fpsLabel.text = "Fps: " + Math.floor(1000 / game.timeDiff);
  
    for (var i = game.itemTimer.length - 1; i >= 0; i--) {
      if (game.itemTimer[i] > 0) {
        game.itemTimer[i]--;
        if (game.itemTimer[i] == 0) {
          game.itemsActive[i] = false;
          switch (i) {
            case 0:
              if (!game.menu.achievements.achievementList.achievements[12].finished) {
                game.menu.achievements.achievementValues[12] += (game.gD.itemBaseDur[i] + (game.menu.shop.level[i] * game.gD.itemPerLvlDur[i])) / 50;
                game.menu.achievements.achievementList.achievements[12].check(game.menu.achievements);
              }
              break;
            case 1:
              if (game.player.y == game.gD.canvas.height - game.stages[game.stageNr].deadZoneGround - game.player.height) {
                game.player.onFloor = false;
              }
              break;
            default:
              break;
          }
        }
      }
    }
  
    if (game.finished) {
      game.finishModal.texts[1].text = "Cash: " + Math.floor(game.cash);
      game.finishModal.texts[2].text = "Distanz: " + Math.floor(game.distanceTravelled / 15) + "m";
      game.finishModal.texts[3].text = "Distanzbonus: +" + Math.max(Math.floor(((game.distanceTravelled / 15) - 500) * Math.min(1, game.distanceTravelled /  ((4000 / (game.stages[game.stageNr].difficulty / 10)) * 15))), 0);
    }
  
    for (var i = 0; i < game.gD.stagesUnlocked.length; i++) {
      if (game.stageNr == i && game.distanceTravelled > 15000 + (i * 4500)) {
        game.gD.stagesUnlocked[i] = true;
        game.gD.save.stagesUnlocked = game.gD.stagesUnlocked;
      }
    }
  
    if (game.lag > game.refreshrate * 5) {
      game.lag %= game.refreshrate;
    } else {
      game.lag -= game.refreshrate;
    }
  }

  drawGame(game, game.lag / game.refreshrate);
  game.startts = timestamp;
}

function drawGame(game, ghostFactor) {
  game.clear();

  switch (game.stageNr) {
    case 1:
      drawBackgroundStage1(game, game.stages[game.stageNr], ghostFactor);
      break;
    case 2:
      drawBackgroundStage2(game, game.stages[game.stageNr], ghostFactor);
      break;
    case 3:
      drawBackgroundStage3(game, game.stages[game.stageNr], ghostFactor);
      break;
    case 4:
      drawBackgroundStage4(game, game.stages[game.stageNr], ghostFactor);
      break;
    case 5:
      drawBackgroundStage5(game, game.stages[game.stageNr], ghostFactor);
      break;
    default:
      drawBackgroundStage0(game, game.stages[game.stageNr], ghostFactor);
  }

  if (game.player.y + game.player.height < 0) {
    game.gD.context.drawImage(game.gD.spritesheet, game.gD.spriteDict["Pointer"][0], game.gD.spriteDict["Pointer"][1], game.gD.spriteDict["Pointer"][2], game.gD.spriteDict["Pointer"][3],
      game.player.x + ((game.player.width - game.gD.spriteDict["Pointer"][2]) / 2), 0, game.gD.spriteDict["Pointer"][2], game.gD.spriteDict["Pointer"][3]);
    if (!game.menu.achievements.achievementList.achievements[13].finished && !game.player.outsideCanvas) {
      game.menu.achievements.achievementValues[13]++;
      game.menu.achievements.achievementList.achievements[13].check(game.menu.achievements);
      game.player.outsideCanvas = true;
    }
  } else {
    game.player.outsideCanvas = false;
  }

  for (var i = 0; i < game.floor.length; i++) {
    game.floor[i].draw(game, game.gD, ghostFactor);
  }

  for (var i = 0; i < game.moneyObjects.length; i++) {
    game.moneyObjects[i].draw(game, game.gD, ghostFactor);
  }

  for (var i = 0; i < game.itemObjects.length; i++) {
    game.itemObjects[i].draw(game, game.gD, ghostFactor);
  }

  for (var i = 0; i < game.inventoryTexts.length; i++) {
    game.inventoryTexts[i].draw(game, game.gD);
  }

  for (var i = 0; i < game.itemTimer.length; i++) {
    if (game.itemTimer[i] > 0) {
      game.gD.context.fillStyle = "rgba(0, 255, 0, 1)";
      game.gD.context.fillRect(10 + (i * 60), 30, game.itemTimer[i] * (50 / (game.gD.itemBaseDur[i] + (game.menu.shop.level[i] * game.gD.itemPerLvlDur[i]))), 5);  //50 is the maxWidth
    }
  }

  if (game.goldenShamrock) {
    game.goldenShamrock.draw(game, game.gD, ghostFactor);
  }

  game.cashLabel.draw(game.gD);

  game.distanceLabel.draw(game.gD);

  switch (game.stageNr) {
    case 1:
      drawForegroundStage1(game, game.stages[game.stageNr], ghostFactor);
      break;
    case 2:
      drawForegroundStage2(game, game.stages[game.stageNr], ghostFactor);
      break;
    case 3:
      drawForegroundStage3(game, game.stages[game.stageNr], ghostFactor);
      break;
    case 4:
      drawForegroundStage4(game, game.stages[game.stageNr], ghostFactor);
      break;
    case 5:
      drawForegroundStage5(game, game.stages[game.stageNr], ghostFactor);
      break;
    default:
      drawForegroundStage0(game, game.stages[game.stageNr], ghostFactor);
  }

  game.fpsLabel.draw(game.gD);

  if (game.paused) {
    game.pauseModal.draw(game.gD);
  }

  if (game.finished) {
    game.gD.context.filter = "drop-shadow(0px 0px 5px red)";
    game.finishModal.draw(game.gD);
  }
}