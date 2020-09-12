import flatpickr from "../../index";
import monthSelectPlugin from "./index";
import { German } from "l10n/de";
import { Instance } from "types/instance";
import { Options } from "types/options";
import { clickOn } from '../../utils/test_helpers'

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

  describe ("using the nav arrows", () => {
    it ("navigates to next year if no month is selected", () => {
      const fp = createInstance({
        plugins: [monthSelectPlugin({})],
      }) as Instance;
      
      const now = new Date;
      const currentYear = now.getFullYear()
      const currentMonth = now.getMonth()
      
      expect(fp.currentYear).toEqual(currentYear)
      expect(fp.currentMonth).toEqual(currentMonth)
      expect(fp['yearElements'][0].value).toEqual(String(currentYear));
      
      clickOn(fp['nextMonthNav'])

      expect(fp.currentYear).toEqual(currentYear + 1)
      expect(fp.currentMonth).toEqual(currentMonth)
      expect(fp['yearElements'][0].value).toEqual(String(currentYear + 1));
    })

    it ("navigates to previous year if no month is selected", () => {
      const fp = createInstance({
        plugins: [monthSelectPlugin({})],
      }) as Instance;
      
      const now = new Date;
      const currentYear = now.getFullYear()
      const currentMonth = now.getMonth()
      
      expect(fp.currentYear).toEqual(currentYear)
      expect(fp.currentMonth).toEqual(currentMonth)
      expect(fp['yearElements'][0].value).toEqual(String(currentYear));

      clickOn(fp['prevMonthNav'])

      expect(fp.currentYear).toEqual(currentYear - 1)
      expect(fp.currentMonth).toEqual(currentMonth)
      expect(fp['yearElements'][0].value).toEqual(String(currentYear - 1));
    })

    it ("navigates to next year if month is already selected", () => {
      const fp = createInstance({
        defaultDate: new Date("2016-09-13"),
        plugins: [monthSelectPlugin({})],
      }) as Instance;
      
      const defaultYear = 2016
      const defaultMonth = 9 - 1;
      
      expect(fp.currentYear).toEqual(defaultYear)
      expect(fp.currentMonth).toEqual(defaultMonth)
      expect(fp['yearElements'][0].value).toEqual(String(defaultYear));

      clickOn(fp['nextMonthNav'])

      expect(fp.currentYear).toEqual(defaultYear + 1)
      expect(fp.currentMonth).toEqual(defaultMonth)
      expect(fp['yearElements'][0].value).toEqual(String(defaultYear + 1));
    })

    it ("navigates to previous year if month is already selected", () => {
      const fp = createInstance({
        defaultDate: new Date("2016-09-13"),
        plugins: [monthSelectPlugin({})],
      }) as Instance;
      
      const defaultYear = 2016
      const defaultMonth = 9 - 1;
      
      expect(fp.currentYear).toEqual(defaultYear)
      expect(fp.currentMonth).toEqual(defaultMonth)
      expect(fp['yearElements'][0].value).toEqual(String(defaultYear));

      clickOn(fp['prevMonthNav'])

      expect(fp.currentYear).toEqual(defaultYear - 1)
      expect(fp.currentMonth).toEqual(defaultMonth)
      expect(fp['yearElements'][0].value).toEqual(String(defaultYear - 1));
    })
  })
});
