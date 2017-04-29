/* Slovenian locals for flatpickr */
var Flatpickr = Flatpickr || { l10ns: {} };
Flatpickr.l10ns.sl = {};

Flatpickr.l10ns.sl.weekdays = {
	shorthand: ["Ned", "Pon", "Tor", "Sre", "Čet", "Pet", "Sob"],
	longhand: ["Nedelja", "Ponedeljek", "Torek", "Sreda", "Četrtek", "Petek", "Sobota"]
};

Flatpickr.l10ns.sl.months = {
	shorthand: ["Jan", "Feb", "Mar", "Apr", "Maj", "Jun", "Jul", "Avg", "Sep", "Okt", "Nov", "Dec"],
	longhand: ["Januar", "Februar", "Marec", "April", "Maj", "Junij", "Julij", "Avgust", "September", "Oktober", "November", "December"]
};

Flatpickr.l10ns.sl.firstDayOfWeek = 1;
Flatpickr.l10ns.sl.rangeSeparator = " do ";
Flatpickr.l10ns.sl.ordinal = function () {
	return ".";
};

if (typeof module !== "undefined") 
	module.exports = Flatpickr.l10ns;

