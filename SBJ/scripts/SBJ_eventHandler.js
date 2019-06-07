function EventHandler(menu, gD) {
  this.menu = menu;
  this.gD = gD;
  this.handleEvent = function(eventKey, addedValue = 1) {
    this.menu.achievements.handleEvent(eventKey, addedValue);
    this.menu.statistics.handleEvent(eventKey, addedValue);
  };
}

const Events = {
  COLLECT_HYPE: "COLLECT_HYPE",
  COLLECT_1000_HYPE: "COLLECT_1000_HYPE",
  COLLECT_100_HYPE: "COLLECT_100_HYPE",
  COLLECT_10_HYPE: "COLLECT_10_HYPE",
  COLLECT_1_HYPE: "COLLECT_1_HYPE",
  COLLECT_BONUS: "COLLECT_BONUS",
  MONEY_SPENT: "MONEY_SPENT",
  COLLECT_ITEM: "COLLECT_ITEM",
  COLLECT_STOPWATCH: "COLLECT_STOPWATCH",
  COLLECT_STAR: "COLLECT_STAR",
  COLLECT_FEATHER: "COLLECT_FEATHER",
  COLLECT_TREASURE: "COLLECT_TREASURE",
  COLLECT_MAGNET: "COLLECT_MAGNET",
  COLLECT_ROCKET: "COLLECT_ROCKET",
  COLLECT_QUESTIONMARK: "COLLECT_QUESTIONMARK",
  COLLECT_GOLDEN_SHAMROCK: "COLLECT_GOLDEN_SHAMROCK",
  COLLECT_REDKEY: "COLLECT_REDKEY",
  COLLECT_BLUEKEY: "COLLECT_BLUEKEY",
  COLLECT_GREENKEY: "COLLECT_GREENKEY",
  COLLECT_YELLOWKEY: "COLLECT_YELLOWKEY",
  COLLECT_SKIN: "COLLECT_SKIN",
  COLLECT_HAT: "COLLECT_HAT",
  COLLECT_GLASSES: "COLLECT_GLASSES",
  COLLECT_BEARD: "COLLECT_BEARD",
  DO_JUMP: "DO_JUMP",
  DO_DOUBLE_JUMP: "DO_DOUBLE_JUMP",
  USE_ITEM: "USE_ITEM",
  USE_STOPWATCH: "USE_STOPWATCH",
  USE_STAR: "USE_STAR",
  USE_FEATHER: "USE_FEATHER",
  USE_TREASURE: "USE_TREASURE",
  USE_MAGNET: "USE_MAGNET",
  USE_ROCKET: "USE_ROCKET",
  USE_ALL_ITEMS_AT_ONCE: "USE_ALL_ITEMS_AT_ONCE",
  JUMP_OUT_OF_BOUNDS: "JUMP_OUT_OF_BOUNDS",
  MINIGAME_WON: "MINIGAME_WON",
  MINIGAME_LOST: "MINIGAME_LOST",
  MINIGAME_ACTIVATED: "MINIGAME_ACTIVATED",
  STAR_BEFORE_LAVA: "STAR_BEFORE_LAVA",
  DEATH: "DEATH",
  END_OF_ROUND_TOTAL_SLOWED_TIME: "END_OF_ROUND_TOTAL_SLOWED_TIME",
  END_OF_ROUND_TOTAL_TRAVELLED_DISTANCE: "END_OF_ROUND_TOTAL_TRAVELLED_DISTANCE",
  END_OF_ROUND_TOTAL_REVERSE_DISTANCE: "END_OF_ROUND_TOTAL_REVERSE_DISTANCE",
  SET_OWNED_HYPE: "SET_OWNED_HYPE",
  LVL_ITEM: "LVL_ITEM",
  LVL_ITEM_MAX: "LVL_ITEM_MAX",
  TIME_PLAYED: "TIME_PLAYED",
  HIGHSCORE_COLLECTED_HYPE: "HIGHSCORE_COLLECTED_HYPE",
  HIGHSCORE_TRAVELLED_DISTANCE: "HIGHSCORE_TRAVELLED_DISTANCE",
  CREATE_SAVESTATE: "CREATE_SAVESTATE",
}