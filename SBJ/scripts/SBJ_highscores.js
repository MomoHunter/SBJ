function Highscores(menu, gD) {
  this.menu = menu;
  this.gD = gD;
  /**
   * initiates the object
   */
  this.init = function() {
    this.chooseName = false;
    this.oldName = "";
    this.highscores = [];
    this.scrollHeight = 0;
    this.title = new CanvasText(this.gD.canvas.width / 2, 30, "Highscores", "pageTitle");

    this.headline = new HighscoreHeadline(this.gD.canvas.width / 2 - 310, 60, 620, 20, "Highscores", "highscoresHeadline");

    this.highscoreDetails = new HighscoreDetails(
      0, 0, this.gD.canvas.width, this.gD.canvas.height, "highscoresDetails"
    );

    this.enterNameModal = new CanvasEnterNameModal(
      this.gD.canvas.width / 2 - 207, this.gD.canvas.height / 2 - 45, 414, 90, "enterNameModal"
    );
    this.enterNameModal.init();

    this.scrollBar = new CanvasScrollBar(this.gD.canvas.width / 2 + 320, 80, 200, 20, this.highscores.length, "scrollBarStandard");

    this.backToMenu = new CanvasButton(
      (this.gD.canvas.width / 2) - 100, this.gD.canvas.height - 50, 200, 30, "Main Menu", "menu"
    );

    this.updateSelection(-1, 0, false);
  };
  this.getSaveData = function() {
    return this.highscores.map(highscore => highscore.getSaveData());
  };
  this.setSaveData = function(data) {
    this.highscores = [];
    data.map(highscore => this.addHighscore(highscore), this);
  };
  /**
   * adds a new highscore to the list and cuts at 100 highscores
   * @param {Object} highscore a highscore object
   */
  this.addHighscore = function(highscore) {
    this.highscores.map((entry, index) => {
      this.highscores[index] = entry.highscore;
    }, this);

    let pos = 0;
    this.highscores.map((entry, index) => {
      if (entry.distance > highscore.distance) {
        pos = index + 1;
      }
    }, this);

    this.highscores.splice(pos, 0, highscore);
    this.highscores = this.highscores.slice(0, 100);
    this.highscores.map((entry, index) => {
      this.highscores[index] = new HighscoreEntry(
        this.gD.canvas.width / 2 - 310, 80 + index * 20, 620, 20, entry, index + 1, "highscoresEntry"
      );
    }, this);
    this.updateSelection(-1, 0, false);
    this.vScroll(0);
    this.scrollBar.refresh(this.highscores.length);
  };
  /**
   * starts the enter name modal and activates the enter name mode
   * @param {number} index the index of the highscore that should be edited
   */
  this.startNewName = function(index) {
    this.chooseName = true;
    this.enterNameModal.text = "";
    this.selectedHighscore = index;
  };
  /**
   * sets the new entered name
   */
  this.setNewName = function() {
    this.highscores[this.selectedHighscore].highscore.name = this.enterNameModal.text;
    this.chooseName = false;
  };
  /**
   * checks if a key is pressed and executes commands
   */
  this.updateKeyPresses = function() {
    this.gD.newKeys.map((key, index) => {
      let keyB = this.menu.controls.keyBindings;
      let rowIndex = this.selectedRowIndex;
      let columnIndex = this.selectedColumnIndex;

      if (this.chooseName) {
        if (keyB.get("NameModal_NavDown")[3].includes(key)) {
          this.enterNameModal.select(this.enterNameModal.selected === 0 ? 1 : 0);
        } else if (keyB.get("NameModal_NavUp")[3].includes(key)) {
          this.enterNameModal.select(this.enterNameModal.selected === 0 ? 1 : 0);
        } else if (keyB.get("NameModal_NavRight")[3].includes(key)) {
          if (this.enterNameModal.selected === 0) {
            this.enterNameModal.moveCursor(1);
          } else {
            this.enterNameModal.select((this.enterNameModal.selected) % 2 + 1);
          }
        } else if (keyB.get("NameModal_NavLeft")[3].includes(key)) {
          if (this.enterNameModal.selected === 0) {
            this.enterNameModal.moveCursor(-1);
          } else {
            this.enterNameModal.select((this.enterNameModal.selected) % 2 + 1);
          }
        } else if (keyB.get("NameModal_DeleteLeft")[3].includes(key) && this.enterNameModal.selected === 0) {
          this.enterNameModal.deleteCharacter(-1);
        } else if (keyB.get("NameModal_DeleteRight")[3].includes(key) && this.enterNameModal.selected === 0) {
          this.enterNameModal.deleteCharacter(1);
        } else if (keyB.get("NameModal_Confirm")[3].includes(key)) {
          if (this.enterNameModal.selected === 1 || this.enterNameModal.selected === 0) {
            this.setNewName();
          } else if (this.enterNameModal.selected === 2) {
            this.chooseName = false;
          }
          this.enterNameModal.select(0);
        } else if (keyB.get("NameModal_Abort")[3].includes(key)) {
          this.chooseName = false;
        } else if (this.enterNameModal.selected === 0) {
          let event = this.gD.events[index];
          if (event.key.length === 1) {
            this.enterNameModal.addCharacter(event.key);
          }
        }
      } else {
        if (keyB.get("Menu_NavDown")[3].includes(key)) {
          rowIndex++;
          if (rowIndex >= this.highscores.length) {
            this.updateSelection(-1, columnIndex, true);
          } else {
            this.updateSelection(rowIndex, columnIndex, true);
          }
        } else if (keyB.get("Menu_NavUp")[3].includes(key)) {
          rowIndex--;
          if (rowIndex < -1) {
            this.updateSelection(this.highscores.length - 1, columnIndex, true);
          } else {
            this.updateSelection(rowIndex, columnIndex, true);
          }
        } else if (keyB.get("Menu_NavLeft")[3].includes(key)) {
          columnIndex--;
          if (columnIndex < 0) {
            this.updateSelection(rowIndex, 0, true);
          } else {
            this.updateSelection(rowIndex, columnIndex, true);
          }
        } else if (keyB.get("Menu_NavRight")[3].includes(key)) {
          columnIndex++;
          if (columnIndex >= 1) {
            this.updateSelection(rowIndex, 0, true);
          } else {
            this.updateSelection(rowIndex, columnIndex, true);
          }
        } else if (keyB.get("Menu_Confirm")[3].includes(key)) {
          if (rowIndex >= 0) {
            this.startNewName(index);
          } else {
            this.gD.currentPage = this.menu;
          }
        } else if (keyB.get("Menu_Back")[3].includes(key)) {
          gD.currentPage = this.menu;
        } else if (keyB.get("Mute_All")[3].includes(key)) {
          this.gD.muted = !this.gD.muted;
          this.menu.muteButton.setSprite();
        }
      }
    }, this);
  };
  /**
   * checks, if the mouse was moved, what the mouse hit 
   */
  this.updateMouseMoves = function() {
    if (this.chooseName) {
      if (this.gD.mousePos.x >= this.enterNameModal.x + 5 && 
          this.gD.mousePos.x <= this.enterNameModal.x + this.enterNameModal.width - 5 &&
          this.gD.mousePos.y >= this.enterNameModal.y + 30 &&
          this.gD.mousePos.y <= this.enterNameModal.y + 50) {
        this.enterNameModal.select(0);
      }
      this.enterNameModal.buttons.map((button, index) => {
        if (this.gD.mousePos.x >= button.x && this.gD.mousePos.x <= button.x + button.width &&
            this.gD.mousePos.y >= button.y && this.gD.mousePos.y <= button.y + button.height) {
          this.enterNameModal.select(index + 1);
        }
      }, this);
    } else {
      let highscoreSelected = false;
      
      this.highscores.map((entry, index) => {
        let realHeight = entry.y - this.scrollHeight;
        if (this.gD.mousePos.x >= entry.x && this.gD.mousePos.x <= entry.x + entry.width &&
            this.gD.mousePos.y >= realHeight && this.gD.mousePos.y <= realHeight + entry.height) {
          if (realHeight >= 80 && realHeight < 280) {
            this.updateSelection(index, this.selectedColumnIndex, false);
            if (this.gD.mousePos.x >= entry.x + entry.width - 20 && this.gD.mousePos.x <= entry.x + entry.width) {
              this.highscoreDetails.setVisible();
              highscoreSelected = true;
            }
          }
        }
      }, this);
      if (!highscoreSelected) {
        this.highscoreDetails.setInvisible();
      }

      if (this.gD.mousePos.x >= this.backToMenu.x && this.gD.mousePos.x <= this.backToMenu.x + this.backToMenu.width &&
          this.gD.mousePos.y >= this.backToMenu.y && this.gD.mousePos.y <= this.backToMenu.y + this.backToMenu.height) {
        this.updateSelection(-1, this.selectedColumnIndex, false);
      }
    }
  };
  /**
   * checks where a click was executed
   */
  this.updateClick = function() {
    let clickPos = this.gD.clicks.pop();
    if (!clickPos) {
      return;
    }
    
    if (this.chooseName) {
      if (!(clickPos.x >= this.enterNameModal.x &&
            clickPos.x <= this.enterNameModal.x + this.enterNameModal.width &&
            clickPos.y >= this.enterNameModal.y &&
            clickPos.y <= this.enterNameModal.y + this.enterNameModal.height) &&
            clickPos.x >= 0 && clickPos.x <= this.gD.canvas.width && 
            clickPos.y >= 0 && clickPos.y <= this.gD.canvas.height) {
        this.chooseName = false;
      }
      this.enterNameModal.buttons.map((button, index) => {
        if (clickPos.x >= button.x && clickPos.x <= button.x + button.width &&
            clickPos.y >= button.y && clickPos.y <= button.y + button.height) {
          if (index === 0) {
            this.setNewName();
          } else {
            this.chooseName = false;
          }
        }
      }, this);
    } else {
      this.highscores.map((entry, index) => {
        let realHeight = entry.y - this.scrollHeight;
        if (clickPos.x >= entry.x && clickPos.x <= entry.x + entry.width &&
            clickPos.y >= realHeight && clickPos.y <= realHeight + entry.height) {
          if (realHeight >= 80 && realHeight < 280) {
            this.startNewName(index);
          }
        }
      }, this);

      if (clickPos.x >= this.backToMenu.x && clickPos.x <= this.backToMenu.x + this.backToMenu.width &&
          clickPos.y >= this.backToMenu.y && clickPos.y <= this.backToMenu.y + this.backToMenu.height) {
        this.gD.currentPage = this.menu;
      }
    }
  };
  /**
   * checks if the mouse wheel was moved
   */
  this.updateWheelMoves = function() {
    let wheelMove = this.gD.wheelMovements.pop();
    if (!wheelMove || this.highscores.length < 11) {
      return;
    }

    if (wheelMove < 0) {
      this.vScroll(Math.max(
        (this.scrollHeight / 20) - 1, 
        0
        ));
    } else if (wheelMove > 0) {
      this.vScroll(Math.min(
        (this.scrollHeight / 20) + 1, 
        (this.highscores[this.highscores.length - 1].y - 260) / 20
      ));
    }
  };
  /**
   * updates moving objects
   */
  this.update = function() {
    this.backToMenu.update();

    this.highscores.map(entry => {
      entry.update();
    }, this);
    
    this.enterNameModal.update();
    
    this.menu.lightUpdate();
  };
  /**
   * draws the objects onto the canvas
   * @param {float} ghostFactor the part of a physics step since the last physics update
   */
  this.draw = function(ghostFactor) {
    this.gD.context.drawImage(this.menu.backgroundImage, 0, 0);
    this.title.draw(this.gD);
    this.headline.draw(gD);

    this.highscores.map(entry => {
      let realHeight = entry.y - this.scrollHeight;
      if (realHeight >= 80 && realHeight < 280) {
        entry.draw(this, this.gD);
      }
    }, this);

    this.scrollBar.draw(this.gD);
    this.backToMenu.draw(this.gD);
    this.highscoreDetails.draw(this.gD);

    if (this.chooseName) {
      this.enterNameModal.draw(this.gD);
    }
    
    this.menu.lightDraw();
  };
  /**
   * updates the selected object and deselects the old object
   * @param {number}  rowIndex    the row of the new selected object
   * @param {number}  columnIndex the column of the new selected object
   * @param {boolean} scroll      if the action should influence scrolling
   */
  this.updateSelection = function(rowIndex, columnIndex, scroll) {
    if (this.selectedRowIndex !== undefined && this.selectedColumnIndex !== undefined) {
      if (this.selectedRowIndex === -1) {
        this.backToMenu.deselect();
      } else {
        this.highscores[this.selectedRowIndex].deselect();
        this.highscoreDetails.setHighscore(null);
      }
    }

    if (rowIndex === -1) {
      this.backToMenu.select();
    } else {
      let entry = this.highscores[rowIndex];
      entry.select();
      this.highscoreDetails.setHighscore(entry.highscore);
      if (scroll) {
        if (entry.y - this.scrollHeight >= 240) {
          this.vScroll(Math.min(
            (this.highscores[this.highscores.length - 1].y - 260) / 20, 
            (entry.y - 220) / 20
          ));
        } else if (entry.y - this.scrollHeight < 120) {
          this.vScroll(Math.max(
            (entry.y - 120) / 20, 
            0
          ));
        }
      }
    }
    this.selectedRowIndex = rowIndex;
    this.selectedColumnIndex = columnIndex;
  };
  /**
   * scrolls the page with a defined number of objects
   * @param  {number} elementsScrolled the number of objects that should be scrolled
   */
  this.vScroll = function(elementsScrolled) {
    this.scrollHeight = elementsScrolled * 20;
    this.scrollBar.scroll(elementsScrolled);
  };
}

/**
 * a headline for highscores
 * @param {number} x        x-coordinate of the top-left corner of the headline on the canvas
 * @param {number} y        y-coordinate of the top-left corner of the headline on the canvas
 * @param {number} width    width of the headline on the canvas
 * @param {number} height   height of the headline on the canvas
 * @param {string} text     the text to write as the headline
 * @param {string} styleKey the design to use for the headline
 */
function HighscoreHeadline(x, y, width, height, text, styleKey) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.text = text;
  this.styleKey = styleKey;
  /**
   * draws the objects onto the canvas
   * @param {GlobalDict} gD the global dictionary
   */
  this.draw = function(gD) {
    let design = gD.design.elements[this.styleKey];
    drawCanvasRect(this.x, this.y, this.width, this.height, design.rectKey, gD);
    drawCanvasText(
      this.x + (this.width / 2), this.y + (this.height / 2), this.text, design.textKey, gD
    );
    drawCanvasRectBorder(this.x, this.y, this.width, this.height, design.borderKey, gD);
  };
}

/**
 * an entry for highscores
 * @param {number} x         x-coordinate of the top-left corner of the entry on the canvas
 * @param {number} y         y-coordinate of the top-left corner of the entry on the canvas
 * @param {number} width     width of the entry on the canvas
 * @param {number} height    height of the entry on the canvas
 * @param {Object} highscore the highscore object this entry should use
 * @param {number} place     the placement of the highscore
 * @param {string} styleKey  the design to use for the entry
 */
function HighscoreEntry(x, y, width, height, highscore, place, styleKey) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.highscore = highscore;
  this.place = place;
  this.styleKey = styleKey;
  this.arrowWidth = 0;
  this.arrowHeight = 0;
  this.animationSpeed = 24;
  this.selected = false;
  /**
   * selects this entry
   */
  this.select = function() {
    this.selected = true;
  };
  /**
   * deselects this entry
   */
  this.deselect = function() {
    this.selected = false;
  };
  this.update = function() {
    if (this.selected) {
      if (this.arrowHeight < this.height) {
        this.arrowHeight += this.animationSpeed;
        if (this.arrowHeight >= this.height) {
          this.arrowHeight = this.height;
        }
      } else if (this.arrowHeight >= this.height && this.arrowWidth < this.width) {
        this.arrowWidth += this.animationSpeed;
        if (this.arrowWidth >= this.width) {
          this.arrowWidth = this.width;
        }
      }
    }  else {
      if (this.arrowWidth > 0) {
        this.arrowWidth -= this.animationSpeed;
        if (this.arrowWidth <= 0) {
          this.arrowWidth = 0;
        }
      } else if (this.arrowWidth <= 0 && this.arrowHeight > 0) {
        this.arrowHeight -= this.animationSpeed;
        if (this.arrowHeight <= 0) {
          this.arrowHeight = 0;
        }
      }
    }
  };
  /**
   * draws the objects onto the canvas
   * @param {Highscores} highscores the controls object
   * @param {GlobalDict} gD         the global dictionary
   */
  this.draw = function(highscores, gD) {
    let design = gD.design.elements[this.styleKey];
    let {spriteWidth, spriteHeight} = getSpriteData("Icon_Info", gD);
    let centerX = this.x + this.width / 2;
    let centerY = this.y + this.height / 2 - highscores.scrollHeight;

    drawCanvasRect(this.x, this.y - highscores.scrollHeight, this.width, this.height, design.rectKey.standard, gD);
    drawCanvasPolygon(
      centerX + this.arrowWidth / 2, centerY - this.arrowHeight / 2, design.rectKey.selected, gD,
      centerX + Math.min(this.arrowWidth / 2 + this.arrowHeight / 2, this.width / 2),
      centerY - Math.max((this.arrowWidth / 2 + this.arrowHeight / 2) - this.width / 2, 0),
      centerX + Math.min(this.arrowWidth / 2 + this.arrowHeight / 2, this.width / 2),
      centerY + Math.max((this.arrowWidth / 2 + this.arrowHeight / 2) - this.width / 2, 0),
      centerX + this.arrowWidth / 2, centerY + this.arrowHeight / 2,
      centerX - this.arrowWidth / 2, centerY + this.arrowHeight / 2,
      centerX - Math.min(this.arrowWidth / 2 + this.arrowHeight / 2, this.width / 2),
      centerY + Math.max((this.arrowWidth / 2 + this.arrowHeight / 2) - this.width / 2, 0),
      centerX - Math.min(this.arrowWidth / 2 + this.arrowHeight / 2, this.width / 2),
      centerY - Math.max((this.arrowWidth / 2 + this.arrowHeight / 2) - this.width / 2, 0),
      centerX - this.arrowWidth / 2, centerY - this.arrowHeight / 2
    );
    drawCanvasText(
      this.x + 48, this.y + this.height / 2 - highscores.scrollHeight,
      this.place, design.textKey.number, gD
    );
    drawCanvasText(
      this.x + 52, this.y + this.height / 2 - highscores.scrollHeight, 
      this.highscore.name, design.textKey.name, gD
    );
    drawCanvasText(
      this.x + this.width - 22, this.y + this.height / 2 - highscores.scrollHeight,
      this.highscore.distance + "m", design.textKey.number, gD
    );
    drawCanvasImage(
      this.x + this.width - spriteWidth - (20 - spriteWidth) / 2, this.y + (this.height - spriteHeight) / 2 - highscores.scrollHeight,
      "Icon_Info", gD
    );
    drawCanvasLine(
      this.x + 50, this.y - highscores.scrollHeight, design.borderKey, 
      gD, this.x + 50, this.y + this.height - highscores.scrollHeight
    );
    drawCanvasLine(
      this.x + this.width - 120, this.y - highscores.scrollHeight, design.borderKey,
      gD, this.x + this.width - 120, this.y + this.height - highscores.scrollHeight
    );
    drawCanvasLine(
      this.x + this.width - 20, this.y - highscores.scrollHeight, design.borderKey,
      gD, this.x + this.width - 20, this.y + this.height - highscores.scrollHeight
    );
    drawCanvasRectBorder(this.x, this.y - highscores.scrollHeight, this.width, this.height, design.borderKey, gD);
  };
  this.getSaveData = function() {
    return this.highscore;
  };
}

/**
 * shows details of a selected highscore
 * @param {number} x        x-coordinate of the top-left corner of the details on the canvas
 * @param {number} y        y-coordinate of the top-left corner of the details on the canvas
 * @param {number} width    width of the details on the canvas
 * @param {number} height   height of the details on the canvas
 * @param {string} styleKey the design to use for the details
 */
function HighscoreDetails(x, y, width, height, styleKey) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.styleKey = styleKey;
  this.visible = false;
  this.currentHighscore = null;
  this.setVisible = function() {
    this.visible = true;
  };
  this.setInvisible = function() {
    this.visible = false;
  };
  /**
   * sets a new highscore to get the details from
   * @param {Object} highscore the highscore object to use
   */
  this.setHighscore = function(highscore) {
    this.currentHighscore = highscore;
  };
  /**
   * draws the objects onto the canvas
   * @param {GlobalDict} gD the global dictionary
   */
  this.draw = function(gD) {
    if (this.currentHighscore === null || !this.visible) {
      return;
    }
    
    let design = null;
    design = gD.design.elements[this.styleKey];

    drawCanvasRect(this.x, this.y, this.width, this.height, design.rectKey.modal, gD);
    drawCanvasRect(
      this.x + 250, this.y + 85, 500, 180, 
      design.rectKey[this.currentHighscore.stage] ? design.rectKey[this.currentHighscore.stage] : 
        design.rectKey.background, 
      gD
    );

    drawCanvasText(this.x + 500, this.y + 95, this.currentHighscore.name, design.textKey.headline, gD);
    drawCanvasText(this.x + 256, this.y + 85 + 30, "Distance: " + this.currentHighscore.distance + "m", design.textKey.text, gD);
    drawCanvasText(this.x + 256, this.y + 85 + 50, "Level: " + this.currentHighscore.level, design.textKey.text, gD);
    drawCanvasText(this.x + 256, this.y + 85 + 70, "Cash: " + this.currentHighscore.cash, design.textKey.text, gD);
    drawCanvasText(this.x + 256, this.y + 85 + 90, "Money 1: " + this.currentHighscore.money1, design.textKey.text, gD);
    drawCanvasText(this.x + 256, this.y + 85 + 110, "Money 10: " + this.currentHighscore.money10, design.textKey.text, gD);
    drawCanvasText(this.x + 256, this.y + 85 + 130, "Money 100: " + this.currentHighscore.money100, design.textKey.text, gD);
    drawCanvasText(this.x + 256, this.y + 85 + 150, "Money 1000: " + this.currentHighscore.money1000, design.textKey.text, gD);
    drawCanvasText(this.x + 256, this.y + 85 + 170, "Bonus: " + this.currentHighscore.bonus, design.textKey.text, gD);
    drawCanvasText(this.x + 506, this.y + 85 + 30, "Stage: " + this.currentHighscore.stage, design.textKey.text, gD);
    drawCanvasLine(this.x + 250, this.y + 85 + 20, design.borderKey, gD, this.x + this.width - 250, this.y + 105);
    drawCanvasRectBorder(this.x + 250, this.y + 85, 500, 180, design.borderKey, gD);
  };
}