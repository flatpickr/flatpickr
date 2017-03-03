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
    }
}

for (let i = 0; i < examples.length; i++) {
    new Flatpickr(examples[i], configs[examples[i].dataset.id] || {});
}

