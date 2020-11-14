import { Expression } from "../../Abstract/Expression";
import { Retorno } from "../../Utils/Retorno";
import { Generator } from "../../Generator/Generator";
import { Types, Type } from "../../Utils/Type";
import { Enviorement } from "../../SymbolTable/Enviorement";
import { Error } from "../../Utils/Error";
import { errores } from '../../SymbolTable/Errores';
import { Error_ } from "../../SymbolTable/Error";
import { cont } from "../../contador";
import { Aumentar} from "../../contador";

export class Mod extends Expression{
    private left: Expression;
    private right: Expression;

    constructor(left: Expression, right: Expression, line: number, column: number) {
        super(line, column);
        this.left = left;
        this.right = right;
    }

    public compile(enviorement: Enviorement): Retorno {
        const left = this.left.compile(enviorement);
        const right = this.right.compile(enviorement);
        const generator = Generator.getInstance();
        const temp = generator.newTemporal();
        switch (left.type.type) {
            case Types.INTEGER:
                switch (right.type.type) {
                    case Types.INTEGER:
                        generator.addExpression(temp,"fmod("+ left.getValue()+","+right.getValue()+")", "", '');
                        return new Retorno(temp, true, new Type(Types.DOUBLE));
                    case Types.DOUBLE:
                        generator.addExpression(temp,"fmod("+ left.getValue()+","+right.getValue()+")", "", '');
                        return new Retorno(temp, true, new Type(Types.DOUBLE));
                    default:
                        break;
                }
            case Types.DOUBLE:
                switch (right.type.type) {
                    case Types.INTEGER:
                        generator.addExpression(temp,"fmod("+ left.getValue()+","+right.getValue()+")", "", '');
                        return new Retorno(temp, true, new Type(Types.DOUBLE));
                    case Types.DOUBLE:
                        generator.addExpression(temp,"fmod("+ left.getValue()+","+right.getValue()+")", "", '');
                        return new Retorno(temp, true, new Type(Types.DOUBLE));
                    default:
                        break;
                }
        }
        let errorN = new Error_(this.line,this.column,"Semantico",`No se puede modular ${left.type.type} % ${right.type.type}`);
        errores.push(errorN); 
        throw new Error(this.line, this.column, 'Semantico', `No se puede modular ${left.type.type} % ${right.type.type}`);
    }

    public getDot(ant:string){
        //import { cont } from "../../contador";
        //import { Aumentar} from "../../contador";

        let dot = "";
        let nodo= "Node"+cont;
        dot+=nodo+"[label=Aritmetic]; \n";
        dot+= ant+"->"+nodo+'\n';
        Aumentar();
          
            dot+= this.left.getDot(nodo);
            let nodo1= "Node"+cont;
            dot+=nodo1+"[label= \" % \"]; \n";
            dot+= nodo+"->"+nodo1+'\n';
            Aumentar();
            dot+= this.right.getDot(nodo);
            return dot;     

    }
}