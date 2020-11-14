import { Expression } from "../../Abstract/Expression"
import { Enviorement } from "../../SymbolTable/Enviorement";
import { Retorno } from "../../Utils/Retorno";
import { Error } from "../../Utils/Error";
import { Generator } from "../../Generator/Generator";
import { Type, Types } from "../../Utils/Type";
import { errores } from '../../SymbolTable/Errores';
import { Error_ } from "../../SymbolTable/Error";
 //import { cont } from "../../contador";
        //import { Aumentar} from "../../contador";

export class AssignmentArray extends Expression{
    private index: Expression;
    private anterior: Expression | null;

    constructor(index: Expression, anterrior: Expression | null,line : number, column: number){
        super(line,column);
        this.index = index;
        this.anterior = anterrior;
    }

    compile(enviorement: Enviorement) : Retorno{
      const generator = Generator.getInstance();
      const anterior = this.anterior.compile(enviorement);
      const index = this.index.compile(enviorement);
      if(anterior.type.dimension == 0){
        let errorN = new Error_(this.line,this.column,"Semantico","No es un arreglo");
       errores.push(errorN); 
        throw new Error(this.line,this.column,'Semantico',"No es un arreglo");
      }

      if(index.type.type != Types.INTEGER || index.type.dimension != 0){
        let errorN = new Error_(this.line,this.column,"Semantico","Indice de acceso no valido");
       errores.push(errorN); 
        throw new Error(this.line,this.column,'Semantico',"Indice de acceso no valido");
      }
       const tempAux = generator.newTemporal();
       generator.freeTemp(tempAux);
       const temp = generator.newTemporal();

      if(anterior.symbol != null && !anterior.symbol.isHeap){
          //hacer varibles por referencia
        generator.addGetStack(tempAux,anterior.getValue());
      }else{
        generator.addGetHeap(tempAux,anterior.getValue());
      }

      generator.addExpression(temp,tempAux,index.getValue(),'+');
      generator.addExpression(temp,temp,'1','+');
      return new Retorno(temp,true,new Type(anterior.type.type,anterior.type.typeId,null,anterior.type.dimension - 1));
    }
     

    public getDot(ant:string){
      //import { cont } from "../../contador";
      //import { Aumentar} from "../../contador";

      return " ";    

  }
    
}