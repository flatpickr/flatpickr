import flatpickr from "index";
import { Options } from "../types/options";
import { Instance } from "../types/instance";

flatpickr.defaultConfig.animate = false;

jest.useFakeTimers();

const createInstance = (config?: Options): Instance => {
  return flatpickr(
    document.createElement("input"),
    config as Options
  ) as Instance;
};

describe("Events + Hooks", () => {
  it("should fire onOpen only once", () => {
    let timesFired = 0;

    const fp = createInstance({
      onOpen: () => timesFired++,
    });

    fp.open();
    expect(timesFired).toEqual(1);
  });
});
