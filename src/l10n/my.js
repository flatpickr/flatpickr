/* Burmese locals for flatpickr */
var Flatpickr = Flatpickr || {l10ns: {}};
Flatpickr.l10ns.my = {};

Flatpickr.l10ns.my.weekdays = {
	shorthand: ["နွေ", "လာ", "ဂါ", "ဟူး", "ကြာ", "သော", "နေ"],
	longhand: ["တနင်္ဂနွေ", "တနင်္လာ", "အင်္ဂါ", "ဗုဒ္ဓဟူး", "ကြာသပတေး", "သောကြာ", "စနေ"]
};

Flatpickr.l10ns.my.months = {
	shorthand: ["ဇန်", "ဖေ", "မတ်", "ပြီ", "မေ", "ဇွန်", "လိုင်", "သြ", "စက်", "အောက်", "နို", "ဒီ"],
	longhand: ["ဇန်နဝါရီ", "ဖေဖော်ဝါရီ", "မတ်", "ဧပြီ", "မေ", "ဇွန်", "ဇူလိုင်", "သြဂုတ်", "စက်တင်ဘာ", "အောက်တိုဘာ", "နိုဝင်ဘာ", "ဒီဇင်ဘာ"]
};

Flatpickr.l10ns.my.firstDayOfWeek = 1;

Flatpickr.l10ns.my.ordinal = () => {
	return "";
};
if (typeof module !== "undefined") 
	module.exports = Flatpickr.l10ns;

