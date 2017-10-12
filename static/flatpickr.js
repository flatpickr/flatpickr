flatpickr.defaultConfig.animate = window.navigator.userAgent.indexOf('MSIE') === -1;
flatpickr(".flatpickr");

var examples = document.querySelectorAll(".flatpickr");

var configs = {
    datetime: {
        enableTime: true
    },

    altinput: {
        altInput: true
    },

    "minDate2017": {
        minDate: "2017-04"
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
        disable: ["2017-03-30", "2017-05-21", "2017-06-08", new Date(2017, 8, 9) ]
    },

    disableRange: {
        disable: [
            {
                from: "2017-04-01",
                to: "2017-06-01"
            },
            {
                from: "2017-09-01",
                to: "2017-12-01"
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
        enable: ["2017-03-30", "2017-05-21", "2017-06-08", new Date(2017, 8, 9) ]
    },

    enableRange: {
        enable: [
            {
                from: "2017-04-01",
                to: "2017-06-01"
            },
            {
                from: "2017-09-01",
                to: "2017-12-01"
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
        mode: "multiple"
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
        defaultDate: ["2016-10-10", "2016-10-20"]
    },

    timePicker: {
        enableTime: true,
        noCalendar: true
    },

    inline: {
        inline: true
    },
    weekNumbers: {
        weekNumbers: true
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
        "plugins": [new confirmDate({})]
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
    }
}

for (var i = 0; i < examples.length; i++) {
    flatpickr(examples[i], configs[examples[i].dataset.id] || {});
}

