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
}

for (let i = 0; i < examples.length; i++) {
    new Flatpickr(examples[i], configs[examples[i].dataset.id] || {});
}

