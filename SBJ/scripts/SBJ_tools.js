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
  return number >= 10 ? number.toString() : "0" + number;
}

/**
 * @param  {object} object the object that should be copied
 * @return {object | undefined} a deep copy of the given object or undefined if the object is not supported
 */
function copy(object) {
  let result;

  // Handle the 3 simple types, and null or undefined
  if (null == object || "object" != typeof object) {
    return object;
  }

  // Handle Array
  if (object instanceof Array) {
    result = [];
    for (let i = 0; i < object.length; i++) {
      result[i] = copy(object[i]);
    }
    return result;
  }

  // Handle Object
  if (object instanceof Object) {
    result = {};
    for (let attr in object) {
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
  let spriteData = gD.spriteDict[spriteKey];
  if (!spriteData) {
    let fallbackSpriteKey = "Special_Placeholder";
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
  let design = gD.design.text[styleKey];
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
  let design = gD.design.border[styleKey];
  gD.context.strokeStyle = `rgba(${design.borderColor})`;
  gD.context.lineWidth = design.borderSize;
  gD.context.setLineDash(design.lineDash);
  gD.context.strokeText(text, x, y);
}

/**
 * Draw a Sprite-Image onto the used canvas.
 * Its size is determined by the defined data of the given Sprite.
 * @param {number} x x-coordinate of the top-left corner
 * @param {number} y y-coordinate of the top-left corner
 * @param {string} spriteKey defines which sprite should be drawn
 * @param {GlobalDict} gD
 */
function drawCanvasImage(x, y, spriteKey, gD) {
  if (spriteKey === null) {
    return;
  }

  let {full: spriteData} = getSpriteData(spriteKey, gD);
  let [isAnim, spriteX, spriteY, spriteWidth, spriteHeight] = spriteData;

  if (isAnim) {
    let frameNo = Math.floor(gD.frameNo / 8) % spriteY.length;
    spriteY = spriteY[frameNo];
  }

  gD.context.drawImage(
    gD.spritesheet,
    spriteX, spriteY, spriteWidth, spriteHeight,
    x, y, spriteWidth, spriteHeight
  );
}/**
 * Draw a Sprite-Image onto the used canvas.
 * Its size is determined by the defined data of the given Sprite.
 * @param {number} x          x-coordinate of the top-left corner
 * @param {number} y          y-coordinate of the top-left corner
 * @param {number} percentage percentage for the new size from the old size between 0 and 1
 * @param {string} spriteKey  defines which sprite should be drawn
 * @param {GlobalDict} gD
 */
function drawCanvasSmallImage(x, y, percentage, spriteKey, gD) {
  if (spriteKey === null) {
    return;
  }

  let {full: spriteData} = getSpriteData(spriteKey, gD);
  let [isAnim, spriteX, spriteY, spriteWidth, spriteHeight] = spriteData;

  if (isAnim) {
    let frameNo = Math.floor(gD.frameNo / 8) % spriteY.length;
    spriteY = spriteY[frameNo];
  }

  gD.context.drawImage(
    gD.spritesheet,
    spriteX, spriteY, spriteWidth, spriteHeight,
    x + (spriteWidth - (spriteWidth * percentage)) / 2, y + (spriteHeight - (spriteHeight * percentage)) / 2,
    spriteWidth * percentage, spriteHeight * percentage
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
  let design = gD.design.rect[styleKey];
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
  let design = gD.design.border[styleKey];
  gD.context.strokeStyle = `rgba(${design.borderColor})`;
  gD.context.lineWidth = design.borderSize;
  gD.context.setLineDash(design.lineDash);
  gD.context.strokeRect(x, y, width, height);
}

function drawCanvasRectRound(x, y, width, height, radius, styleKey, gD, topLeft = true, topRight = true, bottomLeft = true, bottomRight = true) {
  let design = gD.design.rect[styleKey];
  gD.context.fillStyle = `rgba(${design.backgroundColor})`;
  gD.context.beginPath();
  gD.context.moveTo(x + radius, y);
  if (topRight) {
    gD.context.lineTo(x + width - radius, y);
    gD.context.arc(x + width - radius, y + radius, radius, Math.PI * 1.5, Math.PI * 2);
  } else {
    gD.context.lineTo(x + width, y);
  }
  if (bottomRight) {
    gD.context.lineTo(x + width, y + height - radius);
    gD.context.arc(x + width - radius, y + height - radius, radius, 0, Math.PI * 0.5);
  } else {
    gD.context.lineTo(x + width, y + height);
  }
  if (bottomLeft) {
    gD.context.lineTo(x + radius, y + height);
    gD.context.arc(x + radius, y + height - radius, radius, Math.PI * 0.5, Math.PI);
  } else {
    gD.context.lineTo(x, y + height);
  }
  if (topLeft) {
    gD.context.lineTo(x, y + radius);
    gD.context.arc(x + radius, y + radius, radius, Math.PI, Math.PI * 1.5);
  } else {
    gD.context.lineTo(x, y);
    gD.context.closePath();
  }
  gD.context.fill();
}

function drawCanvasRectRoundBorder(x, y, width, height, radius, styleKey, gD, topLeft = true, topRight = true, bottomLeft = true, bottomRight = true) {
  let design = gD.design.border[styleKey];
  gD.context.strokeStyle = `rgba(${design.borderColor})`;
  gD.context.lineWidth = design.borderSize;
  gD.context.setLineDash(design.lineDash);
  gD.context.beginPath();
  gD.context.moveTo(x + radius, y);
  if (topRight) {
    gD.context.lineTo(x + width - radius, y);
    gD.context.arc(x + width - radius, y + radius, radius, Math.PI * 1.5, Math.PI * 2);
  } else {
    gD.context.lineTo(x + width, y);
  }
  if (bottomRight) {
    gD.context.lineTo(x + width, y + height - radius);
    gD.context.arc(x + width - radius, y + height - radius, radius, 0, Math.PI * 0.5);
  } else {
    gD.context.lineTo(x + width, y + height);
  }
  if (bottomLeft) {
    gD.context.lineTo(x + radius, y + height);
    gD.context.arc(x + radius, y + height - radius, radius, Math.PI * 0.5, Math.PI);
  } else {
    gD.context.lineTo(x, y + height);
  }
  if (topLeft) {
    gD.context.lineTo(x, y + radius);
    gD.context.arc(x + radius, y + radius, radius, Math.PI, Math.PI * 1.5);
  } else {
    gD.context.lineTo(x, y);
    gD.context.closePath();
  }
  gD.context.stroke();
}


function drawCanvasLine(startX, startY, styleKey, gD, ...points) {
  let design = gD.design.border[styleKey];
  gD.context.strokeStyle = `rgba(${design.borderColor})`;
  gD.context.lineWidth = design.borderSize;
  gD.context.setLineDash(design.lineDash);
  gD.context.beginPath();
  gD.context.moveTo(startX, startY);
  for (let i = 0; i < points.length / 2; i++) {
    if (points[i * 2] !== undefined && points[i * 2 + 1] !== undefined) {
      gD.context.lineTo(points[i * 2], points[i * 2 + 1]);
    } else {
      break;
    }
  }
  gD.context.stroke();
}

function drawCanvasPolygon(startX, startY, styleKey, gD, ...points) {
  let design = gD.design.rect[styleKey];
  gD.context.fillStyle = `rgba(${design.backgroundColor})`;
  gD.context.beginPath();
  gD.context.moveTo(startX, startY);
  for (let i = 0; i < points.length / 2; i++) {
    if (points[i * 2] !== undefined && points[i * 2 + 1] !== undefined) {
      gD.context.lineTo(points[i * 2], points[i * 2 + 1]);
    } else {
      break;
    }
  }
  gD.context.closePath();
  gD.context.fill();
}

function drawCanvasPolygonBorder(startX, startY, styleKey, gD, ...points) {
  let design = gD.design.border[styleKey];
  gD.context.strokeStyle = `rgba(${design.borderColor})`;
  gD.context.lineWidth = design.borderSize;
  gD.context.setLineDash(design.lineDash);
  gD.context.beginPath();
  gD.context.moveTo(startX, startY);
  for (let i = 0; i < points.length / 2; i++) {
    if (points[i * 2] !== undefined && points[i * 2 + 1] !== undefined) {
      gD.context.lineTo(points[i * 2], points[i * 2 + 1]);
    } else {
      break;
    }
  }
  gD.context.closePath();
  gD.context.stroke();
}

function drawCanvasCircle(centerX, centerY, radius, styleKey, gD) {
  let design = gD.design.circle[styleKey];
  gD.context.fillStyle = `rgba(${design.backgroundColor})`;
  gD.context.beginPath();
  gD.context.arc(centerX, centerY, radius, 0, Math.PI * 2);
  gD.context.fill();
}

function drawCanvasCircleBorder(centerX, centerY, radius, styleKey, gD) {
  let design = gD.design.border[styleKey];
  gD.context.strokeStyle = `rgba(${design.borderColor})`;
  gD.context.lineWidth = design.borderSize;
  gD.context.beginPath();
  gD.context.setLineDash(design.lineDash);
  gD.context.arc(centerX, centerY, radius, 0, Math.PI * 2);
  gD.context.stroke();
}

function drawCanvasCirclePart(centerX, centerY, radius, startAngle, endAngle, styleKey, gD) {
  let design = gD.design.circle[styleKey];
  gD.context.fillStyle = `rgba(${design.backgroundColor})`;
  gD.context.beginPath();
  gD.context.arc(centerX, centerY, radius, startAngle, endAngle);
  gD.context.lineTo(centerX, centerY);
  gD.context.closePath();
  gD.context.fill();
}

function drawCanvasCirclePartBorder(centerX, centerY, radius, startAngle, endAngle, styleKey, gD) {
  let design = gD.design.border[styleKey];
  gD.context.strokeStyle = `rgba(${design.borderColor})`;
  gD.context.lineWidth = design.borderSize;
  gD.context.setLineDash(design.lineDash);
  gD.context.beginPath();
  gD.context.arc(centerX, centerY, radius, startAngle, endAngle);
  gD.context.lineTo(centerX, centerY);
  gD.context.closePath();
  gD.context.stroke();
}

function drawCanvasStar(centerX, centerY, radius, spikeHeight, edges, styleKey, gD) {
  let design = gD.design.circle[styleKey];
  gD.context.fillStyle = `rgba(${design.backgroundColor})`;
  gD.context.translate(centerX, centerY);
  gD.context.beginPath();
  gD.context.moveTo(0, radius);
  for (let i = 1; i < edges * 2; i++) {
    let angle = i * (Math.PI / edges);
    gD.context.rotate(angle);
    if (i % 2 === 1) {
      gD.context.lineTo(0, radius * spikeHeight);
    } else {
      gD.context.lineTo(0, radius);
    }
    gD.context.rotate(-angle);
  }
  gD.context.closePath();
  gD.context.fill();
  gD.context.translate(-centerX, -centerY);
}

function drawCanvasStarBorder(centerX, centerY, radius, spikeHeight, edges, styleKey, gD) {
  let design = gD.design.border[styleKey];
  gD.context.strokeStyle = `rgba(${design.borderColor})`;
  gD.context.lineWidth = design.borderSize;
  gD.context.setLineDash(design.lineDash);
  gD.context.translate(centerX, centerY);
  gD.context.beginPath();
  gD.context.moveTo(0, radius);
  for (let i = 1; i < edges * 2; i++) {
    let angle = i * (Math.PI / edges);
    gD.context.rotate(angle);
    if (i % 2 === 1) {
      gD.context.lineTo(0, radius * spikeHeight);
    } else {
      gD.context.lineTo(0, radius);
    }
    gD.context.rotate(-angle);
  }
  gD.context.closePath();
  gD.context.stroke();
  gD.context.translate(-centerX, -centerY);
}
// endregion
