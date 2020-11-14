import { Instruction } from "../../Abstract/Instruction";
import { Expression } from "../../Abstract/Expression";
import { Enviorement } from "../../SymbolTable/Enviorement";
import { Types } from "../../Utils/Type";
import { Error } from "../../Utils/Error";
import { Generator } from "../../Generator/Generator";
import { errores } from '../../SymbolTable/Errores';
import { Error_ } from "../../SymbolTable/Error";
import { cont } from "../../contador";
import { Aumentar} from "../../contador";

export class DoWhile extends Instruction {
    private condition: Expression;
    private instruction: Instruction;

    constructor(condition: Expression, instruction: Instruction, line: number, column: number) {
        super(line, column);
        this.condition = condition;
        this.instruction = instruction;
    }

    compile(enviorement: Enviorement) : void{
        const generator = Generator.getInstance();
        const newEnv = new Enviorement(enviorement);
        generator.addComment('Inicia DoWhile');
        newEnv.continue = this.condition.trueLabel = generator.newLabel();
        newEnv.break = this.condition.falseLabel = generator.newLabel();
        generator.addLabel(this.condition.trueLabel);
        this.instruction.compile(newEnv);
        const condition = this.condition.compile(enviorement);
        if(condition.type.type == Types.BOOLEAN){
            generator.addLabel(condition.falseLabel);
            generator.addComment('Finaliza DoWhile');
            return;
        }
        let errorN = new Error_(this.line,this.column,"Semantico",`La condicion no es booleana: ${condition.type.type}`);
        errores.push(errorN);                                                                                  // cambio
        throw new Error(this.line,this.column,'Semantico',`La condicion no es booleana: ${condition.type.type}`);
    }

     //import { cont } from "../../contador";
      //import { Aumentar} from "../../contador";

      public getDot(ant:string){

        let dot = "";
        let nodo= "Node"+cont;
        dot+=nodo+"[label=\"instruccion\"]; \n";
        dot+= ant+"->"+nodo+'\n';
        Aumentar();

            let nodo1= "Node"+cont;
            dot+=nodo1+"[label= \"do\"]; \n";
            dot+= nodo+"->"+nodo1+'\n';
            Aumentar();

            let nodo2= "Node"+cont;
            dot+=nodo2+"[label= \"statement\"]; \n";
            dot+= nodo+"->"+nodo2+'\n';
            Aumentar();
            

            dot+= this.instruction.getDot(nodo2);
              
            let nodo3= "Node"+cont;
            dot+=nodo3+"[label= \"while\"]; \n";
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


            return dot;
    }
}