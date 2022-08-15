import { CAR_PER_PAGE, EngineService, GarageService, ICar, RANDOM_COUNT } from '../../core';
import { generateChunks, generateRandomColor, generateRandomName, isCustomEvent } from '../../shared';
import { Car, Pagination } from '../../components';
import { getTemplate } from './garage.view';

export type Data = { id: number; duration: number; name: string; color: string };

export class Garage {
  private root: HTMLElement | null = null;
  private titleEl: HTMLElement | null = null;
  private pageEl: HTMLElement | null = null;
  private chunks: Array<Array<Car>> = [];
  private isStopped: boolean = false;

  get element(): HTMLElement | null {
    return this.root;
  }

  private _count: number = 0;
  get count(): number {
    return this._count;
  }
  set count(value: number) {
    this._count = value;
    if (this.titleEl) {
      this.titleEl.innerText = `Garage (${value})`;
    }
  }

  private _cars: Array<Car> = [];
  get cars(): Array<Car> {
    return this._cars;
  }
  set cars(value: Array<Car>) {
    this._cars = value;
    this.count = this._cars.length;
    this.chunks = generateChunks<Car>(this.cars, CAR_PER_PAGE);
    this.updateView();
  }

  constructor(private garageService: GarageService, private engineService: EngineService, private pagination: Pagination) {}

  public async init(): Promise<void> {
    this.initGarage();
    await this.initCars();
    this.listen();
  }

  private async initCars(): Promise<void> {
    const dbCars: Array<ICar> = await this.garageService.getCars();
    const cars: Array<Car> = dbCars.map((car) => new Car(this.engineService, car, <HTMLElement>this.root));
    this.cars = [...this.cars, ...cars];
  }

  private initGarage(): void {
    const root: HTMLElement | null = document.getElementById('root');
    const template: string = getTemplate();
    (root as HTMLElement).innerHTML = template;

    this.root = <HTMLElement>document.querySelector('.app-garage');
    this.titleEl = <HTMLElement>document.querySelector('[data-role="count"]');
    this.pageEl = <HTMLElement>document.querySelector('[data-role="page"]');
  }

  private updateView(): void {
    this.pagination.updateMax({ maxGarage: this.chunks.length });
    this.cars.forEach((car) => car.destroy());
    this.chunks[this.pagination.garage]?.forEach((car) => car.render());
    if (this.pageEl) {
      this.pageEl.innerText = `Page #${this.pagination.garage + 1}`;
    }
  }

  private listen(): void {
    (<HTMLElement>this.root).addEventListener('createCar', this.onCreateCar.bind(this));
    (<HTMLElement>this.root).addEventListener('updateCar', this.onUpdateCar.bind(this));
    (<HTMLElement>this.root).addEventListener('deleteCar', this.onDeleteCar.bind(this));
    (<HTMLElement>this.root).addEventListener('generateCar', this.onGenerateCar.bind(this));
    (<HTMLElement>this.root).addEventListener('paginate', this.onPaginate.bind(this));
    (<HTMLElement>this.root).addEventListener('startRace', this.onStartRace.bind(this));
    (<HTMLElement>this.root).addEventListener('resetRace', this.onResetRace.bind(this));
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

  private onPaginate(event: Event): void {
    if (!isCustomEvent(event)) {
      throw new Error('Not a custom event');
    }
    void this.updateView();
  }

  private onStartRace(event: Event): void {
    if (!isCustomEvent(event)) {
      throw new Error('Not a custom event');
    }
    this.isStopped = false;
    const racers: Promise<Data | Error>[] = this.chunks[this.pagination.garage]?.map((car) => car.start());
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
    void Promise.any(racers).then((value) => {
      if (!this.isStopped) {
        this.root?.dispatchEvent(new CustomEvent('completeRace', { detail: { data: value as Data } }));
      }
    });
  }

  private onResetRace(event: Event): void {
    if (!isCustomEvent(event)) {
      throw new Error('Not a custom event');
    }
    this.isStopped = true;
    this.chunks[this.pagination.garage]?.forEach((car) => void car.stop());
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
  }
}
