const pipe = require('../pipe.js');

test(
  'pipe_value',
  ()=>{
    expect(  pipe(1) == 1).toBe(true);

    const fn = jest.fn(a=>console.log(a));
    pipe(1).pipe(fn);
    expect(fn.mock.calls[0][0]).toBe(1);

    const f1 = jest.fn(console.log);
    pipe(1,2).pipe(f1);
    expect(f1.mock.calls[0]).toMatchObject([1,2]);

    const f2 = jest.fn( (a,b,c)=>console.log(`a:${a},b:${b}:c:${c}`) );
    pipe(1,2,3).pipe(f2)
    expect(f2.mock.calls[0]).toMatchObject([1,2,3]);

  }
)
test(
  "pipe_function",
  ()=>{

    const fn = jest.fn();
    expect( pipe( ()=> 1) == 1).toBe(true);
    pipe( ()=> 2).pipe(fn);
    expect(fn.mock.calls[0][0]).toBe(2);

    const f1 = (a) => a;
    const f2 = (_,b) => _ + b;
    const f = pipe(f1).pipe(f2,2)(1)
    expect( f == 3 ).toBe(true)

    pipe((a)=>a,1).pipe( (_,b)=>_+b,2 ).pipe(fn);
    expect(fn.mock.calls[1][0]).toBe(1+2);

    pipe( (a)=>a ).pipe(b=>b).pipe((_,c,d)=>_+c+d,2,3).pipe(fn)(1);
    expect(fn.mock.calls[2][0]+0).toBe(6)
  }
)
