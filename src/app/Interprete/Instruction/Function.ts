import { Instruction } from "../Abstract/Instruction";
import { Expression } from "../Abstract/Expression";
import { Environment } from "../Symbol/Environment";
import {Error_} from "../Error";
import {errores} from "../Errores";
import { Retorno, Type } from "../Abstract/Retorno";
import { cont } from "../contador";
import { Aumentar} from "../contador";


export class Function extends Instruction{

    constructor(private id: string, public parametros : Array<any> | null, public tipo:number | null, public instrucciones: Array<Instruction>, line : number, column : number){
        super(line, column);
    }

    public execute(environment : Environment) {
       
        const v = environment.getFuncion(this.id);
       
        if(v != undefined || v!= null){
             let errorN = new Error_(this.line,this.column,"Semantico"," Ya existe una funcion con el mismo id");
             errores.push(errorN);
            throw {error: "Semantico: Ya existe una funcion con el mismo id", linea: this.line, columna : this.column}
        } 
       
        
        
        if (this.parametros != null){

            

            for(let i = 1; i < this.parametros.length; i = i+2){
                let no = this.parametros[i];
                 if(no  == 3){
                    
                     let errorN = new Error_(this.line,this.column,"Semantico","El parametro "+this.parametros[i-1]+" no puede ser null");
                     errores.push(errorN);  
                    throw {error: "Semantico: El parametro "+this.parametros[i-1]+" no puede ser null", linea: this.line, columna : this.column};
                 }
                 else if(no  == 4){
                    let errorN = new Error_(this.line,this.column,"Semantico","El parametro "+this.parametros[i-1]+" no puede ser array");
                    errores.push(errorN);  
                   throw {error: "Semantico: El parametro "+this.parametros[i-1]+" no puede ser array", linea: this.line, columna : this.column};
                 }
                 else if(no  == 5){
                    let errorN = new Error_(this.line,this.column,"Semantico","El parametro "+this.parametros[i-1]+" no puede ser void");
                     errores.push(errorN);  
                    throw {error: "Semantico: El parametro "+this.parametros[i-1]+" no puede ser void", linea: this.line, columna : this.column};
                }
                else if(no  == 6){
                    let errorN = new Error_(this.line,this.column,"Semantico","El parametro "+this.parametros[i-1]+" no puede ser any");
                     errores.push(errorN);  
                    throw {error: "Semantico: El parametro "+this.parametros[i-1]+" no puede ser any", linea: this.line, columna : this.column};
                    
                }
                
            }
        }


        environment.guardarFuncion(this.id, this);

       
    }

    public getDot(ant:string){


        let dot = "";
            let nodo= "Node"+cont;
            dot+=nodo+"[label=Funcion]; \n";
            dot+= ant+"->"+nodo+'\n';
            Aumentar();
    
                let nodo1= "Node"+cont;
                dot+=nodo1+"[label = "+this.id+"]; \n";
                dot+= nodo+"->"+nodo1+'\n';
                Aumentar();

                       
                

                if(this.parametros != null ){

                        let nodo3= "Node"+cont;
                        dot+=nodo3+"[label = parametros]; \n";
                        dot+= nodo+"->"+nodo3+'\n';
                        Aumentar();
                        
                    for(let i = 1; i < this.parametros.length; i = i+2){

                        let nodo2= "Node"+cont;
                        dot+=nodo2+"[label = "+this.parametros[i]+"]; \n";
                        dot+= nodo3+"->"+nodo2+'\n';
                        Aumentar();
                        
                    }


                }



                if(this.tipo != null){
                        let nodo4= "Node"+cont;
                        dot+=nodo4+"[label = \"" +this.getType(this.tipo)+"\"]; \n";
                        dot+= nodo+"->"+nodo4+'\n';
                        Aumentar();
                }

                      
                        let nodo5= "Node"+cont;
                        dot+=nodo5+"[label = \"statement\"]; \n";
                        dot+= nodo+"->"+nodo5+'\n';
                        Aumentar();


                        for(const instr of this.instrucciones){
                            try {
                                dot+= instr.getDot(nodo5);
                                               
                            } catch (error) {
                                errores.push(error);
                            }
                        }
                         
                         return dot;
    }




    getType(val:any){
        if(val == Type.NUMBER){
           return "number";
        }else if(val == Type.BOOLEAN){
            return "boolean";
        }else if(val == Type.STRING){
            return "string";
        }else if(val == Type.ANY){
            return "any";
        }else if(val == Type.VOID){
            return "void";
        }else if(val == Type.ARRAY){
            return "array";
        }
        return "any";

    }
}






