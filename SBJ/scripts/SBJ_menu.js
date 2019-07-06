function Menu(gD) {
  this.gD = gD;
  /**
   * initiates the menu object
   */
  this.init = function() {
    this.mainMC = new MenuController(this);
    this.playMC = new MenuController(this);
    this.extraMC = new MenuController(this);
    this.backgroundImage = new Image();
    this.setNewBackground();
    this.eventHandler = new EventHandler(this, this.gD);
    this.selectionScreenSP = new SelectionScreenSingleplayer(this, this.gD);
    this.selectionScreenSP.init();
    this.shop = new Shop(this, this.gD);
    this.shop.init();
    this.game = new Game(this, this.gD);
    this.game.init();
    this.achievements = new Achievements(this, this.gD);
    this.achievements.init();
    this.highscores = new Highscores(this, this.gD);
    this.highscores.init();
    this.controls = new Controls(this, this.gD);
    this.controls.init();
    this.statistics = new Statistics(this, this.gD);
    this.statistics.init();
    this.saveLoad = new SaveLoad(this, this.gD);
    this.saveLoad.init();

    this.showExtras = false;
    this.showPlay = false;

    this.title = new CanvasText(this.gD.canvas.width / 2, 100, "Super Block Jump", "title");
    this.version = new CanvasText(this.gD.canvas.width - 5, this.gD.canvas.height - 5, "v3.0.0", "version");
    this.pressButton = new CanvasText(this.gD.canvas.width / 2, 280, "Drücke eine beliebige Taste", "instruction");

    this.mainNavigationGrid = [
      [{ button: "Play",        action: (gD) => { this.showPlay = true } }],
      [{ button: "Shop",        action: (gD) => { gD.currentPage = this.shop } }],
      [{ button: "Save / Load", action: (gD) => { gD.currentPage = this.saveLoad } }],
      [{ button: "Extras",      action: (gD) => { this.showExtras = true } }],
      [{ button: "Exit",        action: (gD) => { window.close() } }]
    ];

    this.playNavigationGrid = [
      [{ button: "Singleplayer", action: (gD) => { gD.currentPage = this.selectionScreenSP; this.showPlay = false } }],
      [{ button: "Local MP",     action: (gD) => { /*gD.currentPage = this.selectionScreenLMP;*/ this.showPlay = false } }],
      [{ button: "Online MP",    action: (gD) => { /*gD.currentPage = this.selectionScreenOMP;*/ this.showPlay = false } }],
      [{ button: "Back",         action: (gD) => { this.showPlay = false } }]
    ];

    this.extraNavigationGrid = [
      [{ button: "Achievements", action: (gD) => { gD.currentPage = this.achievements; this.showExtras = false } }],
      [{ button: "Highscores",   action: (gD) => { gD.currentPage = this.highscores; this.showExtras = false } }],
      [{ button: "Controls",     action: (gD) => { gD.currentPage = this.controls; this.showExtras = false } }],
      [{ button: "Statistics",   action: (gD) => { gD.currentPage = this.statistics; this.showExtras = false } }],
      [{ button: "Back",         action: (gD) => { this.showExtras = false } }]
    ];

    let actionToDo;
    if (window.location.hash) {
      let hashLocation = decodeURIComponent(window.location.hash.substring(1)).toLowerCase(); // remove leading #
      [...this.mainNavigationGrid, ...this.extraNavigationGrid, ...this.playNavigationGrid].map(dataRow => {
        dataRow.map(data => {
          if (data.button.toLowerCase() === hashLocation) {
            actionToDo = data.action;
          }
        })
      })
    }

    this.mainNavigationGrid.map((buttonRow, rowIndex) => {
      buttonRow.map((buttonObject, columnIndex) => {
        buttonObject.button = new CanvasButton(
          this.gD.canvas.width / 2 - 100, 150 + 37 * rowIndex, 200, 30, buttonObject.button, "menu"
        );
      }, this);
    }, this);

    this.playNavigationGrid.map((buttonRow, rowIndex) => {
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

    this.muteButton = new CanvasImageButton(this.gD.canvas.width - 40, 10, 30, 30, ["Icon_Sound_on", "Icon_Sound_off"], "standardImage");
    if (this.gD.muted) {
      this.muteButton.setSprite(1);
    }

    this.additionalGrid = [
      [{
        button: this.muteButton,
        action: (gD) => { gD.muted = !gD.muted; this.muteButton.setSprite(gD.muted ? 1 : 0) }
      }]
    ];

    this.mainMC.setNewGrids(this.mainNavigationGrid, this.additionalGrid);
    this.playMC.setNewGrids(this.playNavigationGrid, this.additionalGrid);
    this.extraMC.setNewGrids(this.extraNavigationGrid, this.additionalGrid);

    this.closedTitlescreen = false;        // if a key was pressed at start to close the tile-screen

    if (actionToDo) {
      actionToDo(this.gD);
    }
  };
  /**
   * sets a new background at random
   */
  this.setNewBackground = function() {
    let backgrounds = ["img/Titlescreen1.png"];
    this.backgroundImage.src = backgrounds[Math.floor(Math.random() * backgrounds.length)];
  };
  this.handleEvent = function(eventKey, addedValue = 1) {
    this.eventHandler.handleEvent(eventKey, addedValue);
  };
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
        if (key === "KeyK") {
          this.achievements.achievementNotification.addAchievement(this.achievements.achievementList[Math.floor(Math.random() * 33)]);
        }
        if (this.showExtras) {
          this.extraMC.updateKeyPresses(key, this.gD);
          if (this.controls.keyBindings.get("Menu_Abort")[3].includes(key)) {
            this.showExtras = false;
          }
        } else if (this.showPlay) {
          this.playMC.updateKeyPresses(key, this.gD);
          if (this.controls.keyBindings.get("Menu_Abort")[3].includes(key)) {
            this.showPlay = false;
          }
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
    } else if (this.showPlay) {
      this.playMC.updateMouseMoves(this.gD);
    } else {
      this.mainMC.updateMouseMoves(this.gD);
    }
  };
  /**
   * checks where a click was executed
   */
  this.updateClick = function() {
    let clickPos = this.gD.clicks.pop();
    if (!clickPos) {
      return
    }

    if (!this.closedTitlescreen) {
      this.closedTitlescreen = true;
    } else {
      if (this.showExtras) {
        this.extraMC.updateClick(clickPos, this.gD);
      } else if (this.showPlay) {
        this.playMC.updateClick(clickPos, this.gD);
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
    this.lightUpdate();
    this.mainMC.update();
    this.playMC.update();
    this.extraMC.update();
  };
  this.lightUpdate = function() {
    this.achievements.achievementNotification.update();
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
      } else if (this.showPlay) {
        this.playMC.draw(this.gD);
      } else {
        this.mainMC.draw(this.gD);
      }
    }
    this.lightDraw();
  };
  this.lightDraw = function() {
    this.achievements.achievementNotification.draw(this.gD);
  };
}