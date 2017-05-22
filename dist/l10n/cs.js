/* Czech locals for flatpickr */
var flatpickr = flatpickr || { l10ns: {} };
flatpickr.l10ns.cs = {};

flatpickr.l10ns.cs.weekdays = {
	shorthand: ["Ne", "Po", "Út", "St", "Čt", "Pá", "So"],
	longhand: ["Neděle", "Pondělí", "Úterý", "Středa", "Čtvrtek", "Pátek", "Sobota"]
};

flatpickr.l10ns.cs.months = {
	shorthand: ["Led", "Ún", "Bře", "Dub", "Kvě", "Čer", "Čvc", "Srp", "Zář", "Říj", "Lis", "Pro"],
	longhand: ["Leden", "Únor", "Březen", "Duben", "Květen", "Červen", "Červenec", "Srpen", "Září", "Říjen", "Listopad", "Prosinec"]
};

flatpickr.l10ns.cs.firstDayOfWeek = 1;

flatpickr.l10ns.cs.ordinal = function () {
	return ".";
};
if (typeof module !== "undefined") module.exports = flatpickr.l10ns;