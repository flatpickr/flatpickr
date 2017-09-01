export function toggleClass(elem: HTMLElement, className: string, bool: boolean) {
  if (bool === true)
    return elem.classList.add(className);
  elem.classList.remove(className);
}

export function createElement(tag: string, className: string, content?: string) {
  const e = window.document.createElement(tag);
  className = className || "";
  content = content || "";

  e.className = className;

  if (content !== undefined)
    e.textContent = content;

  return e;
}

export function clearNode(node: HTMLElement) {
  while (node.firstChild)
    node.removeChild(node.firstChild);
}

export function createNumberInput(inputClassName: string) {
  const wrapper = createElement("div", "numInputWrapper"),
    numInput = createElement("input", "numInput " + inputClassName),
    arrowUp = createElement("span", "arrowUp"),
    arrowDown = createElement("span", "arrowDown");

  numInput.type = "text";
  numInput.pattern = "\\d*";

  wrapper.appendChild(numInput);
  wrapper.appendChild(arrowUp);
  wrapper.appendChild(arrowDown);

  return wrapper;
}
