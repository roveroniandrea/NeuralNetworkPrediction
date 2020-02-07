let previousNetwork = null;
let previousRule = null;
let previousNetworkType = null;

function main() {
    let numTrainings = parseInt(document.querySelector('#numTrainings').value);
    let numberInputNeurons = parseInt(document.querySelector('#numInputs').value);

    document.querySelector('#randomInput').innerHTML = '';
    let errorMessage = document.querySelector('#errorMessage');
    errorMessage.innerHTML = '';

    let currentRule = null;
    try {
        currentRule = assignAndValidateRule(parseInt(document.querySelector('#selectRule').value), numberInputNeurons);
    } catch (error) {
        errorMessage.innerHTML = error;
        throw 'Error in rule validation: ' + error;
    }

    let numberOutputNeurons = correctNumberOfOutputs(currentRule, numberInputNeurons);
    document.querySelector('#numOutputs').innerHTML = 'Number of outputs: ' + numberOutputNeurons;

    let multiLayerPrecisionParagraph = document.querySelector('#multiLayerPrecision');
    multiLayerPrecisionParagraph.innerHTML = '';
    clearTable();

    let networkType = document.querySelector('#networkType').value;
    if (networkType == NetworkType.SINGLE_LAYER_PERCEPTRON) {
        initializeTable(numberOutputNeurons);
        let neuralNetwork = new NeuralNetwork(numberInputNeurons, numberOutputNeurons);

        printWeigths('Initial', neuralNetwork.inputWeigths);

        let precisionAfterTraining = neuralNetwork.evaluateRepeatedly(numTrainings, currentRule, true);

        printWeigths('Final', neuralNetwork.inputWeigths);
        printPrecision(precisionAfterTraining);
        //saving network to pass custom inputs
        previousNetwork = neuralNetwork;
    }
    else {
        let numberHiddenNeurons = parseInt(document.querySelector('#numHiddenNeurons').value);
        let multiLayerInfos = multiLayer(numberInputNeurons, numberHiddenNeurons, numberOutputNeurons, currentRule, numTrainings, true);

        console.log(multiLayerInfos);
        multiLayerPrecisionParagraph.innerHTML = 'Multi Layer Perceptron infos:\n\nPrecision: ' + multiLayerInfos.precision;
        multiLayerPrecisionParagraph.innerHTML += '\n\nNeural network stringified (also printed in console):\n' + JSON.stringify(multiLayerInfos.neuralNetwork, null, ' ');

        previousNetwork = multiLayerInfos.neuralNetwork;
    }

    previousRule = currentRule;
    previousNetworkType = document.querySelector('#networkType').value;
}

function clearTable() {
    let table = document.querySelector('#tableWeigths');

    if (table != null) {
        let newTable = document.createElement('table');
        newTable.id = 'tableWeigths';
        document.body.replaceChild(newTable, table);
        table = newTable;
    }
}

function initializeTable(numOutputNeurons) {
    let table = document.querySelector('#tableWeigths');

    for (let i = 0; i < numOutputNeurons; i++) {
        let child = document.createElement('th');
        child.innerHTML = 'Weigths for output number ' + i + '. Columns are ordered by input index';
        child.id = 'weigthsHeader' + i;
        table.appendChild(child);

        let initial = document.createElement('tr');
        initial.innerHTML = 'Initial: ';
        initial.id = 'weigthsHeaderInitial' + i;
        table.appendChild(initial);

        let final = document.createElement('tr');
        final.innerHTML = 'Final: ';
        final.id = 'weigthsHeaderFinal' + i;
        table.appendChild(final);
    }
}

function printWeigths(initialOrFinal, inputWeigths) {
    for (let i = 0; i < inputWeigths.length; i++) {
        let row = document.querySelector('#weigthsHeader' + initialOrFinal + i);
        for (let j = 0; j < inputWeigths[i].length; j++) {
            let child = document.createElement('td');
            child.innerHTML = inputWeigths[i][j];
            row.appendChild(child);
        }
    }
}

function printPrecision(precisionAfterTraining) {
    let child = document.createElement('th');
    child.innerHTML = 'Final precision: ' + precisionAfterTraining + '%';
    let table = document.querySelector('#tableWeigths');
    table.appendChild(child);
}

function randomInput() {
    if (previousNetwork == null || previousRule == null) {
        let errorMessage = document.querySelector('#errorMessage');
        errorMessage.innerHTML = 'Please train a neural network first';
        return null;
    }
    let inputLength = 0;
    if(previousNetworkType == NetworkType.SINGLE_LAYER_PERCEPTRON){
        inputLength = previousNetwork.inputWeigths[0].length;
    }
    else{
        inputLength = previousNetwork.inputNeurons.length;
    }

    let inputAndExpected = generateRandomInput(inputLength, previousRule);
    let predicted = [];
    let evaluated = [];
    if (previousNetworkType == NetworkType.SINGLE_LAYER_PERCEPTRON) {
        evaluated = previousNetwork.outputNeuronsEvaluate(inputAndExpected.input);
        predicted = sigmoidFunctionArray(evaluated);

    }
    else {
        predicted = previousNetwork.predict(inputAndExpected.input);
    }
    let errors = calculateErrors(inputAndExpected.expected, predicted);
    let localErrors = 0.0;
    for (let j = 0; j < errors.length; j++) {
        localErrors += Math.abs(errors[j]);
    }
    localErrors /= errors.length;

    let precision = (1 - localErrors) * 100;
    let list = document.querySelector('#randomInput');
    list.innerHTML = ('<li>Input: ' + arrayStringifyToFixed(inputAndExpected.input) + '</li>'
        + ((previousNetworkType == NetworkType.SINGLE_LAYER_PERCEPTRON) ? '<li>Evaluated: ' + arrayStringifyToFixed(evaluated) +
            '</li>' : '')
        + '<li>Predicted: ' + arrayStringifyToFixed(predicted) + '</li><li>Expected: ' + arrayStringifyToFixed(inputAndExpected.expected) +
        '</li><li>Precision: ' + arrayStringifyToFixed([precision]) + '%</li>');
}

let NetworkType = {
    SINGLE_LAYER_PERCEPTRON: 0,
    MULTI_LAYER_PERCEPTRON: 1
}