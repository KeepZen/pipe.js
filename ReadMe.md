<a href="#cn" id="en">阅读中文</a>
# What is New?

+ 2018-12-12  
  we can use `|>` as syntactic sugar of `@keepzen/pipe.js`.

  See more [Sytatic Sugar](#sugar) section.

# Why Write This?
How do you write functional programing code with JS?

Let's look a example use Rambda.js

```js
 const R = require(`rabmda`);
 const f1 = (a) => a ;
 const f2 = (a,b) => a + b;
 const f = R.pipe( f1,f2.bind(null,2) )(1); //f is 3
```

If length of functions are all 1, that is fine. But if there
are some functions require more than one arguments, `pipe` and/or `compose`
are not nice any more in many JS functional programing frameworks/libs.

I think it can be done better.

Use @keepzen/pipe.js, the same functional code can write like this:

```js
const pipe = require('@keepzen/pipe.js');
const f1 = (a)=>a;
const f2 =(_,b)=>_+b;
const f = pipe(f1).pipe(f2,2)(1);
```
Look at the last line, there is no `bind` or some thing like that.

In the 3rd line `_` is just a normal variable, nothing special, I use it just
to tip you this argument is from the value of the `pipe(f1)`.

When functional program with JS, I want to **write more cleaner code** and **more
easier to write the code**, so I write this one.

# Document

## Pipe Values to Functions

Use @keepzen/pipe.js you can pipe values to functions, like this:

```js
const pipe = require('@keepzen/pipe.js');

pipe(1).pipe(console.log);//print to 1
pipe(1).pipe( (a,b,c)=>a+b+c,2,3 ).pipe(console.log)//print 6
pipe(1,2).pipe(console.log) //print 1,2
pipe(1,2,3).pipe( (a,b,c)=>a+b+c) //return 6 and the arguments a=1, b =2, c=3
```

Pass values to `pipe(v,v1,v2)`, you get a object `pipeable`,
it have a `.pipe()` method.

The **value of** `pipeable` is what was passed to `pipe()`.
If there are more than one values, `pipeable` is a array else the
**value of** `pipeable` object is the value passed to
`pipe()`. In my meaning, "value of pipeable" is different of the "pipeable",
Let's show it clearly with code:

```js
// when v js value expect function or undefined
pipe(v) == v // the result of this express is true
pipe(v) === v // this one is false
Object.is(pipe(v),v) // this also false
```

## Pipe a Function to Other Functions

Pass a function to `pipe()`, like pass values to it, you get a **OBJECT**,
which can pipe to other functions.

If the length of `fn` is n (n &ge; 0), and not less than n another
arguments are passed to `pipe()` at same time as `fn`, for example when n is 0,
the **value of** `pipe(fn, a,b,c)` is `fn(a,b,c)`.

If length of `fn` is n (n&ge;1), but the numbers of rest arguments passed to
`pipe()` is less than n, for example when length of `fn` is 3, `pipe(fn,a)`
will return a **function**, which required 2 (2=3-1) arguments.

```js
const f1 =()=>1
const f2 =(a,b)=>a+b
pipe(f1) ;// return 1
pipe(f1).pipe(console.log);//print out:1
const f3 = pipe(f2) // this return a function, which require (2-0) arguments
const f4= pipe(f2,1)// return a function, which require (2-1) argument
f3(1,2)// return 3
f3.pipe(console.log)('a','b')//print out: ab
f4(2)// return 3
const f5 = pipe(f2).pipe(f2,1) // a function, require (2-0) argument
f5(1,2)//return (1+2)+1
```

## Syntactic Sugar <a id="sugar"></a>

[There is a proposal to add new operator `|>` to JS.](https://yanis.blog/the-pipeline-operator-in-javascript/)

I think `|>` can be work as a  syntactic sugar of `@keepzen/pipe.js`:

Use this syntactic sugar, first we need install this package.

Suppose we have a file named `test.pjs`, it content as:

```js
function f1(a){console.log(a)}
1 |> f()
function f2(a,b){return a+b}
1 |> f2(2)
```

After run fellow command:

```sh
npx keepzenPipe test.pjs > test.js
```
We get a new file `test.js`, it comment will like that:

```js
const pipe= require("@keepzen/pipe.js");
function f1(a){console.log(a)}
pipe(1)
  .pipe(f)
function f2(a,b){return a+b}
pipe(1)
  .pipe(f2,2)
```

`|>` is need two operated, the first one is a JS express, and the second one is
a function call.

Now it work. But now the function must define in some other place, not
fellow the pipe operator `|>`. The fellow code is fine code, but now, `candy`
can not handle it.

```js
1 |> ((a,b)=>a+b)(2)
```
If you can give me some tips to handle some thing like that one,
please contact me with fellow mail:

**Keep.In.Zen_at_pm.me** .

Please replace `_at_` with `@`.
</div>

---

<a href="#en" id="cn">Reading English</a>
# 更新
+ 2018-12-12  
  现在可以使用 `|>` 来做为 `@keepzen/pipe.js` 的语法糖了.

  更多细节查看[语法糖](#sugar_cn) 小结.

# 为什么要写这个库?
在学习 JS 函数编程的过程中, 思维被迫的以数学函数组合的方式来运行,
比如各种库中提供的 `compose()`, 完全的模仿的是数学上的函数组合过程.
`compose(f1,f2,f3)()`, 执行的顺序是 f3, f2, f1, 这太不符合我的思维习惯了.
我想, 这应该也是不符合大部分程序员的思维习惯的, 不然的话, 函数编程库就不需要特意提供
`pipe()` 这个除了函数的执行从左向右外, 其他功能完全一样的函数了.

函数式编程据说是可以提高代码的可读性和可维护性的. 但是在 JS 中, 不要说读别人写的 FP
代码了, 就是自己写的, 隔天之后, 可能就不知道代码是什么意思了.
因为 JS 本身不是一个函数式编程语言, 要写函数式编程的代码, 即使有函数式编程库的帮助,
挑战还是非常大的.

举个例子来说, 用 Rambda.js 这个函数式编程库:

```js
 const R = require('rambda');
 const f1 = (a) => a ;
 const f2 = (a,b) => a + b;
 const f = R.pipe( f1,f2.bind(null,2) )(1); //f is 3
```

`R.pipe()` 的参数全部必须是只要一个参数的函数, 否则就没法工作. 为了个缘故, Rambda.js
和其他库一样, 为我们提供了大量的对函数做部化的工具.
这些工具函数在一定程度上固然解决了问题,
但是工具库太大了, 从中找出需要的工具已经变得有些困难了.

为了让 `compose()` 更好的工作,  函数式编程库几乎把 JS 中操作符又全部的实现了一边,
例如 Rambda.js 中, 你就能看到大量的诸如 `add()` (对应 `+`), `lt()` (对应 `<`)
的函数.

我认为, 应该有更好的解决方案.

使用 `@keepzen/pipe.js`, 上面相同功能的代码可以这样写:

```js
const pipe = require('@keepzen/pipe.js');
const f1 = (a) => a;
const f2 = (_,b) => _ + b;
const f = pipe(f1).pipe(f2,2)(1);
```

注意最后一行, 这里没有任何的 `bind` 以及类似的对函数做部化的操作的东西,
我们再也不用为如何部化函数而绞尽脑汁了.

在第三行的 `_` 只是一个最普通的参数, 没有任何其他的假设, 只是为了表示,
在调用的时候, 这个参数的值是从上一个函数 `f1` 的返回值中得到的.

在 JS 中函数式编程, **写出更清晰的代码, 更轻松的写代码**, 这就是我写这个库的目标.

# 文档

## 把值放入管道
使用 `@keepzen/pipe.js`, 可以如下所示把值放入管道中:

```js
const pipe = require('@keepzen/pipe.js');

pipe(1).pipe(console.log);//print to 1
pipe(1).pipe( (a,b,c)=>a+b+c,2,3 ).pipe(console.log)//print 6
pipe(1,2).pipe(console.log) //print 1,2
pipe(1,2,3).pipe( (a,b,c)=>a+b+c) //return 6 and the arguments a=1, b =2, c=3
```

把值放入到管道中, `pipe(v,v1,v2)` 得到的是 `pipeable` 对象, 这个对象有一个
 `.pipe(fn,...args)` 方法.

`pipeable` 对象的值 (valueOf) 就是传递给 `pipe()` 的所有参数. 如果传递给 `pipe()`
的参数不止一个, 返回值是一个数组, 只有一个值的话, 返回的 `pipable` 对象的 `.valueOf()`
的返回值是这个参数. 这也就是说:
`pipe(a) == a` 是 `true`, 但是 `pipe(a) === a` 和 `Object.is(pipe(a),a)` 都是
`false`, 其中 a 是非函数类型, 或 undefined 外的任意其他的 JS 值.

## 把函数放入管道

把一个函数传递给 `pipe()`, 和把一个值传递给 `pipe` 类似, 得到的返回值是一个 **对象**,
这个对象的值可以通过管道传递给其他的函数.

如果函数 `fn` 的长度(要求的实参个数)为 n (n &ge; 0), 且有不少于 n 的其他的参数, 与
`fn` 一起传递给 `pipe()`, 例如当 n 为 0 的时候, `pipe(fn, a,b,c)` 的返回值与
`fn(a,b,c)` 的返回值相等.

如果函数 `fn` 的长度是 n (n&ge;1), 且不多与 n 个的其他的参数和 `fn` 一起传递给
`pipe()`, 例如当 `fn` 的长度为 3 的时候, `pipe(fn,a)`, 将会返回一个要求 2(2=3-1)
个参数的 **函数**.

```js
const f1 =()=>1
const f2 =(a,b)=>a+b
pipe(f1) ;// 返回一个对象, 这个对象的 `.valueOf()` 返回值是 1
pipe(f1).pipe(console.log);//打印出:1
const f3 = pipe(f2) // 返回函数,要求 (2-0) 个参数
const f4= pipe(f2,1)// 返回一个函数, 要求 (2-1) 参数
f3(1,2)// return 3
f3.pipe(console.log)('a','b')//打印出: ab
f4(2)// return 3
const f5 = pipe(f2).pipe(f2,1) // a function, require (2-0) argument
f5(1,2)//return (1+2)+1
```

## 语法糖 <a id="sugar_cn"></a>
有人以及提议在 JS 中加入新的操作
[`|>`](https://yanis.blog/the-pipeline-operator-in-javascript/).
我认为, `|>` 操作符号, 可以作为 pipe.js 的语法糖来实现.

要使用这个语法糖, 必须首先安装这个 npm 库.

假设现在文件 `test.pjs` 中有如下的代码:

```js
function f1(a){console.log(a)}
1 |> f()
function f2(a,b){return a+b}
1 |> f2(2)
```

那么使用命令:
```shell
npx keepzenPipe test.pjs >test.js
```
将会生成如下的 test.js 文件, 其内容如下:

```js
const pipe= require("@keepzen/pipe.js");
function f1(a){console.log(a)}
pipe(1)
  .pipe(f)
function f2(a,b){return a+b}
pipe(1)
  .pipe(f2,2)
```

`|>` 是一个二元操作符, 其中第一个操作数是一个 JS 表达式, 第二个操作数是一个函数调用.

这个工作现在基本上完成了. 但是第二个操作数中的函数, 必须在其他地方定义,
而不能在操作符号 `|>` 后面直接定义. 下面的代码是合法的代码, 但是现在, `candy`
命令还不能处理.
```js
1 |> ((a,b)=>a+b)(2)
```
欢迎大家给出处理这种情况的建议, 可以通过一下邮箱和我联系:

**Keep.In.Zen_at_pm.me**

别忘记把 `_at_` 换成 `@`!
