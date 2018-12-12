const vm = require('vm');
const filename = `test_candy.js`;
const lineNumberPattern= new RegExp(`${filename}:(\\d+)`);
const functionCallPattern= /(.+)\((.*)\)(;*)/;
const emptyPipeCallPatter = /^pipe\(\)(.+)/;
function locateFirstPipeToken(sugar) {
  if(sugar.includes('|>')){
    try{
      const script = new vm.Script(sugar,{filename});
    }catch(err){
      let msg = err.message;
      if(msg == 'Unexpected token >' || msg == 'Unexpected token |'){
        const {0:errorLineMessage,2:t}=err.stack.split("\n");
        let lineNO=lineNumberPattern.exec(errorLineMessage)[1]-0;
        let cNo = t.length;
        if(msg == 'Unexpected token >'){
          cNo -= 1;
        }
        return [lineNO,cNo];
      }else{
        console.log(err);
        throw err;
      }
    }
  }
  return null;
}

const r = String.raw;
const pipeOperator = new RegExp(
  r`\s*`
  + r`([^\)\(\|>]*)` //firstOd
  + r`\s*\|>\s*` // |> operater
  + r`([^\)\(\|>]+)` // function name
  + r`\s*\(` // function call begin
  + r`([^\)\(]*)`// function call arguemnts
  + r`\)[\t ]*(;*)` // function call end
  + r`([^$]*)` // otherCode
  + "$"
  ,
  "m"
);
const mutilNewLine = /\n+$/g;

function transform(candyCode, ret='', piped=false) {
  const locatePipeOperator=locateFirstPipeToken(candyCode);
  if( locatePipeOperator != null ){
    const rowNo = locatePipeOperator[0]-1;
    let needHandler='';
    candyCode.split("\n").forEach(
      (row,i)=>{
        if(i >= rowNo){
          needHandler += row+"\n";
        }else{
          ret += row+'\n';
        }
      }
    );
    let array = pipeOperator.exec(needHandler);
    let {
      1:firstOd,
      2:fun,
      3:args,
      4:isEnd,
      5:otherCode
    } = array;
    array=null;
    firstOd = firstOd.trim();
    args = args.trim();
    if(args != ""){
      args = ","+args;
    }
    isEnd = (isEnd !=""?",":"");
    switch(true)
    {
      case piped == true && firstOd =='' :
        if(ret[ret.length-1] != '\n'){
          ret +='\n'
        }
        ret += `  .pipe(${fun}${args})`;
      break;
      case firstOd != '':
        ret += `pipe(${firstOd})`;
        ret += `\n  .pipe(${fun}${args})`;
      break;
      default:
      throw {candyCode,piped,fun,firstOd,otherCode};
    }
    if( isEnd != ''){
      ret +=";"
      return transform(otherCode,ret,false);
    }else{
      return transform(otherCode,ret,true);
    }
  }
  //candyCode no have |>
  if(require.main == module && ret!='') {
    ret = `const pipe= require("@keepzen/pipe.js");\n${ret}`
  }
  return ret.replace(mutilNewLine,"\n")+candyCode.replace(mutilNewLine,"\n");
}
if(require.main == module){
  const fs = require('fs');
  if(process.argv.length == 3){
    let candy = fs.readFileSync(process.argv[2]);
    console.log(transform(candy.toString()));
  }else{
    console.log(
      process.argv.join(" ") +
      " file_include_pipeline_operatoer_code > target.js"
    )
  }
}else{
  module.exports={
    transform,
    locateFirstPipeToken,
  }
}
