import { env } from "process"
import { Symbol } from "./Symbol";
import { Type } from "../Abstract/Retorno";
import { Function } from "../Instruction/Function";
import { Simbolo } from "../simbolo";
import { simbolog } from "../simboloG";
import { simboloGlobal } from "../simboloGlobal";

export class Environment{
    
    private variables : Map<string, Symbol>;
    public funciones : Map<string, Function>;

    constructor(public anterior : Environment | null){
        this.variables = new Map();
        this.funciones = new Map();
    }

    public guardar(id: string, valor: any, type: Type,tipoVar:string,listaVal:Array<any>, typeArray: Type){
        let env : Environment | null = this;
        while(env != null){
            if(env.variables.has(id)){
                env.variables.set(id, new Symbol(valor, id, type,tipoVar,listaVal,typeArray));
                return;
            }
            env = env.anterior;
        }
        this.variables.set(id, new Symbol(valor, id, type,tipoVar,listaVal,typeArray));
    }

    public guardarN(id: string, valor: any, type: Type,tipoVar:string,listaVal:Array<any>, typeArray: Type){
     
        this.variables.set(id, new Symbol(valor, id, type,tipoVar,listaVal,typeArray));
    }



    public guardarFuncion(id: string, funcion : Function){
        //TODO ver si la funcion ya existe, reportar error
        this.funciones.set(id, funcion);
    }

    public getVar(id: string) : Symbol | undefined | null{
        let env : Environment | null = this;
        while(env != null){
            if(env.variables.has(id)){
                return env.variables.get(id);
            }
            env = env.anterior;
        }
        return null;
    }   


    public getVarEnv(id: string) : Symbol | undefined | null{
        let env : Environment | null = this;       
            if(env.variables.has(id)){
                return env.variables.get(id);
            }     
        return null;
    }   

    public getFuncion(id: string) : Function | undefined{
        let env : Environment | null = this;
        while(env != null){
            if(env.funciones.has(id)){
                return env.funciones.get(id);
            }
            env = env.anterior;
        }
        return undefined;
    }


    public getGlobal() : Environment{
        let env : Environment | null = this;
        while(env.anterior != null){ //le quite el ?
            env = env.anterior;
        }
        return env;
    }


    public imprimirLista(){
        
        console.log("inicio --- \n");  
        for (var [clave, valor] of this.variables) {
            console.log(clave + " = " + valor.valor +"\n");
         }
           
          console.log("fin --- \n"); 
        
    }


    public guardarSimbolos() : Symbol | undefined | null{
        let env : Environment | null = this;
        while(env != null){
            for (var [clave, valor] of env.variables) {
                //console.log(clave + " = " + valor.valor +"\n");
                if(env.anterior == null){
                 let simboloN = new Simbolo(clave, valor.tipoVar, "Global", valor.valor,this.getType(valor.type));
                 simbolog.push(simboloN); 
                }else{
                    let simboloN = new Simbolo(clave, valor.tipoVar, "Local", valor.valor,this.getType(valor.type));
                    simbolog.push(simboloN); 
                }
             } 
            env = env.anterior;
        }
        return null;
    }   
   

    public guardarsimbolosf() : Symbol | undefined | null{
        let env : Environment | null = this;
        while(env != null){
            for (var [clave, valor] of env.funciones) {
                //console.log(clave + " = " + valor.valor +"\n");
                if(env.anterior == null){
                 let simboloN = new Simbolo(clave,"", "Global", "",this.getType2(valor.tipo));
                 simbolog.push(simboloN); 
                }
             } 
            env = env.anterior;
        }
        return null;
    } 

    public guardarSimGlobal() {
              
          for (var [clave, valor] of this.variables) {
                //console.log(clave + " = " + valor.valor +"\n");
                if(this.anterior == null){
                 let simboloN = new Simbolo(clave, valor.tipoVar, "Global", valor.valor,this.getType(valor.type));
                 simboloGlobal.push(simboloN); 
                }else{
                    let simboloN = new Simbolo(clave, valor.tipoVar, "Local", valor.valor,this.getType(valor.type));
                    simboloGlobal.push(simboloN); 
                }
             } 
                  
     
    }   
   

    public guardarFunGlobal() {
        
         if (this.anterior == null){
            for (var [clave, valor] of this.funciones) {
                //console.log(clave + " = " + valor.valor +"\n");
                if(env.anterior == null){
                 let simboloN = new Simbolo(clave,"", "Global", "",this.getType2(valor.tipo));
                 simboloGlobal.push(simboloN); 
                }
             } 
            
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


    getType2(val:any){
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
        return "sin retorno";

    }

   

}

