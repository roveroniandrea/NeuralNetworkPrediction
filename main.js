function main() {
    let numTrainings = parseInt(document.querySelector('#numTrainings').value);
    let numberInputNeurons = parseInt(document.querySelector('#numInputs').value);

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
    initializeTable(numberOutputNeurons);

    let neuralNetwork = new NeuralNetwork(numberInputNeurons, numberOutputNeurons);

    printWeigths('Initial', neuralNetwork.inputWeigths);

    let precisionAfterTraining = neuralNetwork.evaluateRepeatedly(numTrainings, currentRule, true);

    printWeigths('Final', neuralNetwork.inputWeigths);
    printPrecision(precisionAfterTraining);
}

function initializeTable(numOutputNeurons) {
    let table = document.querySelector('#tableWeigths');

    if (table != null) {
        let newTable = document.createElement('table');
        newTable.id = 'tableWeigths';
        document.body.replaceChild(newTable, table);
        table = newTable;
    }

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