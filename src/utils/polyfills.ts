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

if (typeof window.requestAnimationFrame !== "function") {
  const vendors = ["ms", "moz", "webkit", "o"];
  for (
    let x = 0, length = vendors.length;
    x < length && !window.requestAnimationFrame;
    ++x
  ) {
    window.requestAnimationFrame = (<any>window)[
      vendors[x] + "RequestAnimationFrame"
    ];
  }
  if (typeof window.requestAnimationFrame !== "function") {
    window.requestAnimationFrame = function(cb) {
      return setTimeout(cb, 16);
    };
  }
}
