function Shop(gD, menu) {
  this.gD = gD;
  this.menu = menu;
  this.backgroundImage = new Image();
  this.backgroundImage.src = "img/Titlescreen.png";
  this.backgroundMusic = new Audio();
  this.backgroundMusic.src = "music/shop.mp3";
  this.backgroundMusic.loop = true;
  this.backgroundMusic.volume = 0.2;
  this.visible = false;
  this.tabs = [];
  this.buttons = [];
  this.shopEntries = [];
  this.level = new Array(this.gD.itemProb.length).fill(0);   //levels of the items
  this.selected = 0;
  this.active = 0;
  this.cash = 0;
  this.costFactors = [1.15, 1.55];                           //defines the multiplicators for the down- and upgrades of the items
  this.shiftFactor = 0;
  this.init = function() {
    this.title = new CanvasText(this.gD.canvas.width / 2, 30, "32pt", "Showcard Gothic", "rgba(200, 200, 200, 1)", "center", "middle", "Shop", 3);

    this.money = new ShopMoney(this.gD.canvas.width - 215, 0, 200, 30, "20pt", "Consolas", "rgba(220, 255, 220, 1)", "rgba(0, 0, 0, 1)", 2);

    this.tabs.push(new ShopTab((this.gD.canvas.width / 2) - 300, 60, 300, 30, "15pt", "Showcard Gothic", "rgba(150, 180, 150, 1)", "Player", "rgba(0, 0, 0, .6)", 2));
    this.tabs.push(new ShopTab(this.gD.canvas.width / 2, 60, 300, 30, "15pt", "Showcard Gothic", "rgba(200, 200, 0, 1)", "Items", "rgba(0, 0, 0, .6)", 2));
    this.tabs[this.active].activate();

    for (var i = 0; i < 3; i++) {
      this.buttons.push(new MenuTextButton((this.gD.canvas.width / 2) - 290 + (i * 200), 245, 180, 20, "Kaufen"));
    }
    this.shopEntries.push(new ShopEntryPlayer((this.gD.canvas.width / 2) - 300, 90, 200, 200, "12pt", "Consolas", "rgba(150, 180, 150, 1)", 2, "Höhere Sprungkraft", 19999, 2));
    this.shopEntries.push(new ShopEntryPlayer((this.gD.canvas.width / 2) - 100, 90, 200, 200, "12pt", "Consolas", "rgba(150, 180, 150, 1)", 3, "Schnellere Bewegung", 12999, 2));
    this.shopEntries.push(new ShopEntryPlayer((this.gD.canvas.width / 2) + 100, 90, 200, 200, "12pt", "Consolas", "rgba(150, 180, 150, 1)", 4, "Dreifach Sprung", 59999, 2));

    for (var i = 0; i < this.gD.itemProb.length; i++) {
      this.buttons.push(new MenuTextButton((this.gD.canvas.width / 2) - 290 + (i * 120), 200, 100, 20, "Upgrade"));
      this.buttons.push(new MenuTextButton((this.gD.canvas.width / 2) - 290 + (i * 120), 245, 100, 20, "Downgrade"));
    }
    for (var i = 0; i < this.gD.itemProb.length; i++) {
      this.shopEntries.push(new ShopEntryItem((this.gD.canvas.width / 2) - 300 + (i * 120), 90, 120, 200, "12pt", "Consolas", "rgba(200, 200, 0, 1)", i + 1, "+" + (this.gD.itemPerLvlDur[i] / 60).toFixed(2) + "s", 2));
    }

    this.backToMenu = new MenuTextButton((this.gD.canvas.width / 2) - 100, this.gD.canvas.height - 50, 200, 30, "Main Menu");
    this.buttons[this.selected].select();
  };
  this.hShift = function(shiftFactor) {
    for (var i = 3; i < this.shopEntries.length; i++) {
      this.shopEntries[i].x -= shiftFactor * 120;
      this.shopEntries[i].hShift(shiftFactor);
    }
    for (var i = 3; i < this.buttons.length; i++) {
      this.buttons[i].x -= shiftFactor * 120;
    }
    this.shiftFactor += shiftFactor;
  };
  this.clear = function() {
    this.gD.context.clearRect(0, 0, this.gD.canvas.width, this.gD.canvas.height);
  };
  this.show = function() {
    this.visible = true;
    drawShop(this);
    this.backgroundMusic.load();
    this.backgroundMusic.play();
    this.backgroundMusic.muted = this.gD.muted;
  };
  this.stop = function() {
    this.visible = false;
    this.backgroundMusic.pause();
  };
}

function ShopMoney(x, y, width, height, size, family, color, textcolor, bordersize) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.size = size;
  this.family = family;
  this.color = color;
  this.text = "";
  this.textcolor = textcolor;
  this.bordersize = bordersize;
  this.draw = function(shop, gD) {
    this.text = shop.cash.toString();

    gD.context.fillStyle = this.color;
    gD.context.fillRect(this.x, this.y, this.width, this.height);

    gD.context.drawImage(gD.spritesheet, gD.spriteDict["Currency2"][0], gD.spriteDict["Currency2"][1], gD.spriteDict["Currency2"][2], gD.spriteDict["Currency2"][3],
      this.x + this.width - gD.spriteDict["Currency2"][2] - 2, this.y + ((this.height - gD.spriteDict["Currency2"][3]) / 2), gD.spriteDict["Currency2"][2], gD.spriteDict["Currency2"][3]);

    gD.context.textAlign = "end";
    gD.context.textBaseline = "alphabetic";
    gD.context.font = this.size + " " + this.family;
    gD.context.fillStyle = this.textcolor;
    gD.context.fillText(this.text, this.x + this.width - gD.spriteDict["Currency2"][2] - 4, this.y + ((this.height - gD.spriteDict["Currency2"][3]) / 2) + gD.spriteDict["Currency2"][3]);

    gD.context.strokeStyle = "rgba(0, 0, 0, 1)";
    gD.context.lineWidth = this.bordersize;
    gD.context.strokeRect(this.x, this.y, this.width, this.height);
  };
}

function ShopTab(x, y, width, height, size, family, color, text, textcolor, bordersize) {
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
  this.active = false;
  this.selected = false;
  this.activate = function() {
    this.active = true;
  };
  this.deactivate = function() {
    this.active = false;
  };
  this.select = function() {
    this.selected = true;
  };
  this.deselect = function() {
    this.selected = false;
  };
  this.draw = function(gD) {
    if (this.selected) {
      gD.context.fillStyle = "rgba(180, 50, 50, 1)";
    } else if (this.active) {
      gD.context.fillStyle = this.color;
    } else {
      gD.context.fillStyle = "rgba(98, 98, 98, 1)";
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

function ShopEntryPlayer(x, y, width, height, size, family, color, playerNr, desc, price, bordersize) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.size = size;
  this.family = family;
  this.color = color;
  this.playerNr = playerNr;
  this.desc = desc;
  this.price = price;
  this.bordersize = bordersize;
  this.showcase = new EntryShowcase(this.x + (this.width / 2) - 30, this.y + 20, 60, 60, "Player" + this.playerNr + "B", this.bordersize);
  this.cost = new EntryCost(this.x + 10, this.y + 175, 180, 15, "10pt", "Consolas", this.price, this.bordersize);
  this.buy = function(shop) {
    if (shop.cash > this.price && !shop.gD.playerUnlocked[this.playerNr - 2]) {
      shop.cash -= this.price;
      shop.gD.playerUnlocked[this.playerNr - 2] = true;
    }
    shop.gD.save.playerUnlocked = shop.gD.playerUnlocked;
    shop.gD.save.cash = shop.cash;
  };
  this.draw = function(shop, gD) {
    gD.context.fillStyle = this.color;
    gD.context.fillRect(this.x, this.y, this.width, this.height);
    gD.context.textAlign = "center";
    gD.context.textBaseline = "middle";
    gD.context.font = this.size + " " + this.family;
    gD.context.fillStyle = "rgba(0, 0, 0, 1)";
    gD.context.fillText(this.desc, this.x + (this.width / 2), this.y + 100);
    gD.context.strokeStyle = "rgba(0, 0, 0, 1)";
    gD.context.lineWidth = this.bordersize;
    gD.context.strokeRect(this.x, this.y, this.width, this.height);

    this.showcase.draw(gD);
    this.cost.draw(gD);

    if (shop.gD.playerUnlocked[this.playerNr - 2]) {
      gD.context.translate(this.x + (this.width / 2), this.y + 50);
      gD.context.rotate(-20 * Math.PI / 180);
      gD.context.textAlign = "center";
      gD.context.textBaseline = "middle";
      gD.context.font = "20pt Stencil";
      gD.context.fillStyle = "rgba(255, 0, 0, 1)";
      gD.context.fillText("Gekauft!", 0, 0);
      gD.context.strokeStyle = "rgba(0, 0, 0, 1)";
      gD.context.lineWidth = 1;
      gD.context.strokeText("Gekauft!", 0, 0);
      gD.context.rotate(20 * Math.PI / 180);
      gD.context.translate(-(this.x + (this.width / 2)), -(this.y + 50));
    }
  };
}

function ShopEntryItem(x, y, width, height, size, family, color, itemNr, desc, bordersize) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.size = size;
  this.family = family;
  this.color = color;
  this.itemNr = itemNr;
  this.desc = desc;
  this.bordersize = bordersize;
  this.showcase = new EntryShowcase(this.x + (this.width / 2) - 30, this.y + 20, 60, 60, "Item" + this.itemNr + "B", this.bordersize);
  this.costUpgrade = new EntryCost(this.x + 10, this.y + 130, 100, 15, "10pt", "Consolas", 0, this.bordersize);
  this.costDowngrade = new EntryCost(this.x + 10, this.y + 175, 100, 15, "10pt", "Consolas", 0, this.bordersize);
  this.hShift = function(shiftFactor) {
    this.showcase.x -= shiftFactor * 120;
    this.costUpgrade.x -= shiftFactor * 120;
    this.costDowngrade.x -= shiftFactor * 120;
  };
  this.upgrade = function(shop) {
    if (shop.cash > Math.floor(shop.gD.itemStartValue[this.itemNr - 1] * Math.pow(shop.costFactors[1], shop.level[this.itemNr - 1])) && shop.level[this.itemNr - 1] < 10) {
      shop.cash -= Math.floor(shop.gD.itemStartValue[this.itemNr - 1] * Math.pow(shop.costFactors[1], shop.level[this.itemNr - 1]));
      shop.level[this.itemNr - 1]++;
      if (!shop.menu.achievements.achievementList.achievements[24].finished) {
        shop.menu.achievements.achievementValues[24]++;
        shop.menu.achievements.achievementList.achievements[24].check(shop.menu.achievements);
      }
    }
    var maxed = shop.level.reduce(function(a, b){b == 10 ? a++ : a; return a;}, 0);
    if (!shop.menu.achievements.achievementList.achievements[25].finished && shop.menu.achievements.achievementValues[25] < maxed) {
      shop.menu.achievements.achievementValues[25] = maxed;
      shop.menu.achievements.achievementList.achievements[25].check(shop.menu.achievements);
    }
    if (!shop.menu.achievements.achievementList.achievements[26].finished && shop.menu.achievements.achievementValues[26] < maxed) {
      shop.menu.achievements.achievementValues[26] = maxed;
      shop.menu.achievements.achievementList.achievements[26].check(shop.menu.achievements);
    }
    shop.gD.save.level = shop.level;
    shop.gD.save.cash = shop.cash;
  };
  this.downgrade = function(shop) {
    if (shop.cash > Math.floor(shop.gD.itemStartValue[this.itemNr - 1] * Math.pow(shop.costFactors[0], shop.level[this.itemNr - 1])) && shop.level[this.itemNr - 1] > 0) {
      shop.cash -= Math.floor(shop.gD.itemStartValue[this.itemNr - 1] * Math.pow(shop.costFactors[0], shop.level[this.itemNr - 1]));
      shop.level[this.itemNr - 1]--;
    }
    shop.gD.save.level = shop.level;
    shop.gD.save.cash = shop.cash;
  };
  this.draw = function(shop, gD) {
    gD.context.fillStyle = this.color;
    gD.context.fillRect(this.x, this.y, this.width, this.height);
    gD.context.textAlign = "center";
    gD.context.textBaseline = "middle";
    gD.context.font = this.size + " " + this.family;
    gD.context.fillStyle = "rgba(0, 0, 0, 1)";
    gD.context.fillText(this.desc, this.x + (this.width / 2), this.y + 90);
    switch (shop.level[this.itemNr - 1]) {
      case 0:
        this.costUpgrade.value = Math.floor(gD.itemStartValue[this.itemNr - 1] * Math.pow(shop.costFactors[1], shop.level[this.itemNr - 1]));
        this.costDowngrade.value = "---";
        this.showcase.info = shop.level[this.itemNr - 1];
        break;
      case 10:
        this.costUpgrade.value = "---";
        this.costDowngrade.value = Math.floor(gD.itemStartValue[this.itemNr - 1] * Math.pow(shop.costFactors[0], shop.level[this.itemNr - 1]));
        this.showcase.info = shop.level[this.itemNr - 1];
        break;
      default:
        this.costUpgrade.value = Math.floor(gD.itemStartValue[this.itemNr - 1] * Math.pow(shop.costFactors[1], shop.level[this.itemNr - 1]));
        this.costDowngrade.value = Math.floor(gD.itemStartValue[this.itemNr - 1] * Math.pow(shop.costFactors[0], shop.level[this.itemNr - 1]));
        this.showcase.info = shop.level[this.itemNr - 1];
    }

    this.costUpgrade.draw(gD);
    this.costDowngrade.draw(gD);
    this.showcase.draw(gD);

    gD.context.strokeStyle = "rgba(0, 0, 0, 1)";
    gD.context.lineWidth = this.bordersize;
    gD.context.strokeRect(this.x, this.y, this.width, this.height);
  };
}

function EntryShowcase(x, y, width, height, name, bordersize) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.name = name;
  this.bordersize = bordersize;
  this.info = "";
  this.draw = function(gD) {
    gD.context.fillStyle = "rgba(255, 255, 255, 1)";
    gD.context.fillRect(this.x, this.y, this.width, this.height);
    gD.context.drawImage(gD.spritesheet, gD.spriteDict[this.name][0], gD.spriteDict[this.name][1], gD.spriteDict[this.name][2], gD.spriteDict[this.name][3], 
      this.x + ((this.width - gD.spriteDict[this.name][2]) / 2), this.y + ((this.height - gD.spriteDict[this.name][3]) / 2), gD.spriteDict[this.name][2], gD.spriteDict[this.name][3]);
    gD.context.strokeStyle = "rgba(0, 0, 0, 1)";
    gD.context.lineWidth = this.bordersize;
    gD.context.strokeRect(this.x, this.y, this.width, this.height);

    gD.context.textAlign = "end";
    gD.context.textBaseline = "alphabetic";
    gD.context.font = "10pt Consolas";
    gD.context.fillStyle = "rgba(0, 0, 0, 1)";
    gD.context.fillText(this.info, this.x + this.width - 2, this.y + this.height - 2);
  };
}

function EntryCost(x, y, width, height, size, family, value, bordersize) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.size = size;
  this.family = family;
  this.bordersize = bordersize;
  this.value = value;
  this.draw = function(gD) {
    gD.context.textAlign = "end";
    gD.context.textBaseline = "alphabetic";
    gD.context.font = this.size + " " + this.family;
    gD.context.lineWidth = this.bordersize;
    gD.context.strokeStyle = "rgba(0, 0, 0, 1)";
    gD.context.fillStyle = "rgba(220, 255, 220, 1)";
    gD.context.fillRect(this.x, this.y, this.width, this.height);
    gD.context.strokeRect(this.x, this.y, this.width, this.height);
    gD.context.drawImage(gD.spritesheet, gD.spriteDict["Currency1"][0], gD.spriteDict["Currency1"][1], gD.spriteDict["Currency1"][2], gD.spriteDict["Currency1"][3], 
      this.x + this.width - gD.spriteDict["Currency1"][2] - 2, this.y + ((this.height - gD.spriteDict["Currency1"][3]) / 2), gD.spriteDict["Currency1"][2], gD.spriteDict["Currency1"][3]);
    gD.context.fillStyle = "rgba(0, 0, 0, 1)";
    gD.context.fillText(this.value, this.x + this.width - gD.spriteDict["Currency1"][2] - 4, this.y + ((this.height - gD.spriteDict["Currency1"][3]) / 2) + gD.spriteDict["Currency1"][3]);
  };
}

function shopControlDown(shop, key) {
  if (shop.menu.controls.keyBindings["Shop1"][2].includes(key)) {                       //navigation down
    if (shop.active == 0) {
      if (shop.selected == -1) {
        shop.tabs[0].deselect();
        shop.buttons[0].select();
        shop.selected = 0;
      } else if (shop.selected == shop.buttons.length) {
        shop.backToMenu.deselect();
        shop.tabs[0].select();
        shop.selected = -1;
      } else {
        shop.buttons[shop.selected].deselect();
        shop.backToMenu.select();
        shop.selected = shop.buttons.length;
      }
    } else {
      if (shop.selected == -2) {
        shop.tabs[1].deselect();
        shop.buttons[3].select();
        shop.selected = 3;
        shop.hShift(-shop.shiftFactor);
      } else if (shop.selected == shop.buttons.length) {
        shop.backToMenu.deselect();
        shop.tabs[1].select();
        shop.selected = -2;
      } else if ((shop.selected - 3) % 2 == 0) {
        shop.buttons[shop.selected].deselect();
        shop.buttons[shop.selected + 1].select();
        shop.selected += 1;
      } else {
        shop.buttons[shop.selected].deselect();
        shop.backToMenu.select();
        shop.selected = shop.buttons.length;
      }
    }
  } else if (shop.menu.controls.keyBindings["Shop2"][2].includes(key)) {                //navigation up
    if (shop.active == 0) {
      if (shop.selected == -1) {
        shop.tabs[0].deselect();
        shop.backToMenu.select();
        shop.selected = shop.buttons.length;
      } else if (shop.selected == shop.buttons.length) {
        shop.backToMenu.deselect();
        shop.buttons[0].select();
        shop.selected = 0;
      } else {
        shop.buttons[shop.selected].deselect();
        shop.tabs[0].select();
        shop.selected = -1;
      }
    } else {
      if (shop.selected == -2) {
        shop.tabs[1].deselect();
        shop.backToMenu.select();
        shop.selected = shop.buttons.length;
      } else if (shop.selected == shop.buttons.length) {
        shop.backToMenu.deselect();
        shop.buttons[4].select();
        shop.selected = 4;
        shop.hShift(-shop.shiftFactor);
      } else if ((shop.selected - 3) % 2 == 1) {
        shop.buttons[shop.selected].deselect();
        shop.buttons[shop.selected - 1].select();
        shop.selected -= 1;
      }  else {
        shop.buttons[shop.selected].deselect();
        shop.tabs[1].select();
        shop.selected = -2;
      }
    }
  } else if (shop.menu.controls.keyBindings["Shop3"][2].includes(key)) {                //navigation right
    if (shop.active == 0) {
      switch (shop.selected) {
        case -1:
          shop.tabs[0].deselect();
          shop.tabs[0].deactivate();
          shop.tabs[1].select();
          shop.tabs[1].activate();
          shop.active = 1;
          shop.selected = -2;
          break;
        case shop.buttons.length:
          break;
        default:
          shop.buttons[shop.selected].deselect();
          shop.buttons[(shop.selected + 1) % 3].select();
          shop.selected = (shop.selected + 1) % 3;
      }
    } else {
      switch (shop.selected) {
        case -2:
          shop.tabs[1].deselect();
          shop.tabs[1].deactivate();
          shop.tabs[0].select();
          shop.tabs[0].activate();
          shop.active = 0;
          shop.selected = -1;
          break;
        case shop.buttons.length:
          break;
        default:
          shop.buttons[shop.selected].deselect();
          shop.buttons[((shop.selected - 1) % (shop.buttons.length - 3)) + 3].select();
          shop.selected = ((shop.selected - 1) % (shop.buttons.length - 3)) + 3;
          if (shop.selected == 3 || shop.selected == 4) {
            shop.hShift(-shop.shiftFactor);
          } else if (shop.shopEntries[shop.shopEntries.length - 1].x >= (shop.gD.canvas.width / 2) + 300 && shop.buttons[shop.selected].x >= (shop.gD.canvas.width / 2) + 190) {
            shop.hShift(1);
          }
      }
    }
  } else if (shop.menu.controls.keyBindings["Shop4"][2].includes(key)) {                //navigation left
    if (shop.active == 0) {
      switch (shop.selected) {
        case -1:
          shop.tabs[0].deselect();
          shop.tabs[0].deactivate();
          shop.tabs[1].select();
          shop.tabs[1].activate();
          shop.active = 1;
          shop.selected = -2;
          break;
        case shop.buttons.length:
          break;
        default:
          shop.buttons[shop.selected].deselect();
          shop.buttons[(shop.selected + 2) % 3].select();
          shop.selected = (shop.selected + 2) % 3;
      }
    } else {
      switch (shop.selected) {
        case -2:
          shop.tabs[1].deselect();
          shop.tabs[1].deactivate();
          shop.tabs[0].select();
          shop.tabs[0].activate();
          shop.active = 0;
          shop.selected = -1;
          break;
        case shop.buttons.length:
          break;
        default:
          shop.buttons[shop.selected].deselect();
          shop.buttons[((shop.selected + 7) % (shop.buttons.length - 3)) + 3].select();
          shop.selected = ((shop.selected + 7) % (shop.buttons.length - 3)) + 3;
          if (shop.selected == shop.buttons.length - 1 || shop.selected == shop.buttons.length - 2) {
            shop.hShift(shop.shopEntries.length - 8);
          } else if (shop.shopEntries[3].x < (shop.gD.canvas.width / 2) - 300 && shop.buttons[shop.selected].x < (shop.gD.canvas.width / 2) - 170) {
            shop.hShift(-1);
          }
      }
    }
  }

  if (shop.menu.controls.keyBindings["Shop5"][2].includes(key)) {                                    //confirm
    if (shop.active == 0) {
      switch (shop.selected) {
        case -1:
          break;
        case shop.buttons.length:
          shop.menu.show();
          shop.stop();
          break;
        default:
          shop.shopEntries[shop.selected].buy(shop);
          drawShop(shop);
      }
    } else {
      switch (shop.selected) {
        case -2:
          break;
        case shop.buttons.length:
          shop.menu.show();
          shop.stop();
          break;
        default:
          if (shop.selected % 2 == 1) {
            shop.shopEntries[((shop.selected - 3) / 2) + 3].upgrade(shop);
          } else {
            shop.shopEntries[((shop.selected - 4) / 2) + 3].downgrade(shop);
          }
          drawShop(shop);
      }
    }
  } else if (shop.menu.controls.keyBindings["Shop6"][2].includes(key)) {
    shop.menu.show();
    shop.stop();
  } else {
    drawShop(shop);
  }
}

function shopControlUp(shop, key) {

}

function shopMouseMove(shop) {
  for (var i = 0; i < shop.tabs.length; i++) {
    if (shop.gD.mousePos.x >= shop.tabs[i].x && shop.gD.mousePos.x <= shop.tabs[i].x + shop.tabs[i].width &&
        shop.gD.mousePos.y >= shop.tabs[i].y && shop.gD.mousePos.y <= shop.tabs[i].y + shop.tabs[i].height) {
      if (shop.selected < 0) {
        shop.tabs[shop.active].deselect();
      } else if (shop.selected == shop.buttons.length) {
        shop.backToMenu.deselect();
      } else {
        shop.buttons[shop.selected].deselect();
      }
      shop.tabs[shop.active].deactivate();
      shop.tabs[i].select();
      shop.tabs[i].activate();
      shop.selected = -(i + 1);
      shop.active = i;
    }
  }

  switch (shop.active) {
    case 0:
      for (var i = 0; (i % shop.buttons.length) < 3; i++) {
        if (shop.gD.mousePos.x >= shop.buttons[i % shop.buttons.length].x && shop.gD.mousePos.x <= shop.buttons[i % shop.buttons.length].x + shop.buttons[i % shop.buttons.length].width &&
            shop.gD.mousePos.y >= shop.buttons[i % shop.buttons.length].y && shop.gD.mousePos.y <= shop.buttons[i % shop.buttons.length].y + shop.buttons[i % shop.buttons.length].height) {
          switch (shop.selected) {
            case -2:
              shop.tabs[1].deselect();
              break;
            case -1:
              shop.tabs[0].deselect();
              break;
            case shop.buttons.length:
              shop.backToMenu.deselect();
              break;
            default:
              shop.buttons[shop.selected].deselect();
          }
          shop.buttons[i].select();
          shop.selected = i;
        }
      }
      break;
    case 1:
      for (var i = 3; i < shop.buttons.length; i++) {
        if (shop.gD.mousePos.x >= shop.buttons[i].x && shop.gD.mousePos.x <= shop.buttons[i].x + shop.buttons[i].width &&
            shop.gD.mousePos.y >= shop.buttons[i].y && shop.gD.mousePos.y <= shop.buttons[i].y + shop.buttons[i].height) {
          switch (shop.selected) {
            case -2:
              shop.tabs[1].deselect();
              break;
            case -1:
              shop.tabs[0].deselect();
              break;
            case shop.buttons.length:
              shop.backToMenu.deselect();
              break;
            default:
              shop.buttons[shop.selected].deselect();
          }
          shop.buttons[i].select();
          shop.selected = i;
        }
      }
  }
  if (shop.gD.mousePos.x >= shop.backToMenu.x && shop.gD.mousePos.x <= shop.backToMenu.x + shop.backToMenu.width &&
      shop.gD.mousePos.y >= shop.backToMenu.y && shop.gD.mousePos.y <= shop.backToMenu.y + shop.backToMenu.height) {
    if (shop.selected < 0) {
      shop.tabs[shop.active].deselect();
    } else if (shop.selected < shop.buttons.length) {
      shop.buttons[shop.selected].deselect();
    }
    shop.backToMenu.select();
    shop.selected = shop.buttons.length;
  }
  drawShop(shop);
}

function shopClick(shop) {
  if (shop.selected == shop.buttons.length) {
    if (shop.gD.mousePos.x >= shop.backToMenu.x && shop.gD.mousePos.x <= shop.backToMenu.x + shop.backToMenu.width &&
        shop.gD.mousePos.y >= shop.backToMenu.y && shop.gD.mousePos.y <= shop.backToMenu.y + shop.backToMenu.height) {
      shop.menu.show();
      shop.stop();
    }
  } else if (shop.selected > 2) {
    if (shop.gD.mousePos.x >= shop.buttons[shop.selected].x && shop.gD.mousePos.x <= shop.buttons[shop.selected].x + shop.buttons[shop.selected].width &&
        shop.gD.mousePos.y >= shop.buttons[shop.selected].y && shop.gD.mousePos.y <= shop.buttons[shop.selected].y + shop.buttons[shop.selected].height) {
      if ((shop.selected - 3) % 2 == 0) {
        shop.shopEntries[((shop.selected - 3) / 2) + 3].upgrade(shop);
      } else {
        shop.shopEntries[((shop.selected - 4) / 2) + 3].downgrade(shop);
      }
      drawShop(shop);
    }
  } else if (shop.selected >= 0) {
    if (shop.gD.mousePos.x >= shop.buttons[shop.selected].x && shop.gD.mousePos.x <= shop.buttons[shop.selected].x + shop.buttons[shop.selected].width &&
        shop.gD.mousePos.y >= shop.buttons[shop.selected].y && shop.gD.mousePos.y <= shop.buttons[shop.selected].y + shop.buttons[shop.selected].height) {
      shop.shopEntries[shop.selected].buy(shop);
      drawShop(shop);
    }
  }
}

function shopWheel(shop, event) {
  if (shop.active == 1 && shop.selected > 2) {
    if (event.deltaY > 0) {
      if (shop.selected + 2 < shop.buttons.length) {
        shop.buttons[shop.selected].deselect();
        shop.buttons[shop.selected + 2].select();
        shop.selected = shop.selected + 2;
        if (shop.shopEntries[shop.shopEntries.length - 1].x >= (shop.gD.canvas.width / 2) + 300 && shop.buttons[shop.selected].x >= (shop.gD.canvas.width / 2) + 190) {
          shop.hShift(1);
        }
      }
    } else {
      if (shop.selected - 2 > 2) {
        shop.buttons[shop.selected].deselect();
        shop.buttons[shop.selected - 2].select();
        shop.selected = shop.selected - 2;
        if (shop.shopEntries[3].x < (shop.gD.canvas.width / 2) - 300 && shop.buttons[shop.selected].x < (shop.gD.canvas.width / 2) - 170) {
          shop.hShift(-1);
        }
      }
    }
    drawShop(shop);
  }
}

function drawShop(shop) {
  shop.clear();

  shop.gD.context.drawImage(shop.backgroundImage, 0, 0);

  shop.title.draw(shop.gD);
  shop.money.draw(shop, shop.gD);
  for (var i = 0; i < shop.tabs.length; i++) {
    shop.tabs[i].draw(shop.gD);
  }

  switch (shop.active) {
    case 0:
      for (var i = 0; i < 3; i++) {
        shop.shopEntries[i].draw(shop, shop.gD);
      }
      for (var i = 0; i < 3; i++) {
        shop.buttons[i].draw(shop.gD);
      }
      break;
    default:
      for (var i = 3 + shop.shiftFactor; i < Math.min(8 + shop.shiftFactor, shop.shopEntries.length); i++) {
        shop.shopEntries[i].draw(shop, shop.gD);
      }
      for (var i = 3 + (shop.shiftFactor * 2); i < Math.min(13 + (shop.shiftFactor * 2), shop.buttons.length); i++) {
        shop.buttons[i].draw(shop.gD);
      }
  }

  shop.backToMenu.draw(shop.gD);
}