import { Modal, Pagination } from '../../components';
import { WINNERS_PER_PAGE, IWinners, WinnersService, ICar } from '../../core';
import { generateChunks, isCustomEvent } from '../../shared';
import { Data, Garage } from '../garage';
import { Sort } from './model';
import { getTemplate, getWinnerRow, getWinnerView } from './winners.view';

export class Winners {
  private root: HTMLElement = document.createElement('div');
  private template: string = getTemplate();
  private titleEl: HTMLElement | null = null;
  private pageEl: HTMLElement | null = null;
  private tableEl: HTMLElement | null = null;
  private chunks: Array<Array<IWinners>> = [];

  get element() {
    return this.root;
  }

  private _count: number = 0;
  get count(): number {
    return this._count;
  }
  set count(value: number) {
    this._count = value;
    if (this.titleEl) {
      this.titleEl.innerText = `Winners (${value})`;
    }
  }

  private _dbWinners: Array<IWinners> = [];
  get dbWinners(): Array<IWinners> {
    return this._dbWinners;
  }
  set dbWinners(value: Array<IWinners>) {
    this._dbWinners = value;
    this.count = this._dbWinners.length;
    this.chunks = generateChunks<IWinners>(this.dbWinners, WINNERS_PER_PAGE);
    this.updateView();
  }

  constructor(
    private appRoot: HTMLElement | null,
    private modal: Modal,
    private garage: Garage,
    private winnersService: WinnersService,
    private pagination: Pagination
  ) {}

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
    this.titleEl = <HTMLElement>document.querySelector('[data-role="winners"]');
    this.pageEl = <HTMLElement>document.querySelector('[data-role="winners-page"]');
    this.tableEl = <HTMLElement>document.querySelector('[data-role="winners-table"]');
  }

  private attachElement(): void {
    this.appRoot?.append(this.element);
  }

  private listen(): void {
    (<HTMLElement>this.garage.element).addEventListener('completeRace', this.onCompleteRace.bind(this));
    (<HTMLElement>this.garage.element).addEventListener('paginate', this.onPaginate.bind(this));
    (<HTMLElement>this.garage.element).addEventListener('updateCar', this.onUpdateCar.bind(this));
    (<HTMLElement>this.garage.element).addEventListener('deleteCar', this.onDeleteCar.bind(this));

    const [askWin, descWin] = <HTMLCollectionOf<HTMLButtonElement>>document.getElementById('wins')?.getElementsByTagName('button');
    const [askTime, descTime] = <HTMLCollectionOf<HTMLButtonElement>>document.getElementById('time')?.getElementsByTagName('button');
    [askWin, descWin, askTime, descTime].forEach((btn) => btn.addEventListener('click', this.onSort.bind(this)));
  }

  private onUpdateCar(event: Event): void {
    if (!isCustomEvent(event)) {
      throw new Error('Not a custom event');
    }
    const request: ICar = (<{ data: ICar }>event.detail).data;
    const index: number = this.dbWinners.findIndex((winner) => winner.id === request.id);
    if (index > -1) {
      const target: IWinners | undefined = this.dbWinners[index];
      this.dbWinners = [...this.dbWinners.slice(0, index), target, ...this.dbWinners.slice(index + 1)];
    }
  }

  private onSort(event: Event): void {
    const action = <Sort>(event.target as HTMLElement).getAttribute('data-role');
    switch (action) {
      case Sort.AskTime:
        this.dbWinners = this.dbWinners.sort((a, b) => a.time - b.time);
        break;
      case Sort.DeskTime:
        this.dbWinners = this.dbWinners.sort((a, b) => b.time - a.time);
        break;
      case Sort.AskWinnners:
        this.dbWinners = this.dbWinners.sort((a, b) => a.wins - b.wins);
        break;
      case Sort.DeskWinners:
        this.dbWinners = this.dbWinners.sort((a, b) => b.wins - a.wins);
        break;
    }
  }

  private onCompleteRace(event: Event): void {
    if (!isCustomEvent(event)) {
      throw new Error('Not a custom event');
    }
    const source = (<{ data: Data }>event.detail).data;
    const winner = { ...source, duration: Number((source.duration / 1000).toFixed(1)) };
    const { duration, id } = winner;
    if (id) {
      this.modal.show('RACE RESULTS', getWinnerView(winner));
      void this.updateWinners({ id, duration });
    }
  }

  private onDeleteCar(event: Event): void {
    if (!isCustomEvent(event)) {
      throw new Error('Not a custom event');
    }
    const request: IWinners = (<{ data: IWinners }>event.detail).data;
    const hasWinner: boolean = this.dbWinners.some((winner) => winner.id === request.id);
    if (hasWinner) {
      void this.deleteWinner(request);
    }
  }

  private async deleteWinner(request: IWinners): Promise<void> {
    await this.winnersService.deleteWinner(request.id).then(() => {
      const index: number = this.dbWinners.findIndex((winner) => winner.id === request.id);
      if (index > -1) {
        this.dbWinners = [...this.dbWinners.slice(0, index), ...this.dbWinners.slice(index + 1)];
      }
    });
  }

  private async updateWinners({ id, duration }: { id: number; duration: number }): Promise<void> {
    try {
      const winner = await this.winnersService.getWinner(id);
      const time = Number(duration) < Number(winner.time) ? duration : winner.time;
      const response = await this.winnersService.updateWinner({ id, time, wins: winner.wins + 1 });
      const index: number = this.dbWinners.findIndex((winner) => winner.id === id);
      if (index > -1) {
        this.dbWinners = [...this.dbWinners.slice(0, index), response, ...this.dbWinners.slice(index + 1)];
      }
    } catch {
      const request: IWinners = { id, wins: 1, time: duration };
      return this.winnersService.createWinner(request).then((winner) => {
        this.dbWinners = [...this.dbWinners, winner];
      });
    }
  }

  private onPaginate(event: Event): void {
    if (!isCustomEvent(event)) {
      throw new Error('Not a custom event');
    }
    void this.updateView();
  }

  private updateView() {
    this.pagination.updateMax({ maxWinners: this.chunks.length });
    const tpl = this.chunks[this.pagination.winners]
      ?.map((winner, index) => {
        const win = this.garage.cars.find((car) => car.id === winner.id);
        if (win) {
          const order: number = this.pagination.winners * WINNERS_PER_PAGE + index + 1;
          return getWinnerRow(order, win.color, win.name, winner.wins, winner.time);
        }
      })
      .join('');

    (<HTMLElement>this.tableEl).innerHTML = tpl || '';
    if (this.pageEl) {
      this.pageEl.innerText = `Page #${this.pagination.winners + 1}`;
    }
  }
}
