! function () {
    "use strict";
    function t(t) {
        this.content = t
    }
    function e(t, n, r) {
        for (var o = 0;; o++) {
            if (o == t.childCount || o == n.childCount) return t.childCount == n.childCount ? null : r;
            var i = t.child(o),
                s = n.child(o);
            if (i != s) {
                if (!i.sameMarkup(s)) return r;
                if (i.isText && i.text != s.text) {
                    for (var a = 0; i.text[a] == s.text[a]; a++) r++;
                    return r
                }
                if (i.content.size || s.content.size) {
                    var c = e(i.content, s.content, r + 1);
                    if (null != c) return c
                }
                r += i.nodeSize
            } else r += i.nodeSize
        }
    }
    function n(t, e, r, o) {
        for (var i = t.childCount, s = e.childCount;;) {
            if (0 == i || 0 == s) return i == s ? null : {
                a: r,
                b: o
            };
            var a = t.child(--i),
                c = e.child(--s),
                l = a.nodeSize;
            if (a != c) {
                if (!a.sameMarkup(c)) return {
                    a: r,
                    b: o
                };
                if (a.isText && a.text != c.text) {
                    for (var p = 0, h = Math.min(a.text.length, c.text.length); p < h && a.text[a.text.length - p - 1] == c.text[c.text.length - p - 1];) p++, r--, o--;
                    return {
                        a: r,
                        b: o
                    }
                }
                if (a.content.size || c.content.size) {
                    var u = n(a.content, c.content, r - 1, o - 1);
                    if (u) return u
                }
                r -= l, o -= l
            } else r -= l, o -= l
        }
    }
    t.prototype = {
        constructor: t,
        find: function (t) {
            for (var e = 0; e < this.content.length; e += 2)
                if (this.content[e] === t) return e;
            return -1
        },
        get: function (t) {
            var e = this.find(t);
            return -1 == e ? void 0 : this.content[e + 1]
        },
        update: function (e, n, r) {
            var o = r && r != e ? this.remove(r) : this,
                i = o.find(e),
                s = o.content.slice();
            return -1 == i ? s.push(r || e, n) : (s[i + 1] = n, r && (s[i] = r)), new t(s)
        },
        remove: function (e) {
            var n = this.find(e);
            if (-1 == n) return this;
            var r = this.content.slice();
            return r.splice(n, 2), new t(r)
        },
        addToStart: function (e, n) {
            return new t([e, n].concat(this.remove(e).content))
        },
        addToEnd: function (e, n) {
            var r = this.remove(e).content.slice();
            return r.push(e, n), new t(r)
        },
        addBefore: function (e, n, r) {
            var o = this.remove(n),
                i = o.content.slice(),
                s = o.find(e);
            return i.splice(-1 == s ? i.length : s, 0, n, r), new t(i)
        },
        forEach: function (t) {
            for (var e = 0; e < this.content.length; e += 2) t(this.content[e], this.content[e + 1])
        },
        prepend: function (e) {
            return (e = t.from(e)).size ? new t(e.content.concat(this.subtract(e).content)) : this
        },
        append: function (e) {
            return (e = t.from(e)).size ? new t(this.subtract(e).content.concat(e.content)) : this
        },
        subtract: function (e) {
            var n = this;
            e = t.from(e);
            for (var r = 0; r < e.content.length; r += 2) n = n.remove(e.content[r]);
            return n
        },
        get size() {
            return this.content.length >> 1
        }
    }, t.from = function (e) {
        if (e instanceof t) return e;
        var n = [];
        if (e)
            for (var r in e) n.push(r, e[r]);
        return new t(n)
    };
    var r = function (t, e) {
            if (this.content = t, this.size = e || 0, null == e)
                for (var n = 0; n < t.length; n++) this.size += t[n].nodeSize
        },
        o = {
            firstChild: {
                configurable: !0
            },
            lastChild: {
                configurable: !0
            },
            childCount: {
                configurable: !0
            }
        };
    r.prototype.nodesBetween = function (t, e, n, r, o) {
        void 0 === r && (r = 0);
        for (var i = 0, s = 0; s < e; i++) {
            var a = this.content[i],
                c = s + a.nodeSize;
            if (c > t && !1 !== n(a, r + s, o || null, i) && a.content.size) {
                var l = s + 1;
                a.nodesBetween(Math.max(0, t - l), Math.min(a.content.size, e - l), n, r + l)
            }
            s = c
        }
    }, r.prototype.descendants = function (t) {
        this.nodesBetween(0, this.size, t)
    }, r.prototype.textBetween = function (t, e, n, r) {
        var o = "",
            i = !0;
        return this.nodesBetween(t, e, (function (s, a) {
            s.isText ? (o += s.text.slice(Math.max(t, a) - a, e - a), i = !n) : s.isLeaf ? (r ? o += "function" == typeof r ? r(s) : r : s.type.spec.leafText && (o += s.type.spec.leafText(s)), i = !n) : !i && s.isBlock && (o += n, i = !0)
        }), 0), o
    }, r.prototype.append = function (t) {
        if (!t.size) return this;
        if (!this.size) return t;
        var e = this.lastChild,
            n = t.firstChild,
            o = this.content.slice(),
            i = 0;
        for (e.isText && e.sameMarkup(n) && (o[o.length - 1] = e.withText(e.text + n.text), i = 1); i < t.content.length; i++) o.push(t.content[i]);
        return new r(o, this.size + t.size)
    }, r.prototype.cut = function (t, e) {
        if (void 0 === e && (e = this.size), 0 == t && e == this.size) return this;
        var n = [],
            o = 0;
        if (e > t)
            for (var i = 0, s = 0; s < e; i++) {
                var a = this.content[i],
                    c = s + a.nodeSize;
                c > t && ((s < t || c > e) && (a = a.isText ? a.cut(Math.max(0, t - s), Math.min(a.text.length, e - s)) : a.cut(Math.max(0, t - s - 1), Math.min(a.content.size, e - s - 1))), n.push(a), o += a.nodeSize), s = c
            }
        return new r(n, o)
    }, r.prototype.cutByIndex = function (t, e) {
        return t == e ? r.empty : 0 == t && e == this.content.length ? this : new r(this.content.slice(t, e))
    }, r.prototype.replaceChild = function (t, e) {
        var n = this.content[t];
        if (n == e) return this;
        var o = this.content.slice(),
            i = this.size + e.nodeSize - n.nodeSize;
        return o[t] = e, new r(o, i)
    }, r.prototype.addToStart = function (t) {
        return new r([t].concat(this.content), this.size + t.nodeSize)
    }, r.prototype.addToEnd = function (t) {
        return new r(this.content.concat(t), this.size + t.nodeSize)
    }, r.prototype.eq = function (t) {
        if (this.content.length != t.content.length) return !1;
        for (var e = 0; e < this.content.length; e++)
            if (!this.content[e].eq(t.content[e])) return !1;
        return !0
    }, o.firstChild.get = function () {
        return this.content.length ? this.content[0] : null
    }, o.lastChild.get = function () {
        return this.content.length ? this.content[this.content.length - 1] : null
    }, o.childCount.get = function () {
        return this.content.length
    }, r.prototype.child = function (t) {
        var e = this.content[t];
        if (!e) throw new RangeError("Index " + t + " out of range for " + this);
        return e
    }, r.prototype.maybeChild = function (t) {
        return this.content[t] || null
    }, r.prototype.forEach = function (t) {
        for (var e = 0, n = 0; e < this.content.length; e++) {
            var r = this.content[e];
            t(r, n, e), n += r.nodeSize
        }
    }, r.prototype.findDiffStart = function (t, n) {
        return void 0 === n && (n = 0), e(this, t, n)
    }, r.prototype.findDiffEnd = function (t, e, r) {
        return void 0 === e && (e = this.size), void 0 === r && (r = t.size), n(this, t, e, r)
    }, r.prototype.findIndex = function (t, e) {
        if (void 0 === e && (e = -1), 0 == t) return s(0, t);
        if (t == this.size) return s(this.content.length, t);
        if (t > this.size || t < 0) throw new RangeError("Position " + t + " outside of fragment (" + this + ")");
        for (var n = 0, r = 0;; n++) {
            var o = r + this.child(n).nodeSize;
            if (o >= t) return o == t || e > 0 ? s(n + 1, o) : s(n, r);
            r = o
        }
    }, r.prototype.toString = function () {
        return "<" + this.toStringInner() + ">"
    }, r.prototype.toStringInner = function () {
        return this.content.join(", ")
    }, r.prototype.toJSON = function () {
        return this.content.length ? this.content.map((function (t) {
            return t.toJSON()
        })) : null
    }, r.fromJSON = function (t, e) {
        if (!e) return r.empty;
        if (!Array.isArray(e)) throw new RangeError("Invalid input for Fragment.fromJSON");
        return new r(e.map(t.nodeFromJSON))
    }, r.fromArray = function (t) {
        if (!t.length) return r.empty;
        for (var e, n = 0, o = 0; o < t.length; o++) {
            var i = t[o];
            n += i.nodeSize, o && i.isText && t[o - 1].sameMarkup(i) ? (e || (e = t.slice(0, o)), e[e.length - 1] = i.withText(e[e.length - 1].text + i.text)) : e && e.push(i)
        }
        return new r(e || t, n)
    }, r.from = function (t) {
        if (!t) return r.empty;
        if (t instanceof r) return t;
        if (Array.isArray(t)) return this.fromArray(t);
        if (t.attrs) return new r([t], t.nodeSize);
        throw new RangeError("Can not convert " + t + " to a Fragment" + (t.nodesBetween ? " (looks like multiple versions of prosemirror-model were loaded)" : ""))
    }, Object.defineProperties(r.prototype, o), r.empty = new r([], 0);
    var i = {
        index: 0,
        offset: 0
    };
    function s(t, e) {
        return i.index = t, i.offset = e, i
    }
    function a(t, e) {
        if (t === e) return !0;
        if (!t || "object" != typeof t || !e || "object" != typeof e) return !1;
        var n = Array.isArray(t);
        if (Array.isArray(e) != n) return !1;
        if (n) {
            if (t.length != e.length) return !1;
            for (var r = 0; r < t.length; r++)
                if (!a(t[r], e[r])) return !1
        } else {
            for (var o in t)
                if (!(o in e) || !a(t[o], e[o])) return !1;
            for (var i in e)
                if (!(i in t)) return !1
        }
        return !0
    }
    var c = function (t, e) {
        this.type = t, this.attrs = e
    };
    c.prototype.addToSet = function (t) {
        for (var e, n = !1, r = 0; r < t.length; r++) {
            var o = t[r];
            if (this.eq(o)) return t;
            if (this.type.excludes(o.type)) e || (e = t.slice(0, r));
            else {
                if (o.type.excludes(this.type)) return t;
                !n && o.type.rank > this.type.rank && (e || (e = t.slice(0, r)), e.push(this), n = !0), e && e.push(o)
            }
        }
        return e || (e = t.slice()), n || e.push(this), e
    }, c.prototype.removeFromSet = function (t) {
        for (var e = 0; e < t.length; e++)
            if (this.eq(t[e])) return t.slice(0, e).concat(t.slice(e + 1));
        return t
    }, c.prototype.isInSet = function (t) {
        for (var e = 0; e < t.length; e++)
            if (this.eq(t[e])) return !0;
        return !1
    }, c.prototype.eq = function (t) {
        return this == t || this.type == t.type && a(this.attrs, t.attrs)
    }, c.prototype.toJSON = function () {
        var t = {
            type: this.type.name
        };
        for (var e in this.attrs) {
            t.attrs = this.attrs;
            break
        }
        return t
    }, c.fromJSON = function (t, e) {
        if (!e) throw new RangeError("Invalid input for Mark.fromJSON");
        var n = t.marks[e.type];
        if (!n) throw new RangeError("There is no mark type " + e.type + " in this schema");
        return n.create(e.attrs)
    }, c.sameSet = function (t, e) {
        if (t == e) return !0;
        if (t.length != e.length) return !1;
        for (var n = 0; n < t.length; n++)
            if (!t[n].eq(e[n])) return !1;
        return !0
    }, c.setFrom = function (t) {
        if (!t || Array.isArray(t) && 0 == t.length) return c.none;
        if (t instanceof c) return [t];
        var e = t.slice();
        return e.sort((function (t, e) {
            return t.type.rank - e.type.rank
        })), e
    }, c.none = [];
    var l = function (t) {
            function e() {
                t.apply(this, arguments)
            }
            return t && (e.__proto__ = t), e.prototype = Object.create(t && t.prototype), e.prototype.constructor = e, e
        }(Error),
        p = function (t, e, n) {
            this.content = t, this.openStart = e, this.openEnd = n
        },
        h = {
            size: {
                configurable: !0
            }
        };
    function u(t, e, n) {
        var r = t.findIndex(e),
            o = r.index,
            i = r.offset,
            s = t.maybeChild(o),
            a = t.findIndex(n),
            c = a.index,
            l = a.offset;
        if (i == e || s.isText) {
            if (l != n && !t.child(c).isText) throw new RangeError("Removing non-flat range");
            return t.cut(0, e).append(t.cut(n))
        }
        if (o != c) throw new RangeError("Removing non-flat range");
        return t.replaceChild(o, s.copy(u(s.content, e - i - 1, n - i - 1)))
    }
    function f(t, e, n, r) {
        var o = t.findIndex(e),
            i = o.index,
            s = o.offset,
            a = t.maybeChild(i);
        if (s == e || a.isText) return r && !r.canReplace(i, i, n) ? null : t.cut(0, e).append(n).append(t.cut(e));
        var c = f(a.content, e - s - 1, n);
        return c && t.replaceChild(i, a.copy(c))
    }
    function d(t, e, n) {
        if (n.openStart > t.depth) throw new l("Inserted content deeper than insertion position");
        if (t.depth - n.openStart != e.depth - n.openEnd) throw new l("Inconsistent open depths");
        return m(t, e, n, 0)
    }
    function m(t, e, n, o) {
        var i = t.index(o),
            s = t.node(o);
        if (i == e.index(o) && o < t.depth - n.openStart) {
            var a = m(t, e, n, o + 1);
            return s.copy(s.content.replaceChild(i, a))
        }
        if (n.content.size) {
            if (n.openStart || n.openEnd || t.depth != o || e.depth != o) {
                var c = function (t, e) {
                    for (var n = e.depth - t.openStart, o = e.node(n).copy(t.content), i = n - 1; i >= 0; i--) o = e.node(i).copy(r.from(o));
                    return {
                        start: o.resolveNoCache(t.openStart + n),
                        end: o.resolveNoCache(o.content.size - t.openEnd - n)
                    }
                }(n, t);
                return b(s, k(t, c.start, c.end, e, o))
            }
            var l = t.parent,
                p = l.content;
            return b(l, p.cut(0, t.parentOffset).append(n.content).append(p.cut(e.parentOffset)))
        }
        return b(s, x(t, e, o))
    }
    function v(t, e) {
        if (!e.type.compatibleContent(t.type)) throw new l("Cannot join " + e.type.name + " onto " + t.type.name)
    }
    function g(t, e, n) {
        var r = t.node(n);
        return v(r, e.node(n)), r
    }
    function y(t, e) {
        var n = e.length - 1;
        n >= 0 && t.isText && t.sameMarkup(e[n]) ? e[n] = t.withText(e[n].text + t.text) : e.push(t)
    }
    function w(t, e, n, r) {
        var o = (e || t).node(n),
            i = 0,
            s = e ? e.index(n) : o.childCount;
        t && (i = t.index(n), t.depth > n ? i++ : t.textOffset && (y(t.nodeAfter, r), i++));
        for (var a = i; a < s; a++) y(o.child(a), r);
        e && e.depth == n && e.textOffset && y(e.nodeBefore, r)
    }
    function b(t, e) {
        if (!t.type.validContent(e)) throw new l("Invalid content for node " + t.type.name);
        return t.copy(e)
    }
    function k(t, e, n, o, i) {
        var s = t.depth > i && g(t, e, i + 1),
            a = o.depth > i && g(n, o, i + 1),
            c = [];
        return w(null, t, i, c), s && a && e.index(i) == n.index(i) ? (v(s, a), y(b(s, k(t, e, n, o, i + 1)), c)) : (s && y(b(s, x(t, e, i + 1)), c), w(e, n, i, c), a && y(b(a, x(n, o, i + 1)), c)), w(o, null, i, c), new r(c)
    }
    function x(t, e, n) {
        var o = [];
        (w(null, t, n, o), t.depth > n) && y(b(g(t, e, n + 1), x(t, e, n + 1)), o);
        return w(e, null, n, o), new r(o)
    }
    h.size.get = function () {
        return this.content.size - this.openStart - this.openEnd
    }, p.prototype.insertAt = function (t, e) {
        var n = f(this.content, t + this.openStart, e);
        return n && new p(n, this.openStart, this.openEnd)
    }, p.prototype.removeBetween = function (t, e) {
        return new p(u(this.content, t + this.openStart, e + this.openStart), this.openStart, this.openEnd)
    }, p.prototype.eq = function (t) {
        return this.content.eq(t.content) && this.openStart == t.openStart && this.openEnd == t.openEnd
    }, p.prototype.toString = function () {
        return this.content + "(" + this.openStart + "," + this.openEnd + ")"
    }, p.prototype.toJSON = function () {
        if (!this.content.size) return null;
        var t = {
            content: this.content.toJSON()
        };
        return this.openStart > 0 && (t.openStart = this.openStart), this.openEnd > 0 && (t.openEnd = this.openEnd), t
    }, p.fromJSON = function (t, e) {
        if (!e) return p.empty;
        var n = e.openStart || 0,
            o = e.openEnd || 0;
        if ("number" != typeof n || "number" != typeof o) throw new RangeError("Invalid input for Slice.fromJSON");
        return new p(r.fromJSON(t, e.content), n, o)
    }, p.maxOpen = function (t, e) {
        void 0 === e && (e = !0);
        for (var n = 0, r = 0, o = t.firstChild; o && !o.isLeaf && (e || !o.type.spec.isolating); o = o.firstChild) n++;
        for (var i = t.lastChild; i && !i.isLeaf && (e || !i.type.spec.isolating); i = i.lastChild) r++;
        return new p(t, n, r)
    }, Object.defineProperties(p.prototype, h), p.empty = new p(r.empty, 0, 0);
    var S = function (t, e, n) {
            this.pos = t, this.path = e, this.parentOffset = n, this.depth = e.length / 3 - 1
        },
        M = {
            parent: {
                configurable: !0
            },
            doc: {
                configurable: !0
            },
            textOffset: {
                configurable: !0
            },
            nodeAfter: {
                configurable: !0
            },
            nodeBefore: {
                configurable: !0
            }
        };
    S.prototype.resolveDepth = function (t) {
        return null == t ? this.depth : t < 0 ? this.depth + t : t
    }, M.parent.get = function () {
        return this.node(this.depth)
    }, M.doc.get = function () {
        return this.node(0)
    }, S.prototype.node = function (t) {
        return this.path[3 * this.resolveDepth(t)]
    }, S.prototype.index = function (t) {
        return this.path[3 * this.resolveDepth(t) + 1]
    }, S.prototype.indexAfter = function (t) {
        return t = this.resolveDepth(t), this.index(t) + (t != this.depth || this.textOffset ? 1 : 0)
    }, S.prototype.start = function (t) {
        return 0 == (t = this.resolveDepth(t)) ? 0 : this.path[3 * t - 1] + 1
    }, S.prototype.end = function (t) {
        return t = this.resolveDepth(t), this.start(t) + this.node(t).content.size
    }, S.prototype.before = function (t) {
        if (!(t = this.resolveDepth(t))) throw new RangeError("There is no position before the top-level node");
        return t == this.depth + 1 ? this.pos : this.path[3 * t - 1]
    }, S.prototype.after = function (t) {
        if (!(t = this.resolveDepth(t))) throw new RangeError("There is no position after the top-level node");
        return t == this.depth + 1 ? this.pos : this.path[3 * t - 1] + this.path[3 * t].nodeSize
    }, M.textOffset.get = function () {
        return this.pos - this.path[this.path.length - 1]
    }, M.nodeAfter.get = function () {
        var t = this.parent,
            e = this.index(this.depth);
        if (e == t.childCount) return null;
        var n = this.pos - this.path[this.path.length - 1],
            r = t.child(e);
        return n ? t.child(e).cut(n) : r
    }, M.nodeBefore.get = function () {
        var t = this.index(this.depth),
            e = this.pos - this.path[this.path.length - 1];
        return e ? this.parent.child(t).cut(0, e) : 0 == t ? null : this.parent.child(t - 1)
    }, S.prototype.posAtIndex = function (t, e) {
        e = this.resolveDepth(e);
        for (var n = this.path[3 * e], r = 0 == e ? 0 : this.path[3 * e - 1] + 1, o = 0; o < t; o++) r += n.child(o).nodeSize;
        return r
    }, S.prototype.marks = function () {
        var t = this.parent,
            e = this.index();
        if (0 == t.content.size) return c.none;
        if (this.textOffset) return t.child(e).marks;
        var n = t.maybeChild(e - 1),
            r = t.maybeChild(e);
        if (!n) {
            var o = n;
            n = r, r = o
        }
        for (var i = n.marks, s = 0; s < i.length; s++) !1 !== i[s].type.spec.inclusive || r && i[s].isInSet(r.marks) || (i = i[s--].removeFromSet(i));
        return i
    }, S.prototype.marksAcross = function (t) {
        var e = this.parent.maybeChild(this.index());
        if (!e || !e.isInline) return null;
        for (var n = e.marks, r = t.parent.maybeChild(t.index()), o = 0; o < n.length; o++) !1 !== n[o].type.spec.inclusive || r && n[o].isInSet(r.marks) || (n = n[o--].removeFromSet(n));
        return n
    }, S.prototype.sharedDepth = function (t) {
        for (var e = this.depth; e > 0; e--)
            if (this.start(e) <= t && this.end(e) >= t) return e;
        return 0
    }, S.prototype.blockRange = function (t, e) {
        if (void 0 === t && (t = this), t.pos < this.pos) return t.blockRange(this);
        for (var n = this.depth - (this.parent.inlineContent || this.pos == t.pos ? 1 : 0); n >= 0; n--)
            if (t.pos <= this.end(n) && (!e || e(this.node(n)))) return new D(this, t, n);
        return null
    }, S.prototype.sameParent = function (t) {
        return this.pos - this.parentOffset == t.pos - t.parentOffset
    }, S.prototype.max = function (t) {
        return t.pos > this.pos ? t : this
    }, S.prototype.min = function (t) {
        return t.pos < this.pos ? t : this
    }, S.prototype.toString = function () {
        for (var t = "", e = 1; e <= this.depth; e++) t += (t ? "/" : "") + this.node(e).type.name + "_" + this.index(e - 1);
        return t + ":" + this.parentOffset
    }, S.resolve = function (t, e) {
        if (!(e >= 0 && e <= t.content.size)) throw new RangeError("Position " + e + " out of range");
        for (var n = [], r = 0, o = e, i = t;;) {
            var s = i.content.findIndex(o),
                a = s.index,
                c = s.offset,
                l = o - c;
            if (n.push(i, a, r + c), !l) break;
            if ((i = i.child(a)).isText) break;
            o = l - 1, r += c + 1
        }
        return new S(e, n, o)
    }, S.resolveCached = function (t, e) {
        for (var n = 0; n < C.length; n++) {
            var r = C[n];
            if (r.pos == e && r.doc == t) return r
        }
        var o = C[O] = S.resolve(t, e);
        return O = (O + 1) % N, o
    }, Object.defineProperties(S.prototype, M);
    var C = [],
        O = 0,
        N = 12,
        D = function (t, e, n) {
            this.$from = t, this.$to = e, this.depth = n
        },
        T = {
            start: {
                configurable: !0
            },
            end: {
                configurable: !0
            },
            parent: {
                configurable: !0
            },
            startIndex: {
                configurable: !0
            },
            endIndex: {
                configurable: !0
            }
        };
    T.start.get = function () {
        return this.$from.before(this.depth + 1)
    }, T.end.get = function () {
        return this.$to.after(this.depth + 1)
    }, T.parent.get = function () {
        return this.$from.node(this.depth)
    }, T.startIndex.get = function () {
        return this.$from.index(this.depth)
    }, T.endIndex.get = function () {
        return this.$to.indexAfter(this.depth)
    }, Object.defineProperties(D.prototype, T);
    var E = Object.create(null),
        A = function (t, e, n, o) {
            void 0 === o && (o = c.none), this.type = t, this.attrs = e, this.marks = o, this.content = n || r.empty
        },
        I = {
            nodeSize: {
                configurable: !0
            },
            childCount: {
                configurable: !0
            },
            textContent: {
                configurable: !0
            },
            firstChild: {
                configurable: !0
            },
            lastChild: {
                configurable: !0
            },
            isBlock: {
                configurable: !0
            },
            isTextblock: {
                configurable: !0
            },
            inlineContent: {
                configurable: !0
            },
            isInline: {
                configurable: !0
            },
            isText: {
                configurable: !0
            },
            isLeaf: {
                configurable: !0
            },
            isAtom: {
                configurable: !0
            }
        };
    I.nodeSize.get = function () {
        return this.isLeaf ? 1 : 2 + this.content.size
    }, I.childCount.get = function () {
        return this.content.childCount
    }, A.prototype.child = function (t) {
        return this.content.child(t)
    }, A.prototype.maybeChild = function (t) {
        return this.content.maybeChild(t)
    }, A.prototype.forEach = function (t) {
        this.content.forEach(t)
    }, A.prototype.nodesBetween = function (t, e, n, r) {
        void 0 === r && (r = 0), this.content.nodesBetween(t, e, n, r, this)
    }, A.prototype.descendants = function (t) {
        this.nodesBetween(0, this.content.size, t)
    }, I.textContent.get = function () {
        return this.isLeaf && this.type.spec.leafText ? this.type.spec.leafText(this) : this.textBetween(0, this.content.size, "")
    }, A.prototype.textBetween = function (t, e, n, r) {
        return this.content.textBetween(t, e, n, r)
    }, I.firstChild.get = function () {
        return this.content.firstChild
    }, I.lastChild.get = function () {
        return this.content.lastChild
    }, A.prototype.eq = function (t) {
        return this == t || this.sameMarkup(t) && this.content.eq(t.content)
    }, A.prototype.sameMarkup = function (t) {
        return this.hasMarkup(t.type, t.attrs, t.marks)
    }, A.prototype.hasMarkup = function (t, e, n) {
        return this.type == t && a(this.attrs, e || t.defaultAttrs || E) && c.sameSet(this.marks, n || c.none)
    }, A.prototype.copy = function (t) {
        return void 0 === t && (t = null), t == this.content ? this : new A(this.type, this.attrs, t, this.marks)
    }, A.prototype.mark = function (t) {
        return t == this.marks ? this : new A(this.type, this.attrs, this.content, t)
    }, A.prototype.cut = function (t, e) {
        return void 0 === e && (e = this.content.size), 0 == t && e == this.content.size ? this : this.copy(this.content.cut(t, e))
    }, A.prototype.slice = function (t, e, n) {
        if (void 0 === e && (e = this.content.size), void 0 === n && (n = !1), t == e) return p.empty;
        var r = this.resolve(t),
            o = this.resolve(e),
            i = n ? 0 : r.sharedDepth(e),
            s = r.start(i),
            a = r.node(i).content.cut(r.pos - s, o.pos - s);
        return new p(a, r.depth - i, o.depth - i)
    }, A.prototype.replace = function (t, e, n) {
        return d(this.resolve(t), this.resolve(e), n)
    }, A.prototype.nodeAt = function (t) {
        for (var e = this;;) {
            var n = e.content.findIndex(t),
                r = n.index,
                o = n.offset;
            if (!(e = e.maybeChild(r))) return null;
            if (o == t || e.isText) return e;
            t -= o + 1
        }
    }, A.prototype.childAfter = function (t) {
        var e = this.content.findIndex(t),
            n = e.index,
            r = e.offset;
        return {
            node: this.content.maybeChild(n),
            index: n,
            offset: r
        }
    }, A.prototype.childBefore = function (t) {
        if (0 == t) return {
            node: null,
            index: 0,
            offset: 0
        };
        var e = this.content.findIndex(t),
            n = e.index,
            r = e.offset;
        if (r < t) return {
            node: this.content.child(n),
            index: n,
            offset: r
        };
        var o = this.content.child(n - 1);
        return {
            node: o,
            index: n - 1,
            offset: r - o.nodeSize
        }
    }, A.prototype.resolve = function (t) {
        return S.resolveCached(this, t)
    }, A.prototype.resolveNoCache = function (t) {
        return S.resolve(this, t)
    }, A.prototype.rangeHasMark = function (t, e, n) {
        var r = !1;
        return e > t && this.nodesBetween(t, e, (function (t) {
            return n.isInSet(t.marks) && (r = !0), !r
        })), r
    }, I.isBlock.get = function () {
        return this.type.isBlock
    }, I.isTextblock.get = function () {
        return this.type.isTextblock
    }, I.inlineContent.get = function () {
        return this.type.inlineContent
    }, I.isInline.get = function () {
        return this.type.isInline
    }, I.isText.get = function () {
        return this.type.isText
    }, I.isLeaf.get = function () {
        return this.type.isLeaf
    }, I.isAtom.get = function () {
        return this.type.isAtom
    }, A.prototype.toString = function () {
        if (this.type.spec.toDebugString) return this.type.spec.toDebugString(this);
        var t = this.type.name;
        return this.content.size && (t += "(" + this.content.toStringInner() + ")"), R(this.marks, t)
    }, A.prototype.contentMatchAt = function (t) {
        var e = this.type.contentMatch.matchFragment(this.content, 0, t);
        if (!e) throw new Error("Called contentMatchAt on a node with invalid content");
        return e
    }, A.prototype.canReplace = function (t, e, n, o, i) {
        void 0 === n && (n = r.empty), void 0 === o && (o = 0), void 0 === i && (i = n.childCount);
        var s = this.contentMatchAt(t).matchFragment(n, o, i),
            a = s && s.matchFragment(this.content, e);
        if (!a || !a.validEnd) return !1;
        for (var c = o; c < i; c++)
            if (!this.type.allowsMarks(n.child(c).marks)) return !1;
        return !0
    }, A.prototype.canReplaceWith = function (t, e, n, r) {
        if (r && !this.type.allowsMarks(r)) return !1;
        var o = this.contentMatchAt(t).matchType(n),
            i = o && o.matchFragment(this.content, e);
        return !!i && i.validEnd
    }, A.prototype.canAppend = function (t) {
        return t.content.size ? this.canReplace(this.childCount, this.childCount, t.content) : this.type.compatibleContent(t.type)
    }, A.prototype.check = function () {
        if (!this.type.validContent(this.content)) throw new RangeError("Invalid content for node " + this.type.name + ": " + this.content.toString().slice(0, 50));
        for (var t = c.none, e = 0; e < this.marks.length; e++) t = this.marks[e].addToSet(t);
        if (!c.sameSet(t, this.marks)) throw new RangeError("Invalid collection of marks for node " + this.type.name + ": " + this.marks.map((function (t) {
            return t.type.name
        })));
        this.content.forEach((function (t) {
            return t.check()
        }))
    }, A.prototype.toJSON = function () {
        var t = {
            type: this.type.name
        };
        for (var e in this.attrs) {
            t.attrs = this.attrs;
            break
        }
        return this.content.size && (t.content = this.content.toJSON()), this.marks.length && (t.marks = this.marks.map((function (t) {
            return t.toJSON()
        }))), t
    }, A.fromJSON = function (t, e) {
        if (!e) throw new RangeError("Invalid input for Node.fromJSON");
        var n = null;
        if (e.marks) {
            if (!Array.isArray(e.marks)) throw new RangeError("Invalid mark data for Node.fromJSON");
            n = e.marks.map(t.markFromJSON)
        }
        if ("text" == e.type) {
            if ("string" != typeof e.text) throw new RangeError("Invalid text node in JSON");
            return t.text(e.text, n)
        }
        var o = r.fromJSON(t, e.content);
        return t.nodeType(e.type).create(e.attrs, o, n)
    }, Object.defineProperties(A.prototype, I), A.prototype.text = void 0;
    var z = function (t) {
        function e(e, n, r, o) {
            if (t.call(this, e, n, null, o), !r) throw new RangeError("Empty text nodes are not allowed");
            this.text = r
        }
        t && (e.__proto__ = t), e.prototype = Object.create(t && t.prototype), e.prototype.constructor = e;
        var n = {
            textContent: {
                configurable: !0
            },
            nodeSize: {
                configurable: !0
            }
        };
        return e.prototype.toString = function () {
            return this.type.spec.toDebugString ? this.type.spec.toDebugString(this) : R(this.marks, JSON.stringify(this.text))
        }, n.textContent.get = function () {
            return this.text
        }, e.prototype.textBetween = function (t, e) {
            return this.text.slice(t, e)
        }, n.nodeSize.get = function () {
            return this.text.length
        }, e.prototype.mark = function (t) {
            return t == this.marks ? this : new e(this.type, this.attrs, this.text, t)
        }, e.prototype.withText = function (t) {
            return t == this.text ? this : new e(this.type, this.attrs, t, this.marks)
        }, e.prototype.cut = function (t, e) {
            return void 0 === t && (t = 0), void 0 === e && (e = this.text.length), 0 == t && e == this.text.length ? this : this.withText(this.text.slice(t, e))
        }, e.prototype.eq = function (t) {
            return this.sameMarkup(t) && this.text == t.text
        }, e.prototype.toJSON = function () {
            var e = t.prototype.toJSON.call(this);
            return e.text = this.text, e
        }, Object.defineProperties(e.prototype, n), e
    }(A);
    function R(t, e) {
        for (var n = t.length - 1; n >= 0; n--) e = t[n].type.name + "(" + e + ")";
        return e
    }
    var P = function (t) {
            this.validEnd = t, this.next = [], this.wrapCache = []
        },
        B = {
            inlineContent: {
                configurable: !0
            },
            defaultType: {
                configurable: !0
            },
            edgeCount: {
                configurable: !0
            }
        };
    P.parse = function (t, e) {
        var n = new _(t, e);
        if (null == n.next) return P.empty;
        var r = F(n);
        n.next && n.err("Unexpected trailing text");
        var o = function (t) {
            var e = Object.create(null);
            return n(J(t, 0));
            function n(r) {
                var o = [];
                r.forEach((function (e) {
                    t[e].forEach((function (e) {
                        var n = e.term,
                            r = e.to;
                        if (n) {
                            for (var i, s = 0; s < o.length; s++) o[s][0] == n && (i = o[s][1]);
                            J(t, r).forEach((function (t) {
                                i || o.push([n, i = []]), -1 == i.indexOf(t) && i.push(t)
                            }))
                        }
                    }))
                }));
                for (var i = e[r.join(",")] = new P(r.indexOf(t.length - 1) > -1), s = 0; s < o.length; s++) {
                    var a = o[s][1].sort(W);
                    i.next.push({
                        type: o[s][0],
                        next: e[a.join(",")] || n(a)
                    })
                }
                return i
            }
        }(function (t) {
            var e = [
                []
            ];
            return o(i(t, 0), n()), e;
            function n() {
                return e.push([]) - 1
            }
            function r(t, n, r) {
                var o = {
                    term: r,
                    to: n
                };
                return e[t].push(o), o
            }
            function o(t, e) {
                t.forEach((function (t) {
                    return t.to = e
                }))
            }
            function i(t, e) {
                if ("choice" == t.type) return t.exprs.reduce((function (t, n) {
                    return t.concat(i(n, e))
                }), []);
                if ("seq" != t.type) {
                    if ("star" == t.type) {
                        var s = n();
                        return r(e, s), o(i(t.expr, s), s), [r(s)]
                    }
                    if ("plus" == t.type) {
                        var a = n();
                        return o(i(t.expr, e), a), o(i(t.expr, a), a), [r(a)]
                    }
                    if ("opt" == t.type) return [r(e)].concat(i(t.expr, e));
                    if ("range" == t.type) {
                        for (var c = e, l = 0; l < t.min; l++) {
                            var p = n();
                            o(i(t.expr, c), p), c = p
                        }
                        if (-1 == t.max) o(i(t.expr, c), c);
                        else
                            for (var h = t.min; h < t.max; h++) {
                                var u = n();
                                r(c, u), o(i(t.expr, c), u), c = u
                            }
                        return [r(c)]
                    }
                    if ("name" == t.type) return [r(e, void 0, t.value)];
                    throw new Error("Unknown expr type")
                }
                for (var f = 0;; f++) {
                    var d = i(t.exprs[f], e);
                    if (f == t.exprs.length - 1) return d;
                    o(d, e = n())
                }
            }
        }(r));
        return function (t, e) {
            for (var n = 0, r = [t]; n < r.length; n++) {
                for (var o = r[n], i = !o.validEnd, s = [], a = 0; a < o.next.length; a++) {
                    var c = o.next[a],
                        l = c.type,
                        p = c.next;
                    s.push(l.name), !i || l.isText || l.hasRequiredAttrs() || (i = !1), -1 == r.indexOf(p) && r.push(p)
                }
                i && e.err("Only non-generatable nodes (" + s.join(", ") + ") in a required position (see https://prosemirror.net/docs/guide/#generatable)")
            }
        }(o, n), o
    }, P.prototype.matchType = function (t) {
        for (var e = 0; e < this.next.length; e++)
            if (this.next[e].type == t) return this.next[e].next;
        return null
    }, P.prototype.matchFragment = function (t, e, n) {
        void 0 === e && (e = 0), void 0 === n && (n = t.childCount);
        for (var r = this, o = e; r && o < n; o++) r = r.matchType(t.child(o).type);
        return r
    }, B.inlineContent.get = function () {
        return this.next.length && this.next[0].type.isInline
    }, B.defaultType.get = function () {
        for (var t = 0; t < this.next.length; t++) {
            var e = this.next[t].type;
            if (!e.isText && !e.hasRequiredAttrs()) return e
        }
        return null
    }, P.prototype.compatible = function (t) {
        for (var e = 0; e < this.next.length; e++)
            for (var n = 0; n < t.next.length; n++)
                if (this.next[e].type == t.next[n].type) return !0;
        return !1
    }, P.prototype.fillBefore = function (t, e, n) {
        void 0 === e && (e = !1), void 0 === n && (n = 0);
        var o = [this];
        return function i(s, a) {
            var c = s.matchFragment(t, n);
            if (c && (!e || c.validEnd)) return r.from(a.map((function (t) {
                return t.createAndFill()
            })));
            for (var l = 0; l < s.next.length; l++) {
                var p = s.next[l],
                    h = p.type,
                    u = p.next;
                if (!h.isText && !h.hasRequiredAttrs() && -1 == o.indexOf(u)) {
                    o.push(u);
                    var f = i(u, a.concat(h));
                    if (f) return f
                }
            }
            return null
        }(this, [])
    }, P.prototype.findWrapping = function (t) {
        for (var e = 0; e < this.wrapCache.length; e += 2)
            if (this.wrapCache[e] == t) return this.wrapCache[e + 1];
        var n = this.computeWrapping(t);
        return this.wrapCache.push(t, n), n
    }, P.prototype.computeWrapping = function (t) {
        for (var e = Object.create(null), n = [{
            match: this,
            type: null,
            via: null
        }]; n.length;) {
            var r = n.shift(),
                o = r.match;
            if (o.matchType(t)) {
                for (var i = [], s = r; s.type; s = s.via) i.push(s.type);
                return i.reverse()
            }
            for (var a = 0; a < o.next.length; a++) {
                var c = o.next[a],
                    l = c.type,
                    p = c.next;
                l.isLeaf || l.hasRequiredAttrs() || l.name in e || r.type && !p.validEnd || (n.push({
                    match: l.contentMatch,
                    type: l,
                    via: r
                }), e[l.name] = !0)
            }
        }
        return null
    }, B.edgeCount.get = function () {
        return this.next.length
    }, P.prototype.edge = function (t) {
        if (t >= this.next.length) throw new RangeError("There's no " + t + "th edge in this content match");
        return this.next[t]
    }, P.prototype.toString = function () {
        var t = [];
        return function e(n) {
            t.push(n);
            for (var r = 0; r < n.next.length; r++) - 1 == t.indexOf(n.next[r].next) && e(n.next[r].next)
        }(this), t.map((function (e, n) {
            for (var r = n + (e.validEnd ? "*" : " ") + " ", o = 0; o < e.next.length; o++) r += (o ? ", " : "") + e.next[o].type.name + "->" + t.indexOf(e.next[o].next);
            return r
        })).join("\n")
    }, Object.defineProperties(P.prototype, B), P.empty = new P(!0);
    var _ = function (t, e) {
            this.string = t, this.nodeTypes = e, this.inline = null, this.pos = 0, this.tokens = t.split(/\s*(?=\b|\W|$)/), "" == this.tokens[this.tokens.length - 1] && this.tokens.pop(), "" == this.tokens[0] && this.tokens.shift()
        },
        V = {
            next: {
                configurable: !0
            }
        };
    function F(t) {
        var e = [];
        do {
            e.push($(t))
        } while (t.eat("|"));
        return 1 == e.length ? e[0] : {
            type: "choice",
            exprs: e
        }
    }
    function $(t) {
        var e = [];
        do {
            e.push(q(t))
        } while (t.next && ")" != t.next && "|" != t.next);
        return 1 == e.length ? e[0] : {
            type: "seq",
            exprs: e
        }
    }
    function q(t) {
        for (var e = function (t) {
            if (t.eat("(")) {
                var e = F(t);
                return t.eat(")") || t.err("Missing closing paren"), e
            }
            if (!/\W/.test(t.next)) {
                var n = function (t, e) {
                    var n = t.nodeTypes,
                        r = n[e];
                    if (r) return [r];
                    var o = [];
                    for (var i in n) {
                        var s = n[i];
                        s.groups.indexOf(e) > -1 && o.push(s)
                    }
                    0 == o.length && t.err("No node type or group '" + e + "' found");
                    return o
                }(t, t.next).map((function (e) {
                    return null == t.inline ? t.inline = e.isInline : t.inline != e.isInline && t.err("Mixing inline and block content"), {
                        type: "name",
                        value: e
                    }
                }));
                return t.pos++, 1 == n.length ? n[0] : {
                    type: "choice",
                    exprs: n
                }
            }
            t.err("Unexpected token '" + t.next + "'")
        }(t);;)
            if (t.eat("+")) e = {
                type: "plus",
                expr: e
            };
            else if (t.eat("*")) e = {
                type: "star",
                expr: e
            };
            else if (t.eat("?")) e = {
                type: "opt",
                expr: e
            };
            else {
                if (!t.eat("{")) break;
                e = j(t, e)
            }
        return e
    }
    function L(t) {
        /\D/.test(t.next) && t.err("Expected number, got '" + t.next + "'");
        var e = Number(t.next);
        return t.pos++, e
    }
    function j(t, e) {
        var n = L(t),
            r = n;
        return t.eat(",") && (r = "}" != t.next ? L(t) : -1), t.eat("}") || t.err("Unclosed braced range"), {
            type: "range",
            min: n,
            max: r,
            expr: e
        }
    }
    function W(t, e) {
        return e - t
    }
    function J(t, e) {
        var n = [];
        return function e(r) {
            var o = t[r];
            if (1 == o.length && !o[0].term) return e(o[0].to);
            n.push(r);
            for (var i = 0; i < o.length; i++) {
                var s = o[i],
                    a = s.term,
                    c = s.to;
                a || -1 != n.indexOf(c) || e(c)
            }
        }(e), n.sort(W)
    }
    function K(t) {
        var e = Object.create(null);
        for (var n in t) {
            var r = t[n];
            if (!r.hasDefault) return null;
            e[n] = r.default
        }
        return e
    }
    function H(t, e) {
        var n = Object.create(null);
        for (var r in t) {
            var o = e && e[r];
            if (void 0 === o) {
                var i = t[r];
                if (!i.hasDefault) throw new RangeError("No value supplied for attribute " + r);
                o = i.default
            }
            n[r] = o
        }
        return n
    }
    function U(t) {
        var e = Object.create(null);
        if (t)
            for (var n in t) e[n] = new X(t[n]);
        return e
    }
    V.next.get = function () {
        return this.tokens[this.pos]
    }, _.prototype.eat = function (t) {
        return this.next == t && (this.pos++ || !0)
    }, _.prototype.err = function (t) {
        throw new SyntaxError(t + " (in content expression '" + this.string + "')")
    }, Object.defineProperties(_.prototype, V);
    var G = function (t, e, n) {
            this.name = t, this.schema = e, this.spec = n, this.markSet = null, this.groups = n.group ? n.group.split(" ") : [], this.attrs = U(n.attrs), this.defaultAttrs = K(this.attrs), this.contentMatch = null, this.inlineContent = null, this.isBlock = !(n.inline || "text" == t), this.isText = "text" == t
        },
        Q = {
            isInline: {
                configurable: !0
            },
            isTextblock: {
                configurable: !0
            },
            isLeaf: {
                configurable: !0
            },
            isAtom: {
                configurable: !0
            },
            whitespace: {
                configurable: !0
            }
        };
    Q.isInline.get = function () {
        return !this.isBlock
    }, Q.isTextblock.get = function () {
        return this.isBlock && this.inlineContent
    }, Q.isLeaf.get = function () {
        return this.contentMatch == P.empty
    }, Q.isAtom.get = function () {
        return this.isLeaf || !!this.spec.atom
    }, Q.whitespace.get = function () {
        return this.spec.whitespace || (this.spec.code ? "pre" : "normal")
    }, G.prototype.hasRequiredAttrs = function () {
        for (var t in this.attrs)
            if (this.attrs[t].isRequired) return !0;
        return !1
    }, G.prototype.compatibleContent = function (t) {
        return this == t || this.contentMatch.compatible(t.contentMatch)
    }, G.prototype.computeAttrs = function (t) {
        return !t && this.defaultAttrs ? this.defaultAttrs : H(this.attrs, t)
    }, G.prototype.create = function (t, e, n) {
        if (void 0 === t && (t = null), this.isText) throw new Error("NodeType.create can't construct text nodes");
        return new A(this, this.computeAttrs(t), r.from(e), c.setFrom(n))
    }, G.prototype.createChecked = function (t, e, n) {
        if (void 0 === t && (t = null), e = r.from(e), !this.validContent(e)) throw new RangeError("Invalid content for node " + this.name);
        return new A(this, this.computeAttrs(t), e, c.setFrom(n))
    }, G.prototype.createAndFill = function (t, e, n) {
        if (void 0 === t && (t = null), t = this.computeAttrs(t), (e = r.from(e)).size) {
            var o = this.contentMatch.fillBefore(e);
            if (!o) return null;
            e = o.append(e)
        }
        var i = this.contentMatch.matchFragment(e),
            s = i && i.fillBefore(r.empty, !0);
        return s ? new A(this, t, e.append(s), c.setFrom(n)) : null
    }, G.prototype.validContent = function (t) {
        var e = this.contentMatch.matchFragment(t);
        if (!e || !e.validEnd) return !1;
        for (var n = 0; n < t.childCount; n++)
            if (!this.allowsMarks(t.child(n).marks)) return !1;
        return !0
    }, G.prototype.allowsMarkType = function (t) {
        return null == this.markSet || this.markSet.indexOf(t) > -1
    }, G.prototype.allowsMarks = function (t) {
        if (null == this.markSet) return !0;
        for (var e = 0; e < t.length; e++)
            if (!this.allowsMarkType(t[e].type)) return !1;
        return !0
    }, G.prototype.allowedMarks = function (t) {
        if (null == this.markSet) return t;
        for (var e, n = 0; n < t.length; n++) this.allowsMarkType(t[n].type) ? e && e.push(t[n]) : e || (e = t.slice(0, n));
        return e ? e.length ? e : c.none : t
    }, G.compile = function (t, e) {
        var n = Object.create(null);
        t.forEach((function (t, r) {
            return n[t] = new G(t, e, r)
        }));
        var r = e.spec.topNode || "doc";
        if (!n[r]) throw new RangeError("Schema is missing its top node type ('" + r + "')");
        if (!n.text) throw new RangeError("Every schema needs a 'text' type");
        for (var o in n.text.attrs) throw new RangeError("The text node type should not have attributes");
        return n
    }, Object.defineProperties(G.prototype, Q);
    var X = function (t) {
            this.hasDefault = Object.prototype.hasOwnProperty.call(t, "default"), this.default = t.default
        },
        Y = {
            isRequired: {
                configurable: !0
            }
        };
    Y.isRequired.get = function () {
        return !this.hasDefault
    }, Object.defineProperties(X.prototype, Y);
    var Z = function (t, e, n, r) {
        this.name = t, this.rank = e, this.schema = n, this.spec = r, this.attrs = U(r.attrs), this.excluded = null;
        var o = K(this.attrs);
        this.instance = o ? new c(this, o) : null
    };
    Z.prototype.create = function (t) {
        return void 0 === t && (t = null), !t && this.instance ? this.instance : new c(this, H(this.attrs, t))
    }, Z.compile = function (t, e) {
        var n = Object.create(null),
            r = 0;
        return t.forEach((function (t, o) {
            return n[t] = new Z(t, r++, e, o)
        })), n
    }, Z.prototype.removeFromSet = function (t) {
        for (var e = 0; e < t.length; e++) t[e].type == this && (t = t.slice(0, e).concat(t.slice(e + 1)), e--);
        return t
    }, Z.prototype.isInSet = function (t) {
        for (var e = 0; e < t.length; e++)
            if (t[e].type == this) return t[e]
    }, Z.prototype.excludes = function (t) {
        return this.excluded.indexOf(t) > -1
    };
    var tt = function (e) {
        this.cached = Object.create(null), this.spec = {
            nodes: t.from(e.nodes),
            marks: t.from(e.marks || {}),
            topNode: e.topNode
        }, this.nodes = G.compile(this.spec.nodes, this), this.marks = Z.compile(this.spec.marks, this);
        var n = Object.create(null);
        for (var r in this.nodes) {
            if (r in this.marks) throw new RangeError(r + " can not be both a node and a mark");
            var o = this.nodes[r],
                i = o.spec.content || "",
                s = o.spec.marks;
            o.contentMatch = n[i] || (n[i] = P.parse(i, this.nodes)), o.inlineContent = o.contentMatch.inlineContent, o.markSet = "_" == s ? null : s ? et(this, s.split(" ")) : "" != s && o.inlineContent ? null : []
        }
        for (var a in this.marks) {
            var c = this.marks[a],
                l = c.spec.excludes;
            c.excluded = null == l ? [c] : "" == l ? [] : et(this, l.split(" "))
        }
        this.nodeFromJSON = this.nodeFromJSON.bind(this), this.markFromJSON = this.markFromJSON.bind(this), this.topNodeType = this.nodes[this.spec.topNode || "doc"], this.cached.wrappings = Object.create(null)
    };
    function et(t, e) {
        for (var n = [], r = 0; r < e.length; r++) {
            var o = e[r],
                i = t.marks[o],
                s = i;
            if (i) n.push(i);
            else
                for (var a in t.marks) {
                    var c = t.marks[a];
                    ("_" == o || c.spec.group && c.spec.group.split(" ").indexOf(o) > -1) && n.push(s = c)
                }
            if (!s) throw new SyntaxError("Unknown mark type: '" + e[r] + "'")
        }
        return n
    }
    tt.prototype.node = function (t, e, n, r) {
        if (void 0 === e && (e = null), "string" == typeof t) t = this.nodeType(t);
        else {
            if (!(t instanceof G)) throw new RangeError("Invalid node type: " + t);
            if (t.schema != this) throw new RangeError("Node type from different schema used (" + t.name + ")")
        }
        return t.createChecked(e, n, r)
    }, tt.prototype.text = function (t, e) {
        var n = this.nodes.text;
        return new z(n, n.defaultAttrs, t, c.setFrom(e))
    }, tt.prototype.mark = function (t, e) {
        return "string" == typeof t && (t = this.marks[t]), t.create(e)
    }, tt.prototype.nodeFromJSON = function (t) {
        return A.fromJSON(this, t)
    }, tt.prototype.markFromJSON = function (t) {
        return c.fromJSON(this, t)
    }, tt.prototype.nodeType = function (t) {
        var e = this.nodes[t];
        if (!e) throw new RangeError("Unknown node type: " + t);
        return e
    };
    var nt = function (t, e) {
        var n = this;
        this.schema = t, this.rules = e, this.tags = [], this.styles = [], e.forEach((function (t) {
            t.tag ? n.tags.push(t) : t.style && n.styles.push(t)
        })), this.normalizeLists = !this.tags.some((function (e) {
            if (!/^(ul|ol)\b/.test(e.tag) || !e.node) return !1;
            var n = t.nodes[e.node];
            return n.contentMatch.matchType(n)
        }))
    };
    nt.prototype.parse = function (t, e) {
        void 0 === e && (e = {});
        var n = new ct(this, e, !1);
        return n.addAll(t, e.from, e.to), n.finish()
    }, nt.prototype.parseSlice = function (t, e) {
        void 0 === e && (e = {});
        var n = new ct(this, e, !0);
        return n.addAll(t, e.from, e.to), p.maxOpen(n.finish())
    }, nt.prototype.matchTag = function (t, e, n) {
        for (var r = n ? this.tags.indexOf(n) + 1 : 0; r < this.tags.length; r++) {
            var o = this.tags[r];
            if (pt(t, o.tag) && (void 0 === o.namespace || t.namespaceURI == o.namespace) && (!o.context || e.matchesContext(o.context))) {
                if (o.getAttrs) {
                    var i = o.getAttrs(t);
                    if (!1 === i) continue;
                    o.attrs = i || void 0
                }
                return o
            }
        }
    }, nt.prototype.matchStyle = function (t, e, n, r) {
        for (var o = r ? this.styles.indexOf(r) + 1 : 0; o < this.styles.length; o++) {
            var i = this.styles[o],
                s = i.style;
            if (!(0 != s.indexOf(t) || i.context && !n.matchesContext(i.context) || s.length > t.length && (61 != s.charCodeAt(t.length) || s.slice(t.length + 1) != e))) {
                if (i.getAttrs) {
                    var a = i.getAttrs(e);
                    if (!1 === a) continue;
                    i.attrs = a || void 0
                }
                return i
            }
        }
    }, nt.schemaRules = function (t) {
        var e = [];
        function n(t) {
            for (var n = null == t.priority ? 50 : t.priority, r = 0; r < e.length; r++) {
                var o = e[r];
                if ((null == o.priority ? 50 : o.priority) < n) break
            }
            e.splice(r, 0, t)
        }
        var r = function (e) {
            var r = t.marks[e].spec.parseDOM;
            r && r.forEach((function (t) {
                n(t = ht(t)), t.mark = e
            }))
        };
        for (var o in t.marks) r(o);
        var i;
        for (var s in t.nodes) i = void 0, (i = t.nodes[s].spec.parseDOM) && i.forEach((function (t) {
            n(t = ht(t)), t.node = s
        }));
        return e
    }, nt.fromSchema = function (t) {
        return t.cached.domParser || (t.cached.domParser = new nt(t, nt.schemaRules(t)))
    };
    var rt = {
            address: !0,
            article: !0,
            aside: !0,
            blockquote: !0,
            canvas: !0,
            dd: !0,
            div: !0,
            dl: !0,
            fieldset: !0,
            figcaption: !0,
            figure: !0,
            footer: !0,
            form: !0,
            h1: !0,
            h2: !0,
            h3: !0,
            h4: !0,
            h5: !0,
            h6: !0,
            header: !0,
            hgroup: !0,
            hr: !0,
            li: !0,
            noscript: !0,
            ol: !0,
            output: !0,
            p: !0,
            pre: !0,
            section: !0,
            table: !0,
            tfoot: !0,
            ul: !0
        },
        ot = {
            head: !0,
            noscript: !0,
            object: !0,
            script: !0,
            style: !0,
            title: !0
        },
        it = {
            ol: !0,
            ul: !0
        };
    function st(t, e, n) {
        return null != e ? (e ? 1 : 0) | ("full" === e ? 2 : 0) : t && "pre" == t.whitespace ? 3 : -5 & n
    }
    var at = function (t, e, n, r, o, i, s) {
        this.type = t, this.attrs = e, this.marks = n, this.pendingMarks = r, this.solid = o, this.options = s, this.content = [], this.activeMarks = c.none, this.stashMarks = [], this.match = i || (4 & s ? null : t.contentMatch)
    };
    at.prototype.findWrapping = function (t) {
        if (!this.match) {
            if (!this.type) return [];
            var e = this.type.contentMatch.fillBefore(r.from(t));
            if (!e) {
                var n, o = this.type.contentMatch;
                return (n = o.findWrapping(t.type)) ? (this.match = o, n) : null
            }
            this.match = this.type.contentMatch.matchFragment(e)
        }
        return this.match.findWrapping(t.type)
    }, at.prototype.finish = function (t) {
        if (!(1 & this.options)) {
            var e, n = this.content[this.content.length - 1];
            if (n && n.isText && (e = /[ \t\r\n\u000c]+$/.exec(n.text))) {
                var o = n;
                n.text.length == e[0].length ? this.content.pop() : this.content[this.content.length - 1] = o.withText(o.text.slice(0, o.text.length - e[0].length))
            }
        }
        var i = r.from(this.content);
        return !t && this.match && (i = i.append(this.match.fillBefore(r.empty, !0))), this.type ? this.type.create(this.attrs, i, this.marks) : i
    }, at.prototype.popFromStashMark = function (t) {
        for (var e = this.stashMarks.length - 1; e >= 0; e--)
            if (t.eq(this.stashMarks[e])) return this.stashMarks.splice(e, 1)[0]
    }, at.prototype.applyPending = function (t) {
        for (var e = 0, n = this.pendingMarks; e < n.length; e++) {
            var r = n[e];
            (this.type ? this.type.allowsMarkType(r.type) : ut(r.type, t)) && !r.isInSet(this.activeMarks) && (this.activeMarks = r.addToSet(this.activeMarks), this.pendingMarks = r.removeFromSet(this.pendingMarks))
        }
    }, at.prototype.inlineContext = function (t) {
        return this.type ? this.type.inlineContent : this.content.length ? this.content[0].isInline : t.parentNode && !rt.hasOwnProperty(t.parentNode.nodeName.toLowerCase())
    };
    var ct = function (t, e, n) {
            this.parser = t, this.options = e, this.isOpen = n, this.open = 0;
            var r, o = e.topNode,
                i = st(null, e.preserveWhitespace, 0) | (n ? 4 : 0);
            r = o ? new at(o.type, o.attrs, c.none, c.none, !0, e.topMatch || o.type.contentMatch, i) : new at(n ? null : t.schema.topNodeType, null, c.none, c.none, !0, null, i), this.nodes = [r], this.find = e.findPositions, this.needsBlock = !1
        },
        lt = {
            top: {
                configurable: !0
            },
            currentPos: {
                configurable: !0
            }
        };
    function pt(t, e) {
        return (t.matches || t.msMatchesSelector || t.webkitMatchesSelector || t.mozMatchesSelector).call(t, e)
    }
    function ht(t) {
        var e = {};
        for (var n in t) e[n] = t[n];
        return e
    }
    function ut(t, e) {
        var n = e.schema.nodes,
            r = function (r) {
                var o = n[r];
                if (o.allowsMarkType(t)) {
                    var i = [],
                        s = function (t) {
                            i.push(t);
                            for (var n = 0; n < t.edgeCount; n++) {
                                var r = t.edge(n),
                                    o = r.type,
                                    a = r.next;
                                if (o == e) return !0;
                                if (i.indexOf(a) < 0 && s(a)) return !0
                            }
                        };
                    return s(o.contentMatch) ? {
                        v: !0
                    } : void 0
                }
            };
        for (var o in n) {
            var i = r(o);
            if (i) return i.v
        }
    }
    lt.top.get = function () {
        return this.nodes[this.open]
    }, ct.prototype.addDOM = function (t) {
        if (3 == t.nodeType) this.addTextNode(t);
        else if (1 == t.nodeType) {
            var e = t.getAttribute("style"),
                n = e ? this.readStyles(function (t) {
                    var e, n = /\s*([\w-]+)\s*:\s*([^;]+)/g,
                        r = [];
                    for (; e = n.exec(t);) r.push(e[1], e[2].trim());
                    return r
                }(e)) : null,
                r = this.top;
            if (null != n)
                for (var o = 0; o < n.length; o++) this.addPendingMark(n[o]);
            if (this.addElement(t), null != n)
                for (var i = 0; i < n.length; i++) this.removePendingMark(n[i], r)
        }
    }, ct.prototype.addTextNode = function (t) {
        var e = t.nodeValue,
            n = this.top;
        if (2 & n.options || n.inlineContext(t) || /[^ \t\r\n\u000c]/.test(e)) {
            if (1 & n.options) e = 2 & n.options ? e.replace(/\r\n?/g, "\n") : e.replace(/\r?\n|\r/g, " ");
            else if (e = e.replace(/[ \t\r\n\u000c]+/g, " "), /^[ \t\r\n\u000c]/.test(e) && this.open == this.nodes.length - 1) {
                var r = n.content[n.content.length - 1],
                    o = t.previousSibling;
                (!r || o && "BR" == o.nodeName || r.isText && /[ \t\r\n\u000c]$/.test(r.text)) && (e = e.slice(1))
            }
            e && this.insertNode(this.parser.schema.text(e)), this.findInText(t)
        } else this.findInside(t)
    }, ct.prototype.addElement = function (t, e) {
        var n, r = t.nodeName.toLowerCase();
        it.hasOwnProperty(r) && this.parser.normalizeLists && function (t) {
            for (var e = t.firstChild, n = null; e; e = e.nextSibling) {
                var r = 1 == e.nodeType ? e.nodeName.toLowerCase() : null;
                r && it.hasOwnProperty(r) && n ? (n.appendChild(e), e = n) : "li" == r ? n = e : r && (n = null)
            }
        }(t);
        var o = this.options.ruleFromNode && this.options.ruleFromNode(t) || (n = this.parser.matchTag(t, this, e));
        if (o ? o.ignore : ot.hasOwnProperty(r)) this.findInside(t), this.ignoreFallback(t);
        else if (!o || o.skip || o.closeParent) {
            o && o.closeParent ? this.open = Math.max(0, this.open - 1) : o && o.skip.nodeType && (t = o.skip);
            var i, s = this.top,
                a = this.needsBlock;
            if (rt.hasOwnProperty(r)) i = !0, s.type || (this.needsBlock = !0);
            else if (!t.firstChild) return void this.leafFallback(t);
            this.addAll(t), i && this.sync(s), this.needsBlock = a
        } else this.addElementByRule(t, o, !1 === o.consuming ? n : void 0)
    }, ct.prototype.leafFallback = function (t) {
        "BR" == t.nodeName && this.top.type && this.top.type.inlineContent && this.addTextNode(t.ownerDocument.createTextNode("\n"))
    }, ct.prototype.ignoreFallback = function (t) {
        "BR" != t.nodeName || this.top.type && this.top.type.inlineContent || this.findPlace(this.parser.schema.text("-"))
    }, ct.prototype.readStyles = function (t) {
        var e = c.none;
        t: for (var n = 0; n < t.length; n += 2)
            for (var r = void 0;;) {
                var o = this.parser.matchStyle(t[n], t[n + 1], this, r);
                if (!o) continue t;
                if (o.ignore) return null;
                if (e = this.parser.schema.marks[o.mark].create(o.attrs).addToSet(e), !1 !== o.consuming) break;
                r = o
            }
        return e
    }, ct.prototype.addElementByRule = function (t, e, n) {
        var r, o, i, s = this;
        e.node ? (o = this.parser.schema.nodes[e.node]).isLeaf ? this.insertNode(o.create(e.attrs)) || this.leafFallback(t) : r = this.enter(o, e.attrs || null, e.preserveWhitespace) : (i = this.parser.schema.marks[e.mark].create(e.attrs), this.addPendingMark(i));
        var a = this.top;
        if (o && o.isLeaf) this.findInside(t);
        else if (n) this.addElement(t, n);
        else if (e.getContent) this.findInside(t), e.getContent(t, this.parser.schema).forEach((function (t) {
            return s.insertNode(t)
        }));
        else {
            var c = t;
            "string" == typeof e.contentElement ? c = t.querySelector(e.contentElement) : "function" == typeof e.contentElement ? c = e.contentElement(t) : e.contentElement && (c = e.contentElement), this.findAround(t, c, !0), this.addAll(c)
        }
        r && this.sync(a) && this.open--, i && this.removePendingMark(i, a)
    }, ct.prototype.addAll = function (t, e, n) {
        for (var r = e || 0, o = e ? t.childNodes[e] : t.firstChild, i = null == n ? null : t.childNodes[n]; o != i; o = o.nextSibling, ++r) this.findAtPoint(t, r), this.addDOM(o);
        this.findAtPoint(t, r)
    }, ct.prototype.findPlace = function (t) {
        for (var e, n, r = this.open; r >= 0; r--) {
            var o = this.nodes[r],
                i = o.findWrapping(t);
            if (i && (!e || e.length > i.length) && (e = i, n = o, !i.length)) break;
            if (o.solid) break
        }
        if (!e) return !1;
        this.sync(n);
        for (var s = 0; s < e.length; s++) this.enterInner(e[s], null, !1);
        return !0
    }, ct.prototype.insertNode = function (t) {
        if (t.isInline && this.needsBlock && !this.top.type) {
            var e = this.textblockFromContext();
            e && this.enterInner(e)
        }
        if (this.findPlace(t)) {
            this.closeExtra();
            var n = this.top;
            n.applyPending(t.type), n.match && (n.match = n.match.matchType(t.type));
            for (var r = n.activeMarks, o = 0; o < t.marks.length; o++) n.type && !n.type.allowsMarkType(t.marks[o].type) || (r = t.marks[o].addToSet(r));
            return n.content.push(t.mark(r)), !0
        }
        return !1
    }, ct.prototype.enter = function (t, e, n) {
        var r = this.findPlace(t.create(e));
        return r && this.enterInner(t, e, !0, n), r
    }, ct.prototype.enterInner = function (t, e, n, r) {
        void 0 === e && (e = null), void 0 === n && (n = !1), this.closeExtra();
        var o = this.top;
        o.applyPending(t), o.match = o.match && o.match.matchType(t);
        var i = st(t, r, o.options);
        4 & o.options && 0 == o.content.length && (i |= 4), this.nodes.push(new at(t, e, o.activeMarks, o.pendingMarks, n, null, i)), this.open++
    }, ct.prototype.closeExtra = function (t) {
        void 0 === t && (t = !1);
        var e = this.nodes.length - 1;
        if (e > this.open) {
            for (; e > this.open; e--) this.nodes[e - 1].content.push(this.nodes[e].finish(t));
            this.nodes.length = this.open + 1
        }
    }, ct.prototype.finish = function () {
        return this.open = 0, this.closeExtra(this.isOpen), this.nodes[0].finish(this.isOpen || this.options.topOpen)
    }, ct.prototype.sync = function (t) {
        for (var e = this.open; e >= 0; e--)
            if (this.nodes[e] == t) return this.open = e, !0;
        return !1
    }, lt.currentPos.get = function () {
        this.closeExtra();
        for (var t = 0, e = this.open; e >= 0; e--) {
            for (var n = this.nodes[e].content, r = n.length - 1; r >= 0; r--) t += n[r].nodeSize;
            e && t++
        }
        return t
    }, ct.prototype.findAtPoint = function (t, e) {
        if (this.find)
            for (var n = 0; n < this.find.length; n++) this.find[n].node == t && this.find[n].offset == e && (this.find[n].pos = this.currentPos)
    }, ct.prototype.findInside = function (t) {
        if (this.find)
            for (var e = 0; e < this.find.length; e++) null == this.find[e].pos && 1 == t.nodeType && t.contains(this.find[e].node) && (this.find[e].pos = this.currentPos)
    }, ct.prototype.findAround = function (t, e, n) {
        if (t != e && this.find)
            for (var r = 0; r < this.find.length; r++) {
                if (null == this.find[r].pos && 1 == t.nodeType && t.contains(this.find[r].node)) e.compareDocumentPosition(this.find[r].node) & (n ? 2 : 4) && (this.find[r].pos = this.currentPos)
            }
    }, ct.prototype.findInText = function (t) {
        if (this.find)
            for (var e = 0; e < this.find.length; e++) this.find[e].node == t && (this.find[e].pos = this.currentPos - (t.nodeValue.length - this.find[e].offset))
    }, ct.prototype.matchesContext = function (t) {
        var e = this;
        if (t.indexOf("|") > -1) return t.split(/\s*\|\s*/).some(this.matchesContext, this);
        var n = t.split("/"),
            r = this.options.context,
            o = !(this.isOpen || r && r.parent.type != this.nodes[0].type),
            i = -(r ? r.depth + 1 : 0) + (o ? 0 : 1),
            s = function (t, a) {
                for (; t >= 0; t--) {
                    var c = n[t];
                    if ("" == c) {
                        if (t == n.length - 1 || 0 == t) continue;
                        for (; a >= i; a--)
                            if (s(t - 1, a)) return !0;
                        return !1
                    }
                    var l = a > 0 || 0 == a && o ? e.nodes[a].type : r && a >= i ? r.node(a - i).type : null;
                    if (!l || l.name != c && -1 == l.groups.indexOf(c)) return !1;
                    a--
                }
                return !0
            };
        return s(n.length - 1, this.open)
    }, ct.prototype.textblockFromContext = function () {
        var t = this.options.context;
        if (t)
            for (var e = t.depth; e >= 0; e--) {
                var n = t.node(e).contentMatchAt(t.indexAfter(e)).defaultType;
                if (n && n.isTextblock && n.defaultAttrs) return n
            }
        for (var r in this.parser.schema.nodes) {
            var o = this.parser.schema.nodes[r];
            if (o.isTextblock && o.defaultAttrs) return o
        }
    }, ct.prototype.addPendingMark = function (t) {
        var e = function (t, e) {
            for (var n = 0; n < e.length; n++)
                if (t.eq(e[n])) return e[n]
        }(t, this.top.pendingMarks);
        e && this.top.stashMarks.push(e), this.top.pendingMarks = t.addToSet(this.top.pendingMarks)
    }, ct.prototype.removePendingMark = function (t, e) {
        for (var n = this.open; n >= 0; n--) {
            var r = this.nodes[n];
            if (r.pendingMarks.lastIndexOf(t) > -1) r.pendingMarks = t.removeFromSet(r.pendingMarks);
            else {
                r.activeMarks = t.removeFromSet(r.activeMarks);
                var o = r.popFromStashMark(t);
                o && r.type && r.type.allowsMarkType(o.type) && (r.activeMarks = o.addToSet(r.activeMarks))
            }
            if (r == e) break
        }
    }, Object.defineProperties(ct.prototype, lt);
    var ft = function (t, e) {
        this.nodes = t, this.marks = e
    };
    function dt(t) {
        var e = {};
        for (var n in t) {
            var r = t[n].spec.toDOM;
            r && (e[n] = r)
        }
        return e
    }
    function mt(t) {
        return t.document || window.document
    }
    ft.prototype.serializeFragment = function (t, e, n) {
        var r = this;
        void 0 === e && (e = {}), n || (n = mt(e).createDocumentFragment());
        var o = n,
            i = [];
        return t.forEach((function (t) {
            if (i.length || t.marks.length) {
                for (var n = 0, s = 0; n < i.length && s < t.marks.length;) {
                    var a = t.marks[s];
                    if (r.marks[a.type.name]) {
                        if (!a.eq(i[n][0]) || !1 === a.type.spec.spanning) break;
                        n++, s++
                    } else s++
                }
                for (; n < i.length;) o = i.pop()[1];
                for (; s < t.marks.length;) {
                    var c = t.marks[s++],
                        l = r.serializeMark(c, t.isInline, e);
                    l && (i.push([c, o]), o.appendChild(l.dom), o = l.contentDOM || l.dom)
                }
            }
            o.appendChild(r.serializeNodeInner(t, e))
        })), n
    }, ft.prototype.serializeNodeInner = function (t, e) {
        var n = ft.renderSpec(mt(e), this.nodes[t.type.name](t)),
            r = n.dom,
            o = n.contentDOM;
        if (o) {
            if (t.isLeaf) throw new RangeError("Content hole not allowed in a leaf node spec");
            this.serializeFragment(t.content, e, o)
        }
        return r
    }, ft.prototype.serializeNode = function (t, e) {
        void 0 === e && (e = {});
        for (var n = this.serializeNodeInner(t, e), r = t.marks.length - 1; r >= 0; r--) {
            var o = this.serializeMark(t.marks[r], t.isInline, e);
            o && ((o.contentDOM || o.dom).appendChild(n), n = o.dom)
        }
        return n
    }, ft.prototype.serializeMark = function (t, e, n) {
        void 0 === n && (n = {});
        var r = this.marks[t.type.name];
        return r && ft.renderSpec(mt(n), r(t, e))
    }, ft.renderSpec = function (t, e, n) {
        if (void 0 === n && (n = null), "string" == typeof e) return {
            dom: t.createTextNode(e)
        };
        if (null != e.nodeType) return {
            dom: e
        };
        if (e.dom && null != e.dom.nodeType) return e;
        var r, o = e[0],
            i = o.indexOf(" ");
        i > 0 && (n = o.slice(0, i), o = o.slice(i + 1));
        var s = n ? t.createElementNS(n, o) : t.createElement(o),
            a = e[1],
            c = 1;
        if (a && "object" == typeof a && null == a.nodeType && !Array.isArray(a))
            for (var l in c = 2, a)
                if (null != a[l]) {
                    var p = l.indexOf(" ");
                    p > 0 ? s.setAttributeNS(l.slice(0, p), l.slice(p + 1), a[l]) : s.setAttribute(l, a[l])
                } for (var h = c; h < e.length; h++) {
            var u = e[h];
            if (0 === u) {
                if (h < e.length - 1 || h > c) throw new RangeError("Content hole must be the only child of its parent node");
                return {
                    dom: s,
                    contentDOM: s
                }
            }
            var f = ft.renderSpec(t, u, n),
                d = f.dom,
                m = f.contentDOM;
            if (s.appendChild(d), m) {
                if (r) throw new RangeError("Multiple content holes");
                r = m
            }
        }
        return {
            dom: s,
            contentDOM: r
        }
    }, ft.fromSchema = function (t) {
        return t.cached.domSerializer || (t.cached.domSerializer = new ft(this.nodesFromSchema(t), this.marksFromSchema(t)))
    }, ft.nodesFromSchema = function (t) {
        var e = dt(t.nodes);
        return e.text || (e.text = function (t) {
            return t.text
        }), e
    }, ft.marksFromSchema = function (t) {
        return dt(t.marks)
    };
    var vt = Object.freeze({
            __proto__: null,
            ContentMatch: P,
            DOMParser: nt,
            DOMSerializer: ft,
            Fragment: r,
            Mark: c,
            MarkType: Z,
            Node: A,
            NodeRange: D,
            NodeType: G,
            ReplaceError: l,
            ResolvedPos: S,
            Schema: tt,
            Slice: p
        }),
        gt = Math.pow(2, 16);
    function yt(t) {
        return 65535 & t
    }
    var wt = function (t, e, n) {
            this.pos = t, this.delInfo = e, this.recover = n
        },
        bt = {
            deleted: {
                configurable: !0
            },
            deletedBefore: {
                configurable: !0
            },
            deletedAfter: {
                configurable: !0
            },
            deletedAcross: {
                configurable: !0
            }
        };
    bt.deleted.get = function () {
        return (8 & this.delInfo) > 0
    }, bt.deletedBefore.get = function () {
        return (5 & this.delInfo) > 0
    }, bt.deletedAfter.get = function () {
        return (6 & this.delInfo) > 0
    }, bt.deletedAcross.get = function () {
        return (4 & this.delInfo) > 0
    }, Object.defineProperties(wt.prototype, bt);
    var kt = function t(e, n) {
        if (void 0 === n && (n = !1), this.ranges = e, this.inverted = n, !e.length && t.empty) return t.empty
    };
    kt.prototype.recover = function (t) {
        var e = 0,
            n = yt(t);
        if (!this.inverted)
            for (var r = 0; r < n; r++) e += this.ranges[3 * r + 2] - this.ranges[3 * r + 1];
        return this.ranges[3 * n] + e + function (t) {
            return (t - (65535 & t)) / gt
        }(t)
    }, kt.prototype.mapResult = function (t, e) {
        return void 0 === e && (e = 1), this._map(t, e, !1)
    }, kt.prototype.map = function (t, e) {
        return void 0 === e && (e = 1), this._map(t, e, !0)
    }, kt.prototype._map = function (t, e, n) {
        for (var r = 0, o = this.inverted ? 2 : 1, i = this.inverted ? 1 : 2, s = 0; s < this.ranges.length; s += 3) {
            var a = this.ranges[s] - (this.inverted ? r : 0);
            if (a > t) break;
            var c = this.ranges[s + o],
                l = this.ranges[s + i],
                p = a + c;
            if (t <= p) {
                var h = a + r + ((c ? t == a ? -1 : t == p ? 1 : e : e) < 0 ? 0 : l);
                if (n) return h;
                var u = t == (e < 0 ? a : p) ? null : s / 3 + (t - a) * gt,
                    f = t == a ? 2 : t == p ? 1 : 4;
                return (e < 0 ? t != a : t != p) && (f |= 8), new wt(h, f, u)
            }
            r += l - c
        }
        return n ? t + r : new wt(t + r, 0, null)
    }, kt.prototype.touches = function (t, e) {
        for (var n = 0, r = yt(e), o = this.inverted ? 2 : 1, i = this.inverted ? 1 : 2, s = 0; s < this.ranges.length; s += 3) {
            var a = this.ranges[s] - (this.inverted ? n : 0);
            if (a > t) break;
            var c = this.ranges[s + o];
            if (t <= a + c && s == 3 * r) return !0;
            n += this.ranges[s + i] - c
        }
        return !1
    }, kt.prototype.forEach = function (t) {
        for (var e = this.inverted ? 2 : 1, n = this.inverted ? 1 : 2, r = 0, o = 0; r < this.ranges.length; r += 3) {
            var i = this.ranges[r],
                s = i - (this.inverted ? o : 0),
                a = i + (this.inverted ? 0 : o),
                c = this.ranges[r + e],
                l = this.ranges[r + n];
            t(s, s + c, a, a + l), o += l - c
        }
    }, kt.prototype.invert = function () {
        return new kt(this.ranges, !this.inverted)
    }, kt.prototype.toString = function () {
        return (this.inverted ? "-" : "") + JSON.stringify(this.ranges)
    }, kt.offset = function (t) {
        return 0 == t ? kt.empty : new kt(t < 0 ? [0, -t, 0] : [0, 0, t])
    }, kt.empty = new kt([]);
    var xt = function (t, e, n, r) {
        void 0 === t && (t = []), void 0 === n && (n = 0), void 0 === r && (r = t.length), this.maps = t, this.mirror = e, this.from = n, this.to = r
    };
    xt.prototype.slice = function (t, e) {
        return void 0 === t && (t = 0), void 0 === e && (e = this.maps.length), new xt(this.maps, this.mirror, t, e)
    }, xt.prototype.copy = function () {
        return new xt(this.maps.slice(), this.mirror && this.mirror.slice(), this.from, this.to)
    }, xt.prototype.appendMap = function (t, e) {
        this.to = this.maps.push(t), null != e && this.setMirror(this.maps.length - 1, e)
    }, xt.prototype.appendMapping = function (t) {
        for (var e = 0, n = this.maps.length; e < t.maps.length; e++) {
            var r = t.getMirror(e);
            this.appendMap(t.maps[e], null != r && r < e ? n + r : void 0)
        }
    }, xt.prototype.getMirror = function (t) {
        if (this.mirror)
            for (var e = 0; e < this.mirror.length; e++)
                if (this.mirror[e] == t) return this.mirror[e + (e % 2 ? -1 : 1)]
    }, xt.prototype.setMirror = function (t, e) {
        this.mirror || (this.mirror = []), this.mirror.push(t, e)
    }, xt.prototype.appendMappingInverted = function (t) {
        for (var e = t.maps.length - 1, n = this.maps.length + t.maps.length; e >= 0; e--) {
            var r = t.getMirror(e);
            this.appendMap(t.maps[e].invert(), null != r && r > e ? n - r - 1 : void 0)
        }
    }, xt.prototype.invert = function () {
        var t = new xt;
        return t.appendMappingInverted(this), t
    }, xt.prototype.map = function (t, e) {
        if (void 0 === e && (e = 1), this.mirror) return this._map(t, e, !0);
        for (var n = this.from; n < this.to; n++) t = this.maps[n].map(t, e);
        return t
    }, xt.prototype.mapResult = function (t, e) {
        return void 0 === e && (e = 1), this._map(t, e, !1)
    }, xt.prototype._map = function (t, e, n) {
        for (var r = 0, o = this.from; o < this.to; o++) {
            var i = this.maps[o].mapResult(t, e);
            if (null != i.recover) {
                var s = this.getMirror(o);
                if (null != s && s > o && s < this.to) {
                    o = s, t = this.maps[s].recover(i.recover);
                    continue
                }
            }
            r |= i.delInfo, t = i.pos
        }
        return n ? t : new wt(t, r, null)
    };
    var St = Object.create(null),
        Mt = function () {};
    Mt.prototype.getMap = function () {
        return kt.empty
    }, Mt.prototype.merge = function (t) {
        return null
    }, Mt.fromJSON = function (t, e) {
        if (!e || !e.stepType) throw new RangeError("Invalid input for Step.fromJSON");
        var n = St[e.stepType];
        if (!n) throw new RangeError("No step type " + e.stepType + " defined");
        return n.fromJSON(t, e)
    }, Mt.jsonID = function (t, e) {
        if (t in St) throw new RangeError("Duplicate use of step JSON ID " + t);
        return St[t] = e, e.prototype.jsonID = t, e
    };
    var Ct = function (t, e) {
        this.doc = t, this.failed = e
    };
    function Ot(t, e, n) {
        for (var o = [], i = 0; i < t.childCount; i++) {
            var s = t.child(i);
            s.content.size && (s = s.copy(Ot(s.content, e, s))), s.isInline && (s = e(s, n, i)), o.push(s)
        }
        return r.fromArray(o)
    }
    Ct.ok = function (t) {
        return new Ct(t, null)
    }, Ct.fail = function (t) {
        return new Ct(null, t)
    }, Ct.fromReplace = function (t, e, n, r) {
        try {
            return Ct.ok(t.replace(e, n, r))
        } catch (t) {
            if (t instanceof l) return Ct.fail(t.message);
            throw t
        }
    };
    var Nt = function (t) {
        function e(e, n, r) {
            t.call(this), this.from = e, this.to = n, this.mark = r
        }
        return t && (e.__proto__ = t), e.prototype = Object.create(t && t.prototype), e.prototype.constructor = e, e.prototype.apply = function (t) {
            var e = this,
                n = t.slice(this.from, this.to),
                r = t.resolve(this.from),
                o = r.node(r.sharedDepth(this.to)),
                i = new p(Ot(n.content, (function (t, n) {
                    return t.isAtom && n.type.allowsMarkType(e.mark.type) ? t.mark(e.mark.addToSet(t.marks)) : t
                }), o), n.openStart, n.openEnd);
            return Ct.fromReplace(t, this.from, this.to, i)
        }, e.prototype.invert = function () {
            return new Dt(this.from, this.to, this.mark)
        }, e.prototype.map = function (t) {
            var n = t.mapResult(this.from, 1),
                r = t.mapResult(this.to, -1);
            return n.deleted && r.deleted || n.pos >= r.pos ? null : new e(n.pos, r.pos, this.mark)
        }, e.prototype.merge = function (t) {
            return t instanceof e && t.mark.eq(this.mark) && this.from <= t.to && this.to >= t.from ? new e(Math.min(this.from, t.from), Math.max(this.to, t.to), this.mark) : null
        }, e.prototype.toJSON = function () {
            return {
                stepType: "addMark",
                mark: this.mark.toJSON(),
                from: this.from,
                to: this.to
            }
        }, e.fromJSON = function (t, n) {
            if ("number" != typeof n.from || "number" != typeof n.to) throw new RangeError("Invalid input for AddMarkStep.fromJSON");
            return new e(n.from, n.to, t.markFromJSON(n.mark))
        }, e
    }(Mt);
    Mt.jsonID("addMark", Nt);
    var Dt = function (t) {
        function e(e, n, r) {
            t.call(this), this.from = e, this.to = n, this.mark = r
        }
        return t && (e.__proto__ = t), e.prototype = Object.create(t && t.prototype), e.prototype.constructor = e, e.prototype.apply = function (t) {
            var e = this,
                n = t.slice(this.from, this.to),
                r = new p(Ot(n.content, (function (t) {
                    return t.mark(e.mark.removeFromSet(t.marks))
                }), t), n.openStart, n.openEnd);
            return Ct.fromReplace(t, this.from, this.to, r)
        }, e.prototype.invert = function () {
            return new Nt(this.from, this.to, this.mark)
        }, e.prototype.map = function (t) {
            var n = t.mapResult(this.from, 1),
                r = t.mapResult(this.to, -1);
            return n.deleted && r.deleted || n.pos >= r.pos ? null : new e(n.pos, r.pos, this.mark)
        }, e.prototype.merge = function (t) {
            return t instanceof e && t.mark.eq(this.mark) && this.from <= t.to && this.to >= t.from ? new e(Math.min(this.from, t.from), Math.max(this.to, t.to), this.mark) : null
        }, e.prototype.toJSON = function () {
            return {
                stepType: "removeMark",
                mark: this.mark.toJSON(),
                from: this.from,
                to: this.to
            }
        }, e.fromJSON = function (t, n) {
            if ("number" != typeof n.from || "number" != typeof n.to) throw new RangeError("Invalid input for RemoveMarkStep.fromJSON");
            return new e(n.from, n.to, t.markFromJSON(n.mark))
        }, e
    }(Mt);
    Mt.jsonID("removeMark", Dt);
    var Tt = function (t) {
        function e(e, n, r, o) {
            void 0 === o && (o = !1), t.call(this), this.from = e, this.to = n, this.slice = r, this.structure = o
        }
        return t && (e.__proto__ = t), e.prototype = Object.create(t && t.prototype), e.prototype.constructor = e, e.prototype.apply = function (t) {
            return this.structure && At(t, this.from, this.to) ? Ct.fail("Structure replace would overwrite content") : Ct.fromReplace(t, this.from, this.to, this.slice)
        }, e.prototype.getMap = function () {
            return new kt([this.from, this.to - this.from, this.slice.size])
        }, e.prototype.invert = function (t) {
            return new e(this.from, this.from + this.slice.size, t.slice(this.from, this.to))
        }, e.prototype.map = function (t) {
            var n = t.mapResult(this.from, 1),
                r = t.mapResult(this.to, -1);
            return n.deletedAcross && r.deletedAcross ? null : new e(n.pos, Math.max(n.pos, r.pos), this.slice)
        }, e.prototype.merge = function (t) {
            if (!(t instanceof e) || t.structure || this.structure) return null;
            if (this.from + this.slice.size != t.from || this.slice.openEnd || t.slice.openStart) {
                if (t.to != this.from || this.slice.openStart || t.slice.openEnd) return null;
                var n = this.slice.size + t.slice.size == 0 ? p.empty : new p(t.slice.content.append(this.slice.content), t.slice.openStart, this.slice.openEnd);
                return new e(t.from, this.to, n, this.structure)
            }
            var r = this.slice.size + t.slice.size == 0 ? p.empty : new p(this.slice.content.append(t.slice.content), this.slice.openStart, t.slice.openEnd);
            return new e(this.from, this.to + (t.to - t.from), r, this.structure)
        }, e.prototype.toJSON = function () {
            var t = {
                stepType: "replace",
                from: this.from,
                to: this.to
            };
            return this.slice.size && (t.slice = this.slice.toJSON()), this.structure && (t.structure = !0), t
        }, e.fromJSON = function (t, n) {
            if ("number" != typeof n.from || "number" != typeof n.to) throw new RangeError("Invalid input for ReplaceStep.fromJSON");
            return new e(n.from, n.to, p.fromJSON(t, n.slice), !!n.structure)
        }, e
    }(Mt);
    Mt.jsonID("replace", Tt);
    var Et = function (t) {
        function e(e, n, r, o, i, s, a) {
            void 0 === a && (a = !1), t.call(this), this.from = e, this.to = n, this.gapFrom = r, this.gapTo = o, this.slice = i, this.insert = s, this.structure = a
        }
        return t && (e.__proto__ = t), e.prototype = Object.create(t && t.prototype), e.prototype.constructor = e, e.prototype.apply = function (t) {
            if (this.structure && (At(t, this.from, this.gapFrom) || At(t, this.gapTo, this.to))) return Ct.fail("Structure gap-replace would overwrite content");
            var e = t.slice(this.gapFrom, this.gapTo);
            if (e.openStart || e.openEnd) return Ct.fail("Gap is not a flat range");
            var n = this.slice.insertAt(this.insert, e.content);
            return n ? Ct.fromReplace(t, this.from, this.to, n) : Ct.fail("Content does not fit in gap")
        }, e.prototype.getMap = function () {
            return new kt([this.from, this.gapFrom - this.from, this.insert, this.gapTo, this.to - this.gapTo, this.slice.size - this.insert])
        }, e.prototype.invert = function (t) {
            var n = this.gapTo - this.gapFrom;
            return new e(this.from, this.from + this.slice.size + n, this.from + this.insert, this.from + this.insert + n, t.slice(this.from, this.to).removeBetween(this.gapFrom - this.from, this.gapTo - this.from), this.gapFrom - this.from, this.structure)
        }, e.prototype.map = function (t) {
            var n = t.mapResult(this.from, 1),
                r = t.mapResult(this.to, -1),
                o = t.map(this.gapFrom, -1),
                i = t.map(this.gapTo, 1);
            return n.deletedAcross && r.deletedAcross || o < n.pos || i > r.pos ? null : new e(n.pos, r.pos, o, i, this.slice, this.insert, this.structure)
        }, e.prototype.toJSON = function () {
            var t = {
                stepType: "replaceAround",
                from: this.from,
                to: this.to,
                gapFrom: this.gapFrom,
                gapTo: this.gapTo,
                insert: this.insert
            };
            return this.slice.size && (t.slice = this.slice.toJSON()), this.structure && (t.structure = !0), t
        }, e.fromJSON = function (t, n) {
            if ("number" != typeof n.from || "number" != typeof n.to || "number" != typeof n.gapFrom || "number" != typeof n.gapTo || "number" != typeof n.insert) throw new RangeError("Invalid input for ReplaceAroundStep.fromJSON");
            return new e(n.from, n.to, n.gapFrom, n.gapTo, p.fromJSON(t, n.slice), n.insert, !!n.structure)
        }, e
    }(Mt);
    function At(t, e, n) {
        for (var r = t.resolve(e), o = n - e, i = r.depth; o > 0 && i > 0 && r.indexAfter(i) == r.node(i).childCount;) i--, o--;
        if (o > 0)
            for (var s = r.node(i).maybeChild(r.indexAfter(i)); o > 0;) {
                if (!s || s.isLeaf) return !0;
                s = s.firstChild, o--
            }
        return !1
    }
    function It(t, e, n) {
        return (0 == e || t.canReplace(e, t.childCount)) && (n == t.childCount || t.canReplace(0, n))
    }
    function zt(t) {
        for (var e = t.parent.content.cutByIndex(t.startIndex, t.endIndex), n = t.depth;; --n) {
            var r = t.$from.node(n),
                o = t.$from.index(n),
                i = t.$to.indexAfter(n);
            if (n < t.depth && r.canReplace(o, i, e)) return n;
            if (0 == n || r.type.spec.isolating || !It(r, o, i)) break
        }
        return null
    }
    function Rt(t, e, n, r) {
        void 0 === n && (n = null), void 0 === r && (r = t);
        var o = function (t, e) {
                var n = t.parent,
                    r = t.startIndex,
                    o = t.endIndex,
                    i = n.contentMatchAt(r).findWrapping(e);
                if (!i) return null;
                var s = i.length ? i[0] : e;
                return n.canReplaceWith(r, o, s) ? i : null
            }(t, e),
            i = o && function (t, e) {
                var n = t.parent,
                    r = t.startIndex,
                    o = t.endIndex,
                    i = n.child(r),
                    s = e.contentMatch.findWrapping(i.type);
                if (!s) return null;
                for (var a = (s.length ? s[s.length - 1] : e).contentMatch, c = r; a && c < o; c++) a = a.matchType(n.child(c).type);
                if (!a || !a.validEnd) return null;
                return s
            }(r, e);
        return i ? o.map(Pt).concat({
            type: e,
            attrs: n
        }).concat(i.map(Pt)) : null
    }
    function Pt(t) {
        return {
            type: t,
            attrs: null
        }
    }
    function Bt(t, e, n, r) {
        void 0 === n && (n = 1);
        var o = t.resolve(e),
            i = o.depth - n,
            s = r && r[r.length - 1] || o.parent;
        if (i < 0 || o.parent.type.spec.isolating || !o.parent.canReplace(o.index(), o.parent.childCount) || !s.type.validContent(o.parent.content.cutByIndex(o.index(), o.parent.childCount))) return !1;
        for (var a = o.depth - 1, c = n - 2; a > i; a--, c--) {
            var l = o.node(a),
                p = o.index(a);
            if (l.type.spec.isolating) return !1;
            var h = l.content.cutByIndex(p, l.childCount),
                u = r && r[c] || l;
            if (u != l && (h = h.replaceChild(0, u.type.create(u.attrs))), !l.canReplace(p + 1, l.childCount) || !u.type.validContent(h)) return !1
        }
        var f = o.indexAfter(i),
            d = r && r[0];
        return o.node(i).canReplaceWith(f, f, d ? d.type : o.node(i + 1).type)
    }
    function _t(t, e) {
        var n = t.resolve(e),
            r = n.index();
        return Vt(n.nodeBefore, n.nodeAfter) && n.parent.canReplace(r, r + 1)
    }
    function Vt(t, e) {
        return !(!t || !e || t.isLeaf || !t.canAppend(e))
    }
    function Ft(t, e, n) {
        void 0 === n && (n = -1);
        for (var r = t.resolve(e), o = r.depth;; o--) {
            var i = void 0,
                s = void 0,
                a = r.index(o);
            if (o == r.depth ? (i = r.nodeBefore, s = r.nodeAfter) : n > 0 ? (i = r.node(o + 1), a++, s = r.node(o).maybeChild(a)) : (i = r.node(o).maybeChild(a - 1), s = r.node(o + 1)), i && !i.isTextblock && Vt(i, s) && r.node(o).canReplace(a, a + 1)) return e;
            if (0 == o) break;
            e = n < 0 ? r.before(o) : r.after(o)
        }
    }
    function $t(t, e, n) {
        var r = t.resolve(e);
        if (r.parent.canReplaceWith(r.index(), r.index(), n)) return e;
        if (0 == r.parentOffset)
            for (var o = r.depth - 1; o >= 0; o--) {
                var i = r.index(o);
                if (r.node(o).canReplaceWith(i, i, n)) return r.before(o + 1);
                if (i > 0) return null
            }
        if (r.parentOffset == r.parent.content.size)
            for (var s = r.depth - 1; s >= 0; s--) {
                var a = r.indexAfter(s);
                if (r.node(s).canReplaceWith(a, a, n)) return r.after(s + 1);
                if (a < r.node(s).childCount) return null
            }
        return null
    }
    function qt(t, e, n) {
        var r = t.resolve(e);
        if (!n.content.size) return e;
        for (var o = n.content, i = 0; i < n.openStart; i++) o = o.firstChild.content;
        for (var s = 1; s <= (0 == n.openStart && n.size ? 2 : 1); s++)
            for (var a = r.depth; a >= 0; a--) {
                var c = a == r.depth ? 0 : r.pos <= (r.start(a + 1) + r.end(a + 1)) / 2 ? -1 : 1,
                    l = r.index(a) + (c > 0 ? 1 : 0),
                    p = r.node(a),
                    h = !1;
                if (1 == s) h = p.canReplace(l, l, o);
                else {
                    var u = p.contentMatchAt(l).findWrapping(o.firstChild.type);
                    h = u && p.canReplaceWith(l, l, u[0])
                }
                if (h) return 0 == c ? r.pos : c < 0 ? r.before(a + 1) : r.after(a + 1)
            }
        return null
    }
    function Lt(t, e, n, r) {
        if (void 0 === n && (n = e), void 0 === r && (r = p.empty), e == n && !r.size) return null;
        var o = t.resolve(e),
            i = t.resolve(n);
        return jt(o, i, r) ? new Tt(e, n, r) : new Wt(o, i, r).fit()
    }
    function jt(t, e, n) {
        return !n.openStart && !n.openEnd && t.start() == e.start() && t.parent.canReplace(t.index(), e.index(), n.content)
    }
    Mt.jsonID("replaceAround", Et);
    var Wt = function (t, e, n) {
            this.$from = t, this.$to = e, this.unplaced = n, this.frontier = [], this.placed = r.empty;
            for (var o = 0; o <= t.depth; o++) {
                var i = t.node(o);
                this.frontier.push({
                    type: i.type,
                    match: i.contentMatchAt(t.indexAfter(o))
                })
            }
            for (var s = t.depth; s > 0; s--) this.placed = r.from(t.node(s).copy(this.placed))
        },
        Jt = {
            depth: {
                configurable: !0
            }
        };
    function Kt(t, e, n) {
        return 0 == e ? t.cutByIndex(n, t.childCount) : t.replaceChild(0, t.firstChild.copy(Kt(t.firstChild.content, e - 1, n)))
    }
    function Ht(t, e, n) {
        return 0 == e ? t.append(n) : t.replaceChild(t.childCount - 1, t.lastChild.copy(Ht(t.lastChild.content, e - 1, n)))
    }
    function Ut(t, e) {
        for (var n = 0; n < e; n++) t = t.firstChild.content;
        return t
    }
    function Gt(t, e, n) {
        if (e <= 0) return t;
        var o = t.content;
        return e > 1 && (o = o.replaceChild(0, Gt(o.firstChild, e - 1, 1 == o.childCount ? n - 1 : 0))), e > 0 && (o = t.type.contentMatch.fillBefore(o).append(o), n <= 0 && (o = o.append(t.type.contentMatch.matchFragment(o).fillBefore(r.empty, !0)))), t.copy(o)
    }
    function Qt(t, e, n, r, o) {
        var i = t.node(e),
            s = o ? t.indexAfter(e) : t.index(e);
        if (s == i.childCount && !n.compatibleContent(i.type)) return null;
        var a = r.fillBefore(i.content, !0, s);
        return a && ! function (t, e, n) {
            for (var r = n; r < e.childCount; r++)
                if (!t.allowsMarks(e.child(r).marks)) return !0;
            return !1
        }(n, i.content, s) ? a : null
    }
    function Xt(t) {
        return t.spec.defining || t.spec.definingForContent
    }
    function Yt(t, e, n, o, i) {
        if (e < n) {
            var s = t.firstChild;
            t = t.replaceChild(0, s.copy(Yt(s.content, e + 1, n, o, s)))
        }
        if (e > o) {
            var a = i.contentMatchAt(0),
                c = a.fillBefore(t).append(t);
            t = c.append(a.matchFragment(c).fillBefore(r.empty, !0))
        }
        return t
    }
    function Zt(t, e) {
        for (var n = [], r = Math.min(t.depth, e.depth); r >= 0; r--) {
            var o = t.start(r);
            if (o < t.pos - (t.depth - r) || e.end(r) > e.pos + (e.depth - r) || t.node(r).type.spec.isolating || e.node(r).type.spec.isolating) break;
            (o == e.start(r) || r == t.depth && r == e.depth && t.parent.inlineContent && e.parent.inlineContent && r && e.start(r - 1) == o - 1) && n.push(r)
        }
        return n
    }
    Jt.depth.get = function () {
        return this.frontier.length - 1
    }, Wt.prototype.fit = function () {
        for (; this.unplaced.size;) {
            var t = this.findFittable();
            t ? this.placeNodes(t) : this.openMore() || this.dropNode()
        }
        var e = this.mustMoveInline(),
            n = this.placed.size - this.depth - this.$from.depth,
            r = this.$from,
            o = this.close(e < 0 ? this.$to : r.doc.resolve(e));
        if (!o) return null;
        for (var i = this.placed, s = r.depth, a = o.depth; s && a && 1 == i.childCount;) i = i.firstChild.content, s--, a--;
        var c = new p(i, s, a);
        return e > -1 ? new Et(r.pos, e, this.$to.pos, this.$to.end(), c, n) : c.size || r.pos != this.$to.pos ? new Tt(r.pos, o.pos, c) : null
    }, Wt.prototype.findFittable = function () {
        for (var t = 1; t <= 2; t++)
            for (var e = this.unplaced.openStart; e >= 0; e--)
                for (var n = null, o = (e ? (n = Ut(this.unplaced.content, e - 1).firstChild).content : this.unplaced.content).firstChild, i = this.depth; i >= 0; i--) {
                    var s = this.frontier[i],
                        a = s.type,
                        c = s.match,
                        l = void 0,
                        p = null;
                    if (1 == t && (o ? c.matchType(o.type) || (p = c.fillBefore(r.from(o), !1)) : n && a.compatibleContent(n.type))) return {
                        sliceDepth: e,
                        frontierDepth: i,
                        parent: n,
                        inject: p
                    };
                    if (2 == t && o && (l = c.findWrapping(o.type))) return {
                        sliceDepth: e,
                        frontierDepth: i,
                        parent: n,
                        wrap: l
                    };
                    if (n && c.matchType(n.type)) break
                }
    }, Wt.prototype.openMore = function () {
        var t = this.unplaced,
            e = t.content,
            n = t.openStart,
            r = t.openEnd,
            o = Ut(e, n);
        return !(!o.childCount || o.firstChild.isLeaf) && (this.unplaced = new p(e, n + 1, Math.max(r, o.size + n >= e.size - r ? n + 1 : 0)), !0)
    }, Wt.prototype.dropNode = function () {
        var t = this.unplaced,
            e = t.content,
            n = t.openStart,
            r = t.openEnd,
            o = Ut(e, n);
        if (o.childCount <= 1 && n > 0) {
            var i = e.size - n <= n + o.size;
            this.unplaced = new p(Kt(e, n - 1, 1), n - 1, i ? n - 1 : r)
        } else this.unplaced = new p(Kt(e, n, 1), n, r)
    }, Wt.prototype.placeNodes = function (t) {
        for (var e = t.sliceDepth, n = t.frontierDepth, o = t.parent, i = t.inject, s = t.wrap; this.depth > n;) this.closeFrontierNode();
        if (s)
            for (var a = 0; a < s.length; a++) this.openFrontierNode(s[a]);
        var c = this.unplaced,
            l = o ? o.content : c.content,
            h = c.openStart - e,
            u = 0,
            f = [],
            d = this.frontier[n],
            m = d.match,
            v = d.type;
        if (i) {
            for (var g = 0; g < i.childCount; g++) f.push(i.child(g));
            m = m.matchFragment(i)
        }
        for (var y = l.size + e - (c.content.size - c.openEnd); u < l.childCount;) {
            var w = l.child(u),
                b = m.matchType(w.type);
            if (!b) break;
            (++u > 1 || 0 == h || w.content.size) && (m = b, f.push(Gt(w.mark(v.allowedMarks(w.marks)), 1 == u ? h : 0, u == l.childCount ? y : -1)))
        }
        var k = u == l.childCount;
        k || (y = -1), this.placed = Ht(this.placed, n, r.from(f)), this.frontier[n].match = m, k && y < 0 && o && o.type == this.frontier[this.depth].type && this.frontier.length > 1 && this.closeFrontierNode();
        for (var x = 0, S = l; x < y; x++) {
            var M = S.lastChild;
            this.frontier.push({
                type: M.type,
                match: M.contentMatchAt(M.childCount)
            }), S = M.content
        }
        this.unplaced = k ? 0 == e ? p.empty : new p(Kt(c.content, e - 1, 1), e - 1, y < 0 ? c.openEnd : e - 1) : new p(Kt(c.content, e, u), c.openStart, c.openEnd)
    }, Wt.prototype.mustMoveInline = function () {
        if (!this.$to.parent.isTextblock) return -1;
        var t, e = this.frontier[this.depth];
        if (!e.type.isTextblock || !Qt(this.$to, this.$to.depth, e.type, e.match, !1) || this.$to.depth == this.depth && (t = this.findCloseLevel(this.$to)) && t.depth == this.depth) return -1;
        for (var n = this.$to.depth, r = this.$to.after(n); n > 1 && r == this.$to.end(--n);) ++r;
        return r
    }, Wt.prototype.findCloseLevel = function (t) {
        t: for (var e = Math.min(this.depth, t.depth); e >= 0; e--) {
            var n = this.frontier[e],
                r = n.match,
                o = n.type,
                i = e < t.depth && t.end(e + 1) == t.pos + (t.depth - (e + 1)),
                s = Qt(t, e, o, r, i);
            if (s) {
                for (var a = e - 1; a >= 0; a--) {
                    var c = this.frontier[a],
                        l = c.match,
                        p = Qt(t, a, c.type, l, !0);
                    if (!p || p.childCount) continue t
                }
                return {
                    depth: e,
                    fit: s,
                    move: i ? t.doc.resolve(t.after(e + 1)) : t
                }
            }
        }
    }, Wt.prototype.close = function (t) {
        var e = this.findCloseLevel(t);
        if (!e) return null;
        for (; this.depth > e.depth;) this.closeFrontierNode();
        e.fit.childCount && (this.placed = Ht(this.placed, e.depth, e.fit)), t = e.move;
        for (var n = e.depth + 1; n <= t.depth; n++) {
            var r = t.node(n),
                o = r.type.contentMatch.fillBefore(r.content, !0, t.index(n));
            this.openFrontierNode(r.type, r.attrs, o)
        }
        return t
    }, Wt.prototype.openFrontierNode = function (t, e, n) {
        void 0 === e && (e = null);
        var o = this.frontier[this.depth];
        o.match = o.match.matchType(t), this.placed = Ht(this.placed, this.depth, r.from(t.create(e, n))), this.frontier.push({
            type: t,
            match: t.contentMatch
        })
    }, Wt.prototype.closeFrontierNode = function () {
        var t = this.frontier.pop().match.fillBefore(r.empty, !0);
        t.childCount && (this.placed = Ht(this.placed, this.frontier.length, t))
    }, Object.defineProperties(Wt.prototype, Jt);
    var te = Error;
    ((te = function t(e) {
        var n = Error.call(this, e);
        return n.__proto__ = t.prototype, n
    }).prototype = Object.create(Error.prototype)).constructor = te, te.prototype.name = "TransformError";
    var ee = function (t) {
            this.doc = t, this.steps = [], this.docs = [], this.mapping = new xt
        },
        ne = {
            before: {
                configurable: !0
            },
            docChanged: {
                configurable: !0
            }
        };
    ne.before.get = function () {
        return this.docs.length ? this.docs[0] : this.doc
    }, ee.prototype.step = function (t) {
        var e = this.maybeStep(t);
        if (e.failed) throw new te(e.failed);
        return this
    }, ee.prototype.maybeStep = function (t) {
        var e = t.apply(this.doc);
        return e.failed || this.addStep(t, e.doc), e
    }, ne.docChanged.get = function () {
        return this.steps.length > 0
    }, ee.prototype.addStep = function (t, e) {
        this.docs.push(this.doc), this.steps.push(t), this.mapping.appendMap(t.getMap()), this.doc = e
    }, ee.prototype.replace = function (t, e, n) {
        void 0 === e && (e = t), void 0 === n && (n = p.empty);
        var r = Lt(this.doc, t, e, n);
        return r && this.step(r), this
    }, ee.prototype.replaceWith = function (t, e, n) {
        return this.replace(t, e, new p(r.from(n), 0, 0))
    }, ee.prototype.delete = function (t, e) {
        return this.replace(t, e, p.empty)
    }, ee.prototype.insert = function (t, e) {
        return this.replaceWith(t, t, e)
    }, ee.prototype.replaceRange = function (t, e, n) {
        return function (t, e, n, r) {
            if (!r.size) return t.deleteRange(e, n);
            var o = t.doc.resolve(e),
                i = t.doc.resolve(n);
            if (jt(o, i, r)) return t.step(new Tt(e, n, r));
            var s = Zt(o, t.doc.resolve(n));
            0 == s[s.length - 1] && s.pop();
            var a = -(o.depth + 1);
            s.unshift(a);
            for (var c = o.depth, l = o.pos - 1; c > 0; c--, l--) {
                var h = o.node(c).type.spec;
                if (h.defining || h.definingAsContext || h.isolating) break;
                s.indexOf(c) > -1 ? a = c : o.before(c) == l && s.splice(1, 0, -c)
            }
            for (var u = s.indexOf(a), f = [], d = r.openStart, m = r.content, v = 0;; v++) {
                var g = m.firstChild;
                if (f.push(g), v == r.openStart) break;
                m = g.content
            }
            for (var y = d - 1; y >= 0; y--) {
                var w = f[y].type,
                    b = Xt(w);
                if (b && o.node(u).type != w) d = y;
                else if (b || !w.isTextblock) break
            }
            for (var k = r.openStart; k >= 0; k--) {
                var x = (k + d + 1) % (r.openStart + 1),
                    S = f[x];
                if (S)
                    for (var M = 0; M < s.length; M++) {
                        var C = s[(M + u) % s.length],
                            O = !0;
                        C < 0 && (O = !1, C = -C);
                        var N = o.node(C - 1),
                            D = o.index(C - 1);
                        if (N.canReplaceWith(D, D, S.type, S.marks)) return t.replace(o.before(C), O ? i.after(C) : n, new p(Yt(r.content, 0, r.openStart, x), x, r.openEnd))
                    }
            }
            for (var T = t.steps.length, E = s.length - 1; E >= 0 && (t.replace(e, n, r), !(t.steps.length > T)); E--) {
                var A = s[E];
                A < 0 || (e = o.before(A), n = i.after(A))
            }
        }(this, t, e, n), this
    }, ee.prototype.replaceRangeWith = function (t, e, n) {
        return function (t, e, n, o) {
            if (!o.isInline && e == n && t.doc.resolve(e).parent.content.size) {
                var i = $t(t.doc, e, o.type);
                null != i && (e = n = i)
            }
            t.replaceRange(e, n, new p(r.from(o), 0, 0))
        }(this, t, e, n), this
    }, ee.prototype.deleteRange = function (t, e) {
        return function (t, e, n) {
            for (var r = t.doc.resolve(e), o = t.doc.resolve(n), i = Zt(r, o), s = 0; s < i.length; s++) {
                var a = i[s],
                    c = s == i.length - 1;
                if (c && 0 == a || r.node(a).type.contentMatch.validEnd) return t.delete(r.start(a), o.end(a));
                if (a > 0 && (c || r.node(a - 1).canReplace(r.index(a - 1), o.indexAfter(a - 1)))) return t.delete(r.before(a), o.after(a))
            }
            for (var l = 1; l <= r.depth && l <= o.depth; l++)
                if (e - r.start(l) == r.depth - l && n > r.end(l) && o.end(l) - n != o.depth - l) return t.delete(r.before(l), n);
            t.delete(e, n)
        }(this, t, e), this
    }, ee.prototype.lift = function (t, e) {
        return function (t, e, n) {
            for (var o = e.$from, i = e.$to, s = e.depth, a = o.before(s + 1), c = i.after(s + 1), l = a, h = c, u = r.empty, f = 0, d = s, m = !1; d > n; d--) m || o.index(d) > 0 ? (m = !0, u = r.from(o.node(d).copy(u)), f++) : l--;
            for (var v = r.empty, g = 0, y = s, w = !1; y > n; y--) w || i.after(y + 1) < i.end(y) ? (w = !0, v = r.from(i.node(y).copy(v)), g++) : h++;
            t.step(new Et(l, h, a, c, new p(u.append(v), f, g), u.size - f, !0))
        }(this, t, e), this
    }, ee.prototype.join = function (t, e) {
        return void 0 === e && (e = 1),
            function (t, e, n) {
                var r = new Tt(e - n, e + n, p.empty, !0);
                t.step(r)
            }(this, t, e), this
    }, ee.prototype.wrap = function (t, e) {
        return function (t, e, n) {
            for (var o = r.empty, i = n.length - 1; i >= 0; i--) {
                if (o.size) {
                    var s = n[i].type.contentMatch.matchFragment(o);
                    if (!s || !s.validEnd) throw new RangeError("Wrapper type given to Transform.wrap does not form valid content of its parent wrapper")
                }
                o = r.from(n[i].type.create(n[i].attrs, o))
            }
            var a = e.start,
                c = e.end;
            t.step(new Et(a, c, a, c, new p(o, 0, 0), n.length, !0))
        }(this, t, e), this
    }, ee.prototype.setBlockType = function (t, e, n, o) {
        return void 0 === e && (e = t), void 0 === o && (o = null),
            function (t, e, n, o, i) {
                if (!o.isTextblock) throw new RangeError("Type given to setBlockType should be a textblock");
                var s = t.steps.length;
                t.doc.nodesBetween(e, n, (function (e, n) {
                    if (e.isTextblock && !e.hasMarkup(o, i) && function (t, e, n) {
                        var r = t.resolve(e),
                            o = r.index();
                        return r.parent.canReplaceWith(o, o + 1, n)
                    }(t.doc, t.mapping.slice(s).map(n), o)) {
                        t.clearIncompatible(t.mapping.slice(s).map(n, 1), o);
                        var a = t.mapping.slice(s),
                            c = a.map(n, 1),
                            l = a.map(n + e.nodeSize, 1);
                        return t.step(new Et(c, l, c + 1, l - 1, new p(r.from(o.create(i, null, e.marks)), 0, 0), 1, !0)), !1
                    }
                }))
            }(this, t, e, n, o), this
    }, ee.prototype.setNodeMarkup = function (t, e, n, o) {
        return void 0 === n && (n = null), void 0 === o && (o = []),
            function (t, e, n, o, i) {
                var s = t.doc.nodeAt(e);
                if (!s) throw new RangeError("No node at given position");
                n || (n = s.type);
                var a = n.create(o, null, i || s.marks);
                if (s.isLeaf) return t.replaceWith(e, e + s.nodeSize, a);
                if (!n.validContent(s.content)) throw new RangeError("Invalid content for node type " + n.name);
                t.step(new Et(e, e + s.nodeSize, e + 1, e + s.nodeSize - 1, new p(r.from(a), 0, 0), 1, !0))
            }(this, t, e, n, o), this
    }, ee.prototype.split = function (t, e, n) {
        return void 0 === e && (e = 1),
            function (t, e, n, o) {
                void 0 === n && (n = 1);
                for (var i = t.doc.resolve(e), s = r.empty, a = r.empty, c = i.depth, l = i.depth - n, h = n - 1; c > l; c--, h--) {
                    s = r.from(i.node(c).copy(s));
                    var u = o && o[h];
                    a = r.from(u ? u.type.create(u.attrs, a) : i.node(c).copy(a))
                }
                t.step(new Tt(e, e, new p(s.append(a), n, n), !0))
            }(this, t, e, n), this
    }, ee.prototype.addMark = function (t, e, n) {
        return function (t, e, n, r) {
            var o, i, s = [],
                a = [];
            t.doc.nodesBetween(e, n, (function (t, c, l) {
                if (t.isInline) {
                    var p = t.marks;
                    if (!r.isInSet(p) && l.type.allowsMarkType(r.type)) {
                        for (var h = Math.max(c, e), u = Math.min(c + t.nodeSize, n), f = r.addToSet(p), d = 0; d < p.length; d++) p[d].isInSet(f) || (o && o.to == h && o.mark.eq(p[d]) ? o.to = u : s.push(o = new Dt(h, u, p[d])));
                        i && i.to == h ? i.to = u : a.push(i = new Nt(h, u, r))
                    }
                }
            })), s.forEach((function (e) {
                return t.step(e)
            })), a.forEach((function (e) {
                return t.step(e)
            }))
        }(this, t, e, n), this
    }, ee.prototype.removeMark = function (t, e, n) {
        return function (t, e, n, r) {
            var o = [],
                i = 0;
            t.doc.nodesBetween(e, n, (function (t, s) {
                if (t.isInline) {
                    i++;
                    var a = null;
                    if (r instanceof Z)
                        for (var c, l = t.marks; c = r.isInSet(l);)(a || (a = [])).push(c), l = c.removeFromSet(l);
                    else r ? r.isInSet(t.marks) && (a = [r]) : a = t.marks;
                    if (a && a.length)
                        for (var p = Math.min(s + t.nodeSize, n), h = 0; h < a.length; h++) {
                            for (var u = a[h], f = void 0, d = 0; d < o.length; d++) {
                                var m = o[d];
                                m.step == i - 1 && u.eq(o[d].style) && (f = m)
                            }
                            f ? (f.to = p, f.step = i) : o.push({
                                style: u,
                                from: Math.max(s, e),
                                to: p,
                                step: i
                            })
                        }
                }
            })), o.forEach((function (e) {
                return t.step(new Dt(e.from, e.to, e.style))
            }))
        }(this, t, e, n), this
    }, ee.prototype.clearIncompatible = function (t, e, n) {
        return function (t, e, n, o) {
            void 0 === o && (o = n.contentMatch);
            for (var i = t.doc.nodeAt(e), s = [], a = e + 1, c = 0; c < i.childCount; c++) {
                var l = i.child(c),
                    h = a + l.nodeSize,
                    u = o.matchType(l.type);
                if (u) {
                    o = u;
                    for (var f = 0; f < l.marks.length; f++) n.allowsMarkType(l.marks[f].type) || t.step(new Dt(a, h, l.marks[f]))
                } else s.push(new Tt(a, h, p.empty));
                a = h
            }
            if (!o.validEnd) {
                var d = o.fillBefore(r.empty, !0);
                t.replace(a, a, new p(d, 0, 0))
            }
            for (var m = s.length - 1; m >= 0; m--) t.step(s[m])
        }(this, t, e, n), this
    }, Object.defineProperties(ee.prototype, ne);
    var re = Object.freeze({
            __proto__: null,
            AddMarkStep: Nt,
            MapResult: wt,
            Mapping: xt,
            RemoveMarkStep: Dt,
            ReplaceAroundStep: Et,
            ReplaceStep: Tt,
            Step: Mt,
            StepMap: kt,
            StepResult: Ct,
            Transform: ee,
            get TransformError() {
                return te
            },
            canJoin: _t,
            canSplit: Bt,
            dropPoint: qt,
            findWrapping: Rt,
            insertPoint: $t,
            joinPoint: Ft,
            liftTarget: zt,
            replaceStep: Lt
        }),
        oe = Object.create(null),
        ie = function (t, e, n) {
            this.$anchor = t, this.$head = e, this.ranges = n || [new ae(t.min(e), t.max(e))]
        },
        se = {
            anchor: {
                configurable: !0
            },
            head: {
                configurable: !0
            },
            from: {
                configurable: !0
            },
            to: {
                configurable: !0
            },
            $from: {
                configurable: !0
            },
            $to: {
                configurable: !0
            },
            empty: {
                configurable: !0
            }
        };
    se.anchor.get = function () {
        return this.$anchor.pos
    }, se.head.get = function () {
        return this.$head.pos
    }, se.from.get = function () {
        return this.$from.pos
    }, se.to.get = function () {
        return this.$to.pos
    }, se.$from.get = function () {
        return this.ranges[0].$from
    }, se.$to.get = function () {
        return this.ranges[0].$to
    }, se.empty.get = function () {
        for (var t = this.ranges, e = 0; e < t.length; e++)
            if (t[e].$from.pos != t[e].$to.pos) return !1;
        return !0
    }, ie.prototype.content = function () {
        return this.$from.doc.slice(this.from, this.to, !0)
    }, ie.prototype.replace = function (t, e) {
        void 0 === e && (e = p.empty);
        for (var n = e.content.lastChild, r = null, o = 0; o < e.openEnd; o++) r = n, n = n.lastChild;
        for (var i = t.steps.length, s = this.ranges, a = 0; a < s.length; a++) {
            var c = s[a],
                l = c.$from,
                h = c.$to,
                u = t.mapping.slice(i);
            t.replaceRange(u.map(l.pos), u.map(h.pos), a ? p.empty : e), 0 == a && ge(t, i, (n ? n.isInline : r && r.isTextblock) ? -1 : 1)
        }
    }, ie.prototype.replaceWith = function (t, e) {
        for (var n = t.steps.length, r = this.ranges, o = 0; o < r.length; o++) {
            var i = r[o],
                s = i.$from,
                a = i.$to,
                c = t.mapping.slice(n),
                l = c.map(s.pos),
                p = c.map(a.pos);
            o ? t.deleteRange(l, p) : (t.replaceRangeWith(l, p, e), ge(t, n, e.isInline ? -1 : 1))
        }
    }, ie.findFrom = function (t, e, n) {
        void 0 === n && (n = !1);
        var r = t.parent.inlineContent ? new pe(t) : ve(t.node(0), t.parent, t.pos, t.index(), e, n);
        if (r) return r;
        for (var o = t.depth - 1; o >= 0; o--) {
            var i = e < 0 ? ve(t.node(0), t.node(o), t.before(o + 1), t.index(o), e, n) : ve(t.node(0), t.node(o), t.after(o + 1), t.index(o) + 1, e, n);
            if (i) return i
        }
        return null
    }, ie.near = function (t, e) {
        return void 0 === e && (e = 1), this.findFrom(t, e) || this.findFrom(t, -e) || new de(t.node(0))
    }, ie.atStart = function (t) {
        return ve(t, t, 0, 0, 1) || new de(t)
    }, ie.atEnd = function (t) {
        return ve(t, t, t.content.size, t.childCount, -1) || new de(t)
    }, ie.fromJSON = function (t, e) {
        if (!e || !e.type) throw new RangeError("Invalid input for Selection.fromJSON");
        var n = oe[e.type];
        if (!n) throw new RangeError("No selection type " + e.type + " defined");
        return n.fromJSON(t, e)
    }, ie.jsonID = function (t, e) {
        if (t in oe) throw new RangeError("Duplicate use of selection JSON ID " + t);
        return oe[t] = e, e.prototype.jsonID = t, e
    }, ie.prototype.getBookmark = function () {
        return pe.between(this.$anchor, this.$head).getBookmark()
    }, Object.defineProperties(ie.prototype, se), ie.prototype.visible = !0;
    var ae = function (t, e) {
            this.$from = t, this.$to = e
        },
        ce = !1;
    function le(t) {
        ce || t.parent.inlineContent || (ce = !0, console.warn("TextSelection endpoint not pointing into a node with inline content (" + t.parent.type.name + ")"))
    }
    var pe = function (t) {
        function e(e, n) {
            void 0 === n && (n = e), le(e), le(n), t.call(this, e, n)
        }
        t && (e.__proto__ = t), e.prototype = Object.create(t && t.prototype), e.prototype.constructor = e;
        var n = {
            $cursor: {
                configurable: !0
            }
        };
        return n.$cursor.get = function () {
            return this.$anchor.pos == this.$head.pos ? this.$head : null
        }, e.prototype.map = function (n, r) {
            var o = n.resolve(r.map(this.head));
            if (!o.parent.inlineContent) return t.near(o);
            var i = n.resolve(r.map(this.anchor));
            return new e(i.parent.inlineContent ? i : o, o)
        }, e.prototype.replace = function (e, n) {
            if (void 0 === n && (n = p.empty), t.prototype.replace.call(this, e, n), n == p.empty) {
                var r = this.$from.marksAcross(this.$to);
                r && e.ensureMarks(r)
            }
        }, e.prototype.eq = function (t) {
            return t instanceof e && t.anchor == this.anchor && t.head == this.head
        }, e.prototype.getBookmark = function () {
            return new he(this.anchor, this.head)
        }, e.prototype.toJSON = function () {
            return {
                type: "text",
                anchor: this.anchor,
                head: this.head
            }
        }, e.fromJSON = function (t, n) {
            if ("number" != typeof n.anchor || "number" != typeof n.head) throw new RangeError("Invalid input for TextSelection.fromJSON");
            return new e(t.resolve(n.anchor), t.resolve(n.head))
        }, e.create = function (t, e, n) {
            void 0 === n && (n = e);
            var r = t.resolve(e);
            return new this(r, n == e ? r : t.resolve(n))
        }, e.between = function (n, r, o) {
            var i = n.pos - r.pos;
            if (o && !i || (o = i >= 0 ? 1 : -1), !r.parent.inlineContent) {
                var s = t.findFrom(r, o, !0) || t.findFrom(r, -o, !0);
                if (!s) return t.near(r, o);
                r = s.$head
            }
            return n.parent.inlineContent || (0 == i || (n = (t.findFrom(n, -o, !0) || t.findFrom(n, o, !0)).$anchor).pos < r.pos != i < 0) && (n = r), new e(n, r)
        }, Object.defineProperties(e.prototype, n), e
    }(ie);
    ie.jsonID("text", pe);
    var he = function (t, e) {
        this.anchor = t, this.head = e
    };
    he.prototype.map = function (t) {
        return new he(t.map(this.anchor), t.map(this.head))
    }, he.prototype.resolve = function (t) {
        return pe.between(t.resolve(this.anchor), t.resolve(this.head))
    };
    var ue = function (t) {
        function e(e) {
            var n = e.nodeAfter,
                r = e.node(0).resolve(e.pos + n.nodeSize);
            t.call(this, e, r), this.node = n
        }
        return t && (e.__proto__ = t), e.prototype = Object.create(t && t.prototype), e.prototype.constructor = e, e.prototype.map = function (n, r) {
            var o = r.mapResult(this.anchor),
                i = o.deleted,
                s = o.pos,
                a = n.resolve(s);
            return i ? t.near(a) : new e(a)
        }, e.prototype.content = function () {
            return new p(r.from(this.node), 0, 0)
        }, e.prototype.eq = function (t) {
            return t instanceof e && t.anchor == this.anchor
        }, e.prototype.toJSON = function () {
            return {
                type: "node",
                anchor: this.anchor
            }
        }, e.prototype.getBookmark = function () {
            return new fe(this.anchor)
        }, e.fromJSON = function (t, n) {
            if ("number" != typeof n.anchor) throw new RangeError("Invalid input for NodeSelection.fromJSON");
            return new e(t.resolve(n.anchor))
        }, e.create = function (t, n) {
            return new e(t.resolve(n))
        }, e.isSelectable = function (t) {
            return !t.isText && !1 !== t.type.spec.selectable
        }, e
    }(ie);
    ue.prototype.visible = !1, ie.jsonID("node", ue);
    var fe = function (t) {
        this.anchor = t
    };
    fe.prototype.map = function (t) {
        var e = t.mapResult(this.anchor),
            n = e.deleted,
            r = e.pos;
        return n ? new he(r, r) : new fe(r)
    }, fe.prototype.resolve = function (t) {
        var e = t.resolve(this.anchor),
            n = e.nodeAfter;
        return n && ue.isSelectable(n) ? new ue(e) : ie.near(e)
    };
    var de = function (t) {
        function e(e) {
            t.call(this, e.resolve(0), e.resolve(e.content.size))
        }
        return t && (e.__proto__ = t), e.prototype = Object.create(t && t.prototype), e.prototype.constructor = e, e.prototype.replace = function (e, n) {
            if (void 0 === n && (n = p.empty), n == p.empty) {
                e.delete(0, e.doc.content.size);
                var r = t.atStart(e.doc);
                r.eq(e.selection) || e.setSelection(r)
            } else t.prototype.replace.call(this, e, n)
        }, e.prototype.toJSON = function () {
            return {
                type: "all"
            }
        }, e.fromJSON = function (t) {
            return new e(t)
        }, e.prototype.map = function (t) {
            return new e(t)
        }, e.prototype.eq = function (t) {
            return t instanceof e
        }, e.prototype.getBookmark = function () {
            return me
        }, e
    }(ie);
    ie.jsonID("all", de);
    var me = {
        map: function () {
            return this
        },
        resolve: function (t) {
            return new de(t)
        }
    };
    function ve(t, e, n, r, o, i) {
        if (void 0 === i && (i = !1), e.inlineContent) return pe.create(t, n);
        for (var s = r - (o > 0 ? 0 : 1); o > 0 ? s < e.childCount : s >= 0; s += o) {
            var a = e.child(s);
            if (a.isAtom) {
                if (!i && ue.isSelectable(a)) return ue.create(t, n - (o < 0 ? a.nodeSize : 0))
            } else {
                var c = ve(t, a, n + o, o < 0 ? a.childCount : 0, o, i);
                if (c) return c
            }
            n += a.nodeSize * o
        }
        return null
    }
    function ge(t, e, n) {
        var r = t.steps.length - 1;
        if (!(r < e)) {
            var o, i = t.steps[r];
            if (i instanceof Tt || i instanceof Et) t.mapping.maps[r].forEach((function (t, e, n, r) {
                null == o && (o = r)
            })), t.setSelection(ie.near(t.doc.resolve(o), n))
        }
    }
    var ye = function (t) {
        function e(e) {
            t.call(this, e.doc), this.curSelectionFor = 0, this.updated = 0, this.meta = Object.create(null), this.time = Date.now(), this.curSelection = e.selection, this.storedMarks = e.storedMarks
        }
        t && (e.__proto__ = t), e.prototype = Object.create(t && t.prototype), e.prototype.constructor = e;
        var n = {
            selection: {
                configurable: !0
            },
            selectionSet: {
                configurable: !0
            },
            storedMarksSet: {
                configurable: !0
            },
            isGeneric: {
                configurable: !0
            },
            scrolledIntoView: {
                configurable: !0
            }
        };
        return n.selection.get = function () {
            return this.curSelectionFor < this.steps.length && (this.curSelection = this.curSelection.map(this.doc, this.mapping.slice(this.curSelectionFor)), this.curSelectionFor = this.steps.length), this.curSelection
        }, e.prototype.setSelection = function (t) {
            if (t.$from.doc != this.doc) throw new RangeError("Selection passed to setSelection must point at the current document");
            return this.curSelection = t, this.curSelectionFor = this.steps.length, this.updated = -3 & (1 | this.updated), this.storedMarks = null, this
        }, n.selectionSet.get = function () {
            return (1 & this.updated) > 0
        }, e.prototype.setStoredMarks = function (t) {
            return this.storedMarks = t, this.updated |= 2, this
        }, e.prototype.ensureMarks = function (t) {
            return c.sameSet(this.storedMarks || this.selection.$from.marks(), t) || this.setStoredMarks(t), this
        }, e.prototype.addStoredMark = function (t) {
            return this.ensureMarks(t.addToSet(this.storedMarks || this.selection.$head.marks()))
        }, e.prototype.removeStoredMark = function (t) {
            return this.ensureMarks(t.removeFromSet(this.storedMarks || this.selection.$head.marks()))
        }, n.storedMarksSet.get = function () {
            return (2 & this.updated) > 0
        }, e.prototype.addStep = function (e, n) {
            t.prototype.addStep.call(this, e, n), this.updated = -3 & this.updated, this.storedMarks = null
        }, e.prototype.setTime = function (t) {
            return this.time = t, this
        }, e.prototype.replaceSelection = function (t) {
            return this.selection.replace(this, t), this
        }, e.prototype.replaceSelectionWith = function (t, e) {
            void 0 === e && (e = !0);
            var n = this.selection;
            return e && (t = t.mark(this.storedMarks || (n.empty ? n.$from.marks() : n.$from.marksAcross(n.$to) || c.none))), n.replaceWith(this, t), this
        }, e.prototype.deleteSelection = function () {
            return this.selection.replace(this), this
        }, e.prototype.insertText = function (t, e, n) {
            var r = this.doc.type.schema;
            if (null == e) return t ? this.replaceSelectionWith(r.text(t), !0) : this.deleteSelection();
            if (null == n && (n = e), n = null == n ? e : n, !t) return this.deleteRange(e, n);
            var o = this.storedMarks;
            if (!o) {
                var i = this.doc.resolve(e);
                o = n == e ? i.marks() : i.marksAcross(this.doc.resolve(n))
            }
            return this.replaceRangeWith(e, n, r.text(t, o)), this.selection.empty || this.setSelection(ie.near(this.selection.$to)), this
        }, e.prototype.setMeta = function (t, e) {
            return this.meta["string" == typeof t ? t : t.key] = e, this
        }, e.prototype.getMeta = function (t) {
            return this.meta["string" == typeof t ? t : t.key]
        }, n.isGeneric.get = function () {
            for (var t in this.meta) return !1;
            return !0
        }, e.prototype.scrollIntoView = function () {
            return this.updated |= 4, this
        }, n.scrolledIntoView.get = function () {
            return (4 & this.updated) > 0
        }, Object.defineProperties(e.prototype, n), e
    }(ee);
    function we(t, e) {
        return e && t ? t.bind(e) : t
    }
    var be = function (t, e, n) {
            this.name = t, this.init = we(e.init, n), this.apply = we(e.apply, n)
        },
        ke = [new be("doc", {
            init: function (t) {
                return t.doc || t.schema.topNodeType.createAndFill()
            },
            apply: function (t) {
                return t.doc
            }
        }), new be("selection", {
            init: function (t, e) {
                return t.selection || ie.atStart(e.doc)
            },
            apply: function (t) {
                return t.selection
            }
        }), new be("storedMarks", {
            init: function (t) {
                return t.storedMarks || null
            },
            apply: function (t, e, n, r) {
                return r.selection.$cursor ? t.storedMarks : null
            }
        }), new be("scrollToSelection", {
            init: function () {
                return 0
            },
            apply: function (t, e) {
                return t.scrolledIntoView ? e + 1 : e
            }
        })],
        xe = function (t, e) {
            var n = this;
            this.schema = t, this.plugins = [], this.pluginsByKey = Object.create(null), this.fields = ke.slice(), e && e.forEach((function (t) {
                if (n.pluginsByKey[t.key]) throw new RangeError("Adding different instances of a keyed plugin (" + t.key + ")");
                n.plugins.push(t), n.pluginsByKey[t.key] = t, t.spec.state && n.fields.push(new be(t.key, t.spec.state, t))
            }))
        },
        Se = function (t) {
            this.config = t
        },
        Me = {
            schema: {
                configurable: !0
            },
            plugins: {
                configurable: !0
            },
            tr: {
                configurable: !0
            }
        };
    function Ce(t, e, n) {
        for (var r in t) {
            var o = t[r];
            o instanceof Function ? o = o.bind(e) : "handleDOMEvents" == r && (o = Ce(o, e, {})), n[r] = o
        }
        return n
    }
    Me.schema.get = function () {
        return this.config.schema
    }, Me.plugins.get = function () {
        return this.config.plugins
    }, Se.prototype.apply = function (t) {
        return this.applyTransaction(t).state
    }, Se.prototype.filterTransaction = function (t, e) {
        void 0 === e && (e = -1);
        for (var n = 0; n < this.config.plugins.length; n++)
            if (n != e) {
                var r = this.config.plugins[n];
                if (r.spec.filterTransaction && !r.spec.filterTransaction.call(r, t, this)) return !1
            } return !0
    }, Se.prototype.applyTransaction = function (t) {
        if (!this.filterTransaction(t)) return {
            state: this,
            transactions: []
        };
        for (var e = [t], n = this.applyInner(t), r = null;;) {
            for (var o = !1, i = 0; i < this.config.plugins.length; i++) {
                var s = this.config.plugins[i];
                if (s.spec.appendTransaction) {
                    var a = r ? r[i].n : 0,
                        c = r ? r[i].state : this,
                        l = a < e.length && s.spec.appendTransaction.call(s, a ? e.slice(a) : e, c, n);
                    if (l && n.filterTransaction(l, i)) {
                        if (l.setMeta("appendedTransaction", t), !r) {
                            r = [];
                            for (var p = 0; p < this.config.plugins.length; p++) r.push(p < i ? {
                                state: n,
                                n: e.length
                            } : {
                                state: this,
                                n: 0
                            })
                        }
                        e.push(l), n = n.applyInner(l), o = !0
                    }
                    r && (r[i] = {
                        state: n,
                        n: e.length
                    })
                }
            }
            if (!o) return {
                state: n,
                transactions: e
            }
        }
    }, Se.prototype.applyInner = function (t) {
        if (!t.before.eq(this.doc)) throw new RangeError("Applying a mismatched transaction");
        for (var e = new Se(this.config), n = this.config.fields, r = 0; r < n.length; r++) {
            var o = n[r];
            e[o.name] = o.apply(t, this[o.name], this, e)
        }
        return e
    }, Me.tr.get = function () {
        return new ye(this)
    }, Se.create = function (t) {
        for (var e = new xe(t.doc ? t.doc.type.schema : t.schema, t.plugins), n = new Se(e), r = 0; r < e.fields.length; r++) n[e.fields[r].name] = e.fields[r].init(t, n);
        return n
    }, Se.prototype.reconfigure = function (t) {
        for (var e = new xe(this.schema, t.plugins), n = e.fields, r = new Se(e), o = 0; o < n.length; o++) {
            var i = n[o].name;
            r[i] = this.hasOwnProperty(i) ? this[i] : n[o].init(t, r)
        }
        return r
    }, Se.prototype.toJSON = function (t) {
        var e = {
            doc: this.doc.toJSON(),
            selection: this.selection.toJSON()
        };
        if (this.storedMarks && (e.storedMarks = this.storedMarks.map((function (t) {
            return t.toJSON()
        }))), t && "object" == typeof t)
            for (var n in t) {
                if ("doc" == n || "selection" == n) throw new RangeError("The JSON fields `doc` and `selection` are reserved");
                var r = t[n],
                    o = r.spec.state;
                o && o.toJSON && (e[n] = o.toJSON.call(r, this[r.key]))
            }
        return e
    }, Se.fromJSON = function (t, e, n) {
        if (!e) throw new RangeError("Invalid input for EditorState.fromJSON");
        if (!t.schema) throw new RangeError("Required config field 'schema' missing");
        var r = new xe(t.schema, t.plugins),
            o = new Se(r);
        return r.fields.forEach((function (r) {
            if ("doc" == r.name) o.doc = A.fromJSON(t.schema, e.doc);
            else if ("selection" == r.name) o.selection = ie.fromJSON(o.doc, e.selection);
            else if ("storedMarks" == r.name) e.storedMarks && (o.storedMarks = e.storedMarks.map(t.schema.markFromJSON));
            else {
                if (n)
                    for (var i in n) {
                        var s = n[i],
                            a = s.spec.state;
                        if (s.key == r.name && a && a.fromJSON && Object.prototype.hasOwnProperty.call(e, i)) return void(o[r.name] = a.fromJSON.call(s, t, e[i], o))
                    }
                o[r.name] = r.init(t, o)
            }
        })), o
    }, Object.defineProperties(Se.prototype, Me);
    var Oe = function (t) {
        this.spec = t, this.props = {}, t.props && Ce(t.props, this, this.props), this.key = t.key ? t.key.key : De("plugin")
    };
    Oe.prototype.getState = function (t) {
        return t[this.key]
    };
    var Ne = Object.create(null);
    function De(t) {
        return t in Ne ? t + "$" + ++Ne[t] : (Ne[t] = 0, t + "$")
    }
    var Te = function (t) {
        void 0 === t && (t = "key"), this.key = De(t)
    };
    Te.prototype.get = function (t) {
        return t.config.pluginsByKey[this.key]
    }, Te.prototype.getState = function (t) {
        return t[this.key]
    };
    var Ee = Object.freeze({
            __proto__: null,
            AllSelection: de,
            EditorState: Se,
            NodeSelection: ue,
            Plugin: Oe,
            PluginKey: Te,
            Selection: ie,
            SelectionRange: ae,
            TextSelection: pe,
            Transaction: ye
        }),
        Ae = "undefined" != typeof navigator ? navigator : null,
        Ie = "undefined" != typeof document ? document : null,
        ze = Ae && Ae.userAgent || "",
        Re = /Edge\/(\d+)/.exec(ze),
        Pe = /MSIE \d/.exec(ze),
        Be = /Trident\/(?:[7-9]|\d{2,})\..*rv:(\d+)/.exec(ze),
        _e = !!(Pe || Be || Re),
        Ve = Pe ? document.documentMode : Be ? +Be[1] : Re ? +Re[1] : 0,
        Fe = !_e && /gecko\/(\d+)/i.test(ze);
    Fe && (/Firefox\/(\d+)/.exec(ze) || [0, 0])[1];
    var $e = !_e && /Chrome\/(\d+)/.exec(ze),
        qe = !!$e,
        Le = $e ? +$e[1] : 0,
        je = !_e && !!Ae && /Apple Computer/.test(Ae.vendor),
        We = je && (/Mobile\/\w+/.test(ze) || !!Ae && Ae.maxTouchPoints > 2),
        Je = We || !!Ae && /Mac/.test(Ae.platform),
        Ke = /Android \d/.test(ze),
        He = !!Ie && "webkitFontSmoothing" in Ie.documentElement.style,
        Ue = He ? +(/\bAppleWebKit\/(\d+)/.exec(navigator.userAgent) || [0, 0])[1] : 0,
        Ge = function (t) {
            for (var e = 0;; e++)
                if (!(t = t.previousSibling)) return e
        },
        Qe = function (t) {
            var e = t.assignedSlot || t.parentNode;
            return e && 11 == e.nodeType ? e.host : e
        },
        Xe = null,
        Ye = function (t, e, n) {
            var r = Xe || (Xe = document.createRange());
            return r.setEnd(t, null == n ? t.nodeValue.length : n), r.setStart(t, e || 0), r
        },
        Ze = function (t, e, n, r) {
            return n && (en(t, e, n, r, -1) || en(t, e, n, r, 1))
        },
        tn = /^(img|br|input|textarea|hr)$/i;
    function en(t, e, n, r, o) {
        for (;;) {
            if (t == n && e == r) return !0;
            if (e == (o < 0 ? 0 : nn(t))) {
                var i = t.parentNode;
                if (!i || 1 != i.nodeType || rn(t) || tn.test(t.nodeName) || "false" == t.contentEditable) return !1;
                e = Ge(t) + (o < 0 ? 0 : 1), t = i
            } else {
                if (1 != t.nodeType) return !1;
                if ("false" == (t = t.childNodes[e + (o < 0 ? -1 : 0)]).contentEditable) return !1;
                e = o < 0 ? nn(t) : 0
            }
        }
    }
    function nn(t) {
        return 3 == t.nodeType ? t.nodeValue.length : t.childNodes.length
    }
    function rn(t) {
        for (var e, n = t; n && !(e = n.pmViewDesc); n = n.parentNode);
        return e && e.node && e.node.isBlock && (e.dom == t || e.contentDOM == t)
    }
    var on = function (t) {
        var e = t.isCollapsed;
        return e && qe && t.rangeCount && !t.getRangeAt(0).collapsed && (e = !1), e
    };
    function sn(t, e) {
        var n = document.createEvent("Event");
        return n.initEvent("keydown", !0, !0), n.keyCode = t, n.key = n.code = e, n
    }
    function an(t) {
        return {
            left: 0,
            right: t.documentElement.clientWidth,
            top: 0,
            bottom: t.documentElement.clientHeight
        }
    }
    function cn(t, e) {
        return "number" == typeof t ? t : t[e]
    }
    function ln(t) {
        var e = t.getBoundingClientRect(),
            n = e.width / t.offsetWidth || 1,
            r = e.height / t.offsetHeight || 1;
        return {
            left: e.left,
            right: e.left + t.clientWidth * n,
            top: e.top,
            bottom: e.top + t.clientHeight * r
        }
    }
    function pn(t, e, n) {
        for (var r = t.someProp("scrollThreshold") || 0, o = t.someProp("scrollMargin") || 5, i = t.dom.ownerDocument, s = n || t.dom; s; s = Qe(s))
            if (1 == s.nodeType) {
                var a = s,
                    c = a == i.body,
                    l = c ? an(i) : ln(a),
                    p = 0,
                    h = 0;
                if (e.top < l.top + cn(r, "top") ? h = -(l.top - e.top + cn(o, "top")) : e.bottom > l.bottom - cn(r, "bottom") && (h = e.bottom - l.bottom + cn(o, "bottom")), e.left < l.left + cn(r, "left") ? p = -(l.left - e.left + cn(o, "left")) : e.right > l.right - cn(r, "right") && (p = e.right - l.right + cn(o, "right")), p || h)
                    if (c) i.defaultView.scrollBy(p, h);
                    else {
                        var u = a.scrollLeft,
                            f = a.scrollTop;
                        h && (a.scrollTop += h), p && (a.scrollLeft += p);
                        var d = a.scrollLeft - u,
                            m = a.scrollTop - f;
                        e = {
                            left: e.left - d,
                            top: e.top - m,
                            right: e.right - d,
                            bottom: e.bottom - m
                        }
                    } if (c) break
            }
    }
    function hn(t) {
        for (var e = [], n = t.ownerDocument, r = t; r && (e.push({
            dom: r,
            top: r.scrollTop,
            left: r.scrollLeft
        }), t != n); r = Qe(r));
        return e
    }
    function un(t, e) {
        for (var n = 0; n < t.length; n++) {
            var r = t[n],
                o = r.dom,
                i = r.top,
                s = r.left;
            o.scrollTop != i + e && (o.scrollTop = i + e), o.scrollLeft != s && (o.scrollLeft = s)
        }
    }
    var fn = null;
    function dn(t, e) {
        for (var n, r, o = 2e8, i = 0, s = e.top, a = e.top, c = t.firstChild, l = 0; c; c = c.nextSibling, l++) {
            var p = void 0;
            if (1 == c.nodeType) p = c.getClientRects();
            else {
                if (3 != c.nodeType) continue;
                p = Ye(c).getClientRects()
            }
            for (var h = 0; h < p.length; h++) {
                var u = p[h];
                if (u.top <= s && u.bottom >= a) {
                    s = Math.max(u.bottom, s), a = Math.min(u.top, a);
                    var f = u.left > e.left ? u.left - e.left : u.right < e.left ? e.left - u.right : 0;
                    if (f < o) {
                        n = c, o = f, r = f && 3 == n.nodeType ? {
                            left: u.right < e.left ? u.right : u.left,
                            top: e.top
                        } : e, 1 == c.nodeType && f && (i = l + (e.left >= (u.left + u.right) / 2 ? 1 : 0));
                        continue
                    }
                }!n && (e.left >= u.right && e.top >= u.top || e.left >= u.left && e.top >= u.bottom) && (i = l + 1)
            }
        }
        return n && 3 == n.nodeType ? function (t, e) {
            for (var n = t.nodeValue.length, r = document.createRange(), o = 0; o < n; o++) {
                r.setEnd(t, o + 1), r.setStart(t, o);
                var i = yn(r, 1);
                if (i.top != i.bottom && mn(e, i)) return {
                    node: t,
                    offset: o + (e.left >= (i.left + i.right) / 2 ? 1 : 0)
                }
            }
            return {
                node: t,
                offset: 0
            }
        }(n, r) : !n || o && 1 == n.nodeType ? {
            node: t,
            offset: i
        } : dn(n, r)
    }
    function mn(t, e) {
        return t.left >= e.left - 1 && t.left <= e.right + 1 && t.top >= e.top - 1 && t.top <= e.bottom + 1
    }
    function vn(t, e, n) {
        var r = t.childNodes.length;
        if (r && n.top < n.bottom)
            for (var o = Math.max(0, Math.min(r - 1, Math.floor(r * (e.top - n.top) / (n.bottom - n.top)) - 2)), i = o;;) {
                var s = t.childNodes[i];
                if (1 == s.nodeType)
                    for (var a = s.getClientRects(), c = 0; c < a.length; c++) {
                        var l = a[c];
                        if (mn(e, l)) return vn(s, e, l)
                    }
                if ((i = (i + 1) % r) == o) break
            }
        return t
    }
    function gn(t, e) {
        var n, r, o, i = t.dom.ownerDocument,
            s = 0;
        if (i.caretPositionFromPoint) try {
            var a = i.caretPositionFromPoint(e.left, e.top);
            a && (o = (n = a).offsetNode, s = n.offset)
        } catch (t) {}
        if (!o && i.caretRangeFromPoint) {
            var c = i.caretRangeFromPoint(e.left, e.top);
            c && (o = (r = c).startContainer, s = r.startOffset)
        }
        var l, p = (t.root.elementFromPoint ? t.root : i).elementFromPoint(e.left, e.top + 1);
        if (!p || !t.dom.contains(1 != p.nodeType ? p.parentNode : p)) {
            var h = t.dom.getBoundingClientRect();
            if (!mn(e, h)) return null;
            if (!(p = vn(t.dom, e, h))) return null
        }
        if (je)
            for (var u = p; o && u; u = Qe(u)) u.draggable && (o = void 0);
        if (p = function (t, e) {
            var n = t.parentNode;
            return n && /^li$/i.test(n.nodeName) && e.left < t.getBoundingClientRect().left ? n : t
        }(p, e), o) {
            if (Fe && 1 == o.nodeType && (s = Math.min(s, o.childNodes.length)) < o.childNodes.length) {
                var f, d = o.childNodes[s];
                "IMG" == d.nodeName && (f = d.getBoundingClientRect()).right <= e.left && f.bottom > e.top && s++
            }
            o == t.dom && s == o.childNodes.length - 1 && 1 == o.lastChild.nodeType && e.top > o.lastChild.getBoundingClientRect().bottom ? l = t.state.doc.content.size : 0 != s && 1 == o.nodeType && "BR" == o.childNodes[s - 1].nodeName || (l = function (t, e, n, r) {
                for (var o = -1, i = e; i != t.dom;) {
                    var s = t.docView.nearestDesc(i, !0);
                    if (!s) return null;
                    if (s.node.isBlock && s.parent) {
                        var a = s.dom.getBoundingClientRect();
                        if (a.left > r.left || a.top > r.top) o = s.posBefore;
                        else {
                            if (!(a.right < r.left || a.bottom < r.top)) break;
                            o = s.posAfter
                        }
                    }
                    i = s.dom.parentNode
                }
                return o > -1 ? o : t.docView.posFromDOM(e, n, 1)
            }(t, o, s, e))
        }
        null == l && (l = function (t, e, n) {
            var r = dn(e, n),
                o = r.node,
                i = r.offset,
                s = -1;
            if (1 == o.nodeType && !o.firstChild) {
                var a = o.getBoundingClientRect();
                s = a.left != a.right && n.left > (a.left + a.right) / 2 ? 1 : -1
            }
            return t.docView.posFromDOM(o, i, s)
        }(t, p, e));
        var m = t.docView.nearestDesc(p, !0);
        return {
            pos: l,
            inside: m ? m.posAtStart - m.border : -1
        }
    }
    function yn(t, e) {
        var n = t.getClientRects();
        return n.length ? n[e < 0 ? 0 : n.length - 1] : t.getBoundingClientRect()
    }
    var wn = /[\u0590-\u05f4\u0600-\u06ff\u0700-\u08ac]/;
    function bn(t, e, n) {
        var r = t.docView.domFromPos(e, n < 0 ? -1 : 1),
            o = r.node,
            i = r.offset,
            s = He || Fe;
        if (3 == o.nodeType) {
            if (!s || !wn.test(o.nodeValue) && (n < 0 ? i : i != o.nodeValue.length)) {
                var a = i,
                    c = i,
                    l = n < 0 ? 1 : -1;
                return n < 0 && !i ? (c++, l = -1) : n >= 0 && i == o.nodeValue.length ? (a--, l = 1) : n < 0 ? a-- : c++, kn(yn(Ye(o, a, c), l), l < 0)
            }
            var p = yn(Ye(o, i, i), n);
            if (Fe && i && /\s/.test(o.nodeValue[i - 1]) && i < o.nodeValue.length) {
                var h = yn(Ye(o, i - 1, i - 1), -1);
                if (h.top == p.top) {
                    var u = yn(Ye(o, i, i + 1), -1);
                    if (u.top != p.top) return kn(u, u.left < h.left)
                }
            }
            return p
        }
        if (!t.state.doc.resolve(e).parent.inlineContent) {
            if (i && (n < 0 || i == nn(o))) {
                var f = o.childNodes[i - 1];
                if (1 == f.nodeType) return xn(f.getBoundingClientRect(), !1)
            }
            if (i < nn(o)) {
                var d = o.childNodes[i];
                if (1 == d.nodeType) return xn(d.getBoundingClientRect(), !0)
            }
            return xn(o.getBoundingClientRect(), n >= 0)
        }
        if (i && (n < 0 || i == nn(o))) {
            var m = o.childNodes[i - 1],
                v = 3 == m.nodeType ? Ye(m, nn(m) - (s ? 0 : 1)) : 1 != m.nodeType || "BR" == m.nodeName && m.nextSibling ? null : m;
            if (v) return kn(yn(v, 1), !1)
        }
        if (i < nn(o)) {
            for (var g = o.childNodes[i]; g.pmViewDesc && g.pmViewDesc.ignoreForCoords;) g = g.nextSibling;
            var y = g ? 3 == g.nodeType ? Ye(g, 0, s ? 0 : 1) : 1 == g.nodeType ? g : null : null;
            if (y) return kn(yn(y, -1), !0)
        }
        return kn(yn(3 == o.nodeType ? Ye(o) : o, -n), n >= 0)
    }
    function kn(t, e) {
        if (0 == t.width) return t;
        var n = e ? t.left : t.right;
        return {
            top: t.top,
            bottom: t.bottom,
            left: n,
            right: n
        }
    }
    function xn(t, e) {
        if (0 == t.height) return t;
        var n = e ? t.top : t.bottom;
        return {
            top: n,
            bottom: n,
            left: t.left,
            right: t.right
        }
    }
    function Sn(t, e, n) {
        var r = t.state,
            o = t.root.activeElement;
        r != e && t.updateState(e), o != t.dom && t.focus();
        try {
            return n()
        } finally {
            r != e && t.updateState(r), o != t.dom && o && o.focus()
        }
    }
    var Mn = /[\u0590-\u08ac]/;
    var Cn = null,
        On = null,
        Nn = !1;
    function Dn(t, e, n) {
        return Cn == e && On == n ? Nn : (Cn = e, On = n, Nn = "up" == n || "down" == n ? function (t, e, n) {
            var r = e.selection,
                o = "up" == n ? r.$from : r.$to;
            return Sn(t, e, (function () {
                for (var e = t.docView.domFromPos(o.pos, "up" == n ? -1 : 1).node;;) {
                    var r = t.docView.nearestDesc(e, !0);
                    if (!r) break;
                    if (r.node.isBlock) {
                        e = r.dom;
                        break
                    }
                    e = r.dom.parentNode
                }
                for (var i = bn(t, o.pos, 1), s = e.firstChild; s; s = s.nextSibling) {
                    var a = void 0;
                    if (1 == s.nodeType) a = s.getClientRects();
                    else {
                        if (3 != s.nodeType) continue;
                        a = Ye(s, 0, s.nodeValue.length).getClientRects()
                    }
                    for (var c = 0; c < a.length; c++) {
                        var l = a[c];
                        if (l.bottom > l.top + 1 && ("up" == n ? i.top - l.top > 2 * (l.bottom - i.top) : l.bottom - i.bottom > 2 * (i.bottom - l.top))) return !1
                    }
                }
                return !0
            }))
        }(t, e, n) : function (t, e, n) {
            var r = e.selection.$head;
            if (!r.parent.isTextblock) return !1;
            var o = r.parentOffset,
                i = !o,
                s = o == r.parent.content.size,
                a = t.domSelection();
            return Mn.test(r.parent.textContent) && a.modify ? Sn(t, e, (function () {
                var e = a.getRangeAt(0),
                    o = a.focusNode,
                    i = a.focusOffset,
                    s = a.caretBidiLevel;
                a.modify("move", n, "character");
                var c = !(r.depth ? t.docView.domAfterPos(r.before()) : t.dom).contains(1 == a.focusNode.nodeType ? a.focusNode : a.focusNode.parentNode) || o == a.focusNode && i == a.focusOffset;
                return a.removeAllRanges(), a.addRange(e), null != s && (a.caretBidiLevel = s), c
            })) : "left" == n || "backward" == n ? i : s
        }(t, e, n))
    }
    var Tn = function (t, e, n, r) {
            this.parent = t, this.children = e, this.dom = n, this.contentDOM = r, this.dirty = 0, n.pmViewDesc = this
        },
        En = {
            size: {
                configurable: !0
            },
            border: {
                configurable: !0
            },
            posBefore: {
                configurable: !0
            },
            posAtStart: {
                configurable: !0
            },
            posAfter: {
                configurable: !0
            },
            posAtEnd: {
                configurable: !0
            },
            contentLost: {
                configurable: !0
            },
            domAtom: {
                configurable: !0
            },
            ignoreForCoords: {
                configurable: !0
            }
        };
    Tn.prototype.matchesWidget = function (t) {
        return !1
    }, Tn.prototype.matchesMark = function (t) {
        return !1
    }, Tn.prototype.matchesNode = function (t, e, n) {
        return !1
    }, Tn.prototype.matchesHack = function (t) {
        return !1
    }, Tn.prototype.parseRule = function () {
        return null
    }, Tn.prototype.stopEvent = function (t) {
        return !1
    }, En.size.get = function () {
        for (var t = 0, e = 0; e < this.children.length; e++) t += this.children[e].size;
        return t
    }, En.border.get = function () {
        return 0
    }, Tn.prototype.destroy = function () {
        this.parent = void 0, this.dom.pmViewDesc == this && (this.dom.pmViewDesc = void 0);
        for (var t = 0; t < this.children.length; t++) this.children[t].destroy()
    }, Tn.prototype.posBeforeChild = function (t) {
        for (var e = 0, n = this.posAtStart;; e++) {
            var r = this.children[e];
            if (r == t) return n;
            n += r.size
        }
    }, En.posBefore.get = function () {
        return this.parent.posBeforeChild(this)
    }, En.posAtStart.get = function () {
        return this.parent ? this.parent.posBeforeChild(this) + this.border : 0
    }, En.posAfter.get = function () {
        return this.posBefore + this.size
    }, En.posAtEnd.get = function () {
        return this.posAtStart + this.size - 2 * this.border
    }, Tn.prototype.localPosFromDOM = function (t, e, n) {
        if (this.contentDOM && this.contentDOM.contains(1 == t.nodeType ? t : t.parentNode)) {
            if (n < 0) {
                var r, o;
                if (t == this.contentDOM) r = t.childNodes[e - 1];
                else {
                    for (; t.parentNode != this.contentDOM;) t = t.parentNode;
                    r = t.previousSibling
                }
                for (; r && (!(o = r.pmViewDesc) || o.parent != this);) r = r.previousSibling;
                return r ? this.posBeforeChild(o) + o.size : this.posAtStart
            }
            var i, s;
            if (t == this.contentDOM) i = t.childNodes[e];
            else {
                for (; t.parentNode != this.contentDOM;) t = t.parentNode;
                i = t.nextSibling
            }
            for (; i && (!(s = i.pmViewDesc) || s.parent != this);) i = i.nextSibling;
            return i ? this.posBeforeChild(s) : this.posAtEnd
        }
        var a;
        if (t == this.dom && this.contentDOM) a = e > Ge(this.contentDOM);
        else if (this.contentDOM && this.contentDOM != this.dom && this.dom.contains(this.contentDOM)) a = 2 & t.compareDocumentPosition(this.contentDOM);
        else if (this.dom.firstChild) {
            if (0 == e)
                for (var c = t;; c = c.parentNode) {
                    if (c == this.dom) {
                        a = !1;
                        break
                    }
                    if (c.previousSibling) break
                }
            if (null == a && e == t.childNodes.length)
                for (var l = t;; l = l.parentNode) {
                    if (l == this.dom) {
                        a = !0;
                        break
                    }
                    if (l.nextSibling) break
                }
        }
        return (null == a ? n > 0 : a) ? this.posAtEnd : this.posAtStart
    }, Tn.prototype.nearestDesc = function (t, e) {
        void 0 === e && (e = !1);
        for (var n = !0, r = t; r; r = r.parentNode) {
            var o = this.getDesc(r),
                i = void 0;
            if (o && (!e || o.node)) {
                if (!n || !(i = o.nodeDOM) || (1 == i.nodeType ? i.contains(1 == t.nodeType ? t : t.parentNode) : i == t)) return o;
                n = !1
            }
        }
    }, Tn.prototype.getDesc = function (t) {
        for (var e = t.pmViewDesc, n = e; n; n = n.parent)
            if (n == this) return e
    }, Tn.prototype.posFromDOM = function (t, e, n) {
        for (var r = t; r; r = r.parentNode) {
            var o = this.getDesc(r);
            if (o) return o.localPosFromDOM(t, e, n)
        }
        return -1
    }, Tn.prototype.descAt = function (t) {
        for (var e = 0, n = 0; e < this.children.length; e++) {
            var r = this.children[e],
                o = n + r.size;
            if (n == t && o != n) {
                for (; !r.border && r.children.length;) r = r.children[0];
                return r
            }
            if (t < o) return r.descAt(t - n - r.border);
            n = o
        }
    }, Tn.prototype.domFromPos = function (t, e) {
        if (!this.contentDOM) return {
            node: this.dom,
            offset: 0
        };
        for (var n = 0, r = 0, o = 0; n < this.children.length; n++) {
            var i = this.children[n],
                s = o + i.size;
            if (s > t || i instanceof _n) {
                r = t - o;
                break
            }
            o = s
        }
        if (r) return this.children[n].domFromPos(r - this.children[n].border, e);
        for (var a = void 0; n && !(a = this.children[n - 1]).size && a instanceof An && a.side >= 0; n--);
        if (e <= 0) {
            for (var c, l = !0;
                 (c = n ? this.children[n - 1] : null) && c.dom.parentNode != this.contentDOM; n--, l = !1);
            return c && e && l && !c.border && !c.domAtom ? c.domFromPos(c.size, e) : {
                node: this.contentDOM,
                offset: c ? Ge(c.dom) + 1 : 0
            }
        }
        for (var p, h = !0;
             (p = n < this.children.length ? this.children[n] : null) && p.dom.parentNode != this.contentDOM; n++, h = !1);
        return p && h && !p.border && !p.domAtom ? p.domFromPos(0, e) : {
            node: this.contentDOM,
            offset: p ? Ge(p.dom) : this.contentDOM.childNodes.length
        }
    }, Tn.prototype.parseRange = function (t, e, n) {
        if (void 0 === n && (n = 0), 0 == this.children.length) return {
            node: this.contentDOM,
            from: t,
            to: e,
            fromOffset: 0,
            toOffset: this.contentDOM.childNodes.length
        };
        for (var r = -1, o = -1, i = n, s = 0;; s++) {
            var a = this.children[s],
                c = i + a.size;
            if (-1 == r && t <= c) {
                var l = i + a.border;
                if (t >= l && e <= c - a.border && a.node && a.contentDOM && this.contentDOM.contains(a.contentDOM)) return a.parseRange(t, e, l);
                t = i;
                for (var p = s; p > 0; p--) {
                    var h = this.children[p - 1];
                    if (h.size && h.dom.parentNode == this.contentDOM && !h.emptyChildAt(1)) {
                        r = Ge(h.dom) + 1;
                        break
                    }
                    t -= h.size
                } - 1 == r && (r = 0)
            }
            if (r > -1 && (c > e || s == this.children.length - 1)) {
                e = c;
                for (var u = s + 1; u < this.children.length; u++) {
                    var f = this.children[u];
                    if (f.size && f.dom.parentNode == this.contentDOM && !f.emptyChildAt(-1)) {
                        o = Ge(f.dom);
                        break
                    }
                    e += f.size
                } - 1 == o && (o = this.contentDOM.childNodes.length);
                break
            }
            i = c
        }
        return {
            node: this.contentDOM,
            from: t,
            to: e,
            fromOffset: r,
            toOffset: o
        }
    }, Tn.prototype.emptyChildAt = function (t) {
        if (this.border || !this.contentDOM || !this.children.length) return !1;
        var e = this.children[t < 0 ? 0 : this.children.length - 1];
        return 0 == e.size || e.emptyChildAt(t)
    }, Tn.prototype.domAfterPos = function (t) {
        var e = this.domFromPos(t, 0),
            n = e.node,
            r = e.offset;
        if (1 != n.nodeType || r == n.childNodes.length) throw new RangeError("No node after pos " + t);
        return n.childNodes[r]
    }, Tn.prototype.setSelection = function (t, e, n, r) {
        void 0 === r && (r = !1);
        for (var o = Math.min(t, e), i = Math.max(t, e), s = 0, a = 0; s < this.children.length; s++) {
            var c = this.children[s],
                l = a + c.size;
            if (o > a && i < l) return c.setSelection(t - a - c.border, e - a - c.border, n, r);
            a = l
        }
        var p = this.domFromPos(t, t ? -1 : 1),
            h = e == t ? p : this.domFromPos(e, e ? -1 : 1),
            u = n.getSelection(),
            f = !1;
        if ((Fe || je) && t == e) {
            var d = p.node,
                m = p.offset;
            if (3 == d.nodeType) {
                if ((f = !(!m || "\n" != d.nodeValue[m - 1])) && m == d.nodeValue.length)
                    for (var v = d, g = void 0; v; v = v.parentNode) {
                        if (g = v.nextSibling) {
                            "BR" == g.nodeName && (p = h = {
                                node: g.parentNode,
                                offset: Ge(g) + 1
                            });
                            break
                        }
                        var y = v.pmViewDesc;
                        if (y && y.node && y.node.isBlock) break
                    }
            } else {
                var w = d.childNodes[m - 1];
                f = w && ("BR" == w.nodeName || "false" == w.contentEditable)
            }
        }
        if (Fe && u.focusNode && u.focusNode != h.node && 1 == u.focusNode.nodeType) {
            var b = u.focusNode.childNodes[u.focusOffset];
            b && "false" == b.contentEditable && (r = !0)
        }
        if (r || f && je || !Ze(p.node, p.offset, u.anchorNode, u.anchorOffset) || !Ze(h.node, h.offset, u.focusNode, u.focusOffset)) {
            var k = !1;
            if ((u.extend || t == e) && !f) {
                u.collapse(p.node, p.offset);
                try {
                    t != e && u.extend(h.node, h.offset), k = !0
                } catch (t) {
                    if (!(t instanceof DOMException)) throw t
                }
            }
            if (!k) {
                if (t > e) {
                    var x = p;
                    p = h, h = x
                }
                var S = document.createRange();
                S.setEnd(h.node, h.offset), S.setStart(p.node, p.offset), u.removeAllRanges(), u.addRange(S)
            }
        }
    }, Tn.prototype.ignoreMutation = function (t) {
        return !this.contentDOM && "selection" != t.type
    }, En.contentLost.get = function () {
        return this.contentDOM && this.contentDOM != this.dom && !this.dom.contains(this.contentDOM)
    }, Tn.prototype.markDirty = function (t, e) {
        for (var n = 0, r = 0; r < this.children.length; r++) {
            var o = this.children[r],
                i = n + o.size;
            if (n == i ? t <= i && e >= n : t < i && e > n) {
                var s = n + o.border,
                    a = i - o.border;
                if (t >= s && e <= a) return this.dirty = t == n || e == i ? 2 : 1, void(t != s || e != a || !o.contentLost && o.dom.parentNode == this.contentDOM ? o.markDirty(t - s, e - s) : o.dirty = 3);
                o.dirty = o.dom != o.contentDOM || o.dom.parentNode != this.contentDOM || o.children.length ? 3 : 2
            }
            n = i
        }
        this.dirty = 2
    }, Tn.prototype.markParentsDirty = function () {
        for (var t = 1, e = this.parent; e; e = e.parent, t++) {
            var n = 1 == t ? 2 : 1;
            e.dirty < n && (e.dirty = n)
        }
    }, En.domAtom.get = function () {
        return !1
    }, En.ignoreForCoords.get = function () {
        return !1
    }, Object.defineProperties(Tn.prototype, En);
    var An = function (t) {
            function e(e, n, r, o) {
                var i, s = n.type.toDOM;
                if ("function" == typeof s && (s = s(r, (function () {
                    return i ? i.parent ? i.parent.posBeforeChild(i) : void 0 : o
                }))), !n.type.spec.raw) {
                    if (1 != s.nodeType) {
                        var a = document.createElement("span");
                        a.appendChild(s), s = a
                    }
                    s.contentEditable = "false", s.classList.add("ProseMirror-widget")
                }
                t.call(this, e, [], s, null), this.widget = n, this.widget = n, i = this
            }
            t && (e.__proto__ = t), e.prototype = Object.create(t && t.prototype), e.prototype.constructor = e;
            var n = {
                domAtom: {
                    configurable: !0
                },
                side: {
                    configurable: !0
                }
            };
            return e.prototype.matchesWidget = function (t) {
                return 0 == this.dirty && t.type.eq(this.widget.type)
            }, e.prototype.parseRule = function () {
                return {
                    ignore: !0
                }
            }, e.prototype.stopEvent = function (t) {
                var e = this.widget.spec.stopEvent;
                return !!e && e(t)
            }, e.prototype.ignoreMutation = function (t) {
                return "selection" != t.type || this.widget.spec.ignoreSelection
            }, e.prototype.destroy = function () {
                this.widget.type.destroy(this.dom), t.prototype.destroy.call(this)
            }, n.domAtom.get = function () {
                return !0
            }, n.side.get = function () {
                return this.widget.type.side
            }, Object.defineProperties(e.prototype, n), e
        }(Tn),
        In = function (t) {
            function e(e, n, r, o) {
                t.call(this, e, [], n, null), this.textDOM = r, this.text = o
            }
            t && (e.__proto__ = t), e.prototype = Object.create(t && t.prototype), e.prototype.constructor = e;
            var n = {
                size: {
                    configurable: !0
                }
            };
            return n.size.get = function () {
                return this.text.length
            }, e.prototype.localPosFromDOM = function (t, e) {
                return t != this.textDOM ? this.posAtStart + (e ? this.size : 0) : this.posAtStart + e
            }, e.prototype.domFromPos = function (t) {
                return {
                    node: this.textDOM,
                    offset: t
                }
            }, e.prototype.ignoreMutation = function (t) {
                return "characterData" === t.type && t.target.nodeValue == t.oldValue
            }, Object.defineProperties(e.prototype, n), e
        }(Tn),
        zn = function (t) {
            function e(e, n, r, o) {
                t.call(this, e, [], r, o), this.mark = n
            }
            return t && (e.__proto__ = t), e.prototype = Object.create(t && t.prototype), e.prototype.constructor = e, e.create = function (t, n, r, o) {
                var i = o.nodeViews[n.type.name],
                    s = i && i(n, o, r);
                return s && s.dom || (s = ft.renderSpec(document, n.type.spec.toDOM(n, r))), new e(t, n, s.dom, s.contentDOM || s.dom)
            }, e.prototype.parseRule = function () {
                return 3 & this.dirty || this.mark.type.spec.reparseInView ? null : {
                    mark: this.mark.type.name,
                    attrs: this.mark.attrs,
                    contentElement: this.contentDOM || void 0
                }
            }, e.prototype.matchesMark = function (t) {
                return 3 != this.dirty && this.mark.eq(t)
            }, e.prototype.markDirty = function (e, n) {
                if (t.prototype.markDirty.call(this, e, n), 0 != this.dirty) {
                    for (var r = this.parent; !r.node;) r = r.parent;
                    r.dirty < this.dirty && (r.dirty = this.dirty), this.dirty = 0
                }
            }, e.prototype.slice = function (t, n, r) {
                var o = e.create(this.parent, this.mark, !0, r),
                    i = this.children,
                    s = this.size;
                n < s && (i = Qn(i, n, s, r)), t > 0 && (i = Qn(i, 0, t, r));
                for (var a = 0; a < i.length; a++) i[a].parent = o;
                return o.children = i, o
            }, e
        }(Tn),
        Rn = function (t) {
            function e(e, n, r, o, i, s, a, c, l) {
                t.call(this, e, [], i, s), this.node = n, this.outerDeco = r, this.innerDeco = o, this.nodeDOM = a, s && this.updateChildren(c, l)
            }
            t && (e.__proto__ = t), e.prototype = Object.create(t && t.prototype), e.prototype.constructor = e;
            var n = {
                size: {
                    configurable: !0
                },
                border: {
                    configurable: !0
                },
                domAtom: {
                    configurable: !0
                }
            };
            return e.create = function (t, n, r, o, i, s) {
                var a, c, l = i.nodeViews[n.type.name],
                    p = l && l(n, i, (function () {
                        return c ? c.parent ? c.parent.posBeforeChild(c) : void 0 : s
                    }), r, o),
                    h = p && p.dom,
                    u = p && p.contentDOM;
                if (n.isText)
                    if (h) {
                        if (3 != h.nodeType) throw new RangeError("Text must be rendered as a DOM text node")
                    } else h = document.createTextNode(n.text);
                else h || (h = (a = ft.renderSpec(document, n.type.spec.toDOM(n))).dom, u = a.contentDOM);
                u || n.isText || "BR" == h.nodeName || (h.hasAttribute("contenteditable") || (h.contentEditable = "false"), n.type.spec.draggable && (h.draggable = !0));
                var f = h;
                return h = Jn(h, r, n), p ? c = new Vn(t, n, r, o, h, u || null, f, p, i, s + 1) : n.isText ? new Bn(t, n, r, o, h, f, i) : new e(t, n, r, o, h, u || null, f, i, s + 1)
            }, e.prototype.parseRule = function () {
                var t = this;
                if (this.node.type.spec.reparseInView) return null;
                var e = {
                    node: this.node.type.name,
                    attrs: this.node.attrs
                };
                if ("pre" == this.node.type.whitespace && (e.preserveWhitespace = "full"), this.contentDOM)
                    if (this.contentLost) {
                        for (var n = this.children.length - 1; n >= 0; n--) {
                            var o = this.children[n];
                            if (this.dom.contains(o.dom.parentNode)) {
                                e.contentElement = o.dom.parentNode;
                                break
                            }
                        }
                        e.contentElement || (e.getContent = function () {
                            return r.empty
                        })
                    } else e.contentElement = this.contentDOM;
                else e.getContent = function () {
                    return t.node.content
                };
                return e
            }, e.prototype.matchesNode = function (t, e, n) {
                return 0 == this.dirty && t.eq(this.node) && Kn(e, this.outerDeco) && n.eq(this.innerDeco)
            }, n.size.get = function () {
                return this.node.nodeSize
            }, n.border.get = function () {
                return this.node.isLeaf ? 0 : 1
            }, e.prototype.updateChildren = function (t, e) {
                var n = this,
                    r = this.node.inlineContent,
                    o = e,
                    i = t.composing ? this.localCompositionInfo(t, e) : null,
                    s = i && i.pos > -1 ? i : null,
                    a = i && i.pos < 0,
                    l = new Un(this, s && s.node);
                ! function (t, e, n, r) {
                    var o = e.locals(t),
                        i = 0;
                    if (0 == o.length) {
                        for (var s = 0; s < t.childCount; s++) {
                            var a = t.child(s);
                            r(a, o, e.forChild(i, a), s), i += a.nodeSize
                        }
                        return
                    }
                    for (var c = 0, l = [], p = null, h = 0;;) {
                        if (c < o.length && o[c].to == i) {
                            for (var u = o[c++], f = void 0; c < o.length && o[c].to == i;)(f || (f = [u])).push(o[c++]);
                            if (f) {
                                f.sort(Gn);
                                for (var d = 0; d < f.length; d++) n(f[d], h, !!p)
                            } else n(u, h, !!p)
                        }
                        var m = void 0,
                            v = void 0;
                        if (p) v = -1, m = p, p = null;
                        else {
                            if (!(h < t.childCount)) break;
                            v = h, m = t.child(h++)
                        }
                        for (var g = 0; g < l.length; g++) l[g].to <= i && l.splice(g--, 1);
                        for (; c < o.length && o[c].from <= i && o[c].to > i;) l.push(o[c++]);
                        var y = i + m.nodeSize;
                        if (m.isText) {
                            var w = y;
                            c < o.length && o[c].from < w && (w = o[c].from);
                            for (var b = 0; b < l.length; b++) l[b].to < w && (w = l[b].to);
                            w < y && (p = m.cut(w - i), m = m.cut(0, w - i), y = w, v = -1)
                        }
                        r(m, m.isInline && !m.isLeaf ? l.filter((function (t) {
                            return !t.inline
                        })) : l.slice(), e.forChild(i, m), v), i = y
                    }
                }(this.node, this.innerDeco, (function (e, i, s) {
                    e.spec.marks ? l.syncToMarks(e.spec.marks, r, t) : e.type.side >= 0 && !s && l.syncToMarks(i == n.node.childCount ? c.none : n.node.child(i).marks, r, t), l.placeWidget(e, t, o)
                }), (function (e, n, s, c) {
                    var p;
                    l.syncToMarks(e.marks, r, t), l.findNodeMatch(e, n, s, c) || a && t.state.selection.from > o && t.state.selection.to < o + e.nodeSize && (p = l.findIndexWithChild(i.node)) > -1 && l.updateNodeAt(e, n, s, p, t) || l.updateNextNode(e, n, s, t, c) || l.addNode(e, n, s, t, o), o += e.nodeSize
                })), l.syncToMarks([], r, t), this.node.isTextblock && l.addTextblockHacks(), l.destroyRest(), (l.changed || 2 == this.dirty) && (s && this.protectLocalComposition(t, s), Fn(this.contentDOM, this.children, t), We && function (t) {
                    if ("UL" == t.nodeName || "OL" == t.nodeName) {
                        var e = t.style.cssText;
                        t.style.cssText = e + "; list-style: square !important", window.getComputedStyle(t).listStyle, t.style.cssText = e
                    }
                }(this.dom))
            }, e.prototype.localCompositionInfo = function (t, e) {
                var n = t.state.selection,
                    r = n.from,
                    o = n.to;
                if (!(t.state.selection instanceof pe) || r < e || o > e + this.node.content.size) return null;
                var i = t.domSelection(),
                    s = function (t, e) {
                        for (;;) {
                            if (3 == t.nodeType) return t;
                            if (1 == t.nodeType && e > 0) {
                                if (t.childNodes.length > e && 3 == t.childNodes[e].nodeType) return t.childNodes[e];
                                e = nn(t = t.childNodes[e - 1])
                            } else {
                                if (!(1 == t.nodeType && e < t.childNodes.length)) return null;
                                t = t.childNodes[e], e = 0
                            }
                        }
                    }(i.focusNode, i.focusOffset);
                if (!s || !this.dom.contains(s.parentNode)) return null;
                if (this.node.inlineContent) {
                    var a = s.nodeValue,
                        c = function (t, e, n, r) {
                            for (var o = 0, i = 0; o < t.childCount && i <= r;) {
                                var s = t.child(o++),
                                    a = i;
                                if (i += s.nodeSize, s.isText) {
                                    for (var c = s.text; o < t.childCount;) {
                                        var l = t.child(o++);
                                        if (i += l.nodeSize, !l.isText) break;
                                        c += l.text
                                    }
                                    if (i >= n) {
                                        var p = a < r ? c.lastIndexOf(e, r - a - 1) : -1;
                                        if (p >= 0 && p + e.length + a >= n) return a + p;
                                        if (n == r && c.length >= r + e.length - a && c.slice(r - a, r - a + e.length) == e) return r
                                    }
                                }
                            }
                            return -1
                        }(this.node.content, a, r - e, o - e);
                    return c < 0 ? null : {
                        node: s,
                        pos: c,
                        text: a
                    }
                }
                return {
                    node: s,
                    pos: -1,
                    text: ""
                }
            }, e.prototype.protectLocalComposition = function (t, e) {
                var n = e.node,
                    r = e.pos,
                    o = e.text;
                if (!this.getDesc(n)) {
                    for (var i = n; i.parentNode != this.contentDOM; i = i.parentNode) {
                        for (; i.previousSibling;) i.parentNode.removeChild(i.previousSibling);
                        for (; i.nextSibling;) i.parentNode.removeChild(i.nextSibling);
                        i.pmViewDesc && (i.pmViewDesc = void 0)
                    }
                    var s = new In(this, i, n, o);
                    t.input.compositionNodes.push(s), this.children = Qn(this.children, r, r + o.length, t, s)
                }
            }, e.prototype.update = function (t, e, n, r) {
                return !(3 == this.dirty || !t.sameMarkup(this.node)) && (this.updateInner(t, e, n, r), !0)
            }, e.prototype.updateInner = function (t, e, n, r) {
                this.updateOuterDeco(e), this.node = t, this.innerDeco = n, this.contentDOM && this.updateChildren(r, this.posAtStart), this.dirty = 0
            }, e.prototype.updateOuterDeco = function (t) {
                if (!Kn(t, this.outerDeco)) {
                    var e = 1 != this.nodeDOM.nodeType,
                        n = this.dom;
                    this.dom = jn(this.dom, this.nodeDOM, Ln(this.outerDeco, this.node, e), Ln(t, this.node, e)), this.dom != n && (n.pmViewDesc = void 0, this.dom.pmViewDesc = this), this.outerDeco = t
                }
            }, e.prototype.selectNode = function () {
                1 == this.nodeDOM.nodeType && this.nodeDOM.classList.add("ProseMirror-selectednode"), !this.contentDOM && this.node.type.spec.draggable || (this.dom.draggable = !0)
            }, e.prototype.deselectNode = function () {
                1 == this.nodeDOM.nodeType && this.nodeDOM.classList.remove("ProseMirror-selectednode"), !this.contentDOM && this.node.type.spec.draggable || this.dom.removeAttribute("draggable")
            }, n.domAtom.get = function () {
                return this.node.isAtom
            }, Object.defineProperties(e.prototype, n), e
        }(Tn);
    function Pn(t, e, n, r, o) {
        return Jn(r, e, t), new Rn(void 0, t, e, n, r, r, r, o, 0)
    }
    var Bn = function (t) {
            function e(e, n, r, o, i, s, a) {
                t.call(this, e, n, r, o, i, null, s, a, 0)
            }
            t && (e.__proto__ = t), e.prototype = Object.create(t && t.prototype), e.prototype.constructor = e;
            var n = {
                domAtom: {
                    configurable: !0
                }
            };
            return e.prototype.parseRule = function () {
                for (var t = this.nodeDOM.parentNode; t && t != this.dom && !t.pmIsDeco;) t = t.parentNode;
                return {
                    skip: t || !0
                }
            }, e.prototype.update = function (t, e, n, r) {
                return !(3 == this.dirty || 0 != this.dirty && !this.inParent() || !t.sameMarkup(this.node)) && (this.updateOuterDeco(e), 0 == this.dirty && t.text == this.node.text || t.text == this.nodeDOM.nodeValue || (this.nodeDOM.nodeValue = t.text, r.trackWrites == this.nodeDOM && (r.trackWrites = null)), this.node = t, this.dirty = 0, !0)
            }, e.prototype.inParent = function () {
                for (var t = this.parent.contentDOM, e = this.nodeDOM; e; e = e.parentNode)
                    if (e == t) return !0;
                return !1
            }, e.prototype.domFromPos = function (t) {
                return {
                    node: this.nodeDOM,
                    offset: t
                }
            }, e.prototype.localPosFromDOM = function (e, n, r) {
                return e == this.nodeDOM ? this.posAtStart + Math.min(n, this.node.text.length) : t.prototype.localPosFromDOM.call(this, e, n, r)
            }, e.prototype.ignoreMutation = function (t) {
                return "characterData" != t.type && "selection" != t.type
            }, e.prototype.slice = function (t, n, r) {
                var o = this.node.cut(t, n),
                    i = document.createTextNode(o.text);
                return new e(this.parent, o, this.outerDeco, this.innerDeco, i, i, r)
            }, e.prototype.markDirty = function (e, n) {
                t.prototype.markDirty.call(this, e, n), this.dom == this.nodeDOM || 0 != e && n != this.nodeDOM.nodeValue.length || (this.dirty = 3)
            }, n.domAtom.get = function () {
                return !1
            }, Object.defineProperties(e.prototype, n), e
        }(Rn),
        _n = function (t) {
            function e() {
                t.apply(this, arguments)
            }
            t && (e.__proto__ = t), e.prototype = Object.create(t && t.prototype), e.prototype.constructor = e;
            var n = {
                domAtom: {
                    configurable: !0
                },
                ignoreForCoords: {
                    configurable: !0
                }
            };
            return e.prototype.parseRule = function () {
                return {
                    ignore: !0
                }
            }, e.prototype.matchesHack = function (t) {
                return 0 == this.dirty && this.dom.nodeName == t
            }, n.domAtom.get = function () {
                return !0
            }, n.ignoreForCoords.get = function () {
                return "IMG" == this.dom.nodeName
            }, Object.defineProperties(e.prototype, n), e
        }(Tn),
        Vn = function (t) {
            function e(e, n, r, o, i, s, a, c, l, p) {
                t.call(this, e, n, r, o, i, s, a, l, p), this.spec = c
            }
            return t && (e.__proto__ = t), e.prototype = Object.create(t && t.prototype), e.prototype.constructor = e, e.prototype.update = function (e, n, r, o) {
                if (3 == this.dirty) return !1;
                if (this.spec.update) {
                    var i = this.spec.update(e, n, r);
                    return i && this.updateInner(e, n, r, o), i
                }
                return !(!this.contentDOM && !e.isLeaf) && t.prototype.update.call(this, e, n, r, o)
            }, e.prototype.selectNode = function () {
                this.spec.selectNode ? this.spec.selectNode() : t.prototype.selectNode.call(this)
            }, e.prototype.deselectNode = function () {
                this.spec.deselectNode ? this.spec.deselectNode() : t.prototype.deselectNode.call(this)
            }, e.prototype.setSelection = function (e, n, r, o) {
                this.spec.setSelection ? this.spec.setSelection(e, n, r) : t.prototype.setSelection.call(this, e, n, r, o)
            }, e.prototype.destroy = function () {
                this.spec.destroy && this.spec.destroy(), t.prototype.destroy.call(this)
            }, e.prototype.stopEvent = function (t) {
                return !!this.spec.stopEvent && this.spec.stopEvent(t)
            }, e.prototype.ignoreMutation = function (e) {
                return this.spec.ignoreMutation ? this.spec.ignoreMutation(e) : t.prototype.ignoreMutation.call(this, e)
            }, e
        }(Rn);
    function Fn(t, e, n) {
        for (var r = t.firstChild, o = !1, i = 0; i < e.length; i++) {
            var s = e[i],
                a = s.dom;
            if (a.parentNode == t) {
                for (; a != r;) r = Hn(r), o = !0;
                r = r.nextSibling
            } else o = !0, t.insertBefore(a, r);
            if (s instanceof zn) {
                var c = r ? r.previousSibling : t.lastChild;
                Fn(s.contentDOM, s.children, n), r = c ? c.nextSibling : t.firstChild
            }
        }
        for (; r;) r = Hn(r), o = !0;
        o && n.trackWrites == t && (n.trackWrites = null)
    }
    var $n = function (t) {
        t && (this.nodeName = t)
    };
    $n.prototype = Object.create(null);
    var qn = [new $n];
    function Ln(t, e, n) {
        if (0 == t.length) return qn;
        for (var r = n ? qn[0] : new $n, o = [r], i = 0; i < t.length; i++) {
            var s = t[i].type.attrs;
            if (s)
                for (var a in s.nodeName && o.push(r = new $n(s.nodeName)), s) {
                    var c = s[a];
                    null != c && (n && 1 == o.length && o.push(r = new $n(e.isInline ? "span" : "div")), "class" == a ? r.class = (r.class ? r.class + " " : "") + c : "style" == a ? r.style = (r.style ? r.style + ";" : "") + c : "nodeName" != a && (r[a] = c))
                }
        }
        return o
    }
    function jn(t, e, n, r) {
        if (n == qn && r == qn) return e;
        for (var o = e, i = 0; i < r.length; i++) {
            var s = r[i],
                a = n[i];
            if (i) {
                var c = void 0;
                a && a.nodeName == s.nodeName && o != t && (c = o.parentNode) && c.nodeName.toLowerCase() == s.nodeName || ((c = document.createElement(s.nodeName)).pmIsDeco = !0, c.appendChild(o), a = qn[0]), o = c
            }
            Wn(o, a || qn[0], s)
        }
        return o
    }
    function Wn(t, e, n) {
        for (var r in e) "class" == r || "style" == r || "nodeName" == r || r in n || t.removeAttribute(r);
        for (var o in n) "class" != o && "style" != o && "nodeName" != o && n[o] != e[o] && t.setAttribute(o, n[o]);
        if (e.class != n.class) {
            for (var i = e.class ? e.class.split(" ").filter(Boolean) : [], s = n.class ? n.class.split(" ").filter(Boolean) : [], a = 0; a < i.length; a++) - 1 == s.indexOf(i[a]) && t.classList.remove(i[a]);
            for (var c = 0; c < s.length; c++) - 1 == i.indexOf(s[c]) && t.classList.add(s[c]);
            0 == t.classList.length && t.removeAttribute("class")
        }
        if (e.style != n.style) {
            if (e.style)
                for (var l, p = /\s*([\w\-\xa1-\uffff]+)\s*:(?:"(?:\\.|[^"])*"|'(?:\\.|[^'])*'|\(.*?\)|[^;])*/g; l = p.exec(e.style);) t.style.removeProperty(l[1]);
            n.style && (t.style.cssText += n.style)
        }
    }
    function Jn(t, e, n) {
        return jn(t, t, qn, Ln(e, n, 1 != t.nodeType))
    }
    function Kn(t, e) {
        if (t.length != e.length) return !1;
        for (var n = 0; n < t.length; n++)
            if (!t[n].type.eq(e[n].type)) return !1;
        return !0
    }
    function Hn(t) {
        var e = t.nextSibling;
        return t.parentNode.removeChild(t), e
    }
    var Un = function (t, e) {
        this.lock = e, this.index = 0, this.stack = [], this.changed = !1, this.top = t, this.preMatch = function (t, e) {
            var n = e,
                r = n.children.length,
                o = t.childCount,
                i = new Map,
                s = [];
            t: for (; o > 0;) {
                for (var a = void 0;;)
                    if (r) {
                        var c = n.children[r - 1];
                        if (!(c instanceof zn)) {
                            a = c, r--;
                            break
                        }
                        n = c, r = c.children.length
                    } else {
                        if (n == e) break t;
                        r = n.parent.children.indexOf(n), n = n.parent
                    } var l = a.node;
                if (l) {
                    if (l != t.child(o - 1)) break;
                    --o, i.set(a, o), s.push(a)
                }
            }
            return {
                index: o,
                matched: i,
                matches: s.reverse()
            }
        }(t.node.content, t)
    };
    function Gn(t, e) {
        return t.type.side - e.type.side
    }
    function Qn(t, e, n, r, o) {
        for (var i = [], s = 0, a = 0; s < t.length; s++) {
            var c = t[s],
                l = a,
                p = a += c.size;
            l >= n || p <= e ? i.push(c) : (l < e && i.push(c.slice(0, e - l, r)), o && (i.push(o), o = void 0), p > n && i.push(c.slice(n - l, c.size, r)))
        }
        return i
    }
    function Xn(t, e) {
        void 0 === e && (e = null);
        var n = t.domSelection(),
            r = t.state.doc;
        if (!n.focusNode) return null;
        var o = t.docView.nearestDesc(n.focusNode),
            i = o && 0 == o.size,
            s = t.docView.posFromDOM(n.focusNode, n.focusOffset, 1);
        if (s < 0) return null;
        var a, c, l = r.resolve(s);
        if (on(n)) {
            for (a = l; o && !o.node;) o = o.parent;
            var p = o.node;
            if (o && p.isAtom && ue.isSelectable(p) && o.parent && (!p.isInline || ! function (t, e, n) {
                for (var r = 0 == e, o = e == nn(t); r || o;) {
                    if (t == n) return !0;
                    var i = Ge(t);
                    if (!(t = t.parentNode)) return !1;
                    r = r && 0 == i, o = o && i == nn(t)
                }
            }(n.focusNode, n.focusOffset, o.dom))) {
                var h = o.posBefore;
                c = new ue(s == h ? l : r.resolve(h))
            }
        } else {
            var u = t.docView.posFromDOM(n.anchorNode, n.anchorOffset, 1);
            if (u < 0) return null;
            a = r.resolve(u)
        }
        c || (c = sr(t, a, l, "pointer" == e || t.state.selection.head < l.pos && !i ? 1 : -1));
        return c
    }
    function Yn(t) {
        return t.editable ? t.hasFocus() : cr(t) && document.activeElement && document.activeElement.contains(t.dom)
    }
    function Zn(t, e) {
        void 0 === e && (e = !1);
        var n = t.state.selection;
        if (or(t, n), Yn(t)) {
            if (!e && t.input.mouseDown && t.input.mouseDown.allowDefault && qe) {
                var r = t.domSelection(),
                    o = t.domObserver.currentSelection;
                if (r.anchorNode && o.anchorNode && Ze(r.anchorNode, r.anchorOffset, o.anchorNode, o.anchorOffset)) return t.input.mouseDown.delayedSelectionSync = !0, void t.domObserver.setCurSelection()
            }
            if (t.domObserver.disconnectSelection(), t.cursorWrapper) ! function (t) {
                var e = t.domSelection(),
                    n = document.createRange(),
                    r = t.cursorWrapper.dom,
                    o = "IMG" == r.nodeName;
                o ? n.setEnd(r.parentNode, Ge(r) + 1) : n.setEnd(r, 0);
                n.collapse(!1), e.removeAllRanges(), e.addRange(n), !o && !t.state.selection.visible && _e && Ve <= 11 && (r.disabled = !0, r.disabled = !1)
            }(t);
            else {
                var i, s, a = n.anchor,
                    c = n.head;
                !tr || n instanceof pe || (n.$from.parent.inlineContent || (i = er(t, n.from)), n.empty || n.$from.parent.inlineContent || (s = er(t, n.to))), t.docView.setSelection(a, c, t.root, e), tr && (i && rr(i), s && rr(s)), n.visible ? t.dom.classList.remove("ProseMirror-hideselection") : (t.dom.classList.add("ProseMirror-hideselection"), "onselectionchange" in document && function (t) {
                    var e = t.dom.ownerDocument;
                    e.removeEventListener("selectionchange", t.input.hideSelectionGuard);
                    var n = t.domSelection(),
                        r = n.anchorNode,
                        o = n.anchorOffset;
                    e.addEventListener("selectionchange", t.input.hideSelectionGuard = function () {
                        n.anchorNode == r && n.anchorOffset == o || (e.removeEventListener("selectionchange", t.input.hideSelectionGuard), setTimeout((function () {
                            Yn(t) && !t.state.selection.visible || t.dom.classList.remove("ProseMirror-hideselection")
                        }), 20))
                    })
                }(t))
            }
            t.domObserver.setCurSelection(), t.domObserver.connectSelection()
        }
    }
    Un.prototype.destroyBetween = function (t, e) {
        if (t != e) {
            for (var n = t; n < e; n++) this.top.children[n].destroy();
            this.top.children.splice(t, e - t), this.changed = !0
        }
    }, Un.prototype.destroyRest = function () {
        this.destroyBetween(this.index, this.top.children.length)
    }, Un.prototype.syncToMarks = function (t, e, n) {
        for (var r = 0, o = this.stack.length >> 1, i = Math.min(o, t.length); r < i && (r == o - 1 ? this.top : this.stack[r + 1 << 1]).matchesMark(t[r]) && !1 !== t[r].type.spec.spanning;) r++;
        for (; r < o;) this.destroyRest(), this.top.dirty = 0, this.index = this.stack.pop(), this.top = this.stack.pop(), o--;
        for (; o < t.length;) {
            this.stack.push(this.top, this.index + 1);
            for (var s = -1, a = this.index; a < Math.min(this.index + 3, this.top.children.length); a++)
                if (this.top.children[a].matchesMark(t[o])) {
                    s = a;
                    break
                } if (s > -1) s > this.index && (this.changed = !0, this.destroyBetween(this.index, s)), this.top = this.top.children[this.index];
            else {
                var c = zn.create(this.top, t[o], e, n);
                this.top.children.splice(this.index, 0, c), this.top = c, this.changed = !0
            }
            this.index = 0, o++
        }
    }, Un.prototype.findNodeMatch = function (t, e, n, r) {
        var o, i = -1;
        if (r >= this.preMatch.index && (o = this.preMatch.matches[r - this.preMatch.index]).parent == this.top && o.matchesNode(t, e, n)) i = this.top.children.indexOf(o, this.index);
        else
            for (var s = this.index, a = Math.min(this.top.children.length, s + 5); s < a; s++) {
                var c = this.top.children[s];
                if (c.matchesNode(t, e, n) && !this.preMatch.matched.has(c)) {
                    i = s;
                    break
                }
            }
        return !(i < 0) && (this.destroyBetween(this.index, i), this.index++, !0)
    }, Un.prototype.updateNodeAt = function (t, e, n, r, o) {
        var i = this.top.children[r];
        return 3 == i.dirty && i.dom == i.contentDOM && (i.dirty = 2), !!i.update(t, e, n, o) && (this.destroyBetween(this.index, r), this.index = r + 1, !0)
    }, Un.prototype.findIndexWithChild = function (t) {
        for (;;) {
            var e = t.parentNode;
            if (!e) return -1;
            if (e == this.top.contentDOM) {
                var n = t.pmViewDesc;
                if (n)
                    for (var r = this.index; r < this.top.children.length; r++)
                        if (this.top.children[r] == n) return r;
                return -1
            }
            t = e
        }
    }, Un.prototype.updateNextNode = function (t, e, n, r, o) {
        for (var i = this.index; i < this.top.children.length; i++) {
            var s = this.top.children[i];
            if (s instanceof Rn) {
                var a = this.preMatch.matched.get(s);
                if (null != a && a != o) return !1;
                var c = s.dom;
                if (!(this.lock && (c == this.lock || 1 == c.nodeType && c.contains(this.lock.parentNode)) && !(t.isText && s.node && s.node.isText && s.nodeDOM.nodeValue == t.text && 3 != s.dirty && Kn(e, s.outerDeco))) && s.update(t, e, n, r)) return this.destroyBetween(this.index, i), s.dom != c && (this.changed = !0), this.index++, !0;
                break
            }
        }
        return !1
    }, Un.prototype.addNode = function (t, e, n, r, o) {
        this.top.children.splice(this.index++, 0, Rn.create(this.top, t, e, n, r, o)), this.changed = !0
    }, Un.prototype.placeWidget = function (t, e, n) {
        var r = this.index < this.top.children.length ? this.top.children[this.index] : null;
        if (!r || !r.matchesWidget(t) || t != r.widget && r.widget.type.toDOM.parentNode) {
            var o = new An(this.top, t, e, n);
            this.top.children.splice(this.index++, 0, o), this.changed = !0
        } else this.index++
    }, Un.prototype.addTextblockHacks = function () {
        for (var t = this.top.children[this.index - 1], e = this.top; t instanceof zn;) t = (e = t).children[e.children.length - 1];
        t && t instanceof Bn && !/\n$/.test(t.node.text) || ((je || qe) && t && "false" == t.dom.contentEditable && this.addHackNode("IMG", e), this.addHackNode("BR", this.top))
    }, Un.prototype.addHackNode = function (t, e) {
        if (e == this.top && this.index < e.children.length && e.children[this.index].matchesHack(t)) this.index++;
        else {
            var n = document.createElement(t);
            "IMG" == t && (n.className = "ProseMirror-separator", n.alt = ""), "BR" == t && (n.className = "ProseMirror-trailingBreak");
            var r = new _n(this.top, [], n, null);
            e != this.top ? e.children.push(r) : e.children.splice(this.index++, 0, r), this.changed = !0
        }
    };
    var tr = je || qe && Le < 63;
    function er(t, e) {
        var n = t.docView.domFromPos(e, 0),
            r = n.node,
            o = n.offset,
            i = o < r.childNodes.length ? r.childNodes[o] : null,
            s = o ? r.childNodes[o - 1] : null;
        if (je && i && "false" == i.contentEditable) return nr(i);
        if (!(i && "false" != i.contentEditable || s && "false" != s.contentEditable)) {
            if (i) return nr(i);
            if (s) return nr(s)
        }
    }
    function nr(t) {
        return t.contentEditable = "true", je && t.draggable && (t.draggable = !1, t.wasDraggable = !0), t
    }
    function rr(t) {
        t.contentEditable = "false", t.wasDraggable && (t.draggable = !0, t.wasDraggable = null)
    }
    function or(t, e) {
        if (e instanceof ue) {
            var n = t.docView.descAt(e.from);
            n != t.lastSelectedViewDesc && (ir(t), n && n.selectNode(), t.lastSelectedViewDesc = n)
        } else ir(t)
    }
    function ir(t) {
        t.lastSelectedViewDesc && (t.lastSelectedViewDesc.parent && t.lastSelectedViewDesc.deselectNode(), t.lastSelectedViewDesc = void 0)
    }
    function sr(t, e, n, r) {
        return t.someProp("createSelectionBetween", (function (r) {
            return r(t, e, n)
        })) || pe.between(e, n, r)
    }
    function ar(t) {
        return (!t.editable || t.root.activeElement == t.dom) && cr(t)
    }
    function cr(t) {
        var e = t.domSelection();
        if (!e.anchorNode) return !1;
        try {
            return t.dom.contains(3 == e.anchorNode.nodeType ? e.anchorNode.parentNode : e.anchorNode) && (t.editable || t.dom.contains(3 == e.focusNode.nodeType ? e.focusNode.parentNode : e.focusNode))
        } catch (t) {
            return !1
        }
    }
    function lr(t, e) {
        var n = t.selection,
            r = n.$anchor,
            o = n.$head,
            i = e > 0 ? r.max(o) : r.min(o),
            s = i.parent.inlineContent ? i.depth ? t.doc.resolve(e > 0 ? i.after() : i.before()) : null : i;
        return s && ie.findFrom(s, e)
    }
    function pr(t, e) {
        return t.dispatch(t.state.tr.setSelection(e).scrollIntoView()), !0
    }
    function hr(t, e, n) {
        var r = t.state.selection;
        if (!(r instanceof pe)) {
            if (r instanceof ue && r.node.isInline) return pr(t, new pe(e > 0 ? r.$to : r.$from));
            var o = lr(t.state, e);
            return !!o && pr(t, o)
        }
        if (!r.empty || n.indexOf("s") > -1) return !1;
        if (t.endOfTextblock(e > 0 ? "right" : "left")) {
            var i = lr(t.state, e);
            return !!(i && i instanceof ue) && pr(t, i)
        }
        if (!(Je && n.indexOf("m") > -1)) {
            var s, a = r.$head,
                c = a.textOffset ? null : e < 0 ? a.nodeBefore : a.nodeAfter;
            if (!c || c.isText) return !1;
            var l = e < 0 ? a.pos - c.nodeSize : a.pos;
            return !!(c.isAtom || (s = t.docView.descAt(l)) && !s.contentDOM) && (ue.isSelectable(c) ? pr(t, new ue(e < 0 ? t.state.doc.resolve(a.pos - c.nodeSize) : a)) : !!He && pr(t, new pe(t.state.doc.resolve(e < 0 ? l : l + c.nodeSize))))
        }
    }
    function ur(t) {
        return 3 == t.nodeType ? t.nodeValue.length : t.childNodes.length
    }
    function fr(t) {
        var e = t.pmViewDesc;
        return e && 0 == e.size && (t.nextSibling || "BR" != t.nodeName)
    }
    function dr(t) {
        var e = t.domSelection(),
            n = e.focusNode,
            r = e.focusOffset;
        if (n) {
            var o, i, s = !1;
            for (Fe && 1 == n.nodeType && r < ur(n) && fr(n.childNodes[r]) && (s = !0);;)
                if (r > 0) {
                    if (1 != n.nodeType) break;
                    var a = n.childNodes[r - 1];
                    if (fr(a)) o = n, i = --r;
                    else {
                        if (3 != a.nodeType) break;
                        r = (n = a).nodeValue.length
                    }
                } else {
                    if (vr(n)) break;
                    for (var c = n.previousSibling; c && fr(c);) o = n.parentNode, i = Ge(c), c = c.previousSibling;
                    if (c) r = ur(n = c);
                    else {
                        if ((n = n.parentNode) == t.dom) break;
                        r = 0
                    }
                } s ? gr(t, e, n, r) : o && gr(t, e, o, i)
        }
    }
    function mr(t) {
        var e = t.domSelection(),
            n = e.focusNode,
            r = e.focusOffset;
        if (n) {
            for (var o, i, s = ur(n);;)
                if (r < s) {
                    if (1 != n.nodeType) break;
                    if (!fr(n.childNodes[r])) break;
                    o = n, i = ++r
                } else {
                    if (vr(n)) break;
                    for (var a = n.nextSibling; a && fr(a);) o = a.parentNode, i = Ge(a) + 1, a = a.nextSibling;
                    if (a) r = 0, s = ur(n = a);
                    else {
                        if ((n = n.parentNode) == t.dom) break;
                        r = s = 0
                    }
                } o && gr(t, e, o, i)
        }
    }
    function vr(t) {
        var e = t.pmViewDesc;
        return e && e.node && e.node.isBlock
    }
    function gr(t, e, n, r) {
        if (on(e)) {
            var o = document.createRange();
            o.setEnd(n, r), o.setStart(n, r), e.removeAllRanges(), e.addRange(o)
        } else e.extend && e.extend(n, r);
        t.domObserver.setCurSelection();
        var i = t.state;
        setTimeout((function () {
            t.state == i && Zn(t)
        }), 50)
    }
    function yr(t, e, n) {
        var r = t.state.selection;
        if (r instanceof pe && !r.empty || n.indexOf("s") > -1) return !1;
        if (Je && n.indexOf("m") > -1) return !1;
        var o = r.$from,
            i = r.$to;
        if (!o.parent.inlineContent || t.endOfTextblock(e < 0 ? "up" : "down")) {
            var s = lr(t.state, e);
            if (s && s instanceof ue) return pr(t, s)
        }
        if (!o.parent.inlineContent) {
            var a = e < 0 ? o : i,
                c = r instanceof de ? ie.near(a, e) : ie.findFrom(a, e);
            return !!c && pr(t, c)
        }
        return !1
    }
    function wr(t, e) {
        if (!(t.state.selection instanceof pe)) return !0;
        var n = t.state.selection,
            r = n.$head,
            o = n.$anchor,
            i = n.empty;
        if (!r.sameParent(o)) return !0;
        if (!i) return !1;
        if (t.endOfTextblock(e > 0 ? "forward" : "backward")) return !0;
        var s = !r.textOffset && (e < 0 ? r.nodeBefore : r.nodeAfter);
        if (s && !s.isText) {
            var a = t.state.tr;
            return e < 0 ? a.delete(r.pos - s.nodeSize, r.pos) : a.delete(r.pos, r.pos + s.nodeSize), t.dispatch(a), !0
        }
        return !1
    }
    function br(t, e, n) {
        t.domObserver.stop(), e.contentEditable = n, t.domObserver.start()
    }
    function kr(t, e) {
        var n = e.keyCode,
            r = function (t) {
                var e = "";
                return t.ctrlKey && (e += "c"), t.metaKey && (e += "m"), t.altKey && (e += "a"), t.shiftKey && (e += "s"), e
            }(e);
        return 8 == n || Je && 72 == n && "c" == r ? wr(t, -1) || dr(t) : 46 == n || Je && 68 == n && "c" == r ? wr(t, 1) || mr(t) : 13 == n || 27 == n || (37 == n || Je && 66 == n && "c" == r ? hr(t, -1, r) || dr(t) : 39 == n || Je && 70 == n && "c" == r ? hr(t, 1, r) || mr(t) : 38 == n || Je && 80 == n && "c" == r ? yr(t, -1, r) || dr(t) : 40 == n || Je && 78 == n && "c" == r ? function (t) {
            if (!je || t.state.selection.$head.parentOffset > 0) return !1;
            var e = t.domSelection(),
                n = e.focusNode,
                r = e.focusOffset;
            if (n && 1 == n.nodeType && 0 == r && n.firstChild && "false" == n.firstChild.contentEditable) {
                var o = n.firstChild;
                br(t, o, "true"), setTimeout((function () {
                    return br(t, o, "false")
                }), 20)
            }
            return !1
        }(t) || yr(t, 1, r) || mr(t) : r == (Je ? "m" : "c") && (66 == n || 73 == n || 89 == n || 90 == n))
    }
    function xr(t, e) {
        for (var n = [], r = e.content, o = e.openStart, i = e.openEnd; o > 1 && i > 1 && 1 == r.childCount && 1 == r.firstChild.childCount;) {
            o--, i--;
            var s = r.firstChild;
            n.push(s.type.name, s.attrs != s.type.defaultAttrs ? s.attrs : null), r = s.content
        }
        var a = t.someProp("clipboardSerializer") || ft.fromSchema(t.state.schema),
            c = Ir(),
            l = c.createElement("div");
        l.appendChild(a.serializeFragment(r, {
            document: c
        }));
        for (var p, h = l.firstChild, u = 0; h && 1 == h.nodeType && (p = Er[h.nodeName.toLowerCase()]);) {
            for (var f = p.length - 1; f >= 0; f--) {
                for (var d = c.createElement(p[f]); l.firstChild;) d.appendChild(l.firstChild);
                l.appendChild(d), u++
            }
            h = l.firstChild
        }
        return h && 1 == h.nodeType && h.setAttribute("data-pm-slice", o + " " + i + (u ? " -" + u : "") + " " + JSON.stringify(n)), {
            dom: l,
            text: t.someProp("clipboardTextSerializer", (function (t) {
                return t(e)
            })) || e.content.textBetween(0, e.content.size, "\n\n")
        }
    }
    function Sr(t, e, n, o, i) {
        var s, a, c = i.parent.type.spec.code;
        if (!n && !e) return null;
        var l = e && (o || c || !n);
        if (l) {
            if (t.someProp("transformPastedText", (function (t) {
                e = t(e, c || o)
            })), c) return e ? new p(r.from(t.state.schema.text(e.replace(/\r\n?/g, "\n"))), 0, 0) : p.empty;
            var h = t.someProp("clipboardTextParser", (function (t) {
                return t(e, i, o)
            }));
            if (h) a = h;
            else {
                var u = i.marks(),
                    f = t.state.schema,
                    d = ft.fromSchema(f);
                s = document.createElement("div"), e.split(/(?:\r\n?|\n)+/).forEach((function (t) {
                    var e = s.appendChild(document.createElement("p"));
                    t && e.appendChild(d.serializeNode(f.text(t, u)))
                }))
            }
        } else t.someProp("transformPastedHTML", (function (t) {
            n = t(n)
        })), s = function (t) {
            var e = /^(\s*<meta [^>]*>)*/.exec(t);
            e && (t = t.slice(e[0].length));
            var n, r = Ir().createElement("div"),
                o = /<([a-z][^>\s]+)/i.exec(t);
            (n = o && Er[o[1].toLowerCase()]) && (t = n.map((function (t) {
                return "<" + t + ">"
            })).join("") + t + n.map((function (t) {
                return "</" + t + ">"
            })).reverse().join(""));
            if (r.innerHTML = t, n)
                for (var i = 0; i < n.length; i++) r = r.querySelector(n[i]) || r;
            return r
        }(n), He && function (t) {
            for (var e = t.querySelectorAll(qe ? "span:not([class]):not([style])" : "span.Apple-converted-space"), n = 0; n < e.length; n++) {
                var r = e[n];
                1 == r.childNodes.length && " " == r.textContent && r.parentNode && r.parentNode.replaceChild(t.ownerDocument.createTextNode(" "), r)
            }
        }(s);
        var m = s && s.querySelector("[data-pm-slice]"),
            v = m && /^(\d+) (\d+)(?: -(\d+))? (.*)/.exec(m.getAttribute("data-pm-slice") || "");
        if (v && v[3])
            for (var g = +v[3]; g > 0 && s.firstChild; g--) s = s.firstChild;
        if (!a) {
            var y = t.someProp("clipboardParser") || t.someProp("domParser") || nt.fromSchema(t.state.schema);
            a = y.parseSlice(s, {
                preserveWhitespace: !(!l && !v),
                context: i,
                ruleFromNode: function (t) {
                    return "BR" != t.nodeName || t.nextSibling || !t.parentNode || Mr.test(t.parentNode.nodeName) ? null : {
                        ignore: !0
                    }
                }
            })
        }
        if (v) a = function (t, e) {
            if (!t.size) return t;
            var n, o = t.content.firstChild.type.schema;
            try {
                n = JSON.parse(e)
            } catch (e) {
                return t
            }
            for (var i = t.content, s = t.openStart, a = t.openEnd, c = n.length - 2; c >= 0; c -= 2) {
                var l = o.nodes[n[c]];
                if (!l || l.hasRequiredAttrs()) break;
                i = r.from(l.create(n[c + 1], i)), s++, a++
            }
            return new p(i, s, a)
        }(Tr(a, +v[1], +v[2]), v[4]);
        else if (a = p.maxOpen(function (t, e) {
            if (t.childCount < 2) return t;
            for (var n = function (n) {
                var o = e.node(n).contentMatchAt(e.index(n)),
                    i = void 0,
                    s = [];
                if (t.forEach((function (t) {
                    if (s) {
                        var e, n = o.findWrapping(t.type);
                        if (!n) return s = null;
                        if (e = s.length && i.length && Or(n, i, t, s[s.length - 1], 0)) s[s.length - 1] = e;
                        else {
                            s.length && (s[s.length - 1] = Nr(s[s.length - 1], i.length));
                            var r = Cr(t, n);
                            s.push(r), o = o.matchType(r.type), i = n
                        }
                    }
                })), s) return {
                    v: r.from(s)
                }
            }, o = e.depth; o >= 0; o--) {
                var i = n(o);
                if (i) return i.v
            }
            return t
        }(a.content, i), !0), a.openStart || a.openEnd) {
            for (var w = 0, b = 0, k = a.content.firstChild; w < a.openStart && !k.type.spec.isolating; w++, k = k.firstChild);
            for (var x = a.content.lastChild; b < a.openEnd && !x.type.spec.isolating; b++, x = x.lastChild);
            a = Tr(a, w, b)
        }
        return t.someProp("transformPasted", (function (t) {
            a = t(a)
        })), a
    }
    var Mr = /^(a|abbr|acronym|b|cite|code|del|em|i|ins|kbd|label|output|q|ruby|s|samp|span|strong|sub|sup|time|u|tt|var)$/i;
    function Cr(t, e, n) {
        void 0 === n && (n = 0);
        for (var o = e.length - 1; o >= n; o--) t = e[o].create(null, r.from(t));
        return t
    }
    function Or(t, e, n, o, i) {
        if (i < t.length && i < e.length && t[i] == e[i]) {
            var s = Or(t, e, n, o.lastChild, i + 1);
            if (s) return o.copy(o.content.replaceChild(o.childCount - 1, s));
            if (o.contentMatchAt(o.childCount).matchType(i == t.length - 1 ? n.type : t[i + 1])) return o.copy(o.content.append(r.from(Cr(n, t, i + 1))))
        }
    }
    function Nr(t, e) {
        if (0 == e) return t;
        var n = t.content.replaceChild(t.childCount - 1, Nr(t.lastChild, e - 1)),
            o = t.contentMatchAt(t.childCount).fillBefore(r.empty, !0);
        return t.copy(n.append(o))
    }
    function Dr(t, e, n, o, i, s) {
        var a = e < 0 ? t.firstChild : t.lastChild,
            c = a.content;
        return i < o - 1 && (c = Dr(c, e, n, o, i + 1, s)), i >= n && (c = e < 0 ? a.contentMatchAt(0).fillBefore(c, t.childCount > 1 || s <= i).append(c) : c.append(a.contentMatchAt(a.childCount).fillBefore(r.empty, !0))), t.replaceChild(e < 0 ? 0 : t.childCount - 1, a.copy(c))
    }
    function Tr(t, e, n) {
        return e < t.openStart && (t = new p(Dr(t.content, -1, e, t.openStart, 0, t.openEnd), e, t.openEnd)), n < t.openEnd && (t = new p(Dr(t.content, 1, n, t.openEnd, 0, 0), t.openStart, n)), t
    }
    var Er = {
            thead: ["table"],
            tbody: ["table"],
            tfoot: ["table"],
            caption: ["table"],
            colgroup: ["table"],
            col: ["table", "colgroup"],
            tr: ["table", "tbody"],
            td: ["table", "tbody", "tr"],
            th: ["table", "tbody", "tr"]
        },
        Ar = null;
    function Ir() {
        return Ar || (Ar = document.implementation.createHTMLDocument("title"))
    }
    var zr = {},
        Rr = {},
        Pr = function () {
            this.shiftKey = !1, this.mouseDown = null, this.lastKeyCode = null, this.lastKeyCodeTime = 0, this.lastClick = {
                time: 0,
                x: 0,
                y: 0,
                type: ""
            }, this.lastSelectionOrigin = null, this.lastSelectionTime = 0, this.lastIOSEnter = 0, this.lastIOSEnterFallbackTimeout = -1, this.lastAndroidDelete = 0, this.composing = !1, this.composingTimeout = -1, this.compositionNodes = [], this.compositionEndedAt = -2e8, this.domChangeCount = 0, this.eventHandlers = Object.create(null), this.hideSelectionGuard = null
        };
    function Br(t, e) {
        t.input.lastSelectionOrigin = e, t.input.lastSelectionTime = Date.now()
    }
    function _r(t) {
        t.someProp("handleDOMEvents", (function (e) {
            for (var n in e) t.input.eventHandlers[n] || t.dom.addEventListener(n, t.input.eventHandlers[n] = function (e) {
                return Vr(t, e)
            })
        }))
    }
    function Vr(t, e) {
        return t.someProp("handleDOMEvents", (function (n) {
            var r = n[e.type];
            return !!r && (r(t, e) || e.defaultPrevented)
        }))
    }
    function Fr(t) {
        return {
            left: t.clientX,
            top: t.clientY
        }
    }
    function $r(t, e, n, r, o) {
        if (-1 == r) return !1;
        for (var i = t.state.doc.resolve(r), s = function (r) {
            if (t.someProp(e, (function (e) {
                return r > i.depth ? e(t, n, i.nodeAfter, i.before(r), o, !0) : e(t, n, i.node(r), i.before(r), o, !1)
            }))) return {
                v: !0
            }
        }, a = i.depth + 1; a > 0; a--) {
            var c = s(a);
            if (c) return c.v
        }
        return !1
    }
    function qr(t, e, n) {
        t.focused || t.focus();
        var r = t.state.tr.setSelection(e);
        "pointer" == n && r.setMeta("pointer", !0), t.dispatch(r)
    }
    function Lr(t, e, n, r, o) {
        return $r(t, "handleClickOn", e, n, r) || t.someProp("handleClick", (function (n) {
            return n(t, e, r)
        })) || (o ? function (t, e) {
            if (-1 == e) return !1;
            var n, r, o = t.state.selection;
            o instanceof ue && (n = o.node);
            for (var i = t.state.doc.resolve(e), s = i.depth + 1; s > 0; s--) {
                var a = s > i.depth ? i.nodeAfter : i.node(s);
                if (ue.isSelectable(a)) {
                    r = n && o.$from.depth > 0 && s >= o.$from.depth && i.before(o.$from.depth + 1) == o.$from.pos ? i.before(o.$from.depth) : i.before(s);
                    break
                }
            }
            return null != r && (qr(t, ue.create(t.state.doc, r), "pointer"), !0)
        }(t, n) : function (t, e) {
            if (-1 == e) return !1;
            var n = t.state.doc.resolve(e),
                r = n.nodeAfter;
            return !!(r && r.isAtom && ue.isSelectable(r)) && (qr(t, new ue(n), "pointer"), !0)
        }(t, n))
    }
    function jr(t, e, n, r) {
        return $r(t, "handleDoubleClickOn", e, n, r) || t.someProp("handleDoubleClick", (function (n) {
            return n(t, e, r)
        }))
    }
    function Wr(t, e, n, r) {
        return $r(t, "handleTripleClickOn", e, n, r) || t.someProp("handleTripleClick", (function (n) {
            return n(t, e, r)
        })) || function (t, e, n) {
            if (0 != n.button) return !1;
            var r = t.state.doc;
            if (-1 == e) return !!r.inlineContent && (qr(t, pe.create(r, 0, r.content.size), "pointer"), !0);
            for (var o = r.resolve(e), i = o.depth + 1; i > 0; i--) {
                var s = i > o.depth ? o.nodeAfter : o.node(i),
                    a = o.before(i);
                if (s.inlineContent) qr(t, pe.create(r, a + 1, a + 1 + s.content.size), "pointer");
                else {
                    if (!ue.isSelectable(s)) continue;
                    qr(t, ue.create(r, a), "pointer")
                }
                return !0
            }
        }(t, n, r)
    }
    function Jr(t) {
        return Yr(t)
    }
    Rr.keydown = function (t, e) {
        var n = e;
        if (t.input.shiftKey = 16 == n.keyCode || n.shiftKey, !Ur(t, n) && (t.input.lastKeyCode = n.keyCode, t.input.lastKeyCodeTime = Date.now(), !Ke || !qe || 13 != n.keyCode))
            if (229 != n.keyCode && t.domObserver.forceFlush(), !We || 13 != n.keyCode || n.ctrlKey || n.altKey || n.metaKey) t.someProp("handleKeyDown", (function (e) {
                return e(t, n)
            })) || kr(t, n) ? n.preventDefault() : Br(t, "key");
            else {
                var r = Date.now();
                t.input.lastIOSEnter = r, t.input.lastIOSEnterFallbackTimeout = setTimeout((function () {
                    t.input.lastIOSEnter == r && (t.someProp("handleKeyDown", (function (e) {
                        return e(t, sn(13, "Enter"))
                    })), t.input.lastIOSEnter = 0)
                }), 200)
            }
    }, Rr.keyup = function (t, e) {
        16 == e.keyCode && (t.input.shiftKey = !1)
    }, Rr.keypress = function (t, e) {
        var n = e;
        if (!(Ur(t, n) || !n.charCode || n.ctrlKey && !n.altKey || Je && n.metaKey))
            if (t.someProp("handleKeyPress", (function (e) {
                return e(t, n)
            }))) n.preventDefault();
            else {
                var r = t.state.selection;
                if (!(r instanceof pe && r.$from.sameParent(r.$to))) {
                    var o = String.fromCharCode(n.charCode);
                    t.someProp("handleTextInput", (function (e) {
                        return e(t, r.$from.pos, r.$to.pos, o)
                    })) || t.dispatch(t.state.tr.insertText(o).scrollIntoView()), n.preventDefault()
                }
            }
    };
    var Kr = Je ? "metaKey" : "ctrlKey";
    zr.mousedown = function (t, e) {
        var n = e;
        t.input.shiftKey = n.shiftKey;
        var r = Jr(t),
            o = Date.now(),
            i = "singleClick";
        o - t.input.lastClick.time < 500 && function (t, e) {
            var n = e.x - t.clientX,
                r = e.y - t.clientY;
            return n * n + r * r < 100
        }(n, t.input.lastClick) && !n[Kr] && ("singleClick" == t.input.lastClick.type ? i = "doubleClick" : "doubleClick" == t.input.lastClick.type && (i = "tripleClick")), t.input.lastClick = {
            time: o,
            x: n.clientX,
            y: n.clientY,
            type: i
        };
        var s = t.posAtCoords(Fr(n));
        s && ("singleClick" == i ? (t.input.mouseDown && t.input.mouseDown.done(), t.input.mouseDown = new Hr(t, s, n, !!r)) : ("doubleClick" == i ? jr : Wr)(t, s.pos, s.inside, n) ? n.preventDefault() : Br(t, "pointer"))
    };
    var Hr = function (t, e, n, r) {
        var o, i, s = this;
        if (this.view = t, this.pos = e, this.event = n, this.flushed = r, this.delayedSelectionSync = !1, this.mightDrag = null, this.startDoc = t.state.doc, this.selectNode = !!n[Kr], this.allowDefault = n.shiftKey, e.inside > -1) o = t.state.doc.nodeAt(e.inside), i = e.inside;
        else {
            var a = t.state.doc.resolve(e.pos);
            o = a.parent, i = a.depth ? a.before() : 0
        }
        var c = r ? null : n.target,
            l = c ? t.docView.nearestDesc(c, !0) : null;
        this.target = l ? l.dom : null;
        var p = t.state.selection;
        (0 == n.button && o.type.spec.draggable && !1 !== o.type.spec.selectable || p instanceof ue && p.from <= i && p.to > i) && (this.mightDrag = {
            node: o,
            pos: i,
            addAttr: !(!this.target || this.target.draggable),
            setUneditable: !(!this.target || !Fe || this.target.hasAttribute("contentEditable"))
        }), this.target && this.mightDrag && (this.mightDrag.addAttr || this.mightDrag.setUneditable) && (this.view.domObserver.stop(), this.mightDrag.addAttr && (this.target.draggable = !0), this.mightDrag.setUneditable && setTimeout((function () {
            s.view.input.mouseDown == s && s.target.setAttribute("contentEditable", "false")
        }), 20), this.view.domObserver.start()), t.root.addEventListener("mouseup", this.up = this.up.bind(this)), t.root.addEventListener("mousemove", this.move = this.move.bind(this)), Br(t, "pointer")
    };
    function Ur(t, e) {
        return !!t.composing || !!(je && Math.abs(e.timeStamp - t.input.compositionEndedAt) < 500) && (t.input.compositionEndedAt = -2e8, !0)
    }
    Hr.prototype.done = function () {
        var t = this;
        this.view.root.removeEventListener("mouseup", this.up), this.view.root.removeEventListener("mousemove", this.move), this.mightDrag && this.target && (this.view.domObserver.stop(), this.mightDrag.addAttr && this.target.removeAttribute("draggable"), this.mightDrag.setUneditable && this.target.removeAttribute("contentEditable"), this.view.domObserver.start()), this.delayedSelectionSync && setTimeout((function () {
            return Zn(t.view)
        })), this.view.input.mouseDown = null
    }, Hr.prototype.up = function (t) {
        if (this.done(), this.view.dom.contains(t.target)) {
            var e = this.pos;
            this.view.state.doc != this.startDoc && (e = this.view.posAtCoords(Fr(t))), this.allowDefault || !e ? Br(this.view, "pointer") : Lr(this.view, e.pos, e.inside, t, this.selectNode) ? t.preventDefault() : 0 == t.button && (this.flushed || je && this.mightDrag && !this.mightDrag.node.isAtom || qe && !(this.view.state.selection instanceof pe) && Math.min(Math.abs(e.pos - this.view.state.selection.from), Math.abs(e.pos - this.view.state.selection.to)) <= 2) ? (qr(this.view, ie.near(this.view.state.doc.resolve(e.pos)), "pointer"), t.preventDefault()) : Br(this.view, "pointer")
        }
    }, Hr.prototype.move = function (t) {
        !this.allowDefault && (Math.abs(this.event.x - t.clientX) > 4 || Math.abs(this.event.y - t.clientY) > 4) && (this.allowDefault = !0), Br(this.view, "pointer"), 0 == t.buttons && this.done()
    }, zr.touchdown = function (t) {
        Jr(t), Br(t, "pointer")
    }, zr.contextmenu = function (t) {
        return Jr(t)
    };
    var Gr = Ke ? 5e3 : -1;
    function Qr(t, e) {
        clearTimeout(t.input.composingTimeout), e > -1 && (t.input.composingTimeout = setTimeout((function () {
            return Yr(t)
        }), e))
    }
    function Xr(t) {
        var e;
        for (t.composing && (t.input.composing = !1, t.input.compositionEndedAt = ((e = document.createEvent("Event")).initEvent("event", !0, !0), e.timeStamp)); t.input.compositionNodes.length > 0;) t.input.compositionNodes.pop().markParentsDirty()
    }
    function Yr(t, e) {
        if (void 0 === e && (e = !1), !(Ke && t.domObserver.flushingSoon >= 0)) {
            if (t.domObserver.forceFlush(), Xr(t), e || t.docView && t.docView.dirty) {
                var n = Xn(t);
                return n && !n.eq(t.state.selection) ? t.dispatch(t.state.tr.setSelection(n)) : t.updateState(t.state), !0
            }
            return !1
        }
    }
    Rr.compositionstart = Rr.compositionupdate = function (t) {
        if (!t.composing) {
            t.domObserver.flush();
            var e = t.state,
                n = e.selection.$from;
            if (e.selection.empty && (e.storedMarks || !n.textOffset && n.parentOffset && n.nodeBefore.marks.some((function (t) {
                return !1 === t.type.spec.inclusive
            })))) t.markCursor = t.state.storedMarks || n.marks(), Yr(t, !0), t.markCursor = null;
            else if (Yr(t), Fe && e.selection.empty && n.parentOffset && !n.textOffset && n.nodeBefore.marks.length)
                for (var r = t.domSelection(), o = r.focusNode, i = r.focusOffset; o && 1 == o.nodeType && 0 != i;) {
                    var s = i < 0 ? o.lastChild : o.childNodes[i - 1];
                    if (!s) break;
                    if (3 == s.nodeType) {
                        r.collapse(s, s.nodeValue.length);
                        break
                    }
                    o = s, i = -1
                }
            t.input.composing = !0
        }
        Qr(t, Gr)
    }, Rr.compositionend = function (t, e) {
        t.composing && (t.input.composing = !1, t.input.compositionEndedAt = e.timeStamp, Qr(t, 20))
    };
    var Zr = _e && Ve < 15 || We && Ue < 604;
    function to(t, e, n, r) {
        var o = Sr(t, e, n, t.input.shiftKey, t.state.selection.$from);
        if (t.someProp("handlePaste", (function (e) {
            return e(t, r, o || p.empty)
        }))) return !0;
        if (!o) return !1;
        var i = function (t) {
                return 0 == t.openStart && 0 == t.openEnd && 1 == t.content.childCount ? t.content.firstChild : null
            }(o),
            s = i ? t.state.tr.replaceSelectionWith(i, t.input.shiftKey) : t.state.tr.replaceSelection(o);
        return t.dispatch(s.scrollIntoView().setMeta("paste", !0).setMeta("uiEvent", "paste")), !0
    }
    zr.copy = Rr.cut = function (t, e) {
        var n = e,
            r = t.state.selection,
            o = "cut" == n.type;
        if (!r.empty) {
            var i = Zr ? null : n.clipboardData,
                s = xr(t, r.content()),
                a = s.dom,
                c = s.text;
            i ? (n.preventDefault(), i.clearData(), i.setData("text/html", a.innerHTML), i.setData("text/plain", c)) : function (t, e) {
                if (t.dom.parentNode) {
                    var n = t.dom.parentNode.appendChild(document.createElement("div"));
                    n.appendChild(e), n.style.cssText = "position: fixed; left: -10000px; top: 10px";
                    var r = getSelection(),
                        o = document.createRange();
                    o.selectNodeContents(e), t.dom.blur(), r.removeAllRanges(), r.addRange(o), setTimeout((function () {
                        n.parentNode && n.parentNode.removeChild(n), t.focus()
                    }), 50)
                }
            }(t, a), o && t.dispatch(t.state.tr.deleteSelection().scrollIntoView().setMeta("uiEvent", "cut"))
        }
    }, Rr.paste = function (t, e) {
        var n = e;
        if (!t.composing || Ke) {
            var r = Zr ? null : n.clipboardData;
            r && to(t, r.getData("text/plain"), r.getData("text/html"), n) ? n.preventDefault() : function (t, e) {
                if (t.dom.parentNode) {
                    var n = t.input.shiftKey || t.state.selection.$from.parent.type.spec.code,
                        r = t.dom.parentNode.appendChild(document.createElement(n ? "textarea" : "div"));
                    n || (r.contentEditable = "true"), r.style.cssText = "position: fixed; left: -10000px; top: 10px", r.focus(), setTimeout((function () {
                        t.focus(), r.parentNode && r.parentNode.removeChild(r), n ? to(t, r.value, null, e) : to(t, r.textContent, r.innerHTML, e)
                    }), 50)
                }
            }(t, n)
        }
    };
    var eo = function (t, e) {
            this.slice = t, this.move = e
        },
        no = Je ? "altKey" : "ctrlKey";
    for (var ro in zr.dragstart = function (t, e) {
        var n = e,
            r = t.input.mouseDown;
        if (r && r.done(), n.dataTransfer) {
            var o = t.state.selection,
                i = o.empty ? null : t.posAtCoords(Fr(n));
            if (i && i.pos >= o.from && i.pos <= (o instanceof ue ? o.to - 1 : o.to));
            else if (r && r.mightDrag) t.dispatch(t.state.tr.setSelection(ue.create(t.state.doc, r.mightDrag.pos)));
            else if (n.target && 1 == n.target.nodeType) {
                var s = t.docView.nearestDesc(n.target, !0);
                s && s.node.type.spec.draggable && s != t.docView && t.dispatch(t.state.tr.setSelection(ue.create(t.state.doc, s.posBefore)))
            }
            var a = t.state.selection.content(),
                c = xr(t, a),
                l = c.dom,
                p = c.text;
            n.dataTransfer.clearData(), n.dataTransfer.setData(Zr ? "Text" : "text/html", l.innerHTML), n.dataTransfer.effectAllowed = "copyMove", Zr || n.dataTransfer.setData("text/plain", p), t.dragging = new eo(a, !n[no])
        }
    }, zr.dragend = function (t) {
        var e = t.dragging;
        window.setTimeout((function () {
            t.dragging == e && (t.dragging = null)
        }), 50)
    }, Rr.dragover = Rr.dragenter = function (t, e) {
        return e.preventDefault()
    }, Rr.drop = function (t, e) {
        var n = e,
            r = t.dragging;
        if (t.dragging = null, n.dataTransfer) {
            var o = t.posAtCoords(Fr(n));
            if (o) {
                var i = t.state.doc.resolve(o.pos);
                if (i) {
                    var s = r && r.slice;
                    s ? t.someProp("transformPasted", (function (t) {
                        s = t(s)
                    })) : s = Sr(t, n.dataTransfer.getData(Zr ? "Text" : "text/plain"), Zr ? null : n.dataTransfer.getData("text/html"), !1, i);
                    var a = !(!r || n[no]);
                    if (t.someProp("handleDrop", (function (e) {
                        return e(t, n, s || p.empty, a)
                    }))) n.preventDefault();
                    else if (s) {
                        n.preventDefault();
                        var c = s ? qt(t.state.doc, i.pos, s) : i.pos;
                        null == c && (c = i.pos);
                        var l = t.state.tr;
                        a && l.deleteSelection();
                        var h = l.mapping.map(c),
                            u = 0 == s.openStart && 0 == s.openEnd && 1 == s.content.childCount,
                            f = l.doc;
                        if (u ? l.replaceRangeWith(h, h, s.content.firstChild) : l.replaceRange(h, h, s), !l.doc.eq(f)) {
                            var d = l.doc.resolve(h);
                            if (u && ue.isSelectable(s.content.firstChild) && d.nodeAfter && d.nodeAfter.sameMarkup(s.content.firstChild)) l.setSelection(new ue(d));
                            else {
                                var m = l.mapping.map(c);
                                l.mapping.maps[l.mapping.maps.length - 1].forEach((function (t, e, n, r) {
                                    return m = r
                                })), l.setSelection(sr(t, d, l.doc.resolve(m)))
                            }
                            t.focus(), t.dispatch(l.setMeta("uiEvent", "drop"))
                        }
                    }
                }
            }
        }
    }, zr.focus = function (t) {
        t.focused || (t.domObserver.stop(), t.dom.classList.add("ProseMirror-focused"), t.domObserver.start(), t.focused = !0, setTimeout((function () {
            t.docView && t.hasFocus() && !t.domObserver.currentSelection.eq(t.domSelection()) && Zn(t)
        }), 20))
    }, zr.blur = function (t, e) {
        var n = e;
        t.focused && (t.domObserver.stop(), t.dom.classList.remove("ProseMirror-focused"), t.domObserver.start(), n.relatedTarget && t.dom.contains(n.relatedTarget) && t.domObserver.currentSelection.clear(), t.focused = !1)
    }, zr.beforeinput = function (t, e) {
        if (qe && Ke && "deleteContentBackward" == e.inputType) {
            t.domObserver.flushSoon();
            var n = t.input.domChangeCount;
            setTimeout((function () {
                if (t.input.domChangeCount == n && (t.dom.blur(), t.focus(), !t.someProp("handleKeyDown", (function (e) {
                    return e(t, sn(8, "Backspace"))
                })))) {
                    var e = t.state.selection.$cursor;
                    e && e.pos > 0 && t.dispatch(t.state.tr.delete(e.pos - 1, e.pos).scrollIntoView())
                }
            }), 50)
        }
    }, Rr) zr[ro] = Rr[ro];
    function oo(t, e) {
        if (t == e) return !0;
        for (var n in t)
            if (t[n] !== e[n]) return !1;
        for (var r in e)
            if (!(r in t)) return !1;
        return !0
    }
    var io = function (t, e) {
        this.toDOM = t, this.spec = e || ho, this.side = this.spec.side || 0
    };
    io.prototype.map = function (t, e, n, r) {
        var o = t.mapResult(e.from + r, this.side < 0 ? -1 : 1),
            i = o.pos;
        return o.deleted ? null : new co(i - n, i - n, this)
    }, io.prototype.valid = function () {
        return !0
    }, io.prototype.eq = function (t) {
        return this == t || t instanceof io && (this.spec.key && this.spec.key == t.spec.key || this.toDOM == t.toDOM && oo(this.spec, t.spec))
    }, io.prototype.destroy = function (t) {
        this.spec.destroy && this.spec.destroy(t)
    };
    var so = function (t, e) {
        this.attrs = t, this.spec = e || ho
    };
    so.prototype.map = function (t, e, n, r) {
        var o = t.map(e.from + r, this.spec.inclusiveStart ? -1 : 1) - n,
            i = t.map(e.to + r, this.spec.inclusiveEnd ? 1 : -1) - n;
        return o >= i ? null : new co(o, i, this)
    }, so.prototype.valid = function (t, e) {
        return e.from < e.to
    }, so.prototype.eq = function (t) {
        return this == t || t instanceof so && oo(this.attrs, t.attrs) && oo(this.spec, t.spec)
    }, so.is = function (t) {
        return t.type instanceof so
    }, so.prototype.destroy = function () {};
    var ao = function (t, e) {
        this.attrs = t, this.spec = e || ho
    };
    ao.prototype.map = function (t, e, n, r) {
        var o = t.mapResult(e.from + r, 1);
        if (o.deleted) return null;
        var i = t.mapResult(e.to + r, -1);
        return i.deleted || i.pos <= o.pos ? null : new co(o.pos - n, i.pos - n, this)
    }, ao.prototype.valid = function (t, e) {
        var n, r = t.content.findIndex(e.from),
            o = r.index,
            i = r.offset;
        return i == e.from && !(n = t.child(o)).isText && i + n.nodeSize == e.to
    }, ao.prototype.eq = function (t) {
        return this == t || t instanceof ao && oo(this.attrs, t.attrs) && oo(this.spec, t.spec)
    }, ao.prototype.destroy = function () {};
    var co = function (t, e, n) {
            this.from = t, this.to = e, this.type = n
        },
        lo = {
            spec: {
                configurable: !0
            },
            inline: {
                configurable: !0
            }
        };
    co.prototype.copy = function (t, e) {
        return new co(t, e, this.type)
    }, co.prototype.eq = function (t, e) {
        return void 0 === e && (e = 0), this.type.eq(t.type) && this.from + e == t.from && this.to + e == t.to
    }, co.prototype.map = function (t, e, n) {
        return this.type.map(t, this, e, n)
    }, co.widget = function (t, e, n) {
        return new co(t, t, new io(e, n))
    }, co.inline = function (t, e, n, r) {
        return new co(t, e, new so(n, r))
    }, co.node = function (t, e, n, r) {
        return new co(t, e, new ao(n, r))
    }, lo.spec.get = function () {
        return this.type.spec
    }, lo.inline.get = function () {
        return this.type instanceof so
    }, Object.defineProperties(co.prototype, lo);
    var po = [],
        ho = {},
        uo = function (t, e) {
            this.local = t.length ? t : po, this.children = e.length ? e : po
        };
    uo.create = function (t, e) {
        return e.length ? wo(e, t, 0, ho) : fo
    }, uo.prototype.find = function (t, e, n) {
        var r = [];
        return this.findInner(null == t ? 0 : t, null == e ? 1e9 : e, r, 0, n), r
    }, uo.prototype.findInner = function (t, e, n, r, o) {
        for (var i = 0; i < this.local.length; i++) {
            var s = this.local[i];
            s.from <= e && s.to >= t && (!o || o(s.spec)) && n.push(s.copy(s.from + r, s.to + r))
        }
        for (var a = 0; a < this.children.length; a += 3)
            if (this.children[a] < e && this.children[a + 1] > t) {
                var c = this.children[a] + 1;
                this.children[a + 2].findInner(t - c, e - c, n, r + c, o)
            }
    }, uo.prototype.map = function (t, e, n) {
        return this == fo || 0 == t.maps.length ? this : this.mapInner(t, e, 0, 0, n || ho)
    }, uo.prototype.mapInner = function (t, e, n, r, o) {
        for (var i, s = 0; s < this.local.length; s++) {
            var a = this.local[s].map(t, n, r);
            a && a.type.valid(e, a) ? (i || (i = [])).push(a) : o.onRemove && o.onRemove(this.local[s].spec)
        }
        return this.children.length ? function (t, e, n, r, o, i, s) {
            for (var a = t.slice(), c = function (t, e, n, r) {
                for (var s = 0; s < a.length; s += 3) {
                    var c = a[s + 1],
                        l = void 0;
                    if (!(c < 0 || t > c + i)) {
                        var p = a[s] + i;
                        e >= p ? a[s + 1] = t <= p ? -2 : -1 : n >= o && (l = r - n - (e - t)) && (a[s] += l, a[s + 1] += l)
                    }
                }
            }, l = 0; l < n.maps.length; l++) n.maps[l].forEach(c);
            for (var p = !1, h = 0; h < a.length; h += 3)
                if (a[h + 1] < 0) {
                    if (-2 == a[h + 1]) {
                        p = !0, a[h + 1] = -1;
                        continue
                    }
                    var u = n.map(t[h] + i),
                        f = u - o;
                    if (f < 0 || f >= r.content.size) {
                        p = !0;
                        continue
                    }
                    var d = n.map(t[h + 1] + i, -1) - o,
                        m = r.content.findIndex(f),
                        v = m.index,
                        g = m.offset,
                        y = r.maybeChild(v);
                    if (y && g == f && g + y.nodeSize == d) {
                        var w = a[h + 2].mapInner(n, y, u + 1, t[h] + i + 1, s);
                        w != fo ? (a[h] = f, a[h + 1] = d, a[h + 2] = w) : (a[h + 1] = -2, p = !0)
                    } else p = !0
                } if (p) {
                var b = function (t, e, n, r, o, i, s) {
                        function a(t, e) {
                            for (var i = 0; i < t.local.length; i++) {
                                var c = t.local[i].map(r, o, e);
                                c ? n.push(c) : s.onRemove && s.onRemove(t.local[i].spec)
                            }
                            for (var l = 0; l < t.children.length; l += 3) a(t.children[l + 2], t.children[l] + e + 1)
                        }
                        for (var c = 0; c < t.length; c += 3) - 1 == t[c + 1] && a(t[c + 2], e[c] + i + 1);
                        return n
                    }(a, t, e, n, o, i, s),
                    k = wo(b, r, 0, s);
                e = k.local;
                for (var x = 0; x < a.length; x += 3) a[x + 1] < 0 && (a.splice(x, 3), x -= 3);
                for (var S = 0, M = 0; S < k.children.length; S += 3) {
                    for (var C = k.children[S]; M < a.length && a[M] < C;) M += 3;
                    a.splice(M, 0, k.children[S], k.children[S + 1], k.children[S + 2])
                }
            }
            return new uo(e.sort(bo), a)
        }(this.children, i || [], t, e, n, r, o) : i ? new uo(i.sort(bo), po) : fo
    }, uo.prototype.add = function (t, e) {
        return e.length ? this == fo ? uo.create(t, e) : this.addInner(t, e, 0) : this
    }, uo.prototype.addInner = function (t, e, n) {
        var r, o = this,
            i = 0;
        t.forEach((function (t, s) {
            var a, c = s + n;
            if (a = go(e, t, c)) {
                for (r || (r = o.children.slice()); i < r.length && r[i] < s;) i += 3;
                r[i] == s ? r[i + 2] = r[i + 2].addInner(t, a, c + 1) : r.splice(i, 0, s, s + t.nodeSize, wo(a, t, c + 1, ho)), i += 3
            }
        }));
        for (var s = vo(i ? yo(e) : e, -n), a = 0; a < s.length; a++) s[a].type.valid(t, s[a]) || s.splice(a--, 1);
        return new uo(s.length ? this.local.concat(s).sort(bo) : this.local, r || this.children)
    }, uo.prototype.remove = function (t) {
        return 0 == t.length || this == fo ? this : this.removeInner(t, 0)
    }, uo.prototype.removeInner = function (t, e) {
        for (var n = this.children, r = this.local, o = 0; o < n.length; o += 3) {
            for (var i = void 0, s = n[o] + e, a = n[o + 1] + e, c = 0, l = void 0; c < t.length; c++)(l = t[c]) && l.from > s && l.to < a && (t[c] = null, (i || (i = [])).push(l));
            if (i) {
                n == this.children && (n = this.children.slice());
                var p = n[o + 2].removeInner(i, s + 1);
                p != fo ? n[o + 2] = p : (n.splice(o, 3), o -= 3)
            }
        }
        if (r.length)
            for (var h = 0, u = void 0; h < t.length; h++)
                if (u = t[h])
                    for (var f = 0; f < r.length; f++) r[f].eq(u, e) && (r == this.local && (r = this.local.slice()), r.splice(f--, 1));
        return n == this.children && r == this.local ? this : r.length || n.length ? new uo(r, n) : fo
    }, uo.prototype.forChild = function (t, e) {
        if (this == fo) return this;
        if (e.isLeaf) return uo.empty;
        for (var n, r, o = 0; o < this.children.length; o += 3)
            if (this.children[o] >= t) {
                this.children[o] == t && (n = this.children[o + 2]);
                break
            } for (var i = t + 1, s = i + e.content.size, a = 0; a < this.local.length; a++) {
            var c = this.local[a];
            if (c.from < s && c.to > i && c.type instanceof so) {
                var l = Math.max(i, c.from) - i,
                    p = Math.min(s, c.to) - i;
                l < p && (r || (r = [])).push(c.copy(l, p))
            }
        }
        if (r) {
            var h = new uo(r.sort(bo), po);
            return n ? new mo([h, n]) : h
        }
        return n || fo
    }, uo.prototype.eq = function (t) {
        if (this == t) return !0;
        if (!(t instanceof uo) || this.local.length != t.local.length || this.children.length != t.children.length) return !1;
        for (var e = 0; e < this.local.length; e++)
            if (!this.local[e].eq(t.local[e])) return !1;
        for (var n = 0; n < this.children.length; n += 3)
            if (this.children[n] != t.children[n] || this.children[n + 1] != t.children[n + 1] || !this.children[n + 2].eq(t.children[n + 2])) return !1;
        return !0
    }, uo.prototype.locals = function (t) {
        return ko(this.localsInner(t))
    }, uo.prototype.localsInner = function (t) {
        if (this == fo) return po;
        if (t.inlineContent || !this.local.some(so.is)) return this.local;
        for (var e = [], n = 0; n < this.local.length; n++) this.local[n].type instanceof so || e.push(this.local[n]);
        return e
    }, uo.empty = new uo([], []), uo.removeOverlap = ko;
    var fo = uo.empty,
        mo = function (t) {
            this.members = t
        };
    function vo(t, e) {
        if (!e || !t.length) return t;
        for (var n = [], r = 0; r < t.length; r++) {
            var o = t[r];
            n.push(new co(o.from + e, o.to + e, o.type))
        }
        return n
    }
    function go(t, e, n) {
        if (e.isLeaf) return null;
        for (var r = n + e.nodeSize, o = null, i = 0, s = void 0; i < t.length; i++)(s = t[i]) && s.from > n && s.to < r && ((o || (o = [])).push(s), t[i] = null);
        return o
    }
    function yo(t) {
        for (var e = [], n = 0; n < t.length; n++) null != t[n] && e.push(t[n]);
        return e
    }
    function wo(t, e, n, r) {
        var o = [],
            i = !1;
        e.forEach((function (e, s) {
            var a = go(t, e, s + n);
            if (a) {
                i = !0;
                var c = wo(a, e, n + s + 1, r);
                c != fo && o.push(s, s + e.nodeSize, c)
            }
        }));
        for (var s = vo(i ? yo(t) : t, -n).sort(bo), a = 0; a < s.length; a++) s[a].type.valid(e, s[a]) || (r.onRemove && r.onRemove(s[a].spec), s.splice(a--, 1));
        return s.length || o.length ? new uo(s, o) : fo
    }
    function bo(t, e) {
        return t.from - e.from || t.to - e.to
    }
    function ko(t) {
        for (var e = t, n = 0; n < e.length - 1; n++) {
            var r = e[n];
            if (r.from != r.to)
                for (var o = n + 1; o < e.length; o++) {
                    var i = e[o];
                    if (i.from != r.from) {
                        i.from < r.to && (e == t && (e = t.slice()), e[n] = r.copy(r.from, i.from), xo(e, o, r.copy(i.from, r.to)));
                        break
                    }
                    i.to != r.to && (e == t && (e = t.slice()), e[o] = i.copy(i.from, r.to), xo(e, o + 1, i.copy(r.to, i.to)))
                }
        }
        return e
    }
    function xo(t, e, n) {
        for (; e < t.length && bo(n, t[e]) > 0;) e++;
        t.splice(e, 0, n)
    }
    function So(t) {
        var e = [];
        return t.someProp("decorations", (function (n) {
            var r = n(t.state);
            r && r != fo && e.push(r)
        })), t.cursorWrapper && e.push(uo.create(t.state.doc, [t.cursorWrapper.deco])), mo.from(e)
    }
    mo.prototype.map = function (t, e) {
        var n = this.members.map((function (n) {
            return n.map(t, e, ho)
        }));
        return mo.from(n)
    }, mo.prototype.forChild = function (t, e) {
        if (e.isLeaf) return uo.empty;
        for (var n = [], r = 0; r < this.members.length; r++) {
            var o = this.members[r].forChild(t, e);
            o != fo && (o instanceof mo ? n = n.concat(o.members) : n.push(o))
        }
        return mo.from(n)
    }, mo.prototype.eq = function (t) {
        if (!(t instanceof mo) || t.members.length != this.members.length) return !1;
        for (var e = 0; e < this.members.length; e++)
            if (!this.members[e].eq(t.members[e])) return !1;
        return !0
    }, mo.prototype.locals = function (t) {
        for (var e, n = !0, r = 0; r < this.members.length; r++) {
            var o = this.members[r].localsInner(t);
            if (o.length)
                if (e) {
                    n && (e = e.slice(), n = !1);
                    for (var i = 0; i < o.length; i++) e.push(o[i])
                } else e = o
        }
        return e ? ko(n ? e : e.sort(bo)) : po
    }, mo.from = function (t) {
        switch (t.length) {
            case 0:
                return fo;
            case 1:
                return t[0];
            default:
                return new mo(t)
        }
    };
    var Mo = {
            childList: !0,
            characterData: !0,
            characterDataOldValue: !0,
            attributes: !0,
            attributeOldValue: !0,
            subtree: !0
        },
        Co = _e && Ve <= 11,
        Oo = function () {
            this.anchorNode = null, this.anchorOffset = 0, this.focusNode = null, this.focusOffset = 0
        };
    Oo.prototype.set = function (t) {
        this.anchorNode = t.anchorNode, this.anchorOffset = t.anchorOffset, this.focusNode = t.focusNode, this.focusOffset = t.focusOffset
    }, Oo.prototype.clear = function () {
        this.anchorNode = this.focusNode = null
    }, Oo.prototype.eq = function (t) {
        return t.anchorNode == this.anchorNode && t.anchorOffset == this.anchorOffset && t.focusNode == this.focusNode && t.focusOffset == this.focusOffset
    };
    var No = function (t, e) {
        var n = this;
        this.view = t, this.handleDOMChange = e, this.queue = [], this.flushingSoon = -1, this.observer = null, this.currentSelection = new Oo, this.onCharData = null, this.suppressingSelectionUpdates = !1, this.observer = window.MutationObserver && new window.MutationObserver((function (t) {
            for (var e = 0; e < t.length; e++) n.queue.push(t[e]);
            _e && Ve <= 11 && t.some((function (t) {
                return "childList" == t.type && t.removedNodes.length || "characterData" == t.type && t.oldValue.length > t.target.nodeValue.length
            })) ? n.flushSoon() : n.flush()
        })), Co && (this.onCharData = function (t) {
            n.queue.push({
                target: t.target,
                type: "characterData",
                oldValue: t.prevValue
            }), n.flushSoon()
        }), this.onSelectionChange = this.onSelectionChange.bind(this)
    };
    No.prototype.flushSoon = function () {
        var t = this;
        this.flushingSoon < 0 && (this.flushingSoon = window.setTimeout((function () {
            t.flushingSoon = -1, t.flush()
        }), 20))
    }, No.prototype.forceFlush = function () {
        this.flushingSoon > -1 && (window.clearTimeout(this.flushingSoon), this.flushingSoon = -1, this.flush())
    }, No.prototype.start = function () {
        this.observer && this.observer.observe(this.view.dom, Mo), this.onCharData && this.view.dom.addEventListener("DOMCharacterDataModified", this.onCharData), this.connectSelection()
    }, No.prototype.stop = function () {
        var t = this;
        if (this.observer) {
            var e = this.observer.takeRecords();
            if (e.length) {
                for (var n = 0; n < e.length; n++) this.queue.push(e[n]);
                window.setTimeout((function () {
                    return t.flush()
                }), 20)
            }
            this.observer.disconnect()
        }
        this.onCharData && this.view.dom.removeEventListener("DOMCharacterDataModified", this.onCharData), this.disconnectSelection()
    }, No.prototype.connectSelection = function () {
        this.view.dom.ownerDocument.addEventListener("selectionchange", this.onSelectionChange)
    }, No.prototype.disconnectSelection = function () {
        this.view.dom.ownerDocument.removeEventListener("selectionchange", this.onSelectionChange)
    }, No.prototype.suppressSelectionUpdates = function () {
        var t = this;
        this.suppressingSelectionUpdates = !0, setTimeout((function () {
            return t.suppressingSelectionUpdates = !1
        }), 50)
    }, No.prototype.onSelectionChange = function () {
        if (ar(this.view)) {
            if (this.suppressingSelectionUpdates) return Zn(this.view);
            if (_e && Ve <= 11 && !this.view.state.selection.empty) {
                var t = this.view.domSelection();
                if (t.focusNode && Ze(t.focusNode, t.focusOffset, t.anchorNode, t.anchorOffset)) return this.flushSoon()
            }
            this.flush()
        }
    }, No.prototype.setCurSelection = function () {
        this.currentSelection.set(this.view.domSelection())
    }, No.prototype.ignoreSelectionChange = function (t) {
        if (0 == t.rangeCount) return !0;
        var e = t.getRangeAt(0).commonAncestorContainer,
            n = this.view.docView.nearestDesc(e);
        return n && n.ignoreMutation({
            type: "selection",
            target: 3 == e.nodeType ? e.parentNode : e
        }) ? (this.setCurSelection(), !0) : void 0
    }, No.prototype.flush = function () {
        if (this.view.docView && !(this.flushingSoon > -1)) {
            var t = this.observer ? this.observer.takeRecords() : [];
            this.queue.length && (t = this.queue.concat(t), this.queue.length = 0);
            var e = this.view.domSelection(),
                n = !this.suppressingSelectionUpdates && !this.currentSelection.eq(e) && ar(this.view) && !this.ignoreSelectionChange(e),
                r = -1,
                o = -1,
                i = !1,
                s = [];
            if (this.view.editable)
                for (var a = 0; a < t.length; a++) {
                    var c = this.registerMutation(t[a], s);
                    c && (r = r < 0 ? c.from : Math.min(c.from, r), o = o < 0 ? c.to : Math.max(c.to, o), c.typeOver && (i = !0))
                }
            if (Fe && s.length > 1) {
                var l = s.filter((function (t) {
                    return "BR" == t.nodeName
                }));
                if (2 == l.length) {
                    var p = l[0],
                        h = l[1];
                    p.parentNode && p.parentNode.parentNode == h.parentNode ? h.remove() : p.remove()
                }
            }(r > -1 || n) && (r > -1 && (this.view.docView.markDirty(r, o), function (t) {
                if (Do) return;
                Do = !0, "normal" == getComputedStyle(t.dom).whiteSpace && console.warn("ProseMirror expects the CSS white-space property to be set, preferably to 'pre-wrap'. It is recommended to load style/prosemirror.css from the prosemirror-view package.")
            }(this.view)), this.handleDOMChange(r, o, i, s), this.view.docView && this.view.docView.dirty ? this.view.updateState(this.view.state) : this.currentSelection.eq(e) || Zn(this.view), this.currentSelection.set(e))
        }
    }, No.prototype.registerMutation = function (t, e) {
        if (e.indexOf(t.target) > -1) return null;
        var n = this.view.docView.nearestDesc(t.target);
        if ("attributes" == t.type && (n == this.view.docView || "contenteditable" == t.attributeName || "style" == t.attributeName && !t.oldValue && !t.target.getAttribute("style"))) return null;
        if (!n || n.ignoreMutation(t)) return null;
        if ("childList" == t.type) {
            for (var r = 0; r < t.addedNodes.length; r++) e.push(t.addedNodes[r]);
            if (n.contentDOM && n.contentDOM != n.dom && !n.contentDOM.contains(t.target)) return {
                from: n.posBefore,
                to: n.posAfter
            };
            var o = t.previousSibling,
                i = t.nextSibling;
            if (_e && Ve <= 11 && t.addedNodes.length)
                for (var s = 0; s < t.addedNodes.length; s++) {
                    var a = t.addedNodes[s],
                        c = a.previousSibling,
                        l = a.nextSibling;
                    (!c || Array.prototype.indexOf.call(t.addedNodes, c) < 0) && (o = c), (!l || Array.prototype.indexOf.call(t.addedNodes, l) < 0) && (i = l)
                }
            var p = o && o.parentNode == t.target ? Ge(o) + 1 : 0,
                h = n.localPosFromDOM(t.target, p, -1),
                u = i && i.parentNode == t.target ? Ge(i) : t.target.childNodes.length;
            return {
                from: h,
                to: n.localPosFromDOM(t.target, u, 1)
            }
        }
        return "attributes" == t.type ? {
            from: n.posAtStart - n.border,
            to: n.posAtEnd + n.border
        } : {
            from: n.posAtStart,
            to: n.posAtEnd,
            typeOver: t.target.nodeValue == t.oldValue
        }
    };
    var Do = !1;
    function To(t) {
        var e = t.pmViewDesc;
        if (e) return e.parseRule();
        if ("BR" == t.nodeName && t.parentNode) {
            if (je && /^(ul|ol)$/i.test(t.parentNode.nodeName)) {
                var n = document.createElement("div");
                return n.appendChild(document.createElement("li")), {
                    skip: n
                }
            }
            if (t.parentNode.lastChild == t || je && /^(tr|table)$/i.test(t.parentNode.nodeName)) return {
                ignore: !0
            }
        } else if ("IMG" == t.nodeName && t.getAttribute("mark-placeholder")) return {
            ignore: !0
        };
        return null
    }
    function Eo(t, e, n, o, i) {
        if (e < 0) {
            var s = t.input.lastSelectionTime > Date.now() - 50 ? t.input.lastSelectionOrigin : null,
                a = Xn(t, s);
            if (a && !t.state.selection.eq(a)) {
                var c = t.state.tr.setSelection(a);
                "pointer" == s ? c.setMeta("pointer", !0) : "key" == s && c.scrollIntoView(), t.dispatch(c)
            }
        } else {
            var l = t.state.doc.resolve(e),
                p = l.sharedDepth(n);
            e = l.before(p + 1), n = t.state.doc.resolve(n).after(p + 1);
            var h = t.state.selection,
                u = function (t, e, n) {
                    var r, o = t.docView.parseRange(e, n),
                        i = o.node,
                        s = o.fromOffset,
                        a = o.toOffset,
                        c = o.from,
                        l = o.to,
                        p = t.domSelection(),
                        h = p.anchorNode;
                    if (h && t.dom.contains(1 == h.nodeType ? h : h.parentNode) && (r = [{
                        node: h,
                        offset: p.anchorOffset
                    }], on(p) || r.push({
                        node: p.focusNode,
                        offset: p.focusOffset
                    })), qe && 8 === t.input.lastKeyCode)
                        for (var u = a; u > s; u--) {
                            var f = i.childNodes[u - 1],
                                d = f.pmViewDesc;
                            if ("BR" == f.nodeName && !d) {
                                a = u;
                                break
                            }
                            if (!d || d.size) break
                        }
                    var m = t.state.doc,
                        v = t.someProp("domParser") || nt.fromSchema(t.state.schema),
                        g = m.resolve(c),
                        y = null,
                        w = v.parse(i, {
                            topNode: g.parent,
                            topMatch: g.parent.contentMatchAt(g.index()),
                            topOpen: !0,
                            from: s,
                            to: a,
                            preserveWhitespace: "pre" != g.parent.type.whitespace || "full",
                            findPositions: r,
                            ruleFromNode: To,
                            context: g
                        });
                    if (r && null != r[0].pos) {
                        var b = r[0].pos,
                            k = r[1] && r[1].pos;
                        null == k && (k = b), y = {
                            anchor: b + c,
                            head: k + c
                        }
                    }
                    return {
                        doc: w,
                        sel: y,
                        from: c,
                        to: l
                    }
                }(t, e, n);
            if (qe && t.cursorWrapper && u.sel && u.sel.anchor == t.cursorWrapper.deco.from) {
                var f = t.cursorWrapper.deco.type.toDOM.nextSibling,
                    d = f && f.nodeValue ? f.nodeValue.length : 1;
                u.sel = {
                    anchor: u.sel.anchor + d,
                    head: u.sel.anchor + d
                }
            }
            var m, v, g = t.state.doc,
                y = g.slice(u.from, u.to);
            8 === t.input.lastKeyCode && Date.now() - 100 < t.input.lastKeyCodeTime ? (m = t.state.selection.to, v = "end") : (m = t.state.selection.from, v = "start"), t.input.lastKeyCode = null;
            var w = function (t, e, n, r, o) {
                var i = t.findDiffStart(e, n);
                if (null == i) return null;
                var s = t.findDiffEnd(e, n + t.size, n + e.size),
                    a = s.a,
                    c = s.b;
                if ("end" == o) {
                    r -= a + Math.max(0, i - Math.min(a, c)) - i
                }
                if (a < i && t.size < e.size) {
                    c = (i -= r <= i && r >= a ? i - r : 0) + (c - a), a = i
                } else if (c < i) {
                    a = (i -= r <= i && r >= c ? i - r : 0) + (a - c), c = i
                }
                return {
                    start: i,
                    endA: a,
                    endB: c
                }
            }(y.content, u.doc.content, u.from, m, v);
            if ((We && t.input.lastIOSEnter > Date.now() - 225 || Ke) && i.some((function (t) {
                return "DIV" == t.nodeName || "P" == t.nodeName
            })) && (!w || w.endA >= w.endB) && t.someProp("handleKeyDown", (function (e) {
                return e(t, sn(13, "Enter"))
            }))) t.input.lastIOSEnter = 0;
            else {
                if (!w) {
                    if (!(o && h instanceof pe && !h.empty && h.$head.sameParent(h.$anchor)) || t.composing || u.sel && u.sel.anchor != u.sel.head) {
                        if (u.sel) {
                            var b = Ao(t, t.state.doc, u.sel);
                            b && !b.eq(t.state.selection) && t.dispatch(t.state.tr.setSelection(b))
                        }
                        return
                    }
                    w = {
                        start: h.from,
                        endA: h.to,
                        endB: h.to
                    }
                }
                t.input.domChangeCount++, t.state.selection.from < t.state.selection.to && w.start == w.endB && t.state.selection instanceof pe && (w.start > t.state.selection.from && w.start <= t.state.selection.from + 2 && t.state.selection.from >= u.from ? w.start = t.state.selection.from : w.endA < t.state.selection.to && w.endA >= t.state.selection.to - 2 && t.state.selection.to <= u.to && (w.endB += t.state.selection.to - w.endA, w.endA = t.state.selection.to)), _e && Ve <= 11 && w.endB == w.start + 1 && w.endA == w.start && w.start > u.from && "  " == u.doc.textBetween(w.start - u.from - 1, w.start - u.from + 1) && (w.start--, w.endA--, w.endB--);
                var k, x = u.doc.resolveNoCache(w.start - u.from),
                    S = u.doc.resolveNoCache(w.endB - u.from),
                    M = g.resolve(w.start),
                    C = x.sameParent(S) && x.parent.inlineContent && M.end() >= w.endA;
                if ((We && t.input.lastIOSEnter > Date.now() - 225 && (!C || i.some((function (t) {
                    return "DIV" == t.nodeName || "P" == t.nodeName
                }))) || !C && x.pos < u.doc.content.size && (k = ie.findFrom(u.doc.resolve(x.pos + 1), 1, !0)) && k.head == S.pos) && t.someProp("handleKeyDown", (function (e) {
                    return e(t, sn(13, "Enter"))
                }))) t.input.lastIOSEnter = 0;
                else if (t.state.selection.anchor > w.start && function (t, e, n, r, o) {
                    if (!r.parent.isTextblock || n - e <= o.pos - r.pos || Io(r, !0, !1) < o.pos) return !1;
                    var i = t.resolve(e);
                    if (i.parentOffset < i.parent.content.size || !i.parent.isTextblock) return !1;
                    var s = t.resolve(Io(i, !0, !0));
                    if (!s.parent.isTextblock || s.pos > n || Io(s, !0, !1) < n) return !1;
                    return r.parent.content.cut(r.parentOffset).eq(s.parent.content)
                }(g, w.start, w.endA, x, S) && t.someProp("handleKeyDown", (function (e) {
                    return e(t, sn(8, "Backspace"))
                }))) Ke && qe && t.domObserver.suppressSelectionUpdates();
                else {
                    qe && Ke && w.endB == w.start && (t.input.lastAndroidDelete = Date.now()), Ke && !C && x.start() != S.start() && 0 == S.parentOffset && x.depth == S.depth && u.sel && u.sel.anchor == u.sel.head && u.sel.head == w.endA && (w.endB -= 2, S = u.doc.resolveNoCache(w.endB - u.from), setTimeout((function () {
                        t.someProp("handleKeyDown", (function (e) {
                            return e(t, sn(13, "Enter"))
                        }))
                    }), 20));
                    var O, N, D, T = w.start,
                        E = w.endA;
                    if (C)
                        if (x.pos == S.pos) _e && Ve <= 11 && 0 == x.parentOffset && (t.domObserver.suppressSelectionUpdates(), setTimeout((function () {
                            return Zn(t)
                        }), 20)), O = t.state.tr.delete(T, E), N = g.resolve(w.start).marksAcross(g.resolve(w.endA));
                        else if (w.endA == w.endB && (D = function (t, e) {
                            for (var n, o, i, s = t.firstChild.marks, a = e.firstChild.marks, c = s, l = a, p = 0; p < a.length; p++) c = a[p].removeFromSet(c);
                            for (var h = 0; h < s.length; h++) l = s[h].removeFromSet(l);
                            if (1 == c.length && 0 == l.length) o = c[0], n = "add", i = function (t) {
                                return t.mark(o.addToSet(t.marks))
                            };
                            else {
                                if (0 != c.length || 1 != l.length) return null;
                                o = l[0], n = "remove", i = function (t) {
                                    return t.mark(o.removeFromSet(t.marks))
                                }
                            }
                            for (var u = [], f = 0; f < e.childCount; f++) u.push(i(e.child(f)));
                            if (r.from(u).eq(t)) return {
                                mark: o,
                                type: n
                            }
                        }(x.parent.content.cut(x.parentOffset, S.parentOffset), M.parent.content.cut(M.parentOffset, w.endA - M.start())))) O = t.state.tr, "add" == D.type ? O.addMark(T, E, D.mark) : O.removeMark(T, E, D.mark);
                        else if (x.parent.child(x.index()).isText && x.index() == S.index() - (S.textOffset ? 0 : 1)) {
                            var A = x.parent.textBetween(x.parentOffset, S.parentOffset);
                            if (t.someProp("handleTextInput", (function (e) {
                                return e(t, T, E, A)
                            }))) return;
                            O = t.state.tr.insertText(A, T, E)
                        }
                    if (O || (O = t.state.tr.replace(T, E, u.doc.slice(w.start - u.from, w.endB - u.from))), u.sel) {
                        var I = Ao(t, O.doc, u.sel);
                        I && !(qe && Ke && t.composing && I.empty && (w.start != w.endB || t.input.lastAndroidDelete < Date.now() - 100) && (I.head == T || I.head == O.mapping.map(E) - 1) || _e && I.empty && I.head == T) && O.setSelection(I)
                    }
                    N && O.ensureMarks(N), t.dispatch(O.scrollIntoView())
                }
            }
        }
    }
    function Ao(t, e, n) {
        return Math.max(n.anchor, n.head) > e.content.size ? null : sr(t, e.resolve(n.anchor), e.resolve(n.head))
    }
    function Io(t, e, n) {
        for (var r = t.depth, o = e ? t.end() : t.pos; r > 0 && (e || t.indexAfter(r) == t.node(r).childCount);) r--, o++, e = !1;
        if (n)
            for (var i = t.node(r).maybeChild(t.indexAfter(r)); i && !i.isLeaf;) i = i.firstChild, o++;
        return o
    }
    var zo = xr,
        Ro = Sr,
        Po = Yr,
        Bo = function (t, e) {
            var n = this;
            this._root = null, this.focused = !1, this.trackWrites = null, this.mounted = !1, this.markCursor = null, this.cursorWrapper = null, this.lastSelectedViewDesc = void 0, this.input = new Pr, this.prevDirectPlugins = [], this.pluginViews = [], this.dragging = null, this._props = e, this.state = e.state, this.directPlugins = e.plugins || [], this.directPlugins.forEach(Lo), this.dispatch = this.dispatch.bind(this), this.dom = t && t.mount || document.createElement("div"), t && (t.appendChild ? t.appendChild(this.dom) : "function" == typeof t ? t(this.dom) : t.mount && (this.mounted = !0)), this.editable = $o(this), Fo(this), this.nodeViews = qo(this), this.docView = Pn(this.state.doc, Vo(this), So(this), this.dom, this), this.domObserver = new No(this, (function (t, e, r, o) {
                return Eo(n, t, e, r, o)
            })), this.domObserver.start(),
                function (t) {
                    var e = function (e) {
                        var n = zr[e];
                        t.dom.addEventListener(e, t.input.eventHandlers[e] = function (e) {
                            ! function (t, e) {
                                if (!e.bubbles) return !0;
                                if (e.defaultPrevented) return !1;
                                for (var n = e.target; n != t.dom; n = n.parentNode)
                                    if (!n || 11 == n.nodeType || n.pmViewDesc && n.pmViewDesc.stopEvent(e)) return !1;
                                return !0
                            }(t, e) || Vr(t, e) || !t.editable && e.type in Rr || n(t, e)
                        })
                    };
                    for (var n in zr) e(n);
                    je && t.dom.addEventListener("input", (function () {
                        return null
                    })), _r(t)
                }(this), this.updatePluginViews()
        },
        _o = {
            composing: {
                configurable: !0
            },
            props: {
                configurable: !0
            },
            root: {
                configurable: !0
            },
            isDestroyed: {
                configurable: !0
            }
        };
    function Vo(t) {
        var e = Object.create(null);
        return e.class = "ProseMirror", e.contenteditable = String(t.editable), e.translate = "no", t.someProp("attributes", (function (n) {
            if ("function" == typeof n && (n = n(t.state)), n)
                for (var r in n) "class" == r && (e.class += " " + n[r]), "style" == r ? e.style = (e.style ? e.style + ";" : "") + n[r] : e[r] || "contenteditable" == r || "nodeName" == r || (e[r] = String(n[r]))
        })), [co.node(0, t.state.doc.content.size, e)]
    }
    function Fo(t) {
        if (t.markCursor) {
            var e = document.createElement("img");
            e.className = "ProseMirror-separator", e.setAttribute("mark-placeholder", "true"), e.setAttribute("alt", ""), t.cursorWrapper = {
                dom: e,
                deco: co.widget(t.state.selection.head, e, {
                    raw: !0,
                    marks: t.markCursor
                })
            }
        } else t.cursorWrapper = null
    }
    function $o(t) {
        return !t.someProp("editable", (function (e) {
            return !1 === e(t.state)
        }))
    }
    function qo(t) {
        var e = Object.create(null);
        function n(t) {
            for (var n in t) Object.prototype.hasOwnProperty.call(e, n) || (e[n] = t[n])
        }
        return t.someProp("nodeViews", n), t.someProp("markViews", n), e
    }
    function Lo(t) {
        if (t.spec.state || t.spec.filterTransaction || t.spec.appendTransaction) throw new RangeError("Plugins passed directly to the view must not have a state component")
    }
    _o.composing.get = function () {
        return this.input.composing
    }, _o.props.get = function () {
        if (this._props.state != this.state) {
            var t = this._props;
            for (var e in this._props = {}, t) this._props[e] = t[e];
            this._props.state = this.state
        }
        return this._props
    }, Bo.prototype.update = function (t) {
        t.handleDOMEvents != this._props.handleDOMEvents && _r(this), this._props = t, t.plugins && (t.plugins.forEach(Lo), this.directPlugins = t.plugins), this.updateStateInner(t.state, !0)
    }, Bo.prototype.setProps = function (t) {
        var e = {};
        for (var n in this._props) e[n] = this._props[n];
        for (var r in e.state = this.state, t) e[r] = t[r];
        this.update(e)
    }, Bo.prototype.updateState = function (t) {
        this.updateStateInner(t, this.state.plugins != t.plugins)
    }, Bo.prototype.updateStateInner = function (t, e) {
        var n = this,
            r = this.state,
            o = !1,
            i = !1;
        if (t.storedMarks && this.composing && (Xr(this), i = !0), this.state = t, e) {
            var s = qo(this);
            (function (t, e) {
                var n = 0,
                    r = 0;
                for (var o in t) {
                    if (t[o] != e[o]) return !0;
                    n++
                }
                for (var i in e) r++;
                return n != r
            })(s, this.nodeViews) && (this.nodeViews = s, o = !0), _r(this)
        }
        this.editable = $o(this), Fo(this);
        var a = So(this),
            c = Vo(this),
            l = e ? "reset" : t.scrollToSelection > r.scrollToSelection ? "to selection" : "preserve",
            p = o || !this.docView.matchesNode(t.doc, c, a);
        !p && t.selection.eq(r.selection) || (i = !0);
        var h, u, f, d, m, v, g, y, w = "preserve" == l && i && null == this.dom.style.overflowAnchor && function (t) {
            for (var e, n, r = t.dom.getBoundingClientRect(), o = Math.max(0, r.top), i = (r.left + r.right) / 2, s = o + 1; s < Math.min(innerHeight, r.bottom); s += 5) {
                var a = t.root.elementFromPoint(i, s);
                if (a && a != t.dom && t.dom.contains(a)) {
                    var c = a.getBoundingClientRect();
                    if (c.top >= o - 20) {
                        e = a, n = c.top;
                        break
                    }
                }
            }
            return {
                refDOM: e,
                refTop: n,
                stack: hn(t.dom)
            }
        }(this);
        if (i) {
            this.domObserver.stop();
            var b = p && (_e || qe) && !this.composing && !r.selection.empty && !t.selection.empty && (h = r.selection, u = t.selection, f = Math.min(h.$anchor.sharedDepth(h.head), u.$anchor.sharedDepth(u.head)), h.$anchor.start(f) != u.$anchor.start(f));
            if (p) {
                var k = qe ? this.trackWrites = this.domSelection().focusNode : null;
                !o && this.docView.update(t.doc, c, a, this) || (this.docView.updateOuterDeco([]), this.docView.destroy(), this.docView = Pn(t.doc, c, a, this.dom, this)), k && !this.trackWrites && (b = !0)
            }
            b || !(this.input.mouseDown && this.domObserver.currentSelection.eq(this.domSelection()) && function (t) {
                var e = t.docView.domFromPos(t.state.selection.anchor, 0),
                    n = t.domSelection();
                return Ze(e.node, e.offset, n.anchorNode, n.anchorOffset)
            }(this)) ? Zn(this, b) : (or(this, t.selection), this.domObserver.setCurSelection()), this.domObserver.start()
        }
        if (this.updatePluginViews(r), "reset" == l) this.dom.scrollTop = 0;
        else if ("to selection" == l) {
            var x = this.domSelection().focusNode;
            if (this.someProp("handleScrollToSelection", (function (t) {
                return t(n)
            })));
            else if (t.selection instanceof ue) {
                var S = this.docView.domAfterPos(t.selection.from);
                1 == S.nodeType && pn(this, S.getBoundingClientRect(), x)
            } else pn(this, this.coordsAtPos(t.selection.head, 1), x)
        } else w && (m = (d = w).refDOM, v = d.refTop, g = d.stack, y = m ? m.getBoundingClientRect().top : 0, un(g, 0 == y ? 0 : y - v))
    }, Bo.prototype.destroyPluginViews = function () {
        for (var t; t = this.pluginViews.pop();) t.destroy && t.destroy()
    }, Bo.prototype.updatePluginViews = function (t) {
        if (t && t.plugins == this.state.plugins && this.directPlugins == this.prevDirectPlugins)
            for (var e = 0; e < this.pluginViews.length; e++) {
                var n = this.pluginViews[e];
                n.update && n.update(this, t)
            } else {
            this.prevDirectPlugins = this.directPlugins, this.destroyPluginViews();
            for (var r = 0; r < this.directPlugins.length; r++) {
                var o = this.directPlugins[r];
                o.spec.view && this.pluginViews.push(o.spec.view(this))
            }
            for (var i = 0; i < this.state.plugins.length; i++) {
                var s = this.state.plugins[i];
                s.spec.view && this.pluginViews.push(s.spec.view(this))
            }
        }
    }, Bo.prototype.someProp = function (t, e) {
        var n, r = this._props && this._props[t];
        if (null != r && (n = e ? e(r) : r)) return n;
        for (var o = 0; o < this.directPlugins.length; o++) {
            var i = this.directPlugins[o].props[t];
            if (null != i && (n = e ? e(i) : i)) return n
        }
        var s = this.state.plugins;
        if (s)
            for (var a = 0; a < s.length; a++) {
                var c = s[a].props[t];
                if (null != c && (n = e ? e(c) : c)) return n
            }
    }, Bo.prototype.hasFocus = function () {
        return this.root.activeElement == this.dom
    }, Bo.prototype.focus = function () {
        this.domObserver.stop(), this.editable && function (t) {
            if (t.setActive) return t.setActive();
            if (fn) return t.focus(fn);
            var e = hn(t);
            t.focus(null == fn ? {
                get preventScroll() {
                    return fn = {
                        preventScroll: !0
                    }, !0
                }
            } : void 0), fn || (fn = !1, un(e, 0))
        }(this.dom), Zn(this), this.domObserver.start()
    }, _o.root.get = function () {
        var t = this,
            e = this._root;
        if (null == e)
            for (var n = function (e) {
                if (9 == e.nodeType || 11 == e.nodeType && e.host) return e.getSelection || (Object.getPrototypeOf(e).getSelection = function () {
                    return e.ownerDocument.getSelection()
                }), {
                    v: t._root = e
                }
            }, r = t.dom.parentNode; r; r = r.parentNode) {
                var o = n(r);
                if (o) return o.v
            }
        return e || document
    }, Bo.prototype.posAtCoords = function (t) {
        return gn(this, t)
    }, Bo.prototype.coordsAtPos = function (t, e) {
        return void 0 === e && (e = 1), bn(this, t, e)
    }, Bo.prototype.domAtPos = function (t, e) {
        return void 0 === e && (e = 0), this.docView.domFromPos(t, e)
    }, Bo.prototype.nodeDOM = function (t) {
        var e = this.docView.descAt(t);
        return e ? e.nodeDOM : null
    }, Bo.prototype.posAtDOM = function (t, e, n) {
        void 0 === n && (n = -1);
        var r = this.docView.posFromDOM(t, e, n);
        if (null == r) throw new RangeError("DOM position not inside the editor");
        return r
    }, Bo.prototype.endOfTextblock = function (t, e) {
        return Dn(this, e || this.state, t)
    }, Bo.prototype.destroy = function () {
        this.docView && (! function (t) {
            for (var e in t.domObserver.stop(), t.input.eventHandlers) t.dom.removeEventListener(e, t.input.eventHandlers[e]);
            clearTimeout(t.input.composingTimeout), clearTimeout(t.input.lastIOSEnterFallbackTimeout)
        }(this), this.destroyPluginViews(), this.mounted ? (this.docView.update(this.state.doc, [], So(this), this), this.dom.textContent = "") : this.dom.parentNode && this.dom.parentNode.removeChild(this.dom), this.docView.destroy(), this.docView = null)
    }, _o.isDestroyed.get = function () {
        return null == this.docView
    }, Bo.prototype.dispatchEvent = function (t) {
        return function (t, e) {
            Vr(t, e) || !zr[e.type] || !t.editable && e.type in Rr || zr[e.type](t, e)
        }(this, t)
    }, Bo.prototype.dispatch = function (t) {
        var e = this._props.dispatchTransaction;
        e ? e.call(this, t) : this.updateState(this.state.apply(t))
    }, Bo.prototype.domSelection = function () {
        return this.root.getSelection()
    }, Object.defineProperties(Bo.prototype, _o);
    for (var jo = Object.freeze({
        __proto__: null,
        Decoration: co,
        DecorationSet: uo,
        EditorView: Bo,
        __endComposition: Po,
        __parseFromClipboard: Ro,
        __serializeForClipboard: zo
    }), Wo = {
        8: "Backspace",
        9: "Tab",
        10: "Enter",
        12: "NumLock",
        13: "Enter",
        16: "Shift",
        17: "Control",
        18: "Alt",
        20: "CapsLock",
        27: "Escape",
        32: " ",
        33: "PageUp",
        34: "PageDown",
        35: "End",
        36: "Home",
        37: "ArrowLeft",
        38: "ArrowUp",
        39: "ArrowRight",
        40: "ArrowDown",
        44: "PrintScreen",
        45: "Insert",
        46: "Delete",
        59: ";",
        61: "=",
        91: "Meta",
        92: "Meta",
        106: "*",
        107: "+",
        108: ",",
        109: "-",
        110: ".",
        111: "/",
        144: "NumLock",
        145: "ScrollLock",
        160: "Shift",
        161: "Shift",
        162: "Control",
        163: "Control",
        164: "Alt",
        165: "Alt",
        173: "-",
        186: ";",
        187: "=",
        188: ",",
        189: "-",
        190: ".",
        191: "/",
        192: "`",
        219: "[",
        220: "\\",
        221: "]",
        222: "'",
        229: "q"
    }, Jo = {
        48: ")",
        49: "!",
        50: "@",
        51: "#",
        52: "$",
        53: "%",
        54: "^",
        55: "&",
        56: "*",
        57: "(",
        59: ":",
        61: "+",
        173: "_",
        186: ":",
        187: "+",
        188: "<",
        189: "_",
        190: ">",
        191: "?",
        192: "~",
        219: "{",
        220: "|",
        221: "}",
        222: '"',
        229: "Q"
    }, Ko = "undefined" != typeof navigator && /Chrome\/(\d+)/.exec(navigator.userAgent), Ho = "undefined" != typeof navigator && /Apple Computer/.test(navigator.vendor), Uo = "undefined" != typeof navigator && /Gecko\/\d+/.test(navigator.userAgent), Go = "undefined" != typeof navigator && /Mac/.test(navigator.platform), Qo = "undefined" != typeof navigator && /MSIE \d|Trident\/(?:[7-9]|\d{2,})\..*rv:(\d+)/.exec(navigator.userAgent), Xo = Ko && (Go || +Ko[1] < 57) || Uo && Go, Yo = 0; Yo < 10; Yo++) Wo[48 + Yo] = Wo[96 + Yo] = String(Yo);
    for (Yo = 1; Yo <= 24; Yo++) Wo[Yo + 111] = "F" + Yo;
    for (Yo = 65; Yo <= 90; Yo++) Wo[Yo] = String.fromCharCode(Yo + 32), Jo[Yo] = String.fromCharCode(Yo);
    for (var Zo in Wo) Jo.hasOwnProperty(Zo) || (Jo[Zo] = Wo[Zo]);
    var ti = "undefined" != typeof navigator && /Mac|iP(hone|[oa]d)/.test(navigator.platform);
    function ei(t) {
        var e, n, r, o, i = t.split(/-(?!$)/),
            s = i[i.length - 1];
        "Space" == s && (s = " ");
        for (var a = 0; a < i.length - 1; a++) {
            var c = i[a];
            if (/^(cmd|meta|m)$/i.test(c)) o = !0;
            else if (/^a(lt)?$/i.test(c)) e = !0;
            else if (/^(c|ctrl|control)$/i.test(c)) n = !0;
            else if (/^s(hift)?$/i.test(c)) r = !0;
            else {
                if (!/^mod$/i.test(c)) throw new Error("Unrecognized modifier name: " + c);
                ti ? o = !0 : n = !0
            }
        }
        return e && (s = "Alt-" + s), n && (s = "Ctrl-" + s), o && (s = "Meta-" + s), r && (s = "Shift-" + s), s
    }
    function ni(t, e, n) {
        return e.altKey && (t = "Alt-" + t), e.ctrlKey && (t = "Ctrl-" + t), e.metaKey && (t = "Meta-" + t), !1 !== n && e.shiftKey && (t = "Shift-" + t), t
    }
    function ri(t) {
        return new Oe({
            props: {
                handleKeyDown: oi(t)
            }
        })
    }
    function oi(t) {
        var e = function (t) {
            var e = Object.create(null);
            for (var n in t) e[ei(n)] = t[n];
            return e
        }(t);
        return function (t, n) {
            var r, o = function (t) {
                    var e = !(Xo && (t.ctrlKey || t.altKey || t.metaKey) || (Ho || Qo) && t.shiftKey && t.key && 1 == t.key.length) && t.key || (t.shiftKey ? Jo : Wo)[t.keyCode] || t.key || "Unidentified";
                    return "Esc" == e && (e = "Escape"), "Del" == e && (e = "Delete"), "Left" == e && (e = "ArrowLeft"), "Up" == e && (e = "ArrowUp"), "Right" == e && (e = "ArrowRight"), "Down" == e && (e = "ArrowDown"), e
                }(n),
                i = 1 == o.length && " " != o,
                s = e[ni(o, n, !i)];
            if (s && s(t.state, t.dispatch, t)) return !0;
            if (i && (n.shiftKey || n.altKey || n.metaKey || o.charCodeAt(0) > 127) && (r = Wo[n.keyCode]) && r != o) {
                var a = e[ni(r, n, !0)];
                if (a && a(t.state, t.dispatch, t)) return !0
            } else if (i && n.shiftKey) {
                var c = e[ni(o, n, !0)];
                if (c && c(t.state, t.dispatch, t)) return !0
            }
            return !1
        }
    }
    var ii = Object.freeze({
            __proto__: null,
            keydownHandler: oi,
            keymap: ri
        }),
        si = function (t, e) {
            var n;
            this.match = t, this.match = t, this.handler = "string" == typeof e ? (n = e, function (t, e, r, o) {
                var i = n;
                if (e[1]) {
                    var s = e[0].lastIndexOf(e[1]);
                    i += e[0].slice(s + e[1].length);
                    var a = (r += s) - o;
                    a > 0 && (i = e[0].slice(s - a, s) + i, r = o)
                }
                return t.tr.insertText(i, r, o)
            }) : e
        };
    function ai(t) {
        var e = t.rules,
            n = new Oe({
                state: {
                    init: function () {
                        return null
                    },
                    apply: function (t, e) {
                        var n = t.getMeta(this);
                        return n || (t.selectionSet || t.docChanged ? null : e)
                    }
                },
                props: {
                    handleTextInput: function (t, r, o, i) {
                        return ci(t, r, o, i, e, n)
                    },
                    handleDOMEvents: {
                        compositionend: function (t) {
                            setTimeout((function () {
                                var r = t.state.selection.$cursor;
                                r && ci(t, r.pos, r.pos, "", e, n)
                            }))
                        }
                    }
                },
                isInputRules: !0
            });
        return n
    }
    function ci(t, e, n, r, o, i) {
        if (t.composing) return !1;
        var s = t.state,
            a = s.doc.resolve(e);
        if (a.parent.type.spec.code) return !1;
        for (var c = a.parent.textBetween(Math.max(0, a.parentOffset - 500), a.parentOffset, null, "￼") + r, l = 0; l < o.length; l++) {
            var p = o[l].match.exec(c),
                h = p && o[l].handler(s, p, e - (p[0].length - r.length), n);
            if (h) return t.dispatch(h.setMeta(i, {
                transform: h,
                from: e,
                to: n,
                text: r
            })), !0
        }
        return !1
    }
    var li = function (t, e) {
            for (var n = t.plugins, r = 0; r < n.length; r++) {
                var o = n[r],
                    i = void 0;
                if (o.spec.isInputRules && (i = o.getState(t))) {
                    if (e) {
                        for (var s = t.tr, a = i.transform, c = a.steps.length - 1; c >= 0; c--) s.step(a.steps[c].invert(a.docs[c]));
                        if (i.text) {
                            var l = s.doc.resolve(i.from).marks();
                            s.replaceWith(i.from, i.to, t.schema.text(i.text, l))
                        } else s.delete(i.from, i.to);
                        e(s)
                    }
                    return !0
                }
            }
            return !1
        },
        pi = new si(/--$/, "—"),
        hi = new si(/\.\.\.$/, "…"),
        ui = new si(/(?:^|[\s\{\[\(\<'"\u2018\u201C])(")$/, "“"),
        fi = new si(/"$/, "”"),
        di = new si(/(?:^|[\s\{\[\(\<'"\u2018\u201C])(')$/, "‘"),
        mi = new si(/'$/, "’"),
        vi = [ui, fi, di, mi];
    function gi(t, e, n, r) {
        return void 0 === n && (n = null), new si(t, (function (t, o, i, s) {
            var a = n instanceof Function ? n(o) : n,
                c = t.tr.delete(i, s),
                l = c.doc.resolve(i).blockRange(),
                p = l && Rt(l, e, a);
            if (!p) return null;
            c.wrap(l, p);
            var h = c.doc.resolve(i - 1).nodeBefore;
            return h && h.type == e && _t(c.doc, i - 1) && (!r || r(o, h)) && c.join(i - 1), c
        }))
    }
    function yi(t, e, n) {
        return void 0 === n && (n = null), new si(t, (function (t, r, o, i) {
            var s = t.doc.resolve(o),
                a = n instanceof Function ? n(r) : n;
            return s.node(-1).canReplaceWith(s.index(-1), s.indexAfter(-1), e) ? t.tr.delete(o, i).setBlockType(o, o, e, a) : null
        }))
    }
    var wi = Object.freeze({
            __proto__: null,
            InputRule: si,
            closeDoubleQuote: fi,
            closeSingleQuote: mi,
            ellipsis: hi,
            emDash: pi,
            inputRules: ai,
            openDoubleQuote: ui,
            openSingleQuote: di,
            smartQuotes: vi,
            textblockTypeInputRule: yi,
            undoInputRule: li,
            wrappingInputRule: gi
        }),
        bi = 200,
        ki = function () {};
    ki.prototype.append = function (t) {
        return t.length ? (t = ki.from(t), !this.length && t || t.length < bi && this.leafAppend(t) || this.length < bi && t.leafPrepend(this) || this.appendInner(t)) : this
    }, ki.prototype.prepend = function (t) {
        return t.length ? ki.from(t).append(this) : this
    }, ki.prototype.appendInner = function (t) {
        return new Si(this, t)
    }, ki.prototype.slice = function (t, e) {
        return void 0 === t && (t = 0), void 0 === e && (e = this.length), t >= e ? ki.empty : this.sliceInner(Math.max(0, t), Math.min(this.length, e))
    }, ki.prototype.get = function (t) {
        if (!(t < 0 || t >= this.length)) return this.getInner(t)
    }, ki.prototype.forEach = function (t, e, n) {
        void 0 === e && (e = 0), void 0 === n && (n = this.length), e <= n ? this.forEachInner(t, e, n, 0) : this.forEachInvertedInner(t, e, n, 0)
    }, ki.prototype.map = function (t, e, n) {
        void 0 === e && (e = 0), void 0 === n && (n = this.length);
        var r = [];
        return this.forEach((function (e, n) {
            return r.push(t(e, n))
        }), e, n), r
    }, ki.from = function (t) {
        return t instanceof ki ? t : t && t.length ? new xi(t) : ki.empty
    };
    var xi = function (t) {
        function e(e) {
            t.call(this), this.values = e
        }
        t && (e.__proto__ = t), e.prototype = Object.create(t && t.prototype), e.prototype.constructor = e;
        var n = {
            length: {
                configurable: !0
            },
            depth: {
                configurable: !0
            }
        };
        return e.prototype.flatten = function () {
            return this.values
        }, e.prototype.sliceInner = function (t, n) {
            return 0 == t && n == this.length ? this : new e(this.values.slice(t, n))
        }, e.prototype.getInner = function (t) {
            return this.values[t]
        }, e.prototype.forEachInner = function (t, e, n, r) {
            for (var o = e; o < n; o++)
                if (!1 === t(this.values[o], r + o)) return !1
        }, e.prototype.forEachInvertedInner = function (t, e, n, r) {
            for (var o = e - 1; o >= n; o--)
                if (!1 === t(this.values[o], r + o)) return !1
        }, e.prototype.leafAppend = function (t) {
            if (this.length + t.length <= bi) return new e(this.values.concat(t.flatten()))
        }, e.prototype.leafPrepend = function (t) {
            if (this.length + t.length <= bi) return new e(t.flatten().concat(this.values))
        }, n.length.get = function () {
            return this.values.length
        }, n.depth.get = function () {
            return 0
        }, Object.defineProperties(e.prototype, n), e
    }(ki);
    ki.empty = new xi([]);
    var Si = function (t) {
            function e(e, n) {
                t.call(this), this.left = e, this.right = n, this.length = e.length + n.length, this.depth = Math.max(e.depth, n.depth) + 1
            }
            return t && (e.__proto__ = t), e.prototype = Object.create(t && t.prototype), e.prototype.constructor = e, e.prototype.flatten = function () {
                return this.left.flatten().concat(this.right.flatten())
            }, e.prototype.getInner = function (t) {
                return t < this.left.length ? this.left.get(t) : this.right.get(t - this.left.length)
            }, e.prototype.forEachInner = function (t, e, n, r) {
                var o = this.left.length;
                return !(e < o && !1 === this.left.forEachInner(t, e, Math.min(n, o), r)) && (!(n > o && !1 === this.right.forEachInner(t, Math.max(e - o, 0), Math.min(this.length, n) - o, r + o)) && void 0)
            }, e.prototype.forEachInvertedInner = function (t, e, n, r) {
                var o = this.left.length;
                return !(e > o && !1 === this.right.forEachInvertedInner(t, e - o, Math.max(n, o) - o, r + o)) && (!(n < o && !1 === this.left.forEachInvertedInner(t, Math.min(e, o), n, r)) && void 0)
            }, e.prototype.sliceInner = function (t, e) {
                if (0 == t && e == this.length) return this;
                var n = this.left.length;
                return e <= n ? this.left.slice(t, e) : t >= n ? this.right.slice(t - n, e - n) : this.left.slice(t, n).append(this.right.slice(0, e - n))
            }, e.prototype.leafAppend = function (t) {
                var n = this.right.leafAppend(t);
                if (n) return new e(this.left, n)
            }, e.prototype.leafPrepend = function (t) {
                var n = this.left.leafPrepend(t);
                if (n) return new e(n, this.right)
            }, e.prototype.appendInner = function (t) {
                return this.left.depth >= Math.max(this.right.depth, t.depth) + 1 ? new e(this.left, new e(this.right, t)) : new e(this, t)
            }, e
        }(ki),
        Mi = ki,
        Ci = function (t, e) {
            this.items = t, this.eventCount = e
        };
    Ci.prototype.popEvent = function (t, e) {
        var n = this;
        if (0 == this.eventCount) return null;
        for (var r, o, i = this.items.length;; i--) {
            if (this.items.get(i - 1).selection) {
                --i;
                break
            }
        }
        e && (r = this.remapping(i, this.items.length), o = r.maps.length);
        var s, a, c = t.tr,
            l = [],
            p = [];
        return this.items.forEach((function (t, e) {
            if (!t.step) return r || (r = n.remapping(i, e + 1), o = r.maps.length), o--, void p.push(t);
            if (r) {
                p.push(new Oi(t.map));
                var h, u = t.step.map(r.slice(o));
                u && c.maybeStep(u).doc && (h = c.mapping.maps[c.mapping.maps.length - 1], l.push(new Oi(h, void 0, void 0, l.length + p.length))), o--, h && r.appendMap(h, o)
            } else c.maybeStep(t.step);
            return t.selection ? (s = r ? t.selection.map(r.slice(o)) : t.selection, a = new Ci(n.items.slice(0, i).append(p.reverse().concat(l)), n.eventCount - 1), !1) : void 0
        }), this.items.length, 0), {
            remaining: a,
            transform: c,
            selection: s
        }
    }, Ci.prototype.addTransform = function (t, e, n, r) {
        for (var o = [], i = this.eventCount, s = this.items, a = !r && s.length ? s.get(s.length - 1) : null, c = 0; c < t.steps.length; c++) {
            var l, p = t.steps[c].invert(t.docs[c]),
                h = new Oi(t.mapping.maps[c], p, e);
            (l = a && a.merge(h)) && (h = l, c ? o.pop() : s = s.slice(0, s.length - 1)), o.push(h), e && (i++, e = void 0), r || (a = h)
        }
        var u, f, d, m = i - n.depth;
        return m > Di && (f = m, (u = s).forEach((function (t, e) {
            if (t.selection && 0 == f--) return d = e, !1
        })), s = u.slice(d), i -= m), new Ci(s.append(o), i)
    }, Ci.prototype.remapping = function (t, e) {
        var n = new xt;
        return this.items.forEach((function (e, r) {
            var o = null != e.mirrorOffset && r - e.mirrorOffset >= t ? n.maps.length - e.mirrorOffset : void 0;
            n.appendMap(e.map, o)
        }), t, e), n
    }, Ci.prototype.addMaps = function (t) {
        return 0 == this.eventCount ? this : new Ci(this.items.append(t.map((function (t) {
            return new Oi(t)
        }))), this.eventCount)
    }, Ci.prototype.rebased = function (t, e) {
        if (!this.eventCount) return this;
        var n = [],
            r = Math.max(0, this.items.length - e),
            o = t.mapping,
            i = t.steps.length,
            s = this.eventCount;
        this.items.forEach((function (t) {
            t.selection && s--
        }), r);
        var a = e;
        this.items.forEach((function (e) {
            var r = o.getMirror(--a);
            if (null != r) {
                i = Math.min(i, r);
                var c = o.maps[r];
                if (e.step) {
                    var l = t.steps[r].invert(t.docs[r]),
                        p = e.selection && e.selection.map(o.slice(a + 1, r));
                    p && s++, n.push(new Oi(c, l, p))
                } else n.push(new Oi(c))
            }
        }), r);
        for (var c = [], l = e; l < i; l++) c.push(new Oi(o.maps[l]));
        var p = this.items.slice(0, r).append(c).append(n),
            h = new Ci(p, s);
        return h.emptyItemCount() > 500 && (h = h.compress(this.items.length - n.length)), h
    }, Ci.prototype.emptyItemCount = function () {
        var t = 0;
        return this.items.forEach((function (e) {
            e.step || t++
        })), t
    }, Ci.prototype.compress = function (t) {
        void 0 === t && (t = this.items.length);
        var e = this.remapping(0, t),
            n = e.maps.length,
            r = [],
            o = 0;
        return this.items.forEach((function (i, s) {
            if (s >= t) r.push(i), i.selection && o++;
            else if (i.step) {
                var a = i.step.map(e.slice(n)),
                    c = a && a.getMap();
                if (n--, c && e.appendMap(c, n), a) {
                    var l = i.selection && i.selection.map(e.slice(n));
                    l && o++;
                    var p, h = new Oi(c.invert(), a, l),
                        u = r.length - 1;
                    (p = r.length && r[u].merge(h)) ? r[u] = p: r.push(h)
                }
            } else i.map && n--
        }), this.items.length, 0), new Ci(Mi.from(r.reverse()), o)
    }, Ci.empty = new Ci(Mi.empty, 0);
    var Oi = function (t, e, n, r) {
        this.map = t, this.step = e, this.selection = n, this.mirrorOffset = r
    };
    Oi.prototype.merge = function (t) {
        if (this.step && t.step && !t.selection) {
            var e = t.step.merge(this.step);
            if (e) return new Oi(e.getMap().invert(), e, this.selection)
        }
    };
    var Ni = function (t, e, n, r) {
            this.done = t, this.undone = e, this.prevRanges = n, this.prevTime = r
        },
        Di = 20;
    function Ti(t) {
        var e = [];
        return t.forEach((function (t, n, r, o) {
            return e.push(r, o)
        })), e
    }
    function Ei(t, e) {
        if (!t) return null;
        for (var n = [], r = 0; r < t.length; r += 2) {
            var o = e.map(t[r], 1),
                i = e.map(t[r + 1], -1);
            o <= i && n.push(o, i)
        }
        return n
    }
    function Ai(t, e, n, r) {
        var o = Ri(e),
            i = Pi.get(e).spec.config,
            s = (r ? t.undone : t.done).popEvent(e, o);
        if (s) {
            var a = s.selection.resolve(s.transform.doc),
                c = (r ? t.done : t.undone).addTransform(s.transform, e.selection.getBookmark(), i, o),
                l = new Ni(r ? c : s.remaining, r ? s.remaining : c, null, 0);
            n(s.transform.setSelection(a).setMeta(Pi, {
                redo: r,
                historyState: l
            }).scrollIntoView())
        }
    }
    var Ii = !1,
        zi = null;
    function Ri(t) {
        var e = t.plugins;
        if (zi != e) {
            Ii = !1, zi = e;
            for (var n = 0; n < e.length; n++)
                if (e[n].spec.historyPreserveItems) {
                    Ii = !0;
                    break
                }
        }
        return Ii
    }
    var Pi = new Te("history"),
        Bi = new Te("closeHistory");
    function _i(t) {
        return void 0 === t && (t = {}), t = {
            depth: t.depth || 100,
            newGroupDelay: t.newGroupDelay || 500
        }, new Oe({
            key: Pi,
            state: {
                init: function () {
                    return new Ni(Ci.empty, Ci.empty, null, 0)
                },
                apply: function (e, n, r) {
                    return function (t, e, n, r) {
                        var o, i = n.getMeta(Pi);
                        if (i) return i.historyState;
                        n.getMeta(Bi) && (t = new Ni(t.done, t.undone, null, 0));
                        var s = n.getMeta("appendedTransaction");
                        if (0 == n.steps.length) return t;
                        if (s && s.getMeta(Pi)) return s.getMeta(Pi).redo ? new Ni(t.done.addTransform(n, void 0, r, Ri(e)), t.undone, Ti(n.mapping.maps[n.steps.length - 1]), t.prevTime) : new Ni(t.done, t.undone.addTransform(n, void 0, r, Ri(e)), null, t.prevTime);
                        if (!1 === n.getMeta("addToHistory") || s && !1 === s.getMeta("addToHistory")) return (o = n.getMeta("rebased")) ? new Ni(t.done.rebased(n, o), t.undone.rebased(n, o), Ei(t.prevRanges, n.mapping), t.prevTime) : new Ni(t.done.addMaps(n.mapping.maps), t.undone.addMaps(n.mapping.maps), Ei(t.prevRanges, n.mapping), t.prevTime);
                        var a = 0 == t.prevTime || !s && (t.prevTime < (n.time || 0) - r.newGroupDelay || ! function (t, e) {
                                if (!e) return !1;
                                if (!t.docChanged) return !0;
                                var n = !1;
                                return t.mapping.maps[0].forEach((function (t, r) {
                                    for (var o = 0; o < e.length; o += 2) t <= e[o + 1] && r >= e[o] && (n = !0)
                                })), n
                            }(n, t.prevRanges)),
                            c = s ? Ei(t.prevRanges, n.mapping) : Ti(n.mapping.maps[n.steps.length - 1]);
                        return new Ni(t.done.addTransform(n, a ? e.selection.getBookmark() : void 0, r, Ri(e)), Ci.empty, c, n.time)
                    }(n, r, e, t)
                }
            },
            config: t,
            props: {
                handleDOMEvents: {
                    beforeinput: function (t, e) {
                        var n = e.inputType,
                            r = "historyUndo" == n ? Vi : "historyRedo" == n ? Fi : null;
                        return !!r && (e.preventDefault(), r(t.state, t.dispatch))
                    }
                }
            }
        })
    }
    var Vi = function (t, e) {
            var n = Pi.getState(t);
            return !(!n || 0 == n.done.eventCount) && (e && Ai(n, t, e, !1), !0)
        },
        Fi = function (t, e) {
            var n = Pi.getState(t);
            return !(!n || 0 == n.undone.eventCount) && (e && Ai(n, t, e, !0), !0)
        };
    var $i = Object.freeze({
            __proto__: null,
            closeHistory: function (t) {
                return t.setMeta(Bi, !0)
            },
            history: _i,
            redo: Fi,
            redoDepth: function (t) {
                var e = Pi.getState(t);
                return e ? e.undone.eventCount : 0
            },
            undo: Vi,
            undoDepth: function (t) {
                var e = Pi.getState(t);
                return e ? e.done.eventCount : 0
            }
        }),
        qi = function (t, e) {
            return !t.selection.empty && (e && e(t.tr.deleteSelection().scrollIntoView()), !0)
        },
        Li = function (t, e, n) {
            var r = t.selection.$cursor;
            if (!r || (n ? !n.endOfTextblock("backward", t) : r.parentOffset > 0)) return !1;
            var o = Ji(r);
            if (!o) {
                var i = r.blockRange(),
                    s = i && zt(i);
                return null != s && (e && e(t.tr.lift(i, s).scrollIntoView()), !0)
            }
            var a = o.nodeBefore;
            if (!a.type.spec.isolating && as(t, o, e)) return !0;
            if (0 == r.parent.content.size && (ji(a, "end") || ue.isSelectable(a))) {
                var c = Lt(t.doc, r.before(), r.after(), p.empty);
                if (c && c.slice.size < c.to - c.from) {
                    if (e) {
                        var l = t.tr.step(c);
                        l.setSelection(ji(a, "end") ? ie.findFrom(l.doc.resolve(l.mapping.map(o.pos, -1)), -1) : ue.create(l.doc, o.pos - a.nodeSize)), e(l.scrollIntoView())
                    }
                    return !0
                }
            }
            return !(!a.isAtom || o.depth != r.depth - 1) && (e && e(t.tr.delete(o.pos - a.nodeSize, o.pos).scrollIntoView()), !0)
        };
    function ji(t, e, n) {
        void 0 === n && (n = !1);
        for (var r = t; r; r = "start" == e ? r.firstChild : r.lastChild) {
            if (r.isTextblock) return !0;
            if (n && 1 != r.childCount) return !1
        }
        return !1
    }
    var Wi = function (t, e, n) {
        var r = t.selection,
            o = r.$head,
            i = o;
        if (!r.empty) return !1;
        if (o.parent.isTextblock) {
            if (n ? !n.endOfTextblock("backward", t) : o.parentOffset > 0) return !1;
            i = Ji(o)
        }
        var s = i && i.nodeBefore;
        return !(!s || !ue.isSelectable(s)) && (e && e(t.tr.setSelection(ue.create(t.doc, i.pos - s.nodeSize)).scrollIntoView()), !0)
    };
    function Ji(t) {
        if (!t.parent.type.spec.isolating)
            for (var e = t.depth - 1; e >= 0; e--) {
                if (t.index(e) > 0) return t.doc.resolve(t.before(e + 1));
                if (t.node(e).type.spec.isolating) break
            }
        return null
    }
    var Ki = function (t, e, n) {
            var r = t.selection.$cursor;
            if (!r || (n ? !n.endOfTextblock("forward", t) : r.parentOffset < r.parent.content.size)) return !1;
            var o = Ui(r);
            if (!o) return !1;
            var i = o.nodeAfter;
            if (as(t, o, e)) return !0;
            if (0 == r.parent.content.size && (ji(i, "start") || ue.isSelectable(i))) {
                var s = Lt(t.doc, r.before(), r.after(), p.empty);
                if (s && s.slice.size < s.to - s.from) {
                    if (e) {
                        var a = t.tr.step(s);
                        a.setSelection(ji(i, "start") ? ie.findFrom(a.doc.resolve(a.mapping.map(o.pos)), 1) : ue.create(a.doc, a.mapping.map(o.pos))), e(a.scrollIntoView())
                    }
                    return !0
                }
            }
            return !(!i.isAtom || o.depth != r.depth - 1) && (e && e(t.tr.delete(o.pos, o.pos + i.nodeSize).scrollIntoView()), !0)
        },
        Hi = function (t, e, n) {
            var r = t.selection,
                o = r.$head,
                i = o;
            if (!r.empty) return !1;
            if (o.parent.isTextblock) {
                if (n ? !n.endOfTextblock("forward", t) : o.parentOffset < o.parent.content.size) return !1;
                i = Ui(o)
            }
            var s = i && i.nodeAfter;
            return !(!s || !ue.isSelectable(s)) && (e && e(t.tr.setSelection(ue.create(t.doc, i.pos)).scrollIntoView()), !0)
        };
    function Ui(t) {
        if (!t.parent.type.spec.isolating)
            for (var e = t.depth - 1; e >= 0; e--) {
                var n = t.node(e);
                if (t.index(e) + 1 < n.childCount) return t.doc.resolve(t.after(e + 1));
                if (n.type.spec.isolating) break
            }
        return null
    }
    var Gi = function (t, e) {
            var n, r = t.selection,
                o = r instanceof ue;
            if (o) {
                if (r.node.isTextblock || !_t(t.doc, r.from)) return !1;
                n = r.from
            } else if (null == (n = Ft(t.doc, r.from, -1))) return !1;
            if (e) {
                var i = t.tr.join(n);
                o && i.setSelection(ue.create(i.doc, n - t.doc.resolve(n).nodeBefore.nodeSize)), e(i.scrollIntoView())
            }
            return !0
        },
        Qi = function (t, e) {
            var n, r = t.selection;
            if (r instanceof ue) {
                if (r.node.isTextblock || !_t(t.doc, r.to)) return !1;
                n = r.to
            } else if (null == (n = Ft(t.doc, r.to, 1))) return !1;
            return e && e(t.tr.join(n).scrollIntoView()), !0
        },
        Xi = function (t, e) {
            var n = t.selection,
                r = n.$from,
                o = n.$to,
                i = r.blockRange(o),
                s = i && zt(i);
            return null != s && (e && e(t.tr.lift(i, s).scrollIntoView()), !0)
        },
        Yi = function (t, e) {
            var n = t.selection,
                r = n.$head,
                o = n.$anchor;
            return !(!r.parent.type.spec.code || !r.sameParent(o)) && (e && e(t.tr.insertText("\n").scrollIntoView()), !0)
        };
    function Zi(t) {
        for (var e = 0; e < t.edgeCount; e++) {
            var n = t.edge(e).type;
            if (n.isTextblock && !n.hasRequiredAttrs()) return n
        }
        return null
    }
    var ts = function (t, e) {
            var n = t.selection,
                r = n.$head,
                o = n.$anchor;
            if (!r.parent.type.spec.code || !r.sameParent(o)) return !1;
            var i = r.node(-1),
                s = r.indexAfter(-1),
                a = Zi(i.contentMatchAt(s));
            if (!a || !i.canReplaceWith(s, s, a)) return !1;
            if (e) {
                var c = r.after(),
                    l = t.tr.replaceWith(c, c, a.createAndFill());
                l.setSelection(ie.near(l.doc.resolve(c), 1)), e(l.scrollIntoView())
            }
            return !0
        },
        es = function (t, e) {
            var n = t.selection,
                r = n.$from,
                o = n.$to;
            if (n instanceof de || r.parent.inlineContent || o.parent.inlineContent) return !1;
            var i = Zi(o.parent.contentMatchAt(o.indexAfter()));
            if (!i || !i.isTextblock) return !1;
            if (e) {
                var s = (!r.parentOffset && o.index() < o.parent.childCount ? r : o).pos,
                    a = t.tr.insert(s, i.createAndFill());
                a.setSelection(pe.create(a.doc, s + 1)), e(a.scrollIntoView())
            }
            return !0
        },
        ns = function (t, e) {
            var n = t.selection.$cursor;
            if (!n || n.parent.content.size) return !1;
            if (n.depth > 1 && n.after() != n.end(-1)) {
                var r = n.before();
                if (Bt(t.doc, r)) return e && e(t.tr.split(r).scrollIntoView()), !0
            }
            var o = n.blockRange(),
                i = o && zt(o);
            return null != i && (e && e(t.tr.lift(o, i).scrollIntoView()), !0)
        },
        rs = function (t, e) {
            var n = t.selection,
                r = n.$from,
                o = n.$to;
            if (t.selection instanceof ue && t.selection.node.isBlock) return !(!r.parentOffset || !Bt(t.doc, r.pos)) && (e && e(t.tr.split(r.pos).scrollIntoView()), !0);
            if (!r.parent.isBlock) return !1;
            if (e) {
                var i = o.parentOffset == o.parent.content.size,
                    s = t.tr;
                (t.selection instanceof pe || t.selection instanceof de) && s.deleteSelection();
                var a = 0 == r.depth ? null : Zi(r.node(-1).contentMatchAt(r.indexAfter(-1))),
                    c = i && a ? [{
                        type: a
                    }] : void 0,
                    l = Bt(s.doc, s.mapping.map(r.pos), 1, c);
                if (c || l || !Bt(s.doc, s.mapping.map(r.pos), 1, a ? [{
                    type: a
                }] : void 0) || (a && (c = [{
                    type: a
                }]), l = !0), l && (s.split(s.mapping.map(r.pos), 1, c), !i && !r.parentOffset && r.parent.type != a)) {
                    var p = s.mapping.map(r.before()),
                        h = s.doc.resolve(p);
                    a && r.node(-1).canReplaceWith(h.index(), h.index() + 1, a) && s.setNodeMarkup(s.mapping.map(r.before()), a)
                }
                e(s.scrollIntoView())
            }
            return !0
        },
        is = function (t, e) {
            var n, r = t.selection,
                o = r.$from,
                i = r.to,
                s = o.sharedDepth(i);
            return 0 != s && (n = o.before(s), e && e(t.tr.setSelection(ue.create(t.doc, n))), !0)
        },
        ss = function (t, e) {
            return e && e(t.tr.setSelection(new de(t.doc))), !0
        };
    function as(t, e, n) {
        var o, i, s = e.nodeBefore,
            a = e.nodeAfter;
        if (s.type.spec.isolating || a.type.spec.isolating) return !1;
        if (function (t, e, n) {
            var r = e.nodeBefore,
                o = e.nodeAfter,
                i = e.index();
            return !(!(r && o && r.type.compatibleContent(o.type)) || (!r.content.size && e.parent.canReplace(i - 1, i) ? (n && n(t.tr.delete(e.pos - r.nodeSize, e.pos).scrollIntoView()), 0) : !e.parent.canReplace(i, i + 1) || !o.isTextblock && !_t(t.doc, e.pos) || (n && n(t.tr.clearIncompatible(e.pos, r.type, r.contentMatchAt(r.childCount)).join(e.pos).scrollIntoView()), 0)))
        }(t, e, n)) return !0;
        var c = e.parent.canReplace(e.index(), e.index() + 1);
        if (c && (o = (i = s.contentMatchAt(s.childCount)).findWrapping(a.type)) && i.matchType(o[0] || a.type).validEnd) {
            if (n) {
                for (var l = e.pos + a.nodeSize, h = r.empty, u = o.length - 1; u >= 0; u--) h = r.from(o[u].create(null, h));
                h = r.from(s.copy(h));
                var f = t.tr.step(new Et(e.pos - 1, l, e.pos, l, new p(h, 1, 0), o.length, !0)),
                    d = l + 2 * o.length;
                _t(f.doc, d) && f.join(d), n(f.scrollIntoView())
            }
            return !0
        }
        var m = ie.findFrom(e, 1),
            v = m && m.$from.blockRange(m.$to),
            g = v && zt(v);
        if (null != g && g >= e.depth) return n && n(t.tr.lift(v, g).scrollIntoView()), !0;
        if (c && ji(a, "start", !0) && ji(s, "end")) {
            for (var y = s, w = []; w.push(y), !y.isTextblock;) y = y.lastChild;
            for (var b = a, k = 1; !b.isTextblock; b = b.firstChild) k++;
            if (y.canReplace(y.childCount, y.childCount, b.content)) {
                if (n) {
                    for (var x = r.empty, S = w.length - 1; S >= 0; S--) x = r.from(w[S].copy(x));
                    n(t.tr.step(new Et(e.pos - w.length, e.pos + a.nodeSize, e.pos + k, e.pos + a.nodeSize - k, new p(x, w.length, 0), 0, !0)).scrollIntoView())
                }
                return !0
            }
        }
        return !1
    }
    function cs(t) {
        return function (e, n) {
            for (var r = e.selection, o = t < 0 ? r.$from : r.$to, i = o.depth; o.node(i).isInline;) {
                if (!i) return !1;
                i--
            }
            return !!o.node(i).isTextblock && (n && n(e.tr.setSelection(pe.create(e.doc, t < 0 ? o.start(i) : o.end(i)))), !0)
        }
    }
    var ls = cs(-1),
        ps = cs(1);
    function hs(t, e) {
        return void 0 === e && (e = null),
            function (n, r) {
                var o = n.selection,
                    i = o.$from,
                    s = o.$to,
                    a = i.blockRange(s),
                    c = a && Rt(a, t, e);
                return !!c && (r && r(n.tr.wrap(a, c).scrollIntoView()), !0)
            }
    }
    function us(t, e) {
        return void 0 === e && (e = null),
            function (n, r) {
                var o = n.selection,
                    i = o.from,
                    s = o.to,
                    a = !1;
                return n.doc.nodesBetween(i, s, (function (r, o) {
                    if (a) return !1;
                    if (r.isTextblock && !r.hasMarkup(t, e))
                        if (r.type == t) a = !0;
                        else {
                            var i = n.doc.resolve(o),
                                s = i.index();
                            a = i.parent.canReplaceWith(s, s + 1, t)
                        }
                })), !!a && (r && r(n.tr.setBlockType(i, s, t, e).scrollIntoView()), !0)
            }
    }
    function fs(t, e) {
        return void 0 === e && (e = null),
            function (n, r) {
                var o = n.selection,
                    i = o.empty,
                    s = o.$cursor,
                    a = o.ranges;
                if (i && !s || ! function (t, e, n) {
                    for (var r = function (r) {
                        var o = e[r],
                            i = o.$from,
                            s = o.$to,
                            a = 0 == i.depth && t.type.allowsMarkType(n);
                        if (t.nodesBetween(i.pos, s.pos, (function (t) {
                            if (a) return !1;
                            a = t.inlineContent && t.type.allowsMarkType(n)
                        })), a) return {
                            v: !0
                        }
                    }, o = 0; o < e.length; o++) {
                        var i = r(o);
                        if (i) return i.v
                    }
                    return !1
                }(n.doc, a, t)) return !1;
                if (r)
                    if (s) t.isInSet(n.storedMarks || s.marks()) ? r(n.tr.removeStoredMark(t)) : r(n.tr.addStoredMark(t.create(e)));
                    else {
                        for (var c = !1, l = n.tr, p = 0; !c && p < a.length; p++) {
                            var h = a[p],
                                u = h.$from,
                                f = h.$to;
                            c = n.doc.rangeHasMark(u.pos, f.pos, t)
                        }
                        for (var d = 0; d < a.length; d++) {
                            var m = a[d],
                                v = m.$from,
                                g = m.$to;
                            if (c) l.removeMark(v.pos, g.pos, t);
                            else {
                                var y = v.pos,
                                    w = g.pos,
                                    b = v.nodeAfter,
                                    k = g.nodeBefore,
                                    x = b && b.isText ? /^\s*/.exec(b.text)[0].length : 0,
                                    S = k && k.isText ? /\s*$/.exec(k.text)[0].length : 0;
                                y + x < w && (y += x, w -= S), l.addMark(y, w, t.create(e))
                            }
                        }
                        r(l.scrollIntoView())
                    } return !0
            }
    }
    function ds(t, e) {
        return function (n) {
            if (!n.isGeneric) return t(n);
            for (var r = [], o = 0; o < n.mapping.maps.length; o++) {
                for (var i = n.mapping.maps[o], s = 0; s < r.length; s++) r[s] = i.map(r[s]);
                i.forEach((function (t, e, n, o) {
                    return r.push(n, o)
                }))
            }
            for (var a = [], c = 0; c < r.length; c += 2)
                for (var l = r[c], p = r[c + 1], h = n.doc.resolve(l), u = h.sharedDepth(p), f = h.node(u), d = h.indexAfter(u), m = h.after(u + 1); m <= p; ++d) {
                    var v = f.maybeChild(d);
                    if (!v) break;
                    if (d && -1 == a.indexOf(m)) {
                        var g = f.child(d - 1);
                        g.type == v.type && e(g, v) && a.push(m)
                    }
                    m += v.nodeSize
                }
            a.sort((function (t, e) {
                return t - e
            }));
            for (var y = a.length - 1; y >= 0; y--) _t(n.doc, a[y]) && n.join(a[y]);
            t(n)
        }
    }
    function ms() {
        for (var t = [], e = arguments.length; e--;) t[e] = arguments[e];
        return function (e, n, r) {
            for (var o = 0; o < t.length; o++)
                if (t[o](e, n, r)) return !0;
            return !1
        }
    }
    var vs = ms(qi, Li, Wi),
        gs = ms(qi, Ki, Hi),
        ys = {
            Enter: ms(Yi, es, ns, rs),
            "Mod-Enter": ts,
            Backspace: vs,
            "Mod-Backspace": vs,
            "Shift-Backspace": vs,
            Delete: gs,
            "Mod-Delete": gs,
            "Mod-a": ss
        },
        ws = {
            "Ctrl-h": ys.Backspace,
            "Alt-Backspace": ys["Mod-Backspace"],
            "Ctrl-d": ys.Delete,
            "Ctrl-Alt-Backspace": ys["Mod-Delete"],
            "Alt-Delete": ys["Mod-Delete"],
            "Alt-d": ys["Mod-Delete"],
            "Ctrl-a": ls,
            "Ctrl-e": ps
        };
    for (var bs in ys) ws[bs] = ys[bs];
    var ks = ("undefined" != typeof navigator ? /Mac|iP(hone|[oa]d)/.test(navigator.platform) : !("undefined" == typeof os || !os.platform) && "darwin" == os.platform()) ? ws : ys,
        xs = Object.freeze({
            __proto__: null,
            autoJoin: function (t, e) {
                var n = Array.isArray(e) ? function (t) {
                    return e.indexOf(t.type.name) > -1
                } : e;
                return function (e, r, o) {
                    return t(e, r && ds(r, n), o)
                }
            },
            baseKeymap: ks,
            chainCommands: ms,
            createParagraphNear: es,
            deleteSelection: qi,
            exitCode: ts,
            joinBackward: Li,
            joinDown: Qi,
            joinForward: Ki,
            joinUp: Gi,
            lift: Xi,
            liftEmptyBlock: ns,
            macBaseKeymap: ws,
            newlineInCode: Yi,
            pcBaseKeymap: ys,
            selectAll: ss,
            selectNodeBackward: Wi,
            selectNodeForward: Hi,
            selectParentNode: is,
            selectTextblockEnd: ps,
            selectTextblockStart: ls,
            setBlockType: us,
            splitBlock: rs,
            splitBlockKeepMarks: function (t, e) {
                return rs(t, e && function (n) {
                    var r = t.storedMarks || t.selection.$to.parentOffset && t.selection.$from.marks();
                    r && n.ensureMarks(r), e(n)
                })
            },
            toggleMark: fs,
            wrapIn: hs
        }),
        Ss = ["p", 0],
        Ms = ["blockquote", 0],
        Cs = ["hr"],
        Os = ["pre", ["code", 0]],
        Ns = ["br"],
        Ds = {
            doc: {
                content: "block+"
            },
            paragraph: {
                content: "inline*",
                group: "block",
                parseDOM: [{
                    tag: "p"
                }],
                toDOM: function () {
                    return Ss
                }
            },
            blockquote: {
                content: "block+",
                group: "block",
                defining: !0,
                parseDOM: [{
                    tag: "blockquote"
                }],
                toDOM: function () {
                    return Ms
                }
            },
            horizontal_rule: {
                group: "block",
                parseDOM: [{
                    tag: "hr"
                }],
                toDOM: function () {
                    return Cs
                }
            },
            heading: {
                attrs: {
                    level: {
                        default: 1
                    }
                },
                content: "inline*",
                group: "block",
                defining: !0,
                parseDOM: [{
                    tag: "h1",
                    attrs: {
                        level: 1
                    }
                }, {
                    tag: "h2",
                    attrs: {
                        level: 2
                    }
                }, {
                    tag: "h3",
                    attrs: {
                        level: 3
                    }
                }, {
                    tag: "h4",
                    attrs: {
                        level: 4
                    }
                }, {
                    tag: "h5",
                    attrs: {
                        level: 5
                    }
                }, {
                    tag: "h6",
                    attrs: {
                        level: 6
                    }
                }],
                toDOM: function (t) {
                    return ["h" + t.attrs.level, 0]
                }
            },
            code_block: {
                content: "text*",
                marks: "",
                group: "block",
                code: !0,
                defining: !0,
                parseDOM: [{
                    tag: "pre",
                    preserveWhitespace: "full"
                }],
                toDOM: function () {
                    return Os
                }
            },
            text: {
                group: "inline"
            },
            image: {
                inline: !0,
                attrs: {
                    src: {},
                    alt: {
                        default: null
                    },
                    title: {
                        default: null
                    }
                },
                group: "inline",
                draggable: !0,
                parseDOM: [{
                    tag: "img[src]",
                    getAttrs: function (t) {
                        return {
                            src: t.getAttribute("src"),
                            title: t.getAttribute("title"),
                            alt: t.getAttribute("alt")
                        }
                    }
                }],
                toDOM: function (t) {
                    var e = t.attrs;
                    return ["img", {
                        src: e.src,
                        alt: e.alt,
                        title: e.title
                    }]
                }
            },
            hard_break: {
                inline: !0,
                group: "inline",
                selectable: !1,
                parseDOM: [{
                    tag: "br"
                }],
                toDOM: function () {
                    return Ns
                }
            }
        },
        Ts = ["em", 0],
        Unders = ["u", 0],
        code = ["code", 0],
        Es = ["strong", 0],
        As = ["code", 0],
        Is = {
            link: {
                attrs: {
                    href: {},
                    title: {
                        default: null
                    }
                },
                inclusive: !1,
                parseDOM: [{
                    tag: "a[href]",
                    getAttrs: function (t) {
                        return {
                            href: t.getAttribute("href"),
                            title: t.getAttribute("title")
                        }
                    }
                }],
                toDOM: function (t) {
                    var e = t.attrs;
                    return ["a", {
                        href: e.href,
                        title: e.title
                    }, 0]
                }
            },
            em: {
                parseDOM: [{
                    tag: "i"
                }, {
                    tag: "em"
                }, {
                    style: "font-style=italic"
                }],
                toDOM: function () {
                    return Ts
                }
            },
            strong: {
                parseDOM: [{
                    tag: "strong"
                }, {
                    tag: "b",
                    getAttrs: function (t) {
                        return "normal" != t.style.fontWeight && null
                    }
                }, {
                    style: "font-weight",
                    getAttrs: function (t) {
                        return /^(bold(er)?|[5-9]\d{2,})$/.test(t) && null
                    }
                }],
                toDOM: function () {
                    return Es
                }
            },
            under: {
                parseDOM: [{
                    tag: "i"
                }, {
                    tag: "em"
                }, {
                    style: "font-style=italic"
                }],
                toDOM: function () {
                    return Unders
                }
            },
            code: {
                parseDOM: [{
                    tag: "code"
                }],
                toDOM: function () {
                    return As
                }
            }
        },
        zs = new tt({
            nodes: Ds,
            marks: Is
        }),
        Rs = Object.freeze({
            __proto__: null,
            marks: Is,
            nodes: Ds,
            schema: zs
        }),
        Ps = ["ol", 0],
        Bs = ["ul", 0],
        _s = ["li", 0],
        Vs = {
            attrs: {
                order: {
                    default: 1
                }
            },
            parseDOM: [{
                tag: "ol",
                getAttrs: function (t) {
                    return {
                        order: t.hasAttribute("start") ? +t.getAttribute("start") : 1
                    }
                }
            }],
            toDOM: function (t) {
                return 1 == t.attrs.order ? Ps : ["ol", {
                    start: t.attrs.order
                }, 0]
            }
        },
        Fs = {
            parseDOM: [{
                tag: "ul"
            }],
            toDOM: function () {
                return Bs
            }
        },
        $s = {
            parseDOM: [{
                tag: "li"
            }],
            toDOM: function () {
                return _s
            },
            defining: !0
        };
    function qs(t, e) {
        var n = {};
        for (var r in t) n[r] = t[r];
        for (var o in e) n[o] = e[o];
        return n
    }
    function Ls(t, e) {
        return void 0 === e && (e = null),
            function (n, o) {
                var i = n.selection,
                    s = i.$from,
                    a = i.$to,
                    c = s.blockRange(a),
                    l = !1,
                    h = c;
                if (!c) return !1;
                if (c.depth >= 2 && s.node(c.depth - 1).type.compatibleContent(t) && 0 == c.startIndex) {
                    if (0 == s.index(c.depth - 1)) return !1;
                    var u = n.doc.resolve(c.start - 2);
                    h = new D(u, u, c.depth), c.endIndex < c.parent.childCount && (c = new D(s, n.doc.resolve(a.end(c.depth)), c.depth)), l = !0
                }
                var f = Rt(h, t, e, c);
                return !!f && (o && o(function (t, e, n, o, i) {
                    for (var s = r.empty, a = n.length - 1; a >= 0; a--) s = r.from(n[a].type.create(n[a].attrs, s));
                    t.step(new Et(e.start - (o ? 2 : 0), e.end, e.start, e.end, new p(s, 0, 0), n.length, !0));
                    for (var c = 0, l = 0; l < n.length; l++) n[l].type == i && (c = l + 1);
                    for (var h = n.length - c, u = e.start + n.length - (o ? 2 : 0), f = e.parent, d = e.startIndex, m = e.endIndex, v = !0; d < m; d++, v = !1) !v && Bt(t.doc, u, h) && (t.split(u, h), u += 2 * h), u += f.child(d).nodeSize;
                    return t
                }(n.tr, c, f, l, t).scrollIntoView()), !0)
            }
    }
    function js(t) {
        return function (e, n) {
            var o = e.selection,
                i = o.$from,
                s = o.$to,
                a = o.node;
            if (a && a.isBlock || i.depth < 2 || !i.sameParent(s)) return !1;
            var c = i.node(-1);
            if (c.type != t) return !1;
            if (0 == i.parent.content.size && i.node(-1).childCount == i.indexAfter(-1)) {
                if (3 == i.depth || i.node(-3).type != t || i.index(-2) != i.node(-2).childCount - 1) return !1;
                if (n) {
                    for (var l = r.empty, h = i.index(-1) ? 1 : i.index(-2) ? 2 : 3, u = i.depth - h; u >= i.depth - 3; u--) l = r.from(i.node(u).copy(l));
                    var f = i.indexAfter(-1) < i.node(-2).childCount ? 1 : i.indexAfter(-2) < i.node(-3).childCount ? 2 : 3;
                    l = l.append(r.from(t.createAndFill()));
                    var d = i.before(i.depth - (h - 1)),
                        m = e.tr.replace(d, i.after(-f), new p(l, 4 - h, 0)),
                        v = -1;
                    m.doc.nodesBetween(d, m.doc.content.size, (function (t, e) {
                        if (v > -1) return !1;
                        t.isTextblock && 0 == t.content.size && (v = e + 1)
                    })), v > -1 && m.setSelection(ie.near(m.doc.resolve(v))), n(m.scrollIntoView())
                }
                return !0
            }
            var g = s.pos == i.end() ? c.contentMatchAt(0).defaultType : null,
                y = e.tr.delete(i.pos, s.pos),
                w = g ? [null, {
                    type: g
                }] : void 0;
            return !!Bt(y.doc, i.pos, 2, w) && (n && n(y.split(i.pos, 2, w).scrollIntoView()), !0)
        }
    }
    function Ws(t) {
        return function (e, n) {
            var o = e.selection,
                i = o.$from,
                s = o.$to,
                a = i.blockRange(s, (function (e) {
                    return e.childCount > 0 && e.firstChild.type == t
                }));
            return !!a && (!n || (i.node(a.depth - 1).type == t ? function (t, e, n, o) {
                var i = t.tr,
                    s = o.end,
                    a = o.$to.end(o.depth);
                s < a && (i.step(new Et(s - 1, a, s, a, new p(r.from(n.create(null, o.parent.copy())), 1, 0), 1, !0)), o = new D(i.doc.resolve(o.$from.pos), i.doc.resolve(a), o.depth));
                return e(i.lift(o, zt(o)).scrollIntoView()), !0
            }(e, n, t, a) : function (t, e, n) {
                for (var o = t.tr, i = n.parent, s = n.end, a = n.endIndex - 1, c = n.startIndex; a > c; a--) s -= i.child(a).nodeSize, o.delete(s - 1, s + 1);
                var l = o.doc.resolve(n.start),
                    h = l.nodeAfter;
                if (o.mapping.map(n.end) != n.start + l.nodeAfter.nodeSize) return !1;
                var u = 0 == n.startIndex,
                    f = n.endIndex == i.childCount,
                    d = l.node(-1),
                    m = l.index(-1);
                if (!d.canReplace(m + (u ? 0 : 1), m + 1, h.content.append(f ? r.empty : r.from(i)))) return !1;
                var v = l.pos,
                    g = v + h.nodeSize;
                return o.step(new Et(v - (u ? 1 : 0), g + (f ? 1 : 0), v + 1, g - 1, new p((u ? r.empty : r.from(i.copy(r.empty))).append(f ? r.empty : r.from(i.copy(r.empty))), u ? 0 : 1, f ? 0 : 1), u ? 0 : 1)), e(o.scrollIntoView()), !0
            }(e, n, a)))
        }
    }
    function Js(t) {
        return function (e, n) {
            var o = e.selection,
                i = o.$from,
                s = o.$to,
                a = i.blockRange(s, (function (e) {
                    return e.childCount > 0 && e.firstChild.type == t
                }));
            if (!a) return !1;
            var c = a.startIndex;
            if (0 == c) return !1;
            var l = a.parent,
                h = l.child(c - 1);
            if (h.type != t) return !1;
            if (n) {
                var u = h.lastChild && h.lastChild.type == l.type,
                    f = r.from(u ? t.create() : null),
                    d = new p(r.from(t.create(null, r.from(l.type.create(null, f)))), u ? 3 : 1, 0),
                    m = a.start,
                    v = a.end;
                n(e.tr.step(new Et(m - (u ? 3 : 1), v, m, v, d, 1, !0)).scrollIntoView())
            }
            return !0
        }
    }
    var Ks = Object.freeze({
        __proto__: null,
        addListNodes: function (t, e, n) {
            return t.append({
                ordered_list: qs(Vs, {
                    content: "list_item+",
                    group: n
                }),
                bullet_list: qs(Fs, {
                    content: "list_item+",
                    group: n
                }),
                list_item: qs($s, {
                    content: e
                })
            })
        },
        bulletList: Fs,
        liftListItem: Ws,
        listItem: $s,
        orderedList: Vs,
        sinkListItem: Js,
        splitListItem: js,
        wrapInList: Ls
    });
    function Hs(t) {
        return void 0 === t && (t = {}), new Oe({
            view: function (e) {
                return new Us(e, t)
            }
        })
    }
    var Us = function (t, e) {
        var n = this;
        this.editorView = t, this.cursorPos = null, this.element = null, this.timeout = -1, this.width = e.width || 1, this.color = e.color || "black", this.class = e.class, this.handlers = ["dragover", "dragend", "drop", "dragleave"].map((function (e) {
            var r = function (t) {
                n[e](t)
            };
            return t.dom.addEventListener(e, r), {
                name: e,
                handler: r
            }
        }))
    };
    Us.prototype.destroy = function () {
        var t = this;
        this.handlers.forEach((function (e) {
            var n = e.name,
                r = e.handler;
            return t.editorView.dom.removeEventListener(n, r)
        }))
    }, Us.prototype.update = function (t, e) {
        null != this.cursorPos && e.doc != t.state.doc && (this.cursorPos > t.state.doc.content.size ? this.setCursor(null) : this.updateOverlay())
    }, Us.prototype.setCursor = function (t) {
        t != this.cursorPos && (this.cursorPos = t, null == t ? (this.element.parentNode.removeChild(this.element), this.element = null) : this.updateOverlay())
    }, Us.prototype.updateOverlay = function () {
        var t, e = this.editorView.state.doc.resolve(this.cursorPos);
        if (!e.parent.inlineContent) {
            var n = e.nodeBefore,
                r = e.nodeAfter;
            if (n || r) {
                var o = this.editorView.nodeDOM(this.cursorPos - (n ? n.nodeSize : 0)).getBoundingClientRect(),
                    i = n ? o.bottom : o.top;
                n && r && (i = (i + this.editorView.nodeDOM(this.cursorPos).getBoundingClientRect().top) / 2), t = {
                    left: o.left,
                    right: o.right,
                    top: i - this.width / 2,
                    bottom: i + this.width / 2
                }
            }
        }
        if (!t) {
            var s = this.editorView.coordsAtPos(this.cursorPos);
            t = {
                left: s.left - this.width / 2,
                right: s.left + this.width / 2,
                top: s.top,
                bottom: s.bottom
            }
        }
        var a, c, l = this.editorView.dom.offsetParent;
        if (this.element || (this.element = l.appendChild(document.createElement("div")), this.class && (this.element.className = this.class), this.element.style.cssText = "position: absolute; z-index: 50; pointer-events: none; background-color: " + this.color), !l || l == document.body && "static" == getComputedStyle(l).position) a = -pageXOffset, c = -pageYOffset;
        else {
            var p = l.getBoundingClientRect();
            a = p.left - l.scrollLeft, c = p.top - l.scrollTop
        }
        this.element.style.left = t.left - a + "px", this.element.style.top = t.top - c + "px", this.element.style.width = t.right - t.left + "px", this.element.style.height = t.bottom - t.top + "px"
    }, Us.prototype.scheduleRemoval = function (t) {
        var e = this;
        clearTimeout(this.timeout), this.timeout = setTimeout((function () {
            return e.setCursor(null)
        }), t)
    }, Us.prototype.dragover = function (t) {
        if (this.editorView.editable) {
            var e = this.editorView.posAtCoords({
                    left: t.clientX,
                    top: t.clientY
                }),
                n = e && e.inside >= 0 && this.editorView.state.doc.nodeAt(e.inside),
                r = n && n.type.spec.disableDropCursor,
                o = "function" == typeof r ? r(this.editorView, e) : r;
            if (e && !o) {
                var i = e.pos;
                if (this.editorView.dragging && this.editorView.dragging.slice && null == (i = qt(this.editorView.state.doc, i, this.editorView.dragging.slice))) return this.setCursor(null);
                this.setCursor(i), this.scheduleRemoval(5e3)
            }
        }
    }, Us.prototype.dragend = function () {
        this.scheduleRemoval(20)
    }, Us.prototype.drop = function () {
        this.scheduleRemoval(20)
    }, Us.prototype.dragleave = function (t) {
        t.target != this.editorView.dom && this.editorView.dom.contains(t.relatedTarget) || this.setCursor(null)
    };
    var Gs = Object.freeze({
            __proto__: null,
            dropCursor: Hs
        }),
        Qs = function (t) {
            function e(e) {
                t.call(this, e, e)
            }
            return t && (e.__proto__ = t), e.prototype = Object.create(t && t.prototype), e.prototype.constructor = e, e.prototype.map = function (n, r) {
                var o = n.resolve(r.map(this.head));
                return e.valid(o) ? new e(o) : t.near(o)
            }, e.prototype.content = function () {
                return p.empty
            }, e.prototype.eq = function (t) {
                return t instanceof e && t.head == this.head
            }, e.prototype.toJSON = function () {
                return {
                    type: "gapcursor",
                    pos: this.head
                }
            }, e.fromJSON = function (t, n) {
                if ("number" != typeof n.pos) throw new RangeError("Invalid input for GapCursor.fromJSON");
                return new e(t.resolve(n.pos))
            }, e.prototype.getBookmark = function () {
                return new Xs(this.anchor)
            }, e.valid = function (t) {
                var e = t.parent;
                if (e.isTextblock || ! function (t) {
                    for (var e = t.depth; e >= 0; e--) {
                        var n = t.index(e),
                            r = t.node(e);
                        if (0 != n)
                            for (var o = r.child(n - 1);; o = o.lastChild) {
                                if (0 == o.childCount && !o.inlineContent || o.isAtom || o.type.spec.isolating) return !0;
                                if (o.inlineContent) return !1
                            } else if (r.type.spec.isolating) return !0
                    }
                    return !0
                }(t) || ! function (t) {
                    for (var e = t.depth; e >= 0; e--) {
                        var n = t.indexAfter(e),
                            r = t.node(e);
                        if (n != r.childCount)
                            for (var o = r.child(n);; o = o.firstChild) {
                                if (0 == o.childCount && !o.inlineContent || o.isAtom || o.type.spec.isolating) return !0;
                                if (o.inlineContent) return !1
                            } else if (r.type.spec.isolating) return !0
                    }
                    return !0
                }(t)) return !1;
                var n = e.type.spec.allowGapCursor;
                if (null != n) return n;
                var r = e.contentMatchAt(t.index()).defaultType;
                return r && r.isTextblock
            }, e.findGapCursorFrom = function (t, n, r) {
                void 0 === r && (r = !1);
                t: for (;;) {
                    if (!r && e.valid(t)) return t;
                    for (var o = t.pos, i = null, s = t.depth;; s--) {
                        var a = t.node(s);
                        if (n > 0 ? t.indexAfter(s) < a.childCount : t.index(s) > 0) {
                            i = a.child(n > 0 ? t.indexAfter(s) : t.index(s) - 1);
                            break
                        }
                        if (0 == s) return null;
                        o += n;
                        var c = t.doc.resolve(o);
                        if (e.valid(c)) return c
                    }
                    for (;;) {
                        var l = n > 0 ? i.firstChild : i.lastChild;
                        if (!l) {
                            if (i.isAtom && !i.isText && !ue.isSelectable(i)) {
                                t = t.doc.resolve(o + i.nodeSize * n), r = !1;
                                continue t
                            }
                            break
                        }
                        i = l, o += n;
                        var p = t.doc.resolve(o);
                        if (e.valid(p)) return p
                    }
                    return null
                }
            }, e
        }(ie);
    Qs.prototype.visible = !1, Qs.findFrom = Qs.findGapCursorFrom, ie.jsonID("gapcursor", Qs);
    var Xs = function (t) {
        this.pos = t
    };
    function Ys() {
        return new Oe({
            props: {
                decorations: ra,
                createSelectionBetween: function (t, e, n) {
                    return e.pos == n.pos && Qs.valid(n) ? new Qs(n) : null
                },
                handleClick: ea,
                handleKeyDown: Zs,
                handleDOMEvents: {
                    beforeinput: na
                }
            }
        })
    }
    Xs.prototype.map = function (t) {
        return new Xs(t.map(this.pos))
    }, Xs.prototype.resolve = function (t) {
        var e = t.resolve(this.pos);
        return Qs.valid(e) ? new Qs(e) : ie.near(e)
    };
    var Zs = oi({
        ArrowLeft: ta("horiz", -1),
        ArrowRight: ta("horiz", 1),
        ArrowUp: ta("vert", -1),
        ArrowDown: ta("vert", 1)
    });
    function ta(t, e) {
        var n = "vert" == t ? e > 0 ? "down" : "up" : e > 0 ? "right" : "left";
        return function (t, r, o) {
            var i = t.selection,
                s = e > 0 ? i.$to : i.$from,
                a = i.empty;
            if (i instanceof pe) {
                if (!o.endOfTextblock(n) || 0 == s.depth) return !1;
                a = !1, s = t.doc.resolve(e > 0 ? s.after() : s.before())
            }
            var c = Qs.findGapCursorFrom(s, e, a);
            return !!c && (r && r(t.tr.setSelection(new Qs(c))), !0)
        }
    }
    function ea(t, e, n) {
        if (!t || !t.editable) return !1;
        var r = t.state.doc.resolve(e);
        if (!Qs.valid(r)) return !1;
        var o = t.posAtCoords({
            left: n.clientX,
            top: n.clientY
        });
        return !(o && o.inside > -1 && ue.isSelectable(t.state.doc.nodeAt(o.inside))) && (t.dispatch(t.state.tr.setSelection(new Qs(r))), !0)
    }
    function na(t, e) {
        if ("insertCompositionText" != e.inputType || !(t.state.selection instanceof Qs)) return !1;
        var n = t.state.selection.$from,
            o = n.parent.contentMatchAt(n.index()).findWrapping(t.state.schema.nodes.text);
        if (!o) return !1;
        for (var i = r.empty, s = o.length - 1; s >= 0; s--) i = r.from(o[s].createAndFill(null, i));
        var a = t.state.tr.replace(n.pos, n.pos, new p(i, 0, 0));
        return a.setSelection(pe.near(a.doc.resolve(n.pos + 1))), t.dispatch(a), !1
    }
    function ra(t) {
        if (!(t.selection instanceof Qs)) return null;
        var e = document.createElement("div");
        return e.className = "ProseMirror-gapcursor", uo.create(t.doc, [co.widget(t.selection.head, e, {
            key: "gapcursor"
        })])
    }
    var oa = Object.freeze({
        __proto__: null,
        GapCursor: Qs,
        gapCursor: Ys
    });
    function ia() {
        var t = arguments,
            e = arguments[0];
        "string" == typeof e && (e = document.createElement(e));
        var n = 1,
            r = arguments[1];
        if (r && "object" == typeof r && null == r.nodeType && !Array.isArray(r)) {
            for (var o in r)
                if (Object.prototype.hasOwnProperty.call(r, o)) {
                    var i = r[o];
                    "string" == typeof i ? e.setAttribute(o, i) : null != i && (e[o] = i)
                } n++
        }
        for (; n < arguments.length; n++) sa(e, t[n]);
        return e
    }
    function sa(t, e) {
        if ("string" == typeof e) t.appendChild(document.createTextNode(e));
        else if (null == e);
        else if (null != e.nodeType) t.appendChild(e);
        else {
            if (!Array.isArray(e)) throw new RangeError("Unsupported child node: " + e);
            for (var n = 0; n < e.length; n++) sa(t, e[n])
        }
    }
    var aa = "http://www.w3.org/2000/svg",
        ca = "ProseMirror-icon";
    function la(t) {
        var e = document.createElement("div");
        if (e.className = ca, t.path) {
            var n = t.path,
                r = t.width,
                o = t.height,
                i = "pm-icon-" + function (t) {
                    for (var e = 0, n = 0; n < t.length; n++) e = (e << 5) - e + t.charCodeAt(n) | 0;
                    return e
                }(n).toString(16);
            document.getElementById(i) || function (t, e) {
                var n = document.getElementById(ca + "-collection");
                n || ((n = document.createElementNS(aa, "svg")).id = ca + "-collection", n.style.display = "none", document.body.insertBefore(n, document.body.firstChild));
                var r = document.createElementNS(aa, "symbol");
                r.id = t, r.setAttribute("viewBox", "0 0 " + e.width + " " + e.height), r.appendChild(document.createElementNS(aa, "path")).setAttribute("d", e.path), n.appendChild(r)
            }(i, t);
            var s = e.appendChild(document.createElementNS(aa, "svg"));
            s.style.width = r / o + "em", s.appendChild(document.createElementNS(aa, "use")).setAttributeNS("http://www.w3.org/1999/xlink", "href", /([^#]*)/.exec(document.location.toString())[1] + "#" + i)
        } else if (t.dom) e.appendChild(t.dom.cloneNode(!0));
        else {
            var a = t.text,
                c = t.css;
            e.appendChild(document.createElement("span")).textContent = a || "", c && (e.firstChild.style.cssText = c)
        }
        return e
    }
    var pa = "ProseMirror-menu",
        ha = function (t) {
            this.spec = t
        };
    function ua(t, e) {
        return t._props.translate ? t._props.translate(e) : e
    }
    ha.prototype.render = function (t) {
        var e = this.spec,
            n = e.render ? e.render(t) : e.icon ? la(e.icon) : e.label ? ia("div", null, ua(t, e.label)) : null;
        if (!n) throw new RangeError("MenuItem without icon or label property");
        if (e.title) {
            var r = "function" == typeof e.title ? e.title(t.state) : e.title;
            n.setAttribute("title", ua(t, r))
        }
        return e.class && n.classList.add(e.class), e.css && (n.style.cssText += e.css), n.addEventListener("mousedown", (function (r) {
            r.preventDefault(), n.classList.contains(pa + "-disabled") || e.run(t.state, t.dispatch, t, r)
        })), {
            dom: n,
            update: function (t) {
                if (e.select) {
                    var r = e.select(t);
                    if (n.style.display = r ? "" : "none", !r) return !1
                }
                var o = !0;
                if (e.enable && (o = e.enable(t) || !1, Ta(n, pa + "-disabled", !o)), e.active) {
                    var i = o && e.active(t) || !1;
                    Ta(n, pa + "-active", i)
                }
                return !0
            }
        }
    };
    var fa = {
        time: 0,
        node: null
    };
    function da(t) {
        fa.time = Date.now(), fa.node = t.target
    }
    function ma(t) {
        return Date.now() - 100 < fa.time && fa.node && t.contains(fa.node)
    }
    var va = function (t, e) {
        void 0 === e && (e = {}), this.options = e, this.options = e || {}, this.content = Array.isArray(t) ? t : [t]
    };
    function ga(t, e) {
        for (var n = [], r = [], o = 0; o < t.length; o++) {
            var i = t[o].render(e),
                s = i.dom,
                a = i.update;
            n.push(ia("div", {
                class: pa + "-dropdown-item"
            }, s)), r.push(a)
        }
        return {
            dom: n,
            update: ya(r, n)
        }
    }
    function ya(t, e) {
        return function (n) {
            for (var r = !1, o = 0; o < t.length; o++) {
                var i = t[o](n);
                e[o].style.display = i ? "" : "none", i && (r = !0)
            }
            return r
        }
    }
    va.prototype.render = function (t) {
        var e = this,
            n = ga(this.content, t),
            r = ia("div", {
                class: pa + "-dropdown " + (this.options.class || ""),
                style: this.options.css
            }, ua(t, this.options.label || ""));
        this.options.title && r.setAttribute("title", ua(t, this.options.title));
        var o = ia("div", {
                class: pa + "-dropdown-wrap"
            }, r),
            i = null,
            s = null,
            a = function () {
                i && i.close() && (i = null, window.removeEventListener("mousedown", s))
            };
        return r.addEventListener("mousedown", (function (t) {
            t.preventDefault(), da(t), i ? a() : (i = e.expand(o, n.dom), window.addEventListener("mousedown", s = function () {
                ma(o) || a()
            }))
        })), {
            dom: o,
            update: function (t) {
                var e = n.update(t);
                return o.style.display = e ? "" : "none", e
            }
        }
    }, va.prototype.expand = function (t, e) {
        var n = ia("div", {
                class: pa + "-dropdown-menu " + (this.options.class || "")
            }, e),
            r = !1;
        return t.appendChild(n), {
            close: function () {
                if (!r) return r = !0, t.removeChild(n), !0
            },
            node: n
        }
    };
    var wa = function (t, e) {
        void 0 === e && (e = {}), this.options = e, this.content = Array.isArray(t) ? t : [t]
    };
    function ba(t, e) {
        for (var n = document.createDocumentFragment(), r = [], o = [], i = 0; i < e.length; i++) {
            for (var s = e[i], a = [], c = [], l = 0; l < s.length; l++) {
                var p = s[l].render(t),
                    h = p.dom,
                    u = p.update,
                    f = ia("span", {
                        class: pa + "item"
                    }, h);
                n.appendChild(f), c.push(f), a.push(u)
            }
            a.length && (r.push(ya(a, c)), i < e.length - 1 && o.push(n.appendChild(ia("span", {
                class: pa + "separator"
            }))))
        }
        return {
            dom: n,
            update: function (t) {
                for (var e = !1, n = !1, i = 0; i < r.length; i++) {
                    var s = r[i](t);
                    i && (o[i - 1].style.display = n && s ? "" : "none"), n = s, s && (e = !0)
                }
                return e
            }
        }
    }
    wa.prototype.render = function (t) {
        var e = ga(this.content, t),
            n = ia("div", {
                class: pa + "-submenu-label"
            }, ua(t, this.options.label || "")),
            r = ia("div", {
                class: pa + "-submenu-wrap"
            }, n, ia("div", {
                class: pa + "-submenu"
            }, e.dom)),
            o = null;
        return n.addEventListener("mousedown", (function (t) {
            t.preventDefault(), da(t), Ta(r, pa + "-submenu-wrap-active", !1), o || window.addEventListener("mousedown", o = function () {
                ma(r) || (r.classList.remove(pa + "-submenu-wrap-active"), window.removeEventListener("mousedown", o), o = null)
            })
        })), {
            dom: r,
            update: function (t) {
                var n = e.update(t);
                return r.style.display = n ? "" : "none", n
            }
        }
    };
    var ka = {
            join: {
                width: 800,
                height: 900,
                path: "M0 75h800v125h-800z M0 825h800v-125h-800z M250 400h100v-100h100v100h100v100h-100v100h-100v-100h-100z"
            },
            lift: {
                width: 1024,
                height: 1024,
                path: "M219 310v329q0 7-5 12t-12 5q-8 0-13-5l-164-164q-5-5-5-13t5-13l164-164q5-5 13-5 7 0 12 5t5 12zM1024 749v109q0 7-5 12t-12 5h-987q-7 0-12-5t-5-12v-109q0-7 5-12t12-5h987q7 0 12 5t5 12zM1024 530v109q0 7-5 12t-12 5h-621q-7 0-12-5t-5-12v-109q0-7 5-12t12-5h621q7 0 12 5t5 12zM1024 310v109q0 7-5 12t-12 5h-621q-7 0-12-5t-5-12v-109q0-7 5-12t12-5h621q7 0 12 5t5 12zM1024 91v109q0 7-5 12t-12 5h-987q-7 0-12-5t-5-12v-109q0-7 5-12t12-5h987q7 0 12 5t5 12z"
            },
            selectParentNode: {
                text: "⬚",
                css: "font-weight: bold"
            },
            undo: {
                width: 1024,
                height: 1024,
                path: "M761 1024c113-206 132-520-313-509v253l-384-384 384-384v248c534-13 594 472 313 775z"
            },
            redo: {
                width: 1024,
                height: 1024,
                path: "M576 248v-248l384 384-384 384v-253c-446-10-427 303-313 509-280-303-221-789 313-775z"
            },
            strong: {
                width: 805,
                height: 1024,
                path: "M317 869q42 18 80 18 214 0 214-191 0-65-23-102-15-25-35-42t-38-26-46-14-48-6-54-1q-41 0-57 5 0 30-0 90t-0 90q0 4-0 38t-0 55 2 47 6 38zM309 442q24 4 62 4 46 0 81-7t62-25 42-51 14-81q0-40-16-70t-45-46-61-24-70-8q-28 0-74 7 0 28 2 86t2 86q0 15-0 45t-0 45q0 26 0 39zM0 950l1-53q8-2 48-9t60-15q4-6 7-15t4-19 3-18 1-21 0-19v-37q0-561-12-585-2-4-12-8t-25-6-28-4-27-2-17-1l-2-47q56-1 194-6t213-5q13 0 39 0t38 0q40 0 78 7t73 24 61 40 42 59 16 78q0 29-9 54t-22 41-36 32-41 25-48 22q88 20 146 76t58 141q0 57-20 102t-53 74-78 48-93 27-100 8q-25 0-75-1t-75-1q-60 0-175 6t-132 6z"
            },
            em: {
                width: 585,
                height: 1024,
                path: "M0 949l9-48q3-1 46-12t63-21q16-20 23-57 0-4 35-165t65-310 29-169v-14q-13-7-31-10t-39-4-33-3l10-58q18 1 68 3t85 4 68 1q27 0 56-1t69-4 56-3q-2 22-10 50-17 5-58 16t-62 19q-4 10-8 24t-5 22-4 26-3 24q-15 84-50 239t-44 203q-1 5-7 33t-11 51-9 47-3 32l0 10q9 2 105 17-1 25-9 56-6 0-18 0t-18 0q-16 0-49-5t-49-5q-78-1-117-1-29 0-81 5t-69 6z"
            },
            code: {
                width: 896,
                height: 1024,
                path: "M608 192l-96 96 224 224-224 224 96 96 288-320-288-320zM288 192l-288 320 288 320 96-96-224-224 224-224-96-96z"
            },
            link: {
                width: 951,
                height: 1024,
                path: "M832 694q0-22-16-38l-118-118q-16-16-38-16-24 0-41 18 1 1 10 10t12 12 8 10 7 14 2 15q0 22-16 38t-38 16q-8 0-15-2t-14-7-10-8-12-12-10-10q-18 17-18 41 0 22 16 38l117 118q15 15 38 15 22 0 38-14l84-83q16-16 16-38zM430 292q0-22-16-38l-117-118q-16-16-38-16-22 0-38 15l-84 83q-16 16-16 38 0 22 16 38l118 118q15 15 38 15 24 0 41-17-1-1-10-10t-12-12-8-10-7-14-2-15q0-22 16-38t38-16q8 0 15 2t14 7 10 8 12 12 10 10q18-17 18-41zM941 694q0 68-48 116l-84 83q-47 47-116 47-69 0-116-48l-117-118q-47-47-47-116 0-70 50-119l-50-50q-49 50-118 50-68 0-116-48l-118-118q-48-48-48-116t48-116l84-83q47-47 116-47 69 0 116 48l117 118q47 47 47 116 0 70-50 119l50 50q49-50 118-50 68 0 116 48l118 118q48 48 48 116z"
            },
            bulletList: {
                width: 768,
                height: 896,
                path: "M0 512h128v-128h-128v128zM0 256h128v-128h-128v128zM0 768h128v-128h-128v128zM256 512h512v-128h-512v128zM256 256h512v-128h-512v128zM256 768h512v-128h-512v128z"
            },
            orderedList: {
                width: 768,
                height: 896,
                path: "M320 512h448v-128h-448v128zM320 768h448v-128h-448v128zM320 128v128h448v-128h-448zM79 384h78v-256h-36l-85 23v50l43-2v185zM189 590c0-36-12-78-96-78-33 0-64 6-83 16l1 66c21-10 42-15 67-15s32 11 32 28c0 26-30 58-110 112v50h192v-67l-91 2c49-30 87-66 87-113l1-1z"
            },
            blockquote: {
                width: 640,
                height: 896,
                path: "M0 448v256h256v-256h-128c0 0 0-128 128-128v-128c0 0-256 0-256 256zM640 320v-128c0 0-256 0-256 256v256h256v-256h-128c0 0 0-128 128-128z"
            }
        },
        xa = new ha({
            title: "Join with above block",
            run: Gi,
            select: function (t) {
                return Gi(t)
            },
            icon: ka.join
        }),
        Sa = new ha({
            title: "Lift out of enclosing block",
            run: Xi,
            select: function (t) {
                return Xi(t)
            },
            icon: ka.lift
        }),
        Ma = new ha({
            title: "Select parent node",
            run: is,
            select: function (t) {
                return is(t)
            },
            icon: ka.selectParentNode
        }),
        Ca = new ha({
            title: "Undo last change",
            run: Vi,
            enable: function (t) {
                return Vi(t)
            },
            icon: ka.undo
        }),
        Oa = new ha({
            title: "Redo last undone change",
            run: Fi,
            enable: function (t) {
                return Fi(t)
            },
            icon: ka.redo
        });
    function Na(t, e) {
        var n = {
            run: function (n, r) {
                return hs(t, e.attrs)(n, r)
            },
            select: function (n) {
                return hs(t, e.attrs)(n)
            }
        };
        for (var r in e) n[r] = e[r];
        return new ha(n)
    }
    function Da(t, e) {
        var n = us(t, e.attrs),
            r = {
                run: n,
                enable: function (t) {
                    return n(t)
                },
                active: function (n) {
                    var r = n.selection,
                        o = r.$from,
                        i = r.to,
                        s = r.node;
                    return s ? s.hasMarkup(t, e.attrs) : i <= o.end() && o.parent.hasMarkup(t, e.attrs)
                }
            };
        for (var o in e) r[o] = e[o];
        return new ha(r)
    }
    function Ta(t, e, n) {
        n ? t.classList.add(e) : t.classList.remove(e)
    }
    var Ea = "ProseMirror-menubar";
    function Aa(t) {
        return new Oe({
            view: function (e) {
                return new Ia(e, t)
            }
        })
    }
    var Ia = function (t, e) {
        var n = this;
        this.editorView = t, this.options = e, this.spacer = null, this.maxHeight = 0, this.widthForMaxHeight = 0, this.floating = !1, this.scrollHandler = null, this.wrapper = ia("div", {
            class: Ea + "-wrapper"
        }), this.menu = this.wrapper.appendChild(ia("div", {
            class: Ea
        })), this.menu.className = Ea, t.dom.parentNode && t.dom.parentNode.replaceChild(this.wrapper, t.dom), this.wrapper.appendChild(t.dom);
        var r = ba(this.editorView, this.options.content),
            o = r.dom,
            i = r.update;
        if (this.contentUpdate = i, this.menu.appendChild(o), this.update(), e.floating && ! function () {
            if ("undefined" == typeof navigator) return !1;
            var t = navigator.userAgent;
            return !/Edge\/\d/.test(t) && /AppleWebKit/.test(t) && /Mobile\/\w+/.test(t)
        }()) {
            this.updateFloat();
            var s = function (t) {
                for (var e = [window], n = t.parentNode; n; n = n.parentNode) e.push(n);
                return e
            }(this.wrapper);
            this.scrollHandler = function (t) {
                var e = n.editorView.root;
                (e.body || e).contains(n.wrapper) ? n.updateFloat(t.target.getBoundingClientRect ? t.target : void 0) : s.forEach((function (t) {
                    return t.removeEventListener("scroll", n.scrollHandler)
                }))
            }, s.forEach((function (t) {
                return t.addEventListener("scroll", n.scrollHandler)
            }))
        }
    };
    Ia.prototype.update = function () {
        this.contentUpdate(this.editorView.state), this.floating ? this.updateScrollCursor() : (this.menu.offsetWidth != this.widthForMaxHeight && (this.widthForMaxHeight = this.menu.offsetWidth, this.maxHeight = 0), this.menu.offsetHeight > this.maxHeight && (this.maxHeight = this.menu.offsetHeight, this.menu.style.minHeight = this.maxHeight + "px"))
    }, Ia.prototype.updateScrollCursor = function () {
        var t = this.editorView.root.getSelection();
        if (t.focusNode) {
            var e = t.getRangeAt(0).getClientRects(),
                n = e[function (t) {
                    if (t.anchorNode == t.focusNode) return t.anchorOffset > t.focusOffset;
                    return t.anchorNode.compareDocumentPosition(t.focusNode) == Node.DOCUMENT_POSITION_FOLLOWING
                }(t) ? 0 : e.length - 1];
            if (n) {
                var r = this.menu.getBoundingClientRect();
                if (n.top < r.bottom && n.bottom > r.top) {
                    var o = function (t) {
                        for (var e = t.parentNode; e; e = e.parentNode)
                            if (e.scrollHeight > e.clientHeight) return e
                    }(this.wrapper);
                    o && (o.scrollTop -= r.bottom - n.top)
                }
            }
        }
    }, Ia.prototype.updateFloat = function (t) {
        var e = this.wrapper,
            n = e.getBoundingClientRect(),
            r = t ? Math.max(0, t.getBoundingClientRect().top) : 0;
        if (this.floating)
            if (n.top >= r || n.bottom < this.menu.offsetHeight + 10) this.floating = !1, this.menu.style.position = this.menu.style.left = this.menu.style.top = this.menu.style.width = "", this.menu.style.display = "", this.spacer.parentNode.removeChild(this.spacer), this.spacer = null;
            else {
                var o = (e.offsetWidth - e.clientWidth) / 2;
                this.menu.style.left = n.left + o + "px", this.menu.style.display = n.top > window.innerHeight ? "none" : "", t && (this.menu.style.top = r + "px")
            }
        else if (n.top < r && n.bottom >= this.menu.offsetHeight + 10) {
            this.floating = !0;
            var i = this.menu.getBoundingClientRect();
            this.menu.style.left = i.left + "px", this.menu.style.width = i.width + "px", t && (this.menu.style.top = r + "px"), this.menu.style.position = "fixed", this.spacer = ia("div", {
                class: Ea + "-spacer",
                style: "height: " + i.height + "px"
            }), e.insertBefore(this.spacer, this.menu)
        }
    }, Ia.prototype.destroy = function () {
        this.wrapper.parentNode && this.wrapper.parentNode.replaceChild(this.editorView.dom, this.wrapper)
    };
    var za = Object.freeze({
            __proto__: null,
            Dropdown: va,
            DropdownSubmenu: wa,
            MenuItem: ha,
            blockTypeItem: Da,
            icons: ka,
            joinUpItem: xa,
            liftItem: Sa,
            menuBar: Aa,
            redoItem: Oa,
            renderGrouped: ba,
            selectParentNodeItem: Ma,
            undoItem: Ca,
            wrapItem: Na
        }),
        Ra = "ProseMirror-prompt";
    function Pa(t) {
        var e = document.body.appendChild(document.createElement("div"));
        e.className = Ra;
        var n = function (t) {
            e.contains(t.target) || r()
        };
        setTimeout((function () {
            return window.addEventListener("mousedown", n)
        }), 50);
        var r = function () {
                window.removeEventListener("mousedown", n), e.parentNode && e.parentNode.removeChild(e)
            },
            o = [];
        for (var i in t.fields) o.push(t.fields[i].render());
        var s = document.createElement("button");
        s.type = "submit", s.className = Ra + "-submit", s.textContent = "OK";
        var a = document.createElement("button");
        a.type = "button", a.className = Ra + "-cancel", a.textContent = "Cancel", a.addEventListener("click", r);
        var c = e.appendChild(document.createElement("form"));
        t.title && (c.appendChild(document.createElement("h5")).textContent = t.title), o.forEach((function (t) {
            c.appendChild(document.createElement("div")).appendChild(t)
        }));
        var l = c.appendChild(document.createElement("div"));
        l.className = Ra + "-buttons", l.appendChild(s), l.appendChild(document.createTextNode(" ")), l.appendChild(a);
        var p = e.getBoundingClientRect();
        e.style.top = (window.innerHeight - p.height) / 2 + "px", e.style.left = (window.innerWidth - p.width) / 2 + "px";
        var h = function () {
            var e = function (t, e) {
                var n = Object.create(null),
                    r = 0;
                for (var o in t) {
                    var i = t[o],
                        s = e[r++],
                        a = i.read(s),
                        c = i.validate(a);
                    if (c) return Ba(s, c), null;
                    n[o] = i.clean(a)
                }
                return n
            }(t.fields, o);
            e && (r(), t.callback(e))
        };
        c.addEventListener("submit", (function (t) {
            t.preventDefault(), h()
        })), c.addEventListener("keydown", (function (t) {
            27 == t.keyCode ? (t.preventDefault(), r()) : 13 != t.keyCode || t.ctrlKey || t.metaKey || t.shiftKey ? 9 == t.keyCode && window.setTimeout((function () {
                e.contains(document.activeElement) || r()
            }), 500) : (t.preventDefault(), h())
        }));
        var u = c.elements[0];
        u && u.focus()
    }
    function Ba(t, e) {
        var n = t.parentNode,
            r = n.appendChild(document.createElement("div"));
        r.style.left = t.offsetLeft + t.offsetWidth + 2 + "px", r.style.top = t.offsetTop - 5 + "px", r.className = "ProseMirror-invalid", r.textContent = e, setTimeout((function () {
            return n.removeChild(r)
        }), 1500)
    }
    var _a = function (t) {
        this.options = t
    };
    _a.prototype.read = function (t) {
        return t.value
    }, _a.prototype.validateType = function (t) {
        return null
    }, _a.prototype.validate = function (t) {
        return !t && this.options.required ? "Required field" : this.validateType(t) || (this.options.validate ? this.options.validate(t) : null)
    }, _a.prototype.clean = function (t) {
        return this.options.clean ? this.options.clean(t) : t
    };
    var Va = function (t) {
        function e() {
            t.apply(this, arguments)
        }
        return t && (e.__proto__ = t), e.prototype = Object.create(t && t.prototype), e.prototype.constructor = e, e.prototype.render = function () {
            var t = document.createElement("input");
            return t.type = "text", t.placeholder = this.options.label, t.value = this.options.value || "", t.autocomplete = "off", t
        }, e
    }(_a);
    function Fa(t, e) {
        for (var n = t.selection.$from, r = n.depth; r >= 0; r--) {
            var o = n.index(r);
            if (n.node(r).canReplaceWith(o, o, e)) return !0
        }
        return !1
    }
    function $a(t, e) {
        var n = {
            label: e.title,
            run: t
        };
        for (var r in e) n[r] = e[r];
        return e.enable || e.select || (n[e.enable ? "enable" : "select"] = function (e) {
            return t(e)
        }), new ha(n)
    }
    function qa(t, e) {
        var n = t.selection,
            r = n.from,
            o = n.$from,
            i = n.to;
        return n.empty ? !!e.isInSet(t.storedMarks || o.marks()) : t.doc.rangeHasMark(r, i, e)
    }
    function La(t, e) {
        var n = {
            active: function (e) {
                return qa(e, t)
            }
        };
        for (var r in e) n[r] = e[r];
        return $a(fs(t), n)
    }
    function ja(t, e) {
        return $a(Ls(t, e.attrs), e)
    }
    function Wa(t) {
        var e, n, r, o, i = {};
        if ((e = t.marks.strong) && (i.toggleStrong = La(e, {
            title: "Toggle strong style",
            icon: ka.strong
        })), (e = t.marks.em) && (i.toggleEm = La(e, {
            title: "Toggle emphasis",
            icon: ka.em
        })), (e = t.marks.code) && (i.toggleCode = La(e, {
            title: "Toggle code font",
            icon: ka.code
        })), (e = t.marks.link) && (i.toggleLink = (n = e, new ha({
            title: "Add or remove link",
            icon: ka.link,
            active: function (t) {
                return qa(t, n)
            },
            enable: function (t) {
                return !t.selection.empty
            },
            run: function (t, e, r) {
                if (qa(t, n)) return fs(n)(t, e), !0;
                Pa({
                    title: "Create a link",
                    fields: {
                        href: new Va({
                            label: "Link target",
                            required: !0
                        }),
                        title: new Va({
                            label: "Title"
                        })
                    },
                    callback: function (t) {
                        fs(n, t)(r.state, r.dispatch), r.focus()
                    }
                })
            }
        }))), (r = t.nodes.image) && (i.insertImage = (o = r, new ha({
            title: "Insert image",
            label: "Image",
            enable: function (t) {
                return Fa(t, o)
            },
            run: function (t, e, n) {
                var r = t.selection,
                    i = r.from,
                    s = r.to,
                    a = null;
                t.selection instanceof ue && t.selection.node.type == o && (a = t.selection.node.attrs), Pa({
                    title: "Insert image",
                    fields: {
                        src: new Va({
                            label: "Location",
                            required: !0,
                            value: a && a.src
                        }),
                        title: new Va({
                            label: "Title",
                            value: a && a.title
                        }),
                        alt: new Va({
                            label: "Description",
                            value: a ? a.alt : t.doc.textBetween(i, s, " ")
                        })
                    },
                    callback: function (t) {
                        n.dispatch(n.state.tr.replaceSelectionWith(o.createAndFill(t))), n.focus()
                    }
                })
            }
        }))), (r = t.nodes.bullet_list) && (i.wrapBulletList = ja(r, {
            title: "Wrap in bullet list",
            icon: ka.bulletList
        })), (r = t.nodes.ordered_list) && (i.wrapOrderedList = ja(r, {
            title: "Wrap in ordered list",
            icon: ka.orderedList
        })), (r = t.nodes.blockquote) && (i.wrapBlockQuote = Na(r, {
            title: "Wrap in block quote",
            icon: ka.blockquote
        })), (r = t.nodes.paragraph) && (i.makeParagraph = Da(r, {
            title: "Change to paragraph",
            label: "Plain"
        })), (r = t.nodes.code_block) && (i.makeCodeBlock = Da(r, {
            title: "Change to code block",
            label: "Code"
        })), r = t.nodes.heading)
            for (var s = 1; s <= 10; s++) i["makeHead" + s] = Da(r, {
                title: "Change to heading " + s,
                label: "Level " + s,
                attrs: {
                    level: s
                }
            });
        if (r = t.nodes.horizontal_rule) {
            var a = r;
            i.insertHorizontalRule = new ha({
                title: "Insert horizontal rule",
                label: "Horizontal rule",
                enable: function (t) {
                    return Fa(t, a)
                },
                run: function (t, e) {
                    e(t.tr.replaceSelectionWith(a.create()))
                }
            })
        }
        var c = function (t) {
            return t.filter((function (t) {
                return t
            }))
        };
        return i.insertMenu = new va(c([i.insertImage, i.insertHorizontalRule]), {
            label: "Insert"
        }), i.typeMenu = new va(c([i.makeParagraph, i.makeCodeBlock, i.makeHead1 && new wa(c([i.makeHead1, i.makeHead2, i.makeHead3, i.makeHead4, i.makeHead5, i.makeHead6]), {
            label: "Heading"
        })]), {
            label: "Type..."
        }), i.inlineMenu = [c([i.toggleStrong, i.toggleEm, i.toggleCode, i.toggleLink])], i.blockMenu = [c([i.wrapBulletList, i.wrapOrderedList, i.wrapBlockQuote, xa, Sa, Ma])], i.fullMenu = i.inlineMenu.concat([
            [i.insertMenu, i.typeMenu]
        ], [
            [Ca, Oa]
        ], i.blockMenu), i
    }
    var Ja = "undefined" != typeof navigator && /Mac|iP(hone|[oa]d)/.test(navigator.platform);
    function Ka(t, e) {
        var n, r = {};
        function o(t, n) {
            if (e) {
                var o = e[t];
                if (!1 === o) return;
                o && (t = o)
            }
            r[t] = n
        }
        if (o("Mod-z", Vi), o("Shift-Mod-z", Fi), o("Backspace", li), Ja || o("Mod-y", Fi), o("Alt-ArrowUp", Gi), o("Alt-ArrowDown", Qi), o("Mod-BracketLeft", Xi), o("Escape", is), (n = t.marks.strong) && (o("Mod-b", fs(n)), o("Mod-B", fs(n))), (n = t.marks.em) && (o("Mod-i", fs(n)), o("Mod-I", fs(n))), (n = t.marks.code) && o("Mod-`", fs(n)), (n = t.nodes.bullet_list) && o("Shift-Ctrl-8", Ls(n)), (n = t.nodes.ordered_list) && o("Shift-Ctrl-9", Ls(n)), (n = t.nodes.blockquote) && o("Ctrl->", hs(n)), n = t.nodes.hard_break) {
            var i = n,
                s = ms(ts, (function (t, e) {
                    return e && e(t.tr.replaceSelectionWith(i.create()).scrollIntoView()), !0
                }));
            o("Mod-Enter", s), o("Shift-Enter", s), Ja && o("Ctrl-Enter", s)
        }
        if ((n = t.nodes.list_item) && (o("Enter", js(n)), o("Mod-[", Ws(n)), o("Mod-]", Js(n))), (n = t.nodes.paragraph) && o("Shift-Ctrl-0", us(n)), (n = t.nodes.code_block) && o("Shift-Ctrl-\\", us(n)), n = t.nodes.heading)
            for (var a = 1; a <= 6; a++) o("Shift-Ctrl-" + a, us(n, {
                level: a
            }));
        if (n === t.nodes.horizontal_rule) {
            var c = n;
            o("Mod-_", (function (t, e) {
                return e && e(t.tr.replaceSelectionWith(c.create()).scrollIntoView()), !0
            }))
        }
        return r
    }
    function Ha(t) {
        var e, n = vi.concat(hi, pi);
        return (e = t.nodes.blockquote) && n.push(gi(/^\s*>\s$/, e)), (e = t.nodes.ordered_list) && n.push(function (t) {
            return gi(/^(\d+)\.\s$/, t, (function (t) {
                return {
                    order: +t[1]
                }
            }), (function (t, e) {
                return e.childCount + e.attrs.order === +t[1]
            }))
        }(e)), (e = t.nodes.bullet_list) && n.push(function (t) {
            return gi(/^\s*([-+*])\s$/, t)
        }(e)), (e = t.nodes.code_block) && n.push(function (t) {
            return yi(/^```$/, t)
        }(e)), (e = t.nodes.heading) && n.push(function (t, e) {
            return yi(new RegExp("^(#{1," + e + "})\\s$"), t, (function (t) {
                return {
                    level: t[1].length
                }
            }))
        }(e, 6)), ai({
            rules: n
        })
    }
    var Ua = Object.freeze({
        __proto__: null,
        buildInputRules: Ha,
        buildKeymap: Ka,
        buildMenuItems: Wa,
        exampleSetup: function (t) {
            var e = [Ha(t.schema), ri(Ka(t.schema, t.mapKeys)), ri(ks), Hs(), Ys()];
            return !1 !== t.menuBar && e.push(Aa({
                floating: !1 !== t.floatingMenu,
                content: t.menuContent || Wa(t.schema).fullMenu
            })), !1 !== t.history && e.push(_i()), e.concat(new Oe({
                props: {
                    attributes: {
                        class: "ProseMirror-example-setup-style"
                    }
                }
            }))
        }
    });
    window.PM = {
        model: vt,
        transform: re,
        state: Ee,
        view: jo,
        keymap: ii,
        inputrules: wi,
        history: $i,
        commands: xs,
        schema_basic: Rs,
        schema_list: Ks,
        dropcursor: Gs,
        menu: za,
        example_setup: Ua,
        gapcursor: oa
    }
}();


let style = document.createElement('style');
style.innerText = "*{\n" +
    "  padding: 0;\n" +
    "}\n" +
    ".ProseMirror {\n" +
    "  position: relative;\n" +
    "}\n" +
    "\n" +
    ".ProseMirror {\n" +
    "  word-wrap: break-word;\n" +
    "  white-space: pre-wrap;\n" +
    "  white-space: break-spaces;\n" +
    "  -webkit-font-variant-ligatures: none;\n" +
    "  font-variant-ligatures: none;\n" +
    "  font-feature-settings: \"liga\" 0; /* the above doesn't seem to work in Edge */\n" +
    "}\n" +
    "\n" +
    ".ProseMirror pre {\n" +
    "  white-space: pre-wrap;\n" +
    "}\n" +
    "\n" +
    ".ProseMirror li {\n" +
    "  position: relative;\n" +
    "}\n" +
    "\n" +
    ".ProseMirror-hideselection *::selection { background: transparent; }\n" +
    ".ProseMirror-hideselection *::-moz-selection { background: transparent; }\n" +
    ".ProseMirror-hideselection { caret-color: transparent; }\n" +
    "\n" +
    ".ProseMirror-selectednode {\n" +
    "  outline: 2px solid #8cf;\n" +
    "}\n" +
    "\n" +
    "/* Make sure li selections wrap around markers */\n" +
    "\n" +
    "li.ProseMirror-selectednode {\n" +
    "  outline: none;\n" +
    "}\n" +
    "\n" +
    "li.ProseMirror-selectednode:after {\n" +
    "  content: \"\";\n" +
    "  position: absolute;\n" +
    "  left: -32px;\n" +
    "  right: -2px; top: -2px; bottom: -2px;\n" +
    "  border: 2px solid #8cf;\n" +
    "  pointer-events: none;\n" +
    "}\n" +
    "\n" +
    "/* Protect against generic img rules */\n" +
    "\n" +
    "img.ProseMirror-separator {\n" +
    "  display: inline !important;\n" +
    "  border: none !important;\n" +
    "  margin: 0 !important;\n" +
    "}\n" +
    ".ProseMirror-textblock-dropdown {\n" +
    "  min-width: 3em;\n" +
    "}\n" +
    "\n" +
    ".ProseMirror-menu {\n" +
    "  margin: 0 -4px;\n" +
    "  line-height: 1;\n" +
    "}\n" +
    "\n" +
    ".ProseMirror-tooltip .ProseMirror-menu {\n" +
    "  width: -webkit-fit-content;\n" +
    "  width: fit-content;\n" +
    "  white-space: pre;\n" +
    "}\n" +
    "\n" +
    ".ProseMirror-menuitem {\n" +
    "  margin-right: 3px;\n" +
    "  display: inline-block;\n" +
    "}\n" +
    "\n" +
    ".ProseMirror-menuseparator {\n" +
    "  border-right: 1px solid #ddd;\n" +
    "  margin-right: 3px;\n" +
    "}\n" +
    "\n" +
    ".ProseMirror-menu-dropdown, .ProseMirror-menu-dropdown-menu {\n" +
    "  font-size: 90%;\n" +
    "  white-space: nowrap;\n" +
    "  max-height: 200px;\n" +
    "  overflow: auto;\n" +
    "}\n" +
    "\n" +
    ".ProseMirror-menu-dropdown {\n" +
    "  vertical-align: 1px;\n" +
    "  cursor: pointer;\n" +
    "  position: relative;\n" +
    "  padding-right: 15px;\n" +
    "}\n" +
    "\n" +
    ".ProseMirror-menu-dropdown-wrap {\n" +
    "  padding: 1px 0 1px 4px;\n" +
    "  display: inline-block;\n" +
    "  position: relative;\n" +
    "}\n" +
    "\n" +
    ".ProseMirror-menu-dropdown:after {\n" +
    "  content: \"\";\n" +
    "  border-left: 4px solid transparent;\n" +
    "  border-right: 4px solid transparent;\n" +
    "  border-top: 4px solid currentColor;\n" +
    "  opacity: .6;\n" +
    "  position: absolute;\n" +
    "  right: 4px;\n" +
    "  top: calc(50% - 2px);\n" +
    "}\n" +
    "\n" +
    ".ProseMirror-menu-dropdown-menu, .ProseMirror-menu-submenu {\n" +
    "  position: absolute;\n" +
    "  background: white;\n" +
    "  color: #666;\n" +
    "  border: 1px solid #aaa;\n" +
    "  padding: 2px;\n" +
    "}\n" +
    "\n" +
    ".ProseMirror-menu-dropdown-menu {\n" +
    "  z-index: 15;\n" +
    "  min-width: 6em;\n" +
    "}\n" +
    "\n" +
    ".ProseMirror-menu-dropdown-item {\n" +
    "  cursor: pointer;\n" +
    "  padding: 2px 8px 2px 4px;\n" +
    "}\n" +
    "\n" +
    ".ProseMirror-menu-dropdown-item:hover {\n" +
    "  background: #f2f2f2;\n" +
    "}\n" +
    "\n" +
    ".ProseMirror-menu-submenu-wrap {\n" +
    "  position: relative;\n" +
    "  margin-right: -4px;\n" +
    "}\n" +
    "\n" +
    ".ProseMirror-menu-submenu-label:after {\n" +
    "  content: \"\";\n" +
    "  border-top: 4px solid transparent;\n" +
    "  border-bottom: 4px solid transparent;\n" +
    "  border-left: 4px solid currentColor;\n" +
    "  opacity: .6;\n" +
    "  position: absolute;\n" +
    "  right: 4px;\n" +
    "  top: calc(50% - 4px);\n" +
    "}\n" +
    "\n" +
    ".ProseMirror-menu-submenu {\n" +
    "  display: none;\n" +
    "  min-width: 4em;\n" +
    "  left: 100%;\n" +
    "  top: -3px;\n" +
    "}\n" +
    "\n" +
    ".ProseMirror-menu-active {\n" +
    "  background: #eee;\n" +
    "  border-radius: 4px;\n" +
    "}\n" +
    "\n" +
    ".ProseMirror-menu-disabled {\n" +
    "  opacity: .3;\n" +
    "}\n" +
    "\n" +
    ".ProseMirror-menu-submenu-wrap:hover .ProseMirror-menu-submenu, .ProseMirror-menu-submenu-wrap-active .ProseMirror-menu-submenu {\n" +
    "  display: block;\n" +
    "}\n" +
    "\n" +
    ".ProseMirror-menubar {\n" +
    "  border-top-left-radius: inherit;\n" +
    "  border-top-right-radius: inherit;\n" +
    "  position: relative;\n" +
    "  min-height: 1em;\n" +
    "  color: #666;\n" +
    "  padding: 1px 6px;\n" +
    "  top: 0; left: 0; right: 0;\n" +
    "  border-bottom: 1px solid silver;\n" +
    "  background: white;\n" +
    "  z-index: 10;\n" +
    "  -moz-box-sizing: border-box;\n" +
    "  box-sizing: border-box;\n" +
    "  overflow: visible;\n" +
    "}\n" +
    "\n" +
    ".ProseMirror-icon {\n" +
    "  display: inline-block;\n" +
    "  line-height: .8;\n" +
    "  vertical-align: -2px; /* Compensate for padding */\n" +
    "  padding: 2px 8px;\n" +
    "  cursor: pointer;\n" +
    "}\n" +
    "\n" +
    ".ProseMirror-menu-disabled.ProseMirror-icon {\n" +
    "  cursor: default;\n" +
    "}\n" +
    "\n" +
    ".ProseMirror-icon svg {\n" +
    "  fill: currentColor;\n" +
    "  height: 1em;\n" +
    "}\n" +
    "\n" +
    ".ProseMirror-icon span {\n" +
    "  vertical-align: text-top;\n" +
    "}\n" +
    ".ProseMirror-gapcursor {\n" +
    "  display: none;\n" +
    "  pointer-events: none;\n" +
    "  position: absolute;\n" +
    "}\n" +
    "\n" +
    ".ProseMirror-gapcursor:after {\n" +
    "  content: \"\";\n" +
    "  display: block;\n" +
    "  position: absolute;\n" +
    "  top: -2px;\n" +
    "  width: 20px;\n" +
    "  border-top: 1px solid black;\n" +
    "  animation: ProseMirror-cursor-blink 1.1s steps(2, start) infinite;\n" +
    "}\n" +
    "\n" +
    "@keyframes ProseMirror-cursor-blink {\n" +
    "  to {\n" +
    "    visibility: hidden;\n" +
    "  }\n" +
    "}\n" +
    "\n" +
    ".ProseMirror-focused .ProseMirror-gapcursor {\n" +
    "  display: block;\n" +
    "}\n" +
    "/* Add space around the hr to make clicking it easier */\n" +
    "\n" +
    ".ProseMirror-example-setup-style hr {\n" +
    "  padding: 2px 10px;\n" +
    "  border: none;\n" +
    "  margin: 1em 0;\n" +
    "}\n" +
    "\n" +
    ".ProseMirror-example-setup-style hr:after {\n" +
    "  content: \"\";\n" +
    "  display: block;\n" +
    "  height: 1px;\n" +
    "  background-color: silver;\n" +
    "  line-height: 2px;\n" +
    "}\n" +
    "\n" +
    ".ProseMirror ul, .ProseMirror ol {\n" +
    "  padding-left: 30px;\n" +
    "}\n" +
    "\n" +
    ".ProseMirror blockquote {\n" +
    "  padding-left: 1em;\n" +
    "  border-left: 3px solid #eee;\n" +
    "  margin-left: 0; margin-right: 0;\n" +
    "}\n" +
    "\n" +
    ".ProseMirror-example-setup-style img {\n" +
    "  cursor: default;\n" +
    "}\n" +
    "\n" +
    ".ProseMirror-prompt {\n" +
    "  background: white;\n" +
    "  padding: 5px 10px 5px 15px;\n" +
    "  border: 1px solid silver;\n" +
    "  position: fixed;\n" +
    "  border-radius: 3px;\n" +
    "  z-index: 11;\n" +
    "  box-shadow: -.5px 2px 5px rgba(0, 0, 0, .2);\n" +
    "}\n" +
    "\n" +
    ".ProseMirror-prompt h5 {\n" +
    "  margin: 0;\n" +
    "  font-weight: normal;\n" +
    "  font-size: 100%;\n" +
    "  color: #444;\n" +
    "}\n" +
    "\n" +
    ".ProseMirror-prompt input[type=\"text\"],\n" +
    ".ProseMirror-prompt textarea {\n" +
    "  background: #eee;\n" +
    "  border: none;\n" +
    "  outline: none;\n" +
    "}\n" +
    "\n" +
    ".ProseMirror-prompt input[type=\"text\"] {\n" +
    "  padding: 0 4px;\n" +
    "}\n" +
    "\n" +
    ".ProseMirror-prompt-close {\n" +
    "  position: absolute;\n" +
    "  left: 2px; top: 1px;\n" +
    "  color: #666;\n" +
    "  border: none; background: transparent; padding: 0;\n" +
    "}\n" +
    "\n" +
    ".ProseMirror-prompt-close:after {\n" +
    "  content: \"âœ•\";\n" +
    "  font-size: 12px;\n" +
    "}\n" +
    "\n" +
    ".ProseMirror-invalid {\n" +
    "  background: #ffc;\n" +
    "  border: 1px solid #cc7;\n" +
    "  border-radius: 4px;\n" +
    "  padding: 5px 10px;\n" +
    "  position: absolute;\n" +
    "  min-width: 10em;\n" +
    "}\n" +
    "\n" +
    ".ProseMirror-prompt-buttons {\n" +
    "  margin-top: 5px;\n" +
    "  display: none;\n" +
    "}\n" +
    "#editor, .editor {\n" +
    "  background: white;\n" +
    "  color: black;\n" +
    "  background-clip: padding-box;\n" +
    "  border-radius: 4px;\n" +
    "  border: 2px solid rgba(0, 0, 0, 0.2);\n" +
    "  padding: 5px 0;\n" +
    "  margin-bottom: 23px;\n" +
    "}\n" +
    "\n" +
    ".ProseMirror p:first-child,\n" +
    ".ProseMirror h1:first-child,\n" +
    ".ProseMirror h2:first-child,\n" +
    ".ProseMirror h3:first-child,\n" +
    ".ProseMirror h4:first-child,\n" +
    ".ProseMirror h5:first-child,\n" +
    ".ProseMirror h6:first-child {\n" +
    "  margin-top: 10px;\n" +
    "}\n" +
    "\n" +
    ".ProseMirror {\n" +
    "  padding: 4px 8px 4px 14px;\n" +
    "  line-height: 1.2;\n" +
    "  outline: none;\n" +
    "}\n" +
    "\n" +
    ".ProseMirror p { margin-bottom: 1em }\n" +
    "\n" +
    ".menuicon{\n" +
    "  transition-duration: 200ms;\n" +
    "  position: relative;\n" +
    "  width: 80px;\n" +
    "  height: 40px;\n" +
    "  justify-content: center;\n" +
    "  align-content: center;\n" +
    "  display: flex;\n" +
    "  border-radius: 10px;\n" +
    "  background-color: #444444;\n" +
    "  text-align: center;\n" +
    "  font-size: 15px;\n" +
    "  font-family: sans-serif;\n" +
    "  cursor: pointer;\n" +
    "  align-items: center;\n" +
    "  color: #dcdcdc;\n" +
    "  justify-self: center;\n" +
    "  border: 1px solid rgba(255, 255, 255, 0.3);\n" +
    "\n" +
    "}\n" +
    "\n" +
    ".separators{\n" +
    "  background-color: #5b5b5b;\n" +
    "  width: 90%;\n" +
    "  height: 2px;\n" +
    "}\n" +
    "\n" +
    ".menuicon:hover{\n" +
    "  background-color: rgba(64, 148, 255, 0.18);\n" +
    "  border: 1px solid #819dcd;\n" +
    "  color: #809bce;\n" +
    "  filter: drop-shadow(0px 2px 10px rgba(0,0,0,0.1));\n" +
    "}\n" +
    "\n" +
    "\n" +
    ".menubar{\n" +
    "  display: flex;\n" +
    "  flex-direction: column;\n" +
    "  gap: 5px;\n" +
    "  background-color: rgb(53, 53, 56);\n" +
    "  height: calc(100% - 20px);\n" +
    "  border-radius: 10px;\n" +
    "  filter:  drop-shadow(0px 10px 10px rgba(0,0,0,0.2));\n" +
    "  width: 300px;\n" +
    "  position: fixed;\n" +
    "  left: 0;\n" +
    "  top: 0;\n" +
    "  align-items: center;\n" +
    "  padding-left: 10px;\n" +
    "  padding-right: 10px;\n" +
    "  margin: 10px;\n" +
    "\n" +
    "}\n" +
    "\n" +
    "\n" +
    ".section-title{\n" +
    "\n" +
    "  font-family: sans-serif;\n" +
    "  color: white;\n" +
    "  margin-left: 10px;\n" +
    "\n" +
    "}\n" +
    "\n" +
    "\n" +
    ".menuicon-active{\n" +
    "  background-color: #337eff;\n" +
    "  color: white;\n" +
    "}\n" +
    "\n" +
    ".menuicon-active:hover{\n" +
    "  background-color: #2358b7;\n" +
    "  transform: scale(1.1);\n" +
    "  filter: drop-shadow(0px 2px 10px rgba(0,0,0,0.1));\n" +
    "}\n" +
    "\n" +
    ".ProseMirror{\n" +
    "  font-family: sans-serif;\n" +
    "  border-top: 1px solid rgba(0,0,0,0.1);\n" +
    "  border-bottom: 1px solid rgba(0,0,0,0.1);\n" +
    "  min-height: 100px;\n" +
    "  width: 100%;\n" +
    "  height: 100%;\n" +
    "\n" +
    "}\n" +
    "\n" +
    ".image-icon{\n" +
    "  position: relative;\n" +
    "  transition-duration: 200ms;\n" +
    "  width: 40px;\n" +
    "  height: 40px;\n" +
    "  cursor: pointer;\n" +
    "}\n" +
    "\n" +
    ".image-icon > path{\n" +
    "  position: absolute;\n" +
    "  top: 0;\n" +
    "  left: 0;\n" +
    "  width: 40px;\n" +
    "  height: 40px;\n" +
    "}\n" +
    "\n" +
    "#editor{\n" +
    "  border: none;\n" +
    "  padding: 0;\n" +
    "  overflow: hidden;\n" +
    "  display: flex;\n" +
    "  flex-direction: row;\n" +
    "  width: 100%;\n" +
    "  height: 100%;\n" +
    "}\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    ".editor{\n" +
    "  width: 500px;\n" +
    "  min-height: 300px;\n" +
    "  background-color: white;\n" +
    "  border: 1px solid #cfcfcf;\n" +
    "  border-radius: 10px;\n" +
    "  outline-style: none;\n" +
    "  padding: 5px;\n" +
    "}\n" +
    "\n" +
    ".editor:focus{\n" +
    "  border: 1px solid #4372ff;\n" +
    "}\n" +
    "\n" +
    ".menu-bar{\n" +
    "  width: 500px;\n" +
    "  height: 30px;\n" +
    "  padding: 5px;\n" +
    "  background-color: #cfcfcf;\n" +
    "}\n";


//document.head.appendChild(style)

///////////////////////////////| ProseMirror Library |/////////////////////////////////////////////////

///////////////////////////////| Plugin |////////////////////////////////////


const {commands, view, menu, state, model, keymap, schema_basic} = PM;

const {Schema} = PM.model;
const {MenuItem} = PM.menu;
const {buildMenuItems, exampleSetup} = PM.example_setup;


const EditorState = state.EditorState;
const EditorView = view.EditorView;
const {schema} = schema_basic;



// --- define emojis types ---

const emojis = [
    {
        "emoji": "😀"
        , "description": "grinning face"
        , "category": "Smileys & Emotion"
        , "aliases": [
            "grinning"
        ]
        , "tags": [
            "smile"
            , "happy"
        ]
        , "unicode_version": "6.1"
        , "ios_version": "6.0"
    }
    , {
        "emoji": "😃"
        , "description": "grinning face with big eyes"
        , "category": "Smileys & Emotion"
        , "aliases": [
            "smiley"
        ]
        , "tags": [
            "happy"
            , "joy"
            , "haha"
        ]
        , "unicode_version": "6.0"
        , "ios_version": "6.0"
    }
    , {
        "emoji": "😄"
        , "description": "grinning face with smiling eyes"
        , "category": "Smileys & Emotion"
        , "aliases": [
            "smile"
        ]
        , "tags": [
            "happy"
            , "joy"
            , "laugh"
            , "pleased"
        ]
        , "unicode_version": "6.0"
        , "ios_version": "6.0"
    }
    , {
        "emoji": "😁"
        , "description": "beaming face with smiling eyes"
        , "category": "Smileys & Emotion"
        , "aliases": [
            "grin"
        ]
        , "tags": [
        ]
        , "unicode_version": "6.0"
        , "ios_version": "6.0"
    }
    , {
        "emoji": "😆"
        , "description": "grinning squinting face"
        , "category": "Smileys & Emotion"
        , "aliases": [
            "laughing"
            , "satisfied"
        ]
        , "tags": [
            "happy"
            , "haha"
        ]
        , "unicode_version": "6.0"
        , "ios_version": "6.0"
    }
    , {
        "emoji": "😅"
        , "description": "grinning face with sweat"
        , "category": "Smileys & Emotion"
        , "aliases": [
            "sweat_smile"
        ]
        , "tags": [
            "hot"
        ]
        , "unicode_version": "6.0"
        , "ios_version": "6.0"
    }
    , {
        "emoji": "🤣"
        , "description": "rolling on the floor laughing"
        , "category": "Smileys & Emotion"
        , "aliases": [
            "rofl"
        ]
        , "tags": [
            "lol"
            , "laughing"
        ]
        , "unicode_version": "9.0"
        , "ios_version": "10.2"
    }
    , {
        "emoji": "😂"
        , "description": "face with tears of joy"
        , "category": "Smileys & Emotion"
        , "aliases": [
            "joy"
        ]
        , "tags": [
            "tears"
        ]
        , "unicode_version": "6.0"
        , "ios_version": "6.0"
    }
    , {
        "emoji": "🙂"
        , "description": "slightly smiling face"
        , "category": "Smileys & Emotion"
        , "aliases": [
            "slightly_smiling_face"
        ]
        , "tags": [
        ]
        , "unicode_version": "7.0"
        , "ios_version": "9.1"
    }
    , {
        "emoji": "🙃"
        , "description": "upside-down face"
        , "category": "Smileys & Emotion"
        , "aliases": [
            "upside_down_face"
        ]
        , "tags": [
        ]
        , "unicode_version": "8.0"
        , "ios_version": "9.1"
    }
    , {
        "emoji": "😉"
        , "description": "winking face"
        , "category": "Smileys & Emotion"
        , "aliases": [
            "wink"
        ]
        , "tags": [
            "flirt"
        ]
        , "unicode_version": "6.0"
        , "ios_version": "6.0"
    }
    , {
        "emoji": "😊"
        , "description": "smiling face with smiling eyes"
        , "category": "Smileys & Emotion"
        , "aliases": [
            "blush"
        ]
        , "tags": [
            "proud"
        ]
        , "unicode_version": "6.0"
        , "ios_version": "6.0"
    }
    , {
        "emoji": "😇"
        , "description": "smiling face with halo"
        , "category": "Smileys & Emotion"
        , "aliases": [
            "innocent"
        ]
        , "tags": [
            "angel"
        ]
        , "unicode_version": "6.0"
        , "ios_version": "6.0"
    }
    , {
        "emoji": "🥰"
        , "description": "smiling face with hearts"
        , "category": "Smileys & Emotion"
        , "aliases": [
            "smiling_face_with_three_hearts"
        ]
        , "tags": [
            "love"
        ]
        , "unicode_version": "11.0"
        , "ios_version": "12.1"
    }
    , {
        "emoji": "😍"
        , "description": "smiling face with heart-eyes"
        , "category": "Smileys & Emotion"
        , "aliases": [
            "heart_eyes"
        ]
        , "tags": [
            "love"
            , "crush"
        ]
        , "unicode_version": "6.0"
        , "ios_version": "6.0"
    }
    , {
        "emoji": "🤩"
        , "description": "star-struck"
        , "category": "Smileys & Emotion"
        , "aliases": [
            "star_struck"
        ]
        , "tags": [
            "eyes"
        ]
        , "unicode_version": "11.0"
        , "ios_version": "12.1"
    }
    , {
        "emoji": "😘"
        , "description": "face blowing a kiss"
        , "category": "Smileys & Emotion"
        , "aliases": [
            "kissing_heart"
        ]
        , "tags": [
            "flirt"
        ]
        , "unicode_version": "6.0"
        , "ios_version": "6.0"
    }
    , {
        "emoji": "😗"
        , "description": "kissing face"
        , "category": "Smileys & Emotion"
        , "aliases": [
            "kissing"
        ]
        , "tags": [
        ]
        , "unicode_version": "6.1"
        , "ios_version": "6.0"
    }
    , {
        "emoji": "☺️"
        , "description": "smiling face"
        , "category": "Smileys & Emotion"
        , "aliases": [
            "relaxed"
        ]
        , "tags": [
            "blush"
            , "pleased"
        ]
        , "unicode_version": ""
        , "ios_version": "6.0"
    }
    , {
        "emoji": "😚"
        , "description": "kissing face with closed eyes"
        , "category": "Smileys & Emotion"
        , "aliases": [
            "kissing_closed_eyes"
        ]
        , "tags": [
        ]
        , "unicode_version": "6.0"
        , "ios_version": "6.0"
    }
    , {
        "emoji": "😙"
        , "description": "kissing face with smiling eyes"
        , "category": "Smileys & Emotion"
        , "aliases": [
            "kissing_smiling_eyes"
        ]
        , "tags": [
        ]
        , "unicode_version": "6.1"
        , "ios_version": "6.0"
    }
    , {
        "emoji": "🥲"
        , "description": "smiling face with tear"
        , "category": "Smileys & Emotion"
        , "aliases": [
            "smiling_face_with_tear"
        ]
        , "tags": [
        ]
        , "unicode_version": "13.0"
        , "ios_version": "14.0"
    }
    , {
        "emoji": "😋"
        , "description": "face savoring food"
        , "category": "Smileys & Emotion"
        , "aliases": [
            "yum"
        ]
        , "tags": [
            "tongue"
            , "lick"
        ]
        , "unicode_version": "6.0"
        , "ios_version": "6.0"
    }
    , {
        "emoji": "😛"
        , "description": "face with tongue"
        , "category": "Smileys & Emotion"
        , "aliases": [
            "stuck_out_tongue"
        ]
        , "tags": [
        ]
        , "unicode_version": "6.1"
        , "ios_version": "6.0"
    }
    , {
        "emoji": "😜"
        , "description": "winking face with tongue"
        , "category": "Smileys & Emotion"
        , "aliases": [
            "stuck_out_tongue_winking_eye"
        ]
        , "tags": [
            "prank"
            , "silly"
        ]
        , "unicode_version": "6.0"
        , "ios_version": "6.0"
    }
    , {
        "emoji": "🤪"
        , "description": "zany face"
        , "category": "Smileys & Emotion"
        , "aliases": [
            "zany_face"
        ]
        , "tags": [
            "goofy"
            , "wacky"
        ]
        , "unicode_version": "11.0"
        , "ios_version": "12.1"
    }]

//emoji
const EmojiSpec = {
    attrs: {type: {default: "🤪"}}, // dynamic values here
    draggable: true,
    selectable: false,
    parseDOM: [{ // how does prosemirror recognize an emoji if its being pasted from clipboard?
        tag: "p[emoji-type]",
        getAttrs: (dom) => {
            console.log(dom.getAttribute("emoji-type"))
            return {type: dom.getAttribute("emoji-type")}
        }
    }],
    toDOM: (node) =>  {
        return ["p", node.attrs.type.emoji]
    },
}




const customSchema = new Schema({
    nodes: schema.spec.nodes.addBefore("image", "emoji", EmojiSpec),
    marks: schema.spec.marks
})

let content = document.querySelector("#content")
let startDoc = model.DOMParser.fromSchema(customSchema).parse(content)


let emojiType = customSchema.nodes.emoji

console.log(emojiType.create("🤪"));

function insertEmoji(face) {
    return function(state, dispatch) {
        let {$from} = state.selection, index = $from.index()
        if (!$from.parent.canReplaceWith(index, index, emojiType))return false
        if (dispatch)dispatch(state.tr.replaceSelectionWith(emojiType.create(face)))
        return true
    }
}

//underline




let menuBuild = buildMenuItems(customSchema)

emojis.forEach(emojiJSON => {
    menuBuild.insertMenu.content.push(new MenuItem({
        title: "Insert " + emojiJSON.emoji,
        label: emojiJSON.emoji.charAt(0).toUpperCase() + emojiJSON.emoji.slice(1),
        enable(state) { return insertEmoji(emojiJSON.emoji)(state) },
        run: insertEmoji(emojiJSON.emoji)
    }))
})

window.view = new EditorView(document.querySelector("#editor"), {
    state: EditorState.create({
        doc: startDoc,
        plugins: exampleSetup({schema: customSchema, menuContent: menuBuild.fullMenu})
    })
})
