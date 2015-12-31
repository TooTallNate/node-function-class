var crypto = require('crypto');
var setFunctionName = require('function-name');
var setPrototypeOf = require('setprototypeof');

module.exports = exports = createFunctionInstance;
var invoke = exports.invoke = require('./invoke');

function createFunctionInstance (name, length, constructor, args) {
  var rtn, fn;

  // create function instance
  fn = functionNameArity(name, length, function () {
    return fn[invoke].apply(fn, arguments);
  });

  if (constructor) {
    // set up inheritance
    setPrototypeOf(fn, constructor.prototype);

    // invoke constructor on new function instance with args
    rtn = constructor.apply(fn, args);
  }

  // if constructor returned something other than the instance, return
  // that, otherwise return the newly created function instance
  if (typeof rtn !== 'undefined') {
    return rtn;
  } else {
    return fn;
  }
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
    while (arity--) args.push('_');
    args = args.join(',');
  } else {
    args = '';
  }

  var proxy = new Function('fn',
    'return function ' + tempName + '(' + args + '){' +
      'return fn.apply(this,arguments)' +
    '}')(fn);

  if (name) setFunctionName(proxy, name);

  return proxy;
}
