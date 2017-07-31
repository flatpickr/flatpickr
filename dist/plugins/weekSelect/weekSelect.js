function weekSelectPlugin(pluginConfig) {
	return function (fp) {
		function onDayHover(event) {
			if (!event.target.classList.contains("flatpickr-day")) return;

			var days = event.target.parentNode.childNodes;
			var dayIndex = event.target.$i;

			var dayIndSeven = dayIndex / 7;
			var weekStartDay = days[7 * Math.floor(dayIndSeven)].dateObj;
			var weekEndDay = days[7 * Math.ceil(dayIndSeven + 0.01) - 1].dateObj;

			for (var i = days.length; i--;) {
				var date = days[i].dateObj;
				if (date > weekEndDay || date < weekStartDay) days[i].classList.remove("inRange");else days[i].classList.add("inRange");
			}
		}

		function highlightWeek() {
			if (fp.selectedDateElem) {
				fp.weekStartDay = fp.days.childNodes[7 * Math.floor(fp.selectedDateElem.$i / 7)].dateObj;
				fp.weekEndDay = fp.days.childNodes[7 * Math.ceil(fp.selectedDateElem.$i / 7 + 0.01) - 1].dateObj;
			}
			var days = fp.days.childNodes;
			for (var i = days.length; i--;) {
				var date = days[i].dateObj;
				if (date >= fp.weekStartDay && date <= fp.weekEndDay) days[i].classList.add("week", "selected");
			}
		}

		function clearHover() {
			var days = fp.days.childNodes;
			for (var i = days.length; i--;) {
				days[i].classList.remove("inRange");
			}
		}

		function onReady() {
			fp.days.parentNode.addEventListener("mouseover", onDayHover);
		}

		return {
			onChange: highlightWeek,
			onMonthChange: function onMonthChange() {
				return fp._.afterDayAnim(highlightWeek);
			},
			onClose: clearHover,
			onParseConfig: function onParseConfig() {
				fp.config.mode = "single";
				fp.config.enableTime = false;
				fp.config.dateFormat = "\\W\\e\\e\\k #W, Y";
				fp.config.altFormat = "\\W\\e\\e\\k #W, Y";
			},
			onReady: [onReady, highlightWeek]
		};
	};
}

if (typeof module !== "undefined") module.exports = weekSelectPlugin;