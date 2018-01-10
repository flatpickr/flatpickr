/* flatpickr v4.2.3, @license MIT */
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global.lt = {})));
}(this, (function (exports) { 'use strict';

var fp = typeof window !== "undefined" && window.flatpickr !== undefined
    ? window.flatpickr
    : {
        l10ns: {},
    };
var Lithuanian = {
    weekdays: {
        shorthand: ["S", "Pr", "A", "T", "K", "Pn", "Š"],
        longhand: [
            "Sekmadienis",
            "Pirmadienis",
            "Antradienis",
            "Trečiadienis",
            "Ketvirtadienis",
            "Penktadienis",
            "Šeštadienis",
        ],
    },
    months: {
        shorthand: [
            "Sau",
            "Vas",
            "Kov",
            "Bal",
            "Geg",
            "Bir",
            "Lie",
            "Rgp",
            "Rgs",
            "Spl",
            "Lap",
            "Grd",
        ],
        longhand: [
            "Sausis",
            "Vasaris",
            "Kovas",
            "Balandis",
            "Gegužė",
            "Birželis",
            "Liepa",
            "Rugpjūtis",
            "Rugsėjis",
            "Spalis",
            "Lapkritis",
            "Gruodis",
        ],
    },
    firstDayOfWeek: 1,
    ordinal: function () {
        return "-a";
    },
    weekAbbreviation: "Sav",
    scrollTitle: "Keisti laiką pelės rateliu",
    toggleTitle: "Perjungti laiko formatą",
};
fp.l10ns.lt = Lithuanian;
var lt = fp.l10ns;

exports.Lithuanian = Lithuanian;
exports['default'] = lt;

Object.defineProperty(exports, '__esModule', { value: true });

})));
