(function() {
  var canvas = document.createElement('canvas');
  canvas.className = 'level-canvas';
  document.body.appendChild(canvas);
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;

  Q.all([
    ji.Ship.load(),
    ji.Explosion.load()
  ]).then(function() {
    var level = new ji.Level(canvas);
    level.play();

    window.level = level;
  });
}());