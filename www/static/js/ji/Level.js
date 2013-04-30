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
    this._shot = new ji.Shot();
    // store clicks here
    this._pendingClick = null;
    // at the end of a level, the ships warp away
    this._warpAway = false;
  }

  var LevelProto = Level.prototype;

  LevelProto.play = function() {
    var ship;
    var shipPlacementTries = 1000; // stops us getting in an infinite loop

    for (var i = this.normalShips + this.jankyShips; i--;) {
      ship = ji.Ship.random();
      do {
        ship.y = Math.random() * (this._canvas.height - ship.height);
        ship.x = -ship.width - Math.random() * this._canvas.width;

        if (shipPlacementTries) { shipPlacementTries--; }
      } while (shipPlacementTries && this._getIntersectingShip(ship.x, ship.y, ship.width, ship.height));
      ship.xMax = this._canvas.width;
      ship.xVel = this.speed + (Math.random() * (this.speedVariance * 2)) - this.speedVariance;
      ship.jankiness = i < this.jankyShips ? this.jankiness : 0;
      this._ships.push(ship);
    }

    this._shot.stageWidth = this._canvas.width;
    this._shot.stageHeight = this._canvas.height;

    this._canvas.addEventListener('click', this._onCanvasClick.bind(this));

    this._gameLoop();
  };

  LevelProto._getIntersectingShip = function(x, y, width, height) {
    var ship;
    for (var i = this._ships.length; i--;) { // loop backwards to get topmost ship
      ship = this._ships[i];
      if (
        ship.active &&
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
      var i;

      lastTime = time;
      context.clearRect(0, 0, level._canvas.width, level._canvas.height);

      if (level._pendingClick) {
        if (!level._shot.active) {
          level._shot.fire(level._pendingClick.clientX, level._pendingClick.clientY);
        }
        level._pendingClick = null;
      }
      
      for (i = 0, len = level._ships.length; i < len; i++) {
        ship = level._ships[i];
        if (ship.active) {
          if (level._warpAway) {
            ship.xVel *= 1.05;
          }
          ship.tick(timePassed);
          if (ship.active) {
            context.drawImage(ship.sprite, ship.renderX, ship.y);
          }
        }
      }

      if (level._shot.active) {
        level._shot.tick(timePassed);
        if (level._shot.active) {
          context.fillStyle = 'rgba(255, 50, 0, 1)';
          context.beginPath();
          context.moveTo(level._shot.leftShotPoints[0], level._shot.leftShotPoints[1]);
          context.lineTo(level._shot.leftShotPoints[2], level._shot.leftShotPoints[3]);
          context.lineTo(level._shot.leftShotPoints[4], level._shot.leftShotPoints[5]);
          context.lineTo(level._shot.leftShotPoints[6], level._shot.leftShotPoints[7]);
          context.closePath();
          context.moveTo(level._shot.rightShotPoints[0], level._shot.rightShotPoints[1]);
          context.lineTo(level._shot.rightShotPoints[2], level._shot.rightShotPoints[3]);
          context.lineTo(level._shot.rightShotPoints[4], level._shot.rightShotPoints[5]);
          context.lineTo(level._shot.rightShotPoints[6], level._shot.rightShotPoints[7]);
          context.closePath();
          context.fill();
        }
      }

      if (level._shot.needsResolving) {
        ship = level._getIntersectingShip(level._shot.x, level._shot.y, 1, 1);
        if (ship) {
          ship.active = false;
          if (ship.jankiness) {
            level.jankyShips--;
          }
          else {
            level.normalShips--;
          }
          if (!level.jankyShips || !level.normalShips) {
            level._warpAway = true;
            for (i = 0, len = level._ships.length; i < len; i++) {
              level._ships[i].loop = false;
            }
          }
          console.log("Normal", level.normalShips, "Janky", level.jankyShips);
        }
        level._shot.needsResolving = false;
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