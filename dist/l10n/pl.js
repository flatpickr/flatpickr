/* Polish locals for flatpickr */
var Flatpickr = Flatpickr || { l10ns: {} };
Flatpickr.l10ns.pl = {};

Flatpickr.l10ns.pl.weekdays = {
	shorthand: ["Nd", "Pn", "Wt", "Śr", "Cz", "Pt", "So"],
	longhand: ["Niedziela", "Poniedziałek", "Wtorek", "Środa", "Czwartek", "Piątek", "Sobota"]
};

Flatpickr.l10ns.pl.months = {
	shorthand: ["Sty", "Lut", "Mar", "Kwi", "Maj", "Cze", "Lip", "Sie", "Wrz", "Paź", "Lis", "Gru"],
	longhand: ["Styczeń", "Luty", "Marzec", "Kwiecień", "Maj", "Czerwiec", "Lipiec", "Sierpień", "Wrzesień", "Październik", "Listopad", "Grudzień"]
};

Flatpickr.l10ns.pl.ordinal = function () {
	return ".";
};
if (typeof module !== "undefined") module.exports = Flatpickr.l10ns;