function MenuController(gD) {
  this.gD = gD;
  /**
   * initiates the menu object
   * @param {MenuTextButton<MenuTextButton>} buttons The list of already created buttons to manage.
   */
  this.init = function(buttons) {
    this.buttons = buttons;
    this.updateSelection(this, 0, 0);

    this.controls = new Controls(this.gD, this);
    this.controls.init();
  };
  /**
   * checks if a button is pressed
   */
  this.updateKeyPresses = function() {
    var keyB = this.controls.keyBindings;
    var rowIndex = this.selectedRowIndex;
    var columnIndex = this.selectedColumnIndex;

    this.gD.newKeys.map(key => {
      if (keyB.get("Menu_NavDown")[2].includes(key)) {
        rowIndex = (rowIndex + 1) % this.buttons.length;
        if (this.buttons[rowIndex].length - 1 < columnIndex) {
          columnIndex = this.buttons[rowIndex].length - 1;
        }
      } else if (keyB.get("Menu_NavUp")[2].includes(key)) {
        rowIndex -= 1;
        if (rowIndex < 0) {
          rowIndex = this.buttons.length - 1;
        }
        if (this.buttons[rowIndex].length - 1 < columnIndex) {
          columnIndex = this.buttons[rowIndex].length - 1;
        }
      } else if (keyB.get("Menu_NavRight")[2].includes(key)) {
        columnIndex = (columnIndex + 1) % this.buttons[rowIndex].length;
      } else if (keyB.get("Menu_NavLeft")[2].includes(key)) {
        columnIndex -= 1;
        if (columnIndex < 0) {
          columnIndex = this.buttons[rowIndex].length - 1;
        }
      }

      this.updateSelection(this, rowIndex, columnIndex);

      if (keyB.get("Menu_Confirm")[2].includes(key)) {
        this.getSelectedButton().callLink(this.gD);
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
          this.updateSelection(this, rowIndex, columnIndex);
        }
      }, this);
    }, this);
  };
  /**
   * checks if there was a click
   * @param {Object} clickPos the popped, non-null position of the click
   */
  this.updateClick = function(clickPos) {
    var selectedButton = this.getSelectedButton();
    if (clickPos.x >= selectedButton.x && clickPos.x <= selectedButton.x + selectedButton.width &&
        clickPos.y >= selectedButton.y && clickPos.y <= selectedButton.y + selectedButton.height) { // = mouse over selected button
      selectedButton.callLink(this.gD);
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
  this.updateSelection = function(menu, rowIndex, columnIndex) {
    if (menu.selectedRowIndex !== undefined && menu.selectedColumnIndex !== undefined) {
      menu.buttons[menu.selectedRowIndex][menu.selectedColumnIndex].deselect();
    }

    menu.buttons[rowIndex][columnIndex].select();
    menu.selectedRowIndex = rowIndex;
    menu.selectedColumnIndex = columnIndex;
  };
  /**
   * draws the menu onto the canvas
   */
  this.draw = function(ghostFactor) {
      this.buttons.map(row => {
        row.map(button => {
          button.draw(this.gD);
        }, this);
      }, this);
  };
  this.getSelectedButton = function() {
    return this.buttons[this.selectedRowIndex][this.selectedColumnIndex];
  };
  this.getSelectedData = function () {
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