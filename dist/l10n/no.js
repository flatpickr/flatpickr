/* Norwegian locals for flatpickr */
var Flatpickr = Flatpickr || { l10ns: {} };
Flatpickr.l10ns.no = {};

Flatpickr.l10ns.no.weekdays = {
	shorthand: ["Søn", "Man", "Tir", "Ons", "Tor", "Fre", "Lør"],
	longhand: ["Søndag", "Mandag", "Tirsdag", "Onsdag", "Torsdag", "Fredag", "Lørdag"]
};

Flatpickr.l10ns.no.months = {
	shorthand: ["Jan", "Feb", "Mar", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Des"],
	longhand: ["Januar", "Februar", "Mars", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Desember"]
};

Flatpickr.l10ns.no.firstDayOfWeek = 1;
Flatpickr.l10ns.no.rangeSeparator = " til ";
Flatpickr.l10ns.no.weekAbbreviation = "Uke";
Flatpickr.l10ns.no.scrollTitle = "Scroll for å endre";
Flatpickr.l10ns.no.toggleTitle = "Klikk for å veksle";

Flatpickr.l10ns.no.ordinal = function () {
	return ".";
};
if (typeof module !== "undefined") module.exports = Flatpickr.l10ns;