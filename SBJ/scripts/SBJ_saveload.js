function SaveLoad(menu, gD, mC) {
  this.menu = menu;
  this.gD = gD;
  this.mC = mC;
  this.init = function() {
    this.filesLoaded = 0;
    this.savestates = [];

    this.loadFile();

    this.title = new CanvasText(this.gD.canvas.width / 2, 30, "Save / Load", "pageTitle");

    this.buttonStartTop = this.gD.canvas.height - 50;
    this.buttonHeight = 30;
    this.buttonFullWidth = 620;
    this.buttonPadding = 10;
    this.buttonStartLeft = (this.gD.canvas.width / 2) - (this.buttonFullWidth / 2);

    this.basisNG = [
      [
        { button: "Save",      action: (gD) => { this.createSavestate("Test", "Money_1000_0") } },
        { button: "Main Menu", action: (gD) => { gD.setNewPage(this.menu, true) } },
        { button: "Load",      action: (gD) => { this.loadSavestate() } }
      ]
    ];

    this.basisNG.map((rowButtons, rowIndex) => {
      var buttonWidth = (this.buttonFullWidth - (rowButtons.length - 1) * this.buttonPadding) / rowButtons.length;
      rowButtons.map((button, columnIndex) => {
        this.basisNG[rowIndex][columnIndex].button = new CanvasButton(
          this.buttonStartLeft + (buttonWidth + this.buttonPadding) * columnIndex, this.buttonStartTop + (this.buttonHeight + this.buttonPadding) * rowIndex,
          buttonWidth, this.buttonHeight, this.basisNG[rowIndex][columnIndex].button, "menu"
        );
      }, this);
    }, this);

    this.aG = [
      [{ 
        button: new CanvasImageButton(this.gD.canvas.width - 40, 10, 30, 30, "Icon_Refresh", "standardImage"), 
        action: (gD) => { this.reloadSavestates() }
      }]
    ];

    this.scrollBar = new CanvasScrollBar(this.gD.canvas.width / 2 + 330, 60, 220, 55, 0, "scrollBarStandard");

    this.savestateDetails = new SLSavestateDetails(this.gD.canvas.width - 160, 60, 150, 220, "savestateDetails");

    this.nG = this.savestates.concat(this.basisNG);
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
      var savestateObject = new SLSavestate((this.gD.canvas.width / 2) - 310, 60 + (55 * index), 620, 55, "savestate", state)
      this.savestates[index] = [{
        button: savestateObject,
        action: (gD) => { this.markSavestate(savestateObject) },
        selected: (gD) => { this.savestateDetails.setSavestate(state) }
      }];
    }, this);

    this.scrollBar.refresh(this.savestates.length);
    this.nG = this.savestates.concat(this.basisNG);
    this.readyToLoadSavestate = undefined;
  };
  this.markSavestate = function(savestate) {
    if (this.readyToLoadSavestate !== undefined) {
      this.readyToLoadSavestate.demark();
    }
    this.readyToLoadSavestate = savestate;
    this.readyToLoadSavestate.mark();
  };
  this.loadSavestate = function() {
    if (this.readyToLoadSavestate === undefined) {
      return;
    }
    try {
      this.gD.save = JSON.parse(b64DecodeUnicode(this.readyToLoadSavestate.savestate.data));
      if (this.gD.save.keyBindings) {
        this.menu.controls.keyBindings = new Map(this.gD.save.keyBindings);
      }
      this.loadSucceeded = true;
      console.log("Erfolgreich geladen!");
    } catch (e) {
      this.loadFailed = true;
      console.log("Fehler beim Laden!");
    }
    /*this.nG = this.basisNG;
    this.gD.setNewPage(this, true);*/
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
    this.gD.newKeys.map(key => {
      this.mC.updateKeyPresses(key, this.gD);

      if (this.menu.controls.keyBindings.get("Menu_Refresh")[2].includes(key)) {
        this.reloadSavestates();
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
    /* unused  */
  };
  this.update = function() {
    /* unused */
  };
  this.draw = function(ghostFactor) {
    this.gD.context.drawImage(this.menu.backgroundImage, 0, 0);
    this.title.draw(this.gD);
    this.scrollBar.draw(this.gD);
    this.savestateDetails.draw(this.gD);

    /*if (this.loadSucceeded) {
      this.loadStates[0].draw(this.gD);
    } else if (this.loadFailed) {
      this.loadStates[1].draw(this.gD);
    }*/

    this.mC.draw(this.gD);
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
  this.draw = function(gD) {
    var design = gD.design.elements[this.styleKey];
    var date = new Date(this.savestate.date);
    date = date.toLocaleString('de-DE', {weekday: 'short'}) + " " + date.toLocaleString('de-DE');
    var [spriteX, spriteY, spriteWidth, spriteHeight] = gD.spriteDict[this.savestate.spriteKey];

    if (this.marked) {
      drawCanvasRect(this.x, this.y, this.width, this.height, design.rectKey.marked, gD);
    } else if (this.selected) {
      drawCanvasRect(this.x, this.y, this.width, this.height, design.rectKey.selected, gD);
    } else {
      drawCanvasRect(this.x, this.y, this.width, this.height, design.rectKey.standard, gD);
    }

    drawCanvasImage(this.x + (60 - spriteWidth) / 2, this.y + (this.height - spriteHeight) / 2, this.savestate.spriteKey, gD);
    drawCanvasText(this.x + 60, this.y + 6, "Name: " + this.savestate.name, design.textKey, gD);
    drawCanvasText(this.x + 60, this.y + 18, "Date: " + date, design.textKey, gD);
    drawCanvasText(this.x + 60, this.y + 30, "Version: " + this.savestate.version, design.textKey, gD);
    drawCanvasRectBorder(this.x, this.y, this.width, this.height, design.borderKey, gD);
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