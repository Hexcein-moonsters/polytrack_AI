const workerTimeOrigin = performance.timeOrigin;
importScripts('/lib/tfjs.js');

const numInputs = 93;  



let experienceBufferPerCar = {};
const verbose = false;
const info = false;

// will be updated by model_init
let timeOffset = 0;
let calculateReward;
//const getTime = () => timeOffset + performance.now(); // function
const getTime = () => performance.now() + timeOffset;


let policyNetwork, valueNetwork;
self.onmessage = async (e) => {
    if (e.data instanceof ArrayBuffer) { // Not that redundant, as this check is often true since 'predict' is called lots of times
        // This means we must be in 'predict'
        const arr = [... new Float32Array(e.data)]; // convert to array by spread-cloning // data.buffer

        const startsAtIndex = arr[0];
        predict(arr.slice(startsAtIndex), arr[1], arr[2], arr[3], arr[4]); // pass all floats starting from the start index. This means it removes our index header and the extra non-state floats
    } else {
        const { type, data } = e.data;

        //console.log("Training worker received message of type:", type);
        if (type === 'model_init') {
            model_init(data);
        } else if (type === 'predict') {
            console.error("Error: Usage of old predict! This doesn't do anything. Please send 'buffer, [buffer]', and not a type or data");
            //if (data.buffer && data.buffer instanceof ArrayBuffer) {

            //const view = new DataView(e.data);
            //const startTime = view.getFloat32(0);
            //const arr = [ ... new Float32Array(e.data) ]; // convert to array by spread-cloning // data.buffer

            //const startsAtIndex = arr[0];
            //predict(arr.slice(startsAtIndex), arr[1], arr[2]); // pass all floats starting from the start index. This means it removes our index header and the extra non-state floats
        } else if (type === 'train') {
            train(data);
        } else if (type === 'save') {
            saveModel(policyNetwork, data.name + "-policyNetwork");
            saveModel(valueNetwork, data.name + "-valueNetwork");
        } else if (type === 'delete_model') {
            deleteModel(data.name);
        }

        else if (type === 'bestAttempt_recordingStringDone') {
            recordingStringDone(data);
        }
    }
};








async function model_init(data) {
    const mainTimeOrigin = data.mainTimeOrigin;
    timeOffset = workerTimeOrigin - mainTimeOrigin;

    let isNewModel = false;
    if (await modelExists(data.name)) {
        policyNetwork = await tf.loadLayersModel(`indexeddb://${data.name}-policyNetwork`);
        valueNetwork = await tf.loadLayersModel(`indexeddb://${data.name}-valueNetwork`);
        console.log('Loaded existing model, both policyNetwork and valueNetwork');
    } else {
        const modelResult = createModel(numInputs);
        policyNetwork = modelResult.policyNetwork;
        valueNetwork = modelResult.valueNetwork;
        await saveModel(policyNetwork, data.name + "-policyNetwork");
        await saveModel(valueNetwork, data.name + "-valueNetwork");
        console.log('Created and saved new PPO model');
        isNewModel = true;
    }
    policyNetwork.summary(); // logs
    self.postMessage({ type: "model_init_done", data: { isNewModel: isNewModel } });
}


async function predict(agentState, startTime, carID, reward, finishFrames) {
    if (info) console.log(((getTime()) - startTime).toFixed(5));
    const currentFrame = agentState[0]; // we know it is at start
    if (finishFrames == 0) finishFrames = null; // restore malformed data by float32array
   
    if (verbose) console.log(agentState);
    // Direction / steering angle,  Maybe normalized position on track,  Tire slip, if you model that

    let action, valueEstimate;
    tf.tidy(() => { // Do not use promises in .tidy!
        const agentStateTensor = tf.tensor(agentState).reshape([1, numInputs]);
        action = getAction(policyNetwork, agentStateTensor);

        //console.log('Steering:', steering);
        //console.log('Throttle:', throttle);
        //console.log('Brake:', brake);
        if (verbose) console.log('Action Probability:', action.actionProb);
        //console.log('Action Index:', actionIndex);


        const vs = valueNetwork.predict(agentStateTensor);
        valueEstimate = vs.arraySync()[0][0]; // we only have 1 output

        if (info) console.log("Value network estimation:", valueEstimate);
    });


    if (!experienceBufferPerCar[carID]) experienceBufferPerCar[carID] = [];
    // First calculate the reward and set nextAgentState of our last experience state
    const xpLength = experienceBufferPerCar[carID].length;
    if (xpLength > 0) { // are we on our second state
        //const statesOfPreviousExperience = experienceBufferPerCar[carID][xpLength - 1].envStates; // get last states from xp arr

        //const reward = calculateReward(carID, data.states); // calculate previous reward based on the outcomes of the environment at this moment
        experienceBufferPerCar[carID][xpLength - 1].reward = reward;
        experienceBufferPerCar[carID][xpLength - 1].nextAgentState = agentState; // store our current observed 'result' input agentState into the last nextAgentState
        //if (lastSimState.finishFrames !== null) { // car has finished
        if (finishFrames !== null) { // car has finished
            experienceBufferPerCar[carID][xpLength - 1].done = true;
            console.warn("Car " + carID + " is done!!!");
            return; // no need to add our useless action if we've already finished
        }
        if (info) console.log("Real reward:", reward, "at frame " + experienceBufferPerCar[carID][xpLength - 1].frame);
    }

    // Let's push the agentState and action of the current frame now
    experienceBufferPerCar[carID].push({
        frame: currentFrame, //lastSimState.frames,
        agentState: agentState,
        action: action,
        valueEstimate: valueEstimate,
        reward: null, // currentFrame >= 400 ? 0 : null
        nextAgentState: null,
        done: false // will be marked in next state
    });
    if (verbose) console.log("Experience buffer:", experienceBufferPerCar);

    /*if (carID == 0) {
        console.log(lastSimState.frames);
    }*/

    self.postMessage({
        type: "outputs",
        data: {
            carID: carID,
            outputs: action,
            //originalStates: data.states
            //lastFrame: data.states[data.states.length - 1].frames
            lastFrame: currentFrame // var name is confusing but it means the frame of the last state we're at
        }
    });
}




async function train(data) {
    //const { carID, carRequestId, progressIndex, epochs = 1, batchSize = 32, gamma = 0.99, lambda = 0.95, epsilon = 0.2, learningRate = 0.0003 } = data; // 0.0003
    const { carID, carRequestId, progressIndex, PPO_CONFIG } = data;
    const { // default hyperparams
        gamma = 0.99,
        lambda = 0.95,          // GAE lambda
        clipEpsilon = 0.2,
        policyLearningRate = 3e-4,
        valueLearningRate = 1e-3,
        entropyCoef = 0.01,     // c2
        valueCoef = 0.5,        // c1
        epochs = 10,
        minibatchSize = 32,
        maxGradNorm = 0.5
        // MORE HYPERPARAMS??? I DONT KNOW
    } = PPO_CONFIG;




    // == 3. HELPER: GET PROBABILITY OF CHOSEN ACTION ==
    function computePolicyProbabilities(policyOutputs, actionIndices) {
        // policyOutputs: [batch, 12]
        // actionIndices: [batch] (e.g., [0, 5, 11, ...])
        return tf.gather(policyOutputs, actionIndices, 1);
    }

    // == 4. ADVANTAGE CALCULATION (VALUE NETWORK USED HERE) ==
    function computeAdvantages(valueNet, statesTensor, buffer, gamma = 0.99) {
        const vs = valueNet.predict(statesTensor); // V(s)
        const nextStates = tf.tensor(buffer.map(e => e.nextAgentState));
        const vsNext = valueNet.predict(nextStates); // V(s')

        // Adv = r + γV(s') - V(s)
        const rewards = tf.tensor(buffer.map(e => e.reward));
        const advantages = tf.add(
            rewards,
            tf.mul(gamma, tf.squeeze(vsNext))
        );
        return tf.sub(advantages, tf.squeeze(vs));
    }


    // ====== 3. TRAINING LOOP (PPO CORE) ======
    async function trainPPO(policyNet, valueNet, buffer) {
        //const { returns, advantages } = calculateGAE(buffer, gamma, lambda); // doesn't work yet
        debugger;
        return;
    }



    let totalReward = 0;
    experienceBufferPerCar[carID].forEach((exp, index) => { // Count up all rewards (not needed for training) but also fix the 'null' rewards to 0
        if (exp.reward == null) { // last state
            experienceBufferPerCar[carID][index].reward = 0; // I have no idea if exp is direct reference or copy, so I'll just do both ways of 0 as fallback
            exp.reward = 0;
            //console.log("Set a reward to 0 at:", exp);
        }
        if (exp.nextAgentState == null) {
            // Change nextAgentState to copy of current agentState, gaslighting it into thinking nothing changed
            experienceBufferPerCar[carID][index].nextAgentState = [...exp.agentState]; // spread copy, idk if necessary, probably not
        }
        totalReward += exp.reward;
    });

    await trainPPO(policyNetwork, valueNetwork, experienceBufferPerCar[carID]);

    if (totalReward > bestAttempt.totalReward) {
        bestAttempt = { totalReward: totalReward, data: [{ ...experienceBufferPerCar[carID] }], carRecording: "" }; // copy spread into array
        console.log("NEW BEST ATTEMPT:", bestAttempt.totalReward, "with data:", bestAttempt.data);

        postMessage({
            type: "bestAttempt_createRecordingString", // Takes about 50ms for response
            data: {
                carRequestId: carRequestId, // this will make simulation_communicator.js pull from the inputs list of that original specific DeleteCar request
                //actions: actions,
                totalReward: totalReward,
                progressIndex: progressIndex, // main can show stats
                startTime: performance.now()
            }
        });
    }

    console.log("Car " + carID + " got " + totalReward + " total reward");
    delete experienceBufferPerCar[carID]; // remove our experience

    self.postMessage({
        type: 'train_done',
        data: {
            carID: carID,
            totalReward: totalReward, // totalReward and the progres are used for stats graph in main
            progressIndex
        }
    });
}

let bestAttempt = { totalReward: 0, data: [] }; // reset fallback




function recordingStringDone(data) {
    const { carRecording, totalReward } = data;
    if (bestAttempt.totalReward == totalReward) {
        bestAttempt.carRecording = carRecording;
        console.log(bestAttempt);
        console.log("Getting recording took " + (performance.now() - data.startTime).toFixed(2) + "ms");
    } else { // Normally this always arrives in sync, but just in case. Nvm it can sometimes happen
        console.warn("Our bestAttempt has been updated while we were requesting carRecording string");
    }
}



async function saveModel(model, name) {
    await model.save(`indexeddb://${name}`);
    //console.log(`Model saved as ${name}`);
}
function createModel(numInputs) {
    // Shared hidden layers (used by both policy & value networks)
    const sharedLayers = [
        tf.layers.dense({ units: 256, activation: 'relu', name: 'hidden1' }),
        tf.layers.dense({ units: 128, activation: 'relu', name: 'hidden2' }),
        tf.layers.dense({ units: 64, activation: 'relu', name: 'hidden3' })
    ];

    function createPolicyNetwork(numInputs) {
        const input = tf.input({ shape: [numInputs] });
        let x = input;
        for (const layer of sharedLayers) x = layer.apply(x);
        // CORRECT: 12 logits for all 12 valid actions
        const policyHead = tf.layers.dense({ units: 12, activation: 'linear' }).apply(x);
        return tf.model({ inputs: input, outputs: [policyHead] });
    }
    function createValueNetwork(numInputs) {
        const input = tf.input({ shape: [numInputs] });
        let x = input;
        // Shared hidden layers (same as policy network)
        for (const layer of sharedLayers) {
            x = layer.apply(x);
        }
        // Value head: Single scalar output (state value)
        const valueHead = tf.layers.dense({ units: 1, activation: 'linear', name: 'value' }).apply(x);
        return tf.model({ inputs: input, outputs: [valueHead] });
    }

    const finalPolicyNetwork = createPolicyNetwork(numInputs);
    const finalValueNetwork = createValueNetwork(numInputs);

    return {
        policyNetwork: finalPolicyNetwork,
        valueNetwork: finalValueNetwork
    }
}
async function modelExists(name) {
    const models = await tf.io.listModels();
    // models is an object with keys like 'indexeddb://model-1'
    return (`indexeddb://${name}-policyNetwork` in models) && (`indexeddb://${name}-valueNetwork` in models); // both must exist
}
async function deleteModel(name) {
    await tf.io.removeModel(`indexeddb://${name}-policyNetwork`);
    await tf.io.removeModel(`indexeddb://${name}-valueNetwork`);

    self.postMessage({ type: 'delete_model_done' });
}








function getAction(policyModel, agentStateTensor) {
    return tf.tidy(() => {
        const policyOutput = policyModel.predict(agentStateTensor); // [1, 12]

        // Convert logits to probabilities (softmax over 12 actions)
        const actionProbs = tf.softmax(policyOutput).arraySync()[0];

        // Sample the FULL action (index 0-11)
        const actionIndex = sampleFromCategorical(actionProbs);

        if (verbose) console.log("Policy output:", policyOutput.arraySync()[0]);
        if (verbose) console.log("Actionprobs:", actionProbs);
        //console.log("Chosen action index from policy probabilities: " + actionIndex);

        // Map index to (steering, throttle, brake)
        const [steering, throttle, brake] = decodeAction(actionIndex);

        // CRITICAL: Return the joint probability for training
        //const actionProb = actionProbs[actionIndex];

        const logProb = logProbCategorical(policyOutput, actionIndex).arraySync()[0]; // log of 100% is 0, anything less will be to -Infinity

        //stateTensor.dispose();
        //policyOutput.dispose();
        return { steering, throttle, brake, /*actionProb,*/ actionIndex, logProb };
    });
}


// Map index 0-11 to (steering, throttle, brake)
function decodeAction(index) {
    // Index: 0= (-1,0,0), 1= (-1,0,1), 2= (-1,1,0), 3= (-1,1,1),
    //         4= (0,0,0), 5= (0,0,1), 6= (0,1,0), 7= (0,1,1),
    //         8= (1,0,0), 9= (1,0,1), 10= (1,1,0), 11= (1,1,1)
    const actions = [
        [-1, 0, 0], [-1, 0, 1], [-1, 1, 0], [-1, 1, 1],
        [0, 0, 0], [0, 0, 1], [0, 1, 0], [0, 1, 1],
        [1, 0, 0], [1, 0, 1], [1, 1, 0], [1, 1, 1]
    ];
    return actions[index];
}


// Sample from 12-action distribution
function sampleFromCategorical(probs) {
    let r = Math.random();
    let sum = 0;
    for (let i = 0; i < probs.length; i++) {
        sum += probs[i];
        if (r < sum) return i;
    }
    return probs.length - 1; // Fallback
}




function logProbCategorical(logits, action) {
    return tf.tidy(() => {
        const numActions = logits.shape[logits.shape.length - 1];
        const logprobabilitiesAll = tf.logSoftmax(logits);
        return tf.sum(
            tf.mul(tf.oneHot(action, numActions), logprobabilitiesAll), // onehot with indices 'action' and depth numActions
            logprobabilitiesAll.shape.length - 1
        );
    })
}






function discountedCumulativeSums(arr, gamma) {
    let res = [];
    let sum = 0;
    arr.slice().reverse().forEach(value => {
        sum = value + sum * gamma;
        res.push(sum);
    });
    return res.reverse();
}














// Not sure about this one
function calculateGAE(buffer, gamma, lambda) { // I DONT THINK THIS WORKS PROPERLY YET
    const advantages = new Array(buffer.length);
    const returns = new Array(buffer.length);

    let gae = 0;
    let nextValue = 0;

    for (let t = buffer.length - 1; t >= 0; t--) {
        const { reward, valueEstimate } = buffer[t];
        const delta = reward + gamma * nextValue - valueEstimate;
        gae = delta + gamma * lambda * gae;

        advantages[t] = gae;
        returns[t] = gae + valueEstimate;
        nextValue = valueEstimate;
    }

    return { advantages, returns };
}




// highly likely that doesn't work I think, and it's not even used anywhere rn
function normalize(array) { // Normalizing the advantages
    const mean = array.reduce((a, b) => a + b, 0) / array.length;
    const std = Math.sqrt(
        array.reduce((a, b) => a + (b - mean) ** 2, 0) / array.length + 1e-8 // add 1e-8 so it never devides by 0
    );
    return array.map(x => (x - mean) / std);
}
