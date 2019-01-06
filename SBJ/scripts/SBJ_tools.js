// region general Helper
/**
 * @param  {number} n1 smaller number
 * @param  {number} n2 bigger number
 * @return {number} random number between n1 and n2
 */
function randomBetween(n1, n2) {
  return (Math.random() * (n2 - n1)) + n1;
}

/**
 * adds a zero in front of a number that is less than 10 for better visual appearance
 * @param   {number} number the number that should get a 0
 * @returns {string} the converted number as a string
 */
function addLeadingZero(number) {
  return number > 10 ? number.toString() : "0" + number;
}

/**
 * @param  {object} object the object that should be copied
 * @return {object | undefined} a deep copy of the given object or undefined if the object is not supported
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

/**
 * Retrieves sprite information, falling back to the placeholder image if needed.
 * @param {string} spriteKey
 * @param {GlobalDict} gD
 * @return {{spriteWidth: number, spriteHeight: number, full: Array}}
 */
function getSpriteData(spriteKey, gD) {
  var spriteData = gD.spriteDict[spriteKey];
  if (!spriteData) {
    var fallbackSpriteKey = "Special_Placeholder";
    if (spriteKey.includes("_B_") || spriteKey.endsWith("_B")) {
      fallbackSpriteKey += "_B";
    }
    return getSpriteData(fallbackSpriteKey, gD);
  } else {
    return {spriteWidth: spriteData[3], spriteHeight: spriteData[4], full: spriteData}
  }
}
// endregion


// region Canvas-Helper
/**
 * Draw text onto the used canvas.
 * Its positioning is affected by the attributes saved inside the used Style-Key.
 * @param {number} x x-coordinate for the positioning point
 * @param {number} y y-coordinate for the positioning point
 * @param {string} text text to be written
 * @param {string} styleKey defines the appearance of the text
 * @param {GlobalDict} gD
 */
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

/**
 * Draw a border for text onto the used canvas.
 * Its positioning is affected by the attributes saved inside the used Style-Key.
 * @param {number} x x-coordinate for the positioning point
 * @param {number} y y-coordinate for the positioning point
 * @param {string} text text for witch the outline should be drawn
 * @param {string} styleKey defines the appearance of the text
 * @param {GlobalDict} gD
 */
function drawCanvasTextBorder(x, y, text, styleKey, gD) {
  var design = gD.design.border[styleKey];
  gD.context.strokeStyle = `rgba(${design.borderColor})`;
  gD.context.lineWidth = design.borderSize;
  gD.context.setLineDash(design.lineDash);
  gD.context.strokeText(text, x, y);
}

/**
 * Draw a Sprite-Image onto the used canvas.
 * Its size is determined by the defined data of the given Sprite.
 * @param {width} x x-coordinate of the top-left corner
 * @param {width} y y-coordinate of the top-left corner
 * @param {string} spriteKey defines which sprite should be drawn
 * @param {GlobalDict} gD
 */
function drawCanvasImage(x, y, spriteKey, gD) {
  if (spriteKey === null) {
    return;
  }

  var {full: spriteData} = getSpriteData(spriteKey, gD);
  var [isAnim, spriteX, spriteY, spriteWidth, spriteHeight] = spriteData;

  if (isAnim) {
    var frameNo = Math.floor(gD.frameNo / 8) % spriteY.length;
    spriteY = spriteY[frameNo];
  }

  gD.context.drawImage(
    gD.spritesheet,
    spriteX, spriteY, spriteWidth, spriteHeight,
    x, y, spriteWidth, spriteHeight
  );
}

/**
 * Draws a filled rectangle onto the used canvas.
 * @param {number} x x-coordinate of the rectangle's top-left corner
 * @param {number} y y-coordinate of the rectangle's top-left corner
 * @param {number} width
 * @param {number} height
 * @param {string} styleKey defines the appearance of the rectangle
 * @param {GlobalDict} gD
 */
function drawCanvasRect(x, y, width, height, styleKey, gD) {
  var design = gD.design.rect[styleKey];
  gD.context.fillStyle = `rgba(${design.backgroundColor})`;
  gD.context.fillRect(x, y, width, height);
}

/**
 * Draws a border for a rectangle onto the used canvas.
 * @param {number} x x-coordinate of the rectangle's top-left corner
 * @param {number} y y-coordinate of the rectangle's top-left corner
 * @param {number} width
 * @param {number} height
 * @param {string} styleKey defines the appearance of the rectangle
 * @param {GlobalDict} gD
 */
function drawCanvasRectBorder(x, y, width, height, styleKey, gD) {
  var design = gD.design.border[styleKey];
  gD.context.strokeStyle = `rgba(${design.borderColor})`;
  gD.context.lineWidth = design.borderSize;
  gD.context.setLineDash(design.lineDash);
  gD.context.strokeRect(x, y, width, height);
}


function drawCanvasLine(startX, startY, styleKey, gD, ...points) {
  var design = gD.design.border[styleKey];
  gD.context.strokeStyle = `rgba(${design.borderColor})`;
  gD.context.lineWidth = design.borderSize;
  gD.context.setLineDash(design.lineDash);
  gD.context.beginPath();
  gD.context.moveTo(startX, startY);
  for (var i = 0; i < points.length / 2; i++) {
    if (points[i * 2] !== undefined && points[i * 2 + 1] !== undefined) {
      gD.context.lineTo(points[i * 2], points[i * 2 + 1]);
    } else {
      break;
    }
  }
  gD.context.stroke();
}

function drawCanvasCircle(centerX, centerY, radius, styleKey, gD) {
  var design = gD.design.circle[styleKey];
  gD.context.fillStyle = `rgba(${design.backgroundColor})`;
  gD.context.beginPath();
  gD.context.arc(centerX, centerY, radius, 0, Math.PI * 2);
  gD.context.fill();
}

function drawCanvasCircleBorder(centerX, centerY, radius, styleKey, gD) {
  var design = gD.design.border[styleKey];
  gD.context.strokeStyle = `rgba(${design.borderColor})`;
  gD.context.lineWidth = design.borderSize;
  gD.context.beginPath();
  gD.context.setLineDash(design.lineDash);
  gD.context.arc(centerX, centerY, radius, 0, Math.PI * 2);
  gD.context.stroke();
}

function drawCanvasCirclePart(centerX, centerY, radius, startAngle, endAngle, styleKey, gD) {
  var design = gD.design.circle[styleKey];
  gD.context.fillStyle = `rgba(${design.backgroundColor})`;
  gD.context.beginPath();
  gD.context.arc(centerX, centerY, radius, startAngle, endAngle);
  gD.context.lineTo(centerX, centerY);
  gD.context.closePath();
  gD.context.fill();
}

function drawCanvasCirclePartBorder(centerX, centerY, radius, startAngle, endAngle, styleKey, gD) {
  var design = gD.design.border[styleKey];
  gD.context.strokeStyle = `rgba(${design.borderColor})`;
  gD.context.lineWidth = design.borderSize;
  gD.context.setLineDash(design.lineDash);
  gD.context.beginPath();
  gD.context.arc(centerX, centerY, radius, startAngle, endAngle);
  gD.context.lineTo(centerX, centerY);
  gD.context.closePath();
  gD.context.stroke();
}
// endregion
