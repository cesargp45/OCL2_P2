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

export class For extends Instruction {

    constructor(private declaracion : Expression | Instruction ,private condition : Expression ,
        private asignacion : Instruction,private code : Instruction, line : number, column : number) {
        super(line, column);

    }

    compile(enviorement: Enviorement) : void{
        const generator = Generator.getInstance();
        const newEnv = new Enviorement(enviorement);
        const lblinicio = generator.newLabel();
        const lblWhile = generator.newLabel();       
        generator.addComment('Inicia For');
        generator.addLabel(lblinicio);
        const declaracion = this.declaracion.compile(newEnv);
        generator.addLabel(lblWhile);
        const condition = this.condition.compile(newEnv);
        if(condition.type.type == Types.BOOLEAN){
            newEnv.break = condition.falseLabel;
            newEnv.continue = lblWhile;
            generator.addLabel(condition.trueLabel);
            this.code.compile(newEnv);
            const lblasig = generator.newLabel(); 
            generator.addLabel(lblasig);
            this.asignacion.compile(newEnv)
            generator.addGoto(lblWhile);
            generator.addLabel(condition.falseLabel);
            generator.addComment('Finaliza For');
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
             
            dot+= this.condition.getDot(nodo);

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