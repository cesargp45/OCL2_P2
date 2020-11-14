import { Instruction } from "../../Abstract/Instruction";
import { Expression } from "../../Abstract/Expression";
import { Enviorement } from "../../SymbolTable/Enviorement";
import { Generator } from "../../Generator/Generator";
import { Types } from "../../Utils/Type";
import { Error } from "../../Utils/Error";
import { errores } from '../../SymbolTable/Errores';
import { Error_ } from "../../SymbolTable/Error";
import { cont } from "../../contador";
import { Aumentar} from "../../contador";

export class Assignment extends Instruction {
    private target: Expression;
    private value: Expression;

    constructor(target: Expression, value: Expression, line: number, column: number) {
        super(line, column);
        this.target = target;
        this.value = value;
    }

    compile(enviorement: Enviorement): void {
        
        const target = this.target.compile(enviorement);
        const value = this.value.compile(enviorement);
          
        const generator = Generator.getInstance();
        const symbol = target.symbol;
         generator.addComment(target.getValue());
        if (!this.sameType(target.type, value.type)) {
            if(value.type.type != Types.ARRAY){
                let errorN = new Error_(this.line,this.column,"Semantico",'Tipos de dato diferentes');
                errores.push(errorN);
            throw new Error(this.line,this.column,'Semantico','Tipos de dato diferentes');
            }
        }


        if(value.type.type == Types.ARRAY){
            const temp  = generator.newTemporal(); generator.freeTemp(temp);
            const label1 =generator.newLabel();
            const label2 = generator.newLabel();
            generator.addExpression(temp,value.getValue(),'1','+');
            generator.addLabel(label1);
            generator.addIf(temp,'h',' == ',label2);
            if(target.type.dimension == value.type.dimension){
                //lena el arreglo
                target.type.type != Types.STRING && target.type.type != Types.STRUCT ? generator.addSetHeap(temp,'0') : generator.addSetHeap(temp,'-1');

            }else{
                //llena de 1
                generator.addSetHeap(temp,'-1');
            }

            generator.addExpression(temp,temp,'1','+');
            generator.addGoto(label1);
            generator.addLabel(label2);
       }

        if(symbol != null && symbol != undefined){

        
            if (symbol.isGlobal) {
                if (target.type.type == Types.BOOLEAN) {
                    const templabel = generator.newLabel();
                    generator.addLabel(value.trueLabel);
                    generator.addSetStack(symbol.position, '1');
                    generator.addGoto(templabel);
                    generator.addLabel(value.falseLabel);
                    generator.addSetStack(symbol.position, '0');
                    generator.addLabel(templabel);
                }
                else {
                    
                    generator.addSetStack(symbol.position, value.getValue());
                    
                }
            }
            else if (symbol.isHeap) {
                if (target.type.type == Types.BOOLEAN) {
                    const templabel = generator.newLabel();
                    generator.addLabel(value.trueLabel);
                    generator.addSetHeap(symbol.position, '1');
                    generator.addGoto(templabel);
                    generator.addLabel(value.falseLabel);
                    generator.addSetHeap(symbol.position, '0');
                    generator.addLabel(templabel);
                }
                else {
                    
                        generator.addSetStack(target.getValue(), value.getValue());
                        
                }
            }else {
                if (target.type.type == Types.BOOLEAN) {
                    const templabel = generator.newLabel();
                    generator.addLabel(value.trueLabel);
                    generator.addSetStack(target.getValue(), '1');
                    generator.addGoto(templabel);
                    generator.addLabel(value.falseLabel);
                    generator.addSetStack(target.getValue(), '0');
                    generator.addLabel(templabel);
                }
                else {
                    
                     generator.addSetStack(target.getValue(), value.getValue());
                        
                }
            }

        }else {
            if (target.type.type == Types.BOOLEAN) {
                const templabel = generator.newLabel();
                generator.addLabel(value.trueLabel);
                generator.addSetStack(target.getValue(), '1');
                generator.addGoto(templabel);
                generator.addLabel(value.falseLabel);
                generator.addSetStack(target.getValue(), '0');
                generator.addLabel(templabel);
            }
            else {
                
               generator.addSetStack(target.getValue(), value.getValue());  
                    
                                                                                 
            }
        }
    }

    public getDot(ant:string){
        let dot = "";
        let nodo= "Node"+cont;
        dot+=nodo+"[label=Asignation]; \n";
        dot+= ant+"->"+nodo+'\n';
        Aumentar();
        

            let nodo2= "Node"+cont;
            dot+=nodo2+"[label= \"=\"]; \n";
            dot+= nodo+"->"+nodo2+'\n';
            Aumentar();

            dot+= this.value.getDot(nodo);
            return dot;
          
      
    }
}