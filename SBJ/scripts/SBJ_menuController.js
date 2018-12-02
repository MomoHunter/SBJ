function MenuController() {
  /**
   * initiates the menu object
   * @param grid {Array<Array<MenuTextButton>>} The list of already created grid to manage.
   * @param controls {Controls} carries the key-bindings
   */
  this.init = function(grid, controls) {
    this.grid = grid;
    this.updateSelection(0, 0);
    this.controls = controls;
  };
  /**
   * checks if a button is pressed
   */
  this.updateKeyPresses = function(gD) {
    var keyB = this.controls.keyBindings;
    var rowIndex = this.selectedRowIndex;
    var columnIndex = this.selectedColumnIndex;

    gD.newKeys.map(key => {
      if (keyB.get("Menu_NavDown")[2].includes(key)) {
        rowIndex = (rowIndex + 1) % this.grid.length;
        if (this.grid[rowIndex].length - 1 < columnIndex) {
          columnIndex = this.grid[rowIndex].length - 1;
        }
      } else if (keyB.get("Menu_NavUp")[2].includes(key)) {
        rowIndex -= 1;
        if (rowIndex < 0) {
          rowIndex = this.grid.length - 1;
        }
        if (this.grid[rowIndex].length - 1 < columnIndex) {
          columnIndex = this.grid[rowIndex].length - 1;
        }
      } else if (keyB.get("Menu_NavRight")[2].includes(key)) {
        columnIndex = (columnIndex + 1) % this.grid[rowIndex].length;
      } else if (keyB.get("Menu_NavLeft")[2].includes(key)) {
        columnIndex -= 1;
        if (columnIndex < 0) {
          columnIndex = this.grid[rowIndex].length - 1;
        }
      }

      this.updateSelection(rowIndex, columnIndex);

      if (keyB.get("Menu_Confirm")[2].includes(key)) {
        this.getSelectedButton().callLink(gD);
      }
    });
  };
  /**
   * checks if the mouse was moved
   */
  this.updateMouseMoves = function(gD) {
    this.grid.map((buttonRow, rowIndex) => {
      buttonRow.map((button, columnIndex) => {
        if (gD.mousePos.x >= button.x && gD.mousePos.x <= button.x + button.width &&
            gD.mousePos.y >= button.y && gD.mousePos.y <= button.y + button.height) {
          this.updateSelection(rowIndex, columnIndex);
        }
      }, this);
    }, this);
  };
  /**
   * checks if there was a click
   * @param clickPos {Object} the popped, non-null position of the click
   * @param gD {GlobalDict} carries global information
   */
  this.updateClick = function(clickPos, gD) {
    var selectedButton = this.getSelectedButton();
    if (clickPos.x >= selectedButton.x && clickPos.x <= selectedButton.x + selectedButton.width &&
        clickPos.y >= selectedButton.y && clickPos.y <= selectedButton.y + selectedButton.height) { // = mouse over selected button
      selectedButton.callLink(gD);
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
   * called to update the current button selection
   * (deselects old selection and sets specified button as selected)
   */
  this.updateSelection = function(rowIndex, columnIndex) {
    if (this.selectedRowIndex !== undefined && this.selectedColumnIndex !== undefined) {
      this.grid[this.selectedRowIndex][this.selectedColumnIndex].deselect();
    }

    this.grid[rowIndex][columnIndex].select();
    this.selectedRowIndex = rowIndex;
    this.selectedColumnIndex = columnIndex;
  };
  /**
   * draws the menu onto the canvas
   */
  this.draw = function(gD) {
      this.grid.map(row => {
        row.map(button => {
          button.draw(gD);
        }, this);
      }, this);
  };
  this.getSelectedButton = function() {
    return this.grid[this.selectedRowIndex][this.selectedColumnIndex];
  };
  this.getSelectedData = function() {
    var selectedButton = this.getSelectedButton();
    if (!selectedButton) {
      return undefined;
    } else {
      return selectedButton.data;
    }
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