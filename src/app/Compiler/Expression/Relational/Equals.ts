import { Expression } from "../../Abstract/Expression";
import { Error } from "../../Utils/Error";
import { Enviorement } from "../../SymbolTable/Enviorement";
import { Retorno } from "../../Utils/Retorno";
import { Generator } from "../../Generator/Generator";
import {Native} from "../../Generator/native";
import {Natives} from "../../Generator/Natives";
import { Type, Types } from "../../Utils/Type";
import { environment } from 'src/environments/environment';
import { errores } from '../../SymbolTable/Errores';
import { Error_ } from "../../SymbolTable/Error";
import { cont } from "../../contador";
import { Aumentar} from "../../contador";

export class Equals extends Expression {
    private left: Expression;
    private right: Expression;

    constructor(left: Expression, right: Expression, line: number, column: number) {
        super(line, column);
        this.left = left;
        this.right = right;
    }

    compile(enviorement: Enviorement): Retorno {
    
        const left = this.left.compile(enviorement);
        let right : Retorno | null = null;

        const generator = Generator.getInstance();
        switch (left.type.type) {
            case Types.INTEGER:
                right = this.right.compile(enviorement);
                switch (right.type.type) {
                    case Types.INTEGER:
                        this.trueLabel = this.trueLabel == '' ? generator.newLabel() : this.trueLabel;
                        this.falseLabel = this.falseLabel == '' ? generator.newLabel() : this.falseLabel;
                        generator.addIf(left.getValue(), right.getValue(), '==', this.trueLabel);
                        generator.addGoto(this.falseLabel);
                        const retorno = new Retorno('', false, new Type(Types.BOOLEAN));
                        retorno.trueLabel = this.trueLabel;
                        retorno.falseLabel = this.falseLabel;
                        return retorno;
                    case Types.DOUBLE:
                        this.trueLabel = this.trueLabel == '' ? generator.newLabel() : this.trueLabel;
                        this.falseLabel = this.falseLabel == '' ? generator.newLabel() : this.falseLabel;
                        generator.addIf(left.getValue(), right.getValue(), '==', this.trueLabel);
                        generator.addGoto(this.falseLabel);
                        const retorno2 = new Retorno('', false, new Type(Types.BOOLEAN));
                        retorno2.trueLabel = this.trueLabel;
                        retorno2.falseLabel = this.falseLabel;
                        return retorno2;
                    default:
                        break;
                }             
            case Types.DOUBLE:
                right = this.right.compile(enviorement);
                switch (right.type.type) {
                    case Types.INTEGER:
                        this.trueLabel = this.trueLabel == '' ? generator.newLabel() : this.trueLabel;
                        this.falseLabel = this.falseLabel == '' ? generator.newLabel() : this.falseLabel;
                        generator.addIf(left.getValue(), right.getValue(), '==', this.trueLabel);
                        generator.addGoto(this.falseLabel);
                        const retorno = new Retorno('', false, new Type(Types.BOOLEAN));
                        retorno.trueLabel = this.trueLabel;
                        retorno.falseLabel = this.falseLabel;
                        return retorno;
                    case Types.DOUBLE:
                        this.trueLabel = this.trueLabel == '' ? generator.newLabel() : this.trueLabel;
                        this.falseLabel = this.falseLabel == '' ? generator.newLabel() : this.falseLabel;
                        generator.addIf(left.getValue(), right.getValue(), '==', this.trueLabel);
                        generator.addGoto(this.falseLabel);
                        const retorno2 = new Retorno('', false, new Type(Types.BOOLEAN));
                        retorno2.trueLabel = this.trueLabel;
                        retorno2.falseLabel = this.falseLabel;
                        return retorno2;
                    default:
                        break;
                }
            case Types.BOOLEAN:
                right = this.right.compile(enviorement);
                switch (right.type.type) {
                    case Types.BOOLEAN:
                        
                       //
                        left.getValue() ? generator.addGoto(left.trueLabel) : generator.addGoto(left.falseLabel);
                        const templabel = generator.newLabel();
                        generator.addLabel(left.trueLabel);
                        const temp1 = generator.newTemporal();
                        generator.addExpression(temp1,"1","","");
                        //generator.addSetStack(tempAux2,'1');
                        generator.addGoto(templabel);
                        generator.addLabel(left.falseLabel);
                        generator.addExpression(temp1,"0","","");
                        //generator.addSetStack(tempAux2,'0');
                        generator.addLabel(templabel);
                        //
                         //
                         right.getValue() ? generator.addGoto(right.trueLabel) : generator.addGoto(right.falseLabel);
                         const templabel2 = generator.newLabel();
                         generator.addLabel(right.trueLabel);
                         const temp3 = generator.newTemporal();
                         generator.addExpression(temp3,"1","","")
                         //generator.addSetStack(tempAux2,'1');
                         generator.addGoto(templabel2);
                         generator.addLabel(right.falseLabel);
                         generator.addExpression(temp3,"0","","")
                         //generator.addSetStack(tempAux2,'0');
                         generator.addLabel(templabel2);

                          
                        this.trueLabel = this.trueLabel == '' ? generator.newLabel() : this.trueLabel;
                        this.falseLabel = this.falseLabel == '' ? generator.newLabel() : this.falseLabel;
                        generator.addIf(temp1, temp3, '==', this.trueLabel);
                        generator.addGoto(this.falseLabel);
                        const retorno2 = new Retorno('', false, new Type(Types.BOOLEAN));
                        retorno2.trueLabel = this.trueLabel;
                        retorno2.falseLabel = this.falseLabel;
                        return retorno2;
                         //

                      
                                               
                    default:
                        break;
                }               
                break;
            case Types.STRING:
                right = this.right.compile(enviorement);
                switch (right.type.type) {
                    case Types.STRING: {
                        const temp = generator.newTemporal();
                        const tempAux = generator.newTemporal(); generator.freeTemp(tempAux);
                        generator.addExpression(tempAux, 'p', enviorement.size + 1, '+');
                        generator.addSetStack(tempAux, left.getValue());
                        generator.addExpression(tempAux, tempAux, '1', '+');
                        generator.addSetStack(tempAux, right.getValue());
                        generator.addNextEnv(enviorement.size);
                        generator.addCall('native_compare_str_str');

                        const bandera = this.Native_exist('native_compare_str_str');
                         if(bandera == false){
                            this.getNative('native_compare_str_str');
                         }
                        generator.addGetStack(temp, 'p');
                        generator.addAntEnv(enviorement.size);
                        this.trueLabel = this.trueLabel == '' ? generator.newLabel() : this.trueLabel;
                        this.falseLabel = this.falseLabel == '' ? generator.newLabel() : this.falseLabel;
                        generator.addIf(temp, '1', '==', this.trueLabel);
                        generator.addGoto(this.falseLabel);
                        const retorno = new Retorno('', false, new Type(Types.BOOLEAN));
                        retorno.trueLabel = this.trueLabel;
                        retorno.falseLabel = this.falseLabel;
                        return retorno;
                    }
                    case Types.NULL: {
                        this.trueLabel = this.trueLabel == '' ? generator.newLabel() : this.trueLabel;
                        this.falseLabel = this.falseLabel == '' ? generator.newLabel() : this.falseLabel;
                        generator.addIf(left.getValue(), right.getValue(), '==', this.trueLabel);
                        generator.addGoto(this.falseLabel);
                        const retorno = new Retorno('', false, new Type(Types.BOOLEAN));
                        retorno.trueLabel = this.trueLabel;
                        retorno.falseLabel = this.falseLabel;
                        return retorno;
                    }
                    default:
                        break;
                }
            case Types.NULL:
                right = this.right.compile(enviorement);
                switch (right.type.type) {
                    case Types.STRING:
                    case Types.ARRAY:
                    case Types.STRUCT:
                    case Types.NULL:
                        this.trueLabel = this.trueLabel == '' ? generator.newLabel() : this.trueLabel;
                        this.falseLabel = this.falseLabel == '' ? generator.newLabel() : this.falseLabel;
                        generator.addIf(left.getValue(), right.getValue(), '==', this.trueLabel);
                        generator.addGoto(this.falseLabel);
                        const retorno = new Retorno('', false, new Type(Types.BOOLEAN));
                        retorno.trueLabel = this.trueLabel;
                        retorno.falseLabel = this.falseLabel;
                        return retorno;
                    default:
                        break;    
                }
            case Types.STRUCT:
                right = this.right.compile(enviorement);
                switch (right.type.type) {
                    case Types.STRUCT:                    
                    case Types.NULL:
                        this.trueLabel = this.trueLabel == '' ? generator.newLabel() : this.trueLabel;
                        this.falseLabel = this.falseLabel == '' ? generator.newLabel() : this.falseLabel;
                        generator.addIf(left.getValue(), right.getValue(), '==', this.trueLabel);
                        generator.addGoto(this.falseLabel);
                        const retorno = new Retorno('', false, new Type(Types.BOOLEAN));
                        retorno.trueLabel = this.trueLabel;
                        retorno.falseLabel = this.falseLabel;
                        return retorno;
                    default:
                        break;
                }
            case Types.ARRAY:
                right = this.right.compile(enviorement);
                switch (right.type.type) {
                    case Types.ARRAY:                    
                    case Types.NULL:
                        this.trueLabel = this.trueLabel == '' ? generator.newLabel() : this.trueLabel;
                        this.falseLabel = this.falseLabel == '' ? generator.newLabel() : this.falseLabel;
                        generator.addIf(left.getValue(), right.getValue(), '==', this.trueLabel);
                        generator.addGoto(this.falseLabel);
                        const retorno = new Retorno('', false, new Type(Types.BOOLEAN));
                        retorno.trueLabel = this.trueLabel;
                        retorno.falseLabel = this.falseLabel;
                        return retorno;
                    default:
                        break;
                }
            default:
        }     
        let errorN = new Error_(this.line,this.column,"Semantico",`No se puede ${left.type.type} == ${right.type.type}`);
                errores.push(errorN);                                                                                   //cambie
        throw new Error(this.line, this.column, 'Semantico', `No se puede ${left.type.type} == ${right.type.type}`);
    }


    public getDot(ant:string){
        //import { cont } from "../../contador";
         //import { Aumentar} from "../../contador";
        let dot = "";
        let nodo= "Node"+cont;
        dot+=nodo+"[label=relational]; \n";
        dot+= ant+"->"+nodo+'\n';
        Aumentar();
         
                dot+= this.left.getDot(nodo);
                let nodo1= "Node"+cont;
                dot+=nodo1+"[label= \" == \"]; \n";
                dot+= nodo+"->"+nodo1+'\n';
                Aumentar();
                 dot+= this.right.getDot(nodo);
                return dot;
    }

    private getNative(funcion:string){
        let cod = "\n";
      switch (funcion) {
          case "native_compare_str_str": 
           cod+= "void "+funcion+" (){"+"\n";            
           const generator = Generator.getInstance();
           const temp = generator.newTemporal();
           cod+= temp + " = "+ "Stack[(int)p + 1];\n"
           const temp2 = generator.newTemporal();
           cod+= temp2 + " = "+ "Stack[(int)p + 2];\n";
           const lbl = generator.newLabel();
           cod+= lbl+":\n";
           const temp3 = generator.newTemporal();
           cod+= temp3 + " = "+ "Heap[(int)"+temp+"];\n";
           const temp4 = generator.newTemporal();
           cod+= temp4 + " = "+ "Heap[(int)"+temp2+"];\n";
           const lbl6 = generator.newLabel();
           cod+= "if("+temp3+" == "+temp4+") goto "+lbl6+";\n";
           const lbl2 = generator.newLabel();
           cod+= "goto "+lbl2+";\n";
           cod+= lbl6+":\n";
           const lbl3 = generator.newLabel();
           cod+= "if("+temp3+" == -1) goto "+lbl3+" ;"+"\n";
           const lbl4 = generator.newLabel();
           cod+= "goto "+lbl4+";\n";
           cod+= lbl3+":\n";
           cod+= "Stack[(int)p] = 1;"+"\n";
           const lbl5 = generator.newLabel();
           cod+= "goto "+lbl5+";\n";
           cod+= lbl4+":\n";
           cod+= temp + " = "+ temp+" + 1;\n";
           cod+= temp2 + " = "+ temp2+" + 1;\n";
           cod+= "goto "+lbl+";\n";
           cod+= lbl2+":\n";
           cod+= "Stack[(int)p] = 0;"+"\n";
           cod+= "goto "+lbl5+";\n";
           cod+= lbl5+":\n";
           cod+= "return;"+"\n";
           cod+= "}"+"\n";

           let nativeN = new Native(funcion,cod);
           Natives.push(nativeN);
              break;
          case "native_pot": 
              cod+= "void "+funcion+" (){"+"\n";            
              const generator2 = Generator.getInstance();
              const tempo = generator2.newTemporal();
              cod+= tempo + " = "+ "Stack[(int)p + 1];\n"
              const tempo2 = generator2.newTemporal();
              cod+= tempo2 + " = "+ "Stack[(int)p + 2];\n";
              const tempo3 = generator2.newTemporal();
              cod+= tempo3 + " = "+ "1;\n";
              const tempo4 = generator2.newTemporal();
              cod+= tempo4 + " = "+tempo+";\n";
              const lbll = generator2.newLabel();
              cod+= "if("+tempo2+" == 0) goto "+lbll+";\n";
              const lbll2 = generator2.newLabel();
              cod+= lbll2+":\n";      
              const lbll3 = generator2.newLabel();
              cod+= "if("+tempo3+" < "+ tempo2+") goto "+lbll3+" ;"+"\n";
              const lbll4 = generator2.newLabel();
              cod+= "goto "+lbll4+";\n";
              cod+= lbll3+":\n";
              cod+= tempo + " = "+ tempo+" * "+ tempo4+";\n";
              cod+= tempo3 + " = "+ tempo3+" + 1;\n";
              cod+= "goto "+lbll2+";\n";
              cod+= lbll4+":\n";
              cod+= "Stack[(int)p] = "+tempo+";"+"\n";
              const lbll5 = generator2.newLabel();
              cod+= "goto "+lbll5+";\n";           
              cod+= lbll+":\n";
              cod+= "Stack[(int)p] = 1;"+"\n";
              cod+= lbll5+":\n";
              cod+= "return;"+"\n";
              cod+= "}"+"\n";
   
              let nativeN2 = new Native(funcion,cod);
              Natives.push(nativeN2);
                 break;               
          default:
              break;
      }

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
