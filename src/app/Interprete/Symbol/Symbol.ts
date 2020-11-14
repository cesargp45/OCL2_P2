import { Type } from "../Abstract/Retorno";

export class Symbol{
    public valor :any;
    public id : string;
    public type : Type;
    public tipoVar : string;
    public listaVal : Array<any>;
    public typeArray : Type;

    constructor(valor: any, id: string, type: Type,tipoVar: string,listaVal:Array<any>,typeArray : Type){
        this.valor = valor;
        this.id = id;
        this.type = type;
        this.tipoVar = tipoVar;
        this.listaVal = listaVal;
        this.typeArray = typeArray;
    }
}