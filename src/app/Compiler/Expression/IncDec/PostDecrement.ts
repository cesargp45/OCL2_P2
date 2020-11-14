import { Expression } from "../../Abstract/Expression";
import { Enviorement } from "../../SymbolTable/Enviorement";
import { Error } from "../../Utils/Error";
import { Retorno } from "../../Utils/Retorno";
import { Types } from "../../Utils/Type";
import { Generator } from "../../Generator/Generator";
import { errores } from '../../SymbolTable/Errores';
import { Error_ } from "../../SymbolTable/Error";
import { cont } from "../../contador";
import { Aumentar} from "../../contador";

export class PostDecrement extends Expression {
    private access: Expression;

    constructor(access: Expression, line: number, column: number) {
        super(line, column);
        this.access = access;
    }

    compile(enviorement: Enviorement): Retorno {
        const access = this.access.compile(enviorement);
        const symbol = access.symbol;
        const generator = Generator.getInstance();
        if(symbol == null) {
        let errorN = new Error_(this.line,this.column,"Semantico",'-- no aplicable aqui');
        errores.push(errorN); 
         throw new Error(this.line,this.column,'Semantico','-- no aplicable aqui');
        }
        switch (access.type.type) {
            case Types.INTEGER:
            case Types.DOUBLE:
            case Types.CHAR:
                const temp = generator.newTemporal();
                const tempaux = generator.newTemporal(); generator.freeTemp(tempaux);
                //cambie un ?
                if(symbol.isGlobal != null ||symbol.isGlobal!= undefined ){
                    generator.addGetStack(temp,symbol.position);
                    generator.addExpression(tempaux,temp,'1','-');
                    generator.addSetStack(symbol.position,tempaux);
                }
                //cambie un ?
                else if(symbol.isHeap != null ||symbol.isHeap != undefined ){
                    generator.addGetHeap(temp,access.getValue());
                    generator.addExpression(tempaux,temp,'1','-');
                    generator.addSetHeap(access.getValue(),tempaux);
                }
                else{
                    generator.addGetStack(temp,access.getValue());
                    generator.addExpression(tempaux,temp,'1','-');
                    generator.addSetStack(access.getValue(),tempaux);
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
        let dot = "";
        let nodo= "Node"+cont;
        dot+=nodo+"[label=Asignation]; \n";
        dot+= ant+"->"+nodo+'\n';
        Aumentar();      

            let nodo1= "Node"+cont;
            dot+=nodo1+"[label= \"--\"]; \n";
            dot+= nodo+"->"+nodo1+'\n';
            Aumentar();
            return dot;

        
    }
}