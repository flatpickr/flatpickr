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
