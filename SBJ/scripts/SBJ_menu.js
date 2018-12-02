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
    this.shop.init();*/
    this.achievements = new Achievements(this.gD, this);
    this.achievements.init();
    /*this.save = new Save(this.gD, this);
    this.save.init();
    this.load = new Load(this.gD, this);
    this.load.init();
    this.highscores = new Highscores(this.gD, this);
    this.highscores.init();*/
    this.controls = new Controls(this.gD, this);
    this.controls.init();
    this.saveLoad = new SaveLoad(this.gD, this);
    this.saveLoad.init();

    this.title = new CanvasText(this.gD.canvas.width / 2, 100, "Super Block Jump", "title");
    this.version = new CanvasText(this.gD.canvas.width - 5, this.gD.canvas.height - 5, "v3.0.0", "version");
    this.pressButton = new CanvasText(this.gD.canvas.width / 2, 280, "Dr" + String.fromCharCode(220) + "cke eine beliebige Taste", "instruction");

    this.buttonStartTop = 150;
    this.buttonHeight = 30;
    this.buttonFullWidth = 300;
    this.buttonPadding = 6;
    this.buttonStartLeft = (this.gD.canvas.width / 2) - (this.buttonFullWidth / 2);

    var buttonDefinitions = [
      [
        {
          text: "Play", link: (gD) => { gD.currentPage = this.selectionScreen }
        }
      ],
      [
        {
          text: "Shop", link: (gD) => { gD.currentPage = this.shop }
        }
      ],
      [
        {
          text: "Achievements", link: (gD) => { gD.currentPage = this.achievements }
        }
        //{ text: "Load", link: (gD) => { gD.currentPage = this.load }}
      ],
      [
        {
          text: "Controls", link: (gD) => { gD.currentPage = this.controls }
        },
        {
          text: "Save / Load", link: (gD) => {gD.currentPage = this.saveLoad }
        }
        //{ text: "Statistics", link: (gD) => { gD.currentPage = this.statistics }}
      ],
      [
        {
          text: "Exit", link: (gD) => { window.close() }
        }
      ]
    ];

    var buttons = buttonDefinitions.map((rowButtons, rowIndex) => {
      var buttonWidth = (this.buttonFullWidth - (rowButtons.length - 1) * this.buttonPadding) / rowButtons.length;
      return rowButtons.map((button, columnIndex) => {
        return new MenuTextButton(this.buttonStartLeft + (buttonWidth + this.buttonPadding) * columnIndex, this.buttonStartTop + (this.buttonHeight + this.buttonPadding) * rowIndex, buttonWidth, this.buttonHeight, button.text, button.link);
      }, this);
    }, this);

    this.muteButton = new MenuImageButton(
      this.gD.canvas.width - 40, 10, 30, 30, "Icon_Mute",
      gD => { gD.muted = !gD.muted }
    );

    this.menuController = new MenuController();
    this.menuController.init(buttons, this.controls);

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
    } else {
      this.menuController.updateKeyPresses(this.gD);
    }
  };
  /**
   * checks if the mouse was moved
   */
  this.updateMouseMoves = function() {
    this.menuController.updateMouseMoves(this.gD);
    this.muteButton.selected = (
      this.gD.mousePos.x >= this.muteButton.x && this.gD.mousePos.y >= this.muteButton.y &&
      this.gD.mousePos.x <= this.muteButton.x + this.muteButton.width && this.gD.mousePos.y <= this.muteButton.y + this.muteButton.height
    )
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
      this.menuController.updateClick(clickPos, this.gD);
      if (this.muteButton.selected) {
        if (
          clickPos.x >= this.muteButton.x && clickPos.y >= this.muteButton.y &&
          clickPos.x <= this.muteButton.x + this.muteButton.width && clickPos.y <= this.muteButton.y + this.muteButton.height
        ) {
          this.gD.muted = !this.gD.muted;
        }
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
      this.menuController.draw(this.gD);
      this.muteButton.draw(this.gD);
      if (gD.muted) {
        gD.context.beginPath();
        gD.context.moveTo(this.gD.canvas.width - 40, 10);
        gD.context.lineTo(this.gD.canvas.width - 40 + 30, 10 + 30);
        gD.context.stroke();
      }
    }
  };
}
