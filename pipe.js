const constValue=(v)=>()=>v;
const length = Symbol();
function makePipeObj(v){
  const f1 = constValue(v);
  f1[length] = 0;
  if( !(v instanceof Object) ){
    const ret = {
      valueOf:()=>v
    };
    ret.pipe=pipe.bind(ret,f1);
    return ret;
  }else{
    v.pipe=pipe(v,f1);
    return v;
  }
}

function pipe(f1,f2,...restArgs ){
  const lF2 = f2.length-1;
  if(lF2 > restArgs.length ){
    const messageTail = (lF2 == 0) ? 'argument.': ` ${lF2} arguments.`;
    throw Error(`${f2.name} require last ${messageTail}`);
  }
  if(f1[length] == 0){
    return makePipeObj(f2(f1(),...restArgs) );
  }else{
    //We need dealy to call f1
    const pipeFn = (...args)=>{
      return f2(f1(...args), ...restArgs);
    };
    pipeFn[length] = f1[length];
    pipeFn.pipe= pipe.bind(this,pipeFn);
    return pipeFn;
  }
}

function pipeable (fn, ...restArgs) {
  if(typeof fn != 'function'){
    if(restArgs.length == 0){
      return makePipeObj(fn);
    }else{
      return makePipeObj([fn,...restArgs]);
    }
  }
  if(fn.length <= restArgs ) {
    // we have enouth argument to call fn
    return makePipeObj( fn(...restArgs) );
  }else{
    const pipeFn = (...args)=>{
      return fn(...args,...restArgs);
    }
    pipeFn[length] = fn.length-restArgs;
    pipeFn.pipe = pipe.bind(pipeFn,pipeFn);
    return pipeFn;
  }
}
module.exports = pipeable;
