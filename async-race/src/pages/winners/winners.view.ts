import './winners.scss';

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
