/* Polish locals for flatpickr */
var flatpickr = flatpickr || { l10ns: {} };
flatpickr.l10ns.pl = {};

flatpickr.l10ns.pl.weekdays = {
	shorthand: ["Nd", "Pn", "Wt", "Śr", "Cz", "Pt", "So"],
	longhand: ["Niedziela", "Poniedziałek", "Wtorek", "Środa", "Czwartek", "Piątek", "Sobota"]
};

flatpickr.l10ns.pl.months = {
	shorthand: ["Sty", "Lut", "Mar", "Kwi", "Maj", "Cze", "Lip", "Sie", "Wrz", "Paź", "Lis", "Gru"],
	longhand: ["Styczeń", "Luty", "Marzec", "Kwiecień", "Maj", "Czerwiec", "Lipiec", "Sierpień", "Wrzesień", "Październik", "Listopad", "Grudzień"]
};

flatpickr.l10ns.pl.ordinal = function () {
	return ".";
};
if (typeof module !== "undefined") module.exports = flatpickr.l10ns;