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

    // x, y, x, y, x, y, x, y
    this.leftShotPoints = Array(8);
    this.rightShotPoints = Array(8);

    this._remaining = 0;

    // shot angles & lengths
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
      // The start of the shot follows the end, but quicker & with a delay.
      // Gives an illusation of perspective
      var endPhase = 1 - Math.pow(this._remaining / duration, 3);
      var startPhase = Math.max(endPhase * 2 - 1, 0);

      // Get the bullet start & end points
      var leftShotStart = this._leftShotLen * startPhase;
      var rightShotStart = this._rightShotLen * startPhase;
      var leftShotEnd = this._leftShotLen * endPhase;
      var rightShotEnd = this._rightShotLen * endPhase;

      // Get the offset of the start & end of the bullets from the center.
      // This gives the bullets thickness
      var startTopOffset = (1-startPhase) * startHeight/2;
      var endTopOffset = (1-endPhase) * startHeight/2;

      // x,y groups:
      this.leftShotPoints[0] = leftShotStart * Math.cos(this._leftShotAngle);
      this.leftShotPoints[1] = leftShotStart * Math.sin(this._leftShotAngle) + startTopOffset + this.stageHeight/2;

      this.leftShotPoints[2] = this.leftShotPoints[0];
      this.leftShotPoints[3] = leftShotStart * Math.sin(this._leftShotAngle) - startTopOffset + this.stageHeight/2;

      this.leftShotPoints[4] = leftShotEnd * Math.cos(this._leftShotAngle);
      this.leftShotPoints[5] = leftShotEnd * Math.sin(this._leftShotAngle) - endTopOffset + this.stageHeight/2;

      this.leftShotPoints[6] = this.leftShotPoints[4];
      this.leftShotPoints[7] = leftShotEnd * Math.sin(this._leftShotAngle) + endTopOffset + this.stageHeight/2;

      this.rightShotPoints[0] = this.stageWidth - rightShotStart * Math.cos(this._rightShotAngle);
      this.rightShotPoints[1] = rightShotStart * Math.sin(this._rightShotAngle) + startTopOffset + this.stageHeight/2;

      this.rightShotPoints[2] = this.rightShotPoints[0];
      this.rightShotPoints[3] = rightShotStart * Math.sin(this._rightShotAngle) - startTopOffset + this.stageHeight/2;

      this.rightShotPoints[4] = this.stageWidth - rightShotEnd * Math.cos(this._rightShotAngle);
      this.rightShotPoints[5] = rightShotEnd * Math.sin(this._rightShotAngle) - endTopOffset + this.stageHeight/2;

      this.rightShotPoints[6] = this.rightShotPoints[4];
      this.rightShotPoints[7] = rightShotEnd * Math.sin(this._rightShotAngle) + endTopOffset + this.stageHeight/2;
    }
  };

  ShotProto.draw = function(context) {
    context.fillStyle = 'rgba(255, 50, 0, 1)';
    context.beginPath();
    context.moveTo(level._shot.leftShotPoints[0], level._shot.leftShotPoints[1]);
    context.lineTo(level._shot.leftShotPoints[2], level._shot.leftShotPoints[3]);
    context.lineTo(level._shot.leftShotPoints[4], level._shot.leftShotPoints[5]);
    context.lineTo(level._shot.leftShotPoints[6], level._shot.leftShotPoints[7]);
    context.closePath();
    context.moveTo(level._shot.rightShotPoints[0], level._shot.rightShotPoints[1]);
    context.lineTo(level._shot.rightShotPoints[2], level._shot.rightShotPoints[3]);
    context.lineTo(level._shot.rightShotPoints[4], level._shot.rightShotPoints[5]);
    context.lineTo(level._shot.rightShotPoints[6], level._shot.rightShotPoints[7]);
    context.closePath();
    context.fill();
  };

  ji.Shot = Shot;
})();