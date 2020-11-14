/**
 * Gramatica para analisis del lenguaje java
 */

/* Analizador Lexico */
%{
  
	 var funciones = new Array();
     var nom = new Array();
     const {registrarError} = require('../Interprete/Instruction/registrarError');
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
        $1 += $2;
        $$ = $1;
    }
    | Instruction{
        $$ = $1;
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
       $$ ="break;\n";
    }
    | 'CONTINUE' ';'{
        //$$ = new Continue(@1.first_line, @1.first_column);
        $$ ="continue;\n";
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
        // $$ = $1;
         $$ = $1+";\n"
    }
    |TernarioSt ';'{
       // $$ = $1;
        $$ = $1+";\n"
    } 
    |
     'GRAPH' ';'{
        // $$ = new Graficar(@1.first_line, @1.first_column);
        $$ =$1+";\n"
    }  
    
     
    
;           


PrintSt 
    : 'PRINT' '(' Expr ')' ';' {
        
     //$$ = new Print($3, @1.first_line, @1.first_column);
        $$ = $1+"("+$3+")"+";\n";
        
    }
;




ReturnSt 
    : 'RETURN' ';' {
        //$$ = new Return(null, @1.first_line, @1.first_column);
        $$ ="return;\n";
    }
    | 'RETURN' Expr ';'{
         //$$ = new Return($2, @1.first_line, @1.first_column);
         $$ ="return "+$2+";\n";
    }
   
;  




Call
    : ID '(' ')'  {
       // $$ = new Call($1, [], @1.first_line, @1.first_column);
        var n = $1;
        for(let i = 0;i<nom.length;i++){
             if($1 == nom[i].ant){
                 n = nom[i].id;
                 break;
             }
        }
          $$ = n+"()";
    }
    | ID '(' ListaExpr ')'  {
        //$$ = new Call($1, $3, @1.first_line, @1.first_column);
        var n = $1;
        for(let i = 0;i<nom.length;i++){
             if($1 == nom[i].ant){
                 n = nom[i].id;
                 break;
             }
        }
        $$ = n+"("+$3+")";
    }
;




FunctionArray
    :
     ID  'PUSH' '(' Expr ')' ';'  {
        //$$ = new FunctionArray ($1,$4,"push",1, @1.first_line, @1.first_column);
        $$ = $1+$2+"("+$4+")"+";\n";
    }
    | ID 'POP' '(' ')' ';'  {
        //$$ = new FunctionArray ($1,null,"pop",2, @1.first_line, @1.first_column);
        $$ = $1+$2+"("+")"+";\n";
    }
;




ListaExpr 
    : ListaExpr ',' Expr{
       // $1.push($3);               
       // $$ = $1;
        $1 += ","+$3;
        $$ = $1;
        
    }
    | Expr{
       // $$ = [$1];
        $$ = $1;
    }
;    




FunctionSt 
    : 'FUNCTION' ID '(' ')' '{' Instructions '}' {
        //$$ = new Function($2,null,null, $5, [], @1.first_line, @1.first_column);
         //$$ = "funcion "+$2+"("+")"+ $5;
         var stack = eval('$$');
         var bandera = false;
         var hijo = $2;

        for(let i = stack.length-8;i>=0;i--){
             if(stack[i] == "function"){  
                hijo = stack[i+1]+"_"+hijo;
               bandera = true            
             }                  
         }

         if (bandera == true){
          var fun = "funcion "+hijo+"("+")"+"{\n" +$6+"\n}\n";
          var obj = {id:hijo,value:fun};
          var obj2 = {id:hijo,ant:$2};
          funciones.push(obj);
          nom.push(obj2);
          $$ = "";           
         }else{
             var anidacion = "";
             while(funciones.length > 0){
                anidacion+= funciones.pop().value+"\n"
             }
             $$ = "funcion "+$2+"("+")"+"{\n" +$6+"\n}\n"+anidacion;
         }        
    }
    | 'FUNCTION' ID '(' Parametros ')' '{' Instructions '}' {
        //$$ = new Function($2, $4,null, $6, @1.first_line, @1.first_column);
         //$$ = "funcion "+$2+"("+$4+")"+ $6;
         var stack = eval('$$');
          var bandera = false;
         var hijo = $2;

        for(let i = stack.length-9;i>=0;i--){
             if(stack[i] == "function"){  
                hijo = stack[i+1]+"_"+hijo;
               bandera = true            
             }                  
         }

         if (bandera == true){
          var fun = "funcion "+hijo+"("+$4+")"+"{\n" +$7+"\n}\n";
          var obj = {id:hijo,value:fun};
          var obj2 = {id:hijo,ant:$2};
          funciones.push(obj);
          nom.push(obj2);
          $$ = "";           
         }else{
             var anidacion = "";
             while(funciones.length > 0){
                anidacion+= funciones.pop().value+"\n"
             }
             $$ = "funcion "+$2+"("+$4+")"+"{\n" +$7+"\n}\n"+anidacion;
         }        

    }
    | 'FUNCTION' ID '(' ')' ':' TipoParam  '{' Instructions '}' {
        //$$ = new Function($2,null, $6, $7, @1.first_line, @1.first_column);
        // $$ = "funcion "+$2+"("+")"+":"+$6+ $7;
         var stack = eval('$$');
         var bandera = false;
         var hijo = $2;

        for(let i = stack.length-10;i>=0;i--){
             if(stack[i] == "function"){  
                hijo = stack[i+1]+"_"+hijo;
               bandera = true            
             }                  
         }

         if (bandera == true){
          var fun = "funcion "+hijo+"("+")"+":"+$6+"{\n" +$8+"\n}\n";
          var obj = {id:hijo,value:fun};
          var obj2 = {id:hijo,ant:$2};
          funciones.push(obj);
          nom.push(obj2);
          $$ = "";           
         }else{
             var anidacion = "";
             while(funciones.length > 0){
                anidacion+= funciones.pop().value+"\n"
             }
             $$ = "funcion "+$2+"("+")"+":"+$6+"{\n" +$8+"\n}\n"+anidacion;
         }        

    }
    | 'FUNCTION' ID '(' Parametros ')' ':' TipoParam '{' Instructions '}' {
        var stack = eval('$$');
         var bandera = false;
         var hijo = $2;

        for(let i = stack.length-11;i>=0;i--){
             if(stack[i] == "function"){  
                hijo = stack[i+1]+"_"+hijo;
               bandera = true            
             }                  
         }

         if (bandera == true){
          var fun = "funcion "+hijo+"("+$4+")" +":"+$7+"{\n" +$9+"\n}\n";
          var obj = {id:hijo,value:fun};
          var obj2 = {id:hijo,ant:$2};
          funciones.push(obj);
          nom.push(obj2);
          $$ = "";           
         }else{
             var anidacion = "";
             while(funciones.length > 0){
                anidacion+= funciones.pop().value+"\n"
             }
             $$ = "funcion "+$2+"("+$4+")" +":"+$7+"{\n" +$9+"\n}\n"+anidacion;
         }        

    }
;




Parametros
    : Parametros ',' ID ':' TipoParam {
        //$1.push($3,$5);
        $1+=", "+$3+":"+$5;
        $$ = $1;
    }
    | ID ':' TipoParam {
        //$$ = [$1,$3];
        $$ = $1+":"+$3;
    }
;

TipoParam  
    : 
     NUMBER
    { 
         //$$ = 0;
         $$ = $1;
    }
    | STRING
    { 
       // $$ = 1;
       $$ = $1;
    }
    
    | BOOLEAN
    {
        //$$ = 2;
        $$ = $1;
    }
    | NULL
    {
        //$$ = 3;
        $$ = $1;
    }  
    | ARRAY
    {
        //$$ = 4;
        $$ = $1;
    }  
    
    | VOID
    {
        //$$ = 5;
        $$ = $1;
    }   
    | ANY
    {
        //$$ = 6;
        $$ = $1;
    } 
    | NUMBER ListaLlaves
    {
       // $$ = 7;
       $$ = $1;
    } 
    | STRING ListaLlaves
    {
        //$$ = 8;
        $$ = $1;
    } 
    | BOOLEAN ListaLlaves
    {
        //$$ = 9;
        $$ = $1;
    }
;



Declaration  
    :
    'LET' ID ';' 
    {
        //$$ = new Declaration($2, null, @1.first_line, @1.first_column,null,2);
        $$ = "let "+$2 + ";\n";

    }
    |
    'LET' ID '=' Expr ';' 
    {
        //$$ = new Declaration($2, $4, @1.first_line, @1.first_column,null,2);
        $$ = "let "+$2+ " = "+ $4 + ";\n";
    }
    |'LET' ID  ':' Tipo '=' Expr ';'
    {
       // $$ = new Declaration($2, $6, @1.first_line, @1.first_column,$4,2);
       $$ = "let "+$2+":"+$4+" = "+ $6 + ";\n";
    }
    |'LET' ID  ':' Tipo ';'
    {
       // $$ = new Declaration($2, null, @1.first_line, @1.first_column,$4,2);
        $$ = "let "+$2+":"+$4+ ";\n";
    }
    
    |'CONST' ID '=' Expr ';'
    {
        //$$ = new Declaration($2, $4, @1.first_line, @1.first_column,null,1);
        $$ = "const "+$2+ " = "+ $4 + ";\n";
    }
    |'CONST' ID  ':' Tipo '=' Expr  ';'
    {
        //$$ = new Declaration($2, $6, @1.first_line, @1.first_column,$4,1);
        $$ = "const "+$2+":"+$4+" = "+ $6 + ";\n";
    }
    |'CONST' ID  ':' Tipo ';'
    {
        //$$ = new Declaration($2, null, @1.first_line, @1.first_column,$4,1);
        $$ = "const "+$2+":"+$4+ ";\n";
    }
    |
    'CONST' ID ';' 
    {
       // $$ = new Declaration($2, null, @1.first_line, @1.first_column,null,1);
        $$ = "const "+$2 + ";\n";
    }
     
    
;




DeclarationArray 
    :
    'LET' ID  ':' Tipo ListaLlaves  ';'
    {
        //$$ = new DeclarationArray2($2, null, @1.first_line, @1.first_column,$4,2,$5);
        $$ = "let "+$2+" : "+$4+$5+";\n";
        
    }
    |'LET' ID  ':' Tipo ListaLlaves  '=' Expr ';'
    {
       
         //$$ = new DeclarationArray2($2, $7, @1.first_line, @1.first_column,$4,2,$5);
         $$ = "let "+$2+" : "+$4+$5+" = "+$7+";\n";
    }
    
    |'CONST' ID ':' Tipo ListaLlaves  ';'
    {
       
       // $$ = new DeclarationArray2($2, null, @1.first_line, @1.first_column,$4,1,$5);
       $$ = "const "+$2+" : "+$4+$5+";\n";
    }
    |'CONST' ID  ':' Tipo ListaLlaves  '=' Expr ';'
    {
         $$ = "const "+$2+" : "+$4+$5+" = "+$7+";\n";
       // $$ = new DeclarationArray2($2, $7, @1.first_line, @1.first_column,$4,1,$5);
    }
   
;

   
  
  ListaLlaves 
    : ListaLlaves '['']'{
       // $1.push($2);
       // $$ = $1;
        $1 += "[]";
        $$ = $1;
    }
    | '['']'{
        //$$ = [$1];
        $$ = "[]";
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


Asignation
    :  ArrayAcces '=' Expr ';'
    {                
         //$$ = new pruebaAsign($1,$3,@1.first_line, @1.first_column);
         $$ = $1+" = "+$3+";\n";
    } 
    | ID '=' Expr ';'
    {   
        //$$ = new Asignation($1, $3, @1.first_line, @1.first_column,1);
        $$ = $1+" = "+$3+";\n";
    } 
    | ID '++' ';'
    { 
        
        //$$ = new Asignation($1, null, @1.first_line, @1.first_column,2);
        $$ = $1+"++"+";\n";
    }
    | ID '--' ';'
    { 
        
        //$$ = new Asignation($1, null, @1.first_line, @1.first_column,3);
        $$ = $1+"--"+";\n";
    }  
;




Tipo  
    : 
     NUMBER
    { 
        //$$ = 0;
        $$ = $1;
    }
    | STRING
    { 
        //$$ = 1;
        $$ = $1;
    }
    
    | BOOLEAN
    {
       // $$ = 2;
       $$ = $1;
    }
    | NULL
    {
        //$$ = 3;
        $$ = $1;
    }  
    | ARRAY
    {
        //$$ = 4;
        $$ = $1;
    }  
    
    | VOID
    {
        //$$ = 5;
        $$ = $1;
    }   
    | ANY
    {
       // $$ = 6;
       $$ = $1;
    } 
;




IfSt
    : 'IF' '(' Expr ')' Statement ElseSt{
        //$$ = new If($3, $5, $6, @1.first_line, @1.first_column);
        $$ = "if "+"("+$3+")"+$5+$6;
    }
;




ElseSt
    : 'ELSE' Statement {
        //$$ = $2;
        $$ = "else "+$2;
    }
    | 'ELSE' IfSt {
        //$$ = $2;
        $$ = "else "+$2;
    }
    | /* epsilon */
    {
        //$$ = null;
        $$ = "";
    }
;




WhileSt
    : 'WHILE' '(' Expr ')' Statement{
       // $$ = new While($3, $5, @1.first_line, @1.first_column);
       $$ = "while "+"("+$3+")"+$5;
    }
;



doWhileSt
    : 'DO' Statement 'WHILE' '(' Expr ')' ';' {
        // $$ = new doWhile($5, $2, @1.first_line, @1.first_column);
         $$ = "do "+$2+"while "+"("+$5+")"+";\n";
    }
;


SwitchSt
    : 'SWITCH' '(' Expr ')' '{' CaseSt'}'{
       //$$ = new Switch($3, $6, @1.first_line, @1.first_column);
       $$ = "switch "+"("+$3+")"+"{\n"+$6+"\n}\n";
    }
;



CaseSt
 : CaseSt CaseEvalSt{
     //$1.push($2);
     //$$ = $1;
     $1 += $2;
     $$ = $1;
  }
  |
  CaseEvalSt{
    // $$ = [$1];
     $$ = $1;
  }  
;



CaseEvalSt

: 'CASE' Expr ':' StatementSw {
  // $$ = new Case($2,$4, @1.first_line, @1.first_column,"case");
   $$ = "case "+$2+":"+$4;
}
| 'CASE' Expr ':' {
   //$$ = new Case($2,null, @1.first_line, @1.first_column,"case");    
   $$ = "case "+$2+":\n";
}
| 'DEFAULT' ':' StatementSw {
  // $$ = new Case(null,$3, @1.first_line, @1.first_column,"default");  
  $$ = "default "+":"+$3;  
}
| 'DEFAULT' ':' {
    $$ = "default \n";
  // $$ = new Case(null,null, @1.first_line, @1.first_column,"default");    
}

;



ForSt
: 'FOR' '(' AsignationFor ';'Expr';' AsignationFor')' Statement{
    //$$ = new For($3, $5, $7, $9, @1.first_line, @1.first_column);
    $$ = "for "+"("+$3+";"+$5+";"+$7+")"+$9;
}
| 'FOR' '(' DeclarationFor';'Expr';' AsignationFor')' Statement{
  // $$ = new For($3, $5, $7, $9, @1.first_line, @1.first_column);
   $$ = "for "+"("+$3+";"+$5+";"+$7+")"+$9;
}
| 'FOR' '(' DeclarationFor 'IN' 'ID' ')' Statement{
  // $$ = new For2(null,$3, $5, $7, @1.first_line, @1.first_column,1);
   $$ = "for "+"("+$3+" in "+$5+")"+$7;
}
| 'FOR' '(' 'ID' 'IN' 'ID' ')' Statement{
  // $$ = new For2($3,null, $5, $7, @1.first_line, @1.first_column,2);
   $$ = "for "+"("+$3+" in "+$5+")"+$7;
}
| 'FOR' '(' DeclarationFor 'OF' 'ID' ')' Statement{
  // $$ = new For2(null,$3, $5, $7,  @1.first_line, @1.first_column,3);
   $$ = "for "+"("+$3+" of "+$5+")"+$7;
}
| 'FOR' '(' 'ID''OF' 'ID' ')' Statement{
   //$$ = new For2($3,null, $5, $7, @1.first_line, @1.first_column,4);
   $$ = "for "+"("+$3+" of "+$5+")"+$7;
}
;




DeclarationFor  
    :
    'LET' ID 
    {
       // $$ = new Declaration($2, null, @1.first_line, @1.first_column,null,2);
         $$ = "let "+$2 ;
    }
    |
    'LET' ID '=' Expr  
    {
        //$$ = new Declaration($2, $4, @1.first_line, @1.first_column,null,2);
        $$ = "let "+$2+ " = "+ $4;
    }
    |'LET' ID  ':' Tipo '=' Expr 
    {
       // $$ = new Declaration($2, $6, @1.first_line, @1.first_column,$4,2);
        $$ = "let "+$2+":"+$4+" = "+ $6 ;
    }
    |'LET' ID  ':' Tipo 
    {
       // $$ = new Declaration($2, null, @1.first_line, @1.first_column,$4,2);
        $$ = "let "+$2+":"+$4;
    }
    
    |'CONST' ID '=' Expr 
    {
       // $$ = new Declaration($2, $4, @1.first_line, @1.first_column,null,1);
        $$ = "const "+$2+ " = "+ $4 ;
    }
    |'CONST' ID  ':' Tipo '=' Expr  
    {
        //$$ = new Declaration($2, $6, @1.first_line, @1.first_column,$4,1);
        $$ = "const "+$2+":"+$4+" = "+ $6 ;
    }
    |'CONST' ID  ':' Tipo 
    {
       // $$ = new Declaration($2, null, @1.first_line, @1.first_column,$4,1);
        $$ = "const "+$2+":"+$4;
    }
    |
    'CONST' ID 
    {
        //$$ = new Declaration($2, null, @1.first_line, @1.first_column,null,1);
         $$ = "const "+$2;
    }
;



AsignationFor
    :ID '=' Expr 
    {
        //$$ = new Asignation($1, $3, @1.first_line, @1.first_column,1);
        $$ = $1+" = "+$3;
    } 
    | ID '++' 
    { 
        //$$ = new Asignation($1, null, @1.first_line, @1.first_column,2);
        $$ = $1+"++";
    }
    | ID '--' 
    { 
       // $$ = new Asignation($1, null, @1.first_line, @1.first_column,3);
        $$ = $1+"--";
    }  
;



Statement
    : '{' Instructions '}' {
        //$$ = new Statement($2, @1.first_line, @1.first_column);
         $$ = " {\n"+$2+"\n } \n";
    }
    | '{' '}' {
       // $$ = new Statement(new Array(), @1.first_line, @1.first_column);
        $$ = " { } \n";
    }
;

TernarioSt:
    Expr '?' Expr ':' Expr 
    {
       // $$ = new Condition($1, $3, $5,@1.first_line, @1.first_column);
        $$ = $1+" ? "+$3+" : "+$5;
    }
    ;

StatementSw
    :  Instructions {
        //$$ = new Statement($1, @1.first_line, @1.first_column);
        $$ = "\n"+$1+"\n";
    }   
;

ArrayDec
  :'[' ListaExpr ']'{
     //$$ = new DecArray($2,@1.first_line, @1.first_column);
     $$ = "["+$2+"]";
  }
  | '[' ']'{
    //$$ = new DecArray([],@1.first_line, @1.first_column);
    $$ ="[]";
  }
  ;

  ArrayAcces
  : ArrayAcces '['Expr']'{

   //$$ = new AccesoArray('',$3,$1,@1.first_line, @1.first_column,null,null);
    $$ = $1+"["+$3+"]";

  }
  | ID  '['Expr']'{

   // $$ = new AccesoArray($1,$3,null,@1.first_line, @1.first_column,null,null);
    $$ = $1+ "["+$3+"]";
  }
;

Expr
    : '-' Expr %prec UMENOS
    {
       // $$ = new Arithmetic($2, null, ArithmeticOption.NEGATIVE, @1.first_line,@1.first_column);
        $$ = "-"+$2;
    } 
    |'!' Expr
    {
       // $$ = new Logic($2, null, LogicOption.NOT, @1.first_line,@1.first_column);
        $$ = "!"+$1;
    }
    |Expr '+' Expr
    {
        //$$ = new Arithmetic($1, $3, ArithmeticOption.PLUS, @1.first_line,@1.first_column);
         $$ = $1+"+"+$3;
    }       
    | Expr '-' Expr
    {
        //$$ = new Arithmetic($1, $3, ArithmeticOption.MINUS, @1.first_line,@1.first_column);
        $$ = $1+"-"+$3;
    }
    | Expr '*' Expr
    { 
        //$$ = new Arithmetic($1, $3, ArithmeticOption.TIMES, @1.first_line,@1.first_column);
        $$ = $1+"*"+$3;
    }       
    | Expr '/' Expr
    {
        //$$ = new Arithmetic($1, $3, ArithmeticOption.DIV, @1.first_line,@1.first_column);
        $$ = $1+"/"+$3;
    }
    | Expr '%' Expr
    {
       // $$ = new Arithmetic($1, $3, ArithmeticOption.MOD, @1.first_line,@1.first_column);
        $$ = $1+"%"+$3;
    }
    | Expr '**' Expr
    {
        //$$ = new Arithmetic($1, $3, ArithmeticOption.POT, @1.first_line,@1.first_column);
        $$ = $1+"**"+$3;
    }
    | Expr '<' Expr
    {
       // $$ = new Relational($1, $3,RelationalOption.LESS, @1.first_line, @1.first_column);
        $$ = $1+" < "+$3;
    }
    | Expr '<=' Expr
    {
        //$$ = new Relational($1, $3,RelationalOption.LESSOREQUAL ,@1.first_line, @1.first_column);
        $$ = $1+" <= "+$3;
    }
    | Expr '>' Expr
    {
        //$$ = new Relational($1, $3,RelationalOption.GREATER ,@1.first_line, @1.first_column);
        $$ = $1+" > "+$3;
    }
    | Expr '>=' Expr
    {
        //$$ = new Relational($1, $3,RelationalOption.GREATEROREQUAL ,@1.first_line, @1.first_column);
        $$ = $1+" >= "+$3;
    }
    | Expr '==' Expr
    {
        //$$ = new Relational($1, $3,RelationalOption.EQUAL ,@1.first_line, @1.first_column);
        $$ = $1+" == "+$3;
    }
    | Expr '!=' Expr
    {
       // $$ = new Relational($1, $3,RelationalOption.NOTEQUAL ,@1.first_line, @1.first_column);
       $$ = $1+" != "+$3;
    }
    | Expr '&&' Expr
    {
        //$$ = new Logic($1, $3,LogicOption.AND ,@1.first_line, @1.first_column);
        $$ = $1+" && "+$3;
    }
    | Expr '||' Expr
    {
        //$$ = new Logic($1, $3,LogicOption.OR ,@1.first_line, @1.first_column);
        $$ = $1+" || "+$3;
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
        $$ = "("+$2+")";
    }
    |ArrayDec
    { 
     
       // $$ = $1;
        $$ = $1;
    }
    | DECIMAL
    { 
        //$$ = new Literal($1, @1.first_line, @1.first_column, 0);
        $$ = $1;
    }
    | ENTERO
    { 
        //$$ = new Literal($1, @1.first_line, @1.first_column, 1);
        $$ = $1;
    }
    | CADENA
    {
        //$$ = new Literal($1.replace(/\"/g,""), @1.first_line, @1.first_column, 2);
        $$ = $1;
    }
    | CADENAB
    {
       // $$ = new Literal($1.replace(/\'/g,""), @1.first_line, @1.first_column, 2);
        $$ = $1;
    }
    | CADENAPARAM
    {
       // $$ = new CadenaParam($1.replace(/\`/g,""), @1.first_line, @1.first_column);
       $$ = $1;
    }
    | TRUE
    {
        //$$ = new Literal(true, @1.first_line, @1.first_column, 3);
        $$ = $1;
    }
    | FALSE
    {
        //$$ = new Literal(false, @1.first_line, @1.first_column, 3);
        $$ = $1;
    }
    | NULL
    {
        //$$ = new Literal($1, @1.first_line, @1.first_column, 4);
        $$ = $1;
    }
    |
     ID 'LENGTH' 
    {
        //$$ = new Access($1,null, @1.first_line, @1.first_column,2);
        $$ = $1 + $2;
    }
    | ID
    {
        //$$ = new Access($1,null, @1.first_line, @1.first_column,1);
        $$ = $1;
    }
    |Call{
        //$$ = $1;
        $$ = $1;
    }
    |ArrayAcces 'LENGTH'{
        //$$ = new ArrayLenght($1,@1.first_line, @1.first_column);
        $$ = $1+$2;
    }
    |ArrayAcces{
        //$$ =$1;
        $$ = $1;
    }
    
    
    
;