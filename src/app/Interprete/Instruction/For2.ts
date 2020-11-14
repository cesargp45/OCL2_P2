import { Instruction } from "../Abstract/Instruction";
import { Expression } from "../Abstract/Expression";
import { Environment } from "../Symbol/Environment";
import { Type } from "../Abstract/Retorno";
import {Error_} from "../Error"
import {errores} from "../Errores"
import { cont } from "../contador";
import { Aumentar} from "../contador";

export class For2 extends Instruction{
    // le puse un atributo extra
    constructor(private declaracion : string ,private dec : Instruction,private arreglo : string, private code : Instruction, line : number, column : number,private tipo: number){
        super(line, column);
    }

    public execute(env : Environment) {
        const newEnv = new Environment(env);
       
        if(this.tipo == 1){
            let decla = this.dec.execute(newEnv);
            let varia = newEnv.getVar(decla.value);  
            let arr = newEnv.getVar(this.arreglo);
            
            if(arr == null ){
                let errorN = new Error_(this.line,this.column,"Semantico","La variable " +this.arreglo+ " no existe");
                //console.log("arreglo no existe");
                errores.push(errorN);
                throw {error: "Semantico: Semantico:La variable "+this.arreglo+" no existe", linea: this.line, columna : this.column}
            } 

            if(arr.type != Type.ARRAY ){
                let errorN = new Error_(this.line,this.column,"Semantico"," La variable "+this.declaracion+" no es un arreglo para iterar");
                errores.push(errorN);
                throw {error: "Semantico: Semantico: La variable "+this.declaracion+" no es un arreglo para iterar", linea: this.line, columna : this.column}
            } 
 
            if(varia == null ){
             //console.log("variable");
             let errorN = new Error_(this.line,this.column,"Semantico","La variable "+decla.value+" no existe");
             errores.push(errorN);
             throw {error: "Semantico: Semantico:La variable "+decla.value+" no existe", linea: this.line, columna : this.column}
         } 
 
              
             if(varia.type != Type.NUMBER ){
                if(varia.type == Type.ANY){                   
                 newEnv.guardar(varia.id,varia.valor,Type.NUMBER,varia.tipoVar,varia.listaVal,varia.typeArray);
                }else{
                 let errorN = new Error_(this.line,this.column,"Semantico","La variable "+decla.value+" debe de ser any o number");
                 errores.push(errorN);
                 throw {error: "Semantico: Semantico:La variable "+decla.value+" debe de ser any o number", linea: this.line, columna : this.column}
                }
             }
               varia = newEnv.getVar(decla.value); 
                let recorrer = arr.valor.atributos;
             for (let a in recorrer) {
                 let m = parseInt(a, 10);
                 newEnv.guardar(varia.id,m,varia.type,varia.tipoVar,varia.listaVal,varia.typeArray);
                 const element = this.code.execute(newEnv );//
               if(element != null || element != undefined){
                 console.log(element);
                 if(element.type == 'Break')
                     break;
                 else if(element.type == 'Continue')
                     continue;
                 else if(element.type == 'Return')
                     return element; 
                        
              }
              arr = newEnv.getVar(this.arreglo);
              recorrer = arr.valor.atributos;
                newEnv.guardarSimGlobal();
                newEnv.guardarFunGlobal();
            }
 

       
            
        }else if(this.tipo == 2){

            let varia = env.getVar(this.declaracion);         
            let arr = env.getVar(this.arreglo);
           
            if(arr == null ){
               let errorN = new Error_(this.line,this.column,"Semantico","La variable "+this.arreglo+" no existe");
               errores.push(errorN);
               throw {error: "Semantico: Semantico:La variable"+this.arreglo+" no existe", linea: this.line, columna : this.column}
           } 

           if(arr.type != Type.ARRAY ){
            let errorN = new Error_(this.line,this.column,"Semantico"," La variable "+this.declaracion+" no es un arreglo para iterar");
            errores.push(errorN);
            throw {error: "Semantico: Semantico: La variable "+this.declaracion+" no es un arreglo para iterar", linea: this.line, columna : this.column}
          } 

           if(varia == null ){
            let errorN = new Error_(this.line,this.column,"Semantico","La variable "+this.declaracion+" no existe");
            errores.push(errorN);
            throw {error: "Semantico: Semantico:La variable"+this.declaracion+" no existe", linea: this.line, columna : this.column}
        } 

             let bandera = false;
            if(varia.type != Type.NUMBER ){
               if(varia.type == Type.ANY){
                   bandera = true;
                env.guardar(varia.id,varia.valor,Type.NUMBER,varia.tipoVar,varia.listaVal,varia.typeArray);
               }else{
                let errorN = new Error_(this.line,this.column,"Semantico","La variable "+this.declaracion+" debe de ser any o number");
                errores.push(errorN);
                throw {error: "Semantico: Semantico:La variable "+this.declaracion+" debe de ser any o number", linea: this.line, columna : this.column}
               }
            }
              varia = env.getVar(this.declaracion); 
              let recorrer = arr.valor.atributos;
            for (let a in recorrer) {
                let m = parseInt(a, 10);
               env.guardar(varia.id,m,varia.type,varia.tipoVar,varia.listaVal,varia.typeArray);
                const element = this.code.execute(env);//
              if(element != null || element != undefined){
                console.log(element);
                if(element.type == 'Break')
                    break;
                else if(element.type == 'Continue')
                    continue;
                else if(element.type == 'Return')
                    return element;    
             }
             arr = env.getVar(this.arreglo);
             recorrer = arr.valor.atributos;
             newEnv.guardarSimGlobal();
             newEnv.guardarFunGlobal();
           }

           
        }else if(this.tipo == 3){


            let decla = this.dec.execute(newEnv);
            let varia = newEnv.getVar(decla.value);  
            let arr = newEnv.getVar(this.arreglo);

           if(arr == null ){
               let errorN = new Error_(this.line,this.column,"Semantico","La variable "+this.arreglo+" no existe");
               errores.push(errorN);
               throw {error: "Semantico: Semantico:La variable "+this.arreglo+" no existe", linea: this.line, columna : this.column}
           } 

           if(arr.type != Type.ARRAY ){
            let errorN = new Error_(this.line,this.column,"Semantico"," La variable "+this.declaracion+" no es un arreglo para iterar");
            errores.push(errorN);
            throw {error: "Semantico: Semantico: La variable "+this.declaracion+" no es un arreglo para iterar", linea: this.line, columna : this.column}
          } 

           if(varia == null ){
            let errorN = new Error_(this.line,this.column,"Semantico","La variable "+decla.value+" no existe");
            errores.push(errorN);
            throw {error: "Semantico: Semantico:La variable "+decla.value+" no existe", linea: this.line, columna : this.column}
        } 

             
            if(varia.type != arr.typeArray ){
               if(varia.type == Type.ANY){
                   
                   newEnv.guardar(varia.id,varia.valor,arr.typeArray,varia.tipoVar,varia.listaVal,varia.typeArray);
               }else{
                let errorN = new Error_(this.line,this.column,"Semantico","La variable "+decla.value+" debe de ser del mismo tipo que el arreglo a recorrer o de tipo any");
                errores.push(errorN);
                throw {error: "Semantico: Semantico:La variable "+decla.value+" debe de ser del mismo tipo que el arreglo a recorrer o de tipo any", linea: this.line, columna : this.column}
               }
            }
              varia = newEnv.getVar(decla.value); 
              let recorrer = arr.valor.atributos;

            for (let a of recorrer) {
                //let m = parseInt(a, 10);
                newEnv.guardar(varia.id,a,varia.type,varia.tipoVar,varia.listaVal,varia.typeArray);
                const element = this.code.execute(newEnv);//
              if(element != null || element != undefined){
                console.log(element);
                if(element.type == 'Break')
                    break;
                else if(element.type == 'Continue')
                    continue;
                else if(element.type == 'Return')
                    return element;    
             }
             arr = newEnv.getVar(this.arreglo);
             recorrer = arr.valor.atributos;
                newEnv.guardarSimGlobal();
                newEnv.guardarFunGlobal();
           }



        }else if(this.tipo == 4){

            let varia = env.getVar(this.declaracion);         
            let arr = env.getVar(this.arreglo);
           if(arr == null ){
               let errorN = new Error_(this.line,this.column,"Semantico","La variable "+this.arreglo+" no existe");
               errores.push(errorN);
               throw {error: "Semantico: Semantico:La variable"+this.arreglo+" no existe", linea: this.line, columna : this.column}
           } 

           if(arr.type != Type.ARRAY ){
            let errorN = new Error_(this.line,this.column,"Semantico"," La variable "+this.declaracion+" no es un arreglo para iterar");
            errores.push(errorN);
            throw {error: "Semantico: Semantico: La variable "+this.declaracion+" no es un arreglo para iterar", linea: this.line, columna : this.column}
        } 

           if(varia == null ){
            let errorN = new Error_(this.line,this.column,"Semantico","La variable "+this.declaracion+" no existe");
            errores.push(errorN);
            throw {error: "Semantico: Semantico:La variable"+this.declaracion+" no existe", linea: this.line, columna : this.column}
        } 

             let bandera = false;
            if(varia.type != arr.typeArray ){
               if(varia.type == Type.ANY){
                   bandera = true;
                env.guardar(varia.id,varia.valor,arr.typeArray,varia.tipoVar,varia.listaVal,varia.typeArray);
               }else{
                let errorN = new Error_(this.line,this.column,"Semantico","La variable "+this.declaracion+" debe de ser del mismo tipo que el arreglo a recorrer o de tipo any");
                errores.push(errorN);
                throw {error: "Semantico: Semantico:La variable "+this.declaracion+" debe de ser del mismo tipo que el arreglo a recorrer o de tipo any", linea: this.line, columna : this.column}
               }
            }
              varia = env.getVar(this.declaracion); 
              let recorrer = arr.valor.atributos;
            for (let a of recorrer) {
                //let m = parseInt(a, 10);
               env.guardar(varia.id,a,varia.type,varia.tipoVar,varia.listaVal,varia.typeArray);
                const element = this.code.execute(env );//
              if(element != null || element != undefined){
                console.log(element);
                if(element.type == 'Break')
                    break;
                else if(element.type == 'Continue')
                    continue;
                else if(element.type == 'Return')
                    return element;
             }
             arr = env.getVar(this.arreglo);
             recorrer = arr.valor.atributos;

                newEnv.guardarSimGlobal();
                newEnv.guardarFunGlobal();
           }
            
        }
    }

    public getDot(ant:string){

        let dot = "";
        let nodo= "Node"+cont;
        dot+=nodo+"[label=instruccion]; \n";
        dot+= ant+"->"+nodo+'\n';
        Aumentar();

            let nodo0= "Node"+cont;
            dot+=nodo0+"[label= for]; \n";
            dot+= nodo+"->"+nodo0+'\n';
            Aumentar();

            

        if(this.tipo == 1){
            let nodo7= "Node"+cont;
            dot+=nodo7+"[label= \"(\"]; \n";
            dot+= nodo+"->"+nodo7+'\n';
            Aumentar();

            dot+= this.dec.getDot(nodo);

            let nodo2= "Node"+cont;
            dot+=nodo2+"[label= \"IN\"]; \n";
            dot+= nodo+"->"+nodo2+'\n';
            Aumentar();

            let nodo3= "Node"+cont;
            dot+=nodo3+"[label= \""+this.arreglo+"\"]; \n";
            dot+= nodo+"->"+nodo3+'\n';
            Aumentar();

            let nodo5= "Node"+cont;
            dot+=nodo5+"[label= \")\"]; \n";
            dot+= nodo+"->"+nodo5+'\n';
            Aumentar();

            let nodo9= "Node"+cont;
            dot+=nodo9+"[label= \"statement\"]; \n";
            dot+= nodo+"->"+nodo9+'\n';
            Aumentar();

            dot+= this.code.getDot(nodo9);

            return dot;

        }else if(this.tipo == 2){

            let nodo7= "Node"+cont;
            dot+=nodo7+"[label= \"(\"]; \n";
            dot+= nodo+"->"+nodo7+'\n';
            Aumentar();

            let nodo6= "Node"+cont;
            dot+=nodo6+"[label= \""+this.declaracion+"\"]; \n";
            dot+= nodo+"->"+nodo6+'\n';
            Aumentar();

            let nodo2= "Node"+cont;
            dot+=nodo2+"[label= \"IN\"]; \n";
            dot+= nodo+"->"+nodo2+'\n';
            Aumentar();

            let nodo3= "Node"+cont;
            dot+=nodo3+"[label= \""+this.arreglo+"\"]; \n";
            dot+= nodo+"->"+nodo3+'\n';
            Aumentar();

            let nodo5= "Node"+cont;
            dot+=nodo5+"[label= \")\"]; \n";
            dot+= nodo+"->"+nodo5+'\n';
            Aumentar();

            let nodo9= "Node"+cont;
            dot+=nodo9+"[label= \"statement\"]; \n";
            dot+= nodo+"->"+nodo9+'\n';
            Aumentar();

            dot+= this.code.getDot(nodo9);

            return dot;

        }else if(this.tipo == 3){

            let nodo7= "Node"+cont;
            dot+=nodo7+"[label= \"(\"]; \n";
            dot+= nodo+"->"+nodo7+'\n';
            Aumentar();

            dot+= this.dec.getDot(nodo);

            let nodo2= "Node"+cont;
            dot+=nodo2+"[label= \"OF\"]; \n";
            dot+= nodo+"->"+nodo2+'\n';
            Aumentar();

            let nodo3= "Node"+cont;
            dot+=nodo3+"[label= \""+this.arreglo+"\"]; \n";
            dot+= nodo+"->"+nodo3+'\n';
            Aumentar();

            let nodo5= "Node"+cont;
            dot+=nodo5+"[label= \")\"]; \n";
            dot+= nodo+"->"+nodo5+'\n';
            Aumentar();

            let nodo9= "Node"+cont;
            dot+=nodo9+"[label= \"statement\"]; \n";
            dot+= nodo+"->"+nodo9+'\n';
            Aumentar();

            dot+= this.code.getDot(nodo9);

            return dot;

        }else if(this.tipo == 4){

            let nodo7= "Node"+cont;
            dot+=nodo7+"[label= \"(\"]; \n";
            dot+= nodo+"->"+nodo7+'\n';
            Aumentar();

            let nodo6= "Node"+cont;
            dot+=nodo6+"[label= \""+this.declaracion+"\"]; \n";
            dot+= nodo+"->"+nodo6+'\n';
            Aumentar();

            let nodo2= "Node"+cont;
            dot+=nodo2+"[label= \"OF\"]; \n";
            dot+= nodo+"->"+nodo2+'\n';
            Aumentar();

            let nodo3= "Node"+cont;
            dot+=nodo3+"[label= \""+this.arreglo+"\"]; \n";
            dot+= nodo+"->"+nodo3+'\n';
            Aumentar();

            let nodo5= "Node"+cont;
            dot+=nodo5+"[label= \")\"]; \n";
            dot+= nodo+"->"+nodo5+'\n';
            Aumentar();

            let nodo9= "Node"+cont;
            dot+=nodo9+"[label= \"statement\"]; \n";
            dot+= nodo+"->"+nodo9+'\n';
            Aumentar();

            dot+= this.code.getDot(nodo9);

            return dot;

        }

    }
}