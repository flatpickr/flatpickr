/* Estonian locals for flatpickr */
var flatpickr = flatpickr || { l10ns: {} };
flatpickr.l10ns.et = {};

flatpickr.l10ns.et.weekdays = {
	shorthand: ["P", "E", "T", "K", "N", "R", "L"],
	longhand: ["Pühapäev", "Esmaspäev", "Teisipäev", "Kolmapäev", "Neljapäev", "Reede", "Laupäev"]
};

flatpickr.l10ns.et.months = {
	shorthand: ["Jaan", "Veebr", "Märts", "Apr", "Mai", "Juuni", "Juuli", "Aug", "Sept", "Okt", "Nov", "Dets"],
	longhand: ["Jaanuar", "Veebruar", "Märts", "Aprill", "Mai", "Juuni", "Juuli", "August", "September", "Oktoober", "November", "Detsember"]
};

flatpickr.l10ns.et.firstDayOfWeek = 1;

flatpickr.l10ns.et.ordinal = function () {
	return ".";
};

flatpickr.l10ns.et.weekAbbreviation = "Näd";
flatpickr.l10ns.et.rangeSeparator = " kuni ";
flatpickr.l10ns.et.scrollTitle = "Keri, et suurendada";
flatpickr.l10ns.et.toggleTitle = "Klõpsa, et vahetada";

if (typeof module !== "undefined") module.exports = flatpickr.l10ns;