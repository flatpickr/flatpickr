import { Instance } from "types/instance";

interface Config {
  input?: string | HTMLInputElement;
}

declare global {
  interface Window {
    rangePlugin: (config?: Config) => void;
  }
}

function rangePlugin(config: Config = {}) {
  return function(fp: Instance) {
    let dateFormat = "",
      secondInput: HTMLInputElement,
      _firstInputFocused: boolean,
      _secondInputFocused: boolean,
      _prevDates: Date[];

    const createSecondInput = () => {
      if (config.input) {
        secondInput =
          config.input instanceof Element
            ? config.input
            : window.document.querySelector(config.input) as HTMLInputElement;
      } else {
        secondInput = fp._input.cloneNode() as HTMLInputElement;
        secondInput.removeAttribute("id");
        secondInput._flatpickr = undefined;
      }

      secondInput.setAttribute("data-fp-omit", "");

      fp._bind(secondInput, ["focus", "click"], (e: Event) => {
        if (fp.selectedDates[1]) {
          fp.latestSelectedDateObj = fp.selectedDates[1];
          fp._setHoursFromDate(fp.selectedDates[1]);
          fp.jumpToDate(fp.selectedDates[1]);
        }
        fp.open(e, secondInput);
        [_firstInputFocused, _secondInputFocused] = [false, true];
      });

      fp._bind(fp._input, "focus", () => {
        if (fp.isOpen) fp.calendarContainer.classList.remove("open");
        setTimeout(fp.open, 0);
      });

      fp._bind(secondInput, "keydown", (e: KeyboardEvent) => {
        if ((e as KeyboardEvent).key === "Enter") {
          fp.setDate(
            [fp.selectedDates[0], secondInput.value],
            true,
            dateFormat
          );
          secondInput.click();
        }
      });
      if (!config.input)
        fp._input.parentNode &&
          fp._input.parentNode.insertBefore(secondInput, fp._input.nextSibling);
    };

    const plugin = {
      onParseConfig() {
        fp.config.mode = "range";
        fp.config.allowInput = true;
        dateFormat = fp.config.altInput
          ? fp.config.altFormat
          : fp.config.dateFormat;
      },

      onReady() {
        createSecondInput();
        fp.config.ignoredFocusElements.push(secondInput);
        fp._input.removeAttribute("readonly");
        secondInput.removeAttribute("readonly");

        fp._bind(fp._input, "focus", () => {
          fp.latestSelectedDateObj = fp.selectedDates[0];
          fp._setHoursFromDate(fp.selectedDates[0]);
          [_firstInputFocused, _secondInputFocused] = [true, false];
          fp.jumpToDate(fp.selectedDates[0]);
        });

        fp._bind(fp._input, "keydown", (e: KeyboardEvent) => {
          if ((e as KeyboardEvent).key === "Enter")
            fp.setDate(
              [fp._input.value, fp.selectedDates[1]],
              true,
              dateFormat
            );
        });

        fp.setDate(fp.selectedDates);
        plugin.onValueUpdate(fp.selectedDates);
      },

      onChange() {
        if (!fp.selectedDates.length) {
          setTimeout(() => {
            if (fp.selectedDates.length) return;

            secondInput.value = "";
            _prevDates = [];
          }, 10);
        }
      },

      onDestroy() {
        if (!config.input)
          secondInput.parentNode &&
            secondInput.parentNode.removeChild(secondInput);
      },

      onValueUpdate(selDates: Date[]) {
        if (!secondInput) return;

        _prevDates =
          !_prevDates || selDates.length >= _prevDates.length
            ? [...selDates]
            : _prevDates;

        if (_prevDates.length > selDates.length) {
          const newSelectedDate = selDates[0];
          const newDates = _secondInputFocused
            ? [_prevDates[0], newSelectedDate]
            : [newSelectedDate, _prevDates[1]];

          fp.setDate(newDates, false);
          _prevDates = [...newDates];
        }

        [
          fp._input.value = "",
          secondInput.value = "",
        ] = fp.selectedDates.map(d => fp.formatDate(d, dateFormat));
      },
    };

    return plugin;
  };
}

export default rangePlugin;
