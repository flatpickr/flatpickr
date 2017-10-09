"use strict";
exports.__esModule = true;
var fp = typeof window !== "undefined" && window.flatpickr !== undefined
    ? window.flatpickr
    : {
        l10ns: {}
    };
exports.Danish = {
    weekdays: {
        shorthand: ["søn", "man", "tir", "ons", "tors", "fre", "lør"],
        longhand: [
            "søndag",
            "mandag",
            "tirsdag",
            "onsdag",
            "torsdag",
            "fredag",
            "lørdag",
        ]
    },
    months: {
        shorthand: [
            "jan",
            "feb",
            "mar",
            "apr",
            "maj",
            "jun",
            "jul",
            "aug",
            "sep",
            "okt",
            "nov",
            "dec",
        ],
        longhand: [
            "januar",
            "februar",
            "marts",
            "april",
            "maj",
            "juni",
            "juli",
            "august",
            "september",
            "oktober",
            "november",
            "december",
        ]
    },
    ordinal: function () {
        return ".";
    },
    firstDayOfWeek: 1,
    rangeSeparator: " til ",
    weekAbbreviation: "uge"
};
fp.l10ns.da = exports.Danish;
exports["default"] = fp.l10ns;
