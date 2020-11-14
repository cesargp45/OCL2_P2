import { Instruction } from "../Abstract/Instruction";
import { Expression } from "../Abstract/Expression";
import { Environment } from "../Symbol/Environment";
import { Type } from "../Abstract/Retorno";
import {Error_} from "../Error";
import {errores} from "../Errores";
import {Case} from "./Case";
import { Condition } from '../Expression/Condition';

import { cont } from "../contador";
import { Aumentar} from "../contador";


export class Switch extends Instruction{

    constructor(private condition : Expression, private cases : Array<Case> ,line : number, column : number){
        super(line, column);
    }

    public execute(env : Environment) {
        let bandera = false;
        const condition = this.condition.execute(env);
        
        for (const c of this.cases) {
            
            let condition2;
            if(c.condition != null){
                condition2 = c.condition.execute(env);
            }else{
                condition2 = null;
            }
             
            if(c.tipo == "case"){
                if(condition2.type != condition.type || condition2 == null ){               
                    let errorN = new Error_(this.line,this.column,"Semantico","La condicion y el caso no son del mismo tipo");
                    errores.push(errorN);         
                    throw {error: "Semantico: La condicion y el caso no son del mismo tipo", linea: this.line, columna : this.column};
                }
           }
            

           if( condition2 == null || bandera == true){

            const element = c.execute(env);

            if(element != null || element != undefined){
               //console.log(element);
               if(element.type == 'Break'){
                   return;  
                  } 
                  else if(element.type == 'Return'){
                    return element;  
                 }             
               }

             bandera = true;

           }else if(condition2.value == condition.value  ){
                 
                 const element = c.execute(env);

             if(element != null || element != undefined){
                //console.log(element);
                if(element.type == 'Break'){
                    return; 
                    
                }
                else if(element.type == 'Return'){
                    return element;  
                 } 
                                  
              }              
              bandera = true;
            }

        }
        
 }

 public getDot(ant:string){

    let dot = "";
        let nodo= "Node"+cont;
        dot+=nodo+"[label=Literal]; \n";
        dot+= ant+"->"+nodo+'\n';
        Aumentar();

            let nodo1= "Node"+cont;
            dot+=nodo1+"[label= switch]; \n";
            dot+= nodo+"->"+nodo1+'\n';
            Aumentar();

            let nodo2= "Node"+cont;
            dot+=nodo2+"[label= \":\"]; \n";
            dot+= nodo+"->"+nodo2+'\n';
            Aumentar();
            dot+= this.condition.getDot(nodo);

            let nodo3= "Node"+cont;
            dot+=nodo3+"[label= \"cases\"]; \n";
            dot+= nodo+"->"+nodo3+'\n';
            Aumentar();
        
            for (const iterator of this.cases) {
                  dot+= iterator.getDot(nodo3);
            }
            



            return dot;
 }

}

