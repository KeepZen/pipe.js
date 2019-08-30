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
  expect(z).toHaveProperty('pipe');
  expect(z + "" === "undefined").toBe(true);
  expect(fn).toBeCalledWith(1);
})
test('Pipe(a).pipe((a,b,c)=>a+b+c,"b","c")', () => {
  let fn = jest.fn((a, b, c) => a + b + c);
  let z = Pipe('a').pipe(fn, 'b', 'c');
  expect(fn).not.toHaveBeenCalled();
  expect(z == 'abc').toBe(true);
  expect(fn).toBeCalledWith('a', 'b', 'c');
})

test('Pipe(a).pipe(a=>a+1).pipe( (b,c)=>b+c, c) == a+1+c', () => {
  let a = 1;
  let fn1 = jest.fn(a => a + 1);
  let fn2 = jest.fn((b, c) => b + c);
  let ret = Pipe(a).pipe(fn1);
  expect(fn1).not.toBeCalled();
  expect(ret == a + 1).toBe(true);
  expect(fn1).toBeCalledTimes(1);
  ret = ret.pipe(fn2, 'c');
  expect(ret == '2c').toBe(true);
  expect(fn1).toBeCalledTimes(2);
  expect(fn2).toBeCalledTimes(1);
})

test(`Pipe(a).pipe(a=>a+1).pipe( (b,c)=>b+c)`, () => {
  let a = 1;
  let fn = jest.fn((b, c) => b + c)
  let ret = Pipe(a).pipe(a => a + 1).pipe(fn);
  expect(ret.valueOf()).toBe(NaN);
  expect(fn).toBeCalledWith(2);
})

test("Pipe(a).pipe((a,b,c)=>a+b+c,a,_,c)", () => {
  let z = Pipe.of(2).pipe((a, b, c) => a + b + c, 'a', _, "c");
  expect(z == 'a2c').toBe(true);
})

test('Pipe.of(promise).pipe(fun)', () => {
  let a = Pipe.of(Promise.resolve(1));
  expect(a.valueOf()).toBeInstanceOf(Promise);
  let fn = jest.fn();
  let ret = a.pipe(fn).valueOf();
  expect(ret).toBeInstanceOf(Promise);
  ret.then(() => {
    expect(fn).toBeCalledWith([1]);
  });
})
