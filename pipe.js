const constValue=(v)=>()=>v;
const length = Symbol();
const spreadReturn = Symbol();
function makePipeObj(v){
  const f1 = constValue(v);
  f1[length] = 0;
  if( !(v instanceof Object) ){
    const ret = Object.create(null);
    ret.valueOf=()=>v;
    ret.toString=()=>v.toString? v: v.toString();
    ret.pipe=pipe.bind(ret,f1);
    return ret;
  }else{
    let v1 = {
      pipe:pipe.bind(v,f1),
    };
    if(v instanceof Array ){
      f1[spreadReturn] = true;
    }
    return v1;
  }
}

function pipe(f1,f2,...restArgs ){

  if(f1[length] === 0){
    let ret = f1();
    if( f1[spreadReturn] === true){
      ret = [...ret,...restArgs];
    }else{
      ret = [ret, ...restArgs];
    }

    const lF2 = f2.length;
    if(lF2 > ret.length ){
      const messageTail = (lF2 == 1) ? 'argument.' :
      `${lF2-ret.length} arguments.`;
      throw Error(`${f2.name} require last ${messageTail}`);
    }
    return makePipeObj(f2(...ret) );
  }else{
    //We need dealy to call f1
    const pipeFn = (...args)=>{
      const lF2 = f2.length-1;
      if(lF2 > restArgs.length ){
        const messageTail = (lF2 == 0) ? 'argument.' :
        `${lF2-restArgs.length} arguments.`;
        throw Error(`${f2.name} require last ${messageTail}`);
      }
      return f2(f1(...args), ...restArgs);
    };
    pipeFn[length] = f1[length];
    pipeFn.pipe= pipe.bind(this,pipeFn);
    return pipeFn;
  }
}

function candy(sugarCode){
  let lines = sugarCode.split("\n");
  const reqPa = /=\s*require\(\s*(['`"])@keepzen\/pipe\.js\1\s*\)/;
  let name;
  return lines.map(line=>{
    // console.log(`line:${line}:${reqPa.test(line)}`);
    if(reqPa.test(line) ){
      let z=line.split(reqPa)[0].split(/\s/);
      // console.log(z);
      z.pop();
      name = z.pop();
    }
    if(line.includes('|>')){
      return line.split('|>').map( a => `${name}(${a.trim()})`).join("\n.")
    }else{
      return line;
    }
  }).join("\n");
}

function pipeable (fn, ...restArgs) {
  if(fn === undefined ){
    throw Error('first argument can not be undefined.');
  }
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

if(require.main == module){
  let argv = process.argv;
  const fs = require('fs');
  console.log(argv);
  let sugarCode = fs.readFileSync(argv[2]).toString();
  console.log(candy(sugarCode));
}else{
  pipeable.candy = candy;
  module.exports = pipeable;
}
