import { getTemplate } from './winners.view';

export class Winners {
  private root: HTMLElement = document.createElement('div');
  private template: string = getTemplate();

  get element() {
    return this.root;
  }

  constructor(private appRoot: HTMLElement | null) {}

  public init(): void {
    this.render();
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
}
