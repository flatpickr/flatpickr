import { Instance, Formatting } from "../../types/instance";
import { Plugin } from "../../types/options";

export type timeToken =
  | "H"
  | "S"
  | "I"
  | "h"
  | "i"
  | "s";

export type TimeFormats = Record<
  timeToken,
  (time: Time) => string | number
>;

export interface Time {
    hours: number;
    minutes: number;
    seconds: number;
  };

export interface DurationConfig {
    defaultHour: number;
    defaultMinute: number;
    defaultSeconds: number;
    enableSeconds: boolean;
    timeFormat: string;
    altTimeFormat: string;
    maxHours: number;
    minHours: number;
}

export interface DurationFromatting extends Formatting {
    timeFormats: TimeFormats;
}

const defaultDurationConfig: DurationConfig = {
    defaultHour: 8,
    defaultMinute: 0,
    defaultSeconds: 0,
    enableSeconds: false,
    timeFormat: "H:i",
    altTimeFormat: "H:i",
    maxHours: 99,
    minHours: 0,
};

function duration(pluginConfig?: Partial<DurationConfig>): Plugin {
    const config = { ...defaultDurationConfig, ...pluginConfig };
    let latestSelectedTime: Time;
    
    return (parent: Instance) => {

        parent.config.dateFormat = config.timeFormat;
        parent.config.altFormat = config.altTimeFormat;
        parent.config.defaultHour = config.defaultHour;
        parent.config.defaultMinute = config.defaultMinute;
        parent.config.defaultSeconds = config.defaultSeconds;

        // const timeFormats: TimeFormats = {
        //     // hours with leading zero e.g. 03
        //     H: (time: Time) => parent.pad(time.hours),
          
        //     // seconds 00-59
        //     S: (time: Time) => parent.pad(time.seconds),
            
        //     // minutes, padded with leading zero e.g. 09
        //     I: (time: Time) => parent.pad(time.minutes),
            
        //     // hours 0-59
        //     h: (time: Time) => time.hours,

        //     // minutes 0-59
        //     i: (time: Time) => time.minutes,
          
        //     // seconds 0-59
        //     s: (time: Time) => time.seconds,
        //   };

        // function formatTime (): string {
        //     return parent.config.dateFormat
        //         .split("")
        //         .map((c, i, arr) =>
        //         timeFormats[c as timeToken] && arr[i - 1] !== "\\"
        //             ? timeFormats[c as timeToken](latestSelectedTime)
        //             : c !== "\\"
        //             ? c
        //             : ""
        //         )
        //         .join("");
        // };

        function setup() {
          parent._duration = true;
          if (!parent.hourElement || !parent.minuteElement) {
            console.warn('No hour/minute elements found; plugin will not work');
            return;
          }
          parent.hourElement.setAttribute("max", config.maxHours.toString());
          parent.hourElement.setAttribute("min", config.minHours.toString()); 
          
        }

        function setupHoursForDuration() {
            latestSelectedTime = {
              hours: parent.config.defaultHour,
              minutes: parent.config.defaultMinute,
              seconds: parent.config.defaultSeconds
            } as Time;
        console.log(latestSelectedTime)
            // parent.setHours(
            //   self.latestSelectedTime.hours, 
            //   self.latestSelectedTime.minutes,
            //   self.latestSelectedTime.seconds
            //   );
          }

        function valueUpdated() {
            console.log('value updated ', parent.hourElement?.value)
        }

        return {
            onParseConfig() {
              parent.config.mode = "single";
              parent.config.enableTime = true;
              parent.config.noCalendar = true
              parent.config.time_24hr = true
            },
            onValueUpdate: valueUpdated,
            onReady: [
                setup,
                setupHoursForDuration,
                () => {
                    parent.loadedPlugins.push("duration");
                },
            ]
          };
    };
}  

export default duration;