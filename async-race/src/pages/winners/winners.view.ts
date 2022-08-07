import { renderCar } from '../../shared';
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
              <th class="table-sort wins">Wins</th>
              <th class="table-sort time">Best time</th>
            </thead>
            <tbody data-role="winners-table">
            </tbody>
          </table>
         `;
}
