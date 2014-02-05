function Class() {
  var C = function() { this.initialize && this.initialize.apply(this, arguments); },
      I = arguments[0],
      F = arguments[arguments.length-1];

  arguments.length >= 2 && inherit(C, I);
  extend(C, F);

  return C;
}

function inherit(C, I) {
  var clone = function() {};
  clone.prototype = I.prototype;
  C.prototype = new clone;
}

function extend(C, F) {
  for (var name in F) {
    var value = F[name];
    if (value !== undefined) {
      C.prototype[name] = value;
    }
  }
}