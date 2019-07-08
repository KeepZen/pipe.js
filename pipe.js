const PlaceHolderForPipe = Symbol('place Holder for pipe');
const Undefined = Symbol();
const valuesPipeTo = (v, ...others) => (f, ...args) => {
  let countPlaceHolder = 0;
  let fArgs = args.map(arg => {
    let ret = arg;
    if (arg == PlaceHolderForPipe) {
      ret = (countPlaceHolder == 0) ? v : others[countPlaceHolder - 1];
      ++countPlaceHolder;
    }
    return ret;
  })
  if (countPlaceHolder == 0) {
    fArgs = [v, ...others, ...args];
  } else if (countPlaceHolder < others.length + 1) {
    for (let i = countPlaceHolder - 1; i < others.length; ++i) {
      fArgs.push(others[i]);
    }
  }

  if (f.length <= fArgs.length) {
    return Pipe(f(...fArgs) || Undefined);
  } else {
    throw SyntaxError(`Expect at lest ${f.length - args.length - countPlaceHolder} values piped but get ${1 + others.length}`);
  }
}

function Pipe(v = PlaceHolderForPipe, ...others) {
  if (v != PlaceHolderForPipe) {
    if (v == Undefined) {
      v = undefined;
    }
    const value = others.length == 0 ? v : [v, ...others];
    const pipe = valuesPipeTo(v, ...others);
    const map = pipe;
    return {
      valueOf: () => value,
      pipe,
      map,
    }
  } else {
    throw SyntaxError(`At least you shold pipe one value, but you pipe none.`)
  }
}
Pipe.of = Pipe;

module.exports = {
  Pipe,
  PlaceHolderForPipe
}
