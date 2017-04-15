function weekSelectPlugin(pluginConfig) {
	return function (fp) {
		function onDayHover(event) {
			if (!event.target.classList.contains("flatpickr-day")) return;

			var days = event.target.parentNode.childNodes;
			dayIndex = event.target.$i;
			fp.weekStartDay = days[7 * Math.floor(dayIndex / 7)].dateObj;
			fp.weekEndDay = days[7 * Math.ceil(dayIndex / 7) - 1].dateObj;

			for (var i = days.length; i--;) {
				var date = days[i].dateObj;
				if (date > fp.weekEndDay || date < fp.weekStartDay) days[i].classList.remove("inRange");else days[i].classList.add("inRange");
			}
		}

		function highlightWeek() {
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

			if (fp.selectedDateElem) {
				fp.weekStartDay = fp.days.childNodes[7 * Math.floor(fp.selectedDateElem.$i / 7)].dateObj;
				fp.weekEndDay = fp.days.childNodes[7 * Math.ceil(fp.selectedDateElem.$i / 7) - 1].dateObj;
			}
		}

		return {
			parseDate: parseDate,
			onChange: highlightWeek,
			onMonthChange: function onMonthChange() {
				return fp._.afterDayAnim(highlightWeek);
			},
			onClose: clearHover,
			onParseConfig: function onParseConfig() {
				fp.config.mode = "single";
				fp.config.enableTime = false;
				fp.config.dateFormat = "\\W\\e\\e\\k #W, Y";
			},
			onReady: [onReady, highlightWeek]
		};
	};
}

if (typeof module !== "undefined") module.exports = weekSelectPlugin;