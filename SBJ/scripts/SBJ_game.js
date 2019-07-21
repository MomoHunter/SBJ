function Game(menu, gD) {
  this.menu = menu;
  this.gD = gD;
  this.init = function () {
    this.player = null;
    this.players = [];
    this.stage = null;
    this.trainingMode = false;
    this.paused = false;
    this.continued = false;
    this.finished = false;
    this.startTime = null;
    this.baseLevelLength = 125 * 15;
    this.globalSpeed = 2;
    this.currentLevel = 1;
    this.distance = 0;
    this.distanceSinceLvlUp = 0;
    this.floors = [new GameFloor(0, this.gD.canvas.height - 49.5, this.gD.canvas.width + 100, "Standard")];
    this.helpFloor = null;
    this.floorStartIndex = 0;
    this.objects = [new GameObject(1070, 278, 30, 40, "Money_1")];
    this.objectStartIndex = 0;
    this.showLevel = 180;
    this.showConfirmation = false;
    this.showTutorial = true;
    this.currentMoneyProbability = {};
    for (let money in this.gD.money) {
      if (this.gD.money.hasOwnProperty(money)) {
        this.currentMoneyProbability[money] = this.gD.money[money][0];
      }
    }
    
    this.inventory = new GameInventory();
    this.inventory.init(this, gD);
    this.confirmationWindow = new GameConfirmationWindow(
      this.gD.canvas.width / 2 - 100, this.gD.canvas.height / 2 - 45, 200, 100, "confirmationWindow"
    );
    this.confirmationWindow.init();
    this.endScreen = new GameEndScreen(0, 0, this.gD.canvas.width, this.gD.canvas.height, "endScreen");
    this.endScreen.init();
    this.updateSelection(0);
  };
  this.handleEvent = function(eventKey, addedValue = 1) {
    if (!this.trainingMode) {
      this.menu.handleEvent(eventKey, addedValue);
    }
  };
  this.setStage = function(stage, training = false) {
    let stageClass = this.gD.stages[stage][1];
    this.stage = new stageClass(this, this.gD);
    this.stage.init();
    this.trainingMode = training;
  };
  this.setPlayer = function(player) {
    this.player = player;
  };
  this.setStartTime = function() {
    this.startTime = Date.now();
  };
  this.addPlayer = function(character, hat, glasses, beard, main = false, name = "") {
    let player = new GamePlayer(this.players.length * 35 + 20, 260, character, name, hat, glasses, beard);
    player.init(this, this.gD);
    this.players.push(player);
    if (main) {
      this.setPlayer(player);
    }
    if (this.trainingMode) {
      this.player.inventory.fill(2);
    }
  };
  this.speedLvlUp = function() {
    if (this.distanceSinceLvlUp >= this.baseLevelLength * Math.min(this.currentLevel * 0.5 + 1.5, 12)) {
      this.currentLevel++;
      this.showLevel = 180;
      this.distanceSinceLvlUp = this.inventory.getValue("distance") - this.getLevelStart(this.currentLevel);
      if (!this.inventory.items["Item_Stopwatch"].active && !this.inventory.items["Item_Rocket"].active) {
        this.globalSpeed = Math.min(this.currentLevel * 0.5 + 1.5, 12);
      }
      if (this.currentLevel <= 20) {
        this.currentMoneyProbability["Money_1"] = this.currentMoneyProbability["Money_1"] - 0.1;
        this.currentMoneyProbability["Money_10"] = this.currentMoneyProbability["Money_10"] - 0.1;
        this.currentMoneyProbability["Money_100"] = this.currentMoneyProbability["Money_100"] + 0.1;
        this.currentMoneyProbability["Money_1000"] = this.currentMoneyProbability["Money_1000"] + 0.05;
      }
      if (this.currentLevel % 5 === 4) {
        let {spriteWidth, spriteHeight} = getSpriteData("Special_GoldenShamrock", this.gD);
        
        this.objects.push(new GameObject(
          randomBetween(this.getLevelStart(this.currentLevel + 1), this.getLevelStart(this.currentLevel + 2)), 
          randomBetween(50, 320), spriteWidth, spriteHeight, "Special_GoldenShamrock"
        ));
      }
    }
  };
  this.getLevelStart = function(level) {
    let distance = 0;
    for (let i = 1; i < level; i++) {
      distance += (i * 0.5 + 1.5) * this.baseLevelLength;
    }
    return distance;
  };
  this.addFloors = function() {
    let total = 0;
    let random = 0;
    let pieces = null;
    let startX = this.floors[this.floors.length - 1].x + this.floors[this.floors.length - 1].width;
    
    this.gD.floorPieces.map(floorPiece => {
      if (floorPiece.earliestLevel <= this.currentLevel && floorPiece.stages.includes(this.stage.name)) {
        total += floorPiece.chance;
      }
    }, this);
    
    random = Math.random() * total;
 
    this.gD.floorPieces.map(floorPiece => {
      if (floorPiece.earliestLevel <= this.currentLevel && floorPiece.stages.includes(this.stage.name)) {
        random -= floorPiece.chance;
        if (random <= 0 && pieces === null) {
          pieces = floorPiece;
        }
      }
    }, this);
    
    if (pieces !== null) {
      pieces.floors.map(floor => {
        let newFloor = new GameFloor(
          startX + floor.x, floor.y, floor.width, 
          floor.type, floor.height ? floor.height : 0
        );
        newFloor.init(this);
        this.floors.push(newFloor);
      }, this);
    }
  };
  this.addMoney = function() {
    let total = 0;
    let random = 0;
    for (let prob in this.currentMoneyProbability) {
      if (this.currentMoneyProbability.hasOwnProperty(prob)) {
        total += this.currentMoneyProbability[prob];
      }
    }
    
    random = Math.random() * total;
    
    for (let prob in this.currentMoneyProbability) {
      if (this.currentMoneyProbability.hasOwnProperty(prob)) {
        random -= this.currentMoneyProbability[prob];
        if (random <= 0) {
          let {spriteWidth, spriteHeight} = getSpriteData(prob, this.gD);
          if (this.inventory.items["Item_Treasure"].active) {
            this.objects.push(new GameObject(
              this.distance + this.gD.canvas.width + randomBetween(150, 300), randomBetween(50, 310),
              spriteWidth, spriteHeight, prob
            ));
            break;
          } else {
            this.objects.push(new GameObject(
              this.distance + this.gD.canvas.width + randomBetween(150, 1100), randomBetween(50, 310),
              spriteWidth, spriteHeight, prob
            ));
            break;
          }
        }
      }
    }
  };
  this.addItem = function() {
    let total = 0;
    let random = 0;
    for (let prob in this.gD.items) {
      if (this.gD.items.hasOwnProperty(prob)) {
        total += this.gD.items[prob][0];
      }
    }
    
    if (this.inventory.items["Item_Treasure"].active) {
      total *= this.menu.shop.getSkillValue("item_spawn_frequency") * 4;
    } else {
      total *= this.menu.shop.getSkillValue("item_spawn_frequency");
    }
    
    random = Math.random() * total;
    
    for (let prob in this.gD.items) {
      if (this.gD.items.hasOwnProperty(prob)) {
        random -= this.gD.items[prob][0];
        if (random <= 0) {
          let {spriteWidth, spriteHeight} = getSpriteData(prob, this.gD);
          
          let newItem = new GameObject(
            this.distance + this.gD.canvas.width + randomBetween(110, 250), randomBetween(50, 310), spriteWidth, spriteHeight, prob
          );
          newItem.init(this.gD);
          this.objects.push(newItem);
          break;
        }
      }
    }
  };
  this.getMatchPoints = function(player) {
    let distancePoints = this.currentLevel / 20 * 5;
    let itemPoints = player.inventory.getItemsCollected() / 100 * 5;
    let moneyPoints = player.inventory.getTotalHype(this) / 50000 * 5;
    let specials = player.inventory.getSpecialsAmount();
    let specialPoints = specials.gs + Math.floor(specials.keys / 4);
    return distancePoints * 0.4 + itemPoints * 0.2 + moneyPoints * 0.28 + specialPoints * 0.12;
  };
  this.getBonus = function(player) {
    switch (Math.floor(this.getMatchPoints(player))) {
      case 0:
        return 0;
      case 1:
        return 30 * this.stage.difficulty;
      case 2:
        return 200 * this.stage.difficulty;
      case 3:
        return 500 * this.stage.difficulty;
      case 4:
        return 969 * this.stage.difficulty;
      case 5:
        return 1500 * this.stage.difficulty;
      case 6:
        return 3750 * this.stage.difficulty;
      default:
        return 10000 * this.stage.difficulty;
    }
  };
  this.getRankSpriteKey = function(player) {
    let ranks = ["Special_Rank_C", "Special_Rank_B", "Special_Rank_A", 
                 "Special_Rank_S", "Special_Rank_SS", "Special_Rank_SSS"];
    return ranks[Math.min(Math.floor(this.getMatchPoints(player)), 5)];
  };
  this.continues = function() {
    this.player.x = this.distance + 50;
    this.player.y = 50;
    this.player.velocity = 0;
    this.helpFloor = new GameFloor(
      this.player.x - 5, this.player.y + this.player.height + 5, 150 + Math.min(this.currentLevel, 20) * 10, "Help"
    );
    this.floors.splice(this.floors.length - 2, 0, this.helpFloor);
    this.showConfirmation = false;
    this.continued = true;
  };
  this.finish = function(withRestart = true) {
    if (this.menu.shop.getSkillValue("extra_life") === 1 && !this.continued &&
        !this.showConfirmation && withRestart) {
      this.showConfirmation = true;
    } else {
      let bonus = this.getBonus(this.player);

      this.menu.highscores.addHighscore({
        name: Date().toString().substring(0, 24),
        distance: Math.floor(this.player.inventory.getValue("distance") / 15),
        level: this.currentLevel,
        cash: this.player.inventory.getTotalHype(this),
        money1: this.player.inventory.hype.money["Money_1"],
        money10: this.player.inventory.hype.money["Money_10"],
        money100: this.player.inventory.hype.money["Money_100"],
        money1000: this.player.inventory.hype.money["Money_1000"],
        bonus: bonus,
        stage: this.stage.name
      });
      if (!this.trainingMode) {
        this.handleEvent(Events.COLLECT_BONUS, bonus);
        this.handleEvent(Events.DEATH);
        this.handleEvent(Events.HIGHSCORE_COLLECTED_HYPE, Math.floor(this.player.inventory.getTotalHype(this)));
        this.handleEvent(
          Events.HIGHSCORE_TRAVELLED_DISTANCE, 
          Math.floor(this.player.inventory.getValue("distance") / 15)
        );
        this.handleEvent(
          Events.END_OF_ROUND_TOTAL_TRAVELLED_DISTANCE, 
          Math.floor(this.player.inventory.getValue("distance") / 15)
        );
        this.handleEvent(Events.COLLECT_HYPE_WITH_BONUS, this.player.inventory.getTotalHype(this) + bonus);
        this.handleEvent(Events.TIME_PLAYED, (Date.now() - this.startTime) / 1000);
        this.menu.achievements.resetPerRound();
        this.menu.shop.addHype(this.player.inventory.getTotalHype(this) + bonus);
        this.menu.shop.goldenShamrocks += this.player.inventory.special.items["Special_GoldenShamrock"][1];
      }
      this.showConfirmation = false;
      this.finished = true;
    }
  };
  this.restart = function(withFinish = false) {
    if (withFinish) {
      this.finish(false);
    }
    let player = this.player;
    let stage = this.stage;
    let trainingMode = this.trainingMode;
    
    this.init();
    
    this.setStage("Stage_" + stage.name, trainingMode);
    this.addPlayer(player.character, player.hat, player.glasses, player.beard, true, player.name);
    this.setStartTime();
  };
  this.updateKeyPresses = function() {
    let keyB = this.menu.controls.keyBindings;
    let activated = false;

    Object.keys(this.gD.keys).map((key, index) => {
      if (!this.paused && !this.finished) {
        if (keyB.get("Game_Jump")[3].includes(key) && this.gD.keys[key]) {
          this.player.jump(this, this.menu);
        } else if (keyB.get("Game_Jump")[3].includes(key) && !this.gD.keys[key]) {
          this.player.jumpStop();
        }

        if (keyB.get("Game_MoveRight")[3].includes(key) && this.gD.keys[key]) {
          this.player.moveForward(this, this.menu);
          activated = true;
        } else if (keyB.get("Game_MoveLeft")[3].includes(key) && this.gD.keys[key]) {
          this.player.moveBackward(this, this.menu);
          activated = true;
        } else if (keyB.get("Game_MoveRight")[3].includes(key) && !this.gD.keys[key] && !activated) {
          this.player.stopMoving(this, "forward");
        } else if (keyB.get("Game_MoveLeft")[3].includes(key) && !this.gD.keys[key] && !activated) {
          this.player.stopMoving(this, "backward");
        }
      }
    }, this);
    
    this.gD.newKeys.map((key, index) => {
      if (!this.finished && !this.showConfirmation) {
        if (keyB.get("Game_Pause")[3].includes(key)) {
          this.paused = !this.paused;
        }
      } else if (this.showConfirmation) {
        if (keyB.get("Menu_NavDown")[3].includes(key) || keyB.get("Menu_NavUp")[3].includes(key)) {
          this.confirmationWindow.select((this.confirmationWindow.selected + 1) % 2);
        } else if (keyB.get("Menu_Confirm")[3].includes(key)) {
          if (this.confirmationWindow.selected === 0) {
            this.continues();
          } else {
            this.finish();
          }
        }
      } else if (this.finished) {
        if (keyB.get("Menu_NavRight")[3].includes(key)) {
          this.updateSelection((this.selectedColumnIndex + 1) % 2);
        } else if (keyB.get("Menu_NavLeft")[3].includes(key)) {
          this.updateSelection((this.selectedColumnIndex + 1) % 2);
        } else if (keyB.get("Menu_Confirm")[3].includes(key)) {
          switch (this.selectedColumnIndex) {
            case 1:
              this.restart();
              break;
            default:
              this.gD.currentPage = this.menu;
              this.init();
              break;
          }
        } else if (keyB.get("Game_Restart")[3].includes(key)) {
          this.restart();
        }
      }
      if (!this.paused && !this.finished && !this.showConfirmation) {
        if (keyB.get("Game_JumpFromPlatform")[3].includes(key)) {
          this.player.downFromPlatform(this);
        } else if (keyB.get("Game_ItemStopwatch")[3].includes(key)) {
          this.inventory.activate(this, "Item_Stopwatch");
        } else if (keyB.get("Game_ItemStar")[3].includes(key)) {
          this.inventory.activate(this, "Item_Star");
        } else if (keyB.get("Game_ItemFeather")[3].includes(key)) {
          this.inventory.activate(this, "Item_Feather");
        } else if (keyB.get("Game_ItemTreasure")[3].includes(key)) {
          this.inventory.activate(this, "Item_Treasure");
        } else if (keyB.get("Game_ItemMagnet")[3].includes(key)) {
          this.inventory.activate(this, "Item_Magnet");
        } else if (keyB.get("Game_ItemRocket")[3].includes(key)) {
          this.inventory.activate(this, "Item_Rocket");
        } else if (keyB.get("Game_Restart")[3].includes(key)) {
          this.restart(true);
        } else if (keyB.get("Game_Tutorial")[3].includes(key)) {
          this.showTutorial = !this.showTutorial;
        }
      }
    }, this);
  };
  this.updateMouseMoves = function() {
    if (this.showConfirmation) {
      this.confirmationWindow.buttons.map((button, index) => {
        if (this.gD.mousePos.x >= button.x && this.gD.mousePos.x <= button.x + button.width &&
            this.gD.mousePos.y >= button.y && this.gD.mousePos.y <= button.y + button.height) {
          this.confirmationWindow.select(index);
        }
      }, this);
    } else if (this.finished) {
      if (this.gD.mousePos.x >= this.endScreen.backToMenu.x && 
          this.gD.mousePos.x <= this.endScreen.backToMenu.x + this.endScreen.backToMenu.width &&
          this.gD.mousePos.y >= this.endScreen.backToMenu.y && 
          this.gD.mousePos.y <= this.endScreen.backToMenu.y + this.endScreen.backToMenu.height) {
        this.updateSelection(0);
      }
      
      if (this.gD.mousePos.x >= this.endScreen.restart.x && 
          this.gD.mousePos.x <= this.endScreen.restart.x + this.endScreen.restart.width &&
          this.gD.mousePos.y >= this.endScreen.restart.y && 
          this.gD.mousePos.y <= this.endScreen.restart.y + this.endScreen.restart.height) {
        this.updateSelection(1);
      }
    }
  };
  this.updateClick = function() {
    let clickPos = this.gD.clicks.pop();

    if (!clickPos) {
      return;
    }
    
    if (this.showConfirmation) {
      this.confirmationWindow.buttons.map((button, index) => {
        if (clickPos.x >= button.x && clickPos.x <= button.x + button.width &&
            clickPos.y >= button.y && clickPos.y <= button.y + button.height) {
          if (index === 0) {
            this.continues();
          } else {
            this.finish();
          }
        }
      }, this);
    } else if (this.finished) {
      if (clickPos.x >= this.endScreen.backToMenu.x && 
          clickPos.x <= this.endScreen.backToMenu.x + this.endScreen.backToMenu.width &&
          clickPos.y >= this.endScreen.backToMenu.y && 
          clickPos.y <= this.endScreen.backToMenu.y + this.endScreen.backToMenu.height) {
        this.gD.currentPage = this.menu;
        this.init();
      }
      
      if (clickPos.x >= this.endScreen.restart.x && 
          clickPos.x <= this.endScreen.restart.x + this.endScreen.restart.width &&
          clickPos.y >= this.endScreen.restart.y && 
          clickPos.y <= this.endScreen.restart.y + this.endScreen.restart.height) {
        this.restart();
      }
    }
  };
  this.updateWheelMoves = function() {

  };
  this.update = function() {
    this.menu.lightUpdate();
    
    if (!this.finished && !this.paused && !this.showConfirmation) {
      if (this.showLevel > 0) {
        this.showLevel--;
      }
      this.speedLvlUp();
      this.distance += this.globalSpeed;
      this.distanceSinceLvlUp += this.globalSpeed;
      this.inventory.update(this);
      this.inventory.setValue("distance", this.distance);
      
      this.players.map(player => {
        player.update(this, this.gD);
      }, this);
      this.stage.update();
      this.floors.map(floor => {
        floor.update(this, this.gD);
      }, this);
      
      if (this.floors[this.floors.length - 1].x + this.floors[this.floors.length - 1].width < this.distance + 1100) {
        this.addFloors();
      }
      if (this.floors[this.floorStartIndex].x + this.floors[this.floorStartIndex].width < this.distance - 100) {
        this.floorStartIndex++;
      }
      if (this.objects[this.objects.length - 1].x + this.objects[this.objects.length - 1].width < this.distance + 1100 || 
          this.inventory.items["Item_Treasure"].active) {
        this.addMoney();
        this.addItem();
      }
      if (this.objects[this.objectStartIndex].x + this.objects[this.objectStartIndex].width < this.distance - 100) {
        this.objectStartIndex++;
      }
      
      for (let i = this.objectStartIndex; i < this.objects.length; i++) {
        this.objects[i].update(this);
        this.player.collect(this, this.objects[i], i);
      };
      if (this.objectStartIndex < this.objects.length &&
          this.objects[this.objectStartIndex].x + this.objects[this.objectStartIndex].width < this.distance - 100) {
        this.objectStartIndex++;
      }
      this.player.stopMoving(this, null);
    } else if (this.showConfirmation) {
      this.confirmationWindow.update();
    } else if (this.finished) {
      this.endScreen.update(this, this.gD);
    }
  };
  this.draw = function() {
    this.stage.drawBackground();
    if (this.showLevel > 0) {
      drawCanvasText(this.gD.canvas.width / 2, this.gD.canvas.height / 2, this.currentLevel, "ookii", this.gD);
    }
    this.inventory.draw(this, this.gD);
    
    this.players.map(player => {
      player.draw(this, this.gD);
    }, this);


    for (let i = this.floorStartIndex; i < this.floors.length; i++) {
      this.floors[i].draw(this, this.gD);
    }
    for (let i = this.objectStartIndex; i < this.objects.length; i++) {
      this.objects[i].draw(this, this.gD);
    }
    this.stage.drawForeground();
    
    if (this.paused) {
      drawCanvasRect(0, (this.gD.canvas.height - 70) / 2, this.gD.canvas.width, 70, "darkModal", this.gD);
      drawCanvasText(this.gD.canvas.width / 2, this.gD.canvas.height / 2, "Pause", "pageTitle", gD);
    }
    if (this.showConfirmation) {
      this.confirmationWindow.draw(this.gD);
    }
    if (this.finished) {
      this.endScreen.draw(this, this.gD);
    }
    
    this.menu.lightDraw();
  };
  this.updateSelection = function(columnIndex) {
    if (this.selectedColumnIndex !== undefined) {
      if (this.selectedColumnIndex === 0) {
        this.endScreen.backToMenu.deselect();
      } else {
        this.endScreen.restart.deselect();
      }
    }
    
    if (columnIndex === 0) {
      this.endScreen.backToMenu.select();
    } else {
      this.endScreen.restart.select();
    }
    this.selectedColumnIndex = columnIndex;
  };
}

function GamePlayer(x, y, character, name, hat, glasses, beard) {
  this.x = x;
  this.y = y;
  this.character = character;
  this.name = name;
  this.hat = hat;
  this.glasses = glasses;
  this.beard = beard;
  this.width = 0;
  this.height = 0;
  this.direction = null;
  this.inventory = null;
  this.speed = 0;
  this.velocity = 0;
  this.weight = 45;
  this.gravity = 0.45;
  this.jumps = 0;
  this.jumping = false;
  this.onFloor = false;
  this.aboveFloor = false;
  this.outsideWater = false;
  this.outsideCanvas = false;
  this.currentFloor = null; //saves a floor on which the player is atm
  this.init = function(game, gD) {
    this.stopMoving(game, null);
    this.inventory = game.inventory;
  };
  this.getHeight = function(gD) {
    let height = 0;
    if (this.hat !== "Collectables_Nothing") {
      let {spriteHeight} = getSpriteData(this.hat, gD);
      height += spriteHeight - gD.player[this.character][1].y;
    }
    if (this.glasses !== "Collectables_Nothing") {
      let {spriteHeight} = getSpriteData(this.glasses, gD);
      let topOverhead = (spriteHeight / 2) - gD.player[this.character][2].y;
      let bottomOverhead = (spriteHeight / 2) - (this.height - gD.player[this.character][2].y);
      height = Math.max(height, topOverhead);
    }
    return height;
  };
  this.moveForward = function(game, menu) {
    this.direction = "forward";
    this.speed = game.globalSpeed + menu.shop.getSkillValue("movement_speed");
  };
  this.moveBackward = function(game, menu) {
    this.direction = "backward";
    this.speed = game.globalSpeed - menu.shop.getSkillValue("movement_speed");
  };
  this.stopMoving = function(game, direction) {
    if (this.direction === direction) {
      this.speed = game.globalSpeed;
      this.direction = null;
    }
  };
  this.downFromPlatform = function(game) {
    this.onFloor = false;
    this.currentFloor = null;
    this.jumps = 1;
    if (game.helpFloor !== null) {
      game.floors.splice(game.floors.indexOf(game.helpFloor), 1);
      game.helpFloor = null;
    }
  };
  this.setGravity = function(game) {
    if (this.inventory.items["Item_Feather"].active) {
      this.gravity = 0.25;
    } else {
      this.gravity = game.stage.gravity / this.weight;
    }
  };
  this.jump = function(game, menu) {
    if (game.stage.name === "Water" && this.y + this.height >= game.gD.canvas.height / 2) {
      this.jumps = 0;
    }
    if (!this.jumping && this.jumps < menu.shop.getSkillValue("jumps")) {
      if (game.stage.name === "Universe") {
        this.velocity = menu.shop.getSkillValue("jump_height") / 2.9;
        this.jumping = true;
        game.handleEvent(Events.DO_JUMP);
        if (this.jumps === 1) {
          game.handleEvent(Events.DO_DOUBLE_JUMP);
        }
      } else if (game.stage.name === "Water" && this.y + this.height >= game.gD.canvas.height / 2) {
        this.velocity = menu.shop.getSkillValue("jump_height") / 3;
      } else {
        this.velocity = menu.shop.getSkillValue("jump_height");
        this.jumping = true;
        game.handleEvent(Events.DO_JUMP);
        if (this.jumps === 1) {
          game.handleEvent(Events.DO_DOUBLE_JUMP);
        }
      }
      if (game.helpFloor !== null) {
        game.floors.splice(game.floors.indexOf(game.helpFloor), 1);
        game.helpFloor = null;
      }
      this.onFloor = false;
    }
  };
  this.jumpStop = function() {
    if (this.jumping) {
      this.jumping = false;
      this.jumps++;
    }
  };
  this.hitWalls = function(game, gD) {  //checks, if the player touches a canvas wall, or the floor of the current stage
    let canvasX = this.x - game.distance;
    if (this.y + this.height > gD.canvas.height - game.stage.deadZoneGround) {
      if (game.inventory.items["Item_Star"].active) {
        this.y = gD.canvas.height - game.stage.deadZoneGround - this.height;
        this.velocity = 0;
        this.onFloor = true;
        this.jumps = 0;
        this.jumping = false;
      } else {
        game.finish();
      }
    }
    
    if (this.y + this.height < 0 && !this.outsideCanvas) {
      this.outsideCanvas = true;
      game.handleEvent(Events.JUMP_OUT_OF_BOUNDS);
    } else if (this.y + this.height > 0) {
      this.outsideCanvas = false;
    }

    if (canvasX < 0) {
      this.x -= canvasX;
    } else if (canvasX + this.width > gD.canvas.width) {
      this.x -= (canvasX + this.width) - gD.canvas.width;
    }
  };
  this.touchFloor = function(game, gD) {
    for (let i = game.floorStartIndex; i < game.floors.length; i++) {
      let floor = game.floors[i];
      if ((this.x > floor.x && this.x < floor.x + floor.width) ||
          (this.x + this.width > floor.x && this.x + this.width < floor.x + floor.width)) {
        if (this.currentFloor !== null &&
            this.y + this.height >= this.currentFloor.y - (this.currentFloor.thickness / 2) && this.velocity > 0 &&
            this.aboveFloor) {
          if (!gD.keys[game.menu.controls.keyBindings.get("Game_JumpFromPlatform")[3][0]] &&
              !gD.keys[game.menu.controls.keyBindings.get("Game_JumpFromPlatform")[3][1]]) {
            switch (this.currentFloor.type) {
              case "Jump":
                if (this.inventory.items["Item_Feather"].active) {
                  this.velocity = -5;
                } else {
                  this.velocity = -this.velocity * 0.9;
                }
                this.jumps = 1;
                break;
              case "Fall":
                this.currentFloor.isFalling = true;
                this.onFloor = true;
                this.velocity = 0;
                this.jumps = 0;
                break;
              default:
                this.aboveFloor = false;
                this.onFloor = true;
                this.velocity = 0;
                this.jumps = 0;
            }
            this.y = this.currentFloor.y - (this.currentFloor.thickness / 2) - this.height;
            this.jumping = false;
          } else {
            if (this.currentFloor === game.helpFloor && this.currentFloor !== null) {
              game.floors.splice(game.floors.indexOf(game.helpFloor), 1);
              game.helpFloor = null;
            }
            this.currentFloor = null;
          }
        }
        if (this.y + this.height <= floor.y - (floor.thickness / 2)) {
          this.aboveFloor = true;
          if (this.currentFloor === null || floor.y - this.y < this.currentFloor.y - this.y) {
            this.currentFloor = floor;
            break;
          }
        }
      }
      if (i + 1 === game.floors.length && this.currentFloor !== null &&
          (this.x > this.currentFloor.x + this.currentFloor.width || this.x + this.width < this.currentFloor.x) &&
          !(this.y === gD.canvas.height - game.stage.deadZoneGround - this.height)) {
        if (this.onFloor) {
          this.jumps = 1;
        }
        this.aboveFloor = false;
        this.onFloor = false;
        if (this.currentFloor === game.helpFloor && this.currentFloor !== null) {
          game.floors.splice(game.floors.indexOf(game.helpFloor), 1);
          game.helpFloor = null;
        }
        this.currentFloor = null;
      }
    }
  };
  this.collect = function(game, object, index = -1) {                   //checks if an object is touched by the player
    if (this.x < object.x + object.width &&
        this.x + this.width > object.x &&
        this.y < object.y + object.height &&
        this.height + this.y > object.y) {
      if (object.spriteKey === "" && !this.inventory.items["Item_Star"].active && 
          !this.inventory.items["Item_Rocket"].active) {
        game.finish();
      } else if (object.spriteKey.startsWith("Item") || object.spriteKey.startsWith("Special")) {
        switch (object.spriteKey.split("_")[1]) {
          case "Stopwatch":
            game.handleEvent(Events.COLLECT_ITEM);
            game.handleEvent(Events.COLLECT_STOPWATCH);
            break;
          case "Star":
            game.handleEvent(Events.COLLECT_ITEM);
            game.handleEvent(Events.COLLECT_STAR);
            break;
          case "Feather":
            game.handleEvent(Events.COLLECT_ITEM);
            game.handleEvent(Events.COLLECT_FEATHER);
            break;
          case "Treasure":
            game.handleEvent(Events.COLLECT_ITEM);
            game.handleEvent(Events.COLLECT_TREASURE);
            break;
          case "Magnet":
            game.handleEvent(Events.COLLECT_ITEM);
            game.handleEvent(Events.COLLECT_MAGNET);
            break;
          case "Rocket":
            game.handleEvent(Events.COLLECT_ITEM);
            game.handleEvent(Events.COLLECT_ROCKET);
            break;
          case "Questionmark":
            game.handleEvent(Events.COLLECT_ITEM);
            game.handleEvent(Events.COLLECT_QUESTIONMARK);
            break;
          case "GoldenShamrock":
            game.handleEvent(Events.COLLECT_GOLDEN_SHAMROCK);
            break;
          case "GreenKey":
            game.handleEvent(Events.COLLECT_GREENKEY);
            break;
          case "BlueKey":
            game.handleEvent(Events.COLLECT_BLUEKEY);
            break;
          case "YellowKey":
            game.handleEvent(Events.COLLECT_YELLOWKEY);
            break;
          case "RedKey":
            game.handleEvent(Events.COLLECT_REDKEY);
            break;
          default:
            break;
        }
        this.inventory.collect(object.spriteKey);
        if (index !== -1) {
          game.objects.splice(index, 1);
        }
      } else if (object.spriteKey.startsWith("Money")) {
        this.inventory.hype.addMoney(object.spriteKey);
        game.handleEvent(
          Events.COLLECT_HYPE,
          object.spriteKey.split("_")[1] * game.menu.shop.getSkillValue("money_multiplier")
        );
        switch (object.spriteKey) {
          case "Money_1":
            game.handleEvent(Events.COLLECT_1_HYPE, [game.menu.shop.getSkillValue("money_multiplier")]);
            break;
          case "Money_10":
            game.handleEvent(Events.COLLECT_10_HYPE, [game.menu.shop.getSkillValue("money_multiplier")]);
            break;
          case "Money_100":
            game.handleEvent(Events.COLLECT_100_HYPE, [game.menu.shop.getSkillValue("money_multiplier")]);
            break;
          case "Money_1000":
            game.handleEvent(Events.COLLECT_1000_HYPE, [game.menu.shop.getSkillValue("money_multiplier")]);
            break;
          default:
        }
        if (index !== -1) {
          game.objects.splice(index, 1);
        }
      } else if (object.spriteKey.startsWith("Enemy") && !this.inventory.items["Item_Star"].active && 
                 !this.inventory.items["Item_Rocket"].active) {
        game.finish();
      }
    }
  };
  this.update = function(game, gD) {
    let spriteData = getSpriteData(this.character, gD);
    
    this.width = spriteData.spriteWidth;
    this.height = spriteData.spriteHeight;
    
    this.setGravity(game);
    
    if (this.inventory.items["Item_Rocket"].active) {
      this.x += this.speed;
      this.y -= (this.y - 50) / 40;
      this.onFloor = false;
      this.velocity = 0;
      this.jumps = 1;
      this.jumping = false;
    } else {
      if (this.onFloor && this.currentFloor !== null && this.currentFloor.type === "Moving") {
        this.y = this.currentFloor.y - (this.currentFloor.thickness / 2) - this.height + this.currentFloor.velocity;
      } else if (!this.onFloor || (this.currentFloor !== null && this.currentFloor.type === "Fall")) {
        this.y += this.velocity;
        if (this.velocity <= 0) {
          this.velocity += this.gravity;
        } else {
          if (!(this.inventory.items["Item_Feather"].active && this.velocity > 2) ||
               !this.inventory.items["Item_Feather"].active) {
            this.velocity += Math.max(this.gravity - 0.1, 0.05);
          }
        }
        if (game.stage.name === "Water") {
          if (this.y + this.height > game.gD.canvas.height / 2) {
            if (this.outsideWater) {
              this.velocity = 1;
            }
            this.outsideWater = false;
          } else {
            if (!this.outsideWater) {
              this.velocity = game.menu.shop.getSkillValue("jump_height") / 1.8;
            }
            this.outsideWater = true;
          }
        }
      }
      this.x += this.speed;
      this.touchFloor(game, gD);
    }
    this.hitWalls(game, gD);
  };
  this.draw = function(game, gD) {
    let canvasX = this.x - game.distance;
    let canvasY = this.y;
    let character = this.character;
    if (this.inventory.items["Item_Rocket"].active) {
      drawCanvasImage(canvasX, canvasY, "Item_Rocket", gD);
      character = "Item_Rocket";
    } else {
      drawCanvasImage(canvasX, canvasY, this.character, gD);
    }
    if (this.y + this.height < 0) {
      let pointerData = getSpriteData("Special_Pointer", gD);
      drawCanvasImage(canvasX + (this.width - pointerData.spriteWidth) / 2, 30, "Special_Pointer", gD);
    }

    if (this.hat !== "Collectables_Nothing") {
      let hatData = getSpriteData(this.hat, gD);
      drawCanvasImage(
        canvasX + gD.player[character][1].x - hatData.spriteWidth / 2, 
        canvasY + gD.player[character][1].y - hatData.spriteHeight, this.hat, gD
      );
    }
    if (this.glasses !== "Collectables_Nothing") {
      let glassesData = getSpriteData(this.glasses, gD);
      drawCanvasImage(
        canvasX + gD.player[character][2].x - glassesData.spriteWidth / 2, 
        canvasY + gD.player[character][2].y - glassesData.spriteHeight / 2, this.glasses, gD
      );
    }
    if (this.beard !== "Collectables_Nothing") {
      let beardData = getSpriteData(this.beard, gD);
      drawCanvasImage(
        canvasX + gD.player[character][3].x - beardData.spriteWidth / 2, 
        canvasY + gD.player[character][3].y, this.beard, gD
      );
    }
  };
}

function GameCashVault(x, y, width, height, spriteKey, styleKey) {
  this.money = {};
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.spriteKey = spriteKey;
  this.styleKey = styleKey;
  this.init = function(game, gD) {
    for (let type in gD.money) {
      if (gD.money.hasOwnProperty(type)) {
        this.money[type] = 0;
      }
    }
  };
  this.addMoney = function(type) {
    this.money[type]++;
  };
  /**
   * @return {number} returns the total cash
   */
  this.getTotalCash = function(game) {
    return Object.keys(this.money).reduce((accumulator, key) => {
      return accumulator + (this.money[key] * parseInt(key.split('_')[1]));
    }, 0) * game.menu.shop.getSkillValue("money_multiplier");
  };
  this.draw = function(game, gD) {
    let design = gD.design.elements[this.styleKey];
    let spriteData = getSpriteData(this.spriteKey, gD);

    drawCanvasRect(this.x, this.y, this.width, this.height, design.rectKey, gD);
    drawCanvasImage(this.x + 3, this.y + Math.floor((this.height - spriteData.spriteHeight) / 2), this.spriteKey, gD);
    drawCanvasText(
      this.x + this.width - 3, this.y + this.height / 2, 
      Math.floor(this.getTotalCash(game)).toString().replace(/\d(?=(\d{3})+($|\.))/g, '$&.'), design.textKey, gD
    );
    drawCanvasRectBorder(this.x, this.y, this.width, this.height, design.borderKey, gD);
  };
}

function GameInventory() {
  this.items = {};
  this.special = null;
  this.distance = null;
  this.hype = null;
  this.init = function(game, gD) {
    let counter = 0;
    for (let item in gD.items) {
      if (gD.items.hasOwnProperty(item) && item !== "Item_Questionmark") {
        this.items[item] = new GameInventoryItem(
          60 * counter, 0, 60, 30, item,
          game.menu.shop.getSkillValue("level_up_" + item.split("_")[1].toLowerCase()), "inventory",
          game.menu.shop.getSkillValue("start_amount_" + item.split("_")[1].toLowerCase())
        );
        counter++;
      }
    }
    this.special = new GameInventorySpecial(60 * counter, 0, 200, 30, "inventory2");
    this.distance = new GameInventoryDistance(60 * counter + 200, 0, 220, 30, "Icon_Distance", "inventory2");
    this.hype = new GameCashVault(60 * counter + 420, 0, 220, 30, "Currency_M", "inventory2");
    this.hype.init(game, gD);
  };
  this.activate = function(game, item) {
    game.handleEvent(Events.USE_ITEM);
    game.handleEvent(Events["USE_" + item.split("_")[1].toUpperCase()]);
    if (item.split("_")[1] === "Star" && 
        game.player.y + game.player.height > game.gD.canvas.height - game.stage.deadZoneGround - 20) {
      game.handleEvent(Events.STAR_BEFORE_LAVA);
    }
    this.items[item].activate(game);
  };
  this.fill = function(amount) {
    for (let str in this.items) {
      if (this.items.hasOwnProperty(str)) {
        this.items[str].amount = amount;
      }
    }
  };
  this.addValue = function(variable, value) {
    this[variable].addCurrentValue(value);
  };
  this.setValue = function(variable, value) {
    this[variable].setCurrentValue(value);
  };
  this.getValue = function(variable) {
    return this[variable].getCurrentValue();
  };
  this.getTotalHype = function(game) {
    return this.hype.getTotalCash(game);
  };
  this.getItemsCollected = function() {
    let collected = 0;
    for (let item in this.items) {
      if (this.items.hasOwnProperty(item)) {
        collected += this.items[item].amount;
        collected += this.items[item].used;
      }
    }
    return collected;
  };
  this.getSpecialsAmount = function() {
    return this.special.getSpecialsAmount();
  };
  this.collect = function(item) {
    if (item === "Item_Questionmark") {
      let items = ["Item_Feather", "Item_Magnet", "Item_Rocket", "Item_Star", "Item_Stopwatch", "Item_Treasure"];
      this.items[items[Math.floor(Math.random() * items.length)]].amount++;
    } else if (item.startsWith("Item")) {
      this.items[item].amount++;
    } else if (item.startsWith("Special")) {
      this.special.collect(item);
    }
  };
  this.update = function(game) {
    let active = 0;
    for (let item in this.items) {
      if (this.items.hasOwnProperty(item)) {
        this.items[item].update(game);
        if (this.items[item].active) {
          active++;
        }
      }
    }
    game.handleEvent(Events.USE_ALL_ITEMS_AT_ONCE, active);
  };
  this.draw = function(game, gD) {
    for (let item in this.items) {
      if (this.items.hasOwnProperty(item)) {
        this.items[item].draw(game, gD);
      }
    }
    this.special.draw(gD);
    this.distance.draw(gD);
    this.hype.draw(game, gD);
  };
}

function GameInventoryItem(x, y, width, height, itemName, maxDurability, styleKey, amount = 0) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.itemName = itemName;
  this.maxDurability = maxDurability;
  this.styleKey = styleKey;
  this.durability = 0;
  this.amount = amount;
  this.used = 0;
  this.velocity = 0;
  this.active = false;
  this.activate = function(game) {
    if (!this.active && this.amount > 0) {
      this.active = true;
      this.durability = this.maxDurability;
      this.amount--;
      this.used++;
      switch (this.itemName) {
        case "Item_Stopwatch":
          game.globalSpeed = 0.1;
          game.player.stopMoving(game, null);
          break;
        default:
      }
    }
  };
  this.update = function(game) {
    if (this.active) {
      if (this.durability > 0) {
        this.durability--;
        if (this.itemName === "Item_Rocket") {
          if (this.durability <= this.velocity * 5) {
            this.velocity -= 1;
            game.globalSpeed = Math.max(game.globalSpeed - this.velocity, Math.min(game.currentLevel * 0.5 + 1.5, 12));
          } else if (this.maxDurability - this.durability >= this.velocity * 5 && this.velocity < 9) {
            this.velocity += 1;
            game.globalSpeed = Math.min(game.globalSpeed + this.velocity, 40);
          }
        }
      } else {
        this.active = false;
        switch (this.itemName) {
          case "Item_Stopwatch":
            game.globalSpeed = Math.min(game.currentLevel * 0.5 + 1.5, 12);
            game.handleEvent(Events.SLOWED_TIME, this.maxDurability / 60);
            break;
          case "Item_Star":
            if (game.player.y === game.gD.canvas.height - game.stage.deadZoneGround - game.player.height) {
              game.player.onFloor = false;
            }
            break;
          case "Item_Rocket":
            this.velocity = 0;
            game.globalSpeed = Math.min(game.currentLevel * 0.5 + 1.5, 12);
            game.helpFloor = new GameFloor(
              game.player.x - 5, game.player.y + game.player.height + 5, 150 + Math.min(game.currentLevel, 20) * 10, "Help"
            );
            game.floors.splice(game.floors.length - 2, 0, game.helpFloor);
            break;
          default:
            break;
        }
      }
    }
  };
  this.draw = function(game, gD) {
    let design = gD.design.elements[this.styleKey];
    let itemRef = getSpriteData(this.itemName, gD);

    drawCanvasRect(this.x, this.y, this.width, this.height, design.rectKey.background, gD);
    drawCanvasRect(
      this.x, this.y, this.width * (this.durability / this.maxDurability), this.height, design.rectKey.progress, gD
    );
    drawCanvasImage(this.x + 2, this.y + Math.floor((this.height - itemRef.spriteHeight) / 2), this.itemName, gD);
    drawCanvasText(this.x + this.width - 2, this.y + this.height / 2, this.amount.toString(), design.textKey, gD);
    drawCanvasRectBorder(this.x, this.y, this.width ,this.height, design.borderKey, gD);
  };
}

function GameInventorySpecial(x, y, width, height, styleKey) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.styleKey = styleKey;
  this.items = {
    "Special_BlueKey": false,
    "Special_GreenKey": false,
    "Special_RedKey": false,
    "Special_YellowKey": false,
    "Special_GoldenShamrock": [false, 0]
  };
  this.collect = function(item) {
    if (item === "Special_GoldenShamrock" && this.items["Special_GoldenShamrock"][1] < 5) {
      this.items["Special_GoldenShamrock"][1]++;
    } else {
      this.items[item] = true;
    }
  };
  this.getSpecialsAmount = function() {
    let amount = { keys: 0, gs: 0 };
    if (this.items["Special_BlueKey"])
      amount.keys++;
    if (this.items["Special_GreenKey"])
      amount.keys++;
    if (this.items["Special_RedKey"])
      amount.keys++;
    if (this.items["Special_YellowKey"])
      amount.keys++;
    if (this.items["Special_GoldenShamrock"][0])
      amount.gs = this.items["Special_GoldenShamrock"][1];
    return amount;
  };
  this.draw = function(gD) {
    let design = gD.design.elements[this.styleKey];
    let counter = 0;

    drawCanvasRect(this.x, this.y, this.width, this.height, design.rectKey, gD);
    for (let item in this.items) {
      if (this.items.hasOwnProperty(item)) {
        let spriteData = getSpriteData(item, gD);
        if (item === "Special_GoldenShamrock") {
          for (let i = 0; i < 5; i++) {
            drawCanvasImage(
              this.x + 11 + (counter + i) * 22 - Math.floor(spriteData.spriteWidth / 2),
              this.y + Math.floor((this.height - spriteData.spriteHeight) / 2),
              this.items[item][1] <= i ? item + "_G" : item, gD
            );
          }
        } else {
          drawCanvasImage(
            this.x + 11 + counter * 22 - Math.floor(spriteData.spriteWidth / 2),
            this.y + Math.floor((this.height - spriteData.spriteHeight) / 2), this.items[item] ? item : item + "_G", gD
          );
        }
        counter++
      }
    }
    drawCanvasRectBorder(this.x, this.y, this.width ,this.height, design.borderKey, gD);
  };
}

function GameInventoryDistance(x, y, width, height, spriteKey, styleKey) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.spriteKey = spriteKey;
  this.styleKey = styleKey;
  this.currentValue = 0;
  this.setCurrentValue = function(value) {
    this.currentValue = value;
  };
  this.addCurrentValue = function(value) {
    this.currentValue += value;
  };
  this.getCurrentValue = function() {
    return this.currentValue;
  };
  this.draw = function(gD) {
    let design = gD.design.elements[this.styleKey];
    let spriteData = getSpriteData(this.spriteKey, gD);

    drawCanvasRect(this.x, this.y, this.width, this.height, design.rectKey, gD);
    drawCanvasImage(this.x + 3, this.y + Math.floor((this.height - spriteData.spriteHeight) / 2), this.spriteKey, gD);
    drawCanvasText(
      this.x + this.width - 3, this.y + this.height / 2, 
      addPoints(Math.floor(this.currentValue / 15)), design.textKey, gD
    );
    drawCanvasRectBorder(this.x, this.y, this.width, this.height, design.borderKey, gD);
  };
}

function GameFloor(x, y, width, type, height = 0) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.type = type;
  this.weight = 0;
  this.height = height;
  this.thickness = 5;
  this.velocity = 0;
  this.isFalling = false;
  this.init = function(game) {
    if (this.type === "Moving") {
      this.weight = 20.25 / (3 / (Math.floor((this.height / 3)) - 1));
    } else {
      this.weight = (this.width - 50) / (300 - 50) * (50 - 40) + 40;
    }
    if (this.type === "Spikes") {
      game.objects.push(new GameObject(this.x - 7, this.y - 9.5, 57, 19));
      game.objects.push(new GameObject(this.x + this.width - 50, this.y - 9.5, 57, 19));
    }
  };
  this.update = function(game, gD) {
    this.y += this.velocity;
    if (this.isFalling && this.type === "Moving") {
      this.velocity += 20.25 / this.weight;
    } else if (this.isFalling) {
      this.velocity += game.stage.gravity / this.weight;
    } else if (!this.isFalling && this.type === "Moving") {
      this.velocity -= 20.25 / this.weight;
    }
    if (this.type === "Moving" && (this.velocity > 3 || this.velocity < -3)) {
      this.isFalling = !this.isFalling;
    }
  };
  this.draw = function(game, gD) {
    let canvasX = this.x - game.distance;
    let spikesLeft = getSpriteData("Deco_Spikes_Left", gD);
    let spikesRight = getSpriteData("Deco_Spikes_Right", gD);
    
    if (this.type === "Spikes") {
      drawCanvasImage(canvasX - 10, this.y - spikesLeft.spriteHeight / 2, "Deco_Spikes_Left", gD);
      drawCanvasImage(
        canvasX + this.width + 10 - spikesRight.spriteWidth, this.y - spikesRight.spriteHeight / 2, 
        "Deco_Spikes_Right", gD
      );
    }
    
    drawCanvasLine(
      canvasX, this.y, gD.floors[this.type] === "stagecolor" ? game.stage.floorColorKey : gD.floors[this.type],
      gD, canvasX + this.width, this.y
    );
  };
}

function GameObject(x, y, width, height, spriteKey = "") {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.spriteKey = spriteKey;
  this.addItemFrame = false;
  this.init = function(gD) {
    if (this.spriteKey.startsWith("Item")) {
      let {spriteWidth, spriteHeight} = getSpriteData("Item_Frame", gD);
      this.addItemFrame = true;
      this.width = spriteWidth;
      this.height = spriteHeight;
    }
  };
  this.update = function(game) {
    if (this.spriteKey !== "" && game.inventory.items["Item_Magnet"].active) {
      let distX = (game.player.x + game.player.width / 2) - (this.x + this.width / 2);
      let distY = (game.player.y + game.player.height / 2) - (this.y + this.height / 2);
      let distanceToPlayer = Math.sqrt(Math.pow(distX, 2) + Math.pow(distY, 2));
      if (distanceToPlayer < 150) {
        this.x += (distX * Math.pow(20, 3)) / Math.pow(distanceToPlayer, 3);
        this.y += (distY * Math.pow(20, 3)) / Math.pow(distanceToPlayer, 3);
      }
    }
  };
  this.draw = function(game, gD) {
    if (this.spriteKey !== "") {
      let canvasX = this.x - game.distance;
      let spriteData = getSpriteData(this.spriteKey, gD);

      if (this.addItemFrame) {
        drawCanvasImage(canvasX, this.y, "Item_Frame", gD);
        drawCanvasImage(
          canvasX + Math.floor((this.width - spriteData.spriteWidth) / 2), 
          this.y + Math.floor((this.height - spriteData.spriteHeight) / 2),
          this.spriteKey, gD
        );
      } else {
        drawCanvasImage(canvasX, this.y, this.spriteKey, gD);
      }
    }
  };
}

function GameConfirmationWindow(x, y, width, height, styleKey) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.styleKey = styleKey;
  this.selected = 0;
  this.init = function() {
    this.buttons = [
      new CanvasButton(this.x + 5, this.y + 30, this.width - 10, 30, "Continue", "menu"),
      new CanvasButton(this.x + 5, this.y + 65, this.width - 10, 30, "Finish", "menu")
    ];
    this.buttons[0].select();
  };
  this.select = function(index) {
    this.buttons[this.selected].deselect();
    this.buttons[index].select();
    this.selected = index;
  };
  this.update = function() {
    this.buttons.map(button => {
      button.update();
    }, this);
  };
  this.draw = function(gD) {
    let design = gD.design.elements[this.styleKey];
    
    drawCanvasRect(this.x, this.y, this.width, this.height, design.rectKey, gD);
    drawCanvasText(this.x + this.width / 2, this.y + 15, "Spiel fortsetzen?", design.textKey, gD);
    this.buttons.map(button => {
      button.draw(gD);
    }, this);
    drawCanvasRectBorder(this.x, this.y, this.width, this.height, design.borderKey, gD);
  };
}

function GameEndScreen(x, y, width, height, styleKey) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.styleKey = styleKey;
  this.tableLineHeight = 24;
  this.backToMenu = null;
  this.restart = null;
  this.init = function() {
    this.backToMenu = new CanvasButton(this.width / 2 - 205, this.height - 50, 200, 30, "Main Menu", "menu");
    this.restart = new CanvasButton(this.width / 2 + 5, this.height - 50, 200, 30, "Neustart", "menu");
  };
  this.update = function(game, gD) {
    this.backToMenu.update();
    this.restart.update();
  };
  this.draw = function(game, gD) {
    let design = gD.design.elements[this.styleKey];
    
    drawCanvasRect(this.x, this.y, this.width, this.height, design.rectKey.background, gD);
    drawCanvasText(this.width / 2, 30, "Game Over", design.textKey.title, gD);
    game.players.map((player, index) => {
      let characterData = getSpriteData(player.character, gD);
      let x = this.x + 20 + (index % 2) * 40;
      let y = this.y + 60 + ((index + 0.5) * this.tableLineHeight) - characterData.spriteHeight / 2;
      let distanceData = getSpriteData("Icon_Distance", gD);
      let currencyData = getSpriteData("Currency_S", gD);
      let rankData = getSpriteData(game.getRankSpriteKey(player), gD);
      
      drawCanvasImage(x, Math.floor(y), player.character, gD);
      
      if (player.hat !== "Collectables_Nothing") {
        let {spriteWidth, spriteHeight} = getSpriteData(player.hat, gD);
        drawCanvasImage(
          x + gD.player[player.character][1].x - spriteWidth / 2, 
          Math.floor(y + gD.player[player.character][1].y - spriteHeight), player.hat, gD
        );
      }
      if (player.glasses !== "Collectables_Nothing") {
        let {spriteWidth, spriteHeight} = getSpriteData(player.glasses, gD);
        drawCanvasImage(
          x + gD.player[player.character][2].x - spriteWidth / 2, 
          Math.floor(y + gD.player[player.character][2].y - spriteHeight / 2), player.glasses, gD
        );
      }
      if (player.beard !== "Collectables_Nothing") {
        let {spriteWidth, spriteHeight} = getSpriteData(player.beard, gD);
        drawCanvasImage(
          x + gD.player[player.character][3].x - spriteWidth / 2, 
          Math.floor(y + gD.player[player.character][3].y), player.beard, gD
        );
      }
      
      x = 100;
      
      drawCanvasRect(
        x, 60 + index * this.tableLineHeight, this.width - 150, this.tableLineHeight, design.rectKey.table, gD
      );
      drawCanvasText(
        x + 3, 60 + (index + 0.5) * this.tableLineHeight, 
        player.name.length > 15 ? player.name.substr(0, 12) + "..." : 
          player.name === "" ? "Player " + (index + 1) : player.name, 
        design.textKey.table, gD
      );
      
      x += 138;
      
      drawCanvasLine(
        x, 60 + index * this.tableLineHeight, design.borderKey, gD, x, 60 + (index + 1) * this.tableLineHeight
      );
      drawCanvasImage(
        x + 3, 60 + index * this.tableLineHeight + Math.floor((this.tableLineHeight - distanceData.spriteHeight) / 2), 
        "Icon_Distance", gD
      );
      drawCanvasText(
        x + 133, 60 + (index + 0.5) * this.tableLineHeight, 
        addPoints(Math.min(999999999, Math.floor(player.inventory.getValue("distance") / 15))), 
        design.textKey.tableRight, gD
      );
      
      x += 136;
      
      drawCanvasLine(
        x, 60 + index * this.tableLineHeight, design.borderKey, gD, x, 60 + (index + 1) * this.tableLineHeight
      );
      drawCanvasImage(
        x + 3, 60 + index * this.tableLineHeight + Math.floor((this.tableLineHeight - currencyData.spriteHeight) / 2), 
        "Currency_S", gD
      );
      drawCanvasText(
        x + 116, 60 + (index + 0.5) * this.tableLineHeight, 
        addPoints(Math.min(999999999, Math.floor(player.inventory.getTotalHype(game)))), 
        design.textKey.tableRight, gD
      );
      
      x += 119;
      for (let money in player.inventory.hype.money) {
        if (player.inventory.hype.money.hasOwnProperty(money)) {
          let {spriteWidth, spriteHeight} = getSpriteData(money, gD);
          
          drawCanvasLine(
            x, 60 + index * this.tableLineHeight, design.borderKey, gD, x, 
            60 + (index + 1) * this.tableLineHeight
          );
          drawCanvasImage(
            x + 3, 60 + index * this.tableLineHeight + Math.floor((this.tableLineHeight - spriteHeight) / 2), 
            money, gD
          );
          drawCanvasText(
            x + 78, 60 + (index + 0.5) * this.tableLineHeight, 
            addPoints(Math.min(9999, player.inventory.hype.money[money])), design.textKey.tableRight, gD
          );
          x += 81;
        }
      }
      drawCanvasLine(
        x, 60 + index * this.tableLineHeight, design.borderKey, gD, x, 60 + (index + 1) * this.tableLineHeight
      );
      drawCanvasRainbowText(x + 3, 60 + (index + 0.5) * this.tableLineHeight, "Bonus", "rainbowLeft", gD);
      drawCanvasText(
        x + 130, 60 + (index + 0.5) * this.tableLineHeight, 
        addPoints(Math.min(9999999, game.getBonus(player))),
        design.textKey.tableRight, gD
      );
      drawCanvasRectBorder(
        100, 60 + index * this.tableLineHeight, this.width - 150, this.tableLineHeight, design.borderKey, gD
      );
      
      drawCanvasImage(x + 136, 60 + (index + 0.5) * this.tableLineHeight - rankData.spriteHeight / 2, rankData.key, gD);
    }, this);
    this.backToMenu.draw(gD);
    this.restart.draw(gD);
  };
}