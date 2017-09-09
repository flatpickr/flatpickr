export function toggleClass(
  elem: HTMLElement,
  className: string,
  bool: boolean
) {
  if (bool === true) return elem.classList.add(className);
  elem.classList.remove(className);
}

export function createElement<T extends HTMLElement>(
  tag: keyof HTMLElementTagNameMap,
  className: string,
  content?: string
): T {
  const e = window.document.createElement(tag) as T;
  className = className || "";
  content = content || "";

  e.className = className;

  if (content !== undefined) e.textContent = content;

  return e;
}

export function clearNode(node: HTMLElement) {
  while (node.firstChild) node.removeChild(node.firstChild);
}

export function findParent(
  node: Node,
  condition: (n: Node) => boolean
): Node | undefined {
  if (condition(node)) return node;
  else if (node.parentNode) return findParent(node.parentNode, condition);

  return undefined; // nothing found
}

export function createNumberInput(inputClassName: string) {
  const wrapper = createElement<HTMLDivElement>("div", "numInputWrapper"),
    numInput = createElement<HTMLInputElement>(
      "input",
      "numInput " + inputClassName
    ),
    arrowUp = createElement<HTMLSpanElement>("span", "arrowUp"),
    arrowDown = createElement<HTMLSpanElement>("span", "arrowDown");

  numInput.type = "text";
  numInput.pattern = "\\d*";

  wrapper.appendChild(numInput);
  wrapper.appendChild(arrowUp);
  wrapper.appendChild(arrowDown);

  return wrapper;
}
