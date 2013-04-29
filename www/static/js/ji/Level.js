(function() {
  function Level(canvas) {
    this.normalShips = 50;
    this.jankyShips = 10;
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
      do {
        ship.y = Math.random() * (this._canvas.height - ship.height);
        ship.x = -ship.width - Math.random() * this._canvas.width;
      } while (this._getIntersectingShip(ship.x, ship.y, ship.width, ship.height));
      ship.xMax = this._canvas.width;
      ship.xVel = this.speed + (Math.random() * (this.speedVariance * 2)) - this.speedVariance;
      ship.jankiness = i < this.jankyShips ? this.jankiness : 0;
      this._ships.push(ship);
    }

    this._gameLoop();
  };

  LevelProto._getIntersectingShip = function(x, y, width, height) {
    var ship;
    for (var i = this._ships.length; i--;) { // loop backwards to get on-top ship
      ship = this._ships[i];
      if (
        x < ship.x + ship.width &&
        y < ship.y + ship.height &&
        x + width > ship.x &&
        y + height > ship.y
      ) {
        return ship;
      }
    }
    return false;
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
            context.fillRect(ship.renderX, ship.y, ship.width, ship.height);
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