/* French locals for flatpickr */
var Flatpickr = Flatpickr || { l10ns: {} };
Flatpickr.l10ns.fr = {};

Flatpickr.l10ns.fr.firstDayOfWeek = 1;

Flatpickr.l10ns.fr.weekdays = {
	shorthand: ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"],
	longhand: ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"]
};

Flatpickr.l10ns.fr.months = {
	shorthand: ["Janv", "Févr", "Mars", "Avr", "Mai", "Juin", "Juil", "Août", "Sept", "Oct", "Nov", "Déc"],
	longhand: ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"]
};

Flatpickr.l10ns.fr.ordinal = function (nth) {
	if (nth > 1) return "ème";

	return "er";
};
if (typeof module !== "undefined") module.exports = Flatpickr.l10ns;

Flatpickr.l10ns.fr.rangeSeparator = " au ";
Flatpickr.l10ns.fr.weekAbbreviation = "Sem";
Flatpickr.l10ns.fr.scrollTitle = "Défiler pour augmenter la valeur";
Flatpickr.l10ns.fr.toggleTitle = "Cliquer pour basculer";