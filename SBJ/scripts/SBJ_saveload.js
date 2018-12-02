function SaveLoad(gD, menu) {
  this.gD = gD;
  this.menu = menu;
  this.init = function() {
    this.filesLoaded = 0;
    this.savestates = [];
    this.saveStateFunctions = [];
    this.buttons = [];
    this.selectedRowIndex = -1;
    this.selectedColumnIndex = 0;
    this.scrollHeight = 0;

    this.loadFile();

    this.title = new CanvasText(this.gD.canvas.width / 2, 30, "32pt", "Showcard Gothic, Impact", "rgba(200, 200, 200, 1)", "center", "middle", "Save / Load", 3);

    this.buttons.push(new MenuTextButton((this.gD.canvas.width / 2) - 310, this.gD.canvas.height - 50, 200, 30, "Save"));
    this.buttons.push(new MenuTextButton((this.gD.canvas.width / 2) - 100, this.gD.canvas.height - 50, 200, 30, "Main Menu"));
    this.buttons.push(new MenuTextButton((this.gD.canvas.width / 2) + 110, this.gD.canvas.height - 50, 200, 30, "Load"));

    this.refreshButton = new SLRefreshButton(this.gD.canvas.width - 40, 10, 30, 30, "rgba(255, 255, 255, 1)", 2);
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
      saveLoad.getSaveStates();
    };
    document.body.appendChild(newScript);
  };
  this.fileLoaded = function() {
    this.filesLoaded++;
    this.loadFile();
  };
  this.getSaveStates = function() {
    this.savestates = [];
    for (var func in window) {
      if (typeof window[func] === 'function' && func.startsWith('SaveState')) {
        var saveState = new window[func];
        var pos = 0;
        this.savestates.map((state, index) => {
          if (state.date > saveState.date) {
            pos = index + 1;
          }
        }, this);
        this.savestates.splice(pos, 0, saveState);
      }
    }
    this.savestates.map((state, index) => {
      this.savestates[index] = new SLSaveState((this.gD.canvas.width / 2) - 310, 60 + (55 * index), 620, 50, "rgba(255, 255, 255, 0.7)", state);
    }, this);
    console.log(this.savestates);
  };
  this.createSaveState = function(name) {
    var data = [];
    data[0] = "this.name='" + name + "';";
    data[1] = "this.date=" + Date.now() + ";";
    data[2] = "this.version='" + this.menu.version.text + "';";
    data[3] = "this.data='" + b64EncodeUnicode(JSON.stringify(this.gD.save)) + "';";
    this.downloadSaveState(
      "function SaveState" + Date.now() + "(){" + data.join('') + "}"
    );
  };
  this.downloadSaveState = function(savestate) {
    var element = document.createElement('a');
    var file = new Blob([savestate], {type: 'text/javascript'});
    element.href = URL.createObjectURL(file);
    element.download = "Savestate" + this.filesLoaded + ".txt";
    element.click();
  };
  this.updateKeyPresses = function() {

  };
  this.updateMouseMoves = function() {

  };
  this.updateClicks = function() {

  };
  this.updateWheelMoves = function() {

  };
  this.update = function() {

  };
  this.draw = function(ghostFactor) {
    this.gD.context.drawImage(this.menu.backgroundImage, 0, 0);

    this.title.draw(this.gD);

    this.savestates.map(state => {
      var realHeight = state.y - this.scrollHeight;
      if (realHeight >= 60 && realHeight < 280) {
        state.draw(this.gD);
      }
    }, this);

    this.buttons.map(button => {
      button.draw(this.gD);
    }, this);

    this.refreshButton.draw(this.gD);
  };
}

function SLSaveState(x, y, width, height, color, savestate) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.color = color;
  this.savestate = savestate;
  this.selected = false;
  this.borderColor = "rgba(0, 0, 0, 1)";
  this.textColor = "rgba(0, 0, 0, 1)";
  this.selectedColor = "rgba(180, 50, 50, 1)";
  this.textAlign = "start";
  this.textBaseline = "middle";
  this.font = "10pt Consolas";
  this.draw = function(gD) {
    var date = new Date(this.savestate.date);
    date = date.toLocaleString('de-DE', {weekday: 'short'}) + " " + date.toLocaleString('de-DE');

    if (this.selected) {
      gD.context.fillStyle = this.selectedColor;
    } else {
      gD.context.fillStyle = this.color;
    }
    gD.context.fillRect(this.x, this.y - this.scrollHeight, this.width, this.height);
    gD.context.fillStyle = this.textColor;
    gD.context.textAlign = this.textAlign;
    gD.context.textBaseline = this.textBaseline;
    gD.context.font = this.font;
    gD.context.fillText("Name: " + this.savestate.name, this.x + 60, this.y + 10);
    gD.context.fillText("Date: " + date, this.x + 60, this.y + 25);
    gD.context.fillText("Version: " + this.savestate.version, this.x + 60, this.y + 40);
    gD.context.strokeStyle = this.borderColor;
    gD.context.lineWidth = this.bordersize;
    gD.context.strokeRect(this.x, this.y - this.scrollHeight, this.width, this.height);
  };
}

function SLRefreshButton(x, y, width, height, color, bordersize)  {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.color = color;
  this.bordersize = bordersize;
  this.borderColor = "rgba(0, 0, 0, 1)";
  this.draw = function(gD) {
    var spriteRef = gD.spriteDict["Icon_Refresh"];
    gD.context.fillStyle = this.color;
    gD.context.fillRect(this.x, this.y, this.width, this.height);
    gD.context.drawImage(gD.spritesheet, spriteRef[0], spriteRef[1], spriteRef[2], spriteRef[3],
      this.x + ((this.width - spriteRef[2]) / 2), this.y + ((this.height - spriteRef[3]) / 2), spriteRef[2], spriteRef[3]);
    gD.context.strokeStyle = this.borderColor;
    gD.context.lineWidth = this.bordersize;
    gD.context.strokeRect(this.x, this.y, this.width, this.height);
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