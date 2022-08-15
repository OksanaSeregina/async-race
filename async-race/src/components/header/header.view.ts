import './header.scss';
import { HeaderRole } from './model';

export function getTemplate(): string {
  return `
  <div id="page-switcher">
    <a id="garage" data-role="${HeaderRole.Garage}" href="#">
      <span></span>
      <span></span>
      <span></span>
      <span></span>
      To garage
    </a>
    <a id="winners" data-role="${HeaderRole.Winners}" href="#">
      <span></span>
      <span></span>
      <span></span>
      <span></span>
      To winners
    </a>
</div>
  `;
}
