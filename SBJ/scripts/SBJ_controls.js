function Controls(menu, gD) {
  this.menu = menu;
  this.gD = gD;
  /**
   * initiates the object
   */
  this.init = function() {
    this.newKeyMode = false;
    this.keyBindings = new Map([   //Definition, representation, code
      ["Menu_NavDown", ["Navigation runter", ["S", String.fromCharCode(8595)], ["KeyS", "ArrowDown"]]],
      ["Menu_NavUp", ["Navigation hoch", ["W", String.fromCharCode(8593)], ["KeyW", "ArrowUp"]]],
      ["Menu_NavRight", ["Navigation rechts", ["D", String.fromCharCode(8594)], ["KeyD", "ArrowRight"]]],
      ["Menu_NavLeft", ["Navigation links", ["A", String.fromCharCode(8592)], ["KeyA", "ArrowLeft"]]],
      ["Menu_Confirm", ["Bestätigen", ["Enter", "Space"], ["Enter", "Space"]]],
      ["Menu_Back", ["zur vorherigen Seite gehen", ["Escape"], ["Escape"]]],
      ["Menu_Abort", ["Tätigkeit abbrechen", ["Escape"], ["Escape"]]],
      ["Menu_Refresh", ["Daten neu laden", ["R"], ["KeyR"]]],
      ["NameModal_NavRight", ["Navigation rechts", [String.fromCharCode(8594)], ["ArrowRight"]]],
      ["NameModal_NavLeft", ["Navigation links", [String.fromCharCode(8592)], ["ArrowLeft"]]],
      ["NameModal_DeleteLeft", ["Linkes Zeichen löschen", [" " + String.fromCharCode(8612) + " "], ["Backspace"]]],
      ["NameModal_DeleteRight", ["Rechtes Zeichen löschen", ["Delete"], ["Delete"]]],
      ["NameModal_Confirm", ["Bestätigen", ["Enter"], ["Enter"]]],
      ["NameModal_Abort", ["Tätigkeit abbrechen", ["Escape"], ["Escape"]]],
      ["Controls_DeleteKey", ["Tastenzuweisung löschen", ["Delete"], ["Delete"]]],
      ["Game_Pause", ["Spiel pausieren", ["Escape"], ["Escape"]]],
      ["Game_MoveRight", ["Vorwärts bewegen", ["D", String.fromCharCode(8594)], ["KeyD", "ArrowRight"]]],
      ["Game_MoveLeft", ["Rückwärts bewegen", ["A", String.fromCharCode(8592)], ["KeyA", "ArrowLeft"]]],
      ["Game_JumpFromPlatform", ["Von der Plattform runterspringen", ["S", String.fromCharCode(8595)], ["KeyS", "ArrowDown"]]],
      ["Game_Jump", ["Springen", ["Space"], ["Space"]]],
      ["Game_ItemStopwatch", ["Stoppuhr benutzen", ["1"], ["Digit1"]]],
      ["Game_ItemStar", ["Stern benutzen", ["2"], ["Digit2"]]],
      ["Game_ItemFeather", ["Feder benutzen", ["3"], ["Digit3"]]],
      ["Game_ItemTreasure", ["Schatztruhe benutzen", ["4"], ["Digit4"]]],
      ["Game_ItemMagnet", ["Magnet benutzen", ["5"], ["Digit5"]]],
      ["Game_ItemRocket", ["Rakete benutzen", ["6"], ["Digit6"]]],
      ["Mute_All", ["Alles muten", ["M"], ["KeyM"]]]
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

    var headline = "";

    for (var key of this.keyBindings.keys()) {
      if (key.split("_")[0] !== headline) {
        headline = key.split("_")[0];
        this.keyEntryHeadlines.push(new ControlEntryHeadline(
          (this.gD.canvas.width / 2) - 300, 60 + ((this.keyEntryHeadlines.length + this.keyEntries.length) * 20),
          600, 20, headline, "controlsHeadline"
        ));
      }

      var entry = new ControlEntry(
        (this.gD.canvas.width / 2) - 300, 60 + ((this.keyEntryHeadlines.length + this.keyEntries.length) * 20),
        600, 20, key, "controlsEntry"
      );
      entry.init();
      this.keyEntries.push(entry);
    }

    this.scrollBar = new CanvasScrollBar(this.gD.canvas.width - 165, 60, 220, 20, (this.keyEntryHeadlines.length + this.keyEntries.length), "scrollBarStandard");

    this.backToMenu = new CanvasButton(this.gD.canvas.width / 2 - 100, this.gD.canvas.height - 50, 200, 30, "Main Menu", "menu");

    this.updateSelection(-1, 0);
  };
  /**
   * activates the new key mode and prepares for a new key
   */
  this.activateNewKeyMode = function() {
    var selectedEntry = this.keyEntries[this.selectedRowIndex];
    if (!this.newKeyMode) {
      this.newKeyMode = true;
    } else {
      if (this.oldKey === undefined) {
        delete this.keyBindings.get(this.newKeyEntry[0])[1][this.newKeyEntry[1]];
      } else {
        this.keyBindings.get(this.newKeyEntry[0])[1][this.newKeyEntry[1]] = this.oldKey;
      }
    }
    this.oldKey = this.keyBindings.get(selectedEntry.name)[1][this.selectedColumnIndex];
    this.keyBindings.get(selectedEntry.name)[1][this.selectedColumnIndex] = "...";
    this.newKeyEntry = [selectedEntry.name, this.selectedColumnIndex];
  };
  /**
   * sets a new key when new key mode is active
   * @param {string} key a key code of a new key
   */
  this.setNewKey = function(key) {
    if (key.startsWith('Key') || key.startsWith('Digit')) {
      this.keyBindings.get(this.newKeyEntry[0])[1][this.newKeyEntry[1]] = key.slice(-1);
    } else {
      if (this.visualKeys[key] !== undefined) {
        this.keyBindings.get(this.newKeyEntry[0])[1][this.newKeyEntry[1]] = this.visualKeys[key];
      } else {
        this.keyBindings.get(this.newKeyEntry[0])[1][this.newKeyEntry[1]] = key;
      }
    }
    this.keyBindings.get(this.newKeyEntry[0])[2][this.newKeyEntry[1]] = key;
    this.newKeyMode = false;
    this.gD.save.keyBindings = Array.from(this.keyBindings.entries());
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

      var keyB = this.keyBindings;
      var rowIndex = this.selectedRowIndex;
      var columnIndex = this.selectedColumnIndex;

      if (keyB.get("Menu_NavDown")[2].includes(key)) {
        rowIndex++;
        if (rowIndex >= this.keyEntries.length) {
          this.updateSelection(-1, columnIndex, true);
        } else {
          this.updateSelection(rowIndex, columnIndex, true);
        }
      } else if (keyB.get("Menu_NavUp")[2].includes(key)) {
        rowIndex--;
        if (rowIndex < -1) {
          this.updateSelection(this.keyEntries.length - 1, columnIndex, true);
        } else {
          this.updateSelection(rowIndex, columnIndex, true);
        }
      } else if (keyB.get("Menu_NavLeft")[2].includes(key)) {
        columnIndex--;
        if (columnIndex < 0) {
          this.updateSelection(rowIndex, this.keyEntries[0].keys.length - 1, true);
        } else {
          this.updateSelection(rowIndex, columnIndex, true);
        }
      } else if (keyB.get("Menu_NavRight")[2].includes(key)) {
        columnIndex++;
        if (columnIndex >= this.keyEntries[0].keys.length) {
          this.updateSelection(rowIndex, 0, true);
        } else {
          this.updateSelection(rowIndex, columnIndex, true);
        }
      } else if (keyB.get("Menu_Confirm")[2].includes(key)) {
        if (rowIndex >= 0) {
          this.activateNewKeyMode();
        } else {
          this.gD.currentPage = this.menu;
        }
      } else if (keyB.get("Menu_Back")[2].includes(key)) {
        gD.currentPage = this.menu;
      } else if (keyB.get("Controls_DeleteKey")[2].includes(key)) {
        keyB.get(this.keyEntries[rowIndex].name)[1].splice(columnIndex, 1);
        keyB.get(this.keyEntries[rowIndex].name)[2].splice(columnIndex, 1);
      }
    }, this);
  };
  /**
   * checks, if the mouse was moved, what the mouse hit 
   */
  this.updateMouseMoves = function() {
    this.keyEntries.map((keyEntry, rowIndex) => {
      keyEntry.keys.map((key, columnIndex) => {
        var realHeight = key.y - this.scrollHeight;
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
    var clickPos = this.gD.clicks.pop();
    if (!clickPos) {
      return
    }

    this.keyEntries.map((keyEntry, rowIndex) => {
      keyEntry.keys.map((key, columnIndex) => {
        var realHeight = key.y - this.scrollHeight;
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
    var wheelMove = this.gD.wheelMovements.pop();
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
    /* unused */
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
      var realHeight = entry.y - this.scrollHeight;
      if (realHeight >= 60 && realHeight < 280) {
        entry.draw(this, this.gD);
      }
    }, this);

    this.keyEntryHeadlines.map(headline => {
      var realHeight = headline.y - this.scrollHeight;
      if (realHeight >= 60 && realHeight < 280) {
        headline.draw(this, this.gD);
      }
    }, this);

    this.backToMenu.draw(this.gD);

    drawCanvasRectBorder(200, 60, 600, 220, "standard", this.gD);
  };
  /**
   * updates the selected object and deselects the old object
   * @param  {number} rowIndex    the row of the new selected object
   * @param  {number} columnIndex the column of the new selected object
   * @param  {bool}   scroll      if the action should influence scrolling
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
      var entry = this.keyEntries[rowIndex];
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
   * @param  {number} elementsScrolled the number of objects that should be scrolled
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
   * @param  {Controls} controls the controls object
   * @param  {GlobalDict} gD     the global dictionary
   */
  this.draw = function(controls, gD) {
    var design = gD.design.elements[this.styleKey];
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
  /**
   * draws the objects onto the canvas
   * @param  {Controls} controls the controls object
   * @param  {GlobalDict} gD     the global dictionary
   */
  this.draw = function(controls, gD) {
    var design = gD.design.elements[this.styleKey];
    drawCanvasRect(this.x, this.y - controls.scrollHeight, this.width - 200, this.height, design.rectKey.standard, gD);
    drawCanvasText(
      this.x + 5, this.y - controls.scrollHeight + (this.height / 2), 
      controls.keyBindings.get(this.name)[0], design.textKey.name, gD
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
  /**
   * draws the objects onto the canvas
   * @param  {Controls} controls the controls object
   * @param  {GlobalDict} gD     the global dictionary
   */
  this.draw = function(controls, gD) {
    var keyRef = controls.keyBindings.get(this.name)[1][this.keyNr];
    var design = gD.design.elements[this.styleKey];

    if (this.selected) {
      drawCanvasRect(this.x, this.y - controls.scrollHeight, this.width, this.height, design.rectKey.selected, gD);
    } else {
      drawCanvasRect(this.x, this.y - controls.scrollHeight, this.width, this.height, design.rectKey.standard, gD);
    }
    if (keyRef !== undefined) {
      var spriteKey = "Icon_KeyShort";
      if (keyRef.length > 1) {
        spriteKey = "Icon_KeyLong";
      }

      var [spriteX, spriteY, spriteWidth, spriteHeight] = gD.spriteDict[spriteKey];
      drawCanvasImage(
        this.x + (this.width - spriteWidth) / 2, this.y - controls.scrollHeight + (this.height - spriteHeight) / 2,
        spriteKey, gD
      );
      drawCanvasText(this.x + (this.width / 2), this.y - controls.scrollHeight + (this.height / 2), keyRef, design.textKey.key, gD);
    }
  };
}