(function (window) {
  function C () {}
  
  C.prototype = {
    constructor: C
  }
  
  C.extend = function (constr) {
    constr.parent = this;
    constr.prototype = new this({}, function () {});
    constr.extend = this.extend;
    constr.create = this.create;
    constr.purge = function (obj, options) {
      return function () {
        var parent = constr.parent;
        while (parent) {
          parent.call(obj, options, parent.purge ? parent.purge(obj, options) : null);
          parent = parent.parent;
        }

      }
    }
    return constr;
  }
  
  C.create = function (options) {
    options = options || {};
    var obj = Object.create(this.prototype);
    this.call(obj, options, this.purge(obj, options));
    obj.constructor = this;
    return obj;
  };

  window.C = C;
}(window));