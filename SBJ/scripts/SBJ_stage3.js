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
      this.birds[i].update(this.game, this);
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
    for (let i = this.birdStartIndex; i < this.birds.length; i++) {
      this.birds[i].draw(this.game, this.gD);
    }
    for (let i = this.fishStartIndex; i < this.fishes.length; i++) {
      this.fishes[i].draw(this.game, this.gD);
    }
    for (let i = this.smallFishStartIndex; i < this.smallFishes.length; i++) {
      this.smallFishes[i].draw(this.game, this.gD);
    }
    this.waves.draw(this.game, this.gD);
  };
  this.drawBackground = function() {
    this.ocean.draw(this.game, this.gD);
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
  this.inDive = false;
  this.startPoint = x;
  this.originalY = y;
  this.smallFish = null;
  this.hasFish = false;
  this.showScentence = false;
  this.update = function(game, stage) {
    if (this.direction === "forward") {
      this.x += game.globalSpeed * 1.5;
      if (!this.inDive && !this.hasFish && this.y >= 130 && this.y <= 150 &&
           this.x - game.distance >= 0 && this.x - game.distance <= 800) {
        for (let i = stage.smallFishStartIndex; i < stage.smallFishes.length; i++) {
          if ((stage.smallFishes[i].x <= this.x + Math.PI * 20 + 5 && stage.smallFishes[i].x >= this.x + Math.PI * 20 - 5 &&
               stage.smallFishes[i].direction === "forward" && !stage.smallFishes[i].selected) ||
              (stage.smallFishes[i].x <= this.x + Math.PI * 114 + 5 && stage.smallFishes[i].x >= this.x + Math.PI * 114 - 5 &&
               stage.smallFishes[i].direction === "backward" && !stage.smallFishes[i].selected)) {
            this.inDive = true;
            this.smallFish = stage.smallFishes[i];
            this.smallFish.selected = true;
            this.startPoint = this.x;
            if (Math.random() < 0.001) {
              this.showScentence = true;
              this.smallFish.showScentence = true;
            }
            break;
          }
        }
      }
      if (this.inDive) {
        this.y = this.originalY + Math.sin((this.startPoint - this.x) / 200) ** 2 * (this.smallFish.y - this.originalY - 7);
        if ((this.startPoint - this.x) / 200 < -(Math.PI / 2)) {
          this.smallFish.shows = false;
          this.hasFish = true;
        }
        if ((this.startPoint - this.x) / 200 < -Math.PI) {
          this.inDive = false;
          this.y = this.originalY;
        }
      }
    } else {
      this.x -= game.globalSpeed * 0.5;
      if (!this.inDive && !this.hasFish && this.y >= 130 && this.y <= 150 &&
        this.x - game.distance >= 200 && this.x - game.distance <= 1000) {
        for (let i = stage.smallFishStartIndex; i < stage.smallFishes.length; i++) {
          if ((stage.smallFishes[i].x <= this.x - Math.PI * 105 + 5 && stage.smallFishes[i].x >= this.x - Math.PI * 105 - 5 &&
               stage.smallFishes[i].direction === "forward" && !stage.smallFishes[i].selected) ||
              (stage.smallFishes[i].x <= this.x - Math.PI * 18 + 5 && stage.smallFishes[i].x >= this.x - Math.PI * 18 - 5 &&
               stage.smallFishes[i].direction === "backward" && !stage.smallFishes[i].selected)) {
            this.inDive = true;
            this.smallFish = stage.smallFishes[i];
            this.smallFish.selected = true;
            this.startPoint = this.x;
            if (Math.random() < 0.001) {
              this.showScentence = true;
              this.smallFish.showScentence = true;
            }
            break;
          }
        }
      }
      if (this.inDive) {
        this.y = this.originalY + Math.sin((this.startPoint - this.x) / 65) ** 2 * (this.smallFish.y - this.originalY - 7);
        if ((this.startPoint - this.x) / 65 > Math.PI / 2) {
          this.smallFish.shows = false;
          this.hasFish = true;
        }
        if ((this.startPoint - this.x) / 65 > Math.PI) {
          this.inDive = false;
          this.y = this.originalY;
        }
      }
    }
  };
  this.draw = function(game, gD) {
    let canvasX = this.x - game.distance;

    if (!this.hasFish) {
      drawCanvasImage(canvasX, this.y, this.spriteKey, gD);
    } else {
      drawCanvasImage(canvasX, this.y, this.spriteKey + "_Fish", gD);
    }
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
  this.update = function (game) {
    this.x -= game.globalSpeed * this.speed;
  };
  this.draw = function (game, gD) {
    let canvasX = this.x - game.distance;

    drawCanvasImage(canvasX, this.y, this.spriteKey, gD);
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
  this.selected = false;
  this.shows = true;
  this.update = function(game) {
    if (this.direction === "forward") {
      this.x += game.globalSpeed * 1.2;
    } else {
      this.x -= game.globalSpeed * 0.2;
    }
  };
  this.draw = function(game, gD) {
    if (this.shows) {
      let canvasX = this.x - game.distance;

      drawCanvasImage(canvasX, this.y, this.spriteKey, gD);
      if (this.showScentence) {
        drawCanvasText(canvasX + this.width / 2, this.y - 5, "NANI", "verySmallWhite", gD);
      }
    }
  };
}