(function() {
  function Level(canvas) {
    this.normalShips = 50;
    this.jankyShips = 10;
    this.speed = 100;
    this.speedVariance = 60;
    this.jankiness = 0.1;

    this._canvas = canvas;
    this._context = canvas.getContext('2d');
    this._ships = [];
    // store clicks here
    this._pendingClick = null;
  }

  var LevelProto = Level.prototype;

  LevelProto.play = function() {
    var ship;

    for (var i = this.normalShips + this.jankyShips; i--;) {
      ship = ji.Ship.random();
      do {
        ship.y = Math.random() * (this._canvas.height - ship.height);
        ship.x = -ship.width - Math.random() * this._canvas.width;
      } while (this._getIntersectingShip(ship.x, ship.y, ship.width, ship.height));
      ship.xMax = this._canvas.width;
      ship.xVel = this.speed + (Math.random() * (this.speedVariance * 2)) - this.speedVariance;
      ship.jankiness = i < this.jankyShips ? this.jankiness : 0;
      this._ships.push(ship);
    }

    this._canvas.addEventListener('click', this._onCanvasClick.bind(this));

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
    return null;
  };

  LevelProto._gameLoop = function() {
    var level = this;
    var lastTime;
    var context = level._context;

    function frame(time) {
      var timePassed = time - lastTime;
      var ship;

      lastTime = time;
      context.clearRect(0, 0, level._canvas.width, level._canvas.height);

      if (level._pendingClick) {
        ship = level._getIntersectingShip(level._pendingClick.clientX, level._pendingClick.clientY, 1, 1);
        if (ship) {
          ship.active = false;
          if (ship.jankiness) {
            level.jankyShips--;
          }
          else {
            level.normalShips--;
          }
          console.log("Normal", level.normalShips, "Janky", level.jankyShips);
        }
        level._pendingClick = null;
      }
      
      for (var i = 0, len = level._ships.length; i < len; i++) {
        ship = level._ships[i];
        if (ship.active) {
          ship.tick(timePassed);
          if (ship.active) {
            context.drawImage(ship.sprite, ship.renderX, ship.y);
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

  LevelProto._onCanvasClick = function(event) {
    this._pendingClick = event;
    event.preventDefault();
  };

  ji.Level = Level;
})();