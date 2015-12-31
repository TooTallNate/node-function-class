var crypto = require('crypto');
var setFunctionName = require('function-name');
var setPrototypeOf = require('setprototypeof');

module.exports = exports = createFunctionInstance;
var invoke = exports.invoke = require('./invoke');

function createFunctionInstance (constructor, args, name, length) {
  var fn = functionNameArity(name, length, function () {
    return fn[invoke].apply(fn, arguments);
  });

  var rtn;
  if (constructor) {
    setPrototypeOf(fn, constructor.prototype);
    rtn = constructor.apply(fn, args);
  }

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
