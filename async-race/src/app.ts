import { CarController, Garage, Header } from './components';
import { Winners } from './pages';

export class App {
  constructor(private header: Header, private garage: Garage, private winners: Winners) {}

  public async start(): Promise<void> {
    // this.winners.init();

    await this.garage.init();
    new CarController(this.garage.element).init();
    this.header.init();
  }
}
