import { renderCar } from '../../shared';
import './winners.scss';

export function getWinnerView(winner: { id: number; duration: number; name: string; color: string }, index: number) {
  return `<div class="win-win"><span>${index + 1}</span> ${renderCar(winner.id, winner.color, '5rem')} ${winner.name} <span>${(
    winner.duration / 1000
  ).toFixed(1)} s</span></div>`;
}

export function getTemplate() {
  return `
          <h1 class="txt-center">Winners 1</h1>
          <h2 class="txt-center">Page #1</h2>
          <table class="table txt-center">
            <thead>
              <th>Number</th>
              <th>Car</th>
              <th>Name</th>
              <th class="table-sort wins">Wins</th>
              <th class="table-sort time">Best time</th>
            </thead>
            <tbody>
              <tr>
                <td>1</td>
                <td>svg</td>
                <td>Audi</td>
                <td>4</td>
                <td>3.07</td>
              </tr>
            </tbody>
          </table>
         `;
}
