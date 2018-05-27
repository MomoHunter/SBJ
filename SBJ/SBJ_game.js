function Game(gD, menu) {
  this.gD = gD;
  this.menu = menu;
  this.lava = new Image();
  this.lava.src = "img/gameLava.png";
  this.wall = new Image();
  this.wall.src = "img/gameWall.png";
  this.inventoryTexts = [];
  this.paused = false;
  this.visible = false;
  this.init = function() {
    this.player = new GamePlayer(20, this.gD.canvas.height - 90);
    this.floor = [new GameFloor(0, this.gD.canvas.height - 50.5, this.gD.canvas.width + 100, 5)];
    for (var i = 0; i < this.gD.itemProb.length; i++) {
      this.inventoryTexts.push(new GameInventoryText(5 + (i * 60), 0, 60, 30, "14pt", "Consolas", "rgba(255, 255, 255, 1)", i + 1));
    }
    this.cashLabel = new Text(this.gD.canvas.width - 5, 22, "14pt", "Consolas", "rgba(255, 255, 255, 1)", "end", "alphabetic", "Cash: 0", 0);

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
    this.fireballObjects = [];

    this.moneySpawnCounter = Math.floor(Math.random() * 200);
    this.itemSpawnCounter = Math.max(Math.floor(Math.random() * 1500), 500);
    this.fireballSpawnCounter = Math.max(Math.floor(Math.random() * 600), 300);

    this.pauseModal = new GameModal(0, 0, this.gD.canvas.width, this.gD.canvas.height, "rgba(44, 47, 51, .6)");
    this.pauseModal.texts.push(new Text(this.gD.canvas.width / 2, this.gD.canvas.height / 2, "40pt", "Consolas", "rgba(200, 200, 200, 1)", "center", "middle", "Pause", 0));

    this.finishModal = new GameModal(0, 0, this.gD.canvas.width, this.gD.canvas.height, "rgba(44, 47, 51, .6)");
    this.finishModal.texts.push(new Text(this.gD.canvas.width / 2, this.gD.canvas.height / 2 - 60, "30pt", "Consolas", "rgba(200, 200, 200, 1)", "center", "middle", "YOU DIED", 0));
    this.finishModal.texts.push(new Text(this.gD.canvas.width / 2, this.gD.canvas.height / 2 - 30, "15pt", "Consolas", "rgba(200, 200, 200, 1)", "center", "middle", "", 0));
    this.finishModal.texts.push(new Text(this.gD.canvas.width / 2, this.gD.canvas.height / 2 - 10, "15pt", "Consolas", "rgba(200, 200, 200, 1)", "center", "middle", "", 0));
    this.finishModal.buttons.push(new Button((this.gD.canvas.width / 2) - 100, this.gD.canvas.height / 2 + 15, 200, 30, "15pt", "Showcard Gothic", "rgba(255, 255, 255, 1)", "Play Again", "rgba(0, 0, 0, .6)", 2));
    this.finishModal.buttons.push(new Button((this.gD.canvas.width / 2) - 100, this.gD.canvas.height / 2 + 50, 200, 30, "15pt", "Showcard Gothic", "rgba(255, 255, 255, 1)", "Main Menu", "rgba(0, 0, 0, .6)", 2));
    this.finishModal.init();

    this.finished = false;
  };
  this.clear = function() {
    this.gD.context.clearRect(0, 0, this.gD.canvas.width, this.gD.canvas.height);
  };
  this.pause = function() {
    this.paused = true;
  };
  this.continue = function() {
    this.paused = false;
    var game = this;
    requestAnimationFrame(function(){ updateGame(game); });
  };
  this.finish = function() {
    this.finished = true;
    this.menu.shop.cash += this.cash;
    if (!this.menu.achievements.achievementList.achievements[26].finished) {
      this.menu.achievements.achievementValues[26]++;
      this.menu.achievements.achievementList.achievements[26].check(this.menu.achievements);
    }
    if (!this.menu.achievements.achievementList.achievements[27].finished) {
      this.menu.achievements.achievementValues[27] += this.cash;
      this.menu.achievements.achievementList.achievements[27].check(this.menu.achievements);
    }
    if (!this.menu.achievements.achievementList.achievements[28].finished && this.menu.achievements.achievementValues[28] < this.menu.shop.cash) {
      this.menu.achievements.achievementValues[28] = this.menu.shop.cash;
      this.menu.achievements.achievementList.achievements[28].check(this.menu.achievements);
    }
    if (!this.menu.achievements.achievementList.achievements[29].finished) {
      this.menu.achievements.achievementValues[29] += Math.floor(this.distanceTravelled / 15);
      this.menu.achievements.achievementList.achievements[29].check(this.menu.achievements);
    }
    this.menu.highscores.newHighscore([new Date().toString().substr(0, 24), Math.floor(this.distanceTravelled / 15) + "m", this.cash.toString()]);
    this.gD.save.cash = this.menu.shop.cash;
    this.gD.save.highscores = this.menu.highscores.highscores;
  };
  this.show = function() {
    this.visible = true;
    var game = this;
    requestAnimationFrame(function(){ updateGame(game); });
  };
  this.stop = function() {
    this.visible = false;
    this.init();
  };
}

function GamePlayer(x, y) {
  this.x = x;
  this.y = y;
  this.width = 0;
  this.height = 0;
  this.speedX = 0;
  this.gravity = 0.5;
  this.velocity = 0;
  this.secondJump = 0;                                //second jump status save
  this.onFloor = false;
  this.aboveFloor = false;                            //if the player is above a floor
  this.outsideCanvas = false;                         //shows, if the player is fully outside the canvas, is for an achievement
  this.distanceBackwards = 0;                         //saves the distance travelled backwards for an achievement
  this.playerNr = 1;
  this.setPlayer = function(playerNr, game, gD) {               //sets the Player model
    this.playerNr = playerNr;
    this.width = gD.spriteDict["Player" + this.playerNr][2];
    this.height = gD.spriteDict["Player" + this.playerNr][3];
    if (playerNr == 7) {
      game.inventory.fill(10);
    }
  };
  this.update = function(gD) {
    gD.context.drawImage(gD.spritesheet, gD.spriteDict["Player" + this.playerNr][0], gD.spriteDict["Player" + this.playerNr][1], gD.spriteDict["Player" + this.playerNr][2], gD.spriteDict["Player" + this.playerNr][3],
      this.x, this.y, this.width, this.height);
  };
  this.newPos = function(game, gD) {
    if (!this.onFloor) {
      this.velocity += this.gravity;
      this.y += this.velocity;
    }
    this.x += this.speedX;
    this.hitWalls(game, gD);
    this.touchFloor(game, gD);
  };
  this.hitWalls = function(game, gD) {                //checks, if the player touches a canvas wall, or the lava at gD.canvas.height - 20
    if (this.y + this.height > gD.canvas.height - 20) {
      if (game.itemsActive[1]) {
        this.y = gD.canvas.height - 20 - this.height;
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
  this.touchFloor = function(game, gD) {              //checks, if the player touches a floor and sets it on it and if the player is not anymore on it, it sets onFloor to false
    for (var i = 0; i < game.floor.length; i++) {
      if ((this.x > game.floor[i].x && this.x < game.floor[i].x + game.floor[i].width) ||
          (this.x + this.width > game.floor[i].x && this.x + this.width < game.floor[i].x + game.floor[i].width)) {
        if (this.y + this.height < game.floor[i].y - (game.floor[i].thickness / 2)) {
          this.aboveFloor = true;
        } else if (this.y + this.height > game.floor[i].y - (game.floor[i].thickness / 2) && this.aboveFloor && this.velocity > 0) {
          this.y = game.floor[i].y - (game.floor[i].thickness / 2) - this.height;
          this.velocity = 0;
          this.onFloor = true;
          this.aboveFloor = false;
          this.secondJump = 1;
        }
        break;
      }
      if (i + 1 == game.floor.length && !(this.y == gD.canvas.height - 20 - this.height)) {
        this.aboveFloor = false;
        this.onFloor = false;
      }
    }
  };
  this.collect = function(object) {                   //checks if an object is touched by the player
    var collected = true;
    if ((this.y + this.height < object.y) ||
        (this.y > object.y + object.height) ||
        (this.x + this.width < object.x) ||
        (this.x > object.x + object.width)) {
      collected = false;
    }
    return collected;
  };
}

function GameFloor(x, y, width, thickness) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.thickness = thickness;
  this.update = function(gD) {
    gD.context.beginPath();
    gD.context.moveTo(this.x, this.y);
    gD.context.lineTo(this.x + this.width, this.y);
    gD.context.strokeStyle = "rgba(155, 155, 155, 1)";
    gD.context.lineWidth = thickness;
    gD.context.stroke();
  };
  this.newPos = function(game) {
    this.x += game.globalSpeed;
  };
}

function GameInventoryText(x, y, width, height, size, family, textcolor, itemNr) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.size = size;
  this.family = family;
  this.textcolor = textcolor;
  this.itemNr = itemNr;
  this.update = function(game, gD) {
    gD.context.drawImage(gD.spritesheet, gD.spriteDict["Item" + this.itemNr][0], gD.spriteDict["Item" + this.itemNr][1], gD.spriteDict["Item" + this.itemNr][2], gD.spriteDict["Item" + this.itemNr][3],
      this.x + 2, this.y + Math.floor((this.height - gD.spriteDict["Item" + this.itemNr][3]) / 2), gD.spriteDict["Item" + this.itemNr][2], gD.spriteDict["Item" + this.itemNr][3]);
    gD.context.textAlign = "start";
    gD.context.textBaseline = "middle";
    gD.context.font = this.size + " " + this.family;
    gD.context.fillStyle = this.textcolor;
    gD.context.fillText(game.inventory[this.itemNr - 1].toString(), this.x + 7 + gD.spriteDict["Item" + this.itemNr][2], this.y + (this.height / 2));
  };
}

function GameObject(x, y, width, height, name, value) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.name = name;
  this.value = value;
  this.update = function(gD) {
    gD.context.drawImage(gD.spritesheet, gD.spriteDict[this.name][0], gD.spriteDict[this.name][1], gD.spriteDict[this.name][2], gD.spriteDict[this.name][3],
      this.x, this.y, gD.spriteDict[this.name][2], gD.spriteDict[this.name][3]);
  };
  this.newPos = function(game) {
    this.x += game.globalSpeed;

    if (game.itemsActive[4]) {
      var distX = (game.player.x + (game.player.width / 2)) - (this.x + (this.width / 2));
      var distY = (game.player.y + (game.player.height / 2)) - (this.y + (this.height / 2));
      var distanceToPlayer = Math.sqrt(Math.pow(distX, 2) + Math.pow(distY, 2))
      if (distanceToPlayer < 80) {
        this.x += distX / (distanceToPlayer / 10);
        this.y += distY / (distanceToPlayer / 10);
      }
    }
  };
}

function GameFireball(x, y, width, height) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.gravity = 0.4;
  this.velocity = 0;
  this.jumpCounter = 0;
  this.outsideCanvas = false;
  this.update = function(gD) {
    gD.context.drawImage(gD.spritesheet, gD.spriteDict["Fireball"][0], gD.spriteDict["Fireball"][1], gD.spriteDict["Fireball"][2], gD.spriteDict["Fireball"][3],
      this.x, this.y, gD.spriteDict["Fireball"][2], gD.spriteDict["Fireball"][3]);
  };
  this.newPos = function(game, gD) {
    if (this.y > gD.canvas.height && !this.outsideCanvas) {
      this.y = gD.canvas.height;
      this.outsideCanvas = true;
      this.jumpCounter = 70;
    } else if (this.outsideCanvas) {
      this.jumpCounter--;
      if (this.jumpCounter == 0) {
        this.outsideCanvas = false;
        this.velocity = -13;
        this.velocity += this.gravity;
        this.y += this.velocity;
      }
    } else {
      this.velocity += this.gravity;
      this.y += this.velocity;
    }

    this.x += game.globalSpeed;
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
  this.update = function(gD) {
    gD.context.fillStyle = this.color;
    gD.context.fillRect(this.x, this.y, this.width, this.height);
    for (var i = 0; i < this.texts.length; i++) {
      this.texts[i].update(gD);
    }
    gD.context.filter = "none";
    for (var i = 0; i < this.buttons.length; i++) {
      this.buttons[i].update(gD);
    }
  };
}

function addFloor(game, gD) {
  var y = (Math.random() * (gD.canvas.height - 140)) + 90;
  if (Math.abs(game.floor[game.floor.length - 1].y - y) > 140) {
    if (game.floor[game.floor.length - 1].y < y) {
      y = game.floor[game.floor.length - 1].y + 140;
    } else {
      y = game.floor[game.floor.length - 1].y - 140;
    }
  }
  game.floor.push(new GameFloor(gD.canvas.width + 50 + (Math.random() * 150), Math.floor(y) + 0.5, Math.max(Math.min(Math.random() * (400 / (game.frameCounter * 0.0005)), 400), 50), 5));
}

function addFireball(game, gD) {
  game.fireballObjects.push(new GameFireball(gD.canvas.width + Math.floor(Math.random() * 150), Math.floor(Math.random() * 200), gD.spriteDict["Fireball"][2], gD.spriteDict["Fireball"][3]));
  game.fireballSpawnCounter = Math.max(Math.random() * (1000 - (game.frameCounter * 0.01)), 370);
}

function addMoney(game, gD) {
  var sum = gD.moneyProb.reduce(function(a, b){return a + b;}, 0);
  var random = Math.random();
  var limit = 0;
  for(var i = 0; i < gD.moneyProb.length; i++) {
    limit += gD.moneyProb[i];
    if (random * sum <= limit) {
      if (60 + (random * (gD.canvas.height - 110)) <= game.floor[game.floor.length - 1].y + 4 && 60 + (random * (gD.canvas.height - 110)) + 17 >= game.floor[game.floor.length - 1].y - 4) {
        random -= (gD.spriteDict["Money" + (i + 1)][3] + 5) / (gD.canvas.height - 110);
      }
      game.moneyObjects.push(new GameObject(gD.canvas.width + 20, 60 + (random * (gD.canvas.height - 110)), gD.spriteDict["Money" + (i + 1)][2], gD.spriteDict["Money" + (i + 1)][3], "Money" + (i + 1), Math.pow(10, i)));
      break;
    }
  }
  game.moneySpawnCounter = Math.max(Math.floor(Math.random() * (300 - (game.frameCounter * 0.01))), 15);
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
      game.itemObjects.push(new GameObject(gD.canvas.width + 20, 50 + (random * (gD.canvas.height - 140)), gD.spriteDict["Item" + (i + 1)][2], gD.spriteDict["Item" + (i + 1)][3], "Item" + (i + 1), i));
      break;
    }
  }
  game.itemSpawnCounter = Math.max(Math.floor(Math.random() * (3000 - (game.frameCounter * 0.02))), 1000);
}

function gameControlDown(game, key) {
  if (!game.finished) {
    for(var i = 0; i < game.gD.itemProb.length; i++) {
      if (game.menu.controls.keyBindings["Game" + (i + 6)][2].includes(key) && game.inventory[i] > 0 && !game.itemsActive[i]) {
        game.itemsActive[i] = true;
        game.itemTimer[i] = game.gD.itemBaseDur[i] + (game.menu.shop.level[i] * game.gD.itemPerLvlDur[i]);
        game.inventory[i]--;
        game.itemsUsed[i]++;
        if (!game.menu.achievements.achievementList.achievements[22].finished && i == 1 && game.player.y > game.gD.canvas.height - 30 - game.player.height) {
          game.menu.achievements.achievementValues[22]++;
          game.menu.achievements.achievementList.achievements[22].check(game.menu.achievements);
        }
        break;
      }
    }
    var temp = game.itemsUsed.reduce(function(a, b){b > 0 ? a++ : a; return a;}, 0);
    if (!game.menu.achievements.achievementList.achievements[4].finished && game.menu.achievements.achievementValues[4] < temp) {
      game.menu.achievements.achievementValues[4] = temp;
      game.menu.achievements.achievementList.achievements[4].check(game.menu.achievements);
    }
    for(var i = 5; i < 10; i++) {
      if (!game.menu.achievements.achievementList.achievements[i].finished && game.menu.achievements.achievementValues[i] < game.itemsUsed[i - 5]) {
        game.menu.achievements.achievementValues[i] = game.itemsUsed[i - 5];
        game.menu.achievements.achievementList.achievements[i].check(game.menu.achievements);
      }
    }
    var temp = game.itemsActive.reduce(function(a, b){b ? a++ : a; return a;}, 0);
    if (!game.menu.achievements.achievementList.achievements[10].finished && game.menu.achievements.achievementValues[10] < temp) {
      game.menu.achievements.achievementValues[10] = temp;
      game.menu.achievements.achievementList.achievements[10].check(game.menu.achievements);
    }
    if (game.menu.controls.keyBindings["Game1"][2].includes(key)) {                                  //pause game
      if (!game.paused) {
        game.pause();
      } else {
        game.continue();
      }
      game.pauseModal.update(game.gD);
    } else if (game.menu.controls.keyBindings["Game2"][2].includes(key)) {              //move forward
      if (game.player.playerNr == 3) {
        game.player.speedX = 6;
      } else if ([5, 7].includes(game.player.playerNr)) {
        game.player.speedX = 4.5;
      } else {
        game.player.speedX = 3;
      }
    } else if (game.menu.controls.keyBindings["Game3"][2].includes(key)) {              //move backwards
      if (game.player.playerNr == 3) {
        game.player.speedX = -6;
      } else if ([5, 7].includes(game.player.playerNr)) {
        game.player.speedX = -4.5;
      } else {
        game.player.speedX = -3;
      }
    } else if (game.menu.controls.keyBindings["Game4"][2].includes(key) && game.player.onFloor) {       //down from platform
      game.player.onFloor = false;
      game.player.secondJump = 1;
    } else if (game.menu.controls.keyBindings["Game5"][2].includes(key) && game.player.onFloor) {      //jump
      if (game.player.playerNr == 2) {
        game.player.velocity = -13.5;
      } else if ([5, 6, 7].includes(game.player.playerNr)) {
        game.player.velocity = -10.8;
      } else {
        game.player.velocity = -9;
      }
      game.player.onFloor = false;
      game.player.secondJump = 0;
      if (!game.menu.achievements.achievementList.achievements[21].finished) {
        game.menu.achievements.achievementValues[21]++;
        game.menu.achievements.achievementList.achievements[21].check(game.menu.achievements);
      }
    } else if (game.menu.controls.keyBindings["Game5"][2].includes(key) && game.player.secondJump == 1) {          //jump
      if (game.player.playerNr == 2) {
        game.player.velocity = -13.5;
      } else if ([5, 6, 7].includes(game.player.playerNr)) {
        game.player.velocity = -10.8;
      } else {
        game.player.velocity = -9;
      }
      game.player.secondJump = 2;
      if (!game.menu.achievements.achievementList.achievements[2].finished) {
        game.menu.achievements.achievementValues[2]++;
        game.menu.achievements.achievementList.achievements[2].check(game.menu.achievements);
      }
      if (!game.menu.achievements.achievementList.achievements[21].finished) {
        game.menu.achievements.achievementValues[21]++;
        game.menu.achievements.achievementList.achievements[21].check(game.menu.achievements);
      }
    } else if (game.menu.controls.keyBindings["Game5"][2].includes(key) && game.player.secondJump == 3) {          //jump
      if ([6, 7].includes(game.player.playerNr)) {
        game.player.velocity = -10.8;
      } else {
        game.player.velocity = -9;
      }
      game.player.secondJump = 4;
    }
  } else {
    if (game.menu.controls.keyBindings["FinishModal3"][2].includes(key)) {
      switch (game.finishModal.selected) {
        case 0:
          var playerNr = game.player.playerNr;
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
      drawGame(game);
    }
  }
}

function gameControlUp(game, key) {
  if (game.menu.controls.keyBindings["Game3"][2].includes(key) && !(game.gD.keys[game.menu.controls.keyBindings["Game2"][2][0]] || game.gD.keys[game.menu.controls.keyBindings["Game2"][2][1]])) {              //move backwards released
    game.player.speedX = 0;
    if (!game.menu.achievements.achievementList.achievements[20].finished && game.player.distanceBackwards != 0) {
      game.menu.achievements.achievementValues[20] += Math.floor(game.player.distanceBackwards / 15);
      game.menu.achievements.achievementList.achievements[20].check(game.menu.achievements);
    }
    game.player.distanceBackwards = 0;
  } else if (game.menu.controls.keyBindings["Game2"][2].includes(key) && !(game.gD.keys[game.menu.controls.keyBindings["Game3"][2][0]] || game.gD.keys[game.menu.controls.keyBindings["Game3"][2][1]])) {       //move forward released
    game.player.speedX = 0;
  } else if (game.menu.controls.keyBindings["Game5"][2].includes(key) && game.player.secondJump == 0) {                                  //jump released
    game.player.secondJump = 1;
  } else if (game.menu.controls.keyBindings["Game5"][2].includes(key) && [4, 6, 7].includes(game.player.playerNr) && game.player.secondJump == 2) {     //jump released
    game.player.secondJump = 3;
  }
}

function updateGame(game) {
  if (!game.finished && !game.paused) {
    requestAnimationFrame(function(){ updateGame(game); });
  }

  game.frameCounter += 1;

  if (game.itemsActive[0]) {
    game.moneySpawnCounter -= 0.05;
    game.itemSpawnCounter -= 0.05;
    game.fireballSpawnCounter -= 0.05;
    game.globalSpeed = -0.1;
    game.distanceTravelled += -game.globalSpeed;
  } else {
    game.moneySpawnCounter -= 1;
    game.itemSpawnCounter -= 1;
    game.fireballSpawnCounter -= 1;
    game.globalBaseSpeed -= 0.0005;
    game.globalSpeed = Math.ceil(game.globalBaseSpeed);
    game.distanceTravelled += -game.globalSpeed;
  }

  if (game.itemsActive[2]) {
    game.player.gravity = 0.1;
  } else {
    game.player.gravity = 0.5;
  }

  if (game.itemsActive[3]) {
    game.moneySpawnCounter = 0;
  }

  for (var i = 17; i < 20; i++) {
    if (!game.menu.achievements.achievementList.achievements[i].finished && game.menu.achievements.achievementValues[i] < Math.floor(game.distanceTravelled / 15)) {
      game.menu.achievements.achievementValues[i] = Math.floor(game.distanceTravelled / 15);
      game.menu.achievements.achievementList.achievements[i].check(game.menu.achievements);
      if (i == 18 && game.menu.achievements.achievementList.achievements[i].finished) {
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

  if (game.fireballSpawnCounter <= 0) {
    addFireball(game, game.gD);
  }
  if (game.fireballObjects[0] != undefined && game.fireballObjects[0].x + game.fireballObjects[0].width < 0) {
    game.fireballObjects.shift();
  }

  if (game.player.speedX < 0) {
    game.player.distanceBackwards += Math.abs(game.player.speedX);
  }

  game.player.newPos(game, game.gD);

  for (var i = 0; i < game.floor.length; i++) {
    game.floor[i].newPos(game);
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

  for (var i = 13; i < 17; i++) {
    if (!game.menu.achievements.achievementList.achievements[i].finished && game.menu.achievements.achievementValues[i] < game.cash) {
      game.menu.achievements.achievementValues[i] = game.cash;
      game.menu.achievements.achievementList.achievements[i].check(game.menu.achievements);
      if (i == 15 && game.menu.achievements.achievementList.achievements[i].finished) {
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

  for (var i = 0; i < game.fireballObjects.length; i++) {
    game.fireballObjects[i].newPos(game, game.gD);
    if (game.player.collect(game.fireballObjects[i]) && !game.itemsActive[1]) {
      game.finish();
    }
  }

  if (game.goldenShamrock) {
    game.goldenShamrock.newPos(game);
    if (game.player.collect(game.goldenShamrock)) {
      game.goldenShamrock = false;
      for(var i = 30; i < 34; i++) {
        if (!game.menu.achievements.achievementList.achievements[i].finished) {
          game.menu.achievements.achievementValues[i]++;
          game.menu.achievements.achievementList.achievements[i].check(game.menu.achievements);
          if (i == 33 && game.menu.achievements.achievementList.achievements[i].finished) {
            game.menu.shop.cash += 1000000;
            game.gD.save.cash = game.menu.shop.cash;
          }
        }
      }
    }
  }

  game.cashLabel.text = "Cash: " + Math.floor(game.cash);

  for (var i = game.itemTimer.length - 1; i >= 0; i--) {
    if (game.itemTimer[i] > 0) {
      game.itemTimer[i]--;
      if (game.itemTimer[i] == 0) {
        game.itemsActive[i] = false;
        switch (i) {
          case 0:
            if (!game.menu.achievements.achievementList.achievements[11].finished) {
              game.menu.achievements.achievementValues[11] += (game.gD.itemBaseDur[i] + (game.menu.shop.level[i] * game.gD.itemPerLvlDur[i])) / 50;
              game.menu.achievements.achievementList.achievements[11].check(game.menu.achievements);
            }
            break;
          case 1:
            if (game.player.y == game.gD.canvas.height - 20 - game.player.height) {
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
  }

  drawGame(game);
}

function drawGame(game) {
  game.clear();

  for (var i = 0; i < (game.gD.canvas.width + 40) / game.wall.width; i++) {
    for (var j = 0; j < game.gD.canvas.height / game.wall.height; j++) {
      game.gD.context.drawImage(game.wall, (i * game.wall.width) - (game.distanceTravelled % 40), (j * game.wall.height));
    }
  }

  game.gD.context.fillStyle = "rgba(0, 0, 0, 1)";
  game.gD.context.fillRect(0, game.gD.canvas.height - 20, game.gD.canvas.width, 20);

  if (game.player.y + game.player.height < 0) {
    game.gD.context.drawImage(game.gD.spritesheet, game.gD.spriteDict["Pointer"][0], game.gD.spriteDict["Pointer"][1], game.gD.spriteDict["Pointer"][2], game.gD.spriteDict["Pointer"][3],
      game.player.x + ((game.player.width - game.gD.spriteDict["Pointer"][2]) / 2), 0, game.gD.spriteDict["Pointer"][2], game.gD.spriteDict["Pointer"][3]);
    if (!game.menu.achievements.achievementList.achievements[12].finished && !game.player.outsideCanvas) {
      game.menu.achievements.achievementValues[12]++;
      game.menu.achievements.achievementList.achievements[12].check(game.menu.achievements);
      game.player.outsideCanvas = true;
    }
  } else {
    game.player.outsideCanvas = false;
  }

  game.player.update(game.gD);

  for (var i = 0; i < game.floor.length; i++) {
    game.floor[i].update(game.gD);
  }

  for (var i = 0; i < game.moneyObjects.length; i++) {
    game.moneyObjects[i].update(game.gD);
  }

  for (var i = 0; i < game.itemObjects.length; i++) {
    game.itemObjects[i].update(game.gD);
  }

  for (var i = 0; i < game.fireballObjects.length; i++) {
    game.fireballObjects[i].update(game.gD);
  }

  for (var i = 0; i < game.inventoryTexts.length; i++) {
    game.inventoryTexts[i].update(game, game.gD);
  }

  for (var i = 0; i < game.itemTimer.length; i++) {
    if (game.itemTimer[i] > 0) {
      game.gD.context.fillStyle = "rgba(0, 255, 0, 1)";
      game.gD.context.fillRect(10 + (i * 60), 30, game.itemTimer[i] * (50 / (game.gD.itemBaseDur[i] + (game.menu.shop.level[i] * game.gD.itemPerLvlDur[i]))), 5);  //50 is the maxWidth
    }
  }

  if (game.goldenShamrock) {
    game.goldenShamrock.update(game.gD);
  }

  game.cashLabel.update(game.gD);

  for (var i = 0; i < game.gD.canvas.width / 100; i++) {
    game.gD.context.drawImage(game.lava, 100 * Math.floor(((game.frameCounter / 10) + (Math.floor(i * 1.7) * 10)) % 40 / 10),
      40 * Math.floor((game.frameCounter / 10) % 10), 100, 20, i * 100, game.gD.canvas.height - 20, 100, 20);
  }

  if (game.finished) {
    game.gD.context.filter = "drop-shadow(0px 0px 5px red)";
    game.finishModal.update(game.gD);
  }
}