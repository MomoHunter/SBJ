function Stage3(game) {
  this.game = game;
  this.deadZoneGround = 0;
  this.floorColor = "rgba(239, 217, 165, 1)";
  this.difficulty = 60;
  this.init = function() {
    this.birdObjects = [];
    this.fishObjects = [];
    this.jumpingFishObjects = [];
    this.birdSpawnCounter = Math.max(Math.floor(Math.random() * 1000), 400);
    this.fishSpawnCounter = Math.max(Math.floor(Math.random() * 1000), 400);
    this.jumpingFishSpawnCounter = Math.max(Math.floor(Math.random() * 1000), 400);
  };
}

function Stage3Bird(x, y, width, height, direction) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.direction = direction;
  this.draw = function(gD) {
    gD.context.drawImage(gD.spritesheet, gD.spriteDict["Bird1"][0], gD.spriteDict["Bird1"][1], gD.spriteDict["Bird1"][2], gD.spriteDict["Bird1"][3],
      this.x, this.y, gD.spriteDict["Bird1"][2], gD.spriteDict["Bird1"][3]);
  };
  this.newPos = function(game) {
    this.x += game.globalSpeed * 1.5 * this.direction;
  };
}

function Stage3Fish(x, y, width, height) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.distanceTravelled = 0;
  this.radians = 0;
  this.draw = function(gD) {
    gD.context.translate(this.x + (this.width / 2), this.y + (this.height / 2));
    gD.context.rotate(this.radians);
    gD.context.drawImage(gD.spritesheet, gD.spriteDict["Fish"][0], gD.spriteDict["Fish"][1], gD.spriteDict["Fish"][2], gD.spriteDict["Fish"][3],
      -(this.width / 2), -(this.height / 2), gD.spriteDict["Fish"][2], gD.spriteDict["Fish"][3]);
    gD.context.rotate(-this.radians);
    gD.context.translate(-(this.x + (this.width / 2)), -(this.y + (this.height / 2)));
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

function Stage3JumpingFish(x, y, width, height) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.distanceTravelled = 0;
  this.radians = 0;
  this.mode = 1;
  this.draw = function(gD) {
    gD.context.translate(this.x + (this.width / 2), this.y + (this.height / 2));
    gD.context.rotate(this.radians);
    gD.context.drawImage(gD.spritesheet, gD.spriteDict["Fish"][0], gD.spriteDict["Fish"][1], gD.spriteDict["Fish"][2], gD.spriteDict["Fish"][3],
      -(this.width / 2), -(this.height / 2), gD.spriteDict["Fish"][2], gD.spriteDict["Fish"][3]);
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

function addBird(stage, gD) {
  if (Math.random() * 2 >= 1) {
    stage.birdObjects.push(new Stage3Bird(gD.canvas.width + 10, Math.floor(Math.random() * 80) + 30, gD.spriteDict["Bird1"][2], gD.spriteDict["Bird1"][3], 1));
  } else {
    stage.birdObjects.push(new Stage3Bird(-50, Math.floor(Math.random() * 80) + 30, gD.spriteDict["Bird1"][2], gD.spriteDict["Bird1"][3], -1));
  }
  stage.birdSpawnCounter = Math.max(Math.random() * (1200 - (stage.game.distanceTravelled * 0.005)), 300);
}

function addFish(stage, gD) {
  stage.fishObjects.push(new Stage3Fish(gD.canvas.width + 10, Math.floor(Math.random() * ((gD.canvas.height / 2) - 70)) + ((gD.canvas.height / 2) + 10), 40, 30));
  stage.fishSpawnCounter = Math.max(Math.random() * (800 - (stage.game.distanceTravelled * 0.005)), 150);
}

function addJumpingFish(stage, gD) {
  stage.jumpingFishObjects.push(new Stage3JumpingFish(gD.canvas.width + 10, (gD.canvas.height / 2) + 25, 40, 30));
  stage.jumpingFishSpawnCounter = Math.max(Math.random() * (1200 - (stage.game.distanceTravelled * 0.005)), 400);
}

function updateStage3(game, stage) {
  if (game.itemsActive[5]) {
    stage.birdSpawnCounter -= 5;
    stage.fishSpawnCounter -= 5;
    stage.jumpingFishSpawnCounter -= 5;
  } else if (game.itemsActive[0]) {
    stage.birdSpawnCounter -= 0.1;
    stage.fishSpawnCounter -= 0.1;
    stage.jumpingFishSpawnCounter -= 0.1;
  } else {
    stage.birdSpawnCounter -= Math.floor(1 + (game.distanceTravelled * 0.00005));
    stage.fishSpawnCounter -= Math.floor(1 + (game.distanceTravelled * 0.00005));
    stage.jumpingFishSpawnCounter -= Math.floor(1 + (game.distanceTravelled * 0.00005));
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
}

function drawBackgroundStage3(game, stage) {
  game.gD.context.fillStyle = "rgba(157, 219, 242, 1)";
  game.gD.context.fillRect(0, 0, game.gD.canvas.width, game.gD.canvas.height);

  game.player.draw(game, game.gD);

  for (var i = 0; i < stage.birdObjects.length; i++) {
    stage.birdObjects[i].draw(game.gD);
  }
  for (var i = 0; i < stage.fishObjects.length; i++) {
    stage.fishObjects[i].draw(game.gD);
  }
  for (var i = 0; i < stage.jumpingFishObjects.length; i++) {
    stage.jumpingFishObjects[i].draw(game.gD);
  }
}

function drawForegroundStage3(game, stage) {
  game.gD.context.fillStyle = "rgba(34, 34, 178, .4)";
  game.gD.context.fillRect(0, game.gD.canvas.height / 2, game.gD.canvas.width, game.gD.canvas.height / 2);
}