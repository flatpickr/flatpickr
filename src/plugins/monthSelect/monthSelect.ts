import { Plugin } from "../../types/options";
import { Instance } from "../../types/instance";
import { monthToStr } from "../../utils/formatting";

export interface Config {
  shorthand: boolean;
  dateFormat: string;
  altFormat: string;
}

export type MonthElement = HTMLSpanElement & { dateObj: Date; $i: number };

const defaultConfig: Config = {
  shorthand: false,
  dateFormat: "F Y",
  altFormat: "F Y",
};

function monthSelectPlugin(pluginConfig: Config): Plugin {
  const config = { ...defaultConfig, ...pluginConfig };

  return function(fp: Instance) {
    fp.config.dateFormat = config.dateFormat;
    fp.config.altFormat = config.altFormat;

    function clearUnnecessaryDOMElements(): void {
      if (!fp.rContainer || !fp.daysContainer || !fp.weekdayContainer) return;

      fp.rContainer.removeChild(fp.daysContainer);
      fp.rContainer.removeChild(fp.weekdayContainer);

      fp.monthElements.forEach(element => {
        if (!element.parentNode) return;

        element.parentNode.removeChild(element);
      });
    }

    function addListeners() {
      fp.prevMonthNav.addEventListener("click", () => {
        fp.currentYear -= 1;
        selectYear();
      });

      fp.nextMonthNav.addEventListener("mousedown", () => {
        fp.currentYear += 1;
        selectYear();
      });
    }

    function addMonths() {
      if (!fp.rContainer) return;

      let monthsContainer = fp._createElement<HTMLDivElement>(
        "div",
        "flatpickr-monthSelect-months"
      );

      monthsContainer.tabIndex = -1;

      for (let i = 0; i < 12; i++) {
        const month = fp._createElement<MonthElement>(
          "span",
          "flatpickr-monthSelect-month"
        );
        month.dateObj = new Date(fp.currentYear, i);
        month.$i = i;
        month.textContent = monthToStr(i, config.shorthand === true, fp.l10n);
        month.tabIndex = -1;
        month.addEventListener("click", selectMonth);
        monthsContainer.appendChild(month);
      }

      fp.rContainer.appendChild(monthsContainer);
    }

    function setCurrentlySelected() {
      if (!fp.rContainer) return;

      const currentlySelected = fp.rContainer.querySelectorAll(
        ".flatpickr-monthSelect-month.selected"
      );

      currentlySelected.forEach(month => {
        month.classList.remove("selected");
      });

      const month = fp.rContainer.querySelector(
        `.flatpickr-monthSelect-month:nth-child(${fp.currentMonth + 1})`
      );

      if (month) {
        month.classList.add("selected");
      }
    }

    function selectYear() {
      let selectedDate = fp.selectedDates[0];
      selectedDate.setFullYear(fp.currentYear);

      fp.setDate(selectedDate, true);
    }

    function selectMonth(e: any) {
      e.preventDefault();
      e.stopPropagation();

      e.target.classList.add("selected");

      const selectedDate = new Date(e.target.dateObj);
      selectedDate.setFullYear(fp.currentYear);
      fp.currentMonth = selectedDate.getMonth();

      fp.setDate(selectedDate, true);

      setCurrentlySelected();
    }

    return {
      onParseConfig: function onParseConfig() {
        fp.config.mode = "single";
        fp.config.enableTime = false;
      },
      onValueUpdate: setCurrentlySelected,
      onReady: [
        clearUnnecessaryDOMElements,
        addListeners,
        addMonths,
        setCurrentlySelected,
      ],
    };
  };
}

export default monthSelectPlugin;
