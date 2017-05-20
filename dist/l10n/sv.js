/* Swedish locals for flatpickr */
var Flatpickr = Flatpickr || { l10ns: {} };
Flatpickr.l10ns.sv = {};

Flatpickr.l10ns.sv.firstDayOfWeek = 1;
Flatpickr.l10ns.sv.weekAbbreviation = "v";

Flatpickr.l10ns.sv.weekdays = {
	shorthand: ["Sön", "Mån", "Tis", "Ons", "Tor", "Fre", "Lör"],
	longhand: ["Söndag", "Måndag", "Tisdag", "Onsdag", "Torsdag", "Fredag", "Lördag"]
};

Flatpickr.l10ns.sv.months = {
	shorthand: ["Jan", "Feb", "Mar", "Apr", "Maj", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dec"],
	longhand: ["Januari", "Februari", "Mars", "April", "Maj", "Juni", "Juli", "Augusti", "September", "Oktober", "November", "December"]
};

Flatpickr.l10ns.sv.ordinal = function () {
	return ".";
};
if (typeof module !== "undefined") module.exports = Flatpickr.l10ns;