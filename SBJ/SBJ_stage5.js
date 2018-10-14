function Stage5(game) {
  this.game = game;
  this.universe = new Image();
  this.universe.src = "img/stage5Universe.png";
  this.backgroundAsteroids = new Image();
  this.backgroundAsteroids.src = "img/stage5Asteroids.png";
  this.deadZoneGround = 0;
  this.floorColor = "rgba(255, 249, 191, 1)";
  this.difficulty = 55;
  this.init = function() {
    this.asteroidObjects = [];
    this.asteroidSpawnCounter = Math.max(Math.random() * 1000, 600);
    this.backgroundAsteroidsObjects = [];
    this.backgroundAsteroidsSpawnCounter = Math.max(Math.random() * 6000, 2000);
  };
}

function Stage5Asteroid(x, y, width, height, direction, rotationDirection, imageNr) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.direction = direction;
  this.rotationDirection = rotationDirection;
  this.rotation = 0;
  this.imageNr = imageNr;
  this.draw = function(gD) {
    gD.context.translate(this.x + (this.width / 2), this.y + (this.height / 2));
    gD.context.rotate(this.rotation);
    gD.context.drawImage(gD.spritesheet, gD.spriteDict["Asteroid" + this.imageNr][0], gD.spriteDict["Asteroid" + this.imageNr][1], gD.spriteDict["Asteroid" + this.imageNr][2], gD.spriteDict["Asteroid" + this.imageNr][3],
      -(this.width / 2), -(this.height / 2), gD.spriteDict["Asteroid" + this.imageNr][2], gD.spriteDict["Asteroid" + this.imageNr][3]);
    gD.context.rotate(-this.rotation);
    gD.context.translate(-(this.x + (this.width / 2)), -(this.y + (this.height / 2)));
  };
  this.newPos = function(game) {
    switch (this.direction) {
      case 0:
        this.x -= 2 * game.globalSpeed;
        this.y -= game.globalSpeed;
        break;
      case 1:
        this.y -= game.globalSpeed;
        break;
      case 2:
        this.x += 2 * game.globalSpeed;
        this.y -= game.globalSpeed;
        break;
      default:
        this.y -= game.globalSpeed;
    }
    if (this.rotationDirection > 0) {
      this.rotation += Math.PI / 60;
    } else {
      this.rotation -= Math.PI / 60;
    }
  };
}

function Stage5BackgroundAsteroids(x, y) {
  this.x = x;
  this.y = y;
  this.draw = function(stage, gD) {
    gD.context.drawImage(stage.backgroundAsteroids, this.x, this.y);
  };
  this.newPos = function(game) {
    this.x += game.globalSpeed;
  };
}

function addAsteroid(stage, gD) {
  var direction = Math.floor(Math.random() * 3);
  for (var i = 0; i < 8; i++) {
    switch (direction) {
      case 0:
        stage.asteroidObjects.push(new Stage5Asteroid(Math.floor(Math.random() * -((gD.canvas.width / 4) - 20)) - 20, -((i + 1) * 20), gD.spriteDict["Asteroid1"][2], gD.spriteDict["Asteroid1"][3], direction, Math.floor(Math.random() * 2), Math.floor(Math.random() * 1.4) + 1));
        break;
      case 1:
        stage.asteroidObjects.push(new Stage5Asteroid(Math.floor(Math.random() * ((gD.canvas.width / 2) - 20)) + (gD.canvas.width / 4), -((i + 1) * 20), gD.spriteDict["Asteroid1"][2], gD.spriteDict["Asteroid1"][3], direction, Math.floor(Math.random() * 2), Math.floor(Math.random() * 1.4) + 1));
        break;
      case 2:
        stage.asteroidObjects.push(new Stage5Asteroid(Math.floor(Math.random() * ((gD.canvas.width / 4) - 20)) + gD.canvas.width, -((i + 1) * 20), gD.spriteDict["Asteroid1"][2], gD.spriteDict["Asteroid1"][3], direction, Math.floor(Math.random() * 2), Math.floor(Math.random() * 1.4) + 1));
        break;
      default:
        stage.asteroidObjects.push(new Stage5Asteroid(Math.floor(Math.random() * ((gD.canvas.width / 4) - 20)) + (gD.canvas.width / 4), -((i + 1) * 20), gD.spriteDict["Asteroid1"][2], gD.spriteDict["Asteroid1"][3], direction, Math.floor(Math.random() * 2), Math.floor(Math.random() * 1.4) + 1));
    }
  }
  stage.asteroidSpawnCounter = Math.max(Math.random() * (1000 - (stage.game.distanceTravelled - 0.005)), 600);
}

function addBackgroundAsteroids(stage, gD) {
  stage.backgroundAsteroidsObjects.push(new Stage5BackgroundAsteroids(gD.canvas.width + 10, Math.random() * (gD.canvas.height - stage.backgroundAsteroids.height)));
  stage.backgroundAsteroidsSpawnCounter = Math.max(Math.random() * 6000, 2000);
}

function updateStage5(game, stage) {
  if (game.itemsActive[5]) {
    stage.asteroidSpawnCounter -= 5;
    stage.backgroundAsteroidsSpawnCounter -= 5;
  } else if (game.itemsActive[0]) {
    stage.asteroidSpawnCounter -= 0.1;
    stage.backgroundAsteroidsSpawnCounter -= 0.1;
  } else {
    stage.asteroidSpawnCounter -= Math.floor(1 + (game.distanceTravelled * 0.00005));
    stage.backgroundAsteroidsSpawnCounter -= Math.floor(1 + (game.distanceTravelled * 0.00005));
  }

  if (stage.asteroidSpawnCounter <= 0) {
    addAsteroid(stage, game.gD);
  }
  if (stage.asteroidObjects[0] != undefined && stage.asteroidObjects[0].y > game.gD.canvas.height) {
    stage.asteroidObjects.shift();
  }

  if (stage.backgroundAsteroidsSpawnCounter <= 0) {
    addBackgroundAsteroids(stage, game.gD);
  }
  if (stage.backgroundAsteroidsObjects[0] != undefined && stage.backgroundAsteroidsObjects[0].x + stage.backgroundAsteroidsObjects[0].width < 0) {
    stage.backgroundAsteroidsObjects.shift();
  }

  for (var i = 0; i < stage.asteroidObjects.length; i++) {
    stage.asteroidObjects[i].newPos(game);
    if (game.player.collect(stage.asteroidObjects[i]) && !game.itemsActive[1] && !game.itemsActive[5]) {
      game.finish();
    }
  }

  for (var i = 0; i < stage.backgroundAsteroidsObjects.length; i++) {
    stage.backgroundAsteroidsObjects[i].newPos(game);
  }
}

function drawBackgroundStage5(game, stage, ghostFactor) {
  game.gD.context.drawImage(stage.universe, game.distanceTravelled % stage.universe.width, 0, stage.universe.width - (game.distanceTravelled % stage.universe.width), stage.universe.height, 
    0, 0, stage.universe.width - (game.distanceTravelled % stage.universe.width), stage.universe.height);
  game.gD.context.drawImage(stage.universe, 0, 0, game.distanceTravelled % stage.universe.width, stage.universe.height, 
    stage.universe.width - (game.distanceTravelled % stage.universe.width), 0, game.distanceTravelled % stage.universe.width, stage.universe.height);

  for (var i = 0; i < stage.backgroundAsteroidsObjects.length; i++) {
    stage.backgroundAsteroidsObjects[i].draw(stage, game.gD);
  }

  game.player.draw(game, game.gD, ghostFactor);

  for (var i = 0; i < stage.asteroidObjects.length; i++) {
    stage.asteroidObjects[i].draw(game.gD);
  }
}

function drawForegroundStage5(game, stage) {

}