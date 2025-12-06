importScripts('https://cdn.jsdelivr.net/npm/@tensorflow/tfjs');
//<script src="https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@latest"></script>
//<script src="https://cdn.jsdelivr.net/npm/ppo-tfjs"></script>
// https://github.com/zemlyansky/ppo-tfjs

/*type WorkerMessage =
  | { type: 'model_init'; data: { name: string } }
  | { type: 'predict'; data: { inputs: number[][] } }
  | { type: 'train'; data: { 
        inputs: number[][],     // [batchSize, numInputs]
        targets: number[][],    // [batchSize, numOutputs]
        epochs?: number,        // optional
        batchSize?: number      // optional
    } };*/

const numInputs = 5;   // your input features (100)
//const numOutputs = 1;    // AI outputs (5)



let experienceBufferPerCar = {};



let model;
self.onmessage = async (e) => {
    const { type, data } = e.data;

    if (type === 'model_init') {
        if (await modelExists(data.name)) {
            model = await tf.loadLayersModel(`indexeddb://${data.name}`);
            console.log('Loaded existing model');
        } else {
            model = createModel(numInputs, "numOutputs but not required yet");
            await saveModel(model, data.name);
            console.log('Created and saved new model');
        }
        model.summary(); // logs
        self.postMessage({ type: "model_init_done" });
    } else if (type === 'predict') {
        predict(data);
    } else if (type === 'train') {
        train(data);
    } else if (type === 'delete_model') {
        deleteModel(data.name);
    }
};





async function predict(data) {
    const carID = data.carID;
    const lastSimState = data.states[data.states.length - 1];
    const agentState = [
        lastSimState.frames,

        // Our last controls
        lastSimState.controls.up,
        lastSimState.controls.down,
        lastSimState.controls.left,
        lastSimState.controls.right,
    ];
    // Direction / steering angle,  Maybe normalized position on track,  Tire slip, if you model that

    let discreteAction;
    tf.tidy(() => { // Do not use promises in .tidy!
        const inputTensor = tf.tensor2d([agentState], [1, numInputs]);
        const [steering, throttle, brake] = model.predict(inputTensor);
        const action = {
            steering: steering.arraySync()[0][0],     // -1 to 1 probability
            throttle: throttle.arraySync()[0][0],     // 0 to 1 probability
            brake: brake.arraySync()[0][0]            // 0 to 1 probability
        };

        //action.steering = Math.max(-1, Math.min(1, action.steering));
        //action.throttle = Math.random() < action.throttle ? 1 : 0;
        //action.brake = Math.random() < action.brake ? 1 : 0;

        discreteAction = {
            steering: Math.round(action.steering),
            throttle: Math.round(action.throttle),
            brake: Math.round(action.brake)
        }

        //const input = tf.tensor2d(data.inputs, [data.inputs.length, data.inputs[0].length]);
        //const output = model.predict(input);
        //const agentState = data.inputs;

        /*console.log(steering.arraySync());
        console.log(
            steering.arraySync()[0][0],        // -1 to 1
            throttle.arraySync()[0][0],        // 0 to 1 probability
            brake.arraySync()[0][0]            // 0 to 1 probability
        );*/
        //const throttleAction = Math.random() < throttle.arraySync()[0][0] ? 1 : 0;
        //const brakeAction = Math.random() < brake.arraySync()[0][0] ? 1 : 0;

        /*const [steeringMean, throttleProb, brakeProb] = actorOutput;
        // Convert steering to [-1,1]
        const steering = Math.max(-1, Math.min(1, steeringMean));
        // Sample throttle and brake from Bernoulli
        const throttle = Math.random() < throttleProb ? 1 : 0;
        const brake = Math.random() < brakeProb ? 1 : 0; */
    });

    if (!experienceBufferPerCar[carID]) experienceBufferPerCar[carID] = [];
    // First calculate the reward and set nextAgentState of our last experience state
    const xpLength = experienceBufferPerCar[carID].length;
    if (xpLength > 0) { // are we on our second state
        //const statesOfPreviousExperience = experienceBufferPerCar[carID][xpLength - 1].envStates; // get last states from xp arr

        const rewardResult = await getReward(carID, data.states); // calculate previous reward based on the outcomes of the environment at this moment
        experienceBufferPerCar[carID][xpLength - 1].reward = rewardResult.reward;
        experienceBufferPerCar[carID][xpLength - 1].nextAgentState = agentState; // store our current observed 'result' input agentState into the last nextAgentState
    }

    // Let's push the agentState and action of the current frame now
    experienceBufferPerCar[carID].push({
        frame: lastSimState.frames,
        agentState: agentState,
        action: discreteAction,
        reward: null,
        nextAgentState: null
    });
    console.log(experienceBufferPerCar);



    self.postMessage({
        type: "outputs",
        carID: carID,
        outputs: discreteAction,
        originalStates: data.states
    });
}


async function train() {
    const { inputs, targets, epochs = 1, batchSize = 32, carID } = data;

    await tf.tidy(async () => {
        const xs = tf.tensor2d(inputs, [inputs.length, inputs[0].length]);
        const ys = tf.tensor2d(targets, [targets.length, targets[0].length]);

        await model.fit(xs, ys, {
            epochs,
            batchSize,
            verbose: 0
        });
    });

    self.postMessage({ type: 'train_done', carID: carID });
}





async function getReward(carID, statesOfPreviousExperience) {
    return new Promise((resolve) => {
        self.postMessage({ type: 'calculateReward', carID: carID, states: statesOfPreviousExperience });

        const handler = (e) => {
            if (e.data.type === "calculateReward_response") {
                const data = e.data.data;
                if (data.carID == carID) { // check if this is OUR car
                    resolve(data);
                }
            }
        };
        addEventListener('message', handler, { once: true }); // handler will auto delete when received
    });
}








async function saveModel(model, name) {
    await model.save(`indexeddb://${name}`);
    console.log(`Model saved as ${name}`);
}
function createModel(numInputs, numOutputs) {
    const model = tf.sequential();

    model.add(tf.layers.dense({
        inputShape: [numInputs],
        units: 256,
        activation: 'relu'
    }));

    model.add(tf.layers.dense({
        units: 128,
        activation: 'relu'
    }));

    model.add(tf.layers.dense({
        units: 64,
        activation: 'relu'
    }));

    /*model.add(tf.layers.dense({
        units: numOutputs,
        activation: 'linear'  // continuous control outputs
    }));

    // Compile with optimizer/loss (needed even for inference + later training)
    model.compile({
        optimizer: tf.train.adam(0.001),
        loss: 'meanSquaredError'
    });*/

    // === Outputs ===
    // 1. Steering (continuous, -1 to 1)
    const steeringLayer = tf.layers.dense({ units: 1, activation: 'tanh' }); // tanh -> [-1,1]

    // 2. Throttle (0 or 1) and Brake (0 or 1) -> Bernoulli
    const throttleLayer = tf.layers.dense({ units: 1, activation: 'sigmoid' });
    const brakeLayer = tf.layers.dense({ units: 1, activation: 'sigmoid' });

    // Create a model with multiple outputs
    const steeringOutput = steeringLayer.apply(model.outputs[0]);
    const throttleOutput = throttleLayer.apply(model.outputs[0]);
    const brakeOutput = brakeLayer.apply(model.outputs[0]);

    const finalModel = tf.model({
        inputs: model.inputs,
        outputs: [steeringOutput, throttleOutput, brakeOutput]
    });

    finalModel.compile({
        optimizer: tf.train.adam(0.001),
        loss: ['meanSquaredError', 'binaryCrossentropy', 'binaryCrossentropy']
    }); /*loss array matches the outputs:
Steering → MSE (continuous)
Throttle → Binary cross-entropy
Brake → Binary cross-entropy */



    return finalModel;
}
async function modelExists(name) {
    const models = await tf.io.listModels();
    // models is an object with keys like 'indexeddb://model-1'
    return `indexeddb://${name}` in models;
}
async function deleteModel(name) {
    await tf.io.removeModel(`indexeddb://${name}`);
}
