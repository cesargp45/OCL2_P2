import { Instruction } from "../Abstract/Instruction";
import { Expression } from "../Abstract/Expression";
import { Environment } from "../Symbol/Environment";
import { Type } from "../Abstract/Retorno";
import {Error_} from "../Error";
import {errores} from "../Errores";
import { cont } from "../contador";
import { Aumentar} from "../contador";


export class If extends Instruction{

    constructor(private condition : Expression, private code : Instruction, private elsSt : Instruction | null,
        line : number, column : number){
        super(line, column);
    }

    public execute(env : Environment) {
        
        const condition = this.condition.execute(env);
        if(condition.type != Type.BOOLEAN){
            
            let errorN = new Error_(this.line,this.column,"Semantico","La condicion no es booleana");
            errores.push(errorN);
            throw {error: "La condicion no es booleana", linea: this.line, columna : this.column};
        }

        if(condition.value == true){
            return this.code.execute(env);
        }
        else{
            if(this.elsSt != null){
                return this.elsSt.execute(env);
            }
            
        }
    }

    public getDot(ant:string){

        let dot = "";
        let nodo= "Node"+cont;
        dot+=nodo+"[label=instruccion]; \n";
        dot+= ant+"->"+nodo+'\n';
        Aumentar();

            let nodo1= "Node"+cont;
            dot+=nodo1+"[label= \"if\"]; \n";
            dot+= nodo+"->"+nodo1+'\n';
            Aumentar();

            let nodo2= "Node"+cont;
            dot+=nodo2+"[label= \"(\"]; \n";
            dot+= nodo+"->"+nodo2+'\n';
            Aumentar();

             dot+= this.condition.getDot(nodo);

            let nodo3= "Node"+cont;
            dot+=nodo3+"[label= \")\"]; \n";
            dot+= nodo+"->"+nodo3+'\n';
            Aumentar();

            let nodo4 = "Node"+cont;
            dot+= nodo4+"[label= \"statement\"]; \n";
            dot+= nodo+"->"+nodo4+'\n';
            Aumentar();

            dot+= this.code.getDot(nodo4);
           
            if(this.elsSt != null){
                
                let nodo1= "Node"+cont;
                dot+=nodo1+"[label= \"else\"]; \n";
                dot+= nodo+"->"+nodo1+'\n';
                Aumentar();

                dot+= this.elsSt.getDot(nodo);
            }


            return dot;
    }
}

