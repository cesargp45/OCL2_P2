import { Expression } from "../Abstract/Expression";
import { Environment } from "../Symbol/Environment";
import { Retorno } from "../Abstract/Retorno";
//import { type } from "os";
import { Type } from '../Abstract/Retorno';
import {Error_} from "../Error";
import {errores} from "../Errores";
import { cont } from "../contador";
import { Aumentar} from "../contador";


export class Access extends Expression{

    constructor(private id: string,private indice:Expression | null, line : number, column: number,private tipo: number){
        super(line, column);
    }

    public execute(environment: Environment) {
         
        const value = environment.getVar(this.id);
       
        if(value == null){
             let errorN = new Error_(this.line,this.column,"Semantico","La variable no existe");
             errores.push(errorN);         
             throw {error: "Semantico:La variable no existe", linea: this.line, columna : this.column};
        }
        
        if(this.indice == null){
            if(this.tipo == 1){
                return {value : value.valor, type : value.type,typeArr:value.typeArray};
            }else{
             
             if(value.type == Type.ARRAY){
                let n = value.valor.atributos;
                let tam = n.length;
                
                return {value : tam, type : Type.NUMBER};
             }else{
                 let errorN = new Error_(this.line,this.column,"Semantico","No se puede accesar a ese dato pues la variable no es un arreglo");
                 errores.push(errorN);         
                 throw {error: "Semantico:No se puede accesar a ese dato pues la variable no es un arreglo", linea: this.line, columna : this.column};
             }


            }
            
        }
        
    }
    public getDot(ant:string){

        if(this.tipo == 1){
          
            let dot = "";
            let nodo= "Node"+cont;
            dot+=nodo+"[label=Acess]; \n";
            dot+= ant+"->"+nodo+'\n';
            Aumentar();
    
                let nodo1= "Node"+cont;
                dot+=nodo1+"[label = "+this.id+"]; \n";
                dot+= nodo+"->"+nodo1+'\n';
                Aumentar();
                return dot;
                
        }else if(this.tipo == 2){
          
            let dot = "";
            let nodo= "Node"+cont;
            dot+=nodo+"[label=Acess]; \n";
            dot+= ant+"->"+nodo+'\n';
            Aumentar();
    
                let nodo1= "Node"+cont;
                dot+=nodo1+"[label = "+this.id+"]; \n";
                dot+= nodo+"->"+nodo1+'\n';
                Aumentar();

                let nodo2= "Node"+cont;
                dot+=nodo2+"[label = \" .Length\"]; \n";
                dot+= nodo+"->"+nodo2+'\n';
                Aumentar();

                return dot;
        }
    
             return "";
    }
}