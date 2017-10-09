"use strict";
exports.__esModule = true;
var fp = typeof window !== "undefined" && window.flatpickr !== undefined
    ? window.flatpickr
    : {
        l10ns: {}
    };
exports.Serbian = {
    weekdays: {
        shorthand: ["Ned", "Pon", "Uto", "Sre", "Čet", "Pet", "Sub", "Ned"],
        longhand: [
            "Nedelja",
            "Ponedeljak",
            "Utorak",
            "Sreda",
            "Četvrtak",
            "Petak",
            "Subota",
            "Nedelja",
        ]
    },
    months: {
        shorthand: [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "Maj",
            "Jun",
            "Jul",
            "Avg",
            "Sep",
            "Okt",
            "Nov",
            "Dec",
        ],
        longhand: [
            "Januar",
            "Februar",
            "Mart",
            "April",
            "Maj",
            "Jun",
            "Jul",
            "Avgust",
            "Septembar",
            "Oktobar",
            "Novembar",
            "Decembar",
        ]
    },
    firstDayOfWeek: 1,
    weekAbbreviation: "Ned.",
    rangeSeparator: " do "
};
fp.l10ns.sr = exports.Serbian;
exports["default"] = fp.l10ns;
