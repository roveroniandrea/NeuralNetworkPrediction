class NeuralNetwork {
    constructor(numInputs, numOutputs) {
        this.inputWeigths = [];
        this.initWeigths(numInputs, numOutputs);
    }

    initWeigths(numInputs, numOutputs) {
        for (let i = 0; i < numOutputs; i++) {
            this.inputWeigths[i] = [];
            for (let j = 0; j < numInputs; j++) {
                this.inputWeigths[i][j] = Math.random() * 2 - 1;
            }
        }
    }

    outputNeuronsEvaluate(inputs) {
        if (inputs.length != this.inputWeigths[0].length) {
            console.log(inputs, this.inputWeigths)
            throw 'Inputs and weigths must be of same length';
        }
        else {
            let evaluatedArray = [];
            for (let i = 0; i < this.inputWeigths.length; i++) {
                let scalarProduct = 0.0;
                //scalarProduct += inputs[i] * this.inputWeigths[i];
                for (let j = 0; j < inputs.length; j++) {
                    scalarProduct += inputs[j] * this.inputWeigths[i][j];
                }
                evaluatedArray[i] = scalarProduct;
            }
            return evaluatedArray;
        }
    }

    train(errors, inputs, outputs) {
        //console.log('errors: ', errors, 'inputs: ', inputs, 'outputs: ', outputs);
        let derivativeEvaluation = derivativeSigmoidFunctionArray(outputs)
        for (let i = 0; i < outputs.length; i++) {
            for (let j = 0; j < inputs.length; j++) {
                //console.log('Correggo di ', derivativeEvaluation[i])
                this.inputWeigths[i][j] += errors[i] * inputs[j] * derivativeEvaluation[i];
            }
        }
    }

    evaluateRepeatedly(numTrainings, currentRule, trainYN) {
        let totalErrors = 0.0;
        for (let i = 0; i < numTrainings; i++) {
            let inputAndExpected = generateRandomInput(this.inputWeigths[0].length, currentRule);
            //console.log(inputAndExpected);
            let evaluated = this.outputNeuronsEvaluate(inputAndExpected.input);
            let predicted = sigmoidFunctionArray(evaluated);
            let errors = calculateErrors(inputAndExpected.expected, predicted);
            let localErrors = 0.0;
            for (let j = 0; j < errors.length; j++) {
                localErrors += Math.abs(errors[j]);
            }
            totalErrors += localErrors / errors.length;
            if (trainYN) {
                this.train(errors, inputAndExpected.input, evaluated);
            }
        }
        //console.log('Total errors: ', totalErrors);
        totalErrors /= numTrainings;
        return (1 - totalErrors) * 100;
    }
}