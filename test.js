var assert = require('assert');
var inherits = require('util').inherits;

var createFunction = require('./');
var invoke = require('./invoke');



function Type (name, length) {
  if (typeof this !== 'function')
    return createFunction(name, length, Type, arguments);

  this.count = 0;
}
inherits(Type, Function);

Type.prototype[invoke] = function (val) {
  this.count += val;
};



var t1 = new Type('nate', 6);
assert.ok(t1 instanceof Type);
assert.ok(t1 instanceof Function);
assert.ok(t1 instanceof Object);
assert.equal(t1.name, 'nate');
assert.equal(t1.length, 6);
assert.equal(t1.count, 0);
t1(5);
assert.equal(t1.count, 5);

var t2 = new Type('foo', 6);
assert.ok(t2 instanceof Type);
assert.ok(t2 instanceof Function);
assert.ok(t2 instanceof Object);
assert.equal(t2.name, 'foo');
assert.equal(t2.length, 6);
assert.equal(t2.count, 0);
t2(-1);
assert.equal(t2.count, -1);



function Subclass (init) {
  if (typeof this !== 'function')
    return createFunction('sub', 100, Subclass, arguments);
  Type.call(this);
  this.count = init;
}
inherits(Subclass, Type);

var s1 = new Subclass(6);
assert.ok(s1 instanceof Subclass);
assert.ok(s1 instanceof Type);
assert.ok(s1 instanceof Function);
assert.ok(s1 instanceof Object);
assert.equal(s1.name, 'sub');
assert.equal(s1.length, 100);
assert.equal(s1.count, 6);
s1(-1);
assert.equal(s1.count, 5);



// one off instance
var oneOff = createFunction('oneOff', 1);
var oneOffCalled = false;
assert.ok(oneOff instanceof Function);
assert.ok(oneOff instanceof Object);
assert.equal(oneOff.name, 'oneOff');
assert.equal(oneOff.length, 1);
assert.throws(function () {
  oneOff();
});
oneOff[invoke] = function () {
  oneOffCalled = true;
  return [].slice.apply(arguments);
};
assert.ok(!oneOffCalled);
assert.deepEqual(oneOff('foo', 'bar'), [ 'foo', 'bar' ]);
assert.ok(oneOffCalled);


// unicode and otherwise invalid JS idenifiers may be used as the name
var snowman = createFunction('⌛', 30);
assert.equal(snowman.name, '⌛');
assert.equal(snowman.length, 30);


// `this` arg
var thisArg = createFunction();
thisArg[invoke] = function () {
  return this;
};
assert.equal(thisArg(), thisArg);
assert.equal(thisArg()()(), thisArg());
assert.equal(thisArg.call(global), global);
assert.equal(thisArg.call(1).valueOf(), 1);
assert.equal(thisArg.call(true).valueOf(), true);
