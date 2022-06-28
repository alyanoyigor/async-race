import { carsData } from 'data/carsData';

export const updateCarsAmountHTML = () => {
  const carsDataHTML: HTMLElement | null = document.querySelector('.cars-count');
  if (carsDataHTML) carsDataHTML.textContent = `(${carsData.length})`;
};
