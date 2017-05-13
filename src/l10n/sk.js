/* Slovak locals for flatpickr */
var Flatpickr = Flatpickr || { l10ns: {} };
Flatpickr.l10ns.sk = {};

Flatpickr.l10ns.sk.weekdays = {
	shorthand: ["Ned", "Pon", "Ut", "Str", "Štv", "Pia", "Sob"],
	longhand: ["Nedeľa", "Pondelok", "Utorok", "Streda", "Štvrtok", "Piatok", "Sobota"]
};

Flatpickr.l10ns.sk.months = {
	shorthand: ["Jan", "Feb", "Mar", "Apr", "Máj", "Jún", "Júl", "Aug", "Sep", "Okt", "Nov", "Dec"],
	longhand: ["Január", "Február", "Marec", "Apríl", "Máj", "Jún", "Júl", "August", "September", "Október", "November", "December"]
};

Flatpickr.l10ns.sk.firstDayOfWeek = 1;
Flatpickr.l10ns.sk.rangeSeparator = " do ";
Flatpickr.l10ns.sk.ordinal = function () {
	return ".";
};

if (typeof module !== "undefined") module.exports = Flatpickr.l10ns;
