function MenuController(gD) {
  this.gD = gD;
  /**
   * initiates the menu object
   * @param {Array<MenuButton>} buttons The list of already created buttons to manage.
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
        if (this.buttons[rowIndex].length === 1) {
          columnIndex = 0;
        }
      } else if (keyB.get("Menu_NavUp")[2].includes(key)) {
        rowIndex -= 1;
        if (rowIndex < 0) {
          rowIndex = this.buttons.length - 1;
        }
        if (this.buttons[rowIndex].length === 1) {
          columnIndex = 0;
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
  }
}

/**
 * Represents a Button on a menu-screen which can be clicked or selected via the keyboard.
 * @param x {number} x-Coordinate of the top left corner
 * @param y {number} y-Coordinate of the top left corner
 * @param width {number}
 * @param height {number}
 * @param size {string} size of the button's text font (i.e. `15pt`)
 * @param family {string} font-family of the button's text
 * @param color {string} background-color of the button
 * @param text {string}
 * @param textcolor {string}
 * @param bordersize {number}
 * @param link {Function} what should be executed once the button is pressed
 * @constructor
 */
function MenuButton(x, y, width, height, size, family, color, text, textcolor, bordersize, link) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.size = size;
  this.family = family;
  this.color = color;
  this.text = text;
  this.textcolor = textcolor;
  this.bordersize = bordersize;
  this.link = link;
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
      gD.context.fillStyle = "rgba(180, 50, 50, 1)";
    } else {
      gD.context.fillStyle = this.color;
    }
    gD.context.fillRect(this.x, this.y, this.width, this.height);
    gD.context.textAlign = "center";
    gD.context.textBaseline = "middle";
    gD.context.font = this.size + " " + this.family;
    gD.context.fillStyle = this.textcolor;
    gD.context.fillText(this.text, this.x + (this.width / 2), this.y + (this.height / 2));
    gD.context.strokeStyle = "rgba(0, 0, 0, 1)";
    gD.context.lineWidth = this.bordersize;
    gD.context.strokeRect(this.x, this.y, this.width, this.height);
  };
}
