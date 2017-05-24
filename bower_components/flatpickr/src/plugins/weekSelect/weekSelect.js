function weekSelectPlugin(pluginConfig) {
	return function(fp) {
		function onDayHover(event){
			if (!event.target.classList.contains("flatpickr-day"))
				return;

			const days = event.target.parentNode.childNodes;
			const dayIndex = event.target.$i;
			const weekStartDay = days[7 * Math.floor(dayIndex / 7)].dateObj;
			const weekEndDay = days[7 * Math.ceil(dayIndex / 7) - 1].dateObj;

			for(let i = days.length; i--;) {
				const date = days[i].dateObj;
				if (date > weekEndDay || date < weekStartDay)
					days[i].classList.remove("inRange");
				else
					days[i].classList.add("inRange");
			}
		}

		function highlightWeek(){
			if (fp.selectedDateElem) {
				fp.weekStartDay = fp.days.childNodes[
          7 * Math.floor(fp.selectedDateElem.$i / 7)
        ].dateObj;
				fp.weekEndDay = fp.days.childNodes[
          7 * Math.ceil(fp.selectedDateElem.$i / 7) - 1
        ].dateObj;
			}
			const days = fp.days.childNodes;
			for(let i = days.length; i--;) {
				const date = days[i].dateObj;
				if (date >= fp.weekStartDay && date <= fp.weekEndDay)
					days[i].classList.add("week", "selected");
			}
		}

		function clearHover() {
			const days = fp.days.childNodes;
			for(let i = days.length; i--;)
				days[i].classList.remove("inRange");
		}

		function onReady(){
			fp.days.parentNode.addEventListener("mouseover", onDayHover);
		}

		return {
			onChange: highlightWeek,
			onMonthChange: () => fp._.afterDayAnim(highlightWeek),
			onClose: clearHover,
			onParseConfig: function() {
				fp.config.mode = "single";
				fp.config.enableTime = false;
				fp.config.dateFormat = "\\W\\e\\e\\k #W, Y";
			},
			onReady: [onReady, highlightWeek]
		};
	}
}

if (typeof module !== "undefined")
	module.exports = weekSelectPlugin;
