/* Slovak locals for flatpickr */
var flatpickr = flatpickr || { l10ns: {} };
flatpickr.l10ns.sk = {};

flatpickr.l10ns.sk.weekdays = {
	shorthand: ["Ned", "Pon", "Ut", "Str", "Štv", "Pia", "Sob"],
	longhand: ["Nedeľa", "Pondelok", "Utorok", "Streda", "Štvrtok", "Piatok", "Sobota"]
};

flatpickr.l10ns.sk.months = {
	shorthand: ["Jan", "Feb", "Mar", "Apr", "Máj", "Jún", "Júl", "Aug", "Sep", "Okt", "Nov", "Dec"],
	longhand: ["Január", "Február", "Marec", "Apríl", "Máj", "Jún", "Júl", "August", "September", "Október", "November", "December"]
};

flatpickr.l10ns.sk.firstDayOfWeek = 1;
flatpickr.l10ns.sk.rangeSeparator = " do ";
flatpickr.l10ns.sk.ordinal = function () {
	return ".";
};

if (typeof module !== "undefined") module.exports = flatpickr.l10ns;