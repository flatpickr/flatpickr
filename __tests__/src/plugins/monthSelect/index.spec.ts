import flatpickr from "index";
import monthSelectPlugin from "plugins/monthSelect/index";
import { German } from "l10n/de";
import { Instance } from "types/instance";
import { Options } from "types/options";

flatpickr.defaultConfig.animate = false;

jest.useFakeTimers();

describe("monthSelect", () => {
  // memoized instance
  const fp = (): Instance => {
    return (fpInstance =
      fpInstance ||
      flatpickr(document.createElement("input"), {
        plugins: [monthSelectPlugin({})],
        ...options,
      }));
  };

  let fpInstance: Instance | undefined;
  let options: Options;

  const getPrevButton = (): Element => {
    return fp().monthNav.querySelector(".flatpickr-prev-month")!;
  };

  const getNextButton = (): Element => {
    return fp().monthNav.querySelector(".flatpickr-next-month")!;
  };

  beforeEach(() => {
    fpInstance = undefined;
    options = {};
  });

  describe("with explicit defaultDate", () => {
    beforeEach(() => {
      options = { defaultDate: new Date("2019-03-20") };
    });

    it("preloads defaultDate", () => {
      expect(fp().input.value).toEqual("March 2019");
    });

    describe("and locale", () => {
      beforeEach(() => {
        options = {
          defaultDate: new Date("2019-03-20"),
          locale: German,
        };
      });

      it("preloads defaultDate", () => {
        expect(fp().input.value).toEqual("März 2019");
      });

      describe("and custom date format", () => {
        beforeEach(() => {
          options = {
            defaultDate: new Date("2019-03-20"),
            locale: German,
            plugins: [monthSelectPlugin({ dateFormat: "m.y" })],
          };
        });

        it("preloads defaultDate", () => {
          expect(fp().input.value).toEqual("03.19");
        });
      });
    });

    describe("and altInput with custom formats", () => {
      beforeEach(() => {
        options = {
          defaultDate: new Date("2019-03-20"),
          altInput: true,
          plugins: [monthSelectPlugin({ dateFormat: "m.y", altFormat: "m y" })],
        };
      });

      it("preloads defaultDate and altInput", () => {
        expect(fp().input.value).toEqual("03.19");
        expect(fp().altInput).toBeDefined();
        expect(fp().altInput!.value).toEqual("03 19");
      });
    });
  });

  describe("year nav", () => {
    describe("next/prev year buttons", () => {
      const thisYear = new Date().getFullYear();

      it("updates year value shown to user #2277", () => {
        getPrevButton().dispatchEvent(new MouseEvent("click"));
        expect(fp().currentYearElement.value).toEqual(`${thisYear - 1}`);

        getNextButton().dispatchEvent(new MouseEvent("click"));
        getNextButton().dispatchEvent(new MouseEvent("click"));
        expect(fp().currentYearElement.value).toEqual(`${thisYear + 1}`);
      });

      describe("when current month is not Jan/Dec (#2275)", () => {
        beforeEach(() => {
          options = { defaultDate: new Date(`${thisYear}-03-20`) };
        });

        it("increments/decrements .currentYear property", () => {
          getPrevButton().dispatchEvent(new MouseEvent("click"));
          expect(fp().currentYear).toEqual(thisYear - 1);

          getNextButton().dispatchEvent(new MouseEvent("click"));
          expect(fp().currentYear).toEqual(thisYear);
        });
      });

      describe("with minDate/maxDate options (#2279)", () => {
        beforeEach(() => {
          options = {
            minDate: `${thisYear - 1}-03-20`,
            maxDate: `${thisYear + 1}-03-20`,
          };
        });

        it("prohibits paging beyond them", () => {
          getPrevButton().dispatchEvent(new MouseEvent("click"));
          expect(getPrevButton().classList).toContain("flatpickr-disabled");

          getNextButton().dispatchEvent(new MouseEvent("click"));
          getNextButton().dispatchEvent(new MouseEvent("click"));
          expect(getNextButton().classList).toContain("flatpickr-disabled");
        });
      });

      describe("when in range mode, after abandoning input", () => {
        beforeEach(() => {
          options = {
            mode: "range",
            minDate: `${thisYear - 1}-03-20`,
          };

          fp().input.dispatchEvent(new MouseEvent("click")); // open flatpickr

          fp()
            .rContainer!.querySelectorAll(".flatpickr-monthSelect-month")![1]
            .dispatchEvent(new MouseEvent("click")); // pick start date

          document.dispatchEvent(new MouseEvent("click")); // abandon input
        });

        it("still honors minDate options", () => {
          getPrevButton().dispatchEvent(new MouseEvent("click"));
          expect(getPrevButton().classList).toContain("flatpickr-disabled");
        });
      });
    });
  });

  describe("month cell styling", () => {
    describe("for current month of current year ('today' cell)", () => {
      const getTodayCell = (): Element | null | undefined =>
        fp().rContainer?.querySelector(".today");
      const currentMonth = fp().l10n.months.longhand[new Date().getMonth()];

      it("applies .today CSS class", () => {
        expect(getTodayCell()?.textContent).toEqual(currentMonth);

        getPrevButton().dispatchEvent(new MouseEvent("click"));
        expect(getTodayCell()).toBeNull();

        getNextButton().dispatchEvent(new MouseEvent("click"));
        expect(getTodayCell()?.textContent).toEqual(currentMonth);
      });
    });

    describe("for selected cells", () => {
      const getSelectedCell = (): Element | null | undefined =>
        fp().rContainer?.querySelector(".selected");

      const getSelectionTarget = (): Element | null | undefined =>
        fp().rContainer!.querySelector(
          ".flatpickr-monthSelect-month:nth-child(6)"
        )!;

      it("applies .selected CSS class", () => {
        expect(getSelectedCell()).toBeNull();

        getSelectionTarget()?.dispatchEvent(new MouseEvent("click"));
        expect(getSelectedCell()?.textContent).toEqual("June");

        getPrevButton().dispatchEvent(new MouseEvent("click"));
        expect(getSelectedCell()).toBeNull();

        getNextButton().dispatchEvent(new MouseEvent("click"));
        expect(getSelectedCell()?.textContent).toEqual("June");
      });
    });
  });

  describe("range mode", () => {
    const getMonthCells = (): NodeListOf<Element> => {
      return fp().rContainer!.querySelectorAll(".flatpickr-monthSelect-month")!;
    };

    describe("after first selection/click", () => {
      beforeEach(() => {
        options = { mode: "range" };

        fp().input.dispatchEvent(new MouseEvent("click")); // open flatpickr
        getMonthCells()[1].dispatchEvent(new MouseEvent("click"));
      });

      it("keeps calendar open until second selection/click", () => {
        expect(fp().calendarContainer.classList).toContain("open");

        getMonthCells()[5].dispatchEvent(new MouseEvent("click"));
        expect(fp().calendarContainer.classList).not.toContain("open");
      });

      describe("when hovering over other another month cell", () => {
        beforeEach(() => {
          getMonthCells()[5].dispatchEvent(
            new MouseEvent("mouseover", { bubbles: true })
          );
        });

        it("highlights all cells in the tentative range", () => {
          expect(getMonthCells()[1].classList).toContain("startRange");

          Array.from(getMonthCells())
            .slice(2, 5)
            .forEach((cell) => {
              expect(cell.classList).toContain("inRange");
            });

          expect(getMonthCells()[5].classList).toContain("endRange");
        });

        describe("and then prematurely abandoning input", () => {
          describe("by clicking out", () => {
            beforeEach(() => {
              document.dispatchEvent(new MouseEvent("mousedown")); // close flatpickr
            });

            it("clears the highlighting", () => {
              getMonthCells().forEach((cell) => {
                expect(cell.classList).not.toContain("startRange");
                expect(cell.classList).not.toContain("inRange");
                expect(cell.classList).not.toContain("endRange");
              });
            });
          });

          describe("by alt-tabbing out and back in", () => {
            beforeEach(() => {
              window.document.dispatchEvent(new FocusEvent("blur"));
              window.document.dispatchEvent(new FocusEvent("focus"));
            });

            it("clears the highlighting", () => {
              getMonthCells().forEach((cell) => {
                expect(cell.classList).not.toContain("startRange");
                expect(cell.classList).not.toContain("inRange");
                expect(cell.classList).not.toContain("endRange");
              });
            });
          });
        });
      });

      describe("when hovering over another month cell in a different year", () => {
        beforeEach(() => {
          getNextButton().dispatchEvent(new MouseEvent("click"));

          getMonthCells()[5].dispatchEvent(
            new MouseEvent("mouseover", { bubbles: true })
          );
        });

        it("highlights all visible cells in the tentative range", () => {
          Array.from(getMonthCells())
            .slice(0, 5)
            .forEach((cell) => {
              expect(cell.classList).toContain("inRange");
            });

          expect(getMonthCells()[5].classList).toContain("endRange");
        });
      });
    });

    describe("after two clicks (completed range selection)", () => {
      beforeEach(() => {
        options = { mode: "range" };

        fp().input.dispatchEvent(new MouseEvent("click")); // open flatpickr
        getMonthCells()[1].dispatchEvent(new MouseEvent("click"));
        getMonthCells()[5].dispatchEvent(new MouseEvent("click"));
      });

      describe("when clicking again to start over", () => {
        beforeEach(() => {
          fp().input.dispatchEvent(new MouseEvent("click")); // reopen flatpickr

          getMonthCells()[3].dispatchEvent(new MouseEvent("click"));
          getMonthCells()[3].dispatchEvent(
            new MouseEvent("mouseover", { bubbles: true })
          ); // class changes seem to be triggered by hover, not click...
        });

        it("clears the highlighting", () => {
          expect(getMonthCells()[3].classList).toContain("startRange");

          [
            ...Array.from(getMonthCells()).slice(0, 3),
            ...Array.from(getMonthCells()).slice(4),
          ].forEach((cell) => {
            expect(cell.classList).not.toContain("startRange");
            expect(cell.classList).not.toContain("inRange");
            expect(cell.classList).not.toContain("endRange");
          });
        });
      });
    });
  });
});
