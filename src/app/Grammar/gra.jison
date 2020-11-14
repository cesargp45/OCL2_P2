
%{

%}


%lex

%options case-insensitive

%%
\s+											// se ignoran espacios en blanco
"//".*										// comentario simple línea
[/][*][^*]*[*]+([^/*][^*]*[*]+)*[/]			// comentario multiple líneas


"public"            return 'RPUBLIC';
"class"             return 'RCLASS';
"interface"         return 'RINTERFACE';
"for"               return 'RFOR';
"while"             return 'RWHILE';
"do"                return 'RDO';
"if"                return 'RIF';
"else"              return 'RELSE';
"break"             return 'RBREAK';
"continue"          return 'RCONTINUE';
"return"            return 'RRETURN';
"int"               return 'RINT';
"void"              return 'RVOID';
"boolean"           return 'RBOOLEAN';
"true"              return 'RTRUE';
"false"             return 'RFALSE';
"double"            return 'RDOUBLE';
"string"            return 'RSTRING';
"char"              return 'RCHAR';
"system"            return 'RSYSTEM';
"out"               return 'ROUT';
"println"           return 'RPRINTLN';
"print"             return 'RPRINT';
"static"            return 'RSTATIC';
"main"              return 'RMAIN';

">="                return 'MAYORIGUALQUE';
"<="                return 'MENORIGUALQUE';
"=="                return 'IGUALIGUAL';
"!="                return 'DIFERENTE'
"||"                return 'OR';
"&&"                return 'AND';
"!"                 return 'NOT';
"^"                 return 'XOR';
"<"                 return 'MENORQUE';
">"                 return 'MAYORQUE';

"++"                return 'ADICION';
"--"                return 'SUBSTRACCION';
"+"                 return 'MAS';
"-"                 return 'MENOS';
"*"                 return 'MULTIPLICACION';
"/"                 return 'DIVISION';


"."                 return 'PUNTO';
";"                 return 'PUNTOCOMA';
","                 return 'COMA';
"="                 return 'IGUAL';
"("                 return 'PARABRIR';
")"                 return 'PARCERRAR';
"{"                 return 'LLAVEABRIR';
"}"                 return 'LLAVECERRAR';
"["                 return 'CORABRIR';
"]"                 return 'CORCERRAR';


\"[^\"]*\"	                                                    return 'CADENA'; 
"'"[^']"'"				                                        return 'CARACTER';
[0-9]+("."[0-9]+)\b  											return 'DECIMAL';
[0-9]+\b														return 'ENTERO';
([a-zA-Z])[a-zA-Z0-9_]*	                                        return 'IDENTIFICADOR';

<<EOF>>             return 'EOF';

.                   {
                        console.log('Este es un error léxico: ' + yytext + ', en la linea: ' + yylloc.first_line + ', en la columna: ' + yylloc.first_column);
                    }
/lex

/*PRECEDENCIA*/
%left 'OR'
%left 'AND'
%left 'XOR'
%left 'IGUALIGUAL' 'DIFERENTE'
%left 'MAYORQUE' 'MENORQUE' 'MENORIGUALQUE' 'MAYORIGUALQUE'
%left 'MAS' 'MENOS'
%left 'MULTIPLICACION' 'DIVISION'
%right 'UMENOS' 'UNOT'

%start INICIO

%%

INICIO
    : INSTRUCCIONES EOF { return $1}
;

INSTRUCCIONES
    : INSTRUCCIONES INSTRUCCION { $$ = `${$1}${$2}`}
    | INSTRUCCION                { $$ = `${$1}`}
;

INSTRUCCION
    : SENTENCIAFOR                  { $$ = `${$1}`}
    | SENTENCIAWHILE                { $$ = `${$1}`}
    | SENTENCIADOWHILE PUNTOCOMA    { $$ = `${$1};`}
    | SENTENCIAIF                   { $$ = `${$1}`}
    | ASIGNACION PUNTOCOMA          { $$ = `${$1};`}
    | DECLARACION PUNTOCOMA         { $$ = `${$1};`}
    | PRINT PUNTOCOMA               { $$ = `${$1};`}
    | CALL PUNTOCOMA                { $$ = `${$1};`}
    | FUNCIONES                     { $$ = `${$1}`}
    | CLASES                        { $$ = `${$1}`}
    | INTERFACES                    { $$ = `${$1}`}
    | SENTENCIAS PUNTOCOMA          { $$ = `${$1};`}
    |                               { $$ = '';}
    | error PUNTOCOMA               
        {
            console.log('Este es un error sintáctico: ' + yytext + ', en la linea: ' + this._$.first_line + ', en la columna: ' + this._$.first_column); 
        }
;


SENTENCIADOWHILE
    : RDO LLAVEABRIR INTRUCCIONES LLAVECERRAR RWHILE PARABRIR EXP PARCERRAR { $$ = `do {\n${$3}\n} while (${$7})`;}
;

SENTENCIAWHILE
    : RWHILE PARABRIR EXP PARCERRAR LLAVEABRIR INSTRUCCIONES LLAVECERRAR { $$ = `while (${$3}) {\n${$6}\n}`;}
;

SENTENCIAFOR
    : RFOR PARABRIR DECLARACION PUNTOCOMA EXP PUNTOCOMA EXP PARCERRAR LLAVEABRIR INSTRUCCIONES LLAVECERRAR  { $$ = `for (${$3}; ${$5}; ${$7}) {\n${$10}\n}`;}
;

SENTENCIAIF
    : RIF PARABRIR EXP PARCERRAR LLAVEABRIR INSTRUCCIONES LLAVECERRAR                                               { $$ = `if(${$3}){\n${$6}\n}`;}
    | RIF PARABRIR EXP PARCERRAR LLAVEABRIR INSTRUCCIONES LLAVECERRAR RELSE LLAVEABRIR INSTRUCCIONES LLAVECERRAR    { $$ = `if(${$3}){\n${$6}\n} else {\n${$10}\n}`;}
    | RIF PARABRIR EXP PARCERRAR LLAVEABRIR INSTRUCCIONES LLAVECERRAR RELSE SENTENCIAIF                             { $$ = `if(${$3}){\n${$6}\n} else ${$9}`;}
;

INTERFACES
    : RPUBLIC RINTERFACE IDENTIFICADOR LLAVEABRIR INSTRUCCIONES LLAVECERRAR { $$ = '';}
;

CLASES
    : RPUBLIC RCLASS IDENTIFICADOR LLAVEABRIR INSTRUCCIONES LLAVECERRAR                                                         { $$ = `class ${$3} {\n${$5}\n}`;}
    | RPUBLIC RSTATIC TIPO RMAIN PARABRIR TIPO CORABRIR CORCERRAR IDENTIFICADOR PARCERRAR LLAVEABRIR INSTRUCCIONES LLAVECERRAR  { $$ = `class main {\n${$12}\n}`;}
;

FUNCIONES
    : RPUBLIC TIPO IDENTIFICADOR PARABRIR PARAMETROS PARCERRAR                                          { $$ = `function ${$3}(${$5})`;}
    | RPUBLIC TIPO IDENTIFICADOR PARABRIR PARAMETROS PARCERRAR LLAVEABRIR INSTRUCCIONES LLAVECERRAR     { $$ = `function ${$3}(${$5}) {\n${$8}\n}`;}
;

CALL
    : IDENTIFICADOR PARABRIR PARAMETROS PARCERRAR   { $$ = `${$1}(${$3})`;}
;

PRINT
    : RSYSTEM PUNTO ROUT PUNTO RPRINT PARABRIR EXP PARCERRAR    { $$ = `Console.log(${$7})`;}
    | RSYSTEM PUNTO ROUT PUNTO RPRINTLN PARABRIR EXP PARCERRAR    { $$ = `Console.log(${$7}\n)`;}
;

PARAMETROS
    : EXP PARAMETROS                        { $$ = `${$1}${$2}`;}
    | COMA EXP PARAMETROS                   { $$ = `, ${$2}${$3}`;}
    | COMA EXP                              { $$ = `, ${$2}`;}
    | EXP                                   { $$ = `${$1}`;}
    | TIPO IDENTIFICADOR PARAMETROS         { $$ = `${$1} ${$2}${$4}`;}
    | COMA TIPO IDENTIFICADOR PARAMETROS    { $$ = `, ${$2} ${$3}${$4}`;}
    | COMA TIPO IDENTIFICADOR               { $$ = `, ${$2} ${$3}`;}
    | TIPO IDENTIFICADOR                    { $$ = `${$1} ${$2}`;}
    |                                       { $$ = '';}
;

ASIGNACION
    : IDENTIFICADOR IGUAL EXP   { $$ = `${$1} = ${$3}`;}
;

SENTENCIAS
    : RBREAK        { $$ = 'break';}
    | RCONTINUE     { $$ = 'continue';}
    | RRETURN       { $$ = 'return';}
    | RRETURN EXP   { $$ = `return ${$2}`;}
;

DECLARACION
    : TIPO DECLARACION                          { $$ = `${$1}${$2}`;}
    | IDENTIFICADOR DECLARACION                 { $$ = `${$1}${$2}`;}              
    | IDENTIFICADOR IGUAL EXP DECLARACION       { $$ = `${$1} = ${$3}${$4}`;}
    | COMA IDENTIFICADOR DECLARACION            { $$ = `, ${$2}${$3}`;}
    | COMA IDENTIFICADOR IGUAL EXP DECLARACION  { $$ = `, ${$2} = ${$4}${$5}`;}
    | COMA IDENTIFICADOR                        { $$ = `, ${$2}`;}
    | COMA IDENTIFICADOR IGUAL EXP              { $$ = `, ${$2} = ${$4}`;}
    | IDENTIFICADOR                             { $$ = `${$1}`;}
    | IDENTIFICADOR IGUAL EXP                   { $$ = `${$1} = ${$3}`;}
;

TIPO
    : RINT      { $$ = 'var ';}
    | RSTRING   { $$ = 'var ';}
    | RBOOLEAN  { $$ = 'var ';}
    | RDOUBLE   { $$ = 'var ';}
    | RCHAR     { $$ = 'var ';}
    | RVOID     { $$ = 'var ';}
;


EXP
    : EXP AND EXP               { $$ = `${$1} && ${$3}`;}
    | EXP OR EXP                { $$ = `${$1} || ${$3}`;}
    | EXP XOR EXP               { $$ = `${$1} ^ ${$3}`;}
    | NOT EXP %prec UNOT        { $$ = `!${$2}`;}
    | EXP MAYORQUE EXP          { $$ = `${$1} > ${$3}`;}
    | EXP MENORQUE EXP          { $$ = `${$1} < ${$3}`;}
    | EXP MAYORIGUALQUE EXP     { $$ = `${$1} >= ${$3}`;}
    | EXP MENORIGUALQUE EXP     { $$ = `${$1} <= ${$3}`;}
    | EXP IGUALIGUAL EXP        { $$ = `${$1} == ${$3}`;}
    | EXP DIFERENTE EXP         { $$ = `${$1} != ${$3}`;}
    | EXP MAS EXP               { $$ = `${$1} + ${$3}`;}
    | EXP MENOS EXP             { $$ = `${$1} - ${$3}`;}
    | EXP MULTIPLICACION EXP    { $$ = `${$1} * ${$3}`;}
    | EXP DIVISION EXP          { $$ = `${$1} / ${$3}`;}
    | EXP ADICION               { $$ = `${$1}++`;}
    | EXP SUBSTRACCION          { $$ = `${$1}--`;}
    | MENOS EXP %prec UMENOS    { $$ = `-${$2}`;}
    | PARABRIR EXP PARCERRAR    { $$ = `(${$2})`;}*/
    : IDENTIFICADOR             { $$ = $1;}
    | CADENA                    { $$ = `${$1}`;}
    | CARACTER                  { $$ = `${$1}`;}
    | RTRUE                     { $$ = `true`;}
    | RFALSE                    { $$ = `false`;}
    | ENTERO                    { $$ = `${$1}`;}
    | DECIMAL                   { $$ = `${$1}`;}
    
;
