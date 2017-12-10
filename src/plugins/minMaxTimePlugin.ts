import { Instance } from "../types/instance";
import { compareDates, createDateFormatter } from "../utils/dates";

interface MinMaxTime {
  minTime?: string;
  maxTime?: string;
}

interface Config {
  table?: Record<string, MinMaxTime>;
  getTimeLimits?: (date: Date) => MinMaxTime;
  tableDateFormat?: string;
  defaults?: MinMaxTime;
}

interface State {
  formatDate: (date: Date, f: string) => string;
  tableDateFormat: string;
}

function minMaxTimePlugin(config: Config) {
  const state: State = {
    formatDate: createDateFormatter({}),
    tableDateFormat: config.tableDateFormat || "Y-m-d",
  };

  function findDateTimeLimit(date: Date): MinMaxTime | undefined {
    if (config.table !== undefined) {
      return config.table[state.formatDate(date, state.tableDateFormat)];
    }

    return config.getTimeLimits && config.getTimeLimits(date);
  }

  return function(fp: Instance) {
    return {
      onReady(this: Instance) {
        state.formatDate = this.formatDate;
      },

      onChange(this: Instance) {
        const latest = this.latestSelectedDateObj;
        const matchingTimeLimit = latest && findDateTimeLimit(latest);

        if (latest && matchingTimeLimit !== undefined) {
          this.set(matchingTimeLimit);
          (fp.config.minTime as Date).setMonth(latest.getMonth());
          (fp.config.maxTime as Date).setMonth(latest.getMonth());
          (fp.config.minTime as Date).setDate(latest.getDate());
          (fp.config.maxTime as Date).setDate(latest.getDate());

          if (compareDates(latest, fp.config.maxTime as Date, false) > 0)
            fp.setDate(
              new Date(latest.getTime()).setHours(
                (fp.config.maxTime as Date).getHours(),
                (fp.config.maxTime as Date).getMinutes(),
                0,
                0
              ),
              false
            );
          else if (compareDates(latest, fp.config.minTime as Date, false) < 0)
            fp.setDate(
              new Date(latest.getTime()).setHours(
                (fp.config.minTime as Date).getHours(),
                (fp.config.minTime as Date).getMinutes(),
                0,
                0
              ),
              false
            );
        } else
          this.set(
            config.defaults || {
              minTime: undefined,
              maxTime: undefined,
            }
          );
      },
    };
  };
}

export default minMaxTimePlugin;
