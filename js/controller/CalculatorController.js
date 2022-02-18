class CalculatorController {
    constructor() {
       this._timeElement = document.querySelector(".time");
       this._dataElement = document.querySelector(".data");
       this._displayElement = document.querySelector(".expression");
       this._previewElement = document.querySelector(".preview");
       this._preview = 0;
       this._listExpression =["0"];
       this.start();
       this.initializeAddEventsButtons();
       this.initializeAddEventKeyBoard();
       this._ifResult = false;
    }

    start(){
        setInterval(() => {
            this.updateData();
        }, 1000)
    }

    updateData(){
        let data = new Date();
        this._dataElement.innerHTML = data.toLocaleDateString("pt-BR");
        this._timeElement.innerHTML = data.toLocaleTimeString("pt-BR");
    }

    initializeAddEventsButtons() {
       let botoes = document.querySelectorAll("table.botoes td");

        botoes.forEach((button) => {
            button.addEventListener("click", (event) => {
                let value = button.innerHTML;

                switch (value) {
                    case "AC":
                        //Limpar tudo
                        this.clear();
                        break;
                    case "backspace":
                        //erase último caractere
                        if(this._ifResult == true){
                            this.clear();
                        }
                        this.erase();
                        this.calculatePrevia();
                        break;
                    case "=":
                        //Calcular valor final
                        if(this._ifResult == true){
                            return;
                        }
                        this._preview = "";
                        this.calculate(this._listExpression);
                        break;
                    case "1/x":
                        //Inverter último valor digitado
                        this.inverse();
                        this.calculatePrevia();
                        break;
                    case "-":
                    case "×":
                    case "÷":
                    case "+":
                    case "1":
                    case "2":
                    case "3":
                    case "4":
                    case "5":
                    case "6":
                    case "7":
                    case "8":
                    case "9":
                    case "0":
                    case ".":
                        //Adicionar na lista da expressão
                        if(this._ifResult == true){
                            this.clear();
                            this._ifResult = false;
                        }
                        this.addValuesExpression(value);
                        this.calculatePrevia();
                        break;         
                    default:
                        break;
                }

                if(isNaN(this._listExpression[0])){
                    this.error();
                }
            });
        })
    }

    clear() {
        this._listExpression = ["0"];
        this._preview = ["0"];
        this.updateDisplay();
    }

    erase() {
        this._listExpression[this._listExpression.length -1] = this.returnLast().slice(0, -1); //slice(start, end) pega as posições do array conforme parâmetros, o -1 significa para subtraír 1 do tamanho do array, se for 2, tirará 2 do tamanho total do array
        if(this.returnLast() == ""){
            if(this._listExpression.length == 1){
                this._listExpression = ["0"];
            } else {
                this._listExpression.pop();
            }
        }
        this.updateDisplay();
    }

    addValuesExpression(value){
        if(this.verifyOperator(value)){
            //Se não for número
            // Mandar o value para um index na nossa lista
            if(this.verifyOperator(this.returnLast())){
                this._listExpression[this._listExpression.length - 1] = value;
            } else {
                this._listExpression.push(value);
            }
        } else {
            //Se for número
            //Adicionar o número dentro do último index da lista
            if(this.verifyOperator(this.returnLast())){
                this._listExpression.push(value);
            } else {
                if(this.returnLast() == "0" && value.toString() != "."){
                    this._listExpression[this._listExpression.length -1] = "";
                }
                if(this.returnLast().indexOf(".") > -1 && value.toString() == "."){
                    return;
                }
                this._listExpression[this._listExpression.length -1] += value.toString();
            }
        }
        this.updateDisplay(); // o método join serve para mudar o separador do array no toString(), no caso por padrão é a vírgula, então substituímos por nada!

    }

    verifyOperator(value){
        //Quando o valor não existe no array, é retornado -1, e se retornar -1 significa que o  valor não é um operador.
        return ["×", "÷", "+", "-"].indexOf(value) > -1;
    }

    returnLast(){
        return this._listExpression[this._listExpression.length -1];
    }

    updateDisplay() {
        this._displayElement.innerHTML = this._listExpression.join("");
        this._previewElement.innerHTML = this._preview;
        this._displayElement.scrollBy(100,0); //scrollBy(x, y) descola o número para o lado, no caso do 100 significa 100 casas no eixo x
    }

    inverse() {
        if(this.verifyOperator(this.returnLast())){
            this._listExpression.pop()
        }
        if(this.returnLast() == "0"){
            return;
        }
        this._listExpression[this._listExpression.length -1] =  (1 / this.returnLast()).toString();
        this._ifResult = true;
        this.updateDisplay();
    }

    calculate(array){
        for(let i=0; i < array.length; i += 2){
            array[i] = parseFloat(array[i]); 
        }

        while(this.multIndexOf(array,["÷", "×"])[0] > -1){
            let operation = this.multIndexOf(array,["÷", "×"]); //[index, operation]
            let result;
            switch (operation[1]) {
                case "÷":
                    result = array[operation[0] -1] / array[operation[0] +1];
                    break;
                case "×":
                    result = array[operation[0] -1] * array[operation[0] +1];
                    break;
            }
            array.splice(operation[0]-1, 3, result); //Método splice remove elementos do array splice(index que começa a remover, quantos elementos remove a partir do index, o que colocar nos itens que apagaram);
        }

        while(this.multIndexOf(array,["+", "-"])[0] > -1){
            let operation = this.multIndexOf(array,["+", "-"]); //[index, operation]
            let result;
            switch (operation[1]) {
                case "+":
                    result = array[operation[0] -1] + array[operation[0] +1];
                    break;
                case "-":
                    result = array[operation[0] -1] - array[operation[0] +1];
                    break;
            }
            array.splice(operation[0]-1, 3, result); //Método splice remove elementos do array splice(index que começa a remover, quantos elementos remove a partir do index, o que colocar nos itens que apagaram);
        }
        this._ifResult = true;
        array[0] = array[0].toString();
        this.updateDisplay();
    }

    multIndexOf(arrayPrincipal, array){
        for(let i = 0; i < arrayPrincipal.length; i++){
            let v = arrayPrincipal[i];
            for(let i2 = 0; i2 < array.length; i2++){
                let v2 = array[i2];
                if(v == v2){
                    return [i, v2];
                }
            }
        }
        return [-1, ""];
    }

    calculatePrevia() {
        let listPreview =[];
        this._listExpression.forEach((value) => {
            listPreview.push(value);
        })

        this.calculate(listPreview);
        this._ifResult = false;
        if(isNaN(listPreview[0])){
            return;
        }
        this._preview = listPreview;
        this._preview = listPreview.join("");
        this.updateDisplay();
    }

    error() {
        this._displayElement.innerHTML = "ERROR";
        this._previewElement.innerHTML = "";
        this._ifResult = true;
    }

    initializeAddEventKeyBoard() {
       document.addEventListener("keyup", (event) => {

        switch (event.key) {
            case "c":
                //Limpar tudo
                this.clear();
                break;
            case "Backspace":
                //erase último caractere
                if(this._ifResult == true){
                    this.clear();
                }
                this.erase();
                this.calculatePrevia();
                break;
            case "Enter":
                //Calcular valor final
                if(this._ifResult == true){
                    return;
                }
                this._preview = "";
                this.calculate(this._listExpression);
                break;
            case "-":
            case "+":
            case "1":
            case "2":
            case "3":
            case "4":
            case "5":
            case "6":
            case "7":
            case "8":
            case "9":
            case "0":
            case ".":
                //Adicionar na lista da expressão
                if(this._ifResult == true){
                    this.clear();
                    this._ifResult = false;
                }
                this.addValuesExpression(event.key);
                this.calculatePrevia();
                break;
            case "/":
                //Adicionar na lista da expressão
                if(this._ifResult == true){
                    this.clear();
                    this._ifResult = false;
                }
                this.addValuesExpression("÷");
                this.calculatePrevia();
                break; 
            case "*":
                //Adicionar na lista da expressão
                if(this._ifResult == true){
                    this.clear();
                    this._ifResult = false;
                }
                this.addValuesExpression("×");
                this.calculatePrevia();
                break;            
            default:
                break;
        }

        if(isNaN(this._listExpression[0])){
            this.error();
        }
        })
    }

}