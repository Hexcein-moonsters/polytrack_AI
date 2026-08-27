const workerTimeOrigin = performance.timeOrigin;
importScripts('/lib/tfjs.js');

const numInputs = 93;


const policyLearningRate = 3e-4;
const valueLearningRate = 1e-3;

// Consider moving these optimizers outside this function so optimizer state is preserved across calls:
let policyOptimizer = tf.train.adam(policyLearningRate);
let valueOptimizer = tf.train.adam(valueLearningRate);



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
        epochs = 8, // 4-16?
        minibatchSize = 32, // (if buffer length < 128, use minibatch = buffer length)
        maxGradNorm = 0.5
        // MORE HYPERPARAMS??? I DONT KNOW
    } = PPO_CONFIG;


    // ----------------- PPO TRAINING INSERT START -----------------
    // Replace existing calculateGAE, normalize, and trainPPO with the code below:


    // --- helper: compute mean/std for a JS Float32Array or regular numeric array
    function meanStd(arr) {
        const n = arr.length;
        if (n === 0) return { mean: 0, std: 0 };
        let sum = 0;
        for (let i = 0; i < n; i++) sum += arr[i];
        const mean = sum / n;
        let sq = 0;
        for (let i = 0; i < n; i++) {
            const d = arr[i] - mean;
            sq += d * d;
        }
        const std = Math.sqrt(sq / n + 1e-8);
        return { mean, std };
    }

    // --- helper: clip gradients by global norm (TF.js-compatible)
    function clipGradientsByGlobalNorm(gradsArray, maxNorm) {
        // gradsArray: Array of tf.Tensor (or null) gradients
        // returns { clipped: Array<tf.Tensor|null>, globalNorm: number }
        let totalSquare = 0.0;
        const tmpSquares = [];
        for (let i = 0; i < gradsArray.length; i++) {
            const g = gradsArray[i];
            if (!g) { tmpSquares.push(null); continue; }
            // compute square sum for this gradient
            const s = g.square().sum(); // tf.Tensor scalar
            const sVal = s.arraySync(); // synchronous read, small cost
            tmpSquares.push(s);
            totalSquare += sVal;
        }
        const globalNorm = Math.sqrt(totalSquare);
        const clipCoef = globalNorm > maxNorm ? (maxNorm / (globalNorm + 1e-6)) : 1.0;

        // build clipped grads (new tensors)
        const clipped = gradsArray.map(g => {
            if (!g) return null;
            if (clipCoef === 1.0) return g.clone(); // safe clone so we can dispose original later
            return g.mul(clipCoef);
        });

        // dispose temporary scalars used to compute norms
        for (const t of tmpSquares) if (t) t.dispose();

        return { clipped, globalNorm };
    }


    /**
     * Compute Generalized Advantage Estimation (GAE) and returns for a buffer.
     * Uses current valueNetwork to get V(s) and V(s').
     * buffer: array of experiences with fields { agentState, reward, nextAgentState, done }
     * returns: { advantages: Float32Array, returns: Float32Array }
     */
    async function calculateGAE_withValueNet(buffer, gamma, lambda, valueNet) {
        // Build tensors
        const states = tf.tensor2d(buffer.map(e => e.agentState), [buffer.length, numInputs]);
        const nextStates = tf.tensor2d(buffer.map(e => e.nextAgentState), [buffer.length, numInputs]);

        // Get V(s) and V(s+1)

        const Vs = valueNet.predict(states); // shape [N, 1]
        const VsNext = valueNet.predict(nextStates); // shape [N, 1]

        const vs = await Vs.array();       // [[v0], [v1], ...]
        const vsNext = await VsNext.array();

        // Clean up
        Vs.dispose();
        VsNext.dispose();
        states.dispose();
        nextStates.dispose();

        const N = buffer.length;
        const advantages = new Float32Array(N);
        const returns = new Float32Array(N);

        let gae = 0.0;
        // iterate reversed
        for (let t = N - 1; t >= 0; t--) {
            const reward = buffer[t].reward;
            const value = vs[t][0];
            const valueNext = vsNext[t][0];
            const done = buffer[t].done ? 1.0 : 0.0;

            const delta = reward + gamma * valueNext * (1.0 - done) - value;
            gae = delta + gamma * lambda * (1.0 - done) * gae;

            advantages[t] = gae;
            returns[t] = gae + value;
        }

        return { advantages, returns };
    }

    /** Normalize Float32Array in-place and return normalized Float32Array */
    function normalizeFloat32(array) {
        const n = array.length;
        if (n === 0) return array;
        let sum = 0.0;
        for (let i = 0; i < n; i++) sum += array[i];
        const mean = sum / n;
        let sq = 0.0;
        for (let i = 0; i < n; i++) {
            const d = array[i] - mean;
            sq += d * d;
        }
        const std = Math.sqrt(sq / n + 1e-8);
        const out = new Float32Array(n);
        for (let i = 0; i < n; i++) out[i] = (array[i] - mean) / std;
        return out;
    }

    /**
     * Full PPO trainer.
     * policyNet, valueNet are LayerModels.
     * buffer: an array of experiences with fields:
     *    agentState (array numInputs),
     *    action.actionIndex (int),
     *    action.logProb (float),
     *    reward (float),
     *    nextAgentState (array numInputs),
     *    done (bool)
     */
    // ---------- REPLACE trainPPO WITH THIS (manual grads + clipping) ----------
    // --- replacement trainPPO using variableGrads and manual global-norm clipping ---
    async function trainPPO(policyNet, valueNet, buffer) {
        if (!buffer || buffer.length === 0) return;

        // 1) Compute GAE + returns using current value network
        const { advantages: advantagesArr, returns: returnsArr } = await calculateGAE_withValueNet(buffer, gamma, lambda, valueNet);

        // debug: mean/std
        const advStats = meanStd(advantagesArr);
        console.log('advantages mean/std (pre-normalize):', advStats.mean.toFixed(6), advStats.std.toFixed(6));

        // 2) prepare tensors
        const N = buffer.length;
        const statesTensor = tf.tensor2d(buffer.map(e => e.agentState), [N, numInputs]);
        const actionsArr = Int32Array.from(buffer.map(e => e.action.actionIndex));
        const oldLogProbsArr = Float32Array.from(buffer.map(e => e.action.logProb));
        const returnsTensor = tf.tensor1d(returnsArr);

        // normalize advantages (JS array -> tensor later)
        const advantagesNormalized = normalizeFloat32(advantagesArr); // returns Float32Array
        const advantagesTensor = tf.tensor1d(advantagesNormalized);
        const oldLogProbsTensor = tf.tensor1d(oldLogProbsArr);

        // indices for shuffling
        const indices = new Uint32Array(N);
        for (let i = 0; i < N; i++) indices[i] = i;
        function shuffleInPlace(arr) {
            for (let i = arr.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                const tmp = arr[i];
                arr[i] = arr[j];
                arr[j] = tmp;
            }
        }

        const minibatch = Math.min(minibatchSize, N);

        function gatherMB(idxList) {
            const idxTensor = tf.tensor1d(idxList, 'int32');
            const mbStates = tf.gather(statesTensor, idxTensor);
            const mbActions = tf.tensor1d(idxList.map(i => actionsArr[i]), 'int32');
            const mbOldLogProbs = tf.tensor1d(idxList.map(i => oldLogProbsArr[i]));
            const mbReturns = tf.tensor1d(idxList.map(i => returnsArr[i]));
            const mbAdvantages = tf.tensor1d(idxList.map(i => advantagesNormalized[i]));
            idxTensor.dispose();
            return { mbStates, mbActions, mbOldLogProbs, mbReturns, mbAdvantages };
        }

        // training loop (epochs x minibatches)
        for (let epoch = 0; epoch < epochs; epoch++) {
            tf.tidy(() => {
                shuffleInPlace(indices);
                for (let start = 0; start < N; start += minibatch) {
                    const end = Math.min(start + minibatch, N);
                    const mbIdx = [];
                    for (let k = start; k < end; k++) mbIdx.push(indices[k]);

                    const { mbStates, mbActions, mbOldLogProbs, mbReturns, mbAdvantages } = gatherMB(mbIdx);

                    // 1) policy grads
                    const policyVarList = policyNet.trainableWeights.map(w => w.val || w);
                    const policyGradData = tf.variableGrads(() => {
                        const logits = policyNet.predict(mbStates); // [mb,12]
                        const logProbsAll = tf.logSoftmax(logits); // [mb,12]
                        const oneHot = tf.oneHot(mbActions, 12); // [mb,12]
                        const logProbActions = tf.sum(tf.mul(oneHot, logProbsAll), 1); // [mb]

                        const ratio = tf.exp(tf.sub(logProbActions, mbOldLogProbs)); // [mb]
                        const surr1 = tf.mul(ratio, mbAdvantages);
                        const surr2 = tf.mul(tf.clipByValue(ratio, 1 - clipEpsilon, 1 + clipEpsilon), mbAdvantages);
                        const surrogate = tf.mean(tf.minimum(surr1, surr2));
                        const policyLoss = tf.neg(surrogate);

                        const probs = tf.softmax(logits);
                        const entropyPer = tf.sum(tf.mul(probs, tf.neg(tf.logSoftmax(logits))), 1);
                        const entropyMean = tf.mean(entropyPer);

                        const loss = tf.sub(policyLoss, tf.mul(entropyCoef, entropyMean));

                        // dispose intermediates (they are TF tensors)
                        logits.dispose();
                        logProbsAll.dispose();
                        oneHot.dispose();
                        logProbActions.dispose();
                        ratio.dispose();
                        surr1.dispose();
                        surr2.dispose();
                        surrogate.dispose();
                        policyLoss.dispose();
                        probs.dispose();
                        entropyPer.dispose();
                        entropyMean.dispose();

                        return loss;
                    }, policyVarList);

                    // build grads array aligned with var list
                    const policyGradsArr = policyVarList.map(v => policyGradData.grads[v.name] || null);

                    // Clip grads by global norm using helper (works without tf.clipByGlobalNorm)
                    const { clipped: clippedPolicyGrads, globalNorm: policyGradNorm } = clipGradientsByGlobalNorm(policyGradsArr, maxGradNorm);

                    // apply gradients (map varName -> tensor)
                    const policyGradsMap = {};
                    for (let i = 0; i < policyVarList.length; i++) {
                        const varName = policyVarList[i].name;
                        const g = clippedPolicyGrads[i];
                        if (g) policyGradsMap[varName] = g;
                    }
                    policyOptimizer.applyGradients(policyGradsMap);

                    // dispose original grads and clipped grads and policyGradData.value
                    for (const g of policyGradsArr) if (g) g.dispose();
                    for (const g of clippedPolicyGrads) if (g) g.dispose();
                    policyGradData.value.dispose();

                    // 2) value grads
                    const valueVarList = valueNet.trainableWeights.map(w => w.val || w);
                    const valueGradData = tf.variableGrads(() => {
                        const vPred = valueNet.predict(mbStates); // [mb,1]
                        const vPred1d = tf.squeeze(vPred, [1]);
                        const lossUn = tf.square(tf.sub(mbReturns, vPred1d));
                        const vLoss = tf.mul(tf.mean(lossUn), valueCoef);

                        // dispose
                        vPred.dispose();
                        vPred1d.dispose();
                        lossUn.dispose();
                        return vLoss;
                    }, valueVarList);

                    const valueGradsArr = valueVarList.map(v => valueGradData.grads[v.name] || null);
                    const { clipped: clippedValueGrads, globalNorm: valueGradNorm } = clipGradientsByGlobalNorm(valueGradsArr, maxGradNorm);

                    const valueGradsMap = {};
                    for (let i = 0; i < valueVarList.length; i++) {
                        const varName = valueVarList[i].name;
                        const g = clippedValueGrads[i];
                        if (g) valueGradsMap[varName] = g;
                    }
                    valueOptimizer.applyGradients(valueGradsMap);

                    // dispose grads
                    for (const g of valueGradsArr) if (g) g.dispose();
                    for (const g of clippedValueGrads) if (g) g.dispose();
                    valueGradData.value.dispose();

                    // cleanup minibatch tensors
                    mbStates.dispose();
                    mbActions.dispose();
                    mbOldLogProbs.dispose();
                    mbReturns.dispose();
                    mbAdvantages.dispose();
                } // end minibatch loop
            });
        } // end epoch loop

        // cleanup batch-level tensors
        statesTensor.dispose();
        returnsTensor.dispose();
        advantagesTensor.dispose();
        oldLogProbsTensor.dispose();

        console.log(`trainPPO: finished ${N} samples, epochs=${epochs}`);
    }
    // ---------- end trainPPO ----------

    // ----------------- PPO TRAINING INSERT END -----------------


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
// ---------- REPLACE createModel WITH THIS ----------
function createModel(numInputs) {
    function makeTrunk() {
        return [
            tf.layers.dense({ units: 256, activation: 'relu' }),
            tf.layers.dense({ units: 128, activation: 'relu' }),
            tf.layers.dense({ units: 64, activation: 'relu' })
        ];
    }

    function applyTrunkToInput(trunkLayers, input) {
        let x = input;
        for (const layer of trunkLayers) x = layer.apply(x);
        return x;
    }

    // Policy network (fresh layers)
    (function createPolicyNetwork() {
        const input = tf.input({ shape: [numInputs] });
        const trunk = makeTrunk();
        const trunkOut = applyTrunkToInput(trunk, input);
        const policyHead = tf.layers.dense({ units: 12, activation: 'linear', name: 'policy_logits' }).apply(trunkOut);
        return tf.model({ inputs: input, outputs: policyHead });
    });

    // Value network (fresh layers)
    (function createValueNetwork() {
        const input = tf.input({ shape: [numInputs] });
        const trunk = makeTrunk();
        const trunkOut = applyTrunkToInput(trunk, input);
        const valueHead = tf.layers.dense({ units: 1, activation: 'linear', name: 'value' }).apply(trunkOut);
        return tf.model({ inputs: input, outputs: valueHead });
    });

    // instantiate
    const policyNetworkInstance = (function () {
        const input = tf.input({ shape: [numInputs] });
        let x = input;
        for (const layer of makeTrunk()) x = layer.apply(x);
        const policyHead = tf.layers.dense({ units: 12, activation: 'linear', name: 'policy_logits' }).apply(x);
        return tf.model({ inputs: input, outputs: policyHead });
    })();

    const valueNetworkInstance = (function () {
        const input = tf.input({ shape: [numInputs] });
        let x = input;
        for (const layer of makeTrunk()) x = layer.apply(x);
        const valueHead = tf.layers.dense({ units: 1, activation: 'linear', name: 'value' }).apply(x);
        return tf.model({ inputs: input, outputs: valueHead });
    })();

    return {
        policyNetwork: policyNetworkInstance,
        valueNetwork: valueNetworkInstance
    };
}
// ---------- end createModel replacement ----------
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











// ---------- small getAction improvement (include actionProb numeric) ----------
function getAction(policyModel, agentStateTensor) {
    return tf.tidy(() => {
        const logits = policyModel.predict(agentStateTensor); // [1,12]
        const probs = tf.softmax(logits); // [1,12]
        const probsArr = probs.arraySync()[0];
        const actionIndex = sampleFromCategorical(probsArr);
        const actionProb = probsArr[actionIndex];
        // compute logprob as scalar
        const logProbTensor = tf.sum(tf.mul(tf.oneHot(actionIndex, probs.shape[1]), tf.logSoftmax(logits)), -1); // shape [1]
        const logProb = logProbTensor.arraySync()[0];
        const [steering, throttle, brake] = decodeAction(actionIndex);

        // cleanup handled by tidy; return plain JS numbers and arrays
        return { steering, throttle, brake, actionIndex, actionProb, logProb };
    });
}
// ---------- end getAction ----------

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
