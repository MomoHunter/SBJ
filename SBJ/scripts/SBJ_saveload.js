function SaveLoad(menu, gD) {
  this.menu = menu;
  this.gD = gD;
  /**
   * initiates the object
   */
  this.init = function() {
    this.savestates = [];
    this.buttons = ["Save", "Main Menu", "Load"];
    this.scrollHeight = 0;
    this.chooseName = false;
    this.choosePicture = false;
    this.chooseSave = false;
    this.loaded = false;
    this.changed = false;
    this.confirmChange = false;
    this.loadedStates = [];
    this.removed = [];

    this.loadFile();

    this.title = new CanvasText(this.gD.canvas.width / 2, 30, "Save / Load", "pageTitle");

    this.infoText = new CanvasText(this.gD.canvas.width / 2, this.gD.canvas.height / 2, "", "instruction");

    this.buttons.map((name, index) => {
      this.buttons[index] = new CanvasButton(
        this.gD.canvas.width / 2 - 310 + 210 * index, this.gD.canvas.height - 50, 200, 30, this.buttons[index], "menu"
      );
    }, this);

    this.refreshButton = new CanvasImageButton(
      this.gD.canvas.width - 40, 10, 30, 30, ["Icon_Refresh", "Icon_Refresh_animiert"], "standardImage"
    );
    this.backButton = new CanvasButton(
      this.gD.canvas.width / 2 - 100, this.gD.canvas.height - 50, 200, 30, "Main Menu", "menu"
    );
    this.backButton.select();

    this.scrollBar = new CanvasScrollBar(this.gD.canvas.width / 2 + 320, 60, 220, 55, 0, "scrollBarStandard");

    this.savestateDetails = new SLSavestateDetails(0, 0, this.gD.canvas.width, this.gD.canvas.height, "savestateDetails");

    this.enterNameModal = new CanvasEnterNameModal(
      this.gD.canvas.width / 2 - 207, this.gD.canvas.height / 2 - 45, 414, 90, "enterNameModal"
    );
    this.enterNameModal.init();
    this.choosePictureModal = new CanvasChoosePictureModal(
      this.gD.canvas.width / 2 - 227, this.gD.canvas.height / 2 - 117, 455, 235, "choosePictureModal"
    );
    this.choosePictureModal.init(this.gD);
    this.chooseSaveWindow = new SLChooseWindow(
      this.gD.canvas.width / 2 - 240, this.gD.canvas.height / 2 - 71, 480, 142, "savestateConfirmWindow"
    );
    this.chooseSaveWindow.init();
    
    this.confirmationWindow = new CanvasConfirmationWindow(
      this.gD.canvas.width / 2 - 310, this.gD.canvas.height / 2 - 45, 620, 90, 
      ["Savestates have been changed!", "Save?"], "confirmationWindowSave"
    );
    this.confirmationWindow.init();

    this.updateSelection(-1, 1, false);
  };
  this.handleEvent = function(eventKey, addedValue = 1) {
    this.menu.handleEvent(eventKey, addedValue);
  };
  /**
   * loads the next savestate-file that starts with 'Savestate' and the number from this.filesLoaded
   */
  this.loadFile = function() {
    var saveLoad = this;
    var newScript = document.createElement('script');
    
    newScript.setAttribute('type', 'text/javascript');
    newScript.setAttribute('src', 'saves/Savestates.txt');
    newScript.onload = function() {
      saveLoad.getFileSavestate();
      saveLoad.getLocalSavestate();
      saveLoad.initSavestates();
    };
    newScript.onerror = function(e) {
      console.log("Savestates from file could not be loaded!");
      saveLoad.getLocalSavestate();
      saveLoad.initSavestates();
    };
    document.body.appendChild(newScript);
  };
  /**
   * creates the savestate-object with the correct filename
   */
  this.getFileSavestate = function() {
    for (let func in window) {
      if (typeof window[func] === 'function' && func === 'Savestates') {
        let savestate = new window[func];
        let pos = 0;
        savestate.data.map(sstate => {
          if (!this.removed.includes(sstate.date)) {
            sstate.file = "Savestate";
            this.savestates.map((state, index) => {
              if (state.date > sstate.date) {
                pos = index + 1;
              }
            }, this);
            this.savestates.splice(pos, 0, sstate);
          }
        }, this);
        break;
      }
    }
  };
  this.getLocalSavestate = function() {
    for (let i = 0; i < window.localStorage.length; i++) {
      let name = window.localStorage.key(i);
      if (name.startsWith('Savestate')) {
        let savestate = JSON.parse(window.localStorage.getItem(name));
        let pos = 0;
        savestate.file = "LocalStorage";
        this.savestates.map((state, index) => {
          if (state.date > savestate.date) {
            pos = index + 1;
          }
        }, this);
        this.savestates.splice(pos, 0, savestate);
      }
    }
  };
  /**
   * loads the loaded savestates into an array and creates the objects for display
   */
  this.initSavestates = function() {
    this.savestates.map((state, index) => {
      if (state.file.startsWith("LocalStorage")) {
        this.savestates[index] = new SLSavestate(
          (this.gD.canvas.width / 2) - 310, 60 + (55 * index), 620, 55, "savestateLS", state, true
        );
      } else {
        this.savestates[index] = new SLSavestate(
          (this.gD.canvas.width / 2) - 310, 60 + (55 * index), 620, 55, "savestate", state
        );
      }
    }, this);

    this.scrollBar.refresh(this.savestates.length);
    this.selectedSavestate = undefined;
  };
  /**
   * loads a savestate as current gamestate
   */
  this.loadSavestate = function() {
    if (this.selectedSavestate === undefined) {
      return;
    }
    try {
      this.gD.save = JSON.parse(b64DecodeUnicode(this.savestates[this.selectedSavestate].savestate.data));
      if (this.gD.save.keyBindings) {
        this.menu.controls.setSaveData(this.gD.save.keyBindings);
      }
      if (this.gD.save.achievements) {
        this.menu.achievements.setSaveData(this.gD.save.achievements);
      }
      if (this.gD.save.highscores) {
        this.menu.highscores.setSaveData(this.gD.save.highscores);
      }
      if (this.gD.save.statistics) {
        this.menu.statistics.setSaveData(this.gD.save.statistics);
      }
      if (this.gD.save.shop) {
        this.menu.shop.setSaveData(this.gD.save.shop);
      }
      if (this.gD.save.gD) {
        this.gD.setSaveData(this.gD.save.gD);
      }
      if (this.gD.save.selectionScreen) {
        this.menu.selectionScreenSP.setSaveData(this.gD.save.selectionScreen);
      }
      this.infoText.text = "Erfolgreich geladen!";
      console.log("Erfolgreich geladen!");
    } catch (e) {
      this.infoText.text = "Fehler beim Laden!";
      console.log("Fehler beim Laden!");
    }
    this.loaded = true;
    this.markSavestate(undefined);
  };
  /**
   * searches for new savestates and loads them
   */
  this.reloadSavestates = function() {
    Array.from(document.getElementsByTagName("script")).map(script => {
      if (script.src.includes('saves/Savestates')) {
        script.parentNode.removeChild(script);
      }
    }, this);
    this.updateSelection(-1, 1, false);
    this.savestates = [];
    this.loadedStates = [];
    this.loadFile();
    this.vScroll(0);
  };
  /**
   * creates a new savestate
   * @param {string} name      the name of the savestate
   * @param {string} spriteKey a spriteKey for the picture of the savestate
   */
  this.createFileSavestate = function(name, spriteKey) {
    let data = {};
    this.handleEvent(Events.CREATE_SAVESTATE);
    this.refreshSavedata();
    data.name = name;
    data.spriteKey = spriteKey;
    data.date = Date.now();
    data.version = this.menu.version.text;
    data.data = b64EncodeUnicode(JSON.stringify(this.gD.save));
    this.downloadSavestate(JSON.stringify(data));
  };
  
  this.createLocalSavestate = function(name, spriteKey) {
    let data = {};
    this.handleEvent(Events.CREATE_SAVESTATE);
    this.refreshSavedata();
    data.name = name;
    data.spriteKey = spriteKey;
    data.date = Date.now();
    data.version = this.menu.version.text;
    data.data = b64EncodeUnicode(JSON.stringify(this.gD.save));
    window.localStorage.setItem("Savestate" + Date.now(), JSON.stringify(data));
    this.reloadSavestates();
  };
  /**
   * initiates the download of a savestate-file
   * @param  {string} savestate a savestate that should be downloaded
   */
  this.downloadSavestate = function(savestate = null) {
    let element = document.createElement('a');
    let savestates = [];
    this.savestates.map(state => {
      if (state.savestate.file === 'Savestate') {
        delete state.savestate.file;
        savestates.push(JSON.stringify(state.savestate));
      }
    }, this);
    if (savestate !== null) {
      savestates.push(savestate);
    }
    let file = new Blob(["function Savestates(){this.data=[" + savestates.toString() + "];}"], {type: 'text/javascript'});
    element.href = URL.createObjectURL(file);
    element.download = "Savestates.txt";
    element.click();
  };
  
  /*
  this.downloadSavestate = function(savestate = null) {
    let element = document.createElement('a');
    let file = new Blob([savestate], {type: 'text/javascript'});
    element.href = URL.createObjectURL(file);
    element.download = "Savestate" + this.filesLoaded + ".txt";
    element.click();
  };
  */
  /**
   * refreshes the save data
   */
  this.refreshSavedata = function() {
    this.gD.save.achievements = this.menu.achievements.getSaveData();
    this.gD.save.keyBindings = this.menu.controls.getSaveData();
    this.gD.save.highscores = this.menu.highscores.getSaveData();
    this.gD.save.statistics = this.menu.statistics.getSaveData();
    this.gD.save.shop = this.menu.shop.getSaveData();
    this.gD.save.gD = this.gD.getSaveData();
    this.gD.save.selectionScreen = this.menu.selectionScreenSP.getSaveData();
  };
  /**
   * checks if a key is pressed and executes commands
   */
  this.updateKeyPresses = function() {
    this.gD.newKeys.map((key, index) => {
      let keyB = this.menu.controls.keyBindings;
      let rowIndex = this.selectedRowIndex;
      let columnIndex = this.selectedColumnIndex;

      if (this.confirmChange) {
        if (keyB.get("Menu_Confirm")[3].includes(key)) {
          switch (this.confirmationWindow.selected) {
            case 0:
              this.downloadSavestate();
              this.gD.currentPage = this.menu;
              this.confirmChange = false;
              this.changed = false;
              break;
            case 1:
              this.gD.currentPage = this.menu;
              this.confirmChange = false;
              break;
            case 2:
              this.confirmChange = false;
              break;
            default:
          }
        } else if (keyB.get("Menu_NavLeft")[3].includes(key)) {
          this.confirmationWindow.select((this.confirmationWindow.selected + 2) % 3);
        } else if (keyB.get("Menu_NavRight")[3].includes(key)) {
          this.confirmationWindow.select((this.confirmationWindow.selected + 1) % 3);
        }
      } else if (this.loaded) {
        if (keyB.get("Menu_Confirm")[3].includes(key)) {
          this.loaded = false;
          this.gD.currentPage = this.menu;
        }
      } else if (this.chooseSave) {
        if (keyB.get("Menu_Confirm")[3].includes(key)) {
          if (this.chooseSaveWindow.selected === 3) {
            this.chooseSave = false;
            this.choosePicture = true;
          } else {
            let key = this.choosePictureModal.getMarkedSpriteKey();
            let name = this.enterNameModal.text;
            if (name === "") {
              let date = new Date();
              name = date.toLocaleString('de-DE', {weekday: 'short'}) + " " + date.toLocaleString('de-DE');
            }
            switch (this.chooseSaveWindow.selected) {
              case 0:
                this.createFileSavestate(name, key);
                break;
              case 1:
                this.createLocalSavestate(name, key);
                break;
              case 2:
                this.createFileSavestate(name, key);
                this.createLocalSavestate(name, key);
                break;
              default:
            }
            this.chooseSave = false;
            this.enterNameModal.text = "";
            this.choosePictureModal.resetMark();
            this.gD.currentPage = this.menu;
          }
        } else if (keyB.get("Menu_Abort")[3].includes(key)) {
          this.chooseSave = false;
          this.enterNameModal.text = "";
          this.choosePictureModal.resetMark();
        } else if (keyB.get("Menu_NavUp")[3].includes(key)) {
          this.chooseSaveWindow.select((this.chooseSaveWindow.selected + 2) % 4);
        } else if (keyB.get("Menu_NavDown")[3].includes(key)) {
          this.chooseSaveWindow.select((this.chooseSaveWindow.selected + 2) % 4);
        } else if (keyB.get("Menu_NavRight")[3].includes(key)) {
          if (this.chooseSaveWindow.selected % 2 === 0) {
            this.chooseSaveWindow.select(this.chooseSaveWindow.selected + 1);
          } else {
            this.chooseSaveWindow.select(this.chooseSaveWindow.selected - 1);
          }
        } else if (keyB.get("Menu_NavLeft")[3].includes(key)) {
          if (this.chooseSaveWindow.selected % 2 === 0) {
            this.chooseSaveWindow.select(this.chooseSaveWindow.selected + 1);
          } else {
            this.chooseSaveWindow.select(this.chooseSaveWindow.selected - 1);
          }
        }
      } else if (this.choosePicture) {
        this.choosePictureModal.updateKeyPresses(keyB, key);
        if (keyB.get("Menu_Confirm")[3].includes(key)) {
          if (this.choosePictureModal.getSelectedButton() !== null) {
            this.choosePictureModal.updateMark();
          } else if (this.choosePictureModal.selectedColumnIndex === 0) {
            this.choosePicture = false;
            this.chooseSave = true;
          } else {
            this.choosePicture = false;
            this.chooseName = true;
          }
        } else if (keyB.get("Menu_Abort")[3].includes(key)) {
          this.choosePicture = false;
          this.enterNameModal.text = "";
          this.choosePictureModal.resetMark();
        }
      } else if (this.chooseName) {
        if (keyB.get("NameModal_NavDown")[3].includes(key)) {
          this.enterNameModal.select(this.enterNameModal.selected === 0 ? 1 : 0);
        } else if (keyB.get("NameModal_NavUp")[3].includes(key)) {
          this.enterNameModal.select(this.enterNameModal.selected === 0 ? 1 : 0);
        } else if (keyB.get("NameModal_NavRight")[3].includes(key)) {
          if (this.enterNameModal.selected === 0) {
            this.enterNameModal.moveCursor(1);
          } else {
            this.enterNameModal.select((this.enterNameModal.selected) % 2 + 1);
          }
        } else if (keyB.get("NameModal_NavLeft")[3].includes(key)) {
          if (this.enterNameModal.selected === 0) {
            this.enterNameModal.moveCursor(-1);
          } else {
            this.enterNameModal.select((this.enterNameModal.selected) % 2 + 1);
          }
        } else if (keyB.get("NameModal_DeleteLeft")[3].includes(key) && this.enterNameModal.selected === 0) {
          this.enterNameModal.deleteCharacter(-1);
        } else if (keyB.get("NameModal_DeleteRight")[3].includes(key) && this.enterNameModal.selected === 0) {
          this.enterNameModal.deleteCharacter(1);
        } else if (keyB.get("NameModal_Confirm")[3].includes(key)) {
          if (this.enterNameModal.selected === 1 || this.enterNameModal.selected === 0) {
            this.choosePicture = true;
            this.chooseName = false;
          } else if (this.enterNameModal.selected === 2) {
            this.chooseName = false;
            this.enterNameModal.text = "";
            this.choosePictureModal.resetMark();
          }
          this.enterNameModal.select(0);
        } else if (keyB.get("NameModal_Abort")[3].includes(key)) {
          this.chooseName = false;
          this.enterNameModal.text = "";
          this.choosePictureModal.resetMark();
        } else if (this.enterNameModal.selected === 0) {
          let event = this.gD.events[index];
          if (event.key.length === 1) {
            this.enterNameModal.addCharacter(event.key);
          }
        }
      } else if (keyB.get("Menu_NavDown")[3].includes(key)) {
        rowIndex++;
        if (rowIndex >= this.savestates.length) {
          this.updateSelection(-1, columnIndex, true);
        } else {
          this.updateSelection(rowIndex, columnIndex, true);
        }
      } else if (keyB.get("Menu_NavUp")[3].includes(key)) {
        rowIndex--;
        if (rowIndex < -1) {
          this.updateSelection(this.savestates.length - 1, columnIndex, true);
        } else {
          this.updateSelection(rowIndex, columnIndex, true);
        }
      } else if (keyB.get("Menu_NavLeft")[3].includes(key)) {
        columnIndex--;
        if (columnIndex < 0) {
          this.updateSelection(rowIndex, this.buttons.length - 1, true);
        } else {
          this.updateSelection(rowIndex, columnIndex, true);
        }
      } else if (keyB.get("Menu_NavRight")[3].includes(key)) {
        columnIndex++;
        if (columnIndex >= this.buttons.length) {
          this.updateSelection(rowIndex, 0, true);
        } else {
          this.updateSelection(rowIndex, columnIndex, true);
        }
      } else if (keyB.get("Menu_Confirm")[3].includes(key)) {
        if (rowIndex >= 0) {
          this.markSavestate(rowIndex);
        } else {
          switch (columnIndex) {
            case 0:
              this.chooseName = true;
              if (this.selectedSavestate !== undefined) {
                let name = this.savestates[this.selectedSavestate].savestate.name;
                if (name !== undefined) {
                  this.enterNameModal.text = name;
                  this.enterNameModal.moveCursor(name.length);
                }
                let picIndex = this.choosePictureModal.pictures.indexOf(
                  this.savestates[this.selectedSavestate].savestate.spriteKey
                );
                if (picIndex !== -1) {
                  this.choosePictureModal.updateSelection(Math.floor(picIndex / 8), picIndex % 8);
                  this.choosePictureModal.updateMark();
                }
              }
              break;
            case 1:
              if (this.changed) {
                this.confirmChange = true;
              } else {
                this.gD.currentPage = this.menu;
              }
              break;
            case 2:
              this.loadSavestate();
              break;
          }
        }
      } else if (keyB.get("Menu_Refresh")[3].includes(key)) {
        this.reloadSavestates();
      } else if (keyB.get("Menu_Delete")[3].includes(key)) {
        let local = this.savestates[this.selectedRowIndex].savestate.file === "LocalStorage";
        this.savestates[this.selectedRowIndex].deleteThis(this);
        this.reloadSavestates();
        if (!local) {
          this.changed = true;
        }
      } else if (keyB.get("Menu_Back")[3].includes(key)) {
        this.gD.currentPage = this.menu;
      }
      
      if (keyB.get("Mute_All")[3].includes(key)) {
        this.gD.muted = !this.gD.muted;
        this.menu.muteButton.setSprite();
      }
    }, this);
  };
  /**
   * checks, if the mouse was moved, what the mouse hit 
   */
  this.updateMouseMoves = function() {
    if (this.loaded) {
      return;
    }

    if (this.confirmChange) {
      this.confirmationWindow.buttons.map((button, index) => {
        if (this.gD.mousePos.x >= button.x && this.gD.mousePos.x <= button.x + button.width &&
            this.gD.mousePos.y >= button.y && this.gD.mousePos.y <= button.y + button.height) {
          this.confirmationWindow.select(index);
        }
      }, this);
    } else if (this.chooseSave) {
      this.chooseSaveWindow.buttons.map((button, index) => {
        if (this.gD.mousePos.x >= button.x && this.gD.mousePos.x <= button.x + button.width &&
            this.gD.mousePos.y >= button.y && this.gD.mousePos.y <= button.y + button.height) {
          this.chooseSaveWindow.select(index);
        }
      }, this);
    } else if (this.choosePicture) {
      this.choosePictureModal.updateMouseMoves(this.gD);
    } else if (this.chooseName) {
      if (this.gD.mousePos.x >= this.enterNameModal.x + 5 && 
          this.gD.mousePos.x <= this.enterNameModal.x + this.enterNameModal.width - 5 &&
          this.gD.mousePos.y >= this.enterNameModal.y + 30 &&
          this.gD.mousePos.y <= this.enterNameModal.y + 50) {
        this.enterNameModal.select(0);
      }
      this.enterNameModal.buttons.map((button, index) => {
        if (this.gD.mousePos.x >= button.x && this.gD.mousePos.x <= button.x + button.width &&
            this.gD.mousePos.y >= button.y && this.gD.mousePos.y <= button.y + button.height) {
          this.enterNameModal.select(index + 1);
        }
      }, this);
    } else {
      let savestateSelected = false;
      this.savestates.map((state, index) => {
        if (this.gD.mousePos.x >= state.x && this.gD.mousePos.x <= state.x + state.width &&
            this.gD.mousePos.y >= state.y - this.scrollHeight && this.gD.mousePos.y <= state.y + state.height - this.scrollHeight) {
          let realHeight = state.y - this.scrollHeight;
          if (realHeight >= 60 && realHeight < 280) {
            this.updateSelection(index, this.selectedColumnIndex, false);
            if (this.gD.mousePos.x >= state.x + state.width - 20 && this.gD.mousePos.x <= state.x + state.width &&
                this.gD.mousePos.y >= realHeight && this.gD.mousePos.y <= realHeight + 20) {
              this.savestateDetails.setVisible();
              savestateSelected = true;
            }
          }
        }
      }, this);

      if (!savestateSelected) {
        this.savestateDetails.setInvisible();
      }

      this.buttons.map((button, index) => {
        if (this.gD.mousePos.x >= button.x && this.gD.mousePos.x <= button.x + button.width &&
            this.gD.mousePos.y >= button.y && this.gD.mousePos.y <= button.y + button.height) {
          this.updateSelection(-1, index, false);
        }
      }, this);

      let button = this.refreshButton;
      let mouseOver = false;

      if (this.gD.mousePos.x >= button.x && this.gD.mousePos.x <= button.x + button.width &&
          this.gD.mousePos.y >= button.y && this.gD.mousePos.y <= button.y + button.height) {
        button.select();
        button.setSprite(1);
        mouseOver = true;
      }

      if (!mouseOver) {
        button.deselect();
        button.setSprite(0);
      }
    }
  };
  /**
   * checks where a click was executed
   */
  this.updateClick = function() {
    let clickPos = this.gD.clicks.pop();
    if (!clickPos) {
      return;
    }
    
    if (this.confirmChange) {
      this.confirmationWindow.buttons.map((button, index) => {
        if (clickPos.x >= button.x && clickPos.x <= button.x + button.width &&
            clickPos.y >= button.y && clickPos.y <= button.y + button.height) {
          switch (index) {
            case 0:
              this.downloadSavestate();
              this.gD.currentPage = this.menu;
              this.confirmChange = false;
              this.changed = false;
              break;
            case 1:
              this.gD.currentPage = this.menu;
              this.confirmChange = false;
              break;
            case 2:
              this.confirmChange = false;
              break;
            default:
          }
        }
      }, this);
      
      if (!(clickPos.x >= this.confirmationWindow.x &&
            clickPos.x <= this.confirmationWindow.x + this.confirmationWindow.width &&
            clickPos.y >= this.confirmationWindow.y &&
            clickPos.y <= this.confirmationWindow.y + this.confirmationWindow.height) &&
            clickPos.x >= 0 && clickPos.x <= this.gD.canvas.width && 
            clickPos.y >= 0 && clickPos.y <= this.gD.canvas.height) {
        this.confirmChange = false;
      }
    } else if (this.chooseSave) {
      this.chooseSaveWindow.buttons.map((button, index) => {
        if (clickPos.x >= button.x && clickPos.x <= button.x + button.width &&
            clickPos.y >= button.y && clickPos.y <= button.y + button.height) {
          if (index === 3) {
            this.chooseSave = false;
            this.choosePicture = true;
          } else {
            let key = this.choosePictureModal.getMarkedSpriteKey();
            let name = this.enterNameModal.text;
            if (name === "") {
              let date = new Date();
              name = date.toLocaleString('de-DE', {weekday: 'short'}) + " " + date.toLocaleString('de-DE');
            }
            switch (index) {
              case 0:
                this.createFileSavestate(name, key);
                break;
              case 1:
                this.createLocalSavestate(name, key);
                break;
              case 2:
                this.createFileSavestate(name, key);
                this.createLocalSavestate(name, key);
                break;
              default:
            }
            this.chooseSave = false;
            this.enterNameModal.text = "";
            this.choosePictureModal.resetMark();
            this.gD.currentPage = this.menu;
          }
        }
      }, this);
      
      if (!(clickPos.x >= this.chooseSaveWindow.x &&
            clickPos.x <= this.chooseSaveWindow.x + this.chooseSaveWindow.width &&
            clickPos.y >= this.chooseSaveWindow.y &&
            clickPos.y <= this.chooseSaveWindow.y + this.chooseSaveWindow.height) &&
            clickPos.x >= 0 && clickPos.x <= this.gD.canvas.width && 
            clickPos.y >= 0 && clickPos.y <= this.gD.canvas.height) {
        this.chooseSave = false;
        this.choosePicture = true;
      }
    } else if (this.choosePicture) {
      if (clickPos.x >= this.choosePictureModal.innerX &&
          clickPos.x <= this.choosePictureModal.innerX + this.choosePictureModal.innerWidth &&
          clickPos.y >= this.choosePictureModal.innerY &&
          clickPos.y <= this.choosePictureModal.innerY + this.choosePictureModal.innerHeight) {
        this.choosePictureModal.updateMark();
      }
      this.choosePictureModal.buttons.map((button, index) => {
        if (clickPos.x >= button.x && clickPos.x <= button.x + button.width &&
            clickPos.y >= button.y && clickPos.y <= button.y + button.height) {
          if (index === 0) {
            this.chooseSave = true;
            this.choosePicture = false;
          } else {
            this.choosePicture = false;
            this.chooseName = true;
          }
        }
      }, this);
      if (!(clickPos.x >= this.choosePictureModal.x &&
            clickPos.x <= this.choosePictureModal.x + this.choosePictureModal.width &&
            clickPos.y >= this.choosePictureModal.y &&
            clickPos.y <= this.choosePictureModal.y + this.choosePictureModal.height) &&
            clickPos.x >= 0 && clickPos.x <= this.gD.canvas.width && 
            clickPos.y >= 0 && clickPos.y <= this.gD.canvas.height) {
        this.choosePicture = false;
        this.chooseName = true;
      }
    } else if (this.chooseName) {
      if (!(clickPos.x >= this.enterNameModal.x &&
            clickPos.x <= this.enterNameModal.x + this.enterNameModal.width &&
            clickPos.y >= this.enterNameModal.y &&
            clickPos.y <= this.enterNameModal.y + this.enterNameModal.height) &&
            clickPos.x >= 0 && clickPos.x <= this.gD.canvas.width && 
            clickPos.y >= 0 && clickPos.y <= this.gD.canvas.height) {
        this.chooseName = false;
        this.enterNameModal.text = "";
        this.choosePictureModal.resetMark();
      }
      this.enterNameModal.buttons.map((button, index) => {
        if (clickPos.x >= button.x && clickPos.x <= button.x + button.width &&
            clickPos.y >= button.y && clickPos.y <= button.y + button.height) {
          if (index === 0) {
            this.choosePicture = true;
            this.chooseName = false;
          } else {
            this.chooseName = false;
            this.enterNameModal.text = "";
            this.choosePictureModal.resetMark();
          }
        }
      }, this);
    } else if (this.loaded) {
      let button = this.backButton;
      if (clickPos.x >= button.x && clickPos.x <= button.x + button.width &&
          clickPos.y >= button.y && clickPos.y <= button.y + button.height) {
        this.loaded = false;
        this.gD.currentPage = this.menu;
      }
    } else {
      this.savestates.map((state, index) => {
        if (clickPos.x >= state.x && clickPos.x <= state.x + state.width &&
            clickPos.y >= state.y - this.scrollHeight && clickPos.y <= state.y + state.height - this.scrollHeight) {
          let realHeight = state.y - this.scrollHeight;
          if (realHeight >= 60 && realHeight < 280) {
            this.markSavestate(index);
            if (clickPos.x >= state.x + state.width - 40 && clickPos.x <= state.x + state.width - 20 &&
                clickPos.y >= realHeight && clickPos.y <= realHeight + 20) {
              let local = state.savestate.file === "LocalStorage";
              state.deleteThis(this);
              this.reloadSavestates();
              if (!local) {
                this.changed = true;
              }
            }
          }
        }
      }, this);

      this.buttons.map((button, index) => {
        if (clickPos.x >= button.x && clickPos.x <= button.x + button.width &&
            clickPos.y >= button.y && clickPos.y <= button.y + button.height) {
          switch (index) {
            case 0:
              this.chooseName = true;
              if (this.selectedSavestate !== undefined) {
                let name = this.savestates[this.selectedSavestate].savestate.name;
                if (name !== undefined) {
                  this.enterNameModal.text = name;
                  this.enterNameModal.moveCursor(name.length);
                }
                let picIndex = this.choosePictureModal.pictures.indexOf(
                  this.savestates[this.selectedSavestate].savestate.spriteKey
                );
                if (picIndex !== -1) {
                  this.choosePictureModal.updateSelection(Math.floor(picIndex / 8), picIndex % 8);
                  this.choosePictureModal.updateMark();
                }
              }
              break;
            case 1:
              if (this.changed) {
                this.confirmChange = true;
              } else {
                this.gD.currentPage = this.menu;
              }
              break;
            case 2:
              this.loadSavestate();
              break;
          }
        }
      }, this);

      let button = this.refreshButton;

      if (gD.mousePos.x >= button.x && gD.mousePos.x <= button.x + button.width &&
          gD.mousePos.y >= button.y && gD.mousePos.y <= button.y + button.height) {
        this.reloadSavestates();
      }
    }
  };
  /**
   * checks if the mouse wheel was moved
   */
  this.updateWheelMoves = function() {
    let wheelMove = this.gD.wheelMovements.pop();
    if (this.loaded || (this.chooseName && !this.choosePicture)) {
      return;
    }
    
    if (this.choosePicture) {
      if (wheelMove < 0) {
        this.choosePictureModal.vScroll(Math.max(
          (this.choosePictureModal.scrollHeight / (this.choosePictureModal.buttonSize / 2)) - 1, 
          0
        ));
      } else if (wheelMove > 0) {
        let pB = this.choosePictureModal.pictureButtons;
        this.choosePictureModal.vScroll(Math.min(
          (this.choosePictureModal.scrollHeight / (this.choosePictureModal.buttonSize / 2)) + 1, 
          (pB[pB.length - 1][pB[pB.length - 1].length - 1].y - 198) / (this.choosePictureModal.buttonSize / 2)
        ));
      }
    } else if (this.savestates.length >= 5) {
      if (wheelMove < 0) {
        this.vScroll(Math.max(
          (this.scrollHeight / 55) - 1, 
          0
        ));
      } else if (wheelMove > 0) {
        this.vScroll(Math.min(
          (this.scrollHeight / 55) + 1, 
          (this.savestates[this.savestates.length - 1].y - 225) / 55
        ));
      }
    }
  };
  /**
   * updates moving objects
   */
  this.update = function() {
    if (this.confirmChange) {
      this.confirmationWindow.update();
    } else if (this.chooseSave) {
      this.chooseSaveWindow.update();
    } else if (this.choosePicture) {
      this.choosePictureModal.update();
    } else if(this.chooseName) {
      this.enterNameModal.update();
    } else {
      this.buttons.map(button => {
        button.update();
      }, this);

      this.savestates.map(state => {
        if (state.update) {
          state.update();
        }
      }, this);

      this.refreshButton.update();
      this.backButton.update();
    }
    this.menu.lightUpdate();
  };
  /**
   * draws the objects onto the canvas
   * @param {float} ghostFactor the part of a physics step since the last physics update
   */
  this.draw = function(ghostFactor) {
    this.gD.context.drawImage(this.menu.backgroundImage, 0, 0);
    this.title.draw(this.gD);
    if (this.loaded) {
      this.infoText.draw(this.gD);
      this.backButton.draw(this.gD);
    } else {
      this.scrollBar.draw(this.gD);

      this.savestates.map(state => {
        let realHeight = state.y - this.scrollHeight;
        if (realHeight >= 60 && realHeight < 280) {
          state.draw(this, this.gD);
        }
      }, this);

      this.buttons.map(button => {
        button.draw(this.gD);
      }, this);

      this.refreshButton.draw(this.gD);
      this.savestateDetails.draw(this.gD);

      if (this.chooseName) {
        this.enterNameModal.draw(this.gD);
      }
      if (this.choosePicture) {
        this.choosePictureModal.draw(this.gD);
      }
      if (this.chooseSave) {
        this.chooseSaveWindow.draw(this.gD);
      }
      if (this.confirmChange) {
        this.confirmationWindow.draw(this.gD);
      }
    }
    
    this.menu.lightDraw();
  };
  /**
   * updates the selected object and deselects the old object
   * @param  {number} rowIndex    the row of the new selected object
   * @param  {number} columnIndex the column of the new selected object
   * @param  {boolean}   scroll      if the action should influence scrolling
   */
  this.updateSelection = function(rowIndex, columnIndex, scroll) {
    if (this.selectedRowIndex !== undefined && this.selectedColumnIndex !== undefined) {
      if (this.selectedRowIndex === -1) {
        this.buttons[this.selectedColumnIndex].deselect();
      } else {
        this.savestates[this.selectedRowIndex].deselect();
        this.savestateDetails.setSavestate(null);
      }
    }

    if (rowIndex === -1) {
      this.buttons[columnIndex].select();
    } else {
      let savestate = this.savestates[rowIndex];
      savestate.select();
      this.savestateDetails.setSavestate(savestate.savestate);
      if (scroll) {
        if (savestate.y - this.scrollHeight >= 225) {
          this.vScroll(Math.min(
            (this.savestates[this.savestates.length - 1].y - 225) / 55, 
            (savestate.y - 170) / 55
          ));
        } else if (savestate.y - this.scrollHeight < 115) {
          this.vScroll(Math.max(
            (savestate.y - 115) / 55, 
            0
          ));
        }
      }
    }
    this.selectedRowIndex = rowIndex;
    this.selectedColumnIndex = columnIndex;
  };
  /**
   * marks a savestate and demarks the old selected savestate
   * @param  {number} rowIndex the row of the new marked savestate
   */
  this.markSavestate = function(rowIndex) {
    if (this.selectedSavestate !== undefined) {
      this.savestates[this.selectedSavestate].demark();
    }
    if (this.selectedSavestate !== rowIndex && rowIndex !== undefined) {
      this.savestates[rowIndex].mark();
    } else {
      rowIndex = undefined;
    }
    this.selectedSavestate = rowIndex;
  };
  /**
   * scrolls the page with a defined number of objects
   * @param  {number} elementsScrolled the number of objects that should be scrolled
   */
  this.vScroll = function(elementsScrolled) {
    this.scrollHeight = elementsScrolled * 55;
    this.scrollBar.scroll(elementsScrolled);
  };
}

/**
 * a savestate object for the canvas
 * @param {number} x         x-coordinate of the top-left corner of the savestate on the canvas
 * @param {number} y         y-coordinate of the top-left corner of the savestate on the canvas
 * @param {number} width     width of the savestate on the canvas
 * @param {number} height    height of the savestate on the canvas
 * @param {string} styleKey  the design to use for the savestate
 * @param {Savestate} savestate the savestate that should be used
 */
function SLSavestate(x, y, width, height, styleKey, savestate, local = false) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.styleKey = styleKey;
  this.savestate = savestate;
  this.arrowWidth = 0;
  this.arrowHeight = 0;
  this.animationSpeed = 24;
  this.selected = false;
  this.marked = false;
  this.local = local;
  /**
   * selects the savestate
   */
  this.select = function() {
    this.selected = true;
  };
  /**
   * deselects the savestate
   */
  this.deselect = function() {
    this.selected = false;
  };
  /**
   * marks the savestate
   */
  this.mark = function() {
    this.marked = true;
  };
  /**
   * demarks the savestate
   */
  this.demark = function() {
    this.marked = false;
  };
  this.deleteThis = function(saveload) {
    if (this.local) {
      window.localStorage.removeItem(window.localStorage.key(parseInt(this.savestate.file.replace('LocalStorage', ''))));
    } else {
      saveload.removed.push(this.savestate.date);
    }
  };
  this.update = function() {
    if (this.selected) {
      if (this.arrowHeight < this.height) {
        this.arrowHeight += this.animationSpeed;
        if (this.arrowHeight >= this.height) {
          this.arrowHeight = this.height;
        }
      } else if (this.arrowHeight >= this.height && this.arrowWidth < this.width) {
        this.arrowWidth += this.animationSpeed;
        if (this.arrowWidth >= this.width) {
          this.arrowWidth = this.width;
        }
      }
    }  else {
      if (this.arrowWidth > 0) {
        this.arrowWidth -= this.animationSpeed;
        if (this.arrowWidth <= 0) {
          this.arrowWidth = 0;
        }
      } else if (this.arrowWidth <= 0 && this.arrowHeight > 0) {
        this.arrowHeight -= this.animationSpeed;
        if (this.arrowHeight <= 0) {
          this.arrowHeight = 0;
        }
      }
    }
  };
  /**
   * draws the savestate onto the canvas
   * @param  {SaveLoad}   saveLoad the saveLoad object
   * @param  {GlobalDict} gD       the global dictionary object
   */
  this.draw = function(saveLoad, gD) {
    let design = gD.design.elements[this.styleKey];
    let date = new Date(this.savestate.date);
    date = date.toLocaleString('de-DE', {weekday: 'short'}) + " " + date.toLocaleString('de-DE');
    let icon = getSpriteData(this.savestate.spriteKey, gD);
    let info = getSpriteData("Icon_Info", gD);
    let trash = getSpriteData("Icon_Trash", gD);
    let centerX = this.x + this.width / 2;
    let centerY = this.y + this.height / 2 - saveLoad.scrollHeight;

    drawCanvasRect(this.x, this.y - saveLoad.scrollHeight, this.width, this.height, design.rectKey.standard, gD);
    drawCanvasPolygon(
      centerX + this.arrowWidth / 2, centerY - this.arrowHeight / 2, design.rectKey.selected, gD,
      centerX + Math.min(this.arrowWidth / 2 + this.arrowHeight / 2, this.width / 2),
      centerY - Math.max((this.arrowWidth / 2 + this.arrowHeight / 2) - this.width / 2, 0),
      centerX + Math.min(this.arrowWidth / 2 + this.arrowHeight / 2, this.width / 2),
      centerY + Math.max((this.arrowWidth / 2 + this.arrowHeight / 2) - this.width / 2, 0),
      centerX + this.arrowWidth / 2, centerY + this.arrowHeight / 2,
      centerX - this.arrowWidth / 2, centerY + this.arrowHeight / 2,
      centerX - Math.min(this.arrowWidth / 2 + this.arrowHeight / 2, this.width / 2),
      centerY + Math.max((this.arrowWidth / 2 + this.arrowHeight / 2) - this.width / 2, 0),
      centerX - Math.min(this.arrowWidth / 2 + this.arrowHeight / 2, this.width / 2),
      centerY - Math.max((this.arrowWidth / 2 + this.arrowHeight / 2) - this.width / 2, 0),
      centerX - this.arrowWidth / 2, centerY - this.arrowHeight / 2
    );
    if (this.marked) {
      drawCanvasRect(this.x, this.y - saveLoad.scrollHeight, this.width, this.height, design.rectKey.marked, gD);
    }

    drawCanvasImage(
      this.x + Math.floor((55 - icon.spriteWidth) / 2),
      this.y + Math.floor((this.height - icon.spriteHeight) / 2) - saveLoad.scrollHeight, this.savestate.spriteKey, gD
    );
    drawCanvasText(this.x + 60, this.y + 9 - saveLoad.scrollHeight, "Name: " + this.savestate.name, design.textKey.text, gD);
    drawCanvasText(this.x + 60, this.y + 21 - saveLoad.scrollHeight, "Date: " + date, design.textKey.text, gD);
    drawCanvasText(
      this.x + 60, this.y + 34 - saveLoad.scrollHeight, "File: " + this.savestate.file, design.textKey.text, gD
    );
    drawCanvasText(
      this.x + 60, this.y + 46 - saveLoad.scrollHeight, "Version: " + this.savestate.version, design.textKey.text, gD
    );
    drawCanvasImage(
      this.x + this.width - info.spriteWidth - Math.floor((20 - info.spriteWidth) / 2), 
      this.y + (20 - info.spriteHeight) / 2 - saveLoad.scrollHeight, info.key, gD
    );
    drawCanvasLine(
      this.x + this.width - 20, this.y - saveLoad.scrollHeight, design.borderKey, gD, this.x + this.width - 20, 
      this.y + 20 - saveLoad.scrollHeight, this.x + this.width, this.y + 20 - saveLoad.scrollHeight
    );
    drawCanvasImage(
      this.x + this.width - 40 + Math.floor((20 - trash.spriteWidth) / 2), 
      this.y + (20 - trash.spriteHeight) / 2 - saveLoad.scrollHeight, trash.key, gD
    );
    drawCanvasLine(
      this.x + this.width - 40, this.y - saveLoad.scrollHeight, design.borderKey, gD, this.x + this.width - 40, 
      this.y + 20 - saveLoad.scrollHeight, this.x + this.width - 20, this.y + 20 - saveLoad.scrollHeight
    );
    drawCanvasLine(
      this.x + 55, this.y - saveLoad.scrollHeight, design.borderKey, gD, 
      this.x + 55, this.y + this.height - saveLoad.scrollHeight
    );
    drawCanvasRectBorder(this.x, this.y - saveLoad.scrollHeight, this.width, this.height, design.borderKey, gD);
  };
}

/**
 * an object that displays information from the selected savestate
 * @param {number} x         x-coordinate of the top-left corner of the detail view on the canvas
 * @param {number} y         y-coordinate of the top-left corner of the detail view on the canvas
 * @param {number} width     width of the detail view on the canvas
 * @param {number} height    height of the detail view on the canvas
 * @param {string} styleKey  the design to use for the detail view
 */
function SLSavestateDetails(x, y, width, height, styleKey) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.styleKey = styleKey;
  this.visible = false;
  this.currentSavestate = null;
  this.setVisible = function() {
    this.visible = true;
  };
  this.setInvisible = function() {
    this.visible = false;
  };
  /**
   * sets a new savestate
   * param {Savestate} savestate the savestate that should be used
   */
  this.setSavestate = function(savestate) {
    this.currentSavestate = savestate;
  };
  /**
   * draws the savestate details onto the canvas
   * @param  {GlobalDict} gD the global dictionary
   */
  this.draw = function(gD) {
    let design = gD.design.elements[this.styleKey];
    if (this.currentSavestate === null || !this.visible) {
      return;
    }

    let {spriteWidth, spriteHeight} = getSpriteData(this.currentSavestate.spriteKey, gD);
    let date = new Date(this.currentSavestate.date);
    date = date.toLocaleString('de-DE', {weekday: 'short'}) + " " + date.toLocaleString('de-DE');

    drawCanvasRect(this.x, this.y, this.width, this.height, design.rectKey.modal, gD);
    drawCanvasRect(this.x + 250, this.y + 85, 500, 180, design.rectKey.background, gD);

    drawCanvasImage(
      this.x + Math.floor((this.width - spriteWidth) / 2), this.y + 85 + Math.floor((55 - spriteHeight) / 2),
      this.currentSavestate.spriteKey, gD
    );
    drawCanvasText(this.x + 500, this.y + 150, this.currentSavestate.name, design.textKey.headline, gD);
    drawCanvasText(this.x + 254, this.y + 262, date, design.textKey.date, gD);
    drawCanvasText(this.x + this.width - 254, this.y + 262, this.currentSavestate.version, design.textKey.version, gD);

    drawCanvasLine(this.x + 250, this.y + 140, design.borderKey, gD, this.x + this.width - 250, this.y + 140);
    drawCanvasLine(this.x + 250, this.y + 160, design.borderKey, gD, this.x + this.width - 250, this.y + 160);
    drawCanvasRectBorder(this.x + 250, this.y + 85, 500, 180, design.borderKey, gD);
  };
}

function SLChooseWindow(x, y, width, height, styleKey) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.styleKey = styleKey;
  this.selected = null;
  this.init = function() {
    this.buttons = [
      new CanvasButton(this.x + this.width / 2 - 202, this.y + this.height - 70, 200, 30, "File", "menu"),
      new CanvasButton(this.x + this.width / 2 + 3, this.y + this.height - 70, 200, 30, "Browser", "menu"),
      new CanvasButton(this.x + this.width / 2 - 202, this.y + this.height - 35, 200, 30, "Both", "menu"),
      new CanvasButton(this.x + this.width / 2 + 3, this.y + this.height - 35, 200, 30, "Back", "menu")
    ];
    
    this.select(0);
  };
  this.select = function(index) {
    if (this.selected !== null) {
      this.buttons[this.selected].deselect();
    }
    this.buttons[index].select();
    this.selected = index;
  };
  this.update = function() {
    this.buttons.map(button => {
      button.update();
    }, this);
  };
  this.draw = function(gD) {
    let design = gD.design.elements[this.styleKey];
    
    drawCanvasRect(this.x, this.y, this.width, this.height, design.rectKey.background, gD);
    drawCanvasText(this.x + this.width / 2, this.y + 15, "Save as", design.textKey.headline, gD);
    drawCanvasRect(this.x + 5, this.y + 30, this.width - 10, 36, design.rectKey.info, gD);
    drawCanvasText(
      this.x + this.width / 2, this.y + 39, 
      'Note: The name of the file must always be "Savestates.txt" and there', design.textKey.info, gD
    );
    drawCanvasText(
      this.x + this.width / 2, this.y + 57, 
      'should only be one file named like this.', design.textKey.info, gD
    );
    drawCanvasRectBorder(this.x + 5, this.y + 30, this.width - 10, 36, design.borderKey.info, gD);
    this.buttons.map(button => {
      button.draw(gD);
    }, this);
    drawCanvasRectBorder(this.x, this.y, this.width, this.height, design.borderKey.standard, gD);
  };
}

/**
 * encodes a string with b64
 * @param  {string} str the string that should be encoded
 * @return {string}     the resulting string
 */
function b64EncodeUnicode(str) {
  return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g,
    function toSolidBytes(match, p1) {
      return String.fromCharCode('0x' + p1);
  }));
}

/**
 * decodes a b64 encoded string
 * @param  {string} str the string that should be decoded
 * @return {string}     the decoded string
 */
function b64DecodeUnicode(str) {
  return decodeURIComponent(atob(str).split('').map(function(c) {
    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));
}