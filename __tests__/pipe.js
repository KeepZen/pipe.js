const pipeable = require('../pipe.js');

test(
  'pipeable',
  ()=>{
    const fn = (a,b)=>a+b;
    const p = pipeable(fn);
    expect(typeof p.pipe).toBe('function');
    expect(p.pipe(e=>e).pipe((_,c)=>_+c, 3)(1,2)).toBe(1+2+3)
    try{
      const fn2 = (c,d)=>c+d;
      p.pipe(fn2,3)(1)
    }
    catch(e){
      console.log(e);
      expect(e).not.toBe(null);
    }
  }
)
