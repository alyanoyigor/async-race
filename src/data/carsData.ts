import { CarData } from 'interfaces';
export const carsData: CarData[] = [];
export const setCarsData = (array: CarData[]) => carsData.push(...array);
