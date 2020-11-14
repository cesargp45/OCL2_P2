import { Instruction } from "../Abstract/Instruction";
import { Expression } from "../Abstract/Expression";
import { Environment } from "../Symbol/Environment";
import { Type } from "../Abstract/Retorno";
import { cont } from "../contador";
import { Aumentar} from "../contador";

export class While extends Instruction{

    constructor(private condition : Expression, private code : Instruction, line : number, column : number){
        super(line, column);
    }

    public execute(env : Environment) {
        let condition = this.condition.execute(env);
        if(condition.type != Type.BOOLEAN){
            throw {error: "La condicion no es booleana", linea: this.line, columna : this.column};
        }
        console.log(condition.value);
        while(condition.value == true){
            
            const element = this.code.execute(env);
            if(element != null || element != undefined){
                console.log(element);
                if(element.type == 'Break')
                    break;
                else if(element.type == 'Continue')
                    continue;
                else if(element.type == 'Return')
                    return element;
            }
            condition = this.condition.execute(env);
            if(condition.type != Type.BOOLEAN){
                throw {error: "La condicion no es booleana", linea: this.line, columna : this.column};
            }
        }
    }

    public getDot(ant:string){

        let dot = "";
        let nodo= "Node"+cont;
        dot+=nodo+"[label=instruccion]; \n";
        dot+= ant+"->"+nodo+'\n';
        Aumentar();

           let nodo3= "Node"+cont;
            dot+=nodo3+"[label= while]; \n";
            dot+= nodo+"->"+nodo3+'\n';
            Aumentar();

            let nodo4= "Node"+cont;
            dot+=nodo4+"[label= \"(\"]; \n";
            dot+= nodo+"->"+nodo4+'\n';
            Aumentar();
           
             dot+= this.condition.getDot(nodo);

            let nodo5= "Node"+cont;
            dot+=nodo5+"[label= \")\"]; \n";
            dot+= nodo+"->"+nodo5+'\n';
            Aumentar();


            let nodo2= "Node"+cont;
            dot+=nodo2+"[label= statement]; \n";
            dot+= nodo+"->"+nodo2+'\n';
            Aumentar();
            

            dot+= this.code.getDot(nodo2);
              
    

            return dot;
    }
}