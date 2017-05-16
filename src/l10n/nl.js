/* Dutch locals for flatpickr */
var Flatpickr = Flatpickr || {l10ns: {}};
Flatpickr.l10ns.nl = {};

Flatpickr.l10ns.nl.weekdays = {
	shorthand: ["zo", "ma", "di", "wo", "do", "vr", "za"],
	longhand: ["zondag", "maandag", "dinsdag", "woensdag", "donderdag", "vrijdag", "zaterdag"]
};

Flatpickr.l10ns.nl.months = {
	shorthand: ["jan", "feb", "mrt", "apr", "mei", "jun", "jul", "aug", "sept", "okt", "nov", "dec"],
	longhand: ["januari", "februari", "maart", "april", "mei", "juni", "juli", "augustus", "september", "oktober", "november", "december"]
};

Flatpickr.l10ns.nl.firstDayOfWeek = 1;
Flatpickr.l10ns.nl.weekAbbreviation = "wk";
Flatpickr.l10ns.nl.rangeSeparator = " tot ";
Flatpickr.l10ns.nl.scrollTitle = "Scroll voor volgende / vorige";
Flatpickr.l10ns.nl.toggleTitle = "Klik om te wisselen";

Flatpickr.l10ns.nl.ordinal = nth => {
	if (nth === 1 || nth === 8 || nth >= 20)
		return "ste";

	return "de";
};

if (typeof module !== "undefined")
	module.exports = Flatpickr.l10ns;
