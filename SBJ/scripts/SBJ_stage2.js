function Stage2(game) {
  this.game = game;
  this.air = new Image();
  this.air.src = "img/stage2Air.png";
  this.deadZoneGround = 0;
  this.floorColor = "rgba(124, 124, 124, 1)";
  this.difficulty = 25;
  this.init = function() {
    this.planeObjects = [];
    this.rocketObjects = [];
    this.planeSpawnCounter = Math.max(Math.random() * 1500, 500);
    this.rocketSpawnCounter = Math.max(Math.random() * 2000, 700);
  };
}

function Stage2Plane(x, y, width, height, planeNr) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.planeNr = planeNr;
  this.draw = function(game, gD, ghostFactor) {
    gD.context.drawImage(gD.spritesheet, gD.spriteDict["Plane" + this.planeNr][0], gD.spriteDict["Plane" + this.planeNr][1], gD.spriteDict["Plane" + this.planeNr][2], gD.spriteDict["Plane" + this.planeNr][3],
      this.x + (game.globalSpeed * 1.7 * ghostFactor), this.y, gD.spriteDict["Plane" + this.planeNr][2], gD.spriteDict["Plane" + this.planeNr][3]);
  };
  this.newPos = function(game) {
    this.x += game.globalSpeed * 1.7;
  };
}

function Stage2Rocket(x, y, width, height) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.draw = function(game, gD, ghostFactor) {
    gD.context.drawImage(gD.spritesheet, gD.spriteDict["Rocket"][0], gD.spriteDict["Rocket"][1], gD.spriteDict["Rocket"][2], gD.spriteDict["Rocket"][3],
      this.x + (game.globalSpeed * ghostFactor), this.y - ((Math.pow(((game.gD.canvas.height - this.y) / 200) + 1, 2) + 0.1) * ghostFactor), gD.spriteDict["Rocket"][2], gD.spriteDict["Rocket"][3])
  };
  this.newPos = function(game) {
    this.x += game.globalSpeed;
    this.y -= Math.pow(((game.gD.canvas.height - this.y) / 200) + 1, 2) + 0.1;
  };
}

function addPlane(stage, gD) {
  var planeNr = Math.floor(Math.random() * 3.999) + 1;
  stage.planeObjects.push(new Stage2Plane(gD.canvas.width + 75, Math.floor(Math.random() * 250) + 50, gD.spriteDict["Plane" + planeNr][2], gD.spriteDict["Plane" + planeNr][3], planeNr));
  stage.planeSpawnCounter = Math.max(Math.random() * (1500 - (stage.game.distanceTravelled * 0.005)), 500);
}

function addRocket(stage, gD) {
  stage.rocketObjects.push(new Stage2Rocket(Math.floor(Math.random() * (gD.canvas.width - 100)) + 100, gD.canvas.height + 1, gD.spriteDict["Rocket"][2], gD.spriteDict["Rocket"][3]));
  stage.rocketSpawnCounter = Math.max(Math.random() * (2000 - (stage.game.distanceTravelled * 0.005)), 700);
}

function updateStage2(game, stage) {
  if (game.itemsActive[5]) {
    stage.planeSpawnCounter -= 5;
    stage.rocketSpawnCounter -= 5;
  } else if (game.itemsActive[0]) {
    stage.planeSpawnCounter -= 0.05;
    stage.rocketSpawnCounter -= 0.05;
  } else {
    stage.planeSpawnCounter -= Math.floor(1 + (game.distanceTravelled * 0.00005));
    stage.rocketSpawnCounter -= Math.floor(1 + (game.distanceTravelled * 0.00005));
  }

  if (stage.planeSpawnCounter <= 0) {
    addPlane(stage, game.gD);
  }
  if (stage.planeObjects[0] !== undefined && stage.planeObjects[0].x + stage.planeObjects[0].width < 0) {
    stage.planeObjects.shift();
  }

  if (stage.rocketSpawnCounter <= 0) {
    addRocket(stage, game.gD);
  }
  if (stage.rocketObjects[0] != undefined && stage.rocketObjects[0].y + stage.rocketObjects[0].height < 0) {
    stage.rocketObjects.shift();
  }

  for (var i = 0; i < stage.planeObjects.length; i++) {
    stage.planeObjects[i].newPos(game);
    if (game.player.collect(stage.planeObjects[i]) && !game.itemsActive[1] && !game.itemsActive[5]) {
      game.finish();
    }
  }

  for (var i = 0; i < stage.rocketObjects.length; i++) {
    stage.rocketObjects[i].newPos(game);
    if (game.player.collect(stage.rocketObjects[i]) && !game.itemsActive[1] && !game.itemsActive[5]) {
      game.finish();
    }
  }
}

function drawBackgroundStage2(game, stage, ghostFactor) {
  game.gD.context.drawImage(stage.air, ((game.distanceTravelled * 0.4) - (game.globalSpeed * ghostFactor)) % stage.air.width, 0, stage.air.width - (((game.distanceTravelled * 0.4) - (game.globalSpeed * ghostFactor)) % stage.air.width), stage.air.height, 
    0, 0, stage.air.width - (((game.distanceTravelled * 0.4) - (game.globalSpeed * ghostFactor)) % stage.air.width), stage.air.height);
  game.gD.context.drawImage(stage.air, 0, 0, ((game.distanceTravelled * 0.4) - (game.globalSpeed * ghostFactor)) % stage.air.width, stage.air.height, 
    stage.air.width - (((game.distanceTravelled * 0.4) - (game.globalSpeed * ghostFactor)) % stage.air.width), 0, ((game.distanceTravelled * 0.4) - (game.globalSpeed * ghostFactor)) % stage.air.width, stage.air.height);

  game.player.draw(game, game.gD, ghostFactor);

  for (var i = 0; i < stage.planeObjects.length; i++) {
    stage.planeObjects[i].draw(game, game.gD, ghostFactor);
  }

  for (var i = 0; i < stage.rocketObjects.length; i++) {
    stage.rocketObjects[i].draw(game, game.gD, ghostFactor);
  }
}

function drawForegroundStage2(game, stage, ghostFactor) {

}