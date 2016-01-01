"use strict";

var crypto = require('crypto');
var setFunctionName = require('function-name');
var setPrototypeOf = require('setprototypeof');

module.exports = exports = createFunctionInstance;
var invoke = exports.invoke = require('./invoke');

function createFunctionInstance (name, length, constructor, args) {
  var rtn, fn;

  // create function instance
  fn = functionNameArity(name, length, function () {
    "use strict";
    var invokeFn = fn[invoke];
    if (typeof invokeFn !== 'function')
      throw new Error('you must define the `[function-class/invoke]` function on this instance');
    var thisArg = typeof this === 'undefined' ? fn : this;
    return invokeFn.apply(thisArg, arguments);
  });

  if (constructor) {
    // set up inheritance
    setPrototypeOf(fn, constructor.prototype);

    // invoke constructor on new function instance with args
    rtn = constructor.apply(fn, args);
  }

  // if constructor returned something other than the instance, return
  // that, otherwise return the newly created function instance
  return typeof rtn === 'undefined' ? fn : rtn;
}

function randomIdentifier (length) {
  var id;
  do {
    id = crypto.randomBytes(length / 2).toString('hex');
  } while (/\d/.test(id[0]));
  return id;
}

function functionNameArity (name, arity, fn) {
  var tempName, args;

  if (name) {
    tempName = randomIdentifier(20);
  } else {
    tempName = '';
  }

  if (typeof arity === 'number') {
    args = [];
    while (arity--) args.push(randomIdentifier(10));
    args = args.join(', ');
  } else {
    args = '';
  }

  var proxy = new Function('fn',
    'return function ' + tempName + '(' + args + '){\n' +
    '"use strict";\n' +
    'return fn.apply(this,arguments);\n' +
    '}')(fn);

  if (name) setFunctionName(proxy, name);

  return proxy;
}
