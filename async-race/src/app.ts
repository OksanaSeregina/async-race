import { CarController, Garage, Header, Pagination } from './components';
import { Winners } from './pages';

export class App {
  constructor(private header: Header, private garage: Garage, private winners: Winners, private pagination: Pagination) {}

  public async start(): Promise<void> {
    // this.winners.init();
    await this.garage.init().then(() => new CarController(this.garage.element).init());
    this.header.init();
    this.pagination.init();
  }

  public static log(value: PromiseSettledResult<void | { id: number; duration: number }>[]): void {
    const log = value.filter((item) => item.status === 'fulfilled' && item.value);
    console.log(log);
  }
}
