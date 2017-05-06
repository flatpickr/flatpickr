/* Hungarian locals for flatpickr */
var Flatpickr = Flatpickr || { l10ns: {} };
Flatpickr.l10ns.hu = {};

Flatpickr.l10ns.hu.firstDayOfWeek = 1;

Flatpickr.l10ns.hu.weekdays = {
	shorthand: ["V", "H", "K", "Sz", "Cs", "P", "Szo"],
	longhand: ["Vasárnap", "Hétfő", "Kedd", "Szerda", "Csütörtök", "Péntek", "Szombat"]
};

Flatpickr.l10ns.hu.months = {
	shorthand: ["Jan", "Feb", "Már", "Ápr", "Máj", "Jún", "Júl", "Aug", "Szep", "Okt", "Nov", "Dec"],
	longhand: ["Január", "Február", "Március", "Április", "Május", "Június", "Július", "Augusztus", "Szeptember", "Október", "November", "December"]
};

Flatpickr.l10ns.hu.ordinal = function () {
	return ".";
};

Flatpickr.l10ns.hu.weekAbbreviation = "Hét";
Flatpickr.l10ns.hu.scrollTitle = "Görgessen";
Flatpickr.l10ns.hu.toggleTitle = "Kattintson a váltáshoz";

if (typeof module !== "undefined") module.exports = Flatpickr.l10ns;