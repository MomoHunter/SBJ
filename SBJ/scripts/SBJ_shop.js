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
    this.scrollHeight = 0;
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
    this.accessories = new Map([
      ["test", new ShopAccessory("test", "beard", "Collectables_Beard1", 0, 0)],
      ["test1", new ShopAccessory("test01", "beard", "Collectables_Beard1", 0, 0)],
      ["test2", new ShopAccessory("test02", "hat", "Collectables_Hat1", 0, 0)],
      ["test3", new ShopAccessory("test03", "glasses", "Collectables_Glasses1", 0, 0)],
      ["test4", new ShopAccessory("test04", "beard", "Collectables_Beard1", 0, 0)],
      ["test5", new ShopAccessory("test05", "glasses", "Collectables_Glasses1", 0, 0)],
      ["test6", new ShopAccessory("test06", "hat", "Collectables_Hat1", 0, 0)],
      ["test7", new ShopAccessory("test07", "beard", "Collectables_Beard1", 0, 0)],
      ["test8", new ShopAccessory("test08", "beard", "Collectables_Beard1", 0, 0)],
      ["test9", new ShopAccessory("test09", "glasses", "Collectables_Glasses1", 0, 0)],
      ["test10", new ShopAccessory("test10", "beard", "Collectables_Beard1", 0, 0)],
      ["test11", new ShopAccessory("test11", "hat", "Collectables_Hat1", 0, 0)],
      ["test12", new ShopAccessory("test12", "beard", "Collectables_Beard1", 0, 0)],
      ["test13", new ShopAccessory("test13", "glasses", "Collectables_Glasses1", 0, 0)],
      ["test14", new ShopAccessory("test14", "beard", "Collectables_Beard1", 0, 0)],
      ["test15", new ShopAccessory("test15", "hat", "Collectables_Hat1", 0, 0)],
      ["test16", new ShopAccessory("test16", "beard", "Collectables_Beard1", 0, 0)],
      ["test17", new ShopAccessory("test17", "glasses", "Collectables_Glasses1", 0, 0)],
      ["test18", new ShopAccessory("test18", "glasses", "Collectables_Glasses1", 0, 0)],
      ["test19", new ShopAccessory("test19", "beard", "Collectables_Beard1", 0, 0)],
      ["test20", new ShopAccessory("test20", "hat", "Collectables_Hat1", 0, 0)],
      ["test21", new ShopAccessory("test21", "beard", "Collectables_Beard1", 0, 0)],
      ["test22", new ShopAccessory("test22", "glasses", "Collectables_Glasses1", 0, 0)],
      ["test23", new ShopAccessory("test23", "hat", "Collectables_Hat1", 0, 0)],
      ["test24", new ShopAccessory("test24", "beard", "Collectables_Beard1", 0, 0)],
      ["test25", new ShopAccessory("test25", "glasses", "Collectables_Glasses1", 0, 0)],
      ["test26", new ShopAccessory("test26", "hat", "Collectables_Hat1", 0, 0)],
      ["test27", new ShopAccessory("test27", "beard", "Collectables_Beard1", 0, 0)],
      ["test28", new ShopAccessory("test28", "beard", "Collectables_Beard1", 0, 0)],
      ["test29", new ShopAccessory("test29", "hat", "Collectables_Hat1", 0, 0)],
      ["test30", new ShopAccessory("test30", "glasses", "Collectables_Glasses1", 0, 0)],
      ["test31", new ShopAccessory("test31", "hat", "Collectables_Hat1", 0, 0)],
      ["test32", new ShopAccessory("test32", "hat", "Collectables_Hat1", 0, 0)],
      ["test33", new ShopAccessory("test33", "hat", "Collectables_Hat1", 0, 0)]
    ]);

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

    this.accessoryWindow = new ShopAccessoryWindow(this.gD.canvas.width / 2 - 245, 70, 545, 200, "accessoryWindow");
    this.accessoryWindow.init();
    this.tabs[1].objects.push(this.accessoryWindow);
    
    this.scrollbar = new CanvasScrollBar(this.gD.canvas.width / 2 + 305, 95, 175, 25, Math.ceil(this.accessories.length / 11) * 3, "scrollBarBlack");
    this.tabs[1].objects.push(this.scrollbar);

    this.accessoryWindow.setAccessories(this, []);

    this.backToMenu = new CanvasButton(
      this.gD.canvas.width / 2 - 100, this.gD.canvas.height - 50, 200, 30, "Main Menu", "menu"
    );

    this.updateSelection(-1, 0);
  };
  this.vScroll = function(elements) {
    this.scrollHeight = elements * 25;
    this.scrollbar.scroll(elements);
  };
  this.levelSkills = function(skill) {
    let skillData = this.skillData[skill.key];
    let {goldenShamrock, hype} = skillData.getCost();

    if (this.goldenShamrocks >= goldenShamrock && this.hype >= hype) {
      this.goldenShamrocks -= goldenShamrock;
      this.hype -= hype;
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
    let wheelMove = this.gD.wheelMovements.pop();
    if (!wheelMove) {
      return;
    }
    
    if (this.selectedTabIndex === 1) {
      if (wheelMove < 0) {
        this.vScroll(Math.max(
          (this.scrollHeight / 25) - 1, 
          0
          ));
      } else if (wheelMove > 0) {
        this.vScroll(Math.min(
          (this.scrollHeight / 25) + 1, 
          (Math.ceil(this.accessoryWindow.accessories.length / 11) * 3) - 7
        ));
      }
    }
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

function SkillData(name, showValue, maxValue, costGoldenShamrock, costHype, costUpgradeGoldenShamrock, costUpgradeMoney, unlockedBy, unlockedAt) {
  this.name = name;
  this.showValue = showValue;
  this.maxValue = maxValue;
  this.costGoldenShamrock = costGoldenShamrock;
  this.costHype = costHype;
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
      hype: this.costHype + this.costUpgradeMoney * this.currentValue
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
    this.skills.push(new ShopSkill(this.x + 140, this.y + 425, 40, "Start amount stopwatch", "Skill_Stopwatches_at_start", "shopSkillItem"));
    this.skills.push(new ShopSkill(this.x + 250, this.y + 545, 40, "Start amount star", "Skill_Stars_at_start", "shopSkillItem"));
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
      let {goldenShamrock, hype} = skill.skillData.getCost();
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
    let {goldenShamrock, hype} = skillData.getCost();
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
        drawCanvasImage(newX - Math.floor(spriteWidth / 2), newY - spriteHeight, this.spriteKey, gD);
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
        drawCanvasImage(newX - Math.floor(spriteWidth / 2), newY - spriteHeight, this.spriteKey, gD);
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
    let {goldenShamrock, hype} = skillData.getCost();

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
        hype.toString().replace(/\d(?=(\d{3})+($|\.))/g, '$&.'), design.textKey.text, gD
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

function ShopAccessory(name, category, spriteKey, costHype, costGoldenShamrock) {
  this.name = name;
  this.category = category;
  this.spriteKey = spriteKey;
  this.costHype = costHype;
  this.costGoldenShamrock = costGoldenShamrock;
  this.bought = false;
  this.buy = function() {
    this.bought = true;
  };
}

function ShopAccessoryWindow(x, y, width, height, styleKey) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.styleKey = styleKey;
  this.accessories = [];
  this.init = function() {
    
  };
  this.setAccessories = function(shop, categories) {
    this.accessories = [];

    for (let accessory of shop.accessories.values()) {
      if (categories.toString() === "") {
        this.accessories.push(accessory);
      } else if (categories.includes(accessory.category)) {
        this.accessories.push(accessory);
      }
    }
    shop.scrollbar.refresh(Math.ceil(this.accessories.length / 11) * 3);
    this.sortAccessories("categories_rev");
  };
  this.sortAccessories = function(sortType) {
    if (sortType === "alphabetic") {
      for (let i = 0; i < this.accessories.length; i++) {
        let temp = copy(this.accessories[0]);
        for (let j = 1; j < this.accessories.length - i; j++) {
          if (temp.name < this.accessories[j].name) {
            temp = copy(this.accessories[j]);
          } else {
            this.accessories[j - 1] = copy(this.accessories[j]);
            this.accessories[j] = copy(temp);
          }
        }
      }
    } else if (sortType === "alphabetic_rev") {
      for (let i = 0; i < this.accessories.length; i++) {
        let temp = copy(this.accessories[0]);
        for (let j = 1; j < this.accessories.length - i; j++) {
          if (temp.name > this.accessories[j].name) {
            temp = copy(this.accessories[j]);
          } else {
            this.accessories[j - 1] = copy(this.accessories[j]);
            this.accessories[j] = copy(temp);
          }
        }
      }
    } else if (sortType === "price_hype_high") {
      for (let i = 0; i < this.accessories.length; i++) {
        let temp = copy(this.accessories[0]);
        for (let j = 1; j < this.accessories.length - i; j++) {
          if (temp.costHype > this.accessories[j].costHype) {
            temp = copy(this.accessories[j]);
          } else {
            this.accessories[j - 1] = copy(this.accessories[j]);
            this.accessories[j] = copy(temp);
          }
        }
      }
    } else if (sortType === "price_hype_low") {
      for (let i = 0; i < this.accessories.length; i++) {
        let temp = copy(this.accessories[0]);
        for (let j = 1; j < this.accessories.length - i; j++) {
          if (temp.costHype < this.accessories[j].costHype) {
            temp = copy(this.accessories[j]);
          } else {
            this.accessories[j - 1] = copy(this.accessories[j]);
            this.accessories[j] = copy(temp);
          }
        }
      }
    } else if (sortType === "price_goldenShamrock_high") {
      for (let i = 0; i < this.accessories.length; i++) {
        let temp = copy(this.accessories[0]);
        for (let j = 1; j < this.accessories.length - i; j++) {
          if (temp.costGoldenShamrock > this.accessories[j].costGoldenShamrock) {
            temp = copy(this.accessories[j]);
          } else {
            this.accessories[j - 1] = copy(this.accessories[j]);
            this.accessories[j] = copy(temp);
          }
        }
      }
    } else if (sortType === "price_goldenShamrock_low") {
      for (let i = 0; i < this.accessories.length; i++) {
        let temp = copy(this.accessories[0]);
        for (let j = 1; j < this.accessories.length - i; j++) {
          if (temp.costGoldenShamrock < this.accessories[j].costGoldenShamrock) {
            temp = copy(this.accessories[j]);
          } else {
            this.accessories[j - 1] = copy(this.accessories[j]);
            this.accessories[j] = copy(temp);
          }
        }
      }
    } else if (sortType === "categories") {
      for (let i = 0; i < this.accessories.length; i++) {
        let temp = copy(this.accessories[0]);
        for (let j = 1; j < this.accessories.length - i; j++) {
          if (temp.category < this.accessories[j].category) {
            temp = copy(this.accessories[j]);
          } else {
            this.accessories[j - 1] = copy(this.accessories[j]);
            this.accessories[j] = copy(temp);
          }
        }
      }
    } else if (sortType === "categories_rev") {
      for (let i = 0; i < this.accessories.length; i++) {
        let temp = copy(this.accessories[0]);
        for (let j = 1; j < this.accessories.length - i; j++) {
          if (temp.category > this.accessories[j].category) {
            temp = copy(this.accessories[j]);
          } else {
            this.accessories[j - 1] = copy(this.accessories[j]);
            this.accessories[j] = copy(temp);
          }
        }
      }
    }
    console.log(this.accessories);
  };
  this.draw = function(gD, shop) {
    let design = gD.design.elements[this.styleKey];

    drawCanvasRect(this.x + 2, this.y, 200, 16, design.rectKey.field, gD);
    drawCanvasPolygon(
      this.x + 6, this.y + 4, design.rectKey.arrow, gD, 
      this.x + 18, this.y + 4, this.x + 12, this.y + 12
    );
    drawCanvasLine(this.x + 22, this.y, design.borderKey.standard, gD, this.x + 22, this.y + 16);
    drawCanvasRectBorder(this.x + 2, this.y, 200, 16, design.borderKey.field, gD);
    
    drawCanvasRect(this.x + 212, this.y, 200, 16, design.rectKey.field, gD);
    drawCanvasPolygon(
      this.x + 216, this.y + 4, design.rectKey.arrow, gD, 
      this.x + 228, this.y + 4, this.x + 222, this.y + 12
    );
    drawCanvasLine(this.x + 232, this.y, design.borderKey.standard, gD, this.x + 232, this.y + 16);
    drawCanvasRectBorder(this.x + 212, this.y, 200, 16, design.borderKey.field, gD);

    gD.context.save();
    gD.context.rect(this.x, this.y + 25, this.width, this.height - 25);
    gD.context.clip();
    this.accessories.map((accessory, index) => {
      let spriteData = getSpriteData(accessory.spriteKey, gD);
      
      drawCanvasRect(this.x + 2 + (index % 11) * 50, this.y + 27 + Math.floor(index / 11) * 75 - shop.scrollHeight, 40, 65, design.rectKey.accessory[accessory.category], gD);
      drawCanvasRect(this.x + 7 + (index % 11) * 50, this.y + 32 + Math.floor(index / 11) * 75 - shop.scrollHeight, 30, 30, design.rectKey.accessory.standard, gD);
      drawCanvasImage(this.x + 22 - (spriteData.spriteWidth / 2) + (index % 11) * 50, this.y + 47 - (spriteData.spriteHeight / 2) + Math.floor(index / 11) * 75 - shop.scrollHeight, accessory.spriteKey, gD);
      drawCanvasRectBorder(this.x + 7 + (index % 11) * 50, this.y + 32 + Math.floor(index / 11) * 75 - shop.scrollHeight, 30, 30, design.borderKey.accessory, gD);
      drawCanvasRectBorder(this.x + 2 + (index % 11) * 50, this.y + 27 + Math.floor(index / 11) * 75 - shop.scrollHeight, 40, 65, design.borderKey.accessory, gD);
    }, this);

    gD.context.restore();
  };
}