# Why I write this?
How you use JS to functional programing?

Let's look some example use Rambda.js

```js
 const f1 = (a) => a + 1 ;
 const f2 = (a,b) => a + b;
 const f = R.pipe( f1,f2.bind(null,2) )(1); //f is 3
```

If functions are all function require one argument, that is fine. but if there
are some functions required more than one arguments, `pipe` or `compose` are
not nice any more.

I think we can do better.

Use pipe.js, the same functional code can write like this:

```js
const f1 = (a)=>a + b;
const f2 =(_,b)=>_+b;
const f = pipeable(f1).pipe(f2,2)(1);
```
Look at the last line, there is no `bind` or some thing like that.

When functional programing in JS, I want to write more cleaner code and more
easier to write the code, so I write this one.

# How to use?
1. First install:
 + npm:
   `npm install @keepzen/pipe.js`
 + yarn:
   `yarn add @keepzen/pipe.js`  
2. use pipe.js
 ```js
 const pipeable = require('@keepzen/pipe.js');
 ```
 `pipeable` is a function, you can pass it a function and zero or more arguments
 the function need, and `pipeable` will return a new function which can pipe to
 other functions.

 The returned function call be called directly, just like the normal one. But
 it check the number of the arguments and the parameters of the function which
 passed to the `pipeable`. Like the fellow code:

 ```js
 function f1(a,b){
   return a+ b;
 }
 const f2 = pipeable(f1);
 f1() // return NAN
 f2() // throw a error say f1 required 2 arguments
 f2(1)// throw error
 f2(1,2)// return 2
 function f3(a,b){
   return a + b;
 }
 f2.pipe(f3)// throw error say f2 required the last 1 argument.
 const f = f2.pipe(f2,1)
 f()// throw error say f1 required 2 arguments
 ```
Good luck and have joy with pipe.js.
