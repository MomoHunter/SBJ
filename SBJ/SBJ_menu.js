function Menu(gD) {
  this.gD = gD;
  this.backgroundImage = new Image();
  this.backgroundImage.src = "img/Titlescreen.png";
  this.visible = false;
  this.init = function() {
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

    this.title = new Text(this.gD.canvas.width / 2, 100, "40pt", "Showcard Gothic", "rgba(200, 200, 200, 1)", "center", "middle", "Super Block Jump", 3);
    this.pressButton = new Text(this.gD.canvas.width / 2, 280, "15pt", "Showcard Gothic", "rgba(200, 200, 200, 1)", "center", "middle", "Dr" + String.fromCharCode(220) + "cke eine beliebige Taste", 1.5);
    this.version = new Text(this.gD.canvas.width - 5, this.gD.canvas.height - 5, "10pt", "Consolas", "rgba(255, 255, 255, 1)", "right", "alphabetic", "v2.6.6", 0);
    this.muteButton = new MuteButton(this.gD.canvas.width - 40, 10, 30, 30, "rgba(255, 255, 255, 1)", 2);

    this.buttonStartTop = 150;
    this.buttonHeight = 30;
    this.buttonSingleWidth = 200;
    this.buttonPadding = 6;
    this.buttonStartLeft = (this.gD.canvas.width / 2) - this.buttonSingleWidth - this.buttonPadding / 2;
    this.buttonDoubleWidth = this.buttonSingleWidth * 2 + this.buttonPadding;

    this.buttonDefinitions = [
      [ { text: "Play", link: this.selectionScreen } ],
      [ { text: "Shop", link: this.shop }, { text: "Achievements", link: this.achievements } ],
      [ { text: "Save", link: this.save }, { text: "Load", link: this.load } ],
      [ { text: "Highscores", link: this.highscores }, { text: "Controls", link: this.controls } ],
      [ { text: "Exit", link: null } ]
    ];

    this.buttons = this.buttonDefinitions.map(function(rowButtons, rowIndex) {
      var buttonWidth = rowButtons.length === 1 ? this.buttonDoubleWidth : this.buttonSingleWidth;
      return rowButtons.map(function(button, columnIndex) {
        return new Button(
          this.buttonStartLeft + (buttonWidth + this.buttonPadding) * columnIndex,
          this.buttonStartTop + (this.buttonHeight + this.buttonPadding) * rowIndex,
          buttonWidth, this.buttonHeight,
          "15pt", "Showcard Gothic", "rgba(255, 255, 255, 1)",
          button.text,
          "rgba(0, 0, 0, .6)", 2
        );
      }, this);
    }, this);

    updateSelection(this, 0, 0);

    this.pressed = false;        // if a key was pressed at start

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


/**
 * called to update the current button selection
 * (deselects old selection and sets specified button as selected)
 */
function updateSelection(menu, rowIndex, columnIndex) {
  if (menu.selectedRowIndex !== undefined && menu.selectedColumnIndex !== undefined) {
    menu.buttons[menu.selectedRowIndex][menu.selectedColumnIndex].deselect();
  }

  menu.buttons[rowIndex][columnIndex].select();
  menu.selectedRowIndex = rowIndex;
  menu.selectedColumnIndex = columnIndex;
}

/**
 * called to trigger the specified link action
 */
function callSelectedLink(menu) {
  var link = menu.buttonDefinitions[menu.selectedRowIndex][menu.selectedColumnIndex].link;
  if (link === null) {  // this is the edge-case why this is encapsulated into this special function
    menu.stop();
    menu.clear();
    document.getElementById("start").style.display = "inline-block";
  } else {
    link.show();
    menu.stop();
  }
}


/**
 * active on Button down event, if menu is visible
 */
function menuControlDown(menu, key) {
  if (!menu.pressed) {
    menu.pressed = true;
    drawMenu(menu);
  } else {
    var rowIndex = menu.selectedRowIndex;
    var columnIndex = menu.selectedColumnIndex;
    if (menu.controls.keyBindings["Menu1"][2].includes(key)) {            // navigation down
      rowIndex = (rowIndex + 1) % menu.buttonDefinitions.length;
      if (menu.buttonDefinitions[rowIndex].length === 1) {
        columnIndex = 0;
      }
    } else if (menu.controls.keyBindings["Menu2"][2].includes(key)) {     // navigation up
      rowIndex -= 1;
      if (rowIndex < 0) {
        rowIndex = menu.buttonDefinitions.length - 1;
      }
      if (menu.buttonDefinitions[rowIndex].length === 1) {
        columnIndex = 0;
      }
    } else if (menu.controls.keyBindings["Menu3"][2].includes(key)) {     // navigation right
      columnIndex = (columnIndex + 1) % menu.buttonDefinitions[rowIndex].length;
    } else if (menu.controls.keyBindings["Menu4"][2].includes(key)) {     // navigation left
      columnIndex -= 1;
      if (columnIndex < 0) {
        columnIndex = menu.buttonDefinitions[rowIndex].length - 1;
      }
    }
    updateSelection(menu, rowIndex, columnIndex);

    if (menu.controls.keyBindings["Menu5"][2].includes(key)) {      // confirm
      callSelectedLink(menu);
    } else {
      drawMenu(menu);
    }
  }
}

/**
 * active on Button up event, if menu is visible
 */
function menuControlUp(menu, key) { /* unused */ }


function menuMouseMove(menu) {
  menu.buttons.map(function (buttonRow, rowIndex) {
    buttonRow.map(function(button, columnIndex) {
      if (
        menu.gD.mousePos.x >= button.x && menu.gD.mousePos.x <= button.x + button.width &&
        menu.gD.mousePos.y >= button.y && menu.gD.mousePos.y <= button.y + button.height
      ) {
        updateSelection(menu, rowIndex, columnIndex);
      }
    })
  });

  drawMenu(menu);
}

function menuClick(menu) {
  if (menu.pressed) {
    var selectedButton = menu.buttons[menu.selectedRowIndex][menu.selectedColumnIndex];
    if (
        menu.gD.mousePos.x >= selectedButton.x && menu.gD.mousePos.x <= selectedButton.x + selectedButton.width &&
        menu.gD.mousePos.y >= selectedButton.y && menu.gD.mousePos.y <= selectedButton.y + selectedButton.height
    ) { // = mouse over selected button
      callSelectedLink(menu);
    } else if (
        menu.gD.mousePos.x >= menu.muteButton.x && menu.gD.mousePos.x <= menu.muteButton.x + menu.muteButton.width &&
        menu.gD.mousePos.y >= menu.muteButton.y && menu.gD.mousePos.y <= menu.muteButton.y + menu.muteButton.height
    ) { // = mouse over mute button
      menu.gD.muted = !menu.gD.muted;
      drawMenu(menu);
    }
  }
}

function menuWheel(menu, event) { /* unused */ }

function drawMenu(menu) {
  menu.clear();

  menu.gD.context.drawImage(menu.backgroundImage, 0, 0);

  menu.title.update(menu.gD);
  menu.version.update(menu.gD);

  if (!menu.pressed) {
    menu.pressButton.update(menu.gD);
  } else {
    menu.buttons.map(function(row) {
      row.map(function(button) {
        button.update(menu.gD);
      });
    });
    menu.muteButton.update(menu.gD);
  }
}