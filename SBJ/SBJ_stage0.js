function Stage0(game) {
  this.game = game;
  this.deadZoneGround = 0;
  this.floorColor = "rgba(155, 155, 155, 1)";
  this.difficulty = 5;
  this.init = function() {

  };
}

function updateStage0(game, stage) {

}

function drawBackgroundStage0(game, stage, ghostFactor) {
  game.player.draw(game, game.gD, ghostFactor);
}

function drawForegroundStage0(game, stage, ghostFactor) {

}