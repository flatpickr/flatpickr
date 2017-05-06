/* Lithuanian locals for flatpickr */
var Flatpickr = Flatpickr || { l10ns: {} };
Flatpickr.l10ns.lt = {};

Flatpickr.l10ns.lt.weekdays = {
	shorthand: ["S", "Pr", "A", "T", "K", "Pn", "Š"],
	longhand: ["Sekmadienis", "Pirmadienis", "Antradienis", "Trečiadienis", "Ketvirtadienis", "Penktadienis", "Šeštadienis"]
};

Flatpickr.l10ns.lt.months = {
	shorthand: ["Sau", "Vas", "Kov", "Bal", "Geg", "Bir", "Lie", "Rgp", "Rgs", "Spl", "Lap", "Grd"],
	longhand: ["Sausis", "Vasaris", "Kovas", "Balandis", "Gegužė", "Birželis", "Liepa", "Rugpjūtis", "Rugsėjis", "Spalis", "Lapkritis", "Gruodis"]
};

Flatpickr.l10ns.lt.firstDayOfWeek = 1;

Flatpickr.l10ns.lt.ordinal = function () {
	return "-a";
};

Flatpickr.l10ns.lt.weekAbbreviation = "Sav";
Flatpickr.l10ns.lt.scrollTitle = "Keisti laiką pelės rateliu";
Flatpickr.l10ns.lt.toggleTitle = "Perjungti laiko formatą";

if (typeof module !== "undefined") module.exports = Flatpickr.l10ns;