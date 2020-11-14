import { Environment } from "../Symbol/Environment";
import { Expression } from "../Abstract/Expression";
import { Retorno, Type } from "../Abstract/Retorno";
import { Arreglo } from "../Objects/Array";
import { Error_ } from "../Error";
import { errores } from "../Errores";
import { tiposArr } from "../TiposArr";
import { cont } from "../contador";
import { Aumentar} from "../contador";




export class AccesoArray extends Expression {

    constructor(private id: string, private index: Expression, private anterior: any | null, line: number, column: number, public Iguala: any,public len :number|null) {
        super(line, column);
    }


    public execute(environment: Environment) {

        if (this.anterior == null) {

            const vari = environment.getVar(this.id); //?.valor as Arreglo;//en vez de este casteo se mira si es arrelo o no
            //console.log("este es el if: "+this.id);
            if (vari == null) {
                let errorN = new Error_(this.line, this.column, "Semantico", "La variable no existeeee");
                errores.push(errorN);
                throw { error: "Semantico:La variable no existeeee", linea: this.line, columna: this.column };
            }
            if(this.Iguala == null){

            if (vari.type != Type.ARRAY) {
                let errorN = new Error_(this.line, this.column, "Semantico", "No puede acceder a la variable ya que no es un arreglo");
                errores.push(errorN);
                throw { error: "Semantico: No puede acceder a la variable ya que no es un arreglo", linea: this.line, columna: this.column };
            }
        }

            const array = vari.valor;
            const indice = this.index.execute(environment);
            //const value = array.getAtributo(Number(indice.value));

            if (this.Iguala == null) {
               if(this.len == 1){
                    try {
                        const value = array.getAtributo(Number(indice.value));                 
                        const value2 = value.length();
                        return { value: value2, type:Type.NUMBER};
                        
                    } catch (error) {
                       // console.log(error);
                        
                    }

                    return{value:0,type:Type.NUMBER}
                   
                }else{
                    const value = array.getAtributo(Number(indice.value));
                    return { value: value, type: array.tipo, typeArray: vari.typeArray };
                }
                
            } else {

                if (this.Iguala.type == Type.ARRAY) {
                    let t1;
                    let t2;
                    for (const iterator of tiposArr) {
                        t1 = iterator.tipo
                        if (t1 != Type.ARRAY) {
                            if (t2 == null || t1 == t2) {
                                t2 = t1;
                            } else {
                                while (tiposArr.length > 0) {
                                    tiposArr.pop();
                                }
                                let errorN = new Error_(this.line, this.column, "Semantico", "Los arreglos tienen que ser de un mismo tipo de dato");
                                errores.push(errorN);
                                throw { error: "Semantico: Los arrreglos tienen que ser de un mismo tipo de dato", linea: this.line, columna: this.column };
                            }
                        }

                    }

                    while (tiposArr.length > 0) {
                        tiposArr.pop();
                    }
                    if (t2 != null) {

                        if (vari.typeArray != t2) { // quite el t2 == null
                            let errorN = new Error_(this.line, this.column, "Semantico", "Los tipos de datos insertados, no coinciden con el tipo de dato del arreglo");
                            errores.push(errorN);
                            throw { error: "Semantico: Los tipos de datos insertados, no coinciden con el tipo de dato del arreglo", linea: this.line, columna: this.column };
                        }
                    }


                } else {
                    if (this.Iguala.type != vari.typeArray) {
                        let errorN = new Error_(this.line, this.column, "Semantico", "Los tipos de datos insertados, no coinciden con el tipo de dato del arreglo");
                        errores.push(errorN);
                        throw { error: "Semantico: Los tipos de datos insertados, no coinciden con el tipo de dato del arreglo", linea: this.line, columna: this.column };
                    }
                }
           

                array.setValor(Number(indice.value), this.Iguala.value);
                if(array.tipo == undefined){
                   array.tipo = this.Iguala.type;
                }

            }

            //return {value : value, type: array.tipo};


        }
        else {


            const anterior = this.anterior.execute(environment);
            const array = anterior.value;// en vez de este casteo se mira si es arrelo o no


           if(this.Iguala == null){
            if (anterior.type != Type.ARRAY || array == undefined) {
                console.log("tipo: "+ anterior.type);
                let errorN = new Error_(this.line, this.column, "Semantico", "No puede acceder al indice requerido");
                errores.push(errorN);
                throw { error: "Semantico: No puede acceder al indice requerido", linea: this.line, columna: this.column };
            }
          }
            const indice = this.index.execute(environment);

            if (this.Iguala == null) {
               if(this.len == 1){
                    try {
                        const value = array.getAtributo(Number(indice.value));                 
                        const value2 = value.length();
                        return { value: value2, type:Type.NUMBER};
                        
                    } catch (error) {
                        //console.log(error);
                        
                    }

                    return{value:0,type:Type.NUMBER}
                }else{
                    const value = array.getAtributo(Number(indice.value));
                    return { value: value, type: array.tipo, typeArray: anterior.typeArray };
                }
                
            } else {
                

                if (this.Iguala.type == Type.ARRAY) {
                    let t1;
                    let t2;
                    for (const iterator of tiposArr) {
                        t1 = iterator.tipo
                        if (t1 != Type.ARRAY) {
                            if (t2 == null || t1 == t2) {
                                t2 = t1;
                            } else {
                                while (tiposArr.length > 0) {
                                    tiposArr.pop();
                                }
                                let errorN = new Error_(this.line, this.column, "Semantico", "Los arreglos tienen que ser de un mismo tipo de dato");
                                errores.push(errorN);
                                throw { error: "Semantico: Los arrreglos tienen que ser de un mismo tipo de dato", linea: this.line, columna: this.column };
                            }
                        }

                    }

                    while (tiposArr.length > 0) {
                        tiposArr.pop();
                    }
                    if (t2 != null) {
                        if (anterior.typeArray != t2) { //quite el t2 == null
                            let errorN = new Error_(this.line, this.column, "Semantico", "Los tipos de datos insertados, no coinciden con el tipo de dato del arreglo");
                            errores.push(errorN);
                            throw { error: "Semantico: Los tipos de datos insertados, no coinciden con el tipo de dato del arreglo", linea: this.line, columna: this.column };
                        }

                    }


                } else {
                    if (this.Iguala.type != anterior.typeArray) {
                        let errorN = new Error_(this.line, this.column, "Semantico", "Los tipos de datos insertados, no coinciden con el tipo de dato del arreglo");
                        errores.push(errorN);
                        throw { error: "Semantico: Los tipos de datos insertados, no coinciden con el tipo de dato del arreglo", linea: this.line, columna: this.column };
                    }
                }



                array.setValor(Number(indice.value), this.Iguala.value);
                if(array.tipo == undefined){
                    array.tipo = this.Iguala.type;
                 }
 

            }





        }

    }

     public getDot(ant:string){
        
        if(this.id != ''){
          
        let dot = "";
        let nodo= "Node"+cont;
        dot+=nodo+"[label=Acess]; \n";
        dot+= ant+"->"+nodo+'\n';
        Aumentar();

            let nodo1= "Node"+cont;
            dot+=nodo1+"[label= \""+this.id+"["+this.index+"]\"]; \n";
            dot+= nodo+"->"+nodo1+'\n';
            Aumentar();
            return dot;
        }

         return "";
     }

     

}