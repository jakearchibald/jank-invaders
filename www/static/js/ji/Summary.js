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

    if (details.innocentsKilled > 10) {
      this._msgEl.textContent = "Traitor! You destroyed more of your own fleet than the janky spies!";
    }
    else if (details.innocentsKilled > 4) {
      this._msgEl.textContent = "Hmm, you took out quite a few of your own ships. You need to be better at spotting jank.";
    }
    else if (details.time < 1000 * 15) {
      this._msgEl.textContent = "Wow! You're a gifted individual! You could shoot badly performing spacecraft professionally.";
    }
    else if (details.time < 1000 * 20) {
      this._msgEl.textContent = "Brilliant, you're one of the best! You need to be a few seconds quicker to be the very best though.";
    }
    else if (details.time < 1000 * 30) {
      this._msgEl.textContent = "A damn fine effort captain! I'm sure you can shave another 5 seconds off that though.";
    }
    else if (details.time < 1000 * 40) {
      this._msgEl.textContent = "Pretty good, you've got an eye for this. Could be faster, but you're on the right track!";
    }
    else if (details.time < 1000 * 50) {
      this._msgEl.textContent = "You've got potential, a bit more training and you'll be ready for battle.";
    }
    else if (details.time < 1000 * 80) {
      this._msgEl.textContent = "Not bad for a first go. It is your first go right? Do it in half the time, then we're talking.";
    }
    else if (details.time < 1000 * 120) {
      this._msgEl.textContent = "Well, you know what you're doing, you're just not doing it very fast.";
    }
    else {
      this._msgEl.textContent = "I assume you fell asleep half way through?";
    }

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