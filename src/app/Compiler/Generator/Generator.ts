import { Enviorement } from "../SymbolTable/Enviorement";

export class Generator{
    private static generator: Generator;
    private temporal : number;
    private label : number;
    private code : string[];
    private codefunc : string[];
    private codeaux : string[];
    private tempStorage : Set<string>;
    isFunc = '';

    private constructor(){
        this.temporal = this.label = 0;
        this.code = new Array();
        this.tempStorage = new Set();
        this.codefunc = new Array();
        this.codeaux = new Array();
    }

    public static getInstance(){
        return this.generator || (this.generator = new this());

        
    }

    public code_codeaux (){
        for (const codigo of this.code) {
             this.codeaux.push(codigo);
        }
    }

    public codeaux_code (){
        for (const codigo of this.codeaux) {
             this.code.push(codigo);
        }
    }

    public code_codefunc (){
        for (const codigo of this.code) {
             this.codefunc.push(codigo);
        }
    }

    public vaciar_code (){
        this.code = new Array();
    }
    public vaciar_aux (){
        this.codeaux = new Array();
    }


    public getTempStorage(){
        return this.tempStorage;
    }

    public clearTempStorage(){
        this.tempStorage.clear();
    }

    public setTempStorage(tempStorage : Set<string>){
        this.tempStorage = tempStorage;
    }

    public clearCode(){
        this.temporal = this.label = 0;
        this.code = new Array();
        this.tempStorage = new Set();
    }

    public addCode(code : string){
        this.code.push(this.isFunc + code);
    }

    public getCode() : string{
        return this.code.join('\n');
    }
    public getCode_func() : string{
        return this.codefunc.join('\n');
    }

    public newTemporal() : string{
        const temp = 'T' + this.temporal++
        this.tempStorage.add(temp);
        return temp;
    }

    public contTemporal() : number{
        const temp = this.temporal;
        return temp;
    }

    public newLabel() : string{
        return 'L' + this.label++;
    }

    public addLabel(label : string){
        this.code.push(`${this.isFunc}${label}:`);
    }

    public addExpression(target : string, left: any, right: any = '', operator: string = ''){
        this.code.push(`${this.isFunc}${target} = ${left} ${operator} ${right};`);
    }

    public addGoto(label : string){
        this.code.push(`${this.isFunc}goto ${label};`);
    }

    public addIf(left: any, right: any, operator: string, label : string){
        this.code.push(`${this.isFunc}if (${left} ${operator} ${right}) goto ${label};`);
    }

    public nextHeap(){
        this.code.push(this.isFunc + 'h = h + 1;');
    }

    public addGetHeap(target : any, index: any){
        this.code.push(`${this.isFunc}${target} = Heap[(int)${index}];`);
    }

    public addSetHeap(index: any, value : any){
        this.code.push(`${this.isFunc}Heap[(int)${index}] = ${value};`);
    }
    
    public addGetStack(target : any, index: any){
        this.code.push(`${this.isFunc}${target} = Stack[(int)${index}];`);
    }

    public addSetStack(index: any, value : any){
        this.code.push(`${this.isFunc}Stack[(int)${index}] = ${value};`);
    }

    public addNextEnv(size: number){
        this.code.push(`${this.isFunc}p = p + ${size};`);
    }

    public addAntEnv(size: number){
        this.code.push(`${this.isFunc}p = p - ${size};`);
    }

    public addCall(id: string){
        this.code.push(`${this.isFunc}${id}();`);
    }

    public addBegin(id: string){
        this.code.push(`\nvoid ${id} (){`);
        ///cod+= "void "+funcion+" (){"+"\n";  
    }

    public addEnd(){
        this.code.push('}\n');
    }

    public addret(){
        this.code.push('return;');
    }


    public addPrint(format: string, value: any){
        this.code.push(`${this.isFunc}printf("%${format}",${value});`);
    }

    public addPrintTrue(){
        this.addPrint('c','t'.charCodeAt(0));
        this.addPrint('c','r'.charCodeAt(0));
        this.addPrint('c','u'.charCodeAt(0));
        this.addPrint('c','e'.charCodeAt(0));
    }

    public addPrintFalse(){
        this.addPrint('c','f'.charCodeAt(0));
        this.addPrint('c','a'.charCodeAt(0));
        this.addPrint('c','l'.charCodeAt(0));
        this.addPrint('c','s'.charCodeAt(0));
        this.addPrint('c','e'.charCodeAt(0));
    }

    public addPrintNull(){
        this.addPrint('c','n'.charCodeAt(0));
        this.addPrint('c','u'.charCodeAt(0));
        this.addPrint('c','l'.charCodeAt(0));
        this.addPrint('c','l'.charCodeAt(0));
    }

    public addComment(comment: string){
        this.code.push(`${this.isFunc}/***** ${comment} *****/`);
    }

    public freeTemp(temp: string){
        if(this.tempStorage.has(temp)){
            this.tempStorage.delete(temp);
        }
    }

    public addTemp(temp: string){
        if(!this.tempStorage.has(temp))
            this.tempStorage.add(temp);
    }

    public saveTemps(enviorement: Enviorement) : number{
        if(this.tempStorage.size > 0){
            const temp = this.newTemporal(); this.freeTemp(temp);
            let size = 0;

            this.addComment('Inicia guardado de temporales');
            this.addExpression(temp,'p',enviorement.size,'+');
            this.tempStorage.forEach((value)=>{
                size++;
                this.addSetStack(temp,value);
                if(size !=  this.tempStorage.size)
                    this.addExpression(temp,temp,'1','+');
            });
            this.addComment('Fin guardado de temporales');
        }
        let ptr = enviorement.size;
        enviorement.size = ptr + this.tempStorage.size;
        return ptr;
    }

    public recoverTemps(enviorement: Enviorement, pos: number){
        if(this.tempStorage.size > 0){
            const temp = this.newTemporal(); this.freeTemp(temp);
            let size = 0;

            this.addComment('Inicia recuperado de temporales');
            this.addExpression(temp,'p',pos,'+');
            this.tempStorage.forEach((value)=>{
                size++;
                this.addGetStack(value,temp);
                if(size !=  this.tempStorage.size)
                    this.addExpression(temp,temp,'1','+');
            });
            this.addComment('Finaliza recuperado de temporales');
            enviorement.size = pos;
        }
    }
}