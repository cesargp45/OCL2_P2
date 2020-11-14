import { Instruction } from "../Abstract/Instruction";
import { Expression } from "../Abstract/Expression";
import { Environment } from "../Symbol/Environment";
import { Type } from "../Abstract/Retorno";
import {Error_} from "../Error"
import {errores} from "../Errores"
import { cont } from "../contador";
import { Aumentar} from "../contador";

export class FunctionArray extends Instruction{

    constructor(private id : string,private elemento: Expression | null, private funcion : string, private tipo: number,  line : number, column : number){
        super(line, column);
    }

    public execute(env : Environment) {
        const arr = env.getVar(this.id);

        if(arr.type != Type.ARRAY){
            let errorN = new Error_(this.line,this.column,"Semantico","No se puede aplicar el metodo pues la variable no es un arreglo");
                 errores.push(errorN);         
                 throw {error: "Semantico:No se puede aplicar el metodo pues la variable no es un arreglo", linea: this.line, columna : this.column};
        }

        if(this.tipo == 1){ //push
           let a = arr.valor;
           let b = this.elemento.execute(env);
           if(b != null || b != undefined){ 

            if(arr.typeArray == b.type){
                a.push(b.value);
                env.guardar(this.id, a, arr.type,arr.tipoVar,a,arr.typeArray); 

            }else{
            let errorN = new Error_(this.line,this.column,"Semantico","El dato que desea ingresar no es del mismo tipo que el arreglo");
            errores.push(errorN);         
            throw {error: "Semantico: El dato que desea ingresar no es del mismo tipo que el arreglo", linea: this.line, columna : this.column};
            }

           }else{
            let errorN = new Error_(this.line,this.column,"Semantico","No se puede insertar datos nulos");
            errores.push(errorN);         
            throw {error: "Semantico: No se puede insertar datos nulos", linea: this.line, columna : this.column};
           }
                     

        }else if(this.tipo == 2){ //pop

            let a = arr.valor;
            
            if(a.length != 0){
                a.pop();
                env.guardar(this.id, a, arr.type,arr.tipoVar,a,arr.typeArray); 

            }else{
            let errorN = new Error_(this.line,this.column,"Semantico","El arreglo se encuentra vacio, no puede aplicar el metodo");
            errores.push(errorN);         
            throw {error: "Semantico: El arreglo se encuentra vacio, no puede aplicar el metodo", linea: this.line, columna : this.column};
            }
           
                      

        }
        
    }

    public getDot(ant:string){

        let dot = "";
        let nodo= "Node"+cont;
        dot+=nodo+"[label=function]; \n";
        dot+= ant+"->"+nodo+'\n';
        Aumentar();

            

        if(this.tipo == 1){

            let nodo3= "Node"+cont;
            dot+=nodo3+"[label= \""+this.id+"\"]; \n";
            dot+= nodo+"->"+nodo3+'\n';
            Aumentar();

            let nodo2= "Node"+cont;
            dot+=nodo2+"[label= \"push\"]; \n";
            dot+= nodo+"->"+nodo2+'\n';
            Aumentar();

            dot+= this.elemento.getDot(nodo);
           
            return dot;

        }else if(this.tipo == 2){

            let nodo3= "Node"+cont;
            dot+=nodo3+"[label= \""+this.id+"\"]; \n";
            dot+= nodo+"->"+nodo3+'\n';
            Aumentar();

            let nodo2= "Node"+cont;
            dot+=nodo2+"[label= \"pop\"]; \n";
            dot+= nodo+"->"+nodo2+'\n';
            Aumentar();
           
            return dot;

        }
        return "";
    }
}