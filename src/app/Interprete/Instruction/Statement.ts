import { Instruction } from "../Abstract/Instruction";
import { Environment } from "../Symbol/Environment";
import { errores } from "../Errores";

export class Statement extends Instruction{
               // esto lo cambie a publico 
    constructor(private code : Array<Instruction>, line : number, column : number){
        super(line, column);
    }

    public execute(env : Environment) {
        const newEnv = new Environment(env);
        for(const instr of this.code){
            try {
                const element = instr.execute(newEnv);
                if(element != undefined || element != null){  
                    if(element.type == 'Return'){
                        //console.log("retorna: " +element.value+" tipo: " + element.tipoDato);
                        return element; 
                    }else if(element.type == 'Break'){
                        //console.log("retorna: " +element.value+" tipo: " + element.type);
                        newEnv.guardarSimGlobal();
                        newEnv.guardarFunGlobal();
                        return element; 
                    }else if(element.type == 'Continue'){
                        //console.log("retorna: " +element.value+" tipo: " + element.type);
                        return element; 
                    }
                                   
                }

            } catch (error) {
                errores.push(error);
            }
        }
         
        newEnv.guardarSimGlobal();
        newEnv.guardarFunGlobal();
        
    }

    public getDot(ant:string){

        let dot = "";

        for(const instr of this.code){
            try {
                dot+= instr.getDot(ant);
                
            } catch (error) {
                errores.push(error);
            }
        }
        return dot;
    }

   
}