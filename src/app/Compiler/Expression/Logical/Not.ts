import { Expression } from "../../Abstract/Expression";
import { Enviorement } from "../../SymbolTable/Enviorement";
import { Retorno } from "../../Utils/Retorno";
import { Generator } from "../../Generator/Generator";
import { Types } from "../../Utils/Type";
import { Error } from "../../Utils/Error";
import { errores } from '../../SymbolTable/Errores';
import { Error_ } from "../../SymbolTable/Error";
import { cont } from "../../contador";
import { Aumentar} from "../../contador";

export class Not extends Expression {
    private value: Expression;

    constructor(value: Expression, line: number, column: number) {
        super(line, column);
        this.value = value;
    }

    compile(enviorement: Enviorement): Retorno {
        const generator = Generator.getInstance();
        this.trueLabel = this.trueLabel == '' ? generator.newLabel() : this.trueLabel;
        this.falseLabel = this.falseLabel == '' ? generator.newLabel() : this.falseLabel;

        this.value.trueLabel = this.falseLabel;
        this.value.falseLabel = this.trueLabel;

        const value = this.value.compile(enviorement);
        if(value.type.type == Types.BOOLEAN){
            const retorno = new Retorno('',false,value.type);
            retorno.trueLabel = this.trueLabel;
            retorno.falseLabel = this.falseLabel;
            return retorno;
        }
        let errorN = new Error_(this.line,this.column,"Semantico",`No se puede Not del tipo ${value.type.type}`);
                errores.push(errorN); 
        throw new Error(this.line,this.column,'Semantico',`No se puede Not del tipo ${value.type.type}`);
    }

    public getDot(ant:string){
        //import { cont } from "../../contador";
         //import { Aumentar} from "../../contador";
        let dot = "";
        let nodo= "Node"+cont;
        dot+=nodo+"[label=Logic]; \n";
        dot+= ant+"->"+nodo+'\n';
        Aumentar();
         
                dot+= this.value.getDot(nodo);
                let nodo1= "Node"+cont;
                dot+=nodo1+"[label= \" &&\"]; \n";
                dot+= nodo+"->"+nodo1+'\n';
                Aumentar();
                return dot;
    }
}