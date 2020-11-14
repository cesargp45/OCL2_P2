import { Expression } from "../../Abstract/Expression";
import { Enviorement } from "../../SymbolTable/Enviorement";
import { Retorno } from "../../Utils/Retorno";
import { Generator } from "../../Generator/Generator";
import { Types, Type } from "../../Utils/Type";
import { Error } from "../../Utils/Error";
import {Native} from "../../Generator/native";
import {Natives} from "../../Generator/Natives";
import { errores } from '../../SymbolTable/Errores';
import { Error_ } from "../../SymbolTable/Error";
import { cont } from "../../contador";
import { Aumentar} from "../../contador";

export class Plus extends Expression {
    private left: Expression;
    private right: Expression;

    constructor(left: Expression, right: Expression, line: number, column: number) {
        super(line, column);
        this.left = left;
        this.right = right;
    }

    public compile(enviorement: Enviorement): Retorno {
        const left = this.left.compile(enviorement);
        const right = this.right.compile(enviorement);
        const generator = Generator.getInstance();
        const temp = generator.newTemporal();
        switch (left.type.type) {
            case Types.INTEGER:

                switch (right.type.type) {                  
                    case Types.INTEGER:
                        generator.addExpression(temp, left.getValue(), right.getValue(), '+');
                        return new Retorno(temp, true, left.type);
                    case Types.DOUBLE:
                        generator.addExpression(temp, left.getValue(), right.getValue(), '+');
                        return new Retorno(temp, true,  right.type);
                    case Types.STRING:
                        const tempAux = generator.newTemporal(); 
                        generator.freeTemp(tempAux);
                        generator.addExpression(tempAux,'p',enviorement.size + 1, '+');
                        generator.addSetStack(tempAux,left.getValue());
                        generator.addExpression(tempAux,tempAux,'1','+');
                        generator.addSetStack(tempAux,right.getValue());
                        generator.addNextEnv(enviorement.size);
                        generator.addCall('native_concat_int_str');
                        const bandera = this.Native_exist('native_concat_int_str');
                        if(bandera == false){
                           this.getNative('native_concat_int_str');
                        }
                        generator.addGetStack(temp,'p');
                        generator.addAntEnv(enviorement.size);
                        return new Retorno(temp, true, new Type(Types.STRING));
                    case Types.BOOLEAN:
                        const tempAux2 = generator.newTemporal(); 
                        generator.freeTemp(tempAux2);
                        generator.addExpression(tempAux2,'p',enviorement.size + 1, '+');
                        generator.addSetStack(tempAux2,left.getValue());
                        generator.addExpression(tempAux2,tempAux2,'1','+');
                        //
                        right.getValue() ? generator.addGoto(right.trueLabel) : generator.addGoto(right.falseLabel);
                        const templabel = generator.newLabel();
                        generator.addLabel(right.trueLabel);
                        generator.addSetStack(tempAux2,'1');
                        generator.addGoto(templabel);
                        generator.addLabel(right.falseLabel);
                        generator.addSetStack(tempAux2,'0');
                        generator.addLabel(templabel);
                        //
                        //generator.addSetStack(tempAux,right.getValue());
                        generator.addNextEnv(enviorement.size);
                        generator.addCall('native_concat_int_bol');
                        const bandera2 = this.Native_exist('native_concat_int_bol');
                        if(bandera2 == false){
                            this.getNative('native_concat_int_bol');
                        }
                        generator.addGetStack(temp,'p');
                        generator.addAntEnv(enviorement.size);
                        return new Retorno(temp, true, new Type(Types.INTEGER));    
                    default:
                        break;
                }
            case Types.DOUBLE:
                switch (right.type.type) {
                    case Types.INTEGER:
                        generator.addExpression(temp, left.getValue(), right.getValue(), '+');
                        return new Retorno(temp, true, left.type);
                    case Types.DOUBLE:
                        generator.addExpression(temp, left.getValue(), right.getValue(), '+');
                        return new Retorno(temp, true, left.type);
                    case Types.STRING:
                        const tempAux = generator.newTemporal(); generator.freeTemp(tempAux);
                        generator.addExpression(tempAux,'p',enviorement.size + 1, '+');
                        generator.addSetStack(tempAux,left.getValue());
                        generator.addExpression(tempAux,tempAux,'1','+');
                        generator.addSetStack(tempAux,right.getValue());
                        generator.addNextEnv(enviorement.size);
                        generator.addCall('native_concat_dob_str');
                        const bandera = this.Native_exist('native_concat_dob_str');
                        if(bandera == false){
                           this.getNative('native_concat_dob_str');
                        }
                        generator.addGetStack(temp,'p');
                        generator.addAntEnv(enviorement.size);
                        return new Retorno(temp, true, new Type(Types.STRING));

                    case Types.BOOLEAN:
                        const tempAux2 = generator.newTemporal(); 
                        generator.freeTemp(tempAux2);
                        generator.addExpression(tempAux2,'p',enviorement.size + 1, '+');
                        generator.addSetStack(tempAux2,left.getValue());
                        generator.addExpression(tempAux2,tempAux2,'1','+');
                        //
                        right.getValue() ? generator.addGoto(right.trueLabel) : generator.addGoto(right.falseLabel);
                        const templabel = generator.newLabel();
                        generator.addLabel(right.trueLabel);
                        generator.addSetStack(tempAux2,'1');
                        generator.addGoto(templabel);
                        generator.addLabel(right.falseLabel);
                        generator.addSetStack(tempAux2,'0');
                        generator.addLabel(templabel);
                        //
                        //generator.addSetStack(tempAux,right.getValue());
                        generator.addNextEnv(enviorement.size);
                        generator.addCall('native_concat_dob_bol');
                        const bandera2 = this.Native_exist('native_concat_dob_bol');
                        if(bandera2 == false){
                            this.getNative('native_concat_dob_bol');
                        }
                        generator.addGetStack(temp,'p');
                        generator.addAntEnv(enviorement.size);
                        return new Retorno(temp, true, new Type(Types.DOUBLE));       
                    default:
                        break;
                  } 

            case Types.STRING:
                const tempAux = generator.newTemporal(); generator.freeTemp(tempAux);
                switch (right.type.type) {
                    case Types.INTEGER:
                        generator.addExpression(tempAux,'p',enviorement.size + 1, '+');
                        generator.addSetStack(tempAux,left.getValue());
                        generator.addExpression(tempAux,tempAux,'1','+');
                        generator.addSetStack(tempAux,right.getValue());
                        generator.addNextEnv(enviorement.size);
                        generator.addCall('native_concat_str_int');
                        const bandera = this.Native_exist('native_concat_str_int');
                        if(bandera == false){
                           this.getNative('native_concat_str_int');
                        }
                        generator.addGetStack(temp,'p');
                        generator.addAntEnv(enviorement.size);
                        return new Retorno(temp, true, new Type(Types.STRING));
                   
                    case Types.DOUBLE:
                        generator.addExpression(tempAux,'p',enviorement.size + 1, '+');
                        generator.addSetStack(tempAux,left.getValue());
                        generator.addExpression(tempAux,tempAux,'1','+');
                        generator.addSetStack(tempAux,right.getValue());
                        generator.addNextEnv(enviorement.size);
                        generator.addCall('native_concat_str_dob');
                        const bandera4 = this.Native_exist('native_concat_str_dob');
                        if(bandera4 == false){
                           this.getNative('native_concat_str_dob');
                        }
                        generator.addGetStack(temp,'p');
                        generator.addAntEnv(enviorement.size);
                        return new Retorno(temp, true, new Type(Types.STRING));

                    case Types.STRING:
                        generator.addExpression(tempAux,'p',enviorement.size + 1, '+');
                        generator.addSetStack(tempAux,left.getValue());
                        generator.addExpression(tempAux,tempAux,'1','+');
                        generator.addSetStack(tempAux,right.getValue());
                        generator.addNextEnv(enviorement.size);
                        generator.addCall('native_concat_str_str');
                        const bandera3 = this.Native_exist("native_concat_str_str");
                        if(bandera3 == false){
                           this.getNative("native_concat_str_str");
                        }
                        generator.addGetStack(temp,'p');
                        generator.addAntEnv(enviorement.size);
                        return new Retorno(temp, true, new Type(Types.STRING));

                    case Types.BOOLEAN:
                        generator.addExpression(tempAux,'p',enviorement.size + 1, '+');
                        right.getValue() ? generator.addGoto(right.trueLabel) : generator.addGoto(right.falseLabel);
                        const templabel = generator.newLabel();
                        generator.addLabel(right.trueLabel);
                        generator.addSetStack(tempAux,'1');
                        generator.addGoto(templabel);
                        generator.addLabel(right.falseLabel);
                        generator.addSetStack(tempAux,'0');
                        generator.addLabel(templabel);
                        generator.addExpression(tempAux,tempAux,'1','+');
                        generator.addSetStack(tempAux,left.getValue());
                        generator.addNextEnv(enviorement.size);
                        generator.addCall('native_concat_str_bol');
                        const bandera2 = this.Native_exist("native_concat_str_bol");
                        if(bandera2 == false){
                           this.getNative("native_concat_str_bol");
                        }
                        generator.addGetStack(temp,'p');
                        generator.addAntEnv(enviorement.size);
                        return new Retorno(temp, true, new Type(Types.STRING));

                    default:
                        break;
                }
            case Types.BOOLEAN:
                switch (right.type.type) {
                    case Types.STRING:                   
                        const tempAux = generator.newTemporal(); 
                        generator.freeTemp(tempAux);
                        generator.addExpression(tempAux,'p',enviorement.size + 1, '+');

                        left.getValue() ? generator.addGoto(left.trueLabel) : generator.addGoto(left.falseLabel);
                        const templabel = generator.newLabel();
                        generator.addLabel(left.trueLabel);
                        generator.addSetStack(tempAux,'1');
                        generator.addGoto(templabel);
                        generator.addLabel(left.falseLabel);
                        generator.addSetStack(tempAux,'0');
                        generator.addLabel(templabel);

                        generator.addExpression(tempAux,tempAux,'1','+');
                        generator.addSetStack(tempAux,right.getValue());
                        generator.addNextEnv(enviorement.size);
                        generator.addCall('native_concat_bol_str');
                        const bandera = this.Native_exist("native_concat_bol_str");
                        if(bandera == false){
                           this.getNative("native_concat_bol_str");
                        }
                        generator.addGetStack(temp,'p');
                        generator.addAntEnv(enviorement.size);
                        return new Retorno(temp, true, new Type(Types.STRING));
                    case Types.INTEGER:
                        const tempAux2 = generator.newTemporal(); 
                        generator.freeTemp(tempAux2);
                        generator.addExpression(tempAux2,'p',enviorement.size + 1, '+');

                        left.getValue() ? generator.addGoto(left.trueLabel) : generator.addGoto(left.falseLabel);
                        const templabel2 = generator.newLabel();
                        generator.addLabel(left.trueLabel);
                        generator.addSetStack(tempAux2,'1');
                        generator.addGoto(templabel2);
                        generator.addLabel(left.falseLabel);
                        generator.addSetStack(tempAux2,'0');
                        generator.addLabel(templabel2);

                        generator.addExpression(tempAux2,tempAux2,'1','+');
                        //
                        generator.addSetStack(tempAux2,right.getValue());
                        generator.addNextEnv(enviorement.size);
                        generator.addCall('native_concat_bol_int');
                        const bandera2 = this.Native_exist('native_concat_bol_int');
                        if(bandera2 == false){
                            this.getNative('native_concat_bol_int');
                        }
                        generator.addGetStack(temp,'p');
                        generator.addAntEnv(enviorement.size);
                        return new Retorno(temp, true, new Type(Types.INTEGER));
                    case Types.DOUBLE:
                        const tempAux3 = generator.newTemporal(); 
                        generator.freeTemp(tempAux3);
                        generator.addExpression(tempAux3,'p',enviorement.size + 1, '+');
                        left.getValue() ? generator.addGoto(left.trueLabel) : generator.addGoto(left.falseLabel);
                        const templabel3 = generator.newLabel();
                        generator.addLabel(left.trueLabel);
                        generator.addSetStack(tempAux3,'1');
                        generator.addGoto(templabel3);
                        generator.addLabel(left.falseLabel);
                        generator.addSetStack(tempAux3,'0');
                        generator.addLabel(templabel3);
                        generator.addExpression(tempAux3,tempAux3,'1','+');
                        //
                        generator.addSetStack(tempAux3,right.getValue());
                        generator.addNextEnv(enviorement.size);
                        generator.addCall('native_concat_bol_dob');
                        const bandera3 = this.Native_exist('native_concat_bol_dob');
                        if(bandera3 == false){
                            this.getNative('native_concat_bol_dob');
                        }
                        generator.addGetStack(temp,'p');
                        generator.addAntEnv(enviorement.size);
                        return new Retorno(temp, true, new Type(Types.DOUBLE));       
                    default:
                        break;
                }
        }
        let errorN = new Error_(this.line,this.column,"Semantico",`No se puede sumar ${left.type.type} + ${right.type.type}`);
        errores.push(errorN); 
        throw new Error(this.line, this.column, 'Semantico', `No se puede sumar ${left.type.type} + ${right.type.type}`);
        
    }

    public getDot(ant:string){
        //import { cont } from "../../contador";
        //import { Aumentar} from "../../contador";

        let dot = "";
        let nodo= "Node"+cont;
        dot+=nodo+"[label=Aritmetic]; \n";
        dot+= ant+"->"+nodo+'\n';
        Aumentar();
          
            dot+= this.left.getDot(nodo);
            let nodo1= "Node"+cont;
            dot+=nodo1+"[label= \" + \"]; \n";
            dot+= nodo+"->"+nodo1+'\n';
            Aumentar();
            dot+= this.right.getDot(nodo);
            return dot;     

    }



    private getNative(funcion:string){
        let cod = "\n";
       if(funcion == "native_concat_int_str") {
          
           cod+= "void "+funcion+" (){"+"\n";            
           const generator = Generator.getInstance();
           const temp3 = generator.newTemporal();
           cod+= temp3 + " = "+ "Stack[(int)p + 1];\n" //T3
           const temp4 = generator.newTemporal();
           cod+= temp4 + " = "+ "Stack[(int)p + 2];\n";//T4
           const temp6 = generator.newTemporal();
           cod+= temp6 + " = "+ "1;\n";//T6
           const temp7 = generator.newTemporal();
           cod+= temp7 + " = "+ "h;\n";//T6

           const lbl0 = generator.newLabel();
           cod+= lbl0+":\n";
           
           const lbl1 = generator.newLabel();
           cod+= "if("+temp3+" < 1) goto "+lbl1+";\n";
           const lbl2 = generator.newLabel();
           cod+= "goto "+lbl2+";\n";

           cod+= lbl2+":\n";
           cod+= temp3 + " = "+ temp3+" / 10;\n";
           cod+= temp6 + " = "+ temp6+" + 1;\n";
           cod+= "goto "+lbl0+";\n";

           cod+= lbl1+":\n";
           cod+= temp3 + " = "+ temp3+" * 10;\n";
           const temp5 = generator.newTemporal();
           cod+= temp5 + " = "+ "(int)"+temp3+";\n";//T6
           cod+= temp3 + " = "+ temp3+" - "+temp5+";\n";
           cod+= temp6 + " = "+ temp6+" - 1;\n";
           
           const lbl3 = generator.newLabel();
           cod+= "if("+temp6+" > 0) goto "+lbl3+";\n";
           const lbl4 = generator.newLabel();
           cod+= "goto "+lbl4+";\n";

           cod+= lbl3+":\n";
           const temp8 = generator.newTemporal();
           cod+= temp8 + " = "+ "(int)"+temp5+" + 48;\n";
           cod+=  "Heap[(int)h] = "+temp8+";\n";
           cod+=  "h = h + 1;\n";
           cod+= "goto "+lbl1+";\n";

           cod+= lbl4+":\n";
           const temp9 = generator.newTemporal();
           cod+=  temp9 +" = Heap[(int)"+temp4+"];\n";
           cod+= temp4 + " = "+ temp4+" + 1;\n";

           const lbl5 = generator.newLabel();
           cod+= "if("+temp9+" == -1) goto "+lbl5+";\n";
           const lbl6 = generator.newLabel();
           cod+= "goto "+lbl6+";\n";
           
           cod+= lbl6+":\n";
           cod+=  "Heap[(int)h] = "+temp9+";\n";
           cod+=  "h = h + 1;\n";
           cod+= "goto "+lbl4+";\n";

           cod+= lbl5+":\n";
           cod+=  "Heap[(int)h] = -1;\n";
           cod+=  "h = h + 1;\n";
           cod+=  "Stack[(int)p] = (int)"+temp7+";\n";

           cod+= "return;"+"\n";
           cod+= "}"+"\n";

           let nativeN = new Native(funcion,cod);
           Natives.push(nativeN);

       }else if (funcion == "native_concat_str_int"){

        cod+= "void "+funcion+" (){"+"\n";            
        const generator = Generator.getInstance();
        const temp3 = generator.newTemporal();
        cod+= temp3 + " = "+ "Stack[(int)p + 2];\n" //T3
        const temp4 = generator.newTemporal();
        cod+= temp4 + " = "+ "Stack[(int)p + 1];\n";//T4
        const temp6 = generator.newTemporal();
        cod+= temp6 + " = "+ "1;\n";//T6
        const temp7 = generator.newTemporal();
        cod+= temp7 + " = "+ "h;\n";//T6
        
        const lbl7 = generator.newLabel();
        cod+= lbl7+":\n";
        const temp9 = generator.newTemporal();
        cod+=  temp9 +" = Heap[(int)"+temp4+"];\n";
        cod+= temp4 + " = "+ temp4+" + 1;\n";

        const lbl5 = generator.newLabel();
        cod+= "if("+temp9+" == -1) goto "+lbl5+";\n";
        const lbl6 = generator.newLabel();
        cod+= "goto "+lbl6+";\n";
        
        cod+= lbl6+":\n";
        cod+=  "Heap[(int)h] = "+temp9+";\n";
        cod+=  "h = h + 1;\n";
        cod+= "goto "+lbl7+";\n";

        cod+= lbl5+":\n";
        const lbl0 = generator.newLabel();
        cod+= "goto "+lbl0+";\n";

        cod+= lbl0+":\n";       
        const lbl1 = generator.newLabel();
        cod+= "if("+temp3+" < 1) goto "+lbl1+";\n";
        const lbl2 = generator.newLabel();
        cod+= "goto "+lbl2+";\n";

        cod+= lbl2+":\n";
        cod+= temp3 + " = "+ temp3+" / 10;\n";
        cod+= temp6 + " = "+ temp6+" + 1;\n";
        cod+= "goto "+lbl0+";\n";

        cod+= lbl1+":\n";
        cod+= temp3 + " = "+ temp3+" * 10;\n";
        const temp5 = generator.newTemporal();
        cod+= temp5 + " = "+ "(int)"+temp3+";\n";//T6
        cod+= temp3 + " = "+ temp3+" - "+temp5+";\n";
        cod+= temp6 + " = "+ temp6+" - 1;\n";
        
        const lbl3 = generator.newLabel();
        cod+= "if("+temp6+" > 0) goto "+lbl3+";\n";
        const lbl4 = generator.newLabel();
        cod+= "goto "+lbl4+";\n";

        cod+= lbl3+":\n";
        const temp8 = generator.newTemporal();
        cod+= temp8 + " = "+ "(int)"+temp5+" + 48;\n";
        cod+=  "Heap[(int)h] = "+temp8+";\n";
        cod+=  "h = h + 1;\n";
        cod+= "goto "+lbl1+";\n";

        cod+= lbl4+":\n";
        cod+=  "Heap[(int)h] = -1;\n";
        cod+=  "h = h + 1;\n";
        cod+=  "Stack[(int)p] = (int)"+temp7+";\n";

        cod+= "return;"+"\n";
        cod+= "}"+"\n";

        let nativeN = new Native(funcion,cod);
        Natives.push(nativeN);
    }else if (funcion == "native_concat_bol_str"){

        cod+= "void "+funcion+" (){"+"\n";            
        const generator = Generator.getInstance();
        const temp3 = generator.newTemporal();
        cod+= temp3 + " = "+ "Stack[(int)p + 1];\n" //T3
        const temp4 = generator.newTemporal();
        cod+= temp4 + " = "+ "Stack[(int)p + 2];\n";//T4
        const temp5 = generator.newTemporal();
        cod+= temp5 + " = "+ "1;\n";//T6
        const temp6 = generator.newTemporal();
        cod+= temp6 + " = "+ "h;\n";//T6
        
        const lbl0 = generator.newLabel();
        cod+= lbl0+":\n";       
        const lbl1 = generator.newLabel();
        cod+= "if("+temp3+" == 1) goto "+lbl1+";\n";
        const lbl2 = generator.newLabel();
        cod+= "goto "+lbl2+";\n";

        cod+= lbl1+":\n";
        cod+=  "Heap[(int)h] = 116;\n";
        cod+=  "h =h + 1;\n";
        cod+=  "Heap[(int)h] = 114;\n";
        cod+=  "h =h + 1;\n";
        cod+=  "Heap[(int)h] = 117;\n";
        cod+=  "h =h + 1;\n";
        cod+=  "Heap[(int)h] = 101;\n";
        cod+=  "h =h + 1;\n";    
        const lbl3 = generator.newLabel();
        cod+= "goto "+lbl3+";\n";

        cod+= lbl2+":\n";
        cod+=  "Heap[(int)h] = 102;\n";
        cod+=  "h =h + 1;\n";
        cod+=  "Heap[(int)h] = 97;\n";
        cod+=  "h =h + 1;\n";
        cod+=  "Heap[(int)h] = 108;\n";
        cod+=  "h =h + 1;\n";
        cod+=  "Heap[(int)h] = 115;\n";
        cod+=  "h =h + 1;\n";
        cod+=  "Heap[(int)h] = 101;\n";
        cod+=  "h =h + 1;\n";    

        cod+= lbl3+":\n";
        const temp7 = generator.newTemporal();
        cod+= temp7 + " = Heap[(int)"+temp4+"];\n";
        cod+= temp4 + " = "+ temp4+" + 1;\n";
        
        const lbl4 = generator.newLabel();
        cod+= "if("+temp7+" == -1) goto "+lbl4+";\n";
        const lbl5 = generator.newLabel();
        cod+= "goto "+lbl5+";\n";

        
        cod+= lbl5+":\n";
        cod+=  "Heap[(int)h] = "+temp7+";\n";
        cod+=  "h = h + 1;\n";
        cod+= "goto "+lbl3+";\n";

        cod+= lbl4+":\n";
        cod+=  "Heap[(int)h] = -1;\n";
        cod+=  "h = h + 1;\n";
        cod+=  "Stack[(int)p] = (int)"+temp6+";\n";
        cod+= "return;"+"\n";
        cod+= "}"+"\n";

        let nativeN = new Native(funcion,cod);
        Natives.push(nativeN);
       }else if (funcion == "native_concat_str_bol"){

        cod+= "void "+funcion+" (){"+"\n";            
        const generator = Generator.getInstance();
        const temp3 = generator.newTemporal();
        cod+= temp3 + " = "+ "Stack[(int)p + 1];\n" //T3
        const temp4 = generator.newTemporal();
        cod+= temp4 + " = "+ "Stack[(int)p + 2];\n";//T4
        const temp5 = generator.newTemporal();
        cod+= temp5 + " = "+ "1;\n";//T6
        const temp6 = generator.newTemporal();
        cod+= temp6 + " = "+ "h;\n";//T6

        const lbl3 = generator.newLabel();
        cod+= lbl3+":\n";
        const temp7 = generator.newTemporal();
        cod+= temp7 + " = Heap[(int)"+temp4+"];\n";
        cod+= temp4 + " = "+ temp4+" + 1;\n";
        
        
        const lbl0 = generator.newLabel();
        cod+= "if("+temp7+" == -1) goto "+lbl0+";\n";
        const lbl5 = generator.newLabel();
        cod+= "goto "+lbl5+";\n";

        
        cod+= lbl5+":\n";
        cod+=  "Heap[(int)h] = "+temp7+";\n";
        cod+=  "h = h + 1;\n";
        cod+= "goto "+lbl3+";\n";
        
        
        
        cod+= lbl0+":\n";       
        const lbl1 = generator.newLabel();
        cod+= "if("+temp3+" == 1) goto "+lbl1+";\n";
        const lbl2 = generator.newLabel();
        cod+= "goto "+lbl2+";\n";

        cod+= lbl1+":\n";
        cod+=  "Heap[(int)h] = 116;\n";
        cod+=  "h =h + 1;\n";
        cod+=  "Heap[(int)h] = 114;\n";
        cod+=  "h =h + 1;\n";
        cod+=  "Heap[(int)h] = 117;\n";
        cod+=  "h =h + 1;\n";
        cod+=  "Heap[(int)h] = 101;\n";
        cod+=  "h =h + 1;\n"; 
        const lbl4 = generator.newLabel();   
        cod+= "goto "+lbl4+";\n";

        cod+= lbl2+":\n";
        cod+=  "Heap[(int)h] = 102;\n";
        cod+=  "h =h + 1;\n";
        cod+=  "Heap[(int)h] = 97;\n";
        cod+=  "h =h + 1;\n";
        cod+=  "Heap[(int)h] = 108;\n";
        cod+=  "h =h + 1;\n";
        cod+=  "Heap[(int)h] = 115;\n";
        cod+=  "h =h + 1;\n";
        cod+=  "Heap[(int)h] = 101;\n";
        cod+=  "h =h + 1;\n"; 
        cod+= "goto "+lbl4+";\n";   

        

        cod+= lbl4+":\n";
        cod+=  "Heap[(int)h] = -1;\n";
        cod+=  "h = h + 1;\n";
        cod+=  "Stack[(int)p] = (int)"+temp6+";\n";
        cod+= "return;"+"\n";
        cod+= "}"+"\n";

        let nativeN = new Native(funcion,cod);
        Natives.push(nativeN);

       }else if(funcion =="native_concat_int_bol"){

        cod+= "void "+funcion+" (){"+"\n";            
        const generator = Generator.getInstance();
        const temp1 = generator.newTemporal();
        cod+= temp1 + " = "+ "Stack[(int)p + 1];\n" //T3
        const temp2 = generator.newTemporal();
        cod+= temp2 + " = "+ "Stack[(int)p + 2];\n";//T4
 
        const lbl0 = generator.newLabel();
        cod+= lbl0+":\n";
        const lbl1 = generator.newLabel();
        cod+= "if("+temp2+" == 1) goto "+lbl1+";\n";
        const lbl2 = generator.newLabel();
        cod+= "goto "+lbl2+";\n";

        cod+= lbl1+":\n";
        cod+=  temp1+" = "+temp1+" + 1;\n";
        
        cod+= lbl2+":\n";
        cod+=  "Stack[(int)p] = (int)"+temp1+";\n";
        cod+= "return;"+"\n";
        cod+= "}"+"\n";
        
        let nativeN = new Native(funcion,cod);
        Natives.push(nativeN);       
       
    
    }else if(funcion =="native_concat_bol_int"){

        cod+= "void "+funcion+" (){"+"\n";            
        const generator = Generator.getInstance();
        const temp1 = generator.newTemporal();
        cod+= temp1 + " = "+ "Stack[(int)p + 2];\n" //T3
        const temp2 = generator.newTemporal();
        cod+= temp2 + " = "+ "Stack[(int)p + 1];\n";//T4
 
        const lbl0 = generator.newLabel();
        cod+= lbl0+":\n";
        const lbl1 = generator.newLabel();
        cod+= "if("+temp2+" == 1) goto "+lbl1+";\n";
        const lbl2 = generator.newLabel();
        cod+= "goto "+lbl2+";\n";

        cod+= lbl1+":\n";
        cod+=  temp1+" = "+temp1+" + 1;\n";
        
        cod+= lbl2+":\n";
        cod+=  "Stack[(int)p] = (int)"+temp1+";\n";
        cod+= "return;"+"\n";
        cod+= "}"+"\n";
        
        let nativeN = new Native(funcion,cod);
        Natives.push(nativeN);       
       
    
    }else if(funcion =="native_concat_str_str"){

        cod+= "void "+funcion+" (){"+"\n";            
        const generator = Generator.getInstance();
        const temp1 = generator.newTemporal();
        cod+= temp1 + " = "+ "Stack[(int)p + 1];\n" //T3
        const temp2 = generator.newTemporal();
        cod+= temp2 + " = "+ "Stack[(int)p + 2];\n";//T4
        const temp3 = generator.newTemporal();
        cod+= temp3 + " = h;\n";
 
        const lbl0 = generator.newLabel();
        cod+= lbl0+":\n";
        const temp4 = generator.newTemporal();
        cod+= temp4+" = Heap[(int)"+temp1+"];\n";
        cod+=  temp1+" = "+temp1+" + 1;\n";

        const lbl1 = generator.newLabel();
        cod+= "if("+temp4+" == -1) goto "+lbl1+";\n";
        const lbl2 = generator.newLabel();
        cod+= "goto "+lbl2+";\n";

        cod+= lbl2+":\n";
        cod+=  "Heap[(int)h] = "+temp4+";\n";
        cod+=  "h = h + 1;\n";
        cod+= "goto "+lbl0+";\n";


        cod+= lbl1+":\n";
        const temp5 = generator.newTemporal();
        cod+= temp5+" = Heap[(int)"+temp2+"];\n";
        cod+=  temp2+" = "+temp2+" + 1;\n";

        const lbl3 = generator.newLabel();
        cod+= "if("+temp5+" == -1) goto "+lbl3+";\n";
        const lbl4 = generator.newLabel();
        cod+= "goto "+lbl4+";\n";

        cod+= lbl4+":\n";
        cod+=  "Heap[(int)h] = "+temp5+";\n";
        cod+=  "h = h + 1;\n";
        cod+= "goto "+lbl1+";\n";
        
        cod+= lbl3+":\n";
        cod+=  "Heap[(int)h] = -1;\n";
        cod+=  "h = h + 1;\n";
        cod+=  "Stack[(int)p] = (int)"+temp3+";\n";
        cod+= "return;"+"\n";
        cod+= "}"+"\n";      
        let nativeN = new Native(funcion,cod);
        Natives.push(nativeN); 
        
        
       }else  if(funcion == "native_concat_dob_str") {
          
        cod+= "void "+funcion+" (){"+"\n";            
        const generator = Generator.getInstance();
        const temp3 = generator.newTemporal();
        cod+= temp3 + " = "+ "Stack[(int)p + 1];\n" //T3
        const temp4 = generator.newTemporal();
        cod+= temp4 + " = "+ "Stack[(int)p + 2];\n";//T4
        const temp5 = generator.newTemporal();
        cod+= temp5 + " = "+ "1;\n";//T6
        const temp6 = generator.newTemporal();
        cod+= temp6 + " = "+ "1;\n";//T6
        const temp13 = generator.newTemporal();
        cod+= temp13 + " = "+ "h;\n";//T6
        const temp8 = generator.newTemporal();
        cod+= temp8 + " = "+ temp3 +";\n";
        //const temp9 = generator.newTemporal();
        //cod+= temp9 + " = (int)"+ temp3 +";\n";

        const lbl0 = generator.newLabel();
        cod+= lbl0+":\n"; 
        cod+= temp8 + " = "+temp8+ " - (int)("+temp8+" + 1e-5);\n";
        cod+= temp8 + " = "+ temp8+" * 10;\n";
        cod+= temp6 + " = "+ temp6+" + 1;\n";
        
        const lbl10 = generator.newLabel();
        cod+= "if((int)"+temp8+" == 0) goto "+lbl10+";\n";
        cod+= "goto "+lbl0+";\n";

        cod+= lbl10+":\n"; 
        cod+= temp8 + " = "+ temp8+" * 10;\n";
        const lbl1 = generator.newLabel();
        cod+= "if((int)"+temp8+" == 0) goto "+lbl1+";\n";
        cod+= temp6 + " = "+ temp6+" + 1;\n";
        cod+= "goto "+lbl0+";\n";


        cod+= lbl1+":\n"; 
        const lbl2 = generator.newLabel();
        cod+= "if("+temp3+" < 1) goto "+lbl2+";\n";
        cod+= temp3 + " = "+ temp3+" / 10;\n";
        cod+= temp5 + " = "+ temp5+" + 1;\n";
        cod+= "goto "+lbl1+";\n";

        cod+= lbl2+":\n"; 
        cod+= temp3 + " = "+ temp3+" * 10;\n";
        const temp7 = generator.newTemporal();
        cod+= temp7 + " = (int)"+ temp3+";\n";
        cod+= temp3 + " = "+ temp3+" - "+temp7+";\n";
        cod+= temp5 + " = "+ temp5+" - 1;\n";
        const lbl3 = generator.newLabel();
        cod+= "if("+temp5+" > 0) goto "+lbl3+";\n";
        const lbl4 = generator.newLabel();
        cod+= "goto "+lbl4+";\n";

        cod+= lbl3+":\n"; 
        const temp10 = generator.newTemporal();
        cod+= temp10 + " = (int)"+ temp7+" + 48;\n";
        cod+=  "Heap[(int)h] = "+temp10+";\n";
        cod+=  "h = h + 1;\n";
        cod+= "goto "+lbl2+";\n";


        cod+= lbl4+":\n"; 
        cod+= temp3 + " = "+ temp3+" + "+temp7+";\n";
        cod+= temp3 + " = "+ temp3+" / 10;\n";
        cod+=  "Heap[(int)h] = 46;\n";
        cod+=  "h = h + 1;\n";
        const lbl5 = generator.newLabel();
        cod+= "goto "+lbl5+";\n";


        cod+= lbl5+":\n"; 
        cod+= temp3 + " = "+ temp3+" * 10;\n";
        cod+= temp7 + " = (int)("+ temp3+" + 1e-5);\n";
        cod+= temp3 + " = "+ temp3+" - "+temp7+";\n";
        cod+= temp6 + " = "+ temp6+" - 1;\n";
        const lbl6 = generator.newLabel();
        cod+= "if("+temp6+" > 1) goto "+lbl6+";\n";
        const lbl7 = generator.newLabel();
        cod+= "goto "+lbl7+";\n";

        cod+= lbl6+":\n"; 
        const temp11 = generator.newTemporal();
        cod+= temp11 + " = (int)"+ temp7+" + 48;\n";
        cod+=  "Heap[(int)h] = "+temp11+";\n";
        cod+=  "h = h + 1;\n";
        cod+= "goto "+lbl5+";\n";

        cod+= lbl7+":\n";
        const temp12 = generator.newTemporal();
        cod+=  temp12 +" = Heap[(int)"+temp4+"];\n";
        cod+= temp4 + " = "+ temp4+" + 1;\n";
        const lbl8 = generator.newLabel();
        cod+= "if("+temp12+" == -1) goto "+lbl8+";\n";
        const lbl9 = generator.newLabel();
        cod+= "goto "+lbl9+";\n";


        cod+= lbl9+":\n";
        cod+=  "Heap[(int)h] = "+temp12+";\n";
        cod+=  "h = h + 1;\n";
        cod+= "goto "+lbl7+";\n";

        cod+= lbl8+":\n";
        cod+=  "Heap[(int)h] = -1;\n";
        cod+=  "h = h + 1;\n";
        cod+=  "Stack[(int)p] = (int)"+temp13+";\n";

        cod+= "return;"+"\n";
        cod+= "}"+"\n";

  
        let nativeN = new Native(funcion,cod);
        Natives.push(nativeN);

    }


    else  if(funcion == "native_concat_str_dob") {
          
        cod+= "void "+funcion+" (){"+"\n";            
        const generator = Generator.getInstance();
        const temp3 = generator.newTemporal();
        cod+= temp3 + " = "+ "Stack[(int)p + 2];\n" //T3
        const temp4 = generator.newTemporal();
        cod+= temp4 + " = "+ "Stack[(int)p + 1];\n";//T4
        const temp5 = generator.newTemporal();
        cod+= temp5 + " = "+ "1;\n";//T6
        const temp6 = generator.newTemporal();
        cod+= temp6 + " = "+ "1;\n";//T6
        const temp13 = generator.newTemporal();
        cod+= temp13 + " = "+ "h;\n";//T6
        const temp8 = generator.newTemporal();
        cod+= temp8 + " = "+ temp3 +";\n";
        //const temp9 = generator.newTemporal();
        //cod+= temp9 + " = (int)"+ temp3 +";\n";
        const lbl7 = generator.newLabel();
        cod+= lbl7+":\n";
        const temp12 = generator.newTemporal();
        cod+=  temp12 +" = Heap[(int)"+temp4+"];\n";
        cod+= temp4 + " = "+ temp4+" + 1;\n";
        //const lbl8 = generator.newLabel();
        const lbl0 = generator.newLabel();
        cod+= "if("+temp12+" == -1) goto "+lbl0+";\n";
        const lbl9 = generator.newLabel();
        cod+= "goto "+lbl9+";\n";


        cod+= lbl9+":\n";
        cod+=  "Heap[(int)h] = "+temp12+";\n";
        cod+=  "h = h + 1;\n";
        cod+= "goto "+lbl7+";\n";



        //const lbl0 = generator.newLabel();
        cod+= lbl0+":\n"; 
        cod+= temp8 + " = "+temp8+ " - (int)("+temp8+" + 1e-5);\n";
        cod+= temp8 + " = "+ temp8+" * 10;\n";
        cod+= temp6 + " = "+ temp6+" + 1;\n";
        
        const lbl10 = generator.newLabel();
        cod+= "if((int)"+temp8+" == 0) goto "+lbl10+";\n";
        cod+= "goto "+lbl0+";\n";

        cod+= lbl10+":\n"; 
        cod+= temp8 + " = "+ temp8+" * 10;\n";
        const lbl1 = generator.newLabel();
        cod+= "if((int)"+temp8+" == 0) goto "+lbl1+";\n";
        cod+= temp6 + " = "+ temp6+" + 1;\n";
        cod+= "goto "+lbl0+";\n";


        cod+= lbl1+":\n"; 
        const lbl2 = generator.newLabel();
        cod+= "if("+temp3+" < 1) goto "+lbl2+";\n";
        cod+= temp3 + " = "+ temp3+" / 10;\n";
        cod+= temp5 + " = "+ temp5+" + 1;\n";
        cod+= "goto "+lbl1+";\n";

        cod+= lbl2+":\n"; 
        cod+= temp3 + " = "+ temp3+" * 10;\n";
        const temp7 = generator.newTemporal();
        cod+= temp7 + " = (int)"+ temp3+";\n";
        cod+= temp3 + " = "+ temp3+" - "+temp7+";\n";
        cod+= temp5 + " = "+ temp5+" - 1;\n";
        const lbl3 = generator.newLabel();
        cod+= "if("+temp5+" > 0) goto "+lbl3+";\n";
        const lbl4 = generator.newLabel();
        cod+= "goto "+lbl4+";\n";

        cod+= lbl3+":\n"; 
        const temp10 = generator.newTemporal();
        cod+= temp10 + " = (int)"+ temp7+" + 48;\n";
        cod+=  "Heap[(int)h] = "+temp10+";\n";
        cod+=  "h = h + 1;\n";
        cod+= "goto "+lbl2+";\n";


        cod+= lbl4+":\n"; 
        cod+= temp3 + " = "+ temp3+" + "+temp7+";\n";
        cod+= temp3 + " = "+ temp3+" / 10;\n";
        cod+=  "Heap[(int)h] = 46;\n";
        cod+=  "h = h + 1;\n";
        const lbl5 = generator.newLabel();
        cod+= "goto "+lbl5+";\n";


        cod+= lbl5+":\n"; 
        cod+= temp3 + " = "+ temp3+" * 10;\n";
        cod+= temp7 + " = (int)("+ temp3+" + 1e-5);\n";
        cod+= temp3 + " = "+ temp3+" - "+temp7+";\n";
        cod+= temp6 + " = "+ temp6+" - 1;\n";
        const lbl6 = generator.newLabel();
        cod+= "if("+temp6+" > 1) goto "+lbl6+";\n";
        const lbl8 = generator.newLabel();
        cod+= "goto "+lbl8+";\n";

        cod+= lbl6+":\n"; 
        const temp11 = generator.newTemporal();
        cod+= temp11 + " = (int)"+ temp7+" + 48;\n";
        cod+=  "Heap[(int)h] = "+temp11+";\n";
        cod+=  "h = h + 1;\n";
        cod+= "goto "+lbl5+";\n";

    
        cod+= lbl8+":\n";
        cod+=  "Heap[(int)h] = -1;\n";
        cod+=  "h = h + 1;\n";
        cod+=  "Stack[(int)p] = (int)"+temp13+";\n";

        cod+= "return;"+"\n";
        cod+= "}"+"\n";

  
        let nativeN = new Native(funcion,cod);
        Natives.push(nativeN);

    }

    else if(funcion =="native_concat_dob_bol"){

        cod+= "void "+funcion+" (){"+"\n";            
        const generator = Generator.getInstance();
        const temp1 = generator.newTemporal();
        cod+= temp1 + " = "+ "Stack[(int)p + 1];\n" //T3
        const temp2 = generator.newTemporal();
        cod+= temp2 + " = "+ "Stack[(int)p + 2];\n";//T4
 
        const lbl0 = generator.newLabel();
        cod+= lbl0+":\n";
        const lbl1 = generator.newLabel();
        cod+= "if("+temp2+" == 1) goto "+lbl1+";\n";
        const lbl2 = generator.newLabel();
        cod+= "goto "+lbl2+";\n";

        cod+= lbl1+":\n";
        cod+=  temp1+" = "+temp1+" + 1;\n";
        
        cod+= lbl2+":\n";
        cod+=  "Stack[(int)p] = "+temp1+";\n";
        cod+= "return;"+"\n";
        cod+= "}"+"\n";
        
        let nativeN = new Native(funcion,cod);
        Natives.push(nativeN);       
       
    
    }

    else if(funcion =="native_concat_bol_dob"){

        cod+= "void "+funcion+" (){"+"\n";            
        const generator = Generator.getInstance();
        const temp1 = generator.newTemporal();
        cod+= temp1 + " = "+ "Stack[(int)p + 2];\n" //T3
        const temp2 = generator.newTemporal();
        cod+= temp2 + " = "+ "Stack[(int)p + 1];\n";//T4
 
        const lbl0 = generator.newLabel();
        cod+= lbl0+":\n";
        const lbl1 = generator.newLabel();
        cod+= "if("+temp2+" == 1) goto "+lbl1+";\n";
        const lbl2 = generator.newLabel();
        cod+= "goto "+lbl2+";\n";

        cod+= lbl1+":\n";
        cod+=  temp1+" = "+temp1+" + 1;\n";
        
        cod+= lbl2+":\n";
        cod+=  "Stack[(int)p] = "+temp1+";\n";
        cod+= "return;"+"\n";
        cod+= "}"+"\n";
        
        let nativeN = new Native(funcion,cod);
        Natives.push(nativeN);       
       
    
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