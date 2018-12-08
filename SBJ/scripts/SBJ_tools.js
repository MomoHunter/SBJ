/**
 * A Text which should be drawn onto the canvas.
 * @param x {number} x-coordinate of the top-left corner of the text on the canvas
 * @param y {number} y-coordinate of the top-left corner of the text on the canvas
 * @param text {string} string of text to write
 * @param styleKey {string} name of the style-class to use
 * @constructor
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
 * An Image which should be drawn onto the canvas. Image can be changed dynamically.
 * @param x {number} x-coordinate of the top-left corner of the image on the canvas
 * @param y {number} y-coordinate of the top-left corner of the image on the canvas
 * @param width {number} width of the image on the canvas
 * @param height {number} height of the image on the canvas
 * @param spriteKey {string|null} key to determine which data from gD.spriteDict should be used. If null, no image is drawn.
 * @constructor
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
 * A filled Rectangle which should be drawn onto the canvas.
 * @param x {number} x-coordinate of the top-left corner of the Rectangle on the canvas
 * @param y {number} y-coordinate of the top-left corner of the Rectangle on the canvas
 * @param width {number} width of the Rectangle on the canvas
 * @param height {number} height of the Rectangle on the canvas
 * @param backgroundColor {string} CSS-color-definition for the background of the Rectangle
 * @constructor
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
 * A Rectangle-Outline which should be drawn onto the canvas.
 * @param x {number} x-coordinate of the top-left corner of the Rectangle on the canvas
 * @param y {number} y-coordinate of the top-left corner of the Rectangle on the canvas
 * @param width {number} width of the Rectangle on the canvas
 * @param height {number} height of the Rectangle on the canvas
 * @param borderColor {string} CSS-color-definition for the outline
 * @param borderSize {string} width of the outline in pixel
 * @constructor
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
 *
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
 * @param  {number} n1 smaller number
 * @param  {number} n2 bigger number
 * @return {number} random number between n1 and n2
 */
function randomBetween(n1, n2) {
  return (Math.random() * (n2 - n1)) + n1;
}

/**
 * @param  {object} object the object that should be copied
 * @return {object} the copied object
 */
function copy(object) {
  var result;

  // Handle the 3 simple types, and null or undefined
  if (null == object || "object" != typeof object) {
    return object;
  }

  // Handle Array
  if (object instanceof Array) {
    result = [];
    for (var i = 0; i < object.length; i++) {
      result[i] = copy(obj[i]);
    }
    return result;
  }

  // Handle Object
  if (object instanceof Object) {
    result = {};
    for (var attr in object) {
      if (object.hasOwnProperty(attr)) {
        result[attr] = copy(object[attr]);
      }
    }
    return result;
  }
}

function drawCanvasText(x, y, text, styleKey, gD) {
  var design = gD.design.text[styleKey];
  gD.context.textAlign = design.align;
  gD.context.textBaseline = design.baseline;
  gD.context.font = design.font;
  gD.context.fillStyle = `rgba(${design.color})`;
  gD.context.fillText(text, x, y);
  if (design.borderKey !== "") {
    drawCanvasTextBorder(x, y, text, design.borderKey, gD);
  }
}

function drawCanvasTextBorder(x, y, text, styleKey, gD) {
  var design = gD.design.border[styleKey];
  gD.context.strokeStyle = `rgba(${design.borderColor})`;
  gD.context.lineWidth = design.borderSize;
  gD.context.strokeText(text, x, y);
}

function drawCanvasImage(x, y, spriteKey = null, gD) {
  if (spriteKey === null) {
    return;
  }

  var [spriteX, spriteY, spriteWidth, spriteHeight] = gD.spriteDict[spriteKey];
  gD.context.drawImage(
    gD.spritesheet, 
    spriteX, spriteY, spriteWidth, spriteHeight,
    x, y, spriteWidth, spriteHeight
  );
}

function drawCanvasRect(x, y, width, height, styleKey, gD) {
  var design = gD.design.rect[styleKey];
  gD.context.fillStyle = `rgba(${design.backgroundColor})`;
  gD.context.fillRect(x, y, width, height);
}

function drawCanvasRectBorder(x, y, width, height, styleKey, gD) {
  var design = gD.design.border[styleKey]
  gD.context.strokeStyle = `rgba(${design.borderColor})`;
  gD.context.lineWidth = design.borderSize;
  gD.context.strokeRect(x, y, width, height);
}

function drawCanvasLine(startX, startY, endX, endY, styleKey, gD) {
  var design = gD.design.border[styleKey];
  gD.context.strokeStyle = `rgba(${design.borderColor})`;
  gD.context.lineWidth = design.borderSize;
  gD.context.beginPath();
  gD.context.moveTo(startX, startY);
  gD.context.lineTo(endX, endY);
  gD.context.stroke();
}

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

function CanvasEnterNameModal(x, y, width, height, styleKey) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.styleKey = styleKey;
  this.counter = 0;
  this.cursorPosition = 0;
  this.text = "";
  this.moveCursor = function(characters) {
    this.cursorPosition += characters;
    if (this.cursorPosition < 0) {
      this.cursorPosition = 0;
    } else if (this.cursorPosition > this.text.length) {
      this.cursorPosition = this.text.length;
    }
  };
  this.addCharacter(character) {
    this.text = this.text.slice(0, this.cursorPosition) + character + this.text.slice(this.cursorPosition, this.text.length);
    this.moveCursor(1);
  };
  this.draw = function(gD) {
    var design = gD.design.elements[this.styleKey];

    drawCanvasRect(this.x, this.y, this.width, this.height, design.rectKey.modal, gD);
    drawCanvasRect(
      this.x + (this.width - (this.width / 3)) / 2, this.y + (this.height - (this.height / 3)) / 2, 
      this.width / 3, this.height / 3, design.rectKey.background, gD
    );
    drawCanvasText(this.x + this.width / 2, this.y + this.height / 2 - 20, "Bitte Name eingeben:", design.textKey, gD);
    drawCanvasRect(
      this.x + (this.width - (this.width / 3)) / 2 + 5, this.y + this.height / 2 + 20,
      this.width / 3 - 10, 20, design.rectKey.textField, gD
    );
    drawCanvasRectBorder(
      this.x + (this.width - (this.width / 3)) / 2, this.y + (this.height - (this.height / 3)) / 2, 
      this.width / 3, this.height / 3, design.borderKey.background, gD
    );
    drawCanvasRectBorder(
      this.x + (this.width - (this.width / 3)) / 2 + 5, this.y + this.height / 2 + 20,
      this.width / 3 - 10, 20, design.borderKey.textField, gD
    );
    
  };
}