import flatpickr from "../../index";
import { Instance } from "types/instance";
import { Options } from "types/options";
import { German } from "l10n/de";
import monthDropdownPlugin from "./index";

flatpickr.defaultConfig.animate = false;

jest.useFakeTimers();

const createInstance = (config?: Options): Instance => {
  return flatpickr(
    document.createElement("input"),
    config as Options
  ) as Instance;
};

describe("monthDropdown", () => {
  it("should correctly load", () => {
    const fp = createInstance({
      plugins: [monthDropdownPlugin({})],
    }) as Instance;

    const monthsDropdown = fp.calendarContainer.querySelector(
      ".flatpickr-monthDropdown-months"
    );

    expect(monthsDropdown!.constructor.name).toEqual("HTMLSelectElement");
    expect(
      monthsDropdown!.querySelectorAll(".flatpickr-monthDropdown-month").length
    ).toEqual(12);
  });

  it("should correctly load shorthand months", () => {
    const fp = createInstance({
      plugins: [monthDropdownPlugin({ shorthand: true })],
    }) as Instance;

    const monthsDropdown = fp.calendarContainer.querySelector(
      ".flatpickr-monthDropdown-months"
    );

    expect(
      monthsDropdown!.querySelector(".flatpickr-monthDropdown-month")!.innerHTML
    ).toEqual("Jan");
  });

  it("should correctly load localized months", () => {
    const fp = createInstance({
      locale: German,
      plugins: [monthDropdownPlugin({})],
    }) as Instance;

    const monthsDropdown = fp.calendarContainer.querySelector(
      ".flatpickr-monthDropdown-months"
    );

    expect(
      monthsDropdown!.querySelector(".flatpickr-monthDropdown-month")!.innerHTML
    ).toEqual("Januar");
  });

  it("should correctly load months with minDate", () => {
    const fp = createInstance({
      defaultDate: new Date(2019, 5, 11),
      minDate: new Date(2019, 4, 11),
      plugins: [monthDropdownPlugin({})],
    }) as Instance;

    const monthsDropdown = fp.calendarContainer.querySelector(
      ".flatpickr-monthDropdown-months"
    );
    const months = monthsDropdown!.querySelectorAll(
      ".flatpickr-monthDropdown-month"
    );

    expect(months.length).toEqual(8);

    expect(months[0]!.innerHTML).toEqual("May");
    expect(months[7]!.innerHTML).toEqual("December");
  });

  it("should correctly load months with maxDate", () => {
    const fp = createInstance({
      defaultDate: new Date(2019, 4, 11),
      maxDate: new Date(2019, 8, 11),
      plugins: [monthDropdownPlugin({})],
    }) as Instance;

    const monthsDropdown = fp.calendarContainer.querySelector(
      ".flatpickr-monthDropdown-months"
    );
    const months = monthsDropdown!.querySelectorAll(
      ".flatpickr-monthDropdown-month"
    );

    expect(months.length).toEqual(9);

    expect(months[0]!.innerHTML).toEqual("January");
    expect(months[months.length - 1]!.innerHTML).toEqual("September");
  });

  it("should change month", () => {
    const fp = createInstance({
      defaultDate: new Date(2019, 1, 1),
      plugins: [monthDropdownPlugin({})],
    }) as Instance;

    const monthsDropdown = fp.calendarContainer.querySelector(
      ".flatpickr-monthDropdown-months"
    ) as HTMLSelectElement;

    monthsDropdown.value = "3";

    var evt = document.createEvent("HTMLEvents");
    evt.initEvent("change", false, true);
    monthsDropdown.dispatchEvent(evt);

    expect(fp.currentMonth).toEqual(3);
  });
});
