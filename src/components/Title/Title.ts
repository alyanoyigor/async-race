import { createHTMLElement } from 'utils';

export class Title {
  text: string;
  carsCount: number;
  classNameCarsCount: string[];

  constructor(text: string, carsCount: number, classOfCarsCount: string[]) {
    this.text = text;
    this.carsCount = carsCount;
    this.classNameCarsCount = classOfCarsCount;
  }

  render() {
    const title = createHTMLElement('h1', ['title']);
    title.textContent = this.text;
    const carsCount = createHTMLElement('span', [...this.classNameCarsCount]);
    carsCount.textContent = `(${this.carsCount})`;
    title.append(carsCount);
    return title;
  }
}
