/* flatpickr v4.2.3, @license MIT */
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global.fa = {})));
}(this, (function (exports) { 'use strict';

var fp = typeof window !== "undefined" && window.flatpickr !== undefined
    ? window.flatpickr
    : {
        l10ns: {},
    };
var Persian = {
    weekdays: {
        shorthand: ["یک", "دو", "سه", "چهار", "پنج", "آدینه", "شنبه"],
        longhand: [
            "یک‌شنبه",
            "دوشنبه",
            "سه‌شنبه",
            "چهارشنبه",
            "پنچ‌شنبه",
            "آدینه",
            "شنبه",
        ],
    },
    months: {
        shorthand: [
            "ژانویه",
            "فوریه",
            "مارس",
            "آوریل",
            "مه",
            "ژوئن",
            "ژوئیه",
            "اوت",
            "سپتامبر",
            "اکتبر",
            "نوامبر",
            "دسامبر",
        ],
        longhand: [
            "ژانویه",
            "فوریه",
            "مارس",
            "آوریل",
            "مه",
            "ژوئن",
            "ژوئیه",
            "اوت",
            "سپتامبر",
            "اکتبر",
            "نوامبر",
            "دسامبر",
        ],
    },
    ordinal: function () {
        return "";
    },
};
fp.l10ns.fa = Persian;
var fa = fp.l10ns;

exports.Persian = Persian;
exports['default'] = fa;

Object.defineProperty(exports, '__esModule', { value: true });

})));
