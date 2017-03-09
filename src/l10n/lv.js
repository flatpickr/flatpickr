/* Latvian locals for flatpickr */
var Flatpickr = Flatpickr || { l10ns: {} };
Flatpickr.l10ns.lv = {};

Flatpickr.l10ns.lv.firstDayOfWeek = 1;

Flatpickr.l10ns.lv.weekdays = {
	shorthand: ['Sv', 'P', 'Ot', 'Tr', 'Ce', 'Pk', 'Se'],
	longhand: ['Svētdiena', 'Pirmdiena', 'Otrdiena', 'Trešdiena', 'Ceturtdiena', 'Piektdiena', 'Sestdiena']
};

Flatpickr.l10ns.lv.months = {
  shorthand: ['Jan', 'Feb', 'Mar', 'Mai', 'Apr', 'Jūn', 'Jūl', 'Aug', 'Sep', 'Okt', 'Nov', 'Dec'],
  longhand: ['Janvāris', 'Februāris', 'Marts', 'Aprīlis', 'Maijs', 'Jūnijs', 'Jūlijs', 'Augusts', 'Septembris', 'Oktobris', 'Novembris', 'Decembris']
};
if (typeof module !== "undefined") {
  module.exports = Flatpickr.l10ns;
}