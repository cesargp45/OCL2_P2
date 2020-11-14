import { Instruction } from "../../Abstract/Instruction";
import { Expression } from "../../Abstract/Expression";
import { Enviorement } from "../../SymbolTable/Enviorement";
import { Types } from "../../Utils/Type";
import { Generator } from "../../Generator/Generator";
import { Error } from "../../Utils/Error";
import {Native} from "../../Generator/native";
import {Natives} from "../../Generator/Natives";
import { errores } from '../../SymbolTable/Errores';
import { Error_ } from "../../SymbolTable/Error";
import { cont } from "../../contador";
import { Aumentar} from "../../contador";

export class Print extends Instruction {
    private value: Array<Expression>;
    private isLine: boolean;

    constructor(value:Array<Expression> , isLine: boolean, line: number, column: number) {
        super(line, column);
        this.value = value;
        this.isLine = isLine;
    }

    compile(enviorement: Enviorement): void {
        //const value = this.value.compile(enviorement);
        const generator = Generator.getInstance();
        for (const c of this.value) {
            const value = c.compile(enviorement);
            switch (value.type.type) {
                case Types.INTEGER:
                    generator.addPrint('d', "(int)"+value.getValue());
                    break;
                case Types.DOUBLE:
                    generator.addPrint('f', "(float)"+value.getValue());
                    break;
                case Types.CHAR:
                    generator.addPrint('c', "(char)"+value.getValue());
                    
                    break;
                case Types.BOOLEAN:
                    console.log("true"+value.trueLabel);
                    if(value.trueLabel != undefined && value.trueLabel != null && value.trueLabel != ''){
                    generator.addComment("inicio impresion bool");
                    const templabel = generator.newLabel();
                    generator.addLabel(value.trueLabel);
                    generator.addPrintTrue();
                    generator.addGoto(templabel);
                    generator.addLabel(value.falseLabel);
                    generator.addPrintFalse();
                    generator.addLabel(templabel);
                    generator.addComment("fin impresion bool");
                    }else{
                        const lblv = generator.newLabel();
                        const lblf = generator.newLabel();
                        const templabel =generator.newLabel();
                        generator.addIf(value.getValue(), '1','==',lblv)
                        generator.addGoto(lblf);
                        generator.addLabel(lblv);
                        generator.addPrintTrue();
                        generator.addGoto(templabel);
                        generator.addLabel(lblf);
                        generator.addPrintFalse();
                        generator.addLabel(templabel);
                    }
                    break;
                case Types.STRING:
                    generator.addNextEnv(enviorement.size);
                    generator.addSetStack('p', value.getValue());
                    generator.addCall('native_print_str');
                    const existe = this.Native_exist('native_print_str');
                    if(!existe){
                        this.getNative('native_print_str');
                    }
                    generator.addAntEnv(enviorement.size);
                    break;
                case Types.NULL:
                    generator.addPrintNull();
                    break;
                default: 
                let errorN = new Error_(this.line,this.column,"Semantico",`No se puede imprimir el tipo de dato ${value.type.type}`);
            errores.push(errorN); 
                    throw new Error(this.line,this.column,'Semantico',`No se puede imprimir el tipo de dato ${value.type.type}`);
            }
            
        }
        
        generator.addPrint('c', "(char)10");
    }


    private getNative(funcion:string){
        let cod = "\n";
          if(funcion == "native_print_str") {
           cod+= "void "+funcion+" (){"+"\n";           
           const generator = Generator.getInstance();
           const temp = generator.newTemporal();
           cod+= temp + " = "+ "Stack[(int)p];\n"
            
           const lbl10 = generator.newLabel();
           cod+= lbl10+":\n";
           const lbl11 = generator.newLabel();
           cod+= "if("+temp + " == -1) goto "+lbl11+";\n"
           const lbl = generator.newLabel();
           cod+= "goto "+lbl+";\n"
           cod+= lbl11+":\n";
           cod+= "printf(\"%c\",(char)110);\n"
           cod+= "printf(\"%c\",(char)117);\n"
           cod+= "printf(\"%c\",(char)108);\n"
           cod+= "printf(\"%c\",(char)108);\n"
           const lbl2 = generator.newLabel();
           cod+= "goto "+lbl2+";\n"
          
           cod+= lbl+":\n";
           const temp2 = generator.newTemporal();
           cod+= temp2 + " = "+ "Heap[(int)"+temp+"];\n"
           cod+= temp + " = "+temp+" + 1;\n"          
           cod+= "if("+temp2 + " == -1) goto "+lbl2+";\n"
           cod+= "printf(\"%c\",(char)"+temp2+");\n"
           cod+= "goto "+lbl+";\n"          
           cod+= lbl2+":\n";
           cod+= "return;"+"\n";
           cod+= "}"+"\n";

           let nativeN = new Native(funcion,cod);
           Natives.push(nativeN);
          }               
  }
   

  public getDot(ant:string){

    let dot = "";
    let nodo= "Node"+cont;
    dot+=nodo+"[label=instruccion]; \n";
    dot+= ant+"->"+nodo+'\n';
    Aumentar();

        let nodo1= "Node"+cont;
        dot+=nodo1+"[label= \"console.log\"]; \n";
        dot+= nodo+"->"+nodo1+'\n';
        Aumentar();
     for (const iterator of this.value) {
         try {
            dot+= iterator.getDot(nodo);
         } catch (error) {
             
         }
         
     }
        
        
        return dot;

}

private Native_exist(funcion:string):boolean{
   for (const it of Natives) {
       if(it.id_func == funcion ){
           return true;
       }
   }
  return false;
}
}