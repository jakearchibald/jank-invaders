(function() {
  function FpsWarning() {
    this._bufferSize = 10;
    this._buffer = Array(this._bufferSize);
    this._maxDeviation = 0.15;
    this._maxStrikes = 3;
    this._strikeWindow = 2500;
    this._strikeDecrementInterval = this._strikeWindow / this._maxStrikes;
    this.reset();
    window.buf = this._buffer;
  }

  var FpsWarningProto = FpsWarning.prototype;

  FpsWarningProto.reset = function() {
    this._strikeWindowPos = 0;
    this._bufferPos = 0;
    this._strikes = 0;
    this.jankDetected = false;
  };

  FpsWarningProto.tick = function(timePassed) {
    this._buffer[this._bufferPos] = timePassed;
    this._strikeWindowPos += timePassed;

    this._bufferPos = (this._bufferPos + 1) % this._bufferSize;

    if (this._strikeWindowPos > this._strikeDecrementInterval) {
      this._strikes -= Math.floor(this._strikeWindowPos / this._strikeDecrementInterval);
      this._strikes = Math.max(this._strikes, 0);
      this._strikeWindowPos = this._strikeWindowPos % this._strikeDecrementInterval;
    }

    if (this._bufferPos === 0) {
      var i = this._bufferSize;
      var total = 0;
      var average;
      var maxDeviation;

      while (i--) {
        total += this._buffer[i];
      }

      average = total / this._bufferSize;
      maxDeviation = average * this._maxDeviation;

      i = this._bufferSize;

      while (i--) {
        if (Math.abs(this._buffer[i] - average) > maxDeviation) {
          this._strikes++;
          console.log("strike");

          if (this._strikes > this._maxStrikes) {
            console.log("JANKY");
          }
          break;
        }
      }
    }
  };

  ji.FpsWarning = FpsWarning;
})();