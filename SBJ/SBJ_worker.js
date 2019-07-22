this.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('v3.0.0').then((cache) => {
      return cache.addAll([
        './scripts/',
        './scripts/SBJ_shop.js',
        './scripts/SBJ_game.js',
        './scripts/SBJ_main.js',
        './scripts/SBJ_saveload.js',
        './scripts/SBJ_statistics.js',
        './scripts/SBJ_elements.js',
        './scripts/SBJ_selectionScreenSingleplayer.js',
        './scripts/SBJ_highscores.js',
        './scripts/SBJ_controls.js',
        './scripts/SBJ_achievements.js',
        './scripts/SBJ_tools.js',
        './scripts/SBJ_stage3.js',
        './scripts/SBJ_menu.js',
        './scripts/SBJ_stage5.js',
        './scripts/SBJ_menuController.js',
        './scripts/SBJ_stage2.js',
        './scripts/SBJ_stage1.js',
        './scripts/SBJ_stage4.js',
        './scripts/SBJ_eventHandler.js',
        './scripts/SBJ_stage0.js',
        './scripts/SBJ_worker',
        './SBJ.css',
        './SBJ.html',
        './SBJ.webmanifest',
        './saves/',
        './saves/Savestates.txt',
        './img/',
        './img/Air_Cloud.png',
        './img/Festung_Lava.png',
        './img/Festung_Wall.png',
        './img/Manual_game.png',
        './img/SBJ_Icon.png',
        './img/Spritesheet.png',
        './img/Titlescreen1.png',
        './img/Water_Ocean.png',
        './img/Water_Waves.png'
      ]);
    })
  );
});

this.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
  );
});

this.addEventListener('activate', (event) => {
  var cacheKeeplist = ['v3.0.0'];

  event.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(keyList.map((key) => {
        if (cacheKeeplist.indexOf(key) === -1) {
          return caches.delete(key);
        }
      }));
    })
  );
});