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