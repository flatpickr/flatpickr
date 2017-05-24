/* Hungarian locals for flatpickr */
var flatpickr = flatpickr || { l10ns: {} };
flatpickr.l10ns.hu = {};

flatpickr.l10ns.hu.firstDayOfWeek = 1;

flatpickr.l10ns.hu.weekdays = {
	shorthand: ["V", "H", "K", "Sz", "Cs", "P", "Szo"],
	longhand: ["Vasárnap", "Hétfő", "Kedd", "Szerda", "Csütörtök", "Péntek", "Szombat"]
};

flatpickr.l10ns.hu.months = {
	shorthand: ["Jan", "Feb", "Már", "Ápr", "Máj", "Jún", "Júl", "Aug", "Szep", "Okt", "Nov", "Dec"],
	longhand: ["Január", "Február", "Március", "Április", "Május", "Június", "Július", "Augusztus", "Szeptember", "Október", "November", "December"]
};

flatpickr.l10ns.hu.ordinal = function () {
	return ".";
};

flatpickr.l10ns.hu.weekAbbreviation = "Hét";
flatpickr.l10ns.hu.scrollTitle = "Görgessen";
flatpickr.l10ns.hu.toggleTitle = "Kattintson a váltáshoz";

if (typeof module !== "undefined") module.exports = flatpickr.l10ns;