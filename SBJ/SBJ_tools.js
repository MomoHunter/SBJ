function Text(x, y, size, family, color, textAlign, textBaseline, text, bordersize) {
  this.x = x;
  this.y = y;
  this.size = size;
  this.family = family;
  this.color = color;
  this.textAlign = textAlign;
  this.textBaseline = textBaseline;
  this.text = text;
  this.bordersize = bordersize;
  this.draw = function(gD) {
    gD.context.textAlign = this.textAlign;
    gD.context.textBaseline = this.textBaseline;
    gD.context.font = this.size + " " + this.family;
    gD.context.fillStyle = this.color;
    gD.context.fillText(this.text, this.x, this.y);
    if (this.bordersize > 0) {
      gD.context.strokeStyle = "rgba(0, 0, 0, 1)";
      gD.context.lineWidth = this.bordersize;
      gD.context.strokeText(this.text, this.x, this.y);
    }
  };
}

function Button(x, y, width, height, size, family, color, text, textcolor, bordersize) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.size = size;
  this.family = family;
  this.color = color;
  this.text = text;
  this.textcolor = textcolor;
  this.bordersize = bordersize;
  this.selected = false;
  this.select = function() {
    this.selected = true;
  };
  this.deselect = function() {
    this.selected = false;
  };
  this.draw = function(gD) {
    if (this.selected) {
      gD.context.fillStyle = "rgba(180, 50, 50, 1)";
    } else {
      gD.context.fillStyle = this.color;
    }
    gD.context.fillRect(this.x, this.y, this.width, this.height);
    gD.context.textAlign = "center";
    gD.context.textBaseline = "middle";
    gD.context.font = this.size + " " + this.family;
    gD.context.fillStyle = this.textcolor;
    gD.context.fillText(this.text, this.x + (this.width / 2), this.y + (this.height / 2));
    gD.context.strokeStyle = "rgba(0, 0, 0, 1)";
    gD.context.lineWidth = this.bordersize;
    gD.context.strokeRect(this.x, this.y, this.width, this.height);
  };
}