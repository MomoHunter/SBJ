/**
 * A text object on the canvas
 * @param {number} x        x-coordinate of the top-left corner of the text on the canvas
 * @param {number} y        y-coordinate of the top-left corner of the text on the canvas
 * @param {string} text     the text to write
 * @param {string} styleKey the design to use for the text
 */
function CanvasText(x, y, text, styleKey) {
  this.x = x;
  this.y = y;
  this.text = text;
  this.styleKey = styleKey;
  this.draw = function(gD) {
    drawCanvasText(this.x, this.y, this.text, this.styleKey, gD);
  };
}

/**
 * A rainbow text object on the canvas
 * @param {number} x        x-coordinate of the top-left corner of the text on the canvas
 * @param {number} y        y-coordinate of the top-left corner of the text on the canvas
 * @param {string} text     the text to write
 * @param {string} styleKey the design to use for the text
 */
function CanvasRainbowText(x, y, text, styleKey) {
  this.x = x;
  this.y = y;
  this.text = text;
  this.styleKey = styleKey;
  this.counter = text.length * 8;
  this.index = 0;
  this.update = function() {
    this.counter++;
    this.index = Math.floor(this.counter / 8);
  };
  this.draw = function(gD) {
    let design = gD.design.text[this.styleKey];
    let x = this.x;

    gD.context.textAlign = "left";
    gD.context.textBaseline = design.baseline;
    gD.context.font = design.font;

    switch (design.align) {
      case "center":
        x -= gD.context.measureText(this.text).width / 2;
        break;
      case "right":
        x -= gD.context.measureText(this.text).width;
        break;
      default:
    }
    this.text.split("").map((letter, index) => {
      gD.context.fillStyle = `rgba(${design.color[(this.index - index) % 12]})`;
      gD.context.fillText(letter, x + gD.context.measureText(this.text.substring(0, index)).width, this.y);
      if (design.borderKey !== "") {
        drawCanvasTextBorder(this.x, this.y, this.text, design.borderKey, gD);
      }
    }, this);

  };
}

/**
 * An image object on the canvas
 * @param {number} x         x-coordinate of the top-left corner of the image on the canvas
 * @param {number} y         y-coordinate of the top-left corner of the image on the canvas
 * @param {string} spriteKey the sprite to use for the image
 */
function CanvasImage(x, y, spriteKey = null) {
  this.x = x;
  this.y = y;
  this.spriteKey = spriteKey;
  this.draw = function(gD) {
    drawCanvasImage(this.x, this.y, this.spriteKey, gD);
  };
}

/**
 * A rectangle object on the canvas
 * @param {number} x        x-coordinate of the top-left corner of the rectangle on the canvas
 * @param {number} y        y-coordinate of the top-left corner of the rectangle on the canvas
 * @param {number} width    width of the rectangle on the canvas
 * @param {number} height   height of the rectangle on the canvas
 * @param {string} styleKey the design to use for the rectangle
 */
function CanvasRect(x, y, width, height, styleKey) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.styleKey = styleKey;
  this.draw = function(gD) {
    drawCanvasRect(this.x, this.y, this.width, this.height, this.styleKey, gD);
  };
}

/**
 * A border object on the canvas
 * @param {number} x        x-coordinate of the top-left corner of the border on the canvas
 * @param {number} y        y-coordinate of the top-left corner of the border on the canvas
 * @param {number} width    width of the border on the canvas
 * @param {number} height   height of the border on the canvas
 * @param {string} styleKey the design to use for the border
 */
function CanvasBorder(x, y, width, height, styleKey) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.styleKey = styleKey;
  this.draw = function(gD) {
    drawCanvasRectBorder(this.x, this.y, this.width, this.height, this.styleKey, gD);
  }
}

/**
 * A scrollbar object on the canvas
 * @param {number} x             x-coordinate of the top-left corner of the scrollbar on the canvas
 * @param {number} y             y-coordinate of the top-left corner of the scrollbar on the canvas
 * @param {number} height        height of the scrollbar on the canvas
 * @param {number} elementHeight height of one element that should be scrolled with the scrollbar
 * @param {number} elementsCount the amount of elements that are scrollable
 * @param {string} styleKey      the design to use for the scrollbar
 */
function CanvasScrollBar(x, y, height, elementHeight, elementsCount, styleKey) {
  this.x = x;
  this.y = y;
  this.height = height;
  this.elementHeight = elementHeight;
  this.elementsCount = elementsCount;
  this.styleKey = styleKey;
  this.currentElementIndex = 0;
  this.refresh = function(newElementsCount) {
    this.elementsCount = newElementsCount;
  };
  this.scroll = function(currentElementIndex) {
    this.currentElementIndex = currentElementIndex;
  };
  this.draw = function(gD) {
    if (this.elementsCount * this.elementHeight <= this.height) {
      return;
    }
    
    var design = gD.design.elements[this.styleKey];
    drawCanvasLine(this.x, this.y, design.lineKey, gD, this.x, this.y + this.height);
    drawCanvasLine(
      this.x, this.y + ((this.currentElementIndex / this.elementsCount) * this.height),
      design.barKey, gD,
      this.x, this.y + (((this.height / this.elementHeight) + this.currentElementIndex) / this.elementsCount) * this.height
    );
  };
}

/**
 * A background image object on the canvas
 * @param {number} y      y-coordinate of the top-left corner of the background image on the canvas
 * @param {number} width  width of the background image on the canvas
 * @param {number} height height of the background image on the canvas
 * @param {string} img    the src of the image
 */
function Background(y, width, height, img) {
  this.y = y;
  this.width = width;
  this.height = height;
  this.img = new Image();
  this.img.src = img;
  this.draw = function(game, gD, ghostFactor) {
    var temp = (game.distanceTravelled - (game.globalSpeed * ghostFactor)) % this.width;
    gD.context.drawImage(this.img, temp, 0, this.width - temp, this.height, 0, this.y, this.width - temp, this.height);
    gD.context.drawImage(this.img, 0, 0, temp, this.height, this.width - temp, this.y, temp, this.height);
  };
}

/**
 * An animated background image on the canvas
 * @param {number} y      y-coordinate of the top-left corner of the background image on the canvas
 * @param {number} width  width of the background image on the canvas
 * @param {number} height height of the background image on the canvas
 * @param {string} img    the src of the image
 * @param {number} cycles the amount of different pictures of the background
 * @param {number} speed  the change speed of the version of the background
 */
function AnimatedBackground(y, width, height, img, cycles, speed) {
  this.y = y;
  this.width = width;
  this.height = height;
  this.img = new Image();
  this.img.src = img;
  this.cycles = cycles;
  this.speed = speed;
  this.draw = function(game, gD, ghostFactor) {
    var temp = (game.distanceTravelled - (game.globalSpeed * ghostFactor)) % this.width;
    gD.context.drawImage(this.img, temp, Math.floor(game.frameCounter / this.speed) % cycles * (this.height / cycles), this.width - temp, (this.height / cycles), 0, this.y, this.width - temp, (this.height / cycles));
    gD.context.drawImage(this.img, 0, Math.floor(game.frameCounter / this.speed) % cycles * (this.height / cycles), temp, (this.height / cycles), this.width - temp, this.y, temp, (this.height / cycles));
  };
}

/**
 * A button object on the canvas
 * @param {number} x        x-coordinate of the top-left corner of the button on the canvas
 * @param {number} y        y-coordinate of the top-left corner of the button on the canvas
 * @param {number} width    width of the button on the canvas
 * @param {number} height   height of the button on the canvas
 * @param {string} text     the text to write on the button
 * @param {string} styleKey the design to use for the button
 */
function CanvasButton(x, y, width, height, text, styleKey) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.text = text;
  this.styleKey = styleKey;
  this.selected = false;
  this.select = function() {
    this.selected = true;
  };
  this.deselect = function() {
    this.selected = false;
  };
  this.draw = function(gD) {
    var design = gD.design.button[this.styleKey];
    if (this.selected) {
      drawCanvasRect(this.x, this.y, this.width, this.height, design.rectKey.selected, gD);
    } else {
      drawCanvasRect(this.x, this.y, this.width, this.height, design.rectKey.standard, gD);
    }
    drawCanvasText(this.x + this.width / 2, this.y + this.height / 2, this.text, design.textKey, gD);
    drawCanvasRectBorder(this.x, this.y, this.width, this.height, design.borderKey, gD);
  };
}

/**
 * A button with an image on the canvas
 * @param {number} x         x-coordinate of the top-left corner of the button on the canvas
 * @param {number} y         y-coordinate of the top-left corner of the button on the canvas
 * @param {number} width     width of the button on the canvas
 * @param {number} height    height of the button on the canvas
 * @param {string} spriteKey the sprite for the button
 * @param {string} styleKey  the design to use for the button
 */
function CanvasImageButton(x, y, width, height, spriteKey, styleKey) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.spriteKey = spriteKey;
  this.styleKey = styleKey;
  this.selected = false;
  this.select = function() {
    this.selected = true;
  };
  this.deselect = function() {
    this.selected = false;
  };
  this.draw = function(gD) {
    var design = gD.design.button[this.styleKey];
    var {spriteWidth, spriteHeight} = getSpriteData(this.spriteKey, gD);
    if (this.selected) {
      drawCanvasRect(this.x, this.y, this.width, this.height, design.rectKey.selected, gD);
    } else {
      drawCanvasRect(this.x, this.y, this.width, this.height, design.rectKey.standard, gD);
    }
    drawCanvasImage(
      this.x + Math.floor((this.width - spriteWidth) / 2),
      this.y + Math.floor((this.height - spriteHeight) / 2),
      this.spriteKey, gD
    );
    drawCanvasRectBorder(this.x, this.y, this.width, this.height, design.borderKey, gD);
  };
}

/**
 * A modal for entering a name on the canvas
 * @param {number} x        x-coordinate of the top-left corner of the modal on the canvas
 * @param {number} y        y-coordinate of the top-left corner of the modal on the canvas
 * @param {number} width    width of the modal on the canvas
 * @param {number} height   height of the modal on the canvas
 * @param {string} styleKey the design to use for the modal
 */
function CanvasEnterNameModal(x, y, width, height, styleKey) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.styleKey = styleKey;
  this.counter = 0;
  this.cursorPosition = 10;
  this.text = "";
  /**
   * moves the cursor
   * @param {number} places the amount of positions that the cursor moves
   */
  this.moveCursor = function(places) {
    this.cursorPosition += places;
    if (this.cursorPosition < 0) {
      this.cursorPosition = 0;
    } else if (this.cursorPosition > this.text.length) {
      this.cursorPosition = this.text.length;
    }
  };
  /**
   * adds character to the text
   * @param {string} character the character that is added
   */
  this.addCharacter = function(character) {
    if (this.text.length === 36) {
      return;
    }
    this.text = this.text.slice(0, this.cursorPosition) + character + this.text.slice(this.cursorPosition, this.text.length);
    this.moveCursor(1);
  };
  /**
   * deletes the character at the specified position relative to the cursor
   * @param {number} position the position of the character, 1 if right of the cursor, -1 if left of the cursor
   */
  this.deleteCharacter = function(position) {
    if (position === -1 && this.cursorPosition > 0) {
      this.text = this.text.slice(0, this.cursorPosition - 1) + this.text.slice(this.cursorPosition, this.text.length);
      this.moveCursor(-1);
    } else if (position === 1 && this.cursorPosition < this.text.length) {
      this.text = this.text.slice(0, this.cursorPosition) + this.text.slice(this.cursorPosition + 1, this.text.length);
    }
  };
  this.draw = function(gD) {
    this.counter++;
    var design = gD.design.elements[this.styleKey];

    drawCanvasRect(this.x, this.y, this.width, this.height, design.rectKey.modal, gD);
    drawCanvasRect(
      this.x + (this.width - (this.width / 3)) / 2, this.y + (this.height - (this.height / 3)) / 2, 
      this.width / 3, this.height / 3, design.rectKey.background, gD
    );
    drawCanvasText(
      this.x + this.width / 2, this.y + this.height / 2 - 20, 
      "Bitte Name eingeben:", design.textKey.label, gD
    );
    drawCanvasRect(
      this.x + (this.width - (this.width / 3)) / 2 + 5, this.y + this.height / 2 + 20,
      this.width / 3 - 10, 20, design.rectKey.textField, gD
    );
    drawCanvasText(
      this.x + (this.width - (this.width / 3)) / 2 + 8, this.y + this.height / 2 + 30, 
      this.text, design.textKey.textField, gD
    );
    drawCanvasRectBorder(
      this.x + (this.width - (this.width / 3)) / 2, this.y + (this.height - (this.height / 3)) / 2, 
      this.width / 3, this.height / 3, design.borderKey.background, gD
    );
    drawCanvasRectBorder(
      this.x + (this.width - (this.width / 3)) / 2 + 5, this.y + this.height / 2 + 20,
      this.width / 3 - 10, 20, design.borderKey.textField, gD
    );
    if (Math.floor(this.counter / 80) % 2 == 0) {
      var addCharLength = 0;
      if (this.text.length !== 0) {
        addCharLength = (gD.context.measureText(this.text).width / this.text.length) * this.cursorPosition;
      }
      drawCanvasLine(
        this.x + (this.width - (this.width / 3)) / 2 + 8 + addCharLength, this.y + this.height / 2 + 22,
        design.cursorKey, gD,
        this.x + (this.width - (this.width / 3)) / 2 + 8 + addCharLength, this.y + this.height / 2 + 38
      );
    }
  };
}

/**
 * A modal for choosing a picture for something
 * @param {number} x        x-coordinate of the top-left corner of the modal on the canvas
 * @param {number} y        y-coordinate of the top-left corner of the modal on the canvas
 * @param {number} width    width of the modal on the canvas
 * @param {number} height   height of the modal on the canvas
 * @param {string} styleKey the design to use for the modal
 */
function CanvasChoosePictureModal(x, y, width, height, styleKey) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.styleKey = styleKey;
  this.pictures = [
    "Item_Stopwatch",
    "Item_Star",
    "Item_Feather",
    "Item_Treasure",
    "Item_Magnet",
    "Item_Rocket",
    "Special_GoldenShamrock",
    "Money_1",
    "Money_10",
    "Money_100",
    "Money_1000",
    "Enemy_Fireball",
    "Enemy_Airplane_Red",
    "Enemy_Airplane_Green",
    "Enemy_Airplane_Blue",
    "Enemy_Airplane_Purple",
    "Enemy_Rocket",
    "Enemy_Fish_Green",
    "Enemy_Fish_Blue",
    "Enemy_Fish_Nemo",
    "Enemy_Fish_Red",
    "Enemy_Bird_Left",
    "Enemy_Asteroid_Lava",
    "Enemy_Asteroid_Stone",
    "Enemy_Asteroid_Ice",
    "Player_Standard",
    "Player_Longjohn",
    "Player_Speedy",
    "Player_Magician",
    "Player_Strooper",
    "Player_Disgusty",
    "Player_Afroman"
  ];
  this.pictureButtons = [];
  this.selectedRowIndex = 0;
  this.selectedColumnIndex = 0;
  this.init = function(gD) {
    var design = gD.design.elements[this.styleKey];
    this.pictures.map((picture, index) => {
      if (this.pictureButtons[Math.floor(index / 8)] === undefined) {
        this.pictureButtons[Math.floor(index / 8)] = [];
      }
      this.pictureButtons[Math.floor(index / 8)].push(new CanvasImageButton(
        this.x + 280 + (index % 8) * 55, this.y + 90 + Math.floor(index / 8) * 55,
        55, 55, this.pictures[index], design.buttonKey
      ));
    }, this);
    this.updateSelection(0, 0);
  };
  this.getSelectedButton = function() {
    return this.pictureButtons[this.selectedRowIndex][this.selectedColumnIndex];
  };
  this.updateKeyPresses = function(keyB, key) {
    var rowIndex = this.selectedRowIndex;
    var columnIndex = this.selectedColumnIndex;

    if (keyB.get("Menu_NavDown")[2].includes(key)) {
      rowIndex = (rowIndex + 1) % this.pictureButtons.length;
    } else if (keyB.get("Menu_NavUp")[2].includes(key)) {
      rowIndex--;
      if (rowIndex < 0) {
        rowIndex = this.pictureButtons.length - 1;
      }
    } else if (keyB.get("Menu_NavRight")[2].includes(key)) {
      columnIndex = (columnIndex + 1) % this.pictureButtons[rowIndex].length;
    } else if (keyB.get("Menu_NavLeft")[2].includes(key)) {
      columnIndex--;
      if (columnIndex < 0) {
        columnIndex = this.pictureButtons[rowIndex].length - 1;
      }
    }
    this.updateSelection(rowIndex, columnIndex);
  };
  this.updateMouseMoves = function(gD) {
    this.pictureButtons.map((buttonRow, rowIndex) => {
      buttonRow.map((button, columnIndex) => {
        if (gD.mousePos.x >= button.x && gD.mousePos.x <= button.x + button.width &&
            gD.mousePos.y >= button.y && gD.mousePos.y <= button.y + button.height) {
          this.updateSelection(rowIndex, columnIndex);
        }
      }, this);
    }, this);
  };
  this.updateSelection = function(rowIndex, columnIndex) {
    if (this.selectedRowIndex !== undefined && this.selectedColumnIndex !== undefined) {
      this.pictureButtons[this.selectedRowIndex][this.selectedColumnIndex].deselect();
    }
    this.pictureButtons[rowIndex][columnIndex].select();
    this.selectedRowIndex = rowIndex;
    this.selectedColumnIndex = columnIndex;
  };
  this.draw = function(gD) {
    var design = gD.design.elements[this.styleKey];

    drawCanvasRect(this.x, this.y, this.width, this.height, design.rectKey.modal, gD);
    drawCanvasRect(this.x + 275, this.y + 35, this.width - 550, this.height - 70, design.rectKey.background, gD);
    drawCanvasText(this.x + this.width / 2, this.y + 63, "Bitte Bild auswählen:", design.textKey, gD);

    this.pictureButtons.map((buttonRow, rowIndex) => {
      buttonRow.map((button, columnIndex) => {
        button.draw(gD);
      }, this);
    }, this);

    drawCanvasRectBorder(this.x + 275, this.y + 35, this.width - 550, this.height - 70, design.borderKey.background, gD);
  };
}

function CanvasCircle(centerX, centerY, radius, styleKey) {
  this.centerX = centerX;
  this.centerY = centerY;
  this.radius = radius;
  this.styleKey = styleKey;
  this.draw = function(gD) {
    drawCanvasCircle(this.centerX, this.centerY, this.radius, this.styleKey, gD);
  };
}