"use strict";
exports.__esModule = true;
var fp = typeof window !== "undefined" && window.flatpickr !== undefined
    ? window.flatpickr
    : {
        l10ns: {}
    };
exports.Latvian = {
    firstDayOfWeek: 1,
    weekdays: {
        shorthand: ["Sv", "P", "Ot", "Tr", "Ce", "Pk", "Se"],
        longhand: [
            "Svētdiena",
            "Pirmdiena",
            "Otrdiena",
            "Trešdiena",
            "Ceturtdiena",
            "Piektdiena",
            "Sestdiena",
        ]
    },
    months: {
        shorthand: [
            "Jan",
            "Feb",
            "Mar",
            "Mai",
            "Apr",
            "Jūn",
            "Jūl",
            "Aug",
            "Sep",
            "Okt",
            "Nov",
            "Dec",
        ],
        longhand: [
            "Janvāris",
            "Februāris",
            "Marts",
            "Aprīlis",
            "Maijs",
            "Jūnijs",
            "Jūlijs",
            "Augusts",
            "Septembris",
            "Oktobris",
            "Novembris",
            "Decembris",
        ]
    },
    rangeSeparator: " līdz "
};
fp.l10ns.lv = exports.Latvian;
exports["default"] = fp.l10ns;
