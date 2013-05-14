(function() {
  function Intro() {
    var intro = this;
    this._el = document.querySelector('.intro');
    this.active = false;
    this._goodShips = [0, 1, 2, 3].map(function(i) {
      return ji.Ship.fromSprite(i);
    });
    this._badShips = [0, 1, 2, 3].map(function(i) {
      return ji.Ship.fromSprite(i);
    });
    this._goodCanvas = this._el.querySelector('.good-guys');
    this._badCanvas = this._el.querySelector('.bad-guys');

    this._el.querySelector('.begin').addEventListener('click', function(event) {
      if (intro.active) {
        intro.active = false;
        intro.hide().then(function() {
          intro.trigger('gamestart');
        });
      }
      event.preventDefault();
    });
  }

  var IntroProto = Intro.prototype = Object.create(EventEmitter.prototype);

  IntroProto.show = function() {
    this._el.style.display = 'block';
    var container = this._el.parentNode;
    var containerWidth = container.offsetWidth;
    var containerHeight = container.offsetHeight;
    var introWidth = this._el.offsetWidth;
    var introHeight = this._el.offsetHeight;
    var intro = this;

    this._goodCanvas.width = this._goodCanvas.offsetWidth;
    this._goodCanvas.height = this._goodCanvas.offsetHeight;
    this._badCanvas.width = this._badCanvas.offsetWidth;
    this._badCanvas.height = this._badCanvas.offsetHeight;

    var start = 'translate(' + Math.floor(containerWidth/2 - introWidth/2) + 'px, ' + (-introHeight) + 'px)';
    var end = 'translate(' + Math.floor(containerWidth/2 - introWidth/2) + 'px, ' + Math.floor(containerHeight/2 - introHeight/2) + 'px)';
    
    ji.utils.css(this._el, 'transform', start);
    ji.utils.transition(this._el, {
      transform: end
    }, 1, 'easeOutQuint').then(function() {
      intro._animShips();
    });

    this.active = true;
  };

  IntroProto._animShips = function() {
    var lastTime;
    var intro = this;
    var goodContext = this._goodCanvas.getContext('2d');
    var badContext = this._badCanvas.getContext('2d');
    var startX = 0;

    function setupShip(ship) {
      startX -= ship.width;
      ship.x = startX;
      ship.y = intro._goodCanvas.height/2 - ship.height/2;
      ship.xMax = intro._goodCanvas.width;
      ship.xVel = 100;
      startX -= 20;
    }

    this._goodShips.forEach(setupShip);
    startX = 0;

    this._badShips.forEach(function(ship) {
      setupShip(ship);
      ship.jankiness = 0.2;
    });

    function frame(time) {
      var timePassed = time - lastTime;
      var ship;
      lastTime = time;

      goodContext.clearRect(0, 0, intro._goodCanvas.width, intro._goodCanvas.height);
      badContext.clearRect(0, 0, intro._badCanvas.width, intro._badCanvas.height);

      for (var i = intro._goodShips.length; i--;) {
        ship = intro._goodShips[i];
        ship.tick(timePassed);
        ship.draw(goodContext);
      }

      for (i = intro._badShips.length; i--;) {
        ship = intro._badShips[i];
        ship.tick(timePassed);
        ship.draw(badContext);
      }

      if (intro.active) {
        requestAnimationFrame(frame);
      }
    }

    requestAnimationFrame(function(time) {
      lastTime = time;
      requestAnimationFrame(frame);
    });
  };

  IntroProto.hide = function() {
    var intro = this;
    var container = this._el.parentNode;
    var containerWidth = container.offsetWidth;
    var containerHeight = container.offsetHeight;
    var introWidth = this._el.offsetWidth;
    var introHeight = this._el.offsetHeight;
    var end = 'translate(' + (containerWidth/2 - introWidth/2) + 'px, ' + (containerHeight + 2) + 'px)';

    return ji.utils.transition(this._el, {
      transform: end
    }, 0.5, 'easeInQuad').then(function() {
      intro._el.style.display = 'none';
    });
  };

  ji.Intro = Intro;
})();