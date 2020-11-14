/**
 * Gramatica para analisis del lenguaje java
 */

/* Analizador Lexico */
%{
  const {Arithmetic, ArithmeticOption} = require('../Interprete/Expression/Arithmetic');
  const {Relational, RelationalOption} = require('../Interprete/Expression/Relational');
  const {Access} = require('../Interprete/Expression/Access');
  const {Literal} = require('../Interprete/Expression/Literal');
  const {AccesoArray} = require('../Interprete/Expression/AccesoArray');
  const {Declaration} = require('../Interprete/Instruction/Declaration');
  const {DeclarationArray} = require('../Interprete/Instruction/DeclarationArray');
  const {DeclarationArray2} = require('../Interprete/Instruction/DeclarationArray2');
  const {DecArray} = require('../Interprete/Instruction/DecArray');
  const {Logic,LogicOption} = require('../Interprete/Expression/Logic');
  const {Function} = require('../Interprete/Instruction/Function');
  const {Asignation} = require('../Interprete/Instruction/Asignation');
  const {AsignationArray} = require('../Interprete/Instruction/AsignationArray');
  const {AsignationArray2} = require('../Interprete/Instruction/AsignationArray2');
  const {If} = require('../Interprete/Instruction/If');
  const {While} = require('../Interprete/Instruction/While');
  const {doWhile} = require('../Interprete/Instruction/doWhile');
  const {Statement} = require('../Interprete/Instruction/Statement');
  const {Switch} = require('../Interprete/Instruction/Switch');
  const {Case} = require('../Interprete/Instruction/Case');
  const {For} = require('../Interprete/Instruction/For');
  const {For2} = require('../Interprete/Instruction/For2');
  const {FunctionArray} = require('../Interprete/Instruction/FunctionArray');
  const {Condition} = require('../Interprete/Expression/Condition');
  const {Print} = require('../Interprete/Instruction/Print');
  const {Continue} = require('../Interprete/Instruction/Continue');
  const {Break} = require('../Interprete/Instruction/Break');
  const {Call} = require('../Interprete/Instruction/Call');
  const {Return} = require('../Interprete/Instruction/Return');
  const {Prueba} = require('../Interprete/Instruction/Prueba');
  const {CadenaParam} = require('../Interprete/Instruction/CadenaParam');
  const {pruebaAsign} = require('../Interprete/Instruction/pruebaAsign');
  const {ArrayLenght} = require('../Interprete/Expression/ArrayLenght');
  const {registrarError} = require('../Interprete/Instruction/registrarError');
  const {Graficar} = require('../Interprete/Instruction/graficar');
	 
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
                       e.execute();
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
                  e.execute();
    }
    
    | error '}'{  console.error('Error Sintactico: ' + $1 + ' linea: ' + @1.first_line + ' columna: ' + @1.first_column+" se esperaba: " + yy.parser.hash.expected.join(",")); 
                  let e = new registrarError(@1.first_line, @1.first_column,$1,yy.parser.hash.expected.join(","),2);
                  e.execute();
    }

    | Declaration{
        $$ = $1;
    }
    |DeclarationArray {
        $$ = $1;
    }
    | Asignation{
         //console.log("entra a asignar");
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
        $$ = new Break(@1.first_line, @1.first_column);
    }
    | 'CONTINUE' ';'{
        $$ = new Continue(@1.first_line, @1.first_column);
    }
    | ReturnSt{ 
        $$ = $1;
    }
    | FunctionSt {
        $$ = $1;
    }
    | FunctionArray {
        $$ = $1;
    }
    | 
     Call ';'{
         $$ = $1;
    }
    |TernarioSt ';'{
        $$ = $1;
    } 
    |
     'GRAPH' ';'{
         $$ = new Graficar(@1.first_line, @1.first_column);
    }  
    
     
    
;           


PrintSt 
    : 'PRINT' '(' Expr ')' ';' {
        
        $$ = new Print($3, @1.first_line, @1.first_column);
        
    }
;




ReturnSt 
    : 'RETURN' ';' {
        $$ = new Return(null, @1.first_line, @1.first_column);
    }
    | 'RETURN' Expr ';'{
         $$ = new Return($2, @1.first_line, @1.first_column);
    }
   
;  




Call
    : ID '(' ')'  {
        $$ = new Call($1, [], @1.first_line, @1.first_column);
    }
    | ID '(' ListaExpr ')'  {
        $$ = new Call($1, $3, @1.first_line, @1.first_column);
    }
;




FunctionArray
    :
     ID  'PUSH' '(' Expr ')' ';'  {
        $$ = new FunctionArray ($1,$4,"push",1, @1.first_line, @1.first_column);
    }
    | ID 'POP' '(' ')' ';'  {
        $$ = new FunctionArray ($1,null,"pop",2, @1.first_line, @1.first_column);
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
    : 'FUNCTION' ID '(' ')' StatementFunc {
        $$ = new Function($2,null,null, $5, [], @1.first_line, @1.first_column);
    }
    | 'FUNCTION' ID '(' Parametros ')' StatementFunc {
        $$ = new Function($2, $4,null, $6, @1.first_line, @1.first_column);
    }
    | 'FUNCTION' ID '(' ')' ':' TipoParam  StatementFunc {
        $$ = new Function($2,null, $6, $7, @1.first_line, @1.first_column);
    }
    | 'FUNCTION' ID '(' Parametros ')' ':' TipoParam StatementFunc {
        $$ = new Function($2,$4, $7, $8, @1.first_line, @1.first_column);
    }
;

StatementFunc
    : '{' Instructions '}' {
        $$ = $2;
    }
    | '{' '}' {
        $$ = new Array();
    }
;


Parametros
    : Parametros ',' ID ':' TipoParam {
        $1.push($3,$5);
        $$ = $1;
    }
    | ID ':' TipoParam {
        $$ = [$1,$3];
    }
;

TipoParam  
    : 
     NUMBER
    { 
        $$ = 0;
    }
    | STRING
    { 
        $$ = 1;
    }
    
    | BOOLEAN
    {
        $$ = 2;
    }
    | NULL
    {
        $$ = 3;
    }  
    | ARRAY
    {
        $$ = 4;
    }  
    
    | VOID
    {
        $$ = 5;
    }   
    | ANY
    {
        $$ = 6;
    } 
    | NUMBER ListaLlaves
    {
        $$ = 7;
    } 
    | STRING ListaLlaves
    {
        $$ = 8;
    } 
    | BOOLEAN ListaLlaves
    {
        $$ = 9;
    }
;



Declaration  
    :
    'LET' ID ';' 
    {
        $$ = new Declaration($2, null, @1.first_line, @1.first_column,null,2);
    }
    |
    'LET' ID '=' Expr ';' 
    {
        $$ = new Declaration($2, $4, @1.first_line, @1.first_column,null,2);
    }
    |'LET' ID  ':' Tipo '=' Expr ';'
    {
        $$ = new Declaration($2, $6, @1.first_line, @1.first_column,$4,2);
    }
    |'LET' ID  ':' Tipo ';'
    {
        $$ = new Declaration($2, null, @1.first_line, @1.first_column,$4,2);
    }
    
    |'CONST' ID '=' Expr ';'
    {
        $$ = new Declaration($2, $4, @1.first_line, @1.first_column,null,1);
    }
    |'CONST' ID  ':' Tipo '=' Expr  ';'
    {
        $$ = new Declaration($2, $6, @1.first_line, @1.first_column,$4,1);
    }
    |'CONST' ID  ':' Tipo ';'
    {
        $$ = new Declaration($2, null, @1.first_line, @1.first_column,$4,1);
    }
    |
    'CONST' ID ';' 
    {
        $$ = new Declaration($2, null, @1.first_line, @1.first_column,null,1);
    }
     
    
;




DeclarationArray 
    :
    'LET' ID  ':' Tipo ListaLlaves  ';'
    {
        $$ = new DeclarationArray2($2, null, @1.first_line, @1.first_column,$4,2,$5);
        //$$ = new DeclarationArray($2, null, @1.first_line, @1.first_column,$4,2,$5);
    }
    |'LET' ID  ':' Tipo ListaLlaves  '=' Expr ';'
    {
        // $$ = new DeclarationArray($2, $8, @1.first_line, @1.first_column,$4,2,$5);
         $$ = new DeclarationArray2($2, $7, @1.first_line, @1.first_column,$4,2,$5);
    }
    /*|'LET' ID  ':' Tipo ListaLlaves  '=''[' ']'';'
    {
        //$$ = new DeclarationArray($2, null, @1.first_line, @1.first_column,$4,2,$5);
        $$ = new DeclarationArray2($2, null, @1.first_line, @1.first_column,$4,2,$5);
    }*/
    |'CONST' ID ':' Tipo ListaLlaves  ';'
    {
        //$$ = new DeclarationArray($2, null, @1.first_line, @1.first_column,$4,1,$5);
        $$ = new DeclarationArray2($2, null, @1.first_line, @1.first_column,$4,1,$5);
    }
    |'CONST' ID  ':' Tipo ListaLlaves  '=' Expr ';'
    {
        //$$ = new DeclarationArray($2, $8, @1.first_line, @1.first_column,$4,1,$5);
        $$ = new DeclarationArray2($2, $7, @1.first_line, @1.first_column,$4,1,$5);
    }
    /*|'CONST' ID  ':' Tipo ListaLlaves  '=''[' ']'';'
    {
       // $$ = new DeclarationArray($2,null, @1.first_line, @1.first_column,$4,1);
        $$ = new DeclarationArray2($2,null, @1.first_line, @1.first_column,$4,1);
    }*/  
;
    
  
  ListaLlaves 
    : ListaLlaves '['']'{
        $1.push($2);
        $$ = $1;
    }
    | '['']'{
        $$ = [$1];
    }
; 

ListaIndices
    : ListaIndices '['Expr']'{
        $1.push($3);
        $$ = $1;
    }
    | '['Expr']'{
        $$ = [$2];
    }
; 


Asignation
    :  ArrayAcces '=' Expr ';'
    {                 
         $$ = new pruebaAsign($1,$3,@1.first_line, @1.first_column);
    } 
    | ID '=' Expr ';'
    {   
        $$ = new Asignation($1, $3, @1.first_line, @1.first_column,1);
        
    } 
    | ID '++' ';'
    { 
        
        $$ = new Asignation($1, null, @1.first_line, @1.first_column,2);
    }
    | ID '--' ';'
    { 
        
        $$ = new Asignation($1, null, @1.first_line, @1.first_column,3);
    }  
;




ListaValores
    : ListaValores ',' Expr{
        $1.push($3);
        $$ = $1;
    }
    | Expr{
        $$ = [$1];
    }
;  

Tipo  
    : 
     NUMBER
    { 
        $$ = 0;
    }
    | STRING
    { 
        $$ = 1;
    }
    
    | BOOLEAN
    {
        $$ = 2;
    }
    | NULL
    {
        $$ = 3;
    }  
    | ARRAY
    {
        $$ = 4;
    }  
    
    | VOID
    {
        $$ = 5;
    }   
    | ANY
    {
        $$ = 6;
    } 
;




IfSt
    : 'IF' '(' Expr ')' Statement ElseSt{
        $$ = new If($3, $5, $6, @1.first_line, @1.first_column);
    }
;




ElseSt
    : 'ELSE' Statement {
        $$ = $2;
    }
    | 'ELSE' IfSt {
        $$ = $2;
    }
    | /* epsilon */
    {
        $$ = null;
    }
;




WhileSt
    : 'WHILE' '(' Expr ')' Statement{
        $$ = new While($3, $5, @1.first_line, @1.first_column);
    }
;



doWhileSt
    : 'DO' Statement 'WHILE' '(' Expr ')' ';' {
         $$ = new doWhile($5, $2, @1.first_line, @1.first_column);
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
: 'FOR' '(' AsignationFor ';'Expr';' AsignationFor')' Statement{
    $$ = new For($3, $5, $7, $9, @1.first_line, @1.first_column);
}
| 'FOR' '(' DeclarationFor';'Expr';' AsignationFor')' Statement{
   $$ = new For($3, $5, $7, $9, @1.first_line, @1.first_column);
}
| 'FOR' '(' DeclarationFor 'IN' 'ID' ')' Statement{
   $$ = new For2(null,$3, $5, $7, @1.first_line, @1.first_column,1);
}
| 'FOR' '(' 'ID' 'IN' 'ID' ')' Statement{
   $$ = new For2($3,null, $5, $7, @1.first_line, @1.first_column,2);
}
| 'FOR' '(' DeclarationFor 'OF' 'ID' ')' Statement{
   $$ = new For2(null,$3, $5, $7,  @1.first_line, @1.first_column,3);
}
| 'FOR' '(' 'ID''OF' 'ID' ')' Statement{
   $$ = new For2($3,null, $5, $7, @1.first_line, @1.first_column,4);
}
;



DeclarationFor  
    :
    'LET' ID 
    {
        $$ = new Declaration($2, null, @1.first_line, @1.first_column,null,2);
    }
    |
    'LET' ID '=' Expr  
    {
        $$ = new Declaration($2, $4, @1.first_line, @1.first_column,null,2);
    }
    |'LET' ID  ':' Tipo '=' Expr 
    {
        $$ = new Declaration($2, $6, @1.first_line, @1.first_column,$4,2);
    }
    |'LET' ID  ':' Tipo 
    {
        $$ = new Declaration($2, null, @1.first_line, @1.first_column,$4,2);
    }
    
    |'CONST' ID '=' Expr 
    {
        $$ = new Declaration($2, $4, @1.first_line, @1.first_column,null,1);
    }
    |'CONST' ID  ':' Tipo '=' Expr  
    {
        $$ = new Declaration($2, $6, @1.first_line, @1.first_column,$4,1);
    }
    |'CONST' ID  ':' Tipo 
    {
        $$ = new Declaration($2, null, @1.first_line, @1.first_column,$4,1);
    }
    |
    'CONST' ID 
    {
        $$ = new Declaration($2, null, @1.first_line, @1.first_column,null,1);
    }
;



AsignationFor
    :ID '=' Expr 
    {
        $$ = new Asignation($1, $3, @1.first_line, @1.first_column,1);
    } 
    | ID '++' 
    { 
        $$ = new Asignation($1, null, @1.first_line, @1.first_column,2);
    }
    | ID '--' 
    { 
        $$ = new Asignation($1, null, @1.first_line, @1.first_column,3);
    }  
;



Statement
    : '{' Instructions '}' {
        $$ = new Statement($2, @1.first_line, @1.first_column);
    }
    | '{' '}' {
        $$ = new Statement(new Array(), @1.first_line, @1.first_column);
    }
;

TernarioSt:
    Expr '?' Expr ':' Expr 
    {
        $$ = new Condition($1, $3, $5,@1.first_line, @1.first_column);
    }
    ;

StatementSw
    :  Instructions {
        $$ = new Statement($1, @1.first_line, @1.first_column);
    }   
;

ArrayDec
  :'[' ListaExpr ']'{
     $$ = new DecArray($2,@1.first_line, @1.first_column);
  }
  | '[' ']'{
    $$ = new DecArray([],@1.first_line, @1.first_column);
  }
  ;

  ArrayAcces
  : ArrayAcces '['Expr']'{

   $$ = new AccesoArray('',$3,$1,@1.first_line, @1.first_column,null,null);

  }
  | ID  '['Expr']'{

    $$ = new AccesoArray($1,$3,null,@1.first_line, @1.first_column,null,null);
  }
;

Expr
    : '-' Expr %prec UMENOS
    {
        $$ = new Arithmetic($2, null, ArithmeticOption.NEGATIVE, @1.first_line,@1.first_column);
    } 
    |'!' Expr
    {
        $$ = new Logic($2, null, LogicOption.NOT, @1.first_line,@1.first_column);
    }
    |Expr '+' Expr
    {
        $$ = new Arithmetic($1, $3, ArithmeticOption.PLUS, @1.first_line,@1.first_column);
       
    }       
    | Expr '-' Expr
    {
        $$ = new Arithmetic($1, $3, ArithmeticOption.MINUS, @1.first_line,@1.first_column);
    }
    | Expr '*' Expr
    { 
        $$ = new Arithmetic($1, $3, ArithmeticOption.TIMES, @1.first_line,@1.first_column);
    }       
    | Expr '/' Expr
    {
        $$ = new Arithmetic($1, $3, ArithmeticOption.DIV, @1.first_line,@1.first_column);
    }
    | Expr '%' Expr
    {
        $$ = new Arithmetic($1, $3, ArithmeticOption.MOD, @1.first_line,@1.first_column);
    }
    | Expr '**' Expr
    {
        $$ = new Arithmetic($1, $3, ArithmeticOption.POT, @1.first_line,@1.first_column);
    }
    | Expr '<' Expr
    {
        $$ = new Relational($1, $3,RelationalOption.LESS, @1.first_line, @1.first_column);
    }
    | Expr '<=' Expr
    {
        $$ = new Relational($1, $3,RelationalOption.LESSOREQUAL ,@1.first_line, @1.first_column);
    }
    | Expr '>' Expr
    {
        $$ = new Relational($1, $3,RelationalOption.GREATER ,@1.first_line, @1.first_column);
    }
    | Expr '>=' Expr
    {
        $$ = new Relational($1, $3,RelationalOption.GREATEROREQUAL ,@1.first_line, @1.first_column);
    }
    | Expr '==' Expr
    {
        $$ = new Relational($1, $3,RelationalOption.EQUAL ,@1.first_line, @1.first_column);
    }
    | Expr '!=' Expr
    {
        $$ = new Relational($1, $3,RelationalOption.NOTEQUAL ,@1.first_line, @1.first_column);
    }
    | Expr '&&' Expr
    {
        $$ = new Logic($1, $3,LogicOption.AND ,@1.first_line, @1.first_column);
    }
    | Expr '||' Expr
    {
        $$ = new Logic($1, $3,LogicOption.OR ,@1.first_line, @1.first_column);
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
        $$ = $2;
    }
    |ArrayDec
    { 
     
        $$ = $1;
    }
    | DECIMAL
    { 
        $$ = new Literal($1, @1.first_line, @1.first_column, 0);
    }
    | ENTERO
    { 
        $$ = new Literal($1, @1.first_line, @1.first_column, 1);
        
    }
    | CADENA
    {
        $$ = new Literal($1.replace(/\"/g,""), @1.first_line, @1.first_column, 2);
    }
    | CADENAB
    {
        $$ = new Literal($1.replace(/\'/g,""), @1.first_line, @1.first_column, 2);
    }
    | CADENAPARAM
    {
        $$ = new CadenaParam($1.replace(/\`/g,""), @1.first_line, @1.first_column);
    }
    | TRUE
    {
        $$ = new Literal(true, @1.first_line, @1.first_column, 3);
    }
    | FALSE
    {
        $$ = new Literal(false, @1.first_line, @1.first_column, 3);
    }
    | NULL
    {
        $$ = new Literal($1, @1.first_line, @1.first_column, 4);
    }
    |
     ID 'LENGTH' 
    {
        $$ = new Access($1,null, @1.first_line, @1.first_column,2);
    }
    | ID
    {
        $$ = new Access($1,null, @1.first_line, @1.first_column,1);
    }
    |Call{
        $$ = $1;
    }
    |ArrayAcces 'LENGTH'{
        $$ = new ArrayLenght($1,@1.first_line, @1.first_column);
    }
    |ArrayAcces{
        $$ =$1;
    }
    
    
    
;