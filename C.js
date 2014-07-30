(function (window) {
  function C () {
    if (this instanceof C) { // return if called with NEW
      return;
    }
    return C.extend.apply(C, arguments); // If C is called directly, run extend. It is a conveniance
  }
  
  C.prototype = {
    constructor: C
  }
  
  C.extend = function (constr) {
    
    // If two arguments, name the constructor
    if (arguments.length === 2) {
      constr = new Function(arguments[1].toString().replace('function', 'return function ' + arguments[0] + ' '))();
      
    }
    constr.parentConstr = this;
    constr.prototype = new this({}, function () {});
    constr.extend = this.extend;
    constr.create = this.create;
    constr.parent = function (obj, options) {
      return function () {
        var parent = constr.parentConstr;
        while (parent) {
          parent.call(obj, options, parent.parentConstr ? parent.parent(obj, options) : null);
          if (parent !== C && obj.init) { // Call init up the chain, except on top
            obj.init();
          }
          parent = parent.parentConstr;
        }

      }
    }
    return constr;
  }
  
  C.create = function (options) {
    options = options || {};
    var obj = Object.create(this.prototype);
    this.call(obj, options, this.parent(obj, options));
    obj.constructor = this;
    if (obj.init) {
      obj.init();
    }
    return obj;
  };

  window.C = C;
}(window));