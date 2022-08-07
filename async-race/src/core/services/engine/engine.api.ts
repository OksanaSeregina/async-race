import { Endpoints } from '../../constants';
import { IDrive, IEngine } from '../models';

/**
 * Engine Api service
 */
export class EngineApi {
  private static _instance: EngineApi;

  constructor() {
    if (!EngineApi._instance) {
      EngineApi._instance = this;
    }
    return EngineApi._instance;
  }

  /**
   * Starts or stops engine of specified car, and returns it's actual velocity and distance.
   */
  public startStop(query: string): Promise<IEngine> {
    return fetch(`${Endpoints.AppHost}/engine?${query}`, {
      method: 'PATCH',
    }).then((res) => res.json());
  }

  /**
   * Switches engine of specified car to drive mode.
   */
  public switchToDrive(query: string): Promise<IDrive> {
    return fetch(`${Endpoints.AppHost}/engine?${query}`, {
      method: 'PATCH',
    }).then((res) => res.json());
  }
}
