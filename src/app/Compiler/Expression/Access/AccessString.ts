import { Expression } from "../../Abstract/Expression";
import { Enviorement } from "../../SymbolTable/Enviorement";
import { Retorno } from "../../Utils/Retorno";
import { Generator } from "../../Generator/Generator";
import { Error } from "../../Utils/Error";
import { Types, Type } from "../../Utils/Type";
import { Symbol } from "../../SymbolTable/Symbol";
import {Native} from "../../Generator/native";
import {Natives} from "../../Generator/Natives";

export class accesstr extends Expression {
    private id: string;
    private anterior: Expression | null;
    private metodo: number;
    private indice: Expression;

    constructor(id: string, anterior: Expression | null,metodo:number,indice:Expression, line: number, column: number) {
        super(line, column);
        this.id = id;
        this.anterior = anterior;
        this.metodo = metodo;
        this.indice = indice;
    }

    compile(enviorement: Enviorement): Retorno {
        const generator = Generator.getInstance();
        if (this.anterior == null) {
            let symbol = enviorement.getVar(this.id);
            if (symbol == null) {
                throw new Error(this.line, this.column, 'Semantico', `No existe la variable: ${this.id}`);
            }
            if(symbol.type.type != Types.STRING){
                throw new Error(this.line, this.column, 'Semantico', "La variable no es String, por lo tanto no puede aplicar el metodo");
            }

            
            if (symbol.isGlobal) {
                
                     if(this.metodo == 1){
                        const temp = generator.newTemporal();
                        generator.addGetStack(temp, symbol.position);
                        const tempAux = generator.newTemporal(); 
                        generator.freeTemp(tempAux);
                        generator.addExpression(tempAux,'p',enviorement.size + 1, '+');
                        generator.addSetStack(tempAux,temp);
                        generator.addNextEnv(enviorement.size);
                        generator.addCall('native_str_Length');
                        const bandera = this.Native_exist('native_str_Length');
                        if(bandera == false){
                           this.getNative('native_str_Length');
                        }
                        const temp2 = generator.newTemporal();
                        generator.addGetStack(temp2,'p');
                        generator.addAntEnv(enviorement.size);
                        return new Retorno(temp2, true, new Type(Types.INTEGER))            
                         //return new Retorno(temp2, true, symbol.type, symbol);
                
                    }
                    else if(this.metodo == 2){
                        if(this.indice == null){
                            throw new Error(this.line, this.column, 'Semantico', "El indice no es valido");
                        }
                         const ind = this.indice.compile(enviorement);
                        if(ind.type.type != Types.INTEGER){
                            throw new Error(this.line, this.column, 'Semantico', "El indice no es entero");
                        }
                        const temp = generator.newTemporal();
                        generator.addGetStack(temp, symbol.position);
                        const tempAux = generator.newTemporal(); 
                        generator.freeTemp(tempAux);
                        generator.addExpression(tempAux,'p',enviorement.size + 1, '+');
                        generator.addSetStack(tempAux,temp);
                        generator.addExpression(tempAux, tempAux, '1', '+');
                        generator.addSetStack(tempAux, ind.getValue());// tengo que poner el indice
                        generator.addNextEnv(enviorement.size);
                        generator.addCall('native_str_CharAt');
                        const bandera = this.Native_exist('native_str_CharAt');
                        if(bandera == false){
                           this.getNative('native_str_CharAt');
                        }
                        const temp2 = generator.newTemporal();
                        generator.addGetStack(temp2,'p');
                        generator.addAntEnv(enviorement.size);
                        return new Retorno(temp2, true, new Type(Types.STRING))            
                         //return new Retorno(temp2, true, symbol.type, symbol);
                
                    }

                    else  if(this.metodo == 3){
                        const temp = generator.newTemporal();
                        generator.addGetStack(temp, symbol.position);
                        const tempAux = generator.newTemporal(); 
                        generator.freeTemp(tempAux);
                        generator.addExpression(tempAux,'p',enviorement.size + 1, '+');
                        generator.addSetStack(tempAux,temp);
                        generator.addNextEnv(enviorement.size);
                        generator.addCall('native_str_LowerCase');
                        const bandera = this.Native_exist('native_str_LowerCase');
                        if(bandera == false){
                           this.getNative('native_str_LowerCase');
                        }
                        const temp2 = generator.newTemporal();
                        generator.addGetStack(temp2,'p');
                        generator.addAntEnv(enviorement.size);
                        return new Retorno(temp2, true, new Type(Types.STRING))            
                         //return new Retorno(temp2, true, symbol.type, symbol);               
                    }

                   else  if(this.metodo == 4){
                        const temp = generator.newTemporal();
                        generator.addGetStack(temp, symbol.position);
                        const tempAux = generator.newTemporal(); 
                        generator.freeTemp(tempAux);
                        generator.addExpression(tempAux,'p',enviorement.size + 1, '+');
                        generator.addSetStack(tempAux,temp);
                        generator.addNextEnv(enviorement.size);
                        generator.addCall('native_str_UpperCase');
                        const bandera = this.Native_exist('native_str_UpperCase');
                        if(bandera == false){
                           this.getNative('native_str_UpperCase');
                        }
                        const temp2 = generator.newTemporal();
                        generator.addGetStack(temp2,'p');
                        generator.addAntEnv(enviorement.size);
                        return new Retorno(temp2, true, new Type(Types.STRING))            
                         //return new Retorno(temp2, true, symbol.type, symbol);               
                    }


                    else if(this.metodo == 5){
                        if(this.indice == null){
                            throw new Error(this.line, this.column, 'Semantico', "El parametro no es valido");
                        }
                         const ind = this.indice.compile(enviorement);
                        if(ind.type.type != Types.STRING){
                            throw new Error(this.line, this.column, 'Semantico', "El parametro no es una cadena");
                        }
                        const temp = generator.newTemporal();
                        generator.addGetStack(temp, symbol.position);
                        const tempAux = generator.newTemporal(); 
                        generator.freeTemp(tempAux);
                        generator.addExpression(tempAux,'p',enviorement.size + 1, '+');
                        generator.addSetStack(tempAux,temp);
                        generator.addExpression(tempAux, tempAux, '1', '+');
                        generator.addSetStack(tempAux, ind.getValue());// tengo que poner el indice
                        generator.addNextEnv(enviorement.size);
                        generator.addCall('native_str_Concat');
                        const bandera = this.Native_exist('native_str_Concat');
                        if(bandera == false){
                           this.getNative('native_str_Concat');
                        }
                        const temp2 = generator.newTemporal();
                        generator.addGetStack(temp2,'p');
                        generator.addAntEnv(enviorement.size);
                        return new Retorno(temp2, true, new Type(Types.STRING))            
                         //return new Retorno(temp2, true, symbol.type, symbol);
                
                    }
            }
            else {
               /* const tempAux = generator.newTemporal(); generator.freeTemp(tempAux);
                generator.addExpression(tempAux, 'p', symbol.position, '+');
                generator.addGetStack(temp, tempAux);
                
                return new Retorno(temp, true, symbol.type, symbol);*/
                
            }
        }
        
    }


    public getDot(ant:string){
        //import { cont } from "../../contador";
      //import { Aumentar} from "../../contador";
        return " ";
      
        
      }


    private getNative(funcion:string){
        let cod = "\n";
          if (funcion == 'native_str_Length') {
            cod+= "void "+funcion+" (){"+"\n";            
            const generator = Generator.getInstance();
            const temp = generator.newTemporal();
            cod+= temp + " = "+ "Stack[(int)p + 1];\n"
            const temp3 = generator.newTemporal();
            cod+= temp3 + " = "+ "0;\n"
 
            const lbl = generator.newLabel();
            cod+= lbl+":\n";
 
            const temp2 = generator.newTemporal();
            cod+= temp2 + " = "+ "Heap[(int)"+temp+"];\n"
            cod+= temp + " = "+temp+" + 1;\n"
            const lbl2 = generator.newLabel();
            cod+= "if("+temp2 + " == -1) goto "+lbl2+";\n"
            //cod+= "printf(\"%c\",(char)"+temp2+");\n"
            cod+= temp3 + " = "+temp3+" + 1;\n"
            cod+= "goto "+lbl+";\n"          
            cod+= lbl2+":\n";
            cod+= "Stack[(int)p] = "+temp3+";\n"
            cod+= "return;"+"\n";
            cod+= "}"+"\n";
 
            let nativeN = new Native(funcion,cod);
            Natives.push(nativeN);
      }

      else if (funcion == 'native_str_CharAt') {
        cod+= "void "+funcion+" (){"+"\n";            
        const generator = Generator.getInstance();
        const temp = generator.newTemporal();
        cod+= temp + " = "+ "Stack[(int)p + 1];\n"
        const temp6 = generator.newTemporal();
        cod+= temp6+ " = "+ "Stack[(int)p + 2];\n"
        const temp3 = generator.newTemporal();
        cod+= temp3 + " = "+ "0;\n"
        const temp7 = generator.newTemporal();
        cod+= temp7 + " = "+ "h;\n"

        const lbl = generator.newLabel();
        cod+= lbl+":\n";

        const temp2 = generator.newTemporal();
        cod+= temp2 + " = "+ "Heap[(int)"+temp+"];\n"
        cod+= temp + " = "+temp+" + 1;\n"
        const lbl2 = generator.newLabel();
        cod+= "if("+temp2 + " == -1) goto "+lbl2+";\n"
        const lbl3 = generator.newLabel();
        cod+= "if("+temp3 + " == "+temp6+") goto "+lbl3+";\n"
        cod+= temp3 + " = "+temp3+" + 1;\n"
        cod+= "goto "+lbl+";\n" 
        
        cod+= lbl3+":\n"
        cod+= "Heap[(int)h] = "+temp2+";\n"
        cod+= "h = h + 1;\n"

        cod+= lbl2+":\n";
        cod+= "Heap[(int)h] = -1;\n"
        cod+= "h = h + 1;\n"
        cod+= "Stack[(int)p] = "+temp7+";\n"
        cod+= "return;"+"\n";
        cod+= "}"+"\n";

        let nativeN = new Native(funcion,cod);
        Natives.push(nativeN);
     }

     else if (funcion == 'native_str_UpperCase') {
        cod+= "void "+funcion+" (){"+"\n";            
        const generator = Generator.getInstance();
        const temp = generator.newTemporal();
        cod+= temp + " = "+ "Stack[(int)p + 1];\n"
        const temp3 = generator.newTemporal();
        cod+= temp3 + " = "+ "h;\n"

        const lbl = generator.newLabel();
        cod+= lbl+":\n";

        const temp2 = generator.newTemporal();
        cod+= temp2 + " = "+ "Heap[(int)"+temp+"];\n"
        cod+= temp + " = "+temp+" + 1;\n"
        const lbl2 = generator.newLabel();
        cod+= "if("+temp2 + " == -1) goto "+lbl2+";\n"
        const lbl3 = generator.newLabel();
        cod+= "if("+temp2 + " <= 96) goto "+lbl3+";\n"
        cod+= "if("+temp2 + " >= 123) goto "+lbl3+";\n"
        cod+= "Heap[(int)h] = (int)"+temp2+" - 32;\n"
        cod+= "h = h + 1;\n"
        cod+= "goto "+lbl+";\n"
        
        cod+= lbl3+":\n";
        cod+= "Heap[(int)h] = "+temp2+";\n"
        cod+= "h = h + 1;\n"
        cod+= "goto "+lbl+";\n"

        cod+= lbl2+":\n";
        cod+= "Heap[(int)h] = -1;\n"
        cod+= "h = h + 1;\n"
        cod+= "Stack[(int)p] = "+temp3+";\n"
        cod+= "return;"+"\n";
        cod+= "}"+"\n";

        let nativeN = new Native(funcion,cod);
        Natives.push(nativeN);
   }

   else if (funcion == 'native_str_LowerCase') {
    cod+= "void "+funcion+" (){"+"\n";            
    const generator = Generator.getInstance();
    const temp = generator.newTemporal();
    cod+= temp + " = "+ "Stack[(int)p + 1];\n"
    const temp3 = generator.newTemporal();
    cod+= temp3 + " = "+ "h;\n"

    const lbl = generator.newLabel();
    cod+= lbl+":\n";

    const temp2 = generator.newTemporal();
    cod+= temp2 + " = "+ "Heap[(int)"+temp+"];\n"
    cod+= temp + " = "+temp+" + 1;\n"
    const lbl2 = generator.newLabel();
    cod+= "if("+temp2 + " == -1) goto "+lbl2+";\n"
    const lbl3 = generator.newLabel();
    cod+= "if("+temp2 + " <= 64) goto "+lbl3+";\n"
    cod+= "if("+temp2 + " >= 91) goto "+lbl3+";\n"
    cod+= "Heap[(int)h] = (int)"+temp2+" + 32;\n"
    cod+= "h = h + 1;\n"
    cod+= "goto "+lbl+";\n"
    
    cod+= lbl3+":\n";
    cod+= "Heap[(int)h] = "+temp2+";\n"
    cod+= "h = h + 1;\n"
    cod+= "goto "+lbl+";\n"

    cod+= lbl2+":\n";
    cod+= "Heap[(int)h] = -1;\n"
    cod+= "h = h + 1;\n"
    cod+= "Stack[(int)p] = "+temp3+";\n"
    cod+= "return;"+"\n";
    cod+= "}"+"\n";

    let nativeN = new Native(funcion,cod);
    Natives.push(nativeN);
}


else if(funcion =="native_str_Concat"){

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