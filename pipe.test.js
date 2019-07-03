const {
  Pipe,
  PlaceHolderForPipe: _
} = require('./pipe.js')

test('Pipe(1) == 1', () => {
  let p = Pipe(1);
  expect(p == 1).toBe(true)
})
test('Pipe(obj).valueOf() == obj', () => {
  let a = { a: 1 };
  expect(Pipe(a).valueOf() == a).toBe(true);
})

test("Pipe() throw error", () => {
  try {
    Pipe();
    expect("Not run here").toBe("but it is.");
  } catch (err) {
    expect(err).not.toBe(null);
  }
})

test('Pipe(v).pipe(f)', () => {
  let fn = jest.fn();
  let z = Pipe(1).pipe(fn);
  expect(fn).toBeCalledWith(1);
  expect(z).toHaveProperty('pipe');
})
test('Pipe(a,b).pipe((a,b,c)=>a+b+c,"c")', () => {
  let fn = jest.fn((a, b, c) => a + b + c);
  let z = Pipe('a', 'b').pipe(fn, 'c');
  expect(fn).toBeCalledWith('a', 'b', 'c');
  expect(z.valueOf()).toBe('abc');
})
test(`Pipe(a,c).pipe((a,b,c)=>a+b+c,_,'b',_)`, () => {
  let fn = jest.fn((a, b, c) => a + b + c);
  let ret = Pipe('a', 'c').pipe(fn, _, 'b', _);
  expect(fn).toBeCalledWith('a', 'b', 'c');
  expect(ret == 'abc').toBe(true);
})
test(`Pipe(a).pipe( (a,b)=>a+b) throw error`, () => {
  try {
    let a = 1;
    Pipe(a).pipe((a, b) => a + b);
    expect("Not run here").toBe("but it is.");
  } catch (err) {
    console.log(err.message)
    expect(err).not.toBe(null);
  }
})
test('Pipe(a).pipe(a=>a+1).pipe( (b,c)=>b+c, c) == a+1+c', () => {
  let a = 1;
  let ret = Pipe(a).pipe(a => a + 1).pipe((b, c) => b + c, 'c');
  expect(ret == a + 1 + 'c').toBe(true);
})

test(`Pipe(a).pipe(a=>a+1).pipe( (b,c)=>b+c) throw error`, () => {
  try {
    let a = 1;
    Pipe(a).pipe(a => a + 1).pipe((b, c) => b + c)
    expect("Not run here").toBe("but it is.");
  } catch (err) {
    console.log(err.message)
    expect(err).not.toBe(null);
  }
})

