import { EngineRepository, EngineService, GarageRepository, GarageService } from '../../core';
import { Winners } from '../../pages';
import { CarController, Garage } from '../../components';
import { getTemplate } from './header.view';

export class Header {
  constructor(private root: HTMLElement | null) {}

  private element: HTMLElement = document.createElement('header');
  private template: string = getTemplate();
  private garageService = new GarageService(new GarageRepository());
  private engineService = new EngineService(new EngineRepository());
  private garage: Garage = new Garage(this.garageService, this.engineService);
  private carControlller: CarController = new CarController(document.querySelector('.app-garage'));
  private winners: Winners = new Winners(document.querySelector('#root'));

  public init(): void {
    this.render();
    // this.listen();
  }

  private render(): void {
    this.element.innerHTML = this.template;
    if (this.root) {
      this.attachElement();
    }
  }

  private attachElement(): void {
    this.root?.prepend(this.element);
  }

  private listen(): void {
    const pageGarage: HTMLElement | null = document.getElementById('garage');
    const pageWinners: HTMLElement | null = document.getElementById('winners');

    [pageGarage, pageWinners].forEach((btn) => {
      btn?.addEventListener('click', (event: Event) => {
        const page = event.target;
        switch (page) {
          case pageGarage:
            void this.garage.init();
            this.carControlller.init();
            break;
          case pageWinners:
            this.winners.init();
            break;
        }
      });
    });
  }
}
