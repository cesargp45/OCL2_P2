import { Expression } from "../../Abstract/Expression";
import { Enviorement } from "../../SymbolTable/Enviorement";
import { Retorno } from "../../Utils/Retorno";
import { Error } from "../../Utils/Error";
import { Generator } from "../../Generator/Generator";
import { Types, Type } from "../../Utils/Type";
import { errores } from '../../SymbolTable/Errores';
import { Error_ } from "../../SymbolTable/Error";
import { cont } from "../../contador";
import { Aumentar} from "../../contador";

export class Less extends Expression {
    private left: Expression;
    private right: Expression;
    private isLessEqual: boolean;

    constructor(isLessEqual: boolean, left: Expression, right: Expression, line: number, column: number) {
        super(line, column);
        this.left = left;
        this.right = right;
        this.isLessEqual = isLessEqual;
    }

    compile(enviorement: Enviorement): Retorno {
        const left = this.left.compile(enviorement);
        const right = this.right.compile(enviorement);

        const lefType = left.type.type;
        const rightType = right.type.type;

        if (( lefType == Types.INTEGER || lefType == Types.DOUBLE) &&
            ( rightType == Types.INTEGER || rightType == Types.DOUBLE)) {
            const generator = Generator.getInstance();
            this.trueLabel = this.trueLabel == '' ? generator.newLabel() : this.trueLabel;
            this.falseLabel = this.falseLabel == '' ? generator.newLabel() : this.falseLabel;
            if(this.isLessEqual){
                generator.addIf(left.getValue(),right.getValue(),'<=',this.trueLabel);
            }
            else{
                generator.addIf(left.getValue(),right.getValue(),'<',this.trueLabel);
            }
            generator.addGoto(this.falseLabel);
            const retorno = new Retorno('',false,new Type(Types.BOOLEAN));
            retorno.trueLabel = this.trueLabel;
            retorno.falseLabel = this.falseLabel;
            return retorno;
        }
        let errorN = new Error_(this.line,this.column,"Semantico",`No se puede ${left.type.type} < ${right.type.type}`);
                errores.push(errorN); 
        throw new Error(this.line, this.column, 'Semantico', `No se puede ${lefType} < ${rightType}`);
    }

    public getDot(ant:string){
        //import { cont } from "../../contador";
         //import { Aumentar} from "../../contador";
        let dot = "";
        let nodo= "Node"+cont;
        dot+=nodo+"[label=relational]; \n";
        dot+= ant+"->"+nodo+'\n';
        Aumentar();
         
                dot+= this.left.getDot(nodo);
                let nodo1= "Node"+cont;
                dot+=nodo1+"[label= \" < \"]; \n";
                dot+= nodo+"->"+nodo1+'\n';
                Aumentar();
                 dot+= this.right.getDot(nodo);
                return dot;
    }

    
}