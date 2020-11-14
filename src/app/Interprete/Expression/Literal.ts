import { Expression } from "../Abstract/Expression";
import { Retorno, Type } from "../Abstract/Retorno";
import { cont } from "../contador";
import { Aumentar} from "../contador";

export class Literal extends Expression{
    
    constructor(private value : any, line : number, column: number, private type : number){
        super(line, column);
    }

    public execute() : Retorno{
        if(this.type <= 1){
            return {value : Number(this.value), type : Type.NUMBER};
        }else if(this.type == 2){
             let cadena = this.value;
             //console.log("valor inicial: "+cadena);
              cadena = cadena.replace(/\\n/g,'\n'); 
              cadena = cadena.replace(/\\t/g,'\t'); 
              cadena = cadena.replace(/\\r/g,'\r'); 
              //cadena = cadena.replace(/\\"/g,'\"');                                    
              cadena = cadena.replace(/\\\\/g,'\\');

            return {value : cadena, type : Type.STRING};
        }else if(this.type == 3){
            return {value : this.value, type : Type.BOOLEAN};
        }else if(this.type == 4){
            return {value : null, type : Type.NULL};  
        }else if(this.type == 5){
            return {value : this.value, type : Type.ARRAY};       
        
        }
    }

    public getDot(ant:string){

        let dot = "";
        let nodo= "Node"+cont;
        dot+=nodo+"[label=Literal]; \n";
        dot+= ant+"->"+nodo+'\n';
        Aumentar();

            let nodo1= "Node"+cont;
            dot+=nodo1+"[label= \""+this.value+"\"]; \n";
            dot+= nodo+"->"+nodo1+'\n';
            Aumentar();
            return dot;
        
    }
}
