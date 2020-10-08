import { Plugin } from "../../types/options";
import { Instance, DayElement } from "../../types/instance";
import { monthToStr } from "../../utils/formatting";
import { clearNode, getEventTarget } from "../../utils/dom";

export interface Config {
  shorthand: boolean;
  dateFormat: string;
  altFormat: string;
  theme: string;
  _stubbedCurrentMonth?: number;
}

export interface ElementDate extends Element {
  dateObj: Date;
}

export type MonthElement = HTMLSpanElement & { dateObj: Date; $i: number };

const defaultConfig: Config = {
  shorthand: false,
  dateFormat: "F Y",
  altFormat: "F Y",
  theme: "light",
};

function monthSelectPlugin(pluginConfig?: Partial<Config>): Plugin {
  const config = { ...defaultConfig, ...pluginConfig };

  return (fp: Instance) => {
    fp.config.dateFormat = config.dateFormat;
    fp.config.altFormat = config.altFormat;
    const self = { monthsContainer: null as null | HTMLDivElement };

    function clearUnnecessaryDOMElements(): void {
      if (!fp.rContainer) return;

      clearNode(fp.rContainer);

      for (let index = 0; index < fp.monthElements.length; index++) {
        const element = fp.monthElements[index];
        if (!element.parentNode) continue;

        element.parentNode.removeChild(element);
      }
    }

    function build() {
      if (!fp.rContainer) return;

      self.monthsContainer = fp._createElement<HTMLDivElement>(
        "div",
        "flatpickr-monthSelect-months"
      );

      self.monthsContainer.tabIndex = -1;

      buildMonths();

      fp.rContainer.appendChild(self.monthsContainer);

      fp.calendarContainer.classList.add(
        `flatpickr-monthSelect-theme-${config.theme}`
      );
    }

    function buildMonths() {
      if (!self.monthsContainer) return;

      clearNode(self.monthsContainer);

      const frag = document.createDocumentFragment();

      for (let i = 0; i < 12; i++) {
        const month = fp.createDay(
          "flatpickr-monthSelect-month",
          new Date(fp.currentYear, i),
          0,
          i
        );
        if (
          month.dateObj.getMonth() === new Date().getMonth() &&
          month.dateObj.getFullYear() === new Date().getFullYear()
        )
          month.classList.add("today");
        month.textContent = monthToStr(i, config.shorthand, fp.l10n);
        month.addEventListener("click", selectMonth);
        frag.appendChild(month);
      }

      self.monthsContainer.appendChild(frag);
    }

    function bindEvents() {
      fp._bind(fp.prevMonthNav, "click", (e) => {
        e.preventDefault();
        e.stopPropagation();

        fp.changeYear(fp.currentYear - 1);
        selectYear();
        buildMonths();
      });

      fp._bind(fp.nextMonthNav, "click", (e) => {
        e.preventDefault();
        e.stopPropagation();

        fp.changeYear(fp.currentYear + 1);
        selectYear();
        buildMonths();
      });

      fp._bind(
        self.monthsContainer as HTMLElement,
        "mouseover",
        (e: MouseEvent) => {
          if (fp.config.mode === "range")
            fp.onMouseOver(
              getEventTarget(e) as DayElement,
              "flatpickr-monthSelect-month"
            );
        }
      );
    }

    function setCurrentlySelected() {
      if (!fp.rContainer) return;
      if (!fp.selectedDates.length) return;

      const currentlySelected = fp.rContainer.querySelectorAll(
        ".flatpickr-monthSelect-month.selected"
      );

      for (let index = 0; index < currentlySelected.length; index++) {
        currentlySelected[index].classList.remove("selected");
      }

      const targetMonth = fp.selectedDates[0].getMonth();
      const month = fp.rContainer.querySelector(
        `.flatpickr-monthSelect-month:nth-child(${targetMonth + 1})`
      );

      if (month) {
        month.classList.add("selected");
      }
    }

    function selectYear() {
      let selectedDate = fp.selectedDates[0];
      if (selectedDate) {
        selectedDate = new Date(selectedDate);
        selectedDate.setFullYear(fp.currentYear);
        if (fp.config.minDate && selectedDate < fp.config.minDate) {
          selectedDate = fp.config.minDate;
        }
        if (fp.config.maxDate && selectedDate > fp.config.maxDate) {
          selectedDate = fp.config.maxDate;
        }
        fp.currentYear = selectedDate.getFullYear();
      }

      fp.currentYearElement.value = String(fp.currentYear);

      if (fp.rContainer) {
        const months: NodeListOf<ElementDate> = fp.rContainer.querySelectorAll(
          ".flatpickr-monthSelect-month"
        );
        months.forEach((month) => {
          month.dateObj.setFullYear(fp.currentYear);
          if (
            (fp.config.minDate && month.dateObj < fp.config.minDate) ||
            (fp.config.maxDate && month.dateObj > fp.config.maxDate)
          ) {
            month.classList.add("flatpickr-disabled");
          } else {
            month.classList.remove("flatpickr-disabled");
          }
        });
      }
      setCurrentlySelected();
    }

    function selectMonth(e: Event) {
      e.preventDefault();
      e.stopPropagation();

      const eventTarget = getEventTarget(e);

      if (!(eventTarget instanceof Element)) return;
      if (eventTarget.classList.contains("flatpickr-disabled")) return;
      if (eventTarget.classList.contains("notAllowed")) return; // necessary??

      setMonth((eventTarget as MonthElement).dateObj);

      if (fp.config.closeOnSelect) {
        const single = fp.config.mode === "single";
        const range =
          fp.config.mode === "range" && fp.selectedDates.length === 2;

        if (single || range) fp.close();
      }
    }

    function setMonth(date: Date) {
      const selectedDate = new Date(
        fp.currentYear,
        date.getMonth(),
        date.getDate()
      );

      switch (fp.config.mode) {
        case "single":
          fp.selectedDates = [selectedDate];

          break;
        case "range":
          if (fp.selectedDates.length === 2) {
            fp.clear(false, false);
            buildMonths();
          }
          fp.selectedDates.push(selectedDate);
          fp.selectedDates.sort((a, b) => a.getTime() - b.getTime());

          break;
      }

      fp.latestSelectedDateObj = selectedDate;
      fp.updateValue();

      setCurrentlySelected();
    }

    const shifts: Record<number, number> = {
      37: -1,
      39: 1,
      40: 3,
      38: -3,
    };

    function onKeyDown(_: any, __: any, ___: any, e: KeyboardEvent) {
      const shouldMove = shifts[e.keyCode] !== undefined;
      if (!shouldMove && e.keyCode !== 13) {
        return;
      }

      if (!fp.rContainer || !self.monthsContainer) return;

      const currentlySelected = fp.rContainer.querySelector(
        ".flatpickr-monthSelect-month.selected"
      ) as HTMLElement;

      let index = Array.prototype.indexOf.call(
        self.monthsContainer.children,
        document.activeElement
      );

      if (index === -1) {
        const target =
          currentlySelected || self.monthsContainer.firstElementChild;
        target.focus();
        index = (target as MonthElement).$i;
      }

      if (shouldMove) {
        (self.monthsContainer.children[
          (12 + index + shifts[e.keyCode]) % 12
        ] as HTMLElement).focus();
      } else if (
        e.keyCode === 13 &&
        self.monthsContainer.contains(document.activeElement)
      ) {
        setMonth((document.activeElement as MonthElement).dateObj);
      }
    }

    function closeHook() {
      if (
        fp.config?.mode === "range" &&
        fp.selectedDates.length === 1
      )
        fp.clear(false);

      if (!fp.selectedDates.length) buildMonths();
    }

    // Help the prev/next year nav honor config.minDate (see 3fa5a69)
    function stubCurrentMonth() {
      config._stubbedCurrentMonth = fp._initialDate.getMonth();

      fp._initialDate.setMonth(0);
      fp.currentMonth = 0;
    }

    function unstubCurrentMonth() {
      if (!config._stubbedCurrentMonth) return;

      fp._initialDate.setMonth(config._stubbedCurrentMonth);
      fp.currentMonth = config._stubbedCurrentMonth;
      delete config._stubbedCurrentMonth;
    }

    function destroyPluginInstance() {
      if (self.monthsContainer !== null) {
        const months = self.monthsContainer.querySelectorAll(
          ".flatpickr-monthSelect-month"
        );

        for (let index = 0; index < months.length; index++) {
          months[index].removeEventListener("click", selectMonth);
        }
      }
    }

    return {
      onParseConfig() {
        fp.config.enableTime = false;
      },
      onValueUpdate: setCurrentlySelected,
      onKeyDown,
      onReady: [
        stubCurrentMonth,
        clearUnnecessaryDOMElements,
        build,
        bindEvents,
        setCurrentlySelected,
        () => {
          fp.config.onClose.push(closeHook);
          fp.loadedPlugins.push("monthSelect");
        },
      ],
      onDestroy: [
        unstubCurrentMonth,
        destroyPluginInstance,
        () => {
          fp.config.onClose = fp.config.onClose.filter(hook => hook !== closeHook)
        },
      ],
    };
  };
}

export default monthSelectPlugin;
