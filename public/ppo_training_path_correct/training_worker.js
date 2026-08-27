const workerTimeOrigin = performance.timeOrigin;
importScripts('/lib/tfjs.js');

let numInputs = 0; // will be updated at model_init
const numStack = 1;


let experienceBufferPerCar = {};
const verbose = false;
const info = false;

// will be updated by model_init
let timeOffset = 0;
const getTime = () => performance.now() + timeOffset; // function to get time of main thread

let policyNetwork, valueNetwork;
self.onmessage = async (e) => {
    if (e.data instanceof ArrayBuffer) { // Not that redundant, as this check is often true since 'predict' is called lots of times
        // This means we must be in 'predict'
        const batchBuffer = new Float32Array(e.data);
        predictBatch(batchBuffer);

        /*const startsAtIndex = flatBuffer[0];
        const startTime     = flatBuffer[1];
        const carID         = flatBuffer[2];
        const reward        = flatBuffer[3];
        const finishFrames  = flatBuffer[4];

        // Zero-copy slice pointing straight to your agent state floats
        const agentStateView = flatBuffer.subarray(startsAtIndex); // sliced from start index, headers and extra non-state floats are removed

        predict(agentStateView, startTime, carID, reward, finishFrames);*/
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

    numInputs = data.numInputs;

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
        //const agentStateTensor = tf.tensor(agentState).reshape([1, numInputs]);
        // Create the tensor directly out of the raw Float32Array view
        const agentStateTensor = tf.tensor1d(agentState).reshape([1, numInputs]);
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

    self.postMessage({
        type: "outputs",
        data: {
            carID: carID,
            outputs: action,
            lastFrame: currentFrame // var name is confusing but it means the frame of the last state we're at
        }
    });
}
async function predictBatch(batchBuffer) {
    const batchSize = batchBuffer[0]; // car count
    const headerSize = batchBuffer[1];
    const floatsPerCar = batchBuffer[2];
    const observationOffset = batchBuffer[3];
    const batchStartTime = batchBuffer[4];

    if (info) console.log((getTime() - batchStartTime).toFixed(5));

    const observations = [];
    const carsData = [];
    for (let i = 0; i < batchSize; i++) {
        const carDataOffset = headerSize + i * floatsPerCar;

        const carID = batchBuffer[carDataOffset + 0];
        carsData.push({
            carID: carID,
            reward: batchBuffer[carDataOffset + 1],
            doneType: batchBuffer[carDataOffset + 2],
            currentFrame: batchBuffer[carDataOffset + 3]
        });

        // COPY INSTEAD OF SUBARRAY VIEW, otherwise detached memory reads which silently return NaN. THIS TOOK ME A MONTH!!!!!
        const obsSlice = batchBuffer.slice( // USE SLICE INSTEAD OF SUBARRAY, slice auto makes a copy
            carDataOffset + observationOffset,
            carDataOffset + floatsPerCar
        );
        for (let k = 0; k < obsSlice.length; k++) {
            if (!Number.isFinite(obsSlice[k])) {
                console.error(`Infinity/NaN detected in raw obsSlice! Car ${carID}, index ${k}:`, obsSlice[k]);
                debugger;
            } else if (Math.abs(obsSlice[k]) > 10000) {
                // Physics engine explosion (e.g. 1e35). Clamp it so it doesn't cause Infinity gradients.
                console.warn(`Extreme physics value in obsSlice! Car ${carID}, index ${k}:`, obsSlice[k]);
                debugger;
            }
        }
        observations.push(obsSlice);
    }

    let actions;
    let valueEstimates;
    tf.tidy(() => {
        //const statesTensor = tf.tensor2d(observations); // [batchSize x numInputs]
        // Map each Float32Array to 2D tensor [1, N] and concat on batch axis
        const statesTensor = tf.concat(observations.map(obs => tf.tensor2d(obs, [1, obs.length])));

        actions = getActions(policyNetwork, statesTensor);
        valueEstimates = valueNetwork.predict(statesTensor).arraySync(); // size x [1]
    });

    let actionsPerCar = {};
    let framesPerCar = {}; // currentFrame
    for (let i = 0; i < batchSize; i++) {
        const { carID, reward, currentFrame, doneType } = carsData[i];
        
        const agentState = observations[i];
        const action = actions[i];
        const valueEstimate = valueEstimates[i][0];

        actionsPerCar[carID] = action;
        framesPerCar[carID] = currentFrame;

        if (!experienceBufferPerCar[carID]) experienceBufferPerCar[carID] = [];
        // First calculate the reward and set nextAgentState of our last experience state
        const xpLength = experienceBufferPerCar[carID].length;
        if (xpLength > 0) { // are we on our second state
            const exp = experienceBufferPerCar[carID][xpLength - 1];

            exp.reward = reward;
            exp.nextAgentState = agentState; // store our current observed 'result' input agentState into the last nextAgentState
            if (doneType !== 0) { // car has finished or expired
                delete actionsPerCar[carID];
                delete framesPerCar[carID];
                
                exp.done = true;
                if (doneType == 1) exp.timeout = false; // finished
                else if (doneType == 2) { // expired, truncated
                    exp.timeout = true;
                    exp.nextValueEstimate = tf.tidy(() => {
                        const nextTensor = tf.tensor2d(exp.nextAgentState, [1, exp.nextAgentState.length]); // [1 x numInputs]
                        return valueNetwork.predict(nextTensor).dataSync()[0]; // [1], select first number
                    });
                }
                else throw new Error("invalid doneType:" + doneType);

                continue; // no need to add our useless action if we're already done
            }
            if (info) console.log("Real reward:", reward, "at frame " + experienceBufferPerCar[carID][xpLength - 1].frame);
        }
        
        // NEXTAGENTSTATE is completely useless!! I only use it for potential debugging, but it isn't used in any other code

        // Let's push the agentState and action of the current frame now
        experienceBufferPerCar[carID].push({
            frame: currentFrame, //lastSimState.frames,
            agentState: agentState,
            action: action,
            valueEstimate: valueEstimate,
            reward: null, // currentFrame >= 400 ? 0 : null
            nextAgentState: null,
            done: false, // will be marked in next state
            timeout: false // marked in next state
        });
    }

    // actionsPerCar only has non-finished cars now, sim only sees carIDs that aren't finished yet
    self.postMessage({
        type: "outputs",
        data: {
            carIDs: Object.keys(actionsPerCar).map(str => Number(str)),
            outputsPerCar: actionsPerCar,
            lastFramesPerCar: framesPerCar // frame number of last state we're at
        }
    });
}



setInterval(() => {
    const memoryInfo = tf.memory();
    console.log(`GPU Memory: ${memoryInfo.numBytesInGPU} bytes, Tensors: ${memoryInfo.numTensors}`);

    if (policyOpt) {
        console.log("Iterations: " + policyOpt.iterations);
    }
}, 10000);
function average(arr) {
    return arr.reduce((a, b) => a + b, 0) / arr.length;
}
function getVariance(arr) { // explained variance
    const mean = average(arr);
    return arr.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / arr.length; // R2
}



const lastLearningRates = {
    policy: 0,
    value: 0 // ensure both LR's auto rebuild both optimizers on startup
};
let policyOpt, valueOpt;

async function train(data) {
    //const { carId, carRequestId, progressIndex, epochs = 1, batchSize = 32, gamma = 0.99, lambda = 0.95, clipEpsilon = 0.2, learningRate = 0.0003 } = data; // 0.0003
    const { carIDs, requestIDs, progressPercentages, PPO_CONFIG } = data;
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
    console.log(entropyCoef);

    // update optimizers if any learning rate configs are different
    if (policyLearningRate !== lastLearningRates.policy) {
        if (policyOpt) policyOpt.dispose(); // fix mem leak
        lastLearningRates.policy = policyLearningRate;
        policyOpt = tf.train.adam(policyLearningRate); // update optimizer if changes
    }
    if (valueLearningRate !== lastLearningRates.value) {
        if (valueOpt) valueOpt.dispose(); // fix mem leak
        lastLearningRates.value = valueLearningRate; // update last LR
        valueOpt = tf.train.adam(valueLearningRate);
    }

    // Why c1 (valueCoef) isn't used: Loss total = Loss_policy + (c1 * Loss_value) - (c2 * Entropy)
    // We don't use total loss, as trunk (inputs+hidden) of models (policy and value) aren't shared


    function trainPPO(policyNet, valueNet, carBuffers, carIDs) { // doesn't need to be async
        const flatBuffer = carIDs.flatMap(carId => carBuffers[carId]);

        for (let idx = 0; idx < flatBuffer.length; idx++) {
            const exp = flatBuffer[idx];
            for (let k = 0; k < exp.agentState.length; k++) {
                if (!Number.isFinite(exp.agentState[k])) { // also catches NaN
                    console.error(`Corrupted exp buffer found at index ${idx}! Float ${k} is ${exp.agentState[k]}.`, exp);
                    debugger;
                }
            }
        }

        // Calculate Advantages and Returns first
        let explainedVariance = 0;
        const avgReturnPerCar = {};

        const data = tf.tidy(() => {
            const states = tf.concat(flatBuffer.map(e => tf.tensor2d(e.agentState, [1, e.agentState.length])));
            const actions = tf.tensor1d(flatBuffer.map(e => e.action.actionIndex), 'int32');
            const logProbs = tf.tensor1d(flatBuffer.map(e => e.action.logProb));

            // Reuse old value estimates
            const values = flatBuffer.map(e => e.valueEstimate);
            for (const value of values) if (!Number.isFinite(value)) throw new Error(`Invalid valueEstimate: ${value}`);

            const advs = new Array(flatBuffer.length); // advantages
            const rets = new Array(flatBuffer.length); // returns

            // Calculate GAE per car trajectory to prevent boundary leakage across cars
            let valueOffset = 0;
            for (const carId of carIDs) {
                const buffer = carBuffers[carId];
                
                validateCarBuffer(buffer, carId);

                let gae = 0;
                let sumCarReturn = 0;
                for (let t = buffer.length - 1; t >= 0; t--) {
                    const exp = buffer[t];
                    const valueIndex = valueOffset + t;
                    const value = values[valueIndex];

                    // 0&2: Normal transition (middle), or truncated (timeout): δ_t = r_t + γV(s_{t+1}) - V(s_t)
                    // 1: Finish (no next states):                              δ_t = r_t               - V(s_t)
                    // 2, reason of yes nextValueEstimate: episode horizon reached, but environment/car could continue driving. Timelimit can be increased, world didn't fully end
                    
                    let nextValue;
                    let nextNonTerminal; // 1 = there exist more states after this, including if timed out (truncated). If clean finish, = 0
                    if (!exp.done) { // Normal transition
                        nextValue = values[valueIndex + 1]; // not terminal/done, select next rollout value
                        nextNonTerminal = 1;
                    } else if (exp.timeout) { // Time-limit, truncated: environment could theoretically continue, so use next final exp
                        nextValue = exp.nextValueEstimate; // V(nextAgentState) of expired car
                        nextNonTerminal = 1;
                    } else { // Terminal, finished
                        nextValue = 0; // 0, doesn't bootstrap on done (non-truncated)
                        nextNonTerminal = 0;
                    }

                    const delta = exp.reward + (gamma * nextValue * nextNonTerminal) - value; // if finished (done but not timeout), multiplied by 0
                    gae = delta + (gamma * lambda * gae * nextNonTerminal);

                    const returnValue = gae + value;
                    advs[valueIndex] = gae;
                    rets[valueIndex] = returnValue;

                    sumCarReturn += returnValue;
                }
                avgReturnPerCar[carId] = sumCarReturn / buffer.length;

                valueOffset += buffer.length;
            }

            const residuals = rets.map((ret, index) => ret - values[index]); // how much better/worse was the return than the value estimate
            const varReturns = getVariance(rets);
            const varResiduals = getVariance(residuals);
            explainedVariance = varReturns > 1e-8 ? 1 - (varResiduals / varReturns) : 0;

            const advantagesTensor = tf.tensor1d(advs);
            const returnsTensor = tf.tensor1d(rets);

            return { // any tensors returned, auto survive tf.tidy
                statesTensor: states,
                actionsTensor: actions,
                oldLogProbs: logProbs,
                advantages: advantagesTensor,
                returns: returnsTensor
            };
        });
        let tensorsToDispose = [data.statesTensor, data.actionsTensor, data.oldLogProbs, data.advantages, data.returns];

        // Optimization Epochs
        let pLosses = [];
        let vLosses = [];
        let approxKLs = [];
        let newLogProbs = [];
        let entropies = [];
        for (let i = 0; i < epochs; i++) {
            const indices = tf.util.createShuffledIndices(flatBuffer.length); // random data order each epoch to get different minibatches

            for (let j = 0; j < indices.length; j += minibatchSize) {
                const batchIndicesArray = Array.from(indices.slice(j, j + minibatchSize)); // uint8array -> array
                const actualSize = batchIndicesArray.length; // Size of the remainder, or of full minibatchsize

                tf.tidy(() => {
                    // The padded copies will be thrown out via tf.slice right after predict
                    const paddedIndices = [...batchIndicesArray];
                    while (paddedIndices.length < minibatchSize) {
                        paddedIndices.push(batchIndicesArray[0]); // copies first index (shuffled), so bStatesPadded turns into copies of the first observation. all other data isn't padded
                    }

                    const paddedBatchIdxTensor = tf.tensor1d(paddedIndices, 'int32');
                    const trueBatchIdxTensor = tf.tensor1d(batchIndicesArray, 'int32'); // true batch data

                    const bStatesPadded = data.statesTensor.gather(paddedBatchIdxTensor); // padded data, fed straight into policynet/valuenet

                    // Gather only data from true batch, the padded indices don't have any data
                    const bActions  = data.actionsTensor.gather(trueBatchIdxTensor);
                    const bOldLPs   = data.oldLogProbs.gather(trueBatchIdxTensor);
                    const bAdvs     = data.advantages.gather(trueBatchIdxTensor); // not normalized yet. SB3 normalizes per minibatch instead of global
                    const bReturns  = data.returns.gather(trueBatchIdxTensor);
                    
                    // Normalize advantages
                    let normalizedBAdvs = bAdvs;
                    if (actualSize > 1) {
                        const mean = bAdvs.mean();
                        // Don't use commented out code, at 32 minibatch it is 1.6% too low because it uses N instead of N-1. This was population std instead of sample std
                        //const std = tf.sqrt(tf.mean(tf.square(tf.sub(bAdvs, mean))).add(1e-8));
                        const std = tf.sqrt( // sample standard deviation, uses N - 1, then gets average (sum and div). sqrt( Σ(x - mean)² / (N - 1) )
                            tf.div(tf.sum(tf.square(tf.sub(bAdvs, mean))), actualSize - 1).add(1e-8) // prevent std=0, which would div by 0 in normalizedBAdvs
                        );
                        normalizedBAdvs = tf.div(tf.sub(bAdvs, mean), std);
                    }

                    // Using variableGrads for separate policy and value losses, and separate clipping
                    let approxKL, avgNewLogProb, avgEntropy;
                    const { value: pLoss, grads: policyGrads } = tf.variableGrads(() => { // just gather variablegrads for policy loss, so we can clip them without affecting value loss
                        // Forward pass of shape [miniBatchSize, inputSize], always same size, no webgl shader cache bugs at all
                        let logits = policyNet.apply(bStatesPadded); // get gradients for policy params. This is what policyGrads will optimize!
                        
                        // Slice to remove padding and only get real size. Gradients flowing backwards through slice are natively 0-padded
                        logits = tf.slice(logits, [0, 0], [actualSize, logits.shape[1]]);

                        const logProbsAll = tf.logSoftmax(logits);

                        // Retrieve log-probs of taken actions
                        const bNewLPs = tf.sum(tf.mul(tf.oneHot(bActions, 12), logProbsAll), 1); // for each action taken, get log-prob of that action from the output logits of new policy. "log πθ(a|s)""

                        const logDiff = tf.sub(bNewLPs, bOldLPs); // PPO ratio = new - old.
                        const ratio = tf.exp(logDiff); // Exp of log gives us actual probabilities

                        // Clipped Objective
                        const surr1 = tf.mul(ratio, normalizedBAdvs);
                        const surr2 = tf.mul(tf.clipByValue(ratio, 1 - clipEpsilon, 1 + clipEpsilon), normalizedBAdvs);
                        const policyLoss = tf.neg(tf.mean(tf.minimum(surr1, surr2)));

                        // Entropy Bonus (encourages exploration)
                        const probs = tf.softmax(logits);
                        // RETURN 1e8 LOGIC?
                        const entropy = tf.neg(tf.mean(tf.sum(tf.mul(probs, logProbsAll), 1))); // log-sum-exp prevents division by 0 already

                        avgNewLogProb = bNewLPs.mean().arraySync();
                        approxKL = tf.mean(tf.sub( // mean((exp(logRatio) - 1) - logRatio)
                            ratio, // exp, actual probabilities
                            tf.add(logDiff, 1)
                        )).arraySync(); // mean(oldLogProbs - newLogProbs) KL divergence, too large = it's destroying itself
                        avgEntropy = entropy.arraySync();
                        return tf.add(policyLoss, tf.mul(tf.neg(entropyCoef), entropy)); // pLoss - c2*entropy, we negate entropy because we want to maximize it (more exploration), but optimizers minimize loss)
                    });
                    pLosses.push(pLoss.arraySync());
                    approxKLs.push(approxKL);
                    newLogProbs.push(avgNewLogProb);
                    entropies.push(avgEntropy);

                    const { value: vLoss, grads: valueGrads } = tf.variableGrads(() => { // gather variablegrads for only valueloss
                        let vPreds = valueNet.apply(bStatesPadded);

                        // Slice to remove padding. Same logic as policy predict
                        vPreds = tf.slice(vPreds, [0, 0], [actualSize, vPreds.shape[1]]);

                        // [actualSize], matching bReturns shape
                        const flattenedPreds = tf.reshape(vPreds, [-1]); // squeeze, but no collapse to 0-dimensions

                        // Currently no vLoss clipping, SB3 default is 'clip_range_vf = None', so it currently works
                        return tf.losses.meanSquaredError(bReturns, flattenedPreds);
                    });
                    vLosses.push(vLoss.arraySync());

                    // Apply clipped gradients and dispose them
                    const applyClipped = (gradsObj, opt, debugName) => {
                        const gradKeys = Object.keys(gradsObj.grads);
                        const grads = Object.values(gradsObj.grads);

                        const squaredNorms = grads.map(g => tf.sum(tf.square(g)));
                        const totalNorm = tf.sqrt(tf.addN(squaredNorms));
                                                
                        // min(1, maxGradNorm/totalNorm), prevent division by 0
                        const scaleFactor = tf.minimum(tf.scalar(1), tf.div(tf.scalar(maxGradNorm), totalNorm.add(1e-8)));

                        const scaledGradsObj = {};
                        gradKeys.forEach((key, index) => {
                            scaledGradsObj[key] = tf.mul(grads[index], scaleFactor);
                        });
                        opt.applyGradients(scaledGradsObj);
                    };
                    applyClipped({ grads: policyGrads }, policyOpt, "policy");
                    applyClipped({ grads: valueGrads }, valueOpt, "value");
                });
            }
        }
        // Dispose data.returns.mean() too
        const averageStateReturn = tf.tidy(() => data.returns.mean().arraySync()); // average GAE discounted reward of every action, return for one action, not return of whole episode

        tf.dispose(tensorsToDispose);

        return {
            // performance criteria
            averageStateReturn: averageStateReturn, // discounted reward. More reward = better
            avgReturnPerCar: avgReturnPerCar,
            // critic criteria
            averageValueLoss: average(vLosses), // downward curve = valueNet (critic) understands the world better
            explainedVariance: explainedVariance, // valueNet: 1=perfect, 0=no better than average baseline, <0 worse than baseline = harmful estimates
            // stability criteria
            averagePolicyLoss: average(pLosses), // policy optimizing, can be noisy but should go down
            approxKLDivergence: average(approxKLs), // mean(oldLogProbs - newLogProbs). Safe updates = lower than 0.02 otherwise self-destruction
            // exploration criteria
            averageEntropy: average(entropies), // exploration. Downward curve = mastering instead of guessing. Shouldn't be too low (otherwise it repeats bad actions)
            averageNewLogProbs: average(newLogProbs) // Higher = more confidence. Not too high, else it's (somehow) overfitting
        };
    }

    let highestReward = [ -1e6, -1 ]; // [0] is the reward, [1] is the carId that got it
    let totalRewardPerCar = {};
    for (const carId of carIDs) {
        let totalReward = 0;
        experienceBufferPerCar[carId].forEach((exp, index) => { // Count up all rewards (not needed for training) but also fix the 'null' rewards to 0
            if (exp.reward == null || exp.nextAgentState == null) throw new Error("Incomplete experience state at index " + index + ": ", exp, experienceBufferPerCar[carId]);
            totalReward += exp.reward;
        });
        totalRewardPerCar[carId] = totalReward;
        if (totalReward > highestReward[0]) highestReward = [ totalReward, carId ]; // first index is the reward, second is cardId
    }

    const carBuffers = {}; // obj
    for (const carId of carIDs) {
        const buffer = experienceBufferPerCar[carId];
        carBuffers[carId] = buffer;

        for (const exp of buffer) {
            if (!exp.action || !Number.isFinite(exp.action.logProb)) throw new Error("No action logProb on exp");
        }
        if (!(buffer && buffer.length > 0)) throw new Error("exp buffer doesn't exist");
    }

    const { averageStateReturn, avgReturnPerCar, averageValueLoss, explainedVariance, averagePolicyLoss, approxKLDivergence, averageEntropy, averageNewLogProbs }
        = trainPPO(policyNetwork, valueNetwork, carBuffers, carIDs);
    //console.log("Average policy loss:", averagePolicyLoss.toFixed(4), "and average value loss:", averageValueLoss.toFixed(4));


    if (highestReward[0] > bestAttempt.totalReward) {
        const [ totalReward, carId ] = highestReward;
        const progressPercentage = progressPercentages[carId];
        const requestId = requestIDs[carId];
        bestAttempt = { totalReward: totalReward, data: [ ...experienceBufferPerCar[carId] ], carRecording: "" }; // copy spread into array
        console.log("NEW BEST ATTEMPT:", totalReward, "with data:", [bestAttempt.data], "(carId=" + carId + "). The progress percentage is " + progressPercentage);

        postMessage({
            type: "bestAttempt_createRecordingString", // Takes about 3ms for response of 20s or 200 inputs, (and 8s when 420 inputs because of randomization) 
            data: {
                carRequestId: requestId, // this will make simulation_communicator.js pull from the inputs list of that original specific DeleteCar request
                startTime: performance.now(),
                totalReward: totalReward, // main can show simple stats
                progressPercentage: progressPercentage
            }
        });
    }
    
    const oldLength = bestProgresses.length;
    for (const carId of carIDs) {
        const progressPercentage = progressPercentages[carId];
        const totalReward = totalRewardPerCar[carId];
        const requestId = requestIDs[carId];

        if (progressPercentage > 50) { // 50% or more
            bestProgresses.push({
                requestId: requestId,
                progressPercentage: progressPercentage,
                totalReward: totalReward
            });
        }
        console.log("Car " + carId + " got " + totalReward + " total reward");
        delete experienceBufferPerCar[carId]; // remove our experience
    }
    if (bestProgresses.length !== oldLength) console.log("best progresses:", bestProgresses); // only log if there are new bests
    if (Object.keys(experienceBufferPerCar).length !== 0) throw new Error("A car still has experience, did it not get added to carIDs in train()?");

    self.postMessage({
        type: 'train_done',
        data: {
            carIDs: carIDs,
            requestIDs: requestIDs,
            stats: { // main shows complex graph stats
                totalRewardPerCar,
                progressPercentages,
                avgReturnPerCar,

                averageStateReturn, // overall average
                averageValueLoss,
                explainedVariance,
                averagePolicyLoss,
                approxKLDivergence,
                averageEntropy,
                averageNewLogProbs
            }
        }
    });
}
let bestAttempt = { totalReward: -1e6, data: [] }; // reset fallback
let bestProgresses = [];



function recordingStringDone(data) {
    const { carRecording, totalReward, progressPercentage, startTime, requestId } = data;
    if (bestAttempt.totalReward == totalReward) {
        bestAttempt.carRecording = carRecording;
        console.log(bestAttempt);
        console.log("RequestID " + requestId + " got bestattempt replay string: " + carRecording);
        console.log("Getting recording took " + (performance.now() - startTime).toFixed(2) + "ms");
    } else { // Normally this always arrives in sync, but just in case. Nvm it can sometimes happen
        console.warn("Our bestAttempt has been updated while we were requesting carRecording string");
    }
}



async function saveModel(model, name) {
    await model.save(`indexeddb://${name}`);
    //console.log(`Model saved as ${name}`);
}
function createModel(numInputs) {
    const totalInputs = numInputs * numStack;
    
    function buildNetwork(outputUnits, namePrefix) {
        const model = tf.sequential();

        // Layer 1
        model.add(tf.layers.dense({
            units: 256,
            activation: 'relu',
            inputShape: [totalInputs], // x4
            kernelInitializer: 'glorotNormal',
            name: `${namePrefix}_dense1`
        }));

        // Layer 2
        model.add(tf.layers.dense({
            units: 128,
            activation: 'relu',
            kernelInitializer: 'glorotNormal',
            name: `${namePrefix}_dense2`
        }));

        // Layer 3
        model.add(tf.layers.dense({
            units: 64,
            activation: 'relu',
            kernelInitializer: 'glorotNormal',
            name: `${namePrefix}_dense3`
        }));

        // Output Layer
        model.add(tf.layers.dense({
            units: outputUnits,
            activation: 'linear', // Use linear for logits and value
            name: `${namePrefix}_output`
        }));

        return model;
    }

    return {
        policyNetwork: buildNetwork(12, 'policy'), // 12 logits for all 12 valid actions
        valueNetwork: buildNetwork(1, 'value') // Value head: Single scalar output (state value)
    };
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
function getActions(policyModel, statesTensor) {
    return tf.tidy(() => {
        const logits = policyModel.predict(statesTensor); // [batchSize, 12]

        const arr = logits.arraySync();
        if (Number.isNaN(arr[0][0])) {
            console.log("BAD");
        }

        const actionProbs = tf.softmax(logits).arraySync();
        const logProbsAll = tf.logSoftmax(logits).arraySync();

        const actions = [];
        for (let i = 0; i < actionProbs.length; i++) {
            const actionIndex = sampleFromCategorical(actionProbs[i]);

            const [steering, throttle, brake] = decodeAction(actionIndex);

            if (Number.isNaN(logProbsAll[i][actionIndex])) {
                const lobProb = logProbsAll[i][actionIndex];
                console.log("also BAD");
            }

            actions.push({
                steering,
                throttle,
                brake,
                actionIndex,
                logProb: logProbsAll[i][actionIndex]
            });
        }
        return actions;
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
    const r = Math.random();
    let sum = 0;
    for (let i = 0; i < probs.length - 1; i++) {
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


function validateCarBuffer(buffer, carId) {
    if (!buffer.length) throw new Error(`Empty experience buffer for car ${carId}`);

    const last = buffer[buffer.length - 1];
    if (!last.done) throw new Error(`Last experience for car ${carId} is not done`);
    if (last.reward == null) throw new Error(`Last experience for car ${carId} has no reward`);
    if (!last.nextAgentState) throw new Error(`Last experience for car ${carId} has no nextAgentState`);
    if (last.timeout && !Number.isFinite(last.nextValueEstimate)) throw new Error(`Last experience for car ${carId} is truncated but has no nextValueEstimate`);

    for (let t = 0; t < buffer.length - 1; t++) {
        if (buffer[t].done) throw new Error(`Experience ${t} for car ${carId} is done before the final experience`);
        if (buffer[t].timeout) throw new Error(`Experience ${t} for car ${carId} is timeout before the final experience`);
    }
}




/*
I am implementing PPO completely from scratch in TensorFlow.js for a deterministic racing simulator extracted from PolyTrack.

The simulator is non-realtime: it advances deterministic physics (1 ms physics steps), pauses every control interval (currently 100 ms), requests an action from the policy network, applies the action, then repeats. The long-term goal is to increase the control frequency and synchronize roughly 100 environments so they all pause, infer, and resume together, allowing PPO to train from one large shared rollout rather than sequential episodes.

The action space is intentionally discrete. There are exactly 12 actions representing every combination of:

* steering ∈ {-1, 0, 1}
* throttle ∈ {0, 1}
* brake ∈ {0, 1}

I do not want to switch to continuous actions.

The PPO implementation is entirely my own.

Current implementation:

* Separate policy and value networks (256 → 128 → 64 MLPs)
* Policy outputs logits over 12 actions
* Value network outputs a scalar V(s)
* GAE (gamma/lambda)
* Advantage normalization
* PPO clipped objective
* Entropy bonus
* Separate Adam optimizers for actor and critic
* Global gradient norm clipping
* Multiple epochs with shuffled minibatches

Current focus is correctness. I am trying to get a PPO implementation that behaves like canonical PPO implementations (Stable Baselines3 / CleanRL / Spinning Up), not merely something that "sort of learns."

Important observations so far:

* Recomputing values during training (instead of using rollout-time value estimates) is intentional and matches common PPO implementations.
* Global gradient norm clipping originally produced NaNs because of numerical issues. Using addN() to compute the norm and adding epsilon before division fixed this.
* The PPO ratio sanity check passed:

  * Before the first optimizer update, ratio ≈ 1.0 exactly.
  * Later minibatches drift gradually (roughly 0.85–1.28), which appears reasonable.
* Explained variance is consistently around 0.95, suggesting the critic is fitting returns well.
* Current clip fraction is often around 0.35–0.60 (computed per minibatch of 32), which seems somewhat higher than expected and is worth discussing.
* Training currently happens after each individual episode. I plan to replace this with PPO's more standard workflow of collecting one rollout from many synchronized environments before performing updates.

When reviewing code, assume subtle implementation bugs are still possible.

Please be extremely critical of:

* PPO math
* GAE implementation
* log-probability calculations
* value targets
* optimizer usage
* batching/minibatching
* rollout collection
* any subtle differences from canonical PPO implementations

Do not recommend rewriting everything in Python or using an existing PPO library. Instead, compare my implementation against canonical PPO implementations and identify concrete implementation differences or potential mistakes.

If you suspect something is incorrect, explain precisely why and reference the standard PPO algorithm rather than giving generic RL advice.

When reviewing code, be extremely critical. Assume subtle PPO implementation mistakes are possible. Compare against canonical PPO implementations (Stable Baselines3, CleanRL, OpenAI Spinning Up) where appropriate, but keep solutions compatible with TensorFlow.js and my architecture rather than suggesting a complete rewrite.
*/