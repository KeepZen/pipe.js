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
      if(err.message == 'Unexpected token >'){
        const {0:errorLineMessage,2:t}=err.stack.split("\n");
        let lineNO=lineNumberPattern.exec(errorLineMessage)[1]-0;
        let cNo = t.length-1;
        return [lineNO,cNo];
      }else{
        console.log(err);
        throw err;
      }
    }
  }
  return null;
}

function transform(sugar) {
  let ret = locateFirstPipeToken(sugar);
  if(ret == null){
    return sugar;
  }
  else{
    let [rowNO,columNO] = ret;
    let rows=sugar.split("\n");
    let newRows=rows.map(
      (rowString,index)=>{
        if(index!= rowNO-1){
          return rowString;
        }else{
          let [first,seconde, ...other] = rowString.split("|>");
          let {1:functionName,2:args,3:end} = functionCallPattern.exec(seconde);
          const head=`pipe(${first.trim()}).pipe(${functionName.trim()}`+
            `${
              (args==null || args.trim() == "") ? "":","+args
            })${end||""}`;
          if(other.length>0){
            return head+"\n|>"+other.join("|>")
          }else{
            return head;
          }
        }
      }
    ).map(
      line=>{
        return line.replace(emptyPipeCallPatter,"  $1");
      }
    )
    return transform(newRows.join("\n"));
  }
}

module.exports={
  transform,
  locateFirstPipeToken,
}
