C
=

An inheritance experiment which allows for private variables and "super" up the constructor chain

# The syntax

## Simple inheritance
```javascript
var MyBase = C(function MyBase (options) {

  this.myBaseMethod = function () {
  
  };
  
});

var SomeChild = MyBase.extend(function SomeChild (options) {

  this.myChildMethod = function () {
    return options.foo;
  }

});

var myChild = SomeChild.create({
  foo: 'bar'
});
console.log(myChild); 
/*
  SomeChild
    myChildMethod: f...
    __proto__ - MyBase
      myBaseMethod: f...
*/
console.log(myChild instanceof SomeChild); // => true
console.log(myChild instanceof MyBase); // => true
```

As you can see on the log result you will get a natural NAMED inheritance. checking instanceof will also give the correct result. Pass an object as an "argument description"

## Privates
```javascript
var MyBase = C(function MyBase (options) {

  var list = [];
  this.add = function (item) {
    list.push(item);
  };
  this.getList = function () {
    return list;
  };
  
});

var myBaseOne = MyBase.create();
var myBaseTwo = MyBase.create();
myBaseOne.addDefault();
console.log(myBaseOne.getList()); // => ['default']
console.log(myBaseTwo.getList()); // => []
```

Using private variables will keep their privacy across instanciated objects.

## Calling parent (super)
```javascript
var MyBase = C(function MyBase (options) {
  this.list = [];
});

var SomeChild = MyBase.extend(function SomeChild (options) {

  this.getList = function () {
    return this.list;
  }

});

var aChild = SomeChild.create({});
var secondChild = SomeChild.create({});
console.log(aChild.getList() === secondChild.getList()); // => true
```

As we can see, the two childs are now working off the same list. But if we call the parent function (super):

```javascript
var MyBase = C(function MyBase (options) {
  this.list = [];
});

var SomeChild = MyBase.extend(function SomeChild (options, parent) {
  
  parent();
  this.getList = function () {
    return this.list;
  }

});

var aChild = SomeChild.create({});
var secondChild = SomeChild.create({});
console.log(aChild.getList() === secondChild.getList()); // => false
```

The two lists are now **not** inherited, but created for each instance. Any **options** passed will be passed to the parent constructors, you only need to call *parent()*. 

### Summary
- Use **extend** to define and **create** to instantiate
- Put everything inside the *constructor* function and let your methods take advantage of privately defined variables
- Use **parent()** to copy inherited properties to the instance
- Debugging is easy as all your "classes" will be named and reflect their definition
- Note that constructors only take one argument, which is options. This is by design, constructors should only handle objects as values are better defined in an object than passing them directly to the constructor. If not options are passed, it will be an empty object, no need to *options = options || {}*

# Why build it?
I have been uneasy of the idea of inheritance in JavaScript, it has some issues. I was initially a fan of how Backbone handles inhertiance, though it also misses some pieces. F.ex. all complex objects defined er shared between instances, you have no private variables when defining your object etc.

Though I do love the syntax of defining an object as an object "extend({ init: function () {}}), it just will not work due to a function constructor i the only thing that can truly dupliacate itself. Trying to clone objects correctly in any scenario is just to difficult, if even possible.

