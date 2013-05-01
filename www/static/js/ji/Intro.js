(function() {
  function Intro() {
    var intro = this;
    this._el = document.querySelector('.intro');
    this.active = false;

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

    var start = 'translate(' + (containerWidth/2 - introWidth/2) + 'px, ' + (-introHeight) + 'px)';
    var end = 'translate(' + (containerWidth/2 - introWidth/2) + 'px, ' + (containerHeight/2 - introHeight/2) + 'px)';
    
    ji.utils.css(this._el, 'transform', start);
    ji.utils.transition(this._el, {
      transform: end
    }, 1, 'easeOutQuint');

    this.active = true;
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
    }, 0.5, 'easeInQuint').then(function() {
      intro._el.style.display = 'none';
    });
  };

  ji.Intro = Intro;
})();