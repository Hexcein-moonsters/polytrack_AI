var public = {};
function setShared(key, value) { // this can be functions, variables, objects, whatever
    public[key] = value;
};
function getShared(key) {
    return public[key];
}
let sharedEventListeners = {};
let calledSharedEventListeners = new Set([]);
function addSharedEventListener(key, func) {
    if (!sharedEventListeners[key]) sharedEventListeners[key] = [];
    sharedEventListeners[key].push(func);
}
function callSharedEventListener(key) {
    return function (...args) {
        const listeners = sharedEventListeners[key];
        if (!listeners) return console.warn(`No listeners for event "${key}"`);
        for (const func of listeners) {
            //try {
            func(...args);
            //} catch (error) {
            //    console.error(`Error in listener for event "${key}":`, error);
            //}
        }
        if (!calledSharedEventListeners.has(key)) calledSharedEventListeners.add(key);
    };
};


const should_recalculatePhysicsVertices = false; // if false, paste obj in trackparts_hardcoded.js. If true, it will generate from glb files

// this will be overwriten by 'onmessage = i', Calling onmessage() just calls i() which instantly processes that msg and its type
onmessage = () => { }; // Here we're just making a temp placeholder for the browser
addSharedEventListener("postToWorker", (e) => { onmessage({ data: e }) }); // instantly process, by calling i(data)

function postMessage(e) { // worker -> main thread
    callSharedEventListener("onWorkerMessage")(e); // This might give a lot of lag
}


let inputsPerCar = {}; // For temp inputs storing until endOfEpisode and deleteCar. Based on carID
let inputsPerRequest = {}; // After deleteCar this stores it for 10s and if not collected it will autodelete data. Based on unique requestId


addSharedEventListener("onAmmoLoaded", () => {
    // if shouldrecalculate is false, it will take 200ms, otherwise 900ms
    getTrackParts(should_recalculatePhysicsVertices, (physicsParts) => {
        // this starts running the simulation forever, either as fast as possible or at 60fps
        //const isRealtime = false; // you can modify this, but I suggest leaving at false so you receive tens of thousands of states per second
        //if (isRealtime) console.log("Sending Init for loop, with isRealTime enabled");
        //else console.log("Sending Init for loop, with isRealTime disabled (=fastest)");
        console.log("Sending AI_Init");
        postToWorker({
            messageType: Q_.AI_Init,
            trackParts: physicsParts
        }); // post to self
    });


    // code after the getTracksPart will execute immediately without waiting, but we need that as we need communication Init to be ready
    const Q_ = getShared("Q_");
    const V_ = getShared("V_");

    const simfuncs = getShared("simfuncs");
    Object.assign(globalThis, simfuncs); // this will auto define Zt, Kt.. in this scope so Zt() works

    (() => {
        let AI_canRun = false; // only step once this gate is enabled. Ensure all 100 cars start synchronized
        let AI_endEpisodeDetected = false; // checking if carCount=0 is because of end of episode, or because of wrongful AI_canRun change

        let t = new V_([]); // geometry per unique trackpart id. always the same
        const n = []; // cars
        const lw = []; // msg queue used only for old requests (never I think). All other messages just call i(data) directly

        function i(e) {
            switch (e.data.messageType) {
                case Q_.Init:
                    {
                        const n = e.data.isRealtime; // runs c() as fast as possible if not realtime, otherwise runs l() 60 times per second (or by requestanimationframe)
                        t = new V_(e.data.trackParts),
                            function (e) {
                                if (e)
                                    if (self.requestAnimationFrame) {
                                        function t() {
                                            l(),
                                                self.requestAnimationFrame(t)
                                        }
                                        t()
                                    } else
                                        setInterval(l, 1e3 / 60);
                                else
                                    setInterval(c)
                            }(n);

                        callSharedEventListener("onCommunicatorReady")(); // call it

                        break
                    }
                case Q_.Verify:
                    !function (e) {
                        const n = aw.fromSaveString(e.data.trackData);
                        if (null == n)
                            throw new Error("Failed to load track");
                        const i = Sh.deserialize(e.data.carRecording);
                        if (null == i)
                            throw new Error("Failed to deserialize recording");
                        const r = n.getStartTransform();
                        if (null == r)
                            throw new Error("Track has no starting point");
                        const a = e.data.carId
                            , s = new S_(e.data.mountainVertices, new Zt(e.data.mountainOffset.x, e.data.mountainOffset.y, e.data.mountainOffset.z), t, n, e.data.carCollisionShapeVertices, e.data.carMassOffset, new Y_(i), r);
                        s.start();
                        const o = new Xh(e.data.targetFrames);
                        for (; !s.hasFinished() && s.getTime().lessOrEqual(o);)
                            s.step();
                        const l = s.hasFinished() && s.getTime().equals(o);
                        postMessage({
                            messageType: Q_.VerifyResult,
                            carId: a,
                            result: l
                        }),
                            s.dispose()
                    }(e);
                    break;
                case Q_.TestDeterminism:
                    //const starttime = performance.now();
                    postMessage({
                        messageType: Q_.DeterminismResult,
                        isDeterminstic: r()
                    });
                    //times.push(performance.now() - starttime);
                    break;
                case Q_.CreateCar:
                    !function (e) {
                        const i = aw.fromSaveString(e.data.trackData);
                        if (null == i)
                            throw new Error("Failed to load track");
                        let r, a = null;
                        const s = e.data.carRecording;
                        if (null == s)
                            r = new sw,
                                a = [];
                        else {
                            const e = Sh.deserialize(s);
                            if (null == e)
                                throw new Error("Failed to deserialize recording");
                            r = new Y_(e)
                        }
                        const o = i.getStartTransform();
                        if (null == o)
                            throw new Error("Track has no starting point");
                        const l = e.data.carId
                            , c = new S_(e.data.mountainVertices, new Zt(e.data.mountainOffset.x, e.data.mountainOffset.y, e.data.mountainOffset.z), t, i, e.data.carCollisionShapeVertices, e.data.carMassOffset, r, o);
                        n.push({
                            id: l,
                            model: c,
                            userControls: a,
                            targetSimulationTime: null,
                            isPaused: !1
                        })
                    }(e);
                    break;
                case Q_.DeleteCar: // multiple cars
                    !function (e) {
                        const { carIDs, requestIDs } = e.data;
                        
                        const now = performance.now();
                        for (const carId of carIDs) {
                            const requestId = requestIDs[carId];

                            for (let i = 0; i < n.length; i++) { // cars
                                const car = n[i];
                                if (car.id == carId) {
                                    car.model.controls.dispose(),
                                        car.model.dispose(),
                                        n.splice(i, 1);

                                    const carInputs = [...inputsPerCar[carId]]; // copy spread, make backup
                                    delete inputsPerCar[carId]; // remove original inputs data

                                    inputsPerRequest[requestId] = {
                                        timeCarDeleted: now, // when the delete happened
                                        inputs: carInputs
                                    };
                                }
                            }
                        }

                        // cleanup of old inputsPerRequest (10s) of the previous episodes
                        for (const keyId in inputsPerRequest) {
                            const requestData = inputsPerRequest[keyId];
                            if (now - requestData.timeCarDeleted > 10000) { // if >10s, delete old inputs data
                                delete inputsPerRequest[keyId];
                            }
                        }
                    }(e);
                    break;
                case Q_.StartCar:
                    !function (e) {
                        const t = e.data.carId;
                        for (const i of n)
                            if (i.id == t) {
                                i.model.start();
                                const t = e.data.targetSimulationTimeFrames;
                                i.targetSimulationTime = null != t ? new Xh(t) : null;

                                // By checking car.firstActionTaken we prevent any physics steps when the car initially starts, causing 100 frames at t=0.
                                // Then when first AI controls arrive we allow the car to be stepped which stops the (frame=0 & !car.firstActionTaken) check
                                // So now the AI can get 100 frames of data (t=0), then make the first decision, and then physics sim won't stop the car again (game runs fine)
                                break;
                            }
                    }(e);
                    break;
                case Q_.ControlCar:
                    !function (e) {
                        const t = performance.now()
                            , i = e.data.carId;
                        for (const r of n)
                            if (r.id == i) {
                                if (null == r.userControls)
                                    throw new Error("Tried to control uncontrollable car");
                                const n = Math.max(0, t - s);
                                let i = r.model.getTime().numberOfFrames + n;
                                if (r.model.hasStarted() || (i = 0),
                                    0 == r.userControls.length)
                                    r.userControls.push({
                                        frame: i,
                                        up: e.data.up,
                                        right: e.data.right,
                                        down: e.data.down,
                                        left: e.data.left,
                                        reset: e.data.reset
                                    });
                                else {
                                    const t = r.userControls[r.userControls.length - 1].frame;
                                    i == t ? r.userControls[r.userControls.length - 1] = {
                                        frame: i,
                                        up: e.data.up,
                                        right: e.data.right,
                                        down: e.data.down,
                                        left: e.data.left,
                                        reset: e.data.reset
                                    } : i > t && r.userControls.push({
                                        frame: i,
                                        up: e.data.up,
                                        right: e.data.right,
                                        down: e.data.down,
                                        left: e.data.left,
                                        reset: e.data.reset
                                    })
                                }
                                break
                            }
                    }(e);
                    break;
                case Q_.PauseCar:
                    !function (e) {
                        const t = e.data.carId;
                        for (const i of n)
                            if (i.id == t) {
                                i.isPaused = e.data.isPaused;
                                break
                            }
                    }(e)
                    break;
                case Q_.AI_Init:
                    {
                        t = new V_(e.data.trackParts);
                        setInterval(AI); // runs AI() as fast as possible
                        callSharedEventListener("onCommunicatorReady")("AI_Init"); // call it
                        break;
                    }
                case Q_.AI_fromEnv_updateCanRun:
                    {
                        const { canRun } = e.data;
                        AI_canRun = canRun;
                        if (canRun == true) {
                            console.log("[SIM] Starting synchronised sim again, cleared episodeEndingStates");
                            episodeEndingStates = {};
                        }
                        break;
                    }
                case Q_.AI_fromEnv_updateControls:
                    !function (e) {
                        const { carIDs, newControlsPerCar, lastFramesPerCar } = e.data;

                        const carIDSet = new Set(carIDs); // can be less than 100
                        for (const car of n) { // always 100
                            const carId = car.id;
                            if (carIDSet.has(carId)) {
                                const c = newControlsPerCar[carId];

                                const finish = car.model.getFinishTime();
                                const finishFrames = finish !== null ? finish.numberOfFrames : null;
                                if (finishFrames !== null) debugger;

                                car.userControls.push({
                                    frame: car.model.getTime().numberOfFrames, // current frame ('100'), we just stepped
                                    up: c.up,
                                    down: c.down,
                                    left: c.left,
                                    right: c.right,
                                    reset: c.reset
                                });

                                //car.isPaused = false; // No need anymore, we run all cars at same time

                                // Now also let's step the car if the frame is 0, so it doesn't get stuck at no steps
                                const lastFrame = lastFramesPerCar[carId];
                                if (lastFrame == 0) car.firstActionTaken = true; // tell sim steps are allowed now
                            }
                        }

                        AI_canRun = true; // run loop again
                    }(e)
                    break;
                case Q_.AI_fromEnv_makeRecordingString:
                    !function (e) {
                        const { carRequestId, totalReward, progressPercentage, startTime } = e.data;
                        //const inputs = e.data.inputs;
                        const inputs = inputsPerRequest[carRequestId].inputs;

                        //VA(this, Jg, new Sh, "f");
                        //GA(this, Jg, "f").recordFrame(n.frames, GA(this, Yg, "f").controls)
                        const replayMaker = new Sh; // methods: recordFrame, getFrame, serialize. But 'deserialize' is a public static method on recording string
                        inputs.forEach((input) => {
                            const currentFrame = input.frame;
                            //console.log(currentFrame, input.inputs);
                            replayMaker.recordFrame(currentFrame, { // set frame number and put our inputs data
                                up: input.up,
                                down: input.down,
                                left: input.left,
                                right: input.right,
                                reset: input.reset
                            });
                        });
                        const recording = replayMaker.serialize(); // this is the string

                        /*(() => {
                            const deserialized = replayMaker.deserialize(recording);
                            for (let i = 0; i < 5000; i++) {
                                const controls = deserialized.getFrame(i);
                                console.log(controls);
                            }
                        })();*/

                        postMessage({
                            messageType: Q_.AI_fromSim_recordingStringResult,
                            carRecording: recording,
                            requestId: carRequestId,
                            totalReward: totalReward,
                            progressPercentage: progressPercentage,
                            startTime: startTime
                        });
                    }(e);
            }
        }
        for (const e of lw) // process any requests that came in while loading the sim
            i(e);
        function r() {
            if (3.141592653589793 != Math.PI)
                return console.error("Determinism check failed: Math.PI"),
                    !1;
            if (1.4142135623730951 != Math.SQRT2)
                return console.error("Determinism check failed: Math.SQRT2"),
                    !1;
            if (.8325082155867481 != Math.cos(.587123751237))
                return console.error("Determinism check failed: Math.cos"),
                    !1;
            if (.530868917654027 != Math.sin(2.581961285))
                return console.error("Determinism check failed: Math.sin"),
                    !1;
            if (3678159.3874182813 != Math.pow(123, Math.PI))
                return console.error("Determinism check failed: Math.pow"),
                    !1;
            if (123 * Math.PI != 386.41589639154455)
                return console.error("Determinism check failed: Multiply"),
                    !1;
            if (123 / Math.PI != 39.152116000606256)
                return console.error("Determinism check failed: Division"),
                    !1;
            const t = new Zt(-.6827400326728821, .11212741583585739, 2.6956899166107178)
                , n = new Kt(-.615668535232544, .03904851898550987, .7859793305397034, .04079177975654602)
                , i = new Hh;
            i.createGroundPlane(),
                i.activePhysicsAt(new Zt(0, 0, 0));
            const r = new e.btTransform;
            r.setIdentity();
            const a = new e.btDefaultMotionState(r);
            e.destroy(r);
            const s = new e.btVector3(0, 0, 0)
                , o = new e.btVector3(.1, .1, .1)
                , l = new e.btBoxShape(o);
            l.calculateLocalInertia(400, s),
                e.destroy(o);
            const c = new e.btRigidBodyConstructionInfo(400, a, l, s)
                , h = new e.btRigidBody(c);
            e.destroy(s),
                e.destroy(c),
                h.setActivationState(4),
                i.world.addRigidBody(h);
            const d = new e.btVehicleTuning
                , u = new e.btDefaultVehicleRaycaster(i.world)
                , f = new e.btRaycastVehicle(d, h, u);
            f.setCoordinateSystem(0, 1, 2),
                i.world.addAction(f);
            const p = new e.btVector3(0, -1, 0)
                , m = new e.btVector3(-1, 0, 0);
            for (const t of ["WheelFL", "WheelFR", "WheelBL", "WheelBR"]) {
                let n;
                if ("WheelFL" == t)
                    n = new e.btVector3(.627909, .27, 1.3478);
                else if ("WheelFR" == t)
                    n = new e.btVector3(-.627909, .27, 1.3478);
                else if ("WheelBL" == t)
                    n = new e.btVector3(.720832, .27, -1.52686);
                else {
                    if ("WheelBR" != t)
                        throw new Error("Unidentified wheel");
                    n = new e.btVector3(-.720832, .27, -1.52686)
                }
                const i = "WheelFL" == t || "WheelFR" == t;
                f.addWheel(n, p, m, .12, .331, d, i),
                    e.destroy(n)
            }
            e.destroy(p),
                e.destroy(m);
            const g = new e.btTransform;
            g.setIdentity(),
                h.setWorldTransform(g),
                h.getMotionState().setWorldTransform(g),
                e.destroy(g),
                f.resetSuspension(),
                f.setSteeringValue(0, 0),
                f.setSteeringValue(0, 1);
            const A = new e.btTransform;
            A.setIdentity();
            const _ = new e.btDefaultMotionState(A);
            e.destroy(A);
            const v = new e.btVector3(0, 0, 0)
                , w = new e.btVector3(.1, .1, .1)
                , y = new e.btBoxShape(w);
            y.calculateLocalInertia(100, v),
                e.destroy(w);
            const x = new e.btRigidBodyConstructionInfo(100, _, y, v)
                , b = new e.btRigidBody(x);
            e.destroy(v),
                e.destroy(x),
                b.setActivationState(4),
                i.world.addRigidBody(b);
            const S = 1e5;
            f.applyEngineForce(S, 2),
                f.applyEngineForce(S, 3);
            for (let e = 0; e < 999; e++)
                i.step();
            const E = new e.btTransform;
            h.getMotionState().getWorldTransform(E);
            const M = E.getOrigin()
                , T = E.getRotation();
            e.destroy(E);
            const C = t.equals(new Zt(M.x(), M.y(), M.z()))
                , I = n.equals(new Kt(T.x(), T.y(), T.z(), T.w()));
            i.dispose(),
                e.destroy(l),
                e.destroy(h),
                e.destroy(f),
                e.destroy(y),
                e.destroy(b);
            const R = C || I;
            return R || console.error("Determinism check failed: Simulation"),
                R
        }
        function a(e, shouldStep = true) { // added shouldstep
            var t, n;
            const i = e.id
                , r = e.model
                , a = r.controls.getControls(r.getTime().numberOfFrames);
            if (shouldStep) r.step(); // extra check
            const s = r.getPosition()
                , o = r.getQuaternion()
                , l = r.getWheelPosition(0)
                , c = r.getWheelPosition(1)
                , h = r.getWheelPosition(2)
                , d = r.getWheelPosition(3)
                , u = r.getWheelQuaternion(0)
                , f = r.getWheelQuaternion(1)
                , p = r.getWheelQuaternion(2)
                , m = r.getWheelQuaternion(3);
            let g = null;
            if (r.getWheelInContact(0)) {
                g = {
                    position: r.getWheelContactPosition(0),
                    normal: r.getWheelContactNormal(0)
                }
            }
            let A = null;
            if (r.getWheelInContact(1)) {
                A = {
                    position: r.getWheelContactPosition(1),
                    normal: r.getWheelContactNormal(1)
                }
            }
            let _ = null;
            if (r.getWheelInContact(2)) {
                _ = {
                    position: r.getWheelContactPosition(2),
                    normal: r.getWheelContactNormal(2)
                }
            }
            let v = null;
            if (r.getWheelInContact(3)) {
                v = {
                    position: r.getWheelContactPosition(3),
                    normal: r.getWheelContactNormal(3)
                }
            }
            return {
                id: i,
                frames: r.getTime().numberOfFrames,
                speedKmh: r.getSpeedKmh(),
                hasStarted: r.hasStarted(),
                finishFrames: null !== (n = null === (t = r.getFinishTime()) || void 0 === t ? void 0 : t.numberOfFrames) && void 0 !== n ? n : null,
                nextCheckpointIndex: r.getNextCheckpointIndex(),
                hasCheckpointToRespawnAt: r.hasCheckpointToRespawnAt(),
                position: {
                    x: s.x,
                    y: s.y,
                    z: s.z
                },
                quaternion: {
                    x: o.x,
                    y: o.y,
                    z: o.z,
                    w: o.w
                },
                collisionImpulses: r.getCollisionImpulses(),
                wheelContact: [g, A, _, v],
                wheelSuspensionLength: [r.getWheelSuspensionLength(0), r.getWheelSuspensionLength(1), r.getWheelSuspensionLength(2), r.getWheelSuspensionLength(3)],
                wheelSuspensionVelocity: [r.getWheelSuspensionVelocity(0), r.getWheelSuspensionVelocity(1), r.getWheelSuspensionVelocity(2), r.getWheelSuspensionVelocity(3)],
                wheelRotation: [r.getWheelRotation(0), r.getWheelRotation(1), r.getWheelRotation(2), r.getWheelRotation(3)],
                wheelDeltaRotation: [r.getWheelDeltaRotation(0), r.getWheelDeltaRotation(1), r.getWheelDeltaRotation(2), r.getWheelDeltaRotation(3)],
                wheelSkidInfo: [r.getWheelSkidInfo(0), r.getWheelSkidInfo(1), r.getWheelSkidInfo(2), r.getWheelSkidInfo(3)],
                wheelPosition: [{
                    x: l.x,
                    y: l.y,
                    z: l.z
                }, {
                    x: c.x,
                    y: c.y,
                    z: c.z
                }, {
                    x: h.x,
                    y: h.y,
                    z: h.z
                }, {
                    x: d.x,
                    y: d.y,
                    z: d.z
                }],
                wheelQuaternion: [{
                    x: u.x,
                    y: u.y,
                    z: u.z,
                    w: u.w
                }, {
                    x: f.x,
                    y: f.y,
                    z: f.z,
                    w: f.w
                }, {
                    x: p.x,
                    y: p.y,
                    z: p.z,
                    w: p.w
                }, {
                    x: m.x,
                    y: m.y,
                    z: m.z,
                    w: m.w
                }],
                brakeLightEnabled: r.isBrakeLightEnabled(),
                controls: a
            }
        }
        lw.length = 0,
            onmessage = i;
        let s = performance.now()
            , o = 0;
        function l() {
            const e = performance.now();
            o += Math.max(0, Math.min(.1, (e - s) / 1e3)),
                s = e;
            const t = [];
            for (; o > .001;) {
                o -= .001;
                for (const e of n) {
                    if (null != e.targetSimulationTime)
                        throw new Error("Realtime simulation does not support targetSimulationTime");
                    const n = e.model.getTime().numberOfFrames;
                    if (e.model.hasStarted() && n < Sh.maxFrames && !e.isPaused) {
                        if (null != e.userControls)
                            for (; e.userControls.length > 0 && e.userControls[0].frame <= n;) {
                                const t = e.userControls.shift();
                                if (null != t) {
                                    const n = e.model.controls;
                                    if (!(n instanceof sw))
                                        throw new Error("Tried to control uncontrollable car");
                                    n.up = t.up,
                                        n.right = t.right,
                                        n.down = t.down,
                                        n.left = t.left,
                                        n.reset = t.reset
                                }
                            }
                        t.push(a(e))
                    }
                }
            }
            t.length > 0 && postMessage({
                messageType: Q_.UpdateResult,
                carStates: t
            })
        }
        function c() {
            const e = performance.now()
                , t = [];
            if (n.length > 0) {
                let i;
                do {
                    i = !0;
                    for (let e = 0; e < Math.max(1, Math.ceil(100 / n.length)); e++) {
                        for (const e of n)
                            if (e.model.hasStarted()) {
                                if (null == e.targetSimulationTime)
                                    throw new Error("Non-realtime simulation requires targetSimulationTime");
                                // a(e) also steps the sim and gives state info
                                e.model.getTime().numberOfFrames < Sh.maxFrames && e.model.getTime().lessThan(e.targetSimulationTime) && !e.isPaused && (t.push(a(e)),
                                    i = !1)
                            }
                        if (i)
                            break
                    }
                } while (Math.max(0, performance.now() - e) / 1e3 < .01 && !i)
            }
            postMessage({
                messageType: Q_.UpdateResult,
                carStates: t
            })
        }

        /*function AI() {
            let nonPausedCars = []; // A (good) consequence of this is that a car that got unpaused while 100 steps are processing, will not be in the original nonPausedCars. So all cars will always get exactly 100 steps
            for (const car of n) { // n = cars, if length 0 then this for loop won't waste cpu. And will return right after
                if (!car.isPaused) nonPausedCars.push(car);
            }
            if (nonPausedCars.length == 0) return; // quickly skip if cars exist but are all paused
            let t = []; // car states to send

            for (const car of nonPausedCars) { // I've switched around the order of the 'for cars' and 'for i < 100'
                const shouldRandomize = Math.random() < 0.5; // 50% chance of a random controls lasting 1 frame
                let frameToRandomizeAt = Math.round(Math.random() * 100); // get values 0 to 100, as ints
                if (frameToRandomizeAt == 0 || frameToRandomizeAt == 100) frameToRandomizeAt = 50; // restoreControlsTo is undefined otherwise
                const pickLeft = Math.random() < 0.5; // 50% chance of toggling the left key instead of right key
                let restoreControlsTo;
                let hasAlreadyRandomized = false, shouldRevertControls = false;

                // a loop of 100 means it will simulate 100ms ingame and then wait for new controls. = 10 actions per second
                // The sim will also only parse controls of 0-99, while frame is already at 1-100
                for (let e = 0; e < 100; e++) { // you can run EXTREMELY fast stuff by not relying on setInterval and instead doing a 'for'
                    if (car.model.hasFinished()) continue;
                    if (car.model.hasStarted()) {
                        // a(e) also steps the sim and gives state info (unless we pass 'false' to it to not step, custom)
                        const currentTime = car.model.getTime(); // Will always be 1 less than the final state as it hasn't stepped yet.
                        const currentFrame = currentTime.numberOfFrames;
                        if ( // Execute statements in sync, not parallel, = don't waste compute power on 2nd statement if 1st is false
                            currentFrame < Sh.maxFrames && // "bh.maxFrames = 5999999;" = checking if sim has lasted less than 99.9 minutes
                            currentTime.lessThan(car.targetSimulationTime) &&
                            !car.isPaused
                        ) {
                            if (currentFrame == 0) {
                                if (car.firstActionTaken) { // custom field to make sure if AI takes its first action it doesn't get stuck at not stepping sim
                                    // By not using 'continue' with a state without stepping, we let the block after this numberOfFrames == 0 thing actually step the car
                                    //console.log("At frame 0 but AI has sent an initial action, so we can finally start stepping the sim");
                                    delete car.firstActionTaken;
                                } else {
                                    t.push(a(car, false)); // add a single state without stepping the game
                                    // Now because the frames haven't been stepped, this car will be at numberOfFrames = 0 for the rest of the 100 loops.
                                    // This means t will be filled with 100 states where the model is just standing still.
                                    continue; // skip over this car
                                }
                            }
                            if (shouldRevertControls) { // this logic is called 1 frame after it has randomized
                                shouldRevertControls = false;
                                car.userControls.push({
                                    frame: currentFrame, // current frame ('167')
                                    up: restoreControlsTo.up,
                                    down: restoreControlsTo.down,
                                    left: restoreControlsTo.left,
                                    right: restoreControlsTo.right,
                                    reset: false
                                });
                                //console.log("Reverting controls at frame " + currentFrame);
                            }
                            if (shouldRandomize && frameToRandomizeAt == currentFrame) {
                                hasAlreadyRandomized = true;
                                shouldRevertControls = true; // next frame will turn this into false
                                if (!restoreControlsTo) console.log(restoreControlsTo, "is undefined at frame " + currentFrame); // Should not happen anymore cus of our 0 || 100 check
                                if (pickLeft) {
                                    car.userControls.push({
                                        frame: currentFrame, // current frame ('166')
                                        up: restoreControlsTo.up,
                                        down: restoreControlsTo.down,
                                        left: !restoreControlsTo.left, // invert left
                                        right: restoreControlsTo.right,
                                        reset: false
                                    });
                                } else {
                                    car.userControls.push({
                                        frame: currentFrame, // current frame ('166')
                                        up: restoreControlsTo.up,
                                        down: restoreControlsTo.down,
                                        left: restoreControlsTo.left,
                                        right: !restoreControlsTo.right, // invert right
                                        reset: false
                                    });
                                }
                                //if (car.id == 0) console.log("Overwriting controls of frame " + currentFrame + " to:", car.userControls);
                            }
                            //console.log(currentFrame, car.model.controls);
                            //console.log(car.model.getSpeedKmh());
                            if (car.userControls != null) {
                                for (; car.userControls.length > 0 && car.userControls[0].frame <= currentFrame;) { // will loop until the first control is on this frame
                                    //console.log("Removed one userControls at frame: " + currentFrame);
                                    //console.log(car.userControls.length);
                                    //console.log(car.model.controls);
                                    //console.log(car.model.controls.getControls);
                                    const t = car.userControls.shift(); // it removes first element and sets the removed element to 't'
                                    if (t != null) {
                                        const n = car.model.controls;
                                        n.up = t.up;
                                        n.right = t.right;
                                        n.down = t.down;
                                        n.left = t.left;
                                        n.reset = t.reset;


                                        if (!hasAlreadyRandomized) restoreControlsTo = { // make sure to not get in infinite loop
                                            up: t.up,
                                            right: t.right,
                                            down: t.down,
                                            left: t.left,
                                            reset: t.reset
                                        }; // This always runs as userControls is always magically filled. We're basically setting our last action
                                        const carID = car.id;
                                        //if (!hasAlreadyRandomized && carID == 0) console.log("Storing our last controls of frame " + currentFrame + " to:", t); // runs every 100 frames (at each action)
                                        if (!inputsPerCar[carID]) inputsPerCar[car.id] = []; // init
                                        inputsPerCar[carID].push(t); // this also has frame
                                    }
                                }
                            }

                            t.push(a(car));
                            // no checks to early exit if already finished, as it doesn't hurt to simulate 20ms extra, and t.forEach will pick first state that has finished
                        }
                    }
                }
            }
            if (t.length == 0) return;
            // It will send all states only of that car.
            let statesPerId = {};
            let hasFinishedPerId = {};
            t.forEach((state) => {
                if (!hasFinishedPerId[state.id]) { // skip if car has already finished, so there is only ever 1 finish state sent by the car and a bunch of nonfinished before that
                    if (!statesPerId[state.id]) statesPerId[state.id] = []; // initialize
                    statesPerId[state.id].push(state); // add that state to that id
                    if (state.finishFrames !== null) {
                        // This means it has already finished. We already pushed that last finishing state, but now we have to prevent further finished states from that car
                        hasFinishedPerId[state.id] = true;
                    }
                }
            });

            // Now the 100 steps have finished.
            // I need help from ai_environment.js, so I also need to wait/pause the simulation of that car so 'AI()' won't step it  (!car.isPaused)
            for (const car of nonPausedCars) {
                if (car.model.hasFinished()) continue;
                if (car.model.hasStarted()) { // don't go over cars that are currently paused (by us)
                    car.isPaused = true; // just skip the PauseCar event, instantly pause it
                };
            }

            for (const car of nonPausedCars) {
                let canStillDrive = false;
                const currentTime = car.model.getTime();
                if (currentTime.numberOfFrames < Sh.maxFrames && currentTime.lessThan(car.targetSimulationTime)) {
                    if (!car.model.hasFinished()) { // checking if time hasn't expired and the car hasn't crossed finish line yet
                        canStillDrive = true;
                    }
                }
                if (!canStillDrive) { // this means that car's time has exceeded either 99.99 minutes, or exceeded the targetSimulationTime which is 100s, or it has already finished
                    postMessage({
                        messageType: Q_.AI_fromSim_carTimeExpired,
                        carID: car.id,
                        lastState: statesPerId[car.id][statesPerId[car.id].length - 1], // get last element from states of that car
                        hasFinished: car.model.hasFinished()
                    });
                    // Now remove this car from statesPerId so no controls are requested
                    delete statesPerId[car.id];
                }
            }


            if (Object.keys(statesPerId).length == 0) return; // Now do our check again as we might have deleted some id's that didn't finish in time
            postMessage({
                messageType: Q_.AI_fromSim_controlsrequested,
                statesPerId: statesPerId
            });
        }*/

        let episodeEndingStates = {}; // contains all data of 19901-19999, or of early finishers
        function AI() {
            if (!AI_canRun) return; // keep the loop but don't process anything
            let t = {}; // car states to send. Changed to perCarId object instead of array for easier lookup

            let runningCars = [];
            for (const car of n) {
                if (isRunning(car)) {
                    runningCars.push(car);
                    t[car.id] = []; // init structured perCarId states storage
                }
            }
            if (runningCars.length == 0) {
                if (AI_endEpisodeDetected) { // All cars are done. Signal training to start
                    console.log("[SIM] All done! Stopping sim and starting training");
                    AI_canRun = false; // pause entire sim loop while cars are doing training
                    AI_endEpisodeDetected = false; // reset trigger to detect false canRun values

                    const carIDs = Object.keys(episodeEndingStates).map(str => Number(str)); // should be 0-99, as numbers

                    postMessage({
                        messageType: Q_.AI_fromSim_episodeEnding,
                        carIDs: carIDs,
                        lastStatesPerId: episodeEndingStates // 19900-19999 of all 100 cars
                    });
                    return;
                } else {
                    throw new Error("AI_canRun was set to true, but no (valid) cars exist, and it isn't the end of an episode either. Raw cars: " + n);
                }
            }

            for (const car of runningCars) { // I've switched around the order of the 'for cars' and 'for i < 100'
                const shouldRandomize = Math.random() < 0.5; // 50% chance of random controls lasting 1 frame
                const startOfEpoch = car.model.getTime().numberOfFrames; // 700, instead of somewhere random in 700-799. Start of the 100-batch for this prediction
                const frameToRandomizeAt = startOfEpoch + Math.floor(Math.random() * 99) + 1; // int 1-99, not 0-100, then add start frame of this sim batch
                const pickLeft = Math.random() < 0.5; // 50% chance of toggling the left key instead of right key
                const holdingTime = 1; // hold randomized control for 1ms
                // Grab current baseline active controls so restoreControlsTo is never undefined
                let restoreControlsTo = { ...car.model.controls }; // edited whenever new inputs come in

                // a loop of 100 means it will simulate 100ms ingame and then wait for new controls. = 10 actions per second
                // The sim will also only parse controls of 0-99, while frame is already at 1-100
                for (let e = 0; e < 100; e++) { // you can run EXTREMELY fast stuff by not relying on setInterval and instead doing a 'for'
                    if (car.model.hasFinished()) break; // completely exit this car
                    if (!car.model.hasStarted()) continue;

                    // a(e) also steps the sim and gives state info (unless we pass 'false' to it to not step, custom)
                    const currentTime = car.model.getTime(); // Will always be 1 less than the final state as it hasn't stepped yet.
                    const currentFrame = currentTime.numberOfFrames;
                    if (
                        currentFrame < Sh.maxFrames && // "bh.maxFrames = 5999999;" = checking if sim has lasted less than 99.9 minutes
                        currentTime.lessThan(car.targetSimulationTime) &&
                        !car.isPaused
                    ) {
                        if (currentFrame == 0) {
                            if (car.firstActionTaken === undefined) { // custom field, let sim not play until AI has taken its first choice, only then start stepping
                                const startState = a(car, false); // add a single state without stepping the game
                                // Because the frames won't be stepped yet, this car will be at numberOfFrames = 0 for the rest of the 100 loops.
                                // This means t will be filled with 100 states where the model is just standing still.
                                t[car.id].push(startState);
                                continue; // skip over this car
                            } // because we skipped, the delete statement is actually in the 'else'. Now we've already had a first action

                            // The block after this frame=0 check actually step the car, because we didn't 'continue;'
                            delete car.firstActionTaken; // Because frame>0 right after this, this field is useless now
                        }
                        if (shouldRandomize && restoreControlsTo) {
                            if (currentFrame === frameToRandomizeAt + holdingTime) { // 1 frame after it has randomized
                                car.userControls.push({ // revert the controls
                                    ...restoreControlsTo,
                                    frame: currentFrame // current frame ('167'). Overwrites restoreControlsTo.frame
                                });
                            }
                            if (currentFrame === frameToRandomizeAt) { // on the frame it should randomize at
                                const controls = {
                                    ...restoreControlsTo,
                                    frame: currentFrame // current frame ('166')
                                };
                                
                                if (pickLeft) controls.left = !controls.left; // invert left
                                else controls.right = !controls.right; // invert right

                                car.userControls.push(controls);
                            }
                        }

                        if (car.userControls != null) { // list of queued controls
                            // Will loop until the first control is on this frame, throwing away all previous controls, while being O(n) filter
                            while (car.userControls.length > 0 && car.userControls[0].frame <= currentFrame) {
                                const t = car.userControls.shift(); // removes first element and sets 't' to the removed element
                                if (t != null) {
                                    const n = car.model.controls;
                                    n.up = t.up;
                                    n.right = t.right;
                                    n.down = t.down;
                                    n.left = t.left;
                                    n.reset = t.reset;

                                    if (shouldRandomize && currentFrame < frameToRandomizeAt) { // as long as it's before the randomize frame
                                        restoreControlsTo = { ...t }; // store our last controls
                                    }

                                    const carID = car.id;
                                    if (!inputsPerCar[carID]) inputsPerCar[carID] = []; // init for tracking inputs
                                    inputsPerCar[carID].push(t); // this also has frame number in it
                                }
                            }
                        }

                        const newState = a(car); // auto steps by 1 frame
                        t[car.id].push(newState);
                    }
                }
            }

            let stillRunningCount = 0;
            for (const car of runningCars) { // only of the cars we just processed
                if (isRunning(car)) {
                    stillRunningCount++;
                } else { // car has finished or ran out of time
                    const states = t[car.id];
                    if (states.length == 1) states.push(states[0]); // always ensure secondLastState is defined, have length=2

                    episodeEndingStates[car.id] = states; // add 100 last frames to that finished episode

                    const lastState = states[states.length - 1];
                    lastState.done = true;
                }
            }
            if (stillRunningCount == 0) AI_endEpisodeDetected = true;
            // Training is only done in the next loop. For now, just ask for new actions so even expired cars are seen by training_worker.js
            // so AI can populate their nextAgentState/reward too. (Was already fixed for only finished cars, but expiry happens all at once)

            AI_canRun = false; // pause entire sim loop while cars are doing prediction
            postMessage({
                messageType: Q_.AI_fromSim_controlsrequested,
                statesPerId: t // includes cars that have just finished! This ensures predictBatch
            });
        }

        function isRunning(car) {
            const currentTime = car.model.getTime();
            // Not finished yet and timer still hasn't reached target time (20s) nor max time (100m)
            if (
                !car.model.hasFinished()
                && currentTime.numberOfFrames < Sh.maxFrames // kinda useless cus targetSimulationTime is always way below 100m
                && currentTime.lessThan(car.targetSimulationTime)
            ) { return true; }
            
            return false;
        }

    })();

});









function getTrackParts(recalculatePhysicsVertices, callback) {
    if (recalculatePhysicsVertices) {
        addSharedEventListener("onTrackpartsCalculatorReady", (vB, eU) => {
            // docs:

            //const trackPartsClass = new eU;
            //h = new eU
            //d = h.init(c, t)
            //const c = new ju(l, o); // entire renderer and scene so init can use addMaterial.
            // But that's too complicated, so I just commented that out. So now don't pass anything
            //const t = new vB; // progress
            //trackPartsClass.init("blabla", t); // pass only second param
            //const physicsParts = trackPartsClass.getPhysicsParts();
            // new eU is what makes t for yz which makes t.getPhysicsParts()

            const t = new vB; // loader progress
            const trackPartsClass = new eU;
            const d = trackPartsClass.init("render scene here but is useless", t);

            const progressInterval = setInterval(() => {
                if (t.getProgress() == 1) {
                    clearInterval(progressInterval);
                    const physicsParts = trackPartsClass.getPhysicsParts();
                    callback(physicsParts); // pass back
                }
            }, 10);
        });
        loadScript("trackparts_calculator.js", () => { });
    } else {
        addSharedEventListener("onTrackpartsHardcodedReady", (physicsParts) => {
            callback(physicsParts);
        });
        loadScript("trackparts_hardcoded.js", () => { });
    }
}

function loadScript(src, callback) {
    const script = document.createElement('script');
    script.src = src;
    script.onload = () => {
        callback();
    };
    script.onerror = () => {
        console.error(`Failed to load script ${src}`);
    };
    document.head.appendChild(script);
}



// I want 100 cars running (in parallel?) at realtime speed or preferably higher. Each car gets stepped 100 times to simulate 100ms, then pauses the car to allow it to take an action (10Hz, sim is currently set to max 20s). Sim is 1000Hz. For 100 cars to be realtime, this means 10K steps per real 100ms or 100K steps per real second. However I'd like it to be even faster.
// Requirements: sim must stay completely deterministic, that's all. Current issues unrelated to stepping might be that it's waiting for the training_worker.js to give an action prediction. I've also noticed CPU is always like 15%, sometimes a bit lower. 'APPO' algorithm (Asynchronous PPO) is the end goal. I'm not sure if I should step all cars at same time, then batch predict everything, then train all, then respawn all at same time, or should I just randomly spawn cars so it's always doing something
// Main thread is full_simulation.bundle.js (the sim), simulation_communicator.js (the AI() func and what calls steps and gets states), ai_environment.js (makes reward, observations, and talks to worker). Worker thread is only training_worker.js, it hosts the 2 AI models and runs any .predict needed and also does training. A very annoying problem is that the worker has no line-per-line performance profiling via chrome, only like a chart result - main thread does have lineperline.

// Current benchmarks:
// - total inference (200 steps) with 100 cars spawned at random time offsets takes 124 seconds.
// - training varies a lot between 800-1600ms, but average at 900ms for 16 epochs and 32minibatchsize.
// - each predict action callback also varies a lot between 120-190ms, but sometimes I see big batches at ~900-1800ms, possibly because another car is training at that time?
// - When spawning only 10 cars at around the same time, predicts take about 12-18ms, inference being 5.2s, but the moment one starts training predicts skyrocket to 2000ms for many cars, and in the end when loops are stabilized inference takes 12.6s
// - 10 cars with 500ms offset training takes about 800ms but when another one is also training it skyrockets to twice or triple the duration. Predict skyrocketing has same problem. Inference also 12.5s.
// - Single car, predict between 1-3ms, inference around 1.2s, training around 850ms too, but obviously no peaks because it's the only car.

// APPO (asynchronous?):
// tfjs. well currently my sim has multiple cars with some time offset, each one pauses the car every 100ms and asks a separate worker thread that hosts a single policy/critic network to predict actions. Then when the car runs out of time it trains the policy. However stale gradients are a massive problem for me
// Car is highly encouraged to find the fastest route, any shortcut is allowed as long as the checkpoints are all gathered in order, and then finish is reached. I have progress points by a random player run on the track to measure nearest progress point within one checkpoint segment so AI can maximize progress rate, that's why I won't be telling it much what to do. Discrete actions, 12 key combinations as categorical sampler output, but inputs are continious

// Good idea: all cars are synchronous, and only send over one packet of the lastState of all cars, where a single .predict call is done on all cars, keeping everything synchronous. No stale gradients, and much much faster. Training is only a single call, and all cars are always waiting on each other.