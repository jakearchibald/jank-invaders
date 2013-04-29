(function() {
  function Ship() {
    this.x = 0;
    // like this.x, but we jank it :D
    this.renderX = -1000;
    this.y = 0;
    this.width = 100;
    this.height = 20;
    this.xMax = 0;
    this.xVel = 0; // in pixels per second
    // 0 - skip no frames
    // 1 - skip all frames
    this.jankiness = 0;
    this.loop = true;
    this.active = true;
  }

  var ShipProto = Ship.prototype;

  ShipProto.tick = function(timePassed) {
    this.x = this.x + this.xVel * timePassed/1000;

    if (this.x > this.xMax) {
      if (this.loop) {
        this.x = -this.width;
      }
      else {
        this.active = false;
      }
    }

    if (!this.jankiness || Math.random() + this.jankiness < 1) {
      this.renderX = this.x;
    }
  };

  ji.Ship = Ship;
})();