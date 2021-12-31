import { Plugin } from "../types/options";
import { Instance } from "../types/instance";
import { getEventTarget } from "../utils/dom";

if (typeof window.CustomEvent !== "function") {
  const CustomEvent = function (
    typeArg: string,
    eventInitDict?: CustomEventInit
  ): CustomEvent {
    eventInitDict = eventInitDict || {
      bubbles: false,
      cancelable: false,
      detail: undefined,
    };
    const evt = document.createEvent("CustomEvent");
    evt.initCustomEvent(
      typeArg,
      eventInitDict.bubbles as boolean,
      eventInitDict.cancelable as boolean,
      eventInitDict.detail
    );
    return evt;
  };

  CustomEvent.prototype = window.Event.prototype;

  window.CustomEvent = <any>CustomEvent;
}

function delta(e: WheelEvent) {
  return Math.max(-1, Math.min(1, (e as any).wheelDelta || -e.deltaY));
}

const scroll = (e: WheelEvent) => {
  e.preventDefault();
  const ev = new CustomEvent("increment", {
    bubbles: true,
  });
  (ev as any).delta = delta(e);
  (getEventTarget(e) as HTMLInputElement).dispatchEvent(ev);
};

function scrollMonth(fp: Instance) {
  return (e: WheelEvent) => {
    e.preventDefault();
    const mDelta = delta(e);
    fp.changeMonth(mDelta);
  };
}

function scrollPlugin(): Plugin {
  return function (fp) {
    const monthScroller = scrollMonth(fp);
    return {
      onReady() {
        if (fp.timeContainer) {
          fp.timeContainer.addEventListener("wheel", scroll);
        }

        if (fp.yearElements) {
          fp.yearElements.forEach((yearElem) =>
            yearElem.addEventListener("wheel", scroll)
          );
        }

        if (fp.monthElements) {
          fp.monthElements.forEach((monthElem) =>
            monthElem.addEventListener("wheel", monthScroller)
          );
        }

        fp.loadedPlugins.push("scroll");
      },
      onDestroy() {
        if (fp.timeContainer) {
          fp.timeContainer.removeEventListener("wheel", scroll);
        }

        if (fp.yearElements) {
          fp.yearElements.forEach((yearElem) =>
            yearElem.removeEventListener("wheel", scroll)
          );
        }

        if (fp.monthElements) {
          fp.monthElements.forEach((monthElem) =>
            monthElem.removeEventListener("wheel", monthScroller)
          );
        }
      },
    };
  };
}

export default scrollPlugin;
