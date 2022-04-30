var x = 0; var y = 0;
var mouseX = 0; var mouseY = 0;

class CalculatorModel {
    static previousOperand = '';
    static currentOperand = '0';
    static operation = undefined;
}

class CalculatorView {
    constructor(previousOperandTextElement, currentOperandTextElement, env){
        this.previousOperandTextElement = previousOperandTextElement;
        this.currentOperandTextElement = currentOperandTextElement;
        this.env = env;
    }

    getDisplayNumber(number){
        const stringNumber = number.toString();
        const integerDigits = parseFloat(stringNumber.split('.')[0]);
        const decimalDigits = stringNumber.split('.')[1];
        let integerDisplay;
        if(isNaN(integerDigits)) integerDisplay = '';
        else integerDisplay = integerDigits.toLocaleString('en', {
                maximumFractionDigits: 0 });
        if(decimalDigits != null){
            if(integerDisplay === '') return `0.${decimalDigits}`;
            return `${integerDisplay}.${decimalDigits}`;
        } else {
            return integerDisplay;
        }
    }

    updateDisplay(){
        if(CalculatorModel.previousOperand !== '') this.previousOperandTextElement.innerText = this.getDisplayNumber(CalculatorModel.previousOperand) + " " + CalculatorModel.operation;
        else this.previousOperandTextElement.innerText = '';
        if(CalculatorModel.currentOperand === '-') this.currentOperandTextElement.innerText = '-';
        else this.currentOperandTextElement.innerText = this.getDisplayNumber(CalculatorModel.currentOperand);

        this.env.innerText = CalculatorModel.previousOperand + " " + CalculatorModel.operation + " " + CalculatorModel.currentOperand;
    }
}

class CalculatorController {
    constructor(previousOperandTextElement, currentOperandTextElement, env){
        this.calculatorView = new CalculatorView(previousOperandTextElement, currentOperandTextElement, env);
        this.clear();
    }

    appendNumber(number){
        if(number === '.' && CalculatorModel.currentOperand.includes('.')) return;
        if(number === '0' && CalculatorModel.currentOperand === '0') return;
        CalculatorModel.currentOperand = CalculatorModel.currentOperand.toString() + number.toString();
        this.calculatorView.updateDisplay();
    }

    chooseOperation(operation){
        if(CalculatorModel.currentOperand === '' || CalculatorModel.currentOperand === '-'){
            if(CalculatorModel.previousOperand === '' && operation !== '-') return;
            if(operation !== '-'){
                CalculatorModel.operation = operation;
            } else if(CalculatorModel.currentOperand !== '-'){
                CalculatorModel.currentOperand = '-';
                this.calculatorView.updateDisplay();
                return;
            } else return;
        } else {
            if(CalculatorModel.previousOperand !== '') this.compute();
            CalculatorModel.operation = operation;
            CalculatorModel.previousOperand = CalculatorModel.currentOperand;
        }
        CalculatorModel.currentOperand = '0';
        this.calculatorView.updateDisplay();
    }

    clear(){
        CalculatorModel.previousOperand = '';
        CalculatorModel.currentOperand = '0';
        CalculatorModel.operation = undefined;
        this.calculatorView.updateDisplay();
    }

    delete(){
        CalculatorModel.currentOperand = CalculatorModel.currentOperand.toString().slice(0, -1);
        this.calculatorView.updateDisplay();
    }

    compute(){
        let computation;
        const prev = parseFloat(CalculatorModel.previousOperand);
        const current = parseFloat(CalculatorModel.currentOperand);
        if(isNaN(prev) || isNaN(current)) return;
        switch(CalculatorModel.operation){
            case '+':
                computation = prev + current;
                break;
            case '-':
                computation = prev - current;
                break;
            case 'x':
                computation = prev * current;
                break;
            case '÷':
                computation = prev / current;
                break;
            case '^':
                computation = prev ** current;
                break;
            default:
                return;
        }
        CalculatorModel.currentOperand = computation;
        CalculatorModel.operation = undefined;
        CalculatorModel.previousOperand = '';
        this.calculatorView.updateDisplay();
    }

    onDragStart(event){
        event
           .dataTransfer
           .setData('text/plain', event.target.id);
	x = event.target.getBoundingClientRect().x;
	y = event.target.getBoundingClientRect().y;
	mouseX = event.clientX;
	mouseY = event.clientY;
    }

    onDragOver(event){
	event.preventDefault();
    }

    onDrag(event){
	const moveX = x + (event.clientX - mouseX);
        const moveY = y - (mouseY - event.clientY);
	event.target.style.marginLeft = moveX + 'px';
	event.target.style.marginTop = moveY + 'px';
    }

    onDrop(event){
	event
	   .dataTransfer
	   .clearData();
    }
}


const numberButtons = document.querySelectorAll('[data-number]');
const operationButtons = document.querySelectorAll('[data-operation]');
const equalsButton = document.querySelector('[data-equals]');
const deleteButton = document.querySelector('[data-delete]');
const allClearButton = document.querySelector('[data-all-clear]');
const previousOperandTextElement = document.querySelector('[data-previous-operand]');
const currentOperandTextElement = document.querySelector('[data-current-operand]');
const calculatorElement = document.querySelector('[data-calculator]');

const env = document.querySelector('[env]');

const calculator = new CalculatorController(previousOperandTextElement, currentOperandTextElement, env);

numberButtons.forEach(button => {
    button.addEventListener('click', () => {
        calculator.appendNumber(button.innerText);
    })
});

operationButtons.forEach(button => {
    button.addEventListener('click', () => {
        calculator.chooseOperation(button.innerText);
    })
});

equalsButton.addEventListener('click', () => {
    calculator.compute();
});

deleteButton.addEventListener('click', () => {
    calculator.delete();
});

allClearButton.addEventListener('click', () => {
    calculator.clear();
});

calculatorElement.addEventListener('dragstart', (event) => {
    calculator.onDragStart(event);
});

calculatorElement.addEventListener('dragover', (event) => {
    calculator.onDragOver(event);
});

calculatorElement.addEventListener('drag', (event) => {
    calculator.onDrag(event);
});

calculatorElement.addEventListener('drop', (event) => {
    calculator.onDrop(event);
});