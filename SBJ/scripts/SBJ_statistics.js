function Statistics(menu, gD) {
  this.menu = menu;
  this.gD = gD;
  this.init = function() {
    this.statistics = new Map([
      ["time_played", new StatisticsData("Zeit gespielt", Events.TIME_PLAYED, false)],
      ["money_collected", new StatisticsData("Geld gesammelt", Events.COLLECT_HYPE, false)],
      ["money_1000_collected", new StatisticsData("1000er Scheine gesammelt", Events.COLLECT_1000_HYPE, false)],
      ["money_100_collected", new StatisticsData("100er Scheine gesammelt", Events.COLLECT_100_HYPE, false)],
      ["money_10_collected", new StatisticsData("10er Scheine gesammelt", Events.COLLECT_10_HYPE, false)],
      ["money_1_collected", new StatisticsData("1er Scheine gesammelt", Events.COLLECT_1_HYPE, false)],
      ["money_bonus", new StatisticsData("Bonus bekommen", Events.COLLECT_BONUS, false)],
      ["money_spent", new StatisticsData("Geld ausgegeben", Events.MONEY_SPENT, false)],
      ["items_stopwatch_collected", new StatisticsData("Stoppuhren gesammelt", Events.COLLECT_STOPWATCH, false)],
      ["items_star_collected", new StatisticsData("Sterne gesammelt", Events.COLLECT_STAR, false)],
      ["items_feather_collected", new StatisticsData("Federn gesammelt", Events.COLLECT_FEATHER, false)],
      ["items_treasure_collected", new StatisticsData("Schatztruhen gesammelt", Events.COLLECT_TREASURE, false)],
      ["items_magnet_collected", new StatisticsData("Magneten gesammelt", Events.COLLECT_MAGNET, false)],
      ["items_rocket_collected", new StatisticsData("Raketen gesammelt", Events.COLLECT_ROCKET, false)],
      ["items_stopwatch_used", new StatisticsData("Stoppuhren benutzt", Events.USE_STOPWATCH, false)],
      ["items_star_used", new StatisticsData("Sterne benutzt", Events.USE_STAR, false)],
      ["items_feather_used", new StatisticsData("Federn benutzt", Events.USE_FEATHER, false)],
      ["items_treasure_used", new StatisticsData("Schatztruhen benutzt", Events.USE_TREASURE, false)],
      ["items_magnet_used", new StatisticsData("Magneten benutzt", Events.USE_MAGNET, false)],
      ["items_rocket_used", new StatisticsData("Raketen benutzt", Events.USE_ROCKET, false)],
      ["player_deaths", new StatisticsData("Tode", Events.DEATH, false)],
      ["items_goldenShamrock_collected", new StatisticsData("Goldene Kleeblätter gesammelt", Events.COLLECT_GOLDEN_SHAMROCK, false)],
      ["game_meter_travelled", new StatisticsData("Insgesamte Meter zurückgelegt", Events.END_OF_ROUND_TOTAL_TRAVELLED_DISTANCE, false)],
      ["highscore_money_collected", new StatisticsData("Höchste gesammelte Geldmenge", Events.HIGHSCORE_COLLECTED_HYPE, true)],
      ["highscore_meter_travelled", new StatisticsData("Höchste zurückgelegte Distanz", Events.HIGHSCORE_TRAVELLED_DISTANCE, true)],
      ["player_hats_collected", new StatisticsData("Hüte gesammelt", Events.COLLECT_HAT, false)],
      ["player_beards_collected", new StatisticsData("Bärte gesammelt", Events.COLLECT_BEARD, false)],
      ["player_glasses_collected", new StatisticsData("Brillen gesammelt", Events.COLLECT_GLASSES, false)],
      ["player_skins_collected", new StatisticsData("Skins gesammelt", Events.COLLECT_SKIN, false)],
      ["game_keys_collected", new StatisticsData("Schlüssel gesammelt", Events.COLLECT_KEY, false)],
      ["game_minigames_won", new StatisticsData("Minispiele gewonnen", Events.MINIGAME_WON, false)],
      ["game_minigames_lost", new StatisticsData("Minispiele verloren", Events.MINIGAME_LOST, false)],
      ["game_minigames_activated", new StatisticsData("Minispiele aktiviert", Events.MINIGAME_ACTIVATED, false)],
      ["player_jumps", new StatisticsData("Sprünge", Events.DO_JUMP, false)],
      ["savestates_created", new StatisticsData("Speicherstände erstellt", Events.CREATE_SAVESTATE, false)]
    ]);
    this.statisticsData = [
      20000,             //in seconds
      30000,
      6,
      80,
      320,
      2800,
      10000,
      5000,
      50,
      20,
      0,
      0,
      0,
      0,
      50,
      20,
      0,
      0,
      0,
      0,
      30000000,
      3,
      4444000,
      40,
      3000,
      40,
      20,
      2,
      55,
      5,
      4,
      40,
      44,
      94652374489,
      2
    ];

    let temp = 0;
    for (var entry of this.statistics.values()) {
      entry.currentCount = this.statisticsData[temp];
      temp++;
    }

    this.title = new CanvasText(this.gD.canvas.width / 2, 30, "Statistics", "pageTitle");

    this.tabs = ["Deco_Bubble_0", "Deco_Bubble_0", "Money_1000_0", "Deco_Bubble_0"];
    this.tabs.map((icon, index) => {
      this.tabs[index] = new StatisticsTab(
        this.gD.canvas.width / 2 - 310, 60, 620, 220, index, icon, "statisticsTab"
      );
    }, this);
    this.tabs[2].objects.push(new StatisticsMoneyField(this.gD.canvas.width / 2 - 245, 70, 545, 13, "money_collected", "moneyPositive"));
    this.tabs[2].objects.push(new StatisticsMoneyField(this.gD.canvas.width / 2 - 245, 93, 545, 13, "money_spent", "moneyNegative"));
    this.tabs[2].objects.push(new StatisticsMoneyBar(255, 170, 545, 100, "moneyBar"));
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
      tab.update(this.statistics);
    }, this);
  };
  this.draw = function(ghostFactor) {
    this.gD.context.drawImage(this.menu.backgroundImage, 0, 0);

    this.title.draw(this.gD);
    this.tabs.map(tab => {
      tab.draw(this.gD, this.statistics);
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
  this.update = function(statistics) {
    this.objects.map(object => {
      if (object.update !== undefined) {
        object.update(statistics);
      }
    }, this);
  };
  this.draw = function(gD, statistics) {
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
        object.draw(gD, statistics);
      }, this);
      drawCanvasRectBorder(this.x, this.y, this.width, this.height, design.borderKey, gD);
    }
  };
}

function StatisticsMoneyField(x, y, width, height, key, styleKey) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.key = key;
  this.styleKey = styleKey;
  this.draw = function(gD, statistics) {
    let design = gD.design.elements[this.styleKey];
    let [spriteX, spriteY, spriteWidth, spriteHeight] = gD.spriteDict["Currency_1"];
    let data = statistics.get(this.key);

    drawCanvasText(this.x + 3, this.y + this.height / 2, data.name, design.textKey.label, gD);
    drawCanvasRect(this.x + this.width - 220, this.y, 220, this.height, design.rectKey, gD);
    drawCanvasText(
      this.x + this.width - 3, this.y + this.height - 3,
      data.currentCount.toString().replace(/\d(?=(\d{3})+($|\.))/g, '$&.'), design.textKey.number, gD
    );
    drawCanvasImage(this.x + this.width - 218, this.y + (this.height - spriteHeight) / 2, "Currency_1", gD);
    drawCanvasRectBorder(this.x + this.width - 220, this.y, 220, this.height, design.borderKey, gD);
    drawCanvasLine(this.x, this.y + this.height / 2, design.borderKey, gD, this.x, this.y + this.height, this.x + this.width, this.y + this.height);
  };
}

function StatisticsMoneyBar(x, y, width, height, styleKey) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.styleKey = styleKey;
  this.widths = [];
  this.update = function(statistics) {
    this.widths = [
      statistics.get("money_1_collected").currentCount / statistics.get("money_collected").currentCount * this.width,
      statistics.get("money_10_collected").currentCount * 10 / statistics.get("money_collected").currentCount * this.width,
      statistics.get("money_100_collected").currentCount * 100 / statistics.get("money_collected").currentCount * this.width,
      statistics.get("money_1000_collected").currentCount * 1000 / statistics.get("money_collected").currentCount * this.width,
      statistics.get("money_bonus").currentCount / statistics.get("money_collected").currentCount * this.width
    ];
  };
  this.draw = function(gD) {
    let design = gD.design.elements[this.styleKey];
    let designKeys = ["money1","money10","money100","money1000","bonus"];
    let newX = this.x;

    this.widths.map((width, index) => {
      drawCanvasRect(newX, this.y, width, this.height, design.rectKey[designKeys[index]], gD);
      drawCanvasRectBorder(newX, this.y, width, this.height, design.borderKey, gD);
      newX += width;
    }, this);
  };
}

function StatisticsMoneyBarLegend(x, y, width, height) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.draw = function(gD, statistics) {
    
  };
}

function StatisticsMoneyCircle(centerX, centerY, radius, stats, styleKey) {
  this.centerX = centerX;
  this.centerY = centerY;
  this.radius = radius;
  this.stats = stats;
  this.styleKey = styleKey;
  this.draw = function(gD) {
    let design = gD.design.elements[this.styleKey];
    let money = 0;
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