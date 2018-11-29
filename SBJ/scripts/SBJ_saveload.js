function SaveLoad(gD, menu) {
  this.gD = gD;
  this.menu = menu;
  this.init = function() {
    this.filesLoaded = 0;
    this.savestates = [];
    this.savestate = null;



    this.loadFile();
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
    console.log(this.savestates);
    //this.createSaveState();
  };
  this.createSaveState = function() {
    var data = b64EncodeUnicode(JSON.stringify(this.gD.save));
    var savestate = "function SaveState" + this.filesLoaded + "(){this.version='" + this.menu.version.text + "';this.date=" + Date.now() + ";this.data='" + data + "';}";
    this.downloadSaveState();
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
  };
}

function SLSaveState(x, y, width, height, color, saveState) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.color = color;
  this.borderColor = "rgba(0, 0, 0, 1)";
  this.textColor = "rgba(0, 0, 0, 1)";
  this.selectedColor = "rgba(50, 200, 80, 1)";
  this.textAlign = "start";
  this.textBaseline = "middle";
  this.font = "14pt Consolas";
  this.saveState = saveState;
  this.draw = function(gD) {
    gD.context.fillStyle = this.color;
    gD.context.fillRect(this.x, this.y, this.width, this.height);
    gD.context.fillStyle = this.textColor;
    gD.context.textAlign = this.textAlign;
    gD.context.textBaseline = this.textBaseline;
    gD.context.font = this.font;
    gD.context.fillText()
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