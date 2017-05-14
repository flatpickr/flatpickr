/* Esperanto locals for flatpickr */
var Flatpickr = Flatpickr || { l10ns: {} };
Flatpickr.l10ns.eo = {};

Flatpickr.l10ns.eo.firstDayOfWeek = 1;

Flatpickr.l10ns.eo.rangeSeparator = " ĝis ";
Flatpickr.l10ns.eo.weekAbbreviation = "Sem";
Flatpickr.l10ns.eo.scrollTitle = "Rulumu por pligrandigi la valoron";
Flatpickr.l10ns.eo.toggleTitle = "Klaku por ŝalti";

Flatpickr.l10ns.eo.weekdays = {
	shorthand: ["Dim", "Lun", "Mar", "Mer", "Ĵaŭ", "Ven", "Sab"],
	longhand: ["dimanĉo", "lundo", "mardo", "merkredo", "ĵaŭdo", "vendredo", "sabato"]
};

Flatpickr.l10ns.eo.months = {
	shorthand: ["Jan", "Feb", "Mar", "Apr", "Maj", "Jun", "Jul", "Aŭg", "Sep", "Okt", "Nov", "Dec"],
	longhand: ["januaro", "februaro", "marto", "aprilo", "majo", "junio", "julio", "aŭgusto", "septembro", "oktobro", "novembro", "decembro"]
};

Flatpickr.l10ns.eo.ordinal = function () {
	return "-a";
};

if (typeof module !== "undefined") module.exports = Flatpickr.l10ns;