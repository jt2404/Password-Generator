const inputSlider = document.querySelector('[data-lengthSlider]')
const lengthDisplay = document.querySelector('[data-lengthNumber]')
const passwordDisplay = document.querySelector('[data-passwordDisplay]')
const copyBtn = document.querySelector('[data-copy]')
const copyMsg = document.querySelector('[data-copyMsg]')
const uppercaseCheck = document.querySelector('#uppercase')
const lowercaseCheck = document.querySelector('#lowercase')
const numbersCheck = document.querySelector('#numbers')
const symbolsCheck = document.querySelector('#symbols')
const indicator = document.querySelector('[data-indicator]')
const generateBtn = document.querySelector('.generateButton')
const allCheckBox = document.querySelectorAll('input[type=checkbox]')
const symbols = ' !"#$%&\'()*+,-./<=>?@'

let password = "";
let passwordLength = 10;
let checkCount = 0;

handleSlider()
function handleSlider() {
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;
}

function setIndicator(color) {
    indicator.style.backgroundColor = color;
}

function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min)) + min
}

function generateRandomNumber() {
    return getRndInteger(0, 9)
}

function generateRandomLowerCase(min, max) {
    return String.fromCharCode(getRndInteger(97, 123))
}

function generateRandomUpperCase(min, max) {
    return String.fromCharCode(getRndInteger(65, 91))
}

function generateSymbol() {
    const randNum = getRndInteger(0, symbols.length)
    return symbols.charAt(randNum)
}

function calcStrength() {
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;

    if (uppercaseCheck.checked) {
        hasUpper = true
    }
    if (lowercaseCheck.checked) {
        hasLower = true
    }
    if (numbersCheck.checked) {
        hasNum = true
    }
    if (symbolsCheck.checked) {
        hasSym = true
    }

    if ((hasUpper) && (hasLower) && (hasNum || hasSym) && (symbols.length >= 8)) {
        setIndicator("#0f0")
    }
    else if ((hasUpper || hasLower) && (hasNum || hasSym) && (symbols.length >= 6)) {
        setIndicator("#ff0")
    }
    else {
        setIndicator("#f00")
    }
}

async function copyContent() {
    try {
        await navigator.clipboard.writeText(passwordDisplay.value)
        copyMsg.innerText = "Copied"
    }
    catch (e) {
        copyMsg.innerText = "Failed"
    }
    // To make copy vala span visible 
    copyMsg.classList.add("active")

    setTimeout(() => {
        copyMsg.classList.remove("active")
    }, 2000)
}

function shufflePassword(array) {
    //Fisher Yates Method
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j]
        array[j] = temp;
    }
    let str = "";
    array.forEach((el) => (str += el))
    return str;
}

function handleCheckBoxChange() {
    checkCount = 0;
    allCheckBox.forEach((checkbox) => {
        if (checkbox.checked) {
            checkCount++;
        }
    });
    if (passwordLength < checkCount) {
        passwordLength = checkCount;
        handleSlider()
    }
}

allCheckBox.forEach((checkbox) => {
    console.log("Hello")
    checkbox.addEventListener('change', handleCheckBoxChange);
    console.log("End")
});

inputSlider.addEventListener('input', (e) => {
    passwordLength = e.target.value;
    handleSlider()
})

copyBtn.addEventListener('click', () => {
    if (passwordDisplay.value) {
        copyContent();
    }
})

generateBtn.addEventListener('click', () => {

    // none of the checkbox are selected
    if (checkCount == 0) {
        return;
    }
    if (passwordLength < checkCount) {
        passwordLength = checkCount;
        handleSlider();
    }

    // let's start the journey to find new password
    password = "";

    // let's put the stuff mentioned by checkboxes

    // if(uppercaseCheck.checked)
    // {
    //     password += generateRandomUpperCase()
    // }

    // if(lowercaseCheck.checked)
    // {
    //     password += generateRandomLowerCase()
    // }

    // if(numbersCheck.checked)
    // {
    //     password += generateRandomNumber()
    // }

    // if(symbolsCheck.checked)
    // {
    //     password += generateSymbol()
    // }

    let funArr = [];

    if (uppercaseCheck.checked) {
        funArr.push(generateRandomUpperCase)
    }

    if (lowercaseCheck.checked) {
        funArr.push(generateRandomLowerCase)
    }

    if (numbersCheck.checked) {
        funArr.push(generateRandomNumber)
    }

    if (symbolsCheck.checked) {
        funArr.push(generateSymbol)
    }

    //compulsory addition
    for (let i = 0; i < funArr.length; i++) {
        password += funArr[i]();
    }

    //remaining addition

    for (let i = 0; i < passwordLength - funArr.length; i++) {
        let ranIndex = getRndInteger(0, funArr.length);
        password += funArr[ranIndex]();
    }

    //shuffle the password

    password = shufflePassword(Array.from(password))

    passwordDisplay.value = password


    // calculate strength
    calcStrength()
})
