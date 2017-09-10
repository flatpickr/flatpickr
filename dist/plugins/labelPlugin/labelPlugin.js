"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function labelPlugin() {
    return function (fp) {
        return {
            onReady: function () {
                var id = fp.input.id;
                if (fp.altInput && id) {
                    fp.input.removeAttribute("id");
                    fp.altInput.id = id;
                }
            },
        };
    };
}
exports.default = labelPlugin;
