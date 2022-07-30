import { EngineService, GarageService, ICar } from '../../core';
import { generateRandomColor, generateRandomName, isCustomEvent } from '../../shared';
import { Car } from '../car';
import { getTemplate } from './garage.view';

export class Garage {
  private root: HTMLElement | null = null;
  private cars: Array<Car> = [];

  constructor(private garageService: GarageService, private engineService: EngineService) {}

  public async init(): Promise<void> {
    this.initGarage();
    await this.initCars();
    this.listen();
  }

  private async initCars(): Promise<void> {
    const dbCars: Array<ICar> = await this.garageService.getCars();
    const cars: Array<Car> = dbCars.map((car) => new Car(this.engineService, car, <HTMLElement>this.root));
    this.cars = [...this.cars, ...cars];
    this.cars.forEach((car) => car.render());
  }

  private initGarage(): void {
    const root: HTMLElement | null = document.getElementById('root');
    const template: string = getTemplate();
    (root as HTMLElement).innerHTML = template;
    this.root = <HTMLElement>document.querySelector('.app-garage');
  }

  private listen(): void {
    (this.root as HTMLElement).addEventListener('updateCar', (event: Event) => {
      if (!isCustomEvent(event)) {
        throw new Error('Not a custom event');
      }
      const request: ICar = (<{ data: ICar }>event.detail).data;
      void this.updateCar(request);
      // TODO: Generates random color only. Have to be updated.
    });

    (this.root as HTMLElement).addEventListener('deleteCar', (event: Event) => {
      if (!isCustomEvent(event)) {
        throw new Error('Not a custom event');
      }
      const request: ICar = (<{ data: ICar }>event.detail).data;
      void this.deleteCar(request);
    });

    const createCarButton: HTMLButtonElement | null = document.querySelector('.app-car-item__create-button');

    createCarButton?.addEventListener('click', () => {
      const request: Omit<ICar, 'id'> = { name: generateRandomName(), color: generateRandomColor() };
      void this.createCar(request);
    });
  }

  private async updateCar(request: ICar): Promise<void> {
    const response = await this.garageService.updateCar({ ...request, color: generateRandomColor() });
    const index: number = this.cars.findIndex((car) => car.id === request.id);
    if (index > -1) {
      const target: Car | undefined = this.cars[index];
      this.cars = [...this.cars.slice(0, index), target.updateCar(response), ...this.cars.slice(index + 1)];
    }
  }

  private async deleteCar(request: ICar): Promise<void> {
    await this.garageService.deleteCar(request.id);
    const index: number = this.cars.findIndex((car) => car.id === request.id);
    if (index > -1) {
      const target: Car | undefined = this.cars[index];
      this.cars = [...this.cars.slice(0, index), ...this.cars.slice(index + 1)];
      target.destroy();
    }
  }

  private async createCar(request: Omit<ICar, 'id'>): Promise<void> {
    const response = await this.garageService.createCar(request);
    const car: Car = new Car(this.engineService, response, <HTMLElement>this.root);
    this.cars = [...this.cars, car];
    car.render();
  }
}