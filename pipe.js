function pipe(f1,f2,...restArgs ){
  const n = restArgs.length +1 ;
  if( n < f2.length){
    let m = f2.length-1;
    let tail = (m == 0) ? 'argument' : m + " arguments";
    throw Error(`${f2.name} require the last ${tail}.`);
  }
  const piped = (...args)=>{
    return f2(f1(...args),...restArgs);
  }
  piped.pipe=pipe.bind(this,piped);
  return piped;
}

function pipeable (fn, ...restArgs) {
  if(typeof fn !== 'function') {
    throw Error(`fn should be a function`);
  }
  const pipeableFn = (...args)=> {
    const n = args.length + restArgs.length;
    if( n < fn.length){
      throw Error(`${fn.name} require ${fn.length} NOT get ${n} arguments!`);
    }
    return fn(...args, ...restArgs);
  }
  pipeableFn.pipe = pipe.bind(this,pipeableFn);
  return pipeableFn;
}
module.exports = pipeable;
