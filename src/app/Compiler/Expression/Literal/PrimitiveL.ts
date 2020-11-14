import { Expression } from "../../Abstract/Expression";
import { Type, Types } from "../../Utils/Type";
import { Enviorement } from "../../SymbolTable/Enviorement";
import { Retorno } from "../../Utils/Retorno";
import { Generator } from "../../Generator/Generator";
import { Error } from "../../Utils/Error";
import { errores } from '../../SymbolTable/Errores';
import { Error_ } from "../../SymbolTable/Error";
import { cont } from "../../contador";
import { Aumentar} from "../../contador";

export class PrimitiveL extends Expression {
    private type: Types;
    private value: any;

    constructor(type: Types, value: any, line: number, column: number) {
        super(line, column);
        this.type = type;
        this.value = value;
    }

    public compile(enviorement: Enviorement): Retorno {
        switch (this.type) {
            case Types.INTEGER:
                 return new Retorno(this.value,false,new Type(this.type,'',null,0));
            case Types.DOUBLE:
                return new Retorno(this.value,false,new Type(this.type,'',null,0));
            case Types.BOOLEAN:
                const generator = Generator.getInstance();
                const retorno = new Retorno(this.value,false,new Type(this.type,'',null,0));
                this.trueLabel = this.trueLabel == '' ? generator.newLabel() : this.trueLabel;
                this.falseLabel = this.falseLabel == '' ? generator.newLabel() : this.falseLabel;
                //this.value ? generator.addGoto(this.trueLabel) : generator.addGoto(this.falseLabel);
                retorno.trueLabel = this.trueLabel;
                retorno.falseLabel = this.falseLabel;
                return retorno;
            case Types.NULL:
                return new Retorno('-1',false,new Type(this.type,'',null,0));
            default:
                let errorN = new Error_(this.line,this.column,"Semantico",'Tipo de dato no reconocido');
                errores.push(errorN); 
                throw new Error(this.line,this.column,'Semantico','Tipo de dato no reconocido');
        }
    }

    
    public getDot(ant:string){
        //import { cont } from "../../contador";
      //import { Aumentar} from "../../contador";

        let dot = "";
        let nodo= "Node"+cont;
        dot+=nodo+"[label=Literal]; \n";
        dot+= ant+"->"+nodo+'\n';
        Aumentar();

            let nodo1= "Node"+cont;
            dot+=nodo1+"[label= \""+this.value+"\"]; \n";
            dot+= nodo+"->"+nodo1+'\n';
            Aumentar();
            return dot;
        
    }
}