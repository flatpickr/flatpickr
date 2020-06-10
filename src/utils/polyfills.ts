if (typeof Object.assign !== "function") {
  Object.assign = function(
    target: Record<string, any>,
    ...args: Record<string, any>[]
  ) {
    if (!target) {
      throw TypeError("Cannot convert undefined or null to object");
    }
    for (const source of args) {
      if (source) {
        Object.keys(source).forEach(key => (target[key] = source[key]));
      }
    }
    return target;
  };
}

if (typeof window.CustomEvent !== "function") {
  function CustomEvent(typeArg: string, eventInitDict?: CustomEventInit): CustomEvent {
    eventInitDict = eventInitDict || { bubbles: false, cancelable: false, detail: undefined };
    const evt = document.createEvent("CustomEvent");
    evt.initCustomEvent(typeArg, (eventInitDict.bubbles as boolean), (eventInitDict.cancelable as boolean), eventInitDict.detail);
    return evt;
  }

  CustomEvent.prototype = window.Event.prototype;

  window.CustomEvent = <any>CustomEvent;
}
