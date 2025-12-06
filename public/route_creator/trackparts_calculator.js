// class eU is most important, along with vB for progress
// there's an 'onTrackpartsCalculatorReady' at the end


(() => {

    class eU {
        constructor() {
            KB.add(this), qB.set(this, new Map()), YB.set(this, new Map());
        }
        init(e, t) {
            return JB(this, void 0, void 0, function* () {
                const n = new Al(),
                    i = new jB();
                i.setDecoderPath("/assets/lib/draco/"), n.setDRACOLoader(i);
                const r =
                    ((a = [
                        "/assets/models/blocks.glb",
                        "/assets/models/pillar.glb",
                        "/assets/models/planes.glb",
                        "/assets/models/road.glb",
                        "/assets/models/road_wide.glb",
                        "/assets/models/signs.glb",
                        "/assets/models/wall_track.glb",
                    ]),
                        Promise.all(
                            a.map((e) => {
                                return (
                                    (t = e),
                                    new Promise((e) => {
                                        n.load(t, (t) => {
                                            e(t);
                                        });
                                    })
                                );
                                var t;
                            })
                        ));
                var a;
                const s = new Ws({ vertexColors: !0 });
                //e.addMaterial(s);
                const o = (e) =>
                    JB(this, void 0, void 0, function* () {
                        var n, i, a;
                        if ((t.addResource(), $B(this, qB, "f").has(e.id)))
                            throw new Error("Track part types have same Id");
                        const o = {
                            configuration: e,
                            colors: new Map(e.colors.map(({ id: e }) => [e, null])),
                            physicsShapeVertices: null,
                        };
                        $B(this, qB, "f").set(e.id, o);
                        const l = yield r;
                        function c(e, t, n, i, r, a) {
                            const s = l.find((t) => t.scene.name == e);
                            if (null == s)
                                throw new Error('Scene "' + e + '" does not exist');
                            const o = s.scene.getObjectByName(t);
                            if (null == o)
                                throw new Error(
                                    'Mesh "' + t + '" does not exist in scene "' + e + '"'
                                );
                            let c;
                            if (0 == o.children.length) {
                                const e = o,
                                    t = h(e, a);
                                e.updateMatrixWorld(!0),
                                    t.applyMatrix4(e.matrix),
                                    (c = [t]);
                            } else {
                                (c = o.children.map((e) => h(e, a))),
                                    o.updateMatrixWorld(!0);
                                for (const e of c) e.applyMatrix4(o.matrix);
                            }
                            let d = -1 / 0;
                            if (i)
                                for (const e of c)
                                    for (
                                        let t = 0;
                                        t < e.attributes.position.array.length;
                                        t += 3
                                    )
                                        d = Math.max(d, e.attributes.position.array[t + 1]);
                            for (const e of c) {
                                if (
                                    (e.applyMatrix4(
                                        new Xn().makeScale(n ? -1 : 1, i ? -1 : 1, r ? -1 : 1)
                                    ),
                                        n || i || r)
                                ) {
                                    const t = e.index;
                                    if (null != t)
                                        for (let e = 0; e < t.count; e += 3) {
                                            const n = t.getX(e),
                                                i = t.getX(e + 1),
                                                r = t.getX(e + 2);
                                            t.setXYZ(e, n, r, i);
                                        }
                                    else {
                                        const t = e.attributes.position;
                                        for (let e = 0; e < t.count; e += 3) {
                                            const n = e,
                                                i = e + 1,
                                                r = e + 2,
                                                a = t.getX(n),
                                                s = t.getY(n),
                                                o = t.getZ(n),
                                                l = t.getX(i),
                                                c = t.getY(i),
                                                h = t.getZ(i),
                                                d = t.getX(r),
                                                u = t.getY(r),
                                                p = t.getZ(r);
                                            t.setXYZ(n, a, s, o),
                                                t.setXYZ(i, d, u, p),
                                                t.setXYZ(r, l, c, h);
                                        }
                                    }
                                }
                                i && e.translate(0, d, 0);
                            }
                            return c;
                        }
                        function h(e, t) {
                            const n = e.material;
                            if (!(n instanceof Os))
                                throw new Error("Material is not a MeshStandardMaterial");
                            let i, r, a;
                            if (Object.prototype.hasOwnProperty.call(t, n.name)) {
                                const e = new Hi(t[n.name]);
                                (i = e.r), (r = e.g), (a = e.b);
                            } else (i = n.color.r), (r = n.color.g), (a = n.color.b);
                            const s = e.geometry.clone(),
                                o = new Float32Array(s.attributes.position.array.length);
                            for (let e = 0; e < o.length; e += 3)
                                (o[e + 0] = i), (o[e + 1] = r), (o[e + 2] = a);
                            return (s.attributes.color = new Xi(o, 3)), s;
                        }
                        let d = null;
                        for (const t of e.colors) {
                            const r = [];
                            for (const [s, o, l] of e.models) {
                                const e = c(
                                    s,
                                    o,
                                    null !== (n = null == l ? void 0 : l.flipX) &&
                                    void 0 !== n &&
                                    n,
                                    null !== (i = null == l ? void 0 : l.flipY) &&
                                    void 0 !== i &&
                                    i,
                                    null !== (a = null == l ? void 0 : l.flipZ) &&
                                    void 0 !== a &&
                                    a,
                                    t.colors
                                );
                                for (const t of e) r.push(t);
                            }
                            const l = vl(r, !0).toNonIndexed();
                            l.computeVertexNormals();
                            const h = yl(l),
                                u = new yr(h, s);
                            o.colors.set(t.id, u), null != d || (d = l);
                        }
                        if (null == d) throw new Error("Physics geometry is missing");
                        if (!(d.attributes.position instanceof Xi))
                            throw new Error("Vertices must use BufferAttribute");
                        (o.physicsShapeVertices = new Float32Array(
                            d.attributes.position.array
                        )),
                            t.loadedResource();
                    }),
                    l = yield Promise.all(VA.map((e) => o(e))).then(() =>
                        JB(this, void 0, void 0, function* () {
                            return yield $B(this, KB, "m", ZB).call(this);
                        })
                    ),
                    c = (e, t, n = null) => {
                        let i = $B(this, YB, "f").get(e);
                        null == i && ((i = new Map()), $B(this, YB, "f").set(e, i)),
                            null == n &&
                            (n = (e, t) =>
                                e.x == t.x &&
                                e.y == t.y &&
                                e.z == t.z &&
                                e.rotation == t.rotation &&
                                e.rotationAxis == t.rotationAxis),
                            i.set(t, n);
                    };
                c(Sb.BlockSlopeUp, Sb.SlopeUp),
                    c(Sb.BlockSlopeUp, Sb.SlopeUpLeftWide),
                    c(Sb.BlockSlopeUp, Sb.SlopeUpRightWide),
                    c(Sb.BlockSlopeUp, Sb.PlaneSlopeUp),
                    c(Sb.BlockSlopedUp, Sb.Slope),
                    c(Sb.BlockSlopedUp, Sb.SlopeLeftWide),
                    c(Sb.BlockSlopedUp, Sb.SlopeRightWide),
                    c(Sb.BlockSlopedUp, Sb.PlaneSlope),
                    c(Sb.BlockSlopeDown, Sb.SlopeDown),
                    c(Sb.BlockSlopeDown, Sb.SlopeDownLeftWide),
                    c(Sb.BlockSlopeDown, Sb.SlopeDownRightWide),
                    c(Sb.BlockSlopeDown, Sb.PlaneSlopeDown),
                    c(Sb.BlockSlopeDownLong, Sb.SlopeDownLong),
                    c(Sb.BlockSlopeDownLong, Sb.SlopeDownLongLeftWide),
                    c(Sb.BlockSlopeDownLong, Sb.SlopeDownLongRightWide),
                    c(Sb.BlockSlopeDownLong, Sb.PlaneSlopeDownLong),
                    c(Sb.BlockSlopeUpLong, Sb.SlopeUpLong),
                    c(Sb.BlockSlopeUpLong, Sb.SlopeUpLongLeftWide),
                    c(Sb.BlockSlopeUpLong, Sb.SlopeUpLongRightWide),
                    c(Sb.BlockSlopeUpLong, Sb.PlaneSlopeUpLong),
                    c(Sb.BlockSlopeVerticalTop, Sb.WallTrackTop),
                    c(
                        Sb.BlockSlopeVerticalInnerCornerTop,
                        Sb.WallTrackTopInnerCorner
                    ),
                    c(
                        Sb.BlockSlopeVerticalInnerCornerBottom,
                        Sb.WallTrackBottomInnerCorner
                    ),
                    c(Sb.BlockInnerCorner, Sb.WallTrackMiddleCorner);
                const h = (e, t) =>
                    (e.x == t.x &&
                        e.y == t.y &&
                        e.z == t.z &&
                        e.rotation == t.rotation &&
                        e.rotationAxis == t.rotationAxis) ||
                    (e.x == t.x &&
                        e.y == t.y + 3 &&
                        e.z == t.z &&
                        e.rotation == t.rotation &&
                        ((e.rotationAxis == _b.YPositive &&
                            t.rotationAxis == _b.YNegative) ||
                            (e.rotationAxis == _b.YNegative &&
                                t.rotationAxis == _b.YPositive) ||
                            (e.rotationAxis == _b.XPositive &&
                                t.rotationAxis == _b.XNegative) ||
                            (e.rotationAxis == _b.XNegative &&
                                t.rotationAxis == _b.XPositive) ||
                            (e.rotationAxis == _b.ZPositive &&
                                t.rotationAxis == _b.ZNegative) ||
                            (e.rotationAxis == _b.ZNegative &&
                                t.rotationAxis == _b.ZPositive)));
                return (
                    c(Sb.BlockSlopeVerticalBottom, Sb.PlaneSlopeVerticalBottom, h),
                    c(Sb.BlockSlopeVerticalBottom, Sb.WallTrackBottom, h),
                    c(Sb.BlockSlopeVerticalBottom, Sb.SlopeUpVertical, h),
                    c(Sb.BlockSlopeVerticalBottom, Sb.SlopeUpVerticalLeftWide, h),
                    c(Sb.BlockSlopeVerticalBottom, Sb.SlopeUpVerticalRightWide, h),
                    c(Sb.BlockSlopeVerticalCornerBottom, Sb.WallTrackBottomCorner),
                    c(Sb.BlockSlopeVerticalCornerTop, Sb.WallTrackTopCorner),
                    c(Sb.BlockSlopeToVertical, Sb.PlaneSlopeToVertical),
                    c(Sb.BlockSlopeToVertical, Sb.WallTrackSlopeToVertical),
                    c(
                        Sb.HalfBlock,
                        Sb.HalfBlock,
                        (e, t) =>
                            e.rotation == (t.rotation + 2) % 4 &&
                            e.x == t.x &&
                            e.y == t.y &&
                            e.z == t.z &&
                            e.rotationAxis == t.rotationAxis
                    ),
                    c(
                        Sb.HalfBlock,
                        Sb.HalfPlane,
                        (e, t) =>
                            e.rotation == (t.rotation + 2) % 4 &&
                            e.x == t.x &&
                            e.y == t.y &&
                            e.z == t.z &&
                            e.rotationAxis == t.rotationAxis
                    ),
                    c(
                        Sb.HalfBlock,
                        Sb.QuarterBlock,
                        (e, t) =>
                            e.rotation != t.rotation &&
                            (e.rotation + 1) % 4 != t.rotation &&
                            e.x == t.x &&
                            e.y == t.y &&
                            e.z == t.z &&
                            e.rotationAxis == t.rotationAxis
                    ),
                    c(
                        Sb.HalfBlock,
                        Sb.QuarterPlane,
                        (e, t) =>
                            e.rotation != t.rotation &&
                            (e.rotation + 1) % 4 != t.rotation &&
                            e.x == t.x &&
                            e.y == t.y &&
                            e.z == t.z &&
                            e.rotationAxis == t.rotationAxis
                    ),
                    c(
                        Sb.QuarterBlock,
                        Sb.QuarterBlock,
                        (e, t) =>
                            e.rotation != t.rotation &&
                            e.x == t.x &&
                            e.y == t.y &&
                            e.z == t.z &&
                            e.rotationAxis == t.rotationAxis
                    ),
                    c(
                        Sb.QuarterBlock,
                        Sb.HalfPlane,
                        (e, t) =>
                            e.rotation != t.rotation &&
                            e.rotation != (t.rotation + 1) % 4 &&
                            e.x == t.x &&
                            e.y == t.y &&
                            e.z == t.z &&
                            e.rotationAxis == t.rotationAxis
                    ),
                    c(
                        Sb.QuarterBlock,
                        Sb.QuarterPlane,
                        (e, t) =>
                            e.rotation != t.rotation &&
                            e.x == t.x &&
                            e.y == t.y &&
                            e.z == t.z &&
                            e.rotationAxis == t.rotationAxis
                    ),
                    c(
                        Sb.HalfPlane,
                        Sb.HalfPlane,
                        (e, t) =>
                            e.rotation == (t.rotation + 2) % 4 &&
                            e.x == t.x &&
                            e.y == t.y &&
                            e.z == t.z &&
                            e.rotationAxis == t.rotationAxis
                    ),
                    c(
                        Sb.HalfPlane,
                        Sb.QuarterPlane,
                        (e, t) =>
                            e.rotation != t.rotation &&
                            (e.rotation + 1) % 4 != t.rotation &&
                            e.x == t.x &&
                            e.y == t.y &&
                            e.z == t.z &&
                            e.rotationAxis == t.rotationAxis
                    ),
                    c(
                        Sb.QuarterPlane,
                        Sb.QuarterPlane,
                        (e, t) =>
                            e.rotation != t.rotation &&
                            e.x == t.x &&
                            e.y == t.y &&
                            e.z == t.z &&
                            e.rotationAxis == t.rotationAxis
                    ),
                    c(
                        Sb.WallTrackTopInnerCorner,
                        Sb.WallTrackCeilingCorner,
                        (e, t) => {
                            let n;
                            switch (e.rotationAxis) {
                                case _b.YPositive:
                                    n = new bn(0, 1, 0);
                                    break;
                                case _b.YNegative:
                                    n = new bn(0, -1, 0);
                                    break;
                                case _b.XPositive:
                                    n = new bn(1, 0, 0);
                                    break;
                                case _b.XNegative:
                                    n = new bn(-1, 0, 0);
                                    break;
                                case _b.ZPositive:
                                    n = new bn(0, 0, 1);
                                    break;
                                case _b.ZNegative:
                                    n = new bn(0, 0, -1);
                                    break;
                                default:
                                    throw new Error("Invalid rotation axis");
                            }
                            return (
                                e.rotation == t.rotation &&
                                e.x + 3 * n.x == t.x &&
                                e.y + 3 * n.y == t.y &&
                                e.z + 3 * n.z == t.z &&
                                e.rotationAxis == t.rotationAxis
                            );
                        }
                    ),
                    c(
                        Sb.WallTrackTopInnerCorner,
                        Sb.WallTrackCeilingPlaneCorner,
                        (e, t) => {
                            let n;
                            switch (e.rotationAxis) {
                                case _b.YPositive:
                                    n = new bn(0, 1, 0);
                                    break;
                                case _b.YNegative:
                                    n = new bn(0, -1, 0);
                                    break;
                                case _b.XPositive:
                                    n = new bn(1, 0, 0);
                                    break;
                                case _b.XNegative:
                                    n = new bn(-1, 0, 0);
                                    break;
                                case _b.ZPositive:
                                    n = new bn(0, 0, 1);
                                    break;
                                case _b.ZNegative:
                                    n = new bn(0, 0, -1);
                                    break;
                                default:
                                    throw new Error("Invalid rotation axis");
                            }
                            return (
                                e.rotation == t.rotation &&
                                e.x + 3 * n.x == t.x &&
                                e.y + 3 * n.y == t.y &&
                                e.z + 3 * n.z == t.z &&
                                e.rotationAxis == t.rotationAxis
                            );
                        }
                    ),
                    c(Sb.WallTrackBottomInnerCorner, Sb.WallTrackFloorCorner),
                    c(Sb.WallTrackBottomInnerCorner, Sb.WallTrackFloorPlaneCorner),
                    l
                );
            });
        }
        isPartCombinationAllowed(e, t) {
            const n = $B(this, KB, "m", XB).call(this, e.id, t.id);
            if (null == n ? void 0 : n(e, t)) return !0;
            const i = $B(this, KB, "m", XB).call(this, t.id, e.id);
            return !!(null == i ? void 0 : i(t, e));
        }
        getPhysicsParts() {
            var e, t;
            const n = [];
            for (const { configuration: i, physicsShapeVertices: r } of $B(
                this,
                qB,
                "f"
            ).values()) {
                if (null == r)
                    throw new Error("Part model has not been loaded yet");
                n.push({
                    id: i.id,
                    vertices: r,
                    detector: i.detector,
                    startOffset:
                        null !==
                            (t =
                                null === (e = i.startOffset) || void 0 === e
                                    ? void 0
                                    : e.toArray()) && void 0 !== t
                            ? t
                            : null,
                });
            }
            return n;
        }
        hasPart(e) {
            return $B(this, qB, "f").has(e);
        }
        getPart(e) {
            const t = $B(this, qB, "f").get(e);
            if (null == t)
                throw new Error(
                    'Track part with the id "' + e.toString() + '" does not exist'
                );
            return t;
        }
        getAllParts() {
            return Array.from($B(this, qB, "f").values());
        }
        getPartStartOffset(e) {
            var t, n;
            const i = $B(this, qB, "f").get(e);
            if (null == i)
                throw new Error(
                    'Track part with the id "' + e.toString() + '" does not exist'
                );
            return null !==
                (n =
                    null === (t = i.configuration.startOffset) || void 0 === t
                        ? void 0
                        : t.clone()) && void 0 !== n
                ? n
                : null;
        }
        getPartTypesWithDetector(e) {
            const t = [];
            for (const [n, i] of $B(this, qB, "f").entries())
                null != i.configuration.detector &&
                    i.configuration.detector.type == e &&
                    t.push(n);
            return t;
        }
        getStartPartTypes() {
            const e = [];
            for (const [t, n] of $B(this, qB, "f").entries())
                null != n.configuration.startOffset && e.push(t);
            return e;
        }
        getCategoryMesh(e, t) {
            let n, i;
            switch (e) {
                case RA.Special:
                    n = this.getPart(Sb.Start);
                    break;
                case RA.Road:
                    n = this.getPart(Sb.Straight);
                    break;
                case RA.RoadTurns:
                    n = this.getPart(Sb.TurnShort);
                    break;
                case RA.RoadWide:
                    n = this.getPart(Sb.OuterCornerWide);
                    break;
                case RA.Plane:
                    n = this.getPart(Sb.Plane);
                    break;
                case RA.Block:
                    n = this.getPart(Sb.Block);
                    break;
                case RA.WallTrack:
                    n = this.getPart(Sb.WallTrackBottom);
                    break;
                case RA.Pillar:
                    n = this.getPart(Sb.PillarShort);
                    break;
                case RA.Sign:
                    n = this.getPart(Sb.SignArrowLeft);
            }
            switch (t) {
                case PA.Summer:
                    i = kb.Summer;
                    break;
                case PA.Winter:
                    i = kb.Winter;
                    break;
                case PA.Desert:
                    i = kb.Desert;
            }
            const r = n.colors.get(i);
            if (null == r) throw new Error("Category mesh is not loaded");
            return r;
        }
    }




    dB = new WeakMap,
        uB = new WeakMap,
        pB = new WeakMap,
        fB = new WeakMap;
    const vB = class {
        constructor() {
            dB.set(this, 0),
                uB.set(this, 0),
                pB.set(this, []),
                fB.set(this, [])
        }
        hasLoaded() {
            return mB(this, uB, "f") == mB(this, dB, "f")
        }
        getProgress() {
            return mB(this, uB, "f") / mB(this, dB, "f")
        }
        addResource() {
            var e;
            gB(this, dB, (e = mB(this, dB, "f"),
                ++e), "f")
        }
        loadedResource() {
            var e;
            gB(this, uB, (e = mB(this, uB, "f"),
                ++e), "f");
            for (const e of mB(this, pB, "f"))
                e(this.getProgress());
            if (this.hasLoaded())
                for (const e of mB(this, fB, "f"))
                    e()
        }
        addProgressListener(e) {
            mB(this, pB, "f").push(e)
        }
        addCompleteListener(e) {
            mB(this, fB, "f").push(e)
        }
        preloadImage(e) {
            this.addResource();
            const t = new Image;
            t.addEventListener("load", (() => {
                this.loadedResource()
            }
            )),
                t.addEventListener("error", (() => {
                    console.error("Failed to preload image: " + e)
                }
                )),
                t.src = e
        }
    };




























































    class bn {
        constructor(e = 0, t = 0, n = 0) {
            bn.prototype.isVector3 = !0,
                this.x = e,
                this.y = t,
                this.z = n
        }
        set(e, t, n) {
            return void 0 === n && (n = this.z),
                this.x = e,
                this.y = t,
                this.z = n,
                this
        }
        setScalar(e) {
            return this.x = e,
                this.y = e,
                this.z = e,
                this
        }
        setX(e) {
            return this.x = e,
                this
        }
        setY(e) {
            return this.y = e,
                this
        }
        setZ(e) {
            return this.z = e,
                this
        }
        setComponent(e, t) {
            switch (e) {
                case 0:
                    this.x = t;
                    break;
                case 1:
                    this.y = t;
                    break;
                case 2:
                    this.z = t;
                    break;
                default:
                    throw new Error("index is out of range: " + e)
            }
            return this
        }
        getComponent(e) {
            switch (e) {
                case 0:
                    return this.x;
                case 1:
                    return this.y;
                case 2:
                    return this.z;
                default:
                    throw new Error("index is out of range: " + e)
            }
        }
        clone() {
            return new this.constructor(this.x, this.y, this.z)
        }
        copy(e) {
            return this.x = e.x,
                this.y = e.y,
                this.z = e.z,
                this
        }
        add(e) {
            return this.x += e.x,
                this.y += e.y,
                this.z += e.z,
                this
        }
        addScalar(e) {
            return this.x += e,
                this.y += e,
                this.z += e,
                this
        }
        addVectors(e, t) {
            return this.x = e.x + t.x,
                this.y = e.y + t.y,
                this.z = e.z + t.z,
                this
        }
        addScaledVector(e, t) {
            return this.x += e.x * t,
                this.y += e.y * t,
                this.z += e.z * t,
                this
        }
        sub(e) {
            return this.x -= e.x,
                this.y -= e.y,
                this.z -= e.z,
                this
        }
        subScalar(e) {
            return this.x -= e,
                this.y -= e,
                this.z -= e,
                this
        }
        subVectors(e, t) {
            return this.x = e.x - t.x,
                this.y = e.y - t.y,
                this.z = e.z - t.z,
                this
        }
        multiply(e) {
            return this.x *= e.x,
                this.y *= e.y,
                this.z *= e.z,
                this
        }
        multiplyScalar(e) {
            return this.x *= e,
                this.y *= e,
                this.z *= e,
                this
        }
        multiplyVectors(e, t) {
            return this.x = e.x * t.x,
                this.y = e.y * t.y,
                this.z = e.z * t.z,
                this
        }
        applyEuler(e) {
            return this.applyQuaternion(xn.setFromEuler(e))
        }
        applyAxisAngle(e, t) {
            return this.applyQuaternion(xn.setFromAxisAngle(e, t))
        }
        applyMatrix3(e) {
            const t = this.x
                , n = this.y
                , i = this.z
                , r = e.elements;
            return this.x = r[0] * t + r[3] * n + r[6] * i,
                this.y = r[1] * t + r[4] * n + r[7] * i,
                this.z = r[2] * t + r[5] * n + r[8] * i,
                this
        }
        applyNormalMatrix(e) {
            return this.applyMatrix3(e).normalize()
        }
        applyMatrix4(e) {
            const t = this.x
                , n = this.y
                , i = this.z
                , r = e.elements
                , a = 1 / (r[3] * t + r[7] * n + r[11] * i + r[15]);
            return this.x = (r[0] * t + r[4] * n + r[8] * i + r[12]) * a,
                this.y = (r[1] * t + r[5] * n + r[9] * i + r[13]) * a,
                this.z = (r[2] * t + r[6] * n + r[10] * i + r[14]) * a,
                this
        }
        applyQuaternion(e) {
            const t = this.x
                , n = this.y
                , i = this.z
                , r = e.x
                , a = e.y
                , s = e.z
                , o = e.w
                , l = 2 * (a * i - s * n)
                , c = 2 * (s * t - r * i)
                , h = 2 * (r * n - a * t);
            return this.x = t + o * l + a * h - s * c,
                this.y = n + o * c + s * l - r * h,
                this.z = i + o * h + r * c - a * l,
                this
        }
        project(e) {
            return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)
        }
        unproject(e) {
            return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)
        }
        transformDirection(e) {
            const t = this.x
                , n = this.y
                , i = this.z
                , r = e.elements;
            return this.x = r[0] * t + r[4] * n + r[8] * i,
                this.y = r[1] * t + r[5] * n + r[9] * i,
                this.z = r[2] * t + r[6] * n + r[10] * i,
                this.normalize()
        }
        divide(e) {
            return this.x /= e.x,
                this.y /= e.y,
                this.z /= e.z,
                this
        }
        divideScalar(e) {
            return this.multiplyScalar(1 / e)
        }
        min(e) {
            return this.x = Math.min(this.x, e.x),
                this.y = Math.min(this.y, e.y),
                this.z = Math.min(this.z, e.z),
                this
        }
        max(e) {
            return this.x = Math.max(this.x, e.x),
                this.y = Math.max(this.y, e.y),
                this.z = Math.max(this.z, e.z),
                this
        }
        clamp(e, t) {
            return this.x = Ft(this.x, e.x, t.x),
                this.y = Ft(this.y, e.y, t.y),
                this.z = Ft(this.z, e.z, t.z),
                this
        }
        clampScalar(e, t) {
            return this.x = Ft(this.x, e, t),
                this.y = Ft(this.y, e, t),
                this.z = Ft(this.z, e, t),
                this
        }
        clampLength(e, t) {
            const n = this.length();
            return this.divideScalar(n || 1).multiplyScalar(Ft(n, e, t))
        }
        floor() {
            return this.x = Math.floor(this.x),
                this.y = Math.floor(this.y),
                this.z = Math.floor(this.z),
                this
        }
        ceil() {
            return this.x = Math.ceil(this.x),
                this.y = Math.ceil(this.y),
                this.z = Math.ceil(this.z),
                this
        }
        round() {
            return this.x = Math.round(this.x),
                this.y = Math.round(this.y),
                this.z = Math.round(this.z),
                this
        }
        roundToZero() {
            return this.x = Math.trunc(this.x),
                this.y = Math.trunc(this.y),
                this.z = Math.trunc(this.z),
                this
        }
        negate() {
            return this.x = -this.x,
                this.y = -this.y,
                this.z = -this.z,
                this
        }
        dot(e) {
            return this.x * e.x + this.y * e.y + this.z * e.z
        }
        lengthSq() {
            return this.x * this.x + this.y * this.y + this.z * this.z
        }
        length() {
            return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z)
        }
        manhattanLength() {
            return Math.abs(this.x) + Math.abs(this.y) + Math.abs(this.z)
        }
        normalize() {
            return this.divideScalar(this.length() || 1)
        }
        setLength(e) {
            return this.normalize().multiplyScalar(e)
        }
        lerp(e, t) {
            return this.x += (e.x - this.x) * t,
                this.y += (e.y - this.y) * t,
                this.z += (e.z - this.z) * t,
                this
        }
        lerpVectors(e, t, n) {
            return this.x = e.x + (t.x - e.x) * n,
                this.y = e.y + (t.y - e.y) * n,
                this.z = e.z + (t.z - e.z) * n,
                this
        }
        cross(e) {
            return this.crossVectors(this, e)
        }
        crossVectors(e, t) {
            const n = e.x
                , i = e.y
                , r = e.z
                , a = t.x
                , s = t.y
                , o = t.z;
            return this.x = i * o - r * s,
                this.y = r * a - n * o,
                this.z = n * s - i * a,
                this
        }
        projectOnVector(e) {
            const t = e.lengthSq();
            if (0 === t)
                return this.set(0, 0, 0);
            const n = e.dot(this) / t;
            return this.copy(e).multiplyScalar(n)
        }
        projectOnPlane(e) {
            return An.copy(this).projectOnVector(e),
                this.sub(An)
        }
        reflect(e) {
            return this.sub(An.copy(e).multiplyScalar(2 * this.dot(e)))
        }
        angleTo(e) {
            const t = Math.sqrt(this.lengthSq() * e.lengthSq());
            if (0 === t)
                return Math.PI / 2;
            const n = this.dot(e) / t;
            return Math.acos(Ft(n, -1, 1))
        }
        distanceTo(e) {
            return Math.sqrt(this.distanceToSquared(e))
        }
        distanceToSquared(e) {
            const t = this.x - e.x
                , n = this.y - e.y
                , i = this.z - e.z;
            return t * t + n * n + i * i
        }
        manhattanDistanceTo(e) {
            return Math.abs(this.x - e.x) + Math.abs(this.y - e.y) + Math.abs(this.z - e.z)
        }
        setFromSpherical(e) {
            return this.setFromSphericalCoords(e.radius, e.phi, e.theta)
        }
        setFromSphericalCoords(e, t, n) {
            const i = Math.sin(t) * e;
            return this.x = i * Math.sin(n),
                this.y = Math.cos(t) * e,
                this.z = i * Math.cos(n),
                this
        }
        setFromCylindrical(e) {
            return this.setFromCylindricalCoords(e.radius, e.theta, e.y)
        }
        setFromCylindricalCoords(e, t, n) {
            return this.x = e * Math.sin(t),
                this.y = n,
                this.z = e * Math.cos(t),
                this
        }
        setFromMatrixPosition(e) {
            const t = e.elements;
            return this.x = t[12],
                this.y = t[13],
                this.z = t[14],
                this
        }
        setFromMatrixScale(e) {
            const t = this.setFromMatrixColumn(e, 0).length()
                , n = this.setFromMatrixColumn(e, 1).length()
                , i = this.setFromMatrixColumn(e, 2).length();
            return this.x = t,
                this.y = n,
                this.z = i,
                this
        }
        setFromMatrixColumn(e, t) {
            return this.fromArray(e.elements, 4 * t)
        }
        setFromMatrix3Column(e, t) {
            return this.fromArray(e.elements, 3 * t)
        }
        setFromEuler(e) {
            return this.x = e._x,
                this.y = e._y,
                this.z = e._z,
                this
        }
        setFromColor(e) {
            return this.x = e.r,
                this.y = e.g,
                this.z = e.b,
                this
        }
        equals(e) {
            return e.x === this.x && e.y === this.y && e.z === this.z
        }
        fromArray(e, t = 0) {
            return this.x = e[t],
                this.y = e[t + 1],
                this.z = e[t + 2],
                this
        }
        toArray(e = [], t = 0) {
            return e[t] = this.x,
                e[t + 1] = this.y,
                e[t + 2] = this.z,
                e
        }
        fromBufferAttribute(e, t) {
            return this.x = e.getX(t),
                this.y = e.getY(t),
                this.z = e.getZ(t),
                this
        }
        random() {
            return this.x = Math.random(),
                this.y = Math.random(),
                this.z = Math.random(),
                this
        }
        randomDirection() {
            const e = Math.random() * Math.PI * 2
                , t = 2 * Math.random() - 1
                , n = Math.sqrt(1 - t * t);
            return this.x = n * Math.cos(e),
                this.y = t,
                this.z = n * Math.sin(e),
                this
        }
        *[Symbol.iterator]() {
            yield this.x,
                yield this.y,
                yield this.z
        }
    }

    class yn {
        constructor(e = 0, t = 0, n = 0, i = 1) {
            (this.isQuaternion = !0),
                (this._x = e),
                (this._y = t),
                (this._z = n),
                (this._w = i);
        }
        static slerpFlat(e, t, n, i, r, a, s) {
            let o = n[i + 0],
                l = n[i + 1],
                c = n[i + 2],
                h = n[i + 3];
            const d = r[a + 0],
                u = r[a + 1],
                p = r[a + 2],
                f = r[a + 3];
            if (0 === s)
                return (
                    (e[t + 0] = o),
                    (e[t + 1] = l),
                    (e[t + 2] = c),
                    void (e[t + 3] = h)
                );
            if (1 === s)
                return (
                    (e[t + 0] = d),
                    (e[t + 1] = u),
                    (e[t + 2] = p),
                    void (e[t + 3] = f)
                );
            if (h !== f || o !== d || l !== u || c !== p) {
                let e = 1 - s;
                const t = o * d + l * u + c * p + h * f,
                    n = t >= 0 ? 1 : -1,
                    i = 1 - t * t;
                if (i > Number.EPSILON) {
                    const r = Math.sqrt(i),
                        a = Math.atan2(r, t * n);
                    (e = Math.sin(e * a) / r), (s = Math.sin(s * a) / r);
                }
                const r = s * n;
                if (
                    ((o = o * e + d * r),
                        (l = l * e + u * r),
                        (c = c * e + p * r),
                        (h = h * e + f * r),
                        e === 1 - s)
                ) {
                    const e = 1 / Math.sqrt(o * o + l * l + c * c + h * h);
                    (o *= e), (l *= e), (c *= e), (h *= e);
                }
            }
            (e[t] = o), (e[t + 1] = l), (e[t + 2] = c), (e[t + 3] = h);
        }
        static multiplyQuaternionsFlat(e, t, n, i, r, a) {
            const s = n[i],
                o = n[i + 1],
                l = n[i + 2],
                c = n[i + 3],
                h = r[a],
                d = r[a + 1],
                u = r[a + 2],
                p = r[a + 3];
            return (
                (e[t] = s * p + c * h + o * u - l * d),
                (e[t + 1] = o * p + c * d + l * h - s * u),
                (e[t + 2] = l * p + c * u + s * d - o * h),
                (e[t + 3] = c * p - s * h - o * d - l * u),
                e
            );
        }
        get x() {
            return this._x;
        }
        set x(e) {
            (this._x = e), this._onChangeCallback();
        }
        get y() {
            return this._y;
        }
        set y(e) {
            (this._y = e), this._onChangeCallback();
        }
        get z() {
            return this._z;
        }
        set z(e) {
            (this._z = e), this._onChangeCallback();
        }
        get w() {
            return this._w;
        }
        set w(e) {
            (this._w = e), this._onChangeCallback();
        }
        set(e, t, n, i) {
            return (
                (this._x = e),
                (this._y = t),
                (this._z = n),
                (this._w = i),
                this._onChangeCallback(),
                this
            );
        }
        clone() {
            return new this.constructor(this._x, this._y, this._z, this._w);
        }
        copy(e) {
            return (
                (this._x = e.x),
                (this._y = e.y),
                (this._z = e.z),
                (this._w = e.w),
                this._onChangeCallback(),
                this
            );
        }
        setFromEuler(e, t = !0) {
            const n = e._x,
                i = e._y,
                r = e._z,
                a = e._order,
                s = Math.cos,
                o = Math.sin,
                l = s(n / 2),
                c = s(i / 2),
                h = s(r / 2),
                d = o(n / 2),
                u = o(i / 2),
                p = o(r / 2);
            switch (a) {
                case "XYZ":
                    (this._x = d * c * h + l * u * p),
                        (this._y = l * u * h - d * c * p),
                        (this._z = l * c * p + d * u * h),
                        (this._w = l * c * h - d * u * p);
                    break;
                case "YXZ":
                    (this._x = d * c * h + l * u * p),
                        (this._y = l * u * h - d * c * p),
                        (this._z = l * c * p - d * u * h),
                        (this._w = l * c * h + d * u * p);
                    break;
                case "ZXY":
                    (this._x = d * c * h - l * u * p),
                        (this._y = l * u * h + d * c * p),
                        (this._z = l * c * p + d * u * h),
                        (this._w = l * c * h - d * u * p);
                    break;
                case "ZYX":
                    (this._x = d * c * h - l * u * p),
                        (this._y = l * u * h + d * c * p),
                        (this._z = l * c * p - d * u * h),
                        (this._w = l * c * h + d * u * p);
                    break;
                case "YZX":
                    (this._x = d * c * h + l * u * p),
                        (this._y = l * u * h + d * c * p),
                        (this._z = l * c * p - d * u * h),
                        (this._w = l * c * h - d * u * p);
                    break;
                case "XZY":
                    (this._x = d * c * h - l * u * p),
                        (this._y = l * u * h - d * c * p),
                        (this._z = l * c * p + d * u * h),
                        (this._w = l * c * h + d * u * p);
                    break;
                default:
                    console.warn(
                        "THREE.Quaternion: .setFromEuler() encountered an unknown order: " +
                        a
                    );
            }
            return !0 === t && this._onChangeCallback(), this;
        }
        setFromAxisAngle(e, t) {
            const n = t / 2,
                i = Math.sin(n);
            return (
                (this._x = e.x * i),
                (this._y = e.y * i),
                (this._z = e.z * i),
                (this._w = Math.cos(n)),
                this._onChangeCallback(),
                this
            );
        }
        setFromRotationMatrix(e) {
            const t = e.elements,
                n = t[0],
                i = t[4],
                r = t[8],
                a = t[1],
                s = t[5],
                o = t[9],
                l = t[2],
                c = t[6],
                h = t[10],
                d = n + s + h;
            if (d > 0) {
                const e = 0.5 / Math.sqrt(d + 1);
                (this._w = 0.25 / e),
                    (this._x = (c - o) * e),
                    (this._y = (r - l) * e),
                    (this._z = (a - i) * e);
            } else if (n > s && n > h) {
                const e = 2 * Math.sqrt(1 + n - s - h);
                (this._w = (c - o) / e),
                    (this._x = 0.25 * e),
                    (this._y = (i + a) / e),
                    (this._z = (r + l) / e);
            } else if (s > h) {
                const e = 2 * Math.sqrt(1 + s - n - h);
                (this._w = (r - l) / e),
                    (this._x = (i + a) / e),
                    (this._y = 0.25 * e),
                    (this._z = (o + c) / e);
            } else {
                const e = 2 * Math.sqrt(1 + h - n - s);
                (this._w = (a - i) / e),
                    (this._x = (r + l) / e),
                    (this._y = (o + c) / e),
                    (this._z = 0.25 * e);
            }
            return this._onChangeCallback(), this;
        }
        setFromUnitVectors(e, t) {
            let n = e.dot(t) + 1;
            return (
                n < Number.EPSILON
                    ? ((n = 0),
                        Math.abs(e.x) > Math.abs(e.z)
                            ? ((this._x = -e.y),
                                (this._y = e.x),
                                (this._z = 0),
                                (this._w = n))
                            : ((this._x = 0),
                                (this._y = -e.z),
                                (this._z = e.y),
                                (this._w = n)))
                    : ((this._x = e.y * t.z - e.z * t.y),
                        (this._y = e.z * t.x - e.x * t.z),
                        (this._z = e.x * t.y - e.y * t.x),
                        (this._w = n)),
                this.normalize()
            );
        }
        angleTo(e) {
            return 2 * Math.acos(Math.abs(Ft(this.dot(e), -1, 1)));
        }
        rotateTowards(e, t) {
            const n = this.angleTo(e);
            if (0 === n) return this;
            const i = Math.min(1, t / n);
            return this.slerp(e, i), this;
        }
        identity() {
            return this.set(0, 0, 0, 1);
        }
        invert() {
            return this.conjugate();
        }
        conjugate() {
            return (
                (this._x *= -1),
                (this._y *= -1),
                (this._z *= -1),
                this._onChangeCallback(),
                this
            );
        }
        dot(e) {
            return (
                this._x * e._x + this._y * e._y + this._z * e._z + this._w * e._w
            );
        }
        lengthSq() {
            return (
                this._x * this._x +
                this._y * this._y +
                this._z * this._z +
                this._w * this._w
            );
        }
        length() {
            return Math.sqrt(
                this._x * this._x +
                this._y * this._y +
                this._z * this._z +
                this._w * this._w
            );
        }
        normalize() {
            let e = this.length();
            return (
                0 === e
                    ? ((this._x = 0), (this._y = 0), (this._z = 0), (this._w = 1))
                    : ((e = 1 / e),
                        (this._x = this._x * e),
                        (this._y = this._y * e),
                        (this._z = this._z * e),
                        (this._w = this._w * e)),
                this._onChangeCallback(),
                this
            );
        }
        multiply(e) {
            return this.multiplyQuaternions(this, e);
        }
        premultiply(e) {
            return this.multiplyQuaternions(e, this);
        }
        multiplyQuaternions(e, t) {
            const n = e._x,
                i = e._y,
                r = e._z,
                a = e._w,
                s = t._x,
                o = t._y,
                l = t._z,
                c = t._w;
            return (
                (this._x = n * c + a * s + i * l - r * o),
                (this._y = i * c + a * o + r * s - n * l),
                (this._z = r * c + a * l + n * o - i * s),
                (this._w = a * c - n * s - i * o - r * l),
                this._onChangeCallback(),
                this
            );
        }
        slerp(e, t) {
            if (0 === t) return this;
            if (1 === t) return this.copy(e);
            const n = this._x,
                i = this._y,
                r = this._z,
                a = this._w;
            let s = a * e._w + n * e._x + i * e._y + r * e._z;
            if (
                (s < 0
                    ? ((this._w = -e._w),
                        (this._x = -e._x),
                        (this._y = -e._y),
                        (this._z = -e._z),
                        (s = -s))
                    : this.copy(e),
                    s >= 1)
            )
                return (
                    (this._w = a), (this._x = n), (this._y = i), (this._z = r), this
                );
            const o = 1 - s * s;
            if (o <= Number.EPSILON) {
                const e = 1 - t;
                return (
                    (this._w = e * a + t * this._w),
                    (this._x = e * n + t * this._x),
                    (this._y = e * i + t * this._y),
                    (this._z = e * r + t * this._z),
                    this.normalize(),
                    this
                );
            }
            const l = Math.sqrt(o),
                c = Math.atan2(l, s),
                h = Math.sin((1 - t) * c) / l,
                d = Math.sin(t * c) / l;
            return (
                (this._w = a * h + this._w * d),
                (this._x = n * h + this._x * d),
                (this._y = i * h + this._y * d),
                (this._z = r * h + this._z * d),
                this._onChangeCallback(),
                this
            );
        }
        slerpQuaternions(e, t, n) {
            return this.copy(e).slerp(t, n);
        }
        random() {
            const e = 2 * Math.PI * Math.random(),
                t = 2 * Math.PI * Math.random(),
                n = Math.random(),
                i = Math.sqrt(1 - n),
                r = Math.sqrt(n);
            return this.set(
                i * Math.sin(e),
                i * Math.cos(e),
                r * Math.sin(t),
                r * Math.cos(t)
            );
        }
        equals(e) {
            return (
                e._x === this._x &&
                e._y === this._y &&
                e._z === this._z &&
                e._w === this._w
            );
        }
        fromArray(e, t = 0) {
            return (
                (this._x = e[t]),
                (this._y = e[t + 1]),
                (this._z = e[t + 2]),
                (this._w = e[t + 3]),
                this._onChangeCallback(),
                this
            );
        }
        toArray(e = [], t = 0) {
            return (
                (e[t] = this._x),
                (e[t + 1] = this._y),
                (e[t + 2] = this._z),
                (e[t + 3] = this._w),
                e
            );
        }
        fromBufferAttribute(e, t) {
            return (
                (this._x = e.getX(t)),
                (this._y = e.getY(t)),
                (this._z = e.getZ(t)),
                (this._w = e.getW(t)),
                this._onChangeCallback(),
                this
            );
        }
        toJSON() {
            return this.toArray();
        }
        _onChange(e) {
            return (this._onChangeCallback = e), this;
        }
        _onChangeCallback() { }
        *[Symbol.iterator]() {
            yield this._x, yield this._y, yield this._z, yield this._w;
        }
    }

    class Xn {
        constructor(e, t, n, i, r, a, s, o, l, c, h, d, u, p, f, m) {
            (Xn.prototype.isMatrix4 = !0),
                (this.elements = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]),
                void 0 !== e &&
                this.set(e, t, n, i, r, a, s, o, l, c, h, d, u, p, f, m);
        }
        set(e, t, n, i, r, a, s, o, l, c, h, d, u, p, f, m) {
            const g = this.elements;
            return (
                (g[0] = e),
                (g[4] = t),
                (g[8] = n),
                (g[12] = i),
                (g[1] = r),
                (g[5] = a),
                (g[9] = s),
                (g[13] = o),
                (g[2] = l),
                (g[6] = c),
                (g[10] = h),
                (g[14] = d),
                (g[3] = u),
                (g[7] = p),
                (g[11] = f),
                (g[15] = m),
                this
            );
        }
        identity() {
            return this.set(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1), this;
        }
        clone() {
            return new Xn().fromArray(this.elements);
        }
        copy(e) {
            const t = this.elements,
                n = e.elements;
            return (
                (t[0] = n[0]),
                (t[1] = n[1]),
                (t[2] = n[2]),
                (t[3] = n[3]),
                (t[4] = n[4]),
                (t[5] = n[5]),
                (t[6] = n[6]),
                (t[7] = n[7]),
                (t[8] = n[8]),
                (t[9] = n[9]),
                (t[10] = n[10]),
                (t[11] = n[11]),
                (t[12] = n[12]),
                (t[13] = n[13]),
                (t[14] = n[14]),
                (t[15] = n[15]),
                this
            );
        }
        copyPosition(e) {
            const t = this.elements,
                n = e.elements;
            return (t[12] = n[12]), (t[13] = n[13]), (t[14] = n[14]), this;
        }
        setFromMatrix3(e) {
            const t = e.elements;
            return (
                this.set(
                    t[0],
                    t[3],
                    t[6],
                    0,
                    t[1],
                    t[4],
                    t[7],
                    0,
                    t[2],
                    t[5],
                    t[8],
                    0,
                    0,
                    0,
                    0,
                    1
                ),
                this
            );
        }
        extractBasis(e, t, n) {
            return (
                e.setFromMatrixColumn(this, 0),
                t.setFromMatrixColumn(this, 1),
                n.setFromMatrixColumn(this, 2),
                this
            );
        }
        makeBasis(e, t, n) {
            return (
                this.set(
                    e.x,
                    t.x,
                    n.x,
                    0,
                    e.y,
                    t.y,
                    n.y,
                    0,
                    e.z,
                    t.z,
                    n.z,
                    0,
                    0,
                    0,
                    0,
                    1
                ),
                this
            );
        }
        extractRotation(e) {
            const t = this.elements,
                n = e.elements,
                i = 1 / Zn.setFromMatrixColumn(e, 0).length(),
                r = 1 / Zn.setFromMatrixColumn(e, 1).length(),
                a = 1 / Zn.setFromMatrixColumn(e, 2).length();
            return (
                (t[0] = n[0] * i),
                (t[1] = n[1] * i),
                (t[2] = n[2] * i),
                (t[3] = 0),
                (t[4] = n[4] * r),
                (t[5] = n[5] * r),
                (t[6] = n[6] * r),
                (t[7] = 0),
                (t[8] = n[8] * a),
                (t[9] = n[9] * a),
                (t[10] = n[10] * a),
                (t[11] = 0),
                (t[12] = 0),
                (t[13] = 0),
                (t[14] = 0),
                (t[15] = 1),
                this
            );
        }
        makeRotationFromEuler(e) {
            const t = this.elements,
                n = e.x,
                i = e.y,
                r = e.z,
                a = Math.cos(n),
                s = Math.sin(n),
                o = Math.cos(i),
                l = Math.sin(i),
                c = Math.cos(r),
                h = Math.sin(r);
            if ("XYZ" === e.order) {
                const e = a * c,
                    n = a * h,
                    i = s * c,
                    r = s * h;
                (t[0] = o * c),
                    (t[4] = -o * h),
                    (t[8] = l),
                    (t[1] = n + i * l),
                    (t[5] = e - r * l),
                    (t[9] = -s * o),
                    (t[2] = r - e * l),
                    (t[6] = i + n * l),
                    (t[10] = a * o);
            } else if ("YXZ" === e.order) {
                const e = o * c,
                    n = o * h,
                    i = l * c,
                    r = l * h;
                (t[0] = e + r * s),
                    (t[4] = i * s - n),
                    (t[8] = a * l),
                    (t[1] = a * h),
                    (t[5] = a * c),
                    (t[9] = -s),
                    (t[2] = n * s - i),
                    (t[6] = r + e * s),
                    (t[10] = a * o);
            } else if ("ZXY" === e.order) {
                const e = o * c,
                    n = o * h,
                    i = l * c,
                    r = l * h;
                (t[0] = e - r * s),
                    (t[4] = -a * h),
                    (t[8] = i + n * s),
                    (t[1] = n + i * s),
                    (t[5] = a * c),
                    (t[9] = r - e * s),
                    (t[2] = -a * l),
                    (t[6] = s),
                    (t[10] = a * o);
            } else if ("ZYX" === e.order) {
                const e = a * c,
                    n = a * h,
                    i = s * c,
                    r = s * h;
                (t[0] = o * c),
                    (t[4] = i * l - n),
                    (t[8] = e * l + r),
                    (t[1] = o * h),
                    (t[5] = r * l + e),
                    (t[9] = n * l - i),
                    (t[2] = -l),
                    (t[6] = s * o),
                    (t[10] = a * o);
            } else if ("YZX" === e.order) {
                const e = a * o,
                    n = a * l,
                    i = s * o,
                    r = s * l;
                (t[0] = o * c),
                    (t[4] = r - e * h),
                    (t[8] = i * h + n),
                    (t[1] = h),
                    (t[5] = a * c),
                    (t[9] = -s * c),
                    (t[2] = -l * c),
                    (t[6] = n * h + i),
                    (t[10] = e - r * h);
            } else if ("XZY" === e.order) {
                const e = a * o,
                    n = a * l,
                    i = s * o,
                    r = s * l;
                (t[0] = o * c),
                    (t[4] = -h),
                    (t[8] = l * c),
                    (t[1] = e * h + r),
                    (t[5] = a * c),
                    (t[9] = n * h - i),
                    (t[2] = i * h - n),
                    (t[6] = s * c),
                    (t[10] = r * h + e);
            }
            return (
                (t[3] = 0),
                (t[7] = 0),
                (t[11] = 0),
                (t[12] = 0),
                (t[13] = 0),
                (t[14] = 0),
                (t[15] = 1),
                this
            );
        }
        makeRotationFromQuaternion(e) {
            return this.compose($n, e, ei);
        }
        lookAt(e, t, n) {
            const i = this.elements;
            return (
                ii.subVectors(e, t),
                0 === ii.lengthSq() && (ii.z = 1),
                ii.normalize(),
                ti.crossVectors(n, ii),
                0 === ti.lengthSq() &&
                (1 === Math.abs(n.z) ? (ii.x += 1e-4) : (ii.z += 1e-4),
                    ii.normalize(),
                    ti.crossVectors(n, ii)),
                ti.normalize(),
                ni.crossVectors(ii, ti),
                (i[0] = ti.x),
                (i[4] = ni.x),
                (i[8] = ii.x),
                (i[1] = ti.y),
                (i[5] = ni.y),
                (i[9] = ii.y),
                (i[2] = ti.z),
                (i[6] = ni.z),
                (i[10] = ii.z),
                this
            );
        }
        multiply(e) {
            return this.multiplyMatrices(this, e);
        }
        premultiply(e) {
            return this.multiplyMatrices(e, this);
        }
        multiplyMatrices(e, t) {
            const n = e.elements,
                i = t.elements,
                r = this.elements,
                a = n[0],
                s = n[4],
                o = n[8],
                l = n[12],
                c = n[1],
                h = n[5],
                d = n[9],
                u = n[13],
                p = n[2],
                f = n[6],
                m = n[10],
                g = n[14],
                v = n[3],
                w = n[7],
                y = n[11],
                b = n[15],
                A = i[0],
                x = i[4],
                k = i[8],
                E = i[12],
                S = i[1],
                M = i[5],
                _ = i[9],
                T = i[13],
                C = i[2],
                P = i[6],
                I = i[10],
                R = i[14],
                L = i[3],
                D = i[7],
                N = i[11],
                B = i[15];
            return (
                (r[0] = a * A + s * S + o * C + l * L),
                (r[4] = a * x + s * M + o * P + l * D),
                (r[8] = a * k + s * _ + o * I + l * N),
                (r[12] = a * E + s * T + o * R + l * B),
                (r[1] = c * A + h * S + d * C + u * L),
                (r[5] = c * x + h * M + d * P + u * D),
                (r[9] = c * k + h * _ + d * I + u * N),
                (r[13] = c * E + h * T + d * R + u * B),
                (r[2] = p * A + f * S + m * C + g * L),
                (r[6] = p * x + f * M + m * P + g * D),
                (r[10] = p * k + f * _ + m * I + g * N),
                (r[14] = p * E + f * T + m * R + g * B),
                (r[3] = v * A + w * S + y * C + b * L),
                (r[7] = v * x + w * M + y * P + b * D),
                (r[11] = v * k + w * _ + y * I + b * N),
                (r[15] = v * E + w * T + y * R + b * B),
                this
            );
        }
        multiplyScalar(e) {
            const t = this.elements;
            return (
                (t[0] *= e),
                (t[4] *= e),
                (t[8] *= e),
                (t[12] *= e),
                (t[1] *= e),
                (t[5] *= e),
                (t[9] *= e),
                (t[13] *= e),
                (t[2] *= e),
                (t[6] *= e),
                (t[10] *= e),
                (t[14] *= e),
                (t[3] *= e),
                (t[7] *= e),
                (t[11] *= e),
                (t[15] *= e),
                this
            );
        }
        determinant() {
            const e = this.elements,
                t = e[0],
                n = e[4],
                i = e[8],
                r = e[12],
                a = e[1],
                s = e[5],
                o = e[9],
                l = e[13],
                c = e[2],
                h = e[6],
                d = e[10],
                u = e[14];
            return (
                e[3] *
                (+r * o * h -
                    i * l * h -
                    r * s * d +
                    n * l * d +
                    i * s * u -
                    n * o * u) +
                e[7] *
                (+t * o * u -
                    t * l * d +
                    r * a * d -
                    i * a * u +
                    i * l * c -
                    r * o * c) +
                e[11] *
                (+t * l * h -
                    t * s * u -
                    r * a * h +
                    n * a * u +
                    r * s * c -
                    n * l * c) +
                e[15] *
                (-i * s * c -
                    t * o * h +
                    t * s * d +
                    i * a * h -
                    n * a * d +
                    n * o * c)
            );
        }
        transpose() {
            const e = this.elements;
            let t;
            return (
                (t = e[1]),
                (e[1] = e[4]),
                (e[4] = t),
                (t = e[2]),
                (e[2] = e[8]),
                (e[8] = t),
                (t = e[6]),
                (e[6] = e[9]),
                (e[9] = t),
                (t = e[3]),
                (e[3] = e[12]),
                (e[12] = t),
                (t = e[7]),
                (e[7] = e[13]),
                (e[13] = t),
                (t = e[11]),
                (e[11] = e[14]),
                (e[14] = t),
                this
            );
        }
        setPosition(e, t, n) {
            const i = this.elements;
            return (
                e.isVector3
                    ? ((i[12] = e.x), (i[13] = e.y), (i[14] = e.z))
                    : ((i[12] = e), (i[13] = t), (i[14] = n)),
                this
            );
        }
        invert() {
            const e = this.elements,
                t = e[0],
                n = e[1],
                i = e[2],
                r = e[3],
                a = e[4],
                s = e[5],
                o = e[6],
                l = e[7],
                c = e[8],
                h = e[9],
                d = e[10],
                u = e[11],
                p = e[12],
                f = e[13],
                m = e[14],
                g = e[15],
                v =
                    h * m * l -
                    f * d * l +
                    f * o * u -
                    s * m * u -
                    h * o * g +
                    s * d * g,
                w =
                    p * d * l -
                    c * m * l -
                    p * o * u +
                    a * m * u +
                    c * o * g -
                    a * d * g,
                y =
                    c * f * l -
                    p * h * l +
                    p * s * u -
                    a * f * u -
                    c * s * g +
                    a * h * g,
                b =
                    p * h * o -
                    c * f * o -
                    p * s * d +
                    a * f * d +
                    c * s * m -
                    a * h * m,
                A = t * v + n * w + i * y + r * b;
            if (0 === A)
                return this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
            const x = 1 / A;
            return (
                (e[0] = v * x),
                (e[1] =
                    (f * d * r -
                        h * m * r -
                        f * i * u +
                        n * m * u +
                        h * i * g -
                        n * d * g) *
                    x),
                (e[2] =
                    (s * m * r -
                        f * o * r +
                        f * i * l -
                        n * m * l -
                        s * i * g +
                        n * o * g) *
                    x),
                (e[3] =
                    (h * o * r -
                        s * d * r -
                        h * i * l +
                        n * d * l +
                        s * i * u -
                        n * o * u) *
                    x),
                (e[4] = w * x),
                (e[5] =
                    (c * m * r -
                        p * d * r +
                        p * i * u -
                        t * m * u -
                        c * i * g +
                        t * d * g) *
                    x),
                (e[6] =
                    (p * o * r -
                        a * m * r -
                        p * i * l +
                        t * m * l +
                        a * i * g -
                        t * o * g) *
                    x),
                (e[7] =
                    (a * d * r -
                        c * o * r +
                        c * i * l -
                        t * d * l -
                        a * i * u +
                        t * o * u) *
                    x),
                (e[8] = y * x),
                (e[9] =
                    (p * h * r -
                        c * f * r -
                        p * n * u +
                        t * f * u +
                        c * n * g -
                        t * h * g) *
                    x),
                (e[10] =
                    (a * f * r -
                        p * s * r +
                        p * n * l -
                        t * f * l -
                        a * n * g +
                        t * s * g) *
                    x),
                (e[11] =
                    (c * s * r -
                        a * h * r -
                        c * n * l +
                        t * h * l +
                        a * n * u -
                        t * s * u) *
                    x),
                (e[12] = b * x),
                (e[13] =
                    (c * f * i -
                        p * h * i +
                        p * n * d -
                        t * f * d -
                        c * n * m +
                        t * h * m) *
                    x),
                (e[14] =
                    (p * s * i -
                        a * f * i -
                        p * n * o +
                        t * f * o +
                        a * n * m -
                        t * s * m) *
                    x),
                (e[15] =
                    (a * h * i -
                        c * s * i +
                        c * n * o -
                        t * h * o -
                        a * n * d +
                        t * s * d) *
                    x),
                this
            );
        }
        scale(e) {
            const t = this.elements,
                n = e.x,
                i = e.y,
                r = e.z;
            return (
                (t[0] *= n),
                (t[4] *= i),
                (t[8] *= r),
                (t[1] *= n),
                (t[5] *= i),
                (t[9] *= r),
                (t[2] *= n),
                (t[6] *= i),
                (t[10] *= r),
                (t[3] *= n),
                (t[7] *= i),
                (t[11] *= r),
                this
            );
        }
        getMaxScaleOnAxis() {
            const e = this.elements,
                t = e[0] * e[0] + e[1] * e[1] + e[2] * e[2],
                n = e[4] * e[4] + e[5] * e[5] + e[6] * e[6],
                i = e[8] * e[8] + e[9] * e[9] + e[10] * e[10];
            return Math.sqrt(Math.max(t, n, i));
        }
        makeTranslation(e, t, n) {
            return (
                e.isVector3
                    ? this.set(1, 0, 0, e.x, 0, 1, 0, e.y, 0, 0, 1, e.z, 0, 0, 0, 1)
                    : this.set(1, 0, 0, e, 0, 1, 0, t, 0, 0, 1, n, 0, 0, 0, 1),
                this
            );
        }
        makeRotationX(e) {
            const t = Math.cos(e),
                n = Math.sin(e);
            return (
                this.set(1, 0, 0, 0, 0, t, -n, 0, 0, n, t, 0, 0, 0, 0, 1), this
            );
        }
        makeRotationY(e) {
            const t = Math.cos(e),
                n = Math.sin(e);
            return (
                this.set(t, 0, n, 0, 0, 1, 0, 0, -n, 0, t, 0, 0, 0, 0, 1), this
            );
        }
        makeRotationZ(e) {
            const t = Math.cos(e),
                n = Math.sin(e);
            return (
                this.set(t, -n, 0, 0, n, t, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1), this
            );
        }
        makeRotationAxis(e, t) {
            const n = Math.cos(t),
                i = Math.sin(t),
                r = 1 - n,
                a = e.x,
                s = e.y,
                o = e.z,
                l = r * a,
                c = r * s;
            return (
                this.set(
                    l * a + n,
                    l * s - i * o,
                    l * o + i * s,
                    0,
                    l * s + i * o,
                    c * s + n,
                    c * o - i * a,
                    0,
                    l * o - i * s,
                    c * o + i * a,
                    r * o * o + n,
                    0,
                    0,
                    0,
                    0,
                    1
                ),
                this
            );
        }
        makeScale(e, t, n) {
            return this.set(e, 0, 0, 0, 0, t, 0, 0, 0, 0, n, 0, 0, 0, 0, 1), this;
        }
        makeShear(e, t, n, i, r, a) {
            return this.set(1, n, r, 0, e, 1, a, 0, t, i, 1, 0, 0, 0, 0, 1), this;
        }
        compose(e, t, n) {
            const i = this.elements,
                r = t._x,
                a = t._y,
                s = t._z,
                o = t._w,
                l = r + r,
                c = a + a,
                h = s + s,
                d = r * l,
                u = r * c,
                p = r * h,
                f = a * c,
                m = a * h,
                g = s * h,
                v = o * l,
                w = o * c,
                y = o * h,
                b = n.x,
                A = n.y,
                x = n.z;
            return (
                (i[0] = (1 - (f + g)) * b),
                (i[1] = (u + y) * b),
                (i[2] = (p - w) * b),
                (i[3] = 0),
                (i[4] = (u - y) * A),
                (i[5] = (1 - (d + g)) * A),
                (i[6] = (m + v) * A),
                (i[7] = 0),
                (i[8] = (p + w) * x),
                (i[9] = (m - v) * x),
                (i[10] = (1 - (d + f)) * x),
                (i[11] = 0),
                (i[12] = e.x),
                (i[13] = e.y),
                (i[14] = e.z),
                (i[15] = 1),
                this
            );
        }
        decompose(e, t, n) {
            const i = this.elements;
            let r = Zn.set(i[0], i[1], i[2]).length();
            const a = Zn.set(i[4], i[5], i[6]).length(),
                s = Zn.set(i[8], i[9], i[10]).length();
            this.determinant() < 0 && (r = -r),
                (e.x = i[12]),
                (e.y = i[13]),
                (e.z = i[14]),
                Jn.copy(this);
            const o = 1 / r,
                l = 1 / a,
                c = 1 / s;
            return (
                (Jn.elements[0] *= o),
                (Jn.elements[1] *= o),
                (Jn.elements[2] *= o),
                (Jn.elements[4] *= l),
                (Jn.elements[5] *= l),
                (Jn.elements[6] *= l),
                (Jn.elements[8] *= c),
                (Jn.elements[9] *= c),
                (Jn.elements[10] *= c),
                t.setFromRotationMatrix(Jn),
                (n.x = r),
                (n.y = a),
                (n.z = s),
                this
            );
        }
        makePerspective(e, t, n, i, r, a, s = 2e3) {
            const o = this.elements,
                l = (2 * r) / (t - e),
                c = (2 * r) / (n - i),
                h = (t + e) / (t - e),
                d = (n + i) / (n - i);
            let u, p;
            if (s === Rt) (u = -(a + r) / (a - r)), (p = (-2 * a * r) / (a - r));
            else {
                if (s !== Lt)
                    throw new Error(
                        "THREE.Matrix4.makePerspective(): Invalid coordinate system: " +
                        s
                    );
                (u = -a / (a - r)), (p = (-a * r) / (a - r));
            }
            return (
                (o[0] = l),
                (o[4] = 0),
                (o[8] = h),
                (o[12] = 0),
                (o[1] = 0),
                (o[5] = c),
                (o[9] = d),
                (o[13] = 0),
                (o[2] = 0),
                (o[6] = 0),
                (o[10] = u),
                (o[14] = p),
                (o[3] = 0),
                (o[7] = 0),
                (o[11] = -1),
                (o[15] = 0),
                this
            );
        }
        makeOrthographic(e, t, n, i, r, a, s = 2e3) {
            const o = this.elements,
                l = 1 / (t - e),
                c = 1 / (n - i),
                h = 1 / (a - r),
                d = (t + e) * l,
                u = (n + i) * c;
            let p, f;
            if (s === Rt) (p = (a + r) * h), (f = -2 * h);
            else {
                if (s !== Lt)
                    throw new Error(
                        "THREE.Matrix4.makeOrthographic(): Invalid coordinate system: " +
                        s
                    );
                (p = r * h), (f = -1 * h);
            }
            return (
                (o[0] = 2 * l),
                (o[4] = 0),
                (o[8] = 0),
                (o[12] = -d),
                (o[1] = 0),
                (o[5] = 2 * c),
                (o[9] = 0),
                (o[13] = -u),
                (o[2] = 0),
                (o[6] = 0),
                (o[10] = f),
                (o[14] = -p),
                (o[3] = 0),
                (o[7] = 0),
                (o[11] = 0),
                (o[15] = 1),
                this
            );
        }
        equals(e) {
            const t = this.elements,
                n = e.elements;
            for (let e = 0; e < 16; e++) if (t[e] !== n[e]) return !1;
            return !0;
        }
        fromArray(e, t = 0) {
            for (let n = 0; n < 16; n++) this.elements[n] = e[n + t];
            return this;
        }
        toArray(e = [], t = 0) {
            const n = this.elements;
            return (
                (e[t] = n[0]),
                (e[t + 1] = n[1]),
                (e[t + 2] = n[2]),
                (e[t + 3] = n[3]),
                (e[t + 4] = n[4]),
                (e[t + 5] = n[5]),
                (e[t + 6] = n[6]),
                (e[t + 7] = n[7]),
                (e[t + 8] = n[8]),
                (e[t + 9] = n[9]),
                (e[t + 10] = n[10]),
                (e[t + 11] = n[11]),
                (e[t + 12] = n[12]),
                (e[t + 13] = n[13]),
                (e[t + 14] = n[14]),
                (e[t + 15] = n[15]),
                e
            );
        }
    }




    const Zn = new bn(),
        Jn = new Xn(),
        $n = new bn(0, 0, 0),
        ei = new bn(1, 1, 1),
        ti = new bn(),
        ni = new bn(),
        ii = new bn(),
        ri = new Xn(),
        ai = new yn();
    class si {
        constructor(e = 0, t = 0, n = 0, i = si.DEFAULT_ORDER) {
            this.isEuler = !0,
                this._x = e,
                this._y = t,
                this._z = n,
                this._order = i
        }
        get x() {
            return this._x
        }
        set x(e) {
            this._x = e,
                this._onChangeCallback()
        }
        get y() {
            return this._y
        }
        set y(e) {
            this._y = e,
                this._onChangeCallback()
        }
        get z() {
            return this._z
        }
        set z(e) {
            this._z = e,
                this._onChangeCallback()
        }
        get order() {
            return this._order
        }
        set order(e) {
            this._order = e,
                this._onChangeCallback()
        }
        set(e, t, n, i = this._order) {
            return this._x = e,
                this._y = t,
                this._z = n,
                this._order = i,
                this._onChangeCallback(),
                this
        }
        clone() {
            return new this.constructor(this._x, this._y, this._z, this._order)
        }
        copy(e) {
            return this._x = e._x,
                this._y = e._y,
                this._z = e._z,
                this._order = e._order,
                this._onChangeCallback(),
                this
        }
        setFromRotationMatrix(e, t = this._order, n = !0) {
            const i = e.elements
                , r = i[0]
                , a = i[4]
                , s = i[8]
                , o = i[1]
                , l = i[5]
                , c = i[9]
                , h = i[2]
                , d = i[6]
                , u = i[10];
            switch (t) {
                case "XYZ":
                    this._y = Math.asin(Ft(s, -1, 1)),
                        Math.abs(s) < .9999999 ? (this._x = Math.atan2(-c, u),
                            this._z = Math.atan2(-a, r)) : (this._x = Math.atan2(d, l),
                                this._z = 0);
                    break;
                case "YXZ":
                    this._x = Math.asin(-Ft(c, -1, 1)),
                        Math.abs(c) < .9999999 ? (this._y = Math.atan2(s, u),
                            this._z = Math.atan2(o, l)) : (this._y = Math.atan2(-h, r),
                                this._z = 0);
                    break;
                case "ZXY":
                    this._x = Math.asin(Ft(d, -1, 1)),
                        Math.abs(d) < .9999999 ? (this._y = Math.atan2(-h, u),
                            this._z = Math.atan2(-a, l)) : (this._y = 0,
                                this._z = Math.atan2(o, r));
                    break;
                case "ZYX":
                    this._y = Math.asin(-Ft(h, -1, 1)),
                        Math.abs(h) < .9999999 ? (this._x = Math.atan2(d, u),
                            this._z = Math.atan2(o, r)) : (this._x = 0,
                                this._z = Math.atan2(-a, l));
                    break;
                case "YZX":
                    this._z = Math.asin(Ft(o, -1, 1)),
                        Math.abs(o) < .9999999 ? (this._x = Math.atan2(-c, l),
                            this._y = Math.atan2(-h, r)) : (this._x = 0,
                                this._y = Math.atan2(s, u));
                    break;
                case "XZY":
                    this._z = Math.asin(-Ft(a, -1, 1)),
                        Math.abs(a) < .9999999 ? (this._x = Math.atan2(d, l),
                            this._y = Math.atan2(s, r)) : (this._x = Math.atan2(-c, u),
                                this._y = 0);
                    break;
                default:
                    console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: " + t)
            }
            return this._order = t,
                !0 === n && this._onChangeCallback(),
                this
        }
        setFromQuaternion(e, t, n) {
            return ri.makeRotationFromQuaternion(e),
                this.setFromRotationMatrix(ri, t, n)
        }
        setFromVector3(e, t = this._order) {
            return this.set(e.x, e.y, e.z, t)
        }
        reorder(e) {
            return ai.setFromEuler(this),
                this.setFromQuaternion(ai, e)
        }
        equals(e) {
            return e._x === this._x && e._y === this._y && e._z === this._z && e._order === this._order
        }
        fromArray(e) {
            return this._x = e[0],
                this._y = e[1],
                this._z = e[2],
                void 0 !== e[3] && (this._order = e[3]),
                this._onChangeCallback(),
                this
        }
        toArray(e = [], t = 0) {
            return e[t] = this._x,
                e[t + 1] = this._y,
                e[t + 2] = this._z,
                e[t + 3] = this._order,
                e
        }
        _onChange(e) {
            return this._onChangeCallback = e,
                this
        }
        _onChangeCallback() { }
        *[Symbol.iterator]() {
            yield this._x,
                yield this._y,
                yield this._z,
                yield this._order
        }
    }
    si.DEFAULT_ORDER = "XYZ";
    class Qt {
        constructor(e = 0, t = 0) {
            Qt.prototype.isVector2 = !0,
                this.x = e,
                this.y = t
        }
        get width() {
            return this.x
        }
        set width(e) {
            this.x = e
        }
        get height() {
            return this.y
        }
        set height(e) {
            this.y = e
        }
        set(e, t) {
            return this.x = e,
                this.y = t,
                this
        }
        setScalar(e) {
            return this.x = e,
                this.y = e,
                this
        }
        setX(e) {
            return this.x = e,
                this
        }
        setY(e) {
            return this.y = e,
                this
        }
        setComponent(e, t) {
            switch (e) {
                case 0:
                    this.x = t;
                    break;
                case 1:
                    this.y = t;
                    break;
                default:
                    throw new Error("index is out of range: " + e)
            }
            return this
        }
        getComponent(e) {
            switch (e) {
                case 0:
                    return this.x;
                case 1:
                    return this.y;
                default:
                    throw new Error("index is out of range: " + e)
            }
        }
        clone() {
            return new this.constructor(this.x, this.y)
        }
        copy(e) {
            return this.x = e.x,
                this.y = e.y,
                this
        }
        add(e) {
            return this.x += e.x,
                this.y += e.y,
                this
        }
        addScalar(e) {
            return this.x += e,
                this.y += e,
                this
        }
        addVectors(e, t) {
            return this.x = e.x + t.x,
                this.y = e.y + t.y,
                this
        }
        addScaledVector(e, t) {
            return this.x += e.x * t,
                this.y += e.y * t,
                this
        }
        sub(e) {
            return this.x -= e.x,
                this.y -= e.y,
                this
        }
        subScalar(e) {
            return this.x -= e,
                this.y -= e,
                this
        }
        subVectors(e, t) {
            return this.x = e.x - t.x,
                this.y = e.y - t.y,
                this
        }
        multiply(e) {
            return this.x *= e.x,
                this.y *= e.y,
                this
        }
        multiplyScalar(e) {
            return this.x *= e,
                this.y *= e,
                this
        }
        divide(e) {
            return this.x /= e.x,
                this.y /= e.y,
                this
        }
        divideScalar(e) {
            return this.multiplyScalar(1 / e)
        }
        applyMatrix3(e) {
            const t = this.x
                , n = this.y
                , i = e.elements;
            return this.x = i[0] * t + i[3] * n + i[6],
                this.y = i[1] * t + i[4] * n + i[7],
                this
        }
        min(e) {
            return this.x = Math.min(this.x, e.x),
                this.y = Math.min(this.y, e.y),
                this
        }
        max(e) {
            return this.x = Math.max(this.x, e.x),
                this.y = Math.max(this.y, e.y),
                this
        }
        clamp(e, t) {
            return this.x = Ft(this.x, e.x, t.x),
                this.y = Ft(this.y, e.y, t.y),
                this
        }
        clampScalar(e, t) {
            return this.x = Ft(this.x, e, t),
                this.y = Ft(this.y, e, t),
                this
        }
        clampLength(e, t) {
            const n = this.length();
            return this.divideScalar(n || 1).multiplyScalar(Ft(n, e, t))
        }
        floor() {
            return this.x = Math.floor(this.x),
                this.y = Math.floor(this.y),
                this
        }
        ceil() {
            return this.x = Math.ceil(this.x),
                this.y = Math.ceil(this.y),
                this
        }
        round() {
            return this.x = Math.round(this.x),
                this.y = Math.round(this.y),
                this
        }
        roundToZero() {
            return this.x = Math.trunc(this.x),
                this.y = Math.trunc(this.y),
                this
        }
        negate() {
            return this.x = -this.x,
                this.y = -this.y,
                this
        }
        dot(e) {
            return this.x * e.x + this.y * e.y
        }
        cross(e) {
            return this.x * e.y - this.y * e.x
        }
        lengthSq() {
            return this.x * this.x + this.y * this.y
        }
        length() {
            return Math.sqrt(this.x * this.x + this.y * this.y)
        }
        manhattanLength() {
            return Math.abs(this.x) + Math.abs(this.y)
        }
        normalize() {
            return this.divideScalar(this.length() || 1)
        }
        angle() {
            return Math.atan2(-this.y, -this.x) + Math.PI
        }
        angleTo(e) {
            const t = Math.sqrt(this.lengthSq() * e.lengthSq());
            if (0 === t)
                return Math.PI / 2;
            const n = this.dot(e) / t;
            return Math.acos(Ft(n, -1, 1))
        }
        distanceTo(e) {
            return Math.sqrt(this.distanceToSquared(e))
        }
        distanceToSquared(e) {
            const t = this.x - e.x
                , n = this.y - e.y;
            return t * t + n * n
        }
        manhattanDistanceTo(e) {
            return Math.abs(this.x - e.x) + Math.abs(this.y - e.y)
        }
        setLength(e) {
            return this.normalize().multiplyScalar(e)
        }
        lerp(e, t) {
            return this.x += (e.x - this.x) * t,
                this.y += (e.y - this.y) * t,
                this
        }
        lerpVectors(e, t, n) {
            return this.x = e.x + (t.x - e.x) * n,
                this.y = e.y + (t.y - e.y) * n,
                this
        }
        equals(e) {
            return e.x === this.x && e.y === this.y
        }
        fromArray(e, t = 0) {
            return this.x = e[t],
                this.y = e[t + 1],
                this
        }
        toArray(e = [], t = 0) {
            return e[t] = this.x,
                e[t + 1] = this.y,
                e
        }
        fromBufferAttribute(e, t) {
            return this.x = e.getX(t),
                this.y = e.getY(t),
                this
        }
        rotateAround(e, t) {
            const n = Math.cos(t)
                , i = Math.sin(t)
                , r = this.x - e.x
                , a = this.y - e.y;
            return this.x = r * n - a * i + e.x,
                this.y = r * i + a * n + e.y,
                this
        }
        random() {
            return this.x = Math.random(),
                this.y = Math.random(),
                this
        }
        *[Symbol.iterator]() {
            yield this.x,
                yield this.y
        }
    }



























    const g = "174"
        , v = 0
        , w = 1
        , y = 2
        , b = 0
        , A = 1
        , x = 2
        , k = 3
        , E = 0
        , S = 1
        , M = 2
        , _ = 100
        , T = 101
        , C = 102
        , P = 200
        , I = 201
        , R = 202
        , L = 203
        , D = 204
        , N = 205
        , B = 206
        , U = 207
        , z = 208
        , O = 209
        , F = 210
        , W = 211
        , H = 212
        , V = 213
        , G = 214
        , j = 0
        , Q = 1
        , K = 2
        , q = 3
        , Y = 4
        , X = 5
        , Z = 6
        , J = 7
        , $ = "attached"
        , ee = 301
        , te = 302
        , ne = 303
        , ie = 304
        , re = 306
        , ae = 1e3
        , se = 1001
        , oe = 1002
        , le = 1003
        , ce = 1004
        , he = 1005
        , de = 1006
        , ue = 1007
        , pe = 1008
        , fe = 1009
        , me = 1010
        , ge = 1011
        , ve = 1012
        , we = 1013
        , ye = 1014
        , be = 1015
        , Ae = 1016
        , xe = 1017
        , ke = 1018
        , Ee = 1020
        , Se = 35902
        , Me = 1023
        , _e = 1026
        , Te = 1027
        , Ce = 1028
        , Pe = 1029
        , Ie = 1031
        , Re = 1033
        , Le = 33776
        , De = 33777
        , Ne = 33778
        , Be = 33779
        , Ue = 35840
        , ze = 35841
        , Oe = 35842
        , Fe = 35843
        , We = 36196
        , He = 37492
        , Ve = 37496
        , Ge = 37808
        , je = 37809
        , Qe = 37810
        , Ke = 37811
        , qe = 37812
        , Ye = 37813
        , Xe = 37814
        , Ze = 37815
        , Je = 37816
        , $e = 37817
        , et = 37818
        , tt = 37819
        , nt = 37820
        , it = 37821
        , rt = 36492
        , at = 36494
        , st = 36495
        , ot = 36284
        , lt = 36285
        , ct = 36286
        , ht = 2300
        , dt = 2301
        , ut = 2302
        , pt = 2400
        , ft = 2401
        , mt = 2402
        , gt = ""
        , vt = "srgb"
        , wt = "srgb-linear"
        , yt = "linear"
        , bt = "srgb"
        , At = 7680
        , xt = 512
        , kt = 513
        , Et = 514
        , St = 515
        , Mt = 516
        , _t = 517
        , Tt = 518
        , Ct = 519
        , Pt = 35044
        , It = "300 es"
        , Rt = 2e3
        , Lt = 2001;
    class Dt {
        addEventListener(e, t) {
            void 0 === this._listeners && (this._listeners = {});
            const n = this._listeners;
            void 0 === n[e] && (n[e] = []),
                -1 === n[e].indexOf(t) && n[e].push(t)
        }
        hasEventListener(e, t) {
            const n = this._listeners;
            return void 0 !== n && (void 0 !== n[e] && -1 !== n[e].indexOf(t))
        }
        removeEventListener(e, t) {
            const n = this._listeners;
            if (void 0 === n)
                return;
            const i = n[e];
            if (void 0 !== i) {
                const e = i.indexOf(t);
                -1 !== e && i.splice(e, 1)
            }
        }
        dispatchEvent(e) {
            const t = this._listeners;
            if (void 0 === t)
                return;
            const n = t[e.type];
            if (void 0 !== n) {
                e.target = this;
                const t = n.slice(0);
                for (let n = 0, i = t.length; n < i; n++)
                    t[n].call(this, e);
                e.target = null
            }
        }
    }

    const Nt = ["00", "01", "02", "03", "04", "05", "06", "07", "08", "09", "0a", "0b", "0c", "0d", "0e", "0f", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "1a", "1b", "1c", "1d", "1e", "1f", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "2a", "2b", "2c", "2d", "2e", "2f", "30", "31", "32", "33", "34", "35", "36", "37", "38", "39", "3a", "3b", "3c", "3d", "3e", "3f", "40", "41", "42", "43", "44", "45", "46", "47", "48", "49", "4a", "4b", "4c", "4d", "4e", "4f", "50", "51", "52", "53", "54", "55", "56", "57", "58", "59", "5a", "5b", "5c", "5d", "5e", "5f", "60", "61", "62", "63", "64", "65", "66", "67", "68", "69", "6a", "6b", "6c", "6d", "6e", "6f", "70", "71", "72", "73", "74", "75", "76", "77", "78", "79", "7a", "7b", "7c", "7d", "7e", "7f", "80", "81", "82", "83", "84", "85", "86", "87", "88", "89", "8a", "8b", "8c", "8d", "8e", "8f", "90", "91", "92", "93", "94", "95", "96", "97", "98", "99", "9a", "9b", "9c", "9d", "9e", "9f", "a0", "a1", "a2", "a3", "a4", "a5", "a6", "a7", "a8", "a9", "aa", "ab", "ac", "ad", "ae", "af", "b0", "b1", "b2", "b3", "b4", "b5", "b6", "b7", "b8", "b9", "ba", "bb", "bc", "bd", "be", "bf", "c0", "c1", "c2", "c3", "c4", "c5", "c6", "c7", "c8", "c9", "ca", "cb", "cc", "cd", "ce", "cf", "d0", "d1", "d2", "d3", "d4", "d5", "d6", "d7", "d8", "d9", "da", "db", "dc", "dd", "de", "df", "e0", "e1", "e2", "e3", "e4", "e5", "e6", "e7", "e8", "e9", "ea", "eb", "ec", "ed", "ee", "ef", "f0", "f1", "f2", "f3", "f4", "f5", "f6", "f7", "f8", "f9", "fa", "fb", "fc", "fd", "fe", "ff"];
    let Bt = 1234567;
    const Ut = Math.PI / 180
        , zt = 180 / Math.PI;
    function Ot() {
        const e = 4294967295 * Math.random() | 0
            , t = 4294967295 * Math.random() | 0
            , n = 4294967295 * Math.random() | 0
            , i = 4294967295 * Math.random() | 0;
        return (Nt[255 & e] + Nt[e >> 8 & 255] + Nt[e >> 16 & 255] + Nt[e >> 24 & 255] + "-" + Nt[255 & t] + Nt[t >> 8 & 255] + "-" + Nt[t >> 16 & 15 | 64] + Nt[t >> 24 & 255] + "-" + Nt[63 & n | 128] + Nt[n >> 8 & 255] + "-" + Nt[n >> 16 & 255] + Nt[n >> 24 & 255] + Nt[255 & i] + Nt[i >> 8 & 255] + Nt[i >> 16 & 255] + Nt[i >> 24 & 255]).toLowerCase()
    }
    function Ft(e, t, n) {
        return Math.max(t, Math.min(n, e));
    }
    function Wt(e, t) {
        return ((e % t) + t) % t;
    }
    function Ht(e, t, n) {
        return (1 - n) * e + n * t;
    }
    function Vt(e, t) {
        switch (t.constructor) {
            case Float32Array:
                return e;
            case Uint32Array:
                return e / 4294967295;
            case Uint16Array:
                return e / 65535;
            case Uint8Array:
                return e / 255;
            case Int32Array:
                return Math.max(e / 2147483647, -1);
            case Int16Array:
                return Math.max(e / 32767, -1);
            case Int8Array:
                return Math.max(e / 127, -1);
            default:
                throw new Error("Invalid component type.");
        }
    }
    function Gt(e, t) {
        switch (t.constructor) {
            case Float32Array:
                return e;
            case Uint32Array:
                return Math.round(4294967295 * e);
            case Uint16Array:
                return Math.round(65535 * e);
            case Uint8Array:
                return Math.round(255 * e);
            case Int32Array:
                return Math.round(2147483647 * e);
            case Int16Array:
                return Math.round(32767 * e);
            case Int8Array:
                return Math.round(127 * e);
            default:
                throw new Error("Invalid component type.");
        }
    }







    class Kt {
        constructor(e, t, n, i, r, a, s, o, l) {
            Kt.prototype.isMatrix3 = !0,
                this.elements = [1, 0, 0, 0, 1, 0, 0, 0, 1],
                void 0 !== e && this.set(e, t, n, i, r, a, s, o, l)
        }
        set(e, t, n, i, r, a, s, o, l) {
            const c = this.elements;
            return c[0] = e,
                c[1] = i,
                c[2] = s,
                c[3] = t,
                c[4] = r,
                c[5] = o,
                c[6] = n,
                c[7] = a,
                c[8] = l,
                this
        }
        identity() {
            return this.set(1, 0, 0, 0, 1, 0, 0, 0, 1),
                this
        }
        copy(e) {
            const t = this.elements
                , n = e.elements;
            return t[0] = n[0],
                t[1] = n[1],
                t[2] = n[2],
                t[3] = n[3],
                t[4] = n[4],
                t[5] = n[5],
                t[6] = n[6],
                t[7] = n[7],
                t[8] = n[8],
                this
        }
        extractBasis(e, t, n) {
            return e.setFromMatrix3Column(this, 0),
                t.setFromMatrix3Column(this, 1),
                n.setFromMatrix3Column(this, 2),
                this
        }
        setFromMatrix4(e) {
            const t = e.elements;
            return this.set(t[0], t[4], t[8], t[1], t[5], t[9], t[2], t[6], t[10]),
                this
        }
        multiply(e) {
            return this.multiplyMatrices(this, e)
        }
        premultiply(e) {
            return this.multiplyMatrices(e, this)
        }
        multiplyMatrices(e, t) {
            const n = e.elements
                , i = t.elements
                , r = this.elements
                , a = n[0]
                , s = n[3]
                , o = n[6]
                , l = n[1]
                , c = n[4]
                , h = n[7]
                , d = n[2]
                , u = n[5]
                , p = n[8]
                , f = i[0]
                , m = i[3]
                , g = i[6]
                , v = i[1]
                , w = i[4]
                , y = i[7]
                , b = i[2]
                , A = i[5]
                , x = i[8];
            return r[0] = a * f + s * v + o * b,
                r[3] = a * m + s * w + o * A,
                r[6] = a * g + s * y + o * x,
                r[1] = l * f + c * v + h * b,
                r[4] = l * m + c * w + h * A,
                r[7] = l * g + c * y + h * x,
                r[2] = d * f + u * v + p * b,
                r[5] = d * m + u * w + p * A,
                r[8] = d * g + u * y + p * x,
                this
        }
        multiplyScalar(e) {
            const t = this.elements;
            return t[0] *= e,
                t[3] *= e,
                t[6] *= e,
                t[1] *= e,
                t[4] *= e,
                t[7] *= e,
                t[2] *= e,
                t[5] *= e,
                t[8] *= e,
                this
        }
        determinant() {
            const e = this.elements
                , t = e[0]
                , n = e[1]
                , i = e[2]
                , r = e[3]
                , a = e[4]
                , s = e[5]
                , o = e[6]
                , l = e[7]
                , c = e[8];
            return t * a * c - t * s * l - n * r * c + n * s * o + i * r * l - i * a * o
        }
        invert() {
            const e = this.elements
                , t = e[0]
                , n = e[1]
                , i = e[2]
                , r = e[3]
                , a = e[4]
                , s = e[5]
                , o = e[6]
                , l = e[7]
                , c = e[8]
                , h = c * a - s * l
                , d = s * o - c * r
                , u = l * r - a * o
                , p = t * h + n * d + i * u;
            if (0 === p)
                return this.set(0, 0, 0, 0, 0, 0, 0, 0, 0);
            const f = 1 / p;
            return e[0] = h * f,
                e[1] = (i * l - c * n) * f,
                e[2] = (s * n - i * a) * f,
                e[3] = d * f,
                e[4] = (c * t - i * o) * f,
                e[5] = (i * r - s * t) * f,
                e[6] = u * f,
                e[7] = (n * o - l * t) * f,
                e[8] = (a * t - n * r) * f,
                this
        }
        transpose() {
            let e;
            const t = this.elements;
            return e = t[1],
                t[1] = t[3],
                t[3] = e,
                e = t[2],
                t[2] = t[6],
                t[6] = e,
                e = t[5],
                t[5] = t[7],
                t[7] = e,
                this
        }
        getNormalMatrix(e) {
            return this.setFromMatrix4(e).invert().transpose()
        }
        transposeIntoArray(e) {
            const t = this.elements;
            return e[0] = t[0],
                e[1] = t[3],
                e[2] = t[6],
                e[3] = t[1],
                e[4] = t[4],
                e[5] = t[7],
                e[6] = t[2],
                e[7] = t[5],
                e[8] = t[8],
                this
        }
        setUvTransform(e, t, n, i, r, a, s) {
            const o = Math.cos(r)
                , l = Math.sin(r);
            return this.set(n * o, n * l, -n * (o * a + l * s) + a + e, -i * l, i * o, -i * (-l * a + o * s) + s + t, 0, 0, 1),
                this
        }
        scale(e, t) {
            return this.premultiply(qt.makeScale(e, t)),
                this
        }
        rotate(e) {
            return this.premultiply(qt.makeRotation(-e)),
                this
        }
        translate(e, t) {
            return this.premultiply(qt.makeTranslation(e, t)),
                this
        }
        makeTranslation(e, t) {
            return e.isVector2 ? this.set(1, 0, e.x, 0, 1, e.y, 0, 0, 1) : this.set(1, 0, e, 0, 1, t, 0, 0, 1),
                this
        }
        makeRotation(e) {
            const t = Math.cos(e)
                , n = Math.sin(e);
            return this.set(t, -n, 0, n, t, 0, 0, 0, 1),
                this
        }
        makeScale(e, t) {
            return this.set(e, 0, 0, 0, t, 0, 0, 0, 1),
                this
        }
        equals(e) {
            const t = this.elements
                , n = e.elements;
            for (let e = 0; e < 9; e++)
                if (t[e] !== n[e])
                    return !1;
            return !0
        }
        fromArray(e, t = 0) {
            for (let n = 0; n < 9; n++)
                this.elements[n] = e[n + t];
            return this
        }
        toArray(e = [], t = 0) {
            const n = this.elements;
            return e[t] = n[0],
                e[t + 1] = n[1],
                e[t + 2] = n[2],
                e[t + 3] = n[3],
                e[t + 4] = n[4],
                e[t + 5] = n[5],
                e[t + 6] = n[6],
                e[t + 7] = n[7],
                e[t + 8] = n[8],
                e
        }
        clone() {
            return (new this.constructor).fromArray(this.elements)
        }
    }
    const qt = new Kt;
    function Yt(e) {
        for (let t = e.length - 1; t >= 0; --t)
            if (e[t] >= 65535)
                return !0;
        return !1
    }
    Int8Array,
        Uint8Array,
        Uint8ClampedArray,
        Int16Array,
        Uint16Array,
        Int32Array,
        Uint32Array,
        Float32Array,
        Float64Array;
    function Xt(e) {
        return document.createElementNS("http://www.w3.org/1999/xhtml", e)
    }
    function Zt() {
        const e = Xt("canvas");
        return e.style.display = "block",
            e
    }

    const Jt = {};
    function $t(e) {
        e in Jt || (Jt[e] = !0,
            console.warn(e))
    }
    const en = (new Kt).set(.4123908, .3575843, .1804808, .212639, .7151687, .0721923, .0193308, .1191948, .9505322)
        , tn = (new Kt).set(3.2409699, -1.5373832, -.4986108, -.9692436, 1.8759675, .0415551, .0556301, -.203977, 1.0569715);
    function nn() {
        const e = {
            enabled: !0,
            workingColorSpace: wt,
            spaces: {},
            convert: function (e, t, n) {
                return !1 !== this.enabled && t !== n && t && n ? (this.spaces[t].transfer === bt && (e.r = an(e.r),
                    e.g = an(e.g),
                    e.b = an(e.b)),
                    this.spaces[t].primaries !== this.spaces[n].primaries && (e.applyMatrix3(this.spaces[t].toXYZ),
                        e.applyMatrix3(this.spaces[n].fromXYZ)),
                    this.spaces[n].transfer === bt && (e.r = sn(e.r),
                        e.g = sn(e.g),
                        e.b = sn(e.b)),
                    e) : e
            },
            fromWorkingColorSpace: function (e, t) {
                return this.convert(e, this.workingColorSpace, t)
            },
            toWorkingColorSpace: function (e, t) {
                return this.convert(e, t, this.workingColorSpace)
            },
            getPrimaries: function (e) {
                return this.spaces[e].primaries
            },
            getTransfer: function (e) {
                return e === gt ? yt : this.spaces[e].transfer
            },
            getLuminanceCoefficients: function (e, t = this.workingColorSpace) {
                return e.fromArray(this.spaces[t].luminanceCoefficients)
            },
            define: function (e) {
                Object.assign(this.spaces, e)
            },
            _getMatrix: function (e, t, n) {
                return e.copy(this.spaces[t].toXYZ).multiply(this.spaces[n].fromXYZ)
            },
            _getDrawingBufferColorSpace: function (e) {
                return this.spaces[e].outputColorSpaceConfig.drawingBufferColorSpace
            },
            _getUnpackColorSpace: function (e = this.workingColorSpace) {
                return this.spaces[e].workingColorSpaceConfig.unpackColorSpace
            }
        }
            , t = [.64, .33, .3, .6, .15, .06]
            , n = [.2126, .7152, .0722]
            , i = [.3127, .329];
        return e.define({
            [wt]: {
                primaries: t,
                whitePoint: i,
                transfer: yt,
                toXYZ: en,
                fromXYZ: tn,
                luminanceCoefficients: n,
                workingColorSpaceConfig: {
                    unpackColorSpace: vt
                },
                outputColorSpaceConfig: {
                    drawingBufferColorSpace: vt
                }
            },
            [vt]: {
                primaries: t,
                whitePoint: i,
                transfer: bt,
                toXYZ: en,
                fromXYZ: tn,
                luminanceCoefficients: n,
                outputColorSpaceConfig: {
                    drawingBufferColorSpace: vt
                }
            }
        }),
            e
    }
    const rn = nn();
    function an(e) {
        return e < .04045 ? .0773993808 * e : Math.pow(.9478672986 * e + .0521327014, 2.4)
    }
    function sn(e) {
        return e < .0031308 ? 12.92 * e : 1.055 * Math.pow(e, .41666) - .055
    }
    class Hi {
        constructor(e, t, n) {
            return this.isColor = !0,
                this.r = 1,
                this.g = 1,
                this.b = 1,
                this.set(e, t, n)
        }
        set(e, t, n) {
            if (void 0 === t && void 0 === n) {
                const t = e;
                t && t.isColor ? this.copy(t) : "number" == typeof t ? this.setHex(t) : "string" == typeof t && this.setStyle(t)
            } else
                this.setRGB(e, t, n);
            return this
        }
        setScalar(e) {
            return this.r = e,
                this.g = e,
                this.b = e,
                this
        }
        setHex(e, t = vt) {
            return e = Math.floor(e),
                this.r = (e >> 16 & 255) / 255,
                this.g = (e >> 8 & 255) / 255,
                this.b = (255 & e) / 255,
                rn.toWorkingColorSpace(this, t),
                this
        }
        setRGB(e, t, n, i = rn.workingColorSpace) {
            return this.r = e,
                this.g = t,
                this.b = n,
                rn.toWorkingColorSpace(this, i),
                this
        }
        setHSL(e, t, n, i = rn.workingColorSpace) {
            if (e = Wt(e, 1),
                t = Ft(t, 0, 1),
                n = Ft(n, 0, 1),
                0 === t)
                this.r = this.g = this.b = n;
            else {
                const i = n <= .5 ? n * (1 + t) : n + t - n * t
                    , r = 2 * n - i;
                this.r = Wi(r, i, e + 1 / 3),
                    this.g = Wi(r, i, e),
                    this.b = Wi(r, i, e - 1 / 3)
            }
            return rn.toWorkingColorSpace(this, i),
                this
        }
        setStyle(e, t = vt) {
            function n(t) {
                void 0 !== t && parseFloat(t) < 1 && console.warn("THREE.Color: Alpha component of " + e + " will be ignored.")
            }
            let i;
            if (i = /^(\w+)\(([^\)]*)\)/.exec(e)) {
                let r;
                const a = i[1]
                    , s = i[2];
                switch (a) {
                    case "rgb":
                    case "rgba":
                        if (r = /^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(s))
                            return n(r[4]),
                                this.setRGB(Math.min(255, parseInt(r[1], 10)) / 255, Math.min(255, parseInt(r[2], 10)) / 255, Math.min(255, parseInt(r[3], 10)) / 255, t);
                        if (r = /^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(s))
                            return n(r[4]),
                                this.setRGB(Math.min(100, parseInt(r[1], 10)) / 100, Math.min(100, parseInt(r[2], 10)) / 100, Math.min(100, parseInt(r[3], 10)) / 100, t);
                        break;
                    case "hsl":
                    case "hsla":
                        if (r = /^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(s))
                            return n(r[4]),
                                this.setHSL(parseFloat(r[1]) / 360, parseFloat(r[2]) / 100, parseFloat(r[3]) / 100, t);
                        break;
                    default:
                        console.warn("THREE.Color: Unknown color model " + e)
                }
            } else if (i = /^\#([A-Fa-f\d]+)$/.exec(e)) {
                const n = i[1]
                    , r = n.length;
                if (3 === r)
                    return this.setRGB(parseInt(n.charAt(0), 16) / 15, parseInt(n.charAt(1), 16) / 15, parseInt(n.charAt(2), 16) / 15, t);
                if (6 === r)
                    return this.setHex(parseInt(n, 16), t);
                console.warn("THREE.Color: Invalid hex color " + e)
            } else if (e && e.length > 0)
                return this.setColorName(e, t);
            return this
        }
        setColorName(e, t = vt) {
            const n = zi[e.toLowerCase()];
            return void 0 !== n ? this.setHex(n, t) : console.warn("THREE.Color: Unknown color " + e),
                this
        }
        clone() {
            return new this.constructor(this.r, this.g, this.b)
        }
        copy(e) {
            return this.r = e.r,
                this.g = e.g,
                this.b = e.b,
                this
        }
        copySRGBToLinear(e) {
            return this.r = an(e.r),
                this.g = an(e.g),
                this.b = an(e.b),
                this
        }
        copyLinearToSRGB(e) {
            return this.r = sn(e.r),
                this.g = sn(e.g),
                this.b = sn(e.b),
                this
        }
        convertSRGBToLinear() {
            return this.copySRGBToLinear(this),
                this
        }
        convertLinearToSRGB() {
            return this.copyLinearToSRGB(this),
                this
        }
        getHex(e = vt) {
            return rn.fromWorkingColorSpace(Vi.copy(this), e),
                65536 * Math.round(Ft(255 * Vi.r, 0, 255)) + 256 * Math.round(Ft(255 * Vi.g, 0, 255)) + Math.round(Ft(255 * Vi.b, 0, 255))
        }
        getHexString(e = vt) {
            return ("000000" + this.getHex(e).toString(16)).slice(-6)
        }
        getHSL(e, t = rn.workingColorSpace) {
            rn.fromWorkingColorSpace(Vi.copy(this), t);
            const n = Vi.r
                , i = Vi.g
                , r = Vi.b
                , a = Math.max(n, i, r)
                , s = Math.min(n, i, r);
            let o, l;
            const c = (s + a) / 2;
            if (s === a)
                o = 0,
                    l = 0;
            else {
                const e = a - s;
                switch (l = c <= .5 ? e / (a + s) : e / (2 - a - s),
                a) {
                    case n:
                        o = (i - r) / e + (i < r ? 6 : 0);
                        break;
                    case i:
                        o = (r - n) / e + 2;
                        break;
                    case r:
                        o = (n - i) / e + 4
                }
                o /= 6
            }
            return e.h = o,
                e.s = l,
                e.l = c,
                e
        }
        getRGB(e, t = rn.workingColorSpace) {
            return rn.fromWorkingColorSpace(Vi.copy(this), t),
                e.r = Vi.r,
                e.g = Vi.g,
                e.b = Vi.b,
                e
        }
        getStyle(e = vt) {
            rn.fromWorkingColorSpace(Vi.copy(this), e);
            const t = Vi.r
                , n = Vi.g
                , i = Vi.b;
            return e !== vt ? `color(${e} ${t.toFixed(3)} ${n.toFixed(3)} ${i.toFixed(3)})` : `rgb(${Math.round(255 * t)},${Math.round(255 * n)},${Math.round(255 * i)})`
        }
        offsetHSL(e, t, n) {
            return this.getHSL(Oi),
                this.setHSL(Oi.h + e, Oi.s + t, Oi.l + n)
        }
        add(e) {
            return this.r += e.r,
                this.g += e.g,
                this.b += e.b,
                this
        }
        addColors(e, t) {
            return this.r = e.r + t.r,
                this.g = e.g + t.g,
                this.b = e.b + t.b,
                this
        }
        addScalar(e) {
            return this.r += e,
                this.g += e,
                this.b += e,
                this
        }
        sub(e) {
            return this.r = Math.max(0, this.r - e.r),
                this.g = Math.max(0, this.g - e.g),
                this.b = Math.max(0, this.b - e.b),
                this
        }
        multiply(e) {
            return this.r *= e.r,
                this.g *= e.g,
                this.b *= e.b,
                this
        }
        multiplyScalar(e) {
            return this.r *= e,
                this.g *= e,
                this.b *= e,
                this
        }
        lerp(e, t) {
            return this.r += (e.r - this.r) * t,
                this.g += (e.g - this.g) * t,
                this.b += (e.b - this.b) * t,
                this
        }
        lerpColors(e, t, n) {
            return this.r = e.r + (t.r - e.r) * n,
                this.g = e.g + (t.g - e.g) * n,
                this.b = e.b + (t.b - e.b) * n,
                this
        }
        lerpHSL(e, t) {
            this.getHSL(Oi),
                e.getHSL(Fi);
            const n = Ht(Oi.h, Fi.h, t)
                , i = Ht(Oi.s, Fi.s, t)
                , r = Ht(Oi.l, Fi.l, t);
            return this.setHSL(n, i, r),
                this
        }
        setFromVector3(e) {
            return this.r = e.x,
                this.g = e.y,
                this.b = e.z,
                this
        }
        applyMatrix3(e) {
            const t = this.r
                , n = this.g
                , i = this.b
                , r = e.elements;
            return this.r = r[0] * t + r[3] * n + r[6] * i,
                this.g = r[1] * t + r[4] * n + r[7] * i,
                this.b = r[2] * t + r[5] * n + r[8] * i,
                this
        }
        equals(e) {
            return e.r === this.r && e.g === this.g && e.b === this.b
        }
        fromArray(e, t = 0) {
            return this.r = e[t],
                this.g = e[t + 1],
                this.b = e[t + 2],
                this
        }
        toArray(e = [], t = 0) {
            return e[t] = this.r,
                e[t + 1] = this.g,
                e[t + 2] = this.b,
                e
        }
        fromBufferAttribute(e, t) {
            return this.r = e.getX(t),
                this.g = e.getY(t),
                this.b = e.getZ(t),
                this
        }
        toJSON() {
            return this.getHex()
        }
        *[Symbol.iterator]() {
            yield this.r,
                yield this.g,
                yield this.b
        }
    }

    let Gi = 0;
    class ji extends Dt {
        constructor() {
            super(),
                this.isMaterial = !0,
                Object.defineProperty(this, "id", {
                    value: Gi++
                }),
                this.uuid = Ot(),
                this.name = "",
                this.type = "Material",
                this.blending = 1,
                this.side = 0,
                this.vertexColors = !1,
                this.opacity = 1,
                this.transparent = !1,
                this.alphaHash = !1,
                this.blendSrc = 204,
                this.blendDst = 205,
                this.blendEquation = _,
                this.blendSrcAlpha = null,
                this.blendDstAlpha = null,
                this.blendEquationAlpha = null,
                this.blendColor = new Hi(0, 0, 0),
                this.blendAlpha = 0,
                this.depthFunc = 3,
                this.depthTest = !0,
                this.depthWrite = !0,
                this.stencilWriteMask = 255,
                this.stencilFunc = 519,
                this.stencilRef = 0,
                this.stencilFuncMask = 255,
                this.stencilFail = At,
                this.stencilZFail = At,
                this.stencilZPass = At,
                this.stencilWrite = !1,
                this.clippingPlanes = null,
                this.clipIntersection = !1,
                this.clipShadows = !1,
                this.shadowSide = null,
                this.colorWrite = !0,
                this.precision = null,
                this.polygonOffset = !1,
                this.polygonOffsetFactor = 0,
                this.polygonOffsetUnits = 0,
                this.dithering = !1,
                this.alphaToCoverage = !1,
                this.premultipliedAlpha = !1,
                this.forceSinglePass = !1,
                this.visible = !0,
                this.toneMapped = !0,
                this.userData = {},
                this.version = 0,
                this._alphaTest = 0
        }
        get alphaTest() {
            return this._alphaTest
        }
        set alphaTest(e) {
            this._alphaTest > 0 != e > 0 && this.version++,
                this._alphaTest = e
        }
        onBeforeRender() { }
        onBeforeCompile() { }
        customProgramCacheKey() {
            return this.onBeforeCompile.toString()
        }
        setValues(e) {
            if (void 0 !== e)
                for (const t in e) {
                    const n = e[t];
                    if (void 0 === n) {
                        console.warn(`THREE.Material: parameter '${t}' has value of undefined.`);
                        continue
                    }
                    const i = this[t];
                    void 0 !== i ? i && i.isColor ? i.set(n) : i && i.isVector3 && n && n.isVector3 ? i.copy(n) : this[t] = n : console.warn(`THREE.Material: '${t}' is not a property of THREE.${this.type}.`)
                }
        }
        toJSON(e) {
            const t = void 0 === e || "string" == typeof e;
            t && (e = {
                textures: {},
                images: {}
            });
            const n = {
                metadata: {
                    version: 4.6,
                    type: "Material",
                    generator: "Material.toJSON"
                }
            };
            function i(e) {
                const t = [];
                for (const n in e) {
                    const i = e[n];
                    delete i.metadata,
                        t.push(i)
                }
                return t
            }
            if (n.uuid = this.uuid,
                n.type = this.type,
                "" !== this.name && (n.name = this.name),
                this.color && this.color.isColor && (n.color = this.color.getHex()),
                void 0 !== this.roughness && (n.roughness = this.roughness),
                void 0 !== this.metalness && (n.metalness = this.metalness),
                void 0 !== this.sheen && (n.sheen = this.sheen),
                this.sheenColor && this.sheenColor.isColor && (n.sheenColor = this.sheenColor.getHex()),
                void 0 !== this.sheenRoughness && (n.sheenRoughness = this.sheenRoughness),
                this.emissive && this.emissive.isColor && (n.emissive = this.emissive.getHex()),
                void 0 !== this.emissiveIntensity && 1 !== this.emissiveIntensity && (n.emissiveIntensity = this.emissiveIntensity),
                this.specular && this.specular.isColor && (n.specular = this.specular.getHex()),
                void 0 !== this.specularIntensity && (n.specularIntensity = this.specularIntensity),
                this.specularColor && this.specularColor.isColor && (n.specularColor = this.specularColor.getHex()),
                void 0 !== this.shininess && (n.shininess = this.shininess),
                void 0 !== this.clearcoat && (n.clearcoat = this.clearcoat),
                void 0 !== this.clearcoatRoughness && (n.clearcoatRoughness = this.clearcoatRoughness),
                this.clearcoatMap && this.clearcoatMap.isTexture && (n.clearcoatMap = this.clearcoatMap.toJSON(e).uuid),
                this.clearcoatRoughnessMap && this.clearcoatRoughnessMap.isTexture && (n.clearcoatRoughnessMap = this.clearcoatRoughnessMap.toJSON(e).uuid),
                this.clearcoatNormalMap && this.clearcoatNormalMap.isTexture && (n.clearcoatNormalMap = this.clearcoatNormalMap.toJSON(e).uuid,
                    n.clearcoatNormalScale = this.clearcoatNormalScale.toArray()),
                void 0 !== this.dispersion && (n.dispersion = this.dispersion),
                void 0 !== this.iridescence && (n.iridescence = this.iridescence),
                void 0 !== this.iridescenceIOR && (n.iridescenceIOR = this.iridescenceIOR),
                void 0 !== this.iridescenceThicknessRange && (n.iridescenceThicknessRange = this.iridescenceThicknessRange),
                this.iridescenceMap && this.iridescenceMap.isTexture && (n.iridescenceMap = this.iridescenceMap.toJSON(e).uuid),
                this.iridescenceThicknessMap && this.iridescenceThicknessMap.isTexture && (n.iridescenceThicknessMap = this.iridescenceThicknessMap.toJSON(e).uuid),
                void 0 !== this.anisotropy && (n.anisotropy = this.anisotropy),
                void 0 !== this.anisotropyRotation && (n.anisotropyRotation = this.anisotropyRotation),
                this.anisotropyMap && this.anisotropyMap.isTexture && (n.anisotropyMap = this.anisotropyMap.toJSON(e).uuid),
                this.map && this.map.isTexture && (n.map = this.map.toJSON(e).uuid),
                this.matcap && this.matcap.isTexture && (n.matcap = this.matcap.toJSON(e).uuid),
                this.alphaMap && this.alphaMap.isTexture && (n.alphaMap = this.alphaMap.toJSON(e).uuid),
                this.lightMap && this.lightMap.isTexture && (n.lightMap = this.lightMap.toJSON(e).uuid,
                    n.lightMapIntensity = this.lightMapIntensity),
                this.aoMap && this.aoMap.isTexture && (n.aoMap = this.aoMap.toJSON(e).uuid,
                    n.aoMapIntensity = this.aoMapIntensity),
                this.bumpMap && this.bumpMap.isTexture && (n.bumpMap = this.bumpMap.toJSON(e).uuid,
                    n.bumpScale = this.bumpScale),
                this.normalMap && this.normalMap.isTexture && (n.normalMap = this.normalMap.toJSON(e).uuid,
                    n.normalMapType = this.normalMapType,
                    n.normalScale = this.normalScale.toArray()),
                this.displacementMap && this.displacementMap.isTexture && (n.displacementMap = this.displacementMap.toJSON(e).uuid,
                    n.displacementScale = this.displacementScale,
                    n.displacementBias = this.displacementBias),
                this.roughnessMap && this.roughnessMap.isTexture && (n.roughnessMap = this.roughnessMap.toJSON(e).uuid),
                this.metalnessMap && this.metalnessMap.isTexture && (n.metalnessMap = this.metalnessMap.toJSON(e).uuid),
                this.emissiveMap && this.emissiveMap.isTexture && (n.emissiveMap = this.emissiveMap.toJSON(e).uuid),
                this.specularMap && this.specularMap.isTexture && (n.specularMap = this.specularMap.toJSON(e).uuid),
                this.specularIntensityMap && this.specularIntensityMap.isTexture && (n.specularIntensityMap = this.specularIntensityMap.toJSON(e).uuid),
                this.specularColorMap && this.specularColorMap.isTexture && (n.specularColorMap = this.specularColorMap.toJSON(e).uuid),
                this.envMap && this.envMap.isTexture && (n.envMap = this.envMap.toJSON(e).uuid,
                    void 0 !== this.combine && (n.combine = this.combine)),
                void 0 !== this.envMapRotation && (n.envMapRotation = this.envMapRotation.toArray()),
                void 0 !== this.envMapIntensity && (n.envMapIntensity = this.envMapIntensity),
                void 0 !== this.reflectivity && (n.reflectivity = this.reflectivity),
                void 0 !== this.refractionRatio && (n.refractionRatio = this.refractionRatio),
                this.gradientMap && this.gradientMap.isTexture && (n.gradientMap = this.gradientMap.toJSON(e).uuid),
                void 0 !== this.transmission && (n.transmission = this.transmission),
                this.transmissionMap && this.transmissionMap.isTexture && (n.transmissionMap = this.transmissionMap.toJSON(e).uuid),
                void 0 !== this.thickness && (n.thickness = this.thickness),
                this.thicknessMap && this.thicknessMap.isTexture && (n.thicknessMap = this.thicknessMap.toJSON(e).uuid),
                void 0 !== this.attenuationDistance && this.attenuationDistance !== 1 / 0 && (n.attenuationDistance = this.attenuationDistance),
                void 0 !== this.attenuationColor && (n.attenuationColor = this.attenuationColor.getHex()),
                void 0 !== this.size && (n.size = this.size),
                null !== this.shadowSide && (n.shadowSide = this.shadowSide),
                void 0 !== this.sizeAttenuation && (n.sizeAttenuation = this.sizeAttenuation),
                1 !== this.blending && (n.blending = this.blending),
                0 !== this.side && (n.side = this.side),
                !0 === this.vertexColors && (n.vertexColors = !0),
                this.opacity < 1 && (n.opacity = this.opacity),
                !0 === this.transparent && (n.transparent = !0),
                204 !== this.blendSrc && (n.blendSrc = this.blendSrc),
                205 !== this.blendDst && (n.blendDst = this.blendDst),
                this.blendEquation !== _ && (n.blendEquation = this.blendEquation),
                null !== this.blendSrcAlpha && (n.blendSrcAlpha = this.blendSrcAlpha),
                null !== this.blendDstAlpha && (n.blendDstAlpha = this.blendDstAlpha),
                null !== this.blendEquationAlpha && (n.blendEquationAlpha = this.blendEquationAlpha),
                this.blendColor && this.blendColor.isColor && (n.blendColor = this.blendColor.getHex()),
                0 !== this.blendAlpha && (n.blendAlpha = this.blendAlpha),
                3 !== this.depthFunc && (n.depthFunc = this.depthFunc),
                !1 === this.depthTest && (n.depthTest = this.depthTest),
                !1 === this.depthWrite && (n.depthWrite = this.depthWrite),
                !1 === this.colorWrite && (n.colorWrite = this.colorWrite),
                255 !== this.stencilWriteMask && (n.stencilWriteMask = this.stencilWriteMask),
                519 !== this.stencilFunc && (n.stencilFunc = this.stencilFunc),
                0 !== this.stencilRef && (n.stencilRef = this.stencilRef),
                255 !== this.stencilFuncMask && (n.stencilFuncMask = this.stencilFuncMask),
                this.stencilFail !== At && (n.stencilFail = this.stencilFail),
                this.stencilZFail !== At && (n.stencilZFail = this.stencilZFail),
                this.stencilZPass !== At && (n.stencilZPass = this.stencilZPass),
                !0 === this.stencilWrite && (n.stencilWrite = this.stencilWrite),
                void 0 !== this.rotation && 0 !== this.rotation && (n.rotation = this.rotation),
                !0 === this.polygonOffset && (n.polygonOffset = !0),
                0 !== this.polygonOffsetFactor && (n.polygonOffsetFactor = this.polygonOffsetFactor),
                0 !== this.polygonOffsetUnits && (n.polygonOffsetUnits = this.polygonOffsetUnits),
                void 0 !== this.linewidth && 1 !== this.linewidth && (n.linewidth = this.linewidth),
                void 0 !== this.dashSize && (n.dashSize = this.dashSize),
                void 0 !== this.gapSize && (n.gapSize = this.gapSize),
                void 0 !== this.scale && (n.scale = this.scale),
                !0 === this.dithering && (n.dithering = !0),
                this.alphaTest > 0 && (n.alphaTest = this.alphaTest),
                !0 === this.alphaHash && (n.alphaHash = !0),
                !0 === this.alphaToCoverage && (n.alphaToCoverage = !0),
                !0 === this.premultipliedAlpha && (n.premultipliedAlpha = !0),
                !0 === this.forceSinglePass && (n.forceSinglePass = !0),
                !0 === this.wireframe && (n.wireframe = !0),
                this.wireframeLinewidth > 1 && (n.wireframeLinewidth = this.wireframeLinewidth),
                "round" !== this.wireframeLinecap && (n.wireframeLinecap = this.wireframeLinecap),
                "round" !== this.wireframeLinejoin && (n.wireframeLinejoin = this.wireframeLinejoin),
                !0 === this.flatShading && (n.flatShading = !0),
                !1 === this.visible && (n.visible = !1),
                !1 === this.toneMapped && (n.toneMapped = !1),
                !1 === this.fog && (n.fog = !1),
                Object.keys(this.userData).length > 0 && (n.userData = this.userData),
                t) {
                const t = i(e.textures)
                    , r = i(e.images);
                t.length > 0 && (n.textures = t),
                    r.length > 0 && (n.images = r)
            }
            return n
        }
        clone() {
            return (new this.constructor).copy(this)
        }
        copy(e) {
            this.name = e.name,
                this.blending = e.blending,
                this.side = e.side,
                this.vertexColors = e.vertexColors,
                this.opacity = e.opacity,
                this.transparent = e.transparent,
                this.blendSrc = e.blendSrc,
                this.blendDst = e.blendDst,
                this.blendEquation = e.blendEquation,
                this.blendSrcAlpha = e.blendSrcAlpha,
                this.blendDstAlpha = e.blendDstAlpha,
                this.blendEquationAlpha = e.blendEquationAlpha,
                this.blendColor.copy(e.blendColor),
                this.blendAlpha = e.blendAlpha,
                this.depthFunc = e.depthFunc,
                this.depthTest = e.depthTest,
                this.depthWrite = e.depthWrite,
                this.stencilWriteMask = e.stencilWriteMask,
                this.stencilFunc = e.stencilFunc,
                this.stencilRef = e.stencilRef,
                this.stencilFuncMask = e.stencilFuncMask,
                this.stencilFail = e.stencilFail,
                this.stencilZFail = e.stencilZFail,
                this.stencilZPass = e.stencilZPass,
                this.stencilWrite = e.stencilWrite;
            const t = e.clippingPlanes;
            let n = null;
            if (null !== t) {
                const e = t.length;
                n = new Array(e);
                for (let i = 0; i !== e; ++i)
                    n[i] = t[i].clone()
            }
            return this.clippingPlanes = n,
                this.clipIntersection = e.clipIntersection,
                this.clipShadows = e.clipShadows,
                this.shadowSide = e.shadowSide,
                this.colorWrite = e.colorWrite,
                this.precision = e.precision,
                this.polygonOffset = e.polygonOffset,
                this.polygonOffsetFactor = e.polygonOffsetFactor,
                this.polygonOffsetUnits = e.polygonOffsetUnits,
                this.dithering = e.dithering,
                this.alphaTest = e.alphaTest,
                this.alphaHash = e.alphaHash,
                this.alphaToCoverage = e.alphaToCoverage,
                this.premultipliedAlpha = e.premultipliedAlpha,
                this.forceSinglePass = e.forceSinglePass,
                this.visible = e.visible,
                this.toneMapped = e.toneMapped,
                this.userData = JSON.parse(JSON.stringify(e.userData)),
                this
        }
        dispose() {
            this.dispatchEvent({
                type: "dispose"
            })
        }
        set needsUpdate(e) {
            !0 === e && this.version++
        }
        onBuild() {
            console.warn("Material: onBuild() has been removed.")
        }
    }






    // draco
    class Ws extends ji {
        constructor(e) {
            super(),
                this.isMeshLambertMaterial = !0,
                this.type = "MeshLambertMaterial",
                this.color = new Hi(16777215),
                this.map = null,
                this.lightMap = null,
                this.lightMapIntensity = 1,
                this.aoMap = null,
                this.aoMapIntensity = 1,
                this.emissive = new Hi(0),
                this.emissiveIntensity = 1,
                this.emissiveMap = null,
                this.bumpMap = null,
                this.bumpScale = 1,
                this.normalMap = null,
                this.normalMapType = 0,
                this.normalScale = new Qt(1, 1),
                this.displacementMap = null,
                this.displacementScale = 1,
                this.displacementBias = 0,
                this.specularMap = null,
                this.alphaMap = null,
                this.envMap = null,
                this.envMapRotation = new si,
                this.combine = 0,
                this.reflectivity = 1,
                this.refractionRatio = .98,
                this.wireframe = !1,
                this.wireframeLinewidth = 1,
                this.wireframeLinecap = "round",
                this.wireframeLinejoin = "round",
                this.flatShading = !1,
                this.fog = !0,
                this.setValues(e)
        }
        copy(e) {
            return super.copy(e),
                this.color.copy(e.color),
                this.map = e.map,
                this.lightMap = e.lightMap,
                this.lightMapIntensity = e.lightMapIntensity,
                this.aoMap = e.aoMap,
                this.aoMapIntensity = e.aoMapIntensity,
                this.emissive.copy(e.emissive),
                this.emissiveMap = e.emissiveMap,
                this.emissiveIntensity = e.emissiveIntensity,
                this.bumpMap = e.bumpMap,
                this.bumpScale = e.bumpScale,
                this.normalMap = e.normalMap,
                this.normalMapType = e.normalMapType,
                this.normalScale.copy(e.normalScale),
                this.displacementMap = e.displacementMap,
                this.displacementScale = e.displacementScale,
                this.displacementBias = e.displacementBias,
                this.specularMap = e.specularMap,
                this.alphaMap = e.alphaMap,
                this.envMap = e.envMap,
                this.envMapRotation.copy(e.envMapRotation),
                this.combine = e.combine,
                this.reflectivity = e.reflectivity,
                this.refractionRatio = e.refractionRatio,
                this.wireframe = e.wireframe,
                this.wireframeLinewidth = e.wireframeLinewidth,
                this.wireframeLinecap = e.wireframeLinecap,
                this.wireframeLinejoin = e.wireframeLinejoin,
                this.flatShading = e.flatShading,
                this.fog = e.fog,
                this
        }
    }
    const co = {
        enabled: !1,
        files: {},
        add: function (e, t) {
            !1 !== this.enabled && (this.files[e] = t)
        },
        get: function (e) {
            if (!1 !== this.enabled)
                return this.files[e]
        },
        remove: function (e) {
            delete this.files[e]
        },
        clear: function () {
            this.files = {}
        }
    };
    class ho {
        constructor(e, t, n) {
            const i = this;
            let r, a = !1, s = 0, o = 0;
            const l = [];
            this.onStart = void 0,
                this.onLoad = e,
                this.onProgress = t,
                this.onError = n,
                this.itemStart = function (e) {
                    o++,
                        !1 === a && void 0 !== i.onStart && i.onStart(e, s, o),
                        a = !0
                }
                ,
                this.itemEnd = function (e) {
                    s++,
                        void 0 !== i.onProgress && i.onProgress(e, s, o),
                        s === o && (a = !1,
                            void 0 !== i.onLoad && i.onLoad())
                }
                ,
                this.itemError = function (e) {
                    void 0 !== i.onError && i.onError(e)
                }
                ,
                this.resolveURL = function (e) {
                    return r ? r(e) : e
                }
                ,
                this.setURLModifier = function (e) {
                    return r = e,
                        this
                }
                ,
                this.addHandler = function (e, t) {
                    return l.push(e, t),
                        this
                }
                ,
                this.removeHandler = function (e) {
                    const t = l.indexOf(e);
                    return -1 !== t && l.splice(t, 2),
                        this
                }
                ,
                this.getHandler = function (e) {
                    for (let t = 0, n = l.length; t < n; t += 2) {
                        const n = l[t]
                            , i = l[t + 1];
                        if (n.global && (n.lastIndex = 0),
                            n.test(e))
                            return i
                    }
                    return null
                }
        }
    }
    const uo = new ho;
    class po {
        constructor(e) {
            this.manager = void 0 !== e ? e : uo,
                this.crossOrigin = "anonymous",
                this.withCredentials = !1,
                this.path = "",
                this.resourcePath = "",
                this.requestHeader = {}
        }
        load() { }
        loadAsync(e, t) {
            const n = this;
            return new Promise((function (i, r) {
                n.load(e, i, t, r)
            }
            ))
        }
        parse() { }
        setCrossOrigin(e) {
            return this.crossOrigin = e,
                this
        }
        setWithCredentials(e) {
            return this.withCredentials = e,
                this
        }
        setPath(e) {
            return this.path = e,
                this
        }
        setResourcePath(e) {
            return this.resourcePath = e,
                this
        }
        setRequestHeader(e) {
            return this.requestHeader = e,
                this
        }
    }
    po.DEFAULT_MATERIAL_NAME = "__DEFAULT";

    class Al extends po {
        constructor(e) {
            super(e),
                this.dracoLoader = null,
                this.ktx2Loader = null,
                this.meshoptDecoder = null,
                this.pluginCallbacks = [],
                this.register((function (e) {
                    return new _l(e)
                }
                )),
                this.register((function (e) {
                    return new Tl(e)
                }
                )),
                this.register((function (e) {
                    return new Ul(e)
                }
                )),
                this.register((function (e) {
                    return new zl(e)
                }
                )),
                this.register((function (e) {
                    return new Ol(e)
                }
                )),
                this.register((function (e) {
                    return new Pl(e)
                }
                )),
                this.register((function (e) {
                    return new Il(e)
                }
                )),
                this.register((function (e) {
                    return new Rl(e)
                }
                )),
                this.register((function (e) {
                    return new Ll(e)
                }
                )),
                this.register((function (e) {
                    return new Ml(e)
                }
                )),
                this.register((function (e) {
                    return new Dl(e)
                }
                )),
                this.register((function (e) {
                    return new Cl(e)
                }
                )),
                this.register((function (e) {
                    return new Bl(e)
                }
                )),
                this.register((function (e) {
                    return new Nl(e)
                }
                )),
                this.register((function (e) {
                    return new El(e)
                }
                )),
                this.register((function (e) {
                    return new Fl(e)
                }
                )),
                this.register((function (e) {
                    return new Wl(e)
                }
                ))
        }
        load(e, t, n, i) {
            const r = this;
            let a;
            if ("" !== this.resourcePath)
                a = this.resourcePath;
            else if ("" !== this.path) {
                const t = No.extractUrlBase(e);
                a = No.resolveURL(t, this.path)
            } else
                a = No.extractUrlBase(e);
            this.manager.itemStart(e);
            const s = function (t) {
                i ? i(t) : console.error(t),
                    r.manager.itemError(e),
                    r.manager.itemEnd(e)
            }
                , o = new go(this.manager);
            o.setPath(this.path),
                o.setResponseType("arraybuffer"),
                o.setRequestHeader(this.requestHeader),
                o.setWithCredentials(this.withCredentials),
                o.load(e, (function (n) {
                    try {
                        r.parse(n, a, (function (n) {
                            t(n),
                                r.manager.itemEnd(e)
                        }
                        ), s)
                    } catch (e) {
                        s(e)
                    }
                }
                ), n, s)
        }
        setDRACOLoader(e) {
            return this.dracoLoader = e,
                this
        }
        setKTX2Loader(e) {
            return this.ktx2Loader = e,
                this
        }
        setMeshoptDecoder(e) {
            return this.meshoptDecoder = e,
                this
        }
        register(e) {
            return -1 === this.pluginCallbacks.indexOf(e) && this.pluginCallbacks.push(e),
                this
        }
        unregister(e) {
            return -1 !== this.pluginCallbacks.indexOf(e) && this.pluginCallbacks.splice(this.pluginCallbacks.indexOf(e), 1),
                this
        }
        parse(e, t, n, i) {
            let r;
            const a = {}
                , s = {}
                , o = new TextDecoder;
            if ("string" == typeof e)
                r = JSON.parse(e);
            else if (e instanceof ArrayBuffer) {
                if (o.decode(new Uint8Array(e, 0, 4)) === Hl) {
                    try {
                        a[kl.KHR_BINARY_GLTF] = new jl(e)
                    } catch (e) {
                        return void (i && i(e))
                    }
                    r = JSON.parse(a[kl.KHR_BINARY_GLTF].content)
                } else
                    r = JSON.parse(o.decode(e))
            } else
                r = e;
            if (void 0 === r.asset || r.asset.version[0] < 2)
                return void (i && i(new Error("THREE.GLTFLoader: Unsupported asset. glTF versions >=2.0 are supported.")));
            const l = new gc(r, {
                path: t || this.resourcePath || "",
                crossOrigin: this.crossOrigin,
                requestHeader: this.requestHeader,
                manager: this.manager,
                ktx2Loader: this.ktx2Loader,
                meshoptDecoder: this.meshoptDecoder
            });
            l.fileLoader.setRequestHeader(this.requestHeader);
            for (let e = 0; e < this.pluginCallbacks.length; e++) {
                const t = this.pluginCallbacks[e](l);
                t.name || console.error("THREE.GLTFLoader: Invalid plugin found: missing name"),
                    s[t.name] = t,
                    a[t.name] = !0
            }
            if (r.extensionsUsed)
                for (let e = 0; e < r.extensionsUsed.length; ++e) {
                    const t = r.extensionsUsed[e]
                        , n = r.extensionsRequired || [];
                    switch (t) {
                        case kl.KHR_MATERIALS_UNLIT:
                            a[t] = new Sl;
                            break;
                        case kl.KHR_DRACO_MESH_COMPRESSION:
                            a[t] = new Ql(r, this.dracoLoader);
                            break;
                        case kl.KHR_TEXTURE_TRANSFORM:
                            a[t] = new Kl;
                            break;
                        case kl.KHR_MESH_QUANTIZATION:
                            a[t] = new ql;
                            break;
                        default:
                            n.indexOf(t) >= 0 && void 0 === s[t] && console.warn('THREE.GLTFLoader: Unknown extension "' + t + '".')
                    }
                }
            l.setExtensions(a),
                l.setPlugins(s),
                l.parse(n, i)
        }
        parseAsync(e, t) {
            const n = this;
            return new Promise((function (i, r) {
                n.parse(e, t, i, r)
            }
            ))
        }
    }
    class jB extends po {
        constructor(e) {
            super(e),
                this.decoderPath = "",
                this.decoderConfig = {},
                this.decoderBinary = null,
                this.decoderPending = null,
                this.workerLimit = 4,
                this.workerPool = [],
                this.workerNextTaskID = 1,
                this.workerSourceURL = "",
                this.defaultAttributeIDs = {
                    position: "POSITION",
                    normal: "NORMAL",
                    color: "COLOR",
                    uv: "TEX_COORD"
                },
                this.defaultAttributeTypes = {
                    position: "Float32Array",
                    normal: "Float32Array",
                    color: "Float32Array",
                    uv: "Float32Array"
                }
        }
        setDecoderPath(e) {
            return this.decoderPath = e,
                this
        }
        setDecoderConfig(e) {
            return this.decoderConfig = e,
                this
        }
        setWorkerLimit(e) {
            return this.workerLimit = e,
                this
        }
        load(e, t, n, i) {
            const r = new go(this.manager);
            r.setPath(this.path),
                r.setResponseType("arraybuffer"),
                r.setRequestHeader(this.requestHeader),
                r.setWithCredentials(this.withCredentials),
                r.load(e, (e => {
                    this.parse(e, t, i)
                }
                ), n, i)
        }
        parse(e, t, n = () => { }
        ) {
            this.decodeDracoFile(e, t, null, null, vt, n).catch(n)
        }
        decodeDracoFile(e, t, n, i, r = wt, a = () => { }
        ) {
            const s = {
                attributeIDs: n || this.defaultAttributeIDs,
                attributeTypes: i || this.defaultAttributeTypes,
                useUniqueIDs: !!n,
                vertexColorSpace: r
            };
            return this.decodeGeometry(e, s).then(t).catch(a)
        }
        decodeGeometry(e, t) {
            const n = JSON.stringify(t);
            if (GB.has(e)) {
                const t = GB.get(e);
                if (t.key === n)
                    return t.promise;
                if (0 === e.byteLength)
                    throw new Error("THREE.DRACOLoader: Unable to re-decode a buffer with different settings. Buffer has already been transferred.")
            }
            let i;
            const r = this.workerNextTaskID++
                , a = e.byteLength
                , s = this._getWorker(r, a).then((n => (i = n,
                    new Promise(((n, a) => {
                        i._callbacks[r] = {
                            resolve: n,
                            reject: a
                        },
                            i.postMessage({
                                type: "decode",
                                id: r,
                                taskConfig: t,
                                buffer: e
                            }, [e])
                    }
                    ))))).then((e => this._createGeometry(e.geometry)));
            return s.catch((() => !0)).then((() => {
                i && r && this._releaseTask(i, r)
            }
            )),
                GB.set(e, {
                    key: n,
                    promise: s
                }),
                s
        }
        _createGeometry(e) {
            const t = new or;
            e.index && t.setIndex(new Xi(e.index.array, 1));
            for (let n = 0; n < e.attributes.length; n++) {
                const i = e.attributes[n]
                    , r = i.name
                    , a = i.array
                    , s = i.itemSize
                    , o = new Xi(a, s);
                "color" === r && (this._assignVertexColorSpace(o, i.vertexColorSpace),
                    o.normalized = a instanceof Float32Array == !1),
                    t.setAttribute(r, o)
            }
            return t
        }
        _assignVertexColorSpace(e, t) {
            if (t !== vt)
                return;
            const n = new Hi;
            for (let t = 0, i = e.count; t < i; t++)
                n.fromBufferAttribute(e, t),
                    rn.toWorkingColorSpace(n, vt),
                    e.setXYZ(t, n.r, n.g, n.b)
        }
        _loadLibrary(e, t) {
            const n = new go(this.manager);
            return n.setPath(this.decoderPath),
                n.setResponseType(t),
                n.setWithCredentials(this.withCredentials),
                new Promise(((t, i) => {
                    n.load(e, t, void 0, i)
                }
                ))
        }
        preload() {
            return this._initDecoder(),
                this
        }
        _initDecoder() {
            if (this.decoderPending)
                return this.decoderPending;
            const e = "object" != typeof WebAssembly || "js" === this.decoderConfig.type
                , t = [];
            return e ? t.push(this._loadLibrary("draco_decoder.js", "text")) : (t.push(this._loadLibrary("draco_wasm_wrapper.js", "text")),
                t.push(this._loadLibrary("draco_decoder.wasm", "arraybuffer"))),
                this.decoderPending = Promise.all(t).then((t => {
                    const n = t[0];
                    e || (this.decoderConfig.wasmBinary = t[1]);
                    const i = QB.toString()
                        , r = ["/* draco decoder */", n, "", "/* worker */", i.substring(i.indexOf("{") + 1, i.lastIndexOf("}"))].join("\n");
                    this.workerSourceURL = URL.createObjectURL(new Blob([r]))
                }
                )),
                this.decoderPending
        }
        _getWorker(e, t) {
            return this._initDecoder().then((() => {
                if (this.workerPool.length < this.workerLimit) {
                    const e = new Worker(this.workerSourceURL);
                    e._callbacks = {},
                        e._taskCosts = {},
                        e._taskLoad = 0,
                        e.postMessage({
                            type: "init",
                            decoderConfig: this.decoderConfig
                        }),
                        e.onmessage = function (t) {
                            const n = t.data;
                            switch (n.type) {
                                case "decode":
                                    e._callbacks[n.id].resolve(n);
                                    break;
                                case "error":
                                    e._callbacks[n.id].reject(n);
                                    break;
                                default:
                                    console.error('THREE.DRACOLoader: Unexpected message, "' + n.type + '"')
                            }
                        }
                        ,
                        this.workerPool.push(e)
                } else
                    this.workerPool.sort((function (e, t) {
                        return e._taskLoad > t._taskLoad ? -1 : 1
                    }
                    ));
                const n = this.workerPool[this.workerPool.length - 1];
                return n._taskCosts[e] = t,
                    n._taskLoad += t,
                    n
            }
            ))
        }
        _releaseTask(e, t) {
            e._taskLoad -= e._taskCosts[t],
                delete e._callbacks[t],
                delete e._taskCosts[t]
        }
        debug() {
            console.log("Task load: ", this.workerPool.map((e => e._taskLoad)))
        }
        dispose() {
            for (let e = 0; e < this.workerPool.length; ++e)
                this.workerPool[e].terminate();
            return this.workerPool.length = 0,
                "" !== this.workerSourceURL && URL.revokeObjectURL(this.workerSourceURL),
                this
        }
    }



























































































    const t = {
        6057: (e, t, n) => {
            "use strict";
            n.d(t, { A: () => o });
            var i = n(1601),
                r = n.n(i),
                a = n(6314),
                s = n.n(a)()(r());
            s.push([
                e.id,
                "\n.editor {\n\tmargin: 0;\n\tpadding: 0;\n\twidth: 100%;\n\theight: 100%;\n}\n\n.editor > .safe-area-left {\n\tposition: absolute;\n\tleft: 0;\n\ttop: 0;\n\twidth: var(--safe-area-left);\n\theight: 100%;\n\tbackground-color: var(--surface-color);\n}\n\n.editor > .safe-area-right {\n\tposition: absolute;\n\tright: 0;\n\ttop: 0;\n\twidth: var(--safe-area-right);\n\theight: 100%;\n\tbackground-color: var(--surface-color);\n}\n\n.editor > .top {\n\tdisplay: block;\n\tmargin: 0;\n\tpadding: 0 var(--safe-area-right) 0 var(--safe-area-left);\n}\n\n.editor > .top > .button-bar {\n\tdisplay: flex;\n\tmargin: 0;\n\tpadding: 0 8px;\n\theight: 68px;\n\tbackground-color: var(--surface-color);\n\twhite-space: nowrap;\n}\n.editor > .top > .button-bar > .button {\n\tmargin: 8px 0;\n\tmin-width: 0;\n\toverflow: hidden;\n\ttext-overflow: ellipsis;\n}\n\n.editor > .top > .track-settings-container {\n\tdisplay: inline-block;\n\tmargin: 0;\n\tpadding: 6px 7px;\n\tclip-path: polygon(0 0, 100% 0, calc(100% - 10px) 100%, 0 100%);\n\tfont-size: 30px;\n\tcolor: var(--text-color);\n\tbackground: var(--surface-secondary-color);\n}\n.editor > .top > .track-settings-container > button {\n\ttext-align: left;\n\tmin-width: 150px;\n\tmax-width: 450px;\n\twhite-space: nowrap;\n\ttext-overflow: ellipsis;\n\toverflow: hidden;\n}\n\n.editor > .side {\n\tposition: absolute;\n\ttop: 68px;\n\tright: 0;\n\tmargin: 0;\n\tpadding: 0 var(--safe-area-right) 0 0;\n\theight: calc(100% - 68px);\n\tdisplay: flex;\n\talign-items: end;\n}\n\n.editor > .side > .container {\n\tdisplay: flex;\n\tflex-direction: column;\n\theight: 100%;\n\tjustify-content: space-between;\n\talign-items: end;\n}\n\n.editor > .side > .container > .undo-container {\n\tmargin: 0;\n\tpadding: 6px 7px;\n\tclip-path: polygon(0 0, 100% 0, 100% 100%, 10px 100%);\n\tfont-size: 30px;\n\tcolor: var(--text-color);\n\tbackground: var(--surface-secondary-color);\n}\n\n.editor > .side > .container > .undo-container > button:first-of-type {\n\tmargin-right: 3px;\n\tclip-path: polygon(0 0, 100% 0, 100% 100%, 8px 100%);\n}\n.editor > .side > .container > .undo-container > button:last-of-type {\n\tmargin-left: 3px;\n\tclip-path: polygon(0 0, 100% 0, calc(100% - 8px) 100%, 0 100%);\n}\n\n.editor > .side > .side-panel {\n\theight: 100%;\n\tbackground-color: var(--surface-secondary-color);\n\tpointer-events: auto;\n}\n\n.editor > .side > .side-panel > .category-panel, .editor > .side > .side-panel > .part-panel, .editor > .side > .side-panel > .color-panel {\n\tdisplay: inline-block;\n\tvertical-align: top;\n\tpadding: 2px 2px 0 2px;\n\theight: 100%;\n\tbox-sizing: border-box;\n\toverflow-x: hidden;\n\toverflow-y: scroll;\n\tscrollbar-width: thin;\n}\n.editor > .side > .side-panel > .category-panel > button > img {\n\twidth: 96px;\n\theight: 96px;\n}\n.editor > .side > .side-panel > .part-panel.hidden {\n\tdisplay: none;\n}\n.editor > .side > .side-panel > .color-panel.hidden {\n\tdisplay: none;\n}\n\n.editor > .side > .side-panel button {\n\tdisplay: block;\n\tmargin: 0 0 2px 0;\n\tpadding: 5px;\n\tbackground-color: var(--button-color);\n\tborder: 2px solid rgb(38, 31, 88);\n\tcursor: pointer;\n}\n.editor > .side > .side-panel button:hover {\n\tbackground-color: var(--button-hover-color);\n}\n@media (hover: none) {\n\t.editor > .side > .side-panel button:hover {\n\t\tbackground-color: var(--button-color);\n\t}\n}\n.editor > .side > .side-panel button:active {\n\tbackground-color: var(--button-active-color);\n}\n.editor > .side > .side-panel button.selected {\n\tbackground-color: var(--button-hover-color);\n\tbox-shadow: inset 0 0 5px #fff;\n\tborder: 2px solid #fff;\n}\n.editor > .side > .side-panel button > img {\n\tdisplay: block;\n\tmargin: 0;\n\tpadding: 0;\n\twidth: 64px;\n\theight: 64px;\n\t-webkit-filter: drop-shadow(0 0 2px #000);\n\tfilter: drop-shadow(0 0 2px #000);\n\tpointer-events: none;\n\ttransition: opacity 0.25s ease-out;\n}\n.editor > .side > .side-panel button > img.loading {\n\topacity: 0;\n\ttransition: none;\n}\n\n.editor > .message {\n\tmargin: 10px;\n\tpadding: 0;\n\tposition: absolute;\n\tfont-size: 30px;\n\tcolor: #ff9696;\n\ttext-shadow: 0 0 5px #000;\n\tpointer-events: none;\n\n\tleft: -10px;\n\topacity: 0;\n}\n.editor > .message.green {\n\tcolor: #96ff96;\n}\n.editor > .message.show {\n\tleft: 0;\n\topacity: 1;\n\ttransition: opacity 0.25s ease-in-out, left 0.25s ease-in-out;\n}\n.editor > .message.hide {\n\tleft: 0;\n\topacity: 0;\n\ttransition: opacity 0.25s ease-in-out, left 0.25s ease-in-out;\n}\n",
                "",
            ]);
            const o = s;
        }
    };
    function i(number) {
        return t[number];
    }







    var xb;
    !(function (e) {
        (e[(e.Default = 0)] = "Default"),
            (e[(e.Summer = 1)] = "Summer"),
            (e[(e.Winter = 2)] = "Winter"),
            (e[(e.Desert = 3)] = "Desert"),
            (e[(e.Custom0 = 32)] = "Custom0"),
            (e[(e.Custom1 = 33)] = "Custom1"),
            (e[(e.Custom2 = 34)] = "Custom2"),
            (e[(e.Custom3 = 35)] = "Custom3"),
            (e[(e.Custom4 = 36)] = "Custom4"),
            (e[(e.Custom5 = 37)] = "Custom5"),
            (e[(e.Custom6 = 38)] = "Custom6"),
            (e[(e.Custom7 = 39)] = "Custom7"),
            (e[(e.Custom8 = 40)] = "Custom8");
    })(xb || (xb = {}));
    const kb = xb;
    var Eb;
    !(function (e) {
        (e[(e.Straight = 0)] = "Straight"),
            (e[(e.TurnSharp = 1)] = "TurnSharp"),
            (e[(e.SlopeUp = 2)] = "SlopeUp"),
            (e[(e.SlopeDown = 3)] = "SlopeDown"),
            (e[(e.Slope = 4)] = "Slope"),
            (e[(e.Start = 5)] = "Start"),
            (e[(e.Finish = 6)] = "Finish"),
            (e[(e.ToWideMiddle = 7)] = "ToWideMiddle"),
            (e[(e.ToWideLeft = 8)] = "ToWideLeft"),
            (e[(e.ToWideRight = 9)] = "ToWideRight"),
            (e[(e.StraightWide = 10)] = "StraightWide"),
            (e[(e.InnerCornerWide = 11)] = "InnerCornerWide"),
            (e[(e.OuterCornerWide = 12)] = "OuterCornerWide"),
            (e[(e.SlopeUpLeftWide = 13)] = "SlopeUpLeftWide"),
            (e[(e.SlopeUpRightWide = 14)] = "SlopeUpRightWide"),
            (e[(e.SlopeDownLeftWide = 15)] = "SlopeDownLeftWide"),
            (e[(e.SlopeDownRightWide = 16)] = "SlopeDownRightWide"),
            (e[(e.SlopeLeftWide = 17)] = "SlopeLeftWide"),
            (e[(e.SlopeRightWide = 18)] = "SlopeRightWide"),
            (e[(e.PillarTop = 19)] = "PillarTop"),
            (e[(e.PillarMiddle = 20)] = "PillarMiddle"),
            (e[(e.PillarBottom = 21)] = "PillarBottom"),
            (e[(e.PillarShort = 22)] = "PillarShort"),
            (e[(e.PlanePillarBottom = 23)] = "PlanePillarBottom"),
            (e[(e.PlanePillarShort = 24)] = "PlanePillarShort"),
            (e[(e.Plane = 25)] = "Plane"),
            (e[(e.PlaneWall = 26)] = "PlaneWall"),
            (e[(e.PlaneWallCorner = 27)] = "PlaneWallCorner"),
            (e[(e.PlaneWallInnerCorner = 28)] = "PlaneWallInnerCorner"),
            (e[(e.Block = 29)] = "Block"),
            (e[(e.WallTrackTop = 30)] = "WallTrackTop"),
            (e[(e.WallTrackMiddle = 31)] = "WallTrackMiddle"),
            (e[(e.WallTrackBottom = 32)] = "WallTrackBottom"),
            (e[(e.PlaneSlopeUp = 33)] = "PlaneSlopeUp"),
            (e[(e.PlaneSlopeDown = 34)] = "PlaneSlopeDown"),
            (e[(e.PlaneSlope = 35)] = "PlaneSlope"),
            (e[(e.TurnShort = 36)] = "TurnShort"),
            (e[(e.TurnLong = 37)] = "TurnLong"),
            (e[(e.SlopeUpLong = 38)] = "SlopeUpLong"),
            (e[(e.SlopeDownLong = 39)] = "SlopeDownLong"),
            (e[(e.SlopePillar = 40)] = "SlopePillar"),
            (e[(e.TurnSLeft = 41)] = "TurnSLeft"),
            (e[(e.TurnSRight = 42)] = "TurnSRight"),
            (e[(e.IntersectionT = 43)] = "IntersectionT"),
            (e[(e.IntersectionCross = 44)] = "IntersectionCross"),
            (e[(e.PillarBranch1 = 45)] = "PillarBranch1"),
            (e[(e.PillarBranch2 = 46)] = "PillarBranch2"),
            (e[(e.PillarBranch3 = 47)] = "PillarBranch3"),
            (e[(e.PillarBranch4 = 48)] = "PillarBranch4"),
            (e[(e.WallTrackBottomCorner = 49)] = "WallTrackBottomCorner"),
            (e[(e.WallTrackMiddleCorner = 50)] = "WallTrackMiddleCorner"),
            (e[(e.WallTrackTopCorner = 51)] = "WallTrackTopCorner"),
            (e[(e.Checkpoint = 52)] = "Checkpoint"),
            (e[(e.HalfBlock = 53)] = "HalfBlock"),
            (e[(e.QuarterBlock = 54)] = "QuarterBlock"),
            (e[(e.HalfPlane = 55)] = "HalfPlane"),
            (e[(e.QuarterPlane = 56)] = "QuarterPlane"),
            (e[(e.PlaneBridge = 57)] = "PlaneBridge"),
            (e[(e.SignArrowLeft = 58)] = "SignArrowLeft"),
            (e[(e.SignArrowRight = 59)] = "SignArrowRight"),
            (e[(e.SignArrowUp = 61)] = "SignArrowUp"),
            (e[(e.SignArrowDown = 62)] = "SignArrowDown"),
            (e[(e.SignWarning = 63)] = "SignWarning"),
            (e[(e.SignWrongWay = 64)] = "SignWrongWay"),
            (e[(e.CheckpointWide = 65)] = "CheckpointWide"),
            (e[(e.WallTrackCeiling = 66)] = "WallTrackCeiling"),
            (e[(e.WallTrackFloor = 67)] = "WallTrackFloor"),
            (e[(e.BlockSlopedDown = 68)] = "BlockSlopedDown"),
            (e[(e.BlockSlopedDownInnerCorner = 69)] =
                "BlockSlopedDownInnerCorner"),
            (e[(e.BlockSlopedDownOuterCorner = 70)] =
                "BlockSlopedDownOuterCorner"),
            (e[(e.BlockSlopedUp = 71)] = "BlockSlopedUp"),
            (e[(e.BlockSlopedUpInnerCorner = 72)] = "BlockSlopedUpInnerCorner"),
            (e[(e.BlockSlopedUpOuterCorner = 73)] = "BlockSlopedUpOuterCorner"),
            (e[(e.FinishWide = 74)] = "FinishWide"),
            (e[(e.PlaneCheckpoint = 75)] = "PlaneCheckpoint"),
            (e[(e.PlaneFinish = 76)] = "PlaneFinish"),
            (e[(e.PlaneCheckpointWide = 77)] = "PlaneCheckpointWide"),
            (e[(e.PlaneFinishWide = 78)] = "PlaneFinishWide"),
            (e[(e.WallTrackBottomInnerCorner = 79)] =
                "WallTrackBottomInnerCorner"),
            (e[(e.WallTrackInnerCorner = 80)] = "WallTrackInnerCorner"),
            (e[(e.WallTrackTopInnerCorner = 81)] = "WallTrackTopInnerCorner"),
            (e[(e.TurnLong2 = 82)] = "TurnLong2"),
            (e[(e.TurnLong3 = 83)] = "TurnLong3"),
            (e[(e.SlopePillarShort = 84)] = "SlopePillarShort"),
            (e[(e.BlockSlopeUp = 85)] = "BlockSlopeUp"),
            (e[(e.BlockSlopeDown = 86)] = "BlockSlopeDown"),
            (e[(e.BlockSlopeVerticalTop = 87)] = "BlockSlopeVerticalTop"),
            (e[(e.BlockSlopeVerticalBottom = 88)] = "BlockSlopeVerticalBottom"),
            (e[(e.PlaneSlopeVerticalBottom = 90)] = "PlaneSlopeVerticalBottom"),
            (e[(e.StartWide = 91)] = "StartWide"),
            (e[(e.PlaneStart = 92)] = "PlaneStart"),
            (e[(e.PlaneStartWide = 93)] = "PlaneStartWide"),
            (e[(e.TurnShortLeftWide = 94)] = "TurnShortLeftWide"),
            (e[(e.TurnShortRightWide = 95)] = "TurnShortRightWide"),
            (e[(e.TurnLongLeftWide = 96)] = "TurnLongLeftWide"),
            (e[(e.TurnLongRightWide = 97)] = "TurnLongRightWide"),
            (e[(e.SlopeUpVertical = 98)] = "SlopeUpVertical"),
            (e[(e.PlaneSlopePillar = 99)] = "PlaneSlopePillar"),
            (e[(e.PlaneSlopePillarShort = 100)] = "PlaneSlopePillarShort"),
            (e[(e.PillarBranch1Top = 101)] = "PillarBranch1Top"),
            (e[(e.PillarBranch1Bottom = 102)] = "PillarBranch1Bottom"),
            (e[(e.PillarBranch1Middle = 103)] = "PillarBranch1Middle"),
            (e[(e.PillarBranch2Top = 104)] = "PillarBranch2Top"),
            (e[(e.PillarBranch2Middle = 105)] = "PillarBranch2Middle"),
            (e[(e.PillarBranch2Bottom = 106)] = "PillarBranch2Bottom"),
            (e[(e.PillarBranch3Top = 107)] = "PillarBranch3Top"),
            (e[(e.PillarBranch3Middle = 108)] = "PillarBranch3Middle"),
            (e[(e.PillarBranch3Bottom = 109)] = "PillarBranch3Bottom"),
            (e[(e.PillarBranch4Top = 110)] = "PillarBranch4Top"),
            (e[(e.PillarBranch4Middle = 111)] = "PillarBranch4Middle"),
            (e[(e.PillarBranch4Bottom = 112)] = "PillarBranch4Bottom"),
            (e[(e.PillarBranch5 = 113)] = "PillarBranch5"),
            (e[(e.PillarBranch5Top = 114)] = "PillarBranch5Top"),
            (e[(e.PillarBranch5Middle = 115)] = "PillarBranch5Middle"),
            (e[(e.PillarBranch5Bottom = 116)] = "PillarBranch5Bottom"),
            (e[(e.ToWideDouble = 117)] = "ToWideDouble"),
            (e[(e.ToWideDiagonal = 118)] = "ToWideDiagonal"),
            (e[(e.StraightPillarBottom = 119)] = "StraightPillarBottom"),
            (e[(e.StraightPillarShort = 120)] = "StraightPillarShort"),
            (e[(e.TurnSharpPillarBottom = 121)] = "TurnSharpPillarBottom"),
            (e[(e.TurnSharpPillarShort = 122)] = "TurnSharpPillarShort"),
            (e[(e.IntersectionTPillarBottom = 123)] =
                "IntersectionTPillarBottom"),
            (e[(e.IntersectionTPillarShort = 124)] = "IntersectionTPillarShort"),
            (e[(e.IntersectionCrossPillarBottom = 125)] =
                "IntersectionCrossPillarBottom"),
            (e[(e.IntersectionCrossPillarShort = 126)] =
                "IntersectionCrossPillarShort"),
            (e[(e.PlaneBridgeCorner = 127)] = "PlaneBridgeCorner"),
            (e[(e.PlaneBridgeIntersectionT = 128)] = "PlaneBridgeIntersectionT"),
            (e[(e.PlaneBridgeIntersectionCross = 129)] =
                "PlaneBridgeIntersectionCross"),
            (e[(e.BlockBridge = 130)] = "BlockBridge"),
            (e[(e.BlockBridgeCorner = 131)] = "BlockBridgeCorner"),
            (e[(e.BlockBridgeIntersectionT = 132)] = "BlockBridgeIntersectionT"),
            (e[(e.BlockBridgeIntersectionCross = 133)] =
                "BlockBridgeIntersectionCross"),
            (e[(e.WallTrackCeilingCorner = 134)] = "WallTrackCeilingCorner"),
            (e[(e.WallTrackCeilingPlaneCorner = 135)] =
                "WallTrackCeilingPlaneCorner"),
            (e[(e.WallTrackFloorCorner = 136)] = "WallTrackFloorCorner"),
            (e[(e.WallTrackFloorPlaneCorner = 137)] =
                "WallTrackFloorPlaneCorner"),
            (e[(e.SlopeUpVerticalLeftWide = 138)] = "SlopeUpVerticalLeftWide"),
            (e[(e.SlopeUpVerticalRightWide = 139)] = "SlopeUpVerticalRightWide"),
            (e[(e.BlockSlopeVerticalCornerTop = 140)] =
                "BlockSlopeVerticalCornerTop"),
            (e[(e.BlockSlopeVerticalCornerBottom = 141)] =
                "BlockSlopeVerticalCornerBottom"),
            (e[(e.WallTrackSlopeToVertical = 142)] = "WallTrackSlopeToVertical"),
            (e[(e.PlaneSlopeToVertical = 143)] = "PlaneSlopeToVertical"),
            (e[(e.BlockSlopeToVertical = 144)] = "BlockSlopeToVertical"),
            (e[(e.PlaneSlopeUpLong = 145)] = "PlaneSlopeUpLong"),
            (e[(e.PlaneSlopeDownLong = 146)] = "PlaneSlopeDownLong"),
            (e[(e.SlopeUpLongLeftWide = 147)] = "SlopeUpLongLeftWide"),
            (e[(e.SlopeUpLongRightWide = 148)] = "SlopeUpLongRightWide"),
            (e[(e.SlopeDownLongLeftWide = 149)] = "SlopeDownLongLeftWide"),
            (e[(e.SlopeDownLongRightWide = 150)] = "SlopeDownLongRightWide"),
            (e[(e.BlockSlopeUpLong = 151)] = "BlockSlopeUpLong"),
            (e[(e.BlockSlopeDownLong = 152)] = "BlockSlopeDownLong"),
            (e[(e.BlockSlopeVerticalInnerCornerBottom = 153)] =
                "BlockSlopeVerticalInnerCornerBottom"),
            (e[(e.BlockSlopeVerticalInnerCornerTop = 154)] =
                "BlockSlopeVerticalInnerCornerTop"),
            (e[(e.BlockInnerCorner = 155)] = "BlockInnerCorner");
    })(Eb || (Eb = {}));
    const Sb = Eb;
    var Mb;
    !(function (e) {
        (e[(e.YPositive = 0)] = "YPositive"),
            (e[(e.YNegative = 1)] = "YNegative"),
            (e[(e.XPositive = 2)] = "XPositive"),
            (e[(e.XNegative = 3)] = "XNegative"),
            (e[(e.ZPositive = 4)] = "ZPositive"),
            (e[(e.ZNegative = 5)] = "ZNegative");
    })(Mb || (Mb = {}));
    const _b = Mb;
















    class No {
        static decodeText(e) {
            if (
                (console.warn(
                    "THREE.LoaderUtils: decodeText() has been deprecated with r165 and will be removed with r175. Use TextDecoder instead."
                ),
                    "undefined" != typeof TextDecoder)
            )
                return new TextDecoder().decode(e);
            let t = "";
            for (let n = 0, i = e.length; n < i; n++)
                t += String.fromCharCode(e[n]);
            try {
                return decodeURIComponent(escape(t));
            } catch (e) {
                return t;
            }
        }
        static extractUrlBase(e) {
            const t = e.lastIndexOf("/");
            return -1 === t ? "./" : e.slice(0, t + 1);
        }
        static resolveURL(e, t) {
            return "string" != typeof e || "" === e
                ? ""
                : (/^https?:\/\//i.test(t) &&
                    /^\//.test(e) &&
                    (t = t.replace(/(^https?:\/\/[^\/]+).*/i, "$1")),
                    /^(https?:)?\/\//i.test(e) ||
                        /^data:.*,.*$/i.test(e) ||
                        /^blob:.*$/i.test(e)
                        ? e
                        : t + e);
        }
    }
    gB = function (e, t, n, i, r) {
        if ("m" === i) throw new TypeError("Private method is not writable");
        if ("a" === i && !r)
            throw new TypeError(
                "Private accessor was defined without a setter"
            );
        if ("function" == typeof t ? e !== t || !r : !t.has(e))
            throw new TypeError(
                "Cannot write private member to an object whose class did not declare it"
            );
        return "a" === i ? r.call(e, n) : r ? (r.value = n) : t.set(e, n), n;
    };
    const fo = {};
    class go extends po {
        constructor(e) {
            super(e);
        }
        load(e, t, n, i) {
            void 0 === e && (e = ""),
                void 0 !== this.path && (e = this.path + e),
                (e = this.manager.resolveURL(e));
            const r = co.get(e);
            if (void 0 !== r)
                return (
                    this.manager.itemStart(e),
                    setTimeout(() => {
                        t && t(r), this.manager.itemEnd(e);
                    }, 0),
                    r
                );
            if (void 0 !== fo[e])
                return void fo[e].push({ onLoad: t, onProgress: n, onError: i });
            (fo[e] = []), fo[e].push({ onLoad: t, onProgress: n, onError: i });
            const a = new Request(e, {
                headers: new Headers(this.requestHeader),
                credentials: this.withCredentials ? "include" : "same-origin",
            }),
                s = this.mimeType,
                o = this.responseType;
            fetch(a)
                .then((t) => {
                    if (200 === t.status || 0 === t.status) {
                        if (
                            (0 === t.status &&
                                console.warn("THREE.FileLoader: HTTP Status 0 received."),
                                "undefined" == typeof ReadableStream ||
                                void 0 === t.body ||
                                void 0 === t.body.getReader)
                        )
                            return t;
                        const n = fo[e],
                            i = t.body.getReader(),
                            r =
                                t.headers.get("X-File-Size") ||
                                t.headers.get("Content-Length"),
                            a = r ? parseInt(r) : 0,
                            s = 0 !== a;
                        let o = 0;
                        const l = new ReadableStream({
                            start(e) {
                                !(function t() {
                                    i.read().then(
                                        ({ done: i, value: r }) => {
                                            if (i) e.close();
                                            else {
                                                o += r.byteLength;
                                                const i = new ProgressEvent("progress", {
                                                    lengthComputable: s,
                                                    loaded: o,
                                                    total: a,
                                                });
                                                for (let e = 0, t = n.length; e < t; e++) {
                                                    const t = n[e];
                                                    t.onProgress && t.onProgress(i);
                                                }
                                                e.enqueue(r), t();
                                            }
                                        },
                                        (t) => {
                                            e.error(t);
                                        }
                                    );
                                })();
                            },
                        });
                        return new Response(l);
                    }
                    throw new mo(
                        `fetch for "${t.url}" responded with ${t.status}: ${t.statusText}`,
                        t
                    );
                })
                .then((e) => {
                    switch (o) {
                        case "arraybuffer":
                            return e.arrayBuffer();
                        case "blob":
                            return e.blob();
                        case "document":
                            return e
                                .text()
                                .then((e) => new DOMParser().parseFromString(e, s));
                        case "json":
                            return e.json();
                        default:
                            if (void 0 === s) return e.text();
                            {
                                const t = /charset="?([^;"\s]*)"?/i.exec(s),
                                    n = t && t[1] ? t[1].toLowerCase() : void 0,
                                    i = new TextDecoder(n);
                                return e.arrayBuffer().then((e) => i.decode(e));
                            }
                    }
                })
                .then((t) => {
                    co.add(e, t);
                    const n = fo[e];
                    delete fo[e];
                    for (let e = 0, i = n.length; e < i; e++) {
                        const i = n[e];
                        i.onLoad && i.onLoad(t);
                    }
                })
                .catch((t) => {
                    const n = fo[e];
                    if (void 0 === n) throw (this.manager.itemError(e), t);
                    delete fo[e];
                    for (let e = 0, i = n.length; e < i; e++) {
                        const i = n[e];
                        i.onError && i.onError(t);
                    }
                    this.manager.itemError(e);
                })
                .finally(() => {
                    this.manager.itemEnd(e);
                }),
                this.manager.itemStart(e);
        }
        setResponseType(e) {
            return (this.responseType = e), this;
        }
        setMimeType(e) {
            return (this.mimeType = e), this;
        }
    }



















































































    qB = new WeakMap,
        YB = new WeakMap,
        KB = new WeakSet,
        XB = function (e, t) {
            var n;
            const i = $B(this, YB, "f").get(e);
            return null == i ? null : null !== (n = i.get(t)) && void 0 !== n ? n : null
        }
        ,
        ZB = function () {
            return JB(this, void 0, void 0, (function* () {
                const e = Object.values(Sb).filter((e => "string" != typeof e));
                let t = !0;
                for (const n of e) {
                    const e = $B(this, qB, "f").get(n);
                    if (null == e)
                        throw new Error("Part with id " + n.toString() + " does not exist");
                    const i = e.physicsShapeVertices;
                    if (null == i)
                        throw new Error("Part model with id " + n.toString() + " has not been loaded yet");
                    const r = yield window.crypto.subtle.digest("SHA-256", i)
                        , a = Array.from(new Uint8Array(r)).map((e => e.toString(16).padStart(2, "0"))).join("");
                    a != e.configuration.checksum && (console.error("Part id " + n.toString() + " " + Sb[n] + " checksum mismatch: " + a + " != " + e.configuration.checksum),
                        t = !1)
                }
                return t
            }
            ))
        };
    var KB, qB, YB, XB, ZB, JB = function (e, t, n, i) {
        return new (n || (n = Promise))((function (r, a) {
            function s(e) {
                try {
                    l(i.next(e))
                } catch (e) {
                    a(e)
                }
            }
            function o(e) {
                try {
                    l(i.throw(e))
                } catch (e) {
                    a(e)
                }
            }
            function l(e) {
                var t;
                e.done ? r(e.value) : (t = e.value,
                    t instanceof n ? t : new n((function (e) {
                        e(t)
                    }
                    ))).then(s, o)
            }
            l((i = i.apply(e, t || [])).next())
        }
        ))
    }, $B = function (e, t, n, i) {
        if ("a" === n && !i)
            throw new TypeError("Private accessor was defined without a getter");
        if ("function" == typeof t ? e !== t || !i : !t.has(e))
            throw new TypeError("Cannot read private member from an object whose class did not declare it");
        return "m" === n ? i : "a" === n ? i.call(e) : i ? i.value : t.get(e)
    };
    function xl() {
        let e = {};
        return {
            get: function (t) {
                return e[t];
            },
            add: function (t, n) {
                e[t] = n;
            },
            remove: function (t) {
                delete e[t];
            },
            removeAll: function () {
                e = {};
            },
        };
    }
    class Bo extends po {
        constructor(e) {
            super(e),
                (this.isImageBitmapLoader = !0),
                "undefined" == typeof createImageBitmap &&
                console.warn(
                    "THREE.ImageBitmapLoader: createImageBitmap() not supported."
                ),
                "undefined" == typeof fetch &&
                console.warn("THREE.ImageBitmapLoader: fetch() not supported."),
                (this.options = { premultiplyAlpha: "none" });
        }
        setOptions(e) {
            return (this.options = e), this;
        }
        load(e, t, n, i) {
            void 0 === e && (e = ""),
                void 0 !== this.path && (e = this.path + e),
                (e = this.manager.resolveURL(e));
            const r = this,
                a = co.get(e);
            if (void 0 !== a)
                return (
                    r.manager.itemStart(e),
                    a.then
                        ? void a
                            .then((n) => {
                                t && t(n), r.manager.itemEnd(e);
                            })
                            .catch((e) => {
                                i && i(e);
                            })
                        : (setTimeout(function () {
                            t && t(a), r.manager.itemEnd(e);
                        }, 0),
                            a)
                );
            const s = {};
            (s.credentials =
                "anonymous" === this.crossOrigin ? "same-origin" : "include"),
                (s.headers = this.requestHeader);
            const o = fetch(e, s)
                .then(function (e) {
                    return e.blob();
                })
                .then(function (e) {
                    return createImageBitmap(
                        e,
                        Object.assign(r.options, { colorSpaceConversion: "none" })
                    );
                })
                .then(function (n) {
                    return co.add(e, n), t && t(n), r.manager.itemEnd(e), n;
                })
                .catch(function (t) {
                    i && i(t),
                        co.remove(e),
                        r.manager.itemError(e),
                        r.manager.itemEnd(e);
                });
            co.add(e, o), r.manager.itemStart(e);
        }
    }
    class _l {
        constructor(e) {
            (this.parser = e), (this.name = kl.KHR_MATERIALS_CLEARCOAT);
        }
        getMaterialType(e) {
            const t = this.parser.json.materials[e];
            return t.extensions && t.extensions[this.name] ? Fs : null;
        }
        extendMaterialParams(e, t) {
            const n = this.parser,
                i = n.json.materials[e];
            if (!i.extensions || !i.extensions[this.name])
                return Promise.resolve();
            const r = [],
                a = i.extensions[this.name];
            if (
                (void 0 !== a.clearcoatFactor && (t.clearcoat = a.clearcoatFactor),
                    void 0 !== a.clearcoatTexture &&
                    r.push(n.assignTexture(t, "clearcoatMap", a.clearcoatTexture)),
                    void 0 !== a.clearcoatRoughnessFactor &&
                    (t.clearcoatRoughness = a.clearcoatRoughnessFactor),
                    void 0 !== a.clearcoatRoughnessTexture &&
                    r.push(
                        n.assignTexture(
                            t,
                            "clearcoatRoughnessMap",
                            a.clearcoatRoughnessTexture
                        )
                    ),
                    void 0 !== a.clearcoatNormalTexture &&
                    (r.push(
                        n.assignTexture(
                            t,
                            "clearcoatNormalMap",
                            a.clearcoatNormalTexture
                        )
                    ),
                        void 0 !== a.clearcoatNormalTexture.scale))
            ) {
                const e = a.clearcoatNormalTexture.scale;
                t.clearcoatNormalScale = new Qt(e, e);
            }
            return Promise.all(r);
        }
    }
    class Tl {
        constructor(e) {
            (this.parser = e), (this.name = kl.KHR_MATERIALS_DISPERSION);
        }
        getMaterialType(e) {
            const t = this.parser.json.materials[e];
            return t.extensions && t.extensions[this.name] ? Fs : null;
        }
        extendMaterialParams(e, t) {
            const n = this.parser.json.materials[e];
            if (!n.extensions || !n.extensions[this.name])
                return Promise.resolve();
            const i = n.extensions[this.name];
            return (
                (t.dispersion = void 0 !== i.dispersion ? i.dispersion : 0),
                Promise.resolve()
            );
        }
    }
    class Cl {
        constructor(e) {
            (this.parser = e), (this.name = kl.KHR_MATERIALS_IRIDESCENCE);
        }
        getMaterialType(e) {
            const t = this.parser.json.materials[e];
            return t.extensions && t.extensions[this.name] ? Fs : null;
        }
        extendMaterialParams(e, t) {
            const n = this.parser,
                i = n.json.materials[e];
            if (!i.extensions || !i.extensions[this.name])
                return Promise.resolve();
            const r = [],
                a = i.extensions[this.name];
            return (
                void 0 !== a.iridescenceFactor &&
                (t.iridescence = a.iridescenceFactor),
                void 0 !== a.iridescenceTexture &&
                r.push(
                    n.assignTexture(t, "iridescenceMap", a.iridescenceTexture)
                ),
                void 0 !== a.iridescenceIor &&
                (t.iridescenceIOR = a.iridescenceIor),
                void 0 === t.iridescenceThicknessRange &&
                (t.iridescenceThicknessRange = [100, 400]),
                void 0 !== a.iridescenceThicknessMinimum &&
                (t.iridescenceThicknessRange[0] = a.iridescenceThicknessMinimum),
                void 0 !== a.iridescenceThicknessMaximum &&
                (t.iridescenceThicknessRange[1] = a.iridescenceThicknessMaximum),
                void 0 !== a.iridescenceThicknessTexture &&
                r.push(
                    n.assignTexture(
                        t,
                        "iridescenceThicknessMap",
                        a.iridescenceThicknessTexture
                    )
                ),
                Promise.all(r)
            );
        }
    }
    const kl = {
        KHR_BINARY_GLTF: "KHR_binary_glTF",
        KHR_DRACO_MESH_COMPRESSION: "KHR_draco_mesh_compression",
        KHR_LIGHTS_PUNCTUAL: "KHR_lights_punctual",
        KHR_MATERIALS_CLEARCOAT: "KHR_materials_clearcoat",
        KHR_MATERIALS_DISPERSION: "KHR_materials_dispersion",
        KHR_MATERIALS_IOR: "KHR_materials_ior",
        KHR_MATERIALS_SHEEN: "KHR_materials_sheen",
        KHR_MATERIALS_SPECULAR: "KHR_materials_specular",
        KHR_MATERIALS_TRANSMISSION: "KHR_materials_transmission",
        KHR_MATERIALS_IRIDESCENCE: "KHR_materials_iridescence",
        KHR_MATERIALS_ANISOTROPY: "KHR_materials_anisotropy",
        KHR_MATERIALS_UNLIT: "KHR_materials_unlit",
        KHR_MATERIALS_VOLUME: "KHR_materials_volume",
        KHR_TEXTURE_BASISU: "KHR_texture_basisu",
        KHR_TEXTURE_TRANSFORM: "KHR_texture_transform",
        KHR_MESH_QUANTIZATION: "KHR_mesh_quantization",
        KHR_MATERIALS_EMISSIVE_STRENGTH: "KHR_materials_emissive_strength",
        EXT_MATERIALS_BUMP: "EXT_materials_bump",
        EXT_TEXTURE_WEBP: "EXT_texture_webp",
        EXT_TEXTURE_AVIF: "EXT_texture_avif",
        EXT_MESHOPT_COMPRESSION: "EXT_meshopt_compression",
        EXT_MESH_GPU_INSTANCING: "EXT_mesh_gpu_instancing",
    };
    const Hl = "glTF",
        Vl = 1313821514,
        Gl = 5130562;
    class jl {
        constructor(e) {
            (this.name = kl.KHR_BINARY_GLTF),
                (this.content = null),
                (this.body = null);
            const t = new DataView(e, 0, 12),
                n = new TextDecoder();
            if (
                ((this.header = {
                    magic: n.decode(new Uint8Array(e.slice(0, 4))),
                    version: t.getUint32(4, !0),
                    length: t.getUint32(8, !0),
                }),
                    this.header.magic !== Hl)
            )
                throw new Error(
                    "THREE.GLTFLoader: Unsupported glTF-Binary header."
                );
            if (this.header.version < 2)
                throw new Error("THREE.GLTFLoader: Legacy binary file detected.");
            const i = this.header.length - 12,
                r = new DataView(e, 12);
            let a = 0;
            for (; a < i;) {
                const t = r.getUint32(a, !0);
                a += 4;
                const i = r.getUint32(a, !0);
                if (((a += 4), i === Vl)) {
                    const i = new Uint8Array(e, 12 + a, t);
                    this.content = n.decode(i);
                } else if (i === Gl) {
                    const n = 12 + a;
                    this.body = e.slice(n, n + t);
                }
                a += t;
            }
            if (null === this.content)
                throw new Error("THREE.GLTFLoader: JSON content not found.");
        }
    }
    function QB() {
        let e, t;
        function n(e, t, n, i, r, a) {
            const s = a.num_components(),
                o = n.num_points() * s,
                l = o * r.BYTES_PER_ELEMENT,
                c = (function (e, t) {
                    switch (t) {
                        case Float32Array:
                            return e.DT_FLOAT32;
                        case Int8Array:
                            return e.DT_INT8;
                        case Int16Array:
                            return e.DT_INT16;
                        case Int32Array:
                            return e.DT_INT32;
                        case Uint8Array:
                            return e.DT_UINT8;
                        case Uint16Array:
                            return e.DT_UINT16;
                        case Uint32Array:
                            return e.DT_UINT32;
                    }
                })(e, r),
                h = e._malloc(l);
            t.GetAttributeDataArrayForAllPoints(n, a, c, l, h);
            const d = new r(e.HEAPF32.buffer, h, o).slice();
            return e._free(h), { name: i, array: d, itemSize: s };
        }
        onmessage = function (i) {
            const r = i.data;
            switch (r.type) {
                case "init":
                    (e = r.decoderConfig),
                        (t = new Promise(function (t) {
                            (e.onModuleLoaded = function (e) {
                                t({ draco: e });
                            }),
                                DracoDecoderModule(e);
                        }));
                    break;
                case "decode":
                    const i = r.buffer,
                        a = r.taskConfig;
                    t.then((e) => {
                        const t = e.draco,
                            s = new t.Decoder();
                        try {
                            const e = (function (e, t, i, r) {
                                const a = r.attributeIDs,
                                    s = r.attributeTypes;
                                let o, l;
                                const c = t.GetEncodedGeometryType(i);
                                if (c === e.TRIANGULAR_MESH)
                                    (o = new e.Mesh()),
                                        (l = t.DecodeArrayToMesh(i, i.byteLength, o));
                                else {
                                    if (c !== e.POINT_CLOUD)
                                        throw new Error(
                                            "THREE.DRACOLoader: Unexpected geometry type."
                                        );
                                    (o = new e.PointCloud()),
                                        (l = t.DecodeArrayToPointCloud(i, i.byteLength, o));
                                }
                                if (!l.ok() || 0 === o.ptr)
                                    throw new Error(
                                        "THREE.DRACOLoader: Decoding failed: " + l.error_msg()
                                    );
                                const h = { index: null, attributes: [] };
                                for (const i in a) {
                                    const l = self[s[i]];
                                    let c, d;
                                    if (r.useUniqueIDs)
                                        (d = a[i]), (c = t.GetAttributeByUniqueId(o, d));
                                    else {
                                        if (((d = t.GetAttributeId(o, e[a[i]])), -1 === d))
                                            continue;
                                        c = t.GetAttribute(o, d);
                                    }
                                    const u = n(e, t, o, i, l, c);
                                    "color" === i &&
                                        (u.vertexColorSpace = r.vertexColorSpace),
                                        h.attributes.push(u);
                                }
                                c === e.TRIANGULAR_MESH &&
                                    (h.index = (function (e, t, n) {
                                        const i = n.num_faces(),
                                            r = 3 * i,
                                            a = 4 * r,
                                            s = e._malloc(a);
                                        t.GetTrianglesUInt32Array(n, a, s);
                                        const o = new Uint32Array(
                                            e.HEAPF32.buffer,
                                            s,
                                            r
                                        ).slice();
                                        return e._free(s), { array: o, itemSize: 1 };
                                    })(e, t, o));
                                return e.destroy(o), h;
                            })(t, s, new Int8Array(i), a),
                                o = e.attributes.map((e) => e.array.buffer);
                            e.index && o.push(e.index.array.buffer),
                                self.postMessage(
                                    { type: "decode", id: r.id, geometry: e },
                                    o
                                );
                        } catch (e) {
                            console.error(e),
                                self.postMessage({
                                    type: "error",
                                    id: r.id,
                                    error: e.message,
                                });
                        } finally {
                            t.destroy(s);
                        }
                    });
            }
        };
    }











































    var dB,
        uB,
        pB,
        fB,
        mB = function (e, t, n, i) {
            if ("a" === n && !i)
                throw new TypeError(
                    "Private accessor was defined without a getter"
                );
            if ("function" == typeof t ? e !== t || !i : !t.has(e))
                throw new TypeError(
                    "Cannot read private member from an object whose class did not declare it"
                );
            return "m" === n ? i : "a" === n ? i.call(e) : i ? i.value : t.get(e);
        },
        gB = function (e, t, n, i, r) {
            if ("m" === i) throw new TypeError("Private method is not writable");
            if ("a" === i && !r)
                throw new TypeError(
                    "Private accessor was defined without a setter"
                );
            if ("function" == typeof t ? e !== t || !r : !t.has(e))
                throw new TypeError(
                    "Cannot write private member to an object whose class did not declare it"
                );
            return "a" === i ? r.call(e, n) : r ? (r.value = n) : t.set(e, n), n;
        };







    const hA = class {
        constructor() {
            tA.add(this),
                nA.set(this, void 0),
                iA.set(this, null),
                rA.set(this, 0),
                aA.set(this, 0),
                sA.set(this, 0);
            const e = document.getElementById("ui");
            if (null == e)
                throw new Error("UI element not found");
            lA(this, nA, e, "f")
        }
        show() {
            lA(this, iA, document.createElement("div"), "f"),
                cA(this, iA, "f").className = "debug",
                cA(this, nA, "f").appendChild(cA(this, iA, "f")),
                cA(this, tA, "m", oA).call(this)
        }
        hide() {
            null != cA(this, iA, "f") && (cA(this, nA, "f").removeChild(cA(this, iA, "f")),
                lA(this, iA, null, "f"))
        }
        toggle() {
            null != cA(this, iA, "f") ? this.hide() : this.show()
        }
        update(e) {
            lA(this, rA, cA(this, rA, "f") + e, "f"),
                lA(this, aA, cA(this, aA, "f") + 1, "f"),
                cA(this, rA, "f") >= 1 && (lA(this, sA, cA(this, aA, "f"), "f"),
                    lA(this, rA, cA(this, rA, "f") - Math.trunc(cA(this, rA, "f")), "f"),
                    lA(this, aA, 0, "f"),
                    cA(this, tA, "m", oA).call(this))
        }
    }
        ;
    /*var dA = i(6057)
        , uA = {};
    uA.styleTagTransform = u(),
        uA.setAttributes = l(),
        uA.insert = s().bind(null, "head"),
        uA.domAPI = r(),
        uA.insertStyleElement = h();
    t()(dA.A, uA);
    dA.A && dA.A.locals && dA.A.locals;
    class pA extends dy {
        constructor(e, t) {
            super(e, t),
                this.screenSpacePanning = !1,
                this.mouseButtons = {
                    LEFT: y,
                    MIDDLE: w,
                    RIGHT: v
                },
                this.touches = {
                    ONE: A,
                    TWO: k
                }
        }
    }*/
    class fA extends po {
        constructor(e) {
            super(e)
        }
        load(e, t, n, i) {
            const r = this
                , a = new go(this.manager);
            a.setPath(this.path),
                a.setRequestHeader(this.requestHeader),
                a.setWithCredentials(this.withCredentials),
                a.load(e, (function (e) {
                    const n = r.parse(JSON.parse(e));
                    t && t(n)
                }
                ), n, i)
        }
        parse(e) {
            return new mA(e)
        }
    }
    class mA {
        constructor(e) {
            this.isFont = !0,
                this.type = "Font",
                this.data = e
        }
        generateShapes(e, t = 100) {
            const n = []
                , i = function (e, t, n) {
                    const i = Array.from(e)
                        , r = t / n.resolution
                        , a = (n.boundingBox.yMax - n.boundingBox.yMin + n.underlineThickness) * r
                        , s = [];
                    let o = 0
                        , l = 0;
                    for (let e = 0; e < i.length; e++) {
                        const t = i[e];
                        if ("\n" === t)
                            o = 0,
                                l -= a;
                        else {
                            const e = gA(t, r, o, l, n);
                            o += e.offsetX,
                                s.push(e.path)
                        }
                    }
                    return s
                }(e, t, this.data);
            for (let e = 0, t = i.length; e < t; e++)
                n.push(...i[e].toShapes());
            return n
        }
    }
    function gA(e, t, n, i, r) {
        const a = r.glyphs[e] || r.glyphs["?"];
        if (!a)
            return void console.error('THREE.Font: character "' + e + '" does not exists in font family ' + r.familyName + ".");
        const s = new Xo;
        let o, l, c, h, d, u, p, f;
        if (a.o) {
            const e = a._cachedOutline || (a._cachedOutline = a.o.split(" "));
            for (let r = 0, a = e.length; r < a;) {
                switch (e[r++]) {
                    case "m":
                        o = e[r++] * t + n,
                            l = e[r++] * t + i,
                            s.moveTo(o, l);
                        break;
                    case "l":
                        o = e[r++] * t + n,
                            l = e[r++] * t + i,
                            s.lineTo(o, l);
                        break;
                    case "q":
                        c = e[r++] * t + n,
                            h = e[r++] * t + i,
                            d = e[r++] * t + n,
                            u = e[r++] * t + i,
                            s.quadraticCurveTo(d, u, c, h);
                        break;
                    case "b":
                        c = e[r++] * t + n,
                            h = e[r++] * t + i,
                            d = e[r++] * t + n,
                            u = e[r++] * t + i,
                            p = e[r++] * t + n,
                            f = e[r++] * t + i,
                            s.bezierCurveTo(d, u, p, f, c, h)
                }
            }
        }
        return {
            offsetX: a.ha * t,
            path: s
        }
    }
    var vA = i(1312);
    const wA = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9"]
        , yA = [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, -1, -1, -1, -1, -1, -1, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, -1, -1, -1, -1, -1, -1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51];
    function bA(e) {
        let t = 0
            , n = "";
        for (; t < 8 * e.length;) {
            const i = xA(e, t);
            let r;
            30 & ~i ? (r = i,
                t += 6) : (r = 31 & i,
                    t += 5),
                n += wA[r]
        }
        return n
    }
    function AA(e) {
        let t = 0;
        const n = []
            , i = e.length;
        for (let r = 0; r < i; r++) {
            const a = e.charCodeAt(r);
            if (a >= yA.length)
                return null;
            const s = yA[a];
            if (-1 == s)
                return null;
            30 & ~s ? (kA(n, t, 6, s, r == i - 1),
                t += 6) : (kA(n, t, 5, s, r == i - 1),
                    t += 5)
        }
        return new Uint8Array(n)
    }
    function xA(e, t) {
        if (t >= 8 * e.length)
            throw new Error("Out of range");
        const n = Math.floor(t / 8)
            , i = e[n]
            , r = t - 8 * n;
        if (r <= 2 || n >= e.length - 1)
            return (i & 63 << r) >>> r;
        return (i & 63 << r) >>> r | (e[n + 1] & 63 >>> 8 - r) << 8 - r
    }
    function kA(e, t, n, i, r) {
        const a = Math.floor(t / 8);
        for (; a >= e.length;)
            e.push(0);
        const s = t - 8 * a;
        if (e[a] |= i << s & 255,
            s > 8 - n && !r) {
            const t = a + 1;
            t >= e.length && e.push(0),
                e[t] |= i >> 8 - s
        }
    }
    var EA, SA = function (e, t, n, i, r) {
        if ("m" === i)
            throw new TypeError("Private method is not writable");
        if ("a" === i && !r)
            throw new TypeError("Private accessor was defined without a setter");
        if ("function" == typeof t ? e !== t || !r : !t.has(e))
            throw new TypeError("Cannot write private member to an object whose class did not declare it");
        return "a" === i ? r.call(e, n) : r ? r.value = n : t.set(e, n),
            n
    }, MA = function (e, t, n, i) {
        if ("a" === n && !i)
            throw new TypeError("Private accessor was defined without a getter");
        if ("function" == typeof t ? e !== t || !i : !t.has(e))
            throw new TypeError("Cannot read private member from an object whose class did not declare it");
        return "m" === n ? i : "a" === n ? i.call(e) : i ? i.value : t.get(e)
    };
    class _A {
        constructor(e = 28) {
            if (EA.set(this, void 0),
                !(Number.isSafeInteger(e) && e >= 0 && e < 180))
                throw new Error("Representation is not a safe integer or is out of range");
            SA(this, EA, e, "f")
        }
        clone() {
            return new _A(MA(this, EA, "f"))
        }
        toDegrees() {
            return 2 * MA(this, EA, "f")
        }
        static fromDegrees(e) {
            const t = Math.round(e / 2 % 180);
            return new _A(t)
        }
        getSunPosition() {
            const e = 2 * MA(this, EA, "f") * (Math.PI / 180)
                , t = Math.cos(e)
                , n = Math.sin(e);
            return new bn(t, .78, n).normalize()
        }
        get representation() {
            return MA(this, EA, "f")
        }
    }
    EA = new WeakMap;
    const TA = _A;
    var CA;
    !function (e) {
        e[e.Summer = 0] = "Summer",
            e[e.Winter = 1] = "Winter",
            e[e.Desert = 2] = "Desert"
    }(CA || (CA = {}));
    const PA = CA;
    var IA;
    !function (e) {
        e[e.Special = 0] = "Special",
            e[e.Road = 1] = "Road",
            e[e.RoadTurns = 2] = "RoadTurns",
            e[e.RoadWide = 3] = "RoadWide",
            e[e.Plane = 4] = "Plane",
            e[e.Block = 5] = "Block",
            e[e.WallTrack = 6] = "WallTrack",
            e[e.Pillar = 7] = "Pillar",
            e[e.Sign = 8] = "Sign"
    }(IA || (IA = {}));
    const RA = IA;
    var LA;
    !function (e) {
        e[e.Checkpoint = 0] = "Checkpoint",
            e[e.Finish = 1] = "Finish"
    }(LA || (LA = {}));
    const DA = LA;
    var NA, BA = function (e, t, n, i, r) {
        if ("m" === i)
            throw new TypeError("Private method is not writable");
        if ("a" === i && !r)
            throw new TypeError("Private accessor was defined without a setter");
        if ("function" == typeof t ? e !== t || !r : !t.has(e))
            throw new TypeError("Cannot write private member to an object whose class did not declare it");
        return "a" === i ? r.call(e, n) : r ? r.value = n : t.set(e, n),
            n
    }, UA = function (e, t, n, i) {
        if ("a" === n && !i)
            throw new TypeError("Private accessor was defined without a getter");
        if ("function" == typeof t ? e !== t || !i : !t.has(e))
            throw new TypeError("Cannot read private member from an object whose class did not declare it");
        return "m" === n ? i : "a" === n ? i.call(e) : i ? i.value : t.get(e)
    };
    class zA {
        constructor(e) {
            NA.set(this, void 0);
            const t = [];
            for (const [n, i, r] of e)
                t.push([n, i, r]);
            BA(this, NA, t, "f")
        }
        rotated(e, t) {
            const n = t == _b.YNegative || t == _b.XNegative || t == _b.ZNegative;
            return new zA(UA(this, NA, "f").map((([i, r, a]) => {
                if (n)
                    switch (e) {
                        case 0:
                            break;
                        case 1:
                            [i, a] = [-a - 1, i];
                            break;
                        case 2:
                            [i, a] = [-i - 1, -a - 1];
                            break;
                        case 3:
                            [i, a] = [a, -i - 1];
                            break;
                        default:
                            throw new Error("Invalid rotation")
                    }
                else
                    switch (e) {
                        case 0:
                            break;
                        case 1:
                            [i, a] = [a, -i - 1];
                            break;
                        case 2:
                            [i, a] = [-i - 1, -a - 1];
                            break;
                        case 3:
                            [i, a] = [-a - 1, i];
                            break;
                        default:
                            throw new Error("Invalid rotation")
                    }
                return t == _b.YPositive || (t == _b.YNegative ? [i, r] = [-i - 1, -r - 1] : t == _b.XPositive ? [i, r] = [r, -i - 1] : t == _b.XNegative ? [i, r] = [-r - 1, i] : t == _b.ZPositive ? [r, a] = [-a - 1, r] : [r, a] = [a, -r - 1]),
                    [i, r, a]
            }
            )))
        }
        forEach(e) {
            for (let t = 0; t < UA(this, NA, "f").length; t++) {
                const [n, i, r] = UA(this, NA, "f")[t];
                e(n, i, r, t)
            }
        }
        get length() {
            return UA(this, NA, "f").length
        }
    }
    NA = new WeakMap;
    const OA = zA
        , FA = [{
            id: kb.Summer,
            colors: {}
        }, {
            id: kb.Winter,
            colors: {
                Road: "#5077b2",
                RoadBarrier: "#898989",
                RoadEdgeWhite: "#ffffff",
                RoadEdgeRed: "#1f3d6b",
                BlockSurface: "#878787",
                Pillar: "#2b4d7f",
                PillarEdge: "#071428",
                WallTrack: "#5077b2",
                WallTrackBottom: "#878787",
                WallTrackSides: "#ffffff",
                PlaneWall: "#1f3d6b",
                PlaneWallDetail: "#878787",
                SignYellow: "#1b2a89",
                SignRed: "#841901",
                SignBlack: "#5077b2"
            }
        }, {
            id: kb.Desert,
            colors: {
                Road: "#997240",
                RoadBarrier: "#211001",
                RoadEdgeRed: "#5b2424",
                RoadEdgeWhite: "#510808",
                BlockSurface: "#b78f5b",
                Pillar: "#99713d",
                PillarEdge: "#1c1105",
                WallTrack: "#260b0b",
                WallTrackBottom: "#160606",
                WallTrackSides: "#75562e",
                PlaneWall: "#633030",
                PlaneWallDetail: "#aa8a53",
                SignYellow: "#997240",
                SignRed: "#d80202",
                SignBlack: "#601d1d"
            }
        }]
        , WA = FA.concat([{
            id: kb.Custom0,
            colors: {
                BlockSurface: "#131313"
            }
        }, {
            id: kb.Custom1,
            colors: {
                BlockSurface: "#501b1b"
            }
        }, {
            id: kb.Custom2,
            colors: {
                BlockSurface: "#7f4d2b"
            }
        }, {
            id: kb.Custom3,
            colors: {
                BlockSurface: "#93862d"
            }
        }, {
            id: kb.Custom4,
            colors: {
                BlockSurface: "#2a5e30"
            }
        }, {
            id: kb.Custom5,
            colors: {
                BlockSurface: "#236363"
            }
        }, {
            id: kb.Custom6,
            colors: {
                BlockSurface: "#20244b"
            }
        }, {
            id: kb.Custom7,
            colors: {
                BlockSurface: "#592759"
            }
        }, {
            id: kb.Custom8,
            colors: {
                BlockSurface: "#302318"
            }
        }]);
    class HA {
        constructor(e, t, n, i, r, a, s = null, o = null) {
            const l = [];
            for (const [e, t] of a)
                for (let n = e[0]; n <= t[0]; n++)
                    for (let i = e[1]; i <= t[1]; i++)
                        for (let r = e[2]; r <= t[2]; r++) {
                            if (null != l.find((([e, t, a]) => e == n && t == i && a == r)))
                                throw new Error("Duplicate tile in track part");
                            l.push([n, i, r])
                        }
            this.checksum = e,
                this.category = t,
                this.id = n,
                this.models = i,
                this.colors = r,
                this.tiles = new OA(l),
                this.detector = s,
                this.startOffset = o,
                Object.freeze(this)
        }
    }
    const VA = [new HA("6d94d798abd14dc3bce4e99c180309d993ad43adb5f2c90eef8e350eedafe7cf", RA.Special, Sb.Start, [["Road", "Start"]], FA, [[[-2, 0, -2], [1, 0, 1]]], null, new bn(0, .35, 1.35)), new HA("f29e34b2e05e0a4751109ae564b03fe8878a79cc6b26288f1117ed296d09c5bb", RA.Special, Sb.StartWide, [["RoadWide", "StartWide"]], FA, [[[-2, 0, -2], [5, 0, 1]]], null, new bn(-10, .35, 1.35)), new HA("3c304054f415fbede4f73a43517db04302f38b16fa2cd4e587082b37b75e20e5", RA.Special, Sb.PlaneStart, [["Planes", "PlaneStart"]], FA, [[[-2, 0, -2], [1, 0, 1]]], null, new bn(0, .35, 1.35)), new HA("f08710416bdaa3d91d0d43f014e45d421fdb4587a334993bad0056f3dbbcb6bb", RA.Special, Sb.PlaneStartWide, [["Planes", "PlaneStartWide"]], FA, [[[-2, 0, -2], [5, 0, 1]]], null, new bn(-10, .35, 1.35)), new HA("223fc87c72bb64b58677062ffa08ab7eafd78071bced7c53233606763cd5316b", RA.Special, Sb.Checkpoint, [["Road", "Checkpoint"]], FA, [[[-2, 0, -2], [1, 0, 1]]], {
        type: DA.Checkpoint,
        center: [0, 2.2, 0],
        size: [10.5, 3.8, 1]
    }), new HA("82d9a9879cee92c04c8d4ba2e16fc31bb1917a31f5802a3bb5177ca9a5cfee01", RA.Special, Sb.CheckpointWide, [["RoadWide", "CheckpointWide"]], FA, [[[-2, 0, -2], [5, 0, 1]]], {
        type: DA.Checkpoint,
        center: [10, 2.2, 0],
        size: [30.6, 3.8, 1]
    }), new HA("fe8946d7f09724b5e11f493eb5c2a5b5e3d502b15beaad003f8134ac63558948", RA.Special, Sb.PlaneCheckpoint, [["Planes", "PlaneCheckpoint"]], FA, [[[-2, 0, -2], [1, 0, 1]]], {
        type: DA.Checkpoint,
        center: [0, 2.2, 0],
        size: [18.25, 3.8, 1]
    }), new HA("d486d9b851db35dd44c15f9e0bb3bf582118daf7be514598a19307f61cf46678", RA.Special, Sb.PlaneCheckpointWide, [["Planes", "PlaneCheckpointWide"]], FA, [[[-2, 0, -2], [5, 0, 1]]], {
        type: DA.Checkpoint,
        center: [10, 2.2, 0],
        size: [38.25, 3.8, 1]
    }), new HA("c01200d573a3594a6a4cb73ebb600964d653e4a89267d3297f3969220742aa79", RA.Special, Sb.Finish, [["Road", "Finish"]], FA, [[[-2, 0, -2], [1, 0, 1]]], {
        type: DA.Finish,
        center: [0, 2.2, 0],
        size: [10.5, 3.8, 2]
    }), new HA("a9cefdff816e94a643210c58582c2809de0e3e0e0478b8d5baabd7fe81f13e73", RA.Special, Sb.FinishWide, [["RoadWide", "FinishWide"]], FA, [[[-2, 0, -2], [5, 0, 1]]], {
        type: DA.Finish,
        center: [10, 2.2, 0],
        size: [30.6, 3.8, 2]
    }), new HA("75e5f09fe8a18ecafaf1fb80929173ef0a7dc0b785596bbe0ccd85a934d79578", RA.Special, Sb.PlaneFinish, [["Planes", "PlaneFinish"]], FA, [[[-2, 0, -2], [1, 0, 1]]], {
        type: DA.Finish,
        center: [0, 2.2, 0],
        size: [18.25, 3.8, 2]
    }), new HA("5801b3268c75809728c63450d06000c5f6fcfd5d72691902f99d7d19d25e1d78", RA.Special, Sb.PlaneFinishWide, [["Planes", "PlaneFinishWide"]], FA, [[[-2, 0, -2], [5, 0, 1]]], {
        type: DA.Finish,
        center: [10, 2.2, 0],
        size: [38.25, 3.8, 2]
    }), new HA("3421096c1986d008da88b5fac64cd4c475603138c9bf8a98ab6d581dda6befa7", RA.Road, Sb.Straight, [["Road", "Straight"]], FA, [[[-2, 0, -2], [1, 0, 1]]]), new HA("bdc3bcdafec9bc26835dc76159f7223da7da5babb3a5770129fa11046c748b69", RA.Road, Sb.StraightPillarBottom, [["Road", "Straight"], ["Pillar", "SurfacePillarBottom"]], FA, [[[-2, 0, -2], [1, 0, 1]]]), new HA("2758e984d87b3170f6618c9c689554ef169fd5f80ea7f0df292ffd69792d414e", RA.Road, Sb.StraightPillarShort, [["Road", "Straight"], ["Pillar", "SurfacePillarShort"]], FA, [[[-2, 0, -2], [1, 0, 1]]]), new HA("fb5a81784022cfc2d3d0007a032976c8dfd066e72a3bc92f671c98c5cca36aaa", RA.Road, Sb.TurnSharp, [["Road", "TurnSharp"]], FA, [[[-2, 0, -2], [1, 0, 1]]]), new HA("3da2e9a93da06b1376c33486f30a5f02d8c2f125f5b7d8b41166049ecd95f269", RA.Road, Sb.TurnSharpPillarBottom, [["Road", "TurnSharp"], ["Pillar", "SurfacePillarBottom"]], FA, [[[-2, 0, -2], [1, 0, 1]]]), new HA("c642122276547382e37dcb857b130088f4dc0d208dc7fdb6055b2a93080a3ffe", RA.Road, Sb.TurnSharpPillarShort, [["Road", "TurnSharp"], ["Pillar", "SurfacePillarShort"]], FA, [[[-2, 0, -2], [1, 0, 1]]]), new HA("110efb0facc096e1c875e545b075b0effaa1b78d50b97f906aec44796501544b", RA.RoadTurns, Sb.TurnShort, [["Road", "TurnShort"]], FA, [[[-2, 0, 0], [1, 0, 1]], [[-2, 0, -1], [2, 0, -1]], [[-1, 0, -2], [3, 0, -2]], [[-1, 0, -3], [5, 0, -3]], [[0, 0, -4], [5, 0, -4]], [[1, 0, -5], [5, 0, -5]], [[3, 0, -6], [5, 0, -6]]]), new HA("20a164840b0e83f3eac96ba9e3650a30e3b3dec4bb635946e3e9e9a1b74820d2", RA.RoadTurns, Sb.TurnLong, [["Road", "TurnLong"]], FA, [[[-2, 0, -1], [1, 0, 1]], [[-1, 0, -2], [2, 0, -2]], [[-1, 0, -3], [2, 0, -3]], [[-1, 0, -4], [3, 0, -4]], [[0, 0, -5], [4, 0, -5]], [[1, 0, -6], [6, 0, -6]], [[2, 0, -7], [9, 0, -7]], [[3, 0, -8], [9, 0, -8]], [[4, 0, -9], [9, 0, -9]], [[7, 0, -10], [9, 0, -10]]]), new HA("c36dddde35a740c6f01227522bf35e1a450cddbfdd8bde1617873bef0d47c95c", RA.RoadTurns, Sb.TurnLong2, [["Road", "TurnLong2"]], FA, [[[-2, 0, -2], [1, 0, 1]], [[-1, 0, -4], [2, 0, -3]], [[-1, 0, -5], [3, 0, -5]], [[0, 0, -6], [4, 0, -6]], [[0, 0, -7], [5, 0, -7]], [[1, 0, -8], [6, 0, -8]], [[2, 0, -9], [7, 0, -9]], [[3, 0, -10], [9, 0, -10]], [[4, 0, -11], [13, 0, -11]], [[5, 0, -12], [13, 0, -12]], [[7, 0, -13], [13, 0, -13]], [[10, 0, -14], [13, 0, -14]]]), new HA("0ed20c04a941708c23fe6ced4af3f357c0e435f09278e06f3de2806786d44059", RA.RoadTurns, Sb.TurnLong3, [["Road", "TurnLong3"]], FA, [[[-2, 0, -2], [1, 0, 1]], [[-1, 0, -4], [2, 0, -3]], [[-1, 0, -5], [2, 0, -5]], [[0, 0, -6], [3, 0, -6]], [[0, 0, -7], [3, 0, -7]], [[0, 0, -8], [4, 0, -8]], [[1, 0, -9], [5, 0, -9]], [[2, 0, -10], [6, 0, -10]], [[2, 0, -11], [7, 0, -11]], [[3, 0, -12], [8, 0, -12]], [[4, 0, -13], [10, 0, -13]], [[5, 0, -14], [13, 0, -14]], [[7, 0, -15], [17, 0, -15]], [[8, 0, -16], [17, 0, -16]], [[11, 0, -17], [17, 0, -17]], [[14, 0, -18], [17, 0, -18]]]), new HA("034ef287319877f2fcc32fbd6f32415539a4c287dfcd620360386a781adad22a", RA.RoadTurns, Sb.TurnSLeft, [["Road", "TurnS", {
        flipX: !0
    }]], FA, [[[-2, 0, -1], [1, 0, 1]], [[-3, 0, -3], [0, 0, -2]], [[-4, 0, -4], [0, 0, -4]], [[-5, 0, -5], [-1, 0, -5]], [[-5, 0, -7], [-2, 0, -6]], [[-6, 0, -10], [-3, 0, -8]]]), new HA("0d49e9feb603d0899927c7e5184f4f4fdd4363d2e1fd296f0b7b3cf4dbbf0e8d", RA.RoadTurns, Sb.TurnSRight, [["Road", "TurnS"]], FA, [[[-2, 0, -1], [1, 0, 1]], [[-1, 0, -3], [2, 0, -2]], [[-1, 0, -4], [3, 0, -4]], [[0, 0, -5], [4, 0, -5]], [[1, 0, -7], [4, 0, -6]], [[2, 0, -10], [5, 0, -8]]]), new HA("26bca19e63867bc0b755ff6fcca65de296c9d1f109f87540103565eb88a0e03d", RA.RoadTurns, Sb.TurnShortLeftWide, [["RoadWide", "TurnShortLeftWide"]], FA, [[[-2, 0, -1], [1, 0, 1]], [[-1, 0, -2], [1, 0, -2]], [[-1, 0, -4], [5, 0, -3]], [[0, 0, -5], [5, 0, -5]], [[1, 0, -6], [5, 0, -6]], [[2, 0, -7], [9, 0, -7]], [[3, 0, -8], [9, 0, -8]], [[4, 0, -9], [9, 0, -9]], [[7, 0, -10], [9, 0, -10]]]), new HA("e3845854f85dafd8cec193bcbecdac6cb79f625066de29524d5c10c5580611c5", RA.RoadTurns, Sb.TurnShortRightWide, [["RoadWide", "TurnShortRightWide"]], FA, [[[-2, 0, 0], [1, 0, 1]], [[-2, 0, -1], [2, 0, -1]], [[-2, 0, -2], [3, 0, -2]], [[2, 0, -6], [5, 0, -3]]]), new HA("dc6088960a65a55c74353a1e7c8a1ca8ec99e683f6273bf666d6909b288bb84b", RA.RoadTurns, Sb.TurnLongLeftWide, [["RoadWide", "TurnLongLeftWide"]], FA, [[[-2, 0, -2], [1, 0, 1]], [[-1, 0, -5], [1, 0, -3]], [[0, 0, -6], [1, 0, -6]], [[0, 0, -7], [5, 0, -7]], [[1, 0, -8], [5, 0, -8]], [[2, 0, -9], [5, 0, -9]], [[3, 0, -10], [5, 0, -10]], [[4, 0, -11], [13, 0, -11]], [[5, 0, -12], [13, 0, -12]], [[7, 0, -13], [13, 0, -13]], [[10, 0, -14], [13, 0, -14]]]), new HA("0bbb8d6c1e4a325e10643cf45546da725c1ea18e92a3a95f753339629a06ef6c", RA.RoadTurns, Sb.TurnLongRightWide, [["RoadWide", "TurnLongRightWide"]], FA, [[[-2, 0, -1], [1, 0, 1]], [[-2, 0, -3], [2, 0, -2]], [[-2, 0, -4], [3, 0, -4]], [[-2, 0, -5], [4, 0, -5]], [[-2, 0, -6], [6, 0, -6]], [[2, 0, -10], [9, 0, -7]]]), new HA("7d8d1eed719515ba7e48b5ef4a53b6b4bb2bef42496b6b40d2551230435ecb66", RA.Road, Sb.SlopeUp, [["Road", "SlopeUp"]], FA, [[[-2, 0, -2], [1, 0, 1]], [[-2, 1, -2], [1, 1, -2]]]), new HA("d6d54dbf283f7209032541fc6b924dc879d914f253e391cf8b34dde8354661be", RA.Road, Sb.SlopeUpLong, [["Road", "SlopeUpLong"]], FA, [[[-2, 0, -4], [1, 0, 1]], [[-2, 1, -5], [1, 1, -4]], [[-2, 1, -6], [1, 2, -6]]]), new HA("435e8cf33d28e52f75890cba1cb6529991148afd701f9b40e9ab876c11b2c448", RA.Road, Sb.SlopeDown, [["Road", "SlopeDown"]], FA, [[[-2, 0, -2], [1, 0, 1]], [[-2, 1, 0], [1, 1, 1]]]), new HA("01990158f65e5d499030d8c6d0ce80d34c136189ae1a9430d4260ea7a85e91a9", RA.Road, Sb.SlopeDownLong, [["Road", "SlopeDownLong"]], FA, [[[-2, 0, -2], [1, 0, 0]], [[-2, 1, -1], [1, 1, 5]], [[-2, 2, 3], [1, 2, 5]]]), new HA("4afecc8b9bd7a3b074112008831fef6b11f9a55ab8c1e570e3e73c1e92b43c6d", RA.Road, Sb.Slope, [["Road", "Slope"]], FA, [[[-2, 0, 0], [1, 0, 1]], [[-2, 1, -2], [1, 1, 0]], [[-2, 2, -2], [1, 2, -2]]]), new HA("27f9b25126b1006514941bd148c8f19dc2d82022b0c1aa2358f36cb711d4b59c", RA.Road, Sb.SlopePillar, [["Road", "Slope"], ["Pillar", "PillarTopSlope"]], FA, [[[-2, 0, 0], [1, 0, 1]], [[-2, 1, -2], [1, 1, 0]], [[-2, 2, -2], [1, 2, -2]], [[-1, 0, -1], [0, 0, -1]]]), new HA("eb236f0ac4bd895c170db53cb518c8df5167a9db5af4bb4f33f73c02deec5265", RA.Road, Sb.SlopePillarShort, [["Road", "Slope"], ["Pillar", "PillarShortSlope"]], FA, [[[-2, 0, 0], [1, 0, 1]], [[-2, 1, -2], [1, 1, 0]], [[-2, 2, -2], [1, 2, -2]], [[-1, 0, -1], [0, 0, -1]]]), new HA("99cb9068cb3f97e7cbfdbb3f1edc1085ea37514f3d5dd8936bc32089cc066a5c", RA.Road, Sb.SlopeUpVertical, [["Road", "SlopeUpVertical"]], FA, [[[-2, 0, -1], [1, 0, 1]], [[-2, 1, -1], [1, 1, -1]], [[-2, 1, -2], [1, 3, -2]]]), new HA("63628b23e104a3eb3c2ba8189cd408a10fbb6ebcd6fa4359d981e3c3804c13d8", RA.Road, Sb.IntersectionT, [["Road", "IntersectionT"]], FA, [[[-2, 0, -2], [1, 0, 1]]]), new HA("400dc4643653001d283bb13f740593fc2300c547bb4d2a962054ba6aabf3721c", RA.Road, Sb.IntersectionTPillarBottom, [["Road", "IntersectionT"], ["Pillar", "SurfacePillarBottom"]], FA, [[[-2, 0, -2], [1, 0, 1]]]), new HA("60355388650d35fcbddaaac29e0d03bc2ae46db1a05cd23ddd3f2722ec2d409e", RA.Road, Sb.IntersectionTPillarShort, [["Road", "IntersectionT"], ["Pillar", "SurfacePillarShort"]], FA, [[[-2, 0, -2], [1, 0, 1]]]), new HA("74197b3731c2befd03498bf5172859f0b3652f1972c19e43a99bb938769573df", RA.Road, Sb.IntersectionCross, [["Road", "IntersectionCross"]], FA, [[[-2, 0, -2], [1, 0, 1]]]), new HA("464e69b5c4f2667c246ade9ed33fd3e50b49438ed0ab787a086dfe74c217ff6c", RA.Road, Sb.IntersectionCrossPillarBottom, [["Road", "IntersectionCross"], ["Pillar", "SurfacePillarBottom"]], FA, [[[-2, 0, -2], [1, 0, 1]]]), new HA("90004caf354627289265314966f11b5656e6879ca7de10507e6c50cd95254b75", RA.Road, Sb.IntersectionCrossPillarShort, [["Road", "IntersectionCross"], ["Pillar", "SurfacePillarShort"]], FA, [[[-2, 0, -2], [1, 0, 1]]]), new HA("2af8aa6050028dd6ee69b7150e83a6d8819e1848a7b1c782848d3f6448c5091a", RA.RoadWide, Sb.ToWideMiddle, [["RoadWide", "ToWideMiddle"]], FA, [[[-2, 0, -2], [1, 0, 1]]]), new HA("26341cfe6bec34f46b10ffcd9a7706a8156b9ac41ed2cdfd166f9f8d3e9bc8f3", RA.RoadWide, Sb.ToWideLeft, [["RoadWide", "ToWideSide", {
        flipX: !0
    }]], FA, [[[-2, 0, -2], [1, 0, 1]]]), new HA("3f82ebd6c72110b532a20673f8b54c7b25ae5988a51d3793bf383fea8ffcffc3", RA.RoadWide, Sb.ToWideRight, [["RoadWide", "ToWideSide"]], FA, [[[-2, 0, -2], [1, 0, 1]]]), new HA("f5cecce9870f41f8cba7a9fbe631c315370a7a82824d04977ec857dbb1dfed29", RA.RoadWide, Sb.ToWideDouble, [["RoadWide", "ToWideDouble"]], FA, [[[-2, 0, -2], [1, 0, 1]]]), new HA("99dc726611397f81b47459d32c7bfb8232322d1ca976ba9a3e71cc15451d8cfb", RA.RoadWide, Sb.ToWideDiagonal, [["RoadWide", "ToWideDiagonal"]], FA, [[[-2, 0, -2], [1, 0, 1]]]), new HA("47d7e3fb334681911e122babef127881a36a763fb22176854114495802d5ce84", RA.RoadWide, Sb.StraightWide, [["RoadWide", "StraightWide"]], FA, [[[-2, 0, -2], [1, 0, 1]]]), new HA("521adc95ed5a4809eeff7eec872c3d6449e4d6a7e4941d672f1e06a50a6615de", RA.RoadWide, Sb.InnerCornerWide, [["RoadWide", "InnerCornerWide"]], FA, [[[-2, 0, -2], [1, 0, 1]]]), new HA("d82274b362794e3c1772510002d5015dde345f1e72dd675c8bac41cf2331398b", RA.RoadWide, Sb.OuterCornerWide, [["RoadWide", "OuterCornerWide"]], FA, [[[-2, 0, -2], [1, 0, 1]]]), new HA("9b1df4dd4687404adb5789f3b90af39ea6fa65ef741a07b116dc436dc14a2aa1", RA.RoadWide, Sb.SlopeUpLeftWide, [["RoadWide", "SlopeUpWide", {
        flipX: !0
    }]], FA, [[[-2, 0, -2], [1, 0, 1]], [[-2, 1, -2], [1, 1, -2]]]), new HA("651d4e988913b84359ad10e0c4745965b6a388eaa8c9bfbba4b6a50ae6d4f592", RA.RoadWide, Sb.SlopeUpRightWide, [["RoadWide", "SlopeUpWide"]], FA, [[[-2, 0, -2], [1, 0, 1]], [[-2, 1, -2], [1, 1, -2]]]), new HA("848d9930c58e66152090d7853af87c8bb7971e1771d3c337ac1a50aaa4975a78", RA.RoadWide, Sb.SlopeUpLongLeftWide, [["RoadWide", "SlopeUpLongWide", {
        flipX: !0
    }]], FA, [[[-2, 0, -4], [1, 0, 1]], [[-2, 1, -5], [1, 1, -4]], [[-2, 1, -6], [1, 2, -6]]]), new HA("e4d54c6c3b6011a1acfb6766b6b3e7ea0de6f9c6569a5ec88c47968ad4105b2a", RA.RoadWide, Sb.SlopeUpLongRightWide, [["RoadWide", "SlopeUpLongWide"]], FA, [[[-2, 0, -4], [1, 0, 1]], [[-2, 1, -5], [1, 1, -4]], [[-2, 1, -6], [1, 2, -6]]]), new HA("106ad1d4c5aded30cc3ef4cd1bdc40babab84464ce7dbce3b81cc20d55fd615f", RA.RoadWide, Sb.SlopeDownLeftWide, [["RoadWide", "SlopeDownWide", {
        flipX: !0
    }]], FA, [[[-2, 0, -2], [1, 0, 1]], [[-2, 1, 0], [1, 1, 1]]]), new HA("23a693633b8453c7a531de9723e6ca14d0676b1d7a4df7f78278914467b90a27", RA.RoadWide, Sb.SlopeDownRightWide, [["RoadWide", "SlopeDownWide"]], FA, [[[-2, 0, -2], [1, 0, 1]], [[-2, 1, 0], [1, 1, 1]]]), new HA("0f2e33a8b68667e30e80ceaefdb890a77643799d63c7f20672ca3185bbc04270", RA.RoadWide, Sb.SlopeDownLongLeftWide, [["RoadWide", "SlopeDownLongWide", {
        flipX: !0
    }]], FA, [[[-2, 0, -2], [1, 0, 0]], [[-2, 1, -1], [1, 1, 5]], [[-2, 2, 3], [1, 2, 5]]]), new HA("164903518c7efa4890a792017ea2b8125a2c3dae76bba4c6f1f56fb0f7e40ebc", RA.RoadWide, Sb.SlopeDownLongRightWide, [["RoadWide", "SlopeDownLongWide"]], FA, [[[-2, 0, -2], [1, 0, 0]], [[-2, 1, -1], [1, 1, 5]], [[-2, 2, 3], [1, 2, 5]]]), new HA("c20560fd35288c5cc74af61834b9a56efaeacdde55eb793d400b7c5b97904993", RA.RoadWide, Sb.SlopeLeftWide, [["RoadWide", "SlopeWide", {
        flipX: !0
    }]], FA, [[[-2, 0, 0], [1, 0, 1]], [[-2, 1, -2], [1, 1, 0]], [[-2, 2, -2], [1, 2, -2]]]), new HA("b6a26eb3cefee53d4deef24544e5b5c1ecd25e8e8bd7c3070c7947ada55c57c2", RA.RoadWide, Sb.SlopeRightWide, [["RoadWide", "SlopeWide"]], FA, [[[-2, 0, 0], [1, 0, 1]], [[-2, 1, -2], [1, 1, 0]], [[-2, 2, -2], [1, 2, -2]]]), new HA("b598ff14bda99600434b24a619132fec4bffcc535483b9b57b0c8c09c1be1f1b", RA.RoadWide, Sb.SlopeUpVerticalLeftWide, [["RoadWide", "SlopeUpVerticalWide"]], FA, [[[-2, 0, -1], [1, 0, 1]], [[-2, 1, -1], [1, 1, -1]], [[-2, 1, -2], [1, 3, -2]]]), new HA("4e0275d3a01eaca6ec5118b8b816ed292cb7172710cf9b7801068424ab684b22", RA.RoadWide, Sb.SlopeUpVerticalRightWide, [["RoadWide", "SlopeUpVerticalWide", {
        flipX: !0
    }]], FA, [[[-2, 0, -1], [1, 0, 1]], [[-2, 1, -1], [1, 1, -1]], [[-2, 1, -2], [1, 3, -2]]]), new HA("896b47675cc2ff58494979168f6fd36c27c43da29aed6a52fdf80f054630166a", RA.Plane, Sb.Plane, [["Planes", "Plane"]], FA, [[[-2, 0, -2], [1, 0, 1]]]), new HA("dc9afb98a8bb998d3b76c3563385e58c1749e56ff43fbc7577b1f57ba8360702", RA.Plane, Sb.PlanePillarBottom, [["Planes", "Plane"], ["Pillar", "SurfacePillarBottom"]], FA, [[[-2, 0, -2], [1, 0, 1]]]), new HA("f59ad95edd26814236ab30b73f6f4f68003885ef150201a4ace14b832abcf438", RA.Plane, Sb.PlanePillarShort, [["Planes", "Plane"], ["Pillar", "SurfacePillarShort"]], FA, [[[-2, 0, -2], [1, 0, 1]]]), new HA("48247a66b232461083fa2aa36644e7e8779f5b426d474efd375ee7d21d009c9a", RA.Plane, Sb.HalfPlane, [["Planes", "HalfPlane"]], FA, [[[-2, 0, 1], [1, 0, 1]], [[-2, 0, 0], [0, 0, 0]], [[-2, 0, -1], [-1, 0, -1]], [[-2, 0, -2], [-2, 0, -2]]]), new HA("eac8530d1a025291674bf34b206f75700dc8626012d8d33ed398f7aed746dac8", RA.Plane, Sb.QuarterPlane, [["Planes", "QuarterPlane"]], FA, [[[-2, 0, 1], [-2, 0, 1]], [[-2, 0, -1], [-1, 0, 0]], [[-2, 0, -2], [-2, 0, -2]]]), new HA("1da4dcad366aa90a5977e1b20c5d79297106ed3b4f664be04b6b3f6370c105b4", RA.Plane, Sb.PlaneSlopeUp, [["Planes", "PlaneSlopeUp"]], FA, [[[-2, 0, -2], [1, 0, 1]], [[-2, 1, -2], [1, 1, -2]]]), new HA("3e203219ec0ea114da510b37a4c392b90417af796e2b089da6d996e628c0a323", RA.Plane, Sb.PlaneSlopeUpLong, [["Planes", "PlaneSlopeUpLong"]], FA, [[[-2, 0, -4], [1, 0, 1]], [[-2, 1, -5], [1, 1, -4]], [[-2, 1, -6], [1, 2, -6]]]), new HA("053dbf6c03eea5102b67168ccb479d8364233b36c4210aff093928bbb83d859d", RA.Plane, Sb.PlaneSlopeDown, [["Planes", "PlaneSlopeDown"]], FA, [[[-2, 0, -2], [1, 0, 1]], [[-2, 1, 0], [1, 1, 1]]]), new HA("d68121a3cb0ee19cab45adb136e0df6145f43ca9ecbde8a417c02a6d4a75a757", RA.Plane, Sb.PlaneSlopeDownLong, [["Planes", "PlaneSlopeDownLong"]], FA, [[[-2, 0, -2], [1, 0, 0]], [[-2, 1, -1], [1, 1, 5]], [[-2, 2, 3], [1, 2, 5]]]), new HA("67ec222e8fe770a8d728bb76ff571377c261d2f232134d4cb328c9ab772cf3ca", RA.Plane, Sb.PlaneSlope, [["Planes", "PlaneSlope"]], FA, [[[-2, 0, 0], [1, 0, 1]], [[-2, 1, -2], [1, 1, 0]], [[-2, 2, -2], [1, 2, -2]]]), new HA("a52c09d87d37088b68420db07626f274c74f792cb223764624d887a5ed145a2e", RA.Plane, Sb.PlaneSlopePillar, [["Planes", "PlaneSlope"], ["Pillar", "PillarTopSlope"]], FA, [[[-2, 0, 0], [1, 0, 1]], [[-2, 1, -2], [1, 1, 0]], [[-2, 2, -2], [1, 2, -2]], [[-1, 0, -1], [0, 0, -1]]]), new HA("57df805433e706ec946d767d7ff0881f163c2e36bb1db00b0e3259954a787dec", RA.Plane, Sb.PlaneSlopePillarShort, [["Planes", "PlaneSlope"], ["Pillar", "PillarShortSlope"]], FA, [[[-2, 0, 0], [1, 0, 1]], [[-2, 1, -2], [1, 1, 0]], [[-2, 2, -2], [1, 2, -2]], [[-1, 0, -1], [0, 0, -1]]]), new HA("ba0d6ec33647740bf4c60e542d1758095afa3ef451bdaec76c783dd32116e4cb", RA.Plane, Sb.PlaneSlopeVerticalBottom, [["Planes", "PlaneSlopeVertical"]], FA, [[[-2, 0, -1], [1, 0, 1]], [[-2, 1, -1], [1, 1, -1]], [[-2, 1, -2], [1, 3, -2]]]), new HA("78a372de15f3151f901cf7fa7a3983ee6513cf19fa8568f10946e195c5a62515", RA.Plane, Sb.PlaneSlopeToVertical, [["Planes", "PlaneSlopeToVertical"]], FA, [[[-2, 0, 0], [1, 0, 1]], [[-2, 1, -2], [1, 1, 0]], [[-2, 2, -2], [1, 3, -2]]]), new HA("5f6d1ece085d450643f1399af53673dcc6bbbf413094d8dd5ee6816d80e1c8ae", RA.Plane, Sb.PlaneBridge, [["Planes", "PlaneBridge"]], FA, [[[-1, 0, -2], [0, 0, 1]]]), new HA("32b91fc4cdf95f5b7a490d81058522bae14741601dd44c73cc110121aa1dd6e6", RA.Plane, Sb.PlaneBridgeCorner, [["Planes", "PlaneBridgeCorner"]], FA, [[[-1, 0, -1], [0, 0, 1]], [[1, 0, -1], [1, 0, 0]]]), new HA("2db870b1821fb655437bd0527569d5a6843718fa0775682701437432265a1a88", RA.Plane, Sb.PlaneBridgeIntersectionT, [["Planes", "PlaneBridgeIntersectionT"]], FA, [[[-1, 0, -1], [0, 0, 1]], [[1, 0, -1], [1, 0, 0]], [[-2, 0, -1], [-2, 0, 0]]]), new HA("33aa0e7524b74dcdae4aed89856c09d25248c4cab8f70dcc31b347f0a00fcb52", RA.Plane, Sb.PlaneBridgeIntersectionCross, [["Planes", "PlaneBridgeIntersectionCross"]], FA, [[[-1, 0, -1], [0, 0, 1]], [[1, 0, -1], [1, 0, 0]], [[-2, 0, -1], [-2, 0, 0]], [[-1, 0, -2], [0, 0, -2]]]), new HA("bd7cc4ab180fc0a6936fef828ae3a91566b3dd621b888fbcc57c9ac11dcb713b", RA.Plane, Sb.PlaneWall, [["Planes", "PlaneWall"]], FA, [[[-2, 0, 1], [1, 0, 1]]]), new HA("d92568164028bb2e65799abd9dc6ba66cfe8a28515c09fbe5ac175f5966af66a", RA.Plane, Sb.PlaneWallCorner, [["Planes", "PlaneWallCorner"]], FA, [[[-2, 0, 1], [1, 0, 1]], [[1, 0, -2], [1, 0, 0]]]), new HA("792ab5a6f0e2bf8e556575ef12731ec30755855d4394f98eb4ca7ec8b713933c", RA.Plane, Sb.PlaneWallInnerCorner, [["Planes", "PlaneWallInnerCorner"]], FA, [[[1, 0, 1], [1, 0, 1]]]), new HA("de0d588c4b2fe6b32d72a7e0e2984285955f805ccb86d3c269f7155401cd6b20", RA.Block, Sb.Block, [["Blocks", "Block"]], WA, [[[-2, 0, -2], [1, 0, 1]]]), new HA("1ce6b585c0e99d71877fefe015ff16336ae62eb0caebeca62dd09d836092d7b6", RA.Block, Sb.HalfBlock, [["Blocks", "HalfBlock"]], WA, [[[-2, 0, 1], [1, 0, 1]], [[-2, 0, 0], [0, 0, 0]], [[-2, 0, -1], [-1, 0, -1]], [[-2, 0, -2], [-2, 0, -2]]]), new HA("0d5f0609c3c98f687d55d3a73313225c1642f6285ddaca3ed536db742c85958d", RA.Block, Sb.QuarterBlock, [["Blocks", "QuarterBlock"]], WA, [[[-2, 0, 1], [-2, 0, 1]], [[-2, 0, -1], [-1, 0, 0]], [[-2, 0, -2], [-2, 0, -2]]]), new HA("18fc1c569c6fc04f95f10174143d19e7a9ea4e387302363f4ae60883c1acd3f0", RA.Block, Sb.BlockSlopedDown, [["Blocks", "BlockSlopedDown"]], WA, [[[-2, 0, -2], [1, 0, -1]], [[-2, 1, -2], [1, 1, 1]]]), new HA("22dd5b2804c88994a4d283cb822f47de3c72f82376e4c9332d39feae85206c0f", RA.Block, Sb.BlockSlopedDownInnerCorner, [["Blocks", "BlockSlopedDownInnerCorner"]], WA, [[[-2, 0, -2], [-1, 0, 1]], [[0, 0, -2], [1, 0, -1]], [[-2, 1, -2], [1, 1, 1]]]), new HA("81a71b4cc6ef8520f20fd738457abc31b04258c97f9862f70190fd2a0ba91382", RA.Block, Sb.BlockSlopedDownOuterCorner, [["Blocks", "BlockSlopedDownOuterCorner"]], WA, [[[-2, 0, -2], [-1, 0, -1]], [[-2, 1, -2], [1, 1, 1]]]), new HA("f4e19d3bc49994a85fecd187b76c21d258e7f30f0506d90bc6f173336e11627d", RA.Block, Sb.BlockSlopedUp, [["Blocks", "BlockSlopedUp"]], WA, [[[-2, 0, -2], [1, 0, 1]], [[-2, 1, -2], [1, 1, -1]]]), new HA("fd9309468e97131bbbd1404fac34a7137cb176327789b955c1aea30267e1cded", RA.Block, Sb.BlockSlopedUpInnerCorner, [["Blocks", "BlockSlopedUpInnerCorner"]], WA, [[[-2, 1, -2], [-1, 1, 1]], [[0, 1, -2], [1, 1, -1]], [[-2, 0, -2], [1, 0, 1]]]), new HA("1321fb07ece1b80b99dc4671b52673ac028fbf43322e9e652ad633ff6afac21b", RA.Block, Sb.BlockSlopedUpOuterCorner, [["Blocks", "BlockSlopedUpOuterCorner"]], WA, [[[-2, 1, -2], [-1, 1, -1]], [[-2, 0, -2], [1, 0, 1]]]), new HA("b97c17388fc38139f2f5a98a36d94831095f79db709dd97748ad2904bc54d689", RA.Block, Sb.BlockSlopeDown, [["Blocks", "BlockSlopeDown"]], WA, [[[-2, 0, -2], [1, 0, 1]]]), new HA("50276826bbfb9fcb11a8519b8dae8a2b1cf82817d5431418d9a376664261be82", RA.Block, Sb.BlockSlopeUp, [["Blocks", "BlockSlopeUp"]], WA, [[[-2, 0, -2], [1, 0, 1]]]), new HA("63fd3032796397f8e25669c1c1d3fc97b8ec0e5fc88bfcb5c00a2a2c2b517888", RA.Block, Sb.BlockSlopeDownLong, [["Blocks", "BlockSlopeDownLong"]], WA, [[[-2, 0, -2], [1, 0, 5]], [[-2, 1, 0], [1, 1, 5]]]), new HA("2d29131222a8d891b4350e6a2f335b114e001cf22e4e2f170dc9b86c4b2fd325", RA.Block, Sb.BlockSlopeUpLong, [["Blocks", "BlockSlopeUpLong"]], WA, [[[-2, 0, -6], [1, 0, 1]], [[-2, 1, -6], [1, 1, -4]]]), new HA("0bbcd96c91b69e6e8005bfae5b64455b0d6510cb1595f3fca7f77c86ddda4560", RA.Block, Sb.BlockSlopeVerticalTop, [["Blocks", "BlockSlopeVertical", {
        flipY: !0
    }]], WA, [[[-2, 3, -2], [1, 3, 1]], [[-2, 2, -2], [1, 2, -1]], [[-2, 0, -2], [1, 1, -2]]]), new HA("e81a123c0be3f8f168fb584d53e8aa038785569bbf2cd1c1cead2272889591e0", RA.Block, Sb.BlockSlopeVerticalBottom, [["Blocks", "BlockSlopeVertical"]], WA, [[[-2, 0, -2], [1, 0, 1]], [[-2, 1, -2], [1, 1, -1]], [[-2, 2, -2], [1, 3, -2]]]), new HA("94e14468f31af7f39b9d7ba188a364089ae81da2bd6a9db2b8f5b1b8cedce741", RA.Block, Sb.BlockSlopeToVertical, [["Blocks", "BlockSlopeToVertical"]], WA, [[[-2, 0, -2], [1, 0, 1]], [[-2, 1, -2], [1, 1, -1]], [[-2, 2, -2], [1, 3, -2]]]), new HA("3a2f05b1c2c2fd976997fa473f1adb3ba14495701dc5a998f8697798384c6946", RA.Block, Sb.BlockSlopeVerticalCornerTop, [["Blocks", "BlockSlopeVerticalCornerBottom", {
        flipY: !0
    }]], WA, [[[-2, 3, -2], [1, 3, 1]], [[-2, 2, -2], [0, 2, 0]], [[1, 2, -2], [1, 2, -1]], [[-2, 2, 1], [-1, 2, 1]], [[-2, 1, -2], [-1, 1, -1]], [[-2, 1, 0], [-1, 1, 0]], [[0, 1, -2], [0, 1, -1]], [[1, 1, -2], [1, 1, -2]], [[-2, 1, 1], [-2, 1, 1]], [[-2, 0, -2], [-1, 0, -1]], [[-2, 0, 0], [-2, 0, 1]], [[0, 0, -2], [1, 0, -2]]]), new HA("3e4fa43e69aa1dbee584e16451a95a16229bba8d638df2bf6f6c9ffb3a9629c9", RA.Block, Sb.BlockInnerCorner, [["Blocks", "BlockInnerCorner"]], WA, [[[-2, 0, 0], [-2, 0, 1]], [[-2, 0, -2], [-1, 0, -1]], [[0, 0, -2], [1, 0, -2]]]), new HA("cc9c95eef56def4cf013e4ac85b8013a2b4f4b4346f1f5dd41fa017de763ef17", RA.Block, Sb.BlockSlopeVerticalCornerBottom, [["Blocks", "BlockSlopeVerticalCornerBottom"]], WA, [[[-2, 0, -2], [1, 0, 1]], [[-2, 1, -2], [0, 1, 0]], [[1, 1, -2], [1, 1, -1]], [[-2, 1, 1], [-1, 1, 1]], [[-2, 2, -2], [-1, 2, -1]], [[-2, 2, 0], [-1, 2, 0]], [[0, 2, -2], [0, 2, -1]], [[1, 2, -2], [1, 2, -2]], [[-2, 2, 1], [-2, 2, 1]], [[-2, 3, -2], [-1, 3, -1]], [[-2, 3, 0], [-2, 3, 1]], [[0, 3, -2], [1, 3, -2]]]), new HA("e4c82c8e512d52269cb6588fa34b06c179340ea40e71f74cbadadc7e8353f5a2", RA.Block, Sb.BlockSlopeVerticalInnerCornerTop, [["Blocks", "BlockSlopeVerticalInnerCorner", {
        flipY: !0
    }]], WA, [[[-2, 3, -2], [0, 3, 1]], [[1, 3, -2], [1, 3, 0]], [[-2, 2, -2], [-2, 2, -1]], [[-1, 2, -2], [-1, 2, -2]], [[-2, 0, -2], [-2, 1, -2]]]), new HA("926fdc6e82ecd709cc535faea6bb8778c6e2e91edb39eb6ae6308076dca2ed18", RA.Block, Sb.BlockSlopeVerticalInnerCornerBottom, [["Blocks", "BlockSlopeVerticalInnerCorner"]], WA, [[[-2, 0, -2], [0, 0, 1]], [[1, 0, -2], [1, 0, 0]], [[-2, 1, -2], [-2, 1, -1]], [[-1, 1, -2], [-1, 1, -2]], [[-2, 2, -2], [-2, 3, -2]]]), new HA("1086515ba3c1d8e5ec76b378f0bdbc77fc5a57fc8eba8972f0d5e611be945235", RA.Block, Sb.BlockBridge, [["Blocks", "BlockBridge"]], WA, [[[-1, 0, -2], [0, 0, 1]]]), new HA("5426ad4ff64af3f1a0f0794ad30cfc20434dfffdf44d93010f5f98671c246ff3", RA.Block, Sb.BlockBridgeCorner, [["Blocks", "BlockBridgeCorner"]], WA, [[[-1, 0, -1], [0, 0, 1]], [[1, 0, -1], [1, 0, 0]]]), new HA("784b9b4459e838e5b8f74f6250769ffa52ec5cc3608abc24c380a2e792c3d338", RA.Block, Sb.BlockBridgeIntersectionT, [["Blocks", "BlockBridgeIntersectionT"]], WA, [[[-1, 0, -1], [0, 0, 1]], [[1, 0, -1], [1, 0, 0]], [[-2, 0, -1], [-2, 0, 0]]]), new HA("dfbcbc107a3c12217bfa3b224a5757d08e995705d1c122bb2c2665bbb8447b1c", RA.Block, Sb.BlockBridgeIntersectionCross, [["Blocks", "BlockBridgeIntersectionCross"]], WA, [[[-1, 0, -1], [0, 0, 1]], [[1, 0, -1], [1, 0, 0]], [[-2, 0, -1], [-2, 0, 0]], [[-1, 0, -2], [0, 0, -2]]]), new HA("5fe53442e559418b7cc9483315b0ac45b8797f9630d5ecc4c7604dab4be25584", RA.WallTrack, Sb.WallTrackTop, [["WallTrack", "WallTrackBottom", {
        flipY: !0
    }]], FA, [[[-2, 3, -1], [1, 3, 1]], [[-2, 2, -1], [1, 2, -1]], [[-2, 0, -2], [1, 2, -2]]]), new HA("010d187fbfbd399bfe880bbea1b548678c239eba0be2913e5cb8a69fbd17adf7", RA.WallTrack, Sb.WallTrackMiddle, [["WallTrack", "WallTrackMiddle"]], FA, [[[-2, 0, -2], [1, 0, -2]]]), new HA("33216a4dcb734511a80c5bf70ca6f66de555800426686eae5a2519d4c837090e", RA.WallTrack, Sb.WallTrackBottom, [["WallTrack", "WallTrackBottom"]], FA, [[[-2, 0, -1], [1, 0, 1]], [[-2, 1, -1], [1, 1, -1]], [[-2, 1, -2], [1, 3, -2]]]), new HA("1e306d2a6347b68d6e275bf4ccc9c8942e0a633bf625a3bba95fa9f98ecd50ff", RA.WallTrack, Sb.WallTrackSlopeToVertical, [["WallTrack", "WallTrackSlopeToVertical"]], FA, [[[-2, 0, 0], [1, 0, 1]], [[-2, 1, -2], [1, 1, 0]], [[-2, 2, -2], [1, 3, -2]]]), new HA("3ed21ddbc756a6644e05f5e1ca78ff8df6d51affc472c2d86e7f23d85911e273", RA.WallTrack, Sb.WallTrackTopCorner, [["WallTrack", "WallTrackBottomCorner", {
        flipY: !0
    }]], FA, [[[-2, 0, -1], [-2, 0, 1]], [[-1, 0, -1], [-1, 0, -1]], [[-1, 0, -2], [1, 0, -2]], [[-2, 1, -1], [-2, 1, 1]], [[-1, 1, -1], [-1, 1, 0]], [[0, 1, -1], [0, 1, -1]], [[-1, 1, -2], [1, 1, -2]], [[-2, 2, 0], [-2, 2, 1]], [[-1, 2, 1], [-1, 2, 1]], [[-1, 2, -1], [0, 2, 0]], [[1, 2, -1], [1, 2, -1]], [[0, 2, -2], [1, 2, -2]], [[0, 3, -1], [1, 3, 1]], [[-1, 3, 0], [-1, 3, 1]]]), new HA("4027a2439cc3e42ceda50ff3d427a31e127b25a6457b55edc2d498b474a296a7", RA.WallTrack, Sb.WallTrackMiddleCorner, [["WallTrack", "WallTrackMiddleCorner"]], FA, [[[-2, 0, -1], [-2, 0, 1]], [[-1, 0, -1], [-1, 0, -1]], [[-1, 0, -2], [1, 0, -2]]]), new HA("498286e062056a537a482ed3385fe0ac0343b399f29d470641df8f74c0532672", RA.WallTrack, Sb.WallTrackBottomCorner, [["WallTrack", "WallTrackBottomCorner"]], FA, [[[-2, 3, -1], [-2, 3, 1]], [[-1, 3, -1], [-1, 3, -1]], [[-1, 3, -2], [1, 3, -2]], [[-2, 2, -1], [-2, 2, 1]], [[-1, 2, -1], [-1, 2, 0]], [[0, 2, -1], [0, 2, -1]], [[-1, 2, -2], [1, 2, -2]], [[-2, 1, 0], [-2, 1, 1]], [[-1, 1, 1], [-1, 1, 1]], [[-1, 1, -1], [0, 1, 0]], [[1, 1, -1], [1, 1, -1]], [[0, 1, -2], [1, 1, -2]], [[0, 0, -1], [1, 0, 1]], [[-1, 0, 0], [-1, 0, 1]]]), new HA("ac09cd62c83af376f23d37dd88273614a2a11cc04a04bff6075fd749bb1ff421", RA.WallTrack, Sb.WallTrackTopInnerCorner, [["WallTrack", "WallTrackBottomInnerCorner", {
        flipY: !0
    }]], FA, [[[-2, 3, -1], [1, 3, 1]], [[-1, 3, -2], [1, 3, -2]], [[-2, 2, -2], [-1, 2, -1]], [[-2, 0, -2], [-2, 1, -2]]]), new HA("16c9c8ece47c097f60cfc7f8a2daa2f0e7ad0befb0ebfd185402013fd1ec8e0f", RA.WallTrack, Sb.WallTrackInnerCorner, [["WallTrack", "WallTrackInnerCorner"]], FA, [[[-2, 0, -2], [-2, 0, -2]]]), new HA("404e7506c2f7e9302acac39c31a659e7e09e7852786e5f0244f9827727a0bf1e", RA.WallTrack, Sb.WallTrackBottomInnerCorner, [["WallTrack", "WallTrackBottomInnerCorner"]], FA, [[[-2, 0, -1], [1, 0, 1]], [[-1, 0, -2], [1, 0, -2]], [[-2, 1, -2], [-1, 1, -1]], [[-2, 2, -2], [-2, 3, -2]]]), new HA("8b7023471502607ef19109760bee3b954ea3b3883c32f3960f75c6651c912ffd", RA.WallTrack, Sb.WallTrackFloor, [["WallTrack", "WallTrackFloor"]], FA, [[[-2, 0, -2], [1, 0, 1]]]), new HA("59e7f31827236c71db8b16f3f1f259c4c82c87a37e4d57a5a097c0d527d128f3", RA.WallTrack, Sb.WallTrackFloorCorner, [["WallTrack", "WallTrackFloorCorner"]], FA, [[[-2, 0, 1], [1, 0, 1]], [[0, 0, 0], [1, 0, 0]], [[1, 0, -2], [1, 0, -1]]]), new HA("d58e3805b550b70940c845a807086865b21a4c36da74ffddedcfe5ce2d08e093", RA.WallTrack, Sb.WallTrackFloorPlaneCorner, [["WallTrack", "WallTrackFloorPlaneCorner"]], FA, [[[-2, 0, 1], [1, 0, 1]], [[0, 0, 0], [1, 0, 0]], [[1, 0, -2], [1, 0, -1]]]), new HA("a56b0c1cf964b213a38167cbbac6f33acd403978ad75746eb51bcfd8c6a36148", RA.WallTrack, Sb.WallTrackCeiling, [["WallTrack", "WallTrackCeiling"]], FA, [[[-2, 0, -2], [1, 0, 1]]]), new HA("f87b592d02120312e8e93d8a27c02dcda1095ac2f09879c6efafb2ca2b49d127", RA.WallTrack, Sb.WallTrackCeilingCorner, [["WallTrack", "WallTrackCeilingCorner"]], FA, [[[-2, 0, 1], [1, 0, 1]], [[0, 0, 0], [1, 0, 0]], [[1, 0, -2], [1, 0, -1]]]), new HA("cfce1fe50f8cd26393eadd475783830e02f0b39bad4c0e00f7aa69614b22decc", RA.WallTrack, Sb.WallTrackCeilingPlaneCorner, [["WallTrack", "WallTrackCeilingPlaneCorner"]], FA, [[[-2, 0, 1], [1, 0, 1]], [[0, 0, 0], [1, 0, 0]], [[1, 0, -2], [1, 0, -1]]]), new HA("19656d02145f1a4ba07dbf2f236f865d34c86f823741b247b5d444a36d61c316", RA.Pillar, Sb.PillarTop, [["Pillar", "PillarTop"]], FA, [[[-1, 0, -1], [0, 0, 0]]]), new HA("dde596d55ffc00f0f00d361667239d9f71c414f03304fecb6a7d11f6f5e702f1", RA.Pillar, Sb.PillarMiddle, [["Pillar", "PillarMiddle"]], FA, [[[-1, 0, -1], [0, 0, 0]]]), new HA("dced5202d9373f9dd81a39530a87a1a7036c93ae71604a4e26c3a191abf3c197", RA.Pillar, Sb.PillarBottom, [["Pillar", "PillarBottom"]], FA, [[[-1, 0, -1], [0, 0, 0]]]), new HA("af83eebf50c302880377e4f8c1fb3b2ef96ae193e8d03c17e1fd77c73a847e63", RA.Pillar, Sb.PillarShort, [["Pillar", "PillarShort"]], FA, [[[-1, 0, -1], [0, 0, 0]]]), new HA("25b41116fb04b1f3cdd3119f57e0000a6ea8cb12d435718ffd6bb765866c272f", RA.Pillar, Sb.PillarBranch1, [["Pillar", "PillarBranch1"]], FA, [[[-1, 0, -2], [0, 0, 0]]]), new HA("05ae39aea4f1ddd818fa57860e688c9cb875544f9b82eafe58a2eb9c19d8d91d", RA.Pillar, Sb.PillarBranch1Top, [["Pillar", "PillarBranch1Top"]], FA, [[[-1, 0, -2], [0, 0, 0]]]), new HA("06c29d92e42e0c32050af98d69eecc94ce15adf8ac81dbe53dfb577a83265f4e", RA.Pillar, Sb.PillarBranch1Middle, [["Pillar", "PillarBranch1Middle"]], FA, [[[-1, 0, -2], [0, 0, 0]]]), new HA("4a989027e0bd6db264f092bac729d9d450e012a710ea28d199f7ff52efd70fbd", RA.Pillar, Sb.PillarBranch1Bottom, [["Pillar", "PillarBranch1Bottom"]], FA, [[[-1, 0, -2], [0, 0, 0]]]), new HA("78b2ff83ad71e7f3d692abc35923fa20c2ae14c01e37d44ec430746ca1bac992", RA.Pillar, Sb.PillarBranch2, [["Pillar", "PillarBranch2"]], FA, [[[-1, 0, -2], [0, 0, 0]], [[1, 0, -1], [1, 0, 0]]]), new HA("b22c93bc73ec2da9dbff218da1676d7436527ed284e264f37294e48ef1307301", RA.Pillar, Sb.PillarBranch2Top, [["Pillar", "PillarBranch2Top"]], FA, [[[-1, 0, -2], [0, 0, 0]], [[1, 0, -1], [1, 0, 0]]]), new HA("79a456a8fa3da24bec6c033f6c736fa1c728745f9624ae78ca20b6a4a76afae8", RA.Pillar, Sb.PillarBranch2Middle, [["Pillar", "PillarBranch2Middle"]], FA, [[[-1, 0, -2], [0, 0, 0]], [[1, 0, -1], [1, 0, 0]]]), new HA("3b81b3f965cbc9fda4fe09e830ba25f1b96ce512d87b0146a1192a6cd0d07335", RA.Pillar, Sb.PillarBranch2Bottom, [["Pillar", "PillarBranch2Bottom"]], FA, [[[-1, 0, -2], [0, 0, 0]], [[1, 0, -1], [1, 0, 0]]]), new HA("27727678bbcac9d3b0172b165ca5c92b10f4b4584a3a18fef4c542f3e791f26f", RA.Pillar, Sb.PillarBranch3, [["Pillar", "PillarBranch3"]], FA, [[[-1, 0, -2], [0, 0, 0]], [[1, 0, -1], [1, 0, 0]], [[-2, 0, -1], [-2, 0, 0]]]), new HA("50c7ac511d30ab9e065c928b776652f038be7683d948082bbefc419ee049e505", RA.Pillar, Sb.PillarBranch3Top, [["Pillar", "PillarBranch3Top"]], FA, [[[-1, 0, -2], [0, 0, 0]], [[1, 0, -1], [1, 0, 0]], [[-2, 0, -1], [-2, 0, 0]]]), new HA("98b3bfe99e7132825f5aa93122e4e5fdec46eb2877c8eb91fa2648f709527b60", RA.Pillar, Sb.PillarBranch3Middle, [["Pillar", "PillarBranch3Middle"]], FA, [[[-1, 0, -2], [0, 0, 0]], [[1, 0, -1], [1, 0, 0]], [[-2, 0, -1], [-2, 0, 0]]]), new HA("7326bbb558f8bcc28d5875c43b1b8e3646caadb873a14fde3ab517f779aea345", RA.Pillar, Sb.PillarBranch3Bottom, [["Pillar", "PillarBranch3Bottom"]], FA, [[[-1, 0, -2], [0, 0, 0]], [[1, 0, -1], [1, 0, 0]], [[-2, 0, -1], [-2, 0, 0]]]), new HA("0e23c2615cfdb350bb3a700b6169589265a1d1079f61294fb497b8f80191d523", RA.Pillar, Sb.PillarBranch4, [["Pillar", "PillarBranch4"]], FA, [[[-1, 0, -2], [0, 0, 0]], [[1, 0, -1], [1, 0, 0]], [[-2, 0, -1], [-2, 0, 0]], [[-1, 0, 1], [0, 0, 1]]]), new HA("e62b55e111dbcb3faefed0a203eac5b55051a2b11911946660310e3df3588da3", RA.Pillar, Sb.PillarBranch4Top, [["Pillar", "PillarBranch4Top"]], FA, [[[-1, 0, -2], [0, 0, 0]], [[1, 0, -1], [1, 0, 0]], [[-2, 0, -1], [-2, 0, 0]], [[-1, 0, 1], [0, 0, 1]]]), new HA("4e2cfb89c1c591803a1440532a74c3ace37ec7fe78a526c1b57f6679c620df2e", RA.Pillar, Sb.PillarBranch4Middle, [["Pillar", "PillarBranch4Middle"]], FA, [[[-1, 0, -2], [0, 0, 0]], [[1, 0, -1], [1, 0, 0]], [[-2, 0, -1], [-2, 0, 0]], [[-1, 0, 1], [0, 0, 1]]]), new HA("e7807350788e4570c8bb74d4a635639ef731d83e52922fac5bc10f415f73f794", RA.Pillar, Sb.PillarBranch4Bottom, [["Pillar", "PillarBranch4Bottom"]], FA, [[[-1, 0, -2], [0, 0, 0]], [[1, 0, -1], [1, 0, 0]], [[-2, 0, -1], [-2, 0, 0]], [[-1, 0, 1], [0, 0, 1]]]), new HA("836bfd12791bfebd99aba70531da4c9bd6e332d16c1e120a8888ea54f59456f9", RA.Pillar, Sb.PillarBranch5, [["Pillar", "PillarBranch5"]], FA, [[[-2, 0, -1], [1, 0, 0]]]), new HA("ab85228116faf9ae7b1e6cb4a03530cbec808df3d3c1d7883eb41eb7cfe231d7", RA.Pillar, Sb.PillarBranch5Top, [["Pillar", "PillarBranch5Top"]], FA, [[[-2, 0, -1], [1, 0, 0]]]), new HA("db93d5cea4e523fd67a56f8d928084ab6355331a8e5d1899115c1841866006bb", RA.Pillar, Sb.PillarBranch5Middle, [["Pillar", "PillarBranch5Middle"]], FA, [[[-2, 0, -1], [1, 0, 0]]]), new HA("dd793efa234159e3a0ff28b064ecb715e6c8bb76e06acfe4bd0d9a2f2b9bba88", RA.Pillar, Sb.PillarBranch5Bottom, [["Pillar", "PillarBranch5Bottom"]], FA, [[[-2, 0, -1], [1, 0, 0]]]), new HA("350f7d3591ffd0b2cfb8204d1c6cd0022fd3bda81ea7e950fce3abea7ec89e1a", RA.Sign, Sb.SignArrowLeft, [["Signs", "SignArrowRight", {
        flipX: !0
    }]], FA, [[[-2, 0, -2], [1, 0, -2]]]), new HA("22e104e58bba0a609d379578e391ce50ca523c9eee1c3fddebb6d1bb2246a0b9", RA.Sign, Sb.SignArrowRight, [["Signs", "SignArrowRight"]], FA, [[[-2, 0, -2], [1, 0, -2]]]), new HA("acba0cfe380e625285b973e09344e61740e77d6f8cac8691ef3e0a0b0878040e", RA.Sign, Sb.SignArrowUp, [["Signs", "SignArrowUp"]], FA, [[[-2, 0, -2], [1, 0, -2]]]), new HA("8d0dbea0a26bdf3addd372f5d9a2fdecfd776a48f31218acdeb036129b248ca5", RA.Sign, Sb.SignArrowDown, [["Signs", "SignArrowUp", {
        flipY: !0
    }]], FA, [[[-2, 0, -2], [1, 0, -2]]]), new HA("e5e1b1ca69d7b230331171be07876c4b1bdebba557c19b18ab17d91eee2771d5", RA.Sign, Sb.SignWarning, [["Signs", "SignWarning"]], FA, [[[-2, 0, -2], [1, 0, -2]]]), new HA("64ed1fba4990a25bc774575ff8835117638d2c3e7c8f41bf0032d219e1083e4c", RA.Sign, Sb.SignWrongWay, [["Signs", "SignWrongWay"]], FA, [[[-2, 0, -2], [1, 0, -2]]])]
        , GA = new Map;
    for (const e of VA) {
        if (GA.has(e.id))
            throw new Error("Duplicate track part id " + e.id.toString());
        GA.set(e.id, e)
    }
    function jA(e) {
        const t = GA.get(e);
        if (null == t)
            throw new Error("Unknown track part id " + e.toString());
        return t
    }
    const QA = VA.filter((e => {
        var t;
        return (null === (t = e.detector) || void 0 === t ? void 0 : t.type) == DA.Checkpoint
    }
    )).map((e => e.id))
        , KA = VA.filter((e => null != e.startOffset)).map((e => e.id));
    function qA(e) {
        const t = e.parts;
        if ("object" != typeof t && null !== t && !Array.isArray(t))
            return null;
        const n = new cx(PA.Summer, new TA)
            , i = Object.keys(t);
        for (const e of i) {
            const i = parseInt(e, 10);
            if (!(i in Sb))
                return null;
            {
                const e = t[i];
                if (!Array.isArray(e))
                    return null;
                if (e.length % 4 != 0)
                    return null;
                for (let t = 0; t < e.length; t += 4) {
                    const r = parseInt(e[t + 0], 10)
                        , a = parseInt(e[t + 1], 10)
                        , s = parseInt(e[t + 2], 10)
                        , o = parseInt(e[t + 3], 10);
                    if (isNaN(r) || isNaN(a) || isNaN(s) || isNaN(o))
                        return null;
                    if (!(o >= 0 && o <= 3 && Math.abs(r) <= 1e9 && a >= 0 && a <= 1e9 && Math.abs(s) <= 1e9))
                        return null;
                    {
                        if (QA.includes(i))
                            return null;
                        let e = null;
                        KA.includes(i) && (e = 0),
                            n.addPart(4 * r, a, 4 * s, i, o, _b.YPositive, kb.Default, null, e)
                    }
                }
            }
        }
        return n
    }
    function YA(e) {
        let t, n;
        try {
            t = JSON.parse(e)
        } catch (e) {
            return console.warn(e),
                null
        }
        if ("string" != typeof t.name)
            return null;
        if ("string" != typeof t.track)
            return null;
        try {
            n = JSON.parse(t.track)
        } catch (e) {
            return console.warn(e),
                null
        }
        const i = qA(n);
        return null == i ? null : {
            trackMetadata: {
                name: t.name,
                author: null
            },
            trackData: i
        }
    }
    function XA(e) {
        const t = vv(e);
        if (null == t)
            return null;
        const n = new cx(PA.Summer, new TA);
        let i = 0;
        for (; i < t.length;) {
            if (t.length - i < 2)
                return null;
            const e = t[i + 0] | t[i + 1] << 8;
            if (i += 2,
                !(e in Sb))
                return null;
            if (t.length - i < 4)
                return null;
            const r = t[i + 0] | t[i + 1] << 8 | t[i + 2] << 16 | t[i + 3] << 24;
            i += 4;
            for (let a = 0; a < r; ++a) {
                if (t.length - i < 3)
                    return null;
                const r = (t[i + 0] | t[i + 1] << 8 | t[i + 2] << 16) - Math.pow(2, 23);
                if (i += 3,
                    t.length - i < 3)
                    return null;
                const a = t[i + 0] | t[i + 1] << 8 | t[i + 2] << 16;
                if (i += 3,
                    t.length - i < 3)
                    return null;
                const s = (t[i + 0] | t[i + 1] << 8 | t[i + 2] << 16) - Math.pow(2, 23);
                if (i += 3,
                    t.length - i < 1)
                    return null;
                const o = 3 & t[i + 0];
                if (i += 1,
                    o < 0 || o > 3)
                    return null;
                if (QA.includes(e))
                    return null;
                let l = null;
                KA.includes(e) && (l = 0),
                    n.addPart(4 * r, a, 4 * s, e, o, _b.YPositive, kb.Default, null, l)
            }
        }
        return n
    }
    function ZA(e) {
        const t = AA(e);
        if (null == t)
            return null;
        const n = new gv.Inflate;
        if (n.push(t, !0),
            n.err)
            return null;
        const i = n.result;
        if (!(i instanceof Uint8Array))
            return null;
        const r = new cx(PA.Summer, new TA);
        let a = 0;
        for (; a < i.length;) {
            if (i.length - a < 2)
                return null;
            const e = i[a + 0] | i[a + 1] << 8;
            if (a += 2,
                !(e in Sb))
                return null;
            if (i.length - a < 4)
                return null;
            const t = i[a + 0] | i[a + 1] << 8 | i[a + 2] << 16 | i[a + 3] << 24;
            a += 4;
            for (let n = 0; n < t; ++n) {
                if (i.length - a < 3)
                    return null;
                const t = (i[a + 0] | i[a + 1] << 8 | i[a + 2] << 16) - Math.pow(2, 23);
                if (a += 3,
                    i.length - a < 3)
                    return null;
                const n = i[a + 0] | i[a + 1] << 8 | i[a + 2] << 16;
                if (a += 3,
                    i.length - a < 3)
                    return null;
                const s = (i[a + 0] | i[a + 1] << 8 | i[a + 2] << 16) - Math.pow(2, 23);
                if (a += 3,
                    i.length - a < 1)
                    return null;
                const o = i[a + 0];
                if (a += 1,
                    o < 0 || o > 3)
                    return null;
                let l = null;
                if (QA.includes(e)) {
                    if (i.length - a < 2)
                        return null;
                    l = i[a + 0] | i[a + 1] << 8,
                        a += 2
                }
                let c = null;
                KA.includes(e) && (c = 0),
                    r.addPart(4 * t, n, 4 * s, e, o, _b.YPositive, kb.Default, l, c)
            }
        }
        return r
    }
    function JA(e) {
        const t = AA(e);
        if (null == t)
            return null;
        const n = new gv.Inflate;
        if (n.push(t, !0),
            n.err)
            return null;
        const i = n.result;
        if (!(i instanceof Uint8Array))
            return null;
        const r = new cx(PA.Summer, new TA);
        let a = 0;
        for (; a < i.length;) {
            if (i.length - a < 2)
                return null;
            let e = i[a + 0] | i[a + 1] << 8;
            a += 2;
            let t = kb.Default;
            if (e >= 134 && e <= 178)
                switch (e) {
                    case 134:
                        e = Sb.Block,
                            t = kb.Custom1;
                        break;
                    case 135:
                        e = Sb.HalfBlock,
                            t = kb.Custom1;
                        break;
                    case 136:
                        e = Sb.QuarterBlock,
                            t = kb.Custom1;
                        break;
                    case 137:
                        e = Sb.BlockSlopedDown,
                            t = kb.Custom1;
                        break;
                    case 138:
                        e = Sb.BlockSlopedDownInnerCorner,
                            t = kb.Custom1;
                        break;
                    case 139:
                        e = Sb.BlockSlopedDownOuterCorner,
                            t = kb.Custom1;
                        break;
                    case 140:
                        e = Sb.BlockSlopedUp,
                            t = kb.Custom1;
                        break;
                    case 141:
                        e = Sb.BlockSlopedUpInnerCorner,
                            t = kb.Custom1;
                        break;
                    case 142:
                        e = Sb.BlockSlopedUpOuterCorner,
                            t = kb.Custom1;
                        break;
                    case 143:
                        e = Sb.BlockSlopeDown,
                            t = kb.Custom1;
                        break;
                    case 144:
                        e = Sb.BlockSlopeUp,
                            t = kb.Custom1;
                        break;
                    case 145:
                        e = Sb.BlockBridge,
                            t = kb.Custom1;
                        break;
                    case 146:
                        e = Sb.BlockBridgeCorner,
                            t = kb.Custom1;
                        break;
                    case 147:
                        e = Sb.BlockBridgeIntersectionT,
                            t = kb.Custom1;
                        break;
                    case 148:
                        e = Sb.BlockBridgeIntersectionCross,
                            t = kb.Custom1;
                        break;
                    case 149:
                        e = Sb.Block,
                            t = kb.Custom6;
                        break;
                    case 150:
                        e = Sb.HalfBlock,
                            t = kb.Custom6;
                        break;
                    case 151:
                        e = Sb.QuarterBlock,
                            t = kb.Custom6;
                        break;
                    case 152:
                        e = Sb.BlockSlopedDown,
                            t = kb.Custom6;
                        break;
                    case 153:
                        e = Sb.BlockSlopedDownInnerCorner,
                            t = kb.Custom6;
                        break;
                    case 154:
                        e = Sb.BlockSlopedDownOuterCorner,
                            t = kb.Custom6;
                        break;
                    case 155:
                        e = Sb.BlockSlopedUp,
                            t = kb.Custom6;
                        break;
                    case 156:
                        e = Sb.BlockSlopedUpInnerCorner,
                            t = kb.Custom6;
                        break;
                    case 157:
                        e = Sb.BlockSlopedUpOuterCorner,
                            t = kb.Custom6;
                        break;
                    case 158:
                        e = Sb.BlockSlopeDown,
                            t = kb.Custom6;
                        break;
                    case 159:
                        e = Sb.BlockSlopeUp,
                            t = kb.Custom6;
                        break;
                    case 160:
                        e = Sb.BlockBridge,
                            t = kb.Custom6;
                        break;
                    case 161:
                        e = Sb.BlockBridgeCorner,
                            t = kb.Custom6;
                        break;
                    case 162:
                        e = Sb.BlockBridgeIntersectionT,
                            t = kb.Custom6;
                        break;
                    case 163:
                        e = Sb.BlockBridgeIntersectionCross,
                            t = kb.Custom6;
                        break;
                    case 164:
                        e = Sb.Block,
                            t = kb.Custom0;
                        break;
                    case 165:
                        e = Sb.HalfBlock,
                            t = kb.Custom0;
                        break;
                    case 166:
                        e = Sb.QuarterBlock,
                            t = kb.Custom0;
                        break;
                    case 167:
                        e = Sb.BlockSlopedDown,
                            t = kb.Custom0;
                        break;
                    case 168:
                        e = Sb.BlockSlopedDownInnerCorner,
                            t = kb.Custom0;
                        break;
                    case 169:
                        e = Sb.BlockSlopedDownOuterCorner,
                            t = kb.Custom0;
                        break;
                    case 170:
                        e = Sb.BlockSlopedUp,
                            t = kb.Custom0;
                        break;
                    case 171:
                        e = Sb.BlockSlopedUpInnerCorner,
                            t = kb.Custom0;
                        break;
                    case 172:
                        e = Sb.BlockSlopedUpOuterCorner,
                            t = kb.Custom0;
                        break;
                    case 173:
                        e = Sb.BlockSlopeDown,
                            t = kb.Custom0;
                        break;
                    case 174:
                        e = Sb.BlockSlopeUp,
                            t = kb.Custom0;
                        break;
                    case 175:
                        e = Sb.BlockBridge,
                            t = kb.Custom0;
                        break;
                    case 176:
                        e = Sb.BlockBridgeCorner,
                            t = kb.Custom0;
                        break;
                    case 177:
                        e = Sb.BlockBridgeIntersectionT,
                            t = kb.Custom0;
                        break;
                    case 178:
                        e = Sb.BlockBridgeIntersectionCross,
                            t = kb.Custom0
                }
            let n = null
                , s = {
                    x: 0,
                    y: 0,
                    z: 0
                };
            if (79 == e)
                n = Sb.WallTrackFloorPlaneCorner;
            else if (81 == e)
                n = Sb.WallTrackCeilingPlaneCorner,
                    s = {
                        x: 0,
                        y: 3,
                        z: 0
                    };
            else if (e >= 87 && e <= 98)
                switch (e) {
                    case 87:
                        e = Sb.Slope,
                            n = Sb.BlockSlopedUp;
                        break;
                    case 88:
                        e = Sb.SlopeUp,
                            n = Sb.BlockSlopeUp;
                        break;
                    case 89:
                        e = Sb.SlopeDown,
                            n = Sb.BlockSlopeDown;
                        break;
                    case 90:
                        e = Sb.SlopeUpLeftWide,
                            n = Sb.BlockSlopeUp;
                        break;
                    case 91:
                        e = Sb.SlopeUpRightWide,
                            n = Sb.BlockSlopeUp;
                        break;
                    case 92:
                        e = Sb.SlopeDownLeftWide,
                            n = Sb.BlockSlopeDown;
                        break;
                    case 93:
                        e = Sb.SlopeDownRightWide,
                            n = Sb.BlockSlopeDown;
                        break;
                    case 94:
                        e = Sb.SlopeLeftWide,
                            n = Sb.BlockSlopedUp;
                        break;
                    case 95:
                        e = Sb.SlopeRightWide,
                            n = Sb.BlockSlopedUp;
                        break;
                    case 96:
                        e = Sb.PlaneSlopeUp,
                            n = Sb.BlockSlopeUp;
                        break;
                    case 97:
                        e = Sb.PlaneSlopeDown,
                            n = Sb.BlockSlopeDown;
                        break;
                    case 98:
                        e = Sb.PlaneSlope,
                            n = Sb.BlockSlopedUp;
                        break;
                    default:
                        throw new Error("Invalid track part id")
                }
            if (!(e in Sb))
                return null;
            if (i.length - a < 4)
                return null;
            const o = i[a + 0] | i[a + 1] << 8 | i[a + 2] << 16 | i[a + 3] << 24;
            a += 4;
            for (let l = 0; l < o; ++l) {
                if (i.length - a < 3)
                    return null;
                const o = (i[a + 0] | i[a + 1] << 8 | i[a + 2] << 16) - Math.pow(2, 23);
                if (a += 3,
                    i.length - a < 3)
                    return null;
                const l = i[a + 0] | i[a + 1] << 8 | i[a + 2] << 16;
                if (a += 3,
                    i.length - a < 3)
                    return null;
                const c = (i[a + 0] | i[a + 1] << 8 | i[a + 2] << 16) - Math.pow(2, 23);
                if (a += 3,
                    i.length - a < 1)
                    return null;
                const h = i[a + 0];
                if (a += 1,
                    h < 0 || h > 3)
                    return null;
                let d = null;
                if (QA.includes(e)) {
                    if (i.length - a < 2)
                        return null;
                    d = i[a + 0] | i[a + 1] << 8,
                        a += 2
                }
                let u = null;
                KA.includes(e) && (u = 0),
                    null != n && r.addPart(4 * o + s.x, l + s.y, 4 * c + s.z, n, h, _b.YPositive, kb.Default, null, u),
                    r.addPart(4 * o, l, 4 * c, e, h, _b.YPositive, t, d, u)
            }
        }
        return r
    }



















































































    class gc {
        constructor(e = {}, t = {}) {
            (this.json = e),
                (this.extensions = {}),
                (this.plugins = {}),
                (this.options = t),
                (this.cache = new xl()),
                (this.associations = new Map()),
                (this.primitiveCache = {}),
                (this.nodeCache = {}),
                (this.meshCache = { refs: {}, uses: {} }),
                (this.cameraCache = { refs: {}, uses: {} }),
                (this.lightCache = { refs: {}, uses: {} }),
                (this.sourceCache = {}),
                (this.textureCache = {}),
                (this.nodeNamesUsed = {});
            let n = !1,
                i = -1,
                r = !1,
                a = -1;
            if ("undefined" != typeof navigator) {
                const e = navigator.userAgent;
                n = !0 === /^((?!chrome|android).)*safari/i.test(e);
                const t = e.match(/Version\/(\d+)/);
                (i = n && t ? parseInt(t[1], 10) : -1),
                    (r = e.indexOf("Firefox") > -1),
                    (a = r ? e.match(/Firefox\/([0-9]+)\./)[1] : -1);
            }
            "undefined" == typeof createImageBitmap ||
                (n && i < 17) ||
                (r && a < 98)
                ? (this.textureLoader = new wo(this.options.manager))
                : (this.textureLoader = new Bo(this.options.manager)),
                this.textureLoader.setCrossOrigin(this.options.crossOrigin),
                this.textureLoader.setRequestHeader(this.options.requestHeader),
                (this.fileLoader = new go(this.options.manager)),
                this.fileLoader.setResponseType("arraybuffer"),
                "use-credentials" === this.options.crossOrigin &&
                this.fileLoader.setWithCredentials(!0);
        }
        setExtensions(e) {
            this.extensions = e;
        }
        setPlugins(e) {
            this.plugins = e;
        }
        parse(e, t) {
            const n = this,
                i = this.json,
                r = this.extensions;
            this.cache.removeAll(),
                (this.nodeCache = {}),
                this._invokeAll(function (e) {
                    return e._markDefs && e._markDefs();
                }),
                Promise.all(
                    this._invokeAll(function (e) {
                        return e.beforeRoot && e.beforeRoot();
                    })
                )
                    .then(function () {
                        return Promise.all([
                            n.getDependencies("scene"),
                            n.getDependencies("animation"),
                            n.getDependencies("camera"),
                        ]);
                    })
                    .then(function (t) {
                        const a = {
                            scene: t[0][i.scene || 0],
                            scenes: t[0],
                            animations: t[1],
                            cameras: t[2],
                            asset: i.asset,
                            parser: n,
                            userData: {},
                        };
                        return (
                            cc(r, a, i),
                            hc(a, i),
                            Promise.all(
                                n._invokeAll(function (e) {
                                    return e.afterRoot && e.afterRoot(a);
                                })
                            ).then(function () {
                                for (const e of a.scenes) e.updateMatrixWorld();
                                e(a);
                            })
                        );
                    })
                    .catch(t);
        }
        _markDefs() {
            const e = this.json.nodes || [],
                t = this.json.skins || [],
                n = this.json.meshes || [];
            for (let n = 0, i = t.length; n < i; n++) {
                const i = t[n].joints;
                for (let t = 0, n = i.length; t < n; t++) e[i[t]].isBone = !0;
            }
            for (let t = 0, i = e.length; t < i; t++) {
                const i = e[t];
                void 0 !== i.mesh &&
                    (this._addNodeRef(this.meshCache, i.mesh),
                        void 0 !== i.skin && (n[i.mesh].isSkinnedMesh = !0)),
                    void 0 !== i.camera &&
                    this._addNodeRef(this.cameraCache, i.camera);
            }
        }
        _addNodeRef(e, t) {
            void 0 !== t &&
                (void 0 === e.refs[t] && (e.refs[t] = e.uses[t] = 0), e.refs[t]++);
        }
        _getNodeRef(e, t, n) {
            if (e.refs[t] <= 1) return n;
            const i = n.clone(),
                r = (e, t) => {
                    const n = this.associations.get(e);
                    null != n && this.associations.set(t, n);
                    for (const [n, i] of e.children.entries()) r(i, t.children[n]);
                };
            return r(n, i), (i.name += "_instance_" + e.uses[t]++), i;
        }
        _invokeOne(e) {
            const t = Object.values(this.plugins);
            t.push(this);
            for (let n = 0; n < t.length; n++) {
                const i = e(t[n]);
                if (i) return i;
            }
            return null;
        }
        _invokeAll(e) {
            const t = Object.values(this.plugins);
            t.unshift(this);
            const n = [];
            for (let i = 0; i < t.length; i++) {
                const r = e(t[i]);
                r && n.push(r);
            }
            return n;
        }
        getDependency(e, t) {
            const n = e + ":" + t;
            let i = this.cache.get(n);
            if (!i) {
                switch (e) {
                    case "scene":
                        i = this.loadScene(t);
                        break;
                    case "node":
                        i = this._invokeOne(function (e) {
                            return e.loadNode && e.loadNode(t);
                        });
                        break;
                    case "mesh":
                        i = this._invokeOne(function (e) {
                            return e.loadMesh && e.loadMesh(t);
                        });
                        break;
                    case "accessor":
                        i = this.loadAccessor(t);
                        break;
                    case "bufferView":
                        i = this._invokeOne(function (e) {
                            return e.loadBufferView && e.loadBufferView(t);
                        });
                        break;
                    case "buffer":
                        i = this.loadBuffer(t);
                        break;
                    case "material":
                        i = this._invokeOne(function (e) {
                            return e.loadMaterial && e.loadMaterial(t);
                        });
                        break;
                    case "texture":
                        i = this._invokeOne(function (e) {
                            return e.loadTexture && e.loadTexture(t);
                        });
                        break;
                    case "skin":
                        i = this.loadSkin(t);
                        break;
                    case "animation":
                        i = this._invokeOne(function (e) {
                            return e.loadAnimation && e.loadAnimation(t);
                        });
                        break;
                    case "camera":
                        i = this.loadCamera(t);
                        break;
                    default:
                        if (
                            ((i = this._invokeOne(function (n) {
                                return (
                                    n != this && n.getDependency && n.getDependency(e, t)
                                );
                            })),
                                !i)
                        )
                            throw new Error("Unknown type: " + e);
                }
                this.cache.add(n, i);
            }
            return i;
        }
        getDependencies(e) {
            let t = this.cache.get(e);
            if (!t) {
                const n = this,
                    i = this.json[e + ("mesh" === e ? "es" : "s")] || [];
                (t = Promise.all(
                    i.map(function (t, i) {
                        return n.getDependency(e, i);
                    })
                )),
                    this.cache.add(e, t);
            }
            return t;
        }
        loadBuffer(e) {
            const t = this.json.buffers[e],
                n = this.fileLoader;
            if (t.type && "arraybuffer" !== t.type)
                throw new Error(
                    "THREE.GLTFLoader: " + t.type + " buffer type is not supported."
                );
            if (void 0 === t.uri && 0 === e)
                return Promise.resolve(this.extensions[kl.KHR_BINARY_GLTF].body);
            const i = this.options;
            return new Promise(function (e, r) {
                n.load(No.resolveURL(t.uri, i.path), e, void 0, function () {
                    r(
                        new Error(
                            'THREE.GLTFLoader: Failed to load buffer "' + t.uri + '".'
                        )
                    );
                });
            });
        }
        loadBufferView(e) {
            const t = this.json.bufferViews[e];
            return this.getDependency("buffer", t.buffer).then(function (e) {
                const n = t.byteLength || 0,
                    i = t.byteOffset || 0;
                return e.slice(i, i + n);
            });
        }
        loadAccessor(e) {
            const t = this,
                n = this.json,
                i = this.json.accessors[e];
            if (void 0 === i.bufferView && void 0 === i.sparse) {
                const e = nc[i.type],
                    t = $l[i.componentType],
                    n = !0 === i.normalized,
                    r = new t(i.count * e);
                return Promise.resolve(new Xi(r, e, n));
            }
            const r = [];
            return (
                void 0 !== i.bufferView
                    ? r.push(this.getDependency("bufferView", i.bufferView))
                    : r.push(null),
                void 0 !== i.sparse &&
                (r.push(
                    this.getDependency("bufferView", i.sparse.indices.bufferView)
                ),
                    r.push(
                        this.getDependency("bufferView", i.sparse.values.bufferView)
                    )),
                Promise.all(r).then(function (e) {
                    const r = e[0],
                        a = nc[i.type],
                        s = $l[i.componentType],
                        o = s.BYTES_PER_ELEMENT,
                        l = o * a,
                        c = i.byteOffset || 0,
                        h =
                            void 0 !== i.bufferView
                                ? n.bufferViews[i.bufferView].byteStride
                                : void 0,
                        d = !0 === i.normalized;
                    let u, p;
                    if (h && h !== l) {
                        const e = Math.floor(c / h),
                            n =
                                "InterleavedBuffer:" +
                                i.bufferView +
                                ":" +
                                i.componentType +
                                ":" +
                                e +
                                ":" +
                                i.count;
                        let l = t.cache.get(n);
                        l ||
                            ((u = new s(r, e * h, (i.count * h) / o)),
                                (l = new Wr(u, h / o)),
                                t.cache.add(n, l)),
                            (p = new Vr(l, a, (c % h) / o, d));
                    } else (u = null === r ? new s(i.count * a) : new s(r, c, i.count * a)), (p = new Xi(u, a, d));
                    if (void 0 !== i.sparse) {
                        const t = nc.SCALAR,
                            n = $l[i.sparse.indices.componentType],
                            o = i.sparse.indices.byteOffset || 0,
                            l = i.sparse.values.byteOffset || 0,
                            c = new n(e[1], o, i.sparse.count * t),
                            h = new s(e[2], l, i.sparse.count * a);
                        null !== r &&
                            (p = new Xi(p.array.slice(), p.itemSize, p.normalized)),
                            (p.normalized = !1);
                        for (let e = 0, t = c.length; e < t; e++) {
                            const t = c[e];
                            if (
                                (p.setX(t, h[e * a]),
                                    a >= 2 && p.setY(t, h[e * a + 1]),
                                    a >= 3 && p.setZ(t, h[e * a + 2]),
                                    a >= 4 && p.setW(t, h[e * a + 3]),
                                    a >= 5)
                            )
                                throw new Error(
                                    "THREE.GLTFLoader: Unsupported itemSize in sparse BufferAttribute."
                                );
                        }
                        p.normalized = d;
                    }
                    return p;
                })
            );
        }
        loadTexture(e) {
            const t = this.json,
                n = this.options,
                i = t.textures[e].source,
                r = t.images[i];
            let a = this.textureLoader;
            if (r.uri) {
                const e = n.manager.getHandler(r.uri);
                null !== e && (a = e);
            }
            return this.loadTextureImage(e, i, a);
        }
        loadTextureImage(e, t, n) {
            const i = this,
                r = this.json,
                a = r.textures[e],
                s = r.images[t],
                o = (s.uri || s.bufferView) + ":" + a.sampler;
            if (this.textureCache[o]) return this.textureCache[o];
            const l = this.loadImageSource(t, n)
                .then(function (t) {
                    (t.flipY = !1),
                        (t.name = a.name || s.name || ""),
                        "" === t.name &&
                        "string" == typeof s.uri &&
                        !1 === s.uri.startsWith("data:image/") &&
                        (t.name = s.uri);
                    const n = (r.samplers || {})[a.sampler] || {};
                    return (
                        (t.magFilter = ec[n.magFilter] || de),
                        (t.minFilter = ec[n.minFilter] || pe),
                        (t.wrapS = tc[n.wrapS] || ae),
                        (t.wrapT = tc[n.wrapT] || ae),
                        (t.generateMipmaps =
                            !t.isCompressedTexture &&
                            t.minFilter !== le &&
                            t.minFilter !== de),
                        i.associations.set(t, { textures: e }),
                        t
                    );
                })
                .catch(function () {
                    return null;
                });
            return (this.textureCache[o] = l), l;
        }
        loadImageSource(e, t) {
            const n = this,
                i = this.json,
                r = this.options;
            if (void 0 !== this.sourceCache[e])
                return this.sourceCache[e].then((e) => e.clone());
            const a = i.images[e],
                s = self.URL || self.webkitURL;
            let o = a.uri || "",
                l = !1;
            if (void 0 !== a.bufferView)
                o = n.getDependency("bufferView", a.bufferView).then(function (e) {
                    l = !0;
                    const t = new Blob([e], { type: a.mimeType });
                    return (o = s.createObjectURL(t)), o;
                });
            else if (void 0 === a.uri)
                throw new Error(
                    "THREE.GLTFLoader: Image " + e + " is missing URI and bufferView"
                );
            const c = Promise.resolve(o)
                .then(function (e) {
                    return new Promise(function (n, i) {
                        let a = n;
                        !0 === t.isImageBitmapLoader &&
                            (a = function (e) {
                                const t = new pn(e);
                                (t.needsUpdate = !0), n(t);
                            }),
                            t.load(No.resolveURL(e, r.path), a, void 0, i);
                    });
                })
                .then(function (e) {
                    var t;
                    return (
                        !0 === l && s.revokeObjectURL(o),
                        hc(e, a),
                        (e.userData.mimeType =
                            a.mimeType ||
                            ((t = a.uri).search(/\.jpe?g($|\?)/i) > 0 ||
                                0 === t.search(/^data\:image\/jpeg/)
                                ? "image/jpeg"
                                : t.search(/\.webp($|\?)/i) > 0 ||
                                    0 === t.search(/^data\:image\/webp/)
                                    ? "image/webp"
                                    : t.search(/\.ktx2($|\?)/i) > 0 ||
                                        0 === t.search(/^data\:image\/ktx2/)
                                        ? "image/ktx2"
                                        : "image/png")),
                        e
                    );
                })
                .catch(function (e) {
                    throw (
                        (console.error("THREE.GLTFLoader: Couldn't load texture", o), e)
                    );
                });
            return (this.sourceCache[e] = c), c;
        }
        assignTexture(e, t, n, i) {
            const r = this;
            return this.getDependency("texture", n.index).then(function (a) {
                if (!a) return null;
                if (
                    (void 0 !== n.texCoord &&
                        n.texCoord > 0 &&
                        ((a = a.clone()).channel = n.texCoord),
                        r.extensions[kl.KHR_TEXTURE_TRANSFORM])
                ) {
                    const e =
                        void 0 !== n.extensions
                            ? n.extensions[kl.KHR_TEXTURE_TRANSFORM]
                            : void 0;
                    if (e) {
                        const t = r.associations.get(a);
                        (a = r.extensions[kl.KHR_TEXTURE_TRANSFORM].extendTexture(
                            a,
                            e
                        )),
                            r.associations.set(a, t);
                    }
                }
                return void 0 !== i && (a.colorSpace = i), (e[t] = a), a;
            });
        }
        assignFinalMaterial(e) {
            const t = e.geometry;
            let n = e.material;
            const i = void 0 === t.attributes.tangent,
                r = void 0 !== t.attributes.color,
                a = void 0 === t.attributes.normal;
            if (e.isPoints) {
                const e = "PointsMaterial:" + n.uuid;
                let t = this.cache.get(e);
                t ||
                    ((t = new Na()),
                        ji.prototype.copy.call(t, n),
                        t.color.copy(n.color),
                        (t.map = n.map),
                        (t.sizeAttenuation = !1),
                        this.cache.add(e, t)),
                    (n = t);
            } else if (e.isLine) {
                const e = "LineBasicMaterial:" + n.uuid;
                let t = this.cache.get(e);
                t ||
                    ((t = new Aa()),
                        ji.prototype.copy.call(t, n),
                        t.color.copy(n.color),
                        (t.map = n.map),
                        this.cache.add(e, t)),
                    (n = t);
            }
            if (i || r || a) {
                let e = "ClonedMaterial:" + n.uuid + ":";
                i && (e += "derivative-tangents:"),
                    r && (e += "vertex-colors:"),
                    a && (e += "flat-shading:");
                let t = this.cache.get(e);
                t ||
                    ((t = n.clone()),
                        r && (t.vertexColors = !0),
                        a && (t.flatShading = !0),
                        i &&
                        (t.normalScale && (t.normalScale.y *= -1),
                            t.clearcoatNormalScale && (t.clearcoatNormalScale.y *= -1)),
                        this.cache.add(e, t),
                        this.associations.set(t, this.associations.get(n))),
                    (n = t);
            }
            e.material = n;
        }
        getMaterialType() {
            return Os;
        }
        loadMaterial(e) {
            const t = this,
                n = this.json,
                i = this.extensions,
                r = n.materials[e];
            let a;
            const s = {},
                o = [];
            if ((r.extensions || {})[kl.KHR_MATERIALS_UNLIT]) {
                const e = i[kl.KHR_MATERIALS_UNLIT];
                (a = e.getMaterialType()), o.push(e.extendParams(s, r, t));
            } else {
                const n = r.pbrMetallicRoughness || {};
                if (
                    ((s.color = new Hi(1, 1, 1)),
                        (s.opacity = 1),
                        Array.isArray(n.baseColorFactor))
                ) {
                    const e = n.baseColorFactor;
                    s.color.setRGB(e[0], e[1], e[2], wt), (s.opacity = e[3]);
                }
                void 0 !== n.baseColorTexture &&
                    o.push(t.assignTexture(s, "map", n.baseColorTexture, vt)),
                    (s.metalness =
                        void 0 !== n.metallicFactor ? n.metallicFactor : 1),
                    (s.roughness =
                        void 0 !== n.roughnessFactor ? n.roughnessFactor : 1),
                    void 0 !== n.metallicRoughnessTexture &&
                    (o.push(
                        t.assignTexture(s, "metalnessMap", n.metallicRoughnessTexture)
                    ),
                        o.push(
                            t.assignTexture(s, "roughnessMap", n.metallicRoughnessTexture)
                        )),
                    (a = this._invokeOne(function (t) {
                        return t.getMaterialType && t.getMaterialType(e);
                    })),
                    o.push(
                        Promise.all(
                            this._invokeAll(function (t) {
                                return (
                                    t.extendMaterialParams && t.extendMaterialParams(e, s)
                                );
                            })
                        )
                    );
            }
            !0 === r.doubleSided && (s.side = 2);
            const l = r.alphaMode || sc;
            if (
                (l === lc
                    ? ((s.transparent = !0), (s.depthWrite = !1))
                    : ((s.transparent = !1),
                        l === oc &&
                        (s.alphaTest =
                            void 0 !== r.alphaCutoff ? r.alphaCutoff : 0.5)),
                    void 0 !== r.normalTexture &&
                    a !== Qi &&
                    (o.push(t.assignTexture(s, "normalMap", r.normalTexture)),
                        (s.normalScale = new Qt(1, 1)),
                        void 0 !== r.normalTexture.scale))
            ) {
                const e = r.normalTexture.scale;
                s.normalScale.set(e, e);
            }
            if (
                (void 0 !== r.occlusionTexture &&
                    a !== Qi &&
                    (o.push(t.assignTexture(s, "aoMap", r.occlusionTexture)),
                        void 0 !== r.occlusionTexture.strength &&
                        (s.aoMapIntensity = r.occlusionTexture.strength)),
                    void 0 !== r.emissiveFactor && a !== Qi)
            ) {
                const e = r.emissiveFactor;
                s.emissive = new Hi().setRGB(e[0], e[1], e[2], wt);
            }
            return (
                void 0 !== r.emissiveTexture &&
                a !== Qi &&
                o.push(t.assignTexture(s, "emissiveMap", r.emissiveTexture, vt)),
                Promise.all(o).then(function () {
                    const n = new a(s);
                    return (
                        r.name && (n.name = r.name),
                        hc(n, r),
                        t.associations.set(n, { materials: e }),
                        r.extensions && cc(i, n, r),
                        n
                    );
                })
            );
        }
        createUniqueName(e) {
            const t = Go.sanitizeNodeName(e || "");
            return t in this.nodeNamesUsed
                ? t + "_" + ++this.nodeNamesUsed[t]
                : ((this.nodeNamesUsed[t] = 0), t);
        }
        loadGeometries(e) {
            const t = this,
                n = this.extensions,
                i = this.primitiveCache;
            function r(e) {
                return n[kl.KHR_DRACO_MESH_COMPRESSION]
                    .decodePrimitive(e, t)
                    .then(function (n) {
                        return vc(n, e, t);
                    });
            }
            const a = [];
            for (let n = 0, s = e.length; n < s; n++) {
                const s = e[n],
                    o = uc(s),
                    l = i[o];
                if (l) a.push(l.promise);
                else {
                    let e;
                    (e =
                        s.extensions && s.extensions[kl.KHR_DRACO_MESH_COMPRESSION]
                            ? r(s)
                            : vc(new or(), s, t)),
                        (i[o] = { primitive: s, promise: e }),
                        a.push(e);
                }
            }
            return Promise.all(a);
        }
        loadMesh(e) {
            const t = this,
                n = this.json,
                i = this.extensions,
                r = n.meshes[e],
                a = r.primitives,
                s = [];
            for (let e = 0, t = a.length; e < t; e++) {
                const t =
                    void 0 === a[e].material
                        ? (void 0 === (o = this.cache).DefaultMaterial &&
                            (o.DefaultMaterial = new Os({
                                color: 16777215,
                                emissive: 0,
                                metalness: 1,
                                roughness: 1,
                                transparent: !1,
                                depthTest: !0,
                                side: 0,
                            })),
                            o.DefaultMaterial)
                        : this.getDependency("material", a[e].material);
                s.push(t);
            }
            var o;
            return (
                s.push(t.loadGeometries(a)),
                Promise.all(s).then(function (n) {
                    const s = n.slice(0, n.length - 1),
                        o = n[n.length - 1],
                        l = [];
                    for (let n = 0, c = o.length; n < c; n++) {
                        const c = o[n],
                            h = a[n];
                        let d;
                        const u = s[n];
                        if (
                            h.mode === Jl.TRIANGLES ||
                            h.mode === Jl.TRIANGLE_STRIP ||
                            h.mode === Jl.TRIANGLE_FAN ||
                            void 0 === h.mode
                        )
                            (d = !0 === r.isSkinnedMesh ? new $r(c, u) : new yr(c, u)),
                                !0 === d.isSkinnedMesh && d.normalizeSkinWeights(),
                                h.mode === Jl.TRIANGLE_STRIP
                                    ? (d.geometry = bl(d.geometry, 1))
                                    : h.mode === Jl.TRIANGLE_FAN &&
                                    (d.geometry = bl(d.geometry, 2));
                        else if (h.mode === Jl.LINES) d = new La(c, u);
                        else if (h.mode === Jl.LINE_STRIP) d = new Ca(c, u);
                        else if (h.mode === Jl.LINE_LOOP) d = new Da(c, u);
                        else {
                            if (h.mode !== Jl.POINTS)
                                throw new Error(
                                    "THREE.GLTFLoader: Primitive mode unsupported: " + h.mode
                                );
                            d = new Fa(c, u);
                        }
                        Object.keys(d.geometry.morphAttributes).length > 0 && dc(d, r),
                            (d.name = t.createUniqueName(r.name || "mesh_" + e)),
                            hc(d, r),
                            h.extensions && cc(i, d, h),
                            t.assignFinalMaterial(d),
                            l.push(d);
                    }
                    for (let n = 0, i = l.length; n < i; n++)
                        t.associations.set(l[n], { meshes: e, primitives: n });
                    if (1 === l.length) return r.extensions && cc(i, l[0], r), l[0];
                    const c = new Br();
                    r.extensions && cc(i, c, r), t.associations.set(c, { meshes: e });
                    for (let e = 0, t = l.length; e < t; e++) c.add(l[e]);
                    return c;
                })
            );
        }
        loadCamera(e) {
            let t;
            const n = this.json.cameras[e],
                i = n[n.type];
            if (i)
                return (
                    "perspective" === n.type
                        ? (t = new Ir(
                            jt.radToDeg(i.yfov),
                            i.aspectRatio || 1,
                            i.znear || 1,
                            i.zfar || 2e6
                        ))
                        : "orthographic" === n.type &&
                        (t = new Ro(
                            -i.xmag,
                            i.xmag,
                            i.ymag,
                            -i.ymag,
                            i.znear,
                            i.zfar
                        )),
                    n.name && (t.name = this.createUniqueName(n.name)),
                    hc(t, n),
                    Promise.resolve(t)
                );
            console.warn("THREE.GLTFLoader: Missing camera parameters.");
        }
        loadSkin(e) {
            const t = this.json.skins[e],
                n = [];
            for (let e = 0, i = t.joints.length; e < i; e++)
                n.push(this._loadNodeShallow(t.joints[e]));
            return (
                void 0 !== t.inverseBindMatrices
                    ? n.push(this.getDependency("accessor", t.inverseBindMatrices))
                    : n.push(null),
                Promise.all(n).then(function (e) {
                    const n = e.pop(),
                        i = e,
                        r = [],
                        a = [];
                    for (let e = 0, s = i.length; e < s; e++) {
                        const s = i[e];
                        if (s) {
                            r.push(s);
                            const t = new Xn();
                            null !== n && t.fromArray(n.array, 16 * e), a.push(t);
                        } else
                            console.warn(
                                'THREE.GLTFLoader: Joint "%s" could not be found.',
                                t.joints[e]
                            );
                    }
                    return new ra(r, a);
                })
            );
        }
        loadAnimation(e) {
            const t = this.json,
                n = this,
                i = t.animations[e],
                r = i.name ? i.name : "animation_" + e,
                a = [],
                s = [],
                o = [],
                l = [],
                c = [];
            for (let e = 0, t = i.channels.length; e < t; e++) {
                const t = i.channels[e],
                    n = i.samplers[t.sampler],
                    r = t.target,
                    h = r.node,
                    d = void 0 !== i.parameters ? i.parameters[n.input] : n.input,
                    u = void 0 !== i.parameters ? i.parameters[n.output] : n.output;
                void 0 !== r.node &&
                    (a.push(this.getDependency("node", h)),
                        s.push(this.getDependency("accessor", d)),
                        o.push(this.getDependency("accessor", u)),
                        l.push(n),
                        c.push(r));
            }
            return Promise.all([
                Promise.all(a),
                Promise.all(s),
                Promise.all(o),
                Promise.all(l),
                Promise.all(c),
            ]).then(function (e) {
                const t = e[0],
                    i = e[1],
                    a = e[2],
                    s = e[3],
                    o = e[4],
                    l = [];
                for (let e = 0, r = t.length; e < r; e++) {
                    const r = t[e],
                        c = i[e],
                        h = a[e],
                        d = s[e],
                        u = o[e];
                    if (void 0 === r) continue;
                    r.updateMatrix && r.updateMatrix();
                    const p = n._createAnimationTracks(r, c, h, d, u);
                    if (p) for (let e = 0; e < p.length; e++) l.push(p[e]);
                }
                return new oo(r, void 0, l);
            });
        }
        createNodeMesh(e) {
            const t = this.json,
                n = this,
                i = t.nodes[e];
            return void 0 === i.mesh
                ? null
                : n.getDependency("mesh", i.mesh).then(function (e) {
                    const t = n._getNodeRef(n.meshCache, i.mesh, e);
                    return (
                        void 0 !== i.weights &&
                        t.traverse(function (e) {
                            if (e.isMesh)
                                for (let t = 0, n = i.weights.length; t < n; t++)
                                    e.morphTargetInfluences[t] = i.weights[t];
                        }),
                        t
                    );
                });
        }
        loadNode(e) {
            const t = this,
                n = this.json.nodes[e],
                i = t._loadNodeShallow(e),
                r = [],
                a = n.children || [];
            for (let e = 0, n = a.length; e < n; e++)
                r.push(t.getDependency("node", a[e]));
            const s =
                void 0 === n.skin
                    ? Promise.resolve(null)
                    : t.getDependency("skin", n.skin);
            return Promise.all([i, Promise.all(r), s]).then(function (e) {
                const t = e[0],
                    n = e[1],
                    i = e[2];
                null !== i &&
                    t.traverse(function (e) {
                        e.isSkinnedMesh && e.bind(i, mc);
                    });
                for (let e = 0, i = n.length; e < i; e++) t.add(n[e]);
                return t;
            });
        }
        _loadNodeShallow(e) {
            const t = this.json,
                n = this.extensions,
                i = this;
            if (void 0 !== this.nodeCache[e]) return this.nodeCache[e];
            const r = t.nodes[e],
                a = r.name ? i.createUniqueName(r.name) : "",
                s = [],
                o = i._invokeOne(function (t) {
                    return t.createNodeMesh && t.createNodeMesh(e);
                });
            return (
                o && s.push(o),
                void 0 !== r.camera &&
                s.push(
                    i.getDependency("camera", r.camera).then(function (e) {
                        return i._getNodeRef(i.cameraCache, r.camera, e);
                    })
                ),
                i
                    ._invokeAll(function (t) {
                        return t.createNodeAttachment && t.createNodeAttachment(e);
                    })
                    .forEach(function (e) {
                        s.push(e);
                    }),
                (this.nodeCache[e] = Promise.all(s).then(function (t) {
                    let s;
                    if (
                        ((s =
                            !0 === r.isBone
                                ? new ea()
                                : t.length > 1
                                    ? new Br()
                                    : 1 === t.length
                                        ? t[0]
                                        : new ki()),
                            s !== t[0])
                    )
                        for (let e = 0, n = t.length; e < n; e++) s.add(t[e]);
                    if (
                        (r.name && ((s.userData.name = r.name), (s.name = a)),
                            hc(s, r),
                            r.extensions && cc(n, s, r),
                            void 0 !== r.matrix)
                    ) {
                        const e = new Xn();
                        e.fromArray(r.matrix), s.applyMatrix4(e);
                    } else void 0 !== r.translation && s.position.fromArray(r.translation), void 0 !== r.rotation && s.quaternion.fromArray(r.rotation), void 0 !== r.scale && s.scale.fromArray(r.scale);
                    return (
                        i.associations.has(s) || i.associations.set(s, {}),
                        (i.associations.get(s).nodes = e),
                        s
                    );
                })),
                this.nodeCache[e]
            );
        }
        loadScene(e) {
            const t = this.extensions,
                n = this.json.scenes[e],
                i = this,
                r = new Br();
            n.name && (r.name = i.createUniqueName(n.name)),
                hc(r, n),
                n.extensions && cc(t, r, n);
            const a = n.nodes || [],
                s = [];
            for (let e = 0, t = a.length; e < t; e++)
                s.push(i.getDependency("node", a[e]));
            return Promise.all(s).then(function (e) {
                for (let t = 0, n = e.length; t < n; t++) r.add(e[t]);
                return (
                    (i.associations = ((e) => {
                        const t = new Map();
                        for (const [e, n] of i.associations)
                            (e instanceof ji || e instanceof pn) && t.set(e, n);
                        return (
                            e.traverse((e) => {
                                const n = i.associations.get(e);
                                null != n && t.set(e, n);
                            }),
                            t
                        );
                    })(r)),
                    r
                );
            });
        }
        _createAnimationTracks(e, t, n, i, r) {
            const a = [],
                s = e.name ? e.name : e.uuid,
                o = [];
            let l;
            switch (
            (rc[r.path] === rc.weights
                ? e.traverse(function (e) {
                    e.morphTargetInfluences && o.push(e.name ? e.name : e.uuid);
                })
                : o.push(s),
                rc[r.path])
            ) {
                case rc.weights:
                    l = no;
                    break;
                case rc.rotation:
                    l = ro;
                    break;
                case rc.position:
                case rc.scale:
                    l = so;
                    break;
                default:
                    if (1 === n.itemSize) l = no;
                    else l = so;
            }
            const c = void 0 !== i.interpolation ? ac[i.interpolation] : dt,
                h = this._getArrayFromAccessor(n);
            for (let e = 0, n = o.length; e < n; e++) {
                const n = new l(o[e] + "." + rc[r.path], t.array, h, c);
                "CUBICSPLINE" === i.interpolation &&
                    this._createCubicSplineTrackInterpolant(n),
                    a.push(n);
            }
            return a;
        }
        _getArrayFromAccessor(e) {
            let t = e.array;
            if (e.normalized) {
                const e = fc(t.constructor),
                    n = new Float32Array(t.length);
                for (let i = 0, r = t.length; i < r; i++) n[i] = t[i] * e;
                t = n;
            }
            return t;
        }
        _createCubicSplineTrackInterpolant(e) {
            (e.createInterpolant = function (e) {
                return new (this instanceof ro ? Zl : Yl)(
                    this.times,
                    this.values,
                    this.getValueSize() / 3,
                    e
                );
            }),
                (e.createInterpolant.isInterpolantFactoryMethodGLTFCubicSpline =
                    !0);
        }
    }














    class Ul {
        constructor(e) {
            (this.parser = e), (this.name = kl.KHR_TEXTURE_BASISU);
        }
        loadTexture(e) {
            const t = this.parser,
                n = t.json,
                i = n.textures[e];
            if (!i.extensions || !i.extensions[this.name]) return null;
            const r = i.extensions[this.name],
                a = t.options.ktx2Loader;
            if (!a) {
                if (
                    n.extensionsRequired &&
                    n.extensionsRequired.indexOf(this.name) >= 0
                )
                    throw new Error(
                        "THREE.GLTFLoader: setKTX2Loader must be called before loading KTX2 textures"
                    );
                return null;
            }
            return t.loadTextureImage(e, r.source, a);
        }
    }
    class zl {
        constructor(e) {
            (this.parser = e),
                (this.name = kl.EXT_TEXTURE_WEBP),
                (this.isSupported = null);
        }
        loadTexture(e) {
            const t = this.name,
                n = this.parser,
                i = n.json,
                r = i.textures[e];
            if (!r.extensions || !r.extensions[t]) return null;
            const a = r.extensions[t],
                s = i.images[a.source];
            let o = n.textureLoader;
            if (s.uri) {
                const e = n.options.manager.getHandler(s.uri);
                null !== e && (o = e);
            }
            return this.detectSupport().then(function (r) {
                if (r) return n.loadTextureImage(e, a.source, o);
                if (i.extensionsRequired && i.extensionsRequired.indexOf(t) >= 0)
                    throw new Error(
                        "THREE.GLTFLoader: WebP required by asset but unsupported."
                    );
                return n.loadTexture(e);
            });
        }
        detectSupport() {
            return (
                this.isSupported ||
                (this.isSupported = new Promise(function (e) {
                    const t = new Image();
                    (t.src =
                        "data:image/webp;base64,UklGRiIAAABXRUJQVlA4IBYAAAAwAQCdASoBAAEADsD+JaQAA3AAAAAA"),
                        (t.onload = t.onerror =
                            function () {
                                e(1 === t.height);
                            });
                })),
                this.isSupported
            );
        }
    }
    class Ol {
        constructor(e) {
            (this.parser = e),
                (this.name = kl.EXT_TEXTURE_AVIF),
                (this.isSupported = null);
        }
        loadTexture(e) {
            const t = this.name,
                n = this.parser,
                i = n.json,
                r = i.textures[e];
            if (!r.extensions || !r.extensions[t]) return null;
            const a = r.extensions[t],
                s = i.images[a.source];
            let o = n.textureLoader;
            if (s.uri) {
                const e = n.options.manager.getHandler(s.uri);
                null !== e && (o = e);
            }
            return this.detectSupport().then(function (r) {
                if (r) return n.loadTextureImage(e, a.source, o);
                if (i.extensionsRequired && i.extensionsRequired.indexOf(t) >= 0)
                    throw new Error(
                        "THREE.GLTFLoader: AVIF required by asset but unsupported."
                    );
                return n.loadTexture(e);
            });
        }
        detectSupport() {
            return (
                this.isSupported ||
                (this.isSupported = new Promise(function (e) {
                    const t = new Image();
                    (t.src =
                        "data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAABcAAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAEAAAABAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQAMAAAAABNjb2xybmNseAACAAIABoAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAAB9tZGF0EgAKCBgABogQEDQgMgkQAAAAB8dSLfI="),
                        (t.onload = t.onerror =
                            function () {
                                e(1 === t.height);
                            });
                })),
                this.isSupported
            );
        }
    }
    class Pl {
        constructor(e) {
            (this.parser = e), (this.name = kl.KHR_MATERIALS_SHEEN);
        }
        getMaterialType(e) {
            const t = this.parser.json.materials[e];
            return t.extensions && t.extensions[this.name] ? Fs : null;
        }
        extendMaterialParams(e, t) {
            const n = this.parser,
                i = n.json.materials[e];
            if (!i.extensions || !i.extensions[this.name])
                return Promise.resolve();
            const r = [];
            (t.sheenColor = new Hi(0, 0, 0)),
                (t.sheenRoughness = 0),
                (t.sheen = 1);
            const a = i.extensions[this.name];
            if (void 0 !== a.sheenColorFactor) {
                const e = a.sheenColorFactor;
                t.sheenColor.setRGB(e[0], e[1], e[2], wt);
            }
            return (
                void 0 !== a.sheenRoughnessFactor &&
                (t.sheenRoughness = a.sheenRoughnessFactor),
                void 0 !== a.sheenColorTexture &&
                r.push(
                    n.assignTexture(t, "sheenColorMap", a.sheenColorTexture, vt)
                ),
                void 0 !== a.sheenRoughnessTexture &&
                r.push(
                    n.assignTexture(t, "sheenRoughnessMap", a.sheenRoughnessTexture)
                ),
                Promise.all(r)
            );
        }
    }
    class Il {
        constructor(e) {
            (this.parser = e), (this.name = kl.KHR_MATERIALS_TRANSMISSION);
        }
        getMaterialType(e) {
            const t = this.parser.json.materials[e];
            return t.extensions && t.extensions[this.name] ? Fs : null;
        }
        extendMaterialParams(e, t) {
            const n = this.parser,
                i = n.json.materials[e];
            if (!i.extensions || !i.extensions[this.name])
                return Promise.resolve();
            const r = [],
                a = i.extensions[this.name];
            return (
                void 0 !== a.transmissionFactor &&
                (t.transmission = a.transmissionFactor),
                void 0 !== a.transmissionTexture &&
                r.push(
                    n.assignTexture(t, "transmissionMap", a.transmissionTexture)
                ),
                Promise.all(r)
            );
        }
    }
    class Rl {
        constructor(e) {
            (this.parser = e), (this.name = kl.KHR_MATERIALS_VOLUME);
        }
        getMaterialType(e) {
            const t = this.parser.json.materials[e];
            return t.extensions && t.extensions[this.name] ? Fs : null;
        }
        extendMaterialParams(e, t) {
            const n = this.parser,
                i = n.json.materials[e];
            if (!i.extensions || !i.extensions[this.name])
                return Promise.resolve();
            const r = [],
                a = i.extensions[this.name];
            (t.thickness = void 0 !== a.thicknessFactor ? a.thicknessFactor : 0),
                void 0 !== a.thicknessTexture &&
                r.push(n.assignTexture(t, "thicknessMap", a.thicknessTexture)),
                (t.attenuationDistance = a.attenuationDistance || 1 / 0);
            const s = a.attenuationColor || [1, 1, 1];
            return (
                (t.attenuationColor = new Hi().setRGB(s[0], s[1], s[2], wt)),
                Promise.all(r)
            );
        }
    }
    class Ll {
        constructor(e) {
            (this.parser = e), (this.name = kl.KHR_MATERIALS_IOR);
        }
        getMaterialType(e) {
            const t = this.parser.json.materials[e];
            return t.extensions && t.extensions[this.name] ? Fs : null;
        }
        extendMaterialParams(e, t) {
            const n = this.parser.json.materials[e];
            if (!n.extensions || !n.extensions[this.name])
                return Promise.resolve();
            const i = n.extensions[this.name];
            return (t.ior = void 0 !== i.ior ? i.ior : 1.5), Promise.resolve();
        }
    }
    class Dl {
        constructor(e) {
            (this.parser = e), (this.name = kl.KHR_MATERIALS_SPECULAR);
        }
        getMaterialType(e) {
            const t = this.parser.json.materials[e];
            return t.extensions && t.extensions[this.name] ? Fs : null;
        }
        extendMaterialParams(e, t) {
            const n = this.parser,
                i = n.json.materials[e];
            if (!i.extensions || !i.extensions[this.name])
                return Promise.resolve();
            const r = [],
                a = i.extensions[this.name];
            (t.specularIntensity =
                void 0 !== a.specularFactor ? a.specularFactor : 1),
                void 0 !== a.specularTexture &&
                r.push(
                    n.assignTexture(t, "specularIntensityMap", a.specularTexture)
                );
            const s = a.specularColorFactor || [1, 1, 1];
            return (
                (t.specularColor = new Hi().setRGB(s[0], s[1], s[2], wt)),
                void 0 !== a.specularColorTexture &&
                r.push(
                    n.assignTexture(
                        t,
                        "specularColorMap",
                        a.specularColorTexture,
                        vt
                    )
                ),
                Promise.all(r)
            );
        }
    }
    class Nl {
        constructor(e) {
            (this.parser = e), (this.name = kl.EXT_MATERIALS_BUMP);
        }
        getMaterialType(e) {
            const t = this.parser.json.materials[e];
            return t.extensions && t.extensions[this.name] ? Fs : null;
        }
        extendMaterialParams(e, t) {
            const n = this.parser,
                i = n.json.materials[e];
            if (!i.extensions || !i.extensions[this.name])
                return Promise.resolve();
            const r = [],
                a = i.extensions[this.name];
            return (
                (t.bumpScale = void 0 !== a.bumpFactor ? a.bumpFactor : 1),
                void 0 !== a.bumpTexture &&
                r.push(n.assignTexture(t, "bumpMap", a.bumpTexture)),
                Promise.all(r)
            );
        }
    }
    class Bl {
        constructor(e) {
            (this.parser = e), (this.name = kl.KHR_MATERIALS_ANISOTROPY);
        }
        getMaterialType(e) {
            const t = this.parser.json.materials[e];
            return t.extensions && t.extensions[this.name] ? Fs : null;
        }
        extendMaterialParams(e, t) {
            const n = this.parser,
                i = n.json.materials[e];
            if (!i.extensions || !i.extensions[this.name])
                return Promise.resolve();
            const r = [],
                a = i.extensions[this.name];
            return (
                void 0 !== a.anisotropyStrength &&
                (t.anisotropy = a.anisotropyStrength),
                void 0 !== a.anisotropyRotation &&
                (t.anisotropyRotation = a.anisotropyRotation),
                void 0 !== a.anisotropyTexture &&
                r.push(n.assignTexture(t, "anisotropyMap", a.anisotropyTexture)),
                Promise.all(r)
            );
        }
    }
    class Ml {
        constructor(e) {
            (this.parser = e), (this.name = kl.KHR_MATERIALS_EMISSIVE_STRENGTH);
        }
        extendMaterialParams(e, t) {
            const n = this.parser.json.materials[e];
            if (!n.extensions || !n.extensions[this.name])
                return Promise.resolve();
            const i = n.extensions[this.name].emissiveStrength;
            return void 0 !== i && (t.emissiveIntensity = i), Promise.resolve();
        }
    }
    class El {
        constructor(e) {
            (this.parser = e),
                (this.name = kl.KHR_LIGHTS_PUNCTUAL),
                (this.cache = { refs: {}, uses: {} });
        }
        _markDefs() {
            const e = this.parser,
                t = this.parser.json.nodes || [];
            for (let n = 0, i = t.length; n < i; n++) {
                const i = t[n];
                i.extensions &&
                    i.extensions[this.name] &&
                    void 0 !== i.extensions[this.name].light &&
                    e._addNodeRef(this.cache, i.extensions[this.name].light);
            }
        }
        _loadLight(e) {
            const t = this.parser,
                n = "light:" + e;
            let i = t.cache.get(n);
            if (i) return i;
            const r = t.json,
                a = (((r.extensions && r.extensions[this.name]) || {}).lights ||
                    [])[e];
            let s;
            const o = new Hi(16777215);
            void 0 !== a.color &&
                o.setRGB(a.color[0], a.color[1], a.color[2], wt);
            const l = void 0 !== a.range ? a.range : 0;
            switch (a.type) {
                case "directional":
                    (s = new Do(o)), s.target.position.set(0, 0, -1), s.add(s.target);
                    break;
                case "point":
                    (s = new Io(o)), (s.distance = l);
                    break;
                case "spot":
                    (s = new Mo(o)),
                        (s.distance = l),
                        (a.spot = a.spot || {}),
                        (a.spot.innerConeAngle =
                            void 0 !== a.spot.innerConeAngle ? a.spot.innerConeAngle : 0),
                        (a.spot.outerConeAngle =
                            void 0 !== a.spot.outerConeAngle
                                ? a.spot.outerConeAngle
                                : Math.PI / 4),
                        (s.angle = a.spot.outerConeAngle),
                        (s.penumbra =
                            1 - a.spot.innerConeAngle / a.spot.outerConeAngle),
                        s.target.position.set(0, 0, -1),
                        s.add(s.target);
                    break;
                default:
                    throw new Error(
                        "THREE.GLTFLoader: Unexpected light type: " + a.type
                    );
            }
            return (
                s.position.set(0, 0, 0),
                hc(s, a),
                void 0 !== a.intensity && (s.intensity = a.intensity),
                (s.name = t.createUniqueName(a.name || "light_" + e)),
                (i = Promise.resolve(s)),
                t.cache.add(n, i),
                i
            );
        }
        getDependency(e, t) {
            if ("light" === e) return this._loadLight(t);
        }
        createNodeAttachment(e) {
            const t = this,
                n = this.parser,
                i = n.json.nodes[e],
                r = ((i.extensions && i.extensions[this.name]) || {}).light;
            return void 0 === r
                ? null
                : this._loadLight(r).then(function (e) {
                    return n._getNodeRef(t.cache, r, e);
                });
        }
    }
    class Fl {
        constructor(e) {
            (this.name = kl.EXT_MESHOPT_COMPRESSION), (this.parser = e);
        }
        loadBufferView(e) {
            const t = this.parser.json,
                n = t.bufferViews[e];
            if (n.extensions && n.extensions[this.name]) {
                const e = n.extensions[this.name],
                    i = this.parser.getDependency("buffer", e.buffer),
                    r = this.parser.options.meshoptDecoder;
                if (!r || !r.supported) {
                    if (
                        t.extensionsRequired &&
                        t.extensionsRequired.indexOf(this.name) >= 0
                    )
                        throw new Error(
                            "THREE.GLTFLoader: setMeshoptDecoder must be called before loading compressed files"
                        );
                    return null;
                }
                return i.then(function (t) {
                    const n = e.byteOffset || 0,
                        i = e.byteLength || 0,
                        a = e.count,
                        s = e.byteStride,
                        o = new Uint8Array(t, n, i);
                    return r.decodeGltfBufferAsync
                        ? r
                            .decodeGltfBufferAsync(a, s, o, e.mode, e.filter)
                            .then(function (e) {
                                return e.buffer;
                            })
                        : r.ready.then(function () {
                            const t = new ArrayBuffer(a * s);
                            return (
                                r.decodeGltfBuffer(
                                    new Uint8Array(t),
                                    a,
                                    s,
                                    o,
                                    e.mode,
                                    e.filter
                                ),
                                t
                            );
                        });
                });
            }
            return null;
        }
    }
    class Wl {
        constructor(e) {
            (this.name = kl.EXT_MESH_GPU_INSTANCING), (this.parser = e);
        }
        createNodeMesh(e) {
            const t = this.parser.json,
                n = t.nodes[e];
            if (!n.extensions || !n.extensions[this.name] || void 0 === n.mesh)
                return null;
            const i = t.meshes[n.mesh];
            for (const e of i.primitives)
                if (
                    e.mode !== Jl.TRIANGLES &&
                    e.mode !== Jl.TRIANGLE_STRIP &&
                    e.mode !== Jl.TRIANGLE_FAN &&
                    void 0 !== e.mode
                )
                    return null;
            const r = n.extensions[this.name].attributes,
                a = [],
                s = {};
            for (const e in r)
                a.push(
                    this.parser
                        .getDependency("accessor", r[e])
                        .then((t) => ((s[e] = t), s[e]))
                );
            return a.length < 1
                ? null
                : (a.push(this.parser.createNodeMesh(e)),
                    Promise.all(a).then((e) => {
                        const t = e.pop(),
                            n = t.isGroup ? t.children : [t],
                            i = e[0].count,
                            r = [];
                        for (const e of n) {
                            const t = new Xn(),
                                n = new bn(),
                                a = new yn(),
                                o = new bn(1, 1, 1),
                                l = new pa(e.geometry, e.material, i);
                            for (let e = 0; e < i; e++)
                                s.TRANSLATION && n.fromBufferAttribute(s.TRANSLATION, e),
                                    s.ROTATION && a.fromBufferAttribute(s.ROTATION, e),
                                    s.SCALE && o.fromBufferAttribute(s.SCALE, e),
                                    l.setMatrixAt(e, t.compose(n, a, o));
                            for (const t in s)
                                if ("_COLOR_0" === t) {
                                    const e = s[t];
                                    l.instanceColor = new aa(
                                        e.array,
                                        e.itemSize,
                                        e.normalized
                                    );
                                } else
                                    "TRANSLATION" !== t &&
                                        "ROTATION" !== t &&
                                        "SCALE" !== t &&
                                        e.geometry.setAttribute(t, s[t]);
                            ki.prototype.copy.call(l, e),
                                this.parser.assignFinalMaterial(l),
                                r.push(l);
                        }
                        return t.isGroup ? (t.clear(), t.add(...r), t) : r[0];
                    }));
        }
    }
    class Ql {
        constructor(e, t) {
            if (!t)
                throw new Error(
                    "THREE.GLTFLoader: No DRACOLoader instance provided."
                );
            (this.name = kl.KHR_DRACO_MESH_COMPRESSION),
                (this.json = e),
                (this.dracoLoader = t),
                this.dracoLoader.preload();
        }
        decodePrimitive(e, t) {
            const n = this.json,
                i = this.dracoLoader,
                r = e.extensions[this.name].bufferView,
                a = e.extensions[this.name].attributes,
                s = {},
                o = {},
                l = {};
            for (const e in a) {
                const t = ic[e] || e.toLowerCase();
                s[t] = a[e];
            }
            for (const t in e.attributes) {
                const i = ic[t] || t.toLowerCase();
                if (void 0 !== a[t]) {
                    const r = n.accessors[e.attributes[t]],
                        a = $l[r.componentType];
                    (l[i] = a.name), (o[i] = !0 === r.normalized);
                }
            }
            return t.getDependency("bufferView", r).then(function (e) {
                return new Promise(function (t, n) {
                    i.decodeDracoFile(
                        e,
                        function (e) {
                            for (const t in e.attributes) {
                                const n = e.attributes[t],
                                    i = o[t];
                                void 0 !== i && (n.normalized = i);
                            }
                            t(e);
                        },
                        s,
                        l,
                        wt,
                        n
                    );
                });
            });
        }
    }




    let li = 0;
    const ci = new bn(),
        hi = new yn(),
        di = new Xn(),
        ui = new bn(),
        pi = new bn(),
        fi = new bn(),
        mi = new yn(),
        gi = new bn(1, 0, 0),
        vi = new bn(0, 1, 0),
        wi = new bn(0, 0, 1),
        yi = { type: "added" },
        bi = { type: "removed" },
        Ai = { type: "childadded", child: null },
        xi = { type: "childremoved", child: null };
    class ki extends Dt {
        constructor() {
            super(),
                (this.isObject3D = !0),
                Object.defineProperty(this, "id", { value: li++ }),
                (this.uuid = Ot()),
                (this.name = ""),
                (this.type = "Object3D"),
                (this.parent = null),
                (this.children = []),
                (this.up = ki.DEFAULT_UP.clone());
            const e = new bn(),
                t = new si(),
                n = new yn(),
                i = new bn(1, 1, 1);
            t._onChange(function () {
                n.setFromEuler(t, !1);
            }),
                n._onChange(function () {
                    t.setFromQuaternion(n, void 0, !1);
                }),
                Object.defineProperties(this, {
                    position: { configurable: !0, enumerable: !0, value: e },
                    rotation: { configurable: !0, enumerable: !0, value: t },
                    quaternion: { configurable: !0, enumerable: !0, value: n },
                    scale: { configurable: !0, enumerable: !0, value: i },
                    modelViewMatrix: { value: new Xn() },
                    normalMatrix: { value: new Kt() },
                }),
                (this.matrix = new Xn()),
                (this.matrixWorld = new Xn()),
                (this.matrixAutoUpdate = ki.DEFAULT_MATRIX_AUTO_UPDATE),
                (this.matrixWorldAutoUpdate = ki.DEFAULT_MATRIX_WORLD_AUTO_UPDATE),
                (this.matrixWorldNeedsUpdate = !1),
                (this.layers = new oi()),
                (this.visible = !0),
                (this.castShadow = !1),
                (this.receiveShadow = !1),
                (this.frustumCulled = !0),
                (this.renderOrder = 0),
                (this.animations = []),
                (this.userData = {});
        }
        onBeforeShadow() { }
        onAfterShadow() { }
        onBeforeRender() { }
        onAfterRender() { }
        applyMatrix4(e) {
            this.matrixAutoUpdate && this.updateMatrix(),
                this.matrix.premultiply(e),
                this.matrix.decompose(this.position, this.quaternion, this.scale);
        }
        applyQuaternion(e) {
            return this.quaternion.premultiply(e), this;
        }
        setRotationFromAxisAngle(e, t) {
            this.quaternion.setFromAxisAngle(e, t);
        }
        setRotationFromEuler(e) {
            this.quaternion.setFromEuler(e, !0);
        }
        setRotationFromMatrix(e) {
            this.quaternion.setFromRotationMatrix(e);
        }
        setRotationFromQuaternion(e) {
            this.quaternion.copy(e);
        }
        rotateOnAxis(e, t) {
            return hi.setFromAxisAngle(e, t), this.quaternion.multiply(hi), this;
        }
        rotateOnWorldAxis(e, t) {
            return (
                hi.setFromAxisAngle(e, t), this.quaternion.premultiply(hi), this
            );
        }
        rotateX(e) {
            return this.rotateOnAxis(gi, e);
        }
        rotateY(e) {
            return this.rotateOnAxis(vi, e);
        }
        rotateZ(e) {
            return this.rotateOnAxis(wi, e);
        }
        translateOnAxis(e, t) {
            return (
                ci.copy(e).applyQuaternion(this.quaternion),
                this.position.add(ci.multiplyScalar(t)),
                this
            );
        }
        translateX(e) {
            return this.translateOnAxis(gi, e);
        }
        translateY(e) {
            return this.translateOnAxis(vi, e);
        }
        translateZ(e) {
            return this.translateOnAxis(wi, e);
        }
        localToWorld(e) {
            return (
                this.updateWorldMatrix(!0, !1), e.applyMatrix4(this.matrixWorld)
            );
        }
        worldToLocal(e) {
            return (
                this.updateWorldMatrix(!0, !1),
                e.applyMatrix4(di.copy(this.matrixWorld).invert())
            );
        }
        lookAt(e, t, n) {
            e.isVector3 ? ui.copy(e) : ui.set(e, t, n);
            const i = this.parent;
            this.updateWorldMatrix(!0, !1),
                pi.setFromMatrixPosition(this.matrixWorld),
                this.isCamera || this.isLight
                    ? di.lookAt(pi, ui, this.up)
                    : di.lookAt(ui, pi, this.up),
                this.quaternion.setFromRotationMatrix(di),
                i &&
                (di.extractRotation(i.matrixWorld),
                    hi.setFromRotationMatrix(di),
                    this.quaternion.premultiply(hi.invert()));
        }
        add(e) {
            if (arguments.length > 1) {
                for (let e = 0; e < arguments.length; e++) this.add(arguments[e]);
                return this;
            }
            return e === this
                ? (console.error(
                    "THREE.Object3D.add: object can't be added as a child of itself.",
                    e
                ),
                    this)
                : (e && e.isObject3D
                    ? (e.removeFromParent(),
                        (e.parent = this),
                        this.children.push(e),
                        e.dispatchEvent(yi),
                        (Ai.child = e),
                        this.dispatchEvent(Ai),
                        (Ai.child = null))
                    : console.error(
                        "THREE.Object3D.add: object not an instance of THREE.Object3D.",
                        e
                    ),
                    this);
        }
        remove(e) {
            if (arguments.length > 1) {
                for (let e = 0; e < arguments.length; e++)
                    this.remove(arguments[e]);
                return this;
            }
            const t = this.children.indexOf(e);
            return (
                -1 !== t &&
                ((e.parent = null),
                    this.children.splice(t, 1),
                    e.dispatchEvent(bi),
                    (xi.child = e),
                    this.dispatchEvent(xi),
                    (xi.child = null)),
                this
            );
        }
        removeFromParent() {
            const e = this.parent;
            return null !== e && e.remove(this), this;
        }
        clear() {
            return this.remove(...this.children);
        }
        attach(e) {
            return (
                this.updateWorldMatrix(!0, !1),
                di.copy(this.matrixWorld).invert(),
                null !== e.parent &&
                (e.parent.updateWorldMatrix(!0, !1),
                    di.multiply(e.parent.matrixWorld)),
                e.applyMatrix4(di),
                e.removeFromParent(),
                (e.parent = this),
                this.children.push(e),
                e.updateWorldMatrix(!1, !0),
                e.dispatchEvent(yi),
                (Ai.child = e),
                this.dispatchEvent(Ai),
                (Ai.child = null),
                this
            );
        }
        getObjectById(e) {
            return this.getObjectByProperty("id", e);
        }
        getObjectByName(e) {
            return this.getObjectByProperty("name", e);
        }
        getObjectByProperty(e, t) {
            if (this[e] === t) return this;
            for (let n = 0, i = this.children.length; n < i; n++) {
                const i = this.children[n].getObjectByProperty(e, t);
                if (void 0 !== i) return i;
            }
        }
        getObjectsByProperty(e, t, n = []) {
            this[e] === t && n.push(this);
            const i = this.children;
            for (let r = 0, a = i.length; r < a; r++)
                i[r].getObjectsByProperty(e, t, n);
            return n;
        }
        getWorldPosition(e) {
            return (
                this.updateWorldMatrix(!0, !1),
                e.setFromMatrixPosition(this.matrixWorld)
            );
        }
        getWorldQuaternion(e) {
            return (
                this.updateWorldMatrix(!0, !1),
                this.matrixWorld.decompose(pi, e, fi),
                e
            );
        }
        getWorldScale(e) {
            return (
                this.updateWorldMatrix(!0, !1),
                this.matrixWorld.decompose(pi, mi, e),
                e
            );
        }
        getWorldDirection(e) {
            this.updateWorldMatrix(!0, !1);
            const t = this.matrixWorld.elements;
            return e.set(t[8], t[9], t[10]).normalize();
        }
        raycast() { }
        traverse(e) {
            e(this);
            const t = this.children;
            for (let n = 0, i = t.length; n < i; n++) t[n].traverse(e);
        }
        traverseVisible(e) {
            if (!1 === this.visible) return;
            e(this);
            const t = this.children;
            for (let n = 0, i = t.length; n < i; n++) t[n].traverseVisible(e);
        }
        traverseAncestors(e) {
            const t = this.parent;
            null !== t && (e(t), t.traverseAncestors(e));
        }
        updateMatrix() {
            this.matrix.compose(this.position, this.quaternion, this.scale),
                (this.matrixWorldNeedsUpdate = !0);
        }
        updateMatrixWorld(e) {
            this.matrixAutoUpdate && this.updateMatrix(),
                (this.matrixWorldNeedsUpdate || e) &&
                (!0 === this.matrixWorldAutoUpdate &&
                    (null === this.parent
                        ? this.matrixWorld.copy(this.matrix)
                        : this.matrixWorld.multiplyMatrices(
                            this.parent.matrixWorld,
                            this.matrix
                        )),
                    (this.matrixWorldNeedsUpdate = !1),
                    (e = !0));
            const t = this.children;
            for (let n = 0, i = t.length; n < i; n++) {
                t[n].updateMatrixWorld(e);
            }
        }
        updateWorldMatrix(e, t) {
            const n = this.parent;
            if (
                (!0 === e && null !== n && n.updateWorldMatrix(!0, !1),
                    this.matrixAutoUpdate && this.updateMatrix(),
                    !0 === this.matrixWorldAutoUpdate &&
                    (null === this.parent
                        ? this.matrixWorld.copy(this.matrix)
                        : this.matrixWorld.multiplyMatrices(
                            this.parent.matrixWorld,
                            this.matrix
                        )),
                    !0 === t)
            ) {
                const e = this.children;
                for (let t = 0, n = e.length; t < n; t++) {
                    e[t].updateWorldMatrix(!1, !0);
                }
            }
        }
        toJSON(e) {
            const t = void 0 === e || "string" == typeof e,
                n = {};
            t &&
                ((e = {
                    geometries: {},
                    materials: {},
                    textures: {},
                    images: {},
                    shapes: {},
                    skeletons: {},
                    animations: {},
                    nodes: {},
                }),
                    (n.metadata = {
                        version: 4.6,
                        type: "Object",
                        generator: "Object3D.toJSON",
                    }));
            const i = {};
            function r(t, n) {
                return void 0 === t[n.uuid] && (t[n.uuid] = n.toJSON(e)), n.uuid;
            }
            if (
                ((i.uuid = this.uuid),
                    (i.type = this.type),
                    "" !== this.name && (i.name = this.name),
                    !0 === this.castShadow && (i.castShadow = !0),
                    !0 === this.receiveShadow && (i.receiveShadow = !0),
                    !1 === this.visible && (i.visible = !1),
                    !1 === this.frustumCulled && (i.frustumCulled = !1),
                    0 !== this.renderOrder && (i.renderOrder = this.renderOrder),
                    Object.keys(this.userData).length > 0 &&
                    (i.userData = this.userData),
                    (i.layers = this.layers.mask),
                    (i.matrix = this.matrix.toArray()),
                    (i.up = this.up.toArray()),
                    !1 === this.matrixAutoUpdate && (i.matrixAutoUpdate = !1),
                    this.isInstancedMesh &&
                    ((i.type = "InstancedMesh"),
                        (i.count = this.count),
                        (i.instanceMatrix = this.instanceMatrix.toJSON()),
                        null !== this.instanceColor &&
                        (i.instanceColor = this.instanceColor.toJSON())),
                    this.isBatchedMesh &&
                    ((i.type = "BatchedMesh"),
                        (i.perObjectFrustumCulled = this.perObjectFrustumCulled),
                        (i.sortObjects = this.sortObjects),
                        (i.drawRanges = this._drawRanges),
                        (i.reservedRanges = this._reservedRanges),
                        (i.visibility = this._visibility),
                        (i.active = this._active),
                        (i.bounds = this._bounds.map((e) => ({
                            boxInitialized: e.boxInitialized,
                            boxMin: e.box.min.toArray(),
                            boxMax: e.box.max.toArray(),
                            sphereInitialized: e.sphereInitialized,
                            sphereRadius: e.sphere.radius,
                            sphereCenter: e.sphere.center.toArray(),
                        }))),
                        (i.maxInstanceCount = this._maxInstanceCount),
                        (i.maxVertexCount = this._maxVertexCount),
                        (i.maxIndexCount = this._maxIndexCount),
                        (i.geometryInitialized = this._geometryInitialized),
                        (i.geometryCount = this._geometryCount),
                        (i.matricesTexture = this._matricesTexture.toJSON(e)),
                        null !== this._colorsTexture &&
                        (i.colorsTexture = this._colorsTexture.toJSON(e)),
                        null !== this.boundingSphere &&
                        (i.boundingSphere = {
                            center: i.boundingSphere.center.toArray(),
                            radius: i.boundingSphere.radius,
                        }),
                        null !== this.boundingBox &&
                        (i.boundingBox = {
                            min: i.boundingBox.min.toArray(),
                            max: i.boundingBox.max.toArray(),
                        })),
                    this.isScene)
            )
                this.background &&
                    (this.background.isColor
                        ? (i.background = this.background.toJSON())
                        : this.background.isTexture &&
                        (i.background = this.background.toJSON(e).uuid)),
                    this.environment &&
                    this.environment.isTexture &&
                    !0 !== this.environment.isRenderTargetTexture &&
                    (i.environment = this.environment.toJSON(e).uuid);
            else if (this.isMesh || this.isLine || this.isPoints) {
                i.geometry = r(e.geometries, this.geometry);
                const t = this.geometry.parameters;
                if (void 0 !== t && void 0 !== t.shapes) {
                    const n = t.shapes;
                    if (Array.isArray(n))
                        for (let t = 0, i = n.length; t < i; t++) {
                            const i = n[t];
                            r(e.shapes, i);
                        }
                    else r(e.shapes, n);
                }
            }
            if (
                (this.isSkinnedMesh &&
                    ((i.bindMode = this.bindMode),
                        (i.bindMatrix = this.bindMatrix.toArray()),
                        void 0 !== this.skeleton &&
                        (r(e.skeletons, this.skeleton),
                            (i.skeleton = this.skeleton.uuid))),
                    void 0 !== this.material)
            )
                if (Array.isArray(this.material)) {
                    const t = [];
                    for (let n = 0, i = this.material.length; n < i; n++)
                        t.push(r(e.materials, this.material[n]));
                    i.material = t;
                } else i.material = r(e.materials, this.material);
            if (this.children.length > 0) {
                i.children = [];
                for (let t = 0; t < this.children.length; t++)
                    i.children.push(this.children[t].toJSON(e).object);
            }
            if (this.animations.length > 0) {
                i.animations = [];
                for (let t = 0; t < this.animations.length; t++) {
                    const n = this.animations[t];
                    i.animations.push(r(e.animations, n));
                }
            }
            if (t) {
                const t = a(e.geometries),
                    i = a(e.materials),
                    r = a(e.textures),
                    s = a(e.images),
                    o = a(e.shapes),
                    l = a(e.skeletons),
                    c = a(e.animations),
                    h = a(e.nodes);
                t.length > 0 && (n.geometries = t),
                    i.length > 0 && (n.materials = i),
                    r.length > 0 && (n.textures = r),
                    s.length > 0 && (n.images = s),
                    o.length > 0 && (n.shapes = o),
                    l.length > 0 && (n.skeletons = l),
                    c.length > 0 && (n.animations = c),
                    h.length > 0 && (n.nodes = h);
            }
            return (n.object = i), n;
            function a(e) {
                const t = [];
                for (const n in e) {
                    const i = e[n];
                    delete i.metadata, t.push(i);
                }
                return t;
            }
        }
        clone(e) {
            return new this.constructor().copy(this, e);
        }
        copy(e, t = !0) {
            if (
                ((this.name = e.name),
                    this.up.copy(e.up),
                    this.position.copy(e.position),
                    (this.rotation.order = e.rotation.order),
                    this.quaternion.copy(e.quaternion),
                    this.scale.copy(e.scale),
                    this.matrix.copy(e.matrix),
                    this.matrixWorld.copy(e.matrixWorld),
                    (this.matrixAutoUpdate = e.matrixAutoUpdate),
                    (this.matrixWorldAutoUpdate = e.matrixWorldAutoUpdate),
                    (this.matrixWorldNeedsUpdate = e.matrixWorldNeedsUpdate),
                    (this.layers.mask = e.layers.mask),
                    (this.visible = e.visible),
                    (this.castShadow = e.castShadow),
                    (this.receiveShadow = e.receiveShadow),
                    (this.frustumCulled = e.frustumCulled),
                    (this.renderOrder = e.renderOrder),
                    (this.animations = e.animations.slice()),
                    (this.userData = JSON.parse(JSON.stringify(e.userData))),
                    !0 === t)
            )
                for (let t = 0; t < e.children.length; t++) {
                    const n = e.children[t];
                    this.add(n.clone());
                }
            return this;
        }
    }
    class Br extends ki {
        constructor() {
            super(), (this.isGroup = !0), (this.type = "Group");
        }
    }

    (ki.DEFAULT_UP = new bn(0, 1, 0)),
        (ki.DEFAULT_MATRIX_AUTO_UPDATE = !0),
        (ki.DEFAULT_MATRIX_WORLD_AUTO_UPDATE = !0);



    class oi {
        constructor() {
            this.mask = 1;
        }
        set(e) {
            this.mask = (1 << e) >>> 0;
        }
        enable(e) {
            this.mask |= 1 << e;
        }
        enableAll() {
            this.mask = -1;
        }
        toggle(e) {
            this.mask ^= 1 << e;
        }
        disable(e) {
            this.mask &= ~(1 << e);
        }
        disableAll() {
            this.mask = 0;
        }
        test(e) {
            return !!(this.mask & e.mask);
        }
        isEnabled(e) {
            return !!(this.mask & (1 << e));
        }
    }
    const zo = "\\[\\]\\.:\\/",
        Oo = new RegExp("[" + zo + "]", "g"),
        Fo = "[^" + zo + "]",
        Wo = "[^" + zo.replace("\\.", "") + "]",
        Ho = new RegExp(
            "^" +
            /((?:WC+[\/:])*)/.source.replace("WC", Fo) +
            /(WCOD+)?/.source.replace("WCOD", Wo) +
            /(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC", Fo) +
            /\.(WC+)(?:\[(.+)\])?/.source.replace("WC", Fo) +
            "$"
        ),
        Vo = ["material", "materials", "bones", "map"];
    class Go {
        constructor(e, t, n) {
            (this.path = t),
                (this.parsedPath = n || Go.parseTrackName(t)),
                (this.node = Go.findNode(e, this.parsedPath.nodeName)),
                (this.rootNode = e),
                (this.getValue = this._getValue_unbound),
                (this.setValue = this._setValue_unbound);
        }
        static create(e, t, n) {
            return e && e.isAnimationObjectGroup
                ? new Go.Composite(e, t, n)
                : new Go(e, t, n);
        }
        static sanitizeNodeName(e) {
            return e.replace(/\s/g, "_").replace(Oo, "");
        }
        static parseTrackName(e) {
            const t = Ho.exec(e);
            if (null === t)
                throw new Error("PropertyBinding: Cannot parse trackName: " + e);
            const n = {
                nodeName: t[2],
                objectName: t[3],
                objectIndex: t[4],
                propertyName: t[5],
                propertyIndex: t[6],
            },
                i = n.nodeName && n.nodeName.lastIndexOf(".");
            if (void 0 !== i && -1 !== i) {
                const e = n.nodeName.substring(i + 1);
                -1 !== Vo.indexOf(e) &&
                    ((n.nodeName = n.nodeName.substring(0, i)), (n.objectName = e));
            }
            if (null === n.propertyName || 0 === n.propertyName.length)
                throw new Error(
                    "PropertyBinding: can not parse propertyName from trackName: " + e
                );
            return n;
        }
        static findNode(e, t) {
            if (
                void 0 === t ||
                "" === t ||
                "." === t ||
                -1 === t ||
                t === e.name ||
                t === e.uuid
            )
                return e;
            if (e.skeleton) {
                const n = e.skeleton.getBoneByName(t);
                if (void 0 !== n) return n;
            }
            if (e.children) {
                const n = function (e) {
                    for (let i = 0; i < e.length; i++) {
                        const r = e[i];
                        if (r.name === t || r.uuid === t) return r;
                        const a = n(r.children);
                        if (a) return a;
                    }
                    return null;
                },
                    i = n(e.children);
                if (i) return i;
            }
            return null;
        }
        _getValue_unavailable() { }
        _setValue_unavailable() { }
        _getValue_direct(e, t) {
            e[t] = this.targetObject[this.propertyName];
        }
        _getValue_array(e, t) {
            const n = this.resolvedProperty;
            for (let i = 0, r = n.length; i !== r; ++i) e[t++] = n[i];
        }
        _getValue_arrayElement(e, t) {
            e[t] = this.resolvedProperty[this.propertyIndex];
        }
        _getValue_toArray(e, t) {
            this.resolvedProperty.toArray(e, t);
        }
        _setValue_direct(e, t) {
            this.targetObject[this.propertyName] = e[t];
        }
        _setValue_direct_setNeedsUpdate(e, t) {
            (this.targetObject[this.propertyName] = e[t]),
                (this.targetObject.needsUpdate = !0);
        }
        _setValue_direct_setMatrixWorldNeedsUpdate(e, t) {
            (this.targetObject[this.propertyName] = e[t]),
                (this.targetObject.matrixWorldNeedsUpdate = !0);
        }
        _setValue_array(e, t) {
            const n = this.resolvedProperty;
            for (let i = 0, r = n.length; i !== r; ++i) n[i] = e[t++];
        }
        _setValue_array_setNeedsUpdate(e, t) {
            const n = this.resolvedProperty;
            for (let i = 0, r = n.length; i !== r; ++i) n[i] = e[t++];
            this.targetObject.needsUpdate = !0;
        }
        _setValue_array_setMatrixWorldNeedsUpdate(e, t) {
            const n = this.resolvedProperty;
            for (let i = 0, r = n.length; i !== r; ++i) n[i] = e[t++];
            this.targetObject.matrixWorldNeedsUpdate = !0;
        }
        _setValue_arrayElement(e, t) {
            this.resolvedProperty[this.propertyIndex] = e[t];
        }
        _setValue_arrayElement_setNeedsUpdate(e, t) {
            (this.resolvedProperty[this.propertyIndex] = e[t]),
                (this.targetObject.needsUpdate = !0);
        }
        _setValue_arrayElement_setMatrixWorldNeedsUpdate(e, t) {
            (this.resolvedProperty[this.propertyIndex] = e[t]),
                (this.targetObject.matrixWorldNeedsUpdate = !0);
        }
        _setValue_fromArray(e, t) {
            this.resolvedProperty.fromArray(e, t);
        }
        _setValue_fromArray_setNeedsUpdate(e, t) {
            this.resolvedProperty.fromArray(e, t),
                (this.targetObject.needsUpdate = !0);
        }
        _setValue_fromArray_setMatrixWorldNeedsUpdate(e, t) {
            this.resolvedProperty.fromArray(e, t),
                (this.targetObject.matrixWorldNeedsUpdate = !0);
        }
        _getValue_unbound(e, t) {
            this.bind(), this.getValue(e, t);
        }
        _setValue_unbound(e, t) {
            this.bind(), this.setValue(e, t);
        }
        bind() {
            let e = this.node;
            const t = this.parsedPath,
                n = t.objectName,
                i = t.propertyName;
            let r = t.propertyIndex;
            if (
                (e ||
                    ((e = Go.findNode(this.rootNode, t.nodeName)), (this.node = e)),
                    (this.getValue = this._getValue_unavailable),
                    (this.setValue = this._setValue_unavailable),
                    !e)
            )
                return void console.warn(
                    "THREE.PropertyBinding: No target node found for track: " +
                    this.path +
                    "."
                );
            if (n) {
                let i = t.objectIndex;
                switch (n) {
                    case "materials":
                        if (!e.material)
                            return void console.error(
                                "THREE.PropertyBinding: Can not bind to material as node does not have a material.",
                                this
                            );
                        if (!e.material.materials)
                            return void console.error(
                                "THREE.PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.",
                                this
                            );
                        e = e.material.materials;
                        break;
                    case "bones":
                        if (!e.skeleton)
                            return void console.error(
                                "THREE.PropertyBinding: Can not bind to bones as node does not have a skeleton.",
                                this
                            );
                        e = e.skeleton.bones;
                        for (let t = 0; t < e.length; t++)
                            if (e[t].name === i) {
                                i = t;
                                break;
                            }
                        break;
                    case "map":
                        if ("map" in e) {
                            e = e.map;
                            break;
                        }
                        if (!e.material)
                            return void console.error(
                                "THREE.PropertyBinding: Can not bind to material as node does not have a material.",
                                this
                            );
                        if (!e.material.map)
                            return void console.error(
                                "THREE.PropertyBinding: Can not bind to material.map as node.material does not have a map.",
                                this
                            );
                        e = e.material.map;
                        break;
                    default:
                        if (void 0 === e[n])
                            return void console.error(
                                "THREE.PropertyBinding: Can not bind to objectName of node undefined.",
                                this
                            );
                        e = e[n];
                }
                if (void 0 !== i) {
                    if (void 0 === e[i])
                        return void console.error(
                            "THREE.PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.",
                            this,
                            e
                        );
                    e = e[i];
                }
            }
            const a = e[i];
            if (void 0 === a) {
                const n = t.nodeName;
                return void console.error(
                    "THREE.PropertyBinding: Trying to update property for track: " +
                    n +
                    "." +
                    i +
                    " but it wasn't found.",
                    e
                );
            }
            let s = this.Versioning.None;
            (this.targetObject = e),
                !0 === e.isMaterial
                    ? (s = this.Versioning.NeedsUpdate)
                    : !0 === e.isObject3D &&
                    (s = this.Versioning.MatrixWorldNeedsUpdate);
            let o = this.BindingType.Direct;
            if (void 0 !== r) {
                if ("morphTargetInfluences" === i) {
                    if (!e.geometry)
                        return void console.error(
                            "THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.",
                            this
                        );
                    if (!e.geometry.morphAttributes)
                        return void console.error(
                            "THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.",
                            this
                        );
                    void 0 !== e.morphTargetDictionary[r] &&
                        (r = e.morphTargetDictionary[r]);
                }
                (o = this.BindingType.ArrayElement),
                    (this.resolvedProperty = a),
                    (this.propertyIndex = r);
            } else
                void 0 !== a.fromArray && void 0 !== a.toArray
                    ? ((o = this.BindingType.HasFromToArray),
                        (this.resolvedProperty = a))
                    : Array.isArray(a)
                        ? ((o = this.BindingType.EntireArray),
                            (this.resolvedProperty = a))
                        : (this.propertyName = i);
            (this.getValue = this.GetterByBindingType[o]),
                (this.setValue = this.SetterByBindingTypeAndVersioning[o][s]);
        }
        unbind() {
            (this.node = null),
                (this.getValue = this._getValue_unbound),
                (this.setValue = this._setValue_unbound);
        }
    }
    function hc(e, t) {
        void 0 !== t.extras &&
            ("object" == typeof t.extras
                ? Object.assign(e.userData, t.extras)
                : console.warn(
                    "THREE.GLTFLoader: Ignoring primitive type .extras, " + t.extras
                ));
    }
    class Os extends ji {
        constructor(e) {
            super(),
                (this.isMeshStandardMaterial = !0),
                (this.type = "MeshStandardMaterial"),
                (this.defines = { STANDARD: "" }),
                (this.color = new Hi(16777215)),
                (this.roughness = 1),
                (this.metalness = 0),
                (this.map = null),
                (this.lightMap = null),
                (this.lightMapIntensity = 1),
                (this.aoMap = null),
                (this.aoMapIntensity = 1),
                (this.emissive = new Hi(0)),
                (this.emissiveIntensity = 1),
                (this.emissiveMap = null),
                (this.bumpMap = null),
                (this.bumpScale = 1),
                (this.normalMap = null),
                (this.normalMapType = 0),
                (this.normalScale = new Qt(1, 1)),
                (this.displacementMap = null),
                (this.displacementScale = 1),
                (this.displacementBias = 0),
                (this.roughnessMap = null),
                (this.metalnessMap = null),
                (this.alphaMap = null),
                (this.envMap = null),
                (this.envMapRotation = new si()),
                (this.envMapIntensity = 1),
                (this.wireframe = !1),
                (this.wireframeLinewidth = 1),
                (this.wireframeLinecap = "round"),
                (this.wireframeLinejoin = "round"),
                (this.flatShading = !1),
                (this.fog = !0),
                this.setValues(e);
        }
        copy(e) {
            return (
                super.copy(e),
                (this.defines = { STANDARD: "" }),
                this.color.copy(e.color),
                (this.roughness = e.roughness),
                (this.metalness = e.metalness),
                (this.map = e.map),
                (this.lightMap = e.lightMap),
                (this.lightMapIntensity = e.lightMapIntensity),
                (this.aoMap = e.aoMap),
                (this.aoMapIntensity = e.aoMapIntensity),
                this.emissive.copy(e.emissive),
                (this.emissiveMap = e.emissiveMap),
                (this.emissiveIntensity = e.emissiveIntensity),
                (this.bumpMap = e.bumpMap),
                (this.bumpScale = e.bumpScale),
                (this.normalMap = e.normalMap),
                (this.normalMapType = e.normalMapType),
                this.normalScale.copy(e.normalScale),
                (this.displacementMap = e.displacementMap),
                (this.displacementScale = e.displacementScale),
                (this.displacementBias = e.displacementBias),
                (this.roughnessMap = e.roughnessMap),
                (this.metalnessMap = e.metalnessMap),
                (this.alphaMap = e.alphaMap),
                (this.envMap = e.envMap),
                this.envMapRotation.copy(e.envMapRotation),
                (this.envMapIntensity = e.envMapIntensity),
                (this.wireframe = e.wireframe),
                (this.wireframeLinewidth = e.wireframeLinewidth),
                (this.wireframeLinecap = e.wireframeLinecap),
                (this.wireframeLinejoin = e.wireframeLinejoin),
                (this.flatShading = e.flatShading),
                (this.fog = e.fog),
                this
            );
        }
    }
    const Jl = {
        FLOAT: 5126,
        FLOAT_MAT3: 35675,
        FLOAT_MAT4: 35676,
        FLOAT_VEC2: 35664,
        FLOAT_VEC3: 35665,
        FLOAT_VEC4: 35666,
        LINEAR: 9729,
        REPEAT: 10497,
        SAMPLER_2D: 35678,
        POINTS: 0,
        LINES: 1,
        LINE_LOOP: 2,
        LINE_STRIP: 3,
        TRIANGLES: 4,
        TRIANGLE_STRIP: 5,
        TRIANGLE_FAN: 6,
        UNSIGNED_BYTE: 5121,
        UNSIGNED_SHORT: 5123,
    },
        $l = {
            5120: Int8Array,
            5121: Uint8Array,
            5122: Int16Array,
            5123: Uint16Array,
            5125: Uint32Array,
            5126: Float32Array,
        },
        ec = { 9728: le, 9729: de, 9984: ce, 9985: ue, 9986: he, 9987: pe },
        tc = { 33071: se, 33648: oe, 10497: ae },
        nc = {
            SCALAR: 1,
            VEC2: 2,
            VEC3: 3,
            VEC4: 4,
            MAT2: 4,
            MAT3: 9,
            MAT4: 16,
        },
        ic = {
            POSITION: "position",
            NORMAL: "normal",
            TANGENT: "tangent",
            TEXCOORD_0: "uv",
            TEXCOORD_1: "uv1",
            TEXCOORD_2: "uv2",
            TEXCOORD_3: "uv3",
            COLOR_0: "color",
            WEIGHTS_0: "skinWeight",
            JOINTS_0: "skinIndex",
        },
        rc = {
            scale: "scale",
            translation: "position",
            rotation: "quaternion",
            weights: "morphTargetInfluences",
        },
        ac = { CUBICSPLINE: void 0, LINEAR: dt, STEP: ht },
        sc = "OPAQUE",
        oc = "MASK",
        lc = "BLEND";
    function cc(e, t, n) {
        for (const i in n.extensions)
            void 0 === e[i] &&
                ((t.userData.gltfExtensions = t.userData.gltfExtensions || {}),
                    (t.userData.gltfExtensions[i] = n.extensions[i]));
    }
    function uc(e) {
        let t;
        const n = e.extensions && e.extensions[kl.KHR_DRACO_MESH_COMPRESSION];
        if (
            ((t = n
                ? "draco:" + n.bufferView + ":" + n.indices + ":" + pc(n.attributes)
                : e.indices + ":" + pc(e.attributes) + ":" + e.mode),
                void 0 !== e.targets)
        )
            for (let n = 0, i = e.targets.length; n < i; n++)
                t += ":" + pc(e.targets[n]);
        return t;
    }
    function pc(e) {
        let t = "";
        const n = Object.keys(e).sort();
        for (let i = 0, r = n.length; i < r; i++)
            t += n[i] + ":" + e[n[i]] + ";";
        return t;
    }
    const GB = new WeakMap();
    class mo extends Error {
        constructor(e, t) {
            super(e), (this.response = t);
        }
    }




    const Ki = new bn(),
        qi = new Qt();
    let Yi = 0;
    class Xi {
        constructor(e, t, n = !1) {
            if (Array.isArray(e))
                throw new TypeError(
                    "THREE.BufferAttribute: array should be a Typed Array."
                );
            (this.isBufferAttribute = !0),
                Object.defineProperty(this, "id", { value: Yi++ }),
                (this.name = ""),
                (this.array = e),
                (this.itemSize = t),
                (this.count = void 0 !== e ? e.length / t : 0),
                (this.normalized = n),
                (this.usage = Pt),
                (this.updateRanges = []),
                (this.gpuType = be),
                (this.version = 0);
        }
        onUploadCallback() { }
        set needsUpdate(e) {
            !0 === e && this.version++;
        }
        setUsage(e) {
            return (this.usage = e), this;
        }
        addUpdateRange(e, t) {
            this.updateRanges.push({ start: e, count: t });
        }
        clearUpdateRanges() {
            this.updateRanges.length = 0;
        }
        copy(e) {
            return (
                (this.name = e.name),
                (this.array = new e.array.constructor(e.array)),
                (this.itemSize = e.itemSize),
                (this.count = e.count),
                (this.normalized = e.normalized),
                (this.usage = e.usage),
                (this.gpuType = e.gpuType),
                this
            );
        }
        copyAt(e, t, n) {
            (e *= this.itemSize), (n *= t.itemSize);
            for (let i = 0, r = this.itemSize; i < r; i++)
                this.array[e + i] = t.array[n + i];
            return this;
        }
        copyArray(e) {
            return this.array.set(e), this;
        }
        applyMatrix3(e) {
            if (2 === this.itemSize)
                for (let t = 0, n = this.count; t < n; t++)
                    qi.fromBufferAttribute(this, t),
                        qi.applyMatrix3(e),
                        this.setXY(t, qi.x, qi.y);
            else if (3 === this.itemSize)
                for (let t = 0, n = this.count; t < n; t++)
                    Ki.fromBufferAttribute(this, t),
                        Ki.applyMatrix3(e),
                        this.setXYZ(t, Ki.x, Ki.y, Ki.z);
            return this;
        }
        applyMatrix4(e) {
            for (let t = 0, n = this.count; t < n; t++)
                Ki.fromBufferAttribute(this, t),
                    Ki.applyMatrix4(e),
                    this.setXYZ(t, Ki.x, Ki.y, Ki.z);
            return this;
        }
        applyNormalMatrix(e) {
            for (let t = 0, n = this.count; t < n; t++)
                Ki.fromBufferAttribute(this, t),
                    Ki.applyNormalMatrix(e),
                    this.setXYZ(t, Ki.x, Ki.y, Ki.z);
            return this;
        }
        transformDirection(e) {
            for (let t = 0, n = this.count; t < n; t++)
                Ki.fromBufferAttribute(this, t),
                    Ki.transformDirection(e),
                    this.setXYZ(t, Ki.x, Ki.y, Ki.z);
            return this;
        }
        set(e, t = 0) {
            return this.array.set(e, t), this;
        }
        getComponent(e, t) {
            let n = this.array[e * this.itemSize + t];
            return this.normalized && (n = Vt(n, this.array)), n;
        }
        setComponent(e, t, n) {
            return (
                this.normalized && (n = Gt(n, this.array)),
                (this.array[e * this.itemSize + t] = n),
                this
            );
        }
        getX(e) {
            let t = this.array[e * this.itemSize];
            return this.normalized && (t = Vt(t, this.array)), t;
        }
        setX(e, t) {
            return (
                this.normalized && (t = Gt(t, this.array)),
                (this.array[e * this.itemSize] = t),
                this
            );
        }
        getY(e) {
            let t = this.array[e * this.itemSize + 1];
            return this.normalized && (t = Vt(t, this.array)), t;
        }
        setY(e, t) {
            return (
                this.normalized && (t = Gt(t, this.array)),
                (this.array[e * this.itemSize + 1] = t),
                this
            );
        }
        getZ(e) {
            let t = this.array[e * this.itemSize + 2];
            return this.normalized && (t = Vt(t, this.array)), t;
        }
        setZ(e, t) {
            return (
                this.normalized && (t = Gt(t, this.array)),
                (this.array[e * this.itemSize + 2] = t),
                this
            );
        }
        getW(e) {
            let t = this.array[e * this.itemSize + 3];
            return this.normalized && (t = Vt(t, this.array)), t;
        }
        setW(e, t) {
            return (
                this.normalized && (t = Gt(t, this.array)),
                (this.array[e * this.itemSize + 3] = t),
                this
            );
        }
        setXY(e, t, n) {
            return (
                (e *= this.itemSize),
                this.normalized &&
                ((t = Gt(t, this.array)), (n = Gt(n, this.array))),
                (this.array[e + 0] = t),
                (this.array[e + 1] = n),
                this
            );
        }
        setXYZ(e, t, n, i) {
            return (
                (e *= this.itemSize),
                this.normalized &&
                ((t = Gt(t, this.array)),
                    (n = Gt(n, this.array)),
                    (i = Gt(i, this.array))),
                (this.array[e + 0] = t),
                (this.array[e + 1] = n),
                (this.array[e + 2] = i),
                this
            );
        }
        setXYZW(e, t, n, i, r) {
            return (
                (e *= this.itemSize),
                this.normalized &&
                ((t = Gt(t, this.array)),
                    (n = Gt(n, this.array)),
                    (i = Gt(i, this.array)),
                    (r = Gt(r, this.array))),
                (this.array[e + 0] = t),
                (this.array[e + 1] = n),
                (this.array[e + 2] = i),
                (this.array[e + 3] = r),
                this
            );
        }
        onUpload(e) {
            return (this.onUploadCallback = e), this;
        }
        clone() {
            return new this.constructor(this.array, this.itemSize).copy(this);
        }
        toJSON() {
            const e = {
                itemSize: this.itemSize,
                type: this.array.constructor.name,
                array: Array.from(this.array),
                normalized: this.normalized,
            };
            return (
                "" !== this.name && (e.name = this.name),
                this.usage !== Pt && (e.usage = this.usage),
                e
            );
        }
    }
    class Zi extends Xi {
        constructor(e, t, n) {
            super(new Uint16Array(e), t, n);
        }
    }
    class Ji extends Xi {
        constructor(e, t, n) {
            super(new Uint32Array(e), t, n);
        }
    }
    class $i extends Xi {
        constructor(e, t, n) {
            super(new Float32Array(e), t, n);
        }
    }

    class kn {
        constructor(
            e = new bn(1 / 0, 1 / 0, 1 / 0),
            t = new bn(-1 / 0, -1 / 0, -1 / 0)
        ) {
            (this.isBox3 = !0), (this.min = e), (this.max = t);
        }
        set(e, t) {
            return this.min.copy(e), this.max.copy(t), this;
        }
        setFromArray(e) {
            this.makeEmpty();
            for (let t = 0, n = e.length; t < n; t += 3)
                this.expandByPoint(Sn.fromArray(e, t));
            return this;
        }
        setFromBufferAttribute(e) {
            this.makeEmpty();
            for (let t = 0, n = e.count; t < n; t++)
                this.expandByPoint(Sn.fromBufferAttribute(e, t));
            return this;
        }
        setFromPoints(e) {
            this.makeEmpty();
            for (let t = 0, n = e.length; t < n; t++) this.expandByPoint(e[t]);
            return this;
        }
        setFromCenterAndSize(e, t) {
            const n = Sn.copy(t).multiplyScalar(0.5);
            return this.min.copy(e).sub(n), this.max.copy(e).add(n), this;
        }
        setFromObject(e, t = !1) {
            return this.makeEmpty(), this.expandByObject(e, t);
        }
        clone() {
            return new this.constructor().copy(this);
        }
        copy(e) {
            return this.min.copy(e.min), this.max.copy(e.max), this;
        }
        makeEmpty() {
            return (
                (this.min.x = this.min.y = this.min.z = 1 / 0),
                (this.max.x = this.max.y = this.max.z = -1 / 0),
                this
            );
        }
        isEmpty() {
            return (
                this.max.x < this.min.x ||
                this.max.y < this.min.y ||
                this.max.z < this.min.z
            );
        }
        getCenter(e) {
            return this.isEmpty()
                ? e.set(0, 0, 0)
                : e.addVectors(this.min, this.max).multiplyScalar(0.5);
        }
        getSize(e) {
            return this.isEmpty()
                ? e.set(0, 0, 0)
                : e.subVectors(this.max, this.min);
        }
        expandByPoint(e) {
            return this.min.min(e), this.max.max(e), this;
        }
        expandByVector(e) {
            return this.min.sub(e), this.max.add(e), this;
        }
        expandByScalar(e) {
            return this.min.addScalar(-e), this.max.addScalar(e), this;
        }
        expandByObject(e, t = !1) {
            e.updateWorldMatrix(!1, !1);
            const n = e.geometry;
            if (void 0 !== n) {
                const i = n.getAttribute("position");
                if (!0 === t && void 0 !== i && !0 !== e.isInstancedMesh)
                    for (let t = 0, n = i.count; t < n; t++)
                        !0 === e.isMesh
                            ? e.getVertexPosition(t, Sn)
                            : Sn.fromBufferAttribute(i, t),
                            Sn.applyMatrix4(e.matrixWorld),
                            this.expandByPoint(Sn);
                else
                    void 0 !== e.boundingBox
                        ? (null === e.boundingBox && e.computeBoundingBox(),
                            Mn.copy(e.boundingBox))
                        : (null === n.boundingBox && n.computeBoundingBox(),
                            Mn.copy(n.boundingBox)),
                        Mn.applyMatrix4(e.matrixWorld),
                        this.union(Mn);
            }
            const i = e.children;
            for (let e = 0, n = i.length; e < n; e++)
                this.expandByObject(i[e], t);
            return this;
        }
        containsPoint(e) {
            return (
                e.x >= this.min.x &&
                e.x <= this.max.x &&
                e.y >= this.min.y &&
                e.y <= this.max.y &&
                e.z >= this.min.z &&
                e.z <= this.max.z
            );
        }
        containsBox(e) {
            return (
                this.min.x <= e.min.x &&
                e.max.x <= this.max.x &&
                this.min.y <= e.min.y &&
                e.max.y <= this.max.y &&
                this.min.z <= e.min.z &&
                e.max.z <= this.max.z
            );
        }
        getParameter(e, t) {
            return t.set(
                (e.x - this.min.x) / (this.max.x - this.min.x),
                (e.y - this.min.y) / (this.max.y - this.min.y),
                (e.z - this.min.z) / (this.max.z - this.min.z)
            );
        }
        intersectsBox(e) {
            return (
                e.max.x >= this.min.x &&
                e.min.x <= this.max.x &&
                e.max.y >= this.min.y &&
                e.min.y <= this.max.y &&
                e.max.z >= this.min.z &&
                e.min.z <= this.max.z
            );
        }
        intersectsSphere(e) {
            return (
                this.clampPoint(e.center, Sn),
                Sn.distanceToSquared(e.center) <= e.radius * e.radius
            );
        }
        intersectsPlane(e) {
            let t, n;
            return (
                e.normal.x > 0
                    ? ((t = e.normal.x * this.min.x), (n = e.normal.x * this.max.x))
                    : ((t = e.normal.x * this.max.x), (n = e.normal.x * this.min.x)),
                e.normal.y > 0
                    ? ((t += e.normal.y * this.min.y), (n += e.normal.y * this.max.y))
                    : ((t += e.normal.y * this.max.y),
                        (n += e.normal.y * this.min.y)),
                e.normal.z > 0
                    ? ((t += e.normal.z * this.min.z), (n += e.normal.z * this.max.z))
                    : ((t += e.normal.z * this.max.z),
                        (n += e.normal.z * this.min.z)),
                t <= -e.constant && n >= -e.constant
            );
        }
        intersectsTriangle(e) {
            if (this.isEmpty()) return !1;
            this.getCenter(Ln),
                Dn.subVectors(this.max, Ln),
                _n.subVectors(e.a, Ln),
                Tn.subVectors(e.b, Ln),
                Cn.subVectors(e.c, Ln),
                Pn.subVectors(Tn, _n),
                In.subVectors(Cn, Tn),
                Rn.subVectors(_n, Cn);
            let t = [
                0,
                -Pn.z,
                Pn.y,
                0,
                -In.z,
                In.y,
                0,
                -Rn.z,
                Rn.y,
                Pn.z,
                0,
                -Pn.x,
                In.z,
                0,
                -In.x,
                Rn.z,
                0,
                -Rn.x,
                -Pn.y,
                Pn.x,
                0,
                -In.y,
                In.x,
                0,
                -Rn.y,
                Rn.x,
                0,
            ];
            return (
                !!Un(t, _n, Tn, Cn, Dn) &&
                ((t = [1, 0, 0, 0, 1, 0, 0, 0, 1]),
                    !!Un(t, _n, Tn, Cn, Dn) &&
                    (Nn.crossVectors(Pn, In),
                        (t = [Nn.x, Nn.y, Nn.z]),
                        Un(t, _n, Tn, Cn, Dn)))
            );
        }
        clampPoint(e, t) {
            return t.copy(e).clamp(this.min, this.max);
        }
        distanceToPoint(e) {
            return this.clampPoint(e, Sn).distanceTo(e);
        }
        getBoundingSphere(e) {
            return (
                this.isEmpty()
                    ? e.makeEmpty()
                    : (this.getCenter(e.center),
                        (e.radius = 0.5 * this.getSize(Sn).length())),
                e
            );
        }
        intersect(e) {
            return (
                this.min.max(e.min),
                this.max.min(e.max),
                this.isEmpty() && this.makeEmpty(),
                this
            );
        }
        union(e) {
            return this.min.min(e.min), this.max.max(e.max), this;
        }
        applyMatrix4(e) {
            return (
                this.isEmpty() ||
                (En[0].set(this.min.x, this.min.y, this.min.z).applyMatrix4(e),
                    En[1].set(this.min.x, this.min.y, this.max.z).applyMatrix4(e),
                    En[2].set(this.min.x, this.max.y, this.min.z).applyMatrix4(e),
                    En[3].set(this.min.x, this.max.y, this.max.z).applyMatrix4(e),
                    En[4].set(this.max.x, this.min.y, this.min.z).applyMatrix4(e),
                    En[5].set(this.max.x, this.min.y, this.max.z).applyMatrix4(e),
                    En[6].set(this.max.x, this.max.y, this.min.z).applyMatrix4(e),
                    En[7].set(this.max.x, this.max.y, this.max.z).applyMatrix4(e),
                    this.setFromPoints(En)),
                this
            );
        }
        translate(e) {
            return this.min.add(e), this.max.add(e), this;
        }
        equals(e) {
            return e.min.equals(this.min) && e.max.equals(this.max);
        }
    }
    let er = 0;
    const tr = new Xn(),
        nr = new ki(),
        ir = new bn(),
        rr = new kn(),
        ar = new kn(),
        sr = new bn();
    class or extends Dt {
        constructor() {
            super(),
                (this.isBufferGeometry = !0),
                Object.defineProperty(this, "id", { value: er++ }),
                (this.uuid = Ot()),
                (this.name = ""),
                (this.type = "BufferGeometry"),
                (this.index = null),
                (this.indirect = null),
                (this.attributes = {}),
                (this.morphAttributes = {}),
                (this.morphTargetsRelative = !1),
                (this.groups = []),
                (this.boundingBox = null),
                (this.boundingSphere = null),
                (this.drawRange = { start: 0, count: 1 / 0 }),
                (this.userData = {});
        }
        getIndex() {
            return this.index;
        }
        setIndex(e) {
            return (
                Array.isArray(e)
                    ? (this.index = new (Yt(e) ? Ji : Zi)(e, 1))
                    : (this.index = e),
                this
            );
        }
        setIndirect(e) {
            return (this.indirect = e), this;
        }
        getIndirect() {
            return this.indirect;
        }
        getAttribute(e) {
            return this.attributes[e];
        }
        setAttribute(e, t) {
            return (this.attributes[e] = t), this;
        }
        deleteAttribute(e) {
            return delete this.attributes[e], this;
        }
        hasAttribute(e) {
            return void 0 !== this.attributes[e];
        }
        addGroup(e, t, n = 0) {
            this.groups.push({ start: e, count: t, materialIndex: n });
        }
        clearGroups() {
            this.groups = [];
        }
        setDrawRange(e, t) {
            (this.drawRange.start = e), (this.drawRange.count = t);
        }
        applyMatrix4(e) {
            const t = this.attributes.position;
            void 0 !== t && (t.applyMatrix4(e), (t.needsUpdate = !0));
            const n = this.attributes.normal;
            if (void 0 !== n) {
                const t = new Kt().getNormalMatrix(e);
                n.applyNormalMatrix(t), (n.needsUpdate = !0);
            }
            const i = this.attributes.tangent;
            return (
                void 0 !== i && (i.transformDirection(e), (i.needsUpdate = !0)),
                null !== this.boundingBox && this.computeBoundingBox(),
                null !== this.boundingSphere && this.computeBoundingSphere(),
                this
            );
        }
        applyQuaternion(e) {
            return tr.makeRotationFromQuaternion(e), this.applyMatrix4(tr), this;
        }
        rotateX(e) {
            return tr.makeRotationX(e), this.applyMatrix4(tr), this;
        }
        rotateY(e) {
            return tr.makeRotationY(e), this.applyMatrix4(tr), this;
        }
        rotateZ(e) {
            return tr.makeRotationZ(e), this.applyMatrix4(tr), this;
        }
        translate(e, t, n) {
            return tr.makeTranslation(e, t, n), this.applyMatrix4(tr), this;
        }
        scale(e, t, n) {
            return tr.makeScale(e, t, n), this.applyMatrix4(tr), this;
        }
        lookAt(e) {
            return (
                nr.lookAt(e), nr.updateMatrix(), this.applyMatrix4(nr.matrix), this
            );
        }
        center() {
            return (
                this.computeBoundingBox(),
                this.boundingBox.getCenter(ir).negate(),
                this.translate(ir.x, ir.y, ir.z),
                this
            );
        }
        setFromPoints(e) {
            const t = this.getAttribute("position");
            if (void 0 === t) {
                const t = [];
                for (let n = 0, i = e.length; n < i; n++) {
                    const i = e[n];
                    t.push(i.x, i.y, i.z || 0);
                }
                this.setAttribute("position", new $i(t, 3));
            } else {
                const n = Math.min(e.length, t.count);
                for (let i = 0; i < n; i++) {
                    const n = e[i];
                    t.setXYZ(i, n.x, n.y, n.z || 0);
                }
                e.length > t.count &&
                    console.warn(
                        "THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."
                    ),
                    (t.needsUpdate = !0);
            }
            return this;
        }
        computeBoundingBox() {
            null === this.boundingBox && (this.boundingBox = new kn());
            const e = this.attributes.position,
                t = this.morphAttributes.position;
            if (e && e.isGLBufferAttribute)
                return (
                    console.error(
                        "THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",
                        this
                    ),
                    void this.boundingBox.set(
                        new bn(-1 / 0, -1 / 0, -1 / 0),
                        new bn(1 / 0, 1 / 0, 1 / 0)
                    )
                );
            if (void 0 !== e) {
                if ((this.boundingBox.setFromBufferAttribute(e), t))
                    for (let e = 0, n = t.length; e < n; e++) {
                        const n = t[e];
                        rr.setFromBufferAttribute(n),
                            this.morphTargetsRelative
                                ? (sr.addVectors(this.boundingBox.min, rr.min),
                                    this.boundingBox.expandByPoint(sr),
                                    sr.addVectors(this.boundingBox.max, rr.max),
                                    this.boundingBox.expandByPoint(sr))
                                : (this.boundingBox.expandByPoint(rr.min),
                                    this.boundingBox.expandByPoint(rr.max));
                    }
            } else this.boundingBox.makeEmpty();
            (isNaN(this.boundingBox.min.x) ||
                isNaN(this.boundingBox.min.y) ||
                isNaN(this.boundingBox.min.z)) &&
                console.error(
                    'THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',
                    this
                );
        }
        computeBoundingSphere() {
            null === this.boundingSphere && (this.boundingSphere = new Wn());
            const e = this.attributes.position,
                t = this.morphAttributes.position;
            if (e && e.isGLBufferAttribute)
                return (
                    console.error(
                        "THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",
                        this
                    ),
                    void this.boundingSphere.set(new bn(), 1 / 0)
                );
            if (e) {
                const n = this.boundingSphere.center;
                if ((rr.setFromBufferAttribute(e), t))
                    for (let e = 0, n = t.length; e < n; e++) {
                        const n = t[e];
                        ar.setFromBufferAttribute(n),
                            this.morphTargetsRelative
                                ? (sr.addVectors(rr.min, ar.min),
                                    rr.expandByPoint(sr),
                                    sr.addVectors(rr.max, ar.max),
                                    rr.expandByPoint(sr))
                                : (rr.expandByPoint(ar.min), rr.expandByPoint(ar.max));
                    }
                rr.getCenter(n);
                let i = 0;
                for (let t = 0, r = e.count; t < r; t++)
                    sr.fromBufferAttribute(e, t),
                        (i = Math.max(i, n.distanceToSquared(sr)));
                if (t)
                    for (let r = 0, a = t.length; r < a; r++) {
                        const a = t[r],
                            s = this.morphTargetsRelative;
                        for (let t = 0, r = a.count; t < r; t++)
                            sr.fromBufferAttribute(a, t),
                                s && (ir.fromBufferAttribute(e, t), sr.add(ir)),
                                (i = Math.max(i, n.distanceToSquared(sr)));
                    }
                (this.boundingSphere.radius = Math.sqrt(i)),
                    isNaN(this.boundingSphere.radius) &&
                    console.error(
                        'THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',
                        this
                    );
            }
        }
        computeTangents() {
            const e = this.index,
                t = this.attributes;
            if (
                null === e ||
                void 0 === t.position ||
                void 0 === t.normal ||
                void 0 === t.uv
            )
                return void console.error(
                    "THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)"
                );
            const n = t.position,
                i = t.normal,
                r = t.uv;
            !1 === this.hasAttribute("tangent") &&
                this.setAttribute(
                    "tangent",
                    new Xi(new Float32Array(4 * n.count), 4)
                );
            const a = this.getAttribute("tangent"),
                s = [],
                o = [];
            for (let e = 0; e < n.count; e++)
                (s[e] = new bn()), (o[e] = new bn());
            const l = new bn(),
                c = new bn(),
                h = new bn(),
                d = new Qt(),
                u = new Qt(),
                p = new Qt(),
                f = new bn(),
                m = new bn();
            function g(e, t, i) {
                l.fromBufferAttribute(n, e),
                    c.fromBufferAttribute(n, t),
                    h.fromBufferAttribute(n, i),
                    d.fromBufferAttribute(r, e),
                    u.fromBufferAttribute(r, t),
                    p.fromBufferAttribute(r, i),
                    c.sub(l),
                    h.sub(l),
                    u.sub(d),
                    p.sub(d);
                const a = 1 / (u.x * p.y - p.x * u.y);
                isFinite(a) &&
                    (f
                        .copy(c)
                        .multiplyScalar(p.y)
                        .addScaledVector(h, -u.y)
                        .multiplyScalar(a),
                        m
                            .copy(h)
                            .multiplyScalar(u.x)
                            .addScaledVector(c, -p.x)
                            .multiplyScalar(a),
                        s[e].add(f),
                        s[t].add(f),
                        s[i].add(f),
                        o[e].add(m),
                        o[t].add(m),
                        o[i].add(m));
            }
            let v = this.groups;
            0 === v.length && (v = [{ start: 0, count: e.count }]);
            for (let t = 0, n = v.length; t < n; ++t) {
                const n = v[t],
                    i = n.start;
                for (let t = i, r = i + n.count; t < r; t += 3)
                    g(e.getX(t + 0), e.getX(t + 1), e.getX(t + 2));
            }
            const w = new bn(),
                y = new bn(),
                b = new bn(),
                A = new bn();
            function x(e) {
                b.fromBufferAttribute(i, e), A.copy(b);
                const t = s[e];
                w.copy(t),
                    w.sub(b.multiplyScalar(b.dot(t))).normalize(),
                    y.crossVectors(A, t);
                const n = y.dot(o[e]) < 0 ? -1 : 1;
                a.setXYZW(e, w.x, w.y, w.z, n);
            }
            for (let t = 0, n = v.length; t < n; ++t) {
                const n = v[t],
                    i = n.start;
                for (let t = i, r = i + n.count; t < r; t += 3)
                    x(e.getX(t + 0)), x(e.getX(t + 1)), x(e.getX(t + 2));
            }
        }
        computeVertexNormals() {
            const e = this.index,
                t = this.getAttribute("position");
            if (void 0 !== t) {
                let n = this.getAttribute("normal");
                if (void 0 === n)
                    (n = new Xi(new Float32Array(3 * t.count), 3)),
                        this.setAttribute("normal", n);
                else for (let e = 0, t = n.count; e < t; e++) n.setXYZ(e, 0, 0, 0);
                const i = new bn(),
                    r = new bn(),
                    a = new bn(),
                    s = new bn(),
                    o = new bn(),
                    l = new bn(),
                    c = new bn(),
                    h = new bn();
                if (e)
                    for (let d = 0, u = e.count; d < u; d += 3) {
                        const u = e.getX(d + 0),
                            p = e.getX(d + 1),
                            f = e.getX(d + 2);
                        i.fromBufferAttribute(t, u),
                            r.fromBufferAttribute(t, p),
                            a.fromBufferAttribute(t, f),
                            c.subVectors(a, r),
                            h.subVectors(i, r),
                            c.cross(h),
                            s.fromBufferAttribute(n, u),
                            o.fromBufferAttribute(n, p),
                            l.fromBufferAttribute(n, f),
                            s.add(c),
                            o.add(c),
                            l.add(c),
                            n.setXYZ(u, s.x, s.y, s.z),
                            n.setXYZ(p, o.x, o.y, o.z),
                            n.setXYZ(f, l.x, l.y, l.z);
                    }
                else
                    for (let e = 0, s = t.count; e < s; e += 3)
                        i.fromBufferAttribute(t, e + 0),
                            r.fromBufferAttribute(t, e + 1),
                            a.fromBufferAttribute(t, e + 2),
                            c.subVectors(a, r),
                            h.subVectors(i, r),
                            c.cross(h),
                            n.setXYZ(e + 0, c.x, c.y, c.z),
                            n.setXYZ(e + 1, c.x, c.y, c.z),
                            n.setXYZ(e + 2, c.x, c.y, c.z);
                this.normalizeNormals(), (n.needsUpdate = !0);
            }
        }
        normalizeNormals() {
            const e = this.attributes.normal;
            for (let t = 0, n = e.count; t < n; t++)
                sr.fromBufferAttribute(e, t),
                    sr.normalize(),
                    e.setXYZ(t, sr.x, sr.y, sr.z);
        }
        toNonIndexed() {
            function e(e, t) {
                const n = e.array,
                    i = e.itemSize,
                    r = e.normalized,
                    a = new n.constructor(t.length * i);
                let s = 0,
                    o = 0;
                for (let r = 0, l = t.length; r < l; r++) {
                    s = e.isInterleavedBufferAttribute
                        ? t[r] * e.data.stride + e.offset
                        : t[r] * i;
                    for (let e = 0; e < i; e++) a[o++] = n[s++];
                }
                return new Xi(a, i, r);
            }
            if (null === this.index)
                return (
                    console.warn(
                        "THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."
                    ),
                    this
                );
            const t = new or(),
                n = this.index.array,
                i = this.attributes;
            for (const r in i) {
                const a = e(i[r], n);
                t.setAttribute(r, a);
            }
            const r = this.morphAttributes;
            for (const i in r) {
                const a = [],
                    s = r[i];
                for (let t = 0, i = s.length; t < i; t++) {
                    const i = e(s[t], n);
                    a.push(i);
                }
                t.morphAttributes[i] = a;
            }
            t.morphTargetsRelative = this.morphTargetsRelative;
            const a = this.groups;
            for (let e = 0, n = a.length; e < n; e++) {
                const n = a[e];
                t.addGroup(n.start, n.count, n.materialIndex);
            }
            return t;
        }
        toJSON() {
            const e = {
                metadata: {
                    version: 4.6,
                    type: "BufferGeometry",
                    generator: "BufferGeometry.toJSON",
                },
            };
            if (
                ((e.uuid = this.uuid),
                    (e.type = this.type),
                    "" !== this.name && (e.name = this.name),
                    Object.keys(this.userData).length > 0 &&
                    (e.userData = this.userData),
                    void 0 !== this.parameters)
            ) {
                const t = this.parameters;
                for (const n in t) void 0 !== t[n] && (e[n] = t[n]);
                return e;
            }
            e.data = { attributes: {} };
            const t = this.index;
            null !== t &&
                (e.data.index = {
                    type: t.array.constructor.name,
                    array: Array.prototype.slice.call(t.array),
                });
            const n = this.attributes;
            for (const t in n) {
                const i = n[t];
                e.data.attributes[t] = i.toJSON(e.data);
            }
            const i = {};
            let r = !1;
            for (const t in this.morphAttributes) {
                const n = this.morphAttributes[t],
                    a = [];
                for (let t = 0, i = n.length; t < i; t++) {
                    const i = n[t];
                    a.push(i.toJSON(e.data));
                }
                a.length > 0 && ((i[t] = a), (r = !0));
            }
            r &&
                ((e.data.morphAttributes = i),
                    (e.data.morphTargetsRelative = this.morphTargetsRelative));
            const a = this.groups;
            a.length > 0 && (e.data.groups = JSON.parse(JSON.stringify(a)));
            const s = this.boundingSphere;
            return (
                null !== s &&
                (e.data.boundingSphere = {
                    center: s.center.toArray(),
                    radius: s.radius,
                }),
                e
            );
        }
        clone() {
            return new this.constructor().copy(this);
        }
        copy(e) {
            (this.index = null),
                (this.attributes = {}),
                (this.morphAttributes = {}),
                (this.groups = []),
                (this.boundingBox = null),
                (this.boundingSphere = null);
            const t = {};
            this.name = e.name;
            const n = e.index;
            null !== n && this.setIndex(n.clone(t));
            const i = e.attributes;
            for (const e in i) {
                const n = i[e];
                this.setAttribute(e, n.clone(t));
            }
            const r = e.morphAttributes;
            for (const e in r) {
                const n = [],
                    i = r[e];
                for (let e = 0, r = i.length; e < r; e++) n.push(i[e].clone(t));
                this.morphAttributes[e] = n;
            }
            this.morphTargetsRelative = e.morphTargetsRelative;
            const a = e.groups;
            for (let e = 0, t = a.length; e < t; e++) {
                const t = a[e];
                this.addGroup(t.start, t.count, t.materialIndex);
            }
            const s = e.boundingBox;
            null !== s && (this.boundingBox = s.clone());
            const o = e.boundingSphere;
            return (
                null !== o && (this.boundingSphere = o.clone()),
                (this.drawRange.start = e.drawRange.start),
                (this.drawRange.count = e.drawRange.count),
                (this.userData = e.userData),
                this
            );
        }
        dispose() {
            this.dispatchEvent({ type: "dispose" });
        }
    }


    function vc(e, t, n) {
        const i = t.attributes,
            r = [];
        function a(t, i) {
            return n.getDependency("accessor", t).then(function (t) {
                e.setAttribute(i, t);
            });
        }
        for (const t in i) {
            const n = ic[t] || t.toLowerCase();
            n in e.attributes || r.push(a(i[t], n));
        }
        if (void 0 !== t.indices && !e.index) {
            const i = n.getDependency("accessor", t.indices).then(function (t) {
                e.setIndex(t);
            });
            r.push(i);
        }
        return (
            rn.workingColorSpace !== wt &&
            "COLOR_0" in i &&
            console.warn(
                `THREE.GLTFLoader: Converting vertex colors from "srgb-linear" to "${rn.workingColorSpace}" not supported.`
            ),
            hc(e, t),
            (function (e, t, n) {
                const i = t.attributes,
                    r = new kn();
                if (void 0 === i.POSITION) return;
                {
                    const e = n.json.accessors[i.POSITION],
                        t = e.min,
                        a = e.max;
                    if (void 0 === t || void 0 === a)
                        return void console.warn(
                            "THREE.GLTFLoader: Missing min/max properties for accessor POSITION."
                        );
                    if (
                        (r.set(new bn(t[0], t[1], t[2]), new bn(a[0], a[1], a[2])),
                            e.normalized)
                    ) {
                        const t = fc($l[e.componentType]);
                        r.min.multiplyScalar(t), r.max.multiplyScalar(t);
                    }
                }
                const a = t.targets;
                if (void 0 !== a) {
                    const e = new bn(),
                        t = new bn();
                    for (let i = 0, r = a.length; i < r; i++) {
                        const r = a[i];
                        if (void 0 !== r.POSITION) {
                            const i = n.json.accessors[r.POSITION],
                                a = i.min,
                                s = i.max;
                            if (void 0 !== a && void 0 !== s) {
                                if (
                                    (t.setX(Math.max(Math.abs(a[0]), Math.abs(s[0]))),
                                        t.setY(Math.max(Math.abs(a[1]), Math.abs(s[1]))),
                                        t.setZ(Math.max(Math.abs(a[2]), Math.abs(s[2]))),
                                        i.normalized)
                                ) {
                                    const e = fc($l[i.componentType]);
                                    t.multiplyScalar(e);
                                }
                                e.max(t);
                            } else
                                console.warn(
                                    "THREE.GLTFLoader: Missing min/max properties for accessor POSITION."
                                );
                        }
                    }
                    r.expandByVector(e);
                }
                e.boundingBox = r;
                const s = new Wn();
                r.getCenter(s.center),
                    (s.radius = r.min.distanceTo(r.max) / 2),
                    (e.boundingSphere = s);
            })(e, t, n),
            Promise.all(r).then(function () {
                return void 0 !== t.targets
                    ? (function (e, t, n) {
                        let i = !1,
                            r = !1,
                            a = !1;
                        for (let e = 0, n = t.length; e < n; e++) {
                            const n = t[e];
                            if (
                                (void 0 !== n.POSITION && (i = !0),
                                    void 0 !== n.NORMAL && (r = !0),
                                    void 0 !== n.COLOR_0 && (a = !0),
                                    i && r && a)
                            )
                                break;
                        }
                        if (!i && !r && !a) return Promise.resolve(e);
                        const s = [],
                            o = [],
                            l = [];
                        for (let c = 0, h = t.length; c < h; c++) {
                            const h = t[c];
                            if (i) {
                                const t =
                                    void 0 !== h.POSITION
                                        ? n.getDependency("accessor", h.POSITION)
                                        : e.attributes.position;
                                s.push(t);
                            }
                            if (r) {
                                const t =
                                    void 0 !== h.NORMAL
                                        ? n.getDependency("accessor", h.NORMAL)
                                        : e.attributes.normal;
                                o.push(t);
                            }
                            if (a) {
                                const t =
                                    void 0 !== h.COLOR_0
                                        ? n.getDependency("accessor", h.COLOR_0)
                                        : e.attributes.color;
                                l.push(t);
                            }
                        }
                        return Promise.all([
                            Promise.all(s),
                            Promise.all(o),
                            Promise.all(l),
                        ]).then(function (t) {
                            const n = t[0],
                                s = t[1],
                                o = t[2];
                            return (
                                i && (e.morphAttributes.position = n),
                                r && (e.morphAttributes.normal = s),
                                a && (e.morphAttributes.color = o),
                                (e.morphTargetsRelative = !0),
                                e
                            );
                        });
                    })(e, t.targets, n)
                    : e;
            })
        );
    }


    const En = [
        new bn(),
        new bn(),
        new bn(),
        new bn(),
        new bn(),
        new bn(),
        new bn(),
        new bn(),
    ],
        Sn = new bn(),
        Mn = new kn(),
        _n = new bn(),
        Tn = new bn(),
        Cn = new bn(),
        Pn = new bn(),
        In = new bn(),
        Rn = new bn(),
        Ln = new bn(),
        Dn = new bn(),
        Nn = new bn(),
        Bn = new bn();
    function Un(e, t, n, i, r) {
        for (let a = 0, s = e.length - 3; a <= s; a += 3) {
            Bn.fromArray(e, a);
            const s =
                r.x * Math.abs(Bn.x) +
                r.y * Math.abs(Bn.y) +
                r.z * Math.abs(Bn.z),
                o = t.dot(Bn),
                l = n.dot(Bn),
                c = i.dot(Bn);
            if (Math.max(-Math.max(o, l, c), Math.min(o, l, c)) > s) return !1;
        }
        return !0;
    }

    const zn = new kn(),
        On = new bn(),
        Fn = new bn();
    class Wn {
        constructor(e = new bn(), t = -1) {
            (this.isSphere = !0), (this.center = e), (this.radius = t);
        }
        set(e, t) {
            return this.center.copy(e), (this.radius = t), this;
        }
        setFromPoints(e, t) {
            const n = this.center;
            void 0 !== t ? n.copy(t) : zn.setFromPoints(e).getCenter(n);
            let i = 0;
            for (let t = 0, r = e.length; t < r; t++)
                i = Math.max(i, n.distanceToSquared(e[t]));
            return (this.radius = Math.sqrt(i)), this;
        }
        copy(e) {
            return this.center.copy(e.center), (this.radius = e.radius), this;
        }
        isEmpty() {
            return this.radius < 0;
        }
        makeEmpty() {
            return this.center.set(0, 0, 0), (this.radius = -1), this;
        }
        containsPoint(e) {
            return e.distanceToSquared(this.center) <= this.radius * this.radius;
        }
        distanceToPoint(e) {
            return e.distanceTo(this.center) - this.radius;
        }
        intersectsSphere(e) {
            const t = this.radius + e.radius;
            return e.center.distanceToSquared(this.center) <= t * t;
        }
        intersectsBox(e) {
            return e.intersectsSphere(this);
        }
        intersectsPlane(e) {
            return Math.abs(e.distanceToPoint(this.center)) <= this.radius;
        }
        clampPoint(e, t) {
            const n = this.center.distanceToSquared(e);
            return (
                t.copy(e),
                n > this.radius * this.radius &&
                (t.sub(this.center).normalize(),
                    t.multiplyScalar(this.radius).add(this.center)),
                t
            );
        }
        getBoundingBox(e) {
            return this.isEmpty()
                ? (e.makeEmpty(), e)
                : (e.set(this.center, this.center),
                    e.expandByScalar(this.radius),
                    e);
        }
        applyMatrix4(e) {
            return (
                this.center.applyMatrix4(e),
                (this.radius = this.radius * e.getMaxScaleOnAxis()),
                this
            );
        }
        translate(e) {
            return this.center.add(e), this;
        }
        expandByPoint(e) {
            if (this.isEmpty())
                return this.center.copy(e), (this.radius = 0), this;
            On.subVectors(e, this.center);
            const t = On.lengthSq();
            if (t > this.radius * this.radius) {
                const e = Math.sqrt(t),
                    n = 0.5 * (e - this.radius);
                this.center.addScaledVector(On, n / e), (this.radius += n);
            }
            return this;
        }
        union(e) {
            return e.isEmpty()
                ? this
                : this.isEmpty()
                    ? (this.copy(e), this)
                    : (!0 === this.center.equals(e.center)
                        ? (this.radius = Math.max(this.radius, e.radius))
                        : (Fn.subVectors(e.center, this.center).setLength(e.radius),
                            this.expandByPoint(On.copy(e.center).add(Fn)),
                            this.expandByPoint(On.copy(e.center).sub(Fn))),
                        this);
        }
        equals(e) {
            return e.center.equals(this.center) && e.radius === this.radius;
        }
        clone() {
            return new this.constructor().copy(this);
        }
    }

    class Yn {
        constructor(e = new bn(), t = new bn(0, 0, -1)) {
            (this.origin = e), (this.direction = t);
        }
        set(e, t) {
            return this.origin.copy(e), this.direction.copy(t), this;
        }
        copy(e) {
            return (
                this.origin.copy(e.origin), this.direction.copy(e.direction), this
            );
        }
        at(e, t) {
            return t.copy(this.origin).addScaledVector(this.direction, e);
        }
        lookAt(e) {
            return this.direction.copy(e).sub(this.origin).normalize(), this;
        }
        recast(e) {
            return this.origin.copy(this.at(e, Hn)), this;
        }
        closestPointToPoint(e, t) {
            t.subVectors(e, this.origin);
            const n = t.dot(this.direction);
            return n < 0
                ? t.copy(this.origin)
                : t.copy(this.origin).addScaledVector(this.direction, n);
        }
        distanceToPoint(e) {
            return Math.sqrt(this.distanceSqToPoint(e));
        }
        distanceSqToPoint(e) {
            const t = Hn.subVectors(e, this.origin).dot(this.direction);
            return t < 0
                ? this.origin.distanceToSquared(e)
                : (Hn.copy(this.origin).addScaledVector(this.direction, t),
                    Hn.distanceToSquared(e));
        }
        distanceSqToSegment(e, t, n, i) {
            Vn.copy(e).add(t).multiplyScalar(0.5),
                Gn.copy(t).sub(e).normalize(),
                jn.copy(this.origin).sub(Vn);
            const r = 0.5 * e.distanceTo(t),
                a = -this.direction.dot(Gn),
                s = jn.dot(this.direction),
                o = -jn.dot(Gn),
                l = jn.lengthSq(),
                c = Math.abs(1 - a * a);
            let h, d, u, p;
            if (c > 0)
                if (((h = a * o - s), (d = a * s - o), (p = r * c), h >= 0))
                    if (d >= -p)
                        if (d <= p) {
                            const e = 1 / c;
                            (h *= e),
                                (d *= e),
                                (u = h * (h + a * d + 2 * s) + d * (a * h + d + 2 * o) + l);
                        } else
                            (d = r),
                                (h = Math.max(0, -(a * d + s))),
                                (u = -h * h + d * (d + 2 * o) + l);
                    else
                        (d = -r),
                            (h = Math.max(0, -(a * d + s))),
                            (u = -h * h + d * (d + 2 * o) + l);
                else
                    d <= -p
                        ? ((h = Math.max(0, -(-a * r + s))),
                            (d = h > 0 ? -r : Math.min(Math.max(-r, -o), r)),
                            (u = -h * h + d * (d + 2 * o) + l))
                        : d <= p
                            ? ((h = 0),
                                (d = Math.min(Math.max(-r, -o), r)),
                                (u = d * (d + 2 * o) + l))
                            : ((h = Math.max(0, -(a * r + s))),
                                (d = h > 0 ? r : Math.min(Math.max(-r, -o), r)),
                                (u = -h * h + d * (d + 2 * o) + l));
            else
                (d = a > 0 ? -r : r),
                    (h = Math.max(0, -(a * d + s))),
                    (u = -h * h + d * (d + 2 * o) + l);
            return (
                n && n.copy(this.origin).addScaledVector(this.direction, h),
                i && i.copy(Vn).addScaledVector(Gn, d),
                u
            );
        }
        intersectSphere(e, t) {
            Hn.subVectors(e.center, this.origin);
            const n = Hn.dot(this.direction),
                i = Hn.dot(Hn) - n * n,
                r = e.radius * e.radius;
            if (i > r) return null;
            const a = Math.sqrt(r - i),
                s = n - a,
                o = n + a;
            return o < 0 ? null : s < 0 ? this.at(o, t) : this.at(s, t);
        }
        intersectsSphere(e) {
            return this.distanceSqToPoint(e.center) <= e.radius * e.radius;
        }
        distanceToPlane(e) {
            const t = e.normal.dot(this.direction);
            if (0 === t) return 0 === e.distanceToPoint(this.origin) ? 0 : null;
            const n = -(this.origin.dot(e.normal) + e.constant) / t;
            return n >= 0 ? n : null;
        }
        intersectPlane(e, t) {
            const n = this.distanceToPlane(e);
            return null === n ? null : this.at(n, t);
        }
        intersectsPlane(e) {
            const t = e.distanceToPoint(this.origin);
            if (0 === t) return !0;
            return e.normal.dot(this.direction) * t < 0;
        }
        intersectBox(e, t) {
            let n, i, r, a, s, o;
            const l = 1 / this.direction.x,
                c = 1 / this.direction.y,
                h = 1 / this.direction.z,
                d = this.origin;
            return (
                l >= 0
                    ? ((n = (e.min.x - d.x) * l), (i = (e.max.x - d.x) * l))
                    : ((n = (e.max.x - d.x) * l), (i = (e.min.x - d.x) * l)),
                c >= 0
                    ? ((r = (e.min.y - d.y) * c), (a = (e.max.y - d.y) * c))
                    : ((r = (e.max.y - d.y) * c), (a = (e.min.y - d.y) * c)),
                n > a || r > i
                    ? null
                    : ((r > n || isNaN(n)) && (n = r),
                        (a < i || isNaN(i)) && (i = a),
                        h >= 0
                            ? ((s = (e.min.z - d.z) * h), (o = (e.max.z - d.z) * h))
                            : ((s = (e.max.z - d.z) * h), (o = (e.min.z - d.z) * h)),
                        n > o || s > i
                            ? null
                            : ((s > n || n != n) && (n = s),
                                (o < i || i != i) && (i = o),
                                i < 0 ? null : this.at(n >= 0 ? n : i, t)))
            );
        }
        intersectsBox(e) {
            return null !== this.intersectBox(e, Hn);
        }
        intersectTriangle(e, t, n, i, r) {
            Qn.subVectors(t, e), Kn.subVectors(n, e), qn.crossVectors(Qn, Kn);
            let a,
                s = this.direction.dot(qn);
            if (s > 0) {
                if (i) return null;
                a = 1;
            } else {
                if (!(s < 0)) return null;
                (a = -1), (s = -s);
            }
            jn.subVectors(this.origin, e);
            const o = a * this.direction.dot(Kn.crossVectors(jn, Kn));
            if (o < 0) return null;
            const l = a * this.direction.dot(Qn.cross(jn));
            if (l < 0) return null;
            if (o + l > s) return null;
            const c = -a * jn.dot(qn);
            return c < 0 ? null : this.at(c / s, r);
        }
        applyMatrix4(e) {
            return (
                this.origin.applyMatrix4(e),
                this.direction.transformDirection(e),
                this
            );
        }
        equals(e) {
            return (
                e.origin.equals(this.origin) && e.direction.equals(this.direction)
            );
        }
        clone() {
            return new this.constructor().copy(this);
        }
    }

    const lr = new Xn(),
        cr = new Yn(),
        hr = new Wn(),
        dr = new bn(),
        ur = new bn(),
        pr = new bn(),
        fr = new bn(),
        mr = new bn(),
        gr = new bn(),
        vr = new bn(),
        wr = new bn();
    class yr extends ki {
        constructor(e = new or(), t = new Qi()) {
            super(),
                (this.isMesh = !0),
                (this.type = "Mesh"),
                (this.geometry = e),
                (this.material = t),
                (this.morphTargetDictionary = void 0),
                (this.morphTargetInfluences = void 0),
                this.updateMorphTargets();
        }
        copy(e, t) {
            return (
                super.copy(e, t),
                void 0 !== e.morphTargetInfluences &&
                (this.morphTargetInfluences = e.morphTargetInfluences.slice()),
                void 0 !== e.morphTargetDictionary &&
                (this.morphTargetDictionary = Object.assign(
                    {},
                    e.morphTargetDictionary
                )),
                (this.material = Array.isArray(e.material)
                    ? e.material.slice()
                    : e.material),
                (this.geometry = e.geometry),
                this
            );
        }
        updateMorphTargets() {
            const e = this.geometry.morphAttributes,
                t = Object.keys(e);
            if (t.length > 0) {
                const n = e[t[0]];
                if (void 0 !== n) {
                    (this.morphTargetInfluences = []),
                        (this.morphTargetDictionary = {});
                    for (let e = 0, t = n.length; e < t; e++) {
                        const t = n[e].name || String(e);
                        this.morphTargetInfluences.push(0),
                            (this.morphTargetDictionary[t] = e);
                    }
                }
            }
        }
        getVertexPosition(e, t) {
            const n = this.geometry,
                i = n.attributes.position,
                r = n.morphAttributes.position,
                a = n.morphTargetsRelative;
            t.fromBufferAttribute(i, e);
            const s = this.morphTargetInfluences;
            if (r && s) {
                gr.set(0, 0, 0);
                for (let n = 0, i = r.length; n < i; n++) {
                    const i = s[n],
                        o = r[n];
                    0 !== i &&
                        (mr.fromBufferAttribute(o, e),
                            a
                                ? gr.addScaledVector(mr, i)
                                : gr.addScaledVector(mr.sub(t), i));
                }
                t.add(gr);
            }
            return t;
        }
        raycast(e, t) {
            const n = this.geometry,
                i = this.material,
                r = this.matrixWorld;
            if (void 0 !== i) {
                if (
                    (null === n.boundingSphere && n.computeBoundingSphere(),
                        hr.copy(n.boundingSphere),
                        hr.applyMatrix4(r),
                        cr.copy(e.ray).recast(e.near),
                        !1 === hr.containsPoint(cr.origin))
                ) {
                    if (null === cr.intersectSphere(hr, dr)) return;
                    if (cr.origin.distanceToSquared(dr) > (e.far - e.near) ** 2)
                        return;
                }
                lr.copy(r).invert(),
                    cr.copy(e.ray).applyMatrix4(lr),
                    (null !== n.boundingBox &&
                        !1 === cr.intersectsBox(n.boundingBox)) ||
                    this._computeIntersections(e, t, cr);
            }
        }
        _computeIntersections(e, t, n) {
            let i;
            const r = this.geometry,
                a = this.material,
                s = r.index,
                o = r.attributes.position,
                l = r.attributes.uv,
                c = r.attributes.uv1,
                h = r.attributes.normal,
                d = r.groups,
                u = r.drawRange;
            if (null !== s)
                if (Array.isArray(a))
                    for (let r = 0, o = d.length; r < o; r++) {
                        const o = d[r],
                            p = a[o.materialIndex];
                        for (
                            let r = Math.max(o.start, u.start),
                            a = Math.min(
                                s.count,
                                Math.min(o.start + o.count, u.start + u.count)
                            );
                            r < a;
                            r += 3
                        ) {
                            (i = br(
                                this,
                                p,
                                e,
                                n,
                                l,
                                c,
                                h,
                                s.getX(r),
                                s.getX(r + 1),
                                s.getX(r + 2)
                            )),
                                i &&
                                ((i.faceIndex = Math.floor(r / 3)),
                                    (i.face.materialIndex = o.materialIndex),
                                    t.push(i));
                        }
                    }
                else {
                    for (
                        let r = Math.max(0, u.start),
                        o = Math.min(s.count, u.start + u.count);
                        r < o;
                        r += 3
                    ) {
                        (i = br(
                            this,
                            a,
                            e,
                            n,
                            l,
                            c,
                            h,
                            s.getX(r),
                            s.getX(r + 1),
                            s.getX(r + 2)
                        )),
                            i && ((i.faceIndex = Math.floor(r / 3)), t.push(i));
                    }
                }
            else if (void 0 !== o)
                if (Array.isArray(a))
                    for (let r = 0, s = d.length; r < s; r++) {
                        const s = d[r],
                            p = a[s.materialIndex];
                        for (
                            let r = Math.max(s.start, u.start),
                            a = Math.min(
                                o.count,
                                Math.min(s.start + s.count, u.start + u.count)
                            );
                            r < a;
                            r += 3
                        ) {
                            (i = br(this, p, e, n, l, c, h, r, r + 1, r + 2)),
                                i &&
                                ((i.faceIndex = Math.floor(r / 3)),
                                    (i.face.materialIndex = s.materialIndex),
                                    t.push(i));
                        }
                    }
                else {
                    for (
                        let r = Math.max(0, u.start),
                        s = Math.min(o.count, u.start + u.count);
                        r < s;
                        r += 3
                    ) {
                        (i = br(this, a, e, n, l, c, h, r, r + 1, r + 2)),
                            i && ((i.faceIndex = Math.floor(r / 3)), t.push(i));
                    }
                }
        }
    }



    let un = 0;
    class pn extends Dt {
        constructor(
            e = pn.DEFAULT_IMAGE,
            t = pn.DEFAULT_MAPPING,
            n = 1001,
            i = 1001,
            r = 1006,
            a = 1008,
            s = 1023,
            o = 1009,
            l = pn.DEFAULT_ANISOTROPY,
            c = ""
        ) {
            super(),
                (this.isTexture = !0),
                Object.defineProperty(this, "id", { value: un++ }),
                (this.uuid = Ot()),
                (this.name = ""),
                (this.source = new hn(e)),
                (this.mipmaps = []),
                (this.mapping = t),
                (this.channel = 0),
                (this.wrapS = n),
                (this.wrapT = i),
                (this.magFilter = r),
                (this.minFilter = a),
                (this.anisotropy = l),
                (this.format = s),
                (this.internalFormat = null),
                (this.type = o),
                (this.offset = new Qt(0, 0)),
                (this.repeat = new Qt(1, 1)),
                (this.center = new Qt(0, 0)),
                (this.rotation = 0),
                (this.matrixAutoUpdate = !0),
                (this.matrix = new Kt()),
                (this.generateMipmaps = !0),
                (this.premultiplyAlpha = !1),
                (this.flipY = !0),
                (this.unpackAlignment = 4),
                (this.colorSpace = c),
                (this.userData = {}),
                (this.version = 0),
                (this.onUpdate = null),
                (this.renderTarget = null),
                (this.isRenderTargetTexture = !1),
                (this.pmremVersion = 0);
        }
        get image() {
            return this.source.data;
        }
        set image(e = null) {
            this.source.data = e;
        }
        updateMatrix() {
            this.matrix.setUvTransform(
                this.offset.x,
                this.offset.y,
                this.repeat.x,
                this.repeat.y,
                this.rotation,
                this.center.x,
                this.center.y
            );
        }
        clone() {
            return new this.constructor().copy(this);
        }
        copy(e) {
            return (
                (this.name = e.name),
                (this.source = e.source),
                (this.mipmaps = e.mipmaps.slice(0)),
                (this.mapping = e.mapping),
                (this.channel = e.channel),
                (this.wrapS = e.wrapS),
                (this.wrapT = e.wrapT),
                (this.magFilter = e.magFilter),
                (this.minFilter = e.minFilter),
                (this.anisotropy = e.anisotropy),
                (this.format = e.format),
                (this.internalFormat = e.internalFormat),
                (this.type = e.type),
                this.offset.copy(e.offset),
                this.repeat.copy(e.repeat),
                this.center.copy(e.center),
                (this.rotation = e.rotation),
                (this.matrixAutoUpdate = e.matrixAutoUpdate),
                this.matrix.copy(e.matrix),
                (this.generateMipmaps = e.generateMipmaps),
                (this.premultiplyAlpha = e.premultiplyAlpha),
                (this.flipY = e.flipY),
                (this.unpackAlignment = e.unpackAlignment),
                (this.colorSpace = e.colorSpace),
                (this.renderTarget = e.renderTarget),
                (this.isRenderTargetTexture = e.isRenderTargetTexture),
                (this.userData = JSON.parse(JSON.stringify(e.userData))),
                (this.needsUpdate = !0),
                this
            );
        }
        toJSON(e) {
            const t = void 0 === e || "string" == typeof e;
            if (!t && void 0 !== e.textures[this.uuid])
                return e.textures[this.uuid];
            const n = {
                metadata: {
                    version: 4.6,
                    type: "Texture",
                    generator: "Texture.toJSON",
                },
                uuid: this.uuid,
                name: this.name,
                image: this.source.toJSON(e).uuid,
                mapping: this.mapping,
                channel: this.channel,
                repeat: [this.repeat.x, this.repeat.y],
                offset: [this.offset.x, this.offset.y],
                center: [this.center.x, this.center.y],
                rotation: this.rotation,
                wrap: [this.wrapS, this.wrapT],
                format: this.format,
                internalFormat: this.internalFormat,
                type: this.type,
                colorSpace: this.colorSpace,
                minFilter: this.minFilter,
                magFilter: this.magFilter,
                anisotropy: this.anisotropy,
                flipY: this.flipY,
                generateMipmaps: this.generateMipmaps,
                premultiplyAlpha: this.premultiplyAlpha,
                unpackAlignment: this.unpackAlignment,
            };
            return (
                Object.keys(this.userData).length > 0 &&
                (n.userData = this.userData),
                t || (e.textures[this.uuid] = n),
                n
            );
        }
        dispose() {
            this.dispatchEvent({ type: "dispose" });
        }
        transformUv(e) {
            if (300 !== this.mapping) return e;
            if ((e.applyMatrix3(this.matrix), e.x < 0 || e.x > 1))
                switch (this.wrapS) {
                    case ae:
                        e.x = e.x - Math.floor(e.x);
                        break;
                    case se:
                        e.x = e.x < 0 ? 0 : 1;
                        break;
                    case oe:
                        1 === Math.abs(Math.floor(e.x) % 2)
                            ? (e.x = Math.ceil(e.x) - e.x)
                            : (e.x = e.x - Math.floor(e.x));
                }
            if (e.y < 0 || e.y > 1)
                switch (this.wrapT) {
                    case ae:
                        e.y = e.y - Math.floor(e.y);
                        break;
                    case se:
                        e.y = e.y < 0 ? 0 : 1;
                        break;
                    case oe:
                        1 === Math.abs(Math.floor(e.y) % 2)
                            ? (e.y = Math.ceil(e.y) - e.y)
                            : (e.y = e.y - Math.floor(e.y));
                }
            return this.flipY && (e.y = 1 - e.y), e;
        }
        set needsUpdate(e) {
            !0 === e && (this.version++, (this.source.needsUpdate = !0));
        }
        set needsPMREMUpdate(e) {
            !0 === e && this.pmremVersion++;
        }
    }
    (pn.DEFAULT_IMAGE = null),
        (pn.DEFAULT_MAPPING = 300),
        (pn.DEFAULT_ANISOTROPY = 1);




    function vl(e, t = !1) {
        const n = null !== e[0].index,
            i = new Set(Object.keys(e[0].attributes)),
            r = new Set(Object.keys(e[0].morphAttributes)),
            a = {},
            s = {},
            o = e[0].morphTargetsRelative,
            l = new or();
        let c = 0;
        for (let h = 0; h < e.length; ++h) {
            const d = e[h];
            let u = 0;
            if (n !== (null !== d.index))
                return (
                    console.error(
                        "THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index " +
                        h +
                        ". All geometries must have compatible attributes; make sure index attribute exists among all geometries, or in none of them."
                    ),
                    null
                );
            for (const e in d.attributes) {
                if (!i.has(e))
                    return (
                        console.error(
                            "THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index " +
                            h +
                            '. All geometries must have compatible attributes; make sure "' +
                            e +
                            '" attribute exists among all geometries, or in none of them.'
                        ),
                        null
                    );
                void 0 === a[e] && (a[e] = []), a[e].push(d.attributes[e]), u++;
            }
            if (u !== i.size)
                return (
                    console.error(
                        "THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index " +
                        h +
                        ". Make sure all geometries have the same number of attributes."
                    ),
                    null
                );
            if (o !== d.morphTargetsRelative)
                return (
                    console.error(
                        "THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index " +
                        h +
                        ". .morphTargetsRelative must be consistent throughout all geometries."
                    ),
                    null
                );
            for (const e in d.morphAttributes) {
                if (!r.has(e))
                    return (
                        console.error(
                            "THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index " +
                            h +
                            ".  .morphAttributes must be consistent throughout all geometries."
                        ),
                        null
                    );
                void 0 === s[e] && (s[e] = []), s[e].push(d.morphAttributes[e]);
            }
            if (t) {
                let e;
                if (n) e = d.index.count;
                else {
                    if (void 0 === d.attributes.position)
                        return (
                            console.error(
                                "THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index " +
                                h +
                                ". The geometry must have either an index or a position attribute"
                            ),
                            null
                        );
                    e = d.attributes.position.count;
                }
                l.addGroup(c, e, h), (c += e);
            }
        }
        if (n) {
            let t = 0;
            const n = [];
            for (let i = 0; i < e.length; ++i) {
                const r = e[i].index;
                for (let e = 0; e < r.count; ++e) n.push(r.getX(e) + t);
                t += e[i].attributes.position.count;
            }
            l.setIndex(n);
        }
        for (const e in a) {
            const t = wl(a[e]);
            if (!t)
                return (
                    console.error(
                        "THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the " +
                        e +
                        " attribute."
                    ),
                    null
                );
            l.setAttribute(e, t);
        }
        for (const e in s) {
            const t = s[e][0].length;
            if (0 === t) break;
            (l.morphAttributes = l.morphAttributes || {}),
                (l.morphAttributes[e] = []);
            for (let n = 0; n < t; ++n) {
                const t = [];
                for (let i = 0; i < s[e].length; ++i) t.push(s[e][i][n]);
                const i = wl(t);
                if (!i)
                    return (
                        console.error(
                            "THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the " +
                            e +
                            " morphAttribute."
                        ),
                        null
                    );
                l.morphAttributes[e].push(i);
            }
        }
        return l;
    }
    function wl(e) {
        let t,
            n,
            i,
            r = -1,
            a = 0;
        for (let s = 0; s < e.length; ++s) {
            const o = e[s];
            if (
                (void 0 === t && (t = o.array.constructor),
                    t !== o.array.constructor)
            )
                return (
                    console.error(
                        "THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.array must be of consistent array types across matching attributes."
                    ),
                    null
                );
            if ((void 0 === n && (n = o.itemSize), n !== o.itemSize))
                return (
                    console.error(
                        "THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.itemSize must be consistent across matching attributes."
                    ),
                    null
                );
            if ((void 0 === i && (i = o.normalized), i !== o.normalized))
                return (
                    console.error(
                        "THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.normalized must be consistent across matching attributes."
                    ),
                    null
                );
            if ((-1 === r && (r = o.gpuType), r !== o.gpuType))
                return (
                    console.error(
                        "THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.gpuType must be consistent across matching attributes."
                    ),
                    null
                );
            a += o.count * n;
        }
        const s = new t(a),
            o = new Xi(s, n, i);
        let l = 0;
        for (let t = 0; t < e.length; ++t) {
            const i = e[t];
            if (i.isInterleavedBufferAttribute) {
                const e = l / n;
                for (let t = 0, r = i.count; t < r; t++)
                    for (let r = 0; r < n; r++) {
                        const n = i.getComponent(t, r);
                        o.setComponent(t + e, r, n);
                    }
            } else s.set(i.array, l);
            l += i.count * n;
        }
        return void 0 !== r && (o.gpuType = r), o;
    }
    function yl(e, t = 1e-4) {
        t = Math.max(t, Number.EPSILON);
        const n = {},
            i = e.getIndex(),
            r = e.getAttribute("position"),
            a = i ? i.count : r.count;
        let s = 0;
        const o = Object.keys(e.attributes),
            l = {},
            c = {},
            h = [],
            d = ["getX", "getY", "getZ", "getW"],
            u = ["setX", "setY", "setZ", "setW"];
        for (let t = 0, n = o.length; t < n; t++) {
            const n = o[t],
                i = e.attributes[n];
            l[n] = new i.constructor(
                new i.array.constructor(i.count * i.itemSize),
                i.itemSize,
                i.normalized
            );
            const r = e.morphAttributes[n];
            r &&
                (c[n] || (c[n] = []),
                    r.forEach((e, t) => {
                        const i = new e.array.constructor(e.count * e.itemSize);
                        c[n][t] = new e.constructor(i, e.itemSize, e.normalized);
                    }));
        }
        const p = 0.5 * t,
            f = Math.log10(1 / t),
            m = Math.pow(10, f),
            g = p * m;
        for (let t = 0; t < a; t++) {
            const r = i ? i.getX(t) : t;
            let a = "";
            for (let t = 0, n = o.length; t < n; t++) {
                const n = o[t],
                    i = e.getAttribute(n),
                    s = i.itemSize;
                for (let e = 0; e < s; e++) a += ~~(i[d[e]](r) * m + g) + ",";
            }
            if (a in n) h.push(n[a]);
            else {
                for (let t = 0, n = o.length; t < n; t++) {
                    const n = o[t],
                        i = e.getAttribute(n),
                        a = e.morphAttributes[n],
                        h = i.itemSize,
                        p = l[n],
                        f = c[n];
                    for (let e = 0; e < h; e++) {
                        const t = d[e],
                            n = u[e];
                        if ((p[n](s, i[t](r)), a))
                            for (let e = 0, i = a.length; e < i; e++)
                                f[e][n](s, a[e][t](r));
                    }
                }
                (n[a] = s), h.push(s), s++;
            }
        }
        const v = e.clone();
        for (const t in e.attributes) {
            const e = l[t];
            if (
                (v.setAttribute(
                    t,
                    new e.constructor(
                        e.array.slice(0, s * e.itemSize),
                        e.itemSize,
                        e.normalized
                    )
                ),
                    t in c)
            )
                for (let e = 0; e < c[t].length; e++) {
                    const n = c[t][e];
                    v.morphAttributes[t][e] = new n.constructor(
                        n.array.slice(0, s * n.itemSize),
                        n.itemSize,
                        n.normalized
                    );
                }
        }
        return v.setIndex(h), v;
    }
    function bl(e, t) {
        if (0 === t)
            return (
                console.warn(
                    "THREE.BufferGeometryUtils.toTrianglesDrawMode(): Geometry already defined as triangles."
                ),
                e
            );
        if (2 === t || 1 === t) {
            let n = e.getIndex();
            if (null === n) {
                const t = [],
                    i = e.getAttribute("position");
                if (void 0 === i)
                    return (
                        console.error(
                            "THREE.BufferGeometryUtils.toTrianglesDrawMode(): Undefined position attribute. Processing not possible."
                        ),
                        e
                    );
                for (let e = 0; e < i.count; e++) t.push(e);
                e.setIndex(t), (n = e.getIndex());
            }
            const i = n.count - 2,
                r = [];
            if (2 === t)
                for (let e = 1; e <= i; e++)
                    r.push(n.getX(0)), r.push(n.getX(e)), r.push(n.getX(e + 1));
            else
                for (let e = 0; e < i; e++)
                    e % 2 == 0
                        ? (r.push(n.getX(e)),
                            r.push(n.getX(e + 1)),
                            r.push(n.getX(e + 2)))
                        : (r.push(n.getX(e + 2)),
                            r.push(n.getX(e + 1)),
                            r.push(n.getX(e)));
            r.length / 3 !== i &&
                console.error(
                    "THREE.BufferGeometryUtils.toTrianglesDrawMode(): Unable to generate correct amount of triangles."
                );
            const a = e.clone();
            return a.setIndex(r), a.clearGroups(), a;
        }
        return (
            console.error(
                "THREE.BufferGeometryUtils.toTrianglesDrawMode(): Unknown draw mode:",
                t
            ),
            e
        );
    }










































    getShared("onTrackpartsCalculatorReady")(vB, eU);





})();



