/* French locals for flatpickr */
var flatpickr = flatpickr || { l10ns: {} };
flatpickr.l10ns.fr = {};

flatpickr.l10ns.fr.firstDayOfWeek = 1;

flatpickr.l10ns.fr.weekdays = {
	shorthand: ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"],
	longhand: ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"]
};

flatpickr.l10ns.fr.months = {
	shorthand: ["Janv", "Févr", "Mars", "Avr", "Mai", "Juin", "Juil", "Août", "Sept", "Oct", "Nov", "Déc"],
	longhand: ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"]
};

flatpickr.l10ns.fr.ordinal = function (nth) {
	if (nth > 1) return "ème";

	return "er";
};
if (typeof module !== "undefined") module.exports = flatpickr.l10ns;

flatpickr.l10ns.fr.rangeSeparator = " au ";
flatpickr.l10ns.fr.weekAbbreviation = "Sem";
flatpickr.l10ns.fr.scrollTitle = "Défiler pour augmenter la valeur";
flatpickr.l10ns.fr.toggleTitle = "Cliquer pour basculer";