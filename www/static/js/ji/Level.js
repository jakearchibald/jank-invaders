(function() {
  function Level(canvas) {
    this.normalShips = 20;
    this.jankyShips = 3;
    this.speed = 100;
    this.speedVariance = 50;
    this.jankiness = 0.1;

    this._canvas = canvas;
    this._context = canvas.getContext('2d');
    this._ships = [];
  }

  var LevelProto = Level.prototype;

  LevelProto.play = function() {
    var ship;

    for (var i = this.normalShips + this.jankyShips; i--;) {
      ship = new ji.Ship();
      ship.y = Math.random() * (this._canvas.height - ship.height);
      ship.x = -ship.width;
      ship.xMax = this._canvas.width;
      ship.xVel = this.speed + (Math.random() * (this.speedVariance * 2)) - this.speedVariance;
      ship.jankiness = i < this.jankyShips ? this.jankiness : 0;
      this._ships.push(ship);
    }

    this._gameLoop();
  };

  LevelProto._gameLoop = function() {
    var level = this;
    var lastTime;
    var context = level._context;

    function frame(time) {
      var timePassed = time - lastTime;
      lastTime = time;
      context.clearRect(0, 0, level._canvas.width, level._canvas.height);
      context.fillStyle = '#0f0';

      var ship;
      for (var i = 0, len = level._ships.length; i < len; i++) {
        ship = level._ships[i];
        if (ship.active) {
          ship.tick(timePassed);
          if (ship.active) {
            context.fillRect(ship.x, ship.y, ship.width, ship.height);
          }
        }
      }

      requestAnimationFrame(frame);
    }

    requestAnimationFrame(function(time) {
      lastTime = time;
      requestAnimationFrame(frame);
    });
  };

  ji.Level = Level;
})();