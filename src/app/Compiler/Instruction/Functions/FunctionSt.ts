import { Instruction } from "../../Abstract/Instruction";
import { Param } from "../../Utils/Param";
import { Type, Types } from "../../Utils/Type";
import { Enviorement } from "../../SymbolTable/Enviorement";
import { Error } from "../../Utils/Error";
import { Generator } from "../../Generator/Generator";
import { errores } from '../../SymbolTable/Errores';
import { Error_ } from "../../SymbolTable/Error";
import { cont } from "../../contador";
import { Aumentar} from "../../contador";

export class FunctionSt extends Instruction{
    id: string;
    params: Array<Param>;
    type: Type;
    private body: Instruction;
    private preCompile: boolean;

    constructor(type: Type,id: string, params: Array<Param>, body: Instruction, line: number, column: number){
        super(line,column);
        this.id = id;
        this.type = type;
        this.params = params;
        this.body = body;
        this.preCompile = true;
    }

    compile(enviorement: Enviorement){
        if(this.preCompile){
            this.preCompile = false;
            this.validateParams(enviorement);
            this.validateType(enviorement);
            //const uniqueId = this.uniqueId(enviorement);
            if(!enviorement.addFunc(this,this.id)){
            let errorN = new Error_(this.line,this.column,"Semantico",`Ya existe una funcion con el id: ${this.id}`);
            errores.push(errorN);  
                throw new Error(this.line,this.column,'Semantico',`Ya existe una funcion con el id: ${this.id}`);
            }
            return;
        }

        const symbolFunc = enviorement.getFunc(this.id);
        if(symbolFunc != undefined){
            const generator = Generator.getInstance();
            generator.vaciar_aux();
            generator.code_codeaux();
            generator.vaciar_code();
            const newEnv = new Enviorement(enviorement);
            const returnLbl = generator.newLabel();
            const tempStorage = generator.getTempStorage();

            newEnv.setEnviorementFunc(this.id,symbolFunc,returnLbl);
            this.params.forEach((param)=>{
                newEnv.addVar(param.id,param.type,false,false);
            });
            generator.clearTempStorage();
            //generator.isFunc = '\t';
            generator.addBegin(symbolFunc.id);//cambie
            this.body.compile(newEnv);
            //generator.addLabel(returnLbl);
            generator.addret();
            generator.addEnd();
            generator.isFunc = '';
            generator.setTempStorage(tempStorage);
            
            generator.code_codefunc();
            generator.vaciar_code();
            generator.codeaux_code();
            generator.vaciar_aux();

        }
    }

    private validateParams(enviorement: Enviorement){
        const set = new Set<string>();     
        this.params.forEach((param)=>{
            if(set.has(param.id))//.toLowerCase()
                throw new Error(this.line,this.column,'Semantico',`Ya existe un parametro con el id ${param.id}`);
            if(param.type.type == Types.STRUCT ){
                const struct = enviorement.structExists(param.type.typeId);
                if(!struct)
                    throw new Error(this.line,this.column,'Semantico',`No existe el struct ${param.type.typeId}`);
                param.type.struct = struct;
            }
            set.add(param.id);//.toLowerCase()
        });
    }


    
    public getDot(ant:string){


        let dot = "";
            let nodo= "Node"+cont;
            dot+=nodo+"[label=Funcion]; \n";
            dot+= ant+"->"+nodo+'\n';
            Aumentar();
    
                let nodo1= "Node"+cont;
                dot+=nodo1+"[label = "+this.id+"]; \n";
                dot+= nodo+"->"+nodo1+'\n';
                Aumentar();

                       
                

                if(this.params != null ){

                        let nodo3= "Node"+cont;
                        dot+=nodo3+"[label = parametros]; \n";
                        dot+= nodo+"->"+nodo3+'\n';
                        Aumentar();
                        
                    for(let i = 1; i < this.params.length; i = i+2){

                        let nodo2= "Node"+cont;
                        dot+=nodo2+"[label = "+this.params[i]+"]; \n";
                        dot+= nodo3+"->"+nodo2+'\n';
                        Aumentar();
                        
                    }


                }



                if(this.type != null){
                        let nodo4= "Node"+cont;
                        dot+=nodo4+"[label = \"" +this.type.type+"\"]; \n";
                        dot+= nodo+"->"+nodo4+'\n';
                        Aumentar();
                }

                      
                        let nodo5= "Node"+cont;
                        dot+=nodo5+"[label = \"statement\"]; \n";
                        dot+= nodo+"->"+nodo5+'\n';
                        Aumentar();
                       
                       dot+= this.body.getDot(nodo5);
                                               
                          
                         return dot;
    }

    private validateType(enviorement: Enviorement){
        if(this.type.type == Types.STRUCT){
            const struct = enviorement.searchStruct(this.type.typeId);
            if(!struct)
                throw new Error(this.line,this.column,'Semantico',`No existe el struct ${this.type.typeId}`);
            this.type.struct = struct;
        }
    }

    public uniqueId(enviorement: Enviorement) : string{
        let id = `${enviorement.prop}_${this.id}`;
        if(this.params.length == 0)
            return id + '_empty';
        this.params.forEach((param)=>{
            id += `_${param.getUnicType()}`;
        });
        return id;
    }
}