(function() {
  function Ship() {
    this.x = 0;
    this.y = 0;
    this.width = 100;
    this.height = 20;
    this.xMax = 0;
    this.xVel = 0; // pixels per second
    this.jankiness = 0;
    this.loop = true;
    this.active = true;

    // actual position x, this allows us to track
    // intended position but jank on this.x
    this._posX = 0;
  }

  var ShipProto = Ship.prototype;

  ShipProto.tick = function(timePassed) {
    this._posX = this._posX + this.xVel * timePassed/1000;

    if (this._posX > this.xMax) {
      if (this.loop) {
        this._posX = -this.width;
      }
      else {
        this.active = false;
      }
    }

    if (!this.jankiness || Math.random() + this.jankiness < 1) {
      this.x = this._posX;
    }
  };

  ji.Ship = Ship;
})();