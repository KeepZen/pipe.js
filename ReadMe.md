[中文](./ReadMe_cn.md)
# Why write this?
How you functional programing in JS?

Let's look some example use Rambda.js

```js
 const R = require(`rabmda`);
 const f1 = (a) => a ;
 const f2 = (a,b) => a + b;
 const f = R.pipe( f1,f2.bind(null,2) )(1); //f is 3
```

If functions are all required just one argument, that is fine. but if there
are some functions required more than one arguments, `pipe` or `compose` are
not nice any more in many  JS functional programing frames.

I think we can do better.

Use pipe.js, the same functional can write like this:

```js
const pipe = require('@keepzen/pipe.js');
const f1 = (a)=>a;
const f2 =(_,b)=>_+b;
const f = pipe(f1).pipe(f2,2)(1);
```
Look at the last line, there is no `bind` or some thing like that.

In the 3rd line `_` is just a normal variable, nothing special, I just use it
to tip you --- the reader ---  this argument is from the value of the `f1`.

When functional programing in JS, I want to write more cleaner code and more
easier to write the code, so I write this one.

# Install
 + npm:
   `npm install @keepzen/pipe.js`
 + yarn:
   `yarn add @keepzen/pipe.js`  

## Usage
```js
const pipe = require('@keepzen/pipe.js');
```   
# Document

## Pipe values to functions

Use pipe.js you can pipe values to functions, like that:

```js
const pipe = require('@keepzen/pipe.js');

pipe(1).pipe(console.log);//print to 1
pipe(1).pipe( (a,b,c)=>a+b+c,2,3 ).pipe(console.log)//print 6
pipe(1,2).pipe(console.log) //print 1,2
pipe(1,2,3).pipe( (a,b,c)=>a+b+c) //return 6 and the arguments a=1, b =2, c 3
```

Pass values to `pipe(v,v1,v2)`, you get the object `pipeable`,
it have a `.pipe()` method.

The **value of** `pipeable` are what passed to `pipe()`.
If there are more than one value, `pipeable` is a array else `pipeable`
**value of** is what the value passed to
`pipe()`. In another words, it is meaning that:
`pipe(v) == v` is `true`, but `pipe(v) === v` and
`Object.is(pipe(v),v)` are `false`.

## Pipe a function to other functions
Pass a function to `pipe`, like pass values to it, you get a **OBJECT**,
which can pipe to other functions.

If the length of `fn` is n (n &ge; 0), and equal or more than n another
arguments passed to `pipe()` same time as `fn`, for example when n is 0, the
**valueOf** `pipe(fn, a,b,c)` is `fn(a,b,c)`.

If length of `fn` is n (n&ge;1), but the numbers of rest arguments passed to
`pipe()` is less than n, for example when length of `fn` is 3, `pipe(fn,a)`
will return a function required 2 (2=3-1) arguments.

```js
const f1 =()=>1
const f2 =(a,b)=>a+b
pipe(f1) ;// return 1
pipe(1).pipe(console.log);//print 1
pipe(1,2).pipe(f2) // return 3
pipe(f2).pipe(f2,3)(1,2);// return 6
```
## Syntactic sugar

Somebody have proposal add new operator
[`|>`](https://yanis.blog/the-pipeline-operator-in-javascript/) to JS.
I think `|>` can be work as a  syntactic sugar of `pipe()`:

```js
function f1(a){console.log(a)}
1 |> f() // change to: pipe(1).pipe(f)
function f2(a,b){return a+b}
1 |> f2(2) // change to: pipe(1).pipe(f2,2)
```
This work is doing, but I find I am not good at this one.

I will very happy if somebody can do it or provide some help/tips about
how to it. You can contact me with Email:

**Keep.In.Zen_at_pm.me**

Please replace `_at_` with `@`. 
