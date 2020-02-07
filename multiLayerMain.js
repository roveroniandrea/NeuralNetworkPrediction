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