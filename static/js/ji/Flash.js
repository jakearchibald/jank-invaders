(function() {
  function Flash() {
    this.width = 0;
    this.height = 0;
    this.duration = 500;
    this.active = false;
    this._opacity = 0;
    this._timeRemaining = 0;
    this._colorStr = '';
  }

  var FlashProto = Flash.prototype;

  FlashProto.flash = function(r, g, b) {
    this._colorStr = r + ',' + g + ',' + b + ',';
    this._timeRemaining = this.duration;
    this.active = true;
  };

  FlashProto.tick = function(timePassed) {
    this._timeRemaining -= timePassed;
    if (this._timeRemaining <= 0) {
      this.active = false;
    }
    else {
      this._opacity = 0.5 * (this._timeRemaining / this.duration);
    }
  };

  FlashProto.draw = function(context) {
    context.fillStyle = 'rgba(' + this._colorStr + this._opacity + ')';
    context.fillRect(0, 0, this.width, this.height);
  };

  ji.Flash = Flash;
})();