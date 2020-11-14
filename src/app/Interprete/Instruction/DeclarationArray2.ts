import { Instruction } from "../Abstract/Instruction";
import { Environment } from "../Symbol/Environment";
import { Expression } from "../Abstract/Expression";
import { Retorno, Type } from "../Abstract/Retorno";
//import { env } from "process";
import {Error_} from "../Error";
import {errores} from "../Errores";
import {tiposArr} from "../TiposArr";
import { Arreglo } from "../Objects/Array";
import { cont } from "../contador";
import { Aumentar} from "../contador";

export class DeclarationArray2 extends Instruction{

    private id : string;
    private value : Expression;
    private  tipo : number;
    private  tipoAsig : number;
    private  Llaves : any;

    constructor(id: string, value : Expression | null , line : number, column: number, tipo:number | null, tipoAsig : number,Llaves: any){
        super(line, column);
        this.id = id;
        this.value = value;
        this.tipo = tipo;
        this.tipoAsig = tipoAsig;
        this.Llaves = Llaves;
    }
    // tipoAsign = 2 = let
    // tipoAsign = 1 = const
    public execute(environment: Environment) {

        const v = environment.getVarEnv(this.id);
        if(v != null){
             let errorN = new Error_(this.line,this.column,"Semantico","La variable ya existe en este ambito");
             errores.push(errorN);
            throw {error: "Semantico: La variable ya existe en este abito", linea: this.line, columna : this.column}
        } 
         
       let t ;
       if(this.tipo != null){
        if(this.tipo == 0){
            t= Type.NUMBER;
        }
         else if(this.tipo == 1){
            t= Type.STRING;
         }
         else if(this.tipo == 2){
            t= Type.BOOLEAN;
         }
         else if(this.tipo == 3){
            t= Type.NULL;
           // console.log("el tipo no puede ser nulo");
             let errorN = new Error_(this.line,this.column,"Semantico","El tipo no puede ser null");
             errores.push(errorN);  
            throw {error: "Semantico: el tipo no puede ser nulo", linea: this.line, columna : this.column};
         }
         else if(this.tipo == 4){
            t= Type.ARRAY;
         }
         else if(this.tipo == 5){
            t= Type.VOID;
            let errorN = new Error_(this.line,this.column,"Semantico","El tipo no puede ser void");
             errores.push(errorN);  
            throw {error: "Semantico: el tipo no puede ser void", linea: this.line, columna : this.column};
        }
        else if(this.tipo == 6){
            t= Type.ANY;

            let errorN = new Error_(this.line,this.column,"Semantico","El tipo no puede ser any");
             errores.push(errorN);  
            throw {error: "Semantico: el tipo no puede ser any", linea: this.line, columna : this.column};
        }

       }
       
       
       let dimension = this.Llaves.length ;

       let ex;
       let t1 ;
       let t2;

        if(this.value != null){
 
          ex = this.value.execute(environment); //
 
         if(ex.type != Type.ARRAY ){//
             let errorN = new Error_(this.line,this.column,"Semantico","Se debe asignar un dato de tipo array");
              errores.push(errorN);
             throw {error: "Semantico: Se debe asignar un dato de tipo array", linea: this.line, columna : this.column}
         }


         for (const iterator of tiposArr) {
            //console.log("elem " + iterator.tipo);
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
          

          if(t2 != null){
            if(t != t2 ){
                let errorN = new Error_(this.line,this.column,"Semantico","Los tipos de datos insertados, no coinciden con el tipo de dato del arreglo");
                errores.push(errorN);         
                throw {error: "Semantico: Los tipos de datos insertados, no coinciden con el tipo de dato del arreglo", linea: this.line, columna : this.column};
               }

          }else{

            if(t1 == null && t2 == null){
               
             }

          }
 
 
      }
        

           
 
           if(this.value == null && this.tipo != null){// let id:tipo[];/let id:tipo[] = [];
              
             if(this.tipoAsig == 2){
                let arreglo = new Array;
                let newArray = new Arreglo(Type.ARRAY,arreglo,this.Llaves.length);
                 environment.guardarN(this.id, newArray, Type.ARRAY,"let",arreglo,t);
             }else{
                 let errorN = new Error_(this.line,this.column,"Semantico","La variable const debe estar inicializado");
                 errores.push(errorN);  
                 throw {error: "Semantico: const debe estar inicializada", linea: this.line, columna : this.column};
             }
 
         }else if (this.value != null && this.tipo != null){ //let id:tipo = [lista]; /const
                    
                 if(this.tipoAsig == 1){
                     environment.guardarN(this.id, ex.value, Type.ARRAY,"const",ex.value,t);
                 }else{
                     //console.log("tipooo: "+ex.value.tipo);
                     environment.guardarN(this.id, ex.value, Type.ARRAY,"let",ex.value,t);
                 }
                 
         }
       
        
    }
    public getDot(ant:string){

        let dot = "";
        let nodo= "Node"+cont;
        dot+=nodo+"[label=declaration]; \n";
        dot+= ant+"->"+nodo+'\n';
        Aumentar();

            

        if(this.value == null && this.tipo != null){// let id:tipo[];/let id:tipo[] = [];
              if(this.tipoAsig == 1){
                let nodo1= "Node"+cont;
                dot+=nodo1+"[label= const]; \n";
                dot+= nodo+"->"+nodo1+'\n';
                Aumentar();
              }else{
                let nodo1= "Node"+cont;
                dot+=nodo1+"[label= let]; \n";
                dot+= nodo+"->"+nodo1+'\n';
                Aumentar();
              }


            let nodo2= "Node"+cont;
            dot+=nodo2+"[label= "+this.id+"]; \n";
            dot+= nodo+"->"+nodo2+'\n';
            Aumentar();

            let nodo3= "Node"+cont;
            dot+=nodo3+"[label= \":\"]; \n";
            dot+= nodo+"->"+nodo3+'\n';
            Aumentar();
  
            let nodo4= "Node"+cont;
            dot+=nodo4+"[label="+this.getType(this.tipo)+"]; \n";
            dot+= nodo+"->"+nodo4+'\n';
            Aumentar();
 
           
            return dot;

        }else if (this.value != null && this.tipo != null){ //let id:tipo = [lista]; /const
            if(this.tipoAsig == 1){
                let nodo1= "Node"+cont;
                dot+=nodo1+"[label= const]; \n";
                dot+= nodo+"->"+nodo1+'\n';
                Aumentar();
              }else{
                let nodo1= "Node"+cont;
                dot+=nodo1+"[label= let]; \n";
                dot+= nodo+"->"+nodo1+'\n';
                Aumentar();
              }


            let nodo2= "Node"+cont;
            dot+=nodo2+"[label= "+this.id+"]; \n";
            dot+= nodo+"->"+nodo2+'\n';
            Aumentar();

            let nodo3= "Node"+cont;
            dot+=nodo3+"[label= \":\"]; \n";
            dot+= nodo+"->"+nodo3+'\n';
            Aumentar();
  
            let nodo4= "Node"+cont;
            dot+=nodo4+"[label="+this.getType(this.tipo)+"]; \n";
            dot+= nodo+"->"+nodo4+'\n';
            Aumentar();

            let nodo5= "Node"+cont;
            dot+=nodo5+"[label=\"=\"]; \n";
            dot+= nodo+"->"+nodo5+'\n';
            Aumentar();
            
            dot+= this.value.getDot(nodo);
           
            return dot;
               
                
        }
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