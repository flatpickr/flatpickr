/* Italian locals for flatpickr */
var Flatpickr = Flatpickr||{l10n: {}};

Flatpickr.l10n.weekdays = {
	shorthand: ['Dom', 'Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab'],
	longhand: ['Domenica', 'Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato']
};

Flatpickr.l10n.months = {
	shorthand: ['Gen', 'Feb', 'Mar', 'Apr', 'Mag', 'Giu', 'Lug', 'Ago', 'Set', 'Ott', 'Nov', 'Dic'],
	longhand: ['Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno', 'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre']
};

Flatpickr.l10n.firstDayOfWeek = 1;

Flatpickr.l10n.ordinal = '°';

Flatpickr.l10n.weekAbbreviation = 'Se';

Flatpickr.l10n.scrollTitle = 'Scrolla per aumentare';

Flatpickr.l10n.toggleTitle = 'Clicca per cambiare';

if (typeof module !== "undefined") {
	module.exports = Flatpickr.l10n;
}
