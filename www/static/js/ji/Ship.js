(function() {
  var shipSprites;
  var loader;

  function Ship() {
    this.x = 0;
    // like this.x, but we jank it :D
    this.renderX = -1000;
    this.y = 0;
    this.width = 0;
    this.height = 0;
    this.xMax = 0;
    this.xVel = 0; // in pixels per second
    // 0 - skip no frames
    // 1 - skip all frames (0.1 is a good value)
    this.jankiness = 0;
    this.loop = true;
    this.active = true;
    this.sprite = null;
  }

  Ship.load = function() {
    if (loader) {
      return loader;
    }

    loader = Q.fcall(function() {
      var deferred = Q.defer();
      var img = new Image();
      img.onload = function() {
        deferred.resolve(img);
      };

      img.onerror = function() {
        deferred.reject(img);
      };

      img.src = 'static/imgs/ships.png';

      return deferred.promise;
    }).then(function(img) {
      // width, height, x, y
      shipSprites = [
        [97, 100, 0, 0],
        [88, 75, 7, 114],
        [70, 91, 17, 204],
        [92, 95, 3, 310]
      ].map(function(rect) {
        var canvas = document.createElement('canvas');
        // adding 1px padding around element for smoother rendering (working around Chrome issue)
        canvas.width = rect[0] + 2;
        canvas.height = rect[1] + 2;
        canvas.getContext('2d').drawImage(img, rect[2], rect[3], rect[0], rect[1], 1, 1, rect[0], rect[1]);
        return canvas;
      });

      return true;
    });

    return loader;
  };

  Ship.random = function() {
    var sprite = shipSprites[Math.floor(Math.random() * shipSprites.length)];
    var ship = new Ship();
    ship.sprite = sprite;
    ship.width = sprite.width;
    ship.height = sprite.height;
    return ship;
  };

  var ShipProto = Ship.prototype;

  ShipProto.tick = function(timePassed) {
    this.x = this.x + this.xVel * timePassed/1000;

    if (this.x > this.xMax) {
      if (this.loop) {
        this.x = (this.x + this.width) % (this.xMax + this.width) - this.width;
      }
      else {
        this.active = false;
      }
    }

    if (!this.jankiness || Math.random() + this.jankiness < 1) {
      this.renderX = this.x;
    }
  };

  ShipProto.draw = function(context) {
    context.drawImage(this.sprite, this.renderX, this.y);
  };

  ji.Ship = Ship;
})();