import { BaseComponent } from '../base-component';
import { getTemplate } from './modal.view';

export class Modal extends BaseComponent {
  private static _instance: Modal;
  private _isHidden: boolean = true;
  private modalElement: HTMLElement | null = null;
  private messageElement: HTMLElement | null = null;
  private closeButton: HTMLElement | null = null;

  protected element: HTMLElement = document.createElement('div');
  protected template: string = getTemplate();

  static get instance() {
    return Modal._instance;
  }

  get isHidden() {
    return this._isHidden;
  }

  constructor(root: HTMLElement | null) {
    super(root);
    if (!Modal._instance) {
      Modal._instance = this;
    }
    return Modal._instance;
  }

  public show(message: string): void {
    if (this.messageElement) {
      this._isHidden = false;
      this.messageElement.textContent = message;
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

  protected attachElement(): void {
    super.attachElement();
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
