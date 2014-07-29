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
  
  }

});

var myChild = SomeChild.create({});
console.log(myChild); 
/*
  SomeChild
    myChildMethod: f...
    __proto__ - MyBase
      myChildMethod: f...
*/
console.log(myChild instanceof SomeChild); // => true
console.log(myChild instanceof MyBase); // => true
```

As you can see on the log result you will get a natural NAMED inheritance. checking instanceof will also give the correct result.

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

var myBaseOne = MyBase.create({});
var myBaseTwo = MyBase.create({});
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

The two lists are now not inherited, but created for each instance.
