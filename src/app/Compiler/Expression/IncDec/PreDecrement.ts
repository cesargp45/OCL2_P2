import { Expression } from "../../Abstract/Expression";
import { Enviorement } from "../../SymbolTable/Enviorement";
import { Error } from "../../Utils/Error";
import { Retorno } from "../../Utils/Retorno";
import { Types } from "../../Utils/Type";
import { Generator } from "../../Generator/Generator";

export class PreDecrement extends Expression {
    private access: Expression;

    constructor(access: Expression, line: number, column: number) {
        super(line, column);
        this.access = access;
    }

    compile(enviorement: Enviorement): Retorno {
        const access = this.access.compile(enviorement);
        const symbol = access.symbol;
        const generator = Generator.getInstance();
        if(symbol == null) throw new Error(this.line,this.column,'Semantico','-- no aplicable aqui');
        switch (access.type.type) {
            case Types.INTEGER:
            case Types.DOUBLE:
            case Types.CHAR:
                const temp = generator.newTemporal();

                //cambie
                if(symbol.isGlobal != null ||symbol.isGlobal!= undefined){
                    generator.addGetStack(temp,symbol.position);
                    generator.addExpression(temp,temp,'1','-');
                    generator.addSetStack(symbol.position,temp);
                }
                //cambie
                else if(symbol.isHeap != null ||symbol.isHeap != undefined){
                    generator.addGetHeap(temp,access.getValue());
                    generator.addExpression(temp,temp,'1','-');
                    generator.addSetHeap(access.getValue(),temp);
                }
                else{
                    generator.addGetStack(temp,access.getValue());
                    generator.addExpression(temp,temp,'1','-');
                    generator.addSetStack(access.getValue(),temp);
                }
                return new Retorno(temp,true,symbol.type);
            default:
                break;
        }
        throw new Error(this.line, this.column, 'Semantico', 'Aun no lo hago :(');
    }

    public getDot(ant:string){
        //import { cont } from "../../contador";
      //import { Aumentar} from "../../contador";
        return " ";

        
    }
}