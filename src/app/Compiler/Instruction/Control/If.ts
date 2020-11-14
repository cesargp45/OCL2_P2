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

export class If extends Instruction {
    private condition: Expression;
    private instruction: Instruction;
    private elseI: Instruction | null;

    constructor(condition: Expression, instruction: Instruction, elseI: Instruction | null, line: number, column: number) {
        super(line, column);
        this.condition = condition;
        this.instruction = instruction;
        this.elseI = elseI;
    }

    compile(enviorement: Enviorement) : void{
        const generator = Generator.getInstance();
        generator.addComment('Inicia If');
           if (this.condition == null || this.condition == undefined){
            throw new Error(this.line,this.column,'Semantico','no existe la condicion');
           }
        const condition = this.condition.compile(enviorement);
        const newEnv = new Enviorement(enviorement);
        if(condition.type.type == Types.BOOLEAN){
            generator.addLabel(condition.trueLabel);
            this.instruction.compile(newEnv);
            if(this.elseI != null){
                const tempLbl = generator.newLabel();
                generator.addGoto(tempLbl);
                generator.addLabel(condition.falseLabel);
                this.elseI.compile(enviorement);
                generator.addLabel(tempLbl);
            }
            else{
                generator.addLabel(condition.falseLabel);
            }
            return;
        }
        let errorN = new Error_(this.line,this.column,"Semantico",`La condicion no es booleana: ${condition.type.type}`);
        errores.push(errorN);   
        throw new Error(this.line,this.column,'Semantico','La condicion no es booleana');
    }

    //import { cont } from "../../contador";
    //import { Aumentar} from "../../contador";

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

            dot+= this.instruction.getDot(nodo4);
           
            if(this.elseI != null){
                
                let nodo1= "Node"+cont;
                dot+=nodo1+"[label= \"else\"]; \n";
                dot+= nodo+"->"+nodo1+'\n';
                Aumentar();

                dot+= this.elseI.getDot(nodo);
            }


            return dot;
    }
}