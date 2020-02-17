class MultiLayerNetwork {
    constructor(numInputNeurons, hiddenLayersAndNeurons, numOutputNeurons) {
        //TODO: gestire neurone di bias (attenzione agli array di lunghezza differente)
        this.inputNeurons = [];
        this.inputNeurons[0] = new Neuron(NeuronType.BIAS, 1);
        for (let i = 1; i < numInputNeurons + 1; i++) {
            this.inputNeurons[i] = new Neuron(NeuronType.INPUT, 1);
        }

        this.hiddenLayers = [];
        for (let l = 0; l < hiddenLayersAndNeurons.length; l++) {
            let hiddenNeurons = [];
            hiddenNeurons[0] = new Neuron(NeuronType.BIAS, 1);
            for (let i = 1; i < hiddenLayersAndNeurons[l] + 1; i++) {
                if (l == 0) {
                    hiddenNeurons[i] = new Neuron(NeuronType.HIDDEN, this.inputNeurons.length);
                }
                else {
                    hiddenNeurons[i] = new Neuron(NeuronType.HIDDEN, this.hiddenLayers[l - 1].length);
                }
            }
            this.hiddenLayers[l] = hiddenNeurons;
        }

        this.outputNeurons = [];
        for (let i = 0; i < numOutputNeurons; i++) {
            this.outputNeurons[i] = new Neuron(NeuronType.OUTPUT, this.hiddenLayers[this.hiddenLayers.length - 1].length);
        }
        console.log(this)
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
            inputNeuronsResponses[i] = scalarProduct;//sigmoidFunctionSingleNumber(scalarProduct);
        }

        let hiddenNeuronsResponses = [];
        for (let l = 0; l < this.hiddenLayers.length; l++) {
            let currentNeuronsResponses = [];
            for (let i = 0; i < this.hiddenLayers[l].length; i++) {
                let scalarProduct = 0.0;
                if (this.hiddenLayers[l][i].neuronType == NeuronType.BIAS) {
                    if (i != 0) {
                        console.error(this.hiddenLayers[l][i], i);
                        throw 'Hidden bias neuron must be at index 0';
                    }
                    scalarProduct = this.hiddenLayers[l][i].calculateScalarProduct([]);
                }
                else {
                    if (l == 0) {
                        scalarProduct = this.hiddenLayers[l][i].calculateScalarProduct(inputNeuronsResponses);
                    }
                    else {
                        scalarProduct = this.hiddenLayers[l][i].calculateScalarProduct(hiddenNeuronsResponses);
                    }
                }
                currentNeuronsResponses[i] = sigmoidFunctionSingleNumber(scalarProduct);
            }
            hiddenNeuronsResponses = currentNeuronsResponses;
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
        let errorsOfHiddenNeurons = [];
        for (let l = this.hiddenLayers.length - 1; l >= 0; l--) {
            let errorsOfCurrentNeurons = [];
            for (let i = 0; i < this.hiddenLayers[l].length; i++) {

                if (l == this.hiddenLayers.length - 1) {
                    let hiddenNeuronOutputWeigths = this.getWeigthsOfSpecificIndex(i, this.outputNeurons);
                    errorsOfCurrentNeurons[i] = this.hiddenLayers[l][i].calculateError(errorsOfOutputNeurons, hiddenNeuronOutputWeigths);
                }
                else {
                    let hiddenNeuronOutputWeigths = this.getWeigthsOfSpecificIndex(i, this.hiddenLayers[l + 1]);
                    errorsOfCurrentNeurons[i] = this.hiddenLayers[l][i].calculateError(errorsOfHiddenNeurons, hiddenNeuronOutputWeigths);
                }
            }
            errorsOfHiddenNeurons = errorsOfCurrentNeurons;
        }
    }

    adjustWeigths() {
        for (let i = 0; i < this.outputNeurons.length; i++) {
            this.outputNeurons[i].modifyWeigthsBackpropagation();
        }
        for (let l = this.hiddenLayers.length - 1; l >= 0; l--) {
            for (let i = 0; i < this.hiddenLayers[l].length; i++) {
                this.hiddenLayers[l][i].modifyWeigthsBackpropagation();
            }
        }
    }

    getWeigthsOfSpecificIndex(index, neurons) {
        let weigths = [];
        for (let i = 0; i < neurons.length; i++) {
            if(neurons[i].neuronType == NeuronType.BIAS){
                weigths[i] = 0;
            }
            else{
                if (index >= neurons[i].weigths.length) {
                    console.error(index, neurons[i].weigths);
                    throw 'Index outside of neuron weigths array';
                }
                weigths[i] = neurons[i].weigths[index];
            }
        }
        return weigths;
    }

    fromJson(nw){
        for(let i=0; i < nw.inputNeurons.length; i++){
            this.inputNeurons[i] = new Neuron(nw.inputNeurons[i].neuronType, 1);
            for(let k=0; k < nw.inputNeurons[i].weigths.length; k++){
                this.inputNeurons[i].weigths[k] = nw.inputNeurons[i].weigths[k];
            }
        }

        for(let l=0; l < nw.hiddenLayers.length; l++){
            this.hiddenLayers[l] = [];
            for(let i=0; i < nw.hiddenLayers[l].length; i++){
                this.hiddenLayers[l][i] = new Neuron(nw.hiddenLayers[l][i].neuronType, 1);
                for(let k=0; k < nw.hiddenLayers[l][i].weigths.length; k++){
                    this.hiddenLayers[l][i].weigths[k] = nw.hiddenLayers[l][i].weigths[k];
                }
            }
        }

        for(let i=0; i < nw.outputNeurons.length; i++){
            this.outputNeurons[i] = new Neuron(nw.outputNeurons[i].neuronType, 1);
            for(let k=0; k < nw.outputNeurons[i].weigths.length; k++){
                this.outputNeurons[i].weigths[k] = nw.outputNeurons[i].weigths[k];
            }
        }
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
                this.weigths[i] = (Math.random() * 2 - 1) * 0.5;
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
            this.calculatedScalarProduct = this.weigths[0];
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
                let manyNeuronsContrast = this.weigths.length;
                this.weigths[i] += this.error * derivativeSigmoidFunctionSingleNumber(this.calculatedScalarProduct / manyNeuronsContrast) * this.receivedInputs[i];
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