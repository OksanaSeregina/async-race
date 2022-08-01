import { EngineService, GarageService, ICar } from '../../core';
import { generateRandomColor, generateRandomName, isCustomEvent } from '../../shared';
import { Car } from '../car';
import { getTemplate } from './garage.view';

const RANDOM_COUNT = 100;

export class Garage {
  private root: HTMLElement | null = null;
  private title: HTMLElement | null = null;

  get element(): HTMLElement | null {
    return this.root;
  }

  private _count: number = 0;
  get count(): number {
    return this._count;
  }
  set count(value: number) {
    this._count = value;
    if (this.title) {
      this.title.innerText = `Garage (${value})`;
    }
  }

  private _cars: Array<Car> = [];
  get cars(): Array<Car> {
    return this._cars;
  }
  set cars(value: Array<Car>) {
    this._cars = value;
    this.count = this._cars.length;
  }

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
    this.title = <HTMLElement>document.querySelector('[data-role="count"]');
  }

  private listen(): void {
    (<HTMLElement>this.root).addEventListener('createCar', this.onCreateCar.bind(this));
    (<HTMLElement>this.root).addEventListener('updateCar', this.onUpdateCar.bind(this));
    (<HTMLElement>this.root).addEventListener('deleteCar', this.onDeleteCar.bind(this));
    (<HTMLElement>this.root).addEventListener('generateCar', this.onGenerateCar.bind(this));
  }

  private onCreateCar(event: Event): void {
    if (!isCustomEvent(event)) {
      throw new Error('Not a custom event');
    }
    void this.createCar((<{ data: Omit<ICar, 'id'> }>event.detail).data);
  }

  private onUpdateCar(event: Event): void {
    if (!isCustomEvent(event)) {
      throw new Error('Not a custom event');
    }
    const request: ICar = (<{ data: ICar }>event.detail).data;
    void this.updateCar(request);
  }

  private onDeleteCar(event: Event): void {
    if (!isCustomEvent(event)) {
      throw new Error('Not a custom event');
    }
    const request: ICar = (<{ data: ICar }>event.detail).data;
    void this.deleteCar(request);
  }

  private onGenerateCar(event: Event): void {
    if (!isCustomEvent(event)) {
      throw new Error('Not a custom event');
    }
    for (let i = 0; i < RANDOM_COUNT; i++) {
      const request: Omit<ICar, 'id'> = { name: generateRandomName(), color: generateRandomColor() };
      void this.createCar(request);
    }
  }

  private async updateCar(request: ICar): Promise<void> {
    const response = await this.garageService.updateCar(request);
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
