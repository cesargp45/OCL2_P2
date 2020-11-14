import { Instruction } from "../Abstract/Instruction";
import { Environment } from "../Symbol/Environment";
import { Expression } from "../Abstract/Expression";
//import { env } from "process";
import { Type } from '../Abstract/Retorno';
import {Error_} from "../Error"
import {errores} from "../Errores"

export class Prueba extends Instruction{

    private id : string;
    private value : Expression;
    private tipo: number;

    constructor(id: string, value : Expression , line : number, column: number,tipo:number){
        super(line, column);
        this.id = id;
        this.value = value;
        this.tipo = tipo;
        console.log(value);
    }

    public execute(environment: Environment) {
           
        const v = environment.getVar(this.id);

        if(v == null){
             let errorN = new Error_(this.line,this.column,"Semantico","La variable no existe, o se encuentra en otro entorno");
             errores.push(errorN);
            throw {error: "Semantico: la variable no existe, o se encuentra en otro entorno", linea: this.line, columna : this.column}
        } 



        if(this.value != null){

            const vall = this.value.execute(environment);
   
           if(vall == undefined){
               let errorN = new Error_(this.line,this.column,"Semantico","no se puede asignar un valor undefined");
               errores.push(errorN);  
               throw {error: "Semantico: no se puede asignar un valor undefined", linea: this.line, columna : this.column};
             }
   
         }else{
               let errorN = new Error_(this.line,this.column,"Semantico","valor nulo");
               errores.push(errorN);  
               throw {error: "Semantico: valor nulo", linea: this.line, columna : this.column};
   
        }
     
        const val = this.value.execute(environment);
        
        console.log("retorna : " + val.value);

    }

    public getDot(ant:string){}

}