import { Instruction } from "../Abstract/Instruction";
import { Environment } from "../Symbol/Environment";
import { Expression } from "../Abstract/Expression";
import { env } from "process";
import { Type } from '../Abstract/Retorno';
import {Error_} from "../Error";
import {errores} from "../Errores";
import {tiposArr} from "../TiposArr";
import { cont } from "../contador";
import { Aumentar} from "../contador";

export class Asignation extends Instruction{

    private id : string;
    private value : Expression;
    private tipo: number;

    constructor(id: string, value : Expression , line : number, column: number,tipo:number){
        super(line, column);
        this.id = id;
        this.value = value;
        this.tipo = tipo;
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

         }else if( this.tipo == 1){
            let errorN = new Error_(this.line,this.column,"Semantico","valor nulo");
            errores.push(errorN);  
            throw {error: "Semantico: valor nulo", linea: this.line, columna : this.column};

         }
        
         //console.log(this.value.execute(environment));
        
        if(this.tipo == 1){ // solo se asigna el nuevo valor, y se verifica si el nuevo valor es del mismo tipo                   
            const val = this.value.execute(environment);
            if(v.type==Type.ANY || v.type == val.type){
                if(v.tipoVar == "let"){

                    if(val.type == Type.ARRAY){
                                       
                        let t1 ;
                        let t2;
                  
                          for (const iterator of tiposArr) {
                             
                             t1 = iterator.tipo
                             if (t1 != Type.ARRAY){
                                  if(t2 == null || t1 == t2){
                                         t2 = t1;
                                  }else{
                                   while(tiposArr.length > 0){
                                        tiposArr.pop();
                                   } 
                                   let errorN = new Error_(this.line,this.column,"Semantico","Los arreglos tienen que ser de un mismo tipo de dato");
                                   errores.push(errorN);         
                                   throw {error: "Semantico: Los arrreglos tienen que ser de un mismo tipo de dato", linea: this.line, columna : this.column};
                                  }
                             }
                       }
                 
                           while(tiposArr.length > 0){
                           tiposArr.pop();
                           
                          } 

                          //.log("pasa aqui: "+t2);
                         // console.log("variable: "+v.type);

                           if(v.type == Type.ANY){
                               if(t2 != null){
                                environment.guardar(this.id, val.value, val.type,v.tipoVar,v.listaVal,t2); 
                               }else{
                                   if(t1 == Type.ARRAY && t2 == null){
                                      environment.guardar(this.id, val.value, val.type,v.tipoVar,v.listaVal,v.typeArray);  
                                   }
                               }
                            
                           }else{

                            if(v.typeArray != t2 || t2 == null){
                                let errorN = new Error_(this.line,this.column,"Semantico","Los tipos de datos insertados, no coinciden con el tipo de dato del arreglo");
                                errores.push(errorN);         
                                throw {error: "Semantico: Los tipos de datos insertados, no coinciden con el tipo de dato del arreglo", linea: this.line, columna : this.column};
                               }
                                   
                               environment.guardar(this.id, val.value, val.type,v.tipoVar,v.listaVal,v.typeArray); 

                           }
                         

                    }else{
                        environment.guardar(this.id, val.value, val.type,v.tipoVar,v.listaVal,v.typeArray); 
                    }

                 
                    
                }else{
                    let errorN = new Error_(this.line,this.column,"Semantico","La variable es de tipo constante, no puede cambiar su valor");
                    errores.push(errorN);
                    throw {error: "Semantico: La variable es tipo constante, no puede cambiar su valor", linea: this.line, columna : this.column}
                }
                  
            }else{
                let errorN = new Error_(this.line,this.column,"Semantico","el valor a asignar y la variable, no son del mismo tipoLa variable no existe");
                errores.push(errorN);
                throw {error: "Semantico: el valor a asignar y la variable, no son del mismo tipo", linea: this.line, columna : this.column}
            }


                  
        }else if (this.tipo == 2){ // solo se incrementa en uno el valor, si es number
               if(v.type == Type.NUMBER){
                if(v.tipoVar == "let"){
                  let res = v.valor + 1;
                  
                  environment.guardar(this.id, res, v.type,v.tipoVar,null,null); 
                }else{
                    let errorN = new Error_(this.line,this.column,"Semantico","La variable es tipo constante, no puede cambiar su valor");
                    errores.push(errorN);
                    throw {error: "Semantico: La variable es tipo constante, no puede cambiar su valor", linea: this.line, columna : this.column}
                }
                  
               }else{
                let errorN = new Error_(this.line,this.column,"Semantico","La variable no es de tipo number");
                errores.push(errorN);
                throw {error: "Semantico: la variable no es de tipo number", linea: this.line, columna : this.column}
               }
        }else if (this.tipo == 3){ //solo se le resta uno al valor, si es number
            if(v.type == Type.NUMBER){
                if(v.tipoVar == "let"){
                    let res = v.valor - 1;
                    environment.guardar(this.id, res, v.type,v.tipoVar,null,null); 
                  }else{
                       let errorN = new Error_(this.line,this.column,"Semantico","La variable es tipo constante, no puede cambiar su valor");
                       errores.push(errorN);
                      throw {error: "Semantico: La variable es tipo constante, no puede cambiar su valor", linea: this.line, columna : this.column}
                  }
             }else{
                let errorN = new Error_(this.line,this.column,"Semantico","La variable no es de tipo number");
                errores.push(errorN);
              throw {error: "Semantico: la variable no es de tipo number", linea: this.line, columna : this.column}
             }

        }
         

        
    }

    public getDot(ant:string){
        let dot = "";
        let nodo= "Node"+cont;
        dot+=nodo+"[label=Asignation]; \n";
        dot+= ant+"->"+nodo+'\n';
        Aumentar();
        

            

        if (this.tipo == 1){ //=
            let nodo2= "Node"+cont;
            dot+=nodo2+"[label= \"=\"]; \n";
            dot+= nodo+"->"+nodo2+'\n';
            Aumentar();

            dot+= this.value.getDot(nodo);
            return dot;
          
        }else  if (this.tipo == 2){ //++
            let nodo2= "Node"+cont;
            dot+=nodo2+"[label= "+this.id+"]; \n";
            dot+= nodo+"->"+nodo2+'\n';
            Aumentar();

            let nodo3= "Node"+cont;
            dot+=nodo3+"[label= \"++\"]; \n";
            dot+= nodo+"->"+nodo3+'\n';
            Aumentar();
            return dot;

        } if (this.tipo == 3){ //--
            let nodo1= "Node"+cont;
            dot+=nodo1+"[label= \"--\"]; \n";
            dot+= nodo+"->"+nodo1+'\n';
            Aumentar();
            return dot;

        }
    }
}