import { CarImg } from 'components/CarImg/CarImg';
import { Title } from 'components/Title/Title';
import { carsData } from 'data/carsData';
import { setWinCarsData, winnerCarsData } from 'data/winnerCarsData';
import { WinnerCarData } from 'interfaces';
import { WINNERS_URL } from 'urls';
import { createHTMLElement } from 'utils';
export class Winners {
  container: HTMLElement;
  tBody: HTMLElement;
  START_NUM_PAGE: number;
  CURRENT_PAGE: number;
  RECORDS_PER_PAGE: number;
  pageNum: HTMLElement;
  title: HTMLElement;

  constructor() {
    this.START_NUM_PAGE = 1;
    this.CURRENT_PAGE = 1;
    this.RECORDS_PER_PAGE = 10;

    const headsOfTable = [
      { name: '№', isSorted: false },
      { name: 'Car Image', isSorted: false },
      { name: 'Car Name', isSorted: false },
      { name: 'Wins', isSorted: true, param: 'wins', isDesc: true },
      { name: 'Best time', isSorted: true, param: 'time', isDesc: true },
    ];

    this.title = new Title('Winners', winnerCarsData.length, ['winners-count']).render();
    const winnersPageTitle = createHTMLElement('h3', ['list-cars__title']);
    winnersPageTitle.textContent = 'Page#';
    this.pageNum = createHTMLElement('span', ['winners-page-num']);
    this.pageNum.textContent = this.CURRENT_PAGE.toString();

    winnersPageTitle.append(this.pageNum);

    this.container = createHTMLElement('div', ['container']);
    const table = createHTMLElement('table', ['table']);
    const tHead = createHTMLElement('thead', ['table-dark']);

    const headTr = document.createElement('tr');
    headsOfTable.forEach((headName) => {
      const th = document.createElement('th');
      th.setAttribute('scope', 'col');
      th.textContent = headName.name;
      if (headName.isSorted && headName.param) {
        th.addEventListener('click', () =>
          this.sortColumn(
            headName.param as keyof WinnerCarData, // I don't know how to avoid as in this case
            (headName.isDesc = !headName.isDesc)
          )
        );
        th.classList.add('active-table-column');
      }
      headTr.append(th);
    });

    tHead.append(headTr);

    this.tBody = document.createElement('tbody');

    const pageBtns = createHTMLElement('div', ['list-cars__btns']);
    const prevBtn = createHTMLElement('button', ['btn', 'btn-outline-primary']);
    prevBtn.textContent = 'Prev';
    prevBtn.addEventListener('click', () => this.prevPage());
    const nextBtn = createHTMLElement('button', ['btn', 'btn-primary']);
    nextBtn.textContent = 'Next';
    nextBtn.addEventListener('click', () => this.nextPage());
    pageBtns.append(prevBtn, nextBtn);

    table.append(tHead, this.tBody);
    this.container.append(this.title, winnersPageTitle, table, pageBtns);
  }

  sortColumn(param: keyof WinnerCarData, isDesc: boolean) {
    winnerCarsData.sort((a, b) => a[param] - b[param]);
    if (isDesc) winnerCarsData.reverse();
    this.changePage(this.CURRENT_PAGE);
  }

  addElementsToTable(car: WinnerCarData, i: number) {
    const trBody = document.createElement('tr');
    const th = document.createElement('th');
    th.textContent = (i + 1).toString();

    const carImgTd = document.createElement('td');
    carImgTd.innerHTML = CarImg();
    const curCarData = carsData.find((carData) => carData.id === car.id);
    const carImg: HTMLElement | null = carImgTd.querySelector('#car-color');
    if (carImg && curCarData) carImg.style.fill = curCarData.color;

    const carNameTd = document.createElement('td');
    if (curCarData) carNameTd.textContent = curCarData.name;

    const winsTd = document.createElement('td');
    winsTd.textContent = car.wins.toString();

    const bestTimeTd = document.createElement('td');
    bestTimeTd.textContent = car.time.toString();

    trBody.append(th, carImgTd, carNameTd, winsTd, bestTimeTd);
    this.tBody.append(trBody);
  }

  async deleteWinnerCar(carId: number) {
    try {
      await fetch(WINNERS_URL + carId, {
        method: 'DELETE',
      });
    } catch (e) {
      console.log(e);
    }
  }

  updateWinnerCarsData() {
    const filteredWinCars = winnerCarsData.filter(async (winCar: WinnerCarData) => {
      if (!carsData.find((carData) => carData.id === winCar.id)) {
        await this.deleteWinnerCar(winCar.id);
        return false;
      }
      return true;
    });
    setWinCarsData(filteredWinCars);
  }

  async getWinnerCars() {
    try {
      const data = await fetch(WINNERS_URL);
      const cars = await data.json();
      cars.forEach(async (car: WinnerCarData) => {
        winnerCarsData.find((winCar: WinnerCarData) => car.id === winCar.id)
          ? null
          : winnerCarsData.push(car);
      });
      this.updateWinnerCarsData();
    } catch (e) {
      console.log(e);
    }
  }

  updateWinnersCount() {
    const winnersCount = this.title.querySelector('.winners-count');
    if (winnersCount) winnersCount.textContent = `(${winnerCarsData.length.toString()})`;
  }

  async changePage(page: number) {
    
    if (page < this.START_NUM_PAGE) {
      page = this.START_NUM_PAGE;
    }
    if (page > this.pagesCount() - this.START_NUM_PAGE) {
      page = this.pagesCount();
    }
    this.changePageNumber(page);
    this.tBody.innerHTML = '';
    await this.getWinnerCars();
    for (let i = (page - this.START_NUM_PAGE) * this.RECORDS_PER_PAGE; i < page * this.RECORDS_PER_PAGE; i++) {
      this.updateWinnersCount();
      if (winnerCarsData[i]) this.addElementsToTable(winnerCarsData[i], i);
    }
  }

  changePageNumber(page: number) {
    this.pageNum.textContent = page.toString();
  }

  prevPage() {
    if (this.CURRENT_PAGE > this.START_NUM_PAGE) {
      this.CURRENT_PAGE--;
      this.changePage(this.CURRENT_PAGE);
    }
  }

  nextPage() {
    if (this.CURRENT_PAGE < this.pagesCount()) {
      this.CURRENT_PAGE++;
      this.changePage(this.CURRENT_PAGE);
    }
  }

  pagesCount() {
    let allCars = winnerCarsData.length;
    if (allCars < this.START_NUM_PAGE) allCars = this.START_NUM_PAGE;
    return Math.ceil(allCars / this.RECORDS_PER_PAGE);
  }

  async render() {
    this.changePage(this.CURRENT_PAGE);
    return this.container;
  }
}
