"use strict";
exports.__esModule = true;
var fp = typeof window !== "undefined" && window.flatpickr !== undefined
    ? window.flatpickr
    : {
        l10ns: {}
    };
exports.Albanian = {
    weekdays: {
        shorthand: ["Di", "Hë", "Ma", "Më", "En", "Pr", "Sh"],
        longhand: [
            "E Diel",
            "E Hënë",
            "E Martë",
            "E Mërkurë",
            "E Enjte",
            "E Premte",
            "E Shtunë",
        ]
    },
    months: {
        shorthand: [
            "Jan",
            "Shk",
            "Mar",
            "Pri",
            "Maj",
            "Qer",
            "Kor",
            "Gus",
            "Sht",
            "Tet",
            "Nën",
            "Dhj",
        ],
        longhand: [
            "Janar",
            "Shkurt",
            "Mars",
            "Prill",
            "Maj",
            "Qershor",
            "Korrik",
            "Gusht",
            "Shtator",
            "Tetor",
            "Nëntor",
            "Dhjetor",
        ]
    }
};
fp.l10ns.sq = exports.Albanian;
exports["default"] = fp.l10ns;
