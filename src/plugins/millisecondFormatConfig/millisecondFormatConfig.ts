import { FlatpickrFn } from "../../types/instance";

function millisecondFormatConfig(flatpickrFn: FlatpickrFn): void {

  const fpGlobalConfig = flatpickrFn.getGlobalConfig();

  // WARNING: As configs are only ever shallow copied, changes to existing config
  // child objects would affect:
  //          the global config,
  //          the config in new flatpickr instances,
  //          AND alarmingly existing flatpickr instances.
  // So don't do this:
  //   fpGlobalConfig.formatFns!["v"] = (date: Date) => date.getMilliseconds();
  // use flatpickrFn.setDefaults instead.

  flatpickrFn.setDefaults({
    formatFns: {
      ...fpGlobalConfig.formatFns,
      // milliseconds 000-999
      v: (date: Date) => ("00" + date.getMilliseconds()).slice(-3),
    },
    parseTokenRegexs: {
      ...fpGlobalConfig.parseTokenRegexs,
      v: "(\\d\\d|\\d)",
    },
    parseTokenFns: {
      ...fpGlobalConfig.parseTokenFns,
      v: (
        dateObj: Date,
        milliseconds: string
      ) => {
        dateObj.setMilliseconds(parseFloat(milliseconds));
      }
    }
  });
}

export default millisecondFormatConfig;
