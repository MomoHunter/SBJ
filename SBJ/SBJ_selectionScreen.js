function SelectionScreen(gD, menu) {
  this.gD = gD;
  this.menu = menu;
  this.backgroundImage = new Image();
  this.backgroundImage.src = "img/Titlescreen.png";
  this.visible = false;
  this.init = function() {
    this.title = new Text(this.gD.canvas.width / 2, 30, "32pt", "Showcard Gothic", "rgba(200, 200, 200, 1)", "center", "middle", "Select Your Character", 3);
    this.modal = new SelectionScreenModal(0, 0, this.gD.canvas.width, this.gD.canvas.height, "rgba(0, 0, 0, .5)");
    this.modal.images.push(new SelectionScreenImage(this.gD.canvas.width / 2 - 135, this.gD.canvas.height - 45, 30, 30, "Player1", ["Keine besonderen Fähigkeiten"], 2));
    this.modal.images.push(new SelectionScreenImage(this.gD.canvas.width / 2 - 95, this.gD.canvas.height - 45, 30, 30, "Player2", ["1.5x höhere Sprungkraft"], 2));
    this.modal.images.push(new SelectionScreenImage(this.gD.canvas.width / 2 - 55, this.gD.canvas.height - 45, 30, 30, "Player3", ["2x schnellere Bewegung"], 2));
    this.modal.images.push(new SelectionScreenImage(this.gD.canvas.width / 2 - 15, this.gD.canvas.height - 45, 30, 30, "Player4", ["Dreifach Sprung"], 2));
    this.modal.images.push(new SelectionScreenImage(this.gD.canvas.width / 2 + 25, this.gD.canvas.height - 45, 30, 30, "Player5", ["1.5x schnellere Bewegung", "1.2x höhere Sprungkraft"], 2));
    this.modal.images.push(new SelectionScreenImage(this.gD.canvas.width / 2 + 65, this.gD.canvas.height - 45, 30, 30, "Player6", ["Dreifach Sprung", "1.2x höhere Sprungkraft"], 2));
    this.modal.images.push(new SelectionScreenImage(this.gD.canvas.width / 2 + 105, this.gD.canvas.height - 45, 30, 30, "Player7", ["Startet mit 10 von jedem Item", "Dreifach Sprung", "1.5x schnellere Bewegung", "1.2x höhere Sprungkraft"], 2));

    this.modal.init();
  };
  this.clear = function() {
    this.gD.context.clearRect(0, 0, this.gD.canvas.width, this.gD.canvas.height);
  };
  this.show = function() {
    this.visible = true;
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
  this.images = [];
  this.selected = 0;
  this.showcase = new SelectionScreenShowcase(this.width / 2 - 30, this.height / 2 - 30, 60, 60);
  this.init = function() {
    if (this.images.length > 0) {
      this.images[this.selected].select();
    }
  };
  this.update = function(menu, gD) {
    gD.context.fillStyle = this.color;
    gD.context.fillRect(this.x, this.y, this.width, this.height);

    this.showcase.playerNr = (this.selected + 1);
    this.showcase.desc = this.images[this.selected].desc;

    this.showcase.update(menu.shop, gD);
    for (var i = 0; i < this.images.length; i++) {
      this.images[i].update(gD);
    }
  };
}

function SelectionScreenImage(x, y, width, height, name, desc, bordersize) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.name = name;
  this.desc = desc;
  this.bordersize = bordersize
  this.selected = false;
  this.select = function() {
    this.selected = true;
  };
  this.deselect = function() {
    this.selected = false;
  };
  this.update = function(gD) {
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
  this.playerNr = 1;
  this.desc = "";
  this.update = function(shop, gD) {
    gD.context.drawImage(gD.spritesheet, gD.spriteDict["Player" + this.playerNr + "B"][0], gD.spriteDict["Player" + this.playerNr + "B"][1], gD.spriteDict["Player" + this.playerNr + "B"][2], gD.spriteDict["Player" + this.playerNr + "B"][3],
      this.x + ((this.width - gD.spriteDict["Player" + this.playerNr + "B"][2]) / 2), this.y + ((this.height - gD.spriteDict["Player" + this.playerNr + "B"][3]) / 2), gD.spriteDict["Player" + this.playerNr + "B"][2], gD.spriteDict["Player" + this.playerNr + "B"][3]);
    gD.context.textAlign = "center";
    gD.context.textBaseline = "middle";
    gD.context.font = "13pt Consolas";
    gD.context.fillStyle = "rgba(255, 255, 255, 1)";
    for (var i = 0; i < this.desc.length; i++) {
      gD.context.fillText(this.desc[i], this.x + (this.width / 2), this.y + this.height + ((i + 1) * 20));
    }

    if (this.playerNr > 1 && !shop.gD.playerUnlocked[this.playerNr - 2]) {
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
  if (selectionScreen.menu.controls.keyBindings["SelectionScreen1"][2].includes(key)) {                       //navigation right
    selectionScreen.modal.images[selectionScreen.modal.selected].deselect();
    selectionScreen.modal.images[(selectionScreen.modal.selected + 1) % selectionScreen.modal.images.length].select();
    selectionScreen.modal.selected = (selectionScreen.modal.selected + 1) % selectionScreen.modal.images.length;
  } else if (selectionScreen.menu.controls.keyBindings["SelectionScreen2"][2].includes(key)) {                //navigation left
    selectionScreen.modal.images[selectionScreen.modal.selected].deselect();
    selectionScreen.modal.images[(selectionScreen.modal.selected + selectionScreen.modal.images.length - 1) % selectionScreen.modal.images.length].select();
    selectionScreen.modal.selected = (selectionScreen.modal.selected + selectionScreen.modal.images.length - 1) % selectionScreen.modal.images.length;
  }

  if (selectionScreen.menu.controls.keyBindings["SelectionScreen3"][2].includes(key)) {                                    //confirm
    if (selectionScreen.modal.selected == 0) {
      selectionScreen.menu.game.player.setPlayer(1, selectionScreen.menu.game, selectionScreen.gD);
      selectionScreen.menu.game.show();
      selectionScreen.stop();
    } else if (selectionScreen.gD.playerUnlocked[selectionScreen.modal.selected - 1]) {
      selectionScreen.menu.game.player.setPlayer(selectionScreen.modal.selected + 1, selectionScreen.menu.game, selectionScreen.gD);
      selectionScreen.menu.game.show();
      selectionScreen.stop();
    }
  } else {
    drawSelectionScreen(selectionScreen);
  }
}

function selectionScreenControlUp(selectionScreen, key) {

}

function drawSelectionScreen(selectionScreen) {
  selectionScreen.clear();

  selectionScreen.gD.context.drawImage(selectionScreen.backgroundImage, 0, 0);
  selectionScreen.modal.update(selectionScreen.menu, selectionScreen.gD);

  selectionScreen.title.update(selectionScreen.gD);
}