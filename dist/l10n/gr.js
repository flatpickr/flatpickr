"use strict";
exports.__esModule = true;
var fp = typeof window !== "undefined" && window.flatpickr !== undefined
    ? window.flatpickr
    : {
        l10ns: {}
    };
exports.Greek = {
    weekdays: {
        shorthand: ["Κυ", "Δε", "Τρ", "Τε", "Πέ", "Πα", "Σά"],
        longhand: [
            "Κυριακή",
            "Δευτέρα",
            "Τρίτη",
            "Τετάρτη",
            "Πέμπτη",
            "Παρασκευή",
            "Σάββατο",
        ]
    },
    months: {
        shorthand: [
            "Ιαν",
            "Φεβ",
            "Μάρ",
            "Απρ",
            "Μάι",
            "Ιού",
            "Ιού",
            "Αύγ",
            "Σεπ",
            "Οκτ",
            "Νοέ",
            "Δεκ",
        ],
        longhand: [
            "Ιανουάριος",
            "Φεβρουάριος",
            "Μάρτιος",
            "Απρίλιος",
            "Μάιος",
            "Ιούνιος",
            "Ιούλιος",
            "Αύγουστος",
            "Σεπτέμβριος",
            "Οκτώβριος",
            "Νοέμβριος",
            "Δεκέμβριος",
        ]
    },
    firstDayOfWeek: 1,
    ordinal: function () {
        return "";
    },
    weekAbbreviation: "Εβδ",
    rangeSeparator: " έως ",
    scrollTitle: "Μετακυλήστε για προσαύξηση",
    toggleTitle: "Κάντε κλικ για αλλαγή",
    amPM: ["ΠΜ", "ΜΜ"]
};
fp.l10ns.gr = exports.Greek;
exports["default"] = fp.l10ns;
