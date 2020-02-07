class MultiLayerNetwork {
    constructor(numInputNeurons, numHiddenNeurons, numOutputNeurons) {
        //TODO: gestire neurone di bias (attenzione agli array di lunghezza differente)
        this.inputNeurons = [];
        for (let i = 0; i < numInputNeurons; i++) {
            this.inputNeurons[i] = new Neuron(NeuronType.INPUT, 1);
        }

        this.hiddenNeurons = [];
        for (let i = 0; i < numHiddenNeurons; i++) {
            this.hiddenNeurons[i] = new Neuron(NeuronType.HIDDEN, numInputNeurons);
        }

        this.outputNeurons = [];
        for (let i = 0; i < numOutputNeurons; i++) {
            this.outputNeurons[i] = new Neuron(NeuronType.OUTPUT, numHiddenNeurons);
        }
    }

    predict(inputs) {
        if (inputs.length != this.inputNeurons.length) {
            console.error(inputs, this.inputNeurons);
            throw 'inputs must have the same length as inputNeurons';
        }
        let hiddenNeuronsResponses = [];
        for (let i = 0; i < this.hiddenNeurons.length; i++) {
            let scalarProduct = this.hiddenNeurons[i].calculateScalarProduct(inputs);
            hiddenNeuronsResponses[i] = sigmoidFunctionSingleNumber(scalarProduct);
        }
        let outputs = [];
        for (let i = 0; i < this.outputNeurons.length; i++) {
            let scalarProduct = this.outputNeurons[i].calculateScalarProduct(hiddenNeuronsResponses);
            outputs[i] = sigmoidFunctionSingleNumber(scalarProduct);
        }
        return outputs;
    }

    backpropagationCompleate(errorsOfOutputNeurons) {
        this.calculateEachNeuronError(errorsOfOutputNeurons);
        this.adjustWeigths();
    }

    calculateEachNeuronError(errorsOfOutputNeurons) {
        if (errorsOfOutputNeurons.length != this.outputNeurons.length) {
            console.error(errorsOfOutputNeurons, this.outputNeurons);
            throw 'errorsOfOutputNeurons must have the same length of outputNeurons';
        }
        for (let i = 0; i < this.outputNeurons.length; i++) {
            this.outputNeurons[i].error = errorsOfOutputNeurons[i];
        }
        //let errorsOfHiddenNeurons = [];
        for (let i = 0; i < this.hiddenNeurons.length; i++) {
            let hiddenNeuronOutputWeigths = this.getWeigthsOfSpecificIndex(i, this.outputNeurons);
            /*errorsOfHiddenNeurons[i] = */this.hiddenNeurons[i].calculateError(errorsOfOutputNeurons, hiddenNeuronOutputWeigths);
        }
    }

    adjustWeigths() {
        for (let i = 0; i < this.outputNeurons.length; i++) {
            this.outputNeurons[i].modifyWeigthsBackpropagation();
        }
        for (let i = 0; i < this.hiddenNeurons.length; i++) {
            this.hiddenNeurons[i].modifyWeigthsBackpropagation();
        }
    }

    getWeigthsOfSpecificIndex(index, neurons) {
        let weigths = [];
        for (let i = 0; i < neurons.length; i++) {
            if (index >= neurons[i].weigths.length) {
                console.error(index, neurons[i].weigths);
                throw 'Index outside of neuron weigths array';
            }
            weigths[i] = neurons[i].weigths[index];
        }
        return weigths;
    }
}

class Neuron {
    constructor(neuronType, numWeigths) {
        this.weigths = [];
        this.calculatedScalarProduct = 0.0;
        this.error = 0.0;
        this.receivedInputs = [];
        //this.neuronType = neuronType;
        if (neuronType == NeuronType.INPUT) {
            this.weigths = [1];
        }
        else {
            for (let i = 0; i < numWeigths; i++) {
                this.weigths[i] = Math.random() * 2 - 1;
            }
        }
    }

    //inputs are values calculated by neurons in the previous layer
    calculateScalarProduct(inputs) {
        this.receivedInputs = inputs;
        if (inputs.length != this.weigths.length) {
            console.error(inputs, this.weigths);
            throw 'Inputs length must be equal to weigths length';
        }
        this.calculatedScalarProduct = 0.0;
        for (let i = 0; i < inputs.length; i++) {
            this.calculatedScalarProduct += inputs[i] * this.weigths[i];
        }
        return this.calculatedScalarProduct;
    }

    //precedent errors and outputWeigths refer to next layer
    calculateError(precedentErrors, outputWeigths) {
        if (precedentErrors.length != outputWeigths.length) {
            console.error(precedentErrors, outputWeigths);
            throw 'precedentErrors length must be equal to outputWeigths length';
        }
        this.error = 0.0;
        for (let i = 0; i < precedentErrors.length; i++) {
            this.error += precedentErrors[i] * outputWeigths[i];
        }
        return this.error;
    }

    modifyWeigthsBackpropagation() {
        if (this.receivedInputs.length != this.weigths.length) {
            console.error(this.receivedInputs, this.weigths);
            throw 'receivedInputs length must be equal to weigths length';
        }
        for (let i = 0; i < this.receivedInputs.length; i++) {
            //TODO: eta coefficient?
            this.weigths[i] += this.error * derivativeSigmoidFunctionSingleNumber(this.calculatedScalarProduct) * this.receivedInputs[i];
        }
    }
}

let NeuronType = {
    INPUT: 0,
    HIDDEN: 1,
    OUTPUT: 2
}