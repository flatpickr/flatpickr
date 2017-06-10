var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

function rangePlugin() {
	var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

	return function (fp) {
		var dateFormat = void 0;

		var createSecondInput = function createSecondInput() {
			if (config.input) {
				fp.secondInput = config.input instanceof Element ? config.input : window.document.querySelector(config.input);
			} else {
				fp.secondInput = fp._input.cloneNode();
				fp.secondInput.removeAttribute("id");
				fp.secondInput._flatpickr = null;
			}

			fp.secondInput.setAttribute("data-fp-omit", "");

			fp._bind(fp.secondInput, ["focus", "click"], function (e) {
				fp.open(e, fp.secondInput);
				if (fp.selectedDates[1]) {
					fp.latestSelectedDateObj = fp.selectedDates[1];
					fp._setHoursFromDate(fp.selectedDates[1]);
					fp.jumpToDate(fp.selectedDates[1]);
				}

				var _ref = [false, true];
				fp._firstInputFocused = _ref[0];
				fp._secondInputFocused = _ref[1];
			});

			fp._bind(fp.secondInput, "blur", function (e) {
				fp.isOpen = false;
			});

			fp._bind(fp.secondInput, "keydown", function (e) {
				if (e.key === "Enter") {
					fp.setDate([fp.selectedDates[0], fp.secondInput.value], true, dateFormat);
					fp.secondInput.click();
				}
			});
			if (!config.input) fp._input.parentNode.insertBefore(fp.secondInput, fp._input.nextSibling);
		};

		return {
			onParseConfig: function onParseConfig() {
				fp.config.mode = "range";
				fp.config.allowInput = true;
				dateFormat = fp.config.altInput ? fp.config.altFormat : fp.config.dateFormat;
			},
			onReady: function onReady() {
				createSecondInput();
				fp.config.ignoredFocusElements.push(fp.secondInput);
				fp._input.removeAttribute("readonly");
				fp.secondInput.removeAttribute("readonly");

				fp._bind(fp._input, "focus", function (e) {
					fp.latestSelectedDateObj = fp.selectedDates[0];
					fp._setHoursFromDate(fp.selectedDates[0]);
					var _ref2 = [true, false];
					fp._firstInputFocused = _ref2[0];
					fp._secondInputFocused = _ref2[1];

					fp.jumpToDate(fp.selectedDates[0]);
				});

				fp._bind(fp._input, "keydown", function (e) {
					if (e.key === "Enter") fp.setDate([fp._input.value, fp.selectedDates[1]], true, dateFormat);
				});

				fp.setDate(fp.selectedDates);
			},
			onChange: function onChange() {
				if (!fp.selectedDates.length) {
					setTimeout(function () {
						if (fp.selectedDates.length) return;

						fp.secondInput.value = "";
						fp._prevDates = [];
					}, 10);
				}
			},
			onDestroy: function onDestroy() {
				if (!config.input) fp.secondInput.parentNode.removeChild(fp.secondInput);
				delete fp._prevDates;
				delete fp._firstInputFocused;
				delete fp._secondInputFocused;
			},
			onValueUpdate: function onValueUpdate(selDates, dateStr) {
				if (!fp.secondInput) return;

				fp._prevDates = !fp._prevDates || selDates.length >= fp._prevDates.length ? selDates.map(function (d) {
					return d;
				}) // copy
				: fp._prevDates;

				if (fp._prevDates.length > selDates.length) {
					var newSelectedDate = selDates[0];

					if (fp._firstInputFocused) fp.setDate([newSelectedDate, fp._prevDates[1]]);else if (fp._secondInputFocused) fp.setDate([fp._prevDates[0], newSelectedDate]);
				}

				var _fp$selectedDates$map = fp.selectedDates.map(function (d) {
					return fp.formatDate(d, dateFormat);
				});

				var _fp$selectedDates$map2 = _slicedToArray(_fp$selectedDates$map, 2);

				var _fp$selectedDates$map3 = _fp$selectedDates$map2[0];
				fp._input.value = _fp$selectedDates$map3 === undefined ? "" : _fp$selectedDates$map3;
				var _fp$selectedDates$map4 = _fp$selectedDates$map2[1];
				fp.secondInput.value = _fp$selectedDates$map4 === undefined ? "" : _fp$selectedDates$map4;
			}
		};
	};
}

if (typeof module !== "undefined") module.exports = rangePlugin;