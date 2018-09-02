function Menu(gD) {
  this.gD = gD;
  this.backgroundImage = new Image();
  this.backgroundImage.src = "img/Titlescreen.png";
  this.visible = false;
  this.init = function() {
    this.title = new Text(this.gD.canvas.width / 2, 100, "40pt", "Showcard Gothic", "rgba(200, 200, 200, 1)", "center", "middle", "Super Block Jump", 3);
    this.pressButton = new Text(this.gD.canvas.width / 2, 280, "15pt", "Showcard Gothic", "rgba(200, 200, 200, 1)", "center", "middle", "Dr" + String.fromCharCode(220) + "cke eine beliebige Taste", 1.5);
    this.version = new Text(this.gD.canvas.width - 5, this.gD.canvas.height - 5, "10pt", "Consolas", "rgba(255, 255, 255, 1)", "right", "alphabetic", "v2.6.5", 0);
    this.muteButton = new MuteButton(this.gD.canvas.width - 40, 10, 30, 30, "rgba(255, 255, 255, 1)", 2);

    this.buttons = [];
    this.buttons.push(new Button((this.gD.canvas.width / 2) - 203, 150, 406, 30, "15pt", "Showcard Gothic", "rgba(255, 255, 255, 1)", "Play", "rgba(0, 0, 0, .6)", 2));
    this.buttons.push(new Button((this.gD.canvas.width / 2) - 203, 186, 200, 30, "15pt", "Showcard Gothic", "rgba(255, 255, 255, 1)", "Shop", "rgba(0, 0, 0, .6)", 2));
    this.buttons.push(new Button((this.gD.canvas.width / 2) + 3, 186, 200, 30, "15pt", "Showcard Gothic", "rgba(255, 255, 255, 1)", "Achievements", "rgba(0, 0, 0, .6)", 2));
    this.buttons.push(new Button((this.gD.canvas.width / 2) - 203, 222, 200, 30, "15pt", "Showcard Gothic", "rgba(255, 255, 255, 1)", "Save", "rgba(0, 0, 0, .6)", 2));
    this.buttons.push(new Button((this.gD.canvas.width / 2) + 3, 222, 200, 30, "15pt", "Showcard Gothic", "rgba(255, 255, 255, 1)", "Load", "rgba(0, 0, 0, .6)", 2));
    this.buttons.push(new Button((this.gD.canvas.width / 2) - 203, 258, 200, 30, "15pt", "Showcard Gothic", "rgba(255, 255, 255, 1)", "Highscores", "rgba(0, 0, 0, .6)", 2));
    this.buttons.push(new Button((this.gD.canvas.width / 2) + 3, 258, 200, 30, "15pt", "Showcard Gothic", "rgba(255, 255, 255, 1)", "Controls", "rgba(0, 0, 0, .6)", 2));
    this.buttons.push(new Button((this.gD.canvas.width / 2) - 203, 294, 406, 30, "15pt", "Showcard Gothic", "rgba(255, 255, 255, 1)", "Exit", "rgba(0, 0, 0, .6)", 2));

    this.selected = 0;           //button that is selected
    this.buttons[this.selected].select();

    this.pressed = false;        //if a button was pressed at start

    this.selectionScreen = new SelectionScreen(this.gD, this);
    this.selectionScreen.init();
    this.game = new Game(this.gD, this);
    this.game.init();
    this.shop = new Shop(this.gD, this);
    this.shop.init();
    this.achievements = new Achievements(this.gD, this);
    this.achievements.init();
    this.save = new Save(this.gD, this);
    this.save.init();
    this.load = new Load(this.gD, this);
    this.load.init();
    this.highscores = new Highscores(this.gD, this);
    this.highscores.init();
    this.controls = new Controls(this.gD, this);
    this.controls.init();
    this.gD.gameIsRunning = true;
  };
  this.clear = function() {
    this.gD.context.clearRect(0, 0, this.gD.canvas.width, this.gD.canvas.height);
  };
  this.show = function() {
    this.visible = true;
    drawMenu(this);
  };
  this.stop = function() {
    this.visible = false;
  };
}

function MuteButton(x, y, width, height, color, bordersize) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.color = color;
  this.bordersize = bordersize;
  this.update = function(gD) {
    gD.context.fillStyle = this.color;
    gD.context.fillRect(this.x, this.y, this.width, this.height);
    gD.context.strokeStyle = "rgba(0, 0, 0, 1)";
    gD.context.lineWidth = this.bordersize;
    gD.context.strokeRect(this.x, this.y, this.width, this.height);
    gD.context.drawImage(gD.spritesheet, gD.spriteDict["Mute"][0], gD.spriteDict["Mute"][1], gD.spriteDict["Mute"][2], gD.spriteDict["Mute"][3],
      this.x + ((this.width - gD.spriteDict["Mute"][2]) / 2), this.y + ((this.height - gD.spriteDict["Mute"][3]) / 2), gD.spriteDict["Mute"][2], gD.spriteDict["Mute"][2]);
    if (gD.muted) {
      gD.context.beginPath();
      gD.context.moveTo(this.x, this.y + this.height);
      gD.context.lineTo(this.x + this.width, this.y);
      gD.context.stroke();
    }
  };
}

//active on Button down event, if menu is visible
function menuControlDown(menu, key) {
  if (!menu.pressed) {
    menu.pressed = true;
    drawMenu(menu);
  } else {
    if (menu.controls.keyBindings["Menu1"][2].includes(key)) {                     //navigation down
      switch (menu.selected) {
        case 1:
        case 2:
        case 3:
        case 4:
        case 5:
          menu.buttons[menu.selected].deselect();
          menu.buttons[menu.selected + 2].select();
          menu.selected += 2;
          break;
        default:
          menu.buttons[menu.selected].deselect();
          menu.buttons[(menu.selected + 1) % menu.buttons.length].select();
          menu.selected = (menu.selected + 1) % menu.buttons.length;
      }
    } else if (menu.controls.keyBindings["Menu2"][2].includes(key)) {              //navigation up
      switch (menu.selected) {
        case 2:
        case 3:
        case 4:
        case 5:
        case 6:
          menu.buttons[menu.selected].deselect();
          menu.buttons[menu.selected - 2].select();
          menu.selected -= 2;
          break;
        default:
          menu.buttons[menu.selected].deselect();
          menu.buttons[(menu.selected + menu.buttons.length - 1) % menu.buttons.length].select();
          menu.selected = (menu.selected + menu.buttons.length - 1) % menu.buttons.length;
      }
    } else if (menu.controls.keyBindings["Menu3"][2].includes(key) || menu.controls.keyBindings["Menu4"][2].includes(key)) {              //navigation right or left
      switch (menu.selected) {
        case 1:
        case 3:
        case 5:
          menu.buttons[menu.selected].deselect();
          menu.buttons[menu.selected + 1].select();
          menu.selected += 1;
          break;
        case 2:
        case 4:
        case 6:
          menu.buttons[menu.selected].deselect();
          menu.buttons[menu.selected - 1].select();
          menu.selected -= 1;
      }
    }

    if (menu.controls.keyBindings["Menu5"][2].includes(key)) {                                  //confirm
      switch (menu.selected) {
        case 0:
          menu.selectionScreen.show();
          menu.stop();
          break;
        case 1:
          menu.shop.show();
          menu.stop();
          break;
        case 2:
          menu.achievements.show();
          menu.stop();
          break;
        case 3:
          menu.save.show();
          menu.stop();
          break;
        case 4:
          menu.load.show();
          menu.stop();
          break;
        case 5:
          menu.highscores.show();
          menu.stop();
          break;
        case 6:
          menu.controls.show();
          menu.stop();
          break;
        default:
          menu.stop();
          menu.clear();
          document.getElementById("start").style.display = "inline-block";
      }
    } else {
      drawMenu(menu);
    }
  }
}

//active on Button up event, if menu is visible
function menuControlUp(menu, key) {

}

function menuMouseMove(menu) {
  for (var i = 0; i < menu.buttons.length; i++) {
    if (menu.gD.mousePos.x >= menu.buttons[i].x && menu.gD.mousePos.x <= menu.buttons[i].x + menu.buttons[i].width &&
        menu.gD.mousePos.y >= menu.buttons[i].y && menu.gD.mousePos.y <= menu.buttons[i].y + menu.buttons[i].height) {
      menu.buttons[menu.selected].deselect();
      menu.buttons[i].select();
      menu.selected = i;
      break;
    }
  }
  drawMenu(menu);
}

function menuClick(menu) {
  if (menu.pressed) {
    if (menu.gD.mousePos.x >= menu.buttons[menu.selected].x && menu.gD.mousePos.x <= menu.buttons[menu.selected].x + menu.buttons[menu.selected].width &&
        menu.gD.mousePos.y >= menu.buttons[menu.selected].y && menu.gD.mousePos.y <= menu.buttons[menu.selected].y + menu.buttons[menu.selected].height) {
      switch (menu.selected) {
        case 0:
          menu.selectionScreen.show();
          menu.stop();
          break;
        case 1:
          menu.shop.show();
          menu.stop();
          break;
        case 2:
          menu.achievements.show();
          menu.stop();
          break;
        case 3:
          menu.save.show();
          menu.stop();
          break;
        case 4:
          menu.load.show();
          menu.stop();
          break;
        case 5:
          menu.highscores.show();
          menu.stop();
          break;
        case 6:
          menu.controls.show();
          menu.stop();
          break;
        default:
          menu.stop();
          menu.clear();
          document.getElementById("start").style.display = "inline-block";
      }
    } else if (menu.gD.mousePos.x >= menu.muteButton.x && menu.gD.mousePos.x <= menu.muteButton.x + menu.muteButton.width &&
               menu.gD.mousePos.y >= menu.muteButton.y && menu.gD.mousePos.y <= menu.muteButton.y + menu.muteButton.height) {
      menu.gD.muted = !menu.gD.muted;
      drawMenu(menu);
    }
  }
}

function menuWheel(menu, event) {

}

function drawMenu(menu) {
  menu.clear();

  menu.gD.context.drawImage(menu.backgroundImage, 0, 0);

  menu.title.update(menu.gD);
  menu.version.update(menu.gD);

  if (!menu.pressed) {
    menu.pressButton.update(menu.gD);
  } else {
    for (var i = 0; i < menu.buttons.length; i++) {
      menu.buttons[i].update(menu.gD);
    }
    menu.muteButton.update(menu.gD);
  }
}