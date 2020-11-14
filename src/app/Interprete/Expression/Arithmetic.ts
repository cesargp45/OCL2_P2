import { Expression } from "../Abstract/Expression";
import { Retorno, Type } from "../Abstract/Retorno";
import { Environment } from "../Symbol/Environment";
import { env } from "process";
import {Error_} from "../Error"
import {errores} from "../Errores"
import { cont } from "../contador";
import { Aumentar} from "../contador";

export enum ArithmeticOption{
    PLUS,
    MINUS,
    TIMES,
    DIV,
    NEGATIVE,
    MOD,
    POT
}

export class Arithmetic extends Expression{

    constructor(private left: Expression, private right: Expression, private type : ArithmeticOption, line: number, column: number){
        super(line,column);
    }

    public execute(environment : Environment) : Retorno{
        const leftValue = this.left.execute(environment);
        let rightValue;
        let tipoDominante;
        if(this.right != null){
             rightValue = this.right.execute(environment);
             tipoDominante = this.tipoDominante(leftValue.type, rightValue.type);
        }     
        let result : Retorno;
        

        if(this.type == ArithmeticOption.PLUS){
            
            if(tipoDominante == Type.STRING){
                if(rightValue.value == null){
                    result = {value : (leftValue.value.toString() ), type : Type.STRING};
                }else{
                    
                        result = {value : (leftValue.value.toString() + rightValue.value.toString()), type : Type.STRING};
                             
                }             
            }else if(tipoDominante == Type.NUMBER){
                result = {value : (leftValue.value + rightValue.value), type : Type.NUMBER};
            }else{
                let errorN = new Error_(this.line,this.column,"Semantico",'No se puede operar: ' + leftValue.type + ' + ' + rightValue.type);
                errores.push(errorN); 
                throw new Error_(this.line, this.column, 'Semantico', 'No se puede operar: ' + leftValue.type + ' + ' + rightValue.type); 
            }           
        }
        else if(this.type == ArithmeticOption.MINUS){
            if(tipoDominante == Type.NUMBER){
                result = {value : (leftValue.value - rightValue.value), type : Type.NUMBER};
            }else{
                let errorN = new Error_(this.line,this.column,"Semantico",'No se puede operar: ' + leftValue.type + ' - ' + rightValue.type);
                errores.push(errorN); 
                throw new Error_(this.line, this.column, 'Semantico', 'No se puede operar: ' + leftValue.type + ' - ' + rightValue.type);
            }           
        }
        else if(this.type == ArithmeticOption.TIMES){

            if(tipoDominante == Type.NUMBER){
                result = {value : (leftValue.value * rightValue.value), type : Type.NUMBER};
            }else{
                let errorN = new Error_(this.line,this.column,"Semantico",'No se puede operar: ' + leftValue.type + ' * ' + rightValue.type);
                errores.push(errorN); 
                throw new Error_(this.line, this.column, 'Semantico', 'No se puede operar: ' + leftValue.type + ' * ' + rightValue.type);
            }  
            
        }
        else if(this.type == ArithmeticOption.DIV){

            if(tipoDominante == Type.NUMBER){
                if(rightValue.value == 0){
                    let errorN = new Error_(this.line,this.column,"Semantico","No se puede dividir entre 0");
                    errores.push(errorN); 
                    throw new Error_(this.line, this.column, "Semantico", "No se puede dividir entre 0");
                }
                result = {value : (leftValue.value / rightValue.value), type : Type.NUMBER};
            }else{
                let errorN = new Error_(this.line,this.column,"Semantico",'No se puede operar: ' + leftValue.type + ' / ' + rightValue.type);
                errores.push(errorN); 
                throw new Error_(this.line, this.column, 'Semantico', 'No se puede operar: ' + leftValue.type + ' / ' + rightValue.type);
            }  
            
            
        }
        else if(this.type == ArithmeticOption.NEGATIVE){
            if(leftValue.type== Type.NUMBER){
                result = {value : ((-1)*leftValue.value), type : Type.NUMBER};
            }else{
                let errorN = new Error_(this.line,this.column,"Semantico",'No se puede negar: ' + leftValue.type );
                errores.push(errorN); 
                throw new Error_(this.line, this.column, "Semantico", "No se puede negar un " + leftValue.type);
            }  
            
        }
        else if(this.type == ArithmeticOption.POT){
            if(tipoDominante == Type.NUMBER){
                result = {value : (leftValue.value ** rightValue.value), type : Type.NUMBER};
            }else{
                let errorN = new Error_(this.line,this.column,"Semantico",'No se puede operar: ' + leftValue.type + ' ** ' + rightValue.type);
                errores.push(errorN); 
                throw new Error_(this.line, this.column, 'Semantico', 'No se puede operar: ' + leftValue.type + ' ** ' + rightValue.type);
            }  

        }
        else if(this.type == ArithmeticOption.MOD){
            if(tipoDominante == Type.NUMBER){
                result = {value : (leftValue.value % rightValue.value), type : Type.NUMBER};
            }else{
                let errorN = new Error_(this.line,this.column,"Semantico",'No se puede operar: ' + leftValue.type + ' % ' + rightValue.type);
                errores.push(errorN); 
                throw new Error_(this.line, this.column, 'Semantico', 'No se puede operar: ' + leftValue.type + ' % ' + rightValue.type);
            }             
        }
        return result;
    }
    public getDot(ant:string){

        let dot = "";
        let nodo= "Node"+cont;
        dot+=nodo+"[label=Aritmetic]; \n";
        dot+= ant+"->"+nodo+'\n';
        Aumentar();
          

        

        if(this.type == ArithmeticOption.PLUS){
            dot+= this.left.getDot(nodo);

            let nodo1= "Node"+cont;
            dot+=nodo1+"[label= \" + \"]; \n";
            dot+= nodo+"->"+nodo1+'\n';
            Aumentar();

            dot+= this.right.getDot(nodo);
            return dot;
                    
                               
        }
        else if(this.type == ArithmeticOption.MINUS){

            dot+= this.left.getDot(nodo);

            let nodo1= "Node"+cont;
            dot+=nodo1+"[label= \" - \"]; \n";
            dot+= nodo+"->"+nodo1+'\n';
            Aumentar();

            dot+= this.right.getDot(nodo);
            return dot;
                  
        }
        else if(this.type == ArithmeticOption.TIMES){

            dot+= this.left.getDot(nodo);

            let nodo1= "Node"+cont;
            dot+=nodo1+"[label= \" * \"]; \n";
            dot+= nodo+"->"+nodo1+'\n';
            Aumentar();

            dot+=this.right.getDot(nodo);
            return dot;

        }
        else if(this.type == ArithmeticOption.DIV){

            dot+= this.left.getDot(nodo);

            let nodo1= "Node"+cont;
            dot+=nodo1+"[label= \" / \"]; \n";
            dot+= nodo+"->"+nodo1+'\n';
            Aumentar();

            dot+= this.right.getDot(nodo);
            return dot;
           
        }
        else if(this.type == ArithmeticOption.NEGATIVE){
            let nodo1= "Node"+cont;
            dot+=nodo1+"[label= \" - \"]; \n";
            dot+= nodo+"->"+nodo1+'\n';
            Aumentar();
            dot+=this.left.getDot(nodo);
            return dot;

            

           
            
        }
        else if(this.type == ArithmeticOption.POT){
            
            dot+= this.left.getDot(nodo);

            let nodo1= "Node"+cont;
            dot+=nodo1+"[label= \" ** \"]; \n";
            dot+= nodo+"->"+nodo1+'\n';
            Aumentar();

            dot+= this.right.getDot(nodo);
            return dot;
            
        }
        else if(this.type == ArithmeticOption.MOD){

            
            dot+= this.left.getDot(nodo);

            let nodo1= "Node"+cont;
            dot+=nodo1+"[label= \" % \"]; \n";
            dot+= nodo+"->"+nodo1+'\n';
            Aumentar();

            dot+= this.right.getDot(nodo);
            return dot;
                      
        }



    }
}

/*
    3 + 5 * "hola mundo";
    Error
*/