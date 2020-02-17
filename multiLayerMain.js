function multiLayerPromise(numberInputNeurons, hiddenNeurons, numberOutputNeurons, currentRule, numTrainings, trainYN) {
    return new Promise((resolve, reject) => {
        let multiLayerNetwork = new MultiLayerNetwork(numberInputNeurons, hiddenNeurons, numberOutputNeurons);

        let millisBetweenCycles = 50;
        let maxCalculationsPerFrame = 1000000;
        let totalCalculationsPerInput = multiLayerNetwork.inputNeurons.length * multiLayerNetwork.outputNeurons.length;
        for (let i = 0; i < multiLayerNetwork.hiddenLayers.length; i++) {
            totalCalculationsPerInput *= multiLayerNetwork.hiddenLayers[i].length;
        }

        let trainingPerCycles = Math.floor(maxCalculationsPerFrame / totalCalculationsPerInput);
        if (maxCalculationsPerFrame < totalCalculationsPerInput) {
            trainingPerCycles = 1;
            console.warn('Exceeded maxCalculationsPerFrame');
        }

        let totalCycles = Math.ceil(numTrainings / trainingPerCycles);
        console.log(totalCycles + ' cycles will be done, each with ' + trainingPerCycles + ' trainings');

        let totalSeconds = Math.floor((millisBetweenCycles * totalCycles) / 1000);
        console.log('Expected wait: ' + Math.floor(totalSeconds / 60) + 'min ' + Math.floor(totalSeconds % 60) + 's');

        let initialSecondsExpected = totalSeconds;
        let startedCalculationAt = Date.now();

        let totalErrors = 0.0;
        let trainingsDone = 0;
        let cycle = 1;
        let precisionCurve = [];
        let precisionForCycle = [];
        let lastStampedInfo = Date.now();
        let interval = setInterval(() => {
            let startTime = Date.now();
            let errorsForThisCycle = 0.0;
            for (let training = 0; training < trainingPerCycles && (trainingsDone <= numTrainings); training++) {
                let inputAndExpected = generateRandomInput(numberInputNeurons, currentRule);
                let prediction = multiLayerNetwork.predict(inputAndExpected.input);
                let errors = calculateErrors(inputAndExpected.expected, prediction);

                let localErrors = 0.0;
                for (let j = 0; j < errors.length; j++) {
                    localErrors += Math.abs(errors[j]);
                }
                totalErrors += localErrors / errors.length;
                errorsForThisCycle += localErrors / errors.length;

                if (trainYN) {
                    multiLayerNetwork.backpropagationCompleate(errors);
                }
                trainingsDone++;
            }
            precisionForCycle[cycle - 1] = ((1 - errorsForThisCycle / trainingPerCycles) * 100);
            precisionCurve[cycle - 1] = ((1 - totalErrors / trainingsDone) * 100);
            let millisToExecute = Date.now() - startTime;
            if (cycle >= totalCycles) {
                console.log('Done! Calculation speedup: ' + (initialSecondsExpected * 1000) / (Date.now() - startedCalculationAt));
                totalErrors /= numTrainings;
                clearInterval(interval);
                resolve({
                    neuralNetwork: multiLayerNetwork,
                    precision: ((1 - totalErrors) * 100),
                    precisionCurve: precisionCurve,
                    //precisionCurve: precisionForCycle
                });
            }
            else {
                if (Date.now() - lastStampedInfo > 5000) {
                    lastStampedInfo = Date.now();
                    console.log('Done cycle ' + cycle + ' of ' + totalCycles + '. Took ' + millisToExecute + ' milliseconds');

                    let ratioWaitExecution = millisBetweenCycles / millisToExecute;
                    if(ratioWaitExecution > 1.5 || ratioWaitExecution < 1.1){
                        if(ratioWaitExecution > 1.5){
                            console.warn('Execution is fast, increasing calculation ratio');
                        }
                        else{
                            console.warn('Execution takes too long, decreasing calculation ratio');
                        }
                        maxCalculationsPerFrame *= ratioWaitExecution * 0.8;

                        trainingPerCycles = Math.floor(maxCalculationsPerFrame / totalCalculationsPerInput);
                        if (maxCalculationsPerFrame < totalCalculationsPerInput) {
                            trainingPerCycles = 1;
                            console.warn('Exceeded maxCalculationsPerFrame');
                        }
                        totalCycles = Math.ceil(numTrainings / trainingPerCycles);
                    }

                    let remainingSeconds = Math.floor((millisBetweenCycles * (totalCycles - cycle)) / 1000);
                    if(cycle > totalCycles){
                        console.warn('Woops, done some extra trainig!');
                    }
                    else{
                        console.log('Expected wait: ' + Math.floor(remainingSeconds / 60) + 'min ' + Math.floor(remainingSeconds % 60) + 's');
                    }
                }
                cycle++;
            }
        }, millisBetweenCycles);
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