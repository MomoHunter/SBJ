function Controls(menu, gD) {
  this.menu = menu;
  this.gD = gD;
  /**
   * initiates the object
   */
  this.init = function() {
    this.newKeyMode = false;
    this.keyBindings = new Map([   //Headline, Definition, representation, code
      ["Menu_NavDown", ["Menü", "Navigation runter", ["S", String.fromCharCode(8595)], ["KeyS", "ArrowDown"]]],
      ["Menu_NavUp", ["Menü", "Navigation hoch", ["W", String.fromCharCode(8593)], ["KeyW", "ArrowUp"]]],
      ["Menu_NavRight", ["Menü", "Navigation rechts", ["D", String.fromCharCode(8594)], ["KeyD", "ArrowRight"]]],
      ["Menu_NavLeft", ["Menü", "Navigation links", ["A", String.fromCharCode(8592)], ["KeyA", "ArrowLeft"]]],
      ["Menu_Confirm", ["Menü", "Bestätigen", ["Enter", "Space"], ["Enter", "Space"]]],
      ["Menu_Back", ["Menü", "zur vorherigen Seite gehen", ["Escape"], ["Escape"]]],
      ["Menu_Abort", ["Menü", "Tätigkeit abbrechen", ["Escape"], ["Escape"]]],
      ["Menu_Refresh", ["Menü", "Daten neu laden", ["R"], ["KeyR"]]],
      ["NameModal_NavDown", ["Namen Modal", "Navigation runter", [String.fromCharCode(8595)], ["ArrowDown"]]],
      ["NameModal_NavUp", ["Namen Modal", "Navigation hoch", [String.fromCharCode(8593)], ["ArrowUp"]]],
      ["NameModal_NavRight", ["Namen Modal", "Navigation rechts", [String.fromCharCode(8594)], ["ArrowRight"]]],
      ["NameModal_NavLeft", ["Namen Modal", "Navigation links", [String.fromCharCode(8592)], ["ArrowLeft"]]],
      ["NameModal_DeleteLeft", ["Namen Modal", "Linkes Zeichen löschen", [" " + String.fromCharCode(8612) + " "], ["Backspace"]]],
      ["NameModal_DeleteRight", ["Namen Modal", "Rechtes Zeichen löschen", ["Delete"], ["Delete"]]],
      ["NameModal_Confirm", ["Namen Modal", "Bestätigen", ["Enter"], ["Enter"]]],
      ["NameModal_Abort", ["Namen Modal", "Tätigkeit abbrechen", ["Escape"], ["Escape"]]],
      ["Controls_DeleteKey", ["Steuerung", "Tastenzuweisung löschen", ["Delete"], ["Delete"]]],
      ["Game_Pause", ["Spiel", "Spiel pausieren", ["Escape"], ["Escape"]]],
      ["Game_MoveRight", ["Spiel", "Vorwärts bewegen", ["D", String.fromCharCode(8594)], ["KeyD", "ArrowRight"]]],
      ["Game_MoveLeft", ["Spiel", "Rückwärts bewegen", ["A", String.fromCharCode(8592)], ["KeyA", "ArrowLeft"]]],
      ["Game_JumpFromPlatform", ["Spiel", "Von der Plattform runterspringen", ["S", String.fromCharCode(8595)], ["KeyS", "ArrowDown"]]],
      ["Game_Jump", ["Spiel", "Springen", ["Space"], ["Space"]]],
      ["Game_ItemStopwatch", ["Spiel", "Stoppuhr benutzen", ["1"], ["Digit1"]]],
      ["Game_ItemStar", ["Spiel", "Stern benutzen", ["2"], ["Digit2"]]],
      ["Game_ItemFeather", ["Spiel", "Feder benutzen", ["3"], ["Digit3"]]],
      ["Game_ItemTreasure", ["Spiel", "Schatztruhe benutzen", ["4"], ["Digit4"]]],
      ["Game_ItemMagnet", ["Spiel", "Magnet benutzen", ["5"], ["Digit5"]]],
      ["Game_ItemRocket", ["Spiel", "Rakete benutzen", ["6"], ["Digit6"]]],
      ["Mute_All", ["Stumm schalten", "Alles muten", ["M"], ["KeyM"]]]
    ]);

    this.visualKeys = {
      "ArrowLeft": String.fromCharCode(8592),
      "ArrowUp": String.fromCharCode(8593),
      "ArrowRight": String.fromCharCode(8594),
      "ArrowDown": String.fromCharCode(8595),
      "Backspace": " " + String.fromCharCode(8612) + " ",
      "Minus": "ß",
      "BracketLeft": "Ü",
      "BracketRight": "+",
      "Semicolon": "Ö",
      "Quote": "Ä",
      "Backslash": "#",
      "Comma": ",",
      "Period": ".",
      "Slash": "-",
      "ShiftRight": String.fromCharCode(8679) + " R",
      "ShiftLeft": String.fromCharCode(8679) + " L",
      "IntlBackslash": "<",
      "Backquote": "^",
      "Equal": "´",
      "CapsLock": String.fromCharCode(8681),
      "Tab": " " + String.fromCharCode(8633) + " ",
      "ControlRight": "Strg R",
      "ControlLeft": "Strg L"
    };

    this.keyEntryHeadlines = [];
    this.keyEntries = [];
    this.scrollHeight = 0;
    this.oldKey = undefined;
    this.newKeyEntry = [];

    this.title = new CanvasText(this.gD.canvas.width / 2, 30, "Controls", "pageTitle");

    let headline = "";

    for (let key of this.keyBindings.keys()) {
      let keyHeadline = this.keyBindings.get(key)[0];
      if (keyHeadline !== headline) {
        headline = keyHeadline;
        this.keyEntryHeadlines.push(new ControlEntryHeadline(
          (this.gD.canvas.width / 2) - 310, 60 + ((this.keyEntryHeadlines.length + this.keyEntries.length) * 20),
          620, 20, headline, "controlsHeadline"
        ));
      }

      let entry = new ControlEntry(
        (this.gD.canvas.width / 2) - 310, 60 + ((this.keyEntryHeadlines.length + this.keyEntries.length) * 20),
        620, 20, key, "controlsEntry"
      );
      entry.init();
      this.keyEntries.push(entry);
    }

    this.scrollBar = new CanvasScrollBar(this.gD.canvas.width / 2 + 320, 60, 220, 20, (this.keyEntryHeadlines.length + this.keyEntries.length), "scrollBarStandard");

    this.backToMenu = new CanvasButton(this.gD.canvas.width / 2 - 100, this.gD.canvas.height - 50, 200, 30, "Main Menu", "menu");

    this.updateSelection(-1, 0, false);
  };
  this.getSaveData = function() {
    return Array.from(this.keyBindings.entries());
  };
  this.setSaveData = function(data) {
    this.keyBindings = new Map(data);
  };
  /**
   * activates the new key mode and prepares for a new key
   */
  this.activateNewKeyMode = function() {
    let selectedEntry = this.keyEntries[this.selectedRowIndex];
    if (!this.newKeyMode) {
      this.newKeyMode = true;
    } else {
      if (this.oldKey === undefined) {
        delete this.keyBindings.get(this.newKeyEntry[0])[2][this.newKeyEntry[1]];
      } else {
        this.keyBindings.get(this.newKeyEntry[0])[2][this.newKeyEntry[1]] = this.oldKey;
      }
    }
    this.oldKey = this.keyBindings.get(selectedEntry.name)[2][this.selectedColumnIndex];
    this.keyBindings.get(selectedEntry.name)[2][this.selectedColumnIndex] = "...";
    this.newKeyEntry = [selectedEntry.name, this.selectedColumnIndex];
  };
  /**
   * sets a new key when new key mode is active
   * @param {string} key a key code of a new key
   */
  this.setNewKey = function(key) {
    if (key.startsWith('Key') || key.startsWith('Digit')) {
      this.keyBindings.get(this.newKeyEntry[0])[2][this.newKeyEntry[1]] = key.slice(-1);
    } else {
      if (this.visualKeys[key] !== undefined) {
        this.keyBindings.get(this.newKeyEntry[0])[2][this.newKeyEntry[1]] = this.visualKeys[key];
      } else {
        this.keyBindings.get(this.newKeyEntry[0])[2][this.newKeyEntry[1]] = key;
      }
    }
    this.keyBindings.get(this.newKeyEntry[0])[3][this.newKeyEntry[1]] = key;
    this.newKeyMode = false;
  };
  /**
   * checks if a key is pressed and executes commands
   */
  this.updateKeyPresses = function() {
    this.gD.newKeys.map(key => {
      if (this.newKeyMode) {
        this.setNewKey(key);
        return;
      }

      let keyB = this.keyBindings;
      let rowIndex = this.selectedRowIndex;
      let columnIndex = this.selectedColumnIndex;

      if (keyB.get("Menu_NavDown")[3].includes(key)) {
        rowIndex++;
        if (rowIndex >= this.keyEntries.length) {
          this.updateSelection(-1, columnIndex, true);
        } else {
          this.updateSelection(rowIndex, columnIndex, true);
        }
      } else if (keyB.get("Menu_NavUp")[3].includes(key)) {
        rowIndex--;
        if (rowIndex < -1) {
          this.updateSelection(this.keyEntries.length - 1, columnIndex, true);
        } else {
          this.updateSelection(rowIndex, columnIndex, true);
        }
      } else if (keyB.get("Menu_NavLeft")[3].includes(key)) {
        columnIndex--;
        if (columnIndex < 0) {
          this.updateSelection(rowIndex, this.keyEntries[0].keys.length - 1, true);
        } else {
          this.updateSelection(rowIndex, columnIndex, true);
        }
      } else if (keyB.get("Menu_NavRight")[3].includes(key)) {
        columnIndex++;
        if (columnIndex >= this.keyEntries[0].keys.length) {
          this.updateSelection(rowIndex, 0, true);
        } else {
          this.updateSelection(rowIndex, columnIndex, true);
        }
      } else if (keyB.get("Menu_Confirm")[3].includes(key)) {
        if (rowIndex >= 0) {
          this.activateNewKeyMode();
        } else {
          this.gD.currentPage = this.menu;
        }
      } else if (keyB.get("Menu_Back")[3].includes(key)) {
        this.gD.currentPage = this.menu;
      } else if (keyB.get("Controls_DeleteKey")[3].includes(key)) {
        keyB.get(this.keyEntries[rowIndex].name)[2].splice(columnIndex, 1);
        keyB.get(this.keyEntries[rowIndex].name)[3].splice(columnIndex, 1);
      } else if (keyB.get("Mute_All")[3].includes(key)) {
        this.gD.muted = !this.gD.muted;
        this.menu.muteButton.setSprite();
      }
    }, this);
  };
  /**
   * checks, if the mouse was moved, what the mouse hit 
   */
  this.updateMouseMoves = function() {
    this.keyEntries.map((keyEntry, rowIndex) => {
      keyEntry.keys.map((key, columnIndex) => {
        let realHeight = key.y - this.scrollHeight;
        if (this.gD.mousePos.x >= key.x && this.gD.mousePos.x <= key.x + key.width &&
            this.gD.mousePos.y >= realHeight && this.gD.mousePos.y <= realHeight + key.height) {
          if (realHeight >= 60 && realHeight < 280) {
            this.updateSelection(rowIndex, columnIndex, false);
          }
        }
      }, this);
    }, this);

    if (this.gD.mousePos.x >= this.backToMenu.x && this.gD.mousePos.x <= this.backToMenu.x + this.backToMenu.width &&
        this.gD.mousePos.y >= this.backToMenu.y && this.gD.mousePos.y <= this.backToMenu.y + this.backToMenu.height) {
      this.updateSelection(-1, this.selectedColumnIndex, false);
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

    this.keyEntries.map((keyEntry, rowIndex) => {
      keyEntry.keys.map((key, columnIndex) => {
        let realHeight = key.y - this.scrollHeight;
        if (clickPos.x >= key.x && clickPos.x <= key.x + key.width &&
            clickPos.y >= realHeight && clickPos.y <= realHeight + key.height) {
          if (realHeight >= 60 && realHeight < 280) {
            this.activateNewKeyMode();
          }
        }
      }, this);
    }, this);

    if (clickPos.x >= this.backToMenu.x && clickPos.x <= this.backToMenu.x + this.backToMenu.width &&
        clickPos.y >= this.backToMenu.y && clickPos.y <= this.backToMenu.y + this.backToMenu.height) {
      this.gD.currentPage = this.menu;
    }
  };
  /**
   * checks if the mouse wheel was moved
   */
  this.updateWheelMoves = function() {
    let wheelMove = this.gD.wheelMovements.pop();
    if (!wheelMove) {
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
        (this.keyEntries[this.keyEntries.length - 1].y - 260) / 20
      ));
    }
  };
  /**
   * updates moving objects
   */
  this.update = function() {
    this.backToMenu.update();

    this.keyEntries.map(entry => {
      entry.update();
    }, this);
    
    this.menu.lightUpdate();
  };
  /**
   * draws the objects onto the canvas
   * @param {float} ghostFactor the part of a physics step since the last physics update
   */
  this.draw = function(ghostFactor) {
    this.gD.context.drawImage(this.menu.backgroundImage, 0, 0);

    this.title.draw(this.gD);
    this.scrollBar.draw(this.gD);

    this.keyEntries.map(entry => {
      let realHeight = entry.y - this.scrollHeight;
      if (realHeight >= 60 && realHeight < 280) {
        entry.draw(this, this.gD);
      }
    }, this);

    this.keyEntryHeadlines.map(headline => {
      let realHeight = headline.y - this.scrollHeight;
      if (realHeight >= 60 && realHeight < 280) {
        headline.draw(this, this.gD);
      }
    }, this);

    this.backToMenu.draw(this.gD);

    drawCanvasRectBorder(190, 60, 620, 220, "standard", this.gD);
    
    this.menu.lightDraw();
  };
  /**
   * updates the selected object and deselects the old object
   * @param {number} rowIndex    the row of the new selected object
   * @param {number} columnIndex the column of the new selected object
   * @param {boolean}   scroll      if the action should influence scrolling
   */
  this.updateSelection = function(rowIndex, columnIndex, scroll) {
    if (this.selectedRowIndex !== undefined && this.selectedColumnIndex !== undefined) {
      if (this.selectedRowIndex === -1) {
        this.backToMenu.deselect();
      } else {
        this.keyEntries[this.selectedRowIndex].deselect();
      }
    }

    if (rowIndex === -1) {
      this.backToMenu.select();
    } else {
      let entry = this.keyEntries[rowIndex];
      entry.select(columnIndex);
      if (scroll) {
        if (entry.y - this.scrollHeight >= 240) {
          this.vScroll(Math.min(
            (this.keyEntries[this.keyEntries.length - 1].y - 260) / 20, 
            (entry.y - 220) / 20
          ));
        } else if (entry.y - this.scrollHeight < 100) {
          this.vScroll(Math.max(
            (entry.y - 100) / 20, 
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
   * @param {number} elementsScrolled the number of objects that should be scrolled
   */
  this.vScroll = function(elementsScrolled) {
    this.scrollHeight = elementsScrolled * 20;
    this.scrollBar.scroll(elementsScrolled);
  };
}

/**
 * a headline for key entries
 * @param {number} x        x-coordinate of the top-left corner of the headline on the canvas
 * @param {number} y        y-coordinate of the top-left corner of the headline on the canvas
 * @param {number} width    width of the headline on the canvas
 * @param {number} height   height of the headline on the canvas
 * @param {string} text     the text to write as the headline
 * @param {string} styleKey the design to use for the headline
 */
function ControlEntryHeadline(x, y, width, height, text, styleKey) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.text = text;
  this.styleKey = styleKey;
  /**
   * draws the objects onto the canvas
   * @param {Controls} controls the controls object
   * @param {GlobalDict} gD     the global dictionary
   */
  this.draw = function(controls, gD) {
    let design = gD.design.elements[this.styleKey];
    drawCanvasRect(this.x, this.y - controls.scrollHeight, this.width, this.height, design.rectKey, gD);
    drawCanvasText(
      this.x + (this.width / 2), this.y + (this.height / 2) - controls.scrollHeight, 
      this.text, design.textKey, gD
    );
    drawCanvasRectBorder(this.x, this.y - controls.scrollHeight, this.width, this.height, design.borderKey, gD);
  };
}

/**
 * an entry for a key assignment
 * @param {number} x        x-coordinate of the top-left corner of the entry on the canvas
 * @param {number} y        y-coordinate of the top-left corner of the entry on the canvas
 * @param {number} width    width of the entry on the canvas
 * @param {number} height   height of the entry on the canvas
 * @param {string} name     the name to write for the entry
 * @param {string} styleKey the design to use for the entry
 */
function ControlEntry(x, y, width, height, name, styleKey) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.name = name;
  this.styleKey = styleKey;
  this.selected = 0;
  this.keys = [];
  /**
   * initiates the object
   */
  this.init = function() {
    this.keys.push(new ControlKey(this.x + this.width - 200, this.y, 100, this.height, this.name, 0, this.styleKey));
    this.keys.push(new ControlKey(this.x + this.width - 100, this.y, 100, this.height, this.name, 1, this.styleKey));
  };
  /**
   * selects a key assignment
   * @param {number} index the index of the key of this entry
   */
  this.select = function(index) {
    this.keys[index].select();
    this.selected = index;
  };
  /**
   * deselects the key assignment
   */
  this.deselect = function() {
    this.keys[this.selected].deselect();
  };
  this.update = function() {
    this.keys.map(key => {
      key.update();
    });
  };
  /**
   * draws the objects onto the canvas
   * @param {Controls} controls the controls object
   * @param {GlobalDict} gD     the global dictionary
   */
  this.draw = function(controls, gD) {
    let design = gD.design.elements[this.styleKey];
    drawCanvasRect(this.x, this.y - controls.scrollHeight, this.width - 200, this.height, design.rectKey.standard, gD);
    drawCanvasText(
      this.x + 5, this.y - controls.scrollHeight + (this.height / 2), 
      controls.keyBindings.get(this.name)[1], design.textKey.name, gD
    );
    this.keys.map(key => {
      key.draw(controls, gD);
    });
  };
}

/**
 * a specific key assignment of an entry
 * @param {number} x        x-coordinate of the top-left corner of the key assignment on the canvas
 * @param {number} y        y-coordinate of the top-left corner of the key assignment on the canvas
 * @param {number} width    width of the key assignment on the canvas
 * @param {number} height   height of the key assignment on the canvas
 * @param {string} name     the name to write as the key assignment
 * @param {number} keyNr    the key number of this assignment
 * @param {string} styleKey the design to use for the entry
 */
function ControlKey(x, y, width, height, name, keyNr, styleKey) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.name = name;
  this.keyNr = keyNr;
  this.styleKey = styleKey;
  this.arrowWidth = 0;
  this.arrowHeight = 0;
  this.animationSpeed = 12;
  this.selected = false;
  /**
   * selects a key assignment
   */
  this.select = function() {
    this.selected = true;
  };
  /**
   * deselects the key assignment
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
   * @param {Controls}   controls the controls object
   * @param {GlobalDict} gD       the global dictionary
   */
  this.draw = function(controls, gD) {
    let keyRef = controls.keyBindings.get(this.name)[2][this.keyNr];
    let design = gD.design.elements[this.styleKey];
    let centerX = this.x + this.width / 2;
    let centerY = this.y + this.height / 2 - controls.scrollHeight;

    drawCanvasRect(this.x, this.y - controls.scrollHeight, this.width, this.height, design.rectKey.standard, gD);
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
    if (keyRef !== undefined) {
      let spriteKey = "Icon_KeyShort";
      if (keyRef.length > 1) {
        spriteKey = "Icon_KeyLong";
      }

      let {spriteWidth, spriteHeight} = getSpriteData(spriteKey, gD);
      drawCanvasImage(
        this.x + (this.width - spriteWidth) / 2, this.y - controls.scrollHeight + (this.height - spriteHeight) / 2,
        spriteKey, gD
      );
      drawCanvasText(this.x + (this.width / 2), this.y - controls.scrollHeight + (this.height / 2), keyRef, design.textKey.key, gD);
    }
  };
}