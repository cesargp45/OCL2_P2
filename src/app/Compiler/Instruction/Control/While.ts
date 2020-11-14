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

export class While extends Instruction {
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
        const lblWhile = generator.newLabel();
        generator.addComment('Inicia While');
        generator.addLabel(lblWhile);
        const condition = this.condition.compile(enviorement);
        if(condition.type.type == Types.BOOLEAN){
            newEnv.break = condition.falseLabel;
            newEnv.continue = lblWhile;
            generator.addLabel(condition.trueLabel);
            this.instruction.compile(newEnv);
            generator.addGoto(lblWhile);
            generator.addLabel(condition.falseLabel);
            generator.addComment('Finaliza while');
            return;
        }
        let errorN = new Error_(this.line,this.column,"Semantico",`La condicion no es booleana: ${condition.type.type}`);
        errores.push(errorN);   
        throw new Error(this.line,this.column,'Semantico','La condicion no es booleana:');
    }

     //import { cont } from "../../contador";
      //import { Aumentar} from "../../contador";

      public getDot(ant:string){

        let dot = "";
        let nodo= "Node"+cont;
        dot+=nodo+"[label=\"instruccion\"]; \n";
        dot+= ant+"->"+nodo+'\n';
        Aumentar();

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


            let nodo2= "Node"+cont;
            dot+=nodo2+"[label= \"statement\"]; \n";
            dot+= nodo+"->"+nodo2+'\n';
            Aumentar();
            

            dot+= this.instruction.getDot(nodo2);
              
    

            return dot;
    }
}