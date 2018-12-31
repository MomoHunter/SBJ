function Statistics(menu, gD) {
  this.menu = menu;
  this.gD = gD;
  this.init = function() {
    this.statistics = [
      new StatisticsData("Zeit gespielt", Events.TIME_PLAYED, false),
      new StatisticsData("Geld gesammelt", Events.COLLECT_HYPE, false)
    ];
    this.statistics = {
      "time_played": 20000,             //in seconds
      "money_collected": 30000,
      "money_1000_collected": 6,
      "money_100_collected": 80,
      "money_10_collected": 320,
      "money_1_collected": 2800,
      "money_bonus": 10000,
      "money_spent": 5000,
      "items_rocket_collected": 50,
      "items_stopwatch_collected": 20,
      "items_magnet_collected": 0,
      "items_treasure_collected": 0,
      "items_star_collected": 0,
      "items_feather_collected": 0,
      "items_rocket_used": 50,
      "items_stopwatch_used": 20,
      "items_magnet_used": 0,
      "items_treasure_used": 0,
      "items_star_used": 0,
      "items_feather_used": 0,
      "player_deaths": 30000000,
      "items_goldenShamrock_collected": 3,
      "game_meter_travelled": 4444000,
      "highscore_money_collected": 40,
      "highscore_meter_travelled": 3000,
      "player_hats_collected": 40,
      "player_beards_collected": 20,
      "player_glasses_collected":2,
      "player_skins_collected": 55,
      "game_keys_collected": 5,
      "game_minigames_won": 4,
      "game_minigames_lost":40,
      "game_minigames_activated": 44,
      "player_jumps": 94652374489,
      "savestate_created": 2
    };

    this.title = new CanvasText(this.gD.canvas.width / 2, 30, "Statistics", "pageTitle");

    this.tabs = ["Deco_Bubble_0", "Deco_Bubble_0", "Money_1000_0", "Deco_Bubble_0"];
    this.tabs.map((icon, index) => {
      this.tabs[index] = new StatisticsTab(
        this.gD.canvas.width / 2 - 310, 60, 620, 220, index, icon, "statisticsTab"
      );
    }, this);
    this.tabs[2].objects.push(new StatisticsMoneyBar(255, 170, 545, 100, this.statistics, "moneyBar"));
    this.tabs[2].objects.push(new CanvasRainbowText(400, 150, "Bonus", "rainbow"));
    this.tabs[2].select();

    this.backToMenu = new CanvasButton(this.gD.canvas.width / 2 - 100, this.gD.canvas.height - 50, 200, 30, "Main Menu", "menu");

    this.updateSelection(-1, 0);
  };
  this.updateKeyPresses = function() {
    this.gD.newKeys.map(key => {

    }, this);
  };
  this.updateMouseMoves = function() {
    if (this.gD.mousePos.x >= this.backToMenu.x && this.gD.mousePos.x <= this.backToMenu.x + this.backToMenu.width &&
        this.gD.mousePos.y >= this.backToMenu.y && this.gD.mousePos.y <= this.backToMenu.y + this.backToMenu.height) {
      this.updateSelection(-1, this.selectedColumnIndex);
    }
  };
  this.updateClick = function() {
    var clickPos = this.gD.clicks.pop();
    if (!clickPos) {
      return
    }

    if (clickPos.x >= this.backToMenu.x && clickPos.x <= this.backToMenu.x + this.backToMenu.width &&
        clickPos.y >= this.backToMenu.y && clickPos.y <= this.backToMenu.y + this.backToMenu.height) {
      this.gD.currentPage = this.menu;
    }
  };
  this.updateWheelMoves = function() {

  };
  this.update = function() {
    this.tabs.map(tab => {
      tab.update();
    }, this);
  };
  this.draw = function(ghostFactor) {
    this.gD.context.drawImage(this.menu.backgroundImage, 0, 0);

    this.title.draw(this.gD);
    this.tabs.map(tab => {
      tab.draw(this.gD);
    }, this);
    this.backToMenu.draw(this.gD);
  };
  this.updateSelection = function(rowIndex, columnIndex) {
    if (this.selectedRowIndex !== undefined && this.selectedColumnIndex !== undefined) {
      if (this.selectedRowIndex === -1) {
        this.backToMenu.deselect();
      } else {
        
      }
    }

    if (rowIndex === -1) {
      this.backToMenu.select();
    } else {
      
    }
    this.selectedRowIndex = rowIndex;
    this.selectedColumnIndex = columnIndex;
  };
}

function StatisticsData(name, eventKey, isResetPerRound) {
  this.name = name;
  this.eventKey = eventKey;
  this.isResetPerRound = isResetPerRound;
  this.currentCount = 0;
  this.resetAtRoundStart = function() {
    if (this.isResetPerRound) {
      this.currentCount = 0;
    }
  };
  this.handleEvent = function(eventKey, addedValue = 1) {
    if (this.eventKey === eventKey) {
      this.currentCount += addedValue;
    }
  };
}

function StatisticsTab(x, y, width, height, tabNr, spriteKey, styleKey) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.tabNr = tabNr;
  this.spriteKey = spriteKey;
  this.styleKey = styleKey;
  this.selected = false;
  this.objects = [];
  this.init = function() {

  };
  this.select = function() {
    this.selected = true;
  };
  this.deselect = function() {
    this.selected = false;
  };
  this.update = function() {
    this.objects.map(object => {
      if (object.update !== undefined) {
        object.update();
      }
    }, this);
  };
  this.draw = function(gD) {
    var design = gD.design.elements[this.styleKey];
    var borderSize = gD.design.border[design.borderKey].borderSize;
    var [spriteX, spriteY, spriteWidth, spriteHeight] = gD.spriteDict[this.spriteKey];
    if (!this.selected) {
      drawCanvasRect(this.x, this.y + 55 * this.tabNr, 55, 55, design.rectKey.tab, gD);
      drawCanvasImage(
        this.x + Math.floor((55 - spriteWidth) / 2), 
        this.y + 55 * this.tabNr + Math.floor((55 - spriteHeight) / 2), this.spriteKey, gD
      );
      drawCanvasRect(this.x, this.y + 55 * this.tabNr, 55, 55, design.rectKey.inactive, gD);
      drawCanvasRectBorder(this.x, this.y + 55 * this.tabNr, 55, 55, design.borderKey, gD);
    } else {
      drawCanvasRectBorder(this.x, this.y + 55 * this.tabNr, 55, 55, design.borderKey, gD);
      drawCanvasRect(
        this.x + borderSize / 2, this.y + borderSize / 2 + 55 * this.tabNr,
        55, 55 - borderSize / 2 * 2, design.rectKey.tab, gD
      );
      drawCanvasImage(
        this.x + Math.floor((55 - spriteWidth) / 2), 
        this.y + 55 * this.tabNr + Math.floor((55 - spriteHeight) / 2), this.spriteKey, gD
      );
      drawCanvasRect(this.x + 55 + borderSize / 2, this.y, this.width - 55, this.height, design.rectKey.background, gD);
      this.objects.map(object => {
        object.draw(gD);
      }, this);
      drawCanvasRectBorder(this.x, this.y, this.width, this.height, design.borderKey, gD);
    }
  };
}

function StatisticsMoneyBar(x, y, width, height, stats, styleKey) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.stats = stats;
  this.styleKey = styleKey;
  this.widths = [
    this.stats.money_1_collected / this.stats.money_collected * this.width,
    (this.stats.money_10_collected * 10) / this.stats.money_collected * this.width,
    (this.stats.money_100_collected * 100) / this.stats.money_collected * this.width,
    (this.stats.money_1000_collected * 1000) / this.stats.money_collected * this.width,
    this.stats.money_bonus / this.stats.money_collected * this.width
  ];
  this.refresh = function() {
    this.widths = [
      this.stats.money_1_collected / this.stats.money_collected * this.width,
      (this.stats.money_10_collected * 10) / this.stats.money_collected * this.width,
      (this.stats.money_100_collected * 100) / this.stats.money_collected * this.width,
      (this.stats.money_1000_collected * 1000) / this.stats.money_collected * this.width,
      this.stats.money_bonus / this.stats.money_collected * this.width
    ];
  };
  this.draw = function(gD) {
    var design = gD.design.elements[this.styleKey];
    var designKeys = ["money1","money10","money100","money1000","bonus"];
    var newX = this.x;

    this.widths.map((width, index) => {
      drawCanvasRect(newX, this.y, width, this.height, design.rectKey[designKeys[index]], gD);
      drawCanvasText(newX + width / 2, this.y + this.height / 2, (width / this.width * 100).toFixed(2) + "%", design.textKey, gD);
      drawCanvasRectBorder(newX, this.y, width, this.height, design.borderKey, gD);
      newX += width;
    }, this);
  };
}

function StatisticsMoneyBarLegend(x, y, width, height, stats) {}

function StatisticsMoneyCircle(centerX, centerY, radius, stats, styleKey) {
  this.centerX = centerX;
  this.centerY = centerY;
  this.radius = radius;
  this.stats = stats;
  this.styleKey = styleKey;
  this.draw = function(gD) {
    var design = gD.design.elements[this.styleKey];
    var money = 0;
    drawCanvasCircle(this.centerX, this.centerY, this.radius, design.circleKey.background, gD);
    drawCanvasCirclePart(
      this.centerX, this.centerY, this.radius, -Math.PI / 2, 
      this.stats.money_1_collected / this.stats.money_collected * Math.PI * 2 - Math.PI / 2, design.circleKey.money1, gD
    );
    drawCanvasCirclePartBorder(
      this.centerX, this.centerY, this.radius, -Math.PI / 2, 
      this.stats.money_1_collected / this.stats.money_collected * Math.PI * 2 - Math.PI / 2, design.borderKey, gD
    );
    money += this.stats.money_1_collected;
    drawCanvasCirclePart(
      this.centerX, this.centerY, this.radius, money / this.stats.money_collected * Math.PI * 2 - Math.PI / 2, 
      (this.stats.money_10_collected * 10 + money) / this.stats.money_collected * Math.PI * 2 - Math.PI / 2, design.circleKey.money10, gD
    );
    drawCanvasCirclePartBorder(
      this.centerX, this.centerY, this.radius, money / this.stats.money_collected * Math.PI * 2 - Math.PI / 2, 
      (this.stats.money_10_collected * 10 + money) / this.stats.money_collected * Math.PI * 2 - Math.PI / 2, design.borderKey, gD
    );
    money += this.stats.money_10_collected * 10;
    drawCanvasCirclePart(
      this.centerX, this.centerY, this.radius, money / this.stats.money_collected * Math.PI * 2 - Math.PI / 2,
      (this.stats.money_100_collected * 100 + money) / this.stats.money_collected * Math.PI * 2 - Math.PI / 2, design.circleKey.money100, gD
    );
    drawCanvasCirclePartBorder(
      this.centerX, this.centerY, this.radius, money / this.stats.money_collected * Math.PI * 2 - Math.PI / 2,
      (this.stats.money_100_collected * 100 + money) / this.stats.money_collected * Math.PI * 2 - Math.PI / 2, design.borderKey, gD
    );
    money += this.stats.money_100_collected * 100;
    drawCanvasCirclePart(
      this.centerX, this.centerY, this.radius, money / this.stats.money_collected * Math.PI * 2 - Math.PI / 2,
      (this.stats.money_1000_collected * 1000 + money) / this.stats.money_collected * Math.PI * 2 - Math.PI / 2, design.circleKey.money1000, gD
    );
    drawCanvasCirclePartBorder(
      this.centerX, this.centerY, this.radius, money / this.stats.money_collected * Math.PI * 2 - Math.PI / 2,
      (this.stats.money_1000_collected * 1000 + money) / this.stats.money_collected * Math.PI * 2 - Math.PI / 2, design.borderKey, gD
    );
    money += this.stats.money_1000_collected * 1000;
    drawCanvasCirclePart(
      this.centerX, this.centerY, this.radius, money / this.stats.money_collected * Math.PI * 2 - Math.PI / 2,
      (this.stats.money_bonus + money) / this.stats.money_collected * Math.PI * 2 - Math.PI / 2, design.circleKey.bonus, gD
    );
    drawCanvasCirclePartBorder(
      this.centerX, this.centerY, this.radius, money / this.stats.money_collected * Math.PI * 2 - Math.PI / 2,
      (this.stats.money_bonus + money) / this.stats.money_collected * Math.PI * 2 - Math.PI / 2, design.borderKey, gD
    );
  };
}