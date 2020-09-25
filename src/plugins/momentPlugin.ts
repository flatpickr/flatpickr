import { Plugin } from "../types/options";
import { IncrementEvent } from "../utils";
import { getEventTarget } from "../utils/dom";

export interface Config {
  moment: Function;
}

function momentPlugin(config: Config): Plugin {
  const moment = config.moment;

  return function (fp) {
    function captureIncrement(e: Event) {
      const event = e as IncrementEvent;
      event.stopPropagation();
      const date = moment(fp.selectedDates[0]);

      const input = getEventTarget(event) as HTMLInputElement;
      const unit = Array.from(input.classList)
        .filter((name) => name.startsWith("flatpickr-"))
        .map((name) => name.substring(10))[0];
      const step = parseFloat(input.getAttribute("step") as string);

      date.add(step * event.delta, unit);
      fp.setDate(date.toDate());
    }

    return {
      parseDate: (datestr, format) => {
        return moment(datestr, format, true).toDate();
      },
      formatDate: (date, format) => {
        // locale can also be used
        const momentDate = moment(date);
        if (typeof fp.config.locale === "string") {
          momentDate.locale(fp.config.locale);
        }
        return momentDate.format(format);
      },
      onReady() {
        [fp.hourElement, fp.minuteElement, fp.secondElement].forEach(
          (element) =>
            element &&
            element.addEventListener("increment", captureIncrement, {
              capture: true,
            })
        );
      },
      onDestroy() {
        [fp.hourElement, fp.minuteElement, fp.secondElement].forEach(
          (element) =>
            element &&
            element.removeEventListener("increment", captureIncrement, {
              capture: true,
            })
        );
      },
    };
  };
}

export default momentPlugin;
