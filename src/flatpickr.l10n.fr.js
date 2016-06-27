/* French locals for flatpickr */

flatpickr.init.prototype.l10n.weekdays = {
	shorthand: ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'],
	longhand: ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi']
};

flatpickr.init.prototype.l10n.months = {
	shorthand: ['Janv', 'Févr', 'Mars', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sept', 'Oct', 'Nov', 'Déc'],
	longhand: ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre']
};

flatpickr.init.prototype.l10n.ordinal = (nth) => {
	if (nth > 1) {
		return "ème";
	}

	return "er";
};
