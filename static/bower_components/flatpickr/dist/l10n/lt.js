/* Lithuanian locals for flatpickr */
var flatpickr = flatpickr || { l10ns: {} };
flatpickr.l10ns.lt = {};

flatpickr.l10ns.lt.weekdays = {
	shorthand: ["S", "Pr", "A", "T", "K", "Pn", "Š"],
	longhand: ["Sekmadienis", "Pirmadienis", "Antradienis", "Trečiadienis", "Ketvirtadienis", "Penktadienis", "Šeštadienis"]
};

flatpickr.l10ns.lt.months = {
	shorthand: ["Sau", "Vas", "Kov", "Bal", "Geg", "Bir", "Lie", "Rgp", "Rgs", "Spl", "Lap", "Grd"],
	longhand: ["Sausis", "Vasaris", "Kovas", "Balandis", "Gegužė", "Birželis", "Liepa", "Rugpjūtis", "Rugsėjis", "Spalis", "Lapkritis", "Gruodis"]
};

flatpickr.l10ns.lt.firstDayOfWeek = 1;

flatpickr.l10ns.lt.ordinal = function () {
	return "-a";
};

flatpickr.l10ns.lt.weekAbbreviation = "Sav";
flatpickr.l10ns.lt.scrollTitle = "Keisti laiką pelės rateliu";
flatpickr.l10ns.lt.toggleTitle = "Perjungti laiko formatą";

if (typeof module !== "undefined") module.exports = flatpickr.l10ns;