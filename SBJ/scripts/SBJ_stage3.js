function Stage3(game) {
  this.game = game;
  this.deadZoneGround = 0;
  this.ocean = new Image();
  this.ocean.src = "img/stage3Ocean.png"
  this.foregroundWaves = new Image();
  this.foregroundWaves.src = "img/stage3Waves.png";
  this.floorColor = "rgba(239, 217, 165, 1)";
  this.difficulty = 60;
  this.init = function() {
    this.birdObjects = [];
    this.fishObjects = [];
    this.jumpingFishObjects = [];
    this.bubbleSpotObjects = [];
    this.birdSpawnCounter = Math.max(Math.floor(Math.random() * 1000), 400);
    this.fishSpawnCounter = Math.max(Math.floor(Math.random() * 1000), 400);
    this.jumpingFishSpawnCounter = Math.max(Math.floor(Math.random() * 1000), 400);
    this.bubbleSpotSpawnCounter = Math.max(Math.floor(Math.random() * 1400), 300);
  };
}

function Stage3Bird(x, y, width, height, direction) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.direction = direction;
  this.draw = function(game, gD, ghostFactor) {
    if (this.direction > 0) {
      if ((game.distanceTravelled % 50) < 25) {
        gD.context.drawImage(gD.spritesheet, 
          gD.spriteDict["Bird2B"][0], gD.spriteDict["Bird2B"][1], gD.spriteDict["Bird2B"][2], gD.spriteDict["Bird2B"][3],
          this.x + (game.globalSpeed * this.direction * ghostFactor), this.y + 6, gD.spriteDict["Bird2B"][2], gD.spriteDict["Bird2B"][3]);
      } else {
        gD.context.drawImage(gD.spritesheet, 
          gD.spriteDict["Bird1B"][0], gD.spriteDict["Bird1B"][1], gD.spriteDict["Bird1B"][2], gD.spriteDict["Bird1B"][3],
          this.x + (game.globalSpeed * this.direction * ghostFactor), this.y, gD.spriteDict["Bird1B"][2], gD.spriteDict["Bird1B"][3]);
      }
    } else {
      if ((game.distanceTravelled % 50) < 25) {
        gD.context.drawImage(gD.spritesheet, 
          gD.spriteDict["Bird2F"][0], gD.spriteDict["Bird2F"][1], gD.spriteDict["Bird2F"][2], gD.spriteDict["Bird2F"][3],
          this.x + (game.globalSpeed * this.direction * ghostFactor), this.y + 6, gD.spriteDict["Bird2F"][2], gD.spriteDict["Bird2F"][3]);
      } else {
        gD.context.drawImage(gD.spritesheet, 
          gD.spriteDict["Bird1F"][0], gD.spriteDict["Bird1F"][1], gD.spriteDict["Bird1F"][2], gD.spriteDict["Bird1F"][3],
          this.x + (game.globalSpeed * this.direction * ghostFactor), this.y, gD.spriteDict["Bird1F"][2], gD.spriteDict["Bird1F"][3]);
      }
    }
  };
  this.newPos = function(game) {
    this.x += game.globalSpeed * 1.5 * this.direction;
  };
}

function Stage3Fish(x, y, width, height, fishNr) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.fishNr = fishNr;
  this.distanceTravelled = 0;
  this.radians = 0;
  this.draw = function(game, gD, ghostFactor) {
    gD.context.translate(this.x + (this.width / 2), this.y + (this.height / 2));
    gD.context.rotate(this.radians);
    gD.context.drawImage(gD.spritesheet, gD.spriteDict["Fish" + this.fishNr][0], gD.spriteDict["Fish" + this.fishNr][1], gD.spriteDict["Fish" + this.fishNr][2], gD.spriteDict["Fish" + this.fishNr][3],
      -(this.width / 2) + (game.globalSpeed * ghostFactor), -(this.height / 2) + (Math.sin((this.distanceTravelled - (game.globalSpeed * ghostFactor)) / 45) / 3), gD.spriteDict["Fish" + this.fishNr][2], gD.spriteDict["Fish" + this.fishNr][3]);
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

function Stage3BubbleSpot(x, y, width, height) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.bubbles = [];
  this.draw = function(game, gD, ghostFactor) {
    for (var i = 0; i < this.bubbles.length; i++) {
      this.bubbles[i].draw(game, gD, ghostFactor);
    }
  };
  this.newPos = function(game, gD) {
    this.x += game.globalSpeed;
    for (var i = 0; i < this.bubbles.length; i++) {
      this.bubbles[i].newPos(game);
    }
    this.newBubble(gD);
  };
  this.newBubble = function(gD) {
    var random = Math.random();
    if (random >= 0.65) {
      random = Math.floor(Math.random() * 2.999) + 1;
      this.bubbles.push(new Stage3Bubble(this.x + (Math.random() * this.width), this.y, gD.spriteDict["Bubble" + random][2], gD.spriteDict["Bubble" + random][3], random));
    }
  };
}

function Stage3Bubble(x, y, width, height, bubbleNr) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.bubbleNr = bubbleNr;
  this.draw = function(game, gD, ghostFactor) {
    var movement = 0;
    switch (this.bubbleNr) {
      case 1:
        movement = 0.7;
        break;
      case 2:
        movement = 1.3;
        break;
      case 3:
        movement = 2;
        break;
      default:
        movement = 2;
    }
    gD.context.drawImage(gD.spritesheet, gD.spriteDict["Bubble" + bubbleNr][0], gD.spriteDict["Bubble" + bubbleNr][1], gD.spriteDict["Bubble" + bubbleNr][2], gD.spriteDict["Bubble" + bubbleNr][3],
      this.x + (game.globalSpeed * ghostFactor), this.y - (movement * ghostFactor), this.width, this.height);
  };
  this.newPos = function(game) {
    switch (this.bubbleNr) {
      case 1:
        this.y -= 0.7;
        break;
      case 2:
        this.y -= 1.3;
        break;
      case 3:
        this.y -= 2;
        break;
      default:
        this.y -= 2;
    }
    this.x += game.globalSpeed;
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