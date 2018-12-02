function Highscores(gD, menu) {
  this.gD = gD;
  this.menu = menu;
  this.init = function() {
    this.editingMode = false;
    this.oldName = "";
    this.selectedRowIndex = -1;
    this.title = new CanvasText(this.gD.canvas.width / 2, 30, "32pt", "Showcard Gothic", "rgba(200, 200, 200, 1)", "center", "middle", "Highscores", 3);

    this.highscoreList = new HighscoreList((this.gD.canvas.width / 2) - 300, 60, 600, 20, "rgba(255, 255, 255, 1)", 2);

    this.backToMenu = new MenuTextButton((this.gD.canvas.width / 2) - 100, this.gD.canvas.height - 50, 200, 30, "Main Menu");
    this.backToMenu.select();
  };
  this.newHighscore = function(data) {
    if (Object.keys(this.highscores).length == 0) {
      this.highscores["1"] = data;
    } else {
      for (var i = Math.min(Object.keys(this.highscores).length, 99); i > 0; i--) {
        if (parseInt(this.highscores[i.toString()][1].substr(0, (this.highscores[i.toString()][1].length - 1))) < parseInt(data[1].substr(0, (data[1].length - 1)))) {
          this.highscores[(i + 1).toString()] = this.highscores[i.toString()];
          if (i == 1) {
            this.highscores["1"] = data;
            break;
          }
        } else if (parseInt(this.highscores[i.toString()][1].substr(0, (this.highscores[i.toString()][1].length - 1))) == parseInt(data[1].substr(0, (data[1].length - 1)))) {
          for (var j = i; j > 0; j--) {
            if (parseInt(this.highscores[j.toString()][1].substr(0, (this.highscores[j.toString()][1].length - 1))) == parseInt(data[1].substr(0, (data[1].length - 1)))) {
              if (parseInt(this.highscores[j.toString()][2]) >= parseInt(data[2])) {
                this.highscores[(j + 1).toString()] = data;
                break;
              } else {
                this.highscores[(j + 1).toString()] = this.highscores[j.toString()];
                if (j == 1) {
                  this.highscores["1"] = data;
                  break;
                }
              }
            } else {
              this.highscores[(j + 1).toString()] = data;
              break;
            }
          }
          break;
        } else {
          this.highscores[(i + 1).toString()] = data;
          break;
        }
      }
    }
  };
  this.clear = function() {
    this.gD.context.clearRect(0, 0, this.gD.canvas.width, this.gD.canvas.height);
  };
  this.show = function() {
    this.visible = true;
    drawHighscores(this);
  };
  this.stop = function() {
    this.visible = false;
  };
}

function HighscoreList(x, y, width, height, color, bordersize) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.color = color;
  this.bordersize = bordersize;
  this.highscores = [];
  this.shiftFactor = 0;
  this.vShift = function(shiftFactor) {
    for (var i = 0; i < this.highscores.length; i++) {
      this.highscores[i].y -= shiftFactor * this.height;
      for (var j = 0; j < this.highscores[i].fields.length; j++) {
        this.highscores[i].fields[j].y -= shiftFactor * this.height;
      }
    }
    this.shiftFactor += shiftFactor;
  };
  this.draw = function(highscores, gD) {
    for (var i = this.highscores.length; i < Math.min(Object.keys(highscores.highscores).length, 100); i++) {
      if (i == 0) {
        this.highscores.push(new Highscore(this.x, this.y + this.height + (i * this.height), this.width, this.height, this.color, (i + 1), this.bordersize));
      } else {
        this.highscores.push(new Highscore(this.x, this.highscores[i - 1].y + this.height, this.width, this.height, this.color, (i + 1), this.bordersize));
      }
    }
    gD.context.fillStyle = "rgba(50, 200, 80, 1)";
    gD.context.fillRect(this.x, this.y, this.width, this.height);
    gD.context.textAlign = "center";
    gD.context.textBaseline = "middle";
    gD.context.font = "bold 12pt Consolas";
    gD.context.fillStyle = "rgba(0, 0, 0, 1)";
    gD.context.fillText("Highscores", this.x + (this.width / 2), this.y + (this.height / 2));
    gD.context.strokeStyle = "rgba(0, 0, 0, 1)";
    gD.context.lineWidth = this.bordersize;
    gD.context.strokeRect(this.x, this.y, this.width, this.height);
    for (var i = 0; i < this.highscores.length; i++) {
      if (this.highscores[i].y >= 80 && this.highscores[i].y < 280) {
        this.highscores[i].draw(highscores, gD);
      }
    }
  };
}

function Highscore(x, y, width, height, color, highscoreNr, bordersize) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.color = color;
  this.highscoreNr = highscoreNr;
  this.bordersize = bordersize;
  this.fields = [];
  this.fields.push(new HighscoreName(this.x + 50, this.y, this.width - 250, this.height, this.color, this.highscoreNr, this.bordersize));
  this.fields.push(new HighscoreField(this.x + this.width - 200, this.y, 70, this.height, this.color, this.highscoreNr, 1, this.bordersize));
  this.fields.push(new HighscoreField(this.x + this.width - 130, this.y, 130, this.height, this.color, this.highscoreNr, 2, this.bordersize));
  this.draw = function(highscores, gD) {
    gD.context.fillStyle = this.color;
    gD.context.fillRect(this.x, this.y, 50, this.height);
    gD.context.textAlign = "end";
    gD.context.textBaseline = "bottom";
    gD.context.font = "12pt Consolas";
    gD.context.fillStyle = "rgba(0, 0, 0, 1)";
    gD.context.fillText(this.highscoreNr.toString(), this.x + 45, this.y + this.height - 2);
    gD.context.strokeStyle = "rgba(0, 0, 0, 1)";
    gD.context.lineWidth = this.bordersize;
    gD.context.strokeRect(this.x, this.y, 50, this.height);

    for (var i = 0; i < this.fields.length; i++) {
      this.fields[i].draw(highscores, gD);
    }
  };
}

function HighscoreName(x, y, width, height, color, highscoreNr, bordersize) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.color = color;
  this.highscoreNr = highscoreNr;
  this.bordersize = bordersize;
  this.selected = false;
  this.cursorPosition = 0;
  this.select = function() {
    this.selected = true;
  };
  this.deselect = function() {
    this.selected = false;
  };
  this.moveCursor = function(highscores, distance) {
    if (distance < 0 && this.cursorPosition + distance >= 0) {
      this.cursorPosition += distance;
    } else if (distance > 0 && this.cursorPosition + distance <= highscores.highscores[this.highscoreNr.toString()][0].length) {
      this.cursorPosition += distance;
    }
  };
  this.addCharacter = function(highscores, character) {
    var name = highscores.highscores[this.highscoreNr.toString()][0];
    name = name.slice(0, this.cursorPosition) + character + name.slice(this.cursorPosition, name.length);
    highscores.highscores[this.highscoreNr.toString()][0] = name.slice(0, 39);
    this.moveCursor(highscores, 1);
  };
  this.deleteCharacter = function(highscores, position) {
    var name = highscores.highscores[this.highscoreNr.toString()][0];
    if (position == -1 && this.cursorPosition > 0) {
      name = name.slice(0, this.cursorPosition - 1) + name.slice(this.cursorPosition, name.length);
      this.moveCursor(highscores, -1);
    } else if (position == 1 && this.cursorPosition < name.length) {
      name = name.slice(0, this.cursorPosition) + name.slice(this.cursorPosition + 1, name.length);
    }
    highscores.highscores[this.highscoreNr.toString()][0] = name;
  };
  this.draw = function(highscores, gD) {
    if (highscores.editingMode && highscores.selected + 1 == this.highscoreNr) {
      gD.context.fillStyle = "rgba(230, 100, 100, 1)";
    } else if (this.selected) {
      gD.context.fillStyle = "rgba(180, 50, 50, 1)";
    } else {
      gD.context.fillStyle = this.color;
    }
    gD.context.fillRect(this.x, this.y, this.width, this.height);
    gD.context.textAlign = "start";
    gD.context.textBaseline = "bottom";
    gD.context.font = "12pt Consolas";
    gD.context.fillStyle = "rgba(0, 0, 0, 1)";
    gD.context.fillText(highscores.highscores[this.highscoreNr.toString()][0], this.x + 5, this.y + this.height - 2);
    gD.context.strokeStyle = "rgba(0, 0, 0, 1)";
    gD.context.lineWidth = this.bordersize;
    gD.context.strokeRect(this.x, this.y, this.width, this.height);
    if (highscores.editingMode && highscores.selected + 1 == this.highscoreNr) {
      gD.context.lineWidth = 2;
      gD.context.strokeStyle = "rgba(0, 0, 0, 1)";
      gD.context.beginPath();
      gD.context.moveTo(this.x + 4 + (this.cursorPosition * 8.8), this.y + 2);
      gD.context.lineTo(this.x + 4 + (this.cursorPosition * 8.8), this.y + this.height - 2);
      gD.context.stroke();
    }
  };
}

function HighscoreField(x, y, width, height, color, highscoreNr, indexNr, bordersize) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.color = color;
  this.highscoreNr = highscoreNr;
  this.indexNr = indexNr;
  this.bordersize = bordersize;
  this.selected = false;
  this.draw = function(highscores, gD) {
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
    gD.context.fillText(highscores.highscores[this.highscoreNr.toString()][this.indexNr], this.x + this.width - 5, this.y + this.height - 2);
    gD.context.strokeStyle = "rgba(0, 0, 0, 1)";
    gD.context.lineWidth = this.bordersize;
    gD.context.strokeRect(this.x, this.y, this.width, this.height);
  };
}

function highscoresControlDown(highscores, event) {
  if (!highscores.editingMode) {
    if (highscores.menu.controls.keyBindings["Highscores1"][2].includes(event.keyCode) && highscores.highscoreList.highscores.length > 0) {                               //navigation down
      if (highscores.selected == -1) {
        highscores.backToMenu.deselect();
        highscores.highscoreList.highscores[0].fields[0].select();
        highscores.selected = 0;
        if (highscores.highscoreList.highscores.length > 10) {
          highscores.highscoreList.vShift(-highscores.highscoreList.shiftFactor);
        }
      } else if (highscores.selected == highscores.highscoreList.highscores.length - 1) {
        highscores.highscoreList.highscores[highscores.selected].fields[0].deselect();
        highscores.backToMenu.select();
        highscores.selected = -1;
      } else {
        highscores.highscoreList.highscores[highscores.selected].fields[0].deselect();
        highscores.highscoreList.highscores[highscores.selected + 1].fields[0].select();
        if (highscores.highscoreList.highscores[highscores.highscoreList.highscores.length - 1].y > 260 && highscores.highscoreList.highscores[highscores.selected + 1].y > 220) {
          highscores.highscoreList.vShift(1);
        }
        highscores.selected += 1;
      }
    } else if (highscores.menu.controls.keyBindings["Highscores2"][2].includes(event.keyCode) && highscores.highscoreList.highscores.length > 0) {                        //navigation up
      if (highscores.selected == -1) {
        highscores.backToMenu.deselect();
        highscores.highscoreList.highscores[highscores.highscoreList.highscores.length - 1].fields[0].select();
        highscores.selected = highscores.highscoreList.highscores.length - 1;
        if (highscores.highscoreList.highscores.length > 10) {
          highscores.highscoreList.vShift(-highscores.highscoreList.shiftFactor);
          highscores.highscoreList.vShift(((highscores.highscoreList.highscores.length * 20) - 200) / 20);
        }
      } else if (highscores.selected == 0) {
        highscores.highscoreList.highscores[0].fields[0].deselect();
        highscores.backToMenu.select();
        highscores.selected = -1;
      } else {
        highscores.highscoreList.highscores[highscores.selected].fields[0].deselect();
        highscores.highscoreList.highscores[highscores.selected - 1].fields[0].select();
        if (highscores.highscoreList.highscores[0].y < 80 && highscores.highscoreList.highscores[highscores.selected - 1].y < 120) {
          highscores.highscoreList.vShift(-1);
        }
        highscores.selected -= 1;
      }
    }

    if (highscores.menu.controls.keyBindings["Highscores3"][2].includes(event.keyCode)) {                     //confirm
      if (highscores.selected == -1) {
        highscores.menu.show();
        highscores.stop();
      } else {
        highscores.editingMode = true;
        highscores.oldName = highscores.highscores[(highscores.selected + 1).toString()][0];
        drawHighscores(highscores);
      }
    } else if (highscores.menu.controls.keyBindings["Highscores4"][2].includes(event.keyCode)) {
      highscores.menu.show();
      highscores.stop();
    } else {
      drawHighscores(highscores);
    }
  } else {
    if (highscores.menu.controls.keyBindings["Highscores5"][2].includes(event.keyCode)) {                     //navigation right
      highscores.highscoreList.highscores[highscores.selected].fields[0].moveCursor(highscores, 1);
    } else if (highscores.menu.controls.keyBindings["Highscores6"][2].includes(event.keyCode)) {              //navigation left
      highscores.highscoreList.highscores[highscores.selected].fields[0].moveCursor(highscores, -1);
    } else if (highscores.menu.controls.keyBindings["Highscores7"][2].includes(event.keyCode)) {              //delete character left
      highscores.highscoreList.highscores[highscores.selected].fields[0].deleteCharacter(highscores, -1);
    } else if (highscores.menu.controls.keyBindings["Highscores8"][2].includes(event.keyCode)) {              //delete character right
      highscores.highscoreList.highscores[highscores.selected].fields[0].deleteCharacter(highscores, 1);
    } else if (highscores.menu.controls.keyBindings["Highscores3"][2].includes(event.keyCode)) {              //confirm
      highscores.editingMode = false;
      highscores.highscoreList.highscores[highscores.selected].fields[0].moveCursor(highscores, -highscores.highscoreList.highscores[highscores.selected].fields[0].cursorPosition);
    } else if (highscores.menu.controls.keyBindings["Highscores9"][2].includes(event.keyCode)) {              //abort
      highscores.editingMode = false;
      highscores.highscoreList.highscores[highscores.selected].fields[0].moveCursor(highscores, -highscores.highscoreList.highscores[highscores.selected].fields[0].cursorPosition);
      highscores.highscores[(highscores.selected + 1).toString()][0] = highscores.oldName;
    } else if (event.key.length == 1) {                                                                                                  //add character
      highscores.highscoreList.highscores[highscores.selected].fields[0].addCharacter(highscores, event.key);
    }
    drawHighscores(highscores);
  }
}

function highscoresControlUp(highscores, key) {

}

function highscoresMouseMove(highscores) {
  if (!highscores.editingMode) {
    for (var i = highscores.highscoreList.shiftFactor; i < Math.min(10 + highscores.highscoreList.shiftFactor, highscores.highscoreList.highscores.length); i++) {
      if (highscores.gD.mousePos.x >= highscores.highscoreList.highscores[i].fields[0].x && highscores.gD.mousePos.x <= highscores.highscoreList.highscores[i].fields[0].x + highscores.highscoreList.highscores[i].fields[0].width &&
          highscores.gD.mousePos.y >= highscores.highscoreList.highscores[i].fields[0].y && highscores.gD.mousePos.y <= highscores.highscoreList.highscores[i].fields[0].y + highscores.highscoreList.highscores[i].fields[0].height) {
        if (highscores.selected == -1) {
          highscores.backToMenu.deselect();
        } else {
          highscores.highscoreList.highscores[highscores.selected].fields[0].deselect();
        }
        highscores.highscoreList.highscores[i].fields[0].select();
        highscores.selected = i;
        break;
      }
    }
    if (highscores.gD.mousePos.x >= highscores.backToMenu.x && highscores.gD.mousePos.x <= highscores.backToMenu.x + highscores.backToMenu.width &&
        highscores.gD.mousePos.y >= highscores.backToMenu.y && highscores.gD.mousePos.y <= highscores.backToMenu.y + highscores.backToMenu.height) {
      if (highscores.selected == -1) {
        highscores.backToMenu.deselect();
      } else {
        highscores.highscoreList.highscores[highscores.selected].fields[0].deselect();
      }
      highscores.backToMenu.select();
      highscores.selected = -1;
    }
    drawHighscores(highscores);
  }
}

function highscoresClick(highscores) {
  if (!highscores.editingMode) {
    if (highscores.selected == -1) {
      if (highscores.gD.mousePos.x >= highscores.backToMenu.x && highscores.gD.mousePos.x <= highscores.backToMenu.x + highscores.backToMenu.width &&
          highscores.gD.mousePos.y >= highscores.backToMenu.y && highscores.gD.mousePos.y <= highscores.backToMenu.y + highscores.backToMenu.height) {
        highscores.menu.show();
        highscores.stop();
      }
    } else {
      if (highscores.gD.mousePos.x >= highscores.highscoreList.highscores[highscores.selected].fields[0].x && highscores.gD.mousePos.x <= highscores.highscoreList.highscores[highscores.selected].fields[0].x + highscores.highscoreList.highscores[highscores.selected].fields[0].width &&
          highscores.gD.mousePos.y >= highscores.highscoreList.highscores[highscores.selected].fields[0].y && highscores.gD.mousePos.y <= highscores.highscoreList.highscores[highscores.selected].fields[0].y + highscores.highscoreList.highscores[highscores.selected].fields[0].height) {
        highscores.editingMode = true;
        highscores.oldName = highscores.highscores[(highscores.selected + 1).toString()][0];
        drawHighscores(highscores);
      }
    }
  } else {
    if (highscores.gD.mousePos.x < highscores.highscoreList.highscores[highscores.selected].fields[0].x || highscores.gD.mousePos.x > highscores.highscoreList.highscores[highscores.selected].fields[0].x + highscores.highscoreList.highscores[highscores.selected].fields[0].width ||
        highscores.gD.mousePos.y < highscores.highscoreList.highscores[highscores.selected].fields[0].y || highscores.gD.mousePos.y > highscores.highscoreList.highscores[highscores.selected].fields[0].y + highscores.highscoreList.highscores[highscores.selected].fields[0].height) {
      highscores.editingMode = false;
      highscores.highscoreList.highscores[highscores.selected].fields[0].moveCursor(highscores, -highscores.highscoreList.highscores[highscores.selected].fields[0].cursorPosition);
      drawHighscores(highscores);
    }
  }
}

function highscoresWheel(highscores, event) {
  if (highscores.selected >= 0) {
    if (event.deltaY > 0) {
      if (highscores.selected + 1 < highscores.highscoreList.highscores.length) {
        highscores.highscoreList.highscores[highscores.selected].fields[0].deselect();
        highscores.highscoreList.highscores[highscores.selected + 1].fields[0].select();
        if (highscores.highscoreList.highscores[highscores.highscoreList.highscores.length - 1].y > 260 && highscores.highscoreList.highscores[highscores.selected + 1].y > 220) {
          highscores.highscoreList.vShift(1);
        }
        highscores.selected += 1;
      }
    } else {
      if (highscores.selected - 1 >= 0) {
        highscores.highscoreList.highscores[highscores.selected].fields[0].deselect();
        highscores.highscoreList.highscores[highscores.selected - 1].fields[0].select();
        if (highscores.highscoreList.highscores[0].y < 80 && highscores.highscoreList.highscores[highscores.selected - 1].y < 120) {
          highscores.highscoreList.vShift(-1);
        }
        highscores.selected -= 1;
      }
    }
    drawHighscores(highscores);
  }
}

function drawHighscores(highscores) {
  highscores.clear();

  highscores.gD.context.drawImage(highscores.backgroundImage, 0, 0);

  highscores.title.draw(highscores.gD);

  highscores.highscoreList.draw(highscores, highscores.gD);

  highscores.backToMenu.draw(highscores.gD);

  if (highscores.highscoreList.highscores.length > 10) {
    highscores.gD.context.lineWidth = 4;
    highscores.gD.context.strokeStyle = "rgba(255, 255, 255, 1)";
    highscores.gD.context.beginPath();
    highscores.gD.context.moveTo(highscores.gD.canvas.width - 165, 60 + ((highscores.highscoreList.shiftFactor / highscores.highscoreList.highscores.length) * 220));
    highscores.gD.context.lineTo(highscores.gD.canvas.width - 165, 60 + ((Math.min(10 + highscores.highscoreList.shiftFactor, highscores.highscoreList.highscores.length) / highscores.highscoreList.highscores.length) * 220));
    highscores.gD.context.stroke();
    highscores.gD.context.lineWidth = 1;
    highscores.gD.context.beginPath();
    highscores.gD.context.moveTo(highscores.gD.canvas.width - 165, 60);
    highscores.gD.context.lineTo(highscores.gD.canvas.width - 165, 280);
    highscores.gD.context.stroke();
  }
}