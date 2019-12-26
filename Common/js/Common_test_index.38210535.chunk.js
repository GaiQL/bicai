(window.webpackJsonp = window.webpackJsonp || []).push([
    ["Common_test_index"],
    [, , function (n, t, i) {
        "use strict";
        i.r(t), i.d(t, "addition", function () {
            return u
        }), i.d(t, "subtraction", function () {
            return o
        });
        var u = function (n) {
                return n + 1
            },
            o = function (n) {
                return n - 1
            }
    }, function (n, t, i) {
        "use strict";
        i.r(t);
        i(4);
        var u = i(2),
            o = function () {
                return function () {
                    var n = this;
                    this.additionNum = function () {
                        n.num = Object(u.addition)(n.num)
                    }, this.num = 0
                }
            }(),
            c = function () {
                return function () {
                    var n = this;
                    this.changNum = function (t) {
                        n.num = t
                    }, this.getStore = function () {
                        console.log(o)
                    }, this.num = new o, this.data = "balalalaz", this.num.additionNum(), console.log(this.num.num)
                }
            }();
        t.default = c
    }, function (n, t, i) {}]
]);