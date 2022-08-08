import { EngineService, ICar, IDrive, IEngineRequest } from '../../core';
import { getTemplate } from './car.view';

const TRACK_SPACE = 11 * 16; // distance

export class Car {
  private animationFrameId: number = 0;
  private svgElement: SVGSVGElement | null = null;
  private selectCarEvent = new CustomEvent('selectCar', { detail: { data: {} as ICar } });
  private deleteCarEvent = new CustomEvent('deleteCar', { detail: { data: {} as ICar } });
  private startBtn: HTMLButtonElement | null = null;
  private stopBtn: HTMLButtonElement | null = null;

  public get id(): number {
    return this.car.id;
  }

  public get color(): string {
    return this.car.color;
  }

  public get name(): string {
    return this.car.name;
  }

  constructor(private engineService: EngineService, private car: ICar, private root: HTMLElement) {}

  public updateCar(car: ICar): Car {
    this.car = car;
    this.render(car);
    return this; // returns this for using with Garage.updateCar()
  }

  public async start(): Promise<{ id: number; duration: number; name: string; color: string } | Error> {
    (<HTMLButtonElement>this.startBtn).disabled = true;
    (<HTMLButtonElement>this.stopBtn).disabled = false;

    const request: IEngineRequest = { id: this.car.id, status: 'started' };
    const { velocity, distance } = await this.engineService.startStop(request);
    const duration: number = distance / velocity;
    this.runCar(duration);
    return this.switchToDrive()
      .then(() => ({ id: this.car.id, duration, name: this.name, color: this.color }))
      .catch((error: Error) => {
        this.stopCar();
        return error;
      });
  }

  public async stop(): Promise<void> {
    (<HTMLButtonElement>this.startBtn).disabled = false;
    (<HTMLButtonElement>this.stopBtn).disabled = true;
    const request: IEngineRequest = { id: this.car.id, status: 'stopped' };
    this.stopCar();
    await this.engineService.startStop(request);
    (this.svgElement as SVGElement).style.transform = 'translateX(0px)';
  }

  public switchToDrive(): Promise<IDrive> {
    const request: IEngineRequest = { id: this.car.id, status: 'drive' };
    return this.engineService.switchToDrive(request);
  }

  public render(car?: ICar): void {
    const template: string = getTemplate(this.car);

    if (car) {
      // Re-render an existing car
      const container = document.getElementById(`${car.id}`);
      (container as HTMLElement).innerHTML = template;
    } else {
      // Or create a new one
      this.root.insertAdjacentHTML('beforeend', `<div class="app-car" id="${this.car.id}">${template}</div>`);
      this.listen();
    }

    const [element] = (document.getElementById(`${this.car.id}`) as HTMLElement).getElementsByTagName('svg');
    this.svgElement = element;

    const [startBtn, stopBtn] = <HTMLCollectionOf<HTMLButtonElement>>(
      document.getElementById(`control-btn-${this.id}`)?.getElementsByTagName('button')
    );
    this.startBtn = startBtn;
    this.stopBtn = stopBtn;
  }

  public destroy(): void {
    const container = document.getElementById(`${this.car.id}`);
    this.unlisten();
    container?.parentNode?.removeChild(container);
  }

  private listen(): void {
    const container: HTMLElement | null = document.getElementById(`${this.car.id}`);
    container?.addEventListener('click', this.onClick.bind(this));
  }

  private unlisten(): void {
    const container: HTMLElement | null = document.getElementById(`${this.car.id}`);
    container?.removeEventListener('click', this.onClick.bind(this));
  }

  private onClick(event: Event): void {
    const isSelect: boolean = (<HTMLElement>event.target).classList.contains('app-car-item__select-button');
    const isDelete: boolean = (<HTMLElement>event.target).classList.contains('app-car-item__delete-button');
    const isStart: boolean = (<HTMLElement>event.target).classList.contains('app-car-item__start-button');
    const isStop: boolean = (<HTMLElement>event.target).classList.contains('app-car-item__stop-button');
    if (isSelect) {
      this.selectCarEvent.detail.data = this.car;
      this.root?.dispatchEvent(this.selectCarEvent);
    } else if (isDelete) {
      this.deleteCarEvent.detail.data = this.car;
      this.root?.dispatchEvent(this.deleteCarEvent);
    } else if (isStart) {
      void this.start();
    } else if (isStop) {
      void this.stop();
    }
  }

  // Animation is based on https://learn.javascript.ru/js-animation
  private runCar(duration: number): void {
    const [{ clientWidth }] = document.getElementsByClassName('app-car');
    const distance: number = clientWidth - (this.svgElement as SVGElement).clientWidth - TRACK_SPACE;

    const start = performance.now();
    const draw = (progress: number) => {
      (this.svgElement as SVGElement).style.transform = `translateX(${progress * distance}px)`;
    };
    const timing = (timeFraction: number) => timeFraction;
    const animate = (time: number): void => {
      let timeFraction = (time - start) / duration;
      if (timeFraction > 1) {
        timeFraction = 1;
      }
      const progress = timing(timeFraction);
      draw(progress);
      if (timeFraction < 1) {
        this.animationFrameId = requestAnimationFrame(animate);
      }
    };
    this.animationFrameId = requestAnimationFrame(animate);
  }

  private stopCar() {
    cancelAnimationFrame(this.animationFrameId);
  }
}
