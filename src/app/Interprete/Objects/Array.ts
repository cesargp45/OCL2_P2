import { Type } from '../Abstract/Retorno';
import { Symbol } from "../Symbol/Symbol";


export class  Arreglo{

    constructor(public tipo:Type ,private atributos:Array<any>,public dim:number){
        
    }

    getAtributo(id:number){
        return this.atributos[id];
    }
    setValor(index:number, valor:any){
        this.atributos[index] = valor;
    }

    push (valor:any){

    }

    pop(){

    }

    length(){
        
            return this.atributos.length;
        
        
    }

    public toString() : string {
        let salida ='[';
        this.atributos.forEach((atributo) => {
            salida += ' ' + atributo.toString() +",";
        });

        return salida.slice(0,salida.length-1) + ']';

    }

  



}