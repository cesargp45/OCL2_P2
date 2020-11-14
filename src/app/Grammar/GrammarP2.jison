/**
 * Gramatica para analisis del lenguaje java
 */

/* Analizador Lexico */
%{
     const {StringL} = require('../Compiler/Expression/Literal/StringL');
     const {PrimitiveL} = require('../Compiler/Expression/Literal/PrimitiveL');
     const {Declaration} = require('../Compiler/Instruction/Variables/Declaration');
     const {DeclarationArray} = require('../Compiler/Instruction/Variables/DeclarationArray');
     const {Assignment} = require('../Compiler/Instruction/Variables/Assignment');
     const {AssignmentArreglo} = require('../Compiler/Instruction/Variables/AssigmentArreglo');
     const {Call} = require('../Compiler/Instruction/Variables/Call');

     const {If} = require('../Compiler/Instruction/Control/If');
     const {DoWhile} = require('../Compiler/Instruction/Control/DoWhile');
     const {While} = require('../Compiler/Instruction/Control/While');
     const {InstrBody} = require('../Compiler/Instruction/Control/InstrBody');
     const {Print} = require('../Compiler/Instruction/Functions/Print');
     const {FunctionSt} = require('../Compiler/Instruction/Functions/FunctionSt');
     const {StructSt} = require('../Compiler/Instruction/Functions/StructSt');
     const {Case} = require('../Compiler/Instruction/Control/Case');
     const {Switch} = require('../Compiler/Instruction/Control/Switch');
     const {For} = require('../Compiler/Instruction/Control/For');



     const {Div} = require('../Compiler/Expression/Arithmetic/Div');
     const {Minus} = require('../Compiler/Expression/Arithmetic/Minus');
     const {Mod} = require('../Compiler/Expression/Arithmetic/Mod');
     const {Plus} = require('../Compiler/Expression/Arithmetic/Plus');
     const {Pot} = require('../Compiler/Expression/Arithmetic/Pot');
     const {Times} = require('../Compiler/Expression/Arithmetic/Times');
     const {Ternario} = require('../Compiler/Expression/Arithmetic/Ternario');

     const {Equals} = require('../Compiler/Expression/Relational/Equals');
     const {Greater} = require('../Compiler/Expression/Relational/Greater');
     const {Less} = require('../Compiler/Expression/Relational/Less');
     const {NotEquals} = require('../Compiler/Expression/Relational/NotEquals');

     const {And} = require('../Compiler/Expression/Logical/And');
     const {Not} = require('../Compiler/Expression/Logical/Not');
     const {Or} = require('../Compiler/Expression/Logical/Or');

     const {Types,Type} = require('../Compiler/Utils/Type');
     const {Param} = require('../Compiler/Utils/Param');

     const {AccessId} = require('../Compiler/Expression/Access/AccessId');
     const {AccessArray} = require('../Compiler/Expression/Access/AccessArray');
     const {ArrayExpr} = require('../Compiler/Expression/Access/ArrayExpr');
     const {NewArray} = require('../Compiler/Expression/Access/NewArray');
     const {accesstr} = require('../Compiler/Expression/Access/AccessString');
     const {AssignmentId} = require('../Compiler/Expression/Assignment/AssignmentId');
     const {AssignmentArray} = require('../Compiler/Expression/Assignment/AssignmentArray');
     const {AssignmentFunc} = require('../Compiler/Expression/Assignment/AssignmentFunc');

     const {PostIncrement} = require('../Compiler/Expression/IncDec/PostIncrement');
     const {PostDecrement} = require('../Compiler/Expression/IncDec/PostDecrement');

     const {Break} = require('../Compiler/Instruction/Transfer/Break');
     const {Continue} = require('../Compiler/Instruction/Transfer/Continue');
     const {Return} = require('../Compiler/Instruction/Transfer/Return');


	 var funciones = new Array();
     var nom = new Array();
     const {registrarError} = require('../Compiler/Instruction/Variables/registrarError');

     var bandera = 0;
%}

//https://regexr.com/ para reconocer expresiones regulares
%lex
// case-sensitive --> para que acepte mayusculas y minusculas
%options case-sensitive  
//`Mover disco de ${origen} a ${destino}`
entero [0-9]+
decimal {entero}"."{entero}
stringliteral (\"[^"]*\")
stringliteralc (\'[^']*\')
stringliteralb (\`[^`]*\`)


%%


\s+											// se ignoran espacios en blanco
"//".*										// comentario simple línea
[/][*][^*]*[*]+([^/*][^*]*[*]+)*[/]         // comentario multilinea 

{decimal}               return 'DECIMAL'
{entero}                return 'ENTERO'
{stringliteral}         return 'CADENA'
{stringliteralc}        return 'CADENAB'
{stringliteralb}        return 'CADENAPARAM'
"string"			    return 'STRING'
"boolean"			    return 'BOOLEAN'
"number"			    return 'NUMBER'
"type"			        return 'TYPE'
"Array"			        return 'ARRAY'
"let"			        return 'LET'
"const"			        return 'CONST'
"true"				    return 'TRUE'
"false"				    return 'FALSE'
"if"				    return 'IF'
"else"				    return 'ELSE'
"switch"			    return 'SWITCH'
"case"				    return 'CASE'
"default"			    return 'DEFAULT'
"do"				    return 'DO'
"while"				    return 'WHILE'
"for"				    return 'FOR'
"break"				    return 'BREAK'
"continue"				return 'CONTINUE'
"return"				return 'RETURN'
"console.log"	        return 'PRINT'
"graficar_ts"		    return 'GRAPH'
"function"			    return 'FUNCTION'
"void"			        return 'VOID'
".push"			        return 'PUSH'
".pop"			        return 'POP'
".length"			    return 'LENGTH'
".CharAt"			    return 'CHARAT'
".toLowerCase"			return 'LOWER'
".toUpperCase"			return 'UPPER'
".Concat"			    return 'CONCAT'
"new"			        return 'NEW'
"Array"			        return 'ARRAY'
"null"			        return 'NULL'
"any"			        return 'ANY'
"in"			        return 'IN'
"of"			        return 'OF'
"++"				    return '++'
"+"					    return '+'
"--"				    return '--'
"-"					    return '-'
"/"						return '/'
"**"			        return '**'
"*"						return '*'
"%"						return '%'
"?"						return '?'
"=="					return '=='
">="					return '>='
"<="					return '<='
"!="					return '!='
"<"						return '<'
">"						return '>'
"&&"					return '&&'
"||"					return '||'
"!"						return '!'
"("						return '('
")"						return ')'
"{"						return '{'
"}"						return '}'
"["						return '['
"]"						return ']'
";"						return ';' 
":"						return ':'
"="						return '='
","						return ','
([a-zA-Z_])[a-zA-Z0-9_ñÑ]*     return 'ID';

<<EOF>>	          return 'EOF'
.					{ 
                       console.error('Este es un error léxico: ' + yytext + ', en la linea: ' + yylloc.first_line + ', en la columna: ' + yylloc.first_column);
                       let e = new registrarError(yylloc.first_line, yylloc.first_column,yytext,null,1);
                       e.compile();
                    }

/lex

%left '?'
%left '||'
%left '&&'
%left '==' '!='
%left '>=' '<=' '>' '<'
%left '+' '-'
%left '*' '/'
%left '**' '%'
%left UMENOS
%right '!'
%right '++' '--'
%left '(' ')' '[' ']' '{' '}'

%start INICIO

%% 



INICIO    
    : EOF{
    }
    |
    Instructions EOF { 
        return $1; 
     } 
;



Instructions
    : Instructions Instruction{
        $1.push($2);
        $$ = $1;
    }
    | Instruction{
        $$ = [$1];
    }
;



Instruction
    : error ';'{  console.error('Error Sintactico: ' + $1 + ' linea: ' + @1.first_line + ' columna: ' + @1.first_column+" se esperaba: " + yy.parser.hash.expected.join(",")); 
                  let e = new registrarError(@1.first_line, @1.first_column,$1,yy.parser.hash.expected.join(","),2);
                  e.compile();
    }
    
    | error '}'{  console.error('Error Sintactico: ' + $1 + ' linea: ' + @1.first_line + ' columna: ' + @1.first_column+" se esperaba: " + yy.parser.hash.expected.join(",")); 
                  let e = new registrarError(@1.first_line, @1.first_column,$1,yy.parser.hash.expected.join(","),2);
                  e.compile();
    }

    | Declaration ';'{
        $$ = $1;
    }
    |DeclarationArrayst ';' {
        $$ = $1;
    }
    | Asignation ';'{
        
        $$ = $1;
    }
    
    |IfSt {
        $$ = $1;
    }
    | WhileSt {
        $$ = $1;
    }
    | doWhileSt {
        $$ = $1;
    }
    | ForSt {
        $$ = $1;
    }
    | SwitchSt {
        $$ = $1;
    }
    | Statement {
        $$ = $1;
    }
    | PrintSt {
        $$ = $1;
    }
    
    | 'BREAK' ';' {
       // $$ = new Break(@1.first_line, @1.first_column);
       $$ = new Break(@1.first_line,@1.first_column);
    }
    | 'CONTINUE' ';'{
        //$$ = new Continue(@1.first_line, @1.first_column);
        $$ = new Continue(@1.first_line,@1.first_column);
    }
    | ReturnSt{ 
        $$ = $1;
    }
    | FunctionSt {
        $$ = $1;
    }
    | 
     Call ';'{
        $$ = new Call($1,@1.first_line,@1.first_column);
    }
    |TernarioSt ';'{
        $$ = $1;       
    } 
    
    
;           


PrintSt 
    : 'PRINT' '(' ListaExpr  ')' ';' {
        
     //$$ = new Print($3, @1.first_line, @1.first_column);
       $$ = new Print($3,false,@1.first_line,@1.first_column);
        
    }
;




ReturnSt 
    : 'RETURN' ';' {
        //$$ = new Return(null, @1.first_line, @1.first_column);
        $$ = new Return(null,@1.first_line,@1.first_column);
    }
    | 'RETURN' Expr ';'{
         //$$ = new Return($2, @1.first_line, @1.first_column);
         $$ = new Return($2,@1.first_line,@1.first_column);
    }
   
;  




Call
    : ID '('ParamsExpression ')'  {
       // $$ = new Call($1, [], @1.first_line, @1.first_column);
       $$ = new AssignmentFunc($1,$3,null,@1.first_line,@1.first_column);
        
    }
;


ParamsExpression
    : ListaExpr {
        $$ =  $1;
    }
    | /*epsilon*/ {
        $$ = [];
    }
;

ListaExpr 
    : ListaExpr ',' Expr{
        $1.push($3);               
        $$ = $1;       
    }
    | Expr{
        $$ = [$1];     
    }
;    



FunctionSt 
    : 'FUNCTION' ID '('Params')' Statement {
        $$ = new FunctionSt(new Type(Types.VOID),$2,$4,$6,@1.first_line,@1.first_column);
    }
    | 'FUNCTION' ID '('Params')' ':' Type  Statement {
        //$$ = new Function($2,null, $6, $7, @1.first_line, @1.first_column);
         $$ = new FunctionSt($7,$2,$4,$8,@1.first_line,@1.first_column);
    }  
;


Params
    : ParamList {
        $$ = $1;
    }
    | /*epsilon*/ {
        $$ = [];
    }
;

ParamList
    : ParamList ',' Param {
        $$ = $1;
        $$.push($3);
    }
    | Param {
        $$ = [$1];
    }
;

Param
    : ID ':' Type{
        $$ = new Param($1,$3);
    }
;


Type 
    : NUMBER {
        $$ = new Type(Types.INTEGER);
    }
    | BOOLEAN {
        $$ = new Type(Types.BOOLEAN);
    }
    | STRING {
        $$ = new Type(Types.STRING);
    }
    | NULL {
        $$ = new Type(Types.NULL);
    }
    |VOID {
        $$ = new Type(Types.VOID);
    }
;




Declaration  
    :
    'LET' ID 
    {
        $$ = new Declaration(null,null,null,@1.first_line,@1.first_column);
    }
    |
    'LET' ID '=' Expr  
    {
        $$ = new Declaration(null,null,null,@1.first_line,@1.first_column);
    }
    |'LET' ID  ':' Type '=' Expr
    {
       // $$ = new Declaration($2, $6, @1.first_line, @1.first_column,$4,2);
       $$ = new Declaration($4,[$2],$6,@1.first_line,@1.first_column);
    }
    |'LET' ID  ':' Type 
    {
       // $$ = new Declaration($2, null, @1.first_line, @1.first_column,$4,2);
       $$ = new Declaration($4,[$2],null,@1.first_line,@1.first_column);
        
    }
    
    |'CONST' ID '=' Expr 
    {
       $$ = new Declaration(null,null,null,@1.first_line,@1.first_column);
    }
    |'CONST' ID  ':' Type '=' Expr  
    {
        //$$ = new Declaration($2, $6, @1.first_line, @1.first_column,$4,1);
       $$ = new Declaration($4,[$2],$6,@1.first_line,@1.first_column);
    }
    |'CONST' ID  ':' Type 
    {
        $$ = new Declaration($4,null,null,@1.first_line,@1.first_column);
    }
    |
    'CONST' ID 
    {
        $$ = new Declaration(null,null,null,@1.first_line,@1.first_column);
    } 
;




DeclarationArrayst
    :
    'LET' 'ID'  ':' Type ListaLlaves  
    {
        $$ = new DeclarationArray($4, $2,null, @1.first_line, @1.first_column);
        
        
    }
    |'LET' 'ID' ':' Type ListaLlaves '=' Expr 
    {
         $4.dimension = $5;
         $$ = new DeclarationArray($4, $2,$7, @1.first_line, @1.first_column);
        
    }
    
    |'CONST' 'ID' ':' Type ListaLlaves  
    {
       
       $$ = new DeclarationArray($4, $2,null, @1.first_line, @1.first_column);
      
    }
    |'CONST' 'ID'  ':' Type ListaLlaves  '=' Expr 
    {
         
       $$ = new DeclarationArray($4, $2,$7, @1.first_line, @1.first_column);
    }
   
;

   
  
  ListaLlaves 
    : ListaLlaves '['']'{     
        $$ = $1 + 1;
    }
    | '['']'{
        $$ = 1;
    }
; 

ListaIndices
    : ListaIndices '['Expr']'{
       // $1.push($3);
       // $$ = $1;

        $1 += "["+$3+"]";
        $$ = $1;
    }
    | '['Expr']'{
       // $$ = [$2];

        $$ = "["+$2+"]";
    }
; 


IdAssign
:    IdAssign '['Expr']'
    {                
         $$ = new AssignmentArray($3,$1,@1.first_line,@1.first_column);
    } 
    | ID '['Expr']'
    {   
        $1 = new AssignmentId($1,null,@1.first_line,@1.first_column);
        $$ = new AssignmentArray($3,$1,@1.first_line,@1.first_column);     
    } 
;
 


Asignation
    :  IdAssign '=' Expr
    {           
         //$$ = new pruebaAsign($1,$3,@1.first_line, @1.first_column);
         $$ = new AssignmentArreglo($1,$3,@1.first_line,@1.first_column);
         //$$ = new Assignment($1,$3,@1.first_line,@1.first_column);
    } 
    | ID '=' Expr 
    {   
        //$$ = new Asignation($1, $3, @1.first_line, @1.first_column,1);
        $1 = new AssignmentId($1,null,@1.first_line,@1.first_column);
        $$ = new Assignment($1,$3,@1.first_line,@1.first_column);
    }
    | ID '++' 
    {       
        //$$ = new Asignation($1, null, @1.first_line, @1.first_column,2);
        $1 = new AccessId($1,null,@1.first_line,@1.first_column);
        $$ = new PostIncrement($1,@1.first_line,@1.first_column);
    }
    | ID '--' 
    { 
        
        //$$ = new Asignation($1, null, @1.first_line, @1.first_column,3);
        $1 = new AccessId($1,null,@1.first_line,@1.first_column);
        $$ = new PostDecrement($1,@1.first_line,@1.first_column);
    }  
;



Statement
    : '{' Instructions '}' {
        //$$ = new Statement($2, @1.first_line, @1.first_column);
         $$ = new InstrBody($2,@1.first_line,@1.first_column);
    }
    | '{' '}' {
       // $$ = new Statement(new Array(), @1.first_line, @1.first_column);
        $$ = new InstrBody(new Array(),@1.first_line,@1.first_column);
    }
;

StatementSw
    :  Instructions {
        //$$ = new Statement($1, @1.first_line, @1.first_column);
         $$ = new InstrBody($1,@1.first_line,@1.first_column);
    }   
;

IfSt
    :IF '(' Expr ')' Statement {
        $$ = new If($3, $5, null, @1.first_line, @1.first_column);
    }
    |'IF' '(' Expr ')' Statement 'ELSE' Statement{
        //$$ = new If($3, $5, $6, @1.first_line, @1.first_column);
        $$ = new If($3, $5, $7, @1.first_line, @1.first_column);
    }
    |'IF' '(' Expr ')' Statement 'ELSE' IfSt{
        //$$ = new If($3, $5, $6, @1.first_line, @1.first_column);
        $$ = new If($3, $5, $7, @1.first_line, @1.first_column);
    }
;



WhileSt
    : 'WHILE' '(' Expr ')' Statement{
       // $$ = new While($3, $5, @1.first_line, @1.first_column);
       $$ = new While($3, $5, @1.first_line, @1.first_column);
    }
;



doWhileSt
    : 'DO' Statement 'WHILE' '(' Expr ')' ';' {
        // $$ = new doWhile($5, $2, @1.first_line, @1.first_column);
         $$ = new DoWhile($5, $2, @1.first_line, @1.first_column); 
    }
;


SwitchSt
    : 'SWITCH' '(' Expr ')' '{' CaseSt'}'{
       $$ = new Switch($3, $6, @1.first_line, @1.first_column);
    }
;



CaseSt
 : CaseSt CaseEvalSt{
     $1.push($2);
     $$ = $1;
  }
  |
  CaseEvalSt{
    $$ = [$1];
    
  }  
;



CaseEvalSt

: 'CASE' Expr ':' StatementSw {
   $$ = new Case($2,$4, @1.first_line, @1.first_column,"case");

}
| 'CASE' Expr ':' {
   $$ = new Case($2,null, @1.first_line, @1.first_column,"case");    
 
}
| 'DEFAULT' ':' StatementSw {
   $$ = new Case(null,$3, @1.first_line, @1.first_column,"default");  
  
}
| 'DEFAULT' ':' {
   $$ = new Case(null,null, @1.first_line, @1.first_column,"default");    
}

;



ForSt
: 'FOR' '(' Asignation ';'Expr';' Asignation')' Statement{
    $$ = new For($3, $5, $7, $9, @1.first_line, @1.first_column);
    
}
| 'FOR' '(' Declaration';'Expr';' Asignation')' Statement{
   $$ = new For($3, $5, $7, $9, @1.first_line, @1.first_column);
   
}
| 'FOR' '(' Declaration 'IN' 'ID' ')' Statement{
  // $$ = new For2(null,$3, $5, $7, @1.first_line, @1.first_column,1);
   $$ = "for "+"("+$3+" in "+$5+")"+$7;
}
| 'FOR' '(' 'ID' 'IN' 'ID' ')' Statement{
  // $$ = new For2($3,null, $5, $7, @1.first_line, @1.first_column,2);
   $$ = "for "+"("+$3+" in "+$5+")"+$7;
}
| 'FOR' '(' Declaration 'OF' 'ID' ')' Statement{
  // $$ = new For2(null,$3, $5, $7,  @1.first_line, @1.first_column,3);
   $$ = "for "+"("+$3+" of "+$5+")"+$7;
}
| 'FOR' '(' 'ID' 'OF' 'ID' ')' Statement{
   //$$ = new For2($3,null, $5, $7, @1.first_line, @1.first_column,4);
   $$ = "for "+"("+$3+" of "+$5+")"+$7;
}
;





TernarioSt:
    Expr '?' Expr ':' Expr 
    {
       // $$ = new Condition($1, $3, $5,@1.first_line, @1.first_column);
        $$ = new Ternario($3,$5,$1, @1.first_line, @1.first_column); 
    }
    ;




Expr
    : '-' Expr %prec UMENOS
    {
       // $$ = new Arithmetic($2, null, ArithmeticOption.NEGATIVE, @1.first_line,@1.first_column);
       $$ = new Times($2, null, @1.first_line, @1.first_column); 
    } 
    |'!' Expr
    {
       // $$ = new Logic($2, null, LogicOption.NOT, @1.first_line,@1.first_column);
         $$ = new Not($2, @1.first_line, @1.first_column); 
    }
    |Expr '+' Expr
    {
        //$$ = new Arithmetic($1, $3, ArithmeticOption.PLUS, @1.first_line,@1.first_column);
          $$ = new Plus($1, $3, @1.first_line, @1.first_column); 
    }       
    | Expr '-' Expr
    {
        //$$ = new Arithmetic($1, $3, ArithmeticOption.MINUS, @1.first_line,@1.first_column);
        $$ = new Minus($1, $3, @1.first_line, @1.first_column); 
    }
    | Expr '*' Expr
    { 
        //$$ = new Arithmetic($1, $3, ArithmeticOption.TIMES, @1.first_line,@1.first_column);
        $$ = new Times($1, $3, @1.first_line, @1.first_column); 
    }       
    | Expr '/' Expr
    {
        //$$ = new Arithmetic($1, $3, ArithmeticOption.DIV, @1.first_line,@1.first_column);
        $$ = new Div($1, $3, @1.first_line, @1.first_column); 
    }
    | Expr '%' Expr
    {
       // $$ = new Arithmetic($1, $3, ArithmeticOption.MOD, @1.first_line,@1.first_column);
        $$ = new Mod($1, $3, @1.first_line, @1.first_column); 
    }
    | Expr '**' Expr
    {
        //$$ = new Arithmetic($1, $3, ArithmeticOption.POT, @1.first_line,@1.first_column);
        $$ = new Pot($1, $3, @1.first_line, @1.first_column); 
    }
    | Expr '<' Expr
    {
       // $$ = new Relational($1, $3,RelationalOption.LESS, @1.first_line, @1.first_column);
        $$ = new Less(false,$1, $3, @1.first_line, @1.first_column); 
    }
    | Expr '<=' Expr
    {
        //$$ = new Relational($1, $3,RelationalOption.LESSOREQUAL ,@1.first_line, @1.first_column);
         $$ = new Less(true,$1, $3, @1.first_line, @1.first_column); 
    }
    | Expr '>' Expr
    {
        //$$ = new Relational($1, $3,RelationalOption.GREATER ,@1.first_line, @1.first_column);
         $$ = new Greater(false,$1, $3, @1.first_line, @1.first_column); 
    }
    | Expr '>=' Expr
    {
        //$$ = new Relational($1, $3,RelationalOption.GREATEROREQUAL ,@1.first_line, @1.first_column);
       $$ = new Greater(true,$1, $3, @1.first_line, @1.first_column); 
    }
    | Expr '==' Expr
    {
        //$$ = new Relational($1, $3,RelationalOption.EQUAL ,@1.first_line, @1.first_column);
        $$ = new Equals($1, $3, @1.first_line, @1.first_column); 
    }
    | Expr '!=' Expr
    {
       // $$ = new Relational($1, $3,RelationalOption.NOTEQUAL ,@1.first_line, @1.first_column);
       $$ = new NotEquals($1, $3, @1.first_line, @1.first_column); 
    }
    | Expr '&&' Expr
    {
        //$$ = new Logic($1, $3,LogicOption.AND ,@1.first_line, @1.first_column);
        $$ = new And($1, $3, @1.first_line, @1.first_column);  
    }
    | Expr '||' Expr
    {
        //$$ = new Logic($1, $3,LogicOption.OR ,@1.first_line, @1.first_column);
        $$ = new Or($1, $3, @1.first_line, @1.first_column); 
    }  
    |TernarioSt{
        $$ = $1;
    } 
    | F
    {
        $$ = $1;
    }
;
  
  



F
   : '(' Expr ')'
    { 
        //$$ = $2;
        $$ = $2;
    }
    | DECIMAL
    { 
        //$$ = new Literal($1, @1.first_line, @1.first_column, 0);
        $$ = new PrimitiveL(Types.DOUBLE, $1, @1.first_line, @1.first_column); 
    }
    | ENTERO
    { 
        //$$ = new Literal($1, @1.first_line, @1.first_column, 1);
         $$ = new PrimitiveL(Types.INTEGER, $1, @1.first_line, @1.first_column); 
    }
    | CADENA
    {
        //$$ = new Literal($1.replace(/\"/g,""), @1.first_line, @1.first_column, 2);
        $$ = new StringL(Types.STRING,$1.replace(/\"/g,""),@1.first_line,@1.first_column);
    }
    | CADENAB
    {
       // $$ = new Literal($1.replace(/\'/g,""), @1.first_line, @1.first_column, 2);
        $$ = new StringL(Types.STRING,$1.replace(/\'/g,""),@1.first_line,@1.first_column);
        $$ = $1;
    }
    | TRUE
    {
        //$$ = new Literal(true, @1.first_line, @1.first_column, 3);
        $$ = new PrimitiveL(Types.BOOLEAN, true, @1.first_line, @1.first_column);
    }
    | FALSE
    {
        //$$ = new Literal(false, @1.first_line, @1.first_column, 3);
         $$ = new PrimitiveL(Types.BOOLEAN, false, @1.first_line, @1.first_column); 
    }
    | NULL
    {
        $$ = new PrimitiveL(Types.NULL,'-1',@1.first_line,@1.first_column);
    }
    |
     ID 'LENGTH' 
    {
        //$$ = new Access($1,null, @1.first_line, @1.first_column,2);
        $$ = new  accesstr($1,null,1,null,@1.first_line,@1.first_column);
    }
    |
     ID 'CHARAT' '(' Expr ')'
    {
        //$$ = new Access($1,null, @1.first_line, @1.first_column,2);
        $$ = new  accesstr($1,null,2,$4,@1.first_line,@1.first_column);
    }
    |
     ID 'CONCAT' '(' Expr ')'
    {
        //$$ = new Access($1,null, @1.first_line, @1.first_column,2);
        $$ = new  accesstr($1,null,5,$4,@1.first_line,@1.first_column);
    }
    |
     ID 'LOWER' '('')'
    {
        //$$ = new Access($1,null, @1.first_line, @1.first_column,2);
        $$ = new  accesstr($1,null,3,$4,@1.first_line,@1.first_column);
    }
    |
     ID 'UPPER' '('')'
    {
        //$$ = new Access($1,null, @1.first_line, @1.first_column,2);
        $$ = new  accesstr($1,null,4,$4,@1.first_line,@1.first_column);
    }
    |
     ID
    {
        //$$ = new Access($1,null, @1.first_line, @1.first_column,2);
        $$ = new AccessId($1,null,@1.first_line,@1.first_column);
    }
    |Call
    {
        //$$ = $1;
        $$ = $1;
    }
    |ArrayAcces{
        $$ = $1;
    }
    | 'NEW' 'ARRAY' '(' Expr ')'
    { 
        $$ = new NewArray($4,@1.first_line, @1.first_column);
    }
    |'[' ListaExpr ']'
    {
       $$ = new ArrayExpr($2,@1.first_line, @1.first_column);
    }
;


ArrayAcces
  : ArrayAcces '['Expr']'{
    $$ = new AccessArray($3,$1,@1.first_line, @1.first_column,true);   
  }
  | ID '['Expr']'
  {
    $1= new AccessId($1,null,@1.first_line, @1.first_column);  
    $$ = new AccessArray($3,$1,@1.first_line, @1.first_column,true);
  }
;
