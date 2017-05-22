/* Esperanto locals for flatpickr */
var flatpickr = flatpickr || { l10ns: {} };
flatpickr.l10ns.eo = {};

flatpickr.l10ns.eo.firstDayOfWeek = 1;

flatpickr.l10ns.eo.rangeSeparator = " ĝis ";
flatpickr.l10ns.eo.weekAbbreviation = "Sem";
flatpickr.l10ns.eo.scrollTitle = "Rulumu por pligrandigi la valoron";
flatpickr.l10ns.eo.toggleTitle = "Klaku por ŝalti";

flatpickr.l10ns.eo.weekdays = {
	shorthand: ["Dim", "Lun", "Mar", "Mer", "Ĵaŭ", "Ven", "Sab"],
	longhand: ["dimanĉo", "lundo", "mardo", "merkredo", "ĵaŭdo", "vendredo", "sabato"]
};

flatpickr.l10ns.eo.months = {
	shorthand: ["Jan", "Feb", "Mar", "Apr", "Maj", "Jun", "Jul", "Aŭg", "Sep", "Okt", "Nov", "Dec"],
	longhand: ["januaro", "februaro", "marto", "aprilo", "majo", "junio", "julio", "aŭgusto", "septembro", "oktobro", "novembro", "decembro"]
};

flatpickr.l10ns.eo.ordinal = function () {
	return "-a";
};

if (typeof module !== "undefined") module.exports = flatpickr.l10ns;