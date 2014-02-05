MisilManager = Singleton(
  {
    items: {},

    add: function(item) {
      if (this.items[item.id]) {
        return;
      }
      this.items[item.id] = item;
      item.manager = this;
    },

    remove: function(item) {
      delete this.items[item.id];
    },

    update: function() {
      for (var name in this.items) {
        this.items[name].update && this.items[name].update();
      }
    }
  }
);