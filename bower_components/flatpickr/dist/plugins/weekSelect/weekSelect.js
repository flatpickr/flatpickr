function weekSelectPlugin(pluginConfig) {
    return function (fp) {
        function onDayHover(event) {
            if (!event.target.classList.contains("flatpickr-day")) return;

            var days = event.target.parentNode.childNodes;
            dayIndex = event.target.$i;
            fp.weekStartDay = days[7 * Math.floor(dayIndex / 7)].dateObj;
            fp.weekEndDay = days[7 * Math.ceil(dayIndex / 7) - 1].dateObj;

            for (var i = days.length; i--;) {
                var date = days[i].dateObj;
                if (date > fp.weekEndDay || date < fp.weekStartDay) days[i].classList.remove("inRange");else days[i].classList.add("inRange");
            }
        }

        function highlightWeek() {
            var days = fp.days.childNodes;
            for (var i = days.length; i--;) {
                var date = days[i].dateObj;
                if (date >= fp.weekStartDay && date <= fp.weekEndDay) days[i].classList.add("week", "selected");
            }
        }

        function clearHover() {
            var days = fp.days.childNodes;
            for (var i = days.length; i--;) {
                days[i].classList.remove("inRange");
            }
        }

        function formatDate(date, format) {
            return "Week #" + fp.config.getWeek(date) + ", " + date.getFullYear();
        }

        return {
            formatDate: formatDate,
            onChange: highlightWeek,
            onMonthChange: function onMonthChange() {
                return fp._.afterDayAnim(highlightWeek);
            },
            onClose: clearHover,
            onParseConfig: function onParseConfig() {
                fp.config.mode = "single";
                fp.config.enableTime = false;
            },
            onReady: [function () {
                fp.days.parentNode.addEventListener("mouseover", onDayHover);
            }, highlightWeek]
        };
    };
}

if (typeof module !== "undefined") module.exports = weekSelectPlugin;