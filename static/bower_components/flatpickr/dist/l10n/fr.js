"use strict";
exports.__esModule = true;
var fp = typeof window !== "undefined" && window.flatpickr !== undefined
    ? window.flatpickr
    : {
        l10ns: {}
    };
exports.French = {
    firstDayOfWeek: 1,
    weekdays: {
        shorthand: ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"],
        longhand: [
            "Dimanche",
            "Lundi",
            "Mardi",
            "Mercredi",
            "Jeudi",
            "Vendredi",
            "Samedi",
        ]
    },
    months: {
        shorthand: [
            "Janv",
            "Févr",
            "Mars",
            "Avr",
            "Mai",
            "Juin",
            "Juil",
            "Août",
            "Sept",
            "Oct",
            "Nov",
            "Déc",
        ],
        longhand: [
            "Janvier",
            "Février",
            "Mars",
            "Avril",
            "Mai",
            "Juin",
            "Juillet",
            "Août",
            "Septembre",
            "Octobre",
            "Novembre",
            "Décembre",
        ]
    },
    ordinal: function (nth) {
        if (nth > 1)
            return "ème";
        return "er";
    },
    rangeSeparator: " au ",
    weekAbbreviation: "Sem",
    scrollTitle: "Défiler pour augmenter la valeur",
    toggleTitle: "Cliquer pour basculer"
};
fp.l10ns.fr = exports.French;
exports["default"] = fp.l10ns;
