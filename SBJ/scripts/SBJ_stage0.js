function Stage0(game, gD) {
  this.game = game;
  this.gD = gD;
  this.name = "Training";
  this.deadZoneGround = 0;
  this.floorColorKey = "stage0Floor";
  this.difficulty = 5;
  this.gravity = 20.25;
  this.init = function() {
    this.manual = new Image();
    this.manual.src = "img/Manual_Game.png";
  };
  this.update = function() {

  };
  this.drawForeground = function() {

  };
  this.drawBackground = function() {
    if (this.game.showTutorial) {
      this.gD.context.drawImage(
        this.manual,
        Math.floor((this.gD.canvas.width - this.manual.width) / 2), 
        Math.floor((this.gD.canvas.height - this.manual.height) / 2)
      );
    }
  };
}