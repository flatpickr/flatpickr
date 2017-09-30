"use strict";
exports.__esModule = true;
var fp = typeof window !== "undefined" && window.flatpickr !== undefined
    ? window.flatpickr
    : {
        l10ns: {}
    };
exports.Croatian = {
    firstDayOfWeek: 1,
    weekdays: {
        shorthand: ["Ned", "Pon", "Uto", "Sri", "Čet", "Pet", "Sub"],
        longhand: [
            "Nedjelja",
            "Ponedjeljak",
            "Utorak",
            "Srijeda",
            "Četvrtak",
            "Petak",
            "Subota",
        ]
    },
    months: {
        shorthand: [
            "Sij",
            "Velj",
            "Ožu",
            "Tra",
            "Svi",
            "Lip",
            "Srp",
            "Kol",
            "Ruj",
            "Lis",
            "Stu",
            "Pro",
        ],
        longhand: [
            "Siječanj",
            "Veljača",
            "Ožujak",
            "Travanj",
            "Svibanj",
            "Lipanj",
            "Srpanj",
            "Kolovoz",
            "Rujan",
            "Listopad",
            "Studeni",
            "Prosinac",
        ]
    }
};
fp.l10ns.hr = exports.Croatian;
exports["default"] = fp.l10ns;
