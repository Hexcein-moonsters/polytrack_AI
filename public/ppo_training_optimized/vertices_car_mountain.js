class GI {
    constructor(e) {
        RI.add(this),
            DI.set(this, void 0),
            NI.set(this, PA.Summer),
            BI.set(this, void 0),
            UI.set(this, void 0),
            zI.set(this, void 0),
            OI.set(this, null),
            HI(this, DI, e, "f"),
            HI(this, BI, new Ws({ depthWrite: !1 }), "f"),
            e.addMaterial(VI(this, BI, "f")),
            HI(this, UI, new Ws(), "f"),
            e.addMaterial(VI(this, UI, "f"));
        HI(
            this,
            zI,
            new yr(
                new Bs(6 * ju.maxViewDistance, 6 * ju.maxViewDistance, 10, 10),
                VI(this, BI, "f")
            ),
            "f"
        ),
            (VI(this, zI, "f").rotation.x = -Math.PI / 2),
            (VI(this, zI, "f").renderOrder = -2),
            (VI(this, zI, "f").receiveShadow = !0),
            e.scene.add(VI(this, zI, "f")),
            VI(this, RI, "m", WI).call(this, PA.Summer);
    }
    clearMountains() {
        null != VI(this, OI, "f") &&
            (VI(this, OI, "f").material.dispose(),
                VI(this, OI, "f").geometry.dispose(),
                VI(this, DI, "f").scene.remove(VI(this, OI, "f")),
                HI(this, OI, null, "f"));
    }
    generateMountains(e) {
        this.clearMountains();
        const { vertices: t, offset: n } = LI.createMountainVertices(e),
            i = new or();
        i.setAttribute("position", new Xi(new Float32Array(t), 3)),
            i.computeVertexNormals();
        const r = new yr(i, VI(this, UI, "f"));
        r.position.copy(n),
            (r.receiveShadow = !0),
            VI(this, DI, "f").scene.add(r),
            HI(this, OI, r, "f");
    }
    static createMountainVertices(e) {
        const t = new II(),
            n = Math.max(
                200,
                160 +
                Math.max(
                    ((Math.abs(e.max.x - e.min.x) * Cx.partSize) / 2) *
                    Math.SQRT2,
                    ((Math.abs(e.max.y - e.min.y) * Cx.partSize) / 2) * Math.SQRT2
                )
            ),
            i = new Qt(
                (e.min.x + (e.max.x - e.min.x) / 2) * Cx.partSize,
                (e.min.y + (e.max.y - e.min.y) / 2) * Cx.partSize
            );
        if (n > 4500) return { vertices: [], offset: new bn() };
        const r = Math.floor(n / 10),
            a = [];
        for (let e = 0; e < r; ++e) {
            const e = [];
            for (let n = 0; n < 8; ++n)
                0 == n || 7 == n || (1 == n && t.next() < 0.5)
                    ? e.push(0)
                    : e.push(t.next());
            a.push(e);
        }
        const s = 100,
            o = [];
        for (let e = 0; e < a.length; ++e) {
            const t = (e / a.length) * Math.PI * 2,
                i = ((e + 1) / a.length) * Math.PI * 2,
                r = a[e];
            let l;
            l = e + 1 < a.length ? a[e + 1] : a[0];
            for (let e = 0; e < r.length - 1; ++e) {
                const a = n + 100 * e,
                    c = n + 100 * (e + 1);
                o.push(Math.cos(t) * a, r[e] * s, Math.sin(t) * a),
                    o.push(Math.cos(i) * a, l[e] * s, Math.sin(i) * a),
                    o.push(Math.cos(i) * c, l[e + 1] * s, Math.sin(i) * c),
                    o.push(Math.cos(t) * a, r[e] * s, Math.sin(t) * a),
                    o.push(Math.cos(i) * c, l[e + 1] * s, Math.sin(i) * c),
                    o.push(Math.cos(t) * c, r[e + 1] * s, Math.sin(t) * c);
            }
        }
        return { vertices: o, offset: new bn(i.x, 0, i.y) };
    }
    getMountainVertices() {
        if (null == VI(this, OI, "f")) return [];
        const e = VI(this, OI, "f").geometry;
        if (!(e.attributes.position instanceof Xi))
            throw new Error("Vertices must use BufferAttribute");
        return Array.from(e.attributes.position.array);
    }
    getMountainOffset() {
        return null == VI(this, OI, "f")
            ? new bn()
            : VI(this, OI, "f").position.clone();
    }
    update(e) {
        e.environment != VI(this, NI, "f") &&
            VI(this, RI, "m", WI).call(this, e.environment);
        const t = new bn(),
            n = new yn(),
            i = new bn();
        VI(this, DI, "f").camera.matrix.decompose(t, n, i),
            VI(this, zI, "f").position.set(t.x, 0, t.z);
    }
}
(LI = GI),
(jI = GI);