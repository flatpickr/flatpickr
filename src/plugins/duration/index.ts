import { Instance, Formatting } from "../../types/instance";
import { Plugin } from "../../types/options";
import { pad } from "../../utils";

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
    timeFormat: "H:I",
    altTimeFormat: "H:I",
    maxHours: 99,
    minHours: 0,
};

function duration(pluginConfig?: Partial<DurationConfig>): Plugin {
    const config = { ...defaultDurationConfig, ...pluginConfig };
    let latestSelectedTime: Time;
    
    return (parent: Instance) => {
        if (!parent.config.time_24hr){
          console.warn('Duration plugin will not work without time_24hr set to true');
          return {};
        }

        parent.config.dateFormat = config.timeFormat;
        parent.config.altFormat = config.altTimeFormat;
        parent.config.defaultHour = config.defaultHour;
        parent.config.defaultMinute = config.defaultMinute;
        parent.config.defaultSeconds = config.defaultSeconds;

        let timeFormats: TimeFormats = {
            // hours with leading zero e.g. 03
            H: (time: Time) => pad(time.hours),
            // seconds 00-59
            S: (time: Time) => pad(time.seconds),
            // minutes, padded with leading zero e.g. 09
            I: (time: Time) => pad(time.minutes),
            // hours 0-59
            h: (time: Time) => time.hours,
            // minutes 0-59
            i: (time: Time) => time.minutes,
            // seconds 0-59
            s: (time: Time) => time.seconds,
          };

        function formatTime (format: string): string {
            return format
                .split("")
                .map((c, i, arr) =>
                timeFormats[c as timeToken] && arr[i - 1] !== "\\"
                    ? timeFormats[c as timeToken](latestSelectedTime)
                    : c !== "\\"
                    ? c
                    : ""
                )
                .join("");
        };

        function setup() {
          parent._duration = true;
          if (!parent.hourElement || !parent.minuteElement) {
            console.warn('No hour/minute elements found; plugin will not work');
            return;
          }
          parent.hourElement.setAttribute("max", config.maxHours.toString());
          parent.hourElement.setAttribute("min", config.minHours.toString()); 
          
        }

        function setupInitialTime() {
          latestSelectedTime = {
            hours: parent.config.defaultHour,
            minutes: parent.config.defaultMinute,
            seconds: parent.config.defaultSeconds,
          } as Time;
        }

        function valueUpdated() {
          latestSelectedTime.hours = parent.hourElement ? parseInt(parent.hourElement.value) : config.defaultHour
          latestSelectedTime.minutes = parent.minuteElement ? parseInt(parent.minuteElement.value) : config.defaultMinute
          latestSelectedTime.seconds = parent.secondElement ? parseInt(parent.secondElement.value) : config.defaultSeconds

          parent.input.value = formatTime(parent.config.dateFormat);

          if (parent.altInput !== undefined) {
            parent.altInput.value = formatTime(parent.config.altFormat);
          }
        }

        return {
            onParseConfig() {
              parent.config.mode = "single";
              parent.config.enableTime = true;
              parent.config.noCalendar = true;
            },
            onValueUpdate: valueUpdated,
            onReady: [
                setup,
                setupInitialTime,
                () => {
                    parent.loadedPlugins.push("duration");
                },
            ]
          };
    };
}  

export default duration;