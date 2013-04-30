(function() {
  var startHeight = 300;
  var duration = 300;

  function Shot() {
    this.stageWidth = 0;
    this.stageHeight = 0;
    this.active = false;
    this.needsResolving = null;

    this.x = 0;
    this.y = 0;

    this.leftShotPoints = Array(8);
    this.rightShotPoints = Array(8);
    this._remaining = 0;
    this._leftShotLen = 0;
    this._leftShotAngle = 0;
    this._rightShotLen = 0;
    this._rightShotAngle = 0;
  }

  var ShotProto = Shot.prototype;

  ShotProto.fire = function(x, y) {
    this.x = x;
    this.y = y;
    this._remaining = duration;
    this.active = true;

    var yDiff = y - this.stageHeight/2;

    this._leftShotLen = Math.sqrt(x*x + yDiff*yDiff);
    this._leftShotAngle = Math.atan2(yDiff, x);

    this._rightShotLen = Math.sqrt(Math.pow(this.stageWidth - x, 2) + yDiff*yDiff);
    this._rightShotAngle = Math.atan2(yDiff, this.stageWidth - x);
  };

  ShotProto.tick = function(timePassed) {
    this._remaining -= timePassed;

    if (this._remaining <= 0) {
      this.needsResolving = true;
      this.active = false;
    }
    else {
      var endPhase = 1 - Math.pow(this._remaining / duration, 3);
      var startPhase = Math.max(endPhase * 2 - 1, 0);
      var leftShotStart = this._leftShotLen * startPhase;
      var rightShotStart = this._rightShotLen * startPhase;
      var leftShotEnd = this._leftShotLen * endPhase;
      var rightShotEnd = this._rightShotLen * endPhase;

      this.leftShotPoints[0] = leftShotStart * Math.cos(this._leftShotAngle);
      this.leftShotPoints[1] = leftShotStart * Math.sin(this._leftShotAngle) + (1-startPhase) * startHeight/2 + this.stageHeight/2;

      this.leftShotPoints[2] = leftShotStart * Math.cos(this._leftShotAngle);
      this.leftShotPoints[3] = leftShotStart * Math.sin(this._leftShotAngle) - (1-startPhase) * startHeight/2 + this.stageHeight/2;

      this.leftShotPoints[4] = leftShotEnd * Math.cos(this._leftShotAngle);
      this.leftShotPoints[5] = leftShotEnd * Math.sin(this._leftShotAngle) - (1-endPhase) * startHeight/2 + this.stageHeight/2;

      this.leftShotPoints[6] = leftShotEnd * Math.cos(this._leftShotAngle);
      this.leftShotPoints[7] = leftShotEnd * Math.sin(this._leftShotAngle) + (1-endPhase) * startHeight/2 + this.stageHeight/2;

      this.rightShotPoints[0] = this.stageWidth - rightShotStart * Math.cos(this._rightShotAngle);
      this.rightShotPoints[1] = rightShotStart * Math.sin(this._rightShotAngle) + (1-startPhase) * startHeight/2 + this.stageHeight/2;

      this.rightShotPoints[2] = this.stageWidth - rightShotStart * Math.cos(this._rightShotAngle);
      this.rightShotPoints[3] = rightShotStart * Math.sin(this._rightShotAngle) - (1-startPhase) * startHeight/2 + this.stageHeight/2;

      this.rightShotPoints[4] = this.stageWidth - rightShotEnd * Math.cos(this._rightShotAngle);
      this.rightShotPoints[5] = rightShotEnd * Math.sin(this._rightShotAngle) - (1-endPhase) * startHeight/2 + this.stageHeight/2;

      this.rightShotPoints[6] = this.stageWidth - rightShotEnd * Math.cos(this._rightShotAngle);
      this.rightShotPoints[7] = rightShotEnd * Math.sin(this._rightShotAngle) + (1-endPhase) * startHeight/2 + this.stageHeight/2;
    }
  };

  ji.Shot = Shot;
})();