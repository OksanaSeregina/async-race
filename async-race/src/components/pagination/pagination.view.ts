import { PaginationRole } from './models';

export function getTemplate(): string {
  return `
    <div id="pagination">
      <button data-role="${PaginationRole.Previous}" class="page-link">Previous</button>
      <button data-role="${PaginationRole.Next}" class="page-link">Next</button>
    </div>
  `;
}
