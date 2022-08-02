import { BASE_COLOR, ICar } from '../../core';
import { isCustomEvent } from '../../shared';
import { getTemplate } from './car-controller.view';
import { Role } from './model';

export class CarController {
  private element: HTMLElement = document.createElement('div');
  private template: string = getTemplate();
  private createEl: HTMLCollectionOf<HTMLInputElement> | null = null;
  private updateEl: HTMLCollectionOf<HTMLInputElement> | null = null;
  private id: number | undefined = undefined;
  private createCarEvent = new CustomEvent('createCar', { detail: { data: {} as Omit<ICar, 'id'> } });
  private updateCarEvent = new CustomEvent('updateCar', { detail: { data: {} as ICar } });
  private generateCarEvent = new CustomEvent('generateCar');
  private raceCarEvent = new CustomEvent('startRace');
  private resetCarEvent = new CustomEvent('resetRace');

  constructor(private root: HTMLElement | null) {}

  public init(): void {
    this.render();
    this.listen();
  }

  private render(): void {
    this.element.innerHTML = this.template;
    if (this.root) {
      this.attachElement();
    }
    this.createEl = <HTMLCollectionOf<HTMLInputElement>>document.getElementById('create')?.getElementsByTagName('input');
    this.updateEl = <HTMLCollectionOf<HTMLInputElement>>document.getElementById('update')?.getElementsByTagName('input');
  }

  private attachElement(): void {
    this.root?.prepend(this.element);
  }

  private listen(): void {
    const [createName] = <HTMLCollectionOf<HTMLInputElement>>this.createEl;
    const [updateName, updateColor] = <HTMLCollectionOf<HTMLInputElement>>this.updateEl;
    const [createBtn] = <HTMLCollectionOf<HTMLInputElement>>document.getElementById('create')?.getElementsByTagName('button');
    const [updateBtn] = <HTMLCollectionOf<HTMLInputElement>>document.getElementById('update')?.getElementsByTagName('button');
    const [raceBtn, resetBtn, generateBtn] = <HTMLCollectionOf<HTMLButtonElement>>(
      document.getElementById('control')?.getElementsByTagName('button')
    );

    createName.addEventListener('input', () => (createBtn.disabled = !createName.value));
    updateName.addEventListener('input', () => [updateName, updateColor, updateBtn].forEach((el) => (el.disabled = !updateName.value)));
    [createBtn, updateBtn, raceBtn, resetBtn, generateBtn].forEach((btn) => btn.addEventListener('click', this.onClick.bind(this)));
    this.root?.addEventListener('selectCar', this.onSelect.bind(this));
  }

  private onSelect(event: Event): void {
    const [name, color] = <HTMLCollectionOf<HTMLInputElement>>this.updateEl;
    if (!isCustomEvent(event)) {
      throw new Error('Not a custom event');
    }
    this.id = (<{ data: ICar }>event.detail).data.id;
    this.update(name, (<{ data: ICar }>event.detail).data.name);
    this.update(color, (<{ data: ICar }>event.detail).data.color);
  }

  private onClick(event: Event): void {
    const [createElName, createElColor] = <HTMLCollectionOf<HTMLInputElement>>this.createEl;
    const [updateElName, updateElColor] = <HTMLCollectionOf<HTMLInputElement>>this.updateEl;
    const action = <Role>(event.target as HTMLElement).getAttribute('data-role');
    switch (action) {
      case Role.Create:
        this.createCarEvent.detail.data = { name: createElName.value, color: createElColor.value };
        this.update(createElName);
        this.update(createElColor, BASE_COLOR);
        this.root?.dispatchEvent(this.createCarEvent);
        break;
      case Role.Update:
        this.updateCarEvent.detail.data = { name: updateElName.value, color: updateElColor.value, id: <number>this.id };
        this.update(updateElName);
        this.update(updateElColor, BASE_COLOR);
        this.root?.dispatchEvent(this.updateCarEvent);
        break;
      case Role.Generate:
        this.root?.dispatchEvent(this.generateCarEvent);
        break;
      case Role.Race:
        this.root?.dispatchEvent(this.raceCarEvent);
        break;
      case Role.Reset:
        this.root?.dispatchEvent(this.resetCarEvent);
        break;
    }
  }

  private update(element: HTMLInputElement, value = ''): void {
    element.value = value;
    element.dispatchEvent(new Event('input'));
  }
}
