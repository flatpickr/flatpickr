/* Dutch locals for flatpickr */
var flatpickr = flatpickr || { l10ns: {} };
flatpickr.l10ns.nl = {};

flatpickr.l10ns.nl.weekdays = {
	shorthand: ["zo", "ma", "di", "wo", "do", "vr", "za"],
	longhand: ["zondag", "maandag", "dinsdag", "woensdag", "donderdag", "vrijdag", "zaterdag"]
};

flatpickr.l10ns.nl.months = {
	shorthand: ["jan", "feb", "mrt", "apr", "mei", "jun", "jul", "aug", "sept", "okt", "nov", "dec"],
	longhand: ["januari", "februari", "maart", "april", "mei", "juni", "juli", "augustus", "september", "oktober", "november", "december"]
};

flatpickr.l10ns.nl.firstDayOfWeek = 1;
flatpickr.l10ns.nl.weekAbbreviation = "wk";
flatpickr.l10ns.nl.rangeSeparator = " tot ";
flatpickr.l10ns.nl.scrollTitle = "Scroll voor volgende / vorige";
flatpickr.l10ns.nl.toggleTitle = "Klik om te wisselen";

flatpickr.l10ns.nl.ordinal = function (nth) {
	if (nth === 1 || nth === 8 || nth >= 20) return "ste";

	return "de";
};

if (typeof module !== "undefined") module.exports = flatpickr.l10ns;