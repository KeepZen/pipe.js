# Why I write this?
How you use JS to functional programing?

Let's look some example use Rambda.js

```js
 const f1 = (a) => a ;
 const f2 = (a,b) => a + b;
 const f = R.pipe( f1,f2.bind(null,2) )(1); //f is 3
```

If functions are all function require one argument, that is fine. but if there
are some functions required more than one arguments, `pipe` or `compose` are
not nice any more.

I think we can do better.

Use pipe.js, the same functional code can write like this:

```js
const f1 = (a)=>a+1;
const f2 =(_,b)=>_+b;
const f = pipeable(f1).pipe(f2,2)(1);
```
Look at the last line, there is no `bind` or some thing like that.

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
# API

## Pipe values to functions

Use pipe.js you can pipe value to functions, like that:

```js
const pipe = require('@keepzen/pipe.js');

pipe(1).pipe(console.log);//print to 1
pipe(1).pipe( (a,b,c)=>a+b+c,2,3 ).pipe(console.log)//print 6
```

## Pipe a function to other functions
Pass a function to `pipe`, like pass a value to it, you get a object,
which can pipe to other functions.

If the function `fn` pass to the first `pipe`, and it's length is zero,
the value of the `pipe()` is the value of `fn()`.

If the length of `fn` is less than x, and equal or more than x arguments pass
to `pipe` same time as `fn`, like `pipe(fn, a,b,c)`, the value of the returned
is same value of `fn(a,b,c)`;

If length of `fn` is n(n>1), but there is less than n arguments pass to `fn` at
same time with `fn`, like `pipe(fn,a)` will return a function required n-1
arguments.

```js
const f1 =()=>1
const f2 =(a,b)=>a+b
pipe(f1) ;// return 1
pipe(1).pipe(console.log);//print 1
pipe(f2).pipe(f2,3)(1,2);// return 6
```
