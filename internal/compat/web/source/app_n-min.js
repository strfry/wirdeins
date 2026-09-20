/*! jQuery v1.9.1 | (c) 2005, 2012 jQuery Foundation, Inc. | jquery.org/license
//@ sourceMappingURL=jquery.min.map
*/
!(function (e, t) {
    var n,
        i,
        r = typeof t,
        o = e.document,
        a = e.location,
        s = e.jQuery,
        l = e.$,
        c = {},
        u = [],
        d = "1.9.1",
        p = u.concat,
        f = u.push,
        h = u.slice,
        g = u.indexOf,
        m = c.toString,
        y = c.hasOwnProperty,
        v = d.trim,
        b = function (e, t) {
            return new b.fn.init(e, t, i);
        },
        x = /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source,
        w = /\S+/g,
        k = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,
        C = /^(?:(<[\w\W]+>)[^>]*|#([\w-]*))$/,
        T = /^<(\w+)\s*\/?>(?:<\/\1>|)$/,
        E = /^[\],:{}\s]*$/,
        N = /(?:^|:|,)(?:\s*\[)+/g,
        j = /\\(?:["\\\/bfnrt]|u[\da-fA-F]{4})/g,
        S = /"[^"\\\r\n]*"|true|false|null|-?(?:\d+\.|)\d+(?:[eE][+-]?\d+|)/g,
        A = /^-ms-/,
        L = /-([\da-z])/gi,
        H = function (e, t) {
            return t.toUpperCase();
        },
        D = function (e) {
            (o.addEventListener || "load" === e.type || "complete" === o.readyState) && (P(), b.ready());
        },
        P = function () {
            o.addEventListener ? (o.removeEventListener("DOMContentLoaded", D, !1), e.removeEventListener("load", D, !1)) : (o.detachEvent("onreadystatechange", D), e.detachEvent("onload", D));
        };
    function M(e) {
        var t = e.length,
            n = b.type(e);
        return !b.isWindow(e) && (!(1 !== e.nodeType || !t) || "array" === n || ("function" !== n && (0 === t || ("number" == typeof t && t > 0 && t - 1 in e))));
    }
    (b.fn = b.prototype = {
        jquery: d,
        constructor: b,
        init: function (e, n, i) {
            var r, a;
            if (!e) return this;
            if ("string" == typeof e) {
                if (!(r = "<" === e.charAt(0) && ">" === e.charAt(e.length - 1) && e.length >= 3 ? [null, e, null] : C.exec(e)) || (!r[1] && n)) return !n || n.jquery ? (n || i).find(e) : this.constructor(n).find(e);
                if (r[1]) {
                    if (((n = n instanceof b ? n[0] : n), b.merge(this, b.parseHTML(r[1], n && n.nodeType ? n.ownerDocument || n : o, !0)), T.test(r[1]) && b.isPlainObject(n)))
                        for (r in n) b.isFunction(this[r]) ? this[r](n[r]) : this.attr(r, n[r]);
                    return this;
                }
                if ((a = o.getElementById(r[2])) && a.parentNode) {
                    if (a.id !== r[2]) return i.find(e);
                    (this.length = 1), (this[0] = a);
                }
                return (this.context = o), (this.selector = e), this;
            }
            return e.nodeType ? ((this.context = this[0] = e), (this.length = 1), this) : b.isFunction(e) ? i.ready(e) : (e.selector !== t && ((this.selector = e.selector), (this.context = e.context)), b.makeArray(e, this));
        },
        selector: "",
        length: 0,
        size: function () {
            return this.length;
        },
        toArray: function () {
            return h.call(this);
        },
        get: function (e) {
            return null == e ? this.toArray() : 0 > e ? this[this.length + e] : this[e];
        },
        pushStack: function (e) {
            var t = b.merge(this.constructor(), e);
            return (t.prevObject = this), (t.context = this.context), t;
        },
        each: function (e, t) {
            return b.each(this, e, t);
        },
        ready: function (e) {
            return b.ready.promise().done(e), this;
        },
        slice: function () {
            return this.pushStack(h.apply(this, arguments));
        },
        first: function () {
            return this.eq(0);
        },
        last: function () {
            return this.eq(-1);
        },
        eq: function (e) {
            var t = this.length,
                n = +e + (0 > e ? t : 0);
            return this.pushStack(n >= 0 && t > n ? [this[n]] : []);
        },
        map: function (e) {
            return this.pushStack(
                b.map(this, function (t, n) {
                    return e.call(t, n, t);
                })
            );
        },
        end: function () {
            return this.prevObject || this.constructor(null);
        },
        push: f,
        sort: [].sort,
        splice: [].splice,
    }),
        (b.fn.init.prototype = b.fn),
        (b.extend = b.fn.extend = function () {
            var e,
                n,
                i,
                r,
                o,
                a,
                s = arguments[0] || {},
                l = 1,
                c = arguments.length,
                u = !1;
            for ("boolean" == typeof s && ((u = s), (s = arguments[1] || {}), (l = 2)), "object" == typeof s || b.isFunction(s) || (s = {}), c === l && ((s = this), --l); c > l; l++)
                if (null != (o = arguments[l]))
                    for (r in o)
                        (e = s[r]),
                            s !== (i = o[r]) &&
                                (u && i && (b.isPlainObject(i) || (n = b.isArray(i))) ? (n ? ((n = !1), (a = e && b.isArray(e) ? e : [])) : (a = e && b.isPlainObject(e) ? e : {}), (s[r] = b.extend(u, a, i))) : i !== t && (s[r] = i));
            return s;
        }),
        b.extend({
            noConflict: function (t) {
                return e.$ === b && (e.$ = l), t && e.jQuery === b && (e.jQuery = s), b;
            },
            isReady: !1,
            readyWait: 1,
            holdReady: function (e) {
                e ? b.readyWait++ : b.ready(!0);
            },
            ready: function (e) {
                if (!0 === e ? !--b.readyWait : !b.isReady) {
                    if (!o.body) return setTimeout(b.ready);
                    (b.isReady = !0), (!0 !== e && --b.readyWait > 0) || (n.resolveWith(o, [b]), b.fn.trigger && b(o).trigger("ready").off("ready"));
                }
            },
            isFunction: function (e) {
                return "function" === b.type(e);
            },
            isArray:
                Array.isArray ||
                function (e) {
                    return "array" === b.type(e);
                },
            isWindow: function (e) {
                return null != e && e == e.window;
            },
            isNumeric: function (e) {
                return !isNaN(parseFloat(e)) && isFinite(e);
            },
            type: function (e) {
                return null == e ? e + "" : "object" == typeof e || "function" == typeof e ? c[m.call(e)] || "object" : typeof e;
            },
            isPlainObject: function (e) {
                if (!e || "object" !== b.type(e) || e.nodeType || b.isWindow(e)) return !1;
                try {
                    if (e.constructor && !y.call(e, "constructor") && !y.call(e.constructor.prototype, "isPrototypeOf")) return !1;
                } catch (e) {
                    return !1;
                }
                var n;
                for (n in e);
                return n === t || y.call(e, n);
            },
            isEmptyObject: function (e) {
                var t;
                for (t in e) return !1;
                return !0;
            },
            error: function (e) {
                throw Error(e);
            },
            parseHTML: function (e, t, n) {
                if (!e || "string" != typeof e) return null;
                "boolean" == typeof t && ((n = t), (t = !1)), (t = t || o);
                var i = T.exec(e),
                    r = !n && [];
                return i ? [t.createElement(i[1])] : ((i = b.buildFragment([e], t, r)), r && b(r).remove(), b.merge([], i.childNodes));
            },
            parseJSON: function (n) {
                return e.JSON && e.JSON.parse
                    ? e.JSON.parse(n)
                    : null === n
                    ? n
                    : "string" == typeof n && (n = b.trim(n)) && E.test(n.replace(j, "@").replace(S, "]").replace(N, ""))
                    ? Function("return " + n)()
                    : (b.error("Invalid JSON: " + n), t);
            },
            parseXML: function (n) {
                var i;
                if (!n || "string" != typeof n) return null;
                try {
                    e.DOMParser ? (i = new DOMParser().parseFromString(n, "text/xml")) : (((i = new ActiveXObject("Microsoft.XMLDOM")).async = "false"), i.loadXML(n));
                } catch (e) {
                    i = t;
                }
                return (i && i.documentElement && !i.getElementsByTagName("parsererror").length) || b.error("Invalid XML: " + n), i;
            },
            noop: function () {},
            globalEval: function (t) {
                t &&
                    b.trim(t) &&
                    (
                        e.execScript ||
                        function (t) {
                            e.eval.call(e, t);
                        }
                    )(t);
            },
            camelCase: function (e) {
                return e.replace(A, "ms-").replace(L, H);
            },
            nodeName: function (e, t) {
                return e.nodeName && e.nodeName.toLowerCase() === t.toLowerCase();
            },
            each: function (e, t, n) {
                var i = 0,
                    r = e.length,
                    o = M(e);
                if (n) {
                    if (o) for (; r > i && !1 !== t.apply(e[i], n); i++);
                    else for (i in e) if (!1 === t.apply(e[i], n)) break;
                } else if (o) for (; r > i && !1 !== t.call(e[i], i, e[i]); i++);
                else for (i in e) if (!1 === t.call(e[i], i, e[i])) break;
                return e;
            },
            trim:
                v && !v.call("\ufeff ")
                    ? function (e) {
                          return null == e ? "" : v.call(e);
                      }
                    : function (e) {
                          return null == e ? "" : (e + "").replace(k, "");
                      },
            makeArray: function (e, t) {
                var n = t || [];
                return null != e && (M(Object(e)) ? b.merge(n, "string" == typeof e ? [e] : e) : f.call(n, e)), n;
            },
            inArray: function (e, t, n) {
                var i;
                if (t) {
                    if (g) return g.call(t, e, n);
                    for (i = t.length, n = n ? (0 > n ? Math.max(0, i + n) : n) : 0; i > n; n++) if (n in t && t[n] === e) return n;
                }
                return -1;
            },
            merge: function (e, n) {
                var i = n.length,
                    r = e.length,
                    o = 0;
                if ("number" == typeof i) for (; i > o; o++) e[r++] = n[o];
                else for (; n[o] !== t; ) e[r++] = n[o++];
                return (e.length = r), e;
            },
            grep: function (e, t, n) {
                var i = [],
                    r = 0,
                    o = e.length;
                for (n = !!n; o > r; r++) n !== !!t(e[r], r) && i.push(e[r]);
                return i;
            },
            map: function (e, t, n) {
                var i,
                    r = 0,
                    o = e.length,
                    a = [];
                if (M(e)) for (; o > r; r++) null != (i = t(e[r], r, n)) && (a[a.length] = i);
                else for (r in e) null != (i = t(e[r], r, n)) && (a[a.length] = i);
                return p.apply([], a);
            },
            guid: 1,
            proxy: function (e, n) {
                var i, r, o;
                return (
                    "string" == typeof n && ((o = e[n]), (n = e), (e = o)),
                    b.isFunction(e)
                        ? ((i = h.call(arguments, 2)),
                          ((r = function () {
                              return e.apply(n || this, i.concat(h.call(arguments)));
                          }).guid = e.guid = e.guid || b.guid++),
                          r)
                        : t
                );
            },
            access: function (e, n, i, r, o, a, s) {
                var l = 0,
                    c = e.length,
                    u = null == i;
                if ("object" === b.type(i)) for (l in ((o = !0), i)) b.access(e, n, l, i[l], !0, a, s);
                else if (
                    r !== t &&
                    ((o = !0),
                    b.isFunction(r) || (s = !0),
                    u &&
                        (s
                            ? (n.call(e, r), (n = null))
                            : ((u = n),
                              (n = function (e, t, n) {
                                  return u.call(b(e), n);
                              }))),
                    n)
                )
                    for (; c > l; l++) n(e[l], i, s ? r : r.call(e[l], l, n(e[l], i)));
                return o ? e : u ? n.call(e) : c ? n(e[0], i) : a;
            },
            now: function () {
                return new Date().getTime();
            },
        }),
        (b.ready.promise = function (t) {
            if (!n)
                if (((n = b.Deferred()), "complete" === o.readyState)) setTimeout(b.ready);
                else if (o.addEventListener) o.addEventListener("DOMContentLoaded", D, !1), e.addEventListener("load", D, !1);
                else {
                    o.attachEvent("onreadystatechange", D), e.attachEvent("onload", D);
                    var i = !1;
                    try {
                        i = null == e.frameElement && o.documentElement;
                    } catch (e) {}
                    i &&
                        i.doScroll &&
                        (function e() {
                            if (!b.isReady) {
                                try {
                                    i.doScroll("left");
                                } catch (t) {
                                    return setTimeout(e, 50);
                                }
                                P(), b.ready();
                            }
                        })();
                }
            return n.promise(t);
        }),
        b.each("Boolean Number String Function Array Date RegExp Object Error".split(" "), function (e, t) {
            c["[object " + t + "]"] = t.toLowerCase();
        }),
        (i = b(o));
    var O = {};
    (b.Callbacks = function (e) {
        e =
            "string" == typeof e
                ? O[e] ||
                  (function (e) {
                      var t = (O[e] = {});
                      return (
                          b.each(e.match(w) || [], function (e, n) {
                              t[n] = !0;
                          }),
                          t
                      );
                  })(e)
                : b.extend({}, e);
        var n,
            i,
            r,
            o,
            a,
            s,
            l = [],
            c = !e.once && [],
            u = function (t) {
                for (i = e.memory && t, r = !0, a = s || 0, s = 0, o = l.length, n = !0; l && o > a; a++)
                    if (!1 === l[a].apply(t[0], t[1]) && e.stopOnFalse) {
                        i = !1;
                        break;
                    }
                (n = !1), l && (c ? c.length && u(c.shift()) : i ? (l = []) : d.disable());
            },
            d = {
                add: function () {
                    if (l) {
                        var t = l.length;
                        (function t(n) {
                            b.each(n, function (n, i) {
                                var r = b.type(i);
                                "function" === r ? (e.unique && d.has(i)) || l.push(i) : i && i.length && "string" !== r && t(i);
                            });
                        })(arguments),
                            n ? (o = l.length) : i && ((s = t), u(i));
                    }
                    return this;
                },
                remove: function () {
                    return (
                        l &&
                            b.each(arguments, function (e, t) {
                                for (var i; (i = b.inArray(t, l, i)) > -1; ) l.splice(i, 1), n && (o >= i && o--, a >= i && a--);
                            }),
                        this
                    );
                },
                has: function (e) {
                    return e ? b.inArray(e, l) > -1 : !(!l || !l.length);
                },
                empty: function () {
                    return (l = []), this;
                },
                disable: function () {
                    return (l = c = i = t), this;
                },
                disabled: function () {
                    return !l;
                },
                lock: function () {
                    return (c = t), i || d.disable(), this;
                },
                locked: function () {
                    return !c;
                },
                fireWith: function (e, t) {
                    return (t = [e, (t = t || []).slice ? t.slice() : t]), !l || (r && !c) || (n ? c.push(t) : u(t)), this;
                },
                fire: function () {
                    return d.fireWith(this, arguments), this;
                },
                fired: function () {
                    return !!r;
                },
            };
        return d;
    }),
        b.extend({
            Deferred: function (e) {
                var t = [
                        ["resolve", "done", b.Callbacks("once memory"), "resolved"],
                        ["reject", "fail", b.Callbacks("once memory"), "rejected"],
                        ["notify", "progress", b.Callbacks("memory")],
                    ],
                    n = "pending",
                    i = {
                        state: function () {
                            return n;
                        },
                        always: function () {
                            return r.done(arguments).fail(arguments), this;
                        },
                        then: function () {
                            var e = arguments;
                            return b
                                .Deferred(function (n) {
                                    b.each(t, function (t, o) {
                                        var a = o[0],
                                            s = b.isFunction(e[t]) && e[t];
                                        r[o[1]](function () {
                                            var e = s && s.apply(this, arguments);
                                            e && b.isFunction(e.promise) ? e.promise().done(n.resolve).fail(n.reject).progress(n.notify) : n[a + "With"](this === i ? n.promise() : this, s ? [e] : arguments);
                                        });
                                    }),
                                        (e = null);
                                })
                                .promise();
                        },
                        promise: function (e) {
                            return null != e ? b.extend(e, i) : i;
                        },
                    },
                    r = {};
                return (
                    (i.pipe = i.then),
                    b.each(t, function (e, o) {
                        var a = o[2],
                            s = o[3];
                        (i[o[1]] = a.add),
                            s &&
                                a.add(
                                    function () {
                                        n = s;
                                    },
                                    t[1 ^ e][2].disable,
                                    t[2][2].lock
                                ),
                            (r[o[0]] = function () {
                                return r[o[0] + "With"](this === r ? i : this, arguments), this;
                            }),
                            (r[o[0] + "With"] = a.fireWith);
                    }),
                    i.promise(r),
                    e && e.call(r, r),
                    r
                );
            },
            when: function (e) {
                var t,
                    n,
                    i,
                    r = 0,
                    o = h.call(arguments),
                    a = o.length,
                    s = 1 !== a || (e && b.isFunction(e.promise)) ? a : 0,
                    l = 1 === s ? e : b.Deferred(),
                    c = function (e, n, i) {
                        return function (r) {
                            (n[e] = this), (i[e] = arguments.length > 1 ? h.call(arguments) : r), i === t ? l.notifyWith(n, i) : --s || l.resolveWith(n, i);
                        };
                    };
                if (a > 1) for (t = Array(a), n = Array(a), i = Array(a); a > r; r++) o[r] && b.isFunction(o[r].promise) ? o[r].promise().done(c(r, i, o)).fail(l.reject).progress(c(r, n, t)) : --s;
                return s || l.resolveWith(i, o), l.promise();
            },
        }),
        (b.support = (function () {
            var t,
                n,
                i,
                a,
                s,
                l,
                c,
                u,
                d,
                p,
                f = o.createElement("div");
            if ((f.setAttribute("className", "t"), (f.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>"), (n = f.getElementsByTagName("*")), (i = f.getElementsByTagName("a")[0]), !n || !i || !n.length))
                return {};
            (c = (s = o.createElement("select")).appendChild(o.createElement("option"))),
                (a = f.getElementsByTagName("input")[0]),
                (i.style.cssText = "top:1px;float:left;opacity:.5"),
                (t = {
                    getSetAttribute: "t" !== f.className,
                    leadingWhitespace: 3 === f.firstChild.nodeType,
                    tbody: !f.getElementsByTagName("tbody").length,
                    htmlSerialize: !!f.getElementsByTagName("link").length,
                    style: /top/.test(i.getAttribute("style")),
                    hrefNormalized: "/a" === i.getAttribute("href"),
                    opacity: /^0.5/.test(i.style.opacity),
                    cssFloat: !!i.style.cssFloat,
                    checkOn: !!a.value,
                    optSelected: c.selected,
                    enctype: !!o.createElement("form").enctype,
                    html5Clone: "<:nav></:nav>" !== o.createElement("nav").cloneNode(!0).outerHTML,
                    boxModel: "CSS1Compat" === o.compatMode,
                    deleteExpando: !0,
                    noCloneEvent: !0,
                    inlineBlockNeedsLayout: !1,
                    shrinkWrapBlocks: !1,
                    reliableMarginRight: !0,
                    boxSizingReliable: !0,
                    pixelPosition: !1,
                }),
                (a.checked = !0),
                (t.noCloneChecked = a.cloneNode(!0).checked),
                (s.disabled = !0),
                (t.optDisabled = !c.disabled);
            try {
                delete f.test;
            } catch (e) {
                t.deleteExpando = !1;
            }
            for (p in ((a = o.createElement("input")).setAttribute("value", ""),
            (t.input = "" === a.getAttribute("value")),
            (a.value = "t"),
            a.setAttribute("type", "radio"),
            (t.radioValue = "t" === a.value),
            a.setAttribute("checked", "t"),
            a.setAttribute("name", "t"),
            (l = o.createDocumentFragment()).appendChild(a),
            (t.appendChecked = a.checked),
            (t.checkClone = l.cloneNode(!0).cloneNode(!0).lastChild.checked),
            f.attachEvent &&
                (f.attachEvent("onclick", function () {
                    t.noCloneEvent = !1;
                }),
                f.cloneNode(!0).click()),
            { submit: !0, change: !0, focusin: !0 }))
                f.setAttribute((u = "on" + p), "t"), (t[p + "Bubbles"] = u in e || !1 === f.attributes[u].expando);
            return (
                (f.style.backgroundClip = "content-box"),
                (f.cloneNode(!0).style.backgroundClip = ""),
                (t.clearCloneStyle = "content-box" === f.style.backgroundClip),
                b(function () {
                    var n,
                        i,
                        a,
                        s = "padding:0;margin:0;border:0;display:block;box-sizing:content-box;-moz-box-sizing:content-box;-webkit-box-sizing:content-box;",
                        l = o.getElementsByTagName("body")[0];
                    l &&
                        (((n = o.createElement("div")).style.cssText = "border:0;width:0;height:0;position:absolute;top:0;left:-9999px;margin-top:1px"),
                        l.appendChild(n).appendChild(f),
                        (f.innerHTML = "<table><tr><td></td><td>t</td></tr></table>"),
                        ((a = f.getElementsByTagName("td"))[0].style.cssText = "padding:0;margin:0;border:0;display:none"),
                        (d = 0 === a[0].offsetHeight),
                        (a[0].style.display = ""),
                        (a[1].style.display = "none"),
                        (t.reliableHiddenOffsets = d && 0 === a[0].offsetHeight),
                        (f.innerHTML = ""),
                        (f.style.cssText = "box-sizing:border-box;-moz-box-sizing:border-box;-webkit-box-sizing:border-box;padding:1px;border:1px;display:block;width:4px;margin-top:1%;position:absolute;top:1%;"),
                        (t.boxSizing = 4 === f.offsetWidth),
                        (t.doesNotIncludeMarginInBodyOffset = 1 !== l.offsetTop),
                        e.getComputedStyle &&
                            ((t.pixelPosition = "1%" !== (e.getComputedStyle(f, null) || {}).top),
                            (t.boxSizingReliable = "4px" === (e.getComputedStyle(f, null) || { width: "4px" }).width),
                            ((i = f.appendChild(o.createElement("div"))).style.cssText = f.style.cssText = s),
                            (i.style.marginRight = i.style.width = "0"),
                            (f.style.width = "1px"),
                            (t.reliableMarginRight = !parseFloat((e.getComputedStyle(i, null) || {}).marginRight))),
                        typeof f.style.zoom !== r &&
                            ((f.innerHTML = ""),
                            (f.style.cssText = s + "width:1px;padding:1px;display:inline;zoom:1"),
                            (t.inlineBlockNeedsLayout = 3 === f.offsetWidth),
                            (f.style.display = "block"),
                            (f.innerHTML = "<div></div>"),
                            (f.firstChild.style.width = "5px"),
                            (t.shrinkWrapBlocks = 3 !== f.offsetWidth),
                            t.inlineBlockNeedsLayout && (l.style.zoom = 1)),
                        l.removeChild(n),
                        (n = f = a = i = null));
                }),
                (n = s = l = c = i = a = null),
                t
            );
        })());
    var _ = /(?:\{[\s\S]*\}|\[[\s\S]*\])$/,
        q = /([A-Z])/g;
    function F(e, n, i, r) {
        if (b.acceptData(e)) {
            var o,
                a,
                s = b.expando,
                l = "string" == typeof n,
                c = e.nodeType,
                d = c ? b.cache : e,
                p = c ? e[s] : e[s] && s;
            if ((p && d[p] && (r || d[p].data)) || !l || i !== t)
                return (
                    p || (c ? (e[s] = p = u.pop() || b.guid++) : (p = s)),
                    d[p] || ((d[p] = {}), c || (d[p].toJSON = b.noop)),
                    ("object" == typeof n || "function" == typeof n) && (r ? (d[p] = b.extend(d[p], n)) : (d[p].data = b.extend(d[p].data, n))),
                    (o = d[p]),
                    r || (o.data || (o.data = {}), (o = o.data)),
                    i !== t && (o[b.camelCase(n)] = i),
                    l ? null == (a = o[n]) && (a = o[b.camelCase(n)]) : (a = o),
                    a
                );
        }
    }
    function R(e, t, n) {
        if (b.acceptData(e)) {
            var i,
                r,
                o,
                a = e.nodeType,
                s = a ? b.cache : e,
                l = a ? e[b.expando] : b.expando;
            if (s[l]) {
                if (t && (o = n ? s[l] : s[l].data)) {
                    b.isArray(t) ? (t = t.concat(b.map(t, b.camelCase))) : t in o ? (t = [t]) : (t = (t = b.camelCase(t)) in o ? [t] : t.split(" "));
                    for (i = 0, r = t.length; r > i; i++) delete o[t[i]];
                    if (!(n ? B : b.isEmptyObject)(o)) return;
                }
                (n || (delete s[l].data, B(s[l]))) && (a ? b.cleanData([e], !0) : b.support.deleteExpando || s != s.window ? delete s[l] : (s[l] = null));
            }
        }
    }
    function W(e, n, i) {
        if (i === t && 1 === e.nodeType) {
            var r = "data-" + n.replace(q, "-$1").toLowerCase();
            if ("string" == typeof (i = e.getAttribute(r))) {
                try {
                    i = "true" === i || ("false" !== i && ("null" === i ? null : +i + "" === i ? +i : _.test(i) ? b.parseJSON(i) : i));
                } catch (e) {}
                b.data(e, n, i);
            } else i = t;
        }
        return i;
    }
    function B(e) {
        var t;
        for (t in e) if (("data" !== t || !b.isEmptyObject(e[t])) && "toJSON" !== t) return !1;
        return !0;
    }
    b.extend({
        cache: {},
        expando: "jQuery" + (d + Math.random()).replace(/\D/g, ""),
        noData: { embed: !0, object: "clsid:D27CDB6E-AE6D-11cf-96B8-444553540000", applet: !0 },
        hasData: function (e) {
            return !!(e = e.nodeType ? b.cache[e[b.expando]] : e[b.expando]) && !B(e);
        },
        data: function (e, t, n) {
            return F(e, t, n);
        },
        removeData: function (e, t) {
            return R(e, t);
        },
        _data: function (e, t, n) {
            return F(e, t, n, !0);
        },
        _removeData: function (e, t) {
            return R(e, t, !0);
        },
        acceptData: function (e) {
            if (e.nodeType && 1 !== e.nodeType && 9 !== e.nodeType) return !1;
            var t = e.nodeName && b.noData[e.nodeName.toLowerCase()];
            return !t || (!0 !== t && e.getAttribute("classid") === t);
        },
    }),
        b.fn.extend({
            data: function (e, n) {
                var i,
                    r,
                    o = this[0],
                    a = 0,
                    s = null;
                if (e === t) {
                    if (this.length && ((s = b.data(o)), 1 === o.nodeType && !b._data(o, "parsedAttrs"))) {
                        for (i = o.attributes; i.length > a; a++) (r = i[a].name).indexOf("data-") || ((r = b.camelCase(r.slice(5))), W(o, r, s[r]));
                        b._data(o, "parsedAttrs", !0);
                    }
                    return s;
                }
                return "object" == typeof e
                    ? this.each(function () {
                          b.data(this, e);
                      })
                    : b.access(
                          this,
                          function (n) {
                              return n === t
                                  ? o
                                      ? W(o, e, b.data(o, e))
                                      : null
                                  : (this.each(function () {
                                        b.data(this, e, n);
                                    }),
                                    t);
                          },
                          null,
                          n,
                          arguments.length > 1,
                          null,
                          !0
                      );
            },
            removeData: function (e) {
                return this.each(function () {
                    b.removeData(this, e);
                });
            },
        }),
        b.extend({
            queue: function (e, n, i) {
                var r;
                return e ? ((n = (n || "fx") + "queue"), (r = b._data(e, n)), i && (!r || b.isArray(i) ? (r = b._data(e, n, b.makeArray(i))) : r.push(i)), r || []) : t;
            },
            dequeue: function (e, t) {
                t = t || "fx";
                var n = b.queue(e, t),
                    i = n.length,
                    r = n.shift(),
                    o = b._queueHooks(e, t);
                "inprogress" === r && ((r = n.shift()), i--),
                    (o.cur = r),
                    r &&
                        ("fx" === t && n.unshift("inprogress"),
                        delete o.stop,
                        r.call(
                            e,
                            function () {
                                b.dequeue(e, t);
                            },
                            o
                        )),
                    !i && o && o.empty.fire();
            },
            _queueHooks: function (e, t) {
                var n = t + "queueHooks";
                return (
                    b._data(e, n) ||
                    b._data(e, n, {
                        empty: b.Callbacks("once memory").add(function () {
                            b._removeData(e, t + "queue"), b._removeData(e, n);
                        }),
                    })
                );
            },
        }),
        b.fn.extend({
            queue: function (e, n) {
                var i = 2;
                return (
                    "string" != typeof e && ((n = e), (e = "fx"), i--),
                    i > arguments.length
                        ? b.queue(this[0], e)
                        : n === t
                        ? this
                        : this.each(function () {
                              var t = b.queue(this, e, n);
                              b._queueHooks(this, e), "fx" === e && "inprogress" !== t[0] && b.dequeue(this, e);
                          })
                );
            },
            dequeue: function (e) {
                return this.each(function () {
                    b.dequeue(this, e);
                });
            },
            delay: function (e, t) {
                return (
                    (e = (b.fx && b.fx.speeds[e]) || e),
                    (t = t || "fx"),
                    this.queue(t, function (t, n) {
                        var i = setTimeout(t, e);
                        n.stop = function () {
                            clearTimeout(i);
                        };
                    })
                );
            },
            clearQueue: function (e) {
                return this.queue(e || "fx", []);
            },
            promise: function (e, n) {
                var i,
                    r = 1,
                    o = b.Deferred(),
                    a = this,
                    s = this.length,
                    l = function () {
                        --r || o.resolveWith(a, [a]);
                    };
                for ("string" != typeof e && ((n = e), (e = t)), e = e || "fx"; s--; ) (i = b._data(a[s], e + "queueHooks")) && i.empty && (r++, i.empty.add(l));
                return l(), o.promise(n);
            },
        });
    var I,
        $,
        z = /[\t\r\n]/g,
        X = /\r/g,
        U = /^(?:input|select|textarea|button|object)$/i,
        V = /^(?:a|area)$/i,
        K = /^(?:checked|selected|autofocus|autoplay|async|controls|defer|disabled|hidden|loop|multiple|open|readonly|required|scoped)$/i,
        G = /^(?:checked|selected)$/i,
        Q = b.support.getSetAttribute,
        J = b.support.input;
    b.fn.extend({
        attr: function (e, t) {
            return b.access(this, b.attr, e, t, arguments.length > 1);
        },
        removeAttr: function (e) {
            return this.each(function () {
                b.removeAttr(this, e);
            });
        },
        prop: function (e, t) {
            return b.access(this, b.prop, e, t, arguments.length > 1);
        },
        removeProp: function (e) {
            return (
                (e = b.propFix[e] || e),
                this.each(function () {
                    try {
                        (this[e] = t), delete this[e];
                    } catch (e) {}
                })
            );
        },
        addClass: function (e) {
            var t,
                n,
                i,
                r,
                o,
                a = 0,
                s = this.length,
                l = "string" == typeof e && e;
            if (b.isFunction(e))
                return this.each(function (t) {
                    b(this).addClass(e.call(this, t, this.className));
                });
            if (l)
                for (t = (e || "").match(w) || []; s > a; a++)
                    if ((i = 1 === (n = this[a]).nodeType && (n.className ? (" " + n.className + " ").replace(z, " ") : " "))) {
                        for (o = 0; (r = t[o++]); ) 0 > i.indexOf(" " + r + " ") && (i += r + " ");
                        n.className = b.trim(i);
                    }
            return this;
        },
        removeClass: function (e) {
            var t,
                n,
                i,
                r,
                o,
                a = 0,
                s = this.length,
                l = 0 === arguments.length || ("string" == typeof e && e);
            if (b.isFunction(e))
                return this.each(function (t) {
                    b(this).removeClass(e.call(this, t, this.className));
                });
            if (l)
                for (t = (e || "").match(w) || []; s > a; a++)
                    if ((i = 1 === (n = this[a]).nodeType && (n.className ? (" " + n.className + " ").replace(z, " ") : ""))) {
                        for (o = 0; (r = t[o++]); ) for (; i.indexOf(" " + r + " ") >= 0; ) i = i.replace(" " + r + " ", " ");
                        n.className = e ? b.trim(i) : "";
                    }
            return this;
        },
        toggleClass: function (e, t) {
            var n = typeof e,
                i = "boolean" == typeof t;
            return b.isFunction(e)
                ? this.each(function (n) {
                      b(this).toggleClass(e.call(this, n, this.className, t), t);
                  })
                : this.each(function () {
                      if ("string" === n) for (var o, a = 0, s = b(this), l = t, c = e.match(w) || []; (o = c[a++]); ) (l = i ? l : !s.hasClass(o)), s[l ? "addClass" : "removeClass"](o);
                      else (n === r || "boolean" === n) && (this.className && b._data(this, "__className__", this.className), (this.className = this.className || !1 === e ? "" : b._data(this, "__className__") || ""));
                  });
        },
        hasClass: function (e) {
            for (var t = " " + e + " ", n = 0, i = this.length; i > n; n++) if (1 === this[n].nodeType && (" " + this[n].className + " ").replace(z, " ").indexOf(t) >= 0) return !0;
            return !1;
        },
        val: function (e) {
            var n,
                i,
                r,
                o = this[0];
            return arguments.length
                ? ((r = b.isFunction(e)),
                  this.each(function (n) {
                      var o,
                          a = b(this);
                      1 === this.nodeType &&
                          (null == (o = r ? e.call(this, n, a.val()) : e)
                              ? (o = "")
                              : "number" == typeof o
                              ? (o += "")
                              : b.isArray(o) &&
                                (o = b.map(o, function (e) {
                                    return null == e ? "" : e + "";
                                })),
                          ((i = b.valHooks[this.type] || b.valHooks[this.nodeName.toLowerCase()]) && "set" in i && i.set(this, o, "value") !== t) || (this.value = o));
                  }))
                : o
                ? (i = b.valHooks[o.type] || b.valHooks[o.nodeName.toLowerCase()]) && "get" in i && (n = i.get(o, "value")) !== t
                    ? n
                    : "string" == typeof (n = o.value)
                    ? n.replace(X, "")
                    : null == n
                    ? ""
                    : n
                : void 0;
        },
    }),
        b.extend({
            valHooks: {
                option: {
                    get: function (e) {
                        var t = e.attributes.value;
                        return !t || t.specified ? e.value : e.text;
                    },
                },
                select: {
                    get: function (e) {
                        for (var t, n, i = e.options, r = e.selectedIndex, o = "select-one" === e.type || 0 > r, a = o ? null : [], s = o ? r + 1 : i.length, l = 0 > r ? s : o ? r : 0; s > l; l++)
                            if (!((!(n = i[l]).selected && l !== r) || (b.support.optDisabled ? n.disabled : null !== n.getAttribute("disabled")) || (n.parentNode.disabled && b.nodeName(n.parentNode, "optgroup")))) {
                                if (((t = b(n).val()), o)) return t;
                                a.push(t);
                            }
                        return a;
                    },
                    set: function (e, t) {
                        var n = b.makeArray(t);
                        return (
                            b(e)
                                .find("option")
                                .each(function () {
                                    this.selected = b.inArray(b(this).val(), n) >= 0;
                                }),
                            n.length || (e.selectedIndex = -1),
                            n
                        );
                    },
                },
            },
            attr: function (e, n, i) {
                var o,
                    a,
                    s,
                    l = e.nodeType;
                if (e && 3 !== l && 8 !== l && 2 !== l)
                    return typeof e.getAttribute === r
                        ? b.prop(e, n, i)
                        : ((a = 1 !== l || !b.isXMLDoc(e)) && ((n = n.toLowerCase()), (o = b.attrHooks[n] || (K.test(n) ? $ : I))),
                          i === t
                              ? o && a && "get" in o && null !== (s = o.get(e, n))
                                  ? s
                                  : (typeof e.getAttribute !== r && (s = e.getAttribute(n)), null == s ? t : s)
                              : null !== i
                              ? o && a && "set" in o && (s = o.set(e, i, n)) !== t
                                  ? s
                                  : (e.setAttribute(n, i + ""), i)
                              : (b.removeAttr(e, n), t));
            },
            removeAttr: function (e, t) {
                var n,
                    i,
                    r = 0,
                    o = t && t.match(w);
                if (o && 1 === e.nodeType) for (; (n = o[r++]); ) (i = b.propFix[n] || n), K.test(n) ? (!Q && G.test(n) ? (e[b.camelCase("default-" + n)] = e[i] = !1) : (e[i] = !1)) : b.attr(e, n, ""), e.removeAttribute(Q ? n : i);
            },
            attrHooks: {
                type: {
                    set: function (e, t) {
                        if (!b.support.radioValue && "radio" === t && b.nodeName(e, "input")) {
                            var n = e.value;
                            return e.setAttribute("type", t), n && (e.value = n), t;
                        }
                    },
                },
            },
            propFix: {
                tabindex: "tabIndex",
                readonly: "readOnly",
                for: "htmlFor",
                class: "className",
                maxlength: "maxLength",
                cellspacing: "cellSpacing",
                cellpadding: "cellPadding",
                rowspan: "rowSpan",
                colspan: "colSpan",
                usemap: "useMap",
                frameborder: "frameBorder",
                contenteditable: "contentEditable",
            },
            prop: function (e, n, i) {
                var r,
                    o,
                    a = e.nodeType;
                if (e && 3 !== a && 8 !== a && 2 !== a)
                    return (
                        (1 !== a || !b.isXMLDoc(e)) && ((n = b.propFix[n] || n), (o = b.propHooks[n])), i !== t ? (o && "set" in o && (r = o.set(e, i, n)) !== t ? r : (e[n] = i)) : o && "get" in o && null !== (r = o.get(e, n)) ? r : e[n]
                    );
            },
            propHooks: {
                tabIndex: {
                    get: function (e) {
                        var n = e.getAttributeNode("tabindex");
                        return n && n.specified ? parseInt(n.value, 10) : U.test(e.nodeName) || (V.test(e.nodeName) && e.href) ? 0 : t;
                    },
                },
            },
        }),
        ($ = {
            get: function (e, n) {
                var i = b.prop(e, n),
                    r = "boolean" == typeof i && e.getAttribute(n),
                    o = "boolean" == typeof i ? (J && Q ? null != r : G.test(n) ? e[b.camelCase("default-" + n)] : !!r) : e.getAttributeNode(n);
                return o && !1 !== o.value ? n.toLowerCase() : t;
            },
            set: function (e, t, n) {
                return !1 === t ? b.removeAttr(e, n) : (J && Q) || !G.test(n) ? e.setAttribute((!Q && b.propFix[n]) || n, n) : (e[b.camelCase("default-" + n)] = e[n] = !0), n;
            },
        }),
        (J && Q) ||
            (b.attrHooks.value = {
                get: function (e, n) {
                    var i = e.getAttributeNode(n);
                    return b.nodeName(e, "input") ? e.defaultValue : i && i.specified ? i.value : t;
                },
                set: function (e, n, i) {
                    return b.nodeName(e, "input") ? ((e.defaultValue = n), t) : I && I.set(e, n, i);
                },
            }),
        Q ||
            ((I = b.valHooks.button = {
                get: function (e, n) {
                    var i = e.getAttributeNode(n);
                    return i && ("id" === n || "name" === n || "coords" === n ? "" !== i.value : i.specified) ? i.value : t;
                },
                set: function (e, n, i) {
                    var r = e.getAttributeNode(i);
                    return r || e.setAttributeNode((r = e.ownerDocument.createAttribute(i))), (r.value = n += ""), "value" === i || n === e.getAttribute(i) ? n : t;
                },
            }),
            (b.attrHooks.contenteditable = {
                get: I.get,
                set: function (e, t, n) {
                    I.set(e, "" !== t && t, n);
                },
            }),
            b.each(["width", "height"], function (e, n) {
                b.attrHooks[n] = b.extend(b.attrHooks[n], {
                    set: function (e, i) {
                        return "" === i ? (e.setAttribute(n, "auto"), i) : t;
                    },
                });
            })),
        b.support.hrefNormalized ||
            (b.each(["href", "src", "width", "height"], function (e, n) {
                b.attrHooks[n] = b.extend(b.attrHooks[n], {
                    get: function (e) {
                        var i = e.getAttribute(n, 2);
                        return null == i ? t : i;
                    },
                });
            }),
            b.each(["href", "src"], function (e, t) {
                b.propHooks[t] = {
                    get: function (e) {
                        return e.getAttribute(t, 4);
                    },
                };
            })),
        b.support.style ||
            (b.attrHooks.style = {
                get: function (e) {
                    return e.style.cssText || t;
                },
                set: function (e, t) {
                    return (e.style.cssText = t + "");
                },
            }),
        b.support.optSelected ||
            (b.propHooks.selected = b.extend(b.propHooks.selected, {
                get: function (e) {
                    var t = e.parentNode;
                    return t && (t.selectedIndex, t.parentNode && t.parentNode.selectedIndex), null;
                },
            })),
        b.support.enctype || (b.propFix.enctype = "encoding"),
        b.support.checkOn ||
            b.each(["radio", "checkbox"], function () {
                b.valHooks[this] = {
                    get: function (e) {
                        return null === e.getAttribute("value") ? "on" : e.value;
                    },
                };
            }),
        b.each(["radio", "checkbox"], function () {
            b.valHooks[this] = b.extend(b.valHooks[this], {
                set: function (e, n) {
                    return b.isArray(n) ? (e.checked = b.inArray(b(e).val(), n) >= 0) : t;
                },
            });
        });
    var Y = /^(?:input|select|textarea)$/i,
        Z = /^key/,
        ee = /^(?:mouse|contextmenu)|click/,
        te = /^(?:focusinfocus|focusoutblur)$/,
        ne = /^([^.]*)(?:\.(.+)|)$/;
    function ie() {
        return !0;
    }
    function re() {
        return !1;
    }
    (b.event = {
        global: {},
        add: function (e, n, i, o, a) {
            var s,
                l,
                c,
                u,
                d,
                p,
                f,
                h,
                g,
                m,
                y,
                v = b._data(e);
            if (v) {
                for (
                    i.handler && ((i = (u = i).handler), (a = u.selector)),
                        i.guid || (i.guid = b.guid++),
                        (l = v.events) || (l = v.events = {}),
                        (p = v.handle) ||
                            ((p = v.handle = function (e) {
                                return typeof b === r || (e && b.event.triggered === e.type) ? t : b.event.dispatch.apply(p.elem, arguments);
                            }).elem = e),
                        c = (n = (n || "").match(w) || [""]).length;
                    c--;

                )
                    (g = y = (s = ne.exec(n[c]) || [])[1]),
                        (m = (s[2] || "").split(".").sort()),
                        (d = b.event.special[g] || {}),
                        (g = (a ? d.delegateType : d.bindType) || g),
                        (d = b.event.special[g] || {}),
                        (f = b.extend({ type: g, origType: y, data: o, handler: i, guid: i.guid, selector: a, needsContext: a && b.expr.match.needsContext.test(a), namespace: m.join(".") }, u)),
                        (h = l[g]) || (((h = l[g] = []).delegateCount = 0), (d.setup && !1 !== d.setup.call(e, o, m, p)) || (e.addEventListener ? e.addEventListener(g, p, !1) : e.attachEvent && e.attachEvent("on" + g, p))),
                        d.add && (d.add.call(e, f), f.handler.guid || (f.handler.guid = i.guid)),
                        a ? h.splice(h.delegateCount++, 0, f) : h.push(f),
                        (b.event.global[g] = !0);
                e = null;
            }
        },
        remove: function (e, t, n, i, r) {
            var o,
                a,
                s,
                l,
                c,
                u,
                d,
                p,
                f,
                h,
                g,
                m = b.hasData(e) && b._data(e);
            if (m && (u = m.events)) {
                for (c = (t = (t || "").match(w) || [""]).length; c--; )
                    if (((f = g = (s = ne.exec(t[c]) || [])[1]), (h = (s[2] || "").split(".").sort()), f)) {
                        for (d = b.event.special[f] || {}, p = u[(f = (i ? d.delegateType : d.bindType) || f)] || [], s = s[2] && RegExp("(^|\\.)" + h.join("\\.(?:.*\\.|)") + "(\\.|$)"), l = o = p.length; o--; )
                            (a = p[o]),
                                (!r && g !== a.origType) ||
                                    (n && n.guid !== a.guid) ||
                                    (s && !s.test(a.namespace)) ||
                                    (i && i !== a.selector && ("**" !== i || !a.selector)) ||
                                    (p.splice(o, 1), a.selector && p.delegateCount--, d.remove && d.remove.call(e, a));
                        l && !p.length && ((d.teardown && !1 !== d.teardown.call(e, h, m.handle)) || b.removeEvent(e, f, m.handle), delete u[f]);
                    } else for (f in u) b.event.remove(e, f + t[c], n, i, !0);
                b.isEmptyObject(u) && (delete m.handle, b._removeData(e, "events"));
            }
        },
        trigger: function (n, i, r, a) {
            var s,
                l,
                c,
                u,
                d,
                p,
                f,
                h = [r || o],
                g = y.call(n, "type") ? n.type : n,
                m = y.call(n, "namespace") ? n.namespace.split(".") : [];
            if (
                ((c = p = r = r || o),
                3 !== r.nodeType &&
                    8 !== r.nodeType &&
                    !te.test(g + b.event.triggered) &&
                    (g.indexOf(".") >= 0 && ((m = g.split(".")), (g = m.shift()), m.sort()),
                    (l = 0 > g.indexOf(":") && "on" + g),
                    ((n = n[b.expando] ? n : new b.Event(g, "object" == typeof n && n)).isTrigger = !0),
                    (n.namespace = m.join(".")),
                    (n.namespace_re = n.namespace ? RegExp("(^|\\.)" + m.join("\\.(?:.*\\.|)") + "(\\.|$)") : null),
                    (n.result = t),
                    n.target || (n.target = r),
                    (i = null == i ? [n] : b.makeArray(i, [n])),
                    (d = b.event.special[g] || {}),
                    a || !d.trigger || !1 !== d.trigger.apply(r, i)))
            ) {
                if (!a && !d.noBubble && !b.isWindow(r)) {
                    for (u = d.delegateType || g, te.test(u + g) || (c = c.parentNode); c; c = c.parentNode) h.push(c), (p = c);
                    p === (r.ownerDocument || o) && h.push(p.defaultView || p.parentWindow || e);
                }
                for (f = 0; (c = h[f++]) && !n.isPropagationStopped(); )
                    (n.type = f > 1 ? u : d.bindType || g), (s = (b._data(c, "events") || {})[n.type] && b._data(c, "handle")) && s.apply(c, i), (s = l && c[l]) && b.acceptData(c) && s.apply && !1 === s.apply(c, i) && n.preventDefault();
                if (((n.type = g), !(a || n.isDefaultPrevented() || (d._default && !1 !== d._default.apply(r.ownerDocument, i)) || ("click" === g && b.nodeName(r, "a"))) && b.acceptData(r) && l && r[g] && !b.isWindow(r))) {
                    (p = r[l]) && (r[l] = null), (b.event.triggered = g);
                    try {
                        r[g]();
                    } catch (e) {}
                    (b.event.triggered = t), p && (r[l] = p);
                }
                return n.result;
            }
        },
        dispatch: function (e) {
            e = b.event.fix(e);
            var n,
                i,
                r,
                o,
                a,
                s = [],
                l = h.call(arguments),
                c = (b._data(this, "events") || {})[e.type] || [],
                u = b.event.special[e.type] || {};
            if (((l[0] = e), (e.delegateTarget = this), !u.preDispatch || !1 !== u.preDispatch.call(this, e))) {
                for (s = b.event.handlers.call(this, e, c), n = 0; (o = s[n++]) && !e.isPropagationStopped(); )
                    for (e.currentTarget = o.elem, a = 0; (r = o.handlers[a++]) && !e.isImmediatePropagationStopped(); )
                        (!e.namespace_re || e.namespace_re.test(r.namespace)) &&
                            ((e.handleObj = r), (e.data = r.data), (i = ((b.event.special[r.origType] || {}).handle || r.handler).apply(o.elem, l)) !== t && !1 === (e.result = i) && (e.preventDefault(), e.stopPropagation()));
                return u.postDispatch && u.postDispatch.call(this, e), e.result;
            }
        },
        handlers: function (e, n) {
            var i,
                r,
                o,
                a,
                s = [],
                l = n.delegateCount,
                c = e.target;
            if (l && c.nodeType && (!e.button || "click" !== e.type))
                for (; c != this; c = c.parentNode || this)
                    if (1 === c.nodeType && (!0 !== c.disabled || "click" !== e.type)) {
                        for (o = [], a = 0; l > a; a++) o[(i = (r = n[a]).selector + " ")] === t && (o[i] = r.needsContext ? b(i, this).index(c) >= 0 : b.find(i, this, null, [c]).length), o[i] && o.push(r);
                        o.length && s.push({ elem: c, handlers: o });
                    }
            return n.length > l && s.push({ elem: this, handlers: n.slice(l) }), s;
        },
        fix: function (e) {
            if (e[b.expando]) return e;
            var t,
                n,
                i,
                r = e.type,
                a = e,
                s = this.fixHooks[r];
            for (s || (this.fixHooks[r] = s = ee.test(r) ? this.mouseHooks : Z.test(r) ? this.keyHooks : {}), i = s.props ? this.props.concat(s.props) : this.props, e = new b.Event(a), t = i.length; t--; ) e[(n = i[t])] = a[n];
            return e.target || (e.target = a.srcElement || o), 3 === e.target.nodeType && (e.target = e.target.parentNode), (e.metaKey = !!e.metaKey), s.filter ? s.filter(e, a) : e;
        },
        props: "altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),
        fixHooks: {},
        keyHooks: {
            props: "char charCode key keyCode".split(" "),
            filter: function (e, t) {
                return null == e.which && (e.which = null != t.charCode ? t.charCode : t.keyCode), e;
            },
        },
        mouseHooks: {
            props: "button buttons clientX clientY fromElement offsetX offsetY pageX pageY screenX screenY toElement".split(" "),
            filter: function (e, n) {
                var i,
                    r,
                    a,
                    s = n.button,
                    l = n.fromElement;
                return (
                    null == e.pageX &&
                        null != n.clientX &&
                        ((a = (r = e.target.ownerDocument || o).documentElement),
                        (i = r.body),
                        (e.pageX = n.clientX + ((a && a.scrollLeft) || (i && i.scrollLeft) || 0) - ((a && a.clientLeft) || (i && i.clientLeft) || 0)),
                        (e.pageY = n.clientY + ((a && a.scrollTop) || (i && i.scrollTop) || 0) - ((a && a.clientTop) || (i && i.clientTop) || 0))),
                    !e.relatedTarget && l && (e.relatedTarget = l === e.target ? n.toElement : l),
                    e.which || s === t || (e.which = 1 & s ? 1 : 2 & s ? 3 : 4 & s ? 2 : 0),
                    e
                );
            },
        },
        special: {
            load: { noBubble: !0 },
            click: {
                trigger: function () {
                    return b.nodeName(this, "input") && "checkbox" === this.type && this.click ? (this.click(), !1) : t;
                },
            },
            focus: {
                trigger: function () {
                    if (this !== o.activeElement && this.focus)
                        try {
                            return this.focus(), !1;
                        } catch (e) {}
                },
                delegateType: "focusin",
            },
            blur: {
                trigger: function () {
                    return this === o.activeElement && this.blur ? (this.blur(), !1) : t;
                },
                delegateType: "focusout",
            },
            beforeunload: {
                postDispatch: function (e) {
                    e.result !== t && (e.originalEvent.returnValue = e.result);
                },
            },
        },
        simulate: function (e, t, n, i) {
            var r = b.extend(new b.Event(), n, { type: e, isSimulated: !0, originalEvent: {} });
            i ? b.event.trigger(r, null, t) : b.event.dispatch.call(t, r), r.isDefaultPrevented() && n.preventDefault();
        },
    }),
        (b.removeEvent = o.removeEventListener
            ? function (e, t, n) {
                  e.removeEventListener && e.removeEventListener(t, n, !1);
              }
            : function (e, t, n) {
                  var i = "on" + t;
                  e.detachEvent && (typeof e[i] === r && (e[i] = null), e.detachEvent(i, n));
              }),
        (b.Event = function (e, n) {
            return this instanceof b.Event
                ? (e && e.type ? ((this.originalEvent = e), (this.type = e.type), (this.isDefaultPrevented = e.defaultPrevented || !1 === e.returnValue || (e.getPreventDefault && e.getPreventDefault()) ? ie : re)) : (this.type = e),
                  n && b.extend(this, n),
                  (this.timeStamp = (e && e.timeStamp) || b.now()),
                  (this[b.expando] = !0),
                  t)
                : new b.Event(e, n);
        }),
        (b.Event.prototype = {
            isDefaultPrevented: re,
            isPropagationStopped: re,
            isImmediatePropagationStopped: re,
            preventDefault: function () {
                var e = this.originalEvent;
                (this.isDefaultPrevented = ie), e && (e.preventDefault ? e.preventDefault() : (e.returnValue = !1));
            },
            stopPropagation: function () {
                var e = this.originalEvent;
                (this.isPropagationStopped = ie), e && (e.stopPropagation && e.stopPropagation(), (e.cancelBubble = !0));
            },
            stopImmediatePropagation: function () {
                (this.isImmediatePropagationStopped = ie), this.stopPropagation();
            },
        }),
        b.each({ mouseenter: "mouseover", mouseleave: "mouseout" }, function (e, t) {
            b.event.special[e] = {
                delegateType: t,
                bindType: t,
                handle: function (e) {
                    var n,
                        i = this,
                        r = e.relatedTarget,
                        o = e.handleObj;
                    return (!r || (r !== i && !b.contains(i, r))) && ((e.type = o.origType), (n = o.handler.apply(this, arguments)), (e.type = t)), n;
                },
            };
        }),
        b.support.submitBubbles ||
            (b.event.special.submit = {
                setup: function () {
                    return (
                        !b.nodeName(this, "form") &&
                        (b.event.add(this, "click._submit keypress._submit", function (e) {
                            var n = e.target,
                                i = b.nodeName(n, "input") || b.nodeName(n, "button") ? n.form : t;
                            i &&
                                !b._data(i, "submitBubbles") &&
                                (b.event.add(i, "submit._submit", function (e) {
                                    e._submit_bubble = !0;
                                }),
                                b._data(i, "submitBubbles", !0));
                        }),
                        t)
                    );
                },
                postDispatch: function (e) {
                    e._submit_bubble && (delete e._submit_bubble, this.parentNode && !e.isTrigger && b.event.simulate("submit", this.parentNode, e, !0));
                },
                teardown: function () {
                    return !b.nodeName(this, "form") && (b.event.remove(this, "._submit"), t);
                },
            }),
        b.support.changeBubbles ||
            (b.event.special.change = {
                setup: function () {
                    return Y.test(this.nodeName)
                        ? (("checkbox" === this.type || "radio" === this.type) &&
                              (b.event.add(this, "propertychange._change", function (e) {
                                  "checked" === e.originalEvent.propertyName && (this._just_changed = !0);
                              }),
                              b.event.add(this, "click._change", function (e) {
                                  this._just_changed && !e.isTrigger && (this._just_changed = !1), b.event.simulate("change", this, e, !0);
                              })),
                          !1)
                        : (b.event.add(this, "beforeactivate._change", function (e) {
                              var t = e.target;
                              Y.test(t.nodeName) &&
                                  !b._data(t, "changeBubbles") &&
                                  (b.event.add(t, "change._change", function (e) {
                                      !this.parentNode || e.isSimulated || e.isTrigger || b.event.simulate("change", this.parentNode, e, !0);
                                  }),
                                  b._data(t, "changeBubbles", !0));
                          }),
                          t);
                },
                handle: function (e) {
                    var n = e.target;
                    return this !== n || e.isSimulated || e.isTrigger || ("radio" !== n.type && "checkbox" !== n.type) ? e.handleObj.handler.apply(this, arguments) : t;
                },
                teardown: function () {
                    return b.event.remove(this, "._change"), !Y.test(this.nodeName);
                },
            }),
        b.support.focusinBubbles ||
            b.each({ focus: "focusin", blur: "focusout" }, function (e, t) {
                var n = 0,
                    i = function (e) {
                        b.event.simulate(t, e.target, b.event.fix(e), !0);
                    };
                b.event.special[t] = {
                    setup: function () {
                        0 == n++ && o.addEventListener(e, i, !0);
                    },
                    teardown: function () {
                        0 == --n && o.removeEventListener(e, i, !0);
                    },
                };
            }),
        b.fn.extend({
            on: function (e, n, i, r, o) {
                var a, s;
                if ("object" == typeof e) {
                    for (a in ("string" != typeof n && ((i = i || n), (n = t)), e)) this.on(a, n, i, e[a], o);
                    return this;
                }
                if ((null == i && null == r ? ((r = n), (i = n = t)) : null == r && ("string" == typeof n ? ((r = i), (i = t)) : ((r = i), (i = n), (n = t))), !1 === r)) r = re;
                else if (!r) return this;
                return (
                    1 === o &&
                        ((s = r),
                        ((r = function (e) {
                            return b().off(e), s.apply(this, arguments);
                        }).guid = s.guid || (s.guid = b.guid++))),
                    this.each(function () {
                        b.event.add(this, e, r, i, n);
                    })
                );
            },
            one: function (e, t, n, i) {
                return this.on(e, t, n, i, 1);
            },
            off: function (e, n, i) {
                var r, o;
                if (e && e.preventDefault && e.handleObj) return (r = e.handleObj), b(e.delegateTarget).off(r.namespace ? r.origType + "." + r.namespace : r.origType, r.selector, r.handler), this;
                if ("object" == typeof e) {
                    for (o in e) this.off(o, n, e[o]);
                    return this;
                }
                return (
                    (!1 === n || "function" == typeof n) && ((i = n), (n = t)),
                    !1 === i && (i = re),
                    this.each(function () {
                        b.event.remove(this, e, i, n);
                    })
                );
            },
            bind: function (e, t, n) {
                return this.on(e, null, t, n);
            },
            unbind: function (e, t) {
                return this.off(e, null, t);
            },
            delegate: function (e, t, n, i) {
                return this.on(t, e, n, i);
            },
            undelegate: function (e, t, n) {
                return 1 === arguments.length ? this.off(e, "**") : this.off(t, e || "**", n);
            },
            trigger: function (e, t) {
                return this.each(function () {
                    b.event.trigger(e, t, this);
                });
            },
            triggerHandler: function (e, n) {
                var i = this[0];
                return i ? b.event.trigger(e, n, i, !0) : t;
            },
        }),
        (function (e, t) {
            var n,
                i,
                r,
                o,
                a,
                s,
                l,
                c,
                u,
                d,
                p,
                f,
                h,
                g,
                m,
                y,
                v,
                x = "sizzle" + -new Date(),
                w = e.document,
                k = {},
                C = 0,
                T = 0,
                E = ne(),
                N = ne(),
                j = ne(),
                S = typeof t,
                A = 1 << 31,
                L = [],
                H = L.pop,
                D = L.push,
                P = L.slice,
                M =
                    L.indexOf ||
                    function (e) {
                        for (var t = 0, n = this.length; n > t; t++) if (this[t] === e) return t;
                        return -1;
                    },
                O = "[\\x20\\t\\r\\n\\f]",
                _ = "(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+",
                q = _.replace("w", "w#"),
                F = "\\[" + O + "*(" + _ + ")" + O + "*(?:([*^$|!~]?=)" + O + "*(?:(['\"])((?:\\\\.|[^\\\\])*?)\\3|(" + q + ")|)|)" + O + "*\\]",
                R = ":(" + _ + ")(?:\\(((['\"])((?:\\\\.|[^\\\\])*?)\\3|((?:\\\\.|[^\\\\()[\\]]|" + F.replace(3, 8) + ")*)|.*)\\)|)",
                W = RegExp("^" + O + "+|((?:^|[^\\\\])(?:\\\\.)*)" + O + "+$", "g"),
                B = RegExp("^" + O + "*," + O + "*"),
                I = RegExp("^" + O + "*([\\x20\\t\\r\\n\\f>+~])" + O + "*"),
                $ = RegExp(R),
                z = RegExp("^" + q + "$"),
                X = {
                    ID: RegExp("^#(" + _ + ")"),
                    CLASS: RegExp("^\\.(" + _ + ")"),
                    NAME: RegExp("^\\[name=['\"]?(" + _ + ")['\"]?\\]"),
                    TAG: RegExp("^(" + _.replace("w", "w*") + ")"),
                    ATTR: RegExp("^" + F),
                    PSEUDO: RegExp("^" + R),
                    CHILD: RegExp("^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + O + "*(even|odd|(([+-]|)(\\d*)n|)" + O + "*(?:([+-]|)" + O + "*(\\d+)|))" + O + "*\\)|)", "i"),
                    needsContext: RegExp("^" + O + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" + O + "*((?:-\\d)?\\d*)" + O + "*\\)|)(?=[^-]|$)", "i"),
                },
                U = /[\x20\t\r\n\f]*[+~]/,
                V = /^[^{]+\{\s*\[native code/,
                K = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,
                G = /^(?:input|select|textarea|button)$/i,
                Q = /^h\d$/i,
                J = /'|\\/g,
                Y = /\=[\x20\t\r\n\f]*([^'"\]]*)[\x20\t\r\n\f]*\]/g,
                Z = /\\([\da-fA-F]{1,6}[\x20\t\r\n\f]?|.)/g,
                ee = function (e, t) {
                    var n = "0x" + t - 65536;
                    return n != n ? t : 0 > n ? String.fromCharCode(n + 65536) : String.fromCharCode(55296 | (n >> 10), 56320 | (1023 & n));
                };
            try {
                P.call(w.documentElement.childNodes, 0)[0].nodeType;
            } catch (e) {
                P = function (e) {
                    for (var t, n = []; (t = this[e++]); ) n.push(t);
                    return n;
                };
            }
            function te(e) {
                return V.test(e + "");
            }
            function ne() {
                var e,
                    t = [];
                return (e = function (n, i) {
                    return t.push((n += " ")) > r.cacheLength && delete e[t.shift()], (e[n] = i);
                });
            }
            function ie(e) {
                return (e[x] = !0), e;
            }
            function re(e) {
                var t = d.createElement("div");
                try {
                    return e(t);
                } catch (e) {
                    return !1;
                } finally {
                    t = null;
                }
            }
            function oe(e, t, n, i) {
                var r, o, a, s, l, c, p, g, m, v;
                if (((t ? t.ownerDocument || t : w) !== d && u(t), (n = n || []), !e || "string" != typeof e)) return n;
                if (1 !== (s = (t = t || d).nodeType) && 9 !== s) return [];
                if (!f && !i) {
                    if ((r = K.exec(e)))
                        if ((a = r[1])) {
                            if (9 === s) {
                                if (!(o = t.getElementById(a)) || !o.parentNode) return n;
                                if (o.id === a) return n.push(o), n;
                            } else if (t.ownerDocument && (o = t.ownerDocument.getElementById(a)) && y(t, o) && o.id === a) return n.push(o), n;
                        } else {
                            if (r[2]) return D.apply(n, P.call(t.getElementsByTagName(e), 0)), n;
                            if ((a = r[3]) && k.getByClassName && t.getElementsByClassName) return D.apply(n, P.call(t.getElementsByClassName(a), 0)), n;
                        }
                    if (k.qsa && !h.test(e)) {
                        if (((p = !0), (g = x), (m = t), (v = 9 === s && e), 1 === s && "object" !== t.nodeName.toLowerCase())) {
                            for (c = ue(e), (p = t.getAttribute("id")) ? (g = p.replace(J, "\\$&")) : t.setAttribute("id", g), g = "[id='" + g + "'] ", l = c.length; l--; ) c[l] = g + de(c[l]);
                            (m = (U.test(e) && t.parentNode) || t), (v = c.join(","));
                        }
                        if (v)
                            try {
                                return D.apply(n, P.call(m.querySelectorAll(v), 0)), n;
                            } catch (e) {
                            } finally {
                                p || t.removeAttribute("id");
                            }
                    }
                }
                return ve(e.replace(W, "$1"), t, n, i);
            }
            function ae(e, t) {
                var n = t && e,
                    i = n && (~t.sourceIndex || A) - (~e.sourceIndex || A);
                if (i) return i;
                if (n) for (; (n = n.nextSibling); ) if (n === t) return -1;
                return e ? 1 : -1;
            }
            function se(e) {
                return function (t) {
                    return "input" === t.nodeName.toLowerCase() && t.type === e;
                };
            }
            function le(e) {
                return function (t) {
                    var n = t.nodeName.toLowerCase();
                    return ("input" === n || "button" === n) && t.type === e;
                };
            }
            function ce(e) {
                return ie(function (t) {
                    return (
                        (t = +t),
                        ie(function (n, i) {
                            for (var r, o = e([], n.length, t), a = o.length; a--; ) n[(r = o[a])] && (n[r] = !(i[r] = n[r]));
                        })
                    );
                });
            }
            for (n in ((a = oe.isXML = function (e) {
                var t = e && (e.ownerDocument || e).documentElement;
                return !!t && "HTML" !== t.nodeName;
            }),
            (u = oe.setDocument = function (e) {
                var n = e ? e.ownerDocument || e : w;
                return n !== d && 9 === n.nodeType && n.documentElement
                    ? ((d = n),
                      (p = n.documentElement),
                      (f = a(n)),
                      (k.tagNameNoComments = re(function (e) {
                          return e.appendChild(n.createComment("")), !e.getElementsByTagName("*").length;
                      })),
                      (k.attributes = re(function (e) {
                          e.innerHTML = "<select></select>";
                          var t = typeof e.lastChild.getAttribute("multiple");
                          return "boolean" !== t && "string" !== t;
                      })),
                      (k.getByClassName = re(function (e) {
                          return (
                              (e.innerHTML = "<div class='hidden e'></div><div class='hidden'></div>"),
                              !(!e.getElementsByClassName || !e.getElementsByClassName("e").length) && ((e.lastChild.className = "e"), 2 === e.getElementsByClassName("e").length)
                          );
                      })),
                      (k.getByName = re(function (e) {
                          (e.id = x + 0), (e.innerHTML = "<a name='" + x + "'></a><div name='" + x + "'></div>"), p.insertBefore(e, p.firstChild);
                          var t = n.getElementsByName && n.getElementsByName(x).length === 2 + n.getElementsByName(x + 0).length;
                          return (k.getIdNotName = !n.getElementById(x)), p.removeChild(e), t;
                      })),
                      (r.attrHandle = re(function (e) {
                          return (e.innerHTML = "<a href='#'></a>"), e.firstChild && typeof e.firstChild.getAttribute !== S && "#" === e.firstChild.getAttribute("href");
                      })
                          ? {}
                          : {
                                href: function (e) {
                                    return e.getAttribute("href", 2);
                                },
                                type: function (e) {
                                    return e.getAttribute("type");
                                },
                            }),
                      k.getIdNotName
                          ? ((r.find.ID = function (e, t) {
                                if (typeof t.getElementById !== S && !f) {
                                    var n = t.getElementById(e);
                                    return n && n.parentNode ? [n] : [];
                                }
                            }),
                            (r.filter.ID = function (e) {
                                var t = e.replace(Z, ee);
                                return function (e) {
                                    return e.getAttribute("id") === t;
                                };
                            }))
                          : ((r.find.ID = function (e, n) {
                                if (typeof n.getElementById !== S && !f) {
                                    var i = n.getElementById(e);
                                    return i ? (i.id === e || (typeof i.getAttributeNode !== S && i.getAttributeNode("id").value === e) ? [i] : t) : [];
                                }
                            }),
                            (r.filter.ID = function (e) {
                                var t = e.replace(Z, ee);
                                return function (e) {
                                    var n = typeof e.getAttributeNode !== S && e.getAttributeNode("id");
                                    return n && n.value === t;
                                };
                            })),
                      (r.find.TAG = k.tagNameNoComments
                          ? function (e, n) {
                                return typeof n.getElementsByTagName !== S ? n.getElementsByTagName(e) : t;
                            }
                          : function (e, t) {
                                var n,
                                    i = [],
                                    r = 0,
                                    o = t.getElementsByTagName(e);
                                if ("*" === e) {
                                    for (; (n = o[r++]); ) 1 === n.nodeType && i.push(n);
                                    return i;
                                }
                                return o;
                            }),
                      (r.find.NAME =
                          k.getByName &&
                          function (e, n) {
                              return typeof n.getElementsByName !== S ? n.getElementsByName(name) : t;
                          }),
                      (r.find.CLASS =
                          k.getByClassName &&
                          function (e, n) {
                              return typeof n.getElementsByClassName === S || f ? t : n.getElementsByClassName(e);
                          }),
                      (g = []),
                      (h = [":focus"]),
                      (k.qsa = te(n.querySelectorAll)) &&
                          (re(function (e) {
                              (e.innerHTML = "<select><option selected=''></option></select>"),
                                  e.querySelectorAll("[selected]").length || h.push("\\[" + O + "*(?:checked|disabled|ismap|multiple|readonly|selected|value)"),
                                  e.querySelectorAll(":checked").length || h.push(":checked");
                          }),
                          re(function (e) {
                              (e.innerHTML = "<input type='hidden' i=''/>"),
                                  e.querySelectorAll("[i^='']").length && h.push("[*^$]=" + O + "*(?:\"\"|'')"),
                                  e.querySelectorAll(":enabled").length || h.push(":enabled", ":disabled"),
                                  e.querySelectorAll("*,:x"),
                                  h.push(",.*:");
                          })),
                      (k.matchesSelector = te((m = p.matchesSelector || p.mozMatchesSelector || p.webkitMatchesSelector || p.oMatchesSelector || p.msMatchesSelector))) &&
                          re(function (e) {
                              (k.disconnectedMatch = m.call(e, "div")), m.call(e, "[s!='']:x"), g.push("!=", R);
                          }),
                      (h = RegExp(h.join("|"))),
                      (g = RegExp(g.join("|"))),
                      (y =
                          te(p.contains) || p.compareDocumentPosition
                              ? function (e, t) {
                                    var n = 9 === e.nodeType ? e.documentElement : e,
                                        i = t && t.parentNode;
                                    return e === i || !(!i || 1 !== i.nodeType || !(n.contains ? n.contains(i) : e.compareDocumentPosition && 16 & e.compareDocumentPosition(i)));
                                }
                              : function (e, t) {
                                    if (t) for (; (t = t.parentNode); ) if (t === e) return !0;
                                    return !1;
                                }),
                      (v = p.compareDocumentPosition
                          ? function (e, t) {
                                var i;
                                return e === t
                                    ? ((l = !0), 0)
                                    : (i = t.compareDocumentPosition && e.compareDocumentPosition && e.compareDocumentPosition(t))
                                    ? 1 & i || (e.parentNode && 11 === e.parentNode.nodeType)
                                        ? e === n || y(w, e)
                                            ? -1
                                            : t === n || y(w, t)
                                            ? 1
                                            : 0
                                        : 4 & i
                                        ? -1
                                        : 1
                                    : e.compareDocumentPosition
                                    ? -1
                                    : 1;
                            }
                          : function (e, t) {
                                var i,
                                    r = 0,
                                    o = e.parentNode,
                                    a = t.parentNode,
                                    s = [e],
                                    c = [t];
                                if (e === t) return (l = !0), 0;
                                if (!o || !a) return e === n ? -1 : t === n ? 1 : o ? -1 : a ? 1 : 0;
                                if (o === a) return ae(e, t);
                                for (i = e; (i = i.parentNode); ) s.unshift(i);
                                for (i = t; (i = i.parentNode); ) c.unshift(i);
                                for (; s[r] === c[r]; ) r++;
                                return r ? ae(s[r], c[r]) : s[r] === w ? -1 : c[r] === w ? 1 : 0;
                            }),
                      (l = !1),
                      [0, 0].sort(v),
                      (k.detectDuplicates = l),
                      d)
                    : d;
            }),
            (oe.matches = function (e, t) {
                return oe(e, null, null, t);
            }),
            (oe.matchesSelector = function (e, t) {
                if (((e.ownerDocument || e) !== d && u(e), (t = t.replace(Y, "='$1']")), !(!k.matchesSelector || f || (g && g.test(t)) || h.test(t))))
                    try {
                        var n = m.call(e, t);
                        if (n || k.disconnectedMatch || (e.document && 11 !== e.document.nodeType)) return n;
                    } catch (e) {}
                return oe(t, d, null, [e]).length > 0;
            }),
            (oe.contains = function (e, t) {
                return (e.ownerDocument || e) !== d && u(e), y(e, t);
            }),
            (oe.attr = function (e, t) {
                var n;
                return (
                    (e.ownerDocument || e) !== d && u(e),
                    f || (t = t.toLowerCase()),
                    (n = r.attrHandle[t]) ? n(e) : f || k.attributes ? e.getAttribute(t) : ((n = e.getAttributeNode(t)) || e.getAttribute(t)) && !0 === e[t] ? t : n && n.specified ? n.value : null
                );
            }),
            (oe.error = function (e) {
                throw Error("Syntax error, unrecognized expression: " + e);
            }),
            (oe.uniqueSort = function (e) {
                var t,
                    n = [],
                    i = 1,
                    r = 0;
                if (((l = !k.detectDuplicates), e.sort(v), l)) {
                    for (; (t = e[i]); i++) t === e[i - 1] && (r = n.push(i));
                    for (; r--; ) e.splice(n[r], 1);
                }
                return e;
            }),
            (o = oe.getText = function (e) {
                var t,
                    n = "",
                    i = 0,
                    r = e.nodeType;
                if (r) {
                    if (1 === r || 9 === r || 11 === r) {
                        if ("string" == typeof e.textContent) return e.textContent;
                        for (e = e.firstChild; e; e = e.nextSibling) n += o(e);
                    } else if (3 === r || 4 === r) return e.nodeValue;
                } else for (; (t = e[i]); i++) n += o(t);
                return n;
            }),
            (r = oe.selectors = {
                cacheLength: 50,
                createPseudo: ie,
                match: X,
                find: {},
                relative: { ">": { dir: "parentNode", first: !0 }, " ": { dir: "parentNode" }, "+": { dir: "previousSibling", first: !0 }, "~": { dir: "previousSibling" } },
                preFilter: {
                    ATTR: function (e) {
                        return (e[1] = e[1].replace(Z, ee)), (e[3] = (e[4] || e[5] || "").replace(Z, ee)), "~=" === e[2] && (e[3] = " " + e[3] + " "), e.slice(0, 4);
                    },
                    CHILD: function (e) {
                        return (
                            (e[1] = e[1].toLowerCase()),
                            "nth" === e[1].slice(0, 3) ? (e[3] || oe.error(e[0]), (e[4] = +(e[4] ? e[5] + (e[6] || 1) : 2 * ("even" === e[3] || "odd" === e[3]))), (e[5] = +(e[7] + e[8] || "odd" === e[3]))) : e[3] && oe.error(e[0]),
                            e
                        );
                    },
                    PSEUDO: function (e) {
                        var t,
                            n = !e[5] && e[2];
                        return X.CHILD.test(e[0]) ? null : (e[4] ? (e[2] = e[4]) : n && $.test(n) && (t = ue(n, !0)) && (t = n.indexOf(")", n.length - t) - n.length) && ((e[0] = e[0].slice(0, t)), (e[2] = n.slice(0, t))), e.slice(0, 3));
                    },
                },
                filter: {
                    TAG: function (e) {
                        return "*" === e
                            ? function () {
                                  return !0;
                              }
                            : ((e = e.replace(Z, ee).toLowerCase()),
                              function (t) {
                                  return t.nodeName && t.nodeName.toLowerCase() === e;
                              });
                    },
                    CLASS: function (e) {
                        var t = E[e + " "];
                        return (
                            t ||
                            ((t = RegExp("(^|" + O + ")" + e + "(" + O + "|$)")) &&
                                E(e, function (e) {
                                    return t.test(e.className || (typeof e.getAttribute !== S && e.getAttribute("class")) || "");
                                }))
                        );
                    },
                    ATTR: function (e, t, n) {
                        return function (i) {
                            var r = oe.attr(i, e);
                            return null == r
                                ? "!=" === t
                                : !t ||
                                      ((r += ""),
                                      "=" === t
                                          ? r === n
                                          : "!=" === t
                                          ? r !== n
                                          : "^=" === t
                                          ? n && 0 === r.indexOf(n)
                                          : "*=" === t
                                          ? n && r.indexOf(n) > -1
                                          : "$=" === t
                                          ? n && r.slice(-n.length) === n
                                          : "~=" === t
                                          ? (" " + r + " ").indexOf(n) > -1
                                          : "|=" === t && (r === n || r.slice(0, n.length + 1) === n + "-"));
                        };
                    },
                    CHILD: function (e, t, n, i, r) {
                        var o = "nth" !== e.slice(0, 3),
                            a = "last" !== e.slice(-4),
                            s = "of-type" === t;
                        return 1 === i && 0 === r
                            ? function (e) {
                                  return !!e.parentNode;
                              }
                            : function (t, n, l) {
                                  var c,
                                      u,
                                      d,
                                      p,
                                      f,
                                      h,
                                      g = o !== a ? "nextSibling" : "previousSibling",
                                      m = t.parentNode,
                                      y = s && t.nodeName.toLowerCase(),
                                      v = !l && !s;
                                  if (m) {
                                      if (o) {
                                          for (; g; ) {
                                              for (d = t; (d = d[g]); ) if (s ? d.nodeName.toLowerCase() === y : 1 === d.nodeType) return !1;
                                              h = g = "only" === e && !h && "nextSibling";
                                          }
                                          return !0;
                                      }
                                      if (((h = [a ? m.firstChild : m.lastChild]), a && v)) {
                                          for (f = (c = (u = m[x] || (m[x] = {}))[e] || [])[0] === C && c[1], p = c[0] === C && c[2], d = f && m.childNodes[f]; (d = (++f && d && d[g]) || (p = f = 0) || h.pop()); )
                                              if (1 === d.nodeType && ++p && d === t) {
                                                  u[e] = [C, f, p];
                                                  break;
                                              }
                                      } else if (v && (c = (t[x] || (t[x] = {}))[e]) && c[0] === C) p = c[1];
                                      else for (; (d = (++f && d && d[g]) || (p = f = 0) || h.pop()) && ((s ? d.nodeName.toLowerCase() !== y : 1 !== d.nodeType) || !++p || (v && ((d[x] || (d[x] = {}))[e] = [C, p]), d !== t)); );
                                      return (p -= r) === i || (0 == p % i && p / i >= 0);
                                  }
                              };
                    },
                    PSEUDO: function (e, t) {
                        var n,
                            i = r.pseudos[e] || r.setFilters[e.toLowerCase()] || oe.error("unsupported pseudo: " + e);
                        return i[x]
                            ? i(t)
                            : i.length > 1
                            ? ((n = [e, e, "", t]),
                              r.setFilters.hasOwnProperty(e.toLowerCase())
                                  ? ie(function (e, n) {
                                        for (var r, o = i(e, t), a = o.length; a--; ) e[(r = M.call(e, o[a]))] = !(n[r] = o[a]);
                                    })
                                  : function (e) {
                                        return i(e, 0, n);
                                    })
                            : i;
                    },
                },
                pseudos: {
                    not: ie(function (e) {
                        var t = [],
                            n = [],
                            i = s(e.replace(W, "$1"));
                        return i[x]
                            ? ie(function (e, t, n, r) {
                                  for (var o, a = i(e, null, r, []), s = e.length; s--; ) (o = a[s]) && (e[s] = !(t[s] = o));
                              })
                            : function (e, r, o) {
                                  return (t[0] = e), i(t, null, o, n), !n.pop();
                              };
                    }),
                    has: ie(function (e) {
                        return function (t) {
                            return oe(e, t).length > 0;
                        };
                    }),
                    contains: ie(function (e) {
                        return function (t) {
                            return (t.textContent || t.innerText || o(t)).indexOf(e) > -1;
                        };
                    }),
                    lang: ie(function (e) {
                        return (
                            z.test(e || "") || oe.error("unsupported lang: " + e),
                            (e = e.replace(Z, ee).toLowerCase()),
                            function (t) {
                                var n;
                                do {
                                    if ((n = f ? t.getAttribute("xml:lang") || t.getAttribute("lang") : t.lang)) return (n = n.toLowerCase()) === e || 0 === n.indexOf(e + "-");
                                } while ((t = t.parentNode) && 1 === t.nodeType);
                                return !1;
                            }
                        );
                    }),
                    target: function (t) {
                        var n = e.location && e.location.hash;
                        return n && n.slice(1) === t.id;
                    },
                    root: function (e) {
                        return e === p;
                    },
                    focus: function (e) {
                        return e === d.activeElement && (!d.hasFocus || d.hasFocus()) && !!(e.type || e.href || ~e.tabIndex);
                    },
                    enabled: function (e) {
                        return !1 === e.disabled;
                    },
                    disabled: function (e) {
                        return !0 === e.disabled;
                    },
                    checked: function (e) {
                        var t = e.nodeName.toLowerCase();
                        return ("input" === t && !!e.checked) || ("option" === t && !!e.selected);
                    },
                    selected: function (e) {
                        return e.parentNode && e.parentNode.selectedIndex, !0 === e.selected;
                    },
                    empty: function (e) {
                        for (e = e.firstChild; e; e = e.nextSibling) if (e.nodeName > "@" || 3 === e.nodeType || 4 === e.nodeType) return !1;
                        return !0;
                    },
                    parent: function (e) {
                        return !r.pseudos.empty(e);
                    },
                    header: function (e) {
                        return Q.test(e.nodeName);
                    },
                    input: function (e) {
                        return G.test(e.nodeName);
                    },
                    button: function (e) {
                        var t = e.nodeName.toLowerCase();
                        return ("input" === t && "button" === e.type) || "button" === t;
                    },
                    text: function (e) {
                        var t;
                        return "input" === e.nodeName.toLowerCase() && "text" === e.type && (null == (t = e.getAttribute("type")) || t.toLowerCase() === e.type);
                    },
                    first: ce(function () {
                        return [0];
                    }),
                    last: ce(function (e, t) {
                        return [t - 1];
                    }),
                    eq: ce(function (e, t, n) {
                        return [0 > n ? n + t : n];
                    }),
                    even: ce(function (e, t) {
                        for (var n = 0; t > n; n += 2) e.push(n);
                        return e;
                    }),
                    odd: ce(function (e, t) {
                        for (var n = 1; t > n; n += 2) e.push(n);
                        return e;
                    }),
                    lt: ce(function (e, t, n) {
                        for (var i = 0 > n ? n + t : n; --i >= 0; ) e.push(i);
                        return e;
                    }),
                    gt: ce(function (e, t, n) {
                        for (var i = 0 > n ? n + t : n; t > ++i; ) e.push(i);
                        return e;
                    }),
                },
            }),
            { radio: !0, checkbox: !0, file: !0, password: !0, image: !0 }))
                r.pseudos[n] = se(n);
            for (n in { submit: !0, reset: !0 }) r.pseudos[n] = le(n);
            function ue(e, t) {
                var n,
                    i,
                    o,
                    a,
                    s,
                    l,
                    c,
                    u = N[e + " "];
                if (u) return t ? 0 : u.slice(0);
                for (s = e, l = [], c = r.preFilter; s; ) {
                    for (a in ((!n || (i = B.exec(s))) && (i && (s = s.slice(i[0].length) || s), l.push((o = []))),
                    (n = !1),
                    (i = I.exec(s)) && ((n = i.shift()), o.push({ value: n, type: i[0].replace(W, " ") }), (s = s.slice(n.length))),
                    r.filter))
                        !(i = X[a].exec(s)) || (c[a] && !(i = c[a](i))) || ((n = i.shift()), o.push({ value: n, type: a, matches: i }), (s = s.slice(n.length)));
                    if (!n) break;
                }
                return t ? s.length : s ? oe.error(e) : N(e, l).slice(0);
            }
            function de(e) {
                for (var t = 0, n = e.length, i = ""; n > t; t++) i += e[t].value;
                return i;
            }
            function pe(e, t, n) {
                var r = t.dir,
                    o = n && "parentNode" === r,
                    a = T++;
                return t.first
                    ? function (t, n, i) {
                          for (; (t = t[r]); ) if (1 === t.nodeType || o) return e(t, n, i);
                      }
                    : function (t, n, s) {
                          var l,
                              c,
                              u,
                              d = C + " " + a;
                          if (s) {
                              for (; (t = t[r]); ) if ((1 === t.nodeType || o) && e(t, n, s)) return !0;
                          } else
                              for (; (t = t[r]); )
                                  if (1 === t.nodeType || o)
                                      if ((c = (u = t[x] || (t[x] = {}))[r]) && c[0] === d) {
                                          if (!0 === (l = c[1]) || l === i) return !0 === l;
                                      } else if ((((c = u[r] = [d])[1] = e(t, n, s) || i), !0 === c[1])) return !0;
                      };
            }
            function fe(e) {
                return e.length > 1
                    ? function (t, n, i) {
                          for (var r = e.length; r--; ) if (!e[r](t, n, i)) return !1;
                          return !0;
                      }
                    : e[0];
            }
            function he(e, t, n, i, r) {
                for (var o, a = [], s = 0, l = e.length, c = null != t; l > s; s++) (o = e[s]) && (!n || n(o, i, r)) && (a.push(o), c && t.push(s));
                return a;
            }
            function ge(e, t, n, i, r, o) {
                return (
                    i && !i[x] && (i = ge(i)),
                    r && !r[x] && (r = ge(r, o)),
                    ie(function (o, a, s, l) {
                        var c,
                            u,
                            d,
                            p = [],
                            f = [],
                            h = a.length,
                            g =
                                o ||
                                (function (e, t, n) {
                                    for (var i = 0, r = t.length; r > i; i++) oe(e, t[i], n);
                                    return n;
                                })(t || "*", s.nodeType ? [s] : s, []),
                            m = !e || (!o && t) ? g : he(g, p, e, s, l),
                            y = n ? (r || (o ? e : h || i) ? [] : a) : m;
                        if ((n && n(m, y, s, l), i)) for (c = he(y, f), i(c, [], s, l), u = c.length; u--; ) (d = c[u]) && (y[f[u]] = !(m[f[u]] = d));
                        if (o) {
                            if (r || e) {
                                if (r) {
                                    for (c = [], u = y.length; u--; ) (d = y[u]) && c.push((m[u] = d));
                                    r(null, (y = []), c, l);
                                }
                                for (u = y.length; u--; ) (d = y[u]) && (c = r ? M.call(o, d) : p[u]) > -1 && (o[c] = !(a[c] = d));
                            }
                        } else (y = he(y === a ? y.splice(h, y.length) : y)), r ? r(null, a, y, l) : D.apply(a, y);
                    })
                );
            }
            function me(e) {
                for (
                    var t,
                        n,
                        i,
                        o = e.length,
                        a = r.relative[e[0].type],
                        s = a || r.relative[" "],
                        l = a ? 1 : 0,
                        u = pe(
                            function (e) {
                                return e === t;
                            },
                            s,
                            !0
                        ),
                        d = pe(
                            function (e) {
                                return M.call(t, e) > -1;
                            },
                            s,
                            !0
                        ),
                        p = [
                            function (e, n, i) {
                                return (!a && (i || n !== c)) || ((t = n).nodeType ? u(e, n, i) : d(e, n, i));
                            },
                        ];
                    o > l;
                    l++
                )
                    if ((n = r.relative[e[l].type])) p = [pe(fe(p), n)];
                    else {
                        if ((n = r.filter[e[l].type].apply(null, e[l].matches))[x]) {
                            for (i = ++l; o > i && !r.relative[e[i].type]; i++);
                            return ge(l > 1 && fe(p), l > 1 && de(e.slice(0, l - 1)).replace(W, "$1"), n, i > l && me(e.slice(l, i)), o > i && me((e = e.slice(i))), o > i && de(e));
                        }
                        p.push(n);
                    }
                return fe(p);
            }
            function ye(e, t) {
                var n = 0,
                    o = t.length > 0,
                    a = e.length > 0,
                    s = function (s, l, u, p, f) {
                        var h,
                            g,
                            m,
                            y = [],
                            v = 0,
                            b = "0",
                            x = s && [],
                            w = null != f,
                            k = c,
                            T = s || (a && r.find.TAG("*", (f && l.parentNode) || l)),
                            E = (C += null == k ? 1 : Math.random() || 0.1);
                        for (w && ((c = l !== d && l), (i = n)); null != (h = T[b]); b++) {
                            if (a && h) {
                                for (g = 0; (m = e[g++]); )
                                    if (m(h, l, u)) {
                                        p.push(h);
                                        break;
                                    }
                                w && ((C = E), (i = ++n));
                            }
                            o && ((h = !m && h) && v--, s && x.push(h));
                        }
                        if (((v += b), o && b !== v)) {
                            for (g = 0; (m = t[g++]); ) m(x, y, l, u);
                            if (s) {
                                if (v > 0) for (; b--; ) x[b] || y[b] || (y[b] = H.call(p));
                                y = he(y);
                            }
                            D.apply(p, y), w && !s && y.length > 0 && v + t.length > 1 && oe.uniqueSort(p);
                        }
                        return w && ((C = E), (c = k)), x;
                    };
                return o ? ie(s) : s;
            }
            function ve(e, t, n, i) {
                var o,
                    a,
                    l,
                    c,
                    u,
                    d = ue(e);
                if (!i && 1 === d.length) {
                    if ((a = d[0] = d[0].slice(0)).length > 2 && "ID" === (l = a[0]).type && 9 === t.nodeType && !f && r.relative[a[1].type]) {
                        if (!(t = r.find.ID(l.matches[0].replace(Z, ee), t)[0])) return n;
                        e = e.slice(a.shift().value.length);
                    }
                    for (o = X.needsContext.test(e) ? 0 : a.length; o-- && ((l = a[o]), !r.relative[(c = l.type)]); )
                        if ((u = r.find[c]) && (i = u(l.matches[0].replace(Z, ee), (U.test(a[0].type) && t.parentNode) || t))) {
                            if ((a.splice(o, 1), !(e = i.length && de(a)))) return D.apply(n, P.call(i, 0)), n;
                            break;
                        }
                }
                return s(e, d)(i, t, f, n, U.test(e)), n;
            }
            function be() {}
            (s = oe.compile = function (e, t) {
                var n,
                    i = [],
                    r = [],
                    o = j[e + " "];
                if (!o) {
                    for (t || (t = ue(e)), n = t.length; n--; ) (o = me(t[n]))[x] ? i.push(o) : r.push(o);
                    o = j(e, ye(r, i));
                }
                return o;
            }),
                (r.pseudos.nth = r.pseudos.eq),
                (r.filters = be.prototype = r.pseudos),
                (r.setFilters = new be()),
                u(),
                (oe.attr = b.attr),
                (b.find = oe),
                (b.expr = oe.selectors),
                (b.expr[":"] = b.expr.pseudos),
                (b.unique = oe.uniqueSort),
                (b.text = oe.getText),
                (b.isXMLDoc = oe.isXML),
                (b.contains = oe.contains);
        })(e);
    var oe = /Until$/,
        ae = /^(?:parents|prev(?:Until|All))/,
        se = /^.[^:#\[\.,]*$/,
        le = b.expr.match.needsContext,
        ce = { children: !0, contents: !0, next: !0, prev: !0 };
    function ue(e, t) {
        do {
            e = e[t];
        } while (e && 1 !== e.nodeType);
        return e;
    }
    function de(e, t, n) {
        if (((t = t || 0), b.isFunction(t)))
            return b.grep(e, function (e, i) {
                return !!t.call(e, i, e) === n;
            });
        if (t.nodeType)
            return b.grep(e, function (e) {
                return (e === t) === n;
            });
        if ("string" == typeof t) {
            var i = b.grep(e, function (e) {
                return 1 === e.nodeType;
            });
            if (se.test(t)) return b.filter(t, i, !n);
            t = b.filter(t, i);
        }
        return b.grep(e, function (e) {
            return b.inArray(e, t) >= 0 === n;
        });
    }
    function pe(e) {
        var t = fe.split("|"),
            n = e.createDocumentFragment();
        if (n.createElement) for (; t.length; ) n.createElement(t.pop());
        return n;
    }
    b.fn.extend({
        find: function (e) {
            var t,
                n,
                i,
                r = this.length;
            if ("string" != typeof e)
                return (
                    (i = this),
                    this.pushStack(
                        b(e).filter(function () {
                            for (t = 0; r > t; t++) if (b.contains(i[t], this)) return !0;
                        })
                    )
                );
            for (n = [], t = 0; r > t; t++) b.find(e, this[t], n);
            return ((n = this.pushStack(r > 1 ? b.unique(n) : n)).selector = (this.selector ? this.selector + " " : "") + e), n;
        },
        has: function (e) {
            var t,
                n = b(e, this),
                i = n.length;
            return this.filter(function () {
                for (t = 0; i > t; t++) if (b.contains(this, n[t])) return !0;
            });
        },
        not: function (e) {
            return this.pushStack(de(this, e, !1));
        },
        filter: function (e) {
            return this.pushStack(de(this, e, !0));
        },
        is: function (e) {
            return !!e && ("string" == typeof e ? (le.test(e) ? b(e, this.context).index(this[0]) >= 0 : b.filter(e, this).length > 0) : this.filter(e).length > 0);
        },
        closest: function (e, t) {
            for (var n, i = 0, r = this.length, o = [], a = le.test(e) || "string" != typeof e ? b(e, t || this.context) : 0; r > i; i++)
                for (n = this[i]; n && n.ownerDocument && n !== t && 11 !== n.nodeType; ) {
                    if (a ? a.index(n) > -1 : b.find.matchesSelector(n, e)) {
                        o.push(n);
                        break;
                    }
                    n = n.parentNode;
                }
            return this.pushStack(o.length > 1 ? b.unique(o) : o);
        },
        index: function (e) {
            return e ? ("string" == typeof e ? b.inArray(this[0], b(e)) : b.inArray(e.jquery ? e[0] : e, this)) : this[0] && this[0].parentNode ? this.first().prevAll().length : -1;
        },
        add: function (e, t) {
            var n = "string" == typeof e ? b(e, t) : b.makeArray(e && e.nodeType ? [e] : e),
                i = b.merge(this.get(), n);
            return this.pushStack(b.unique(i));
        },
        addBack: function (e) {
            return this.add(null == e ? this.prevObject : this.prevObject.filter(e));
        },
    }),
        (b.fn.andSelf = b.fn.addBack),
        b.each(
            {
                parent: function (e) {
                    var t = e.parentNode;
                    return t && 11 !== t.nodeType ? t : null;
                },
                parents: function (e) {
                    return b.dir(e, "parentNode");
                },
                parentsUntil: function (e, t, n) {
                    return b.dir(e, "parentNode", n);
                },
                next: function (e) {
                    return ue(e, "nextSibling");
                },
                prev: function (e) {
                    return ue(e, "previousSibling");
                },
                nextAll: function (e) {
                    return b.dir(e, "nextSibling");
                },
                prevAll: function (e) {
                    return b.dir(e, "previousSibling");
                },
                nextUntil: function (e, t, n) {
                    return b.dir(e, "nextSibling", n);
                },
                prevUntil: function (e, t, n) {
                    return b.dir(e, "previousSibling", n);
                },
                siblings: function (e) {
                    return b.sibling((e.parentNode || {}).firstChild, e);
                },
                children: function (e) {
                    return b.sibling(e.firstChild);
                },
                contents: function (e) {
                    return b.nodeName(e, "iframe") ? e.contentDocument || e.contentWindow.document : b.merge([], e.childNodes);
                },
            },
            function (e, t) {
                b.fn[e] = function (n, i) {
                    var r = b.map(this, t, n);
                    return oe.test(e) || (i = n), i && "string" == typeof i && (r = b.filter(i, r)), (r = this.length > 1 && !ce[e] ? b.unique(r) : r), this.length > 1 && ae.test(e) && (r = r.reverse()), this.pushStack(r);
                };
            }
        ),
        b.extend({
            filter: function (e, t, n) {
                return n && (e = ":not(" + e + ")"), 1 === t.length ? (b.find.matchesSelector(t[0], e) ? [t[0]] : []) : b.find.matches(e, t);
            },
            dir: function (e, n, i) {
                for (var r = [], o = e[n]; o && 9 !== o.nodeType && (i === t || 1 !== o.nodeType || !b(o).is(i)); ) 1 === o.nodeType && r.push(o), (o = o[n]);
                return r;
            },
            sibling: function (e, t) {
                for (var n = []; e; e = e.nextSibling) 1 === e.nodeType && e !== t && n.push(e);
                return n;
            },
        });
    var fe = "abbr|article|aside|audio|bdi|canvas|data|datalist|details|figcaption|figure|footer|header|hgroup|mark|meter|nav|output|progress|section|summary|time|video",
        he = / jQuery\d+="(?:null|\d+)"/g,
        ge = RegExp("<(?:" + fe + ")[\\s/>]", "i"),
        me = /^\s+/,
        ye = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi,
        ve = /<([\w:]+)/,
        be = /<tbody/i,
        xe = /<|&#?\w+;/,
        we = /<(?:script|style|link)/i,
        ke = /^(?:checkbox|radio)$/i,
        Ce = /checked\s*(?:[^=]|=\s*.checked.)/i,
        Te = /^$|\/(?:java|ecma)script/i,
        Ee = /^true\/(.*)/,
        Ne = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g,
        je = {
            option: [1, "<select multiple='multiple'>", "</select>"],
            legend: [1, "<fieldset>", "</fieldset>"],
            area: [1, "<map>", "</map>"],
            param: [1, "<object>", "</object>"],
            thead: [1, "<table>", "</table>"],
            tr: [2, "<table><tbody>", "</tbody></table>"],
            col: [2, "<table><tbody></tbody><colgroup>", "</colgroup></table>"],
            td: [3, "<table><tbody><tr>", "</tr></tbody></table>"],
            _default: b.support.htmlSerialize ? [0, "", ""] : [1, "X<div>", "</div>"],
        },
        Se = pe(o).appendChild(o.createElement("div"));
    function Ae(e, t) {
        return e.getElementsByTagName(t)[0] || e.appendChild(e.ownerDocument.createElement(t));
    }
    function Le(e) {
        var t = e.getAttributeNode("type");
        return (e.type = (t && t.specified) + "/" + e.type), e;
    }
    function He(e) {
        var t = Ee.exec(e.type);
        return t ? (e.type = t[1]) : e.removeAttribute("type"), e;
    }
    function De(e, t) {
        for (var n, i = 0; null != (n = e[i]); i++) b._data(n, "globalEval", !t || b._data(t[i], "globalEval"));
    }
    function Pe(e, t) {
        if (1 === t.nodeType && b.hasData(e)) {
            var n,
                i,
                r,
                o = b._data(e),
                a = b._data(t, o),
                s = o.events;
            if (s) for (n in (delete a.handle, (a.events = {}), s)) for (i = 0, r = s[n].length; r > i; i++) b.event.add(t, n, s[n][i]);
            a.data && (a.data = b.extend({}, a.data));
        }
    }
    function Me(e, t) {
        var n, i, r;
        if (1 === t.nodeType) {
            if (((n = t.nodeName.toLowerCase()), !b.support.noCloneEvent && t[b.expando])) {
                for (i in (r = b._data(t)).events) b.removeEvent(t, i, r.handle);
                t.removeAttribute(b.expando);
            }
            "script" === n && t.text !== e.text
                ? ((Le(t).text = e.text), He(t))
                : "object" === n
                ? (t.parentNode && (t.outerHTML = e.outerHTML), b.support.html5Clone && e.innerHTML && !b.trim(t.innerHTML) && (t.innerHTML = e.innerHTML))
                : "input" === n && ke.test(e.type)
                ? ((t.defaultChecked = t.checked = e.checked), t.value !== e.value && (t.value = e.value))
                : "option" === n
                ? (t.defaultSelected = t.selected = e.defaultSelected)
                : ("input" === n || "textarea" === n) && (t.defaultValue = e.defaultValue);
        }
    }
    function Oe(e, n) {
        var i,
            o,
            a = 0,
            s = typeof e.getElementsByTagName !== r ? e.getElementsByTagName(n || "*") : typeof e.querySelectorAll !== r ? e.querySelectorAll(n || "*") : t;
        if (!s) for (s = [], i = e.childNodes || e; null != (o = i[a]); a++) !n || b.nodeName(o, n) ? s.push(o) : b.merge(s, Oe(o, n));
        return n === t || (n && b.nodeName(e, n)) ? b.merge([e], s) : s;
    }
    function _e(e) {
        ke.test(e.type) && (e.defaultChecked = e.checked);
    }
    (je.optgroup = je.option),
        (je.tbody = je.tfoot = je.colgroup = je.caption = je.thead),
        (je.th = je.td),
        b.fn.extend({
            text: function (e) {
                return b.access(
                    this,
                    function (e) {
                        return e === t ? b.text(this) : this.empty().append(((this[0] && this[0].ownerDocument) || o).createTextNode(e));
                    },
                    null,
                    e,
                    arguments.length
                );
            },
            wrapAll: function (e) {
                if (b.isFunction(e))
                    return this.each(function (t) {
                        b(this).wrapAll(e.call(this, t));
                    });
                if (this[0]) {
                    var t = b(e, this[0].ownerDocument).eq(0).clone(!0);
                    this[0].parentNode && t.insertBefore(this[0]),
                        t
                            .map(function () {
                                for (var e = this; e.firstChild && 1 === e.firstChild.nodeType; ) e = e.firstChild;
                                return e;
                            })
                            .append(this);
                }
                return this;
            },
            wrapInner: function (e) {
                return b.isFunction(e)
                    ? this.each(function (t) {
                          b(this).wrapInner(e.call(this, t));
                      })
                    : this.each(function () {
                          var t = b(this),
                              n = t.contents();
                          n.length ? n.wrapAll(e) : t.append(e);
                      });
            },
            wrap: function (e) {
                var t = b.isFunction(e);
                return this.each(function (n) {
                    b(this).wrapAll(t ? e.call(this, n) : e);
                });
            },
            unwrap: function () {
                return this.parent()
                    .each(function () {
                        b.nodeName(this, "body") || b(this).replaceWith(this.childNodes);
                    })
                    .end();
            },
            append: function () {
                return this.domManip(arguments, !0, function (e) {
                    (1 === this.nodeType || 11 === this.nodeType || 9 === this.nodeType) && this.appendChild(e);
                });
            },
            prepend: function () {
                return this.domManip(arguments, !0, function (e) {
                    (1 === this.nodeType || 11 === this.nodeType || 9 === this.nodeType) && this.insertBefore(e, this.firstChild);
                });
            },
            before: function () {
                return this.domManip(arguments, !1, function (e) {
                    this.parentNode && this.parentNode.insertBefore(e, this);
                });
            },
            after: function () {
                return this.domManip(arguments, !1, function (e) {
                    this.parentNode && this.parentNode.insertBefore(e, this.nextSibling);
                });
            },
            remove: function (e, t) {
                for (var n, i = 0; null != (n = this[i]); i++)
                    (!e || b.filter(e, [n]).length > 0) && (t || 1 !== n.nodeType || b.cleanData(Oe(n)), n.parentNode && (t && b.contains(n.ownerDocument, n) && De(Oe(n, "script")), n.parentNode.removeChild(n)));
                return this;
            },
            empty: function () {
                for (var e, t = 0; null != (e = this[t]); t++) {
                    for (1 === e.nodeType && b.cleanData(Oe(e, !1)); e.firstChild; ) e.removeChild(e.firstChild);
                    e.options && b.nodeName(e, "select") && (e.options.length = 0);
                }
                return this;
            },
            clone: function (e, t) {
                return (
                    (e = null != e && e),
                    (t = null == t ? e : t),
                    this.map(function () {
                        return b.clone(this, e, t);
                    })
                );
            },
            html: function (e) {
                return b.access(
                    this,
                    function (e) {
                        var n = this[0] || {},
                            i = 0,
                            r = this.length;
                        if (e === t) return 1 === n.nodeType ? n.innerHTML.replace(he, "") : t;
                        if (!("string" != typeof e || we.test(e) || (!b.support.htmlSerialize && ge.test(e)) || (!b.support.leadingWhitespace && me.test(e)) || je[(ve.exec(e) || ["", ""])[1].toLowerCase()])) {
                            e = e.replace(ye, "<$1></$2>");
                            try {
                                for (; r > i; i++) 1 === (n = this[i] || {}).nodeType && (b.cleanData(Oe(n, !1)), (n.innerHTML = e));
                                n = 0;
                            } catch (e) {}
                        }
                        n && this.empty().append(e);
                    },
                    null,
                    e,
                    arguments.length
                );
            },
            replaceWith: function (e) {
                return (
                    b.isFunction(e) || "string" == typeof e || (e = b(e).not(this).detach()),
                    this.domManip([e], !0, function (e) {
                        var t = this.nextSibling,
                            n = this.parentNode;
                        n && (b(this).remove(), n.insertBefore(e, t));
                    })
                );
            },
            detach: function (e) {
                return this.remove(e, !0);
            },
            domManip: function (e, n, i) {
                e = p.apply([], e);
                var r,
                    o,
                    a,
                    s,
                    l,
                    c,
                    u = 0,
                    d = this.length,
                    f = this,
                    h = d - 1,
                    g = e[0],
                    m = b.isFunction(g);
                if (m || (!(1 >= d || "string" != typeof g || b.support.checkClone) && Ce.test(g)))
                    return this.each(function (r) {
                        var o = f.eq(r);
                        m && (e[0] = g.call(this, r, n ? o.html() : t)), o.domManip(e, n, i);
                    });
                if (d && ((r = (c = b.buildFragment(e, this[0].ownerDocument, !1, this)).firstChild), 1 === c.childNodes.length && (c = r), r)) {
                    for (n = n && b.nodeName(r, "tr"), a = (s = b.map(Oe(c, "script"), Le)).length; d > u; u++)
                        (o = c), u !== h && ((o = b.clone(o, !0, !0)), a && b.merge(s, Oe(o, "script"))), i.call(n && b.nodeName(this[u], "table") ? Ae(this[u], "tbody") : this[u], o, u);
                    if (a)
                        for (l = s[s.length - 1].ownerDocument, b.map(s, He), u = 0; a > u; u++)
                            (o = s[u]),
                                Te.test(o.type || "") &&
                                    !b._data(o, "globalEval") &&
                                    b.contains(l, o) &&
                                    (o.src ? b.ajax({ url: o.src, type: "GET", dataType: "script", async: !1, global: !1, throws: !0 }) : b.globalEval((o.text || o.textContent || o.innerHTML || "").replace(Ne, "")));
                    c = r = null;
                }
                return this;
            },
        }),
        b.each({ appendTo: "append", prependTo: "prepend", insertBefore: "before", insertAfter: "after", replaceAll: "replaceWith" }, function (e, t) {
            b.fn[e] = function (e) {
                for (var n, i = 0, r = [], o = b(e), a = o.length - 1; a >= i; i++) (n = i === a ? this : this.clone(!0)), b(o[i])[t](n), f.apply(r, n.get());
                return this.pushStack(r);
            };
        }),
        b.extend({
            clone: function (e, t, n) {
                var i,
                    r,
                    o,
                    a,
                    s,
                    l = b.contains(e.ownerDocument, e);
                if (
                    (b.support.html5Clone || b.isXMLDoc(e) || !ge.test("<" + e.nodeName + ">") ? (o = e.cloneNode(!0)) : ((Se.innerHTML = e.outerHTML), Se.removeChild((o = Se.firstChild))),
                    !((b.support.noCloneEvent && b.support.noCloneChecked) || (1 !== e.nodeType && 11 !== e.nodeType) || b.isXMLDoc(e)))
                )
                    for (i = Oe(o), s = Oe(e), a = 0; null != (r = s[a]); ++a) i[a] && Me(r, i[a]);
                if (t)
                    if (n) for (s = s || Oe(e), i = i || Oe(o), a = 0; null != (r = s[a]); a++) Pe(r, i[a]);
                    else Pe(e, o);
                return (i = Oe(o, "script")).length > 0 && De(i, !l && Oe(e, "script")), (i = s = r = null), o;
            },
            buildFragment: function (e, t, n, i) {
                for (var r, o, a, s, l, c, u, d = e.length, p = pe(t), f = [], h = 0; d > h; h++)
                    if ((o = e[h]) || 0 === o)
                        if ("object" === b.type(o)) b.merge(f, o.nodeType ? [o] : o);
                        else if (xe.test(o)) {
                            for (s = s || p.appendChild(t.createElement("div")), l = (ve.exec(o) || ["", ""])[1].toLowerCase(), u = je[l] || je._default, s.innerHTML = u[1] + o.replace(ye, "<$1></$2>") + u[2], r = u[0]; r--; )
                                s = s.lastChild;
                            if ((!b.support.leadingWhitespace && me.test(o) && f.push(t.createTextNode(me.exec(o)[0])), !b.support.tbody))
                                for (r = (o = "table" !== l || be.test(o) ? ("<table>" !== u[1] || be.test(o) ? 0 : s) : s.firstChild) && o.childNodes.length; r--; )
                                    b.nodeName((c = o.childNodes[r]), "tbody") && !c.childNodes.length && o.removeChild(c);
                            for (b.merge(f, s.childNodes), s.textContent = ""; s.firstChild; ) s.removeChild(s.firstChild);
                            s = p.lastChild;
                        } else f.push(t.createTextNode(o));
                for (s && p.removeChild(s), b.support.appendChecked || b.grep(Oe(f, "input"), _e), h = 0; (o = f[h++]); )
                    if ((!i || -1 === b.inArray(o, i)) && ((a = b.contains(o.ownerDocument, o)), (s = Oe(p.appendChild(o), "script")), a && De(s), n)) for (r = 0; (o = s[r++]); ) Te.test(o.type || "") && n.push(o);
                return (s = null), p;
            },
            cleanData: function (e, t) {
                for (var n, i, o, a, s = 0, l = b.expando, c = b.cache, d = b.support.deleteExpando, p = b.event.special; null != (n = e[s]); s++)
                    if ((t || b.acceptData(n)) && (a = (o = n[l]) && c[o])) {
                        if (a.events) for (i in a.events) p[i] ? b.event.remove(n, i) : b.removeEvent(n, i, a.handle);
                        c[o] && (delete c[o], d ? delete n[l] : typeof n.removeAttribute !== r ? n.removeAttribute(l) : (n[l] = null), u.push(o));
                    }
            },
        });
    var qe,
        Fe,
        Re,
        We = /alpha\([^)]*\)/i,
        Be = /opacity\s*=\s*([^)]*)/,
        Ie = /^(top|right|bottom|left)$/,
        $e = /^(none|table(?!-c[ea]).+)/,
        ze = /^margin/,
        Xe = RegExp("^(" + x + ")(.*)$", "i"),
        Ue = RegExp("^(" + x + ")(?!px)[a-z%]+$", "i"),
        Ve = RegExp("^([+-])=(" + x + ")", "i"),
        Ke = { BODY: "block" },
        Ge = { position: "absolute", visibility: "hidden", display: "block" },
        Qe = { letterSpacing: 0, fontWeight: 400 },
        Je = ["Top", "Right", "Bottom", "Left"],
        Ye = ["Webkit", "O", "Moz", "ms"];
    function Ze(e, t) {
        if (t in e) return t;
        for (var n = t.charAt(0).toUpperCase() + t.slice(1), i = t, r = Ye.length; r--; ) if ((t = Ye[r] + n) in e) return t;
        return i;
    }
    function et(e, t) {
        return (e = t || e), "none" === b.css(e, "display") || !b.contains(e.ownerDocument, e);
    }
    function tt(e, t) {
        for (var n, i, r, o = [], a = 0, s = e.length; s > a; a++)
            (i = e[a]).style &&
                ((o[a] = b._data(i, "olddisplay")),
                (n = i.style.display),
                t
                    ? (o[a] || "none" !== n || (i.style.display = ""), "" === i.style.display && et(i) && (o[a] = b._data(i, "olddisplay", ot(i.nodeName))))
                    : o[a] || ((r = et(i)), ((n && "none" !== n) || !r) && b._data(i, "olddisplay", r ? n : b.css(i, "display"))));
        for (a = 0; s > a; a++) (i = e[a]).style && ((t && "none" !== i.style.display && "" !== i.style.display) || (i.style.display = t ? o[a] || "" : "none"));
        return e;
    }
    function nt(e, t, n) {
        var i = Xe.exec(t);
        return i ? Math.max(0, i[1] - (n || 0)) + (i[2] || "px") : t;
    }
    function it(e, t, n, i, r) {
        for (var o = n === (i ? "border" : "content") ? 4 : "width" === t ? 1 : 0, a = 0; 4 > o; o += 2)
            "margin" === n && (a += b.css(e, n + Je[o], !0, r)),
                i
                    ? ("content" === n && (a -= b.css(e, "padding" + Je[o], !0, r)), "margin" !== n && (a -= b.css(e, "border" + Je[o] + "Width", !0, r)))
                    : ((a += b.css(e, "padding" + Je[o], !0, r)), "padding" !== n && (a += b.css(e, "border" + Je[o] + "Width", !0, r)));
        return a;
    }
    function rt(e, t, n) {
        var i = !0,
            r = "width" === t ? e.offsetWidth : e.offsetHeight,
            o = Fe(e),
            a = b.support.boxSizing && "border-box" === b.css(e, "boxSizing", !1, o);
        if (0 >= r || null == r) {
            if (((0 > (r = Re(e, t, o)) || null == r) && (r = e.style[t]), Ue.test(r))) return r;
            (i = a && (b.support.boxSizingReliable || r === e.style[t])), (r = parseFloat(r) || 0);
        }
        return r + it(e, t, n || (a ? "border" : "content"), i, o) + "px";
    }
    function ot(e) {
        var t = o,
            n = Ke[e];
        return (
            n ||
                (("none" !== (n = at(e, t)) && n) ||
                    ((t = ((qe = (qe || b("<iframe frameborder='0' width='0' height='0'/>").css("cssText", "display:block !important")).appendTo(t.documentElement))[0].contentWindow || qe[0].contentDocument).document).write(
                        "<!doctype html><html><body>"
                    ),
                    t.close(),
                    (n = at(e, t)),
                    qe.detach()),
                (Ke[e] = n)),
            n
        );
    }
    function at(e, t) {
        var n = b(t.createElement(e)).appendTo(t.body),
            i = b.css(n[0], "display");
        return n.remove(), i;
    }
    b.fn.extend({
        css: function (e, n) {
            return b.access(
                this,
                function (e, n, i) {
                    var r,
                        o,
                        a = {},
                        s = 0;
                    if (b.isArray(n)) {
                        for (o = Fe(e), r = n.length; r > s; s++) a[n[s]] = b.css(e, n[s], !1, o);
                        return a;
                    }
                    return i !== t ? b.style(e, n, i) : b.css(e, n);
                },
                e,
                n,
                arguments.length > 1
            );
        },
        show: function () {
            return tt(this, !0);
        },
        hide: function () {
            return tt(this);
        },
        toggle: function (e) {
            var t = "boolean" == typeof e;
            return this.each(function () {
                (t ? e : et(this)) ? b(this).show() : b(this).hide();
            });
        },
    }),
        b.extend({
            cssHooks: {
                opacity: {
                    get: function (e, t) {
                        if (t) {
                            var n = Re(e, "opacity");
                            return "" === n ? "1" : n;
                        }
                    },
                },
            },
            cssNumber: { columnCount: !0, fillOpacity: !0, fontWeight: !0, lineHeight: !0, opacity: !0, orphans: !0, widows: !0, zIndex: !0, zoom: !0 },
            cssProps: { float: b.support.cssFloat ? "cssFloat" : "styleFloat" },
            style: function (e, n, i, r) {
                if (e && 3 !== e.nodeType && 8 !== e.nodeType && e.style) {
                    var o,
                        a,
                        s,
                        l = b.camelCase(n),
                        c = e.style;
                    if (((n = b.cssProps[l] || (b.cssProps[l] = Ze(c, l))), (s = b.cssHooks[n] || b.cssHooks[l]), i === t)) return s && "get" in s && (o = s.get(e, !1, r)) !== t ? o : c[n];
                    if (
                        ("string" === (a = typeof i) && (o = Ve.exec(i)) && ((i = (o[1] + 1) * o[2] + parseFloat(b.css(e, n))), (a = "number")),
                        !(
                            null == i ||
                            ("number" === a && isNaN(i)) ||
                            ("number" !== a || b.cssNumber[l] || (i += "px"), b.support.clearCloneStyle || "" !== i || 0 !== n.indexOf("background") || (c[n] = "inherit"), s && "set" in s && (i = s.set(e, i, r)) === t)
                        ))
                    )
                        try {
                            c[n] = i;
                        } catch (e) {}
                }
            },
            css: function (e, n, i, r) {
                var o,
                    a,
                    s,
                    l = b.camelCase(n);
                return (
                    (n = b.cssProps[l] || (b.cssProps[l] = Ze(e.style, l))),
                    (s = b.cssHooks[n] || b.cssHooks[l]) && "get" in s && (a = s.get(e, !0, i)),
                    a === t && (a = Re(e, n, r)),
                    "normal" === a && n in Qe && (a = Qe[n]),
                    "" === i || i ? ((o = parseFloat(a)), !0 === i || b.isNumeric(o) ? o || 0 : a) : a
                );
            },
            swap: function (e, t, n, i) {
                var r,
                    o,
                    a = {};
                for (o in t) (a[o] = e.style[o]), (e.style[o] = t[o]);
                for (o in ((r = n.apply(e, i || [])), t)) e.style[o] = a[o];
                return r;
            },
        }),
        e.getComputedStyle
            ? ((Fe = function (t) {
                  return e.getComputedStyle(t, null);
              }),
              (Re = function (e, n, i) {
                  var r,
                      o,
                      a,
                      s = i || Fe(e),
                      l = s ? s.getPropertyValue(n) || s[n] : t,
                      c = e.style;
                  return (
                      s &&
                          ("" !== l || b.contains(e.ownerDocument, e) || (l = b.style(e, n)),
                          Ue.test(l) && ze.test(n) && ((r = c.width), (o = c.minWidth), (a = c.maxWidth), (c.minWidth = c.maxWidth = c.width = l), (l = s.width), (c.width = r), (c.minWidth = o), (c.maxWidth = a))),
                      l
                  );
              }))
            : o.documentElement.currentStyle &&
              ((Fe = function (e) {
                  return e.currentStyle;
              }),
              (Re = function (e, n, i) {
                  var r,
                      o,
                      a,
                      s = i || Fe(e),
                      l = s ? s[n] : t,
                      c = e.style;
                  return (
                      null == l && c && c[n] && (l = c[n]),
                      Ue.test(l) && !Ie.test(n) && ((r = c.left), (a = (o = e.runtimeStyle) && o.left) && (o.left = e.currentStyle.left), (c.left = "fontSize" === n ? "1em" : l), (l = c.pixelLeft + "px"), (c.left = r), a && (o.left = a)),
                      "" === l ? "auto" : l
                  );
              })),
        b.each(["height", "width"], function (e, n) {
            b.cssHooks[n] = {
                get: function (e, i, r) {
                    return i
                        ? 0 === e.offsetWidth && $e.test(b.css(e, "display"))
                            ? b.swap(e, Ge, function () {
                                  return rt(e, n, r);
                              })
                            : rt(e, n, r)
                        : t;
                },
                set: function (e, t, i) {
                    var r = i && Fe(e);
                    return nt(0, t, i ? it(e, n, i, b.support.boxSizing && "border-box" === b.css(e, "boxSizing", !1, r), r) : 0);
                },
            };
        }),
        b.support.opacity ||
            (b.cssHooks.opacity = {
                get: function (e, t) {
                    return Be.test((t && e.currentStyle ? e.currentStyle.filter : e.style.filter) || "") ? 0.01 * parseFloat(RegExp.$1) + "" : t ? "1" : "";
                },
                set: function (e, t) {
                    var n = e.style,
                        i = e.currentStyle,
                        r = b.isNumeric(t) ? "alpha(opacity=" + 100 * t + ")" : "",
                        o = (i && i.filter) || n.filter || "";
                    (n.zoom = 1), ((t >= 1 || "" === t) && "" === b.trim(o.replace(We, "")) && n.removeAttribute && (n.removeAttribute("filter"), "" === t || (i && !i.filter))) || (n.filter = We.test(o) ? o.replace(We, r) : o + " " + r);
                },
            }),
        b(function () {
            b.support.reliableMarginRight ||
                (b.cssHooks.marginRight = {
                    get: function (e, n) {
                        return n ? b.swap(e, { display: "inline-block" }, Re, [e, "marginRight"]) : t;
                    },
                }),
                !b.support.pixelPosition &&
                    b.fn.position &&
                    b.each(["top", "left"], function (e, n) {
                        b.cssHooks[n] = {
                            get: function (e, i) {
                                return i ? ((i = Re(e, n)), Ue.test(i) ? b(e).position()[n] + "px" : i) : t;
                            },
                        };
                    });
        }),
        b.expr &&
            b.expr.filters &&
            ((b.expr.filters.hidden = function (e) {
                return (0 >= e.offsetWidth && 0 >= e.offsetHeight) || (!b.support.reliableHiddenOffsets && "none" === ((e.style && e.style.display) || b.css(e, "display")));
            }),
            (b.expr.filters.visible = function (e) {
                return !b.expr.filters.hidden(e);
            })),
        b.each({ margin: "", padding: "", border: "Width" }, function (e, t) {
            (b.cssHooks[e + t] = {
                expand: function (n) {
                    for (var i = 0, r = {}, o = "string" == typeof n ? n.split(" ") : [n]; 4 > i; i++) r[e + Je[i] + t] = o[i] || o[i - 2] || o[0];
                    return r;
                },
            }),
                ze.test(e) || (b.cssHooks[e + t].set = nt);
        });
    var st = /%20/g,
        lt = /\[\]$/,
        ct = /\r?\n/g,
        ut = /^(?:submit|button|image|reset|file)$/i,
        dt = /^(?:input|select|textarea|keygen)/i;
    function pt(e, t, n, i) {
        var r;
        if (b.isArray(t))
            b.each(t, function (t, r) {
                n || lt.test(e) ? i(e, r) : pt(e + "[" + ("object" == typeof r ? t : "") + "]", r, n, i);
            });
        else if (n || "object" !== b.type(t)) i(e, t);
        else for (r in t) pt(e + "[" + r + "]", t[r], n, i);
    }
    b.fn.extend({
        serialize: function () {
            return b.param(this.serializeArray());
        },
        serializeArray: function () {
            return this.map(function () {
                var e = b.prop(this, "elements");
                return e ? b.makeArray(e) : this;
            })
                .filter(function () {
                    var e = this.type;
                    return this.name && !b(this).is(":disabled") && dt.test(this.nodeName) && !ut.test(e) && (this.checked || !ke.test(e));
                })
                .map(function (e, t) {
                    var n = b(this).val();
                    return null == n
                        ? null
                        : b.isArray(n)
                        ? b.map(n, function (e) {
                              return { name: t.name, value: e.replace(ct, "\r\n") };
                          })
                        : { name: t.name, value: n.replace(ct, "\r\n") };
                })
                .get();
        },
    }),
        (b.param = function (e, n) {
            var i,
                r = [],
                o = function (e, t) {
                    (t = b.isFunction(t) ? t() : null == t ? "" : t), (r[r.length] = encodeURIComponent(e) + "=" + encodeURIComponent(t));
                };
            if ((n === t && (n = b.ajaxSettings && b.ajaxSettings.traditional), b.isArray(e) || (e.jquery && !b.isPlainObject(e))))
                b.each(e, function () {
                    o(this.name, this.value);
                });
            else for (i in e) pt(i, e[i], n, o);
            return r.join("&").replace(st, "+");
        }),
        b.each("blur focus focusin focusout load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup error contextmenu".split(" "), function (
            e,
            t
        ) {
            b.fn[t] = function (e, n) {
                return arguments.length > 0 ? this.on(t, null, e, n) : this.trigger(t);
            };
        }),
        (b.fn.hover = function (e, t) {
            return this.mouseenter(e).mouseleave(t || e);
        });
    var ft,
        ht,
        gt = b.now(),
        mt = /\?/,
        yt = /#.*$/,
        vt = /([?&])_=[^&]*/,
        bt = /^(.*?):[ \t]*([^\r\n]*)\r?$/gm,
        xt = /^(?:GET|HEAD)$/,
        wt = /^\/\//,
        kt = /^([\w.+-]+:)(?:\/\/([^\/?#:]*)(?::(\d+)|)|)/,
        Ct = b.fn.load,
        Tt = {},
        Et = {},
        Nt = "*/".concat("*");
    try {
        ht = a.href;
    } catch (e) {
        ((ht = o.createElement("a")).href = ""), (ht = ht.href);
    }
    function jt(e) {
        return function (t, n) {
            "string" != typeof t && ((n = t), (t = "*"));
            var i,
                r = 0,
                o = t.toLowerCase().match(w) || [];
            if (b.isFunction(n)) for (; (i = o[r++]); ) "+" === i[0] ? ((i = i.slice(1) || "*"), (e[i] = e[i] || []).unshift(n)) : (e[i] = e[i] || []).push(n);
        };
    }
    function St(e, n, i, r) {
        var o = {},
            a = e === Et;
        function s(l) {
            var c;
            return (
                (o[l] = !0),
                b.each(e[l] || [], function (e, l) {
                    var u = l(n, i, r);
                    return "string" != typeof u || a || o[u] ? (a ? !(c = u) : t) : (n.dataTypes.unshift(u), s(u), !1);
                }),
                c
            );
        }
        return s(n.dataTypes[0]) || (!o["*"] && s("*"));
    }
    function At(e, n) {
        var i,
            r,
            o = b.ajaxSettings.flatOptions || {};
        for (r in n) n[r] !== t && ((o[r] ? e : i || (i = {}))[r] = n[r]);
        return i && b.extend(!0, e, i), e;
    }
    (ft = kt.exec(ht.toLowerCase()) || []),
        (b.fn.load = function (e, n, i) {
            if ("string" != typeof e && Ct) return Ct.apply(this, arguments);
            var r,
                o,
                a,
                s = this,
                l = e.indexOf(" ");
            return (
                l >= 0 && ((r = e.slice(l, e.length)), (e = e.slice(0, l))),
                b.isFunction(n) ? ((i = n), (n = t)) : n && "object" == typeof n && (a = "POST"),
                s.length > 0 &&
                    b
                        .ajax({ url: e, type: a, dataType: "html", data: n })
                        .done(function (e) {
                            (o = arguments), s.html(r ? b("<div>").append(b.parseHTML(e)).find(r) : e);
                        })
                        .complete(
                            i &&
                                function (e, t) {
                                    s.each(i, o || [e.responseText, t, e]);
                                }
                        ),
                this
            );
        }),
        b.each(["ajaxStart", "ajaxStop", "ajaxComplete", "ajaxError", "ajaxSuccess", "ajaxSend"], function (e, t) {
            b.fn[t] = function (e) {
                return this.on(t, e);
            };
        }),
        b.each(["get", "post"], function (e, n) {
            b[n] = function (e, i, r, o) {
                return b.isFunction(i) && ((o = o || r), (r = i), (i = t)), b.ajax({ url: e, type: n, dataType: o, data: i, success: r });
            };
        }),
        b.extend({
            active: 0,
            lastModified: {},
            etag: {},
            ajaxSettings: {
                url: ht,
                type: "GET",
                isLocal: /^(?:about|app|app-storage|.+-extension|file|res|widget):$/.test(ft[1]),
                global: !0,
                processData: !0,
                async: !0,
                contentType: "application/x-www-form-urlencoded; charset=UTF-8",
                accepts: { "*": Nt, text: "text/plain", html: "text/html", xml: "application/xml, text/xml", json: "application/json, text/javascript" },
                contents: { xml: /xml/, html: /html/, json: /json/ },
                responseFields: { xml: "responseXML", text: "responseText" },
                converters: { "* text": e.String, "text html": !0, "text json": b.parseJSON, "text xml": b.parseXML },
                flatOptions: { url: !0, context: !0 },
            },
            ajaxSetup: function (e, t) {
                return t ? At(At(e, b.ajaxSettings), t) : At(b.ajaxSettings, e);
            },
            ajaxPrefilter: jt(Tt),
            ajaxTransport: jt(Et),
            ajax: function (e, n) {
                "object" == typeof e && ((n = e), (e = t)), (n = n || {});
                var i,
                    r,
                    o,
                    a,
                    s,
                    l,
                    c,
                    u,
                    d = b.ajaxSetup({}, n),
                    p = d.context || d,
                    f = d.context && (p.nodeType || p.jquery) ? b(p) : b.event,
                    h = b.Deferred(),
                    g = b.Callbacks("once memory"),
                    m = d.statusCode || {},
                    y = {},
                    v = {},
                    x = 0,
                    k = "canceled",
                    C = {
                        readyState: 0,
                        getResponseHeader: function (e) {
                            var t;
                            if (2 === x) {
                                if (!u) for (u = {}; (t = bt.exec(a)); ) u[t[1].toLowerCase()] = t[2];
                                t = u[e.toLowerCase()];
                            }
                            return null == t ? null : t;
                        },
                        getAllResponseHeaders: function () {
                            return 2 === x ? a : null;
                        },
                        setRequestHeader: function (e, t) {
                            var n = e.toLowerCase();
                            return x || ((e = v[n] = v[n] || e), (y[e] = t)), this;
                        },
                        overrideMimeType: function (e) {
                            return x || (d.mimeType = e), this;
                        },
                        statusCode: function (e) {
                            var t;
                            if (e)
                                if (2 > x) for (t in e) m[t] = [m[t], e[t]];
                                else C.always(e[C.status]);
                            return this;
                        },
                        abort: function (e) {
                            var t = e || k;
                            return c && c.abort(t), T(0, t), this;
                        },
                    };
                if (
                    ((h.promise(C).complete = g.add),
                    (C.success = C.done),
                    (C.error = C.fail),
                    (d.url = ((e || d.url || ht) + "").replace(yt, "").replace(wt, ft[1] + "//")),
                    (d.type = n.method || n.type || d.method || d.type),
                    (d.dataTypes = b
                        .trim(d.dataType || "*")
                        .toLowerCase()
                        .match(w) || [""]),
                    null == d.crossDomain && ((i = kt.exec(d.url.toLowerCase())), (d.crossDomain = !(!i || (i[1] === ft[1] && i[2] === ft[2] && (i[3] || ("http:" === i[1] ? 80 : 443)) == (ft[3] || ("http:" === ft[1] ? 80 : 443)))))),
                    d.data && d.processData && "string" != typeof d.data && (d.data = b.param(d.data, d.traditional)),
                    St(Tt, d, n, C),
                    2 === x)
                )
                    return C;
                for (r in ((l = d.global) && 0 == b.active++ && b.event.trigger("ajaxStart"),
                (d.type = d.type.toUpperCase()),
                (d.hasContent = !xt.test(d.type)),
                (o = d.url),
                d.hasContent || (d.data && ((o = d.url += (mt.test(o) ? "&" : "?") + d.data), delete d.data), !1 === d.cache && (d.url = vt.test(o) ? o.replace(vt, "$1_=" + gt++) : o + (mt.test(o) ? "&" : "?") + "_=" + gt++)),
                d.ifModified && (b.lastModified[o] && C.setRequestHeader("If-Modified-Since", b.lastModified[o]), b.etag[o] && C.setRequestHeader("If-None-Match", b.etag[o])),
                ((d.data && d.hasContent && !1 !== d.contentType) || n.contentType) && C.setRequestHeader("Content-Type", d.contentType),
                C.setRequestHeader("Accept", d.dataTypes[0] && d.accepts[d.dataTypes[0]] ? d.accepts[d.dataTypes[0]] + ("*" !== d.dataTypes[0] ? ", " + Nt + "; q=0.01" : "") : d.accepts["*"]),
                d.headers))
                    C.setRequestHeader(r, d.headers[r]);
                if (d.beforeSend && (!1 === d.beforeSend.call(p, C, d) || 2 === x)) return C.abort();
                for (r in ((k = "abort"), { success: 1, error: 1, complete: 1 })) C[r](d[r]);
                if ((c = St(Et, d, n, C))) {
                    (C.readyState = 1),
                        l && f.trigger("ajaxSend", [C, d]),
                        d.async &&
                            d.timeout > 0 &&
                            (s = setTimeout(function () {
                                C.abort("timeout");
                            }, d.timeout));
                    try {
                        (x = 1), c.send(y, T);
                    } catch (e) {
                        if (!(2 > x)) throw e;
                        T(-1, e);
                    }
                } else T(-1, "No Transport");
                function T(e, n, i, r) {
                    var u,
                        y,
                        v,
                        w,
                        k,
                        T = n;
                    2 !== x &&
                        ((x = 2),
                        s && clearTimeout(s),
                        (c = t),
                        (a = r || ""),
                        (C.readyState = e > 0 ? 4 : 0),
                        i &&
                            (w = (function (e, n, i) {
                                var r,
                                    o,
                                    a,
                                    s,
                                    l = e.contents,
                                    c = e.dataTypes,
                                    u = e.responseFields;
                                for (s in u) s in i && (n[u[s]] = i[s]);
                                for (; "*" === c[0]; ) c.shift(), o === t && (o = e.mimeType || n.getResponseHeader("Content-Type"));
                                if (o)
                                    for (s in l)
                                        if (l[s] && l[s].test(o)) {
                                            c.unshift(s);
                                            break;
                                        }
                                if (c[0] in i) a = c[0];
                                else {
                                    for (s in i) {
                                        if (!c[0] || e.converters[s + " " + c[0]]) {
                                            a = s;
                                            break;
                                        }
                                        r || (r = s);
                                    }
                                    a = a || r;
                                }
                                return a ? (a !== c[0] && c.unshift(a), i[a]) : t;
                            })(d, C, i)),
                        (e >= 200 && 300 > e) || 304 === e
                            ? (d.ifModified && ((k = C.getResponseHeader("Last-Modified")) && (b.lastModified[o] = k), (k = C.getResponseHeader("etag")) && (b.etag[o] = k)),
                              204 === e
                                  ? ((u = !0), (T = "nocontent"))
                                  : 304 === e
                                  ? ((u = !0), (T = "notmodified"))
                                  : ((T = (u = (function (e, t) {
                                        var n,
                                            i,
                                            r,
                                            o,
                                            a = {},
                                            s = 0,
                                            l = e.dataTypes.slice(),
                                            c = l[0];
                                        if ((e.dataFilter && (t = e.dataFilter(t, e.dataType)), l[1])) for (r in e.converters) a[r.toLowerCase()] = e.converters[r];
                                        for (; (i = l[++s]); )
                                            if ("*" !== i) {
                                                if ("*" !== c && c !== i) {
                                                    if (!(r = a[c + " " + i] || a["* " + i]))
                                                        for (n in a)
                                                            if ((o = n.split(" "))[1] === i && (r = a[c + " " + o[0]] || a["* " + o[0]])) {
                                                                !0 === r ? (r = a[n]) : !0 !== a[n] && ((i = o[0]), l.splice(s--, 0, i));
                                                                break;
                                                            }
                                                    if (!0 !== r)
                                                        if (r && e.throws) t = r(t);
                                                        else
                                                            try {
                                                                t = r(t);
                                                            } catch (e) {
                                                                return { state: "parsererror", error: r ? e : "No conversion from " + c + " to " + i };
                                                            }
                                                }
                                                c = i;
                                            }
                                        return { state: "success", data: t };
                                    })(d, w)).state),
                                    (y = u.data),
                                    (u = !(v = u.error))))
                            : ((v = T), (e || !T) && ((T = "error"), 0 > e && (e = 0))),
                        (C.status = e),
                        (C.statusText = (n || T) + ""),
                        u ? h.resolveWith(p, [y, T, C]) : h.rejectWith(p, [C, T, v]),
                        C.statusCode(m),
                        (m = t),
                        l && f.trigger(u ? "ajaxSuccess" : "ajaxError", [C, d, u ? y : v]),
                        g.fireWith(p, [C, T]),
                        l && (f.trigger("ajaxComplete", [C, d]), --b.active || b.event.trigger("ajaxStop")));
                }
                return C;
            },
            getScript: function (e, n) {
                return b.get(e, t, n, "script");
            },
            getJSON: function (e, t, n) {
                return b.get(e, t, n, "json");
            },
        }),
        b.ajaxSetup({
            accepts: { script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript" },
            contents: { script: /(?:java|ecma)script/ },
            converters: {
                "text script": function (e) {
                    return b.globalEval(e), e;
                },
            },
        }),
        b.ajaxPrefilter("script", function (e) {
            e.cache === t && (e.cache = !1), e.crossDomain && ((e.type = "GET"), (e.global = !1));
        }),
        b.ajaxTransport("script", function (e) {
            if (e.crossDomain) {
                var n,
                    i = o.head || b("head")[0] || o.documentElement;
                return {
                    send: function (t, r) {
                        ((n = o.createElement("script")).async = !0),
                            e.scriptCharset && (n.charset = e.scriptCharset),
                            (n.src = e.url),
                            (n.onload = n.onreadystatechange = function (e, t) {
                                (t || !n.readyState || /loaded|complete/.test(n.readyState)) && ((n.onload = n.onreadystatechange = null), n.parentNode && n.parentNode.removeChild(n), (n = null), t || r(200, "success"));
                            }),
                            i.insertBefore(n, i.firstChild);
                    },
                    abort: function () {
                        n && n.onload(t, !0);
                    },
                };
            }
        });
    var Lt = [],
        Ht = /(=)\?(?=&|$)|\?\?/;
    b.ajaxSetup({
        jsonp: "callback",
        jsonpCallback: function () {
            var e = Lt.pop() || b.expando + "_" + gt++;
            return (this[e] = !0), e;
        },
    }),
        b.ajaxPrefilter("json jsonp", function (n, i, r) {
            var o,
                a,
                s,
                l = !1 !== n.jsonp && (Ht.test(n.url) ? "url" : "string" == typeof n.data && !(n.contentType || "").indexOf("application/x-www-form-urlencoded") && Ht.test(n.data) && "data");
            return l || "jsonp" === n.dataTypes[0]
                ? ((o = n.jsonpCallback = b.isFunction(n.jsonpCallback) ? n.jsonpCallback() : n.jsonpCallback),
                  l ? (n[l] = n[l].replace(Ht, "$1" + o)) : !1 !== n.jsonp && (n.url += (mt.test(n.url) ? "&" : "?") + n.jsonp + "=" + o),
                  (n.converters["script json"] = function () {
                      return s || b.error(o + " was not called"), s[0];
                  }),
                  (n.dataTypes[0] = "json"),
                  (a = e[o]),
                  (e[o] = function () {
                      s = arguments;
                  }),
                  r.always(function () {
                      (e[o] = a), n[o] && ((n.jsonpCallback = i.jsonpCallback), Lt.push(o)), s && b.isFunction(a) && a(s[0]), (s = a = t);
                  }),
                  "script")
                : t;
        });
    var Dt,
        Pt,
        Mt = 0,
        Ot =
            e.ActiveXObject &&
            function () {
                var e;
                for (e in Dt) Dt[e](t, !0);
            };
    function _t() {
        try {
            return new e.XMLHttpRequest();
        } catch (e) {}
    }
    (b.ajaxSettings.xhr = e.ActiveXObject
        ? function () {
              return (
                  (!this.isLocal && _t()) ||
                  (function () {
                      try {
                          return new e.ActiveXObject("Microsoft.XMLHTTP");
                      } catch (e) {}
                  })()
              );
          }
        : _t),
        (Pt = b.ajaxSettings.xhr()),
        (b.support.cors = !!Pt && "withCredentials" in Pt),
        (Pt = b.support.ajax = !!Pt) &&
            b.ajaxTransport(function (n) {
                var i;
                if (!n.crossDomain || b.support.cors)
                    return {
                        send: function (r, o) {
                            var a,
                                s,
                                l = n.xhr();
                            if ((n.username ? l.open(n.type, n.url, n.async, n.username, n.password) : l.open(n.type, n.url, n.async), n.xhrFields)) for (s in n.xhrFields) l[s] = n.xhrFields[s];
                            n.mimeType && l.overrideMimeType && l.overrideMimeType(n.mimeType), n.crossDomain || r["X-Requested-With"] || (r["X-Requested-With"] = "XMLHttpRequest");
                            try {
                                for (s in r) l.setRequestHeader(s, r[s]);
                            } catch (e) {}
                            l.send((n.hasContent && n.data) || null),
                                (i = function (e, r) {
                                    var s, c, u, d;
                                    try {
                                        if (i && (r || 4 === l.readyState))
                                            if (((i = t), a && ((l.onreadystatechange = b.noop), Ot && delete Dt[a]), r)) 4 !== l.readyState && l.abort();
                                            else {
                                                (d = {}), (s = l.status), (c = l.getAllResponseHeaders()), "string" == typeof l.responseText && (d.text = l.responseText);
                                                try {
                                                    u = l.statusText;
                                                } catch (e) {
                                                    u = "";
                                                }
                                                s || !n.isLocal || n.crossDomain ? 1223 === s && (s = 204) : (s = d.text ? 200 : 404);
                                            }
                                    } catch (e) {
                                        r || o(-1, e);
                                    }
                                    d && o(s, u, d, c);
                                }),
                                n.async ? (4 === l.readyState ? setTimeout(i) : ((a = ++Mt), Ot && (Dt || ((Dt = {}), b(e).unload(Ot)), (Dt[a] = i)), (l.onreadystatechange = i))) : i();
                        },
                        abort: function () {
                            i && i(t, !0);
                        },
                    };
            });
    var qt,
        Ft,
        Rt = /^(?:toggle|show|hide)$/,
        Wt = RegExp("^(?:([+-])=|)(" + x + ")([a-z%]*)$", "i"),
        Bt = /queueHooks$/,
        It = [
            function (e, t, n) {
                var i,
                    r,
                    o,
                    a,
                    s,
                    l,
                    c,
                    u,
                    d,
                    p = this,
                    f = e.style,
                    h = {},
                    g = [],
                    m = e.nodeType && et(e);
                for (r in (n.queue ||
                    (null == (u = b._queueHooks(e, "fx")).unqueued &&
                        ((u.unqueued = 0),
                        (d = u.empty.fire),
                        (u.empty.fire = function () {
                            u.unqueued || d();
                        })),
                    u.unqueued++,
                    p.always(function () {
                        p.always(function () {
                            u.unqueued--, b.queue(e, "fx").length || u.empty.fire();
                        });
                    })),
                1 === e.nodeType &&
                    ("height" in t || "width" in t) &&
                    ((n.overflow = [f.overflow, f.overflowX, f.overflowY]),
                    "inline" === b.css(e, "display") && "none" === b.css(e, "float") && (b.support.inlineBlockNeedsLayout && "inline" !== ot(e.nodeName) ? (f.zoom = 1) : (f.display = "inline-block"))),
                n.overflow &&
                    ((f.overflow = "hidden"),
                    b.support.shrinkWrapBlocks ||
                        p.always(function () {
                            (f.overflow = n.overflow[0]), (f.overflowX = n.overflow[1]), (f.overflowY = n.overflow[2]);
                        })),
                t))
                    if (((a = t[r]), Rt.exec(a))) {
                        if ((delete t[r], (l = l || "toggle" === a), a === (m ? "hide" : "show"))) continue;
                        g.push(r);
                    }
                if ((o = g.length)) {
                    "hidden" in (s = b._data(e, "fxshow") || b._data(e, "fxshow", {})) && (m = s.hidden),
                        l && (s.hidden = !m),
                        m
                            ? b(e).show()
                            : p.done(function () {
                                  b(e).hide();
                              }),
                        p.done(function () {
                            var t;
                            for (t in (b._removeData(e, "fxshow"), h)) b.style(e, t, h[t]);
                        });
                    for (r = 0; o > r; r++) (i = g[r]), (c = p.createTween(i, m ? s[i] : 0)), (h[i] = s[i] || b.style(e, i)), i in s || ((s[i] = c.start), m && ((c.end = c.start), (c.start = "width" === i || "height" === i ? 1 : 0)));
                }
            },
        ],
        $t = {
            "*": [
                function (e, t) {
                    var n,
                        i,
                        r = this.createTween(e, t),
                        o = Wt.exec(t),
                        a = r.cur(),
                        s = +a || 0,
                        l = 1,
                        c = 20;
                    if (o) {
                        if (((n = +o[2]), "px" !== (i = o[3] || (b.cssNumber[e] ? "" : "px")) && s)) {
                            s = b.css(r.elem, e, !0) || n || 1;
                            do {
                                (s /= l = l || ".5"), b.style(r.elem, e, s + i);
                            } while (l !== (l = r.cur() / a) && 1 !== l && --c);
                        }
                        (r.unit = i), (r.start = s), (r.end = o[1] ? s + (o[1] + 1) * n : n);
                    }
                    return r;
                },
            ],
        };
    function zt() {
        return (
            setTimeout(function () {
                qt = t;
            }),
            (qt = b.now())
        );
    }
    function Xt(e, t, n) {
        var i,
            r,
            o = 0,
            a = It.length,
            s = b.Deferred().always(function () {
                delete l.elem;
            }),
            l = function () {
                if (r) return !1;
                for (var t = qt || zt(), n = Math.max(0, c.startTime + c.duration - t), i = 1 - (n / c.duration || 0), o = 0, a = c.tweens.length; a > o; o++) c.tweens[o].run(i);
                return s.notifyWith(e, [c, i, n]), 1 > i && a ? n : (s.resolveWith(e, [c]), !1);
            },
            c = s.promise({
                elem: e,
                props: b.extend({}, t),
                opts: b.extend(!0, { specialEasing: {} }, n),
                originalProperties: t,
                originalOptions: n,
                startTime: qt || zt(),
                duration: n.duration,
                tweens: [],
                createTween: function (t, n) {
                    var i = b.Tween(e, c.opts, t, n, c.opts.specialEasing[t] || c.opts.easing);
                    return c.tweens.push(i), i;
                },
                stop: function (t) {
                    var n = 0,
                        i = t ? c.tweens.length : 0;
                    if (r) return this;
                    for (r = !0; i > n; n++) c.tweens[n].run(1);
                    return t ? s.resolveWith(e, [c, t]) : s.rejectWith(e, [c, t]), this;
                },
            }),
            u = c.props;
        for (
            (function (e, t) {
                var n, i, r, o, a;
                for (r in e)
                    if (((i = b.camelCase(r)), (o = t[i]), (n = e[r]), b.isArray(n) && ((o = n[1]), (n = e[r] = n[0])), r !== i && ((e[i] = n), delete e[r]), (a = b.cssHooks[i]) && ("expand" in a)))
                        for (r in ((n = a.expand(n)), delete e[i], n)) (r in e) || ((e[r] = n[r]), (t[r] = o));
                    else t[i] = o;
            })(u, c.opts.specialEasing);
            a > o;
            o++
        )
            if ((i = It[o].call(c, e, u, c.opts))) return i;
        return (
            (function (e, t) {
                b.each(t, function (t, n) {
                    for (var i = ($t[t] || []).concat($t["*"]), r = 0, o = i.length; o > r; r++) if (i[r].call(e, t, n)) return;
                });
            })(c, u),
            b.isFunction(c.opts.start) && c.opts.start.call(e, c),
            b.fx.timer(b.extend(l, { elem: e, anim: c, queue: c.opts.queue })),
            c.progress(c.opts.progress).done(c.opts.done, c.opts.complete).fail(c.opts.fail).always(c.opts.always)
        );
    }
    function Ut(e, t, n, i, r) {
        return new Ut.prototype.init(e, t, n, i, r);
    }
    function Vt(e, t) {
        var n,
            i = { height: e },
            r = 0;
        for (t = t ? 1 : 0; 4 > r; r += 2 - t) i["margin" + (n = Je[r])] = i["padding" + n] = e;
        return t && (i.opacity = i.width = e), i;
    }
    function Kt(e) {
        return b.isWindow(e) ? e : 9 === e.nodeType && (e.defaultView || e.parentWindow);
    }
    (b.Animation = b.extend(Xt, {
        tweener: function (e, t) {
            b.isFunction(e) ? ((t = e), (e = ["*"])) : (e = e.split(" "));
            for (var n, i = 0, r = e.length; r > i; i++) (n = e[i]), ($t[n] = $t[n] || []), $t[n].unshift(t);
        },
        prefilter: function (e, t) {
            t ? It.unshift(e) : It.push(e);
        },
    })),
        (b.Tween = Ut),
        (Ut.prototype = {
            constructor: Ut,
            init: function (e, t, n, i, r, o) {
                (this.elem = e), (this.prop = n), (this.easing = r || "swing"), (this.options = t), (this.start = this.now = this.cur()), (this.end = i), (this.unit = o || (b.cssNumber[n] ? "" : "px"));
            },
            cur: function () {
                var e = Ut.propHooks[this.prop];
                return e && e.get ? e.get(this) : Ut.propHooks._default.get(this);
            },
            run: function (e) {
                var t,
                    n = Ut.propHooks[this.prop];
                return (
                    (this.pos = t = this.options.duration ? b.easing[this.easing](e, this.options.duration * e, 0, 1, this.options.duration) : e),
                    (this.now = (this.end - this.start) * t + this.start),
                    this.options.step && this.options.step.call(this.elem, this.now, this),
                    n && n.set ? n.set(this) : Ut.propHooks._default.set(this),
                    this
                );
            },
        }),
        (Ut.prototype.init.prototype = Ut.prototype),
        (Ut.propHooks = {
            _default: {
                get: function (e) {
                    var t;
                    return null == e.elem[e.prop] || (e.elem.style && null != e.elem.style[e.prop]) ? ((t = b.css(e.elem, e.prop, "")) && "auto" !== t ? t : 0) : e.elem[e.prop];
                },
                set: function (e) {
                    b.fx.step[e.prop] ? b.fx.step[e.prop](e) : e.elem.style && (null != e.elem.style[b.cssProps[e.prop]] || b.cssHooks[e.prop]) ? b.style(e.elem, e.prop, e.now + e.unit) : (e.elem[e.prop] = e.now);
                },
            },
        }),
        (Ut.propHooks.scrollTop = Ut.propHooks.scrollLeft = {
            set: function (e) {
                e.elem.nodeType && e.elem.parentNode && (e.elem[e.prop] = e.now);
            },
        }),
        b.each(["toggle", "show", "hide"], function (e, t) {
            var n = b.fn[t];
            b.fn[t] = function (e, i, r) {
                return null == e || "boolean" == typeof e ? n.apply(this, arguments) : this.animate(Vt(t, !0), e, i, r);
            };
        }),
        b.fn.extend({
            fadeTo: function (e, t, n, i) {
                return this.filter(et).css("opacity", 0).show().end().animate({ opacity: t }, e, n, i);
            },
            animate: function (e, t, n, i) {
                var r = b.isEmptyObject(e),
                    o = b.speed(t, n, i),
                    a = function () {
                        var t = Xt(this, b.extend({}, e), o);
                        (a.finish = function () {
                            t.stop(!0);
                        }),
                            (r || b._data(this, "finish")) && t.stop(!0);
                    };
                return (a.finish = a), r || !1 === o.queue ? this.each(a) : this.queue(o.queue, a);
            },
            stop: function (e, n, i) {
                var r = function (e) {
                    var t = e.stop;
                    delete e.stop, t(i);
                };
                return (
                    "string" != typeof e && ((i = n), (n = e), (e = t)),
                    n && !1 !== e && this.queue(e || "fx", []),
                    this.each(function () {
                        var t = !0,
                            n = null != e && e + "queueHooks",
                            o = b.timers,
                            a = b._data(this);
                        if (n) a[n] && a[n].stop && r(a[n]);
                        else for (n in a) a[n] && a[n].stop && Bt.test(n) && r(a[n]);
                        for (n = o.length; n--; ) o[n].elem !== this || (null != e && o[n].queue !== e) || (o[n].anim.stop(i), (t = !1), o.splice(n, 1));
                        (t || !i) && b.dequeue(this, e);
                    })
                );
            },
            finish: function (e) {
                return (
                    !1 !== e && (e = e || "fx"),
                    this.each(function () {
                        var t,
                            n = b._data(this),
                            i = n[e + "queue"],
                            r = n[e + "queueHooks"],
                            o = b.timers,
                            a = i ? i.length : 0;
                        for (n.finish = !0, b.queue(this, e, []), r && r.cur && r.cur.finish && r.cur.finish.call(this), t = o.length; t--; ) o[t].elem === this && o[t].queue === e && (o[t].anim.stop(!0), o.splice(t, 1));
                        for (t = 0; a > t; t++) i[t] && i[t].finish && i[t].finish.call(this);
                        delete n.finish;
                    })
                );
            },
        }),
        b.each({ slideDown: Vt("show"), slideUp: Vt("hide"), slideToggle: Vt("toggle"), fadeIn: { opacity: "show" }, fadeOut: { opacity: "hide" }, fadeToggle: { opacity: "toggle" } }, function (e, t) {
            b.fn[e] = function (e, n, i) {
                return this.animate(t, e, n, i);
            };
        }),
        (b.speed = function (e, t, n) {
            var i = e && "object" == typeof e ? b.extend({}, e) : { complete: n || (!n && t) || (b.isFunction(e) && e), duration: e, easing: (n && t) || (t && !b.isFunction(t) && t) };
            return (
                (i.duration = b.fx.off ? 0 : "number" == typeof i.duration ? i.duration : i.duration in b.fx.speeds ? b.fx.speeds[i.duration] : b.fx.speeds._default),
                (null == i.queue || !0 === i.queue) && (i.queue = "fx"),
                (i.old = i.complete),
                (i.complete = function () {
                    b.isFunction(i.old) && i.old.call(this), i.queue && b.dequeue(this, i.queue);
                }),
                i
            );
        }),
        (b.easing = {
            linear: function (e) {
                return e;
            },
            swing: function (e) {
                return 0.5 - Math.cos(e * Math.PI) / 2;
            },
        }),
        (b.timers = []),
        (b.fx = Ut.prototype.init),
        (b.fx.tick = function () {
            var e,
                n = b.timers,
                i = 0;
            for (qt = b.now(); n.length > i; i++) (e = n[i])() || n[i] !== e || n.splice(i--, 1);
            n.length || b.fx.stop(), (qt = t);
        }),
        (b.fx.timer = function (e) {
            e() && b.timers.push(e) && b.fx.start();
        }),
        (b.fx.interval = 13),
        (b.fx.start = function () {
            Ft || (Ft = setInterval(b.fx.tick, b.fx.interval));
        }),
        (b.fx.stop = function () {
            clearInterval(Ft), (Ft = null);
        }),
        (b.fx.speeds = { slow: 600, fast: 200, _default: 400 }),
        (b.fx.step = {}),
        b.expr &&
            b.expr.filters &&
            (b.expr.filters.animated = function (e) {
                return b.grep(b.timers, function (t) {
                    return e === t.elem;
                }).length;
            }),
        (b.fn.offset = function (e) {
            if (arguments.length)
                return e === t
                    ? this
                    : this.each(function (t) {
                          b.offset.setOffset(this, e, t);
                      });
            var n,
                i,
                o = { top: 0, left: 0 },
                a = this[0],
                s = a && a.ownerDocument;
            return s
                ? ((n = s.documentElement),
                  b.contains(n, a)
                      ? (typeof a.getBoundingClientRect !== r && (o = a.getBoundingClientRect()),
                        (i = Kt(s)),
                        { top: o.top + (i.pageYOffset || n.scrollTop) - (n.clientTop || 0), left: o.left + (i.pageXOffset || n.scrollLeft) - (n.clientLeft || 0) })
                      : o)
                : void 0;
        }),
        (b.offset = {
            setOffset: function (e, t, n) {
                var i = b.css(e, "position");
                "static" === i && (e.style.position = "relative");
                var r,
                    o,
                    a = b(e),
                    s = a.offset(),
                    l = b.css(e, "top"),
                    c = b.css(e, "left"),
                    u = {},
                    d = {};
                ("absolute" === i || "fixed" === i) && b.inArray("auto", [l, c]) > -1 ? ((r = (d = a.position()).top), (o = d.left)) : ((r = parseFloat(l) || 0), (o = parseFloat(c) || 0)),
                    b.isFunction(t) && (t = t.call(e, n, s)),
                    null != t.top && (u.top = t.top - s.top + r),
                    null != t.left && (u.left = t.left - s.left + o),
                    "using" in t ? t.using.call(e, u) : a.css(u);
            },
        }),
        b.fn.extend({
            position: function () {
                if (this[0]) {
                    var e,
                        t,
                        n = { top: 0, left: 0 },
                        i = this[0];
                    return (
                        "fixed" === b.css(i, "position")
                            ? (t = i.getBoundingClientRect())
                            : ((e = this.offsetParent()), (t = this.offset()), b.nodeName(e[0], "html") || (n = e.offset()), (n.top += b.css(e[0], "borderTopWidth", !0)), (n.left += b.css(e[0], "borderLeftWidth", !0))),
                        { top: t.top - n.top - b.css(i, "marginTop", !0), left: t.left - n.left - b.css(i, "marginLeft", !0) }
                    );
                }
            },
            offsetParent: function () {
                return this.map(function () {
                    for (var e = this.offsetParent || o.documentElement; e && !b.nodeName(e, "html") && "static" === b.css(e, "position"); ) e = e.offsetParent;
                    return e || o.documentElement;
                });
            },
        }),
        b.each({ scrollLeft: "pageXOffset", scrollTop: "pageYOffset" }, function (e, n) {
            var i = /Y/.test(n);
            b.fn[e] = function (r) {
                return b.access(
                    this,
                    function (e, r, o) {
                        var a = Kt(e);
                        return o === t ? (a ? (n in a ? a[n] : a.document.documentElement[r]) : e[r]) : (a ? a.scrollTo(i ? b(a).scrollLeft() : o, i ? o : b(a).scrollTop()) : (e[r] = o), t);
                    },
                    e,
                    r,
                    arguments.length,
                    null
                );
            };
        }),
        b.each({ Height: "height", Width: "width" }, function (e, n) {
            b.each({ padding: "inner" + e, content: n, "": "outer" + e }, function (i, r) {
                b.fn[r] = function (r, o) {
                    var a = arguments.length && (i || "boolean" != typeof r),
                        s = i || (!0 === r || !0 === o ? "margin" : "border");
                    return b.access(
                        this,
                        function (n, i, r) {
                            var o;
                            return b.isWindow(n)
                                ? n.document.documentElement["client" + e]
                                : 9 === n.nodeType
                                ? ((o = n.documentElement), Math.max(n.body["scroll" + e], o["scroll" + e], n.body["offset" + e], o["offset" + e], o["client" + e]))
                                : r === t
                                ? b.css(n, i, s)
                                : b.style(n, i, r, s);
                        },
                        n,
                        a ? r : t,
                        a,
                        null
                    );
                };
            });
        }),
        (e.jQuery = e.$ = b),
        "function" == typeof define &&
            define.amd &&
            define.amd.jQuery &&
            define("jquery", [], function () {
                return b;
            });
})(window),
    /*!
     * jQuery Cookie Plugin v1.4.1
     * https://github.com/carhartl/jquery-cookie
     *
     * Copyright 2006, 2014 Klaus Hartl
     * Released under the MIT license
     */
    (function (e) {
        "function" == typeof define && define.amd ? define(["jquery"], e) : "object" == typeof exports ? e(require("jquery")) : e(jQuery);
    })(function (e) {
        var t = /\+/g;
        function n(e) {
            return a.raw ? e : encodeURIComponent(e);
        }
        function i(e) {
            return a.raw ? e : decodeURIComponent(e);
        }
        function r(e) {
            return n(a.json ? JSON.stringify(e) : String(e));
        }
        function o(n, i) {
            var r = a.raw
                ? n
                : (function (e) {
                      0 === e.indexOf('"') && (e = e.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, "\\"));
                      try {
                          return (e = decodeURIComponent(e.replace(t, " "))), a.json ? JSON.parse(e) : e;
                      } catch (e) {}
                  })(n);
            return e.isFunction(i) ? i(r) : r;
        }
        var a = (e.cookie = function (t, s, l) {
            if (arguments.length > 1 && !e.isFunction(s)) {
                if ("number" == typeof (l = e.extend({}, a.defaults, l)).expires) {
                    var c = l.expires,
                        u = (l.expires = new Date());
                    u.setTime(+u + 864e5 * c);
                }
                return (document.cookie = [n(t), "=", r(s), l.expires ? "; expires=" + l.expires.toUTCString() : "", l.path ? "; path=" + l.path : "", l.domain ? "; domain=" + l.domain : "", l.secure ? "; secure" : ""].join(""));
            }
            for (var d = t ? void 0 : {}, p = document.cookie ? document.cookie.split("; ") : [], f = 0, h = p.length; f < h; f++) {
                var g = p[f].split("="),
                    m = i(g.shift()),
                    y = g.join("=");
                if (t && t === m) {
                    d = o(y, s);
                    break;
                }
                t || void 0 === (y = o(y)) || (d[m] = y);
            }
            return d;
        });
        (a.defaults = {}),
            (e.removeCookie = function (t, n) {
                return void 0 !== e.cookie(t) && (e.cookie(t, "", e.extend({}, n, { expires: -1 })), !e.cookie(t));
            });
    }),
    (function (e, t) {
        var n,
            i,
            r,
            o,
            a,
            s,
            l,
            c,
            u,
            d,
            p,
            f,
            h,
            g = Array.prototype.slice,
            m = decodeURIComponent,
            y = e.param,
            v = (e.bbq = e.bbq || {}),
            b = e.event.special,
            x = "hashchange",
            w = "querystring",
            k = "fragment",
            C = "elemUrlAttr",
            T = "href",
            E = "src",
            N = /^.*\?|#.*$/g,
            j = {};
        function S(e) {
            return "string" == typeof e;
        }
        function A(e) {
            var t = g.call(arguments, 1);
            return function () {
                return e.apply(this, t.concat(g.call(arguments)));
            };
        }
        function L(t, r, a, s, l) {
            var c, f, g, y, v;
            return (
                s !== n
                    ? ((v = (g = a.match(t ? d : /^([^#?]*)\??([^#]*)(#?.*)/))[3] || ""),
                      2 === l && S(s) ? (f = s.replace(t ? u : N, "")) : ((y = o(g[2])), (s = S(s) ? o[t ? k : w](s) : s), (f = 2 === l ? s : 1 === l ? e.extend({}, s, y) : e.extend({}, y, s)), (f = i(f)), t && (f = f.replace(p, m))),
                      (c = g[1] + (t ? h : f || !g[1] ? "?" : "") + f + v))
                    : (c = r(a !== n ? a : location.href)),
                c
            );
        }
        function H(e, t, i) {
            return t === n || "boolean" == typeof t ? ((i = t), (t = y[e ? k : w]())) : (t = S(t) ? t.replace(e ? u : N, "") : t), o(t, i);
        }
        function D(t, i, r, o) {
            return (
                S(r) || "object" == typeof r || ((o = r), (r = i), (i = n)),
                this.each(function () {
                    var n = e(this),
                        a = i || c()[(this.nodeName || "").toLowerCase()] || "",
                        s = (a && n.attr(a)) || "";
                    n.attr(a, y[t](s, r, o));
                })
            );
        }
        (y[w] = A(L, 0, function (e) {
            return e.replace(/(?:^[^?#]*\?([^#]*).*$)?.*/, "$1");
        })),
            (y[k] = r = A(L, 1, function (e) {
                return e.replace(d, "$2");
            })),
            (y.sorted = i = function (t, n) {
                var i = [],
                    r = {};
                return (
                    e.each(y(t, n).split("&"), function (e, t) {
                        var n = t.replace(/(?:%5B|=).*$/, ""),
                            o = r[n];
                        o || ((o = r[n] = []), i.push(n)), o.push(t);
                    }),
                    e
                        .map(i.sort(), function (e) {
                            return r[e];
                        })
                        .join("&")
                );
            }),
            (r.noEscape = function (t) {
                t = t || "";
                var n = e.map(t.split(""), encodeURIComponent);
                p = new RegExp(n.join("|"), "g");
            }),
            r.noEscape(",/"),
            (r.ajaxCrawlable = function (e) {
                return e !== n && (e ? ((u = /^.*(?:#!|#)/), (d = /^([^#]*)(?:#!|#)?(.*)$/), (h = "#!")) : ((u = /^.*#/), (d = /^([^#]*)#?(.*)$/), (h = "#")), (f = !!e)), f;
            }),
            r.ajaxCrawlable(0),
            (e.deparam = o = function (t, i) {
                var r = {},
                    o = { true: !0, false: !1, null: null };
                return (
                    e.each(t.replace(/\+/g, " ").split("&"), function (t, a) {
                        var s,
                            l = a.split("="),
                            c = m(l[0]),
                            u = r,
                            d = 0,
                            p = c.split("]["),
                            f = p.length - 1;
                        if ((/\[/.test(p[0]) && /\]$/.test(p[f]) ? ((p[f] = p[f].replace(/\]$/, "")), (f = (p = p.shift().split("[").concat(p)).length - 1)) : (f = 0), 2 === l.length))
                            if (((s = m(l[1])), i && (s = s && !isNaN(s) ? +s : "undefined" === s ? n : o[s] !== n ? o[s] : s), f))
                                for (; d <= f; d++) u = u[(c = "" === p[d] ? u.length : p[d])] = d < f ? u[c] || (p[d + 1] && isNaN(p[d + 1]) ? {} : []) : s;
                            else e.isArray(r[c]) ? r[c].push(s) : r[c] !== n ? (r[c] = [r[c], s]) : (r[c] = s);
                        else c && (r[c] = i ? n : "");
                    }),
                    r
                );
            }),
            (o[w] = A(H, 0)),
            (o[k] = a = A(H, 1)),
            e[C] ||
                (e[C] = function (t) {
                    return e.extend(j, t);
                })({ a: T, base: T, iframe: E, img: E, input: E, form: "action", link: T, script: E }),
            (c = e[C]),
            (e.fn[w] = A(D, w)),
            (e.fn[k] = A(D, k)),
            (v.pushState = s = function (e, t) {
                S(e) && /^#/.test(e) && t === n && (t = 2);
                var i = e !== n,
                    o = r(location.href, i ? e : {}, i ? t : 2);
                location.href = o;
            }),
            (v.getState = l = function (e, t) {
                return e === n || "boolean" == typeof e ? a(e) : a(t)[e];
            }),
            (v.removeState = function (t) {
                var i = {};
                t !== n &&
                    ((i = l()),
                    e.each(e.isArray(t) ? t : arguments, function (e, t) {
                        delete i[t];
                    })),
                    s(i, 2);
            }),
            (b[x] = e.extend(b[x], {
                add: function (t) {
                    var i;
                    function a(e) {
                        var t = (e[k] = r());
                        (e.getState = function (e, i) {
                            return e === n || "boolean" == typeof e ? o(t, e) : o(t, i)[e];
                        }),
                            i.apply(this, arguments);
                    }
                    if (e.isFunction(t)) return (i = t), a;
                    (i = t.handler), (t.handler = a);
                },
            }));
    })(jQuery),
    (function (e, t, n) {
        var i,
            r = "hashchange",
            o = document,
            a = e.event.special,
            s = o.documentMode,
            l = "on" + r in t && (s === n || s > 7);
        function c(e) {
            return "#" + (e = e || location.href).replace(/^[^#]*#?(.*)$/, "$1");
        }
        (e.fn[r] = function (e) {
            return e ? this.bind(r, e) : this.trigger(r);
        }),
            (e.fn[r].delay = 50),
            (a[r] = e.extend(a[r], {
                setup: function () {
                    if (l) return !1;
                    e(i.start);
                },
                teardown: function () {
                    if (l) return !1;
                    e(i.stop);
                },
            })),
            (i = (function () {
                var i,
                    a,
                    s,
                    l = {},
                    u = c(),
                    d = function (e) {
                        return e;
                    },
                    p = d,
                    f = d;
                function h() {
                    var n = c(),
                        o = f(u);
                    n !== u ? (p((u = n), o), e(t).trigger(r)) : o !== u && (location.href = location.href.replace(/#.*/, "") + o), (i = setTimeout(h, e.fn[r].delay));
                }
                return (
                    (l.start = function () {
                        i || h();
                    }),
                    (l.stop = function () {
                        i && clearTimeout(i), (i = n);
                    }),
                    navigator.userAgent.match(/msie/i) &&
                        (navigator.userAgent.match(/6/) || navigator.userAgent.match(/7/) || navigator.userAgent.match(/8/)) &&
                        !supports_onhashchange &&
                        ((l.start = function () {
                            a ||
                                ((s = (s = e.fn[r].src) && s + c()),
                                (a = e('<iframe tabindex="-1" title="empty"/>')
                                    .hide()
                                    .one("load", function () {
                                        s || p(c()), h();
                                    })
                                    .attr("src", s || "javascript:0")
                                    .insertAfter("body")[0].contentWindow),
                                (o.onpropertychange = function () {
                                    try {
                                        "title" === event.propertyName && (a.document.title = o.title);
                                    } catch (e) {}
                                }));
                        }),
                        (l.stop = d),
                        (f = function () {
                            return c(a.location.href);
                        }),
                        (p = function (t, n) {
                            var i = a.document,
                                s = e.fn[r].domain;
                            t !== n && ((i.title = o.title), i.open(), s && i.write('<script>document.domain="' + s + '"</script>'), i.close(), (a.location.hash = t));
                        })),
                    l
                );
            })());
    })(jQuery, this),
    (function (e, t, n) {
        var i,
            r = (function () {
                for (var e = /audio(.min)?.js.*/, t = document.getElementsByTagName("script"), n = 0, i = t.length; n < i; n++) {
                    var r = t[n].getAttribute("src");
                    if (e.test(r)) return r.replace(e, "");
                }
            })();
        (n[e] = {
            instanceCount: 0,
            instances: {},
            flashSource:
                '      <object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" id="$1" width="1" height="1" name="$1" style="position: absolute; left: -1px;">         <param name="movie" value="$2?playerInstance=' +
                e +
                '.instances[\'$1\']&datetime=$3">         <param name="allowscriptaccess" value="always">         <embed name="$1" src="$2?playerInstance=' +
                e +
                '.instances[\'$1\']&datetime=$3" width="1" height="1" allowscriptaccess="always">       </object>',
            settings: {
                autoplay: !1,
                loop: !1,
                preload: !0,
                imageLocation: r + "player-graphics.gif",
                swfLocation: r + "audiojs.swf",
                useFlash: ((i = document.createElement("audio")), !(i.canPlayType && i.canPlayType("audio/mpeg;").replace(/no/, ""))),
                hasFlash: (function () {
                    if (navigator.plugins && navigator.plugins.length && navigator.plugins["Shockwave Flash"]) return !0;
                    if (navigator.mimeTypes && navigator.mimeTypes.length) {
                        var e = navigator.mimeTypes["application/x-shockwave-flash"];
                        return e && e.enabledPlugin;
                    }
                    try {
                        return new ActiveXObject("ShockwaveFlash.ShockwaveFlash"), !0;
                    } catch (e) {}
                    return !1;
                })(),
                createPlayer: {
                    markup:
                        '          <div class="play-pause">             <p class="play"></p>             <p class="pause"></p>             <p class="loading"></p>             <p class="error"></p>           </div>           <div class="scrubber">             <div class="progress"></div>             <div class="loaded"></div>           </div>           <div class="time">             <em class="played">00:00</em>/<strong class="duration">00:00</strong>           </div>           <div class="error-message"></div>',
                    playPauseClass: "play-pause",
                    scrubberClass: "scrubber",
                    progressClass: "progress",
                    loaderClass: "loaded",
                    timeClass: "time",
                    durationClass: "duration",
                    playedClass: "played",
                    errorMessageClass: "error-message",
                    playingClass: "playing",
                    loadingClass: "loading",
                    errorClass: "error",
                },
                css:
                    '        .audiojs audio { position: absolute; left: -1px; }         .audiojs { width: 460px; height: 36px; background: #404040; overflow: hidden; font-family: monospace; font-size: 12px;           background-image: -webkit-gradient(linear, left top, left bottom, color-stop(0, #444), color-stop(0.5, #555), color-stop(0.51, #444), color-stop(1, #444));           background-image: -moz-linear-gradient(center top, #444 0%, #555 50%, #444 51%, #444 100%);           -webkit-box-shadow: 1px 1px 8px rgba(0, 0, 0, 0.3); -moz-box-shadow: 1px 1px 8px rgba(0, 0, 0, 0.3);           -o-box-shadow: 1px 1px 8px rgba(0, 0, 0, 0.3); box-shadow: 1px 1px 8px rgba(0, 0, 0, 0.3); }         .audiojs .play-pause { width: 25px; height: 40px; padding: 4px 6px; margin: 0px; float: left; overflow: hidden; border-right: 1px solid #000; }         .audiojs p { display: none; width: 25px; height: 40px; margin: 0px; cursor: pointer; }         .audiojs .play { display: block; }         .audiojs .scrubber { position: relative; float: left; width: 280px; background: #5a5a5a; height: 14px; margin: 10px; border-top: 1px solid #3f3f3f; border-left: 0px; border-bottom: 0px; overflow: hidden; }         .audiojs .progress { position: absolute; top: 0px; left: 0px; height: 14px; width: 0px; background: #ccc; z-index: 1;           background-image: -webkit-gradient(linear, left top, left bottom, color-stop(0, #ccc), color-stop(0.5, #ddd), color-stop(0.51, #ccc), color-stop(1, #ccc));           background-image: -moz-linear-gradient(center top, #ccc 0%, #ddd 50%, #ccc 51%, #ccc 100%); }         .audiojs .loaded { position: absolute; top: 0px; left: 0px; height: 14px; width: 0px; background: #000;           background-image: -webkit-gradient(linear, left top, left bottom, color-stop(0, #222), color-stop(0.5, #333), color-stop(0.51, #222), color-stop(1, #222));           background-image: -moz-linear-gradient(center top, #222 0%, #333 50%, #222 51%, #222 100%); }         .audiojs .time { float: left; height: 36px; line-height: 36px; margin: 0px 0px 0px 6px; padding: 0px 6px 0px 12px; border-left: 1px solid #000; color: #ddd; text-shadow: 1px 1px 0px rgba(0, 0, 0, 0.5); }         .audiojs .time em { padding: 0px 2px 0px 0px; color: #f9f9f9; font-style: normal; }         .audiojs .time strong { padding: 0px 0px 0px 2px; font-weight: normal; }         .audiojs .error-message { float: left; display: none; margin: 0px 10px; height: 36px; width: 400px; overflow: hidden; line-height: 36px; white-space: nowrap; color: #fff;           text-overflow: ellipsis; -o-text-overflow: ellipsis; -icab-text-overflow: ellipsis; -khtml-text-overflow: ellipsis; -moz-text-overflow: ellipsis; -webkit-text-overflow: ellipsis; }         .audiojs .error-message a { color: #eee; text-decoration: none; padding-bottom: 1px; border-bottom: 1px solid #999; white-space: wrap; }                 .audiojs .play { background: url("$1") -2px -1px no-repeat; }         .audiojs .loading { background: url("$1") -2px -31px no-repeat; }         .audiojs .error { background: url("$1") -2px -61px no-repeat; }         .audiojs .pause { background: url("$1") -2px -91px no-repeat; }                 .playing .play, .playing .loading, .playing .error { display: none; }         .playing .pause { display: block; }                 .loading .play, .loading .pause, .loading .error { display: none; }         .loading .loading { display: block; }                 .error .time, .error .play, .error .pause, .error .scrubber, .error .loading { display: none; }         .error .error { display: block; }         .error .play-pause p { cursor: auto; }         .error .error-message { display: block; }',
                trackEnded: function () {},
                flashError: function () {
                    var t = this.settings.createPlayer,
                        i = o(t.errorMessageClass, this.wrapper),
                        r = 'Missing <a href="http://get.adobe.com/flashplayer/">flash player</a> plugin.';
                    this.mp3 && (r += ' <a href="' + this.mp3 + '">Download audio file</a>.'), n[e].helpers.removeClass(this.wrapper, t.loadingClass), n[e].helpers.addClass(this.wrapper, t.errorClass), (i.innerHTML = r);
                },
                loadError: function () {
                    var t = this.settings.createPlayer,
                        i = o(t.errorMessageClass, this.wrapper);
                    n[e].helpers.removeClass(this.wrapper, t.loadingClass), n[e].helpers.addClass(this.wrapper, t.errorClass), (i.innerHTML = 'Error loading: "' + this.mp3 + '"');
                },
                init: function () {
                    n[e].helpers.addClass(this.wrapper, this.settings.createPlayer.loadingClass);
                },
                loadStarted: function () {
                    var t = this.settings.createPlayer,
                        i = o(t.durationClass, this.wrapper),
                        r = Math.floor(this.duration / 60),
                        a = Math.floor(this.duration % 60);
                    n[e].helpers.removeClass(this.wrapper, t.loadingClass), (i.innerHTML = (r < 10 ? "0" : "") + r + ":" + (a < 10 ? "0" : "") + a);
                },
                loadProgress: function (e) {
                    var t = this.settings.createPlayer,
                        n = o(t.scrubberClass, this.wrapper);
                    o(t.loaderClass, this.wrapper).style.width = n.offsetWidth * e + "px";
                },
                playPause: function () {
                    this.playing ? this.settings.play() : this.settings.pause();
                },
                play: function () {
                    n[e].helpers.addClass(this.wrapper, this.settings.createPlayer.playingClass);
                },
                pause: function () {
                    n[e].helpers.removeClass(this.wrapper, this.settings.createPlayer.playingClass);
                },
                updatePlayhead: function (e) {
                    var t = this.settings.createPlayer,
                        n = o(t.scrubberClass, this.wrapper);
                    (o(t.progressClass, this.wrapper).style.width = n.offsetWidth * e + "px"),
                        (t = o(t.playedClass, this.wrapper)),
                        (n = this.duration * e),
                        (e = Math.floor(n / 60)),
                        (n = Math.floor(n % 60)),
                        (t.innerHTML = (e < 10 ? "0" : "") + e + ":" + (n < 10 ? "0" : "") + n);
                },
            },
            create: function (e, t) {
                return (t = t || {}), e.length ? this.createAll(t, e) : this.newInstance(e, t);
            },
            createAll: function (e, t) {
                var n = t || document.getElementsByTagName("audio"),
                    i = [];
                e = e || {};
                for (var r = 0, o = n.length; r < o; r++) i.push(this.newInstance(n[r], e));
                return i;
            },
            newInstance: function (e, i) {
                var r = this.helpers.clone(this.settings),
                    o = "audiojs" + this.instanceCount,
                    a = "audiojs_wrapper" + this.instanceCount;
                return (
                    this.instanceCount++,
                    null != e.getAttribute("autoplay") && (r.autoplay = !0),
                    null != e.getAttribute("loop") && (r.loop = !0),
                    "none" == e.getAttribute("preload") && (r.preload = !1),
                    i && this.helpers.merge(r, i),
                    r.createPlayer.markup ? (e = this.createPlayer(e, r.createPlayer, a)) : e.parentNode.setAttribute("id", a),
                    (a = new n[t](e, r)),
                    r.css && this.helpers.injectCss(a, r.css),
                    r.useFlash && r.hasFlash ? (this.injectFlash(a, o), this.attachFlashEvents(a.wrapper, a)) : r.useFlash && !r.hasFlash && this.settings.flashError.apply(a),
                    (!r.useFlash || (r.useFlash && r.hasFlash)) && this.attachEvents(a.wrapper, a),
                    (this.instances[o] = a)
                );
            },
            createPlayer: function (e, t, n) {
                var i = document.createElement("div"),
                    r = e.cloneNode(!0);
                return (
                    i.setAttribute("class", "audiojs"),
                    i.setAttribute("className", "audiojs"),
                    i.setAttribute("id", n),
                    r.outerHTML && !document.createElement("audio").canPlayType
                        ? ((r = this.helpers.cloneHtml5Node(e)), (i.innerHTML = t.markup), i.appendChild(r), (e.outerHTML = i.outerHTML), (i = document.getElementById(n)))
                        : (i.appendChild(r), (i.innerHTML += t.markup), e.parentNode.replaceChild(i, e)),
                    i.getElementsByTagName("audio")[0]
                );
            },
            attachEvents: function (t, i) {
                if (i.settings.createPlayer) {
                    var r = i.settings.createPlayer,
                        a = o(r.playPauseClass, t),
                        s = o(r.scrubberClass, t);
                    n[e].events.addListener(a, "click", function () {
                        i.playPause.apply(i);
                    }),
                        n[e].events.addListener(s, "click", function (e) {
                            e = e.clientX;
                            var t = this,
                                n = 0;
                            if (t.offsetParent)
                                do {
                                    n += t.offsetLeft;
                                } while ((t = t.offsetParent));
                            i.skipTo((e - n) / s.offsetWidth);
                        }),
                        i.settings.useFlash ||
                            (n[e].events.trackLoadProgress(i),
                            n[e].events.addListener(i.element, "timeupdate", function () {
                                i.updatePlayhead.apply(i);
                            }),
                            n[e].events.addListener(i.element, "ended", function () {
                                i.trackEnded.apply(i);
                            }),
                            n[e].events.addListener(i.source, "error", function () {
                                clearInterval(i.readyTimer), clearInterval(i.loadTimer), i.settings.loadError.apply(i);
                            }));
                }
            },
            attachFlashEvents: function (e, t) {
                (t.swfReady = !1),
                    (t.load = function (e) {
                        (t.mp3 = e), t.swfReady && t.element.load(e);
                    }),
                    (t.loadProgress = function (e, n) {
                        (t.loadedPercent = e), (t.duration = n), t.settings.loadStarted.apply(t), t.settings.loadProgress.apply(t, [e]);
                    }),
                    (t.skipTo = function (e) {
                        e > t.loadedPercent || (t.updatePlayhead.call(t, [e]), t.element.skipTo(e));
                    }),
                    (t.updatePlayhead = function (e) {
                        t.settings.updatePlayhead.apply(t, [e]);
                    }),
                    (t.play = function () {
                        t.settings.preload || ((t.settings.preload = !0), t.element.init(t.mp3)), (t.playing = !0), t.element.pplay(), t.settings.play.apply(t);
                    }),
                    (t.pause = function () {
                        (t.playing = !1), t.element.ppause(), t.settings.pause.apply(t);
                    }),
                    (t.setVolume = function (e) {
                        t.element.setVolume(e);
                    }),
                    (t.loadStarted = function () {
                        (t.swfReady = !0), t.settings.preload && t.element.init(t.mp3), t.settings.autoplay && t.play.apply(t);
                    });
            },
            injectFlash: function (e, t) {
                var n = this.flashSource.replace(/\$1/g, t);
                n = (n = n.replace(/\$2/g, e.settings.swfLocation)).replace(/\$3/g, +new Date() + Math.random());
                var i = e.wrapper.innerHTML,
                    r = document.createElement("div");
                (r.innerHTML = n + i), (e.wrapper.innerHTML = r.innerHTML), (e.element = this.helpers.getSwf(t));
            },
            helpers: {
                merge: function (e, t) {
                    for (attr in t) (e.hasOwnProperty(attr) || t.hasOwnProperty(attr)) && (e[attr] = t[attr]);
                },
                clone: function (e) {
                    if (null == e || "object" != typeof e) return e;
                    var t,
                        n = new e.constructor();
                    for (t in e) n[t] = arguments.callee(e[t]);
                    return n;
                },
                addClass: function (e, t) {
                    RegExp("(\\s|^)" + t + "(\\s|$)").test(e.className) || (e.className += " " + t);
                },
                removeClass: function (e, t) {
                    e.className = e.className.replace(RegExp("(\\s|^)" + t + "(\\s|$)"), " ");
                },
                injectCss: function (e, t) {
                    for (var n = "", i = document.getElementsByTagName("style"), r = t.replace(/\$1/g, e.settings.imageLocation), o = 0, a = i.length; o < a; o++) {
                        var s = i[o].getAttribute("title");
                        if (s && ~s.indexOf("audiojs")) {
                            if ((a = i[o]).innerHTML === r) return;
                            n = a.innerHTML;
                            break;
                        }
                    }
                    (o = (i = document.getElementsByTagName("head")[0]).firstChild),
                        (a = document.createElement("style")),
                        i &&
                            (a.setAttribute("type", "text/css"),
                            a.setAttribute("title", "audiojs"),
                            a.styleSheet ? (a.styleSheet.cssText = n + r) : a.appendChild(document.createTextNode(n + r)),
                            o ? i.insertBefore(a, o) : i.appendChild(styleElement));
                },
                cloneHtml5Node: function (e) {
                    var t = document.createDocumentFragment(),
                        n = t.createElement ? t : document;
                    return n.createElement("audio"), (n = n.createElement("div")), t.appendChild(n), (n.innerHTML = e.outerHTML), n.firstChild;
                },
                getSwf: function (e) {
                    return (e = document[e] || window[e]).length > 1 ? e[e.length - 1] : e;
                },
            },
            events: {
                memoryLeaking: !1,
                listeners: [],
                addListener: function (t, i, r) {
                    t.addEventListener
                        ? t.addEventListener(i, r, !1)
                        : t.attachEvent &&
                          (this.listeners.push(t),
                          this.memoryLeaking ||
                              (window.attachEvent("onunload", function () {
                                  if (this.listeners) for (var t = 0, i = this.listeners.length; t < i; t++) n[e].events.purge(this.listeners[t]);
                              }),
                              (this.memoryLeaking = !0)),
                          t.attachEvent("on" + i, function () {
                              r.call(t, window.event);
                          }));
                },
                trackLoadProgress: function (e) {
                    if (e.settings.preload) {
                        var t, n;
                        e = e;
                        var i = /(ipod|iphone|ipad)/i.test(navigator.userAgent);
                        (t = setInterval(function () {
                            e.element.readyState > -1 && (i || e.init.apply(e)),
                                e.element.readyState > 1 &&
                                    (e.settings.autoplay && e.play.apply(e),
                                    clearInterval(t),
                                    (n = setInterval(function () {
                                        e.loadProgress.apply(e), e.loadedPercent >= 1 && clearInterval(n);
                                    })));
                        }, 10)),
                            (e.readyTimer = t),
                            (e.loadTimer = n);
                    }
                },
                purge: function (e) {
                    var t,
                        n = e.attributes;
                    if (n) for (t = 0; t < n.length; t += 1) "function" == typeof e[n[t].name] && (e[n[t].name] = null);
                    if ((n = e.childNodes)) for (t = 0; t < n.length; t += 1) purge(e.childNodes[t]);
                },
                ready: function (e) {
                    var t = window,
                        n = !1,
                        i = !0,
                        r = t.document,
                        o = r.documentElement,
                        a = r.addEventListener ? "addEventListener" : "attachEvent",
                        s = r.addEventListener ? "removeEventListener" : "detachEvent",
                        l = r.addEventListener ? "" : "on",
                        c = function (i) {
                            ("readystatechange" == i.type && "complete" != r.readyState) || (("load" == i.type ? t : r)[s](l + i.type, c, !1), !n && (n = !0) && e.call(t, i.type || i));
                        },
                        u = function () {
                            try {
                                o.doScroll("left");
                            } catch (e) {
                                return void setTimeout(u, 50);
                            }
                            c("poll");
                        };
                    if ("complete" == r.readyState) e.call(t, "lazy");
                    else {
                        if (r.createEventObject && o.doScroll) {
                            try {
                                i = !t.frameElement;
                            } catch (e) {}
                            i && u();
                        }
                        r[a](l + "DOMContentLoaded", c, !1), r[a](l + "readystatechange", c, !1), t[a](l + "load", c, !1);
                    }
                },
            },
        }),
            (n[t] = function (e, t) {
                var n, i;
                (this.element = e),
                    (this.wrapper = e.parentNode),
                    (this.source = e.getElementsByTagName("source")[0] || e),
                    (this.mp3 = ((i = (n = e).getElementsByTagName("source")[0]), n.getAttribute("src") || (i ? i.getAttribute("src") : null))),
                    (this.settings = t),
                    (this.loadStartedCalled = !1),
                    (this.loadedPercent = 0),
                    (this.duration = 1),
                    (this.playing = !1);
            }),
            (n[t].prototype = {
                updatePlayhead: function () {
                    this.settings.updatePlayhead.apply(this, [this.element.currentTime / this.duration]);
                },
                skipTo: function (e) {
                    e > this.loadedPercent || ((this.element.currentTime = this.duration * e), this.updatePlayhead());
                },
                load: function (t) {
                    (this.loadStartedCalled = !1), this.source.setAttribute("src", t), this.element.load(), (this.mp3 = t), n[e].events.trackLoadProgress(this);
                },
                loadError: function () {
                    this.settings.loadError.apply(this);
                },
                init: function () {
                    this.settings.init.apply(this);
                },
                loadStarted: function () {
                    if (!this.element.duration) return !1;
                    (this.duration = this.element.duration), this.updatePlayhead(), this.settings.loadStarted.apply(this);
                },
                loadProgress: function () {
                    null != this.element.buffered &&
                        this.element.buffered.length &&
                        (this.loadStartedCalled || (this.loadStartedCalled = this.loadStarted()),
                        (this.loadedPercent = this.element.buffered.end(this.element.buffered.length - 1) / this.duration),
                        this.settings.loadProgress.apply(this, [this.loadedPercent]));
                },
                playPause: function () {
                    this.playing ? this.pause() : this.play();
                },
                play: function () {
                    /(ipod|iphone|ipad)/i.test(navigator.userAgent) && 0 == this.element.readyState && this.init.apply(this),
                        this.settings.preload || ((this.settings.preload = !0), this.element.setAttribute("preload", "auto"), n[e].events.trackLoadProgress(this)),
                        (this.playing = !0),
                        this.element.play(),
                        this.settings.play.apply(this);
                },
                pause: function () {
                    (this.playing = !1), this.element.pause(), this.settings.pause.apply(this);
                },
                setVolume: function (e) {
                    this.element.volume = e;
                },
                trackEnded: function () {
                    this.skipTo.apply(this, [0]), this.settings.loop || this.pause.apply(this), this.settings.trackEnded.apply(this);
                },
            });
        var o = function (e, t) {
            var n = [];
            if ((t = t || document).getElementsByClassName) n = t.getElementsByClassName(e);
            else {
                var i,
                    r,
                    o = t.getElementsByTagName("*"),
                    a = RegExp("(^|\\s)" + e + "(\\s|$)");
                for (i = 0, r = o.length; i < r; i++) a.test(o[i].className) && n.push(o[i]);
            }
            return n.length > 1 ? n : n[0];
        };
    })("audiojs", "audiojsInstance", this),
    /*!
     * fancyBox - jQuery Plugin
     * version: 2.1.4 (Thu, 10 Jan 2013)
     * @requires jQuery v1.6 or later
     *
     * Examples at http://fancyapps.com/fancybox/
     * License: www.fancyapps.com/fancybox/#license
     *
     * Copyright 2012 Janis Skarnelis - janis@fancyapps.com
     *
     */
    (function (e, t, n, i) {
        "use strict";
        var r = n(e),
            o = n(t),
            a = (n.fancybox = function () {
                a.open.apply(this, arguments);
            }),
            s = navigator.userAgent.match(/msie/),
            l = null,
            c = void 0 !== t.createTouch,
            u = function (e) {
                return e && e.hasOwnProperty && e instanceof n;
            },
            d = function (e) {
                return e && "string" === n.type(e);
            },
            p = function (e) {
                return d(e) && e.indexOf("%") > 0;
            },
            f = function (e, t) {
                var n = parseInt(e, 10) || 0;
                return t && p(e) && (n = (a.getViewport()[t] / 100) * n), Math.ceil(n);
            },
            h = function (e, t) {
                return f(e, t) + "px";
            };
        n.extend(a, {
            version: "2.1.4",
            defaults: {
                padding: 15,
                margin: 20,
                width: 800,
                height: 600,
                minWidth: 100,
                minHeight: 100,
                maxWidth: 9999,
                maxHeight: 9999,
                autoSize: !0,
                autoHeight: !1,
                autoWidth: !1,
                autoResize: !0,
                autoCenter: !c,
                fitToView: !0,
                aspectRatio: !1,
                topRatio: 0.5,
                leftRatio: 0.5,
                scrolling: "auto",
                wrapCSS: "",
                arrows: !0,
                closeBtn: !0,
                closeClick: !1,
                nextClick: !1,
                mouseWheel: !0,
                autoPlay: !1,
                playSpeed: 3e3,
                preload: 3,
                modal: !1,
                loop: !0,
                ajax: { dataType: "html", headers: { "X-fancyBox": !0 } },
                iframe: { scrolling: "auto", preload: !0 },
                swf: { wmode: "transparent", allowfullscreen: "true", allowscriptaccess: "always" },
                keys: { next: { 13: "left", 34: "up", 39: "left", 40: "up" }, prev: { 8: "right", 33: "down", 37: "right", 38: "down" }, close: [27], play: [32], toggle: [70] },
                direction: { next: "left", prev: "right" },
                scrollOutside: !0,
                index: 0,
                type: null,
                href: null,
                content: null,
                title: null,
                tpl: {
                    wrap: '<div class="fancybox-wrap" tabIndex="-1"><div class="fancybox-skin"><div class="fancybox-outer"><div class="fancybox-inner"></div></div></div></div>',
                    image: '<img class="fancybox-image" src="{href}" alt="" />',
                    iframe:
                        '<iframe id="fancybox-frame{rnd}" name="fancybox-frame{rnd}" class="fancybox-iframe" frameborder="0" vspace="0" hspace="0" webkitAllowFullScreen mozallowfullscreen allowFullScreen' +
                        (s ? ' allowtransparency="true"' : "") +
                        "></iframe>",
                    error: '<p class="fancybox-error">The requested content cannot be loaded.<br/>Please try again later.</p>',
                    closeBtn: '<a title="Close" class="fancybox-item fancybox-close" href="javascript:;"></a>',
                    next: '<a title="Next" class="fancybox-nav fancybox-next" href="javascript:;"><span></span></a>',
                    prev: '<a title="Previous" class="fancybox-nav fancybox-prev" href="javascript:;"><span></span></a>',
                },
                openEffect: "fade",
                openSpeed: 250,
                openEasing: "swing",
                openOpacity: !0,
                openMethod: "zoomIn",
                closeEffect: "fade",
                closeSpeed: 250,
                closeEasing: "swing",
                closeOpacity: !0,
                closeMethod: "zoomOut",
                nextEffect: "elastic",
                nextSpeed: 250,
                nextEasing: "swing",
                nextMethod: "changeIn",
                prevEffect: "elastic",
                prevSpeed: 250,
                prevEasing: "swing",
                prevMethod: "changeOut",
                helpers: { overlay: !0, title: !0 },
                onCancel: n.noop,
                beforeLoad: n.noop,
                afterLoad: n.noop,
                beforeShow: n.noop,
                afterShow: n.noop,
                beforeChange: n.noop,
                beforeClose: n.noop,
                afterClose: n.noop,
            },
            group: {},
            opts: {},
            previous: null,
            coming: null,
            current: null,
            isActive: !1,
            isOpen: !1,
            isOpened: !1,
            wrap: null,
            skin: null,
            outer: null,
            inner: null,
            player: { timer: null, isActive: !1 },
            ajaxLoad: null,
            imgPreload: null,
            transitions: {},
            helpers: {},
            open: function (e, t) {
                if (e && (n.isPlainObject(t) || (t = {}), !1 !== a.close(!0)))
                    return (
                        n.isArray(e) || (e = u(e) ? n(e).get() : [e]),
                        n.each(e, function (i, r) {
                            var o,
                                s,
                                l,
                                c,
                                p,
                                f,
                                h,
                                g = {};
                            "object" === n.type(r) &&
                                (r.nodeType && (r = n(r)),
                                u(r) ? ((g = { href: r.data("fancybox-href") || r.attr("href"), title: r.data("fancybox-title") || r.attr("title"), isDom: !0, element: r }), n.metadata && n.extend(!0, g, r.metadata())) : (g = r)),
                                (o = t.href || g.href || (d(r) ? r : null)),
                                (s = void 0 !== t.title ? t.title : g.title || ""),
                                !(c = (l = t.content || g.content) ? "html" : t.type || g.type) && g.isDom && ((c = r.data("fancybox-type")) || (c = (p = r.prop("class").match(/fancybox\.(\w+)/)) ? p[1] : null)),
                                d(o) &&
                                    (c || (a.isImage(o) ? (c = "image") : a.isSWF(o) ? (c = "swf") : "#" === o.charAt(0) ? (c = "inline") : d(r) && ((c = "html"), (l = r))),
                                    "ajax" === c && ((f = o.split(/\s+/, 2)), (o = f.shift()), (h = f.shift()))),
                                l || ("inline" === c ? (o ? (l = n(d(o) ? o.replace(/.*(?=#[^\s]+$)/, "") : o)) : g.isDom && (l = r)) : "html" === c ? (l = o) : c || o || !g.isDom || ((c = "inline"), (l = r))),
                                n.extend(g, { href: o, type: c, content: l, title: s, selector: h }),
                                (e[i] = g);
                        }),
                        (a.opts = n.extend(!0, {}, a.defaults, t)),
                        void 0 !== t.keys && (a.opts.keys = !!t.keys && n.extend({}, a.defaults.keys, t.keys)),
                        (a.group = e),
                        a._start(a.opts.index)
                    );
            },
            cancel: function () {
                var e = a.coming;
                e &&
                    !1 !== a.trigger("onCancel") &&
                    (a.hideLoading(),
                    a.ajaxLoad && a.ajaxLoad.abort(),
                    (a.ajaxLoad = null),
                    a.imgPreload && (a.imgPreload.onload = a.imgPreload.onerror = null),
                    e.wrap && e.wrap.stop(!0, !0).trigger("onReset").remove(),
                    (a.coming = null),
                    a.current || a._afterZoomOut(e));
            },
            close: function (e) {
                a.cancel(),
                    !1 !== a.trigger("beforeClose") &&
                        (a.unbindEvents(),
                        a.isActive &&
                            (a.isOpen && !0 !== e
                                ? ((a.isOpen = a.isOpened = !1), (a.isClosing = !0), n(".fancybox-item, .fancybox-nav").remove(), a.wrap.stop(!0, !0).removeClass("fancybox-opened"), a.transitions[a.current.closeMethod]())
                                : (n(".fancybox-wrap").stop(!0).trigger("onReset").remove(), a._afterZoomOut())));
            },
            play: function (e) {
                var t = function () {
                        clearTimeout(a.player.timer);
                    },
                    i = function () {
                        t(), a.current && a.player.isActive && (a.player.timer = setTimeout(a.next, a.current.playSpeed));
                    },
                    r = function () {
                        t(), n("body").unbind(".player"), (a.player.isActive = !1), a.trigger("onPlayEnd");
                    };
                !0 === e || (!a.player.isActive && !1 !== e)
                    ? a.current &&
                      (a.current.loop || a.current.index < a.group.length - 1) &&
                      ((a.player.isActive = !0), n("body").bind({ "afterShow.player onUpdate.player": i, "onCancel.player beforeClose.player": r, "beforeLoad.player": t }), i(), a.trigger("onPlayStart"))
                    : r();
            },
            next: function (e) {
                var t = a.current;
                t && (d(e) || (e = t.direction.next), a.jumpto(t.index + 1, e, "next"));
            },
            prev: function (e) {
                var t = a.current;
                t && (d(e) || (e = t.direction.prev), a.jumpto(t.index - 1, e, "prev"));
            },
            jumpto: function (e, t, n) {
                var i = a.current;
                i &&
                    ((e = f(e)),
                    (a.direction = t || i.direction[e >= i.index ? "next" : "prev"]),
                    (a.router = n || "jumpto"),
                    i.loop && (e < 0 && (e = i.group.length + (e % i.group.length)), (e %= i.group.length)),
                    void 0 !== i.group[e] && (a.cancel(), a._start(e)));
            },
            reposition: function (e, t) {
                var i,
                    r = a.current,
                    o = r ? r.wrap : null;
                o && ((i = a._getPosition(t)), e && "scroll" === e.type ? (delete i.position, o.stop(!0, !0).animate(i, 200)) : (o.css(i), (r.pos = n.extend({}, r.dim, i))));
            },
            update: function (e) {
                var t = e && e.type,
                    n = !t || "orientationchange" === t;
                n && (clearTimeout(l), (l = null)),
                    a.isOpen &&
                        !l &&
                        (l = setTimeout(
                            function () {
                                var i = a.current;
                                i &&
                                    !a.isClosing &&
                                    (a.wrap.removeClass("fancybox-tmp"), (n || "load" === t || ("resize" === t && i.autoResize)) && a._setDimension(), ("scroll" === t && i.canShrink) || a.reposition(e), a.trigger("onUpdate"), (l = null));
                            },
                            n && !c ? 0 : 300
                        ));
            },
            toggle: function (e) {
                a.isOpen && ((a.current.fitToView = "boolean" === n.type(e) ? e : !a.current.fitToView), c && (a.wrap.removeAttr("style").addClass("fancybox-tmp"), a.trigger("onUpdate")), a.update());
            },
            hideLoading: function () {
                o.unbind(".loading"), n("#fancybox-loading").remove();
            },
            showLoading: function () {
                var e, t;
                a.hideLoading(),
                    (e = n('<div id="fancybox-loading"><div></div></div>').click(a.cancel).appendTo("body")),
                    o.bind("keydown.loading", function (e) {
                        27 === (e.which || e.keyCode) && (e.preventDefault(), a.cancel());
                    }),
                    a.defaults.fixed || ((t = a.getViewport()), e.css({ position: "absolute", top: 0.5 * t.h + t.y, left: 0.5 * t.w + t.x }));
            },
            getViewport: function () {
                var t = (a.current && a.current.locked) || !1,
                    n = { x: r.scrollLeft(), y: r.scrollTop() };
                return t ? ((n.w = t[0].clientWidth), (n.h = t[0].clientHeight)) : ((n.w = c && e.innerWidth ? e.innerWidth : r.width()), (n.h = c && e.innerHeight ? e.innerHeight : r.height())), n;
            },
            unbindEvents: function () {
                a.wrap && u(a.wrap) && a.wrap.unbind(".fb"), o.unbind(".fb"), r.unbind(".fb");
            },
            bindEvents: function () {
                var e,
                    t = a.current;
                t &&
                    (r.bind("orientationchange.fb" + (c ? "" : " resize.fb") + (t.autoCenter && !t.locked ? " scroll.fb" : ""), a.update),
                    (e = t.keys) &&
                        o.bind("keydown.fb", function (i) {
                            var r = i.which || i.keyCode,
                                o = i.target || i.srcElement;
                            if (27 === r && a.coming) return !1;
                            i.ctrlKey ||
                                i.altKey ||
                                i.shiftKey ||
                                i.metaKey ||
                                (o && (o.type || n(o).is("[contenteditable]"))) ||
                                n.each(e, function (e, o) {
                                    return t.group.length > 1 && void 0 !== o[r] ? (a[e](o[r]), i.preventDefault(), !1) : n.inArray(r, o) > -1 ? (a[e](), i.preventDefault(), !1) : void 0;
                                });
                        }),
                    n.fn.mousewheel &&
                        t.mouseWheel &&
                        a.wrap.bind("mousewheel.fb", function (e, i, r, o) {
                            for (var s, l = e.target || null, c = n(l), u = !1; c.length && !(u || c.is(".fancybox-skin") || c.is(".fancybox-wrap")); )
                                (u = (s = c[0]) && !(s.style.overflow && "hidden" === s.style.overflow) && ((s.clientWidth && s.scrollWidth > s.clientWidth) || (s.clientHeight && s.scrollHeight > s.clientHeight))), (c = n(c).parent());
                            0 === i || u || (a.group.length > 1 && !t.canShrink && (o > 0 || r > 0 ? a.prev(o > 0 ? "down" : "left") : (o < 0 || r < 0) && a.next(o < 0 ? "up" : "right"), e.preventDefault()));
                        }));
            },
            trigger: function (e, t) {
                var i,
                    r = t || a.coming || a.current;
                if (r) {
                    if ((n.isFunction(r[e]) && (i = r[e].apply(r, Array.prototype.slice.call(arguments, 1))), !1 === i)) return !1;
                    r.helpers &&
                        n.each(r.helpers, function (t, i) {
                            i && a.helpers[t] && n.isFunction(a.helpers[t][e]) && ((i = n.extend(!0, {}, a.helpers[t].defaults, i)), a.helpers[t][e](i, r));
                        }),
                        n.event.trigger(e + ".fb");
                }
            },
            isImage: function (e) {
                return d(e) && e.match(/(^data:image\/.*,)|(\.(jp(e|g|eg)|gif|png|bmp|webp)((\?|#).*)?$)/i);
            },
            isSWF: function (e) {
                return d(e) && e.match(/\.(swf)((\?|#).*)?$/i);
            },
            _start: function (e) {
                var t,
                    i,
                    r,
                    o,
                    s,
                    l = {};
                if (((e = f(e)), !(t = a.group[e] || null))) return !1;
                if (
                    ((o = (l = n.extend(!0, {}, a.opts, t)).margin),
                    (s = l.padding),
                    "number" === n.type(o) && (l.margin = [o, o, o, o]),
                    "number" === n.type(s) && (l.padding = [s, s, s, s]),
                    l.modal && n.extend(!0, l, { closeBtn: !1, closeClick: !1, nextClick: !1, arrows: !1, mouseWheel: !1, keys: null, helpers: { overlay: { closeClick: !1 } } }),
                    l.autoSize && (l.autoWidth = l.autoHeight = !0),
                    "auto" === l.width && (l.autoWidth = !0),
                    "auto" === l.height && (l.autoHeight = !0),
                    (l.group = a.group),
                    (l.index = e),
                    (a.coming = l),
                    !1 !== a.trigger("beforeLoad"))
                ) {
                    if (((r = l.type), (i = l.href), !r)) return (a.coming = null), !(!a.current || !a.router || "jumpto" === a.router) && ((a.current.index = e), a[a.router](a.direction));
                    if (
                        ((a.isActive = !0),
                        ("image" !== r && "swf" !== r) || ((l.autoHeight = l.autoWidth = !1), (l.scrolling = "visible")),
                        "image" === r && (l.aspectRatio = !0),
                        "iframe" === r && c && (l.scrolling = "scroll"),
                        (l.wrap = n(l.tpl.wrap)
                            .addClass("fancybox-" + (c ? "mobile" : "desktop") + " fancybox-type-" + r + " fancybox-tmp " + l.wrapCSS)
                            .appendTo(l.parent || "body")),
                        n.extend(l, { skin: n(".fancybox-skin", l.wrap), outer: n(".fancybox-outer", l.wrap), inner: n(".fancybox-inner", l.wrap) }),
                        n.each(["Top", "Right", "Bottom", "Left"], function (e, t) {
                            l.skin.css("padding" + t, h(l.padding[e]));
                        }),
                        a.trigger("onReady"),
                        "inline" === r || "html" === r)
                    ) {
                        if (!l.content || !l.content.length) return a._error("content");
                    } else if (!i) return a._error("href");
                    "image" === r ? a._loadImage() : "ajax" === r ? a._loadAjax() : "iframe" === r ? a._loadIframe() : a._afterLoad();
                } else a.coming = null;
            },
            _error: function (e) {
                n.extend(a.coming, { type: "html", autoWidth: !0, autoHeight: !0, minWidth: 0, minHeight: 0, scrolling: "no", hasError: e, content: a.coming.tpl.error }), a._afterLoad();
            },
            _loadImage: function () {
                var e = (a.imgPreload = new Image());
                (e.onload = function () {
                    (this.onload = this.onerror = null), (a.coming.width = this.width), (a.coming.height = this.height), a._afterLoad();
                }),
                    (e.onerror = function () {
                        (this.onload = this.onerror = null), a._error("image");
                    }),
                    (e.src = a.coming.href),
                    !0 !== e.complete && a.showLoading();
            },
            _loadAjax: function () {
                var e = a.coming;
                a.showLoading(),
                    (a.ajaxLoad = n.ajax(
                        n.extend({}, e.ajax, {
                            url: e.href,
                            error: function (e, t) {
                                a.coming && "abort" !== t ? a._error("ajax", e) : a.hideLoading();
                            },
                            success: function (t, n) {
                                "success" === n && ((e.content = t), a._afterLoad());
                            },
                        })
                    ));
            },
            _loadIframe: function () {
                var e = a.coming,
                    t = n(e.tpl.iframe.replace(/\{rnd\}/g, new Date().getTime()))
                        .attr("scrolling", c ? "auto" : e.iframe.scrolling)
                        .attr("src", e.href);
                n(e.wrap).bind("onReset", function () {
                    try {
                        n(this).find("iframe").hide().attr("src", "//about:blank").end().empty();
                    } catch (e) {}
                }),
                    e.iframe.preload &&
                        (a.showLoading(),
                        t.one("load", function () {
                            n(this).data("ready", 1), c || n(this).bind("load.fb", a.update), n(this).parents(".fancybox-wrap").width("100%").removeClass("fancybox-tmp").show(), a._afterLoad();
                        })),
                    (e.content = t.appendTo(e.inner)),
                    e.iframe.preload || a._afterLoad();
            },
            _preloadImages: function () {
                var e,
                    t,
                    n = a.group,
                    i = a.current,
                    r = n.length,
                    o = i.preload ? Math.min(i.preload, r - 1) : 0;
                for (t = 1; t <= o; t += 1) "image" === (e = n[(i.index + t) % r]).type && e.href && (new Image().src = e.href);
            },
            _afterLoad: function () {
                var e,
                    t,
                    i,
                    r,
                    o,
                    s,
                    l = a.coming,
                    c = a.current,
                    d = "fancybox-placeholder";
                if ((a.hideLoading(), l && !1 !== a.isActive)) {
                    if (!1 === a.trigger("afterLoad", l, c)) return l.wrap.stop(!0).trigger("onReset").remove(), void (a.coming = null);
                    switch (
                        (c && (a.trigger("beforeChange", c), c.wrap.stop(!0).removeClass("fancybox-opened").find(".fancybox-item, .fancybox-nav").remove()),
                        a.unbindEvents(),
                        (e = l),
                        (t = l.content),
                        (i = l.type),
                        (r = l.scrolling),
                        n.extend(a, { wrap: e.wrap, skin: e.skin, outer: e.outer, inner: e.inner, current: e, previous: c }),
                        (o = e.href),
                        i)
                    ) {
                        case "inline":
                        case "ajax":
                        case "html":
                            e.selector
                                ? (t = n("<div>").html(t).find(e.selector))
                                : u(t) &&
                                  (t.data(d) ||
                                      t.data(
                                          d,
                                          n('<div class="' + d + '"></div>')
                                              .insertAfter(t)
                                              .hide()
                                      ),
                                  (t = t.show().detach()),
                                  e.wrap.bind("onReset", function () {
                                      n(this).find(t).length && t.hide().replaceAll(t.data(d)).data(d, !1);
                                  }));
                            break;
                        case "image":
                            t = e.tpl.image.replace("{href}", o);
                            break;
                        case "swf":
                            (t = '<object id="fancybox-swf" classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" width="100%" height="100%"><param name="movie" value="' + o + '"></param>'),
                                (s = ""),
                                n.each(e.swf, function (e, n) {
                                    (t += '<param name="' + e + '" value="' + n + '"></param>'), (s += " " + e + '="' + n + '"');
                                }),
                                (t += '<embed src="' + o + '" type="application/x-shockwave-flash" width="100%" height="100%"' + s + "></embed></object>");
                    }
                    (u(t) && t.parent().is(e.inner)) || e.inner.append(t),
                        a.trigger("beforeShow"),
                        e.inner.css("overflow", "yes" === r ? "scroll" : "no" === r ? "hidden" : r),
                        a._setDimension(),
                        a.reposition(),
                        (a.isOpen = !1),
                        (a.coming = null),
                        a.bindEvents(),
                        a.isOpened ? c.prevMethod && a.transitions[c.prevMethod]() : n(".fancybox-wrap").not(e.wrap).stop(!0).trigger("onReset").remove(),
                        a.transitions[a.isOpened ? e.nextMethod : e.openMethod](),
                        a._preloadImages();
                }
            },
            _setDimension: function () {
                var e,
                    t,
                    i,
                    r,
                    o,
                    s,
                    l,
                    c,
                    u,
                    d,
                    g,
                    m,
                    y,
                    v,
                    b,
                    x,
                    w,
                    k = a.getViewport(),
                    C = 0,
                    T = a.wrap,
                    E = a.skin,
                    N = a.inner,
                    j = a.current,
                    S = j.width,
                    A = j.height,
                    L = j.minWidth,
                    H = j.minHeight,
                    D = j.maxWidth,
                    P = j.maxHeight,
                    M = j.scrolling,
                    O = j.scrollOutside ? j.scrollbarWidth : 0,
                    _ = j.margin,
                    q = f(_[1] + _[3]),
                    F = f(_[0] + _[2]);
                if (
                    (T.add(E).add(N).width("auto").height("auto").removeClass("fancybox-tmp"),
                    (o = q + (i = f(E.outerWidth(!0) - E.width()))),
                    (s = F + (r = f(E.outerHeight(!0) - E.height()))),
                    (l = p(S) ? ((k.w - o) * f(S)) / 100 : S),
                    (c = p(A) ? ((k.h - s) * f(A)) / 100 : A),
                    "iframe" === j.type)
                ) {
                    if (((x = j.content), j.autoHeight && 1 === x.data("ready")))
                        try {
                            x[0].contentWindow.document.location && (N.width(l).height(9999), (w = x.contents().find("body")), O && w.css("overflow-x", "hidden"), (c = w.height()));
                        } catch (e) {}
                } else (j.autoWidth || j.autoHeight) && (N.addClass("fancybox-tmp"), j.autoWidth || N.width(l), j.autoHeight || N.height(c), j.autoWidth && (l = N.width()), j.autoHeight && (c = N.height()), N.removeClass("fancybox-tmp"));
                if (
                    ((S = f(l)),
                    (A = f(c)),
                    (g = l / c),
                    (L = f(p(L) ? f(L, "w") - o : L)),
                    (D = f(p(D) ? f(D, "w") - o : D)),
                    (H = f(p(H) ? f(H, "h") - s : H)),
                    (u = D),
                    (d = P = f(p(P) ? f(P, "h") - s : P)),
                    j.fitToView && ((D = Math.min(k.w - o, D)), (P = Math.min(k.h - s, P))),
                    (v = k.w - q),
                    (b = k.h - F),
                    j.aspectRatio
                        ? (S > D && (A = f((S = D) / g)), A > P && (S = f((A = P) * g)), S < L && (A = f((S = L) / g)), A < H && (S = f((A = H) * g)))
                        : ((S = Math.max(L, Math.min(S, D))), j.autoHeight && "iframe" !== j.type && (N.width(S), (A = N.height())), (A = Math.max(H, Math.min(A, P)))),
                    j.fitToView)
                )
                    if ((N.width(S).height(A), T.width(S + i), (m = T.width()), (y = T.height()), j.aspectRatio))
                        for (; (m > v || y > b) && S > L && A > H && !(C++ > 19); )
                            (A = Math.max(H, Math.min(P, A - 10))), (S = f(A * g)) < L && (A = f((S = L) / g)), S > D && (A = f((S = D) / g)), N.width(S).height(A), T.width(S + i), (m = T.width()), (y = T.height());
                    else (S = Math.max(L, Math.min(S, S - (m - v)))), (A = Math.max(H, Math.min(A, A - (y - b))));
                O && "auto" === M && A < c && S + i + O < v && (S += O),
                    N.width(S).height(A),
                    T.width(S + i),
                    (m = T.width()),
                    (y = T.height()),
                    (e = (m > v || y > b) && S > L && A > H),
                    (t = j.aspectRatio ? S < u && A < d && S < l && A < c : (S < u || A < d) && (S < l || A < c)),
                    n.extend(j, { dim: { width: h(m), height: h(y) }, origWidth: l, origHeight: c, canShrink: e, canExpand: t, wPadding: i, hPadding: r, wrapSpace: y - E.outerHeight(!0), skinSpace: E.height() - A }),
                    !x && j.autoHeight && A > H && A < P && !t && N.height("auto");
            },
            _getPosition: function (e) {
                var t = a.current,
                    n = a.getViewport(),
                    i = t.margin,
                    r = a.wrap.width() + i[1] + i[3],
                    o = a.wrap.height() + i[0] + i[2],
                    s = { position: "absolute", top: i[0], left: i[3] };
                return (
                    t.autoCenter && t.fixed && !e && o <= n.h && r <= n.w ? (s.position = "fixed") : t.locked || ((s.top += n.y), (s.left += n.x)),
                    (s.top = h(Math.max(s.top, s.top + (n.h - o) * t.topRatio))),
                    (s.left = h(Math.max(s.left, s.left + (n.w - r) * t.leftRatio))),
                    s
                );
            },
            _afterZoomIn: function () {
                var e = a.current;
                e &&
                    ((a.isOpen = a.isOpened = !0),
                    a.wrap.css("overflow", "visible").addClass("fancybox-opened"),
                    a.update(),
                    (e.closeClick || (e.nextClick && a.group.length > 1)) &&
                        a.inner.css("cursor", "pointer").bind("click.fb", function (t) {
                            n(t.target).is("a") || n(t.target).parent().is("a") || (t.preventDefault(), a[e.closeClick ? "close" : "next"]());
                        }),
                    e.closeBtn &&
                        n(e.tpl.closeBtn)
                            .appendTo(a.skin)
                            .bind("click.fb", function (e) {
                                e.preventDefault(), a.close();
                            }),
                    e.arrows &&
                        a.group.length > 1 &&
                        ((e.loop || e.index > 0) && n(e.tpl.prev).appendTo(a.outer).bind("click.fb", a.prev), (e.loop || e.index < a.group.length - 1) && n(e.tpl.next).appendTo(a.outer).bind("click.fb", a.next)),
                    a.trigger("afterShow"),
                    e.loop || e.index !== e.group.length - 1 ? a.opts.autoPlay && !a.player.isActive && ((a.opts.autoPlay = !1), a.play()) : a.play(!1));
            },
            _afterZoomOut: function (e) {
                (e = e || a.current),
                    n(".fancybox-wrap").trigger("onReset").remove(),
                    n.extend(a, { group: {}, opts: {}, router: !1, current: null, isActive: !1, isOpened: !1, isOpen: !1, isClosing: !1, wrap: null, skin: null, outer: null, inner: null }),
                    a.trigger("afterClose", e);
            },
        }),
            (a.transitions = {
                getOrigPosition: function () {
                    var e = a.current,
                        t = e.element,
                        n = e.orig,
                        i = {},
                        r = 50,
                        o = 50,
                        s = e.hPadding,
                        l = e.wPadding,
                        c = a.getViewport();
                    return (
                        !n && e.isDom && t.is(":visible") && ((n = t.find("img:first")).length || (n = t)),
                        u(n) ? ((i = n.offset()), n.is("img") && ((r = n.outerWidth()), (o = n.outerHeight()))) : ((i.top = c.y + (c.h - o) * e.topRatio), (i.left = c.x + (c.w - r) * e.leftRatio)),
                        ("fixed" === a.wrap.css("position") || e.locked) && ((i.top -= c.y), (i.left -= c.x)),
                        (i = { top: h(i.top - s * e.topRatio), left: h(i.left - l * e.leftRatio), width: h(r + l), height: h(o + s) })
                    );
                },
                step: function (e, t) {
                    var n,
                        i,
                        r = t.prop,
                        o = a.current,
                        s = o.wrapSpace,
                        l = o.skinSpace;
                    ("width" !== r && "height" !== r) ||
                        ((n = t.end === t.start ? 1 : (e - t.start) / (t.end - t.start)),
                        a.isClosing && (n = 1 - n),
                        (i = e - ("width" === r ? o.wPadding : o.hPadding)),
                        a.skin[r](f("width" === r ? i : i - s * n)),
                        a.inner[r](f("width" === r ? i : i - s * n - l * n)));
                },
                zoomIn: function () {
                    var e = a.current,
                        t = e.pos,
                        i = e.openEffect,
                        r = "elastic" === i,
                        o = n.extend({ opacity: 1 }, t);
                    delete o.position,
                        r ? ((t = this.getOrigPosition()), e.openOpacity && (t.opacity = 0.1)) : "fade" === i && (t.opacity = 0.1),
                        a.wrap.css(t).animate(o, { duration: "none" === i ? 0 : e.openSpeed, easing: e.openEasing, step: r ? this.step : null, complete: a._afterZoomIn });
                },
                zoomOut: function () {
                    var e = a.current,
                        t = e.closeEffect,
                        n = "elastic" === t,
                        i = { opacity: 0.1 };
                    n && ((i = this.getOrigPosition()), e.closeOpacity && (i.opacity = 0.1)), a.wrap.animate(i, { duration: "none" === t ? 0 : e.closeSpeed, easing: e.closeEasing, step: n ? this.step : null, complete: a._afterZoomOut });
                },
                changeIn: function () {
                    var e,
                        t = a.current,
                        n = t.nextEffect,
                        i = t.pos,
                        r = { opacity: 1 },
                        o = a.direction;
                    (i.opacity = 0.1),
                        "elastic" === n && ((e = "down" === o || "up" === o ? "top" : "left"), "down" === o || "right" === o ? ((i[e] = h(f(i[e]) - 200)), (r[e] = "+=200px")) : ((i[e] = h(f(i[e]) + 200)), (r[e] = "-=200px"))),
                        "none" === n ? a._afterZoomIn() : a.wrap.css(i).animate(r, { duration: t.nextSpeed, easing: t.nextEasing, complete: a._afterZoomIn });
                },
                changeOut: function () {
                    var e = a.previous,
                        t = e.prevEffect,
                        i = { opacity: 0.1 },
                        r = a.direction;
                    "elastic" === t && (i["down" === r || "up" === r ? "top" : "left"] = ("up" === r || "left" === r ? "-" : "+") + "=200px"),
                        e.wrap.animate(i, {
                            duration: "none" === t ? 0 : e.prevSpeed,
                            easing: e.prevEasing,
                            complete: function () {
                                n(this).trigger("onReset").remove();
                            },
                        });
                },
            }),
            (a.helpers.overlay = {
                defaults: { closeClick: !0, speedOut: 200, showEarly: !0, css: {}, locked: !c, fixed: !0 },
                overlay: null,
                fixed: !1,
                create: function (e) {
                    (e = n.extend({}, this.defaults, e)),
                        this.overlay && this.close(),
                        (this.overlay = n('<div class="fancybox-overlay"></div>').appendTo("body")),
                        (this.fixed = !1),
                        e.fixed && a.defaults.fixed && (this.overlay.addClass("fancybox-overlay-fixed"), (this.fixed = !0));
                },
                open: function (e) {
                    var t = this;
                    (e = n.extend({}, this.defaults, e)),
                        this.overlay ? this.overlay.unbind(".overlay").width("auto").height("auto") : this.create(e),
                        this.fixed || (r.bind("resize.overlay", n.proxy(this.update, this)), this.update()),
                        e.closeClick &&
                            this.overlay.bind("click.overlay", function (e) {
                                n(e.target).hasClass("fancybox-overlay") && (a.isActive ? a.close() : t.close());
                            }),
                        this.overlay.css(e.css).show();
                },
                close: function () {
                    n(".fancybox-overlay").remove(), r.unbind("resize.overlay"), (this.overlay = null), !1 !== this.margin && (n("body").css("margin-right", this.margin), (this.margin = !1)), this.el && this.el.removeClass("fancybox-lock");
                },
                update: function () {
                    var e,
                        n = "100%";
                    this.overlay.width(n).height("100%"),
                        s ? ((e = Math.max(t.documentElement.offsetWidth, t.body.offsetWidth)), o.width() > e && (n = o.width())) : o.width() > r.width() && (n = o.width()),
                        this.overlay.width(n).height(o.height());
                },
                onReady: function (e, i) {
                    n(".fancybox-overlay").stop(!0, !0),
                        this.overlay || ((this.margin = (o.height() > r.height() || "scroll" === n("body").css("overflow-y")) && n("body").css("margin-right")), (this.el = t.all && !t.querySelector ? n("html") : n("body")), this.create(e)),
                        e.locked && this.fixed && ((i.locked = this.overlay.append(i.wrap)), (i.fixed = !1)),
                        !0 === e.showEarly && this.beforeShow.apply(this, arguments);
                },
                beforeShow: function (e, t) {
                    t.locked && (this.el.addClass("fancybox-lock"), !1 !== this.margin && n("body").css("margin-right", f(this.margin) + t.scrollbarWidth)), this.open(e);
                },
                onUpdate: function () {
                    this.fixed || this.update();
                },
                afterClose: function (e) {
                    this.overlay && !a.isActive && this.overlay.fadeOut(e.speedOut, n.proxy(this.close, this));
                },
            }),
            (a.helpers.title = {
                defaults: { type: "float", position: "bottom" },
                beforeShow: function (e) {
                    var t,
                        i,
                        r = a.current,
                        o = r.title,
                        l = e.type;
                    if ((n.isFunction(o) && (o = o.call(r.element, r)), d(o) && "" !== n.trim(o))) {
                        switch (((t = n('<div class="fancybox-title fancybox-title-' + l + '-wrap">' + o + "</div>")), l)) {
                            case "inside":
                                i = a.skin;
                                break;
                            case "outside":
                                i = a.wrap;
                                break;
                            case "over":
                                i = a.inner;
                                break;
                            default:
                                (i = a.skin), t.appendTo("body"), s && t.width(t.width()), t.wrapInner('<span class="child"></span>'), (a.current.margin[2] += Math.abs(f(t.css("margin-bottom"))));
                        }
                        t["top" === e.position ? "prependTo" : "appendTo"](i);
                    }
                },
            }),
            (n.fn.fancybox = function (e) {
                var t,
                    i = n(this),
                    r = this.selector || "",
                    s = function (o) {
                        var s,
                            l,
                            c = n(this).blur(),
                            u = t;
                        o.ctrlKey ||
                            o.altKey ||
                            o.shiftKey ||
                            o.metaKey ||
                            c.is(".fancybox-wrap") ||
                            ((s = e.groupAttr || "data-fancybox-group"),
                            (l = c.attr(s)) || ((s = "rel"), (l = c.get(0)[s])),
                            l && "" !== l && "nofollow" !== l && (u = (c = (c = r.length ? n(r) : i).filter("[" + s + '="' + l + '"]')).index(this)),
                            (e.index = u),
                            !1 !== a.open(c, e) && o.preventDefault());
                    };
                return (
                    (t = (e = e || {}).index || 0),
                    r && !1 !== e.live ? o.undelegate(r, "click.fb-start").delegate(r + ":not('.fancybox-item, .fancybox-nav')", "click.fb-start", s) : i.unbind("click.fb-start").bind("click.fb-start", s),
                    this.filter("[data-fancybox-start=1]").trigger("click"),
                    this
                );
            }),
            o.ready(function () {
                var e, t;
                void 0 === n.scrollbarWidth &&
                    (n.scrollbarWidth = function () {
                        var e = n('<div style="width:50px;height:50px;overflow:auto"><div/></div>').appendTo("body"),
                            t = e.children(),
                            i = t.innerWidth() - t.height(99).innerWidth();
                        return e.remove(), i;
                    }),
                    void 0 === n.support.fixedPosition && (n.support.fixedPosition = ((e = n('<div style="position:fixed;top:20px;"></div>').appendTo("body")), (t = 20 === e[0].offsetTop || 15 === e[0].offsetTop), e.remove(), t)),
                    n.extend(a.defaults, { scrollbarWidth: n.scrollbarWidth(), fixed: n.support.fixedPosition, parent: n("body") });
            });
    })(window, document, jQuery) /*! device.js 0.2.7 */,
    function () {
        var e, t, n, i, r, o, a, s, l, c;
        (t = window.device),
            (e = {}),
            (window.device = e),
            (i = window.document.documentElement),
            (c = window.navigator.userAgent.toLowerCase()),
            (e.ios = function () {
                return e.iphone() || e.ipod() || e.ipad();
            }),
            (e.iphone = function () {
                return !e.windows() && r("iphone");
            }),
            (e.ipod = function () {
                return r("ipod");
            }),
            (e.ipad = function () {
                return r("ipad");
            }),
            (e.android = function () {
                return !e.windows() && r("android");
            }),
            (e.androidPhone = function () {
                return e.android() && r("mobile");
            }),
            (e.androidTablet = function () {
                return e.android() && !r("mobile");
            }),
            (e.blackberry = function () {
                return r("blackberry") || r("bb10") || r("rim");
            }),
            (e.blackberryPhone = function () {
                return e.blackberry() && !r("tablet");
            }),
            (e.blackberryTablet = function () {
                return e.blackberry() && r("tablet");
            }),
            (e.windows = function () {
                return r("windows");
            }),
            (e.windowsPhone = function () {
                return e.windows() && r("phone");
            }),
            (e.windowsTablet = function () {
                return e.windows() && r("touch") && !e.windowsPhone();
            }),
            (e.fxos = function () {
                return (r("(mobile;") || r("(tablet;")) && r("; rv:");
            }),
            (e.fxosPhone = function () {
                return e.fxos() && r("mobile");
            }),
            (e.fxosTablet = function () {
                return e.fxos() && r("tablet");
            }),
            (e.meego = function () {
                return r("meego");
            }),
            (e.cordova = function () {
                return window.cordova && "file:" === location.protocol;
            }),
            (e.nodeWebkit = function () {
                return "object" == typeof window.process;
            }),
            (e.mobile = function () {
                return e.androidPhone() || e.iphone() || e.ipod() || e.windowsPhone() || e.blackberryPhone() || e.fxosPhone() || e.meego();
            }),
            (e.tablet = function () {
                return e.ipad() || e.androidTablet() || e.blackberryTablet() || e.windowsTablet() || e.fxosTablet();
            }),
            (e.desktop = function () {
                return !e.tablet() && !e.mobile();
            }),
            (e.television = function () {
                var e;
                for (television = ["googletv", "viera", "smarttv", "internet.tv", "netcast", "nettv", "appletv", "boxee", "kylo", "roku", "dlnadoc", "roku", "pov_tv", "hbbtv", "ce-html"], e = 0; e < television.length; ) {
                    if (r(television[e])) return !0;
                    e++;
                }
                return !1;
            }),
            (e.portrait = function () {
                return window.innerHeight / window.innerWidth > 1;
            }),
            (e.landscape = function () {
                return window.innerHeight / window.innerWidth < 1;
            }),
            (e.noConflict = function () {
                return (window.device = t), this;
            }),
            (r = function (e) {
                return -1 !== c.indexOf(e);
            }),
            (a = function (e) {
                var t;
                return (t = new RegExp(e, "i")), i.className.match(t);
            }),
            (n = function (e) {
                var t = null;
                a(e) || ((t = i.className.replace(/^\s+|\s+$/g, "")), (i.className = t + " " + e));
            }),
            (l = function (e) {
                a(e) && (i.className = i.className.replace(" " + e, ""));
            }),
            e.ios()
                ? e.ipad()
                    ? n("ios ipad tablet")
                    : e.iphone()
                    ? n("ios iphone mobile")
                    : e.ipod() && n("ios ipod mobile")
                : e.android()
                ? n(e.androidTablet() ? "android tablet" : "android mobile")
                : e.blackberry()
                ? n(e.blackberryTablet() ? "blackberry tablet" : "blackberry mobile")
                : e.windows()
                ? n(e.windowsTablet() ? "windows tablet" : e.windowsPhone() ? "windows mobile" : "desktop")
                : e.fxos()
                ? n(e.fxosTablet() ? "fxos tablet" : "fxos mobile")
                : e.meego()
                ? n("meego mobile")
                : e.nodeWebkit()
                ? n("node-webkit")
                : e.television()
                ? n("television")
                : e.desktop() && n("desktop"),
            e.cordova() && n("cordova"),
            (o = function () {
                e.landscape() ? (l("portrait"), n("landscape")) : (l("landscape"), n("portrait"));
            }),
            (s = Object.prototype.hasOwnProperty.call(window, "onorientationchange") ? "orientationchange" : "resize"),
            window.addEventListener ? window.addEventListener(s, o, !1) : window.attachEvent ? window.attachEvent(s, o) : (window[s] = o),
            o(),
            "function" == typeof define && "object" == typeof define.amd && define.amd
                ? define(function () {
                      return e;
                  })
                : "undefined" != typeof module && module.exports
                ? (module.exports = e)
                : (window.device = e);
    }.call(this),
    jQuery(document).ready(function (e) {
        audiojs.events.ready(function () {
            audiojs.createAll();
        }),
            e.cookie("dictionary"),
            "miks" == e.cookie("dictionary")
                ? (e("#miks").attr("selected", "selected"), e("#miks").prop("selected", "selected"), e("select[name=language]").val("miks").change())
                : "engl" == e.cookie("dictionary")
                ? (e("#engl").attr("selected", "selected"), e("#engl").prop("selected", "selected"), e("select[name=language]").val("engl").change())
                : "leit" == e.cookie("dictionary")
                ? (e("#leit").attr("selected", "selected"), e("#leit").prop("selected", "selected"), e("select[name=language]").val("leit").change())
                : "latt" == e.cookie("dictionary")
                ? (e("#latt").attr("selected", "selected"), e("#latt").prop("selected", "selected"), e("select[name=language]").val("latt").change())
                : "pols" == e.cookie("dictionary")
                ? (e("#pols").attr("selected", "selected"), e("#pols").prop("selected", "selected"), e("select[name=language]").val("pols").change())
                : "mask" == e.cookie("dictionary") && (e("#mask").attr("selected", "selected"), e("#mask").prop("selected", "selected"), e("select[name=language]").val("mask").change());
        var t = e("#q").val(),
            n = e("input[name=language]").val(),
            i = e("#select-dialect").val();
        function r() {
            var t = window.location.hash.replace("#", ""),
                n = decodeURIComponent(t);
            if (e("#semba").is(":selected")) var i = "semba";
            else if (e("#pameddi").is(":selected")) i = "pameddi";
            if (e("#miks").is(":selected")) var r = "miks";
            else if (e("#leit").is(":selected")) r = "leit";
            else if (e("#latt").is(":selected")) r = "latt";
            else if (e("#pols").is(":selected")) r = "pols";
            else if (e("#mask").is(":selected")) r = "mask";
            else if (e("#engl").is(":selected")) r = "engl";
            e.cookie("dictionary", r, { expires: 360, path: "/" }),
                e("form#search-form").submit(function () {
                    return !1;
                }),
                e.ajax({
                    type: "GET",
                    data: { s: t, language: r, dia: i },
                    url: "search/",
                    success: function (t) {
                        e("#results").html(t).fadeIn(),
                            e("#suggest-wrap").fadeOut(),
                            audiojs.events.ready(function () {
                                audiojs.createAll();
                            });
                    },
                }),
                e("#q").val(n);
        }
        function o() {
            var t = e("#q").val();
            ga("send", "event", "Form", "Sumbit", t);
            var n = "" + encodeURI(document.getElementById("q").value.trim()).replace("%20", "+");
            if (((window.location.hash = n), e("#semba").is(":selected"))) var i = "semba";
            else if (e("#pameddi").is(":selected")) i = "pameddi";
            if (e("#miks").is(":selected")) var r = "miks";
            else if (e("#leit").is(":selected")) r = "leit";
            else if (e("#latt").is(":selected")) r = "latt";
            else if (e("#pols").is(":selected")) r = "pols";
            else if (e("#mask").is(":selected")) r = "mask";
            else if (e("#engl").is(":selected")) r = "engl";
            e.cookie("dictionary", r, { expires: 360, path: "/" }),
                e.ajax({
                    type: "GET",
                    data: { s: t, language: r, dia: i },
                    url: "search/",
                    success: function (t) {
                        e("#results").html(t).fadeIn(),
                            e("#suggest-wrap").fadeOut(),
                            audiojs.events.ready(function () {
                                audiojs.createAll();
                            });
                    },
                });
        }
        e(".help-icon").on("click", function () {
            ga("send", "event", "button", "click", "Help");
        }),
            e("select[name=language]").change(function () {
                ga("send", "event", "language", "selection", n);
            }),
            e("#select-dialect").change(function () {
                ga("send", "event", "dialect", "selection", i);
            }),
            e(window).on("hashchange", function () {
                ga("send", "event", "dialect", "search", i), ga("send", "event", "language", "search", n), ga("send", "pageview", "/" + window.location.hash), ga("send", "event", "Form", "Sumbit", t);
            }),
            jQuery.ajaxSetup({
                beforeSend: function () {
                    e("#loadingDiv").show();
                },
                complete: function () {
                    e("#loadingDiv").hide();
                },
                success: function () {},
            }),
            e("#q").keyup(function (t) {
                t.preventDefault();
                var n = e("#q").val();
                if (0 == n.length)
                    e("#suggest-wrap").fadeOut(),
                        audiojs.events.ready(function () {
                            audiojs.createAll();
                        });
                else if (13 === t.which) {
                    if (e("#suggest-wrap a").hasClass("selected")) {
                        var i = e(".selected").text();
                        e("#q").val(i);
                        var r = "" + encodeURI(document.getElementById("q").value.trim()).replace("%20", "+");
                        (window.location.hash = r), e("#suggest-wrap").fadeOut();
                    }
                    e("#suggest-wrap").fadeOut(),
                        audiojs.events.ready(function () {
                            audiojs.createAll();
                        });
                } else if (27 === t.which)
                    e("#suggest-wrap").fadeOut("slow"),
                        audiojs.events.ready(function () {
                            audiojs.createAll();
                        });
                else if (40 === t.which)
                    e("#q").addClass("focusout").removeClass("focusin"),
                        e("#suggest-wrap a").hasClass("selected") ? e(".selected").next().addClass("selected").prev().removeClass("selected") : e("#suggest-wrap a").first().select().addClass("selected"),
                        audiojs.events.ready(function () {
                            audiojs.createAll();
                        });
                else if (38 === t.which)
                    e("#q").addClass("focusout").removeClass("focusin"),
                        e("#suggest-wrap a").hasClass("selected") ? e(".selected").prev().addClass("selected").next().removeClass("selected") : e("#suggest-wrap a").last().select().addClass("selected"),
                        audiojs.events.ready(function () {
                            audiojs.createAll();
                        });
                else {
                    if (e("#semba").is(":selected")) var o = "semba";
                    else if (e("#pameddi").is(":selected")) o = "pameddi";
                    if (e("#miks").is(":selected")) var a = "miks";
                    else if (e("#leit").is(":selected")) a = "leit";
                    else if (e("#latt").is(":selected")) a = "latt";
                    else if (e("#pols").is(":selected")) a = "pols";
                    else if (e("#mask").is(":selected")) a = "mask";
                    else if (e("#engl").is(":selected")) a = "engl";
                    e.cookie("dictionary", a, { expires: 360, path: "/" }),
                        e.ajax({
                            type: "GET",
                            data: { s: n, language: a, dia: o },
                            url: "auto/",
                            success: function (t) {
                                e("#suggest-wrap").html(t).fadeIn().css("display", "block"),
                                    audiojs.events.ready(function () {
                                        audiojs.createAll();
                                    });
                            },
                        });
                }
            }),
            e("#suggest-wrap").on("click", "a", function () {
                var t = decodeURIComponent(e(this).attr("href").replace("#", ""));
                if (e("#semba").is(":selected")) var n = "semba";
                else if (e("#pameddi").is(":selected")) n = "pameddi";
                if (e("#miks").is(":selected")) var i = "miks";
                else if (e("#leit").is(":selected")) i = "leit";
                else if (e("#latt").is(":selected")) i = "latt";
                else if (e("#pols").is(":selected")) i = "pols";
                else if (e("#mask").is(":selected")) i = "mask";
                else if (e("#engl").is(":selected")) i = "engl";
                e.cookie("dictionary", i, { expires: 360, path: "/" }),
                    e.ajax({
                        type: "GET",
                        data: { s: t, language: i, dia: n },
                        url: "search/",
                        success: function (t) {
                            e("#results").html(t).fadeIn(),
                                e("#suggest-wrap").fadeOut(),
                                audiojs.events.ready(function () {
                                    audiojs.createAll();
                                });
                        },
                    }),
                    e("#q").val(t),
                    ga("send", "event", "Form", "Sumbit", t);
            }),
            e(document).mouseup(function (t) {
                var n = e("#suggest-wrap");
                0 === n.has(t.target).length && n.hide();
            }),
            e(".help-icon").on("click", function () {
                e("#overlay").addClass("open"), ga("send", "event", "button", "click", "Help");
            }),
            e(".overlay-close").on("click", function () {
                e("#overlay").removeClass("open");
            }),
            e("#overlay").on("click", "a", function () {
                e("#overlay").removeClass("open");
                var t = decodeURIComponent(e(this).attr("href").replace("#", ""));
                if (e("#semba").is(":selected")) var n = "semba";
                else if (e("#pameddi").is(":selected")) n = "pameddi";
                if (e("#miks").is(":selected")) var i = "miks";
                else if (e("#leit").is(":selected")) i = "leit";
                else if (e("#latt").is(":selected")) i = "latt";
                else if (e("#pols").is(":selected")) i = "pols";
                else if (e("#mask").is(":selected")) i = "mask";
                else if (e("#engl").is(":selected")) i = "engl";
                e.cookie("dictionary", i, { expires: 360, path: "/" }),
                    e.ajax({
                        type: "GET",
                        data: { s: t, language: i, dia: n },
                        url: "search/",
                        success: function (t) {
                            e("#results").html(t).fadeIn(),
                                e("#suggest-wrap").fadeOut(),
                                audiojs.events.ready(function () {
                                    audiojs.createAll();
                                });
                        },
                    }),
                    e("#q").val(t),
                    ga("send", "event", "Form", "Sumbit", t);
            }),
            e("select[name=language]").change(function () {
                var t = e(this).find("option:selected").val();
                e.cookie("dictionary", t, { expires: 360, path: "/" }), o();
            }),
            e("#select-dialect").change(function () {
                e("#select-dialect option[value='semba']").attr("selected") ? o() : e("#select-dialect option[value='pameddi']").attr("selected") && o();
            }),
            e(window).hashchange(function () {
                e("#q").hasClass("focusin") &&
                    e("form#search-form").submit(function () {
                        return !1;
                    }),
                    e("#q").hasClass("focusout") && r();
            }),
            e("form#search-form").submit(function (t) {
                t.preventDefault();
                var n = "" + encodeURI(document.getElementById("q").value.trim()).replace("%20", "+");
                (window.location.hash = n),
                    e("#results").fadeOut(),
                    e.ajax({
                        type: "GET",
                        data: e(this).serialize(),
                        url: "search/",
                        success: function (t) {
                            e("#results").html(t).fadeIn(),
                                e("#suggest-wrap").fadeOut(),
                                audiojs.events.ready(function () {
                                    audiojs.createAll();
                                });
                        },
                    }),
                    audiojs.events.ready(function () {
                        audiojs.createAll();
                    });
            }),
            "" != e("#q").val() && o(),
            "" != window.location.hash && r(),
            e("form#search-form")
                .focusout(function () {
                    e("#q").addClass("focusout").removeClass("focusin");
                })
                .focusin(function () {
                    e("#q").addClass("focusin").removeClass("focusout");
                }),
            e("#results").on("click", ".spoiler-title2", function () {
                var t = e(this);
                e(this).hasClass("closed") ? t.toggleClass("opened").toggleClass("closed").next().fadeIn("slow") : t.toggleClass("opened").toggleClass("closed").next().fadeOut("slow");
            }),
            e("#results").on("click", ".more", function () {
                var t = e(this),
                    n = e(this).next(),
                    i = t.parent().find(".word").text(),
                    r = t.parent().find(".numb").text(),
                    o = t.parent().find(".desc").text();
                ga("send", "event", "button", "ShowMore", i),
                    n.hasClass("con-opened")
                        ? t.toggleClass("opened").toggleClass("closed").next().slideToggle()
                        : n.hasClass("con-closed")
                        ? t.toggleClass("opened").toggleClass("closed").next().slideToggle()
                        : e.ajax({
                              type: "POST",
                              data: "word=" + i + "&numb=" + r + "&desc=" + o,
                              // cache: !1,
                              url: "more/",
                              success: function (n) {
                                  t.parent().find(".spoiler-body").addClass("con-opened"), t.parent().find(".spoiler-body").hide().html(n).slideDown("slow"), e(".spoiler-body2").hide();
                              },
                          }),
                    e(this).hasClass("closed")
                        ? "de" == e.cookie("lang")
                            ? e(this).html("<small>&#9658;</small> Klappen Form aus")
                            : "en" == e.cookie("lang")
                            ? e(this).html("<small>&#9658;</small> Show form")
                            : "lt" == e.cookie("lang")
                            ? e(this).html("<small>&#9658;</small> Rodyti formą")
                            : "lv" == e.cookie("lang")
                            ? e(this).html("<small>&#9658;</small> Rādīt formu")
                            : "pr" == e.cookie("lang")
                            ? e(this).html("<small>&#9658;</small> Enwaidīntun fōrman")
                            : "pl" == e.cookie("lang")
                            ? e(this).html("<small>&#9658;</small> Pokazać formę")
                            : "ru" == e.cookie("lang") && e(this).html("<small>&#9658;</small> Показать форму")
                        : "de" == e.cookie("lang")
                        ? e(this).html("<small>&#9660;</small> Klappen Form ein")
                        : "en" == e.cookie("lang")
                        ? e(this).html("<small>&#9660;</small> Hide form")
                        : "lt" == e.cookie("lang")
                        ? e(this).html("<small>&#9660;</small> Slepti formą")
                        : "lv" == e.cookie("lang")
                        ? e(this).html("<small>&#9660;</small> Slēpt formu")
                        : "pr" == e.cookie("lang")
                        ? e(this).html("<small>&#9660;</small> Aukliptun fōrman")
                        : "pl" == e.cookie("lang")
                        ? e(this).html("<small>&#9660;</small> Schować formę")
                        : "ru" == e.cookie("lang") && e(this).html("<small>&#9660;</small> Скрыть форму");
            }),
            1 === e(".descripcio").length && e(".descripcio").hide(),
            e("#results").on("click", ".spoiler-descripcio", function () {
                var t = e(this).parent().find(".word").text();
                ga("send", "event", "button", "Description", t),
                    e(this).toggleClass("opened").next().slideToggle(),
                    e(this).hasClass("opened")
                        ? "de" == e.cookie("lang")
                            ? e(this).html("<small>&#9660;</small> Klappen Beschreibung ein")
                            : "en" == e.cookie("lang")
                            ? e(this).html("<small>&#9660;</small> Hide description")
                            : "lt" == e.cookie("lang")
                            ? e(this).html("<small>&#9660;</small> Slepti aprašymą")
                            : "lv" == e.cookie("lang")
                            ? e(this).html("<small>&#9660;</small> Slēpt aprakstu")
                            : "pr" == e.cookie("lang")
                            ? e(this).html("<small>&#9660;</small> Aukliptun ebpeisāsenjan")
                            : "pl" == e.cookie("lang")
                            ? e(this).html("<small>&#9660;</small> Schować opisą")
                            : "ru" == e.cookie("lang") && e(this).html("<small>&#9660;</small> Скрыть описание")
                        : "de" == e.cookie("lang")
                        ? e(this).html("<small>&#9658;</small> Klappen Beschreibung aus")
                        : "en" == e.cookie("lang")
                        ? e(this).html("<small>&#9658;</small> Show description")
                        : "lt" == e.cookie("lang")
                        ? e(this).html("<small>&#9658;</small> Rodyti aprašymą")
                        : "lv" == e.cookie("lang")
                        ? e(this).html("<small>&#9658;</small> Rādīt aprakstu")
                        : "pr" == e.cookie("lang")
                        ? e(this).html("<small>&#9658;</small> Enwaidīntun ebpeisāsenjan")
                        : "pl" == e.cookie("lang")
                        ? e(this).html("<small>&#9658;</small> Pokazać opisą")
                        : "ru" == e.cookie("lang") && e(this).html("<small>&#9658;</small> Показать описание");
            }),
            e("#results").on("click", ".spoiler-etymologia", function () {
                e(this).toggleClass("opened").next().slideToggle(),
                    e(this).hasClass("opened")
                        ? "de" == e.cookie("lang")
                            ? e(this).html("<small>&#9660;</small> Klappen Etymologie ein")
                            : "en" == e.cookie("lang")
                            ? e(this).html("<small>&#9660;</small> Hide form")
                            : "lt" == e.cookie("lang")
                            ? e(this).html("<small>&#9660;</small> Slepti etimologiją")
                            : "lv" == e.cookie("lang")
                            ? e(this).html("<small>&#9660;</small> Slēpt etimologiju")
                            : "pr" == e.cookie("lang")
                            ? e(this).html("<small>&#9660;</small> Aukliptun etimolōgijan")
                            : "pl" == e.cookie("lang")
                            ? e(this).html("<small>&#9660;</small> Schować etimologiję")
                            : "ru" == e.cookie("lang") && e(this).html("<small>&#9660;</small> Скрыть этимологию")
                        : "de" == e.cookie("lang")
                        ? e(this).html("<small>&#9658;</small> Klappen Etymologie aus")
                        : "en" == e.cookie("lang")
                        ? e(this).html("<small>&#9658;</small> Show etymology")
                        : "lt" == e.cookie("lang")
                        ? e(this).html("<small>&#9658;</small> Rodyti etimologiją")
                        : "lv" == e.cookie("lang")
                        ? e(this).html("<small>&#9658;</small> Rādīt etimologiju")
                        : "pr" == e.cookie("lang")
                        ? e(this).html("<small>&#9658;</small> Enwaidīntun etimolōgijan")
                        : "pl" == e.cookie("lang")
                        ? e(this).html("<small>&#9658;</small> Pokazać etimologiję")
                        : "ru" == e.cookie("lang") && e(this).html("<small>&#9658;</small> Показать этимологию");
            });
    }),
    $(window).keyup(function (e) {
        27 === e.which && ($(".spoiler-body2").prev().toggleClass("opened").toggleClass("closed"), $(".spoiler-body2").fadeOut("slow"));
    }),
    $(document).mouseup(function (e) {
        var t = $(".spoiler-body2");
        0 === t.has(e.target).length && ($(".spoiler-body2").prev().removeClass("opened").addClass("closed"), t.hide());
    });
