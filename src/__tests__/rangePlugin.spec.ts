import flatpickr from "index";
import rangePlugin from "plugins/rangePlugin";
import { Options } from "../types/options";
import { Instance } from "../types/instance";

type RangeInstance = Instance & {
  secondInput: HTMLInputElement;
};

flatpickr.defaultConfig.animate = false;

jest.useFakeTimers();

const createInstance = (config?: Options): Instance => {
  return flatpickr(
    document.createElement("input"),
    config as Options
  ) as Instance;
};

describe("rangePlugin", () => {
  describe("with the disableMobile option disabled (the flatpickr default)", () => {
    it("records an error", () => {
      const errorHandler = jest.fn();
      const secondInput = document.createElement("input");

      createInstance({
        plugins: [rangePlugin({ input: secondInput })],
        defaultDate: ["2017-10-20", "2017-10-25"],
        dateFormat: "Y-m-d",
        disableMobile: false,
        errorHandler,
      }) as RangeInstance;

      expect(errorHandler).toHaveBeenCalled();
    });
  });

  describe("with the disableMobile option enabled", () => {
    it("doesn't record an error", () => {
      const errorHandler = jest.fn();
      const secondInput = document.createElement("input");

      createInstance({
        plugins: [rangePlugin({ input: secondInput })],
        defaultDate: ["2017-10-20", "2017-10-25"],
        dateFormat: "Y-m-d",
        disableMobile: true,
        errorHandler,
      }) as RangeInstance;

      expect(errorHandler).not.toHaveBeenCalled();
    });
  });

  it("should correctly preload defaultDate", () => {
    const secondInput = document.createElement("input");
    const fp = createInstance({
      plugins: [rangePlugin({ input: secondInput })],
      defaultDate: ["2017-10-20", "2017-10-25"],
      dateFormat: "Y-m-d",
      disableMobile: true,
    }) as RangeInstance;

    expect(fp.selectedDates.length).toEqual(2);
    expect(secondInput.value).toEqual("2017-10-25");
  });
});
