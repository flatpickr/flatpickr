/* Serbian locals for flatpickr */
var Flatpickr = Flatpickr||{l10ns: {}};
Flatpickr.l10ns.sr = {};

Flatpickr.l10ns.sr.weekdays = {
    shorthand: ['Ned', 'Pon', 'Uto', 'Sre', 'Čet', 'Pet', 'Sub', 'Ned'],
    longhand: ['Nedelja','Ponedeljak', 'Utorak', 'Sreda', 'Četvrtak', 'Petak', 'Subota', 'Nedelja']
};

Flatpickr.l10ns.sr.months = {
    shorthand: ['Jan', 'Feb', 'Mar', 'Apr', 'Maj', 'Jun', 'Jul', 'Avg', 'Sep', 'Okt', 'Nov', 'Dec'],
    longhand: ['Januar', 'Februar', 'Mart', 'April', 'Maj', 'Jun', 'Jul', 'Avgust', 'Septembar', 'Oktobar', 'Novembar', 'Decembar']
};

Flatpickr.l10ns.sr.firstDayOfWeek = 1;
Flatpickr.l10ns.sr.weekAbbreviation = 'Ned.';
Flatpickr.l10ns.sr.rangeSeparator = ' do ';

if (typeof module !== "undefined") {
    module.exports = Flatpickr.l10ns;
}