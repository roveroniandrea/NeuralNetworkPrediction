function sigmoidFunctionArray(x) {
    let outputs = [];
    for (let i = 0; i < x.length; i++) {
        outputs[i] = 1.0 / (1.0 + Math.exp(-x[i]));
    }
    return outputs;
}

function sigmoidFunctionSingleNumber(x){
    return sigmoidFunctionArray([x])[0];
}

function derivativeSigmoidFunctionArray(x) {
    let ys = [];
    for (let i = 0; i < x.length; i++) {
        ys[i] = Math.exp(-x[i]) / Math.pow((1 + Math.exp(-x[i])), 2)
    }
    return ys;
}

function derivativeSigmoidFunctionSingleNumber(x){
    return derivativeSigmoidFunctionArray([x])[0];
}

function calculateErrors(expected, predicted) {
    if (expected.length != predicted.length) {
        console.error(expected, predicted);
        throw 'Expected and predicted must have same length!';
    }
    let errors = [];
    for (let i = 0; i < expected.length; i++) {
        errors[i] = expected[i] - predicted[i];
    }
    return errors;
}

function fromDecToBinArray(decimal, arrayLength){
    let result = [];
    //converting to bit array
    while(decimal > 0){
        let resto = decimal % 2;
        decimal = Math.floor(decimal / 2);
        result[result.length] = resto;
    }
    //giving an error if too long
    if(result.length > arrayLength){
        throw 'Bit array converted is too long';
    }
    //otherwise, expanding it to match the required length
    while(result.length < arrayLength){
        result[result.length] = 0;
    }
    //returning reversed
    return arrayReverse(result);
}

function arrayReverse(original){
    let reversed = [];
    for(let i=0; i < original.length; i++){
        reversed[original.length - (i + 1)] = original[i];
    }
    return reversed;
}

function fromBitArrayToDecimal(bitArray){
    //reversing array in order to use for loop with exponential
    bitArray = arrayReverse(bitArray);
    let result = 0;
    for(let i=0; i < bitArray.length; i++){
        result += bitArray[i] * Math.pow(2, i);
    }
    return result;
}

function arrayStringifyToFixed(original){
    let stringified = '';
    for(let i=0; i < original.length; i++){
        stringified += Math.trunc(original[i] * 100.0) / 100.0;
        if(i + 1 < original.length){
            stringified += ', ';
        }
    }
    return stringified;
}