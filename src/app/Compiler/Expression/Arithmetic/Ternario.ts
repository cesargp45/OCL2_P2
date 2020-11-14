import { Expression } from "../../Abstract/Expression";
import { Generator } from "../../Generator/Generator";
import { Enviorement } from "../../SymbolTable/Enviorement";
import { Error } from "../../Utils/Error";
import { Types, Type } from "../../Utils/Type";
import { Retorno } from "../../Utils/Retorno";
import { errores } from '../../SymbolTable/Errores';
import { Error_ } from "../../SymbolTable/Error";
import { cont } from "../../contador";
import { Aumentar} from "../../contador";

export class Ternario extends Expression {
    private left: Expression;
    private right: Expression;
    private condition: Expression;

    constructor(left: Expression, right: Expression,condition:Expression, line: number, column: number) {
        super(line, column);
        this.left = left;
        this.right = right;
        this.condition = condition;
    }

    public compile(enviorement: Enviorement): Retorno {
        let left ;
        let right ;

      //  if(left.type.type != right.type.type){
         //   throw new Error(this.line, this.column, 'Semantico', "Las opciones no son del mismo tipo");
       // }

        const generator = Generator.getInstance();
        generator.addComment('Inicia Ternario');
           if (this.condition == null || this.condition == undefined){
            throw new Error(this.line,this.column,'Semantico','no existe la condicion');
           }
        const condition = this.condition.compile(enviorement);
        const newEnv = new Enviorement(enviorement);
        if(condition.type.type == Types.BOOLEAN){
            generator.addLabel(condition.trueLabel);
            const temp1 = generator.newTemporal();
            //this.instruction.compile(newEnv);
               //this.left.compile(newEnv);
                left = this.left.compile(enviorement);
                generator.addExpression(temp1,left.getValue(),"","");
            //if(this.elseI != null){
                const tempLbl = generator.newLabel();
                generator.addGoto(tempLbl);
                generator.addLabel(condition.falseLabel);
                //this.right.compile(enviorement);
                 right = this.right.compile(enviorement);
                 generator.addExpression(temp1,right.getValue(),"","");
                generator.addLabel(tempLbl);
            //}
            //else{
             //   generator.addLabel(condition.falseLabel);
            //}
            return new Retorno(temp1, true, left.type);
        }
        let errorN = new Error_(this.line,this.column,"Semantico",'La condicion no es booleana');
        errores.push(errorN); 
        throw new Error(this.line,this.column,'Semantico','La condicion no es booleana');
        
    }
   
        //import { cont } from "../../contador";
        //import { Aumentar} from "../../contador";

        public getDot(ant:string){

            let dot = "";
            let nodo= "Node"+cont;
            dot+=nodo+"[label=condition]; \n";
            dot+= ant+"->"+nodo+'\n';
            Aumentar();
                dot+= this.condition.getDot(nodo);
    
                let nodo1= "Node"+cont;
                dot+=nodo1+"[label= \"?\"]; \n";
                dot+= nodo+"->"+nodo1+'\n';
                Aumentar();
                
                dot+= this.left.getDot(nodo);
    
                let nodo2= "Node"+cont;
                dot+=nodo2+"[label= \":\"]; \n";
                dot+= nodo+"->"+nodo2+'\n';
                Aumentar();
                 
                dot+= this.right.getDot(nodo);
    
                return dot;
        }

        
}