import { Instruction } from "../Abstract/Instruction";
import { Expression } from "../Abstract/Expression";
import { Environment } from "../Symbol/Environment";
import { cont } from "../contador";
import { Aumentar} from "../contador";

export class Continue extends Instruction{

    constructor(line : number, column : number){
        super(line, column);
    }

    public execute(environment : Environment) {
        return {line : this.line, column: this.column, type : 'Continue'};
    }

    public getDot(ant:string){

        let dot = "";
        let nodo= "Node"+cont;
        dot+=nodo+"[label=Interruption]; \n";
        dot+= ant+"->"+nodo+'\n';
        Aumentar();

            let nodo1= "Node"+cont;
            dot+=nodo1+"[label=Continue]; \n";
            dot+= nodo+"->"+nodo1+'\n';
            Aumentar();
            return dot;

    }
}