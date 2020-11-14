import { Expression } from "../Abstract/Expression";
import { Retorno, Type } from "../Abstract/Retorno";
import { Environment } from "../Symbol/Environment";
import { cont } from "../contador";
import { Aumentar} from "../contador";

export enum RelationalOption{
    EQUAL,
    NOTEQUAL,
    LESS,
    LESSOREQUAL,
    GREATER,
    GREATEROREQUAL
}

export class Relational extends Expression{

    constructor(private left: Expression, private right: Expression, private type : RelationalOption, line: number, column: number){
        super(line,column);
    }

    public execute(environment : Environment) : Retorno{
        const leftValue = this.left.execute(environment);
        const rightValue = this.right.execute(environment);
        if(this.type == RelationalOption.EQUAL){
            const result = leftValue.value == rightValue.value;
            return {value : result, type : Type.BOOLEAN};
        }
        else if(this.type == RelationalOption.NOTEQUAL){
            const result = leftValue.value != rightValue.value;
            return {value : result, type : Type.BOOLEAN};
        }else if(this.type == RelationalOption.LESS){
            const result = leftValue.value < rightValue.value;
            return {value : result, type : Type.BOOLEAN};
        }else if(this.type == RelationalOption.LESSOREQUAL){
            const result = leftValue.value <= rightValue.value;
            return {value : result, type : Type.BOOLEAN};
        }else if(this.type == RelationalOption.GREATER){
            const result = leftValue.value > rightValue.value;
            return {value : result, type : Type.BOOLEAN};
        }else if(this.type == RelationalOption.GREATEROREQUAL){
            const result = leftValue.value >= rightValue.value;
            return {value : result, type : Type.BOOLEAN};
        }
        return {value:0, type : Type.NUMBER}
    }

    public getDot(ant:string){

        let dot = "";
        let nodo= "Node"+cont;
        dot+=nodo+"[label=Literal]; \n";
        dot+= ant+"->"+nodo+'\n';
        Aumentar();

       
        if(this.type == RelationalOption.EQUAL){
            dot+=this.left.getDot(nodo);
            let nodo1= "Node"+cont;
            dot+=nodo1+"[label= \"==\"]; \n";
            dot+= nodo+"->"+nodo1+'\n';
            Aumentar();
            dot+= this.right.getDot(nodo);
            return dot;
        }
        else if(this.type == RelationalOption.NOTEQUAL){
            dot+=this.left.getDot(nodo);
            let nodo1= "Node"+cont;
            dot+=nodo1+"[label= \"!=\"]; \n";
            dot+= nodo+"->"+nodo1+'\n';
            Aumentar();
            dot+= this.right.getDot(nodo);
            return dot;
        }else if(this.type == RelationalOption.LESS){
            dot+=this.left.getDot(nodo);
            let nodo1= "Node"+cont;
            dot+=nodo1+"[label= \"<\"]; \n";
            dot+= nodo+"->"+nodo1+'\n';
            Aumentar();
            dot+= this.right.getDot(nodo);
            return dot;
        }else if(this.type == RelationalOption.LESSOREQUAL){
            dot+=this.left.getDot(nodo);
            let nodo1= "Node"+cont;
            dot+=nodo1+"[label= \"<=\"]; \n";
            dot+= nodo+"->"+nodo1+'\n';
            Aumentar();
            dot+= this.right.getDot(nodo);
            return dot;
        }else if(this.type == RelationalOption.GREATER){
            dot+=this.left.getDot(nodo);
            let nodo1= "Node"+cont;
            dot+=nodo1+"[label= \">\"]; \n";
            dot+= nodo+"->"+nodo1+'\n';
            Aumentar();
            dot+= this.right.getDot(nodo);
            return dot;
        }else if(this.type == RelationalOption.GREATEROREQUAL){
            dot+=this.left.getDot(nodo);
            let nodo1= "Node"+cont;
            dot+=nodo1+"[label= \">=\"]; \n";
            dot+= nodo+"->"+nodo1+'\n';
            Aumentar();
            dot+= this.right.getDot(nodo);
            return dot;
        }
        return "";



    }
}