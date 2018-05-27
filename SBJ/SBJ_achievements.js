function Achievements(gD, menu) {
  this.gD = gD;
  this.menu = menu;
  this.backgroundImage = new Image();
  this.backgroundImage.src = "img/Titlescreen.png";
  this.visible = false;
  this.selected = 0;
  this.achievementDict = {
    "A1" : ["Haste mal n Hype?", "Sammle den ersten Hype", 1],
    "A2" : ["Gold!? Ich bin reich!!!", "Sammle die erste Schatztruhe", 1],
    "A3" : ["Er kann fliegen", "Entdecke den Doppelsprung", 1],
    "A4" : ["$$$$", "Sammle den ersten 1000 Hype Schein", 1],
    "A5" : ["Von allem etwas", "Benutze jedes Item einmal in einer Runde", 5],
    "A6" : ["Matrix", "Benutze 5 Stoppuhren in einer Runde", 5],
    "A7" : ["Unverwundbar", "Benutze 5 Sterne in einer Runde", 5],
    "A8" : ["Federleicht", "Benutze 5 Federn in einer Runde", 5],
    "A9" : ["Lucky No5", "Benutze 5 Schatzkisten in einer Runde", 5],
    "A10" : ["Supermagnet", "Benutze 5 Magnete in einer Runde", 5],
    "A11" : ["Infinite Power", "Benutze alle Items gleichzeitig", 5],
    "A12" : ["Verlangsamung", "Verlangsame die Zeit für insgesamt eine Stunde oder 3.600 Sekunden", 3600],
    "A13" : ["Outta Space", "Verlasse 100 Mal die Spielfläche", 100],
    "A14" : ["Tagelöhner", "Sammle 100 Hype in einer Runde", 100],
    "A15" : ["Ein neuer PC", "Sammle 2.000 Hype in einer Runde", 2000],
    "A16" : ["It's over 9000!!", "Sammle 9.001 Hype in einer Runde", 9001],
    "A17" : ["24K Magic", "Sammle 24.000 Hype in einer Runde", 24000],
    "A18" : ["1000m Sprint", "Lege eine Distanz von 1.000m in einer Runde zurück", 1000],
    "A19" : ["5Km Rennen", "Lege eine Distanz von 5.000m in einer Runde zurück", 5000],
    "A20" : ["Ausdauerprofi", "Lege eine Distanz von 10.000m in einer Runde zurück", 10000],
    "A21" : ["Geisterfahrer", "Lege insgesamt 5.000m in die falsche Richtung zurück", 5000],
    "A22" : ["Flummi", "Springe insgesamt 100.000 Mal", 100000],
    "A23" : ["In letzter Sekunde", "Setze einen Stern ein, kurz bevor du die Lava berührst", 1],
    "A24" : ["Upgrade", "Level ein Item", 1],
    "A25" : ["To the Max", "Level eine Sache auf das Maximum", 1],
    "A26" : ["Maximize", "Level alles auf das Maximum", 5],
    "A27" : ["YOU DIED", "Sterbe 1.000 Mal", 1000],
    "A28" : ["Gutverdiener", "Sammle insgesamt 1.000.000 Hype", 1000000],
    "A29" : ["Endlich reich", "Besitze 1.000.000 Hype", 1000000],
    "A30" : ["I would walk 500 Miles", "Lege eine gesamte Distanz von 804.672m zurück", 804672],
    "A31" : ["Glücksbringer", "Sammle das erste goldene Kleeblatt", 1],
    "A32" : ["Wow, so viel Glück", "Sammle 25 goldene Kleeblätter", 25],
    "A33" : ["50:50", "Sammle 50 goldene Kleeblätter", 50],
    "A34" : ["Für immer Glück", "Sammle 100 goldene Kleeblätter", 100],
    "A35" : ["Achievementhunter", "Sammle alle anderen Achievements", 34]
  };
  this.achievementValues = new Array(Object.keys(this.achievementDict).length).fill(0);
  this.init = function() {
    this.title = new Text(this.gD.canvas.width / 2, 30, "32pt", "Showcard Gothic", "rgba(200, 200, 200, 1)", "center", "middle", "Achievements", 3);

    this.achievementList = new AchievementList((this.gD.canvas.width / 2) - 300, 60, 300, 230, "rgba(200, 180, 150, 1)", 2);
    this.achievementList.init(this);

    this.description = new AchievementDescription(this.gD.canvas.width / 2, 60, 300, 230, "12pt", "Consolas", "rgba(200, 150, 150, 1)", "rgba(1,1,1,1)", 2);

    this.backToMenu = new Button((this.gD.canvas.width / 2) - 100, this.gD.canvas.height - 50, 200, 30, "15pt", "Showcard Gothic", "rgba(255, 255, 255, 1)", "Main Menu", "rgba(0, 0, 0, .6)", 2);
    this.achievementList.achievements[this.selected].select(this);
  };
  this.clear = function() {
    this.gD.context.clearRect(0, 0, this.gD.canvas.width, this.gD.canvas.height);
  };
  this.show = function() {
    if (this.selected >= 0) {
      this.achievementList.achievements[this.selected].select(this);
    }
    this.visible = true;
    drawAchievements(this);
  };
  this.stop = function() {
    this.visible = false;
  };
}

function AchievementList(x, y, width, height, color, bordersize) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.color = color;
  this.bordersize = bordersize;
  this.achievements = [];
  this.shiftFactor = 0;
  this.init = function(achievements) {
    for (var i = 0; i < Object.keys(achievements.achievementDict).length; i++) {
      this.achievements.push(new Achievement(this.x + 30 + ((i % 5) * 50), this.y + 20 + (Math.floor(i / 5) * 50), 40, 40, i + 1, 2));
    }
  };
  this.vShift = function(factor) {
    for (var i = 0; i < this.achievements.length; i++) {
      this.achievements[i].y -= factor * 50;
    }
    this.shiftFactor += factor;
  };
  this.update = function(gD) {
    gD.context.fillStyle = this.color;
    gD.context.fillRect(this.x, this.y, this.width, this.height);
    gD.strokeStyle = "rgba(0, 0, 0, 1)";
    gD.context.lineWidth = this.bordersize;
    gD.context.strokeRect(this.x, this.y, this.width, this.height);
    for (var i = (this.shiftFactor * 5); i < Math.min(20 + (this.shiftFactor * 5), this.achievements.length); i++) {
      this.achievements[i].update(gD);
    }
    gD.context.lineWidth = 4;
    gD.context.strokeStyle = "rgba(0, 0, 0, 1)";
    gD.context.beginPath();
    gD.context.moveTo(this.x + this.width - 15, this.y + 20 + (((this.shiftFactor * 5) / this.achievements.length) * 190));
    gD.context.lineTo(this.x + this.width - 15, this.y + 20 + ((Math.min(20 + (this.shiftFactor * 5), this.achievements.length) / this.achievements.length) * 190));
    gD.context.stroke();
    gD.context.lineWidth = 1;
    gD.context.beginPath();
    gD.context.moveTo(this.x + this.width - 15, this.y + 20);
    gD.context.lineTo(this.x + this.width - 15, this.y + 210);
    gD.context.stroke();
  };
}

function Achievement(x, y, width, height, achievementNr, bordersize) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.achievementNr = achievementNr;
  this.bordersize = bordersize;
  this.finished = false;
  this.selected = false;
  this.check = function(achievements) {
    if (achievements.achievementValues[this.achievementNr - 1] >= achievements.achievementDict["A" + this.achievementNr][2]) {
      this.finished = true;
      achievements.achievementValues[this.achievementNr - 1] = achievements.achievementDict["A" + this.achievementNr][2];
    }
    var temp = achievements.achievementList.achievements.reduce(function(a, b){b.finished ? a++ : a; return a;}, 0);
    if (!achievements.achievementList.achievements[34].finished && achievements.achievementValues[34] < temp) {
      achievements.achievementValues[34] = temp;
      achievements.achievementList.achievements[34].check(achievements);
      if (achievements.achievementList.achievements[34].finished) {
        achievements.gD.playerUnlocked[5] = true;
        achievements.gD.save.playerUnlocked = achievements.gD.playerUnlocked;
      }
    }
    achievements.gD.save.achievementValues = achievements.achievementValues;
  };
  this.select = function(achievements) {
    this.selected = true;
    if (achievements.achievementValues[this.achievementNr - 1] / achievements.achievementDict["A" + this.achievementNr][2] >= 0.5) {
      achievements.description.newData(achievements.achievementDict["A" + this.achievementNr][0], achievements.achievementDict["A" + this.achievementNr][1],
        achievements.achievementValues[this.achievementNr - 1], achievements.achievementDict["A" + this.achievementNr][2], "Reward" + this.achievementNr + "B", this.finished);
    } else {
      achievements.description.newData(achievements.achievementDict["A" + this.achievementNr][0], "???",
        achievements.achievementValues[this.achievementNr - 1], achievements.achievementDict["A" + this.achievementNr][2], "Reward" + this.achievementNr + "B", this.finished);
    }
  };
  this.deselect = function() {
    this.selected = false;
  };
  this.update = function(gD) {
    gD.context.fillStyle = "rgba(255, 255, 255, 1)";
    gD.context.fillRect(this.x, this.y, this.width, this.height);
    if (this.finished) {
      gD.context.drawImage(gD.spritesheet, gD.spriteDict["Reward" + this.achievementNr][0], gD.spriteDict["Reward" + this.achievementNr][1],
        gD.spriteDict["Reward" + this.achievementNr][2], gD.spriteDict["Reward" + this.achievementNr][3], this.x + Math.floor((this.width - gD.spriteDict["Reward" + this.achievementNr][2]) / 2),
        this.y + Math.floor((this.height - gD.spriteDict["Reward" + this.achievementNr][3]) / 2), gD.spriteDict["Reward" + this.achievementNr][2], gD.spriteDict["Reward" + this.achievementNr][3]);
    }
    if (this.selected) {
      gD.context.strokeStyle = "rgba(180, 50, 50, 1)";
    } else {
      gD.context.strokeStyle = "rgba(0, 0, 0, 1)";
    }
    gD.context.lineWidth = this.bordersize;
    gD.context.strokeRect(this.x, this.y, this.width, this.height);
  };
}

function AchievementDescription(x, y, width, height, size, family, color, textcolor, bordersize) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.size = size;
  this.family = family;
  this.color = color;
  this.textcolor = textcolor;
  this.bordersize = bordersize;
  this.showcase = new DescriptionShowcase(this.x, this.y, 80, 80, 2);
  this.progressBar = new DescriptionProgressBar(this.x, this.y + this.height - 20, this.width, 20, this.size, this.family, this.bordersize);
  this.newData = function(title, desc, actual, goal, name, finished) {
    this.title = title;
    this.descWords = desc.split(" ");
    this.progressBar.actual = actual;
    this.progressBar.goal = goal;
    this.showcase.name = name;
    this.showcase.finished = finished;
  };
  this.update = function(gD) {
    gD.context.fillStyle = this.color;
    gD.context.fillRect(this.x, this.y, this.width, this.height);
    gD.context.strokeStyle = "rgba(0, 0, 0, 1)";
    gD.context.lineWidth = this.bordersize;
    gD.context.strokeRect(this.x, this.y, this.width, this.height);

    this.showcase.update(gD);
    this.progressBar.update(gD);

    gD.context.textAlign = "start";
    gD.context.textBaseline = "hanging";
    gD.context.font = "bold " + this.size + " " + this.family;
    gD.context.fillStyle = "rgba(0, 0, 0, 1)";
    gD.context.fillText(this.title, this.x + 90, this.y + 20);

    gD.context.font = this.size + " " + this.family;
    var text = "";
    var line = 0;
    for(var i = 0; i < this.descWords.length; i++) {
      if (gD.context.measureText(text + this.descWords[i] + " ").width > this.width - 10 - (Math.floor(1.03 - (line * 0.02)) * 80) && line < 8) {
        gD.context.fillText(text, this.x + 10 + (Math.floor(1.03 - (line * 0.02)) * 80), this.y + 50 + (line * 20));
        line++;
        text = this.descWords[i] + " ";
      } else {
        text += this.descWords[i] + " ";
      }
    }
    if (text != "" && line < 8) {
      gD.context.fillText(text, this.x + 10 + (Math.floor(1.03 - (line * 0.02)) * 80), this.y + 50 + (line * 20));
    }
  };
}

function DescriptionShowcase(x, y, width, height, bordersize) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.name = name;
  this.bordersize = bordersize;
  this.update = function(gD) {
    gD.context.fillStyle = "rgba(255, 255, 255, 1)";
    gD.context.fillRect(this.x, this.y, this.width, this.height);
    if (this.finished) {
      gD.context.drawImage(gD.spritesheet, gD.spriteDict[this.name][0], gD.spriteDict[this.name][1], gD.spriteDict[this.name][2], gD.spriteDict[this.name][3], 
        this.x + ((this.width - gD.spriteDict[this.name][2]) / 2), this.y + ((this.height - gD.spriteDict[this.name][3]) / 2), gD.spriteDict[this.name][2], gD.spriteDict[this.name][3]);
    }
    gD.context.strokeStyle = "rgba(0, 0, 0, 1)";
    gD.context.lineWidth = this.bordersize;
    gD.context.strokeRect(this.x, this.y, this.width, this.height);
  };
}

function DescriptionProgressBar(x, y, width, height, size, family, bordersize) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.size = size;
  this.family = family;
  this.bordersize = bordersize;
  this.update = function(gD) {
    gD.context.fillStyle = "rgba(180, 180, 180, 1)";
    gD.context.fillRect(this.x, this.y, this.width, this.height);
    gD.context.fillStyle = "rgba(0, 255, 0, 1)";
    gD.context.fillRect(this.x, this.y, this.width * (this.actual / this.goal), this.height);
    gD.context.textAlign = "center";
    gD.context.textBaseline = "middle";
    gD.context.font = this.size + " " + this.family;
    gD.context.fillStyle = "rgba(0, 0, 0, 1)";

    var placeholder = "";
    for(var i = this.actual.toString().length; i < this.goal.toString().length; i++) {
      placeholder += " ";
    }
    gD.context.fillText(placeholder + this.actual.toString() + " / " + this.goal.toString(), this.x + (this.width / 2), this.y + (this.height / 2));

    gD.context.strokeStyle = "rgba(0, 0, 0, 1)";
    gD.context.lineWidth = this.bordersize;
    gD.context.strokeRect(this.x, this.y, this.width, this.height);
  };
}

function achievementsControlDown(achievements, key) {
  if (achievements.menu.controls.keyBindings["Achievements1"][2].includes(key)) {                       //navigation down
    if (achievements.selected < 0) {
      achievements.backToMenu.deselect();
      achievements.achievementList.achievements[-(achievements.selected + 1)].select(achievements);
      achievements.selected = -(achievements.selected + 1);
      achievements.achievementList.vShift(-achievements.achievementList.shiftFactor);
    } else if (achievements.selected >= achievements.achievementList.achievements.length - 5) {
      achievements.achievementList.achievements[achievements.selected].deselect();
      achievements.backToMenu.select();
      achievements.selected = -(achievements.selected % 5) - 1;
    } else {
      achievements.achievementList.achievements[achievements.selected].deselect();
      achievements.achievementList.achievements[achievements.selected + 5].select(achievements);
      achievements.selected += 5;
      if (achievements.selected >= (achievements.achievementList.shiftFactor * 5) + 15 && achievements.selected < achievements.achievementList.achievements.length - 1 - ((achievements.achievementList.achievements.length - 1) % 5)) {
        achievements.achievementList.vShift(1);
      }
    }
  } else if (achievements.menu.controls.keyBindings["Achievements2"][2].includes(key)) {                //navigation up
    if (achievements.selected < 0) {
      achievements.backToMenu.deselect();
      if (-(achievements.selected + 1) < achievements.achievementList.achievements.length % 5) {
        achievements.achievementList.achievements[achievements.achievementList.achievements.length - (achievements.achievementList.achievements.length % 5) - (achievements.selected + 1)].select(achievements);
        achievements.selected = achievements.achievementList.achievements.length - (achievements.achievementList.achievements.length % 5) - (achievements.selected + 1);
      } else {
        achievements.achievementList.achievements[achievements.achievementList.achievements.length - (achievements.achievementList.achievements.length % 5) - 5 - (achievements.selected + 1)].select(achievements);
        achievements.selected = achievements.achievementList.achievements.length - (achievements.achievementList.achievements.length % 5) - 5 - (achievements.selected + 1);
      }
      achievements.achievementList.vShift(-achievements.achievementList.shiftFactor);
      achievements.achievementList.vShift(Math.floor((achievements.achievementList.achievements.length - 16) / 5));
    } else if (achievements.selected < 5) {
      achievements.achievementList.achievements[achievements.selected].deselect();
      achievements.backToMenu.select();
      achievements.selected = -(achievements.selected + 1);
    } else {
      achievements.achievementList.achievements[achievements.selected].deselect();
      achievements.achievementList.achievements[achievements.selected - 5].select(achievements);
      achievements.selected -= 5;
      if (achievements.selected < (achievements.achievementList.shiftFactor * 5) + 5 && achievements.selected >= 5) {
        achievements.achievementList.vShift(-1);
      }
    }
  } else if (achievements.menu.controls.keyBindings["Achievements3"][2].includes(key)) {                //navigation right
    if (achievements.selected >= 0) {
      achievements.achievementList.achievements[achievements.selected].deselect();
      if (achievements.selected + 1 < achievements.achievementList.achievements.length) {
        achievements.achievementList.achievements[(Math.floor(achievements.selected / 5) * 5) + ((achievements.selected + 1) % 5)].select(achievements);
        achievements.selected = (Math.floor(achievements.selected / 5) * 5) + ((achievements.selected + 1) % 5);
      } else {
        achievements.achievementList.achievements[Math.floor(achievements.selected / 5) * 5].select(achievements);
        achievements.selected = Math.floor(achievements.selected / 5) * 5;
      }
    }
  } else if (achievements.menu.controls.keyBindings["Achievements4"][2].includes(key)) {                //navigation left
    if (achievements.selected >= 0) {
      achievements.achievementList.achievements[achievements.selected].deselect();
      if (achievements.selected != Math.floor((achievements.achievementList.achievements.length - 1) / 5) * 5) {
        achievements.achievementList.achievements[(Math.floor(achievements.selected / 5) * 5) + ((achievements.selected + 4) % 5)].select(achievements);
        achievements.selected = (Math.floor(achievements.selected / 5) * 5) + ((achievements.selected + 4) % 5);
      } else {
        achievements.achievementList.achievements[achievements.achievementList.achievements.length - 1].select(achievements);
        achievements.selected = achievements.achievementList.achievements.length - 1;
      }
    }
  }

  if (achievements.menu.controls.keyBindings["Achievements5"][2].includes(key)) {                                    //confirm
    if (achievements.selected < 0) {
      achievements.menu.show();
      achievements.stop();
    }
  } else {
    drawAchievements(achievements);
  }
}

function achievementsControlUp(achievements, key) {

}

function drawAchievements(achievements) {
  achievements.clear();

  achievements.gD.context.drawImage(achievements.backgroundImage, 0, 0);

  achievements.title.update(achievements.gD);
  achievements.achievementList.update(achievements.gD);
  achievements.description.update(achievements.gD);

  achievements.backToMenu.update(achievements.gD);
}