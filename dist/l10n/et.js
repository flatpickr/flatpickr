/* Estonian locals for flatpickr */
var Flatpickr = Flatpickr || { l10ns: {} };
Flatpickr.l10ns.et = {};

Flatpickr.l10ns.et.weekdays = {
	shorthand: ['P', 'E', 'T', 'K', 'N', 'R', 'L'],
	longhand: ['Pühapäev', 'Esmaspäev', 'Teisipäev', 'Kolmapäev', 'Neljapäev', 'Reede', 'Laupäev']
};

Flatpickr.l10ns.et.months = {
	shorthand: ['Jaan', 'Veebr', 'Märts', 'Apr', 'Mai', 'Juuni', 'Juuli', 'Aug', 'Sept', 'Okt', 'Nov', 'Dets'],
	longhand: ['Jaanuar', 'Veebruar', 'Märts', 'Aprill', 'Mai', 'Juuni', 'Juuli', 'August', 'September', 'Oktoober', 'November', 'Detsember']
};

Flatpickr.l10ns.et.firstDayOfWeek = 1;

Flatpickr.l10ns.et.ordinal = function () {
	return ".";
};

Flatpickr.l10ns.et.weekAbbreviation = "Näd";
Flatpickr.l10ns.et.rangeSeparator = " kuni ";
Flatpickr.l10ns.et.scrollTitle = "Keri, et suurendada";
Flatpickr.l10ns.et.toggleTitle = "Klõpsa, et vahetada";

if (typeof module !== "undefined") {
	module.exports = Flatpickr.l10ns;
}