function rangePlugin(config = {}) {
	return function(fp) {
		let dateFormat;

		const createSecondInput = () => {
			if (config.input) {
				fp.secondInput = config.input instanceof Element
					? config.input
					: window.document.querySelector(config.input)
			}

			else {
				fp.secondInput = fp._input.cloneNode();
				fp.secondInput.removeAttribute("id");
				fp.secondInput._flatpickr = null;
			}

			fp.secondInput.setAttribute("data-fp-omit", "");

			fp._bind(fp.secondInput, ["focus", "click"], e => {
				fp.open(e, fp.secondInput);
				if (fp.selectedDates[1]) {
					fp.latestSelectedDateObj = fp.selectedDates[1];
					fp._setHoursFromDate(fp.selectedDates[1]);
					fp.jumpToDate(fp.selectedDates[1]);
				}

				[fp._firstInputFocused, fp._secondInputFocused] = [false, true];
			});

			fp._bind(fp.secondInput, "blur", e => {
				fp.isOpen = false
			});

			fp._bind(fp.secondInput, "keydown", e => {
				if (e.key === "Enter") {
					fp.setDate([fp.selectedDates[0], fp.secondInput.value], true, dateFormat);
					fp.secondInput.click();

				}
			});
			if (!config.input)
				fp._input.parentNode.insertBefore(fp.secondInput, fp._input.nextSibling);
		}

		return {
			onParseConfig () {
				fp.config.mode = "range";
				fp.config.allowInput = true;
				dateFormat = fp.config.altInput ? fp.config.altFormat : fp.config.dateFormat;
			},

			onReady (){
				createSecondInput();
				fp.config.ignoredFocusElements.push(fp.secondInput);
				fp._input.removeAttribute("readonly");
				fp.secondInput.removeAttribute("readonly");

				fp._bind(fp._input, "focus", e => {
					fp.latestSelectedDateObj = fp.selectedDates[0];
					fp._setHoursFromDate(fp.selectedDates[0]);
					[fp._firstInputFocused, fp._secondInputFocused] = [true, false];
					fp.jumpToDate(fp.selectedDates[0]);
				});

				fp._bind(fp._input, "keydown", e => {
					if (e.key === "Enter")
						fp.setDate([fp._input.value, fp.selectedDates[1]], true, dateFormat);
				});

				fp.setDate(fp.selectedDates)
			},

			onChange () {
				if (!fp.selectedDates.length) {
					setTimeout(() => {
						if (fp.selectedDates.length)
							return;

						fp.secondInput.value = "";
						fp._prevDates = [];
					}, 10)
				}
			},

			onDestroy () {
				if (!config.input)
					fp.secondInput.parentNode.removeChild(fp.secondInput);
				delete fp._prevDates;
				delete fp._firstInputFocused;
				delete fp._secondInputFocused;
			},

			onValueUpdate (selDates, dateStr) {
				if (!fp.secondInput)
					return;

				fp._prevDates = !fp._prevDates || (selDates.length >= fp._prevDates.length)
					? selDates.map(d => d) // copy
					: fp._prevDates;

				if (fp._prevDates.length > selDates.length) {
					const newSelectedDate = selDates[0];

					if (fp._firstInputFocused)
						fp.setDate([newSelectedDate, fp._prevDates[1]]);

					else if (fp._secondInputFocused)
						fp.setDate([fp._prevDates[0], newSelectedDate]);
				}

				[fp._input.value = "", fp.secondInput.value = ""] = fp.selectedDates.map(
					d => fp.formatDate(d, dateFormat)
				);
			}
		}
	}
}

if (typeof module !== "undefined")
	module.exports = rangePlugin;