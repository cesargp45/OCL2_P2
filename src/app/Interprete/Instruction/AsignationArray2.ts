import { Environment } from "../Symbol/Environment";
import { Expression } from "../Abstract/Expression";
import { Instruction } from "../Abstract/Instruction";
import { Retorno, Type } from "../Abstract/Retorno";
import { Arreglo } from "../Objects/Array";
import {Error_} from "../Error";
import {errores} from "../Errores";



export class AsignationArray2 extends Instruction{

    constructor(private id: string , private indices:Expression[], private value: Expression, line:number,column:number){
      super(line,column);
    }
   

    public execute(environment:Environment){

        let variable = environment.getVar(this.id);
        if(variable == null){
             let errorN = new Error_(this.line,this.column,"Semantico","No existe la variable");
             errores.push(errorN);
            throw {error: "Semantico: No existe la variable", linea: this.line, columna : this.column}
        } 
        if(variable.type != Type.ARRAY){
            let errorN = new Error_(this.line,this.column,"Semantico","No se puede realizar la accion pues la vaiable no es arreglo");
            errores.push(errorN);
           throw {error: "Semantico:No se puede realizar la accion pues la vaiable no es arreglo", linea: this.line, columna : this.column}
       } 
       let arreglo = variable.valor
          
        for (let i= 0;i< this.indices.length;i++) {
            
            if(i == this.indices.length - 1){
                 const indice = this.indices[i].execute(environment);
                 const value = this.value.execute(environment);
                 //ver si el indice es numero
                 if(indice.type != Type.NUMBER){
                    let errorN = new Error_(this.line,this.column,"Semantico","Los indices de acceso deben ser de tipo number");
                    errores.push(errorN);
                   throw {error: "Semantico:Los indices de acceso deben ser de tipo number", linea: this.line, columna : this.column}
               } 
                 // ver si el valor es del mimo tipo del arreglo
                 if(arreglo.tipo != value.type){
                    let errorN = new Error_(this.line,this.column,"Semantico","El arreglo y el valor a insertar son de tipos diferentes");
                    errores.push(errorN);
                   throw {error: "Semantico:El arreglo y el valor a insertar son de tipos diferentes", linea: this.line, columna : this.column}
               } 
                 arreglo.setValor(Number(indice.value),value.value);
            }
            else{
                const indice = this.indices[i].execute(environment);
                //ver si en numero el indice
                if(indice.type != Type.NUMBER){
                    let errorN = new Error_(this.line,this.column,"Semantico","Los indices de acceso deben ser de tipo number");
                    errores.push(errorN);
                   throw {error: "Semantico:Los indices de acceso deben ser de tipo number", linea: this.line, columna : this.column}
               } 
                arreglo = arreglo.getAtributo(Number(indice.value));
            }
        }



    }

    public getDot(ant:string){}



}