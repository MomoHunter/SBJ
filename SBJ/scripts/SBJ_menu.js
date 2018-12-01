function Menu(gD) {
  this.gD = gD;
  /**
   * initiates the menu object
   */
  this.init = function() {
    this.backgroundImage = new Image();
    this.backgroundImage.src = 'img/Titlescreen.png';
    /*this.selectionScreen = new SelectionScreen(this.gD, this);
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
    this.highscores.init();*/
    this.controls = new Controls(this.gD, this);
    this.controls.init();
    /*this.saveLoad = new SaveLoad(this.gD, this);
    this.saveLoad.init();*/

    this.title = new Text(this.gD.canvas.width / 2, 100, "40pt", "Showcard Gothic, Impact", "rgba(200, 200, 200, 1)", "center", "middle", "Super Block Jump", 3);
    this.version = new Text(this.gD.canvas.width - 5, this.gD.canvas.height - 5, "10pt", "Consolas", "rgba(255, 255, 255, 1)", "right", "alphabetic", "v3.0.0", 0);
    this.pressButton = new Text(this.gD.canvas.width / 2, 280, "15pt", "Showcard Gothic, Impact", "rgba(200, 200, 200, 1)", "center", "middle", "Dr" + String.fromCharCode(220) + "cke eine beliebige Taste", 1.5);
    this.muteButton = new MenuMuteButton(this.gD.canvas.width - 40, 10, 30, 30, "rgba(255, 255, 255, 1)", 2);

    this.buttonStartTop = 150;
    this.buttonHeight = 30;
    this.buttonFullWidth = 300;
    this.buttonPadding = 6;
    this.buttonStartLeft = (this.gD.canvas.width / 2) - (this.buttonFullWidth / 2);

    this.buttonDefinitions = [
      [ { text: "Play", link: this.selectionScreen } ],
      [ { text: "Shop", link: this.shop } ], //{ text: "Controls", link: this.controls } ],
      [ { text: "Save / Load", link: this.saveLoad } ], //{ text: "Load", link: this.load } ],
      [ { text: "Controls", link: this.controls } ], //{ text: "Achievements", link: this.achievements }, { text: "Statistics", link: this.statistics } ],
      [ { text: "Exit", link: null } ]
    ];

    this.buttons = this.buttonDefinitions.map((rowButtons, rowIndex) => {
      var buttonWidth = (this.buttonFullWidth - (rowButtons.length - 1) * this.buttonPadding) / rowButtons.length;
      return rowButtons.map((button, columnIndex) => {
        return new MenuButton(
          this.buttonStartLeft + (buttonWidth + this.buttonPadding) * columnIndex,
          this.buttonStartTop + (this.buttonHeight + this.buttonPadding) * rowIndex,
          buttonWidth, this.buttonHeight,
          "15pt", "Showcard Gothic, Impact", "rgba(255, 255, 255, 1)",
          button.text,
          "rgba(0, 0, 0, .6)", 2
        );
      }, this);
    }, this);

    updateSelection(this, 0, 0);

    this.closedTitlescreen = false;        // if a key was pressed at start to close the tile-screen
  };
  /**
   * checks if a button is pressed
   */
  this.updateKeyPresses = function() {
    if (!this.closedTitlescreen) {
      if (this.gD.newKeys.length > 0) {
        this.closedTitlescreen = true;
      }
      return
    }

    var keyB = this.controls.keyBindings;
    var rowIndex = this.selectedRowIndex;
    var columnIndex = this.selectedColumnIndex;

    this.gD.newKeys.map(key => {
      if (keyB.get("Menu_NavDown")[2].includes(key)) {
        rowIndex = (rowIndex + 1) % this.buttonDefinitions.length;
        if (this.buttonDefinitions[rowIndex].length === 1) {
          columnIndex = 0;
        }
      } else if (keyB.get("Menu_NavUp")[2].includes(key)) {
        rowIndex -= 1;
        if (rowIndex < 0) {
          rowIndex = this.buttonDefinitions.length - 1;
        }
        if (this.buttonDefinitions[rowIndex].length === 1) {
          columnIndex = 0;
        }
      } else if (keyB.get("Menu_NavRight")[2].includes(key)) {
        columnIndex = (columnIndex + 1) % this.buttonDefinitions[rowIndex].length;
      } else if (keyB.get("Menu_NavLeft")[2].includes(key)) {
        columnIndex -= 1;
        if (columnIndex < 0) {
          columnIndex = this.buttonDefinitions[rowIndex].length - 1;
        }
      }

      updateSelection(this, rowIndex, columnIndex);

      if (keyB.get("Menu_Confirm")[2].includes(key)) {
        callSelectedLink(this, this.gD);
      }
    });
  };
  /**
   * checks if the mouse was moved
   */
  this.updateMouseMoves = function() {
    this.buttons.map((buttonRow, rowIndex) => {
      buttonRow.map((button, columnIndex) => {
        if (this.gD.mousePos.x >= button.x && this.gD.mousePos.x <= button.x + button.width &&
            this.gD.mousePos.y >= button.y && this.gD.mousePos.y <= button.y + button.height) {
          updateSelection(this, rowIndex, columnIndex);
        }
      }, this);
    }, this);
  };
  /**
   * checks if there was a click
   */
  this.updateClicks = function() {
    var clickPos = this.gD.clicks.pop();
    if (!clickPos) {
      return
    }

    if (!this.closedTitlescreen) {
      this.closedTitlescreen = true;
    } else {
      var selectedButton = this.buttons[this.selectedRowIndex][this.selectedColumnIndex];
      if (clickPos.x >= selectedButton.x && clickPos.x <= selectedButton.x + selectedButton.width &&
          clickPos.y >= selectedButton.y && clickPos.y <= selectedButton.y + selectedButton.height) { // = mouse over selected button
        callSelectedLink(this, this.gD);
      } else if (clickPos.x >= this.muteButton.x && clickPos.x <= this.muteButton.x + this.muteButton.width &&
                 clickPos.y >= this.muteButton.y && clickPos.y <= this.muteButton.y + this.muteButton.height) { // = mouse over mute button
        this.gD.muted = !this.gD.muted;
      }
    }
  };
  /**
   * checks if the wheel was moved
   */
  this.updateWheelMoves = function() {
    /* unused */
  };
  /**
   * updates moving objects in menu
   */
  this.update = function() {
    /* unused */
  };
  /**
   * draws the menu onto the canvas
   */
  this.draw = function(ghostFactor) {
    this.gD.context.drawImage(this.backgroundImage, 0, 0);

    this.title.draw(this.gD);
    this.version.draw(this.gD);

    if (!this.closedTitlescreen) {
      this.pressButton.draw(this.gD);
    } else {
      this.buttons.map(row => {
        row.map(button => {
          button.draw(this.gD);
        }, this);
      }, this);
      this.muteButton.draw(this.gD);
    }
  };
}


function MenuMuteButton(x, y, width, height, color, bordersize) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.color = color;
  this.bordersize = bordersize;
  this.strokeStyle = "rgba(0, 0, 0, 1)";
  this.draw = function(gD) {
    var spriteRef = gD.spriteDict["Icon_Mute"];
    gD.context.fillStyle = this.color;
    gD.context.fillRect(this.x, this.y, this.width, this.height);
    gD.context.drawImage(gD.spritesheet, spriteRef[0], spriteRef[1], spriteRef[2], spriteRef[3],
      this.x + ((this.width - spriteRef[2]) / 2), this.y + ((this.height - spriteRef[3]) / 2), spriteRef[2], spriteRef[3]);
    gD.context.strokeStyle = this.strokeStle;
    gD.context.lineWidth = this.bordersize;
    gD.context.strokeRect(this.x, this.y, this.width, this.height);
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
function callSelectedLink(menu, gD) {
  var link = menu.buttonDefinitions[menu.selectedRowIndex][menu.selectedColumnIndex].link;
  if (link === null) {  // this is the edge-case why this is encapsulated into this special function
    window.close();
  } else {
    gD.currentPage = link;
  }
}