import { Environment } from "../Symbol/Environment";
import { Expression } from "../Abstract/Expression";
import { Instruction } from "../Abstract/Instruction";
import { Retorno, Type } from "../Abstract/Retorno";
import { Arreglo } from "../Objects/Array";
import {Error_} from "../Error";
import {errores} from "../Errores";

import { cont } from "../contador";
import { Aumentar} from "../contador";



export class pruebaAsign extends Instruction{

    constructor(private pos:any, private value: Expression, line:number,column:number){
      super(line,column);
    }
   

    public execute(environment:Environment){
      
         let a = this.value.execute(environment);

         this.pos.Iguala = a;

         this.pos.execute(environment);

      
  }

  public getDot(ant:string){

    let dot = "";
        let nodo= "Node"+cont;
        dot+=nodo+"[label=asignacion]; \n";
        dot+= ant+"->"+nodo+'\n';
        Aumentar();

          

            let nodo1= "Node"+cont;
            dot+=nodo1+"[label= id]; \n";
            dot+= nodo+"->"+nodo1+'\n';
            Aumentar();

            let nodo2= "Node"+cont;
            dot+=nodo2+"[label= \"=\"]; \n";
            dot+= nodo+"->"+nodo2+'\n';
            Aumentar();
           
            dot+= this.value.getDot(nodo);
            
            return dot;


  }
}