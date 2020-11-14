import { Instruction } from "../Abstract/Instruction";
import { Expression } from "../Abstract/Expression";
import { Environment } from "../Symbol/Environment";
import { Type } from "../Abstract/Retorno";
import {Error_} from "../Error";
import {errores} from "../Errores";
import { cont } from "../contador";
import { Aumentar} from "../contador";


export class Case extends Instruction{

    constructor(public condition : Expression | null, private code: Instruction |null ,line : number, column : number,public tipo:string){
        super(line, column);
    }

    public execute(env : Environment) {
         
        if(this.code != null){
            return this.code.execute(env);
        }
        else{           
            return;
        }
    }

    public getDot(ant:string){
        let dot = "";
        let nodo= "Node"+cont;
        dot+=nodo+"[label=\""+this.tipo+"\"]; \n";
        dot+= ant+"->"+nodo+'\n';
        Aumentar();

        if(this.condition != null){

            let nodo1= "Node"+cont;
           dot+=nodo1+"[label=condition]; \n";
           dot+= ant+"->"+nodo1+'\n';
            Aumentar();

           dot+= this.condition.getDot(nodo1);

        }
        

            let nodo2= "Node"+cont;
            dot+=nodo2+"[label=Instruccions]; \n";
           dot+= ant+"->"+nodo2+'\n';
           Aumentar();

              dot+= this.code.getDot(nodo2);
            return dot;

    }
}