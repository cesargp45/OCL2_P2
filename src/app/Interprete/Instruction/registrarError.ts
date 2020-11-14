import { Instruction } from "../Abstract/Instruction";
import { Error_ } from "../Error";
import { errores } from "../Errores";

export class registrarError extends Instruction {

    constructor (line: number, column: number,private viene: any, private esperaba: any,private tipo:number) {
        super(line, column);
    }

    public execute() {
            if(this.tipo == 1){
                let errorN = new Error_(this.line, this.column, "Lexico", "Token desconocido: "+this.viene);
                errores.push(errorN); 

            }else{
                let errorN = new Error_(this.line, this.column, "Sintactico", " Viene: "+this.viene + ", se esperaba: "+this.esperaba);
                errores.push(errorN); 
            }
                 

    }  

    public getDot(ant:string){
        return "";
    }

}   