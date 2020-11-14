import { SymbolStruct } from "../SymbolTable/SymbolStruct";

export enum Types{
    INTEGER = "integer",
    DOUBLE = "double",
    STRING = "string",
    BOOLEAN = "boolean",
    CHAR = "char",
    STRUCT = "struct",
    ARRAY = "array",
    NULL = "null",
    VOID = "void"
}

export class Type{
    type : Types;
    typeId : string;
    struct : SymbolStruct | null;
    dimension:number;

    constructor(type: Types, typeId: string = '', struct : SymbolStruct | null = null, dimension:number = 0){
        this.type = type;
        this.typeId = typeId;
        this.struct = struct;
        this.dimension = dimension;
    }
}