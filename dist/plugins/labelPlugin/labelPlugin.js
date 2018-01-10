/* flatpickr v4.2.3, @license MIT */
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.labelPlugin = factory());
}(this, (function () { 'use strict';

function labelPlugin() {
    return function (fp) {
        return {
            onReady: function () {
                var id = fp.input.id;
                if (!id) {
                    return;
                }
                if (fp.mobileInput) {
                    fp.input.removeAttribute("id");
                    fp.mobileInput.id = id;
                }
                else if (fp.altInput) {
                    fp.input.removeAttribute("id");
                    fp.altInput.id = id;
                }
            },
        };
    };
}

return labelPlugin;

})));
