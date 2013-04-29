(function() {
  var canvas = document.createElement('canvas');
  canvas.className = 'level-canvas';
  document.body.appendChild(canvas);
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;

  var level = new ji.Level(canvas);
  level.play();
}());