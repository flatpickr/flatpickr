import { Instance } from "../types/instance";
import {
  compareDates,
  compareTimes,
  createDateFormatter,
} from "../utils/dates";

import { Plugin } from "../types/options";

export interface MinMaxTime {
  minTime?: string;
  maxTime?: string;
}

export interface Config {
  table?: Record<string, MinMaxTime>;
  getTimeLimits?: (date: Date) => MinMaxTime;
  tableDateFormat?: string;
}

export interface State {
  formatDate: (date: Date, f: string) => string;
  tableDateFormat: string;
  defaults: MinMaxTime;
}

function minMaxTimePlugin(config: Config = {}): Plugin {
  const state: State = {
    formatDate: createDateFormatter({}),
    tableDateFormat: config.tableDateFormat || "Y-m-d",
    defaults: {
      minTime: undefined,
      maxTime: undefined,
    },
  };

  function findDateTimeLimit(date: Date): MinMaxTime | undefined {
    if (config.table !== undefined) {
      return config.table[state.formatDate(date, state.tableDateFormat)];
    }

    return config.getTimeLimits && config.getTimeLimits(date);
  }

  return function(fp) {
    return {
      onReady(this: Instance) {
        state.formatDate = this.formatDate;
        state.defaults = {
          minTime:
            this.config.minTime && state.formatDate(this.config.minTime, "H:i"),
          maxTime:
            this.config.maxTime && state.formatDate(this.config.maxTime, "H:i"),
        };
      },

      onChange(this: Instance) {
        const latest = this.latestSelectedDateObj;
        const matchingTimeLimit = latest && findDateTimeLimit(latest);

        if (latest && matchingTimeLimit !== undefined) {
          this.set(matchingTimeLimit);

          (fp.config.minTime as Date).setFullYear(latest.getFullYear());
          (fp.config.maxTime as Date).setFullYear(latest.getFullYear());
          (fp.config.minTime as Date).setMonth(latest.getMonth());
          (fp.config.maxTime as Date).setMonth(latest.getMonth());
          (fp.config.minTime as Date).setDate(latest.getDate());
          (fp.config.maxTime as Date).setDate(latest.getDate());

          if (compareDates(latest, fp.config.maxTime as Date, false) > 0) {
            fp.setDate(
              new Date(latest.getTime()).setHours(
                (fp.config.maxTime as Date).getHours(),
                (fp.config.maxTime as Date).getMinutes(),
                0,
                0
              ),
              false
            );
          } else if (compareDates(latest, fp.config.minTime as Date, false) < 0)
            fp.setDate(
              new Date(latest.getTime()).setHours(
                (fp.config.minTime as Date).getHours(),
                (fp.config.minTime as Date).getMinutes(),
                0,
                0
              ),
              false
            );
        } else {
          const newMinMax = state.defaults || {
            minTime: undefined,
            maxTime: undefined,
          };

          this.set(newMinMax);

          if (!latest) return;

          const { minTime, maxTime } = fp.config;

          if (minTime && compareTimes(latest, minTime) < 0) {
            fp.setDate(
              new Date(latest.getTime()).setHours(
                minTime.getHours(),
                minTime.getMinutes(),
                minTime.getSeconds()
              ),
              false
            );
          } else if (maxTime && compareTimes(latest, maxTime) > 0) {
            fp.setDate(
              new Date(latest.getTime()).setHours(
                maxTime.getHours(),
                maxTime.getMinutes(),
                maxTime.getSeconds()
              )
            );
          }
          //
        }
      },
    };
  };
}

export default minMaxTimePlugin;
