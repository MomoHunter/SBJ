function Shop(menu, gD) {
  this.menu = menu;
  this.gD = gD;
  this.init = function () {
    this.backgroundMusic = new Audio();
    this.backgroundMusic.src = "music/shop.mp3";
    this.backgroundMusic.loop = true;
    this.backgroundMusic.volume = 0.2;
    this.hype = 100000000000000000000;
    this.goldenShamrocks = 10000;
    this.movingTree = false;
    this.movingMinimap = false;
    this.movingCounter = 0;           //counts how many frames moving was activated
    this.skillData = {
      "Unlock Skilltree":       new SkillData("Unlock the Skilltree", false, 1, 0, 1000, 0, 0, [], 0),
      "Level up items":         new SkillData("Level up Items", false, 1, 0, 10000, 0, 0, ["Unlock Skilltree"], 1),
      "Level up stopwatch":     new SkillData("Stopwatch level up", true, 99, 0, 3250, 0, 110, ["Level up items"], 1),
      "Level up star":          new SkillData("Star level up", true, 99, 0, 6720, 0, 210, ["Level up items"], 1),
      "Level up feather":       new SkillData("Feather level up", true, 99, 0, 3000, 0, 120, ["Level up items"], 1),
      "Level up treasure":      new SkillData("Treasure level up", true, 99, 0, 5550, 0, 220, ["Level up items"], 1),
      "Level up magnet":        new SkillData("Magnet level up", true, 99, 0, 4100, 0, 170, ["Level up items"], 1),
      "Level up rocket":        new SkillData("Rocket level up", true, 99, 0, 6020, 0, 199, ["Level up items"], 1),
      "Start amount stopwatch": new SkillData("Stopwatches at start", true, 2, 12, 75000, 6, 12500, ["Level up stopwatch"], 50),
      "Start amount star":      new SkillData("Stars at start", true, 2, 45, 179000, 22, 55000, ["Level up star"], 50),
      "Start amount feather":   new SkillData("Feathers at start", true, 2, 16, 87000, 8, 22000, ["Level up feather"], 50),
      "Start amount treasure":  new SkillData("Treasures at start", true, 2, 50, 200000, 25, 100000, ["Level up treasure"], 50),
      "Start amount magnet":    new SkillData("Magnets at start", true, 2, 32, 130000, 16, 62000, ["Level up magnet"], 50),
      "Start amount rocket":    new SkillData("Rockets at start", true, 2, 39, 166666, 19, 66666, ["Level up rocket"], 50),
      "Item spawn frequency":   new SkillData(
        "Item spawn frequency", true, 10, 5, 33000, 3, 6780, [
          "Level up stopwatch", "Level up star", "Level up feather",
          "Level up treasure", "Level up magnet", "Level up rocket"
        ], 100
      ),
      "Money multiplier":       new SkillData("Money multiplier", true, 100, 0, 3000, 0, 1700, ["Unlock Skilltree"], 1),
      "Character upgrades":     new SkillData("Character upgrades", false, 1, 0, 10000, 0, 0, ["Unlock Skilltree"], 1),
      "Movement speed":         new SkillData("Movement speed", true, 10, 0, 42000, 0, 8000, ["Character upgrades"], 1),
      "Jump height":            new SkillData("Jump height", true, 5, 0, 44000, 0, 12000, ["Character upgrades"], 1),
      "Jumps":                  new SkillData("Jumps", true, 3, 8, 25000, 8, 35000, ["Character upgrades"], 1),
      "Extra life":             new SkillData("Extra life", true, 1, 100, 1000000, 0, 0, ["Deaths"], 1000)
    };

    this.checkUnlocks();

    this.title = new CanvasText(this.gD.canvas.width / 2, 30, "Shop", "pageTitle");

    this.tabs = ["Item_B_Questionmark", "Item_B_Questionmark"];
    this.tabs.map((icon, index) => {
      this.tabs[index] = new CanvasTab(
        this.gD.canvas.width / 2 - 310, 60, 620, 220, index, 2, icon, "standardTab"
      );
    }, this);
    this.tabs[0].select();

    this.skillTree = new ShopSkillTree(this.gD.canvas.width / 2 - 245, 70, 545, 200, "skillTree");
    this.skillTree.init(this);
    this.tabs[0].objects.push(this.skillTree);

    this.backToMenu = new CanvasButton(
      this.gD.canvas.width / 2 - 100, this.gD.canvas.height - 50, 200, 30, "Main Menu", "menu"
    );

    this.updateSelection(-1, 0);
  };
  this.levelSkills = function(skill) {
    let skillData = this.skillData[skill.key];
    let {goldenShamrock, money} = skillData.getCost();

    if (this.goldenShamrocks >= goldenShamrock && this.hype >= money) {
      this.goldenShamrocks -= goldenShamrock;
      this.hype -= money;
      skillData.levelUp();
      this.checkUnlocks();
    }
  };
  this.checkUnlocks = function() {
    for (let key in this.skillData) {
      if (this.skillData.hasOwnProperty(key)) {
        this.skillData[key].checkUnlock(this);
      }
    }
  };
  this.updateKeyPresses = function() {

  };
  this.updateMouseMoves = function() {
    let mouseDown = this.gD.mouseDown.pop();
    let mouseUp = this.gD.mouseUp.pop();

    if (!this.movingTree && !this.movingMinimap) {
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
    }

    if (this.movingTree || this.movingMinimap) {
      this.movingCounter++;
    }

    if (mouseUp && (this.movingTree || this.movingMinimap)) {
      this.movingTree = false;
      this.movingMinimap = false;
      if (this.movingCounter >= 10) {
        this.gD.clicks = [];
      }
      this.movingCounter = 0;
    } else if (mouseDown && this.gD.mousePos.x >= this.skillTree.x &&
               this.gD.mousePos.x <= this.skillTree.x + this.skillTree.width && this.gD.mousePos.y >= this.skillTree.y &&
               this.gD.mousePos.y <= this.skillTree.y + this.skillTree.height) {
      this.movingTree = true;
    } else if (mouseDown && this.gD.mousePos.x >= this.skillTree.minimap.windowX &&
               this.gD.mousePos.x <= this.skillTree.minimap.windowX + this.skillTree.minimap.windowWidth &&
               this.gD.mousePos.y >= this.skillTree.minimap.windowY &&
               this.gD.mousePos.y <= this.skillTree.minimap.windowY + this.skillTree.minimap.windowHeight) {
      this.movingMinimap = true;
    }

    if (this.tabs[0].selected) {
      if (this.movingTree) {
        this.skillTree.moveTree(gD.mousePos.x - gD.referenceMousePos.x, gD.mousePos.y - gD.referenceMousePos.y);
        this.reset = true;
      } else if (this.movingMinimap) {
        this.skillTree.moveTree(
          -(gD.mousePos.x - gD.referenceMousePos.x) / this.skillTree.minimap.scaleFactor,
          -(gD.mousePos.y - gD.referenceMousePos.y) / this.skillTree.minimap.scaleFactor
        );
        this.reset = true;
      } else if (this.reset) {
        this.skillTree.setCurrentPos();
        this.reset = false;
      }

      this.skillTree.skills.map(skill => {
        let skillX = skill.x - (this.skillTree.currentPosX - this.skillTree.moveX);
        let skillY = skill.y - (this.skillTree.currentPosY - this.skillTree.moveY);
        if (Math.sqrt((this.gD.mousePos.x - skillX) ** 2 + (this.gD.mousePos.y - skillY) ** 2) <= skill.radius) {
          skill.select();
        } else {
          skill.deselect();
        }
      }, this);
    }
  };
  this.updateClick = function() {
    let clickPos = this.gD.clicks.pop();

    if (!clickPos) {
      return;
    }

    this.skillTree.skills.map(skill => {
      let skillX = skill.x - (this.skillTree.currentPosX - this.skillTree.moveX);
      let skillY = skill.y - (this.skillTree.currentPosY - this.skillTree.moveY);
      if (Math.sqrt((this.gD.mousePos.x - skillX) ** 2 + (this.gD.mousePos.y - skillY) ** 2) <= skill.radius) {
        this.levelSkills(skill);
      }
    }, this);

    if (clickPos.x >= this.backToMenu.x && clickPos.x <= this.backToMenu.x + this.backToMenu.width &&
        clickPos.y >= this.backToMenu.y && clickPos.y <= this.backToMenu.y + this.backToMenu.height) {
      this.gD.currentPage = this.menu;
    }
  };
  this.updateWheelMoves = function() {

  };
  this.update = function() {
    this.tabs.map(tab => {
      tab.update(this);
    }, this);

    this.backToMenu.update();
  };
  this.draw = function(ghostFactor) {
    this.gD.context.drawImage(this.menu.backgroundImage, 0, 0);

    this.title.draw(this.gD);


    this.tabs.map(tab => {
      tab.draw(this.gD, this);
    }, this);

    this.backToMenu.draw(this.gD);
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

function SkillData(name, showValue, maxValue, costGoldenShamrock, costMoney, costUpgradeGoldenShamrock, costUpgradeMoney, unlockedBy, unlockedAt) {
  this.name = name;
  this.showValue = showValue;
  this.maxValue = maxValue;
  this.costGoldenShamrock = costGoldenShamrock;
  this.costMoney = costMoney;
  this.costUpgradeGoldenShamrock = costUpgradeGoldenShamrock;
  this.costUpgradeMoney = costUpgradeMoney;
  this.unlockedBy = unlockedBy;
  this.unlockedAt = unlockedAt;
  this.currentValue = 0;
  this.unlocked = false;
  this.maxed = false;
  this.checkUnlock = function(shop) {
    let levels = 0;

    this.unlockedBy.map(key => {
      if (key === "Deaths") {
        if (shop.skillData["Character upgrades"].unlocked) {
          levels = shop.menu.statistics.statistics.get("player_deaths").currentCount;
        }
      } else {
        levels += shop.skillData[key].currentValue;
      }
    }, this);

    if (levels >= this.unlockedAt) {
      this.unlocked = true;
    }
  };
  this.levelUp = function() {
    if (this.currentValue < this.maxValue && this.unlocked) {
      this.currentValue++;
      if (this.currentValue >= this.maxValue) {
        this.maxed = true;
      }
    }
  };
  this.getCost = function() {
    return {
      goldenShamrock: this.costGoldenShamrock + this.costUpgradeGoldenShamrock * this.currentValue,
      money: this.costMoney + this.costUpgradeMoney * this.currentValue
    };
  };
}

function ShopSkillTree(x, y, width, height, styleKey) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.styleKey = styleKey;
  this.treeWidth = 1200;
  this.treeHeight = 900;
  this.moveX = 0;
  this.moveY = 0;
  this.currentPosX = 500 - width / 2;
  this.currentPosY = 0;
  this.infoBox = null;
  this.lines = [];
  this.skills = [];
  this.init = function(shop) {
    this.infoBox = new SkillInfoBox(600, 50, 200, 69, "shopSkillInfo");
    this.skills.push(new ShopSkill(this.x + 475, this.y + 80, 40, "Unlock Skilltree", "", "shopSkillStandard"));
    this.skills.push(new ShopSkill(this.x + 140, this.y + 190, 40, "Money multiplier", "", "shopSkillMoney"));
    this.lines.push({startX: 475, startY: 80, endX: 140, endY: 190});
    this.skills.push(new ShopSkill(this.x + 475, this.y + 280, 40, "Level up items", "", "shopSkillItem"));
    this.lines.push({startX: 475, startY: 80, endX: 475, endY: 280});
    this.skills.push(new ShopSkill(this.x + 265, this.y + 370, 40, "Level up stopwatch", "Skill_Stopwatch_level_up", "shopSkillItem"));
    this.skills.push(new ShopSkill(this.x + 335, this.y + 440, 40, "Level up star", "Skill_Star_level_up", "shopSkillItem"));
    this.skills.push(new ShopSkill(this.x + 425, this.y + 490, 40, "Level up feather", "Skill_Feather_level_up", "shopSkillItem"));
    this.skills.push(new ShopSkill(this.x + 525, this.y + 490, 40, "Level up treasure", "Skill_Treasure_level_up", "shopSkillItem"));
    this.skills.push(new ShopSkill(this.x + 615, this.y + 440, 40, "Level up magnet", "Skill_Magnet_level_up", "shopSkillItem"));
    this.skills.push(new ShopSkill(this.x + 685, this.y + 370, 40, "Level up rocket", "Skill_Rocket_level_up", "shopSkillItem"));
    this.lines.push({startX: 475, startY: 280, endX: 265, endY: 370});
    this.lines.push({startX: 475, startY: 280, endX: 335, endY: 440});
    this.lines.push({startX: 475, startY: 280, endX: 425, endY: 490});
    this.lines.push({startX: 475, startY: 280, endX: 525, endY: 490});
    this.lines.push({startX: 475, startY: 280, endX: 615, endY: 440});
    this.lines.push({startX: 475, startY: 280, endX: 685, endY: 370});
    this.skills.push(new ShopSkill(this.x + 140, this.y + 425, 40, "Start amount stopwatch", "", "shopSkillItem"));
    this.skills.push(new ShopSkill(this.x + 250, this.y + 545, 40, "Start amount star", "", "shopSkillItem"));
    this.skills.push(new ShopSkill(this.x + 395, this.y + 615, 40, "Start amount feather", "", "shopSkillItem"));
    this.skills.push(new ShopSkill(this.x + 555, this.y + 615, 40, "Start amount treasure", "", "shopSkillItem"));
    this.skills.push(new ShopSkill(this.x + 700, this.y + 545, 40, "Start amount magnet", "", "shopSkillItem"));
    this.skills.push(new ShopSkill(this.x + 810, this.y + 425, 40, "Start amount rocket", "", "shopSkillItem"));
    this.lines.push({startX: 265, startY: 370, endX: 140, endY: 425});
    this.lines.push({startX: 335, startY: 440, endX: 250, endY: 545});
    this.lines.push({startX: 425, startY: 490, endX: 395, endY: 615});
    this.lines.push({startX: 525, startY: 490, endX: 555, endY: 615});
    this.lines.push({startX: 615, startY: 440, endX: 700, endY: 545});
    this.lines.push({startX: 685, startY: 370, endX: 810, endY: 425});
    this.skills.push(new ShopSkill(this.x + 475, this.y + 730, 40, "Item spawn frequency", "", "shopSkillItem"));
    this.lines.push({startX: 475, startY: 280, endX: 475, endY: 730});
    this.skills.push(new ShopSkill(this.x + 810, this.y + 170, 40, "Character upgrades", "", "shopSkillCharacter"));
    this.lines.push({startX: 475, startY: 80, endX: 810, endY: 170});
    this.skills.push(new ShopSkill(this.x + 1050, this.y + 170, 40, "Movement speed", "", "shopSkillCharacter"));
    this.skills.push(new ShopSkill(this.x + 1050, this.y + 270, 40, "Jump height", "", "shopSkillCharacter"));
    this.skills.push(new ShopSkill(this.x + 1050, this.y + 400, 40, "Jumps", "", "shopSkillCharacter"));
    this.skills.push(new ShopSkill(this.x + 1050, this.y + 530, 40, "Extra life", "", "shopSkillCharacter"));
    this.lines.push({startX: 810, startY: 170, endX: 1050, endY: 170});
    this.lines.push({startX: 810, startY: 170, endX: 1050, endY: 270});
    this.lines.push({startX: 810, startY: 170, endX: 1050, endY: 400});
    this.lines.push({startX: 810, startY: 170, endX: 1050, endY: 530});
    this.minimap = new ShopSkillTreeMiniMap(shop.gD.canvas.width / 2 + 310, 60, 180, 220, "skillTreeMiniMap");
    this.minimap.init(shop, this.x, this.y, this.treeWidth, this.treeHeight, this.skills, this.lines);
  };
  this.setCurrentPos = function() {
    this.currentPosX = this.currentPosX - this.moveX;
    this.currentPosY = this.currentPosY - this.moveY;
    this.moveX = 0;
    this.moveY = 0;
  };
  this.moveTree = function(x, y) {
    this.moveX = x;
    if (this.currentPosX - this.moveX > this.treeWidth - this.width) {
      this.moveX = this.width - this.treeWidth + this.currentPosX;
    } else if (this.currentPosX - this.moveX < 0) {
      this.moveX = 0 + this.currentPosX;
    }

    this.moveY = y;
    if (this.currentPosY - this.moveY > this.treeHeight - this.height) {
      this.moveY = this.height - this.treeHeight + this.currentPosY;
    } else if (this.currentPosY - this.moveY < 0) {
      this.moveY = 0 + this.currentPosY;
    }
  };
  this.update = function() {
    this.skills.map(skill => {
      skill.update();
    }, this);
    this.minimap.setWindowPos(this.currentPosX - this.moveX, this.currentPosY - this.moveY);
  };
  this.draw = function(gD, shop) {
    let design = gD.design.elements[this.styleKey];
    let newX = this.x - (this.currentPosX - this.moveX);
    let newY = this.y - (this.currentPosY - this.moveY);
    gD.context.save();
    gD.context.beginPath();
    gD.context.rect(this.x, this.y, this.width, this.height);
    gD.context.clip();
    drawCanvasRect(newX, newY, this.treeWidth, this.treeHeight, design.rectKey.background, gD);
    this.lines.map(line => {
      drawCanvasLine(newX + line.startX, newY + line.startY, design.borderKey, gD, newX + line.endX, newY + line.endY);
    }, this);
    this.skills.map(skill => {
      skill.draw(gD, shop, this.currentPosX - this.moveX, this.currentPosY - this.moveY);
      if (skill.selected) {
        this.infoBox.setSkill(skill);
      }
    }, this);
    this.infoBox.draw(gD, shop, this.currentPosX - this.moveX, this.currentPosY - this.moveY);

    gD.context.restore();
    drawCanvasRectBorder(this.x, this.y, this.width, this.height, design.borderKey, gD);
    this.minimap.draw(gD);
  };
}

function ShopSkillTreeMiniMap(x, y, width, height, styleKey) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.styleKey = styleKey;
  this.scaleFactor = 0;
  this.mapX = x + 5;
  this.mapY = y + 20;
  this.mapWidth = 0;
  this.mapHeight = 0;
  this.windowX = 0;
  this.windowY = 0;
  this.windowWidth = 0;
  this.windowHeight = 0;
  this.skills = [];
  this.lines = [];
  this.init = function(shop, skillTreeX, skillTreeY, treeWidth, treeHeight, skills, lines) {
    this.scaleFactor = (this.width - 10) / treeWidth;
    this.mapWidth = this.scaleFactor * treeWidth;
    this.mapHeight = this.scaleFactor * treeHeight;
    this.mapY = this.y + (this.height - this.mapHeight) / 2;
    this.windowWidth = this.scaleFactor * 545;
    this.windowHeight = this.scaleFactor * 200;
    skills.map(skill => {
      this.skills.push({
        x: (skill.x - skillTreeX) * this.scaleFactor,
        y: (skill.y - skillTreeY) * this.scaleFactor,
        radius: skill.radius * this.scaleFactor,
        skillData: shop.skillData[skill.key],
        starEdges: skill.starEdges,
        edgeFactor: skill.edgeFactor,
        style: skill.styleKey
      });
    }, this);
    lines.map(line => {
      this.lines.push({
        startX: line.startX * this.scaleFactor,
        startY: line.startY * this.scaleFactor,
        endX: line.endX * this.scaleFactor,
        endY: line.endY * this.scaleFactor
      });
    }, this);
  };
  this.setWindowPos = function(x, y) {
    this.windowX = this.mapX + x * this.scaleFactor;
    this.windowY = this.mapY + y * this.scaleFactor;
  };
  this.draw = function(gD) {
    let design = gD.design.elements[this.styleKey];

    drawCanvasRect(this.x, this.y, this.width, this.height, design.rectKey.background, gD);
    drawCanvasRect(this.mapX, this.mapY, this.mapWidth, this.mapHeight, design.rectKey.map, gD);
    this.lines.map(line => {
      drawCanvasLine(
        this.mapX + line.startX, this.mapY + line.startY, design.borderKey.line, gD,
        this.mapX + line.endX, this.mapY + line.endY
      );
    }, this);
    this.skills.map(skill => {
      let skillDesign = gD.design.elements[skill.style];
      let {goldenShamrock, money} = skill.skillData.getCost();
      if (goldenShamrock > 0) {
        drawCanvasStar(
          this.mapX + skill.x, this.mapY + skill.y, skill.radius, skill.edgeFactor, skill.starEdges,
          skillDesign.circleKey.normal, gD
        );
        if (!skill.skillData.unlocked) {
          drawCanvasStar(
            this.mapX + skill.x, this.mapY + skill.y, skill.radius, skill.edgeFactor, skill.starEdges,
            skillDesign.circleKey.locked, gD
          );
        }
        drawCanvasStarBorder(
          this.mapX + skill.x, this.mapY + skill.y, skill.radius, skill.edgeFactor, skill.starEdges,
          design.borderKey.skill, gD
        );
      } else {
        drawCanvasCircle(this.mapX + skill.x, this.mapY + skill.y, skill.radius, skillDesign.circleKey.normal, gD);
        if (!skill.skillData.unlocked) {
          drawCanvasCircle(this.mapX + skill.x, this.mapY + skill.y, skill.radius, skillDesign.circleKey.locked, gD);
        }
        drawCanvasCircleBorder(this.mapX + skill.x, this.mapY + skill.y, skill.radius, design.borderKey.skill, gD);
      }
      if (skill.skillData.maxed) {
        drawCanvasLine(
          this.mapX + skill.x - skill.radius / 2, this.mapY + skill.y + skill.radius / 8,
          design.borderKey.normal, gD, this.mapX + skill.x - skill.radius / 8, this.mapY + skill.y + skill.radius / 2,
          this.mapX + skill.x + skill.radius / 3 * 2, this.mapY + skill.y - skill.radius / 8 * 3
        );
      }
    }, this);
    drawCanvasRectBorder(this.windowX, this.windowY, this.windowWidth, this.windowHeight, design.borderKey.window, gD);
    drawCanvasRectBorder(this.mapX, this.mapY, this.mapWidth, this.mapHeight, design.borderKey.normal, gD);
    drawCanvasRectBorder(this.x, this.y, this.width, this.height, design.borderKey.normal, gD);
  };
}

function ShopSkill(x, y, radius, key, spriteKey, styleKey) {
  this.x = x;
  this.y = y;
  this.radius = radius;
  this.innerRadius = 0;
  this.key = key;
  this.spriteKey = spriteKey;
  this.styleKey = styleKey;
  this.starEdges = 12;
  this.edgeFactor = 1.5;
  this.selected = false;
  this.select = function() {
    this.selected = true;
  };
  this.deselect = function() {
    this.selected = false;
  };
  this.update = function() {
    if (this.selected) {
      if (this.innerRadius < this.radius) {
        this.innerRadius += 4;
        if (this.innerRadius > this.radius) {
          this.innerRadius = this.radius;
        }
      }
    } else {
      if (this.innerRadius > 0) {
        this.innerRadius -= 4;
        if (this.innerRadius < 0) {
          this.innerRadius = 0;
        }
      }
    }
  };
  this.draw = function(gD, shop, shiftX, shiftY) {
    let design = gD.design.elements[this.styleKey];
    let skillData = shop.skillData[this.key];
    let {goldenShamrock, money} = skillData.getCost();
    let {spriteWidth, spriteHeight} = getSpriteData(this.spriteKey, gD);
    let newX = this.x - shiftX;
    let newY = this.y - shiftY;
    let name = this.key.split(' ');

    if (goldenShamrock > 0) {
      drawCanvasStar(newX, newY, this.radius, this.edgeFactor, this.starEdges, design.circleKey.normal, gD);
      if (skillData.unlocked) {
        drawCanvasStar(newX, newY, this.innerRadius, this.edgeFactor, this.starEdges, design.circleKey.selected, gD);
      }
    } else {
      drawCanvasCircle(newX, newY, this.radius, design.circleKey.normal, gD);
      if (skillData.unlocked) {
        drawCanvasCircle(newX, newY, this.innerRadius, design.circleKey.selected, gD);
      }
    }

    if (skillData.showValue) {
      if (this.spriteKey !== "") {
        drawCanvasImage(newX - spriteWidth / 2, newY - spriteHeight, this.spriteKey, gD);
      } else if (name.length === 1) {
        drawCanvasText(newX, newY - 17, name[0], design.textKey, gD);
      } else if (name.length === 2) {
        drawCanvasText(newX, newY - 17, name[0], design.textKey, gD);
        drawCanvasText(newX, newY - 3, name[1], design.textKey, gD);
      } else {
        drawCanvasText(newX, newY - 17, name[0] + " " + name[1], design.textKey, gD);
        drawCanvasText(newX, newY - 3, name[2], design.textKey, gD);
      }
      drawCanvasRectRound(newX - 30, newY + 5, 60, 16, 8, design.rectKey, gD);
      if (skillData.maxValue > 9) {
        drawCanvasText(newX, newY + 14, addLeadingZero(skillData.currentValue) + "/" + skillData.maxValue, design.textKey, gD);
      } else {
        drawCanvasText(newX, newY + 14, skillData.currentValue + "/" + skillData.maxValue, design.textKey, gD);
      }
      drawCanvasRectRoundBorder(newX - 30, newY + 5, 60, 16, 8, design.borderKey.normal, gD);
    } else {
      if (this.spriteKey !== "") {
        drawCanvasImage(newX - spriteWidth / 2, newY - spriteHeight, this.spriteKey, gD);
      } else if (name.length === 2) {
        drawCanvasText(newX, newY - 7, name[0], design.textKey, gD);
        drawCanvasText(newX, newY + 7, name[1], design.textKey, gD);
      } else {
        drawCanvasText(newX, newY - 7, name[0] + " " + name[1], design.textKey, gD);
        drawCanvasText(newX, newY + 7, name[2], design.textKey, gD);
      }
    }
    if (goldenShamrock > 0) {
      if (!skillData.unlocked) {
        drawCanvasStar(newX, newY, this.radius, this.edgeFactor, this.starEdges, design.circleKey.locked, gD);
      }
      drawCanvasStarBorder(newX, newY, this.radius, this.edgeFactor, this.starEdges, design.borderKey.normal, gD);
    } else {
      if (!skillData.unlocked) {
        drawCanvasCircle(newX, newY, this.radius, design.circleKey.locked, gD);
      }
      drawCanvasCircleBorder(newX, newY, this.radius, design.borderKey.normal, gD);
    }

    if (skillData.maxed) {
      drawCanvasCircle(
        newX + this.radius / 16 * 11, newY + this.radius / 16 * 11, this.radius / 16 * 5, design.circleKey.maxed, gD
      );
      drawCanvasLine(newX + 18, newY + 27, design.borderKey.hook, gD, newX + 23, newY + 33, newX + 35, newY + 21);
      drawCanvasCircleBorder(
        newX + this.radius / 16 * 11, newY + this.radius / 16 * 11, this.radius / 16 * 5, design.borderKey.normal, gD
      );
    }
  };
}

function SkillInfoBox(x, y, width, height, styleKey) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.styleKey = styleKey;
  this.currentSkill = null;
  this.radius = null;
  this.setSkill = function(skill) {
    this.currentSkill = skill;
    this.x = skill.x;
    this.y = skill.y;
    this.radius = skill.radius;
  };
  this.draw = function(gD, shop, shiftX, shiftY) {
    let design = gD.design.elements[this.styleKey];
    let newX = this.x - shiftX;
    let newY = this.y - shiftY;

    if (this.currentSkill === null) {
      return;
    }

    let skillData = shop.skillData[this.currentSkill.key];
    let {goldenShamrock, money} = skillData.getCost();

    if (skillData.maxed) {
      return;
    }

    if (this.currentSkill.selected && skillData.unlocked) {
      drawCanvasPolygon(
        newX, newY + this.radius, design.rectKey, gD, newX + 5, newY + this.radius + 5,
        newX + this.width / 2, newY + this.radius + 5, newX + this.width / 2, newY + this.radius + this.height,
        newX - this.width / 2, newY + this.radius + this.height, newX - this.width / 2, newY + this.radius + 5,
        newX - 5, newY + this.radius + 5
      );
      drawCanvasText(newX, newY + this.radius + 15, skillData.name, design.textKey.headline, gD);
      drawCanvasImage(newX - this.width / 2 + 3, newY + this.radius + 27, "Special_GoldenShamrock", gD);
      drawCanvasText(
        newX + this.width / 2 - 3, newY + this.radius + 37,
        goldenShamrock.toString().replace(/\d(?=(\d{3})+($|\.))/g, '$&.'), design.textKey.text, gD
      );
      drawCanvasImage(newX - this.width / 2 + 3, newY + this.radius + 49, "Money_1", gD);
      drawCanvasText(
        newX + this.width / 2 - 3, newY + this.radius + 59,
        money.toString().replace(/\d(?=(\d{3})+($|\.))/g, '$&.'), design.textKey.text, gD
      );
      drawCanvasLine(newX - this.width / 2, newY + this.radius + 25, design.borderKey, gD, newX + this.width / 2, newY + this.radius + 25);
      drawCanvasPolygonBorder(
        newX, newY + this.radius, design.borderKey, gD, newX + 5, newY + this.radius + 5,
        newX + this.width / 2, newY + this.radius + 5, newX + this.width / 2, newY + this.radius + this.height,
        newX - this.width / 2, newY + this.radius + this.height, newX - this.width / 2, newY + this.radius + 5,
        newX - 5, newY + this.radius + 5
      );
    }
  };
}

  /*
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
    this.title = new CanvasText(this.gD.canvas.width / 2, 30, "Shop", "header");

    this.money = new ShopMoney(this.gD.canvas.width - 215, 0, 200, 30, "20pt", "Consolas", "rgba(220, 255, 220, 1)", "rgba(0, 0, 0, 1)", 2);

    this.tabs.push(new ShopTab((this.gD.canvas.width / 2) - 300, 60, 300, 30, "15pt", "Showcard Gothic", "rgba(150, 180, 150, 1)", "Player", "rgba(0, 0, 0, .6)", 2));
    this.tabs.push(new ShopTab(this.gD.canvas.width / 2, 60, 300, 30, "15pt", "Showcard Gothic", "rgba(200, 200, 0, 1)", "Items", "rgba(0, 0, 0, .6)", 2));
    this.tabs[this.active].activate();

    for (let i = 0; i < 3; i++) {
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
}*/