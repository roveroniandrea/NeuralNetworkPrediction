class MultiLayerNetwork {
    constructor(numInputNeurons, numHiddenNeurons, numOutputNeurons) {
        //TODO: gestire neurone di bias (attenzione agli array di lunghezza differente)
        this.inputNeurons = [];
        this.inputNeurons[0] = new Neuron(NeuronType.BIAS, 1);
        for (let i = 1; i < numInputNeurons + 1; i++) {
            this.inputNeurons[i] = new Neuron(NeuronType.INPUT, 1);
        }

        this.hiddenNeurons = [];
        this.hiddenNeurons[0] = new Neuron(NeuronType.BIAS, 1);
        for (let i = 1; i < numHiddenNeurons + 1; i++) {
            this.hiddenNeurons[i] = new Neuron(NeuronType.HIDDEN, this.inputNeurons.length);
        }

        this.outputNeurons = [];
        for (let i = 0; i < numOutputNeurons; i++) {
            this.outputNeurons[i] = new Neuron(NeuronType.OUTPUT, this.hiddenNeurons.length);
        }
    }

    predict(inputs) {
        //counting input bias neuron
        if ((inputs.length + 1) != this.inputNeurons.length) {
            console.error(inputs, this.inputNeurons);
            throw 'inputs must have the same length as inputNeurons';
        }
        let inputNeuronsResponses = [];
        for (let i = 0; i < this.inputNeurons.length; i++) {
            let scalarProduct = 0.0;
            if (this.inputNeurons[i].neuronType == NeuronType.BIAS) {
                if (i != 0) {
                    console.error(this.inputNeurons[i], i);
                    throw 'Input bias neuron must be at index 0';
                }
                scalarProduct = this.inputNeurons[i].calculateScalarProduct([]);
            }
            else {
                scalarProduct = this.inputNeurons[i].calculateScalarProduct([inputs[i - 1]]);
            }
            inputNeuronsResponses[i] = sigmoidFunctionSingleNumber(scalarProduct);
        }

        let hiddenNeuronsResponses = [];
        for (let i = 0; i < this.hiddenNeurons.length; i++) {
            let scalarProduct = 0.0;
            if (this.hiddenNeurons[i].neuronType == NeuronType.BIAS) {
                if (i != 0) {
                    console.error(this.hiddenNeurons[i], i);
                    throw 'Hidden bias neuron must be at index 0';
                }
                scalarProduct = this.hiddenNeurons[i].calculateScalarProduct([]);
            }
            else {
                scalarProduct = this.hiddenNeurons[i].calculateScalarProduct(inputNeuronsResponses);
            }
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
        this.neuronType = neuronType;
        //this.neuronType = neuronType;
        if (neuronType == NeuronType.INPUT || neuronType == NeuronType.BIAS) {
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
        if (this.neuronType == NeuronType.BIAS) {
            if (inputs.length > 0) {
                console.error(inputs);
                throw 'Inputs length must be equal to 0 for bias neuron';
            }
            this.calculatedScalarProduct = 1
            return this.calculatedScalarProduct;
        }
        if (this.neuronType == NeuronType.INPUT) {
            if (inputs.length != 1) {
                console.error(inputs);
                throw 'Inputs length must be equal to 1 for input neuron';
            }
            this.calculatedScalarProduct = inputs[0];
            return this.calculatedScalarProduct;
        }
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
        if (this.neuronType != NeuronType.INPUT && this.neuronType != NeuronType.BIAS) {
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
}

let NeuronType = {
    INPUT: 0,
    HIDDEN: 1,
    OUTPUT: 2,
    BIAS: 3
}