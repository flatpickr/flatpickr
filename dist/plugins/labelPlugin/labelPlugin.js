"use strict";
exports.__esModule = true;
function labelPlugin() {
    return function (fp) {
        return {
            onReady: function () {
                var id = fp.input.id;
                if (fp.altInput && id) {
                    fp.input.removeAttribute("id");
                    fp.altInput.id = id;
                }
            }
        };
    };
}
exports["default"] = labelPlugin;
