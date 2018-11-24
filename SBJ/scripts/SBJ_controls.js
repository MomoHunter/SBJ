function Controls(gD, menu) {
  this.gD = gD;
  this.menu = menu;
  this.init = function() {
    this.newKeyMode = false;
    this.keyBindings = new Map([   //Definition, key, code
      ["Menu_NavDown", ["Navigation runter", ["S", "ArrowDown"], ["KeyS", "ArrowDown"]]],
      ["Menu_NavUp", ["Navigation hoch", ["W", "ArrowUp"], ["KeyW", "ArrowUp"]]],
      ["Menu_NavRight", ["Navigation rechts", ["D", "ArrowRight"], ["KeyD", "ArrowRight"]]],
      ["Menu_NavLeft", ["Navigation links", ["A", "ArrowLeft"], ["KeyA", "ArrowLeft"]]],
      ["Menu_Confirm", ["Bestätigen", ["Enter", "Space"], ["Enter", "Space"]]],
      ["SelectionScreen_NavRight", ["Navigation rechts", ["D", "ArrowRight"], ["KeyD", "ArrowRight"]]],
      ["SelectionScreen_NavLeft", ["Navigation links", ["A", "ArrowLeft"], ["KeyA", "ArrowLeft"]]],
      ["SelectionScreen_Confirm", ["Bestätigen", ["Enter", "Space"], ["Enter", "Space"]]],
      ["SelectionScreen_Abort", ["Abbrechen", ["Escape"], ["Escape"]]],
      ["Game_Pause", ["Spiel pausieren", ["Escape"], ["Escape"]]],
      ["Game_MoveRight", ["Vorwärts bewegen", ["D", "ArrowRight"], ["KeyD", "ArrowRight"]]],
      ["Game_MoveLeft", ["Rückwärts bewegen", ["A", "ArrowLeft"], ["KeyA", "ArrowLeft"]]],
      ["Game_JumpFromPlatform", ["Von der Plattform runterspringen", ["S", "ArrowDown"], ["KeyS", "ArrowDown"]]],
      ["Game_Jump", ["Springen", ["Space"], ["Space"]]],
      ["Game_ItemStopwatch", ["Stoppuhr benutzen", ["1"], ["Digit1"]]],
      ["Game_ItemStar", ["Stern benutzen", ["2"], ["Digit2"]]],
      ["Game_ItemFeather", ["Feder benutzen", ["3"], ["Digit3"]]],
      ["Game_ItemTreasure", ["Schatztruhe benutzen", ["4"], ["Digit4"]]],
      ["Game_ItemMagnet", ["Magnet benutzen", ["5"], ["Digit5"]]],
      ["Game_ItemRocket", ["Rakete benutzen", ["6"], ["Digit6"]]],
      ["FinishModal_NavDown", ["Navigation runter", ["S", "ArrowDown"], ["KeyS", "ArrowDown"]]],
      ["FinishModal_NavUp", ["Navigation hoch", ["W", "ArrowUp"], ["KeyW", "ArrowUp"]]],
      ["FinishModal_Confirm", ["Bestätigen", ["Enter", "Space"], ["Enter", "Space"]]],
      ["Shop_NavDown", ["Navigation runter", ["S", "ArrowDown"], ["KeyS", "ArrowDown"]]],
      ["Shop_NavUp", ["Navigation hoch", ["W", "ArrowUp"], ["KeyW", "ArrowUp"]]],
      ["Shop_NavRight", ["Navigation rechts", ["D", "ArrowRight"], ["KeyD", "ArrowRight"]]],
      ["Shop_NavLeft", ["Navigation links", ["A", "ArrowLeft"], ["KeyA", "ArrowLeft"]]],
      ["Shop_Confirm", ["Bestätigen", ["Enter", "Space"], ["Enter", "Space"]]],
      ["Shop_Abort", ["Abbrechen", ["Escape"], ["Escape"]]],
      ["Achievements_NavDown", ["Navigation runter", ["S", "ArrowDown"], ["KeyS", "ArrowDown"]]],
      ["Achievements_NavUp", ["Navigation hoch", ["W", "ArrowUp"], ["KeyW", "ArrowUp"]]],
      ["Achievements_NavRight", ["Navigation rechts", ["D", "ArrowRight"], ["KeyD", "ArrowRight"]]],
      ["Achievements_NavLeft", ["Navigation links", ["A", "ArrowLeft"], ["KeyA", "ArrowLeft"]]],
      ["Achievements_Confirm", ["Bestätigen", ["Enter", "Space"], ["Enter", "Space"]]],
      ["Achievements_Abort", ["Abbrechen", ["Escape"], ["Escape"]]],
      ["Save_Confirm", ["Bestätigen", ["Enter", "Space"], ["Enter", "Space"]]],
      ["Load_Confirm", ["Bestätigen", ["Enter", "Space"], ["Enter", "Space"]]],
      ["Highscores_NavDown", ["Navigation runter", ["S", "ArrowDown"], ["KeyS", "ArrowDown"]]],
      ["Highscores_NavUp", ["Navigation hoch", ["W", "ArrowUp"], ["KeyW", "ArrowUp"]]],
      ["Highscores_Confirm", ["Bestätigen", ["Enter"], ["Enter"]]],
      ["Highscores_Abort", ["Abbrechen", ["Escape"], ["Escape"]]],
      ["Highscores_NavRight", ["Navigation rechts", ["ArrowRight"], ["ArrowRight"]]],
      ["Highscores_NavLeft", ["Navigation links", ["ArrowLeft"], ["ArrowLeft"]]],
      ["Highscores_DeleteLeft", ["Linkes Zeichen löschen", ["Backspace"], ["Backspace"]]],
      ["Highscores_DeleteRight", ["Rechtes Zeichen löschen", ["Delete"], ["Delete"]]],
      ["Highscores_AbortEdit", ["Editieren abbrechen", ["Escape"], ["Escape"]]],
      ["Controls_NavDown", ["Navigation runter", ["S", "ArrowDown"], ["KeyS", "ArrowDown"]]],
      ["Controls_NavUp", ["Navigation hoch", ["W", "ArrowUp"], ["KeyW", "ArrowUp"]]],
      ["Controls_NavRight", ["Navigation rechts", ["D", "ArrowRight"], ["KeyD", "ArrowRight"]]],
      ["Controls_NavLeft", ["Navigation links", ["A", "ArrowLeft"], ["KeyA", "ArrowLeft"]]],
      ["Controls_DeleteKey", ["Belegung löschen", ["Delete"], ["Delete"]]],
      ["Controls_Confirm", ["Bestätigen", ["Enter", "Space"], ["Enter", "Space"]]],
      ["Controls_Abort", ["Abbrechen", ["Escape"], ["Escape"]]],
      ["Mute_All", ["Alles muten", ["M"], ["KeyM"]]]
    ];

    this.

    this.keyEntryHeadlines = [];
    this.keyEntries = [];
    this.selected = 0;
    this.shiftFactor = 0;
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