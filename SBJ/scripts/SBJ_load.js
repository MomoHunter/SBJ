function Load(gD, menu) {
  this.gD = gD;
  this.menu = menu;
  this.backgroundImage = new Image();
  this.backgroundImage.src = "img/Titlescreen.png";
  this.visible = false;
  this.init = function() {
    this.title = new Text(this.gD.canvas.width / 2, 30, "32pt", "Showcard Gothic", "rgba(200, 200, 200, 1)", "center", "middle", "Load", 3);

    this.text = new Text(this.gD.canvas.width / 2, this.gD.canvas.height / 2, "15pt", "Showcard Gothic", "rgba(200, 200, 200, 1)", "center", "middle", "", 1.5);

    this.backToMenu = new Button((this.gD.canvas.width / 2) - 100, this.gD.canvas.height - 50, 200, 30, "15pt", "Showcard Gothic", "rgba(255, 255, 255, 1)", "Main Menu", "rgba(0, 0, 0, .6)", 2);
    this.backToMenu.select();

    var load = this;

    window.addEventListener('paste', function(event) { pasteFromClipboard(event, load); });
  };
  this.clear = function() {
    this.gD.context.clearRect(0, 0, this.gD.canvas.width, this.gD.canvas.height);
  };
  this.show = function() {
    this.visible = true;
    this.text.text = "Kopiere den Inhalt des Speicherstandes und dr" + String.fromCharCode(220) + "cke hier Strg + V!";
    drawLoad(this);
  };
  this.stop = function() {
    this.visible = false;
  };
}

function pasteFromClipboard(event, load) {
  try {
    load.gD.save = JSON.parse(event.clipboardData.getData("Text"));
    event.preventDefault();
    if (load.gD.save.highscores) {
      load.menu.highscores.highscores = load.gD.save.highscores;
      load.menu.highscores.highscoreList.highscores = [];
      load.menu.highscores.selected = -1;
      load.menu.highscores.backToMenu.select();
    }
    if (load.gD.save.keyBindings) {
      load.menu.controls.keyBindings = load.gD.save.keyBindings;
    }
    if (load.gD.save.achievementValues) {
      load.menu.achievements.achievementValues = load.gD.save.achievementValues;
      for (var i = 0; i < load.menu.achievements.achievementList.achievements.length; i++) {
        load.menu.achievements.achievementList.achievements[i].check(load.menu.achievements);
      }
    }
    if (load.gD.save.level) {
      load.menu.shop.level = load.gD.save.level;
    }
    if (load.gD.save.cash) {
      load.menu.shop.cash = load.gD.save.cash;
    }
    if (load.gD.save.playerUnlocked) {
      load.gD.playerUnlocked = load.gD.save.playerUnlocked;
    }
    if (load.gD.save.stagesUnlocked) {
      load.gD.stagesUnlocked = load.gD.save.stagesUnlocked;
    }
    load.text.text = "Laden erfolgreich!";
    console.log("Laden erfolgreich!");
  } catch (err) {
    console.log(err.message);
    load.text.text = "Laden fehlgeschlagen!";
  }
  if (load.visible) {
    drawLoad(load);
  }
}

function loadControlDown(load, key) {
  if (load.menu.controls.keyBindings["Load1"][2].includes(key)) {
    load.menu.show();
    load.stop();
  }
}

function loadControlUp(load, key) {

}

function loadMouseMove(load) {

}

function loadClick(load) {
  if (load.gD.mousePos.x >= load.backToMenu.x && load.gD.mousePos.x <= load.backToMenu.x + load.backToMenu.width &&
      load.gD.mousePos.y >= load.backToMenu.y && load.gD.mousePos.y <= load.backToMenu.y + load.backToMenu.height) {
    load.menu.show();
    load.stop();
  }
}

function loadWheel(load, event) {

}

function drawLoad(load) {
  load.clear();

  load.gD.context.drawImage(load.backgroundImage, 0, 0);

  load.title.draw(load.gD);

  load.text.draw(load.gD);

  load.backToMenu.draw(load.gD);
}

/*var count = 1;
function LoadNext()
{
var newScript = document.createElement("script");
newScript.setAttribute("type", "text/javascript");
newScript.setAttribute("src", "basename-" + count++ + ".js");  //Increment the counter so we get the next page each time
newScript.onload = LoadNext;  //When the script loads call this function again
document.getElementsByTagName("head")[0].appendChild(newScript)
}
LoadNext(); //Load basename-1.js*/