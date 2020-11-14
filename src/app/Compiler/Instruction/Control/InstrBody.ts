import { Instruction } from "../../Abstract/Instruction";
import { Enviorement } from "../../SymbolTable/Enviorement";
import { errores } from '../../SymbolTable/Errores';
import { Error_ } from "../../SymbolTable/Error";

export class InstrBody extends Instruction {
    private instructions: Array<Instruction> | null;

    constructor(instructions: Array<Instruction> | null, line: number, column: number) {
        super(line, column);
        this.instructions = instructions;
    }

    compile(enviorement: Enviorement): any {
        const newEnv = enviorement.actualFunc == null ? new Enviorement(enviorement) : enviorement;
        if (this.instructions == null || this.instructions == undefined){
          // no hace nada
        }else{
            
            this.instructions.forEach((instruction)=>{
                try {
                    instruction.compile(newEnv);
                } catch (error) {
                    console.log(error);
                }
            });
            
        }
        
    }

    public getDot(ant:string){

        let dot = "";

        for(const instr of this.instructions){
            try {
                dot+= instr.getDot(ant);
                
            } catch (error) {
                errores.push(error);
            }
        }
        return dot;
    }

}