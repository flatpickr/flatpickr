var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function confirmIconPlugin(pluginConfig) {
	var defaultConfig = {
		confirmIcon: "<svg version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' width='17' height='17' viewBox='0 0 17 17'> <g> </g> <path d='M15.418 1.774l-8.833 13.485-4.918-4.386 0.666-0.746 4.051 3.614 8.198-12.515 0.836 0.548z' fill='#000000' /> </svg>",
		confirmText: "OK ",
		showAlways: false
	};

	var config = _extends({}, defaultConfig, pluginConfig || {});

	return function (fp) {
		fp.confirmContainer = fp._createElement("div", "flatpickr-confirm", config.confirmText);
		fp.confirmContainer.innerHTML += config.confirmIcon;

		fp.confirmContainer.addEventListener("click", fp.close);

		var hooks = {
			onReady: function onReady() {
				fp.calendarContainer.appendChild(fp.confirmContainer);
			}
		};

		if (config.showAlways) fp.confirmContainer.classList.add("visible");else hooks.onChange = function (dateObj, dateStr) {
			if (dateStr) return fp.confirmContainer.classList.add("visible");
			fp.confirmContainer.classList.remove("visible");
		};

		return hooks;
	};
}

if (typeof module !== "undefined") module.exports = confirmIconPlugin;