function SaveLoad(menu, gD) {
  this.menu = menu;
  this.gD = gD;
  /**
   * initiates the object
   */
  this.init = function() {
    this.filesLoaded = 0;
    this.savestates = [];
    this.buttons = ["Save", "Main Menu", "Load"];
    this.scrollHeight = 0;
    this.enterName = false;
    this.choosePicture = false;
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
    this.choosePictureModal = new CanvasChoosePictureModal(0, 0, this.gD.canvas.width, this.gD.canvas.height, "choosePictureModal");
    this.choosePictureModal.init(this.gD);

    this.updateSelection(-1, 1, false);
  };
  /**
   * loads the next savestate-file that starts with 'Savestate' and the number from this.filesLoaded
   */
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
  /**
   * starts the loading of the next savestate-file, when a savestate-file has finished loading
   */
  this.fileLoaded = function() {
    this.filesLoaded++;
    this.loadFile();
  };
  /**
   * loads the loaded savestates into an array and creates the objects for display
   */
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
  /**
   * loads a savestate as current gamestate
   */
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
  /**
   * searches for new savestates and loads them
   */
  this.reloadSavestates = function() {
    Array.from(document.getElementsByTagName("script")).map(script => {
      if (script.src.includes('saves/Savestate')) {
        script.parentNode.removeChild(script);
      }
    }, this);
    this.filesLoaded = 0;
    this.loadFile();
    this.vScroll(0);
  };
  /**
   * creates a new savestate
   * @param  {string} name      the name of the savestate
   * @param  {string} spriteKey a spriteKey for the picture of the savestate
   */
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
  /**
   * initiates the download of a savestate-file
   * @param  {string} savestate a savestate that should be downloaded
   */
  this.downloadSavestate = function(savestate) {
    var element = document.createElement('a');
    var file = new Blob([savestate], {type: 'text/javascript'});
    element.href = URL.createObjectURL(file);
    element.download = "Savestate" + this.filesLoaded + ".txt";
    element.click();
  };
  /**
   * checks if a key is pressed and executes commands
   */
  this.updateKeyPresses = function() {
    this.gD.newKeys.map((key, index) => {
      var keyB = this.menu.controls.keyBindings;
      var rowIndex = this.selectedRowIndex;
      var columnIndex = this.selectedColumnIndex;

      if (this.loaded) {
        if (keyB.get("Menu_Confirm")[2].includes(key)) {
          this.loaded = false;
        }
      } else if (this.choosePicture) {
        this.choosePictureModal.updateKeyPresses(keyB, key);
        if (keyB.get("Menu_Confirm")[2].includes(key)) {
          var button = this.choosePictureModal.getSelectedButton();
          if (this.enterNameModal.text === "") {
            var date = new Date();
            this.createSavestate(date.toLocaleString('de-DE', {weekday:'short'}) + " " + date.toLocaleString('de-DE'), button.spriteKey);
          } else {
            this.createSavestate(this.enterNameModal.text, button.spriteKey);
          }
          this.enterName = false;
          this.choosePicture = false;
        } else if (keyB.get("Menu_Abort")[2].includes(key)) {
          this.enterName = false;
          this.choosePicture = false;
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
          this.choosePicture = true;
        } else if (keyB.get("NameModal_Abort")[2].includes(key)) {
          this.enterName = false;
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
  /**
   * checks, if the mouse was moved, what the mouse hit 
   */
  this.updateMouseMoves = function() {
    if (this.loaded || (this.enterName && !this.choosePicture)) {
      return;
    }

    if (this.choosePicture) {
      this.choosePictureModal.updateMouseMoves(this.gD);
    } else {
      this.savestates.map((state, index) => {
        if (this.gD.mousePos.x >= state.x && this.gD.mousePos.x <= state.x + state.width &&
            this.gD.mousePos.y >= state.y - this.scrollHeight && this.gD.mousePos.y <= state.y + state.height - this.scrollHeight) {
          var realHeight = state.y - this.scrollHeight;
          if (realHeight >= 60 && realHeight < 280) {
            this.updateSelection(index, this.selectedColumnIndex, false);
          }
        }
      }, this);

      this.buttons.map((button, index) => {
        if (this.gD.mousePos.x >= button.x && this.gD.mousePos.x <= button.x + button.width &&
            this.gD.mousePos.y >= button.y && this.gD.mousePos.y <= button.y + button.height) {
          this.updateSelection(-1, index, false);
        }
      }, this);

      var button = this.refreshButton;
      var mouseOver = false;

      if (this.gD.mousePos.x >= button.x && this.gD.mousePos.x <= button.x + button.width &&
          this.gD.mousePos.y >= button.y && this.gD.mousePos.y <= button.y + button.height) {
        button.select();
        mouseOver = true;
      }

      if (!mouseOver) {
        button.deselect();
      }
    }
  };
  /**
   * checks where a click was executed
   */
  this.updateClick = function() {
    var clickPos = this.gD.clicks.pop();
    if (!clickPos || (this.enterName && !this.choosePicture)) {
      return;
    }

    if (this.choosePicture) {
      var button = this.choosePictureModal.getSelectedButton();
      if (this.enterNameModal.text === "") {
        var date = new Date();
        this.createSavestate(date.toLocaleString('de-DE', {weekday:'short'}) + " " + date.toLocaleString('de-DE'), button.spriteKey);
      } else {
        this.createSavestate(this.enterNameModal.text, button.spriteKey);
      }
      this.enterName = false;
      this.choosePicture = false;
    } else if (this.loaded) {
      var button = this.backButton;
      if (clickPos.x >= button.x && clickPos.x <= button.x + button.width &&
          clickPos.y >= button.y && clickPos.y <= button.y + button.height) {
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
  /**
   * checks if the mouse wheel was moved
   */
  this.updateWheelMoves = function() {
    var wheelMove = this.gD.wheelMovements.pop();
    if (this.loaded || this.enterName || this.choosePicture) {
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
      if (this.choosePicture) {
        this.choosePictureModal.draw(this.gD);
      }
    }
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
  /**
   * marks a savestate and demarks the old selected savestate
   * @param  {number} rowIndex the row of the new marked savestate
   */
  this.markSavestate = function(rowIndex) {
    if (this.selectedSavestate !== undefined) {
      this.savestates[this.selectedSavestate].demark();
    }
    if (rowIndex !== undefined) {
      this.savestates[rowIndex].mark();
    }
    this.selectedSavestate = rowIndex;
  };
  /**
   * scrolls the page with a defined number of objects
   * @param  {number} elementsScrolled the number of objects that should be scrolled
   */
  this.vScroll = function(elementsScrolled) {
    this.scrollHeight = elementsScrolled * 55;
    this.scrollBar.scroll(elementsScrolled);
  };
}

/**
 * a savestate object for the canvas
 * @param {number} x         x-coordinate of the top-left corner of the savestate on the canvas
 * @param {number} y         y-coordinate of the top-left corner of the savestate on the canvas
 * @param {number} width     width of the savestate on the canvas
 * @param {number} height    height of the savestate on the canvas
 * @param {string} styleKey  the design to use for the savestate
 * @param {Savestate} savestate the savestate that should be used
 */
function SLSavestate(x, y, width, height, styleKey, savestate) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.styleKey = styleKey;
  this.savestate = savestate;
  this.selected = false;
  this.marked = false;
  /**
   * selects the savestate
   */
  this.select = function() {
    this.selected = true;
  };
  /**
   * deselects the savestate
   */
  this.deselect = function() {
    this.selected = false;
  };
  /**
   * marks the savestate
   */
  this.mark = function() {
    this.marked = true;
  };
  /**
   * demarks the savestate
   */
  this.demark = function() {
    this.marked = false;
  };
  /**
   * draws the savestate onto the canvas
   * @param  {SaveLoad}   saveLoad the saveLoad object
   * @param  {GlobalDict} gD       the global dictionary object
   */
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

    drawCanvasImage(
      this.x + Math.floor((55 - spriteWidth) / 2),
      this.y + Math.floor((this.height - spriteHeight) / 2) - saveLoad.scrollHeight, this.savestate.spriteKey, gD
    );
    drawCanvasText(this.x + 60, this.y + 7 - saveLoad.scrollHeight, "Name: " + this.savestate.name, design.textKey, gD);
    drawCanvasText(this.x + 60, this.y + 19 - saveLoad.scrollHeight, "Date: " + date, design.textKey, gD);
    drawCanvasText(this.x + 60, this.y + 31 - saveLoad.scrollHeight, "Version: " + this.savestate.version, design.textKey, gD);
    drawCanvasLine(this.x + 55, this.y, this.x + 55, this.y + this.height, design.borderKey, gD);
    drawCanvasRectBorder(this.x, this.y - saveLoad.scrollHeight, this.width, this.height, design.borderKey, gD);
  };
}

/**
 * an object that displays information from the selected savestate
 * @param {number} x         x-coordinate of the top-left corner of the detail view on the canvas
 * @param {number} y         y-coordinate of the top-left corner of the detail view on the canvas
 * @param {number} width     width of the detail view on the canvas
 * @param {number} height    height of the detail view on the canvas
 * @param {string} styleKey  the design to use for the detail view
 */
function SLSavestateDetails(x, y, width, height, styleKey) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.styleKey = styleKey;
  this.currentSavestate = null;
  /**
   * sets a new savestate
   * param {Savestate} savestate the savestate that should be used
   */
  this.setSavestate = function(savestate) {
    this.currentSavestate = savestate;
  };
  /**
   * draws the savestate details onto the canvas
   * @param  {globalDict} gD the global dictionary
   */
  this.draw = function(gD) {
    if (this.currentSavestate === null) {
      return;
    }

    var design = gD.design.elements[this.styleKey];
    var [spriteX, spriteY, spriteWidth, spriteHeight] = gD.spriteDict[this.currentSavestate.spriteKey];
    drawCanvasRect(this.x, this.y, this.width, this.height, design.rectKey, gD);
    drawCanvasImage(this.x + Math.floor((this.width - spriteWidth) / 2), this.y + Math.floor((55 - spriteHeight) / 2), this.currentSavestate.spriteKey, gD);
    drawCanvasText(this.x + 6, this.y + 60, "Name: " + this.currentSavestate.name.slice(0, 11) + "...", design.textKey, gD);
    drawCanvasText(this.x + 6, this.y + 72 + height, "Date: " + this.currentSavestate.date, design.textKey, gD);
    drawCanvasText(this.x + 6, this.y + 84 + height, "Version: " + this.currentSavestate.version, design.textKey, gD);
    drawCanvasRectBorder(this.x, this.y, this.width, this.height, design.borderKey, gD);
  };
}

/**
 * encodes a string with b64
 * @param  {string} str the string that should be encoded
 * @return {string}     the resulting string
 */
function b64EncodeUnicode(str) {
  return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g,
    function toSolidBytes(match, p1) {
      return String.fromCharCode('0x' + p1);
  }));
}

/**
 * decodes a b64 encoded string
 * @param  {string} str the string that should be decoded
 * @return {string}     the decoded string
 */
function b64DecodeUnicode(str) {
  return decodeURIComponent(atob(str).split('').map(function(c) {
    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));
}