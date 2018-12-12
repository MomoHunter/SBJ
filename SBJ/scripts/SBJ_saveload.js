function SaveLoad(menu, gD) {
  this.menu = menu;
  this.gD = gD;
  this.init = function() {
    this.filesLoaded = 0;
    this.savestates = [];
    this.buttons = ["Save", "Main Menu", "Load"];
    this.scrollHeight = 0;
    this.enterName = false;
    this.loaded = false;

    this.loadFile();

    this.title = new CanvasText(this.gD.canvas.width / 2, 30, "Save / Load", "pageTitle");

    this.infoText = new CanvasText(this.gD.canvas.width / 2, this.gD.canvas.height / 2, "", "instruction");

    this.buttons.map((name, index) => {
      this.buttons[index] = new CanvasButton(
        this.gD.canvas.width / 2 - 310 + 210 * index, this.gD.canvas.height - 50, 200, 30, this.buttons[index], "menu"
      );
    }, this);

    this.refreshButton = new CanvasImageButton(
      this.gD.canvas.width - 40, 10, 30, 30, "Icon_Refresh", "standardImage"
    );
    this.backButton = new CanvasButton(
      this.gD.canvas.width / 2 - 100, this.gD.canvas.height - 50, 200, 30, "Back", "menu"
    );
    this.backButton.select();

    this.scrollBar = new CanvasScrollBar(this.gD.canvas.width / 2 + 320, 60, 220, 55, 0, "scrollBarStandard");

    this.savestateDetails = new SLSavestateDetails(this.gD.canvas.width - 170, 60, 160, 220, "savestateDetails");

    this.enterNameModal = new CanvasEnterNameModal(0, 0, this.gD.canvas.width, this.gD.canvas.height, "enterNameModal");

    this.updateSelection(-1, 1, false);
  };
  this.loadFile = function() {
    var saveLoad = this;
    var newScript = document.createElement('script');

    newScript.setAttribute('type', 'text/javascript');
    newScript.setAttribute('src', 'saves/Savestate' + this.filesLoaded + '.txt');
    newScript.onload = function() {
      saveLoad.fileLoaded();
    };
    newScript.onerror = function(e) {
      console.log(saveLoad.filesLoaded + " savestates have been loaded!");
      saveLoad.getSavestates();
    };
    document.body.appendChild(newScript);
  };
  this.fileLoaded = function() {
    this.filesLoaded++;
    this.loadFile();
  };
  this.getSavestates = function() {
    this.savestates = [];
    for (var func in window) {
      if (typeof window[func] === 'function' && func.startsWith('Savestate')) {
        var savestate = new window[func];
        var pos = 0;
        this.savestates.map((state, index) => {
          if (state.date > savestate.date) {
            pos = index + 1;
          }
        }, this);
        this.savestates.splice(pos, 0, savestate);
      }
    }

    this.savestates.map((state, index) => {
      this.savestates[index] = new SLSavestate(
        (this.gD.canvas.width / 2) - 310, 60 + (55 * index), 620, 55, "savestate", state
      );
    }, this);

    this.scrollBar.refresh(this.savestates.length);
    this.selectedSavestate = undefined;
  };
  this.loadSavestate = function() {
    if (this.selectedSavestate === undefined) {
      return;
    }
    try {
      this.gD.save = JSON.parse(b64DecodeUnicode(this.savestates[this.selectedSavestate].savestate.data));
      if (this.gD.save.keyBindings) {
        this.menu.controls.keyBindings = new Map(this.gD.save.keyBindings);
      }
      this.infoText.text = "Erfolgreich geladen!";
      console.log("Erfolgreich geladen!");
    } catch (e) {
      this.infoText.text = "Fehler beim Laden!";
      console.log("Fehler beim Laden!");
    }
    this.loaded = true;
    this.markSavestate(undefined);
  };
  this.reloadSavestates = function() {
    Array.from(document.getElementsByTagName("script")).map(script => {
      if (script.src.includes('saves/Savestate')) {
        script.parentNode.removeChild(script);
      }
    }, this);
    this.filesLoaded = 0;
    this.loadFile();
  };
  this.createSavestate = function(name, spriteKey) {
    var data = [];
    data[0] = "this.name='" + name + "';";
    data[1] = "this.spriteKey='" + spriteKey + "';";
    data[2] = "this.date=" + Date.now() + ";";
    data[3] = "this.version='" + this.menu.version.text + "';";
    data[4] = "this.data='" + b64EncodeUnicode(JSON.stringify(this.gD.save)) + "';";
    this.downloadSavestate(
      "function Savestate" + Date.now() + "(){" + data.join('') + "}"
    );
  };
  this.downloadSavestate = function(savestate) {
    var element = document.createElement('a');
    var file = new Blob([savestate], {type: 'text/javascript'});
    element.href = URL.createObjectURL(file);
    element.download = "Savestate" + this.filesLoaded + ".txt";
    element.click();
  };
  this.updateKeyPresses = function() {
    this.gD.newKeys.map((key, index) => {
      var keyB = this.menu.controls.keyBindings;
      var rowIndex = this.selectedRowIndex;
      var columnIndex = this.selectedColumnIndex;

      if (this.loaded) {
        if (keyB.get("Menu_Confirm")[2].includes(key)) {
          this.loaded = false;
        }
      } else if (this.enterName) {
        if (keyB.get("NameModal_NavRight")[2].includes(key)) {
          this.enterNameModal.moveCursor(1);
        } else if (keyB.get("NameModal_NavLeft")[2].includes(key)) {
          this.enterNameModal.moveCursor(-1);
        } else if (keyB.get("NameModal_DeleteLeft")[2].includes(key)) {
          this.enterNameModal.deleteCharacter(-1);
        } else if (keyB.get("NameModal_DeleteRight")[2].includes(key)) {
          this.enterNameModal.deleteCharacter(1);
        } else if (keyB.get("NameModal_Confirm")[2].includes(key)) {
          this.enterName = false;
          this.createSavestate(this.enterNameModal.text, "Money_100_0");
        } else {
          var event = this.gD.events[index];
          if (event.key.length === 1) {
            this.enterNameModal.addCharacter(event.key);
          }
        }
      } else if (keyB.get("Menu_NavDown")[2].includes(key)) {
        rowIndex++;
        if (rowIndex >= this.savestates.length) {
          this.updateSelection(-1, columnIndex, true);
        } else {
          this.updateSelection(rowIndex, columnIndex, true);
        }
      } else if (keyB.get("Menu_NavUp")[2].includes(key)) {
        rowIndex--;
        if (rowIndex < -1) {
          this.updateSelection(this.savestates.length - 1, columnIndex, true);
        } else {
          this.updateSelection(rowIndex, columnIndex, true);
        }
      } else if (keyB.get("Menu_NavLeft")[2].includes(key)) {
        columnIndex--;
        if (columnIndex < 0) {
          this.updateSelection(rowIndex, this.buttons.length - 1, true);
        } else {
          this.updateSelection(rowIndex, columnIndex, true);
        }
      } else if (keyB.get("Menu_NavRight")[2].includes(key)) {
        columnIndex++;
        if (columnIndex >= this.buttons.length) {
          this.updateSelection(rowIndex, 0, true);
        } else {
          this.updateSelection(rowIndex, columnIndex, true);
        }
      } else if (keyB.get("Menu_Confirm")[2].includes(key)) {
        if (rowIndex >= 0) {
          this.markSavestate(rowIndex);
        } else {
          switch (columnIndex) {
            case 0:
              this.enterName = true;
              this.enterNameModal.text = "";
              break;
            case 1:
              this.gD.currentPage = this.menu;
              break;
            case 2:
              this.loadSavestate();
              break;
          }
        }
      } else if (keyB.get("Menu_Refresh")[2].includes(key)) {
        this.reloadSavestates();
      }
    }, this);
  };
  this.updateMouseMoves = function() {
    if (this.loaded) {
      return;
    }

    this.savestates.map((state, index) => {
      if (gD.mousePos.x >= state.x && gD.mousePos.x <= state.x + state.width &&
          gD.mousePos.y >= state.y - this.scrollHeight && gD.mousePos.y <= state.y + state.height - this.scrollHeight) {
        var realHeight = state.y - this.scrollHeight;
        if (realHeight >= 60 && realHeight < 280) {
          this.updateSelection(index, this.selectedColumnIndex, false);
        }
      }
    }, this);

    this.buttons.map((button, index) => {
      if (gD.mousePos.x >= button.x && gD.mousePos.x <= button.x + button.width &&
          gD.mousePos.y >= button.y && gD.mousePos.y <= button.y + button.height) {
        this.updateSelection(-1, index, false);
      }
    }, this);

    var button = this.refreshButton;
    var mouseOver = false;

    if (gD.mousePos.x >= button.x && gD.mousePos.x <= button.x + button.width &&
        gD.mousePos.y >= button.y && gD.mousePos.y <= button.y + button.height) {
      button.select();
      mouseOver = true;
    }

    if (!mouseOver) {
      button.deselect();
    }
  };
  this.updateClick = function() {
    var clickPos = this.gD.clicks.pop();
    if (!clickPos) {
      return;
    }

    if (this.loaded) {
      var button = this.backButton;
      if (gD.mousePos.x >= button.x && gD.mousePos.x <= button.x + button.width &&
          gD.mousePos.y >= button.y && gD.mousePos.y <= button.y + button.height) {
        this.loaded = false;
      }
    } else {
      this.savestates.map((state, index) => {
        if (clickPos.x >= state.x && clickPos.x <= state.x + state.width &&
            clickPos.y >= state.y - this.scrollHeight && clickPos.y <= state.y + state.height - this.scrollHeight) {
          var realHeight = state.y - this.scrollHeight;
          if (realHeight >= 60 && realHeight < 280) {
            this.markSavestate(index);
          }
        }
      }, this);

      this.buttons.map((button, index) => {
        if (clickPos.x >= button.x && clickPos.x <= button.x + button.width &&
            clickPos.y >= button.y && clickPos.y <= button.y + button.height) {
          switch (index) {
            case 0:
              this.enterName = true;
              this.enterNameModal.text = "";
              break;
            case 1:
              this.gD.currentPage = this.menu;
              break;
            case 2:
              this.loadSavestate();
              break;
          }
        }
      }, this);

      var button = this.refreshButton;

      if (gD.mousePos.x >= button.x && gD.mousePos.x <= button.x + button.width &&
          gD.mousePos.y >= button.y && gD.mousePos.y <= button.y + button.height) {
        this.reloadSavestates();
      }
    }
  };
  this.updateWheelMoves = function() {
    var wheelMove = this.gD.wheelMovements.pop();
    if (this.loaded) {
      return;
    }

    if (wheelMove < 0) {
      this.vScroll(Math.max(
        (this.scrollHeight / 55) - 1, 
        0
      ));
    } else if (wheelMove > 0) {
      this.vScroll(Math.min(
        (this.scrollHeight / 55) + 1, 
        (this.savestates[this.savestates.length - 1].y - 225) / 55
      ));
    }
  };
  this.update = function() {
    /* unused */
  };
  this.draw = function(ghostFactor) {
    this.gD.context.drawImage(this.menu.backgroundImage, 0, 0);
    this.title.draw(this.gD);
    if (this.loaded) {
      this.infoText.draw(this.gD);
      this.backButton.draw(this.gD);
    } else {
      this.scrollBar.draw(this.gD);
      this.savestateDetails.draw(this.gD);

      this.savestates.map(state => {
        var realHeight = state.y - this.scrollHeight;
        if (realHeight >= 60 && realHeight < 280) {
          state.draw(this, this.gD);
        }
      }, this);

      this.buttons.map(button => {
        button.draw(this.gD);
      }, this);

      this.refreshButton.draw(this.gD);

      if (this.enterName) {
        this.enterNameModal.draw(this.gD);
      }
    }
  };
  this.updateSelection = function(rowIndex, columnIndex, scroll) {
    if (this.selectedRowIndex !== undefined && this.selectedColumnIndex !== undefined) {
      if (this.selectedRowIndex === -1) {
        this.buttons[this.selectedColumnIndex].deselect();
      } else {
        this.savestates[this.selectedRowIndex].deselect();
        this.savestateDetails.setSavestate(null);
      }
    }

    if (rowIndex === -1) {
      this.buttons[columnIndex].select();
    } else {
      var savestate = this.savestates[rowIndex];
      savestate.select();
      this.savestateDetails.setSavestate(savestate.savestate);
      if (scroll) {
        if (savestate.y - this.scrollHeight >= 225) {
          this.vScroll(Math.min(
            (this.savestates[this.savestates.length - 1].y - 225) / 55, 
            (savestate.y - 170) / 55
          ));
        } else if (savestate.y - this.scrollHeight < 115) {
          this.vScroll(Math.max(
            (savestate.y - 115) / 55, 
            0
          ));
        }
      }
    }
    this.selectedRowIndex = rowIndex;
    this.selectedColumnIndex = columnIndex;
  };
  this.markSavestate = function(rowIndex) {
    if (this.selectedSavestate !== undefined) {
      this.savestates[this.selectedSavestate].demark();
    }
    if (rowIndex !== undefined) {
      this.savestates[rowIndex].mark();
    }
    this.selectedSavestate = rowIndex;
  };
  this.vScroll = function(elementsScrolled) {
    this.scrollHeight = elementsScrolled * 55;
    this.scrollBar.scroll(elementsScrolled);
  };
}

function SLSavestate(x, y, width, height, styleKey, savestate) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.styleKey = styleKey;
  this.savestate = savestate;
  this.selected = false;
  this.marked = false;
  this.select = function() {
    this.selected = true;
  };
  this.deselect = function() {
    this.selected = false;
  };
  this.mark = function() {
    this.marked = true;
  };
  this.demark = function() {
    this.marked = false;
  };
  this.draw = function(saveLoad, gD) {
    var design = gD.design.elements[this.styleKey];
    var date = new Date(this.savestate.date);
    date = date.toLocaleString('de-DE', {weekday: 'short'}) + " " + date.toLocaleString('de-DE');
    var [spriteX, spriteY, spriteWidth, spriteHeight] = gD.spriteDict[this.savestate.spriteKey];

    if (this.selected) {
      drawCanvasRect(this.x, this.y - saveLoad.scrollHeight, this.width, this.height, design.rectKey.selected, gD);
    } else {
      drawCanvasRect(this.x, this.y - saveLoad.scrollHeight, this.width, this.height, design.rectKey.standard, gD);
    }
    if (this.marked) {
      drawCanvasRect(this.x, this.y - saveLoad.scrollHeight, this.width, this.height, design.rectKey.marked, gD);
    }

    drawCanvasImage(this.x + (60 - spriteWidth) / 2, this.y + (this.height - spriteHeight) / 2 - saveLoad.scrollHeight, this.savestate.spriteKey, gD);
    drawCanvasText(this.x + 60, this.y + 6 - saveLoad.scrollHeight, "Name: " + this.savestate.name, design.textKey, gD);
    drawCanvasText(this.x + 60, this.y + 18 - saveLoad.scrollHeight, "Date: " + date, design.textKey, gD);
    drawCanvasText(this.x + 60, this.y + 30 - saveLoad.scrollHeight, "Version: " + this.savestate.version, design.textKey, gD);
    drawCanvasRectBorder(this.x, this.y - saveLoad.scrollHeight, this.width, this.height, design.borderKey, gD);
  };
}

function SLSavestateDetails(x, y, width, height, styleKey) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.styleKey = styleKey;
  this.currentSavestate = null;
  this.setSavestate = function(savestate) {
    this.currentSavestate = savestate;
  };
  this.draw = function(gD) {
    if (this.currentSavestate === null) {
      return;
    }

    var design = gD.design.elements[this.styleKey];
    var [spriteX, spriteY, spriteWidth, spriteHeight] = gD.spriteDict[this.currentSavestate.spriteKey];
    drawCanvasRect(this.x, this.y, this.width, this.height, design.rectKey, gD);
    drawCanvasImage(this.x + (this.width - spriteWidth) / 2, this.y + 10, this.currentSavestate.spriteKey, gD);
    drawCanvasText(this.x + 10, this.y + 50, "Name: " + this.currentSavestate.name, design.textKey, gD);
    drawCanvasText(this.x + 10, this.y + 62, "Date: " + this.currentSavestate.date, design.textKey, gD);
    drawCanvasText(this.x + 10, this.y + 74, "Version: " + this.currentSavestate.version, design.textKey, gD);
    drawCanvasRectBorder(this.x, this.y, this.width, this.height, design.borderKey, gD);
  };
}

function b64EncodeUnicode(str) {
  return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g,
    function toSolidBytes(match, p1) {
      return String.fromCharCode('0x' + p1);
  }));
}

function b64DecodeUnicode(str) {
  return decodeURIComponent(atob(str).split('').map(function(c) {
    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));
}