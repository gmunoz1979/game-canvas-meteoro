Misil = Class(
  {
    id: null,
    x: 0,
    y: 0,
    ctx: null,
    color: '#FF0000',
    angle: null,
    rad: null,
    width: 3,
    radius: 0,
    speed: 3,
    onFire: function() {},

    initialize: function(config) {
      apply(this, config);

      this.id  = getId();
      this.rad = (Math.PI/180) * this.angle;
    },

    getXY: function(radius) {
      return {
        y: this.y - Math.ceil(Math.sin(this.rad) * radius),
        x: this.x - Math.ceil(Math.cos(this.rad) * radius)
      }
    },

    clear: function() {
      var xy1 = this.getXY(this.radius-4),
          xy2 = this.getXY(this.radius+this.width);

      this.ctx.strokeStyle = '#000000';
      this.ctx.lineWidth = 4;

      this.ctx.beginPath();
      this.ctx.moveTo(xy1.x, xy1.y);
      this.ctx.lineTo(xy2.x, xy2.y);
      this.ctx.closePath();
      this.ctx.stroke();
    },

    draw: function() {
      var xy1 = this.getXY(this.radius),
          xy2 = this.getXY(this.radius+this.width);

      this.ctx.strokeStyle = this.color;
      this.ctx.lineWidth = 1;
      
      this.ctx.beginPath();      
      this.ctx.moveTo(xy1.x, xy1.y);
      this.ctx.lineTo(xy2.x, xy2.y);
      this.ctx.closePath();
      this.ctx.stroke();
    },

    isCollition: function() {
      var xy = this.getXY(this.radius+this.width);

      /** 
       * Evaluamos los margenes
       */
      if (xy.x <= 0 || xy.x >= MAXWIDTH || xy.y <= 0) {
        return true;
      }

      /**
       * Listado de meteoros
       */
      var meteoros = MeteoroManager.items;
      for (var name in meteoros) {
        var m = meteoros[name];
        if (xy.x >= m.x-1 && 
            xy.x <= m.x+2 && 
            xy.y >= m.y   && 
            xy.y <= m.y+m.height &&
           !m.isDestroy) {
          m.exploit(xy.y);
          this.onFire();
          return true;
        }
      }

      return false;
    },

    update: function() {
      //this.clear();

      if (this.isCollition()) {
        this.remove();
        return;
      }

      this.draw();

      this.radius += this.speed;
    },

    remove: function() {
      this.manager && this.manager.remove(this);
    }
  }
);