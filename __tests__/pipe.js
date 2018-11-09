const pipe = require('../pipe.js');

test(
  'pipe_value',
  ()=>{
    const fn = jest.fn(a=>console.log(a));
    let z  = pipe(1);
    expect(  z == 1).toBe(true);
    z.pipe(fn);
    expect(fn.mock.calls[0][0]).toBe(1);

    z = z.pipe((_,b,c)=>_+b+c, 2,3 ).pipe( a=>a)
    expect(z == 6).toBe(true);

    pipe(1,2).pipe(fn);
    // console.log(fn.mock.calls[1]);
    expect(fn.mock.calls[1]).toMatchObject([1,2]);
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
    expect(fn.mock.calls[2][0]).toBe(6)
  }
)
test(
  "candy",
  ()=>{
    const sugar =
`
const pipe = require('@keepzen/pipe.js');
function f1(n){return n}
1 |> f1
`
    const js=
`
const pipe = require('@keepzen/pipe.js');
function f1(n){return n}
pipe(1)
.pipe(f1)
`;
    expect( pipe.candy(sugar) ).toBe( js )
  }
)
