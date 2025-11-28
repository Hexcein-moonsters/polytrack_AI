const workerTimeOrigin = performance.timeOrigin;

importScripts('/lib/tfjs.js'); // if I change this to '/lib/tfjs.js' then physicsParts somehow breaks. I assume it's cus of load time
// Edit: I fixed the load order and event/waiting, a quick local tfjs load will work. (The old url was: https://cdn.jsdelivr.net/npm/@tensorflow/tfjs)
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

const numInputs = 93;   // your input features (100)
//const numOutputs = 1;    // AI outputs (5)



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
    //console.log(mainTimeOrigin, performance.timeOrigin);
    //timeOffset = mainTimeOrigin - workerTimeOrigin;
    timeOffset = workerTimeOrigin - mainTimeOrigin;
    //console.log(mainTime, workerTime);
    //console.log("Offset:", timeOffset);
    //console.log(workerTime + timeOffset);
    //console.log("Worker time before calibration: " + performance.now());
    //console.log("Worker time After calibration: " + getTime());

    //console.log("Main thread sent msg at: " + data.timeVerify + " which was " + (getTime() - data.timeVerify) + "ms ago");

    if (false) { // kinda useless as env sends reward as float, we don't need to calculate it
        const funcStr = data.calculateReward;
        const functionBody = funcStr.substring(funcStr.indexOf("{") + 1, funcStr.lastIndexOf("}"));
        calculateReward = new Function("states", functionBody); // add states param
    }

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
    /*self.postMessage({
        type: "outputs",
        data: {
            carID: carID,
            outputs: { steering: 0, throttle: 0, brake: 0 },
            lastFrame: 0
        }
    });*/
    //console.log(data.states);
    //const lastSimState = data.states[data.states.length - 1];
    //const agentState = getAgentState(data.states);
    if (verbose) console.log(agentState);
    // Direction / steering angle,  Maybe normalized position on track,  Tire slip, if you model that

    let action;
    tf.tidy(() => { // Do not use promises in .tidy!
        const { steering, throttle, brake, actionProb, actionIndex } = getAction(policyNetwork, agentState);

        //console.log('Steering:', steering);
        //console.log('Throttle:', throttle);
        //console.log('Brake:', brake);
        if (verbose) console.log('Action Probability:', actionProb);
        //console.log('Action Index:', actionIndex);

        action = { steering, throttle, brake, actionProb, actionIndex };


        if (info) {
            const stateTensor = tf.tensor(agentState).reshape([1, numInputs]);
            const vs = valueNetwork.predict(stateTensor);
            console.log("Value network estimation:", vs.arraySync()[0][0]); // we only have 1 output

            stateTensor.dispose();
            vs.dispose();
        }
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
    const { carID, carRequestId, progressIndex, epochs = 1, batchSize = 32, gamma = 0.99, learningRate = 0.0003 } = data; // 0.0003
    // epochs are overwriten by ai_environment.js!

    /*await tf.tidy(async () => {
        const xs = tf.tensor2d(inputs, [inputs.length, inputs[0].length]);
        const ys = tf.tensor2d(targets, [targets.length, targets[0].length]);

        await model.fit(xs, ys, {
            epochs,
            batchSize,
            verbose: 0
        });
    });*/




    /*function computeReturns(episodeData, gamma, lambda) {
        const returns = [];
        let R = 0;
        for (let t = episodeData.length - 1; t >= 0; t--) {
            const { reward, done } = episodeData[t];
            R = reward + (done ? 0 : gamma * R);
            returns.unshift(R);
        }
        return returns;
    }

    function computeAdvantages(episodeData, returns, gamma, lambda) {
        const advantages = [];
        let advantage = 0;
        for (let t = episodeData.length - 1; t >= 0; t--) {
            const { reward, done } = episodeData[t];
            const nextAdvantage = t === episodeData.length - 1 || done ? 0 : advantages[t + 1];
            advantage = reward + gamma * nextAdvantage - returns[t];
            advantages.unshift(advantage);
        }
        return advantages;
    }


    async function trainPPO(experienceBuffer, policyModel, valueNetwork, gamma, epsilon, numEpochs, batchSize) {
        const policyOptimizer = tf.train.adam(0.001);
        const valueOptimizer = tf.train.adam(0.001);

        for (let epoch = 0; epoch < numEpochs; epoch++) {
            for (let i = 0; i < experienceBuffer.length; i += batchSize) {
                const batch = experienceBuffer.slice(i, i + batchSize);

                // Extract states, actions, rewards, next states, and dones
                const states = batch.map(entry => entry.state);
                const actions = batch.map(entry => entry.action);
                const rewards = batch.map(entry => entry.reward);
                const nextStates = batch.map(entry => entry.nextState);
                const dones = batch.map(entry => entry.done);

                // Convert to tensors
                const stateTensor = tf.tensor2d(states);
                const actionTensor = tf.tensor2d(actions.map(a => [a.steering, a.throttle, a.brake]));
                const rewardTensor = tf.tensor1d(rewards);
                const nextStateTensor = tf.tensor2d(nextStates);
                const doneTensor = tf.tensor1d(dones);

                // Compute returns and advantages
                const returns = computeReturns(batch, gamma, 0.95);
                const advantages = computeAdvantages(batch, returns, gamma, 0.95);
                const advantageTensor = tf.tensor1d(advantages);

                // Predict mean and log variance from policy network
                const [mean, logVar] = policyModel.predict(stateTensor);

                // Compute probabilities using Gaussian distribution
                const std = tf.exp(logVar);
                const actionDist = tf.distributions.Normal(mean, std);
                const actionProb = actionDist.prob(actionTensor);

                // Compute value estimates
                const valueEstimates = valueNetwork.predict(stateTensor);
                const nextValueEstimates = valueNetwork.predict(nextStateTensor);

                // Compute target values for value network
                const targetValues = tf.add(
                    rewardTensor,
                    tf.mul(tf.sub(tf.tensor1d([1.0]), doneTensor), tf.mul(gamma, nextValueEstimates))
                );

                // Compute value loss
                const valueLoss = tf.mean(tf.square(tf.sub(valueEstimates, targetValues)));

                // Compute policy loss
                const ratio = tf.div(actionProb, oldActionProb); // oldActionProb from previous step
                const clippedRatio = tf.clipByValue(ratio, 1 - epsilon, 1 + epsilon);
                const policyLoss = tf.minimum(
                    tf.mul(ratio, advantageTensor),
                    tf.mul(clippedRatio, advantageTensor)
                );
                policyLoss = tf.neg(tf.mean(policyLoss));

                // Optimize
                await policyOptimizer.minimize(policyLoss);
                await valueOptimizer.minimize(valueLoss);

                // Dispose tensors
                stateTensor.dispose();
                actionTensor.dispose();
                rewardTensor.dispose();
                nextStateTensor.dispose();
                doneTensor.dispose();
                advantageTensor.dispose();
                mean.dispose();
                logVar.dispose();
                actionDist.dispose();
                actionProb.dispose();
                valueEstimates.dispose();
                nextValueEstimates.dispose();
                targetValues.dispose();
                valueLoss.dispose();
                policyLoss.dispose();
            }
        }
    }*/

    //await trainPPO(experienceBuffer, policyNetwork, valueNetwork, 0.99, 0.1, 10, 32); // 






    // ====== 1. PREPARE DATA FROM BUFFER (CONVERT TO TENSORS) ======
    /*function prepareTrainingData(buffer) {
        // Convert raw state arrays to tensors
        const states = buffer.map(entry => entry.agentState);
        const nextStates = buffer.map(entry => entry.nextAgentState);

        // Convert to tensors [batch, numInputs]
        const statesTensor = tf.tensor(states, [buffer.length, numInputs]);
        const nextStatesTensor = tf.tensor(nextStates, [buffer.length, numInputs]);

        return { statesTensor, nextStatesTensor };
    }

    // ====== 2. ADVANTAGE CALCULATION (KEY PPO STEP) ======
    function computeAdvantages(valueNet, statesTensor, nextStatesTensor, rewards, doneFlags, gamma = 0.99) {
        // Get V(s) and V(s') predictions
        const vs = valueNet.predict(statesTensor);
        const vsNext = valueNet.predict(nextStatesTensor);

        // Convert to tensors for math operations
        const vsTensor = tf.squeeze(vs);
        const vsNextTensor = tf.squeeze(vsNext);

        // Compute target: V(s) ≈ r + γ * V(s') (TD(0) target)
        const targets = tf.add(rewards, tf.mul(gamma, vsNextTensor));

        // Compute advantage: A(s,a) = r + γV(s') - V(s)
        const advantages = tf.sub(targets, vsTensor);

        // Cleanup tensors (critical for browser memory!)
        vs.dispose();
        vsNext.dispose();
        vsTensor.dispose();
        vsNextTensor.dispose();

        return advantages;
    }*/




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
    async function trainPPO(policyNet, valueNet, buffer, learningRate = 3e-4, gamma = 0.99) { // 0.0003
        // 1. Prepare data
        //const { statesTensor, nextStatesTensor } = prepareTrainingData(buffer);

        const statesTensor = tf.tensor(buffer.map(e => e.agentState));
        const actionIndices = tf.tensor(buffer.map(e => e.action.actionIndex)).toInt(); // [0, 1, 5, ...] // convert to ints!
        const oldProbs = tf.tensor(buffer.map(e => e.action.actionProb)); // P(action | old policy)

        // 2. Get current policy probabilities (from buffer)
        /*const actionProbs = tf.tensor(
            buffer.map(entry => entry.action.actionProb),
            [buffer.length, 1]
        );*/

        // Get NEW policy probabilities for the *exact actions taken* (key!)
        //const newProbs = computePolicyProbabilities(
        //    policyNet.predict(statesTensor), // [batch, 12]
        //    actionIndices                    // [batch] (indices of chosen actions)
        //);

        //const advantages = computeAdvantages(valueNet, statesTensor, buffer);


        // PPO LOSS (clipped ratio)
        //const ratios = tf.div(newProbs, oldProbs);
        //const clippedRatios = tf.clipByValue(ratios, 1 - 0.2, 1 + 0.2);
        //const policyLoss = tf.neg(
        //    tf.mean(tf.minimum(
        //        tf.mul(ratios, advantages),
        //        tf.mul(clippedRatios, advantages)
        //    ))
        //);

        // VALUE LOSS (MSE between V(s) and target)
        //const vs = valueNet.predict(statesTensor);
        //const targets = tf.add(
        //    tf.tensor(buffer.map(e => e.reward)),
        //    tf.mul(0.99, tf.squeeze(vs))
        //);
        //const valueLoss = tf.losses.meanSquaredError(targets, tf.squeeze(vs));

        // UPDATE NETWORKS
        //optimizer.minimize(() => policyLoss, true, policyNet.trainableWeights);
        //optimizer.minimize(() => valueLoss, true, valueNet.trainableWeights);

        const optimizer = tf.train.adam(learningRate);


        // PPO loss is computed per sample, but we process all samples at once using vectorized tensor operations.
        // This is standard in deep learning (and why we use tensors, not loops).
        /* Why You Should Never Loop in TF.js:
            * Memory overhead: Each loop iteration creates temporary tensors.
            * Slowness: Browser JavaScript loops are slow (no GPU acceleration).
            * TF.js is designed for batch processing—it expects vectorized operations.
        */
        const lossFn = () => {
            // Compute NEW policy probabilities (for chosen actions)
            const newProbs = computePolicyProbabilities(
                policyNet.predict(statesTensor),
                actionIndices
            );
            // console.log("New Probs:", newProbs.arraySync());
            // console.log(actionIndices.shape);
            // console.log(actionIndices.arraySync());
            // console.log("Old Probs:", oldProbs.arraySync());
            // console.log("Shapes - new:", newProbs.shape, "old:", oldProbs.shape);

            // Compute ADVANTAGES (using value network)
            const advantages = computeAdvantages(valueNet, statesTensor, buffer, gamma);


            // Why are these not implemented anywhere?
            // Value Loss Coefficient (c1): Weight given to the critic loss in the total objective.
            // Entropy Coefficient (c2): Encourages exploration by penalizing low entropy i.e. overconfident policies.


            // PPO LOSS (clipped ratio)
            const ratios = newProbs.div(oldProbs);
            const clippedRatios = tf.clipByValue(ratios, 1 - 0.2, 1 + 0.2);
            const policyLoss = tf.neg(
                tf.mean(tf.minimum(
                    ratios.mul(advantages),
                    clippedRatios.mul(advantages)
                ))
            );

            // VALUE LOSS
            const vs = valueNet.predict(statesTensor);
            const targets = tf.add(
                tf.tensor(buffer.map(e => e.reward)),
                tf.mul(gamma, tf.squeeze(vs))
            );
            const valueLoss = tf.losses.meanSquaredError(targets, tf.squeeze(vs));
            // console.log("Value Loss:", valueLoss.arraySync(), "Policy Loss:", policyLoss.arraySync());
            // console.log("Total loss:", tf.add(policyLoss, valueLoss).arraySync());

            /*losses.push({
                policyLoss: policyLoss.arraySync(),
                valueLoss: valueLoss.arraySync(),
                totalLoss: tf.add(policyLoss, valueLoss).arraySync()
            });*/
            losses.push(tf.add(policyLoss, valueLoss).arraySync()); // total loss only

            // Return total loss (PPO + value loss)
            return tf.add(policyLoss, valueLoss);
        };

        let losses = [];

        tf.tidy(() => {
            for (let epoch = 0; epoch < epochs; epoch++) {

                console.log("Epoch " + (epoch + 1) + "/" + epochs);

                optimizer.minimize(lossFn, true, [
                    ...policyNet.trainableWeights.map(w => w.val),
                    ...valueNet.trainableWeights.map(w => w.val)
                ]);

            }
            console.log("Losses over epochs:", losses);
        });

        // 4. ✅ CLEANUP (ESSENTIAL FOR BROWSER)
        statesTensor.dispose();
        actionIndices.dispose();
        oldProbs.dispose();


        //optimizer.minimize(() => policyLoss, () => policyWeights);
        //optimizer.minimize(() => valueLoss, () => valueWeights);

        /*
        statesTensor.dispose();
  actionIndices.dispose();
  oldProbs.dispose();
  newProbs.dispose();
  advantages.dispose();
   */


        // 3. Compute advantages
        /*const rewards = tf.tensor(buffer.map(entry => entry.reward));
        const doneFlags = tf.tensor(buffer.map(entry => entry.done ? 1 : 0));
        const advantages = computeAdvantages(
            valueNet,
            statesTensor,
            nextStatesTensor,
            rewards,
            doneFlags,
            0.99 // gamma. Higher is for long-term rewards, lower is for immediate rewards
        );*/

        // 4. Compute new policy probabilities (from current network)
        //const policyOutputs = policyNet.predict(statesTensor);
        //const newProbs = computePolicyProbabilities(policyOutputs); // See helper below

        // 5. Compute ratio = π_new(a|s) / π_old(a|s)
        //const ratios = tf.div(newProbs, actionProbs);

        // 6. Compute PPO loss (clipped surrogate objective)
        /*const clippedRatios = tf.clipByValue(
            ratios,
            1 - 0.2,  // ε = 0.2 (standard PPO clip range) // Clip Range (ε): Controls how much the new policy can deviate from the old one ensuring stable updates.
            1 + 0.2
        );
        const surr1 = tf.mul(ratios, advantages); // 'surrogate'
        const surr2 = tf.mul(clippedRatios, advantages);
        const policyLoss = tf.neg(tf.mean(tf.minimum(surr1, surr2)));

        // 7. Compute value loss (MSE between V(s) and target)
        const vs = valueNet.predict(statesTensor);
        const targets = tf.add(rewards, tf.mul(0.99, tf.squeeze(vs)));
        const valueLoss = tf.losses.meanSquaredError(targets, tf.squeeze(vs));

        // 8. Update networks
        const optimizer = tf.train.adam(learningRate);

        // Policy network update
        optimizer.minimize(() => policyLoss, true, policyNet.trainableWeights);

        // Value network update
        optimizer.minimize(() => valueLoss, true, valueNet.trainableWeights);*/

        // 9. Cleanup tensors (MUST DO TO PREVENT MEMORY LEAKS)
        /*statesTensor.dispose();
        nextStatesTensor.dispose();
        rewards.dispose();
        doneFlags.dispose();
        advantages.dispose();
        actionProbs.dispose();
        policyOutputs.dispose();
        newProbs.dispose();
        ratios.dispose();
        surr1.dispose();
        surr2.dispose();
        policyLoss.dispose();
        valueLoss.dispose();*/
    }



    // ====== 4. HELPER: CONVERT POLICY OUTPUT TO PROBABILITIES ======
    /*function computePolicyProbabilities(policyOutputs) {
        // policyOutputs: [batch, 5] (3 steering + 1 throttle + 1 brake)
        const [steeringLogits, throttleLogit, brakeLogit] = [
            policyOutputs.slice([0, 0], [-1, 3]),
            policyOutputs.slice([0, 3], [-1, 4]),
            policyOutputs.slice([0, 4], [-1, 5])
        ];

        // Convert to probabilities
        const steeringProbs = tf.softmax(steeringLogits);
        const throttleProb = tf.sigmoid(throttleLogit);
        const brakeProb = tf.sigmoid(brakeLogit);

        // Compute joint probability for the exact action taken
        // (e.g., steering=-1, throttle=0, brake=1)
        const actionMask = tf.tensor(buffer.map(entry => {
            return entry.action.steering === -1 ? 0 :
                entry.action.steering === 0 ? 1 : 2;
        }), [buffer.length, 1]);

        // Extract probability for chosen steering
        const chosenSteeringProb = tf.gather(steeringProbs, actionMask, 1);

        // Compute joint probability: P(steering) * P(throttle) * P(brake)
        const jointProb = tf.mul(
            chosenSteeringProb,
            tf.mul(throttleProb, brakeProb)
        );

        return jointProb;
    }*/

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

    await trainPPO(policyNetwork, valueNetwork, experienceBufferPerCar[carID], learningRate, gamma);

    if (totalReward > bestAttempt.totalReward) {
        bestAttempt = { totalReward: totalReward, data: [{ ...experienceBufferPerCar[carID] }], carRecording: "" }; // copy spread into array
        console.log("NEW BEST ATTEMPT:", bestAttempt.totalReward, "with data:", bestAttempt.data);

        /*let actions = [];
        experienceBufferPerCar[carID].forEach((exp) => {
            //console.log("Action of this best attempt at frame " + exp.frame + ":", exp.action);
            actions.push({
                frame: exp.frame,
                action: exp.action
            });
        });*/


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



/*async function getReward(carID, statesOfPreviousExperience) {
    return new Promise((resolve) => {
        self.postMessage({ type: 'calculateReward', carID: carID, states: statesOfPreviousExperience });
        console.log("requesting reward for " + carID);

        const handler = (e) => {
            if (e.data.type === "calculateReward_response") {
                const data = e.data.data;
                console.log(data.carID + " sent response of reward");
                if (data.carID == carID) { // check if this is OUR car
                    resolve(data);
                }
            }
        };
        addEventListener('message', handler, { once: true }); // handler will auto delete when received
    });
}*/







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























function getAction(policyModel, state) {
    const stateTensor = tf.tensor(state).reshape([1, numInputs]);
    const policyOutput = policyModel.predict(stateTensor); // [1, 12]

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
    const actionProb = actionProbs[actionIndex];

    stateTensor.dispose();
    policyOutput.dispose();
    return { steering, throttle, brake, actionProb, actionIndex };
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


