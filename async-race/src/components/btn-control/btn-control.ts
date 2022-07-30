import { getTemplate } from './btn-control.view';

export class BtnControl {
  constructor(private root: HTMLElement | null) {}

  private element: HTMLElement = document.createElement('div');
  private template: string = getTemplate();

  public init(): void {
    this.render();
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
}