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
    drawCanvasImage(this.x, this.y, this.spriteKey, this.gD);
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
    drawCanvasRect(this.x, this.y, this.width, this.height, this.styleKey, this.gD);
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
    drawCanvasRectBorder(this.x, this.y, this.width, this.height, this.styleKey, this.gD);
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
    drawCanvasLine(this.x, this.y, this.x, this.y + this.height, design.lineKey, gD);
    drawCanvasLine(
      this.x, this.y + ((this.currentElementIndex / this.elementsCount) * this.height),
      this.x, this.y + (((this.height / this.elementHeight) + this.currentElementIndex) / this.elementsCount) * this.height,
      design.barKey, gD
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
    var [spriteX, spriteY, spriteWidth, spriteHeight] = gD.spriteDict[this.spriteKey];
    if (this.selected) {
      drawCanvasRect(this.x, this.y, this.width, this.height, design.rectKey.selected, gD);
    } else {
      drawCanvasRect(this.x, this.y, this.width, this.height, design.rectKey.standard, gD);
    }
    drawCanvasImage(this.x + (this.width - spriteWidth) / 2, this.y + (this.height - spriteHeight) / 2, this.spriteKey, gD);
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
  this.text = "aertger55ze baaetgbh";
  this.moveCursor = function(characters) {
    this.cursorPosition += characters;
    if (this.cursorPosition < 0) {
      this.cursorPosition = 0;
    } else if (this.cursorPosition > this.text.length) {
      this.cursorPosition = this.text.length;
    }
  };
  this.addCharacter = function(character) {
    this.text = this.text.slice(0, this.cursorPosition) + character + this.text.slice(this.cursorPosition, this.text.length);
    this.moveCursor(1);
  };
  this.deleteCharacter = function(position) {     //if position is 1 the character right of the cursor, if -1 the character left of the cursor
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
      var addCharLength = (gD.context.measureText(this.text).width / this.text.length) * this.cursorPosition;
      drawCanvasLine(
        this.x + (this.width - (this.width / 3)) / 2 + 8 + addCharLength, this.y + this.height / 2 + 22,
        this.x + (this.width - (this.width / 3)) / 2 + 8 + addCharLength, this.y + this.height / 2 + 38,
        design.cursorKey, gD
      );
    }
  };
}