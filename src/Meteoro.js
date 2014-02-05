Meteoro = Class(
  {
    id: null,
    height: 0,
    width: 1,
    x: 0,
    y: 0,
    speed: 0,
    manager: null,
    ctx: null,
    isDestroy: false,
    radius: 0,
    color: '#FFFFFF',
    radiusMax: 30,
    onExploit: function() {},

    initialize: function(config) {
      apply(this, config);

      this.id    = getId();
      this.x     = Math.floor((Math.random() * (MAXWIDTH-20)) + 20);
      this.speed = Math.floor((Math.random() * 1.5) + 1);
    },

    clear: function() {
      this.ctx.clearRect(this.x, this.y, this.width, this.height);
    },

    drawLine: function() {
      this.ctx.fillStyle = this.color;
      this.ctx.fillRect(this.x, this.y, this.width, this.height);
    },

    clearExplosion: function(height) {
      this.ctx.clearRect(this.x - this.radius - 1, height - this.radius - 1, this.radius * 2 + 2, this.radius * 2 + 2);
    },

    drawExplosion: function(height) {
      this.ctx.fillStyle = this.color;
      this.ctx.beginPath();
      this.ctx.arc(this.x, height, this.radius, 0, Math.PI*2, true);
      this.ctx.fill();
    },

    exploit: function(h) {
      this.clear();
      this.isDestroy = true;
      this.radius += 0.4;
      this.hExploit = this.hExploit || (h || this.height);
      this.y = this.hExploit;
      this.height = 0;

      this.drawExplosion(this.hExploit);
      this.radius >= this.radiusMax && this.remove();

      return this;
    },

    update: function() {
      this.clear();

      if (!this.isDestroy) {
        this.height += this.speed;
        this.height >  MAXHEIGHT && this.exploit().onExploit();
        this.drawLine();
        return;
      }

      this.exploit();
    },

    remove: function() {
      this.clear();
      this.clearExplosion(this.hExploit);
      this.manager && this.manager.remove(this);
    }
  }
);