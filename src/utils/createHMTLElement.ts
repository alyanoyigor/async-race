export const createHTMLElement = (selector: string, classNames: string[]) => {
  const elem = document.createElement(selector);
  elem.classList.add(...classNames);
  return elem;
};