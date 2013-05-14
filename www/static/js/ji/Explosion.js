(function() {
  var loader;
  var particleSprites;

  function Particle() {
    this.x = 0;
    this.y = 0;
    this.xVel = 0;
    this.yVel = 0;
    this.active = false;
    this.width = 28;
    this.height = 28;
    this.friction = 0;
    this.sprite = null;
    this.opacity = 1;
    this.fadeTime = 600;
    this.timeTillFade = 300;
    this.activeTime = 0;
    this.scale = 1;
  }

  var ParticleProto = Particle.prototype;

  ParticleProto.tick = function(timePassed) {
    this.activeTime += timePassed;
    this.x += this.xVel * timePassed/1000;
    this.y += this.yVel * timePassed/1000;
    this.yVel *= 1 - this.friction;
    this.xVel *= 1 - this.friction;

    if (this.activeTime > this.timeTillFade + this.fadeTime) {
      this.active = false;
    }
    else if (this.activeTime > this.timeTillFade) {
      this.opacity = 1 - (this.activeTime - this.timeTillFade) / this.fadeTime;
    }
  };

  var spikeParticles = 400;
  var explosiveParticles = 200;

  function Explosion() {
    this.x = 0;
    this.y = 0;
    this.active = false;
    this._particles = [];

    for (var i = spikeParticles + explosiveParticles; i--;) {
      this._particles[i] = new Particle();
    }
  }

  Explosion.load = function() {
    if (loader) {
      return loader;
    }

    loader = Q.fcall(function() {
      var deferred = Q.defer();
      var img = new Image();
      img.onload = function() {
        deferred.resolve(img);
      };

      img.onerror = function() {
        deferred.reject(img);
      };

      img.src = 'static/imgs/particle-sprites.png';

      return deferred.promise;
    }).then(function(img) {
      // width, height, x, y
      particleSprites = [
        [28, 28, 3, 3],
        [28, 28, 37, 3],
        [28, 28, 75, 3]
      ].map(function(rect) {
        var canvas = document.createElement('canvas');
        // adding 1px padding around element for smoother rendering (working around Chrome issue)
        canvas.width = rect[0] + 2;
        canvas.height = rect[1] + 2;
        canvas.getContext('2d').drawImage(img, rect[2], rect[3], rect[0], rect[1], 1, 1, rect[0], rect[1]);
        return canvas;
      });

      return true;
    });

    return loader;
  };

  var ExplosionProto = Explosion.prototype;
  var maxAngleVariance = Math.PI / 4;
  var minVel = 0;
  var maxVel = 500;

  ExplosionProto.tick = function(timePassed) {
    var particle;
    this.active = false; // we set this from the particles

    for (var i = this._particles.length; i--;) {
      particle = this._particles[i];

      if (!particle.active) {
        continue;
      }

      particle.tick(timePassed);

      if (particle.active && !this.active) {
        this.active = true;
      }
    }
  };


  ExplosionProto.start = function(ship) {
    var particle;
    var baseAngle = Math.random() * Math.PI;
    var vel;
    var angle;

    this.active = true;

    for (var i = this._particles.length; i--;) {
      particle = this._particles[i];

      if (i < spikeParticles) {
        angle = baseAngle + (Math.random() * maxAngleVariance - maxAngleVariance / 2);
      }
      else {
        angle = Math.random() * Math.PI;
      }
      vel = (Math.pow(Math.random(), 3) * (maxVel - minVel) + minVel) * (Math.round(Math.random()) ? -1 : 1);
      particle.x = ship.x + ship.width/2;
      particle.y = ship.y + ship.height/2;
      particle.xVel = Math.cos(angle) * vel;
      particle.yVel = Math.sin(angle) * vel;
      particle.friction = Math.random() * 0.05;
      particle.sprite = particleSprites[Math.round(Math.random() * 0.7) ? ship.jankiness ? 2 : 0 : 1];
      particle.opacity = 1;
      particle.active = true;
      particle.activeTime = 0;
      particle.fadeTime = 400 + Math.random() * 300;
      particle.scale = Math.random() * 0.9 + 0.1;
      particle.tick(50);
    }
  };

  ExplosionProto.draw = function(context) {
    var particle;

    context.globalCompositeOperation = 'lighter';
    
    for (var i = this._particles.length; i--;) {
      particle = this._particles[i];
      context.globalAlpha = particle.opacity;
      context.drawImage(particle.sprite, 0, 0, particle.width, particle.height, particle.x - (particle.width*particle.scale)/2, particle.y - (particle.height*particle.scale)/2, particle.width * particle.scale, particle.height * particle.scale);
    }

    context.globalCompositeOperation = 'source-over';
    context.globalAlpha = 1;
  };

  ji.Explosion = Explosion;
})();