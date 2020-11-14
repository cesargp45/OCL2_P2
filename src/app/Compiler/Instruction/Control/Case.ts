import { Instruction } from "../../Abstract/Instruction";
import { Expression } from "../../Abstract/Expression";
import { Enviorement } from "../../SymbolTable/Enviorement";
import { Types } from "../../Utils/Type";
import { Error } from "../../Utils/Error";
import { Generator } from "../../Generator/Generator";
import { cont } from "../../contador";
import { Aumentar} from "../../contador";


export class Case extends Instruction {


    constructor(public condition : Expression | null, private code: Instruction |null ,line : number, column : number,public tipo:string) {
        super(line, column);
    }

    compile(enviorement: Enviorement) : void{
        if(this.code != null){
             this.code.compile(enviorement);
        }
        else{           
            
        }
        
    }


    public getDot(ant:string){

         //import { cont } from "../../contador";
      //import { Aumentar} from "../../contador";
        let dot = "";
        let nodo= "Node"+cont;
        dot+=nodo+"[label=\""+this.tipo+"\"]; \n";
        dot+= ant+"->"+nodo+'\n';
        Aumentar();

        if(this.condition != null){

            let nodo1= "Node"+cont;
           dot+=nodo1+"[label=\"condition\"]; \n";
           dot+= ant+"->"+nodo1+'\n';
            Aumentar();

           dot+= this.condition.getDot(nodo1);

        }
        

            let nodo2= "Node"+cont;
            dot+=nodo2+"[label=\"Instruccions\"]; \n";
           dot+= ant+"->"+nodo2+'\n';
           Aumentar();

              dot+= this.code.getDot(nodo2);
            return dot;

    }
}