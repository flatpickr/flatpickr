import { DayElement } from "../../types/instance";
import { Plugin } from "../../types/options";

export type PlusRange = {
  rangeStartDay: Date;
  rangeEndDay: Date;
  rangeCheckbox: HTMLInputElement;
};

export interface Config {
  daysAround?: number;
  rangeCheckboxState?: boolean;
}

declare global {
  interface Window {
    dayRangeSelect: (config?: Config) => void;
  }
}

function dayRangeSelectPlugin(config: Config): Plugin<PlusRange> {
  return function(fp) {
    function onDayHover(event: MouseEvent) {
      if (config.daysAround === undefined) {
        config.daysAround = 2;
      }
      const day = event.target as DayElement;
      if (
        !day.classList.contains("flatpickr-day") ||
        day.classList.contains("flatpickr-disabled") ||
        !fp.rangeCheckbox.checked
      )
        return;

      const days = fp.days.childNodes;
      const dayIndex = day.$i;

      let startDayIndexAvailable = dayIndex;
      for (let i = 0; i < days.length; i++) {
        if (!(days[i] as DayElement).classList.contains("flatpickr-disabled")) {
          startDayIndexAvailable = (days[i] as DayElement).$i;
          break;
        }
      }
      let rangeStartDayIndex;
      if (dayIndex - config.daysAround < startDayIndexAvailable) {
        rangeStartDayIndex = startDayIndexAvailable;
      } else {
        rangeStartDayIndex = dayIndex - config.daysAround;
      }
      const rangeStartDay = (days[rangeStartDayIndex] as DayElement).dateObj;
      let rangeEndDayIndex;
      if (days.length - 1 < dayIndex + config.daysAround) {
        rangeEndDayIndex = days.length - 1;
      } else {
        rangeEndDayIndex = dayIndex + config.daysAround;
      }
      const rangeEndDay = (days[rangeEndDayIndex] as DayElement).dateObj;
      for (let i = days.length; i--; ) {
        const day = days[i] as DayElement;
        const date = day.dateObj;
        if (date > rangeEndDay || date < rangeStartDay)
          day.classList.remove("inRange");
        else day.classList.add("inRange");
      }
    }

    function highlightDayRange() {
      if (config.daysAround === undefined) {
        config.daysAround = 2;
      }
      const selDate = fp.latestSelectedDateObj;
      const day = fp.selectedDateElem;
      if (
        selDate !== undefined &&
        selDate.getMonth() === fp.currentMonth &&
        selDate.getFullYear() === fp.currentYear &&
        fp.rangeCheckbox.checked
      ) {
        const days = fp.days.childNodes;
        const dayIndex = (day as DayElement).$i;

        let startDayIndexAvailable = dayIndex;
        for (let i = 0; i < days.length; i++) {
          if (
            !(days[i] as DayElement).classList.contains("flatpickr-disabled")
          ) {
            startDayIndexAvailable = (days[i] as DayElement).$i;
            break;
          }
        }
        let rangeStartDayIndex;
        if (dayIndex - config.daysAround < startDayIndexAvailable) {
          rangeStartDayIndex = startDayIndexAvailable;
        } else {
          rangeStartDayIndex = dayIndex - config.daysAround;
        }
        fp.rangeStartDay = (days[rangeStartDayIndex] as DayElement).dateObj;
        let rangeEndDayIndex;
        if (days.length - 1 < dayIndex + config.daysAround) {
          rangeEndDayIndex = days.length - 1;
        } else {
          rangeEndDayIndex = dayIndex + config.daysAround;
        }
        fp.rangeEndDay = (days[rangeEndDayIndex] as DayElement).dateObj;
      } else {
        fp.rangeStartDay = (day as DayElement).dateObj;
        fp.rangeEndDay = (day as DayElement).dateObj;
      }
      if (fp.rangeStartDay !== fp.rangeEndDay) {
        const days = fp.days.childNodes;
        for (let i = days.length; i--; ) {
          const date = (days[i] as DayElement).dateObj;
          if (date >= fp.rangeStartDay && date <= fp.rangeEndDay)
            (days[i] as DayElement).classList.add(
              "faltpickr-range-select",
              "selected"
            );
        }
      }
      //todo добавить форматированые значения дат
      if (
        fp.rangeStartDay !== undefined &&
        fp.rangeEndDay !== undefined &&
        fp.rangeCheckbox.checked
      ) {
        fp.input.value =
          fp.formatDate(fp.rangeStartDay, fp.config.dateFormat) +
          "-" +
          fp.formatDate(fp.rangeEndDay, fp.config.dateFormat);
      }
    }

    function clearHover() {
      const days = fp.days.childNodes;
      for (let i = days.length; i--; )
        (days[i] as Element).classList.remove("inRange");
    }

    function clearRangeSelect() {
      const days = fp.days.childNodes;
      for (let i = days.length; i--; )
        (days[i] as Element).classList.remove(
          "faltpickr-range-select",
          "selected"
        );
    }

    function onReady() {
      if (fp.daysContainer !== undefined)
        fp.daysContainer.addEventListener("mouseover", onDayHover);
      let checkboxHtml =
        '<input class="flatpickr-dayRangeSelect-checkbox" type="checkbox">\n' +
        '<label for="flatpickr-dayRangeSelect-checkbox-label">+-' +
        config.daysAround +
        " ночи</label>\n";
      let checkboxNode = document.createElement("div");
      checkboxNode.innerHTML = checkboxHtml;
      if (fp.calendarContainer !== undefined) {
        fp.rangeCheckbox = fp.calendarContainer.appendChild(checkboxNode)
          .firstChild as HTMLInputElement;
        if (config.rangeCheckboxState === true) {
          fp.rangeCheckbox.checked = true;
        }
        fp.rangeCheckbox.addEventListener("click", clearRangeSelect);
      }
    }

    function onDestroy() {
      if (fp.daysContainer !== undefined)
        fp.daysContainer.removeEventListener("mouseover", onDayHover);
    }

    return {
      onValueUpdate: highlightDayRange,
      onMonthChange: highlightDayRange,
      onYearChange: highlightDayRange,
      onOpen: highlightDayRange,
      onClose: clearHover,
      onParseConfig: function() {
        fp.config.mode = "single";
        fp.config.enableTime = false;
        fp.config.dateFormat = fp.config.dateFormat
          ? fp.config.dateFormat
          : "\\W\\e\\e\\k #W, Y";
        fp.config.altFormat = fp.config.altFormat
          ? fp.config.altFormat
          : "\\W\\e\\e\\k #W, Y";
      },
      onReady: [
        onReady,
        highlightDayRange,
        () => {
          fp.loadedPlugins.push("dayRangeSelect");
        },
      ],
      onDestroy,
    };
  };
}

export default dayRangeSelectPlugin;
