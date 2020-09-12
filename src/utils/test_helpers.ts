let simulate = (
  eventType: string,
  onElement: Node,
  options?: object,
  type?: any
)  => {
  const eventOptions = Object.assign(options || {}, { bubbles: true });
  const evt = new (type || CustomEvent)(eventType, eventOptions);
  try {
    Object.assign(evt, eventOptions);
  } catch (e) {}

  onElement.dispatchEvent(evt);
};

// simulate click
let clickOn = (element: Node) => {
  simulate("click", element, { which: 1 }, CustomEvent);
};

export {clickOn, simulate}