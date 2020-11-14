import { Expression } from "../Abstract/Expression";
import { Environment } from "../Symbol/Environment";
import { Retorno } from "../Abstract/Retorno";
//import { type } from "os";
import { Type } from '../Abstract/Retorno';
import {Error_} from "../Error"
import {errores} from "../Errores"
import { cont } from "../contador";
import { Aumentar} from "../contador";


export class CadenaParam extends Expression{

    constructor(private value: string, line : number, column: number,private tipo: number){
        super(line, column);
    }

    public execute(environment: Environment): Retorno {
       
        const texto = this.value,
        regex = /\${([^}]*)}/g;
        var grupos;
        let arr1:string[] =[];
        let arr2:string[] =[];
        while ((grupos = regex.exec(texto)) !== null) {
            arr1.push(grupos[0].toString());
            arr2.push(grupos[1].toString());
         }

         let b = texto ; 

         for(let i = 0; i<arr1.length;i++){

            const value = environment.getVar(arr2[i]);
            if(value == null){
                 let errorN = new Error_(this.line,this.column,"Semantico","La variable no existe");
                 errores.push(errorN);         
                 throw {error: "Semantico:La variable no existe", linea: this.line, columna : this.column}    
            }

             b = b.replace(arr1[i],value.valor.toString());
         }

         return {value : b, type : Type.STRING};  
  }

  public getDot(ant:string){
    let dot = "";
    let nodo= "Node"+cont;
    dot+=nodo+"[label=Literal]; \n";
    dot+= ant+"->"+nodo+'\n';
    Aumentar();

        let nodo1= "Node"+cont;
        dot+=nodo1+"[label= "+this.value+"]; \n";
        dot+= nodo+"->"+nodo1+'\n';
        Aumentar();
        return dot;
  }
}