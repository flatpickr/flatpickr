import flatpickr from "index";
import monthSelectPlugin from "plugins/monthSelect/index";
import { German } from "l10n/de";
import { Instance } from "types/instance";
import { Options } from "types/options";

flatpickr.defaultConfig.animate = false;

jest.useFakeTimers();

const createInstance = (config?: Options): Instance => {
  return flatpickr(
    document.createElement("input"),
    config as Options
  ) as Instance;
};

describe("monthSelect", () => {
  it("should correctly preload defaultDate", () => {
    const fp = createInstance({
      defaultDate: new Date("2019-04-20"),
      plugins: [monthSelectPlugin({})],
    }) as Instance;

    expect(fp.input.value).toEqual("April 2019");
  });

  it("should correctly preload defaultDate with locale", () => {
    const fp = createInstance({
      defaultDate: new Date("2019-03-20"),
      locale: German,
      plugins: [monthSelectPlugin({})],
    }) as Instance;

    expect(fp.input.value).toEqual("März 2019");
  });

  it("should correctly preload defaultDate with format", () => {
    const fp = createInstance({
      defaultDate: new Date("2019-03-20"),
      locale: German,
      plugins: [monthSelectPlugin({ dateFormat: "m.y" })],
    }) as Instance;

    expect(fp.input.value).toEqual("03.19");
  });

  it("should correctly preload defaultDate and altInput with format", () => {
    const fp = createInstance({
      defaultDate: new Date("2019-03-20"),
      altInput: true,
      plugins: [monthSelectPlugin({ dateFormat: "m.y", altFormat: "m y" })],
    }) as Instance;

    expect(fp.input.value).toEqual("03.19");

    expect(fp.altInput).toBeDefined();
    if (!fp.altInput) return;

    expect(fp.altInput.value).toEqual("03 19");
  });

  describe("year nav", () => {
    describe("next/prev year buttons", () => {
      it("should increment/decrement year when clicked (#2275)", () => {
        const initYear = 2020;

        const fp = createInstance({
          plugins: [monthSelectPlugin()],
          defaultDate: new Date(`${initYear}-03-20`),
        }) as Instance;

        const prevButton = fp.monthNav.querySelector(".flatpickr-prev-month")!;
        prevButton.dispatchEvent(new MouseEvent("click"));

        expect(fp.currentYear).toEqual(initYear - 1);

        const nextButton = fp.monthNav.querySelector(".flatpickr-next-month")!;
        nextButton.dispatchEvent(new MouseEvent("click"));

        expect(fp.currentYear).toEqual(initYear);
      });

      it("should update displayed year when clicked (#2277)", () => {
        const initYear = new Date().getFullYear();

        const fp = createInstance({
          plugins: [monthSelectPlugin()],
        }) as Instance;

        const prevButton = fp.monthNav.querySelector(".flatpickr-prev-month")!;
        prevButton.dispatchEvent(new MouseEvent("click"));

        expect(fp.currentYearElement.value).toEqual(`${initYear - 1}`);

        const nextButton = fp.monthNav.querySelector(".flatpickr-next-month")!;
        nextButton.dispatchEvent(new MouseEvent("click"));
        nextButton.dispatchEvent(new MouseEvent("click"));

        expect(fp.currentYearElement.value).toEqual(`${initYear + 1}`);
      });

      it("should honor minDate / maxDate options (#2279)", () => {
        const lastYear = new Date().getFullYear() - 1;
        const nextYear = new Date().getFullYear() + 1;

        const fp = createInstance({
          plugins: [monthSelectPlugin()],
          minDate: `${lastYear}-03-20`,
          maxDate: `${nextYear}-03-20`,
        }) as Instance;

        const prevButton = fp.monthNav.querySelector(".flatpickr-prev-month")!;
        prevButton.dispatchEvent(new MouseEvent("click"));

        expect(prevButton.classList).toContain("flatpickr-disabled");

        const nextButton = fp.monthNav.querySelector(".flatpickr-next-month")!;
        nextButton.dispatchEvent(new MouseEvent("click"));
        nextButton.dispatchEvent(new MouseEvent("click"));

        expect(nextButton.classList).toContain("flatpickr-disabled");
      });
    });
  });
});
