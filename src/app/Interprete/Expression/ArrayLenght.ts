import { Environment } from "../Symbol/Environment";
import { Expression } from "../Abstract/Expression";
import { Instruction } from "../Abstract/Instruction";
import { Retorno, Type } from "../Abstract/Retorno";
import { Arreglo } from "../Objects/Array";
import {Error_} from "../Error";
import {errores} from "../Errores";



export class ArrayLenght extends Instruction{

    constructor(private pos:any, line:number,column:number){
      super(line,column);
    }
   

    public execute(environment:Environment){
        
         this.pos.len = 1;

         const tam = this.pos.execute(environment);

         return{value:tam.value, type: tam.type};
  }

  public getDot(ant:string){}
}