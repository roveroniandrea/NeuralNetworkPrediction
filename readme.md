# NeuralNetworkPrediction

## [Try demo](https://roveroniandrea.github.io/NeuralNetworkPrediction)

## Basics of Artificial Neural Network
A neural network evaluates inputs and gives us some output(s). This outputs are the result of some mathematical functions calculated by the network. An **ANN** is made up of **neurons**, also called nodes. Every neuron does exactly what a compleate neural network does: he evaluates some inputs (which can be external or coming from other neurons) and produces some outputs. Every neuron belongs to one of three different groups (called **layers**) depending on it's connections with the other neurons of the network.

### Input layer
The input neurons are responsible for receiving inputs from the world (for example passed by a human) and feeding them to the next layer of neurons. Each input neuron catches only one input, so the number of input neurons depends of the length of the input that we want to feed to the network (for example a single bit, or an array of bits, or an array of pixels of an image). We'll see later that an additional input neuron, called **bias**, can be added to this layer.

### Output layer
Each output neuron takes the inputs from all the neurons of the previous layer of the network (which can be the input layer or a hidden layer), evaluates them and produces a single output. This output is one of the final outputs of the network, and has effect to the real world. The number of the output neurons (aka the size of the output layer) is exactly the number of outputs that we request to the neural network for each input.

### Hidden layer(s)
Hidden neurons are not required for a neural network to work, but can increase the complexity of the models than the network can learn, and also the speed of wich it learns.
Hidden layers are positioned between the input layer and the output layer, and are considered the main "brain" of a neural network". If a neural network has no hidden layers it's called a **Single Layer Perceptron**, because the evaluation happens in only one layer (the output one), otherwise it's called a **Multi Layer Perceptron**. If a neuron has more then two hidden layers it's also called a **Deep Neural Network**. Deciding the number of hidden layers and the size of each layer is often complex, and I've not compleately understood it, but here's what I can say from my personal experience:

1. Single Layer Perceptrons can only learn linear data predition, like dividing a cartesian plane with a linear function. It's clear that, in case of non-linear cases, the network gives wrong predictions.
![Single Layer Perceptron](https://www.kdnuggets.com/wp-content/uploads/tensorflow-predictive-analytics.png)
*Example of linear data prediction.*

2. Adding more hidden layers makes the network able to "fold" the line to better approximate the real world case. The side effect is that increases the network complexity, resulting in heavier calculations, slower learning rate, and facilitates the **overfitting** of the network (we'll talk later about overfitting and **underfitting**). I haven't explained yet the learning process (see **backward propagation alghoritm**), but for now let's anticipate that the learning rate of a layer is inversely proportional to the distance from the output layer, and this causes a complex neural network to learn slower. In any case, reading online I've found that two hidden layers are almost always sufficient.
![Multi Layer Perceptron](https://lh3.googleusercontent.com/proxy/cW__GiVXngMOS5zkuERkFU1vpsVeeSCnKE_K304NmIWTHH1Z9GA4nXsEDCwkfOgxFygvtQor6AknY0Uc7a_fgGNF_lMMLC4LP5GlURUH9YvB84lnyXsLMPUSGppq)
*Multi Layer Perceptron approximating a non linear function*

3. The recommended number of hidden neurons (in total) is more or less half the numbers of the input neurons. A lower value may result in an underfitted network, while adding too much of them will result in a slower and overfitte neural network

![Deep neural network](https://www.researchgate.net/profile/Martin_Musiol/publication/308414212/figure/fig1/AS:409040078295040@1474534162122/A-general-model-of-a-deep-neural-network-It-consists-of-an-input-layer-some-here-two.png)
*Structure of an Artificial Neural Network. In case of a Single Layer Perceptron, the input layer and the output layer are directly connected*

# W.I.P.: neuron evaluation, activation functions, bias neurons, backpropagation alghoritm, overfitting/underfitting