function hasValue(v) {
  return v !== null && v !== undefined;
}

function apply(o, config, defaults) {
  /** 
   * Inicializamos el objeto
   */
  o = o || {};

  /** 
   * Asignamos los atributos de configuracion al objeto
   */
  var item;
  for (var name in config) {
    item    = config[name];
    o[name] = hasValue(item) ? item : null;
  }

  for (var name in defaults) {
    item = defaults[name];
    if (!o[name] && item) { o[name] = item; }
  }
}