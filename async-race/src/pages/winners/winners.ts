import { Garage, Modal } from '../../components';
import { IWinners, WinnersService } from '../../core';
import { isCustomEvent, renderCar } from '../../shared';
import { getTemplate, getWinnerView } from './winners.view';

export class Winners {
  private root: HTMLElement = document.createElement('div');
  private template: string = getTemplate();
  private dbWinners: Array<IWinners> = [];

  get element() {
    return this.root;
  }

  constructor(private appRoot: HTMLElement | null, private modal: Modal, private garage: Garage, private winnersService: WinnersService) {}

  public async init(): Promise<void> {
    this.render();
    this.modal.init();
    await this.initWinners();

    this.listen();
  }

  private async initWinners(): Promise<void> {
    this.dbWinners = await this.winnersService.getWinners();
  }

  private render(): void {
    this.root.innerHTML = this.template;
    if (this.appRoot) {
      this.attachElement();
    }
  }

  private attachElement(): void {
    this.appRoot?.append(this.element);
  }

  private listen(): void {
    (<HTMLElement>this.garage.element).addEventListener('completeRaceEvent', this.onCompleteRace.bind(this));
  }

  private onCompleteRace(event: Event): void {
    if (!isCustomEvent(event)) {
      throw new Error('Not a custom event');
    }
    const winners = (<{ data: { id: number; duration: number; name: string; color: string }[] }>event.detail).data;
    const tpl = winners.map((winner, index) => getWinnerView(winner, index)).join('');
    this.modal.show('RACE RESULTS', tpl);

    const [{ duration, id }] = winners;
    void this.updateWinners({ id, duration });
  }

  private async updateWinners({ id, duration }: { id: number; duration: number }) {
    try {
      const winner = await this.winnersService.getWinner(id);
      const time = duration < winner.time ? duration : winner.time;
      await this.winnersService.updateWinner({ id, time, wins: winner.wins + 1 });
    } catch {
      const request: IWinners = { id, wins: 1, time: duration };
      return this.winnersService.createWinner(request).then((res) => {
        console.log(res);
      });
    }
  }
}
