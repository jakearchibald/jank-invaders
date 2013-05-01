(function() {
  function Summary() {
    var summary = this;
    this._el = document.querySelector('.summary');
    this._timeEl = this._el.querySelector('.time');
    this._msgEl = this._el.querySelector('.msg');

    this._el.querySelector('.restart').addEventListener('click', function(event) {
      if (summary.active) {
        summary.active = false;
        summary.hide().then(function() {
          summary.trigger('restart');
        });
      }
      event.preventDefault();
    });
  }

  var SummaryProto = Summary.prototype = Object.create(EventEmitter.prototype);

  SummaryProto.show = function(details) {
    this._el.style.display = 'block';
    var container = this._el.parentNode;

    this._timeEl.textContent = ji.utils.formatTime(details.time);
    this._msgEl.textContent = "Message goes here";

    var containerWidth = container.offsetWidth;
    var containerHeight = container.offsetHeight;
    var summaryWidth = this._el.offsetWidth;
    var summaryHeight = this._el.offsetHeight;

    this._el.style.left = (containerWidth/2 - summaryWidth/2) + 'px';
    this._el.style.top = (containerHeight/2 - summaryHeight/2) + 'px';
    this._el.style.opacity = '0';
    
    ji.utils.css(this._el, 'transform', 'scale(2)');

    ji.utils.transition(this._el, {
      transform: 'scale(1)',
      opacity: '1'
    }, 0.4, 'easeOutQuint');

    this.active = true;
  };

  SummaryProto.hide = function() {
    var summary = this;

    return ji.utils.transition(this._el, {
      transform: 'scale(0.1)',
      opacity: '0'
    }, 0.2, 'easeInQuad').then(function() {
      summary._el.style.display = 'none';
    });
  };

  ji.Summary = Summary;
})();