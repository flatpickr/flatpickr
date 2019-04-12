import { Plugin } from "../../types/options";
import { Instance } from "../../types/instance";
import { monthToStr } from "../../utils/formatting";

export interface Config {
  shorthand: boolean;
}

const defaultConfig: Config = {
  shorthand: false,
};

function monthDropdownPlugin(pluginConfig?: Partial<Config>): Plugin {
  const config = { ...defaultConfig, ...pluginConfig };
  const self = { monthsDropdownContainer: null as null | HTMLSelectElement };

  return (fp: Instance) => {
    function clearUnnecessaryDOMElements() {
      fp.monthElements.forEach(element => {
        if (!element.classList.contains("cur-month")) {
          return;
        }

        element.style.display = "none";
      });
    }

    function buildSelector() {
      const shouldBuildMonth = function(month: number): boolean {
        if (
          fp.config.minDate !== undefined &&
          fp.currentYear === fp.config.minDate.getFullYear() &&
          month < fp.config.minDate.getMonth()
        ) {
          return false;
        }

        return !(
          fp.config.maxDate !== undefined &&
          fp.currentYear === fp.config.maxDate.getFullYear() &&
          month > fp.config.maxDate.getMonth()
        );
      };

      const currentMonthContainer = fp.monthNav.querySelector(
        ".flatpickr-current-month"
      );
      const currentYearElement = fp.yearElements.find(element => {
        return element.classList.contains("cur-year");
      });

      if (
        !currentMonthContainer ||
        !currentYearElement ||
        !currentYearElement.parentNode
      )
        return;

      self.monthsDropdownContainer = fp._createElement<HTMLSelectElement>(
        "select",
        "flatpickr-monthDropdown-months"
      );

      self.monthsDropdownContainer.style.backgroundColor = getComputedStyle(
        fp.calendarContainer
      ).backgroundColor;

      self.monthsDropdownContainer.tabIndex = -1;

      for (let i = 0; i < 12; i++) {
        if (!shouldBuildMonth(i)) continue;

        const month = fp._createElement<HTMLOptionElement>(
          "option",
          "flatpickr-monthDropdown-month"
        );

        month.value = new Date(fp.currentYear, i).getMonth().toString();
        month.textContent = monthToStr(i, config.shorthand, fp.l10n);
        month.tabIndex = -1;

        if (fp.currentMonth === i) {
          month.selected = true;
        }

        self.monthsDropdownContainer.appendChild(month);
      }

      self.monthsDropdownContainer.addEventListener("change", changeMonth);

      currentMonthContainer.insertBefore(
        self.monthsDropdownContainer,
        currentYearElement.parentNode
      );
    }

    function markMonthAsSelected() {
      const currentlySelected = self.monthsDropdownContainer!.querySelector(
        ".flatpickr-monthDropdown-month:checked"
      ) as HTMLOptionElement;

      const monthToSelect = self.monthsDropdownContainer!.querySelector(
        `.flatpickr-monthDropdown-month[value="${fp.currentMonth}"]`
      ) as HTMLOptionElement;

      if (currentlySelected) {
        currentlySelected.selected = false;
      }

      if (monthToSelect) {
        monthToSelect.selected = true;
      }
    }

    function rebuildSelector() {
      if (self.monthsDropdownContainer) {
        self.monthsDropdownContainer.parentNode!.removeChild(
          self.monthsDropdownContainer
        );
      }

      buildSelector();
    }

    function addListeners() {}

    function changeMonth(e: Event) {
      const target = e.target as HTMLSelectElement;
      const selectedMonth = parseInt(target.value, 10);

      fp.changeMonth(selectedMonth - fp.currentMonth);
    }

    function destroyPluginInstance() {}

    return {
      onParseConfig() {},
      onValueUpdate: markMonthAsSelected,
      onReady: [
        clearUnnecessaryDOMElements,
        buildSelector,
        addListeners,
        () => {
          fp.loadedPlugins.push("monthSelect");
        },
      ],
      onMonthChange: markMonthAsSelected,
      onYearChange: rebuildSelector,
      onDestroy: destroyPluginInstance,
    };
  };
}

export default monthDropdownPlugin;
