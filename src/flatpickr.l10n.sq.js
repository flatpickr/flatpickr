/* Albanian locals for flatpickr */
var Flatpickr = Flatpickr||{l10n: {}};

Flatpickr.l10n.weekdays = {
	shorthand: ['Di', 'Hë', 'Ma', 'Më', 'En', 'Pr', 'Sh'],
	longhand: ['E Diel', 'E Hënë', 'E Martë', 'E Mërkurë', 'E Enjte', 'E Premte', 'E Shtunë']
};

Flatpickr.l10n.months = {
	shorthand: ['Jan', 'Shk', 'Mar', 'Pri', 'Maj', 'Qer', 'Kor', 'Gus', 'Sht', 'Tet', 'Nën', 'Dhj'],
	longhand: ['Janar', 'Shkurt', 'Mars', 'Prill', 'Maj', 'Qershor', 'Korrik', 'Gusht', 'Shtator', 'Tetor', 'Nëntor', 'Dhjetor']
};
if (typeof module !== "undefined") {
	module.exports = Flatpickr.l10n;
}
