import { Expression } from "../../Abstract/Expression";
import { Enviorement } from "../../SymbolTable/Enviorement";
import { Retorno } from "../../Utils/Retorno";
import { Error } from "../../Utils/Error";
import { Generator } from "../../Generator/Generator";
import { Types } from "../../Utils/Type";
import { errores } from '../../SymbolTable/Errores';
import { Error_ } from "../../SymbolTable/Error";
import { cont } from "../../contador";
import { Aumentar} from "../../contador";

export class Or extends Expression {
    private left: Expression;
    private right: Expression;

    constructor(left: Expression, right: Expression, line: number, column: number) {
        super(line, column);
        this.left = left;
        this.right = right;
    }

    compile(enviorement: Enviorement): Retorno {
        const generator = Generator.getInstance();
        this.trueLabel = this.trueLabel == '' ? generator.newLabel() : this.trueLabel;
        this.falseLabel = this.falseLabel == '' ? generator.newLabel() : this.falseLabel;

        this.left.trueLabel = this.right.trueLabel = this.trueLabel;
        this.left.falseLabel = generator.newLabel();
        this.right.falseLabel = this.falseLabel;

        const left = this.left.compile(enviorement);
        generator.addLabel(this.left.falseLabel);
        const right = this.right.compile(enviorement);

        if(left.type.type == Types.BOOLEAN && right.type.type == Types.BOOLEAN){
            const retorno = new Retorno('',false,left.type);
            retorno.trueLabel = this.trueLabel;
            retorno.falseLabel = this.right.falseLabel;
            return retorno;
        }
        let errorN = new Error_(this.line,this.column,"Semantico",`No se puede Or: ${left.type.type} || ${right.type.type}`);
                errores.push(errorN);
        throw new Error(this.line, this.column, 'Semantico', `No se puede Or: ${left.type.type} || ${right.type.type}`);
    }

    public getDot(ant:string){
        //import { cont } from "../../contador";
         //import { Aumentar} from "../../contador";
        let dot = "";
        let nodo= "Node"+cont;
        dot+=nodo+"[label=Logic]; \n";
        dot+= ant+"->"+nodo+'\n';
        Aumentar();
         
                dot+= this.left.getDot(nodo);
                let nodo1= "Node"+cont;
                dot+=nodo1+"[label= \" || \"]; \n";
                dot+= nodo+"->"+nodo1+'\n';
                Aumentar();
                 dot+= this.right.getDot(nodo);
                return dot;
    }
}