function monthSelectPlugin(pluginConfig) {
    return function (fp) {
        var days = void 0;

        function onDayHover(event) {
            if (!event.target.classList.contains("flatpickr-day")) return;

            dayIndex = Array.prototype.indexOf.call(days, event.target);
            fp.monthStartDay = new Date(days[dayIndex].dateObj.getFullYear(), days[dayIndex].dateObj.getMonth(), 1, 0,0,0,0).getTime();
            fp.monthEndDay = new Date(days[dayIndex].dateObj.getFullYear(), days[dayIndex].dateObj.getMonth() + 1, 0,0,0,0,0).getTime();
            //console.log(days[dayIndex].dateObj.toString());
            for (var i = days.length; i--;) {
                var date = days[i].dateObj.getTime();
                if (date > fp.monthEndDay || date < fp.monthStartDay ) days[i].classList.remove("inRange");else days[i].classList.add("inRange");
                if (date != fp.monthEndDay) days[i].classList.remove("endRange");else days[i].classList.add("endRange");
                if (date != fp.monthStartDay) days[i].classList.remove("startRange");else days[i].classList.add("startRange");
            }
        }

        function highlightMonth() {
            for (var i = days.length; i--;) {
                var date = days[i].dateObj.getTime();
                if (date >= fp.monthStartDay && date <= fp.monthEndDay) days[i].classList.add("month", "selected");
                if (date != fp.monthEndDay) days[i].classList.remove("endRange");else days[i].classList.add("endRange");
                if (date != fp.monthStartDay) days[i].classList.remove("startRange");else days[i].classList.add("startRange");
            }
        }

        function clearHover() {
            for (var i = days.length; i--;) {
                days[i].classList.remove("inRange");
            }
        }

        function formatDate(format, date) {
                format = "F, Y";
        		var chars = format.split("");
        		return chars.map(function (c, i) {
        			return fp.formats[c] && chars[i - 1] !== "\\" ? fp.formats[c](date) : c !== "\\" ? c : "";
        		}).join("");
            //return "Month " + date.getMonth(date) + ", " + date.getFullYear();
        }

        return {
            formatDate: formatDate,
            onChange: highlightMonth,
            onMonthChange: highlightMonth,
            onClose: clearHover,
            onParseConfig: function onParseConfig() {
                fp.config.mode = "single";
                fp.config.enableTime = false;
            },
            onReady: [function () {
                days = fp.days.childNodes;
            }, function () {
                return fp.days.addEventListener("mouseover", onDayHover);
            }, highlightMonth]
        };
    };
}

if (typeof module !== "undefined") module.exports = monthSelectPlugin;