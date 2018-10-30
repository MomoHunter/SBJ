function Save(gD, menu) {
  this.gD = gD;
  this.menu = menu;
  this.backgroundImage = new Image();
  this.backgroundImage.src = "img/Titlescreen.png";
  this.visible = false;
  this.init = function() {
    this.title = new Text(this.gD.canvas.width / 2, 30, "32pt", "Showcard Gothic", "rgba(200, 200, 200, 1)", "center", "middle", "Save", 3);

    this.text = new Text(this.gD.canvas.width / 2, this.gD.canvas.height / 2, "15pt", "Showcard Gothic", "rgba(200, 200, 200, 1)", "center", "middle", "", 1.5);

    this.backToMenu = new Button((this.gD.canvas.width / 2) - 100, this.gD.canvas.height - 50, 200, 30, "15pt", "Showcard Gothic", "rgba(255, 255, 255, 1)", "Main Menu", "rgba(0, 0, 0, .6)", 2);
    this.backToMenu.select();

    var save = this;

    window.addEventListener('copy', function(event) { saveSavestate(event, save); });
  };
  this.clear = function() {
    this.gD.context.clearRect(0, 0, this.gD.canvas.width, this.gD.canvas.height);
  };
  this.show = function() {
    this.visible = true;
    this.text.text = "Speichern fehlgeschlagen!";
    document.execCommand("copy");
    drawSave(this);
  };
  this.stop = function() {
    this.visible = false;
  };
}

function saveSavestate(event, save) {
  try {
    download(save.menu.version.text + new Date().toString().substr(0, 25) + ".txt", JSON.stringify(save.gD.save));
    save.text.text = "Speicherstand erfolgreich erstellt!";
    console.log("Speichern erfolgreich!");
  } catch (err) {
    console.log(err.message);
  }
  if (save.visible) {
    drawSave(save);
  }
}

function download(filename, text) {
  var element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  element.setAttribute('download', filename);

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}

function saveControlDown(save, key) {
  if (save.menu.controls.keyBindings["Save1"][2].includes(key)) {
    save.menu.show();
    save.stop();
  }
}

function saveControlUp(save, key) {

}

function saveMouseMove(save) {

}

function saveClick(save) {
  if (save.gD.mousePos.x >= save.backToMenu.x && save.gD.mousePos.x <= save.backToMenu.x + save.backToMenu.width &&
      save.gD.mousePos.y >= save.backToMenu.y && save.gD.mousePos.y <= save.backToMenu.y + save.backToMenu.height) {
    save.menu.show();
    save.stop();
  }
}

function saveWheel(save, event) {

}

function drawSave(save) {
  save.clear();

  save.gD.context.drawImage(save.backgroundImage, 0, 0);

  save.title.draw(save.gD);

  save.text.draw(save.gD);

  save.backToMenu.draw(save.gD);
}