function MenuController(menu) {
  this.menu = menu;
  /**
   * initiates the menuController object
   * @param page {Object} an object that represents a view
   * @param scrollBar {CanvasScrollBar} the scrollBar of the page, if it has one
   */
  this.setNewPage = function(page, scrollBar = null) {
    this.currentPage = page;
    this.scrollBar = scrollBar;
    this.deselectAll();
    this.updateNGSelection(0, 0);
    this.updateAGSelection(undefined, undefined);
  };
  /**
   * checks if a button is pressed
   * @param key {String} The keycode that should be checked
   * @param gD {GlobalDict} the global dictionary
   */
  this.updateKeyPresses = function(key, gD) {
    var keyB = this.menu.controls.keyBindings;
    var rowIndex = this.selectedNGRowIndex;
    var columnIndex = this.selectedNGColumnIndex;

    if (keyB.get("Menu_NavDown")[2].includes(key)) {
      rowIndex = (rowIndex + 1) % this.currentPage.nG.length;
      if (this.currentPage.nG[rowIndex].length - 1 < columnIndex) {
        columnIndex = this.currentPage.nG[rowIndex].length - 1;
      }
    } else if (keyB.get("Menu_NavUp")[2].includes(key)) {
      rowIndex -= 1;
      if (rowIndex < 0) {
        rowIndex = this.currentPage.nG.length - 1;
      }
      if (this.currentPage.nG[rowIndex].length - 1 < columnIndex) {
        columnIndex = this.currentPage.nG[rowIndex].length - 1;
      }
    } else if (keyB.get("Menu_NavRight")[2].includes(key)) {
      columnIndex = (columnIndex + 1) % this.currentPage.nG[rowIndex].length;
    } else if (keyB.get("Menu_NavLeft")[2].includes(key)) {
      columnIndex -= 1;
      if (columnIndex < 0) {
        columnIndex = this.currentPage.nG[rowIndex].length - 1;
      }
    }

    this.updateNGSelection(rowIndex, columnIndex);

    if (keyB.get("Menu_Confirm")[2].includes(key)) {
      this.getSelectedButtons()[0].action(this.gD);
    }

    if (keyB.get("Menu_Back")[2].includes(key)) {
      gD.setNewPage(this.menu, true);
    }

    if (keyB.get("Mute_All")[2].includes(key)) {
      gD.muted = !gD.muted;
    }
  };
  /**
   * checks if the mouse was moved
   */
  this.updateMouseMoves = function(gD) {
    this.currentPage.nG.map((buttonRow, rowIndex) => {
      buttonRow.map((button, columnIndex) => {
        if (gD.mousePos.x >= button.button.x && gD.mousePos.x <= button.button.x + button.button.width &&
            gD.mousePos.y >= button.button.y && gD.mousePos.y <= button.button.y + button.button.height) {
          this.updateNGSelection(rowIndex, columnIndex);
        }
      }, this);
    }, this);

    var updated = false;

    this.currentPage.aG.map((buttonRow, rowIndex) => {
      buttonRow.map((button, columnIndex) => {
        if (gD.mousePos.x >= button.button.x && gD.mousePos.x <= button.button.x + button.button.width &&
            gD.mousePos.y >= button.button.y && gD.mousePos.y <= button.button.y + button.button.height) {
          this.updateAGSelection(rowIndex, columnIndex);
          updated = true;
        }
      }, this);
    }, this);

    if (!updated) {
      this.updateAGSelection(undefined, undefined);
    }
  };
  /**
   * checks if there was a click
   * @param clickPos {Object} the popped, non-null position of the click
   * @param gD {GlobalDict} carries global information
   */
  this.updateClick = function(clickPos, gD) {
    this.getSelectedButtons().map(button => {
      if (clickPos.x >= button.button.x && clickPos.x <= button.button.x + button.button.width &&
          clickPos.y >= button.button.y && clickPos.y <= button.button.y + button.button.height) {
        button.action(gD);
      }
    }, this);
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
   * called to update the current button selection
   * (deselects old selection and sets specified button as selected)
   */
  this.updateNGSelection = function(rowIndex, columnIndex) {
    if (this.selectedNGRowIndex !== undefined && this.selectedNGColumnIndex !== undefined) {
      this.currentPage.nG[this.selectedNGRowIndex][this.selectedNGColumnIndex].button.deselect();
    }

    var object = this.currentPage.nG[rowIndex][columnIndex];
    object.button.select();
    if (object.selected !== undefined) {
      object.selected(this.gD);
    }
    this.selectedNGRowIndex = rowIndex;
    this.selectedNGColumnIndex = columnIndex;
  };
  this.updateAGSelection = function(rowIndex, columnIndex) {
    if (this.selectedAGRowIndex !== undefined && this.selectedAGColumnIndex !== undefined) {
      this.currentPage.aG[this.selectedAGRowIndex][this.selectedAGColumnIndex].button.deselect();
    }

    if (rowIndex !== undefined && columnIndex !== undefined) {
      var object = this.currentPage.nG[rowIndex][columnIndex];
      object.button.select();
      if (object.selected !== undefined) {
        object.selected(this.gD);
      }
    }
    this.selectedAGRowIndex = rowIndex;
    this.selectedAGColumnIndex = columnIndex;
  };
  this.deselectAll = function() {
    this.currentPage.nG.map(row => {
      row.map(button => {
        button.button.deselect();
      });
    });
    this.currentPage.aG.map(row => {
      row.map(button => {
        button.button.deselect();
      });
    });
    this.selectedNGRowIndex = 0;
    this.selectedNGColumnIndex = 0;
    this.selectedAGRowIndex = undefined;
    this.selectedAGColumnIndex = undefined;
  };
  /**
   * draws the menu onto the canvas
   */
  this.draw = function(gD) {
    this.currentPage.nG.map(row => {
      row.map(button => {
        button.button.draw(gD, menu);
      }, this);
    }, this);

    this.currentPage.aG.map(row => {
      row.map(button => {
        button.button.draw(gD);
      }, this);
    }, this);
  };
  this.getSelectedButtons = function() {
    var buttons = [];
    buttons.push(this.currentPage.nG[this.selectedNGRowIndex][this.selectedNGColumnIndex]);
    if (this.selectedAGRowIndex !== undefined && this.selectedAGColumnIndex !== undefined) {
      buttons.push(this.currentPage.aG[this.selectedAGRowIndex][this.selectedAGColumnIndex]);
    }
    return buttons;
  };
}

/**
 * Represents a Button with text on a menu-screen which can be clicked or selected via the keyboard.
 * @param x {number} x-Coordinate of the top left corner
 * @param y {number} y-Coordinate of the top left corner
 * @param width {number}
 * @param height {number}
 * @param text {string}
 * @param link {Function|null} what should be executed once the button is pressed
 * @param data {object|null} data to be accessible when this button is selected
 * @constructor
 */
function MenuTextButton(x, y, width, height, text, link = null, data = null) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.text = text;
  this.link = link;
  this.data = data;
  this.selected = false;
  this.select = function() {
    this.selected = true;
  };
  this.deselect = function() {
    this.selected = false;
  };
  this.callLink = function(gD) {
    if (this.link) {
      this.link(gD);
    }
  };
  this.draw = function(gD) {
    if (this.selected) {
      gD.context.fillStyle = gD.design.button.backgroundColor.selected;
    } else {
      gD.context.fillStyle = gD.design.button.backgroundColor.normal;
    }
    gD.context.fillRect(this.x, this.y, this.width, this.height);
    gD.context.textAlign = "center";
    gD.context.textBaseline = "middle";
    gD.context.font = gD.design.button.fontSize + " " + gD.design.button.fontFamily;
    gD.context.fillStyle = gD.design.button.fontColor;
    gD.context.fillText(this.text, this.x + (this.width / 2), this.y + (this.height / 2));
    gD.context.strokeStyle = gD.design.button.borderColor;
    gD.context.lineWidth = gD.design.button.borderSize;
    gD.context.strokeRect(this.x, this.y, this.width, this.height);
  };
}

/**
 * Represents a Button with an Image on a menu-screen which can be clicked or selected via the keyboard.
 * @param x {number} x-Coordinate of the top left corner
 * @param y {number} y-Coordinate of the top left corner
 * @param width {number}
 * @param height {number}
 * @param spriteKey {string} under which key in the gD the sprite for this button's image can be found
 * @param link {Function|null} what should be executed once the button is pressed
 * @param data {object|null} data to be accessible when this button is selected
 * @constructor
 */
function MenuImageButton(x, y, width, height, spriteKey, link = null, data = null) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.spriteKey = spriteKey;
  this.link = link;
  this.data = data;
  this.selected = false;
  this.select = function() {
    this.selected = true;
  };
  this.deselect = function() {
    this.selected = false;
  };
  this.callLink = function(gD) {
    if (this.link) {
      this.link(gD);
    }
  };
  this.draw = function(gD) {
    var [spriteX, spriteY, spriteWidth, spriteHeight] = gD.spriteDict[this.spriteKey];

    if (this.selected) {
      gD.context.fillStyle = gD.design.button.backgroundColor.selected;
    } else {
      gD.context.fillStyle = gD.design.button.backgroundColor.normal;
    }
    gD.context.fillRect(this.x, this.y, this.width, this.height);

    gD.context.drawImage(
      gD.spritesheet,
      spriteX, spriteY,
      spriteWidth, spriteHeight,
      this.x + gD.design.button.padding, this.y + gD.design.button.padding,
      this.width - gD.design.button.padding*2, this.height - gD.design.button.padding*2
    );

    gD.context.strokeStyle = gD.design.button.borderColor;
    gD.context.lineWidth = gD.design.button.borderSize;
    gD.context.strokeRect(this.x, this.y, this.width, this.height);
  };
}