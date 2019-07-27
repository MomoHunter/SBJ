function Stage3(game, gD) {
  this.game = game;
  this.gD = gD;
  this.name = "Water";
  this.deadZoneGround = 0;
  this.floorColorKey = "stage3Floor";
  this.difficulty = 60;
  this.gravity = 20.25;
  this.init = function() {
    this.birds = [];
    this.birdStartIndex = 0;
    this.bubbles = [];
    this.bubbleStartIndex = 0;
    this.fishes = [];
    this.fishStartIndex = 0;
    this.smallFishes = [];
    this.smallFishStartIndex = 0;
    this.ocean = new AnimatedBackground(0, 1000, 2800, "img/Water_Ocean.png", 8, 20);
    this.waves = new AnimatedBackground(170, 1000, 1440, "img/Water_Waves.png", 8, 20);
  };
  this.addBird = function() {
    let random = Math.random();
    if (random < 0.15) {
      if (random < 0.075) {
        let {spriteWidth, spriteHeight, key} = getSpriteData("Enemy_Bird_Left", this.gD);
        this.birds.push(new Stage3Bird(
          this.game.distance + 1100 + randomBetween(150, 1500), randomBetween(50, 150),
          spriteWidth, spriteHeight, key, "backward"
        ));
      } else {
        let {spriteWidth, spriteHeight, key} = getSpriteData("Enemy_Bird_Right", this.gD);
        this.birds.push(new Stage3Bird(
          this.game.distance - 100 - randomBetween(150, 1500), randomBetween(50, 150),
          spriteWidth, spriteHeight, key, "forward"
        ));
      }
    }
  };
  this.addBubbles = function() {
    if (Math.random() < 0.15) {
      this.bubbles.push(new Stage3BubbleSpot(
        this.game.distance + 100 + randomBetween(1500, 5500), this.gD.canvas.height, randomBetween(50, 100)
      ));
    }
  };
  this.addFish = function() {
    if (Math.random() < 0.11) {
      let sprites = ["Enemy_Fish_Blue", "Enemy_Fish_Green", "Enemy_Fish_Nemo", "Enemy_Fish_Red"];
      let {spriteWidth, spriteHeight, key} = getSpriteData(sprites[Math.floor(Math.random() * sprites.length)], gD);
      this.fishes.push(new Stage3Fish(
        this.game.distance + this.gD.canvas.width + randomBetween(250, 1450),
        randomBetween(200, 310), spriteWidth, spriteHeight, key
      ));
    }
  };
  this.addSmallFish = function() {
    let random = Math.random();
    if (random < 0.09) {
      if (random < 0.045) {
        let {spriteWidth, spriteHeight, key} = getSpriteData("Deco_Small_Fish_1_L", this.gD);
        this.smallFishes.push(new Stage3SmallFish(
          this.game.distance + 1100 + randomBetween(150, 900), randomBetween(180, 210),
          spriteWidth, spriteHeight, key, "backward"
        ));
      } else {
        let {spriteWidth, spriteHeight, key} = getSpriteData("Deco_Small_Fish_1_R", this.gD);
        this.smallFishes.push(new Stage3SmallFish(
          this.game.distance - 100 - randomBetween(150, 900), randomBetween(180, 210),
          spriteWidth, spriteHeight, key, "forward"
        ));
      }
    }
  };
  this.getBubblesUnderPlayer = function() {
    for (let i = this.bubbleStartIndex; i < this.bubbles.length; i++) {
      if (this.bubbles[i].x <= this.game.player.x + this.game.player.width &&
          this.bubbles[i].x + this.bubbles[i].width >= this.game.player.x) {
        return this.bubbles[i];
      }
    }
    return null;
  };
  this.update = function() {
    if (this.game.player.y + this.game.player.height > this.gD.canvas.height / 2) {
      this.gravity = 4.5;
    } else {
      this.gravity = 20.25;
    }
    for (let i = this.birdStartIndex; i < this.birds.length; i++) {
      this.birds[i].update(this.game);
      this.game.player.collect(this.game, this.birds[i]);
    }
    for (let i = this.bubbleStartIndex; i < this.bubbles.length; i++) {
      this.bubbles[i].update(this.gD);
    }
    for (let i = this.fishStartIndex; i < this.fishes.length; i++) {
      this.fishes[i].update(this.game);
      this.game.player.collect(this.game, this.fishes[i]);
    }
    for (let i = this.smallFishStartIndex; i < this.smallFishes.length; i++) {
      this.smallFishes[i].update(this.game);
    }

    if (this.birds.length === 0 || (this.birds[this.birds.length - 1].direction === "forward" &&
        this.birds[this.birds.length - 1].x > this.game.distance - 100)) {
      this.addBird();
    } else if (this.birds[this.birds.length - 1].direction === "backward" &&
               this.birds[this.birds.length - 1].x < this.game.distance + this.gD.canvas.width + 100) {
      this.addBird();
    }
    if ((this.bubbles.length === 0 ||
      this.bubbles[this.bubbles.length - 1].x < this.game.distance + this.gD.canvas.width + 100) &&
      this.game.currentLevel >= 2) {
      this.addBubbles();
    }
    if ((this.fishes.length === 0 ||
      this.fishes[this.fishes.length - 1].x < this.game.distance + this.gD.canvas.width + 100) &&
      this.game.currentLevel >= 1) {
      this.addFish();
    }
    if (this.smallFishes.length === 0 || (this.smallFishes[this.smallFishes.length - 1].direction === "forward" &&
        this.smallFishes[this.smallFishes.length - 1].x > this.game.distance - 100)) {
      this.addSmallFish();
    } else if (this.smallFishes[this.smallFishes.length - 1].direction === "backward" &&
               this.smallFishes[this.smallFishes.length - 1].x < this.game.distance + this.gD.canvas.width + 100) {
      this.addSmallFish();
    }

    if (this.birds.length > 0 && this.birds[this.birdStartIndex].direction === "forward" &&
        this.birds[this.birdStartIndex].x > this.game.distance + this.gD.canvas.width + 100) {
      this.birdStartIndex++;
    } else if (this.birds.length > 0 && this.birds[this.birdStartIndex].direction === "backward" &&
               this.birds[this.birdStartIndex].x < this.game.distance - 100) {
      this.birdStartIndex++;
    }
    if (this.bubbles.length > 0 && this.bubbles[this.bubbleStartIndex].x < this.game.distance - 100) {
      this.bubbleStartIndex++;
    }
    if (this.fishes.length > 0 && this.fishes[this.fishStartIndex].x < this.game.distance - 100) {
      this.fishStartIndex++;
    }
    if (this.smallFishes.length > 0 && this.smallFishes[this.smallFishStartIndex].direction === "forward" &&
        this.smallFishes[this.smallFishStartIndex].x > this.game.distance + this.gD.canvas.width + 100) {
      this.smallFishStartIndex++;
    } else if (this.smallFishes.length > 0 && this.smallFishes[this.smallFishStartIndex].direction === "backward" &&
               this.smallFishes[this.smallFishStartIndex].x < this.game.distance - 100) {
      this.smallFishStartIndex++;
    }
    
  };
  this.drawForeground = function() {
    this.waves.draw(this.game, this.gD);
    for (let i = this.birdStartIndex; i < this.birds.length; i++) {
      this.birds[i].draw(this.game, this.gD);
    }
  };
  this.drawBackground = function() {
    this.ocean.draw(this.game, this.gD);
    for (let i = this.fishStartIndex; i < this.fishes.length; i++) {
      this.fishes[i].draw(this.game, this.gD);
    }
    for (let i = this.smallFishStartIndex; i < this.smallFishes.length; i++) {
      this.smallFishes[i].draw(this.game, this.gD);
    }
    for (let i = this.bubbleStartIndex; i < this.bubbles.length; i++) {
      this.bubbles[i].draw(this.game, this.gD);
    }
  };
}

function Stage3Bird(x, y, width, height, spriteKey, direction) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.spriteKey = spriteKey;
  this.direction = direction;
  this.showScentence = false;
  this.update = function(game) {
    if (this.direction === "forward") {
      this.x += game.globalSpeed * 1.5;
    } else {
      this.x -= game.globalSpeed * 0.5;
    }
  };
  this.draw = function(game, gD) {
    let canvasX = this.x - game.distance;
    
    drawCanvasImage(canvasX, this.y, this.spriteKey, gD);
    if (this.showScentence) {
      drawCanvasText(canvasX + this.width / 2, this.y - 5, "Omae wa mou shindeiru", "verySmall", gD);
    }
  };
}

function Stage3Fish(x, y, width, height, spriteKey) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.spriteKey = spriteKey;
  this.speed = randomBetween(0.3, 0.5);
  this.update = function(game) {
    this.x -= game.globalSpeed * this.speed;
  };
  this.draw = function(game, gD) {
    let canvasX = this.x - game.distance;

    drawCanvasImage(canvasX, this.y, this.spriteKey, gD);
  };
  this.newPos = function(game) {
    var x = game.globalSpeed;
    var y = Math.sin(this.distanceTravelled / 45) / 3;
    this.distanceTravelled += 2;
    this.x += x;
    this.y += y;
    this.radians = Math.atan2(y, x) + Math.PI;
  };
}

function Stage3JumpingFish(x, y, width, height, fishNr) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.fishNr = fishNr;
  this.distanceTravelled = 0;
  this.radians = 0;
  this.mode = 1;
  this.draw = function(game, gD, ghostFactor) {
    gD.context.translate(this.x + (this.width / 2), this.y + (this.height / 2));
    gD.context.rotate(this.radians);
    gD.context.drawImage(gD.spritesheet, gD.spriteDict["Fish" + this.fishNr][0], gD.spriteDict["Fish" + this.fishNr][1], gD.spriteDict["Fish" + this.fishNr][2], gD.spriteDict["Fish" + this.fishNr][3],
      -(this.width / 2) + (game.globalSpeed * ghostFactor), -(this.height / 2), gD.spriteDict["Fish" + this.fishNr][2], gD.spriteDict["Fish" + this.fishNr][3]);
    gD.context.rotate(-this.radians);
    gD.context.translate(-(this.x + (this.width / 2)), -(this.y + (this.height / 2)));
  };
  this.newPos = function(game) {
    var x = game.globalSpeed;
    var y = 0;
    if (this.mode == 1) {
      if (this.distanceTravelled / 45 >= 2 * Math.PI) {
        this.distanceTravelled = 0;
        this.mode = 2;
      } else {
        y = -(Math.sin(this.distanceTravelled / 45) / 3);
        this.distanceTravelled += 2;
      }
    } else {
      if (this.distanceTravelled / 35 >= 2 * Math.PI) {
        this.distanceTravelled = 0;
        this.mode = 1;
      } else {
        y = -(Math.sin(this.distanceTravelled / 35) * 3);
        this.distanceTravelled += 2;
      }
    }
    this.x += x;
    this.y += y;
    this.radians = Math.atan2(y, x) + Math.PI;
  };
}

function Stage3BubbleSpot(x, y, width) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.bubbles = [];
  this.newBubble = function(gD) {
    if (Math.random() <= 0.35) {
      let random = Math.floor(Math.random() * 3);
      let bubbles = ["Deco_Bubble_L", "Deco_Bubble_M", "Deco_Bubble_S"];
      let {spriteWidth, spriteHeight, key} = getSpriteData(bubbles[random], gD);
      this.bubbles.push(new Stage3Bubble(
        this.x + Math.random() * this.width, this.y, spriteWidth, spriteHeight, key
      ));
    }
  };
  this.update = function(gD) {
    this.bubbles.map((bubble, index) => {
      bubble.update();
      if (bubble.y < gD.canvas.height / 2 && !bubble.timerOn) {
        bubble.setTimer();
      }
      if (bubble.timer <= 0 && bubble.timerOn) {
        this.bubbles.splice(index, 1);
      }
    }, this);
    this.newBubble(gD);
  };
  this.draw = function(game, gD) {
    this.bubbles.map(bubble => {
      bubble.draw(game, gD);
    }, this);
  };
}

function Stage3Bubble(x, y, width, height, key) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.movementX = (Math.random() * 0.2) - 0.1;
  this.key = key;
  this.timerOn = false;
  this.timer = 0;
  this.setTimer = function() {
    this.timerOn = true;
    this.timer = 45;
  };
  this.update = function() {
    if (this.timerOn) {
      this.timer--;
    } else {
      switch (this.key) {
        case "Deco_Bubble_L":
          this.y -= 0.7;
          break;
        case "Deco_Bubble_M":
          this.y -= 1.3;
          break;
        case "Deco_Bubble_S":
          this.y -= 2;
          break;
        default:
          this.y -= 2;
      }
    }
    this.x += this.movementX;
  };
  this.draw = function(game, gD) {
    let canvasX = this.x - game.distance;
    
    drawCanvasImage(canvasX, this.y, this.key, gD);
  };
}

function Stage3SmallFish(x, y, width, height, spriteKey, direction) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.spriteKey = spriteKey;
  this.direction = direction;
  this.showScentence = false;
  this.update = function(game) {
    if (this.direction === "forward") {
      this.x += game.globalSpeed * 1.2;
    } else {
      this.x -= game.globalSpeed * 0.2;
    }
  };
  this.draw = function(game, gD) {
    let canvasX = this.x - game.distance;
    
    drawCanvasImage(canvasX, this.y, this.spriteKey, gD);
    if (this.showScentence) {
      drawCanvasText(canvasX + this.width / 2, this.y - 5, "NANI", "verySmallWhite", gD);
    }
  };
}

function addBird(stage, gD) {
  if (Math.random() * 2 >= 1) {
    stage.birdObjects.push(new Stage3Bird(gD.canvas.width + 10, Math.floor(Math.random() * 80) + 30, gD.spriteDict["Bird1B"][2], gD.spriteDict["Bird1B"][3], 1));
  } else {
    stage.birdObjects.push(new Stage3Bird(-50, Math.floor(Math.random() * 80) + 30, gD.spriteDict["Bird1F"][2], gD.spriteDict["Bird1F"][3], -1));
  }
  stage.birdSpawnCounter = Math.max(Math.random() * (1200 - (stage.game.distanceTravelled * 0.005)), 300);
}

function addFish(stage, gD) {
  var fishNr = Math.floor(Math.random() * 3.999) + 1;
  stage.fishObjects.push(new Stage3Fish(gD.canvas.width + 10, Math.floor(Math.random() * ((gD.canvas.height / 2) - 70)) + ((gD.canvas.height / 2) + 10), gD.spriteDict["Fish" + fishNr][2], gD.spriteDict["Fish" + fishNr][3], fishNr));
  stage.fishSpawnCounter = Math.max(Math.random() * (800 - (stage.game.distanceTravelled * 0.005)), 150);
}

function addJumpingFish(stage, gD) {
  var fishNr = Math.floor(Math.random() * 3.999) + 1;
  stage.jumpingFishObjects.push(new Stage3JumpingFish(gD.canvas.width + 10, (gD.canvas.height / 2) + 25, gD.spriteDict["Fish" + fishNr][2], gD.spriteDict["Fish" + fishNr][3], fishNr));
  stage.jumpingFishSpawnCounter = Math.max(Math.random() * (1200 - (stage.game.distanceTravelled * 0.005)), 400);
}

function addBubbleSpot(stage, gD) {
  stage.bubbleSpotObjects.push(new Stage3BubbleSpot(gD.canvas.width + 500, gD.canvas.height - 1, 50, 1));
  stage.bubbleSpotSpawnCounter = Math.max(Math.random() * (900 - (stage.game.distanceTravelled * 0.005)), 300);
}

function updateStage3(game, stage) {
  if (game.itemsActive[5]) {
    stage.birdSpawnCounter -= 5;
    stage.fishSpawnCounter -= 5;
    stage.jumpingFishSpawnCounter -= 5;
    stage.bubbleSpotSpawnCounter -= 5;
  } else if (game.itemsActive[0]) {
    stage.birdSpawnCounter -= 0.1;
    stage.fishSpawnCounter -= 0.1;
    stage.jumpingFishSpawnCounter -= 0.1;
    stage.bubbleSpotSpawnCounter -= 0.1;
  } else {
    stage.birdSpawnCounter -= Math.floor(1 + (game.distanceTravelled * 0.00005));
    stage.fishSpawnCounter -= Math.floor(1 + (game.distanceTravelled * 0.00005));
    stage.jumpingFishSpawnCounter -= Math.floor(1 + (game.distanceTravelled * 0.00005));
    stage.bubbleSpotSpawnCounter -= Math.floor(1 + (game.distanceTravelled * 0.00005));
  }

  if (stage.birdSpawnCounter <= 0) {
    addBird(stage, game.gD);
  }
  if (stage.birdObjects[0] != undefined) {
    if (stage.birdObjects[0].direction == -1 && stage.birdObjects[0].x > game.gD.canvas.width) {
      stage.birdObjects.shift();
    } else if (stage.birdObjects[0].direction == 1 && stage.birdObjects[0].x + stage.birdObjects[0].width < 0) {
      stage.birdObjects.shift();
    }
  }

  if (stage.fishSpawnCounter <= 0) {
    addFish(stage, game.gD);
  }
  if (stage.fishObjects[0] != undefined && stage.fishObjects[0].x + stage.fishObjects[0].width < 0) {
    stage.fishObjects.shift();
  }

  if (stage.jumpingFishSpawnCounter <= 0) {
    addJumpingFish(stage, game.gD);
  }
  if (stage.jumpingFishObjects[0] != undefined && stage.jumpingFishObjects[0].x + stage.jumpingFishObjects[0].width < 0) {
    stage.jumpingFishObjects.shift();
  }

  if (stage.bubbleSpotSpawnCounter <= 0) {
    addBubbleSpot(stage, game.gD);
  }
  if (stage.bubbleSpotObjects[0] != undefined && stage.bubbleSpotObjects[0].x + stage.bubbleSpotObjects[0].width < 0) {
    stage.bubbleSpotObjects.shift();
  }
  for (var i = 0; i < stage.bubbleSpotObjects.length; i++) {
    for (var j = 0; j < stage.bubbleSpotObjects[i].bubbles.length; j++) {
      var bubble = stage.bubbleSpotObjects[i].bubbles[j];
      if (bubble.y + (bubble.height / 2) < game.gD.canvas.height / 2) {
        stage.bubbleSpotObjects[i].bubbles.splice(j, 1);
        j--;
      }
    }
  }

  for (var i = 0; i < stage.birdObjects.length; i++) {
    stage.birdObjects[i].newPos(game);
    if (game.player.collect(stage.birdObjects[i]) && !game.itemsActive[1] && !game.itemsActive[5]) {
      game.finish();
    }
  }

  for (var i = 0; i < stage.fishObjects.length; i++) {
    stage.fishObjects[i].newPos(game);
    if (game.player.collect(stage.fishObjects[i]) && !game.itemsActive[1] && !game.itemsActive[5]) {
      game.finish();
    }
  }

  for (var i = 0; i < stage.jumpingFishObjects.length; i++) {
    stage.jumpingFishObjects[i].newPos(game);
    if (game.player.collect(stage.jumpingFishObjects[i]) && !game.itemsActive[1] && !game.itemsActive[5]) {
      game.finish();
    }
  }

  for (var i = 0; i < stage.bubbleSpotObjects.length; i++) {
    stage.bubbleSpotObjects[i].newPos(game, game.gD);
  }
}

function drawBackgroundStage3(game, stage, ghostFactor) {
  game.gD.context.drawImage(stage.ocean, ((game.distanceTravelled - (game.globalSpeed * ghostFactor)) % stage.ocean.width), 0, stage.ocean.width - ((game.distanceTravelled - (game.globalSpeed * ghostFactor)) % stage.ocean.width), stage.ocean.height, 
    0, 0, stage.ocean.width - ((game.distanceTravelled - (game.globalSpeed * ghostFactor)) % stage.ocean.width), stage.ocean.height);
  game.gD.context.drawImage(stage.ocean, 0, 0, (game.distanceTravelled - (game.globalSpeed * ghostFactor)) % stage.ocean.width, stage.ocean.height, 
    stage.ocean.width - ((game.distanceTravelled - (game.globalSpeed * ghostFactor)) % stage.ocean.width), 0, (game.distanceTravelled - (game.globalSpeed * ghostFactor)) % stage.ocean.width, stage.ocean.height);

  for (var i = 0; i < stage.bubbleSpotObjects.length; i++) {
    stage.bubbleSpotObjects[i].draw(game, game.gD, ghostFactor);
  }

  game.player.draw(game, game.gD, ghostFactor);

  for (var i = 0; i < stage.birdObjects.length; i++) {
    stage.birdObjects[i].draw(game, game.gD, ghostFactor);
  }
  for (var i = 0; i < stage.fishObjects.length; i++) {
    stage.fishObjects[i].draw(game, game.gD, ghostFactor);
  }
  for (var i = 0; i < stage.jumpingFishObjects.length; i++) {
    stage.jumpingFishObjects[i].draw(game, game.gD, ghostFactor);
  }
}

function drawForegroundStage3(game, stage, ghostFactor) {
  game.gD.context.drawImage(stage.foregroundWaves, ((game.distanceTravelled - (game.globalSpeed * ghostFactor)) % stage.foregroundWaves.width), 0, stage.foregroundWaves.width - ((game.distanceTravelled - (game.globalSpeed * ghostFactor)) % stage.foregroundWaves.width), stage.foregroundWaves.height, 
    0, game.gD.canvas.height - stage.foregroundWaves.height, stage.foregroundWaves.width - ((game.distanceTravelled - (game.globalSpeed * ghostFactor)) % stage.foregroundWaves.width), stage.foregroundWaves.height);
  game.gD.context.drawImage(stage.foregroundWaves, 0, 0, (game.distanceTravelled - (game.globalSpeed * ghostFactor)) % stage.foregroundWaves.width, stage.foregroundWaves.height, 
    stage.foregroundWaves.width - ((game.distanceTravelled - (game.globalSpeed * ghostFactor)) % stage.foregroundWaves.width),  game.gD.canvas.height - stage.foregroundWaves.height, (game.distanceTravelled - (game.globalSpeed * ghostFactor)) % stage.foregroundWaves.width, stage.foregroundWaves.height);
}