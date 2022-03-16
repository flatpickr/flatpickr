import { Instance } from "../../types/instance";
import { Plugin } from "../../types/options";
import { getEventTarget } from "../../utils/dom";

export interface Config {
  confirmIcon?: string;
  confirmText?: string;
  showAlways?: boolean;
  theme?: string;
}

const defaultConfig: Config = {
  confirmIcon:
    "<svg version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' width='17' height='17' viewBox='0 0 17 17'> <g> </g> <path d='M15.418 1.774l-8.833 13.485-4.918-4.386 0.666-0.746 4.051 3.614 8.198-12.515 0.836 0.548z' fill='#000000' /> </svg>",
  confirmText: "OK ",
  showAlways: false,
  theme: "light",
};

function confirmDatePlugin(pluginConfig: Config): Plugin {
  const config = { ...defaultConfig, ...pluginConfig };
  let confirmContainer: HTMLDivElement;
  const confirmButtonCSSClass = "flatpickr-confirm";

  return function (fp: Instance) {
    if (fp.config.noCalendar || fp.isMobile) return {};
    return {
      onKeyDown(_: Date[], __: string, ___: Instance, e: KeyboardEvent) {
        const eventTarget = getEventTarget(e);
        const isTargetLastFocusableElement =
          (!fp.config.time_24hr && eventTarget === fp.amPM) ||
          (fp.config.time_24hr &&
            ((fp.config.enableSeconds && eventTarget === fp.secondElement) ||
              (!fp.config.enableSeconds && eventTarget === fp.minuteElement)));
        if (
          fp.config.enableTime &&
          e.key === "Tab" &&
          isTargetLastFocusableElement
        ) {
          e.preventDefault();
          confirmContainer.focus();
        } else if (e.key === "Enter" && eventTarget === confirmContainer)
          fp.close();
      },

      onReady() {
        confirmContainer = fp._createElement<HTMLDivElement>(
          "div",
          `${confirmButtonCSSClass} ${config.showAlways ? "visible" : ""} ${
            config.theme
          }Theme`,
          config.confirmText
        );

        confirmContainer.tabIndex = -1;
        confirmContainer.innerHTML += config.confirmIcon;

        confirmContainer.addEventListener("click", fp.close);
        fp.calendarContainer.appendChild(confirmContainer);

        fp.loadedPlugins.push("confirmDate");
      },
      ...(!config.showAlways
        ? {
            onChange: function (_: Date[], dateStr: string) {
              const showCondition =
                fp.config.enableTime ||
                fp.config.mode === "multiple" ||
                fp.loadedPlugins.indexOf("monthSelect") !== -1;

              const localConfirmContainer = fp.calendarContainer.querySelector(
                `.${confirmButtonCSSClass}`
              );

              if (!localConfirmContainer) return;

              if (
                dateStr &&
                !fp.config.inline &&
                showCondition &&
                localConfirmContainer
              )
                return localConfirmContainer.classList.add("visible");

              localConfirmContainer.classList.remove("visible");
            },
          }
        : {}),
    };
  };
}

export default confirmDatePlugin;
