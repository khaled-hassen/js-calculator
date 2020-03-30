// current displayed state
const state = {
    result: 0,
    equation: '',
    input: '',
    maxInput: 8
};

// operators
const operations = {
    '+': (a, b) => a + b,
    '-': (a, b) => a - b,
    '÷': (a, b) => a / b,
    '×': (a, b) => a * b,
    '%': (a, b) => a % b
};

// display typed character
function displayInput() {
    if ($(this).is(".operation-btn")) {
        if (state.equation && operations.hasOwnProperty(state.equation.slice(-2, -1)) && (!(/^-[1-9]/.test(state.equation.slice(0, 2))))) {
            state.equation = [...state.equation.slice(0, -2), $(this).text(), ' '].join('');
        } else {
            state.equation += ' ' + $(this).text() + ' ';
        }
        state.input = '';
        $("#display").text($(this).text());
    } else if (state.input.length < state.maxInput) {
        state.equation += $(this).text();

        state.input += $(this).text();
        $("#display").text(state.input);
    } else {
        $("#display").text("Digital Limit");
        setTimeout(() => {
            $("#display").text(state.input);
        }, 1000);
    }
}

// clear display 
function clearDisplay() {
    state.result = '';
    state.equation = '';
    state.input = '';
    $("#display").text(state.input);
}

// calculate equation and display result
function calculateEquation() {
    // NAN cases are handled by js
    let equation = state.equation.trim().split(' ');
    state.result = equation.reduce((acc, elem, index) => {
        if (operations.hasOwnProperty(elem)) {
            return operations[elem](Number(acc), Number(equation[index + 1]));
        } else {
            return Number(acc);
        }
    });

    if (state.result.toString().length > state.maxInput) {
        state.result = state.result.toExponential(3);
    }

    $("#display").text(state.result);
    state.input = '';
    state.equation = '';
}

// add or remove negative sign
function addSign() {
    if (state.equation) {
        if (/^[1-9]/.test(state.equation.slice(-1))) {
            let equation = state.equation.trim().split(' ');
            if (state.input[0] === '-') {
                // there's a negative sign => remove it
                state.input = state.input.slice(1);
                equation.splice(equation.length - 1, 1, equation[equation.length - 1].slice(1));
            } else {
                // no negative sign => add it
                let nb = [...equation.slice(-1)];
                equation[equation.length - 1] = '-' + nb;
                state.input = '-' + state.input;
            }
            state.equation = equation.join(' ');
            $("#display").text(state.input);
        }
    }
}

function changeColor($numberColor = "rgb(246, 246, 246)", $numberColorHover = "rgba(197, 194, 194, 0.63)",
    $operationColor = "rgb(232, 234, 247)", $operationColorHover = "rgba(203, 209, 241, 0.753)",
    $equalColor = "rgb(42, 98, 254)", $equalColorHover = "rgba(7, 73, 255, 0.726)",
    $calculatorColor = "#fff", $textColor = "#000") {
    $(".number-btn, .zero-btn").css({
        color: $textColor,
        backgroundColor: $numberColor
    });
    $(".number-btn, .zero-btn").hover(function () {
        $(this).css({
            backgroundColor: $numberColorHover
        });
    }, function () {
        $(this).css({
            backgroundColor: $numberColor
        });
    });
    $(".operation-btn, .sign-btn, .clear-btn").css({
        color: $textColor,
        backgroundColor: $operationColor
    });
    $(".operation-btn, .sign-btn, .clear-btn").hover(function () {
        $(this).css({
            backgroundColor: $operationColorHover
        });
    }, function () {
        $(this).css({
            backgroundColor: $operationColor
        });
    });
    $(".equal-btn").css({
        backgroundColor: $equalColor
    });
    $(".equal-btn").hover(function () {
        $(this).css({
            backgroundColor: $equalColorHover
        });
    }, function () {
        $(this).css({
            backgroundColor: $equalColor
        });
    });
    $("body, .calculator").css("background-color", $calculatorColor);
    $("#display").css("color", $textColor);
}

function toggleDarkMode() {
    // TODO add dark mode toggle
    if ($(this).is(":checked")) {
        // enable dark mode
        changeColor("rgb(46, 56, 62)", "rgba(31, 42, 49, 0.61)", "rgb(43, 58, 68)", "rgba(24, 41, 53, 0.459)", "rgb(42, 98, 254)",
            "rgba(14, 76, 247, 0.747)", "#253239", "#fff")
    } else {
        // disable dark mode
        changeColor();
    }

}

// wait for input
$(".number-btn").click(displayInput);
$(".sign-btn").click(addSign);
$(".zero-btn").click(displayInput);
$(".operation-btn").click(displayInput);
$(".clear-btn").click(clearDisplay);
$(".equal-btn").click(calculateEquation);
$("#dark-mode-toggle").click(toggleDarkMode);