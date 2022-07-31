import { BASE_COLOR } from '../../core';
import { Role } from './model';
import './car-controller.scss';

export function getTemplate(): string {
  return `<div class="btn-container">
            <div class="create-control">
              <div class="form" id="create">
                <input class="input" id="create-name" name="name" type="text">
                <input class="color" id="create-color" name="color" type="color" value="${BASE_COLOR}">
                <button class="button" disabled data-role="${Role.Create}">Create</button>
              </div>
              <div class="form" id="update">
                <input class="input" id="update-name" name="name" type="text" disabled>
              <input class="color" id="update-color" name="color" type="color" value="${BASE_COLOR}" disabled>
                <button class="button" disabled data-role="${Role.Update}">Update</button>
              </div>
            </div>
            <div class="race-control">
              <button class="button" id="race">Race</button>
              <button class="button" id="reset">Reset</button>
              <button class="button" id="generate" data-role="${Role.Generate}">Generate cars</button>
            </div>
          </div>
         `;
}
