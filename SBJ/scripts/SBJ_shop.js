function Shop(menu, gD) {
  this.menu = menu;
  this.gD = gD;
  this.init = function () {
    this.backgroundMusic = new Audio();
    this.backgroundMusic.src = "music/shop.mp3";
    this.backgroundMusic.loop = true;
    this.backgroundMusic.volume = 0.2;
    this.hype = 1000000000;
    this.goldenShamrocks = 2400;
    this.movingTree = false;
    this.movingMinimap = false;
    this.movingCounter = 0;           //counts how many frames moving was activated to prevent unintentional clicks
    this.currentlyMarked = null;
    this.scrollHeight = 0;
    this.skillData = {          //funktion einbinden, die den aktuellen Wert zurückgibt
      "unlock_skilltree": new SkillData(
        "Unlock the Skilltree", false, (level) => {return level;}, 1, 
        (level) => {return 1000;}, (level) => {return 0;}, [], 0
      ),
      "level_up_items": new SkillData(
        "Level up Items", false, (level) => {return level;}, 1, (level) => {return 2000;}, 
        (level) => {return 0;}, ["unlock_skilltree"], 1
      ),
      "level_up_stopwatch": new SkillData(
        "Stopwatch level up", true, (level) => {return 120 + level * 5;}, 100, 
        (level) => {return 10000 + Math.pow(level * 50, 1.4);}, (level) => {return 0;}, ["level_up_items"], 1
      ),
      "level_up_star": new SkillData(
        "Star level up", true, (level) => {return Math.floor(150 + level * 11.5);}, 100, 
        (level) => {return 35000 + Math.pow(level * 40, 1.6);}, (level) => {return 0;}, ["level_up_items"], 1
      ),
      "level_up_feather": new SkillData(
        "Feather level up", true, (level) => {return 300 + level * 6;}, 100, 
        (level) => {return 15000 + Math.pow(level * 35, 1.5);}, (level) => {return 0;}, ["level_up_items"], 1
      ),
      "level_up_treasure": new SkillData(
        "Treasure level up", true, (level) => {return Math.floor(20 + level * 0.8);}, 100, 
        (level) => {return 50000 + Math.pow(level * 55, 1.6);}, (level) => {return 0;}, ["level_up_items"], 1
      ),
      "level_up_magnet": new SkillData(
        "Magnet level up", true, (level) => {return 240 + level * 16;}, 100, 
        (level) => {return 25000 + Math.pow(level * 50, 1.5);}, (level) => {return 0;}, ["level_up_items"], 1
      ),
      "level_up_rocket": new SkillData(
        "Rocket level up", true, (level) => {return 100 + level * 4;}, 100, 
        (level) => {return 30000 + Math.pow(level * 70, 1.5);}, (level) => {return 0;}, ["level_up_items"], 1
      ),
      "start_amount_stopwatch": new SkillData(
        "Stopwatches at start", true, (level) => {return level;}, 2, 
        (level) => {return 80000 + level * 60000;}, (level) => {return 12 + level * 6}, ["level_up_stopwatch"], 50
      ),
      "start_amount_star": new SkillData(
        "Stars at start", true, (level) => {return level;}, 2,
        (level) => {return 250000 + level * 166666;}, (level) => {return 45 + level * 22;}, ["level_up_star"], 50
      ),
      "start_amount_feather": new SkillData(
        "Feathers at start", true, (level) => {return level;}, 2,
        (level) => {return 100000 + level * 66666;}, (level) => {return 16 + level * 8;}, ["level_up_feather"], 50
      ),
      "start_amount_treasure": new SkillData(
        "Treasures at start", true, (level) => {return level;}, 2,
        (level) => {return 400000 + level * 266666;}, (level) => {return 50 + level * 25;}, ["level_up_treasure"], 50
      ),
      "start_amount_magnet": new SkillData(
        "Magnets at start", true, (level) => {return level;}, 2,
        (level) => {return 180000 + level * 120000;}, (level) => {return 32 + level * 16;}, ["level_up_magnet"], 50
      ),
      "start_amount_rocket": new SkillData(
        "Rockets at start", true, (level) => {return level;}, 2,
        (level) => {return 270000 + level * 180000;}, (level) => {return 39 + level * 19;}, ["level_up_rocket"], 50
      ),
      "item_spawn_frequency": new SkillData(
        "Item spawn frequency", true, (level) => {return 250 - level * 15;}, 10, 
        (level) => {return 12500 + Math.pow(level * 12, 3);}, (level) => {return 6 + Math.pow(level, 3.5);}, [
          "level_up_stopwatch", "level_up_star", "level_up_feather",
          "level_up_treasure", "level_up_magnet", "level_up_rocket"
        ], 200
      ),
      "money_multiplier": new SkillData(
        "Money multiplier", true, (level) => {return 1 + level * 0.09;}, 100, 
        (level) => {return 5000 + Math.pow(level * 10, 2);}, (level) => {return 0;}, ["unlock_skilltree"], 1
      ),
      "character_upgrades": new SkillData(
        "Character upgrades", false, (level) => {return level;}, 1, (level) => {return 3000;}, 
        (level) => {return 0;}, ["unlock_skilltree"], 1
      ),
      "movement_speed": new SkillData(
        "Movement speed", true, (level) => {return 3 + level * 0.4;}, 10,
        (level) => {return 17500 + Math.pow(level * 8, 2.5);}, (level) => {return 0;}, ["character_upgrades"], 1
      ),
      "jump_height": new SkillData(
        "Jump height", true, (level) => {return -(9 + level);}, 5,
        (level) => {return 22000 + Math.pow(level * 6, 3.5);}, (level) => {return 0;}, ["character_upgrades"], 1
      ),
      "jumps": new SkillData(
        "Jumps", true, (level) => {return 2 + level;}, 3,
        (level) => {return 100000 + level * 100000;}, (level) => {return 10 + level * 10;}, ["character_upgrades"], 1
      ),
      "extra_life": new SkillData(
        "Extra life", true, (level) => {return level;}, 1, (level) => {return 10000000;}, 
        (level) => {return 5000;}, ["Deaths"], 1000
      )
    };
    this.accessories = new Map([
      ["Fancy Beard", new ShopAccessory("Fancy Beard", "Beard", "Collectables_Beard1", 500, 0)],
      ["Zylinder", new ShopAccessory("Zylinder", "Hat", "Collectables_Hat1", 400, 0)],
      ["Sunglasses", new ShopAccessory("Sunglasses", "Glasses", "Collectables_Glasses1", 750, 0)],
      ["Longjohn", new ShopAccessory("Longjohn", "Skin", "Player_Longjohn", 2000, 0)],
      ["Disgusty", new ShopAccessory("Disgusty", "Skin", "Player_Disgusty", 8000, 0)],
      ["Speedy", new ShopAccessory("Speedy", "Skin", "Player_Speedy", 15000, 0)],
      ["Strooper", new ShopAccessory("Strooper", "Skin", "Player_Strooper", 30000, 0)],
      ["Magician", new ShopAccessory("Magician", "Skin", "Player_Magician", 50000, 0)],
      ["Afroman", new ShopAccessory("Afroman", "Skin", "Player_Afroman", 200000, 20)]
    ]);

    this.checkUnlocks();


    this.title = new CanvasText(this.gD.canvas.width / 2, 30, "Shop", "pageTitle");

    this.tabs = ["Icon_Skilltree", "Icon_Accessories"];
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
    this.tabs[1].objects.push(this.accessoryWindow);

    this.resetButton = new CanvasButton(this.gD.canvas.width / 2 + 177, 70, 120, 16, "Reset", "shop");
    this.tabs[1].objects.push(this.resetButton);

    this.dropdowns = [
      new ShopDropdownMenu(
        this.gD.canvas.width / 2 - 243, 70, 200, 16, [
          "Category", "Category reverse", "Alphabetic", "Alphabetic reverse", "Price Hype exp", "Price Hype cheap",
          "Price GS exp", "Price GS cheap"
        ], "shopDropdown"
      ),
      new ShopDropdownMenu(
        this.gD.canvas.width / 2 - 33, 70, 200, 16, ["Hat", "Glasses", "Beard", "Skin", "Only buyable"], "shopDropdown", true
      )
    ];
    this.tabs[1].objects.push(this.dropdowns[0]);
    this.tabs[1].objects.push(this.dropdowns[1]);
    
    this.scrollbar = new CanvasScrollBar(
      this.gD.canvas.width / 2 + 305, 95, 175, 25, Math.ceil(this.accessories.length / 11) * 3, "scrollBarBlack"
    );
    this.tabs[1].objects.push(this.scrollbar);

    this.accessoryDetails = new ShopAccessoryDetails(this.gD.canvas.width / 2 + 310, 60, 180, 220, "accessoryDetails");
    this.accessoryDetails.init();
    this.tabs[1].objects.push(this.accessoryDetails);

    this.accessoryWindow.setAccessories(this, this.dropdowns[1].currentOption);

    this.moneyDisplay = new ShopMoneyDisplay(this.gD.canvas.width / 2 - 490, 149, 170, 41, "shopMoneyDisplay");

    this.backToMenu = new CanvasButton(
      this.gD.canvas.width / 2 - 100, this.gD.canvas.height - 50, 200, 30, "Main Menu", "menu"
    );

    this.updateSelection(0, -1, 0);
  };
  this.vScroll = function(elements) {
    this.scrollHeight = elements * 25;
    this.scrollbar.scroll(elements);
  };
  this.handleEvent = function(eventKey, addedValue = 1) {
      this.menu.handleEvent(eventKey, addedValue);
  };
  this.getSaveData = function() {
    let skillSaveData = {};
    let accessorySaveData = {};
    
    for (let e in this.skillData) {
      if (this.skillData.hasOwnProperty(e)) {
        skillSaveData[e] = this.skillData[e].getSaveData();
      }
    }
    for (let [key, value] of this.accessories) {
      accessorySaveData[key] = this.accessories.get(key).getSaveData();
    }
    
    return {
      "skillData": skillSaveData,
      "accessories": accessorySaveData,
      "hype": this.hype,
      "goldenShamrocks": this.goldenShamrocks
    };
  };
  this.setSaveData = function(data) {
    for (let e in this.skillData) {
      if (this.skillData.hasOwnProperty(e)) {
        this.skillData[e].setSaveData(data.skillData[e]);
      }
    }
    
    for (let e in data.accessories) {
      if (data.accessories.hasOwnProperty(e)) {
        this.accessories.get(e).setSaveData(data.accessories[e]);
      }
    }
    this.hype = data.hype;
    this.goldenShamrocks = data.goldenShamrocks;
    this.accessoryWindow.setAccessories(this, this.dropdowns[1].currentOption);
  };
  this.addHype = function(amount) {
    this.hype += amount;
    this.handleEvent(Events.SET_OWNED_HYPE, this.hype);
  };
  this.levelSkills = function(skill) {
    let skillData = this.skillData[skill.key];
    let {goldenShamrock, hype} = skillData.getCost();

    if (this.goldenShamrocks >= goldenShamrock && this.hype >= hype && !skillData.maxed && skillData.unlocked) {
      this.goldenShamrocks -= goldenShamrock;
      this.hype -= hype;
      this.handleEvent(Events.MONEY_SPENT, hype);
      skillData.levelUp();
      this.checkUnlocks();
      if (skill.key.startsWith("level") && skill.key !== "level_up_items") {
        this.handleEvent(Events.LVL_ITEM);
        this.handleEvent(Events.LVL_ITEM_MAX, skillData.currentLevel);
      }
    }
  };
  this.buyAccessory = function(accessory) {
    if (this.goldenShamrocks >= accessory.costGoldenShamrock && this.hype >= accessory.costHype && !accessory.bought) {
      this.goldenShamrocks -= accessory.costGoldenShamrock;
      this.hype -= accessory.costHype;
      this.handleEvent(Events.MONEY_SPENT, accessory.costHype);
      switch (accessory.category) {
        case "Beard":
          this.handleEvent(Events.COLLECT_BEARD);
          this.gD.collectables[accessory.spriteKey][0] = true;
          break;
        case "Hat":
          this.handleEvent(Events.COLLECT_HAT);
          this.gD.collectables[accessory.spriteKey][0] = true;
          break;
        case "Glasses":
          this.handleEvent(Events.COLLECT_GLASSES);
          this.gD.collectables[accessory.spriteKey][0] = true;
          break;
        case "Skin":
          this.handleEvent(Events.COLLECT_SKIN);
          this.gD.player[accessory.spriteKey][0] = true;
          break;
        default:
          break;
      }
      this.accessories.get(accessory.name).buy();
      accessory.buy();
    }
  };
  this.checkUnlocks = function() {
    for (let key in this.skillData) {
      if (this.skillData.hasOwnProperty(key)) {
        this.skillData[key].checkUnlock(this);
      }
    }
  };
  this.getSkillValue = function(skillName) {
    return this.skillData[skillName].getValue();
  };
  this.updateKeyPresses = function() {
    this.gD.newKeys.map(key => {
      let keyB = this.menu.controls.keyBindings;
      if (keyB.get("Menu_Back")[3].includes(key)) {
        this.gD.currentPage = this.menu;
      } else if (keyB.get("Menu_NavUp")[3].includes(key)) {
        if (this.selectedColumnIndex === 0) {
          if (this.selectedRowIndex === -1) {
            this.updateSelection(1, 1, this.selectedColumnIndex);
          } else if (this.selectedRowIndex === 0) {
            this.updateSelection(0, -1, this.selectedColumnIndex);
          } else {
            this.updateSelection(this.selectedTabIndex - 1, this.selectedRowIndex - 1, this.selectedColumnIndex);
          }
        } else if ((this.selectedColumnIndex === 1 && this.dropdowns[0].opened) ||
                   (this.selectedColumnIndex === 2 && this.dropdowns[1].opened)) {
          if (this.selectedRowIndex === 0) {
            this.updateSelection(this.selectedTabIndex, this.dropdowns[this.selectedColumnIndex - 1].options.length, this.selectedColumnIndex);
          } else {
            this.updateSelection(this.selectedTabIndex, this.selectedRowIndex - 1, this.selectedColumnIndex);
          }
        } else if (this.selectedRowIndex === 0) {
          if (this.selectedColumnIndex !== 12) {
            this.updateSelection(
              this.selectedTabIndex, 
              Math.floor((this.accessoryWindow.accessories.length - this.selectedColumnIndex) / 11) + 1, 
              this.selectedColumnIndex
            );
          }
        } else if (this.selectedRowIndex === 1) {
          if (this.selectedColumnIndex !== 12) {
            if (this.selectedColumnIndex > 2) {
              this.updateSelection(this.selectedTabIndex, 0, 3);
            } else {
              this.updateSelection(this.selectedTabIndex, 0, this.selectedColumnIndex);
            }
          }
        } else {
          this.updateSelection(
            this.selectedTabIndex, 
            this.selectedRowIndex - 1, 
            this.selectedColumnIndex,
            true
          );
        }
      } else if (keyB.get("Menu_NavDown")[3].includes(key)) {
        if (this.selectedColumnIndex === 0) {
          if (this.selectedRowIndex !== 1) {
            this.updateSelection(this.selectedRowIndex + 1, this.selectedRowIndex + 1, this.selectedColumnIndex);
          } else {
            this.updateSelection(this.selectedTabIndex, -1, this.selectedColumnIndex);
          }
        } else if ((this.selectedColumnIndex === 1 && this.dropdowns[0].opened) ||
                   (this.selectedColumnIndex === 2 && this.dropdowns[1].opened)) {
          if (this.selectedRowIndex === this.dropdowns[this.selectedColumnIndex - 1].options.length) {
            this.updateSelection(this.selectedTabIndex, 0, this.selectedColumnIndex);
          } else {
            this.updateSelection(this.selectedTabIndex, this.selectedRowIndex + 1, this.selectedColumnIndex);
          }
        } else if (this.selectedRowIndex === 
                   Math.floor((this.accessoryWindow.accessories.length - this.selectedColumnIndex) / 11) + 1) {
          if (this.selectedColumnIndex !== 12) {
            if (this.selectedColumnIndex > 2) {
              this.updateSelection(this.selectedTabIndex, 0, 3);
            } else {
              this.updateSelection(this.selectedTabIndex, 0, this.selectedColumnIndex);
            }
          }
        } else {
          this.updateSelection(
            this.selectedTabIndex, 
            this.selectedRowIndex + 1, 
            this.selectedColumnIndex,
            true
          );
        }
      } else if (keyB.get("Menu_NavRight")[3].includes(key)) {
        if (this.selectedTabIndex === 1) {
          if (this.selectedColumnIndex === 1 && this.dropdowns[0].opened) {
            if (this.selectedRowIndex > this.dropdowns[1].options.length) {
              this.updateSelection(this.selectedTabIndex, this.dropdowns[1].options.length, 2);
            } else {
              this.updateSelection(this.selectedTabIndex, this.selectedRowIndex, 2);
            }
          } else if (this.accessoryDetails.currentAccessory !== null) {
            if (this.selectedColumnIndex === 3 && this.selectedRowIndex === 0) {
              this.updateSelection(this.selectedTabIndex, this.selectedRowIndex, 12);
            } else if (this.selectedRowIndex === Math.ceil(this.accessoryWindow.accessories.length / 11) && 
                       this.selectedColumnIndex === (this.accessoryWindow.accessories.length - 1) % 11 + 1) {
              this.updateSelection(this.selectedTabIndex, this.selectedRowIndex, 12);
            } else if (this.selectedColumnIndex === 12) {
              this.updateSelection(this.selectedTabIndex, this.selectedTabIndex, 0);
            } else {
              this.updateSelection(
                this.selectedTabIndex,
                this.selectedRowIndex,
                this.selectedColumnIndex + 1,
                true
              );
            }
          } else {
            if (this.selectedColumnIndex === 3 && this.selectedRowIndex === 0) {
              this.updateSelection(this.selectedTabIndex, this.selectedTabIndex, 0);
            } else if (this.selectedRowIndex === Math.ceil(this.accessoryWindow.accessories.length / 11) && 
                       this.selectedColumnIndex === (this.accessoryWindow.accessories.length - 1) % 11 + 1) {
              this.updateSelection(this.selectedTabIndex, this.selectedTabIndex, 0);
            } else if (this.selectedColumnIndex === 11) {
              this.updateSelection(this.selectedTabIndex, this.selectedTabIndex, 0);
            } else {
              this.updateSelection(
                this.selectedTabIndex,
                this.selectedRowIndex,
                this.selectedColumnIndex + 1,
                true
              );
            }
          }
        }
      } else if (keyB.get("Menu_NavLeft")[3].includes(key)) {
        if (this.selectedTabIndex === 1) {
          if (this.selectedColumnIndex === 2 && this.dropdowns[1].opened) {
            if (this.selectedRowIndex > this.dropdowns[0].options.length) {
              this.updateSelection(this.selectedTabIndex, this.dropdowns[0].options.length, 1);
            } else {
              this.updateSelection(this.selectedTabIndex, this.selectedRowIndex, 1);
            }
          } else if (this.accessoryDetails.currentAccessory !== null) {
            if (this.selectedColumnIndex === 0) {
              this.updateSelection(this.selectedTabIndex, this.selectedRowIndex, 12);
            } else if (this.selectedColumnIndex === 1) {
              this.updateSelection(this.selectedTabIndex, this.selectedTabIndex, 0);
            } else if (this.selectedColumnIndex === 12 && this.selectedRowIndex === 0) {
              this.updateSelection(this.selectedTabIndex, this.selectedRowIndex, 3);
            } else if (this.selectedColumnIndex === 12 && 
                       this.selectedRowIndex === Math.ceil(this.accessoryWindow.accessories.length / 11)) {
              this.updateSelection(
                this.selectedTabIndex, 
                this.selectedRowIndex, 
                (this.accessoryWindow.accessories.length - 1) % 11 + 1
              );
            } else {
              this.updateSelection(
                this.selectedTabIndex,
                this.selectedRowIndex,
                this.selectedColumnIndex - 1,
                true
              );
            }
          } else {
            if (this.selectedColumnIndex === 0) {
              if (this.selectedRowIndex === 0) {
                this.updateSelection(this.selectedTabIndex, this.selectedRowIndex, 3);
              } else if (this.selectedRowIndex === Math.ceil(this.accessoryWindow.accessories.length / 11)) {
                this.updateSelection(
                  this.selectedTabIndex, 
                  this.selectedRowIndex, 
                  (this.accessoryWindow.accessories.length - 1) % 11 + 1
                );
              } else {
                this.updateSelection(this.selectedTabIndex, this.selectedRowIndex, 11);
              }
            } else if (this.selectedColumnIndex === 1 && !this.dropdowns[0].opened) {
              this.updateSelection(this.selectedTabIndex, this.selectedTabIndex, 0);
            } else {
              this.updateSelection(
                this.selectedTabIndex,
                this.selectedRowIndex,
                this.selectedColumnIndex - 1,
                true
              );
            }
          }
        }
      } else if (keyB.get("Menu_Confirm")[3].includes(key)) {
        if (this.selectedRowIndex === -1) {
          this.gD.currentPage = this.menu;
        } else if (this.selectedTabIndex === 1) {
          if (this.selectedRowIndex === 0 && (this.selectedColumnIndex === 1 || this.selectedColumnIndex === 2)) {
            if (this.dropdowns[this.selectedColumnIndex - 1].opened) {
              this.dropdowns[this.selectedColumnIndex - 1].close();
            } else {
              this.dropdowns[this.selectedColumnIndex - 1].open();
            }
          } else if (this.selectedRowIndex === 0 && this.selectedColumnIndex === 3) {
            this.dropdowns.map(dropdown => {
              dropdown.reset();
            }, this);
            this.accessoryWindow.setAccessories(this, this.dropdowns[1].currentOption);
          } else if ((this.selectedColumnIndex === 1 && this.dropdowns[0].opened) ||
                     (this.selectedColumnIndex === 2 && this.dropdowns[1].opened)) {
            if (this.selectedRowIndex !== 0) {
              this.dropdowns[this.selectedColumnIndex - 1]
                .setOption(this.dropdowns[this.selectedColumnIndex - 1].options[this.selectedRowIndex - 1]);
              this.accessoryWindow.setAccessories(this, this.dropdowns[1].currentOption);
              this.vScroll(0);
              if (this.selectedColumnIndex === 1) {
                this.dropdowns[0].close();
                this.updateSelection(this.selectedTabIndex, 0, 1);
              }
            }
          } else if (this.selectedColumnIndex !== 0 && this.selectedRowIndex !== 0) {
            if (this.selectedColumnIndex === 12 && this.accessoryDetails.currentAccessory !== null && !this.accessoryDetails.currentAccessory.bought) {
              this.buyAccessory(this.accessoryDetails.currentAccessory);
            } else {
              if (this.currentlyMarked !== null) {
                this.accessoryWindow.demark(this.currentlyMarked);
              }
              this.accessoryDetails.setAccessory();
              if (this.currentlyMarked !== (this.selectedRowIndex - 1) * 11 + this.selectedColumnIndex - 1) {
                this.accessoryWindow.mark((this.selectedRowIndex - 1) * 11 + this.selectedColumnIndex - 1);
                this.accessoryDetails
                  .setAccessory(this.accessoryWindow.accessories[(this.selectedRowIndex - 1) * 11 + this.selectedColumnIndex - 1]);
                this.currentlyMarked = (this.selectedRowIndex - 1) * 11 + this.selectedColumnIndex - 1;
              } else {
                this.currentlyMarked = null;
                this.accessoryWindow.setAccessories(this, this.dropdowns[1].currentOption);
                this.updateSelection(this.selectedTabIndex, 0, this.selectedColumnIndex);
              }
            }
          }
        }
      } else if (keyB.get("Mute_All")[3].includes(key)) {
        this.gD.muted = !this.gD.muted;
        this.menu.muteButton.setSprite();
      }
    }, this);
  };
  this.updateMouseMoves = function() {
    let mouseDown = this.gD.mouseDown.pop();
    let mouseUp = this.gD.mouseUp.pop();
    let dropdownOpen = false;

    if (!this.movingTree && !this.movingMinimap) {
      this.tabs.map((tab, index) => {
        if (this.gD.mousePos.x >= tab.x && this.gD.mousePos.x <= tab.x + tab.tabHeadWidth &&
            this.gD.mousePos.y >= tab.y + index * tab.tabHeadHeight &&
            this.gD.mousePos.y <= tab.y + (index + 1) * tab.tabHeadHeight) {
          this.updateSelection(index, index, 0);
        }
      }, this);

      if (this.gD.mousePos.x >= this.backToMenu.x && this.gD.mousePos.x <= this.backToMenu.x + this.backToMenu.width &&
          this.gD.mousePos.y >= this.backToMenu.y && this.gD.mousePos.y <= this.backToMenu.y + this.backToMenu.height) {
        this.updateSelection(this.selectedTabIndex, -1, 0);
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
    } else if (this.tabs[1].selected) {
      if (this.gD.mousePos.x >= this.resetButton.x && this.gD.mousePos.x <= this.resetButton.x + this.resetButton.width &&
          this.gD.mousePos.y >= this.resetButton.y && this.gD.mousePos.y <= this.resetButton.y + this.resetButton.height) {
        this.updateSelection(this.selectedTabIndex, 0, 3);
      }

      this.dropdowns.map((dropdown, index) => {
        if (this.gD.mousePos.x >= dropdown.x && this.gD.mousePos.x <= dropdown.x + dropdown.width &&
            this.gD.mousePos.y >= dropdown.y && this.gD.mousePos.y <= dropdown.y + dropdown.height) {
          this.updateSelection(this.selectedTabIndex, 0, index + 1);
        }
        if (dropdown.opened) {
          dropdown.options.map((option, indexOption) => {
            if (this.gD.mousePos.x >= dropdown.x && this.gD.mousePos.x < dropdown.x + dropdown.width &&
                this.gD.mousePos.y >= dropdown.y + (indexOption + 1) * dropdown.height &&
                this.gD.mousePos.y < dropdown.y + (indexOption + 2) * dropdown.height) {
              this.updateSelection(1, indexOption + 1, index + 1);
            }
          }, this);
          dropdownOpen = true;
        }
      }, this);

      if (!dropdownOpen) {
        this.accessoryWindow.accessories.map((accessory, index) => {
          if (this.gD.mousePos.x >= this.accessoryWindow.x + 2 + (index % 11) * 50 &&
              this.gD.mousePos.x <= this.accessoryWindow.x + 42 + (index % 11) * 50 &&
              this.gD.mousePos.y >= this.accessoryWindow.y + 27 + Math.floor(index / 11) * 75 - this.scrollHeight &&
              this.gD.mousePos.y <= this.accessoryWindow.y + 92 + Math.floor(index / 11) * 75 - this.scrollHeight &&
              this.gD.mousePos.y >= this.accessoryWindow.y + 27 &&
              this.gD.mousePos.y <= this.accessoryWindow.y + this.accessoryWindow.height) {
            this.updateSelection(this.selectedTabIndex, Math.floor(index / 11) + 1, (index % 11) + 1);
          }
        }, this);
      }

      if (this.gD.mousePos.x >= this.accessoryDetails.buyButton.x &&
          this.gD.mousePos.x <= this.accessoryDetails.buyButton.x + this.accessoryDetails.buyButton.width &&
          this.gD.mousePos.y >= this.accessoryDetails.buyButton.y &&
          this.gD.mousePos.y <= this.accessoryDetails.buyButton.y + this.accessoryDetails.buyButton.height &&
          this.accessoryDetails.currentAccessory !== null) {
        this.updateSelection(this.selectedTabIndex, this.selectedRowIndex, 12);
      }
    }
  };
  this.updateClick = function() {
    let clickPos = this.gD.clicks.pop();
    let dropdownOpen = false;
    let dropdownClicked = false;

    if (!clickPos) {
      return;
    }

    if (clickPos.x >= this.backToMenu.x && clickPos.x <= this.backToMenu.x + this.backToMenu.width &&
      clickPos.y >= this.backToMenu.y && clickPos.y <= this.backToMenu.y + this.backToMenu.height) {
      this.gD.currentPage = this.menu;
    }

    if (this.tabs[0].selected) {
      this.skillTree.skills.map(skill => {
        let skillX = skill.x - (this.skillTree.currentPosX - this.skillTree.moveX);
        let skillY = skill.y - (this.skillTree.currentPosY - this.skillTree.moveY);
        if (Math.sqrt((this.gD.mousePos.x - skillX) ** 2 + (this.gD.mousePos.y - skillY) ** 2) <= skill.radius) {
          this.levelSkills(skill);
        }
      }, this);
    } else if (this.tabs[1].selected) {
      if (clickPos.x >= this.resetButton.x && clickPos.x <= this.resetButton.x + this.resetButton.width &&
          clickPos.y >= this.resetButton.y && clickPos.y <= this.resetButton.y + this.resetButton.height) {
        this.dropdowns.map(dropdown => {
          dropdown.reset();
        }, this);
        this.accessoryWindow.setAccessories(this, this.dropdowns[1].currentOption);
      }

      this.dropdowns.map((dropdown, index) => {
        if (clickPos.x >= dropdown.x && clickPos.x <= dropdown.x + dropdown.width &&
            clickPos.y >= dropdown.y && clickPos.y <= dropdown.y + dropdown.height) {
          if (dropdown.opened) {
            dropdown.close();
          } else {
            dropdown.open();
            dropdownClicked = true;
          }
        }
        if (dropdown.opened) {
          dropdown.options.map((option, indexOption) => {
            if (clickPos.x >= dropdown.x && clickPos.x < dropdown.x + dropdown.width &&
                clickPos.y >= dropdown.y + (indexOption + 1) * dropdown.height &&
                clickPos.y < dropdown.y + (indexOption + 2) * dropdown.height) {
              dropdown.setOption(option);
              dropdownClicked = true;
              this.accessoryWindow.setAccessories(this, this.dropdowns[1].currentOption);
              this.vScroll(0);
              if (index === 0) {
                dropdown.close();
              }
            }
          }, this);
          dropdownOpen = true;
        }
      }, this);

      if (!dropdownClicked && dropdownOpen) {
        this.dropdowns.map(dropdown => {
          dropdown.close();
        }, this);
      }

      if (!dropdownOpen) {
        this.accessoryWindow.accessories.map((accessory, index) => {
          if (clickPos.x >= this.accessoryWindow.x + 2 + (index % 11) * 50 &&
              clickPos.x <= this.accessoryWindow.x + 42 + (index % 11) * 50 &&
              clickPos.y >= this.accessoryWindow.y + 27 + Math.floor(index / 11) * 75 - this.scrollHeight &&
              clickPos.y <= this.accessoryWindow.y + 92 + Math.floor(index / 11) * 75 - this.scrollHeight &&
              clickPos.y >= this.accessoryWindow.y + 27 &&
              clickPos.y <= this.accessoryWindow.y + this.accessoryWindow.height) {
            if (this.currentlyMarked !== null) {
              this.accessoryWindow.demark(this.currentlyMarked);
            }
            this.accessoryDetails.setAccessory();
            if (this.currentlyMarked !== index) {
              this.accessoryWindow.mark(index);
              this.accessoryDetails.setAccessory(accessory);
              this.currentlyMarked = index;
            } else {
              this.currentlyMarked = null;
              this.accessoryWindow.setAccessories(this, this.dropdowns[1].currentOption);
            }
          }
        }, this);
      }

      if (clickPos.x >= this.accessoryDetails.buyButton.x &&
          clickPos.x <= this.accessoryDetails.buyButton.x + this.accessoryDetails.buyButton.width &&
          clickPos.y >= this.accessoryDetails.buyButton.y &&
          clickPos.y <= this.accessoryDetails.buyButton.y + this.accessoryDetails.buyButton.height &&
          this.accessoryDetails.currentAccessory !== null) {
        this.buyAccessory(this.accessoryDetails.currentAccessory);
      }
    }
  };
  this.updateWheelMoves = function() {
    let wheelMove = this.gD.wheelMovements.pop();
    if (!wheelMove || this.accessoryWindow.accessories.length < 23) {
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
    this.menu.lightUpdate();
    
    this.tabs.map(tab => {
      tab.update(this);
    }, this);

    this.backToMenu.update();
  };
  this.draw = function(ghostFactor) {
    this.gD.context.drawImage(this.menu.backgroundImage, 0, 0);

    this.title.draw(this.gD);
    
    this.moneyDisplay.draw(this, this.gD);

    this.tabs.map(tab => {
      tab.draw(this.gD, this);
    }, this);

    this.backToMenu.draw(this.gD);
    this.menu.lightDraw();
  };
  /**
   * updates the selected object and deselects the old object
   * @param {number} tabIndex the tab of the new selected object
   * @param {number} rowIndex the row of the new selected object
   * @param {number} columnIndex the column of the new selected object
   * @param {boolean} keyboard if the command comes from the keyboard (for scrolling)
   */
  this.updateSelection = function(tabIndex, rowIndex, columnIndex, keyboard = false) {
    if (this.selectedTabIndex !== undefined && this.selectedRowIndex !== undefined &&
        this.selectedColumnIndex !== undefined) {
      if (this.selectedRowIndex === -1) {
        this.backToMenu.deselect();
      }
      this.tabs[this.selectedTabIndex].deselect();
      if (this.selectedColumnIndex !== 0) {
        if (this.selectedTabIndex === 1) {
          if ((this.selectedColumnIndex === 1 && this.dropdowns[0].opened) || 
              (this.selectedColumnIndex === 2 && this.dropdowns[1].opened)) {
            this.dropdowns[this.selectedColumnIndex - 1].deselect(this.selectedRowIndex);
          } else if (this.selectedRowIndex === 0) {
            if (this.selectedColumnIndex === 1 || this.selectedColumnIndex === 2) {
              this.dropdowns[this.selectedColumnIndex - 1].deselect();
            } else if (this.selectedColumnIndex === 3) {
              this.resetButton.deselect();
            } else if (this.selectedColumnIndex === 12) {
              this.accessoryDetails.buyButton.deselect();
            }
          } else {
            if (this.selectedColumnIndex === 12) {
              this.accessoryDetails.buyButton.deselect();
            } else {
              this.accessoryWindow.deselect((this.selectedRowIndex - 1) * 11 + this.selectedColumnIndex - 1);
            }
          }
        }
      }
    }
    
    if (rowIndex === -1) {
      this.backToMenu.select();
    }
    this.tabs[tabIndex].select();
    if (columnIndex !== 0) {
      if (tabIndex === 1) {
        if ((columnIndex === 1 && this.dropdowns[0].opened) || 
            (columnIndex === 2 && this.dropdowns[1].opened)) {
          this.dropdowns[columnIndex - 1].select(rowIndex);
        } else if (rowIndex === 0) {
          if (columnIndex === 1 || columnIndex === 2) {
            this.dropdowns[columnIndex - 1].select();
          } else if (columnIndex === 3) {
            this.resetButton.select();
          } else if (columnIndex === 12) {
            this.accessoryDetails.buyButton.select();
          }
        } else {
          if (columnIndex === 12) {
            this.accessoryDetails.buyButton.select();
          } else {
            this.accessoryWindow.select((rowIndex - 1) * 11 + columnIndex - 1);
            if (keyboard) {
              this.vScroll(
                Math.max(
                  Math.min(
                    (Math.ceil(this.accessoryWindow.accessories.length / 11) * 3) - 7,
                    (rowIndex - 1) * 3 - 1
                  ),
                  0
                )
              );
            }
          }
        }
      }
    }
    
    this.selectedRowIndex = rowIndex;
    this.selectedTabIndex = tabIndex;
    this.selectedColumnIndex = columnIndex;
  };
}

function ShopMoneyDisplay(x, y, width, height, styleKey) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.styleKey = styleKey;
  this.draw = function(shop, gD) {
    let design = gD.design.elements[this.styleKey];
    
    drawCanvasRect(this.x, this.y, this.width, this.height, design.rectKey.background, gD);
    drawCanvasRect(this.x + 5, this.y + 5, this.width - 10, 13, design.rectKey.hype, gD);
    drawCanvasImage(this.x + 7, this.y + 7, "Currency_XS", gD);
    drawCanvasText(this.x + this.width - 8, this.y + 11.5, shop.hype.toString().replace(/\d(?=(\d{3})+($|\.))/g, '$&.'), design.textKey.value, gD);
    drawCanvasRectBorder(this.x + 5, this.y + 5, this.width - 10, 13, design.borderKey, gD);
    drawCanvasRect(this.x + 5, this.y + 23, this.width - 10, 13, design.rectKey.goldenShamrock, gD);
    drawCanvasImage(this.x + 7, this.y + 25, "Special_GoldenShamrock_S", gD);
    drawCanvasText(this.x + this.width - 8, this.y + 29.5, shop.goldenShamrocks.toString().replace(/\d(?=(\d{3})+($|\.))/g, '$&.'), design.textKey.value, gD);
    drawCanvasRectBorder(this.x + 5, this.y + 23, this.width - 10, 13, design.borderKey, gD);
    drawCanvasRectBorder(this.x, this.y, this.width, this.height, design.borderKey, gD);
  };
}

function SkillData(name, showValue, valueFunction, maxValue, costHypeFunction, costGSFunction, unlockedBy, unlockedAt) {
  this.name = name;
  this.showValue = showValue;
  this.valueFunction = valueFunction;
  this.maxValue = maxValue;
  this.costHypeFunction = costHypeFunction;
  this.costGSFunction = costGSFunction;
  this.unlockedBy = unlockedBy;
  this.unlockedAt = unlockedAt;
  this.currentLevel = 0;
  this.unlocked = false;
  this.maxed = false;
  this.getValue = function() {
    return this.valueFunction(this.currentLevel);
  };
  this.checkUnlock = function(shop) {
    let levels = 0;

    this.unlockedBy.map(key => {
      if (key === "Deaths") {
        if (shop.skillData["character_upgrades"].unlocked) {
          levels = shop.menu.statistics.statistics.get("player_deaths").currentCount;
        }
      } else {
        levels += shop.skillData[key].currentLevel;
      }
    }, this);

    if (levels >= this.unlockedAt) {
      this.unlocked = true;
    }
  };
  this.levelUp = function() {
    if (this.currentLevel < this.maxValue && this.unlocked) {
      this.currentLevel++;
      if (this.currentLevel >= this.maxValue) {
        this.maxed = true;
      }
    }
  };
  this.getCost = function() {
    return {
      goldenShamrock: Math.floor(this.costGSFunction(this.currentLevel)),
      hype: Math.floor(this.costHypeFunction(this.currentLevel))
    };
  };
  this.getSaveData = function() {
    return [this.unlocked, this.maxed, this.currentLevel];
  };
  this.setSaveData = function(data) {
    [this.unlocked, this.maxed, this.currentLevel] = data;
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
    this.skills.push(new ShopSkill(this.x + 475, this.y + 80, 40, "unlock_skilltree", "", "shopSkillStandard"));
    this.skills.push(new ShopSkill(this.x + 140, this.y + 190, 40, "money_multiplier", "", "shopSkillMoney"));
    this.lines.push({startX: 475, startY: 80, endX: 140, endY: 190});
    this.skills.push(new ShopSkill(this.x + 475, this.y + 280, 40, "level_up_items", "", "shopSkillItem"));
    this.lines.push({startX: 475, startY: 80, endX: 475, endY: 280});
    this.skills.push(new ShopSkill(this.x + 265, this.y + 370, 40, "level_up_stopwatch", "Skill_Stopwatch_level_up", "shopSkillItem"));
    this.skills.push(new ShopSkill(this.x + 335, this.y + 440, 40, "level_up_star", "Skill_Star_level_up", "shopSkillItem"));
    this.skills.push(new ShopSkill(this.x + 425, this.y + 490, 40, "level_up_feather", "Skill_Feather_level_up", "shopSkillItem"));
    this.skills.push(new ShopSkill(this.x + 525, this.y + 490, 40, "level_up_treasure", "Skill_Treasure_level_up", "shopSkillItem"));
    this.skills.push(new ShopSkill(this.x + 615, this.y + 440, 40, "level_up_magnet", "Skill_Magnet_level_up", "shopSkillItem"));
    this.skills.push(new ShopSkill(this.x + 685, this.y + 370, 40, "level_up_rocket", "Skill_Rocket_level_up", "shopSkillItem"));
    this.lines.push({startX: 475, startY: 280, endX: 265, endY: 370});
    this.lines.push({startX: 475, startY: 280, endX: 335, endY: 440});
    this.lines.push({startX: 475, startY: 280, endX: 425, endY: 490});
    this.lines.push({startX: 475, startY: 280, endX: 525, endY: 490});
    this.lines.push({startX: 475, startY: 280, endX: 615, endY: 440});
    this.lines.push({startX: 475, startY: 280, endX: 685, endY: 370});
    this.skills.push(new ShopSkill(this.x + 140, this.y + 425, 40, "start_amount_stopwatch", "Skill_Stopwatches_at_start", "shopSkillItem"));
    this.skills.push(new ShopSkill(this.x + 250, this.y + 545, 40, "start_amount_star", "Skill_Stars_at_start", "shopSkillItem"));
    this.skills.push(new ShopSkill(this.x + 395, this.y + 615, 40, "start_amount_feather", "", "shopSkillItem"));
    this.skills.push(new ShopSkill(this.x + 555, this.y + 615, 40, "start_amount_treasure", "", "shopSkillItem"));
    this.skills.push(new ShopSkill(this.x + 700, this.y + 545, 40, "start_amount_magnet", "", "shopSkillItem"));
    this.skills.push(new ShopSkill(this.x + 810, this.y + 425, 40, "start_amount_rocket", "", "shopSkillItem"));
    this.lines.push({startX: 265, startY: 370, endX: 140, endY: 425});
    this.lines.push({startX: 335, startY: 440, endX: 250, endY: 545});
    this.lines.push({startX: 425, startY: 490, endX: 395, endY: 615});
    this.lines.push({startX: 525, startY: 490, endX: 555, endY: 615});
    this.lines.push({startX: 615, startY: 440, endX: 700, endY: 545});
    this.lines.push({startX: 685, startY: 370, endX: 810, endY: 425});
    this.skills.push(new ShopSkill(this.x + 475, this.y + 730, 40, "item_spawn_frequency", "", "shopSkillItem"));
    this.lines.push({startX: 475, startY: 280, endX: 475, endY: 730});
    this.skills.push(new ShopSkill(this.x + 810, this.y + 170, 40, "character_upgrades", "", "shopSkillCharacter"));
    this.lines.push({startX: 475, startY: 80, endX: 810, endY: 170});
    this.skills.push(new ShopSkill(this.x + 1050, this.y + 170, 40, "movement_speed", "", "shopSkillCharacter"));
    this.skills.push(new ShopSkill(this.x + 1050, this.y + 270, 40, "jump_height", "", "shopSkillCharacter"));
    this.skills.push(new ShopSkill(this.x + 1050, this.y + 400, 40, "jumps", "", "shopSkillCharacter"));
    this.skills.push(new ShopSkill(this.x + 1050, this.y + 530, 40, "extra_life", "", "shopSkillCharacter"));
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
    let name = skillData.name.split(' ');

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
        drawCanvasText(newX, newY + 14, addLeadingZero(skillData.currentLevel) + "/" + skillData.maxValue, design.textKey, gD);
      } else {
        drawCanvasText(newX, newY + 14, skillData.currentLevel + "/" + skillData.maxValue, design.textKey, gD);
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
        goldenShamrock.toString().replace(/\d(?=(\d{3})+($|\.))/g, '$&.'), shop.goldenShamrocks < goldenShamrock ? design.textKey.noMoney : design.textKey.text, gD
      );
      drawCanvasImage(Math.floor(newX - this.width / 2 + 3), Math.floor(newY + this.radius + 49), "Currency_S", gD);
      drawCanvasText(
        newX + this.width / 2 - 3, newY + this.radius + 59,
        hype.toString().replace(/\d(?=(\d{3})+($|\.))/g, '$&.'), shop.hype < hype ? design.textKey.noMoney : design.textKey.text, gD
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
  this.getSaveData = function() {
    return this.bought;
  };
  this.setSaveData = function(data) {
    this.bought = data;
  };
}

function ShopAccessoryWindow(x, y, width, height, styleKey) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.styleKey = styleKey;
  this.accessories = [];
  this.arrowWidth = [];
  this.arrowHeight = [];
  this.selected = [];
  this.marked = [];
  this.animationSpeed = 12;
  this.setAccessories = function(shop, categories) {
    this.accessories = [];
    this.arrowWidth = [];
    this.arrowHeight = [];
    this.selected = [];
    this.marked = [];
    shop.currentlyMarked = null;
    shop.accessoryDetails.setAccessory();

    for (let accessory of shop.accessories.values()) {
      if (categories.includes("Only buyable") && accessory.bought) {
        continue;
      }
      if (categories.includes(accessory.category)) {
        this.accessories.push(accessory);
        this.arrowWidth.push(0);
        this.arrowHeight.push(0);
        this.selected.push(false);
        this.marked.push(false);
      }
    }
    shop.scrollbar.refresh(Math.ceil(this.accessories.length / 11) * 3);
    this.sortAccessories(shop.dropdowns[0].currentOption);
  };
  this.sortAccessories = function(sortType) {
    if (sortType === "Category") {
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
    } else if (sortType === "Category reverse") {
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
    } else if (sortType === "Alphabetic") {
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
    } else if (sortType === "Alphabetic reverse") {
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
    } else if (sortType === "Price Hype exp") {
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
    } else if (sortType === "Price Hype cheap") {
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
    } else if (sortType === "Price GS exp") {
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
    } else if (sortType === "Price GS cheap") {
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
    }
  };
  this.select = function(index = 0) {
    this.selected[index] = true;
  };
  this.deselect = function(index = 0) {
    this.selected[index] = false;
  };
  this.mark = function(index) {
    this.marked[index] = true;
  };
  this.demark = function(index) {
    this.marked[index] = false;
  };
  this.update = function() {
    this.selected.map((select, index) => {
      if (select) {
        if (this.arrowHeight[index] < 65) {
          this.arrowHeight[index] += this.animationSpeed;
          if (this.arrowHeight[index] >= 65) {
            this.arrowHeight[index] = 65;
          }
        } else if (this.arrowHeight[index] >= 65 && this.arrowWidth[index] < 40) {
          this.arrowWidth[index] += this.animationSpeed;
          if (this.arrowWidth[index] >= 40) {
            this.arrowWidth[index] = 40;
          }
        }
      } else {
        if (this.arrowWidth[index] > 0) {
          this.arrowWidth[index] -= this.animationSpeed;
          if (this.arrowWidth[index] <= 0) {
            this.arrowWidth[index] = 0;
          }
        } else if (this.arrowWidth[index] <= 0 && this.arrowHeight[index] > 0) {
          this.arrowHeight[index] -= this.animationSpeed;
          if (this.arrowHeight[index] <= 0) {
            this.arrowHeight[index] = 0;
          }
        }
      }
    }, this);
  };
  this.draw = function(gD, shop) {
    let design = gD.design.elements[this.styleKey];

    gD.context.save();
    gD.context.beginPath();
    gD.context.rect(this.x, this.y + 25, this.width, this.height - 25);
    gD.context.clip();
    this.accessories.map((accessory, index) => {
      let spriteData = getSpriteData(accessory.spriteKey, gD);
      let centerX = this.x + 22 + (index % 11) * 50;
      let centerY = this.y + 59.5 + Math.floor(index / 11) * 75 - shop.scrollHeight;

      drawCanvasRect(
        this.x + 2 + (index % 11) * 50, this.y + 27 + Math.floor(index / 11) * 75 - shop.scrollHeight, 40, 65,
        design.rectKey.accessory[accessory.category.toLowerCase()], gD
      );
      drawCanvasPolygon(
        centerX + this.arrowWidth[0] / 2, centerY - this.arrowHeight[index] / 2, design.rectKey.selected, gD,
        centerX + Math.min(this.arrowWidth[index] / 2 + this.arrowHeight[index] / 2, 20),
        centerY - Math.max((this.arrowWidth[index] / 2 + this.arrowHeight[index] / 2) - 20, 0),
        centerX + Math.min(this.arrowWidth[index] / 2 + this.arrowHeight[index] / 2, 20),
        centerY + Math.max((this.arrowWidth[index] / 2 + this.arrowHeight[index] / 2) - 20, 0),
        centerX + this.arrowWidth[index] / 2, centerY + this.arrowHeight[index] / 2,
        centerX - this.arrowWidth[index] / 2, centerY + this.arrowHeight[index] / 2,
        centerX - Math.min(this.arrowWidth[index] / 2 + this.arrowHeight[index] / 2, 20),
        centerY + Math.max((this.arrowWidth[index] / 2 + this.arrowHeight[index] / 2) - 20, 0),
        centerX - Math.min(this.arrowWidth[index] / 2 + this.arrowHeight[index] / 2, 20),
        centerY - Math.max((this.arrowWidth[index] / 2 + this.arrowHeight[index] / 2) - 20, 0),
        centerX - this.arrowWidth[index] / 2, centerY - this.arrowHeight[index] / 2
      );
      if (this.marked[index]) {
        drawCanvasRect(
          this.x + 2 + (index % 11) * 50, this.y + 27 + Math.floor(index / 11) * 75 - shop.scrollHeight, 40, 65,
          design.rectKey.marked, gD
        );
      }
      drawCanvasRect(
        this.x + 7 + (index % 11) * 50, this.y + 32 + Math.floor(index / 11) * 75 - shop.scrollHeight, 30, 30,
        design.rectKey.accessory.standard, gD
      );
      drawCanvasImage(
        this.x + 22 - Math.floor(spriteData.spriteWidth / 2) + (index % 11) * 50,
        this.y + 47 - Math.floor(spriteData.spriteHeight / 2) + Math.floor(index / 11) * 75 - shop.scrollHeight,
        accessory.spriteKey, gD
      );
      drawCanvasRectBorder(
        this.x + 7 + (index % 11) * 50, this.y + 32 + Math.floor(index / 11) * 75 - shop.scrollHeight, 30, 30,
        design.borderKey.accessory, gD
      );
      if (accessory.bought) {
        drawCanvasLine(
          this.x + 12 + (index % 11) * 50, this.y + 77 + Math.floor(index / 11) * 75 - shop.scrollHeight,
          design.borderKey.hook, gD,
          this.x + 19 + (index % 11) * 50, this.y + 84 + Math.floor(index / 11) * 75 - shop.scrollHeight,
          this.x + 32 + (index % 11) * 50, this.y + 71 + Math.floor(index / 11) * 75 - shop.scrollHeight,
        )
      }
      drawCanvasRectBorder(
        this.x + 2 + (index % 11) * 50, this.y + 27 + Math.floor(index / 11) * 75 - shop.scrollHeight, 40, 65,
        design.borderKey.accessory, gD
      );
    }, this);

    gD.context.restore();
  };
}

function ShopDropdownMenu(x, y, width, height, options, styleKey, multipleOptions = false) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.options = options;
  this.styleKey = styleKey;
  this.multipleOptions = multipleOptions;
  this.currentOption = multipleOptions ? options : options[0];
  this.arrowWidth = new Array(options.length + 1).fill(0);
  this.arrowHeight = new Array(options.length + 1).fill(0);
  this.animationSpeeds = [6, 12, 12, 6];
  this.optionsHeight = 0;
  this.rotation = 0;
  this.selected = new Array(options.length + 1).fill(false);
  this.opened = false;
  this.select = function(index = 0) {
    this.selected[index] = true;
  };
  this.deselect = function(index = 0) {
    this.selected[index] = false;
  };
  this.open = function() {
    this.opened = true;
  };
  this.close = function() {
    this.opened = false;
  };
  this.setOption = function(option) {
    if (this.multipleOptions) {
      if (this.currentOption.includes(option)) {
        this.currentOption = this.currentOption.filter(word => word !== option);
      } else {
        this.currentOption.push(option)
      }
    } else {
      this.currentOption = option;
    }
  };
  this.reset = function() {
    if (this.multipleOptions) {
      this.currentOption = this.options;
    } else {
      this.currentOption = this.options[0];
    }
    this.opened = false;
  };
  this.update = function() {
    this.selected.map((select, index) => {
      let width = this.width;
      let speed = this.animationSpeeds[1];
      if (index === 0) {
        width = 20;
        speed = this.animationSpeeds[0];
      }
      if (select) {
        if (this.arrowHeight[index] < this.height) {
          this.arrowHeight[index] += speed;
          if (this.arrowHeight[index] >= this.height) {
            this.arrowHeight[index] = this.height;
          }
        } else if (this.arrowHeight[index] >= this.height && this.arrowWidth[index] < width) {
          this.arrowWidth[index] += speed;
          if (this.arrowWidth[index] >= width) {
            this.arrowWidth[index] = width;
          }
        }
      } else {
        if (this.arrowWidth[index] > 0) {
          this.arrowWidth[index] -= speed;
          if (this.arrowWidth[index] <= 0) {
            this.arrowWidth[index] = 0;
          }
        } else if (this.arrowWidth[index] <= 0 && this.arrowHeight[index] > 0) {
          this.arrowHeight[index] -= speed;
          if (this.arrowHeight[index] <= 0) {
            this.arrowHeight[index] = 0;
          }
        }
      }
    }, this);
    if (this.opened) {
      if (this.rotation < 180) {
        this.rotation += this.animationSpeeds[2];
        if (this.rotation > 180) {
          this.rotation = 180;
        }
      }
      if (this.optionsHeight < this.options.length * this.height) {
        this.optionsHeight += this.animationSpeeds[3];
        if (this.optionsHeight > this.options.length * this.height) {
          this.optionsHeight = this.options.length * this.height;
        }
      }
    } else {
      if (this.rotation > 0) {
        this.rotation -= this.animationSpeeds[2];
        if (this.rotation < 0) {
          this.rotation = 0;
        }
      }
      if (this.optionsHeight > 0) {
        this.optionsHeight -= this.animationSpeeds[3];
        if (this.optionsHeight < 0) {
          this.optionsHeight = 0;
        }
      }
    }
  };
  this.draw = function(gD) {
    let design = gD.design.elements[this.styleKey];
    let centerX = this.x + 10;
    let centerY = this.y + this.height / 2;

    drawCanvasRect(this.x, this.y, this.width, this.height, design.rectKey.background, gD);
    drawCanvasPolygon(
      centerX + this.arrowWidth[0] / 2, centerY - this.arrowHeight[0] / 2, design.rectKey.selected, gD,
      centerX + Math.min(this.arrowWidth[0] / 2 + this.arrowHeight[0] / 2, 10),
      centerY - Math.max((this.arrowWidth[0] / 2 + this.arrowHeight[0] / 2) - 10, 0),
      centerX + Math.min(this.arrowWidth[0] / 2 + this.arrowHeight[0] / 2, 10),
      centerY + Math.max((this.arrowWidth[0] / 2 + this.arrowHeight[0] / 2) - 10, 0),
      centerX + this.arrowWidth[0] / 2, centerY + this.arrowHeight[0] / 2,
      centerX - this.arrowWidth[0] / 2, centerY + this.arrowHeight[0] / 2,
      centerX - Math.min(this.arrowWidth[0] / 2 + this.arrowHeight[0] / 2, 10),
      centerY + Math.max((this.arrowWidth[0] / 2 + this.arrowHeight[0] / 2) - 10, 0),
      centerX - Math.min(this.arrowWidth[0] / 2 + this.arrowHeight[0] / 2, 10),
      centerY - Math.max((this.arrowWidth[0] / 2 + this.arrowHeight[0] / 2) - 10, 0),
      centerX - this.arrowWidth[0] / 2, centerY - this.arrowHeight[0] / 2
    );
    gD.context.translate(this.x + 10, this.y + this.height / 2);
    gD.context.rotate(-this.rotation * Math.PI / 180);
    drawCanvasPolygon(-6, -4, design.rectKey.arrow, gD, 6, -4, 0, 4);
    gD.context.rotate(this.rotation * Math.PI / 180);
    gD.context.translate(-this.x - 10, -this.y - this.height / 2);
    if (this.multipleOptions) {
      if (this.currentOption.toString().length > 23) {
        drawCanvasText(
          this.x + 23, this.y + this.height / 2, this.currentOption.toString().substring(0, 20) + "...",
          design.textKey, gD
        );
      } else {
        drawCanvasText(this.x + 23, this.y + this.height / 2, this.currentOption.toString(), design.textKey, gD);
      }
    } else {
      drawCanvasText(this.x + 23, this.y + this.height / 2, this.currentOption, design.textKey, gD);
    }
    gD.context.save();
    gD.context.rect(this.x, this.y + this.height, this.width, this.optionsHeight);
    gD.context.clip();
    this.options.map((option, index) => {
      let optionCenterX = this.x + this.width / 2;
      let optionCenterY = this.y + (index + 1.5) * this.height;

      drawCanvasRect(this.x, this.y + (index + 1) * this.height, this.width, this.height, design.rectKey.background, gD);
      drawCanvasPolygon(
        optionCenterX + this.arrowWidth[index + 1] / 2, optionCenterY - this.arrowHeight[index + 1] / 2,
        design.rectKey.selected, gD,
        optionCenterX + Math.min(this.arrowWidth[index + 1] / 2 + this.arrowHeight[index + 1] / 2, this.width),
        optionCenterY - Math.max((this.arrowWidth[index + 1] / 2 + this.arrowHeight[index + 1] / 2) - this.width, 0),
        optionCenterX + Math.min(this.arrowWidth[index + 1] / 2 + this.arrowHeight[index + 1] / 2, this.width),
        optionCenterY + Math.max((this.arrowWidth[index + 1] / 2 + this.arrowHeight[index + 1] / 2) - this.width, 0),
        optionCenterX + this.arrowWidth[index + 1] / 2, optionCenterY + this.arrowHeight[index + 1] / 2,
        optionCenterX - this.arrowWidth[index + 1] / 2, optionCenterY + this.arrowHeight[index + 1] / 2,
        optionCenterX - Math.min(this.arrowWidth[index + 1] / 2 + this.arrowHeight[index + 1] / 2, this.width),
        optionCenterY + Math.max((this.arrowWidth[index + 1] / 2 + this.arrowHeight[index + 1] / 2) - this.width, 0),
        optionCenterX - Math.min(this.arrowWidth[index + 1] / 2 + this.arrowHeight[index + 1] / 2, this.width),
        optionCenterY - Math.max((this.arrowWidth[index + 1] / 2 + this.arrowHeight[index + 1] / 2) - this.width, 0),
        optionCenterX - this.arrowWidth[index + 1] / 2, optionCenterY - this.arrowHeight[index + 1] / 2
      );
      if (this.multipleOptions) {
        drawCanvasRectBorder(
          this.x + 3, this.y + (index + 1) * this.height + 3, this.height - 6, this.height - 6, design.borderKey, gD
        );
        if (this.currentOption.includes(option)) {
          drawCanvasLine(
            this.x + 3, this.y + (index + 1) * this.height + 3, design.borderKey, gD,
            this.x + this.height - 3, this.y + (index + 2) * this.height - 3
          );
          drawCanvasLine(
            this.x + this.height - 3, this.y + (index + 1) * this.height + 3, design.borderKey, gD,
            this.x + 3, this.y + (index + 2) * this.height - 3
          );
        }
        drawCanvasText(this.x + this.height + 3, this.y + (index + 1.5) * this.height, option, design.textKey, gD);
      } else {
        drawCanvasText(this.x + 3, this.y + (index + 1.5) * this.height, option, design.textKey, gD);
      }
    }, this);
    gD.context.restore();
    drawCanvasLine(this.x + 20, this.y, design.borderKey, gD, this.x + 20, this.y + 16);
    drawCanvasRectBorder(this.x, this.y, this.width, this.height, design.borderKey, gD);
    drawCanvasRectBorder(this.x, this.y + this.height, this.width, this.optionsHeight, design.borderKey, gD);
  };
}

function ShopAccessoryDetails(x, y, width, height, styleKey) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.styleKey = styleKey;
  this.currentAccessory = null;
  this.init = function() {
    this.buyButton = new CanvasButton(this.x + 10, this.y + this.height - 30, this.width - 20, 20, "Kaufen", "shop");
  };
  this.setAccessory = function(accessory = null) {
    this.currentAccessory = accessory;
  };
  this.update = function() {
    this.buyButton.update();
  };
  this.draw = function(gD) {
    let design = gD.design.elements[this.styleKey];

    if (this.currentAccessory === null) {
      return;
    }

    let spriteKey = this.currentAccessory.spriteKey.split("_");
    let {spriteWidth, spriteHeight} = getSpriteData(spriteKey[0] + "_B_" + spriteKey[1], gD);

    drawCanvasRect(this.x, this.y, this.width, this.height, design.rectKey.background, gD);
    drawCanvasRect(this.x + 60, this.y + 10, 60, 60, design.rectKey.window, gD);
    drawCanvasImage(
      this.x + (this.width - spriteWidth) / 2, this.y + 40 - spriteHeight / 2, spriteKey[0] + "_B_" + spriteKey[1], gD
    );
    drawCanvasRectBorder(this.x + 60, this.y + 10, 60, 60, design.borderKey, gD);
    drawCanvasText(this.x + this.width / 2, this.y + 85, this.currentAccessory.name, design.textKey.name, gD);
    drawCanvasImage(this.x + 10, this.y + this.height - 78, "Special_GoldenShamrock", gD);
    drawCanvasText(
      this.x + this.width - 10, this.y + this.height - 68,
      this.currentAccessory.costGoldenShamrock.toString().replace(/\d(?=(\d{3})+($|\.))/g, '$&.'),
      design.textKey.number, gD
    );
    drawCanvasImage(this.x + 10, this.y + this.height - 55, "Money_1", gD);
    drawCanvasText(
      this.x + this.width - 10, this.y + this.height - 45,
      this.currentAccessory.costHype.toString().replace(/\d(?=(\d{3})+($|\.))/g, '$&.'),
      design.textKey.number, gD
    );
    drawCanvasRectBorder(this.x, this.y, this.width, this.height, design.borderKey, gD);
    if (this.currentAccessory.bought) {
      drawCanvasRect(this.x + 10, this.y + this.height - 30, this.width - 20, 20, design.rectKey.bought, gD);
      drawCanvasText(this.x + this.width / 2, this.y + this.height - 20, "Gekauft", design.textKey.text, gD);
      drawCanvasRectBorder(this.x + 10, this.y + this.height - 30, this.width - 20, 20, design.borderKey, gD);
    } else {
      this.buyButton.draw(gD);
    }
  };
}