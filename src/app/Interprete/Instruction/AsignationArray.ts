import { Instruction } from "../Abstract/Instruction";
import { Environment } from "../Symbol/Environment";
import { Expression } from "../Abstract/Expression";
import { env } from "process";
import { Type } from '../Abstract/Retorno';
import {Error_} from "../Error"
import {errores} from "../Errores"

export class AsignationArray extends Instruction{

    private id : string;
    private lista : Array<any> | null;
    private tipo: number;
    private indice: Expression | null;
    private valor: Expression | null;

    constructor(id: string, lista : Array<any> | null, indice : Expression | null ,valor: Expression | null , line : number, column: number,tipo:number){
        super(line, column);
        this.id = id;
        this.lista = lista;
        this.tipo = tipo;
        this.indice= indice;
        this.valor = valor;
    }

    public execute(environment: Environment) {
        
        const v = environment.getVar(this.id);
        if(v == null){
             let errorN = new Error_(this.line,this.column,"Semantico","La variable no existe, o se encuentra en otro entorno");
             errores.push(errorN);
            throw {error: "Semantico: la variable no existe, o se encuentra en otro entorno", linea: this.line, columna : this.column}
        } 


        let arreglo:Array<any>=[];

        if(this.lista != null){
         for (const c of this.lista) {
             let valor = c.execute(env);
              console.log(valor);
            if(valor.type != v.typeArray){
              
             let errorN = new Error_(this.line,this.column,"Semantico","el valor  ["+ valor.value +"]  no coincide con el tipo del arreglo");
             errores.push(errorN);  
             throw {error: "Semantico: el valor  ["+ valor.value +"]  no coincide con el tipo del arreglo", linea: this.line, columna : this.column};
              
            }
        }
 
        for (const a of this.lista) {
         let valor = a.execute(env);
          arreglo.push(valor.value);
        }
 
      }


        
        if(this.tipo == 1){ // solo se asigna el nuevo valor, y se verifica si el nuevo valor es del mismo tipo                   
            //const val = this.value.execute(environment);
           
            if(v.type==Type.ANY || v.type == Type.ARRAY){
                if(v.tipoVar == "let"){
                    let n :Array<any>=[]
                    environment.guardar(this.id, n, v.type,v.tipoVar,n,v.typeArray); 
                }else{
                    let errorN = new Error_(this.line,this.column,"Semantico","La variable es de tipo constante, no puede cambiar su valor");
                    errores.push(errorN);
                    throw {error: "Semantico: La variable es tipo constante, no puede cambiar su valoor", linea: this.line, columna : this.column}
                }
                  
            }else{
                let errorN = new Error_(this.line,this.column,"Semantico","la variable no es un arreglo");
                errores.push(errorN);
                throw {error: "Semantico: la variable no es un arreglo", linea: this.line, columna : this.column}
            }
                  

        }else if (this.tipo == 2){ // solo se incrementa en uno el valor, si es number
              
            
            if(v.type == Type.ARRAY){
                if(v.tipoVar == "let"){

                  environment.guardar(this.id, arreglo, v.type,v.tipoVar,arreglo,v.typeArray); 

                }else{
                    let errorN = new Error_(this.line,this.column,"Semantico","La variable es tipo constante, no puede cambiar su valor");
                    errores.push(errorN);
                    throw {error: "Semantico: La variable es tipo constante, no puede cambiar su valor", linea: this.line, columna : this.column}
                }
                  
               }else{
                let errorN = new Error_(this.line,this.column,"Semantico","La variable no es de tipo array");
                errores.push(errorN);
                throw {error: "Semantico: la variable no es de tipo array", linea: this.line, columna : this.column}
               }


        }else if (this.tipo == 3){ //solo se le resta uno al valor, si es number
           
            if(v.type == Type.ARRAY){
                if(v.tipoVar == "let"){
                    let ind = this.indice.execute(environment);
                    let exp = this.valor.execute(environment);

                   if (ind.type == Type.NUMBER){
                         if(exp.type == v.typeArray){
                               let arr = v.valor;
                               arr[ind.value] = exp.value;
                        
                            environment.guardar(this.id, arr, v.type,v.tipoVar,arr,v.typeArray); 
                         }else{
                            let errorN = new Error_(this.line,this.column,"Semantico","El valor que desea ingresar y el arreglo nos on del mismo tipo");
                            errores.push(errorN);
                           throw {error: "Semantico: El valor que desea ingresar y el arreglo nos on del mismo tipo", linea: this.line, columna : this.column}

                         }

                   }else{
                      let errorN = new Error_(this.line,this.column,"Semantico","El indice no es de tipo number");
                      errores.push(errorN);
                     throw {error: "Semantico: El indice no es de tipo number", linea: this.line, columna : this.column}
                   }
                    

                  }else{
                       let errorN = new Error_(this.line,this.column,"Semantico","La variable es tipo constante, no puede cambiar su valor");
                       errores.push(errorN);
                      throw {error: "Semantico: La variable es tipo constante, no puede cambiar su valor", linea: this.line, columna : this.column}
                  }
             }else{
                let errorN = new Error_(this.line,this.column,"Semantico","La variable no es de tipo array");
                errores.push(errorN);
              throw {error: "Semantico: la variable no es de tipo array", linea: this.line, columna : this.column}
             }

        }


        
    }

    public getDot(ant:string){}

}