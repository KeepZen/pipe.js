[English](./ReadMe.md)
# 为什么要写这个库?
在学习  JS 函数编程的过程时, 思维被迫的以数学函数组合的方式来思考,
比如各种库中提供的 `compose()`, 完全的模仿的是数学上的函数组合.
`compose(f1,f2,f3)()`, 执行的顺序是 f3, f2, f1, 这太不符合我的思维习惯了.
我想, 这应该也是不符合大部分程序员的思维习惯的, 不然为函数编程库,
就不需要特意提供 `pipe()` 这个除了函数的执行从左向右外, 其他功能完全一样的函数了.

函数式编程据说是可以提高代码的可读性和可维护性的. 但是在 JS 中, 不要说读别人写的 FP
代码了, 就是自己写的, 隔天之后, 可能就不知道代码是什么意思了.
因为 JS 本身不是一个函数式编程语言, 要写函数式编程的代码, 即使有函数式编程库的帮助,
挑战还是非常大的. 在写函数式的 JS 代码的时候, 心智的负担非常的重.

举个例子来说, 用 Rambda.js 这个函数式编程库:

```js
 const R = require('rambda');
 const f1 = (a) => a ;
 const f2 = (a,b) => a + b;
 const f = R.pipe( f1,f2.bind(null,2) )(1); //f is 3
```

`R.pipe()` 的参数都是一个函数的参数, 否则就没法工作. 为了个缘故, Rambda.js
和其他库一样, 为我们提供了大量的对函数做部化的工具. 这些工具在一定程度上固然解决了问题,
但是这个工具库太大了, 从中找出我们需要的工具已经变得有些困难了.

我认为, 应该有更好的解决方案.

使用 `@keepzen/pipe.js`, 上面相同功能的代码可以写作:

```js
const pipe = require('@keepzen/pipe.js');
const f1 = (a) => a;
const f2 = (_,b) => _ + b;
const f = pipe(f1).pipe(f2,2)(1);
```
注意最后一行, 这里没有任何的 `bind` 以及类似的东西, 我们再也不用为如何部化 f2
而绞尽脑汁了.

在第三行的 `_` 只是一个最普通的参数, 没有任何其他的假设, 我用它只是为了表示,
在调用的时候, 这个参数的值是从上一个函数 `f1` 的返回值中得到的.

在 JS 中做函数式编程, **写出更清晰的代码, 更轻松的写代码**, 这就是我写这个库的目标.
# 安装
+ npm: `npm install @keepzen/pipe.js`
+ yarn: `yarn add @keepzen/pipe.js`
# 使用
`const pipe= require('@keepzen/pipe.js');`
# 文档
## 把值放入管道
使用 `@keepzen/pipe.js`, 可以如下所示把值放入管道中:

```js
const pipe = require('@keepzen/pipe.js');

pipe(1).pipe(console.log);//print to 1
pipe(1).pipe( (a,b,c)=>a+b+c,2,3 ).pipe(console.log)//print 6
pipe(1,2).pipe(console.log) //print 1,2
pipe(1,2,3).pipe( (a,b,c)=>a+b+c) //return 6 and the arguments a=1, b =2, c 3
```

把值放入到管道中, `pipe(v,v1,v2)` 得到的是 `pipeable` 对象, 这个对象有一个 `.pipe`
方法.

`pipeable` 对象的值 (valueOf) 就是传递给 `pipe()` 的所有参数. 如果传递给 `pipe()`
的参数不止一个, 返回值是一个数组, 只有一个值的话, 返回的 `pipable` 对象的 `valueOf()`
的返回值是这个参数. 这也就是说:
`pipe(a) == a` 是 `true`, 但是 `pipe(a) === a` 和 `Object.is(pipe(a),a)` 都是
`false`, 其中 a 是非函数类型的任意 JS 值.
## 把函数放入管道
把一个函数传递给 `pipe()`, 和把一个值传递给 `pipe` 类似, 得到的返回值是一个 **对象**,
这个对象的值可以通过管道传递给其他的函数.

如果函数 `fn` 的长度(要求的实参个数)为 n (n &ge; 0), 且有不少于 n 的其他的参数, 与
`fn` 一起传递给 `pipe()`, 例如当 n 为 0 的时候, `pipe(fn, a,b,c)` 返回值的与
`fn(a,b,c)` 的返回值相等.

如果函数 `fn` 的长度是 n (n&ge;1), 且不少与 n 个其他的参数 和 `fn` 一起传递给
`pipe()`, 例如当 `fn` 的长度为 3 的时候, `pipe(fn,a)`, 将会返回一个要求 2(2=3-1)
个参数的函数.

```js
const f1 =()=>1
const f2 =(a,b)=>a+b
pipe(f1) ;// return 1
pipe(1).pipe(console.log);//print 1
pipe(1,2).pipe(f2) // return 3
pipe(f2).pipe(f2,3)(1,2);// return 6
```
## 语法糖
有人以及提议在 JS 中加入新的操作
[`|>`](https://yanis.blog/the-pipeline-operator-in-javascript/).
我认为, `|>` 操作符号, 可以作为 pipe.js 的语法糖来实现.

```js
function f1(a){console.log(a)}
1 |> f() //等同于: pipe(1).pipe(f)
function f2(a,b){return a+b}
1 |> f2(2) //等同与: pipe(1).pipe(f,2)
```

这个工作现在还没有完成, 而且我发现, 我不善于做这个工作.

如果有人愿意完成这个工作, 或者对如何完成这个工作提供帮助, 建议, 我会非常的欢迎的.
大家可以通过邮件和我联系:

**Keep.In.Zen_at_pm.me**

别忘记把 `_at_` 换成 `@`!
