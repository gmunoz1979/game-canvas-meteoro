Tank = Class(
  {
    x: 0,
    y: 0,
    ctx: null,
    color: '#FF0000',
    radius: 15,
    angle: 90,
    prevAngle: null,
    width: 10,
    nextFire: 0,
    points: 0,
    energy: 100,
    isMove: false,
    speed: 0,
    isFire: false,

    initialize: function(config) {
      apply(this, config);

      this.x = MAXWIDTH / 2;
      this.y = MAXHEIGHT;
      this.prevAngle = this.angle;
      
      this.arc = new Path2D();
      this.arc.arc(this.x, this.y, this.radius, 0, Math.PI, true);
    },

    getXY: function(angle, radius) {
      var rad = (Math.PI/180) * angle;

      return {
        y: this.y - Math.ceil(Math.sin(rad) * radius),
        x: this.x - Math.ceil(Math.cos(rad) * radius)
      }
    },

    clear: function() {
      // this.ctx.save();
      // this.ctx.strokeStyle = '#000000';
      // this.ctx.lineWidth = 1;
      // this.ctx.beginPath();
      // this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI, true);
      // this.ctx.stroke();

      // var xy1 = this.getXY(this.angle, this.radius),
      //     xy2 = this.getXY(this.angle, this.radius + this.width+1);
      
      // this.ctx.lineWidth = 3;
      // this.ctx.beginPath();
      // this.ctx.moveTo(xy1.x, xy1.y);
      // this.ctx.lineTo(xy2.x, xy2.y);
      // this.ctx.stroke();
      // this.ctx.restore();
    },

    draw: function() {
      this.ctx.strokeStyle = this.color;
      this.ctx.lineWidth = 0.5;
      this.ctx.stroke(this.arc);

      var xy1 = this.getXY(this.angle, this.radius);
      var xy2 = this.getXY(this.angle, this.radius+this.width);
      
      this.ctx.lineWidth = 1;
      this.ctx.beginPath();
      this.ctx.moveTo(xy1.x, xy1.y);
      this.ctx.lineTo(xy2.x, xy2.y);
      this.ctx.stroke();
    },

    setAngle: function(inc) {
      if (this.angle+inc < 20 || this.angle+inc > 160) {
        return;
      }

      this.prevAngle = this.angle + inc;
    },

    onFire: function() {
      this.points += 10;
    },

    onExploit: function() {
      this.energy -= 10;

      if (this.energy < 0) {
        this.energy = 0;
      }
    },

    fire: function() {
      if (this.nextFire > new Date().getTime()) {
        return;
      }

      var self = this;

      MisilManager.add(
        new Misil(
          { 
            ctx: this.ctx,
            x: this.x, 
            y: this.y,
            radius: this.radius+this.width,
            angle: this.angle,
            manager: MisilManager,
            onFire: function() { self.onFire(); }
          }
        )
      );

      this.nextFire = new Date().getTime() + 100;
    },

    startMove: function(speed) {
      this.speed  = speed;
      this.isMove = true;
    },

    stopMove: function(speed) {
      if (speed !== this.speed) { return; }

      this.speed  = 0;
      this.isMove = false;
    },

    move: function() {
      this.setAngle(this.speed);
    },

    startFire: function(speed) {
      this.isFire = true;
    },

    stopFire: function() {
      this.isFire = false;
    },

    update: function() {
      //this.clear();
      this.isMove && this.move();
      this.isFire && this.fire();
      this.angle = this.prevAngle;
      this.draw();
      MisilManager.update();
    }
  }
);