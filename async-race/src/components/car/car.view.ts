import { ICar } from '../../core';
import { renderCar } from '../../shared';
import './car.scss';

export function getTemplate(car: ICar): string {
  const { name, color } = car;
  return `
      <div class="app-car-item__edit">
        <button class="app-car-item__select-button car-button">Select</button>
        <button class="app-car-item__delete-button car-button">Delete</button>
        <h3>${name}</h3>
      </div>
      <div class="app-car-item">
        <div class="app-car-item__control">
          <button class="app-car-item__start-button car-button">Start</button>
          <button class="app-car-item__stop-button car-button">Stop</button>
        </div>
        ${renderCar(color, '5rem')}
        <svg class="flag"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          xmlns:xlink="http://www.w3.org/1999/xlink"
          x="0px"
          y="0px"
          viewBox="0 0 464.329 464.329"
          style="enable-background: new 0 0 464.329 464.329"
          xml:space="preserve"
        >
          <path
            d="M342.007,117.408l66.418-99.628c1.023-1.534,1.118-3.507,0.248-5.133c-0.87-1.625-2.564-2.641-4.408-2.641H88.202V5
            c0-2.761-2.239-5-5-5H60.064c-2.761,0-5,2.239-5,5v454.329c0,2.761,2.239,5,5,5h23.138c2.761,0,5-2.239,5-5V224.81h316.063
            c1.844,0,3.538-1.015,4.408-2.641c0.87-1.626,0.775-3.599-0.248-5.133L342.007,117.408z M78.202,454.329H65.064V224.81h13.138
            V454.329z M88.202,214.81V62.787c0-2.761-2.239-5-5-5s-5,2.239-5,5V214.81H65.064V10h13.138v22.768c0,2.761,2.239,5,5,5s5-2.239,5-5
            V20.006h306.72l-63.084,94.628c-1.12,1.679-1.12,3.868,0,5.547l63.084,94.628H88.202z"
          />
      </div>
      `;
}
