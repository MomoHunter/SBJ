/**
 * A Text which should be drawn onto the canvas.
 * @param x {number} x-coordinate of the top-left corner of the text on the canvas
 * @param y {number} y-coordinate of the top-left corner of the text on the canvas
 * @param size {string} size of the button's text font (i.e. `15pt`)
 * @param family {string} font-family of the button's text
 * @param color {string} background-color of the button when it is not selected
 * @param textAlign {string} How to align the Text vertically. "left" || "right" || "center" || "start" || "end"
 * @param textBaseline {string} How to align the Text horizontally. "top" || "hanging" || "middle" || "alphabetic" || "ideographic" || "bottom"
 * @param text {string}
 * @param borderSize {number|undefined} If > 0, add an black border around the text with this size as its thickness.
 * @constructor
 */
function CanvasText(x, y, size, family, color, textAlign, textBaseline, text, borderSize) {
  this.x = x;
  this.y = y;
  this.size = size;
  this.family = family;
  this.color = color;
  this.textAlign = textAlign;
  this.textBaseline = textBaseline;
  this.text = text;
  this.borderSize = borderSize;
  this.draw = function(gD) {
    gD.context.textAlign = this.textAlign;
    gD.context.textBaseline = this.textBaseline;
    gD.context.font = this.size + " " + this.family;
    gD.context.fillStyle = this.color;
    gD.context.fillText(this.text, this.x, this.y);
    if (this.borderSize > 0) {
      gD.context.strokeStyle = "rgba(0, 0, 0, 1)";
      gD.context.lineWidth = this.borderSize;
      gD.context.strokeText(this.text, this.x, this.y);
    }
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
function CanvasImage(x, y, width, height, spriteKey = null) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.spriteKey = spriteKey;
  this.draw = function(gD) {
    if (this.spriteKey == null) {
      return
    }

    var [spriteX, spriteY, spriteWidth, spriteHeight] = gD.spriteDict[this.spriteKey];
    gD.context.drawImage(
      gD.spritesheet,
      spriteX, spriteY,
      spriteWidth, spriteHeight,
      this.x, this.y,
      this.width, this.height
    );
  };
}

/**
 * A filled Rectangle which should be drawn onto the canvas.
 * @param x {number} x-coordinate of the top-left corner of the image on the canvas
 * @param y {number} y-coordinate of the top-left corner of the image on the canvas
 * @param width {number} width of the image on the canvas
 * @param height {number} height of the image on the canvas
 * @param backgroundColor {string}
 * @param borderColor {string}
 * @param borderSize {number}
 * @constructor
 */
function CanvasRect(x, y, width, height, backgroundColor, borderColor = "rgba(0, 0, 0, 0)", borderSize = 0) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.backgroundColor = backgroundColor;
  this.borderColor = borderColor;
  this.bordersize = borderSize;
  this.draw = function(gD) {
    gD.context.fillStyle = this.backgroundColor;
    gD.context.fillRect(this.x, this.y, this.width, this.height);
    gD.context.strokeStyle = this.borderColor;
    gD.context.lineWidth = this.borderSize;
    gD.context.strokeRect(this.x, this.y, this.width, this.height);
  };
}

/**
 * 
 */
function ScrollBar(x, y, height, elementHeight, elements, color) {
  this.x = x;
  this.y = y;
  this.height = height;
  this.elementHeight = elementHeight;
  this.elements = elements;
  this.color = color;
  this.currentElement = 0;
  this.lineWidthBar = 4;
  this.lineWidthLine = 1;
  this.scroll = function(elements) {
    this.currentElement = elements;
  };
  this.draw = function(gD) {
    gD.context.lineWidth = this.lineWidthLine;
    gD.context.strokeStyle = this.color;
    gD.context.beginPath();
    gD.context.moveTo(this.x, this.y);
    gD.context.lineTo(this.x, this.y + this.height);
    gD.context.stroke();
    gD.context.lineWidth = this.lineWidthBar;
    gD.context.beginPath();
    gD.context.moveTo(this.x, this.y + ((this.currentElement / this.elements) * this.height));
    gD.context.lineTo(this.x, this.y + (((this.height / this.elementHeight) + this.currentElement) / this.elements) * this.height);
    gD.context.stroke();
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