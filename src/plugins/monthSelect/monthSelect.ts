import { Plugin } from "../../types/options";
import { DayElement } from "../../types/instance";

export interface ExtraFields {
  monthStartDay: number;
  monthEndDay: number;
}

function monthSelectPlugin(): Plugin<ExtraFields> {
  return function(fp) {
    function onDayHover(event: MouseEvent) {
      if (
        !event.target ||
        !(event.target as Element).classList.contains("flatpickr-day")
      )
        return;
      var days: NodeListOf<DayElement>;
      days = fp.days.childNodes as NodeListOf<DayElement>;
      const dayIndex = Array.prototype.indexOf.call(days, event.target);
      fp.monthStartDay = new Date(
        days[dayIndex].dateObj.getFullYear(),
        days[dayIndex].dateObj.getMonth(),
        1,
        0,
        0,
        0,
        0
      ).getTime();
      fp.monthEndDay = new Date(
        days[dayIndex].dateObj.getFullYear(),
        days[dayIndex].dateObj.getMonth() + 1,
        0,
        0,
        0,
        0,
        0
      ).getTime();
      //console.log(days[dayIndex].dateObj.toString());
      for (var i = days.length; i--; ) {
        var date = days[i].dateObj.getTime();
        if (date > fp.monthEndDay || date < fp.monthStartDay)
          days[i].classList.remove("inRange");
        else days[i].classList.add("inRange");
        if (date != fp.monthEndDay) days[i].classList.remove("endRange");
        else days[i].classList.add("endRange");
        if (date != fp.monthStartDay) days[i].classList.remove("startRange");
        else days[i].classList.add("startRange");
      }
    }

    function highlightMonth() {
      var selDate: Date | undefined = fp.latestSelectedDateObj;
      if (
        selDate !== undefined &&
        selDate.getMonth() === fp.currentMonth &&
        selDate.getFullYear() === fp.currentYear &&
        selDate.getMonth() === new Date(fp.monthStartDay).getMonth() &&
        selDate.getMonth() === new Date(fp.monthEndDay).getMonth()
      ) {
        var days: NodeListOf<DayElement>;
        days = fp.days.childNodes as NodeListOf<DayElement>;
        for (var i = days.length; i--; ) {
          var date = days[i].dateObj.getTime();
          if (date >= fp.monthStartDay && date <= fp.monthEndDay)
            days[i].classList.add("month", "selected");
          if (date != fp.monthEndDay) days[i].classList.remove("endRange");
          else days[i].classList.add("endRange");
          if (date != fp.monthStartDay) days[i].classList.remove("startRange");
          else days[i].classList.add("startRange");
        }
      }
    }

    function clearHover() {
      var days: NodeListOf<DayElement>;
      days = fp.days.childNodes as NodeListOf<DayElement>;
      for (var i = days.length; i--; ) {
        days[i].classList.remove("inRange");
      }
    }

    function onReady() {
      if (fp.daysContainer) {
        fp.daysContainer.addEventListener("mouseover", onDayHover);
      }
    }

    function onDestroy() {
      if (fp.daysContainer) {
        fp.daysContainer.removeEventListener("mouseover", onDayHover);
      }
    }

    return {
      onValueUpdate: highlightMonth,
      onChange: highlightMonth,
      onMonthChange: highlightMonth,
      onYearChange: highlightMonth,
      onClose: clearHover,
      onParseConfig: function onParseConfig() {
        fp.config.mode = "single";
        fp.config.enableTime = false;
      },
      onReady: [onReady, highlightMonth],
      onDestroy: onDestroy,
    };
  };
}

export default monthSelectPlugin;
