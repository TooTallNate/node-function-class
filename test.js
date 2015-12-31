var assert = require('assert');
var inherits = require('util').inherits;

var createFunctionInstance = require('./');
var invoke = require('./invoke');

function Type (name, length) {
  if (typeof this !== 'function')
    return createFunctionInstance(Type, arguments, name, length);

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
    return createFunctionInstance(Subclass, arguments, 'sub', 100);
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
