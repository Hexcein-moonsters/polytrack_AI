const training_worker = new Worker('training_worker.js');



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
    training_worker.postMessage({ type: 'model_init', data: { name: modelName, calculateReward: calculateReward.toString(), mainTimeOrigin: performance.timeOrigin, timeVerify: performance.now() } });
});

const targetSimulationTimeFrames = 5000; // 100000 = after 100s the car will be auto deleted
// Summer1
const trackData = "4pdXVdtzriDEerE9ylBIAheAEa3RxOAmSATJwTflf6snVf1KNa6GMz8NDp2Vte0nnbLaV10h1veiig234ZWj2tVD7bmPkPNvPe24bSr3WrquSapV1Wl1X6SSPutyEXeHrBZoaeijwdQdGEkegVYgT6x5NhTBQrOo9VAASPAZ9s4giwZooSwyaeD6JNlkyGBOeHRNCaANOR7gBwQbjKOQPU2u6FcIYDR2V0hAec35ckcDeq6drtlhzqRpfE4HolDwth2XgoJeBTTcwRB5wXAzN3GjNGclDfvSl3HEoCH7swKhpafjjd2uyFFSjSN6Ge7DR0aaqnfr1XRGJhHg7AcKN5bR3veLvuGFwTrePe1W1diC7j9se5wkR2DJZWsDQdo11kAq1gYdIGRm5e5Ry4MhEmxFOylELHcfjJ40bNCWsReJn2ZniZbIozJEfzeeyF5gZYIXfjceOWzhp6UNOp3VGFlunCk692FebWC0kYekehY73UJnMNSEUVpZAfxJ2Pby6R2zhY3F8KRpC1k206IgLkaWkc4g7EW49ZTlVD4CCv0sYlo4yJz4AwpR1cvrOoq2e8SVOmQivDzzSFf6aXT1ZZ1v7iVL2fQbfhYwJgAP0LevM3EUfskaDV3unKyLGWw4RWz81mezfP5p6nMqo0g6QDi3PLy3oeRmo8dvyvYsNE28m2fsfz98njOGPPJJKdcSCfL5fXOf03n4f861ERIYmDevEXpf8eVq9vYeS25BRPupXMpcy9MhBvtXw3dLuGMeUIwPYdfaS6xJqsvabVqlJH1vFcmkBSYxJsvuotVjZvpkrQlqxtSYZxrT6kEDPg96z73ibn3JZ0szBazbRxnr0pHFlTFE7O58aOQN6DxGU5Q12Jim9F9naeXdscQ1an3yHa7m5vRpOa7mEtun6qGsS8ApQg01gkjwbKw7ew3FsKwMfo3oZCIOd6IwkqeSqi23bm2wGJ7L8iVuDCNCm029LDkHfsZfavYqWol2jPpoMTNmXS5jExfwqhJz22tmGY45sByAVBTQEPFiGhdZdEugGBbcK4IIsRwDMTNwGSVL719XEwTfRXYPf4fBcEfsFIVxeGVbmddbtPfWlhrR77nfqOYk1XdxsMKMehxNg67aHp3J3QmIATh9KjXezU5Q2RWfM3y3hVIS9Mxrr5Yn9d3oMAW05gzPe1ZeR1y4KxWA1CERv6f8erKQ95EsXzHt3jOxKFfqZ3IFlFOd8XDyNnnZZvYesh2ecBgHMEXaX4oxCUfbS5h6ug8pl92vE0ce1NVVQvBqto3ycF7xXLRsVMVPv81HGpAO01vq2a0rMPcrPvWJqDyK9A3AfZByVptK3tul5PlmqULKMTWP79hcvr00XVHe1gA0PIq4Gpb23qakhqoN5QiFdGh6cWuhymq0BycWrt3fyEkF8E2wbI11ofhkoqXwVYPfXhB2GjvEkNGpL3LgxalqDPeh5HnlWGjbXlePBL278wbXBRf5RwyPVnEosNpBbSeQiVlKGhipWmfwoCXM9wwgyJBhs5pCD8MER2vQIJqK8DjWMfXeD6TpZbQ2nrFVtuRbZFkZDCfa8N2DzgyTI9d8qzwbcvzHKJoIrB9f0gQp0b0GNEsKceg10zWFThunfDqKXRLZ4fiwyPJiJfeSqeefRXwbhHstYMDzsHt8YveHjy1DhgFWrZHaOSnBBnJwBJdmfGBLq6zmq0hXFwW9tZaQLACg37giA585jx46yRKXEBrzCf8DHmOgCTsA9Cged3ZgHuTpWkjASvEnTac9FRN1OJGxHdGpjJBccAR3X2nHSXtHnChB7qxUKTdnqRaB9Fe8A6u57sb3YTx8PVePpzmhvC";

let inferenceTimePerCar = {};
let trainingTimePerCar = {};
let predictTimePerCar = {};

let predictTimes = [];
let iterationCount = 0;

const showStats = true;
let modelName_el, iteration_count_el, bestAttempt_el;
document.addEventListener("DOMContentLoaded", (event) => {
    modelName_el = document.getElementById("modelName");
    iteration_count_el = document.getElementById("iteration_count");
    bestAttempt_el = document.getElementById("bestAttempt");
});

const trainSpeedInfo = false;


let iterationData = {}; // for graph stats
if (calledSharedEventListeners.has("onAmmoLoaded")) { // Ammo already loaded, just run plotly already
    loadScript("/lib/plotly-3.2.0.min.js", () => { console.log("Plotly loaded! Ammo/math already loaded"); });
} else { // if ai_environment.js has loaded but ammo not done yet somehow
    addSharedEventListener("onAmmoLoaded", () => { // wait for math
        loadScript("/lib/plotly-3.2.0.min.js", () => { console.log("Plotly loaded! Waited for onAmmoLoaded"); });
    });
}


/*const SLOT_SIZE = 300 * 1024; // 100 states ~= 150KB-200KB, I'll allocate 300KB (bytes)
const SLOT_COUNT = 3; // 3 slots for ring buffer
const BUFFER_SIZE = SLOT_SIZE * SLOT_COUNT;

// Allocate SharedArrayBuffer
const sharedBuffer = new SharedArrayBuffer(BUFFER_SIZE);
const views = {
  // View for writing states (main thread)
  write: new Float32Array(sharedBuffer),
  // View for signaling (atomic flags)
  flags: new Int32Array(sharedBuffer, BUFFER_SIZE - 16),
  // Flags: [writeIndex, readIndex, readyFlag]
  // writeIndex: 0-2 (current slot to write to)
  // readIndex: 0-2 (current slot to read from)
  // readyFlag: 0=empty, 1=full
};*/


training_worker.onmessage = (e) => {
    const { type, data } = e.data;
    //console.log("Main thread received message of type:", type);
    if (type == "model_init_done") {

        if (data.isNewCar) iterationCount = 0; // kinda useless but an extra check isn't excessive
        else {
            iterationCount = localStorage.getItem("AI_PPO_iterationCount.." + modelName) || 0; // reset if not found
            localStorage.setItem("AI_PPO_iterationCount.." + modelName, iterationCount);
        }

        (async () => {
            const carCount = 100;
            const delayPerCar = 100;
            for (let i = 0; i < carCount; i++) {
                createAI_car(i, trackData);
                await new Promise(r => setTimeout(r, delayPerCar)); // 100ms after each other
            }
        })();

    } else if (type == "outputs") {
        const carID = data.carID;
        //const originalStates = data.originalStates;
        const lastFrame = data.lastFrame;
        const outputs = data.outputs;

        //console.log("Outputs:", outputs);

        // apply outputs to car
        const { up, down, left, right } = getControlsFromOutput(outputs);
        const newControls = {
            up: up, // accelerate
            down: down, // brake
            left: left,
            right: right,
            reset: false
        };

        const predictTime = (performance.now() - predictTimePerCar[carID]);
        delete predictTimePerCar[carID];
        //console.log("Predict of car " + carID + " took " + predictTime.toFixed(2) + "ms");
        predictTimes.push(predictTime);

        postToWorker({
            messageType: Q_.AI_fromEnv_updateControls,
            carId: carID,
            newControls: newControls,
            lastFrame: lastFrame //originalStates[originalStates.length - 1] // only useful to know if this was the 0'th frame
        });
    } else if (type == "train_done") {
        const carID = data.carID;
        const trainingTime = (performance.now() - trainingTimePerCar[carID]) / 1000;
        delete trainingTimePerCar[carID];
        if (trainSpeedInfo) console.log("Training car " + carID + " done in " + trainingTime.toFixed(3) + "s");
        // Now save the model
        training_worker.postMessage({ type: 'save', data: { name: modelName } }); // this saves both the policyNetwork and the valueNetwork
        // Now create a new car. Experience has been deleted by training_worker
        setTimeout(() => {
            createAI_car(carID, trackData); // create a car with the exact same ID. As our AI_endOfEpisode_handler has already deleted the car
        }, 0);

        iterationCount++;
        localStorage.setItem("AI_PPO_iterationCount.." + modelName, iterationCount);
        if (showStats) iteration_count_el.innerHTML = `Iterations: ${iterationCount}`;

        // Update graph
        const groupNum = iterationCount - (iterationCount % 100); // round down to 100's
        if (!iterationData[groupNum]) iterationData[groupNum] = [];
        const progressPercentage = Number((data.progressIndex / points.length * 100).toFixed(2));
        iterationData[groupNum].push({
            iterationCount: iterationCount,
            reward: data.totalReward,
            progressPercentage: progressPercentage
        });
        if (showStats && iterationCount % 100 == 0) {
            //console.log(iterationData);

            let graphData = [];
            let medianLine = {
                x: [],
                y: [],
                mode: "lines",
                type: "scatter"
            };
            for (const [groupNum, groupData] of Object.entries(iterationData)) {
                if (groupData.length < 2) continue; // a length of 1 or 0 is because we just did our push. Don't make trace with 1 point
                let trace = {
                    x: [],
                    y: [],
                    mode: "markers",
                    type: "scatter"
                }
                groupData.forEach((itData) => {
                    trace.x.push(itData.iterationCount); // all data of group will be between x: 0-100 so u get actual iteration count
                    //trace.y.push(data.reward); // the y
                    const progressLeft = 100 - itData.progressPercentage;
                    /*if (progressLeft == 100) { // This could be because AI is still at P0 so it could have drove backwards
                        alert("Error, AI is not progressing anymore! Did webgl context get lost? (Progress=0%)");
                        console.log("Data:", groupData);
                        throw new Error("AI not processing anymore, progress=0%, at iterationCount=" + itData.iterationCount);
                    }*/
                    trace.y.push(progressLeft); // a descending graph, hoping to reach 0% = track done
                });
                graphData.push(trace);

                medianLine.x.push(Number(groupNum) + trace.y.length / 2); // 1250 for example (1200 + 100/2), as it is half
                const median = statisticsMath.median(trace.y); // get median of the y values of the trace
                medianLine.y.push(median);
            }
            graphData.push(medianLine);


            /*var y0 = [];
            var y1 = [];
            for (var i = 0; i < 50; i++) {
                y0[i] = Math.random();
                y1[i] = Math.random() + 1;
            }

            /*var trace1 = {
                y: y0,
                type: 'box',
                boxpoints: 'all',
                jitter: 0.3,
                pointpos: -1.8,
            };*/
            /*let trace1 = {
                x: [],
                y: y0,
                mode: "markers",
                type: "scatter"
            };
            y0.forEach((y, index) => {
                trace1.x.push(index * 0.01); // 0-5
            });

            var trace2 = {
                y: y1,
                type: 'box'
            };

            var graphData = [trace1, trace2];*/

            Plotly.newPlot('graph_rewarditerations', graphData);
        }
    } else if (type == "delete_model_done") {
        iterationCount = 0;
        localStorage.setItem("AI_PPO_iterationCount.." + modelName, iterationCount);
    } else if (type == "bestAttempt_createRecordingString") {
        /*const actions = data.actions;
        let inputs = [];
        actions.forEach((action) => {
            const { up, down, left, right } = getControlsFromOutput(action.action);
            const controls = {
                up: up, // accelerate
                down: down, // brake
                left: left,
                right: right,
                reset: false // never reset
            };
            inputs.push({
                frame: action.frame,
                inputs: controls
            });
        });*/
        // console.log(inputs);

        postToWorker({
            messageType: Q_.AI_fromEnv_makeRecordingString,
            carRequestId: data.carRequestId,
            //inputs: inputs,
            totalReward: data.totalReward,
            progressIndex: data.progressIndex,
            startTime: data.startTime
        });
    } else {
        console.log("Unknown data:", e.data);
    }
};
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
        if (Object.keys(e.statesPerId).length == 0) {
            console.log("Sim sent empty carStates");
        } else {
            //console.log("Received car states batch:", e); // always log all car states, even if any finished in that batch

            let finishedCars = new Set([]); // multiple cars could finish at same time
            for (const [carID_str, states] of Object.entries(e.statesPerId)) {
                const carID = Number(carID_str);
                states.forEach((state) => {
                    //console.log(state);
                    if (!finishedCars.has(state.id)) {
                        if (state.finishFrames !== null) {
                            finishedCars.add(state.id); // mark as finished
                            AI_endOfEpisode_handler(state.id, state, true);
                        }
                    }
                });
                if (!finishedCars.has(carID)) { // still not finished, even after processing all states of this car
                    AI_controlsrequested_handler(carID, states);
                }
            }
            if (finishedCars.size == 0) { // nobody finished
                // blabla
            } else {
                console.log("Some car IDs have finished:", finishedCars);
            }
        }
    } else if (e.messageType === Q_.AI_fromSim_carTimeExpired) {
        const { carID, lastState, hasFinished } = e;
        if (hasFinished) { // this means the AI has already crossed the finish line but the car hasn't been deleted yet somehow
            console.warn("CAR " + carID + " HAS FINISHED: IN 'AI_fromSim_carTimeExpired' CHECK");
        } else { // This means the car hasn't crossed the finish line yet, and also hasn't been deleted yet
            if (trainSpeedInfo) console.log("Deleting car " + carID + " as it hasn't finished within the 100s. Current time: " + lastState.frames + " frames.");
            AI_endOfEpisode_handler(carID, lastState, false); // we already know hasFinished is false
        }
    } else if (e.messageType === Q_.AI_fromSim_recordingStringResult) {
        training_worker.postMessage({
            type: "bestAttempt_recordingStringDone",
            data: e // this will include messageType as well, but that's fine
        });
        if (showStats) {
            const { totalReward, progressIndex, carRecording } = e;
            const progressPercentage = (progressIndex / points.length * 100).toFixed(2); // type is string
            bestAttempt_el.innerHTML = `Best Attempt:
    <li>Total Rewards: ${totalReward.toFixed(1)}</li>
    <li>Track Progress: ${progressPercentage}%</li>
    <li>Car Recording: ${carRecording}</li>
    <li>Attempts: ${iterationCount}</li>`;
        }
    } else {
        console.log("sim sent msg:", e);
    }
}
addSharedEventListener("onWorkerMessage", onWorkerMessage);






function createAI_car(carID, trackData) {
    // Start our timer :D
    inferenceTimePerCar[carID] = performance.now();
    if (trainSpeedInfo) console.log("Starting car " + carID);

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







function AI_controlsrequested_handler(carID, states) { // this func only gets called after 'model_init_done' as otherwise no AI cars could have existed
    /*states.forEach(state => {
        if (state.collisionImpulses.length !== 0) {
            console.log(state.collisionImpulses);
        }
    });*/

    predictTimePerCar[carID] = performance.now();


    const lastState = states[states.length - 1];
    // If this is a new car, states will be a 100-length array where every state.frames is 0.
    if (lastState.frames == 0) {
        // This means we should help the AI get started. It also means all states are just info, no sim steps have been taken yet!
        // Which means we give the AI full control even when it hasn't started yet, so no need to wait 100 steps before it can take actions.
        //console.log("AI " + carID + " hasn't started driving yet. Predicting first action to take..");
    }
    //console.log("T: " + lastState.frames);

    //training_worker.postMessage({ type: 'predict', data: { inputs: [3] } });
    /*training_worker.postMessage({
        type: 'predict',
        data: {
            carID: carID,
            states: [ states[states.length - 2], states[states.length - 1] ],
            startTime: performance.now()
        }
    });*/


    const flatBuffer = new Float32Array(98); // the length must be the length of agentStates plus 1 mandatory startsAtIndex byte and then the number of extra data. 98 here as 5+93 // Just do startsAtIndex + agentState length
    // Only start adding at i=1, as i=0 is preserved by startsAtIndex int
    flatBuffer[1] = performance.now();
    flatBuffer[2] = carID;
    flatBuffer[3] = lastState.frames == 0 ? 0 : calculateReward(states); // send the reward directly. Will always be 0 if not started yet, even though trainer will not use this in exp
    flatBuffer[4] = lastState.finishFrames; // finishFrames. Null if not finished yet

    const agentStateStartsAtIndex = 5; // our custom floats take up 5 length, and our startsAt int takes up 0th index which makes 6 total
    flatBuffer[0] = agentStateStartsAtIndex; // Set header of when to start reading the agentState

    // Now we can start writing our agentStates floats, starting at startsAtIndex
    const agentState = getAgentState(states, carID);
    agentState.forEach((aState, i) => { // i starts at 0, but we add '3' for example
        const index = i + agentStateStartsAtIndex;
        flatBuffer[index] = aState; // write 4 bytes (float32)
        if (typeof aState !== "number") console.error(aState + " is not a number! Type: " + typeof aState + ". Full agentState: ", agentState);
        if (flatBuffer.length - 1 < index) console.error("Cannot write to " + index + " as arraybuffer is too small");
    });

    /*training_worker.postMessage({
        type: 'predict',                    // ← CRITICAL: NEW TYPE FOR FLAT BUFFERS
        data: {
            carID: carID,
            startTime: performance.now(),
            states
        }
    });*/

    training_worker.postMessage(
        /*{
            type: "predict",
            data: {
                buffer: flatBuffer.buffer
            }
        },*/
        flatBuffer.buffer,  // ← DIRECTLY send the buffer
        [flatBuffer.buffer]  // ← TRANSFERABLE ARRAY (tells Chrome: "move this buffer")
    );

    // Car will be unpaused by our: training_worker.onmessage = (e), where type is "outputs"
}

let id = 0;
const getUniqueId = () => { // amazing code
    id++;
    return id; // int
};
function AI_endOfEpisode_handler(carID, lastState, hasFinished) {
    const requestId = getUniqueId();
    postToWorker({ messageType: Q_.DeleteCar, carId: carID, requestId: requestId }); // First delete the car

    const inferenceTime = (performance.now() - inferenceTimePerCar[carID]) / 1000;
    delete inferenceTimePerCar[carID];
    if (trainSpeedInfo) console.log("Inference of car " + carID + " took " + inferenceTime.toFixed(3) + "s");

    // Now delete our progress stats
    delete progress_PerCar[carID];
    delete lastCheckpointGoal_PerCar[carID];

    trainingTimePerCar[carID] = performance.now();

    if (hasFinished) {
        // reward?
        console.log("Car with id " + carID + " has finished at frame " + lastState.finishFrames + ". Full final carstate: ", lastState);
    }
    // now train
    if (trainSpeedInfo) console.log("Training car " + carID);

    // We do want to send final progress index so we can display stats at "recordingstringdone"
    const carPos = lastState.position;
    if (!carPos) throw new Error("Error lastState is empty. At endOfEpisode");
    const nearestPoint = treeNearest(carPos, 1);
    const progressIndex = getProgress(nearestPoint[0][0], nearestPoint[0][1]); // Get point index

    training_worker.postMessage({ type: 'train', data: { carID: carID, carRequestId: requestId, progressIndex: progressIndex, epochs: 1, batchSize: 32 } });
}





function calculateReward(states) {
    const lastState = states[states.length - 1];
    const carPos = lastState.position;
    const carID = lastState.id;
    /*let batchReward = 0;
    states.forEach((state, index) => {
        batchReward += state.speedKmh; // We give it a collective reward over 100 states based on holding as much speed as possible for 0.1s instead of only counting the lastState
        // We could potentially even use 'index' to prefer more recent states?
    });*/

    let batchReward = 0;
    const nearestPoint = treeNearest(carPos, 1);
    const progressIndex = getProgress(nearestPoint[0][0], nearestPoint[0][1]); // Get point index
    /*const previousProgress_1s = progress_PerCar[carID][progress_PerCar[carID].length - 10] || 0;
    const deltaProgress_1s = progressIndex - previousProgress_1s;
    //batchReward = deltaProgress_1s; // rewards may be very delayed and sparse -- i.e., exactly 1s later will it receive a negative reward
    */
    // A deltaProgress_1s of 10 means we are going the same speed (progress rate) as WR! (WR path poll rate of 10Hz and we are too)
    // A total reward of 300 means we get 6 delta every time on average, which means we are going 60% of WR speed
    // Edit: the above info is fake, as I am now recording points just by separating them 0.5m each
    // This means a deltaProgress of 10 means you're going at '5m/s' of the path -- note that this is not your actual speed, this is progressRate.
    // From Linesight config: "Reward per meter advanced of points: +0.01" ("reward_per_m_advanced_along_centerline ")
    //const deltaPointMeters = deltaProgress_1s * 0.5; // points are about 0.5m-0.6m from each other
    
    // Actually, I think they mean the full distance from start to current point: 'rollout_results["meters_advanced_along_centerline"].append(distance_since_track_begin)'
    // This means it exponentially gets higher reward the further it goes, massively rewarding long distance driving
    const distanceSinceTrackBegin = progressIndex * 0.5; // points are about 0.5m-0.6m from each other
    batchReward = distanceSinceTrackBegin * 0.01; // from linesight config
    //const actualDistance = getDistanceSinceTrackBegin(progressIndex); // Tiny difference in accurary (25.5 -> 26.03) but it's not worth it as '* 0.5' is way faster!
    
    //batchReward += lastState.speedKmh * 0.1; // small reward for speed too. 200kmh = 20 extra reward
    
    //batchReward -= lastState.collisionImpulses.length * 1; // penalty per collision
    
    //const distanceToPath = Math.sqrt(nearestPoint[0][1]); // converted square distance to square root so it is actual distance
    //batchReward -= distanceToPath * 1; // subtract reward if far from intended path. About 0-7, and sometimes 20+ if really bad. Convert to 0-0.5 and 0.5-3 so speed is more important

    const deltaCheckpointIndex = lastState.nextCheckpointIndex - lastCheckpointGoal_PerCar[carID]; // last goal was 0 and now is 1, meaning we passed cp0, positive delta
    batchReward += deltaCheckpointIndex * 1000; // extremely large reward for passing a checkpoint
    if (deltaCheckpointIndex) console.warn("A CAR HAS PASSED A CHECKPOINT");

    
    if (lastState.finishFrames !== null) { // car has finished
        batchReward += 1000000; // 1e6, massive reward
        console.warn("Massive reward given as AI has crossed finish line!");
    }
    
    // from linesight I got some config params
    batchReward -= states.length * 0.0012; // every ms it loses that amount of reward. Idk if even useful..
    
    batchReward *= 0.1; // scale DOWN (to 30 -> 3) as apparently PPO wants rewards between -1 and 1
    return batchReward;
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




let progress_PerCar = {}; // a list of progresses of each requested action
let lastCheckpointGoal_PerCar = {}; // only stores what the last 'nextCheckpointIndex' was, useful for rewards

function getAgentState(states, carID) {
    const lastSimState = states[states.length - 1];
    const secondLastSimState = states[states.length - 2];
    //console.log(lastSimState);
    // collisionImpulses maybe?

    const carPos = lastSimState.position; //{ x: lastSimState.position.x, y: lastSimState.position.y, z: lastSimState.position.z };
    const wheelsContactPos = [ // if wheel is making contact, return the position. Else if not touching, then return the carPos as when making relative it will just give 0
        lastSimState.wheelContact[0] ? lastSimState.wheelContact[0].position : carPos,
        lastSimState.wheelContact[1] ? lastSimState.wheelContact[1].position : carPos,
        lastSimState.wheelContact[2] ? lastSimState.wheelContact[2].position : carPos,
        lastSimState.wheelContact[3] ? lastSimState.wheelContact[3].position : carPos,
    ];
    const wheelsNormalVector = [ // If wheel is making contact, return normal vector. Else returns 0 0 0
        lastSimState.wheelContact[0] ? lastSimState.wheelContact[0].normal : { x: 0, y: 0, z: 0 },
        lastSimState.wheelContact[1] ? lastSimState.wheelContact[1].normal : { x: 0, y: 0, z: 0 },
        lastSimState.wheelContact[2] ? lastSimState.wheelContact[2].normal : { x: 0, y: 0, z: 0 },
        lastSimState.wheelContact[3] ? lastSimState.wheelContact[3].normal : { x: 0, y: 0, z: 0 },
    ];
    const acceleration = secondLastSimState.speedKmh - lastSimState.speedKmh; // compare the speed of 2 frames ago vs the speed of last frame. There must be 2 frames though!

    // Progress. Path points are of WR and start at t:100 and end at t:22000. Start of AI is t0, so it will always be some distance away from first point
    const nearestPoint = treeNearest(carPos, 1);
    const progressIndex = getProgress(nearestPoint[0][0], nearestPoint[0][1]); // Get point index

    //console.log("NP:", nearestPoint, "index:", progress);
    //console.log("Progress:", (progressIndex / points.length * 100).toFixed(2) + "%");
    if (!progress_PerCar[carID]) progress_PerCar[carID] = [0]; // set first element to the point index of 0

    const previousProgress_1s = progress_PerCar[carID][progress_PerCar[carID].length - 10] || 0; // if we don't have progress of 10 actions ago, fallback to 0 progress
    const deltaProgress_1s = progressIndex - previousProgress_1s; // if our current point index is higher than point index of 1s ago, delta will be higher
    //console.log("Previous progress (10 actions ago)", previousProgress_1s);
    //console.log("Meaning we've advanced by", deltaProgress_1s, "points");
    progress_PerCar[carID].push(progressIndex); // store int

    lastCheckpointGoal_PerCar[carID] = lastSimState.nextCheckpointIndex; // store our next checkpoint

    const agentState = [
        lastSimState.frames, // Time

        // Speed
        lastSimState.speedKmh,
        acceleration, // delta of speed

        // Our last controls. Convert to 1.0 and 0.0 instead of true or false, as tfjs internally does too this so why bother giving it overhead
        lastSimState.controls.up ? 1 : 0,
        lastSimState.controls.down ? 1 : 0,
        lastSimState.controls.left ? 1 : 0,
        lastSimState.controls.right ? 1 : 0,

        lastSimState.hasCheckpointToRespawnAt ? 1 : 0, // have I passed any checkpoints yet. Convert bool to int
        lastSimState.nextCheckpointIndex, // a count of which checkpoint is to come

        // Positional data
        carPos.x,
        carPos.y,
        carPos.z,
        // Delta position, which is a velocity vector
        secondLastSimState.position.x - carPos.x,
        secondLastSimState.position.y - carPos.y,
        secondLastSimState.position.z - carPos.z,

        // Orientation and rotation
        lastSimState.quaternion.x,
        lastSimState.quaternion.y,
        lastSimState.quaternion.z,
        lastSimState.quaternion.w,

        // Wheel contact positions, but relative. 4*3 = 12 extra inputs
        wheelsContactPos[0].x - carPos.x, wheelsContactPos[0].y - carPos.y, wheelsContactPos[0].z - carPos.z,
        wheelsContactPos[1].x - carPos.x, wheelsContactPos[1].y - carPos.y, wheelsContactPos[1].z - carPos.z,
        wheelsContactPos[2].x - carPos.x, wheelsContactPos[2].y - carPos.y, wheelsContactPos[2].z - carPos.z,
        wheelsContactPos[3].x - carPos.x, wheelsContactPos[3].y - carPos.y, wheelsContactPos[3].z - carPos.z,

        // Wheel normal force, so it can know if the ground is flat or sloped. If 0 0 0 then wheel is in air. 4*3 = 12 extra inputs
        wheelsNormalVector[0].x, wheelsNormalVector[0].y, wheelsNormalVector[0].z,
        wheelsNormalVector[1].x, wheelsNormalVector[1].y, wheelsNormalVector[1].z,
        wheelsNormalVector[2].x, wheelsNormalVector[2].y, wheelsNormalVector[2].z,
        wheelsNormalVector[3].x, wheelsNormalVector[3].y, wheelsNormalVector[3].z,


        // Wheels position, but also relative. 4*3 = 12 extra inputs
        lastSimState.wheelPosition[0].x - carPos.x, lastSimState.wheelPosition[0].y - carPos.y, lastSimState.wheelPosition[0].z - carPos.z,
        lastSimState.wheelPosition[1].x - carPos.x, lastSimState.wheelPosition[1].y - carPos.y, lastSimState.wheelPosition[1].z - carPos.z,
        lastSimState.wheelPosition[2].x - carPos.x, lastSimState.wheelPosition[2].y - carPos.y, lastSimState.wheelPosition[2].z - carPos.z,
        lastSimState.wheelPosition[3].x - carPos.x, lastSimState.wheelPosition[3].y - carPos.y, lastSimState.wheelPosition[3].z - carPos.z,

        // Wheel orientation. 4*4 = 16 extra inputs
        lastSimState.wheelQuaternion[0].x, lastSimState.wheelQuaternion[0].y, lastSimState.wheelQuaternion[0].z, lastSimState.wheelQuaternion[0].w,
        lastSimState.wheelQuaternion[1].x, lastSimState.wheelQuaternion[1].y, lastSimState.wheelQuaternion[1].z, lastSimState.wheelQuaternion[1].w,
        lastSimState.wheelQuaternion[2].x, lastSimState.wheelQuaternion[2].y, lastSimState.wheelQuaternion[2].z, lastSimState.wheelQuaternion[2].w,
        lastSimState.wheelQuaternion[3].x, lastSimState.wheelQuaternion[3].y, lastSimState.wheelQuaternion[3].z, lastSimState.wheelQuaternion[3].w,


        // Wheel rotation, how much they're pointing left or right
        lastSimState.wheelRotation[0],
        lastSimState.wheelRotation[1],
        lastSimState.wheelRotation[2],
        lastSimState.wheelRotation[3],

        // Wheel delta rotation, how much more they're pointing to left/right since the last time
        lastSimState.wheelDeltaRotation[0],
        lastSimState.wheelDeltaRotation[1],
        lastSimState.wheelDeltaRotation[2],
        lastSimState.wheelDeltaRotation[3],

        // Wheel skid info. Near 0 = no skid marks, near 1 is skid mark
        lastSimState.wheelSkidInfo[0],
        lastSimState.wheelSkidInfo[1],
        lastSimState.wheelSkidInfo[2],
        lastSimState.wheelSkidInfo[3],


        // Wheel suspension length, shorter = this wheel is momentarily closer to the car, probably cus car just landed on the ground
        lastSimState.wheelSuspensionLength[0],
        lastSimState.wheelSuspensionLength[1],
        lastSimState.wheelSuspensionLength[2],
        lastSimState.wheelSuspensionLength[3],

        // Wheel suspension compression velocity, how much the length is changing. positive = suspension is extending, negative = suspension is being compressed
        lastSimState.wheelSuspensionVelocity[0],
        lastSimState.wheelSuspensionVelocity[1],
        lastSimState.wheelSuspensionVelocity[2],
        lastSimState.wheelSuspensionVelocity[3],


        // Progress
        progressIndex, // index of points, on Summer1 with WR this is about 2K. Distance (meters) from start can be calculated by about: index * 0.5
        deltaProgress_1s // how much progress we've made in last second (10 actions). Our rate of progressing
    ];
    return agentState;
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
        var num = 0;
        for (var i = 0, l = array.length; i < l; i++) num += array[i];
        return num;
    },

    mean: function (array) {
        return statisticsMath.sum(array) / array.length;
    },

    median: function (array) {
        array.sort(function (a, b) {
            return a - b;
        });
        var mid = array.length / 2;
        return mid % 1 ? array[mid - 0.5] : (array[mid - 1] + array[mid]) / 2;
    },

    modes: function (array) {
        if (!array.length) return [];
        var modeMap = {},
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
        var mean = statisticsMath.mean(array);
        return statisticsMath.mean(array.map(function (num) {
            return Math.pow(num - mean, 2);
        }));
    },

    standardDeviation: function (array) {
        return Math.sqrt(statisticsMath.variance(array));
    },

    meanAbsoluteDeviation: function (array) {
        var mean = statisticsMath.mean(array);
        return statisticsMath.mean(array.map(function (num) {
            return Math.abs(num - mean);
        }));
    },

    zScores: function (array) {
        var mean = statisticsMath.mean(array);
        var standardDeviation = statisticsMath.standardDeviation(array);
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
        // the wake lock request fails - usually system related, such being low on battery
        console.log(`${err.name}, ${err.message}`);
        alert("Wake Lock request failed (to prevent webgl context lost): " + err.message);
    }
})();