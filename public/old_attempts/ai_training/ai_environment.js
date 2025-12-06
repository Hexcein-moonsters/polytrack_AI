const training_worker = new Worker('training_worker.js');



let startTime;
let times = [];

const postToWorker = getShared("postToWorker");


const Q_ = getShared("Q_"); // at this point, Q_ has probably been set by full_simulation_bundle.js already
if (!Q_) throw new Error("Q_ not found in shared!");

setShared("onCommunicatorReady", (type = "Init") => { // ready = after AI_Init
    if (type !== "AI_Init") throw new Error("It's currently not possible anymore to run the normal Init");

    /*for (let index = 0; index < 1000; index++) {
      postToWorker({ data: { messageType: Q_.TestDeterminism } });
    }*/
    startTime = performance.now();
    postToWorker({ messageType: Q_.TestDeterminism });
});



training_worker.onmessage = (e) => {
    if (e.data.type == "model_init_done") {

        postToWorker({ // to simulation, not trainer
            messageType: Q_.CreateCar,
            mountainVertices: [], // no mountain vertices, as optimisation
            mountainOffset: {
                x: 0,
                y: 0,
                z: 70
            },
            // trackdata should be e.toSaveString()
            trackData: "4pdXVdtzriDEerE9ylBIAheAEa3RxOAmSATJwTflf6snVf1KNa6GMz8NDp2Vte0nnbLaV10h1veiig234ZWj2tVD7bmPkPNvPe24bSr3WrquSapV1Wl1X6SSPutyEXeHrBZoaeijwdQdGEkegVYgT6x5NhTBQrOo9VAASPAZ9s4giwZooSwyaeD6JNlkyGBOeHRNCaANOR7gBwQbjKOQPU2u6FcIYDR2V0hAec35ckcDeq6drtlhzqRpfE4HolDwth2XgoJeBTTcwRB5wXAzN3GjNGclDfvSl3HEoCH7swKhpafjjd2uyFFSjSN6Ge7DR0aaqnfr1XRGJhHg7AcKN5bR3veLvuGFwTrePe1W1diC7j9se5wkR2DJZWsDQdo11kAq1gYdIGRm5e5Ry4MhEmxFOylELHcfjJ40bNCWsReJn2ZniZbIozJEfzeeyF5gZYIXfjceOWzhp6UNOp3VGFlunCk692FebWC0kYekehY73UJnMNSEUVpZAfxJ2Pby6R2zhY3F8KRpC1k206IgLkaWkc4g7EW49ZTlVD4CCv0sYlo4yJz4AwpR1cvrOoq2e8SVOmQivDzzSFf6aXT1ZZ1v7iVL2fQbfhYwJgAP0LevM3EUfskaDV3unKyLGWw4RWz81mezfP5p6nMqo0g6QDi3PLy3oeRmo8dvyvYsNE28m2fsfz98njOGPPJJKdcSCfL5fXOf03n4f861ERIYmDevEXpf8eVq9vYeS25BRPupXMpcy9MhBvtXw3dLuGMeUIwPYdfaS6xJqsvabVqlJH1vFcmkBSYxJsvuotVjZvpkrQlqxtSYZxrT6kEDPg96z73ibn3JZ0szBazbRxnr0pHFlTFE7O58aOQN6DxGU5Q12Jim9F9naeXdscQ1an3yHa7m5vRpOa7mEtun6qGsS8ApQg01gkjwbKw7ew3FsKwMfo3oZCIOd6IwkqeSqi23bm2wGJ7L8iVuDCNCm029LDkHfsZfavYqWol2jPpoMTNmXS5jExfwqhJz22tmGY45sByAVBTQEPFiGhdZdEugGBbcK4IIsRwDMTNwGSVL719XEwTfRXYPf4fBcEfsFIVxeGVbmddbtPfWlhrR77nfqOYk1XdxsMKMehxNg67aHp3J3QmIATh9KjXezU5Q2RWfM3y3hVIS9Mxrr5Yn9d3oMAW05gzPe1ZeR1y4KxWA1CERv6f8erKQ95EsXzHt3jOxKFfqZ3IFlFOd8XDyNnnZZvYesh2ecBgHMEXaX4oxCUfbS5h6ug8pl92vE0ce1NVVQvBqto3ycF7xXLRsVMVPv81HGpAO01vq2a0rMPcrPvWJqDyK9A3AfZByVptK3tul5PlmqULKMTWP79hcvr00XVHe1gA0PIq4Gpb23qakhqoN5QiFdGh6cWuhymq0BycWrt3fyEkF8E2wbI11ofhkoqXwVYPfXhB2GjvEkNGpL3LgxalqDPeh5HnlWGjbXlePBL278wbXBRf5RwyPVnEosNpBbSeQiVlKGhipWmfwoCXM9wwgyJBhs5pCD8MER2vQIJqK8DjWMfXeD6TpZbQ2nrFVtuRbZFkZDCfa8N2DzgyTI9d8qzwbcvzHKJoIrB9f0gQp0b0GNEsKceg10zWFThunfDqKXRLZ4fiwyPJiJfeSqeefRXwbhHstYMDzsHt8YveHjy1DhgFWrZHaOSnBBnJwBJdmfGBLq6zmq0hXFwW9tZaQLACg37giA585jx46yRKXEBrzCf8DHmOgCTsA9Cged3ZgHuTpWkjASvEnTac9FRN1OJGxHdGpjJBccAR3X2nHSXtHnChB7qxUKTdnqRaB9Fe8A6u57sb3YTx8PVePpzmhvC",
            carId: 0,
            carRecording: null, // No pre-recording, this will let us control and then record it
            carCollisionShapeVertices: carCollisionShapeVertices, //jw.models.collisionShapeVertices, // jw is class Gw
            carMassOffset: 0.6 //jw.massOffset,
        });

        postToWorker({
            messageType: Q_.StartCar, // This will now also cause the sim to send us a AI_fromSim_controlsrequested at start
            carId: 0,
            targetSimulationTimeFrames: 100000 // 100s, anything can be put here as we auto delete finished cars. But this is also the max time an AI can be alive!
        });

    } else if (e.data.type == "outputs") {
        const data = e.data;
        const carID = data.carID;
        const originalStates = data.originalStates;
        const outputs = data.outputs;
        console.log(data);
        console.log(outputs);
        // apply outputs to car
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

        const newControls = {
            up: up, // accelerate
            down: down, // break
            left: left,
            right: right,
            reset: false
        };
        setTimeout(() => {
            postToWorker({
                messageType: Q_.AI_fromEnv_updateControls,
                carId: carID,
                newControls: newControls,
                lastState: originalStates[originalStates.length - 1] // only useful to know if this was the 0'th frame
            });
        }, 0);
    } else if (e.data.type == "calculateReward") {
        const carID = e.data.carID;
        const reward = calculateReward(e.data.states);
        training_worker.postMessage({ type: 'calculateReward_response', data: { carID: carID, reward: reward } });
    } else {
        console.log("Unknown data:", e.data);
    }
};
const modelName = 'model-1';
training_worker.postMessage({ type: 'model_init', data: { name: modelName } });
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
                            postToWorker({ messageType: Q_.DeleteCar, carId: state.id });
                            AI_finished_handler(state.id, state);
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
    } else if (e.messageType === Q_.VerifyResult) {
        console.log("Received verify result of car " + e.carId + ":", e);
    } else {
        console.log("sim sent msg:", e);
    }
}
setShared("onWorkerMessage", onWorkerMessage);




function AI_controlsrequested_handler(carID, states) { // this func only gets called after 'model_init_done' as otherwise no AI cars could have existed
    /*states.forEach(state => {
        if (state.collisionImpulses.length !== 0) {
            console.log(state.collisionImpulses);
        }
    });*/


    const lastState = states[states.length - 1];
    // If this is a new car, states will be a 100-length array where every state.frames is 0.
    if (lastState.frames == 0) {
        // This means we should help the AI get started. It also means all states are just info, no sim steps have been taken yet!
        // Which means we give the AI full control even when it hasn't started yet, so no need to wait 100 steps before it can take actions.
        console.log("AI " + carID + " hasn't started driving yet. Predicting first action to take..");
    }

    //training_worker.postMessage({ type: 'predict', data: { inputs: [3] } });
    training_worker.postMessage({
        type: 'predict', data: {
            carID: carID,
            states: states
        }
    });

    // Car will be unpaused by training_worker.onmessage = (e), where e.data.type is "outputs"


    return;


    //console.log(carID + " needs help for:", states);
    console.log(carID + " needs help at frame: " + lastState.frames + " with speed", lastState.speedKmh);
    console.log(lastState);
    const newControls = {
        up: true, // accelerate
        down: false, // break
        left: false,
        right: false,
        reset: false
    };
    postToWorker({
        messageType: Q_.AI_fromEnv_updateControls,
        carId: carID,
        newControls: newControls
    });
}
function AI_finished_handler(carID, lastState) {
    // reward
    console.log("Yay " + carID + " got reward, with last state:", lastState);

    console.log("Car with id " + lastState.id + " has finished at frame " + lastState.finishFrames + ". Full final carstate: ", lastState);

    // now train

}





function calculateReward(states) {
    const lastState = states[states.length - 1];
    let batchReward = 0;
    states.forEach((state, index) => {
        console.log(state.speedKmh);
        batchReward += state.speedKmh; // We give it a collective reward over 100 states based on holding as much speed as possible for 0.1s instead of only counting the lastState
        // We could potentially even use 'index' to prefer more recent states?
    });
    return batchReward;
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

