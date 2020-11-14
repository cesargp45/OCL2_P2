import { Instruction } from "../Abstract/Instruction";
import { Expression } from "../Abstract/Expression";
import { Environment } from "../Symbol/Environment";
import { Type } from "../Abstract/Retorno";
import { cont } from "../contador";
import { Aumentar} from "../contador";

export class For extends Instruction{

    constructor(private declaracion : Expression | Instruction ,private condicion : Expression ,private asignacion : Instruction, private code : Instruction, line : number, column : number){
        super(line, column);
    }

    public execute(env : Environment) {
        const newEnv = new Environment(env);
        let dec = this.declaracion.execute(newEnv);
        let cond = this.condicion.execute(newEnv);

        if(cond.type != Type.BOOLEAN){
            throw {error: "La condicion no es booleana", linea: this.line, columna : this.column};
        }
        while(cond.value == true){
            
            const element = this.code.execute(newEnv);
             newEnv.guardarSimGlobal();
             newEnv.guardarFunGlobal();
            if(element != null || element != undefined){
                console.log(element);
                if(element.type == 'Break')
                    break;
                else if(element.type == 'Continue')
                    continue;
                else if(element.type == 'Return')
                    return element;    
            }
             let asig =this.asignacion.execute(newEnv);
            cond = this.condicion.execute(newEnv);
            if(cond.type != Type.BOOLEAN){
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
            dot+=nodo3+"[label= for]; \n";
            dot+= nodo+"->"+nodo3+'\n';
            Aumentar();

            let nodo4= "Node"+cont;
            dot+=nodo4+"[label= \"(\"]; \n";
            dot+= nodo+"->"+nodo4+'\n';
            Aumentar();
           
             dot+= this.declaracion.getDot(nodo);

             let nodo6= "Node"+cont;
            dot+=nodo6+"[label= \";\"]; \n";
            dot+= nodo+"->"+nodo6+'\n';
            Aumentar();
             
            dot+= this.condicion.getDot(nodo);

            let nodo7= "Node"+cont;
            dot+=nodo7+"[label= \";\"]; \n";
            dot+= nodo+"->"+nodo7+'\n';
            Aumentar();

            dot+= this.asignacion.getDot(nodo);

            let nodo5= "Node"+cont;
            dot+=nodo5+"[label= \")\"]; \n";
            dot+= nodo+"->"+nodo5+'\n';
            Aumentar();

            let nodo8= "Node"+cont;
            dot+=nodo8+"[label= \"statement\"]; \n";
            dot+= nodo+"->"+nodo8+'\n';
            Aumentar();

            dot+= this.code.getDot(nodo8);
            
            return dot;

    }
}