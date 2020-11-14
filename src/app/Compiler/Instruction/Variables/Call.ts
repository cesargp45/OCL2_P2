import { Instruction } from "../../Abstract/Instruction";
import { Expression } from "../../Abstract/Expression";
import { Enviorement } from "../../SymbolTable/Enviorement";
import { errores } from '../../SymbolTable/Errores';
import { Error_ } from "../../SymbolTable/Error";
import { cont } from "../../contador";
import { Aumentar} from "../../contador";

export class Call extends Instruction{
    private call: Expression;

    constructor(call: Expression, line: number, column: number){
        super(line,column);
        this.call = call;
    }

    compile(enviorement: Enviorement){
        const value = this.call.compile(enviorement);
        value.getValue(); //Para limpiar temporal
    }

    public getDot(ant:string){
        let dot = "";
        dot+= this.call.getDot(ant);   
        return dot;
    }
}