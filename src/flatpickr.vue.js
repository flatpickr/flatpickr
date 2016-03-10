// syntax for importing node modules below may differ depending on the tools you use
import Vue from 'vue'
import flatpickr from 'flatpickr'

Vue.directive('datepicker', { // <input type='text' v-datepicker>

    bind: function () {

        var vm = this.vm;
        var key = this.expression;

        var calendar = flatpickr(this.el, {

            onChange: function(dateObj, dateStr) {
                vm.$set(key, dateStr);
            },
            
            enableTime: true,
            minDate:'today',            
            prevArrow: "<i class=fa-angle-left></i>",
            nextArrow: "<i class=fa-angle-right></i>"
        });
        

    }
});
