function weekSelectPlugin(pluginConfig) {
    return function(fp) {
        let days;

        function onDayHover(event){
            if (!event.target.classList.contains("flatpickr-day"))
                return;
                
            dayIndex = Array.prototype.indexOf.call(days, event.target);
            fp.weekStartDay = days[7*Math.floor(dayIndex/7)].dateObj;
            fp.weekEndDay = days[7*Math.ceil(dayIndex/7) - 1].dateObj;
            
            for(let i = days.length; i--;) {
                const date = days[i].dateObj;
                if (date > fp.weekEndDay || date < fp.weekStartDay)
                    days[i].classList.remove("inRange");
                else
                    days[i].classList.add("inRange");
            }
        }

        function highlightWeek(){
            for(let i = days.length; i--;) {
                const date = days[i].dateObj;
                if (date >= fp.weekStartDay && date <= fp.weekEndDay)
                    days[i].classList.add("week", "selected");
            }
        }

        function clearHover() {
            for(let i = days.length; i--;)
                days[i].classList.remove("inRange");
        } 

        function formatDate(format, date) {
            return `Week #${fp.config.getWeek(date)}, ${date.getFullYear()}`;
        }

        return {
            formatDate,
            onChange: highlightWeek,
            onMonthChange: highlightWeek,
            onClose: clearHover,            
            onParseConfig: () => {
                fp.config.mode = "single";
                fp.config.enableTime = false;
            },
            onReady: [
                () => { days = fp.days.childNodes; },
                () => fp.days.addEventListener("mouseover", onDayHover), 
                highlightWeek
            ]
        };
    }
}

if (typeof module !== "undefined")
	module.exports = weekSelectPlugin;
