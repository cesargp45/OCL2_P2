import { Expression } from "../../Abstract/Expression";
import { Enviorement } from "../../SymbolTable/Enviorement";
import { Retorno } from "../../Utils/Retorno";
import { Generator } from "../../Generator/Generator";
import { Error } from "../../Utils/Error";
import { Types, Type } from "../../Utils/Type";
import { Symbol } from "../../SymbolTable/Symbol";
import { Instruction } from "../../Abstract/Instruction";
import { environment } from 'src/environments/environment';
import { errores } from '../../SymbolTable/Errores';
import { Error_ } from "../../SymbolTable/Error";


export class DeclarationArray extends Instruction {
    private type: Type;
    private id:string;
    private value:Expression;


    constructor(type: Type,id:string,value:Expression, line: number, column: number) {
        super(line, column);
        this.type = type;
        this.id = id;
        this.value = value;
    }

    compile(enviorement: Enviorement): void {
        if(this.value == null) {
            let errorN = new Error_(this.line,this.column,"Semantico","tipo const tiene que estar inicializado");
            errores.push(errorN);
        throw new Error(this.line,this.column,'Semantico',"tipo const tiene que estar inicializado");
        }
        const generator =  Generator.getInstance();
        generator.addComment("inicia la declaracion array");
        const value = this.value.compile(enviorement);
        this.validateType(enviorement);
        const newVar = enviorement.addVar(this.id,this.type,false,false);
        if(!newVar) {
            let errorN = new Error_(this.line,this.column,"Semantico",`La variable ${this.id} ya existe en el ambito`);
                errores.push(errorN);
            throw new Error(this.line,this.column,'Semantico',`La variable ${this.id} ya existe en el ambito`);
        }
        if(value.type.type == Types.ARRAY){
             const temp  = generator.newTemporal(); generator.freeTemp(temp);
             const label1 =generator.newLabel();
             const label2 = generator.newLabel();
             generator.addExpression(temp,value.getValue(),'1','+');
             generator.addLabel(label1);
             generator.addIf(temp,'h',' == ',label2);
             if(this.type.dimension == value.type.dimension){
                 //lena el arreglo
                 this.type.type != Types.STRING && this.type.type != Types.STRUCT ? generator.addSetHeap(temp,'0') : generator.addSetHeap(temp,'-1');

             }else{
                 //llena de 1
                 generator.addSetHeap(temp,'-1');
             }

             generator.addExpression(temp,temp,'1','+');
             generator.addGoto(label1);
             generator.addLabel(label2);
        }
        else if (this.type.dimension != value.type.dimension || this.type.type != value.type.type){
            let errorN = new Error_(this.line,this.column,"Semantico",'Error en los tipos de datos');
            errores.push(errorN);
            throw new Error(this.line,this.column,'Semantico','Error en los tipos de datos');
        }

        if(newVar.isGlobal){
           generator.addSetStack(newVar.position,value.getValue());
        }else{
            const temp = generator.newTemporal(); 
            generator.freeTemp(temp);
            generator.addExpression(temp,'p',newVar.position,'+');
            generator.addSetStack(temp,value.getValue());
        }

         generator.addComment("fin declaracion array");
        
    }
   

    public getDot(ant:string){
        
        return " ";
   }

    private validateType(enviorement: Enviorement){
        if(this.type.type == Types.STRUCT){
            const struct = enviorement.searchStruct(this.type.typeId);
            if(!struct){
                let errorN = new Error_(this.line,this.column,"Semantico",`No existe el struct ${this.type.typeId}`);
                errores.push(errorN);
                throw new Error(this.line,this.column,'Semantico',`No existe el struct ${this.type.typeId}`);
            }
            //this.type.struct = struct;
        }
    }
}