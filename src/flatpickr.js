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

    var self = this,
        calendarContainer = document.createElement('div'),
        navigationCurrentMonth = document.createElement('span'),
        calendar = document.createElement('table'),
        calendarBody = document.createElement('tbody'),
        wrapperElement,
        wrap,
        utcDate,
        currentDate,
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
        getDaysinMonth,
        jumpToDate;

    calendarContainer.className = 'flatpickr-calendar';
    navigationCurrentMonth.className = 'flatpickr-current-month';
    instanceConfig = instanceConfig || {};

    utcDate = function(date){

    	if (typeof date === 'undefined') // no args = use today's date
        	date = new Date();

    	else if (typeof date === 'string')
            // dashes to slashes keep firefox happy
            date = new Date(date.replace(/-/g, "/")); 

    	date.setHours(0,0,0,0);

    	return date;
    }

    wrap = function () {
        wrapperElement = document.createElement('div');
        wrapperElement.className = 'flatpickr-wrapper';

        String(self.config.inline) == 'true' &&
            wrapperElement.classList.add('inline');

        self.element.parentNode.insertBefore(wrapperElement, self.element);
        wrapperElement.appendChild(self.element);
    };



    getDaysinMonth = function(givenMonth){

        var yr = self.currentYear,
        	month = (typeof givenMonth === 'undefined') ? self.currentMonth : givenMonth;

        if (month === 1 && ( !( (yr % 4) || (!(yr % 100) && (yr % 400))) ) )
            return 29;

        return self.l10n.daysInMonth[month];
    }

    formatDate = function (dateFormat, dateObj) {
        var formattedDate = '',
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
            if ( date >= utcDate( self.config.disable[i]['from'] ) 
            	 && date <= utcDate( self.config.disable[i]['to'] ) )
                	return true;        

        return false;

    };

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

        	
            dayNumber <= numDays && 
                (cur_date = utcDate( new Date(self.currentYear, self.currentMonth, dayNumber) ) );            


            // we have reached the end of a week, wrap to the next line
            if ( (dayNumber + firstOfMonth - 1) % 7 === 0) {

                calendarFragment.appendChild(row);
                row = document.createElement('tr');

            }


            date_is_disabled = dayNumber > numDays || (self.config.disable && isDisabled( cur_date  ) );


            date_outside_minmax =
            	(self.config.minDate && cur_date < self.config.minDate )
            	||	(self.config.maxDate && cur_date > self.config.maxDate);


            className = (date_is_disabled || date_outside_minmax) ? "disabled" : "slot";


            if (!self.selectedDateObj && cur_date.valueOf() === currentDate.valueOf() )
            	className += ' today';

            if (self.selectedDateObj && cur_date.valueOf() === self.selectedDateObj.valueOf() )
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

        var months = document.createElement('div'),
            prevMonth = document.createElement('span'),
            nextMonth = document.createElement('span');

        months.className = 'flatpickr-months';

        prevMonth.className = "flatpickr-prev-month";
        prevMonth.innerHTML = self.config.prevArrow;

        nextMonth.className = "flatpickr-next-month";
        nextMonth.innerHTML = self.config.nextArrow;


        months.appendChild(prevMonth);
        months.appendChild(navigationCurrentMonth);
        months.appendChild(nextMonth);

        updateNavigationCurrentMonth();
        calendarContainer.appendChild(months);
    };

    handleYearChange = function () {
    	
        if (self.currentMonth < 0 || self.currentMonth > 11) {

            self.currentYear += self.currentMonth % 11;
            self.currentMonth = (self.currentMonth + 12) % 12;
            
        }

        
    };

    documentClick = function (event) {

        if (!wrapperElement.contains(event.target))
            close();

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

            var selDate = parseInt( targetDate.childNodes[0].innerHTML || targetDate.innerHTML, 10);

            self.selectedDateObj = utcDate( new Date( self.currentYear, self.currentMonth, selDate) );


            if (self.config.altInput)
                document.querySelector(self.config.altInput).value =
                	formatDate(self.config.altFormat || self.config.dateFormat, self.selectedDateObj);


            self.element.value = formatDate(self.config.dateFormat, self.selectedDateObj);

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

    	if (String(self.config.inline) != 'true') {

    	  	var openEvent = (self.element.nodeName === 'INPUT') ? 'focus'  : 'click';
        	self.element.addEventListener(openEvent, open, false);

    	}

        wrapperElement.querySelector(".flatpickr-prev-month").addEventListener('click', function(){ changeMonth(-1) });
        wrapperElement.querySelector(".flatpickr-next-month").addEventListener('click', function(){ changeMonth(1) });

        calendar.addEventListener('click', calendarClick);
        document.addEventListener('click', documentClick, false);

    };

    open = function () {

        self.element.blur();        
        wrapperElement.classList.add('open');
    };

    close = function () {

    	if (!self.config.inline)
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
        self.element.removeEventListener('click', open, false);

        parent = self.element.parentNode;
        parent.removeChild(calendarContainer);
        element = parent.removeChild(self.element);
        parent.parentNode.replaceChild(element, parent);
    };

    jumpToDate = function(jumpDate) {
    	
    	self.currentYear = jumpDate.getFullYear();
        self.currentMonth = jumpDate.getMonth();

    };

    init = function () {

        var config, parsedDate;

    	self.config = {};
        self.element = element;
        self.destroy = destroy;

    	currentDate = utcDate();


        for (config in self.defaultConfig)
            self.config[config] =
                instanceConfig[config] ||
                self.element.dataset[config.toLowerCase()] ||
                self.defaultConfig[config];

        // firefox doesn't like dashes
        self.config.defaultDate &&
            ( self.config.defaultDate = utcDate(self.config.defaultDate) );


        if ( self.element.value || (!self.element.value && self.config.defaultDate ) ){
            self.selectedDateObj = utcDate(self.config.defaultDate||self.element.value);
        }

        self.config.minDate &&
            (self.config.minDate = utcDate(self.config.minDate) );

        self.config.maxDate &&
            (self.config.maxDate = utcDate(self.config.maxDate) );


        jumpToDate(self.selectedDateObj||self.config.minDate||currentDate);


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
            defaultDate: null,
            minDate: null,
            maxDate: null,
            disable: null,
            shorthandCurrentMonth: false,
            inline: false,
            prevArrow: '&lt;',
            nextArrow: '&gt;'
    }
};


if (typeof module != 'undefined')
	module.exports = flatpickr;
