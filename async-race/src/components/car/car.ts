import { EngineService, ICar, IEngineRequest } from '../../core';
import { getTemplate } from './car.view';

const updateCarEvent = new CustomEvent('updateCar', {
  detail: { data: {} as ICar },
  bubbles: true,
  cancelable: true,
});

const deleteCarEvent = new CustomEvent('deleteCar', {
  detail: { data: {} as ICar },
  bubbles: true,
  cancelable: true,
});

export class Car {
  private animationFrameId: number = 0;
  private svgElement: SVGSVGElement | null = null;

  constructor(private engineService: EngineService, private car: ICar, private root: HTMLElement) {}

  public get id(): number {
    return this.car.id;
  }

  public updateCar(car: ICar): Car {
    this.car = car;
    this.render(car);
    return this; // returns this for using with Garage.updateCar()
  }

  public async start(): Promise<void> {
    const request: IEngineRequest = {
      id: this.car.id,
      status: 'started',
    };
    const { velocity, distance } = await this.engineService.startStop(request);
    const duration: number = distance / velocity;
    this.runCar(duration);
    await this.switchToDrive();
  }

  public async stop(): Promise<void> {
    const request: IEngineRequest = {
      id: this.car.id,
      status: 'stopped',
    };
    this.stopCar();
    await this.engineService.startStop(request);
    (this.svgElement as SVGElement).style.transform = 'translateX(0px)';
  }

  public async switchToDrive(): Promise<void> {
    try {
      const request: IEngineRequest = {
        id: this.car.id,
        status: 'drive',
      };
      await this.engineService.switchToDrive(request);
    } catch {
      this.stopCar();
    }
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
  }

  public destroy(): void {
    const container = document.getElementById(`${this.car.id}`);
    container?.parentNode?.removeChild(container);
  }

  private listen(): void {
    const container: HTMLElement | null = document.getElementById(`${this.car.id}`);
    container?.addEventListener('click', (event) => {
      const isUpdate: boolean = (event.target as HTMLElement)?.classList.contains('app-car-item__update-button');
      const isDelete: boolean = (event.target as HTMLElement)?.classList.contains('app-car-item__delete-button');
      const isStart: boolean = (event.target as HTMLElement)?.classList.contains('app-car-item__start-button');
      const isStop: boolean = (event.target as HTMLElement)?.classList.contains('app-car-item__stop-button');

      if (isUpdate) {
        updateCarEvent.detail.data = this.car;
        container.dispatchEvent(updateCarEvent);
      } else if (isDelete) {
        deleteCarEvent.detail.data = this.car;
        container.dispatchEvent(deleteCarEvent);
      } else if (isStart) {
        void this.start();
      } else if (isStop) {
        void this.stop();
      }
    });
  }

  // Animation is based on https://learn.javascript.ru/js-animation
  private runCar(duration: number): void {
    const [{ clientWidth }] = document.getElementsByClassName('app-car');
    const distance: number = clientWidth - (this.svgElement as SVGElement).clientWidth;

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
