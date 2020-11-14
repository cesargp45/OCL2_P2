import { Instruction } from "../../Abstract/Instruction";
import { Expression } from "../../Abstract/Expression";
import { Enviorement } from "../../SymbolTable/Enviorement";
import { Types } from "../../Utils/Type";
import { Error } from "../../Utils/Error";
import { Generator } from "../../Generator/Generator";
import {Case} from "./Case";
import { environment } from 'src/environments/environment';
import { errores } from '../../SymbolTable/Errores';
import { Error_ } from "../../SymbolTable/Error";
import { cont } from "../../contador";
import { Aumentar} from "../../contador";

export class Switch extends Instruction {


    constructor(private condition : Expression, private cases : Array<Case> ,line : number, column : number) {
        super(line, column);

    }

    compile(enviorement: Enviorement) : void{
        let contador = 1;
        const generator = Generator.getInstance();
        const newEnv = new Enviorement(enviorement);
        const lblWhile = generator.newLabel();
        generator.addComment('Inicia switch');
        //generator.addLabel(lblWhile);
        const condition = this.condition.compile(enviorement);
        const lblinicio = generator.newLabel();
        const lblfin = generator.newLabel();
        generator.addLabel(lblinicio);
        const lbltrueCase = generator.newLabel();
        let lblt = lbltrueCase;
        //console.log(this.cases.length);
        for (const c of this.cases) {
            if(c.condition != null){
            const conditionCase = c.condition.compile(enviorement);  
            if(condition.type.type != conditionCase.type.type){
                let errorN = new Error_(this.line,this.column,"Semantico",'Los datos a comparar no son del mismo tipo');
               errores.push(errorN);   
                throw new Error(this.line,this.column,'Semantico','Los datos a comparar no son del mismo tipo');
            }         
            generator.addIf(condition.getValue(),conditionCase.getValue(),'==',lblt);
            let aux = "";
            if(contador!= this.cases.length){
                const lblfalseCase = generator.newLabel();
                aux = lblfalseCase;
                generator.addGoto(lblfalseCase);
            }else{
                generator.addGoto(lblfin);
                aux = lblfin;
            }
            
            generator.addLabel(lblt);
            newEnv.break = lblfin;
            c.compile(newEnv);
            if(contador != this.cases.length){
                lblt = generator.newLabel();
                generator.addGoto(lblt);
            }
            generator.addLabel(aux);              
            }else{


            generator.addLabel(lblt);
            newEnv.break = lblfin;
            c.compile(newEnv);
            if(contador != this.cases.length){
                lblt = generator.newLabel();
                generator.addGoto(lblt);
            }else{
                generator.addLabel(lblfin); 
            }              
            }

            contador++;
        }
        generator.addComment('fin switch');

        //throw new Error(this.line,this.column,'Semantico','La condicion no es booleana:');
    }


    public getDot(ant:string){

        let dot = "";
            let nodo= "Node"+cont;
            dot+=nodo+"[label=Literal]; \n";
            dot+= ant+"->"+nodo+'\n';
            Aumentar();
    
                let nodo1= "Node"+cont;
                dot+=nodo1+"[label= switch]; \n";
                dot+= nodo+"->"+nodo1+'\n';
                Aumentar();
    
                let nodo2= "Node"+cont;
                dot+=nodo2+"[label= \":\"]; \n";
                dot+= nodo+"->"+nodo2+'\n';
                Aumentar();
                dot+= this.condition.getDot(nodo);
    
                let nodo3= "Node"+cont;
                dot+=nodo3+"[label= \"cases\"]; \n";
                dot+= nodo+"->"+nodo3+'\n';
                Aumentar();
            
                for (const iterator of this.cases) {
                      dot+= iterator.getDot(nodo3);
                }
                
    
    
    
                return dot;
     }
}