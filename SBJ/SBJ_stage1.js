function Stage1(game) {
  this.game = game;
  this.lava = new Image();
  this.lava.src = "img/stage1Lava.png";
  this.wall = new Image();
  this.wall.src = "img/stage1Wall.png";
  this.deadZoneGround = 20;     //how many pixels from the bottom upwards is the deadzone
  this.floorColor = "rgba(155, 155, 155, 1)";
  this.difficulty = 20;
  this.init = function() {
    this.fireballObjects = [];
    this.fireballSpawnCounter = Math.max(Math.floor(Math.random() * 600), 300);
  };
}

function Stage1Fireball(x, y, width, height) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.gravity = 0.4;
  this.velocity = 0;
  this.jumpCounter = 0;
  this.outsideCanvas = false;
  this.draw = function(game, gD, ghostFactor) {
    gD.context.drawImage(gD.spritesheet, gD.spriteDict["Fireball"][0], gD.spriteDict["Fireball"][1], gD.spriteDict["Fireball"][2], gD.spriteDict["Fireball"][3],
      this.x + (game.globalSpeed * ghostFactor), this.y + (this.velocity * ghostFactor), gD.spriteDict["Fireball"][2], gD.spriteDict["Fireball"][3]);
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

function addFireball(stage, gD) {
  stage.fireballObjects.push(new Stage1Fireball(gD.canvas.width + Math.floor(Math.random() * 150), Math.floor(Math.random() * 200), gD.spriteDict["Fireball"][2], gD.spriteDict["Fireball"][3]));
  stage.fireballSpawnCounter = Math.max(Math.random() * (1000 - (stage.game.distanceTravelled * 0.001)), 370);
}

function updateStage1(game, stage) {
  if (game.itemsActive[5]) {
    stage.fireballSpawnCounter -= 5;
  } else if (game.itemsActive[0]) {
    stage.fireballSpawnCounter -= 0.05;
  } else {
    stage.fireballSpawnCounter -= Math.floor(1 + (game.distanceTravelled * 0.00005));
  }

  if (stage.fireballSpawnCounter <= 0) {
    addFireball(stage, game.gD);
  }
  if (stage.fireballObjects[0] != undefined && stage.fireballObjects[0].x + stage.fireballObjects[0].width < 0) {
    stage.fireballObjects.shift();
  }

  for (var i = 0; i < stage.fireballObjects.length; i++) {
    stage.fireballObjects[i].newPos(game, game.gD);
    if (game.player.collect(stage.fireballObjects[i]) && !game.itemsActive[1] && !game.itemsActive[5]) {
      game.finish();
    }
  }
}

function drawBackgroundStage1(game, stage, ghostFactor) {
  game.gD.context.drawImage(stage.wall, (game.distanceTravelled + (game.globalSpeed * ghostFactor)) % stage.wall.width, 0, stage.wall.width - ((game.distanceTravelled + (game.globalSpeed * ghostFactor)) % stage.wall.width), stage.wall.height, 
    0, 0, stage.wall.width - ((game.distanceTravelled + (game.globalSpeed * ghostFactor)) % stage.wall.width), stage.wall.height);
  game.gD.context.drawImage(stage.wall, 0, 0, (game.distanceTravelled + (game.globalSpeed * ghostFactor)) % stage.wall.width, stage.wall.height, 
    stage.wall.width - ((game.distanceTravelled + (game.globalSpeed * ghostFactor)) % stage.wall.width), 0, (game.distanceTravelled + (game.globalSpeed * ghostFactor)) % stage.wall.width, stage.wall.height);

  game.gD.context.fillStyle = "rgba(0, 0, 0, 1)";
  game.gD.context.fillRect(0, game.gD.canvas.height - 20, game.gD.canvas.width, 20);

  game.player.draw(game, game.gD, ghostFactor);

  for (var i = 0; i < stage.fireballObjects.length; i++) {
    stage.fireballObjects[i].draw(game, game.gD, ghostFactor);
  }

  for (var i = 0; i < game.gD.canvas.width / 100; i++) {
    game.gD.context.drawImage(stage.lava, 100 * Math.floor(((game.frameCounter / 10) + (Math.floor(i * 1.7) * 10)) % 40 / 10),
      40 * Math.floor((game.frameCounter / 10) % 10), 100, 20, i * 100, game.gD.canvas.height - 20, 100, 20);
  }
}

function drawForegroundStage1(game, stage, ghostFactor) {

}