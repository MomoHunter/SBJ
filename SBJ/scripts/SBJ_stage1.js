function Stage1(game, gD) {
  this.game = game;
  this.gD = gD;
  this.name = "Festung";
  this.deadZoneGround = 20;     //how many pixels from the bottom upwards is the deadzone
  this.floorColorKey = "stage1Floor";
  this.difficulty = 20;
  this.gravity = 20.25;
  this.init = function() {
    this.fireballs = [];
    this.deco = {
      "torch": [new Stage1Deco(50, 105, "Deco_Torch")],
      "prison": []
    };
    this.wall = new Background(0, 1000, 350, "img/Festung_Wall.png");
    this.lava = new AnimatedBackground(this.gD.canvas.height - 25, 1000, 100, "img/Festung_Lava.png", 4, 18);
  };
  this.addFireball = function() {
    let random = Math.random();
    if (random < 0.15) {
      let {spriteWidth, spriteHeight} = getSpriteData("Enemy_Fireball", this.gD);
      this.fireballs.push(new Stage1Fireball(
        this.game.distance + this.gD.canvas.width + randomBetween(0, 300),
        100, spriteWidth, spriteHeight, "Enemy_Fireball"
      ));
    }
  };
  this.addDeco = function() {
    this.deco.torch.push(new Stage1Deco(
      this.deco.torch[this.deco.torch.length - 1].x + 300, 105, "Deco_Torch"
    ));
    if (Math.random() < 0.05) {
      this.deco["prison"].push(new Stage1Deco(
        Math.round(this.game.distance + (20 - this.game.distance % 20)) + 1498, 94, "Deco_Door"
      ));
    }
  };
  this.update = function() {
    this.fireballs.map(fireball => {
      fireball.update(this.gD);
      this.game.player.collect(game, fireball);
    }, this);

    if (this.gD.frameNo % 50 === 0 && this.game.currentLevel >= 2) {
      this.addFireball();
    }

    if (this.deco.torch[this.deco.torch.length - 1].x < this.game.distance + this.gD.canvas.width) {
      this.addDeco();
    }
  };
  this.drawForeground = function() {
    this.fireballs.map(fireball => {
      fireball.draw(this.game, this.gD);
    }, this);
    this.lava.draw(this.game, this.gD);
  };
  this.drawBackground = function() {
    this.wall.draw(this.game, this.gD);
    this.deco.torch.map(torch => {
      if (torch.x > this.game.distance - 20) {
        torch.draw(this.game, this.gD);
      }
    }, this);
    this.deco.prison.map(prison => {
      if (prison.x > this.game.distance - 200) {
        prison.draw(this.game, this.gD);
      }
    }, this);
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