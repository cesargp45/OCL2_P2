import { Instruction } from "../../Abstract/Instruction";
import { Enviorement } from "../../SymbolTable/Enviorement";
import { Error } from "../../Utils/Error";
import { Generator } from "../../Generator/Generator";
import { errores } from '../../SymbolTable/Errores';
import { Error_ } from "../../SymbolTable/Error";
import { cont } from "../../contador";
import { Aumentar} from "../../contador";

export class Continue extends Instruction{

    constructor(line: number, column: number){
        super(line,column);
    }

    compile(enviorement: Enviorement){
        if(enviorement.continue == null){ 
            let errorN = new Error_(this.line,this.column,"Semantico",'Continue en un ambito incorrecto');
        errores.push(errorN);
            throw new Error(this.line,this.column,'Semantico','Continue en un ambito incorrecto');
        }
        Generator.getInstance().addGoto(enviorement.continue);
    }

    //import { cont } from "../../contador";
    //import { Aumentar} from "../../contador";

    public getDot(ant:string){
        let dot = "";
        let nodo= "Node"+cont;
        dot+=nodo+"[label=interruption]; \n";
        dot+= ant+"->"+nodo+'\n';
        Aumentar();

            let nodo1= "Node"+cont;
            dot+=nodo1+"[label= Continue]; \n";
            dot+= nodo+"->"+nodo1+'\n';
            Aumentar();
            return dot;
    }
}