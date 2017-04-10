flatpickr(".flatpickr");

const examples = document.querySelectorAll(".flatpickr");

const configs = {
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
        maxDate: new Date().fp_incr(14)
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
        disable: [
            function(date) {
                // return true to disable

                return (date.getMonth() % 2 === 0 && date.getDate() < 15);

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
        "plugins": [new confirmDatePlugin({})]
    },
    weekSelect: {
        "plugins": [new weekSelectPlugin({})],
        "onChange": [function(){
            // extract the week number
            // note: "this" is bound to the flatpickr instance
            const weekNumber = this.selectedDates[0]
                ? this.config.getWeek(this.selectedDates[0])
                : null;

            console.log(weekNumber);
        }]
    }
}

for (var i = 0; i < examples.length; i++) {
    new Flatpickr(examples[i], configs[examples[i].dataset.id] || {});
}

