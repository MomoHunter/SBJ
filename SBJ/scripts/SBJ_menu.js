function Menu(gD) {
  this.gD = gD;
  /**
   * initiates the menu object
   */
  this.init = function() {
    this.mC = new MenuController(this);
    this.backgroundImage = new Image();
    this.setNewBackground();
    /*this.achievements = new Achievements(this, this.gD, this.mC);
    this.achievements.init();*/
    this.controls = new Controls(this, this.gD, this.mC);
    this.controls.init();
    this.saveLoad = new SaveLoad(this, this.gD, this.mC);
    this.saveLoad.init();

    this.title = new CanvasText(this.gD.canvas.width / 2, 100, "Super Block Jump", "title");
    this.version = new CanvasText(this.gD.canvas.width - 5, this.gD.canvas.height - 5, "v3.0.0", "version");
    this.pressButton = new CanvasText(this.gD.canvas.width / 2, 280, "Dr" + String.fromCharCode(220) + "cke eine beliebige Taste", "instruction");

    this.buttonStartTop = 150;
    this.buttonHeight = 30;
    this.buttonFullWidth = 200;
    this.buttonPadding = 6;
    this.buttonStartLeft = (this.gD.canvas.width / 2) - (this.buttonFullWidth / 2);

    this.nG = [
      [{ button: "Play",        action: (gD) => { gD.setNewPage(this.selectionScreen, false) } }],
      [{ button: "Shop",        action: (gD) => { gD.setNewPage(this.shop, true) } }],
      [{ button: "Save / Load", action: (gD) => { gD.setNewPage(this.saveLoad, false) } }],
      [{ button: "Controls",    action: (gD) => { gD.setNewPage(this.controls, true) } }],
      [{ button: "Exit",        action: (gD) => { window.close() } }]
    ];

    this.nG.map((rowButtons, rowIndex) => {
      var buttonWidth = (this.buttonFullWidth - (rowButtons.length - 1) * this.buttonPadding) / rowButtons.length;
      rowButtons.map((button, columnIndex) => {
        this.nG[rowIndex][columnIndex].button = new CanvasButton(
          this.buttonStartLeft + (buttonWidth + this.buttonPadding) * columnIndex, this.buttonStartTop + (this.buttonHeight + this.buttonPadding) * rowIndex,
          buttonWidth, this.buttonHeight, this.nG[rowIndex][columnIndex].button, "menu"
        );
      }, this);
    }, this);

    this.aG = [
      [{ 
        button: new CanvasImageButton(this.gD.canvas.width - 40, 10, 30, 30, "Icon_Mute", "standardImage"), 
        action: (gD) => { gD.muted = !gD.muted } 
      }]
    ];

    this.closedTitlescreen = false;        // if a key was pressed at start to close the tile-screen
  };
  this.setNewBackground = function() {
    var backgrounds = ["img/Titlescreen.png"];
    this.backgroundImage.src = backgrounds[Math.floor(Math.random() * backgrounds.length)];
  }
  /**
   * checks if a button is pressed
   */
  this.updateKeyPresses = function() {
    if (!this.closedTitlescreen) {
      if (this.gD.newKeys.length > 0) {
        this.closedTitlescreen = true;
      }
    } else {
      this.gD.newKeys.map(key => {
        this.mC.updateKeyPresses(key, this.gD);
      }, this);
    }
  };
  /**
   * checks if the mouse was moved
   */
  this.updateMouseMoves = function() {
    this.mC.updateMouseMoves(this.gD);
  };
  /**
   * checks if there was a click
   */
  this.updateClick = function() {
    var clickPos = this.gD.clicks.pop();
    if (!clickPos) {
      return
    }

    if (!this.closedTitlescreen) {
      this.closedTitlescreen = true;
    } else {
      this.mC.updateClick(clickPos, this.gD);
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
      this.mC.draw(this.gD);
    }
  };
}
