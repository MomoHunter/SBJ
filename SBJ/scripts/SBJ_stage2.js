function Stage2(game, gD) {
  this.game = game;
  this.gD = gD;
  this.name = "Air";
  this.deadZoneGround = 0;
  this.floorColorKey = "stage2Floor";
  this.difficulty = 25;
  this.gravity = 20.25;
  this.init = function() {
    this.planes = [];
    this.planeStartIndex = 0;
    this.rockets = [];
    this.rocketStartIndex = 0;
    this.clouds = new Background(0, 1000, 350, "img/Air_Clouds.png", 2);
  };
  this.addPlane = function() {
    let planeKeys = ["Enemy_Airplane_Blue", "Enemy_Airplane_Green", "Enemy_Airplane_Purple", "Enemy_Airplane_Red"];
    let planeKey = planeKeys[Math.floor(Math.random() * 4)];
    let {spriteWidth, spriteHeight} = getSpriteData(planeKey, this.gD); 
    this.planes.push(new Stage2Plane(
      this.game.distance + this.gD.canvas.width + randomBetween(200, 1500), randomBetween(50, 300), 
      spriteWidth, spriteHeight, randomBetween(0.5, 1), planeKey
    ));
  };
  this.addRocket = function() {
    let {spriteWidth, spriteHeight} = getSpriteData("Enemy_Rocket", this.gD);
    this.rockets.push(new Stage2Rocket(
      this.game.distance + randomBetween(1250, 3000), 351, spriteWidth, 
      spriteHeight, randomBetween(150, 165), "Enemy_Rocket"
    ));
  };
  this.update = function() {
    for (let i = this.planeStartIndex; i < this.planes.length; i++) {
      this.planes[i].update(this.game);
      this.game.player.collect(game, this.planes[i]);
    }
    for (let i = this.rocketStartIndex; i < this.rockets.length; i++) {
      this.rockets[i].update(this.game, this.gD);
      this.game.player.collect(game, this.rockets[i]);
    }
    
    if ((this.planes.length === 0 || this.planes[this.planes.length - 1].x < this.game.distance + 1100) &&
         this.game.currentLevel >= 2) {
      this.addPlane();
    }
    if (this.planes.length > 0 && this.planes[this.planeStartIndex].x < this.game.distance - 100) {
      this.planeStartIndex++;
    }
    
    if ((this.rockets.length === 0 || this.rockets[this.rockets.length - 1].x < this.game.distance + 1100) &&
         this.game.currentLevel >= 3) {
      this.addRocket();
    }
    if (this.rockets.length > 0 && this.rockets[this.rocketStartIndex].x < this.game.distance - 100) {
      this.rocketStartIndex++;
    }
  };
  this.drawForeground = function() {
    for (let i = this.planeStartIndex; i < this.planes.length; i++) {
      this.planes[i].draw(this.game, this.gD);
    }
    for (let i = this.rocketStartIndex; i < this.rockets.length; i++) {
      this.rockets[i].draw(this.game, this.gD);
    }
  };
  this.drawBackground = function() {
    this.clouds.draw(this.game, this.gD);
  };
}

function Stage2Plane(x, y, width, height, speed, spriteKey) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.speed = speed;
  this.spriteKey = spriteKey;
  this.update = function(game) {
    this.x -= game.globalSpeed * this.speed;
  };
  this.draw = function(game, gD) {
    let canvasX = this.x - game.distance;
    
    drawCanvasImage(canvasX, this.y, this.spriteKey, gD);
  };
}

function Stage2Rocket(x, y, width, height, turnPoint, spriteKey) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.originalX = x;
  this.originalY = y;
  this.originalWidth = width;
  this.originalHeight = height;
  this.turnPoint = turnPoint;
  this.spriteKey = spriteKey;
  this.velocityY = 0;
  this.velocityX = 0;
  this.gravity = 0.01;
  this.rotation = 0;
  this.launched = false;
  this.update = function(game, gD) {
    if (!this.launched && game.distance + 1200 > this.originalX) {
      if (Math.random() < 0.03 || game.distance + 800 > this.originalX) {
        this.launched = true;
      }
    }
    if (this.launched) {
      if (this.y > this.turnPoint) {
        this.originalY += this.velocityY;
        this.velocityY -= this.gravity;
      } else {
        if (this.velocityY < 0) {
          this.originalY += this.velocityY;
          this.velocityY += this.gravity * 2;
        } else {
          this.velocityY = 0;
        }
        if (this.rotation < 90) {
          this.rotation += 0.75;
          if (this.rotation < 45) {
            this.height = (1 - (this.rotation / 45)) * (this.originalHeight - this.originalWidth) + this.originalWidth;
          } else {
            this.height = this.originalWidth;
          }
          if (this.rotation > 45) {
            this.width = (2 - (this.rotation / 45)) * (this.originalWidth - this.originalHeight) + this.originalHeight;
          }
        } else {
          this.rotation = 90;
          this.width = this.originalHeight;
        }
        this.originalX += this.velocityX;
        this.velocityX += this.gravity;
      }
      this.x = this.originalX + (this.originalWidth - this.width) / 2;
      this.y = this.originalY + (this.originalHeight - this.height) / 2;
    }
  };
  this.draw = function(game, gD) {
    let canvasX = this.originalX - game.distance;
    
    drawCanvasImage(canvasX, this.originalY, this.spriteKey, gD, this.rotation);
  };
}