import { SymbolFunction } from "./SymbolFunction";
import { SymbolStruct } from "./SymbolStruct";
import { Symbol } from "./Symbol";
import { SimboloGlobal } from "./SimboloGlobal";
import { Type, Types } from "../Utils/Type";
import { Error } from "../Utils/Error";
import { FunctionSt } from "../Instruction/Functions/FunctionSt";
import { StructSt } from "../Instruction/Functions/StructSt";
import { Param } from "../Utils/Param";
import { environment } from 'src/environments/environment';

export class Enviorement {
    functions: Map<string, SymbolFunction>;
    functionsN: Map<string,string>;
    structs: Map<string, SymbolStruct>;
    vars: Map<string, Symbol>;
    anterior: Enviorement | null;
    size: number;
    break: string | null;
    continue: string | null;
    return: string | null;
    prop : string;
    actualFunc: SymbolFunction | null;

    constructor(anterior: Enviorement | null = null) {
        this.functions = new Map();
        this.functionsN = new Map();
        this.structs = new Map();
        this.vars = new Map();
        this.anterior = anterior;
        if (anterior == null){
        this.size =  0;
        this.break =  null;
        this.return = null;
        this.continue =  null;           
        }else{
        this.size = anterior.size ;
        this.break = anterior.break;
        this.return = anterior.return ;
        this.continue = anterior.continue ;

        }    
        this.prop = 'main';
        if (anterior == null || anterior == undefined){
            this.actualFunc = null
        }else{
            this.actualFunc = anterior.actualFunc;
        }
        //this.actualFunc = anterior?.actualFunc || null;
    }

    setEnviorementFunc(prop: string, actualFunc : SymbolFunction, ret : string){
        this.size = 1; //1 porque la posicion 0 es para el return
        this.prop = prop;
        this.return = ret;
        this.actualFunc = actualFunc;
    }
    
    
    public addVar(id: string, type: Type, isConst: boolean, isRef: boolean): Symbol | null {
        //id = id.toLowerCase();
        if (this.vars.get(id) != undefined) {
            return null;
        }
        const newVar = new Symbol(type, id, this.size++, isConst, this.anterior == null, isRef);
        this.vars.set(id, newVar);
        SimboloGlobal.push(newVar);
        return newVar;
    }

    public addFunc(func: FunctionSt, uniqueId: string) : boolean{
        if(this.functions.has(func.id)){
            return false;
        }
        this.functions.set(func.id,new SymbolFunction(func,uniqueId));
        return true;
    }

    public addFuncN(id:string,code:string) : boolean{//nativas
        if(this.functionsN.has(id)){
            return false;
        }
        let enviorement : Enviorement | null = this;
        while(enviorement != null){
            enviorement.functionsN.set(id,code);
            enviorement = enviorement.anterior;
        }

        if(this.functionsN.has(id)){
            return false;
        }
        this.functionsN.set(id,code);
        return true;
    }

    public addStruct(id: string, size: number, params: Array<Param>) : boolean{
        if(this.structs.has(id.toLocaleLowerCase())){
            return false;
        }
        this.structs.set(id,new SymbolStruct(id,size,params));
        return true;
    }

    public getVar(id: string) : Symbol | null{
        let enviorement : Enviorement | null = this;
        //id = id.toLowerCase();
        while(enviorement != null){
            const sym = enviorement.vars.get(id);
            if(sym != undefined){
                return sym;
            }
            enviorement = enviorement.anterior;
        }
        return null;
    }

    public getFunc(id: string) : SymbolFunction | undefined{
        return this.functions.get(id);
    }

    public getFuncN(id: string) : string | undefined{ // retorna el codigo de la funcion
        return this.functionsN.get(id);
    }

    public searchFunc(id: string) : SymbolFunction | null{
        let enviorement : Enviorement | null = this;
        //id = id.toLowerCase();
        while(enviorement != null){
            const sym = enviorement.functions.get(id);
            if(sym != undefined){
                return sym;
            }
            enviorement = enviorement.anterior;
        }
        return null;
    }

    public structExists(id: string){
        return this.structs.get(id);
    }

    public searchStruct(id: string) : SymbolStruct | null{
        let enviorement : Enviorement | null = this;
        //id = id.toLowerCase();
        while(enviorement != null){
            const sym = enviorement.structs.get(id);
            if(sym != undefined){
                return sym;
            }
            enviorement = enviorement.anterior;
        }
        return null;
    }
}