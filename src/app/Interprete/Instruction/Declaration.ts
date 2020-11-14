import { Instruction } from "../Abstract/Instruction";
import { Environment } from "../Symbol/Environment";
import { Expression } from "../Abstract/Expression";
import { Retorno, Type } from "../Abstract/Retorno";
import { env } from "process";
import {Error_} from "../Error";
import {errores} from "../Errores";
import {tiposArr} from "../TiposArr";
import { cont } from "../contador";
import { Aumentar} from "../contador";

export class Declaration extends Instruction{
    public idt: string;
    private id : string;
    private value : Expression;
    private  tipo : number;
    private  tipoAsig : number;

    constructor(id: string, value : Expression | null , line : number, column: number,tipo:number | null, tipoAsig : number){
        super(line, column);
        this.id = id;
        this.value = value;
        this.tipo = tipo;
        this.tipoAsig = tipoAsig;
        this.idt =id;
    }
    // tipoAsign = 2 = let
    // tipoAsign = 1 = const
    public execute(environment: Environment) {

    }
    public getDot(ant:string){}

        
}