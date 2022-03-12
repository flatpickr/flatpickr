import flatpickr from "index";
import { French } from "l10n/fr";
import { Irish } from "l10n/ga";
import { Japanese } from "l10n/ja";
import { Russian } from "l10n/ru";
import { Instance, DayElement } from "types/instance";
import { Options, DateRangeLimit } from "types/options";
import confirmDatePlugin from "plugins/confirmDate/confirmDate";
import { getDefaultHours } from "utils/dates";

flatpickr.defaultConfig.animate = false;
flatpickr.defaultConfig.closeOnSelect = true;

jest.useFakeTimers();

let elem: undefined | HTMLInputElement, fp: Instance;
const UA = navigator.userAgent;
let mockAgent: string | undefined;

(navigator as any).__defineGetter__("userAgent", function () {
  return mockAgent || UA;
});

function createInstance(config?: Options, el?: HTMLElement) {
  destroyInstance();
  fp = flatpickr(
    el || elem || document.createElement("input"),
    config || {}
  ) as Instance;
  return fp;
}

function destroyInstance() {
  if (fp) {
    fp.input.value = "";
    fp.destroy && fp.destroy();
  }
}

function beforeEachTest() {
  mockAgent = undefined;
  jest.runAllTimers();

  if (document.activeElement) {
    (document.activeElement as HTMLElement).blur();
  }

  destroyInstance();

  if (elem === undefined) {
    elem = document.createElement("input");
    document.body.appendChild(elem);
  }
}

function incrementTime(
  type:
    | "currentYearElement"
    | "hourElement"
    | "minuteElement"
    | "secondElement",
  by: number
) {
  const e = fp[type];
  const times = Math.abs(by);
  const childNodeNum = by >= 0 ? 1 : 2;

  if (e !== undefined && e.parentNode)
    for (let i = times; i--; )
      simulate(
        "click",
        e.parentNode.childNodes[childNodeNum],
        { which: 1 },
        MouseEvent
      );
}

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

// simulate click
const clickOn = (element: Node) => {
  simulate("click", element, { which: 1 }, CustomEvent);
};

describe("flatpickr", () => {
  beforeEach(beforeEachTest);

  describe("init", () => {
    it("should gracefully handle no elements", () => {
      expect(flatpickr([])).toEqual([]);
    });

    it("should parse defaultDate", () => {
      createInstance({
        defaultDate: "2016-12-27T16:16:22.585Z",
        enableTime: true,
      });

      const date = new Date("2016-12-27T16:16:22.585Z");
      expect(fp.currentYear).toEqual(date.getFullYear());
      expect(fp.currentMonth).toEqual(date.getMonth());
      const selected = fp.days.querySelector(".selected");
      expect(selected).toBeTruthy();

      if (selected) expect(selected.textContent).toEqual(date.getDate() + "");
    });

    it("shouldn't parse out-of-bounds defaultDate", () => {
      createInstance({
        minDate: "2016-12-28T16:16:22.585Z",
        defaultDate: "2016-12-27T16:16:22.585Z",
      });

      expect(fp.days.querySelector(".selected")).toEqual(null);

      createInstance({
        defaultDate: "2016-12-27T16:16:22.585Z",
        enableTime: true,
      });

      fp.set("maxDate", "2016-12-25");
      fp.set("minDate", "2016-12-24");

      expect(fp.currentMonth).toEqual(11);
      expect(fp.days.querySelector(".selected")).toEqual(null);

      let enabledDays = fp.days.querySelectorAll(
        ".flatpickr-day:not(.flatpickr-disabled)"
      );

      expect(enabledDays.length).toEqual(2);
      expect(enabledDays[0].textContent).toEqual("24");
      expect(enabledDays[1].textContent).toEqual("25");

      createInstance({
        defaultDate: "2016-12-27T16:16:22.585Z",
        minDate: "2016-12-27T16:26:22.585Z",
        enableTime: true,
      });

      expect(fp.selectedDates.length).toBe(0);
      expect(fp.days.querySelector(".selected")).toEqual(null);
    });

    it("doesn't throw with undefined properties", () => {
      createInstance({
        onChange: undefined,
      });
      fp.set("minDate", "2016-10-20");
      expect(fp.config.minDate).toBeDefined();
    });
  });

  describe("datetimestring parser", () => {
    describe("date string parser", () => {
      it("should parse timestamp", () => {
        createInstance({
          defaultDate: 1477111633771,
        });

        const date = new Date("2016-10-22T04:47:13.771Z");
        expect(fp.selectedDates[0]).toBeDefined();
        expect(fp.selectedDates[0].getFullYear()).toEqual(date.getFullYear());
        expect(fp.selectedDates[0].getMonth()).toEqual(date.getMonth());
        expect(fp.selectedDates[0].getDate()).toEqual(date.getDate());
      });

      it("should parse unix time", () => {
        createInstance({
          defaultDate: "1477111633.771", // shouldnt parse as a timestamp
          dateFormat: "U",
        });

        const date = new Date("2016-10-22T04:47:13.771Z");
        expect(fp.selectedDates[0]).toBeDefined();
        expect(fp.selectedDates[0].getFullYear()).toEqual(date.getFullYear());
        expect(fp.selectedDates[0].getMonth()).toEqual(date.getMonth());
        expect(fp.selectedDates[0].getDate()).toEqual(date.getDate());
      });

      it('should parse "2016-10"', () => {
        createInstance({
          defaultDate: "2016-10",
        });

        expect(fp.selectedDates[0]).toBeDefined();
        expect(fp.selectedDates[0].getFullYear()).toEqual(2016);
        expect(fp.selectedDates[0].getMonth()).toEqual(9);
      });

      it('should parse "2016-10-20 3:30"', () => {
        createInstance({
          defaultDate: "2016-10-20 3:30",
          enableTime: true,
        });

        expect(fp.selectedDates[0]).toBeDefined();
        expect(fp.selectedDates[0].getFullYear()).toEqual(2016);
        expect(fp.selectedDates[0].getMonth()).toEqual(9);
        expect(fp.selectedDates[0].getDate()).toEqual(20);
        expect(fp.selectedDates[0].getHours()).toEqual(3);
        expect(fp.selectedDates[0].getMinutes()).toEqual(30);
      });

      it("should parse ISO8601", () => {
        createInstance({
          defaultDate: "2007-03-04T21:08:12",
          enableTime: true,
          enableSeconds: true,
        });

        expect(fp.selectedDates[0]).toBeDefined();
        expect(fp.selectedDates[0].getFullYear()).toEqual(2007);
        expect(fp.selectedDates[0].getMonth()).toEqual(2);
        expect(fp.selectedDates[0].getDate()).toEqual(4);
        expect(fp.selectedDates[0].getHours()).toEqual(21);
        expect(fp.selectedDates[0].getMinutes()).toEqual(8);
        expect(fp.selectedDates[0].getSeconds()).toEqual(12);
      });

      it('should parse "today"', () => {
        createInstance({});
        const today = fp.parseDate("today", undefined, true);
        expect(today).toBeDefined();

        today && expect(today.getHours()).toBe(0);
      });

      it("should parse AM/PM", () => {
        createInstance({
          dateFormat: "m/d/Y h:i K",
          enableTime: true,
          defaultDate: "8/3/2017 12:00 AM",
        });

        expect(fp.selectedDates[0]).toBeDefined();
        expect(fp.selectedDates[0].getFullYear()).toEqual(2017);
        expect(fp.selectedDates[0].getMonth()).toEqual(7);
        expect(fp.selectedDates[0].getDate()).toEqual(3);
        expect(fp.selectedDates[0].getHours()).toEqual(0);
        expect(fp.selectedDates[0].getMinutes()).toEqual(0);
      });

      it("should parse JSON datestrings", () => {
        createInstance({});

        const date = fp.parseDate("2016-12-27T16:16:22.585Z", undefined);
        expect(date).toBeDefined();

        if (!date) return;

        expect(date.getTime()).toBeDefined();
        expect(date.getTime()).toEqual(Date.parse("2016-12-27T16:16:22.585Z"));
      });

      it("should parse string with unicode characters", () => {
        createInstance({
          defaultDate: "03 février 2021",
          dateFormat: "d F Y",
          locale: French,
        });

        expect(fp.selectedDates[0]).toEqual(new Date("2021-02-03T00:00:00"));
      });

      it("should parse string with space contained in month names", () => {
        createInstance({
          defaultDate: "Dé Domhnaigh 5 Meán Fómhair 2021",
          dateFormat: "l j F Y",
          locale: Irish,
        });

        expect(fp.selectedDates[0]).toEqual(new Date("2021-09-05T00:00:00"));
      });

      it("should parse string without delimiters", () => {
        createInstance({
          defaultDate: "2021年2月3日",
          dateFormat: "Y年Fj日",
          locale: Japanese,
        });

        expect(fp.selectedDates[0]).toEqual(new Date("2021-02-03T00:00:00"));
      });
    });

    describe("time string parser", () => {
      it('should parse "21:11"', () => {
        createInstance({
          defaultDate: "21:11",
          allowInput: true,
          enableTime: true,
          noCalendar: true,
        });

        expect(fp.selectedDates[0]).toBeDefined();
        expect(fp.selectedDates[0].getHours()).toEqual(21);
        expect(fp.selectedDates[0].getMinutes()).toEqual(11);
      });

      it('should parse "21:11:12"', () => {
        createInstance({
          allowInput: true,
          enableTime: true,
          enableSeconds: true,
          noCalendar: true,
          defaultDate: "21:11:12",
        });

        expect(fp.selectedDates[0]).toBeDefined();
        expect(fp.selectedDates[0].getHours()).toEqual(21);
        expect(fp.selectedDates[0].getMinutes()).toEqual(11);
        expect(fp.selectedDates[0].getSeconds()).toEqual(12);
      });

      it('should parse "11:59 PM"', () => {
        createInstance({
          allowInput: true,
          enableTime: true,
          noCalendar: true,
          dateFormat: "h:i K",
          defaultDate: "11:59 PM",
        });

        expect(fp.selectedDates[0]).toBeDefined();
        expect(fp.selectedDates[0].getHours()).toBe(23);
        expect(fp.selectedDates[0].getMinutes()).toBe(59);
        expect(fp.selectedDates[0].getSeconds()).toBe(0);

        expect(fp.amPM).toBeDefined();
        fp.amPM && expect(fp.amPM.innerHTML).toBe("PM");
      });

      it('should parse "3:05:03 PM"', () => {
        createInstance({
          allowInput: true,
          enableTime: true,
          enableSeconds: true,
          noCalendar: true,
          dateFormat: "h:i:S K",
          defaultDate: "3:05:03 PM",
        });

        expect(fp.selectedDates[0]).toBeDefined();
        expect(fp.selectedDates[0].getHours()).toBe(15);
        expect(fp.selectedDates[0].getMinutes()).toBe(5);
        expect(fp.selectedDates[0].getSeconds()).toBe(3);

        expect(fp.amPM).toBeDefined();
        fp.amPM && expect(fp.amPM.innerHTML).toBe("PM");
      });

      it("should parse defaultHour", () => {
        createInstance({
          enableTime: true,
          noCalendar: true,
          defaultHour: 0,
        });

        expect((fp.hourElement as HTMLInputElement).value).toEqual("12");

        createInstance({
          enableTime: true,
          noCalendar: true,
          defaultHour: 12,
        });

        expect((fp.hourElement as HTMLInputElement).value).toEqual("12");

        createInstance({
          enableTime: true,
          noCalendar: true,
          defaultHour: 23,
          time_24hr: true,
        });

        expect((fp.hourElement as HTMLInputElement).value).toEqual("23");
      });

      it("should parse string which has meridian indicator before hour", () => {
        createInstance({
          enableTime: true,
          noCalendar: true,
          dateFormat: "Kh時",
          defaultDate: "午後3時",
          locale: Japanese,
        });

        expect(fp.selectedDates[0]).toBeDefined();
        expect(fp.selectedDates[0].getHours()).toBe(15);
      });
    });
  });

  describe("date formatting", () => {
    describe("default formatter", () => {
      const DEFAULT_FORMAT_1 = "d.m.y H:i:S",
        DEFAULT_FORMAT_2 = "D j F, 'y",
        DEFAULT_FORMAT_3 = "Y-m-d";

      it(`should format the date with the pattern "${DEFAULT_FORMAT_1}"`, () => {
        const RESULT = "20.10.16 09:19:59";
        createInstance({
          dateFormat: DEFAULT_FORMAT_1,
        });

        fp.setDate("20.10.16 09:19:59");
        expect(fp.input.value).toEqual(RESULT);
        fp.setDate("2015.11.21 19:29:49");
        expect(fp.input.value).not.toEqual(RESULT);
      });

      it("should format dates for year 0001", () => {
        const RESULT = "0001-07-15";
        createInstance({
          dateFormat: DEFAULT_FORMAT_3,
        });

        fp.setDate("0001-07-15");
        expect(fp.input.value).toEqual(RESULT);
      });

      it(`should format the date with the pattern "${DEFAULT_FORMAT_2}"`, () => {
        const RESULT = "Thu 20 October, '16";
        createInstance({
          dateFormat: DEFAULT_FORMAT_2,
        });

        fp.setDate("Thu 20 October, '16");
        expect(fp.input.value).toEqual(RESULT);
        fp.setDate("2015-11-21T19:29:49Z");
        expect(fp.input.value).not.toEqual(RESULT);
      });
    });

    describe("custom formatter", () => {
      it("should format the date using the custom formatter", () => {
        const RESULT = "MAAAGIC.*^*.2016.*^*.20.*^*.10";
        createInstance({
          dateFormat: "YEAR-DAYOFMONTH-MONTH",
          formatDate(date, formatStr) {
            let segs = formatStr.split("-");
            return (
              "MAAAGIC.*^*." +
              segs
                .map((seg) => {
                  let mapped = null;
                  switch (seg) {
                    case "DAYOFMONTH":
                      mapped = date.getDate();
                      break;
                    case "MONTH":
                      mapped = date.getMonth() + 1;
                      break;
                    case "YEAR":
                      mapped = date.getFullYear();
                      break;
                  }
                  return "" + mapped;
                })
                .join(".*^*.")
            );
          },
        });

        fp.setDate(new Date(2016, 9, 20));
        expect(fp.input.value).toEqual(RESULT);

        fp.setDate(new Date(2016, 10, 20));
        expect(fp.input.value).not.toEqual(RESULT);
      });
    });
  });

  describe("API", () => {
    it("changeMonth()", () => {
      createInstance({
        defaultDate: "2016-12-20",
      });

      fp.changeMonth(1);
      expect(fp.currentYear).toEqual(2017);

      fp.changeMonth(-1);
      expect(fp.currentYear).toEqual(2016);

      fp.changeMonth(2);
      expect(fp.currentMonth).toEqual(1);
      expect(fp.currentYear).toEqual(2017);

      fp.changeMonth(14);
      expect(fp.currentYear).toEqual(2018);
      expect(fp.currentMonth).toEqual(3);
    });

    it("destroy()", () => {
      let fired = false;
      const input = fp.input;

      createInstance({
        altInput: true,
        onKeyDown: [
          () => {
            fired = true;
          },
        ],
      });

      expect(input.type).toEqual("hidden");

      fp.open();
      fp.altInput &&
        simulate("keydown", fp.altInput, { keyCode: 37, bubbles: true }); // "ArrowLeft"
      expect(fired).toEqual(true);

      fp.destroy();

      expect(input.type).toEqual("text");
      expect(fp.altInput).toBeUndefined();
      expect(fp.config).toBeUndefined();

      fired = false;

      simulate("keydown", input, { keyCode: 37, bubbles: true }); // "ArrowLeft"
      simulate("keydown", document.body, { keyCode: 37, bubbles: true }); // "ArrowLeft"
      expect(fired).toEqual(false);
    });

    it("set (option, value)", () => {
      createInstance();
      fp.set("minDate", "2016-10-20");

      expect(fp.currentYearElement.min).toEqual("2016");
      expect(fp.config.minDate).toBeDefined();

      fp.set("minDate", null);
      expect(fp.currentYearElement.hasAttribute("min")).toEqual(false);

      fp.set("maxDate", "2016-10-20");

      expect(fp.config.maxDate).toBeDefined();
      expect(fp.currentYearElement.max).toEqual("2016");

      fp.set("maxDate", null);
      expect(fp.currentYearElement.hasAttribute("max")).toEqual(false);

      fp.set("mode", "range");
      expect(fp.config.mode).toEqual("range");

      const elem = document.createElement("div");
      fp.set("positionElement", elem);
      expect(fp._positionElement).toEqual(elem);
    });

    it("set() minDate/maxDate updates current view", () => {
      createInstance();
      const now = new Date();
      const nextMonth = new Date();
      nextMonth.setMonth(now.getMonth() + 1);

      expect(fp.currentMonth).toEqual(now.getMonth());

      fp.set("minDate", nextMonth);
      expect(fp.currentMonth).toEqual(nextMonth.getMonth());
    });

    it("setDate (date)", () => {
      createInstance({
        enableTime: true,
      });
      fp.setDate("2016-10-20 03:00");

      expect(fp.selectedDates[0]).toBeDefined();
      expect(fp.selectedDates[0].getFullYear()).toEqual(2016);
      expect(fp.selectedDates[0].getMonth()).toEqual(9);
      expect(fp.selectedDates[0].getDate()).toEqual(20);
      expect(fp.selectedDates[0].getHours()).toEqual(3);

      expect(fp.currentYear).toEqual(2016);
      expect(fp.currentMonth).toEqual(9);

      if (fp.hourElement && fp.minuteElement && fp.amPM) {
        expect(fp.hourElement.value).toEqual("03");
        expect(fp.minuteElement.value).toEqual("00");
        expect(fp.amPM.textContent).toEqual("AM");
      }

      fp.setDate(0);
      expect(fp.selectedDates[0]).toBeDefined();
      expect(fp.selectedDates[0].getFullYear()).toBeLessThan(1971);

      fp.setDate("");
      expect(fp.selectedDates[0]).not.toBeDefined();
    });

    it("has valid latestSelectedDateObj", () => {
      createInstance({
        defaultDate: "2016-10-01 3:30",
        enableTime: true,
      });

      expect(fp.latestSelectedDateObj).toBeDefined();
      if (fp.latestSelectedDateObj) {
        expect(fp.latestSelectedDateObj.getFullYear()).toEqual(2016);
        expect(fp.latestSelectedDateObj.getMonth()).toEqual(9);
        expect(fp.latestSelectedDateObj.getDate()).toEqual(1);
      }

      if (fp.hourElement && fp.minuteElement && fp.amPM) {
        expect(fp.hourElement.value).toEqual("03");
        expect(fp.minuteElement.value).toEqual("30");
        expect(fp.amPM.textContent).toEqual("AM");
      }

      fp.setDate("2016-11-03 16:49");
      expect(fp.latestSelectedDateObj).toBeDefined();
      if (fp.latestSelectedDateObj) {
        expect(fp.latestSelectedDateObj.getFullYear()).toEqual(2016);
        expect(fp.latestSelectedDateObj.getMonth()).toEqual(10);
        expect(fp.latestSelectedDateObj.getDate()).toEqual(3);
      }

      if (fp.hourElement && fp.minuteElement && fp.amPM) {
        expect(fp.hourElement.value).toEqual("04");
        expect(fp.minuteElement.value).toEqual("49");
        expect(fp.amPM.textContent).toEqual("PM");
      }

      fp.setDate("");
      expect(fp.latestSelectedDateObj).toEqual(undefined);
    });

    it("parses dates in enable[] and disable[]", () => {
      createInstance({
        disable: [
          { from: "2016-11-20", to: "2016-12-20" },
          "2016-12-21",
          null as any,
        ],
        enable: [
          { from: "2016-11-20", to: "2016-12-20" },
          "2016-12-21",
          null as any,
        ],
      });

      expect(
        (fp.config.disable[0] as DateRangeLimit).from instanceof Date
      ).toBe(true);
      expect((fp.config.disable[0] as DateRangeLimit).to instanceof Date).toBe(
        true
      );
      expect(fp.config.disable[1] instanceof Date).toBe(true);

      expect(fp.config.disable.indexOf(null as any)).toBe(-1);

      expect(
        (fp.config.enable?.[0] as DateRangeLimit).from instanceof Date
      ).toBe(true);
      expect((fp.config.enable?.[0] as DateRangeLimit).to instanceof Date).toBe(
        true
      );
      expect(fp.config.enable?.[1] instanceof Date).toBe(true);

      expect(fp.config.enable?.indexOf(null as any)).toBe(-1);
    });

    describe("documentClick", () => {
      it("should close popup", () => {
        createInstance({
          mode: "range",
        });

        simulate("focus", fp._input, { which: 1, bubbles: true }, CustomEvent);
        fp._input.focus();

        expect(fp.isOpen).toBe(true);
        simulate("mousedown", window.document.body, { which: 1 }, CustomEvent);
        fp._input.blur();

        expect(fp.isOpen).toBe(false);
        expect(fp.calendarContainer.classList.contains("open")).toBe(false);

        expect(fp.selectedDates.length).toBe(0);
      });

      it("should set and clear the selectedDates", () => {
        createInstance({
          mode: "range",
        });

        simulate("focus", fp._input);
        simulate(
          "click",
          fp.days.childNodes[15],
          { which: 1, bubbles: true },
          CustomEvent
        );
        expect(fp.selectedDates.length).toBe(1);

        fp.isOpen = true;
        simulate("mousedown", window.document.body, { which: 1 }, CustomEvent);
        expect(fp.isOpen).toBe(false);
        expect(fp.selectedDates.length).toBe(0);
        expect(fp._input.value).toBe("");
      });

      it("should revert invalid date before closing #2089", () => {
        // To supress console.warn
        jest.spyOn(console, "warn").mockImplementation(() => {});

        createInstance({
          allowInput: true,
          defaultDate: ["2020-01-22", "2020-01-28"],
          mode: "range",
        });

        simulate("focus", fp._input);
        fp._input.value = "test";
        simulate("mousedown", window.document.body, { which: 1 }, CustomEvent);
        expect(fp.isOpen).toBe(false);
        expect(fp.selectedDates.length).toBe(0);
        expect(fp._input.value).toBe("");
      });

      it("should use altFormat when altInput is enabled", () => {
        createInstance({
          allowInput: true,
          altInput: true,
          altFormat: "j F Y",
          defaultDate: "2020-01-22",
        });

        expect(fp.selectedDates[0]).toEqual(new Date("2020-01-22T00:00:00"));
        simulate("focus", fp._input);
        simulate("mousedown", window.document.body, { which: 1 }, CustomEvent);
        expect(fp.isOpen).toBe(false);
        expect(fp.selectedDates[0]).toEqual(new Date("2020-01-22T00:00:00"));
        expect(fp._input.value).toBe("22 January 2020");
      });

      it("should be updated correctly via mouse events when altInput is enabled #2653", () => {
        createInstance({
          allowInput: true,
          altInput: true,
          altFormat: "j F Y H:i",
          defaultDate: "2020-01-22 03:04",
          enableTime: true,
        });

        expect(fp.selectedDates[0]).toEqual(new Date("2020-01-22T03:04:00"));
        simulate("focus", fp._input);
        simulate("mousedown", window.document.body, { which: 1 }, CustomEvent);
        expect(fp.isOpen).toBe(false);
        expect(fp._input.value).toBe("22 January 2020 03:04");
      });

      it("should trigger onChange only once", () => {
        let timesFired = 0;

        createInstance({
          allowInput: true,
          altInput: true,
          altFormat: "j F Y H:i",
          enableTime: true,
          onChange: () => timesFired++,
        });

        simulate("focus", fp._input);
        fp._input.value = "22 January 2020 03:04";
        simulate("mousedown", window.document.body, { which: 1 }, CustomEvent);
        simulate("blur", fp._input);
        expect(fp.isOpen).toBe(false);
        expect(timesFired).toEqual(1);
      });
    });

    it("onKeyDown", () => {
      createInstance({
        enableTime: true,
        altInput: true,
      });

      fp.jumpToDate("2016-2-1");

      fp.open();
      (fp.days.childNodes[15] as HTMLSpanElement).focus();

      simulate(
        "keydown",
        fp.days.childNodes[15],
        {
          keyCode: 13, // "Enter"
        },
        KeyboardEvent
      );

      expect(fp.selectedDates.length).toBe(1);
      simulate(
        "keydown",
        fp.calendarContainer,
        {
          keyCode: 27, // "Escape"
        },
        KeyboardEvent
      );

      expect(fp.isOpen).toEqual(false);
    });

    it("onKeyDown: arrow nav", () => {
      jest.runAllTimers();
      createInstance({
        defaultDate: "2017-01-01",
      });

      fp.open();
      fp.input.focus();

      simulate("keydown", fp.calendarContainer, {
        // "ArrowRight"
        keyCode: 39,
        ctrlKey: true,
      });
      expect(fp.currentMonth).toBe(1);
      expect(fp.currentYear).toBe(2017);

      simulate("keydown", fp.calendarContainer, {
        // "ArrowLeft"
        keyCode: 37,
        ctrlKey: true,
      });
      simulate("keydown", fp.calendarContainer, {
        // "ArrowLeft"
        keyCode: 37,
        ctrlKey: true,
      });
      expect(fp.currentMonth).toBe(11);
      expect(fp.currentYear).toBe(2016);
    });

    it("onKeyDown closes flatpickr on Enter when allowInput set to true", () => {
      createInstance({
        enableTime: true,
        allowInput: true,
        altInput: true,
      });

      fp.jumpToDate("2016-2-1");

      fp.open();
      (fp.days.childNodes[15] as HTMLSpanElement).focus();

      simulate(
        "keydown",
        fp._input,
        {
          keyCode: 13, // "Enter"
        },
        KeyboardEvent
      );
      expect(fp.isOpen).toEqual(false);
    });

    it("enabling dates by function", () => {
      createInstance({
        enable: [(d) => d.getDate() === 6, new Date()],
        disable: [{ from: "2016-10-20", to: "2016-10-25" }],
      });

      expect(fp.isEnabled("2016-10-06")).toBe(true);
      expect(fp.isEnabled(new Date())).toBe(true);
      expect(fp.isEnabled("2016-10-20")).toBe(false);
      expect(fp.isEnabled("2016-10-22")).toBe(false);
      expect(fp.isEnabled("2016-10-25")).toBe(false);
    });

    describe("clear()", () => {
      it("resets currentMonth and currentYear", () => {
        createInstance({
          defaultDate: "2016-01-20",
        });

        fp.changeMonth(-1);

        expect(fp.currentMonth).toEqual(11);
        expect(fp.currentYear).toEqual(2015);

        fp.clear();

        expect(fp.currentMonth).toEqual(0);
        expect(fp.currentYear).toEqual(2016);
      });
    });

    it("triggers monthChange on jump", (done) => {
      const fp = createInstance({
        defaultDate: new Date(2019, 3, 17),
        onMonthChange: () => {
          expect(fp.currentMonth).toEqual(4);
          done();
        },
      });

      fp.jumpToDate(new Date(2019, 4, 17), true);
    });

    it("triggers yearChange on jump", (done) => {
      const fp = createInstance({
        defaultDate: new Date(2019, 3, 17),
        onYearChange: () => {
          expect(fp.currentYear).toEqual(2020);
          done();
        },
      });

      fp.jumpToDate(new Date(2020, 4, 17), true);
    });

    it("open() and clickOpens interaction", () => {
      const fp = createInstance({
        clickOpens: false,
      });

      simulate("click", fp._input);
      expect(fp.isOpen).toEqual(false);

      fp.open();
      expect(fp.isOpen).toEqual(true);
    });
  });

  describe("UI", () => {
    it("mode: multiple", () => {
      createInstance({
        mode: "multiple",
      });

      fp.jumpToDate("2017-1-1");
      fp.open();

      simulate("keydown", fp.days.childNodes[0], { keyCode: 13 }); // "Enter"
      expect(fp.selectedDates.length).toBe(1);

      simulate("keydown", fp.days.childNodes[0], { keyCode: 13 }); // "Enter"
      expect(fp.selectedDates.length).toBe(0);
    });

    it("switch month to selectedDate", () => {
      createInstance();
      fp.jumpToDate("2017-1-1");
      expect(fp.currentMonth).toBe(0);

      simulate("click", fp.days.childNodes[41], { which: 1 }, MouseEvent);
      expect(fp.selectedDates.length).toBe(1);
      expect(fp.currentMonth).toBe(1);
    });

    it("static calendar", () => {
      createInstance({
        static: true,
      });

      expect(fp.calendarContainer.classList.contains("static")).toBe(true);
      if (!fp.element.parentNode) return;
      expect(
        (fp.element.parentNode as Element).classList.contains(
          "flatpickr-wrapper"
        )
      ).toBe(true);
      expect(fp.element.parentNode.childNodes[0]).toEqual(fp.element);
      expect(fp.element.parentNode.childNodes[1]).toEqual(fp.calendarContainer);
    });

    it("range mode - no month jump", () => {
      createInstance({
        mode: "range",
        maxDate: "today",
        defaultDate: ["2019-02-01", "2019-02-27"],
      });

      fp.open();
      simulate("click", fp.prevMonthNav, { which: 1 }, CustomEvent);
      expect(fp.currentMonth).toEqual(0);

      simulate("click", fp.days.children[2], { which: 1 }, CustomEvent);
      expect(fp.currentMonth).toEqual(0);
    });

    it("sets the date on direct entry when allowInput is true - blur", () => {
      createInstance({ allowInput: true });
      expect(fp.selectedDates[0]).toBeUndefined();

      fp.input.focus();
      fp.input.value = "1999-12-31";
      fp.input.blur();

      expect(fp.selectedDates[0]).toBeDefined();
      expect(fp.selectedDates[0].getFullYear()).toEqual(1999);
      expect(fp.selectedDates[0].getMonth()).toEqual(11); // 11 === December
      expect(fp.selectedDates[0].getDate()).toEqual(31);
    });

    it("updates the date on direct entry when allowInput is true - blur", () => {
      createInstance({
        allowInput: true,
        enableTime: true,
        defaultDate: "2001-01-01 01:01",
      });
      expect(fp.selectedDates[0]).toBeDefined();
      expect(fp.selectedDates[0].getFullYear()).toEqual(2001);
      expect(fp.selectedDates[0].getMonth()).toEqual(0); // 0 === January
      expect(fp.selectedDates[0].getDate()).toEqual(1);
      expect(fp.selectedDates[0].getHours()).toEqual(1);
      expect(fp.selectedDates[0].getMinutes()).toEqual(1);

      fp.input.focus();
      fp.input.value = "1969-07-20 20:17";
      fp.input.blur();

      expect(fp.selectedDates[0]).toBeDefined();
      expect(fp.selectedDates[0].getFullYear()).toEqual(1969);
      expect(fp.selectedDates[0].getMonth()).toEqual(6); // 6 === July
      expect(fp.selectedDates[0].getDate()).toEqual(20);
      expect(fp.selectedDates[0].getHours()).toEqual(20);
      expect(fp.selectedDates[0].getMinutes()).toEqual(17);
    });

    it("sets the date on direct entry when allowInput is true - document click", () => {
      createInstance({ allowInput: true });
      expect(fp.selectedDates[0]).toBeUndefined();

      fp.input.focus();
      fp.input.value = "1999-12-31";
      clickOn(document.body);
      fp.input.blur();

      expect(fp.selectedDates[0]).toBeDefined();
      expect(fp.selectedDates[0].getFullYear()).toEqual(1999);
      expect(fp.selectedDates[0].getMonth()).toEqual(11); // 11 === December
      expect(fp.selectedDates[0].getDate()).toEqual(31);
    });

    it("updates the date on direct entry when allowInput is true - document click", () => {
      createInstance({
        allowInput: true,
        enableTime: true,
        defaultDate: "2001-01-01 01:01",
      });
      expect(fp.selectedDates[0]).toBeDefined();
      expect(fp.selectedDates[0].getFullYear()).toEqual(2001);
      expect(fp.selectedDates[0].getMonth()).toEqual(0); // 0 === January
      expect(fp.selectedDates[0].getDate()).toEqual(1);
      expect(fp.selectedDates[0].getHours()).toEqual(1);
      expect(fp.selectedDates[0].getMinutes()).toEqual(1);

      fp.input.focus();
      fp.input.value = "1969-07-20 20:17";
      clickOn(document.body);
      fp.input.blur();

      expect(fp.selectedDates[0]).toBeDefined();
      expect(fp.selectedDates[0].getFullYear()).toEqual(1969);
      expect(fp.selectedDates[0].getMonth()).toEqual(6); // 6 === July
      expect(fp.selectedDates[0].getDate()).toEqual(20);
      expect(fp.selectedDates[0].getHours()).toEqual(20);
      expect(fp.selectedDates[0].getMinutes()).toEqual(17);
    });

    describe("mobile calendar", () => {
      describe(".isMobile", () => {
        it("returns true", () => {
          mockAgent = "Android";
          createInstance();

          expect(fp.isMobile).toBe(true);
        });
      });

      describe("init", () => {
        it("with value", () => {
          mockAgent = "Android";
          createInstance({
            enableTime: true,
          });

          const mobileInput = fp.mobileInput as HTMLInputElement;
          mobileInput.value = "2016-10-20T02:30";
          simulate("change", mobileInput);

          expect(fp.selectedDates.length).toBe(1);
          expect(fp.latestSelectedDateObj).toBeDefined();

          if (!fp.latestSelectedDateObj) return;
          expect(fp.latestSelectedDateObj.getFullYear()).toBe(2016);
          expect(fp.latestSelectedDateObj.getMonth()).toBe(9);
          expect(fp.latestSelectedDateObj.getDate()).toBe(20);
          expect(fp.latestSelectedDateObj.getHours()).toBe(2);
          expect(fp.latestSelectedDateObj.getMinutes()).toBe(30);
        });

        it("copy className and adds own", () => {
          const el = document.createElement("input");
          el.className = "foo bar";

          mockAgent = "Android";
          createInstance({}, el);

          const mobileInput = fp.mobileInput as HTMLInputElement;

          expect(mobileInput.classList).toContain("foo");
          expect(mobileInput.classList).toContain("bar");
          expect(mobileInput.classList).toContain("flatpickr-mobile");
        });

        describe("step attribute", () => {
          it("copy value if present", () => {
            const el = document.createElement("input");
            el.setAttribute("step", "3");

            mockAgent = "Android";
            createInstance({}, el);

            const mobileInput = fp.mobileInput as HTMLInputElement;

            expect(mobileInput.getAttribute("step")).toBe("3");
          });

          it("don't set a default value if not present", () => {
            const el = document.createElement("input");
            el.removeAttribute("step");

            mockAgent = "Android";
            createInstance({}, el);

            const mobileInput = fp.mobileInput as HTMLInputElement;

            expect(mobileInput.getAttribute("step")).toBe(null);
          });
        });

        it("with other attributes", () => {
          const el = document.createElement("input");
          el.placeholder = "foo";
          el.disabled = true;
          el.required = true;

          mockAgent = "Android";
          createInstance({}, el);

          const mobileInput = fp.mobileInput as HTMLInputElement;

          expect(mobileInput.placeholder).toBe("foo");
          expect(mobileInput.disabled).toBe(true);
          expect(mobileInput.required).toBe(true);
        });

        it("with confirmDatePlugin", () => {
          mockAgent = "Android";
          createInstance({
            plugins: [confirmDatePlugin({})],
          });
        });
      });
    });

    it("selectDate() + onChange() through GUI", () => {
      function verifySelected(date: Date | undefined) {
        expect(date).toBeDefined();
        if (!date) return;
        expect(date.getFullYear()).toEqual(2016);
        expect(date.getMonth()).toEqual(9);
        expect(date.getDate()).toEqual(10);
      }

      createInstance({
        enableTime: true,
        defaultDate: "2016-10-01 3:30",
        onChange: (dates) => {
          if (dates.length) verifySelected(dates[0]);
        },
      });

      fp.open();
      simulate("click", fp.days.childNodes[15], { which: 1 }, MouseEvent); // oct 10

      verifySelected(fp.selectedDates[0]);
    });

    it("year input", () => {
      createInstance();
      fp.currentYearElement.value = "2000";
      simulate("keyup", fp.currentYearElement, KeyboardEvent);

      expect(fp.currentYear).toEqual(2000);
      incrementTime("currentYearElement", 1);

      expect(fp.currentYear).toEqual(2001);
      expect(fp.currentYearElement.value).toEqual("2001");
      expect(
        (fp.days.childNodes[10] as DayElement).dateObj.getFullYear()
      ).toEqual(2001);
    });

    it("time input and increments", () => {
      createInstance({
        enableTime: true,
        defaultDate: "2017-1-1 10:00",
        //minDate: "2017-1-01 3:35",
      });

      expect(fp.hourElement).toBeDefined();
      expect(fp.minuteElement).toBeDefined();
      expect(fp.amPM).toBeDefined();

      if (!fp.hourElement || !fp.minuteElement || !fp.amPM) return;

      expect(fp.hourElement.value).toEqual("10");
      expect(fp.minuteElement.value).toEqual("00");
      expect(fp.amPM.textContent).toEqual("AM");

      incrementTime("hourElement", 1);
      expect(fp.hourElement.value).toEqual("11");

      incrementTime("minuteElement", 1);
      expect(fp.minuteElement.value).toEqual("05");

      simulate("click", fp.amPM, { which: 1 }, MouseEvent);
      expect(fp.amPM.textContent).toEqual("PM");

      simulate("increment", fp.hourElement, {
        delta: 1,
      });

      expect(fp.hourElement.value).toEqual("12");

      fp.hourElement.value = "9";
      simulate("input", fp.hourElement);
      simulate("blur", fp.hourElement);
      expect(fp.hourElement.value).toEqual("09");
    });

    it("time input respects minDate", () => {
      createInstance({
        enableTime: true,
        dateFormat: "Y-m-d H:i",
        defaultDate: "2017-1-1 4:00",
        minDate: "2017-1-01 3:35",
      });

      expect(!!fp.minDateHasTime).toBe(true);

      const [hourElem, minuteElem] = [
        fp.hourElement as HTMLInputElement,
        fp.minuteElement as HTMLInputElement,
      ];
      incrementTime("hourElement", -1);
      expect(hourElem.value).toEqual("03");
      expect(minuteElem.value).toEqual("35");

      incrementTime("hourElement", -1);
      expect(hourElem.value).toEqual("03"); // unchanged

      incrementTime("minuteElement", -1);
      expect(minuteElem.value).toEqual("35"); // can't go lower than min

      incrementTime("minuteElement", 1);
      expect(minuteElem.value).toEqual("40");

      hourElem.value = "2";
      simulate("input", hourElem);

      simulate("blur", hourElem);

      expect(hourElem.value).toEqual("03");

      minuteElem.value = "00";
      simulate("input", minuteElem);
      simulate("blur", minuteElem);
      expect(minuteElem.value).toEqual("35");
    });

    it("time input respects maxDate", () => {
      createInstance({
        enableTime: true,
        defaultDate: "2017-1-1 3:00",
        maxDate: "2017-1-01 3:35",
      });

      const [hourElem, minuteElem] = [
        fp.hourElement as HTMLInputElement,
        fp.minuteElement as HTMLInputElement,
      ];

      incrementTime("hourElement", -1);
      expect(hourElem.value).toEqual("02"); // ok

      incrementTime("hourElement", 3);
      expect(hourElem.value).toEqual("03");

      incrementTime("minuteElement", 8);
      expect(minuteElem.value).toEqual("35"); // can't go higher than 35
    });

    it("time input respects same-day minDate/maxDate", () => {
      createInstance({
        enableTime: true,
        minDate: "2017-1-01 2:00 PM",
        maxDate: "2017-1-01 3:35 PM",
      });

      const [hourElem, minuteElem] = [
        fp.hourElement as HTMLInputElement,
        fp.minuteElement as HTMLInputElement,
      ];

      fp.setDate("2017-1-1 2:30 PM");

      incrementTime("hourElement", -1);

      simulate(
        "wheel",
        hourElem,
        {
          wheelDelta: -1,
        },
        MouseEvent
      );

      expect(hourElem.value).toEqual("02"); // ok

      incrementTime("hourElement", 4);
      expect(hourElem.value).toEqual("03");

      incrementTime("minuteElement", 8);
      simulate(
        "wheel",
        minuteElem,
        {
          wheelDelta: 1,
        },
        MouseEvent
      );

      expect(minuteElem.value).toEqual("35"); // can't go higher than 35
    });

    it("time picker: implicit selectedDate", () => {
      createInstance({
        enableTime: true,
        noCalendar: true,
      });

      expect(fp.selectedDates.length).toEqual(0);
      fp.open();
      incrementTime("minuteElement", 1);

      expect(fp.selectedDates.length).toEqual(1);
      expect(fp.selectedDates[0].getDate()).toEqual(new Date().getDate());
    });

    it("time picker: minDate", () => {
      createInstance({
        noCalendar: true,
        enableTime: true,
        dateFormat: "H:i",
        minDate: "23:59",
      });

      fp.open();

      simulate("increment", fp.minuteElement as Node, {
        delta: 1,
      });

      expect(fp.input.value.length).toBeGreaterThan(0);
    });

    it("getDefaultHours()", () => {
      const fp = createInstance({
        noCalendar: true,
        enableTime: true,
        dateFormat: "H:i",
        minDate: "02:30",
        defaultHour: 2,
        defaultMinute: 45,
      });
      const values = getDefaultHours(fp.config);
      expect(values.hours).toEqual(2);
      expect(values.minutes).toEqual(45);
      expect(fp.hourElement!.value).toEqual("02");
      expect(fp.minuteElement!.value).toEqual("45");
    });

    it("time picker: default hours/mins", () => {
      createInstance({
        noCalendar: true,
        enableTime: true,
        dateFormat: "H:i",
        minDate: "02:30",
        defaultHour: 2,
        defaultMinute: 45,
      });

      expect(fp.hourElement!.value).toEqual("02");
      expect(fp.minuteElement!.value).toEqual("45");

      fp.open();
      simulate("increment", fp.hourElement!, {
        delta: 1,
      });
      expect(fp.input.value).toEqual("03:45");

      createInstance({
        enableTime: true,
        minDate: new Date().setHours(2, 30),
        defaultHour: 12,
        defaultMinute: 45,
      });

      simulate("click", fp.todayDateElem as DayElement, { which: 1 });
      expect((fp.latestSelectedDateObj as Date).getHours()).toEqual(12);
      expect((fp.latestSelectedDateObj as Date).getMinutes()).toEqual(45);

      createInstance({
        enableTime: true,
        minDate: new Date().setHours(6, 30),
        defaultHour: 3,
        defaultMinute: 0,
      });

      simulate("click", fp.todayDateElem as DayElement, { which: 1 });
      expect((fp.latestSelectedDateObj as Date).getHours()).toEqual(6);
      expect((fp.latestSelectedDateObj as Date).getMinutes()).toEqual(30);
    });

    it("time picker: minDate + bounds", () => {
      createInstance({
        noCalendar: true,
        enableTime: true,
        dateFormat: "H:i",
        minDate: "02:30",
        defaultDate: "3:30",
      });

      fp.open();

      incrementTime("hourElement", -1);
      expect(fp.input.value).toEqual("02:30");

      incrementTime("hourElement", -1);
      expect(fp.input.value).toEqual("02:30");
    });

    it("time picker: minTime/maxTime reversed", () => {
      createInstance({
        enableTime: true,
        minTime: "05:30",
        maxTime: "03:30",
        defaultDate: "2021-07-01 1:29",
      });

      fp.open();

      expect(fp.input.value).toEqual("2021-07-01 01:29");

      incrementTime("hourElement", +1);
      expect(fp.input.value).toEqual("2021-07-01 02:29");

      incrementTime("hourElement", +1);
      expect(fp.input.value).toEqual("2021-07-01 03:29");

      incrementTime("hourElement", +1);
      expect(fp.input.value).toEqual("2021-07-01 05:30");

      incrementTime("hourElement", +1);
      expect(fp.input.value).toEqual("2021-07-01 06:30");

      incrementTime("hourElement", -1);
      incrementTime("hourElement", -1);
      incrementTime("hourElement", -1);
      expect(fp.input.value).toEqual("2021-07-01 05:30");
    });

    it("time picker: minDate/maxDate + preloading", () => {
      createInstance({
        enableTime: true,
        noCalendar: true,
        dateFormat: "H:i",
        minDate: "02:30",
        defaultDate: "3:30",
        defaultHour: 9,
      });

      const [hours, minutes, amPM] = [
        fp.hourElement as HTMLInputElement,
        fp.minuteElement as HTMLInputElement,
        fp.amPM as HTMLSpanElement,
      ];

      expect(hours.value).toBe("03");
      expect(minutes.value).toBe("30");
      expect(amPM.textContent).toBe("AM");

      incrementTime("hourElement", -1);
      expect(hours.value).toBe("02");

      fp.set("maxDate", "04:30");
      incrementTime("hourElement", 3);
      expect(hours.value).toBe("04");

      simulate("click", amPM, { which: 1 }, MouseEvent);
      expect(amPM.textContent).toBe("AM");

      fp.clear();

      fp.setDate("03:30");
      expect(hours.value).toBe("03");

      fp.setDate("05:30");
      // date exceeds maxDate - value is reset to maxDate's
      expect(hours.value).toBe("04");

      fp.setDate("00:30");
      // date lower than minDate - value is reset to defaultHour
      // since defaultHour > maxDate, value is reset to maxDate
      expect(hours.value).toBe("04");
    });

    it("should delay time input validation on keydown", () => {
      createInstance({
        enableTime: true,
        defaultDate: new Date().setHours(17, 30, 0, 0),
        minDate: new Date().setHours(16, 30, 0, 0),
        time_24hr: true,
      });

      const hours = fp.hourElement as HTMLInputElement;

      hours.value = "16";
      simulate("input", hours, {}, KeyboardEvent);

      jest.runAllTimers();
      expect(hours.value).toEqual("16");

      hours.value = "1";

      simulate("input", hours);
      expect(hours.value).toEqual("1");
      simulate("blur", hours);
      expect(hours.value).toEqual("16");
    });

    it("should have working strap mode", () => {
      let wrapper = document.createElement("div");
      const input = document.createElement("input");
      input.setAttribute("data-input", "");

      wrapper.appendChild(input);

      ["open", "close", "toggle", "clear"].forEach((type) => {
        let e = document.createElement("button");
        e.setAttribute(`data-${type}`, "");
        wrapper.appendChild(e);
      });

      const instance = createInstance(
        {
          wrap: true,
        },
        wrapper
      );

      expect(instance.input).toEqual(input);

      simulate("click", wrapper.childNodes[1], { which: 1 }, MouseEvent); // open
      expect(instance.isOpen).toEqual(true);

      simulate("click", wrapper.childNodes[2], { which: 1 }, MouseEvent); // close
      expect(instance.isOpen).toEqual(false);

      simulate("click", wrapper.childNodes[3], { which: 1 }, MouseEvent); // toggle
      expect(instance.isOpen).toEqual(true);
      simulate("click", wrapper.childNodes[3], { which: 1 }, MouseEvent);
      expect(instance.isOpen).toEqual(false);

      instance.setDate(new Date());
      expect(instance.selectedDates.length).toEqual(1);

      expect(instance.selectedDateElem).toBeDefined();
      instance.selectedDateElem &&
        expect(
          parseInt(instance.selectedDateElem.textContent as string)
        ).toEqual(new Date().getDate());

      simulate("click", wrapper.childNodes[4], { which: 1 }, MouseEvent); // clear
      expect(instance.selectedDates.length).toEqual(0);
      expect(instance.input.value).toEqual("");

      instance.destroy();
      wrapper.parentNode && wrapper.parentNode.removeChild(wrapper);
    });

    it("Time picker initial entry", () => {
      const fp = createInstance({
        enableTime: true,
        noCalendar: true,
        dateFormat: "H:i",
        time_24hr: true,
      });
      fp._input.click();
      fp.hourElement!.value = "16";

      simulate(
        "keydown",
        fp.hourElement!,
        {
          keyCode: 13, // "Enter"
        },
        KeyboardEvent
      );

      expect(fp.hourElement!.value).toEqual("16");
    });

    it("valid mouseover behavior in range mode", () => {
      createInstance({
        mode: "range",
      });

      const day = (i: number) => fp.days.childNodes[i] as DayElement;

      simulate("mouseover", fp.days.childNodes[15]);
      expect(fp.selectedDates.length).toEqual(0);

      fp.setDate("2016-1-17");
      expect(fp.selectedDates.length).toEqual(1);

      simulate("mouseover", fp.days.childNodes[32]);
      expect(day(21).classList.contains("startRange")).toEqual(true);

      for (let i = 0; i < 42; i++)
        expect(day(i).classList.contains("inRange")).toEqual(i > 21 && i < 32);

      expect(day(32).classList.contains("endRange")).toEqual(true);

      fp.clear();
      fp.set("disable", ["2016-1-12", "2016-1-20"]);
      fp.setDate("2016-1-17");

      simulate("mouseover", day(32));
      expect(day(32).classList.contains("endRange")).toEqual(false);
      expect(day(24).classList.contains("flatpickr-disabled")).toEqual(true);
      expect(day(25).classList.contains("notAllowed")).toEqual(true);

      for (let i = 25; i < 32; i++)
        expect(day(i).classList.contains("inRange")).toEqual(false);

      for (let i = 17; i < 22; i++) {
        expect(day(i).classList.contains("notAllowed")).toEqual(false);
        expect(day(i).classList.contains("flatpickr-disabled")).toEqual(false);
      }

      simulate("click", fp.days.childNodes[17], { which: 1 }, MouseEvent);
      expect(fp.selectedDates.length).toEqual(2);
      expect(fp.input.value).toEqual("2016-01-13 to 2016-01-17");
    });

    it("adds disabled class to disabled prev/next month arrows", () => {
      const isArrowDisabled = (which: "prevMonthNav" | "nextMonthNav") =>
        fp[which].classList.contains("flatpickr-disabled");
      createInstance({
        minDate: "2099-1-1",
        maxDate: "2099-3-4",
        inline: true,
      });

      expect(fp.currentMonth).toBe(0);
      expect(isArrowDisabled("prevMonthNav")).toBe(true);
      expect(isArrowDisabled("nextMonthNav")).toBe(false);

      simulate("click", fp.nextMonthNav, { which: 1 }, MouseEvent);

      expect(fp.currentMonth).toBe(1);
      expect(isArrowDisabled("prevMonthNav")).toBe(false);
      expect(isArrowDisabled("nextMonthNav")).toBe(false);

      simulate("click", fp.nextMonthNav, { which: 1 }, MouseEvent);

      expect(fp.currentMonth).toBe(2);
      expect(isArrowDisabled("prevMonthNav")).toBe(false);
      expect(isArrowDisabled("nextMonthNav")).toBe(true);
    });

    it("idempotent on focus in and out", () => {
      createInstance({
        allowInput: true,
      });

      fp._input.focus();
      clickOn(document.body);
      expect(fp._input.value).toEqual("");
    });

    it("time-picker focuses out onto input", () => {
      createInstance({ mode: "time" });
      fp.open();

      expect(fp.hourElement).toBeDefined();
      expect(fp.minuteElement).toBeDefined();
      expect(fp.amPM).toBeDefined();

      if (!fp.hourElement || !fp.minuteElement || !fp.amPM) return;

      fp.minuteElement.focus();
      expect(document.activeElement).toStrictEqual(fp.minuteElement);

      simulate(
        "keydown",
        fp.minuteElement,
        {
          keyCode: 9, // Tab
        },
        KeyboardEvent
      );
      expect(document.activeElement).toStrictEqual(fp.amPM);

      simulate(
        "keydown",
        fp.amPM,
        {
          keyCode: 9, // Tab
          shiftKey: true,
        },
        KeyboardEvent
      );
      expect(document.activeElement).toStrictEqual(fp.minuteElement);

      simulate(
        "keydown",
        fp.amPM,
        {
          keyCode: 9, // Tab
        },
        KeyboardEvent
      );
      expect(document.activeElement).toStrictEqual(fp._input);
    });

    it("dropdown should correctly load months with minDate", () => {
      const fp = createInstance({
        defaultDate: new Date(2019, 5, 11),
        minDate: new Date(2019, 4, 11),
      }) as Instance;

      const monthsDropdown = fp.calendarContainer.querySelector(
        ".flatpickr-monthDropdown-months"
      );

      expect(monthsDropdown).toBeTruthy();
      if (!monthsDropdown) return;

      const months = monthsDropdown.querySelectorAll(
        ".flatpickr-monthDropdown-month"
      );

      expect(months.length).toEqual(8);
      if (months.length != 8) return;

      expect(months[0].innerHTML).toEqual("May");
      expect(months[7].innerHTML).toEqual("December");
    });

    it("dropdown should correctly load months with maxDate", () => {
      const fp = createInstance({
        defaultDate: new Date(2019, 4, 11),
        maxDate: new Date(2019, 8, 11),
      }) as Instance;

      const monthsDropdown = fp.calendarContainer.querySelector(
        ".flatpickr-monthDropdown-months"
      );

      expect(monthsDropdown).toBeTruthy();
      if (!monthsDropdown) return;

      const months = monthsDropdown.querySelectorAll(
        ".flatpickr-monthDropdown-month"
      );

      expect(months.length).toEqual(9);
      if (months.length != 9) return;

      expect(months[0].innerHTML).toEqual("January");
      expect(months[months.length - 1].innerHTML).toEqual("September");
    });

    it("dropdown should change month", () => {
      const fp = createInstance({
        defaultDate: new Date(2019, 1, 1),
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

  describe("Localization", () => {
    it("By locale config option", () => {
      createInstance({
        locale: Russian,
      });

      expect(fp.l10n.months.longhand[0]).toEqual("Январь");

      createInstance();
      expect(fp.l10n.months.longhand[0]).toEqual("January");
    });

    it("By overriding default locale", () => {
      flatpickr.localize(Russian);
      expect(flatpickr.l10ns.default.months.longhand[0]).toEqual("Январь");

      createInstance();
      expect(fp.l10n.months.longhand[0]).toEqual("Январь");
    });

    it("correctly formats altInput", () => {
      createInstance({
        locale: Russian,
        altInput: true,
        altFormat: "F",
        dateFormat: "Z",
        defaultDate: "2016-12-27T16:16:22.585Z",
      });

      const altInput = fp.altInput as HTMLInputElement;
      expect(altInput.value).toEqual("Декабрь");

      fp.destroy();

      createInstance({
        locale: "en",
        altInput: true,
        altFormat: "F",
        defaultDate: "2016-12-27T16:16:22.585Z",
      });
      expect((fp.altInput as HTMLInputElement).value).toEqual("December");
    });
  });

  describe("events + hooks", () => {
    describe("onOpen", () => {
      it("should fire only once", () => {
        let timesFired = 0;

        const fp = createInstance({
          onOpen: () => timesFired++,
        });

        fp.open();
        expect(timesFired).toEqual(1);
      });
    });
    describe("onBlur", () => {
      it("doesn't misfire", () => {
        let timesFired = 0;
        const fp = createInstance({
          allowInput: true,
          onChange: () => timesFired++,
        });
        fp._input.focus();
        simulate("blur", fp._input);
        expect(timesFired).toEqual(0);
      });
    });
  });

  describe("server-side rendering", () => {
    it("can be imported", () => {
      expect(typeof flatpickr).toEqual("function");
    });
  });
});
