import './garage.scss';

export function getTemplate(): string {
  return `
  <div class="app-garage">
    <h2 data-role="count"></h2>
    <h3 data-role="page"></h2>
  </div>
  <div data-role="pagination"></div>
  `;
}
