function Achievements(menu, gD) {
  this.menu = menu;
  this.gD = gD;
  this.achievementList = [
    new AchievementData(
      "Haste mal n Hype?", ["Sammle den ersten Hype", ""],
      1, AchievementEventKeys.COLLECT_HYPE, false, "collect_first_hype"
    ),
    new AchievementData(
      "Gold!? Ich bin reich!!!", ["Sammle die erste Schatztruhe", ""],
      1, AchievementEventKeys.COLLECT_TREASURE, false, "collect_first_treasure"
    ),
    new AchievementData(
      "Er kann fliegen", ["Entdecke den Doppelsprung", ""],
      1, AchievementEventKeys.DO_DOUBLE_JUMP, false, "use_first_double_jump"
    ),
    new AchievementData(
      "$$$$", ["Sammle den ersten 1000 Hype Schein", ""],
      1, AchievementEventKeys.COLLECT_1000_HYPE, false, "collect_first_1000_hype"
    ),
    new AchievementData(
      "Matrix", ["Benutze 5 Stoppuhren in einer Runde", ""],
      5, AchievementEventKeys.USE_STOPWATCH, true, "use_five_stopwatches"
    ),
    new AchievementData(
      "Unverwundbar", ["Benutze 5 Sterne in einer Runde", ""],
      5, AchievementEventKeys.USE_STAR, true, "use_five_stars"
    ),
    new AchievementData(
      "Federleicht", ["Benutze 5 Federn in einer Runde", ""],
      5, AchievementEventKeys.USE_FEATHER, true, "use_five_feathers"
    ),
    new AchievementData(
      "Lucky No5", ["Benutze 5 Schatzkisten in einer Runde", ""],
      5, AchievementEventKeys.USE_TREASURE, true, "use_five_treasures"
    ),
    new AchievementData(
      "Supermagnet", ["Benutze 5 Magnete in einer Runde", ""],
      5, AchievementEventKeys.USE_MAGNET, true, "use_five_magnets"
    ),
    new AchievementData(
      "Rocketboy", ["Benutze 5 Raketen in einer Runde", ""],
      5, AchievementEventKeys.USE_ROCKET, true, "use_five_rockets"
    ),
    new AchievementData(
      "Infinite Power", ["Benutze alle Items gleichzeitig", ""],
      1, AchievementEventKeys.USE_ALL_ITEMS_AT_ONCE, true, "use_all_items_at_once"
    ),
    new AchievementData(
      "Verlangsamung", ["Verlangsame die Zeit für insgesamt", "eine Stunde oder 3.600 Sekunden"],
      3600, AchievementEventKeys.END_OF_ROUND_TOTAL_SLOWED_TIME, false, "slow_1_hour"
    ),
    new AchievementData(
      "Outta Space", ["Verlasse 100 Mal die Spielfläche", ""],
      100, AchievementEventKeys.JUMP_OUT_OF_BOUNDS, false, "100_jumps_out_of_bounds"
    ),
    new AchievementData(
      "Tagelöhner", ["Sammle 100 Hype in einer Runde", ""],
      100, AchievementEventKeys.COLLECT_HYPE, true, "collect_100_hype"
    ),
    new AchievementData(
      "Ein neuer PC", ["Sammle 2.000 Hype in einer Runde", ""],
      2000, AchievementEventKeys.COLLECT_HYPE, true, "collect_2000_hype"
    ),
    new AchievementData(
      "It's over 9000!!", ["Sammle 9.001 Hype in einer Runde", ""],
      9001, AchievementEventKeys.COLLECT_HYPE, true, "collect_9001_hype"
    ),
    new AchievementData(
      "24K Magic", ["Sammle 24.000 Hype in einer Runde", ""],
      24000, AchievementEventKeys.COLLECT_HYPE, true, "collect_24000_hype"
    ),
    new AchievementData(
      "1000m Sprint", ["Lege eine Distanz von 1.000m", "in einer Runde zurück"],
      1000, AchievementEventKeys.END_OF_ROUND_TOTAL_TRAVELLED_DISTANCE, true, "travel_1000_in_one_round"
    ),
    new AchievementData(
      "5Km Rennen", ["Lege eine Distanz von 5.000m", "in einer Runde zurück"],
      5000, AchievementEventKeys.END_OF_ROUND_TOTAL_TRAVELLED_DISTANCE, true, "travel_5000_in_one_round"
    ),
    new AchievementData(
      "Ausdauerprofi", ["Lege eine Distanz von 10.000m", "in einer Runde zurück"],
      10000, AchievementEventKeys.END_OF_ROUND_TOTAL_TRAVELLED_DISTANCE, true, "travel_10000_in_one_round"
    ),
    new AchievementData(
      "Geisterfahrer", ["Lege insgesamt 5.000m in die", "falsche Richtung zurück"],
      5000, AchievementEventKeys.END_OF_ROUND_TOTAL_REVERSE_DISTANCE, false, "travel_5000_reverse"
    ),
    new AchievementData(
      "Flummi", ["Springe insgesamt 100.000 Mal", ""],
      100000, AchievementEventKeys.DO_JUMP, false, "jump_100000"
    ),
    new AchievementData(
      "In letzter Sekunde", ["Setze einen Stern ein,", "kurz bevor du die Lava berührst"],
      1, AchievementEventKeys.STAR_BEFORE_LAVA, false, "star_before_lava"
    ),
    new AchievementData(
      "Upgrade", ["Level ein Item", ""],
      1, AchievementEventKeys.LVL_ITEM, false, "lvl_item"
    ),
    new AchievementData(
      "To the Max", ["Level ein Item auf das Maximum", ""],
      1, AchievementEventKeys.LVL_ITEM_MAX, false, "lvl_one_item_max"
    ),
    new AchievementData(
      "Maximize", ["Level alle Items auf das Maximum", ""],
      5, AchievementEventKeys.LVL_ITEM_MAX, false, "lvl_all_items_max"
    ),
    new AchievementData(
      "YOU DIED", ["Sterbe 1.000 Mal", ""],
      1000, AchievementEventKeys.DEATH, false, "die_1000"
    ),
    new AchievementData(
      "Gutverdiener", ["Sammle insgesamt 1.000.000 Hype", ""],
      1000000, AchievementEventKeys.COLLECT_HYPE, false, "collect_1000000_hype"
    ),
    new AchievementData(
      "Endlich reich", ["Besitze 1.000.000 Hype", ""],
      1000000, AchievementEventKeys.SET_OWNED_HYPE, false, "own_1000000_hype"
    ),
    new AchievementData(
      "I would walk 500 Miles", ["Lege eine gesamte Distanz von", "804.672m zurück"],
      804672, AchievementEventKeys.END_OF_ROUND_TOTAL_TRAVELLED_DISTANCE, false, "travel_one_mile"
    ),
    new AchievementData(
      "Glücksbringer", ["Sammle das erste goldene Kleeblatt", ""],
      1, AchievementEventKeys.COLLECT_GOLDEN_SHAMROCK, false, "collect_first_golden_shamrock"
    ),
    new AchievementData(
      "Wow, so viel Glück", ["Sammle 25 goldene Kleeblätter", ""],
      25, AchievementEventKeys.COLLECT_GOLDEN_SHAMROCK, false, "collect_25_golden_shamrocks"
    ),
    new AchievementData(
      "50:50", ["Sammle 50 goldene Kleeblätter", ""],
      50, AchievementEventKeys.COLLECT_GOLDEN_SHAMROCK, false, "collect_50_golden_shamrocks"
    ),
    new AchievementData(
      "Für immer Glück", ["Sammle 100 goldene Kleeblätter", ""],
      100, AchievementEventKeys.COLLECT_GOLDEN_SHAMROCK, false, "collect_100_golden_shamrocks"
    )
  ];

  this.init = function() {
    this.title = new CanvasText(this.gD.canvas.width / 2, 30, "Achievements", "pageTitle");

    this.buttonStartTop = 70;
    this.buttonStartLeft = 20;
    this.buttonHeight = 50;
    this.buttonWidth = 50;
    this.buttonPadding = 10;
    this.buttonsPerRow = 10;
    this.bigAchievementBoxLeft = this.buttonStartLeft + (this.buttonWidth + this.buttonPadding) * this.buttonsPerRow;

    this.achievementBox = new AchievementBox(
      this.bigAchievementBoxLeft, 70,
      this.gD.canvas.width - this.bigAchievementBoxLeft - this.buttonStartLeft, 230,
      20, 75, 30
    );

    var buttons = this.achievementList
      .map((element, index) => {
        return index % this.buttonsPerRow === 0 ? this.achievementList.slice(index, index + this.buttonsPerRow) : null;
      })
      .filter(element => element != null)
      .map((rowButtons, rowIndex) => {
        return rowButtons.map((achievementData, columnIndex) => {
          return {
            button: new CanvasImageButton(
              this.buttonStartLeft + (this.buttonWidth + this.buttonPadding) * columnIndex,
              this.buttonStartTop + (this.buttonHeight + this.buttonPadding) * rowIndex,
              this.buttonWidth, this.buttonHeight,
              "Reward_" + achievementData.getSpriteKey(), "menu"
            ),
            selected: (gD) => {this.achievementBox.setData(achievementData)}
          };
        })
      })
    ;

    var backToMenuWidth = 200;
    var backToMenuHeight = 30;
    var backButton = {
      button: new CanvasButton(
        (this.gD.canvas.width - backToMenuWidth) / 2, this.gD.canvas.height - 10 - backToMenuHeight,
        backToMenuWidth, backToMenuHeight,
        "Main Menu", "menu"
      ),
      action: gD => {gD.currentPage = this.menu}
    };

    this.menuController = new MenuController(this.menu);
    this.menuController.setNewGrids(buttons, [[backButton]]);
  };
  /**
   * checks if a button is pressed
   */
  this.updateKeyPresses = function() {
    this.gD.newKeys.map(key => {
      this.menuController.updateKeyPresses(key, this.gD);
    }, this);
  };
  /**
   * checks if the mouse was moved
   */
  this.updateMouseMoves = function() {
    this.menuController.updateMouseMoves(this.gD);
  };
  /**
   * checks if there was a click
   */
  this.updateClick = function() {
    var clickPos = this.gD.clicks.pop();
    if (clickPos) {
      this.menuController.updateClick(clickPos, this.gD);
    }
  };
  /**
   * checks if the wheel was moved
   */
  this.updateWheelMoves = function() {
    /* unused */
  };
  /**
   * updates moving objects in menu
   */
  this.update = function() {
    /* unused */
  };
  /**
   * draws the screen onto the canvas
   */
  this.draw = function(ghostFactor) {
    this.gD.context.drawImage(this.menu.backgroundImage, 0, 0);
    this.title.draw(this.gD);
    this.menuController.draw(this.gD);
    this.achievementBox.draw(this.gD);
  };

  /**
   * reset applicable achievements to count from a fresh start at the start of a new round
   */
  this.resetAtRoundStart = function() {
    this.achievementList.map(achievement => achievement.resetAtRoundStart());
  };
  /**
   * handle updates of achievement values for game-events
   * @param {AchievementEventKeys} eventKey the game-event which happened (i.e. END_OF_ROUND_TOTAL_TRAVELLED_DISTANCE)
   * @param {number} addedValue respective value of the game-event (i.e. 1700) or defaults to 1 in case of a simple
   * event without a value (i.e. for USE_STOPWATCH)
   */
  this.handleEvent = function(eventKey, addedValue = 1) {
    this.achievementList.map(achievement => achievement.handleEvent(eventKey, addedValue));
    this.gD.save.achievements = this.getSaveData();
  };

  /**
   * set the achievement values from a saved state
   * @param {Array<[boolean, number]>} dataList
   */
  this.setSaveData = function(dataList) {
    dataList.map((data, i) => this.achievementList[i].setSaveData(data))
  };
  /**
   * get the achievement values to persist them as a saved state
   * @returns {Array<[boolean, number]>}
   */
  this.getSaveData = function () {
    return this.achievementList.map(achievement => achievement.getSaveData());
  };
}

/**
 * A game-event for which achievement values can be affected
 * @enum {string}
 */
const AchievementEventKeys = {
  COLLECT_HYPE: "COLLECT_HYPE",
  COLLECT_1000_HYPE: "COLLECT_1000_HYPE",
  COLLECT_TREASURE: "COLLECT_TREASURE",
  COLLECT_GOLDEN_SHAMROCK: "COLLECT_GOLDEN_SHAMROCK",
  DO_JUMP: "DO_JUMP",
  DO_DOUBLE_JUMP: "DO_DOUBLE_JUMP",
  USE_STOPWATCH: "USE_STOPWATCH",
  USE_FIVE_STARS: "USE_FIVE_STARS",
  USE_FEATHER: "USE_FEATHER",
  USE_TREASURE: "USE_TREASURE",
  USE_MAGNET: "USE_MAGNET",
  USE_ROCKET: "USE_ROCKET",
  USE_ALL_ITEMS_AT_ONCE: "USE_ALL_ITEMS_AT_ONCE",
  JUMP_OUT_OF_BOUNDS: "JUMP_OUT_OF_BOUNDS",
  STAR_BEFORE_LAVA: "STAR_BEFORE_LAVA",
  DEATH: "DEATH",
  END_OF_ROUND_TOTAL_SLOWED_TIME: "END_OF_ROUND_TOTAL_SLOWED_TIME",
  END_OF_ROUND_TOTAL_TRAVELLED_DISTANCE: "END_OF_ROUND_TOTAL_TRAVELLED_DISTANCE",
  END_OF_ROUND_TOTAL_REVERSE_DISTANCE: "END_OF_ROUND_TOTAL_REVERSE_DISTANCE",
  SET_OWNED_HYPE: "SET_OWNED_HYPE",
  LVL_ITEM: "LVL_ITEM",
  LVL_ITEM_MAX: "LVL_ITEM_MAX"
};

function AchievementData(name, descriptionLines, neededCount, eventKey, isResetPerRound, spriteKey) {
  this.name = name;
  this.descriptionLines = descriptionLines;
  this.neededCount = neededCount;
  this.eventKey = eventKey;
  this.isResetPerRound = isResetPerRound;
  this.spriteKey = spriteKey;
  this.currentCount = 0;
  this.isUnlocked = false;

  this.resetAtRoundStart = function() {
    if (this.isResetPerRound) {
      this.currentCount = 0;
    }
  };
  this.handleEvent = function(eventKey, addedValue = 1) {
    if (!this.isUnlocked && this.eventKey === eventKey) {
      this.currentCount += addedValue;
      if (this.currentCount >= this.neededCount) {
        this.isUnlocked = true;
      }
    }
  };

  this.setSaveData = function(data) {
    [this.isUnlocked, this.currentCount] = data;
  };
  this.getSaveData = function () {
    return [this.isUnlocked, this.currentCount];
  };

  this.getSpriteKey = function() {
    return this.isUnlocked ? this.spriteKey : "locked";
  }
}


function AchievementBox(x, y, width, height, padding, imageSize, progressHeight) {
  var centerX = x + width / 2;
  this.backgroundRect = new CanvasRect(x, y, width, height, "standard");
  this.border = new CanvasBorder(x, y, width, height, "standard");
  this.image = new CanvasImage(
    x + (width - imageSize) / 2, y + padding,
    "Special_PlaceHolder_B"
  );
  this.name = new CanvasText(
    centerX, y + imageSize + padding * 2,
    "", "normal"
  );
  this.descriptionLine1 = new CanvasText(
    centerX, y + imageSize + 7 + padding * 3,
    "", "small"
  );
  this.descriptionLine2 = new CanvasText(
    centerX, y + imageSize + 7 + 14 + padding * 3,
    "", "small"
  );
  this.progress = new ProgressBar(
    x + padding, y + height - padding - progressHeight,
    width - padding * 2, progressHeight
  );
  /**
   * @param {AchievementData} data
   */
  this.setData = function(data) {
    this.image.spriteKey = "Reward_B_" + data.getSpriteKey();
    this.name.text = data.name;
    this.descriptionLine1.text = data.descriptionLines[0];
    this.descriptionLine2.text = data.descriptionLines[1];
    this.progress.current = data.currentCount;
    this.progress.goal = data.neededCount;
  };

  this.draw = function(gD) {
    this.backgroundRect.draw(gD);
    this.image.draw(gD);
    this.name.draw(gD);
    this.descriptionLine1.draw(gD);
    this.descriptionLine2.draw(gD);
    this.progress.draw(gD);
    this.border.draw(gD);
  };
}

function ProgressBar(x, y, width, height, fontSize, fontFamily, goal) {
  this.width = width;
  this.goal = goal;
  this.current = 0;
  this.text = new CanvasText(x + width / 2, y + height / 2, "", "normal");
  this.backgroundRect = new CanvasRect(x, y, width, height, "modal");
  this.foregroundRect = new CanvasRect(x, y, 0, height, "progress");

  this.draw = function(gD) {
    this.text.text = `${this.current} / ${this.goal}`;
    this.foregroundRect.width = width * (this.current / this.goal);
    this.backgroundRect.draw(gD);
    this.foregroundRect.draw(gD);
    this.text.draw(gD);
  };
}
