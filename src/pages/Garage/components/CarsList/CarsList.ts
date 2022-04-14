import { CarData } from 'interfaces';
import { carsData, setCarsData } from 'data/carsData';
import { Car } from 'pages/Garage/components/Car/Car';
import { GARAGE_URL } from 'urls';
import { createHTMLElement, updateCarsAmountHTML } from 'utils';
import './index.scss';

export class CarsList {
  private static instance: CarsList;
  carsList: HTMLElement;
  listBtns: HTMLElement;
  carsContainer: HTMLElement;
  pageNum: HTMLElement;
  CURRENT_PAGE: number;
  COUNT_ID: number;
  START_NUM_PAGE: number;
  RECORDS_PER_PAGE: number;
  carsArr: Car[];

  constructor() {
    this.START_NUM_PAGE = 1;
    this.CURRENT_PAGE = 1;
    this.RECORDS_PER_PAGE = 7;
    this.COUNT_ID = carsData.length;
    this.carsArr = [];
    this.carsList = createHTMLElement('div', ['list-cars']);

    const carsListTitle = createHTMLElement('h3', ['list-cars__title']);
    carsListTitle.textContent = 'Page#';
    this.pageNum = createHTMLElement('span', ['page-num']);
    this.pageNum.textContent = this.CURRENT_PAGE.toString();
    carsListTitle.append(this.pageNum);

    this.carsList.append(carsListTitle);

    this.carsContainer = createHTMLElement('div', ['cars']);
    this.carsContainer.addEventListener('click', (e) => this.removeCar(e));
    this.listBtns = createHTMLElement('div', ['list-cars__btns']);
    const prevBtn = createHTMLElement('button', ['btn', 'btn-outline-primary']);
    prevBtn.textContent = 'Prev';
    prevBtn.addEventListener('click', () => this.prevPage());
    const nextBtn = createHTMLElement('button', ['btn', 'btn-primary']);
    nextBtn.textContent = 'Next';
    nextBtn.addEventListener('click', () => this.nextPage());
    this.listBtns.append(prevBtn, nextBtn);
  }

  async removeCar(e: Event) {
    const el = e.target instanceof HTMLElement ? e.target.closest('.remove-car-btn') : null;
    if (el) {
      const car: HTMLElement | null = el.closest('.car');
      const carId = car ? car.id : null;
      const carsDataWithoutEl = carsData.filter((carData: CarData) =>
        carId ? +carData.id !== +carId : true
      );
      if (carId) this.carsArr = this.carsArr.filter((car) => car.carId.toString() !== carId);
      setCarsData(carsDataWithoutEl);
      try {
        await fetch(GARAGE_URL + carId, {
          method: 'DELETE',
        });
      } catch (e) {
        console.log(e);
      }
      updateCarsAmountHTML();
      car?.remove();
      this.changePage(this.CURRENT_PAGE);
    }
  }

  public static getInstance(): CarsList {
    if (!CarsList.instance) {
      CarsList.instance = new CarsList();
    }
    return CarsList.instance;
  }

  async getDefaultCars() {
    try {
      const data = await fetch(GARAGE_URL);
      const cars = await data.json();
      return cars;
    } catch (e) {
      console.log(e);
    }
  }

  changePage(page: number) {
    if (page < this.START_NUM_PAGE) {
      page = this.START_NUM_PAGE;
    }
    if (page > this.pagesCount() - this.START_NUM_PAGE) {
      page = this.pagesCount();
    }
    this.changePageNumber(page);
    this.carsContainer.innerHTML = '';
    this.carsArr = [];
    for (
      let i = (page - this.START_NUM_PAGE) * this.RECORDS_PER_PAGE;
      i < page * this.RECORDS_PER_PAGE;
      i++
    ) {
      if (carsData[i]) {
        const car = new Car(carsData[i].name, carsData[i].color, carsData[i].id);
        this.carsArr.push(car);
        this.carsContainer.append(car.render());
      }
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
    let allCars = carsData.length;
    if (allCars < this.START_NUM_PAGE) allCars = this.START_NUM_PAGE;
    return Math.ceil(allCars / this.RECORDS_PER_PAGE);
  }

  render(): HTMLElement {
    this.getDefaultCars().then((cars: CarData[]) => {
      cars.forEach((car: CarData) => {
        const auto = new Car(car.name, car.color, car.id);
        this.carsContainer.append(auto.render());
        if (!carsData.find((carData: CarData) => carData.id === car.id)) {
          this.carsArr.push(auto);
          carsData.push({ name: car.name, color: car.color, id: car.id });
        }
        this.COUNT_ID = carsData.length;
        this.changePage(this.CURRENT_PAGE);
      });
      updateCarsAmountHTML();
      this.carsList.append(this.carsContainer);
      this.carsList.append(this.listBtns);
    });
    return this.carsList;
  }
}
