function confirmIconPlugin(pluginConfig) {
	const defaultConfig = {
		confirmIcon: "<svg version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' width='17' height='17' viewBox='0 0 17 17'> <g> </g> <path d='M15.418 1.774l-8.833 13.485-4.918-4.386 0.666-0.746 4.051 3.614 8.198-12.515 0.836 0.548z' fill='#000000' /> </svg>",
		confirmText: "OK ",
		showAlways: false
	};

	const config = Object.assign({}, defaultConfig, pluginConfig || {});

	return function(fp) {
		fp.confirmContainer = fp._createElement("div", "flatpickr-confirm", config.confirmText);
		fp.confirmContainer.innerHTML += config.confirmIcon;

		fp.confirmContainer.addEventListener("click", fp.close);

		const hooks = {
			onReady () {
				fp.calendarContainer.appendChild(fp.confirmContainer);
			}
		};

		if (config.showAlways)
			fp.confirmContainer.classList.add("visible");

		else
			hooks.onChange = function(dateObj, dateStr) {
				if(dateStr)
					return fp.confirmContainer.classList.add("visible");
				fp.confirmContainer.classList.remove("visible");
			}

		return hooks;
	}
}

if (typeof module !== "undefined")
	module.exports = confirmIconPlugin;
