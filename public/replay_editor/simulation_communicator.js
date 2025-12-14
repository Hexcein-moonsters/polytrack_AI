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


const lw = [];
onmessage = e => {
    lw.push(e)
}
setShared("postToWorker", (e) => { onmessage({ data: e }) }); // append 'data'
function postMessage(e) { // worker -> main thread
    getShared("onWorkerMessage")(e);
}


addSharedEventListener("onAmmoLoaded", () => {
    // if shouldrecalculate is false, it will take 200ms, otherwise 900ms
    getTrackParts(should_recalculatePhysicsVertices, (physicsParts) => {
        // this starts running the simulation forever, either as fast as possible or at 60fps
        const isRealtime = false; // you can modify this, but I suggest leaving at false so you receive tens of thousands of states per second
        if (isRealtime) console.log("Sending Init for loop, with isRealTime enabled");
        else console.log("Sending Init for loop, with isRealTime disabled (=fastest)");
        postToWorker({
            messageType: Q_.Init,
            isRealtime: isRealtime,
            trackParts: physicsParts
        }); // post to self
    });


    // code after the getTracksPart will execute immediately without waiting, but we need that as we need communication Init to be ready
    const Q_ = getShared("Q_");
    const V_ = getShared("V_");

    const simfuncs = getShared("simfuncs");
    Object.assign(globalThis, simfuncs); // this will auto define Zt, Kt.. in this scope so Zt() works

    // Q: "Could I have messed up the switch-case or function wrapping?""
    // A: Note to self: you must use 'break' in or after the '}(e);', otherwise case will incorrectly continue!

    (() => {
        let t = new V_([]);
        const n = [];
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
                            r = new sw, // creating an empty recording buffer that you can add your own inputs to
                                a = [];
                        else {
                            const e = Sh.deserialize(s);
                            if (null == e)
                                throw new Error("Failed to deserialize recording");
                            r = new Y_(e) // load an inputs map from existing recording
                        }
                        const o = i.getStartTransform(); // track start point
                        if (null == o)
                            throw new Error("Track has no starting point");
                        const l = e.data.carId // for 'S_ = class' I wrote what it does in full_simulation_bundle.js
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
                case Q_.DeleteCar:
                    !function (e) {
                        const t = e.data.carId;
                        for (let e = 0; e < n.length; e++) {
                            const i = n[e];
                            if (i.id == t) {
                                i.model.controls.dispose(),
                                    i.model.dispose(),
                                    n.splice(e, 1);
                                break
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

                                i.requestId = e.data.requestId; // custom property
                                break
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
                    }(e);
                    break;


                case Q_.makeRecordingString:
                    !function (e) {
                        const inputs = e.data.inputs;

                        //console.log("Inputs:", inputs);

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
                        //console.log(replayMaker);
                        const recording = replayMaker.serialize();
                        //console.log("Made replay string: " + recording);

                        postMessage({
                            messageType: Q_.recordingStringResult,
                            requestId: e.data.requestId,
                            recording: recording
                        });
                    }(e);
                    break;
                case Q_.getControlsFromRecording:
                    !function (e) {
                        const recording = e.data.recordingString;
                        const frameCount = e.data.frameCount;

                        // DONT USE 'new Sh', only 'Sh'!! Static obj
                        //const replayMaker = Sh;
                        const deserialize = Sh.deserialize;

                        const deserialized = deserialize(recording);

                        let deltaControls = [];
                        let lastControlsStr = {};
                        for (let i = 0; i < frameCount; i++) {
                            const controls = deserialized.getFrame(i);
                            const controlsStr = JSON.stringify(controls);

                            if (controlsStr == lastControlsStr) {
                                // Do nothing
                            } else {
                                lastControlsStr = controlsStr;
                                deltaControls.push({
                                    ...controls, // spread copy
                                    frame: i
                                });
                            }
                        }
                        //console.log(deltaControls);

                        postMessage({
                            messageType: Q_.controlsResult,
                            requestId: e.data.requestId,
                            controls: deltaControls
                        });
                    }(e);
                    break;
            }
        }
        for (const e of lw)
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
        function a(e) {
            var t, n;
            const i = e.id
                , r = e.model
                , a = r.controls.getControls(r.getTime().numberOfFrames);
            r.step();
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
        let lastTenStates = [];
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
                                if (e.model.getTime().numberOfFrames < Sh.maxFrames && e.model.getTime().lessThan(e.targetSimulationTime) && !e.isPaused) { // line changed
                                    t.push(a(e)); // the format of these lines has been modified
                                    i = !1;
                                    t[t.length - 1].requestId = e.requestId; // custom code

                                    // custom block here. Constantly add latest frames
                                    // t's added items will be in such an order that lastTenStates[lastIndex] will be actual last frame
                                    lastTenStates = [...lastTenStates, ...t]; // add previous states and current states
                                    if (lastTenStates.length > 10) {
                                        lastTenStates = lastTenStates.slice(-10); // only last 10
                                    }
                                } else { // custom code in this block
                                    // We must not use any code that delays c(), otherwise 'i' will be true to stop
                                    // That's why we're sending stuff to handle in the next operation, not now
                                    // This means car won't be deleted for like 2 frames or something. But it doesn't lag ur pc
                                    onmessage({ // Send to ourself! Async operation
                                        data: {
                                            messageType: Q_.DeleteCar,
                                            carId: e.id
                                        }
                                    });

                                    // Also notify our main.
                                    const carId = e.id;
                                    let lastFrameOfCar;
                                    for (const frame of lastTenStates) {
                                        if (frame.id == carId) { // is this state from our car
                                            lastFrameOfCar = frame; // try to get the very last frame that is still ours
                                        }
                                    }
                                    postMessage({
                                        messageType: Q_.finishExpired,
                                        requestId: e.requestId,
                                        lastState: lastFrameOfCar
                                    });
                                }
                            }
                        if (i)
                            break
                    }
                } while (Math.max(0, performance.now() - e) / 1e3 < .01 && !i)
            }
            if (t.length < 1) return;
            postMessage({
                messageType: Q_.UpdateResult,
                carStates: t
            })
        }

    })();

});









function getTrackParts(recalculatePhysicsVertices, callback) {
    if (recalculatePhysicsVertices) {
        setShared("onTrackpartsCalculatorReady", (vB, eU) => {
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
        setShared("onTrackpartsHardcodedReady", (physicsParts) => {
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