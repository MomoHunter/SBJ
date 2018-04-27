var gameRunning = false;

function game() {
  if (!gameRunning) {
    var game = {
      canvas: document.getElementById("gamearea"),
      init: function() {
        gameRunning = true;
        this.context = this.canvas.getContext("2d");
        this.interval = setInterval(updateGame, 20, this);
        this.spritesheet = new Image();
        this.spritesheet.src = "img/Spritesheet.png";
        this.spriteDict = {
          "Player" : [0, 0, 20, 20],
          "Item1" : [20, 0, 15, 19],
          "Item2" : [40, 0, 18, 19],
          "Item3" : [60, 0, 16, 16],
          "Item4" : [80, 0, 20, 13],
          "Pointer" : [0, 20, 10, 6],
          "Money1" : [20, 20, 30, 18],
          "Money2" : [50, 20, 30, 18],
          "Money3" : [80, 20, 30, 18],
          "Money4" : [110, 20, 30, 18]
        };
        this.points = 0;
        this.counter = 0;
        this.distance = 0;
        this.globalSpeed = -2;
        this.itemProb = [5, 1, 3, 0.3];
        this.itemDur = [200, 500, 750, 20];
        this.items = [];
        this.itemCounter = Math.max(Math.floor(Math.random() * 1500), 500);
        this.itemsActive = new Array(this.itemProb.length).fill(false);
        this.itemTimer = new Array(this.itemProb.length).fill(0);
        this.inventory = new Array(this.itemProb.length).fill(0);
        this.moneyProb = [5, 4, 1, 0.05];
        this.money = [];
        this.moneyCounter = Math.floor(Math.random() * 200);
        this.paused = false;
        this.finished = false;
        this.lava = new Image();
        this.lava.src = "img/lava.png";
        this.player = new player(20, this.canvas.height - 80, 20, 20, this.spritesheet);
        this.score = new text(game.canvas.width - 180, 20, "20px", "Consolas", "rgba(145, 165, 180, .6)");
        this.floor = [new floor(0, game.canvas.height - 50, game.canvas.width + 100, 5)];
        this.inventoryText = [];
        for(var i = 0; i < this.itemProb.length; i++) {
          this.inventoryText.push(new inventoryText((i * 50) + 20, 20, "20px", "Consolas", "rgba(145, 165, 180, .6)", i + 1, this.spritesheet));
        }

        window.addEventListener('keydown', function (e) {
          game.keys = (game.keys || []);
          game.keys[e.keyCode] = true;
          if (game.keys[27]) {
            toggleGame(game);
            toggleModal(game, ["Pause", "", ""]);
          }
        });
        window.addEventListener('keyup', function (e) {
          try {
            game.keys[e.keyCode] = false;
          } catch (err) {
            console.log(err.message);
          }
        });
        document.getElementById("toggleGame").innerText = "Pause";
        document.getElementById("toggleGame").style.display = "inline-block";
        document.getElementById("startGame").style.display = "none";
        document.getElementById("toggleGame").onclick = function() {toggleGame(game);toggleModal(game, ["Pause", "", ""]);};
      },
      clear: function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
      },
      pause: function() {
        clearInterval(this.interval);
        this.paused = true;
      },
      continue: function() {
        this.interval = setInterval(updateGame, 20, this);
        this.paused = false;
      },
      stop: function() {
        clearInterval(this.interval);
        this.finished = true;
        document.getElementById("toggleGame").style.display = "none";
        document.getElementById("startGame").innerText = "Neustart";
        document.getElementById("startGame").style.display = "inline-block";
        gameRunning = false;
      }
    };
    game.init();
  }
}

function player(x, y, width, height, img) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.img = img;
  this.speedX = 0;
  this.gravity = 0.5;
  this.gravitySpeed = 0;
  this.onFloor = false;
  this.aboveFloor = false;
  this.update = function(game) {
    game.context.drawImage(this.img, game.spriteDict["Player"][0], game.spriteDict["Player"][1], game.spriteDict["Player"][2], game.spriteDict["Player"][3], this.x, this.y, this.width, this.height);
  };
  this.newPos = function(game) {
    if (!this.onFloor) {
      this.gravitySpeed += this.gravity;
      this.y += this.gravitySpeed;
    }
    this.x += this.speedX;
    this.hitWalls(game);
    this.touchFloor(game);
  };
  this.hitWalls = function(game) {
    if (this.y + this.height > game.canvas.height - 20) {
      if (game.itemsActive[1]) {
        this.y = game.canvas.height - 20 - this.height;
        this.gravitySpeed = 0;
        this.onFloor = true;
        this.secondJump = 0;
      } else {
        game.stop();
      }
    } else if (this.y + this.height < 0) {
      game.context.drawImage(this.img, game.spriteDict["Pointer"][0], game.spriteDict["Pointer"][1], game.spriteDict["Pointer"][2], game.spriteDict["Pointer"][3], this.x + (this.width / 2) - (game.spriteDict["Pointer"][2] / 2), 0, game.spriteDict["Pointer"][2], game.spriteDict["Pointer"][3]);
    }
    if (this.x < 0) {
      this.x = 0;
    } else if (this.x + this.width > game.canvas.width) {
      this.x = game.canvas.width - this.width;
    }
  };
  this.touchFloor = function(game) {
    for (var i = 0; i < game.floor.length; i++) {
      if ((this.x > game.floor[i].x && this.x < game.floor[i].x + game.floor[i].width) ||
          (this.x + this.width > game.floor[i].x && this.x + this.width < game.floor[i].x + game.floor[i].width)) {
        if (this.y + this.height < game.floor[i].y - (game.floor[i].thickness / 2)) {
          this.aboveFloor = true;
        } else if (this.y + this.height > game.floor[i].y - (game.floor[i].thickness / 2) && this.aboveFloor && this.gravitySpeed > 0) {
          this.y = game.floor[i].y - (game.floor[i].thickness / 2) - this.height;
          this.gravitySpeed = 0;
          this.onFloor = true;
          this.aboveFloor = false;
          this.secondJump = 0;
        }
        break;
      }
      if (i + 1 == game.floor.length && !(this.y == game.canvas.height - 20 - this.height)) {
        this.aboveFloor = false;
        this.onFloor = false;
      }
    }
  };
  this.collect = function(object) {
    var crash = true;
    if ((this.y + this.height < object.y) ||
        (this.y > object.y + object.height) ||
        (this.x + this.width < object.x) ||
        (this.x > object.x + object.width)) {
      crash = false;
    }
    return crash;
  };
}

function floor(x, y, width, thickness) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.thickness = thickness;
  this.update = function(game) {
    game.context.beginPath();
    game.context.moveTo(this.x, this.y);
    game.context.lineTo(this.x + this.width, this.y);
    game.context.lineWidth = thickness;
    game.context.stroke();
  };
  this.newPos = function(game) {
    this.x += game.globalSpeed;
  };
}

function text(x, y, size, family, color) {
  this.x = x;
  this.y = y;
  this.size = size;
  this.family = family;
  this.update = function(game) {
    game.context.font = this.size + " " + this.family;
    game.context.fillStyle = color;
    game.context.fillText(this.text, this.x, this.y);
  };
}

function inventoryText(x, y, size, family, color, itemNr, img) {
  this.x = x;
  this.y = y;
  this.size = size;
  this.family = family;
  this.item = "Item" + itemNr;
  this.img = img;
  this.update = function(game) {
    game.context.font = this.size + " " + this.family;
    game.context.fillStyle = color;
    game.context.fillText(this.text, this.x + game.spriteDict[this.item][2] + 5, this.y);
    game.context.drawImage(this.img, game.spriteDict[this.item][0], game.spriteDict[this.item][1], game.spriteDict[this.item][2], game.spriteDict[this.item][3], this.x, this.y - game.spriteDict[this.item][3] + ((game.spriteDict[this.item][3] - 15) / 2), game.spriteDict[this.item][2], game.spriteDict[this.item][3]);
  };
}

function object(x, y, width, height, object, img, value) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.object = object;
  this.img = img;
  this.value = value;
  this.update = function(game) {
    game.context.drawImage(this.img, game.spriteDict[this.object][0], game.spriteDict[this.object][1], game.spriteDict[this.object][2], game.spriteDict[this.object][3], this.x, this.y, this.width, this.height);
  };
  this.newPos = function(game) {
    this.x += game.globalSpeed;
  };
}

function toggleGame(game) {
  if (!game.paused) {
    game.pause();
    document.getElementById("toggleGame").innerText = "Fortsetzen";
  } else {
    game.continue();
    document.getElementById("toggleGame").innerText = "Pause";
  }
}

function toggleModal(game, text) {
  game.context.fillStyle = "rgba(44, 47, 51, .6)";
  game.context.fillRect(0, 0, game.canvas.width, game.canvas.height);
  game.context.font = "40px Consolas";
  game.context.fillStyle = "rgba(145, 165, 180, 1)";
  game.context.fillText(text[0], (game.canvas.width / 2) - ((text[0].length * 22) / 2), (game.canvas.height / 2) - 5);
  game.context.font = "20px Consolas";
  game.context.fillText(text[1], (game.canvas.width / 2) - ((text[1].length * 11) / 2), (game.canvas.height / 2) + 25);
  game.context.fillText(text[2], (game.canvas.width / 2) - ((text[2].length * 11) / 2), (game.canvas.height / 2) + 50);
}

function addFloor(game) {
  var y = (Math.random() * (game.canvas.height - 140)) + 90;
  if (Math.abs(game.floor[game.floor.length - 1].y - y) > 140) {
    if (game.floor[game.floor.length - 1].y < y) {
      y = game.floor[game.floor.length - 1].y + 140;
    } else {
      y = game.floor[game.floor.length - 1].y - 140;
    }
  }
  game.floor.push(new floor(game.canvas.width + 50 + (Math.random() * 150), y, Math.max(Math.min(Math.random() * (400 / (game.counter * 0.005)), 400), 50), 5));
}

function addMoney(game) {
  var sum = game.moneyProb.reduce(function(a, b){return a + b;}, 0);
  var random = Math.random();
  var limit = 0;
  for(var i = 0; i < game.moneyProb.length; i++) {
    limit += game.moneyProb[i];
    if (random * sum <= limit) {
      if (60 + (random * (game.canvas.height - 110)) <= game.floor[game.floor.length - 1].y + 4 && 60 + (random * (game.canvas.height - 110)) + 17 >= game.floor[game.floor.length - 1].y - 4) {
        random -= (game.spriteDict["Money" + (i + 1)][3] + 5) / (game.canvas.height - 110);
      }
      game.money.push(new object(game.canvas.width + 20, 60 + (random * (game.canvas.height - 110)), game.spriteDict["Money" + (i + 1)][2], game.spriteDict["Money" + (i + 1)][3], "Money" + (i + 1), game.spritesheet, Math.pow(10, i)));
      break;
    }
  }
  game.moneyCounter = Math.max(Math.floor(Math.random() * (300 - (game.counter * 0.1))), 15);
}

function addItem(game) {
  var sum = game.itemProb.reduce(function(a, b){return a + b;}, 0);
  var random = Math.random();
  var limit = 0;
  for(var i = 0; i < game.itemProb.length; i++) {
    limit += game.itemProb[i];
    if (random * sum <= limit) {
      random = Math.random();
      if (50 + (random * (game.canvas.height - 140)) <= game.floor[game.floor.length - 1].y + 4 && 50 + (random * (game.canvas.height - 140)) + game.spriteDict["Item" + (i + 1)][3] >= game.floor[game.floor.length - 1].y - 4) {
        random -= (game.spriteDict["Item" + (i + 1)][3] + 5) / (game.canvas.height - 140);
      }
      game.items.push(new object(game.canvas.width + 20, 50 + (random * (game.canvas.height - 140)), game.spriteDict["Item" + (i + 1)][2], game.spriteDict["Item" + (i + 1)][3], "Item" + (i + 1), game.spritesheet, i));
      break;
    }
  }
  game.itemCounter = Math.max(Math.floor(Math.random() * (3000 - (game.counter * 0.2))), 1000);
}

function updateGame(game) {
  game.clear();

  game.counter += 0.1;
  game.moneyCounter -= 1;
  game.itemCounter -= 1;
  game.distance += 2 + (game.counter * 0.005);

  game.globalSpeed = -2 + (game.counter * -0.005);
  game.player.speedX = 0;
  game.player.gravity = 0.5;

  if (game.itemsActive[0]) {
    game.moneyCounter += 1 - 0.05;
    game.itemCounter += 1 - 0.05;
    game.distance -= 2 + (game.counter * 0.005) - 0.1;
    game.globalSpeed = -0.1;
  }

  if (game.itemsActive[2]) {
    game.player.gravity = 0.1;
  }

  if (game.itemsActive[3]) {
    game.moneyCounter = 0;
  }

  if (game.keys) {
    for(var i = 0; i < game.itemProb.length; i++) {
      if (game.keys[i + 49] && game.inventory[i] > 0 && !game.itemsActive[i]) {
        game.itemsActive[i] = true;
        game.itemTimer[i] = game.itemDur[i];
        game.inventory[i]--;
      }
    }
    if (game.keys[37] || game.keys[65]) {
      game.player.speedX = -3;
    }
    if (game.keys[39] || game.keys[68]) {
      game.player.speedX = 3;
    }
    if ((game.keys[40] || game.keys[83]) && game.player.onFloor) {
      game.player.onFloor = false;
      game.player.secondJump = 0;
    }
    if (game.keys[32] && game.player.onFloor) {
      game.player.gravitySpeed = -9;
      game.player.onFloor = false;
      game.player.secondJump = 0;
    }
    if (!game.keys[32] && !game.player.onFloor && game.player.secondJump == 0) {
      game.player.secondJump = 1;
    } else if (game.keys[32] && game.player.secondJump == 1) {
      game.player.gravitySpeed = -9;
      game.player.secondJump = 2;
    }
  }

  if (game.floor[game.floor.length - 1].x + game.floor[game.floor.length - 1].width < game.canvas.width) {
    addFloor(game);
  }

  if (game.floor[0].x + game.floor[0].width < 0) {
    game.floor.shift();
  }

  if (game.moneyCounter <= 0) {
    addMoney(game);
  }

  if (game.money[0] != undefined && game.money[0].x + game.money[0].width < 0) {
    game.money.shift();
  }

  if (game.itemCounter <= 0) {
    addItem(game);
  }

  if (game.items[0] != undefined && game.items[0].x + game.items[0].width < 0) {
    game.items.shift();
  }

  game.player.newPos(game);
  game.player.update(game);

  for (var i = 0; i < game.floor.length; i++) {
    game.floor[i].newPos(game);
    game.floor[i].update(game);
  }

  for (var i = 0; i < game.money.length; i++) {
    game.money[i].newPos(game);
    if (game.player.collect(game.money[i])) {
      game.points += game.money[i].value;
      game.money.splice(i, 1);
      i--;
    } else {
      game.money[i].update(game);
    }
  }

  for (var i = 0; i < game.items.length; i++) {
    game.items[i].newPos(game);
    if (game.player.collect(game.items[i])) {
      game.inventory[game.items[i].value]++;
      game.items.splice(i, 1);
      i--;
    } else {
      game.items[i].update(game);
    }
  }

  game.score.text = "Punkte: " + Math.floor(game.points);
  game.score.update(game);
  
  for (var i = 0; i < game.inventoryText.length; i++) {
    game.inventoryText[i].text = game.inventory[i];
    game.inventoryText[i].update(game);
  }

  for (var i = game.itemTimer.length - 1; i >= 0; i--) {
    if (game.itemTimer[i] > 0) {
      game.itemTimer[i]--;
      game.context.fillStyle = "rgba(0, 255, 0, 1)";
      game.context.fillRect((i * 50) + 20, 25, game.itemTimer[i] * (45 / game.itemDur[i]), 5);
      if (game.itemTimer[i] == 0) {
        game.itemsActive[i] = false;
        switch (i) {
          case 1:
            if (game.player.y == game.canvas.height - 20 - game.player.height) {
              game.player.onFloor = false;
            }
            break;
          default:
            break;
        }
      }
    }
  }

  for (var i = 0; i < game.canvas.width / 100; i++) {
    game.context.drawImage(game.lava,
      100 * Math.floor((game.counter + (Math.floor(i * 1.7) * 10)) % 40 / 10),
      40 * Math.floor(game.counter % 10),
      100, 20, i * 100, game.canvas.height - 20, 100, 20);
  }

  if (game.finished) {
    game.context.filter = "drop-shadow(0px 0px 5px red)";
    toggleModal(game, ["YOU DIED", "Punkte: " + Math.floor(game.points), "Distanz: " + Math.floor(game.distance / 15) + "m"]);
    game.context.filter = "none";
  }
}