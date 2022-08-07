import { renderCar } from '../../shared';
import { Sort } from './model';
import './winners.scss';

export function getWinnerView(winner: { id: number; duration: number; name: string; color: string }, index: number) {
  return `<div class="win-win"><span>${index + 1}</span> ${renderCar(winner.color, '5rem')} ${winner.name} <span>${
    winner.duration
  } s</span></div>`;
}

export function getWinnerRow(order: number, color: string, name: string, wins: number, time: number) {
  return `<tr>
            <td>${order}</td>
            <td>${renderCar(color, '5rem')}</td>
            <td>${name}</td>
            <td>${wins}</td>
            <td>${time}</td>
          </tr>`;
}

export function getTemplate() {
  return `
          <h1 class="txt-center" data-role="winners"></h1>
          <h2 class="txt-center" data-role="winners-page"></h2>
          <table class="table txt-center">
            <thead>
              <th>Number</th>
              <th>Car</th>
              <th>Name</th>
              <th class="table-sort wins" id="wins">Wins
                <button data-role="${Sort.AskWinnners}">asc</button>
                <button data-role="${Sort.DeskWinners}">desc</button></th>
              <th class="table-sort time" id="time">
                Best time <button data-role="${Sort.AskTime}">asc</button> <button data-role="${Sort.DeskTime}">desc</button></th>
            </thead>
            <tbody data-role="winners-table">
            </tbody>
          </table>
         `;
}
