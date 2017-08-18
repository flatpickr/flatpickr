function recommendedDaysPlugin(pluginConfig) {
	return function (fp) {
		function highlightReccomendedDays() {
			var reccomendedDays = fp.config.reccomendedDays;
			var days = fp.days.childNodes;
			for (var i = days.length; i--;) {
				var date = days[i].dateObj;
				for (var j = reccomendedDays.length; j--;) {
					if(date.getTime() == reccomendedDays[j].getTime()) days[i].classList.add("recommended");
				}
			}
		}
		function parseReccomendedDays() {
			var reccomendedDays = this.instanceConfig.reccomendedDays;
			for(var i = reccomendedDays.length; i--;){
				reccomendedDays[i] = fp.parseDate(reccomendedDays[i], "m/d/Y", true);
			}
			fp.config.reccomendedDays = reccomendedDays;
		}

		return {
			onChange: highlightReccomendedDays,
			onMonthChange: function onMonthChange() {
				return fp._.afterDayAnim(highlightReccomendedDays);
			},
			onParseConfig: parseReccomendedDays,
			onReady: [highlightReccomendedDays]
		};
	};
}

if (typeof module !== "undefined") module.exports = recommendedDaysPlugin;
