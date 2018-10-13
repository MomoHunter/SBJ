function SelectionScreen(gD, menu) {
  this.gD = gD;
  this.menu = menu;
  this.backgroundImage = new Image();
  this.backgroundImage.src = "img/Titlescreen.png";
  this.visible = false;
  this.page = 1;
  this.init = function() {
    this.title = new Text(this.gD.canvas.width / 2, 30, "32pt", "Showcard Gothic", "rgba(200, 200, 200, 1)", "center", "middle", "Select Your Character", 3);
    this.modal = new SelectionScreenModal(0, 0, this.gD.canvas.width, this.gD.canvas.height, "rgba(0, 0, 0, .5)");
    this.modal.player.push(new SelectionScreenImage(this.gD.canvas.width / 2 - 135, this.gD.canvas.height - 45, 30, 30, "Player1", 1, [], ["Doppel Sprung"], 2));
    this.modal.player.push(new SelectionScreenImage(this.gD.canvas.width / 2 - 95, this.gD.canvas.height - 45, 30, 30, "Player2", 2, ["Freischaltbar im Shop"], ["Doppel Sprung", "1.5x höhere Sprungkraft"], 2));
    this.modal.player.push(new SelectionScreenImage(this.gD.canvas.width / 2 - 55, this.gD.canvas.height - 45, 30, 30, "Player3", 3, ["Freischaltbar im Shop"], ["Doppel Sprung", "2x schnellere Bewegung"], 2));
    this.modal.player.push(new SelectionScreenImage(this.gD.canvas.width / 2 - 15, this.gD.canvas.height - 45, 30, 30, "Player4", 4, ["Freischaltbar im Shop"], ["Dreifach Sprung"], 2));
    this.modal.player.push(new SelectionScreenImage(this.gD.canvas.width / 2 + 25, this.gD.canvas.height - 45, 30, 30, "Player5", 5, ["Freischaltbar durch Achievement 'Ein neuer PC'"], ["Doppel Sprung", "1.5x schnellere Bewegung", "1.2x höhere Sprungkraft"], 2));
    this.modal.player.push(new SelectionScreenImage(this.gD.canvas.width / 2 + 65, this.gD.canvas.height - 45, 30, 30, "Player6", 6, ["Freischaltbar durch Achievement 'Ausdauerprofi'"], ["Dreifach Sprung", "1.2x höhere Sprungkraft"], 2));
    this.modal.player.push(new SelectionScreenImage(this.gD.canvas.width / 2 + 105, this.gD.canvas.height - 45, 30, 30, "Player7", 7, ["Freischaltbar durch Achievement 'Achievementhunter'"], ["Startet mit 10 von jedem Item", "Dreifach Sprung", "1.5x schnellere Bewegung", "1.2x höhere Sprungkraft"], 2));

    this.modal.stages.push(new SelectionScreenImage(this.gD.canvas.width / 2 - 205, this.gD.canvas.height - 45, 60, 30, "Stage0", 0, [], ["Standard", "Schwierigkeit: leicht"], 2));
    this.modal.stages.push(new SelectionScreenImage(this.gD.canvas.width / 2 - 135, this.gD.canvas.height - 45, 60, 30, "Stage1", 1, ["Freischaltbar durch 1000m in 'Standard'-Stage"], ["Festung", "Schwierigkeit: mittel"], 2));
    this.modal.stages.push(new SelectionScreenImage(this.gD.canvas.width / 2 - 65, this.gD.canvas.height - 45, 60, 30, "Stage2", 2, ["Freischaltbar durch 1300m in 'Festung'-Stage"], ["Luft", "Schwierigkeit: mittel"], 2));
    this.modal.stages.push(new SelectionScreenImage(this.gD.canvas.width / 2 + 5, this.gD.canvas.height - 45, 60, 30, "Stage3", 3, ["Freischaltbar durch 1600m in 'Luft'-Stage"], ["Wasser", "Schwierigkeit: schwer"], 2));
    this.modal.stages.push(new SelectionScreenImage(this.gD.canvas.width / 2 + 75, this.gD.canvas.height - 45, 60, 30, "Stage4", 4, ["Freischaltbar durch 1900m in 'Wasser'-Stage"], ["Wald", "Schwierigkeit: mittel"], 2));
    this.modal.stages.push(new SelectionScreenImage(this.gD.canvas.width / 2 + 145, this.gD.canvas.height - 45, 60, 30, "Stage5", 5, ["Freischaltbar durch 2200m in 'Wald'-Stage"], ["All", "Schwierigkeit: schwer"], 2));

    this.modal.init();
  };
  this.clear = function() {
    this.gD.context.clearRect(0, 0, this.gD.canvas.width, this.gD.canvas.height);
  };
  this.show = function() {
    this.visible = true;
    this.page = 1;
    drawSelectionScreen(this);
  };
  this.stop = function() {
    this.visible = false;
  };
}

function SelectionScreenModal(x, y, width, height, color) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.color = color;
  this.player = [];
  this.stages = [];
  this.playerSelected = 0;
  this.stageSelected = 0;
  this.showcase = new SelectionScreenShowcase(this.width / 2 - 60, this.height / 2 - 30, 120, 60);
  this.init = function() {
    if (this.player.length > 0) {
      this.player[this.playerSelected].select();
    }
    if (this.stages.length > 0) {
      this.stages[this.stageSelected].select();
    }
  };
  this.draw = function(selectionScreen, gD) {
    gD.context.fillStyle = this.color;
    gD.context.fillRect(this.x, this.y, this.width, this.height);

    switch (selectionScreen.page) {
      case 1:
        this.showcase.imageName = this.player[this.playerSelected].name + "B";
        this.showcase.imageNr = this.player[this.playerSelected].nr;
        this.showcase.descOver = this.player[this.playerSelected].descOver;
        this.showcase.descBelow = this.player[this.playerSelected].descBelow;
        break;
      case 2:
        this.showcase.imageName = this.stages[this.stageSelected].name + "B";
        this.showcase.imageNr = this.stages[this.stageSelected].nr;
        this.showcase.descOver = this.stages[this.stageSelected].descOver;
        this.showcase.descBelow = this.stages[this.stageSelected].descBelow;
        break;
      default:
    }

    this.showcase.draw(selectionScreen, gD);
    if (selectionScreen.page == 1) {
      for (var i = 0; i < this.player.length; i++) {
        this.player[i].draw(gD);
      }
    } else if (selectionScreen.page == 2) {
      for (var i = 0; i < this.stages.length; i++) {
        this.stages[i].draw(gD);
      }
    }
  };
}

function SelectionScreenImage(x, y, width, height, name, nr, descOver, descBelow, bordersize) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.name = name;
  this.nr = nr;
  this.descOver = descOver;
  this.descBelow = descBelow;
  this.bordersize = bordersize;
  this.selected = false;
  this.select = function() {
    this.selected = true;
  };
  this.deselect = function() {
    this.selected = false;
  };
  this.draw = function(gD) {
    if (this.selected) {
      gD.context.strokeStyle = "rgba(180, 50, 50, 1)";
      gD.context.lineWidth = this.bordersize;
      gD.context.strokeRect(this.x, this.y, this.width, this.height);
    }
    gD.context.drawImage(gD.spritesheet, gD.spriteDict[this.name][0], gD.spriteDict[this.name][1], gD.spriteDict[this.name][2], gD.spriteDict[this.name][3],
      this.x + Math.floor((this.width - gD.spriteDict[this.name][2]) / 2), this.y + Math.floor((this.height - gD.spriteDict[this.name][3]) / 2), gD.spriteDict[this.name][2], gD.spriteDict[this.name][3]);
  };
}

function SelectionScreenShowcase(x, y, width, height) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.imageName = "";
  this.imageNr = 1;         //is the number, that is inside the imageName
  this.descOver = [""];
  this.descBelow = [""];
  this.draw = function(selectionScreen, gD) {
    gD.context.drawImage(gD.spritesheet, gD.spriteDict[this.imageName][0], gD.spriteDict[this.imageName][1], gD.spriteDict[this.imageName][2], gD.spriteDict[this.imageName][3],
      this.x + ((this.width - gD.spriteDict[this.imageName][2]) / 2), this.y + ((this.height - gD.spriteDict[this.imageName][3]) / 2), gD.spriteDict[this.imageName][2], gD.spriteDict[this.imageName][3]);
    gD.context.textAlign = "center";
    gD.context.textBaseline = "middle";
    gD.context.font = "13pt Consolas";
    gD.context.fillStyle = "rgba(255, 255, 255, 1)";
    for (var i = 0; i < this.descOver.length; i++) {
      gD.context.fillText(this.descOver[i], this.x + (this.width / 2), this.y - 40 + (i * 20));
    }
    for (var i = 0; i < this.descBelow.length; i++) {
      gD.context.fillText(this.descBelow[i], this.x + (this.width / 2), this.y + this.height + ((i + 1) * 20));
    }

    if (
      (selectionScreen.page == 1 && this.imageNr > 1 && !gD.playerUnlocked[this.imageNr - 2])
      ||
      (selectionScreen.page == 2 && this.imageNr > 0 && !gD.stagesUnlocked[this.imageNr - 1])
    ) {
      gD.context.translate(this.x + (this.width / 2), this.y + (this.height / 2));
      gD.context.rotate(-20 * Math.PI / 180);
      gD.context.textAlign = "center";
      gD.context.textBaseline = "middle";
      gD.context.font = "20pt Stencil";
      gD.context.fillStyle = "rgba(255, 0, 0, 1)";
      gD.context.fillText("Gesperrt!", 0, 0);
      gD.context.strokeStyle = "rgba(0, 0, 0, 1)";
      gD.context.lineWidth = 1;
      gD.context.strokeText("Gesperrt!", 0, 0);
      gD.context.rotate(20 * Math.PI / 180);
      gD.context.translate(-(this.x + (this.width / 2)), -(this.y + (this.height / 2)));
    }
  };
}

function selectionScreenControlDown(selectionScreen, key) {
  if (selectionScreen.page == 1) {
    if (selectionScreen.menu.controls.keyBindings["SelectionScreen1"][2].includes(key)) {
      selectionScreen.modal.player[selectionScreen.modal.playerSelected].deselect();
      selectionScreen.modal.player[(selectionScreen.modal.playerSelected + 1) % selectionScreen.modal.player.length].select();
      selectionScreen.modal.playerSelected = (selectionScreen.modal.playerSelected + 1) % selectionScreen.modal.player.length;
    } else if (selectionScreen.menu.controls.keyBindings["SelectionScreen2"][2].includes(key)) {
      selectionScreen.modal.player[selectionScreen.modal.playerSelected].deselect();
      selectionScreen.modal.player[(selectionScreen.modal.playerSelected + selectionScreen.modal.player.length - 1) % selectionScreen.modal.player.length].select();
      selectionScreen.modal.playerSelected = (selectionScreen.modal.playerSelected + selectionScreen.modal.player.length - 1) % selectionScreen.modal.player.length;
    }

    if (selectionScreen.menu.controls.keyBindings["SelectionScreen3"][2].includes(key)) {
      if (selectionScreen.modal.playerSelected == 0) {
        selectionScreen.page++;
      } else if (selectionScreen.gD.playerUnlocked[selectionScreen.modal.playerSelected - 1]) {
        selectionScreen.page++;
      }
      drawSelectionScreen(selectionScreen);
    } else if (selectionScreen.menu.controls.keyBindings["SelectionScreen4"][2].includes(key)) {
      selectionScreen.menu.show();
      selectionScreen.stop();
    } else {
      drawSelectionScreen(selectionScreen);
    }
  } else if (selectionScreen.page == 2) {
    if (selectionScreen.menu.controls.keyBindings["SelectionScreen1"][2].includes(key)) {
      selectionScreen.modal.stages[selectionScreen.modal.stageSelected].deselect();
      selectionScreen.modal.stages[(selectionScreen.modal.stageSelected + 1) % selectionScreen.modal.stages.length].select();
      selectionScreen.modal.stageSelected = (selectionScreen.modal.stageSelected + 1) % selectionScreen.modal.stages.length;
    } else if (selectionScreen.menu.controls.keyBindings["SelectionScreen2"][2].includes(key)) {
      selectionScreen.modal.stages[selectionScreen.modal.stageSelected].deselect();
      selectionScreen.modal.stages[(selectionScreen.modal.stageSelected + selectionScreen.modal.stages.length - 1) % selectionScreen.modal.stages.length].select();
      selectionScreen.modal.stageSelected = (selectionScreen.modal.stageSelected + selectionScreen.modal.stages.length - 1) % selectionScreen.modal.stages.length;
    }

    if (selectionScreen.menu.controls.keyBindings["SelectionScreen3"][2].includes(key)) {
      if (selectionScreen.modal.stageSelected == 0) {
        selectionScreen.menu.game.player.setPlayer(selectionScreen.modal.playerSelected + 1, selectionScreen.menu.game, selectionScreen.gD);
        selectionScreen.menu.game.setStage(selectionScreen.modal.stageSelected);
        selectionScreen.menu.game.show();
        selectionScreen.stop();
      } else if (selectionScreen.gD.stagesUnlocked[selectionScreen.modal.stageSelected - 1]) {
        selectionScreen.menu.game.player.setPlayer(selectionScreen.modal.playerSelected + 1, selectionScreen.menu.game, selectionScreen.gD);
        selectionScreen.menu.game.setStage(selectionScreen.modal.stageSelected);
        selectionScreen.menu.game.show();
        selectionScreen.stop();
      }
    } else if (selectionScreen.menu.controls.keyBindings["SelectionScreen4"][2].includes(key)) {
      selectionScreen.menu.show();
      selectionScreen.stop();
    } else {
      drawSelectionScreen(selectionScreen);
    }
  }
}

function selectionScreenControlUp(selectionScreen, key) {

}

function selectionScreenMouseMove(selectionScreen) {
  if (selectionScreen.page == 1) {
    for (var i = 0; i < selectionScreen.modal.player.length; i++) {
      if (selectionScreen.gD.mousePos.x >= selectionScreen.modal.player[i].x && selectionScreen.gD.mousePos.x <= selectionScreen.modal.player[i].x + selectionScreen.modal.player[i].width &&
          selectionScreen.gD.mousePos.y >= selectionScreen.modal.player[i].y && selectionScreen.gD.mousePos.y <= selectionScreen.modal.player[i].y + selectionScreen.modal.player[i].height) {
        selectionScreen.modal.player[selectionScreen.modal.playerSelected].deselect();
        selectionScreen.modal.player[i].select();
        selectionScreen.modal.playerSelected = i;
        break;
      }
    }
  } else if (selectionScreen.page == 2) {
    for (var i = 0; i < selectionScreen.modal.stages.length; i++) {
      if (selectionScreen.gD.mousePos.x >= selectionScreen.modal.stages[i].x && selectionScreen.gD.mousePos.x <= selectionScreen.modal.stages[i].x + selectionScreen.modal.stages[i].width &&
          selectionScreen.gD.mousePos.y >= selectionScreen.modal.stages[i].y && selectionScreen.gD.mousePos.y <= selectionScreen.modal.stages[i].y + selectionScreen.modal.stages[i].height) {
        selectionScreen.modal.stages[selectionScreen.modal.stageSelected].deselect();
        selectionScreen.modal.stages[i].select();
        selectionScreen.modal.stageSelected = i;
        break;
      }
    }
  }
  drawSelectionScreen(selectionScreen);
}

function selectionScreenClick(selectionScreen) {
  if (selectionScreen.page == 1) {
    if (selectionScreen.gD.mousePos.x >= selectionScreen.modal.player[selectionScreen.modal.playerSelected].x && selectionScreen.gD.mousePos.x <= selectionScreen.modal.player[selectionScreen.modal.playerSelected].x + selectionScreen.modal.player[selectionScreen.modal.playerSelected].width &&
        selectionScreen.gD.mousePos.y >= selectionScreen.modal.player[selectionScreen.modal.playerSelected].y && selectionScreen.gD.mousePos.y <= selectionScreen.modal.player[selectionScreen.modal.playerSelected].y + selectionScreen.modal.player[selectionScreen.modal.playerSelected].height) {
      if (selectionScreen.modal.playerSelected == 0) {
        selectionScreen.page++;
      } else if (selectionScreen.gD.playerUnlocked[selectionScreen.modal.playerSelected - 1]) {
        selectionScreen.page++;
      }
    }
    drawSelectionScreen(selectionScreen);
  } else if (selectionScreen.page == 2) {
    if (selectionScreen.gD.mousePos.x >= selectionScreen.modal.stages[selectionScreen.modal.stageSelected].x && selectionScreen.gD.mousePos.x <= selectionScreen.modal.stages[selectionScreen.modal.stageSelected].x + selectionScreen.modal.stages[selectionScreen.modal.stageSelected].width &&
        selectionScreen.gD.mousePos.y >= selectionScreen.modal.stages[selectionScreen.modal.stageSelected].y && selectionScreen.gD.mousePos.y <= selectionScreen.modal.stages[selectionScreen.modal.stageSelected].y + selectionScreen.modal.stages[selectionScreen.modal.stageSelected].height) {
      if (selectionScreen.modal.stageSelected == 0) {
        selectionScreen.menu.game.player.setPlayer(selectionScreen.modal.playerSelected + 1, selectionScreen.menu.game, selectionScreen.gD);
        selectionScreen.menu.game.setStage(selectionScreen.modal.stageSelected);
        selectionScreen.menu.game.show();
        selectionScreen.stop();
      } else if (selectionScreen.gD.stagesUnlocked[selectionScreen.modal.stageSelected - 1]) {
        selectionScreen.menu.game.player.setPlayer(selectionScreen.modal.playerSelected + 1, selectionScreen.menu.game, selectionScreen.gD);
        selectionScreen.menu.game.setStage(selectionScreen.modal.stageSelected);
        selectionScreen.menu.game.show();
        selectionScreen.stop();
      }
    }
  }
}

function selectionScreenWheel(selectionScreen, event) {

}

function drawSelectionScreen(selectionScreen) {
  selectionScreen.clear();

  selectionScreen.gD.context.drawImage(selectionScreen.backgroundImage, 0, 0);
  selectionScreen.modal.draw(selectionScreen, selectionScreen.gD);

  selectionScreen.title.draw(selectionScreen.gD);
}