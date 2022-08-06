import { CarController, Garage, Header, Modal, Pagination } from './components';
import { Winners } from './pages';
import { isCustomEvent, renderCar } from './shared';

export class App {
  private body = <HTMLElement>document.querySelector('body');

  constructor(
    private root: HTMLElement,
    private header: Header,
    private garage: Garage,
    private winners: Winners,
    private pagination: Pagination,
    private modal: Modal
  ) {}

  public async start(): Promise<void> {
    await this.garage.init().then(() => new CarController(this.garage.element).init());
    this.header.init();
    this.winners.init();
    this.pagination.init();
    this.modal.init();

    this.listen();
    this.onRouteGarage(); //TODO
  }

  private listen(): void {
    this.root.addEventListener('routeGarage', this.onRouteGarage.bind(this));
    this.root.addEventListener('routeWinners', this.onRouteWinners.bind(this));
    (<HTMLElement>this.garage.element).addEventListener('completeRaceEvent', this.onCompleteRace.bind(this));
  }

  private onCompleteRace(event: Event): void {
    if (!isCustomEvent(event)) {
      throw new Error('Not a custom event');
    }
    const winners = (<{ data: { id: number; duration: number; name: string; color: string }[] }>event.detail).data;
    const tpl = winners
      .map(
        (winner, index) =>
          `<div class="win-win"><span>${index + 1}</span> ${renderCar(winner.id, winner.color, '5rem')} ${winner.name} <span>${(
            winner.duration / 1000
          ).toFixed(1)} s</span></div>`
      )
      .join('');
    this.modal.show('RACE RESULTS', tpl);
  }

  private onRouteGarage(): void {
    this.winners.element?.classList.remove('visible');
    this.winners.element?.classList.add('hidden');
    this.garage.element?.classList.add('visible');
    this.body?.classList.remove('winners');
    this.body?.classList.add('garage');
  }

  private onRouteWinners(): void {
    this.garage.element?.classList.remove('visible');
    this.garage.element?.classList.add('hidden');
    this.winners.element?.classList.add('visible');
    this.body?.classList.remove('garage');
    this.body?.classList.add('winners');
  }
}
