import './header.scss';

export function getTemplate(): string {
  return `
  <a id="garage" href="#">
  <span></span>
  <span></span>
  <span></span>
  <span></span>
  To garage
</a>
<a id="winners" href="#">
  <span></span>
  <span></span>
  <span></span>
  <span></span>
  To winners
</a>
  `;
}
