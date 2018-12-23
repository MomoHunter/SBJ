function Menu(gD) {
  this.gD = gD;
  /**
   * initiates the menu object
   */
  this.init = function() {
    this.mainMC = new MenuController(this);
    this.extraMC = new MenuController(this);
    this.backgroundImage = new Image();
    this.setNewBackground();
    /*this.achievements = new Achievements(this, this.gD, this.mC);
    this.achievements.init();*/
    this.highscores = new Highscores(this, this.gD);
    this.highscores.init();
    this.controls = new Controls(this, this.gD);
    this.controls.init();
    this.statistics = new Statistics(this, this.gD);
    this.statistics.init();
    this.saveLoad = new SaveLoad(this, this.gD);
    this.saveLoad.init();

    this.title = new CanvasText(this.gD.canvas.width / 2, 100, "Super Block Jump", "title");
    this.version = new CanvasText(this.gD.canvas.width - 5, this.gD.canvas.height - 5, "v3.0.0", "version");
    this.pressButton = new CanvasText(this.gD.canvas.width / 2, 280, "Dr" + String.fromCharCode(220) + "cke eine beliebige Taste", "instruction");

    this.mainNavigationGrid = [
      [{ button: "Play",        action: (gD) => { gD.currentPage = this.selectionScreen } }],
      [{ button: "Shop",        action: (gD) => { gD.currentPage = this.shop } }],
      [{ button: "Save / Load", action: (gD) => { gD.currentPage = this.saveLoad } }],
      [{ button: "Extras",      action: (gD) => { this.showExtras = true } }],
      [{ button: "Exit",        action: (gD) => { window.close() } }]
    ];

    this.extraNavigationGrid = [
      [{ button: "Achievements", action: (gD) => { gD.currentPage = this.achievements } }],
      [{ button: "Highscores",   action: (gD) => { gD.currentPage = this.highscores } }],
      [{ button: "Controls",     action: (gD) => { gD.currentPage = this.controls } }],
      [{ button: "Statistics",   action: (gD) => { gD.currentPage = this.statistics } }],
      [{ button: "Back",         action: (gD) => { this.showExtras = false } }]
    ];

    this.mainNavigationGrid.map((buttonRow, rowIndex) => {
      buttonRow.map((buttonObject, columnIndex) => {
        buttonObject.button = new CanvasButton(
          this.gD.canvas.width / 2 - 100, 150 + 37 * rowIndex, 200, 30, buttonObject.button, "menu"
        );
      }, this);
    }, this);

    this.extraNavigationGrid.map((buttonRow, rowIndex) => {
      buttonRow.map((buttonObject, columnIndex) => {
        buttonObject.button = new CanvasButton(
          this.gD.canvas.width / 2 - 100, 150 + 37 * rowIndex, 200, 30, buttonObject.button, "menu"
        );
      }, this);
    }, this);

    this.additionalGrid = [
      [{ 
        button: new CanvasImageButton(this.gD.canvas.width - 40, 10, 30, 30, "Icon_Mute", "standardImage"),
        action: (gD) => { gD.muted = !gD.muted }
      }]
    ];

    this.mainMC.setNewGrids(this.mainNavigationGrid, this.additionalGrid);
    this.extraMC.setNewGrids(this.extraNavigationGrid, this.additionalGrid);

    this.closedTitlescreen = false;        // if a key was pressed at start to close the tile-screen
  };
  /**
   * sets a new background at random
   */
  this.setNewBackground = function() {
    var backgrounds = ["img/Titlescreen.png"];
    this.backgroundImage.src = backgrounds[Math.floor(Math.random() * backgrounds.length)];
  }
  /**
   * checks if a key is pressed and executes commands
   */
  this.updateKeyPresses = function() {
    if (!this.closedTitlescreen) {
      if (this.gD.newKeys.length > 0) {
        this.closedTitlescreen = true;
      }
    } else {
      this.gD.newKeys.map(key => {
        if (this.showExtras) {
          this.extraMC.updateKeyPresses(key, this.gD);
        } else {
          this.mainMC.updateKeyPresses(key, this.gD);
        }
      }, this);
    }
  };
  /**
   * checks, if the mouse was moved, what the mouse hit 
   */
  this.updateMouseMoves = function() {
    if (this.showExtras) {
      this.extraMC.updateMouseMoves(this.gD);
    } else {
      this.mainMC.updateMouseMoves(this.gD);
    }
  };
  /**
   * checks where a click was executed
   */
  this.updateClick = function() {
    var clickPos = this.gD.clicks.pop();
    if (!clickPos) {
      return
    }

    if (!this.closedTitlescreen) {
      this.closedTitlescreen = true;
    } else {
      if (this.showExtras) {
        this.extraMC.updateClick(clickPos, this.gD);
      } else {
        this.mainMC.updateClick(clickPos, this.gD);
      }
    }
  };
  /**
   * checks if the mouse wheel was moved
   */
  this.updateWheelMoves = function() {
    /* unused */
  };
  /**
   * updates moving objects
   */
  this.update = function() {
    /* unused */
  };
  /**
   * draws the objects onto the canvas
   * @param {float} ghostFactor the part of a physics step since the last physics update
   */
  this.draw = function(ghostFactor) {
    this.gD.context.drawImage(this.backgroundImage, 0, 0);

    this.title.draw(this.gD);
    this.version.draw(this.gD);

    if (!this.closedTitlescreen) {
      this.pressButton.draw(this.gD);
    } else {
      if (this.showExtras) {
        this.extraMC.draw(this.gD);
      } else {
        this.mainMC.draw(this.gD);
      }
    }
  };
}
