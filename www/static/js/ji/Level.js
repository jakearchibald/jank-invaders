(function() {
  function Level(canvas) {
    this.normalShips = 50;
    this.jankyShips = 10;
    this.speed = 100;
    this.speedVariance = 50;
    this.jankiness = 0.2;

    this._canvas = canvas;
    this._context = canvas.getContext('2d');
    this._ships = [];
    this._shot = new ji.Shot();
    this._explosions = [new ji.Explosion(), new ji.Explosion()];
    this._flash = new ji.Flash();
    // store clicks here
    this._pendingClick = null;
    // at the end of a level, the ships warp away
    this._warpAway = false;

    this._scoreTime = 0;
    this._innocentsKilled = 0;
    this._timeEl = document.querySelector('.level-ui .time .num');
    this._remainingEl = document.querySelector('.level-ui .spies .num');

    this._onCanvasClick = this._onCanvasClick.bind(this);
  }

  var LevelProto = Level.prototype = Object.create(EventEmitter.prototype);

  LevelProto.play = function() {
    var ship;
    var shipPlacementTries = 1000; // stops us getting in an infinite loop

    for (var i = this.normalShips + this.jankyShips; i--;) {
      ship = ji.Ship.random();
      do {
        ship.y = Math.random() * (this._canvas.height - ship.height - 80); // 80 for the ui
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

    this._flash.width = this._canvas.width;
    this._flash.height = this._canvas.height;

    this._canvas.addEventListener('touchstart', this._onCanvasClick);
    this._canvas.addEventListener('mousedown', this._onCanvasClick);

    this._remainingEl.textContent = this.jankyShips;
    this._timeEl.textContent = '0:00.000';

    this._gameLoop();
  };

  LevelProto._end = function() {
    this._canvas.removeEventListener('touchstart', this._onCanvasClick);
    this._canvas.removeEventListener('mousedown', this._onCanvasClick);
    this.trigger('end', {
      time: this._scoreTime,
      innocentsKilled: this._innocentsKilled
    });
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
      var explosion;
      var i;
      var somethingActive = false;


      lastTime = time;
      context.clearRect(0, 0, level._canvas.width, level._canvas.height);

      if (level._pendingClick) {
        if (!level._shot.active) {
          level._shot.fire(level._pendingClick.clientX, level._pendingClick.clientY);
        }
        level._pendingClick = null;
      }

      if (level._flash.active) {
        level._flash.tick(timePassed);
        if (level._flash.active) {
          level._flash.draw(context);
        }
      }
      
      for (i = 0, len = level._ships.length; i < len; i++) {
        ship = level._ships[i];
        if (ship.active) {
          if (level._warpAway) {
            ship.xVel *= 1.05;
          }
          ship.tick(timePassed);
          if (ship.active) {
            somethingActive = true;
            ship.draw(context);
          }
        }
      }

      if (level._shot.active) {
        level._shot.tick(timePassed);
        if (level._shot.active) {
          somethingActive = true;
          level._shot.draw(context);
        }
      }

      if (level._shot.needsResolving) {
        ship = level._getIntersectingShip(level._shot.x, level._shot.y, 1, 1);
        if (ship) {
          ship.active = false;

          explosion = level._explosions[level._explosions[0].active ? 1 : 0];
          explosion.start(ship);

          if (ship.jankiness) {
            level.jankyShips--;
            level._flash.flash(0, 180, 0);
            level._remainingEl.textContent = level.jankyShips;
          }
          else {
            level.normalShips--;
            level._innocentsKilled++;
            level._flash.flash(255, 0, 0);
            level._scoreTime += 10 * 1000; // time penalty
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

      for (i = 0, len = level._explosions.length; i < len; i++) {
        explosion = level._explosions[i];
        if (explosion.active) {
          explosion.tick(timePassed);
          if (explosion.active) {
            somethingActive = true;
            explosion.draw(context);
          }
        }
      }

      if (level.jankyShips) {
        level._scoreTime += timePassed;
        level._timeEl.textContent = ji.utils.formatTime(level._scoreTime);
      }

      if (somethingActive) {
        requestAnimationFrame(frame);
      }
      else {
        level._end();
      }
    }

    requestAnimationFrame(function(time) {
      lastTime = time;
      requestAnimationFrame(frame);
    });
  };

  LevelProto._onCanvasClick = function(event) {
    if (event.touches) {
      this._pendingClick = event.touches[0];
    }
    else {
      this._pendingClick = event;
    }
    event.preventDefault();
  };

  ji.Level = Level;
})();