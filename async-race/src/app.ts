import { CarController, Header, Pagination } from './components';
import { Garage, Winners } from './pages';

export class App {
  private body = <HTMLElement>document.querySelector('body');

  constructor(
    private root: HTMLElement,
    private header: Header,
    private garage: Garage,
    private winners: Winners,
    private pagination: Pagination
  ) {}

  public async start(): Promise<void> {
    await this.garage.init().then(() => new CarController(this.garage.element).init());
    await this.winners.init();
    this.header.init();
    this.pagination.init();

    this.listen();
    this.onRouteGarage();
  }

  private listen(): void {
    this.root.addEventListener('routeGarage', this.onRouteGarage.bind(this));
    this.root.addEventListener('routeWinners', this.onRouteWinners.bind(this));
  }

  private onRouteGarage(): void {
    this.winners.element?.classList.remove('visible');
    this.winners.element?.classList.add('hidden');
    this.garage.element?.classList.remove('hidden');
    this.garage.element?.classList.add('visible');
    this.body?.classList.remove('winners');
    this.body?.classList.add('garage');
    this.pagination.setPage('garage');
  }

  private onRouteWinners(): void {
    this.garage.element?.classList.remove('visible');
    this.garage.element?.classList.add('hidden');
    this.winners.element?.classList.remove('hidden');
    this.winners.element?.classList.add('visible');
    this.body?.classList.remove('garage');
    this.body?.classList.add('winners');
    this.pagination.setPage('winners');
  }
}
