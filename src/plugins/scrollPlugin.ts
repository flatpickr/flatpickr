import { Plugin } from "../types/options";
import { Instance } from "../types/instance";
function delta(e: WheelEvent) {
  return Math.max(-1, Math.min(1, e.wheelDelta || -e.deltaY));
}

const scroll = (e: WheelEvent) => {
  e.preventDefault();
  const ev = new CustomEvent("increment", {
    bubbles: true,
  });
  (<any>ev).delta = delta(e);
  (<HTMLInputElement>e.target).dispatchEvent(ev);
};

function scrollMonth(fp: Instance) {
  return (e: WheelEvent) => {
    e.preventDefault();
    const mDelta = delta(e);
    fp.changeMonth(mDelta);
  };
}

function scrollPlugin(): Plugin {
  return function(fp) {
    const monthScroller = scrollMonth(fp);
    return {
      onReady() {
        if (fp.timeContainer) {
          fp.timeContainer.addEventListener("wheel", scroll);
        }

        fp.yearElements.forEach(yearElem =>
          yearElem.addEventListener("wheel", scroll)
        );

        fp.monthElements.forEach(monthElem =>
          monthElem.addEventListener("wheel", monthScroller)
        );
      },
      onDestroy() {
        if (fp.timeContainer) {
          fp.timeContainer.removeEventListener("wheel", scroll);
        }

        fp.yearElements.forEach(yearElem =>
          yearElem.removeEventListener("wheel", scroll)
        );

        fp.monthElements.forEach(monthElem =>
          monthElem.removeEventListener("wheel", monthScroller)
        );
      },
    };
  };
}

export default scrollPlugin;
