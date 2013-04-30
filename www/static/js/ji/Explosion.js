(function() {
  function Particle() {
    this.x = 0;
    this.y = 0;
    this.xVel = 0;
    this.yVel = 0;
    this.width = 4;
    this.height = 4;
    this.active = false;
  }

  var ParticleProto = Particle.prototype;

  ParticleProto.tick = function(timePassed) {
    this.x += this.xVel * timePassed/1000;
    this.y += this.yVel * timePassed/1000;
  };

  var spikeParticles = 100;
  var explosiveParticles = 50;
  function Explosion() {
    this.x = 0;
    this.y = 0;
    this.active = false;
    this._particles = [];

    for (var i = spikeParticles + explosiveParticles; i--;) {
      this._particles[i] = new Particle();
    }
  }

  var ExplosionProto = Explosion.prototype;
  var maxAngleVariance = Math.PI / 4;
  var minVel = 5;
  var maxVel = 350;

  ExplosionProto.tick = function(timePassed) {
    var particle;
    this.active = false; // we set this from the particles

    for (var i = this._particles.length; i--;) {
      particle = this._particles[i];
      particle.tick(timePassed);

      if (particle.active && !this.active) {
        this.active = true;
      }
    }
  };


  ExplosionProto.start = function(obj) {
    var particle;
    var baseAngle = Math.random() * Math.PI;
    var vel;
    var angle;

    this.active = true;

    for (var i = this._particles.length; i--;) {
      particle = this._particles[i];
      if (i > spikeParticles) {
        angle = baseAngle + (Math.random() * maxAngleVariance - maxAngleVariance / 2);
      }
      else {
        angle = Math.random() * Math.PI;
      }
      vel = (Math.pow(Math.random(), 3) * (maxVel - minVel) + minVel) * (Math.round(Math.random()) ? -1 : 1);
      particle.x = obj.x + obj.width/2;
      particle.y = obj.y + obj.height/2;
      particle.xVel = Math.cos(angle) * vel;
      particle.yVel = Math.sin(angle) * vel;
      particle.active = true;
    }
  };

  ExplosionProto.draw = function(context) {
    var particle;
    context.fillStyle = 'rgba(255, 50, 0, 1)';
    
    for (var i = this._particles.length; i--;) {
      particle = this._particles[i];
      context.fillRect(particle.x, particle.y, particle.width, particle.height);
    }
  };

  ji.Explosion = Explosion;
})();