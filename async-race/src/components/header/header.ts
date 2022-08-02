import { getTemplate } from './header.view';
import { HeaderRole } from './model';

export class Header {
  private garagePageEvent = new CustomEvent('routeGarage');
  private winnersPageEvent = new CustomEvent('routeWinners');

  constructor(private root: HTMLElement | null) {}

  private element: HTMLElement = document.createElement('header');
  private template: string = getTemplate();

  public init(): void {
    this.render();
    this.listen();
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
    const [garageBtn, winnersBtn] = <HTMLCollectionOf<HTMLAnchorElement>>(
      document.getElementById('page-switcher')?.getElementsByTagName('a')
    );
    [garageBtn, winnersBtn].forEach((btn) => btn.addEventListener('click', this.onClick.bind(this)));
  }

  private onClick(event: Event): void {
    event.preventDefault();
    const action = <HeaderRole>(event.target as HTMLElement).getAttribute('data-role');
    switch (action) {
      case HeaderRole.Garage:
        this.root?.dispatchEvent(this.garagePageEvent);
        break;
      case HeaderRole.Winners:
        this.root?.dispatchEvent(this.winnersPageEvent);
        break;
    }
  }
}
