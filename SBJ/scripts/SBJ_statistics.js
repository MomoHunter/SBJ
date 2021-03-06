function Statistics(menu, gD) {
  this.menu = menu;
  this.gD = gD;
  /**
   * initiates the object
   */
  this.init = function() {
    this.statistics = new Map([
      ["time_played", new StatisticsData("Zeit gespielt", Events.TIME_PLAYED, false)],
      ["money_collected", new StatisticsData("Geld gesammelt", Events.COLLECT_HYPE_WITH_BONUS, false)],
      ["money_1000_collected", new StatisticsData("1000er Scheine gesammelt", Events.COLLECT_1000_HYPE, false)],
      ["money_100_collected", new StatisticsData("100er Scheine gesammelt", Events.COLLECT_100_HYPE, false)],
      ["money_10_collected", new StatisticsData("10er Scheine gesammelt", Events.COLLECT_10_HYPE, false)],
      ["money_1_collected", new StatisticsData("1er Scheine gesammelt", Events.COLLECT_1_HYPE, false)],
      ["money_bonus", new StatisticsData("Bonus bekommen", Events.COLLECT_BONUS, false)],
      ["money_spent", new StatisticsData("Geld ausgegeben", Events.MONEY_SPENT, false)],
      ["items_collected", new StatisticsData("Items gesammelt", Events.COLLECT_ITEM, false)],
      ["items_stopwatch_collected", new StatisticsData("Stoppuhren gesammelt", Events.COLLECT_STOPWATCH, false)],
      ["items_star_collected", new StatisticsData("Sterne gesammelt", Events.COLLECT_STAR, false)],
      ["items_feather_collected", new StatisticsData("Federn gesammelt", Events.COLLECT_FEATHER, false)],
      ["items_treasure_collected", new StatisticsData("Schatztruhen gesammelt", Events.COLLECT_TREASURE, false)],
      ["items_magnet_collected", new StatisticsData("Magneten gesammelt", Events.COLLECT_MAGNET, false)],
      ["items_rocket_collected", new StatisticsData("Raketen gesammelt", Events.COLLECT_ROCKET, false)],
      ["items_questionmark_collected", new StatisticsData("Fragezeichen gesammelt", Events.COLLECT_QUESTIONMARK, false)],
      ["items_goldenShamrock_collected", new StatisticsData("Goldene Kleeblätter gesammelt", Events.COLLECT_GOLDEN_SHAMROCK, false)],
      ["items_used", new StatisticsData("Items benutzt", Events.USE_ITEM, false)],
      ["items_stopwatch_used", new StatisticsData("Stoppuhren benutzt", Events.USE_STOPWATCH, false)],
      ["items_star_used", new StatisticsData("Sterne benutzt", Events.USE_STAR, false)],
      ["items_feather_used", new StatisticsData("Federn benutzt", Events.USE_FEATHER, false)],
      ["items_treasure_used", new StatisticsData("Schatztruhen benutzt", Events.USE_TREASURE, false)],
      ["items_magnet_used", new StatisticsData("Magneten benutzt", Events.USE_MAGNET, false)],
      ["items_rocket_used", new StatisticsData("Raketen benutzt", Events.USE_ROCKET, false)],
      ["player_deaths", new StatisticsData("Tode", Events.DEATH, false)],
      ["game_meter_travelled", new StatisticsData("Meter zurückgelegt", Events.END_OF_ROUND_TOTAL_TRAVELLED_DISTANCE, false)],
      ["highscore_money_collected", new StatisticsData("Höchste gesammelte Geldmenge", Events.HIGHSCORE_COLLECTED_HYPE, true)],
      ["highscore_meter_travelled", new StatisticsData("Höchste zurückgelegte Distanz", Events.HIGHSCORE_TRAVELLED_DISTANCE, true)],
      ["player_hats_collected", new StatisticsData("Hüte gesammelt", Events.COLLECT_HAT, false)],
      ["player_beards_collected", new StatisticsData("Bärte gesammelt", Events.COLLECT_BEARD, false)],
      ["player_glasses_collected", new StatisticsData("Brillen gesammelt", Events.COLLECT_GLASSES, false)],
      ["player_skins_collected", new StatisticsData("Skins gesammelt", Events.COLLECT_SKIN, false)],
      ["game_bluekeys_collected", new StatisticsData("Blaue Schlüssel gesammelt", Events.COLLECT_BLUEKEY, false)],
      ["game_redkeys_collected", new StatisticsData("Rote Schlüssel gesammelt", Events.COLLECT_REDKEY, false)],
      ["game_greenkeys_collected", new StatisticsData("Grüne Schlüssel gesammelt", Events.COLLECT_GREENKEY, false)],
      ["game_yellowkeys_collected", new StatisticsData("Gelbe Schlüssel gesammelt", Events.COLLECT_YELLOWKEY, false)],
      ["game_minigames_won", new StatisticsData("Minispiele gewonnen", Events.MINIGAME_WON, false)],
      ["game_minigames_lost", new StatisticsData("Minispiele verloren", Events.MINIGAME_LOST, false)],
      ["game_minigames_activated", new StatisticsData("Minispiele aktiviert", Events.MINIGAME_ACTIVATED, false)],
      ["player_jumps", new StatisticsData("Sprünge", Events.DO_JUMP, false)],
      ["savestates_created", new StatisticsData("Speicherstände erstellt", Events.CREATE_SAVESTATE, false)]
    ]);

    this.title = new CanvasText(this.gD.canvas.width / 2, 30, "Statistics", "pageTitle");

    this.tabs = ["Icon_Statistic", "Item_B_Questionmark", "Currency_M", "Special_GoldenShamrock_B"];
    this.tabs.map((icon, index) => {
      this.tabs[index] = new CanvasTab(
        this.gD.canvas.width / 2 - 310, 60, 620, 220, index, 4, icon, "standardTab"
      );
    }, this);

    this.tabs[0].objects.push(new StatisticsTimeField(this.gD.canvas.width / 2 - 245, 70, 545, 50, "time_played", "statisticsTime"));
    this.tabs[0].objects.push(new StatisticsDistanceField(this.gD.canvas.width / 2 - 245, 130, 545, 70, "game_meter_travelled", "statisticsDistance"));
    this.tabs[0].objects.push(new StatisticsItemField(this.gD.canvas.width / 2 - 245, 200, 267, 22, "player_deaths", "itemStandard"));
    this.tabs[0].objects.push(new StatisticsItemField(this.gD.canvas.width / 2 + 33, 200, 267, 22, "player_jumps", "itemStandard"));
    this.tabs[0].objects.push(new StatisticsHeadline(this.gD.canvas.width / 2 - 245, 240, 267, 30, "highscore_money_collected", "statisticsHeadline"));
    this.tabs[0].objects.push(new StatisticsHeadline(this.gD.canvas.width / 2 + 33, 240, 267, 30, "highscore_meter_travelled", "statisticsHeadline"));

    this.tabs[1].objects.push(new StatisticsHeadline(this.gD.canvas.width / 2 - 245, 70, 240, 30, "items_collected", "statisticsHeadline"));
    this.tabs[1].objects.push(new StatisticsItemField(this.gD.canvas.width / 2 - 245, 108, 240, 22, "items_stopwatch_collected", "itemStandard", "Item_Stopwatch"));
    this.tabs[1].objects.push(new StatisticsItemField(this.gD.canvas.width / 2 - 245, 136, 240, 22, "items_star_collected", "itemStandard", "Item_Star"));
    this.tabs[1].objects.push(new StatisticsItemField(this.gD.canvas.width / 2 - 245, 164, 240, 22, "items_feather_collected", "itemStandard", "Item_Feather"));
    this.tabs[1].objects.push(new StatisticsItemField(this.gD.canvas.width / 2 - 245, 192, 240, 22, "items_treasure_collected", "itemStandard", "Item_Treasure"));
    this.tabs[1].objects.push(new StatisticsItemField(this.gD.canvas.width / 2 - 245, 220, 240, 22, "items_magnet_collected", "itemStandard", "Item_Magnet"));
    this.tabs[1].objects.push(new StatisticsItemField(this.gD.canvas.width / 2 - 245, 248, 240, 22, "items_rocket_collected", "itemStandard", "Item_Rocket"));
    this.tabs[1].objects.push(new StatisticsLine(
      this.gD.canvas.width / 2 + 5, 70, 18, 200, "items_collected",
      ["items_stopwatch_collected", "items_star_collected", "items_feather_collected", "items_treasure_collected",
        "items_magnet_collected", "items_rocket_collected"], "itemBar"
    ));
    this.tabs[1].objects.push(new StatisticsLine(
      this.gD.canvas.width / 2 + 32, 70, 18, 200, "items_used",
      ["items_stopwatch_used", "items_star_used", "items_feather_used", "items_treasure_used",
        "items_magnet_used", "items_rocket_used"], "itemBar"
    ));
    this.tabs[1].objects.push(new StatisticsHeadline(this.gD.canvas.width / 2 + 60, 70, 240, 30, "items_used", "statisticsHeadline"));
    this.tabs[1].objects.push(new StatisticsItemField(this.gD.canvas.width / 2 + 60, 108, 240, 22, "items_stopwatch_used", "itemStandard", "Item_Stopwatch"));
    this.tabs[1].objects.push(new StatisticsItemField(this.gD.canvas.width / 2 + 60, 136, 240, 22, "items_star_used", "itemStandard", "Item_Star"));
    this.tabs[1].objects.push(new StatisticsItemField(this.gD.canvas.width / 2 + 60, 164, 240, 22, "items_feather_used", "itemStandard", "Item_Feather"));
    this.tabs[1].objects.push(new StatisticsItemField(this.gD.canvas.width / 2 + 60, 192, 240, 22, "items_treasure_used", "itemStandard", "Item_Treasure"));
    this.tabs[1].objects.push(new StatisticsItemField(this.gD.canvas.width / 2 + 60, 220, 240, 22, "items_magnet_used", "itemStandard", "Item_Magnet"));
    this.tabs[1].objects.push(new StatisticsItemField(this.gD.canvas.width / 2 + 60, 248, 240, 22, "items_rocket_used", "itemStandard", "Item_Rocket"));

    this.tabs[2].objects.push(new StatisticsMoneyField(this.gD.canvas.width / 2 - 245, 70, 545, 13, "money_collected", "moneyPositive", "Currency_XS"));
    this.tabs[2].objects.push(new StatisticsMoneyField(this.gD.canvas.width / 2 - 245, 93, 545, 13, "money_spent", "moneyNegative", "Currency_XS"));
    this.tabs[2].objects.push(new StatisticsMoneyField(this.gD.canvas.width / 2 - 245, 116, 545, 13, "money_1_collected", "statisticsMoney1", "Money_XS_1"));
    this.tabs[2].objects.push(new StatisticsMoneyField(this.gD.canvas.width / 2 - 245, 139, 545, 13, "money_10_collected", "statisticsMoney10", "Money_XS_10"));
    this.tabs[2].objects.push(new StatisticsMoneyField(this.gD.canvas.width / 2 - 245, 162, 545, 13, "money_100_collected", "statisticsMoney100", "Money_XS_100"));
    this.tabs[2].objects.push(new StatisticsMoneyField(this.gD.canvas.width / 2 - 245, 185, 545, 13, "money_1000_collected", "statisticsMoney1000", "Money_XS_1000"));
    let bonus = new StatisticsMoneyRainbowField(this.gD.canvas.width / 2 - 245, 208, 545, 13, "money_bonus", "statisticsMoneyBonus", "Currency_XS");
    bonus.init(this.statistics);
    this.tabs[2].objects.push(bonus);
    this.tabs[2].objects.push(new StatisticsBar(
      this.gD.canvas.width / 2 - 245, 231, 545, 39, "money_collected",
      ["money_1_collected", "money_10_collected", "money_100_collected", "money_1000_collected", "money_bonus"],
      "moneyBar"
    ));

    this.tabs[3].objects.push(new StatisticsItemField(this.gD.canvas.width / 2 - 245, 70, 545, 22, "items_goldenShamrock_collected", "itemStandard", "Special_GoldenShamrock"));
    this.tabs[3].objects.push(new StatisticsItemField(this.gD.canvas.width / 2 - 245, 96, 267, 22, "game_bluekeys_collected", "itemStandard", "Special_BlueKey"));
    this.tabs[3].objects.push(new StatisticsItemField(this.gD.canvas.width / 2 + 33, 96, 267, 22, "game_redkeys_collected", "itemStandard", "Special_RedKey"));
    this.tabs[3].objects.push(new StatisticsItemField(this.gD.canvas.width / 2 - 245, 122, 267, 22, "game_greenkeys_collected", "itemStandard", "Special_GreenKey"));
    this.tabs[3].objects.push(new StatisticsItemField(this.gD.canvas.width / 2 + 33, 122, 267, 22, "game_yellowkeys_collected", "itemStandard", "Special_YellowKey"));
    this.tabs[3].objects.push(new StatisticsItemField(this.gD.canvas.width / 2 - 245, 148, 267, 22, "game_minigames_won", "itemStandard"));
    this.tabs[3].objects.push(new StatisticsItemField(this.gD.canvas.width / 2 + 33, 148, 267, 22, "game_minigames_lost", "itemStandard"));
    this.tabs[3].objects.push(new StatisticsItemField(this.gD.canvas.width / 2 - 245, 174, 545, 22, "game_minigames_activated", "itemStandard"));
    this.tabs[3].objects.push(new StatisticsItemField(this.gD.canvas.width / 2 - 245, 200, 267, 22, "player_hats_collected", "itemStandard"));
    this.tabs[3].objects.push(new StatisticsItemField(this.gD.canvas.width / 2 + 33, 200, 267, 22, "player_beards_collected", "itemStandard"));
    this.tabs[3].objects.push(new StatisticsItemField(this.gD.canvas.width / 2 - 245, 226, 267, 22, "player_glasses_collected", "itemStandard"));
    this.tabs[3].objects.push(new StatisticsItemField(this.gD.canvas.width / 2 + 33, 226, 267, 22, "player_skins_collected", "itemStandard"));
    this.tabs[3].objects.push(new StatisticsItemField(this.gD.canvas.width / 2 - 245, 252, 545, 22, "savestates_created", "itemStandard"));

    this.backToMenu = new CanvasButton(this.gD.canvas.width / 2 - 100, this.gD.canvas.height - 50, 200, 30, "Main Menu", "menu");

    this.updateSelection(-1, 0);
  };
  this.handleEvent = function(eventKey, addedValue = 1) {
    for (let element of this.statistics.values()) {
      element.handleEvent(eventKey, addedValue);
    }
  };
  this.getSaveData = function() {
    let saveData = {};
    for (let [key, value] of this.statistics) {
      saveData[key] = value.getSaveData();
    }
    return saveData;
  };
  this.setSaveData = function(data) {
    for (let e in data) {
      if (data.hasOwnProperty(e)) {
        this.statistics.get(e).setSaveData(data[e]);
      }
    }
  };
  /**
   * checks if a key is pressed and executes commands
   */
  this.updateKeyPresses = function() {
    this.gD.newKeys.map(key => {
      let keyB = this.menu.controls.keyBindings;
      let rowIndex = this.selectedRowIndex;
      let tabIndex = this.selectedTabIndex;

      if (keyB.get("Menu_NavDown")[3].includes(key)) {
        if (rowIndex === -1) {
          this.updateSelection(0, 0);
        } else {
          tabIndex++;
          if (tabIndex >= this.tabs.length) {
            this.updateSelection(-1, tabIndex - 1)
          } else {
            this.updateSelection(rowIndex, tabIndex);
          }
        }
      } else if (keyB.get("Menu_NavUp")[3].includes(key)) {
        if (rowIndex === -1) {
          this.updateSelection(0, this.tabs.length - 1);
        } else {
          tabIndex--;
          if (tabIndex === -1) {
            this.updateSelection(-1, tabIndex + 1);
          } else {
            this.updateSelection(rowIndex, tabIndex);
          }
        }
      } else if (keyB.get("Menu_Confirm")[3].includes(key)) {
        if (rowIndex === -1) {
          gD.currentPage = this.menu;
        }
      } else if (keyB.get("Menu_Back")[3].includes(key)) {
        gD.currentPage = this.menu;
      } else if (keyB.get("Mute_All")[3].includes(key)) {
        this.gD.muted = !this.gD.muted;
        this.menu.muteButton.setSprite();
      }
    }, this);
  };
  /**
   * checks, if the mouse was moved, what the mouse hit
   */
  this.updateMouseMoves = function() {
    this.tabs.map((tab, index) => {
      if (this.gD.mousePos.x >= tab.x && this.gD.mousePos.x <= tab.x + tab.tabHeadWidth &&
          this.gD.mousePos.y >= tab.y + index * tab.tabHeadHeight && this.gD.mousePos.y <= tab.y + (index + 1) * tab.tabHeadHeight) {
        this.updateSelection(0, index);
      }
    }, this);

    if (this.gD.mousePos.x >= this.backToMenu.x && this.gD.mousePos.x <= this.backToMenu.x + this.backToMenu.width &&
        this.gD.mousePos.y >= this.backToMenu.y && this.gD.mousePos.y <= this.backToMenu.y + this.backToMenu.height) {
      this.updateSelection(-1, this.selectedTabIndex);
    }
  };
  /**
   * checks where a click was executed
   */
  this.updateClick = function() {
    let clickPos = this.gD.clicks.pop();
    if (!clickPos) {
      return
    }

    if (clickPos.x >= this.backToMenu.x && clickPos.x <= this.backToMenu.x + this.backToMenu.width &&
        clickPos.y >= this.backToMenu.y && clickPos.y <= this.backToMenu.y + this.backToMenu.height) {
      this.gD.currentPage = this.menu;
    }
  };
  /**
   * checks if the mouse wheel was moved
   */
  this.updateWheelMoves = function() {
    /* unused */
  };
  /**
   * updates moving objects
   */
  this.update = function() {
    this.tabs.map(tab => {
      tab.update(this.statistics);
    }, this);

    this.backToMenu.update();
    
    this.menu.lightUpdate();
  };
  /**
   * draws the objects onto the canvas
   * @param {float} ghostFactor the part of a physics step since the last physics update
   */
  this.draw = function(ghostFactor) {
    this.gD.context.drawImage(this.menu.backgroundImage, 0, 0);

    this.title.draw(this.gD);
    this.tabs.map(tab => {
      tab.draw(this.gD, this.statistics);
    }, this);
    this.backToMenu.draw(this.gD);
    
    this.menu.lightDraw();
  };
  /**
   * updates the selected object and deselects the old object
   * @param {number} rowIndex the row of the new selected object
   * @param {number} tabIndex the tab of the new selected object
   */
  this.updateSelection = function(rowIndex, tabIndex) {
    if (this.selectedRowIndex !== undefined && this.selectedTabIndex !== undefined) {
      if (this.selectedRowIndex === -1) {
        this.backToMenu.deselect();
      }
      this.tabs[this.selectedTabIndex].deselect();
    }

    if (rowIndex === -1) {
      this.backToMenu.select();
    }
    this.tabs[tabIndex].select();
    this.selectedRowIndex = rowIndex;
    this.selectedTabIndex = tabIndex;
  };
}

/**
 * a statistic data object that inherits statistical data
 * @param {string}  name            the name of the statistic data
 * @param {string}  eventKey        the event key for new values
 * @param {boolean} isFullNumber    if the value should not add the values up, but count the values as full numbers
 */
function StatisticsData(name, eventKey, isFullNumber) {
  this.name = name;
  this.eventKey = eventKey;
  this.isFullNumber = isFullNumber;
  this.currentCount = 0;
  this.currentValues = {}; //only used with money notes
  /**
   * adds a new value
   * @param {string} eventKey   the event key to compare if its the same key
   * @param {number} addedValue the new value
   */
  this.handleEvent = function(eventKey, addedValue = 1) {
    if (this.eventKey === eventKey) {
      if ([Events.COLLECT_1000_HYPE, Events.COLLECT_100_HYPE, Events.COLLECT_10_HYPE, Events.COLLECT_1_HYPE].includes(eventKey)) {
        this.currentValues[addedValue[0]] === undefined ? 
          this.currentValues[addedValue[0]] = 1 : this.currentValues[addedValue[0]] += 1;
        this.currentCount++;
      } else if (this.isFullNumber) {
        if (this.currentCount < +addedValue) {
          this.currentCount = +addedValue;
        }
      } else {
        this.currentCount += +addedValue;
      }
    }
  };
  this.getSaveData = function() {
    if ([Events.COLLECT_1000_HYPE, Events.COLLECT_100_HYPE, Events.COLLECT_10_HYPE, Events.COLLECT_1_HYPE].includes(this.eventKey)) {
      return this.currentValues;
    } else {
      return this.currentCount;
    }
  };
  this.setSaveData = function(data) {
    if ([Events.COLLECT_1000_HYPE, Events.COLLECT_100_HYPE, Events.COLLECT_10_HYPE, Events.COLLECT_1_HYPE].includes(this.eventKey)) {
      this.currentValues = data;

      for (let e in this.currentValues) {
        if (this.currentValues.hasOwnProperty(e)) {
          this.currentCount += this.currentValues[e];
        }
      }
    } else { 
      this.currentCount = data;
    }
  };
}

/**
 * a tab for statistics
 * @param {number} x         the x-coordinate of the top left corner of the tab
 * @param {number} y         the y-coordinate of the top left corner of the tab
 * @param {number} width     the width of the tab
 * @param {number} height    the height of the tab
 * @param {number} tabNr     the number of the tab
 * @param {string} spriteKey the icon for the tab
 * @param {string} styleKey  the style of the tab
 */
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
  /**
   * selects the tab
   */
  this.select = function() {
    this.selected = true;
  };
  /**
   * deselects the tab
   */
  this.deselect = function() {
    this.selected = false;
  };
  /**
   * updates moving objects
   */
  this.update = function(statistics) {
    this.objects.map(object => {
      if (object.update !== undefined) {
        object.update(statistics);
      }
    }, this);
  };
  /**
   * draws the objects onto the canvas
   */
  this.draw = function(gD, statistics) {
    let design = gD.design.elements[this.styleKey];
    let {spriteWidth, spriteHeight} = getSpriteData(this.spriteKey, gD);
    if (!this.selected) {
      drawCanvasRect(this.x, this.y + 55 * this.tabNr, 55, 55, design.rectKey.tab, gD);
      drawCanvasImage(
        this.x + Math.floor((55 - spriteWidth) / 2), 
        this.y + 55 * this.tabNr + Math.floor((55 - spriteHeight) / 2), this.spriteKey, gD
      );
      drawCanvasRect(this.x, this.y + 55 * this.tabNr, 55, 55, design.rectKey.inactive, gD);
      drawCanvasRectBorder(this.x, this.y + 55 * this.tabNr, 55, 55, design.borderKey, gD);
    } else {
      drawCanvasRect(this.x, this.y + 55 * this.tabNr, 55, 55, design.rectKey.tab, gD);
      drawCanvasImage(
        this.x + Math.floor((55 - spriteWidth) / 2), 
        this.y + 55 * this.tabNr + Math.floor((55 - spriteHeight) / 2), this.spriteKey, gD
      );
      drawCanvasRect(this.x + 55, this.y, this.width - 55, this.height, design.rectKey.background, gD);
      this.objects.map(object => {
        object.draw(gD, statistics);
      }, this);
      drawCanvasLine(
        this.x + 55, this.y, design.borderKey, gD, this.x + this.width, this.y,
        this.x + this.width, this.y + this.height, this.x + 55, this.y + this.height,
        this.x + 55, this.y + 55 * (this.tabNr + 1), this.x, this.y + 55 * (this.tabNr + 1),
        this.x, this.y + 55 * this.tabNr, this.x + 55, this.y + 55 * this.tabNr,
        this.x + 55, this.y
      );
    }
  };
}

/**
 * an object which uses the data description as headline
 * @param {number} x         the x-coordinate of the top left corner of the headline
 * @param {number} y         the y-coordinate of the top left corner of the headline
 * @param {number} width     the width of the headline
 * @param {number} height    the height of the headline
 * @param {string} key       the key of the statistic data
 * @param {string} styleKey  the style of the headline
 */
function StatisticsHeadline(x, y, width, height, key, styleKey) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.key = key;
  this.styleKey = styleKey;
  /**
   * draws the objects onto the canvas
   */
  this.draw = function(gD, statistics) {
    let design = gD.design.elements[this.styleKey];
    let data = statistics.get(this.key);

    drawCanvasText(this.x + this.width / 2, this.y + 3, data.name, design.textKey.headline, gD);
    drawCanvasText(this.x + 3, this.y + this.height - 3, "Gesamt", design.textKey.label, gD);
    drawCanvasText(this.x + this.width - 3, this.y + this.height - 3, data.currentCount.toString().replace(/\d(?=(\d{3})+($|\.))/g, '$&.'), design.textKey.value, gD);
    drawCanvasLine(
      this.x, this.y + this.height / 4 * 3, design.borderKey, gD,
      this.x, this.y + this.height,
      this.x + this.width, this.y + this.height,
      this.x + this.width, this.y + this.height / 4 * 3
    );
  };
}

/**
 * an object that displays time
 * @param {number} x         the x-coordinate of the top left corner of the time field
 * @param {number} y         the y-coordinate of the top left corner of the time field
 * @param {number} width     the width of the time field
 * @param {number} height    the height of the time field
 * @param {string} key       the key of the statistic data
 * @param {string} styleKey  the style of the time field
 */
function StatisticsTimeField(x, y, width, height, key, styleKey) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.key = key;
  this.styleKey = styleKey;
  /**
   * draws the objects onto the canvas
   */
  this.draw = function(gD, statistics) {
    let design = gD.design.elements[this.styleKey];
    let data = statistics.get(this.key);

    drawCanvasText(this.x + this.width / 2, this.y + this.height * 0.25, data.name, design.textKey.headline, gD);
    drawCanvasText(
      this.x + this.width / 2, this.y + this.height * 0.75,
      addLeadingZero(Math.floor((data.currentCount % 86400) / 3600)) + ":" +
      addLeadingZero(Math.floor((data.currentCount % 3600) / 60)) + ":" +
      addLeadingZero(Math.floor(data.currentCount % 60)), design.textKey.time, gD
    );
    drawCanvasLine(this.x, this.y + this.height / 2, design.borderKey, gD, this.x + this.width, this.y + this.height / 2);
    drawCanvasRectBorder(this.x, this.y, this.width, this.height, design.borderKey, gD);
  };
}

/**
 * an object that displays a distance using an earth and a moon
 * @param {number} x         the x-coordinate of the top left corner of the distance field
 * @param {number} y         the y-coordinate of the top left corner of the distance field
 * @param {number} width     the width of the distance field
 * @param {number} height    the height of the distance field
 * @param {string} key       the key of the statistic data
 * @param {string} styleKey  the style of the distance field
 */
function StatisticsDistanceField(x, y, width, height, key, styleKey) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.key = key;
  this.styleKey = styleKey;
  /**
   * draws the objects onto the canvas
   */
  this.draw = function(gD, statistics) {
    let design = gD.design.elements[this.styleKey];
    let data = statistics.get(this.key);
    let earth = getSpriteData("Icon_Earth", gD);
    let moon = getSpriteData("Icon_Moon", gD);
    let player = getSpriteData("Player_Standard", gD);

    drawCanvasLine(this.x + 25, this.y + 25, design.borderKey.travel, gD, this.x + this.width - 25, this.y + 25);
    drawCanvasImage(this.x + (50 - earth.spriteWidth) / 2, this.y + (50 - earth.spriteHeight) / 2, "Icon_Earth", gD);
    drawCanvasImage(this.x + this.width - 50 + (50 - moon.spriteWidth) / 2, this.y + (50 - moon.spriteHeight) / 2, "Icon_Moon", gD);
    drawCanvasImage(this.x + (50 - player.spriteWidth) / 2 + Math.min(Math.floor((data.currentCount / 384400000) * (this.width - 50)), (this.width - 50)), this.y + (50 - player.spriteHeight) / 2, "Player_Standard", gD);
    drawCanvasText(this.x + 3, this.y + this.height - 3, data.name, design.textKey.label, gD);
    drawCanvasText(this.x + this.width - 3, this.y + this.height - 3, data.currentCount.toString().replace(/\d(?=(\d{3})+($|\.))/g, '$&.'), design.textKey.number, gD);
    drawCanvasLine(this.x, this.y + this.height - 10, design.borderKey.border, gD, this.x, this.y + this.height, this.x + this.width, this.y + this.height, this.x + this.width, this.y + this.height - 10);
  };
}

/**
 * an object for displaying item numbers
 * @param {number} x         the x-coordinate of the top left corner of the item field
 * @param {number} y         the y-coordinate of the top left corner of the item field
 * @param {number} width     the width of the item field
 * @param {number} height    the height of the item field
 * @param {string} key       the key of the statistic data
 * @param {string} styleKey  the style of the item field
 * @param {string} spriteKey a key for a sprite that should be used
 */
function StatisticsItemField(x, y, width, height, key, styleKey, spriteKey = null) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.key = key;
  this.styleKey = styleKey;
  this.spriteKey = spriteKey;
  /**
   * draws the objects onto the canvas
   */
  this.draw = function(gD, statistics) {
    let design = gD.design.elements[this.styleKey];
    let data = statistics.get(this.key);

    if (this.spriteKey !== null) {
      let {spriteHeight} = getSpriteData(this.spriteKey, gD);
      drawCanvasImage(this.x + 3, this.y + Math.floor((this.height - spriteHeight) / 2), this.spriteKey, gD);
    } else {
      drawCanvasText(this.x + 3, this.y + this.height - 3, data.name, design.textKey.label, gD);
    }
    drawCanvasText(this.x + this.width - 3, this.y + this.height - 3, data.currentCount.toString().replace(/\d(?=(\d{3})+($|\.))/g, '$&.'), design.textKey.number, gD);
    drawCanvasLine(this.x, this.y + this.height / 2, design.borderKey, gD, this.x, this.y + this.height, this.x + this.width, this.y + this.height, this.x + this.width, this.y + this.height / 2);
  };
}

/**
 * an object to display money statistics
 * @param {number} x         the x-coordinate of the top left corner of the money field
 * @param {number} y         the y-coordinate of the top left corner of the money field
 * @param {number} width     the width of the money field
 * @param {number} height    the height of the money field
 * @param {string} key       the key of the statistic data
 * @param {string} styleKey  the style of the money field
 * @param {string} spriteKey a key for a sprite that should be used
 */
function StatisticsMoneyField(x, y, width, height, key, styleKey, spriteKey) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.key = key;
  this.styleKey = styleKey;
  this.spriteKey = spriteKey;
  /**
   * draws the objects onto the canvas
   */
  this.draw = function(gD, statistics) {
    let design = gD.design.elements[this.styleKey];
    let {spriteHeight} = getSpriteData(this.spriteKey, gD);
    let data = statistics.get(this.key);
    let value = data.currentCount;

    switch (this.key) {
      case "money_1_collected":
        value = 0;
        for (let e in data.currentValues) {
          if (data.currentValues.hasOwnProperty(e)) {
            value += e * data.currentValues[e];
          }
        }
        break;
      case "money_10_collected":
        value = 0;
        for (let e in data.currentValues) {
          if (data.currentValues.hasOwnProperty(e)) {
            value += e * data.currentValues[e] * 10;
          }
        }
        break;
      case "money_100_collected":
        value = 0;
        for (let e in data.currentValues) {
          if (data.currentValues.hasOwnProperty(e)) {
            value += e * data.currentValues[e] * 100;
          }
        }
        break;
      case "money_1000_collected":
        value = 0;
        for (let e in data.currentValues) {
          if (data.currentValues.hasOwnProperty(e)) {
            value += e * data.currentValues[e] * 1000;
          }
        }
        break;
      default:
    }
    value = value / statistics.get("money_collected").currentCount * 100;
    if (isNaN(value)) {
      value = 0;
    }
    
    drawCanvasText(this.x + 3, this.y + this.height - 3, data.name, design.textKey.label, gD);
    drawCanvasText(
      this.x + this.width - 225, this.y + this.height - 3, value.toFixed(2) + "%", design.textKey.number, gD
    );
    drawCanvasRect(this.x + this.width - 220, this.y, 220, this.height, design.rectKey, gD);
    drawCanvasText(
      this.x + this.width - 3, this.y + this.height - 3,
      Math.floor(data.currentCount).toString().replace(/\d(?=(\d{3})+($|\.))/g, '$&.'), design.textKey.number, gD
    );
    drawCanvasImage(this.x + this.width - 218, this.y + (this.height - spriteHeight) / 2, this.spriteKey, gD);
    drawCanvasRectBorder(this.x + this.width - 220, this.y, 220, this.height, design.borderKey, gD);
    drawCanvasLine(
      this.x, this.y + this.height / 2, design.borderKey, gD,
      this.x, this.y + this.height, this.x + this.width, this.y + this.height
    );
    drawCanvasLine(
      this.x + this.width - 279, this.y + this.height / 2, design.borderKey, gD,
      this.x + this.width - 279, this.y + this.height
    );
  };
}

/**
 * an object to display money statistics with rainbow text
 * @param {number} x         the x-coordinate of the top left corner of the money field
 * @param {number} y         the y-coordinate of the top left corner of the money field
 * @param {number} width     the width of the money field
 * @param {number} height    the height of the money field
 * @param {string} key       the key of the statistic data
 * @param {string} styleKey  the style of the money field
 * @param {string} spriteKey a key for a sprite that should be used
 */
function StatisticsMoneyRainbowField(x, y, width, height, key, styleKey, spriteKey) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.key = key;
  this.styleKey = styleKey;
  this.spriteKey = spriteKey;
  this.rainbowText = null;
  /**
   * initiates the object
   */
  this.init = function(statistics) {
    this.rainbowText = new CanvasRainbowText(
      this.x + 3, this.y + this.height / 2, statistics.get(this.key).name, "rainbowLeft"
    );
  };
  /**
   * updates the rainbow text
   */
  this.update = function() {
    this.rainbowText.update();
  };
  /**
   * draws the objects onto the canvas
   */
  this.draw = function(gD, statistics) {
    let design = gD.design.elements[this.styleKey];
    let {spriteHeight} = getSpriteData(this.spriteKey, gD);
    let data = statistics.get(this.key);
    let value = data.currentCount / statistics.get("money_collected").currentCount * 100;
    if (isNaN(value)) {
      value = 0;
    }

    this.rainbowText.draw(gD);
    drawCanvasText(
      this.x + this.width - 225, this.y + this.height - 3, value.toFixed(2) + "%", design.textKey.number, gD
    );
    drawCanvasRect(this.x + this.width - 220, this.y, 220, this.height, design.rectKey, gD);
    drawCanvasText(
      this.x + this.width - 3, this.y + this.height - 3,
      data.currentCount.toString().replace(/\d(?=(\d{3})+($|\.))/g, '$&.'), design.textKey.number, gD
    );
    drawCanvasImage(this.x + this.width - 218, this.y + (this.height - spriteHeight) / 2, this.spriteKey, gD);
    drawCanvasRectBorder(this.x + this.width - 220, this.y, 220, this.height, design.borderKey, gD);
    drawCanvasLine(
      this.x, this.y + this.height / 2, design.borderKey, gD,
      this.x, this.y + this.height, this.x + this.width, this.y + this.height
    );
    drawCanvasLine(
      this.x + this.width - 279, this.y + this.height / 2, design.borderKey, gD,
      this.x + this.width - 279, this.y + this.height
    );
  };
}

/**
 * an object for comparing values and a visual representation
 * @param {number}        x        the x-coordinate of the top left corner of the money field
 * @param {number}        y        the y-coordinate of the top left corner of the money field
 * @param {number}        width    the width of the money field
 * @param {number}        height   the height of the money field
 * @param {string}        mainKey  the key with which the values should be compared
 * @param {Array<string>} keys     an array of string
 * @param {string}        styleKey the style of the money field
 */
function StatisticsBar(x, y, width, height, mainKey, keys, styleKey) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.mainKey = mainKey;
  this.keys = keys;
  this.styleKey = styleKey;
  this.widths = [];
  /**
   * update moving objects
   */
  this.update = function(statistics) {
    this.keys.map((key, index) => {
      let value = statistics.get(key).currentCount;
      let data = statistics.get(key);
      switch (key) {
        case "money_1_collected":
          value = 0;
          for (let e in data.currentValues) {
            if (data.currentValues.hasOwnProperty(e)) {
              value += e * data.currentValues[e];
            }
          }
          break;
        case "money_10_collected":
          value = 0;
          for (let e in data.currentValues) {
            if (data.currentValues.hasOwnProperty(e)) {
              value += e * data.currentValues[e] * 10;
            }
          }
          break;
        case "money_100_collected":
          value = 0;
          for (let e in data.currentValues) {
            if (data.currentValues.hasOwnProperty(e)) {
              value += e * data.currentValues[e] * 100;
            }
          }
          break;
        case "money_1000_collected":
          value = 0;
          for (let e in data.currentValues) {
            if (data.currentValues.hasOwnProperty(e)) {
              value += e * data.currentValues[e] * 1000;
            }
          }
          break;
        default:
      }
      this.widths[index] = value / statistics.get(this.mainKey).currentCount * this.width;
    }, this);
  };
  /**
   * draws the objects onto the canvas
   */
  this.draw = function(gD) {
    let design = gD.design.elements[this.styleKey];
    let newX = this.x;

    this.widths.map((width, index) => {
      if (!isNaN(width)) {
        drawCanvasRect(newX, this.y, width, this.height, design.rectKey[index.toString()], gD);
        newX += width;
      }
    }, this);
    drawCanvasRectBorder(this.x, this.y, this.width, this.height, design.borderKey, gD);
  };
}

/**
 * an object for comparing values and a visual representation
 * @param {number}        x        the x-coordinate of the top left corner of the money field
 * @param {number}        y        the y-coordinate of the top left corner of the money field
 * @param {number}        width    the width of the money field
 * @param {number}        height   the height of the money field
 * @param {string}        mainKey  the key with which the values should be compared
 * @param {Array<string>} keys     an array of string
 * @param {string}        styleKey the style of the money field
 */
function StatisticsLine(x, y, width, height, mainKey, keys, styleKey) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.mainKey = mainKey;
  this.keys = keys;
  this.styleKey = styleKey;
  this.heights = [];
  /**
   * update moving objects
   */
  this.update = function(statistics) {
    this.keys.map((key, index) => {
      let value = statistics.get(key).currentCount;
      switch (key) {
        case "money_10_collected":
          value *= 10;
          break;
        case "money_100_collected":
          value *= 100;
          break;
        case "money_1000_collected":
          value *= 1000;
          break;
        default:
      }
      this.heights[index] = value / statistics.get(this.mainKey).currentCount * this.height;
    }, this);
  };
  /**
   * draws the objects onto the canvas
   */
  this.draw = function(gD) {
    let design = gD.design.elements[this.styleKey];
    let newY = this.y;

    this.heights.map((height, index) => {
      if (!isNaN(height)) {
        drawCanvasRect(this.x, newY, this.width, height, design.rectKey[index.toString()], gD);
        newY += height;
      }
    }, this);
    drawCanvasRectBorder(this.x, this.y, this.width, this.height, design.borderKey, gD);
  };
}
