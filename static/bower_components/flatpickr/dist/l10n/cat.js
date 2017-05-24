/* Catalan locals for flatpickr */
var flatpickr = flatpickr || { l10ns: {} };
flatpickr.l10ns.cat = {};

flatpickr.l10ns.cat.weekdays = {
	shorthand: ["Dg", "Dl", "Dt", "Dc", "Dj", "Dv", "Ds"],
	longhand: ["Diumenge", "Dilluns", "Dimarts", "Dimecres", "Dijous", "Divendres", "Dissabte"]
};

flatpickr.l10ns.cat.months = {
	shorthand: ["Gen", "Febr", "Març", "Abr", "Maig", "Juny", "Jul", "Ag", "Set", "Oct", "Nov", "Des"],
	longhand: ["Gener", "Febrer", "Març", "Abril", "Maig", "Juny", "Juliol", "Agost", "Setembre", "Octubre", "Novembre", "Desembre"]
};

flatpickr.l10ns.cat.ordinal = function (nth) {
	var s = nth % 100;
	if (s > 3 && s < 21) return "è";
	switch (s % 10) {
		case 1:
			return "r";
		case 2:
			return "n";
		case 3:
			return "r";
		case 4:
			return "t";
		default:
			return "è";
	}
};

flatpickr.l10ns.cat.firstDayOfWeek = 1;

if (typeof module !== "undefined") module.exports = flatpickr.l10ns;