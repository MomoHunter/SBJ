function Controls(gD, menu) {
  this.gD = gD;
  this.menu = menu;
  this.init = function() {
    this.newKeyMode = false;
    this.keyBindings = new Map([   //Definition, representation, code
      ["Menu_NavDown", ["Navigation runter", ["S", String.fromCharCode(8595)], ["KeyS", "ArrowDown"]]],
      ["Menu_NavUp", ["Navigation hoch", ["W", String.fromCharCode(8593)], ["KeyW", "ArrowUp"]]],
      ["Menu_NavRight", ["Navigation rechts", ["D", String.fromCharCode(8594)], ["KeyD", "ArrowRight"]]],
      ["Menu_NavLeft", ["Navigation links", ["A", String.fromCharCode(8592)], ["KeyA", "ArrowLeft"]]],
      ["Menu_Confirm", ["Bestätigen", ["Enter", "Space"], ["Enter", "Space"]]],
      ["SelectionScreen_NavRight", ["Navigation rechts", ["D", String.fromCharCode(8594)], ["KeyD", "ArrowRight"]]],
      ["SelectionScreen_NavLeft", ["Navigation links", ["A", String.fromCharCode(8592)], ["KeyA", "ArrowLeft"]]],
      ["SelectionScreen_Confirm", ["Bestätigen", ["Enter", "Space"], ["Enter", "Space"]]],
      ["SelectionScreen_Abort", ["Abbrechen", ["Escape"], ["Escape"]]],
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
      ["FinishModal_NavDown", ["Navigation runter", ["S", String.fromCharCode(8595)], ["KeyS", "ArrowDown"]]],
      ["FinishModal_NavUp", ["Navigation hoch", ["W", String.fromCharCode(8593)], ["KeyW", "ArrowUp"]]],
      ["FinishModal_Confirm", ["Bestätigen", ["Enter", "Space"], ["Enter", "Space"]]],
      ["Shop_NavDown", ["Navigation runter", ["S", String.fromCharCode(8595)], ["KeyS", "ArrowDown"]]],
      ["Shop_NavUp", ["Navigation hoch", ["W", String.fromCharCode(8593)], ["KeyW", "ArrowUp"]]],
      ["Shop_NavRight", ["Navigation rechts", ["D", String.fromCharCode(8594)], ["KeyD", "ArrowRight"]]],
      ["Shop_NavLeft", ["Navigation links", ["A", String.fromCharCode(8592)], ["KeyA", "ArrowLeft"]]],
      ["Shop_Confirm", ["Bestätigen", ["Enter", "Space"], ["Enter", "Space"]]],
      ["Shop_Abort", ["Abbrechen", ["Escape"], ["Escape"]]],
      ["Achievements_NavDown", ["Navigation runter", ["S", String.fromCharCode(8595)], ["KeyS", "ArrowDown"]]],
      ["Achievements_NavUp", ["Navigation hoch", ["W", String.fromCharCode(8593)], ["KeyW", "ArrowUp"]]],
      ["Achievements_NavRight", ["Navigation rechts", ["D", String.fromCharCode(8594)], ["KeyD", "ArrowRight"]]],
      ["Achievements_NavLeft", ["Navigation links", ["A", String.fromCharCode(8592)], ["KeyA", "ArrowLeft"]]],
      ["Achievements_Confirm", ["Bestätigen", ["Enter", "Space"], ["Enter", "Space"]]],
      ["Achievements_Abort", ["Abbrechen", ["Escape"], ["Escape"]]],
      ["Save_Confirm", ["Bestätigen", ["Enter", "Space"], ["Enter", "Space"]]],
      ["Load_Confirm", ["Bestätigen", ["Enter", "Space"], ["Enter", "Space"]]],
      ["Highscores_NavDown", ["Navigation runter", ["S", String.fromCharCode(8595)], ["KeyS", "ArrowDown"]]],
      ["Highscores_NavUp", ["Navigation hoch", ["W", String.fromCharCode(8593)], ["KeyW", "ArrowUp"]]],
      ["Highscores_Confirm", ["Bestätigen", ["Enter"], ["Enter"]]],
      ["Highscores_Abort", ["Abbrechen", ["Escape"], ["Escape"]]],
      ["Highscores_NavRight", ["Navigation rechts", [String.fromCharCode(8594)], ["ArrowRight"]]],
      ["Highscores_NavLeft", ["Navigation links", [String.fromCharCode(8592)], ["ArrowLeft"]]],
      ["Highscores_DeleteLeft", ["Linkes Zeichen löschen", ["Backspace"], ["Backspace"]]],
      ["Highscores_DeleteRight", ["Rechtes Zeichen löschen", ["Delete"], ["Delete"]]],
      ["Highscores_AbortEdit", ["Editieren abbrechen", ["Escape"], ["Escape"]]],
      ["Controls_NavDown", ["Navigation runter", ["S", String.fromCharCode(8595)], ["KeyS", "ArrowDown"]]],
      ["Controls_NavUp", ["Navigation hoch", ["W", String.fromCharCode(8593)], ["KeyW", "ArrowUp"]]],
      ["Controls_NavRight", ["Navigation rechts", ["D", String.fromCharCode(8594)], ["KeyD", "ArrowRight"]]],
      ["Controls_NavLeft", ["Navigation links", ["A", String.fromCharCode(8592)], ["KeyA", "ArrowLeft"]]],
      ["Controls_DeleteKey", ["Belegung löschen", ["Delete"], ["Delete"]]],
      ["Controls_Confirm", ["Bestätigen", ["Enter", "Space"], ["Enter", "Space"]]],
      ["Controls_Abort", ["Abbrechen", ["Escape"], ["Escape"]]],
      ["Mute_All", ["Alles muten", ["M"], ["KeyM"]]]
    ]);

    this.keyEntryHeadlines = [];
    this.keyEntries = [];
    this.selectedRowIndex = 0;
    this.selectedColumnIndex = 0;
    this.scrollHeight = 0;


    this.title = new Text(this.gD.canvas.width / 2, 30, "32pt", "Showcard Gothic, Impact", "rgba(200, 200, 200, 1)", "center", "middle", "Controls", 3);

    var headline = "";

    for (var key of this.keyBindings.keys()) {
      if (key.split("_")[0] !== headline) {
        headline = key.split("_")[0];
        this.keyEntryHeadlines.push(new ControlEntryHeadline(
          (this.gD.canvas.width / 2) - 300, 60 + ((this.keyEntryHeadlines.length + this.keyEntries.length) * 20), 600, 20, "rgba(50, 200, 80, 1)", headline, 2
        ));
      }

      var entry = new ControlEntry(
        (this.gD.canvas.width / 2) - 300, 60 + ((this.keyEntryHeadlines.length + this.keyEntries.length) * 20), 600, 20, "rgba(255, 255, 255, 1)", key, 2
        );
      entry.init();
      this.keyEntries.push(entry);
    }

    this.keyEntries[this.selectedRowIndex].select(this.selectedColumnIndex);

    this.scrollBar = new ScrollBar(this.gD.canvas.width - 165, 60, 220, 20, (this.keyEntryHeadlines.length + this.keyEntries.length), "rgba(255, 255, 255, 1)");

    this.backToMenu = new Button((this.gD.canvas.width / 2) - 100, this.gD.canvas.height - 50, 200, 30, "15pt", "Showcard Gothic, Impact", "rgba(255, 255, 255, 1)", "Main Menu", "rgba(0, 0, 0, .6)", 2);
  };
  this.vScroll = function(elementsScrolled) {
    this.scrollHeight = elementsScrolled * 20;
    this.scrollBar.scroll(elementsScrolled);
  };
  this.updateKeyPresses = function() {
    this.gD.newKeys.map(key => {
      if (this.newKeyMode) {
        this.keyEntries[this.selectedRowIndex].setNewKey(this, key);
        this.newKeyMode = false;
        this.gD.save.keyBindings = this.keyBindings;
        return;
      }

      var rowIndex = this.selectedRowIndex;
      var columnIndex = this.selectedColumnIndex;

      if (this.keyBindings.get('Controls_NavDown')[2].includes(key)) {
        rowIndex++;
        if (rowIndex >= this.keyEntries.length) {
          updateControlsSelection(this, -1, columnIndex, true);
        } else {
          updateControlsSelection(this, rowIndex, columnIndex, true);
        }
      } else if (this.keyBindings.get('Controls_NavUp')[2].includes(key)) {
        rowIndex--;
        if (rowIndex < -1) {
          updateControlsSelection(this, this.keyEntries.length - 1, columnIndex, true);
        } else {
          updateControlsSelection(this, rowIndex, columnIndex, true);
        }
      } else if (this.keyBindings.get('Controls_NavRight')[2].includes(key)) {
        columnIndex = (columnIndex + 1) % 2;
        updateControlsSelection(this, rowIndex, columnIndex, true);
      } else if (this.keyBindings.get('Controls_NavLeft')[2].includes(key)) {
        columnIndex = (columnIndex + 1) % 2;
        updateControlsSelection(this, rowIndex, columnIndex, true);
      } else if (this.keyBindings.get('Controls_DeleteKey')[2].includes(key)) {
        this.keyBindings.get(this.keyEntries[rowIndex].name)[1].splice(columnIndex, 1);
        this.keyBindings.get(this.keyEntries[rowIndex].name)[2].splice(columnIndex, 1);
      } else if (this.keyBindings.get('Controls_Confirm')[2].includes(key)) {
        if (rowIndex === -1) {
          this.gD.currentPage = this.menu;
        } else {
          this.newKeyMode = true;
          this.keyBindings.get(this.keyEntries[rowIndex].name)[1][columnIndex] = "...";
        }
      } else if (this.keyBindings.get('Controls_Abort')[2].includes(key)) {
        this.gD.currentPage = this.menu;
      }
    }, this);
  };
  this.updateMouseMoves = function() {
    this.keyEntries.map((entry, rowIndex) => {
      if (entry.y - this.scrollHeight < 280 && entry.y - this.scrollHeight >= 60) {
        entry.keys.map((key, columnIndex) => {
          if (this.gD.mousePos.x >= key.x && this.gD.mousePos.x < key.x + key.width &&
              this.gD.mousePos.y >= key.y - this.scrollHeight && this.gD.mousePos.y < key.y - this.scrollHeight + key.height) {
            updateControlsSelection(this, rowIndex, columnIndex, false);
          }
        }, this);
      }
    }, this);

    if (this.gD.mousePos.x >= this.backToMenu.x && this.gD.mousePos.x < this.backToMenu.x + this.backToMenu.width &&
        this.gD.mousePos.y >= this.backToMenu.y && this.gD.mousePos.y < this.backToMenu.y + this.backToMenu.height) {
      updateControlsSelection(this, -1, this.selectedColumnIndex, false);
    }
  };
  this.updateClicks = function() {

  };
  this.updateWheelMoves = function() {

  };
  this.update = function() {
    /* unused */
  };
  this.draw = function() {
    this.gD.context.drawImage(this.menu.backgroundImage, 0, 0);

    this.title.draw(this.gD);
    this.scrollBar.draw(this.gD);
    this.backToMenu.draw(this.gD);

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

    this.gD.context.lineWidth = 2;
    this.gD.context.strokeStyle = "rgba(0, 0, 0, 1)";
    this.gD.context.strokeRect(200, 60, 600, 220);
  };
}

function ControlEntryHeadline(x, y, width, height, color, text, bordersize) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.color = color;
  this.text = text;
  this.bordersize = bordersize;
  this.textAlign = "center";
  this.textBaseline = "middle";
  this.font = "bold 12pt Consolas";
  this.textColor = "rgba(0, 0, 0, 1)";
  this.borderColor = "rgba(0, 0, 0, 1)";
  this.draw = function(controls, gD) {
    gD.context.fillStyle = this.color;
    gD.context.fillRect(this.x, this.y - controls.scrollHeight, this.width, this.height);
    gD.context.textAlign = this.textAlign;
    gD.context.textBaseline = this.textBaseline;
    gD.context.font = this.font;
    gD.context.fillStyle = this.textColor;
    gD.context.fillText(this.text, this.x + (this.width / 2), this.y + (this.height / 2) - controls.scrollHeight);
    gD.context.strokeStyle = this.borderColor;
    gD.context.lineWidth = this.bordersize;
    gD.context.strokeRect(this.x, this.y - controls.scrollHeight, this.width, this.height);
  };
}

function ControlEntry(x, y, width, height, color, name, bordersize) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.color = color;
  this.name = name;
  this.bordersize = bordersize;
  this.textAlign = "start";
  this.textBaseline = "middle";
  this.font = "12pt Consolas";
  this.textColor = "rgba(0, 0, 0, 1)";
  this.selected = 0;
  this.keys = [];
  this.init = function() {
    this.keys.push(new ControlKey(this.x + this.width - 200, this.y, 100, this.height, this.color, this.name, 0, this.bordersize));
    this.keys.push(new ControlKey(this.x + this.width - 100, this.y, 100, this.height, this.color, this.name, 1, this.bordersize));
  };
  this.select = function(index) {
    this.keys[index].select();
    this.selected = index;
  };
  this.deselect = function() {
    this.keys[this.selected].deselect();
  };
  this.setNewKey = function(controls, key) {
    if (key.startsWith('Key') || key.startsWith('Digit')) {
      controls.keyBindings.get(this.name)[1][this.selected] = key.slice(-1);
    } else {
      switch (key) {
        case 'ArrowLeft':
          controls.keyBindings.get(this.name)[1][this.selected] = String.fromCharCode(8592);
          break;
        case 'ArrowUp':
          controls.keyBindings.get(this.name)[1][this.selected] = String.fromCharCode(8593);
          break;
        case 'ArrowRight':
          controls.keyBindings.get(this.name)[1][this.selected] = String.fromCharCode(8594);
          break;
        case 'ArrowDown':
          controls.keyBindings.get(this.name)[1][this.selected] = String.fromCharCode(8595);
          break;
        default:
          controls.keyBindings.get(this.name)[1][this.selected] = key;
      }
    }
    controls.keyBindings.get(this.name)[2][this.selected] = key;
  };
  this.draw = function(controls, gD) {
    gD.context.fillStyle = this.color;
    gD.context.fillRect(this.x, this.y - controls.scrollHeight, this.width - 200, this.height);
    gD.context.textAlign = this.textAlign;
    gD.context.textBaseline = this.textBaseline;
    gD.context.font = this.font;
    gD.context.fillStyle = this.textColor;
    gD.context.fillText(controls.keyBindings.get(this.name)[0], this.x + 5, this.y - controls.scrollHeight + (this.height / 2));
    this.keys.map(key => {
      key.draw(controls, gD);
    });
  };
}

function ControlKey(x, y, width, height, color, name, keyNr, bordersize) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.color = color;
  this.name = name;
  this.keyNr = keyNr;
  this.bordersize = bordersize;
  this.selectedColor = "rgba(180, 50, 50, 1)";
  this.textAlign = "center";
  this.textBaseline = "middle";
  this.font = "11pt Consolas";
  this.textColor = "rgba(0, 0, 0, 1)";
  this.selected = false;
  this.select = function() {
    this.selected = true;
  };
  this.deselect = function() {
    this.selected = false;
  };
  this.draw = function(controls, gD) {
    var keyRef = controls.keyBindings.get(this.name)[1][this.keyNr];

    if (this.selected) {
      gD.context.fillStyle = this.selectedColor;
    } else {
      gD.context.fillStyle = this.color;
    }
    gD.context.fillRect(this.x, this.y - controls.scrollHeight, this.width, this.height);
    if (keyRef !== undefined) {
      var spriteRef = gD.spriteDict["Icon_KeyShort"];
      if (keyRef.length > 1) {
        spriteRef = gD.spriteDict["Icon_KeyLong"];
      }

      gD.context.drawImage(gD.spritesheet, spriteRef[0], spriteRef[1], spriteRef[2], spriteRef[3],
        this.x + (this.width - spriteRef[2]) / 2, this.y - controls.scrollHeight + (this.height - spriteRef[3]) / 2, spriteRef[2], spriteRef[3]);
      gD.context.textAlign = this.textAlign;
      gD.context.textBaseline = this.textBaseline;
      gD.context.font = this.font;
      gD.context.fillStyle = this.textColor;
      gD.context.fillText(keyRef, this.x + (this.width / 2), this.y - controls.scrollHeight + (this.height / 2));
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

function controlsMouseMove(controls) {
  if (!controls.newKeyMode) {
    for (var i = 0; i < controls.keyEntries.length; i++) {
      if (controls.keyEntries[i].y >= 60 && controls.keyEntries[i].y < 280) {
        if (controls.gD.mousePos.x >= controls.keyEntries[i].keys[0].x && controls.gD.mousePos.x <= controls.keyEntries[i].keys[0].x + controls.keyEntries[i].keys[0].width &&
            controls.gD.mousePos.y >= controls.keyEntries[i].keys[0].y && controls.gD.mousePos.y <= controls.keyEntries[i].keys[0].y + controls.keyEntries[i].keys[0].height) {
          if (controls.selected < 0) {
            controls.backToMenu.deselect();
          } else {
            controls.keyEntries[controls.selected].select(0, true);
          }
          controls.keyEntries[i].select(0, false);
          controls.selected = i;
          break;
        } else if (controls.gD.mousePos.x >= controls.keyEntries[i].keys[1].x && controls.gD.mousePos.x <= controls.keyEntries[i].keys[1].x + controls.keyEntries[i].keys[1].width &&
            controls.gD.mousePos.y >= controls.keyEntries[i].keys[1].y && controls.gD.mousePos.y <= controls.keyEntries[i].keys[1].y + controls.keyEntries[i].keys[1].height) {
          if (controls.selected < 0) {
            controls.backToMenu.deselect();
          } else {
            controls.keyEntries[controls.selected].select(0, true);
          }
          controls.keyEntries[i].select(1, false);
          controls.selected = i;
          break;
        }
      }
    }
    if (controls.gD.mousePos.x >= controls.backToMenu.x && controls.gD.mousePos.x <= controls.backToMenu.x + controls.backToMenu.width &&
        controls.gD.mousePos.y >= controls.backToMenu.y && controls.gD.mousePos.y <= controls.backToMenu.y + controls.backToMenu.height) {
      if (controls.selected < 0) {
        controls.backToMenu.deselect();
      } else {
        controls.keyEntries[controls.selected].select(0, true);
      }
      controls.backToMenu.select();
      controls.selected = -1;
    }
    drawControls(controls);
  }
}

function controlsClick(controls) {
  if (!controls.newKeyMode) {
    if (controls.gD.mousePos.x >= controls.backToMenu.x && controls.gD.mousePos.x <= controls.backToMenu.x + controls.backToMenu.width &&
        controls.gD.mousePos.y >= controls.backToMenu.y && controls.gD.mousePos.y <= controls.backToMenu.y + controls.backToMenu.height) {
      controls.menu.show();
      controls.stop();
    } else if (controls.gD.mousePos.x >= controls.keyEntries[controls.selected].keys[controls.keyEntries[controls.selected].selected].x &&
        controls.gD.mousePos.x <= controls.keyEntries[controls.selected].keys[controls.keyEntries[controls.selected].selected].x + controls.keyEntries[controls.selected].keys[controls.keyEntries[controls.selected].selected].width &&
        controls.gD.mousePos.y >= controls.keyEntries[controls.selected].keys[controls.keyEntries[controls.selected].selected].y &&
        controls.gD.mousePos.y <= controls.keyEntries[controls.selected].keys[controls.keyEntries[controls.selected].selected].y + controls.keyEntries[controls.selected].keys[controls.keyEntries[controls.selected].selected].height) {
      controls.newKeyMode = true;
      controls.keyBindings[controls.keyEntries[controls.selected].name][1][controls.keyEntries[controls.selected].selected] = "...";
      drawControls(controls);
    }
  }
}

function controlsWheel(controls, event) {
  if (controls.selected >= 0) {
    if (event.deltaY > 0) {
      if (controls.selected + 1 < controls.keyEntries.length) {
        controls.keyEntries[controls.selected].select(0, true);
        controls.keyEntries[controls.selected + 1].select(controls.keyEntries[controls.selected].selected, false);
        if (controls.keyEntries[controls.keyEntries.length - 1].y != 260 && controls.keyEntries[controls.selected + 1].y > 220) {
          controls.vShift((controls.keyEntries[controls.selected + 1].y - 220) / 20);
        }
        controls.selected += 1;
      }
    } else {
      if (controls.selected - 1 >= 0) {
        controls.keyEntries[controls.selected].select(0, true);
        controls.keyEntries[controls.selected - 1].select(controls.keyEntries[controls.selected].selected, false);
        if (controls.keyEntryHeadlines[0].y != 60 && controls.keyEntries[controls.selected - 1].y < 100) {
          controls.vShift((controls.keyEntries[controls.selected - 1].y - 100) / 20);
        }
        controls.selected -= 1;
      }
    }
    drawControls(controls);
  }
}