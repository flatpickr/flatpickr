/* flatpickr v4.2.3, @license MIT */
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.confirmDatePlugin = factory());
}(this, (function () { 'use strict';

/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */
/* global Reflect, Promise */



var __assign = Object.assign || function __assign(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
    }
    return t;
};

var defaultConfig = {
    confirmIcon: "<svg version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' width='17' height='17' viewBox='0 0 17 17'> <g> </g> <path d='M15.418 1.774l-8.833 13.485-4.918-4.386 0.666-0.746 4.051 3.614 8.198-12.515 0.836 0.548z' fill='#000000' /> </svg>",
    confirmText: "OK ",
    showAlways: false,
    theme: "light",
};
function confirmDatePlugin(pluginConfig) {
    var config = __assign({}, defaultConfig, pluginConfig);
    var confirmContainer;
    return function (fp) {
        var hooks = __assign({ onKeyDown: function (_, __, ___, e) {
                if (fp.config.enableTime && e.key === "Tab" && e.target === fp.amPM) {
                    e.preventDefault();
                    confirmContainer.focus();
                }
                else if (e.key === "Enter" && e.target === confirmContainer)
                    fp.close();
            },
            onReady: function () {
                if (fp.calendarContainer === undefined)
                    return;
                confirmContainer = fp._createElement("div", "flatpickr-confirm " + (config.showAlways ? "visible" : "") + " " + config.theme + "Theme", config.confirmText);
                confirmContainer.tabIndex = -1;
                confirmContainer.innerHTML += config.confirmIcon;
                confirmContainer.addEventListener("click", fp.close);
                fp.calendarContainer.appendChild(confirmContainer);
            } }, !config.showAlways
            ? {
                onChange: function (_, dateStr) {
                    var showCondition = fp.config.enableTime || fp.config.mode === "multiple";
                    if (dateStr && !fp.config.inline && showCondition)
                        return confirmContainer.classList.add("visible");
                    confirmContainer.classList.remove("visible");
                },
            }
            : {});
        return hooks;
    };
}

return confirmDatePlugin;

})));
