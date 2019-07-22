function Stage1(game, gD) {
  this.game = game;
  this.gD = gD;
  this.name = "Fortress";
  this.deadZoneGround = 20;     //how many pixels from the bottom upwards is the deadzone
  this.floorColorKey = "stage1Floor";
  this.difficulty = 20;
  this.gravity = 20.25;
  this.init = function() {
    this.fireballs = [];
    this.fireballStartIndex = 0;
    this.deco = {
      "torch": [new Stage1Deco(50, 105, "Deco_Torch")],
      "prison": []
    };
    this.torchStartIndex = 0;
    this.prisonStartIndex = 0;
    
    this.wall = new Background(0, 1000, 350, "img/Fortress_Wall.png");
    this.lava = new AnimatedBackground(this.gD.canvas.height - 25, 1000, 100, "img/Fortress_Lava.png", 4, 18);
  };
  this.addFireball = function() {
    let {spriteWidth, spriteHeight} = getSpriteData("Enemy_Fireball", this.gD);
    this.fireballs.push(new Stage1Fireball(
      this.game.distance + this.gD.canvas.width + randomBetween(200, 2000),
      100, spriteWidth, spriteHeight, "Enemy_Fireball"
    ));
  };
  this.addDeco = function() {
    this.deco.torch.push(new Stage1Deco(
      this.deco.torch[this.deco.torch.length - 1].x + 300, 105, "Deco_Torch"
    ));
    if (Math.random() < 0.01) {
      this.deco["prison"].push(new Stage1Deco(
        Math.round(this.game.distance + (20 - this.game.distance % 20)) + 1378, 94, "Deco_Door"
      ));
    }
  };
  this.update = function() {
    for (let i = this.fireballStartIndex; i < this.fireballs.length; i++) {
      this.fireballs[i].update(this.gD);
      this.game.player.collect(this.game, this.fireballs[i]);
    }

    if ((this.fireballs.length === 0 || this.fireballs[this.fireballs.length - 1].x < this.game.distance + 1100) && 
         this.game.currentLevel >= 2) {
      this.addFireball();
    }
    if (this.fireballs.length > 0 && this.fireballs[this.fireballStartIndex].x < this.game.distance - 100) {
      this.fireballStartIndex++;
    }

    if (this.deco.torch[this.deco.torch.length - 1].x < this.game.distance + this.gD.canvas.width) {
      this.addDeco();
    }
    if (this.deco.torch[this.torchStartIndex].x + 
        this.deco.torch[this.torchStartIndex].width < this.game.distance - 100) {
      this.torchStartIndex++;
    }
    if (this.deco.prison.lengt > 0 && this.deco.prison[this.prisonStartIndex].x + 
        this.deco.prison[this.prisonStartIndex].width < this.game.distance - 100) {
      this.prisonStartIndex++;
    }
  };
  this.drawForeground = function() {
    for (let i = this.fireballStartIndex; i < this.fireballs.length; i++) {
      this.fireballs[i].draw(this.game, this.gD);
    }
    this.lava.draw(this.game, this.gD);
  };
  this.drawBackground = function() {
    this.wall.draw(this.game, this.gD);
    for (let i = this.torchStartIndex; i < this.deco.torch.length; i++) {
      this.deco.torch[i].draw(this.game, this.gD);
    }
    for (let i = this.prisonStartIndex; i < this.deco.prison.length; i++) {
      this.deco.prison[i].draw(this.game, this.gD);
    }
  };
}

function Stage1Fireball(x, y, width, height, spriteKey) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.spriteKey = spriteKey;
  this.gravity = 0.2;
  this.velocity = 0;
  this.jumpCounter = 0;
  this.outsideCanvas = false;
  this.update = function (gD) {
    if (this.y > gD.canvas.height && !this.outsideCanvas) {
      this.y = gD.canvas.height;
      this.outsideCanvas = true;
      this.jumpCounter = 70;
    } else if (this.outsideCanvas) {
      this.jumpCounter--;
      if (this.jumpCounter === 0) {
        this.outsideCanvas = false;
        this.velocity = -10;
        this.velocity += this.gravity;
        this.y += this.velocity;
      }
    } else {
      this.velocity += this.gravity;
      this.y += this.velocity;
    }
  };
  this.draw = function(game, gD) {
    let canvasX = this.x - game.distance;

    drawCanvasImage(canvasX, this.y, this.spriteKey, gD);
  };
}

function Stage1Deco(x, y, spriteKey) {
  this.x = x;
  this.y = y;
  this.spriteKey = spriteKey;
  this.draw = function(game, gD) {
    let canvasX = this.x - game.distance;

    drawCanvasImage(canvasX, this.y, this.spriteKey, gD);
  };
}