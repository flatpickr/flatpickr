"use strict";
exports.__esModule = true;
var fp = typeof window !== "undefined" && window.flatpickr !== undefined
    ? window.flatpickr
    : {
        l10ns: {}
    };
exports.Czech = {
    weekdays: {
        shorthand: ["Ne", "Po", "Út", "St", "Čt", "Pá", "So"],
        longhand: [
            "Neděle",
            "Pondělí",
            "Úterý",
            "Středa",
            "Čtvrtek",
            "Pátek",
            "Sobota",
        ]
    },
    months: {
        shorthand: [
            "Led",
            "Ún",
            "Bře",
            "Dub",
            "Kvě",
            "Čer",
            "Čvc",
            "Srp",
            "Zář",
            "Říj",
            "Lis",
            "Pro",
        ],
        longhand: [
            "Leden",
            "Únor",
            "Březen",
            "Duben",
            "Květen",
            "Červen",
            "Červenec",
            "Srpen",
            "Září",
            "Říjen",
            "Listopad",
            "Prosinec",
        ]
    },
    rangeSeparator: ' do ',
    firstDayOfWeek: 1,
    ordinal: function () {
        return ".";
    }
};
fp.l10ns.cs = exports.Czech;
exports["default"] = fp.l10ns;
