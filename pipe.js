const PlaceHolderForPipe = Symbol('place Holder for pipe');
const Undefined = Symbol();
const _call = (fun, index, pipeValue, other) => {
  const fond = index != -1;
  if (fond) {
    other[index] = pipeValue;
  } else {
    other.unshift(pipeValue);
  }
  return fun(...other);
}
const _pipe = (pipeable, fun, ...other) => {
  const newPipeable = Pipe(Undefined);
  newPipeable.valueOf = () => {
    const index = other.findIndex(v => v == PlaceHolderForPipe);
    const valueOrPromise = pipeable.valueOf();
    if (valueOrPromise instanceof Promise) {
      return valueOrPromise.then(value => _call(fun, index, value, other));
    } else {
      return _call(fun, index, valueOrPromise, other);
    }
  }
  return newPipeable;
}

function Pipe(v = PlaceHolderForPipe, ...others) {
  if (arguments.length > 0) {
    if (v == Undefined) {
      v = undefined;
    }
    const valueOf = () => others.length == 0 ? v : [v, ...others];
    const ret = {}
    const pipe = _pipe.bind(null, ret);
    const map = pipe;
    const then = async (resolve, reject = () => undefined) => {
      try {
        const valueOf = ret.valueOf();
        return resolve(valueOf);
      } catch (err) {
        return reject(err);
      }
    }
    return Object.assign(
      ret,
      {
        pipe,
        map,
        valueOf,
        then,
      }
    );
  } else {
    throw SyntaxError(`At least you shold pipe one value, but you pipe none.`)
  }
}
Pipe.of = Pipe;

module.exports = {
  Pipe,
  PlaceHolderForPipe
}
