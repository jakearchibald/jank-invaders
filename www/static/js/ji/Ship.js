(function() {
  function Ship() {
    this.x = 0;
    this.y = 0;
    this.width = 100;
    this.height = 20;
    this.xMax = 0;
    this.xVel = 0; // pixels per second
    this.janky = false;
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
  };

  ji.Ship = Ship;
})();