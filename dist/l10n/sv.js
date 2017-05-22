/* Swedish locals for flatpickr */
var flatpickr = flatpickr || { l10ns: {} };
flatpickr.l10ns.sv = {};

flatpickr.l10ns.sv.firstDayOfWeek = 1;
flatpickr.l10ns.sv.weekAbbreviation = "v";

flatpickr.l10ns.sv.weekdays = {
	shorthand: ["Sön", "Mån", "Tis", "Ons", "Tor", "Fre", "Lör"],
	longhand: ["Söndag", "Måndag", "Tisdag", "Onsdag", "Torsdag", "Fredag", "Lördag"]
};

flatpickr.l10ns.sv.months = {
	shorthand: ["Jan", "Feb", "Mar", "Apr", "Maj", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dec"],
	longhand: ["Januari", "Februari", "Mars", "April", "Maj", "Juni", "Juli", "Augusti", "September", "Oktober", "November", "December"]
};

flatpickr.l10ns.sv.ordinal = function () {
	return ".";
};
if (typeof module !== "undefined") module.exports = flatpickr.l10ns;