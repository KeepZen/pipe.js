const pipe = require('../pipe.js');

test(
  'pipe_value',
  ()=>{
    let z  = pipe(1);
    expect(  z == 1).toBe(true);
    const fn = jest.fn(a=>console.log(a));
    z.pipe(fn);
    expect(fn.mock.calls[0][0]).toBe(1);

    z = z.pipe((_,b,c)=>_+b+c, 2,3 ).pipe( a=>a)
    expect(z == 6).toBe(true);

    expect( pipe( ()=> 1) == 1).toBe(true);
    pipe( ()=> 2).pipe(fn);
    expect(fn.mock.calls[1][0]).toBe(2);

    const f1 = (a) => a;
    const f2 = (_,b) => _ + b;
    const f = pipe(f1).pipe(f2,2)(1)
    expect( f == 3 ).toBe(true)

    pipe((a)=>a,1).pipe( (_,b)=>_+b,2 ).pipe(fn);
    expect(fn.mock.calls[2][0]).toBe(1+2);

    pipe( (a)=>a ).pipe(b=>b).pipe((_,c,d)=>_+c+d,2,3).pipe(fn)(1);
    expect(fn.mock.calls[3][0]).toBe(6)
  }
)
