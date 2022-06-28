import { ENGINE_URL } from 'urls/index';
import { CarImg } from 'components/CarImg/CarImg';
import { createHTMLElement } from 'utils';
import flagImgPath from 'assets/svg/flag.svg';
import { Popup } from 'pages/Garage/components/Popup/Popup';
import './index.scss';

export class Car {
  carName: string;
  carColor: string;
  carId: number;
  private carContainer: HTMLElement;
  private removeCarBtn: HTMLElement;
  private changeCarBtn: HTMLElement;
  private carNameTxt: HTMLElement;
  private moveCarElem: HTMLElement;
  private moveCarBtns: HTMLElement;
  private moveCarBtn: HTMLElement;
  private stopCarBtn: HTMLElement;
  private moveCarStart: HTMLElement;
  private carChangeColor: HTMLElement | null;
  private carImg: HTMLElement | null;
  private animation: Animation | undefined;
  MILLISECONDS_IN_SECOND: number;
  NUM_SEPARATOR: number;

  constructor(carName: string, carColor: string, carId: number) {
    this.MILLISECONDS_IN_SECOND = 1000;
    this.NUM_SEPARATOR = 100;
    this.animation;
    this.carName = carName;
    this.carColor = carColor;
    this.carId = carId;

    this.carContainer = createHTMLElement('div', ['car']);
    this.carContainer.setAttribute('id', this.carId.toString());

    const carToolbar = createHTMLElement('div', ['car-toolbar']);
    const changeCarBtns = createHTMLElement('div', ['car-change-btns']);
    this.changeCarBtn = createHTMLElement('button', ['btn', 'btn-success', 'btn-sm']);
    this.changeCarBtn.textContent = 'Change';
    this.changeCarBtn.addEventListener('click', () => this.changeCar());
    this.removeCarBtn = createHTMLElement('button', [
      'btn',
      'btn-outline-danger',
      'btn-sm',
      'remove-car-btn',
    ]);
    this.removeCarBtn.textContent = 'Remove';
    changeCarBtns.append(this.changeCarBtn, this.removeCarBtn);
    this.carNameTxt = createHTMLElement('p', ['h6', 'car__name']);
    this.carNameTxt.textContent = this.carName;
    carToolbar.append(changeCarBtns, this.carNameTxt);

    this.moveCarElem = createHTMLElement('div', ['move-car']);
    this.moveCarStart = createHTMLElement('div', ['move-car__start']);
    this.moveCarBtns = createHTMLElement('div', ['move-car__btns']);
    this.moveCarBtn = createHTMLElement('button', ['btn', 'btn-dark', 'btn-sm', 'move-car-btn']);
    this.moveCarBtn.textContent = 'A';
    this.moveCarBtn.addEventListener('click', () => this.moveCar());
    this.stopCarBtn = createHTMLElement('button', ['btn', 'btn-light', 'btn-sm', 'stop-car-btn']);
    this.stopCarBtn.textContent = 'B';
    this.disableBtn(this.stopCarBtn);
    this.stopCarBtn.addEventListener('click', () => this.backCarToStartPosition());
    this.moveCarBtns.append(this.moveCarBtn, this.stopCarBtn);
    const carImgContainer = createHTMLElement('div', ['car-img-container']);
    carImgContainer.innerHTML = CarImg();
    this.carImg = carImgContainer.querySelector('#car-img');
    this.carChangeColor = carImgContainer.querySelector('#car-color');
    if (this.carChangeColor) this.carChangeColor.style.fill = this.carColor;
    this.moveCarStart.append(this.moveCarBtns, carImgContainer);

    const moveCarFinish = createHTMLElement('div', ['move-car__finish']);
    const flagImgContainer = createHTMLElement('div', ['flag-finish']);
    const flagImg = document.createElement('img');
    flagImg.src = flagImgPath.toString();
    flagImg.alt = '';
    flagImgContainer.append(flagImg);
    moveCarFinish.append(flagImgContainer);

    this.moveCarElem.append(this.moveCarStart, moveCarFinish);

    this.carContainer.append(carToolbar, this.moveCarElem);
  }

  async backCarToStartPosition() {
    try {
      await fetch(ENGINE_URL + `?id=${this.carId}&status=stopped`, {
        method: 'PATCH',
      });
    } catch (e) {
      console.log(e);
    }
    const moveCarBtn = this.getCarBtn('move');
    const stopCarBtn = this.getCarBtn('stop');
    if (moveCarBtn) this.undisableBtn(moveCarBtn);
    if (stopCarBtn) this.disableBtn(stopCarBtn);
    this.animation?.cancel();
  }

  async startCarEngine() {
    try {
      const request = await fetch(ENGINE_URL + `?id=${this.carId}&status=started`, {
        method: 'PATCH',
      });
      const velocityAndDistance = request.ok ? await request.json() : null;
      return velocityAndDistance;
    } catch (e) {
      console.log(e);
    }
  }

  disableBtn(elem: HTMLElement) {
    return elem.setAttribute('disabled', '');
  }

  undisableBtn(elem: HTMLElement) {
    return elem.removeAttribute('disabled');
  }

  driveCar() {
    fetch(ENGINE_URL + `?id=${this.carId}&status=drive`, { method: 'PATCH' }).then((response) => {
      if (!response.ok) {
        this.animation?.pause();
      }
    });
  }

  getCarBtn(motionType: string) {
    const car: HTMLElement | null = document.querySelector(`[id='${this.carId}']`);
    const moveCarBtn: HTMLElement | null | undefined = car?.querySelector(`.${motionType}-car-btn`);
    return moveCarBtn;
  }

  async moveCar() {
    try {
      const start = await this.startCarEngine();
      const animation = this.animateCar(start?.distance / start?.velocity);
      this.driveCar();
      const moveCarBtn = this.getCarBtn('move');
      const stopCarBtn = this.getCarBtn('stop');
      if (moveCarBtn) this.disableBtn(moveCarBtn);
      if (stopCarBtn) this.undisableBtn(stopCarBtn);
      await animation?.finished;
      const isWinnerExist =
        animation?.currentTime && animation.currentTime / this.MILLISECONDS_IN_SECOND;
      const winSeconds = isWinnerExist
        ? Math.round(isWinnerExist * this.NUM_SEPARATOR) / this.NUM_SEPARATOR
        : null;
      return { id: this.carId, time: winSeconds };
    } catch (e) {
      console.log(e);
    }
  }

  animateCar(duration: number) {
    const car: HTMLElement | null = document.querySelector(`[id='${this.carId}']`);
    const carStart: HTMLElement | null | undefined = car?.querySelector('.move-car__start');
    const carImg = car?.querySelector('#car-img');
    if (car && carStart) {
      this.animation = carImg?.animate(
        [{ left: 0 }, { left: `${car.offsetWidth - carStart.offsetWidth}px` }],
        {
          duration,
          iterations: 1,
          direction: 'alternate',
          fill: 'forwards',
        }
      );
    }
    return this.animation;
  }

  changeCar() {
    const popup = new Popup(this.carNameTxt, this.carChangeColor, this.carId);
    this.carContainer.append(popup.render());
  }

  render(): HTMLElement {
    return this.carContainer;
  }
}
