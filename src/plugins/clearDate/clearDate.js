/**
 * Flatpickr Clear Date Plugin.
 *
 * Adds a Clear button under the calendar which allows the user to clear the selected date.
 *
 * @author Mihai MATEI <mihai.matei@outlook.com>
 * @license MIT
 */

/**
 * Clear date plugin.
 *
 * @param {Object} pluginConfig
 *
 * @returns {Function}
 */
function clearDatePlugin(pluginConfig)
{
    var defaultConfig = {
        clearIcon: '<i class="fa fa-remove clear-icon"></i>',
        clearText: 'Clear',
        triggerChangeEvent: true,
        close: true,
        theme: "light"
    };

    var config = {};
    for (var key in defaultConfig) {
        config[key] = pluginConfig && pluginConfig[key] !== undefined ? pluginConfig[key] : defaultConfig[key];
    }

    return function (fp)
    {
        fp.clearContainer = fp._createElement(
            "div",
            "flatpickr-clear " + config.theme + "Theme",
            config.clearText
        );

        fp.clearContainer.tabIndex = -1;
        fp.clearContainer.innerHTML = config.clearIcon + fp.clearContainer.innerHTML;

        fp.clearContainer.addEventListener("click", function() {

            fp.clear(config.triggerChangeEvent);

            if (config.close) {
                fp.close();
            }
        });

        return {
            onReady: function onReady() {
                fp.calendarContainer.appendChild(fp.clearContainer);
            }
        };
    };
}

if (typeof module !== "undefined")
    module.exports = clearDatePlugin;