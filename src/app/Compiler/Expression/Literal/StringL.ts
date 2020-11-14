import { Expression } from "../../Abstract/Expression";
import { Types, Type } from "../../Utils/Type";
import { Enviorement } from "../../SymbolTable/Enviorement";
import { Retorno } from "../../Utils/Retorno";
import { Generator } from "../../Generator/Generator";
import { cont } from "../../contador";
import { Aumentar} from "../../contador";
export class StringL extends Expression {
    private type: Types;
    private value: string;

    constructor(type: Types, value: string, line: number, column: number) {
        super(line, column);
        this.type = type;
        this.value = value;
    }

    public compile(enviorement: Enviorement): Retorno {
        const generator = Generator.getInstance();
        const temp = generator.newTemporal();
        generator.addExpression(temp, 'h');
        for (let i = 0; i < this.value.length; i++) {
            if(this.value.charCodeAt(i) == 92){
                if(this.value.charCodeAt(i+1) == 110){
                    generator.addSetHeap('h',10);
                    generator.nextHeap();
                    i++;
                }else if(this.value.charCodeAt(i+1) == 114){
                    generator.addSetHeap('h',13);
                    generator.nextHeap();
                    i++;
                }else if(this.value.charCodeAt(i+1) == 116){
                    generator.addSetHeap('h',9);
                    generator.nextHeap();
                    i++;
                }else if(this.value.charCodeAt(i+1) == 92){
                    generator.addSetHeap('h',92);
                    generator.nextHeap();
                    i++;
                }else if (this.value.charCodeAt(i+1) != null || this.value.charCodeAt(i+1) != undefined){
                    generator.addSetHeap('h', this.value.charCodeAt(i));
                    generator.nextHeap();
                }              
            }else{
                generator.addSetHeap('h', this.value.charCodeAt(i));
                generator.nextHeap();
            }
            
        }
        generator.addSetHeap('h', '-1');
        generator.nextHeap();
        return new Retorno(temp, true, new Type(this.type, 'String'));
    }

    public getDot(ant:string){
        //import { cont } from "../../contador";
      //import { Aumentar} from "../../contador";

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