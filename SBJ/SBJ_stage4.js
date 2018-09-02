function Stage4(game) {
  this.game = game;
  this.forest = new Image();
  this.forest.src = "img/stage4Forest.png";
  this.deadZoneGround = 0;
  this.floorColor = "rgba(173, 97, 53, 1)";
  this.difficulty = 40;
  this.init = function() {
    this.appleObjects = [];
    this.appleSpawnCounter = Math.max(Math.floor(Math.random() * 1000), 500);
  };
}

function Stage4Apple(x, y, width, height, untilDrop) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.untilDrop = untilDrop;
  this.velocity = 0;
  this.gravity = 0.2;
  this.update = function(gD) {
    gD.context.drawImage(gD.spritesheet, gD.spriteDict["Apple"][0], gD.spriteDict["Apple"][1], gD.spriteDict["Apple"][2], gD.spriteDict["Apple"][3],
      this.x, this.y, gD.spriteDict["Apple"][2], gD.spriteDict["Apple"][3]);
  };
  this.newPos = function(game) {
    this.x += game.globalSpeed;
    if (this.untilDrop <= 0) {
      this.y += this.velocity;
      this.velocity += this.gravity;
    } else {
      this.untilDrop--;
    }
  };
}

function addApple(stage, gD) {
  stage.appleObjects.push(new Stage4Apple(gD.canvas.width + 10, 30, gD.spriteDict["Apple"][2], gD.spriteDict["Apple"][3], Math.floor(Math.random() * (1200 / -stage.game.globalSpeed))));
  stage.appleSpawnCounter = Math.max(Math.random() * (600 - (stage.game.distanceTravelled * 0.005)), 50);
}

function updateStage4(game, stage) {
  if (game.itemsActive[5]) {
    stage.appleSpawnCounter -= 5;
  } else if (game.itemsActive[0]) {
    stage.appleSpawnCounter -= 0.1;
  } else {
    stage.appleSpawnCounter -= Math.floor(1 + (game.distanceTravelled * 0.00005));
  }

  if (stage.appleSpawnCounter <= 0) {
    addApple(stage, game.gD);
  }
  for (var i = 0; i < stage.appleObjects.length; i++) {
    stage.appleObjects[i].newPos(game);
    if (game.player.collect(stage.appleObjects[i]) && !game.itemsActive[1] && !game.itemsActive[5]) {
      game.finish();
    } else if (stage.appleObjects[i].y > game.gD.canvas.height) {
      stage.appleObjects.splice(i, 1);
      i--;
    }
  }
}

function drawBackgroundStage4(game, stage) {
  game.gD.context.drawImage(stage.forest, game.distanceTravelled % stage.forest.width, 0, stage.forest.width - (game.distanceTravelled % stage.forest.width), stage.forest.height, 
    0, 0, stage.forest.width - (game.distanceTravelled % stage.forest.width), stage.forest.height);
  game.gD.context.drawImage(stage.forest, 0, 0, game.distanceTravelled % stage.forest.width, stage.forest.height, 
    stage.forest.width - (game.distanceTravelled % stage.forest.width), 0, game.distanceTravelled % stage.forest.width, stage.forest.height);

  game.player.update(game, game.gD);

  for (var i = 0; i < stage.appleObjects.length; i++) {
    stage.appleObjects[i].update(game.gD);
  }
}

function drawForegroundStage4(game, stage) {

}