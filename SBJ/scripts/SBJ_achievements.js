function Achievements(menu, gD) {
  this.menu = menu;
  this.gD = gD;
  this.achievementList = [
    new AchievementData(
      "Haste mal n Hype?", ["Sammle den ersten Hype", ""],
      1, Events.COLLECT_HYPE, false, false, "collect_first_hype"
    ),
    new AchievementData(
      "$$$$", ["Sammle den ersten 1000 Hype Schein", ""],
      1, Events.COLLECT_1000_HYPE, false, false, "collect_first_1000_hype"
    ),
    new AchievementData(
        "Er kann fliegen", ["Entdecke den Doppelsprung", ""],
        1, Events.DO_DOUBLE_JUMP, false, false, "use_first_double_jump"
    ),
    new AchievementData(
        "Gold!? Ich bin reich!!!", ["Sammle die erste Schatztruhe", ""],
        1, Events.COLLECT_TREASURE, false, false, "collect_first_treasure"
    ),
    new AchievementData(
      "Matrix", ["Benutze 5 Stoppuhren in einer Runde", ""],
      5, Events.USE_STOPWATCH, false, true, "use_five_stopwatches"
    ),
    new AchievementData(
      "Unverwundbar", ["Benutze 5 Sterne in einer Runde", ""],
      5, Events.USE_STAR, false, true, "use_five_stars"
    ),
    new AchievementData(
      "Federleicht", ["Benutze 5 Federn in einer Runde", ""],
      5, Events.USE_FEATHER, false, true, "use_five_feathers"
    ),
    new AchievementData(
      "Lucky No5", ["Benutze 5 Schatzkisten in einer Runde", ""],
      5, Events.USE_TREASURE, false, true, "use_five_treasures"
    ),
    new AchievementData(
      "Supermagnet", ["Benutze 5 Magnete in einer Runde", ""],
      5, Events.USE_MAGNET, false, true, "use_five_magnets"
    ),
    new AchievementData(
      "Rocketboy", ["Benutze 5 Raketen in einer Runde", ""],
      5, Events.USE_ROCKET, false, true, "use_five_rockets"
    ),
    new AchievementData(
      "Infinite Power", ["Benutze alle Items gleichzeitig", ""],
      6, Events.USE_ALL_ITEMS_AT_ONCE, true, false, "use_all_items_at_once"
    ),
    new AchievementData(
      "Verlangsamung", ["Verlangsame die Zeit für insgesamt", "eine Stunde oder 3.600 Sekunden"],
      3600, Events.SLOWED_TIME, false, false, "slow_1_hour"
    ),
    new AchievementData(
      "Outta Space", ["Verlasse 100 Mal die Spielfläche", ""],
      100, Events.JUMP_OUT_OF_BOUNDS, false, false, "100_jumps_out_of_bounds"
    ),
    new AchievementData(
      "Tagelöhner", ["Sammle 100 Hype in einer Runde", ""],
      100, Events.COLLECT_HYPE, false, true, "collect_100_hype"
    ),
    new AchievementData(
      "Ein neuer PC", ["Sammle 2.000 Hype in einer Runde", ""],
      2000, Events.COLLECT_HYPE, false, true, "collect_2000_hype"
    ),
    new AchievementData(
      "It's over 9000!!", ["Sammle 9.001 Hype in einer Runde", ""],
      9001, Events.COLLECT_HYPE, false, true, "collect_9001_hype"
    ),
    new AchievementData(
      "24k Magic", ["Sammle 24.000 Hype in einer Runde", ""],
      24000, Events.COLLECT_HYPE, false, true, "collect_24000_hype"
    ),
    new AchievementData(
      "1000m Sprint", ["Lege eine Distanz von 1.000m", "in einer Runde zurück"],
      1000, Events.END_OF_ROUND_TOTAL_TRAVELLED_DISTANCE, true, false, "travel_1000_in_one_round"
    ),
    new AchievementData(
      "5Km Rennen", ["Lege eine Distanz von 5.000m", "in einer Runde zurück"],
      5000, Events.END_OF_ROUND_TOTAL_TRAVELLED_DISTANCE, true, false, "travel_5000_in_one_round"
    ),
    new AchievementData(
      "Ausdauerprofi", ["Lege eine Distanz von 10.000m", "in einer Runde zurück"],
      10000, Events.END_OF_ROUND_TOTAL_TRAVELLED_DISTANCE, true, false, "travel_10000_in_one_round"
    ),
    new AchievementData(
      "Flummi", ["Springe insgesamt 100.000 Mal", ""],
      100000, Events.DO_JUMP, false, false, "jump_100000"
    ),
    new AchievementData(
      "In letzter Sekunde", ["Setze einen Stern ein,", "kurz bevor du die Lava berührst"],
      1, Events.STAR_BEFORE_LAVA, false, false, "star_before_lava"
    ),
    new AchievementData(
      "Upgrade", ["Level ein Item", ""],
      1, Events.LVL_ITEM, false, false, "lvl_item"
    ),
    new AchievementData(
      "To the Max", ["Level ein Item auf das Maximum", ""],
      100, Events.LVL_ITEM_MAX, true, false, "lvl_one_item_max"
    ),
    new AchievementData(
      "Maximize", ["Level alle Items auf das Maximum", ""],
      600, Events.LVL_ITEM, false, false, "lvl_all_items_max"
    ),
    new AchievementData(
      "YOU DIED", ["Sterbe 1.000 Mal", ""],
      1000, Events.DEATH, false, false, "die_1000"
    ),
    new AchievementData(
      "Gutverdiener", ["Sammle insgesamt 1.000.000 Hype", ""],
      1000000, Events.COLLECT_HYPE, false, false, "collect_1000000_hype"
    ),
    new AchievementData(
      "Endlich reich", ["Besitze 1.000.000 Hype", ""],
      1000000, Events.SET_OWNED_HYPE, true, false, "own_1000000_hype"
    ),
    new AchievementData(
      "I would walk 500 Miles", ["Lege eine gesamte Distanz von", "804.672m zurück"],
      804672, Events.END_OF_ROUND_TOTAL_TRAVELLED_DISTANCE, false, false, "travel_one_mile"
    ),
    new AchievementData(
      "Glücksbringer", ["Sammle das erste goldene Kleeblatt", ""],
      1, Events.COLLECT_GOLDEN_SHAMROCK, false, false, "collect_first_golden_shamrock"
    ),
    new AchievementData(
      "Wow, so viel Glück", ["Sammle 25 goldene Kleeblätter", ""],
      25, Events.COLLECT_GOLDEN_SHAMROCK, false, false, "collect_25_golden_shamrocks"
    ),
    new AchievementData(
      "50:50", ["Sammle 50 goldene Kleeblätter", ""],
      50, Events.COLLECT_GOLDEN_SHAMROCK, false, false, "collect_50_golden_shamrocks"
    ),
    new AchievementData(
      "Für immer Glück", ["Sammle 100 goldene Kleeblätter", ""],
      100, Events.COLLECT_GOLDEN_SHAMROCK, false, false, "collect_100_golden_shamrocks"
    )
  ];

  this.init = function() {
    this.title = new CanvasText(this.gD.canvas.width / 2, 30, "Achievements", "pageTitle");

    this.buttonStartTop = 60;
    this.buttonStartLeft = 20;
    this.buttonSize = 46;
    this.buttonPadding = 12;
    this.buttonsPerRow = 10;
    this.bigAchievementBoxLeft = this.buttonStartLeft + (this.buttonSize + this.buttonPadding) * this.buttonsPerRow;

    this.achievementBox = new AchievementBox(
      this.bigAchievementBoxLeft, this.buttonStartTop,
      this.gD.canvas.width - this.bigAchievementBoxLeft - this.buttonStartLeft, 220,
      20, 75, 30
    );

    this.buttons = this.achievementList
      .map((element, index) => {
        return index % this.buttonsPerRow === 0 ? this.achievementList.slice(index, index + this.buttonsPerRow) : null;
      }, this)
      .filter(element => element !== null)
      .map((rowButtons, rowIndex) => {
        return rowButtons.map((achievementData, columnIndex) => {
          let imageButton = new CanvasImageButton(
            this.buttonStartLeft + (this.buttonSize + this.buttonPadding) * columnIndex,
            this.buttonStartTop + (this.buttonSize + this.buttonPadding) * rowIndex,
            this.buttonSize, this.buttonSize,
            ["Reward_locked", "Reward_" + achievementData.spriteKey], "menu"
          );
          achievementData.setButton(imageButton);
          return {
            button: imageButton,
            selected: (gD) => {this.achievementBox.setData(achievementData)}
          };
        })
      })
    ;

    let backToMenuWidth = 200;
    this.buttons.push([{
      button: new CanvasButton(
        (this.gD.canvas.width - backToMenuWidth) / 2, this.gD.canvas.height - 50,
        backToMenuWidth, 30,
        "Main Menu", "menu"
      ),
      action: gD => {gD.currentPage = this.menu}
    }]);

    this.menuController = new MenuController(this.menu);
    this.menuController.setNewGrids(this.buttons, []);
    this.achievementNotification = new AchievementNotification(
      this.gD.canvas.width - 200, this.gD.canvas.height + 4, 200, 56, "achievementNotification"
    );
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
    let clickPos = this.gD.clicks.pop();
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
    this.menuController.update();
    this.menu.lightUpdate();
  };
  /**
   * draws the screen onto the canvas
   */
  this.draw = function(ghostFactor) {
    this.gD.context.drawImage(this.menu.backgroundImage, 0, 0);
    this.title.draw(this.gD);
    this.menuController.draw(this.gD);
    this.achievementBox.draw(this.gD);
    this.menu.lightDraw();
  };
  /**
   * handle updates of achievement values for game-events
   * @param {Events} eventKey the game-event which happened (i.e. END_OF_ROUND_TOTAL_TRAVELLED_DISTANCE)
   * @param {number} addedValue respective value of the game-event (i.e. 1700) or defaults to 1 in case of a simple
   * event without a value (i.e. for USE_STOPWATCH)
   */
  this.handleEvent = function(eventKey, addedValue = 1) {
    this.achievementList.map(achievement => achievement.handleEvent(this, eventKey, addedValue), this);
    this.gD.save.achievements = this.getSaveData();
  };

  this.resetPerRound = function() {
    this.achievementList.map(achievement => {
      if (achievement.isResetPerRound) {
        achievement.resetPerRound(this);
      }
    }, this);
    this.gD.save.achievements = this.getSaveData();
  };

  /**
   * set the achievement values from a saved state
   * @param {Array<[boolean, number]>} dataList
   */
  this.setSaveData = function(dataList) {
    dataList.map((data, i) => {
      this.achievementList[i].setSaveData(data);
      if (data[0]) {
        this.achievementList[i].button.setSprite(1);
      }
    }, this);
  };
  /**
   * get the achievement values to persist them as a saved state
   * @returns {Array<[boolean, number]>}
   */
  this.getSaveData = function () {
    return this.achievementList.map(achievement => achievement.getSaveData());
  };
}

function AchievementData(name, descriptionLines, neededCount, eventKey, isFullNumber, isResetPerRound, spriteKey) {
  this.name = name;
  this.descriptionLines = descriptionLines;
  this.neededCount = neededCount;
  this.eventKey = eventKey;
  this.isFullNumber = isFullNumber;
  this.isResetPerRound = isResetPerRound;
  this.spriteKey = spriteKey;
  this.currentCount = 0;
  this.roundCount = 0;
  this.button = null;
  this.isUnlocked = false;
  this.setButton = function(button) {
    this.button = button;
  };
  this.getSpriteKey = function() {
    return this.isUnlocked ? this.spriteKey : "locked";
  };
  this.resetPerRound = function(achievements) {
    if (this.roundCount > this.currentCount) {
      this.currentCount = this.roundCount;
      if (this.currentCount >= this.neededCount) {
        this.isUnlocked = true;
        this.currentCount = this.neededCount;
        achievements.achievementNotification.addAchievement(this);
        this.button.setSprite(1);
      }
    }
    this.roundCount = 0;
  };
  this.handleEvent = function(achievements, eventKey, addedValue = 1) {
    if (!this.isUnlocked && this.eventKey === eventKey) {
      if (this.isResetPerRound) {
        if (this.isFullNumber) {
          if (this.roundCount < +addedValue) {
            this.roundCount = +addedValue;
          }
        } else {
          this.roundCount += +addedValue;
        }
      } else if (this.isFullNumber) {
        if (this.currentCount < +addedValue) {
          this.currentCount = +addedValue;
        }
      } else {
        this.currentCount += +addedValue;
      }
      if (this.currentCount >= this.neededCount) {
        this.isUnlocked = true;
        this.currentCount = this.neededCount;
        achievements.achievementNotification.addAchievement(this);
        this.button.setSprite(1);
      }
    }
  };

  this.setSaveData = function(data) {
    [this.isUnlocked, this.currentCount] = data;
  };
  this.getSaveData = function() {
    return [this.isUnlocked, this.currentCount];
  };
}


function AchievementBox(x, y, width, height, padding, imageSize, progressHeight) {
  this.x = x;
  this.centerX = x + width / 2;
  this.y = y;
  this.width = width;
  this.height = height;
  this.padding = padding;
  this.imageSize = imageSize;
  this.progress = new ProgressBar(
      x + padding, y + height - padding - progressHeight,
      width - padding * 2, progressHeight
  );
  this.currentName = "Placeholder";
  this.currentSpriteKey = "Placeholder";
  this.currentDescriptionLines = ["???", "???"];

  /**
   * @param {AchievementData} data
   */
  this.setData = function(data) {
    this.currentName = data.name;
    this.currentSpriteKey = data.getSpriteKey();
    this.currentDescriptionLines = data.descriptionLines;
    this.progress.current = data.currentCount;
    this.progress.goal = data.neededCount;
  };
  this.draw = function(gD) {
    drawCanvasRect(this.x, this.y, this.width, this.height, "standard", gD);
    drawCanvasImage(
        this.x + (this.width - this.imageSize) / 2, this.y + this.padding,
        "Reward_B_" + this.currentSpriteKey,
        gD
    );
    drawCanvasText(
        this.centerX, this.y + this.imageSize + this.padding * 2,
        this.currentName,
        "normal", gD
    );
    drawCanvasText(
        this.centerX, this.y + this.imageSize + 7 + this.padding * 3,
        this.currentDescriptionLines[0],
        "small", gD
    );
    drawCanvasText(
        this.centerX, this.y + this.imageSize + 7 + 14 + this.padding * 3,
        this.currentDescriptionLines[1],
        "small", gD
    );
    drawCanvasRectBorder(this.x, this.y, this.width, this.height, "standard", gD);
    this.progress.draw(gD);
  };
}

function ProgressBar(x, y, width, height, goal = 0, current = 0) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.goal = goal;
  this.current = current;

  this.draw = function(gD) {
    drawCanvasRect(this.x, this.y, this.width, this.height, "modal", gD);
    drawCanvasRect(this.x, this.y, this.width * (this.current / this.goal), this.height, "progress", gD);
    drawCanvasText(
        this.x + this.width / 2, this.y + this.height / 2,
        `${this.current} / ${this.goal}`,
        "normal", gD
    );
  };
}

function AchievementNotification(x, y, width, height, styleKey) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.styleKey = styleKey;
  this.currentAchievements = [];
  this.timer = 0;
  this.addAchievement = function(achievementData) {
    this.currentAchievements.push(achievementData);
  };
  this.update = function() {
    if (this.timer > 0) {
      if (this.timer > 330) {
        this.y -= 2;
      } else if (this.timer <= 30) {
        this.y += 2;
      }
      this.timer--;
      if (this.timer === 0) {
        this.currentAchievements.splice(0, 1);
      }
    } else if (this.currentAchievements.length > 0) {
      this.timer = 360;
    }
  };
  this.draw = function(gD) {
    let design = gD.design.elements[this.styleKey];
    
    if (this.currentAchievements.length === 0) {
      return;
    }
    
    let iconData = getSpriteData("Reward_" + this.currentAchievements[0].spriteKey, gD);
    
    drawCanvasRect(this.x, this.y, this.width, this.height, design.rectKey.background, gD);
    drawCanvasRect(this.x + 5, this.y + 5, 46, 46, design.rectKey.icon, gD);
    drawCanvasImage(
      this.x + 5 + Math.floor((46 - iconData.spriteWidth) / 2), 
      this.y + 5 + Math.floor((46 - iconData.spriteHeight) / 2), "Reward_" + this.currentAchievements[0].spriteKey, gD
    );
    let name = this.currentAchievements[0].name.split(' ');
    let temp = "";
    let output = [];
    
    name.map(string => {
      if (temp.length + string.length > 19 && temp !== "") {
        output.push(temp);
        temp = "";
        temp += string + " ";
      } else {
        temp += string + " ";
      }
    }, this);
    if (temp !== "") {
      output.push(temp);
    }
    
    output.map((text, index) => {
      drawCanvasText(
        this.x + 56, this.y + (this.height - (output.length - 1) * 13) / 2 + index * 13, text, design.textKey, gD
      );
    }, this);
      
    drawCanvasRectBorder(this.x + 5, this.y + 5, 46, 46, design.borderKey, gD);
    drawCanvasRectBorder(this.x, this.y, this.width, this.height, design.borderKey, gD);
  };
}