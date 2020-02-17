const rules = {
    FIRST_BIT: 0,
    FIRST_LAST_BITS: 1,
    XOR_GATE: 2,
    BOTH_BITS_TWO_OUTPUTS: 3,
    EVEN_BITS: 4,
    EXACT_BITS: 5,
    BITS_NEGATE: 6,
    PING_PONG_INPUT: 7,
    CONCATENATED_OR_GATE: 8,
    SUM_HALF_INPUTS: 9,
    BITSHIF_LEFT: 10,
    DIGIT_RECOGNITION: 11
}

function generateRandomInput(length, rule) {
    switch (rule) {
        case rules.FIRST_BIT: {
            let firstBit = Math.random() < 0.5 ? 0 : 1;
            let input = [];
            input[0] = firstBit;
            for (let i = 1; i < length; i++) {
                input[i] = Math.random() < 0.5 ? 0 : 1;
            }
            return {
                input: input,
                expected: [firstBit]
            };
        }
        case rules.FIRST_LAST_BITS: {
            let firstBit = Math.random() < 0.5 ? 0 : 1;
            let lastBit = Math.random() < 0.5 ? 0 : 1;
            let input = [];
            input[0] = firstBit;
            for (let i = 1; i < length - 1; i++) {
                input[i] = Math.random() < 0.5 ? 0 : 1;
            }
            input[length - 1] = lastBit;
            return {
                input: input,
                expected: [firstBit && lastBit]
            };
        }
        case rules.XOR_GATE: {
            let firstBit = Math.random() < 0.5 ? 0 : 1;
            let lastBit = Math.random() < 0.5 ? 0 : 1;
            let input = [];
            input[0] = firstBit;
            for (let i = 1; i < length - 1; i++) {
                input[i] = Math.random() < 0.5 ? 0 : 1;
            }
            input[length - 1] = lastBit;
            return {
                input: input,
                expected: [(firstBit || lastBit) && !(firstBit && lastBit)]
            };
        }
        case rules.BOTH_BITS_TWO_OUTPUTS: {
            let firstBit = Math.random() < 0.5 ? 0 : 1;
            let lastBit = Math.random() < 0.5 ? 0 : 1;
            let input = [];
            input[0] = firstBit;
            for (let i = 1; i < length - 1; i++) {
                input[i] = Math.random() < 0.5 ? 0 : 1;
            }
            input[length - 1] = lastBit;
            return {
                input: input,
                expected: [firstBit, lastBit]
            };
        }
        case rules.EVEN_BITS: {
            let input = [];
            let expected = true;
            for (let i = 0; i < length; i++) {
                input[i] = Math.random() < 0.5 ? 0 : 1;
                if (i % 2 == 1) {
                    expected = expected && (input[i] == 1)
                }
            }
            return {
                input: input,
                expected: [(expected ? 1 : 0)]
            };
        }
        case rules.EXACT_BITS: {
            let input = [];
            for (let i = 0; i < length; i++) {
                input[i] = Math.random() < 0.5 ? 0 : 1;
            }
            return {
                input: input,
                expected: input
            };
        }
        case rules.BITS_NEGATE: {
            let input = [];
            let expected = [];
            for (let i = 0; i < length; i++) {
                input[i] = Math.random() < 0.5 ? 0 : 1;
                expected[i] = input[i] == 0 ? 1 : 0;
            }
            return {
                input: input,
                expected: expected
            };
        }
        case rules.PING_PONG_INPUT: {
            let input = [];
            let expected = [];
            for (let i = 0; i < length; i++) {
                input[i] = Math.random() < 0.5 ? 0 : 1;
                expected[i] = input[i];
            }
            for (let i = length; i < length * 2; i++) {
                expected[i] = expected[length * 2 - (i + 1)];
            }
            return {
                input: input,
                expected: expected
            };
        }
        case rules.CONCATENATED_OR_GATE: {
            let input = [];
            let expected = false;
            for (let i = 0; i < length; i++) {
                input[i] = Math.random() < 0.5 ? 0 : 1;
                expected0 = expected || (input[i] == 1);
            }
            return {
                input: input,
                expected: [(expected ? 1 : 0)]
            };
        }
        case rules.SUM_HALF_INPUTS: {
            let input = [];
            for (let i = 0; i < length; i++) {
                input[i] = Math.random() < 0.5 ? 0 : 1;
            }
            let expectedDecimal = fromBitArrayToDecimal(input.slice(0, input.length / 2)) + fromBitArrayToDecimal(input.slice(input.length / 2, input.length));
            return {
                input: input,
                expected: fromDecToBinArray(expectedDecimal, (input.length / 2) + 1)
            }
        }
        case rules.BITSHIF_LEFT:{
            let input = [];
            let expected = [];
            for (let i = 0; i < length; i++) {
                input[i] = Math.random() < 0.5 ? 0 : 1;
                expected[i] = input[i];
            }
            if(input[input.length - 1] == 1){
                //bitshift of 2
                expected[expected.length] = 0;
                expected[expected.length] = 0;
            }
            else{
                //bitshift of 1
                expected.unshift([0]);
                expected[expected.length] = 0;
            }

            return {
                input: input,
                expected: expected
            };
        }
        default: {
            throw 'Rule generation not implemented';
        }
    }
}

function assignAndValidateRule(value, numberInputNeurons) {
    switch (value) {
        case rules.FIRST_BIT: {
            return rules.FIRST_BIT;
        }
        case rules.FIRST_LAST_BITS: {
            if (numberInputNeurons < 2) { throw 'Input neurons must be more or equal to 2' }
            return rules.FIRST_LAST_BITS;
        }
        case rules.XOR_GATE: {
            if (numberInputNeurons < 2) { throw 'Input neurons must be more or equal to 2' }
            return rules.XOR_GATE;
        }
        case rules.BOTH_BITS_TWO_OUTPUTS: {
            if (numberInputNeurons < 2) { throw 'Input neurons must be more or equal to 2' }
            return rules.BOTH_BITS_TWO_OUTPUTS;
        }
        case rules.EVEN_BITS: {
            if (numberInputNeurons < 2) { throw 'Input neurons must be more or equal to 2' }
            return rules.EVEN_BITS;
        }
        case rules.EXACT_BITS: {
            return rules.EXACT_BITS;
        }
        case rules.BITS_NEGATE: {
            return rules.BITS_NEGATE;
        }
        case rules.PING_PONG_INPUT: {
            return rules.PING_PONG_INPUT;
        }
        case rules.CONCATENATED_OR_GATE: {
            return rules.CONCATENATED_OR_GATE;
        }
        case rules.SUM_HALF_INPUTS: {
            if (numberInputNeurons % 2 == 1) { throw 'Input neurons must be pair' }
            return rules.SUM_HALF_INPUTS;
        }
        case rules.BITSHIF_LEFT:{
            return rules.BITSHIF_LEFT;
        }
        default: {
            throw 'Rule validation not implemented';
        }
    }
}

function correctNumberOfOutputs(rule, numberInputNeurons) {
    switch (rule) {
        case rules.FIRST_BIT: {
            return 1;
        }
        case rules.FIRST_LAST_BITS: {
            return 1;
        }
        case rules.XOR_GATE: {
            return 1;
        }
        case rules.BOTH_BITS_TWO_OUTPUTS: {
            return 2;
        }
        case rules.EVEN_BITS: {
            return 1;
        }
        case rules.EXACT_BITS: {
            return numberInputNeurons;
        }
        case rules.BITS_NEGATE: {
            return numberInputNeurons;
        }
        case rules.PING_PONG_INPUT: {
            return numberInputNeurons * 2;
        }
        case rules.CONCATENATED_OR_GATE: {
            return 1;
        }
        case rules.SUM_HALF_INPUTS:{
            return (numberInputNeurons / 2) + 1;
        }
        case rules.BITSHIF_LEFT:{
            return numberInputNeurons + 2;
        }
        default: {
            throw 'Output setting not implemented';
        }
    }
}
