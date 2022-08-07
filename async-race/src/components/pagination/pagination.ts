import { IPagination, PaginationRole } from './models';
import { getTemplate } from './pagination.view';

export class Pagination {
  private template: string = getTemplate();
  private navEl: HTMLCollectionOf<HTMLButtonElement> | null = null;
  private state: IPagination = { garage: 0, winners: 0, selected: 'garage', maxGarage: 0, maxWinners: 0 };
  private paginationEvent = new CustomEvent('paginate');

  get garage(): number {
    return this.state.garage;
  }

  get winners(): number {
    return this.state.winners;
  }

  get selected(): 'garage' | 'winners' {
    return this.state.selected;
  }

  constructor(private root: HTMLElement) {}

  public init(): void {
    this.render();
    this.listen();
  }

  public setPage(value: 'garage' | 'winners'): void {
    this.state = { ...this.state, selected: value };
  }

  public updateMax(value: { maxGarage: number } | { maxWinners: number }): void {
    this.state = { ...this.state, ...value };
  }

  private render(): void {
    this.root.append(this.getHtml());
    this.navEl = <HTMLCollectionOf<HTMLButtonElement>>document.getElementById('pagination')?.getElementsByTagName('button');
  }

  private listen(): void {
    const [prevBtn, nextBtn] = <HTMLCollectionOf<HTMLButtonElement>>this.navEl;
    [prevBtn, nextBtn].forEach((btn) => btn.addEventListener('click', this.onClick.bind(this)));
  }

  private onClick(event: Event): void {
    const value: number = this.state[this.selected];
    const action = <PaginationRole>(event.target as HTMLElement).getAttribute('data-role');
    const max = this.state.selected === 'garage' ? this.state.maxGarage : this.state.maxWinners;
    switch (action) {
      case PaginationRole.Previous:
        this.state = { ...this.state, [this.selected]: value >= 1 ? value - 1 : value };
        break;
      case PaginationRole.Next:
        this.state = { ...this.state, [this.selected]: (max as number) > value + 1 ? value + 1 : value };
        break;
    }
    (<HTMLElement>document.querySelector('.app-garage')).dispatchEvent(this.paginationEvent);
  }

  private getHtml(): HTMLElement {
    const div = document.createElement('nav');
    div.innerHTML = this.template;
    return div;
  }
}
