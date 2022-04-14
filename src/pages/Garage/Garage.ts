import { Title } from 'components/Title/Title';
import { carsData } from 'data/carsData';
import { createHTMLElement } from 'utils';
import { CarsList } from './components/CarsList/CarsList';
import { GarageToolbar } from './components/GarageToolbar/GarageToolbar';

export class Garage {
  container: HTMLElement;

  constructor() {
    this.container = createHTMLElement('div', ['container']);
    const garageToolbar = new GarageToolbar().render();
    const carList = CarsList.getInstance().render();
    const title = new Title('Garage', carsData.length, ['cars-count']).render();
    this.container.append(title, garageToolbar, carList);
  }

  render() {
    return this.container;
  }
}
