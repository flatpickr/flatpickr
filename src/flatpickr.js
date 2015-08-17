/*
    chmln.flatpickr  - pick dates elegantly
    © Gregory Petrosyan

    https://github.com/chmln/flatpickr

    Credits to Josh Salverda <josh.salverda@gmail.com> for providing a
    magnificent starting point.

    This program is free software. It comes without any warranty, to
    the extent permitted by applicable law. You can redistribute it
    and/or modify it under the terms of the Do What The Fuck You Want
    To Public License, Version 2, as published by Sam Hocevar. See
    http://www.wtfpl.net/ for more details.
*/

var flatpickr = function (selector, config) {
    'use strict';
    var elements,
        createInstance,
        instances = [],
        i;

    flatpickr.prototype = flatpickr.init.prototype;

    createInstance = function (element) {
        if (element._flatpickr) {
            element._flatpickr.destroy();
        }
        element._flatpickr = new flatpickr.init(element, config);
        return element._flatpickr;
    };

    if (selector.nodeName) {
        return createInstance(selector);
    }

    elements = document.querySelectorAll(selector);

    if (elements.length === 1) {
        return createInstance(elements[0]);
    }

    for (i = 0; i < elements.length; i++) {
        instances.push(createInstance(elements[i]));
    }
    return instances;
};

/**
 * @constructor
 */
flatpickr.init = function (element, instanceConfig) {
    'use strict';

    var self = this,
        calendarContainer = document.createElement('div'),
        navigationCurrentMonth = document.createElement('span'),
        calendar = document.createElement('table'),
        calendarBody = document.createElement('tbody'),
        wrapperElement,
        currentDate = new Date(),
        wrap,
        date,
        formatDate,
        monthToStr,
        isDisabled,
        buildWeekdays,
        buildDays,
        updateNavigationCurrentMonth,
        buildMonthNavigation,
        handleYearChange,
        documentClick,
        calendarClick,
        buildCalendar,
        bind,
        open,
        close,
        destroy,
        init,
        triggerChange,
        changeMonth,
        getDaysinMonth;

    calendarContainer.className = 'flatpickr-calendar';
    navigationCurrentMonth.className = 'flatpickr-current-month';
    instanceConfig = instanceConfig || {};

    wrap = function () {
        wrapperElement = document.createElement('div');
        wrapperElement.className = 'flatpickr-wrapper';
        self.element.parentNode.insertBefore(wrapperElement, self.element);
        wrapperElement.appendChild(self.element);
    };



    getDaysinMonth = function(){
        var yr = self.currentYearView;
        if (yr === 1 && ( !((yr % 4) || (!(yr % 100) && (yr % 400))) ) )
            return 29;
        return self.l10n.daysInMonth[self.currentMonthView];
    }

    formatDate = function (dateFormat, milliseconds) {
        var formattedDate = '',
            dateObj = new Date(milliseconds),
            formats = {
                d: function () {
                    var day = formats.j();
                    return (day < 10) ? '0' + day : day;
                },
                D: function () {
                    return self.l10n.weekdays.shorthand[formats.w()];
                },
                j: function () {
                    return dateObj.getDate();
                },
                l: function () {
                    return self.l10n.weekdays.longhand[formats.w()];
                },
                w: function () {
                    return dateObj.getDay();
                },
                F: function () {
                    return monthToStr(formats.n() - 1, false);
                },
                m: function () {
                    var month = formats.n();
                    return (month < 10) ? '0' + month : month;
                },
                M: function () {
                    return monthToStr(formats.n() - 1, true);
                },
                n: function () {
                    return dateObj.getMonth() + 1;
                },
                U: function () {
                    return dateObj.getTime() / 1000;
                },
                y: function () {
                    return String(formats.Y()).substring(2);
                },
                Y: function () {
                    return dateObj.getFullYear();
                }
            },
            formatPieces = dateFormat.split('');

        self.forEach(formatPieces, function (formatPiece, index) {
            if (formats[formatPiece] && formatPieces[index - 1] !== '\\') {
                formattedDate += formats[formatPiece]();
            } else if (formatPiece !== '\\') {
                    formattedDate += formatPiece;
            }
        });

        return formattedDate;
    };

    monthToStr = function (date, shorthand) {
        if (shorthand === true) {
            return self.l10n.months.shorthand[date];
        }

        return self.l10n.months.longhand[date];
    };



    buildWeekdays = function () {
        var weekdayContainer = document.createElement('thead'),
            firstDayOfWeek = self.l10n.firstDayOfWeek,
            weekdays = self.l10n.weekdays.shorthand.slice();


        if (firstDayOfWeek > 0 && firstDayOfWeek < weekdays.length) {
            weekdays = [].concat(weekdays.splice(firstDayOfWeek, weekdays.length), weekdays.splice(0, firstDayOfWeek));
        }

        weekdayContainer.innerHTML = '<tr><th>' + weekdays.join('</th><th>') + '</th></tr>';
        calendar.appendChild(weekdayContainer);
    };

    isDisabled = function(date)
    {

        for (var i = 0; i < self.config.disable.length; i++) {
            if (date >= new Date( self.config.disable[i]['from'] ) && date <= new Date( self.config.disable[i]['to'] ) )
                    {

                        return true;
                    }
        }

        return false;
    };

    buildDays = function () {
        var firstOfMonth = new Date(self.currentYearView, self.currentMonthView, 1).getDay(),
            numDays = getDaysinMonth(),
            calendarFragment = document.createDocumentFragment(),
            row = document.createElement('tr'),
            dayCount,
            dayNumber,
            today = '',
            selected = '',
            disabled = '',
            currentTimestamp,
            cur_date;

        // Offset the first day by the specified amount
        firstOfMonth -= self.l10n.firstDayOfWeek;
        firstOfMonth < 0 && (firstOfMonth += 7);

        // Add spacer to line up the first day of the month correctly
        firstOfMonth > 0 && (row.innerHTML += '<td colspan="' + firstOfMonth + '">&nbsp;</td>');

        dayCount = firstOfMonth;
        calendarBody.innerHTML = '';




        // Start at 1 since there is no 0th day
        for (dayNumber = 1; dayNumber <= numDays; dayNumber++) {
            // if we have reached the end of a week, wrap to the next line
            if (dayCount === 7) {
                calendarFragment.appendChild(row);
                row = document.createElement('tr');
                dayCount = 0;
            }

            cur_date = new Date(self.currentYearView, self.currentMonthView, dayNumber);


            today = (!self.selectedDateObj && cur_date.valueOf() === currentDate.valueOf() ) ? ' today' : '';

            selected = self.selectedDateObj && cur_date.valueOf() === self.selectedDateObj.valueOf() ? ' selected' : '';



            var date_is_disabled = self.config.disable && isDisabled( cur_date  );

            var date_outside_minmax = (self.config.minDate && cur_date < self.config.minDate ) || (self.config.maxDate && cur_date >= self.config.maxDate);

            disabled = (date_is_disabled || date_outside_minmax) ? " disabled" : " slot";



            row.innerHTML += '<td class="' + today + selected + disabled + '"><span class="flatpickr-day">' + dayNumber + '</span></td>';
            dayCount++;
        }

        calendarFragment.appendChild(row);
        calendarBody.appendChild(calendarFragment);
    };

    updateNavigationCurrentMonth = function () {
        navigationCurrentMonth.innerHTML = '<span>' + monthToStr(self.currentMonthView, false) + '</span> ' + self.currentYearView;
    };

    buildMonthNavigation = function () {
        var months = document.createElement('div'),
            monthNavigation;

        monthNavigation  = '<span class="flatpickr-prev-month">' + self.config.prevArrow + '</span>'
                         + '<span class="flatpickr-next-month">' + self.config.nextArrow + '</span>';

        months.className = 'flatpickr-months';
        months.innerHTML = monthNavigation;

        months.appendChild(navigationCurrentMonth);
        updateNavigationCurrentMonth();
        calendarContainer.appendChild(months);
    };

    handleYearChange = function () {
        if (self.currentMonthView < 0) {
            self.currentYearView--;
            self.currentMonthView = 11;
        }

        if (self.currentMonthView > 11) {
            self.currentYearView++;
            self.currentMonthView = 0;
        }
    };

    documentClick = function (event) {
       if (!wrapperElement.contains(event.target))
        close();
    };

    changeMonth = function(to)
    {
        (to === 'prev') ?  self.currentMonthView-- : self.currentMonthView++;
        handleYearChange();
        updateNavigationCurrentMonth();
        buildDays();
    }

    calendarClick = function (event) {
        event.preventDefault();
        var t = event.target;

        if ( t.classList.contains('slot') || t.parentNode.classList.contains('slot') )
        {
            var selDate = parseInt( t.childNodes[0].innerHTML || t.innerHTML, 10),
            currentTimestamp;

            self.selectedDateObj = new Date(self.currentYearView,self.currentMonthView,selDate ),
            currentTimestamp = self.selectedDateObj.getTime();

            if (self.config.altInput)
                self.config.altInput.value = formatDate(self.config.altFormat || self.config.dateFormat, currentTimestamp);



            self.element.value = formatDate(self.config.dateFormat, currentTimestamp);

            close();
            buildDays();
            triggerChange();
        }





    };

    buildCalendar = function () {
        buildMonthNavigation();
        buildWeekdays();
        buildDays();

        calendar.appendChild(calendarBody);
        calendarContainer.appendChild(calendar);

        wrapperElement.appendChild(calendarContainer);
    };

    bind = function () {
        var openEvent = (self.element.nodeName === 'INPUT') ? 'focus'  : 'click';

        self.element.addEventListener(openEvent, open, false);

        wrapperElement.querySelector(".flatpickr-prev-month").addEventListener('click', function(){ changeMonth('prev') });
        wrapperElement.querySelector(".flatpickr-next-month").addEventListener('click', function(){ changeMonth('next') });

        calendar.addEventListener('click', calendarClick);

    };

    open = function () {
        self.element.blur();
        document.addEventListener('click', documentClick, false);
        wrapperElement.classList.add('open');
    };

    close = function () {
        document.removeEventListener('click', documentClick, false);
        wrapperElement.classList.remove('open');
    };

    triggerChange = function(){

        "createEvent" in document
            ? ( element.dispatchEvent( new Event("change") ) )
            : ( element.fireEvent("onchange") );

    }

    destroy = function () {
        var parent,
            element;

        document.removeEventListener('click', documentClick, false);
        self.element.removeEventListener('focus', open, false);
        self.element.removeEventListener('blur', close, false);
        self.element.removeEventListener('click', open, false);

        parent = self.element.parentNode;
        parent.removeChild(calendarContainer);
        element = parent.removeChild(self.element);
        parent.parentNode.replaceChild(element, parent);
    };

    init = function () {
        var config, parsedDate, D;

        self.config = {};
        self.destroy = destroy;

        for (config in self.defaultConfig)
            self.config[config] = instanceConfig[config] || self.defaultConfig[config];

        self.element = element;

        self.element.value && (parsedDate = Date.parse(self.element.value) );

        D =  currentDate;

       (parsedDate && !isNaN(parsedDate)) && ( D = self.selectedDateObj = new Date(parsedDate) )

        self.currentYearView = D.getFullYear();
        self.currentMonthView = D.getMonth();
        self.currentDayView = D.getDate();


        typeof self.config.minDate === 'string' && (self.config.minDate = new Date(self.config.minDate));
        typeof self.config.maxDate === 'string' && (self.config.maxDate = new Date(self.config.maxDate));

        // jump to minDate's month
        self.config.minDate && ( self.currentMonthView = self.config.minDate.getMonth() );

        self.config.minDate && ( self.config.minDate.setHours(0,0,0,0) );
        self.config.maxDate && ( self.config.maxDate.setHours(0,0,0,0) );

        currentDate.setHours(0,0,0,0);

        wrap();
        buildCalendar();
        bind();
    };

    self.redraw = function(){
        flatpickr(self.element, self.config);
    }

    self.set = function(key, value){
        key in self.config && (self.config[key] = value , self.redraw() );
    }

    init();

    return self;
};

flatpickr.init.prototype = {

    forEach: function (items, callback) { [].forEach.call(items, callback); },

    l10n: {
        weekdays: {
            shorthand: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
            longhand: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
        },
        months: {
            shorthand: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            longhand: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
        },
        daysInMonth: [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
        firstDayOfWeek: 0
    },

    defaultConfig : {
            dateFormat: 'F j, Y',
            altFormat: null,
            altInput: null,
            minDate: null,
            maxDate: null,
            disable: null,
            shorthandCurrentMonth: false,
            prevArrow: '&lt;',
            nextArrow: '&gt;'
    }
};
