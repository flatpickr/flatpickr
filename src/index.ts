/*! flatpickr v3.1.5, @license MIT */
import { Instance, FlatpickrFn, DayElement } from "types/instance";
import {
  Options,
  ParsedOptions,
  DateLimit,
  DateRangeLimit,
  DateOption,
  defaults as defaultOptions,
  Hook,
  HookKey,
} from "types/options";

import { Locale, CustomLocale, key as LocaleKey } from "types/locale";
import English from "l10n/default";

import {
  arrayify,
  debounce,
  int,
  mouseDelta,
  pad,
  IncrementEvent,
} from "utils";
import {
  clearNode,
  createElement,
  createNumberInput,
  findParent,
  toggleClass,
} from "utils/dom";
import { compareDates, duration, monthToStr } from "utils/dates";

import {
  token,
  RevFormatFn,
  revFormat,
  tokenRegex,
  formats,
} from "utils/formatting";

function FlatpickrInstance(
  element: HTMLElement,
  instanceConfig?: Options
): Instance {
  const self = {} as Instance;

  self.parseDate = parseDate;
  self.formatDate = formatDate;

  self._animationLoop = [];
  self._handlers = [];
  self._bind = bind;
  self._setHoursFromDate = setHoursFromDate;
  self.changeMonth = changeMonth;
  self.changeYear = changeYear;
  self.clear = clear;
  self.close = close;

  self._createElement = createElement;
  self.destroy = destroy;
  self.isEnabled = isEnabled;
  self.jumpToDate = jumpToDate;
  self.open = open;
  self.redraw = redraw;
  self.set = set;
  self.setDate = setDate;
  self.toggle = toggle;

  function setupHelperFunctions() {
    self.utils = {
      getDaysInMonth(month = self.currentMonth, yr = self.currentYear) {
        if (month === 1 && ((yr % 4 === 0 && yr % 100 !== 0) || yr % 400 === 0))
          return 29;

        return self.l10n.daysInMonth[month];
      },
    };
  }

  function init() {
    self.element = self.input = element as HTMLInputElement;
    self.isOpen = false;

    parseConfig();
    setupLocale();
    setupInputs();
    setupDates();
    setupHelperFunctions();

    if (!self.isMobile) build();

    bindEvents();

    if (self.selectedDates.length || self.config.noCalendar) {
      if (self.config.enableTime) {
        setHoursFromDate(
          self.config.noCalendar
            ? self.latestSelectedDateObj || self.config.minDate
            : undefined
        );
      }
      updateValue(false);
    }

    self.showTimeInput =
      self.selectedDates.length > 0 || self.config.noCalendar;

    if (self.weekWrapper !== undefined && self.daysContainer !== undefined) {
      self.calendarContainer.style.width =
        self.daysContainer.offsetWidth + self.weekWrapper.offsetWidth + "px";
    }

    if (!self.isMobile) positionCalendar();

    triggerEvent("onReady");
  }

  function bindToInstance<F extends Function>(fn: F): F {
    return fn.bind(self);
  }

  /**
   * The handler for all events targeting the time inputs
   */
  function updateTime(
    e: MouseEvent | WheelEvent | IncrementEvent | KeyboardEvent
  ) {
    if (self.config.noCalendar && !self.selectedDates.length) {
      // picking time only
      self.setDate(
        new Date().setHours(
          self.config.defaultHour,
          self.config.defaultMinute,
          self.config.defaultSeconds
        ),
        false
      );
      setHoursFromInputs();
      updateValue();
    }

    timeWrapper(e);
    if (self.selectedDates.length === 0) return;

    if (
      !self.minDateHasTime ||
      e.type !== "input" ||
      (e.target as HTMLInputElement).value.length >= 2
    ) {
      setHoursFromInputs();
      updateValue();
    } else {
      setTimeout(function() {
        setHoursFromInputs();
        updateValue();
      }, 1000);
    }
  }

  function ampm2military(hour: number, amPM: "AM" | "PM") {
    return hour % 12 + 12 * int(amPM === "PM");
  }

  function military2ampm(hour: number) {
    switch (hour % 24) {
      case 0:
      case 12:
        return 12;

      default:
        return hour % 12;
    }
  }

  /**
   * Syncs the selected date object time with user's time input
   */
  function setHoursFromInputs() {
    if (self.hourElement === undefined || self.minuteElement === undefined)
      return;

    let hours = (parseInt(self.hourElement.value.slice(-2), 10) || 0) % 24,
      minutes = (parseInt(self.minuteElement.value, 10) || 0) % 60,
      seconds =
        self.secondElement !== undefined
          ? (parseInt(self.secondElement.value, 10) || 0) % 60
          : 0;

    if (self.amPM !== undefined)
      hours = ampm2military(hours, self.amPM.textContent as "AM" | "PM");

    if (
      self.config.minDate &&
      self.minDateHasTime &&
      self.latestSelectedDateObj &&
      compareDates(self.latestSelectedDateObj, self.config.minDate) === 0
    ) {
      hours = Math.max(hours, self.config.minDate.getHours());
      if (hours === self.config.minDate.getHours())
        minutes = Math.max(minutes, self.config.minDate.getMinutes());
    }

    if (
      self.config.maxDate &&
      self.maxDateHasTime &&
      self.latestSelectedDateObj &&
      compareDates(self.latestSelectedDateObj, self.config.maxDate) === 0
    ) {
      hours = Math.min(hours, self.config.maxDate.getHours());
      if (hours === self.config.maxDate.getHours())
        minutes = Math.min(minutes, self.config.maxDate.getMinutes());
    }

    setHours(hours, minutes, seconds);
  }

  /**
   * Syncs time input values with a date
   */
  function setHoursFromDate(dateObj?: Date) {
    const date = dateObj || self.latestSelectedDateObj;

    if (date) setHours(date.getHours(), date.getMinutes(), date.getSeconds());
  }

  /**
   * Sets the hours, minutes, and optionally seconds
   * of the latest selected date object and the
   * corresponding time inputs
   * @param {Number} hours the hour. whether its military
   *                 or am-pm gets inferred from config
   * @param {Number} minutes the minutes
   * @param {Number} seconds the seconds (optional)
   */
  function setHours(hours: number, minutes: number, seconds: number) {
    if (self.latestSelectedDateObj !== undefined) {
      self.latestSelectedDateObj.setHours(hours % 24, minutes, seconds || 0, 0);
    }

    if (!self.hourElement || !self.minuteElement || self.isMobile) return;

    self.hourElement.value = pad(
      !self.config.time_24hr
        ? (12 + hours) % 12 + 12 * int(hours % 12 === 0)
        : hours
    );

    self.minuteElement.value = pad(minutes);

    if (self.amPM !== undefined)
      self.amPM.textContent = hours >= 12 ? "PM" : "AM";

    if (self.secondElement !== undefined)
      self.secondElement.value = pad(seconds);
  }

  /**
   * Handles the year input and incrementing events
   * @param {Event} event the keyup or increment event
   */
  function onYearInput(event: KeyboardEvent & IncrementEvent) {
    const year =
      parseInt((event.target as HTMLInputElement).value) + (event.delta || 0);

    if (year.toString().length === 4 || event.key === "Enter") {
      self.currentYearElement.blur();
      if (!/[^\d]/.test(year.toString())) changeYear(year);
    }
  }

  /**
   * Essentially addEventListener + tracking
   * @param {Element} element the element to addEventListener to
   * @param {String} event the event name
   * @param {Function} handler the event handler
   */
  function bind<F extends EventListener, E extends Element | Window>(
    element: E | E[],
    event: string | string[],
    handler: F
  ): void {
    if (event instanceof Array)
      return event.forEach(ev => bind(element, ev, handler));

    if (element instanceof Array)
      return element.forEach(el => bind(el, event, handler));

    element.addEventListener(event, handler);
    self._handlers.push({ element: element as Element, event, handler });
  }

  /**
   * A mousedown handler which mimics click.
   * Minimizes latency, since we don't need to wait for mouseup in most cases.
   * Also, avoids handling right clicks.
   *
   * @param {Function} handler the event handler
   */
  function onClick<E extends MouseEvent>(
    handler: (e: E) => void
  ): (e: E) => void {
    return evt => evt.which === 1 && handler(evt);
  }

  function triggerChange() {
    triggerEvent("onChange");
  }

  /**
   * Adds all the necessary event listeners
   */
  function bindEvents(): void {
    if (self.config.wrap) {
      ["open", "close", "toggle", "clear"].forEach(evt => {
        Array.prototype.forEach.call(
          self.element.querySelectorAll(`[data-${evt}]`),
          (el: HTMLElement) =>
            bind(el, "click", self[
              evt as "open" | "close" | "toggle" | "clear"
            ] as EventListener)
        );
      });
    }

    if (self.isMobile) {
      setupMobile();
      return;
    }

    const debouncedResize = debounce(onResize, 50);
    self._debouncedChange = debounce(triggerChange, 300);

    if (self.config.mode === "range" && self.daysContainer)
      bind(self.daysContainer, "mouseover", e =>
        onMouseOver(e.target as DayElement)
      );

    bind(window.document.body, "keydown", onKeyDown);

    if (!self.config.static) bind(self._input, "keydown", onKeyDown);

    if (!self.config.inline && !self.config.static)
      bind(window, "resize", debouncedResize);

    if (window.ontouchstart !== undefined)
      bind(window.document.body, "touchstart", documentClick);

    bind(window.document.body, "mousedown", onClick(documentClick));
    bind(self._input, "blur", documentClick);

    if (self.config.clickOpens === true) {
      bind(self._input, "focus", self.open);
      bind(self._input, "mousedown", onClick(self.open));
    }

    if (self.daysContainer !== undefined) {
      self.monthNav.addEventListener("wheel", e => e.preventDefault());
      bind(self.monthNav, "wheel", debounce(onMonthNavScroll, 10));
      bind(self.monthNav, "mousedown", onClick(onMonthNavClick));

      bind(self.monthNav, ["keyup", "increment"], onYearInput);
      bind(self.daysContainer, "mousedown", onClick(selectDate));

      if (self.config.animate) {
        bind(
          self.daysContainer,
          ["webkitAnimationEnd", "animationend"],
          animateDays
        );
        bind(
          self.monthNav,
          ["webkitAnimationEnd", "animationend"],
          animateMonths
        );
      }
    }

    if (
      self.timeContainer !== undefined &&
      self.minuteElement !== undefined &&
      self.hourElement !== undefined
    ) {
      const selText = (e: FocusEvent) =>
        (e.target as HTMLInputElement).select();
      bind(self.timeContainer, ["wheel", "input", "increment"], updateTime);
      bind(self.timeContainer, "mousedown", onClick(timeIncrement));

      bind(self.timeContainer, ["wheel", "increment"], self._debouncedChange);
      bind(self.timeContainer, "input", triggerChange);

      bind([self.hourElement, self.minuteElement], ["focus", "click"], selText);

      if (self.secondElement !== undefined)
        bind(
          self.secondElement,
          "focus",
          () => self.secondElement && self.secondElement.select()
        );

      if (self.amPM !== undefined) {
        bind(
          self.amPM,
          "mousedown",
          onClick(e => {
            updateTime(e);
            triggerChange();
          })
        );
      }
    }
  }

  function processPostDayAnimation() {
    self._animationLoop.forEach(f => f());
    self._animationLoop = [];
  }

  /**
   * Removes the day container that slided out of view
   * @param {Event} e the animation event
   */
  function animateDays(e: AnimationEvent) {
    if (self.daysContainer && self.daysContainer.childNodes.length > 1) {
      switch (e.animationName) {
        case "fpSlideLeft":
          self.daysContainer.lastChild &&
            (self.daysContainer.lastChild as Element).classList.remove(
              "slideLeftNew"
            );
          self.daysContainer.removeChild(self.daysContainer
            .firstChild as Element);
          self.days = self.daysContainer.firstChild as HTMLDivElement;
          processPostDayAnimation();

          break;

        case "fpSlideRight":
          self.daysContainer.firstChild &&
            (self.daysContainer.firstChild as Element).classList.remove(
              "slideRightNew"
            );
          self.daysContainer.removeChild(self.daysContainer
            .lastChild as Element);
          self.days = self.daysContainer.firstChild as HTMLDivElement;
          processPostDayAnimation();

          break;

        default:
          break;
      }
    }
  }

  /**
   * Removes the month element that animated out of view
   * @param {Event} e the animation event
   */
  function animateMonths(e: AnimationEvent) {
    switch (e.animationName) {
      case "fpSlideLeftNew":
      case "fpSlideRightNew":
        self.navigationCurrentMonth.classList.remove("slideLeftNew");
        self.navigationCurrentMonth.classList.remove("slideRightNew");
        const nav = self.navigationCurrentMonth;

        while (
          nav.nextSibling &&
          /curr/.test((nav.nextSibling as Element).className)
        )
          self.monthNav.removeChild(nav.nextSibling);

        while (
          nav.previousSibling &&
          /curr/.test((nav.previousSibling as Element).className)
        )
          self.monthNav.removeChild(nav.previousSibling);

        self.oldCurMonth = undefined;
        break;
    }
  }

  /**
   * Set the calendar view to a particular date.
   * @param {Date} jumpDate the date to set the view to
   */
  function jumpToDate(jumpDate?: DateOption) {
    const jumpTo =
      jumpDate !== undefined
        ? parseDate(jumpDate)
        : self.latestSelectedDateObj ||
          (self.config.minDate && self.config.minDate > self.now
            ? self.config.minDate as Date
            : self.config.maxDate && self.config.maxDate < self.now
              ? self.config.maxDate
              : self.now);

    try {
      if (jumpTo !== undefined) {
        self.currentYear = jumpTo.getFullYear();
        self.currentMonth = jumpTo.getMonth();
      }
    } catch (e) {
      /* istanbul ignore next */
      console.error(e.stack);
      /* istanbul ignore next */
      console.warn("Invalid date supplied: " + jumpTo);
    }

    self.redraw();
  }

  /**
   * The up/down arrow handler for time inputs
   * @param {Event} e the click event
   */
  function timeIncrement(e: KeyboardEvent | MouseEvent) {
    if (~(e.target as Element).className.indexOf("arrow"))
      incrementNumInput(
        e,
        (e.target as Element).classList.contains("arrowUp") ? 1 : -1
      );
  }

  /**
   * Increments/decrements the value of input associ-
   * ated with the up/down arrow by dispatching an
   * "increment" event on the input.
   *
   * @param {Event} e the click event
   * @param {Number} delta the diff (usually 1 or -1)
   * @param {Element} inputElem the input element
   */
  function incrementNumInput(
    e: KeyboardEvent | MouseEvent | undefined,
    delta: number,
    inputElem?: HTMLInputElement
  ) {
    const target = e && (e.target as Element);
    const input =
      inputElem ||
      (target && target.parentNode && target.parentNode.firstChild);
    const event = createEvent("increment") as IncrementEvent;
    event.delta = delta;
    input && input.dispatchEvent(event);
  }

  function build() {
    const fragment = window.document.createDocumentFragment();
    self.calendarContainer = createElement<HTMLDivElement>(
      "div",
      "flatpickr-calendar"
    );
    self.calendarContainer.tabIndex = -1;

    if (!self.config.noCalendar) {
      fragment.appendChild(buildMonthNav());
      self.innerContainer = createElement<HTMLDivElement>(
        "div",
        "flatpickr-innerContainer"
      );

      if (self.config.weekNumbers) {
        const { weekWrapper, weekNumbers } = buildWeeks();
        self.innerContainer.appendChild(weekWrapper);
        self.weekNumbers = weekNumbers;
        self.weekWrapper = weekWrapper;
      }

      self.rContainer = createElement<HTMLDivElement>(
        "div",
        "flatpickr-rContainer"
      );
      self.rContainer.appendChild(buildWeekdays());

      if (!self.daysContainer) {
        self.daysContainer = createElement<HTMLDivElement>(
          "div",
          "flatpickr-days"
        );
        self.daysContainer.tabIndex = -1;
      }

      buildDays();

      self.rContainer.appendChild(self.daysContainer);
      self.innerContainer.appendChild(self.rContainer);
      fragment.appendChild(self.innerContainer);
    }

    if (self.config.enableTime) {
      fragment.appendChild(buildTime());
    }

    toggleClass(
      self.calendarContainer,
      "rangeMode",
      self.config.mode === "range"
    );
    toggleClass(self.calendarContainer, "animate", self.config.animate);

    self.calendarContainer.appendChild(fragment);

    const customAppend =
      self.config.appendTo !== undefined && self.config.appendTo.nodeType;

    if (self.config.inline || self.config.static) {
      self.calendarContainer.classList.add(
        self.config.inline ? "inline" : "static"
      );

      if (self.config.inline && !customAppend && self.element.parentNode) {
        self.element.parentNode.insertBefore(
          self.calendarContainer,
          self._input.nextSibling
        );
      }

      if (self.config.static) {
        const wrapper = createElement("div", "flatpickr-wrapper");
        if (self.element.parentNode)
          self.element.parentNode.insertBefore(wrapper, self.element);
        wrapper.appendChild(self.element);

        if (self.altInput) wrapper.appendChild(self.altInput);

        wrapper.appendChild(self.calendarContainer);
      }
    }

    if (!self.config.static && !self.config.inline)
      (self.config.appendTo !== undefined
        ? self.config.appendTo
        : window.document.body
      ).appendChild(self.calendarContainer);
  }

  function createDay(
    className: string,
    date: Date,
    dayNumber: number,
    i: number
  ) {
    const dateIsEnabled = isEnabled(date, true),
      dayElement = createElement<DayElement>(
        "span",
        "flatpickr-day " + className,
        date.getDate().toString()
      );

    dayElement.dateObj = date;
    dayElement.$i = i;
    dayElement.setAttribute(
      "aria-label",
      self.formatDate(date, self.config.ariaDateFormat)
    );

    if (compareDates(date, self.now) === 0) {
      self.todayDateElem = dayElement;
      dayElement.classList.add("today");
    }

    if (dateIsEnabled) {
      dayElement.tabIndex = -1;
      if (isDateSelected(date)) {
        dayElement.classList.add("selected");
        self.selectedDateElem = dayElement;
        if (self.config.mode === "range") {
          toggleClass(
            dayElement,
            "startRange",
            self.selectedDates[0] &&
              compareDates(date, self.selectedDates[0]) === 0
          );

          toggleClass(
            dayElement,
            "endRange",
            self.selectedDates[1] &&
              compareDates(date, self.selectedDates[1]) === 0
          );
        }
      }
    } else {
      dayElement.classList.add("disabled");
      if (
        self.selectedDates[0] &&
        self.minRangeDate &&
        date > self.minRangeDate &&
        date < self.selectedDates[0]
      )
        self.minRangeDate = date;
      else if (
        self.selectedDates[0] &&
        self.maxRangeDate &&
        date < self.maxRangeDate &&
        date > self.selectedDates[0]
      )
        self.maxRangeDate = date;
    }

    if (self.config.mode === "range") {
      if (isDateInRange(date) && !isDateSelected(date))
        dayElement.classList.add("inRange");

      if (
        self.selectedDates.length === 1 &&
        self.minRangeDate !== undefined &&
        self.maxRangeDate !== undefined &&
        (date < self.minRangeDate || date > self.maxRangeDate)
      )
        dayElement.classList.add("notAllowed");
    }

    if (
      self.weekNumbers &&
      className !== "prevMonthDay" &&
      dayNumber % 7 === 1
    ) {
      self.weekNumbers.insertAdjacentHTML(
        "beforeend",
        "<span class='disabled flatpickr-day'>" +
          self.config.getWeek(date) +
          "</span>"
      );
    }

    triggerEvent("onDayCreate", dayElement);

    return dayElement;
  }

  function focusOnDay(currentIndex: number, offset: number) {
    let newIndex = currentIndex + offset || 0,
      targetNode = (currentIndex !== undefined
        ? self.days.childNodes[newIndex]
        : self.selectedDateElem ||
          self.todayDateElem ||
          self.days.childNodes[0]) as DayElement;

    const focus = () => {
      targetNode = targetNode || self.days.childNodes[newIndex];
      targetNode.focus();

      if (self.config.mode === "range") onMouseOver(targetNode);
    };

    if (targetNode === undefined && offset !== 0) {
      if (offset > 0) {
        self.changeMonth(1, true, undefined, true);
        newIndex = newIndex % 42;
      } else if (offset < 0) {
        self.changeMonth(-1, true, undefined, true);
        newIndex += 42;
      }

      return afterDayAnim(focus);
    }

    focus();
  }

  function afterDayAnim<F extends Function>(fn: F) {
    self.config.animate === true ? self._animationLoop.push(fn) : fn();
  }

  function buildDays(delta?: number) {
    if (self.daysContainer === undefined) {
      return;
    }

    const firstOfMonth =
        (new Date(self.currentYear, self.currentMonth, 1).getDay() -
          self.l10n.firstDayOfWeek +
          7) %
        7,
      isRangeMode = self.config.mode === "range";

    const prevMonthDays = self.utils.getDaysInMonth(
      (self.currentMonth - 1 + 12) % 12
    );

    const daysInMonth = self.utils.getDaysInMonth(),
      days = window.document.createDocumentFragment();

    let dayNumber = prevMonthDays + 1 - firstOfMonth,
      dayIndex = 0;

    if (self.weekNumbers && self.weekNumbers.firstChild)
      self.weekNumbers.textContent = "";

    if (isRangeMode) {
      // const dateLimits = self.config.enable.length || self.config.disable.length || self.config.mixDate || self.config.maxDate;
      self.minRangeDate = new Date(
        self.currentYear,
        self.currentMonth - 1,
        dayNumber
      );
      self.maxRangeDate = new Date(
        self.currentYear,
        self.currentMonth + 1,
        (42 - firstOfMonth) % daysInMonth
      );
    }

    // prepend days from the ending of previous month
    for (; dayNumber <= prevMonthDays; dayNumber++, dayIndex++) {
      days.appendChild(
        createDay(
          "prevMonthDay",
          new Date(self.currentYear, self.currentMonth - 1, dayNumber),
          dayNumber,
          dayIndex
        )
      );
    }

    // Start at 1 since there is no 0th day
    for (dayNumber = 1; dayNumber <= daysInMonth; dayNumber++, dayIndex++) {
      days.appendChild(
        createDay(
          "",
          new Date(self.currentYear, self.currentMonth, dayNumber),
          dayNumber,
          dayIndex
        )
      );
    }

    // append days from the next month
    for (
      let dayNum = daysInMonth + 1;
      dayNum <= 42 - firstOfMonth;
      dayNum++, dayIndex++
    ) {
      days.appendChild(
        createDay(
          "nextMonthDay",
          new Date(
            self.currentYear,
            self.currentMonth + 1,
            dayNum % daysInMonth
          ),
          dayNum,
          dayIndex
        )
      );
    }

    if (isRangeMode && self.selectedDates.length === 1 && days.childNodes[0]) {
      self._hidePrevMonthArrow =
        self._hidePrevMonthArrow ||
        (!!self.minRangeDate &&
          self.minRangeDate > (days.childNodes[0] as DayElement).dateObj);

      self._hideNextMonthArrow =
        self._hideNextMonthArrow ||
        (!!self.maxRangeDate &&
          self.maxRangeDate <
            new Date(self.currentYear, self.currentMonth + 1, 1));
    } else updateNavigationCurrentMonth();

    const dayContainer = createElement<HTMLDivElement>("div", "dayContainer");
    dayContainer.appendChild(days);

    if (!self.config.animate || delta === undefined)
      clearNode(self.daysContainer);
    else {
      while (self.daysContainer.childNodes.length > 1)
        self.daysContainer.removeChild(self.daysContainer.firstChild as Node);
    }

    if (delta && delta >= 0) self.daysContainer.appendChild(dayContainer);
    else
      self.daysContainer.insertBefore(
        dayContainer,
        self.daysContainer.firstChild
      );

    self.days = self.daysContainer.childNodes[0] as HTMLDivElement;
  }

  function buildMonthNav() {
    const monthNavFragment = window.document.createDocumentFragment();
    self.monthNav = createElement<HTMLDivElement>("div", "flatpickr-month");

    self.prevMonthNav = createElement<HTMLSpanElement>(
      "span",
      "flatpickr-prev-month"
    );
    self.prevMonthNav.innerHTML = self.config.prevArrow;

    self.currentMonthElement = createElement<HTMLSpanElement>(
      "span",
      "cur-month"
    );
    self.currentMonthElement.title = self.l10n.scrollTitle;

    const yearInput = createNumberInput("cur-year");
    self.currentYearElement = yearInput.childNodes[0] as HTMLInputElement;
    self.currentYearElement.title = self.l10n.scrollTitle;

    if (self.config.minDate)
      self.currentYearElement.min = self.config.minDate
        .getFullYear()
        .toString();

    if (self.config.maxDate) {
      self.currentYearElement.max = self.config.maxDate
        .getFullYear()
        .toString();

      self.currentYearElement.disabled =
        !!self.config.minDate &&
        self.config.minDate.getFullYear() === self.config.maxDate.getFullYear();
    }

    self.nextMonthNav = createElement("span", "flatpickr-next-month");
    self.nextMonthNav.innerHTML = self.config.nextArrow;

    self.navigationCurrentMonth = createElement<HTMLSpanElement>(
      "span",
      "flatpickr-current-month"
    );
    self.navigationCurrentMonth.appendChild(self.currentMonthElement);
    self.navigationCurrentMonth.appendChild(yearInput);

    monthNavFragment.appendChild(self.prevMonthNav);
    monthNavFragment.appendChild(self.navigationCurrentMonth);
    monthNavFragment.appendChild(self.nextMonthNav);
    self.monthNav.appendChild(monthNavFragment);

    Object.defineProperty(self, "_hidePrevMonthArrow", {
      get: () => self.__hidePrevMonthArrow,
      set(bool: boolean) {
        if (self.__hidePrevMonthArrow !== bool)
          self.prevMonthNav.style.display = bool ? "none" : "block";
        self.__hidePrevMonthArrow = bool;
      },
    });

    Object.defineProperty(self, "_hideNextMonthArrow", {
      get: () => self.__hideNextMonthArrow,
      set(bool: boolean) {
        if (self.__hideNextMonthArrow !== bool)
          self.nextMonthNav.style.display = bool ? "none" : "block";
        self.__hideNextMonthArrow = bool;
      },
    });

    updateNavigationCurrentMonth();

    return self.monthNav;
  }

  function buildTime() {
    self.calendarContainer.classList.add("hasTime");
    if (self.config.noCalendar)
      self.calendarContainer.classList.add("noCalendar");

    self.timeContainer = createElement<HTMLDivElement>("div", "flatpickr-time");
    self.timeContainer.tabIndex = -1;
    const separator = createElement("span", "flatpickr-time-separator", ":");

    const hourInput = createNumberInput("flatpickr-hour");
    self.hourElement = hourInput.childNodes[0] as HTMLInputElement;

    const minuteInput = createNumberInput("flatpickr-minute");
    self.minuteElement = minuteInput.childNodes[0] as HTMLInputElement;

    self.hourElement.tabIndex = self.minuteElement.tabIndex = -1;

    self.hourElement.value = pad(
      self.latestSelectedDateObj
        ? self.latestSelectedDateObj.getHours()
        : self.config.time_24hr
          ? self.config.defaultHour
          : military2ampm(self.config.defaultHour)
    );

    self.minuteElement.value = pad(
      self.latestSelectedDateObj
        ? self.latestSelectedDateObj.getMinutes()
        : self.config.defaultMinute
    );

    self.hourElement.step = self.config.hourIncrement.toString();
    self.minuteElement.step = self.config.minuteIncrement.toString();

    self.hourElement.min = self.config.time_24hr ? "0" : "1";
    self.hourElement.max = self.config.time_24hr ? "23" : "12";

    self.minuteElement.min = "0";
    self.minuteElement.max = "59";

    self.hourElement.title = self.minuteElement.title = self.l10n.scrollTitle;

    self.timeContainer.appendChild(hourInput);
    self.timeContainer.appendChild(separator);
    self.timeContainer.appendChild(minuteInput);

    if (self.config.time_24hr) self.timeContainer.classList.add("time24hr");

    if (self.config.enableSeconds) {
      self.timeContainer.classList.add("hasSeconds");

      const secondInput = createNumberInput("flatpickr-second");
      self.secondElement = secondInput.childNodes[0] as HTMLInputElement;

      self.secondElement.value = pad(
        self.latestSelectedDateObj
          ? self.latestSelectedDateObj.getSeconds()
          : self.config.defaultSeconds
      );

      self.secondElement.step = self.minuteElement.step;
      self.secondElement.min = self.minuteElement.min;
      self.secondElement.max = self.minuteElement.max;

      self.timeContainer.appendChild(
        createElement("span", "flatpickr-time-separator", ":")
      );
      self.timeContainer.appendChild(secondInput);
    }

    if (!self.config.time_24hr) {
      // add self.amPM if appropriate
      self.amPM = createElement(
        "span",
        "flatpickr-am-pm",
        self.l10n.amPM[
          int(
            (self.latestSelectedDateObj
              ? self.hourElement.value
              : self.config.defaultHour) > 11
          )
        ]
      );
      self.amPM.title = self.l10n.toggleTitle;
      self.amPM.tabIndex = -1;
      self.timeContainer.appendChild(self.amPM);
    }

    return self.timeContainer;
  }

  function buildWeekdays() {
    if (!self.weekdayContainer)
      self.weekdayContainer = createElement<HTMLDivElement>(
        "div",
        "flatpickr-weekdays"
      );

    const firstDayOfWeek = self.l10n.firstDayOfWeek;
    let weekdays = [...self.l10n.weekdays.shorthand];

    if (firstDayOfWeek > 0 && firstDayOfWeek < weekdays.length) {
      weekdays = [
        ...weekdays.splice(firstDayOfWeek, weekdays.length),
        ...weekdays.splice(0, firstDayOfWeek),
      ];
    }

    self.weekdayContainer.innerHTML = `
    <span class=flatpickr-weekday>
      ${weekdays.join("</span><span class=flatpickr-weekday>")}
    </span>
    `;

    return self.weekdayContainer;
  }

  /* istanbul ignore next */
  function buildWeeks() {
    self.calendarContainer.classList.add("hasWeeks");
    const weekWrapper = createElement<HTMLDivElement>(
      "div",
      "flatpickr-weekwrapper"
    );
    weekWrapper.appendChild(
      createElement("span", "flatpickr-weekday", self.l10n.weekAbbreviation)
    );
    const weekNumbers = createElement<HTMLDivElement>("div", "flatpickr-weeks");
    weekWrapper.appendChild(weekNumbers);

    return {
      weekWrapper,
      weekNumbers,
    };
  }

  function changeMonth(
    value: number,
    is_offset = true,
    animate = self.config.animate,
    from_keyboard = false
  ) {
    const delta = is_offset ? value : value - self.currentMonth;

    if (
      (delta < 0 && self._hidePrevMonthArrow) ||
      (delta > 0 && self._hideNextMonthArrow)
    )
      return;

    self.currentMonth += delta;

    if (self.currentMonth < 0 || self.currentMonth > 11) {
      self.currentYear += self.currentMonth > 11 ? 1 : -1;
      self.currentMonth = (self.currentMonth + 12) % 12;

      triggerEvent("onYearChange");
    }

    buildDays(animate ? delta : undefined);

    if (!animate) {
      triggerEvent("onMonthChange");
      return updateNavigationCurrentMonth();
    }

    // remove possible remnants from clicking too fast
    const nav = self.navigationCurrentMonth;
    if (delta < 0) {
      while (
        nav.nextSibling &&
        /curr/.test((nav.nextSibling as HTMLElement).className)
      )
        self.monthNav.removeChild(nav.nextSibling);
    } else if (delta > 0) {
      while (
        nav.previousSibling &&
        /curr/.test((nav.previousSibling as HTMLElement).className)
      )
        self.monthNav.removeChild(nav.previousSibling);
    }

    self.oldCurMonth = self.navigationCurrentMonth;

    self.navigationCurrentMonth = self.monthNav.insertBefore(
      self.oldCurMonth.cloneNode(true),
      delta > 0 ? self.oldCurMonth.nextSibling : self.oldCurMonth
    ) as HTMLDivElement;

    const daysContainer = self.daysContainer as HTMLDivElement;
    if (daysContainer.firstChild && daysContainer.lastChild) {
      if (delta > 0) {
        (daysContainer.firstChild as Element).classList.add("slideLeft");
        (daysContainer.lastChild as Element).classList.add("slideLeftNew");

        self.oldCurMonth.classList.add("slideLeft");
        self.navigationCurrentMonth.classList.add("slideLeftNew");
      } else if (delta < 0) {
        (daysContainer.firstChild as Element).classList.add("slideRightNew");
        (daysContainer.lastChild as Element).classList.add("slideRight");

        self.oldCurMonth.classList.add("slideRight");
        self.navigationCurrentMonth.classList.add("slideRightNew");
      }
    }

    self.currentMonthElement = self.navigationCurrentMonth
      .firstChild as HTMLInputElement;
    self.currentYearElement = (self.navigationCurrentMonth.lastChild as Node)
      .childNodes[0] as HTMLInputElement;

    updateNavigationCurrentMonth();
    if (self.oldCurMonth.firstChild)
      self.oldCurMonth.firstChild.textContent = monthToStr(
        self.currentMonth - delta,
        self.config.shorthandCurrentMonth,
        self.l10n
      );

    triggerEvent("onMonthChange");

    if (
      from_keyboard &&
      document.activeElement &&
      (document.activeElement as DayElement).$i
    ) {
      const index = (document.activeElement as DayElement).$i;
      afterDayAnim(() => {
        focusOnDay(index, 0);
      });
    }
  }

  function clear(triggerChangeEvent = true) {
    self.input.value = "";

    if (self.altInput) self.altInput.value = "";

    if (self.mobileInput) self.mobileInput.value = "";

    self.selectedDates = [];
    self.latestSelectedDateObj = undefined;
    self.showTimeInput = false;

    self.redraw();

    if (triggerChangeEvent === true)
      // triggerChangeEvent is true (default) or an Event
      triggerEvent("onChange");
  }

  function close() {
    self.isOpen = false;

    if (!self.isMobile) {
      self.calendarContainer.classList.remove("open");
      self._input.classList.remove("active");
    }

    triggerEvent("onClose");
  }

  function destroy() {
    if (self.config !== undefined) triggerEvent("onDestroy");

    for (let i = self._handlers.length; i--; ) {
      const h = self._handlers[i];
      h.element.removeEventListener(h.event, h.handler);
    }

    self._handlers = [];

    if (self.mobileInput) {
      if (self.mobileInput.parentNode)
        self.mobileInput.parentNode.removeChild(self.mobileInput);
      self.mobileInput = undefined;
    } else if (self.calendarContainer && self.calendarContainer.parentNode)
      self.calendarContainer.parentNode.removeChild(self.calendarContainer);

    if (self.altInput) {
      self.input.type = "text";
      if (self.altInput.parentNode)
        self.altInput.parentNode.removeChild(self.altInput);
      delete self.altInput;
    }

    if (self.input) {
      self.input.type = (self.input as any)._type;
      self.input.classList.remove("flatpickr-input");
      self.input.removeAttribute("readonly");
      self.input.value = "";
    }

    ([
      "_showTimeInput",
      "latestSelectedDateObj",
      "_hideNextMonthArrow",
      "_hidePrevMonthArrow",
      "__hideNextMonthArrow",
      "__hidePrevMonthArrow",
      "isMobile",
      "isOpen",
      "selectedDateElem",
      "minDateHasTime",
      "maxDateHasTime",
      "days",
      "daysContainer",
      "_input",
      "_positionElement",
      "innerContainer",
      "rContainer",
      "monthNav",
      "todayDateElem",
      "calendarContainer",
      "weekdayContainer",
      "prevMonthNav",
      "nextMonthNav",
      "currentMonthElement",
      "currentYearElement",
      "navigationCurrentMonth",
      "selectedDateElem",
      "config",
    ] as Array<keyof Instance>).forEach(k => {
      try {
        delete self[k as keyof Instance];
      } catch (_) {}
    });
  }

  function isCalendarElem(elem: HTMLElement) {
    if (self.config.appendTo && self.config.appendTo.contains(elem))
      return true;

    return self.calendarContainer.contains(elem);
  }

  function documentClick(e: MouseEvent) {
    if (self.isOpen && !self.config.inline) {
      const isCalendarElement = isCalendarElem(e.target as HTMLElement);
      const isInput =
        e.target === self.input ||
        e.target === self.altInput ||
        self.element.contains(e.target as HTMLElement) ||
        // web components
        // e.path is not present in all browsers. circumventing typechecks
        ((e as any).path &&
          (e as any).path.indexOf &&
          (~(e as any).path.indexOf(self.input) ||
            ~(e as any).path.indexOf(self.altInput)));

      const lostFocus =
        e.type === "blur"
          ? isInput &&
            e.relatedTarget &&
            !isCalendarElem(e.relatedTarget as HTMLElement)
          : !isInput && !isCalendarElement;

      if (
        lostFocus &&
        self.config.ignoredFocusElements.indexOf(e.target as HTMLElement) === -1
      ) {
        self.close();

        if (self.config.mode === "range" && self.selectedDates.length === 1) {
          self.clear(false);
          self.redraw();
        }
      }
    }
  }

  function changeYear(newYear: number) {
    if (
      !newYear ||
      (self.currentYearElement.min &&
        newYear < parseInt(self.currentYearElement.min)) ||
      (self.currentYearElement.max &&
        newYear > parseInt(self.currentYearElement.max))
    )
      return;

    const newYearNum = newYear,
      isNewYear = self.currentYear !== newYearNum;

    self.currentYear = newYearNum || self.currentYear;

    if (
      self.config.maxDate &&
      self.currentYear === self.config.maxDate.getFullYear()
    ) {
      self.currentMonth = Math.min(
        self.config.maxDate.getMonth(),
        self.currentMonth
      );
    } else if (
      self.config.minDate &&
      self.currentYear === self.config.minDate.getFullYear()
    ) {
      self.currentMonth = Math.max(
        self.config.minDate.getMonth(),
        self.currentMonth
      );
    }

    if (isNewYear) {
      self.redraw();
      triggerEvent("onYearChange");
    }
  }

  function isEnabled(date: DateOption, timeless: boolean = true): boolean {
    const dateToCheck = self.parseDate(date, undefined, timeless); // timeless

    if (
      (self.config.minDate &&
        dateToCheck &&
        compareDates(
          dateToCheck,
          self.config.minDate,
          timeless !== undefined ? timeless : !self.minDateHasTime
        ) < 0) ||
      (self.config.maxDate &&
        dateToCheck &&
        compareDates(
          dateToCheck,
          self.config.maxDate,
          timeless !== undefined ? timeless : !self.maxDateHasTime
        ) > 0)
    )
      return false;

    if (!self.config.enable.length && !self.config.disable.length) return true;

    if (dateToCheck === undefined) return false;

    const bool = self.config.enable.length > 0,
      array = bool ? self.config.enable : self.config.disable;

    for (let i = 0, d; i < array.length; i++) {
      d = array[i];

      if (
        typeof d === "function" &&
        d(dateToCheck) // disabled by function
      )
        return bool;
      else if (
        d instanceof Date &&
        dateToCheck !== undefined &&
        d.getTime() === dateToCheck.getTime()
      )
        // disabled by date
        return bool;
      else if (typeof d === "string" && dateToCheck !== undefined) {
        // disabled by date string
        const parsed = self.parseDate(d, undefined, true);
        return parsed && parsed.getTime() === dateToCheck.getTime()
          ? bool
          : !bool;
      } else if (
        // disabled by range
        typeof d === "object" &&
        dateToCheck !== undefined &&
        (d as DateRangeLimit).from &&
        (d as DateRangeLimit).to &&
        dateToCheck.getTime() >= (d as DateRangeLimit<Date>).from.getTime() &&
        dateToCheck.getTime() <= (d as DateRangeLimit<Date>).to.getTime()
      )
        return bool;
    }

    return !bool;
  }

  function onKeyDown(e: KeyboardEvent) {
    const isInput = e.target === self._input;
    const calendarElem = isCalendarElem(e.target as HTMLElement);
    const allowInput = self.config.allowInput;
    const allowKeydown = self.isOpen && (!allowInput || !isInput);
    const allowInlineKeydown = self.config.inline && isInput && !allowInput;

    if (e.key === "Enter" && isInput) {
      if (allowInput) {
        self.setDate(
          self._input.value,
          true,
          e.target === self.altInput
            ? self.config.altFormat
            : self.config.dateFormat
        );
        return (e.target as HTMLElement).blur();
      } else self.open();
    } else if (calendarElem || allowKeydown || allowInlineKeydown) {
      const isTimeObj =
        !!self.timeContainer &&
        self.timeContainer.contains(e.target as HTMLElement);

      switch (e.key) {
        case "Enter":
          if (isTimeObj) updateValue();
          else selectDate(e);

          break;

        case "Escape": // escape
          e.preventDefault();
          self.close();
          break;

        case "Backspace":
        case "Delete":
          if (isInput && !self.config.allowInput) self.clear();
          break;

        case "ArrowLeft":
        case "ArrowRight":
          if (!isTimeObj) {
            e.preventDefault();

            if (self.daysContainer) {
              const delta = e.key === "ArrowRight" ? 1 : -1;

              if (!e.ctrlKey) focusOnDay((e.target as DayElement).$i, delta);
              else changeMonth(delta, true, undefined, true);
            }
          } else if (self.hourElement) self.hourElement.focus();

          break;

        case "ArrowUp":
        case "ArrowDown":
          e.preventDefault();
          const delta = e.key === "ArrowDown" ? 1 : -1;

          if (self.daysContainer && (e.target as DayElement).$i !== undefined) {
            if (e.ctrlKey) {
              changeYear(self.currentYear - delta);
              focusOnDay((e.target as DayElement).$i, 0);
            } else if (!isTimeObj)
              focusOnDay((e.target as DayElement).$i, delta * 7);
          } else if (self.config.enableTime) {
            if (!isTimeObj && self.hourElement) self.hourElement.focus();
            updateTime(e);
            self._debouncedChange();
          }

          break;

        case "Tab":
          if (e.target === self.hourElement) {
            e.preventDefault();
            // can't have hour elem without minute element
            (self.minuteElement as HTMLInputElement).select();
          } else if (
            e.target === self.minuteElement &&
            (self.secondElement || self.amPM)
          ) {
            e.preventDefault();
            if (self.secondElement !== undefined) self.secondElement.focus();
            else if (self.amPM !== undefined) self.amPM.focus();
          } else if (e.target === self.secondElement && self.amPM) {
            e.preventDefault();
            self.amPM.focus();
          }

          break;

        case "a":
          if (self.amPM !== undefined && e.target === self.amPM) {
            self.amPM.textContent = "AM";
            setHoursFromInputs();
            updateValue();
          }
          break;

        case "p":
          if (self.amPM !== undefined && e.target === self.amPM) {
            self.amPM.textContent = "PM";
            setHoursFromInputs();
            updateValue();
          }
          break;

        default:
          break;
      }

      triggerEvent("onKeyDown", e);
    }
  }

  function onMouseOver(elem: DayElement) {
    if (
      self.selectedDates.length !== 1 ||
      !elem.classList.contains("flatpickr-day") ||
      self.minRangeDate === undefined ||
      self.maxRangeDate === undefined
    )
      return;

    let hoverDate = elem.dateObj,
      initialDate = self.parseDate(
        self.selectedDates[0],
        undefined,
        true
      ) as Date,
      rangeStartDate = Math.min(
        hoverDate.getTime(),
        self.selectedDates[0].getTime()
      ),
      rangeEndDate = Math.max(
        hoverDate.getTime(),
        self.selectedDates[0].getTime()
      ),
      containsDisabled = false;

    for (let t = rangeStartDate; t < rangeEndDate; t += duration.DAY) {
      if (!isEnabled(new Date(t))) {
        containsDisabled = true;
        break;
      }
    }

    for (
      let timestamp = (self.days.childNodes[0] as DayElement).dateObj.getTime(),
        i = 0;
      i < 42;
      i++, timestamp += duration.DAY
    ) {
      const outOfRange =
          timestamp < self.minRangeDate.getTime() ||
          timestamp > self.maxRangeDate.getTime(),
        dayElem = self.days.childNodes[i] as DayElement;

      if (outOfRange) {
        dayElem.classList.add("notAllowed");
        ["inRange", "startRange", "endRange"].forEach(c => {
          dayElem.classList.remove(c);
        });
        continue;
      } else if (containsDisabled && !outOfRange) continue;

      ["startRange", "inRange", "endRange", "notAllowed"].forEach(c => {
        dayElem.classList.remove(c);
      });

      const minRangeDate = Math.max(
          self.minRangeDate.getTime(),
          rangeStartDate
        ),
        maxRangeDate = Math.min(self.maxRangeDate.getTime(), rangeEndDate);

      elem.classList.add(
        hoverDate < self.selectedDates[0] ? "startRange" : "endRange"
      );

      if (initialDate < hoverDate && timestamp === initialDate.getTime())
        dayElem.classList.add("startRange");
      else if (initialDate > hoverDate && timestamp === initialDate.getTime())
        dayElem.classList.add("endRange");

      if (timestamp >= minRangeDate && timestamp <= maxRangeDate)
        dayElem.classList.add("inRange");
    }
  }

  function onResize() {
    if (self.isOpen && !self.config.static && !self.config.inline)
      positionCalendar();
  }

  function open(e?: Event, positionElement: HTMLElement = self._input) {
    if (self.isMobile) {
      if (e) {
        e.preventDefault();
        e.target && (e.target as HTMLInputElement).blur();
      }

      setTimeout(() => {
        self.mobileInput !== undefined && self.mobileInput.click();
      }, 0);

      triggerEvent("onOpen");
      return;
    }

    if (self.isOpen || self._input.disabled || self.config.inline) return;

    self.isOpen = true;
    self.calendarContainer.classList.add("open");
    positionCalendar(positionElement);
    self._input.classList.add("active");

    triggerEvent("onOpen");
  }

  function minMaxDateSetter(type: "min" | "max") {
    return (date: DateOption) => {
      const dateObj = (self.config[
        `_${type}Date` as "_minDate" | "_maxDate"
      ] = self.parseDate(date));
      const inverseDateObj =
        self.config[
          `_${type === "min" ? "max" : "min"}Date` as "_minDate" | "_maxDate"
        ];

      if (dateObj !== undefined) {
        self[type === "min" ? "minDateHasTime" : "maxDateHasTime"] =
          (dateObj as Date).getHours() > 0 ||
          (dateObj as Date).getMinutes() > 0 ||
          (dateObj as Date).getSeconds() > 0;
      }

      if (self.selectedDates) {
        self.selectedDates = self.selectedDates.filter(d => isEnabled(d));
        if (!self.selectedDates.length && type === "min")
          setHoursFromDate(dateObj);
        updateValue();
      }

      if (self.daysContainer) {
        redraw();

        if (dateObj !== undefined)
          self.currentYearElement[type] = dateObj.getFullYear().toString();
        else self.currentYearElement.removeAttribute(type);

        self.currentYearElement.disabled =
          !!inverseDateObj &&
          dateObj !== undefined &&
          inverseDateObj.getFullYear() === dateObj.getFullYear();
      }
    };
  }

  function parseConfig() {
    let boolOpts: Array<keyof Options> = [
      "wrap",
      "weekNumbers",
      "allowInput",
      "clickOpens",
      "time_24hr",
      "enableTime",
      "noCalendar",
      "altInput",
      "shorthandCurrentMonth",
      "inline",
      "static",
      "enableSeconds",
      "disableMobile",
    ];

    let hooks: HookKey[] = [
      "onChange",
      "onClose",
      "onDayCreate",
      "onDestroy",
      "onKeyDown",
      "onMonthChange",
      "onOpen",
      "onParseConfig",
      "onReady",
      "onValueUpdate",
      "onYearChange",
    ];

    self.config = {
      ...flatpickr.defaultConfig,
    } as ParsedOptions;

    const userConfig = {
      ...instanceConfig,
      ...JSON.parse(JSON.stringify(element.dataset || {})),
    } as Options;

    const formats = {} as Record<"dateFormat" | "altFormat", string>;

    // self.config.parseDate = userConfig.parseDate;
    // self.config.formatDate = userConfig.formatDate;

    Object.defineProperty(self.config, "enable", {
      get: () => self.config._enable || [],
      set: dates => {
        self.config._enable = parseDateRules(dates);
      },
    });

    Object.defineProperty(self.config, "disable", {
      get: () => self.config._disable || [],
      set: dates => {
        self.config._disable = parseDateRules(dates);
      },
    });

    if (!userConfig.dateFormat && userConfig.enableTime) {
      formats.dateFormat = userConfig.noCalendar
        ? "H:i" + (userConfig.enableSeconds ? ":S" : "")
        : flatpickr.defaultConfig.dateFormat +
          " H:i" +
          (userConfig.enableSeconds ? ":S" : "");
    }

    if (userConfig.altInput && userConfig.enableTime && !userConfig.altFormat) {
      formats.altFormat = userConfig.noCalendar
        ? "h:i" + (userConfig.enableSeconds ? ":S K" : " K")
        : flatpickr.defaultConfig.altFormat +
          ` h:i${userConfig.enableSeconds ? ":S" : ""} K`;
    }

    Object.defineProperty(self.config, "minDate", {
      get: () => self.config._minDate,
      set: minMaxDateSetter("min"),
    });

    Object.defineProperty(self.config, "maxDate", {
      get: () => self.config._maxDate,
      set: minMaxDateSetter("max"),
    });

    Object.assign(self.config, formats, userConfig);

    for (let i = 0; i < boolOpts.length; i++)
      self.config[boolOpts[i]] =
        self.config[boolOpts[i]] === true ||
        self.config[boolOpts[i]] === "true";

    for (let i = hooks.length; i--; ) {
      if (self.config[hooks[i]] !== undefined) {
        self.config[hooks[i]] = arrayify(self.config[hooks[i]] || []).map(
          bindToInstance
        );
      }
    }

    for (let i = 0; i < self.config.plugins.length; i++) {
      const pluginConf = self.config.plugins[i](self) || ({} as Options);
      for (const key in pluginConf) {
        if (~hooks.indexOf(key as HookKey)) {
          self.config[key as keyof Options] = arrayify(pluginConf[
            key as HookKey
          ] as Hook)
            .map(bindToInstance)
            .concat(self.config[key as HookKey]);
        } else if (typeof userConfig[key as keyof Options] === "undefined")
          self.config[key as keyof ParsedOptions] = pluginConf[
            key as keyof Options
          ] as any;
      }
    }

    self.isMobile =
      !self.config.disableMobile &&
      !self.config.inline &&
      self.config.mode === "single" &&
      !self.config.disable.length &&
      !self.config.enable.length &&
      !self.config.weekNumbers &&
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      );

    triggerEvent("onParseConfig");
  }

  function setupLocale() {
    if (
      typeof self.config.locale !== "object" &&
      typeof flatpickr.l10ns[self.config.locale as LocaleKey] === "undefined"
    )
      console.warn(`flatpickr: invalid locale ${self.config.locale}`);

    self.l10n = {
      ...(flatpickr.l10ns.default as Locale),
      ...typeof self.config.locale === "object"
        ? self.config.locale
        : self.config.locale !== "default"
          ? flatpickr.l10ns[self.config.locale as LocaleKey]
          : undefined,
    };
  }

  function positionCalendar(positionElement = self._positionElement) {
    if (self.calendarContainer === undefined) return;

    const calendarHeight = self.calendarContainer.offsetHeight,
      calendarWidth = self.calendarContainer.offsetWidth,
      configPos = self.config.position,
      inputBounds = positionElement.getBoundingClientRect(),
      distanceFromBottom = window.innerHeight - inputBounds.bottom,
      showOnTop =
        configPos === "above" ||
        (configPos !== "below" &&
          distanceFromBottom < calendarHeight &&
          inputBounds.top > calendarHeight);

    let top =
      window.pageYOffset +
      inputBounds.top +
      (!showOnTop ? positionElement.offsetHeight + 2 : -calendarHeight - 2);

    toggleClass(self.calendarContainer, "arrowTop", !showOnTop);
    toggleClass(self.calendarContainer, "arrowBottom", showOnTop);

    if (self.config.inline) return;

    const left = window.pageXOffset + inputBounds.left;
    const right = window.document.body.offsetWidth - inputBounds.right;
    const rightMost = left + calendarWidth > window.document.body.offsetWidth;

    toggleClass(self.calendarContainer, "rightMost", rightMost);

    if (self.config.static) return;

    self.calendarContainer.style.top = `${top}px`;

    if (!rightMost) {
      self.calendarContainer.style.left = `${left}px`;
      self.calendarContainer.style.right = "auto";
    } else {
      self.calendarContainer.style.left = "auto";
      self.calendarContainer.style.right = `${right}px`;
    }
  }

  function redraw() {
    if (self.config.noCalendar || self.isMobile) return;

    buildWeekdays();
    updateNavigationCurrentMonth();
    buildDays();
  }

  function selectDate(e: MouseEvent | KeyboardEvent) {
    e.preventDefault();
    e.stopPropagation();

    const isSelectable = (day: Element) =>
      day.classList &&
      day.classList.contains("flatpickr-day") &&
      !day.classList.contains("disabled") &&
      !day.classList.contains("notAllowed");

    const t = findParent(e.target as Node, isSelectable);

    if (t === undefined) return;

    const target = t as DayElement;

    const selectedDate = (self.latestSelectedDateObj = new Date(
      target.dateObj.getTime()
    ));

    const shouldChangeMonth =
      selectedDate.getMonth() !== self.currentMonth &&
      self.config.mode !== "range";

    self.selectedDateElem = target;

    if (self.config.mode === "single") self.selectedDates = [selectedDate];
    else if (self.config.mode === "multiple") {
      const selectedIndex = isDateSelected(selectedDate);

      if (selectedIndex) self.selectedDates.splice(parseInt(selectedIndex), 1);
      else self.selectedDates.push(selectedDate);
    } else if (self.config.mode === "range") {
      if (self.selectedDates.length === 2) self.clear();

      self.selectedDates.push(selectedDate);

      // unless selecting same date twice, sort ascendingly
      if (compareDates(selectedDate, self.selectedDates[0], true) !== 0)
        self.selectedDates.sort((a, b) => a.getTime() - b.getTime());
    }

    setHoursFromInputs();

    if (shouldChangeMonth) {
      const isNewYear = self.currentYear !== selectedDate.getFullYear();
      self.currentYear = selectedDate.getFullYear();
      self.currentMonth = selectedDate.getMonth();

      if (isNewYear) triggerEvent("onYearChange");

      triggerEvent("onMonthChange");
    }

    buildDays();

    if (
      self.config.minDate &&
      self.minDateHasTime &&
      self.config.enableTime &&
      compareDates(selectedDate, self.config.minDate) === 0
    )
      setHoursFromDate(self.config.minDate);

    updateValue();

    if (self.config.enableTime)
      setTimeout(() => (self.showTimeInput = true), 50);

    if (self.config.mode === "range") {
      if (self.selectedDates.length === 1) {
        onMouseOver(target);

        self._hidePrevMonthArrow =
          self._hidePrevMonthArrow ||
          (self.minRangeDate !== undefined &&
            self.minRangeDate >
              (self.days.childNodes[0] as DayElement).dateObj);

        self._hideNextMonthArrow =
          self._hideNextMonthArrow ||
          (self.maxRangeDate !== undefined &&
            self.maxRangeDate <
              new Date(self.currentYear, self.currentMonth + 1, 1));
      } else updateNavigationCurrentMonth();
    }

    triggerEvent("onChange");

    // maintain focus
    if (!shouldChangeMonth) focusOnDay(target.$i, 0);
    else
      afterDayAnim(
        () => self.selectedDateElem && self.selectedDateElem.focus()
      );

    if (self.hourElement !== undefined)
      setTimeout(
        () => self.hourElement !== undefined && self.hourElement.select(),
        451
      );

    if (self.config.closeOnSelect) {
      const single = self.config.mode === "single" && !self.config.enableTime;
      const range =
        self.config.mode === "range" &&
        self.selectedDates.length === 2 &&
        !self.config.enableTime;

      if (single || range) self.close();
    }
  }

  function set(option: Record<keyof Options, any> | keyof Options, value: any) {
    if (option !== null && typeof option === "object")
      Object.assign(self.config, option);
    else self.config[option] = value;

    self.redraw();
    jumpToDate();
  }

  function setSelectedDate(
    inputDate: DateOption | DateOption[],
    format?: string
  ) {
    let dates: Array<Date | undefined> = [];
    if (inputDate instanceof Array)
      dates = inputDate.map(d => self.parseDate(d, format));
    else if (inputDate instanceof Date || typeof inputDate === "number")
      dates = [self.parseDate(inputDate, format)];
    else if (typeof inputDate === "string") {
      switch (self.config.mode) {
        case "single":
          dates = [self.parseDate(inputDate, format)];
          break;

        case "multiple":
          dates = inputDate
            .split("; ")
            .map(date => self.parseDate(date, format));
          break;

        case "range":
          dates = inputDate
            .split(self.l10n.rangeSeparator)
            .map(date => self.parseDate(date, format));

          break;

        default:
          break;
      }
    }

    self.selectedDates = dates.filter(
      d => d instanceof Date && isEnabled(d, false)
    ) as Date[];

    self.selectedDates.sort((a, b) => a.getTime() - b.getTime());
  }

  function setDate(
    date: DateOption | DateOption[],
    triggerChange = false,
    format = undefined
  ) {
    if (date !== 0 && !date) return self.clear(triggerChange);

    setSelectedDate(date, format);

    self.showTimeInput = self.selectedDates.length > 0;
    self.latestSelectedDateObj = self.selectedDates[0];

    self.redraw();
    jumpToDate();

    setHoursFromDate();
    updateValue(triggerChange);

    if (triggerChange) triggerEvent("onChange");
  }

  function parseDateRules(arr: DateLimit[]): DateLimit<Date>[] {
    return arr
      .map(rule => {
        if (
          typeof rule === "string" ||
          typeof rule === "number" ||
          rule instanceof Date
        ) {
          return self.parseDate(
            rule as Date | string | number,
            undefined,
            true
          ) as Date;
        } else if (
          rule &&
          typeof rule === "object" &&
          (rule as DateRangeLimit).from &&
          (rule as DateRangeLimit).to
        )
          return {
            from: self.parseDate(
              (rule as DateRangeLimit).from,
              undefined
            ) as Date,
            to: self.parseDate((rule as DateRangeLimit).to, undefined) as Date,
          };

        return rule;
      })
      .filter(x => x) as DateLimit<Date>[]; // remove falsy values
  }

  function setupDates() {
    self.selectedDates = [];
    self.now = new Date();

    const preloadedDate = self.config.defaultDate || self.input.value;
    if (preloadedDate) setSelectedDate(preloadedDate, self.config.dateFormat);

    const initialDate = self.selectedDates.length
      ? self.selectedDates[0]
      : self.config.minDate &&
        self.config.minDate.getTime() > self.now.getTime()
        ? self.config.minDate
        : self.config.maxDate &&
          self.config.maxDate.getTime() < self.now.getTime()
          ? self.config.maxDate
          : self.now;

    self.currentYear = initialDate.getFullYear();
    self.currentMonth = initialDate.getMonth();

    if (self.selectedDates.length)
      self.latestSelectedDateObj = self.selectedDates[0];

    self.minDateHasTime =
      !!self.config.minDate &&
      (self.config.minDate.getHours() > 0 ||
        self.config.minDate.getMinutes() > 0 ||
        self.config.minDate.getSeconds() > 0);

    self.maxDateHasTime =
      !!self.config.maxDate &&
      (self.config.maxDate.getHours() > 0 ||
        self.config.maxDate.getMinutes() > 0 ||
        self.config.maxDate.getSeconds() > 0);

    Object.defineProperty(self, "showTimeInput", {
      get: () => self._showTimeInput,
      set(bool: boolean) {
        self._showTimeInput = bool;
        if (self.calendarContainer)
          toggleClass(self.calendarContainer, "showTimeInput", bool);
        positionCalendar();
      },
    });
  }

  function formatDate(dateObj: Date, frmt: string): string {
    if (self.config !== undefined && self.config.formatDate !== undefined)
      return self.config.formatDate(dateObj, frmt);

    return frmt
      .split("")
      .map(
        (c, i, arr) =>
          formats[c as token] && arr[i - 1] !== "\\"
            ? formats[c as token](dateObj, self.l10n, self.config)
            : c !== "\\" ? c : ""
      )
      .join("");
  }

  function parseDate(
    date: Date | string | number,
    givenFormat?: string,
    timeless?: boolean
  ): Date | undefined {
    if (date !== 0 && !date) return undefined;

    let parsedDate: Date | undefined;
    const date_orig = date;

    if (date instanceof Date) parsedDate = new Date(date.getTime());
    else if (
      typeof date !== "string" &&
      date.toFixed !== undefined // timestamp
    )
      // create a copy

      parsedDate = new Date(date);
    else if (typeof date === "string") {
      // date string
      const format =
        givenFormat || (self.config || flatpickr.defaultConfig).dateFormat;
      const datestr = String(date).trim();

      if (datestr === "today") {
        parsedDate = new Date();
        timeless = true;
      } else if (
        /Z$/.test(datestr) ||
        /GMT$/.test(datestr) // datestrings w/ timezone
      )
        parsedDate = new Date(date);
      else if (self.config && self.config.parseDate)
        parsedDate = self.config.parseDate(date, format);
      else {
        parsedDate =
          !self.config || !self.config.noCalendar
            ? new Date(new Date().getFullYear(), 0, 1, 0, 0, 0, 0)
            : new Date(new Date().setHours(0, 0, 0, 0)) as Date;

        let matched,
          ops: { fn: RevFormatFn; val: string }[] = [];

        for (let i = 0, matchIndex = 0, regexStr = ""; i < format.length; i++) {
          const token = format[i] as token;
          const isBackSlash = (token as string) === "\\";
          const escaped = format[i - 1] === "\\" || isBackSlash;

          if (tokenRegex[token] && !escaped) {
            regexStr += tokenRegex[token];
            const match = new RegExp(regexStr).exec(date);
            if (match && (matched = true)) {
              ops[token !== "Y" ? "push" : "unshift"]({
                fn: revFormat[token],
                val: match[++matchIndex],
              });
            }
          } else if (!isBackSlash) regexStr += "."; // don't really care

          ops.forEach(
            ({ fn, val }) =>
              (parsedDate =
                fn(parsedDate as Date, val, self.l10n) || parsedDate)
          );
        }

        parsedDate = matched ? parsedDate : undefined;
      }
    }

    /* istanbul ignore next */
    if (!(parsedDate instanceof Date)) {
      console.warn(`flatpickr: invalid date ${date_orig}`);
      console.info(self.element);
      return undefined;
    }

    if (timeless === true) parsedDate.setHours(0, 0, 0, 0);

    return parsedDate;
  }

  function setupInputs() {
    self.input = self.config.wrap
      ? element.querySelector("[data-input]") as HTMLInputElement
      : element as HTMLInputElement;

    /* istanbul ignore next */
    if (!self.input) {
      console.warn("Error: invalid input element specified", self.input);
      return;
    }

    // hack: store previous type to restore it after destroy()
    (self.input as any)._type = (self.input as any).type;
    (self.input as any).type = "text";

    self.input.classList.add("flatpickr-input");
    self._input = self.input;

    if (self.config.altInput) {
      // replicate self.element
      self.altInput = createElement<HTMLInputElement>(
        self.input.nodeName as "input",
        self.input.className + " " + self.config.altInputClass
      );
      self._input = self.altInput;
      self.altInput.placeholder = self.input.placeholder;
      self.altInput.disabled = self.input.disabled;
      self.altInput.required = self.input.required;
      self.altInput.type = "text";
      self.input.type = "hidden";

      if (!self.config.static && self.input.parentNode)
        self.input.parentNode.insertBefore(
          self.altInput,
          self.input.nextSibling
        );
    }

    if (!self.config.allowInput)
      self._input.setAttribute("readonly", "readonly");

    self._positionElement = self.config.positionElement || self._input;
  }

  function setupMobile() {
    const inputType = self.config.enableTime
      ? self.config.noCalendar ? "time" : "datetime-local"
      : "date";

    self.mobileInput = createElement<HTMLInputElement>(
      "input",
      self.input.className + " flatpickr-mobile"
    );
    self.mobileInput.step = self.input.getAttribute("step") || "any";
    self.mobileInput.tabIndex = 1;
    self.mobileInput.type = inputType;
    self.mobileInput.disabled = self.input.disabled;
    self.mobileInput.placeholder = self.input.placeholder;

    self.mobileFormatStr =
      inputType === "datetime-local"
        ? "Y-m-d\\TH:i:S"
        : inputType === "date" ? "Y-m-d" : "H:i:S";

    if (self.selectedDates.length) {
      self.mobileInput.defaultValue = self.mobileInput.value = self.formatDate(
        self.selectedDates[0],
        self.mobileFormatStr
      );
    }

    if (self.config.minDate)
      self.mobileInput.min = self.formatDate(self.config.minDate, "Y-m-d");

    if (self.config.maxDate)
      self.mobileInput.max = self.formatDate(self.config.maxDate, "Y-m-d");

    self.input.type = "hidden";
    if (self.altInput !== undefined) self.altInput.type = "hidden";

    try {
      if (self.input.parentNode)
        self.input.parentNode.insertBefore(
          self.mobileInput,
          self.input.nextSibling
        );
    } catch {}

    self.mobileInput.addEventListener("change", (e: KeyboardEvent) => {
      self.setDate(
        (e.target as HTMLInputElement).value,
        false,
        self.mobileFormatStr
      );
      triggerEvent("onChange");
      triggerEvent("onClose");
    });
  }

  function toggle() {
    if (self.isOpen) return self.close();
    self.open();
  }

  function triggerEvent(event: HookKey, data?: any) {
    const hooks = self.config[event];

    if (hooks !== undefined && hooks.length > 0) {
      for (let i = 0; hooks[i] && i < hooks.length; i++)
        hooks[i](self.selectedDates, self.input.value, self, data);
    }

    if (event === "onChange") {
      self.input.dispatchEvent(createEvent("change"));

      // many front-end frameworks bind to the input event
      self.input.dispatchEvent(createEvent("input"));
    }
  }

  function createEvent(name: string): Event {
    const e = document.createEvent("Event");
    e.initEvent(name, true, true);
    return e;
  }

  function isDateSelected(date: Date) {
    for (let i = 0; i < self.selectedDates.length; i++) {
      if (compareDates(self.selectedDates[i], date) === 0) return "" + i;
    }

    return false;
  }

  function isDateInRange(date: Date) {
    if (self.config.mode !== "range" || self.selectedDates.length < 2)
      return false;
    return (
      compareDates(date, self.selectedDates[0]) >= 0 &&
      compareDates(date, self.selectedDates[1]) <= 0
    );
  }

  function updateNavigationCurrentMonth() {
    if (self.config.noCalendar || self.isMobile || !self.monthNav) return;

    self.currentMonthElement.textContent =
      monthToStr(
        self.currentMonth,
        self.config.shorthandCurrentMonth,
        self.l10n
      ) + " ";
    self.currentYearElement.value = self.currentYear.toString();

    self._hidePrevMonthArrow =
      self.config.minDate !== undefined &&
      (self.currentYear === self.config.minDate.getFullYear()
        ? self.currentMonth <= self.config.minDate.getMonth()
        : self.currentYear < self.config.minDate.getFullYear());

    self._hideNextMonthArrow =
      self.config.maxDate !== undefined &&
      (self.currentYear === self.config.maxDate.getFullYear()
        ? self.currentMonth + 1 > self.config.maxDate.getMonth()
        : self.currentYear > self.config.maxDate.getFullYear());
  }

  /**
   * Updates the values of inputs associated with the calendar
   * @return {void}
   */
  function updateValue(triggerChange: boolean = true) {
    if (!self.selectedDates.length) return self.clear(triggerChange);

    if (self.mobileInput !== undefined && self.mobileFormatStr) {
      self.mobileInput.value =
        self.latestSelectedDateObj !== undefined
          ? self.formatDate(self.latestSelectedDateObj, self.mobileFormatStr)
          : "";
    }

    const joinChar =
      self.config.mode !== "range"
        ? self.config.conjunction
        : self.l10n.rangeSeparator;

    self.input.value = self.selectedDates
      .map(dObj => self.formatDate(dObj, self.config.dateFormat))
      .join(joinChar);

    if (self.altInput !== undefined) {
      self.altInput.value = self.selectedDates
        .map(dObj => self.formatDate(dObj, self.config.altFormat))
        .join(joinChar);
    }

    if (triggerChange !== false) triggerEvent("onValueUpdate");
  }

  function onMonthNavScroll(e: MouseWheelEvent) {
    e.preventDefault();
    const isYear =
      self.currentYearElement.parentNode &&
      self.currentYearElement.parentNode.contains(e.target as Node);

    if (e.target === self.currentMonthElement || isYear) {
      const delta = mouseDelta(e);

      if (isYear) {
        changeYear(self.currentYear + delta);
        (e.target as HTMLInputElement).value = self.currentYear.toString();
      } else self.changeMonth(delta, true, false);
    }
  }

  function onMonthNavClick(e: MouseEvent) {
    const isPrevMonth = self.prevMonthNav.contains(e.target as Node);
    const isNextMonth = self.nextMonthNav.contains(e.target as Node);

    if (isPrevMonth || isNextMonth) changeMonth(isPrevMonth ? -1 : 1);
    else if (e.target === self.currentYearElement) {
      e.preventDefault();
      self.currentYearElement.select();
    } else if ((e.target as Element).className === "arrowUp")
      self.changeYear(self.currentYear + 1);
    else if ((e.target as Element).className === "arrowDown")
      self.changeYear(self.currentYear - 1);
  }

  function timeWrapper(
    e: MouseEvent | WheelEvent | KeyboardEvent | IncrementEvent
  ): void {
    e.preventDefault();

    const isKeyDown = e.type === "keydown",
      input = e.target as HTMLInputElement;

    if (self.amPM !== undefined && e.target === self.amPM)
      self.amPM.textContent =
        self.l10n.amPM[self.amPM.textContent === "AM" ? 1 : 0];

    const min = Number(input.min),
      max = Number(input.max),
      step = Number(input.step),
      curValue = parseInt(input.value, 10),
      delta =
        (e as IncrementEvent).delta ||
        (isKeyDown
          ? e.which === 38 ? 1 : -1
          : Math.max(
              -1,
              Math.min(
                1,
                (e as WheelEvent).wheelDelta || -(e as WheelEvent).deltaY
              )
            ) || 0);

    let newValue = curValue + step * delta;

    if (typeof input.value !== "undefined" && input.value.length === 2) {
      const isHourElem = input === self.hourElement,
        isMinuteElem = input === self.minuteElement;

      if (newValue < min) {
        newValue =
          max +
          newValue +
          int(!isHourElem) +
          (int(isHourElem) && int(!self.amPM));

        if (isMinuteElem) incrementNumInput(undefined, -1, self.hourElement);
      } else if (newValue > max) {
        newValue =
          input === self.hourElement ? newValue - max - int(!self.amPM) : min;

        if (isMinuteElem) incrementNumInput(undefined, 1, self.hourElement);
      }

      if (
        self.amPM &&
        isHourElem &&
        (step === 1
          ? newValue + curValue === 23
          : Math.abs(newValue - curValue) > step)
      )
        self.amPM.textContent = self.amPM.textContent === "PM" ? "AM" : "PM";

      input.value = pad(newValue);
    }
  }

  init();
  return self;
}

/* istanbul ignore next */
function _flatpickr(
  nodeList: NodeList | HTMLElement[],
  config?: Options
): Instance | Instance[] {
  const nodes: HTMLElement[] = Array.prototype.slice.call(nodeList); // static list
  let instances = [];
  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];
    try {
      if (node.getAttribute("data-fp-omit") !== null) continue;

      if (node._flatpickr !== undefined) {
        node._flatpickr.destroy();
        node._flatpickr = undefined;
      }

      node._flatpickr = FlatpickrInstance(node, config || {});
      instances.push(node._flatpickr);
    } catch (e) {
      console.warn(e, e.stack);
    }
  }

  return instances.length === 1 ? instances[0] : instances;
}

/* istanbul ignore next */
if (typeof HTMLElement !== "undefined") {
  // browser env
  HTMLCollection.prototype.flatpickr = NodeList.prototype.flatpickr = function(
    config: Options
  ) {
    return _flatpickr(this, config);
  };

  HTMLElement.prototype.flatpickr = function(config: Options) {
    return _flatpickr([this], config);
  };
}

/* istanbul ignore next */
var flatpickr: FlatpickrFn;
flatpickr = function(
  selector: NodeList | HTMLElement | string,
  config?: Options
) {
  if (selector instanceof NodeList) return _flatpickr(selector, config);
  else if (typeof selector === "string")
    return _flatpickr(window.document.querySelectorAll(selector), config);

  return _flatpickr([selector], config);
} as FlatpickrFn;

window.flatpickr = flatpickr;

/* istanbul ignore next */
flatpickr.defaultConfig = defaultOptions;

flatpickr.l10ns = {
  en: { ...English },
  default: { ...English },
};

flatpickr.localize = (l10n: CustomLocale) => {
  flatpickr.l10ns.default = {
    ...flatpickr.l10ns.default,
    ...l10n,
  };
};
flatpickr.setDefaults = (config: Options) => {
  flatpickr.defaultConfig = {
    ...flatpickr.defaultConfig,
    ...(config as ParsedOptions),
  };
};

/* istanbul ignore next */
if (typeof jQuery !== "undefined") {
  (jQuery.fn as any).flatpickr = function(config: Options) {
    return _flatpickr(this, config);
  };
}

Date.prototype.fp_incr = function(days: number | string) {
  return new Date(
    this.getFullYear(),
    this.getMonth(),
    this.getDate() + (typeof days === "string" ? parseInt(days, 10) : days)
  );
};

export default flatpickr;
