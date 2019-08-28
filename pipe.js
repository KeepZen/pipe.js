const PlaceHolderForPipe = Symbol('place Holder for pipe');
const Undefined = Symbol();

const _pipe = (pipeable, fun, ...other) => {
  const newPipeable = Pipe(Undefined);
  newPipeable.valueOf = () => {
    const index = other.findIndex(v => v == PlaceHolderForPipe);
    const fond = index != -1;
    const pipeValue = pipeable.valueOf();
    if (fond) {
      other[index] = pipeValue;
    } else {
      other.unshift(pipeValue);
    }
    return fun(...other);
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
    return Object.assign(
      ret,
      {
        pipe,
        map,
        valueOf,
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
