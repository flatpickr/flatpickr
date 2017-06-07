/* Burmese locals for flatpickr */
var flatpickr = flatpickr || { l10ns: {} };
flatpickr.l10ns.my = {};

flatpickr.l10ns.my.weekdays = {
	shorthand: ["နွေ", "လာ", "ဂါ", "ဟူး", "ကြာ", "သော", "နေ"],
	longhand: ["တနင်္ဂနွေ", "တနင်္လာ", "အင်္ဂါ", "ဗုဒ္ဓဟူး", "ကြာသပတေး", "သောကြာ", "စနေ"]
};

flatpickr.l10ns.my.months = {
	shorthand: ["ဇန်", "ဖေ", "မတ်", "ပြီ", "မေ", "ဇွန်", "လိုင်", "သြ", "စက်", "အောက်", "နို", "ဒီ"],
	longhand: ["ဇန်နဝါရီ", "ဖေဖော်ဝါရီ", "မတ်", "ဧပြီ", "မေ", "ဇွန်", "ဇူလိုင်", "သြဂုတ်", "စက်တင်ဘာ", "အောက်တိုဘာ", "နိုဝင်ဘာ", "ဒီဇင်ဘာ"]
};

flatpickr.l10ns.my.firstDayOfWeek = 1;

flatpickr.l10ns.my.ordinal = function () {
	return "";
};
if (typeof module !== "undefined") module.exports = flatpickr.l10ns;