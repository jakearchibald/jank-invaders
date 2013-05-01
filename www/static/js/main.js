(function() {
  var canvas = document.querySelector('.level-canvas');
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;

  var container = document.querySelector('.container');
  container.style.width = canvas.width + 'px';
  container.style.height = canvas.height + 'px';

  Q.all([
    ji.Ship.load(),
    ji.Explosion.load()
  ]).then(function() {
    var intro = new ji.Intro();
    intro.on('gamestart', function() {
      var level = new ji.Level(canvas);
      level.play();
    });
    intro.show();
  });
}());