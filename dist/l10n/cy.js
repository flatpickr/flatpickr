/* Welsh locals for flatpickr */
var flatpickr = flatpickr || { l10ns: {} };
flatpickr.l10ns.cy = {};

flatpickr.l10ns.cy.weekdays = {
	shorthand: ["Sul", "Llun", "Maw", "Mer", "Iau", "Gwe", "Sad"],
	longhand: ["Dydd Sul", "Dydd Llun", "Dydd Mawrth", "Dydd Mercher", "Dydd Iau", "Dydd Gwener", "Dydd Sadwrn"]
};

flatpickr.l10ns.cy.months = {
	shorthand: ["Ion", "Chwef", "Maw", "Ebr", "Mai", "Meh", "Gorff", "Awst", "Medi", "Hyd", "Tach", "Rhag"],
	longhand: ["Ionawr", "Chwefror", "Mawrth", "Ebrill", "Mai", "Mehefin", "Gorffennaf", "Awst", "Medi", "Hydref", "Tachwedd", "Rhagfyr"]
};

flatpickr.l10ns.cy.firstDayOfWeek = 1;

flatpickr.l10ns.cy.ordinal = function (nth) {
	if (nth === 1) return "af";

	if (nth === 2) return "ail";

	if (nth === 3 || nth === 4) return "ydd";

	if (nth === 5 || nth === 6) return "ed";

	if (nth >= 7 && nth <= 10 || nth == 12 || nth == 15 || nth == 18 || nth == 20) return "fed";

	if (nth == 11 || nth == 13 || nth == 14 || nth == 16 || nth == 17 || nth == 19) return "eg";

	if (nth >= 21 && nth <= 39) return "ain";

	// Inconclusive.
	return "";
};

if (typeof module !== "undefined") module.exports = flatpickr.l10ns;