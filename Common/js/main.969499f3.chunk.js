! function (e, n) {
    if ("object" === typeof exports && "object" === typeof module) module.exports = n();
    else if ("function" === typeof define && define.amd) define([], n);
    else {
        var t = n();
        for (var o in t)("object" === typeof exports ? exports : e)[o] = t[o]
    }
}(window, function () {
    return (window.webpackJsonp = window.webpackJsonp || []).push([
        [0],
        [function (e, n, t) {
            e.exports = t(1)
        }, function (e, n, t) {
            var o = this && this.__awaiter || function (e, n, t, o) {
                    return new(t || (t = Promise))(function (r, i) {
                        function u(e) {
                            try {
                                c(o.next(e))
                            } catch (n) {
                                i(n)
                            }
                        }

                        function a(e) {
                            try {
                                c(o.throw(e))
                            } catch (n) {
                                i(n)
                            }
                        }

                        function c(e) {
                            var n;
                            e.done ? r(e.value) : (n = e.value, n instanceof t ? n : new t(function (e) {
                                e(n)
                            })).then(u, a)
                        }
                        c((o = o.apply(e, n || [])).next())
                    })
                },
                r = this && this.__generator || function (e, n) {
                    var t, o, r, i, u = {
                        label: 0,
                        sent: function () {
                            if (1 & r[0]) throw r[1];
                            return r[1]
                        },
                        trys: [],
                        ops: []
                    };
                    return i = {
                        next: a(0),
                        throw: a(1),
                        return: a(2)
                    }, "function" === typeof Symbol && (i[Symbol.iterator] = function () {
                        return this
                    }), i;

                    function a(i) {
                        return function (a) {
                            return function (i) {
                                if (t) throw new TypeError("Generator is already executing.");
                                for (; u;) try {
                                    if (t = 1, o && (r = 2 & i[0] ? o.return : i[0] ? o.throw || ((r = o.return) && r.call(o), 0) : o.next) && !(r = r.call(o, i[1])).done) return r;
                                    switch (o = 0, r && (i = [2 & i[0], r.value]), i[0]) {
                                        case 0:
                                        case 1:
                                            r = i;
                                            break;
                                        case 4:
                                            return u.label++, {
                                                value: i[1],
                                                done: !1
                                            };
                                        case 5:
                                            u.label++, o = i[1], i = [0];
                                            continue;
                                        case 7:
                                            i = u.ops.pop(), u.trys.pop();
                                            continue;
                                        default:
                                            if (!(r = (r = u.trys).length > 0 && r[r.length - 1]) && (6 === i[0] || 2 === i[0])) {
                                                u = 0;
                                                continue
                                            }
                                            if (3 === i[0] && (!r || i[1] > r[0] && i[1] < r[3])) {
                                                u.label = i[1];
                                                break
                                            }
                                            if (6 === i[0] && u.label < r[1]) {
                                                u.label = r[1], r = i;
                                                break
                                            }
                                            if (r && u.label < r[2]) {
                                                u.label = r[2], u.ops.push(i);
                                                break
                                            }
                                            r[2] && u.ops.pop(), u.trys.pop();
                                            continue
                                    }
                                    i = n.call(e, u)
                                } catch (a) {
                                    i = [6, a], o = 0
                                } finally {
                                    t = r = 0
                                }
                                if (5 & i[0]) throw i[1];
                                return {
                                    value: i[0] ? i[1] : void 0,
                                    done: !0
                                }
                            }([i, a])
                        }
                    }
                };
            o(void 0, void 0, void 0, function () {
                var e;
                return r(this, function (n) {
                    switch (n.label) {
                        case 0:
                            return [4, t.e("Common_utils_method").then(t.bind(null, 2))];
                        case 1:
                            return n.sent(), [4, t.e("Common_test_index").then(t.bind(null, 3))];
                        case 2:
                            return e = n.sent(), console.log(e), [2]
                    }
                })
            })
        }],
        [
            [0, 1]
        ]
    ])
});