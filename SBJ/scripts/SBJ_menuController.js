function MenuController(menu) {
  this.menu = menu;
  /**
   * initiates the menuController object
   * @param {Array<Array<Object>>} navigationGrid the main grid that includes all selectable objects and controls the navigation
   * @param {Array<Array<Object>>} additionalGrid an additional grid that includes selectable objects outside the navigation
   */
  this.setNewGrids = function(navigationGrid, additionalGrid) {
    this.nG = navigationGrid;
    this.aG = additionalGrid;
    this.updateNGSelection(0, 0);
    this.updateAGSelection(undefined, undefined);
  };
  /**
   * checks if a key is pressed and executes commands
   * @param  {string}     key a key code of a button that was pressed
   * @param  {globalDict} gD  the global dictionary
   */
  this.updateKeyPresses = function(key, gD) {
    var keyB = this.menu.controls.keyBindings;
    var rowIndex = this.selectedNGRowIndex;
    var columnIndex = this.selectedNGColumnIndex;

    if (keyB.get("Menu_NavDown")[3].includes(key)) {
      rowIndex = (rowIndex + 1) % this.nG.length;
      if (this.nG[rowIndex].length - 1 < columnIndex) {
        columnIndex = this.nG[rowIndex].length - 1;
      }
    } else if (keyB.get("Menu_NavUp")[3].includes(key)) {
      rowIndex -= 1;
      if (rowIndex < 0) {
        rowIndex = this.nG.length - 1;
      }
      if (this.nG[rowIndex].length - 1 < columnIndex) {
        columnIndex = this.nG[rowIndex].length - 1;
      }
    } else if (keyB.get("Menu_NavRight")[3].includes(key)) {
      columnIndex = (columnIndex + 1) % this.nG[rowIndex].length;
    } else if (keyB.get("Menu_NavLeft")[3].includes(key)) {
      columnIndex -= 1;
      if (columnIndex < 0) {
        columnIndex = this.nG[rowIndex].length - 1;
      }
    }

    this.updateNGSelection(rowIndex, columnIndex);

    if (keyB.get("Menu_Confirm")[3].includes(key)) {
      this.getSelectedButtons()[0].action(gD);
    } else if (keyB.get("Menu_Back")[3].includes(key)) {
      gD.currentPage = this.menu;
    } else if (keyB.get("Mute_All")[3].includes(key)) {
      gD.muted = !gD.muted;
    }
  };
  /**
   * checks, if the mouse was moved, what the mouse hit 
   * @param  {globalDict} gD the global Dictionary
   */
  this.updateMouseMoves = function(gD) {
    this.nG.map((buttonRow, rowIndex) => {
      buttonRow.map((button, columnIndex) => {
        if (gD.mousePos.x >= button.button.x && gD.mousePos.x <= button.button.x + button.button.width &&
            gD.mousePos.y >= button.button.y && gD.mousePos.y <= button.button.y + button.button.height) {
          this.updateNGSelection(rowIndex, columnIndex);
        }
      }, this);
    }, this);

    var selectedSomething = false;

    this.aG.map((buttonRow, rowIndex) => {
      buttonRow.map((button, columnIndex) => {
        if (gD.mousePos.x >= button.button.x && gD.mousePos.x <= button.button.x + button.button.width &&
            gD.mousePos.y >= button.button.y && gD.mousePos.y <= button.button.y + button.button.height) {
          this.updateAGSelection(rowIndex, columnIndex);
          selectedSomething = true;
        }
      }, this);
    }, this);

    if (!selectedSomething) {
      this.updateAGSelection(undefined, undefined);
    }
  };
  /**
   * checks where a click was executed
   * @param  {Object} clickPos the popped, non-null position of the click
   * @param  {globalDict} gD       the global dictionary
   */
  this.updateClick = function(clickPos, gD) {
    this.getSelectedButtons().map(buttonObject => {
      if (clickPos.x >= buttonObject.button.x && clickPos.x <= buttonObject.button.x + buttonObject.button.width &&
          clickPos.y >= buttonObject.button.y && clickPos.y <= buttonObject.button.y + buttonObject.button.height) {
        buttonObject.action(gD);
      }
    }, this);
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
   * draws the objects of the grids onto the canvas
   * @param {globalDict} gD the global dictionary
   */
  this.draw = function(gD) {
    this.nG.map(buttonRow => {
      buttonRow.map(buttonObject => {
        buttonObject.button.draw(gD, menu);
      }, this);
    }, this);

    this.aG.map(buttonRow => {
      buttonRow.map(buttonObject => {
        buttonObject.button.draw(gD);
      }, this);
    }, this);
  };
  /**
   * updates the selected object of the navigationGrid and deselects the old object
   * @param  {number} rowIndex    the row of the new selected object
   * @param  {number} columnIndex the column of the new selected object
   */
  this.updateNGSelection = function(rowIndex, columnIndex) {
    if (this.selectedNGRowIndex !== undefined && this.selectedNGColumnIndex !== undefined) {
      this.nG[this.selectedNGRowIndex][this.selectedNGColumnIndex].button.deselect();
    }

    this.nG[rowIndex][columnIndex].button.select();
    if (this.nG[rowIndex][columnIndex].selected !== undefined) {
      this.nG[rowIndex][columnIndex].selected(this.gD);
    }
    this.selectedNGRowIndex = rowIndex;
    this.selectedNGColumnIndex = columnIndex;
  };
  /**
   * updates the selected object of the additionalGrid and deselects the old object
   * @param  {number} rowIndex    the row of the new selected object
   * @param  {number} columnIndex the column of the new selected object
   */
  this.updateAGSelection = function(rowIndex, columnIndex) {
    if (this.selectedAGRowIndex !== undefined && this.selectedAGColumnIndex !== undefined) {
      this.aG[this.selectedAGRowIndex][this.selectedAGColumnIndex].button.deselect();
    }

    if (rowIndex !== undefined && columnIndex !== undefined) {
      this.aG[rowIndex][columnIndex].button.select();
      if (this.aG[rowIndex][columnIndex].selected !== undefined) {
        this.aG[rowIndex][columnIndex].selected(this.gD);
      }
    }
    this.selectedAGRowIndex = rowIndex;
    this.selectedAGColumnIndex = columnIndex;
  };
  /**
   * returns the selected buttons from the navigationGrid and the additionalGrid
   * @return {Array<Object>} the button objects from the navigationGrid and the additionalGrid 
   */
  this.getSelectedButtons = function() {
    var buttons = [];
    buttons.push(this.nG[this.selectedNGRowIndex][this.selectedNGColumnIndex]);
    if (this.selectedAGRowIndex !== undefined && this.selectedAGColumnIndex !== undefined) {
      buttons.push(this.aG[this.selectedAGRowIndex][this.selectedAGColumnIndex]);
    }
    return buttons;
  };
}