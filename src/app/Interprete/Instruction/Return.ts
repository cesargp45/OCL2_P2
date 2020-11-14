import { Instruction } from "../Abstract/Instruction";
import { Expression } from "../Abstract/Expression";
import { Environment } from "../Symbol/Environment";
import { cont } from "../contador";
import { Aumentar} from "../contador";

export class Return extends Instruction{

    constructor(private value: Expression | null,line : number, column : number){
        super(line, column);
    }

    public execute(environment : Environment) {
        if(this.value != null){
             let a = this.value.execute(environment);

            return {line : this.line, column: this.column, type : 'Return' ,value: a.value , tipoDato: a.type};
        }else{
            return {line : this.line, column: this.column, type : 'Return' ,value:this.value};
        }
        
    }

    public getDot(ant:string){


        let dot = "";
        let nodo= "Node"+cont;
        dot+=nodo+"[label=interruption]; \n";
        dot+= ant+"->"+nodo+'\n';
        Aumentar();

            let nodo1= "Node"+cont;
            dot+=nodo1+"[label= \"Return\"]; \n";
            dot+= nodo+"->"+nodo1+'\n';
            Aumentar();
            return dot;
    }
}