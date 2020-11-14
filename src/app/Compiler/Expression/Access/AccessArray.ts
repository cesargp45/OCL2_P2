import { Expression } from "../../Abstract/Expression"
import { Enviorement } from "../../SymbolTable/Enviorement";
import { Retorno } from "../../Utils/Retorno";
import { Error } from "../../Utils/Error";
import { Generator } from "../../Generator/Generator";
import { Type, Types } from "../../Utils/Type";

export class AccessArray extends Expression{
    private index: Expression;
    private anterior: Expression | null;

    constructor(index: Expression, anterior: Expression | null,line : number, column: number, public isAcc:boolean){
        super(line,column);
        this.index = index;
        this.anterior = anterior;
    }
     
    compile(enviorement: Enviorement) : Retorno{
   
      const generator = Generator.getInstance();      
      const anterior = this.anterior.compile(enviorement);
      generator.addComment("inicia el acceso");
      const index = this.index.compile(enviorement);
      if(anterior.type.dimension == 0){
        throw new Error(this.line,this.column,'Semantico',"No es un arreglo");
      }

      
      if(index.type.type!= Types.INTEGER &&index.type.dimension != 0){
        throw new Error(this.line,this.column,'Semantico',"Indice de acceso no valido");
      }
      
      const tempAux = generator.newTemporal();
      generator.freeTemp(tempAux);
      const temp = generator.newTemporal();

      generator.addExpression(tempAux,anterior.getValue(),index.getValue(),'+');
      generator.addExpression(tempAux,tempAux,'1','+');
      generator.addGetHeap(temp,tempAux);
      const ret = new Retorno(temp,true,new Type(anterior.type.type,anterior.type.typeId,null,anterior.type.dimension - 1));
      /*if(anterior.type.type == Types.BOOLEAN){
        this.trueLabel = this.trueLabel == '' ? generator.newLabel() : this.trueLabel;
        this.falseLabel = this.falseLabel == '' ? generator.newLabel() : this.falseLabel;
        //this.value ? generator.addGoto(this.trueLabel) : generator.addGoto(this.falseLabel);
        ret.trueLabel = this.trueLabel;
        ret.falseLabel = this.falseLabel;
      }*/
      generator.addComment("fin el acceso");
      return ret
 }

 public getDot(ant:string){
  //import { cont } from "../../contador";
//import { Aumentar} from "../../contador";
  return " ";

  
}
}