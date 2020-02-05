function sigmoidFunction(x) {
    let outputs = [];
    for (let i = 0; i < x.length; i++) {
        outputs[i] = 1.0 / (1.0 + Math.exp(-x[i]));
    }
    return outputs;
}

function derivativeSigmoidFunction(x) {
    let ys = [];
    for (let i = 0; i < x.length; i++) {
        ys[i] = Math.exp(-x[i]) / Math.pow((1 + Math.exp(-x[i])), 2)
    }
    return ys;
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