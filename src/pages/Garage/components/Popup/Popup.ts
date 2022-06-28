import { carsData } from 'data/carsData';
import { CarData } from 'interfaces';
import { GARAGE_URL } from 'urls';
import { createHTMLElement, RGBToHex } from 'utils';
import './index.scss';

export class Popup {
  popupContainer: HTMLElement;
  closePopupBtn: HTMLElement;
  newCarName: string | null;
  newCarColor: string | null;
  elemWithText: HTMLElement;
  elemWithColor: HTMLElement | null;
  carId: number;

  constructor(elemWithText: HTMLElement, elemWithColor: HTMLElement | null, carId: number) {
    this.carId = carId;
    this.elemWithText = elemWithText;
    this.elemWithColor = elemWithColor;

    this.popupContainer = createHTMLElement('div', ['popup-wrapper']);
    const popup = createHTMLElement('div', ['popup']);

    const popupTitle = createHTMLElement('h4', ['popup__title']);
    popupTitle.textContent = 'Change Car';

    const formPopup = createHTMLElement('form', ['change-car']);
    const inputContainer = createHTMLElement('div', ['input-wrapper']);

    const inputText = document.createElement('input');
    inputText.classList.add('form-control', 'form-control-sm', 'change-car__input-text');
    inputText.setAttribute('placeholder', 'Name the car');
    if (elemWithText.textContent) inputText.value = elemWithText.textContent;
    this.newCarName = elemWithText.textContent;

    inputText.addEventListener('change', (e) => this.changeCarName(e));

    const inputColor = document.createElement('input');
    inputColor.classList.add('form-control', 'form-control-sm', 'change-car__input-color');
    inputColor.setAttribute('type', 'color');
    if (elemWithColor) inputColor.value = RGBToHex(elemWithColor.style.fill);
    this.newCarColor = inputColor.value;
    inputColor.addEventListener('change', (e) => this.changeCarColor(e));

    inputContainer.append(inputText, inputColor);

    const updateBtn = createHTMLElement('button', ['btn', 'btn-primary', 'btn-sm']);
    updateBtn.textContent = 'Update';
    updateBtn.addEventListener('click', (e) => this.updateCarParams(e));

    formPopup.append(inputContainer, updateBtn);

    this.closePopupBtn = createHTMLElement('button', ['popup__close-btn']);
    this.closePopupBtn.addEventListener('click', () => this.removePopup());

    popup.append(this.closePopupBtn, popupTitle, formPopup);
    this.popupContainer.append(popup);
  }

  changeCarName(e: Event) {
    const value = e.target instanceof HTMLInputElement ? e.target.value : null;
    this.newCarName = value;
  }

  changeCarColor(e: Event) {
    const value = e.target instanceof HTMLInputElement ? e.target.value : null;
    this.newCarColor = value;
  }

  async updateCarParams(e: Event) {
    e.preventDefault();
    this.elemWithText.textContent = this.newCarName;
    if (this.elemWithColor && this.newCarColor) this.elemWithColor.style.fill = this.newCarColor;
    this.removePopup();
    const curCar = carsData.find((car: CarData) => car.id === this.carId);
    if (curCar && this.newCarName && this.newCarColor) {
      curCar.color = this.newCarColor;
      curCar.name = this.newCarName;
    }
    try {
      await fetch(GARAGE_URL + this.carId, {
        method: 'PUT',
        headers: {
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: this.newCarName, color: this.newCarColor }),
      });
    } catch (e) {
      console.log(e);
    }
  }

  removePopup() {
    this.popupContainer.remove();
  }

  render() {
    return this.popupContainer;
  }
}
