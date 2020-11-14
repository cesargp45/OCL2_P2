import { Instruction } from "../../Abstract/Instruction";
import { Type, Types } from "../../Utils/Type";
import { Expression } from "../../Abstract/Expression";
import { Enviorement } from "../../SymbolTable/Enviorement";
import { Generator } from "../../Generator/Generator";
import { Error } from "../../Utils/Error";
import { errores } from '../../SymbolTable/Errores';
import { Error_ } from "../../SymbolTable/Error";
import { cont } from "../../contador";
import { Aumentar} from "../../contador";

export class Declaration extends Instruction {
    private type: Type;
    private idList: Array<string>;
    private value: Expression;

    constructor(type: Type, idList: Array<string>, value: Expression, line: number, column: number) {
        super(line, column);
        this.type = type;
        this.idList = idList;
        this.value = value;
    }

    compile(enviorement: Enviorement): void {
        if(this.type == null) {
            let errorN = new Error_(this.line,this.column,"Semantico","tiene que declarar con tipo");
            errores.push(errorN);
        throw new Error(this.line,this.column,'Semantico',"tiene que declarar con tipo");
        }

        if(this.value == null) {
            let errorN = new Error_(this.line,this.column,"Semantico","tipo const tiene que estar inicializado");
            errores.push(errorN);
        throw new Error(this.line,this.column,'Semantico',"tipo const tiene que estar inicializado");
        }
        
        const generator = Generator.getInstance();
        const value = this.value.compile(enviorement);

        //if(this.value == null || this.value == undefined){

        this.validateType(enviorement);
        this.idList.forEach((id)=>{
               
            const newVar = enviorement.addVar(id,this.type,false,false);
            if(!newVar) {
                let errorN = new Error_(this.line,this.column,"Semantico",`La variable: ${id} ya existe en este ambito;`);
                errores.push(errorN);
            throw new Error(this.line,this.column,'Semantico',`La variable: ${id} ya existe en este ambito;`);
            }
            
            if(newVar.isGlobal){
                if(this.type.type == Types.BOOLEAN){
                    const falsel = generator.newLabel();
                    const truel = generator.newLabel();
                    //value.getValue() ? generator.addGoto(value.trueLabel) : generator.addGoto(value.falseLabel);
                    generator.addGoto(falsel)
                    const templabel = generator.newLabel();
                    generator.addLabel(truel);
                    generator.addSetStack(newVar.position,'1');
                    generator.addGoto(templabel);
                    generator.addLabel(falsel);
                    generator.addSetStack(newVar.position,'0');
                    generator.addLabel(templabel);
                                    
                }else if(this.type.type == Types.INTEGER){
                    generator.addSetStack(newVar.position,0);                              
                }
                else{
                    generator.addSetStack(newVar.position,-1);
                }
            }
            else{
                const temp = generator.newTemporal(); generator.freeTemp(temp);
                generator.addExpression(temp,'p',newVar.position,'+');
                if(this.type.type == Types.BOOLEAN){
                    value.getValue() ? generator.addGoto(value.trueLabel) : generator.addGoto(value.falseLabel);
                    const templabel = generator.newLabel();
                    generator.addLabel(value.trueLabel);
                    generator.addSetStack(temp,'1');
                    generator.addGoto(templabel);
                    generator.addLabel(value.falseLabel);
                    generator.addSetStack(temp,'0');
                    generator.addLabel(templabel);
                }
                else{
                    generator.addSetStack(temp,value.getValue());
                }
            }
        });
    //}

        




        /*const value = this.value.compile(enviorement);
        

        if(!this.sameType(this.type,value.type)){
            throw new Error(this.line,this.column,'Semantico',`Tipos de datos diferentes ${this.type.type}, ${value.type.type}`);
        }
        this.validateType(enviorement);
        this.idList.forEach((id)=>{
               
            const newVar = enviorement.addVar(id,value.type.type == Types.NULL ? this.type : value.type,false,false);
            if(!newVar) throw new Error(this.line,this.column,'Semantico',`La variable: ${id} ya existe en este ambito;`);
           
            
            if(newVar.isGlobal){
                if(this.type.type == Types.BOOLEAN){
                    value.getValue() ? generator.addGoto(value.trueLabel) : generator.addGoto(value.falseLabel);
                    const templabel = generator.newLabel();
                    generator.addLabel(value.trueLabel);
                    generator.addSetStack(newVar.position,'1');
                    generator.addGoto(templabel);
                    generator.addLabel(value.falseLabel);
                    generator.addSetStack(newVar.position,'0');
                    generator.addLabel(templabel);
                                    
                }else if(this.type.type == Types.INTEGER){
                    generator.addSetStack(newVar.position,value.getValue());                              
                }
                else{
                    generator.addSetStack(newVar.position,value.getValue());
                }
            }
            else{
                const temp = generator.newTemporal(); generator.freeTemp(temp);
                generator.addExpression(temp,'p',newVar.position,'+');
                if(this.type.type == Types.BOOLEAN){
                    value.getValue() ? generator.addGoto(value.trueLabel) : generator.addGoto(value.falseLabel);
                    const templabel = generator.newLabel();
                    generator.addLabel(value.trueLabel);
                    generator.addSetStack(temp,'1');
                    generator.addGoto(templabel);
                    generator.addLabel(value.falseLabel);
                    generator.addSetStack(temp,'0');
                    generator.addLabel(templabel);
                }
                else{
                    generator.addSetStack(temp,value.getValue());
                }
            }
        });*/
    }

    public getDot(ant:string){
        let dot = "";
        let nodo= "Node"+cont;
        dot+=nodo+"[label=Declaracion]; \n";
        dot+= ant+"->"+nodo+'\n';
        Aumentar();

       
           let nodoconst6= "Node"+cont;
           dot+=nodoconst6+"[label=const]; \n";
           dot+= nodo+"->"+nodoconst6+'\n';
           Aumentar();
        
        
       
         //let id:tipo = exp; /const

           let nodoconst= "Node"+cont;
           dot+=nodoconst+"[label=\""+this.idList[0]+"\"]; \n";
           dot+= nodo+"->"+nodoconst+'\n';
           Aumentar();

           let nodoconst4= "Node"+cont;
           dot+=nodoconst4+"[label="+this.type.type+"]; \n";
           dot+= nodo+"->"+nodoconst4+'\n';
           Aumentar();

           let nodoconst2= "Node"+cont;
           dot+=nodoconst2+"[label=\"=\"]; \n";
           dot+=nodo+"->"+nodoconst2+'\n';
           Aumentar();

           let nodoconst3= "Node"+cont;
           dot+=nodoconst3+"[label= Exp]; \n";
           dot+= nodo+"->"+nodoconst3+'\n';
           Aumentar();

           dot+= this.value.getDot(nodoconst3);
           
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
}

/**/