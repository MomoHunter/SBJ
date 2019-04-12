function SelectionScreenSingleplayer(menu, gD) {
  this.menu = menu;
  this.gD = gD;
  this.init = function() {
    this.title = new CanvasText(this.gD.canvas.width / 2, 30, "Singleplayer", "pageTitle");

    this.selections = [
      new ObjectSelection(
        100, 110, 40, 130, ["Player_Standard", "Player_Speedy", "Player_Longjohn", "Player_Disgusty",
        "Player_Strooper", "Player_Magician", "Player_Afroman"], this.gD.player, "objectSelection"
      ),
      new ObjectSelection(
        160, 110, 40, 130, ["Collectables_Nothing", "Collectables_Hat1"], this.gD.collectables, "objectSelection"
      ),
      new ObjectSelection(
        220, 110, 40, 130, ["Collectables_Nothing", "Collectables_Glasses1"], this.gD.collectables, "objectSelection"
      ),
      new ObjectSelection(
        280, 110, 40, 130, ["Collectables_Nothing", "Collectables_Beard1"], this.gD.collectables, "objectSelection"
      ),
      new ObjectSelection(
        340, 110, 40, 130, ["Stage_Fortress", "Stage_Air", "Stage_Water", "Stage_Forest", "Stage_Universe"],
        this.gD.stages, "objectSelection"
      )
    ];
    
    this.selections.map(selection => {
      selection.init(this.gD);
    }, this);
    
    this.confirmButton = new CanvasButton(
      (this.gD.canvas.width / 2) + 5, this.gD.canvas.height - 50, 200, 30, "Start", "menu"
    );
    this.backToMenu = new CanvasButton(
      (this.gD.canvas.width / 2) - 205, this.gD.canvas.height - 50, 200, 30, "Main Menu", "menu"
    );
    
    this.updateSelection(-1, 0);
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
          if (this.selectedColumnIndex > 0) {
            this.updateSelection(this.selectedRowIndex, 0);
          } else {
            this.updateSelection(this.selectedRowIndex, 1);
          }
        } else {
          this.updateSelection(this.selectedRowIndex, (this.selectedColumnIndex + 1) % this.selections.length);
        }
      } else if (keyB.get("Menu_NavLeft")[3].includes(key)) {
        if (this.selectedRowIndex === -1) {
          if (this.selectedColumnIndex > 0) {
            this.updateSelection(this.selectedRowIndex, 0);
          } else {
            this.updateSelection(this.selectedRowIndex, 1);
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
            this.gD.currentPage = this.menu;
          } else {
            this.gD.currentPage = this.menu.game;
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
      this.updateSelection(-1, 1);
    }
    
    if (this.gD.mousePos.x >= this.backToMenu.x && this.gD.mousePos.x <= this.backToMenu.x + this.backToMenu.width &&
        this.gD.mousePos.y >= this.backToMenu.y && this.gD.mousePos.y <= this.backToMenu.y + this.backToMenu.height) {
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
      this.gD.currentPage = this.menu.game;
    } else if (clickPos.x >= this.backToMenu.x && clickPos.x <= this.backToMenu.x + this.backToMenu.width &&
               clickPos.y >= this.backToMenu.y && clickPos.y <= this.backToMenu.y + this.backToMenu.height) {
      this.gD.currentPage = this.menu;
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
  };
  this.draw = function() {
    this.gD.context.drawImage(this.menu.backgroundImage, 0, 0);
    drawCanvasRect(0, 0, this.gD.canvas.width, this.gD.canvas.height, "selectionBackground", this.gD);

    this.title.draw(this.gD);

    this.selections.map(selection => {
      selection.draw(this.gD);
    }, this);
    
    this.confirmButton.draw(this.gD);
    this.backToMenu.draw(this.gD);
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