var e;
var t = {
    77: (e, t, n) => {
        "use strict";
        e.exports = n.p + "images/rotation_axis_x_positive.svg";
    },
    493: (e, t, n) => {
        "use strict";
        e.exports = n.p + "images/empty.svg";
    },
    516: (e, t, n) => {
        "use strict";
        e.exports = n.p + "images/arrow_down.svg";
    },
    540: (e) => {
        "use strict";
        e.exports = function (e) {
            var t = document.createElement("style");
            return e.setAttributes(t, e.attributes), e.insert(t, e.options), t;
        };
    },
    813: (e, t, n) => {
        "use strict";
        e.exports = n.p + "images/winter.svg";
    },
    853: (e, t, n) => {
        "use strict";
        e.exports = n.p + "images/pmlicon.svg";
    },
    858: (e, t, n) => {
        "use strict";
        e.exports = n.p + "images/discord.svg";
    },
    1113: (e) => {
        "use strict";
        e.exports = function (e, t) {
            if (t.styleSheet) t.styleSheet.cssText = e;
            else {
                for (; t.firstChild;) t.removeChild(t.firstChild);
                t.appendChild(document.createTextNode(e));
            }
        };
    },
    1312: (e, t, n) => {
        var i;
        /**
         * [js-sha256]{@link https://github.com/emn178/js-sha256}
         *
         * @version 0.11.0
         * @author Chen, Yi-Cyuan [emn178@gmail.com]
         * @copyright Chen, Yi-Cyuan 2014-2024
         * @license MIT
         */ !(function () {
            "use strict";
            var t = "input is invalid type",
                r = "object" == typeof window,
                a = r ? window : {};
            a.JS_SHA256_NO_WINDOW && (r = !1);
            var s = !r && "object" == typeof self,
                o =
                    !a.JS_SHA256_NO_NODE_JS &&
                    "object" == typeof process &&
                    process.versions &&
                    process.versions.node;
            o ? (a = n.g) : s && (a = self);
            var l = !a.JS_SHA256_NO_COMMON_JS && e.exports,
                c = n.amdO,
                h =
                    !a.JS_SHA256_NO_ARRAY_BUFFER && "undefined" != typeof ArrayBuffer,
                d = "0123456789abcdef".split(""),
                u = [-2147483648, 8388608, 32768, 128],
                p = [24, 16, 8, 0],
                f = [
                    1116352408, 1899447441, 3049323471, 3921009573, 961987163,
                    1508970993, 2453635748, 2870763221, 3624381080, 310598401,
                    607225278, 1426881987, 1925078388, 2162078206, 2614888103,
                    3248222580, 3835390401, 4022224774, 264347078, 604807628,
                    770255983, 1249150122, 1555081692, 1996064986, 2554220882,
                    2821834349, 2952996808, 3210313671, 3336571891, 3584528711,
                    113926993, 338241895, 666307205, 773529912, 1294757372,
                    1396182291, 1695183700, 1986661051, 2177026350, 2456956037,
                    2730485921, 2820302411, 3259730800, 3345764771, 3516065817,
                    3600352804, 4094571909, 275423344, 430227734, 506948616,
                    659060556, 883997877, 958139571, 1322822218, 1537002063,
                    1747873779, 1955562222, 2024104815, 2227730452, 2361852424,
                    2428436474, 2756734187, 3204031479, 3329325298,
                ],
                m = ["hex", "array", "digest", "arrayBuffer"],
                g = [];
            (!a.JS_SHA256_NO_NODE_JS && Array.isArray) ||
                (Array.isArray = function (e) {
                    return "[object Array]" === Object.prototype.toString.call(e);
                }),
                !h ||
                (!a.JS_SHA256_NO_ARRAY_BUFFER_IS_VIEW && ArrayBuffer.isView) ||
                (ArrayBuffer.isView = function (e) {
                    return (
                        "object" == typeof e &&
                        e.buffer &&
                        e.buffer.constructor === ArrayBuffer
                    );
                });
            var v = function (e, t) {
                return function (n) {
                    return new x(t, !0).update(n)[e]();
                };
            },
                w = function (e) {
                    var t = v("hex", e);
                    o && (t = y(t, e)),
                        (t.create = function () {
                            return new x(e);
                        }),
                        (t.update = function (e) {
                            return t.create().update(e);
                        });
                    for (var n = 0; n < m.length; ++n) {
                        var i = m[n];
                        t[i] = v(i, e);
                    }
                    return t;
                },
                y = function (e, i) {
                    var r,
                        s = n(4394),
                        o = n(1903).Buffer,
                        l = i ? "sha224" : "sha256";
                    r =
                        o.from && !a.JS_SHA256_NO_BUFFER_FROM
                            ? o.from
                            : function (e) {
                                return new o(e);
                            };
                    return function (n) {
                        if ("string" == typeof n)
                            return s.createHash(l).update(n, "utf8").digest("hex");
                        if (null == n) throw new Error(t);
                        return (
                            n.constructor === ArrayBuffer && (n = new Uint8Array(n)),
                            Array.isArray(n) ||
                                ArrayBuffer.isView(n) ||
                                n.constructor === o
                                ? s.createHash(l).update(r(n)).digest("hex")
                                : e(n)
                        );
                    };
                },
                b = function (e, t) {
                    return function (n, i) {
                        return new k(n, t, !0).update(i)[e]();
                    };
                },
                A = function (e) {
                    var t = b("hex", e);
                    (t.create = function (t) {
                        return new k(t, e);
                    }),
                        (t.update = function (e, n) {
                            return t.create(e).update(n);
                        });
                    for (var n = 0; n < m.length; ++n) {
                        var i = m[n];
                        t[i] = b(i, e);
                    }
                    return t;
                };
            function x(e, t) {
                t
                    ? ((g[0] =
                        g[16] =
                        g[1] =
                        g[2] =
                        g[3] =
                        g[4] =
                        g[5] =
                        g[6] =
                        g[7] =
                        g[8] =
                        g[9] =
                        g[10] =
                        g[11] =
                        g[12] =
                        g[13] =
                        g[14] =
                        g[15] =
                        0),
                        (this.blocks = g))
                    : (this.blocks = [
                        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                    ]),
                    e
                        ? ((this.h0 = 3238371032),
                            (this.h1 = 914150663),
                            (this.h2 = 812702999),
                            (this.h3 = 4144912697),
                            (this.h4 = 4290775857),
                            (this.h5 = 1750603025),
                            (this.h6 = 1694076839),
                            (this.h7 = 3204075428))
                        : ((this.h0 = 1779033703),
                            (this.h1 = 3144134277),
                            (this.h2 = 1013904242),
                            (this.h3 = 2773480762),
                            (this.h4 = 1359893119),
                            (this.h5 = 2600822924),
                            (this.h6 = 528734635),
                            (this.h7 = 1541459225)),
                    (this.block = this.start = this.bytes = this.hBytes = 0),
                    (this.finalized = this.hashed = !1),
                    (this.first = !0),
                    (this.is224 = e);
            }
            function k(e, n, i) {
                var r,
                    a = typeof e;
                if ("string" === a) {
                    var s,
                        o = [],
                        l = e.length,
                        c = 0;
                    for (r = 0; r < l; ++r)
                        (s = e.charCodeAt(r)) < 128
                            ? (o[c++] = s)
                            : s < 2048
                                ? ((o[c++] = 192 | (s >>> 6)), (o[c++] = 128 | (63 & s)))
                                : s < 55296 || s >= 57344
                                    ? ((o[c++] = 224 | (s >>> 12)),
                                        (o[c++] = 128 | ((s >>> 6) & 63)),
                                        (o[c++] = 128 | (63 & s)))
                                    : ((s =
                                        65536 +
                                        (((1023 & s) << 10) | (1023 & e.charCodeAt(++r)))),
                                        (o[c++] = 240 | (s >>> 18)),
                                        (o[c++] = 128 | ((s >>> 12) & 63)),
                                        (o[c++] = 128 | ((s >>> 6) & 63)),
                                        (o[c++] = 128 | (63 & s)));
                    e = o;
                } else {
                    if ("object" !== a) throw new Error(t);
                    if (null === e) throw new Error(t);
                    if (h && e.constructor === ArrayBuffer) e = new Uint8Array(e);
                    else if (!(Array.isArray(e) || (h && ArrayBuffer.isView(e))))
                        throw new Error(t);
                }
                e.length > 64 && (e = new x(n, !0).update(e).array());
                var d = [],
                    u = [];
                for (r = 0; r < 64; ++r) {
                    var p = e[r] || 0;
                    (d[r] = 92 ^ p), (u[r] = 54 ^ p);
                }
                x.call(this, n, i),
                    this.update(u),
                    (this.oKeyPad = d),
                    (this.inner = !0),
                    (this.sharedMemory = i);
            }
            (x.prototype.update = function (e) {
                if (!this.finalized) {
                    var n,
                        i = typeof e;
                    if ("string" !== i) {
                        if ("object" !== i) throw new Error(t);
                        if (null === e) throw new Error(t);
                        if (h && e.constructor === ArrayBuffer) e = new Uint8Array(e);
                        else if (!(Array.isArray(e) || (h && ArrayBuffer.isView(e))))
                            throw new Error(t);
                        n = !0;
                    }
                    for (var r, a, s = 0, o = e.length, l = this.blocks; s < o;) {
                        if (
                            (this.hashed &&
                                ((this.hashed = !1),
                                    (l[0] = this.block),
                                    (this.block =
                                        l[16] =
                                        l[1] =
                                        l[2] =
                                        l[3] =
                                        l[4] =
                                        l[5] =
                                        l[6] =
                                        l[7] =
                                        l[8] =
                                        l[9] =
                                        l[10] =
                                        l[11] =
                                        l[12] =
                                        l[13] =
                                        l[14] =
                                        l[15] =
                                        0)),
                                n)
                        )
                            for (a = this.start; s < o && a < 64; ++s)
                                l[a >>> 2] |= e[s] << p[3 & a++];
                        else
                            for (a = this.start; s < o && a < 64; ++s)
                                (r = e.charCodeAt(s)) < 128
                                    ? (l[a >>> 2] |= r << p[3 & a++])
                                    : r < 2048
                                        ? ((l[a >>> 2] |= (192 | (r >>> 6)) << p[3 & a++]),
                                            (l[a >>> 2] |= (128 | (63 & r)) << p[3 & a++]))
                                        : r < 55296 || r >= 57344
                                            ? ((l[a >>> 2] |= (224 | (r >>> 12)) << p[3 & a++]),
                                                (l[a >>> 2] |= (128 | ((r >>> 6) & 63)) << p[3 & a++]),
                                                (l[a >>> 2] |= (128 | (63 & r)) << p[3 & a++]))
                                            : ((r =
                                                65536 +
                                                (((1023 & r) << 10) | (1023 & e.charCodeAt(++s)))),
                                                (l[a >>> 2] |= (240 | (r >>> 18)) << p[3 & a++]),
                                                (l[a >>> 2] |= (128 | ((r >>> 12) & 63)) << p[3 & a++]),
                                                (l[a >>> 2] |= (128 | ((r >>> 6) & 63)) << p[3 & a++]),
                                                (l[a >>> 2] |= (128 | (63 & r)) << p[3 & a++]));
                        (this.lastByteIndex = a),
                            (this.bytes += a - this.start),
                            a >= 64
                                ? ((this.block = l[16]),
                                    (this.start = a - 64),
                                    this.hash(),
                                    (this.hashed = !0))
                                : (this.start = a);
                    }
                    return (
                        this.bytes > 4294967295 &&
                        ((this.hBytes += (this.bytes / 4294967296) | 0),
                            (this.bytes = this.bytes % 4294967296)),
                        this
                    );
                }
            }),
                (x.prototype.finalize = function () {
                    if (!this.finalized) {
                        this.finalized = !0;
                        var e = this.blocks,
                            t = this.lastByteIndex;
                        (e[16] = this.block),
                            (e[t >>> 2] |= u[3 & t]),
                            (this.block = e[16]),
                            t >= 56 &&
                            (this.hashed || this.hash(),
                                (e[0] = this.block),
                                (e[16] =
                                    e[1] =
                                    e[2] =
                                    e[3] =
                                    e[4] =
                                    e[5] =
                                    e[6] =
                                    e[7] =
                                    e[8] =
                                    e[9] =
                                    e[10] =
                                    e[11] =
                                    e[12] =
                                    e[13] =
                                    e[14] =
                                    e[15] =
                                    0)),
                            (e[14] = (this.hBytes << 3) | (this.bytes >>> 29)),
                            (e[15] = this.bytes << 3),
                            this.hash();
                    }
                }),
                (x.prototype.hash = function () {
                    var e,
                        t,
                        n,
                        i,
                        r,
                        a,
                        s,
                        o,
                        l,
                        c = this.h0,
                        h = this.h1,
                        d = this.h2,
                        u = this.h3,
                        p = this.h4,
                        m = this.h5,
                        g = this.h6,
                        v = this.h7,
                        w = this.blocks;
                    for (e = 16; e < 64; ++e)
                        (t =
                            (((r = w[e - 15]) >>> 7) | (r << 25)) ^
                            ((r >>> 18) | (r << 14)) ^
                            (r >>> 3)),
                            (n =
                                (((r = w[e - 2]) >>> 17) | (r << 15)) ^
                                ((r >>> 19) | (r << 13)) ^
                                (r >>> 10)),
                            (w[e] = (w[e - 16] + t + w[e - 7] + n) | 0);
                    for (l = h & d, e = 0; e < 64; e += 4)
                        this.first
                            ? (this.is224
                                ? ((a = 300032),
                                    (v = ((r = w[0] - 1413257819) - 150054599) | 0),
                                    (u = (r + 24177077) | 0))
                                : ((a = 704751109),
                                    (v = ((r = w[0] - 210244248) - 1521486534) | 0),
                                    (u = (r + 143694565) | 0)),
                                (this.first = !1))
                            : ((t =
                                ((c >>> 2) | (c << 30)) ^
                                ((c >>> 13) | (c << 19)) ^
                                ((c >>> 22) | (c << 10))),
                                (i = (a = c & h) ^ (c & d) ^ l),
                                (v =
                                    (u +
                                        (r =
                                            v +
                                            (n =
                                                ((p >>> 6) | (p << 26)) ^
                                                ((p >>> 11) | (p << 21)) ^
                                                ((p >>> 25) | (p << 7))) +
                                            ((p & m) ^ (~p & g)) +
                                            f[e] +
                                            w[e])) |
                                    0),
                                (u = (r + (t + i)) | 0)),
                            (t =
                                ((u >>> 2) | (u << 30)) ^
                                ((u >>> 13) | (u << 19)) ^
                                ((u >>> 22) | (u << 10))),
                            (i = (s = u & c) ^ (u & h) ^ a),
                            (g =
                                (d +
                                    (r =
                                        g +
                                        (n =
                                            ((v >>> 6) | (v << 26)) ^
                                            ((v >>> 11) | (v << 21)) ^
                                            ((v >>> 25) | (v << 7))) +
                                        ((v & p) ^ (~v & m)) +
                                        f[e + 1] +
                                        w[e + 1])) |
                                0),
                            (t =
                                (((d = (r + (t + i)) | 0) >>> 2) | (d << 30)) ^
                                ((d >>> 13) | (d << 19)) ^
                                ((d >>> 22) | (d << 10))),
                            (i = (o = d & u) ^ (d & c) ^ s),
                            (m =
                                (h +
                                    (r =
                                        m +
                                        (n =
                                            ((g >>> 6) | (g << 26)) ^
                                            ((g >>> 11) | (g << 21)) ^
                                            ((g >>> 25) | (g << 7))) +
                                        ((g & v) ^ (~g & p)) +
                                        f[e + 2] +
                                        w[e + 2])) |
                                0),
                            (t =
                                (((h = (r + (t + i)) | 0) >>> 2) | (h << 30)) ^
                                ((h >>> 13) | (h << 19)) ^
                                ((h >>> 22) | (h << 10))),
                            (i = (l = h & d) ^ (h & u) ^ o),
                            (p =
                                (c +
                                    (r =
                                        p +
                                        (n =
                                            ((m >>> 6) | (m << 26)) ^
                                            ((m >>> 11) | (m << 21)) ^
                                            ((m >>> 25) | (m << 7))) +
                                        ((m & g) ^ (~m & v)) +
                                        f[e + 3] +
                                        w[e + 3])) |
                                0),
                            (c = (r + (t + i)) | 0),
                            (this.chromeBugWorkAround = !0);
                    (this.h0 = (this.h0 + c) | 0),
                        (this.h1 = (this.h1 + h) | 0),
                        (this.h2 = (this.h2 + d) | 0),
                        (this.h3 = (this.h3 + u) | 0),
                        (this.h4 = (this.h4 + p) | 0),
                        (this.h5 = (this.h5 + m) | 0),
                        (this.h6 = (this.h6 + g) | 0),
                        (this.h7 = (this.h7 + v) | 0);
                }),
                (x.prototype.hex = function () {
                    this.finalize();
                    var e = this.h0,
                        t = this.h1,
                        n = this.h2,
                        i = this.h3,
                        r = this.h4,
                        a = this.h5,
                        s = this.h6,
                        o = this.h7,
                        l =
                            d[(e >>> 28) & 15] +
                            d[(e >>> 24) & 15] +
                            d[(e >>> 20) & 15] +
                            d[(e >>> 16) & 15] +
                            d[(e >>> 12) & 15] +
                            d[(e >>> 8) & 15] +
                            d[(e >>> 4) & 15] +
                            d[15 & e] +
                            d[(t >>> 28) & 15] +
                            d[(t >>> 24) & 15] +
                            d[(t >>> 20) & 15] +
                            d[(t >>> 16) & 15] +
                            d[(t >>> 12) & 15] +
                            d[(t >>> 8) & 15] +
                            d[(t >>> 4) & 15] +
                            d[15 & t] +
                            d[(n >>> 28) & 15] +
                            d[(n >>> 24) & 15] +
                            d[(n >>> 20) & 15] +
                            d[(n >>> 16) & 15] +
                            d[(n >>> 12) & 15] +
                            d[(n >>> 8) & 15] +
                            d[(n >>> 4) & 15] +
                            d[15 & n] +
                            d[(i >>> 28) & 15] +
                            d[(i >>> 24) & 15] +
                            d[(i >>> 20) & 15] +
                            d[(i >>> 16) & 15] +
                            d[(i >>> 12) & 15] +
                            d[(i >>> 8) & 15] +
                            d[(i >>> 4) & 15] +
                            d[15 & i] +
                            d[(r >>> 28) & 15] +
                            d[(r >>> 24) & 15] +
                            d[(r >>> 20) & 15] +
                            d[(r >>> 16) & 15] +
                            d[(r >>> 12) & 15] +
                            d[(r >>> 8) & 15] +
                            d[(r >>> 4) & 15] +
                            d[15 & r] +
                            d[(a >>> 28) & 15] +
                            d[(a >>> 24) & 15] +
                            d[(a >>> 20) & 15] +
                            d[(a >>> 16) & 15] +
                            d[(a >>> 12) & 15] +
                            d[(a >>> 8) & 15] +
                            d[(a >>> 4) & 15] +
                            d[15 & a] +
                            d[(s >>> 28) & 15] +
                            d[(s >>> 24) & 15] +
                            d[(s >>> 20) & 15] +
                            d[(s >>> 16) & 15] +
                            d[(s >>> 12) & 15] +
                            d[(s >>> 8) & 15] +
                            d[(s >>> 4) & 15] +
                            d[15 & s];
                    return (
                        this.is224 ||
                        (l +=
                            d[(o >>> 28) & 15] +
                            d[(o >>> 24) & 15] +
                            d[(o >>> 20) & 15] +
                            d[(o >>> 16) & 15] +
                            d[(o >>> 12) & 15] +
                            d[(o >>> 8) & 15] +
                            d[(o >>> 4) & 15] +
                            d[15 & o]),
                        l
                    );
                }),
                (x.prototype.toString = x.prototype.hex),
                (x.prototype.digest = function () {
                    this.finalize();
                    var e = this.h0,
                        t = this.h1,
                        n = this.h2,
                        i = this.h3,
                        r = this.h4,
                        a = this.h5,
                        s = this.h6,
                        o = this.h7,
                        l = [
                            (e >>> 24) & 255,
                            (e >>> 16) & 255,
                            (e >>> 8) & 255,
                            255 & e,
                            (t >>> 24) & 255,
                            (t >>> 16) & 255,
                            (t >>> 8) & 255,
                            255 & t,
                            (n >>> 24) & 255,
                            (n >>> 16) & 255,
                            (n >>> 8) & 255,
                            255 & n,
                            (i >>> 24) & 255,
                            (i >>> 16) & 255,
                            (i >>> 8) & 255,
                            255 & i,
                            (r >>> 24) & 255,
                            (r >>> 16) & 255,
                            (r >>> 8) & 255,
                            255 & r,
                            (a >>> 24) & 255,
                            (a >>> 16) & 255,
                            (a >>> 8) & 255,
                            255 & a,
                            (s >>> 24) & 255,
                            (s >>> 16) & 255,
                            (s >>> 8) & 255,
                            255 & s,
                        ];
                    return (
                        this.is224 ||
                        l.push(
                            (o >>> 24) & 255,
                            (o >>> 16) & 255,
                            (o >>> 8) & 255,
                            255 & o
                        ),
                        l
                    );
                }),
                (x.prototype.array = x.prototype.digest),
                (x.prototype.arrayBuffer = function () {
                    this.finalize();
                    var e = new ArrayBuffer(this.is224 ? 28 : 32),
                        t = new DataView(e);
                    return (
                        t.setUint32(0, this.h0),
                        t.setUint32(4, this.h1),
                        t.setUint32(8, this.h2),
                        t.setUint32(12, this.h3),
                        t.setUint32(16, this.h4),
                        t.setUint32(20, this.h5),
                        t.setUint32(24, this.h6),
                        this.is224 || t.setUint32(28, this.h7),
                        e
                    );
                }),
                (k.prototype = new x()),
                (k.prototype.finalize = function () {
                    if ((x.prototype.finalize.call(this), this.inner)) {
                        this.inner = !1;
                        var e = this.array();
                        x.call(this, this.is224, this.sharedMemory),
                            this.update(this.oKeyPad),
                            this.update(e),
                            x.prototype.finalize.call(this);
                    }
                });
            var E = w();
            (E.sha256 = E),
                (E.sha224 = w(!0)),
                (E.sha256.hmac = A()),
                (E.sha224.hmac = A(!0)),
                l
                    ? (e.exports = E)
                    : ((a.sha256 = E.sha256),
                        (a.sha224 = E.sha224),
                        c &&
                        (void 0 ===
                            (i = function () {
                                return E;
                            }.call(E, n, E, e)) ||
                            (e.exports = i)));
        })();
    },
    1333: (e, t, n) => {
        "use strict";
        e.exports = n.p + "images/helmet.svg";
    },
    1465: (e, t, n) => {
        "use strict";
        n.d(t, { A: () => o });
        var i = n(1601),
            r = n.n(i),
            a = n(6314),
            s = n.n(a)()(r());
        s.push([
            e.id,
            "\n.input-visualizer {\n    position: absolute;\n    left: var(--safe-area-horizontal);\n    bottom: 64px;\n    margin: 10px;\n    padding: 0;\n    --size: 96px;\n    width: calc(var(--size) * 3);\n    height: calc(var(--size) * 2);\n    opacity: 0.9;\n}\n\n.input-visualizer > div {\n    position: absolute;\n    margin: 0;\n    padding: 0;\n    width: var(--size);\n    height: var(--size);\n    background-color: var(--surface-color);\n}\n\n.input-visualizer > .arrow-up {\n    left: var(--size);\n    top: 0;\n}\n\n.input-visualizer > .arrow-right {\n    left: calc(var(--size) * 2);\n    top: var(--size);\n}\n\n.input-visualizer > .arrow-down {\n    left: var(--size);\n    top: var(--size);\n}\n\n.input-visualizer > .arrow-left {\n    left: 0;\n    top: var(--size);\n}\n\n.input-visualizer > div.active {\n    background-color: var(--surface-tertiary-color);\n}\n\n.input-visualizer > div > img {\n    margin: 0;\n    padding: 20px;\n    width: 100%;\n    height: 100%;\n    box-sizing: border-box;\n}\n.input-visualizer > div.active > img {\n    padding: 25px;\n}",
            "",
        ]);
        const o = s;
    },
    1601: (e) => {
        "use strict";
        e.exports = function (e) {
            return e[1];
        };
    },
    1643: (e, t, n) => {
        "use strict";
        n.d(t, { A: () => o });
        var i = n(1601),
            r = n.n(i),
            a = n(6314),
            s = n.n(a)()(r());
        s.push([
            e.id,
            '\n.settings-menu {\n\tposition: absolute;\n\tleft: calc(50% - 800px / 2);\n\ttop: 0;\n\tz-index: 2;\n\tmargin: 0;\n\tpadding: 0;\n\twidth: 800px;\n\theight: 100%;\n\ttext-align: left;\n\tdisplay: flex;\n\tflex-direction: column;\n\tbackground-color: var(--surface-color);\n}\n\n.settings-menu > h2 {\n\tmargin: 10px;\n\tpadding: 0;\n\tfont-weight: normal;\n\tfont-size: 38px;\n\ttext-align: center;\n\tcolor: var(--text-color);\n}\n\n.settings-menu > .container {\n\tmargin: 0;\n\tpadding: 0;\n\tflex-grow: 1;\n\tbackground-color: var(--surface-secondary-color);\n\toverflow-y: scroll;\n\tpointer-events: auto;\n}\n\n.settings-menu > .container > h2 {\n\tmargin: 10px;\n\tpadding: 4px;\n\tfont-weight: normal;\n\tfont-size: 24px;\n\tcolor: var(--text-color);\n\tborder-bottom: 2px solid var(--text-color);\n}\n\n.settings-menu > .container > h3 {\n\tmargin: 10px 10px 10px 15px;\n\tpadding: 4px;\n\tfont-weight: normal;\n\tfont-size: 22px;\n\tcolor: var(--text-color);\n\tborder-bottom: 2px solid var(--text-color);\n}\n\n.settings-menu > .container > .setting {\n\tmargin: 10px;\n\tdisplay: flex;\n}\n\n.settings-menu > .container > .setting > p {\n\tdisplay: inline-block;\n\tmargin: 10px;\n\tpadding: 0;\n\tmin-width: 0;\n\toverflow: hidden;\n\ttext-overflow: ellipsis;\n\tflex-grow: 1;\n\tflex-shrink: 0;\n\tfont-size: 28px;\n\ttext-align: left;\n\tcolor: var(--text-color);\n}\n.settings-menu > .container > .setting.key-binding > p {\n\tflex-shrink: 1;\n}\n\n.settings-menu > .container > .setting > .button-wrapper {\n\tmargin-bottom: -8px;\n\tdisplay: flex;\n\tjustify-content: end;\n}\n.settings-menu > .container > .setting:not(.key-binding) > .button-wrapper {\n\tflex-wrap: wrap;\n}\n.settings-menu > .container > .setting.wrappable > .button-wrapper {\n\twhite-space: normal;\n}\n.settings-menu > .container > .setting.wrappable > .button-wrapper > button {\n\twidth: calc(100% / 4);\n\tfont-size: 23px;\n}\n\n.settings-menu > .container > .setting > .button-wrapper > button {\n\tmargin-bottom: 8px;\n\theight: 48px;\n\twhite-space: nowrap;\n}\n.settings-menu > .container > .setting > .button-wrapper > button.selected {\n\tbackground-color: var(--button-hover-color);\n}\n.settings-menu > .container > .setting.key-binding > .button-wrapper > button {\n\twidth: 210px;\n\tfont-size: 22px;\n\toverflow: hidden;\n\ttext-overflow: ellipsis;\n\tvertical-align: top;\n}\n\n.settings-menu > .container > .setting > input[type="range"] {\n\tmargin: 0 20px;\n\twidth: 390px;\n}\n\n.settings-menu > .button-wrapper > .button {\n\tmargin: 10px 0;\n}\n\n.settings-menu > .button-wrapper > .button:first-of-type {\n\tmargin-left: 10px;\n}\n\n.settings-menu > .button-wrapper > .button:last-of-type {\n\tmargin-right: 10px;\n}\n\n.settings-menu > .button-wrapper > .button > img {\n\tmargin-top: -3px;\n}\n\n.settings-menu > .button-wrapper > .apply {\n\tfloat: right;\n}\n',
            "",
        ]);
        const o = s;
    },
    1705: (e, t, n) => {
        "use strict";
        e.exports = n.p + "images/desert.svg";
    },
    1719: (e, t, n) => {
        "use strict";
        e.exports = n.p + "images/reset.svg";
    },
    1734: (e, t, n) => {
        "use strict";
        e.exports = n.p + "images/test.svg";
    },
    1758: (e, t, n) => {
        "use strict";
        e.exports = n.p + "images/desert_colored.svg";
    },
    1784: (e, t, n) => {
        "use strict";
        e.exports = n.p + "images/cancel.svg";
    },
    1903: () => { },
    1925: (e, t, n) => {
        "use strict";
        e.exports = n.p + "images/copy.svg";
    },
    1936: (e, t, n) => {
        "use strict";
        e.exports = n.p + "images/erase.svg";
    },
    1997: (e, t, n) => {
        "use strict";
        n.d(t, { A: () => o });
        var i = n(1601),
            r = n.n(i),
            a = n(6314),
            s = n.n(a)()(r());
        s.push([
            e.id,
            '\n.editor-track-settings > .background {\n\tposition: absolute;\n\tleft: 0;\n\ttop: 0;\n\tz-index: 1;\n\twidth: 100%;\n\theight: 100%;\n\tbackground-color: rgba(20, 20, 30, 0.5);\n\tpointer-events: auto;\n}\n\n.editor-track-settings > .container {\n\tposition: absolute;\n\tleft: calc(50% - 600px / 2);\n\ttop: 0;\n\tz-index: 2;\n\tdisplay: flex;\n\tflex-direction: column;\n\tbox-sizing: border-box;\n\twidth: 600px;\n\theight: 100%;\n\tbackground-color: var(--surface-color);\n}\n\n.editor-track-settings > .container > h1 {\n\tmargin: 10px;\n\tpadding: 0;\n\tfont-weight: normal;\n\tfont-size: 38px;\n\ttext-align: center;\n\tcolor: var(--text-color);\n}\n\n.editor-track-settings > .container > .content {\n\tflex-grow: 1;\n\tbackground-color: var(--surface-secondary-color);\n\toverflow-y: auto;\n\tpointer-events: auto;\n}\n\n.editor-track-settings > .container > .content > .setting {\n\tmargin: 20px;\n\tpadding: 20px;\n\tbackground-color: var(--surface-color);\n\toutline: 2px solid transparent;\n\ttransition: outline 0.25s ease-in-out;\n}\n\n.editor-track-settings > .container > .content > .setting.error {\n\toutline: 2px solid #e34c4c;\n}\n\n.editor-track-settings > .container > .content > .setting > .title {\n\tdisplay: block;\n\tmargin: 0;\n\tpadding: 0;\n\tfont-size: 30px;\n\tcolor: var(--text-color);\n}\n.editor-track-settings > .container > .content > .setting > input[type="text"] {\n\twidth: calc(100% - 20px);\n\tfont-weight: normal;\n\tfont-size: 30px;\n}\n\n.editor-track-settings > .container > .content > .setting > .environment-button {\n\tdisplay: inline-block;\n\tmargin: 10px 0;\n\tpadding: 10px;\n\twidth: calc(100% / 3);\n\tcolor: var(--text-color);\n\tfont-size: 27px;\n}\n.editor-track-settings > .container > .content > .setting > .environment-button.selected {\n\tbackground-color: var(--button-hover-color);\n}\n.editor-track-settings > .container > .content > .setting > .environment-button > img {\n\tmargin: 0;\n\tpadding: 10px 30px;\n\twidth: 100%;\n\tbox-sizing: border-box;\n\tpointer-events: none;\n}\n\n.editor-track-settings > .container > .content > .setting > input[type="range"] {\n\tmargin: 0;\n\tpadding: 0;\n\twidth: 100%;\n\theight: 64px;\n\t-webkit-appearance: none;\n\tappearance: none;\n\tbackground: transparent;\n\tcursor: pointer;\n\taccent-color: var(--text-color);\n}\n.editor-track-settings > .container > .content > .setting > input[type="range"]::-webkit-slider-runnable-track {\n\tbackground-color: var(--surface-tertiary-color);\n\theight: 10px;\n}\n.editor-track-settings > .container > .content > .setting > input[type="range"]::-moz-range-track {\n\tbackground-color: var(--surface-tertiary-color);\n\theight: 10px;\n}\n.editor-track-settings > .container > .content > .setting > input[type="range"]::-webkit-slider-thumb {\n\t-webkit-appearance: none;\n\tappearance: none;\n\tborder-radius: 0;\n\tbackground: var(--text-color);\n\twidth: 32px;\n\theight: 32px;\n\tmargin: -13px 0 0 0;\n\tborder: 4px solid var(--button-color);\n\toutline: 2px solid var(--text-color);\n}\n.editor-track-settings > .container > .content > .setting > input[type="range"]::-webkit-slider-thumb:hover {\n\tborder: 4px solid var(--button-hover-color);\n}\n@media (hover: none) {\n\t.editor-track-settings > .container > .content > .setting > input[type="range"]::-webkit-slider-thumb:hover {\n\t\tborder: 4px solid var(--button-color);\n\t}\n}\n.editor-track-settings > .container > .content > .setting > input[type="range"]::-webkit-slider-thumb:active {\n\tborder: 4px solid var(--button-active-color);\n}\n.editor-track-settings > .container > .content > .setting > input[type="range"]::-moz-range-thumb {\n\t-webkit-appearance: none;\n\tappearance: none;\n\tborder-radius: 0;\n\tbackground: var(--text-color);\n\twidth: 24px;\n\theight: 24px;\n\tborder: 4px solid var(--button-color);\n\toutline: 2px solid var(--text-color);\n}\n.editor-track-settings > .container > .content > .setting > input[type="range"]::-moz-range-thumb:hover {\n\tborder: 4px solid var(--button-hover-color);\n}\n@media (hover: none) {\n\t.editor-track-settings > .container > .content > .setting > input[type="range"]::-moz-range-thumb:hover {\n\t\tborder: 4px solid var(--button-color);\n\t}\n}\n.editor-track-settings > .container > .content > .setting > input[type="range"]::-moz-range-thumb:active {\n\tborder: 4px solid var(--button-active-color);\n}\n\n\n.editor-track-settings > .container > .button-wrapper > button {\n\tmargin: 10px;\n}\n\n.editor-track-settings > .container > .button-wrapper > button:not(:first-child) {\n\tfloat: right;\n}\n',
            "",
        ]);
        const o = s;
    },
    2175: (e, t, n) => {
        "use strict";
        e.exports = n.p + "images/random.svg";
    },
    2207: (e, t, n) => {
        "use strict";
        e.exports = n.p + "images/arrow_up.svg";
    },
    2208: (e, t, n) => {
        "use strict";
        e.exports = n.p + "forced_square.woff";
    },
    2319: (e, t, n) => {
        "use strict";
        e.exports = n.p + "images/delete.svg";
    },
    2344: (e, t, n) => {
        "use strict";
        e.exports = n.p + "images/car_stripe.svg";
    },
    2346: (e, t, n) => {
        "use strict";
        n.d(t, { A: () => o });
        var i = n(1601),
            r = n.n(i),
            a = n(6314),
            s = n.n(a)()(r());
        s.push([
            e.id,
            "\n.editor-side-toolbar {\n\tdisplay: flex;\n\tflex-direction: column;\n\tposition: absolute;\n\tbottom: 40px;\n\tleft: var(--safe-area-left);\n}\n.editor-side-toolbar.touch {\n\tbottom: 176px;\n}\n\n.editor-side-toolbar > .accordion {\n\tdisplay: flex;\n\tflex-direction: row;\n\twidth: 100px;\n\toverflow: hidden; /* Use hidden if clip is not supported */\n\toverflow: clip;\n\ttransition: width 0.25s ease-out;\n}\n.editor-side-toolbar.touch > .accordion {\n\twidth: 120px;\n}\n.editor-side-toolbar > .accordion.open {\n\twidth: auto;\n}\n\n.editor-side-toolbar button {\n\tposition: relative;\n\tflex-shrink: 0;\n\tmargin: 0;\n\tpadding: 0;\n\twidth: 100px;\n\theight: 100px;\n\tbackground-color: rgba(17, 32, 82, 0.48);\n\tborder: none;\n\tpointer-events: auto;\n\tcursor: pointer;\n\ttransition: background-color 0.25s ease-out;\n}\n.editor-side-toolbar button:hover {\n\tbackground-color: rgba(37, 54, 105, 0.48);\n}\n.editor-side-toolbar > .accordion > button:not(:first-of-type) {\n\tbackground-color: rgba(17, 32, 82, 0.35);\n}\n.editor-side-toolbar > .accordion > button:not(:first-of-type):hover {\n\tbackground-color: rgba(37, 54, 105, 0.35);\n}\n.editor-side-toolbar > .accordion > button:not(:first-of-type).selected {\n\tbackground-color: rgba(17, 32, 82, 0.55);\n}\n.editor-side-toolbar > .accordion > button:not(:first-of-type):active {\n\tbackground-color: rgba(17, 32, 82, 0.6);\n}\n@media (hover: none) {\n\t.editor-side-toolbar button:hover {\n\t\tbackground-color: rgba(17, 32, 82, 0.48);\n\t}\n}\n.editor-side-toolbar button:active {\n\tbackground-color: rgba(17, 32, 82, 0.6);\n\ttransition: none;\n}\n\n.editor-side-toolbar.touch button {\n\twidth: 120px;\n\theight: 120px;\n}\n\n.editor-side-toolbar button img {\n\tmargin: 0;\n\tpadding: 20%;\n\tvertical-align: top;\n\twidth: 100%;\n    height: 100%;\n\tbox-sizing: border-box;\n\tpointer-events: none;\n\ttransition: transform 0.25s ease-out;\n\tfilter: drop-shadow(2px 2px 2px rgba(0, 0, 0, 0.5));\n}\n.editor-side-toolbar button:active img {\n\ttransition: none;\n\ttransform: scale(0.9);\n}\n\n.editor-side-toolbar button.rotate > span {\n\tdisplay: flex;\n\tjustify-content: center;\n\talign-items: center;\n\tposition: absolute;\n\ttop: 0;\n\tleft: 1px;\n\twidth: 100%;\n\theight: 100%;\n\tcolor: var(--text-color);\n\tfont-size: 16px;\n\ttext-shadow: 0 0 2px #000;\n\tpointer-events: none;\n\ttransition: transform 0.25s ease-out;\n}\n.editor-side-toolbar button.rotate:active > span {\n\ttransition: none;\n\ttransform: scale(0.9);\n}\n",
            "",
        ]);
        const o = s;
    },
    2493: (e, t, n) => {
        "use strict";
        e.exports = n.p + "images/overlapping_enabled.svg";
    },
    2553: (e, t, n) => {
        "use strict";
        e.exports = n.p + "images/state_invalid.svg";
    },
    2709: (e, t, n) => {
        "use strict";
        e.exports = n.p + "images/custom_tracks.jpg";
    },
    2796: (e, t, n) => {
        "use strict";
        n.d(t, { A: () => o });
        var i = n(1601),
            r = n.n(i),
            a = n(6314),
            s = n.n(a)()(r());
        s.push([
            e.id,
            '\n.verifier-ui {\n\tposition: absolute;\n\tleft: 0;\n\ttop: 0;\n\tz-index: 2;\n\tmargin: 0;\n\tpadding: 16px;\n\twidth: 100%;\n\theight: 100%;\n\toverflow-y: scroll;\n\tbox-sizing: border-box;\n\tbackground-color: var(--surface-color);\n\tpointer-events: auto;\n}\n\n.verifier-ui > p {\n\tmargin: 16px 4px 0 4px;\n\tpadding: 0;\n\tfont-size: 20px;\n\tcolor: var(--text-color);\n\twhite-space: pre-wrap;\n}\n\n.verifier-ui > input[type="range"] {\n\tmargin: 16px 0;\n\twidth: 390px;\n}\n\n.verifier-ui > table {\n\tmargin: 0;\n\tpadding: 0;\n\twidth: 100%;\n\tborder-collapse: collapse;\n\ttable-layout: fixed;\n\tcolor: var(--text-color);\n}\n\n.verifier-ui > table > thead > tr > th {\n\ttext-align: left;\n\tborder-bottom: 2px solid var(--text-color);\n}\n\n.verifier-ui > table > thead > tr > th, .verifier-ui > table > tbody > tr > td {\n\tpadding: 8px 0;\n\toverflow: hidden;\n\ttext-overflow: ellipsis;\n\twhite-space: nowrap;\n}\n\n.verifier-ui > button {\n\tdisplay: inline-block;\n\tmargin: 16px 0 0 0;\n}\n',
            "",
        ]);
        const o = s;
    },
    2817: (e, t, n) => {
        "use strict";
        n.d(t, { A: () => o });
        var i = n(1601),
            r = n.n(i),
            a = n(6314),
            s = n.n(a)()(r());
        s.push([
            e.id,
            "\n.time-announcer {\n\tposition: absolute;\n\tleft: 0;\n\ttop: 35%;\n\twidth: 100%;\n\toverflow: hidden;\n}\n\n.time-announcer > .record {\n\tmargin: 0;\n\tpadding: 0;\n\tfont-size: 48px;\n\ttext-shadow: 0 0 5px #000;\n\tcolor: #5f5;\n\ttext-align: center;\n\topacity: 0;\n\tanimation: 0.3s ease-out 0.8s 1 normal forwards running time-announcer-record-animation;\n}\n\n.time-announcer > .track-name {\n\tmargin: 0 0 10px 0;\n\tpadding: 4px 20px;\n\tbox-sizing: border-box;\n\twidth: 100%;\n\tbackground-color: var(--surface-secondary-color);\n\tfont-size: 60px;\n\tcolor: var(--text-color);\n\ttext-align: center;\n\toverflow: hidden;\n\ttext-overflow: ellipsis;\n\tanimation: 0.3s ease-out 0s 1 normal forwards running time-announcer-animation;\n}\n\n.time-announcer > .current {\n\tmargin: 0;\n\tpadding: 0;\n\twidth: 0;\n\tbackground-color: var(--surface-color);\n\tfont-size: 48px;\n\tcolor: var(--text-color);\n\ttext-align: center;\n\tanimation: 0.5s ease-out 0s 1 normal forwards running time-announcer-animation;\n}\n.time-announcer > .difference > p {\n\tmargin: 0 0 0 auto;\n\tpadding: 0;\n\twidth: 0;\n\tbackground-color: var(--surface-secondary-color);\n\tcolor: #5f5;\n\tfont-size: 30px;\n\ttext-align: center;\n\tanimation: 0.4s ease-out 0.5s 1 normal forwards running time-announcer-animation;\n}\n.time-announcer > .difference.red > p {\n\tcolor: #f55;\n}\n.time-announcer > .difference > p.title {\n\tmargin-top: 30px;\n\tbackground-color: transparent;\n\ttext-shadow: 0 0 3px #000;\n}\n\n@keyframes time-announcer-record-animation {\n\tfrom {\n\t\topacity: 0;\n\t\ttransform: translateY(10px);\n\t}\n\n\tto {\n\t\topacity: 1;\n\t}\n}\n\n@keyframes time-announcer-animation {\n\tfrom {\n\t\twidth: 0;\n\t\topacity: 0;\n\t}\n\n\tto {\n\t\twidth: 100%;\n\t\topacity: 1;\n\t}\n}\n",
            "",
        ]);
        const o = s;
    },
    2832: (e, t, n) => {
        "use strict";
        e.exports = n.p + "forced_square.ttf";
    },
    2915: (e, t, n) => {
        "use strict";
        n.d(t, { A: () => o });
        var i = n(1601),
            r = n.n(i),
            a = n(6314),
            s = n.n(a)()(r());
        s.push([
            e.id,
            "\n.menu {\n\tdisplay: flex;\n\tflex-direction: column;\n\tposition: absolute;\n\tleft: 0;\n\ttop: 0;\n\twidth: 100%;\n\theight: 100%;\n\tbackground-color: rgba(10, 10, 20, 0.8);\n\ttext-align: center;\n\ttransition: background-color 1s ease-out;\n}\n.menu.loading-screen {\n\tbackground-color: var(--surface-tertiary-color);\n}\n\n.menu > .logo {\n\tdisplay: block;\n\tmargin: 80px auto 0 auto;\n\tpadding: 0;\n\twidth: 1000px;\n\theight: 200px;\n\t-webkit-filter: drop-shadow(0 0 3px #000);\n\tfilter: drop-shadow(0 0 3px #000);\n\ttransition: opacity 0.25s ease-out;\n}\n.menu > .logo.hidden {\n\topacity: 0;\n}\n\n@media (max-width: 1300px) {\n\t.menu > .logo {\n\t\twidth: calc(100vw * (1000 / 1300));\n\t}\n}\n@media (max-width: 975px) {\n\t.menu > .logo {\n\t\twidth: calc(975px * (1000 / 1300));\n\t}\n}\n\n.menu > .warning-message {\n\tmargin: 16px auto 0 auto;\n\tmax-width: 900px;\n\tfont-size: 26px;\n\tcolor: #f66;\n}\n.menu > .warning-message > a {\n\tmargin: 0 auto;\n\tdisplay: block;\n\twidth: max-content;\n\tcolor: var(--text-color);\n\tpointer-events: auto;\n}\n\n.menu > .main-buttons-container {\n\tmargin: 0 0 140px 0;\n\tdisplay: flex;\n\tflex-grow: 1;\n\talign-items: center;\n\tjustify-content: center;\n}\n.menu > .main-buttons-container.hidden {\n\tdisplay: none;\n}\n\n.menu .button-image {\n\tdisplay: inline-block;\n\tmargin: 10px 0;\n\tpadding: 0;\n\twidth: 200px;\n\theight: 200px;\n\tpointer-events: auto;\n}\n.menu .button-image > img {\n\tmargin: 40px 40px 0 40px;\n\tpadding: 0;\n\twidth: 96px;\n\theight: 96px;\n\ttransition: transform 0.2s ease-in-out;\n\tpointer-events: none;\n}\n.menu .button-image:not(:disabled):hover > img {\n\ttransform: translateY(-10px);\n}\n@media (hover: none) {\n\t.menu .button-image:not(:disabled):hover > img {\n\t\ttransform: none;\n\t}\n}\n.menu .button-image > p {\n\tmargin: 0;\n\tpadding: 0;\n\tcolor: var(--text-color);\n\tfont-size: 27px;\n}\n\n.menu .button-image.button-spawn {\n\tanimation: button-spawn 0.5s ease-out forwards;\n\topacity: 0;\n}\n\n@keyframes button-spawn {\n\t0% {\n\t\ttransform: translateY(50px) scale(0.8);\n\t\topacity: 0;\n\t}\n\t70% {\n\t\ttransform: translateY(-10px) scale(1);\n\t\topacity: 1;\n\t}\n\t100% {\n\t\ttransform: translateY(0) scale(1);\n\t\topacity: 1;\n\t}\n}\n\n.menu > .bottom-buttons {\n\tmargin: 8px 8px 8px calc(8px + var(--safe-area-left));\n\tpadding: 0;\n\tposition: absolute;\n\tleft: 0;\n\tbottom: 0;\n}\n\n.menu > .bottom-buttons > .small {\n\tpadding: 6px 12px;\n\tclip-path: polygon(4px 0, 100% 0, calc(100% - 4px) 100%, 0 100%);\n\tfont-size: 22px;\n}\n.menu > .bottom-buttons > .small > img {\n\tvertical-align: middle;\n\twidth: 24px;\n\theight: 24px;\n}\n\n.menu > .discord-link {\n\tdisplay: block;\n\tposition: absolute;\n\tright: 0;\n\tbottom: 0;\n\tmargin: 0;\n\tpadding: 0;\n\tpointer-events: auto;\n}\n.menu > .discord-link > img {\n\tmargin: 16px calc(30px + var(--safe-area-right)) 16px 30px;\n\tpadding: 0;\n\theight: 40px;\n\ttransition: opacity 0.25s ease-out;\n}\n.menu > .discord-link > img.hidden {\n\topacity: 0;\n}\n\n.menu > .info {\n\tposition: absolute;\n\tleft: 0;\n\tbottom: 16px;\n\twidth: 100%;\n}\n.menu > .info > a {\n\tdisplay: block;\n\tmargin: 0 auto;\n\tpadding: 5px;\n\twidth: fit-content;\n\tcolor: var(--text-color);\n\ttext-decoration: none;\n\tfont-size: 20px;\n\tpointer-events: auto;\n}\n.menu > .info > a[href]:hover, .menu > .info > a[href]:focus-visible {\n\ttext-decoration: underline;\n\toutline: none;\n}\n",
            "",
        ]);
        const o = s;
    },
    2927: (e, t, n) => {
        "use strict";
        n.d(t, { A: () => o });
        var i = n(1601),
            r = n.n(i),
            a = n(6314),
            s = n.n(a)()(r());
        s.push([
            e.id,
            "\n.loading-ui {\n\tmargin: 200px 0 0 0;\n\tpadding: 0;\n}\n.loading-ui.fade-out {\n\topacity: 0;\n\ttransition: opacity 0.25s ease-out;\n}\n\n.loading-ui > p {\n\tmargin: 5px;\n\tpadding: 0;\n\tcolor: var(--text-color);\n\tfont-size: 32px;\n}\n\n.loading-ui > div {\n\tmargin: 0 auto;\n\tpadding: 0;\n\twidth: 600px;\n\theight: 50px;\n\tbackground-color: var(--surface-color);\n\tclip-path: polygon(9px 0, 100% 0, calc(100% - 9px) 100%, 0 100%);\n\toverflow: hidden;\n}\n\n.loading-ui > div > div {\n\tmargin: 15px 20px;\n\tpadding: 0;\n\twidth: 560px;\n\theight: 20px;\n\tclip-path: polygon(3px 0, 100% 0, calc(100% - 3px) 100%, 0 100%);\n\tbackground-color: #224;\n\tbox-shadow: inset 0 0 6px #000;\n}\n\n.loading-ui > div > div > div {\n\tmargin: 0;\n\tpadding: 0;\n\twidth: 0;\n\theight: 100%;\n\tclip-path: polygon(2px 0, 100% 0, calc(100% - 2px) 100%, 0 100%);\n\tbackground-color: #fff;\n\tbox-shadow: inset 0 0 6px #000;\n\ttransition: width 0.1s ease-in-out;\n}\n",
            "",
        ]);
        const o = s;
    },
    3144: (e, t, n) => {
        "use strict";
        e.exports = n.p + "images/undo.svg";
    },
    3223: (e, t, n) => {
        "use strict";
        e.exports = n.p + "images/pending.svg";
    },
    3518: (e, t, n) => {
        "use strict";
        e.exports = n.p + "images/grid_large.svg";
    },
    3571: (e, t, n) => {
        "use strict";
        n.d(t, { A: () => u });
        var i = n(1601),
            r = n.n(i),
            a = n(6314),
            s = n.n(a),
            o = n(4417),
            l = n.n(o),
            c = new URL(n(5148), n.b),
            h = s()(r()),
            d = l()(c);
        h.push([
            e.id,
            `\n.touch-controls {\n\tpointer-events: none;\n}\n\n.touch-controls > button {\n\tposition: absolute;\n\ttop: calc(1.5cm + 50px);\n\tmargin: 10px;\n\tpadding: 0;\n\twidth: 160px;\n\theight: 160px;\n\tbackground-color: var(--button-color);\n\tborder: none;\n\topacity: 0.6;\n\tpointer-events: auto;\n\ttouch-action: none;\n}\n.touch-controls > button  > img {\n\tmargin: 0;\n\tpadding: 30px;\n\tvertical-align: top;\n\twidth: 100%;\n    height: 100%;\n\tbox-sizing: border-box;\n\tpointer-events: none;\n\ttransition: transform 0.25s ease-out;\n}\n.touch-controls > button.active > img {\n    transform: scale(0.9);\n}\n\n.touch-controls > .camera {\n\tleft: 1.5cm;\n}\n\n.touch-controls > .reset.checkpoint-available {\n\tbackground-image: url(${d});\n\tbackground-position: 71px 64px;\n\tbackground-size: 32px;\n\tbackground-repeat: no-repeat;\n}\n.touch-controls > .reset {\n\tright: 1.5cm;\n}\n\n.touch-controls > .left-container {\n\tposition: absolute;\n\tleft: 1.5cm;\n\tbottom: 1.5cm;\n}\n\n.touch-controls > .right-container {\n\tposition: absolute;\n\tright: 1.5cm;\n\tbottom: 1.5cm;\n}\n.touch-controls > div.steering > div {\n\tdisplay: inline-block;\n}\n\n.touch-controls > div > div {\n\tmargin: 10px;\n\tpadding: 0;\n\twidth: 160px;\n\theight: 160px;\n\tbackground-color: var(--button-color);\n\topacity: 0.5;\n\tpointer-events: auto;\n\ttouch-action: none;\n}\n.touch-controls > div > div.active {\n\tbackground-color: var(--button-active-color);\n\topacity: 0.6;\n}\n\n.touch-controls > div > div > img {\n\tmargin: 0;\n\tpadding: 40px;\n\tvertical-align: top;\n\twidth: 100%;\n    height: 100%;\n\tbox-sizing: border-box;\n\tpointer-events: none;\n}\n.touch-controls > div > div.active > img {\n    padding: 50px;\n}\n`,
            "",
        ]);
        const u = h;
    },
    3682: (e, t, n) => {
        "use strict";
        e.exports = n.p + "forced_square.woff2";
    },
    3693: (e, t, n) => {
        "use strict";
        var i, r;
        n.d(t, { _: () => r, k: () => i }),
            (function (e) {
                (e.Heavy = "HEAVY"), (e.Medium = "MEDIUM"), (e.Light = "LIGHT");
            })(i || (i = {})),
            (function (e) {
                (e.Success = "SUCCESS"),
                    (e.Warning = "WARNING"),
                    (e.Error = "ERROR");
            })(r || (r = {}));
    },
    3755: (e, t, n) => {
        "use strict";
        e.exports = n.p + "images/share.svg";
    },
    3849: (e, t, n) => {
        "use strict";
        e.exports = n.p + "images/timer.svg";
    },
    3895: (e, t, n) => {
        "use strict";
        e.exports = n.p + "images/rotation_axis_z_negative.svg";
    },
    3901: (e, t, n) => {
        "use strict";
        e.exports = n.p + "images/summer.svg";
    },
    3902: (e, t, n) => {
        "use strict";
        e.exports = n.p + "images/verified.svg";
    },
    4239: (e, t, n) => {
        "use strict";
        n.d(t, { A: () => o });
        var i = n(1601),
            r = n.n(i),
            a = n(6314),
            s = n.n(a)()(r());
        s.push([
            e.id,
            ".ghost-loading-ui {\n\tposition: absolute;\n\tright: 0;\n\ttop: 0;\n\tmargin: 4px;\n\tcolor: var(--text-color);\n\tfont-size: 22px;\n\tfont-weight: normal;\n\ttext-shadow: 1px 1px 1px var(--surface-color), -1px 1px 1px var(--surface-color), -1px -1px 1px var(--surface-color), 1px -1px 1px var(--surface-color);\n\ttransition: opacity 0.25s ease-in-out;\n}\n.ghost-loading-ui.hide {\n\topacity: 0;\n\ttransform: translateX(20px);\n\ttransition: opacity 0.25s ease-in-out 0.5s, transform 0.25s ease-in-out 0.5s;\n}\n.ghost-loading-ui.down {\n\ttop: initial;\n\tbottom: 0;\n}\n\n.ghost-loading-ui > .percentage {\n\tdisplay: inline-block;\n\twidth: 60px;\n\ttext-align: center;\n}\n",
            "",
        ]);
        const o = s;
    },
    4309: (e, t, n) => {
        "use strict";
        e.exports = n.p + "images/save.svg";
    },
    4344: (e, t, n) => {
        "use strict";
        n.d(t, { A: () => o });
        var i = n(1601),
            r = n.n(i),
            a = n(6314),
            s = n.n(a)()(r());
        s.push([
            e.id,
            "\n.debug {\n\tmargin: 0.25em;\n\tpadding: 0;\n\tposition: absolute;\n\tleft: 0;\n\tbottom: 0;\n\tfont-size: 28px;\n\ttext-shadow: 0 0 5px #000;\n\tcolor: #fff;\n\tz-index: 10;\n}\n",
            "",
        ]);
        const o = s;
    },
    4394: () => { },
    4411: (e, t, n) => {
        "use strict";
        e.exports = n.p + "images/rotation_axis_z_positive.svg";
    },
    4417: (e) => {
        "use strict";
        e.exports = function (e, t) {
            return (
                t || (t = {}),
                e
                    ? ((e = String(e.__esModule ? e.default : e)),
                        /^['"].*['"]$/.test(e) && (e = e.slice(1, -1)),
                        t.hash && (e += t.hash),
                        /["'() \t\n]|(%20)/.test(e) || t.needQuotes
                            ? '"'.concat(
                                e.replace(/"/g, '\\"').replace(/\n/g, "\\n"),
                                '"'
                            )
                            : e)
                    : e
            );
        };
    },
    4538: (e, t, n) => {
        "use strict";
        n.d(t, { A: () => o });
        var i = n(1601),
            r = n.n(i),
            a = n(6314),
            s = n.n(a)()(r());
        s.push([
            e.id,
            "\n.pause-screen {\n\tposition: fixed;\n\ttop: 0;\n\tleft: 0;\n\twidth: 100%;\n\theight: 100%;\n\tbackground-color: rgba(0, 0, 0, 0.75);\n\tanimation: fade-in 0.25s forwards;\n}\n.pause-screen.fade-out {\n\topacity: 0;\n\ttransition: opacity 0.25s;\n}\n\n@keyframes fade-in {\n\tfrom {\n\t\tbackground-color: rgba(0, 0, 0, 0);\n\t}\n\tto {\n\t\tbackground-color: rgba(0, 0, 0, 0.75);\n\t}\n}\n\n\n.pause-screen > .title {\n\tposition: absolute;\n\ttop: 40%;\n\tleft: 50%;\n\ttransform: translate(-50%, -50%);\n\tfont-size: 100px;\n\tcolor: var(--text-color);\n\tanimation: slide-fade-in 0.5s 0.3s forwards;\n\topacity: 0;\n}\n\n@keyframes slide-fade-in {\n\tfrom {\n\t\ttransform: translate(-60%, -50%);\n\t\topacity: 0;\n\t}\n\tto {\n\t\ttransform: translate(-50%, -50%);\n\t\topacity: 1;\n\t}\n}\n",
            "",
        ]);
        const o = s;
    },
    4543: (e, t, n) => {
        "use strict";
        n.d(t, { A: () => o });
        var i = n(1601),
            r = n.n(i),
            a = n(6314),
            s = n.n(a)()(r());
        s.push([
            e.id,
            "\n.time-bar {\n\tdisplay: flex;\n\tmargin: 0;\n\tpadding: 0 var(--safe-area-horizontal);\n\tbox-sizing: border-box;\n\twidth: 100%;\n\tbackground-color: var(--surface-color);\n}\n\n.time-bar > button {\n\tmargin: 6px;\n\tpadding: 4px 12px;\n}\n.time-bar > button > img {\n\tmargin: 0 0 2px 0;\n\tpadding: 0;\n\tvertical-align: middle;\n\twidth: 28px;\n\theight: 28px;\n\tpointer-events: none;\n}\n\n.time-bar > .bar {\n\tposition: relative;\n\tmargin: 6px 6px 6px -8px;\n\tpadding: 0;\n\tflex-grow: 1;\n\theight: 40px;\n\tbackground-color: var(--surface-secondary-color);\n\tclip-path: polygon(8px 0, 100% 0, calc(100% - 8px) 100%, 0 100%);\n\ttouch-action: none;\n\tpointer-events: auto;\n}\n.time-bar > .bar > div {\n\tposition: relative;\n\twidth: calc(100% - 8px);\n\theight: 100%;\n}\n.time-bar > .bar > div > .unloaded-fill {\n\tposition: absolute;\n\tright: -8px;\n\ttop: 0;\n\tmargin: 0;\n\tpadding: 0;\n\theight: 100%;\n\tbackground-color: rgba(255, 255, 255, 0.1);\n\tclip-path: polygon(8px 0, 100% 0, calc(100% - 8px) 100%, 0 100%);\n\twill-change: width;\n}\n.time-bar > .bar > div > .fill {\n\tposition: absolute;\n\tleft: 0;\n\ttop: 0;\n\tmargin: 0;\n\tpadding: 0;\n\theight: 100%;\n\tbackground-color: #7272c2;\n\tclip-path: polygon(8px 0, 100% 0, calc(100% - 8px) 100%, 0 100%);\n\twill-change: width;\n}\n.time-bar > .bar > div > .dash-container {\n\tpointer-events: none;\n}\n.time-bar > .bar > div > .dash-container > .dash {\n\tposition: absolute;\n\tz-index: 1;\n\tbottom: 0;\n\tmargin: 0;\n\tpadding: 0;\n\twidth: 2px;\n\theight: 25%;\n\tbackground-color: rgba(0, 0, 0, 0.25);\n}\n.time-bar > .bar > div > .dash-container > .dash.long {\n\theight: 50%;\n\tbackground-color: rgba(0, 0, 0, 0.35);\n}\n.time-bar > .bar > div > .dash-container > .checkpoint-dash {\n\tposition: absolute;\n\tz-index: 1;\n\tbottom: 0;\n\tmargin: 0;\n\tpadding: 0;\n\twidth: calc(8px + 2px);\n\theight: 100%;\n\tclip-path: polygon(calc(100% - 2px) 0, 100% 0, 2px 100%, 0 100%);\n\tbackground-color: #ffff00;\n}\n",
            "",
        ]);
        const o = s;
    },
    4563: (e, t, n) => {
        "use strict";
        e.exports = n.p + "images/rotate.svg";
    },
    4593: (e, t, n) => {
        "use strict";
        e.exports = n.p + "images/reset_settings.svg";
    },
    4804: (e, t, n) => {
        "use strict";
        n.d(t, { A: () => o });
        var i = n(1601),
            r = n.n(i),
            a = n(6314),
            s = n.n(a)()(r());
        s.push([
            e.id,
            "\n.game-toolbar {\n\tposition: absolute;\n\tleft: var(--safe-area-horizontal);\n\tbottom: 0;\n\tz-index: 1;\n\tpadding: 8px 10px;\n\tbackground-color: var(--surface-color);\n\tclip-path: polygon(0 0, 100% 0, calc(100% - 8px) 100%, 0 100%);\n\topacity: 0;\n\ttransform: translateX(-10px);\n\ttransition: opacity 0.2s ease-in-out 0.5s, transform 0.2s ease-in-out 0.5s;\n\tpointer-events: none;\n}\n\n.game-toolbar.up {\n\tposition: absolute;\n\tbottom: auto;\n\ttop: 0;\n}\n\n#ui.has-safe-area-horizontal .game-toolbar {\n\tpadding-right: 16px;\n\tclip-path: polygon(10px 0, calc(100% - 8px) 0, 100% 100%, 0 100%);\n}\n#ui.has-safe-area-horizontal .game-toolbar.up {\n\tpadding-left: 16px;\n\tclip-path: polygon(0 0, 100% 0, calc(100% - 8px) 100%, 8px 100%);\n}\n\n.game-toolbar.touch > .button {\n\tfont-size: 24px;\n}\n.game-toolbar.touch > .button > img {\n\twidth: 24px;\n\theight: 24px;\n}\n\n.game-toolbar.visible {\n\topacity: 1;\n\ttransform: translateX(0);\n\ttransition: opacity ease-in-out 0.2s, transform ease-in-out 0.2s;\n\tpointer-events: auto;\n}\n",
            "",
        ]);
        const o = s;
    },
    4930: (e, t, n) => {
        "use strict";
        e.exports = n.p + "images/grid_small.svg";
    },
    4942: (e, t, n) => {
        "use strict";
        e.exports = n.p + "images/redo.svg";
    },
    5001: (e, t, n) => {
        "use strict";
        e.exports = n.p + "images/rotation_axis_x_negative.svg";
    },
    5007: (e, t, n) => {
        "use strict";
        n.d(t, { A: () => o });
        var i = n(1601),
            r = n.n(i),
            a = n(6314),
            s = n.n(a)()(r());
        s.push([
            e.id,
            "\n.editor-height-selector {\n\tposition: absolute;\n\tleft: var(--safe-area-left);\n\tbottom: 0;\n}\n\n.editor-height-selector > .buttons {\n\tdisplay: inline-block;\n\tvertical-align: bottom;\n}\n.editor-height-selector > .buttons > button {\n\tdisplay: block;\n\tmargin: 0;\n\tpadding: 0;\n\tborder: none;\n\tbackground-color: var(--button-color);\n\tpointer-events: auto;\n\tcursor: pointer;\n}\n.editor-height-selector > .buttons > button:hover {\n\tbackground-color: var(--button-hover-color);\n}\n.editor-height-selector > .buttons > button:active {\n\tbackground-color: var(--button-active-color);\n}\n@media (hover: none) {\n\t.editor-height-selector > .buttons > button:hover {\n\t\tbackground-color: var(--button-color);\n\t}\n}\n\n.editor-height-selector > .buttons > button > img { \n\tmargin: 0;\n\tpadding: 0 6px;\n\twidth: 20px;\n\theight: 20px;\n\tvertical-align: bottom;\n\tpointer-events: none;\n}\n.editor-height-selector.touch > .buttons > button > img {\n\tpadding: 24px;\n\twidth: 40px;\n\theight: 40px;\n}\n\n.editor-height-selector > p {\n\tmargin: 0;\n\tpadding: 0 10px;\n\tdisplay: inline-block;\n\tvertical-align: bottom;\n\tline-height: 40px;\n\tmin-width: 140px;\n\tfont-size: 26px;\n\ttext-align: center;\n\tbackground-color: var(--surface-transparent-color);\n\tcolor: var(--text-color);\n}\n.editor-height-selector.touch > p {\n\tline-height: calc((40px + 2 * 24px) * 2);\n}\n",
            "",
        ]);
        const o = s;
    },
    5010: (e, t, n) => {
        "use strict";
        e.exports = n.p + "images/winter_colored.svg";
    },
    5031: (e, t, n) => {
        "use strict";
        e.exports = n.p + "images/help.svg";
    },
    5056: (e, t, n) => {
        "use strict";
        e.exports = function (e) {
            var t = n.nc;
            t && e.setAttribute("nonce", t);
        };
    },
    5072: (e) => {
        "use strict";
        var t = [];
        function n(e) {
            for (var n = -1, i = 0; i < t.length; i++)
                if (t[i].identifier === e) {
                    n = i;
                    break;
                }
            return n;
        }
        function i(e, i) {
            for (var a = {}, s = [], o = 0; o < e.length; o++) {
                var l = e[o],
                    c = i.base ? l[0] + i.base : l[0],
                    h = a[c] || 0,
                    d = "".concat(c, " ").concat(h);
                a[c] = h + 1;
                var u = n(d),
                    p = {
                        css: l[1],
                        media: l[2],
                        sourceMap: l[3],
                        supports: l[4],
                        layer: l[5],
                    };
                if (-1 !== u) t[u].references++, t[u].updater(p);
                else {
                    var f = r(p, i);
                    (i.byIndex = o),
                        t.splice(o, 0, { identifier: d, updater: f, references: 1 });
                }
                s.push(d);
            }
            return s;
        }
        function r(e, t) {
            var n = t.domAPI(t);
            n.update(e);
            return function (t) {
                if (t) {
                    if (
                        t.css === e.css &&
                        t.media === e.media &&
                        t.sourceMap === e.sourceMap &&
                        t.supports === e.supports &&
                        t.layer === e.layer
                    )
                        return;
                    n.update((e = t));
                } else n.remove();
            };
        }
        e.exports = function (e, r) {
            var a = i((e = e || []), (r = r || {}));
            return function (e) {
                e = e || [];
                for (var s = 0; s < a.length; s++) {
                    var o = n(a[s]);
                    t[o].references--;
                }
                for (var l = i(e, r), c = 0; c < a.length; c++) {
                    var h = n(a[c]);
                    0 === t[h].references && (t[h].updater(), t.splice(h, 1));
                }
                a = l;
            };
        };
    },
    5086: (e, t, n) => {
        "use strict";
        n.d(t, { A: () => o });
        var i = n(1601),
            r = n.n(i),
            a = n(6314),
            s = n.n(a)()(r());
        s.push([
            e.id,
            "\n.loading-spinner {\n\twidth: 40px;\n\theight: 40px;\n\tborder-radius: 50%;\n\tborder: 5px solid var(--surface-tertiary-color);\n\tborder-left-color: var(--text-color);\n\n\tanimation: 1s linear infinite forwards loading-spinner-spin;\n}\n\n@keyframes loading-spinner-spin {\n\tfrom {\n\t\ttransform: rotate(0);\n\t}\n\tto {\n\t\ttransform: rotate(360deg);\n\t}\n}\n",
            "",
        ]);
        const o = s;
    },
    5140: (e, t, n) => {
        "use strict";
        n.d(t, { A: () => o });
        var i = n(1601),
            r = n.n(i),
            a = n(6314),
            s = n.n(a)()(r());
        s.push([
            e.id,
            "\n.profile-selection {\n\tposition: absolute;\n\tleft: calc(50% - 500px / 2);\n\ttop: 40%;\n\tz-index: 2;\n\tmargin: 0;\n\tpadding: 0;\n\twidth: 500px;\n\tbox-sizing: border-box;\n\tbackground-color: var(--surface-secondary-color);\n}\n\n.profile-selection > .top-bar {\n\tmargin: 0;\n\tpadding: 10px;\n\tbackground-color: var(--surface-color);\n}\n\n.profile-selection > .top-bar > h2 {\n\tmargin: 0;\n\tpadding: 0;\n\tfont-weight: normal;\n\tfont-size: 38px;\n\ttext-align: center;\n\tcolor: var(--text-color);\n}\n\n.profile-selection > .slot {\n\tposition: relative;\n\tmargin: 10px 10px 0 10px;\n\tpadding: 0;\n}\n\n.profile-selection > .slot > button.main {\n\tmargin: 0;\n\tpadding: 0;\n\tvertical-align: top;\n\twidth: 100%;\n\theight: 100px;\n\tclip-path: polygon(0 0, 100% 0, calc(100% - 8px) 100%, 0 100%);\n\ttext-align: left;\n\twhite-space: nowrap;\n}\n\n.profile-selection > .slot > button.main.selected {\n\tbackground-color: var(--button-hover-color);\n}\n\n.profile-selection > .slot > button.main > .image-container {\n\tdisplay: inline-block;\n\tposition: relative;\n\tbackground-color: rgba(0, 0, 0, 0.1);\n\twidth: 100px;\n\theight: 100px;\n}\n\n.profile-selection > .slot > button.main > .image-container > img {\n\tposition: absolute;\n\tleft: 0;\n\ttop: 0;\n\twidth: 100%;\n\theight: 100%;\n\tpointer-events: none;\n\topacity: 0;\n\ttransition: opacity 0.5s ease-out;\n}\n.profile-selection > .slot > button.main > .image-container > img.show {\n\topacity: 1;\n}\n\n.profile-selection > .slot > button.main > .name {\n\tdisplay: inline-block;\n\tvertical-align: top;\n\tmargin: 0;\n\tpadding: 12px;\n\tfont-size: 28px;\n\tcolor: var(--text-color);\n\ttext-overflow: ellipsis;\n\toverflow: hidden;\n\twidth: 320px;\n}\n.profile-selection > .slot > button.main > .name.empty {\n\tcolor: #000;\n\topacity: 0.2;\n}\n\n.profile-selection > .bottom-bar {\n\tmargin: 10px 0 0 0;\n\tpadding: 10px;\n\tbackground-color: var(--surface-color);\n}\n\n.profile-selection > .bottom-bar > .button.right {\n\tfloat: right;\n}\n",
            "",
        ]);
        const o = s;
    },
    5148: (e, t, n) => {
        "use strict";
        e.exports = n.p + "images/checkpoint.svg";
    },
    5151: (e, t, n) => {
        "use strict";
        n.d(t, { A: () => o });
        var i = n(1601),
            r = n.n(i),
            a = n(6314),
            s = n.n(a)()(r());
        s.push([
            e.id,
            "\n.speedometer {\n\tdisplay: flex;\n\tflex-direction: column;\n\tposition: absolute;\n\tbottom: 0;\n\tright: var(--safe-area-horizontal);\n}\n\n.speedometer.up {\n\tbottom: auto;\n\ttop: 0;\n\tflex-direction: column-reverse;\n}\n\n.speedometer > .box {\n\tmargin: 0;\n\tpadding: 8px 10px;\n\tmin-width: 140px;\n\tline-height: 0;\n\tfont-size: 40px;\n\tcolor: var(--text-color);\n\ttext-align: right;\n\topacity: 0.9;\n\tclip-path: polygon(8px 0, 100% 0, 100% 100%, 0 100%);\n\tbackground-color: var(--surface-color);\n}\n.speedometer.up > .box {\n\tclip-path: polygon(0 0, 100% 0, 100% 100%, 8px 100%);\n}\n.speedometer.hidden {\n\tdisplay: none;\n}\n\n#ui.has-safe-area-horizontal .speedometer {\n\tclip-path: polygon(8px 0, calc(100% - 8px) 0, 100% 100%, 0 100%);\n}\n#ui.has-safe-area-horizontal .speedometer.up {\n\tclip-path: polygon(0 0, 100% 0, calc(100% - 8px) 100%, 8px 100%);\n}\n\n.speedometer > .box > .container {\n\tmargin: 0;\n\tpadding: 0 0 0 16px;\n\tclip-path: polygon(6px 0, 100% 0, 100% 100%, 0 100%);\n\tbackground-color: var(--surface-tertiary-color);\n}\n.speedometer.up > .box > .container {\n\tclip-path: polygon(0 0, 100% 0, 100% 100%, 6px 100%);\n}\n\n#ui.has-safe-area-horizontal .speedometer > .box > .container {\n\tpadding-right: 4px;\n\tclip-path: polygon(6px 0, calc(100% - 6px) 0, 100% 100%, 0 100%);\n}\n#ui.has-safe-area-horizontal .speedometer.up > .box > .container {\n\tpadding-right: 4px;\n\tclip-path: polygon(0 0, 100% 0, calc(100% - 6px) 100%, 6px 100%);\n}\n\n.speedometer > .box > .container > span:last-of-type {\n\topacity: 0.5;\n\tmargin: 0 0.3em 0 0.25em;\n\tpadding: 0;\n\tfont-size: 0.5em;\n}\n.speedometer > .box > .container > span > span {\n\tdisplay: inline-block;\n\twidth: 0.5em;\n\ttext-align: center;\n}\n\n.speedometer > .checkpoint-speed {\n\tmargin: 0;\n\tpadding: 0;\n\twidth: 100%;\n\ttext-align: center;\n\tfont-size: 26px;\n\ttext-shadow: 1px 1px 1px var(--surface-color), -1px 1px 1px var(--surface-color), -1px -1px 1px var(--surface-color), 1px -1px 1px var(--surface-color);\n\topacity: 0;\n}\n.speedometer > .checkpoint-speed.green {\n\tcolor: #5f5;\n}\n.speedometer > .checkpoint-speed.red {\n\tcolor: #f55;\n}\n",
            "",
        ]);
        const o = s;
    },
    5437: (e, t, n) => {
        "use strict";
        n.d(t, { A: () => o });
        var i = n(1601),
            r = n.n(i),
            a = n(6314),
            s = n.n(a)()(r());
        s.push([
            e.id,
            "\n.message-box {\n\tmargin: 0;\n\tpadding: 0;\n\tposition: absolute;\n\tleft: 0;\n\ttop: 0;\n\tz-index: 1;\n\tmax-width: unset;\n\tmax-height: unset;\n\twidth: 100%;\n\theight: 100%;\n\tbackground-color: rgba(20, 20, 30, 0.5);\n\tborder: none;\n\tpointer-events: auto;\n}\n\n.message-box > div {\n\tposition: absolute;\n\tleft: calc(50% - 500px / 2);\n\ttop: 30%;\n\tz-index: 2;\n\tmargin: 0;\n\tpadding: 16px;\n\twidth: 500px;\n\tbox-sizing: border-box;\n\tborder: none;\n\tbackground-color: var(--surface-color);\n\toutline: none;\n\ttext-align: center;\n}\n\n.message-box > div > p {\n\tmargin: 5px 0 20px 0;\n\tpadding: 0;\n\tmin-height: 50px;\n\tline-height: 0.9;\n\tfont-size: 32px;\n\toverflow-wrap: break-word;\n\twhite-space: pre-wrap;\n\tcolor: var(--text-color);\n}\n\n.message-box > div > button {\n\tmin-width: 140px;\n}\n\n.message-box.message > div > button:first-of-type {\n\tdisplay: none;\n}\n\n.message-box.confirm > div > button:first-of-type {\n\tfloat: left;\n}\n.message-box.confirm > div > button:last-of-type {\n\tfloat: right;\n}\n\n.message-box.no-buttons > div > button {\n\tdisplay: none;\n}\n",
            "",
        ]);
        const o = s;
    },
    5586: (e, t, n) => {
        "use strict";
        n.d(t, { A: () => o });
        var i = n(1601),
            r = n.n(i),
            a = n(6314),
            s = n.n(a)()(r());
        s.push([
            e.id,
            "\n.track-info {\n\tposition: absolute;\n\tleft: calc(50% - 1050px / 2);\n\ttop: 0;\n\tz-index: 2;\n\tdisplay: flex;\n\tmargin: 0;\n\tpadding: 0;\n\twidth: 1000px;\n\theight: 100%;\n}\n.track-info.hidden {\n\tdisplay: none;\n}\n\n.track-info > .side-panel {\n\tposition: relative;\n\tdisplay: flex;\n\tflex-direction: column;\n\tflex-shrink: 0;\n\tmin-height: 0;\n\tmargin-left: 50px;\n\twidth: 400px;\n\tbackground-color: var(--surface-color);\n}\n\n.track-info > .side-panel > h2 {\n\tmargin: 8px 8px 0 8px;\n\tpadding: 0;\n\tflex-shrink: 0;\n\twhite-space: nowrap;\n\toverflow: hidden;\n\ttext-overflow: ellipsis;\n\tfont-weight: normal;\n\tfont-size: 32px;\n\ttext-align: center;\n\tcolor: var(--text-color);\n}\n\n\n.track-info > .side-panel > .thumbnail {\n\tposition: relative;\n\tmargin: 10px 0 0 0;\n\tpadding: 45px;\n\tflex-grow: 1;\n\tmin-height: 0;\n\tmax-height: 300px;\n\tbox-sizing: border-box;\n\tbackground-color: var(--surface-secondary-color);\n}\n\n.track-info > .side-panel > .thumbnail > canvas {\n\tmargin: 0;\n\tpadding: 0;\n\twidth: 100%;\n\theight: 100%;\n\tobject-fit: contain;\n\t-webkit-filter: drop-shadow(0 0 3px #000);\n\tfilter: drop-shadow(0 0 3px #000);\n\timage-rendering: pixelated;\n}\n\n.track-info > .side-panel > .thumbnail > .share {\n\tdisplay: inline-block;\n\tposition: absolute;\n\tleft: 0;\n\tbottom: 0;\n\tmargin: 8px;\n\tpadding: 0 9px;\n\tclip-path: polygon(3px 0, 100% 0, calc(100% - 3px) 100%, 0 100%);\n}\n.track-info > .side-panel > .thumbnail > .share > img {\n\tmargin: 0;\n\tpadding: 0;\n\twidth: 16px;\n\tpointer-events: none;\n}\n\n.track-info > .side-panel > .thumbnail > .environment {\n\tposition: absolute;\n\tright: 0;\n\tbottom: 0;\n\tmargin: 8px;\n\twidth: 32px;\n\topacity: 0.2;\n\tpointer-events: none;\n}\n\n.track-info > .side-panel > .track-author {\n\tmargin: 8px 0;\n\tfont-size: 18px;\n\tcolor: var(--text-color);\n\toverflow-wrap: anywhere;\n}\n\n.track-info > .side-panel > .divider {\n\tborder-top: 1px solid var(--text-color);\n}\n\n.track-info > .side-panel > .personal-best-title, .track-info > .side-panel > .opponents-title {\n\tmargin: 10px 0 0 0;\n\tfont-size: 32px;\n\tcolor: var(--text-color);\n}\n\n.track-info > .side-panel > .personal-best {\n\tmargin: 0 0 16px 0;\n\tfont-size: 28px;\n\tcolor: var(--text-color);\n}\n.track-info > .side-panel > .personal-best.no-record {\n\topacity: 0.5;\n}\n\n.track-info > .side-panel > .personal-best > div {\n\tmargin: 8px 0;\n\tpadding: 0 30px;\n\twidth: 100%;\n\tbox-sizing: border-box;\n\tfont-size: 26px;\n\ttext-align: left;\n\tline-height: 30px;;\n}\n\n.track-info > .side-panel > .personal-best > div > img {\n\tmargin: -1px 8px 1px 0;\n\twidth: 30px;\n\theight: 30px;\n\tvertical-align: top;\n}\n\n.track-info > .side-panel > .personal-best > div > .faded {\n\topacity: 0.5;\n}\n\n.track-info > .side-panel > .opponents-container {\n\tmargin: 8px 16px 16px 16px;\n\tflex-grow: 1;\n\tmin-height: 50px;\n\tfont-size: 18px;\n\tcolor: var(--text-color);\n\topacity: 0.5;\n}\n\n.track-info > .side-panel > .opponents-container.no-opponents {\n\tmargin: 8px 16px 16px 16px;\n\tfont-size: 18px;\n\tcolor: var(--text-color);\n\topacity: 0.5;\n}\n\n.track-info > .side-panel > .button.watch, .track-info > .side-panel > .button.play {\n\tflex-shrink: 0;\n\tmargin: 0 10px 10px 10px;\n\tpadding: 0 0 0 30px;\n\tbox-sizing: border-box;\n\twidth: calc(100% - 2 * 10px);\n\theight: 100px;\n\tclip-path: polygon(0 0, 100% 0, calc(100% - 8px) 100%, 0 100%);\n\ttext-align: center;\n\tfont-size: 50px;\n}\n.track-info > .side-panel > .button.watch {\n\theight: 50px;\n\tfont-size: 40px;\n}\n\n.track-info > .side-panel > .button.watch > img, .track-info > .side-panel > .button.play > img {\n\tmargin: 0 0 0 10px;\n\tpadding: 0;\n\tvertical-align: middle;\n\twidth: 48px;\n\theight: 48px;\n\ttransition: transform 0.2s ease-in-out;\n\tpointer-events: none;\n}\n.track-info > .side-panel > .button.watch > img {\n\twidth: 36px;\n\theight: 36px;\n}\n.track-info > .side-panel > .button.watch:disabled > img {\n\topacity: 0.3;\n}\n\n.track-info > .side-panel > .button.watch:hover > img, .track-info > .side-panel > .button.play:hover > img {\n\ttransform: translateX(10px);\n}\n.track-info > .side-panel > .button.watch:disabled:hover > img {\n\ttransform: none;\n}\n\n@media (hover: none) {\n\t.track-info > .side-panel > .button.watch:hover > img, .track-info > .side-panel > .button.play:hover > img {\n\t\ttransform: none;\n\t}\n}\n\n.track-info > .side-panel > .back {\n\tmargin: 10px;\n}\n\n.track-info > .side-panel > .leaderboard-button {\n\tmargin: 10px;\n\tfloat: right;\n}\n",
            "",
        ]);
        const o = s;
    },
    5739: (e, t, n) => {
        "use strict";
        e.exports = n.p + "images/quit.svg";
    },
    5768: (e, t, n) => {
        "use strict";
        n.d(t, { A: () => o });
        var i = n(1601),
            r = n.n(i),
            a = n(6314),
            s = n.n(a)()(r());
        s.push([
            e.id,
            "\n.admin-ui {\n\tposition: absolute;\n\tleft: 0;\n\ttop: 0;\n\tz-index: 2;\n\tmargin: 0;\n\tpadding: 16px;\n\twidth: 100%;\n\theight: 100%;\n\toverflow-y: scroll;\n\tbox-sizing: border-box;\n\tbackground-color: var(--surface-color);\n\tpointer-events: auto;\n}\n\n.admin-ui > .tracks-list {\n\tdisplay: flex;\n\tflex-wrap: wrap;\n}\n\n.admin-ui > .tracks-list > button {\n\tmargin: 4px;\n\twidth: 300px;\n\toverflow: hidden;\n\ttext-overflow: ellipsis;\n\twhite-space: nowrap;\n}\n\n.admin-ui > .leaderboard-container {\n\twidth: 100%;\n}\n\n.admin-ui > .leaderboard-container > table {\n\ttable-layout: fixed;\n\tborder-collapse: collapse;\n\tcolor: var(--text-color);\n\tfont-size: 26px;\n\twidth: 100%;\n}\n.admin-ui > .leaderboard-container > table > tr > th {\n\tborder-bottom: 2px solid var(--text-color);\n\ttext-align: left;\n}\n\n.admin-ui > .leaderboard-container > table > tr > th:nth-of-type(2) {\n\twidth: 150px;\n}\n\n.admin-ui > .leaderboard-container > table > tr > th:nth-of-type(3) {\n\twidth: 220px;\n}\n\n.admin-ui > .leaderboard-container > table > tr > th:nth-of-type(4) {\n\twidth: 200px;\n}\n\n.admin-ui > .leaderboard-container > table > tr > td {\n\theight: 60px;\n}\n\n.admin-ui > .leaderboard-container > table > tr:nth-of-type(2n + 1) > td {\n\tbackground-color: var(--surface-secondary-color);\n}\n\n.admin-ui > .leaderboard-container > .navigation {\n\tdisplay: flex;\n\tmargin: 8px 0;\n}\n.admin-ui > .leaderboard-container > .navigation > input {\n\tflex-grow: 1;\n\ttext-align: center;\n}",
            "",
        ]);
        const o = s;
    },
    5769: (e, t, n) => {
        "use strict";
        e.exports = n.p + "images/state_pending.svg";
    },
    5798: (e, t, n) => {
        "use strict";
        e.exports = n.p + "images/rotation_axis_y_negative.svg";
    },
    5811: (e, t, n) => {
        "use strict";
        n.d(t, { A: () => o });
        var i = n(1601),
            r = n.n(i),
            a = n(6314),
            s = n.n(a)()(r());
        s.push([
            e.id,
            "\n.checkpoint {\n\tposition: absolute;\n\tbottom: 0;\n\tleft: var(--safe-area-horizontal);\n\tmargin: 0;\n\tpadding: 8px 10px;\n\tline-height: 0;\n\tfont-size: 40px;\n\tcolor: var(--text-color);\n\ttext-align: left;\n\topacity: 0.9;\n\tclip-path: polygon(0 0, calc(100% - 8px) 0, 100% 100%, 0 100%);\n\tbackground-color: var(--surface-color);\n}\n.checkpoint.up {\n\tposition: absolute;\n\tbottom: auto;\n\ttop: 0;\n\tclip-path: polygon(0 0, 100% 0, calc(100% - 8px) 100%, 0 100%);\n}\n.checkpoint.hidden {\n\tdisplay: none;\n}\n\n\n#ui.has-safe-area-horizontal .checkpoint {\n\tclip-path: polygon(8px 0, calc(100% - 8px) 0, 100% 100%, 0 100%);\n}\n#ui.has-safe-area-horizontal .checkpoint.up {\n\tclip-path: polygon(0 0, 100% 0, calc(100% - 8px) 100%, 8px 100%);\n}\n\n.checkpoint > div {\n\tmargin: 0;\n\tpadding: 0 16px;\n\tclip-path: polygon(0 0, calc(100% - 6px) 0, 100% 100%, 0 100%);\n\tbackground-color: var(--surface-tertiary-color);\n}\n.checkpoint.up > div {\n\tclip-path: polygon(0 0, 100% 0, calc(100% - 6px) 100%, 0 100%);\n}\n\n#ui.has-safe-area-horizontal .checkpoint > div {\n\tclip-path: polygon(6px 0, calc(100% - 6px) 0, 100% 100%, 0 100%);\n}\n#ui.has-safe-area-horizontal .checkpoint.up > div {\n\tclip-path: polygon(0 0, 100% 0, calc(100% - 6px) 100%, 6px 100%);\n}\n\n.checkpoint > div > img {\n\tmargin: 0 12px 5px 0;\n\tpadding: 0;\n\twidth: 24px;\n\theight: 24px;\n\tvertical-align: middle;\n}\n",
            "",
        ]);
        const o = s;
    },
    5848: (e, t, n) => {
        "use strict";
        n.d(t, { A: () => o });
        var i = n(1601),
            r = n.n(i),
            a = n(6314),
            s = n.n(a)()(r());
        s.push([
            e.id,
            "\n.color-picker {\n\tmargin: 8px;\n}\n\n.color-picker > .value-saturation-picker {\n\tposition: relative;\n\tmargin: 0 0 8px 0;\n\twidth: 140px;\n\theight: 140px;\n\tbackground-color: #fff;\n\toverflow: hidden;\n}\n\n.color-picker > .value-saturation-picker > .marker {\n\tposition: absolute;\n\twidth: 12px;\n\theight: 12px;\n\tbackground-image: radial-gradient(closest-side, transparent, #000, #fff, #000, transparent);\n}\n\n.color-picker > .hue-picker {\n\tposition: relative;\n\twidth: 140px;\n\theight: 30px;\n\tbackground-image: linear-gradient(to right, \n\t\thsl(0, 100%, 50%),\n\t\thsl(60, 100%, 50%),\n\t\thsl(120, 100%, 50%),\n\t\thsl(180, 100%, 50%),\n\t\thsl(240, 100%, 50%),\n\t\thsl(300, 100%, 50%),\n\t\thsl(0, 100%, 50%)\n\t);\n\toverflow: hidden;\n}\n\n.color-picker > .hue-picker > .marker {\n\tposition: absolute;\n\ttop: 0;\n\theight: 100%;\n\twidth: 3px;\n\tbackground-image: linear-gradient(to right, #000, #fff, #000);\n}\n",
            "",
        ]);
        const o = s;
    },
    5918: (e, t, n) => {
        "use strict";
        e.exports = n.p + "images/load.svg";
    },
    5959: (e, t, n) => {
        "use strict";
        n.d(t, { A: () => o });
        var i = n(1601),
            r = n.n(i),
            a = n(6314),
            s = n.n(a)()(r());
        s.push([
            e.id,
            "\n.customization {\n\tposition: absolute;\n\tleft: 0;\n\ttop: 0;\n\tmargin: 0;\n\tpadding: 0;\n\twidth: 100%;\n\theight: 100%;\n}\n\n.customization > .safe-area-left {\n\tposition: absolute;\n\tleft: 0;\n\ttop: 0;\n\twidth: var(--safe-area-left);\n\theight: 100%;\n\tbackground-color: var(--surface-color);\n}\n\n.customization > .top {\n\tdisplay: block;\n\tmargin: 0;\n\tpadding: 0 0 0 var(--safe-area-left);\n\tbackground-color: var(--surface-color);\n}\n.customization > .top > .button {\n\tdisplay: inline-block;\n\tmargin: 8px 0;\n}\n.customization > .top > .button:first-of-type {\n\tmargin-left: 8px;\n}\n\n.customization > .save-message {\n\tmargin: 10px;\n\tpadding: 0;\n\tposition: absolute;\n\tfont-size: 30px;\n\tcolor: #96ff96;\n\ttext-shadow: 0 0 5px #000;\n\tpointer-events: none;\n\n\tleft: -10px;\n\topacity: 0;\n}\n.customization > .save-message.show {\n\tleft: 0;\n\topacity: 1;\n\ttransition: opacity 0.25s ease-in-out, left 0.25s ease-in-out;\n}\n.customization > .save-message.hide {\n\tleft: 0;\n\topacity: 0;\n\ttransition: opacity 0.25s ease-in-out, left 0.25s ease-in-out;\n}\n\n.customization > .colors {\n\tposition: absolute;\n\tleft: 0;\n\tbottom: 0;\n\twidth: 100%;\n\ttext-align: center;\n\twhite-space: nowrap;\n}\n\n.customization > .colors > div {\n\tdisplay: inline-block;\n\tmargin: 0 10px;\n\tpadding: 0;\n\ttext-align: center;\n\tbackground: var(--surface-color);\n\tpointer-events: auto;\n}\n.customization > .colors > div > h2 {\n\tmargin: 0;\n\tpadding: 2px;\n\tfont-size: 26px;\n\tfont-weight: normal;\n\tbackground-color: var(--surface-secondary-color);\n\tcolor: var(--text-color);\n}\n.customization > .colors > div > input {\n\tmargin: 8px 8px 0 8px;\n\twidth: calc(140px - 8px * 2);\n\tfont-weight: normal;\n\tclip-path: none;\n\ttext-align: center;\n}\n",
            "",
        ]);
        const o = s;
    },
    6027: (e, t, n) => {
        "use strict";
        e.exports = n.p + "images/pin.svg";
    },
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
    },
    6099: (e, t, n) => {
        "use strict";
        e.exports = n.p + "images/arrow_left.svg";
    },
    6150: (e, t, n) => {
        "use strict";
        e.exports = n.p + "images/arrow_right.svg";
    },
    6168: (e, t, n) => {
        "use strict";
        e.exports = n.p + "images/export.svg";
    },
    6244: (e, t, n) => {
        "use strict";
        e.exports = n.p + "images/state_verified.svg";
    },
    6314: (e) => {
        "use strict";
        e.exports = function (e) {
            var t = [];
            return (
                (t.toString = function () {
                    return this.map(function (t) {
                        var n = "",
                            i = void 0 !== t[5];
                        return (
                            t[4] && (n += "@supports (".concat(t[4], ") {")),
                            t[2] && (n += "@media ".concat(t[2], " {")),
                            i &&
                            (n += "@layer".concat(
                                t[5].length > 0 ? " ".concat(t[5]) : "",
                                " {"
                            )),
                            (n += e(t)),
                            i && (n += "}"),
                            t[2] && (n += "}"),
                            t[4] && (n += "}"),
                            n
                        );
                    }).join("");
                }),
                (t.i = function (e, n, i, r, a) {
                    "string" == typeof e && (e = [[null, e, void 0]]);
                    var s = {};
                    if (i)
                        for (var o = 0; o < this.length; o++) {
                            var l = this[o][0];
                            null != l && (s[l] = !0);
                        }
                    for (var c = 0; c < e.length; c++) {
                        var h = [].concat(e[c]);
                        (i && s[h[0]]) ||
                            (void 0 !== a &&
                                (void 0 === h[5] ||
                                    (h[1] = "@layer"
                                        .concat(h[5].length > 0 ? " ".concat(h[5]) : "", " {")
                                        .concat(h[1], "}")),
                                    (h[5] = a)),
                                n &&
                                (h[2]
                                    ? ((h[1] = "@media "
                                        .concat(h[2], " {")
                                        .concat(h[1], "}")),
                                        (h[2] = n))
                                    : (h[2] = n)),
                                r &&
                                (h[4]
                                    ? ((h[1] = "@supports ("
                                        .concat(h[4], ") {")
                                        .concat(h[1], "}")),
                                        (h[4] = r))
                                    : (h[4] = "".concat(r))),
                                t.push(h));
                    }
                }),
                t
            );
        };
    },
    6366: (e, t, n) => {
        "use strict";
        e.exports = n.p + "images/apply.svg";
    },
    6474: (e, t, n) => {
        "use strict";
        n.d(t, { A: () => o });
        var i = n(1601),
            r = n.n(i),
            a = n(6314),
            s = n.n(a)()(r());
        s.push([
            e.id,
            "\n.nickname {\n\tposition: absolute;\n\tleft: calc(50% - 500px / 2);\n\ttop: 40%;\n\tz-index: 2;\n\tmargin: 0;\n\tpadding: 16px;\n\twidth: 500px;\n\tbox-sizing: border-box;\n\tbackground-color: var(--surface-color);\n}\n\n.nickname > h1 {\n\tmargin: 0 4px 0 4px;\n\tpadding: 0;\n\tfont-size: 35px;\n\tfont-weight: normal;\n\tcolor: var(--text-color);\n}\n\n.nickname > input[type=text] {\n\tdisplay: block;\n\tmargin: 0;\n\tpadding: 0.25em;\n\tbox-sizing: border-box;\n\twidth: 100%;\n\tfont-size: 36px;\n\tfont-weight: normal;\n}\n\n.nickname > p {\n\tmargin: 16px 4px 0 4px;\n\tpadding: 0;\n\tfont-size: 20px;\n\tcolor: var(--text-color);\n}\n\n.nickname > button {\n\tdisplay: inline-block;\n\tmargin: 16px 0 0 0;\n}\n.nickname > button:last-of-type {\n\tfloat: right;\n}\n\n.nickname > button.delete {\n\tposition: absolute;\n\tright: 8px;\n\ttop: 0;\n\tfont-size: 16px;\n\tpadding: 8px 16px;\n}\n\n.nickname > button.delete > img.button-icon {\n\tmargin: -5px 0 -2px -3px;\n\twidth: 16px;\n\theight: 16px;\n}\n\ndiv.nickname-admin-button-container {\n\tposition: absolute;\n\tleft: 0;\n\tbottom: 22px;\n\tmargin: 0 4px;\n}\n\n.nickname-user-token {\n\tposition: absolute;\n\tleft: 0;\n\tbottom: 0;\n\tmargin: 0 4px;\n\ttext-align: left;\n\tfont-size: 18px;\n\topacity: 0.5;\n\tcolor: var(--text-color);\n\tpointer-events: all;\n\t-webkit-user-select: all;\n\t-moz-user-select: all;\n\t-ms-user-select: all;\n\tuser-select: all;\n}\n",
            "",
        ]);
        const o = s;
    },
    6546: (e, t, n) => {
        "use strict";
        /*! Capacitor: https://capacitorjs.com/ - MIT License */
        var i;
        n.d(t, { E_: () => l, F3: () => o }),
            (function (e) {
                (e.Unimplemented = "UNIMPLEMENTED"),
                    (e.Unavailable = "UNAVAILABLE");
            })(i || (i = {}));
        class r extends Error {
            constructor(e, t, n) {
                super(e), (this.message = e), (this.code = t), (this.data = n);
            }
        }
        const a = (e) => {
            const t = e.CapacitorCustomPlatform || null,
                n = e.Capacitor || {},
                a = (n.Plugins = n.Plugins || {}),
                s = () =>
                    null !== t
                        ? t.name
                        : ((e) => {
                            var t, n;
                            return (null == e ? void 0 : e.androidBridge)
                                ? "android"
                                : (
                                    null ===
                                        (n =
                                            null === (t = null == e ? void 0 : e.webkit) ||
                                                void 0 === t
                                                ? void 0
                                                : t.messageHandlers) || void 0 === n
                                        ? void 0
                                        : n.bridge
                                )
                                    ? "ios"
                                    : "web";
                        })(e),
                o = (e) => {
                    var t;
                    return null === (t = n.PluginHeaders) || void 0 === t
                        ? void 0
                        : t.find((t) => t.name === e);
                },
                l = new Map();
            return (
                n.convertFileSrc || (n.convertFileSrc = (e) => e),
                (n.getPlatform = s),
                (n.handleError = (t) => e.console.error(t)),
                (n.isNativePlatform = () => "web" !== s()),
                (n.isPluginAvailable = (e) => {
                    const t = l.get(e);
                    return !!(null == t ? void 0 : t.platforms.has(s())) || !!o(e);
                }),
                (n.registerPlugin = (e, c = {}) => {
                    const h = l.get(e);
                    if (h)
                        return (
                            console.warn(
                                `Capacitor plugin "${e}" already registered. Cannot register plugins twice.`
                            ),
                            h.proxy
                        );
                    const d = s(),
                        u = o(e);
                    let p;
                    const f = (a) => {
                        let s;
                        const o = (...o) => {
                            const l = (async () => (
                                !p && d in c
                                    ? (p = p =
                                        "function" == typeof c[d] ? await c[d]() : c[d])
                                    : null !== t &&
                                    !p &&
                                    "web" in c &&
                                    (p = p =
                                        "function" == typeof c.web
                                            ? await c.web()
                                            : c.web),
                                p
                            ))().then((t) => {
                                const l = ((t, a) => {
                                    var s, o;
                                    if (!u) {
                                        if (t)
                                            return null === (o = t[a]) || void 0 === o
                                                ? void 0
                                                : o.bind(t);
                                        throw new r(
                                            `"${e}" plugin is not implemented on ${d}`,
                                            i.Unimplemented
                                        );
                                    }
                                    {
                                        const i =
                                            null == u
                                                ? void 0
                                                : u.methods.find((e) => a === e.name);
                                        if (i)
                                            return "promise" === i.rtype
                                                ? (t) => n.nativePromise(e, a.toString(), t)
                                                : (t, i) =>
                                                    n.nativeCallback(e, a.toString(), t, i);
                                        if (t)
                                            return null === (s = t[a]) || void 0 === s
                                                ? void 0
                                                : s.bind(t);
                                    }
                                })(t, a);
                                if (l) {
                                    const e = l(...o);
                                    return (s = null == e ? void 0 : e.remove), e;
                                }
                                throw new r(
                                    `"${e}.${a}()" is not implemented on ${d}`,
                                    i.Unimplemented
                                );
                            });
                            return (
                                "addListener" === a && (l.remove = async () => s()), l
                            );
                        };
                        return (
                            (o.toString = () =>
                                `${a.toString()}() { [capacitor code] }`),
                            Object.defineProperty(o, "name", {
                                value: a,
                                writable: !1,
                                configurable: !1,
                            }),
                            o
                        );
                    },
                        m = f("addListener"),
                        g = f("removeListener"),
                        v = (e, t) => {
                            const n = m({ eventName: e }, t),
                                i = async () => {
                                    const i = await n;
                                    g({ eventName: e, callbackId: i }, t);
                                },
                                r = new Promise((e) => n.then(() => e({ remove: i })));
                            return (
                                (r.remove = async () => {
                                    console.warn(
                                        "Using addListener() without 'await' is deprecated."
                                    ),
                                        await i();
                                }),
                                r
                            );
                        },
                        w = new Proxy(
                            {},
                            {
                                get(e, t) {
                                    switch (t) {
                                        case "$$typeof":
                                            return;
                                        case "toJSON":
                                            return () => ({});
                                        case "addListener":
                                            return u ? v : m;
                                        case "removeListener":
                                            return g;
                                        default:
                                            return f(t);
                                    }
                                },
                            }
                        );
                    return (
                        (a[e] = w),
                        l.set(e, {
                            name: e,
                            proxy: w,
                            platforms: new Set([...Object.keys(c), ...(u ? [d] : [])]),
                        }),
                        w
                    );
                }),
                (n.Exception = r),
                (n.DEBUG = !!n.DEBUG),
                (n.isLoggingEnabled = !!n.isLoggingEnabled),
                n
            );
        },
            s = ((e) => (e.Capacitor = a(e)))(
                "undefined" != typeof globalThis
                    ? globalThis
                    : "undefined" != typeof self
                        ? self
                        : "undefined" != typeof window
                            ? window
                            : void 0 !== n.g
                                ? n.g
                                : {}
            ),
            o = s.registerPlugin;
        class l {
            constructor() {
                (this.listeners = {}),
                    (this.retainedEventArguments = {}),
                    (this.windowListeners = {});
            }
            addListener(e, t) {
                let n = !1;
                this.listeners[e] || ((this.listeners[e] = []), (n = !0)),
                    this.listeners[e].push(t);
                const i = this.windowListeners[e];
                i && !i.registered && this.addWindowListener(i),
                    n && this.sendRetainedArgumentsForEvent(e);
                return Promise.resolve({
                    remove: async () => this.removeListener(e, t),
                });
            }
            async removeAllListeners() {
                this.listeners = {};
                for (const e in this.windowListeners)
                    this.removeWindowListener(this.windowListeners[e]);
                this.windowListeners = {};
            }
            notifyListeners(e, t, n) {
                const i = this.listeners[e];
                if (i) i.forEach((e) => e(t));
                else if (n) {
                    let n = this.retainedEventArguments[e];
                    n || (n = []), n.push(t), (this.retainedEventArguments[e] = n);
                }
            }
            hasListeners(e) {
                return !!this.listeners[e].length;
            }
            registerWindowListener(e, t) {
                this.windowListeners[t] = {
                    registered: !1,
                    windowEventName: e,
                    pluginEventName: t,
                    handler: (e) => {
                        this.notifyListeners(t, e);
                    },
                };
            }
            unimplemented(e = "not implemented") {
                return new s.Exception(e, i.Unimplemented);
            }
            unavailable(e = "not available") {
                return new s.Exception(e, i.Unavailable);
            }
            async removeListener(e, t) {
                const n = this.listeners[e];
                if (!n) return;
                const i = n.indexOf(t);
                this.listeners[e].splice(i, 1),
                    this.listeners[e].length ||
                    this.removeWindowListener(this.windowListeners[e]);
            }
            addWindowListener(e) {
                window.addEventListener(e.windowEventName, e.handler),
                    (e.registered = !0);
            }
            removeWindowListener(e) {
                e &&
                    (window.removeEventListener(e.windowEventName, e.handler),
                        (e.registered = !1));
            }
            sendRetainedArgumentsForEvent(e) {
                const t = this.retainedEventArguments[e];
                t &&
                    (delete this.retainedEventArguments[e],
                        t.forEach((t) => {
                            this.notifyListeners(e, t);
                        }));
            }
        }
        const c = (e) =>
            encodeURIComponent(e)
                .replace(/%(2[346B]|5E|60|7C)/g, decodeURIComponent)
                .replace(/[()]/g, escape),
            h = (e) => e.replace(/(%[\dA-F]{2})+/gi, decodeURIComponent);
        class d extends l {
            async getCookies() {
                const e = document.cookie,
                    t = {};
                return (
                    e.split(";").forEach((e) => {
                        if (e.length <= 0) return;
                        let [n, i] = e.replace(/=/, "CAP_COOKIE").split("CAP_COOKIE");
                        (n = h(n).trim()), (i = h(i).trim()), (t[n] = i);
                    }),
                    t
                );
            }
            async setCookie(e) {
                try {
                    const t = c(e.key),
                        n = c(e.value),
                        i = `; expires=${(e.expires || "").replace("expires=", "")}`,
                        r = (e.path || "/").replace("path=", ""),
                        a = null != e.url && e.url.length > 0 ? `domain=${e.url}` : "";
                    document.cookie = `${t}=${n || ""}${i}; path=${r}; ${a};`;
                } catch (e) {
                    return Promise.reject(e);
                }
            }
            async deleteCookie(e) {
                try {
                    document.cookie = `${e.key}=; Max-Age=0`;
                } catch (e) {
                    return Promise.reject(e);
                }
            }
            async clearCookies() {
                try {
                    const e = document.cookie.split(";") || [];
                    for (const t of e)
                        document.cookie = t
                            .replace(/^ +/, "")
                            .replace(
                                /=.*/,
                                `=;expires=${new Date().toUTCString()};path=/`
                            );
                } catch (e) {
                    return Promise.reject(e);
                }
            }
            async clearAllCookies() {
                try {
                    await this.clearCookies();
                } catch (e) {
                    return Promise.reject(e);
                }
            }
        }
        o("CapacitorCookies", { web: () => new d() });
        const u = (e, t = {}) => {
            const n = Object.assign(
                { method: e.method || "GET", headers: e.headers },
                t
            ),
                i =
                    ((e = {}) => {
                        const t = Object.keys(e);
                        return Object.keys(e)
                            .map((e) => e.toLocaleLowerCase())
                            .reduce((n, i, r) => ((n[i] = e[t[r]]), n), {});
                    })(e.headers)["content-type"] || "";
            if ("string" == typeof e.data) n.body = e.data;
            else if (i.includes("application/x-www-form-urlencoded")) {
                const t = new URLSearchParams();
                for (const [n, i] of Object.entries(e.data || {})) t.set(n, i);
                n.body = t.toString();
            } else if (
                i.includes("multipart/form-data") ||
                e.data instanceof FormData
            ) {
                const t = new FormData();
                if (e.data instanceof FormData)
                    e.data.forEach((e, n) => {
                        t.append(n, e);
                    });
                else for (const n of Object.keys(e.data)) t.append(n, e.data[n]);
                n.body = t;
                const i = new Headers(n.headers);
                i.delete("content-type"), (n.headers = i);
            } else
                (i.includes("application/json") || "object" == typeof e.data) &&
                    (n.body = JSON.stringify(e.data));
            return n;
        };
        class p extends l {
            async request(e) {
                const t = u(e, e.webFetchExtra),
                    n = ((e, t = !0) =>
                        e
                            ? Object.entries(e)
                                .reduce((e, n) => {
                                    const [i, r] = n;
                                    let a, s;
                                    return (
                                        Array.isArray(r)
                                            ? ((s = ""),
                                                r.forEach((e) => {
                                                    (a = t ? encodeURIComponent(e) : e),
                                                        (s += `${i}=${a}&`);
                                                }),
                                                s.slice(0, -1))
                                            : ((a = t ? encodeURIComponent(r) : r),
                                                (s = `${i}=${a}`)),
                                        `${e}&${s}`
                                    );
                                }, "")
                                .substr(1)
                            : null)(e.params, e.shouldEncodeUrlParams),
                    i = n ? `${e.url}?${n}` : e.url,
                    r = await fetch(i, t),
                    a = r.headers.get("content-type") || "";
                let s,
                    o,
                    { responseType: l = "text" } = r.ok ? e : {};
                switch ((a.includes("application/json") && (l = "json"), l)) {
                    case "arraybuffer":
                    case "blob":
                        (o = await r.blob()),
                            (s = await (async (e) =>
                                new Promise((t, n) => {
                                    const i = new FileReader();
                                    (i.onload = () => {
                                        const e = i.result;
                                        t(e.indexOf(",") >= 0 ? e.split(",")[1] : e);
                                    }),
                                        (i.onerror = (e) => n(e)),
                                        i.readAsDataURL(e);
                                }))(o));
                        break;
                    case "json":
                        s = await r.json();
                        break;
                    default:
                        s = await r.text();
                }
                const c = {};
                return (
                    r.headers.forEach((e, t) => {
                        c[t] = e;
                    }),
                    { data: s, headers: c, status: r.status, url: r.url }
                );
            }
            async get(e) {
                return this.request(
                    Object.assign(Object.assign({}, e), { method: "GET" })
                );
            }
            async post(e) {
                return this.request(
                    Object.assign(Object.assign({}, e), { method: "POST" })
                );
            }
            async put(e) {
                return this.request(
                    Object.assign(Object.assign({}, e), { method: "PUT" })
                );
            }
            async patch(e) {
                return this.request(
                    Object.assign(Object.assign({}, e), { method: "PATCH" })
                );
            }
            async delete(e) {
                return this.request(
                    Object.assign(Object.assign({}, e), { method: "DELETE" })
                );
            }
        }
        o("CapacitorHttp", { web: () => new p() });
    },
    6657: (e, t, n) => {
        "use strict";
        n.d(t, { A: () => o });
        var i = n(1601),
            r = n.n(i),
            a = n(6314),
            s = n.n(a)()(r());
        s.push([
            e.id,
            "\n.leaderboard {\n\tposition: relative;\n\tmargin: 0;\n\tpadding: 0;\n\twidth: 600px;\n\theight: 100%;\n\ttext-align: left;\n\tdisplay: flex;\n\tflex-shrink: 0;\n\tflex-direction: column;\n\tbackground-color: var(--surface-color);\n}\n\n.leaderboard > h2 {\n\tmargin: 10px 10px 0 10px;\n\tpadding: 0;\n\tfont-weight: normal;\n\tfont-size: 38px;\n\ttext-align: center;\n\tcolor: var(--text-color);\n}\n\n.leaderboard > h3 {\n\tmargin: 0 10px 10px 10px;\n\tpadding: 0;\n\tfont-weight: normal;\n\tfont-size: 18px;\n\ttext-align: center;\n\tcolor: var(--text-color);\n\topacity: 0.5;\n}\n\n.leaderboard > .total-players {\n\tmargin: 10px;\n\tposition: absolute;\n\tright: 0;\n\ttop: 0;\n\ttext-align: center;\n\tfont-size: 14px;\n\tcolor: var(--text-color);\n\topacity: 0;\n\ttransition: opacity 0.5s ease-out;\n}\n.leaderboard > .total-players.fade-in {\n\topacity: 0.5;\n}\n\n.leaderboard > .container {\n\tmargin: 0;\n\tpadding: 0;\n\tflex-grow: 1;\n\tbackground-color: var(--surface-secondary-color);\n\toverflow-x: hidden;\n\toverflow-y: scroll;\n\tpointer-events: auto;\n}\n\n.leaderboard > .container > .loading-spinner-container {\n\tdisplay: flex;\n\tjustify-content: center;\n\talign-items: center;\n\twidth: 100%;\n\theight: 100%;\n}\n\n.leaderboard > .container > .error-message {\n\tpadding: 0 20px;\n\tfont-size: 20px;\n\ttext-align: center;\n\tcolor: var(--text-color);\n}\n\n.leaderboard > .container > button.main {\n\tmargin: 10px 10px 0 10px;\n\tpadding: 0;\n\tvertical-align: top;\n\twidth: calc(100% - 10px * 2);\n\theight: 100px;\n\tclip-path: polygon(0 0, 100% 0, calc(100% - 8px) 100%, 0 100%);\n\ttext-align: left;\n\twhite-space: nowrap;\n}\n.leaderboard > .container > button.main:last-of-type {\n\tmargin-bottom: 10px;\n}\n\n.leaderboard > .container > button.main.self:not(:focus-visible) {\n\tbackground-color: #2e4182;\n}\n\n.leaderboard > .container > button.main.selected {\n\tbackground-color: var(--button-hover-color);\n}\n.leaderboard > .container > button.main.selected::after {\n\twidth: 100%;\n}\n\n.leaderboard > .container > button.main > .checkmark {\n\tdisplay: none;\n}\n\n.leaderboard > .container > button.main.selected > .checkmark {\n\tdisplay: block;\n\tposition: absolute;\n\tright: 0;\n\ttop: 0;\n\tmargin: 6px;\n\twidth: 12px;\n\tanimation: leaderboard-checkmark-spawn 0.15s ease-out;\n}\n\n@keyframes leaderboard-checkmark-spawn {\n\t0% {\n\t\ttransform: scale(0);\n\t}\n\t90% {\n\t\ttransform: scale(1.2);\n\t}\n\t100% {\n\t\ttransform: scale(1);\n\t}\n}\n\n.leaderboard > .container > button.main > .image-container {\n\tdisplay: inline-block;\n\tposition: relative;\n\tbackground-color: rgba(0, 0, 0, 0.1);\n\twidth: 100px;\n\theight: 100px;\n}\n\n.leaderboard > .container > button.main > .image-container > img {\n\tposition: absolute;\n\tleft: 0;\n\ttop: 0;\n\twidth: 100%;\n\theight: 100%;\n\tpointer-events: none;\n\topacity: 0;\n\ttransition: opacity 0.5s ease-out;\n}\n.leaderboard > .container > button.main > .image-container > img.show {\n\topacity: 1;\n}\n\n.leaderboard > .container > button.main > .left, .leaderboard > .container > button.main > .right {\n\tdisplay: inline-block;\n\tvertical-align: top;\n}\n\n.leaderboard > .container > button.main > div > p {\n\tmargin: 0;\n\tpadding: 12px;\n\tfont-size: 28px;\n\tcolor: var(--text-color);\n}\n\n.leaderboard > .container > button.main > div > .position > span {\n\tfont-size: 20px;\n\topacity: 0.3;\n}\n\n.leaderboard > .container > button.main > div > .name-container {\n\tmargin: 0;\n\tpadding: 0;\n\tfont-size: 28px;\n\tdisplay: flex;\n\talign-items: center;\n\twidth: 360px;\n}\n\n.leaderboard > .container > button.main > div > .name-container > .name {\n\tpadding: 12px;\n\ttext-overflow: ellipsis;\n\toverflow: hidden;\n}\n.leaderboard > .container > button.main:focus-visible > div > .name-container > .name {\n\ttext-decoration: underline;\n}\n\n.leaderboard > .container > button.main > div > .name-container > .self {\n\tmargin-left: -16px;\n\tpadding: 12px;\n\topacity: 0.5;\n\tfont-size: 16px;\n\tfont-style: normal;\n}\n\n.leaderboard > .container > button.main > div > .verified-state {\n\topacity: 0.8;\n\tposition: absolute;\n\tright: 6px;\n\tmargin: 6px 0 0 0;\n\tfont-size: 18px;\n}\n.leaderboard > .container > button.main > div > .verified-state > img {\n\tmargin: 0 0 0 2px;\n\tpadding: 0;\n\theight: 12px;\n\tvertical-align: middle;\n}\n.leaderboard > .container > button.main > div > .verified-state.verified {\n\tcolor: #5f5;\n}\n.leaderboard > .container > button.main > div > .verified-state.invalid {\n\tcolor: #f55;\n}\n.leaderboard > .container > button.main > div > .verified-state.pending {\n\tcolor: #ff5;\n}\n\n.leaderboard > .pages {\n\tmargin: 10px 10px 0 10px;\n\tdisplay: flex;\n\tflex-direction: row;\n}\n.leaderboard > .pages > button.page {\n\tpadding: 0;\n\twidth: 0;\n\tflex-grow: 1;\n}\n.leaderboard > .pages > button.selected {\n\tbackground-color: var(--button-hover-color);\n}\n\n.leaderboard > .button-wrapper > .back {\n\tmargin: 10px;\n}\n\n.leaderboard > .button-wrapper > .button.only-verified {\n\tmargin: 10px 0;\n\tfloat: right;\n\tfont-size: 20px;\n\tline-height: 32px;\n}\n.leaderboard > .button-wrapper > .button.only-verified.disabled {\n\tcolor: rgba(255, 255, 255, 0.25);\n}\n\n.leaderboard > .button-wrapper > .button.only-verified > img {\n\tmargin-left: 6px;\n\tmargin-bottom: -4px;\n\twidth: 26px;\n}\n.leaderboard > .button-wrapper > .button.only-verified.disabled > img {\n\topacity: 0.25;\n}\n\n.leaderboard > .button-wrapper > .icon-button {\n\tmargin: 10px 0;\n\tfloat: right;\n}\n.leaderboard > .button-wrapper > .icon-button.first {\n\tmargin: 10px 10px 10px 0;\n}\n\n.leaderboard > .button-wrapper > .icon-button > img {\n\twidth: 28px;\n}\n.leaderboard > .button-wrapper > .icon-button.disabled > img, .leaderboard > .button-wrapper > .icon-button:disabled > img {\n\topacity: 0.25;\n}\n",
            "",
        ]);
        const o = s;
    },
    6838: (e, t, n) => {
        "use strict";
        e.exports = n.p + "images/smoke.png";
    },
    7173: (e, t, n) => {
        "use strict";
        e.exports = n.p + "images/windowed.svg";
    },
    7268: (e, t, n) => {
        "use strict";
        e.exports = n.p + "images/trophy.svg";
    },
    7404: (e, t, n) => {
        "use strict";
        e.exports = n.p + "images/car_thumbnail_placeholder.png";
    },
    7479: (e, t, n) => {
        "use strict";
        n.d(t, { A: () => o });
        var i = n(1601),
            r = n.n(i),
            a = n(6314),
            s = n.n(a)()(r());
        s.push([
            e.id,
            "\n.timer {\n\tposition: absolute;\n\tbottom: 0;\n\tleft: 0;\n\twidth: 100%;\n\ttext-align: center;\n\topacity: 0.9;\n}\n.timer.up {\n\tbottom: auto;\n\ttop: 0;\n}\n.timer.hidden {\n\tdisplay: none;\n}\n\n.timer > div {\n\tmargin: 0;\n\tpadding: 0;\n\tdisplay: inline-flex;\n\tflex-direction: column;\n\twidth: 240px;\n\tvertical-align: bottom;\n}\n.timer.up > div {\n\tflex-direction: column-reverse;\n\tvertical-align: top;\n}\n.timer > div > .title-container {\n\tposition: relative;\n\tmargin: 0 auto;\n\twidth: 220px;\n\theight: 32px;\n}\n.timer > div > .title-container > h2 {\n\tposition: absolute;\n\tmargin: 0;\n\tpadding: 0;\n\twidth: 100%;\n\toverflow: hidden;\n\ttext-overflow: ellipsis;\n\tcolor: var(--text-color);\n\tfont-size: 26px;\n\tfont-weight: normal;\n\ttext-shadow: 1px 1px 1px var(--surface-color), -1px 1px 1px var(--surface-color), -1px -1px 1px var(--surface-color), 1px -1px 1px var(--surface-color);\n}\n.timer:not(.up) > div > .title-container > .title {\n\tmargin-top: 8px;\n}\n.timer > div > .title-container > .checkpoint-time {\n\topacity: 0;\n\tfont-size: 32px;\n}\n.timer > div > .title-container > .checkpoint-time.green {\n\tcolor: #5f5;\n}\n.timer > div > .title-container > .checkpoint-time.red {\n\tcolor: #f55;\n}\n\n.timer > div > .time {\n\tmargin: 0;\n\tpadding: 0;\n\tbackground-color: var(--surface-color);\n}\n.timer > .left > .time {\n\tpadding: 8px 4px 8px 10px;\n\tclip-path: polygon(8px 0, 100% 0, 100% 100%, 0 100%);\n}\n.timer.up > .left > .time {\n\tclip-path: polygon(0 0, 100% 0, 100% 100%, 8px 100%);\n}\n.timer > .center > .time {\n\tposition: relative;\n\tz-index: 1;\n\tmargin: 0 -12px;\n\tpadding: 8px 10px;\n\tclip-path: polygon(8px 0, calc(100% - 8px) 0, 100% 100%, 0 100%);\n}\n.timer.up > .center > .time {\n\tclip-path: polygon(0 0, 100% 0, calc(100% - 8px) 100%, 8px 100%);\n}\n.timer > .right > .time {\n\tpadding: 8px 10px 8px 4px;\n\tclip-path: polygon(0 0, calc(100% - 8px) 0, 100% 100%, 0 100%);\n}\n.timer.up > .right > .time {\n\tclip-path: polygon(0 0, 100% 0, calc(100% - 8px) 100%, 0 100%);\n}\n\n.timer > div > .time > p {\n\tmargin: 0;\n\tpadding: 0;\n\tbackground-color: var(--surface-tertiary-color);\n\tcolor: var(--text-color);\n\tfont-size: 34px;\n}\n.timer > .left > .time > p {\n\tclip-path: polygon(6px 0, 100% 0, 100% 100%, 0 100%);\n}\n.timer.up > .left > .time > p {\n\tclip-path: polygon(0 0, 100% 0, 100% 100%, 6px 100%);\n}\n.timer > .center > .time > p {\n\tfont-size: 46px;\n\tclip-path: polygon(6px 0, calc(100% - 6px) 0, 100% 100%, 0 100%);\n}\n.timer.up > .center > .time > p {\n\tclip-path: polygon(0 0, 100% 0, calc(100% - 6px) 100%, 6px 100%);\n}\n.timer > .right > .time > p {\n\tclip-path: polygon(0 0, calc(100% - 6px) 0, 100% 100%, 0 100%);\n}\n.timer.up > .right > .time > p {\n\tclip-path: polygon(0 0, 100% 0, calc(100% - 6px) 100%, 0 100%);\n}\n\n.timer > div > .time > p.green {\n\tcolor: #5f5;\n}\n.timer > div > .time > p.red {\n\tcolor:#f55;\n}\n\n.timer > div > .time > p > span {\n\tdisplay: inline-block;\n\twidth: 0.5em;\n\ttext-align: center;\n}\n.timer > div > .time > p > span.sign {\n\tmargin-left: -4px;\n\twidth: 0.7em;\n}\n",
            "",
        ]);
        const o = s;
    },
    7581: (e, t, n) => {
        "use strict";
        e.exports = n.p + "images/fullscreen.svg";
    },
    7659: (e) => {
        "use strict";
        var t = {};
        e.exports = function (e, n) {
            var i = (function (e) {
                if (void 0 === t[e]) {
                    var n = document.querySelector(e);
                    if (
                        window.HTMLIFrameElement &&
                        n instanceof window.HTMLIFrameElement
                    )
                        try {
                            n = n.contentDocument.head;
                        } catch (e) {
                            n = null;
                        }
                    t[e] = n;
                }
                return t[e];
            })(e);
            if (!i)
                throw new Error(
                    "Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid."
                );
            i.appendChild(n);
        };
    },
    7687: (e, t, n) => {
        "use strict";
        n.d(t, { A: () => o });
        var i = n(1601),
            r = n.n(i),
            a = n(6314),
            s = n.n(a)()(r());
        s.push([
            e.id,
            "\n.track-export > .background {\n\tposition: absolute;\n\tleft: 0;\n\ttop: 0;\n\tz-index: 1;\n\twidth: 100%;\n\theight: 100%;\n\tbackground-color: rgba(20, 20, 30, 0.5);\n\tpointer-events: auto;\n}\n\n.track-export > .box {\n\tposition: absolute;\n\tleft: calc(50% - 80% / 2);\n\ttop: 0;\n\tz-index: 2;\n\tmargin: 0;\n\tpadding: 10px;\n\tbox-sizing: border-box;\n\twidth: 80%;\n\theight: 100%;\n\tbackground-color: var(--surface-color);\n}\n\n.track-export > .box > .bar {\n\ttext-align: left;\n\tpointer-events: auto;\n}\n.track-export > .box > .bar > .button.right {\n\tfloat: right;\n}\n\n.track-export > .box > textarea {\n\tmargin: 10px 0 0 0;\n\tpadding: 10px;\n\tbox-sizing: border-box;\n\tmin-width: 100%;\n\tmax-width: 100%;\n\tmin-height: calc(100% - 52px - 10px);\n\tmax-height: calc(100% - 52px - 10px);\n\tpointer-events: auto;\n\tbackground-color: var(--surface-tertiary-color);\n\tborder: none;\n\tresize: none;\n\tcolor: var(--text-color);\n\tword-break: break-all;\n\tfont-size: 20px;\n}\n.track-export > .box > textarea:focus-visible {\n\toutline: none;\n}\n",
            "",
        ]);
        const o = s;
    },
    7780: (e, t, n) => {
        var i = {
            "./apply.svg": 6366,
            "./arrow_down.svg": 516,
            "./arrow_left.svg": 6099,
            "./arrow_right.svg": 6150,
            "./arrow_up.svg": 2207,
            "./back.svg": 8787,
            "./cancel.svg": 1784,
            "./car_stripe.svg": 2344,
            "./car_thumbnail_placeholder.png": 7404,
            "./checkmark.svg": 9809,
            "./checkpoint.svg": 5148,
            "./clouds.jpg": 8875,
            "./community_tracks.jpg": 8115,
            "./copy.svg": 1925,
            "./custom_tracks.jpg": 2709,
            "./customize.svg": 9027,
            "./delete.svg": 2319,
            "./desert.svg": 1705,
            "./desert_colored.svg": 1758,
            "./discord.svg": 858,
            "./editor.svg": 8889,
            "./empty.svg": 493,
            "./erase.svg": 1936,
            "./export.svg": 6168,
            "./fullscreen.svg": 7581,
            "./grid_large.svg": 3518,
            "./grid_small.svg": 4930,
            "./helmet.svg": 1333,
            "./help.svg": 5031,
            "./pmlicon.svg": 853,
            "./import.svg": 9077,
            "./load.svg": 5918,
            "./pmllogo.svg": 8903,
            "./official_tracks.jpg": 9391,
            "./overlapping_disabled.svg": 8358,
            "./overlapping_enabled.svg": 2493,
            "./pause.svg": 9708,
            "./pending.svg": 3223,
            "./pin.svg": 6027,
            "./play.svg": 9236,
            "./preview.svg": 9570,
            "./quit.svg": 5739,
            "./random.svg": 2175,
            "./redo.svg": 4942,
            "./reset.svg": 1719,
            "./reset_settings.svg": 4593,
            "./rotate.svg": 4563,
            "./rotation_axis_x_negative.svg": 5001,
            "./rotation_axis_x_positive.svg": 77,
            "./rotation_axis_y_negative.svg": 5798,
            "./rotation_axis_y_positive.svg": 9062,
            "./rotation_axis_z_negative.svg": 3895,
            "./rotation_axis_z_positive.svg": 4411,
            "./save.svg": 4309,
            "./search.svg": 8718,
            "./settings.svg": 8237,
            "./share.svg": 3755,
            "./smoke.png": 6838,
            "./state_invalid.svg": 2553,
            "./state_pending.svg": 5769,
            "./state_verified.svg": 6244,
            "./summer.svg": 3901,
            "./test.svg": 1734,
            "./timer.svg": 3849,
            "./trophy.svg": 7268,
            "./undo.svg": 3144,
            "./verified.svg": 3902,
            "./windowed.svg": 7173,
            "./winter.svg": 813,
            "./winter_colored.svg": 5010,
        };
        function r(e) {
            var t = a(e);
            return n(t);
        }
        function a(e) {
            if (!n.o(i, e)) {
                var t = new Error("Cannot find module '" + e + "'");
                throw ((t.code = "MODULE_NOT_FOUND"), t);
            }
            return i[e];
        }
        (r.keys = function () {
            return Object.keys(i);
        }),
            (r.resolve = a),
            (e.exports = r),
            (r.id = 7780);
    },
    7818: (e, t, n) => {
        "use strict";
        n.d(t, { A: () => o });
        var i = n(1601),
            r = n.n(i),
            a = n(6314),
            s = n.n(a)()(r());
        s.push([
            e.id,
            "\n.user-export {\n\tposition: absolute;\n\tleft: calc(50% - 500px / 2);\n\ttop: 35%;\n\tz-index: 2;\n\tmargin: 0;\n\tpadding: 10px;\n\tbox-sizing: border-box;\n\twidth: 500px;\n\theight: 150px;\n\tbackground-color: var(--surface-color);\n}\n\n.user-export > textarea {\n\tmargin: 0;\n\tpadding: 10px;\n\tbox-sizing: border-box;\n\tmin-width: 100%;\n\tmax-width: 100%;\n\tmin-height: calc(100% - 52px - 10px);\n\tmax-height: calc(100% - 52px - 10px);\n\tpointer-events: auto;\n\tbackground-color: var(--surface-tertiary-color);\n\tborder: none;\n\tresize: none;\n\tcolor: var(--text-color);\n\tword-break: break-all;\n\tfont-size: 20px;\n}\n.user-export > textarea:focus-visible {\n\toutline: none;\n}\n\n.user-export > .bar {\n\tmargin: 8px 0 0 0;\n}\n\n.user-export > .bar > .button.right {\n\tfloat: right;\n}\n",
            "",
        ]);
        const o = s;
    },
    7825: (e) => {
        "use strict";
        e.exports = function (e) {
            if ("undefined" == typeof document)
                return { update: function () { }, remove: function () { } };
            var t = e.insertStyleElement(e);
            return {
                update: function (n) {
                    !(function (e, t, n) {
                        var i = "";
                        n.supports && (i += "@supports (".concat(n.supports, ") {")),
                            n.media && (i += "@media ".concat(n.media, " {"));
                        var r = void 0 !== n.layer;
                        r &&
                            (i += "@layer".concat(
                                n.layer.length > 0 ? " ".concat(n.layer) : "",
                                " {"
                            )),
                            (i += n.css),
                            r && (i += "}"),
                            n.media && (i += "}"),
                            n.supports && (i += "}");
                        var a = n.sourceMap;
                        a &&
                            "undefined" != typeof btoa &&
                            (i +=
                                "\n/*# sourceMappingURL=data:application/json;base64,".concat(
                                    btoa(unescape(encodeURIComponent(JSON.stringify(a)))),
                                    " */"
                                )),
                            t.styleTagTransform(i, e, t.options);
                    })(t, e, n);
                },
                remove: function () {
                    !(function (e) {
                        if (null === e.parentNode) return !1;
                        e.parentNode.removeChild(e);
                    })(t);
                },
            };
        };
    },
    8115: (e, t, n) => {
        "use strict";
        e.exports = n.p + "images/community_tracks.jpg";
    },
    8229: (e, t, n) => {
        "use strict";
        n.d(t, { A: () => o });
        var i = n(1601),
            r = n.n(i),
            a = n(6314),
            s = n.n(a)()(r());
        s.push([
            e.id,
            "\n.hint {\n\tpadding: 0 280px;\n\tposition: absolute;\n\tleft: 0;\n\ttop: 150px;\n\twidth: 100%;\n\tbox-sizing: border-box;\n\ttext-align: center;\n\tcolor: #fff;\n\ttext-shadow: 0 0 5px #000;\n\tpointer-events: none;\n\topacity: 0;\n}\n.hint.show {\n\ttop: 150px;\n\topacity: 1;\n\ttransition: opacity 0.25s ease-in-out, top 0.25s ease-in-out;\n}\n.hint.hide {\n\ttop: 160px;\n\topacity: 0;\n\ttransition: opacity 0.25s ease-in-out, top 0.25s ease-in-out;\n}\n\n.hint > .title {\n\tfont-size: 32px;\n}\n\n.hint > .subtitle {\n\tmargin: 16px 0 0 0;\n\tfont-size: 24px;\n}\n",
            "",
        ]);
        const o = s;
    },
    8237: (e, t, n) => {
        "use strict";
        e.exports = n.p + "images/settings.svg";
    },
    8353: (e, t, n) => {
        "use strict";
        n.d(t, { A: () => g });
        var i = n(1601),
            r = n.n(i),
            a = n(6314),
            s = n.n(a),
            o = n(4417),
            l = n.n(o),
            c = new URL(n(9391), n.b),
            h = new URL(n(8115), n.b),
            d = new URL(n(2709), n.b),
            u = s()(r()),
            p = l()(c),
            f = l()(h),
            m = l()(d);
        u.push([
            e.id,
            `\n.track-selection {\n\tposition: absolute;\n\tbottom: 0;\n\tdisplay: flex;\n\tflex-direction: column;\n\twidth: 100%;\n\theight: 100%;\n\toverflow: hidden;\n\ttext-align: left;\n}\n\n.track-selection > .safe-area-left {\n\tposition: absolute;\n\tleft: 0;\n\ttop: 0;\n\tz-index: 1;\n\twidth: var(--safe-area-left);\n\theight: 100%;\n\tbackground-color: var(--surface-color);\n}\n\n.track-selection > .safe-area-right {\n\tposition: absolute;\n\tright: 0;\n\ttop: 0;\n\tz-index: 1;\n\twidth: var(--safe-area-right);\n\theight: 100%;\n\tbackground-color: var(--surface-color);\n}\n\n.track-selection > .bar {\n\tdisplay: flex;\n\tmargin: 0;\n\tpadding: 0 var(--safe-area-right) 0 var(--safe-area-left);\n\twidth: 100%;\n\tbox-sizing: border-box;\n\tbackground-color: var(--surface-color);\n\ttext-align: left;\n\n\tpointer-events:auto;\n}\n.track-selection > .bar > .button {\n\tmargin: 8px 12px;\n}\n\n.track-selection > .bar > .search-bar-container {\n\tposition: relative;\n\tdisplay: flex;\n\tflex-grow: 1;\n}\n.track-selection > .bar > .search-bar-container > input {\n\tmargin: 8px -10px;\n\tpadding: 0 20px;\n\tflex-grow: 1;\n\tclip-path: polygon(8px 0, 100% 0, calc(100% - 8px) 100%, 0 100%);\n\tcolor: var(--text-color);\n\ttext-indent: 2px; /* Without this the italic text will be cut off on the left side. */\n}\n.track-selection > .bar > .search-bar-container > img {\n\tmargin: 8px -10px 8px 0;\n\tpadding: 0 16px;\n\twidth: 24px;\n\tbackground-color: var(--button-hover-color);\n\tclip-path: polygon(8px 0, 100% 0, calc(100% - 8px) 100%, 0 100%);\n}\n\n.track-selection .category-container {\n\tdisplay: flex;\n\tpadding: 0 var(--safe-area-right) 0 var(--safe-area-left);\n\tbackground-color: var(--surface-secondary-color);\n}\n.track-selection .category-container > button {\n\tposition: relative;\n\tmargin: 0 -3px;\n\tpadding: 0.6em 0;\n\tflex-grow: 1;\n\tbackground-color: transparent;\n\tfont-size: 2.8vw;\n\tfont-weight: bold;\n\ttext-shadow: 2px 2px 0 #112052, 0 0 10px #000, 0 0 10px #000;\n\tclip-path: polygon(8px 0, 100% 0, calc(100% - 8px) 100%, 0 100%);\n}\n.track-selection .category-container > button:first-of-type {\n\tclip-path: polygon(0 0, 100% 0, calc(100% - 8px) 100%, 0 100%);\n}\n.track-selection .category-container > button:last-of-type {\n\tclip-path: polygon(8px 0, 100% 0, 100% 100%, 0 100%);\n}\n.track-selection .category-container > button::before {\n\tcontent: "";\n\tposition: absolute;\n\ttop: 0;\n\tleft: 0;\n\tz-index: -1;\n\twidth: 100%;\n\theight: 100%;\n\tbackground-position: center;\n\tbackground-size: cover;\n\tfilter: blur(2px);\n\ttransition: filter 0.2s ease-in-out,  0.2s ease-in-out;\n}\n.track-selection .category-container > button.official::before {\n\tbackground-image: url(${p});\n}\n.track-selection .category-container > button.community::before {\n\tbackground-image: url(${f});\n}\n.track-selection .category-container > button.custom::before {\n\tbackground-image: url(${m});\n}\n.track-selection .category-container > button:hover::before {\n\tfilter: none;\n\ttransform: scale(1.1);\n}\n@media (hover: none) {\n\t.track-selection .category-container > button:hover::before {\n\t\tfilter: blur(2px);\n\t\ttransform: none;\n\t}\n\n\t.track-selection .category-container > button:active::before {\n\t\tfilter: none;\n\t\ttransform: scale(1.1);\n\t}\n}\n.track-selection .category-container > button.selected::before {\n\tfilter: none;\n}\n.track-selection .category-container > button::after {\n\tbackground-color: transparent;\n}\n.track-selection .category-container > button.selected::after {\n\twidth: 100%;\n}\n\n.track-selection .category-container > button > .cover {\n\tposition: absolute;\n\ttop: 0;\n\tleft: 0;\n\tz-index: -1;\n\twidth: 100%;\n\theight: 100%;\n\tbackground-color: rgba(17, 32, 82, 0.75);\n\ttransition: background-color 0.2s ease-in-out;\n}\n.track-selection .category-container > button:hover > .cover {\n\tbackground-color: rgba(51, 75, 119, 0.5);\n}\n@media (hover: none) {\n\t.track-selection .category-container > button:hover > .cover {\n\t\tbackground-color: rgba(17, 32, 82, 0.75);\n\t}\n}\n.track-selection .category-container > button:active > .cover {\n\tbackground-color: rgba(21, 31, 65, 0.5);\n}\n.track-selection .category-container > button.selected > .cover {\n\tbackground-color: transparent;\n}\n\n@media (max-width: 1150px) {\n\t.track-selection .category-container > button {\n\t\tfont-size: 32.2px;\n\t}\n}\n\n.track-selection .tracks-container {\n\tmargin: 0;\n\tpadding: 20px calc(60px + var(--safe-area-right)) 20px calc(60px + var(--safe-area-left));\n\tbox-sizing: border-box;\n\twidth: 100%;\n\tflex-grow: 1;\n\toverflow-y: auto;\n\tpointer-events: auto;\n\tdisplay: none;\n}\n.track-selection .tracks-container.open {\n\tdisplay: block;\n}\n.track-selection.editor-track-selection .tracks-container {\n\tbackground-color: rgba(20, 20, 45, 0.8);\n}\n\n.track-selection .tracks-container > .empty {\n\tmargin: 100px;\n\tcolor: var(--text-color);\n\ttext-align: center;\n}\n.track-selection .tracks-container > .empty > .title {\n\tfont-size: 48px;\n}\n.track-selection .tracks-container > .empty > .description {\n\tmargin: 20px 0 0 0;\n\tfont-size: 32px;\n\topacity: 0.75;\n}\n\n.track-selection .environment-title {\n\tmargin: 0.5em 0.4em;\n\tpadding: 0;\n\tfont-size: 50px;\n\tfont-weight: normal;\n\tborder-bottom-width: 4px;\n\tborder-bottom-style: solid;\n\t\n}\n.track-selection .environment-title.summer {\n\tcolor: var(--text-color);\n\tborder-image: linear-gradient(to right, var(--text-color), transparent) 1;\n}\n.track-selection .environment-title.winter {\n\tcolor: #bed8f7;\n\tborder-image: linear-gradient(to right, #bed8f7, transparent) 1;\n}\n.track-selection .environment-title.desert {\n\tcolor: #ede2af;\n\tborder-image: linear-gradient(to right, #ede2af, transparent) 1;\n}\n\n.track-selection .environment-title > img {\n\tmargin: 6px 8px;\n\twidth: 36px;\n\theight: 36px;\n\tvertical-align: bottom;\n}\n\n.track-selection .tracks-container .track {\n\tposition: relative;\n\tdisplay: inline-block;\n}\n\n.track-selection .tracks-container .track button {\n\tmargin: 10px;\n\tpadding: 0;\n\tcolor: var(--text-color);\n\tfont-size: 32px;\n}\n.track-selection .tracks-container .track button:after {\n\tborder-bottom: none;\n}\n.track-selection .tracks-container .track button:focus-visible {\n\ttext-decoration: none;\n}\n\n.track-selection .track-title {\n\tmargin: 0;\n\tpadding: 4px;\n\tfont-size: 25px;\n\tbackground-color: var(--surface-secondary-color);\n}\n.track-selection .tracks-container .track button:focus-visible .track-title {\n\ttext-decoration: underline;\n}\n.track-selection .track-title > p {\n\tmargin: 0;\n\tpadding: 0 22px;\n\twidth: 208px;\n\tbox-sizing: border-box;\n\twhite-space: nowrap;\n\toverflow: hidden;\n\ttext-overflow: ellipsis;\n}\n\n.track-selection .track canvas {\n\tmargin: 0;\n\tpadding: 20px 40px;\n\twidth: 128px;\n\theight: 128px;\n\tobject-fit: contain;\n\t-webkit-filter: drop-shadow(0 0 3px #000);\n\tfilter: drop-shadow(0 0 3px #000);\n\timage-rendering: pixelated;\n}\n\n.track-selection .track .environment {\n\tposition: absolute;\n\tright: 14px;\n\tbottom: 40px;\n\twidth: 24px;\n\topacity: 0.2;\n\tpointer-events: none;\n}\n\n.track-selection .record {\n\tmargin: 0;\n\tpadding: 4px;\n\tfont-size: 24px;\n\tbackground-color: var(--surface-secondary-color);\n\tcolor: var(--text-color);\n}\n\n.track-selection .delete-button {\n\tposition: absolute;\n\ttop: 7px;\n\tright: 6px;\n\tmargin: 0;\n\tpadding: 0;\n\tline-height: 0;\n\tborder-radius: 2px;\n\tborder: none;\n\tbackground-color: var(--button-color);\n\n\tpointer-events: auto;\n\tcursor: pointer;\n}\n.track-selection .delete-button:hover {\n\tbackground-color: var(--button-hover-color);\n}\n@media (hover: none) {\n\t.track-selection .delete-button:hover {\n\t\tbackground-color: var(--button-color);\n\t}\n}\n.track-selection .delete-button:active {\n\tbackground-color: var(--button-active-color);\n}\n.track-selection .delete-button > img {\n\tmargin: 0;\n\tpadding: 0;\n\theight: 20px;\n\tvertical-align: top;\n\tpointer-events: none;\n}\n`,
            "",
        ]);
        const g = u;
    },
    8358: (e, t, n) => {
        "use strict";
        e.exports = n.p + "images/overlapping_disabled.svg";
    },
    8419: (e, t, n) => {
        "use strict";
        n.d(t, { A: () => g });
        var i = n(1601),
            r = n.n(i),
            a = n(6314),
            s = n.n(a),
            o = n(4417),
            l = n.n(o),
            c = new URL(n(3682), n.b),
            h = new URL(n(2208), n.b),
            d = new URL(n(2832), n.b),
            u = s()(r()),
            p = l()(c),
            f = l()(h),
            m = l()(d);
        u.push([
            e.id,
            `\n:root {\n\tinterpolate-size: allow-keywords; \n\n\t--text-color: #fff;\n\t--text-disabled-color: #5d6a7c;\n\t--surface-color: #28346a;\n\t--surface-secondary-color: #212b58;\n\t--surface-tertiary-color: #192042;\n\t--surface-transparent-color: rgba(40, 52, 106, 0.5);\n\t--button-color: #112052;\n\t--button-hover-color: #334b77;\n\t--button-active-color: #151f41;\n\t--button-disabled-color: #313d53;\n\n\t/* Set by JS */\n\t--ui-scale-factor: 1.0;\n\n\t--safe-area-left-unscaled: env(safe-area-inset-left, 0px);\n\t--safe-area-right-unscaled: env(safe-area-inset-right, 0px);\n\t--safe-area-top-unscaled: env(safe-area-inset-top, 0px);\n\t--safe-area-bottom-unscaled: env(safe-area-inset-bottom, 0px);\n\n\t--safe-area-left: calc(var(--safe-area-left-unscaled) / var(--ui-scale-factor));\n\t--safe-area-right: calc(var(--safe-area-right-unscaled) / var(--ui-scale-factor));\n\t--safe-area-horizontal: max(var(--safe-area-left), var(--safe-area-right));\n\n\t--safe-area-top: calc(var(--safe-area-top-unscaled) / var(--ui-scale-factor));\n\t--safe-area-bottom: calc(var(--safe-area-bottom-unscaled) / var(--ui-scale-factor));\n\t--safe-area-vertical: max(var(--safe-area-top), var(--safe-area-bottom));\n}\n\n@font-face {\n\tfont-family: ForcedSquare;\n\tsrc:\n\t\turl(${p}) format("woff2"),\n\t\turl(${f}) format("woff"),\n\t\turl(${m}) format("truetype");\n}\n\nhtml, body {\n\tmargin: 0;\n\tpadding: 0;\n\twidth: 100%;\n\theight: 100%;\n\toverflow: hidden;\n\toverscroll-behavior: none;\n\n\tbackground: #000;\n}\n\nbody {\n\tscrollbar-color: #7272c2 #223;\n\ttouch-action: none;\n}\n\n* {\n\tfont-style: italic;\n\tfont-family: ForcedSquare, Arial, sans-serif;\n\tline-height: 1;\n}\n\n#screen {\n\tmargin: 0;\n\tpadding: 0;\n\twidth: 100%;\n\theight: 100%;\n\t-webkit-tap-highlight-color: transparent;\n\t-webkit-touch-callout: none;\n\t-webkit-user-select: none;\n\t-moz-user-select: none;\n\t-ms-user-select: none;\n\tuser-select: none;\n\ttouch-action: none;\n}\n\n#ui {\n\tposition: absolute;\n\tleft: 0;\n\ttop: 0;\n\twidth: 100%;\n\theight: 100%;\n\ttransform-origin: 0 0;\n\tpointer-events: none;\n\t-webkit-tap-highlight-color: transparent;\n\t-webkit-user-select: none;\n\t-moz-user-select: none;\n\t-ms-user-select: none;\n\tuser-select: none;\n}\n\n::-webkit-scrollbar {\n\twidth: 8px;\n\tbackground-color: #223;\n}\n::-webkit-scrollbar-thumb {\n\tborder-radius: 4px;\n\tbackground-color: #7272c2;\n}\n\n::selection {\n\tbackground-color:  #5936d6;\n\tcolor:  #fff;\n}\n\n.hide-cursor {\n\tcursor: none;\n}\n\n.hidden {\n\tdisplay: none;\n}\n\ninput[type="text"] {\n\tmargin: 0;\n\tpadding: 4px 8px;\n\tclip-path: polygon(0 0, 100% 0, calc(100% - 8px) 100%, 0 100%);\n\tfont-size: 24px;\n\tfont-weight: bold;\n\ttext-indent: 6px; /* Fixes italic text being cut off. */\n\tcolor: var(--text-color);\n\tbackground-color: var(--surface-tertiary-color);\n\tborder: none;\n\tpointer-events: auto;\n}\ninput[type="text"]::placeholder {\n\tcolor: var(--text-color);\n\topacity: 0.25;\n}\ninput[type="text"]:focus-visible {\n\toutline: none;\n}\n\ninput[type="range"] {\n\tmargin: 0;\n\tpadding: 0;\n\t-webkit-appearance: none;\n\tappearance: none;\n\tbackground: transparent;\n\tcursor: pointer;\n\taccent-color: var(--text-color);\n}\ninput[type="range"]::-webkit-slider-runnable-track {\n\tbackground-color: var(--surface-tertiary-color);\n\theight: 10px;\n}\ninput[type="range"]::-moz-range-track {\n\tbackground-color: var(--surface-tertiary-color);\n\theight: 10px;\n}\ninput[type="range"]::-webkit-slider-thumb {\n\t-webkit-appearance: none;\n\tappearance: none;\n\tborder-radius: 0;\n\tbackground: var(--text-color);\n\twidth: 32px;\n\theight: 32px;\n\tmargin: -13px 0 0 0;\n\tborder: 4px solid var(--button-color);\n\toutline: 2px solid var(--text-color);\n}\ninput[type="range"]::-webkit-slider-thumb:hover {\n\tborder: 4px solid var(--button-hover-color);\n}\n@media (hover: none) {\n\tinput[type="range"]::-webkit-slider-thumb:hover {\n\t\tborder: 4px solid var(--button-color);\n\t}\n}\ninput[type="range"]::-webkit-slider-thumb:active {\n\tborder: 4px solid var(--button-active-color);\n}\ninput[type="range"]::-moz-range-thumb {\n\t-webkit-appearance: none;\n\tappearance: none;\n\tborder-radius: 0;\n\tbackground: var(--text-color);\n\twidth: 24px;\n\theight: 24px;\n\tborder: 4px solid var(--button-color);\n\toutline: 2px solid var(--text-color);\n}\ninput[type="range"]::-moz-range-thumb:hover {\n\tborder: 4px solid var(--button-hover-color);\n}\n@media (hover: none) {\n\tinput[type="range"]::-moz-range-thumb:hover {\n\t\tborder: 4px solid var(--button-color);\n\t}\n}\ninput[type="range"]::-moz-range-thumb:active {\n\tborder: 4px solid var(--button-active-color);\n}\n\n.button {\n\tposition: relative;\n\tmargin: 0;\n\tpadding: 8px 18px;\n\tbackground-color: var(--button-color);\n\tborder: none;\n\tclip-path: polygon(8px 0, 100% 0, calc(100% - 8px) 100%, 0 100%);\n\tcolor: var(--text-color);\n\tfont-size: 32px;\n\n\tpointer-events: auto;\n\t-webkit-user-select: none;\n\t-moz-user-select: none;\n\t-ms-user-select: none;\n\tuser-select: none;\n\tcursor: pointer;\n}\n.button::after {\n\tcontent: "";\n\tposition: absolute;\n\tleft: 0;\n\tbottom: 0;\n\tz-index: -1;\n\twidth: 0;\n\theight: 100%;\n\tbackground-color: var(--button-hover-color);\n\tborder-bottom: 2px solid var(--text-color);\n\ttransition: width 0.1s ease-in-out;\n}\n.button:hover::after {\n\twidth: 100%;\n}\n@media (hover: none) {\n\t.button::after {\n\t\tbackground-color: var(--button-active-color);\n\t}\n\n\t.button:hover::after {\n\t\twidth: 0;\n\t}\n}\n.button:active::after {\n\tbackground-color: var(--button-active-color);\n\twidth: 100%;\n}\n.button:focus-visible {\n\tbackground-color: var(--button-hover-color);\n\ttext-decoration: underline;\n\toutline: none;\n}\n.button > img.button-icon {\n\tmargin: -6px -4px 0 -4px;\n\tpadding: 0;\n\twidth: 32px;\n\theight: 32px;\n\tvertical-align: middle;\n\tpointer-events: none;\n}\n.button:disabled {\n\tbackground-color: var(--button-disabled-color);\n\tcolor: var(--text-disabled-color);\n\tcursor: default;\n}\n.button:disabled:after {\n\tcontent: none;\n}\n.button:disabled > img.button-icon {\n\topacity: 0.3;\n}\n`,
            "",
        ]);
        const g = u;
    },
    8718: (e, t, n) => {
        "use strict";
        e.exports = n.p + "images/search.svg";
    },
    8768: (e, t, n) => {
        "use strict";
        n.d(t, { A: () => o });
        var i = n(1601),
            r = n.n(i),
            a = n(6314),
            s = n.n(a)()(r());
        s.push([
            e.id,
            "\n.preview-toolbar {\n\tposition: absolute;\n\tleft: var(--safe-area-horizontal);\n\tbottom: 0;\n\tpadding: 8px 10px 8px 8px;\n\tbackground-color: var(--surface-color);\n\tclip-path: polygon(0 0, 100% 0, calc(100% - 8px) 100%, 0 100%);\n}\n\n#ui.has-safe-area-horizontal .preview-toolbar {\n\tpadding-left: 10px;\n\tclip-path: polygon(10px 0, 100% 0, calc(100% - 8px) 100%, 0 100%);\n}\n",
            "",
        ]);
        const o = s;
    },
    8787: (e, t, n) => {
        "use strict";
        e.exports = n.p + "images/back.svg";
    },
    8875: (e, t, n) => {
        "use strict";
        e.exports = n.p + "images/clouds.jpg";
    },
    8889: (e, t, n) => {
        "use strict";
        e.exports = n.p + "images/editor.svg";
    },
    8903: (e, t, n) => {
        "use strict";
        e.exports = n.p + "images/pmllogo.svg";
    },
    8909: (e, t, n) => {
        "use strict";
        n.d(t, { A: () => o });
        var i = n(1601),
            r = n.n(i),
            a = n(6314),
            s = n.n(a)()(r());
        s.push([
            e.id,
            "\n.editor-checkpoint-order > .buttons {\n\tdisplay: inline-block;\n\tvertical-align: bottom;\n}\n.editor-checkpoint-order > .buttons > button {\n\tdisplay: block;\n\tmargin: 0;\n\tpadding: 0;\n\tborder: none;\n\tbackground-color: var(--button-color);\n\tpointer-events: auto;\n\tcursor: pointer;\n}\n.editor-checkpoint-order > .buttons > button:hover {\n\tbackground-color: var(--button-hover-color);\n}\n.editor-checkpoint-order > .buttons > button:active {\n\tbackground-color: var(--button-active-color);\n}\n@media (hover: none) {\n\t.editor-checkpoint-order > .buttons > button:hover {\n\t\tbackground-color: var(--button-color);\n\t}\n}\n\n.editor-checkpoint-order > .buttons > button > img {\n\tmargin: 0;\n\tpadding: 0 6px;\n\twidth: 20px;\n\theight: 20px;\n\tvertical-align: bottom;\n\tpointer-events: none;\n}\n.editor-checkpoint-order.touch > .buttons > button > img {\n\tpadding: 24px;\n\twidth: 40px;\n\theight: 40px;\n}\n\n.editor-checkpoint-order > p {\n\tmargin: 0;\n\tpadding: 0 10px;\n\tdisplay: inline-block;\n\tvertical-align: bottom;\n\tline-height: 40px;\n\tmin-width: 275px;\n\tfont-size: 26px;\n\ttext-align: center;\n\tbackground-color: var(--surface-transparent-color);\n\tcolor: var(--text-color);\n}\n.editor-checkpoint-order.touch > p {\n\tline-height: calc((40px + 2 * 24px) * 2);\n}\n",
            "",
        ]);
        const o = s;
    },
    9027: (e, t, n) => {
        "use strict";
        e.exports = n.p + "images/customize.svg";
    },
    9062: (e, t, n) => {
        "use strict";
        e.exports = n.p + "images/rotation_axis_y_positive.svg";
    },
    9077: (e, t, n) => {
        "use strict";
        e.exports = n.p + "images/import.svg";
    },
    9207: (e, t, n) => {
        "use strict";
        n.d(t, { A: () => o });
        var i = n(1601),
            r = n.n(i),
            a = n(6314),
            s = n.n(a)()(r());
        s.push([
            e.id,
            "\n#transition-layer {\n\tposition: absolute;\n\tleft: 0;\n\ttop: 0;\n\tz-index: 1;\n\twidth: 100%;\n\theight: 100%;\n\tbackground-color: #000;\n\tpointer-events: none;\n\n\topacity: 0;\n\ttransition: 0.25s ease-in-out opacity;\n}\n",
            "",
        ]);
        const o = s;
    },
    9236: (e, t, n) => {
        "use strict";
        e.exports = n.p + "images/play.svg";
    },
    9242: (e, t, n) => {
        "use strict";
        n.d(t, { A: () => o });
        var i = n(1601),
            r = n.n(i),
            a = n(6314),
            s = n.n(a)()(r());
        s.push([
            e.id,
            "\n.editor-help > .background {\n\tposition: absolute;\n\tleft: 0;\n\ttop: 0;\n\tz-index: 1;\n\twidth: 100%;\n\theight: 100%;\n\tbackground-color: rgba(20, 20, 30, 0.5);\n\tpointer-events: auto;\n}\n\n.editor-help > .container {\n\tposition: absolute;\n\tleft: calc(50% - 80% / 2);\n\ttop: 0;\n\tz-index: 2;\n\tdisplay: flex;\n\tflex-direction: column;\n\tbox-sizing: border-box;\n\twidth: 80%;\n\theight: 100%;\n\tbackground-color: var(--surface-color);\n}\n\n.editor-help > .container > h1 {\n\tmargin: 10px;\n\tpadding: 0;\n\tfont-weight: normal;\n\tfont-size: 38px;\n\ttext-align: center;\n\tcolor: var(--text-color);\n}\n\n.editor-help > .container > .content {\n\tflex-grow: 1;\n\tpadding: 40px;\n\tbackground-color: var(--surface-secondary-color);\n\toverflow-y: auto;\n\tpointer-events: auto;\n}\n\n.editor-help > .container > .content > h2 {\n\tmargin: 32px 0 16px 0;\n\tpadding: 0;\n\tfont-weight: normal;\n\tfont-size: 30px;\n\tcolor: var(--text-color);\n\tborder-bottom: 2px solid var(--text-color);\n}\n.editor-help > .container > .content > h2:first-of-type {\n\tmargin-top: 0;\n}\n\n.editor-help > .container > .content > p {\n\tmargin: 0;\n\tpadding: 0;\n\tfont-size: 20px;\n\tcolor: var(--text-color);\n\twhite-space: pre-wrap;\n}\n\n.editor-help > .container > .content > .part-images {\n\tdisplay: flex;\n\tjustify-content: space-around;\n}\n\n.editor-help > .container > .content > .part-images > div {\n\tdisplay: flex;\n\tflex-direction: column;\n}\n\n.editor-help > .container > .content > .part-images > div > img {\n\twidth: 128px;\n\theight: 128px;\n\tfilter: drop-shadow(0 4px 5px rgba(0, 0, 0, 0.4));\n\tpointer-events: none;\n\ttransition: opacity 0.25s ease-out;\n}\n.editor-help > .container > .content > .part-images > div > img.loading {\n\topacity: 0;\n}\n\n.editor-help > .container > .content > .part-images > div > span {\n\tmargin: 0;\n\tpadding: 0;\n\tfont-size: 20px;\n\tcolor: var(--text-color);\n\ttext-align: center;\n}\n\n.editor-help > .container > .button-wrapper > button {\n\tmargin: 10px;\n}\n",
            "",
        ]);
        const o = s;
    },
    9391: (e, t, n) => {
        "use strict";
        e.exports = n.p + "images/official_tracks.jpg";
    },
    9570: (e, t, n) => {
        "use strict";
        e.exports = n.p + "images/preview.svg";
    },
    9708: (e, t, n) => {
        "use strict";
        e.exports = n.p + "images/pause.svg";
    },
    9809: (e, t, n) => {
        "use strict";
        e.exports = n.p + "images/checkmark.svg";
    },
};
var n = {};







































































































































































































































function i(e) {
    var r = n[e];
    if (void 0 !== r) return r.exports;
    var a = (n[e] = { id: e, exports: {} });
    return t[e](a, a.exports, i), a.exports;
}
(i.m = t),
    (i.amdO = {}),
    (i.n = (e) => {
        var t = e && e.__esModule ? () => e.default : () => e;
        return i.d(t, { a: t }), t;
    }),
    (i.d = (e, t) => {
        for (var n in t)
            i.o(t, n) &&
                !i.o(e, n) &&
                Object.defineProperty(e, n, { enumerable: !0, get: t[n] });
    }),
    (i.f = {}),
    (i.e = (e) =>
        Promise.all(Object.keys(i.f).reduce((t, n) => (i.f[n](e, t), t), []))),
    (i.u = (e) => e + ".bundle.js"),
    (i.g = (function () {
        if ("object" == typeof globalThis) return globalThis;
        try {
            return this || new Function("return this")();
        } catch (e) {
            if ("object" == typeof window) return window;
        }
    })()),
    (i.o = (e, t) => Object.prototype.hasOwnProperty.call(e, t)),
    (e = {}),
    (i.l = (t, n, r, a) => {
        if (e[t]) e[t].push(n);
        else {
            var s, o;
            if (void 0 !== r)
                for (
                    var l = document.getElementsByTagName("script"), c = 0;
                    c < l.length;
                    c++
                ) {
                    var h = l[c];
                    if (h.getAttribute("src") == t) {
                        s = h;
                        break;
                    }
                }
            s ||
                ((o = !0),
                    ((s = document.createElement("script")).charset = "utf-8"),
                    (s.timeout = 120),
                    i.nc && s.setAttribute("nonce", i.nc),
                    (s.src = t)),
                (e[t] = [n]);
            var d = (n, i) => {
                (s.onerror = s.onload = null), clearTimeout(u);
                var r = e[t];
                if (
                    (delete e[t],
                        s.parentNode && s.parentNode.removeChild(s),
                        r && r.forEach((e) => e(i)),
                        n)
                )
                    return n(i);
            },
                u = setTimeout(
                    d.bind(null, void 0, { type: "timeout", target: s }),
                    12e4
                );
            (s.onerror = d.bind(null, s.onerror)),
                (s.onload = d.bind(null, s.onload)),
                o && document.head.appendChild(s);
        }
    }),
    (i.r = (e) => {
        "undefined" != typeof Symbol &&
            Symbol.toStringTag &&
            Object.defineProperty(e, Symbol.toStringTag, { value: "Module" }),
            Object.defineProperty(e, "__esModule", { value: !0 });
    }),
    (() => {
        var e;
        i.g.importScripts && (e = i.g.location + "");
        var t = i.g.document;
        if (
            !e &&
            t &&
            (t.currentScript &&
                "SCRIPT" === t.currentScript.tagName.toUpperCase() &&
                (e = t.currentScript.src),
                !e)
        ) {
            var n = t.getElementsByTagName("script");
            if (n.length)
                for (var r = n.length - 1; r > -1 && (!e || !/^http(s?):/.test(e));)
                    e = n[r--].src;
        }
        if (!e)
            throw new Error(
                "Automatic publicPath is not supported in this browser"
            );
        (e = e
            .replace(/^blob:/, "")
            .replace(/#.*$/, "")
            .replace(/\?.*$/, "")
            .replace(/\/[^\/]+$/, "/")),
            (i.p = e);
    })(),
    (() => {
        i.b = document.baseURI || self.location.href;
        var e = { 792: 0 };
        i.f.j = (t, n) => {
            var r = i.o(e, t) ? e[t] : void 0;
            if (0 !== r)
                if (r) n.push(r[2]);
                else {
                    var a = new Promise((n, i) => (r = e[t] = [n, i]));
                    n.push((r[2] = a));
                    var s = i.p + i.u(t),
                        o = new Error();
                    i.l(
                        s,
                        (n) => {
                            if (i.o(e, t) && (0 !== (r = e[t]) && (e[t] = void 0), r)) {
                                var a = n && ("load" === n.type ? "missing" : n.type),
                                    s = n && n.target && n.target.src;
                                (o.message =
                                    "Loading chunk " + t + " failed.\n(" + a + ": " + s + ")"),
                                    (o.name = "ChunkLoadError"),
                                    (o.type = a),
                                    (o.request = s),
                                    r[1](o);
                            }
                        },
                        "chunk-" + t,
                        t
                    );
                }
        };
        var t = (t, n) => {
            var r,
                a,
                [s, o, l] = n,
                c = 0;
            if (s.some((t) => 0 !== e[t])) {
                for (r in o) i.o(o, r) && (i.m[r] = o[r]);
                if (l) l(i);
            }
            for (t && t(n); c < s.length; c++)
                (a = s[c]), i.o(e, a) && e[a] && e[a][0](), (e[a] = 0);
        },
            n = (self.webpackChunk = self.webpackChunk || []);
        n.forEach(t.bind(null, 0)), (n.push = t.bind(null, n.push.bind(n)));
    })(),
    (i.nc = void 0),

    (() => {
        "use strict";
        var e = i(5072)
            , t = i.n(e)
            , n = i(7825)
            , r = i.n(n)
            , a = i(7659)
            , s = i.n(a)
            , o = i(5056)
            , l = i.n(o)
            , c = i(540)
            , h = i.n(c)
            , d = i(1113)
            , u = i.n(d)
            , p = i(8419)
            , f = {};
        f.styleTagTransform = u(),
            f.setAttributes = l(),
            f.insert = s().bind(null, "head"),
            f.domAPI = r(),
            f.insertStyleElement = h();
        t()(p.A, f);
        p.A && p.A.locals && p.A.locals;
        var m = i(6546);
        (0,
            m.F3)("App", {
                web: () => i.e(168).then(i.bind(i, 1168)).then((e => new e.AppWeb))
            });
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
            return Math.max(t, Math.min(n, e))
        }
        function Wt(e, t) {
            return (e % t + t) % t
        }
        function Ht(e, t, n) {
            return (1 - n) * e + n * t
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
                    throw new Error("Invalid component type.")
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
                    throw new Error("Invalid component type.")
            }
        }
        const jt = {
            DEG2RAD: Ut,
            RAD2DEG: zt,
            generateUUID: Ot,
            clamp: Ft,
            euclideanModulo: Wt,
            mapLinear: function (e, t, n, i, r) {
                return i + (e - t) * (r - i) / (n - t)
            },
            inverseLerp: function (e, t, n) {
                return e !== t ? (n - e) / (t - e) : 0
            },
            lerp: Ht,
            damp: function (e, t, n, i) {
                return Ht(e, t, 1 - Math.exp(-n * i))
            },
            pingpong: function (e, t = 1) {
                return t - Math.abs(Wt(e, 2 * t) - t)
            },
            smoothstep: function (e, t, n) {
                return e <= t ? 0 : e >= n ? 1 : (e = (e - t) / (n - t)) * e * (3 - 2 * e)
            },
            smootherstep: function (e, t, n) {
                return e <= t ? 0 : e >= n ? 1 : (e = (e - t) / (n - t)) * e * e * (e * (6 * e - 15) + 10)
            },
            randInt: function (e, t) {
                return e + Math.floor(Math.random() * (t - e + 1))
            },
            randFloat: function (e, t) {
                return e + Math.random() * (t - e)
            },
            randFloatSpread: function (e) {
                return e * (.5 - Math.random())
            },
            seededRandom: function (e) {
                void 0 !== e && (Bt = e);
                let t = Bt += 1831565813;
                return t = Math.imul(t ^ t >>> 15, 1 | t),
                    t ^= t + Math.imul(t ^ t >>> 7, 61 | t),
                    ((t ^ t >>> 14) >>> 0) / 4294967296
            },
            degToRad: function (e) {
                return e * Ut
            },
            radToDeg: function (e) {
                return e * zt
            },
            isPowerOfTwo: function (e) {
                return !(e & e - 1) && 0 !== e
            },
            ceilPowerOfTwo: function (e) {
                return Math.pow(2, Math.ceil(Math.log(e) / Math.LN2))
            },
            floorPowerOfTwo: function (e) {
                return Math.pow(2, Math.floor(Math.log(e) / Math.LN2))
            },
            setQuaternionFromProperEuler: function (e, t, n, i, r) {
                const a = Math.cos
                    , s = Math.sin
                    , o = a(n / 2)
                    , l = s(n / 2)
                    , c = a((t + i) / 2)
                    , h = s((t + i) / 2)
                    , d = a((t - i) / 2)
                    , u = s((t - i) / 2)
                    , p = a((i - t) / 2)
                    , f = s((i - t) / 2);
                switch (r) {
                    case "XYX":
                        e.set(o * h, l * d, l * u, o * c);
                        break;
                    case "YZY":
                        e.set(l * u, o * h, l * d, o * c);
                        break;
                    case "ZXZ":
                        e.set(l * d, l * u, o * h, o * c);
                        break;
                    case "XZX":
                        e.set(o * h, l * f, l * p, o * c);
                        break;
                    case "YXY":
                        e.set(l * p, o * h, l * f, o * c);
                        break;
                    case "ZYZ":
                        e.set(l * f, l * p, o * h, o * c);
                        break;
                    default:
                        console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: " + r)
                }
            },
            normalize: Gt,
            denormalize: Vt
        };
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


    })();






















// imporant

class Zt {
    constructor(e = 0, t = 0, n = 0) {
        (Zt.prototype.isVector3 = !0),
            (this.x = e),
            (this.y = t),
            (this.z = n);
    }
    set(e, t, n) {
        return (
            void 0 === n && (n = this.z),
            (this.x = e),
            (this.y = t),
            (this.z = n),
            this
        );
    }
    setScalar(e) {
        return (this.x = e), (this.y = e), (this.z = e), this;
    }
    setX(e) {
        return (this.x = e), this;
    }
    setY(e) {
        return (this.y = e), this;
    }
    setZ(e) {
        return (this.z = e), this;
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
                throw new Error("index is out of range: " + e);
        }
        return this;
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
                throw new Error("index is out of range: " + e);
        }
    }
    clone() {
        return new this.constructor(this.x, this.y, this.z);
    }
    copy(e) {
        return (this.x = e.x), (this.y = e.y), (this.z = e.z), this;
    }
    add(e) {
        return (this.x += e.x), (this.y += e.y), (this.z += e.z), this;
    }
    addScalar(e) {
        return (this.x += e), (this.y += e), (this.z += e), this;
    }
    addVectors(e, t) {
        return (
            (this.x = e.x + t.x),
            (this.y = e.y + t.y),
            (this.z = e.z + t.z),
            this
        );
    }
    addScaledVector(e, t) {
        return (
            (this.x += e.x * t), (this.y += e.y * t), (this.z += e.z * t), this
        );
    }
    sub(e) {
        return (this.x -= e.x), (this.y -= e.y), (this.z -= e.z), this;
    }
    subScalar(e) {
        return (this.x -= e), (this.y -= e), (this.z -= e), this;
    }
    subVectors(e, t) {
        return (
            (this.x = e.x - t.x),
            (this.y = e.y - t.y),
            (this.z = e.z - t.z),
            this
        );
    }
    multiply(e) {
        return (this.x *= e.x), (this.y *= e.y), (this.z *= e.z), this;
    }
    multiplyScalar(e) {
        return (this.x *= e), (this.y *= e), (this.z *= e), this;
    }
    multiplyVectors(e, t) {
        return (
            (this.x = e.x * t.x),
            (this.y = e.y * t.y),
            (this.z = e.z * t.z),
            this
        );
    }
    applyEuler(e) {
        return this.applyQuaternion($t.setFromEuler(e));
    }
    applyAxisAngle(e, t) {
        return this.applyQuaternion($t.setFromAxisAngle(e, t));
    }
    applyMatrix3(e) {
        const t = this.x,
            n = this.y,
            i = this.z,
            r = e.elements;
        return (
            (this.x = r[0] * t + r[3] * n + r[6] * i),
            (this.y = r[1] * t + r[4] * n + r[7] * i),
            (this.z = r[2] * t + r[5] * n + r[8] * i),
            this
        );
    }
    applyNormalMatrix(e) {
        return this.applyMatrix3(e).normalize();
    }
    applyMatrix4(e) {
        const t = this.x,
            n = this.y,
            i = this.z,
            r = e.elements,
            a = 1 / (r[3] * t + r[7] * n + r[11] * i + r[15]);
        return (
            (this.x = (r[0] * t + r[4] * n + r[8] * i + r[12]) * a),
            (this.y = (r[1] * t + r[5] * n + r[9] * i + r[13]) * a),
            (this.z = (r[2] * t + r[6] * n + r[10] * i + r[14]) * a),
            this
        );
    }
    applyQuaternion(e) {
        const t = this.x,
            n = this.y,
            i = this.z,
            r = e.x,
            a = e.y,
            s = e.z,
            o = e.w,
            l = 2 * (a * i - s * n),
            c = 2 * (s * t - r * i),
            h = 2 * (r * n - a * t);
        return (
            (this.x = t + o * l + a * h - s * c),
            (this.y = n + o * c + s * l - r * h),
            (this.z = i + o * h + r * c - a * l),
            this
        );
    }
    project(e) {
        return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(
            e.projectionMatrix
        );
    }
    unproject(e) {
        return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(
            e.matrixWorld
        );
    }
    transformDirection(e) {
        const t = this.x,
            n = this.y,
            i = this.z,
            r = e.elements;
        return (
            (this.x = r[0] * t + r[4] * n + r[8] * i),
            (this.y = r[1] * t + r[5] * n + r[9] * i),
            (this.z = r[2] * t + r[6] * n + r[10] * i),
            this.normalize()
        );
    }
    divide(e) {
        return (this.x /= e.x), (this.y /= e.y), (this.z /= e.z), this;
    }
    divideScalar(e) {
        return this.multiplyScalar(1 / e);
    }
    min(e) {
        return (
            (this.x = Math.min(this.x, e.x)),
            (this.y = Math.min(this.y, e.y)),
            (this.z = Math.min(this.z, e.z)),
            this
        );
    }
    max(e) {
        return (
            (this.x = Math.max(this.x, e.x)),
            (this.y = Math.max(this.y, e.y)),
            (this.z = Math.max(this.z, e.z)),
            this
        );
    }
    clamp(e, t) {
        return (
            (this.x = _t(this.x, e.x, t.x)),
            (this.y = _t(this.y, e.y, t.y)),
            (this.z = _t(this.z, e.z, t.z)),
            this
        );
    }
    clampScalar(e, t) {
        return (
            (this.x = _t(this.x, e, t)),
            (this.y = _t(this.y, e, t)),
            (this.z = _t(this.z, e, t)),
            this
        );
    }
    clampLength(e, t) {
        const n = this.length();
        return this.divideScalar(n || 1).multiplyScalar(_t(n, e, t));
    }
    floor() {
        return (
            (this.x = Math.floor(this.x)),
            (this.y = Math.floor(this.y)),
            (this.z = Math.floor(this.z)),
            this
        );
    }
    ceil() {
        return (
            (this.x = Math.ceil(this.x)),
            (this.y = Math.ceil(this.y)),
            (this.z = Math.ceil(this.z)),
            this
        );
    }
    round() {
        return (
            (this.x = Math.round(this.x)),
            (this.y = Math.round(this.y)),
            (this.z = Math.round(this.z)),
            this
        );
    }
    roundToZero() {
        return (
            (this.x = Math.trunc(this.x)),
            (this.y = Math.trunc(this.y)),
            (this.z = Math.trunc(this.z)),
            this
        );
    }
    negate() {
        return (
            (this.x = -this.x), (this.y = -this.y), (this.z = -this.z), this
        );
    }
    dot(e) {
        return this.x * e.x + this.y * e.y + this.z * e.z;
    }
    lengthSq() {
        return this.x * this.x + this.y * this.y + this.z * this.z;
    }
    length() {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    }
    manhattanLength() {
        return Math.abs(this.x) + Math.abs(this.y) + Math.abs(this.z);
    }
    normalize() {
        return this.divideScalar(this.length() || 1);
    }
    setLength(e) {
        return this.normalize().multiplyScalar(e);
    }
    lerp(e, t) {
        return (
            (this.x += (e.x - this.x) * t),
            (this.y += (e.y - this.y) * t),
            (this.z += (e.z - this.z) * t),
            this
        );
    }
    lerpVectors(e, t, n) {
        return (
            (this.x = e.x + (t.x - e.x) * n),
            (this.y = e.y + (t.y - e.y) * n),
            (this.z = e.z + (t.z - e.z) * n),
            this
        );
    }
    cross(e) {
        return this.crossVectors(this, e);
    }
    crossVectors(e, t) {
        const n = e.x,
            i = e.y,
            r = e.z,
            a = t.x,
            s = t.y,
            o = t.z;
        return (
            (this.x = i * o - r * s),
            (this.y = r * a - n * o),
            (this.z = n * s - i * a),
            this
        );
    }
    projectOnVector(e) {
        const t = e.lengthSq();
        if (0 === t) return this.set(0, 0, 0);
        const n = e.dot(this) / t;
        return this.copy(e).multiplyScalar(n);
    }
    projectOnPlane(e) {
        return Jt.copy(this).projectOnVector(e), this.sub(Jt);
    }
    reflect(e) {
        return this.sub(Jt.copy(e).multiplyScalar(2 * this.dot(e)));
    }
    angleTo(e) {
        const t = Math.sqrt(this.lengthSq() * e.lengthSq());
        if (0 === t) return Math.PI / 2;
        const n = this.dot(e) / t;
        return Math.acos(_t(n, -1, 1));
    }
    distanceTo(e) {
        return Math.sqrt(this.distanceToSquared(e));
    }
    distanceToSquared(e) {
        const t = this.x - e.x,
            n = this.y - e.y,
            i = this.z - e.z;
        return t * t + n * n + i * i;
    }
    manhattanDistanceTo(e) {
        return (
            Math.abs(this.x - e.x) +
            Math.abs(this.y - e.y) +
            Math.abs(this.z - e.z)
        );
    }
    setFromSpherical(e) {
        return this.setFromSphericalCoords(e.radius, e.phi, e.theta);
    }
    setFromSphericalCoords(e, t, n) {
        const i = Math.sin(t) * e;
        return (
            (this.x = i * Math.sin(n)),
            (this.y = Math.cos(t) * e),
            (this.z = i * Math.cos(n)),
            this
        );
    }
    setFromCylindrical(e) {
        return this.setFromCylindricalCoords(e.radius, e.theta, e.y);
    }
    setFromCylindricalCoords(e, t, n) {
        return (
            (this.x = e * Math.sin(t)),
            (this.y = n),
            (this.z = e * Math.cos(t)),
            this
        );
    }
    setFromMatrixPosition(e) {
        const t = e.elements;
        return (this.x = t[12]), (this.y = t[13]), (this.z = t[14]), this;
    }
    setFromMatrixScale(e) {
        const t = this.setFromMatrixColumn(e, 0).length(),
            n = this.setFromMatrixColumn(e, 1).length(),
            i = this.setFromMatrixColumn(e, 2).length();
        return (this.x = t), (this.y = n), (this.z = i), this;
    }
    setFromMatrixColumn(e, t) {
        return this.fromArray(e.elements, 4 * t);
    }
    setFromMatrix3Column(e, t) {
        return this.fromArray(e.elements, 3 * t);
    }
    setFromEuler(e) {
        return (this.x = e._x), (this.y = e._y), (this.z = e._z), this;
    }
    setFromColor(e) {
        return (this.x = e.r), (this.y = e.g), (this.z = e.b), this;
    }
    equals(e) {
        return e.x === this.x && e.y === this.y && e.z === this.z;
    }
    fromArray(e, t = 0) {
        return (
            (this.x = e[t]), (this.y = e[t + 1]), (this.z = e[t + 2]), this
        );
    }
    toArray(e = [], t = 0) {
        return (e[t] = this.x), (e[t + 1] = this.y), (e[t + 2] = this.z), e;
    }
    fromBufferAttribute(e, t) {
        return (
            (this.x = e.getX(t)),
            (this.y = e.getY(t)),
            (this.z = e.getZ(t)),
            this
        );
    }
    random() {
        return (
            (this.x = Math.random()),
            (this.y = Math.random()),
            (this.z = Math.random()),
            this
        );
    }
    randomDirection() {
        const e = Math.random() * Math.PI * 2,
            t = 2 * Math.random() - 1,
            n = Math.sqrt(1 - t * t);
        return (
            (this.x = n * Math.cos(e)),
            (this.y = t),
            (this.z = n * Math.sin(e)),
            this
        );
    }
    *[Symbol.iterator]() {
        yield this.x, yield this.y, yield this.z;
    }
}





class Kt {
    constructor(e, t, n, i, r, a, s, o, l) {
        (Kt.prototype.isMatrix3 = !0),
            (this.elements = [1, 0, 0, 0, 1, 0, 0, 0, 1]),
            void 0 !== e && this.set(e, t, n, i, r, a, s, o, l);
    }
    set(e, t, n, i, r, a, s, o, l) {
        const c = this.elements;
        return (
            (c[0] = e),
            (c[1] = i),
            (c[2] = s),
            (c[3] = t),
            (c[4] = r),
            (c[5] = o),
            (c[6] = n),
            (c[7] = a),
            (c[8] = l),
            this
        );
    }
    identity() {
        return this.set(1, 0, 0, 0, 1, 0, 0, 0, 1), this;
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
            this
        );
    }
    extractBasis(e, t, n) {
        return (
            e.setFromMatrix3Column(this, 0),
            t.setFromMatrix3Column(this, 1),
            n.setFromMatrix3Column(this, 2),
            this
        );
    }
    setFromMatrix4(e) {
        const t = e.elements;
        return (
            this.set(t[0], t[4], t[8], t[1], t[5], t[9], t[2], t[6], t[10]),
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
            s = n[3],
            o = n[6],
            l = n[1],
            c = n[4],
            h = n[7],
            d = n[2],
            u = n[5],
            p = n[8],
            f = i[0],
            m = i[3],
            g = i[6],
            v = i[1],
            w = i[4],
            y = i[7],
            b = i[2],
            A = i[5],
            x = i[8];
        return (
            (r[0] = a * f + s * v + o * b),
            (r[3] = a * m + s * w + o * A),
            (r[6] = a * g + s * y + o * x),
            (r[1] = l * f + c * v + h * b),
            (r[4] = l * m + c * w + h * A),
            (r[7] = l * g + c * y + h * x),
            (r[2] = d * f + u * v + p * b),
            (r[5] = d * m + u * w + p * A),
            (r[8] = d * g + u * y + p * x),
            this
        );
    }
    multiplyScalar(e) {
        const t = this.elements;
        return (
            (t[0] *= e),
            (t[3] *= e),
            (t[6] *= e),
            (t[1] *= e),
            (t[4] *= e),
            (t[7] *= e),
            (t[2] *= e),
            (t[5] *= e),
            (t[8] *= e),
            this
        );
    }
    determinant() {
        const e = this.elements,
            t = e[0],
            n = e[1],
            i = e[2],
            r = e[3],
            a = e[4],
            s = e[5],
            o = e[6],
            l = e[7],
            c = e[8];
        return (
            t * a * c -
            t * s * l -
            n * r * c +
            n * s * o +
            i * r * l -
            i * a * o
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
            h = c * a - s * l,
            d = s * o - c * r,
            u = l * r - a * o,
            p = t * h + n * d + i * u;
        if (0 === p) return this.set(0, 0, 0, 0, 0, 0, 0, 0, 0);
        const f = 1 / p;
        return (
            (e[0] = h * f),
            (e[1] = (i * l - c * n) * f),
            (e[2] = (s * n - i * a) * f),
            (e[3] = d * f),
            (e[4] = (c * t - i * o) * f),
            (e[5] = (i * r - s * t) * f),
            (e[6] = u * f),
            (e[7] = (n * o - l * t) * f),
            (e[8] = (a * t - n * r) * f),
            this
        );
    }
    transpose() {
        let e;
        const t = this.elements;
        return (
            (e = t[1]),
            (t[1] = t[3]),
            (t[3] = e),
            (e = t[2]),
            (t[2] = t[6]),
            (t[6] = e),
            (e = t[5]),
            (t[5] = t[7]),
            (t[7] = e),
            this
        );
    }
    getNormalMatrix(e) {
        return this.setFromMatrix4(e).invert().transpose();
    }
    transposeIntoArray(e) {
        const t = this.elements;
        return (
            (e[0] = t[0]),
            (e[1] = t[3]),
            (e[2] = t[6]),
            (e[3] = t[1]),
            (e[4] = t[4]),
            (e[5] = t[7]),
            (e[6] = t[2]),
            (e[7] = t[5]),
            (e[8] = t[8]),
            this
        );
    }
    setUvTransform(e, t, n, i, r, a, s) {
        const o = Math.cos(r),
            l = Math.sin(r);
        return (
            this.set(
                n * o,
                n * l,
                -n * (o * a + l * s) + a + e,
                -i * l,
                i * o,
                -i * (-l * a + o * s) + s + t,
                0,
                0,
                1
            ),
            this
        );
    }
    scale(e, t) {
        return this.premultiply(qt.makeScale(e, t)), this;
    }
    rotate(e) {
        return this.premultiply(qt.makeRotation(-e)), this;
    }
    translate(e, t) {
        return this.premultiply(qt.makeTranslation(e, t)), this;
    }
    makeTranslation(e, t) {
        return (
            e.isVector2
                ? this.set(1, 0, e.x, 0, 1, e.y, 0, 0, 1)
                : this.set(1, 0, e, 0, 1, t, 0, 0, 1),
            this
        );
    }
    makeRotation(e) {
        const t = Math.cos(e),
            n = Math.sin(e);
        return this.set(t, -n, 0, n, t, 0, 0, 0, 1), this;
    }
    makeScale(e, t) {
        return this.set(e, 0, 0, 0, t, 0, 0, 0, 1), this;
    }
    equals(e) {
        const t = this.elements,
            n = e.elements;
        for (let e = 0; e < 9; e++) if (t[e] !== n[e]) return !1;
        return !0;
    }
    fromArray(e, t = 0) {
        for (let n = 0; n < 9; n++) this.elements[n] = e[n + t];
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
            e
        );
    }
    clone() {
        return new this.constructor().fromArray(this.elements);
    }
}











class zh {
    constructor() {
        Mh.set(this, void 0),
            Th.set(this, void 0),
            Ch.set(this, void 0),
            Ih.set(this, void 0),
            Rh.set(this, void 0),
            Ph.set(this, []),
            Bh.set(this, new Map()),
            Lh.set(this, []),
            Uh.set(this, new Map()),
            Nh.set(this, null),
            kh.set(this, null),
            Fh(this, Mh, new Ammo.btDefaultCollisionConfiguration(), "f"),
            Fh(
                this,
                Th,
                new Ammo.btCollisionDispatcher(Oh(this, Mh, "f")),
                "f"
            ),
            Fh(this, Ch, new Ammo.btDbvtBroadphase(), "f"),
            Fh(this, Ih, new Ammo.btSequentialImpulseConstraintSolver(), "f"),
            Fh(
                this,
                Rh,
                new Ammo.btDiscreteDynamicsWorld(
                    Oh(this, Th, "f"),
                    Oh(this, Ch, "f"),
                    Oh(this, Ih, "f"),
                    Oh(this, Mh, "f")
                ),
                "f"
            );
        const e = new Ammo.btVector3(0, -9.82, 0);
        Oh(this, Rh, "f").setGravity(e), Ammo.destroy(e);
    }
    dispose() {
        for (const { body: e } of Oh(this, Lh, "f"))
            null != e && Oh(this, Rh, "f").removeRigidBody(e);
        Oh(this, Lh, "f").length = 0;
        for (const { body: e } of Oh(this, Ph, "f"))
            null != e && (Ammo.destroy(e.getMotionState()), Ammo.destroy(e));
        (Oh(this, Ph, "f").length = 0), Oh(this, Bh, "f").clear();
        for (const e of Oh(this, Uh, "f").values())
            for (const t of e)
                Ammo.destroy(t.getMotionState()), Ammo.destroy(t);
        Oh(this, Uh, "f").clear(),
            null != Oh(this, Nh, "f") &&
            (Oh(this, Nh, "f").isActive &&
                Oh(this, Rh, "f").removeRigidBody(Oh(this, Nh, "f").body),
                Ammo.destroy(Oh(this, Nh, "f").body.getMotionState()),
                Ammo.destroy(Oh(this, Nh, "f").body),
                Ammo.destroy(Oh(this, Nh, "f").shape)),
            null != Oh(this, kh, "f") &&
            (Oh(this, kh, "f").isActive &&
                Oh(this, Rh, "f").removeRigidBody(Oh(this, kh, "f").body),
                Ammo.destroy(Oh(this, kh, "f").body.getMotionState()),
                Ammo.destroy(Oh(this, kh, "f").body),
                Ammo.destroy(Oh(this, kh, "f").shape),
                Ammo.destroy(Oh(this, kh, "f").triangleMesh)),
            Ammo.destroy(Oh(this, Rh, "f")),
            Ammo.destroy(Oh(this, Ih, "f")),
            Ammo.destroy(Oh(this, Ch, "f")),
            Ammo.destroy(Oh(this, Th, "f")),
            Ammo.destroy(Oh(this, Mh, "f"));
    }
    createGroundPlane() {
        if (null != Oh(this, Nh, "f"))
            throw new Error("Ground is already initialized");
        const e = new Ammo.btVector3(0, 1, 0),
            t = new Ammo.btStaticPlaneShape(e, 0);
        t.setMargin(0.01), Ammo.destroy(e);
        const n = new Ammo.btTransform();
        n.setIdentity();
        const i = new Ammo.btDefaultMotionState(n);
        Ammo.destroy(n);
        const r = new Ammo.btVector3();
        t.calculateLocalInertia(0, r);
        const a = new Ammo.btRigidBodyConstructionInfo(0, i, t, r),
            s = new Ammo.btRigidBody(a);
        s.setFriction(1),
            Ammo.destroy(r),
            Ammo.destroy(a),
            Fh(this, Nh, { body: s, shape: t, isActive: !1 }, "f");
    }
    createMountains(e, t) {
        if (e.length % 9 != 0)
            throw new Error(
                "Number of mountain vertices is not dividable by 9"
            );
        if (e.length > 0) {
            if (null != Oh(this, kh, "f"))
                throw new Error("Mountains are already initialized");
            let n = 1 / 0;
            const i = new Ammo.btTriangleMesh();
            for (let t = 0; t < e.length; t += 9) {
                const r = e[t + 0],
                    a = e[t + 1],
                    s = e[t + 2],
                    o = e[t + 3],
                    l = e[t + 4],
                    c = e[t + 5],
                    h = e[t + 6],
                    d = e[t + 7],
                    u = e[t + 8],
                    f = new Ammo.btVector3(r, a, s),
                    p = new Ammo.btVector3(o, l, c),
                    m = new Ammo.btVector3(h, d, u);
                i.addTriangle(f, p, m),
                    Ammo.destroy(f),
                    Ammo.destroy(p),
                    Ammo.destroy(m),
                    (n = Math.min(
                        n,
                        new Zt(r, a, s).lengthSq(),
                        new Zt(o, l, c).lengthSq(),
                        new Zt(h, d, u).lengthSq()
                    ));
            }
            const r = new Ammo.btBvhTriangleMeshShape(i);
            r.setMargin(0.02);
            const a = new Ammo.btVector3(t.x, t.y, t.z),
                s = new Ammo.btTransform();
            s.setIdentity(), s.setOrigin(a), Ammo.destroy(a);
            const o = new Ammo.btVector3();
            r.calculateLocalInertia(0, o);
            const l = new Ammo.btDefaultMotionState(s);
            Ammo.destroy(s);
            const c = new Ammo.btRigidBodyConstructionInfo(0, l, r, o),
                h = new Ammo.btRigidBody(c);
            h.setFriction(1), Ammo.destroy(o), Ammo.destroy(c);
            const d = Math.sqrt(n);
            Fh(
                this,
                kh,
                {
                    body: h,
                    shape: r,
                    triangleMesh: i,
                    offset: t,
                    minimumRadius: d,
                    isActive: !1,
                },
                "f"
            );
        }
    }
    addStaticBody(e, t, n) {
        const i = Oh(Eh, Eh, "f", Dh);
        (t = t.clone()).applyMatrix4(e);
        const r = {
            active: !1,
            matrix: e,
            shape: n,
            body: null,
            min: t.min.clone(),
            max: t.max.clone(),
        };
        Oh(this, Ph, "f").push(r);
        for (
            let e = Math.floor((t.min.x - 3) / i);
            e <= Math.ceil((t.max.x + 3) / i);
            ++e
        )
            for (
                let n = Math.floor((t.min.y - 3) / i);
                n <= Math.ceil((t.max.y + 3) / i);
                ++n
            )
                for (
                    let a = Math.floor((t.min.z - 3) / i);
                    a <= Math.ceil((t.max.z + 3) / i);
                    ++a
                ) {
                    const t = Oh(this, Bh, "f").get(e);
                    if (null == t)
                        Oh(this, Bh, "f").set(e, new Map([[n, new Map([[a, [r]]])]]));
                    else {
                        const e = t.get(n);
                        if (null == e) t.set(n, new Map([[a, [r]]]));
                        else {
                            const t = e.get(a);
                            null == t ? e.set(a, [r]) : t.push(r);
                        }
                    }
                }
    }
    activePhysicsAt(e) {
        if (
            (null != Oh(this, Nh, "f") &&
                (e.y < 4
                    ? Oh(this, Nh, "f").isActive ||
                    (Oh(this, Rh, "f").addRigidBody(Oh(this, Nh, "f").body),
                        (Oh(this, Nh, "f").isActive = !0))
                    : e.y > 5 &&
                    Oh(this, Nh, "f").isActive &&
                    (Oh(this, Rh, "f").removeRigidBody(Oh(this, Nh, "f").body),
                        (Oh(this, Nh, "f").isActive = !1))),
                null != Oh(this, kh, "f"))
        ) {
            const t = e.distanceTo(Oh(this, kh, "f").offset);
            t > Oh(this, kh, "f").minimumRadius - 10
                ? Oh(this, kh, "f").isActive ||
                (Oh(this, Rh, "f").addRigidBody(Oh(this, kh, "f").body),
                    (Oh(this, kh, "f").isActive = !0))
                : t < Oh(this, kh, "f").minimumRadius - 20 &&
                Oh(this, kh, "f").isActive &&
                (Oh(this, Rh, "f").removeRigidBody(Oh(this, kh, "f").body),
                    (Oh(this, kh, "f").isActive = !1));
        }
        const t = new Ammo.btVector3(),
            n = new Ammo.btVector3();
        Fh(
            this,
            Lh,
            Oh(this, Lh, "f").filter((t) => {
                if (
                    t.active &&
                    (e.x < t.min.x - 3 ||
                        e.x > t.max.x + 3 ||
                        e.y < t.min.y - 3 ||
                        e.y > t.max.y + 3 ||
                        e.z < t.min.z - 3 ||
                        e.z > t.max.z + 3)
                ) {
                    const e = Oh(this, Uh, "f").get(t.shape);
                    return (
                        null == e
                            ? Oh(this, Uh, "f").set(t.shape, [t.body])
                            : e.push(t.body),
                        Oh(this, Rh, "f").removeRigidBody(t.body),
                        (t.body = null),
                        (t.active = !1),
                        !1
                    );
                }
                return !0;
            }),
            "f"
        );
        const i = e.clone().divideScalar(Oh(Eh, Eh, "f", Dh)).floor(),
            r = Oh(this, Bh, "f").get(i.x);
        if (null != r) {
            const t = r.get(i.y);
            if (null != t) {
                const n = t.get(i.z);
                if (null != n)
                    for (const t of n)
                        if (
                            !t.active &&
                            e.x >= t.min.x - 3 &&
                            e.x <= t.max.x + 3 &&
                            e.y >= t.min.y - 3 &&
                            e.y <= t.max.y + 3 &&
                            e.z >= t.min.z - 3 &&
                            e.z <= t.max.z + 3
                        ) {
                            let e = Oh(this, Uh, "f").get(t.shape);
                            null == e && ((e = []), Oh(this, Uh, "f").set(t.shape, e));
                            const n = new Ammo.btTransform();
                            let i;
                            if (
                                (n.setFromOpenGLMatrix(t.matrix.elements), e.length > 0)
                            )
                                (i = e.pop()),
                                    i.setWorldTransform(n),
                                    Ammo.destroy(n),
                                    Oh(this, Rh, "f").addRigidBody(i);
                            else {
                                const e = new Ammo.btDefaultMotionState(n);
                                Ammo.destroy(n);
                                const r = new Ammo.btVector3();
                                t.shape.calculateLocalInertia(0, r);
                                const a = new Ammo.btRigidBodyConstructionInfo(
                                    0,
                                    e,
                                    t.shape,
                                    r
                                );
                                (i = new Ammo.btRigidBody(a)),
                                    i.setFriction(1),
                                    Ammo.destroy(r),
                                    Ammo.destroy(a),
                                    Oh(this, Rh, "f").addRigidBody(i);
                            }
                            if (null != t.body)
                                throw new Error("Activating already active rigid body");
                            (t.body = i), (t.active = !0), Oh(this, Lh, "f").push(t);
                        }
            }
        }
        Ammo.destroy(t), Ammo.destroy(n);
    }
    step() {
        Oh(this, Rh, "f").stepSimulation(
            1 / Eh.stepsPerSecond,
            0,
            1 / Eh.stepsPerSecond
        );
    }
    get world() {
        return Oh(this, Rh, "f");
    }
    get dispatcher() {
        return Oh(this, Th, "f");
    }
}
(Eh = zh),
    (Mh = new WeakMap()),
    (Th = new WeakMap()),
    (Ch = new WeakMap()),
    (Ih = new WeakMap()),
    (Rh = new WeakMap()),
    (Ph = new WeakMap()),
    (Bh = new WeakMap()),
    (Lh = new WeakMap()),
    (Uh = new WeakMap()),
    (Nh = new WeakMap()),
    (kh = new WeakMap()),
    (Dh = { value: 20 }),
    (zh.stepsPerSecond = 1e3);
const Hh = zh;
















Fh = function (e, t, n, i, r) {
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
},
    Oh = function (e, t, n, i) {
        if ("a" === n && !i)
            throw new TypeError(
                "Private accessor was defined without a getter"
            );
        if ("function" == typeof t ? e !== t || !i : !t.has(e))
            throw new TypeError(
                "Cannot read private member from an object whose class did not declare it"
            );
        return "m" === n ? i : "a" === n ? i.call(e) : i ? i.value : t.get(e);
    };