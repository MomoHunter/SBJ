function Game(menu, gD) {
  this.menu = menu;
  this.gD = gD;
  this.init = function () {
    this.player = null;
    this.players = [];
    this.stage = null;
    this.trainingMode = false;
    this.paused = false;
    this.finished = false;
    this.baseLevelLength = 125 * 15;
    this.globalSpeed = 2;
    this.currentLevel = 1;
    this.distance = 0;
    this.distanceSinceLvlUp = 0;
    this.floors = [new GameFloor(0, this.gD.canvas.height - 49.5, this.gD.canvas.width + 100, "Standard")];
    this.helpFloor = null;
    this.floorStartIndex = 0;
    this.objects = [];
    this.objectStartIndex = 0;
    this.showLevel = 180;
    this.currentMoneyProbability = {};
    for (let money in this.gD.money) {
      if (this.gD.money.hasOwnProperty(money)) {
        this.currentMoneyProbability[money] = this.gD.money[money][0];
      }
    }
    
    this.inventory = new GameInventory();
    this.inventory.init(this, gD);
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
      this.currentMoneyProbability["Money_1"] = Math.max(this.currentMoneyProbability["Money_1"] - 0.1, 3);
      this.currentMoneyProbability["Money_10"] = Math.max(this.currentMoneyProbability["Money_10"] - 0.1, 2);
      this.currentMoneyProbability["Money_100"] = Math.min(this.currentMoneyProbability["Money_100"] + 0.1, 3);
      this.currentMoneyProbability["Money_1000"] = Math.min(this.currentMoneyProbability["Money_1000"] + 0.05, 1.15);
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
      if (floorPiece.earliestLevel <= this.currentLevel) {
        total += floorPiece.chance;
      }
    }, this);
    
    random = Math.random() * total;
 
    this.gD.floorPieces.map(floorPiece => {
      if (floorPiece.earliestLevel <= this.currentLevel) {
        random -= floorPiece.chance;
        if (random <= 0 && pieces === null) {
          pieces = floorPiece;
        }
      }
    }, this);
    
    if (pieces !== null) {
      pieces.floors.map(floor => {
        let newFloor = new GameFloor(
          startX + floor.x, floor.y, 
          startX + floor.x > this.getLevelStart(this.currentLevel + 1) ? 
            this.getFloorWidth(this.currentLevel + 1) : this.getFloorWidth(this.currentLevel), 
          floor.type, floor.height ? floor.height : 0
        );
        newFloor.init(this);
        this.floors.push(newFloor);
      }, this);
    }
  };
  this.getFloorWidth = function(level) {
    return Math.max(50, 300 - (level - 1) * 15);
  };
  this.addMoney = function() {
    let total = 0;
    let random = 0;
    for (let prob in this.currentMoneyProbability) {
      if (this.currentMoneyProbability.hasOwnProperty(prob)) {
        total += this.currentMoneyProbability[prob];
      }
    }
    
    if (!this.inventory.items["Item_Treasure"].active) {
      total *= 8;
    }
    
    random = Math.random() * total;
    
    for (let prob in this.currentMoneyProbability) {
      if (this.currentMoneyProbability.hasOwnProperty(prob)) {
        random -= this.currentMoneyProbability[prob];
        if (random <= 0) {
          let {spriteWidth, spriteHeight} = getSpriteData(prob, this.gD);
          
          this.objects.push(new GameObject(
            this.distance + 1000 + randomBetween(10, 150), randomBetween(50, 320), spriteWidth, spriteHeight, prob
          ));
          break;
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
    
    total *= 8;
    
    random = Math.random() * total;
    
    for (let prob in this.gD.items) {
      if (this.gD.items.hasOwnProperty(prob)) {
        random -= this.gD.items[prob][0];
        if (random <= 0) {
          let {spriteWidth, spriteHeight} = getSpriteData(prob, this.gD);
          
          this.objects.push(new GameObject(
            this.distance + 1000 + randomBetween(10, 150), randomBetween(50, 320), spriteWidth, spriteHeight, prob
          ));
          break;
        }
      }
    }
  };
  this.finish = function() {
    let bonus = this.player.inventory.hype.getBonus(this.player, this.stage.difficulty);

    this.menu.highscores.addHighscore({
      name: Date().toString().substring(0, 24),
      distance: Math.floor(this.player.inventory.getValue("distance") / 15),
      level: this.currentLevel,
      cash: this.player.inventory.hype.getTotalCash(),
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
      this.menu.achievements.resetPerRound();
      this.menu.shop.hype += this.player.inventory.hype.getTotalCash() + bonus;
      this.menu.shop.goldenShamrocks += this.player.inventory.special.items["Special_GoldenShamrock"][1];
    }
    this.finished = true;
  };
  this.restart = function() {
    let player = this.player;
    let stage = this.stage;
    
    this.init();
    
    this.addPlayer(player.character, player.hat, player.glasses, player.beard, true, player.name);
    this.stage = stage;
  };
  this.updateKeyPresses = function() {
    let keyB = this.menu.controls.keyBindings;

    Object.keys(this.gD.keys).map((key, index) => {
      if (!this.paused && !this.finished) {
        if (keyB.get("Game_Jump")[3].includes(key) && this.gD.keys[key]) {
          this.player.jump(this, this.menu);
        } else if (keyB.get("Game_Jump")[3].includes(key) && !this.gD.keys[key]) {
          this.player.jumpStop();
        }

        if (keyB.get("Game_MoveRight")[3].includes(key) && this.gD.keys[key]) {
          this.player.moveForward(this, this.menu);
        } else if (keyB.get("Game_MoveLeft")[3].includes(key) && this.gD.keys[key]) {
          this.player.moveBackward(this, this.menu);
        } else if (keyB.get("Game_MoveRight")[3].includes(key) && !this.gD.keys[key]) {
          this.player.stopMoving(this, "forward");
        } else if (keyB.get("Game_MoveLeft")[3].includes(key) && !this.gD.keys[key]) {
          this.player.stopMoving(this, "backward");
        }
      }
    }, this);
    
    this.gD.newKeys.map((key, index) => {
      if (!this.finished) {
        if (keyB.get("Game_Pause")[3].includes(key)) {
          this.paused = !this.paused;
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
        }
      }
      if (!this.paused && !this.finished) {
        if (keyB.get("Game_JumpFromPlatform")[3].includes(key)) {
          this.player.downFromPlatform();
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
        }
      }
    }, this);
  };
  this.updateMouseMoves = function() {
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
  };
  this.updateClick = function() {
    let clickPos = this.gD.clicks.pop();

    if (!clickPos) {
      return;
    }
    
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
  };
  this.updateWheelMoves = function() {

  };
  this.update = function() {
    this.menu.lightUpdate();
    
    if (!this.finished && !this.paused) {
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
      this.floors.map(floor => {
        floor.update(this, this.gD);
      }, this);
      
      if (this.floors[this.floors.length - 1].x + this.floors[this.floors.length - 1].width < this.distance + 1100) {
        this.addFloors();
      }
      if (this.floors[this.floorStartIndex].x + this.floors[this.floorStartIndex].width < this.distance - 100) {
        this.floorStartIndex++;
      }
      if (this.gD.frameNo % 30 === 0 || this.inventory.items["Item_Treasure"].active) {
        this.addMoney();
      }
      if (this.gD.frameNo % (150 - this.menu.shop.getSkillValue("item_spawn_frequency")) === 0) {
        this.addItem();
      }
      this.objects.map(object => {
        object.update(this);
      }, this);
      this.objects.map((object, index) => {
        this.player.collect(this, object, index);
      }, this);
      if (this.objects.length > 0 && this.objectStartIndex < this.objects.length &&
          this.objects[this.objectStartIndex].x + this.objects[this.objectStartIndex].width < this.distance - 100) {
        this.objectStartIndex++;
      }
      this.player.stopMoving(this, null);
    } else if (this.finished) {
      this.endScreen.update(this, this.gD);
    }
  };
  this.draw = function(ghostFactor) {
    this.stage.drawBackground(ghostFactor);
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
    this.stage.drawForeground(ghostFactor);
    if (this.paused) {
      drawCanvasRect(0, (this.gD.canvas.height - 70) / 2, this.gD.canvas.width, 70, "darkModal", this.gD);
      drawCanvasText(this.gD.canvas.width / 2, this.gD.canvas.height / 2, "Pause", "pageTitle", gD);
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
  this.gravity = 0.45;
  this.jumps = 0;
  this.jumping = false;
  this.onFloor = false;
  this.aboveFloor = false;
  this.outsideWater = false;
  this.outsideCanvas = false;
  this.distanceBackwards = 0;
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
    this.speed = game.globalSpeed + 3 + menu.shop.getSkillValue("movement_speed");
  };
  this.moveBackward = function(game, menu) {
    this.direction = "backward";
    this.speed = game.globalSpeed - 3 - menu.shop.getSkillValue("movement_speed");
  };
  this.stopMoving = function(game, direction) {
    if (this.direction === direction) {
      this.speed = game.globalSpeed;
      this.direction = null;
    }
  };
  this.downFromPlatform = function() {
    this.onFloor = false;
    this.currentFloor = null;
    this.jumps = 1;
  };
  this.setGravity = function(item = false) {
    if (item) {
      this.gravity = 0.25;
    } else {
      this.gravity = 0.45;
    }
  };
  this.jump = function(game, menu) {
    if (!this.jumping && this.jumps < 2 + menu.shop.getSkillValue("jumps")) {
      if (game.stage.name === "Universe") {
        this.velocity = -(9 + menu.shop.getSkillValue("jump_height")) / 2.9;
        this.jumping = true;
        game.handleEvent(Events.DO_JUMP);
        if (this.jumps === 1) {
          game.handleEvent(Events.DO_DOUBLE_JUMP);
        }
      } else if (game.stage.name === "Water" && this.y + this.height >= game.gD.canvas.height / 2) {
        this.velocity = -(9 + menu.shop.getSkillValue("jump_height")) / 3;
      } else {
        this.velocity = -(9 + menu.shop.getSkillValue("jump_height"));
        this.jumping = true;
        game.handleEvent(Events.DO_JUMP);
        if (this.jumps === 1) {
          game.handleEvent(Events.DO_DOUBLE_JUMP);
        }
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
                this.velocity = -this.velocity * 0.8;
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
        if (this.y + this.height < floor.y - (floor.thickness / 2)) {
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
  this.collect = function(game, object, index) {                   //checks if an object is touched by the player
    if (this.x < object.x + object.width &&
         this.x + this.width > object.x &&
         this.y < object.y + object.height &&
         this.height + this.y > object.y) {
      if (object.spriteKey === "" && !this.inventory.items["Item_Star"].active) {
        game.finish();
      } else if (object.spriteKey.startsWith("Item") || object.spriteKey.startsWith("Special")) {
        game.inventory.collect(object.spriteKey);
        game.objects.splice(index, 1);
      } else if (object.spriteKey.startsWith("Money")) {
        game.inventory.hype.addMoney(object.spriteKey);
        game.handleEvent(Events.COLLECT_HYPE, object.spriteKey.split("_")[1]);
        switch (object.spriteKey) {
          case "Money_1":
            game.handleEvent(Events.COLLECT_1_HYPE);
            break;
          case "Money_10":
            game.handleEvent(Events.COLLECT_10_HYPE);
            break;
          case "Money_100":
            game.handleEvent(Events.COLLECT_100_HYPE);
            break;
          case "Money_1000":
            game.handleEvent(Events.COLLECT_1000_HYPE);
            break;
          default:
        }
        game.objects.splice(index, 1);
      } else if (object.spriteKey.startsWith("Enemy") && !this.inventory.items["Item_Star"].active) {
        game.finish();
      }
    }
  };
  this.update = function(game, gD) {
    let spriteData = getSpriteData(this.character, gD);
    
    this.width = spriteData.spriteWidth;
    this.height = spriteData.spriteHeight;
    
    if (game.inventory.items["Item_Rocket"].active) {
      this.x += this.speed;//Math.min(Math.pow((-game.itemTimer[5] + 5 + (max / 2)) / (max / 5), 4) - 40, Math.ceil(game.globalBaseSpeed - (game. distanceTravelled * 0.00015))); //-((-x + 5 + (max/2)) / (max/5))^4+40 max is the max durability of the item
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
        this.velocity += this.gravity;
        if (game.stage.name === "Water") {
          if (this.y + this.height > game.gD.canvas.height / 2) {
            if (this.outsideWater) {
              this.velocity = 1;
            }
            this.outsideWater = false;
          } else {
            if (!this.outsideWater) {
              this.velocity = -(9 + game.menu.shop.getSkillValue("jump_height")) / 1.8;
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
    let character = this.character;
    if (game.inventory.items["Item_Rocket"].active) {
      drawCanvasImage(canvasX, this.y, "Item_Rocket", gD);
      character = "Item_Rocket";
    } else {
      drawCanvasImage(canvasX, this.y, this.character, gD);
    }
    if (this.y + this.height < 0) {
      let pointerData = getSpriteData("Special_Pointer", gD);
      drawCanvasImage(canvasX + (this.width - pointerData.spriteWidth) / 2, 0, "Special_Pointer", gD);
    }

    if (this.hat !== "Collectables_Nothing") {
      let hatData = getSpriteData(this.hat, gD);
      drawCanvasImage(
        canvasX + gD.player[character][1].x - hatData.spriteWidth / 2, 
        this.y + gD.player[character][1].y - hatData.spriteHeight, this.hat, gD
      );
    }
    if (this.glasses !== "Collectables_Nothing") {
      let glassesData = getSpriteData(this.glasses, gD);
      drawCanvasImage(
        canvasX + gD.player[character][2].x - glassesData.spriteWidth / 2, 
        this.y + gD.player[character][2].y - glassesData.spriteHeight / 2, this.glasses, gD
      );
    }
    if (this.beard !== "Collectables_Nothing") {
      let beardData = getSpriteData(this.beard, gD);
      drawCanvasImage(
        canvasX + gD.player[character][3].x - beardData.spriteWidth / 2, 
        this.y + gD.player[character][3].y, this.beard, gD
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
  this.getTotalCash = function() {
    return Object.keys(this.money).reduce((accumulator, key) => {
      return accumulator + (this.money[key] * parseInt(key.split('_')[1]));
    }, 0);
  };
  this.getBonus = function(player, difficulty) {
    let distanceInMeter = player.inventory.getValue("distance") / 15;
    let minDistInMeterForMaxHype = 8000 / difficulty * 10;
    let bonus = 0;
    
    if (distanceInMeter > 500) {
      if (distanceInMeter < minDistInMeterForMaxHype) {
        bonus = (distanceInMeter - 500) * distanceInMeter / minDistInMeterForMaxHype;
      } else {
        bonus = distanceInMeter - 500;
      }
    }
    return Math.floor(bonus);
  };
  this.draw = function(game, gD) {
    let design = gD.design.elements[this.styleKey];
    let spriteData = getSpriteData(this.spriteKey, gD);

    drawCanvasRect(this.x, this.y, this.width, this.height, design.rectKey, gD);
    drawCanvasImage(this.x + 3, this.y + Math.floor((this.height - spriteData.spriteHeight) / 2), this.spriteKey, gD);
    drawCanvasText(
      this.x + this.width - 3, this.y + this.height / 2, 
      this.getTotalCash().toString().replace(/\d(?=(\d{3})+($|\.))/g, '$&.'), design.textKey, gD
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
          gD.items[item][1] + (gD.items[item][2] *
            game.menu.shop.getSkillValue("level_up_" + item.split("_")[1].toLowerCase())), "inventory"
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
    for (let item in this.items) {
      if (this.items.hasOwnProperty(item)) {
        this.items[item].update(game);
      }
    }
  };
  this.draw = function(game, gD, ghostFactor) {
    for (let item in this.items) {
      if (this.items.hasOwnProperty(item)) {
        this.items[item].draw(game, gD, ghostFactor);
      }
    }
    this.special.draw(gD);
    this.distance.draw(gD);
    this.hype.draw(game, gD);
  };
}

function GameInventoryItem(x, y, width, height, itemName, maxDurability, styleKey) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.itemName = itemName;
  this.maxDurability = maxDurability;
  this.styleKey = styleKey;
  this.durability = 0;
  this.amount = 0;
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
        case "Item_Feather":
          game.player.setGravity(true);
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
            /*if (!game.menu.achievements.achievementList.achievements[12].finished) {
              game.menu.achievements.achievementValues[12] += (game.gD.itemBaseDur[i] + (game.menu.shop.level[i] * game.gD.itemPerLvlDur[i])) / 50;
              game.menu.achievements.achievementList.achievements[12].check(game.menu.achievements);
            }*/
            break;
          case "Item_Star":
            if (game.player.y === game.gD.canvas.height - game.stage.deadZoneGround - game.player.height) {
              game.player.onFloor = false;
            }
            break;
          case "Item_Feather":
            game.player.setGravity();
            break;
          case "Item_Rocket":
            this.velocity = 0;
            game.globalSpeed = Math.min(game.currentLevel * 0.5 + 1.5, 12);
            game.helpFloor = new GameFloor(game.player.x - 5, game.player.y + game.player.height + 5, 150, "Help");
            game.floors.push(game.helpFloor);
            break;
          default:
            break;
        }
      }
    }
  };
  this.draw = function(game, gD, ghostFactor) {
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
      this.weight = game.stage.gravity / (3 / (Math.floor((this.height / 3)) - 1));
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
    if (this.isFalling) {
      this.velocity += game.stage.gravity / this.weight;
    } else if (!this.isFalling && this.type === "Moving") {
      this.velocity -= game.stage.gravity / this.weight;
    }
    if (this.type === "Moving" && (this.velocity > 3 || this.velocity < -3)) {
      this.isFalling = !this.isFalling;
    }
  };
  this.draw = function(game, gD, ghostFactor) {
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
  this.draw = function(game, gD, ghostFactor) {
    if (this.spriteKey !== "") {
      let canvasX = this.x - game.distance;
      let spriteData = getSpriteData(this.spriteKey, gD);

      drawCanvasImage(canvasX, this.y, this.spriteKey, gD);
    }
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
      let distanceData = getSpriteData("Icon_Distance", gD);
      let currencyData = getSpriteData("Currency_S", gD);
      
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
        addPoints(Math.min(999999999, player.inventory.hype.getTotalCash())), 
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
        addPoints(Math.min(9999999, player.inventory.hype.getBonus(player, game.stage.difficulty))), 
        design.textKey.tableRight, gD
      );
      drawCanvasRectBorder(
        100, 60 + index * this.tableLineHeight, this.width - 150, this.tableLineHeight, design.borderKey, gD
      );
    }, this);
    this.backToMenu.draw(gD);
    this.restart.draw(gD);
  };
}

// /*function {Game(gD, menu) {
//   this.gD = gD;
//   this.menu = menu;
//   this.backgroundMusic = new Audio("music/ingame.mp3");
//   this.backgroundMusic.preload = "auto";
//   this.backgroundMusic.loop = true;
//   this.backgroundMusic.volume = 0.15;
//   this.endMusic = new Audio("music/gameover.mp3");
//   this.endMusic.preload = "auto";
//   this.endMusic.volume = 0.22;
//   this.stage = null;
//   this.distanceLabel = new GameLabel(this.gD.canvas.width - 135, 22, "14pt", "Consolas", "rgba(0, 0, 0, 1)", true);
//   this.fpsLabel = new GameLabel(0, this.gD.canvas.height - 5, "10pt", "Consolas", "rgba(255, 255, 255, 1)", false);
//   this.refreshrate = 1000 / 60;
//   this.paused = false;
//   this.visible = false;
//   /**
//    * to initiate the object at the beginning
//    *//*
//   this.init = function() {
//     this.objects = [];
//     this.objects.push(new GameObject(randomBetween(30000, 40000), randomBetween(50, 300),
//       this.gD.spriteDict["Item_GoldenShamrock_0"][2], this.gD.spriteDict["Item_GoldenShamrock_0"][3],
//       "Item_GoldenShamrock", 1));
//
//     this.floorObjects = [new GameFloor(0, this.gD.canvas.height - 50.5, this.gD.canvas.width + 100, "Floor_Standard")];
//
//     this.frameCounter = 0;
//     this.distanceTravelled = 0;
//     this.distanceSinceLvlUp = 0;          //saves distance since last speedlvl up
//     this.globalSpeed = 2;
//
//     this.currentMoneyProb = {};
//     Object.keys(this.gD.money).map(function(key) {
//       this.currentMoneyProb[key] = this.gD.money[key][0];
//     });
//
//     this.lastItemObject = null;
//     this.lastMoneyObject = null;
//
//     this.pauseModal = new GamePauseModal();
//     this.finishModal = new GameFinishModal();
//
//     if (this.stage !== null) {
//       this.stage.init();
//     }
//
//     this.finished = false;
//     this.paused = false;
//
//     this.startts = 0;
//     this.lag = 0;
//   };
//   /**
//    * sets the stage
//    * @param {string} stageName name of the stage
//    */
//   this.setStage = function(stageName) {
//     var stageClass = this.gD.stages[stageName][0];
//     this.stage = new stageClass(this);
//     this.stage.init();
//   };
//   /**
//    * sets the player
//    * @param {string} playerName name of the playermodel
//    */
//   this.addPlayer = function(playerName) {
//     var player = new GamePlayer((this.player.length + 1) * 20, 260, this.gD.spriteDict[playerName][2],
//       this.gD.spriteDict[playerName][3], this.gD.player[playerName][4], playerName);
//     player.init(this, this.gD);
//     this.player.push(player);
//   };
//   /**
//    * levels the speed
//    */
//   this.speedLvlUp = function() {
//     this.distanceSinceLvlUp = 0;
//     this.globalSpeed++;
//   };
//   /**
//    * clears the canvas
//    */
//   this.clear = function() {
//     this.gD.context.clearRect(0, 0, this.gD.canvas.width, this.gD.canvas.height);
//   };
//   /**
//    * pauses the game and shows the pause modal
//    */
//   this.pause = function() {
//     this.paused = true;
//     cancelAnimationFrame(this.raf);
//     this.backgroundMusic.pause();
//     this.pauseModal.draw(this.gD);
//   };
//   /**
//    * continues the game from the pause state
//    */
//   this.continue = function() {
//     this.paused = false;
//     var game = this;
//     this.raf = requestAnimationFrame(function(timestamp){ updateGame(game, timestamp, true); });
//     this.backgroundMusic.play();
//   };
//   /**
//    * terminates the game
//    */
//   this.finish = function() {
//     var cash = 0;
//     var bonus = 0;
//     var distanceInMeter = this.distanceTravelled / 15;
//     var minDistInMeterForMaxHype = 4000 / this.stage.difficulty * 10;
//     var date = new Date();
//
//     this.finished = true;
//     cancelAnimationFrame(this.raf);
//     this.backgroundMusic.pause();
//     this.endMusic.load();
//     this.endMusic.play();
//     this.endMusic.muted = this.gD.muted;
//
//     for (var i = 0; i < this.player.length; i++) {
//       cash += this.player[i].cashVault.getTotalCash();
//     }
//
//     if (distanceInMeter > 500) {
//       if (distanceInMeter < minDistInMeterForMaxHype) {
//         bonus += (distanceInMeter - 500) * distanceInMeter / minDistInMeterForMaxHype;
//       } else {
//         bonus += distanceInMeter - 500;
//       }
//     }
//
//     this.menu.shop.cash += cash + bonus;
//
//     if (!this.menu.achievements.achievementList.achievements[27].finished) {
//       this.menu.achievements.achievementValues[27]++;
//       this.menu.achievements.achievementList.achievements[27].check(this.menu.achievements);
//     }
//     if (!this.menu.achievements.achievementList.achievements[28].finished) {
//       this.menu.achievements.achievementValues[28] += this.cash;
//       this.menu.achievements.achievementList.achievements[28].check(this.menu.achievements);
//     }
//     if (!this.menu.achievements.achievementList.achievements[29].finished && this.menu.achievements.achievementValues[29] < this.menu.shop.cash) {
//       this.menu.achievements.achievementValues[29] = this.menu.shop.cash;
//       this.menu.achievements.achievementList.achievements[29].check(this.menu.achievements);
//     }
//     if (!this.menu.achievements.achievementList.achievements[30].finished) {
//       this.menu.achievements.achievementValues[30] += Math.floor(this.distanceTravelled / 15);
//       this.menu.achievements.achievementList.achievements[30].check(this.menu.achievements);
//     }
//
//     this.menu.highscores.newHighscore([
//       date.toLocaleString('de-DE', {weekday:'short'}) + " " + date.toLocaleString('de-DE'),
//       distanceInMeter,
//       this.cash.toString() + "(+" + bonus.toString() + ")"
//       ]);
//     this.gD.save.cash = this.menu.shop.cash;
//     this.gD.save.highscores = this.menu.highscores.highscores;
//   };
//   /**
//    * shows the game and starts it
//    */
//   this.show = function() {
//     this.visible = true;
//     this.init();
//     var game = this;
//     this.raf = requestAnimationFrame(function(timestamp){ updateGame(game, timestamp, true); });
//     this.backgroundMusic.load();
//     this.backgroundMusic.play();
//     this.backgroundMusic.muted = this.gD.muted;
//   };
//   /**
//    * hides the game
//    */
//   this.stop = function() {
//     this.visible = false;
//     this.endMusic.pause();
//     this.stage = null;
//   };
// }
//
// function GamePlayer(x, y, width, height, weight, playerName) {
//   this.x = x;
//   this.y = y;
//   this.width = width;
//   this.height = height;
//   this.weight = weight;                                      //this.weight / stage.gravity = normal gravity
//   this.playerName = playerName;
//   this.speed = 0;
//   this.velocity = 0;
//   this.jumps = 0;
//   this.jumping = false;
//   this.onFloor = false;
//   this.aboveFloor = false;
//   this.outsideWater = false;
//   this.outsideCanvas = false;
//   this.distanceBackwards = 0;
//   this.currentFloor = undefined;
//   this.init = function(game, gD) {
//     this.inventory = new GameInventory();
//     this.cashVault = new GameCashVault(900, game.player.length * 30, 100, 30, "14pt", "Consolas");
//     this.inventory.init(game, gD);
//     this.cashVault.init(game, gD);
//     if (this.playerName == "Player_Afroman") {
//       this.inventory.fill(10);
//     }
//   };
//   this.moveForward = function(game, gD) {
//     this.speed = gD.player[this.playerName][2] + game.globalSpeed;
//   };
//   this.moveBackward = function(game, gD) {
//     this.speed = gD.player[this.playerName][3] + game.globalSpeed;
//   };
//   this.stopMoving = function() {
//     this.speed = game.globalSpeed;
//   };
//   this.downFromPlatform = function() {
//     this.onFloor = false;
//     this.currentFloor = undefined;
//     this.jumps = 1;
//   };
//   this.jump = function(game, gD) {
//     if (!this.jumping && this.jumps < gD.player[this.playerName][0]) {
//       if (game.stage == "Stage_Universe") {
//         this.velocity = gD.player[this.playerName][1] / 2.9;
//         this.jumping = true;
//       } else if (game.stage == "Stage_Water" && this.y + this.height >= game.gD.canvas.height / 2) {
//         this.velocity = gD.player[this.playerName][1] / 3;
//       } else {
//         this.velocity = gD.player[this.playerName][1];
//         this.jumping = true;
//       }
//       this.onFloor = false;
//     }
//   };
//   this.jumpStop = function() {
//     this.jumping = false;
//     this.jumps++;
//   };
//   this.draw = function(game, gD, ghostFactor) {
//     var spriteRef = gD.spriteDict[this.playerName];
//     if (this.inventory.items["Item_Rocket"].active) {
//       spriteRef = gD.spriteDict["Item_Rocket"];
//     }
//     gD.context.drawImage(gD.spritesheet, spriteRef[0], spriteRef[1], spriteRef[2], spriteRef[3],
//       (this.x - game.distanceTravelled) + (this.speed * ghostFactor), this.y + (this.velocity * ghostFactor), this.width, this.height);
//     this.inventory.draw(game, gD, ghostFactor);
//     this.cashVault.draw(game, gD, ghostFactor);
//   };
//   this.newPos = function(game, gD) {
//     if (this.inventory.items["Item_Rocket"].active) {
//       this.x += this.speed;Math.min(Math.pow((-game.itemTimer[5] + 5 + (max / 2)) / (max / 5), 4) - 40, Math.ceil(game.globalBaseSpeed - (game. distanceTravelled * 0.00015))); //-((-x + 5 + (max/2)) / (max/5))^4+40 max is the max durability of the item
//       this.y -= (this.y - 50) / 40;
//       this.onFloor = false;
//       this.velocity = 0;
//       this.jumps = 1;
//     } else {
//       if (!this.onFloor || (this.currentFloor != undefined && this.currentFloor.type == 2)) {
//         this.y += this.velocity;
//         this.velocity += this.weight / game.stage.gravity;
//         if (game.stage == "Stage_Water") {
//           if (this.y + this.height > game.gD.canvas.height / 2) {
//             if (this.outsideWater) {
//               this.velocity = 1;
//             }
//             this.outsideWater = false;
//           } else {
//             if (!this.outsideWater) {
//               this.velocity = game.player[this.playerName][1] / 1.8;
//             }
//             this.outsideWater = true;
//           }
//         }
//       }
//       this.x += this.speed;
//       this.touchFloor(game, gD);
//     }
//     this.hitWalls(game, gD);
//   };
//   this.hitWalls = function(game, gD) {  //checks, if the player touches a canvas wall, or the floor of the current stage
//     if (this.y + this.height > gD.canvas.height - game.stages[game.stage].deadZoneGround) {
//       if (this.inventory.items["Item_Star"].active) {
//         this.y = gD.canvas.height - game.stages[game.stage].deadZoneGround - this.height;
//         this.velocity = 0;
//         this.onFloor = true;
//         this.jumps = 1;
//       } else {
//         game.finish();
//       }
//     }
//
//     if (this.x < 0) {
//       this.x = 0;
//     } else if (this.x + this.width > gD.canvas.width) {
//       this.x = gD.canvas.width - this.width;
//     }
//   };
//   this.touchFloor = function(game, gD) {
//     for (var i = 0; i < game.floor.length; i++) {
//       var floor = game.floor[i];
//       if ((this.x > floor.x && this.x < floor.x + floor.width) ||
//           (this.x + this.width > floor.x && this.x + this.width < floor.x + floor.width)) {
//         if (this.currentFloor != undefined && this.y + this.height > this.currentFloor.y - (this.currentFloor.thickness / 2) && this.velocity > 0 && this.aboveFloor) {
//           if (!gD.keys[game.menu.controls.keyBindings["Game4"][2][0]] && !gD.keys[game.menu.controls.keyBindings["Game4"][2][1]]) {
//             switch (this.currentFloor.type) {
//               case 1:
//                 this.velocity = -this.velocity * 0.9;
//                 break;
//               case 2:
//                 this.currentFloor.isFalling = true;
//                 this.onFloor = true;
//                 this.velocity = 0;
//                 break;
//               default:
//                 this.aboveFloor = false;
//                 this.onFloor = true;
//                 this.velocity = 0;
//             }
//             this.y = this.currentFloor.y - (this.currentFloor.thickness / 2) - this.height;
//             this.jumps = 1;
//           } else {
//             this.currentFloor = undefined;
//           }
//         }
//         if (this.y + this.height < floor.y - (floor.thickness / 2)) {
//           this.aboveFloor = true;
//           if (this.currentFloor == undefined || floor.y - this.y < this.currentFloor.y - this.y) {
//             this.currentFloor = floor;
//           }
//         }
//       }
//       if (i + 1 == game.floor.length && this.currentFloor != undefined &&
//           (this.x > this.currentFloor.x + this.currentFloor.width || this.x + this.width < this.currentFloor.x) &&
//           !(this.y == gD.canvas.height - game.stages[game.stage].deadZoneGround - this.height)) {
//         this.aboveFloor = false;
//         this.onFloor = false;
//         this.currentFloor = undefined;
//       }
//     }
//   };
//   this.collect = function(game, object) {                   //checks if an object is touched by the player
//     if (!(this.y + this.height < object.y) ||
//         (this.y > object.y + object.height) ||
//         (this.x + this.width < object.x) ||
//         (this.x > object.x + object.width)) {
//       switch (object.name.split("_")[0]) {
//         case "Item":
//           this.inventory.items[object.name].amount++;
//           break;
//         case "Money":
//           this.cashVault.money[object.name]++;
//           break;
//         case "Enemy":
//           game.finish();
//           break;
//         default:
//       }
//       return true;
//     }
//     return false;
//   };
// }
//
// function GameInventory() {
//   this.items = {};
//   this.init = function(game, gD) {
//     var counter = 0;
//     for (var str in gD.items) {
//       this.items[str] = new GameInventoryItem(60 * counter, 0, 60, 30, "14pt", "Consolas", str, gD.items[str][1] + (gD.items[str][2] * game.shop.level[counter]));
//       counter++;
//     }
//   };
//   this.fill = function(amount) {
//     for (var str in this.items) {
//       this.items[str].amount = amount;
//     }
//   };
//   this.draw = function(game, gD, ghostFactor) {
//     for (var str in this.items) {
//       this.items[str].draw(game, gD, ghostFactor);
//     }
//   };
// }
//
// function GameInventoryItem(x, y, width, height, size, family, itemName, maxDurability) {
//   this.x = x;
//   this.y = y;
//   this.width = width;
//   this.height = height;
//   this.size = size;
//   this.family = family;
//   this.itemName = itemName;
//   this.maxDurability = maxDurability;
//   this.backgroundcolor = "rgba(255, 255, 255, 0.4)";
//   this.activationcolor = "rgba(0, 255, 0, 0.4)";
//   this.textAlign = "end";
//   this.textBaseline = "middle";
//   this.textcolor = "rgba(0, 0, 0, 1)";
//   this.bordercolor = "rgba(0, 0, 0, 1)";
//   this.bordersize = 2;
//   this.durability = 0;
//   this.amount = 0;
//   this.used = 0;
//   this.active = false;
//   this.activate = function() {
//     if (!this.active && this.amount > 0) {
//       this.active = true;
//       this.durability = this.maxDurability;
//       this.amount--;
//       this.used++;
//     }
//   };
//   this.update = function(game) {
//     if (this.active) {
//       if (this.durability > 0) {
//         this.durability--;
//       } else {
//         this.active = false;
//         switch (this.itemNr) {
//           case 0:
//             if (!game.menu.achievements.achievementList.achievements[12].finished) {
//               game.menu.achievements.achievementValues[12] += (game.gD.itemBaseDur[i] + (game.menu.shop.level[i] * game.gD.itemPerLvlDur[i])) / 50;
//               game.menu.achievements.achievementList.achievements[12].check(game.menu.achievements);
//             }
//             break;
//           case 1:
//             if (game.player.y == game.gD.canvas.height - game.stages[game.stageNr].deadZoneGround - game.player.height) {
//               game.player.onFloor = false;
//             }
//             break;
//           default:
//             break;
//         }
//       }
//     }
//   };
//   this.draw = function(game, gD, ghostFactor) {
//     var itemRef = gD.spriteDict[this.itemName];
//
//     gD.context.fillStyle = this.backgroundcolor;
//     gD.context.fillRect(this.x, this.y, this.width, this.height);
//     gD.context.fillStyle = this.activationcolor;
//     gD.context.fillRect(this.x + 1, this.y + 1, this.duration * ((this.width - 2) / this.maxDuration), this.height - 2);
//     gD.context.drawImage(gD.spritesheet, itemRef[0], itemRef[1], itemRef[2], itemRef[3],
//       this.x + 2, this.y + Math.floor((this.height / itemRef[3]) / 2), itemRef[2], itemRef[3]);
//     gD.context.textAlign = this.textAlign;
//     gD.context.textBaseline = this.textBaseline;
//     gD.context.font = this.size + " " + this.family;
//     gD.context.fillStyle = this.textcolor;
//     gD.context.fillText(this.amount.toString(), this.x + this.width - 3, this.y + (this.height / 2));
//     gD.context.lineWidth = this.bordersize;
//     gD.context.strokeStyle = this.bordercolor;
//     gD.context.strokeRect(this.x, this.y, this.width, this.height);
//   };
// }
//
// function GameCashVault(x, y, width, height, size, family) {
//   this.money = {};
//   this.x = x;
//   this.y = y;
//   this.width = width;
//   this.height = height;
//   this.size = size;
//   this.family = family;
//   this.backgroundcolor = "rgba(255, 255, 255, 0.4)";
//   this.textcolor = "rgba(0, 0, 0, 1)";
//   this.bordercolor = "rgba(0, 0, 0, 1)";
//   this.bordersize = 2;
//   this.init = function(game, gD) {
//     for (var str in gD.money) {
//       this.money[str] = 0;
//     }
//   };
//   /**
//    * @return {number} returns the total cash
//    */
//   this.getTotalCash = function() {
//     return Object.keys(this.money).reduce(function(accumulator, key) {
//       return accumulator + this.money[key] * parseInt(key.split('_')[1]);
//     });
//   };
//   this.draw = function(game, gD) {
//     gD.context.fillStyle = this.backgroundcolor;
//     gD.fillRect(this.x, this.y, this.width, this.height);
//     gD.context.textAlign = "start";
//     gD.context.textBaseline = "middle";
//     gD.context.font = this.size + " " + this.family;
//     gD.context.fillStyle = this.textcolor;
//     gD.context.fillText("Cash:", this.x + 3, this.y + (this.height / 2));
//     gD.context.textAlign = "end";
//     gD.context.fillText(this.getTotalCash(), this.x + this.width - 3, this.y + (this.height / 2));
//     gD.context.lineWidth = this.bordersize;
//     gD.context.strokeStyle = this.bordercolor;
//     gD.context.strokeRect(this.x, this.y, this.width, this.height);
//   };
// }
//
//
//
//
// function GameFloor(x, y, width, name) {
//   this.x = x;
//   this.y = y;
//   this.width = width;
//   this.name = name;
//   this.weight = 4;//(300 - 50) / (maxW - minW) * (width - 50) + minW;
//   this.thickness = 5;
//   this.velocity = 0;
//   this.isFalling = false;
//   this.objects = [];
//   this.addObject = function(object) {
//     this.objects.push(object);
//   };
//   this.draw = function(game, gD, ghostFactor) {
//     gD.context.beginPath();
//     gD.context.moveTo(this.x + (game.globalSpeed * ghostFactor), this.y * (this.velocity * ghostFactor));
//     gD.context.lineTo(this.x + this.width + (game.globalSpeed * ghostFactor), this.y * (this.velocity * ghostFactor));
//
//     if (gD.floors[this.name][1] == "stagecolor") {
//       gD.context.strokeStyle = game.stages[game.stage].floorColor;
//     } else {
//       gD.context.strokeStyle = gD.floors[this.name][1];
//     }
//     gD.context.lineWidth = this.thickness;
//     gD.context.stroke();
//
//     for (var i = 0; i < this.objects.length; i++) {
//       this.objects[i].draw(game, gD, ghostFactor);
//     }
//   };
//   this.newPos = function(game, gD) {
//     this.x += game.globalSpeed;
//     this.y += this.velocity;
//     if (this.isFalling) {
//       this.velocity += game.stages[game.stage].gravity / this.weight;
//     } else if (!this.isFalling && this.name == "Floor_Moving") {
//       this.velocity -= game.stages[game.stage].gravity / this.weight;
//     }
//     if (this.name == "Floor_Moving" && (this.velocity > 3 || this.velocity < -3)) {
//       this.isFalling = !this.isFalling;
//     }
//     for (var i = 0; i < this.objects.length; i++) {
//       this.objects[i].newPos(game, gD);
//     }
//   };
// }
//
// function GameThorns(x, y, width, height, color, alignment) {
//   this.x = x;
//   this.y = y;
//   this.width = width;
//   this.height = height;
//   this.color = color;
//   this.alignment = alignment;
//   this.draw = function(game, gD, ghostFactor) {
//     if (this.alignment == "left") {
//       gD.context.beginPath();
//       gD.context.moveTo(this.x + (game.globalSpeed * ghostFactor), this.y + (this.height / 2));
//       gD.context.lineTo(this.x + (game.globalSpeed * ghostFactor) + 5, this.y + (this.height / 2) - 2.5);
//       for (var i = 1; i <= 5; i++) {
//         gD.context.lineTo(this.x + (game.globalSpeed * ghostFactor) + (i * 10), this.y);
//         gD.context.lineTo(this.x + (game.globalSpeed * ghostFactor) + (i * 10) + 5, this.y + (this.height / 2) - 2.5);
//       }
//       gD.context.lineTo(this.x + (game.globalSpeed * ghostFactor) + this.width, this.y + (this.height / 2) + 2.5);
//       for (var i = 5; i >= 1; i--) {
//         gD.context.lineTo(this.x + (game.globalSpeed * ghostFactor) + (i * 10), this.y + this.height);
//         gD.context.lineTo(this.x + (game.globalSpeed * ghostFactor) + (i * 10) + 5, this.y + (this.height / 2) + 2.5);
//       }
//       gD.context.lineTo(this.x + (game.globalSpeed * ghostFactor), this.y + (this.height / 2));
//       gD.context.fillStyle = this.color;
//       gD.context.fill();
//     }
//     if (this.alignment == "right") {
//       gD.context.beginPath();
//       gD.context.moveTo(this.x + (game.globalSpeed * ghostFactor) + this.width, this.y + (this.height / 2));
//       gD.context.lineTo(this.x + (game.globalSpeed * ghostFactor) + this.width - 5, this.y + (this.height / 2) - 2.5);
//       for (var i = 1; i <= 5; i++) {
//         gD.context.lineTo(this.x + (game.globalSpeed * ghostFactor) + this.width - (i * 10), this.y);
//         gD.context.lineTo(this.x + (game.globalSpeed * ghostFactor) + this.width - (i * 10) + 5, this.y + (this.height / 2) - 2.5);
//       }
//       gD.context.lineTo(this.x + (game.globalSpeed * ghostFactor), this.y + (this.height / 2) + 2.5);
//       for (var i = 5; i >= 1; i--) {
//         gD.context.lineTo(this.x + (game.globalSpeed * ghostFactor) + this.width - (i * 10), this.y + this.height);
//         gD.context.lineTo(this.x + (game.globalSpeed * ghostFactor) + this.width - (i * 10) + 5, this.y + (this.height / 2) + 2.5);
//       }
//       gD.context.lineTo(this.x + (game.globalSpeed * ghostFactor) + this.width, this.y + (this.height / 2));
//       gD.context.fillStyle = this.color;
//       gD.context.fill();
//     }
//   };
//   this.newPos =function(game) {
//     this.x += game.globalSpeed;
//   };
// }
//
// function GameObject(x, y, width, height, name, cycles) {
//   this.x = x;
//   this.y = y;
//   this.width = width;
//   this.height = height;
//   this.name = name;
//   this.cycles = cycles;
//   this.draw = function(game, gD, ghostFactor) {
//     var spriteRef = gD.spriteDict[this.name + "_" + ((game.frameCounter / 8) % this.cycles)];
//
//     gD.context.drawImage(gD.spritesheet, spriteRef[0], spriteRef[1], spriteRef[2], spriteRef[3],
//       this.x + (game.globalSpeed * ghostFactor), this.y, spriteRef[2], spriteRef[3]);
//   };
//   this.newPos = function(game) {
//     this.x += game.globalSpeed;
//
//     for (var i = 0; i < game.player.length; i++) {
//       if (game.player[i].inventory.items["Item_Magnet"].active) {
//         var distX = (game.player[i].x + (game.player[i].width / 2)) - (this.x + (this.width / 2));
//         var distY = (game.player[i].y + (game.player[i].height / 2)) - (this.y + (this.height / 2));
//         var distanceToPlayer = Math.sqrt(Math.pow(distX, 2) + Math.pow(distY, 2));
//         if (distanceToPlayer < 150) {
//           this.x += (distX * Math.pow(20, 3)) / Math.pow(distanceToPlayer, 3);
//           this.y += (distY * Math.pow(20, 3)) / Math.pow(distanceToPlayer, 3);
//         }
//       }
//     }
//   };
// }
//
//
//
// function GameModal(x, y, width, height, color) {
//   this.x = x;
//   this.y = y;
//   this.width = width;
//   this.height = height;
//   this.color = color;
//   this.selected = 0;
//   this.init = function(game, gD) {
//     this.title = new CanvasText(this.gD.canvas.width / 2, this.gD.canvas.height / 2 - 60, "YOU DIED", "normal");
//   };
//   this.draw = function(game, gD) {
//     this.title.draw(gD);
//   };
// }
//
// function GameModal(x, y, width, height, color) {
//   this.x = x;
//   this.y = y;
//   this.width = width;
//   this.height = height;
//   this.color = color;
//   this.texts = [];
//   this.buttons = [];
//   this.selected = 0;
//   this.init = function() {
//     this.buttons[this.selected].select();
//   };
//   this.draw = function(gD) {
//     gD.context.fillStyle = this.color;
//     gD.context.fillRect(this.x, this.y, this.width, this.height);
//     for (var i = 0; i < this.texts.length; i++) {
//       this.texts[i].draw(gD);
//     }
//     gD.context.filter = "none";
//     for (var i = 0; i < this.buttons.length; i++) {
//       this.buttons[i].draw(gD);
//     }
//   };
// }
//
// function addFloor(game, gD) {
//   var sum = gD.floorProb.reduce(function(a, b){return a + b;}, 0);
//   var random = Math.random();
//   var limit = 0;
//   for (var i = 0; i < gD.floorProb.length; i++) {
//     limit += gD.floorProb[i];
//     if (random * sum <= limit) {
//       var maxY = 140;
//       var maxWidth = 400 - (game.distanceTravelled * 0.005);
//       var minWidth = 50;
//       var maxDist = 120;
//       var widthStep = 1;
//       if (game.distanceTravelled < 4500) {
//         i = 0;
//       }
//       switch (i) {
//         case 0:
//           break;
//         case 1:
//           maxWidth = 300 - (game.distanceTravelled * 0.005);
//           minWidth = 60;
//           break;
//         case 2:
//           maxWidth = 200 - (game.distanceTravelled * 0.005);
//           break;
//         case 3:
//           maxY = 30;
//           widthStep = 10;
//           maxDist = 100;
//           break;
//         default:
//           break;
//       }
//       var y = (Math.random() * (gD.canvas.height - 140)) + 90;
//       if (Math.abs(game.floor[game.floor.length - 1].y - y) > maxY) {
//         if (game.floor[game.floor.length - 1].y < y) {
//           y = game.floor[game.floor.length - 1].y + maxY;
//         } else {
//           y = game.floor[game.floor.length - 1].y - maxY;
//         }
//       }
//       game.floor.push(new GameFloor(
//         gD.canvas.width + 50 + (Math.random() * maxDist),
//         Math.floor(y) + 0.5,
//         Math.max(Math.floor((Math.random() * maxWidth) / widthStep) * widthStep, minWidth),
//         i,
//         5
//       ));
//       break;
//     }
//   }
// }
//
// function addMoney(game, gD) {
//   var sum = game.currentMoneyProb.reduce(function(a, b){return a + b;}, 0);
//   var random = Math.random();
//   var limit = 0;
//   for(var i = 0; i < game.currentMoneyProb.length; i++) {
//     limit += game.currentMoneyProb[i];
//     if (random * sum <= limit) {
//       if (60 + (random * (gD.canvas.height - 110)) <= game.floor[game.floor.length - 1].y + 4 && 60 + (random * (gD.canvas.height - 110)) + 17 >= game.floor[game.floor.length - 1].y - 4) {
//         random -= (gD.spriteDict["Money" + (i + 1)][3] + 5) / (gD.canvas.height - 110);
//       }
//       game.moneyObjects.push(new GameObject(
//         gD.canvas.width + 20,
//         60 + (random * (gD.canvas.height - 110)),
//         gD.spriteDict["Money" + (i + 1)][2],
//         gD.spriteDict["Money" + (i + 1)][3],
//         "Money" + (i + 1),
//         Math.pow(10, i)
//       ));
//       break;
//     }
//   }
//   game.moneySpawnCounter = Math.max(Math.floor(Math.random() * (400 - (game.distanceTravelled * 0.001))), 15);
// }
//
// function addItem(game, gD) {
//   var sum = gD.itemProb.reduce(function(a, b){return a + b;}, 0);
//   var random = Math.random();
//   var limit = 0;
//   for(var i = 0; i < gD.itemProb.length; i++) {
//     limit += gD.itemProb[i];
//     if (random * sum <= limit) {
//       random = Math.random();
//       if (50 + (random * (gD.canvas.height - 140)) <= game.floor[game.floor.length - 1].y + 4 && 50 + (random * (gD.canvas.height - 140)) + gD.spriteDict["Item" + (i + 1)][3] >= game.floor[game.floor.length - 1].y - 4) {
//         random -= (gD.spriteDict["Item" + (i + 1)][3] + 5) / (gD.canvas.height - 140);
//       }
//       game.itemObjects.push(new GameObject(
//         gD.canvas.width + 20,
//         50 + (random * (gD.canvas.height - 140)),
//         gD.spriteDict["Item" + (i + 1)][2],
//         gD.spriteDict["Item" + (i + 1)][3],
//         "Item" + (i + 1),
//         i
//       ));
//       break;
//     }
//   }
//   game.itemSpawnCounter = Math.max(Math.floor(Math.random() * (2200 - (game.distanceTravelled * 0.001))), 700);
// }
//
// function gameControlDown(game, key) {
//   if (!game.finished && !game.paused) {
//     for(var i = 0; i < game.gD.itemProb.length; i++) {
//       if (game.menu.controls.keyBindings["Game" + (i + 6)][2].includes(key) && game.inventory[i] > 0 && !game.itemsActive[i]) {
//         game.itemsActive[i] = true;
//         game.itemTimer[i] = game.gD.itemBaseDur[i] + (game.menu.shop.level[i] * game.gD.itemPerLvlDur[i]);
//         game.inventory[i]--;
//         game.itemsUsed[i]++;
//         if (!game.menu.achievements.achievementList.achievements[23].finished && i == 1 && game.player.y > game.gD.canvas.height - 30 - game.player.height) {
//           game.menu.achievements.achievementValues[23]++;
//           game.menu.achievements.achievementList.achievements[23].check(game.menu.achievements);
//         }
//         break;
//       }
//     }
//     var temp = game.itemsUsed.reduce(function(a, b){b > 0 ? a++ : a; return a;}, 0);
//     if (!game.menu.achievements.achievementList.achievements[4].finished && game.menu.achievements.achievementValues[4] < temp) {
//       game.menu.achievements.achievementValues[4] = temp;
//       game.menu.achievements.achievementList.achievements[4].check(game.menu.achievements);
//     }
//     for(var i = 5; i < 11; i++) {
//       if (!game.menu.achievements.achievementList.achievements[i].finished && game.menu.achievements.achievementValues[i] < game.itemsUsed[i - 5]) {
//         game.menu.achievements.achievementValues[i] = game.itemsUsed[i - 5];
//         game.menu.achievements.achievementList.achievements[i].check(game.menu.achievements);
//       }
//     }
//     var temp = game.itemsActive.reduce(function(a, b){b ? a++ : a; return a;}, 0);
//     if (!game.menu.achievements.achievementList.achievements[11].finished && game.menu.achievements.achievementValues[11] < temp) {
//       game.menu.achievements.achievementValues[11] = temp;
//       game.menu.achievements.achievementList.achievements[11].check(game.menu.achievements);
//     }
//     if (game.menu.controls.keyBindings["Game1"][2].includes(key)) {                                  //pause game
//       game.pause();
//     } else if (game.menu.controls.keyBindings["Game2"][2].includes(key)) {              //move forward
//       game.player.speedX = game.playerDict[game.player.playerNr.toString()][2];
//     } else if (game.menu.controls.keyBindings["Game3"][2].includes(key)) {              //move backwards
//       game.player.speedX = game.playerDict[game.player.playerNr.toString()][3];
//     } else if (game.menu.controls.keyBindings["Game4"][2].includes(key) && game.player.onFloor) {       //down from platform
//       game.player.onFloor = false;
//       game.player.currentFloor = undefined;
//       game.player.secondJump = 1;
//     } else if (game.menu.controls.keyBindings["Game5"][2].includes(key) && game.stageNr == 3 && game.player.y + game.player.height >= game.gD.canvas.height / 2) {        //jump inside the water
//       game.player.velocity = game.playerDict[game.player.playerNr.toString()][1] / 3;
//       game.player.onFloor = false;
//       game.player.secondJump = 0;
//     } else if (game.menu.controls.keyBindings["Game5"][2].includes(key) && game.player.onFloor) {      //jump
//       if (game.stageNr == 5) {
//         game.player.velocity = game.playerDict[game.player.playerNr.toString()][1] / 2.9;
//       } else {
//         game.player.velocity = game.playerDict[game.player.playerNr.toString()][1];
//       }
//       game.player.onFloor = false;
//       game.player.secondJump = 0;
//       if (!game.menu.achievements.achievementList.achievements[22].finished) {
//         game.menu.achievements.achievementValues[22]++;
//         game.menu.achievements.achievementList.achievements[22].check(game.menu.achievements);
//       }
//     } else if (game.menu.controls.keyBindings["Game5"][2].includes(key) && game.player.secondJump % 2 == 1 && game.player.secondJump < (game.playerDict[game.player.playerNr.toString()][0] - 1) * 2) {          //jump
//       if (game.stageNr == 5) {
//         game.player.velocity = game.playerDict[game.player.playerNr.toString()][1] / 2.9;
//       } else {
//         game.player.velocity = game.playerDict[game.player.playerNr.toString()][1];
//       }
//       game.player.secondJump++;
//       if (!game.menu.achievements.achievementList.achievements[2].finished && game.player.secondJump == 2) {
//         game.menu.achievements.achievementValues[2]++;
//         game.menu.achievements.achievementList.achievements[2].check(game.menu.achievements);
//       }
//       if (!game.menu.achievements.achievementList.achievements[22].finished) {
//         game.menu.achievements.achievementValues[22]++;
//         game.menu.achievements.achievementList.achievements[22].check(game.menu.achievements);
//       }
//     }
//   } else if (game.paused) {
//     if (game.menu.controls.keyBindings["FinishModal1"][2].includes(key) || game.menu.controls.keyBindings["FinishModal2"][2].includes(key)) {   //navigation up or down keys
//       game.pauseModal.buttons[game.pauseModal.selected].deselect();
//       game.pauseModal.buttons[(game.pauseModal.selected + 1) % 2].select();
//       game.pauseModal.selected = (game.pauseModal.selected + 1) % 2;
//       drawGame(game, 0);
//     } else if (game.menu.controls.keyBindings["FinishModal3"][2].includes(key)) {                     //enter key
//       switch (game.pauseModal.selected) {
//         case 1:
//           game.stop();
//           game.menu.show();
//           break;
//         default:
//           game.continue();
//           break;
//       }
//     } else if (game.menu.controls.keyBindings["Game1"][2].includes(key)) {                                  //pause game
//       game.continue();
//     }
//   } else if (game.finished) {
//     if (game.menu.controls.keyBindings["FinishModal3"][2].includes(key)) {
//       switch (game.finishModal.selected) {
//         case 0:
//           var playerNr = game.player.playerNr;
//           game.endMusic.pause();
//           game.init();
//           game.player.setPlayer(playerNr, game, game.gD);
//           game.show();
//           break;
//         default:
//           game.stop();
//           game.menu.show();
//           break;
//       }
//     } else if (game.menu.controls.keyBindings["FinishModal1"][2].includes(key) || game.menu.controls.keyBindings["FinishModal2"][2].includes(key)) {
//       game.finishModal.buttons[game.finishModal.selected].deselect();
//       game.finishModal.buttons[(game.finishModal.selected + 1) % 2].select();
//       game.finishModal.selected = (game.finishModal.selected + 1) % 2;
//       drawGame(game, 0);
//     }
//   }
// }
//
// function gameControlUp(game, key) {
//   if (game.menu.controls.keyBindings["Game3"][2].includes(key) && !(game.gD.keys[game.menu.controls.keyBindings["Game2"][2][0]] || game.gD.keys[game.menu.controls.keyBindings["Game2"][2][1]])) {              //move backwards released
//     game.player.speedX = 0;
//     if (!game.menu.achievements.achievementList.achievements[21].finished && game.player.distanceBackwards != 0) {
//       game.menu.achievements.achievementValues[21] += Math.floor(game.player.distanceBackwards / 15);
//       game.menu.achievements.achievementList.achievements[21].check(game.menu.achievements);
//     }
//     game.player.distanceBackwards = 0;
//   } else if (game.menu.controls.keyBindings["Game2"][2].includes(key) && !(game.gD.keys[game.menu.controls.keyBindings["Game3"][2][0]] || game.gD.keys[game.menu.controls.keyBindings["Game3"][2][1]])) {       //move forward released
//     game.player.speedX = 0;
//   } else if (game.menu.controls.keyBindings["Game5"][2].includes(key) && game.player.secondJump % 2 == 0 && game.player.secondJump < ((game.playerDict[game.player.playerNr.toString()][0] - 1) * 2) - 1) {                                  //jump released
//     game.player.secondJump++;
//   }
// }
//
// function gameMouseMove(game) {
//   if (game.paused) {
//     for (var i = 0; i < game.pauseModal.buttons.length; i++) {
//       if (game.gD.mousePos.x >= game.pauseModal.buttons[i].x && game.gD.mousePos.x <= game.pauseModal.buttons[i].x + game.pauseModal.buttons[i].width &&
//           game.gD.mousePos.y >= game.pauseModal.buttons[i].y && game.gD.mousePos.y <= game.pauseModal.buttons[i].y + game.pauseModal.buttons[i].height) {
//         game.pauseModal.buttons[game.pauseModal.selected].deselect();
//         game.pauseModal.buttons[i].select();
//         game.pauseModal.selected = i;
//         break;
//       }
//     }
//     drawGame(game, 0);
//   } else if (game.finished) {
//     for (var i = 0; i < game.finishModal.buttons.length; i++) {
//       if (game.gD.mousePos.x >= game.finishModal.buttons[i].x && game.gD.mousePos.x <= game.finishModal.buttons[i].x + game.finishModal.buttons[i].width &&
//           game.gD.mousePos.y >= game.finishModal.buttons[i].y && game.gD.mousePos.y <= game.finishModal.buttons[i].y + game.finishModal.buttons[i].height) {
//         game.finishModal.buttons[game.finishModal.selected].deselect();
//         game.finishModal.buttons[i].select();
//         game.finishModal.selected = i;
//         break;
//       }
//     }
//     drawGame(game, 0);
//   }
// }
//
// function gameClick(game) {
//   if (game.paused) {
//     if (game.gD.mousePos.x >= game.pauseModal.buttons[game.pauseModal.selected].x && game.gD.mousePos.x <= game.pauseModal.buttons[game.pauseModal.selected].x + game.pauseModal.buttons[game.pauseModal.selected].width &&
//         game.gD.mousePos.y >= game.pauseModal.buttons[game.pauseModal.selected].y && game.gD.mousePos.y <= game.pauseModal.buttons[game.pauseModal.selected].y + game.pauseModal.buttons[game.pauseModal.selected].height) {
//       switch (game.pauseModal.selected) {
//         case 1:
//           game.stop();
//           game.menu.show();
//           break;
//         default:
//           game.continue();
//           break;
//       }
//     }
//   } else if (game.finished) {
//     if (game.gD.mousePos.x >= game.finishModal.buttons[game.finishModal.selected].x && game.gD.mousePos.x <= game.finishModal.buttons[game.finishModal.selected].x + game.finishModal.buttons[game.finishModal.selected].width &&
//         game.gD.mousePos.y >= game.finishModal.buttons[game.finishModal.selected].y && game.gD.mousePos.y <= game.finishModal.buttons[game.finishModal.selected].y + game.finishModal.buttons[game.finishModal.selected].height) {
//       switch (game.finishModal.selected) {
//         case 0:
//           var playerNr = game.player.playerNr;
//           game.endMusic.pause();
//           game.init();
//           game.player.setPlayer(playerNr, game, game.gD);
//           game.show();
//           break;
//         default:
//           game.stop();
//           game.menu.show();
//           break;
//       }
//     }
//   }
// }
//
// function gameWheel(game, event) {
//
// }
//
// function updateGame(game, timestamp, resetTime) {
//   if (resetTime) {
//     game.startts = timestamp;
//   }
//
//   if (!game.finished && !game.paused) {
//     game.raf = requestAnimationFrame(function(timestamp){ updateGame(game, timestamp, false); });
//   }
//
//   game.timeDiff = timestamp - game.startts; //relative time in seconds
//   game.lag += game.timeDiff;
//
//   while (game.lag > game.refreshrate) {
//
//     game.frameCounter += 1;
//
//     if (game.itemsActive[5]) {                         //if rocket is active
//       game.moneySpawnCounter -= 5;
//       game.itemSpawnCounter -= 5;
//       var max = game.gD.itemBaseDur[5] + (game.menu.shop.level[5] * game.gD.itemPerLvlDur[5]);
//       game.globalSpeed = Math.min(Math.pow((-game.itemTimer[5] + 5 + (max / 2)) / (max / 5), 4) - 40, Math.ceil(game.globalBaseSpeed - (game. distanceTravelled * 0.00015)));
//       game.distanceTravelled += -game.globalSpeed;
//     } else if (game.itemsActive[0]) {                  //if stopwatch is active
//       game.moneySpawnCounter -= 0.05;
//       game.itemSpawnCounter -= 0.05;
//       game.globalSpeed = -0.1;
//       game.distanceTravelled += -game.globalSpeed;
//     } else {                                           //else
//       game.moneySpawnCounter -= Math.floor(1 + (game.distanceTravelled * 0.00005));  //after 1333m the counter is counted down by 2
//       game.itemSpawnCounter -= Math.floor(1 + (game.distanceTravelled * 0.00005));  //after 1333m the counter is counted down by 2
//       game.currentMoneyProb[2] = Math.min(game.distanceTravelled * 0.00022, 5);   //after 1500m it's nearly at 5
//       game.currentMoneyProb[3] = Math.min(game.distanceTravelled * 0.000066, 2);   //after 2000m it's nearly at 20
//       game.globalSpeed = Math.ceil(game.globalBaseSpeed - (game.distanceTravelled * 0.00015));
//       game.distanceTravelled += -game.globalSpeed;
//     }
//
//     if (game.stageNr == 5) {
//       game.player.gravity = 0.05;
//     } else if (game.itemsActive[2]) {
//       game.player.gravity = 0.1;
//     } else if (game.stageNr == 3 && game.player.y + game.player.height >= game.gD.canvas.height / 2) {
//       game.player.gravity = 0.1;
//     } else {
//       game.player.gravity = 0.45;
//     }
//
//     if (game.itemsActive[3]) {
//       game.moneySpawnCounter = 0;
//     }
//
//     switch (game.stageNr) {
//       case 1:
//         updateStage1(game, game.stages[game.stageNr]);
//         break;
//       case 2:
//         updateStage2(game, game.stages[game.stageNr]);
//         break;
//       case 3:
//         updateStage3(game, game.stages[game.stageNr]);
//         break;
//       case 4:
//         updateStage4(game, game.stages[game.stageNr]);
//         break;
//       case 5:
//         updateStage5(game, game.stages[game.stageNr]);
//         break;
//       default:
//         updateStage0(game, game.stages[game.stageNr]);
//     }
//
//     for (var i = 18; i < 21; i++) {
//       if (!game.menu.achievements.achievementList.achievements[i].finished && game.menu.achievements.achievementValues[i] < Math.floor(game.  distanceTravelled / 15)) {
//         game.menu.achievements.achievementValues[i] = Math.floor(game.distanceTravelled / 15);
//         game.menu.achievements.achievementList.achievements[i].check(game.menu.achievements);
//         if (i == 19 && game.menu.achievements.achievementList.achievements[i].finished) {
//           game.gD.playerUnlocked[4] = true;
//           game.gD.save.playerUnlocked = game.gD.playerUnlocked;
//         }
//       }
//     }
//
//     if (game.floor[game.floor.length - 1].x + game.floor[game.floor.length - 1].width < game.gD.canvas.width) {
//       addFloor(game, game.gD);
//     }
//     if (game.floor[0].x + game.floor[0].width < 0) {
//       game.floor.shift();
//     }
//
//     if (game.moneySpawnCounter <= 0) {
//       addMoney(game, game.gD);
//     }
//     if (game.moneyObjects[0] != undefined && game.moneyObjects[0].x + game.moneyObjects[0].width < 0) {
//       game.moneyObjects.shift();
//     }
//
//     if (game.itemSpawnCounter <= 0) {
//       addItem(game, game.gD);
//     }
//     if (game.itemObjects[0] != undefined && game.itemObjects[0].x + game.itemObjects[0].width < 0) {
//       game.itemObjects.shift();
//     }
//
//     if (game.player.speedX < 0) {
//       game.player.distanceBackwards += Math.abs(game.player.speedX);
//     }
//
//     game.player.newPos(game, game.gD);
//
//     for (var i = 0; i < game.floor.length; i++) {
//       game.floor[i].newPos(game);
//       if (game.floor[i].type == 3) {
//         for (var j = 0; j < game.floor[i].thorns.length; j++) {
//           if (game.player.collect(game.floor[i].thorns[j]) && !game.itemsActive[1] && !game.itemsActive[5]) {
//             game.finish();
//           }
//         }
//       }
//     }
//
//     for (var i = 0; i < game.moneyObjects.length; i++) {
//       game.moneyObjects[i].newPos(game);
//       if (game.player.collect(game.moneyObjects[i])) {
//         game.cash += game.moneyObjects[i].value;
//         if (!game.menu.achievements.achievementList.achievements[3].finished && game.moneyObjects[i].value == 1000) {
//           game.menu.achievements.achievementValues[3]++;
//           game.menu.achievements.achievementList.achievements[3].check(game.menu.achievements);
//         }
//         game.moneyObjects.splice(i, 1);
//         i--;
//         if (!game.menu.achievements.achievementList.achievements[0].finished) {
//           game.menu.achievements.achievementValues[0]++;
//           game.menu.achievements.achievementList.achievements[0].check(game.menu.achievements);
//         }
//       }
//     }
//
//     for (var i = 14; i < 18; i++) {
//       if (!game.menu.achievements.achievementList.achievements[i].finished && game.menu.achievements.achievementValues[i] < game.cash) {
//         game.menu.achievements.achievementValues[i] = game.cash;
//         game.menu.achievements.achievementList.achievements[i].check(game.menu.achievements);
//         if (i == 16 && game.menu.achievements.achievementList.achievements[i].finished) {
//           game.gD.playerUnlocked[3] = true;
//           game.gD.save.playerUnlocked = game.gD.playerUnlocked;
//         }
//       }
//     }
//
//     for (var i = 0; i < game.itemObjects.length; i++) {
//       game.itemObjects[i].newPos(game);
//       if (game.player.collect(game.itemObjects[i])) {
//         game.inventory[game.itemObjects[i].value]++;
//         if (!game.menu.achievements.achievementList.achievements[1].finished && game.itemObjects[i].value == 3) {
//           game.menu.achievements.achievementValues[1]++;
//           game.menu.achievements.achievementList.achievements[1].check(game.menu.achievements);
//         }
//         game.itemObjects.splice(i, 1);
//         i--;
//       }
//     }
//
//     if (game.goldenShamrock) {
//       game.goldenShamrock.newPos(game);
//       if (game.player.collect(game.goldenShamrock)) {
//         game.goldenShamrock = false;
//         for(var i = 31; i < 35; i++) {
//           if (!game.menu.achievements.achievementList.achievements[i].finished) {
//             game.menu.achievements.achievementValues[i]++;
//             game.menu.achievements.achievementList.achievements[i].check(game.menu.achievements);
//             if (i == 34 && game.menu.achievements.achievementList.achievements[i].finished) {
//               game.menu.shop.cash += 1000000;
//               game.gD.save.cash = game.menu.shop.cash;
//             }
//           }
//         }
//       }
//     }
//
//     game.cashLabel.text = "Hype: " + Math.floor(game.cash);
//
//     game.distanceLabel.text = "Distance: " + Math.floor(game.distanceTravelled / 15) + "m";
//
//     game.fpsLabel.text = "Fps: " + Math.floor(1000 / game.timeDiff);
//
//     for (var i = game.itemTimer.length - 1; i >= 0; i--) {
//       if (game.itemTimer[i] > 0) {
//         game.itemTimer[i]--;
//         if (game.itemTimer[i] == 0) {
//           game.itemsActive[i] = false;
//           switch (i) {
//             case 0:
//               if (!game.menu.achievements.achievementList.achievements[12].finished) {
//                 game.menu.achievements.achievementValues[12] += (game.gD.itemBaseDur[i] + (game.menu.shop.level[i] * game.gD.itemPerLvlDur[i])) / 50;
//                 game.menu.achievements.achievementList.achievements[12].check(game.menu.achievements);
//               }
//               break;
//             case 1:
//               if (game.player.y == game.gD.canvas.height - game.stages[game.stageNr].deadZoneGround - game.player.height) {
//                 game.player.onFloor = false;
//               }
//               break;
//             default:
//               break;
//           }
//         }
//       }
//     }
//
//     if (game.finished) {
//       game.finishModal.texts[1].text = "Cash: " + Math.floor(game.cash);
//       game.finishModal.texts[2].text = "Distanz: " + Math.floor(game.distanceTravelled / 15) + "m";
//       game.finishModal.texts[3].text = "Distanzbonus: +" + Math.max(Math.floor(((game.distanceTravelled / 15) - 500) * Math.min(1, game.distanceTravelled /  ((4000 / (game.stages[game.stageNr].difficulty / 10)) * 15))), 0);
//     }
//
//     for (var i = 0; i < game.gD.stagesUnlocked.length; i++) {
//       if (game.stageNr == i && game.distanceTravelled > 15000 + (i * 4500)) {
//         game.gD.stagesUnlocked[i] = true;
//         game.gD.save.stagesUnlocked = game.gD.stagesUnlocked;
//       }
//     }
//
//     if (game.lag > game.refreshrate * 5) {
//       game.lag %= game.refreshrate;
//     } else {
//       game.lag -= game.refreshrate;
//     }
//   }
//
//   drawGame(game, 0);//game.lag / game.refreshrate);
//   game.startts = timestamp;
// }
//
// function drawGame(game, ghostFactor) {
//   game.clear();
//
//   switch (game.stageNr) {
//     case 1:
//       drawBackgroundStage1(game, game.stages[game.stageNr], ghostFactor);
//       break;
//     case 2:
//       drawBackgroundStage2(game, game.stages[game.stageNr], ghostFactor);
//       break;
//     case 3:
//       drawBackgroundStage3(game, game.stages[game.stageNr], ghostFactor);
//       break;
//     case 4:
//       drawBackgroundStage4(game, game.stages[game.stageNr], ghostFactor);
//       break;
//     case 5:
//       drawBackgroundStage5(game, game.stages[game.stageNr], ghostFactor);
//       break;
//     default:
//       drawBackgroundStage0(game, game.stages[game.stageNr], ghostFactor);
//   }
//
//   if (game.player.y + game.player.height < 0) {
//     game.gD.context.drawImage(game.gD.spritesheet, game.gD.spriteDict["Pointer"][0], game.gD.spriteDict["Pointer"][1], game.gD.spriteDict["Pointer"][2], game.gD.spriteDict["Pointer"][3],
//       game.player.x + ((game.player.width - game.gD.spriteDict["Pointer"][2]) / 2), 0, game.gD.spriteDict["Pointer"][2], game.gD.spriteDict["Pointer"][3]);
//     if (!game.menu.achievements.achievementList.achievements[13].finished && !game.player.outsideCanvas) {
//       game.menu.achievements.achievementValues[13]++;
//       game.menu.achievements.achievementList.achievements[13].check(game.menu.achievements);
//       game.player.outsideCanvas = true;
//     }
//   } else {
//     game.player.outsideCanvas = false;
//   }
//
//   for (var i = 0; i < game.floor.length; i++) {
//     game.floor[i].draw(game, game.gD, ghostFactor);
//   }
//
//   for (var i = 0; i < game.moneyObjects.length; i++) {
//     game.moneyObjects[i].draw(game, game.gD, ghostFactor);
//   }
//
//   for (var i = 0; i < game.itemObjects.length; i++) {
//     game.itemObjects[i].draw(game, game.gD, ghostFactor);
//   }
//
//   for (var i = 0; i < game.inventoryTexts.length; i++) {
//     game.inventoryTexts[i].draw(game, game.gD);
//   }
//
//   for (var i = 0; i < game.itemTimer.length; i++) {
//     if (game.itemTimer[i] > 0) {
//       game.gD.context.fillStyle = "rgba(0, 255, 0, 1)";
//       game.gD.context.fillRect(10 + (i * 60), 30, game.itemTimer[i] * (50 / (game.gD.itemBaseDur[i] + (game.menu.shop.level[i] * game.gD.itemPerLvlDur[i]))), 5);  //50 is the maxWidth
//     }
//   }
//
//   if (game.goldenShamrock) {
//     game.goldenShamrock.draw(game, game.gD, ghostFactor);
//   }
//
//   game.cashLabel.draw(game.gD);
//
//   game.distanceLabel.draw(game.gD);
//
//   switch (game.stageNr) {
//     case 1:
//       drawForegroundStage1(game, game.stages[game.stageNr], ghostFactor);
//       break;
//     case 2:
//       drawForegroundStage2(game, game.stages[game.stageNr], ghostFactor);
//       break;
//     case 3:
//       drawForegroundStage3(game, game.stages[game.stageNr], ghostFactor);
//       break;
//     case 4:
//       drawForegroundStage4(game, game.stages[game.stageNr], ghostFactor);
//       break;
//     case 5:
//       drawForegroundStage5(game, game.stages[game.stageNr], ghostFactor);
//       break;
//     default:
//       drawForegroundStage0(game, game.stages[game.stageNr], ghostFactor);
//   }
//
//   game.fpsLabel.draw(game.gD);
//
//   if (game.paused) {
//     game.pauseModal.draw(game.gD);
//   }
//
//   if (game.finished) {
//     game.gD.context.filter = "drop-shadow(0px 0px 5px red)";
//     game.finishModal.draw(game.gD);
//   }
// }*/}