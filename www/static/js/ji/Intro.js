(function() {
  function Intro() {
    var intro = this;
    this._el = document.querySelector('.intro');
    this.active = false;
    this._goodShip = ji.Ship.fromSprite(3);
    this._badShip = ji.Ship.fromSprite(3);
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

    var start = 'translate(' + (containerWidth/2 - introWidth/2) + 'px, ' + (-introHeight) + 'px)';
    var end = 'translate(' + (containerWidth/2 - introWidth/2) + 'px, ' + (containerHeight/2 - introHeight/2) + 'px)';
    
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

    intro._badShip.x = intro._goodShip.x = -intro._goodShip.width;
    intro._badShip.y = intro._goodShip.y = 0;
    intro._badShip.xMax = intro._goodShip.xMax = intro._goodCanvas.width;
    intro._badShip.xVel = intro._goodShip.xVel = 100;

    intro._badShip.jankiness = 0.1;

    function frame(time) {
      var timePassed = time - lastTime;
      lastTime = time;

      goodContext.clearRect(0, 0, intro._goodCanvas.width, intro._goodCanvas.height);
      badContext.clearRect(0, 0, intro._badCanvas.width, intro._badCanvas.height);

      intro._goodShip.tick(timePassed);
      intro._badShip.tick(timePassed);

      intro._goodShip.draw(goodContext);
      intro._badShip.draw(badContext);

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
    var end = 'translate(' + (containerWidth/2 - introWidth/2) + 'px, ' + containerHeight + 'px)';

    return ji.utils.transition(this._el, {
      transform: end
    }, 0.5, 'easeInQuad').then(function() {
      intro._el.style.display = 'none';
    });
  };

  ji.Intro = Intro;
})();