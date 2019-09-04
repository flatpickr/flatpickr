import flatpickr from "../../index";
import monthSelectPlugin from "./index";
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
});
