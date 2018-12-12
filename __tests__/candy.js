const {
  locateFirstPipeToken,
  transform,
} = require('../bin/candy.js')


const pipeToConsole =`
1 |> console.log()
`;
const pipeToConsoleCode=`
pipe(1)
  .pipe(console.log)
`
const pipeInString=`
"|>"
`
const pipeToFunctionWithOneArgument=`
1|>a(1);
`
const pipeToFunctionWithOneArgumentCode=`
pipe(1)
  .pipe(a,1);
`
const pipeToFunctionWithMoreArguments=`
1|>a(1,2,3);
`
const pipeToFunctionWithMoreArgumentsCode=`
pipe(1)
  .pipe(a,1,2,3);
`
const pipeCrossLines=`
1 |> a()
  |> b(1)
`
const pipeCrossLinesCode=`
pipe(1)
  .pipe(a)
  .pipe(b,1)
`

const pipeToMoreFunctionInOneLine=`
1 |> a() |> b(2,3) |> c(4)
|>
d(5,6)
`
const pipeToMoreFunctionInOneLineCode=`
pipe(1)
  .pipe(a)
  .pipe(b,2,3)
  .pipe(c,4)
  .pipe(d,5,6)
`;

test(
  "locateFirstPipeToken",
  ()=>{
    expect(locateFirstPipeToken(pipeToConsole)).toMatchObject([2,3]);
    expect(locateFirstPipeToken(pipeInString)).toBe(null);
    expect(locateFirstPipeToken(pipeToFunctionWithOneArgument)).
      toMatchObject([2,2]);
    expect(locateFirstPipeToken(pipeToFunctionWithMoreArguments)).
      toMatchObject([2,2]);
  }
)
test(
  "transform",
  ()=>{
    expect(transform(pipeToConsole)).toBe(pipeToConsoleCode);
    expect(transform(pipeInString)).toBe(pipeInString);
    expect(transform(pipeToFunctionWithOneArgument)).
      toBe(pipeToFunctionWithOneArgumentCode);
    expect(transform(pipeToFunctionWithMoreArguments))
      .toBe(pipeToFunctionWithMoreArgumentsCode);
    expect(transform(pipeCrossLines)).toBe(pipeCrossLinesCode);
    expect(transform(pipeToMoreFunctionInOneLine))
      .toBe(pipeToMoreFunctionInOneLineCode);
  }
)
