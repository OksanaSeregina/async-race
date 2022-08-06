import { getTemplate } from './modal.view';

export class Modal {
  private template: string = getTemplate();
  private element: HTMLElement = document.createElement('div');
  private static _instance: Modal;
  private _isHidden: boolean = true;
  private modalElement: HTMLElement | null = null;
  private messageElement: HTMLElement | null = null;
  private closeButton: HTMLElement | null = null;

  static get instance() {
    return Modal._instance;
  }

  get isHidden() {
    return this._isHidden;
  }

  constructor(private root: HTMLElement | null) {
    if (!Modal._instance) {
      Modal._instance = this;
    }
    return Modal._instance;
  }

  public show(title = '', message: string): void {
    if (this.messageElement) {
      this._isHidden = false;
      this.messageElement.innerHTML = `<h2>${title}</h2>${message}`;
    }
    this.modalElement?.classList.remove('hidden');
  }

  public hide(): void {
    if (this.messageElement) {
      this._isHidden = true;
      this.messageElement.innerHTML = '';
    }
    this.modalElement?.classList.add('hidden');
  }

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
    this.root?.appendChild(this.element);
    this.modalElement = document.querySelector('[data-modal-id="modal"]');
    this.messageElement = document.querySelector('[data-modal-id="message"]');
    this.closeButton = document.querySelector('[data-modal-id="close"]');

    this.modalElement?.addEventListener('click', (event: MouseEvent) => {
      event.preventDefault();
      if (event.target === this.closeButton) {
        this.hide();
      }
    });
  }
}
