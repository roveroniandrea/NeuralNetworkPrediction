function multiLayerPromise(numberInputNeurons, numberHiddenNeurons, numberOutputNeurons, currentRule, numTrainings, trainYN) {
    return new Promise((resolve, reject) => {
        let multiLayerNetwork = new MultiLayerNetwork(numberInputNeurons, numberHiddenNeurons, numberOutputNeurons);

        let trainingPerCycles = 100;
        let totalCycles = Math.ceil(numTrainings / trainingPerCycles);
        let totalErrors = 0.0;
        let trainingsDone = 0;
        let cycle = 1;
        let precisionCurve = [];
        let interval = setInterval(() => {
            for (let training = 0; training < trainingPerCycles && (trainingsDone <= numTrainings); training++) {
                let inputAndExpected = generateRandomInput(numberInputNeurons, currentRule);
                let prediction = multiLayerNetwork.predict(inputAndExpected.input);
                let errors = calculateErrors(inputAndExpected.expected, prediction);

                let localErrors = 0.0;
                for (let j = 0; j < errors.length; j++) {
                    localErrors += Math.abs(errors[j]);
                }
                totalErrors += localErrors / errors.length;

                if (trainYN) {
                    multiLayerNetwork.backpropagationCompleate(errors);
                }
                trainingsDone++;
            }
            precisionCurve[cycle - 1] = ((1 - totalErrors / trainingsDone) * 100);
            if (cycle == totalCycles) {
                totalErrors /= numTrainings;
                clearInterval(interval);
                resolve({
                    neuralNetwork: multiLayerNetwork,
                    precision: ((1 - totalErrors) * 100),
                    precisionCurve: precisionCurve
                });
            }
            else {
                console.log('Done cycle ' + cycle + ' of '+totalCycles);
                cycle++;
            }
        }, 50);
    });
}

function multiLayer(numberInputNeurons, numberHiddenNeurons, numberOutputNeurons, currentRule, numTrainings, trainYN) {
    let multiLayerNetwork = new MultiLayerNetwork(numberInputNeurons, numberHiddenNeurons, numberOutputNeurons);

    let totalErrors = 0.0;

    for (let training = 0; training < numTrainings; training++) {
        let inputAndExpected = generateRandomInput(numberInputNeurons, currentRule);
        let prediction = multiLayerNetwork.predict(inputAndExpected.input);
        let errors = calculateErrors(inputAndExpected.expected, prediction);

        let localErrors = 0.0;
        for (let j = 0; j < errors.length; j++) {
            localErrors += Math.abs(errors[j]);
        }
        totalErrors += localErrors / errors.length;

        if (trainYN) {
            multiLayerNetwork.backpropagationCompleate(errors);
        }
    }
    totalErrors /= numTrainings;
    return {
        neuralNetwork: multiLayerNetwork,
        precision: ((1 - totalErrors) * 100)
    }
}