import { Component,Input,OnInit,ElementRef ,ViewChild,AfterViewInit, ViewEncapsulation  } from '@angular/core';
import { wasmFolder } from "@hpcc-js/wasm";
import { CodeModel } from '@ngstack/code-editor/lib/models/code.model';
import { Environment } from "./Interprete/Symbol/Environment";
import { errores } from './Compiler/SymbolTable/Errores';
import { Error_ } from "./Compiler/SymbolTable/Error";
import Parser from "./Grammar/GrammarP2.js";
import { Symbol } from "./Compiler/SymbolTable/Symbol";
import { Enviorement } from "./Compiler/SymbolTable/Enviorement";
import { Generator } from "./Compiler/Generator/Generator";
import { FunctionSt } from "./Compiler/Instruction/Functions/FunctionSt";
import { StructSt } from "./Compiler/Instruction/Functions/StructSt";
import { Instruction } from "./Compiler/Abstract/Instruction";
import {Native} from "./Compiler/Generator/native";
import {Natives} from "./Compiler/Generator/Natives";
import {SimboloGlobal} from "./Compiler/SymbolTable/SimboloGlobal";
import { of } from 'rxjs';
import { Declaration } from './Compiler/Instruction/Variables/Declaration';
import { DeclarationArray } from './Compiler/Instruction/Variables/DeclarationArray';
import { Aumentar} from "./Compiler/contador";
import { Reiniciar } from "./Compiler/contador";
import { cont } from "./Compiler/contador";
import { Network, DataSet} from 'vis';
//var vis = require('../../node_modules/vis/dist/vis.js');

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation:ViewEncapsulation.None
})


export class AppComponent implements AfterViewInit {
  er : Array<Error_> ;
  //graphi : Array<Simbolo> ;
  simglobal : Array<Symbol> ;
  textoConsola1: string = "";
  textoConsola2: string = "";
 
  
  ngAfterViewInit():void {
    
    wasmFolder('/assets/@hpcc-js/wasm/dist/');
   
  }
 
  title = 'proyecto1';
  theme = 'vs-dark';


  codeModel: CodeModel = {
    language: 'typescript',
    uri: 'main.ts',
    value: '',
    dependencies: ['@types/node', '@ngstack/translate', '@ngstack/code-editor']
  };
 

  options = {
  "lineNumbers": true,
  "contextmenu": false,
  "minimap": {
  "enabled": true
  }
  };

 
  
  onCodeChanged1(value) {        // recibe el valor de la consola 1
    this.textoConsola1 = value; 
  }
  onCodeChanged2(value2) {       // recibe el valor de la consola 2
    this.textoConsola2 = value2; 
  }
  



  loadGraph(text: string){
    const container = this.el.nativeElement;    // El contenedor donde irá nuestra gráfica
    // @ts-ignore
    let parsedData = vis.parseDOTNetwork(text); // La información de graphviz parseada para que sea aceptada por la librería
    
    // Se guarda la información de los nodos y aristas en un JSON
    let data = {
        nodes: parsedData.nodes,
        edges: parsedData.edges
    };
    
    // Se coloca en una variable las opciones que genera nuestra información parseada
    let options = parsedData.options;
    
    // Se le coloca forma de árbol
    options.layout = {
        hierarchical: {
        sortMethod: 'directed',  // hubsize, directed
        shakeTowards: 'roots',  // roots, leaves
        direction: 'UD'   // UD, DU, LR, RL
        }
    };
    
    // Se crea una nueva "network"
    // @ts-ignore
    let network = new vis.Network(container, data, options);
    }



    @ViewChild ('network',null) el: ElementRef;
    private networkInstance: any;
  
   public graficar(){
      let texto = "digraph G { "+
                  "a1 -> b3;"+
                  "};"
      this.loadGraph(texto);
    }


  public generarDot():void{
      try{
     //this.limpiar();
     Reiniciar();
     let dot:string = "digraph G { \n";
     let nodo= " Node"+cont;
     dot+=nodo+"[label=Global]; \n";
     Aumentar();

     const ast = Parser.parse(this.textoConsola1);
     const env = new Environment(null);
     
     if(ast[0]!= null){


   for (const instr of ast) {
     try {
                
           if (instr instanceof Instruction) {
            
             dot += instr.getDot(nodo);
                          
           } 
      
     } catch (error) {
       
        console.log(error);
     }
   }
   dot+='}';

    console.log(dot);
    (document.getElementById("C") as HTMLInputElement).value=dot;
    //this.generarAST(dot);
  }

  this.er = errores;
  }catch(error){

  }
 }




















 public traducir():void{
     this.limpiar();
     
     
    try {
     const ast = Parser.parse(this.textoConsola1);
      let env = new Enviorement(null);
      
      if(ast[0]!= null){

        for (const instr of ast) {  // traduce las funciones precompiladas
          try {
          if(instr instanceof FunctionSt){
              const actual = instr.compile(env);
          }
            
          } catch (error) {
            //ErrorTable.push(error);
             console.log(error);
          }
        }

        for (const instr of ast) {  // traduce las variables globales
          try {
              //ejecutar todo
          if(instr instanceof Declaration ||instr instanceof DeclarationArray ){
              const actual = instr.compile(env);
          }
            
          } catch (error) {
            //ErrorTable.push(error);
             console.log(error);
          }
        }



        for (const instr of ast) {  // traduce las funciones ya con codigo
          try {
          if(instr instanceof FunctionSt){
              const actual = instr.compile(env);
          }
            
          } catch (error) {
            //ErrorTable.push(error);
             console.log(error);
          }
        }



        for (const instr of ast) {  // tercera pasada, traduce todo
          try {
              //ejecutar todo
          if(instr instanceof Declaration ||instr instanceof DeclarationArray || instr instanceof FunctionSt ){
              
          }else{
            const actual = instr.compile(env);
          }
            
          } catch (error) {
            //ErrorTable.push(error);
             console.log(error);
          }
        }





          let temporales = Generator.getInstance().contTemporal(); 
          let strtemp = "double ";
           for (let i = 0; i < temporales; i++) {
                  if(i == 0){
                    strtemp+= "T"+i;
                  }else{
                    strtemp+= ",T"+i;
                  }    
           }
           strtemp+=";";
          let encabezado = "#include <stdio.h>"+"\n" 
                           +"#include <math.h>"+"\n" 
                           +"double Heap[16384];"+"\n" 
                           +"double Stack[16384];"+"\n" 
                           +"double p = 0;"+"\n" 
                           +"double h = 0;" +"\n"
                           +strtemp+"\n"         
                           +"main (){"+"\n";
          let cierre ="\n"+"return 0;"+"\n"
                       +"}"+"\n";                    
          let code = encabezado+Generator.getInstance().getCode()+cierre;
          for (const it of Natives) {
            code+=it.code_native;
          }
           code += Generator.getInstance().getCode_func();

          this.imprimirResult(code);

          for (const j of SimboloGlobal) {
             console.log(j.identifier + " - "+j.type.type +" - "+j.position+" - "+j.isGlobal+ "\n");
          }

         //Segunda pasada ejecuta todo
        /* ast.forEach( (element : Instruction) => {
          if(!(element instanceof StructSt))
           element.compile(env);
         });*/
   
          
         /* fs.writeFile('salida.txt',code,(err: any)=>{
           if(err){
           console.log("No se pudo guardar el archivo");
          }
        });*/
        this.er = errores;  
        this.simglobal = SimboloGlobal;

      } else{
        alert("No hay nada para analizar");
      }
    
      
     
  }
  catch (error) {
    console.log(error);
  }
  
   console.log(errores);

  }
  

  
    imprimirResult(valor:any){
      (document.getElementById("C") as HTMLInputElement).value=valor;
    }
    
    limpiar(){
      (document.getElementById("C") as HTMLInputElement).value= "";
    }

}
