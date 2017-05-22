/* Norwegian locals for flatpickr */
var flatpickr = flatpickr || { l10ns: {} };
flatpickr.l10ns.no = {};

flatpickr.l10ns.no.weekdays = {
	shorthand: ["Søn", "Man", "Tir", "Ons", "Tor", "Fre", "Lør"],
	longhand: ["Søndag", "Mandag", "Tirsdag", "Onsdag", "Torsdag", "Fredag", "Lørdag"]
};

flatpickr.l10ns.no.months = {
	shorthand: ["Jan", "Feb", "Mar", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Des"],
	longhand: ["Januar", "Februar", "Mars", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Desember"]
};

flatpickr.l10ns.no.firstDayOfWeek = 1;
flatpickr.l10ns.no.rangeSeparator = " til ";
flatpickr.l10ns.no.weekAbbreviation = "Uke";
flatpickr.l10ns.no.scrollTitle = "Scroll for å endre";
flatpickr.l10ns.no.toggleTitle = "Klikk for å veksle";

flatpickr.l10ns.no.ordinal = function () {
	return ".";
};
if (typeof module !== "undefined") module.exports = flatpickr.l10ns;