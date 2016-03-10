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

    for (var i = 0; i < elements.length; i++) {
        instances.push(createInstance(elements[i]));
    }

    return instances;
};

/**
 * @constructor
 */
flatpickr.init = function (element, instanceConfig) {
    'use strict';

    // functions
    var self = this,
        wrap,
        uDate,
        equalDates,
        pad,
        formatDate,
        monthToStr,
        isDisabled,
        buildWeekdays,
        buildDays,
        buildTime,
        timeWrapper,
        updateValue,
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
        getDaysinMonth,
        jumpToDate;

    // elements & variables
    var calendarContainer = document.createElement('div'),
        navigationCurrentMonth = document.createElement('span'),
        monthsNav = document.createElement('div'),
        prevMonthNav = document.createElement('span'),
        nextMonthNav = document.createElement('span'),
        calendar = document.createElement('table'),
        calendarBody = document.createElement('tbody'),
        currentDate = new Date(),
        altInput,
        wrapperElement = document.createElement('div'),
        hourElement,
        minuteElement,
        am_pm;


    init = function () {

        calendarContainer.className = 'flatpickr-calendar';
        navigationCurrentMonth.className = 'flatpickr-current-month';
        instanceConfig = instanceConfig || {};

        self.config = {};
        self.element = element;
        self.destroy = destroy;

        for (var config in self.defaultConfig)
            self.config[config] =
                instanceConfig[config] ||
                self.element.dataset[config.toLowerCase()] ||
                self.defaultConfig[config];


        self.config.defaultDate &&
            ( self.config.defaultDate = uDate(self.config.defaultDate) );


        if ( self.element.value || self.config.defaultDate )
            self.selectedDateObj = uDate(self.config.defaultDate||self.element.value);

        self.config.minDate && ( self.config.minDate =
            uDate(self.config.minDate === "today" ? new Date() : self.config.minDate, true) );

        self.config.maxDate && (self.config.maxDate = uDate(self.config.maxDate, true) );


        jumpToDate(self.selectedDateObj||self.config.minDate||currentDate);

        wrap();
        buildCalendar();
        bind();
        updateValue();
    };

    uDate = function(date, timeless){

        timeless = timeless||false;

        // dashes to slashes (just in case) to keep firefox happy
        typeof date === 'string' && (date = new Date(date.replace(/-/g, "/")));
        timeless && ( date.setHours(0,0,0,0) );

        return date;
    }

    equalDates = function(date1, date2){
        return date1.getFullYear() === date2.getFullYear() &&
                date1.getMonth() === date2.getMonth() &&
                date1.getDate() === date2.getDate();

    }

    wrap = function () {

        wrapperElement.className = 'flatpickr-wrapper';

        self.element.parentNode.insertBefore(wrapperElement, self.element);
        wrapperElement.appendChild(self.element);

        self.config.inline && ( wrapperElement.classList.add('inline') );

        if ( self.config.altInput ){

            // replicate self.element
            altInput = document.createElement(self.element.nodeName);
            altInput.className = self.element.className;

            self.element.type='hidden';
            wrapperElement.appendChild(altInput);

        }

    };

    getDaysinMonth = function(givenMonth){

        var yr = self.currentYear,
            month = givenMonth || self.currentMonth;

        if (month === 1 && ( !( (yr % 4) || (!(yr % 100) && (yr % 400))) ) )
            return 29;

        return self.l10n.daysInMonth[month];
    }

    updateValue = function(){

        if (self.selectedDateObj && self.config.enableTime ){

            // update time
            var hour = parseInt(hourElement.value)%12 + 12*(am_pm.innerHTML=== "PM"),
                minute = (60+parseInt(minuteElement.value ))%60;

            self.selectedDateObj.setHours(hour , minute );

            hourElement.value = pad((12 + hour)%12+12*(hour%12===0));
            minuteElement.value = pad(minute);

        }

        if ( self.selectedDateObj )
            self.element.value = formatDate(self.config.dateFormat);

        if ( self.config.altInput && self.selectedDateObj )
            altInput.value = formatDate(self.config.altFormat);

        triggerChange();

    }

    pad = function(num){
        return ("0" + num).slice(-2);
    }

    formatDate = function (dateFormat) {

        self.config.enableTime && ( dateFormat+= " " + self.config.timeFormat);

        var formattedDate = '',
            formats = {
                d: function () {
                    return pad( formats.j() );
                },
                D: function () {
                    return self.l10n.weekdays.shorthand[ formats.w() ];
                },
                j: function () {
                    return self.selectedDateObj.getDate();
                },
                l: function () {
                    return self.l10n.weekdays.longhand[ formats.w() ];
                },
                w: function () {
                    return self.selectedDateObj.getDay();
                },
                F: function () {
                    return monthToStr( formats.n() - 1, false );
                },
                m: function () {
                    return pad( formats.n() );
                },
                M: function () {
                    return monthToStr( formats.n() - 1, true );
                },
                n: function () {
                    return self.selectedDateObj.getMonth() + 1;
                },
                U: function () {
                    return self.selectedDateObj.getTime() / 1000;
                },
                y: function () {
                    return String( formats.Y() ).substring(2);
                },
                Y: function () {
                    return self.selectedDateObj.getFullYear();
                },

                h: function(){
                    return self.selectedDateObj.getHours()%12 ? self.selectedDateObj.getHours()%12 : 12;
                },

                H: function(){
                    return pad(self.selectedDateObj.getHours());
                },

                i: function(){
                    return pad( self.selectedDateObj.getMinutes() );
                },

                K: function(){
                    return self.selectedDateObj.getHours() > 11 ? "PM" : "AM";
                }
            },
            formatPieces = dateFormat.split('');

        [].forEach.call(formatPieces, function (formatPiece, index) {

            if (formats[formatPiece] && formatPieces[index - 1] !== '\\') 
                formattedDate += formats[formatPiece]();

            else if (formatPiece !== '\\') 
                    formattedDate += formatPiece;
            

        });

        return formattedDate;
    };

    monthToStr = function (date, shorthand) {

        return shorthand ? self.l10n.months.shorthand[date] : self.l10n.months.longhand[date];

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

    isDisabled = function(date){

        for (var i = 0; i < self.config.disable.length; i++)
            if ( date >= uDate( self.config.disable[i]['from'] )  && date <= uDate( self.config.disable[i]['to'] ) )
                    return true;

        return false;

    };

    buildTime = function(){

        var timeContainer = document.createElement("div"),
            separator = document.createElement("span");

        timeContainer.className = "flatpickr-time";

        hourElement = document.createElement("input");
        minuteElement = document.createElement("input");
        am_pm = document.createElement("span");
        am_pm.className = "flatpickr-am-pm";

        separator.className = "flatpickr-time-separator";
        separator.innerHTML = ":";

        hourElement.className = "flatpickr-hour";
        hourElement.type = minuteElement.type = "number";
        minuteElement.className = "flatpickr-minute";


        hourElement.value = self.selectedDateObj ? pad(self.selectedDateObj.getHours()) : 12;
        minuteElement.value = self.selectedDateObj ? pad(self.selectedDateObj.getMinutes()) : "00";
        am_pm.innerHTML = ["AM","PM"][(self.selectedDateObj && hourElement.value > 11)|0];

        hourElement.step = self.config.hourIncrement;
        minuteElement.step = self.config.minuteIncrement;

        hourElement.max = 12;
        minuteElement.max = 59;
        hourElement.min = 1;
        minuteElement.min = 0;

        timeContainer.appendChild(hourElement);
        timeContainer.appendChild(separator);
        timeContainer.appendChild(minuteElement);
        timeContainer.appendChild(am_pm);

        calendarContainer.appendChild(timeContainer);

    }


    timeWrapper = function (e){

        e.preventDefault();

        var min = parseInt(e.target.min),
            max = parseInt(e.target.max),
            step = parseInt(e.target.step),
            delta = step * ( Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail))) ),
            newValue = ( parseInt(e.target.value) + delta )%(max+(min===0));

        newValue < min && ( newValue = max+(min===0) - step*(min===0) );
        e.target.value = pad( newValue );

    }

    buildDays = function () {

        var firstOfMonth = ( new Date(self.currentYear, self.currentMonth, 1).getDay() - self.l10n.firstDayOfWeek + 7 )%7,
            numDays = getDaysinMonth(),
            prevMonth = ( self.currentMonth - 1 + 12)%12,
            prevMonthDays = getDaysinMonth( prevMonth ),
            calendarFragment = document.createDocumentFragment(),
            row = document.createElement('tr'),
            dayNumber,
            className,
            cur_date,
            date_is_disabled,
            date_outside_minmax;


        // prepend days from the ending of previous month
        for( dayNumber = prevMonthDays + 1 - firstOfMonth ; dayNumber <= prevMonthDays; dayNumber++ )
            row.innerHTML +=
                '<td class="disabled">'
                    + '<span class="flatpickr-day">'
                        + (dayNumber )
                    + '</span>' +
                '</td>';

        calendarBody.innerHTML = '';


        // Start at 1 since there is no 0th day
        for (dayNumber = 1; dayNumber <= 42 - firstOfMonth; dayNumber++) {

            if (dayNumber <= numDays) // avoids new date objects for appended dates
                cur_date = new Date(self.currentYear, self.currentMonth, dayNumber);

            // we have reached the end of a week, wrap to the next line
            if ( (dayNumber + firstOfMonth - 1) % 7 === 0) {

                calendarFragment.appendChild(row);
                row = document.createElement('tr');

            }

            date_outside_minmax = (self.config.minDate && cur_date < self.config.minDate )
                ||  (self.config.maxDate && cur_date > self.config.maxDate);


            date_is_disabled = dayNumber > numDays || date_outside_minmax || isDisabled( cur_date );

            className = date_is_disabled ? "disabled" : "slot";

            if (!date_is_disabled && !self.selectedDateObj && equalDates(cur_date, currentDate) )
                className += ' today';

            if (!date_is_disabled && self.selectedDateObj && equalDates(cur_date, self.selectedDateObj) )
                className += ' selected';


            row.innerHTML +=
                            '<td class="' + className + '">'
                                + '<span class="flatpickr-day">'
                                    + (dayNumber > numDays ? dayNumber % numDays : dayNumber)
                                + '</span></td>';


        }

        calendarFragment.appendChild(row);
        calendarBody.appendChild(calendarFragment);

    };

    updateNavigationCurrentMonth = function () {

        navigationCurrentMonth.innerHTML =
            '<span>' +
                monthToStr(self.currentMonth, self.config.shorthandCurrentMonth) +
            '</span> '
            + self.currentYear;

    };

    buildMonthNavigation = function () {

        monthsNav.className = 'flatpickr-months';

        prevMonthNav.className = "flatpickr-prev-month";
        prevMonthNav.innerHTML = self.config.prevArrow;

        nextMonthNav.className = "flatpickr-next-month";
        nextMonthNav.innerHTML = self.config.nextArrow;

        monthsNav.appendChild(prevMonthNav);
        monthsNav.appendChild(navigationCurrentMonth);
        monthsNav.appendChild(nextMonthNav);

        updateNavigationCurrentMonth();
        calendarContainer.appendChild(monthsNav);
    };

    handleYearChange = function () {

        if (self.currentMonth < 0 || self.currentMonth > 11) {

            self.currentYear += self.currentMonth % 11;
            self.currentMonth = (self.currentMonth + 12) % 12;

        }

    };

    documentClick = function (event) {
        if (wrapperElement.classList.contains("open") && !wrapperElement.contains(event.target))
            self.close();

    };

    changeMonth = function(offset)
    {

        self.currentMonth += offset;

        handleYearChange();
        updateNavigationCurrentMonth();
        buildDays();
    }

    calendarClick = function (event) {

        event.preventDefault();

        var targetDate = event.target;

        if ( targetDate.classList.contains('slot') || targetDate.parentNode.classList.contains('slot') )
        {

            self.selectedDateObj = new Date( 
                self.currentYear, self.currentMonth,
                targetDate.childNodes[0].innerHTML||targetDate.innerHTML
            );

            updateValue();
            buildDays();

            if ( !self.config.inline && !self.config.enableTime )
                self.close();            
            
        }

    };

    buildCalendar = function () {

        buildMonthNavigation();
        buildWeekdays();
        buildDays();

        calendar.appendChild(calendarBody);
        calendarContainer.appendChild(calendar);

        wrapperElement.appendChild(calendarContainer);

        self.config.enableTime && ( buildTime() );

    };

    bind = function () {

        function am_pm_toggle(e){ 
            e.preventDefault();
            am_pm.innerHTML =  ["AM","PM"][(am_pm.innerHTML === "AM")|0]; 
        }

        self.element.addEventListener( 'focus' , self.open);
        self.config.altInput && (altInput.addEventListener( 'focus' , self.open) );

        prevMonthNav.addEventListener('click', function(){ changeMonth(-1) });
        nextMonthNav.addEventListener('click', function(){ changeMonth(1) });

        calendar.addEventListener('click', calendarClick);
        document.addEventListener('click', documentClick, true);

        if ( self.config.enableTime ){

            hourElement.addEventListener("mousewheel", timeWrapper);
            hourElement.addEventListener("DOMMouseScroll", timeWrapper);
            minuteElement.addEventListener("mousewheel", timeWrapper);
            minuteElement.addEventListener("DOMMouseScroll", timeWrapper);

            hourElement.addEventListener("mouseout", updateValue);
            minuteElement.addEventListener("mouseout", updateValue);

            hourElement.addEventListener("change", updateValue);
            minuteElement.addEventListener("change", updateValue);

            hourElement.addEventListener("click", function(){hourElement.select();});
            minuteElement.addEventListener("click", function(){minuteElement.select();});

            am_pm.addEventListener("focus", function(){am_pm.blur();});
            am_pm.addEventListener("click", am_pm_toggle);

            am_pm.addEventListener("mousewheel", am_pm_toggle);
            am_pm.addEventListener("DOMMouseScroll", am_pm_toggle);
            am_pm.addEventListener("mouseout", updateValue);

        }



    };

    self.open = function () {

        self.element.blur();
        altInput && (altInput.blur());

        !self.config.inline && ( wrapperElement.classList.add('open') );

    };

    self.close = function () {
        wrapperElement.classList.remove('open');

    };

    triggerChange = function(){

        "createEvent" in document
            ? ( element.dispatchEvent( new Event("change") ) )
            : ( element.fireEvent("onchange") );

        self.config.onChange(self.selectedDateObj, self.element.value);

    }

    destroy = function () {
        var parent,
            element;

        document.removeEventListener('click', documentClick, false);
        self.element.removeEventListener('focus', self.open, false);
        self.element.removeEventListener('click', self.open, false);

        parent = self.element.parentNode;
        parent.removeChild(calendarContainer);
        element = parent.removeChild(self.element);
        parent.parentNode.replaceChild(element, parent);
    };

    jumpToDate = function(jumpDate) {
        jumpDate = jumpDate||self.selectedDateObj||self.config.minDate||currentDate;
        self.currentYear = jumpDate.getFullYear();
        self.currentMonth = jumpDate.getMonth();

    };



    self.redraw = function(){

        updateNavigationCurrentMonth();
        buildDays();

    }

    self.jumpToDate = function(date){

        jumpToDate(uDate(date)||new Date());
        self.redraw();

    }

    self.setDate = function(date, triggerChangeEvent){

        self.selectedDateObj = uDate(date);
        self.jumpToDate(self.selectedDateObj);

        triggerChangeEvent = triggerChangeEvent||false;
        triggerChangeEvent && (triggerChange());

     }

    self.set = function(key, value){

        if (key in self.config) {

            self.config[key] = value;
            jumpToDate();
            self.redraw();

        }

    }

    init();

    return self;
};

flatpickr.init.prototype = {

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
            dateFormat: 'Y-m-d',
            altInput: false,
            altFormat: "F j, Y",
            defaultDate: null,
            minDate: null,
            maxDate: null,
            disable: [],
            shorthandCurrentMonth: false,
            inline: false,
            prevArrow: '&lt;',
            nextArrow: '&gt;',
            enableTime: false,
            timeFormat: "h:i K",
            hourIncrement: 1,
            minuteIncrement: 5,
            onChange: function(dateObj, dateStr){}
    }
};


if (typeof module != 'undefined')
    module.exports = flatpickr;
