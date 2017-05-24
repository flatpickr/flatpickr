/* Slovenian locals for flatpickr */
var flatpickr = flatpickr || { l10ns: {} };
flatpickr.l10ns.sl = {};

flatpickr.l10ns.sl.weekdays = {
	shorthand: ["Ned", "Pon", "Tor", "Sre", "Čet", "Pet", "Sob"],
	longhand: ["Nedelja", "Ponedeljek", "Torek", "Sreda", "Četrtek", "Petek", "Sobota"]
};

flatpickr.l10ns.sl.months = {
	shorthand: ["Jan", "Feb", "Mar", "Apr", "Maj", "Jun", "Jul", "Avg", "Sep", "Okt", "Nov", "Dec"],
	longhand: ["Januar", "Februar", "Marec", "April", "Maj", "Junij", "Julij", "Avgust", "September", "Oktober", "November", "December"]
};

flatpickr.l10ns.sl.firstDayOfWeek = 1;
flatpickr.l10ns.sl.rangeSeparator = " do ";
flatpickr.l10ns.sl.ordinal = function () {
	return ".";
};

if (typeof module !== "undefined") module.exports = flatpickr.l10ns;