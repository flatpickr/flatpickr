flatpickr.defaultConfig.animate = window.navigator.userAgent.indexOf('MSIE') === -1;
flatpickr(".flatpickr");

var examples = document.querySelectorAll(".flatpickr");

var configs = {
    datetime: {
        enableTime: true,
        dateFormat: "Y-m-d H:i",
    },

    altinput: {
        altInput: true,
        altFormat: "F j, Y",
        dateFormat: "Y-m-d"
    },

    "minDate": {
        minDate: "2020-01"
    },

    "minDateToday": {
        minDate: "today"
    },

     "maxDateStr": {
        dateFormat: "d.m.Y",
        maxDate: "15.12.2017"
    },

    minMaxDateTwoWeeks: {
        minDate: "today",
        maxDate: new Date().setDate(new Date().getDate() + 14)
    },

    disableSpecific: {
        onReady () {
            this.jumpToDate("2025-01")
        },
        disable: ["2025-01-30", "2025-02-21", "2025-03-08", new Date(2025, 4, 9) ]
    },

    disableRange: {
        onReady () {
            this.jumpToDate("2025-04")
        },
        disable: [
            {
                from: "2025-04-01",
                to: "2025-05-01"
            },
            {
                from: "2025-09-01",
                to: "2025-12-01"
            }
        ]
    },

    disableFunction: {
        locale: {
            firstDayOfWeek: 1
        },
        disable: [
            function(date) {
                // return true to disable

                return (date.getDay() === 0 || date.getDay() === 6);

            }
        ]
    },

    enableSpecific: {
        onReady: function () {
            this.jumpToDate("2025-03")
        },
        enable: ["2025-03-30", "2025-05-21", "2025-06-08", new Date(2025, 8, 9) ]
    },

    enableRange: {
        onReady: function () {
            this.jumpToDate("2025-04")
        },
        enable: [
            {
                from: "2025-04-01",
                to: "2025-05-01"
            },
            {
                from: "2025-09-01",
                to: "2025-12-01"
            }
        ]
    },

    enableFunction: {
        enable: [
            function(date) {
                // return true to enable

                return (date.getMonth() % 2 === 0 && date.getDate() < 15);

            }
        ]
    },

    multiple: {
        mode: "multiple",
        dateFormat: "Y-m-d",
    },

    multipleCustomConjunction: {
        mode: "multiple",
        dateFormat: "Y-m-d",
        conjunction: " :: "
    },

    multiplePreload: {
        mode: "multiple",
        dateFormat: "Y-m-d",
        defaultDate: ["2016-10-20", "2016-11-04"]
    },

    range: {
        mode: "range"
    },

    rangeDisable:{
        mode: "range",
        minDate: "today",
        dateFormat: "Y-m-d",
        disable: [
            function(date) {
                // disable every multiple of 8
                return !(date.getDate() % 8);
            }
        ]
    },

    rangePreload: {
        mode: "range",
        dateFormat: "Y-m-d",
        defaultDate: ["2016-10-10", "2016-10-20"],
    },

    timePicker: {
        enableTime: true,
        noCalendar: true,
    },

    timePickerMinMaxHours: {
        enableTime: true,
        noCalendar: true,
        dateFormat: "H:i",
        minDate: "16:00",
        maxDate: "22:30",
    },

    "timePicker24": {
        enableTime: true,
        noCalendar: true,
        time_24hr: true,
    },

    "timePickerPreloading": {
        enableTime: true,
        noCalendar: true,
        dateFormat: "H:i",
        defaultDate: "13:45"
    },

    minTime: {
        enableTime: true,
        minTime: "09:00"
    },

    minMaxTime: {
        enableTime: true,
        minTime: "16:00",
        maxTime: "22:00"
    },

    inline: {
        inline: true
    },
    weekNumbers: {
        weekNumbers: true,

    },

    strap: {
        wrap: true
    },

    onDayCreate: {
        onDayCreate: function(dObj, dStr, fp, dayElem){
            // Utilize dayElem.dateObj, which is the corresponding Date

            // dummy logic
            if (Math.random() < 0.15)
                dayElem.innerHTML += "<span class='event'></span>";

            else if (Math.random() > 0.85)
                dayElem.innerHTML += "<span class='event busy'></span>";
        }
    },

    confirmDate: {
        "enableTime": true,
        "plugins": [new confirmDatePlugin({})]
    },
    weekSelect: {
        "plugins": [new weekSelect({})],
        "onChange": [function(){
            // extract the week number
            // note: "this" is bound to the flatpickr instance
            var weekNumber = this.selectedDates[0]
                ? this.config.getWeek(this.selectedDates[0])
                : null;

            console.log(weekNumber);
        }]
    },
    rangePlugin: {
        "plugins": [new rangePlugin({ input: "#secondRangeInput"})]
    },

    minMaxTimePlugin: {
        enableTime: true,
        minDate: "2025",
        plugins: [
            new minMaxTimePlugin({
                table: {
                    "2025-01-10": {
                        minTime: "16:00",
                        maxTime: "22:00"
                    }
                }
            })
        ]
    }
}

for (var i = 0; i < examples.length; i++) {
    flatpickr(examples[i], configs[examples[i].getAttribute("data-id")] || {});
}

