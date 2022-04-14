import { GARAGE_URL, WINNERS_URL } from 'urls';
import { carsData } from 'data/carsData';
import { createHTMLElement, updateCarsAmountHTML } from 'utils';
import { CarsList } from '../CarsList/CarsList';
import './index.scss';
import { Car } from 'pages/Garage/components/Car/Car';
import { CarData, WinnerCarData } from 'interfaces';
import { setWinCarsData, winnerCarsData } from 'data/winnerCarsData';

export class GarageToolbar {
  garageToolbar: HTMLElement;
  winnerPopup: HTMLElement;
  winnerPopupTitle: HTMLElement;
  closePopupBtn: HTMLElement;
  inputText: HTMLInputElement;
  carName: string | null;
  carColor: string | null;
  GENERATE_CARS_AMOUNT: number;
  MAX_COLOR_VALUE: number;
  carBrandsArr: string[];
  carModelsArr: string[];

  constructor() {
    this.GENERATE_CARS_AMOUNT = 100;
    this.MAX_COLOR_VALUE = 0xffffff;

    this.carBrandsArr = [
      'Audi',
      'BMW',
      'Bentley',
      'Chevrolet',
      'Honda',
      'Lexus',
      'Nissan',
      'Tesla',
      'Toyota',
      'Rolls-Royce',
    ];
    this.carModelsArr = [
      '3 Series',
      '5 Series',
      '7 Series',
      'X1',
      'X3',
      'X4',
      'X5',
      'X7',
      '3 Series GT',
      '6 Series GT',
      'Model S',
      'Model X',
      'Model 3',
      'Model Y',
    ];
    this.garageToolbar = createHTMLElement('div', ['garage-toolbar']);
    const formToolbar = createHTMLElement('form', ['add-car']);
    const inputContainer = createHTMLElement('div', ['car-input']);

    this.inputText = document.createElement('input');
    this.inputText.classList.add('form-control', 'form-control-sm', 'add-car__input-text');
    this.inputText.setAttribute('placeholder', 'Name the car');
    this.carName = this.inputText.value;
    this.inputText.addEventListener('change', (e) => this.setCarName(e));
    inputContainer.append(this.inputText);

    const inputColor = document.createElement('input');
    inputColor.classList.add('form-control', 'form-control-sm', 'add-car__input-color');
    inputColor.setAttribute('type', 'color');
    this.carColor = inputColor.value;
    inputColor.addEventListener('change', (e) => this.setCarColor(e));

    const createCarBtn = createHTMLElement('button', ['btn', 'btn-primary']);
    createCarBtn.textContent = 'Create';
    createCarBtn.addEventListener('click', (e) => this.createCarFromForm(e));
    formToolbar.append(inputContainer, inputColor, createCarBtn);

    const raceBtns = createHTMLElement('div', ['race-btns']);
    const raceBtn = createHTMLElement('button', ['btn', 'btn-success']);
    raceBtn.textContent = 'Race';
    raceBtn.addEventListener('click', () => this.raceCars());
    const resetBtn = createHTMLElement('button', ['btn', 'btn-danger']);
    resetBtn.textContent = 'Reset';
    resetBtn.addEventListener('click', () => this.resetCars());
    const generateNewCarsBtn = createHTMLElement('button', ['btn', 'btn-secondary']);
    generateNewCarsBtn.textContent = 'Generate New Cars';
    generateNewCarsBtn.addEventListener('click', () => this.generateNewCars());
    raceBtns.append(raceBtn, resetBtn, generateNewCarsBtn);

    this.winnerPopup = createHTMLElement('div', ['winner-popup', 'hide']);
    const popupWrapper = createHTMLElement('div', ['winner-popup__wrapper']);
    this.winnerPopupTitle = createHTMLElement('h3', ['winner-popup__title']);
    this.closePopupBtn = createHTMLElement('button', ['popup__close-btn']);
    this.closePopupBtn.addEventListener('click', () => this.hideWinnerPopup());
    popupWrapper.append(this.closePopupBtn, this.winnerPopupTitle);
    this.winnerPopup.append(popupWrapper);

    this.garageToolbar.append(formToolbar, raceBtns, this.winnerPopup);
  }

  showWinnerPopup(carName: string, seconds: number | null | undefined) {
    this.winnerPopupTitle.textContent = `Winner of Race: ${carName} (${seconds} seconds)`;
    this.winnerPopup.classList.remove('hide');
  }

  hideWinnerPopup() {
    this.winnerPopup.classList.add('hide');
  }

  async raceCars() {
    try {
      const carsList = CarsList.getInstance();
      const data = await Promise.race(
        carsList.carsArr.map(async (car: Car) => await car.moveCar())
      );
      const winnerCar = carsData.find((el: CarData) => el.id === data?.id);
      if (winnerCar) this.showWinnerPopup(winnerCar.name, data?.time);

      const winnerCarData = winnerCarsData.find((el: WinnerCarData) => el.id === data?.id);

      if (winnerCarData) {
        winnerCarData.wins++;
        if (data?.time && data?.time < winnerCarData.time) winnerCarData.time = data?.time;
        this.updateWinnerCar(data?.id, winnerCarData);
      } else {
        let winnerData: WinnerCarData | null = null;
        if (data && data.time && winnerCar) winnerData = { id: data.id, time: data.time, wins: 1 };
        this.setWinnerCar(winnerData);
        winnerData ? winnerCarsData.push(winnerData) : null;
      }
    } catch (e) {
      console.log(e);
    }
  }

  async setWinnerCar(winnerData: WinnerCarData | null) {
    try {
      await fetch(WINNERS_URL, {
        method: 'POST',
        headers: {
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(winnerData),
      });
    } catch (e) {
      console.log(e);
    }
  }

  async updateWinnerCar(id: number | undefined, winnerCarData: WinnerCarData) {
    try {
      await fetch(WINNERS_URL + id, {
        method: 'PUT',
        headers: {
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ time: winnerCarData.time, wins: winnerCarData.wins }),
      });
    } catch (e) {
      console.log(e);
    }
  }

  resetCars() {
    const carsList = CarsList.getInstance();
    carsList.carsArr.forEach((car: Car) => {
      car.backCarToStartPosition();
    });
  }

  setCarName(e: Event) {
    const value = e.target instanceof HTMLInputElement ? e.target.value : null;
    this.carName = value;
    this.inputText.value = '';
  }

  setCarColor(e: Event) {
    const value = e.target instanceof HTMLInputElement ? e.target.value : null;
    this.carColor = value;
  }

  getRandomElementFromArray(arr: string[]) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  getRandomColor() {
    return `#${Math.floor(Math.random() * +this.MAX_COLOR_VALUE.toString(10)).toString(16)}`;
  }

  generateNewCars() {
    for (let i = 0; i < this.GENERATE_CARS_AMOUNT; i++) {
      this.createNewCar(
        `${this.getRandomElementFromArray(this.carBrandsArr)} ${this.getRandomElementFromArray(
          this.carModelsArr
        )}`,
        this.getRandomColor()
      );
    }
  }

  createCarFromForm(e: Event) {
    e.preventDefault();
    const carName = this.carName ? this.carName : '';
    const carColor = this.carColor ? this.carColor : '';
    this.createNewCar(carName, carColor);
  }

  async createNewCar(name: string, color: string) {
    const carsList = CarsList.getInstance();
    carsList.COUNT_ID++;
    const carObjData = { name, color, id: carsList.COUNT_ID };
    carsList.carsArr.push(new Car(name, color, carsList.COUNT_ID));
    carsData.push({ name, color, id: carsList.COUNT_ID });
    carsList.changePage(carsList.CURRENT_PAGE);
    updateCarsAmountHTML();
    try {
      await fetch(GARAGE_URL, {
        method: 'POST',
        headers: {
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(carObjData),
      });
    } catch (e) {
      console.log(e);
    }
  }

  render() {
    return this.garageToolbar;
  }
}
