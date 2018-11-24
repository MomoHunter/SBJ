function Controls(gD, menu) {
  this.gD = gD;
  this.menu = menu;
  this.backgroundImage = new Image();
  this.backgroundImage.src = "img/Titlescreen.png";
  this.visible = false;
  this.newKeyMode = false;
  this.keyBindings = {   //Definition, key, code
    "Menu_NavDown" : ["Navigation runter", ["S", "ArrowDown"], ["KeyS", "ArrowDown"]],
    "Menu_NavUp" : ["Navigation hoch", ["W", "ArrowUp"], ["KeyW", "ArrowUp"]],
    "Menu_NavRight" : ["Navigation rechts", ["D", "ArrowRight"], ["KeyD", "ArrowRight"]],
    "Menu_NavLeft" : ["Navigation links", ["A", "ArrowLeft"], ["KeyA", "ArrowLeft"]],
    "Menu_Confirm" : ["Bestätigen", ["Enter", "Space"], ["Enter", "Space"]],
    "SelectionScreen1" : ["Navigation rechts", ["D", "ArrowRight"], [68, 39]],
    "SelectionScreen2" : ["Navigation links", ["A", "ArrowLeft"], [65, 37]],
    "SelectionScreen3" : ["Bestätigen", ["Enter", "Space"], [13, 32]],
    "SelectionScreen4" : ["Abbrechen", ["Escape"], [27]],
    "Game1" : ["Spiel pausieren", ["Escape"], [27]],
    "Game2" : ["Vorwärts bewegen", ["D", "ArrowRight"], [68, 39]],
    "Game3" : ["Rückwärts bewegen", ["A", "ArrowLeft"], [65, 37]],
    "Game4" : ["Von der Plattform runterspringen", ["S", "ArrowDown"], [83, 40]],
    "Game5" : ["Springen", ["Space"], [32]],
    "Game6" : ["Stoppuhr benutzen", ["1"], [49]],
    "Game7" : ["Stern benutzen", ["2"], [50]],
    "Game8" : ["Feder benutzen", ["3"], [51]],
    "Game9" : ["Schatztruhe benutzen", ["4"], [52]],
    "Game10" : ["Magnet benutzen", ["5"], [53]],
    "Game11" : ["Rakete benutzen", ["6"], [54]],
    "FinishModal1" : ["Navigation runter", ["S", "ArrowDown"], [83, 40]],
    "FinishModal2" : ["Navigation hoch", ["W", "ArrowUp"], [87, 38]],
    "FinishModal3" : ["Bestätigen", ["Enter", "Space"], [13, 32]],
    "Shop1" : ["Navigation runter", ["S", "ArrowDown"], [83, 40]],
    "Shop2" : ["Navigation hoch", ["W", "ArrowUp"], [87, 38]],
    "Shop3" : ["Navigation rechts", ["D", "ArrowRight"], [68, 39]],
    "Shop4" : ["Navigation links", ["A", "ArrowLeft"], [65, 37]],
    "Shop5" : ["Bestätigen", ["Enter", "Space"], [13, 32]],
    "Shop6" : ["Abbrechen", ["Escape"], [27]],
    "Achievements1" : ["Navigation runter", ["S", "ArrowDown"], [83, 40]],
    "Achievements2" : ["Navigation hoch", ["W", "ArrowUp"], [87, 38]],
    "Achievements3" : ["Navigation rechts", ["D", "ArrowRight"], [68, 39]],
    "Achievements4" : ["Navigation links", ["A", "ArrowLeft"], [65, 37]],
    "Achievements5" : ["Bestätigen", ["Enter", "Space"], [13, 32]],
    "Achievements6" : ["Abbrechen", ["Escape"], [27]],
    "Save1" : ["Bestätigen", ["Enter", "Space"], [13, 32]],
    "Load1" : ["Bestätigen", ["Enter", "Space"], [13, 32]],
    "Highscores1" : ["Navigation runter", ["S", "ArrowDown"], [83, 40]],
    "Highscores2" : ["Navigation hoch", ["W", "ArrowUp"], [87, 38]],
    "Highscores3" : ["Bestätigen", ["Enter"], [13]],
    "Highscores4" : ["Abbrechen", ["Escape"], [27]],
    "Highscores5" : ["Navigation rechts", ["ArrowRight"], [39]],
    "Highscores6" : ["Navigation links", ["ArrowLeft"], [37]],
    "Highscores7" : ["Linkes Zeichen löschen", ["Backspace"], [8]],
    "Highscores8" : ["Rechtes Zeichen löschen", ["Delete"], [46]],
    "Highscores9" : ["Editieren abbrechen", ["Escape"], [27]],
    "Controls1" : ["Navigation runter", ["S", "ArrowDown"], [83, 40]],
    "Controls2" : ["Navigation hoch", ["W", "ArrowUp"], [87, 38]],
    "Controls3" : ["Navigation rechts", ["D", "ArrowRight"], [68, 39]],
    "Controls4" : ["Navigation links", ["A", "ArrowLeft"], [65, 37]],
    "Controls5" : ["Belegung löschen", ["Delete"], [46]],
    "Controls6" : ["Bestätigen", ["Enter", "Space"], [13, 32]],
    "Controls7" : ["Abbrechen", ["Escape"], [27]],
    "Mute1" : ["Alles muten", ["M"], [77]]
  };
  this.keyEntryHeadlines = [];
  this.keyEntries = [];
  this.selected = 0;
  this.shiftFactor = 0;
  this.init = function() {
    this.title = new Text(this.gD.canvas.width / 2, 30, "32pt", "Showcard Gothic", "rgba(200, 200, 200, 1)", "center", "middle", "Controls", 3);

    this.keyEntryHeadlines.push(new ControlEntryHeadline((this.gD.canvas.width / 2) - 300, 60 + ((this.keyEntryHeadlines.length + this.keyEntries.length) * 20), 600, 20, "rgba(50, 200, 80, 1)", "Menü", 2));
    for (var i = 0; i < 5; i++) {
      this.keyEntries.push(new ControlEntry((this.gD.canvas.width / 2) - 300, 60 + ((this.keyEntryHeadlines.length + this.keyEntries.length) * 20), 600, 20, "rgba(255, 255, 255, 1)", "Menu" + (i + 1), 2));
    }
    this.keyEntryHeadlines.push(new ControlEntryHeadline((this.gD.canvas.width / 2) - 300, 60 + ((this.keyEntryHeadlines.length + this.keyEntries.length) * 20), 600, 20, "rgba(50, 200, 80, 1)", "Spielerauswahl Bildschirm", 2));
    for (var i = 0; i < 4; i++) {
      this.keyEntries.push(new ControlEntry((this.gD.canvas.width / 2) - 300, 60 + ((this.keyEntryHeadlines.length + this.keyEntries.length) * 20), 600, 20, "rgba(255, 255, 255, 1)", "SelectionScreen" + (i + 1), 2));
    }
    this.keyEntryHeadlines.push(new ControlEntryHeadline((this.gD.canvas.width / 2) - 300, 60 + ((this.keyEntryHeadlines.length + this.keyEntries.length) * 20), 600, 20, "rgba(50, 200, 80, 1)", "Spiel", 2));
    for (var i = 0; i < 11; i++) {
      this.keyEntries.push(new ControlEntry((this.gD.canvas.width / 2) - 300, 60 + ((this.keyEntryHeadlines.length + this.keyEntries.length) * 20), 600, 20, "rgba(255, 255, 255, 1)", "Game" + (i + 1), 2));
    }
    this.keyEntryHeadlines.push(new ControlEntryHeadline((this.gD.canvas.width / 2) - 300, 60 + ((this.keyEntryHeadlines.length + this.keyEntries.length) * 20), 600, 20, "rgba(50, 200, 80, 1)", "Spielendanzeige", 2));
    for (var i = 0; i < 3; i++) {
      this.keyEntries.push(new ControlEntry((this.gD.canvas.width / 2) - 300, 60 + ((this.keyEntryHeadlines.length + this.keyEntries.length) * 20), 600, 20, "rgba(255, 255, 255, 1)", "FinishModal" + (i + 1), 2));
    }
    this.keyEntryHeadlines.push(new ControlEntryHeadline((this.gD.canvas.width / 2) - 300, 60 + ((this.keyEntryHeadlines.length + this.keyEntries.length) * 20), 600, 20, "rgba(50, 200, 80, 1)", "Shop", 2));
    for (var i = 0; i < 6; i++) {
      this.keyEntries.push(new ControlEntry((this.gD.canvas.width / 2) - 300, 60 + ((this.keyEntryHeadlines.length + this.keyEntries.length) * 20), 600, 20, "rgba(255, 255, 255, 1)", "Shop" + (i + 1), 2));
    }
    this.keyEntryHeadlines.push(new ControlEntryHeadline((this.gD.canvas.width / 2) - 300, 60 + ((this.keyEntryHeadlines.length + this.keyEntries.length) * 20), 600, 20, "rgba(50, 200, 80, 1)", "Achievements", 2));
    for (var i = 0; i < 6; i++) {
      this.keyEntries.push(new ControlEntry((this.gD.canvas.width / 2) - 300, 60 + ((this.keyEntryHeadlines.length + this.keyEntries.length) * 20), 600, 20, "rgba(255, 255, 255, 1)", "Achievements" + (i + 1), 2));
    }
    this.keyEntryHeadlines.push(new ControlEntryHeadline((this.gD.canvas.width / 2) - 300, 60 + ((this.keyEntryHeadlines.length + this.keyEntries.length) * 20), 600, 20, "rgba(50, 200, 80, 1)", "Speichern", 2));
    for (var i = 0; i < 1; i++) {
      this.keyEntries.push(new ControlEntry((this.gD.canvas.width / 2) - 300, 60 + ((this.keyEntryHeadlines.length + this.keyEntries.length) * 20), 600, 20, "rgba(255, 255, 255, 1)", "Save" + (i + 1), 2));
    }
    this.keyEntryHeadlines.push(new ControlEntryHeadline((this.gD.canvas.width / 2) - 300, 60 + ((this.keyEntryHeadlines.length + this.keyEntries.length) * 20), 600, 20, "rgba(50, 200, 80, 1)", "Laden", 2));
    for (var i = 0; i < 1; i++) {
      this.keyEntries.push(new ControlEntry((this.gD.canvas.width / 2) - 300, 60 + ((this.keyEntryHeadlines.length + this.keyEntries.length) * 20), 600, 20, "rgba(255, 255, 255, 1)", "Load" + (i + 1), 2));
    }
    this.keyEntryHeadlines.push(new ControlEntryHeadline((this.gD.canvas.width / 2) - 300, 60 + ((this.keyEntryHeadlines.length + this.keyEntries.length) * 20), 600, 20, "rgba(50, 200, 80, 1)", "Highscores", 2));
    for (var i = 0; i < 9; i++) {
      this.keyEntries.push(new ControlEntry((this.gD.canvas.width / 2) - 300, 60 + ((this.keyEntryHeadlines.length + this.keyEntries.length) * 20), 600, 20, "rgba(255, 255, 255, 1)", "Highscores" + (i + 1), 2));
    }
    this.keyEntryHeadlines.push(new ControlEntryHeadline((this.gD.canvas.width / 2) - 300, 60 + ((this.keyEntryHeadlines.length + this.keyEntries.length) * 20), 600, 20, "rgba(50, 200, 80, 1)", "Controls", 2));
    for (var i = 0; i < 7; i++) {
      this.keyEntries.push(new ControlEntry((this.gD.canvas.width / 2) - 300, 60 + ((this.keyEntryHeadlines.length + this.keyEntries.length) * 20), 600, 20, "rgba(255, 255, 255, 1)", "Controls" + (i + 1), 2));
    }
    this.keyEntryHeadlines.push(new ControlEntryHeadline((this.gD.canvas.width / 2) - 300, 60 + ((this.keyEntryHeadlines.length + this.keyEntries.length) * 20), 600, 20, "rgba(50, 200, 80, 1)", "Mute", 2));
    for (var i = 0; i < 1; i++) {
      this.keyEntries.push(new ControlEntry((this.gD.canvas.width / 2) - 300, 60 + ((this.keyEntryHeadlines.length + this.keyEntries.length) * 20), 600, 20, "rgba(255, 255, 255, 1)", "Mute" + (i + 1), 2));
    }

    this.keyEntries[this.selected].select(0, false);

    this.backToMenu = new Button((this.gD.canvas.width / 2) - 100, this.gD.canvas.height - 50, 200, 30, "15pt", "Showcard Gothic", "rgba(255, 255, 255, 1)", "Main Menu", "rgba(0, 0, 0, .6)", 2);
  };
  this.vShift = function(shiftFactor) {
    for (var i = 0; i < this.keyEntryHeadlines.length; i++) {
      this.keyEntryHeadlines[i].y -= (shiftFactor * 20);
    }
    for (var i = 0; i < this.keyEntries.length; i++) {
      this.keyEntries[i].y -= (shiftFactor * 20);
      for (var j = 0; j < this.keyEntries[i].keys.length; j++) {
        this.keyEntries[i].keys[j].y -= (shiftFactor * 20);
      }
    }
    this.shiftFactor += shiftFactor;
  };
  this.clear = function() {
    this.gD.context.clearRect(0, 0, this.gD.canvas.width, this.gD.canvas.height);
  };
  this.show = function() {
    this.visible = true;
    drawControls(this);
  };
  this.stop = function() {
    this.visible = false;
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
  this.draw = function(gD) {
    gD.context.fillStyle = this.color;
    gD.context.fillRect(this.x, this.y, this.width, this.height);
    gD.context.textAlign = "center";
    gD.context.textBaseline = "middle";
    gD.context.font = "bold 12pt Consolas";
    gD.context.fillStyle = "rgba(0, 0, 0, 1)";
    gD.context.fillText(this.text, this.x + (this.width / 2), this.y + (this.height / 2));
    gD.context.strokeStyle = "rgba(0, 0, 0, 1)";
    gD.context.lineWidth = this.bordersize;
    gD.context.strokeRect(this.x, this.y, this.width, this.height);
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
  this.selected = 0;
  this.keys = [];
  this.keys.push(new ControlKey(this.x + this.width - 200, this.y, 100, this.height, this.color, this.name, 0, this.bordersize));
  this.keys.push(new ControlKey(this.x + this.width - 100, this.y, 100, this.height, this.color, this.name, 1, this.bordersize));
  this.select = function(index, deselectAll) {
    this.keys[this.selected].deselect();
    if (!deselectAll) {
      this.keys[index].select();
      this.selected = index;
    }
  };
  this.setNewKey = function(controls, event) {
    if (event.keyCode == 32) {
      controls.keyBindings[this.name][1][this.selected] = "Space";
    } else if (event.key.length == 1) {
      controls.keyBindings[this.name][1][this.selected] = event.key.toUpperCase();
    } else {
      controls.keyBindings[this.name][1][this.selected] = event.key;
    }
    controls.keyBindings[this.name][2][this.selected] = event.keyCode;
  };
  this.draw = function(controls, gD) {
    gD.context.fillStyle = this.color;
    gD.context.fillRect(this.x, this.y, this.width - 200, this.height);
    gD.context.textAlign = "start";
    gD.context.textBaseline = "bottom";
    gD.context.font = "12pt Consolas";
    gD.context.fillStyle = "rgba(0, 0, 0, 1)";
    gD.context.fillText(controls.keyBindings[this.name][0], this.x + 5, this.y + this.height - 2);
    gD.context.strokeStyle = "rgba(0, 0, 0, 1)";
    gD.context.lineWidth = this.bordersize;
    gD.context.strokeRect(this.x, this.y, this.width, this.height);
    for (var i = 0; i < this.keys.length; i++) {
      this.keys[i].draw(controls, gD);
    }
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
  this.selected = false;
  this.select = function() {
    this.selected = true;
  };
  this.deselect = function() {
    this.selected = false;
  };
  this.draw = function(controls, gD) {
    if (this.selected) {
      gD.context.fillStyle = "rgba(180, 50, 50, 1)";
    } else {
      gD.context.fillStyle = this.color;
    }
    gD.context.fillRect(this.x, this.y, this.width, this.height);
    gD.context.textAlign = "end";
    gD.context.textBaseline = "bottom";
    gD.context.font = "12pt Consolas";
    gD.context.fillStyle = "rgba(0, 0, 0, 1)";
    if (controls.keyBindings[this.name][1][this.keyNr] != undefined) {
      gD.context.fillText(controls.keyBindings[this.name][1][this.keyNr], this.x + this.width - 5, this.y + this.height - 2);
    }
    gD.context.strokeStyle = "rgba(0, 0, 0, 1)";
    gD.context.lineWidth = this.bordersize;
    gD.context.strokeRect(this.x, this.y, this.width, this.height);
  };
}

function controlsControlDown(controls, event) {
  if (!controls.newKeyMode) {
    if (controls.keyBindings["Controls1"][2].includes(event.keyCode)) {               //navigation down
      if (controls.selected == -1) {
        controls.backToMenu.deselect();
        controls.keyEntries[0].select(controls.keyEntries[0].selected, false);
        controls.selected = 0;
        controls.vShift(-controls.shiftFactor);
      } else if (controls.selected == controls.keyEntries.length - 1) {
        controls.keyEntries[controls.selected].select(0, true);
        controls.backToMenu.select();
        controls.selected = -1;
      } else {
        controls.keyEntries[controls.selected].select(0, true);
        controls.keyEntries[controls.selected + 1].select(controls.keyEntries[controls.selected].selected, false);
        if (controls.keyEntries[controls.keyEntries.length - 1].y != 260 && controls.keyEntries[controls.selected + 1].y > 220) {
          controls.vShift((controls.keyEntries[controls.selected + 1].y - 220) / 20);
        }
        controls.selected += 1;
      }
    } else if (controls.keyBindings["Controls2"][2].includes(event.keyCode)) {        //navigation up
      if (controls.selected == -1) {
        controls.backToMenu.deselect();
        controls.keyEntries[controls.keyEntries.length - 1].select(controls.keyEntries[controls.keyEntries.length - 1].selected, false);
        controls.selected = controls.keyEntries.length - 1;
        controls.vShift(-controls.shiftFactor);
        controls.vShift((((controls.keyEntries.length + controls.keyEntryHeadlines.length) * 20) - 220) / 20);
      } else if (controls.selected == 0) {
        controls.keyEntries[0].select(0, true);
        controls.backToMenu.select();
        controls.selected = -1;
      } else {
        controls.keyEntries[controls.selected].select(0, true);
        controls.keyEntries[controls.selected - 1].select(controls.keyEntries[controls.selected].selected, false);
        if (controls.keyEntryHeadlines[0].y != 60 && controls.keyEntries[controls.selected - 1].y < 100) {
          controls.vShift((controls.keyEntries[controls.selected - 1].y - 100) / 20);
        }
        controls.selected -= 1;
      }
    } else if (controls.keyBindings["Controls3"][2].includes(event.keyCode)) {        //navigation right
      if (controls.selected >= 0) {
        controls.keyEntries[controls.selected].select((controls.keyEntries[controls.selected].selected + 1) % controls.keyEntries[controls.selected].keys.length, false);
      }
    } else if (controls.keyBindings["Controls4"][2].includes(event.keyCode)) {        //navigation left
      if (controls.selected >= 0) {
        controls.keyEntries[controls.selected].select(
          (controls.keyEntries[controls.selected].selected + controls.keyEntries[controls.selected].keys.length - 1) % controls.keyEntries[controls.selected].keys.length,
          false);
      }
    } else if (controls.keyBindings["Controls5"][2].includes(event.keyCode)) {
      controls.keyBindings[controls.keyEntries[controls.selected].name][1].splice(controls.keyEntries[controls.selected].selected, 1);
      controls.keyBindings[controls.keyEntries[controls.selected].name][2].splice(controls.keyEntries[controls.selected].selected, 1);
    }
  
    if (controls.keyBindings["Controls6"][2].includes(event.keyCode)) {                                    //enter (13) button
      if (controls.selected == -1) {
        controls.menu.show();
        controls.stop();
      } else {
        controls.newKeyMode = true;
        controls.keyBindings[controls.keyEntries[controls.selected].name][1][controls.keyEntries[controls.selected].selected] = "...";
        drawControls(controls);
      }
    } else if (controls.menu.controls.keyBindings["Controls7"][2].includes(event.keyCode)) {
      controls.menu.show();
      controls.stop();
    } else {
      drawControls(controls);
    }
  } else {
    controls.keyEntries[controls.selected].setNewKey(controls, event);
    drawControls(controls);
    controls.newKeyMode = false;
    controls.gD.save.keyBindings = controls.keyBindings;
  }
}

function controlsControlUp(controls, event) {

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

function drawControls(controls) {
  controls.clear();

  controls.gD.context.drawImage(controls.backgroundImage, 0, 0);

  controls.title.draw(controls.gD);

  for (var i = 0; i < controls.keyEntryHeadlines.length; i++) {
    if (controls.keyEntryHeadlines[i].y >= 60 && controls.keyEntryHeadlines[i].y < 280) {
      controls.keyEntryHeadlines[i].draw(controls.gD);
    }
  }

  for (var i = 0; i < controls.keyEntries.length; i++) {
    if (controls.keyEntries[i].y >= 60 && controls.keyEntries[i].y < 280) {
      controls.keyEntries[i].draw(controls, controls.gD);
    }
  }

  controls.backToMenu.draw(controls.gD);

  controls.gD.context.lineWidth = 4;
  controls.gD.context.strokeStyle = "rgba(255, 255, 255, 1)";
  controls.gD.context.beginPath();
  controls.gD.context.moveTo(controls.gD.canvas.width - 165, 60 + ((controls.shiftFactor / (controls.keyEntryHeadlines.length + controls.keyEntries.length)) * 220));
  controls.gD.context.lineTo(controls.gD.canvas.width - 165, 60 + ((Math.min(11 + controls.shiftFactor, (controls.keyEntryHeadlines.length + controls.keyEntries.length)) / (controls.keyEntryHeadlines.length + controls.keyEntries.length)) * 220));
  controls.gD.context.stroke();
  controls.gD.context.lineWidth = 1;
  controls.gD.context.beginPath();
  controls.gD.context.moveTo(controls.gD.canvas.width - 165, 60);
  controls.gD.context.lineTo(controls.gD.canvas.width - 165, 280);
  controls.gD.context.stroke();
}