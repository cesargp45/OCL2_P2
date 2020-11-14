import { Instruction } from "../Abstract/Instruction";
import { Environment } from "../Symbol/Environment";
import { Expression } from "../Abstract/Expression";
import { Error_ } from "../Error";
import { errores } from "../Errores";
import { Retorno, Type } from "../Abstract/Retorno";
import { ValueConverter } from '@angular/compiler/src/render3/view/template';
import { cont } from "../contador";
import { Aumentar} from "../contador";

export class Call extends Instruction {

    constructor(private id: string, private expresiones: Array<any>, line: number, column: number) {
        super(line, column);
    }

    public execute(environment: Environment) {
        const func = environment.getFuncion(this.id);

        if (func == undefined || func == null) {
            let errorN = new Error_(this.line, this.column, "Semantico", " No existe la funcion que desea ejecutar");
            errores.push(errorN);
            throw { error: "Semantico: No existe la funcion que desea ejecutar", linea: this.line, columna: this.column }
        }


        const newEnv = new Environment(environment.getGlobal());


        let param = func.parametros;
        let numParam;

        if (param != null) {
            numParam = param.length / 2;
        } else {
            numParam = 0;
        }


        if (this.expresiones.length != numParam) {
            let errorN = new Error_(this.line, this.column, "Semantico", " El numero de parametros enviados, no coincide con el numero de parametros de la funcion");
            errores.push(errorN);
            throw { error: "Semantico: El numero de parametros enviados, no coincide con el numero de parametros de la funcion", linea: this.line, columna: this.column }
        }


        if (numParam != 0) {

            let t;
            let j = 0;
            for (let i = 0; i < this.expresiones.length; i++) {
                const value = this.expresiones[i].execute(environment);

                if (param[i + 1] != null) {
                    t = getTipo(param[j + 1]);
                }

                if (t != value.type) {
                    let errorN = new Error_(this.line, this.column, "Semantico", " el parametro " + value.value + " no coincide con el tipo de parametro de la funcion");
                    errores.push(errorN);
                    throw { error: "Sintactico: el parametro " + value.value + " no coincide con el tipo de parametro de la funcion", linea: this.line, columna: this.column }

                }
                if (param[i + 1] != null) { 

                if (param[j + 1] == 7) {
                    if (value.typeArr != Type.NUMBER) {
                        let errorN = new Error_(this.line, this.column, "Semantico", " el parametro " + value.value + " no coincide con el tipo de parametro de la funcion");
                        errores.push(errorN);
                        throw { error: "Sintactico: el parametro " + value.value + " no coincide con el tipo de parametro de la funcion", linea: this.line, columna: this.column }


                    }

                    newEnv.guardarN(func.parametros[j], value.value, value.type, "let", null, value.typeArr);
                } else if (param[j + 1] == 8) {
                    if (value.typeArr != Type.STRING) {
                        let errorN = new Error_(this.line, this.column, "Semantico", " el parametro " + value.value + " no coincide con el tipo de parametro de la funcion");
                        errores.push(errorN);
                        throw { error: "Sintactico: el parametro " + value.value + " no coincide con el tipo de parametro de la funcion", linea: this.line, columna: this.column }

                    }
                    newEnv.guardarN(func.parametros[j], value.value, value.type, "let", null, value.typeArr);

                } else if (param[j + 1] == 8) {
                    if (value.typeArr != Type.BOOLEAN) {
                        let errorN = new Error_(this.line, this.column, "Semantico", " el parametro " + value.value + " no coincide con el tipo de parametro de la funcion");
                        errores.push(errorN);
                        throw { error: "Sintactico: el parametro " + value.value + " no coincide con el tipo de parametro de la funcion", linea: this.line, columna: this.column }

                    }
                    newEnv.guardarN(func.parametros[j], value.value, value.type, "let", null, value.typeArr);

                } else {
                    newEnv.guardarN(func.parametros[j], value.value, value.type, "let", null, null);
                }
            }


                j = j + 2;
            }


            for (const instr of func.instrucciones) {
                let salida = "";
                try {
                    if (instr instanceof Instruction) {

                        const actual = instr.execute(newEnv);
                        if (actual != null || actual != undefined) {

                            if (actual.type == 'Break') {

                                let errorN = new Error_(actual.line, actual.column, "Semantico", "Break fuera de ciclo");
                                errores.push(errorN);
                                throw { error: "Semantico: Break fuera de ciclo", linea: actual.line, columna: actual.column };
                            } else if (actual.type == 'Continue') {

                                let errorN = new Error_(actual.line, actual.column, "Semantico", "Continue fuera de ciclo");
                                errores.push(errorN);
                                throw { error: "Semantico: Continue fuera de ciclo", linea: actual.line, columna: actual.column };

                            } else if (actual.type == 'Return') {
                                //console.log("return "+ actual.value);


                                if (actual.value != null) {
                                    if (func.tipo != null) {
                                        if (getTipo(func.tipo) == Type.VOID) {
                                            // error porque void no retorna nada
                                            let errorN = new Error_(this.line, this.column, "Semantico", "Una Funcion void no retorna valores");
                                            errores.push(errorN);
                                            throw { error: "Semantico: Una Funcion void no retorna valores", linea: this.line, columna: this.column };
                                        } else {
                                            if (getTipo(func.tipo) == actual.tipoDato) {
                                                newEnv.guardarSimGlobal();
                                                newEnv.guardarFunGlobal();
                                                return { value: actual.value, type: actual.tipoDato};
                                            } else {
                                                //error retorna un tipo diferente
                                                let errorN = new Error_(this.line, this.column, "Semantico", "El tipo del valor que se retorna no es igual al tipo de la funcionn");
                                                errores.push(errorN);
                                                throw { error: "Semantico: El tipo del valor que se retorna no es igual al tipo de la funcionn", linea: this.line, columna: this.column };
                                            }
                                        }

                                    } else {
                                        //error, deberia retornar nulo
                                        let errorN = new Error_(this.line, this.column, "Semantico", "No debe de retornar valores");
                                        errores.push(errorN);
                                        throw { error: "Semantico: No debe retornar valores", linea: this.line, columna: this.column };
                                    }
                                } else {
                                    if (func.tipo != null) {
                                        if (getTipo(func.tipo) == Type.VOID) {
                                            // solo se hace el return y ya
                                            newEnv.guardarSimGlobal();
                                            newEnv.guardarFunGlobal();
                                            return;
                                        } else {
                                            // error, no retorna nada y deberia retornar el tipo de la funcion
                                            let errorN = new Error_(this.line, this.column, "Semantico", "Debe retornar un valor, y no retorna nada");
                                            errores.push(errorN);
                                            throw { error: "Semantico: Debe retornar un valor, y no retorna nada", linea: this.line, columna: this.column };
                                        }

                                    } else {
                                        // solo hace el return y ya
                                        newEnv.guardarSimGlobal();
                                        newEnv.guardarFunGlobal();
                                        return;
                                    }
                                }

                            }


                        }

                    }
                } catch (error) {

                    console.log(error);
                }
            }

            if (func.tipo == null || getTipo(func.tipo) == Type.VOID) {
                newEnv.guardarSimGlobal();
                newEnv.guardarFunGlobal();
                return;
            } else {
                let errorN = new Error_(this.line, this.column, "Semantico", "Deberia de retornar un vvalor y no retorna ningun valor");
                errores.push(errorN);
                throw { error: "Semantico: Deberia de retornar un vvalor y no retorna ningun valor", linea: this.line, columna: this.column };

            }


        } else {
            
            for (const instr of func.instrucciones) {
                try {
                    if (instr instanceof Instruction) {

                        const actual = instr.execute(newEnv);
                        if (actual != null || actual != undefined) {

                            if (actual.type == 'Break') {

                                let errorN = new Error_(actual.line, actual.column, "Semantico", "Break fuera de ciclo");
                                errores.push(errorN);
                                throw { error: "Semantico: Break fuera de ciclo", linea: actual.line, columna: actual.column };
                            } else if (actual.type == 'Continue') {

                                let errorN = new Error_(actual.line, actual.column, "Semantico", "Continue fuera de ciclo");
                                errores.push(errorN);
                                throw { error: "Semantico: Continue fuera de ciclo", linea: actual.line, columna: actual.column };

                            } else if (actual.type == 'Return') {
                                //console.log("return "+ actual.value);


                                if (actual.value != null) {
                                    if (func.tipo != null) {
                                        if (getTipo(func.tipo) == Type.VOID) {
                                            // error porque void no retorna nada
                                            let errorN = new Error_(this.line, this.column, "Semantico", "Una Funcion void no retorna valores");
                                            errores.push(errorN);
                                            throw { error: "Semantico: Una Funcion void no retorna valores", linea: this.line, columna: this.column };
                                        } else {
                                            if (getTipo(func.tipo) == actual.tipoDato) {
                                                newEnv.guardarSimGlobal();
                                                newEnv.guardarFunGlobal();
                                                return { value: actual.value, type: actual.tipoDato };
                                            } else {
                                                //error retorna un tipo diferente
                                                let errorN = new Error_(this.line, this.column, "Semantico", "El tipo del valor que se retorna no es igual al tipo de la funcionn");
                                                errores.push(errorN);
                                                throw { error: "Semantico: El tipo del valor que se retorna no es igual al tipo de la funcionn", linea: this.line, columna: this.column };
                                            }
                                        }

                                    } else {
                                        //error, deberia retornar nulo
                                        let errorN = new Error_(this.line, this.column, "Semantico", "No debe de retornar valores");
                                        errores.push(errorN);
                                        throw { error: "Semantico: No debe retornar valores", linea: this.line, columna: this.column };
                                    }
                                } else {
                                    if (func.tipo != null) {
                                        if (getTipo(func.tipo) == Type.VOID) {
                                            // solo se hace el return y ya
                                            newEnv.guardarSimGlobal();
                                            newEnv.guardarFunGlobal();
                                            return;
                                        } else {
                                            // error, no retorna nada y deberia retornar el tipo de la funcion
                                            let errorN = new Error_(this.line, this.column, "Semantico", "Debe retornar un valor, y no retorna nada");
                                            errores.push(errorN);
                                            throw { error: "Semantico: Debe retornar un valor, y no retorna nada", linea: this.line, columna: this.column };
                                        }

                                    } else {
                                        // solo hace el return y ya
                                        newEnv.guardarSimGlobal();
                                        newEnv.guardarFunGlobal();
                                        return;
                                    }
                                }

                            }


                        }

                    }
                } catch (error) {

                    console.log(error);
                }
            }

            if (func.tipo == null || getTipo(func.tipo) == Type.VOID) {
                newEnv.guardarSimGlobal();
                newEnv.guardarFunGlobal();
                return;
            } else {
                let errorN = new Error_(this.line, this.column, "Semantico", "Deberia de retornar un vvalor y no retorna ningun valor");
                errores.push(errorN);
                throw { error: "Semantico: Deberia de retornar un vvalor y no retorna ningun valor", linea: this.line, columna: this.column };

            }

        }





    }

    public getDot(ant:string){
        let dot = "";
        let nodo= "Node"+cont;
        dot+=nodo+"[label=Call]; \n";
        dot+= ant+"->"+nodo+'\n';
        Aumentar();

            let nodo1= "Node"+cont;
            dot+=nodo1+"[label= \"(\"]; \n";
            dot+= nodo+"->"+nodo1+'\n';
            Aumentar();

            let nodo2= "Node"+cont;
            dot+=nodo2+"[label= \""+this.id+"\"]; \n";
            dot+= nodo+"->"+nodo2+'\n';
            Aumentar();


            let nodo3= "Node"+cont;
            dot+=nodo3+"[label= \")\"]; \n";
            dot+= nodo+"->"+nodo3+'\n';
            Aumentar();
            return dot;
    }



}



function getTipo(no: number): Type {

    if (no == 0) {
        return Type.NUMBER;
    }
    else if (no == 1) {
        return Type.STRING;
    }
    else if (no == 2) {
        return Type.BOOLEAN;
    }
    else if (no == 3) {
        return Type.NULL;
    }
    else if (no == 4) {
        return Type.ARRAY;
    }
    else if (no == 5) {
        return Type.VOID;
    }
    else if (no == 6) {
        return Type.ANY;

    }
    else if (no == 7) {
        return Type.ARRAY;

    }
    else if (no == 8) {
        return Type.ARRAY;

    }
    else if (no == 9) {
        return Type.ARRAY;

    }


}