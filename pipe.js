const _ = Symbol();

function pipe(valueOrValuOfFunc) {
  const valueOf = typeof valueOrValuOfFunc == 'function' ? valueOrValuOfFunc : () => valueOrValuOfFunc;
  const pipe = _pipe(valueOf, false);
  const promise_rescue = _pipe(valueOf, true);
  const inspect = _inspect(valueOf);
  return {
    valueOf,
    pipe,
    map: pipe,
    inspect,
    promise_rescue,
  }
}
const _inspect = (valueOf) => (fun, ...args) => {
  const newValueOf = () => {
    let v = valueOf();
    _normal(v, args, fun);
    return v;
  }
  return pipe(newValueOf);
}
const _pipe = (valueOf, isRescue) => (fun, ...other) => {
  const newValueOf = () => {
    const v = valueOf();
    if (v instanceof Promise) {
      return _promise(v, other, fun, isRescue);
    } else {
      return _normal(v, other, fun);
    }
  }
  return pipe(newValueOf)
}

const _promise = async (v, other, fun, rescue) => {
  let reason = null;
  try {
    v = await v;
  } catch (err) {
    reason = err;
  } finally {
    const needPipeFun = !rescue && reason == null;
    const needPipeRescue = rescue && reason != null;
    //When (!needPipeFun && !needPipeRescue)
    const canSkip = !(needPipeFun || needPipeRescue)
    if (canSkip) {
      return v;
    }
    if (needPipeFun) {
      return _normal(v, other, fun);
    }
    if (needPipeRescue) {
      return _normal(reason, other, fun)
    }
  }
}
const _normal = (v, other, fun, ) => {
  const index = other.findIndex(value => value == _);
  const fondIndex = index >= 0;
  if (fondIndex) {
    other[index] = v;
  } else {
    other.unshift(v);
  }
  return fun(...other);
}

module.exports = {
  pipe,
  from: pipe,
  Pipe: pipe,
  _
}
