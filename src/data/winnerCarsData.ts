import { WinnerCarData } from 'interfaces';
export const winnerCarsData: WinnerCarData[] = [];
export const setWinCarsData = (array: WinnerCarData[]) => winnerCarsData.push(...array);
