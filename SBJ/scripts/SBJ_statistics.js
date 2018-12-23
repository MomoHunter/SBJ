function Statistics(menu, gD) {
  this.menu = menu;
  this.gD = gD;
  this.init = function() {
    this.title = new CanvasText(this.gD.canvas.width / 2, 30, "Statistics", "pageTitle");

    this.backToMenu = new CanvasButton(this.gD.canvas.width / 2 - 100, this.gD.canvas.height - 50, 200, 30, "Main Menu", "menu");

    this.updateSelection(-1, 0);
  };
  this.updateKeyPresses = function() {
    this.gD.newKeys.map(key => {

    }, this);
  };
  this.updateMouseMoves = function() {
    if (this.gD.mousePos.x >= this.backToMenu.x && this.gD.mousePos.x <= this.backToMenu.x + this.backToMenu.width &&
        this.gD.mousePos.y >= this.backToMenu.y && this.gD.mousePos.y <= this.backToMenu.y + this.backToMenu.height) {
      this.updateSelection(-1, this.selectedColumnIndex);
    }
  };
  this.updateClick = function() {
    var clickPos = this.gD.clicks.pop();
    if (!clickPos) {
      return
    }

    if (clickPos.x >= this.backToMenu.x && clickPos.x <= this.backToMenu.x + this.backToMenu.width &&
        clickPos.y >= this.backToMenu.y && clickPos.y <= this.backToMenu.y + this.backToMenu.height) {
      this.gD.currentPage = this.menu;
    }
  };
  this.updateWheelMoves = function() {

  };
  this.update = function() {

  };
  this.draw = function(ghostFactor) {
    this.gD.context.drawImage(this.menu.backgroundImage, 0, 0);

    this.title.draw(this.gD);
    this.backToMenu.draw(this.gD);
  };
  this.updateSelection = function(rowIndex, columnIndex) {
    if (this.selectedRowIndex !== undefined && this.selectedColumnIndex !== undefined) {
      if (this.selectedRowIndex === -1) {
        this.backToMenu.deselect();
      } else {
        
      }
    }

    if (rowIndex === -1) {
      this.backToMenu.select();
    } else {
      
    }
    this.selectedRowIndex = rowIndex;
    this.selectedColumnIndex = columnIndex;
  };
}

function StatisticsTab(x, y, width, height, tabNr, spriteKey, styleKey) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.tabNr = tabNr;
  this.spriteKey = spriteKey;
  this.styleKey = styleKey;
  this.selected = false;
  this.init = function() {

  };
  this.select = function() {
    this.selected = true;
  };
  this.deselect = function() {
    this.selected = false;
  };
  this.draw = function(gD) {
    var design = gD.design.elements[this.spriteKey];
    var [spriteX, spriteY, spriteWidth, spriteHeight] = gD.spriteDict[this.spriteKey];
    if (!this.selected) {
      drawCanvasRect(this.x, this.y + 55 * this.tabNr, 55, 55, design.rectKey.tab, gD);
      drawCanvasImage(
        gD.spritesheet, spriteX, spriteY, spriteWidth, spriteHeight, 
        this.x + Math.floor((55 - spriteWidth) / 2), this.y + Math.floor((55 - spriteHeight) / 2), 
        spriteWidth, spriteHeight
      );
      
    } else {

    }
  };
}