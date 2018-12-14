function Controls(menu, gD) {
  this.menu = menu;
  this.gD = gD;
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
  };
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
  this.updateKeyPresses = function() {
    this.gD.newKeys.map(key => {
      if (this.newKeyMode) {
        this.setNewKey(key);
        return;
      }

      this.mC.updateKeyPresses(key, this.gD);

      var rowIndex = this.mC.selectedNGRowIndex;
      var columnIndex = this.mC.selectedNGColumnIndex;

      if (this.keyBindings.get('Controls_DeleteKey')[2].includes(key)) {
        this.keyBindings.get(this.keyEntries[rowIndex].name)[1].splice(columnIndex, 1);
        this.keyBindings.get(this.keyEntries[rowIndex].name)[2].splice(columnIndex, 1);
      }
    }, this);
  };
  this.updateMouseMoves = function() {
    this.mC.updateMouseMoves(this.gD);
  };
  this.updateClick = function() {
    var clickPos = this.gD.clicks.pop();
    if (!clickPos) {
      return
    }

    this.mC.updateClick(clickPos, this.gD);
  };
  this.updateWheelMoves = function() {
    var wheelMove = this.gD.wheelMovements.pop();
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
  this.update = function() {
    /* unused */
  };
  this.draw = function(ghostFactor) {
    this.gD.context.drawImage(this.menu.backgroundImage, 0, 0);

    this.title.draw(this.gD);
    this.scrollBar.draw(this.gD);

    this.mC.draw(this.gD);

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

    drawCanvasRectBorder(200, 60, 600, 220, "standard", this.gD);
  };
  this.vScroll = function(elementsScrolled) {
    this.scrollHeight = elementsScrolled * 20;
    this.scrollBar.scroll(elementsScrolled);
  };
}

function ControlEntryHeadline(x, y, width, height, text, styleKey) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.text = text;
  this.styleKey = styleKey;
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

function ControlEntry(x, y, width, height, name, styleKey) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.name = name;
  this.styleKey = styleKey;
  this.selected = 0;
  this.keys = [];
  this.init = function() {
    this.keys.push(new ControlKey(this.x + this.width - 200, this.y, 100, this.height, this.name, 0, this.styleKey));
    this.keys.push(new ControlKey(this.x + this.width - 100, this.y, 100, this.height, this.name, 1, this.styleKey));
  };
  this.select = function(index) {
    this.keys[index].select();
    this.selected = index;
  };
  this.deselect = function() {
    this.keys[this.selected].deselect();
  };
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

function ControlKey(x, y, width, height, name, keyNr, styleKey) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.name = name;
  this.keyNr = keyNr;
  this.styleKey = styleKey;
  this.selected = false;
  this.select = function() {
    this.selected = true;
  };
  this.deselect = function() {
    this.selected = false;
  };
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

function updateControlsSelection(controls, rowIndex, columnIndex, scroll) {
  if (controls.selectedRowIndex === -1) {
    controls.backToMenu.deselect();
  } else {
    controls.keyEntries[controls.selectedRowIndex].deselect();
  }

  if (rowIndex === -1) {
    controls.backToMenu.select();
  } else {
    controls.keyEntries[rowIndex].select(columnIndex);
    if (scroll) {
      if (controls.keyEntries[rowIndex].y - controls.scrollHeight >= 240) {
        controls.vScroll(Math.min(
          (controls.keyEntries[rowIndex].y - 220) / 20,
          (controls.keyEntries[controls.keyEntries.length - 1].y - 260) / 20
        ));
      } else if (controls.keyEntries[rowIndex].y - controls.scrollHeight <= 100) {
        controls.vScroll(Math.max(
          (controls.keyEntries[rowIndex].y - 100) / 20,
          0
        ));
      }
    }
  }

  controls.selectedRowIndex = rowIndex;
  controls.selectedColumnIndex = columnIndex;
}