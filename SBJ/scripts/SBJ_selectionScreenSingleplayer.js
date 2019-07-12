function SelectionScreenSingleplayer(menu, gD) {
  this.menu = menu;
  this.gD = gD;
  this.init = function() {
    this.title = new CanvasText(this.gD.canvas.width / 2, 30, "Singleplayer", "pageTitle");
    this.showError = false;

    this.selections = [
      new ObjectSelection(
        120, 105, 40, 130, ["Player_Standard", "Player_Speedy", "Player_Longjohn", "Player_Disgusty",
        "Player_Strooper", "Player_Magician", "Player_Afroman"], this.gD.player, "objectSelection"
      ),
      new ObjectSelection(
        180, 105, 40, 130, ["Collectables_Nothing", "Collectables_Hat1"], this.gD.collectables, "objectSelection"
      ),
      new ObjectSelection(
        240, 105, 40, 130, ["Collectables_Nothing", "Collectables_Glasses1"], this.gD.collectables, "objectSelection"
      ),
      new ObjectSelection(
        300, 105, 40, 130, ["Collectables_Nothing", "Collectables_Beard1"], this.gD.collectables, "objectSelection"
      ),
      new ObjectSelection(
        360, 105, 40, 130, ["Stage_Fortress", "Stage_Air", "Stage_Water", "Stage_Forest", "Stage_Universe"],
        this.gD.stages, "objectSelection"
      )
    ];
    
    this.selections.map(selection => {
      selection.init(this.gD);
    }, this);
    
    this.selectionPreview = new SelectionPreview(this.gD.canvas.width / 2 - 400, 90, 800, 160, "selectionPreview");
    
    this.confirmButton = new CanvasButton(
      (this.gD.canvas.width / 2) + 110, this.gD.canvas.height - 50, 200, 30, "Start", "menu", false
    );
    this.backToMenu = new CanvasButton(
      (this.gD.canvas.width / 2) - 100, this.gD.canvas.height - 50, 200, 30, "Main Menu", "menu"
    );
    this.trainingButton = new CanvasButton(
      (this.gD.canvas.width / 2) - 310, this.gD.canvas.height - 50, 200, 30, "Training", "menu"
    );
    
    this.updateSelection(-1, 1);
  };
  this.checkIfUnlocked = function() {
    let unlocked = true;
    this.selections.map(selection => {
      if (!selection.data[selection.getSelected()][0]) {
        unlocked = false;
      }
    }, this);
    return unlocked;
  };
  this.setSaveData = function(data) {
    this.confirmButton.activated = data;
  };
  this.getSaveData = function(data) {
    return this.confirmButton.activated;
  };
  this.updateKeyPresses = function() {
    this.gD.newKeys.map(key => {
      let keyB = this.menu.controls.keyBindings;
      if (keyB.get("Menu_Back")[3].includes(key)) {
        this.gD.currentPage = this.menu;
      } else if (keyB.get("Menu_NavUp")[3].includes(key)) {
        if (this.selectedRowIndex === -1) {
          this.updateSelection(1, this.selectedColumnIndex);
        } else {
          this.updateSelection(this.selectedRowIndex - 1, this.selectedColumnIndex);
        }
      } else if (keyB.get("Menu_NavDown")[3].includes(key)) {
        if (this.selectedRowIndex === 1) {
          this.updateSelection(-1, this.selectedColumnIndex);
        } else {
          this.updateSelection(this.selectedRowIndex + 1, this.selectedColumnIndex);
        }
      } else if (keyB.get("Menu_NavRight")[3].includes(key)) {
        if (this.selectedRowIndex === -1) {
          this.updateSelection(this.selectedRowIndex, (this.selectedColumnIndex + 1) % 3);
        } else {
          this.updateSelection(this.selectedRowIndex, (this.selectedColumnIndex + 1) % this.selections.length);
        }
      } else if (keyB.get("Menu_NavLeft")[3].includes(key)) {
        if (this.selectedRowIndex === -1) {
          if (this.selectedColumnIndex > 0) {
            this.updateSelection(this.selectedRowIndex, this.selectedColumnIndex - 1);
          } else {
            this.updateSelection(this.selectedRowIndex, 2);
          }
        } else {
          this.updateSelection(
            this.selectedRowIndex,
            (this.selectedColumnIndex + this.selections.length - 1) % this.selections.length
          );
        }
      } else if (keyB.get("Menu_Confirm")[3].includes(key)) {
        if (this.selectedRowIndex === -1) {
          if (this.selectedColumnIndex === 0) {
            if (this.checkIfUnlocked()) {
              this.confirmButton.activate();
              this.menu.game.init();
              this.menu.game.setStage("Stage_Training", true);
              this.menu.game.addPlayer(
                this.selections[0].getSelected(), this.selections[1].getSelected(), this.selections[2].getSelected(),
                this.selections[3].getSelected(), true
              );
              this.menu.game.setStartTime();
              this.gD.currentPage = this.menu.game;
            }
          } else if (this.selectedColumnIndex === 1) {
            this.gD.currentPage = this.menu;
          } else {
            if (this.checkIfUnlocked() && this.confirmButton.activated) {
              this.menu.game.init();
              this.menu.game.setStage(this.selections[4].getSelected());
              this.menu.game.addPlayer(
                this.selections[0].getSelected(), this.selections[1].getSelected(), this.selections[2].getSelected(),
                this.selections[3].getSelected(), true
              );
              this.menu.game.setStartTime();
              this.gD.currentPage = this.menu.game;
            }
          }
        } else if (this.selectedRowIndex === 0) {
          this.selections[this.selectedColumnIndex].down(this.gD);
        } else {
          this.selections[this.selectedColumnIndex].up(this.gD);
        }
      } else if (keyB.get("Mute_All")[3].includes(key)) {
        this.gD.muted = !this.gD.muted;
        this.menu.muteButton.setSprite();
      }
    }, this);
  };
  this.updateMouseMoves = function() {
    this.selections.map((selection, index) => {
      if (this.gD.mousePos.x >= selection.x && this.gD.mousePos.x <= selection.x + selection.width &&
          this.gD.mousePos.y >= selection.y && this.gD.mousePos.y <= selection.y + 20) {
        this.updateSelection(0, index);
      }
      if (this.gD.mousePos.x >= selection.x && this.gD.mousePos.x <= selection.x + selection.width &&
          this.gD.mousePos.y >= selection.y + selection.height - 20 &&
          this.gD.mousePos.y <= selection.y + selection.height) {
        this.updateSelection(1, index);
      }
    }, this);
    
    if (this.gD.mousePos.x >= this.confirmButton.x &&
        this.gD.mousePos.x <= this.confirmButton.x + this.confirmButton.width &&
        this.gD.mousePos.y >= this.confirmButton.y &&
        this.gD.mousePos.y <= this.confirmButton.y + this.confirmButton.height) {
      this.updateSelection(-1, 2);
    }

    if (this.gD.mousePos.x >= this.backToMenu.x && this.gD.mousePos.x <= this.backToMenu.x + this.backToMenu.width &&
        this.gD.mousePos.y >= this.backToMenu.y && this.gD.mousePos.y <= this.backToMenu.y + this.backToMenu.height) {
      this.updateSelection(-1, 1);
    }

    if (this.gD.mousePos.x >= this.trainingButton.x &&
        this.gD.mousePos.x <= this.trainingButton.x + this.trainingButton.width &&
        this.gD.mousePos.y >= this.trainingButton.y &&
        this.gD.mousePos.y <= this.trainingButton.y + this.trainingButton.height) {
      this.updateSelection(-1, 0);
    }
  };
  this.updateClick = function() {
    let clickPos = this.gD.clicks.pop();
    if (!clickPos) {
      return;
    }
    
    this.selections.map(selection => {
      if (clickPos.x >= selection.x && clickPos.x <= selection.x + selection.width &&
          clickPos.y >= selection.y && clickPos.y <= selection.y + 20) {
        selection.down(this.gD);
      } else if (clickPos.x >= selection.x && clickPos.x <= selection.x + selection.width &&
                 clickPos.y >= selection.y + selection.height - 20 && clickPos.y <= selection.y + selection.height) {
        selection.up(this.gD);
      }
    }, this);
    
    if (clickPos.x >= this.confirmButton.x && clickPos.x <= this.confirmButton.x + this.confirmButton.width &&
        clickPos.y >= this.confirmButton.y && clickPos.y <= this.confirmButton.y + this.confirmButton.height) {
      if (this.checkIfUnlocked() && this.confirmButton.activated) {
        this.menu.game.init();
        this.menu.game.setStage(this.selections[4].getSelected());
        this.menu.game.addPlayer(
          this.selections[0].getSelected(), this.selections[1].getSelected(), this.selections[2].getSelected(),
          this.selections[3].getSelected(), true
        );
        this.menu.game.setStartTime();
        this.gD.currentPage = this.menu.game;
      }
    } else if (clickPos.x >= this.backToMenu.x && clickPos.x <= this.backToMenu.x + this.backToMenu.width &&
               clickPos.y >= this.backToMenu.y && clickPos.y <= this.backToMenu.y + this.backToMenu.height) {
      this.gD.currentPage = this.menu;
    } else if (clickPos.x >= this.trainingButton.x && clickPos.x <= this.trainingButton.x + this.trainingButton.width &&
               clickPos.y >= this.trainingButton.y && clickPos.y <= this.trainingButton.y + this.trainingButton.height) {
      if (this.checkIfUnlocked()) {
        this.confirmButton.activate();
        this.menu.game.init();
        this.menu.game.setStage("Stage_Training", true);
        this.menu.game.addPlayer(
          this.selections[0].getSelected(), this.selections[1].getSelected(), this.selections[2].getSelected(),
          this.selections[3].getSelected(), true
        );
        this.menu.game.setStartTime();
        this.gD.currentPage = this.menu.game;
      }
    }
  };
  this.updateWheelMoves = function() {
    /* unused */
  };
  this.update = function() {
    this.selections.map(selection => {
      selection.update(this.gD);
    }, this);
    
    this.confirmButton.update();
    this.backToMenu.update();
    this.trainingButton.update();
    
    if (!this.checkIfUnlocked()) {
      this.showError = true;
    } else {
      this.showError = false;
    }
  };
  this.draw = function() {
    this.gD.context.drawImage(this.menu.backgroundImage, 0, 0);
    drawCanvasRect(0, 0, this.gD.canvas.width, this.gD.canvas.height, "selectionBackground", this.gD);

    this.title.draw(this.gD);
    
    this.selectionPreview.draw(this, this.gD);

    this.selections.map(selection => {
      selection.draw(this.gD);
    }, this);
    
    this.confirmButton.draw(this.gD);
    this.backToMenu.draw(this.gD);
    this.trainingButton.draw(this.gD);
    
    if (this.showError) {
      drawCanvasText(
        this.gD.canvas.width / 2, this.gD.canvas.height - 75, "Keine gesperrten Objekte auswählen!", "error", gD
      );
    }
  };
  /**
   * updates the selected object and deselects the old object
   * @param {number}  rowIndex    the row of the new selected object
   * @param {number}  columnIndex the column of the new selected object
   */
  this.updateSelection = function(rowIndex, columnIndex) {
    if (this.selectedRowIndex !== undefined && this.selectedColumnIndex !== undefined) {
      if (this.selectedRowIndex === -1) {
        if (this.selectedColumnIndex === 0) {
          this.trainingButton.deselect();
        } else if (this.selectedColumnIndex === 1) {
          this.backToMenu.deselect();
        } else {
          this.confirmButton.deselect();
        }
      } else {
        if (this.selectedRowIndex === 0) {
          this.selections[this.selectedColumnIndex].deselectTop();
        } else {
          this.selections[this.selectedColumnIndex].deselectBottom();
        }
      }
    }

    if (rowIndex === -1) {
      if (columnIndex === 0) {
        this.trainingButton.select();
      } else if (columnIndex === 1) {
        this.backToMenu.select();
      } else {
        this.confirmButton.select();
      }
    } else {
      if (rowIndex === 0) {
        this.selections[columnIndex].selectTop();
      } else {
        this.selections[columnIndex].selectBottom();
      }
    }
    this.selectedRowIndex = rowIndex;
    this.selectedColumnIndex = columnIndex;
  };
}

function ObjectSelection(x, y, width, height, objects, data, styleKey) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.data = data;
  this.spriteData = [];
  this.newSprite = {};
  this.spritesX = [0, 0, 0];
  this.spritesY = [0, 0, 0];
  this.spritesZoom = [0.6, 1, 0.6];
  this.newX = 0;
  this.newY = 0;
  this.newZoom = 0;
  this.newIndex = 0;
  this.direction = 0;      //0 = no moving, -1 = up, 1 = down
  this.objects = objects;
  this.styleKey = styleKey;
  this.arrowSelWidth = [0, 0];
  this.arrowSelHeight = [0, 0];
  this.topSelected = false;
  this.bottomSelected = false;
  this.speed = 25;
  this.animationSpeed = 4;
  this.currentIndices = [0, 0, 0];
  this.init = function(gD) {
    this.spriteData.push({});
    this.spriteData.push(getSpriteData(this.objects[this.currentIndices[1]], gD));
    this.spriteData.push({});
    
    if (this.currentIndices[1] === 0) {
      this.currentIndices[0] = this.objects.length - 1;
      this.spriteData[0] = getSpriteData(this.objects[this.currentIndices[0]], gD);
    } else {
      this.currentIndices[0] = this.currentIndices[1] - 1;
      this.spriteData[0] = getSpriteData(this.objects[this.currentIndices[0]], gD);
    }
    if (this.currentIndices[1] === this.objects.length - 1) {
      this.currentIndices[2] = 0;
      this.spriteData[2] = getSpriteData(this.objects[this.currentIndices[2]], gD);
    } else {
      this.currentIndices[2] = this.currentIndices[1] + 1;
      this.spriteData[2] = getSpriteData(this.objects[this.currentIndices[2]], gD);
    }
    
    this.spriteData.map((data, index) => {
      this.spritesX[index] = this.x + (this.width - data.spriteWidth) / 2;
      this.spritesY[index] = this.y + this.height / 4 * (index + 1) - data.spriteHeight / 2;
    }, this);
  };
  this.getSelected = function() {
    return this.objects[this.currentIndices[1]];
  };
  this.selectTop = function() {
    this.topSelected = true;
  };
  this.deselectTop = function() {
    this.topSelected = false;
  };
  this.selectBottom = function() {
    this.bottomSelected = true;
  };
  this.deselectBottom = function() {
    this.bottomSelected = false;
  };
  this.up = function(gD) {
    if (this.direction === 0) {
      this.newIndex = this.currentIndices[2] + 1;
      if (this.newIndex >= this.objects.length) {
        this.newIndex = 0;
      }
      this.newSprite = getSpriteData(this.objects[this.newIndex], gD);
      
      this.newX = this.x + this.width / 2 - this.newSprite.spriteWidth / 2;
      this.newY = this.y + this.height / 8 * 7 - this.newSprite.spriteHeight / 2;
      this.newZoom = 0;
      this.direction = -1;
    }
  };
  this.down = function(gD) {
    if (this.direction === 0) {
      this.newIndex = this.currentIndices[0] - 1;
      if (this.newIndex < 0) {
        this.newIndex = this.objects.length - 1;
      }
      this.newSprite = getSpriteData(this.objects[this.newIndex], gD);
      
      this.newX = this.x + this.width / 2 - this.newSprite.spriteWidth / 2;
      this.newY = this.y + this.height / 8 - this.newSprite.spriteHeight / 2;
      this.newZoom = 0;
      this.direction = 1;
    }
  };
  this.update = function(gD) {
    if (this.direction === 1) {
      this.newY += (this.height / 8) / this.speed;
      this.spritesY[0] += (this.height / 4) / this.speed;
      this.spritesY[1] += (this.height / 4) / this.speed;
      this.spritesY[2] += (this.height / 8) / this.speed;
      this.newZoom += 0.6 / this.speed;
      this.spritesZoom[0] += 0.4 / this.speed;
      this.spritesZoom[1] -= 0.4 / this.speed;
      this.spritesZoom[2] -= 0.6 / this.speed;
      if (this.newZoom >= 0.6) {
        this.currentIndices.unshift(this.newIndex);
        this.currentIndices = this.currentIndices.slice(0, 3);
        this.currentIndices.map((cI, index) => {
          this.spriteData[index] = getSpriteData(this.objects[cI], gD);
          this.spritesX[index] = this.x + (this.width - this.spriteData[index].spriteWidth) / 2;
          this.spritesY[index] = this.y + this.height / 4 * (index + 1) - this.spriteData[index].spriteHeight / 2;
        }, this);
        this.spritesZoom = [0.6, 1, 0.6];
        this.direction = 0;
      }
    } else if (this.direction === -1) {
      this.spritesY[0] -= (this.height / 8) / this.speed;
      this.spritesY[1] -= (this.height / 4) / this.speed;
      this.spritesY[2] -= (this.height / 4) / this.speed;
      this.newY -= (this.height / 8) / this.speed;
      this.spritesZoom[0] -= 0.6 / this.speed;
      this.spritesZoom[1] -= 0.4 / this.speed;
      this.spritesZoom[2] += 0.4 / this.speed;
      this.newZoom += 0.6 / this.speed;
      if (this.newZoom >= 0.6) {
        this.currentIndices.push(this.newIndex);
        this.currentIndices = this.currentIndices.slice(1, 4);
        this.currentIndices.map((cI, index) => {
          this.spriteData[index] = getSpriteData(this.objects[cI], gD);
          this.spritesX[index] = this.x + (this.width - this.spriteData[index].spriteWidth) / 2;
          this.spritesY[index] = this.y + this.height / 4 * (index + 1) - this.spriteData[index].spriteHeight / 2;
        }, this);
        this.spritesZoom = [0.6, 1, 0.6];
        this.direction = 0;
      }
    }
    if (this.topSelected) {
      if (this.arrowSelHeight[0] < 20) {
        this.arrowSelHeight[0] += this.animationSpeed;
        if (this.arrowSelHeight[0] >= 20) {
          this.arrowSelHeight[0] = 20;
        }
      } else if (this.arrowSelHeight[0] >= 20 && this.arrowSelWidth[0] < this.width) {
        this.arrowSelWidth[0] += this.animationSpeed;
        if (this.arrowSelWidth[0] >= this.width) {
          this.arrowSelWidth[0] = this.width;
        }
      }
    } else {
      if (this.arrowSelWidth[0] > 0) {
        this.arrowSelWidth[0] -= this.animationSpeed;
        if (this.arrowSelWidth[0] <= 0) {
          this.arrowSelWidth[0] = 0;
        }
      } else if (this.arrowSelWidth[0] <= 0 && this.arrowSelHeight[0] > 0) {
        this.arrowSelHeight[0] -= this.animationSpeed;
        if (this.arrowSelHeight[0] <= 0) {
          this.arrowSelHeight[0] = 0;
        }
      }
    }
    if (this.bottomSelected) {
      if (this.arrowSelHeight[1] < 20) {
        this.arrowSelHeight[1] += this.animationSpeed;
        if (this.arrowSelHeight[1] >= 20) {
          this.arrowSelHeight[1] = 20;
        }
      } else if (this.arrowSelHeight[1] >= 20 && this.arrowSelWidth[1] < this.width) {
        this.arrowSelWidth[1] += this.animationSpeed;
        if (this.arrowSelWidth[1] >= this.width) {
          this.arrowSelWidth[1] = this.width;
        }
      }
    } else {
      if (this.arrowSelWidth[1] > 0) {
        this.arrowSelWidth[1] -= this.animationSpeed;
        if (this.arrowSelWidth[1] <= 0) {
          this.arrowSelWidth[1] = 0;
        }
      } else if (this.arrowSelWidth[1] <= 0 && this.arrowSelHeight[1] > 0) {
        this.arrowSelHeight[1] -= this.animationSpeed;
        if (this.arrowSelHeight[1] <= 0) {
          this.arrowSelHeight[1] = 0;
        }
      }
    }
  };
  this.draw = function(gD) {
    let design = gD.design.elements[this.styleKey];
    let centerTopX = this.x + this.width / 2;
    let centerTopY = this.y + 10;
    let centerBottomX = this.x + this.width / 2;
    let centerBottomY = this.y + this.height - 10;
    let qmSpriteData = getSpriteData("Item_Questionmark", gD);

    drawCanvasPolygon(
      this.x + this.width / 2, this.y, design.rectKey.arrow, gD, this.x + this.width, this.y + 10,
      this.x + this.width, this.y + 20, this.x + this.width / 2, this.y + 10, this.x, this.y + 20, this.x, this.y + 10
    );
    drawCanvasPolygon(
      centerTopX, centerTopY - this.arrowSelHeight[0] / 2, design.rectKey.selected, gD, 
      centerTopX + this.arrowSelWidth[0] / 2,
        centerTopY - this.arrowSelHeight[0] / 2 + 10 * (this.arrowSelWidth[0] / this.width),
      centerTopX + Math.min(this.arrowSelHeight[0] / 2 + this.arrowSelWidth[0] / 2, this.width / 2), centerTopY,
      centerTopX + Math.min(this.arrowSelHeight[0] / 2 + this.arrowSelWidth[0] / 2, this.width / 2),
        centerTopY + Math.max((this.arrowSelHeight[0] / 2 + this.arrowSelWidth[0] / 2) - this.width / 2, 0),
      centerTopX + this.arrowSelWidth[0] / 2 + this.arrowSelHeight[0] / 2 - 10 *
          ((this.arrowSelWidth[0] + this.arrowSelHeight[0]) / (this.width + this.arrowSelHeight[0])),
        centerTopY + 10 * ((this.arrowSelWidth[0] + this.arrowSelHeight[0]) / (this.width + this.arrowSelHeight[0])),
      centerTopX, centerTopY,
      centerTopX - this.arrowSelWidth[0] / 2 - this.arrowSelHeight[0] / 2 + 10 *
          ((this.arrowSelWidth[0] + this.arrowSelHeight[0]) / (this.width + this.arrowSelHeight[0])),
        centerTopY + 10 * ((this.arrowSelWidth[0] + this.arrowSelHeight[0]) / (this.width + this.arrowSelHeight[0])),
      centerTopX - Math.min(this.arrowSelHeight[0] / 2 + this.arrowSelWidth[0] / 2, this.width / 2),
        centerTopY + Math.max((this.arrowSelHeight[0] / 2 + this.arrowSelWidth[0] / 2) - this.width / 2, 0),
      centerTopX - Math.min(this.arrowSelHeight[0] / 2 + this.arrowSelWidth[0] / 2, this.width / 2), centerTopY,
      centerTopX - this.arrowSelWidth[0] / 2, 
        centerTopY - this.arrowSelHeight[0] / 2 + 10 * (this.arrowSelWidth[0] / this.width)
    );
    drawCanvasPolygonBorder(
      this.x + this.width / 2, this.y, design.borderKey.arrow, gD, this.x + this.width, this.y + 10,
      this.x + this.width, this.y + 20, this.x + this.width / 2, this.y + 10, this.x, this.y + 20, this.x, this.y + 10
    );
    this.spriteData.map((sprite, index) => {
      if (this.data[this.objects[this.currentIndices[index]]][0]) {
        drawCanvasSmallImage(
          Math.floor(this.spritesX[index]), Math.floor(this.spritesY[index]),
          this.spritesZoom[index], this.objects[this.currentIndices[index]], gD
        );
      } else {
        drawCanvasSmallImage(
          Math.floor(this.spritesX[index]), Math.floor(this.spritesY[index]), this.spritesZoom[index],
          this.objects[this.currentIndices[index]] + "_G", gD
        );
        drawCanvasSmallImage(
          this.x + Math.floor(this.width / 2 - qmSpriteData.spriteWidth / 2), 
          this.spritesY[index] + Math.floor((this.spriteData[index].spriteHeight - qmSpriteData.spriteHeight) / 2), 
          this.spritesZoom[index], "Item_Questionmark", gD
        );
      }
    }, this);
    if (this.direction !== 0) {
      if (this.data[this.objects[this.newIndex]][0]) {
        drawCanvasSmallImage(this.newX, this.newY, this.newZoom, this.objects[this.newIndex], gD);
      } else {
        drawCanvasSmallImage(this.newX, this.newY, this.newZoom, this.objects[this.newIndex] + "_G", gD);
        drawCanvasSmallImage(
          this.x + Math.floor(this.width / 2 - qmSpriteData.spriteWidth / 2), 
          this.newY + Math.floor((this.newSprite.spriteHeight - qmSpriteData.spriteHeight) / 2), 
          this.newZoom, "Item_Questionmark", gD
        );
      }
    }
    drawCanvasPolygon(
      this.x + this.width / 2, this.y + this.height, design.rectKey.arrow, gD, this.x + this.width,
      this.y + this.height - 10, this.x + this.width, this.y + this.height - 20, this.x + this.width / 2,
      this.y + this.height - 10, this.x, this.y + this.height - 20, this.x, this.y + this.height - 10
    );
    drawCanvasPolygon(
      centerBottomX, centerBottomY + this.arrowSelHeight[1] / 2, design.rectKey.selected, gD, 
      centerBottomX - this.arrowSelWidth[1] / 2,
        centerBottomY + this.arrowSelHeight[1] / 2 - 10 * (this.arrowSelWidth[1] / this.width),
      centerBottomX - Math.min(this.arrowSelHeight[1] / 2 + this.arrowSelWidth[1] / 2, this.width / 2), centerBottomY,
      centerBottomX - Math.min(this.arrowSelHeight[1] / 2 + this.arrowSelWidth[1] / 2, this.width / 2),
        centerBottomY - Math.max((this.arrowSelHeight[1] / 2 + this.arrowSelWidth[1] / 2) - this.width / 2, 0),
      centerBottomX - this.arrowSelWidth[1] / 2 - this.arrowSelHeight[1] / 2 + 10 *
          ((this.arrowSelWidth[1] + this.arrowSelHeight[1]) / (this.width + this.arrowSelHeight[1])),
        centerBottomY - 10 * ((this.arrowSelWidth[1] + this.arrowSelHeight[1]) / (this.width + this.arrowSelHeight[1])),
      centerBottomX, centerBottomY,
      centerBottomX + this.arrowSelWidth[1] / 2 + this.arrowSelHeight[1] / 2 - 10 *
          ((this.arrowSelWidth[1] + this.arrowSelHeight[1]) / (this.width + this.arrowSelHeight[1])),
        centerBottomY - 10 * ((this.arrowSelWidth[1] + this.arrowSelHeight[1]) / (this.width + this.arrowSelHeight[1])),
      centerBottomX + Math.min(this.arrowSelHeight[1] / 2 + this.arrowSelWidth[1] / 2, this.width / 2),
        centerBottomY - Math.max((this.arrowSelHeight[1] / 2 + this.arrowSelWidth[1] / 2) - this.width / 2, 0),
      centerBottomX + Math.min(this.arrowSelHeight[1] / 2 + this.arrowSelWidth[1] / 2, this.width / 2), centerBottomY,
      centerBottomX + this.arrowSelWidth[1] / 2, 
        centerBottomY + this.arrowSelHeight[1] / 2 - 10 * (this.arrowSelWidth[1] / this.width)
    );
    drawCanvasPolygonBorder(
      this.x + this.width / 2, this.y + this.height, design.borderKey.arrow, gD, this.x + this.width,
      this.y + this.height - 10, this.x + this.width, this.y + this.height - 20, this.x + this.width / 2,
      this.y + this.height - 10, this.x, this.y + this.height - 20, this.x, this.y + this.height - 10
    );
  };
}

function SelectionPreview(x, y, width, height, styleKey) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.styleKey = styleKey;
  this.draw = function(selectionScreenSP, gD) {
    let design = gD.design.elements[this.styleKey];
    let spriteData = [];
    selectionScreenSP.selections.map((selection, index) => {
      if (index === 4) {
        spriteData.push(getSpriteData(selection.getSelected().replace("_", "_B_"), gD));
      } else {
        if (selection.getSelected() === "Collectables_Nothing") {
          spriteData.push({spriteWidth: 0, spriteHeight: 0, key: "Collectables_Nothing"});
        } else {
          spriteData.push(getSpriteData(selection.getSelected(), gD));
        }
      }
    }, this);
    
    drawCanvasRect(this.x, this.y, this.width, this.height, design.rectKey.background, gD);
    if (gD.stages[spriteData[4].key.replace("_B", "")][0]) {
      drawCanvasImage(
        this.x + this.width - spriteData[4].spriteWidth - 10, this.y + (this.height - spriteData[4].spriteHeight) / 2,
        spriteData[4].key, gD
      );
    } else {
      drawCanvasRect(
        this.x + this.width - spriteData[4].spriteWidth - 10, this.y + (this.height - spriteData[4].spriteHeight) / 2,
        spriteData[4].spriteWidth, spriteData[4].spriteHeight, design.rectKey.locked, gD
      );
    }
    drawCanvasRect(this.x + this.width / 2 - 10, this.y + 10, 60, 60, design.rectKey.background, gD);
    
    let charHeight = spriteData[0].spriteHeight - gD.player[spriteData[0].key][1].y + spriteData[1].spriteHeight + 
      Math.max(spriteData[3].spriteHeight - (spriteData[0].spriteHeight - gD.player[spriteData[0].key][3].y), 0);
    let playerY = spriteData[1].spriteHeight - gD.player[spriteData[0].key][1].y;

    if (gD.player[spriteData[0].key][0]) {
      drawCanvasImage(
        this.x + this.width / 2 + 20 - spriteData[0].spriteWidth / 2,
        this.y + 40 - charHeight / 2 + playerY,
        spriteData[0].key, gD
      );
    } else {
      drawCanvasImage(
        this.x + this.width / 2 + 20 - spriteData[0].spriteWidth / 2,
        this.y + 40 - charHeight / 2 + playerY,
        spriteData[0].key + "_G", gD
      );
    }
    if (spriteData[1].key !== "Collectables_Nothing") {
      if (gD.collectables[spriteData[1].key][0]) {
        drawCanvasImage(
          this.x + this.width / 2 + 20 - spriteData[1].spriteWidth / 2,
          this.y + 40 - charHeight / 2, spriteData[1].key, gD
        );
      } else {
        drawCanvasImage(
          this.x + this.width / 2 + 20 - spriteData[1].spriteWidth / 2,
          this.y + 40 - charHeight / 2, spriteData[1].key + "_G", gD
        );
      }
    }
    if (spriteData[2].key !== "Collectables_Nothing") {
      if (gD.collectables[spriteData[2].key][0]) {
        drawCanvasImage(
          this.x + this.width / 2 + 20 - spriteData[2].spriteWidth / 2,
          this.y + 40 - charHeight / 2 + playerY + gD.player[spriteData[0].key][2].y - spriteData[2].spriteHeight / 2,
          spriteData[2].key, gD
        );
      } else {
        drawCanvasImage(
          this.x + this.width / 2 + 20 - spriteData[2].spriteWidth / 2,
          this.y + 40 - charHeight / 2 + playerY + gD.player[spriteData[0].key][2].y - spriteData[2].spriteHeight / 2,
          spriteData[2].key + "_G", gD
        );
      }
    }
    if (spriteData[3].key !== "Collectables_Nothing") {
      if (gD.collectables[spriteData[3].key][0]) {
        drawCanvasImage(
          this.x + this.width / 2 + 20 - spriteData[3].spriteWidth / 2,
          this.y + 40 - charHeight / 2 + playerY + gD.player[spriteData[0].key][3].y, spriteData[3].key, gD
        );
      } else {
        drawCanvasImage(
          this.x + this.width / 2 + 20 - spriteData[3].spriteWidth / 2,
          this.y + 40 - charHeight / 2 + playerY + gD.player[spriteData[0].key][3].y,
          spriteData[3].key + "_G", gD
        );
      }
    }
    drawCanvasRectBorder(this.x + this.width / 2 - 10, this.y + 10, 60, 60, design.borderKey, gD);
    drawCanvasRectBorder(
      this.x + this.width - spriteData[4].spriteWidth - 10, this.y + (this.height - spriteData[4].spriteHeight) / 2, 
      spriteData[4].spriteWidth, spriteData[4].spriteHeight, design.borderKey, gD
    );
    drawCanvasRectBorder(this.x, this.y, this.width, this.height, design.borderKey, gD);
  };
}