import { Instruction } from "../Abstract/Instruction";
import { Expression } from "../Abstract/Expression";
import { Environment } from "../Symbol/Environment";
import { Type } from '../Abstract/Retorno';
import {resultado} from '../traduc';
import { cont } from "../contador";
import { Aumentar} from "../contador";

export class Print extends Instruction{

    constructor(private value : Expression, line : number, column : number){
        super(line, column);
    }

    public execute(environment : Environment) {
        const value = this.value.execute(environment);
        if (value == null || value == undefined){
            console.log("imprime null | undefined");
            let a = "undefined";
            resultado.push(a);
            
        }else{
            console.log( "salida: ");
            if(value.type == Type.ARRAY){
                console.log("["+value.value.atributos.toString()+"]");
                let a = "["+value.value.atributos.toString()+"]";
                resultado.push(a);
                 


            }else{
                console.log(value.value);
                let a = value.value;
                resultado.push(a);
                
            }
            
        }
        
        
    }

    public getDot(ant:string){

        let dot = "";
        let nodo= "Node"+cont;
        dot+=nodo+"[label=instruccion]; \n";
        dot+= ant+"->"+nodo+'\n';
        Aumentar();

            let nodo1= "Node"+cont;
            dot+=nodo1+"[label= \"console.log\"]; \n";
            dot+= nodo+"->"+nodo1+'\n';
            Aumentar();

            dot+= this.value.getDot(nodo);
            
            return dot;

    }
}