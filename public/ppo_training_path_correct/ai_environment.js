const training_worker = new Worker('training_worker.js');

//const lookaheads = [5, 15, 40, 100]; // for observations, used in model_init to determine numInputs
const lookaheads = [0, 2, 4, 8, 16, 32, 64, 128];
let numInputs = 32; // hardcode this to the amount of observations (before lookaheads loop). Will dynamically update to fit all lookaheads


let startTime;
let times = [];

const postToWorker = callSharedEventListener("postToWorker");


const Q_ = getShared("Q_"); // at this point, Q_ has probably been set by full_simulation_bundle.js already
if (!Q_) throw new Error("Q_ not found in shared!");

addSharedEventListener("onCommunicatorReady", (type = "Init") => { // ready = after AI_Init
    if (type !== "AI_Init") throw new Error("It's currently not possible anymore to run the normal Init");

    /*for (let index = 0; index < 1000; index++) {
      postToWorker({ data: { messageType: Q_.TestDeterminism } });
    }*/
    startTime = performance.now();
    postToWorker({ messageType: Q_.TestDeterminism });

    // AI model init
    numInputs += lookaheads.length * 3; // each lookahead point adds 3 inputs
    training_worker.postMessage({
        type: 'model_init', data: {
            name: modelName,
            //calculateReward: calculateReward.toString(),
            mainTimeOrigin: performance.timeOrigin,
            timeVerify: performance.now(),
            numInputs: numInputs
        }
    });
});

const targetSimulationTimeFrames = 20000; // 100000 = after 100s the car will be auto deleted
// Summer1
//const trackData = "4pdXVdtzriDEerE9ylBIAheAEa3RxOAmSATJwTflf6snVf1KNa6GMz8NDp2Vte0nnbLaV10h1veiig234ZWj2tVD7bmPkPNvPe24bSr3WrquSapV1Wl1X6SSPutyEXeHrBZoaeijwdQdGEkegVYgT6x5NhTBQrOo9VAASPAZ9s4giwZooSwyaeD6JNlkyGBOeHRNCaANOR7gBwQbjKOQPU2u6FcIYDR2V0hAec35ckcDeq6drtlhzqRpfE4HolDwth2XgoJeBTTcwRB5wXAzN3GjNGclDfvSl3HEoCH7swKhpafjjd2uyFFSjSN6Ge7DR0aaqnfr1XRGJhHg7AcKN5bR3veLvuGFwTrePe1W1diC7j9se5wkR2DJZWsDQdo11kAq1gYdIGRm5e5Ry4MhEmxFOylELHcfjJ40bNCWsReJn2ZniZbIozJEfzeeyF5gZYIXfjceOWzhp6UNOp3VGFlunCk692FebWC0kYekehY73UJnMNSEUVpZAfxJ2Pby6R2zhY3F8KRpC1k206IgLkaWkc4g7EW49ZTlVD4CCv0sYlo4yJz4AwpR1cvrOoq2e8SVOmQivDzzSFf6aXT1ZZ1v7iVL2fQbfhYwJgAP0LevM3EUfskaDV3unKyLGWw4RWz81mezfP5p6nMqo0g6QDi3PLy3oeRmo8dvyvYsNE28m2fsfz98njOGPPJJKdcSCfL5fXOf03n4f861ERIYmDevEXpf8eVq9vYeS25BRPupXMpcy9MhBvtXw3dLuGMeUIwPYdfaS6xJqsvabVqlJH1vFcmkBSYxJsvuotVjZvpkrQlqxtSYZxrT6kEDPg96z73ibn3JZ0szBazbRxnr0pHFlTFE7O58aOQN6DxGU5Q12Jim9F9naeXdscQ1an3yHa7m5vRpOa7mEtun6qGsS8ApQg01gkjwbKw7ew3FsKwMfo3oZCIOd6IwkqeSqi23bm2wGJ7L8iVuDCNCm029LDkHfsZfavYqWol2jPpoMTNmXS5jExfwqhJz22tmGY45sByAVBTQEPFiGhdZdEugGBbcK4IIsRwDMTNwGSVL719XEwTfRXYPf4fBcEfsFIVxeGVbmddbtPfWlhrR77nfqOYk1XdxsMKMehxNg67aHp3J3QmIATh9KjXezU5Q2RWfM3y3hVIS9Mxrr5Yn9d3oMAW05gzPe1ZeR1y4KxWA1CERv6f8erKQ95EsXzHt3jOxKFfqZ3IFlFOd8XDyNnnZZvYesh2ecBgHMEXaX4oxCUfbS5h6ug8pl92vE0ce1NVVQvBqto3ycF7xXLRsVMVPv81HGpAO01vq2a0rMPcrPvWJqDyK9A3AfZByVptK3tul5PlmqULKMTWP79hcvr00XVHe1gA0PIq4Gpb23qakhqoN5QiFdGh6cWuhymq0BycWrt3fyEkF8E2wbI11ofhkoqXwVYPfXhB2GjvEkNGpL3LgxalqDPeh5HnlWGjbXlePBL278wbXBRf5RwyPVnEosNpBbSeQiVlKGhipWmfwoCXM9wwgyJBhs5pCD8MER2vQIJqK8DjWMfXeD6TpZbQ2nrFVtuRbZFkZDCfa8N2DzgyTI9d8qzwbcvzHKJoIrB9f0gQp0b0GNEsKceg10zWFThunfDqKXRLZ4fiwyPJiJfeSqeefRXwbhHstYMDzsHt8YveHjy1DhgFWrZHaOSnBBnJwBJdmfGBLq6zmq0hXFwW9tZaQLACg37giA585jx46yRKXEBrzCf8DHmOgCTsA9Cged3ZgHuTpWkjASvEnTac9FRN1OJGxHdGpjJBccAR3X2nHSXtHnChB7qxUKTdnqRaB9Fe8A6u57sb3YTx8PVePpzmhvC";

const trackData = "4pdrWt2liiDE9vkAGI8xWRERATLoC5bCkqVeyH8QJf1vxeOzOzab3O7M75UW3kcKvhqSR4G5m6QgiQlhxauvgjIaUsMHGSr1ll5L3ua9Ljie6LjW96o1qynXNy8bzGNRgRvNaqYu5KxYxcdjIY3w56nZMOKJvnTNhadN101uAoAqdsQTCwhrcgt7kJpqc6YEoiIWMleQn5uqyhDjLhAFhzeSedKYJid0itL22m1xih1BMbbegE5K8pAWaFKPkwt7YuV40SKDT5Veg9IHxfNHyRkYmYuYmJHOh62yUcBBzp8QkHjpgTJ6XvtTwOEcBT8gqSwhDFIQG35BkSoavCnjNwZIH9OLGekwJ9Wqe30flzReCvOLkPVufC5KP7m8Be9deJwyjemfzdXV8Pf1t15j2cdb7eLbL9qLSrJxVDUz3UNoep9LOKZ3cnrVx3ZmnqvWyx02BLC3W50wLkRfeFO3xLmK1co1UyD8NXm6cKeHdzae2gxeDkmP2f3GfHwl4jm5TTPO6qZyxRhbvUMdl6bOeG6b0OQgY5CfHNL2sa7yHB7E7ZWxAbzTf5SllkIjPMYvvzDh6DBKR2G17lSMzS8ijc0iIhuz9ehSemX3aeWd7TcDbEleZFuXmvhv2tXqeum6Md7w5Fbe62RiE7Bw66IfPa3dehdno5f4gHUyeOg3sNwP79S03LV3jP6o4fJ3xY7P1pbfI5xOqvV5gd2pRfNQpd00oNfdQu6Fa6w6FJbsWc2o6nWQmxq1fYbf00rttRhh1ndklM1UfPLk0dzUjIKXGtovJxShPhcJDPRCCH8IjtFUusReVWih1wZK9pJkA8LkeBU4oJihCco3fMf9UHeA5pBtSm0NTpi0lfedd3vvJ7YUbH6brrLPHlfM1Imaphmu4yy2CthM3rG4ZkCdHne6InnsvmqXehrj4eSeWWijyVdBVUQyEtALVcfLYqiHeFL0m2MN6eWDHnG91PSUo5GPNfz5RfNeofr5pndqBenYlfzs2fBGTRmpQ1ek8bXD8bbXjjh6GufpRmnRzni2KfD93vKDRLbNgrf6ujkdLqfl9rCekcjH0Xzjoh9qpKfTDqQP8WXd4fveKHw2nAYtn0Uuk9rSHdZrQhyvQu2FGE90UIZzvQQ4Re290bMuaJN5p12UAaqcbsxDmYBlkjH08EygOguEzeDdUZIL9SbIPHZvQLg9uOKKL5UcJCJ0WVW5JkNhKplVdue4YclLEUCUOUj6SSEBJ0RF6dTHlg8W0Z80OwDarYfZpUVsFlV3rl6430SRaOMHSsG7wSQVlOQCCT6SY91wlgMJCkvkY7OxpfCGyCiFaywBtaIQ3pTDlEOwwZOnYXlmMjhMcmOlDEDU1tAnzBfiRKd5w6YGRH3J5tKH0tGXg6WtzzEvOwhztH5SZ1KCJkEofRGCd7HlzL7mxCZeZfXp8BdRMYsIjPXCDHoNnXeMmAioeurzFCLjDVHbYi8Lgipn6D7LxjYppUAimDpApqnDgbBBdNEypEqcQJWg2AKunQHYiZNUYnMGGCO6qQD7Ece7RpnbfG2TAZ1KCKb7Vg6pC9RywZteMYzcNQPjqoraUpfClkIfvRXt9YET8hIFAQFEGafTAGmzA9Cx5g3txjNSNRAO18AGJkrTAY9asCHyqkuUYKKIiXs2DXyGbCghLW8UP9vA8KggEH";

const totalCheckpoints = 3; // hardcode it for now

let PPO_CONFIG = { // hyperparams
    gamma: 0.99,
    lambda: 0.95,          // GAE lambda
    clipEpsilon: 0.2,
    policyLearningRate: 3e-4, // LR's can be dynamically edited
    valueLearningRate: 1e-3,
    entropyCoef: 0.001,     // c2, 0.005 used to be 0.01
    valueCoef: 0.5,        // c1
    epochs: 16, // 4-16? // USED TO BE 1
    minibatchSize: 32, // (if buffer length < 128, use minibatch = buffer length)
    maxGradNorm: 0.5
};


let inferenceTimeGlobal = 0;
let trainingTimeGlobal = 0;
let predictTimeGlobal = 0;

let predictTimes = [];
let inferenceTimes = [];
let totalIterations = { iterations: 0, attempts: 0 };
let bestAttemptStats; // trainer stores real data, but we store some of the data it sends
let lastStatsAttempt = -1;

const showStats = true;
let modelName_el, totalIterations_el, totalAttempts_el, bestAttempt_el;
document.addEventListener("DOMContentLoaded", (event) => {
    modelName_el = document.getElementById("modelName");
    totalIterations_el = document.getElementById("iteration_count");
    totalAttempts_el = document.getElementById("attempt_count");
    bestAttempt_el = document.getElementById("bestAttempt");
});

const trainSpeedInfo = false;

// if enabled, for debug it'll do a slightly slower loop that checks if every value is valid (number, and size of agentState, out of bounds)
const shouldCheckAgentState = true; // only disable if you're sure the agentState is correctly configured (correct size and data types)


let iterationStats = {}; // for graph stats
if (calledSharedEventListeners.has("onAmmoLoaded")) { // Ammo already loaded, just run plotly already
    loadScript("/lib/plotly-3.2.0.min.js", () => { console.log("Plotly loaded! Ammo/math already loaded"); });
} else { // if ai_environment.js has loaded but ammo not done yet
    addSharedEventListener("onAmmoLoaded", () => { // wait for math
        loadScript("/lib/plotly-3.2.0.min.js", () => { console.log("Plotly loaded! Waited for onAmmoLoaded"); });
    });
}


const onTrainerMessage = (e) => {
    const { type, data } = e.data;
    if (type == "model_init_done") {
        if (data.isNewModel) totalIterations = { iterations: 0, attempts: 0 }; // kinda useless but an extra check isn't excessive
        else {
            totalIterations = JSON.parse(
                localStorage.getItem("AI_PPO_totalIterations.." + modelName)
                || '{"iterations":0,"attempts":0}' // reset if not found
            );
            localStorage.setItem("AI_PPO_totalIterations.." + modelName, JSON.stringify(totalIterations));
        }

        (async () => {
            const carCount = 5;
            const delayPerCar = 5;

            inferenceTimeGlobal = performance.now(); // start le timer
            for (let i = 0; i < carCount; i++) {
                createAI_car(i, trackData);
                await new Promise(r => setTimeout(r, delayPerCar)); // 100ms after each other
            }
            postToWorker({
                messageType: Q_.AI_fromEnv_updateCanRun,
                canRun: true
            });
        })();
    } else if (type == "outputs") {
        const { carIDs, outputsPerCar, lastFramesPerCar } = data;

        let newControlsPerCar = {};
        for (const carID of carIDs) {
            const currentFrame = lastFramesPerCar[carID];
            const outputs = outputsPerCar[carID];

            let { up, down, left, right } = getControlsFromOutput(outputs);
            const newControls = {
                up: up, // accelerate
                down: down, // brake
                left: left,
                right: right,
                reset: false
            };
            newControlsPerCar[carID] = newControls;
        }

        const predictTime = (performance.now() - predictTimeGlobal);
        if (trainSpeedInfo) console.log("Predict of " + carIDs.length + " cars took " + predictTime.toFixed(2) + "ms");
        predictTimes.push(predictTime);

        postToWorker({
            messageType: Q_.AI_fromEnv_updateControls,
            carIDs: carIDs.map(str => Number(str)), // send as numbers
            newControlsPerCar: newControlsPerCar,
            lastFramesPerCar: lastFramesPerCar // only useful to know if this was the 0'th frame
        });
    } else if (type == "train_done") { // please modify to accept many cars
        const { carIDs, requestIDs, stats } = data;

        const trainingTime = (performance.now() - trainingTimeGlobal);
        if (trainSpeedInfo) console.log("Training of " + carIDs.length + " cars took " + trainingTime.toFixed(2) + "ms");
        
        training_worker.postMessage({ type: 'save', data: { name: modelName } }); // this saves both the policyNetwork and the valueNetwork

        // Now create a new car. Experience has been deleted by training_worker
        inferenceTimeGlobal = performance.now();
        for (const carId of carIDs) {
            createAI_car(carId, trackData); // create a car with the exact same ID. As our AI_episodeEnding_handler has already deleted the car
        }
        postToWorker({
            messageType: Q_.AI_fromEnv_updateCanRun,
            canRun: true
        });
        
        totalIterations.iterations++;
        totalIterations.attempts += carIDs.length; // every car counts as an attempt
        localStorage.setItem("AI_PPO_totalIterations.." + modelName, JSON.stringify(totalIterations));
        if (showStats) {
            totalIterations_el.innerHTML = `Iterations: ${totalIterations.iterations}`;
            totalAttempts_el.innerHTML = `Attempts: ${totalIterations.attempts}`;

            const { totalReward, progressPercentage, carRecording } = bestAttemptStats;
            bestAttempt_el.innerHTML = `Best Attempt:
                <li>Total Rewards: ${totalReward.toFixed(1)}</li>
                <li>Track Progress: ${progressPercentage}%</li>
                <li>Car Recording: ${carRecording}</li>
                <li>Attempts: ${totalIterations.attempts}</li>`;
        }

        // Update graph
        // we previously told the trainer what the progressPercentage (2 decimals) is
        const { averageStateReturn, averageValueLoss, explainedVariance, averagePolicyLoss, approxKLDivergence, averageEntropy, averageNewLogProbs } = stats;
        iterationStats[totalIterations.iterations] = {
            iterationCount: totalIterations.iterations,
            carIDs: carIDs,
            requestIDs: requestIDs,
            totalRewardPerCar: stats.totalRewardPerCar,
            progressPercentages: stats.progressPercentages,
            avgReturnPerCar: stats.avgReturnPerCar,

            averageStateReturn, averageValueLoss, explainedVariance, averagePolicyLoss, approxKLDivergence, averageEntropy, averageNewLogProbs
        }
        const updateEveryAttempts = 5; // after how many attempts it updates the graph
        if (showStats && totalIterations.attempts > lastStatsAttempt + updateEveryAttempts) {
            lastStatsAttempt = totalIterations.attempts;
            visualizerDrawGraph();
        }
    } else if (type == "delete_model_done") {
        totalIterations = { iterations: 0, attempts: 0 };
        localStorage.setItem("AI_PPO_totalIterations.." + modelName, JSON.stringify(totalIterations));
    } else if (type == "bestAttempt_createRecordingString") {
        // Instead of getting the actions here from the model output from experience, instead:
        // we send carRequestId, and communicator gets inputs from ram actions, then makes the string.
        postToWorker({
            messageType: Q_.AI_fromEnv_makeRecordingString,
            carRequestId: data.carRequestId,
            totalReward: data.totalReward,
            progressPercentage: data.progressPercentage,
            startTime: data.startTime
        });
    } else {
        console.log("Unknown data:", e.data);
    }
};
training_worker.onmessage = onTrainerMessage;
let modelName = 'model-1'; // default
const paramsString = window.location.search;
const searchParams = new URLSearchParams(paramsString);
if (searchParams.get("modelName")) modelName = searchParams.get("modelName");
if (showStats) document.addEventListener("DOMContentLoaded", (event) => {
    modelName_el.innerHTML = `Model Name: ${modelName}`;
});
// Delete a model using: training_worker.postMessage({ type: 'delete_model', data: { name: modelName } });



function onWorkerMessage(e) { // simulation worker -> main thread
    if (e.messageType === Q_.DeterminismResult) {
        const time = (performance.now() - startTime).toFixed(2) + " ms";
        console.log("Determinism test complete in " + time + ". Results:", e);
    } else if (e.messageType === Q_.AI_fromSim_controlsrequested) {
        const carIDs = Object.keys(e.statesPerId); // These all need controls
        AI_controlsrequested_handler(carIDs, e.statesPerId);
    } else if (e.messageType === Q_.AI_fromSim_episodeEnding) {
        const { carIDs, lastStatesPerId } = e;
        
        AI_episodeEnding_handler(carIDs, lastStatesPerId);
    } else if (e.messageType === Q_.AI_fromSim_recordingStringResult) {
        training_worker.postMessage({
            type: "bestAttempt_recordingStringDone",
            data: e // this will include messageType as well, but that's fine
        });
        if (showStats) {
            const { totalReward, progressPercentage, carRecording } = e;
            bestAttemptStats = { totalReward, progressPercentage, carRecording };
        }
    } else {
        console.log("sim sent msg:", e);
    }
}
addSharedEventListener("onWorkerMessage", onWorkerMessage);




function createAI_car(carID, trackData) {
    postToWorker({ // to simulation, not trainer
        messageType: Q_.CreateCar,
        mountainVertices: [], // no mountain vertices, as optimisation
        mountainOffset: {
            x: 0,
            y: 0,
            z: 70
        },
        // trackdata should be e.toSaveString()
        trackData: trackData,
        carId: carID,
        carRecording: null, // No pre-recording, this will let us control and then record it
        carCollisionShapeVertices: carCollisionShapeVertices, //jw.models.collisionShapeVertices, // jw is class Gw
        carMassOffset: 0.6 //jw.massOffset,
    });

    postToWorker({
        messageType: Q_.StartCar, // This will now also cause the sim to send us a AI_fromSim_controlsrequested at start
        carId: carID,
        targetSimulationTimeFrames: targetSimulationTimeFrames // 100s, anything can be put here as we auto delete finished cars. But this is also the max time an AI can be alive!
    });
}







function AI_controlsrequested_handlerPerCar(batchBuffer, options, carID, states) {
    const { carDataOffset, observationOffset, floatsPerCar, headerSize } = options;

    const lastState = states[states.length - 1];
    if (lastState.frames == 0) { // If this is a new car, states will be a 100-length array where every state.frames is 0
        // This means we should help the AI get started. It also means all states are just info, no sim steps have been taken yet!
        // Which means we give the AI full control even when it hasn't started yet, so no need to wait 100 steps before it can take actions.
    }
    const carPos = lastState.position; //{ x: lastState.position.x, y: lastState.position.y, z: lastState.position.z };
    const rawForwardVector = getForwardVector(lastState.quaternion); // vector facing in direction car is facing
    const forwardVector = normalize2D(rawForwardVector.x, rawForwardVector.z);

    // Progress. Path points are of WR and start at t:100 and end at t:22000. Start of AI is t0, so it will always be some distance away from first point
    const treeNearest = segmentTrees[lastState.nextCheckpointIndex];
    const nearestResult = treeNearest(carPos, 1)[0]; // select first nearest point
    const nearestPoint = nearestResult[0];
    const progressIndex = getProgress(nearestPoint); // Get point index
    const pointDistance = Math.sqrt(nearestResult[1]); // convert squared distance to actual distance

    const pointAlignment = getPathAlignment(progressIndex, forwardVector);

    if (!progress_PerCar[carID]) progress_PerCar[carID] = [0]; // set first element to the point index of 0
    const progressList = progress_PerCar[carID];
    const previousProgress_1s = progressList[progressList.length - 10] || 0; // if we don't have progress of 10 actions ago, fallback to 0 progress
    const deltaProgress_1s = progressIndex - previousProgress_1s; // if our current point index is higher than point index of 1s ago, delta will be higher
    const deltaProgress_action = progressIndex - progressList[progressList.length - 1]; // since last action. Arr will always start at at least [0]
    progress_PerCar[carID].push(progressIndex); // store int


    const reward = lastState.frames == 0 ? 0 : calculateReward(states, {
        carPos, progressIndex, nearestPoint, pointAlignment, pointDistance, deltaProgress_1s, deltaProgress_action
    });

    const agentState = getAgentState(states, carID, {
        reward, carPos, progressIndex, nearestPoint, pointAlignment, pointDistance, deltaProgress_1s, deltaProgress_action, forwardVector
    });

    if (agentState.length !== numInputs) throw new Error("agentState doesn't match numInputs. Returned floats: " + agentState.length + ". Configured inputs: " + numInputs); 
    if (shouldCheckAgentState) {
        agentState.forEach((aState, i) => {
            if (typeof aState !== "number") throw new Error(aState + " is not a number! Type: " + typeof aState + ". Full agentState:", agentState);
            if (!Number.isFinite(aState)) throw new Error(`Non-finite input at index ${i}: ${aState}. Full agentState:`, agentState);
            const destinationIndex = carDataOffset + observationOffset + i;

            if (destinationIndex >= batchBuffer.length) throw new Error("Index too large, buffer size too small!",
                { destinationIndex, batchLength: batchBuffer.length, floatsPerCar, headerSize });
        });
    }

    let done = lastState.done ?? false; // usually undefined (false), but true when finished or expired
    if (done) {
        if (lastState.finishFrames !== null) done = 1; // finished, type 1
        else done = 2; // expired, type 2
    } else {
        done = 0; // not done yet
    }

    batchBuffer[carDataOffset + 0] = carID;
    batchBuffer[carDataOffset + 1] = reward; // Send calculated reward directly
    batchBuffer[carDataOffset + 2] = done;
    batchBuffer[carDataOffset + 3] = lastState.frames; // currentFrame

    batchBuffer.set( // memory copy into master buffer reference
        agentState, // floats
        carDataOffset + observationOffset // starting index
    );
}
function AI_controlsrequested_handler(carIDs, statesPerId) {
    if (carIDs.length == 0) return alert("Error, sim sent empty carStates");
    predictTimeGlobal = performance.now();

    const headerSize = 5; // up until performance.now()
    const observationOffset = 4; // up until currentFrame
    const floatsPerCar = observationOffset + numInputs;

    const batchBuffer = new Float32Array(
        headerSize + carIDs.length * floatsPerCar
    );

    batchBuffer[0] = carIDs.length;
    batchBuffer[1] = headerSize;
    batchBuffer[2] = floatsPerCar;
    batchBuffer[3] = observationOffset;
    batchBuffer[4] = performance.now();

    for (let i = 0; i < carIDs.length; i++) {
        const carID = Number(carIDs[i]);

        const carDataOffset = headerSize + i * floatsPerCar;

        AI_controlsrequested_handlerPerCar( // modifies reference of batchBuffer to add that car data
            batchBuffer,
            { carDataOffset, observationOffset, floatsPerCar, headerSize },
            carID,
            statesPerId[carID]
        );
    }

    training_worker.postMessage(
        /*{
            type: "predict",
            data: {
                buffer: batchBuffer.buffer
            }
        },*/
        batchBuffer.buffer,  // DIRECTLY send the buffer
        [batchBuffer.buffer]  // TRANSFERABLE ARRAY (tells browser to "move this buffer" over the thread)
    );

    // Car will be unpaused by our onTrainerMessage, where type is "outputs"
}

let id = 0;
const getUniqueId = () => { // amazing code
    id++;
    return id; // int
};
function AI_episodeEnding_handler(carIDs, lastStatesPerId) {
    let requestIDs = {};
    for (const carId of carIDs) {
        requestIDs[carId] = getUniqueId(); // each car gets a unique requestId
    }

    postToWorker({ // First delete all cars
        messageType: Q_.DeleteCar,
        carIDs: carIDs,
        requestIDs: requestIDs
    });

    const inferenceTime = (performance.now() - inferenceTimeGlobal) / 1000;
    if (trainSpeedInfo) console.log("Inference of " + carIDs.length + " cars took " + inferenceTime.toFixed(3) + "s");
    inferenceTimes.push(inferenceTime);

    let progressPercentages = {}; // per car
    for (const carId of carIDs) {
        delete progress_PerCar[carId]; // delete progress stats
        delete lastCheckpointGoal_PerCar[carId];

        const lastState = lastStatesPerId[carId][lastStatesPerId[carId].length - 1]; // select last one in its array
        if (lastState.finishFrames !== null) {
            console.log("Car with id " + carId + " has finished at frame " + lastState.finishFrames + ". Full final carstate: ", lastState);
        }

        // Send final progress index so we can display stats at "recordingstringdone"
        const carPos = lastState.position;
        if (!carPos) throw new Error("lastState is empty, at endOfEpisode");
        
        const treeNearest = segmentTrees[lastState.nextCheckpointIndex];
        const nearestResult = treeNearest(carPos, 1)[0]; // select first nearest point
        const pointDistance = Math.sqrt(nearestResult[1]); // convert squared distance to actual distance
        
        const nearestPoint = nearestResult[0];
        const progressIndex = getProgress(nearestPoint); // Get point index
        const progressPercentage = Number((progressIndex / flatPoints.length * 100).toFixed(2)); // 2 decimals
        progressPercentages[carId] = progressPercentage;
    }

    trainingTimeGlobal = performance.now();

    training_worker.postMessage({
        type: 'train', data: {
            carIDs: carIDs,
            requestIDs: requestIDs,
            progressPercentages: progressPercentages,
            PPO_CONFIG: PPO_CONFIG
        }
    });
}




const expectedTimePerCheckpoint = {
    0: 4, // 4s to reach cp1
    1: 8, // 8s to reach cp2
    2: 10,
    3: 17,
    4: 20,
    5: 25
};
function calculateReward(states, data) {
    const lastState = states[states.length - 1];
    const carID = lastState.id;
    const { carPos, progressIndex, nearestPoint, pointAlignment, pointDistance, deltaProgress_1s, deltaProgress_action } = data;
    /*let batchReward = 0;
    states.forEach((state, index) => {
        batchReward += state.speedKmh; // We give it a collective reward over 100 states based on holding as much speed as possible for 0.1s instead of only counting the lastState
        // We could potentially even use 'index' to prefer more recent states?
    });*/

    let batchReward = 0;
    //batchReward = deltaProgress_1s; // rewards may be very delayed and sparse -- i.e., exactly 1s later will it receive a negative reward
    // A deltaProgress_1s of 10 means we are going the same speed (progress rate) as WR! (WR path poll rate of 10Hz and we are too)
    // A total reward of 300 means we get 6 delta every time on average, which means we are going 60% of WR speed
    // Edit: the above info is fake, as I am now recording points just by separating them 0.5m each
    // This means a deltaProgress of 10 means you're going at '5m/s' of the path -- note that this is not your actual speed, this is progressRate.
    // From Linesight config: "Reward per meter advanced of points: +0.01" ("reward_per_m_advanced_along_centerline ")
    //const deltaPointMeters = deltaProgress_1s * 0.5; // points are about 0.5m-0.6m from each other

    // Actually, I think they mean the full distance from start to current point: 'rollout_results["meters_advanced_along_centerline"].append(distance_since_track_begin)'
    // This means it exponentially gets higher reward the further it goes, massively rewarding long distance driving
    const distanceSinceTrackBegin = data.progressIndex * 0.5; // points are about 0.5m-0.6m from each other
    batchReward = distanceSinceTrackBegin * 0.001; // from linesight config
    //const actualDistance = getDistanceSinceTrackBegin(progressIndex); // Tiny difference in accurary (25.5 -> 26.03) but it's not worth it as '* 0.5' is way faster!

    //batchReward += lastState.speedKmh * 0.1; // small reward for speed too. 200kmh = 20 extra reward

    //batchReward -= lastState.collisionImpulses.length * 1; // penalty per collision

    //const distanceToPath = Math.sqrt(nearestPoint[0][1]); // converted square distance to square root so it is actual distance
    //batchReward -= distanceToPath * 1; // subtract reward if far from intended path. About 0-7, and sometimes 20+ if really bad. Convert to 0-0.5 and 0.5-3 so speed is more important

    const deltaCheckpointIndex = lastState.nextCheckpointIndex - lastCheckpointGoal_PerCar[carID]; // last goal was 0 and now is 1, meaning we passed cp0, positive delta
    batchReward += deltaCheckpointIndex * 20; // extremely large reward for passing a checkpoint
    //if (deltaCheckpointIndex) console.warn("A CAR HAS PASSED A CHECKPOINT");
    if (deltaCheckpointIndex > 0 && lastState.nextCheckpointIndex == 2) console.warn("CAR " + carID + " HAS PASSED cp1 and cp2!");


    if (lastState.finishFrames !== null) { // car has finished
        batchReward += 10000; // 1e4, massive reward
        console.warn("Massive reward given as AI has crossed finish line!");
    }

    // from linesight I got some config params
    batchReward -= states.length * 0.00012; // every ms it loses that amount of reward. Idk if even useful..

    batchReward = 0;
    //batchReward += distanceSinceTrackBegin / 2000;
    batchReward += deltaProgress_action / 20;
    batchReward += pointAlignment * 0.1; // 1 = in front, -1 = backwards, 0 = side
    batchReward += lastState.speedKmh / 250; // 300kmh = 1.2 extra reward
    //if (batchReward > 2) console.log(batchReward.toFixed(3) + " = " + (distanceSinceTrackBegin / 2000).toFixed(3) + " (distance) + " + (lastState.speedKmh / 250).toFixed(3) + " (speed)");

    if (deltaCheckpointIndex > 1) console.error("IMPOSSIBLE, car passed 2 checkpoints at once");
    if (deltaCheckpointIndex > 0) {
        const receivedCpIndex = lastCheckpointGoal_PerCar[carID];
        const expectedTime = expectedTimePerCheckpoint[receivedCpIndex];
        const actualTime = lastState.frames / 1000;
        const timeRatio = expectedTime / actualTime; // if we are faster than expected, ratio will be above 1, if slower, below 1

        batchReward += deltaCheckpointIndex * 50 * timeRatio; // very large reward at the moment of crossing a checkpoint
    }

    if (carPos.y < 0.3) { // around 0.14-0.13 means car is on grass. Road is 0.33-0.34m high
        batchReward = 0; // extreme penalty instantly reset reward if on grass, no matter the progress reward it got
        batchReward += -1; // if on grass the entire batch turns into -1 reward
    }

    if (deltaProgress_action < -5) {
        //console.warn("Car " + carID + " is going backwards a lot! Delta progress: " + deltaProgress_action);
    }
    if (deltaProgress_action > 50) { // 25m/100ms = 250m/s = 900kmh. Either path is very zigzag, but most likely AI is cheating progress (under bridge, flying,..)
        console.warn("Car " + carID + " is making very fast progress! Delta progress: " + deltaProgress_action);
        batchReward = 0; // cheater, reset reward
        batchReward += -10; // large penalty to make sure previous rewards don't matter
    }

    batchReward = 0;


    let reward = 0;
    //reward += Math.max(0, deltaProgress_action) * 0.02; // reverse progress is free, it just doesn't give reward
    reward += deltaProgress_action * 0.02;
    //reward += Math.max(0, pointAlignment) * 0.02;
    reward += lastState.speedKmh / 3000; // reduce to /6000?

    reward -= Math.min(pointDistance / 20, 1) / 50; // centered on path. Clamp distance. Max neg reward is 1/50
    reward -= lastState.collisionImpulses.length / 10; // crashes, used to be /100
    if (carPos.y < 0.3) { // grass
        reward = 0;
        reward -= 0.2;
    }

    let timeRatio, clampedTimeRatio;
    if (deltaCheckpointIndex > 0) {
        //reward += 1; // or 0.5?

        const receivedCpIndex = lastCheckpointGoal_PerCar[carID];
        const expectedTime = expectedTimePerCheckpoint[receivedCpIndex]; // about WR time
        const actualTime = lastState.frames / 1000;
        timeRatio = expectedTime / actualTime;

        clampedTimeRatio = Math.max(0.2, timeRatio); // min 0.2 if very slow, max 1 if it just as fast as WR
        reward += clampedTimeRatio * 2;
    }
    if (lastState.finishFrames !== null) {
        reward += 3; // or 2?
    }

    reward -= 0.001; // only useful for faster finishes

    if (reward > 0.5) console.log("explained reward: " + reward.toFixed(3) + " = "
        + (Math.max(0, deltaProgress_action) * 0.02).toFixed(3) + " (progress) + "
        + (lastState.speedKmh / 3000).toFixed(3) + " (speed) - "
        + (Math.min(pointDistance / 20, 1) / 50).toFixed(3) + " (distance to path) - "
        + (lastState.collisionImpulses.length / 10).toFixed(3) + " (crashes)"
        + (carPos.y < 0.3 ? " - 0.2 (grass)" : "")
        + (deltaCheckpointIndex > 0 ? " + " + clampedTimeRatio.toFixed(3) * 2 + " (checkpoint. timeRatio: " + timeRatio.toFixed(3) + ")" : ""));

    /* reward =
        progressReward
        + speedReward
        + alignmentReward
        - steeringPenalty
        - slidePenalty
        - offTrackPenalty
        - crashPenalty
        
    reward =
        forward progress
        + speed
        + checkpoint completion
        + finish
        - crashes
        - grass
        - distance from path*/

    lastCheckpointGoal_PerCar[carID] = lastState.nextCheckpointIndex; // store our next checkpoint. Important, store only after we read it

    // PPO wants rewards between -1 and 1
    return reward;
}



function getControlsFromOutput(outputs) {
    let up, down, left, right;
    if (outputs.steering == -1) { // left
        left = true;
        right = false;
    } else if (outputs.steering == 0) { // none
        left = false;
        right = false;
    } else if (outputs.steering == 1) { // right
        left = false;
        right = true;
    } else {
        throw "Error while parsing steering. Value " + outputs.steering + " is not -1, 0, or 1";
    }

    if (outputs.throttle == 1) {
        up = true;
    } else if (outputs.throttle == 0) {
        up = false;
    } else {
        throw "Error while parsing throttle. Value " + outputs.throttle + " is not 0 or 1";
    }
    if (outputs.brake == 1) {
        down = true;
    } else if (outputs.brake == 0) {
        down = false;
    } else {
        throw "Error while parsing brake. Value " + outputs.brake + " is not 0 or 1";
    }

    return { up, down, left, right };
}


// GRU/LSTM or frame stacking, for temporal memory?


let progress_PerCar = {}; // a list of progresses of each requested action
let lastCheckpointGoal_PerCar = {}; // only stores what the last 'nextCheckpointIndex' was, useful for rewards
function getAgentState(states, carID, data) {
    const lastState = states[states.length - 1];
    const secondLastState = states[states.length - 2];
    const { reward, carPos, progressIndex, nearestPoint, pointAlignment, pointDistance, deltaProgress_1s, deltaProgress_action, forwardVector } = data;
    // collisionImpulses maybe?

    const wheelsContactPos = [ // if wheel is making contact, return the position. Else if not touching, then return the carPos as when making relative it will just give 0
        lastState.wheelContact[0] ? lastState.wheelContact[0].position : carPos,
        lastState.wheelContact[1] ? lastState.wheelContact[1].position : carPos,
        lastState.wheelContact[2] ? lastState.wheelContact[2].position : carPos,
        lastState.wheelContact[3] ? lastState.wheelContact[3].position : carPos,
    ];
    const wheelsNormalVector = [ // If wheel is making contact, return normal vector. Else returns 0 0 0
        lastState.wheelContact[0] ? lastState.wheelContact[0].normal : { x: 0, y: 0, z: 0 },
        lastState.wheelContact[1] ? lastState.wheelContact[1].normal : { x: 0, y: 0, z: 0 },
        lastState.wheelContact[2] ? lastState.wheelContact[2].normal : { x: 0, y: 0, z: 0 },
        lastState.wheelContact[3] ? lastState.wheelContact[3].normal : { x: 0, y: 0, z: 0 },
    ];
    const acceleration = secondLastState.speedKmh - lastState.speedKmh; // compare the speed of 2 frames ago vs the speed of last frame. There must be 2 frames though!
    const velocityVector = {
        x: carPos.x - secondLastState.position.x,
        y: carPos.y - secondLastState.position.y,
        z: carPos.z - secondLastState.position.z
    };

    const localVel = worldVecToLocal( // instead of 'north', this is relative direction
        forwardVector,
        velocityVector.x,
        velocityVector.z
    );

    const agentState = [
        lastState.frames / targetSimulationTimeFrames, // Time. 1 = 100% = max time. AI knows time progress left from 0-1

        // Speed; 1
        lastState.speedKmh / 300,
        acceleration / 200, // delta of speed

        // Our last controls. Convert to 1.0 and 0.0 instead of true or false, as tfjs internally does too this so why bother giving it overhead
        lastState.controls.up ? 1 : 0,
        lastState.controls.down ? 1 : 0,
        lastState.controls.left ? 1 : 0,
        lastState.controls.right ? 1 : 0,

        //lastState.hasCheckpointToRespawnAt ? 1 : 0, // have I passed any checkpoints yet. Convert bool to int
        lastState.nextCheckpointIndex / totalCheckpoints, // count of which checkpoint is to come, normalized [0, 1]

        // Positional data; 9
        /*carPos.x / 300,
        carPos.y / 300,
        carPos.z / 300,*/
        // Delta position, which is a velocity vector; 8
        localVel.x * 10,
        velocityVector.y * 10,
        localVel.z * 10,

        // Orientation and rotation; 15
        /*lastState.quaternion.x * 2,
        lastState.quaternion.y * 2,
        lastState.quaternion.z * 2,
        lastState.quaternion.w * 2,*/

        // Wheel contact positions, but relative. 4*3 = 12 extra inputs; 19
        /*wheelsContactPos[0].x - carPos.x, wheelsContactPos[0].y - carPos.y, wheelsContactPos[0].z - carPos.z,
        wheelsContactPos[1].x - carPos.x, wheelsContactPos[1].y - carPos.y, wheelsContactPos[1].z - carPos.z,
        wheelsContactPos[2].x - carPos.x, wheelsContactPos[2].y - carPos.y, wheelsContactPos[2].z - carPos.z,
        wheelsContactPos[3].x - carPos.x, wheelsContactPos[3].y - carPos.y, wheelsContactPos[3].z - carPos.z,*/

        // Wheel contact, simple boolean; 11
        lastState.wheelContact[0] ? 1 : 0,
        lastState.wheelContact[1] ? 1 : 0,
        lastState.wheelContact[2] ? 1 : 0,
        lastState.wheelContact[3] ? 1 : 0,

        // Wheel normal force, so it can know if the ground is flat or sloped. If 0 0 0 then wheel is in air. 4*3 = 12 extra inputs; 16
        // Not sure about removing this though
        /*wheelsNormalVector[0].x, wheelsNormalVector[0].y, wheelsNormalVector[0].z,
        wheelsNormalVector[1].x, wheelsNormalVector[1].y, wheelsNormalVector[1].z,
        wheelsNormalVector[2].x, wheelsNormalVector[2].y, wheelsNormalVector[2].z,
        wheelsNormalVector[3].x, wheelsNormalVector[3].y, wheelsNormalVector[3].z,*/


        // Wheels position, but also relative. 4*3 = 12 extra inputs; 43
        /*lastState.wheelPosition[0].x - carPos.x, lastState.wheelPosition[0].y - carPos.y, lastState.wheelPosition[0].z - carPos.z,
        lastState.wheelPosition[1].x - carPos.x, lastState.wheelPosition[1].y - carPos.y, lastState.wheelPosition[1].z - carPos.z,
        lastState.wheelPosition[2].x - carPos.x, lastState.wheelPosition[2].y - carPos.y, lastState.wheelPosition[2].z - carPos.z,
        lastState.wheelPosition[3].x - carPos.x, lastState.wheelPosition[3].y - carPos.y, lastState.wheelPosition[3].z - carPos.z,

        // Wheel orientation. 4*4 = 16 extra inputs; 55
        lastState.wheelQuaternion[0].x, lastState.wheelQuaternion[0].y, lastState.wheelQuaternion[0].z, lastState.wheelQuaternion[0].w,
        lastState.wheelQuaternion[1].x, lastState.wheelQuaternion[1].y, lastState.wheelQuaternion[1].z, lastState.wheelQuaternion[1].w,
        lastState.wheelQuaternion[2].x, lastState.wheelQuaternion[2].y, lastState.wheelQuaternion[2].z, lastState.wheelQuaternion[2].w,
        lastState.wheelQuaternion[3].x, lastState.wheelQuaternion[3].y, lastState.wheelQuaternion[3].z, lastState.wheelQuaternion[3].w,


        // Wheel rotation, how much they're pointing left or right; 71
        lastState.wheelRotation[0] / 3000,
        lastState.wheelRotation[1] / 3000,
        lastState.wheelRotation[2] / 3000,
        lastState.wheelRotation[3] / 3000,

        // Wheel delta rotation, how much more they're pointing to left/right since the last time; 75
        lastState.wheelDeltaRotation[0] * 2,
        lastState.wheelDeltaRotation[1] * 2,
        lastState.wheelDeltaRotation[2] * 2,
        lastState.wheelDeltaRotation[3] * 2,*/

        // Wheel skid info. Near 0 = no skid marks, near 1 is skid mark; 15
        lastState.wheelSkidInfo[0],
        lastState.wheelSkidInfo[1],
        lastState.wheelSkidInfo[2],
        lastState.wheelSkidInfo[3],


        // Wheel suspension length, shorter = this wheel is momentarily closer to the car, probably cus car just landed on the ground; 19
        lastState.wheelSuspensionLength[0] * 10,
        lastState.wheelSuspensionLength[1] * 10,
        lastState.wheelSuspensionLength[2] * 10,
        lastState.wheelSuspensionLength[3] * 10,

        // Wheel suspension compression velocity, how much the length is changing. positive = suspension is extending, negative = suspension is being compressed; 23
        lastState.wheelSuspensionVelocity[0] / 50,
        lastState.wheelSuspensionVelocity[1] / 50,
        lastState.wheelSuspensionVelocity[2] / 50,
        lastState.wheelSuspensionVelocity[3] / 50,


        // Progress; 27
        progressIndex / 2500, // index of points, on Summer1 with WR this is about 2.5K. Distance (meters) from start can be calculated by about: index * 0.5
        deltaProgress_1s / 500, // how much progress we've made in last second (10 actions). Our rate of progressing. 50p/s = 25m/s = 90kmh, still slow. 270kmh = 75m/s = 150p/s
        deltaProgress_action / 50, // progress since last action, quick feedback. 50p = 250m/s
        pointAlignment,
        Math.min(pointDistance / 20, 1) // clamp distance
        // 31 done, next one would be 32; this means 32 distinct inputs
    ];
    for (const offset of lookaheads) {
        const lookaheadPoint = flatPoints[Math.min(progressIndex + offset, flatPoints.length - 1)];

        const local = worldToLocal(carPos, forwardVector, lookaheadPoint);

        // normalize
        let x = local.localX / 500;
        let yDiff = (carPos.y - lookaheadPoint.y) / 500;
        let z = local.localZ / 500;

        if (x > 1.5 || x < -1.5) console.warn("Unusual value in agentState (localX): " + x);
        if (yDiff > 1.5 || yDiff < -1.5) console.warn("Unusual value in agentState (Y difference): " + yDiff);
        if (z > 1.5 || z < -1.5) console.warn("Unusual value in agentState (localZ): " + z);

        // clamp
        x = Math.max(-1, Math.min(1, x));
        yDiff = Math.max(-1, Math.min(1, yDiff));
        z = Math.max(-1, Math.min(1, z));

        agentState.push(x);
        agentState.push(yDiff);
        agentState.push(z);
    }

    agentState.forEach((state, index) => {
        if (state > 2 || state < -2) console.warn("Unusual value in agentState at index " + index + ": " + state);
    });
    return agentState;
}
function getForwardVector(q) { // quaternion to car forward vector
    return {
        x: 2 * (q.w * q.x + q.y * q.z),
        y: 2 * (q.w * q.y - q.x * q.z),
        z: 1 - 2 * (q.x * q.x + q.y * q.y)
    };
}
function getPathAlignment(progressIndex, forward) {
    const p1 = flatPoints[progressIndex];
    const p2 = flatPoints[Math.min(progressIndex + 5, flatPoints.length - 1)];

    const tx = p2.x - p1.x;
    const tz = p2.z - p1.z;

    const mag = Math.sqrt(tx * tx + tz * tz);

    const trackX = tx / mag;
    const trackZ = tz / mag;

    const alignment = forward.x * trackX + forward.z * trackZ;
    return alignment;
}
function worldToLocal(carPos, forward, targetPos) {
    const dx = targetPos.x - carPos.x;
    const dz = targetPos.z - carPos.z;

    // right vector (perpendicular)
    const rightX = forward.z;
    const rightZ = -forward.x;

    return {
        localX: dx * rightX + dz * rightZ,
        localZ: dx * forward.x + dz * forward.z
    };
}
function worldVecToLocal(forward, worldX, worldZ) {
    const rightX = forward.z;
    const rightZ = -forward.x;

    return {
        x: worldX * rightX + worldZ * rightZ,
        z: worldX * forward.x + worldZ * forward.z
    };
}
function normalize2D(x, z) {
    const mag = Math.sqrt(x * x + z * z);

    if (mag < 0.0001) {
        return { x: 0, z: 1 };
    }
    return {
        x: x / mag,
        z: z / mag
    };
}







const carCollisionShapeVertices = [
    -0.7532370686531067,
    -0.34599804878234863,
    1.5797429084777832,
    -0.7532370686531067,
    -0.10825656354427338,
    1.5797429084777832,
    -0.7532370686531067,
    -0.032746829092502594,
    -1.85726797580719,
    -0.7532370686531067,
    -0.34599804878234863,
    1.5797429084777832,
    -0.7532370686531067,
    -0.032746829092502594,
    -1.85726797580719,
    -0.7532370686531067,
    -0.34599804878234863,
    -1.85726797580719,
    -0.16806356608867645,
    0.37836751341819763,
    -0.5776124000549316,
    0.16806338727474213,
    0.37836751341819763,
    -0.5776124000549316,
    0.7532369494438171,
    -0.032746829092502594,
    -1.85726797580719,
    -0.16806356608867645,
    0.37836751341819763,
    -0.5776124000549316,
    0.7532369494438171,
    -0.032746829092502594,
    -1.85726797580719,
    -0.7532370686531067,
    -0.032746829092502594,
    -1.85726797580719,
    0.7532369494438171,
    -0.34599804878234863,
    -1.85726797580719,
    0.7532369494438171,
    -0.032746829092502594,
    -1.85726797580719,
    0.753237247467041,
    -0.10825656354427338,
    1.5797449350357056,
    0.7532369494438171,
    -0.34599804878234863,
    -1.85726797580719,
    0.753237247467041,
    -0.10825656354427338,
    1.5797449350357056,
    0.7532369494438171,
    -0.34599804878234863,
    1.5797429084777832,
    0.7532369494438171,
    -0.032746829092502594,
    -1.85726797580719,
    0.7532369494438171,
    -0.34599804878234863,
    -1.85726797580719,
    -5.960464477539063e-8,
    -0.34599804878234863,
    -1.976300597190857,
    0.753237247467041,
    -0.10825656354427338,
    1.5797449350357056,
    0.7532369494438171,
    -0.032746829092502594,
    -1.85726797580719,
    0.16806338727474213,
    0.37836751341819763,
    -0.5776124000549316,
    -0.7532370686531067,
    -0.10825656354427338,
    1.5797429084777832,
    -0.7532370686531067,
    -0.34599804878234863,
    1.5797429084777832,
    -1.1920928955078125e-7,
    -0.3459986746311188,
    1.6698905229568481,
    -0.7532370686531067,
    -0.032746829092502594,
    -1.85726797580719,
    -0.7532370686531067,
    -0.10825656354427338,
    1.5797429084777832,
    -0.16806356608867645,
    0.37836751341819763,
    -0.5776124000549316,
    -0.7532370686531067,
    -0.10825656354427338,
    1.5797429084777832,
    0.753237247467041,
    -0.10825656354427338,
    1.5797449350357056,
    0.16806338727474213,
    0.37836751341819763,
    -0.5776124000549316,
    -0.7532370686531067,
    -0.10825656354427338,
    1.5797429084777832,
    0.16806338727474213,
    0.37836751341819763,
    -0.5776124000549316,
    -0.16806356608867645,
    0.37836751341819763,
    -0.5776124000549316,
    0.753237247467041,
    -0.10825656354427338,
    1.5797449350357056,
    -0.7532370686531067,
    -0.10825656354427338,
    1.5797429084777832,
    -1.1920928955078125e-7,
    -0.3459986746311188,
    1.6698905229568481,
    -1.1920928955078125e-7,
    -0.3459986746311188,
    1.6698905229568481,
    0.7532369494438171,
    -0.34599804878234863,
    1.5797429084777832,
    0.753237247467041,
    -0.10825656354427338,
    1.5797449350357056,
    -5.960464477539063e-8,
    -0.34599804878234863,
    -1.976300597190857,
    -0.7532370686531067,
    -0.34599804878234863,
    -1.85726797580719,
    -0.7532370686531067,
    -0.032746829092502594,
    -1.85726797580719,
    -0.7532370686531067,
    -0.032746829092502594,
    -1.85726797580719,
    0.7532369494438171,
    -0.032746829092502594,
    -1.85726797580719,
    -5.960464477539063e-8,
    -0.34599804878234863,
    -1.976300597190857
];





const statisticsMath = {
    max: function (array) {
        return Math.max.apply(null, array);
    },

    min: function (array) {
        return Math.min.apply(null, array);
    },

    range: function (array) {
        return statisticsMath.max(array) - statisticsMath.min(array);
    },

    midrange: function (array) {
        return statisticsMath.range(array) / 2;
    },

    sum: function (array) {
        const num = array.reduce((acc, val) => acc + val, 0);
        return num;
    },

    mean: function (array) {
        return statisticsMath.sum(array) / array.length;
    },

    median: function (array) {
        array.sort(function (a, b) {
            return a - b;
        });
        let mid = array.length / 2;
        return mid % 1 ? array[mid - 0.5] : (array[mid - 1] + array[mid]) / 2;
    },

    modes: function (array) {
        if (!array.length) return [];
        let modeMap = {},
            maxCount = 1,
            modes = [array[0]];

        array.forEach(function (val) {
            if (!modeMap[val]) modeMap[val] = 1;
            else modeMap[val]++;

            if (modeMap[val] > maxCount) {
                modes = [val];
                maxCount = modeMap[val];
            }
            else if (modeMap[val] === maxCount) {
                modes.push(val);
                maxCount = modeMap[val];
            }
        });
        return modes;
    },

    variance: function (array) {
        const mean = statisticsMath.mean(array);
        return statisticsMath.mean(array.map(function (num) {
            return Math.pow(num - mean, 2);
        }));
    },

    standardDeviation: function (array) {
        return Math.sqrt(statisticsMath.variance(array));
    },

    meanAbsoluteDeviation: function (array) {
        const mean = statisticsMath.mean(array);
        return statisticsMath.mean(array.map(function (num) {
            return Math.abs(num - mean);
        }));
    },

    zScores: function (array) {
        const mean = statisticsMath.mean(array);
        const standardDeviation = statisticsMath.standardDeviation(array);
        return array.map(function (num) {
            return (num - mean) / standardDeviation;
        });
    }
};
function showStatistics(array) {
    console.log("📊 Array Data:", array);
    console.log("------------------------------");
    console.log("🔢 Max:", statisticsMath.max(array));
    console.log("🔢 Min:", statisticsMath.min(array));
    console.log("📈 Range:", statisticsMath.range(array));
    console.log("⚖️  Midrange:", statisticsMath.midrange(array));
    console.log("➕ Sum:", statisticsMath.sum(array));
    console.log("📉 Mean (Average):", statisticsMath.mean(array));
    console.log("📍 Median:", statisticsMath.median([...array])); // copy so original isn't sorted
    console.log("🎯 Mode(s):", statisticsMath.modes(array));
    console.log("📊 Variance:", statisticsMath.variance(array));
    console.log("📈 Standard Deviation:", statisticsMath.standardDeviation(array));
    console.log("📉 Mean Absolute Deviation:", statisticsMath.meanAbsoluteDeviation(array));
    console.log("🧮 Z-Scores:", statisticsMath.zScores(array));
    console.log("------------------------------\n");
}































(async () => {
    try {
        const wakeLock = await navigator.wakeLock.request("screen");
    } catch (err) {
        // the wake lock request fails: tab wasn't focused when loading the page, or the browser doesn't support wake locks.
        console.log(`${err.name}, ${err.message}`);
        alert("Wake Lock request failed (to prevent webgl context lost): " + err.message);
    }
})();