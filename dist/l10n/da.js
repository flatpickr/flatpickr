/* Danish locals for flatpickr */
var Flatpickr = Flatpickr || { l10ns: {} };
Flatpickr.l10ns.da = {};

Flatpickr.l10ns.da.weekdays = {
	shorthand: ["Søn", "Man", "Tir", "Ons", "Tors", "Fre", "Lør"],
	longhand: ["Søndag", "Mandag", "Tirsdag", "Onsdag", "Torsdag", "Fredag", "Lørdag"]
};

Flatpickr.l10ns.da.months = {
	shorthand: ["Jan", "Feb", "Mar", "Apr", "Maj", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dec"],
	longhand: ["Januar", "Februar", "Marts", "April", "Maj", "Juni", "Juli", "August", "September", "Oktober", "November", "December"]
};

Flatpickr.l10ns.da.ordinal = function () {
	return ".";
};
if (typeof module !== "undefined") module.exports = Flatpickr.l10ns;