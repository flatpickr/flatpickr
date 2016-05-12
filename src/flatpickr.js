var flatpickr = function (selector, config) {
    'use strict';
    let elements, instances, createInstance = element => {
        if (element._flatpickr)
            element._flatpickr.destroy();

        element._flatpickr = new flatpickr.init(element, config);
        return element._flatpickr;
    };

    if (selector.nodeName)
        return createInstance(selector);
    /*
    Utilize the performance of native getters if applicable
    https://jsperf.com/getelementsbyclassname-vs-queryselectorall/18
    https://jsperf.com/jquery-vs-javascript-performance-comparison/22
    */
    else if ( /^\#[a-zA-Z0-9\-\_]*$/.test(selector) )
        return createInstance(document.getElementById(selector.slice(1)));

    else if ( /^\.[a-zA-Z0-9\-\_]*$/.test(selector) )
        elements = document.getElementsByClassName(selector.slice(1));

    else
        elements = document.querySelectorAll(selector);

    instances = [].slice.call(elements).map(createInstance);

    return {
        calendars: instances,
        byID: id => {
            for(let i=0;i<instances.length;i++)
                if(instances[i].element.id === id)
                    return instances[i];
        }

    };
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
        yearScroll,
        updateValue,
        updateNavigationCurrentMonth,
        buildMonthNavigation,
        handleYearChange,
        documentClick,
        calendarClick,
        buildCalendar,
        bind,
        init,
        triggerChange,
        changeMonth,
        getDaysinMonth;

    // elements & variables
    var calendarContainer = document.createElement('div'),
        navigationCurrentMonth = document.createElement('span'),
        monthsNav = document.createElement('div'),
        prevMonthNav = document.createElement('span'),
        cur_year = document.createElement('span'),
        cur_month = document.createElement('span'),
        nextMonthNav = document.createElement('span'),
        calendar = document.createElement('div'),
        currentDate = new Date(),
        wrapperElement = document.createElement('div'),
        hourElement,
        minuteElement,
        am_pm,
        clickEvt;


    init = function () {

        navigationCurrentMonth.className = 'flatpickr-current-month';
        calendarContainer.className = 'flatpickr-calendar';
        calendar.className = "flatpickr-days";

        instanceConfig = instanceConfig || {};

        self.config = {};
        self.element = element;

        for (var config in self.defaultConfig)
            self.config[config] =
                instanceConfig[config] ||
                self.element.dataset&&self.element.dataset[config.toLowerCase()] ||
                self.element.getAttribute("data-"+config)||
                self.defaultConfig[config];


        self.input = (self.config.wrap) ? element.querySelector("[data-input]") : element;

        if(self.config.defaultDate){
            self.config.defaultDate = uDate(self.config.defaultDate);
        }

        if ( self.input.value || self.config.defaultDate )
            self.selectedDateObj = uDate(self.config.defaultDate||self.input.value);


        self.jumpToDate();

        wrap();
        buildCalendar();
        bind();

        if(!self.config.noCalendar)
            updateValue();
    };

    uDate = function(date, timeless){

        timeless = timeless||false;

        if (date === 'today'){
            date = new Date();
            timeless=true;
        }

        else if (typeof date === 'string'){

            if ( Date.parse(date) )
                return new Date(date);

            else if (self.config.noCalendar && /\d\d[:\s]\d\d/.test(date))
                // time-only picker
                return new Date(`${currentDate.toDateString()} ${date}`);

            console.error(`flatpickr: invalid date string ${date}`);
            console.info(self.element);
            return null;
        }

        if(timeless && date)
            date.setHours(0,0,0,0);

        return date;
    };

    equalDates = function(date1, date2, utc){

        utc = utc||false;

        if(utc)
            return date1.getUTCFullYear() === date2.getUTCFullYear() &&
                    date1.getUTCMonth() === date2.getUTCMonth() &&
                    date1.getUTCDate() === date2.getUTCDate();

        return date1.getFullYear() === date2.getFullYear() &&
                    date1.getMonth() === date2.getMonth() &&
                    date1.getDate() === date2.getDate();

    };

    wrap = function () {

        wrapperElement.className = 'flatpickr-wrapper';

        self.element.parentNode.insertBefore(wrapperElement, self.element);
        wrapperElement.appendChild(self.element);

        if(self.config.inline)
            wrapperElement.classList.add('inline');

        if ( self.config.altInput ){
            // replicate self.element
            self.altInput = document.createElement(self.input.nodeName);
            self.altInput.placeholder = self.input.placeholder;
            self.altInput.type = self.input.type||"text";

            self.input.type='hidden';
            wrapperElement.appendChild(self.altInput);
        }

    };

    getDaysinMonth = function(givenMonth){

        let yr = self.currentYear,
            month = givenMonth||self.currentMonth;

        if (month === 1 && ((yr % 4 === 0) && (yr % 100 !== 0)) || (yr % 400 === 0) )
            return 29;

        return self.l10n.daysInMonth[month];
    };

    updateValue = function(){

        if (self.selectedDateObj && self.config.enableTime ){

            // update time
            var hour = parseInt(hourElement.value),
                minute = (60+parseInt(minuteElement.value ))%60;

            if (!self.config.time_24hr)
                hour = hour%12 + 12*(am_pm.innerHTML=== "PM");

            self.selectedDateObj.setHours(hour , minute );

            hourElement.value =
                pad( self.config.time_24hr ? hour : ((12 + hour)%12+12*(hour%12===0)));

            minuteElement.value = pad(minute);

        }

        if ( self.altInput && self.selectedDateObj )
            self.altInput.value = formatDate(self.config.altFormat);

        if ( self.selectedDateObj )
            self.input.value = formatDate(self.config.dateFormat);

        triggerChange();

    };

    pad = num =>("0" + num).slice(-2);

    formatDate = function (dateFormat) {

        if (self.config.noCalendar)
            dateFormat = "";

        if(self.config.enableTime)
            dateFormat+= " " + self.config.timeFormat;

        let formattedDate = '',
            formats = {
                D: () => self.l10n.weekdays.shorthand[ formats.w() ],
                F: () => monthToStr( formats.n() - 1, false ),
                H: () => pad(self.selectedDateObj.getHours()),
                K: () => self.selectedDateObj.getHours() > 11 ? "PM" : "AM",
                M: () => monthToStr( formats.n() - 1, true ),
                U: () => self.selectedDateObj.getTime() / 1000,
                Y: () => self.selectedDateObj.getFullYear(),
                d: () => pad( formats.j() ),
                h: () => self.selectedDateObj.getHours()%12 ? self.selectedDateObj.getHours()%12 : 12,
                i: () => pad( self.selectedDateObj.getMinutes() ),
                j: () => self.selectedDateObj.getDate(),
                l: () => self.l10n.weekdays.longhand[ formats.w() ],
                m: () => pad( formats.n() ),
                n: () => self.selectedDateObj.getMonth() + 1,
                w: () => self.selectedDateObj.getDay(),
                y: () => String( formats.Y() ).substring(2)
            },
            formatPieces = dateFormat.split('');

        for(let i = 0; i < formatPieces.length; i++){

            if (formats[formatPieces[i]] && formatPieces[i - 1] !== '\\')
                formattedDate += formats[formatPieces[i]]();

            else if (formatPieces[i] !== '\\')
                    formattedDate += formatPieces[i];
        }

        return formattedDate;
    };

    monthToStr = function (date, shorthand) {
        return shorthand||self.config.shorthandCurrentMonth ? self.l10n.months.shorthand[date] : self.l10n.months.longhand[date];
    };


    isDisabled = function(check_date){

        check_date = uDate(check_date, true);

        let d, from_d, to_d;

        for (let i = 0; i < self.config.disable.length; i++){

            d = self.config.disable[i];

            if (d instanceof Date || typeof d === 'string')
                return equalDates(uDate(d,true), check_date, true);

            from_d = uDate(d.from);
            to_d = uDate(d.to);

            if ( equalDates(from_d,check_date, true) || equalDates(to_d, check_date, true) || (check_date > from_d && check_date < to_d ))
                return true;
        }

        return false;

    };

    yearScroll = event => {
        event.preventDefault();
        let delta = Math.max(-1, Math.min(1, (event.wheelDelta || -event.deltaY )));
        self.currentYear = event.target.innerHTML = parseInt(event.target.innerHTML,10) + delta;
        self.redraw();

    };

    timeWrapper = function (e){
        e.preventDefault();

        let min = parseInt(e.target.min), max = parseInt(e.target.max),
            step = parseInt(e.target.step),
            delta = step * ( Math.max(-1, Math.min(1, (e.wheelDelta || -e.deltaY ))) ),
            newValue = ( parseInt(e.target.value) + delta )%(max+(min===0));

        if (newValue < min)
            newValue = max + (min === 0) - step*(min === 0);

        e.target.value = pad( newValue );

    };


    updateNavigationCurrentMonth = function () {

        cur_month.innerHTML = monthToStr(self.currentMonth) +" ";
        cur_year.innerHTML = self.currentYear;

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

    changeMonth = function(offset) {
        self.currentMonth += offset;

        handleYearChange();
        updateNavigationCurrentMonth();
        buildDays();
    };

    calendarClick = function (e) {

        e.preventDefault();

        if ( e.target.classList.contains('slot') )
        {

            self.selectedDateObj = new Date(
                self.currentYear, self.currentMonth, e.target.innerHTML
            );

            updateValue();
            buildDays();

            if ( !self.config.inline && !self.config.enableTime )
                self.close();

        }

    };

    buildCalendar = function () {

        if ( !self.config.noCalendar) {
            buildMonthNavigation();
            buildWeekdays();
            buildDays();
            calendarContainer.appendChild(calendar);
        }

        wrapperElement.appendChild(calendarContainer);

        if(self.config.enableTime)
            buildTime();

    };

    buildMonthNavigation = function () {

        monthsNav.className = 'flatpickr-month';

        prevMonthNav.className = "flatpickr-prev-month";
        prevMonthNav.innerHTML = self.config.prevArrow;

        nextMonthNav.className = "flatpickr-next-month";
        nextMonthNav.innerHTML = self.config.nextArrow;

        cur_month.className = "cur_month";
        cur_year.className = "cur_year";
        cur_year.title = "Scroll to increment";

        navigationCurrentMonth.appendChild(cur_month);
        navigationCurrentMonth.appendChild(cur_year);

        monthsNav.appendChild(prevMonthNav);
        monthsNav.appendChild(navigationCurrentMonth);
        monthsNav.appendChild(nextMonthNav);

        updateNavigationCurrentMonth();
        calendarContainer.appendChild(monthsNav);
    };

    buildWeekdays = function () {

        let weekdayContainer = document.createElement('div'),
            firstDayOfWeek = self.l10n.firstDayOfWeek,
            weekdays = self.l10n.weekdays.shorthand.slice();

        weekdayContainer.className = "flatpickr-weekdays";

        if (firstDayOfWeek > 0 && firstDayOfWeek < weekdays.length) {
            weekdays = [].concat(weekdays.splice(firstDayOfWeek, weekdays.length), weekdays.splice(0, firstDayOfWeek));
        }

        weekdayContainer.innerHTML = '<span>' + weekdays.join('</span><span>') + '</span>';

        calendarContainer.appendChild(weekdayContainer);
    };

    buildDays = function () {

        let firstOfMonth = ( new Date(self.currentYear, self.currentMonth, 1).getDay() - self.l10n.firstDayOfWeek + 7 )%7,
            numDays = getDaysinMonth(),
            prevMonthDays = getDaysinMonth( ( self.currentMonth - 1 + 12)%12 ),
            dayNumber = prevMonthDays + 1 - firstOfMonth,
            className,
            cur_date,
            date_is_disabled,
            date_outside_minmax;

        calendar.innerHTML = '';

        self.config.minDate = uDate(self.config.minDate);
        self.config.maxDate = uDate(self.config.maxDate);

        // prepend days from the ending of previous month
        for( ; dayNumber <= prevMonthDays; dayNumber++ ){
            let d = document.createElement("span");
            d.className="disabled flatpickr-day";
            d.innerHTML=dayNumber;
            calendar.appendChild(d);
        }

        // Start at 1 since there is no 0th day
        for (dayNumber = 1; dayNumber <= 42 - firstOfMonth; dayNumber++) {

            if (dayNumber <= numDays) // avoids new date objects for appended dates
                cur_date = new Date(self.currentYear, self.currentMonth, dayNumber,0,0,0,0);

            date_outside_minmax =
                (self.config.minDate && cur_date < self.config.minDate ) ||
                (self.config.maxDate && cur_date > self.config.maxDate);

            date_is_disabled = dayNumber > numDays || date_outside_minmax || isDisabled( cur_date );

            className = date_is_disabled ? "disabled flatpickr-day" : "slot flatpickr-day";

            if (!date_is_disabled && !self.selectedDateObj && equalDates(cur_date, currentDate) )
                className += ' today';

            if (!date_is_disabled && self.selectedDateObj && equalDates(cur_date, self.selectedDateObj) )
                className += ' selected';

            let cell = document.createElement("span");

            cell.className = className;
            cell.innerHTML = (dayNumber > numDays ? dayNumber % numDays : dayNumber);
            calendar.appendChild(cell);

        }

    };

    buildTime = function(){

        let timeContainer = document.createElement("div"),
            separator = document.createElement("span");

        timeContainer.className = "flatpickr-time";

        hourElement = document.createElement("input");
        minuteElement = document.createElement("input");

        separator.className = "flatpickr-time-separator";
        separator.innerHTML = ":";

        hourElement.type = minuteElement.type = "number";
        hourElement.className = "flatpickr-hour";
        minuteElement.className = "flatpickr-minute";

        hourElement.value =
            self.selectedDateObj ? pad(self.selectedDateObj.getHours()) : 12;
        minuteElement.value =
            self.selectedDateObj ? pad(self.selectedDateObj.getMinutes()) : "00";


        hourElement.step = self.config.hourIncrement;
        minuteElement.step = self.config.minuteIncrement;

        hourElement.min = +!self.config.time_24hr; // 0 in 24hr mode, 1 in 12hr mode
        hourElement.max = self.config.time_24hr ? 23 : 12;

        minuteElement.min = 0;
        minuteElement.max = 59;

        hourElement.title = minuteElement.title = "Scroll to increment";

        timeContainer.appendChild(hourElement);
        timeContainer.appendChild(separator);
        timeContainer.appendChild(minuteElement);

        if (!self.config.time_24hr){ // add am_pm if appropriate
            am_pm = document.createElement("span");
            am_pm.className = "flatpickr-am-pm";
            am_pm.innerHTML = ["AM","PM"][(hourElement.value > 11)|0];
            am_pm.title="Click to toggle";
            timeContainer.appendChild(am_pm);
        }

        // picking time only
        if (self.config.noCalendar && !self.selectedDateObj)
            self.selectedDateObj = new Date();

        calendarContainer.appendChild(timeContainer);

    };

    bind = function () {

        function am_pm_toggle(e){
            e.preventDefault();
            am_pm.innerHTML =  ["AM","PM"][(am_pm.innerHTML === "AM")|0];
        }

        if (String(self.config.clickOpens)==='true'){
            self.input.addEventListener( 'focus' , self.open);

            if(self.altInput)
                self.altInput.addEventListener( 'focus' , self.open);
        }

        if (self.config.wrap && self.element.querySelector("[data-open]"))
            self.element.querySelector("[data-open]").addEventListener( 'click' , self.open);

        if (self.config.wrap && self.element.querySelector("[data-close]"))
            self.element.querySelector("[data-close]").addEventListener( 'click' , self.close);

        if (self.config.wrap && self.element.querySelector("[data-toggle]"))
            self.element.querySelector("[data-toggle]").addEventListener( 'click' , self.toggle);

        if (self.config.wrap && self.element.querySelector("[data-clear]"))
            self.element.querySelector("[data-clear]").addEventListener( 'click' , self.clear);


        prevMonthNav.addEventListener('click', () => { changeMonth(-1); });
        nextMonthNav.addEventListener('click', () => { changeMonth(1); });

        cur_year.addEventListener('wheel', yearScroll);

        calendar.addEventListener('click', calendarClick);
        document.addEventListener('click', documentClick, true);

        if ( self.config.enableTime ){

            hourElement.addEventListener("wheel", timeWrapper);
            minuteElement.addEventListener("wheel", timeWrapper);

            hourElement.addEventListener("mouseout", updateValue);
            minuteElement.addEventListener("mouseout", updateValue);

            hourElement.addEventListener("change", updateValue);
            minuteElement.addEventListener("change", updateValue);

            hourElement.addEventListener("click", () => {hourElement.select();});
            minuteElement.addEventListener("click", () => {minuteElement.select();});

            if (!self.config.time_24hr) {
                am_pm.addEventListener("focus", () =>  am_pm.blur());
                am_pm.addEventListener("click", am_pm_toggle);

                am_pm.addEventListener("wheel", am_pm_toggle);
                am_pm.addEventListener("mouseout", updateValue);
            }

        }
        if(document.createEvent){
            clickEvt = document.createEvent("MouseEvent");
            // without all these args ms edge spergs out
            clickEvt.initMouseEvent("click",true,true,window,0,0,0,0,0,false,false,false,false,0,null);
        }
        else
            clickEvt = new MouseEvent('click', {
                'view': window,
                'bubbles': true,
                'cancelable': true
            });

    };

    self.open = function () {
        if (self.input.disabled || self.config.inline)
            return;

        self.input.blur();
        self.input.classList.add('active');

        if(self.altInput){
            self.altInput.blur();
            self.altInput.classList.add('active');
        }

        self.element.parentNode.classList.add('open');

        if (self.config.onOpen)
            self.config.onOpen();

    };

    self.toggle = function () {
        if (self.input.disabled)
            return;

        self.element.parentNode.classList.toggle('open');

        if(self.altInput)
            self.altInput.classList.toggle('active');

        self.input.classList.toggle('active');
    };

    self.close = function () {
        self.element.parentNode.classList.remove('open');
        self.input.classList.remove('active');
        if (self.altInput)
            self.altInput.classList.remove('active');

        if (self.config.onClose)
            self.config.onClose();
    };

    self.clear = function() {
        self.input.value="";
        self.selectedDateObj = null;
        self.jumpToDate();
    };

    triggerChange = function(){

        self.input.dispatchEvent(clickEvt);
        if (self.config.onChange)
            self.config.onChange(self.selectedDateObj, self.input.value);

    };

    self.destroy = function () {
        let parent = self.element.parentNode,
            element  = parent.removeChild(self.element);

        document.removeEventListener('click', documentClick, false);

        parent.removeChild(calendarContainer);
        parent.parentNode.replaceChild(element, parent);
    };

    self.redraw = function(){

        updateNavigationCurrentMonth();
        buildDays();

    };

    self.jumpToDate = function(jumpDate){
        jumpDate = uDate(
            jumpDate||self.selectedDateObj||self.config.defaultDate||self.config.minDate||currentDate
        );
        self.currentYear = jumpDate.getFullYear();
        self.currentMonth = jumpDate.getMonth();
        self.redraw();

    };

    self.setDate = function(date, triggerChangeEvent){

        self.selectedDateObj = uDate(date);
        self.jumpToDate(self.selectedDateObj);
        updateValue();

        triggerChangeEvent = triggerChangeEvent||false;
        if(triggerChangeEvent)
            triggerChange();

     };

    self.set = function(key, value){

        if (key in self.config) {
            self.config[key] = value;
            self.jumpToDate();
        }

    };

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
            noCalendar: false,
            wrap: false,
            clickOpens: true,
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
            time_24hr: false,
            hourIncrement: 1,
            minuteIncrement: 5,
            onChange: null, //function( dateObj, dateStr ){}
            onOpen: null,
            onClose: null // function() {}
    }
};

Date.prototype.fp_incr = function(days){
    return new Date(
        this.getFullYear(),
        this.getMonth(),
        this.getDate() + parseInt(days, 10)
    );
};

// classList polyfill
if (!("classList" in document.documentElement) && Object.defineProperty && typeof HTMLElement !== 'undefined') {
    Object.defineProperty(HTMLElement.prototype, 'classList', {
        get: function() {
            var self = this;
            function update(fn) {
                return function(value) {
                    var classes = self.className.split(/\s+/),
                        index = classes.indexOf(value);

                    fn(classes, index, value);
                    self.className = classes.join(" ");
                };
            }

            var ret = {
                add: update(function(classes, index, value) {
                    ~index || classes.push(value);
                }),
                remove: update(function(classes, index) {
                    ~index && classes.splice(index, 1);
                }),
                toggle: update(function(classes, index, value) {
                    ~index ? classes.splice(index, 1) : classes.push(value);
                }),
                contains: function(value) {
                    return !!~self.className.split(/\s+/).indexOf(value);
                }
            };

            return ret;
        }
    });
}

if (typeof module !=='undefined')
    module.exports = flatpickr;
