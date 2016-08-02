/* Portuguese locals for flatpickr */
var Flatpickr = Flatpickr||{l10n: {}};

Flatpickr.l10n.weekdays = {
	shorthand: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'],
	longhand: ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado']
};

Flatpickr.l10n.months = {
	shorthand: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
	longhand: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']
};
if (typeof module !== "undefined") {
	module.exports = Flatpickr.l10n;
}
