# 管道
熟悉 Bash 的知道管道把两个简单的进程链接起来, 完成一个稍微复杂的工作.
在进程间通信手段中, 也有管道, 这里管道是两个进程间通信的通道.

无论是 Bash , 还是在进程间通信的上下文中, **管道中传输的都是数据**.

在以前的版本中, 实际上, 我没有考虑清楚这一点. 所以实现的非常混乱.
明白了, 管道中传输的只是数据, 那么就没必要在 `@keepzen/pipe.js` 的
API 中为函数做过多的考虑, 一个函数是不能通过管道传递到另外一个函数中的,
有的只是函数的返回值, 返回值, 才能流过管道.

所以, 这个版本的 API 就变的非常的简单.

# API
## 把值放入管道
`Pipe(v,...other)=>({valueOf()=>v|Array,pipe(fun,...args)})`

```js
const {
  Pipe,
} = require('@keepzen/pipe.js')
let p = Pipe(3) ;
p == 3 //true
p.pipe(console.log)//print 3
let o ={a:1};
let oP = Pipe(o);
oP.valueOf() == o;//true
oP.pipe(console.log) //print {a:1}
Pipe(1,2,3).
  pipe((a,b,c)=>a+b+c).
  pipe(console.log) // print 6
```
## 指定 pipe 到那个参数
我们把 `Pipe(v)` 得到的对象叫做 `pipeable`, 因为这个对象有一个 `pipe(fun,...args)` 方法,
可以把其中的值 `v` 作为参数传递给 函数 `fun`.

`pipable.pipe(fun,...args)`

当 `args` 中不含占位符的时候, `pipeable.pipe(fun,...args)` 这样 `fun(v,...others,...args)` 来调用 `fun`.

例如:
```js
const {
  Pipe,
  PlaceHolderForPipe:_
} = require('@keepzen/pipe.js');
Pipe(2)
  .pipe( (a,b)=>a+b, 'a')
  .pipe(cosole.log) //print 2a
Pipe(1,2,3).pipe( (a,b,c,d,e)=> a+b+c+d+e,4,5 ) // == 1+2+3+4+5
```

当 `args` 中含有占位符的时候, `v` 以及 `others` 中的值会依次替换掉 `args` 中出现的占位符,
如果 others 中还有其他元素, 那么这些元素会放到 `fun` 参数列表的最后.

`args` 中去掉占位符后, 元素的个数, 加上 `others` 中的元素个数,
再加 1(`v`) 必须大于等于 `fun` 要求的参数个数, 否则就会抛出语法错误.

例如:

```js
function test(a,b,c){
  console.log(arguments);
}
Pipe(1,2,3,4).pipe(test,'0',_,"a",_,"b") == '01a2b34'

var other=[2,3];//length is 2
var args=['a',_,_,'b'] //number of elementes filter out _ is 2
var fun = (a,b,c,d,e,f)=>a+b+c+d+e+f; //fn required 6 paraments
Pipe(1,...other).pipe(fun,...args) // 6 != 2+2+1 so throw a error
```
