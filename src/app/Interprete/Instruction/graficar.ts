import { Instruction } from "../Abstract/Instruction";
import { Expression } from "../Abstract/Expression";
import { Environment } from "../Symbol/Environment";
import { Type } from '../Abstract/Retorno';
import {resultado} from '../traduc';
import { Simbolo } from "../simbolo";
import { simbolog } from "../simboloG";
import { cont } from "../contador";
import { Aumentar} from "../contador";

export class Graficar extends Instruction{

    constructor( line : number, column : number){
        super(line, column);
    }

    public execute(environment : Environment) {
        
        let simboloN = new Simbolo("llamada","", "", "","");
        simbolog.push(simboloN); 

        environment.guardarSimbolos();
        environment.guardarsimbolosf();
        
  }

  public getDot(ant:string){

    let dot = "";
        let nodo= "Node"+cont;
        dot+=nodo+"[label=instruccion]; \n";
        dot+= ant+"->"+nodo+'\n';
        Aumentar();

            let nodo1= "Node"+cont;
            dot+=nodo1+"[label= \"graficar_ts\"]; \n";
            dot+= nodo+"->"+nodo1+'\n';
            Aumentar();
            return dot;

  }
}