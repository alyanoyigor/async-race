import { Winners } from 'pages/Winners/Winners';
import { Garage } from 'pages/Garage/Garage';
export class App {
  garage: Garage;
  winners: Winners;
  main: HTMLElement | null;

  constructor() {
    this.garage = new Garage();
    this.winners = new Winners();

    this.main = document.querySelector('.main');
    const toWinnerPageBtn = document.querySelector('.to-winners-btn');
    const toGaragePageBtn = document.querySelector('.to-garage-btn');
    toWinnerPageBtn?.addEventListener('click', () => this.toWinnersPage());
    toGaragePageBtn?.addEventListener('click', () => this.toGaragePage());
  }

  async toWinnersPage() {
    this.removeMainContent();
    this.main?.append(await this.winners.render());
  }

  toGaragePage() {
    this.removeMainContent();
    this.main?.append(this.garage.render());
  }

  removeMainContent() {
    if (this.main) this.main.innerHTML = '';
  }

  render() {
    return this.garage.render();
  }
}
