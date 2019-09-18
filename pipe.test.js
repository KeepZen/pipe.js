const {
  Pipe,
  pipe,
  from,
  _
} = require('./pipe.js')

test('make pipable', () => {
  const properties = ['valueOf', 'pipe', 'map', "promise_rescue"].sort();
  const keys = Object.keys.bind(Object);
  expect(keys(Pipe(1)).sort()).toMatchObject(properties);
  expect(keys(pipe(1)).sort()).toMatchObject(properties);
  expect(keys(from(1)).sort()).toMatchObject(properties);
  expect(keys(from(1).pipe(a => a + 1)).sort()).toMatchObject(properties);
})

test('pipe(primary) == primary', () => {
  expect(pipe(1) == 1).toBe(true)
  expect(pipe("hello") == "hello").toBe(true);
  expect(pipe(true) == true).toBe(true);
  expect(pipe(false) == false).toBe(true);
  let str = new String('Hello')
  expect(pipe(str) == str).toBe(false);
  expect(pipe(null) == null).toBe(false);
  expect(pipe(undefined) == undefined).toBe(false);
  let a = { hello: "a" };
  expect(pipe(a) == a).toBe(false);
})

test('pipe(any).valueOf() == any', () => {
  expect(pipe(1).valueOf() == 1).toBe(true)
  expect(pipe("hello").valueOf() == "hello").toBe(true);
  expect(pipe(true).valueOf() == true).toBe(true);
  expect(pipe(false).valueOf() == false).toBe(true);
  let str = new String('Hello');
  expect(pipe(str).valueOf() == str).toBe(true);
  expect(pipe(null).valueOf() == null).toBe(true);
  expect(pipe(undefined).valueOf() == undefined).toBe(true);
  let a = { hello: "a" };
  expect(pipe(a).valueOf() == a).toBe(true)
})

test('pipe with placeholder', () => {
  let fn = jest.fn((a, b, c) => a + b + c);
  let z = pipe('a').pipe(fn, 'b', 'c');
  expect(fn).not.toHaveBeenCalled();
  expect(z == 'abc').toBe(true);
  expect(fn).toBeCalledWith('a', 'b', 'c');
  z = pipe("2").pipe(fn, "1", _, "3");
  expect(z == '123').toBe(true);
  expect(fn).toBeCalledWith('1', '2', '3');
  z = pipe('e').pipe(fn, 'a', 'b', 'c', 'd', _);
  expect(z == 'abc');
  expect(fn).toHaveBeenLastCalledWith('a', 'b', 'c', 'd', 'e');
})

test('pipable is independ', () => {
  let a = 1;
  let fn1 = jest.fn(a => a + 1);
  let fn2 = jest.fn((b, c) => b + c);
  let pipable0 = pipe(a);
  let pipable1 = pipable0.pipe(fn1);
  expect(pipable1 == a + 1).toBe(true);
  expect(pipable0.valueOf()).toBe(a);
  let pipable2 = pipable1.pipe(fn2, 'c');
  expect(pipable2 == '2c').toBe(true);
  expect(pipable1.valueOf()).toBe(a + 1);
})

test(`pipable is layze`, () => {
  const fn = jest.fn(a => a + 1);
  let pipable0 = pipe(1);
  let ret = pipable0.pipe(fn).pipe(fn).pipe(fn);
  expect(fn).not.toHaveBeenCalled();
  expect(ret.valueOf()).toBe(1 + 1 + 1 + 1);
  expect(fn.mock.calls).toMatchObject([[1], [2], [3]]);
})

test('pipe promise resolve ', (done) => {
  let a = from(Promise.resolve(1));
  expect(a.valueOf()).toBeInstanceOf(Promise);
  let fn = jest.fn(a => a + 1);
  let ret = a.pipe(fn).
    promise_rescue(fn).//skip
    pipe(fn).valueOf();
  expect(ret).toBeInstanceOf(Promise);
  ret.then(() => {
    expect(fn.mock.calls).toMatchObject([[1], [2]]);
    done();
  });
})

test('pipe promise reject', (done) => {
  let a = from(Promise.reject('hello'));
  let fn1 = jest.fn(a => 'fn1');
  let fn2 = jest.fn(a => 'fn2');
  let fn3 = jest.fn(a => "fn3");
  let promise = a.pipe(fn1).//skip
    promise_rescue(fn2).//call
    pipe(fn3).valueOf();
  expect(promise).toBeInstanceOf(Promise);

  promise.then(
    (a) => {
      expect(fn1).not.toHaveBeenCalled();
      expect(fn2).toHaveBeenCalledWith('hello');
      expect(fn3).toHaveBeenCalledWith('fn2');
      expect(a).toBe('fn3');
      done();
    },
    (error) => {
      console.error(error);
      expect('not run to here').toBe('but it is here');
    }
  )
})

test('pipeable.inspect(fn)', () => {
  const fn = jest.fn(a => console.log(a));
  let a = Pipe(1).inspect(fn);
  expect(a).not.toBe(null);
  expect(fn).not.toHaveBeenCalled();
  let b = a.pipe(fn);
  expect(b.valueOf()).toBe(undefined);
  expect(fn).toHaveBeenCalledTimes(2);
})
