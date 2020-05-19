import flatpickr from "../../index";
import duration from "./index";
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

function simulate(
  eventType: string,
  onElement: Node,
  options?: object,
  type?: any
) {
  const eventOptions = Object.assign(options || {}, { bubbles: true });
  const evt = new (type || CustomEvent)(eventType, eventOptions);
  try {
    Object.assign(evt, eventOptions);
  } catch (e) {}

  onElement.dispatchEvent(evt);
}

describe("duration", () => {
  it("should set noCalendar and enableTime to true", () => {
    const fp = createInstance({
      defaultDate: new Date("2019-04-20"),
      time_24hr: true,
      plugins: [duration({})],
    }) as Instance;

    expect(fp.config.noCalendar).toBeTruthy;
    expect(fp.config.enableTime).toBeTruthy;
    expect(fp.hourElement).toBeDefined;
  });

  it("should set the input to the given defaultHour", () => {
    const fp = createInstance({
      time_24hr: true,
      plugins: [duration({
        defaultHour: 7
      })],
    }) as Instance;

    simulate(
      "blur",
      fp.hourElement as Node,
      { bubbles: true },
      CustomEvent
    );

    expect(fp.input.value).toEqual("07:00");
  });

  it("should set the default input to the given format", () => {
    const fp = createInstance({
      time_24hr: true,
      plugins: [duration({
        defaultHour: 8,
        defaultMinute: 0,
        timeFormat: "H,i"
      })],
    }) as Instance;

    simulate(
      "blur",
      fp.hourElement as Node,
      { bubbles: true },
      CustomEvent
    );

    expect(fp.input.value).toEqual("08,0");
  });

  it("should set the input to the given defaultHour and defaultMinute", () => {
    const fp = createInstance({
      time_24hr: true,
      plugins: [duration({})],
    }) as Instance;

    simulate(
      "blur",
      fp.hourElement as Node,
      { bubbles: true },
      CustomEvent
    );

    if(fp.hourElement)
      fp.hourElement.value = "34";

      simulate(
        "blur",
        fp.hourElement as Node,
        { bubbles: true },
        CustomEvent
      );

    expect(fp.input.value).toEqual("34:00");
  });

  it("should set the input to the given defaultSeconds", () => {
    const fp = createInstance({
      time_24hr: true,
      plugins: [duration({
        defaultHour: 8,
        defaultMinute: 0,
        enableSeconds: true,
        timeFormat: "H:I:S",
        defaultSeconds: 24
      })],
    }) as Instance;

    simulate(
      "blur",
      fp.hourElement as Node,
      { bubbles: true },
      CustomEvent
    );

    expect(fp.input.value).toEqual("08:00:24");
  });
});
