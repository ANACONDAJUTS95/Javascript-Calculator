document.addEventListener('DOMContentLoaded', () => {
    let display = document.getElementById('display');
    let formula = '';
    let isEvaluated = false;

    const updateDisplay = (value) => {
        display.textContent = value;
    };

    const handleNumberClick = (number) => {
        if (isEvaluated) {
            updateDisplay(number);
            formula = number;
            isEvaluated = false;
        } else {
            const currentDisplay = display.textContent;
            updateDisplay(currentDisplay === '0' ? number : currentDisplay + number);
            formula = formula === '0' ? number : formula + number;
        }
    };

    const handleOperatorClick = (operator) => {
        if (isEvaluated) {
            isEvaluated = false;
            formula = display.textContent + operator;
            updateDisplay(operator);
        } else {
            const endsWithOperator = /[+\-*/]$/;
            const endsWithNegativeSign = /\d[+\-*/]-$/;

            if (endsWithOperator.test(formula)) {
                if (endsWithNegativeSign.test(formula + operator)) {
                    formula += operator;
                    updateDisplay(operator);
                } else {
                    formula = formula.replace(/[+\-*/]+$/, '') + operator;
                    updateDisplay(operator);
                }
            } else {
                formula += operator;
                updateDisplay(operator);
            }
        }
    };

    const handleDecimalClick = () => {
        if (isEvaluated) {
            updateDisplay('0.');
            formula = '0.';
            isEvaluated = false;
        } else if (!display.textContent.includes('.')) {
            updateDisplay(display.textContent + '.');
            formula += '.';
        }
    };

    const handleClearClick = () => {
        updateDisplay('0');
        formula = '';
        isEvaluated = false;
    };

    const handleEqualsClick = () => {
        const endsWithOperator = /[+\-*/]$/;
        const cleanFormula = formula.replace(endsWithOperator, '');
        try {
            const result = eval(cleanFormula);
            updateDisplay(result.toString());
            formula = cleanFormula + '=' + result;
        } catch (error) {
            updateDisplay('Error');
        }
        isEvaluated = true;
    };

    const handleKeyPress = (event) => {
        const key = event.key;

        if (key >= '0' && key <= '9') {
            handleNumberClick(key);
        } else if (key === '+' || key === '-' || key === '*' || key === '/') {
            handleOperatorClick({
                '+': '+',
                '-': '-',
                '*': '*',
                '/': '/'
            }[key]);
        } else if (key === '.') {
            handleDecimalClick();
        } else if (key === 'Enter' || key === '=') {
            handleEqualsClick();
        } else if (key === 'Backspace' || key === 'Escape') {
            handleClearClick();
        }
    };

    document.getElementById('clear').addEventListener('click', handleClearClick);
    document.getElementById('plus-minus').addEventListener('click', () => handleOperatorClick('-'));
    document.getElementById('percent').addEventListener('click', () => handleOperatorClick('%'));
    document.getElementById('divide').addEventListener('click', () => handleOperatorClick('/'));
    document.getElementById('multiply').addEventListener('click', () => handleOperatorClick('*'));
    document.getElementById('subtract').addEventListener('click', () => handleOperatorClick('-'));
    document.getElementById('add').addEventListener('click', () => handleOperatorClick('+'));
    document.getElementById('equals').addEventListener('click', handleEqualsClick);
    document.getElementById('decimal').addEventListener('click', handleDecimalClick);

    // Attach event listeners to number buttons
    document.querySelectorAll('.button:not(.button-clear):not(.button-function):not(.operator)').forEach(button => {
        button.addEventListener('click', () => handleNumberClick(button.textContent));
    });

    // Listen for keypress events
    document.addEventListener('keydown', handleKeyPress);
});
