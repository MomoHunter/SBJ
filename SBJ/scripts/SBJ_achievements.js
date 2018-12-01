function Achievements(gD, menu) {
  this.gD = gD;
  this.menu = menu;
  this.backgroundImage = new Image();
  this.backgroundImage.src = "img/Titlescreen.png";
  this.achievementDict = {
    "A1" :  ["Haste mal n Hype?", ["Sammle den ersten Hype", ""], 1],
    "A2" :  ["Gold!? Ich bin reich!!!", ["Sammle die erste Schatztruhe", ""], 1],
    "A3" :  ["Er kann fliegen", ["Entdecke den Doppelsprung", ""], 1],
    "A4" :  ["$$$$", ["Sammle den ersten 1000 Hype Schein", ""], 1],
    "A5" :  ["Von allem etwas", ["Benutze jedes Item einmal in einer Runde", ""], 6],
    "A6" :  ["Matrix", ["Benutze 5 Stoppuhren in einer Runde", ""], 5],
    "A7" :  ["Unverwundbar", ["Benutze 5 Sterne in einer Runde", ""], 5],
    "A8" :  ["Federleicht", ["Benutze 5 Federn in einer Runde", ""], 5],
    "A9" :  ["Lucky No5", ["Benutze 5 Schatzkisten in einer Runde", ""], 5],
    "A10" : ["Supermagnet", ["Benutze 5 Magnete in einer Runde", ""], 5],
    "A11" : ["Rocketboy", ["Benutze 5 Raketen in einer Runde", ""], 5],
    "A12" : ["Infinite Power", ["Benutze alle Items gleichzeitig", ""], 6],
    "A13" : ["Verlangsamung", ["Verlangsame die Zeit für insgesamt", "eine Stunde oder 3.600 Sekunden"], 3600],
    "A14" : ["Outta Space", ["Verlasse 100 Mal die Spielfläche", ""], 100],
    "A15" : ["Tagelöhner", ["Sammle 100 Hype in einer Runde", ""], 100],
    "A16" : ["Ein neuer PC", ["Sammle 2.000 Hype in einer Runde", ""], 2000],
    "A17" : ["It's over 9000!!", ["Sammle 9.001 Hype in einer Runde", ""], 9001],
    "A18" : ["24K Magic", ["Sammle 24.000 Hype in einer Runde", ""], 24000],
    "A19" : ["1000m Sprint", ["Lege eine Distanz von 1.000m", "in einer Runde zurück"], 1000],
    "A20" : ["5Km Rennen", ["Lege eine Distanz von 5.000m", "in einer Runde zurück"], 5000],
    "A21" : ["Ausdauerprofi", ["Lege eine Distanz von 10.000m", "in einer Runde zurück"], 10000],
    "A22" : ["Geisterfahrer", ["Lege insgesamt 5.000m in die", "falsche Richtung zurück"], 5000],
    "A23" : ["Flummi", ["Springe insgesamt 100.000 Mal", ""], 100000],
    "A24" : ["In letzter Sekunde", ["Setze einen Stern ein,", "kurz bevor du die Lava berührst"], 1],
    "A25" : ["Upgrade", ["Level ein Item", ""], 1],
    "A26" : ["To the Max", ["Level eine Sache auf das Maximum", ""], 1],
    "A27" : ["Maximize", ["Level alles auf das Maximum", ""], 5],
    "A28" : ["YOU DIED", ["Sterbe 1.000 Mal", ""], 1000],
    "A29" : ["Gutverdiener", ["Sammle insgesamt 1.000.000 Hype", ""], 1000000],
    "A30" : ["Endlich reich", ["Besitze 1.000.000 Hype", ""], 1000000],
    "A31" : ["I would walk 500 Miles", ["Lege eine gesamte Distanz von", "804.672m zurück"], 804672],
    "A32" : ["Glücksbringer", ["Sammle das erste goldene Kleeblatt", ""], 1],
    "A33" : ["Wow, so viel Glück", ["Sammle 25 goldene Kleeblätter", ""], 25],
    "A34" : ["50:50", ["Sammle 50 goldene Kleeblätter", ""], 50],
    "A35" : ["Für immer Glück", ["Sammle 100 goldene Kleeblätter", ""], 100],
    "A36" : ["Achievementhunter", ["Sammle alle anderen Achievements", ""], 35]
  };
  this.achievementValues = new Array(Object.keys(this.achievementDict).length).fill(0);
  this.init = function() {
    this.title = new CanvasText(
      this.gD.canvas.width / 2, 30,
      "32pt", "Showcard Gothic", "rgba(200, 200, 200, 1)",
      "center", "middle",
      "Achievements",
      3
    );

    this.buttonStartTop = 70;
    this.buttonStartLeft = 20;
    this.buttonHeight = 50;
    this.buttonWidth = 50;
    this.buttonPadding = 10;
    this.buttonsPerRow = 10;

    var achievementList = new Array(Object.keys(this.achievementDict).length)
      .fill()
      .map((_, index) => this.achievementDict["A" + (index + 1).toString()] )
    ;
    var buttons = achievementList
      .map((element, index) => {
        return index % this.buttonsPerRow === 0 ? achievementList.slice(index, index + this.buttonsPerRow) : null;
      })
      .filter(element => element != null)
      .map((rowButtons, rowIndex) => {
        return rowButtons.map((achievementData, columnIndex) => {
          return new MenuImageButton(
            this.buttonStartLeft + (this.buttonWidth + this.buttonPadding) * columnIndex,
            this.buttonStartTop + (this.buttonHeight + this.buttonPadding) * rowIndex,
            this.buttonWidth, this.buttonHeight,
            "rgba(255, 255, 255, 1)",
            "Item_Star_0"/* TODO: replace with correct key once the sprites are migrated to the new spritesheet */,
            2,
            null, [rowIndex * this.buttonsPerRow + columnIndex, ...achievementData]
          )
        });
      })
    ;

    var bigAchievementBoxTop = 70;
    var bigAchievementBoxLeft = this.buttonStartLeft + (this.buttonWidth + this.buttonPadding) * this.buttonsPerRow;
    var bigAchievementBoxWidth = this.gD.canvas.width - bigAchievementBoxLeft - this.buttonStartLeft;
    var bigAchievementBoxCenter = bigAchievementBoxLeft + bigAchievementBoxWidth / 2;
    var bigAchievementBoxHeight = 230;
    var bigAchievementBoxPadding = 20;
    var bigAchievementImageSize = 75;
    var bigAchievementProgressHeight = 30;

    this.bigAchievementBox = new CanvasRect(
      bigAchievementBoxLeft, bigAchievementBoxTop,
      bigAchievementBoxWidth, bigAchievementBoxHeight,
      "rgba(255, 255, 255, 0.85)", "rgba(0, 0, 0, 0.9)", 2
    );
    this.bigAchivementImage = new CanvasImage(
      bigAchievementBoxLeft + (bigAchievementBoxWidth - bigAchievementImageSize) / 2,
      bigAchievementBoxTop + bigAchievementBoxPadding,
      bigAchievementImageSize, bigAchievementImageSize,
      "Item_Star_0"
    );
    this.bigAchivementName = new CanvasText(
      bigAchievementBoxCenter,
      bigAchievementBoxTop + bigAchievementImageSize + bigAchievementBoxPadding * 2,
      "20pt", "Consolas", "rgba(1, 1, 1, 1)",
      "center", "middle",
      "Placeholder"
    );
    this.bigAchivementDescriptionLine1 = new CanvasText(
      bigAchievementBoxCenter,
      bigAchievementBoxTop + bigAchievementImageSize + 17 + bigAchievementBoxPadding * 3,
      "12pt", "Consolas", "rgba(1, 1, 1, 1)",
      "center", "middle",
      "Placeholder"
    );
    this.bigAchivementDescriptionLine2 = new CanvasText(
      bigAchievementBoxCenter,
      bigAchievementBoxTop + bigAchievementImageSize + 17 + bigAchievementBoxPadding * 3 + 17,
      "12pt", "Consolas", "rgba(1, 1, 1, 1)",
      "center", "middle",
      "Placeholder"
    );
    this.bigAchivementProgress = new ProgressBar(
      bigAchievementBoxLeft + bigAchievementBoxPadding,
      bigAchievementBoxTop + bigAchievementBoxHeight - bigAchievementBoxPadding - bigAchievementProgressHeight,
      bigAchievementBoxWidth - bigAchievementBoxPadding * 2, bigAchievementProgressHeight,
      "12pt", "Consolas",
      0
    );

    var backToMenuWidth = 100;
    var backToMenuHeight = 30;
    buttons.push([
      new MenuTextButton(
        (this.gD.canvas.width - backToMenuWidth) / 2, this.gD.canvas.height - 10 - backToMenuHeight,
        backToMenuWidth, backToMenuHeight,
        "15pt", "Showcard Gothic, Impact", "rgba(255, 255, 255, 1)",
        "back",
        "rgba(0, 0, 0, .6)", 2,
        gD => { gD.currentPage = this.menu }
      )
    ]);

    this.menuController = new MenuController(gD);
    this.menuController.init(buttons);
  };
  /**
   * checks if a button is pressed
   */
  this.updateKeyPresses = function() {
    this.menuController.updateKeyPresses();
  };
  /**
   * checks if the mouse was moved
   */
  this.updateMouseMoves = function() {
    this.menuController.updateMouseMoves();
  };
  /**
   * checks if there was a click
   */
  this.updateClicks = function() {
    var clickPos = this.gD.clicks.pop();
    if (clickPos) {
      this.menuController.updateClick(clickPos);
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
    var selectedData = this.menuController.getSelectedData();
    if (selectedData) {
      var [index, name, [descLine1, descLine2], goal] = selectedData;
      this.bigAchivementName.text = name;
      this.bigAchivementDescriptionLine1.text = descLine1;
      this.bigAchivementDescriptionLine2.text = descLine2;
      this.bigAchivementProgress.current = this.achievementValues[index];
      this.bigAchivementProgress.goal = goal;
    }
  };
  /**
   * draws the screen onto the canvas
   */
  this.draw = function(ghostFactor) {
    this.gD.context.drawImage(this.backgroundImage, 0, 0);
    this.title.draw(this.gD);

    this.menuController.draw(this.gD);

    this.bigAchievementBox.draw(this.gD);
    this.bigAchivementImage.draw(this.gD);
    this.bigAchivementName.draw(this.gD);
    this.bigAchivementDescriptionLine1.draw(this.gD);
    this.bigAchivementDescriptionLine2.draw(this.gD);
    this.bigAchivementProgress.draw(this.gD);
  };
}


function ProgressBar(x, y, width, height, fontSize, fontFamily, goal) {
  this.width = width;
  this.goal = goal;
  this.current = 0;
  this.text = new CanvasText(
    x + width / 2, y + height / 2,
    fontSize, fontFamily, "rgba(0, 0, 0, 0.7)", "center", "middle", ""
  );
  this.backgroundRect = new CanvasRect(x, y, width, height, "rgba(200, 200, 200, 0.7)");
  this.foregroundRect = new CanvasRect(x, y, 0, height, "rgba(0, 129, 57, 0.9)");
  this.draw = function(gD) {
    this.text.text = `${this.current} / ${this.goal}`;
    this.foregroundRect.width = width * (this.current / this.goal);
    this.backgroundRect.draw(gD);
    this.foregroundRect.draw(gD);
    this.text.draw(gD);
  };
}
