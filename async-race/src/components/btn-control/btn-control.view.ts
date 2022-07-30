import './btn-control.scss';

export function getTemplate(): string {
  return `<div class="btn-container">
            <div class="create-control">
              <form class="form" id="create">
                <input class="input" id="create-name" name="name" type="text">
                <input class="color" id="create-color" name="color" type="color" value="#7fff00">
                <button class="button" type="submit">Create</button>
              </form>
              <form class="form" id="update">
                <input class="input" id="update-name" name="name" type="text" disabled>
              <input class="color" id="update-color" name="color" type="color" value="#7fff00" disabled>
                <button class="button" type="submit">Update</button>
              </form>
            </div>
            <div class="race-control">
              <button class="button" id="race">Race</button>
              <button class="button" id="reset">Reset</button>
              <button class="button" id="generator">Generate cars</button>
            </div>
          </div>
         `;
}
