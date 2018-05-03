import { Plugin } from "../../types/options";
import { DayElement } from "../../types/instance";

export interface ExtraFields {
  monthStartDay: number;
  monthEndDay: number;
}

function monthSelectPlugin(): Plugin<ExtraFields> {
  return function(fp) {
    var days: NodeListOf<DayElement>;

    function onDayHover(event: MouseEvent) {
      if (
        !event.target ||
        !(event.target as Element).classList.contains("flatpickr-day")
      )
        return;

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

    function clearHover() {
      for (var i = days.length; i--; ) {
        days[i].classList.remove("inRange");
      }
    }

    return {
      onChange: highlightMonth,
      onMonthChange: highlightMonth,
      onClose: clearHover,
      onParseConfig: function onParseConfig() {
        fp.config.mode = "single";
        fp.config.enableTime = false;
      },
      onReady: [
        function() {
          days = fp.days.childNodes as NodeListOf<DayElement>;
        },
        function() {
          return fp.days.addEventListener("mouseover", onDayHover);
        },
        highlightMonth,
      ],
    };
  };
}

export default monthSelectPlugin;
